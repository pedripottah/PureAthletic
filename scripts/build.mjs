import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const projectDirectory = new URL("../", import.meta.url);
const pageRoutes = [
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
  "/training/session/tue",
  "/training/session/wed",
  "/training/session/practice",
  "/training/session/fri",
  "/training/session/match",
  "/training/session/sun",
  "/training/session/mon",
  "/activity/log",
  "/training/review",
  "/profile/schedule"
];
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

export default {
  async fetch(request) {
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
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    return new Response(request.method === "HEAD" ? null : file.body, {
      status: 200,
      headers: {
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

console.log(`Built ${staticFiles.length} static files and the hosting adapter in dist/`);
