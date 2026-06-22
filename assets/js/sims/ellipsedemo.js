/* Eccentricity Demonstrator ----------------------------------------------------
   Faithful rebuild of the ClassAction "Eccentricity Demonstrator"
   (ellipsedemo.swf). Mirrors the original:
     • a single ellipse with its two foci (× marks) and centre,
     • two measured-from-the-centre arrows — c (centre → focus) and a (centre →
       vertex, the semimajor axis),
     • the headline ratio  e = c / a = 60 / 80 = 0.750,
     • c and a sliders (the original's defaults c = 60, a = 80).                   */
Sim.create({
  id: "ellipsedemo",
  width: 760, height: 470,
  strings: {
    en: {
      "el.controls": "Controls", "el.c": "c  (centre → focus)", "el.a": "a  (semimajor axis)",
      "el.show": "Show", "el.gard": "show string construction (r₁ + r₂ = 2a)",
      "el.ecc": "eccentricity", "el.b": "semiminor axis", "el.peri": "perihelion / aphelion"
    },
    id: {
      "el.controls": "Kontrol", "el.c": "c  (pusat → fokus)", "el.a": "a  (sumbu semimayor)",
      "el.show": "Tampilkan", "el.gard": "tampilkan konstruksi tali (r₁ + r₂ = 2a)",
      "el.ecc": "eksentrisitas", "el.b": "sumbu semiminor", "el.peri": "perihelion / aphelion"
    }
  },
  about: {
    en: "<p>An <strong>ellipse</strong> has two <em>foci</em>. Two lengths measured from its centre fix its shape: <strong>a</strong>, the semimajor axis (centre to the far vertex), and <strong>c</strong>, the centre-to-focus distance. Their ratio is the <strong>eccentricity</strong>: e = c / a.</p>" +
        "<p>When the foci sit on top of each other, c = 0 and e = 0 — a perfect <strong>circle</strong>. Slide the foci outward and e climbs toward 1, stretching the ellipse into a long cigar. The semiminor axis shrinks as b = √(a² − c²).</p>" +
        "<p>Turn on the string construction to see why an ellipse is the set of points whose distances to the two foci sum to a constant (2a). Planetary orbits are ellipses with the Sun at one focus — Earth's is nearly circular (e ≈ 0.017); many comets ride very eccentric ones.</p>",
    id: "<p><strong>Elips</strong> punya dua <em>fokus</em>. Dua panjang yang diukur dari pusatnya menentukan bentuknya: <strong>a</strong>, sumbu semimayor (pusat ke ujung jauh), dan <strong>c</strong>, jarak pusat-ke-fokus. Rasionya adalah <strong>eksentrisitas</strong>: e = c / a.</p>" +
        "<p>Saat kedua fokus berimpit, c = 0 dan e = 0 — <strong>lingkaran</strong> sempurna. Geser fokus keluar, e mendekati 1, dan elips memipih memanjang. Sumbu semiminor menyusut sebagai b = √(a² − c²).</p>" +
        "<p>Aktifkan konstruksi tali untuk melihat mengapa elips adalah himpunan titik yang jumlah jaraknya ke dua fokus tetap (2a). Orbit planet adalah elips dengan Matahari di salah satu fokus — orbit Bumi hampir lingkaran (e ≈ 0,017); banyak komet menempuh orbit yang sangat eksentrik.</p>"
  },
  build: function (S) {
    var C = { text: "#e8ecf8", dim: "#9fabce", line: "#cdd7f5", focus: "#9fabce",
              c: "#ff6b6b", a: "#6ea8fe", accent: "#4cd4a0" };
    var c = 60, a = 80, theta = -0.7;        // c = centre→focus, a = semimajor; original defaults 60 / 80

    function b() { return Math.sqrt(Math.max(0, a * a - c * c)); }
    function ecc() { return a > 0 ? c / a : 0; }

    S.group("el.controls");
    var aCtl = S.slider({ labelKey: "el.a", min: 40, max: 110, step: 1, value: a,
      format: function (v) { return v.toFixed(0); }, on: function (v) { a = v; if (c > a) { c = a; cCtl.set(a); } upd(); } });
    var cCtl = S.slider({ labelKey: "el.c", min: 0, max: 110, step: 1, value: c,
      format: function (v) { return v.toFixed(0); }, on: function (v) { c = Math.min(v, a); if (v > a) cCtl.set(a); upd(); } });

    S.group("el.show");
    var optGard = S.toggle({ labelKey: "el.gard", value: false });

    var oEcc = S.readout({ labelKey: "el.ecc" });
    var oB = S.readout({ labelKey: "el.b" });
    var oPeri = S.readout({ labelKey: "el.peri" });

    function upd() {
      oEcc(ecc().toFixed(3));
      oB(b().toFixed(1));
      oPeri((a - c).toFixed(0) + " / " + (a + c).toFixed(0));
      S.requestDraw();
    }

    /* ---- geometry: "units" → px, centred ---- */
    var AREA = { x: 18, y: 96, w: 724, h: 356 };
    var ACx = AREA.x + AREA.w / 2, ACy = AREA.y + AREA.h / 2;
    var PXU = 2.6;
    function pt(ux, uy) { return { x: ACx + ux * PXU, y: ACy - uy * PXU }; }

    /* drag the construction point (only used when the string view is on) */
    var dragging = false;
    function localXY(ev) { var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      if (!optGard.value()) return;
      var m = localXY(ev), p = pt(a * Math.cos(theta), b() * Math.sin(theta));
      if (Math.hypot(m.x - p.x, m.y - p.y) < 26) { dragging = true; S.canvas.setPointerCapture(ev.pointerId); }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!dragging) return; var m = localXY(ev);
      theta = Math.atan2(-(m.y - ACy) / Math.max(b(), 1e-3), (m.x - ACx) / Math.max(a, 1e-3)); S.requestDraw();
    });
    S.canvas.addEventListener("pointerup", function () { dragging = false; });

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W; S.clear();
      drawFraction(ctx, W, 50);

      var ctr = pt(0, 0), fR = pt(c, 0), fL = pt(-c, 0), vR = pt(a, 0);

      // axes guides
      ctx.strokeStyle = "#1c2a4f"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(pt(-a, 0).x, ACy); ctx.lineTo(pt(a, 0).x, ACy);
      ctx.moveTo(ACx, pt(0, -b()).y); ctx.lineTo(ACx, pt(0, b()).y); ctx.stroke(); ctx.setLineDash([]);

      // the ellipse
      ctx.strokeStyle = C.line; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(ACx, ACy, a * PXU, b() * PXU, 0, 0, 2 * Math.PI); ctx.stroke();

      // optional string construction (gardener's r1 + r2 = 2a)
      if (optGard.value()) {
        var P = pt(a * Math.cos(theta), b() * Math.sin(theta));
        ctx.lineWidth = 1.6; ctx.strokeStyle = "rgba(110,168,254,0.7)";
        ctx.beginPath(); ctx.moveTo(fL.x, fL.y); ctx.lineTo(P.x, P.y); ctx.lineTo(fR.x, fR.y); ctx.stroke();
        var r1 = Math.hypot(a * Math.cos(theta) + c, b() * Math.sin(theta));
        var r2 = Math.hypot(a * Math.cos(theta) - c, b() * Math.sin(theta));
        ctx.fillStyle = C.accent; ctx.font = "11px var(--mono, monospace)"; ctx.textAlign = "center";
        ctx.fillText("r₁ + r₂ = " + (r1 + r2).toFixed(0) + " = 2a", ACx, AREA.y + AREA.h - 6);
        dot(ctx, P.x, P.y, C.accent, 6);
        ctx.strokeStyle = "#0b1020"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(P.x, P.y, 6, 0, 2 * Math.PI); ctx.stroke();
      }

      // c arrow (centre → right focus), drawn a little above the axis
      arrow(ctx, ctr.x, ACy - 16, fR.x, ACy - 16, C.c);
      ctx.fillStyle = C.c; ctx.font = "italic 15px Georgia, serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillText("c", (ctr.x + fR.x) / 2, ACy - 20);

      // a arrow (centre → right vertex), a little below the axis
      arrow(ctx, ctr.x, ACy + 16, vR.x, ACy + 16, C.a);
      ctx.fillStyle = C.a; ctx.textBaseline = "top";
      ctx.fillText("a", (ctr.x + vR.x) / 2, ACy + 20);
      ctx.textBaseline = "alphabetic";

      // foci (×) and centre
      cross(ctx, fR.x, fR.y, C.focus); cross(ctx, fL.x, fL.y, C.focus);
      dot(ctx, ctr.x, ctr.y, C.dim, 2.5);
    });

    upd();

    /* the headline:  e = c/a = 60/80 = 0.750 */
    function drawFraction(ctx, W, midY) {
      ctx.textBaseline = "middle"; ctx.textAlign = "left";
      var parts = [];
      parts.push({ t: "e", f: "20px Georgia, serif", col: C.text });
      parts.push({ t: "  =  ", f: "20px Georgia, serif", col: C.text });
      parts.push({ frac: ["c", "a"], col: [C.c, C.a] });
      parts.push({ t: "  =  ", f: "20px Georgia, serif", col: C.text });
      parts.push({ frac: [c.toFixed(0), a.toFixed(0)], col: [C.c, C.a] });
      parts.push({ t: "  =  " + ecc().toFixed(3), f: "20px Georgia, serif", col: C.accent });
      // measure
      var total = 0;
      parts.forEach(function (p) {
        if (p.frac) { ctx.font = "16px Georgia, serif"; p.w = Math.max(ctx.measureText(p.frac[0]).width, ctx.measureText(p.frac[1]).width) + 14; }
        else { ctx.font = p.f; p.w = ctx.measureText(p.t).width; }
        total += p.w;
      });
      var x = (W - total) / 2;
      parts.forEach(function (p) {
        if (p.frac) {
          var fcx = x + p.w / 2;
          ctx.font = "16px Georgia, serif"; ctx.textAlign = "center";
          ctx.fillStyle = p.col[0]; ctx.fillText(p.frac[0], fcx, midY - 12);
          ctx.fillStyle = p.col[1]; ctx.fillText(p.frac[1], fcx, midY + 12);
          ctx.strokeStyle = C.text; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(x + 3, midY); ctx.lineTo(x + p.w - 3, midY); ctx.stroke();
          ctx.textAlign = "left";
        } else { ctx.font = p.f; ctx.fillStyle = p.col; ctx.fillText(p.t, x, midY); }
        x += p.w;
      });
      ctx.textBaseline = "alphabetic";
    }

    function arrow(ctx, x0, y0, x1, y1, col) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      var ang = Math.atan2(y1 - y0, x1 - x0);
      [[x1, y1, ang], [x0, y0, ang + Math.PI]].forEach(function (h) {
        ctx.beginPath(); ctx.moveTo(h[0], h[1]);
        ctx.lineTo(h[0] - 7 * Math.cos(h[2] - 0.4), h[1] - 7 * Math.sin(h[2] - 0.4));
        ctx.lineTo(h[0] - 7 * Math.cos(h[2] + 0.4), h[1] - 7 * Math.sin(h[2] + 0.4)); ctx.closePath(); ctx.fill();
      });
    }
    function cross(ctx, x, y, col) {
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - 5, y - 5); ctx.lineTo(x + 5, y + 5);
      ctx.moveTo(x + 5, y - 5); ctx.lineTo(x - 5, y + 5); ctx.stroke();
    }
    function dot(ctx, x, y, col, r) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); }
  }
});
