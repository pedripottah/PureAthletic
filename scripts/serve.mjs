import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import {
  deployedFiles,
  isPageRoute,
  previewOnlyFiles
} from "../lib/site-manifest.mjs";

const defaultProjectDirectory = new URL("../", import.meta.url);
const previewFiles = new Map(
  [...deployedFiles, ...previewOnlyFiles].map((asset) => [asset.path, asset])
);
const responseSafetyHeaders = {
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff"
};

export function createPreviewServer(projectDirectory = defaultProjectDirectory) {
  return createServer(async (request, response) => {
    try {
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, {
          ...responseSafetyHeaders,
          "content-type": "text/plain; charset=utf-8",
          allow: "GET, HEAD"
        });
        response.end("Method not allowed");
        return;
      }

      const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
      const asset = previewFiles.get(url.pathname);
      const fileName = asset?.file || (isPageRoute(url.pathname) ? "index.html" : null);

      if (!fileName) {
        response.writeHead(404, {
          ...responseSafetyHeaders,
          "content-type": "text/plain; charset=utf-8"
        });
        response.end("Not found");
        return;
      }

      const body = await readFile(new URL(fileName, projectDirectory));
      response.writeHead(200, {
        ...responseSafetyHeaders,
        "content-type": asset?.type || "text/html; charset=utf-8",
        "cache-control": fileName === "index.html" ? "no-cache" : "no-store"
      });
      response.end(request.method === "HEAD" ? undefined : body);
    } catch (error) {
      response.writeHead(500, {
        ...responseSafetyHeaders,
        "content-type": "text/plain; charset=utf-8"
      });
      response.end("Could not load the local preview.");
      console.error(error);
    }
  });
}

const isCommandLineEntry = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCommandLineEntry) {
  const port = Number(process.env.PUREATHLETIC_PORT || 3000);
  const host = "0.0.0.0";
  const server = createPreviewServer();

  server.listen(port, host, () => {
    console.log(`PureAthletic is available at http://localhost:${port}`);
  });
}
