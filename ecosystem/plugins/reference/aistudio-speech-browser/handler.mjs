import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { attachContentFlowBridge } from "./browser-bridge-client.mjs";
import { createBridgeDiagnostics } from "./bridge-diagnostics.mjs";

const PLUGIN_ID = "local.contentflow.aistudio-speech-browser";
const HOST = "aistudio.google.com";
const SPEECH_PATH = "/generate-speech";
const DEFAULT_PORT = 9744;
const MAX_SCRIPT_CHARS = 100_000;
const MAX_STYLE_CHARS = 4_000;
const MAX_AUDIO_BYTES = 100 * 1024 * 1024;
const PROFILE_SETUP_WAIT_MS = Number.POSITIVE_INFINITY;
const DEFAULT_MODEL = "gemini-3.8-flash-tts";
const DEFAULT_VOICE = "Kore";
const ALLOWED_MODELS = new Set([
  "gemini-3.8-flash-tts",
  "gemini-3.8-flash-lite-tts",
  "gemini-3.1-flash-tts-preview",
  "gemini-2.5-pro-preview-tts",
  "gemini-2.5-flash-preview-tts",
]);
const ALLOWED_VOICES = new Set([
  "Zephyr",
  "Puck",
  "Charon",
  "Kore",
  "Fenrir",
  "Leda",
  "Orus",
  "Aoede",
  "Callirrhoe",
  "Autonoe",
  "Enceladus",
  "Iapetus",
  "Umbriel",
  "Algieba",
  "Despina",
  "Erinome",
  "Algenib",
  "Rasalgetir",
  "Laomedeia",
  "Achernar",
  "Alnilam",
  "Schedar",
  "Gacrux",
  "Pulcherrima",
  "Achird",
  "Zubenelgenubi",
  "Vindemiatrix",
  "Sadachbia",
  "Sadaltager",
  "Sulafat",
]);

function err(code, message, retryable = false, retryAfterMs) {
  const error = new Error(message);
  error.code = code;
  error.retryable = retryable;
  if (Number.isFinite(retryAfterMs) && retryAfterMs > 0) error.retryAfterMs = retryAfterMs;
  return error;
}

function failure(code, message, retryable = false, retryAfterMs) {
  const value = { status: "error", code, message, retryable };
  if (Number.isFinite(retryAfterMs) && retryAfterMs > 0) value.retryAfterMs = retryAfterMs;
  return value;
}

function clamp(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function sleep(ms, signal) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(err("CANCELLED", "Execução cancelada."));
    const timer = setTimeout(done, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(err("CANCELLED", "Execução cancelada."));
    };
    function done() {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function collectText(value, output = []) {
  if (typeof value === "string" || typeof value === "number") output.push(String(value));
  else if (Array.isArray(value)) value.forEach((item) => collectText(item, output));
  else if (value && typeof value === "object" && Object.hasOwn(value, "value"))
    collectText(value.value, output);
  return output;
}

function inputText(value, label, maximum) {
  const result = collectText(value)
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n\n")
    .slice(0, maximum);
  if (!result) throw err("INVALID_INPUT", `Informe ${label}.`);
  return result;
}

function normalizeProfile(value) {
  const name = String(value ?? "default").trim() || "default";
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,47}$/.test(name)) {
    throw err("INVALID_CONFIGURATION", "Perfil AI Studio inválido.");
  }
  return name;
}

function normalizeModel(value) {
  const model = String(value ?? DEFAULT_MODEL).trim() || DEFAULT_MODEL;
  if (!ALLOWED_MODELS.has(model)) {
    throw err("INVALID_CONFIGURATION", `Modelo TTS não suportado: ${model}.`);
  }
  return model;
}

function normalizeVoice(value) {
  const voice = String(value ?? DEFAULT_VOICE).trim() || DEFAULT_VOICE;
  if (!ALLOWED_VOICES.has(voice)) {
    throw err("INVALID_CONFIGURATION", `Voz não suportada: ${voice}.`);
  }
  return voice;
}

function styleFromRequest(request) {
  const configured = String(request?.configuration?.styleInstructions ?? "").trim();
  if (configured) return configured.slice(0, MAX_STYLE_CHARS);
  const instruction = String(request?.resolvedInstruction ?? "").trim();
  return instruction.slice(0, MAX_STYLE_CHARS);
}

function speechUrl(model) {
  return `https://${HOST}${SPEECH_PATH}?model=${encodeURIComponent(model)}`;
}

function runtimeProfilePath(settings, name, services) {
  if (settings?.profilesBasePath?.trim?.()) {
    return join(settings.profilesBasePath.trim(), name);
  }
  return services.getWorkspacePath(name);
}

function profileMarkerPath(directory) {
  return join(directory, ".contentflow-profile-ready.json");
}

function profileReadinessFile(name) {
  const digest = createHash("sha256").update(name).digest("hex").slice(0, 16);
  return `.contentflow-aistudio-speech-ready-${digest}.json`;
}

