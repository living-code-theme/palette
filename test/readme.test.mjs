import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { check } from "../scripts/check.mjs";

test("README only promises previews when real captures are declared and keeps flavor activation", async () => {
  const { manifest } = await check();
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  assert.doesNotMatch(readme, /Real application screenshots have not been captured yet\.|A real application capture is not available yet\./);
  if (!manifest.images.length) {
    assert.doesNotMatch(readme, /^## Previews$|full-size preview|<table data-lc-flavors>/m);
    assert.match(readme, /Expand a flavor for its activation instructions\./);
  } else {
    assert.match(readme, /^## Previews$/m);
  }
  for (const flavor of manifest.flavors) {
    const details = readme.match(new RegExp(`<details data-lc-flavor="${flavor}">[\\s\\S]*?<\\/summary>([\\s\\S]*?)<\\/details>`));
    assert.ok(details?.[1].trim(), `${flavor}: activation instructions remain available`);
  }
});
