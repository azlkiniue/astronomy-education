/* Earth Orbit Plot ---------------------------------------------------------------
   Faithful rebuild of ClassAction's "earthorbitplot.swf", whose whole model is the
   EarthOrbitPlot class: GM = 6.673e-11 x 5.97e24, orbital radii from the Earth's
   surface at 6.378e6 m out to 4.5e8 m, and the one curve that matters,

       P = 2 pi sqrt(R^3 / GM),      v = sqrt(GM / R)

   plotted 600 x 400 with a 5 per cent margin, log radius across and linear period
   up. Its own tick marks are at 6378, 10000, 20000, 40000, 100000, 200000 and
   400000 km and at 7, 14, 21, 28 and 35 days, and its five marked orbits are
   Newton's cannon (6378 km), the ISS (6730), GPS (26600), geosynchronous (42164)
   and the Moon (384000).

   One departure, noted rather than hidden: the SWF carries log-axis checkboxes but
   sets both `visible = false`, so the published build is locked to log x / linear
   y. They are wired up here, because seeing the curve straighten on log-log axes
   is the point of Kepler's third law.                                         */
Sim.create({
  id: "earthorbitplot",
  width: 740, height: 500,
  strings: {
    en: {
      "eo.axes": "Axes", "eo.logx": "logarithmic radius axis",
      "eo.logy": "logarithmic period axis", "eo.marks": "show the marked orbits",
      "eo.reset": "Reset", "eo.probe": "Probe radius",
      "eo.orbits": "Orbits", "eo.preset": "Preset orbit", "eo.custom": "custom radius",
      "eo.xlab": "Orbital radius (km from the Earth's centre)",
      "eo.ylab": "Orbital period (days)", "eo.ylabh": "Orbital period (hours)",
      "eo.rR": "radius", "eo.rP": "period", "eo.rV": "orbital speed", "eo.rAlt": "altitude",
      "eo.cannon": "Newton's cannon", "eo.iss": "ISS", "eo.gps": "GPS",
      "eo.geo": "Geosynchronous", "eo.moon": "Moon",
      "eo.hint": "Move the probe along the curve, or hover over it. Everything in orbit sits on this one line — the Moon and a cannonball fired from a mountain top obey the same rule, three hundred and eighty thousand kilometres apart.",
      "eo.min": "minutes", "eo.hr": "hours", "eo.day": "days", "eo.kms": "km/s", "eo.km": "km"
    },
    id: {
      "eo.axes": "Sumbu", "eo.logx": "sumbu jari-jari logaritmik",
      "eo.logy": "sumbu periode logaritmik", "eo.marks": "tampilkan orbit bertanda",
      "eo.reset": "Atur ulang", "eo.probe": "Jari-jari penyelidik",
      "eo.orbits": "Orbit", "eo.preset": "Pilihan orbit", "eo.custom": "jari-jari bebas",
      "eo.xlab": "Jari-jari orbit (km dari pusat Bumi)",
      "eo.ylab": "Periode orbit (hari)", "eo.ylabh": "Periode orbit (jam)",
      "eo.rR": "jari-jari", "eo.rP": "periode", "eo.rV": "laju orbit", "eo.rAlt": "ketinggian",
      "eo.cannon": "Meriam Newton", "eo.iss": "ISS", "eo.gps": "GPS",
      "eo.geo": "Geosinkron", "eo.moon": "Bulan",
      "eo.hint": "Geser penyelidik sepanjang kurva, atau arahkan kursor padanya. Segala yang mengorbit terletak pada satu garis ini — Bulan dan peluru meriam yang ditembakkan dari puncak gunung menaati aturan yang sama, terpisah tiga ratus delapan puluh ribu kilometer.",
      "eo.min": "menit", "eo.hr": "jam", "eo.day": "hari", "eo.kms": "km/d", "eo.km": "km"
    }
  },
  about: {
    en: "<p>Everything that orbits the Earth is on this one curve. Give the radius and the period follows, with no freedom left over: P = 2π√(R³/GM). Mass does not appear, so a satellite, a spent rocket stage and the Moon at the same height would all take the same time to go round.</p>" +
        "<p>Both formulas on the plot come from one balance. In a circular orbit, the Earth's gravity is exactly the pull needed to keep the satellite turning in its circle: GMm / R² = mv² / R. The satellite's own mass m appears on both sides and cancels, which leaves the <b>orbital speed</b>, v = √(GM / R). One lap is a circle of length 2πR covered at that speed, so the <b>period</b> is P = 2πR / v = 2π√(R³ / GM). Here G is the gravitational constant (6.673 × 10<sup>−11</sup> N m² kg<sup>−2</sup>), M is the Earth's mass (5.97 × 10<sup>24</sup> kg), and R is measured from the Earth's centre, not from the ground — add the Earth's 6378 km radius to a height before using it.</p>" +
        "<p>The two pull in opposite directions. Farther out, gravity is weaker and the speed falls, as 1/√R, but the circle grows faster than that, in proportion to R, so the period rises as R<sup>3/2</sup>. Square it and P² ∝ R³: Kepler's third law. Skimming the ground, a satellite would need 7.9 km/s and would go round in about 85 minutes; the geosynchronous ring moves at 3.1 km/s; the Moon ambles along at about 1 km/s and takes 27.4 days.</p>" +
        "<p>The consequences are practical. The ISS, skimming a few hundred kilometres up, laps the planet every ninety minutes. Push out to 42 164 km and the period stretches to exactly one sidereal day, so the satellite hangs over the same spot on the equator — which is why every television satellite is on that one ring. The Moon, at 384 000 km, takes a month.</p>" +
        "<p>Newton's thought experiment is at the bottom of the curve. Fire a cannonball hard enough from a mountain top and it falls all the way round instead of landing: an orbit is just a projectile that keeps missing the ground. That imaginary shot and the Moon sit on the same line, which was the whole point he was making.</p>",
    id: "<p>Segala sesuatu yang mengorbit Bumi terletak pada satu kurva ini. Berikan jari-jarinya dan periodenya menyusul, tanpa kebebasan tersisa: P = 2π√(R³/GM). Massa tidak muncul, sehingga sebuah satelit, tingkat roket bekas, dan Bulan pada ketinggian yang sama akan menempuh waktu edar yang sama.</p>" +
        "<p>Kedua rumus pada grafik berasal dari satu keseimbangan. Pada orbit lingkaran, gravitasi Bumi tepat sebesar tarikan yang dibutuhkan agar satelit terus berbelok pada lingkarannya: GMm / R² = mv² / R. Massa satelit m muncul di kedua ruas dan saling meniadakan, sehingga tersisa <b>laju orbit</b>, v = √(GM / R). Satu putaran adalah lingkaran sepanjang 2πR yang ditempuh dengan laju itu, sehingga <b>periodenya</b> P = 2πR / v = 2π√(R³ / GM). Di sini G adalah tetapan gravitasi (6,673 × 10<sup>−11</sup> N m² kg<sup>−2</sup>), M massa Bumi (5,97 × 10<sup>24</sup> kg), dan R diukur dari pusat Bumi, bukan dari permukaan tanah — tambahkan jari-jari Bumi 6378 km pada ketinggian sebelum memakainya.</p>" +
        "<p>Keduanya saling berlawanan arah. Makin jauh, gravitasi makin lemah dan lajunya turun, sebanding 1/√R, tetapi lingkarannya membesar lebih cepat, sebanding R, sehingga periodenya naik sebanding R<sup>3/2</sup>. Kuadratkan dan P² ∝ R³: hukum ketiga Kepler. Menyerempet permukaan, satelit butuh 7,9 km/d dan mengitari Bumi dalam sekitar 85 menit; cincin geosinkron bergerak 3,1 km/d; Bulan melaju santai sekitar 1 km/d dan menempuh 27,4 hari.</p>" +
        "<p>Akibatnya sangat praktis. ISS, yang menyerempet beberapa ratus kilometer di atas kita, mengitari planet setiap sembilan puluh menit. Dorong hingga 42.164 km dan periodenya merentang tepat satu hari sideris, sehingga satelitnya menggantung di atas titik yang sama di khatulistiwa — itulah sebabnya semua satelit televisi berada pada cincin yang satu itu. Bulan, pada 384.000 km, menempuh sebulan.</p>" +
        "<p>Eksperimen pikiran Newton berada di dasar kurva. Tembakkan peluru meriam cukup kuat dari puncak gunung dan ia akan terus jatuh mengelilingi Bumi alih-alih mendarat: orbit hanyalah proyektil yang terus-menerus meleset dari tanah. Tembakan khayalan itu dan Bulan berada pada garis yang sama, dan itulah inti yang hendak ia tunjukkan.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

    /* the SWF's own constants */
    var GM = 6.673e-11 * 5.97e24;
    var MIN_R = 6.378e6, MAX_R = 450e6, Y_MARGIN = 0.05;
    var PLOT = { x: 96, y: 40, w: 600, h: 400 };
    var X_TICKS = [6378e3, 10000e3, 20000e3, 40000e3, 100000e3, 200000e3, 400000e3];
    var Y_TICKS = [7, 14, 21, 28, 35];
    var MARKS = [
      { id: "cannon", r: 6378e3, key: "eo.cannon", dy: 16 },
      { id: "iss", r: 6730e3, key: "eo.iss", dy: -4 },
      { id: "gps", r: 26600e3, key: "eo.gps" }, { id: "geo", r: 42164e3, key: "eo.geo" },
      { id: "moon", r: 384000e3, key: "eo.moon" }
    ];

    var logX = true, logY = false, showMarks = true, probeR = 42164e3, hover = null;

    function periodOf(R) { return TAU * Math.sqrt(R * R * R / GM); }
    function speedOf(R) { return Math.sqrt(GM / R); }

    /* the y range is the curve's own, padded by 5 per cent at each end */
    function yBounds() {
      var pMax = periodOf(MAX_R), pMin = periodOf(MIN_R);
      if (logY) {
        var range = (Math.log(pMax) - Math.log(pMin)) / (1 - 2 * Y_MARGIN);
        return { lo: Math.log(pMin) - range * Y_MARGIN, hi: Math.log(pMax) + range * Y_MARGIN };
      }
      var r2 = (pMax - pMin) / (1 - 2 * Y_MARGIN);
      return { lo: Math.max(0, pMin - r2 * Y_MARGIN), hi: pMax + r2 * Y_MARGIN };
    }
    function xOf(R) {
      return PLOT.x + PLOT.w * (logX
        ? (Math.log(R) - Math.log(MIN_R)) / (Math.log(MAX_R) - Math.log(MIN_R))
        : (R - MIN_R) / (MAX_R - MIN_R));
    }
    function rOf(x) {
      var f = (x - PLOT.x) / PLOT.w;
      return logX ? Math.exp(Math.log(MIN_R) + f * (Math.log(MAX_R) - Math.log(MIN_R)))
        : MIN_R + f * (MAX_R - MIN_R);
    }
    function yOf(P) {
      var b = yBounds(), v = logY ? Math.log(P) : P;
      return PLOT.y + PLOT.h * (1 - (v - b.lo) / (b.hi - b.lo));
    }

    /* ------------------------------------------------------------- controls */
    /* a preset puts the probe exactly on its orbit — the slider alone moves in
       steps — and moving the probe any other way makes it a custom radius     */
    var fromPreset = false;
    S.group("eo.orbits");
    var presetCtl = S.select({ labelKey: "eo.preset", value: "geo",
      options: [{ v: "custom", labelKey: "eo.custom" }].concat(MARKS.map(function (m) {
        return { v: m.id, labelKey: m.key };
      })),
      on: function (v) {
        var m = MARKS.filter(function (k) { return k.id === v; })[0];
        if (!m) return;
        probeR = m.r;
        fromPreset = true; probeCtl.set(sliderFromR(m.r)); fromPreset = false;
      } });
    var probeCtl = S.slider({ labelKey: "eo.probe", min: 0, max: 1000, value: 0, step: 1,
      format: function (v) { return fmtKm(v === sliderFromR(probeR) ? probeR : rFromSlider(v)); },
      on: function (v) {
        if (!fromPreset) { probeR = rFromSlider(v); presetCtl.set("custom"); }
        S.requestDraw();
      } });
    var mkCtl = S.toggle({ labelKey: "eo.marks", value: true,
      on: function (v) { showMarks = v; } });
    S.group("eo.axes");
    var lxCtl = S.toggle({ labelKey: "eo.logx", value: true,
      on: function (v) { logX = v; } });
    var lyCtl = S.toggle({ labelKey: "eo.logy", value: false,
      on: function (v) { logY = v; } });
    S.button({ labelKey: "eo.reset", on: function () {
      lxCtl.set(true); lyCtl.set(false); mkCtl.set(true); presetCtl.set("geo");
    } });
    /* the probe slider always walks the radius logarithmically, so the low end
       is usable whichever way the axis is drawn                              */
    function rFromSlider(v) {
      return Math.exp(Math.log(MIN_R) + (v / 1000) * (Math.log(MAX_R) - Math.log(MIN_R)));
    }
    function sliderFromR(R) {
      return Math.round(1000 * (Math.log(R) - Math.log(MIN_R)) /
        (Math.log(MAX_R) - Math.log(MIN_R)));
    }
    presetCtl.set("geo");

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "eo.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outR = S.readout({ labelKey: "eo.rR" });
    var outAlt = S.readout({ labelKey: "eo.rAlt" });
    var outP = S.readout({ labelKey: "eo.rP" });
    var outV = S.readout({ labelKey: "eo.rV" });

    function fmtKm(R) { return Math.round(R / 1000).toLocaleString() + " km"; }
    /* the SWF's own three-way period wording */
    function fmtPeriod(P) {
      if (P <= 10800) return sig(P / 60) + " " + I18N.t("eo.min");
      if (P <= 86400) return sig(P / 3600) + " " + I18N.t("eo.hr");
      return sig(P / 86400) + " " + I18N.t("eo.day");
    }
    function sig(v) { return String(parseFloat(v.toPrecision(3))); }
    function sync() {
      var R = hover === null ? probeR : hover;
      outR(fmtKm(R));
      outAlt(fmtKm(R - MIN_R));
      outP(fmtPeriod(periodOf(R)));
      outV(sig(speedOf(R) / 1000) + " " + I18N.t("eo.kms"));
    }

    /* ---------------------------------------------------------- interaction */
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      var h = null;
      if (p.x >= PLOT.x && p.x <= PLOT.x + PLOT.w && p.y >= PLOT.y && p.y <= PLOT.y + PLOT.h) {
        h = rOf(p.x);
      }
      if (h !== hover) { hover = h; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (hover !== null) { hover = null; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.x < PLOT.x || p.x > PLOT.x + PLOT.w) return;
      probeCtl.set(sliderFromR(rOf(p.x)));
    });
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      sync();
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#fbfcfe"; ctx.fillRect(PLOT.x, PLOT.y, PLOT.w, PLOT.h);

      ctx.strokeStyle = "#e6e9ef"; ctx.lineWidth = 1;
      ctx.textBaseline = "top"; ctx.textAlign = "center";
      ctx.font = "10px " + FONT;
      X_TICKS.forEach(function (R) {
        var x = xOf(R);
        if (x < PLOT.x - 1 || x > PLOT.x + PLOT.w + 1) return;
        ctx.beginPath(); ctx.moveTo(x, PLOT.y); ctx.lineTo(x, PLOT.y + PLOT.h); ctx.stroke();
        ctx.strokeStyle = "#8a8f98";
        ctx.beginPath(); ctx.moveTo(x, PLOT.y + PLOT.h); ctx.lineTo(x, PLOT.y + PLOT.h + 5);
        ctx.stroke();
        ctx.strokeStyle = "#e6e9ef";
        ctx.fillStyle = "#555555";
        ctx.fillText(String(R / 1000), x, PLOT.y + PLOT.h + 8);
      });
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      Y_TICKS.forEach(function (d) {
        var y = yOf(d * 86400);
        if (y < PLOT.y - 1 || y > PLOT.y + PLOT.h + 1) return;
        ctx.beginPath(); ctx.moveTo(PLOT.x, y); ctx.lineTo(PLOT.x + PLOT.w, y); ctx.stroke();
        ctx.fillStyle = "#555555";
        ctx.fillText(String(d), PLOT.x - 8, y);
      });

      /* the curve itself, one sample per pixel column as the SWF draws it */
      ctx.beginPath();
      for (var px = 0; px <= PLOT.w; px++) {
        var R = rOf(PLOT.x + px), y = yOf(periodOf(R));
        if (px === 0) ctx.moveTo(PLOT.x, y); else ctx.lineTo(PLOT.x + px, y);
      }
      ctx.strokeStyle = "#3299ff"; ctx.lineWidth = 2; ctx.stroke();

      ctx.strokeStyle = "#333333"; ctx.lineWidth = 1;
      ctx.strokeRect(PLOT.x + 0.5, PLOT.y + 0.5, PLOT.w, PLOT.h);

      if (showMarks) {
        MARKS.forEach(function (m) {
          var x = xOf(m.r), y = yOf(periodOf(m.r));
          ctx.beginPath(); ctx.arc(x, y, 3.5, 0, TAU);
          ctx.fillStyle = "#e03020"; ctx.fill();
          ctx.fillStyle = "#333333"; ctx.font = "11px " + FONT;
          var right = x < PLOT.x + PLOT.w - 90;
          ctx.textAlign = right ? "left" : "right";
          ctx.textBaseline = "bottom";
          ctx.fillText(tr(m.key), x + (right ? 8 : -8), y - 4 + (m.dy || 0));
        });
      }

      /* the probe, and whatever the cursor is over */
      marker(ctx, probeR, "#1668c4", true);
      if (hover !== null) marker(ctx, hover, "#9aa3b2", false);

      ctx.fillStyle = "#222222"; ctx.font = "12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(tr("eo.xlab"), PLOT.x + PLOT.w / 2, PLOT.y + PLOT.h + 28);
      ctx.save();
      ctx.translate(26, PLOT.y + PLOT.h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textBaseline = "alphabetic";
      ctx.fillText(tr("eo.ylab"), 0, 0);
      ctx.restore();
    });

    sync();

    function marker(ctx, R, colour, solid) {
      var x = xOf(R), y = yOf(periodOf(R));
      ctx.save();
      ctx.setLineDash(solid ? [] : [3, 3]);
      ctx.strokeStyle = colour; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, PLOT.y + PLOT.h); ctx.lineTo(x, y);
      ctx.lineTo(PLOT.x, y);
      ctx.stroke();
      ctx.restore();
      ctx.beginPath(); ctx.arc(x, y, solid ? 5 : 3.5, 0, TAU);
      ctx.fillStyle = colour; ctx.fill();
      if (solid) {
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5; ctx.stroke();
        var label = fmtKm(R) + "  ·  " + fmtPeriod(periodOf(R));
        ctx.font = "11px " + MONO;
        var w = ctx.measureText(label).width + 12;
        var lx = Math.min(PLOT.x + PLOT.w - w - 4, Math.max(PLOT.x + 4, x - w / 2));
        ctx.fillStyle = "rgba(22,104,196,0.92)";         // high enough to clear a mark's name
        ctx.fillRect(lx, y - 38, w, 20);
        ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(label, lx + 6, y - 28);
      }
    }
  }
});