function resolveProfileRuntime(request, services) {
  const settings = request?.settings ?? {};
  const name = normalizeProfile(request?.configuration?.accountProfile);
  if (typeof services?.getProfilePath === "function") {
    const profilePath = services.getProfilePath(".");
    return {
      name,
      profilePath,
      readinessPath:
        typeof services?.getWorkspacePath === "function"
          ? services.getWorkspacePath(profileReadinessFile(name))
          : profileMarkerPath(profilePath),
      legacyReadinessPath: profileMarkerPath(profilePath),
    };
  }
  const profilePath = runtimeProfilePath(settings, name, services);
  return {
    name,
    profilePath,
    readinessPath: profileMarkerPath(profilePath),
  };
}

function profileReadinessPaths(runtimeOrPath) {
  if (typeof runtimeOrPath === "string") return [profileMarkerPath(runtimeOrPath)];
  return [runtimeOrPath?.readinessPath, runtimeOrPath?.legacyReadinessPath].filter(
    (value, index, values) => value && values.indexOf(value) === index,
  );
}

async function profileIsPrepared(runtimeOrPath, name) {
  for (const readinessPath of profileReadinessPaths(runtimeOrPath)) {
    try {
      const marker = JSON.parse(await readFile(readinessPath, "utf8"));
      if (
        marker?.provider === HOST &&
        marker?.profile === name &&
        marker?.bridgeProtocol === 2
      ) {
        return true;
      }
    } catch {
      /* next path */
    }
  }
  return false;
}

async function markProfilePrepared(runtimeOrPath, name) {
  const [readinessPath] = profileReadinessPaths(runtimeOrPath);
  if (!readinessPath) {
    throw err("INVALID_CONFIGURATION", "Não foi possível resolver o readiness do perfil.");
  }
  await mkdir(dirname(readinessPath), { recursive: true });
  await writeFile(
    readinessPath,
    JSON.stringify({
      provider: HOST,
      profile: name,
      bridgeProtocol: 2,
      preparedAt: new Date().toISOString(),
    }),
    "utf8",
  );
}

function assertProfile(path, allowExistingChromeProfile = false) {
  if (allowExistingChromeProfile) return;
  const normalized = String(path).replaceAll("\\", "/").toLowerCase();
  if (
    normalized.endsWith("/google/chrome/user data") ||
    normalized.includes("/google/chrome/user data/default")
  ) {
    throw err("INVALID_CONFIGURATION", "Use um perfil Chrome dedicado ao plugin.");
  }
}

function requireCoreBrowserSession(coreSession) {
  if (
    !coreSession ||
    !Number.isInteger(coreSession.port) ||
    typeof coreSession.webSocketDebuggerUrl !== "string" ||
    !coreSession.webSocketDebuggerUrl
  ) {
    throw err(
      "INVALID_CONFIGURATION",
      "O ContentFlow não forneceu a sessão de navegador reservada para este perfil.",
    );
  }
  return coreSession;
}

async function launch(settings) {
  const session = requireCoreBrowserSession(settings?.__contentFlowBrowserSession);
  return {
    version: { webSocketDebuggerUrl: session.webSocketDebuggerUrl },
    child: null,
    reused: true,
    startedByCore: true,
    startedByPlugin: false,
  };
}

async function closeBrowserGracefully(client) {
  client?.close();
}

class CDP {
  constructor(url, trace) {
    this.url = url;
    this.trace = trace;
    this.id = 1;
    this.pending = new Map();
  }

  async connect(signal) {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      const abort = () => reject(err("CANCELLED", "Execução cancelada."));
      signal?.addEventListener("abort", abort, { once: true });
      this.ws.addEventListener(
        "open",
        () => {
          signal?.removeEventListener("abort", abort);
          resolve();
        },
        { once: true },
      );
      this.ws.addEventListener(
        "error",
        () => reject(err("UPSTREAM_UNAVAILABLE", "Falha ao conectar ao Chrome.")),
        { once: true },
      );
    });
    this.ws.addEventListener("message", (event) => this.onMessage(event));
    this.ws.addEventListener("close", () =>
      this.rejectAll(err("UPSTREAM_UNAVAILABLE", "Chrome desconectado.")),
    );
    return this;
  }

  onMessage(event) {
    let message;
    try {
      message = JSON.parse(String(event.data));
    } catch {
      return;
    }
    if (!message.id) return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    if (message.error) {
      pending.reject(
        err("UPSTREAM_UNAVAILABLE", `CDP ${pending.method}: ${message.error.message}`),
      );
    } else {
      pending.resolve(message.result ?? {});
    }
  }

  rejectAll(error) {
    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();
  }

  send(method, params = {}, sessionId) {
    const id = this.id++;
    const payload = { id, method, params, ...(sessionId ? { sessionId } : {}) };
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify(payload));
    });
  }

  close() {
    try {
      this.ws?.close();
    } catch {
      /* ignore */
    }
  }
}

