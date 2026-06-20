/* Small-Angle Approximation Demonstrator ---------------------------------- */
Sim.create({
  id: "small-angle",
  width: 760, height: 420,
  strings: {
    en: {
      "sa.geom": "Geometry", "sa.size": "True size", "sa.dist": "Distance",
      "sa.preset": "Example",
      "sa.ang": "Angular size", "sa.approx": "Small-angle θ ≈ D/d",
      "sa.exact": "Exact 2·arctan(D/2d)", "sa.err": "Approx. error"
    },
    id: {
      "sa.geom": "Geometri", "sa.size": "Ukuran asli", "sa.dist": "Jarak",
      "sa.preset": "Contoh",
      "sa.ang": "Ukuran sudut", "sa.approx": "Sudut kecil θ ≈ D/d",
      "sa.exact": "Eksak 2·arctan(D/2d)", "sa.err": "Galat aproksimasi"
    }
  },
  about: {
    en: "<p>How big something <em>looks</em> depends on both its real size <strong>D</strong> and its distance <strong>d</strong>. " +
        "The angle it spans in the sky — its <strong>angular size</strong> θ — follows θ = 2·arctan(D / 2d).</p>" +
        "<p>When an object is far away (d ≫ D) this simplifies to the handy <strong>small-angle approximation</strong> " +
        "θ ≈ D / d radians = 206 265 · D/d arcseconds. Astronomers use it constantly, because almost everything in the sky is tiny in angle.</p>" +
        "<p>Real examples: the Moon (3 474 km at 384 400 km) and the Sun (1.39 million km at 150 million km) both span about <strong>0.5°</strong> — which is why total solar eclipses are possible.</p>",
    id: "<p>Seberapa besar sesuatu <em>terlihat</em> bergantung pada ukuran aslinya <strong>D</strong> dan jaraknya <strong>d</strong>. " +
        "Sudut yang dibentangnya di langit — <strong>ukuran sudut</strong> θ — mengikuti θ = 2·arctan(D / 2d).</p>" +
        "<p>Ketika objek jauh (d ≫ D), ini menyederhana menjadi <strong>aproksimasi sudut kecil</strong> " +
        "θ ≈ D / d radian = 206 265 · D/d detik busur. Astronom memakainya terus-menerus, karena hampir semua benda langit kecil secara sudut.</p>" +
        "<p>Contoh nyata: Bulan (3.474 km pada 384.400 km) dan Matahari (1,39 juta km pada 150 juta km) sama-sama membentang sekitar <strong>0,5°</strong> — itulah sebabnya gerhana matahari total bisa terjadi.</p>"
  },
  build: function (S) {
    var D = 20, d = 300;

    S.group("sa.geom");
    var sizeCtl = S.slider({ labelKey: "sa.size", min: 1, max: 120, value: D, step: 1, unit: " u", on: function (v) { D = v; upd(); } });
    var distCtl = S.slider({ labelKey: "sa.dist", min: 40, max: 1200, value: d, step: 10, unit: " u", on: function (v) { d = v; upd(); } });
    S.select({
      labelKey: "sa.preset", value: "",
      options: [
        { v: "20|300", label: "— custom —" },
        { v: "35|384", label: "Moon (3474 km @ 384 400 km)" },
        { v: "60|645", label: "Sun (≈0.53°)" },
        { v: "10|600", label: "Distant galaxy" },
        { v: "90|120", label: "Nearby foreground" }
      ],
      on: function (v) { var p = v.split("|"); sizeCtl.set(+p[0]); distCtl.set(+p[1]); }
    });

    var outAng = S.readout({ labelKey: "sa.ang" });
    var outApprox = S.readout({ labelKey: "sa.approx" });
    var outExact = S.readout({ labelKey: "sa.exact" });
    var outErr = S.readout({ labelKey: "sa.err" });

    function angleExact() { return 2 * Math.atan(D / (2 * d)); }   // radians
    function angleApprox() { return D / d; }

    function upd() {
      var ex = angleExact(), ap = angleApprox();
      outAng(fmtAngle(ex));
      outApprox(fmtAngle(ap));
      outExact(fmtAngle(ex));
      outErr(((ap - ex) / ex * 100).toFixed(3) + " %");
      S.requestDraw();
    }

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H, cy = H / 2;
      S.clear();
      var ex = 80, sx = W - 170, L = sx - ex;
      var ang = angleExact();
      var halfH = L * Math.tan(ang / 2);

      // baseline
      ctx.strokeStyle = "#2c3a66"; ctx.setLineDash([5, 5]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ex, cy); ctx.lineTo(sx, cy); ctx.stroke(); ctx.setLineDash([]);

      // sight lines
      ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ex, cy); ctx.lineTo(sx, cy - halfH);
      ctx.moveTo(ex, cy); ctx.lineTo(sx, cy + halfH); ctx.stroke();

      // angle arc
      ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ex, cy, 46, -ang / 2, ang / 2); ctx.stroke();
      ctx.fillStyle = "#ffd166"; ctx.font = "13px system-ui"; ctx.textAlign = "left";
      ctx.fillText("θ = " + (ang * 180 / Math.PI).toFixed(2) + "°", ex + 54, cy + 4);

      // object (disk)
      var grad = ctx.createRadialGradient(sx, cy, 2, sx, cy, halfH + 2);
      grad.addColorStop(0, "#cfe0ff"); grad.addColorStop(1, "#5b78c4");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.ellipse(sx, cy, Math.max(3, halfH * 0.32), Math.max(3, halfH), 0, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#9fabce"; ctx.textAlign = "center";
      ctx.fillText("D = " + D + " u", sx, cy + halfH + 22);

      // eye
      ctx.fillStyle = "#e8ecf8";
      ctx.beginPath(); ctx.ellipse(ex, cy, 13, 8, 0, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#06112b"; ctx.beginPath(); ctx.arc(ex, cy, 4, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#9fabce"; ctx.fillText("d = " + d + " u", (ex + sx) / 2, cy + 26);
    });

    upd();

    function fmtAngle(rad) {
      var deg = rad * 180 / Math.PI;
      if (deg >= 1) return deg.toFixed(2) + "°";
      var arcmin = deg * 60;
      if (arcmin >= 1) return arcmin.toFixed(2) + "′";
      return (arcmin * 60).toFixed(1) + "″";
    }
  }
});
