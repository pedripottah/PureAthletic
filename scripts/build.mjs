import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const projectDirectory = new URL("../", import.meta.url);
const staticFiles = ["index.html", "styles.css", "app.js"];
const contentTypes = {
  "index.html": "text/html; charset=utf-8",
  "styles.css": "text/css; charset=utf-8",
  "app.js": "text/javascript; charset=utf-8"
};

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const files = {};

for (const file of staticFiles) {
  await copyFile(new URL(file, projectDirectory), new URL(file, outputDirectory));
  files[`/${file}`] = {
    body: await readFile(new URL(file, projectDirectory), "utf8"),
    type: contentTypes[file]
  };
}

files["/"] = files["/index.html"];

await mkdir(new URL("server/", outputDirectory), { recursive: true });
await mkdir(new URL(".openai/", outputDirectory), { recursive: true });
await copyFile(
  new URL(".openai/hosting.json", projectDirectory),
  new URL(".openai/hosting.json", outputDirectory)
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
