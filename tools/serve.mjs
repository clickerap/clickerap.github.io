// Een kleine webserver voor lokaal spelen en voor de browsertests.
// Draaien met:  npm start   (of: node tools/serve.mjs [poort])
//
// Het spel gebruikt ES-modules; die laden niet als je index.html los opent.

import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

export function startServer({ port = 0, root = ROOT } = {}) {
  const server = http.createServer(async (req, res) => {
    const pad = normalize(decodeURIComponent(new URL(req.url, "http://localhost").pathname)).replace(/^[/\\]+/, "");
    const bestand = join(root, pad || "index.html");
    // Nooit buiten de map van het spel lezen.
    if (!bestand.startsWith(root.endsWith(sep) ? root : root + sep)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const inhoud = await readFile(bestand);
      res.writeHead(200, { "content-type": TYPES[extname(bestand)] || "application/octet-stream" });
      res.end(inhoud);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((klaar) => {
    server.listen(port, "127.0.0.1", () => {
      klaar({ url: `http://127.0.0.1:${server.address().port}/`, stop: () => new Promise((r) => server.close(r)) });
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await startServer({ port: Number(process.argv[2]) || 8000 });
  console.log(`Serge Clicker draait op ${url}`);
}
