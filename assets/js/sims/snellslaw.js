/* Snell's Law Demonstrator ----------------------------------------------------
   Faithful rebuild of the ClassAction "Snell's Law Demonstrator" (snellslaw.swf):
     • two stacked media with a refractive index each (chosen from a list of real
       materials or set freely), and the headline relation
            n₁ · sin θ₁  =  n₂ · sin θ₂
       with every quantity substituted and colour-coded (n₁ red, θ₁ blue, n₂ green,
       θ₂ orange — matching the original),
     • a ray diagram: an incident ray you can drag, the refracted ray bending toward
       or away from the normal, the partially-reflected ray, the dashed normal and
       labelled angle arcs,
     • the critical angle and a "total internal reflection" state when n₁·sinθ₁ > n₂.   */
Sim.create({
  id: "snellslaw",
  width: 760, height: 520,
  strings: {
    en: {
      "sn.med1": "Medium 1  (incident, n₁)", "sn.med2": "Medium 2  (refracted, n₂)",
      "sn.n1": "index n₁", "sn.n2": "index n₂", "sn.ang": "Incident angle",
      "sn.theta1": "angle of incidence θ₁",
      "sn.rn1": "n₁", "sn.rn2": "n₂", "sn.rt1": "θ₁ (incidence)", "sn.rt2": "θ₂ (refraction)",
      "sn.crit": "critical angle", "sn.status": "status", "sn.na": "—",
      "sn.refr": "refracted", "sn.tir": "total internal reflection"
    },
    id: {
      "sn.med1": "Medium 1  (datang, n₁)", "sn.med2": "Medium 2  (bias, n₂)",
      "sn.n1": "indeks n₁", "sn.n2": "indeks n₂", "sn.ang": "Sudut datang",
      "sn.theta1": "sudut datang θ₁",
      "sn.rn1": "n₁", "sn.rn2": "n₂", "sn.rt1": "θ₁ (datang)", "sn.rt2": "θ₂ (bias)",
      "sn.crit": "sudut kritis", "sn.status": "status", "sn.na": "—",
      "sn.refr": "dibiaskan", "sn.tir": "pemantulan internal total"
    }
  },
  about: {
    en: "<p>When light crosses from one transparent medium into another it changes speed, and so it bends. <strong>Snell's law</strong> ties the bend to the two refractive indices: n₁·sin θ₁ = n₂·sin θ₂, with each angle measured from the <em>normal</em> (the dashed line perpendicular to the surface).</p>" +
        "<p>Going into a denser medium (larger n) the ray bends <em>toward</em> the normal; going into a thinner one it bends away. Drag the incident ray or use the sliders and watch θ₂ respond.</p>" +
        "<p>From a slow medium into a fast one there is a <strong>critical angle</strong> beyond which sin θ₂ would exceed 1 — no light escapes and you get <strong>total internal reflection</strong>, the principle behind optical fibres.</p>",
    id: "<p>Ketika cahaya berpindah dari satu medium tembus cahaya ke medium lain, kecepatannya berubah, sehingga membelok. <strong>Hukum Snell</strong> mengaitkan pembelokan dengan dua indeks bias: n₁·sin θ₁ = n₂·sin θ₂, dengan tiap sudut diukur dari <em>garis normal</em> (garis putus-putus tegak lurus permukaan).</p>" +
        "<p>Masuk ke medium lebih rapat (n besar) sinar membelok <em>menuju</em> normal; ke medium lebih renggang membelok menjauh. Seret sinar datang atau gunakan slider dan amati θ₂.</p>" +
        "<p>Dari medium lambat ke medium cepat ada <strong>sudut kritis</strong>; di luarnya sin θ₂ akan melebihi 1 — tak ada cahaya lolos dan terjadi <strong>pemantulan internal total</strong>, prinsip di balik serat optik.</p>"
  },
  build: function (S) {
    var MEDIA = [
      { n: 1.000, en: "Vacuum", id: "Vakum" },
      { n: 1.0003, en: "Air", id: "Udara" },
      { n: 1.31, en: "Ice", id: "Es" },
      { n: 1.33, en: "Water", id: "Air (cair)" },
      { n: 1.36, en: "Ethanol", id: "Etanol" },
      { n: 1.47, en: "Oil", id: "Minyak" },
      { n: 1.50, en: "Glass", id: "Kaca" },
      { n: 1.52, en: "Crown glass", id: "Kaca crown" },
      { n: 1.92, en: "Sapphire", id: "Safir" },
      { n: 2.42, en: "Diamond", id: "Intan" }
    ];
    function mediaOpts() { return MEDIA.map(function (m, i) { return { v: "" + i, label: m[I18N.getLang()] + " (" + m.n.toFixed(2) + ")" }; }); }
    var P = { n1: 1.0003, n2: 1.33, th1: 45 };          // air → water, 45°
    var lock = false;

    /* ---------- controls ---------- */
    S.group("sn.med1");
    var med1 = S.select({ labelKey: "sn.n1", value: "1", options: mediaOpts(), on: function (v) { if (lock) return; P.n1 = MEDIA[+v].n; lock = true; n1C.set(P.n1); lock = false; upd(); } });
    var n1C = S.slider({ labelKey: "sn.n1", min: 1.0, max: 2.6, step: 0.01, value: P.n1, format: function (v) { return v.toFixed(2); }, on: function (v) { if (lock) return; P.n1 = v; syncSel(med1, v); upd(); } });

    S.group("sn.med2");
    var med2 = S.select({ labelKey: "sn.n2", value: "3", options: mediaOpts(), on: function (v) { if (lock) return; P.n2 = MEDIA[+v].n; lock = true; n2C.set(P.n2); lock = false; upd(); } });
    var n2C = S.slider({ labelKey: "sn.n2", min: 1.0, max: 2.6, step: 0.01, value: P.n2, format: function (v) { return v.toFixed(2); }, on: function (v) { if (lock) return; P.n2 = v; syncSel(med2, v); upd(); } });

    S.group("sn.ang");
    var thC = S.slider({ labelKey: "sn.theta1", min: 0, max: 89, step: 0.5, value: P.th1, unit: "°", on: function (v) { P.th1 = v; upd(); } });

    function syncSel(sel, v) {       // light up the NEAREST preset when the index matches one closely
      var idx = -1, bd = 0.005; MEDIA.forEach(function (m, i) { var d = Math.abs(m.n - v); if (d < bd) { bd = d; idx = i; } });
      if (idx >= 0) { lock = true; sel.set("" + idx); lock = false; }
      // when no preset matches we leave the select where it is (the n readout is authoritative)
    }

    var oN1 = S.readout({ labelKey: "sn.rn1" });
    var oN2 = S.readout({ labelKey: "sn.rn2" });
    var oT1 = S.readout({ labelKey: "sn.rt1" });
    var oT2 = S.readout({ labelKey: "sn.rt2" });
    var oCrit = S.readout({ labelKey: "sn.crit" });
    var oStat = S.readout({ labelKey: "sn.status" });

    var RAD = Math.PI / 180;
    function theta2() {                       // returns degrees, or null if TIR
      var s = P.n1 * Math.sin(P.th1 * RAD) / P.n2;
      if (s > 1) return null;
      return Math.asin(s) / RAD;
    }
    function critical() { return P.n1 > P.n2 ? Math.asin(P.n2 / P.n1) / RAD : null; }

    function upd() {
      var t2 = theta2(), c = critical();
      oN1(P.n1.toFixed(3)); oN2(P.n2.toFixed(3));
      oT1(P.th1.toFixed(1) + "°");
      oT2(t2 == null ? I18N.t("sn.na") : t2.toFixed(1) + "°");
      oCrit(c == null ? I18N.t("sn.na") : c.toFixed(1) + "°");
      oStat(t2 == null ? I18N.t("sn.tir") : I18N.t("sn.refr"));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---------- geometry / interaction ---------- */
    var DIA = { x: 30, y: 96, w: 700, h: 404 };
    function geom() {
      var cx = DIA.x + DIA.w / 2, iy = DIA.y + DIA.h / 2;
      return { cx: cx, iy: iy, L: Math.min(DIA.w, DIA.h) / 2 - 18 };
    }
    function localXY(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    var dragging = false;
    S.canvas.addEventListener("pointerdown", function (ev) {
      var m = localXY(ev), g = geom();
      if (m.y < g.iy && m.y > DIA.y && m.x > DIA.x && m.x < DIA.x + DIA.w) { dragging = true; S.canvas.setPointerCapture(ev.pointerId); setFromMouse(m, g); }
    });
    S.canvas.addEventListener("pointermove", function (ev) { if (!dragging) return; setFromMouse(localXY(ev), geom()); });
    S.canvas.addEventListener("pointerup", function () { dragging = false; });
    function setFromMouse(m, g) {
      var ang = Math.atan2(g.cx - m.x, g.iy - m.y) / RAD;   // from upward normal, left = positive
      P.th1 = Math.max(0, Math.min(89, Math.abs(ang)));
      thC.set(P.th1);
    }

    /* ---------- drawing ---------- */
    var COL = { n1: "#ff6b6b", t1: "#5a9cff", n2: "#46d160", t2: "#ffa64d", inc: "#ffd166", refl: "#7d8cb0" };
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      eqStrip(ctx);
      diagram(ctx);
    });

    function eqStrip(ctx) {
      panel(ctx, { x: 10, y: 8, w: 740, h: 76 }, "");
      var t2 = theta2();
      var y = 36, x = 28;
      ctx.textBaseline = "alphabetic";
      x = seg(ctx, x, y, "n₁", COL.n1, true); x = seg(ctx, x + 4, y, "· sin θ₁", "#cfd8ee");
      x = seg(ctx, x + 10, y, "=", "#9fb0d0");
      x = seg(ctx, x + 10, y, "n₂", COL.n2, true); x = seg(ctx, x + 4, y, "· sin θ₂", "#cfd8ee");
      // substituted
      var y2 = 64; x = 28;
      x = seg(ctx, x, y2, P.n1.toFixed(2), COL.n1); x = seg(ctx, x + 3, y2, "· sin ", "#9fb0d0");
      x = seg(ctx, x, y2, P.th1.toFixed(1) + "°", COL.t1); x = seg(ctx, x + 4, y2, "=  " + (P.n1 * Math.sin(P.th1 * RAD)).toFixed(3), "#cfd8ee");
      x = seg(ctx, x + 18, y2, "→", "#9fb0d0");
      x = seg(ctx, x + 10, y2, P.n2.toFixed(2), COL.n2); x = seg(ctx, x + 3, y2, "· sin ", "#9fb0d0");
      if (t2 == null) seg(ctx, x, y2, I18N.t("sn.tir"), COL.t2, true);
      else { x = seg(ctx, x, y2, t2.toFixed(1) + "°", COL.t2); seg(ctx, x + 4, y2, "=  " + (P.n2 * Math.sin(t2 * RAD)).toFixed(3), "#cfd8ee"); }
    }
    function seg(ctx, x, y, s, col, bold) { ctx.fillStyle = col; ctx.textAlign = "left"; ctx.font = (bold ? "700 " : "") + "16px system-ui"; ctx.fillText(s, x, y); return x + ctx.measureText(s).width; }

    function diagram(ctx) {
      var g = geom();
      // media fills
      ctx.save(); roundRect(ctx, DIA.x, DIA.y, DIA.w, DIA.h, 12); ctx.clip();
      var grd1 = mediaTint(P.n1); var grd2 = mediaTint(P.n2);
      ctx.fillStyle = grd1; ctx.fillRect(DIA.x, DIA.y, DIA.w, g.iy - DIA.y);
      ctx.fillStyle = grd2; ctx.fillRect(DIA.x, g.iy, DIA.w, DIA.y + DIA.h - g.iy);
      // interface
      ctx.strokeStyle = "#cfd8ee"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(DIA.x, g.iy); ctx.lineTo(DIA.x + DIA.w, g.iy); ctx.stroke();
      // normal
      ctx.strokeStyle = "rgba(220,228,245,0.6)"; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(g.cx, DIA.y + 6); ctx.lineTo(g.cx, DIA.y + DIA.h - 6); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();

      var th1 = P.th1 * RAD, t2 = theta2();
      // angle arcs
      arc(ctx, g.cx, g.iy, 40, -Math.PI / 2, -Math.PI / 2 - th1, COL.t1);   // incidence (upper-left)
      if (t2 != null) arc(ctx, g.cx, g.iy, 40, Math.PI / 2, Math.PI / 2 - t2 * RAD, COL.t2); // refraction (lower-right)

      // incident ray (from upper-left to interface) with arrowhead at the surface
      var sx = g.cx - g.L * Math.sin(th1), sy = g.iy - g.L * Math.cos(th1);
      ray(ctx, sx, sy, g.cx, g.iy, COL.inc, 3);
      // reflected ray (upper-right)
      var rx = g.cx + g.L * Math.sin(th1), ry = g.iy - g.L * Math.cos(th1);
      ray(ctx, g.cx, g.iy, rx, ry, COL.refl, 1.6);
      // refracted ray OR total internal reflection note
      if (t2 != null) {
        var fx = g.cx + g.L * Math.sin(t2 * RAD), fy = g.iy + g.L * Math.cos(t2 * RAD);
        ray(ctx, g.cx, g.iy, fx, fy, COL.t2, 3);
      } else {
        ctx.fillStyle = COL.t2; ctx.font = "700 15px system-ui"; ctx.textAlign = "center";
        ctx.fillText(I18N.t("sn.tir").toUpperCase(), g.cx, g.iy + 70);
      }

      // labels
      ctx.font = "12px system-ui"; ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fillText("n₁ = " + P.n1.toFixed(3) + "  (" + nameOf(P.n1) + ")", DIA.x + 12, DIA.y + 22);
      ctx.fillText("n₂ = " + P.n2.toFixed(3) + "  (" + nameOf(P.n2) + ")", DIA.x + 12, DIA.y + DIA.h - 14);
      ctx.fillStyle = COL.t1; ctx.fillText("θ₁ = " + P.th1.toFixed(1) + "°", g.cx - 96, g.iy - 46);
      if (t2 != null) { ctx.fillStyle = COL.t2; ctx.fillText("θ₂ = " + t2.toFixed(1) + "°", g.cx + 48, g.iy + 56); }
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText("drag the incident ray", g.cx - g.L * 0.5 * Math.sin(th1) - 40, g.iy - g.L * 0.5 * Math.cos(th1));
    }
    function mediaTint(n) {           // denser medium → bluer / more saturated
      var t = Math.max(0, Math.min(1, (n - 1) / 1.4));
      return "rgba(" + Math.round(40 - 20 * t) + "," + Math.round(90 + 40 * t) + "," + Math.round(150 + 60 * t) + "," + (0.12 + 0.30 * t) + ")";
    }
    function nameOf(n) { var best = MEDIA[0], bd = 9; MEDIA.forEach(function (m) { var d = Math.abs(m.n - n); if (d < bd) { bd = d; best = m; } }); return (bd < 0.02 ? "" : "≈ ") + best[I18N.getLang()]; }
    function ray(ctx, x1, y1, x2, y2, col, w) {
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      var a = Math.atan2(y2 - y1, x2 - x1), s = 10;
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - s * Math.cos(a - 0.4), y2 - s * Math.sin(a - 0.4));
      ctx.lineTo(x2 - s * Math.cos(a + 0.4), y2 - s * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
    }
    function arc(ctx, x, y, r, a0, a1, col) {
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, Math.min(a0, a1), Math.max(a0, a1)); ctx.stroke();
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
