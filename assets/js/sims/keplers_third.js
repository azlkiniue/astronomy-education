/* Kepler's Third Law ----------------------------------------------------------
   Faithful rebuild of the ClassAction "Kepler's Third Law" (keplers_third.swf).
   The original is a minimal two-box calculator:

        P²  =  a³        ( P in years,  a in AUs )

   Type a period P and it solves for the semimajor axis a, or type an a and it
   solves for P. This rebuild keeps that two-way relationship (move either the
   P slider or the a slider and the other follows the law) and adds a log–log
   P-vs-a plot with the eight planets as reference points, plus a draggable
   marker that slides along the P = a^(3/2) line.                               */
Sim.create({
  id: "keplers_third",
  width: 760, height: 470,
  strings: {
    en: {
      "k3.preset": "Jump to a planet", "k3.a": "semimajor axis  a", "k3.P": "orbital period  P",
      "k3.custom": "— custom —",
      "k3.rP": "period  P", "k3.ra": "semimajor axis  a", "k3.rP2": "P²", "k3.ra3": "a³"
    },
    id: {
      "k3.preset": "Lompat ke planet", "k3.a": "sumbu semimayor  a", "k3.P": "periode orbit  P",
      "k3.custom": "— ubah sendiri —",
      "k3.rP": "periode  P", "k3.ra": "sumbu semimayor  a", "k3.rP2": "P²", "k3.ra3": "a³"
    }
  },
  about: {
    en: "<p>Kepler's third law links the time a planet takes to orbit the Sun (its <strong>period P</strong>) to the size of its orbit (its <strong>semimajor axis a</strong>):</p>" +
        "<p style='text-align:center'><strong>P² = a³</strong>,&nbsp; with P in years and a in astronomical units (AU).</p>" +
        "<p>Earth sits at P = 1 yr, a = 1 AU, so 1² = 1³. A planet four times farther out (a = 4) takes a³ = 64 → P = 8 years to go around. On a log–log plot every planet falls on a single straight line of slope 3/2 — drag the marker along it, or pick a planet, and watch P² and a³ stay equal.</p>",
    id: "<p>Hukum ketiga Kepler menghubungkan waktu yang dibutuhkan planet mengelilingi Matahari (<strong>periode P</strong>) dengan ukuran orbitnya (<strong>sumbu semimayor a</strong>):</p>" +
        "<p style='text-align:center'><strong>P² = a³</strong>,&nbsp; dengan P dalam tahun dan a dalam satuan astronomi (AU).</p>" +
        "<p>Bumi berada di P = 1 thn, a = 1 AU, jadi 1² = 1³. Planet empat kali lebih jauh (a = 4) butuh a³ = 64 → P = 8 tahun. Pada grafik log–log setiap planet jatuh pada satu garis lurus berkemiringan 3/2 — seret penanda di sepanjang garis, atau pilih planet, dan lihat P² dan a³ tetap sama.</p>"
  },
  build: function (S) {
    var COL = { P: "#5a9cff", a: "#ffa64d", eq: "#eef2fb", line: "#6ee7a8" };
    var AMIN = 0.2, AMAX = 120;                 // AU range for the log axis
    var PMIN = Math.pow(AMIN, 1.5), PMAX = Math.pow(AMAX, 1.5);
    var P = { a: 1.0 };                          // a drives everything; P = a^1.5
    var busy = false;

    var PLANETS = [
      { k: "Mercury", a: 0.387 }, { k: "Venus", a: 0.723 }, { k: "Earth", a: 1.000 },
      { k: "Mars", a: 1.524 }, { k: "Jupiter", a: 5.203 }, { k: "Saturn", a: 9.537 },
      { k: "Uranus", a: 19.19 }, { k: "Neptune", a: 30.07 }
    ];

    function periodOf(a) { return Math.pow(a, 1.5); }
    function aOfPeriod(p) { return Math.pow(p, 2 / 3); }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    /* ---------- controls ---------- */
    var presetSel = S.select({ labelKey: "k3.preset", value: "Earth", options:
      [{ v: "custom", labelKey: "k3.custom" }].concat(PLANETS.map(function (p) { return { v: p.k, label: p.k }; })),
      on: function (v) {
        if (busy || v === "custom") return;
        var pl = PLANETS.find(function (p) { return p.k === v; });
        if (pl) { setA(pl.a); }
      } });

    var aC = S.slider({ labelKey: "k3.a", min: Math.log10(AMIN), max: Math.log10(AMAX), step: 0.0001,
      value: Math.log10(P.a), format: function (v) { return fmtAU(Math.pow(10, v)); },
      on: function (v) { if (busy) return; P.a = Math.pow(10, v); presetSel.set("custom"); syncP(); upd(); } });

    var pC = S.slider({ labelKey: "k3.P", min: Math.log10(PMIN), max: Math.log10(PMAX), step: 0.0001,
      value: Math.log10(periodOf(P.a)), format: function (v) { return fmtYr(Math.pow(10, v)); },
      on: function (v) { if (busy) return; P.a = aOfPeriod(Math.pow(10, v)); presetSel.set("custom"); syncA(); upd(); } });

    var oP = S.readout({ labelKey: "k3.rP" });
    var oA = S.readout({ labelKey: "k3.ra" });
    var oP2 = S.readout({ labelKey: "k3.rP2" });
    var oA3 = S.readout({ labelKey: "k3.ra3" });

    function setA(a) { P.a = clamp(a, AMIN, AMAX); presetSelToMatch(); syncA(); syncP(); upd(); }
    function presetSelToMatch() {
      var hit = PLANETS.find(function (p) { return Math.abs(p.a - P.a) < 1e-3; });
      busy = true; presetSel.set(hit ? hit.k : "custom"); busy = false;
    }
    function syncA() { busy = true; aC.set(Math.log10(P.a)); busy = false; }
    function syncP() { busy = true; pC.set(Math.log10(periodOf(P.a))); busy = false; }

    function fmtAU(a) { return (a < 10 ? a.toFixed(2) : a.toFixed(1)) + " AU"; }
    function fmtYr(p) { return (p < 10 ? p.toFixed(2) : p < 100 ? p.toFixed(1) : Math.round(p)) + " yr"; }
    function fmtNum(x) { return x < 10 ? x.toFixed(2) : x < 1000 ? x.toFixed(1) : Math.round(x).toLocaleString(); }

    function upd() {
      var p = periodOf(P.a);
      oP(fmtYr(p)); oA(fmtAU(P.a));
      oP2(fmtNum(p * p)); oA3(fmtNum(P.a * P.a * P.a));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---------- drawing ---------- */
    // plot box (log–log), right side; equation, top-left
    var PLOT = { x: 410, y: 150, w: 320, h: 290 };
    function plotX(a) { return PLOT.x + (Math.log10(a) - Math.log10(AMIN)) / (Math.log10(AMAX) - Math.log10(AMIN)) * PLOT.w; }
    function plotY(p) { return PLOT.y + PLOT.h - (Math.log10(p) - Math.log10(PMIN)) / (Math.log10(PMAX) - Math.log10(PMIN)) * PLOT.h; }

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 10, y: 8, w: 740, h: 454 });
      equation(ctx);
      plot(ctx);
    });

    function equation(ctx) {
      // headline
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = COL.eq; ctx.font = "700 30px system-ui";
      var hx = 40, hy = 64;
      ctx.fillText("P", hx, hy); var w1 = ctx.measureText("P").width;
      ctx.font = "700 18px system-ui"; ctx.fillText("2", hx + w1 + 1, hy - 16);
      ctx.font = "700 30px system-ui"; var eqx = hx + w1 + 16;
      ctx.fillText("=", eqx, hy);
      var ax = eqx + 34; ctx.fillText("a", ax, hy); var wa = ctx.measureText("a").width;
      ctx.font = "700 18px system-ui"; ctx.fillText("3", ax + wa + 1, hy - 16);

      // substituted:  ( P )² = ( a )³
      var p = periodOf(P.a), y = 120, x = 40;
      ctx.font = "700 22px system-ui";
      x = paren(ctx, x, y, fmtYr(p), COL.P, 22);
      ctx.fillStyle = COL.eq; ctx.font = "700 14px system-ui"; ctx.fillText("2", x + 1, y - 14); x += 12;
      ctx.fillStyle = COL.eq; ctx.font = "700 22px system-ui"; ctx.fillText("=", x + 6, y); x += 30;
      x = paren(ctx, x, y, fmtAU(P.a), COL.a, 22);
      ctx.fillStyle = COL.eq; ctx.font = "700 14px system-ui"; ctx.fillText("3", x + 1, y - 14);

      // the equality of the two cubes/squares
      ctx.font = "600 16px system-ui"; ctx.fillStyle = "#cfd8ee";
      ctx.fillText(fmtNum(p * p) + "  =  " + fmtNum(P.a * P.a * P.a), 40, 172);
      ctx.fillStyle = "#7d8cb0"; ctx.font = "12px system-ui";
      ctx.fillText("P in years   ·   a in AU", 42, 198);

      // colour key + planet readout, lower-left
      var label = "";
      var hit = PLANETS.find(function (pl) { return Math.abs(pl.a - P.a) < 1e-3; });
      label = hit ? hit.k : "custom orbit";
      ctx.fillStyle = "#9fb0d0"; ctx.font = "700 15px system-ui"; ctx.fillText(label, 42, 250);
      keySwatch(ctx, 42, 286, COL.P, "P  orbital period");
      keySwatch(ctx, 42, 312, COL.a, "a  semimajor axis");
    }

    function paren(ctx, x, y, s, col, sz) {
      ctx.fillStyle = "#9fb0d0"; ctx.font = sz + "px system-ui"; ctx.fillText("(", x, y); x += ctx.measureText("(").width + 4;
      ctx.fillStyle = col; ctx.font = "700 " + sz + "px system-ui"; ctx.fillText(s, x, y); x += ctx.measureText(s).width + 4;
      ctx.fillStyle = "#9fb0d0"; ctx.font = sz + "px system-ui"; ctx.fillText(")", x, y); x += ctx.measureText(")").width;
      return x;
    }
    function keySwatch(ctx, x, y, col, label) {
      ctx.fillStyle = col; ctx.fillRect(x, y - 10, 13, 13);
      ctx.fillStyle = "#cfd8ee"; ctx.font = "13px system-ui"; ctx.textAlign = "left"; ctx.fillText(label, x + 20, y); }

    function plot(ctx) {
      // frame
      ctx.fillStyle = "#0a1124"; roundRect(ctx, PLOT.x, PLOT.y, PLOT.w, PLOT.h, 6); ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      // gridlines at decades
      ctx.font = "10px system-ui"; ctx.textBaseline = "middle";
      var aDec = [0.2, 1, 10, 100], pDec = [0.1, 1, 10, 100, 1000];
      ctx.strokeStyle = "#1b2748";
      aDec.forEach(function (a) { if (a < AMIN || a > AMAX) return; var x = plotX(a); ctx.beginPath(); ctx.moveTo(x, PLOT.y); ctx.lineTo(x, PLOT.y + PLOT.h); ctx.stroke();
        ctx.fillStyle = "#7d8cb0"; ctx.textAlign = "center"; ctx.fillText(a < 1 ? a : a + "", x, PLOT.y + PLOT.h + 12); });
      pDec.forEach(function (p) { if (p < PMIN || p > PMAX) return; var y = plotY(p); ctx.beginPath(); ctx.moveTo(PLOT.x, y); ctx.lineTo(PLOT.x + PLOT.w, y); ctx.stroke();
        ctx.fillStyle = "#7d8cb0"; ctx.textAlign = "right"; ctx.fillText(p < 1 ? p : p + "", PLOT.x - 5, y); });
      // axis titles
      ctx.fillStyle = "#9fb0d0"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText("a  (AU)", PLOT.x + PLOT.w / 2, PLOT.y + PLOT.h + 26);
      ctx.save(); ctx.translate(PLOT.x - 30, PLOT.y + PLOT.h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("P  (yr)", 0, 0); ctx.restore();

      // P = a^1.5 line
      ctx.strokeStyle = COL.line; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(plotX(AMIN), plotY(periodOf(AMIN))); ctx.lineTo(plotX(AMAX), plotY(periodOf(AMAX))); ctx.stroke();

      // planet dots
      PLANETS.forEach(function (pl) {
        var x = plotX(pl.a), y = plotY(periodOf(pl.a));
        ctx.fillStyle = "#cdd8f0"; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 2 * Math.PI); ctx.fill();
        ctx.fillStyle = "#8f9fc4"; ctx.font = "10px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText(pl.k, x + 6, y - 2);
      });

      // current marker
      var cx = plotX(P.a), cy = plotY(periodOf(P.a));
      ctx.strokeStyle = "rgba(255,166,77,.4)"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, PLOT.y + PLOT.h); ctx.lineTo(cx, cy); ctx.lineTo(PLOT.x, cy); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#fff"; ctx.strokeStyle = COL.P; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }

    function panel(ctx, r) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    /* ---------- drag the marker along the curve ---------- */
    var dragging = false;
    function evtPos(e) {
      var rect = S.canvas.getBoundingClientRect();
      var t = e.touches ? e.touches[0] : e;
      return { x: (t.clientX - rect.left) * (S.W / rect.width), y: (t.clientY - rect.top) * (S.H / rect.height) };
    }
    function pickA(px) { // invert plotX, clamp to range
      var t = (px - PLOT.x) / PLOT.w;
      var la = Math.log10(AMIN) + clamp(t, 0, 1) * (Math.log10(AMAX) - Math.log10(AMIN));
      return Math.pow(10, la);
    }
    S.canvas.addEventListener("mousedown", function (e) {
      var p = evtPos(e), cx = plotX(P.a), cy = plotY(periodOf(P.a));
      if (Math.hypot(p.x - cx, p.y - cy) < 16 || (p.x > PLOT.x && p.x < PLOT.x + PLOT.w && p.y > PLOT.y && p.y < PLOT.y + PLOT.h)) {
        dragging = true; setA(pickA(p.x)); e.preventDefault();
      }
    });
    window.addEventListener("mousemove", function (e) { if (!dragging) return; setA(pickA(evtPos(e).x)); });
    window.addEventListener("mouseup", function () { dragging = false; });

    setA(1.0);
    upd();
  }
});
