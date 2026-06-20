/* Exoplanet Transit Simulator ---------------------------------------------- */
Sim.create({
  id: "exoplanet-transit",
  width: 760, height: 480,
  strings: {
    en: {
      "et.sys": "System", "et.rp": "Planet size (Rₚ/R★)", "et.b": "Impact parameter b",
      "et.anim": "Animation", "et.depth": "Transit depth", "et.dur": "Transit width", "et.note": "Status",
      "et.transiting": "Transiting", "et.no": "No transit (misses the disk)"
    },
    id: {
      "et.sys": "Sistem", "et.rp": "Ukuran planet (Rₚ/R★)", "et.b": "Parameter tumbukan b",
      "et.anim": "Animasi", "et.depth": "Kedalaman transit", "et.dur": "Lebar transit", "et.note": "Status",
      "et.transiting": "Transit", "et.no": "Tak transit (meleset dari cakram)"
    }
  },
  about: {
    en: "<p>When a planet crosses in front of its star, it blocks a sliver of light and the star dims slightly. " +
        "Plotting that brightness over time gives a <strong>transit light curve</strong> — the method behind most known exoplanets.</p>" +
        "<p>The depth of the dip reveals the planet's size: a deeper dip means a bigger planet, with " +
        "depth ≈ (R<sub>planet</sub> / R<sub>star</sub>)². The <strong>impact parameter</strong> b says how centrally the planet crosses; " +
        "raise it past 1 and the planet misses the disk entirely and there is no transit.</p>",
    id: "<p>Ketika sebuah planet melintas di depan bintangnya, ia menghalangi sebagian kecil cahaya dan bintang sedikit meredup. " +
        "Memplot kecerahan itu terhadap waktu menghasilkan <strong>kurva cahaya transit</strong> — metode di balik sebagian besar eksoplanet yang dikenal.</p>" +
        "<p>Kedalaman lekuk mengungkap ukuran planet: lekuk lebih dalam berarti planet lebih besar, dengan " +
        "kedalaman ≈ (R<sub>planet</sub> / R<sub>bintang</sub>)². <strong>Parameter tumbukan</strong> b menyatakan seberapa pusat planet melintas; " +
        "naikkan melewati 1 dan planet meleset sepenuhnya sehingga tak ada transit.</p>"
  },
  build: function (S) {
    var k = 0.1;     // Rp/Rs
    var b = 0.3;     // impact parameter (0 central, >1+k no transit)
    var phase = 0;   // -1..1 across the chart
    var loop = S.loop(function (dt) { phase += dt * 0.35; if (phase > 1.15) phase = -1.15; S.requestDraw(); });

    S.group("et.sys");
    S.slider({ labelKey: "et.rp", min: 0.03, max: 0.25, value: k, step: 0.005, format: function (v) { return v.toFixed(3); }, on: function (v) { k = v; upd(); } });
    S.slider({ labelKey: "et.b", min: 0, max: 1.3, value: b, step: 0.02, format: function (v) { return v.toFixed(2); }, on: function (v) { b = v; upd(); } });
    S.group("et.anim");
    S.playPause(loop);

    var outD = S.readout({ labelKey: "et.depth" });
    var outN = S.readout({ labelKey: "et.note" });

    // overlap area of two circles, radii R (star=1) and r (planet=k), centers d apart
    function overlap(d, R, r) {
      if (d >= R + r) return 0;
      if (d <= Math.abs(R - r)) return Math.PI * Math.min(R, r) * Math.min(R, r);
      var a1 = Math.acos((d * d + R * R - r * r) / (2 * d * R));
      var a2 = Math.acos((d * d + r * r - R * R) / (2 * d * r));
      return R * R * (a1 - Math.sin(2 * a1) / 2) + r * r * (a2 - Math.sin(2 * a2) / 2);
    }
    function fluxAt(px) {                 // px = planet center x in units of R★ (along chord), b is y-offset
      var d = Math.sqrt(px * px + b * b);
      return 1 - overlap(d, 1, k) / Math.PI;
    }
    function upd() {
      var depth = b <= 1 + k ? (1 - fluxAt(0)) : 0;
      outD((depth * 100).toFixed(2) + " %");
      outN(b < 1 + k ? I18N.t("et.transiting") : I18N.t("et.no"));
      S.requestDraw();
    }
    window.addEventListener("langchange", upd);

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var cx = W / 2, cy = 140, Rs = 90;       // star on canvas
      var span = 2.4;                          // planet x range in R★ units mapped to chart width

      // star with limb darkening
      var g = ctx.createRadialGradient(cx, cy, 4, cx, cy, Rs);
      g.addColorStop(0, "#fff6d8"); g.addColorStop(0.7, "#ffd166"); g.addColorStop(1, "#e08a2a");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, Rs, 0, 2 * Math.PI); ctx.fill();

      // planet position
      var px = phase;                          // in R★ units
      var planetX = cx + px * Rs, planetY = cy + b * Rs;
      ctx.fillStyle = "#0a0e1c"; ctx.beginPath(); ctx.arc(planetX, planetY, k * Rs, 0, 2 * Math.PI); ctx.fill();
      // path line
      ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cx - span * Rs, cy + b * Rs); ctx.lineTo(cx + span * Rs, cy + b * Rs); ctx.stroke(); ctx.setLineDash([]);

      // ---- light curve ----
      var lx0 = 70, lx1 = W - 24, ly0 = H - 40, ly1 = 300;
      var depth = Math.max(0.0008, k * k * 1.1);
      // map flux in [1-depth-pad, 1] -> [ly0, ly1]
      var top = 1.0006, bot = 1 - depth - 0.006;
      var mapF = function (f) { return ly1 + (top - f) / (top - bot) * (ly0 - ly1); };

      ctx.strokeStyle = "#2c3a66"; ctx.beginPath(); ctx.moveTo(lx0, ly1 - 6); ctx.lineTo(lx0, ly0); ctx.lineTo(lx1, ly0); ctx.stroke();
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "left";
      ctx.fillText(I18N.getLang() === "id" ? "kecerahan" : "brightness", lx0 + 4, ly1 - 10);
      ctx.fillText(I18N.getLang() === "id" ? "1.00" : "1.00", lx1 - 26, mapF(1) - 4);

      // curve
      ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 2; ctx.beginPath();
      for (var i = 0; i <= 240; i++) {
        var xu = -span + (i / 240) * (2 * span);             // R★ units
        var f = fluxAt(xu);
        var X = lx0 + (i / 240) * (lx1 - lx0), Y = mapF(f);
        i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
      }
      ctx.stroke();
      // current marker
      var cf = fluxAt(phase), mX = lx0 + (phase + span) / (2 * span) * (lx1 - lx0);
      ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.arc(mX, mapF(cf), 5, 0, 2 * Math.PI); ctx.fill();
    });

    upd();
  }
});
