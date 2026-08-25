import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

import {
  deployedFiles,
  isPageRoute,
  previewOnlyFiles
} from "../lib/site-manifest.mjs";

const projectDirectory = new URL("../", import.meta.url);
const port = Number(process.env.PUREATHLETIC_PORT || 3000);
const host = "0.0.0.0";
const previewFiles = new Map(
  [...deployedFiles, ...previewOnlyFiles].map((asset) => [asset.path, asset])
);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const asset = previewFiles.get(url.pathname);
    const fileName = asset?.file || (isPageRoute(url.pathname) ? "index.html" : null);

    if (!fileName) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const body = await readFile(new URL(fileName, projectDirectory));
    response.writeHead(200, {
      "content-type": asset?.type || "text/html; charset=utf-8",
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
