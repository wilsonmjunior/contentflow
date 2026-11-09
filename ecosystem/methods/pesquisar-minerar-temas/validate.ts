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

const path = fileURLToPath(
  new URL("./pesquisar-minerar-temas.contentflow-method.json", import.meta.url),
);
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
parsed.method.blocks = normalizeMethodBlocks(parsed.method.blocks, "theme");
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
  methods: { theme: parsed.method },
  plugins: [{ plugin, enabled: true, connections: [], profiles: [] }],
  collections: [],
});
assert.deepEqual(result.errors, []);
assert.deepEqual(result.warnings, []);
const method = result.methods!.theme!;
assert.equal(method.blocks.length, 8);
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
      project: { title: "Pesquisa de temas" },
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
  outputKey: "research_plan",
};
assert.equal(
  validateBuilderMethods({
    channel,
    methods: { theme: broken },
    plugins: [{ plugin, enabled: true, connections: [], profiles: [] }],
    collections: [],
  }).ok,
  false,
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
      providerExecution: "NOT_RUN",
    },
    null,
    2,
  ),
);
