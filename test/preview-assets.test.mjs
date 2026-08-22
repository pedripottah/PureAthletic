import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readProjectFile = (fileName) =>
  readFile(new URL(`../${fileName}`, import.meta.url), "utf8");

test("the local preview serves every document asset requested by the app shell", async () => {
  const [index, server] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("scripts/serve.mjs")
  ]);

  for (const asset of ["/favicon.svg", "/styles.css", "/app.js"]) {
    assert.match(index, new RegExp(`(?:href|src)="${asset}"`));
    assert.ok(server.includes(`["${asset}",`), `${asset} is not served locally`);
  }
});

test("the local preview exposes both browser smoke pages", async () => {
  const [server, browserSmoke, responsiveSmoke] = await Promise.all([
    readProjectFile("scripts/serve.mjs"),
    readProjectFile("test/browser-smoke.html"),
    readProjectFile("test/responsive-smoke.html")
  ]);

  assert.match(server, /\["\/test\/browser-smoke\.html", "test\/browser-smoke\.html"\]/);
  assert.match(server, /\["\/test\/responsive-smoke\.html", "test\/responsive-smoke\.html"\]/);
  assert.match(browserSmoke, /<iframe id="site" src="\/"/);
  assert.match(responsiveSmoke, /<iframe id="site" src="\/"/);
});