async function evaluate(client, sessionId, expression) {
  const result = await client.send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true, userGesture: true },
    sessionId,
  );
  if (result.exceptionDetails) {
    throw err(
      "OUTPUT_VALIDATION_FAILED",
      result.exceptionDetails?.exception?.description || "Erro na página do AI Studio.",
    );
  }
  return result.result?.value;
}

function taskPageMarker(request) {
  return `contentflow-${createHash("sha256")
    .update(
      [
        request?.executionId || "execution",
        request?.blockId || "block",
        Number(request?.attempt) || 1,
        request?.traceId || "trace",
      ].join(":"),
    )
    .digest("hex")
    .slice(0, 24)}`;
}

async function markTaskPage(client, sessionId, request, signal) {
  const marker = taskPageMarker(request);
  await evaluate(
    client,
    sessionId,
    `(() => { const url = new URL(location.href); url.hash = ${JSON.stringify(marker)}; history.replaceState(history.state, "", url); return location.href; })()`,
  );
  await sleep(200, signal);
  return marker;
}

async function attachSpeechPage(client, signal, activate = false, forceNew = false) {
  const { targetInfos = [] } = await client.send("Target.getTargets");
  let target = forceNew
    ? undefined
    : targetInfos.find((item) => {
        if (item.type !== "page") return false;
        try {
          const url = new URL(item.url);
          return url.hostname === HOST && url.pathname.includes("generate-speech");
        } catch {
          return false;
        }
      });
  let created = false;
  if (!target) {
    const createdTarget = await client.send("Target.createTarget", {
      url: speechUrl(DEFAULT_MODEL),
      background: !activate,
    });
    target = { targetId: createdTarget.targetId };
    created = true;
  }
  const { sessionId } = await client.send("Target.attachToTarget", {
    targetId: target.targetId,
    flatten: true,
  });
  if (activate) await client.send("Target.activateTarget", { targetId: target.targetId });
  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);
  return { sessionId, targetId: target.targetId, created };
}

const PAGE_HELPERS = [
  "function vis(el){if(!el||!(el instanceof Element))return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>2&&r.height>2}",
  "function txt(el){return[el?.innerText,el?.textContent,el?.getAttribute?.('aria-label'),el?.getAttribute?.('placeholder'),el?.getAttribute?.('data-test-id'),el?.getAttribute?.('title')].filter(Boolean).join(' ').replace(/\\s+/g,' ').trim()}",
  "function qsa(sel){try{return[...document.querySelectorAll(sel)]}catch{return[]}}",
  "function speechRoot(){return document.querySelector('ms-speech-prompt')||document.querySelector('[class*=\"speech-prompt\" i]')||null}",
  "function buttons(){return qsa('button,[role=\"button\"],ms-run-button button').filter(vis)}",
  "function fields(){return qsa('textarea,[contenteditable=\"true\"],[role=\"textbox\"],ms-autosize-textarea textarea').filter(vis)}",
  "function comboboxes(){return qsa('[role=\"combobox\"],mat-select,ms-voice-selector mat-select,button[aria-haspopup=\"listbox\"]').filter(vis)}",
  "function speechTextareas(){const selectors=['textarea[placeholder*=\"Start writing or paste text\" i]','textarea[placeholder*=\"generate speech\" i]','textarea[aria-label=\"Enter a prompt\"]','textarea[aria-label*=\"Speech block text\" i]','textarea.multi-speaker-raw-prompt','ms-speech-prompt textarea','ms-autosize-textarea textarea'];const found=[];for(const sel of selectors){for(const el of qsa(sel)){if(vis(el)&&!found.includes(el))found.push(el)}}return found}",
  "function runButton(){return document.querySelector('ms-run-button button[type=\"submit\"]')||document.querySelector('button.ctrl-enter-submits')||document.querySelector('button[aria-label=\"Run\"].run-button')||document.querySelector('button[aria-label=\"Run\"]')||buttons().find(b=>/^run\\b/i.test(txt(b))||/\\brun\\b/i.test(txt(b)))||null}",
  "function pageState(){const body=(document.body?.innerText||'').slice(0,8000);const href=String(location.href||'');const root=speechRoot();const speechFields=speechTextareas();const allFields=fields();const run=runButton();const runVisible=Boolean(run&&vis(run));const stop=buttons().some(b=>/stop|parar|detener/i.test(txt(b)));const audios=[...document.querySelectorAll('audio,.speech-prompt-footer audio')].map(a=>({src:a.currentSrc||a.src||'',ready:a.readyState||0,duration:Number.isFinite(a.duration)?a.duration:0})).filter(a=>a.src);const onAccounts=/accounts\\.google\\.com/i.test(href);const loginForm=Boolean(document.querySelector('input[type=\"email\"],#identifierId,form[action*=\"ServiceLogin\"]'));const signedOut=onAccounts||(loginForm&&!root&&speechFields.length===0);const onSpeechPath=/generate-speech/i.test(href);const ready=Boolean(!signedOut&&(root||speechFields.length>0||(onSpeechPath&&(allFields.length>0||runVisible))));const alerts=qsa('[role=\"alert\"],.mat-mdc-snack-bar-label,.toast,[class*=\"error\" i]').filter(vis).map(txt).filter(Boolean).slice(0,8);return{url:href,signedOut,ready,stop,alerts,audioCount:audios.length,audios,bodySnippet:body.slice(0,1200),fieldCount:allFields.length,speechFieldCount:speechFields.length,hasSpeechRoot:Boolean(root),hasRun:runVisible,buttonLabels:buttons().map(txt).slice(0,20)}}",
  "function findField(kind){if(kind==='style'){return document.querySelector('textarea[aria-label=\"Scene\"]')||document.querySelector('textarea[aria-label=\"Sample Context\"]')||document.querySelector('textarea[aria-label*=\"style\" i]')||document.querySelector('textarea[aria-label*=\"Style\" i]')||fields().find(el=>/style|estilo|scene|sample context|instructions|tone|tom/i.test(txt(el)))||null}const speech=speechTextareas();if(speech.length)return speech[0];const style=findField('style');return fields().find(el=>el!==style)||null}",
  "function findVoiceControl(){return document.querySelector('ms-voice-selector mat-select')||document.querySelector('ms-voice-selector')||comboboxes().find(el=>/voice|voz/i.test(txt(el)))||buttons().find(el=>/voice|voz/i.test(txt(el)))||null}",
  "function findModeControl(){return document.querySelector('ms-tts-mode-selector')||comboboxes().find(el=>/mode|modo/i.test(txt(el)))||buttons().find(el=>/single-speaker|multi-speaker|text|composer|modo/i.test(txt(el)))||null}",
  "function optionNodes(){return qsa('[role=\"option\"],mat-option,.mat-mdc-option,li[role=\"menuitem\"],button[role=\"menuitem\"]').filter(vis)}",
].join("\n");


