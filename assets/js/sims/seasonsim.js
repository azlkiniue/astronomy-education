/* The Sun's Declination Through the Year -----------------------------------------
   Faithful rebuild of the ClassAction "seasonsim.swf" (seasonSimulator, decompiled).
   The Sun's path around the sky plotted as declination against right ascension: one
   smooth swing from 23.5° south to 23.5° north and back, taking a year.

   Day 1 of the SWF's calendar is the March equinox and its curve is
   dec ∝ sin(day · 360/365), drawn here at one continuous rate — the original
   changes rate at day 186, which leaves a step on the midline. Looking at the sky
   from inside, right ascension runs 24ʰ to 0ʰ; the outside view mirrors it.    */
Sim.create({
  id: "seasonsim",
  width: 640, height: 400,
  strings: {
    en: {
      "ss.date": "Date", "ss.month": "month", "ss.day": "day", "ss.animate": "Animate", "ss.stop": "Stop",
      "ss.view": "View", "ss.inside": "from inside the sphere", "ss.outside": "from outside the sphere",
      "ss.dec": "Declination", "ss.ra": "Right Ascension",
      "ss.rDec": "declination", "ss.rRa": "right ascension", "ss.rSeason": "in the north",
      "ss.spring": "spring", "ss.summer": "summer", "ss.autumn": "autumn", "ss.winter": "winter",
      "ss.hint": "Step through the year with the date controls, or press Animate to run it.",
      "m1": "January", "m2": "February", "m3": "March", "m4": "April", "m5": "May", "m6": "June",
      "m7": "July", "m8": "August", "m9": "September", "m10": "October", "m11": "November", "m12": "December"
    },
    id: {
      "ss.date": "Tanggal", "ss.month": "bulan", "ss.day": "hari", "ss.animate": "Animasikan", "ss.stop": "Berhenti",
      "ss.view": "Tampilan", "ss.inside": "dari dalam bola langit", "ss.outside": "dari luar bola langit",
      "ss.dec": "Deklinasi", "ss.ra": "Asensiorekta",
      "ss.rDec": "deklinasi", "ss.rRa": "asensiorekta", "ss.rSeason": "di belahan utara",
      "ss.spring": "semi", "ss.summer": "panas", "ss.autumn": "gugur", "ss.winter": "dingin",
      "ss.hint": "Telusuri tahun dengan kontrol tanggal, atau tekan Animasikan untuk menjalankannya.",
      "m1": "Januari", "m2": "Februari", "m3": "Maret", "m4": "April", "m5": "Mei", "m6": "Juni",
      "m7": "Juli", "m8": "Agustus", "m9": "September", "m10": "Oktober", "m11": "November", "m12": "Desember"
    }
  },
  about: {
    en: "<p>The Earth's axis is tilted 23.5° from the perpendicular to its orbit, and it keeps pointing the same way all year. So as we go round the Sun, the Sun appears to drift north and south against the stars — its <strong>declination</strong> swinging between +23.5° in June and −23.5° in December.</p>" +
        "<p>That swing is the whole of the seasons. When the Sun sits far north it rises north of east, climbs high at noon and stays up longer, and sunlight strikes the northern ground closer to head-on: summer. Six months later the same geometry runs the other way. The equinoxes are the two crossings of 0°, when day and night are nearly equal everywhere.</p>" +
        "<p>Right ascension, the horizontal axis, is the Sun's east–west position among the stars. It advances by roughly four minutes of time a day, which is exactly why the stars rise four minutes earlier each night and why the constellations you see at midnight change through the year.</p>",
    id: "<p>Sumbu Bumi miring 23,5° dari garis tegak lurus orbitnya, dan arahnya tetap sepanjang tahun. Maka saat kita mengelilingi Matahari, Matahari tampak bergeser ke utara dan selatan terhadap bintang — <strong>deklinasinya</strong> berayun antara +23,5° pada Juni dan −23,5° pada Desember.</p>" +
        "<p>Ayunan itulah seluruh isi pergantian musim. Ketika Matahari jauh di utara, ia terbit di utara titik timur, naik tinggi pada tengah hari, dan lebih lama di atas ufuk, sedangkan sinarnya menimpa tanah belahan utara lebih tegak: musim panas. Enam bulan kemudian geometri yang sama berjalan terbalik. Ekuinoks adalah dua perlintasan 0°, saat siang dan malam hampir sama panjang di mana-mana.</p>" +
        "<p>Asensiorekta, sumbu mendatarnya, adalah kedudukan timur–barat Matahari di antara bintang. Nilainya maju sekitar empat menit waktu per hari — persis sebabnya bintang terbit empat menit lebih awal setiap malam dan rasi yang terlihat pada tengah malam berubah sepanjang tahun.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var FONT = "Verdana, Geneva, sans-serif";
    var O = { x: 120, y: 188 }, SX = 1.3397, AMP = 66.5;          // measured off the SWF
    var DAYS = 365;
    var MONTH_START = [286, 317, 345, 11, 41, 72, 102, 133, 164, 194, 225, 255];   // findDayFrom
    var MONTH_LEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var month = 1, date = 1, outside = false, day = 287;
    var animating = false;

    function findDay(m, d) { var v = (MONTH_START[m - 1] + d) % DAYS; return v === 0 ? DAYS : v; }
    function findMonthDate(dy) {                                  // the SWF's own inverse
      dy = Math.round(dy);
      for (var i = 0; i < 12; i++) {
        var s = MONTH_START[i], e = s + MONTH_LEN[i];
        if (dy > s && dy <= e) return { m: i + 1, d: dy - s };
        if (s + MONTH_LEN[i] > DAYS && (dy > s || dy <= (s + MONTH_LEN[i]) % DAYS))
          return { m: i + 1, d: dy > s ? dy - s : dy + DAYS - s };
      }
      return { m: 3, d: 21 };
    }
    // findYFor. The SWF changes rate at day 186 (0.98630 → 0.96774 °/day), which leaves a
    // visible step where the curve crosses 0° and stops it closing at the left edge; one
    // continuous rate keeps the same curve and removes both artefacts.
    function decOf(dy) { return 23.5 * Math.sin(dy * 0.9863013698630136 * RAD); }
    function xOf(dy) { return O.x + (outside ? dy : DAYS - dy) * SX; }
    function yOf(dec) { return O.y - AMP * dec / 23.5; }
    function raOf(dy) { return (dy * 24 / DAYS) % 24; }

    S.group("ss.date");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ss.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var monthCtl = S.select({
      labelKey: "ss.month", value: "1",
      options: MONTH_LEN.map(function (_, i) { return { v: String(i + 1), labelKey: "m" + (i + 1) }; }),
      on: function (v) { month = parseInt(v, 10); date = Math.min(date, MONTH_LEN[month - 1]); rebuildDates(); setDay(findDay(month, date)); }
    });
    var dayCtl = S.select({
      labelKey: "ss.day", value: "1",
      options: [], on: function (v) { date = parseInt(v, 10); setDay(findDay(month, date)); }
    });
    function rebuildDates() {
      var sel = dayCtl.el || null;
      var node = S.canvas.parentNode.parentNode.querySelectorAll(".sim-controls select")[1];
      node.innerHTML = "";
      for (var i = 1; i <= MONTH_LEN[month - 1]; i++) {
        var o = document.createElement("option");
        o.value = String(i); o.textContent = String(i);
        node.appendChild(o);
      }
      node.value = String(date);
    }
    var playBtn = S.button({
      labelKey: "ss.animate",
      on: function () { animating = !animating; if (animating) loop.play(); else loop.pause(); syncBtn(); }
    });
    function syncBtn() {
      playBtn.removeAttribute("data-i18n");
      playBtn.textContent = I18N.t(animating ? "ss.stop" : "ss.animate");
    }
    S.group("ss.view");
    S.select({
      labelKey: "ss.view", value: "inside",
      options: [{ v: "inside", labelKey: "ss.inside" }, { v: "outside", labelKey: "ss.outside" }],
      on: function (v) { outside = v === "outside"; S.requestDraw(); }
    });
    var outDec = S.readout({ labelKey: "ss.rDec" });
    var outRa = S.readout({ labelKey: "ss.rRa" });
    var outSeason = S.readout({ labelKey: "ss.rSeason" });

    var loop = S.loop(function (dt) {                             // 0.0002 × 58.1 days per ms
      setDay(day + 58.1 * 0.0002 * dt * 1000);
    });

    function setDay(d) {
      day = ((d - 1) % DAYS + DAYS) % DAYS + 1;
      var md = findMonthDate(day);
      month = md.m; date = md.d;
      upd();
    }
    function upd() {
      var dec = decOf(day), ra = raOf(day);
      outDec((dec >= 0 ? "+" : "−") + Math.abs(dec).toFixed(1) + "°");
      var h = Math.floor(ra), m = Math.round((ra - h) * 60);
      if (m === 60) { m = 0; h = (h + 1) % 24; }
      outRa(h + "ʰ " + (m < 10 ? "0" : "") + m + "ᵐ");
      outSeason(I18N.t(day < 92 ? "ss.spring" : day < 185 ? "ss.summer" : day < 277 ? "ss.autumn" : "ss.winter"));
      S.requestDraw();
    }
    S.refreshers.push(function () { syncBtn(); upd(); });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      var g = ctx.createRadialGradient(150, 70, 10, 250, 200, 560);
      g.addColorStop(0, "#fdfbe8"); g.addColorStop(0.18, "#bcd6f4");
      g.addColorStop(0.55, "#4f86d6"); g.addColorStop(1, "#1030a8");
      ctx.fillStyle = g; ctx.fillRect(0, 0, S.W, S.H);

      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.beginPath();                                            // the axes, ±23.5° tall
      ctx.moveTo(O.x - 0.5, O.y - AMP); ctx.lineTo(O.x - 0.5, O.y + AMP);
      ctx.moveTo(O.x, O.y - 0.5); ctx.lineTo(O.x + DAYS * SX, O.y - 0.5);
      ctx.stroke();
      ctx.setLineDash([6, 5]);
      [23.5, -23.5].forEach(function (d) {
        ctx.beginPath(); ctx.moveTo(O.x, yOf(d)); ctx.lineTo(O.x + DAYS * SX, yOf(d)); ctx.stroke();
      });
      ctx.setLineDash([]);

      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1.5;           // the Sun's yearly path
      ctx.beginPath();
      for (var d = 0; d <= DAYS; d += 1) {
        var x = xOf(d), y = yOf(decOf(d));
        if (d === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = "#000000"; ctx.font = "20px " + FONT;       // declination scale
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText("23.5°", O.x - 5, yOf(23.5));
      ctx.fillText("-23.5°", O.x - 5, yOf(-23.5));
      ctx.fillText("0°", O.x - 5, O.y + 10);                      // clear of the axis itself
      ctx.textAlign = "center";
      for (var h = 0; h <= 24; h += 6) {                          // 24ʰ … 0ʰ, mirrored when outside
        var dd = h * DAYS / 24, x = xOf(dd);
        var end = Math.abs(x - O.x) < 1 ? 17 : (Math.abs(x - (O.x + DAYS * SX)) < 1 ? -8 : 0);
        ctx.font = "20px " + FONT;                                // keep the end labels off the axes
        var w = ctx.measureText(String(h)).width;
        ctx.fillText(String(h), x + end, O.y + 143);
        ctx.font = "12px " + FONT;                                // the hour superscript, tucked in
        ctx.fillText("h", x + end + w / 2 + 5, O.y + 135);
      }
      ctx.font = "19px " + FONT;
      ctx.fillText(t("ss.ra"), O.x + DAYS * SX / 2, O.y + 194);
      ctx.save();
      ctx.font = "18px " + FONT;
      ctx.translate(26.5, O.y + 6); ctx.rotate(-Math.PI / 2);
      ctx.fillText(t("ss.dec"), 0, 0);
      ctx.restore();

      var sx = xOf(day), sy = yOf(decOf(day));                    // the Sun
      var sg = ctx.createRadialGradient(sx, sy, 2, sx, sy, 19);
      sg.addColorStop(0, "rgba(255,244,150,1)");
      sg.addColorStop(0.45, "rgba(255,214,70,0.65)");
      sg.addColorStop(1, "rgba(255,200,40,0)");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 19, 0, TAU); ctx.fill();
      ctx.fillStyle = "#ffdc46"; ctx.beginPath(); ctx.arc(sx, sy, 8, 0, TAU); ctx.fill();

      ctx.fillStyle = "#ffff66"; ctx.font = "20px " + FONT;
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText(t("m" + month) + " " + date, 620, outside ? 145 : 240);
    });

    rebuildDates();
    setDay(findDay(month, date));
  }
});
