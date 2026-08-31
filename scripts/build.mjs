import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

import {
  deployedFiles,
  pageRoutes
} from "../lib/site-manifest.mjs";

const outputDirectory = new URL("../dist/", import.meta.url);
const projectDirectory = new URL("../", import.meta.url);

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const files = {};

for (const asset of deployedFiles) {
  const { file } = asset;
  const outputFile = new URL(file, outputDirectory);
  const outputPathParts = file.split("/");
  outputPathParts.pop();
  if (outputPathParts.length) {
    await mkdir(
      new URL(`${outputPathParts.join("/")}/`, outputDirectory),
      { recursive: true }
    );
  }
  await copyFile(new URL(file, projectDirectory), outputFile);
  files[asset.path] = {
    body: await readFile(new URL(file, projectDirectory), "utf8"),
    type: asset.type
  };
}

files["/"] = files["/index.html"];

for (const route of pageRoutes.filter((route) => route !== "/")) {
  const routeDirectory = new URL(`.${route}/`, outputDirectory);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(
    new URL("index.html", projectDirectory),
    new URL("index.html", routeDirectory)
  );
}

await mkdir(new URL("server/", outputDirectory), { recursive: true });
await mkdir(new URL(".openai/", outputDirectory), { recursive: true });
await copyFile(
  new URL(".openai/hosting.json", projectDirectory),
  new URL(".openai/hosting.json", outputDirectory)
);

// These files support the OpenAI hosting adapter but should not be published
// as browser-accessible assets by Cloudflare Workers.
await writeFile(
  new URL(".assetsignore", outputDirectory),
  ".openai/\nserver/\n"
);

const workerSource = `const files = ${JSON.stringify(files)};
const pageRoutes = new Set(${JSON.stringify(pageRoutes)});
const responseSafetyHeaders = {
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff"
};

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: {
          ...responseSafetyHeaders,
          "content-type": "text/plain; charset=utf-8",
          "allow": "GET, HEAD"
        }
      });
    }

    const url = new URL(request.url);
    const normalizedPath = url.pathname === "/"
      ? "/"
      : url.pathname.replace(/\\/+$/, "");
    const file = files[url.pathname]
      || (pageRoutes.has(normalizedPath)
        || /^\\/training\\/session\\/[^/]+$/.test(normalizedPath)
        ? files["/index.html"]
        : null);

    if (!file) {
      return new Response(request.method === "HEAD" ? null : "Not found", {
        status: 404,
        headers: {
          ...responseSafetyHeaders,
          "content-type": "text/plain; charset=utf-8"
        }
      });
    }

    return new Response(request.method === "HEAD" ? null : file.body, {
      status: 200,
      headers: {
        ...responseSafetyHeaders,
        "content-type": file.type,
        "cache-control": file.type.startsWith("text/html")
          ? "no-cache"
          : "public, max-age=3600"
      }
    });
  }
};
`;

await writeFile(new URL("server/index.js", outputDirectory), workerSource);

console.log(`Built ${deployedFiles.length} static files and the hosting adapter in dist/`);
