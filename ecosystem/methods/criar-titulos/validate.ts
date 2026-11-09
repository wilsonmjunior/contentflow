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
import { createChannelHistoryRecordFields } from "../../../src/lib/channel-history";
import { validateBuilderMethods } from "../../../server/builder-methods";
import { validatePluginManifest } from "../../../server/plugin-validation";
import type { Channel } from "../../../src/lib/domain";
import type { RegisteredPlugin } from "../../../server/plugin-runner";

const path = fileURLToPath(new URL("./criar-titulos.contentflow-method.json", import.meta.url));
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
parsed.method.blocks = normalizeMethodBlocks(parsed.method.blocks, "title");
const plugin = {
  id: manifest.id,
  source: "local",
  directory: "chatgpt-browser-studio",
  absoluteDirectory: "",
  entrypoint: manifest.entrypoint,
  executable: true,
  manifest,
} as RegisteredPlugin;
const channel = {
  id: "validation-only",
  name: "Canal de teste",
  niche: "História da ciência",
  language: "pt-BR",
  methods: {},
} as Channel;
const result = validateBuilderMethods({
  channel,
  methods: { title: parsed.method },
  plugins: [{ plugin, enabled: true, connections: [], profiles: [] }],
  collections: [],
});
assert.deepEqual(result.errors, []);
assert.deepEqual(result.warnings, []);
const method = result.methods!.title!;
assert.equal(method.blocks.length, 7);
const history = method.blocks
  .flatMap((b) => b.inputs ?? [])
  .find((i) => i.binding.kind === "channel_history")!;
assert.equal(history.shape.kind, "record");
if (history.shape.kind === "record") {
  assert.deepEqual(
    history.shape.fields.map(({ id: _id, ...f }) => f),
    createChannelHistoryRecordFields({
      kind: "content",
      family: "text",
      cardinality: "one",
      representation: "inline",
    }).map(({ id: _id, ...f }) => f),
  );
}
let resolvedCount = 0;
for (const config of [
  channel,
  { ...channel, name: "Astronomy", niche: "Exoplanets", language: "en-US" },
]) {
  for (const block of method.blocks) {
    const resolved = resolveInstructionTemplate(block.instructions ?? "", {
      channel: config,
      project: { title: "Criação de títulos" },
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
for (const block of method.blocks) {
  assert.equal(block.plugin?.connectionId, undefined);
  assert.equal(block.plugin?.profileExecution, undefined);
  assert.ok(
    !Object.keys(block.plugin?.configuration ?? {}).some((k) =>
      /account|profile|token|secret/i.test(k),
    ),
  );
}
// Deliberate broken binding must be rejected by the real builder validator.
const broken = structuredClone(method);
broken.blocks[1].inputs![0].binding = {
  kind: "previous_block",
  blockId: "does-not-exist",
  outputKey: "title_brief",
};
assert.equal(
  validateBuilderMethods({
    channel,
    methods: { title: broken },
    plugins: [{ plugin, enabled: true, connections: [], profiles: [] }],
    collections: [],
  }).ok,
  false,
);

// Dependency is on the canonical Theme output, independent of its block IDs.
const themeFile = parseMethodFile(
  readFileSync(
    new URL(
      "../pesquisar-minerar-temas/pesquisar-minerar-temas.contentflow-method.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const combined = validateBuilderMethods({
  channel,
  methods: { theme: themeFile.method, title: method },
  plugins: [{ plugin, enabled: true, connections: [], profiles: [] }],
  collections: [],
});
assert.deepEqual(combined.errors, []);
assert.deepEqual(combined.warnings, []);
assert.ok(
  parsed.requirements?.some((r) => r.kind === "previous_process" && r.processType === "theme") ||
    method.blocks.some((b) =>
      b.inputs?.some(
        (i) => i.binding.kind === "previous_process" && i.binding.processType === "theme",
      ),
    ),
);
const wrongOrder = {
  ...channel,
  processOrder: [
    "title",
    "theme",
    "thumbnail",
    "script",
    "narration",
    "assets",
    "editing",
    "publishing",
  ],
} as Channel;
assert.equal(
  validateBuilderMethods({
    channel: wrongOrder,
    methods: { title: method },
    plugins: [{ plugin, enabled: true, connections: [], profiles: [] }],
    collections: [],
  }).ok,
  false,
);
const finalOutput = method.blocks.find((b) => b.id === "titulo-final")!.outputs![0];
assert.equal(finalOutput.key, "title");
assert.deepEqual(finalOutput.shape, {
  kind: "content",
  family: "text",
  cardinality: "one",
  representation: "inline",
});
const exported = parseMethodFile(serialized);
assert.ok(
  exported.requirements!.some((r) => r.kind === "previous_process" && r.processType === "theme"),
);

if (process.argv.includes("--write")) writeFileSync(path, serialized + "\n");
console.log(
  JSON.stringify(
    {
      parser: "PASS",
      importPreviewContract: "PASS",
      builder: "PASS",
      pluginManifest: manifest.version,
      channelTemplates: resolvedCount,
      historyContract: "PASS",
      invalidBindingRejected: true,
      themeAndTitleIntegration: "PASS",
      invalidProcessOrderRejected: true,
      providerExecution: "NOT_RUN",
    },
    null,
    2,
  ),
);