function classifyPageError(state) {
  if (!state) return null;
  const blob = `${state.bodySnippet || ""} ${(state.alerts || []).join(" ")}`.toLowerCase();
  if (state.signedOut) {
    return err(
      "AUTHENTICATION_FAILED",
      "A sessão do Google AI Studio expirou ou não está autenticada.",
      false,
    );
  }
  if (/captcha|recaptcha|verify it.?s you|verifique se [ée] voc/i.test(blob)) {
    return err("AUTHENTICATION_FAILED", "O AI Studio exige verificação manual.", false);
  }
  if (/quota|limite|rate limit|too many requests|alta demanda|exhausted/i.test(blob)) {
    return err("RATE_LIMIT", "O Google AI Studio aplicou um limite temporário.", true, 60_000);
  }
  if (/upgrade|billing|faturamento|payment|pagamento/i.test(blob)) {
    return err("UPGRADE_REQUIRED", "A conta do AI Studio precisa de upgrade ou faturamento.", false);
  }
  if (/blocked|suspended|bloquead/i.test(blob)) {
    return err("ACCOUNT_BLOCKED", "A conta do Google AI Studio está bloqueada.", false);
  }
  if (/safety|refused|recusou|não pôde|could not generate|unable to generate/i.test(blob)) {
    return err("CONTENT_REFUSED", "O AI Studio recusou gerar este áudio.", false);
  }
  return null;
}

async function waitForSpeechReady(client, sessionId, waitMs, signal) {
  const deadline = Date.now() + waitMs;
  while (Date.now() < deadline) {
    if (signal?.aborted) throw err("CANCELLED", "Execução cancelada.");
    const state = await evaluate(client, sessionId, `(()=>{${PAGE_HELPERS};return pageState()})()`);
    const classified = classifyPageError(state);
    if (classified) throw classified;
    if (state?.ready) return state;
    await sleep(400, signal);
  }
  throw err(
    "DOM_INCOMPATIBLE",
    "A página Generate Speech do AI Studio não ficou pronta a tempo.",
    false,
  );
}

async function navigateToSpeech(client, sessionId, model, waitMs, signal) {
  await client.send("Page.navigate", { url: speechUrl(model) }, sessionId);
  // Dá tempo da SPA do AI Studio montar ms-speech-prompt antes do polling.
  await sleep(1_200, signal);
  await waitForSpeechReady(client, sessionId, waitMs, signal);
}

async function setNativeValue(client, sessionId, kind, value) {
  return evaluate(
    client,
    sessionId,
    `(()=>{${PAGE_HELPERS};
      const el=findField(${JSON.stringify(kind)});
      if(!el)return{ok:false,reason:'missing-field'};
      const next=${JSON.stringify(value)};
      el.focus();
      if(el.isContentEditable||el.getAttribute('contenteditable')==='true'){
        el.textContent=next;
        el.dispatchEvent(new InputEvent('input',{bubbles:true,data:next,inputType:'insertText'}));
      }else{
        const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
        const setter=Object.getOwnPropertyDescriptor(proto,'value')?.set;
        setter?setter.call(el,next):(el.value=next);
        el.dispatchEvent(new Event('input',{bubbles:true}));
        el.dispatchEvent(new Event('change',{bubbles:true}));
      }
      return{ok:true,length:next.length,label:txt(el).slice(0,80)};
    })()`,
  );
}

