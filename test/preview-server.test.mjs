import assert from "node:assert/strict";
import test from "node:test";

import { createPreviewServer } from "../scripts/serve.mjs";

async function startPreview(t) {
  const server = createPreviewServer();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const { port } = server.address();
  return `http://127.0.0.1:${port}`;
}

test("the local preview serves the application HTTP contract", async (t) => {
  const origin = await startPreview(t);

  await t.test("serves stable and dynamic deep links", async () => {
    for (const path of ["/today", "/profile/schedule/", "/training/session/custom-id"]) {
      const response = await fetch(`${origin}${path}`);

      assert.equal(response.status, 200, path);
      assert.match(response.headers.get("content-type"), /^text\/html/);
      assert.match(await response.text(), /<div id="app">/);
    }
  });

  await t.test("serves deployed and preview-only assets with their content types", async () => {
    for (const [path, contentType] of [
      ["/styles.css", "text/css; charset=utf-8"],
      ["/data/youth-football/taxonomy.json", "application/json; charset=utf-8"],
      ["/test/browser-smoke.html", "text/html; charset=utf-8"]
    ]) {
      const response = await fetch(`${origin}${path}`);

      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get("content-type"), contentType);
      assert.ok((await response.text()).length > 0, `${path} returned an empty body`);
    }
  });

  await t.test("supports HEAD requests without a response body", async () => {
    const response = await fetch(`${origin}/app.js`, { method: "HEAD" });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/javascript; charset=utf-8");
    assert.equal(await response.text(), "");
  });

  await t.test("sends a conservative browser response policy", async () => {
    for (const path of ["/", "/app.js", "/missing-page"]) {
      const response = await fetch(`${origin}${path}`);

      assert.equal(response.headers.get("x-content-type-options"), "nosniff", path);
      assert.equal(response.headers.get("referrer-policy"), "no-referrer", path);
    }
  });

  await t.test("rejects methods that could imply a server-side write", async () => {
    const response = await fetch(`${origin}/today`, { method: "POST" });

    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET, HEAD");
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await response.text(), "Method not allowed");
  });

  await t.test("returns a plain-text 404 for unknown paths", async () => {
    const response = await fetch(`${origin}/missing-page`);

    assert.equal(response.status, 404);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await response.text(), "Not found");
  });
});
