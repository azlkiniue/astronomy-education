/* Center of Mass Simulator ---------------------------------------------------
   Faithful rebuild of the ClassAction "Center of Mass Simulator" (centerofmass.swf):
     • two masses on a beam with the balance point (centre of mass) marked, and the
       lever distances r₁, r₂ labelled,
     • object 1 mass, object 2 mass and separation sliders, plus "keep CM fixed",
     • a bonus "animate as orbit" mode that revolves both bodies about the barycentre
       — the heavier one on the tighter orbit — the basis of binary-star wobble.
   Lever balance:  m₁ r₁ = m₂ r₂ ,  r₁ = d·m₂/(m₁+m₂) ,  r₂ = d·m₁/(m₁+m₂).        */
Sim.create({
  id: "center-of-mass",
  width: 760, height: 430,
  strings: {
    en: {
      "cm.obj": "Masses", "cm.m1": "object 1 mass", "cm.m2": "object 2 mass", "cm.sep": "separation",
      "cm.opt": "Options", "cm.fixed": "keep centre of mass fixed", "cm.orbit": "animate as orbit",
      "cm.anim": "Animation", "cm.start": "start", "cm.pause": "pause", "cm.speed": "speed",
      "cm.r1": "r₁ (object 1 → CM)", "cm.r2": "r₂ (CM → object 2)", "cm.ratio": "mass ratio m₁ : m₂",
      "cm.torque": "m₁·r₁  =  m₂·r₂", "cm.title": "centre of mass", "cm.cmlabel": "CM"
    },
    id: {
      "cm.obj": "Massa", "cm.m1": "massa benda 1", "cm.m2": "massa benda 2", "cm.sep": "pemisahan",
      "cm.opt": "Opsi", "cm.fixed": "jaga pusat massa tetap", "cm.orbit": "animasikan sebagai orbit",
      "cm.anim": "Animasi", "cm.start": "mulai", "cm.pause": "jeda", "cm.speed": "kecepatan",
      "cm.r1": "r₁ (benda 1 → PM)", "cm.r2": "r₂ (PM → benda 2)", "cm.ratio": "rasio massa m₁ : m₂",
      "cm.torque": "m₁·r₁  =  m₂·r₂", "cm.title": "pusat massa", "cm.cmlabel": "PM"
    }
  },
  about: {
    en: "<p>Two objects always balance about their shared <strong>centre of mass</strong> — the point where their <em>lever arms</em> are matched: m₁·r₁ = m₂·r₂. The heavier object sits closer in, on the shorter arm, exactly like two children of different weights balancing a see-saw.</p>" +
        "<p>Slide the masses and separation and watch the balance point shift. Double one mass and its distance to the centre halves; make the masses equal and the centre sits dead between them.</p>" +
        "<p>Switch to <strong>orbit mode</strong>: both bodies circle the centre of mass with the same period, the lighter one swinging out on the wider orbit. That tiny mirror-orbit of the brighter star is the <strong>wobble</strong> that reveals unseen companions and exoplanets.</p>",
    id: "<p>Dua benda selalu seimbang terhadap <strong>pusat massa</strong> bersama — titik tempat <em>lengan tuas</em> mereka setara: m₁·r₁ = m₂·r₂. Benda yang lebih berat berada lebih dekat, pada lengan yang lebih pendek, persis seperti dua anak berbeda berat menyeimbangkan jungkat-jungkit.</p>" +
        "<p>Geser massa dan pemisahan lalu amati titik seimbang bergeser. Gandakan satu massa dan jaraknya ke pusat memendek separuh; samakan massa dan pusat berada tepat di tengah.</p>" +
        "<p>Beralih ke <strong>mode orbit</strong>: kedua benda mengelilingi pusat massa dengan periode sama, yang lebih ringan berayun lebih lebar. Orbit-cermin mungil bintang terang itulah <strong>ayunan</strong> yang mengungkap pendamping tak terlihat dan eksoplanet.</p>"
  },
  build: function (S) {
    var P = { m1: 7, m2: 3, sep: 10 };
    var angle = 0, speed = 0.8;

    function r1() { return P.sep * P.m2 / (P.m1 + P.m2); }   // object 1 → CM
    function r2() { return P.sep * P.m1 / (P.m1 + P.m2); }   // CM → object 2

    /* ---- controls ---- */
    S.group("cm.obj");
    var m1C = S.slider({ labelKey: "cm.m1", min: 0.5, max: 15, step: 0.1, value: P.m1, on: function (v) { P.m1 = v; upd(); } });
    var m2C = S.slider({ labelKey: "cm.m2", min: 0.5, max: 15, step: 0.1, value: P.m2, on: function (v) { P.m2 = v; upd(); } });
    var sepC = S.slider({ labelKey: "cm.sep", min: 2, max: 16, step: 0.1, value: P.sep, on: function (v) { P.sep = v; upd(); } });

    S.group("cm.opt");
    var optFixed = S.toggle({ labelKey: "cm.fixed", value: true });
    var optOrbit = S.toggle({ labelKey: "cm.orbit", value: false, on: function (v) { if (!v) { loop.pause(); syncPlay(); } S.requestDraw(); } });

    S.group("cm.anim");
    var loop = S.loop(function (dt) { angle += speed * dt; S.requestDraw(); });
    var playBtn = S.button({ labelKey: "cm.start", primary: true, on: function () { if (!optOrbit.value()) optOrbit.set(true); loop.toggle(); syncPlay(); } });
    function syncPlay() { var key = loop.playing ? "cm.pause" : "cm.start"; playBtn.setAttribute("data-i18n", key); playBtn.textContent = I18N.t(key); }
    S.refreshers.push(syncPlay);
    S.slider({ labelKey: "cm.speed", min: 0.1, max: 2.5, step: 0.1, value: speed, format: function (v) { return v.toFixed(1) + "×"; }, on: function (v) { speed = v; } });

    var oR1 = S.readout({ labelKey: "cm.r1" });
    var oR2 = S.readout({ labelKey: "cm.r2" });
    var oRatio = S.readout({ labelKey: "cm.ratio" });
    var oTorque = S.readout({ labelKey: "cm.torque" });
    function gcd(a, b) { return b < 0.01 ? a : gcd(b, a % b); }
    function upd() {
      oR1(r1().toFixed(2));
      oR2(r2().toFixed(2));
      var g = gcd(P.m1, P.m2); oRatio((P.m1 / g).toFixed(1) + " : " + (P.m2 / g).toFixed(1));
      oTorque((P.m1 * r1()).toFixed(1) + " = " + (P.m2 * r2()).toFixed(1));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ===================================================================== */
    var VIEW = { x: 12, y: 28, w: 736, h: 374 };
    S.onDraw(function () { var ctx = S.ctx; S.clear(); draw(ctx); });

    // drag a mass horizontally to change the separation
    var dragging = 0;
    function localXY(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    S.canvas.addEventListener("pointerdown", function (ev) { if (optOrbit.value()) return; var m = localXY(ev), g = geom(); if (Math.hypot(m.x - g.x1, m.y - g.cy) < g.R1 + 8) dragging = 1; else if (Math.hypot(m.x - g.x2, m.y - g.cy) < g.R2 + 8) dragging = 2; if (dragging) S.canvas.setPointerCapture(ev.pointerId); });
    S.canvas.addEventListener("pointermove", function (ev) { if (!dragging) return; var m = localXY(ev), g = geom(); var d = Math.abs(m.x - g.cmx) / g.sc; var newSep = dragging === 1 ? d / (P.m2 / (P.m1 + P.m2)) : d / (P.m1 / (P.m1 + P.m2)); P.sep = Math.max(2, Math.min(16, newSep)); sepC.set(P.sep); });
    S.canvas.addEventListener("pointerup", function () { dragging = 0; });

    function geom() {
      var cy = VIEW.y + VIEW.h / 2;
      var sc = (VIEW.w * 0.40) / Math.max(8, P.sep);                  // px per unit
      var cmx;
      if (optFixed.value()) cmx = VIEW.x + VIEW.w / 2;
      else cmx = VIEW.x + 60 + r1() * sc;                             // object 1 pinned near the left
      var x1 = cmx - r1() * sc, x2 = cmx + r2() * sc;
      var R1 = 8 + 4 * Math.cbrt(P.m1), R2 = 8 + 4 * Math.cbrt(P.m2);
      return { cy: cy, sc: sc, cmx: cmx, x1: x1, x2: x2, R1: R1, R2: R2 };
    }

    function ball(ctx, x, y, R, hue) {
      var g = ctx.createRadialGradient(x - R * 0.3, y - R * 0.3, R * 0.2, x, y, R);
      g.addColorStop(0, hue[0]); g.addColorStop(1, hue[1]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1; ctx.stroke();
    }
    function cmMark(ctx, x, y) {                          // green "+" with label, like the SWF
      ctx.strokeStyle = "#46d160"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8); ctx.stroke();
      ctx.fillStyle = "#46d160"; ctx.font = "700 12px system-ui"; ctx.textAlign = "center"; ctx.fillText(I18N.t("cm.cmlabel"), x, y - 13);
    }
    function doubleArrow(ctx, xa, xb, y, col) {            // double-headed horizontal arrow
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.stroke();
      var d = xb > xa ? 1 : -1;
      [[xa, -d], [xb, d]].forEach(function (h) { ctx.beginPath(); ctx.moveTo(h[0], y); ctx.lineTo(h[0] - h[1] * 8, y - 4); ctx.lineTo(h[0] - h[1] * 8, y + 4); ctx.closePath(); ctx.fill(); });
    }

    function draw(ctx) {
      panel(ctx, VIEW, I18N.t("cm.title"));
      var g = geom();
      if (optOrbit.value()) { drawOrbit(ctx, g); return; }

      // light reference grid (like the SWF's graph paper)
      ctx.save(); roundRect(ctx, VIEW.x + 1, VIEW.y + 1, VIEW.w - 2, VIEW.h - 2, 11); ctx.clip();
      ctx.strokeStyle = "rgba(165,180,215,0.10)"; ctx.lineWidth = 1;
      for (var gx = VIEW.x + 13; gx < VIEW.x + VIEW.w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, VIEW.y); ctx.lineTo(gx, VIEW.y + VIEW.h); ctx.stroke(); }
      for (var gy = VIEW.y + 13; gy < VIEW.y + VIEW.h; gy += 26) { ctx.beginPath(); ctx.moveTo(VIEW.x, gy); ctx.lineTo(VIEW.x + VIEW.w, gy); ctx.stroke(); }
      ctx.restore();

      // colour-coded lever arms: r₁ blue (m₁ → CM), r₂ red (CM → m₂)
      var ay = g.cy + 28;
      doubleArrow(ctx, g.x1, g.cmx, ay, "#5a9cff");
      doubleArrow(ctx, g.cmx, g.x2, ay, "#ff5a5a");
      ctx.font = "700 12px system-ui"; ctx.textAlign = "center";
      ctx.fillStyle = "#5a9cff"; ctx.fillText("r₁ = " + r1().toFixed(2), (g.x1 + g.cmx) / 2, ay + 18);
      ctx.fillStyle = "#ff5a5a"; ctx.fillText("r₂ = " + r2().toFixed(2), (g.cmx + g.x2) / 2, ay + 18);

      // masses (grey spheres, m₁ larger), like the SWF
      ball(ctx, g.x1, g.cy, g.R1, ["#e2e6ee", "#878f9e"]);
      ball(ctx, g.x2, g.cy, g.R2, ["#e2e6ee", "#878f9e"]);
      ctx.fillStyle = "#10141d"; ctx.font = "700 12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("m₁", g.x1, g.cy); ctx.fillText("m₂", g.x2, g.cy); ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui";
      ctx.fillText(P.m1.toFixed(1), g.x1, g.cy - g.R1 - 8); ctx.fillText(P.m2.toFixed(1), g.x2, g.cy - g.R2 - 8);

      cmMark(ctx, g.cmx, g.cy);

      ctx.fillStyle = "#5b6a86"; ctx.font = "10px system-ui"; ctx.textAlign = "center"; ctx.fillText("drag a mass to change separation", VIEW.x + VIEW.w / 2, VIEW.y + VIEW.h - 14);
    }

    function drawOrbit(ctx, g) {
      var cx = VIEW.x + VIEW.w / 2, cy = VIEW.y + VIEW.h / 2;
      var sc = (VIEW.h * 0.32) / Math.max(r1(), r2());
      var a1 = r1() * sc, a2 = r2() * sc;
      // orbit paths
      ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(120,150,230,0.5)"; ctx.beginPath(); ctx.arc(cx, cy, a1, 0, 2 * Math.PI); ctx.stroke();
      ctx.strokeStyle = "rgba(220,150,90,0.5)"; ctx.beginPath(); ctx.arc(cx, cy, a2, 0, 2 * Math.PI); ctx.stroke();
      ctx.setLineDash([]);
      // bodies on opposite sides of the CM
      var x1 = cx + a1 * Math.cos(angle + Math.PI), y1 = cy + a1 * Math.sin(angle + Math.PI);
      var x2 = cx + a2 * Math.cos(angle), y2 = cy + a2 * Math.sin(angle);
      ctx.strokeStyle = "rgba(160,170,200,0.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      cmMark(ctx, cx, cy);
      ball(ctx, x1, y1, g.R1, ["#cfe0ff", "#5a78c8"]);
      ball(ctx, x2, y2, g.R2, ["#ffe1c0", "#c8895a"]);
      ctx.fillStyle = "#0b1020"; ctx.font = "700 11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("m₁", x1, y1); ctx.fillText("m₂", x2, y2); ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText("both bodies share one period — heavier orbits tighter (r₁ : r₂ = " + r1().toFixed(2) + " : " + r2().toFixed(2) + ")", cx, VIEW.y + VIEW.h - 18);
    }

    upd();

    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title.toUpperCase(), r.x + 14, r.y + 18);
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