async function selectLabeledOption(client, sessionId, controlKind, optionLabel) {
  const kind = controlKind === "voice" ? "voice" : "mode";
  return evaluate(
    client,
    sessionId,
    `(()=>{${PAGE_HELPERS};
      const wanted=${JSON.stringify(optionLabel)};
      const kind=${JSON.stringify(kind)};
      const control=kind==='voice'?findVoiceControl():findModeControl();
      if(!control)return{ok:false,reason:'missing-control'};
      control.click();
      const escaped=wanted.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&');
      const match=optionNodes().find(el=>new RegExp('\\\\b'+escaped+'\\\\b','i').test(txt(el)));
      if(!match){
        document.body.click();
        return{ok:false,reason:'missing-option',available:optionNodes().map(txt).slice(0,40)};
      }
      match.click();
      return{ok:true,selected:txt(match).slice(0,80)};
    })()`,
  );
}

async function clickText(bridge, selector, terms, operationKey) {
  try {
    await bridge.dispatch("click", { selectors: [selector], textIncludes: terms }, operationKey);
    return true;
  } catch (error) {
    if (error?.code === "OUTPUT_VALIDATION_FAILED") return false;
    throw error;
  }
}

async function clickRun(bridge, operationKey) {
  if (
    await clickText(
      bridge,
      'ms-run-button button[type="submit"],button.ctrl-enter-submits,button[aria-label="Run"],button.run-button,button,[role=button]',
      ["run", "executar", "correr"],
      operationKey,
    )
  ) {
    return true;
  }
  throw err("DOM_INCOMPATIBLE", "Não foi possível clicar em Run no AI Studio.", false);
}

async function waitForAudio(client, sessionId, baselineCount, timeoutMs, signal) {
  const deadline = Date.now() + timeoutMs;
  let lastState = null;
  while (Date.now() < deadline) {
    if (signal?.aborted) throw err("CANCELLED", "Execução cancelada.");
    lastState = await evaluate(client, sessionId, `(()=>{${PAGE_HELPERS};return pageState()})()`);
    const classified = classifyPageError(lastState);
    if (classified) throw classified;
    if ((lastState?.audioCount ?? 0) > baselineCount) {
      const audio = lastState.audios?.at(-1);
      if (audio?.src) return audio;
    }
    await sleep(700, signal);
  }
  throw err("TIMEOUT", "O AI Studio não concluiu a geração de áudio a tempo.", true);
}

function extensionForMime(mime) {
  if (/wav/i.test(mime)) return "wav";
  if (/mpeg|mp3/i.test(mime)) return "mp3";
  if (/mp4|m4a|aac/i.test(mime)) return "m4a";
  if (/ogg/i.test(mime)) return "ogg";
  return "wav";
}

function minimalWavBytes() {
  // 0.1s of silence, 16-bit mono 16kHz — enough for deterministic fixture tests.
  const sampleRate = 16_000;
  const samples = Math.floor(sampleRate / 10);
  const dataSize = samples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

async function captureAudio(client, sessionId, services, request) {
  const data = await evaluate(
    client,
    sessionId,
    `(()=>{${PAGE_HELPERS};const a=pageState().audios.at(-1);return a||null})()`,
  );
  if (!data?.src) throw err("OUTPUT_VALIDATION_FAILED", "Áudio gerado não encontrado.", true);

  const payload = await evaluate(
    client,
    sessionId,
    `(async()=>{
      const src=${JSON.stringify(data.src)};
      const response=await fetch(src,{credentials:'include'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const bytes=new Uint8Array(await response.arrayBuffer());
      let binary='';
      for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));
      return{
        base64:btoa(binary),
        mime:(response.headers.get('content-type')||'audio/wav').split(';')[0]
      };
    })()`,
  );

  const bytes = Buffer.from(payload.base64, "base64");
  if (!bytes.length || bytes.length > MAX_AUDIO_BYTES) {
    throw err("OUTPUT_VALIDATION_FAILED", "Áudio vazio ou acima do limite do plugin.", true);
  }

  const mime = String(payload.mime || "audio/wav").split(";")[0].trim() || "audio/wav";
  const ext = extensionForMime(mime);
  const id = `aistudio-speech-${createHash("sha256")
    .update(
      `${request.executionId || "e"}:${request.blockId || "b"}:${request.attempt || 1}:${request.batch?.itemId || "single"}`,
    )
    .digest("hex")
    .slice(0, 16)}`;
  const name = `${id}.${ext}`;
  await writeFile(services.getOutputPath(name), bytes);
  const file = {
    id,
    name,
    mimeType: mime,
    size: bytes.length,
    url: `artifact://${id}`,
  };
  const artifact = {
    id,
    name,
    mimeType: mime,
    size: bytes.length,
    source: { kind: "path", path: name },
  };
  return { file, artifact, mime, bytes: bytes.length };
}

function receiptPath(services, request) {
  return services.getWorkspacePath(
    join(
      ".contentflow-receipts",
      `${request.executionId || "execution"}-${request.blockId || "block"}-${request.attempt || 1}-${request.batch?.itemId || "single"}.json`,
    ),
  );
}

async function loadReceipt(services, request) {
  try {
    return JSON.parse(await readFile(receiptPath(services, request), "utf8"));
  } catch {
    return null;
  }
}

async function saveReceipt(services, request, receipt) {
  const path = receiptPath(services, request);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(receipt, null, 2), "utf8");
}

