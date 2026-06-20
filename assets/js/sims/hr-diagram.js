/* H-R Diagram Explorer ----------------------------------------------------- */
Sim.create({
  id: "hr-diagram",
  width: 760, height: 500,
  strings: {
    en: {
      "hr.star": "Your star", "hr.temp": "Temperature", "hr.rad": "Radius",
      "hr.show": "Show", "hr.named": "Famous stars", "hr.ms": "Main sequence band",
      "hr.lum": "Luminosity", "hr.type": "Spectral type", "hr.radius": "Radius", "hr.class": "Likely class"
    },
    id: {
      "hr.star": "Bintang Anda", "hr.temp": "Suhu", "hr.rad": "Radius",
      "hr.show": "Tampilkan", "hr.named": "Bintang terkenal", "hr.ms": "Pita deret utama",
      "hr.lum": "Luminositas", "hr.type": "Tipe spektral", "hr.radius": "Radius", "hr.class": "Kelas dugaan"
    }
  },
  about: {
    en: "<p>The Hertzsprung–Russell diagram plots stars by <strong>surface temperature</strong> (hot on the left) against " +
        "<strong>luminosity</strong> (total power, up the side, on a logarithmic scale). It is the single most useful chart in stellar astronomy.</p>" +
        "<p>A star's luminosity is fixed by its size and temperature: L = 4πR²σT⁴, so " +
        "L / L<sub>☉</sub> = (R/R<sub>☉</sub>)² (T/T<sub>☉</sub>)⁴. Slide the radius and temperature and watch your star move across the diagram. " +
        "Most stars lie on the diagonal <strong>main sequence</strong>; cool but bright stars (upper right) must be huge <em>giants</em>; " +
        "hot but faint stars (lower left) are tiny <em>white dwarfs</em>.</p>",
    id: "<p>Diagram Hertzsprung–Russell memplot bintang menurut <strong>suhu permukaan</strong> (panas di kiri) terhadap " +
        "<strong>luminositas</strong> (daya total, ke atas, pada skala logaritmik). Ini bagan paling berguna dalam astronomi bintang.</p>" +
        "<p>Luminositas bintang ditentukan oleh ukuran dan suhunya: L = 4πR²σT⁴, sehingga " +
        "L / L<sub>☉</sub> = (R/R<sub>☉</sub>)² (T/T<sub>☉</sub>)⁴. Geser radius dan suhu, amati bintang Anda bergerak. " +
        "Sebagian besar bintang berada di <strong>deret utama</strong> diagonal; bintang dingin tapi terang (kanan atas) pasti <em>raksasa</em>; " +
        "bintang panas tapi redup (kiri bawah) adalah <em>katai putih</em> mungil.</p>"
  },
  build: function (S) {
    var T = 5800, Rr = 1;       // K, solar radii
    var Tmin = 2500, Tmax = 40000, Lmin = 1e-4, Lmax = 1e6;

    S.group("hr.star");
    S.slider({ labelKey: "hr.temp", min: Tmin, max: Tmax, value: T, step: 100, unit: " K", on: function (v) { T = v; upd(); } });
    S.slider({ labelKey: "hr.rad", min: 0.01, max: 100, value: Rr, step: 0.01, unit: " R☉",
      format: function (v) { return v.toFixed(2) + " R☉"; }, on: function (v) { Rr = v; upd(); } });
    S.group("hr.show");
    var showNamed = S.toggle({ labelKey: "hr.named", value: true });
    var showMS = S.toggle({ labelKey: "hr.ms", value: true });

    var outL = S.readout({ labelKey: "hr.lum" });
    var outT = S.readout({ labelKey: "hr.type" });
    var outR = S.readout({ labelKey: "hr.radius" });
    var outC = S.readout({ labelKey: "hr.class" });

    function lum() { return Rr * Rr * Math.pow(T / 5772, 4); }
    function specType(t) { return t >= 30000 ? "O" : t >= 10000 ? "B" : t >= 7500 ? "A" : t >= 6000 ? "F" : t >= 5200 ? "G" : t >= 3700 ? "K" : "M"; }
    function lumClass(t, L) {
      var msL = msLum(t);
      if (L > msL * 25) return I18N.getLang() === "id" ? "Raksasa/Maharaksasa" : "Giant / Supergiant";
      if (L < msL / 25) return I18N.getLang() === "id" ? "Katai putih" : "White dwarf";
      return I18N.getLang() === "id" ? "Deret utama" : "Main sequence";
    }
    function msLum(t) { return Math.pow(t / 5772, 5.0); }   // rough main-sequence L(T)

    function upd() {
      var L = lum();
      outL("×" + (L >= 1 ? L.toPrecision(3) : L.toExponential(1)) + " L☉");
      outT(specType(T));
      outR(Rr.toFixed(2) + " R☉");
      outC(lumClass(T, L));
      S.requestDraw();
    }
    window.addEventListener("langchange", upd);

    var named = [
      { n: "Sun", t: 5772, L: 1 }, { n: "Sirius A", t: 9940, L: 25 }, { n: "Sirius B", t: 25000, L: 0.026 },
      { n: "Betelgeuse", t: 3500, L: 90000 }, { n: "Rigel", t: 12100, L: 120000 },
      { n: "Vega", t: 9600, L: 40 }, { n: "Proxima", t: 3040, L: 0.0017 },
      { n: "Aldebaran", t: 3900, L: 440 }, { n: "Arcturus", t: 4290, L: 170 },
      { n: "Procyon", t: 6530, L: 6.9 }, { n: "Pollux", t: 4865, L: 33 }, { n: "Spica", t: 22400, L: 12000 }
    ];

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var x0 = 60, x1 = W - 24, y0 = H - 50, y1 = 24;
      // temperature reversed (hot left); log scale
      function xOf(t) { return x0 + (Math.log(Tmax) - Math.log(t)) / (Math.log(Tmax) - Math.log(Tmin)) * (x1 - x0); }
      function yOf(L) { return y0 - (Math.log(L) - Math.log(Lmin)) / (Math.log(Lmax) - Math.log(Lmin)) * (y0 - y1); }

      // grid + axes
      ctx.strokeStyle = "#1b2747"; ctx.fillStyle = "#9fabce"; ctx.font = "10px system-ui"; ctx.textAlign = "center";
      [40000, 20000, 10000, 7000, 5000, 3500, 2500].forEach(function (t) {
        var gx = xOf(t); ctx.beginPath(); ctx.moveTo(gx, y1); ctx.lineTo(gx, y0); ctx.stroke();
        ctx.fillText((t / 1000) + "k", gx, y0 + 14);
      });
      ctx.textAlign = "right";
      for (var p = -4; p <= 6; p += 2) { var gy = yOf(Math.pow(10, p)); ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, gy); ctx.stroke(); ctx.fillText("10^" + p, x0 - 5, gy + 3); }
      ctx.strokeStyle = "#2c3a66"; ctx.strokeRect(x0, y1, x1 - x0, y0 - y1);
      ctx.textAlign = "center"; ctx.fillStyle = "#9fabce";
      ctx.fillText("Temperature (K) →  hotter to the left", (x0 + x1) / 2, H - 8);

      // constant-radius diagonals
      ctx.setLineDash([3, 4]); ctx.strokeStyle = "#243a5e";
      [0.01, 0.1, 1, 10, 100].forEach(function (R) {
        ctx.beginPath();
        for (var t = Tmin; t <= Tmax; t *= 1.05) {
          var L = R * R * Math.pow(t / 5772, 4), X = xOf(t), Y = yOf(L);
          t === Tmin ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
        }
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // main sequence band
      if (showMS.value()) {
        ctx.strokeStyle = "rgba(110,168,254,0.5)"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath();
        for (var t2 = 3000; t2 <= 38000; t2 *= 1.06) { var L2 = msLum(t2), X2 = xOf(t2), Y2 = yOf(L2); t2 === 3000 ? ctx.moveTo(X2, Y2) : ctx.lineTo(X2, Y2); }
        ctx.stroke(); ctx.lineWidth = 1; ctx.lineCap = "butt";
      }

      // named stars
      if (showNamed.value()) {
        named.forEach(function (s) {
          var X = xOf(s.t), Y = yOf(s.L), c = tempToRGBhr(s.t);
          ctx.fillStyle = "rgb(" + c.join(",") + ")"; ctx.beginPath(); ctx.arc(X, Y, 4, 0, 2 * Math.PI); ctx.fill();
          ctx.fillStyle = "#9fabce"; ctx.font = "10px system-ui"; ctx.textAlign = "left"; ctx.fillText(s.n, X + 6, Y + 3);
        });
      }

      // user's star
      var L = lum(), X = xOf(Math.max(Tmin, Math.min(Tmax, T))), Y = yOf(Math.max(Lmin, Math.min(Lmax, L)));
      var col = tempToRGBhr(T);
      ctx.fillStyle = "rgb(" + col.join(",") + ")"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(X, Y, 8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    });

    upd();

    function tempToRGBhr(t) {
      var x = t / 100, r, g, b;
      r = x <= 66 ? 255 : cl(329.7 * Math.pow(x - 60, -0.1332));
      g = x <= 66 ? cl(99.47 * Math.log(x) - 161.12) : cl(288.12 * Math.pow(x - 60, -0.0755));
      b = x >= 66 ? 255 : x <= 19 ? 0 : cl(138.52 * Math.log(x - 10) - 305.04);
      return [Math.round(r), Math.round(g), Math.round(b)];
      function cl(v) { return Math.max(0, Math.min(255, v)); }
    }
  }
});
