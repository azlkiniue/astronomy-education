/* Stellar Velocity Calculator -------------------------------------------------
   Faithful rebuild of the ClassAction "Stellar Velocity Calculator"
   (stellarvel.swf). A star's true motion through space combines two pieces we
   can measure:

     • tangential velocity  v_T = 4.74 · μ · d         (μ in arcsec/yr, d in pc)
     • radial velocity      v_R = c · (λ − λ_Hα)/λ_Hα  (Doppler shift of Hα)
     • space velocity       v_S = √(v_T² + v_R²)

   Sliders set the observed Hα wavelength (Doppler → v_R), the proper motion μ,
   and the distance d. A distance line shows Earth, the star, and the velocity
   vectors. Defaults (μ=10, d=10, λ=656.5) → v_T=474, v_R=91.4, v_S=482.7 km/s.  */
Sim.create({
  id: "stellarvel",
  width: 760, height: 430,
  strings: {
    en: {
      "sv.lam": "observed  λ", "sv.mu": "proper motion  μ", "sv.d": "distance  d",
      "sv.rT": "tangential  vₜ", "sv.rR": "radial  vᵣ", "sv.rS": "space  vₛ", "sv.rdir": "Doppler"
    },
    id: {
      "sv.lam": "λ teramati", "sv.mu": "gerak diri  μ", "sv.d": "jarak  d",
      "sv.rT": "tangensial  vₜ", "sv.rR": "radial  vᵣ", "sv.rS": "ruang  vₛ", "sv.rdir": "Doppler"
    }
  },
  about: {
    en: "<p>A star's real motion through space is its <strong>space velocity</strong>. We never measure it directly — we measure two perpendicular pieces:</p>" +
        "<p>• The <strong>radial velocity</strong> vᵣ (toward or away) from the Doppler shift of a spectral line such as hydrogen's Hα (rest wavelength 656.3 nm): vᵣ = c·(λ − λ₀)/λ₀.</p>" +
        "<p>• The <strong>tangential velocity</strong> vₜ (across the sky) from the proper motion μ (how fast the star drifts, in arcsec per year) and the distance d: vₜ = 4.74·μ·d.</p>" +
        "<p>Because the two are at right angles, the space velocity is vₛ = √(vₜ² + vᵣ²). Move the sliders and watch all three update.</p>",
    id: "<p>Gerak sejati bintang menembus ruang adalah <strong>kecepatan ruang</strong>. Kita tak pernah mengukurnya langsung — kita ukur dua komponen tegak lurus:</p>" +
        "<p>• <strong>Kecepatan radial</strong> vᵣ (mendekat/menjauh) dari pergeseran Doppler garis spektrum seperti Hα hidrogen (panjang gelombang diam 656,3 nm): vᵣ = c·(λ − λ₀)/λ₀.</p>" +
        "<p>• <strong>Kecepatan tangensial</strong> vₜ (melintang langit) dari gerak diri μ (arcsec per tahun) dan jarak d: vₜ = 4,74·μ·d.</p>" +
        "<p>Karena keduanya saling tegak lurus, kecepatan ruang vₛ = √(vₜ² + vᵣ²). Geser slider dan amati ketiganya.</p>"
  },
  build: function (S) {
    var C_KMS = 3.0e5, LAM0 = 656.3, K_TAN = 4.74;   // c rounded to 3×10⁵ km/s, as the original prints
    var COL = { T: "#6ee7a8", R: "#ff6b6b", Sp: "#9fd0ff", mu: "#6ee7a8", d: "#ffd23f", lam: "#ffa64d", txt: "#e8ecf5", dim: "#9fb0d0" };
    var P = { lam: 656.50, mu: 10.0, d: 10.0 };

    function vR() { return C_KMS * (P.lam - LAM0) / LAM0; }
    function vT() { return K_TAN * P.mu * P.d; }
    function vS() { return Math.hypot(vT(), vR()); }

    /* ---------- controls ---------- */
    var lamC = S.slider({ labelKey: "sv.lam", min: 655.0, max: 657.0, step: 0.01, value: P.lam,
      format: function (v) { return v.toFixed(2) + " nm"; }, on: function (v) { P.lam = v; upd(); } });
    var muC = S.slider({ labelKey: "sv.mu", min: 0, max: 10, step: 0.1, value: P.mu,
      format: function (v) { return v.toFixed(2) + '"/yr'; }, on: function (v) { P.mu = v; upd(); } });
    var dC = S.slider({ labelKey: "sv.d", min: 1, max: 10, step: 0.1, value: P.d,
      format: function (v) { return v.toFixed(2) + " pc"; }, on: function (v) { P.d = v; upd(); } });

    var oT = S.readout({ labelKey: "sv.rT" });
    var oR = S.readout({ labelKey: "sv.rR" });
    var oS = S.readout({ labelKey: "sv.rS" });
    var oDir = S.readout({ labelKey: "sv.rdir" });

    function upd() {
      oT(vT().toFixed(2) + " km/s");
      oR(vR().toFixed(2) + " km/s");
      oS(vS().toFixed(2) + " km/s");
      var r = vR();
      oDir(Math.abs(r) < 0.5 ? "transverse" : r > 0 ? "redshift — receding" : "blueshift — approaching");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---------- text helpers ---------- */
    function txt(ctx, x, y, s, color, sz, bold) {
      ctx.fillStyle = color || COL.txt; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = (bold ? "700 " : "") + (sz || 18) + "px system-ui"; ctx.fillText(s, x, y);
      return x + ctx.measureText(s).width;
    }
    function vsym(ctx, x, y, sub, color, sz) {        // v with a subscript
      x = txt(ctx, x, y, "v", color, sz, true);
      ctx.font = "700 " + Math.round(sz * 0.62) + "px system-ui"; ctx.fillStyle = color;
      ctx.fillText(sub, x + 1, y + sz * 0.22);
      return x + ctx.measureText(sub).width + 3;
    }
    function frac(ctx, x, y, num, den, color, sz) {   // a stacked fraction, vertically centred on y
      ctx.font = sz + "px system-ui";
      var wn = ctx.measureText(num).width, wd = ctx.measureText(den).width, w = Math.max(wn, wd);
      ctx.fillStyle = color; ctx.textAlign = "center";
      ctx.fillText(num, x + w / 2, y - sz * 0.32);
      ctx.fillText(den, x + w / 2, y + sz * 0.92);
      ctx.strokeStyle = color; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x + w, y + 2); ctx.stroke();
      ctx.textAlign = "left";
      return x + w;
    }

    /* ---------- drawing ---------- */
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 8, y: 8, w: 744, h: 414 });
      equations(ctx);
      distanceLine(ctx);
    });

    function equations(ctx) {
      var x, y;
      // v_T = 4.74 μ d = 474
      y = 58; x = 48;
      x = vsym(ctx, x, y, "T", COL.T, 26);
      x = txt(ctx, x + 6, y, "= 4.74", COL.txt, 24);
      x = txt(ctx, x + 8, y, "μ", COL.mu, 24, true);
      x = txt(ctx, x + 6, y, "d", COL.d, 24, true);
      x = txt(ctx, x + 10, y, "=", COL.txt, 24);
      txt(ctx, x + 10, y, vT().toFixed(2), COL.T, 24, true);

      // v_R = c (λ − λ_Hα)/λ_Hα = 91.42
      y = 116; x = 48;
      x = vsym(ctx, x, y, "R", COL.R, 26);
      x = txt(ctx, x + 6, y, "= c", COL.txt, 24);
      x = frac(ctx, x + 10, y, "λ − " + LAM0, "" + LAM0, COL.txt, 16) + 8;
      ctx.fillStyle = COL.lam; ctx.font = "12px system-ui"; ctx.textAlign = "left";
      ctx.fillText("λ = " + P.lam.toFixed(2) + " nm", 92, y + 34);
      x = txt(ctx, x, y, "=", COL.txt, 24);
      txt(ctx, x + 10, y, vR().toFixed(2), COL.R, 24, true);

      // v_S = √(v_T² + v_R²) = 482.74
      y = 188; x = 48;
      x = vsym(ctx, x, y, "S", COL.Sp, 26);
      x = txt(ctx, x + 6, y, "=", COL.txt, 24) + 8;
      // radical
      ctx.strokeStyle = COL.txt; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x + 6, y + 6); ctx.lineTo(x + 12, y - 22); ctx.lineTo(x + 150, y - 22); ctx.stroke();
      x += 18;
      x = vsym(ctx, x, y, "T", COL.T, 22); txt(ctx, x - 2, y - 12, "2", COL.T, 13); x += 6;
      x = txt(ctx, x, y, "+", COL.txt, 22) + 4;
      x = vsym(ctx, x, y, "R", COL.R, 22); txt(ctx, x - 2, y - 12, "2", COL.R, 13); x += 8;
      x = txt(ctx, x + 6, y, "=", COL.txt, 24);
      txt(ctx, x + 10, y, vS().toFixed(2), COL.Sp, 24, true);

      // units note
      txt(ctx, 48, 224, "all velocities in km/s   ·   λ(Hα) rest = 656.3 nm   ·   c = 3×10⁵ km/s", COL.dim, 12);
    }

    // distance line with Earth, star, and velocity vectors
    var LINE = { x0: 96, x1: 560, y: 320 };
    function starX() { return LINE.x0 + (P.d - 1) / 9 * (LINE.x1 - LINE.x0); }
    function distanceLine(ctx) {
      // Earth
      var g = ctx.createRadialGradient(LINE.x0 - 4, LINE.y - 4, 2, LINE.x0, LINE.y, 11);
      g.addColorStop(0, "#9fd0ff"); g.addColorStop(1, "#2a5fa0");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(LINE.x0, LINE.y, 11, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = COL.dim; ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.fillText("Earth", LINE.x0, LINE.y + 30);
      // axis + ticks
      ctx.strokeStyle = "#3a4a72"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LINE.x0 + 13, LINE.y); ctx.lineTo(LINE.x1 + 30, LINE.y); ctx.stroke();
      ctx.font = "12px system-ui";
      for (var pc = 1; pc <= 10; pc++) {
        var tx = LINE.x0 + (pc - 1) / 9 * (LINE.x1 - LINE.x0);
        ctx.strokeStyle = "#3a4a72"; ctx.beginPath(); ctx.moveTo(tx, LINE.y - 6); ctx.lineTo(tx, LINE.y + 6); ctx.stroke();
        if (pc === 5 || pc === 10) { ctx.fillStyle = COL.dim; ctx.textAlign = "center"; ctx.fillText(pc + " pc", tx, LINE.y + 24); }
      }
      // star
      var sx = starX(), sy = LINE.y;
      // velocity vectors (scale km/s -> px)
      var scale = 0.14;
      var vt = vT() * scale, vr = vR() * scale;     // vt up (tangential), vr along line (+ = away/right)
      var tipX = sx + vr, tipY = sy - vt;
      // components (dashed)
      ctx.setLineDash([4, 3]); ctx.lineWidth = 1.5;
      ctx.strokeStyle = COL.T; arrow(ctx, sx, sy, sx, tipY, 6);          // tangential (vertical)
      ctx.strokeStyle = COL.R; arrow(ctx, sx, sy, tipX, sy, 6);          // radial (horizontal)
      ctx.setLineDash([]);
      // resultant space velocity
      ctx.strokeStyle = COL.Sp; ctx.lineWidth = 3; arrow(ctx, sx, sy, tipX, tipY, 9);
      // labels (drawn with proper subscripts)
      vsym(ctx, sx - 32, (sy + tipY) / 2 + 4, "T", COL.T, 13);
      vsym(ctx, tipX + 6, sy - 5, "R", COL.R, 13);
      vsym(ctx, tipX + 6, tipY + 2, "S", COL.Sp, 13);
      // star disk last (on top of vector origins)
      var sg = ctx.createRadialGradient(sx, sy, 1, sx, sy, 9);
      sg.addColorStop(0, "#fff"); sg.addColorStop(0.5, "#ffe9a8"); sg.addColorStop(1, "#caa23a");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 7, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = COL.dim; ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.fillText("star", sx, sy + 30);
    }
    function arrow(ctx, x0, y0, x1, y1, head) {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      var a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
      if (L < 3) return;
      ctx.beginPath(); ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - head * Math.cos(a - 0.4), y1 - head * Math.sin(a - 0.4));
      ctx.lineTo(x1 - head * Math.cos(a + 0.4), y1 - head * Math.sin(a + 0.4));
      ctx.closePath(); ctx.fillStyle = ctx.strokeStyle; ctx.fill();
    }

    function panel(ctx, r) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    upd();
  }
});
