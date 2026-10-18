import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Camera,
  Check,
  Columns2,
  Columns3,
  Copy,
  Download,
  FileJson,
  FileText,
  Film,
  Image as ImageIcon,
  LayoutGrid,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAppPreferences } from "@/lib/app-preferences";
import {
  cameraDirectionCategories,
  cameraDirectionTermCount,
  cameraLightingOptions,
  cameraMoodOptions,
  cameraMovementOptions,
  flowDirectingPrinciples,
  flowProductionStages,
  shotFramingOptions,
} from "@/lib/camera-direction-guide";
import { toast } from "sonner";
import { visualStyleFamilies, visualStyles, type VisualStyle } from "@/lib/visual-style-guide";

export const Route = createFileRoute("/script-studio")({ component: ScriptStudioPage });

type Scene = {
  id: string;
  timeStart: string;
  timeEnd: string;
  video: string;
  audio: string;
  image: string;
  shotType: string;
};
type StudioDocument = {
  title: string;
  theme: string;
  version: string;
  viewMode: "3col" | "2col" | "storyboard";
  scenes: Scene[];
};

const STORAGE_KEY = "contentflow.script-studio.v1";
const newScene = (index: number, start = "00:00", end = "00:05", id = `scene-${index}`): Scene => ({
  id,
  timeStart: start,
  timeEnd: end,
  video: "",
  audio: "[NARRADOR (OFF)]:\n",
  image: "",
  shotType: "PM",
});
const initialDocument: StudioDocument = {
  title: "A Nuvem que Morava no Chão",
  theme: "Episódio 01 — Curiosidades do Jardim",
  version: "v1.0",
  viewMode: "3col",
  scenes: [
    {
      ...newScene(1, "00:00", "00:15"),
      video:
        "CENA 01 — UMA NUVEM CAIU NO QUINTAL?\nCLOSE • Aproximação.\nUm menino e seu cachorrinho observam uma poça d'água cristalina no quintal ensolarado.",
      audio:
        "[TRILHA]: Piano lúdico e suave.\n[SFX]: Passarinhos e brisa no jardim.\n[NARRADOR (OFF)]:\nOlha lá! Parece que um pedaço do céu desceu para brincar pertinho da grama.",
      shotType: "Close",
    },
    {
      ...newScene(2, "00:15", "00:30"),
      video:
        "CENA 02 — DEPOIS DA CHUVA, UMA SURPRESA!\nPLANO GERAL • Panorâmica suave.\nO quintal está molhado, com flores coloridas e um banco de madeira.",
      audio:
        "[TRILHA]: Melodia flutuante e serena.\n[NARRADOR (OFF)]:\nQuando a chuva vai embora, ela sempre deixa segredos pelo caminho.",
      shotType: "PG",
    },
    {
      ...newScene(3, "00:30", "00:45"),
      video:
        "CENA 03 — COMO ELA VEIO PARAR AQUI?\nPLANO MÉDIO • Câmera baixa.\nO menino e o cão observam o reflexo na água.",
      audio:
        "[SFX]: Respiração suave do filhote.\n[NARRADOR (OFF)]:\nSerá que ela caiu do céu porque estava muito pesada?",
      shotType: "PM",
    },
    {
      ...newScene(4, "00:45", "01:00"),
      video:
        "CENA 04 — UMA PATINHA... E PLIM!\nPLANO DETALHE • Câmera estática.\nA patinha do filhote toca a água e cria ondas circulares.",
      audio:
        "[SFX]: Som cristalino de uma gota d'água.\n[NARRADOR (OFF)]:\nTchibum! A nuvenzinha tremeu inteira!",
      shotType: "Detalhe",
    },
  ],
};

