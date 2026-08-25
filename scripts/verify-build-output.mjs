import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  deployedFiles,
  pageRoutes,
  previewOnlyFiles
} from "../lib/site-manifest.mjs";

const projectDirectory = new URL("../", import.meta.url);
const projectFile = (path) => new URL(path, projectDirectory);

test("the build copies every deployed file without changing its contents", async () => {
  for (const asset of deployedFiles) {
    const [source, built] = await Promise.all([
      readFile(projectFile(asset.file), "utf8"),
      readFile(projectFile(`dist/${asset.file}`), "utf8")
    ]);

    assert.equal(built, source, asset.file);
  }
});

test("the build creates static fallbacks for every known application route", async () => {
  const index = await readFile(projectFile("index.html"), "utf8");

  for (const route of pageRoutes.filter((candidate) => candidate !== "/")) {
    const fallback = await readFile(
      projectFile(`dist${route}/index.html`),
      "utf8"
    );

    assert.equal(fallback, index, route);
  }
});

test("development-only smoke pages are not copied into the deployment", async () => {
  for (const asset of previewOnlyFiles) {
    await assert.rejects(
      readFile(projectFile(`dist/${asset.file}`)),
      (error) => error?.code === "ENOENT",
      asset.file
    );
  }
});

test("the generated hosting adapter serves the deployment contract", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const request = (path, options) => worker.fetch(
    new Request(`https://pureathletic.test${path}`, options)
  );

  for (const path of [...pageRoutes, "/training/session/custom-id"]) {
    const response = await request(path);

    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
    assert.equal(response.headers.get("cache-control"), "no-cache");
    assert.match(await response.text(), /<div id="app">/);
  }

  const assetResponse = await request("/styles.css");
  assert.equal(assetResponse.status, 200);
  assert.equal(assetResponse.headers.get("content-type"), "text/css; charset=utf-8");
  assert.equal(assetResponse.headers.get("cache-control"), "public, max-age=3600");

  const headResponse = await request("/app.js", { method: "HEAD" });
  assert.equal(headResponse.status, 200);
  assert.equal(await headResponse.text(), "");

  const missingResponse = await request("/missing-page");
  assert.equal(missingResponse.status, 404);
  assert.equal(missingResponse.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(await missingResponse.text(), "Not found");
});
