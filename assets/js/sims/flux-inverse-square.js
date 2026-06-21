/* Flux Simulator (inverse-square law) -----------------------------------------
   Faithful rebuild of the ClassAction "Flux Simulator" (lightdetector.swf):
   TWO independent bulb+detector setups for side-by-side comparison. Each has a
   Watts dial (bulb power), a glowing bulb, and a detector that slides along a
   distance track (R = 1..5) showing the measured flux. Reading = P/(16π R²),
   so 100 W at R=1 reads 1.989 — matching the original.                          */
Sim.create({
  id: "flux-inverse-square",
  width: 760, height: 460,
  strings: {
    en: {
      "is.setupA": "Setup A", "is.setupB": "Setup B",
      "is.power": "bulb power", "is.dist": "detector distance",
      "is.fluxA": "flux A", "is.fluxB": "flux B", "is.ratio": "flux A ÷ flux B",
      "is.watts": "Watts"
    },
    id: {
      "is.setupA": "Susunan A", "is.setupB": "Susunan B",
      "is.power": "daya bohlam", "is.dist": "jarak detektor",
      "is.fluxA": "fluks A", "is.fluxB": "fluks B", "is.ratio": "fluks A ÷ fluks B",
      "is.watts": "Watt"
    }
  },
  about: {
    en: "<p>Light from a point source spreads over the surface of an ever-growing sphere, so the energy falling on a fixed detector — the <strong>flux</strong> — drops as <strong>1 / R²</strong>. Doubling the distance quarters the reading; tripling it leaves only one ninth.</p>" +
        "<p>There are <strong>two complete setups</strong> so you can compare. Move each detector along its track (or use the sliders) and change each bulb's power. Try giving both bulbs the same power but placing one detector at R = 1 and the other at R = 2 — the second reads ¼ as much.</p>" +
        "<p>Flux also scales straight with the bulb's power, so a 4× brighter bulb at 2× the distance reads the same. This is exactly how astronomers compare a star's true luminosity with how bright it appears.</p>",
    id: "<p>Cahaya dari sumber titik menyebar ke permukaan bola yang terus membesar, sehingga energi yang jatuh pada detektor tetap — <strong>fluks</strong> — turun sebagai <strong>1 / R²</strong>. Menggandakan jarak memotong bacaan jadi seperempat; melipattigakan jarak menyisakan sepersembilan.</p>" +
        "<p>Ada <strong>dua susunan lengkap</strong> agar bisa dibandingkan. Geser tiap detektor sepanjang jalurnya (atau pakai penggeser) dan ubah daya tiap bohlam. Coba beri kedua bohlam daya sama tetapi letakkan satu detektor di R = 1 dan lainnya di R = 2 — yang kedua membaca ¼-nya.</p>" +
        "<p>Fluks juga sebanding lurus dengan daya bohlam, jadi bohlam 4× lebih terang pada jarak 2× membaca sama. Inilah cara astronom membandingkan luminositas sejati bintang dengan kecerlangan tampaknya.</p>"
  },
  build: function (S) {
    var A = { power: 100, R: 1 }, B = { power: 100, R: 2 };
    var X0 = 252, X1 = 722;                  // track: R=1 .. R=5
    function mapR(R) { return X0 + (R - 1) / 4 * (X1 - X0); }
    function flux(st) { return st.power / (16 * Math.PI * st.R * st.R); }
    function fmtR(R) { return Math.abs(R - Math.round(R)) < 0.05 ? String(Math.round(R)) : R.toFixed(1); }

    S.group("is.setupA");
    var pA = S.slider({ labelKey: "is.power", min: 20, max: 500, step: 5, value: A.power, unit: " W", on: function (v) { A.power = v; upd(); } });
    var dA = S.slider({ labelKey: "is.dist", min: 1, max: 5, step: 0.1, value: A.R, format: rfmt, on: function (v) { A.R = v; upd(); } });
    S.group("is.setupB");
    var pB = S.slider({ labelKey: "is.power", min: 20, max: 500, step: 5, value: B.power, unit: " W", on: function (v) { B.power = v; upd(); } });
    var dB = S.slider({ labelKey: "is.dist", min: 1, max: 5, step: 0.1, value: B.R, format: rfmt, on: function (v) { B.R = v; upd(); } });
    function rfmt(v) { return "R = " + fmtR(v); }

    var outA = S.readout({ labelKey: "is.fluxA" });
    var outB = S.readout({ labelKey: "is.fluxB" });
    var outRatio = S.readout({ labelKey: "is.ratio" });
    function upd() {
      outA(flux(A).toFixed(3)); outB(flux(B).toFixed(3));
      outRatio((flux(A) / flux(B)).toFixed(2) + "×");
      S.requestDraw();
    }

    /* drag a detector along its track */
    var drag = null;
    function evtPos(e) { var r = S.canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (S.W / r.width), y: (e.clientY - r.top) * (S.H / r.height) }; }
    function rowY(which) { return which === "A" ? 24 : 240; }
    S.canvas.style.touchAction = "none";
    S.canvas.addEventListener("pointerdown", function (e) {
      var p = evtPos(e);
      ["A", "B"].forEach(function (w) {
        var st = w === "A" ? A : B, ty = rowY(w) + 96;
        if (Math.abs(p.x - mapR(st.R)) < 26 && Math.abs(p.y - ty) < 46) drag = w;
      });
      if (drag) { S.canvas.setPointerCapture(e.pointerId); applyDrag(p); e.preventDefault(); }
    });
    S.canvas.addEventListener("pointermove", function (e) {
      var p = evtPos(e);
      if (drag) { applyDrag(p); return; }
      var over = false;
      ["A", "B"].forEach(function (w) { var st = w === "A" ? A : B, ty = rowY(w) + 96; if (Math.abs(p.x - mapR(st.R)) < 26 && Math.abs(p.y - ty) < 46) over = true; });
      S.canvas.style.cursor = over ? "grab" : "default";
    });
    function endDrag() { drag = null; }
    S.canvas.addEventListener("pointerup", endDrag);
    S.canvas.addEventListener("pointercancel", endDrag);
    function applyDrag(p) {
      var R = 1 + (p.x - X0) / (X1 - X0) * 4; R = Math.max(1, Math.min(5, R));
      if (drag === "A") { A.R = R; dA.set(R); } else { B.R = R; dB.set(R); }   // .set triggers upd via on()
    }

    S.onDraw(function () {
      S.clear();
      drawRow(S.ctx, A, 24, "is.fluxA");
      drawRow(S.ctx, B, 240, "is.fluxB");
    });
    upd();

    function drawRow(ctx, st, yTop, key) {
      // panel
      roundRect(ctx, 12, yTop, S.W - 24, 196, 12);
      ctx.fillStyle = "#0e1530"; ctx.fill(); ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left";
      ctx.fillText(I18N.t(key === "is.fluxA" ? "is.setupA" : "is.setupB").toUpperCase(), 26, yTop + 22);

      drawDial(ctx, 96, yTop + 92, 44, st.power);
      drawBulb(ctx, 190, yTop + 88, st.power);

      // track
      var ty = yTop + 96;
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(X0, ty); ctx.lineTo(X1, ty); ctx.stroke();
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      for (var R = 1; R <= 5; R++) {
        var x = mapR(R);
        ctx.strokeStyle = "#3a4a78"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, ty - 5); ctx.lineTo(x, ty + 5); ctx.stroke();
        ctx.fillText(String(R), x, ty + 20);
      }

      // light rays bulb -> detector
      var dx = mapR(st.R);
      ctx.strokeStyle = "rgba(255,209,102," + (0.12 + st.power / 1500) + ")"; ctx.lineWidth = 1;
      for (var a = -1; a <= 1; a++) {
        ctx.beginPath(); ctx.moveTo(204, yTop + 88); ctx.lineTo(dx, ty + a * 16); ctx.stroke();
      }

      // detector probe + reading
      ctx.fillStyle = "#cfd8f0";
      ctx.beginPath(); ctx.moveTo(dx, ty - 2); ctx.lineTo(dx - 7, ty - 14); ctx.lineTo(dx + 7, ty - 14); ctx.closePath(); ctx.fill();
      var bw = 70, bh = 30, bx = dx - bw / 2, by = ty - 50;
      bx = Math.max(X0 - 20, Math.min(X1 - bw + 20, bx));
      roundRect(ctx, bx, by, bw, bh, 6); ctx.fillStyle = "#070b18"; ctx.fill(); ctx.strokeStyle = "#3a4a78"; ctx.stroke();
      ctx.fillStyle = "#ffd166"; ctx.font = "bold 15px var(--mono, monospace)"; ctx.textAlign = "center";
      ctx.fillText(flux(st).toFixed(3), bx + bw / 2, by + 20);
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "left";
      ctx.fillText("R = " + fmtR(st.R), bx + bw + 8, by + 19);
    }

    function drawDial(ctx, cx, cy, r, power) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fillStyle = "#1a2340"; ctx.fill(); ctx.strokeStyle = "#3a4a78"; ctx.lineWidth = 2; ctx.stroke();
      var stops = [20, 50, 100, 400, 500], a0 = Math.PI * 0.8, a1 = Math.PI * 2.2;  // sweep
      function frac(p) {
        for (var i = 0; i < stops.length - 1; i++) if (p <= stops[i + 1]) return (i + (p - stops[i]) / (stops[i + 1] - stops[i])) / (stops.length - 1);
        return 1;
      }
      ctx.fillStyle = "#9fabce"; ctx.font = "9px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      stops.forEach(function (s, i) {
        var a = a0 + (a1 - a0) * (i / (stops.length - 1));
        ctx.fillText(String(s), cx + (r - 9) * Math.cos(a), cy + (r - 9) * Math.sin(a));
      });
      ctx.textBaseline = "alphabetic";
      var na = a0 + (a1 - a0) * frac(power);
      ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + (r - 14) * Math.cos(na), cy + (r - 14) * Math.sin(na)); ctx.stroke();
      ctx.lineCap = "butt";
      ctx.fillStyle = "#e8ecf8"; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("is.watts"), cx, cy + r + 16);
    }

    function drawBulb(ctx, x, y, power) {
      var glow = 0.25 + power / 500 * 0.75;
      var rr = 13 + power / 500 * 7;
      var g = ctx.createRadialGradient(x, y, 1, x, y, rr * 2.6);
      g.addColorStop(0, "rgba(255,247,200," + glow + ")"); g.addColorStop(1, "rgba(255,209,102,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr * 2.6, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#ffe9a8"; ctx.beginPath(); ctx.arc(x, y, rr, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "#caa64a"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#8a8f9e"; roundRect(ctx, x - 5, y + rr - 2, 10, 8, 2); ctx.fill();   // base
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