async function diagnosticAudio(request, services) {
  const script = inputText(request.inputs?.text, "o texto para narrar", MAX_SCRIPT_CHARS);
  const model = normalizeModel(request.configuration?.model);
  const voice = normalizeVoice(request.configuration?.voice);
  const style = styleFromRequest(request);
  const bytes = minimalWavBytes();
  const id = `aistudio-speech-fixture-${createHash("sha256").update(script).digest("hex").slice(0, 12)}`;
  const name = `${id}.wav`;
  await writeFile(services.getOutputPath(name), bytes);
  const file = {
    id,
    name,
    mimeType: "audio/wav",
    size: bytes.length,
    url: `artifact://${id}`,
  };
  return {
    status: "success",
    values: {
      audio: file,
      metadata: [
        {
          provider: "Google AI Studio / Gemini TTS",
          model,
          voice,
          style,
          bytes: bytes.length,
          diagnostic: true,
        },
      ],
    },
    artifacts: [
      {
        id,
        name,
        mimeType: "audio/wav",
        size: bytes.length,
        source: { kind: "path", path: name },
      },
    ],
    usage: {
      provider: "Google AI Studio / Gemini TTS",
      outputUnits: bytes.length,
      unit: "bytes",
    },
  };
}

async function prepareProfileSession({
  attachBridge,
  attachPage,
  navigateAndWait,
}) {
  // A Bridge pode demorar a subir no perfil novo. Conecta nela primeiro e só
  // depois exige a página Generate Speech autenticada — evita prepare eterno
  // quando o DOM do AI Studio não bate com seletores genéricos.
  const bridge = await attachBridge();
  try {
    const page = await attachPage();
    await navigateAndWait(page.sessionId);
    return { bridge, page };
  } catch (error) {
    await bridge?.dispose?.();
    throw error;
  }
}

async function configureProfile(request, services) {
  const settings = request?.settings ?? {};
  let runtime;
  try {
    runtime = resolveProfileRuntime(request, services);
    assertProfile(runtime.profilePath, settings.allowExistingChromeProfile === true);
  } catch (error) {
    return failure(error?.code || "INVALID_CONFIGURATION", error?.message || "Perfil inválido.");
  }

  if (request?.invocation?.action === "status") {
    return {
      status: "success",
      values: { ready: await profileIsPrepared(runtime, runtime.name) },
    };
  }
  if (request?.invocation?.action !== "prepare") {
    return failure("INVALID_CONFIGURATION", "Ação de configuração de perfil inválida.");
  }

  let client;
  let bridge;
  try {
    const launched = await launch(settings);
    client = await new CDP(launched.version.webSocketDebuggerUrl).connect(services.signal);
    let sessionId;
    const prepared = await prepareProfileSession({
      attachBridge: async () => {
        const page = await attachSpeechPage(client, services.signal, true, true);
        sessionId = page.sessionId;
        // Leva o Chrome à origem do AI Studio antes da Bridge exigir a aba.
        await client.send("Page.navigate", { url: speechUrl(DEFAULT_MODEL) }, sessionId);
        await sleep(800, services.signal);
        return attachContentFlowBridge({
          client,
          pageSessionId: sessionId,
          pluginId: PLUGIN_ID,
          profileId: runtime.name,
          request,
          signal: services.signal,
          allowedOrigins: ["https://aistudio.google.com"],
          waitMs: PROFILE_SETUP_WAIT_MS,
        });
      },
      attachPage: async () => {
        if (sessionId) return { sessionId };
        return attachSpeechPage(client, services.signal, true, false);
      },
      navigateAndWait: async (activeSessionId) => {
        await navigateToSpeech(
          client,
          activeSessionId,
          DEFAULT_MODEL,
          PROFILE_SETUP_WAIT_MS,
          services.signal,
        );
      },
    });
    bridge = prepared.bridge;
    await markProfilePrepared(runtime, runtime.name);
    return {
      status: "success",
      values: {
        ready: true,
        message: `Perfil ${runtime.name} validado no Google AI Studio.`,
      },
    };
  } catch (error) {
    return failure(
      error?.code || "AUTHENTICATION_FAILED",
      error?.message || "Não foi possível validar o login do AI Studio.",
      Boolean(error?.retryable),
      error?.retryAfterMs,
    );
  } finally {
    await bridge?.dispose?.();
    await closeBrowserGracefully(client);
  }
}

