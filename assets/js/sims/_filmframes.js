/* Film frames, decoded once -----------------------------------------------------
   Two ClassAction sims show one frame of a film at a time and jump anywhere in it:
   transitmovie's 315 noon photographs and meltednail's 849-frame VP6 stream. In
   the SWFs these are pictures Flash puts on screen the moment a drag or a slider
   asks for them. The rebuilds keep each film as a small H.264 MP4
   (assets/video/), and a <video> element cannot keep up. Every seek is
   asynchronous, takes tens of milliseconds, and leaves the element blank while it
   runs.

   So the MP4 is decoded once, as soon as it arrives. Every frame is kept in memory
   as its YUV 4:2:0 planes, at 1.5 bytes a pixel: 36 MB for the photographs and
   55 MB for the nail. Drawing a frame converts it to RGB in a small canvas, which
   is then drawn scaled like any image, synchronously, whatever frame was asked for.
   The conversion is BT.601, with the chroma upsampled by libjpeg's "fancy"
   triangle filter.

   Decoding uses WebCodecs. A small reader below walks the MP4's own sample table
   (moov/trak/mdia/minf/stbl) and feeds each sample to a VideoDecoder. A browser
   without WebCodecs falls back on a hidden <video> element. It is seeked frame by
   frame, the frame on show first and then the rest in order, and each picture is
   copied into the same store. Once the film has been through once, it is instant
   there too.

   FilmFrames.load(src, opts) -> film
     opts.fps, opts.count     the film's frame rate and length (for the fallback)
     opts.fullRange           the stream's YUV range (true: JPEG's 0–255). Both films
                              are video range: a hardware decoder may hand back a
                              full-range stream already squeezed to video range,
                              and VideoFrame.colorSpace does not reliably say so.
     opts.onframe(k)          frame k has arrived
     film.has(k)              frame k (0-based) can be drawn
     film.draw(ctx, k, x, y, w, h)
                              draws frame k and returns true. If k has not arrived
                              yet, it draws the last frame shown instead (if any)
                              and returns false.
     film.shown               the frame on show, −1 before the first
     film.done                every frame has arrived
     film.want(k)             the frame the page is showing (the fallback fetches it first)
     film.unlock()            call from a user gesture: iOS paints a <video> into a
                              canvas only once it has played                          */
