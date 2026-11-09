import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  parseMethodFile,
  parseMethodImportFile,
  serializeMethodFile,
  serializeMethodPackFile,
  copyImportedMethods,
} from "../../../src/lib/method-file";
import { normalizeMethodBlocks } from "../../../src/lib/human-workflow";
import { resolveInstructionTemplate } from "../../../src/lib/instruction-template";
import { deriveProcessOutput } from "../../../src/lib/process-output";
import { validateBuilderMethods } from "../../../server/builder-methods";
import { validatePluginManifest } from "../../../server/plugin-validation";
import { compileSrt } from "../../plugins/reference/assemblyai-srt/handler.mjs";
import type { Channel, ProcessMethod, ProcessExecution } from "../../../src/lib/domain";
import type { RegisteredPlugin } from "../../../server/plugin-runner";

const directory = new URL("./", import.meta.url);
const names = ["roteiro-duas-colunas", "narracao-timestamps-reais"];
const files = names.map((name) =>
  parseMethodFile(readFileSync(new URL(name + ".contentflow-method.json", directory), "utf8")),
);
const methods = files.map((file) => ({
  ...file.method,
  blocks: normalizeMethodBlocks(file.method.blocks, file.method.processType),
}));
const plugins = ["chatgpt-browser-studio", "assemblyai-srt"].map((name) => {
  const manifest = validatePluginManifest(
    JSON.parse(
      readFileSync(
        new URL("../../plugins/reference/" + name + "/contentflow.plugin.json", directory),
        "utf8",
      ),
    ),
  );
  return {
    plugin: {
      id: manifest.id,
      source: "local",
      directory: name,
      absoluteDirectory: "",
      entrypoint: manifest.entrypoint,
      executable: true,
      manifest,
    } as RegisteredPlugin,
    enabled: true,
    connections:
      manifest.id === "com.andremjr.assemblyai-srt"
        ? [{ id: "validation-only-connection", name: "Validation fixture", connected: true }]
        : [],
    profiles: [],
  };
});
const channel = {
  id: "validation-only",
  name: "Canal de teste",
  niche: "História da ciência",
  language: "pt-BR",
  methods: {},
} as Channel;
// A portable Method correctly requires local association. Validate that it
// blocks before association; no real connection or credential is created here.
const unconfigured = validateBuilderMethods({
  channel,
  methods: Object.fromEntries(methods.map((m) => [m.processType, m])),
  plugins,
  collections: [],
});
assert.equal(unconfigured.ok, false);
assert.ok(unconfigured.errors.some((message) => message.includes("conexão")));
const configured = structuredClone(methods);
for (const m of configured)
  for (const b of m.blocks)
    if (b.plugin?.pluginId === "com.andremjr.assemblyai-srt")
      b.plugin.connectionId = "validation-only-connection";
const validate = (values: ProcessMethod[], selectedChannel = channel) =>
  validateBuilderMethods({
    channel: selectedChannel,
    methods: Object.fromEntries(values.map((m) => [m.processType, m])),
    plugins,
    collections: [],
  });
