import assert from "node:assert/strict";
import test from "node:test";

import {
  resetLocalDirectoryDialogState,
  selectLocalDirectory,
} from "./local-directory-dialog";

test.beforeEach(() => {
  resetLocalDirectoryDialogState();
});

test("selectLocalDirectory returns the chosen path from the platform runner", async () => {
  const result = await selectLocalDirectory(async () => ({
    status: "selected",
    path: "/Users/example/plugins/",
  }));
  assert.deepEqual(result, { status: "selected", path: "/Users/example/plugins/" });
});

test("selectLocalDirectory preserves cancellation", async () => {
  const result = await selectLocalDirectory(async () => ({ status: "cancelled" }));
  assert.deepEqual(result, { status: "cancelled" });
});

test("selectLocalDirectory rejects a second concurrent request", async () => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const first = selectLocalDirectory(async () => {
    await gate;
    return { status: "selected", path: "/tmp/plugin" };
  });
  const busy = await selectLocalDirectory(async () => ({
    status: "selected",
    path: "/tmp/other",
  }));
  assert.deepEqual(busy, { status: "busy" });
  release();
  assert.deepEqual(await first, { status: "selected", path: "/tmp/plugin" });
});