async function generateSpeech(request, services) {
  const settings = request.settings ?? {};
  const configuration = request.configuration ?? {};
  const script = inputText(request.inputs?.text, "o texto para narrar", MAX_SCRIPT_CHARS);
  const model = normalizeModel(configuration.model);
  const voice = normalizeVoice(configuration.voice);
  const style = styleFromRequest(request);
  const runtime = resolveProfileRuntime(request, services);
  const profile = runtime.name;
  assertProfile(runtime.profilePath, settings.allowExistingChromeProfile === true);

  if (!(await profileIsPrepared(runtime, profile))) {
    throw err(
      "AUTHENTICATION_FAILED",
      `O perfil ${profile} ainda não foi salvo. Use Salvar perfil antes de executar.`,
    );
  }

  const existing = await loadReceipt(services, request);
  if (existing && ["submitted", "accepted", "running", "unknown"].includes(existing.state)) {
    throw err(
      "OUTPUT_VALIDATION_FAILED",
      "Há uma geração anterior sem reconciliação concluída para esta tentativa. Reabra o job ou inicie uma nova tentativa autorizada pelo núcleo.",
      false,
    );
  }

  let client;
  let bridge;
  let closeTaskTarget = false;
  let taskTargetId;
  try {
    const launched = await launch(settings);
    client = await new CDP(
      launched.version.webSocketDebuggerUrl,
      settings.diagnosticTrace
        ? (message) => process.stderr.write(`[AI Studio Speech] ${message}\n`)
        : null,
    ).connect(services.signal);

    const page = await attachSpeechPage(client, services.signal, false, false);
    const { sessionId } = page;
    taskTargetId = page.targetId;
    closeTaskTarget = true;

    await navigateToSpeech(
      client,
      sessionId,
      model,
      clamp(settings.interactiveWaitSeconds, 600, 30, 900) * 1000,
      services.signal,
    );
    await markTaskPage(client, sessionId, request, services.signal);

    const diagnostics = await createBridgeDiagnostics(request, services);
    request.__bridgeDiagnosticsState = diagnostics;

    bridge = await attachContentFlowBridge({
      client,
      pageSessionId: sessionId,
      pageTargetId: taskTargetId,
      expectedUrl: speechUrl(model),
      pluginId: PLUGIN_ID,
      profileId: profile,
      request,
      signal: services.signal,
      allowedOrigins: ["https://aistudio.google.com"],
    });

    const baseline = await evaluate(
      client,
      sessionId,
      `(()=>{${PAGE_HELPERS};return pageState()})()`,
    );

    await selectLabeledOption(client, sessionId, "mode", "Single-speaker").catch(() => ({
      ok: false,
    }));

    if (!(await clickText(bridge, "button,[role=combobox],[role=button]", ["voice", "voz"], "voice-menu"))) {
      const voiceResult = await selectLabeledOption(client, sessionId, "voice", voice);
      if (!voiceResult?.ok) {
        throw err(
          "DOM_INCOMPATIBLE",
          `Não foi possível abrir o seletor de voz no AI Studio.`,
          false,
        );
      }
    } else if (
      !(await clickText(
        bridge,
        "[role=option],[role=menuitem],mat-option,button",
        [voice],
        `voice:${voice}`,
      ))
    ) {
      throw err(
        "DOM_INCOMPATIBLE",
        `Não foi possível selecionar a voz ${voice} no AI Studio.`,
        false,
      );
    }

    if (style) {
      try {
        await bridge.dispatch(
          "setText",
          {
            selectors: [
              'textarea[aria-label*="style" i]',
              'textarea[placeholder*="style" i]',
              '[role="textbox"][aria-label*="style" i]',
              'textarea[aria-label*="estilo" i]',
            ],
            text: style,
          },
          "style-instructions",
        );
      } catch {
        await setNativeValue(client, sessionId, "style", style);
      }
    }

    try {
      await bridge.dispatch(
        "setText",
        {
          selectors: [
            'textarea[placeholder*="Start writing or paste text" i]',
            'textarea[placeholder*="generate speech" i]',
            'textarea[aria-label="Enter a prompt"]',
            'textarea[aria-label*="Speech block text" i]',
            "ms-speech-prompt textarea",
            "ms-autosize-textarea textarea",
            "textarea",
          ],
          text: script,
        },
        "speech-script",
      );
    } catch {
      const textResult = await setNativeValue(client, sessionId, "text", script);
      if (!textResult?.ok) {
        throw err("DOM_INCOMPATIBLE", "Não foi possível preencher o texto no AI Studio.", false);
      }
    }

    const receipt = {
      logicalKey: [
        request.executionId,
        request.blockId,
        request.capabilityId,
        request.attempt,
        "start",
        request.batch?.itemId || null,
      ].join("/"),
      provider: "google-aistudio-speech",
      operation: "generate-speech",
      scope: {},
      batchItemId: request.batch?.itemId || null,
      submittedAt: new Date().toISOString(),
      state: "prepared",
      externalIds: {},
      model,
      voice,
    };
    await saveReceipt(services, request, receipt);

    await clickRun(bridge, `run:${request.attempt || 1}`);
    receipt.state = "submitted";
    receipt.submittedAt = new Date().toISOString();
    await saveReceipt(services, request, receipt);

    const audio = await waitForAudio(
      client,
      sessionId,
      baseline?.audioCount ?? 0,
      clamp(settings.responseTimeoutSeconds, 600, 30, 3600) * 1000,
      services.signal,
    );
    receipt.state = "running";
    receipt.externalIds = { audioSrcHost: (() => {
      try {
        return new URL(audio.src).hostname;
      } catch {
        return "unknown";
      }
    })() };
    await saveReceipt(services, request, receipt);

    const captured = await captureAudio(client, sessionId, services, request);
    receipt.state = "succeeded";
    receipt.externalIds = {
      ...receipt.externalIds,
      artifactId: captured.file.id,
      bytes: captured.bytes,
    };
    await saveReceipt(services, request, receipt);

    const metadata = [
      {
        provider: "Google AI Studio / Gemini TTS",
        model,
        voice,
        style: style || null,
        mimeType: captured.mime,
        bytes: captured.bytes,
        pageUrl: speechUrl(model),
      },
    ];

    await services.publishPartial?.({
      values: { audio: captured.file, metadata },
      artifacts: [captured.artifact],
      progress: 1,
      message: "Narração capturada no Google AI Studio.",
    });

    closeTaskTarget = false;
    return {
      status: "success",
      values: { audio: captured.file, metadata },
      artifacts: [captured.artifact],
      usage: {
        provider: "Google AI Studio / Gemini TTS",
        outputUnits: captured.bytes,
        unit: "bytes",
      },
    };
  } catch (error) {
    if (services.signal?.aborted || error?.code === "CANCELLED") {
      return failure("CANCELLED", "Execução cancelada.");
    }
    const response = failure(
      error?.code || "UPSTREAM_UNAVAILABLE",
      error?.message || "Falha no Google AI Studio Speech.",
      Boolean(error?.retryable),
      error?.retryAfterMs,
    );
    if (error?.code === "AUTHENTICATION_FAILED") {
      response.recovery = {
        externalEffect: "none",
        intervention: "reauthenticate",
      };
    }
    if (error?.code === "PROVIDER_SECURITY_CHALLENGE") {
      response.recovery = {
        externalEffect: "none",
        intervention: "provider_security_challenge",
      };
    }
    try {
      const receipt = await loadReceipt(services, request);
      if (receipt && receipt.state === "submitted") {
        receipt.state = "unknown";
        await saveReceipt(services, request, receipt);
        response.recovery = {
          ...(response.recovery || {}),
          externalEffect: "possible",
          reconciliation: "required",
        };
      }
    } catch {
      /* ignore receipt persistence failures */
    }
    return response;
  } finally {
    await bridge?.dispose?.();
    if (closeTaskTarget && taskTargetId && client) {
      await client.send("Target.closeTarget", { targetId: taskTargetId }).catch(() => undefined);
    }
    await closeBrowserGracefully(client);
  }
}

