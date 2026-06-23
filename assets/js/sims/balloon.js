/* Balloon Universe -------------------------------------------------------------
   Rebuild of the ClassAction "Balloon Universe" (balloon.swf): coins glued to an
   inflating balloon as an analogy for the expanding universe — the coins (galaxies)
   keep their own size while the space between them stretches.
   Enriched into an interactive: inflate / deflate / jump-to-full, pick any galaxy as
   "home", and see that EVERY other galaxy recedes from it with a speed proportional
   to its distance (recession arrows + a velocity-vs-distance plot) — Hubble's law,
   and why no galaxy is the centre.                                                  */
Sim.create({
  id: "balloon",
  width: 760, height: 500,
  strings: {
    en: {
      "bl.anim": "Inflation", "bl.inflate": "inflate", "bl.full": "begin full", "bl.reset": "deflate",
      "bl.size": "balloon size", "bl.speed": "speed",
      "bl.opt": "Options", "bl.arrows": "show recession arrows", "bl.grid": "show grid",
      "bl.scale": "scale factor a", "bl.home": "home galaxy", "bl.law": "v = H · d holds?", "bl.ngal": "galaxies"
    },
    id: {
      "bl.anim": "Pengembungan", "bl.inflate": "kembungkan", "bl.full": "langsung penuh", "bl.reset": "kempiskan",
      "bl.size": "ukuran balon", "bl.speed": "kecepatan",
      "bl.opt": "Opsi", "bl.arrows": "tampilkan panah resesi", "bl.grid": "tampilkan kisi",
      "bl.scale": "faktor skala a", "bl.home": "galaksi asal", "bl.law": "v = H · d berlaku?", "bl.ngal": "galaksi"
    }
  },
  about: {
    en: "<p>Glue coins to a balloon and blow it up: every coin stays the same size, but the rubber <em>between</em> them stretches, so all the coins drift apart. That is exactly how cosmic expansion works — galaxies keep their size while the space between them grows.</p>" +
        "<p>Pick any galaxy as <strong>home</strong>. From there every other galaxy moves away, and one twice as far recedes twice as fast: <strong>v = H·d</strong>, Hubble's law. The velocity–distance plot stays a straight line through the origin.</p>" +
        "<p>Crucially, you get the same picture <em>from every coin</em> — there is no centre and no edge. Inflate the balloon and switch the home galaxy to see it.</p>",
    id: "<p>Tempelkan koin pada balon lalu tiup: setiap koin tetap seukuran, tetapi karet di <em>antara</em> mereka meregang, sehingga semua koin saling menjauh. Begitulah pengembangan kosmik — galaksi tetap seukuran sementara ruang di antaranya tumbuh.</p>" +
        "<p>Pilih sembarang galaksi sebagai <strong>asal</strong>. Dari sana setiap galaksi lain menjauh, dan yang dua kali lebih jauh menjauh dua kali lebih cepat: <strong>v = H·d</strong>, hukum Hubble. Grafik kecepatan–jarak tetap garis lurus melalui titik asal.</p>" +
        "<p>Yang penting, gambaran sama terlihat <em>dari setiap koin</em> — tak ada pusat atau tepi. Kembungkan balon dan ganti galaksi asal untuk melihatnya.</p>"
  },
  build: function (S) {
    // fixed "rest" positions of galaxies on the balloon (normalized to balloon radius)
    var GAL = [
      [-0.55, -0.50], [0.10, -0.66], [0.62, -0.36], [-0.70, 0.05], [-0.10, -0.08],
      [0.45, 0.12], [-0.42, 0.52], [0.18, 0.58], [0.66, 0.42], [-0.05, 0.30]
    ];
    var home = 4;                       // index of the home galaxy
    var P = { a: 0.45 };                // scale factor (balloon inflation)
    var speed = 0.35;

    var BAL = { cx: 250, cy: 250, R: 200 };   // balloon centre + full radius
    var PLOT = { x: 510, y: 250, w: 218, h: 196 };

    /* ---------- controls ---------- */
    S.group("bl.anim");
    var loop = S.loop(function (dt) {
      P.a = Math.min(1, P.a + speed * dt);
      sizeC.set(P.a);                   // keep the scrubber in sync
      if (P.a >= 1) { loop.pause(); syncPlay(); }
    });
    var playBtn = S.button({ labelKey: "bl.inflate", primary: true, on: function () { if (P.a >= 1) { P.a = 0.45; sizeC.set(P.a); } loop.toggle(); syncPlay(); } });
    function syncPlay() { var k = loop.playing ? "sim.pause" : "bl.inflate"; playBtn.setAttribute("data-i18n", k); playBtn.textContent = I18N.t(k); }
    S.refreshers.push(syncPlay);
    S.button({ labelKey: "bl.full", on: function () { loop.pause(); syncPlay(); P.a = 1; sizeC.set(1); } });
    S.button({ labelKey: "bl.reset", on: function () { loop.pause(); syncPlay(); P.a = 0.3; sizeC.set(0.3); } });
    var sizeC = S.slider({ labelKey: "bl.size", min: 0.3, max: 1, step: 0.005, value: P.a, format: function (v) { return v.toFixed(2) + "×"; }, on: function (v) { P.a = v; upd(); } });
    S.slider({ labelKey: "bl.speed", min: 0.1, max: 1, step: 0.05, value: speed, format: function (v) { return v.toFixed(2) + "×"; }, on: function (v) { speed = v; } });

    S.group("bl.opt");
    var optArrows = S.toggle({ labelKey: "bl.arrows", value: true });
    var optGrid = S.toggle({ labelKey: "bl.grid", value: true });

    var oScale = S.readout({ labelKey: "bl.scale" });
    var oHome = S.readout({ labelKey: "bl.home" });
    var oN = S.readout({ labelKey: "bl.ngal" });
    var oLaw = S.readout({ labelKey: "bl.law" });

    function upd() {
      oScale(P.a.toFixed(2));
      oHome("#" + (home + 1));
      oN("" + GAL.length);
      oLaw("yes — v ∝ d");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---------- interaction: click a galaxy to make it home ---------- */
    function localXY(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var m = localXY(ev), best = -1, bd = 18;
      GAL.forEach(function (g, i) { var p = pos(i); var d = Math.hypot(m.x - p.x, m.y - p.y); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { home = best; upd(); }
    });

    function pos(i) { return { x: BAL.cx + GAL[i][0] * BAL.R * P.a, y: BAL.cy + GAL[i][1] * BAL.R * P.a }; }

    /* ---------- drawing ---------- */
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 10, y: 8, w: 480, h: 484 }, "THE UNIVERSE  (a balloon)");
      panel(ctx, { x: 500, y: 8, w: 250, h: 230 }, "");
      panel(ctx, { x: 500, y: 246, w: 250, h: 246 }, "RECESSION  v vs d");
      drawBalloon(ctx);
      drawArrowsAndCoins(ctx);
      drawLegendPanel(ctx);
      drawPlot(ctx);
    });

    function drawBalloon(ctx) {
      var R = BAL.R * P.a;
      // body
      var g = ctx.createRadialGradient(BAL.cx - R * 0.3, BAL.cy - R * 0.35, R * 0.2, BAL.cx, BAL.cy, R);
      g.addColorStop(0, "#ff8d7a"); g.addColorStop(0.7, "#e64a3a"); g.addColorStop(1, "#a52a1f");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(BAL.cx, BAL.cy, R, R * 1.04, 0, 0, 2 * Math.PI); ctx.fill();
      // highlight
      ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.ellipse(BAL.cx - R * 0.32, BAL.cy - R * 0.4, R * 0.18, R * 0.3, -0.5, 0, 2 * Math.PI); ctx.fill();
      // knot
      ctx.fillStyle = "#a52a1f"; ctx.beginPath(); ctx.moveTo(BAL.cx - 9, BAL.cy + R * 1.04); ctx.lineTo(BAL.cx + 9, BAL.cy + R * 1.04); ctx.lineTo(BAL.cx, BAL.cy + R * 1.04 + 16); ctx.closePath(); ctx.fill();
      // grid drawn on the rubber (stretches with a)
      if (optGrid.value()) {
        ctx.save(); ctx.beginPath(); ctx.ellipse(BAL.cx, BAL.cy, R, R * 1.04, 0, 0, 2 * Math.PI); ctx.clip();
        ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.lineWidth = 1;
        var step = (BAL.R * P.a) / 4;
        for (var gx = -4; gx <= 4; gx++) { ctx.beginPath(); ctx.moveTo(BAL.cx + gx * step, BAL.cy - R * 1.1); ctx.lineTo(BAL.cx + gx * step, BAL.cy + R * 1.1); ctx.stroke(); }
        for (var gy = -4; gy <= 4; gy++) { ctx.beginPath(); ctx.moveTo(BAL.cx - R * 1.1, BAL.cy + gy * step); ctx.lineTo(BAL.cx + R * 1.1, BAL.cy + gy * step); ctx.stroke(); }
        ctx.restore();
      }
    }

    function drawArrowsAndCoins(ctx) {
      var hp = pos(home);
      // recession arrows from home to each other galaxy (length ∝ distance)
      if (optArrows.value()) {
        GAL.forEach(function (g, i) {
          if (i === home) return;
          var p = pos(i), dx = p.x - hp.x, dy = p.y - hp.y, d = Math.hypot(dx, dy);
          if (d < 1) return;
          var ux = dx / d, uy = dy / d, len = d * 0.32 + 6;     // proportional to distance
          var ex = p.x + ux * len, ey = p.y + uy * len;
          arrow(ctx, p.x, p.y, ex, ey, "rgba(255,235,120,0.95)", 2);
        });
      }
      // coins (galaxies)
      GAL.forEach(function (g, i) {
        var p = pos(i), isHome = i === home;
        coin(ctx, p.x, p.y, 12, isHome);
        if (isHome) { ctx.strokeStyle = "#7ad1ff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, 2 * Math.PI); ctx.stroke();
          ctx.fillStyle = "#7ad1ff"; ctx.font = "700 11px system-ui"; ctx.textAlign = "center"; ctx.fillText("home", p.x, p.y - 22); }
      });
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText("click a galaxy to view from it", BAL.cx, 470);
    }

    function drawLegendPanel(ctx) {
      var x = 514, y = 34;
      ctx.fillStyle = "#cfe0ff"; ctx.font = "700 13px system-ui"; ctx.textAlign = "left";
      ctx.fillText("Hubble's law", x, y);
      ctx.fillStyle = "#9fb0d0"; ctx.font = "12px system-ui";
      ctx.fillText("Coins keep their size —", x, y + 24);
      ctx.fillText("space between them grows.", x, y + 42);
      ctx.fillText("From any galaxy, farther", x, y + 68);
      ctx.fillText("ones recede faster:", x, y + 86);
      ctx.fillStyle = "#ffeb78"; ctx.font = "700 18px system-ui"; ctx.fillText("v = H · d", x + 30, y + 118);
      ctx.fillStyle = "#7d8cb0"; ctx.font = "11px system-ui";
      ctx.fillText("No galaxy is the centre.", x, y + 146);
    }

    function drawPlot(ctx) {
      var hp = pos(home), pts = [];
      var maxD = 1;
      GAL.forEach(function (g, i) { if (i === home) return; var p = pos(i); var d = Math.hypot(p.x - hp.x, p.y - hp.y); pts.push(d); if (d > maxD) maxD = d; });
      var x0 = PLOT.x + 34, y0 = PLOT.y + PLOT.h - 26, pw = PLOT.w - 50, ph = PLOT.h - 50;
      // axes
      ctx.strokeStyle = "#3a4a72"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, PLOT.y + 16); ctx.lineTo(x0, y0); ctx.lineTo(x0 + pw, y0); ctx.stroke();
      ctx.fillStyle = "#9fb0d0"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText("distance d", x0 + pw / 2, y0 + 18);
      ctx.save(); ctx.translate(PLOT.x + 12, PLOT.y + PLOT.h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("recession v", 0, 0); ctx.restore();
      // Hubble line v = H d  (slope from inflation rate; constant slope visually)
      ctx.strokeStyle = "rgba(122,209,255,0.5)"; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + pw, PLOT.y + 22); ctx.stroke(); ctx.setLineDash([]);
      // points (v ∝ d, so they sit exactly on the line)
      pts.forEach(function (d) {
        var px = x0 + (d / maxD) * pw, py = y0 - (d / maxD) * ph;
        ctx.fillStyle = "#ffeb78"; ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.fill();
      });
      ctx.fillStyle = "#7d8cb0"; ctx.font = "10px system-ui"; ctx.textAlign = "right";
      ctx.fillText("slope = H", x0 + pw, PLOT.y + 34);
    }

    function coin(ctx, x, y, r, hot) {
      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.2, x, y, r);
      g.addColorStop(0, hot ? "#fff6c8" : "#f4d97a"); g.addColorStop(1, hot ? "#d9a52a" : "#b8862a");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "rgba(80,50,0,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      // little spiral-galaxy hint on the coin
      ctx.strokeStyle = "rgba(90,50,0,0.45)"; ctx.lineWidth = 1.4; ctx.beginPath();
      for (var t = 0; t < Math.PI * 2.2; t += 0.3) { var rr = r * 0.18 + t * r * 0.07; var a = t; var px = x + rr * Math.cos(a), py = y + rr * Math.sin(a); ctx[t ? "lineTo" : "moveTo"](px, py); }
      ctx.stroke();
    }
    function arrow(ctx, x1, y1, x2, y2, col, w) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      var a = Math.atan2(y2 - y1, x2 - x1), s = 8;
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - s * Math.cos(a - 0.42), y2 - s * Math.sin(a - 0.42)); ctx.lineTo(x2 - s * Math.cos(a + 0.42), y2 - s * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill();
    }
    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      if (title) { ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title, r.x + 14, r.y + 20); }
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    upd();
  }
});
