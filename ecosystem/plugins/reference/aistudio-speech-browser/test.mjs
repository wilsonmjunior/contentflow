import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { __test, execute } from "./handler.mjs";

const manifest = JSON.parse(
  await readFile(new URL("./contentflow.plugin.json", import.meta.url), "utf8"),
);

function services(root) {
  const outputs = new Map();
  return {
    signal: undefined,
    getWorkspacePath: (relative = ".") => join(root, "workspace", relative),
    getOutputPath: (name) => {
      const path = join(root, "output", name);
      outputs.set(name, path);
      return path;
    },
    getSecret: async () => "",
    resolveInputFile: async () => {
      throw new Error("resolveInputFile não deve ser chamado neste teste.");
    },
    publishPartial: async () => undefined,
    outputs,
  };
}

function request(overrides = {}) {
  return {
    executionId: "fixture-aistudio-speech",
    traceId: "fixture-aistudio-speech-trace",
    blockId: "fixture-generate-speech",
    capabilityId: "generate-speech-in-browser",
    attempt: 1,
    invocation: { mode: "start" },
    configuration: {
      accountProfile: "default",
      model: "gemini-3.8-flash-tts",
      voice: "Kore",
      styleInstructions: "Calm and clear narration.",
      ...overrides.configuration,
    },
    settings: {
      diagnosticFixture: true,
      ...overrides.settings,
    },
    inputs: {
      text: "Olá, este é um teste de narração.",
      ...overrides.inputs,
    },
    resolvedInstruction: overrides.resolvedInstruction ?? "",
    context: {
      locale: "pt-BR",
      channel: { id: "c1", name: "Canal", niche: "Testes" },
      project: { id: "p1", title: "Projeto" },
      processType: "narration",
      block: { type: "CRIAR", name: "Narrar", instructions: "Narração clara." },
    },
    ...overrides,
  };
}

test("manifesto declara capability de narração com áudio artifact", () => {
  assert.equal(manifest.id, "local.contentflow.aistudio-speech-browser");
  assert.equal(manifest.apiVersion, "2");
  assert.equal(manifest.browserRuntime.lifecycle, "core");
  assert.equal(manifest.profileSetup.configurationKey, "accountProfile");
  assert.equal(manifest.capabilities.length, 1);
  const capability = manifest.capabilities[0];
  assert.equal(capability.id, "generate-speech-in-browser");
  assert.equal(capability.operator, "IA");
  assert.deepEqual(capability.blockTypes, ["CRIAR"]);
  assert.ok(capability.processTypes.includes("narration"));
  assert.equal(capability.inputPorts[0].shape.family, "text");
  assert.equal(capability.outputPorts[0].shape.family, "audio");
  assert.equal(capability.outputPorts[0].shape.representation, "artifact");
  assert.equal(capability.blockConfigSchema.properties.model.default, "gemini-3.8-flash-tts");
  assert.equal(capability.blockConfigSchema.properties.voice.default, "Kore");
  assert.ok(manifest.localizations.en.name);
  assert.ok(manifest.localizations.es.name);
  assert.deepEqual(manifest.permissions, [
    "network",
    "filesystem:read",
    "filesystem:write",
    "process",
  ]);
  assert.ok(manifest.networkHosts.includes("aistudio.google.com"));
});

test("normaliza modelo, voz e URL da página Generate Speech", () => {
  assert.equal(__test.normalizeModel("gemini-3.8-flash-tts"), "gemini-3.8-flash-tts");
  assert.equal(__test.normalizeVoice("Kore"), "Kore");
  assert.equal(
    __test.speechUrl("gemini-3.8-flash-tts"),
    "https://aistudio.google.com/generate-speech?model=gemini-3.8-flash-tts",
  );
  assert.throws(() => __test.normalizeModel("unknown-model"), /Modelo TTS não suportado/);
  assert.throws(() => __test.normalizeVoice("Unknown"), /Voz não suportada/);
});

test("usa instrução do bloco quando styleInstructions está vazio", () => {
  assert.equal(
    __test.styleFromRequest({
      configuration: { styleInstructions: "" },
      resolvedInstruction: "Speak warmly.",
    }),
    "Speak warmly.",
  );
  assert.equal(
    __test.styleFromRequest({
      configuration: { styleInstructions: "Fast and energetic." },
      resolvedInstruction: "Speak warmly.",
    }),
    "Fast and energetic.",
  );
});

