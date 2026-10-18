import { devProbe } from "./dev-monitor/client";
import type { DevEvent } from "./dev-monitor/contract";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";

export type CoreBrowserSession = {
  port: number;
  webSocketDebuggerUrl: string;
};

export function shouldAutoCloseCoreBrowserSession(invocation?: { mode?: string; action?: string }) {
  return invocation?.mode !== "configure";
}

type ManagedSession = CoreBrowserSession & {
  child: ChildProcess;
  monitorCorrelation?: DevEvent["correlation"];
  poolKey?: string;
  active?: boolean;
  idleTimer?: ReturnType<typeof setTimeout>;
  interactive?: boolean;
};

export type BrowserSessionManagerDependencies = {
  reservePort: () => Promise<number>;
  browserVersion: (port: number) => Promise<string | undefined>;
  closeThroughCdp: (webSocketDebuggerUrl: string) => Promise<boolean>;
  loadUnpackedExtension: (
    webSocketDebuggerUrl: string,
    extensionDirectory: string,
  ) => Promise<string>;
  spawnChrome: typeof spawn;
  startupTimeoutMs: number;
  pollIntervalMs: number;
  idleTimeoutMs: number;
  maxRetainedSessions: number;
  shutdownTimeoutMs: number;
};

async function reserveLoopbackPort() {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

function chromeCandidates(explicit?: unknown) {
  const requested = typeof explicit === "string" ? explicit.trim() : "";
  const candidates = [
    requested,
    process.env.PROGRAMFILES
      ? path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe")
      : "",
    process.env["PROGRAMFILES(X86)"]
      ? path.join(
          process.env["PROGRAMFILES(X86)"]!,
          "Google",
          "Chrome",
          "Application",
          "chrome.exe",
        )
      : "",
    process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe")
      : "",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
  ].filter(Boolean);
  return [...new Set(candidates)].filter((candidate) => existsSync(candidate));
}

async function browserVersion(port: number) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return undefined;
    const value = (await response.json()) as { webSocketDebuggerUrl?: string };
    return value.webSocketDebuggerUrl ? value.webSocketDebuggerUrl : undefined;
  } catch {
    return undefined;
  }
}

