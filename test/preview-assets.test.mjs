import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  deployedFiles,
  pageRoutes,
  previewOnlyFiles
} from "../lib/site-manifest.mjs";

const readProjectFile = (fileName) =>
  readFile(new URL(`../${fileName}`, import.meta.url), "utf8");

test("the local preview serves every document asset requested by the app shell", async () => {
  const index = await readProjectFile("index.html");
  const previewPaths = new Set(
    [...deployedFiles, ...previewOnlyFiles].map((asset) => asset.path)
  );

  for (const asset of ["/favicon.svg", "/styles.css", "/app.js"]) {
    assert.match(index, new RegExp(`(?:href|src)="${asset}"`));
    assert.ok(previewPaths.has(asset), `${asset} is not served locally`);
  }
});

test("the local preview exposes both browser smoke pages", async () => {
  const [browserSmoke, responsiveSmoke] = await Promise.all([
    readProjectFile("test/browser-smoke.html"),
    readProjectFile("test/responsive-smoke.html")
  ]);
  const previewOnlyPaths = previewOnlyFiles.map((asset) => asset.path);

  assert.ok(previewOnlyPaths.includes("/test/browser-smoke.html"));
  assert.ok(previewOnlyPaths.includes("/test/responsive-smoke.html"));
  assert.match(browserSmoke, /<iframe id="site" src="\/"/);
  assert.match(responsiveSmoke, /<iframe id="site" src="\/"/);
});

test("the shared manifest includes every stable browser route", () => {
  for (const route of [
    "/",
    "/onboarding",
    "/today",
    "/training",
    "/progress",
    "/profile",
    "/check-in",
    "/check-in/result",
    "/safety",
    "/training/workout",
    "/training/workout/short",
    "/activity/log",
    "/training/review",
    "/profile/schedule"
  ]) {
    assert.ok(pageRoutes.includes(route), `${route} is missing from the site manifest`);
  }
});

test("the landing page states the adult-only research boundary", async () => {
  const index = await readProjectFile("index.html");

  assert.match(
    index,
    /<aside class="research-notice" aria-labelledby="research-notice-title">/
  );
  assert.match(index, /Adult research prototype/);
  assert.match(index, /Use fictional profiles only/);
  assert.match(index, /Do not follow its workouts as\s+training or medical advice/);
  assert.doesNotMatch(index, /with parent or guardian approval/);
});