test("fixture determinística devolve artifact WAV sem abrir navegador", async () => {
  const root = await mkdtemp(join(tmpdir(), "aistudio-speech-"));
  try {
    await mkdir(join(root, "output"), { recursive: true });
    await mkdir(join(root, "workspace"), { recursive: true });
    const result = await execute(request(), services(root));
    assert.equal(result.status, "success");
    assert.equal(result.values.audio.mimeType, "audio/wav");
    assert.match(result.values.audio.name, /\.wav$/);
    assert.ok(result.values.audio.size > 40);
    assert.equal(result.artifacts.length, 1);
    assert.equal(result.values.metadata[0].model, "gemini-3.8-flash-tts");
    assert.equal(result.values.metadata[0].voice, "Kore");
    assert.equal(result.values.metadata[0].diagnostic, true);
    const bytes = await readFile(join(root, "output", result.values.audio.name));
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("recusa texto vazio na fixture", async () => {
  const root = await mkdtemp(join(tmpdir(), "aistudio-speech-empty-"));
  try {
    await mkdir(join(root, "output"), { recursive: true });
    await mkdir(join(root, "workspace"), { recursive: true });
    const result = await execute(request({ inputs: { text: "   " } }), services(root));
    assert.equal(result.status, "error");
    assert.equal(result.code, "INVALID_INPUT");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("configure/status responde ready false sem marcador de perfil", async () => {
  const root = await mkdtemp(join(tmpdir(), "aistudio-speech-status-"));
  try {
    await mkdir(join(root, "workspace", "default"), { recursive: true });
    const result = await execute(
      request({
        invocation: { mode: "configure", action: "status" },
        settings: { diagnosticFixture: false },
      }),
      services(root),
    );
    assert.equal(result.status, "success");
    assert.equal(result.values.ready, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("grava readiness no workspace sem exigir pasta filha pré-criada", async () => {
  const root = await mkdtemp(join(tmpdir(), "aistudio-speech-ready-"));
  try {
    await mkdir(join(root, "workspace"), { recursive: true });
    await mkdir(join(root, "profile"), { recursive: true });
    const svc = {
      ...services(root),
      getProfilePath: (relative = ".") => join(root, "profile", relative === "." ? "" : relative),
    };
    const runtime = __test.resolveProfileRuntime(
      request({ configuration: { accountProfile: "docone-wilsonmjunior" } }),
      svc,
    );
    assert.match(runtime.readinessPath, /\.contentflow-aistudio-speech-ready-/);
    assert.equal(await __test.profileIsPrepared(runtime, runtime.name), false);
    await __test.markProfilePrepared(runtime, runtime.name);
    assert.equal(await __test.profileIsPrepared(runtime, runtime.name), true);
    const marker = JSON.parse(await readFile(runtime.readinessPath, "utf8"));
    assert.equal(marker.profile, "docone-wilsonmjunior");
    assert.equal(marker.provider, "aistudio.google.com");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("classifica login expirado e cota a partir do estado da página", () => {
  const auth = __test.classifyPageError({
    signedOut: true,
    bodySnippet: "Sign in",
    alerts: [],
  });
  assert.equal(auth.code, "AUTHENTICATION_FAILED");

  const quota = __test.classifyPageError({
    signedOut: false,
    bodySnippet: "You have reached your rate limit",
    alerts: [],
  });
  assert.equal(quota.code, "RATE_LIMIT");
  assert.equal(quota.retryable, true);
});

test("reconhece a página Generate Speech sem exigir botão Run genérico", () => {
  assert.match(__test.PAGE_HELPERS, /ms-speech-prompt/);
  assert.match(__test.PAGE_HELPERS, /Start writing or paste text/);
  assert.match(__test.PAGE_HELPERS, /ms-run-button/);
  assert.equal(
    __test.computeSpeechReady({
      signedOut: false,
      hasSpeechRoot: true,
      speechFieldCount: 0,
      fieldCount: 0,
      hasRun: false,
      url: "https://aistudio.google.com/generate-speech",
    }),
    true,
  );
  assert.equal(
    __test.computeSpeechReady({
      signedOut: false,
      hasSpeechRoot: false,
      speechFieldCount: 1,
      fieldCount: 1,
      hasRun: false,
      url: "https://aistudio.google.com/u/0/generate-speech",
    }),
    true,
  );
  assert.equal(
    __test.computeSpeechReady({
      signedOut: true,
      hasSpeechRoot: false,
      speechFieldCount: 0,
      fieldCount: 0,
      hasRun: false,
      url: "https://accounts.google.com/",
    }),
    false,
  );
});

test("WAV mínimo da fixture é válido", () => {
  const bytes = __test.minimalWavBytes();
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(bytes.subarray(8, 12).toString("ascii"), "WAVE");
  assert.ok(bytes.length > 44);
});
