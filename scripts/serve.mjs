import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const projectDirectory = new URL("../", import.meta.url);
const port = Number(process.env.PUREATHLETIC_PORT || 3000);
const host = "0.0.0.0";
const pageRoutes = new Set([
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
]);
const assetPaths = new Map([
  ["/favicon.svg", "favicon.svg"],
  ["/styles.css", "styles.css"],
  ["/app.js", "app.js"],
  ["/data/youth-football/sources.json", "data/youth-football/sources.json"],
  ["/data/youth-football/taxonomy.json", "data/youth-football/taxonomy.json"],
  ["/data/youth-football/routine-catalog.json", "data/youth-football/routine-catalog.json"],
  ["/data/youth-football/recommendation-index.json", "data/youth-football/recommendation-index.json"],
  ["/test/browser-smoke.html", "test/browser-smoke.html"],
  ["/test/responsive-smoke.html", "test/responsive-smoke.html"]
]);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function normalizedRoute(pathname) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function contentType(fileName) {
  const extension = fileName.slice(fileName.lastIndexOf("."));
  return contentTypes[extension] || "application/octet-stream";
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const route = normalizedRoute(url.pathname);
    const assetFile = assetPaths.get(url.pathname);
    const isPageRoute = pageRoutes.has(route)
      || /^\/training\/session\/[^/]+$/.test(route);
    const fileName = assetFile || (isPageRoute ? "index.html" : null);

    if (!fileName) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const body = await readFile(new URL(fileName, projectDirectory));
    response.writeHead(200, {
      "content-type": contentType(fileName),
      "cache-control": fileName === "index.html" ? "no-cache" : "no-store"
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Could not load the local preview.");
    console.error(error);
  }
});

server.listen(port, host, () => {
  console.log(`PureAthletic is available at http://localhost:${port}`);
});
