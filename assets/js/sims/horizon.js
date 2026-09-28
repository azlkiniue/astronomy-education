/* Sun's Position on Horizon ------------------------------------------------------
   Faithful rebuild of ClassAction's "horizon.swf". The original is a landscape
   looking east at sunrise (or west at sunset) with the Sun sitting on the
   horizon, and it slides the Sun along by

       offset = sin(2 * pi * day / 365),   x = range * offset

   with range 350, the sunrise view negating the offset, and the shadows keyed
   to the same number. Its date list starts on 21 March and the clock opens on
   day 184, which is 21 September — an equinox, Sun due east.

   The shadows in the SWF are a 368-frame sprite per object; here they are the
   real thing, cast on the ground away from wherever the Sun is standing.    */
Sim.create({
  id: "horizon",
  width: 780, height: 330,
  strings: {
    en: {
      "hz.view": "View", "hz.rise": "East / sunrise", "hz.set": "West / sunset",
      "hz.day": "Day of year", "hz.speed": "Animation speed", "hz.reset": "Reset",
      "hz.titleRise": "Position of the sun on the horizon at sunrise",
      "hz.titleSet": "Position of the sun on the horizon at sunset",
      "hz.east": "East", "hz.west": "West", "hz.toN": "To\nNorth", "hz.toS": "To\nSouth",
      "hz.rDate": "date", "hz.rAz": "sunrise point", "hz.rAzSet": "sunset point",
      "hz.rSwing": "swing from due east",
      "hz.hint": "Run the year through and watch the rising point swing north in June and south in December. Only at the equinoxes does the Sun rise due east.",
      "m0": "January", "m1": "February", "m2": "March", "m3": "April", "m4": "May",
      "m5": "June", "m6": "July", "m7": "August", "m8": "September", "m9": "October",
      "m10": "November", "m11": "December",
      "hz.N": "north of east", "hz.S": "south of east", "hz.due": "due east",
      "hz.Nw": "north of west", "hz.Sw": "south of west", "hz.duew": "due west"
    },
    id: {
      "hz.view": "Tampilan", "hz.rise": "Timur / matahari terbit",
      "hz.set": "Barat / matahari terbenam",
      "hz.day": "Hari dalam setahun", "hz.speed": "Kecepatan animasi", "hz.reset": "Atur ulang",
      "hz.titleRise": "Kedudukan matahari di cakrawala saat terbit",
      "hz.titleSet": "Kedudukan matahari di cakrawala saat terbenam",
      "hz.east": "Timur", "hz.west": "Barat", "hz.toN": "Ke\nUtara", "hz.toS": "Ke\nSelatan",
      "hz.rDate": "tanggal", "hz.rAz": "titik terbit", "hz.rAzSet": "titik terbenam",
      "hz.rSwing": "simpangan dari timur",
      "hz.hint": "Jalankan setahun penuh dan amati titik terbitnya berayun ke utara pada Juni dan ke selatan pada Desember. Hanya pada ekuinoks Matahari terbit tepat di timur.",
      "m0": "Januari", "m1": "Februari", "m2": "Maret", "m3": "April", "m4": "Mei",
      "m5": "Juni", "m6": "Juli", "m7": "Agustus", "m8": "September", "m9": "Oktober",
      "m10": "November", "m11": "Desember",
      "hz.N": "utara dari timur", "hz.S": "selatan dari timur", "hz.due": "tepat di timur",
      "hz.Nw": "utara dari barat", "hz.Sw": "selatan dari barat", "hz.duew": "tepat di barat"
    }
  },
  about: {
    en: "<p>“The Sun rises in the east” is only true twice a year. On the equinoxes it rises due east and sets due west, and every other day of the year it misses, by an amount that grows to a maximum at the solstices and shrinks back again.</p>" +
        "<p>The reason is the tilt. The Sun's yearly path round the ecliptic carries it about 23.4° north of the celestial equator in June and the same distance south in December, and where a body rises on the horizon depends on that declination. In June it rises well north of east; in December, well south.</p>" +
        "<p>How far the rising point swings depends on where you are standing. At the equator the swing is just the 23.4° of the tilt. The further from the equator, the wider it gets — near the Arctic Circle the Sun in midsummer barely sets at all, and the rising and setting points have run all the way round to meet each other in the north.</p>",
    id: "<p>“Matahari terbit di timur” hanya benar dua kali setahun. Pada ekuinoks ia terbit tepat di timur dan terbenam tepat di barat, dan pada setiap hari lain sepanjang tahun ia meleset, sejauh yang membesar hingga maksimum pada solstis lalu mengecil kembali.</p>" +
        "<p>Penyebabnya adalah kemiringan sumbu. Lintasan tahunan Matahari sepanjang ekliptika membawanya sekitar 23,4° di utara ekuator langit pada Juni dan sejauh itu pula di selatan pada Desember, dan tempat sebuah benda terbit di cakrawala bergantung pada deklinasi itu. Pada Juni ia terbit jauh di utara timur; pada Desember, jauh di selatannya.</p>" +
        "<p>Seberapa jauh titik terbitnya berayun bergantung pada tempat Anda berdiri. Di khatulistiwa ayunannya persis 23,4° sesuai kemiringan sumbu. Makin jauh dari khatulistiwa, makin lebar — di dekat Lingkar Arktik, Matahari pada puncak musim panas nyaris tidak terbenam sama sekali, dan titik terbit serta terbenamnya telah berputar penuh hingga bertemu di utara.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var FONT = "Verdana, Geneva, sans-serif";
    var SCRIPT = "Georgia, 'Times New Roman', serif";
    var W = 780, H = 330;
    var HZ = 232;                                // the horizon line
    var CX = W / 2, RANGE = 0.46 * W;            // the SWF's _range 350 on a 680 stage
    var MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var day = 184, sunset = false, rate = 25;    // _day 184, _speed 0.025 days/ms

    /* dateArray: built month by month, then rotated 80 places so it starts on
       21 March — index 184 is 21 September, which is where the SWF opens */
    function dateOf(d) {
      var i = (Math.floor(d) + 80) % 366, m = 0;
      while (i >= MONTH_DAYS[m]) { i -= MONTH_DAYS[m]; m++; }
      return { month: m, d: i + 1 };
    }
    function offsetAt(d) { return Math.sin(d / 365 * TAU); }
    /* sunrise negates the offset, so the June Sun lands on the north side of
       both views: north is left facing east, right facing west               */
    function sunX() { return CX + RANGE * (sunset ? 1 : -1) * offsetAt(day); }

    /* ------------------------------------------------------------- controls */
    S.group("hz.view");
    var viewCtl = S.select({ labelKey: "hz.view", value: "rise",
      options: [{ v: "rise", labelKey: "hz.rise" }, { v: "set", labelKey: "hz.set" }],
      on: function (v) { sunset = v === "set"; refresh(); } });
    var dayCtl = S.slider({ labelKey: "hz.day", min: 0, max: 365, value: 184, step: 1,
      format: function (v) { var q = dateOf(v); return I18N.t("m" + q.month) + " " + q.d; },
      on: function (v) { day = v; refresh(); } });
    var rateCtl = S.slider({ labelKey: "hz.speed", min: 2, max: 60, value: 25, step: 1,
      format: function (v) { return v + " d/s"; }, on: function (v) { rate = v; } });
    var loop = S.loop(function (dt) {
      day = (day + rate * dt) % 365;
      dayCtl.input.value = Math.floor(day);
      refreshOnly();
    });
    S.playPause(loop);
    S.button({ labelKey: "hz.reset", on: function () {
      loop.pause(); viewCtl.set("rise"); dayCtl.set(184); rateCtl.set(25);
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "hz.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outDate = S.readout({ labelKey: "hz.rDate" });
    var outAz = S.readout({ labelKey: "hz.rAz" });
    var outSwing = S.readout({ labelKey: "hz.rSwing" });

    function refreshOnly() {
      var q = dateOf(day);
      outDate(I18N.t("m" + q.month) + " " + q.d);
      var off = offsetAt(day) * (sunset ? 1 : -1);      // + is to the right
      var swing = Math.abs(offsetAt(day)) * 32;         // the SWF's full excursion
      var north = offsetAt(day) > 0.031, south = offsetAt(day) < -0.031;   // a degree of swing
      outAz(I18N.t(north ? (sunset ? "hz.Nw" : "hz.N")
        : south ? (sunset ? "hz.Sw" : "hz.S") : (sunset ? "hz.duew" : "hz.due")));
      outSwing(swing.toFixed(1) + "°");
    }
    function refresh() { refreshOnly(); S.requestDraw(); }

    /* ---------------------------------------------------- the scene, in code */
    /* each silhouette is {x, base scale, kind}; the SWF's own cast is a house,
       four trees and two bushes, with a car parked by the house              */
    var PROPS = [
      { x: 0.11, s: 1.00, kind: "tree" }, { x: 0.17, s: 0.78, kind: "tree" },
      { x: 0.235, s: 1.25, kind: "house" }, { x: 0.315, s: 0.55, kind: "bush" },
      { x: 0.345, s: 0.62, kind: "car" },
      { x: 0.79, s: 0.92, kind: "tree" }, { x: 0.845, s: 1.12, kind: "tree" },
      { x: 0.90, s: 0.60, kind: "bush" }
    ];

    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      var sx = sunX();

      /* sky: the SWF's lavender-to-ember gradient, brightest at the Sun */
      var sky = ctx.createLinearGradient(0, 0, 0, HZ);
      sky.addColorStop(0, "#d9b7d6");
      sky.addColorStop(0.34, "#eabfc0");
      sky.addColorStop(0.62, "#f3c9a0");
      sky.addColorStop(0.86, "#f6c06a");
      sky.addColorStop(1, "#f2a74e");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HZ);

      var halo = ctx.createRadialGradient(sx, HZ, 4, sx, HZ, 210);
      halo.addColorStop(0, "rgba(255,247,214,0.95)");
      halo.addColorStop(0.18, "rgba(255,232,160,0.55)");
      halo.addColorStop(1, "rgba(255,210,120,0)");
      ctx.fillStyle = halo; ctx.fillRect(0, 0, W, HZ);

      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, HZ); ctx.clip();
      ctx.beginPath(); ctx.arc(sx, HZ, 26, 0, TAU);
      ctx.fillStyle = "#fffdf0"; ctx.fill();
      ctx.restore();

      /* the header the SWF paints over the sky */
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#ffffff"; ctx.font = "italic 19px " + SCRIPT;
      ctx.fillText(tr(sunset ? "hz.titleSet" : "hz.titleRise"), CX, 32);

      ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 2;
      arrow(ctx, CX - 60, 62, 100, -1);
      arrow(ctx, CX + 60, 62, 100, 1);
      ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.font = "italic 26px " + SCRIPT;
      ctx.fillText(tr(sunset ? "hz.west" : "hz.east"), CX, 70);
      ctx.font = "italic 13px " + SCRIPT;
      /* facing east north is on the left; facing west it swaps sides */
      twoLine(ctx, tr(sunset ? "hz.toS" : "hz.toN"), 58, 56);
      twoLine(ctx, tr(sunset ? "hz.toN" : "hz.toS"), W - 58, 56);

      var q = dateOf(day);
      ctx.fillStyle = "#ffffff"; ctx.font = "italic 14px " + SCRIPT;
      ctx.fillText(tr("m" + q.month), CX, 104);
      ctx.fillText(String(q.d), CX, 120);

      /* ground */
      var gnd = ctx.createLinearGradient(0, HZ, 0, H);
      gnd.addColorStop(0, "#5c4a52");
      gnd.addColorStop(1, "#2b2229");
      ctx.fillStyle = gnd; ctx.fillRect(0, HZ, W, H - HZ);

      /* the Sun is on the horizon, so every shadow is long and points away
         from it; the further off-centre the Sun, the more they skew          */
      var off = (sx - CX) / RANGE;
      PROPS.forEach(function (p) {
        var px = p.x * W;
        castShadow(ctx, px, HZ + 6, p, off);
      });
      PROPS.forEach(function (p) { silhouette(ctx, p.x * W, HZ + 6, p); });
    });

    function arrow(ctx, x, y, len, dir) {
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + dir * len, y);
      ctx.moveTo(x + dir * len, y);
      ctx.lineTo(x + dir * (len - 10), y - 5);
      ctx.moveTo(x + dir * len, y);
      ctx.lineTo(x + dir * (len - 10), y + 5);
      ctx.stroke();
    }
    function twoLine(ctx, text, x, y) {
      var parts = text.split("\n");
      for (var i = 0; i < parts.length; i++) ctx.fillText(parts[i], x, y + i * 15);
    }

    function castShadow(ctx, x, y, p, off) {
      /* the Sun sits on the horizon, so the shadow runs the whole ground and
         skews with however far off due east the Sun has got                  */
      var hgt = shapeHeight(p), w = shapeWidth(p) / 2;
      var reach = 1.05 * hgt + 30;
      var dx = -off * 2.2, dy = 1;
      var n = Math.hypot(dx, dy);
      dx = dx / n * reach; dy = dy / n * reach * 0.62;
      ctx.save();
      ctx.globalAlpha = 0.38;
      ctx.fillStyle = "#140f13";
      ctx.beginPath();
      ctx.moveTo(x - w, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w * 0.35 + dx, y + dy);
      ctx.lineTo(x - w * 0.35 + dx, y + dy);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    function shapeHeight(p) {
      return (p.kind === "house" ? 54 : p.kind === "tree" ? 76 : p.kind === "car" ? 16 : 14) * p.s;
    }
    function shapeWidth(p) {
      return (p.kind === "house" ? 74 : p.kind === "tree" ? 34 : p.kind === "car" ? 40 : 26) * p.s;
    }

    function silhouette(ctx, x, y, p) {
      var s = p.s;
      ctx.fillStyle = "#211a20";
      ctx.beginPath();
      if (p.kind === "tree") {
        ctx.moveTo(x - 3 * s, y);
        ctx.lineTo(x - 3 * s, y - 26 * s);
        ctx.lineTo(x + 3 * s, y - 26 * s);
        ctx.lineTo(x + 3 * s, y);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, y - 78 * s);
        ctx.lineTo(x + 17 * s, y - 20 * s);
        ctx.lineTo(x - 17 * s, y - 20 * s);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, y - 62 * s);
        ctx.lineTo(x + 21 * s, y - 6 * s);
        ctx.lineTo(x - 21 * s, y - 6 * s);
        ctx.closePath(); ctx.fill();
      } else if (p.kind === "house") {
        ctx.moveTo(x - 30 * s, y);
        ctx.lineTo(x - 30 * s, y - 30 * s);
        ctx.lineTo(x, y - 52 * s);
        ctx.lineTo(x + 30 * s, y - 30 * s);
        ctx.lineTo(x + 30 * s, y);
        ctx.closePath(); ctx.fill();
        ctx.fillRect(x + 9 * s, y - 50 * s, 7 * s, 14 * s);      // chimney
      } else if (p.kind === "car") {
        ctx.moveTo(x - 20 * s, y);
        ctx.lineTo(x - 20 * s, y - 7 * s);
        ctx.lineTo(x - 11 * s, y - 7 * s);
        ctx.lineTo(x - 6 * s, y - 15 * s);
        ctx.lineTo(x + 7 * s, y - 15 * s);
        ctx.lineTo(x + 12 * s, y - 7 * s);
        ctx.lineTo(x + 20 * s, y - 7 * s);
        ctx.lineTo(x + 20 * s, y);
        ctx.closePath(); ctx.fill();
      } else {
        ctx.ellipse(x, y - 5 * s, 13 * s, 10 * s, 0, 0, TAU);
        ctx.fill();
      }
    }

    refresh();
  }
});