export async function execute(request, services) {
  if (request?.invocation?.mode === "configure") {
    return await configureProfile(request, services);
  }
  if (request?.capabilityId && request.capabilityId !== "generate-speech-in-browser") {
    return failure("INVALID_CONFIGURATION", `Capability desconhecida: ${request.capabilityId}.`);
  }
  if (request?.settings?.diagnosticFixture) {
    try {
      return await diagnosticAudio(request, services);
    } catch (error) {
      return failure(error?.code || "INVALID_INPUT", error?.message || "Fixture inválida.");
    }
  }
  try {
    return await generateSpeech(request, services);
  } catch (error) {
    if (services.signal?.aborted || error?.code === "CANCELLED") {
      return failure("CANCELLED", "Execução cancelada.");
    }
    return failure(
      error?.code || "UPSTREAM_UNAVAILABLE",
      error?.message || "Falha no Google AI Studio Speech.",
      Boolean(error?.retryable),
      error?.retryAfterMs,
    );
  }
}

function computeSpeechReady(state) {
  if (!state || state.signedOut) return false;
  return Boolean(
    state.hasSpeechRoot ||
      Number(state.speechFieldCount) > 0 ||
      (/generate-speech/i.test(String(state.url || "")) &&
        (Number(state.fieldCount) > 0 || state.hasRun)),
  );
}

export const __test = {
  ALLOWED_MODELS,
  ALLOWED_VOICES,
  DEFAULT_MODEL,
  DEFAULT_VOICE,
  HOST,
  PAGE_HELPERS,
  SPEECH_PATH,
  classifyPageError,
  computeSpeechReady,
  extensionForMime,
  inputText,
  markProfilePrepared,
  minimalWavBytes,
  normalizeModel,
  normalizeProfile,
  normalizeVoice,
  profileIsPrepared,
  profileReadinessFile,
  resolveProfileRuntime,
  speechUrl,
  styleFromRequest,
  taskPageMarker,
};
