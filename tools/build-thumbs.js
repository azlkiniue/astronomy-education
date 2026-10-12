/* ===========================================================================
   tools/build-thumbs.js  —  DEV TOOL (run with Node, output is committed)
   ---------------------------------------------------------------------------
   Makes the home page's card pictures: a still of every rebuilt simulation,
   taken from its own canvas, saved as assets/img/thumbs/<id>.webp.

   Only a browser can draw a sim, so this serves the site together with a
   capture page (tools/thumbs.html) and writes the pictures that page posts
   back. Run it again whenever a simulation's look changes.

   Run:  node tools/build-thumbs.js [port]       (default port 4179)
         then open http://localhost:4179/ in Chrome, Edge or Firefox;
         add ?only=kepler,blackbody to redo just those. Ctrl-C when done.
   =========================================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets", "img", "thumbs");
const PORT = Number(process.argv[2]) || 4179;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4"
};

http.createServer(function (req, res) {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "POST" && url.pathname === "/__thumb") return save(url.searchParams.get("id"), req, res);
  if (url.pathname === "/") {
    res.writeHead(302, { Location: "/tools/thumbs.html" + url.search });
    return res.end();
  }
  let file;
  try { file = path.join(ROOT, decodeURIComponent(url.pathname)); } catch (e) { file = ""; }
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, function (err, buf) {
    if (err) { res.writeHead(404); return res.end(); }
    // no-store: a sim edited a moment ago must be the one captured
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store" });
    res.end(buf);
  });
}).listen(PORT, "127.0.0.1", function () {
  console.log("Open http://localhost:" + PORT + "/ to capture the thumbnails (Ctrl-C when done).");
});

function save(id, req, res) {
  if (!/^[\w-]+$/.test(id || "") || !fs.existsSync(path.join(ROOT, "sims", id + ".html"))) {
    res.writeHead(400); return res.end("unknown simulation");
  }
  const chunks = [];
  req.on("data", function (c) { chunks.push(c); });
  req.on("end", function () {
    const buf = Buffer.concat(chunks);
    if (buf.toString("latin1", 0, 4) !== "RIFF" || buf.toString("latin1", 8, 12) !== "WEBP") {
      res.writeHead(415); return res.end("not a WebP image");
    }
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(path.join(OUT, id + ".webp"), buf);
    console.log("saved assets/img/thumbs/" + id + ".webp (" + (buf.length / 1024).toFixed(1) + " KB)");
    res.writeHead(204); res.end();
  });
}
