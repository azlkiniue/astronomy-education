/* Blink Comparator Simulator -----------------------------------------------------
   Faithful rebuild of NAAP's "blinkComparatorSimulator.swf". Pick some of the
   night's exposures, queue them up, and flip between them: everything that stays
   put is a constant star, and whatever winks is the variable you are hunting.

   The data is the SWF's own settings.xml — a 400 x 300 frame at noise mean 2300 /
   sigma 330, saturation magnitude 3, an Airy disc of radius 5, twenty-six stars
   (twenty-one constant, four pulsating, one eclipsing binary) and 113 observations
   spanning epochs 1.72 to 22.00 days, each with the noise seed that makes its
   grain reproducible.

   The variable stars follow the SWF's own prototypes. A PulsatingStar is a Fourier
   sum, m = centre + sum A_k cos((k+1) theta + phi_k) with theta = 2 pi epoch /
   period; the eclipsing binary TW Cas is two uniform discs of the given radii and
   temperatures on a circular orbit inclined 74.7 degrees, whose period follows
   from Kepler's third law at a separation of 8.17 solar radii.                */
Sim.create({
  id: "blinkcomparatorsimulator",
  width: 784, height: 408,
  strings: {
    en: {
      "bl.q": "Queue", "bl.all": "Queue all", "bl.addAll": "Queue every tenth", "bl.clear": "Empty the queue",
      "bl.play": "Blink", "bl.rate": "Blink rate", "bl.back": "◀ Back",
      "bl.fwd": "Forward ▶", "bl.opt": "Options", "bl.cross": "show crosshairs",
      "bl.invert": "invert the display", "bl.reset": "Reset",
      "bl.obsTitle": "Observations", "bl.queueTitle": "Queue", "bl.epoch": "epoch",
      "bl.rEpoch": "showing epoch", "bl.rQueue": "in the queue", "bl.rPos": "cursor",
      "bl.rOf": "of",
      "bl.none": "—", "bl.empty": "double-click an observation to queue it",
      "bl.hint": "Queue several exposures, then blink between them and watch for a star that changes brightness. Click an observation on the left to add it; click one in the queue to take it out.",
      "bl.days": "d"
    },
    id: {
      "bl.q": "Antrean", "bl.all": "Antrekan semua", "bl.addAll": "Antrekan tiap kesepuluh", "bl.clear": "Kosongkan antrean",
      "bl.play": "Kedip", "bl.rate": "Laju kedip", "bl.back": "◀ Mundur",
      "bl.fwd": "Maju ▶", "bl.opt": "Pilihan", "bl.cross": "tampilkan garis bidik",
      "bl.invert": "balikkan tampilan", "bl.reset": "Atur ulang",
      "bl.obsTitle": "Pengamatan", "bl.queueTitle": "Antrean", "bl.epoch": "epok",
      "bl.rEpoch": "menampilkan epok", "bl.rQueue": "dalam antrean", "bl.rPos": "kursor",
      "bl.rOf": "dari",
      "bl.none": "—", "bl.empty": "klik sebuah pengamatan untuk mengantrekannya",
      "bl.hint": "Antrekan beberapa pemotretan, lalu kedipkan di antaranya dan perhatikan bintang yang berubah terang. Klik pengamatan di kiri untuk menambahkannya; klik yang di antrean untuk mengeluarkannya.",
      "bl.days": "h"
    }
  },
  about: {
    en: "<p>Before computers, this is how variable stars and moving objects were found. Two photographic plates of the same field, taken on different nights and carefully registered, were flipped back and forth under a viewer. Anything that had not changed stayed rock steady; anything that had jumped out at the eye.</p>" +
        "<p>The method works because human vision is far better at detecting change than at comparing absolute brightness. Asked whether one star is a tenth of a magnitude brighter than another, most people cannot say. Asked whether a star is winking as the images alternate, almost anyone can.</p>" +
        "<p>It is a genuinely historic instrument. Clyde Tombaugh found Pluto in 1930 by blinking plates of the same star field for the better part of a year, looking for the one dot that had shifted. Here the constant stars sit still and four pulsating stars and one eclipsing binary do the winking.</p>",
    id: "<p>Sebelum ada komputer, beginilah bintang variabel dan benda yang bergerak ditemukan. Dua pelat fotografi medan yang sama, diambil pada malam berbeda dan ditumpangtindihkan dengan cermat, dibolak-balik di bawah alat pengamat. Apa pun yang tidak berubah tampak diam tak bergeming; apa pun yang berubah langsung menyita perhatian.</p>" +
        "<p>Cara ini berhasil karena penglihatan manusia jauh lebih baik dalam mendeteksi perubahan daripada membandingkan kecerlangan mutlak. Ditanya apakah satu bintang sepersepuluh magnitudo lebih terang daripada bintang lain, kebanyakan orang tak bisa menjawab. Ditanya apakah sebuah bintang berkedip saat citranya berganti-ganti, hampir siapa pun bisa.</p>" +
        "<p>Ini instrumen yang sungguh bersejarah. Clyde Tombaugh menemukan Pluto pada 1930 dengan mengedipkan pelat medan bintang yang sama hampir sepanjang setahun, mencari satu titik yang telah berpindah. Di sini bintang-bintang tetap diam sementara empat bintang berdenyut dan satu binari gerhana yang berkedip.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

    /* fieldParameters, from settings.xml */
    var FW = 400, FH = 300, FX = 12, FY = 40;
    var NOISE_MEAN = 2300, NOISE_SIGMA = 330, SAT_MAG = 3, PSF_R = 5;
    var LIST_A = { x: 426, y: 40, w: 166, h: 300 };
    var LIST_B = { x: 604, y: 40, w: 166, h: 300 };
    var ROW = 20;

    var STARS = [
      {k:"c",m:3.95,x:29,y:42}, {k:"e",m:3.2,x:331,y:22,p:"TW_Cas"}, {k:"p",m:4.2,x:64,y:113,p:"MT_Tel"},
      {k:"p",m:4.5,x:308,y:175,p:"del_Cep"}, {k:"p",m:4,x:124,y:259,p:"PZ_Aql"}, {k:"c",m:4.46,x:43,y:26},
      {k:"c",m:4.23,x:29,y:157}, {k:"c",m:4.73,x:129,y:105}, {k:"c",m:3.2,x:111,y:54},
      {k:"c",m:4.26,x:213,y:220}, {k:"c",m:4.89,x:57,y:192}, {k:"c",m:4.78,x:239,y:252},
      {k:"c",m:5.1,x:323,y:84}, {k:"c",m:3.77,x:296,y:243}, {k:"c",m:4.85,x:246,y:82},
      {k:"c",m:4.02,x:121,y:26}, {k:"c",m:4.89,x:62,y:255}, {k:"c",m:4.15,x:169,y:204},
      {k:"c",m:5.87,x:259,y:147}, {k:"c",m:4.57,x:287,y:41}, {k:"c",m:3.89,x:359,y:129},
      {k:"c",m:3.42,x:113,y:186}, {k:"c",m:5.02,x:343,y:272}, {k:"c",m:6.2,x:341,y:215},
      {k:"c",m:3.89,x:169,y:52}, {k:"p",m:3.7,x:131,y:201,p:"RR_Leo"},
    ];
    /* epoch, noise seed — the SWF's 113 observations */
    var OBS = [
      [1.7215,1256978718], [1.7422,1785390230], [1.7691,1382680561], [1.8123,1742185764],
      [1.8526,710265087], [1.9156,1066486183], [1.9812,1058998707], [2.7147,51459824],
      [2.768,1972335412], [2.8578,1343915649], [2.9237,439876688], [3.7344,782899726],
      [3.7833,1806118830], [3.8127,863406004], [3.8765,1134287060], [3.9185,2014380068],
      [3.9687,260793590], [3.9901,560787509], [4.701,2039223079], [4.712,1383056705],
      [4.758,334011648], [4.8253,650444998], [4.8678,1533482619], [4.9125,947130937],
      [4.9758,466707171], [5.7012,1102868459], [5.768,1700291428], [5.8125,1225051256],
      [5.8735,422685015], [5.9858,947825811], [5.9564,1130423571], [7.7788,378344826],
      [7.826,334337871], [7.9145,97763772], [7.9845,2019259761], [8.7025,563134417],
      [8.7525,1058706842], [8.7845,1861643419], [8.8125,1959485046], [8.8226,2128826760],
      [8.8514,338299181], [8.8847,391630794], [8.9051,478658298], [8.92456,974094161],
      [8.946,1518012349], [8.987,977973922], [8.992,1345149825], [9.8453,1226434322],
      [9.9458,699621619], [10.8245,461278720], [10.8874,298765266], [10.9256,1772726031],
      [10.9785,160593917], [11.73,1691674262], [11.7468,44305564], [11.7746,1893314026],
      [11.7945,139024690], [11.8246,218340389], [11.869,1456980283], [11.9145,169069842],
      [11.9877,1299197317], [12.856,626914566], [12.9147,813106012], [12.9682,1735412833],
      [14.87,342551949], [14.95,406023499], [15.7234,2045040691], [15.7481,1006521879],
      [15.7896,790956861], [15.8465,179188123], [15.8879,1829230385], [15.9236,968013572],
      [15.9478,1252509015], [15.9689,537516409], [15.9868,1373484650], [15.9978,1552091327],
      [16.7246,1979619431], [16.7896,233906902], [16.8355,144395622], [16.8798,1432660673],
      [16.9024,774857072], [16.9387,1340574206], [16.9789,8901314], [17.7365,1556295523],
      [17.8135,594204072], [17.9022,1579063958], [17.9847,1226140192], [18.7149,699600884],
      [18.7458,207512030], [18.8125,274329189], [18.8566,150394260], [18.885,952547410],
      [18.9021,761675836], [18.9285,1383633344], [18.9624,604471612], [19.812,1552913782],
      [19.874,927649061], [19.9452,142240048], [19.9987,781575733], [20.7124,236368276],
      [20.7587,243326267], [20.8435,83280748], [20.9025,354767634], [20.9902,528950464],
      [21.732,1790701462], [21.7546,2131261980], [21.7896,1385672575], [21.8125,924250012],
      [21.827,1080889661], [21.8799,1736180932], [21.9125,1964361350], [21.9364,1554201757],
      [21.9987,815966561],
    ];

    /* PulsatingStar.PRESETS, the entries settings.xml names */
    var PULSE = {
      del_Cep: { period: 5.366341, terms: [[0.3496, 2.491], [0.1385, 3.084],
        [0.05499, 3.811], [0.02277, 4.083], [0.009765, 4.709]] },
      PZ_Aql: { period: 8.7513, terms: [[0.365, 4.66], [0.0459, 1.75],
        [0.0208, 2.76], [0.0188, 5.98]] },
      MT_Tel: { period: 0.316897, terms: [[0.26, 1.93], [0.0735, 1.89], [0.0166, 1.85],
        [0.01, 1.95], [0.0056, 1.35], [0.00489, 1.48], [0.00453, 1.62], [0.00151, 1.11]] },
      RR_Leo: { period: 0.4523933, terms: [[0.455, 0.691], [0.228, 5.16], [0.161, 3.69],
        [0.0991, 2.33], [0.0779, 1.02], [0.0491, 5.81], [0.0327, 4.45], [0.0314, 2.97]] }
    };
    /* EclipsingBinary.PRESETS.TW_Cas */
    var TW_CAS = { inclination: 74.7, separation: 8.17, mass1: 2.5, radius1: 2,
      temperature1: 10500, mass2: 1.1, radius2: 2.6, temperature2: 5400 };
    var R_SUN_AU = 0.00465047;
    TW_CAS.period = 365.25 * Math.sqrt(Math.pow(TW_CAS.separation * R_SUN_AU, 3) /
      (TW_CAS.mass1 + TW_CAS.mass2));

    function pulsingMag(st, epoch) {
      var p = PULSE[st.p], th = TAU * epoch / p.period, m = st.m;
      for (var k = 0; k < p.terms.length; k++) {
        m += p.terms[k][0] * Math.cos((k + 1) * th + p.terms[k][1]);
      }
      return m;
    }
    /* two uniform discs on a circular orbit: the overlap area times the hidden
       star's surface brightness is the light that goes missing                */
    function binaryMag(st, epoch) {
      var b = TW_CAS, i = b.inclination * Math.PI / 180;
      var ph = TAU * epoch / b.period;
      var d = b.separation * Math.sqrt(Math.sin(ph) * Math.sin(ph) +
        Math.cos(i) * Math.cos(i) * Math.cos(ph) * Math.cos(ph));
      var s1 = Math.pow(b.temperature1, 4), s2 = Math.pow(b.temperature2, 4);
      var f1 = Math.PI * b.radius1 * b.radius1 * s1;
      var f2 = Math.PI * b.radius2 * b.radius2 * s2;
      var lost = 0, A = overlap(b.radius1, b.radius2, d);
      if (A > 0) lost = A * (Math.cos(ph) > 0 ? s1 : s2);
      return st.m - 2.5 * Math.log((f1 + f2 - lost) / (f1 + f2)) / Math.LN10;
    }
    function overlap(r1, r2, d) {
      if (d >= r1 + r2) return 0;
      if (d <= Math.abs(r1 - r2)) { var r = Math.min(r1, r2); return Math.PI * r * r; }
      var a1 = Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
      var a2 = Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
      return r1 * r1 * (a1 - Math.sin(2 * a1) / 2) + r2 * r2 * (a2 - Math.sin(2 * a2) / 2);
    }
    function magnitudeAt(st, epoch) {
      return st.k === "p" ? pulsingMag(st, epoch)
        : st.k === "e" ? binaryMag(st, epoch) : st.m;
    }

    var queue = [], shown = -1, scrollA = 0, scrollB = 0;
    var crosshairs = true, invert = false, cursor = null, rate = 2;
    var cache = {}, cacheOrder = [];

    function frameFor(idx) {
      var key = idx + (invert ? "i" : "n");
      if (cache[key]) return cache[key];
      var ob = OBS[idx];
      var counts = STARFIELD.render({ width: FW, height: FH, noiseMean: NOISE_MEAN,
        noiseSigma: NOISE_SIGMA, saturationMagnitude: SAT_MAG, seed: ob[1],
        psf: STARFIELD.airyDisc(PSF_R),
        stars: STARS.map(function (st) {
          return { x: st.x, y: st.y, magnitude: magnitudeAt(st, ob[0]) };
        }) });
      var c = document.createElement("canvas");
      c.width = FW; c.height = FH;
      var cx = c.getContext("2d");
      var img = cx.createImageData(FW, FH);
      STARFIELD.paint(img, counts, invert);
      cx.putImageData(img, 0, 0);
      cache[key] = c;
      cacheOrder.push(key);
      while (cacheOrder.length > 24) delete cache[cacheOrder.shift()];
      return c;
    }

    /* ------------------------------------------------------------- controls */
    S.group("bl.q");
    /* fill the queue with every observation, or with every tenth one */
    function fillQueue(every) {
      queue = [];
      for (var i = 0; i < OBS.length; i += every) queue.push(i);
      shown = queue.length ? 0 : -1; scrollB = 0;
      sync();
    }
    S.button({ labelKey: "bl.all", on: function () { fillQueue(1); } });
    S.button({ labelKey: "bl.addAll", on: function () { fillQueue(10); } });
    S.button({ labelKey: "bl.clear", on: function () {
      queue = []; shown = -1; loop.pause(); sync();
    } });
    S.button({ labelKey: "bl.back", on: function () { step(-1); } });
    S.button({ labelKey: "bl.fwd", on: function () { step(1); } });
    var loop = S.loop(function (dt) {
      acc += dt;
      if (acc >= 1 / rate) { acc = 0; step(1); }
    });
    var acc = 0;
    S.playPause(loop);
    var rateCtl = S.slider({ labelKey: "bl.rate", min: 0.5, max: 8, value: 2, step: 0.5,
      format: function (v) { return v.toFixed(1) + " Hz"; }, on: function (v) { rate = v; } });

    S.group("bl.opt");
    var crossCtl = S.toggle({ labelKey: "bl.cross", value: true,
      on: function (v) { crosshairs = v; } });
    var invCtl = S.toggle({ labelKey: "bl.invert", value: false,
      on: function (v) { invert = v; } });
    S.button({ labelKey: "bl.reset", on: function () {
      loop.pause(); queue = []; shown = -1; scrollA = 0; scrollB = 0;
      crossCtl.set(true); invCtl.set(false); rateCtl.set(2); sync();
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "bl.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outEpoch = S.readout({ labelKey: "bl.rEpoch" });
    var outQueue = S.readout({ labelKey: "bl.rQueue" });
    var outPos = S.readout({ labelKey: "bl.rPos" });

    function step(d) {
      if (!queue.length) { shown = -1; sync(); return; }
      shown = ((shown + d) % queue.length + queue.length) % queue.length;
      sync();
    }
    function sync() {
      outEpoch(shown >= 0 ? OBS[queue[shown]][0].toFixed(4) + " " + I18N.t("bl.days")
        : I18N.t("bl.none"));
      outQueue(queue.length + " " + I18N.t("bl.rOf") + " " + OBS.length);
      outPos(cursor ? cursor.x + ", " + cursor.y : I18N.t("bl.none"));
      S.requestDraw();
    }

    /* ---------------------------------------------------------- interaction */
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      var a = rowAt(p, LIST_A, scrollA, OBS.length);
      if (a >= 0) {
        if (queue.indexOf(a) < 0) { queue.push(a); if (shown < 0) shown = 0; }
        sync(); return;
      }
      var b = rowAt(p, LIST_B, scrollB, queue.length);
      if (b >= 0) {
        queue.splice(b, 1);
        if (shown >= queue.length) shown = queue.length - 1;
        sync();
      }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      var c = null;
      if (p.x >= FX && p.x < FX + FW && p.y >= FY && p.y < FY + FH) {
        c = { x: Math.floor(p.x - FX), y: Math.floor(p.y - FY) };
      }
      if ((c === null) !== (cursor === null) ||
          (c && cursor && (c.x !== cursor.x || c.y !== cursor.y))) { cursor = c; sync(); }
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (cursor) { cursor = null; sync(); }
    });
    S.canvas.addEventListener("wheel", function (ev) {
      var p = at(ev), d = ev.deltaY > 0 ? 1 : -1;
      if (inRect(p, LIST_A)) {
        scrollA = clampScroll(scrollA + d * 3, OBS.length);
        ev.preventDefault(); S.requestDraw();
      } else if (inRect(p, LIST_B)) {
        scrollB = clampScroll(scrollB + d * 3, queue.length);
        ev.preventDefault(); S.requestDraw();
      }
    }, { passive: false });
    function clampScroll(v, n) {
      var vis = Math.floor((LIST_A.h - 26) / ROW);
      return Math.max(0, Math.min(Math.max(0, n - vis), v));
    }
    function inRect(p, r) {
      return p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y < r.y + r.h;
    }
    function rowAt(p, r, scroll, n) {
      if (!inRect(p, r) || p.y < r.y + 26) return -1;
      var i = Math.floor((p.y - r.y - 26) / ROW) + scroll;
      return i >= 0 && i < n ? i : -1;
    }
    function at(ev) {
      var rr = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - rr.left) * S.W / rr.width,
        y: (ev.clientY - rr.top) * S.H / rr.height };
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#eef0f4"; ctx.fillRect(0, 0, S.W, S.H);

      ctx.fillStyle = invert ? "#ffffff" : "#000000";
      ctx.fillRect(FX, FY, FW, FH);
      if (shown >= 0) ctx.drawImage(frameFor(queue[shown]), FX, FY);
      else {
        ctx.fillStyle = "#8a8f98"; ctx.font = "12px " + FONT;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(tr("bl.empty"), FX + FW / 2, FY + FH / 2);
      }
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1;
      ctx.strokeRect(FX - 0.5, FY - 0.5, FW + 1, FH + 1);

      if (crosshairs && cursor) {
        ctx.strokeStyle = "rgba(255,90,90,0.8)"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(FX, FY + cursor.y + 0.5); ctx.lineTo(FX + FW, FY + cursor.y + 0.5);
        ctx.moveTo(FX + cursor.x + 0.5, FY); ctx.lineTo(FX + cursor.x + 0.5, FY + FH);
        ctx.stroke();
      }

      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#333333"; ctx.font = "12px " + FONT;
      ctx.fillText(tr("bl.obsTitle"), LIST_A.x, LIST_A.y - 10);
      ctx.fillText(tr("bl.queueTitle"), LIST_B.x, LIST_B.y - 10);
      ctx.fillText(tr("bl.epoch") + (shown >= 0
        ? ":  " + OBS[queue[shown]][0].toFixed(4) + " " + tr("bl.days") : ""), FX, FY - 10);

      list(ctx, tr, LIST_A, scrollA, OBS.length, function (i) {
        return { text: OBS[i][0].toFixed(4), on: queue.indexOf(i) >= 0, cur: false };
      });
      list(ctx, tr, LIST_B, scrollB, queue.length, function (i) {
        return { text: OBS[queue[i]][0].toFixed(4), on: false, cur: i === shown };
      });
    });

    function list(ctx, tr, r, scroll, n, get) {
      ctx.fillStyle = "#ffffff"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#c8ccd4"; ctx.lineWidth = 1;
      ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
      ctx.fillStyle = "#f2f4f8"; ctx.fillRect(r.x + 1, r.y + 1, r.w - 2, 24);
      ctx.fillStyle = "#555555"; ctx.font = "11px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(tr("bl.epoch"), r.x + 10, r.y + 13);
      ctx.save();
      ctx.beginPath(); ctx.rect(r.x + 1, r.y + 26, r.w - 2, r.h - 27); ctx.clip();
      var vis = Math.floor((r.h - 26) / ROW);
      for (var k = 0; k < vis && scroll + k < n; k++) {
        var i = scroll + k, row = get(i), y = r.y + 26 + k * ROW;
        if (row.cur) { ctx.fillStyle = "#1668c4"; ctx.fillRect(r.x + 1, y, r.w - 2, ROW); }
        else if (row.on) { ctx.fillStyle = "#dceaf8"; ctx.fillRect(r.x + 1, y, r.w - 2, ROW); }
        ctx.fillStyle = row.cur ? "#ffffff" : "#222222";
        ctx.font = "11px " + MONO;
        ctx.fillText(row.text, r.x + 10, y + ROW / 2);
      }
      ctx.restore();
      if (n > vis) {
        var frac = vis / n, top = scroll / n;
        ctx.fillStyle = "#c8ccd4";
        ctx.fillRect(r.x + r.w - 6, r.y + 26 + (r.h - 27) * top, 4, (r.h - 27) * frac);
      }
    }

    sync();
  }
});
