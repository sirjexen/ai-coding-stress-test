import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const types = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json" };
const server = createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const requested = pathname === "/" ? "/index.html" : pathname;
    const safe = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
    const file = join(root, safe);
    if (!file.startsWith(root)) throw new Error("bad path");
    const body = await readFile(file);
    res.writeHead(200, {"content-type":types[extname(file)] || "application/octet-stream"});
    res.end(body);
  } catch {
    res.writeHead(404, {"content-type":"text/plain"}); res.end("Not found");
  }
});
server.listen(4173, () => console.log("Orbit running at http://localhost:4173"));
