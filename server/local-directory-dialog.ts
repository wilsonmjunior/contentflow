import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type LocalDirectorySelection =
  | { status: "selected"; path: string }
  | { status: "cancelled" }
  | { status: "error"; error: string }
  | { status: "busy" };

type DialogRunner = () => Promise<LocalDirectorySelection>;

let selecting = false;

function trimPath(value: string) {
  return value.replace(/\r/g, "").trim().replace(/\/$/, "");
}

async function selectDirectoryOnDarwin(): Promise<LocalDirectorySelection> {
  try {
    const { stdout } = await execFileAsync(
      "osascript",
      ["-e", 'POSIX path of (choose folder with prompt "Selecione a pasta do plugin")'],
      { timeout: 10 * 60 * 1000 },
    );
    const selected = trimPath(stdout);
    if (!selected) return { status: "cancelled" };
    return { status: "selected", path: selected };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    if (/User canceled|User cancelled|-128/i.test(detail)) return { status: "cancelled" };
    return { status: "error", error: "Não foi possível abrir o explorador de arquivos." };
  }
}

async function selectDirectoryOnWindows(): Promise<LocalDirectorySelection> {
  const script = [
    "Add-Type -AssemblyName System.Windows.Forms",
    "$dialog = New-Object System.Windows.Forms.FolderBrowserDialog",
    '$dialog.Description = "Selecione a pasta do plugin"',
    "$dialog.ShowNewFolderButton = $false",
    "if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { exit 2 }",
    "[Console]::Out.Write($dialog.SelectedPath)",
  ].join("; ");
  try {
    const { stdout } = await execFileAsync(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", script],
      { timeout: 10 * 60 * 1000, windowsHide: false },
    );
    const selected = trimPath(stdout);
    if (!selected) return { status: "cancelled" };
    return { status: "selected", path: selected };
  } catch (error) {
    const exitCode =
      error && typeof error === "object" && "code" in error ? Number(error.code) : undefined;
    if (exitCode === 2) return { status: "cancelled" };
    return { status: "error", error: "Não foi possível abrir o explorador de arquivos." };
  }
}

async function selectDirectoryOnLinux(): Promise<LocalDirectorySelection> {
  const commands: Array<{ file: string; args: string[] }> = [
    {
      file: "zenity",
      args: ["--file-selection", "--directory", "--title=Selecione a pasta do plugin"],
    },
    {
      file: "kdialog",
      args: ["--getexistingdirectory", ".", "Selecione a pasta do plugin"],
    },
  ];
  let lastError = "Não foi possível abrir o explorador de arquivos.";
  for (const command of commands) {
    try {
      const { stdout } = await execFileAsync(command.file, command.args, {
        timeout: 10 * 60 * 1000,
      });
      const selected = trimPath(stdout);
      if (!selected) return { status: "cancelled" };
      return { status: "selected", path: selected };
    } catch (error) {
      const code = (error as NodeJS.ErrnoException | { code?: string | number })?.code;
      if (code === 1 || code === "1") return { status: "cancelled" };
      if (code === "ENOENT") {
        lastError =
          "Instale zenity ou kdialog para selecionar pastas pelo explorador neste ambiente.";
        continue;
      }
      lastError = "Não foi possível abrir o explorador de arquivos.";
    }
  }
  return { status: "error", error: lastError };
}

function defaultRunner(): DialogRunner {
  if (process.platform === "darwin") return selectDirectoryOnDarwin;
  if (process.platform === "win32") return selectDirectoryOnWindows;
  return selectDirectoryOnLinux;
}

export async function selectLocalDirectory(
  runner: DialogRunner = defaultRunner(),
): Promise<LocalDirectorySelection> {
  if (selecting) return { status: "busy" };
  selecting = true;
  try {
    return await runner();
  } finally {
    selecting = false;
  }
}

/** Test helper: resets the single-flight guard between cases. */
export function resetLocalDirectoryDialogState() {
  selecting = false;
}
