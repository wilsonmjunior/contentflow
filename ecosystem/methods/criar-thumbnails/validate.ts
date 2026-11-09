import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  parseMethodFile,
  parseMethodImportFile,
  serializeMethodFile,
} from "../../../src/lib/method-file";
import { normalizeMethodBlocks } from "../../../src/lib/human-workflow";
import { resolveInstructionTemplate } from "../../../src/lib/instruction-template";
import { deriveProcessOutput } from "../../../src/lib/process-output";
import { validateBuilderMethods } from "../../../server/builder-methods";
import { validatePluginManifest } from "../../../server/plugin-validation";
import type { Channel, ProcessExecution, ProcessMethod } from "../../../src/lib/domain";
import type { RegisteredPlugin } from "../../../server/plugin-runner";

const path = fileURLToPath(new URL("./criar-thumbnails.contentflow-method.json", import.meta.url));
const manifest = validatePluginManifest(
  JSON.parse(
    readFileSync(
      new URL(
        "../../plugins/reference/chatgpt-browser-studio/contentflow.plugin.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ),
);
const parsed = parseMethodFile(readFileSync(path, "utf8"));
parsed.method.blocks = normalizeMethodBlocks(parsed.method.blocks, "thumbnail");
const plugin = {
  id: manifest.id,
  source: "local",
  directory: "chatgpt-browser-studio",
  absoluteDirectory: "",
  entrypoint: manifest.entrypoint,
  executable: true,
  manifest,
} as RegisteredPlugin;
const plugins = [{ plugin, enabled: true, connections: [], profiles: [] }];
const channel = {
  id: "validation-only",
  name: "Canal de teste",
  niche: "História da ciência",
  language: "pt-BR",
  methods: {},
} as Channel;
const validate = (method: ProcessMethod, selectedChannel = channel) =>
  validateBuilderMethods({
    channel: selectedChannel,
    methods: { thumbnail: method },
    plugins,
    collections: [],
  });
const result = validate(parsed.method);
assert.deepEqual(result.errors, []);
assert.deepEqual(result.warnings, []);
const method = result.methods!.thumbnail!;
assert.equal(method.blocks.length, 7);

let resolvedCount = 0;
for (const config of [
  channel,
  { ...channel, name: "Astronomy", niche: "Exoplanets", language: "en-US" },
]) {
  for (const block of method.blocks) {
    const resolved = resolveInstructionTemplate(block.instructions ?? "", {
      channel: config,
      project: { title: "Criação de thumbnail" },
      block: { name: block.name!, type: block.type },
      inputs: [],
      parameters: Object.fromEntries(block.parameters.map((p) => [p.key, p.value])),
    });
    assert.deepEqual(resolved.unresolved, []);
    assert.ok(resolved.instruction.includes(config.niche));
    assert.ok(resolved.instruction.includes(config.language));
    resolvedCount++;
  }
}
const serialized = serializeMethodFile(parsed.name, method);
assert.deepEqual(parseMethodImportFile(serialized), parseMethodFile(serialized));
const exported = parseMethodFile(serialized);
for (const processType of ["theme", "title"]) {
  assert.ok(
    exported.requirements!.some(
      (r) => r.kind === "previous_process" && r.processType === processType,
    ),
  );
}
for (const block of method.blocks) {
  assert.equal(block.plugin?.connectionId, undefined);
  assert.equal(block.plugin?.profileExecution, undefined);
  assert.ok(
    !Object.keys(block.plugin?.configuration ?? {}).some((k) =>
      /account|profile|token|secret/i.test(k),
    ),
  );
}
const themeMethod = parseMethodFile(
  readFileSync(
    new URL(
      "../pesquisar-minerar-temas/pesquisar-minerar-temas.contentflow-method.json",
      import.meta.url,
    ),
    "utf8",
  ),
).method;
const titleMethod = parseMethodFile(
  readFileSync(
    new URL("../criar-titulos/criar-titulos.contentflow-method.json", import.meta.url),
    "utf8",
  ),
).method;
const combined = validateBuilderMethods({
  channel,
  methods: { theme: themeMethod, title: titleMethod, thumbnail: method },
  plugins,
  collections: [],
});
assert.deepEqual(combined.errors, []);
assert.deepEqual(combined.warnings, []);
const wrongOrder = {
  ...channel,
  processOrder: [
    "theme",
    "thumbnail",
    "title",
    "script",
    "narration",
    "assets",
    "editing",
    "publishing",
  ],
} as Channel;
assert.equal(validate(method, wrongOrder).ok, false);

// The final image must come from the native selection, even when it is NOT
// the first image returned by generation. Exercise the real output derivation.
const first = {
  id: "fixture-image-a",
  name: "a.png",
  mimeType: "image/png",
  size: 10,
  url: "/api/files/fixture-image-a",
};
const chosen = {
  id: "fixture-image-b",
  name: "b.png",
  mimeType: "image/png",
  size: 11,
  url: "/api/files/fixture-image-b",
};
const execution = {
  processType: "thumbnail",
  methodSnapshot: method,
  blocks: method.blocks.map((b) => ({
    blockId: b.id,
    status: "completed",
    values:
      b.id === "thumb-gerar"
        ? { thumbnail: first, thumbnail_candidates: [first, chosen] }
        : b.id === "thumb-selecao-final"
          ? { selected_value: chosen }
          : {},
  })),
} as unknown as ProcessExecution;
const derived = deriveProcessOutput(execution)!;
assert.equal(derived.sourceBlockId, "thumb-selecao-final");
assert.deepEqual(derived.values.thumbnail, chosen);
assert.notDeepEqual(derived.values.thumbnail, first);
const generation = method.blocks.find((b) => b.id === "thumb-gerar")!;
const imageCapability = manifest.capabilities.find(
  (c) => c.id === generation.plugin!.capabilityId,
)!;
assert.equal(imageCapability.execution.itemOrchestration?.inputPort, "prompts");
assert.ok(
  generation.inputs!.some((i) => i.portKey === "prompts" && i.shape.cardinality === "many"),
);
const broken = structuredClone(method);
broken.blocks.find((b) => b.id === "thumb-analise")!.inputs![0].shape = {
  kind: "content",
  family: "text",
  cardinality: "many",
  representation: "inline",
};
assert.equal(validate(broken).ok, false);
if (process.argv.includes("--write")) writeFileSync(path, serialized + "\n");
console.log(
  JSON.stringify(
    {
      parser: "PASS",
      importContract: "PASS",
      builder: "PASS",
      pluginManifest: manifest.version,
      channelTemplates: resolvedCount,
      themeTitleThumbnailIntegration: "PASS",
      chosenImagePromoted: "PASS",
      imageBatchContract: "PASS",
      wrongMediaBindingRejected: true,
      invalidProcessOrderRejected: true,
      providerExecution: "NOT_RUN",
    },
    null,
    2,
  ),
);
