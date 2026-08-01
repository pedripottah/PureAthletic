import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const projectDirectory = new URL("../", import.meta.url);
const staticFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "data/youth-football/sources.json",
  "data/youth-football/taxonomy.json",
  "data/youth-football/routine-catalog.json",
  "data/youth-football/recommendation-index.json"
];
const contentTypes = {
  "index.html": "text/html; charset=utf-8",
  "styles.css": "text/css; charset=utf-8",
  "app.js": "text/javascript; charset=utf-8",
  "sources.json": "application/json; charset=utf-8",
  "taxonomy.json": "application/json; charset=utf-8",
  "routine-catalog.json": "application/json; charset=utf-8",
  "recommendation-index.json": "application/json; charset=utf-8"
};

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const files = {};

for (const file of staticFiles) {
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
  files[`/${file}`] = {
    body: await readFile(new URL(file, projectDirectory), "utf8"),
    type: contentTypes[file.split("/").at(-1)]
  };
}

files["/"] = files["/index.html"];

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

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const file = files[url.pathname];

    if (!file) {
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    return new Response(request.method === "HEAD" ? null : file.body, {
      status: 200,
      headers: {
        "content-type": file.type,
        "cache-control": url.pathname === "/" || url.pathname === "/index.html"
          ? "no-cache"
          : "public, max-age=3600"
      }
    });
  }
};
`;

await writeFile(new URL("server/index.js", outputDirectory), workerSource);

console.log(`Built ${staticFiles.length} static files and the hosting adapter in dist/`);
