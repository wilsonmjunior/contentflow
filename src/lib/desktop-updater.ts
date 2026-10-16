export type DesktopUpdaterStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "downloaded"
  | "installing"
  | "up-to-date"
  | "error"
  | "unsupported";

export type DesktopUpdaterState = {
  status: DesktopUpdaterStatus;
  distribution: "installer" | "portable" | "development";
  currentVersion: string;
  availableVersion: string | null;
  progress: number | null;
  message: string;
};

export type DesktopUpdaterBridge = {
  getState(): Promise<DesktopUpdaterState>;
  check(): Promise<DesktopUpdaterState>;
  download(): Promise<DesktopUpdaterState>;
  install(): Promise<DesktopUpdaterState>;
  openReleases(): Promise<DesktopUpdaterState>;
  subscribe(callback: (state: DesktopUpdaterState) => void): () => void;
};

export type DesktopHumanTaskNotification = {
  id: string;
  title: string;
  body: string;
  route: string;
  severity: "warning" | "error";
};

export type DesktopHumanTasksBridge = {
  update(input: {
    count: number;
    badgeTone: "warning" | "error";
    badgeDescription: string;
    notificationSound: boolean;
    systemNotifications: boolean;
    tasks: DesktopHumanTaskNotification[];
  }): void;
  subscribeNavigation(callback: (route: string) => void): () => void;
};

export type DirectorySelectionResult = {
  status: "selected" | "cancelled" | "error" | "busy";
  path?: string;
  error?: string;
};

export type DesktopFilesystemBridge = {
  selectDirectory(): Promise<DirectorySelectionResult>;
};

declare global {
  interface Window {
    contentflowDesktop?: {
      updater: DesktopUpdaterBridge;
      humanTasks?: DesktopHumanTasksBridge;
      diagnostics?: {
        openFolder(): Promise<{ status: "opened" | "error" }>;
        export(): Promise<{ status: "exported" | "cancelled" | "error" }>;
      };
      filesystem?: DesktopFilesystemBridge;
    };
  }
}

export function desktopHumanTasksBridge() {
  if (typeof window === "undefined") return undefined;
  return window.contentflowDesktop?.humanTasks;
}

export function desktopUpdaterBridge() {
  if (typeof window === "undefined") return undefined;
  return window.contentflowDesktop?.updater;
}

export function desktopFilesystemBridge() {
  if (typeof window === "undefined") return undefined;
  return window.contentflowDesktop?.filesystem;
}

/** Prefer the Electron dialog; fall back to the local API used by `npm run dev`. */
export async function selectLocalDirectory(): Promise<DirectorySelectionResult> {
  const desktop = desktopFilesystemBridge();
  if (desktop) return desktop.selectDirectory();
  try {
    const response = await fetch("/api/local/select-directory", { method: "POST" });
    const result = (await response.json()) as DirectorySelectionResult;
    if (!response.ok && !result.status) {
      return {
        status: "error",
        error: "Não foi possível abrir o explorador de arquivos.",
      };
    }
    return result;
  } catch {
    return {
      status: "error",
      error: "Não foi possível abrir o explorador de arquivos.",
    };
  }
}
