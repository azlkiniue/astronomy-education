/* Distance Modulus Explorer ---------------------------------------------------
   Faithful rebuild of the ClassAction "Distance Modulus Explorer" (stellarmag.swf):
     • a logarithmic distance line (Earth at the left; tick marks at 10, 100, 1000 pc)
       with a sliding marker at the current distance,
     • the colour-coded distance-modulus equation
            m − M  =  −5 + 5·log₁₀(d)            (d in parsecs)
       shown both as the magnitude difference and as the distance form, plus the
       distance echoed in light-years,
     • three sliders — m (red), M (yellow), d (blue) — and a Lock m / Lock M / Lock d
       choice: the locked quantity is held while the other two stay tied by the law.   */
Sim.create({
  id: "stellarmag",
  width: 760, height: 450,
  strings: {
    en: {
      "dm.app": "apparent  m", "dm.abs": "absolute  M", "dm.dist": "distance  d",
      "dm.lock": "Hold fixed", "dm.lm": "apparent m", "dm.lM": "absolute M", "dm.ld": "distance d",
      "dm.rmu": "modulus  m − M", "dm.rd": "distance d", "dm.rly": "in light-years", "dm.rbright": "appears"
    },
    id: {
      "dm.app": "semu  m", "dm.abs": "mutlak  M", "dm.dist": "jarak  d",
      "dm.lock": "Tahan tetap", "dm.lm": "semu m", "dm.lM": "mutlak M", "dm.ld": "jarak d",
      "dm.rmu": "modulus  m − M", "dm.rd": "jarak d", "dm.rly": "dalam tahun cahaya", "dm.rbright": "tampak"
    }
  },
  about: {
    en: "<p>How bright a star <em>looks</em> (apparent magnitude m) depends on how bright it truly <em>is</em> (absolute magnitude M — what it would look like from 10 parsecs) and how far away it sits. The <strong>distance modulus</strong> ties them together:</p>" +
        "<p style='text-align:center'><strong>m − M = 5·log₁₀(d) − 5</strong>,&nbsp; d in parsecs.</p>" +
        "<p>At 10 pc the two magnitudes are equal (m − M = 0). Every factor of 10 farther adds 5 to the modulus, dimming the star by 5 magnitudes. Pick which quantity to <strong>hold fixed</strong>, then move either of the other two — the third follows the law so the equation always balances.</p>",
    id: "<p>Seberapa terang bintang <em>terlihat</em> (magnitudo semu m) bergantung pada seberapa terang sebenarnya (magnitudo mutlak M — tampak dari 10 parsek) dan jaraknya. <strong>Modulus jarak</strong> mengikatnya:</p>" +
        "<p style='text-align:center'><strong>m − M = 5·log₁₀(d) − 5</strong>,&nbsp; d dalam parsek.</p>" +
        "<p>Pada 10 pc kedua magnitudo sama (m − M = 0). Setiap kelipatan 10 lebih jauh menambah 5 pada modulus, meredupkan bintang 5 magnitudo. Pilih besaran yang <strong>ditahan tetap</strong>, lalu geser salah satu dari dua lainnya — yang ketiga mengikuti hukum agar persamaan selalu seimbang.</p>"
  },
  build: function (S) {
    var COL = { m: "#ff6b6b", M: "#ffd23f", d: "#5a9cff" };
    var P = { m: 5.0, M: 5.0, d: 10.0 };   // consistent: m−M = 0 = 5log10(10)−5
    var lockVar = "M";
    var busy = false;

    function mu(d) { return 5 * Math.log10(d) - 5; }
    function solveD() { return Math.pow(10, (P.m - P.M + 5) / 5); }     // from m,M
    function solveM_fromMd() { return P.M + mu(P.d); }                  // m from M,d
    function solveM_abs() { return P.m - mu(P.d); }                     // M from m,d

    /* ---------- controls ---------- */
    S.group("dm.app");
    var mC = S.slider({ labelKey: "dm.app", min: -2, max: 20, step: 0.1, value: P.m, format: function (v) { return v.toFixed(1); },
      on: function (v) { if (busy) return; P.m = v; changed("m"); } });
    S.group("dm.abs");
    var MC = S.slider({ labelKey: "dm.abs", min: -10, max: 20, step: 0.1, value: P.M, format: function (v) { return v.toFixed(1); },
      on: function (v) { if (busy) return; P.M = v; changed("M"); } });
    S.group("dm.dist");
    var dC = S.slider({ labelKey: "dm.dist", min: Math.log10(1), max: Math.log10(100000), step: 0.001, value: Math.log10(P.d),
      format: function (v) { return fmtPc(Math.pow(10, v)); }, on: function (v) { if (busy) return; P.d = Math.pow(10, v); changed("d"); } });

    S.group("dm.lock");
    var lockSel = S.select({ labelKey: "dm.lock", value: "M", options: [
      { v: "m", labelKey: "dm.lm" }, { v: "M", labelKey: "dm.lM" }, { v: "d", labelKey: "dm.ld" }
    ], on: function (v) { lockVar = v; applyLock(); } });

    var oMu = S.readout({ labelKey: "dm.rmu" });
    var oD = S.readout({ labelKey: "dm.rd" });
    var oLy = S.readout({ labelKey: "dm.rly" });
    var oBr = S.readout({ labelKey: "dm.rbright" });

    function setD(d) { busy = true; P.d = clampD(d); dC.set(Math.log10(P.d)); busy = false; }
    function setM_app(m) { busy = true; P.m = clamp(m, -2, 20); mC.set(P.m); busy = false; }
    function setM_abs(M) { busy = true; P.M = clamp(M, -10, 20); MC.set(P.M); busy = false; }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function clampD(d) { return clamp(d, 1, 100000); }

    // when the user moves a free slider, the OTHER free one follows the law
    function changed(which) {
      if (which === lockVar) { applyLock(); return; }   // locked slider can't really move; re-pin
      if (lockVar === "M") { if (which === "m") setD(solveD()); else setM_app(solveM_fromMd()); }
      else if (lockVar === "m") { if (which === "M") setD(solveD()); else setM_abs(solveM_abs()); }
      else { /* lock d */ if (which === "m") setM_abs(solveM_abs()); else setM_app(solveM_fromMd()); }
      upd();
    }
    function applyLock() {
      mC.input.disabled = (lockVar === "m");
      MC.input.disabled = (lockVar === "M");
      dC.input.disabled = (lockVar === "d");
      [mC, MC, dC].forEach(function (c) { c.input.style.opacity = c.input.disabled ? 0.4 : 1; });
      upd();
    }

    function fmtPc(d) { return (d >= 1000 ? (d / 1000).toFixed(d >= 10000 ? 0 : 1) + " kpc" : d.toFixed(d < 10 ? 1 : 0) + " pc"); }
    function fmtLy(d) { var ly = d * 3.2616; return ly >= 1000 ? (ly / 1000).toFixed(1) + " kly" : ly.toFixed(ly < 10 ? 1 : 0) + " ly"; }

    function upd() {
      var m = P.m - P.M;
      oMu(m.toFixed(2));
      oD(fmtPc(P.d));
      oLy(fmtLy(P.d));
      oBr(m > 0.05 ? (m.toFixed(1) + " mag fainter") : (m < -0.05 ? (Math.abs(m).toFixed(1) + " mag brighter") : "as bright (10 pc)"));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---------- drawing ---------- */
    var SCALE = { x: 40, y: 86, w: 680 };   // distance line
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 10, y: 8, w: 740, h: 434 }, "");
      distanceLine(ctx);
      equation(ctx);
    });

    function xForD(d) { var t = Math.log10(d) / Math.log10(100000); return SCALE.x + t * SCALE.w; }
    function distanceLine(ctx) {
      var y = SCALE.y;
      // Earth
      var g = ctx.createRadialGradient(SCALE.x - 6, y - 4, 2, SCALE.x, y, 12);
      g.addColorStop(0, "#9fd0ff"); g.addColorStop(1, "#2a5fa0");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(SCALE.x, y, 12, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#7d8cb0"; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.fillText("Earth", SCALE.x, y + 28);
      // axis
      ctx.strokeStyle = "#3a4a72"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(SCALE.x + 14, y); ctx.lineTo(SCALE.x + SCALE.w, y); ctx.stroke();
      // ticks
      ctx.fillStyle = "#9fb0d0"; ctx.font = "12px system-ui";
      [10, 100, 1000, 10000].forEach(function (dd) {
        var xx = xForD(dd); ctx.strokeStyle = "#3a4a72"; ctx.beginPath(); ctx.moveTo(xx, y - 7); ctx.lineTo(xx, y + 7); ctx.stroke();
        ctx.fillStyle = "#9fb0d0"; ctx.textAlign = "center"; ctx.fillText(fmtPc(dd), xx, y + 24);
      });
      // current-distance marker
      var mx = xForD(P.d);
      ctx.strokeStyle = COL.d; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, y - 22); ctx.lineTo(mx, y + 10); ctx.stroke();
      ctx.fillStyle = COL.d; ctx.beginPath(); ctx.arc(mx, y, 6, 0, 2 * Math.PI); ctx.fill();
      // star at the marker, brightness from apparent magnitude
      var b = Math.max(0.12, Math.min(1, Math.pow(10, -0.4 * (P.m - 2))));
      ctx.save(); ctx.globalAlpha = b; ctx.fillStyle = "#fff8e0";
      star(ctx, mx, y - 34, 7); ctx.restore();
      ctx.fillStyle = COL.d; ctx.font = "700 12px system-ui"; ctx.textAlign = "center"; ctx.fillText(fmtPc(P.d), mx, y - 44);
    }

    function equation(ctx) {
      var x, y = 190;
      // line 1:  m − M = (value)
      x = seg(ctx, 50, y, P.m.toFixed(1), COL.m, 30, true);
      x = seg(ctx, x + 12, y, "−", "#9fb0d0", 30);
      x = seg(ctx, x + 12, y, P.M.toFixed(1), COL.M, 30, true);
      x = seg(ctx, x + 16, y, "=", "#9fb0d0", 30);
      x = seg(ctx, x + 16, y, (P.m - P.M).toFixed(2), "#eef2fb", 30, true);
      // line 2:  = −5 + 5 log10( d ) pc
      y = 256; x = 50;
      x = seg(ctx, x, y, "=  −5 + 5 log", "#cfd8ee", 26);
      ctx.font = "16px system-ui"; ctx.fillStyle = "#cfd8ee"; ctx.fillText("10", x + 1, y + 6); x += ctx.measureText("10").width + 4;
      x = seg(ctx, x, y, "(", "#9fb0d0", 26);
      x = seg(ctx, x + 2, y, fmtPc(P.d), COL.d, 26, true);
      x = seg(ctx, x + 2, y, ")", "#9fb0d0", 26);
      // line 3:  ( X ly )
      y = 304; seg(ctx, 70, y, "=  " + fmtLy(P.d) + " from Earth", "#9fb0d0", 18);
      // hint about lock
      ctx.fillStyle = "#7d8cb0"; ctx.font = "12px system-ui"; ctx.textAlign = "left";
      ctx.fillText("holding " + ({ m: "apparent m", M: "absolute M", d: "distance d" }[lockVar]) + " fixed — move the other two", 50, 360);
      // colour key
      var ky = 396;
      keySwatch(ctx, 50, ky, COL.m, "m  apparent magnitude");
      keySwatch(ctx, 290, ky, COL.M, "M  absolute magnitude");
      keySwatch(ctx, 540, ky, COL.d, "d  distance");
    }
    function keySwatch(ctx, x, y, col, label) {
      ctx.fillStyle = col; ctx.fillRect(x, y - 9, 12, 12);
      ctx.fillStyle = "#cfd8ee"; ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.fillText(label, x + 18, y);
    }
    function seg(ctx, x, y, s, col, sz, bold) { ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = (bold ? "700 " : "") + sz + "px system-ui"; ctx.fillText(s, x, y); return x + ctx.measureText(s).width; }
    function star(ctx, x, y, r) {
      ctx.beginPath();
      for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; ctx[i ? "lineTo" : "moveTo"](x + rr * Math.cos(a), y + rr * Math.sin(a)); }
      ctx.closePath(); ctx.fill();
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

    applyLock();
    upd();
  }
});