const seconds = (value: string) => {
  const [minutes = 0, secs = 0] = value.split(":").map(Number);
  return (Number.isFinite(minutes) ? minutes : 0) * 60 + (Number.isFinite(secs) ? secs : 0);
};
const timecode = (value: number) =>
  `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
const escapeMarkdown = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");

function ScriptStudioPage() {
  const { t } = useAppPreferences();
  const [doc, setDoc] = useState<StudioDocument>(initialDocument);
  const [loaded, setLoaded] = useState(false);
  const [promptScene, setPromptScene] = useState<string>();
  const [promptType, setPromptType] = useState<"image" | "video">("image");
  const [docsOpen, setDocsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [imageScene, setImageScene] = useState<Scene>();
  const [studioSection, setStudioSection] = useState<"script" | "visual-guide">("script");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StudioDocument;
        if (Array.isArray(parsed.scenes) && parsed.scenes.length)
          setDoc({ ...initialDocument, ...parsed });
      }
    } catch {
      toast.error(t("Não foi possível carregar o roteiro salvo."));
    } finally {
      setLoaded(true);
    }
  }, [t]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    } catch {
      toast.error(t("Não foi possível salvar o roteiro neste dispositivo."));
    }
  }, [doc, loaded, t]);

  const update = (patch: Partial<StudioDocument>) =>
    setDoc((current) => ({ ...current, ...patch }));
  const updateScene = (id: string, patch: Partial<Scene>) =>
    setDoc((current) => ({
      ...current,
      scenes: current.scenes.map((scene) => (scene.id === id ? { ...scene, ...patch } : scene)),
    }));
  const wordCount = useMemo(
    () =>
      doc.scenes.reduce(
        (total, scene) =>
          total +
          (scene.audio || "")
            .replace(/\[.*?\]/g, "")
            .trim()
            .split(/\s+/)
            .filter(Boolean).length,
        0,
      ),
    [doc.scenes],
  );
  const estimatedDuration = timecode(Math.round((wordCount / 130) * 60));
  const projectDuration = doc.scenes.at(-1)?.timeEnd || "00:00";
  const sceneForPrompt = doc.scenes.find((scene) => scene.id === promptScene);
  const cleanPromptDescription = (sceneForPrompt?.video || "")
    .replace(/CENA \d+.*?\n/gi, "")
    .replace(/(PG|PM|PP|Close-up|Detalhe|Contra-plongée)/gi, "")
    .trim();
  const promptText =
    promptType === "image"
      ? `/imagine prompt: cinematic keyframe, 3D animated feature film style, ${cleanPromptDescription || "detailed cinematic scene"}, soft volumetric lighting, global illumination, high detail --ar 16:9 --style raw`
      : `Image-to-Video Prompt: Cinematic slow camera motion, ${cleanPromptDescription || "smooth motion, gentle atmospheric wind"}, fluid animation, 24fps cinematic motion blur, realistic lighting reflections.`;

  const addScene = () => {
    const start = doc.scenes.at(-1)?.timeEnd || "00:00";
    setDoc((current) => ({
      ...current,
      scenes: [
        ...current.scenes,
        newScene(
          current.scenes.length + 1,
          start,
          timecode(seconds(start) + 5),
          crypto.randomUUID(),
        ),
      ],
    }));
  };
  const moveScene = (index: number, offset: number) =>
    setDoc((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.scenes.length) return current;
      const scenes = [...current.scenes];
      [scenes[index], scenes[target]] = [scenes[target], scenes[index]];
      return { ...current, scenes };
    });
  const duplicateScene = (index: number) =>
    setDoc((current) => {
      const scenes = [...current.scenes];
      scenes.splice(index + 1, 0, { ...scenes[index], id: crypto.randomUUID() });
      return { ...current, scenes };
    });
  const deleteScene = (id: string) => {
    if (doc.scenes.length <= 1) return toast.error(t("O roteiro deve conter pelo menos uma cena."));
    setDoc((current) => ({
      ...current,
      scenes: current.scenes.filter((scene) => scene.id !== id),
    }));
  };
  const recalculate = () => {
    let cursor = 0;
    const scenes = doc.scenes.map((scene) => {
      const wordCount = (scene.audio || "").split(/\s+/).filter(Boolean).length;
      const duration = Math.max(4, Math.ceil(wordCount / 2.1));
      const timeStart = timecode(cursor);
      cursor += duration;
      return { ...scene, timeStart, timeEnd: timecode(cursor) };
    });
    update({ scenes });
    toast.success(t("Timecodes recalculados com base na locução."));
  };
  const loadTemplate = (kind: "documentary" | "animation") => {
    if (kind === "animation") setDoc(initialDocument);
    else
      setDoc({
        ...initialDocument,
        title: "A Revolução da Inteligência Artificial",
        theme: "Episódio 01 — Dos Tubos de Vácuo às Redes Neurais",
        version: "v1.0",
        scenes: initialDocument.scenes.map((scene, index) => ({
          ...scene,
          id: `doc-${index}`,
          timeStart: ["00:00", "00:06", "00:15", "00:26"][index],
          timeEnd: ["00:06", "00:15", "00:26", "00:38"][index],
          video: [
            "CENA 01 — GANCHO VISUAL (Motion 2D)\nUma partícula luminosa pulsa e revela uma vasta teia de dados.",
            "CENA 02 — TÍTULO & TESE\nTipografia cinética apresenta a tese do episódio.",
            "CENA 03 — CONTEXTO HISTÓRICO\nImagens de arquivo mostram cientistas operando computadores na década de 1950.",
            "CENA 04 — INFOGRÁFICO DE ESCALA\nUm vetor compara o poder de cálculo entre 1950 e o presente.",
          ][index],
        })),
      });
    setTemplateOpen(false);
    toast.success(t("Modelo carregado."));
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `roteiro_${(doc.title || "script").toLowerCase().replace(/\s+/g, "_")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };
  const exportMarkdown = async () => {
    const rows = doc.scenes.map((scene) =>
      doc.viewMode === "2col"
        ? `| ${escapeMarkdown(scene.video)} | ${escapeMarkdown(scene.audio)} |`
        : `| **${scene.timeStart} - ${scene.timeEnd}** | ${escapeMarkdown(scene.video)} | ${escapeMarkdown(scene.audio)} |`,
    );
    const headers =
      doc.viewMode === "2col"
        ? "| VÍDEO | ÁUDIO |\n| :--- | :--- |"
        : "| TEMPO | VÍDEO | ÁUDIO |\n| :--- | :--- | :--- |";
    const markdown = `# ${doc.title}\n**Tema:** ${doc.theme}\n**Versão:** ${doc.version} | **Duração:** ${projectDuration}\n\n${headers}\n${rows.join("\n")}`;
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success(t("Roteiro copiado em Markdown."));
    } catch {
      toast.error(t("Não foi possível copiar o roteiro."));
    }
    setExportOpen(false);
  };
  const importJson = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as StudioDocument;
      if (!parsed || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0)
        throw new Error("invalid");
      setDoc({ ...initialDocument, ...parsed });
      toast.success(t("Roteiro importado."));
    } catch {
      toast.error(t("Arquivo de roteiro inválido."));
    }
    if (importRef.current) importRef.current.value = "";
    setExportOpen(false);
  };

  return (
    <AppShell>
      <style>{`@media print {
        body:has([data-script-studio]) aside,
        body:has([data-script-studio]) header,
        body:has([data-script-studio]) [data-script-studio-actions],
        body:has([data-script-studio]) [data-script-studio-help] { display: none !important; }
        body:has([data-script-studio]) { background: #fff !important; color: #111827 !important; }
        body:has([data-script-studio]) [data-script-studio] { display: block !important; max-width: none !important; padding: 0 !important; }
        body:has([data-script-studio]) [data-script-studio] section { break-inside: avoid; box-shadow: none !important; }
        body:has([data-script-studio]) [data-script-studio] textarea { min-height: 0 !important; border: 0 !important; background: transparent !important; color: #111827 !important; padding: 0 !important; }
        body:has([data-script-studio]) [data-script-studio] button { display: none !important; }
      }`}</style>
      <TopBar
        title={t("Roteiro audiovisual")}
        subtitle={t("Planeje cenas, imagem, locução e trilha em um roteiro visual.")}
        showNewProject={false}
      />
      <nav
        aria-label={t("Seções do estúdio")}
        className="mx-auto flex w-full max-w-[1600px] gap-2 overflow-x-auto px-4 pt-4 sm:px-6"
      >
        <Button
          variant={studioSection === "script" ? "default" : "outline"}
          onClick={() => setStudioSection("script")}
        >
          <FileText className="mr-2 size-4" />
          {t("Roteiro")}
        </Button>
        <Button
          variant={studioSection === "visual-guide" ? "default" : "outline"}
          onClick={() => setStudioSection("visual-guide")}
        >
          <Film className="mr-2 size-4" />
          {t("Guia de estilo visual")}
        </Button>
      </nav>
      <main data-script-studio className="mx-auto w-full max-w-[1600px] space-y-5 p-4 sm:p-6">
        {studioSection === "visual-guide" ? (
          <VisualStyleGuide t={t} />
        ) : (
          <>
            <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <label className="md:col-span-2">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">
                    {t("Título do roteiro")}
                  </span>
                  <input
                    value={doc.title}
                    onChange={(event) => update({ title: event.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-semibold"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">
                    {t("Tema ou episódio")}
                  </span>
                  <input
                    value={doc.theme}
                    onChange={(event) => update({ theme: event.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label>
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">
                      {t("Versão")}
                    </span>
                    <input
                      value={doc.version}
                      onChange={(event) => update({ version: event.target.value })}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-center text-sm"
                    />
                  </label>
                  <div>
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">
                      {t("Duração do roteiro")}
                    </span>
                    <div className="flex h-10 items-center justify-center rounded-md border border-border bg-muted/50 font-mono text-sm text-primary">
                      {projectDuration}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <span>
                    {t("Cenas")}:{" "}
                    <strong className="font-mono text-foreground">{doc.scenes.length}</strong>
                  </span>
                  <span>
                    {t("Palavras de locução")}:{" "}
                    <strong className="font-mono text-foreground">{wordCount}</strong>
                  </span>
                  <span>
                    {t("Tempo estimado de locução")}:{" "}
                    <strong className="font-mono text-foreground">{estimatedDuration}</strong>
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                  <Check className="size-3.5" />
                  {t("Salvamento local automático")}
                </span>
              </div>
            </section>

            <div
              data-script-studio-actions
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={addScene} className="gap-2">
                  <Plus className="size-4" />
                  {t("Nova cena")}
                </Button>
                <Button variant="outline" onClick={recalculate} className="gap-2">
                  <RefreshCw className="size-4" />
                  {t("Recalcular timecodes")}
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTemplateOpen((open) => !open);
                      setExportOpen(false);
                    }}
                  >
                    <Sparkles className="mr-2 size-4" />
                    {t("Modelos")}
                  </Button>
                  {templateOpen && (
                    <div className="absolute left-0 top-11 z-20 w-72 rounded-lg border border-border bg-popover p-1 shadow-xl">
                      <button
                        onClick={() => loadTemplate("documentary")}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <strong className="block">{t("Vídeo-ensaio e documentário")}</strong>
                        <span className="text-xs text-muted-foreground">
                          {t("Ritmo documental com cenas e B-roll")}
                        </span>
                      </button>
                      <button
                        onClick={() => loadTemplate("animation")}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <strong className="block">{t("Animação infantil")}</strong>
                        <span className="text-xs text-muted-foreground">
                          {t("Cenas lúdicas com locução e efeitos")}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  title={t("Manual do roteiro audiovisual")}
                  onClick={() => setDocsOpen(true)}
                >
                  <BookOpen className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-md border border-border p-0.5">
                  {(
                    [
                      ["3col", Columns3, "Três colunas com tempo"],
                      ["2col", Columns2, "Duas colunas"],
                      ["storyboard", LayoutGrid, "Storyboard visual"],
                    ] as const
                  ).map(([mode, Icon, label]) => (
                    <Button
                      key={mode}
                      variant={doc.viewMode === mode ? "secondary" : "ghost"}
                      size="sm"
                      title={t(label)}
                      aria-label={t(label)}
                      onClick={() => update({ viewMode: mode })}
                    >
                      <Icon className="size-4" />
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setExportOpen((open) => !open);
                      setTemplateOpen(false);
                    }}
                    className="gap-2"
                  >
                    <Download className="size-4" />
                    {t("Exportar")}
                  </Button>
                  {exportOpen && (
                    <div className="absolute right-0 top-11 z-20 w-56 rounded-lg border border-border bg-popover p-1 shadow-xl">
                      <button
                        onClick={() => {
                          setExportOpen(false);
                          window.print();
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <Printer className="size-4" />
                        {t("Imprimir ou salvar em PDF")}
                      </button>
                      <button
                        onClick={() => void exportMarkdown()}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <FileText className="size-4" />
                        {t("Copiar como Markdown")}
                      </button>
                      <button
                        onClick={exportJson}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <FileJson className="size-4" />
                        {t("Baixar backup JSON")}
                      </button>
                      <button
                        onClick={() => importRef.current?.click()}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <Upload className="size-4" />
                        {t("Importar backup JSON")}
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={importRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(event) => void importJson(event.target.files?.[0])}
                />
              </div>
            </div>

            {doc.viewMode === "storyboard" ? (
              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold">{t("Storyboard sequencial")}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("Visualize cada cena com imagem de referência, duração e direção de áudio.")}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {doc.scenes.map((scene, index) => (
                    <article
                      key={scene.id}
                      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                    >
                      <div className="group relative aspect-video bg-muted">
                        <img
                          src={
                            scene.image ||
                            `https://placehold.co/600x338?text=${encodeURIComponent(`${t("Cena")} ${index + 1}`)}`
                          }
                          alt={`${t("Cena")} ${index + 1}`}
                          className="size-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                        />
                        <div className="absolute left-2 top-2 rounded bg-background/90 px-2 py-1 font-mono text-xs">
                          {String(index + 1).padStart(2, "0")} · {scene.timeStart}–{scene.timeEnd}
                        </div>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute bottom-2 right-2 opacity-90"
                          title={t("Editar imagem de referência")}
                          onClick={() => setImageScene(scene)}
                        >
                          <ImageIcon className="size-4" />
                        </Button>
                      </div>
                      <div className="space-y-3 p-3">
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                            <strong className="text-primary">{t("Vídeo e enquadramento")}</strong>
                            <span>
                              {Math.max(0, seconds(scene.timeEnd) - seconds(scene.timeStart))}s
                            </span>
                          </div>
                          <p className="line-clamp-4 whitespace-pre-line text-sm">
                            {scene.video || t("Sem descrição visual.")}
                          </p>
                        </div>
                        <div className="border-t border-border pt-2">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {t("Áudio e locução")}
                          </span>
                          <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
                            {scene.audio || t("Sem áudio registrado.")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPromptType("image");
                              setPromptScene(scene.id);
                            }}
                            className="gap-1 text-primary"
                          >
                            <Sparkles className="size-3.5" />
                            {t("Prompt de IA")}
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveScene(index, -1)}
                              aria-label={t("Subir cena")}
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveScene(index, 1)}
                              aria-label={t("Descer cena")}
                            >
                              <ArrowDown className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[960px] border-collapse">
                    <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
                      <tr>
                        {doc.viewMode === "3col" && (
                          <th className="w-32 px-3 py-3">{t("Tempo")}</th>
                        )}
                        <th className="min-w-[390px] px-3 py-3">
                          {t("Vídeo, cena e enquadramento")}
                        </th>
                        <th className="min-w-[390px] px-3 py-3">
                          {t("Áudio, narração, trilha e efeitos")}
                        </th>
                        <th className="w-40 px-2 py-3 text-center">{t("Ações")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {doc.scenes.map((scene, index) => (
                        <tr key={scene.id} className="align-top">
                          {doc.viewMode === "3col" && (
                            <td className="space-y-2 px-3 py-3">
                              <label className="block">
                                <span className="mb-1 block text-[10px] text-muted-foreground">
                                  {t("Início")}
                                </span>
                                <input
                                  value={scene.timeStart}
                                  onChange={(event) =>
                                    updateScene(scene.id, { timeStart: event.target.value })
                                  }
                                  className="h-8 w-full rounded border border-input bg-background px-2 font-mono text-xs"
                                />
                              </label>
                              <label className="block">
                                <span className="mb-1 block text-[10px] text-muted-foreground">
                                  {t("Fim")}
                                </span>
                                <input
                                  value={scene.timeEnd}
                                  onChange={(event) =>
                                    updateScene(scene.id, { timeEnd: event.target.value })
                                  }
                                  className="h-8 w-full rounded border border-input bg-background px-2 font-mono text-xs"
                                />
                              </label>
                              <span className="text-[10px] text-muted-foreground">
                                {Math.max(0, seconds(scene.timeEnd) - seconds(scene.timeStart))}s
                              </span>
                            </td>
                          )}
                          <td className="px-3 py-3">
                            <div className="mb-2 flex flex-wrap gap-1">
                              {[
                                ["PG", "PG"],
                                ["PM", "PM"],
                                ["Close-up", "PP"],
                                ["Plano detalhe", "Detalhe"],
                                ["Motion 2D/3D", "Motion"],
                                ["GC / Lettering", "GC"],
                              ].map(([tag, label]) => (
                                <button
                                  key={tag}
                                  onClick={() =>
                                    updateScene(scene.id, {
                                      video: `${scene.video}${scene.video ? "\n" : ""}${tag}`,
                                    })
                                  }
                                  className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:border-primary/50 hover:text-primary"
                                >
                                  {t(
                                    label === "PP"
                                      ? "Close-up"
                                      : label === "Detalhe"
                                        ? "Plano detalhe"
                                        : label === "Motion"
                                          ? "Motion 2D/3D"
                                          : label === "GC"
                                            ? "GC / Lettering"
                                            : label,
                                  )}
                                </button>
                              ))}
                            </div>
                            <Textarea
                              value={scene.video}
                              onChange={(event) =>
                                updateScene(scene.id, { video: event.target.value })
                              }
                              rows={5}
                              className="resize-y text-xs leading-relaxed"
                              placeholder={t(
                                "Descreva o que aparece na cena, o enquadramento e a ação...",
                              )}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <div className="mb-2 flex flex-wrap gap-1">
                              {[
                                ["[NARRADOR (OFF)]:\n", "Narrador"],
                                ["[LOCUTOR (VO)]:\n", "Locutor"],
                                ["[TRILHA]: ", "Trilha"],
                                ["[SFX]: ", "Efeito sonoro"],
                              ].map(([tag, label]) => (
                                <button
                                  key={label}
                                  onClick={() =>
                                    updateScene(scene.id, {
                                      audio: `${scene.audio}${scene.audio ? "\n" : ""}${tag}`,
                                    })
                                  }
                                  className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:border-primary/50 hover:text-primary"
                                >
                                  {t(label)}
                                </button>
                              ))}
                            </div>
                            <Textarea
                              value={scene.audio}
                              onChange={(event) =>
                                updateScene(scene.id, { audio: event.target.value })
                              }
                              rows={5}
                              className="resize-y text-xs leading-relaxed"
                              placeholder={t(
                                "Escreva a narração, a trilha e os efeitos sonoros...",
                              )}
                            />
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                title={t("Gerar prompt de IA")}
                                onClick={() => {
                                  setPromptType("image");
                                  setPromptScene(scene.id);
                                }}
                              >
                                <Sparkles className="size-3.5 text-primary" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                title={t("Subir cena")}
                                onClick={() => moveScene(index, -1)}
                              >
                                <ArrowUp className="size-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                title={t("Descer cena")}
                                onClick={() => moveScene(index, 1)}
                              >
                                <ArrowDown className="size-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                title={t("Duplicar cena")}
                                onClick={() => duplicateScene(index)}
                              >
                                <Copy className="size-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                title={t("Excluir cena")}
                                onClick={() => deleteScene(scene.id)}
                              >
                                <Trash2 className="size-3.5 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
            <p data-script-studio-help className="text-xs text-muted-foreground">
              {t(
                "Use os marcadores rápidos nas caixas de texto para estruturar a escrita técnica.",
              )}
            </p>
          </>
        )}
      </main>

      <Dialog
        open={Boolean(promptScene)}
        onOpenChange={(open) => !open && setPromptScene(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              {t("Prompt generativo de IA")}
            </DialogTitle>
            <DialogDescription>
              {t("Cena")}{" "}
              {String(
                Math.max(1, doc.scenes.findIndex((scene) => scene.id === promptScene) + 1),
              ).padStart(2, "0")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={promptType === "image" ? "default" : "outline"}
              onClick={() => setPromptType("image")}
            >
              {t("Prompt para imagem")}
            </Button>
            <Button
              variant={promptType === "video" ? "default" : "outline"}
              onClick={() => setPromptType("video")}
            >
              {t("Prompt para vídeo")}
            </Button>
          </div>
          <label className="text-xs font-medium text-muted-foreground">
            {t("Prompt otimizado em inglês técnico")}
          </label>
          <Textarea readOnly value={promptText} rows={6} className="font-mono text-xs" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptScene(undefined)}>
              {t("Fechar")}
            </Button>
            <Button
              onClick={() => {
                void navigator.clipboard
                  .writeText(promptText)
                  .then(() => toast.success(t("Prompt copiado.")))
                  .catch(() => toast.error(t("Não foi possível copiar o roteiro.")));
              }}
            >
              {t("Copiar prompt")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Manual do roteirista audiovisual")}</DialogTitle>
            <DialogDescription>
              {t("Boas práticas para roteiro em colunas, storyboard e geração visual com IA.")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold">{t("Sincronia entre imagem e áudio")}</h3>
              <p className="mt-1 text-muted-foreground">
                {t(
                  "Tudo o que está na linha visual acontece no mesmo intervalo em que a linha de áudio é reproduzida. Planeje imagem e som juntos em cada cena.",
                )}
              </p>
            </section>
            <section>
              <h3 className="font-semibold">{t("Roteiro e storyboard")}</h3>
              <p className="mt-1 text-muted-foreground">
                {t(
                  "Use uma cena por quadro e descreva enquadramento, ação e movimento. A prancha ajuda a revisar ritmo e continuidade.",
                )}
              </p>
            </section>
            <section>
              <h3 className="font-semibold">{t("Prompts visuais")}</h3>
              <p className="mt-1 text-muted-foreground">
                {t(
                  "Gere imagens por cena usando uma referência visual consistente. Para image-to-video, use a imagem aprovada como quadro inicial e descreva o movimento desejado.",
                )}
              </p>
            </section>
          </div>
          <DialogFooter>
            <Button onClick={() => setDocsOpen(false)}>{t("Fechar")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(imageScene)} onOpenChange={(open) => !open && setImageScene(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Imagem de referência")}</DialogTitle>
            <DialogDescription>
              {t("Cole o endereço público de uma imagem para esta cena.")}
            </DialogDescription>
          </DialogHeader>
          <input
            value={imageScene?.image || ""}
            onChange={(event) =>
              setImageScene((current) =>
                current ? { ...current, image: event.target.value } : current,
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="https://"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageScene(undefined)}>
              {t("Cancelar")}
            </Button>
            <Button
              onClick={() => {
                if (imageScene) updateScene(imageScene.id, { image: imageScene.image });
                setImageScene(undefined);
              }}
            >
              {t("Salvar imagem")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function VisualStyleGuide({ t }: { t: (source: string) => string }) {
  const [guideSection, setGuideSection] = useState<"styles" | "camera">("styles");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("Todos");
  const [niche, setNiche] = useState("Todos");
  const [selected, setSelected] = useState<VisualStyle>();
  const [copied, setCopied] = useState(false);
  const niches = [...new Set(visualStyles.map((style) => style.youtube.primaryNiche))];
  const filtered = visualStyles.filter((style) => {
    const matchesFamily = family === "Todos" || style.categoryLabel === family;
    const matchesNiche = niche === "Todos" || style.youtube.primaryNiche === niche;
    const haystack = [
      style.name,
      style.categoryLabel,
      style.badge,
      style.vibe,
      style.keyElements.join(" "),
      style.colors.map((color) => `${color.name} ${color.hex}`).join(" "),
      style.audioStyle,
      style.youtube.primaryNiche,
      style.youtube.subNiches.join(" "),
      style.youtube.videoThemes.join(" "),
      style.youtube.referenceChannels.join(" "),
      style.aiPrompt,
    ]
      .join(" ")
      .toLowerCase();
    return matchesFamily && matchesNiche && haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Film className="size-4" />
              {t("Diretório visual & estratégia de conteúdo")}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("Linguagens visuais para vídeo & YouTube")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Explore estilos visuais, referências e ideias de títulos para definir a identidade estética de cada roteiro.",
              )}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
            {[
              ["25", t("Estilos mapeados")],
              ["5", t("Famílias estéticas")],
              [
                String(
                  visualStyles.reduce(
                    (total, style) => total + style.youtube.videoThemes.length,
                    0,
                  ),
                ),
                t("Ideias de títulos"),
              ],
              ["IA", t("Prompts prontos")],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-border bg-muted/40 px-3 py-2">
                <strong className="block text-base text-foreground">{value}</strong>
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav aria-label={t("Seções do guia visual")} className="flex flex-wrap gap-2">
        <Button
          variant={guideSection === "styles" ? "default" : "outline"}
          onClick={() => setGuideSection("styles")}
        >
          <Film className="mr-2 size-4" />
          {t("Estilos visuais")}
        </Button>
        <Button
          variant={guideSection === "camera" ? "default" : "outline"}
          onClick={() => setGuideSection("camera")}
        >
          <Camera className="mr-2 size-4" />
          {t("Câmera e direção")}
        </Button>
      </nav>

      {guideSection === "camera" ? (
        <CameraDirectionGuide t={t} />
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative block w-full md:max-w-sm">
                  <span className="sr-only">{t("Buscar estilo, nicho ou referência...")}</span>
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t("Buscar estilo, nicho ou referência...")}
                    className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="shrink-0">{t("Nicho do YouTube:")}</span>
                  <select
                    value={niche}
                    onChange={(event) => setNiche(event.target.value)}
                    className="h-10 min-w-48 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  >
                    <option value="Todos">{t("Todos os nichos")}</option>
                    {niches.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <span className="text-xs text-muted-foreground">
                {t("Exibindo")} {filtered.length} {t("de")} {visualStyles.length} {t("estilos")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2" aria-label={t("Filtrar família visual")}>
              {visualStyleFamilies.map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={family === item ? "default" : "outline"}
                  onClick={() => setFamily(item)}
                >
                  {item === "Todos" ? t("Todos os estilos") : t(item)}
                  <span className="ml-2 text-xs opacity-70">
                    {item === "Todos"
                      ? visualStyles.length
                      : visualStyles.filter((style) => style.categoryLabel === item).length}
                  </span>
                </Button>
              ))}
            </div>
            {filtered.length ? (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {filtered.map((style) => (
                  <article
                    key={style.id}
                    className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <img
                      src={`/images/visual-style-guide/${style.image.split("/").at(-1)}`}
                      alt={style.name}
                      loading="lazy"
                      className="mb-4 aspect-video w-full rounded-lg border border-border object-cover"
                    />
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        {t(style.categoryLabel)}
                      </span>
                      <span className="text-right text-xs text-muted-foreground">
                        {style.badge}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold leading-snug">{style.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{style.vibe}</p>
                    <div className="mt-3 flex gap-1.5" aria-label={t("Paleta cromática")}>
                      {style.colors.map((color) => (
                        <span
                          key={color.hex}
                          title={`${color.name}: ${color.hex}`}
                          className="size-5 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                    <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs">
                      <span className="font-semibold text-primary">{t("Nicho recomendado")}</span>
                      <p className="mt-1 text-foreground">{style.youtube.primaryNiche}</p>
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">{t("Ideias de títulos")}</p>
                      {style.youtube.videoThemes.slice(0, 2).map((example) => (
                        <p key={example}>▶ {example}</p>
                      ))}
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                      <p className="line-clamp-2 text-[11px] text-muted-foreground">
                        <strong>{t("Referências")}: </strong>
                        {style.youtube.referenceChannels.join(", ")}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => {
                          setSelected(style);
                          setCopied(false);
                        }}
                      >
                        {t("Ver guia")}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                {t("Nenhum estilo encontrado.")}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("Guia rápido de combinação")}
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              {t("Matriz estratégica: nicho × linguagem visual")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("Use o nicho e o efeito desejado para encontrar uma direção visual inicial.")}
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-3 py-2">{t("Nicho / canal")}</th>
                    <th className="px-3 py-2">{t("Estilo visual recomendado")}</th>
                    <th className="px-3 py-2">{t("Efeito")}</th>
                    <th className="px-3 py-2">{t("Referências")}</th>
                  </tr>
                </thead>
                <tbody>
                  {visualStyles.map((style) => (
                    <tr key={style.id} className="border-b border-border/60">
                      <td className="px-3 py-2.5">{style.youtube.primaryNiche}</td>
                      <td className="px-3 py-2.5 font-medium">{style.name}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {style.vibe.split(",")[0]}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {style.youtube.referenceChannels.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(undefined)}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogDescription>
                  {t(selected.categoryLabel)} · {t("Guia de estilo visual")}
                </DialogDescription>
                <DialogTitle>{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <img
                  src={`/images/visual-style-guide/${selected.image.split("/").at(-1)}`}
                  alt={selected.name}
                  className="aspect-video w-full rounded-lg border border-border object-cover"
                />
                <section>
                  <h3 className="font-semibold">{t("Personalidade visual")}</h3>
                  <p className="mt-1 text-muted-foreground">{selected.vibe}</p>
                </section>
                <section>
                  <h3 className="font-semibold">{t("Paleta cromática")}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.colors.map((color) => (
                      <span
                        key={color.hex}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-1 text-xs"
                      >
                        <i
                          className="size-4 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name} · {color.hex}
                      </span>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="font-semibold">{t("Nicho recomendado")}</h3>
                  <p className="mt-1 text-muted-foreground">{selected.youtube.primaryNiche}</p>
                </section>
                <section>
                  <h3 className="font-semibold">{t("Temas e títulos sugeridos")}</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                    {selected.youtube.videoThemes.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold">{t("Subnichos")}</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                    {selected.youtube.subNiches.map((subNiche) => (
                      <li key={subNiche}>{subNiche}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold">{t("Elementos visuais")}</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                    {selected.keyElements.map((element) => (
                      <li key={element}>{element}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold">{t("Canais de referência")}</h3>
                  <p className="mt-1 text-muted-foreground">
                    {selected.youtube.referenceChannels.join(", ")}
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold">{t("Estilo de áudio")}</h3>
                  <p className="mt-1 text-muted-foreground">{selected.audioStyle}</p>
                </section>
                <section>
                  <h3 className="font-semibold">{t("Prompt visual de referência")}</h3>
                  <p className="mt-1 rounded-lg bg-muted p-3 font-mono text-xs text-muted-foreground">
                    {selected.aiPrompt}
                  </p>
                </section>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(undefined)}>
                  {t("Fechar")}
                </Button>
                <Button
                  onClick={() =>
                    void navigator.clipboard
                      .writeText(selected.aiPrompt)
                      .then(() => {
                        setCopied(true);
                        toast.success(t("Prompt copiado."));
                      })
                      .catch(() => toast.error(t("Não foi possível copiar o prompt.")))
                  }
                >
                  {copied ? t("Prompt copiado") : t("Copiar prompt")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CameraDirectionGuide({ t }: { t: (source: string) => string }) {
  const [subject, setSubject] = useState("Uma exploradora");
  const [action, setAction] = useState("atravessa uma estufa abandonada");
  const [environment, setEnvironment] = useState("uma estufa coberta de folhas após a chuva");
  const [framing, setFraming] = useState(shotFramingOptions[0]);
  const [movement, setMovement] = useState(cameraMovementOptions[0]);
  const [lighting, setLighting] = useState(cameraLightingOptions[0]);
  const [mood, setMood] = useState(cameraMoodOptions[0]);
  const [continuity, setContinuity] = useState("");
  const [query, setQuery] = useState("");
  const prompt = `${subject}. ${action}. ${t("A cena acontece em")} ${environment}. ${t("Enquadramento")}: ${framing}. ${t("A câmera")} ${movement}. ${t("Iluminação e cor")}: ${lighting}. ${t("Tom visual")}: ${mood}.${continuity ? ` ${continuity}` : ""} ${t("Manter movimento natural, composição legível e continuidade visual; sem cortes dentro do plano.")}`;
  const normalizedQuery = query.trim().toLowerCase();
  const matchingTerms = cameraDirectionCategories.flatMap((category) =>
    category.terms.filter(([term, meaning]) =>
      `${term} ${meaning} ${category.title}`.toLowerCase().includes(normalizedQuery),
    ),
  ).length;

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("Direção de plano")}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{t("Monte a direção do seu plano")}</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {t(
                "Combine sujeito, ação, enquadramento, movimento, luz e tom em uma instrução clara para cada tomada.",
              )}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {cameraDirectionTermCount} {t("termos de direção")}
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-muted-foreground">
              {t("Sujeito ou personagem")}
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              {t("Ação principal")}
              <input
                value={action}
                onChange={(event) => setAction(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground sm:col-span-2">
              {t("Ambiente")}
              <input
                value={environment}
                onChange={(event) => setEnvironment(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              {t("Enquadramento")}
              <select
                value={framing}
                onChange={(event) => setFraming(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {shotFramingOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              {t("Movimento")}
              <select
                value={movement}
                onChange={(event) => setMovement(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {cameraMovementOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              {t("Luz e cor")}
              <select
                value={lighting}
                onChange={(event) => setLighting(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {cameraLightingOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              {t("Tom visual")}
              <select
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {cameraMoodOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground sm:col-span-2">
              {t("Continuidade, áudio ou restrição (opcional)")}
              <input
                value={continuity}
                onChange={(event) => setContinuity(event.target.value)}
                placeholder={t(
                  "Ex.: manter o mesmo figurino; sem diálogo; passos sobre folhas molhadas.",
                )}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              />
            </label>
          </div>
          <div className="flex flex-col rounded-lg border border-border bg-muted/30 p-3">
            <label
              htmlFor="camera-direction-prompt"
              className="text-xs font-medium text-muted-foreground"
            >
              {t("Prompt do plano")}
            </label>
            <Textarea
              id="camera-direction-prompt"
              readOnly
              value={prompt}
              className="mt-2 min-h-48 flex-1 resize-y bg-background font-mono text-xs leading-relaxed"
            />
            <Button
              className="mt-3 self-start"
              onClick={() =>
                void navigator.clipboard
                  .writeText(prompt)
                  .then(() => toast.success(t("Prompt copiado.")))
                  .catch(() => toast.error(t("Não foi possível copiar o prompt.")))
              }
            >
              <Copy className="mr-2 size-4" />
              {t("Copiar prompt")}
            </Button>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {t(
            "Os controles e nomes de menus podem mudar conforme modelo, conta, plano, plataforma e região. Confirme os recursos disponíveis na documentação atual do Flow.",
          )}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {t("Princípios de direção")}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {flowDirectingPrinciples.map(([title, description]) => (
            <article key={title} className="rounded-lg border border-border bg-muted/20 p-4">
              <h3 className="text-sm font-semibold">{t(title)}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t(description)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("Vocabulário visual")}
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              {t("Movimentos, enquadramentos e recursos de imagem")}
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {t(
                "Pesquise e copie termos para usar como referências de direção dentro dos prompts.",
              )}
            </p>
          </div>
          <label className="relative block w-full md:max-w-sm">
            <span className="sr-only">{t("Buscar movimento, luz ou enquadramento...")}</span>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Buscar movimento, luz ou enquadramento...")}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cameraDirectionCategories.map((category) => {
            const terms = category.terms.filter(([term, meaning]) =>
              `${term} ${meaning} ${category.title}`.toLowerCase().includes(normalizedQuery),
            );
            if (!terms.length) return null;
            return (
              <section
                key={category.title}
                className="rounded-lg border border-border bg-muted/20 p-3"
              >
                <h3 className="mb-2 text-sm font-semibold">{t(category.title)}</h3>
                <div className="space-y-1">
                  {terms.map(([term, meaning]) => (
                    <button
                      key={`${category.title}-${term}`}
                      type="button"
                      title={t("Copiar termo")}
                      aria-label={`${t("Copiar termo")}: /${term}, ${meaning}`}
                      onClick={() =>
                        void navigator.clipboard
                          .writeText(`/${term}`)
                          .then(() => toast.success(t("Termo copiado")))
                          .catch(() => toast.error(t("Não foi possível copiar o termo.")))
                      }
                      className="flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-accent"
                    >
                      <code className="shrink-0 text-primary">/{term}</code>
                      <span className="text-right text-muted-foreground">{meaning}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        <p className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          {t(
            "Os termos com barra são atalhos de direção visual dos guias consultados. Use-os como vocabulário para descrever a tomada; não são comandos oficiais nem garantem uma função específica no Google Flow.",
          )}
        </p>
        <span className="sr-only" aria-live="polite">
          {matchingTerms} {t("termos encontrados")}
        </span>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {t("Da campanha ao documentário")}
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          {t("Um fluxo de produção, do argumento à montagem")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {flowProductionStages.map(([title, description], index) => (
            <article key={title} className="rounded-lg border border-border bg-muted/20 p-4">
              <span className="text-xs font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-sm font-semibold">{t(title)}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t(description)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