const result = validate(configured);
assert.deepEqual(result.errors, []);
assert.deepEqual(result.warnings, []);
const script = result.methods!.script!;
const narration = result.methods!.narration!;
let resolvedCount = 0;
for (const config of [
  channel,
  { ...channel, name: "Astronomy", niche: "Exoplanets", language: "en-US" },
]) {
  for (const m of [script, narration])
    for (const b of m.blocks) {
      const resolved = resolveInstructionTemplate(b.instructions ?? "", {
        channel: config,
        project: { title: "Roteiro e sincronia" },
        block: { name: b.name!, type: b.type },
        inputs: [],
        parameters: Object.fromEntries(b.parameters.map((p) => [p.key, p.value])),
      });
      assert.deepEqual(resolved.unresolved, []);
      assert.ok(resolved.instruction.includes(config.niche));
      resolvedCount++;
    }
}
const originals = [
  "../pesquisar-minerar-temas/pesquisar-minerar-temas",
  "../criar-titulos/criar-titulos",
  "../criar-thumbnails/criar-thumbnails",
].map(
  (name) =>
    parseMethodFile(readFileSync(new URL(name + ".contentflow-method.json", directory), "utf8"))
      .method,
);
const full = validate([...originals, script, narration]);
assert.deepEqual(full.errors, []);
assert.deepEqual(full.warnings, []);
const asr = narration.blocks.find((b) => b.id === "narracao-transcrever")!;
assert.equal(asr.plugin!.configuration.segmentationMode, "max_words");
assert.equal(asr.plugin!.configuration.maxWordsPerCue, 1);
const syntheticWords = [
  { text: "Olhe", start: 825, end: 1090 },
  { text: "este", start: 2110, end: 2350 },
  { text: "gráfico.", start: 2370, end: 3025 },
];
const srt = compileSrt(syntheticWords, asr.plugin!.configuration);
assert.equal(
  srt,
  "1\n00:00:00,825 --> 00:00:01,090\nOlhe\n\n2\n00:00:02,110 --> 00:00:02,350\neste\n\n3\n00:00:02,370 --> 00:00:03,025\ngráfico.\n",
);
const wrongOrder = {
  ...channel,
  processOrder: [
    "theme",
    "title",
    "thumbnail",
    "narration",
    "script",
    "assets",
    "editing",
    "publishing",
  ],
} as Channel;
assert.equal(validate([script, narration], wrongOrder).ok, false);
const cyclic = structuredClone(script);
cyclic.blocks[0].inputs!.push({
  id: "invalid-cycle",
  label: "Áudio futuro",
  shape: { kind: "content", family: "audio", cardinality: "one", representation: "artifact" },
  binding: { kind: "previous_process", processType: "narration", outputKey: "audio" },
  portKey: "attachments",
});
assert.equal(validate([cyclic, narration]).ok, false);
let counter = 0;
const copied = copyImportedMethods([script, narration], (prefix) => prefix + "-" + ++counter);
const extractionId = copied[0].blocks.find(
  (b) => b.name === "Separar texto literal para narrar",
)!.id;
assert.ok(
  copied[1].blocks[0].inputs!.some(
    (i) => i.binding.kind === "previous_process" && i.binding.blockId === extractionId,
  ),
);
const fixtureAudio = {
  id: "fixture-audio",
  name: "narracao.wav",
  mimeType: "audio/wav",
  size: 100,
  url: "/api/files/fixture-audio",
};
const fixtureExecution = {
  processType: "narration",
  methodSnapshot: narration,
  blocks: narration.blocks.map((b) => ({
    blockId: b.id,
    status: "completed",
    values:
      b.id === "narracao-audio-final"
        ? { audio: fixtureAudio }
        : b.id === "narracao-sincronizar"
          ? { timed_script: "Tabela ajustada" }
          : {},
  })),
} as unknown as ProcessExecution;
assert.deepEqual(deriveProcessOutput(fixtureExecution)!.values.audio, fixtureAudio);
for (const [index, m] of [script, narration].entries()) {
  const serialized = serializeMethodFile(files[index].name, m);
  const portable = parseMethodFile(serialized);
  assert.deepEqual(parseMethodImportFile(serialized), portable);
  for (const b of portable.method.blocks) {
    assert.equal(b.plugin?.connectionId, undefined);
    assert.equal(b.plugin?.profileExecution, undefined);
  }
  if (process.argv.includes("--write"))
    writeFileSync(new URL(names[index] + ".contentflow-method.json", directory), serialized + "\n");
}
const pack = serializeMethodPackFile(
  "Roteiro em duas colunas + sincronização da narração",
  "Canal de destino",
  [script, narration],
);
assert.equal(parseMethodImportFile(pack).format, "contentflow-method-pack");
if (process.argv.includes("--write"))
  writeFileSync(
    new URL("roteiro-e-sincronizacao.contentflow-method-pack.json", directory),
    pack + "\n",
  );
console.log(
  JSON.stringify(
    {
      parserAndImport: "PASS",
      builderWithFixtureConnection: "PASS",
      missingConnectionBlocked: true,
      fiveMethodsIntegration: "PASS",
      crossProcessIdRemapping: "PASS",
      templates: resolvedCount,
      sourceWordTimestampsPreserved: "PASS (synthetic provider words)",
      audioOfficialOutputPreserved: "PASS",
      invalidOrderAndCycleRejected: true,
      actualTranscriptionAndSceneAlignment: "NOT_RUN",
    },
    null,
    2,
  ),
);
