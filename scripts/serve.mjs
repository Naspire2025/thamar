// Minimal static server for local preview of the site: `npm run serve` → http://localhost:4173/
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export function startServer({ root, base = "/", port = 4173, quiet = false }) {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/" && base !== "/") {
      res.writeHead(302, { Location: base }).end();
      return;
    }
    if (!p.startsWith(base)) return send404();
    let file = path.join(root, p.slice(base.length));
    if (!file.startsWith(root)) return send404();
    try {
      if ((await stat(file)).isDirectory()) {
        if (!p.endsWith("/")) {
          res.writeHead(301, { Location: p + "/" }).end();
          return;
        }
        file = path.join(file, "index.html");
      }
      const data = await readFile(file);
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" }).end(data);
    } catch {
      send404();
    }
    async function send404() {
      const page = await readFile(path.join(root, "404.html")).catch(() => "Not found");
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }).end(page);
    }
  });
  return new Promise((resolve) =>
    server.listen(port, () => {
      if (!quiet) console.log(`Serving the site at http://localhost:${server.address().port}${base}`);
      resolve(server);
    }),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  startServer({ root, port: Number(process.env.PORT) || 4173 });
}
