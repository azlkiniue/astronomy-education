/* Planetary Orbit Simulator — Kepler's Laws -------------------------------- */
Sim.create({
  id: "kepler",
  width: 760, height: 470,
  strings: {
    en: {
      "kp.orbit": "Orbit", "kp.a": "Semi-major axis", "kp.e": "Eccentricity",
      "kp.anim": "Animation", "kp.show": "Show",
      "kp.sweeps": "Equal-area sweeps (2nd law)", "kp.labels": "Foci & apsides",
      "kp.period": "Orbital period", "kp.dist": "Sun distance", "kp.speed": "Relative speed", "kp.ecc": "Eccentricity"
    },
    id: {
      "kp.orbit": "Orbit", "kp.a": "Sumbu semi-mayor", "kp.e": "Eksentrisitas",
      "kp.anim": "Animasi", "kp.show": "Tampilkan",
      "kp.sweeps": "Sapuan luas sama (hukum ke-2)", "kp.labels": "Fokus & apsis",
      "kp.period": "Periode orbit", "kp.dist": "Jarak Matahari", "kp.speed": "Kecepatan relatif", "kp.ecc": "Eksentrisitas"
    }
  },
  about: {
    en: "<h3>1st law — ellipses</h3><p>Planets orbit on ellipses with the Sun at one <strong>focus</strong> (the empty dot marks the other). " +
        "Raise the eccentricity and the orbit stretches; at e = 0 it is a perfect circle.</p>" +
        "<h3>2nd law — equal areas</h3><p>The line from Sun to planet sweeps out equal areas in equal times. " +
        "Turn on the sweeps: each shaded wedge takes the same time, yet they are fat-and-fast near the Sun (perihelion) and thin-and-slow far away (aphelion).</p>" +
        "<h3>3rd law — harmony</h3><p>Period² = (semi-major axis)³. Doubling the axis makes the year about 2.8× longer.</p>",
    id: "<h3>Hukum ke-1 — elips</h3><p>Planet mengorbit pada elips dengan Matahari di salah satu <strong>fokus</strong> (titik kosong menandai fokus lain). " +
        "Naikkan eksentrisitas dan orbit memanjang; pada e = 0 ia lingkaran sempurna.</p>" +
        "<h3>Hukum ke-2 — luas sama</h3><p>Garis dari Matahari ke planet menyapu luas yang sama dalam waktu yang sama. " +
        "Nyalakan sapuan: tiap juring memakan waktu sama, namun gemuk-dan-cepat dekat Matahari (perihelion) dan tipis-dan-lambat saat jauh (aphelion).</p>" +
        "<h3>Hukum ke-3 — harmoni</h3><p>Periode² = (sumbu semi-mayor)³. Menggandakan sumbu membuat tahun ~2,8× lebih panjang.</p>"
  },
  build: function (S) {
    var a = 1.2, e = 0.5, M = 0;             // AU, eccentricity, mean anomaly
    var loop = S.loop(function (dt) {
      var P = Math.pow(a, 1.5);
      M = (M + dt * 0.7 / P) % (2 * Math.PI);
      upd();
    });

    S.group("kp.orbit");
    S.slider({ labelKey: "kp.a", min: 0.5, max: 2.5, value: a, step: 0.05, unit: " AU", on: function (v) { a = v; upd(); } });
    S.slider({ labelKey: "kp.e", min: 0, max: 0.8, value: e, step: 0.01, on: function (v) { e = v; upd(); } });
    S.group("kp.anim");
    S.playPause(loop);
    S.group("kp.show");
    var showSweeps = S.toggle({ labelKey: "kp.sweeps", value: true });
    var showLabels = S.toggle({ labelKey: "kp.labels", value: true });

    var outP = S.readout({ labelKey: "kp.period" });
    var outR = S.readout({ labelKey: "kp.dist" });
    var outV = S.readout({ labelKey: "kp.speed" });
    var outE = S.readout({ labelKey: "kp.ecc" });

    function solveE(Mn) { var E = Mn; for (var i = 0; i < 6; i++) E = E - (E - e * Math.sin(E) - Mn) / (1 - e * Math.cos(E)); return E; }

    function upd() {
      var P = Math.pow(a, 1.5);
      var E = solveE(M);
      var r = a * (1 - e * Math.cos(E));
      var vrel = Math.sqrt(2 / r - 1 / a) / Math.sqrt(1 / a);  // v/v_circ-ish, vis-viva (∝)
      outP(P.toFixed(2) + " yr");
      outR(r.toFixed(3) + " AU");
      outV("×" + vrel.toFixed(2));
      outE(e.toFixed(2));
      S.requestDraw();
    }

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var b = a * Math.sqrt(1 - e * e);
      var scale = Math.min((W - 160) / (2 * a + 0.6), (H - 80) / (2 * b + 0.6));
      var Cx = W / 2 + a * e * scale, Cy = H / 2;   // put Sun (focus) so orbit is centered
      function pos(E) { return [Cx + scale * (a * Math.cos(E) - a * e), Cy - scale * (b * Math.sin(E))]; }

      // equal-area sweeps
      if (showSweeps.value()) {
        var N = 12;
        for (var k = 0; k < N; k++) {
          var E1 = solveE(2 * Math.PI * k / N), E2 = solveE(2 * Math.PI * (k + 1) / N);
          var p1 = pos(E1);
          ctx.beginPath(); ctx.moveTo(Cx, Cy);
          for (var tt = 0; tt <= 1; tt += 0.2) {
            var Ee = solveE(2 * Math.PI * (k + tt) / N), pp = pos(Ee); ctx.lineTo(pp[0], pp[1]);
          }
          ctx.closePath();
          ctx.fillStyle = k % 2 ? "rgba(110,168,254,0.14)" : "rgba(182,146,255,0.16)";
          ctx.fill();
        }
      }

      // orbit ellipse
      ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 2; ctx.beginPath();
      for (var th = 0; th <= 2 * Math.PI + 0.01; th += 0.05) { var p = pos(th); th === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); }
      ctx.stroke();

      // foci + apsides
      if (showLabels.value()) {
        var f2x = Cx - 2 * a * e * scale;
        ctx.fillStyle = "#9fabce"; ctx.beginPath(); ctx.arc(f2x, Cy, 4, 0, 2 * Math.PI); ctx.stroke();
        ctx.setLineDash([4, 4]); ctx.strokeStyle = "#2c3a66"; ctx.beginPath();
        var ph = pos(0), ap = pos(Math.PI); ctx.moveTo(ph[0], ph[1]); ctx.lineTo(ap[0], ap[1]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
        ctx.fillText("perihelion", ph[0], ph[1] - 10); ctx.fillText("aphelion", ap[0], ap[1] - 10);
      }

      // Sun at focus
      var g = ctx.createRadialGradient(Cx, Cy, 1, Cx, Cy, 16);
      g.addColorStop(0, "#fff"); g.addColorStop(0.5, "#ffd166"); g.addColorStop(1, "rgba(255,209,102,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(Cx, Cy, 16, 0, 2 * Math.PI); ctx.fill();

      // planet
      var E = solveE(M), pl = pos(E);
      ctx.strokeStyle = "rgba(110,168,254,0.6)"; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(Cx, Cy); ctx.lineTo(pl[0], pl[1]); ctx.stroke();
      ctx.fillStyle = "#6ea8fe"; ctx.beginPath(); ctx.arc(pl[0], pl[1], 7, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "#cfe0ff"; ctx.stroke();
    });

    upd();
  }
});