async function closeThroughCdp(webSocketDebuggerUrl: string) {
  if (typeof WebSocket !== "function") return false;
  return new Promise<boolean>((resolve) => {
    const socket = new WebSocket(webSocketDebuggerUrl);
    const timeout = setTimeout(() => {
      socket.close();
      resolve(false);
    }, 2_000);
    timeout.unref();
    socket.addEventListener("open", () =>
      socket.send(JSON.stringify({ id: 1, method: "Browser.close" })),
    );
    socket.addEventListener("message", (event) => {
      let response: { id?: number; error?: unknown };
      try {
        response = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (response.id !== 1) return;
      clearTimeout(timeout);
      socket.close();
      resolve(!response.error);
    });
    socket.addEventListener("error", () => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

async function loadUnpackedExtension(webSocketDebuggerUrl: string, extensionDirectory: string) {
  if (typeof WebSocket !== "function") {
    throw Object.assign(new Error("WebSocket indisponível para instalar a Browser Bridge."), {
      code: "BRIDGE_MISSING",
    });
  }
  const resolvedDirectory = path.resolve(extensionDirectory);
  if (!existsSync(path.join(resolvedDirectory, "manifest.json"))) {
    throw Object.assign(
      new Error("A pasta da ContentFlow Browser Bridge não está disponível neste computador."),
      { code: "BRIDGE_MISSING" },
    );
  }
  return new Promise<string>((resolve, reject) => {
    const socket = new WebSocket(webSocketDebuggerUrl);
    const timeout = setTimeout(() => {
      socket.close();
      reject(
        Object.assign(
          new Error("Tempo esgotado ao instalar a ContentFlow Browser Bridge no Chrome."),
          { code: "BRIDGE_MISSING" },
        ),
      );
    }, 15_000);
    timeout.unref();
    socket.addEventListener("open", () =>
      socket.send(
        JSON.stringify({
          id: 1,
          method: "Extensions.loadUnpacked",
          params: { path: resolvedDirectory },
        }),
      ),
    );
    socket.addEventListener("message", (event) => {
      let response: { id?: number; error?: { message?: string }; result?: { id?: string } };
      try {
        response = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (response.id !== 1) return;
      clearTimeout(timeout);
      socket.close();
      const extensionId = response.result?.id;
      if (response.error || typeof extensionId !== "string" || !extensionId) {
        reject(
          Object.assign(
            new Error(
              response.error?.message ||
                "Não foi possível instalar a ContentFlow Browser Bridge neste perfil do Chrome.",
            ),
            { code: "BRIDGE_MISSING" },
          ),
        );
        return;
      }
      resolve(extensionId);
    });
    socket.addEventListener("error", () => {
      clearTimeout(timeout);
      reject(
        Object.assign(new Error("Falha de CDP ao instalar a ContentFlow Browser Bridge."), {
          code: "BRIDGE_MISSING",
        }),
      );
    });
  });
}

export class BrowserSessionManager {
  private readonly dependencies: BrowserSessionManagerDependencies;
  private readonly sessions = new Map<string, ManagedSession>();
  private readonly interactiveSessions = new Map<string, ManagedSession>();
  private readonly opening = new Set<string>();
  private readonly closing = new Map<string, Promise<boolean>>();

  constructor(dependencies: Partial<BrowserSessionManagerDependencies> = {}) {
    this.dependencies = {
      reservePort: reserveLoopbackPort,
      browserVersion,
      closeThroughCdp,
      loadUnpackedExtension,
      spawnChrome: spawn,
      // A managed profile can cold-start Chrome and its shared Bridge extension
      // together. Fifteen seconds was short enough to classify a slow but
      // healthy profile as unavailable, especially after a Windows restart.
      startupTimeoutMs: 45_000,
      pollIntervalMs: 250,
      idleTimeoutMs: 10 * 60_000,
      maxRetainedSessions: 2,
      shutdownTimeoutMs: 10_000,
      ...dependencies,
    };
  }

  async open(input: {
    monitorCorrelation?: DevEvent["correlation"];
    profileDirectory: string;
    browserBridgeDirectory?: string;
    chromeExecutable?: unknown;
    visible?: boolean;
    signal?: AbortSignal;
    reusable?: boolean;
  }): Promise<ManagedSession> {
    if (input.signal?.aborted)
      throw Object.assign(new Error("Execução cancelada."), { code: "CANCELLED" });
    const key = path.resolve(input.profileDirectory);
    await this.closing.get(key);
    const existing = this.sessions.get(key) ?? this.interactiveSessions.get(key);
    if (this.opening.has(key) || existing?.active)
      throw Object.assign(new Error("Perfil de navegador ocupado."), { code: "LEASE_UNAVAILABLE" });
    if (existing) {
      clearTimeout(existing.idleTimer);
      existing.active = true;
      const endpoint = await this.dependencies.browserVersion(existing.port);
      if (endpoint === existing.webSocketDebuggerUrl && !input.signal?.aborted) {
        existing.monitorCorrelation = input.monitorCorrelation;
        if (input.browserBridgeDirectory) {
          await this.dependencies.loadUnpackedExtension(
            existing.webSocketDebuggerUrl,
            input.browserBridgeDirectory,
          );
        }
        return existing;
      }
      existing.active = false;
      if (input.signal?.aborted)
        throw Object.assign(new Error("Execução cancelada."), { code: "CANCELLED" });
      // A missing probe is not evidence that Chrome exited. Preserve the browser
      // and its profile rather than closing it or launching a competing instance.
      if (existing.child.exitCode === null || endpoint) {
        this.armIdleExpiration(existing);
        throw Object.assign(new Error("O navegador não respondeu. A sessão foi preservada."), {
          code: "BRIDGE_DISCONNECTED",
        });
      }
      await this.close(existing);
    }
    this.opening.add(key);
    try {
      const session = await this.launch(input);
      session.poolKey = key;
      session.active = true;
      session.interactive = input.reusable === false;
      (session.interactive ? this.interactiveSessions : this.sessions).set(key, session);
      return session;
    } finally {
      this.opening.delete(key);
    }
  }

  private async launch(input: {
    monitorCorrelation?: DevEvent["correlation"];
    profileDirectory: string;
    browserBridgeDirectory?: string;
    chromeExecutable?: unknown;
    visible?: boolean;
    signal?: AbortSignal;
  }): Promise<ManagedSession> {
    const executable = chromeCandidates(input.chromeExecutable)[0];
    if (!executable)
      throw Object.assign(new Error("Google Chrome não foi localizado."), {
        code: "INVALID_CONFIGURATION",
      });
    const port = await this.dependencies.reservePort();
    const args = [
      `--remote-debugging-port=${port}`,
      "--remote-debugging-address=127.0.0.1",
      `--user-data-dir=${input.profileDirectory}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1280,800",
      "about:blank",
    ];
    if (input.browserBridgeDirectory) {
      // Branded Chrome ignores --load-extension; keep it for Chromium / Chrome for Testing.
      // --enable-unsafe-extension-debugging unlocks Extensions.loadUnpacked over CDP.
      args.splice(
        args.length - 1,
        0,
        "--enable-unsafe-extension-debugging",
        `--load-extension=${input.browserBridgeDirectory}`,
      );
    }
    if (input.visible === false) {
      args.unshift(
        "--start-minimized",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=CalculateNativeWinOcclusion",
      );
    }
    const child = this.dependencies.spawnChrome(executable, args, {
      stdio: "ignore",
      windowsHide: false,
      shell: false,
    });
    const probe = devProbe("profiles", "browser-session-manager");
    const correlation = { ...input.monitorCorrelation, instanceId: String(child.pid ?? port) };
    if (probe.enabled)
      probe.emit({
        kind: "instance.created",
        entity: { type: "instance", id: correlation.instanceId },
        correlation,
        payload: { status: "created" },
      });
    const abort = () => child.kill();
    input.signal?.addEventListener("abort", abort, { once: true });
    try {
      const deadline = Date.now() + this.dependencies.startupTimeoutMs;
      while (Date.now() < deadline) {
        if (input.signal?.aborted)
          throw Object.assign(new Error("Execução cancelada."), { code: "CANCELLED" });
        if (child.exitCode !== null) throw new Error("O Chrome encerrou durante a inicialização.");
        const webSocketDebuggerUrl = await this.dependencies.browserVersion(port);
        if (webSocketDebuggerUrl) {
          if (input.browserBridgeDirectory) {
            await this.dependencies.loadUnpackedExtension(
              webSocketDebuggerUrl,
              input.browserBridgeDirectory,
            );
          }
          if (probe.enabled)
            probe.emit({
              kind: "instance.ready",
              entity: { type: "instance", id: correlation.instanceId },
              correlation,
              payload: { status: "ready" },
            });
          return { port, webSocketDebuggerUrl, child, monitorCorrelation: correlation };
        }
        await new Promise((resolve) => setTimeout(resolve, this.dependencies.pollIntervalMs));
      }
      throw new Error("O Chrome não ficou pronto dentro do tempo esperado.");
    } catch (error) {
      if (probe.enabled)
        probe.emit({
          kind: "instance.crashed",
          entity: { type: "instance", id: correlation.instanceId },
          correlation,
          payload: { status: "crashed" },
        });
      child.kill();
      throw error;
    } finally {
      input.signal?.removeEventListener("abort", abort);
    }
  }

  async close(session: ManagedSession) {
    if (session.poolKey) {
      const pending = this.closing.get(session.poolKey);
      if (pending) return pending;
      clearTimeout(session.idleTimer);
      const closing = this.closeProcess(session);
      this.closing.set(session.poolKey, closing);
      try {
        const closed = await closing;
        if (closed) {
          if (this.sessions.get(session.poolKey) === session) this.sessions.delete(session.poolKey);
          if (this.interactiveSessions.get(session.poolKey) === session)
            this.interactiveSessions.delete(session.poolKey);
        }
        session.active = false;
        return closed;
      } finally {
        this.closing.delete(session.poolKey);
      }
    }
    return await this.closeProcess(session);
  }

  async release(session: ManagedSession) {
    if (session.interactive) {
      session.active = false;
      return;
    }
    if (!session.poolKey || this.sessions.get(session.poolKey) !== session) {
      await this.close(session);
      return;
    }
    session.active = false;
    // Map insertion order is the last-use order; evict idle sessions only.
    this.sessions.delete(session.poolKey);
    this.sessions.set(session.poolKey, session);
    while (this.sessions.size > this.dependencies.maxRetainedSessions) {
      const oldest = [...this.sessions.values()].find((candidate) => !candidate.active);
      if (!oldest) break;
      if (!(await this.close(oldest))) break;
    }
    if (this.sessions.get(session.poolKey) === session) {
      this.armIdleExpiration(session);
    }
  }

  private armIdleExpiration(session: ManagedSession) {
    if (session.interactive) return;
    clearTimeout(session.idleTimer);
    session.idleTimer = setTimeout(() => {
      void this.close(session);
    }, this.dependencies.idleTimeoutMs);
    session.idleTimer.unref();
  }

  async dispose() {
    await Promise.all([...this.sessions.values()].map((session) => this.close(session)));
  }

  releaseForConfiguration(session: ManagedSession) {
    if (!session.poolKey) return;
    clearTimeout(session.idleTimer);
    this.sessions.delete(session.poolKey);
    session.interactive = true;
    session.active = false;
    this.interactiveSessions.set(session.poolKey, session);
  }

  private async closeProcess(session: ManagedSession) {
    if (session.child.exitCode === null) {
      const requested = await this.dependencies
        .closeThroughCdp(session.webSocketDebuggerUrl)
        .catch(() => false);
      if (session.child.exitCode === null && !requested) return false;
    }
    if (session.child.exitCode === null) {
      await new Promise<void>((resolve) => {
        const onExit = () => {
          clearTimeout(timeout);
          resolve();
        };
        const timeout = setTimeout(() => {
          session.child.removeListener("exit", onExit);
          resolve();
        }, this.dependencies.shutdownTimeoutMs);
        timeout.unref();
        session.child.once("exit", onExit);
      });
    }
    // Never terminate a retained Chrome while it may be flushing profile data.
    // If graceful shutdown cannot be confirmed, keep ownership and block replacement.
    if (session.child.exitCode === null) return false;
    const probe = devProbe("profiles", "browser-session-manager");
    if (probe.enabled)
      probe.emit({
        kind: "instance.closed",
        entity: { type: "instance", id: String(session.child.pid ?? session.port) },
        correlation: session.monitorCorrelation ?? {},
        payload: { status: "closed" },
      });
    return true;
  }
}