window.FilmFrames = (function () {
  "use strict";

  /* ---- the MP4's own sample table: every frame's bytes, in decode order ---- */
  function readMP4(buf) {
    var dv = new DataView(buf), u8 = new Uint8Array(buf);
    function boxes(start, end) {
      var out = [], o = start;
      while (o + 8 <= end) {
        var size = dv.getUint32(o), hdr = 8;
        if (size === 1) { size = dv.getUint32(o + 8) * 4294967296 + dv.getUint32(o + 12); hdr = 16; }
        else if (size === 0) size = end - o;
        if (size < hdr || o + size > end) break;
        out.push({ type: String.fromCharCode(u8[o + 4], u8[o + 5], u8[o + 6], u8[o + 7]), start: o + hdr, end: o + size });
        o += size;
      }
      return out;
    }
    function child(box, type) {
      var list = box ? boxes(box.start, box.end) : [];
      for (var i = 0; i < list.length; i++) if (list[i].type === type) return list[i];
      return null;
    }
    function u32(box, at) { return dv.getUint32(box.start + at); }

    var moov = child({ start: 0, end: buf.byteLength }, "moov"), traks = moov ? boxes(moov.start, moov.end) : [];
    for (var t = 0; t < traks.length; t++) {
      var mdia = traks[t].type === "trak" && child(traks[t], "mdia"), hdlr = child(mdia, "hdlr");
      if (!hdlr || u32(hdlr, 8) !== 0x76696465) continue;                     // 'vide'
      var mdhd = child(mdia, "mdhd"), stbl = child(child(mdia, "minf"), "stbl");
      var scale = u32(mdhd, u8[mdhd.start] === 1 ? 20 : 12);
      var stsd = child(stbl, "stsd"), entry = boxes(stsd.start + 8, stsd.end)[0];
      if (!entry || (entry.type !== "avc1" && entry.type !== "avc3")) throw new Error("not H.264");
      var avcC = child({ start: entry.start + 78, end: entry.end }, "avcC");   // after the VisualSampleEntry
      if (!avcC) throw new Error("no avcC");
      var i, j, m, n, s;

      var stsz = child(stbl, "stsz"), same = u32(stsz, 4), size = [];
      n = u32(stsz, 8);
      for (i = 0; i < n; i++) size.push(same || u32(stsz, 12 + 4 * i));
      var stco = child(stbl, "stco"), co64 = child(stbl, "co64"), chunk = [];
      if (stco) for (i = 0, m = u32(stco, 4); i < m; i++) chunk.push(u32(stco, 8 + 4 * i));
      else for (i = 0, m = u32(co64, 4); i < m; i++) chunk.push(u32(co64, 8 + 8 * i) * 4294967296 + u32(co64, 12 + 8 * i));
      var stsc = child(stbl, "stsc"), runs = [];
      for (i = 0, m = u32(stsc, 4); i < m; i++) runs.push({ first: u32(stsc, 8 + 12 * i) - 1, per: u32(stsc, 12 + 12 * i) });
      var offset = [];
      for (var c = 0, r = 0, per = 0; c < chunk.length && offset.length < n; c++) {
        while (r < runs.length && runs[r].first <= c) per = runs[r++].per;
        for (var o = chunk[c], k = 0; k < per && offset.length < n; k++) { offset.push(o); o += size[offset.length - 1]; }
      }
      var stts = child(stbl, "stts"), cts = [], d = 0;
      for (i = 0, m = u32(stts, 4); i < m; i++) {
        for (j = 0; j < u32(stts, 8 + 8 * i); j++) { cts.push(d); d += u32(stts, 12 + 8 * i); }
      }
      var ctts = child(stbl, "ctts");                                           // B-frames only
      if (ctts) {
        for (i = 0, s = 0, m = u32(ctts, 4); i < m; i++) {
          var off = u8[ctts.start] === 1 ? dv.getInt32(ctts.start + 12 + 8 * i) : u32(ctts, 12 + 8 * i);
          for (j = 0; j < u32(ctts, 8 + 8 * i) && s < n; j++) cts[s++] += off;
        }
      }
      var stss = child(stbl, "stss"), key = [];                                 // no stss: all sync
      for (i = 0; i < n; i++) key.push(!stss);
      if (stss) for (i = 0, m = u32(stss, 4); i < m; i++) key[u32(stss, 8 + 4 * i) - 1] = true;

      var order = [];                                                           // frame k: presentation order
      for (i = 0; i < n; i++) order.push(i);
      order.sort(function (a, b) { return cts[a] - cts[b]; });
      var samples = [];
      for (i = 0; i < n; i++) samples.push({ offset: offset[i], size: size[i], key: key[i], ts: Math.round(cts[i] * 1e6 / scale) });
      order.forEach(function (si, fi) { samples[si].frame = fi; });
      return { width: dv.getUint16(entry.start + 24), height: dv.getUint16(entry.start + 26),
        avcC: u8.slice(avcC.start, avcC.end), samples: samples };
    }
    throw new Error("no video track");
  }

  function load(src, opts) {
    var W = 0, H = 0, CW = 0, CH = 0, count = opts.count || 0, frames = [], arrivedN = 0;
    var canvas = document.createElement("canvas"), cctx = null, img = null;
    var grab = null, gctx = null;                   // for frames the browser has to convert for us
    var rowU = null, rowV = null, blobURL = null;
    var film = { shown: -1, done: false, wanted: 0 };

    /* BT.601 in the stream's range, as lookup tables */
    var full = !!opts.fullRange, ys = full ? 1 : 255 / 219, y0 = full ? 0 : 16, cs = full ? 1 : 255 / 224;
    var LY = new Float32Array(256), RV = new Float32Array(256), GU = new Float32Array(256),
      GV = new Float32Array(256), BU = new Float32Array(256);
    for (var i = 0; i < 256; i++) {
      var c = (i - 128) * cs;
      LY[i] = (i - y0) * ys; RV[i] = 1.402 * c; GU[i] = -0.344136 * c; GV[i] = -0.714136 * c; BU[i] = 1.772 * c;
    }

    function setSize(w, h) {
      if (W) return;
      W = w; H = h; CW = (w + 1) >> 1; CH = (h + 1) >> 1;
      canvas.width = W; canvas.height = H;
      cctx = canvas.getContext("2d");
      img = cctx.createImageData(W, H);
      for (var p = 3; p < img.data.length; p += 4) img.data[p] = 255;
      rowU = new Int32Array(CW); rowV = new Int32Array(CW);
    }
    function keep(k, f) {                           // either path may deliver a frame; count it once
      if (frames[k]) return;
      frames[k] = f;
      arrivedN++;
      if (arrivedN >= count) {
        film.done = true;
        if (blobURL) { URL.revokeObjectURL(blobURL); blobURL = null; }
      }
      if (opts.onframe) opts.onframe(k);
    }

    /* a decoded frame's planes, copied as I420 */
    function fromPlanes(src, layout, nv12) {
      var f = new Uint8ClampedArray(W * H + 2 * CW * CH), j, x, u = W * H, v = u + CW * CH;
      for (j = 0; j < H; j++) f.set(src.subarray(layout[0].offset + j * layout[0].stride, layout[0].offset + j * layout[0].stride + W), j * W);
      for (j = 0; j < CH; j++) {
        if (nv12) {
          for (var o = layout[1].offset + j * layout[1].stride, x2 = 0; x2 < CW; x2++) { f[u++] = src[o + 2 * x2]; f[v++] = src[o + 2 * x2 + 1]; }
        } else {
          x = layout[1].offset + j * layout[1].stride; f.set(src.subarray(x, x + CW), u + j * CW);
          x = layout[2].offset + j * layout[2].stride; f.set(src.subarray(x, x + CW), v + j * CW);
        }
      }
      return f;
    }
    /* an RGBA picture, converted to I420 the way toRGBA() converts it back */
    function fromRGBA(px) {
      var f = new Uint8ClampedArray(W * H + 2 * CW * CH), x, y, p, u = W * H, v = u + CW * CH;
      for (p = 0; p < W * H; p++) f[p] = y0 + (0.299 * px[4 * p] + 0.587 * px[4 * p + 1] + 0.114 * px[4 * p + 2]) / ys;
      for (y = 0; y < CH; y++) {
        for (x = 0; x < CW; x++) {
          var r = 0, g = 0, b = 0, nPx = 0;
          for (var dy = 0; dy < 2; dy++) for (var dx = 0; dx < 2; dx++) {
            var xx = 2 * x + dx, yy = 2 * y + dy;
            if (xx < W && yy < H) { p = 4 * (yy * W + xx); r += px[p]; g += px[p + 1]; b += px[p + 2]; nPx++; }
          }
          r /= nPx; g /= nPx; b /= nPx;
          f[u++] = 128 + (-0.168736 * r - 0.331264 * g + 0.5 * b) / cs;
          f[v++] = 128 + (0.5 * r - 0.418688 * g - 0.081312 * b) / cs;
        }
      }
      return f;
    }
    function fromCanvas(source) {
      if (!grab) { grab = document.createElement("canvas"); grab.width = W; grab.height = H; gctx = grab.getContext("2d", { willReadFrequently: true }); }
      gctx.drawImage(source, 0, 0, W, H);
      return fromRGBA(gctx.getImageData(0, 0, W, H).data);
    }

    /* I420 to RGB, the chroma upsampled h2v2 "fancy" (a 3:1 triangle each way) */
    function toRGBA(k) {
      var f = frames[k], out = img.data, u = W * H, v = u + CW * CH, x, y;
      for (y = 0; y < H; y++) {
        var cy = y >> 1, ny = y & 1 ? Math.min(cy + 1, CH - 1) : Math.max(cy - 1, 0);
        var a = cy * CW, b = ny * CW;
        for (x = 0; x < CW; x++) {
          rowU[x] = 3 * f[u + a + x] + f[u + b + x];
          rowV[x] = 3 * f[v + a + x] + f[v + b + x];
        }
        for (var o = 4 * y * W, yi = y * W, xe = 0; xe < W; xe++, o += 4) {
          var cx = xe >> 1, nx = xe & 1 ? Math.min(cx + 1, CW - 1) : Math.max(cx - 1, 0);
          var U = (3 * rowU[cx] + rowU[nx] + 8) >> 4, V = (3 * rowV[cx] + rowV[nx] + 8) >> 4, L = LY[f[yi + xe]];
          out[o] = L + RV[V]; out[o + 1] = L + GU[U] + GV[V]; out[o + 2] = L + BU[U];
        }
      }
    }

    film.has = function (k) { return !!frames[k]; };
    film.draw = function (ctx, k, x, y, w, h) {
      var exact = !!frames[k];
      if (exact && k !== film.shown) { toRGBA(k); cctx.putImageData(img, 0, 0); film.shown = k; }
      if (film.shown < 0) return false;
      ctx.drawImage(canvas, x, y, w, h);
      return exact;
    };
    film.want = function (k) { film.wanted = k; if (film.kick) film.kick(); };
    film.unlock = function () { if (film.onUnlock) film.onUnlock(); };

    /* ---- WebCodecs: the whole film in one pass ---- */
    function decodeAll(buf, mp4) {
      var a = mp4.avcC;
      function hex(b) { return (b < 16 ? "0" : "") + b.toString(16); }
      var config = { codec: "avc1." + hex(a[1]) + hex(a[2]) + hex(a[3]), codedWidth: mp4.width, codedHeight: mp4.height,
        description: a, optimizeForLatency: true };
      return VideoDecoder.isConfigSupported(config).then(function (res) {
        if (!res.supported) throw new Error("unsupported");
        return new Promise(function (resolve, reject) {
          var byTs = {}, pending = 0, flushed = false;
          mp4.samples.forEach(function (s) { byTs[s.ts] = s.frame; });
          function settle() { pending--; if (flushed && !pending) resolve(); }
          function put(vf) {
            var k = byTs[vf.timestamp], fmt = vf.format, r = vf.visibleRect;
            if (k === undefined || frames[k]) { vf.close(); return Promise.resolve(); }
            if ((fmt === "I420" || fmt === "I420A" || fmt === "NV12") && r && r.width === W && r.height === H) {
              var tmp = new Uint8Array(vf.allocationSize());
              return vf.copyTo(tmp).then(function (layout) {
                vf.close(); keep(k, fromPlanes(tmp, layout, fmt === "NV12"));
              }, function (e) { vf.close(); throw e; });
            }
            try { keep(k, fromCanvas(vf)); } finally { vf.close(); }       // any other layout: the browser converts
            return Promise.resolve();
          }
          var dec = new VideoDecoder({
            output: function (vf) {
              pending++;
              var p;
              try { p = put(vf); } catch (e) { p = Promise.reject(e); }
              p.then(settle, reject);
            },
            error: reject
          });
          dec.configure(config);
          mp4.samples.forEach(function (s) {
            dec.decode(new EncodedVideoChunk({ type: s.key ? "key" : "delta", timestamp: s.ts,
              data: new Uint8Array(buf, s.offset, s.size) }));
          });
          dec.flush().then(function () { flushed = true; dec.close(); if (!pending) resolve(); }, reject);
        });
      });
    }

    /* ---- no WebCodecs: a hidden <video>, seeked one frame at a time ---- */
    function viaVideo(url) {
      var video = document.createElement("video"), fps = opts.fps, target = -1, played = false;
      video.muted = true; video.playsInline = true; video.preload = "auto";
      video.setAttribute("muted", ""); video.setAttribute("playsinline", "");
      function missingFrom(k) {
        for (var i = 0; i < count; i++) { var j = (k + i) % count; if (!frames[j]) return j; }
        return -1;
      }
      function next() {
        if (target >= 0 || !played) return;
        var k = missingFrom(Math.max(0, film.wanted) % count);
        if (k < 0) { video.removeAttribute("src"); video.load(); return; }
        target = k;
        video.currentTime = (k + 0.5) / fps;
      }
      function play() {
        var p;
        try { p = video.play(); } catch (e) { p = null; }
        if (p && p.then) p.then(function () { video.pause(); played = true; next(); }, function () { /* wait for a gesture */ });
        else { played = true; next(); }
      }
      video.addEventListener("loadeddata", function () { setSize(video.videoWidth, video.videoHeight); play(); });
      video.addEventListener("seeked", function () {
        if (target < 0) return;
        var k = target;
        target = -1;
        if (!frames[k]) keep(k, fromCanvas(video));
        next();
      });
      film.kick = next;
      film.onUnlock = function () { if (!played && video.readyState >= 2) play(); };
      video.src = url; video.load();
    }

    if (window.fetch && location.protocol !== "file:") {
      fetch(src).then(function (res) { if (!res.ok) throw new Error(res.status); return res.arrayBuffer(); })
        .then(function (buf) {
          function fallback() {
            blobURL = URL.createObjectURL(new Blob([buf], { type: "video/mp4" }));
            viaVideo(blobURL);
          }
          var mp4;
          try { mp4 = readMP4(buf); } catch (e) { fallback(); return; }
          count = mp4.samples.length;
          setSize(mp4.width, mp4.height);
          if (!window.VideoDecoder || !window.EncodedVideoChunk) { fallback(); return; }
          decodeAll(buf, mp4).then(function () { if (!film.done) fallback(); }, fallback);
        })
        .catch(function () { viaVideo(src); });
    } else viaVideo(src);
    return film;
  }

  return { load: load };
})();
