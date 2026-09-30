/* Daylight Simulator ------------------------------------------------------------------
   Faithful rebuild of ClassAction's "daylightsimulator.swf" (Coordinates and Motions),
   decompiled with tools/swf-actions.py: the root timeline's animation code on NAAP's
   Flat Map Component 007, three SliderV3s and Flash MX radio buttons and push
   buttons. The map is the SWF's own pair of NASA Goddard images — Blue Marble by
   day, city lights by night — each one period of the SWF's two-period strips
   (assets/img/sims/daylight-day.jpg, -night.jpg), 517.5 × 258.75 px at (131.25,
   35.45): the component's 450 × 225 placeholder at its 1.15 placement scale.

   The night picture shows through wherever the Sun is below the horizon. The
   terminator is the component's own curve, tan φ = −cos(λ − λ☉) / tan δ, drawn as
   a 1 px #909090 line; with δ = 0 it is two meridians 90° from noon. The Sun's
   declination is the root's δ = −23.26° · cos(2π (n + 10) / 365) for day n, and the
   day length at the observer is the CBM model the SWF uses (Forsythe et al.
   1995, the Sun's centre 0.8333° below the horizon at sunrise), 24 h or 0 h when
   the Sun never sets or never rises.

   "Yearly" steps the day (the declination swings between the solstices, noon
   stays on the centre of the map); "Daily" turns the Earth — the day/night pattern
   stays put while the map slides east under it, 1° of longitude a frame at speed
   1, and the clock shows local solar time at the red observer, to the 4-minute
   degree as in the SWF. Speed is the slider's value / 5 (the SWF's animChanged),
   at the SWF's 30 frames a second. With the animation stopped the map can be
   dragged sideways, as in the SWF.

   Departures, all bugs of the original: its date advanced one day a frame
   whatever the speed (so it drifted from the declination at any speed but 1), its
   clock only updated when a slider moved, and pausing "Daily" snapped the day/night
   pattern back to where it started. Here date, declination and clock always agree.
   The red observer can also be dragged on the map.                                */
Sim.create({
  id: "daylightsimulator",
  width: 780, height: 515,
  strings: {
    en: {
      "dl.observer": "Observer", "dl.lon": "longitude", "dl.lat": "latitude", "dl.resetBtn": "Reset to (0,0)",
      "dl.anim": "Animation", "dl.mode": "animation mode", "dl.yearly": "Yearly", "dl.daily": "Daily",
      "dl.speed": "animation speed", "dl.stop": "Stop Animation", "dl.start": "Start Animation",
      "dl.rDate": "date", "dl.rTime": "time at the observer", "dl.rDec": "sun declination",
      "dl.rRays": "latitude of direct rays", "dl.rHours": "daylight hours",
      "dl.hint": "Drag the red dot to move the observer. With the animation stopped, drag the map sideways to look around the globe.",
      "dl.cDate": "Date:", "dl.cTime": "Time:", "dl.cDec": "Sun Declination:", "dl.cRays": "Latitude of Direct Rays:",
      "dl.cHours": "Daylight Hours:", "dl.cMode": "Animation Mode", "dl.cLon": "Longitude", "dl.cLat": "Latitude",
      "dl.cSpeed": "Animation Speed", "dl.credit": "Image Credit: NASA Goddard Space Flight Center",
      "dl.hours": " hours", "dl.E": " E", "dl.W": " W", "dl.N": " N", "dl.S": " S",
      "dl.dE": "° E", "dl.dW": "° W", "dl.dN": "° N", "dl.dS": "° S", "dl.am": "AM", "dl.pm": "PM",
      "dl.m0": "January", "dl.m1": "February", "dl.m2": "March", "dl.m3": "April", "dl.m4": "May", "dl.m5": "June",
      "dl.m6": "July", "dl.m7": "August", "dl.m8": "September", "dl.m9": "October", "dl.m10": "November",
      "dl.m11": "December"
    },
    id: {
      "dl.observer": "Pengamat", "dl.lon": "bujur", "dl.lat": "lintang", "dl.resetBtn": "Kembali ke (0,0)",
      "dl.anim": "Animasi", "dl.mode": "mode animasi", "dl.yearly": "Tahunan", "dl.daily": "Harian",
      "dl.speed": "kecepatan animasi", "dl.stop": "Hentikan Animasi", "dl.start": "Mulai Animasi",
      "dl.rDate": "tanggal", "dl.rTime": "waktu di tempat pengamat", "dl.rDec": "deklinasi matahari",
      "dl.rRays": "lintang sinar tegak", "dl.rHours": "lama siang",
      "dl.hint": "Seret titik merah untuk memindahkan pengamat. Saat animasi berhenti, seret peta ke samping untuk melihat sekeliling bola bumi.",
      "dl.cDate": "Tanggal:", "dl.cTime": "Waktu:", "dl.cDec": "Deklinasi Matahari:", "dl.cRays": "Lintang Sinar Tegak:",
      "dl.cHours": "Lama Siang:", "dl.cMode": "Mode Animasi", "dl.cLon": "Bujur", "dl.cLat": "Lintang",
      "dl.cSpeed": "Kecepatan Animasi", "dl.credit": "Kredit Gambar: NASA Goddard Space Flight Center",
      "dl.hours": " jam", "dl.E": " BT", "dl.W": " BB", "dl.N": " LU", "dl.S": " LS",
      "dl.dE": "° BT", "dl.dW": "° BB", "dl.dN": "° LU", "dl.dS": "° LS", "dl.am": "", "dl.pm": "",
      "dl.m0": "Januari", "dl.m1": "Februari", "dl.m2": "Maret", "dl.m3": "April", "dl.m4": "Mei", "dl.m5": "Juni",
      "dl.m6": "Juli", "dl.m7": "Agustus", "dl.m8": "September", "dl.m9": "Oktober", "dl.m10": "November",
      "dl.m11": "Desember"
    }
  },
  about: {
    en: "<p>At any moment exactly half of the Earth is in sunlight. On a flat map that half becomes a strange shape, because the map stretches the polar regions: the boundary between day and night, the <b>terminator</b>, is a great circle on the globe but a wave on the map. Its shape is set by the Sun's <b>declination</b> — the latitude where the Sun is straight overhead at noon.</p>" +
        "<p>Run the <b>Yearly</b> animation and watch the declination swing between 23.4° N at the June solstice and 23.4° S in December. When it is north of the equator the northern hemisphere gets more than half of each day in sunlight and the region around the North Pole is lit all day long, while Antarctica sits in round-the-clock darkness; half a year later the roles are reversed. At the equinoxes the terminator runs straight from pole to pole and everywhere gets twelve hours of daylight.</p>" +
        "<p>Switch to <b>Daily</b> to spin the Earth: the pattern of sunlight stays still while the map slides beneath it, just as the ground slides under the Sun's light as the Earth turns. The red dot is an observer; move it with the sliders (or drag it) to see how the length of the day depends on latitude and season. The night side shows the Earth's city lights.</p>" +
        "<p>The day length uses the same formula as the original: sunrise and sunset are counted when the top of the Sun touches the horizon, which is why the equator gets a little more than 12 hours.</p>",
    id: "<p>Pada setiap saat tepat separuh Bumi tersinari Matahari. Pada peta datar, separuh itu menjadi bentuk yang aneh karena peta meregangkan daerah kutub: batas antara siang dan malam, <b>terminator</b>, adalah lingkaran besar pada bola bumi tetapi berupa gelombang pada peta. Bentuknya ditentukan oleh <b>deklinasi</b> Matahari — lintang tempat Matahari tepat di atas kepala pada tengah hari.</p>" +
        "<p>Jalankan animasi <b>Tahunan</b> dan perhatikan deklinasi berayun antara 23,4° LU pada titik balik Juni dan 23,4° LS pada bulan Desember. Saat deklinasi berada di utara ekuator, belahan bumi utara mendapat sinar Matahari lebih dari separuh hari dan daerah sekitar Kutub Utara terang sepanjang hari, sementara Antarktika gelap sepanjang waktu; setengah tahun kemudian keadaannya berbalik. Pada ekuinoks, terminator lurus dari kutub ke kutub dan semua tempat mendapat dua belas jam siang.</p>" +
        "<p>Pilih <b>Harian</b> untuk memutar Bumi: pola sinar Matahari diam sementara peta bergeser di bawahnya, seperti permukaan bumi bergeser di bawah cahaya Matahari saat Bumi berputar. Titik merah adalah pengamat; pindahkan dengan penggeser (atau seret) untuk melihat bagaimana lama siang bergantung pada lintang dan musim. Sisi malam menampilkan cahaya kota-kota di Bumi.</p>" +
        "<p>Lama siang dihitung dengan rumus yang sama seperti aslinya: terbit dan terbenam dihitung saat tepi atas Matahari menyentuh cakrawala, sebabnya ekuator mendapat sedikit lebih dari 12 jam.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var FONT = "Verdana, Geneva, sans-serif", TREB = "'Trebuchet MS', 'Lucida Grande', sans-serif";
    var ASC = 1.0059, TB = 0;                       // TB: a TextField's baseline is field top + 2 + ascent

    /* ---- the Flat Map Component 007, as the SWF places it ---- */
    var MAP = { x: 131.25, y: 35.45, h: 258.75 };
    MAP.w = 2 * MAP.h;                              // 517.5: 1.4375 px a degree
    var K = MAP.w / 360, BORDER = 6, LABEL_GAP = 5, LAT_DIV = 6, LON_DIV = 8;
    var GRID = "#909090", BORDER_DARK = "#e8b075", BORDER_LIGHT = "#000000";
    var AMP = -23.26, FPS = 30;

    var dayImg = new Image(), nightImg = new Image();
    dayImg.onload = nightImg.onload = function () { S.requestDraw(); };
    dayImg.src = "../assets/img/sims/daylight-day.jpg";       // 452 × 229, one period
    nightImg.src = "../assets/img/sims/daylight-night.jpg";   // 450 × 225, one period

    /* ---- SliderV3: a 150 px bar, title and value above, min and max below ---- */
    function SliderV3(o) {
      return { x: o.x, y: o.y, hw: 75, min: o.min, max: o.max, value: o.value, title: o.title,
        minSuffix: o.minSuffix, maxSuffix: o.maxSuffix, on: o.on };
    }
    var SL_LON = SliderV3({ x: 390, y: 363.2, min: -180, max: 180, value: 0, title: "dl.cLon",
      minSuffix: "dl.W", maxSuffix: "dl.E", on: function (v) { setObserver(obsLat, v); } });
    var SL_LAT = SliderV3({ x: 390, y: 434.45, min: -90, max: 90, value: 0, title: "dl.cLat",
      minSuffix: "dl.S", maxSuffix: "dl.N", on: function (v) { setObserver(v, obsLon); } });
    var SL_SPEED = SliderV3({ x: 651.55, y: 427.45, min: 1, max: 10, value: 5, title: "dl.cSpeed",
      on: function (v) { setSpeed(v); } });
    var SLIDERS = [SL_LON, SL_LAT, SL_SPEED];
    var BTN_ANIM = { x: 585.3, y: 462.35, w: 125, h: 25 };
    var BTN_RESET = { x: 327.5, y: 467, w: 125, h: 25 };
    var RADIO_YEAR = { x: 620.95, y: 358.7, tx: 637, ty: 368.2, key: "dl.yearly", mode: "year" };
    var RADIO_DAY = { x: 620.95, y: 380.2, tx: 637, ty: 389.7, key: "dl.daily", mode: "day" };

    /* ------------------------------------------------------------------ state */
    var mode = "year", running = true, speedValue = 5;
    var dayN = 1;                                   // count3: day of the year, 1 = 1 January
    var sunLon = 0;                                 // the subsolar longitude
    var leftLon = -180;                             // longitude at the map's left edge (_offset)
    var obsLat = 0, obsLon = 0;
    var press = null, hover = null, lastT = 0;

    function speed() { return speedValue / 5; }
    function declination() { return AMP * Math.cos(2 * Math.PI / 365 * (dayN + 10)); }
    function daylightHours() {                     // CBM model, as the SWF
      var t2 = Math.asin(0.39795 * Math.cos(0.2163108 + 2 * Math.atan(0.9671396 * Math.tan(0.0086 * (dayN - 186)))));
      var L = obsLat * RAD;
      var h = 24 - 7.639437268410976 * Math.acos((0.014543315936696234 + Math.sin(L) * Math.sin(t2)) /
        (Math.cos(L) * Math.cos(t2)));
      if (isNaN(h)) h = (declination() > 0 && obsLat > 0) || (declination() < 0 && obsLat < 0) ? 24 : 0;
      return Math.round(h * 100) / 100;
    }
    function dateOf(n) {                            // the SWF's 365-day calendar
      var dpm = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], d = ((Math.floor(n) - 1) % 365 + 365) % 365, m = 0;
      while (d >= dpm[m]) { d -= dpm[m]; m++; }
      return { m: m, d: d + 1 };
    }
    function timeString() {                         // local solar time at the observer, whole degrees
      var deg = Math.floor(((obsLon - sunLon + 180) % 360 + 360) % 360);   // 0 = midnight
      var h = Math.floor(deg / 15), min = (deg % 15) * 4;
      if (I18N.getLang() === "id") return (h < 10 ? "0" : "") + h + ":" + (min < 10 ? "0" : "") + min;
      var h12 = h % 12 === 0 ? 12 : h % 12;
      return h12 + ":" + (min < 10 ? "0" : "") + min + " " + I18N.t(h < 12 ? "dl.am" : "dl.pm");
    }
    function fmt2(x) { return String(Math.round(x * 100) / 100); }

    function setObserver(lat, lon) {
      obsLat = Math.max(-90, Math.min(90, Math.round(lat)));
      obsLon = Math.max(-180, Math.min(180, Math.round(lon)));
      SL_LAT.value = obsLat; SL_LON.value = obsLon;
      changed();
    }
    function setSpeed(v) { speedValue = Math.max(1, Math.min(10, Math.round(v))); SL_SPEED.value = speedValue; changed(); }
    function setMode(m) { mode = m; changed(); }
    function setRunning(b) { running = b; lastT = performance.now(); changed(); wake(); }
    function resetObserver() { setObserver(0, 0); }

    /* ------------------------------------------------------------ sidebar */
    var controlsEl = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    var syncing = false;
    S.group("dl.observer");
    var lonCtl = S.slider({ labelKey: "dl.lon", min: -180, max: 180, step: 1, value: 0,
      format: function (v) { return lonText(v); }, on: function (v) { if (!syncing) setObserver(obsLat, v); } });
    var latCtl = S.slider({ labelKey: "dl.lat", min: -90, max: 90, step: 1, value: 0,
      format: function (v) { return latText(v); }, on: function (v) { if (!syncing) setObserver(v, obsLon); } });
    S.button({ labelKey: "dl.resetBtn", on: resetObserver });
    S.group("dl.anim");
    var modeCtl = S.select({ labelKey: "dl.mode", value: "year",
      options: [{ v: "year", labelKey: "dl.yearly" }, { v: "day", labelKey: "dl.daily" }],
      on: function (v) { if (!syncing) setMode(v); } });
    var speedCtl = S.slider({ labelKey: "dl.speed", min: 1, max: 10, step: 1, value: 5,
      format: function (v) { return String(v); }, on: function (v) { if (!syncing) setSpeed(v); } });
    var runBtn = S.button({ labelKey: "dl.stop", primary: true, on: function () { setRunning(!running); } });
    var outDate = S.readout({ labelKey: "dl.rDate" });
    var outTime = S.readout({ labelKey: "dl.rTime" });
    var outDec = S.readout({ labelKey: "dl.rDec" });
    var outRays = S.readout({ labelKey: "dl.rRays" });
    var outHours = S.readout({ labelKey: "dl.rHours" });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "dl.hint");
    controlsEl.appendChild(hint);
    function lonText(v) { return v < 0 ? -v + I18N.t("dl.W") : v > 0 ? v + I18N.t("dl.E") : "0"; }
    function latText(v) { return v < 0 ? -v + I18N.t("dl.S") : v > 0 ? v + I18N.t("dl.N") : "0"; }
    function info() {
      var dec = declination(), dt = dateOf(dayN);
      var id = I18N.getLang() === "id";
      return {
        date: id ? dt.d + " " + I18N.t("dl.m" + dt.m) : I18N.t("dl.m" + dt.m) + " " + dt.d,
        time: timeString(),
        dec: (dec >= 0 ? "+" : "") + fmt2(dec),
        rays: fmt2(Math.abs(dec)) + I18N.t(dec < 0 ? "dl.dS" : "dl.dN"),
        hours: daylightHours() + I18N.t("dl.hours")
      };
    }
    var shown = {};
    function put(k, fn, v) { if (shown[k] !== v) { shown[k] = v; fn(v); } }
    function syncSidebar() {
      syncing = true;
      if (Number(lonCtl.input.value) !== obsLon) lonCtl.set(obsLon);
      if (Number(latCtl.input.value) !== obsLat) latCtl.set(obsLat);
      if (modeCtl.value() !== mode) modeCtl.set(mode);
      if (Number(speedCtl.input.value) !== speedValue) speedCtl.set(speedValue);
      var key = running ? "dl.stop" : "dl.start";
      if (runBtn.getAttribute("data-i18n") !== key) { runBtn.setAttribute("data-i18n", key); runBtn.textContent = I18N.t(key); }
      syncing = false;
      var f = info();
      put("d", outDate, f.date); put("t", outTime, f.time); put("c", outDec, f.dec + "°");
      put("r", outRays, f.rays); put("h", outHours, f.hours);
    }
    S.refreshers.push(function () { shown = {}; syncSidebar(); });
    function changed() { syncSidebar(); S.requestDraw(); }

    /* ------------------------------------------------------------ animation */
    var rafId = 0;
    function wake() {
      if (!rafId && (running || (press && press.kind === "bar"))) rafId = requestAnimationFrame(frame);
    }
    function frame(now) {
      rafId = 0;
      if (running) {
        var frames = Math.min(now - lastT, 100) / (1000 / FPS);
        if (mode === "year") dayN = ((dayN - 1 + frames * speed()) % 365 + 365) % 365 + 1;
        else {                                       // the Earth turns east under the Sun's light
          sunLon = ((sunLon - frames * speed() + 180) % 360 + 360) % 360 - 180;
          leftLon = sunLon - 180;                    // the view keeps noon in the middle
        }
        changed();
      }
      lastT = now;
      if (press && press.kind === "bar" && now > press.wait) {
        if (now - press.tStep >= 1000 / FPS) { stepSlider(press.s, press.mx); press.tStep = now; }
      }
      wake();
    }

    /* ------------------------------------------------------------ interaction */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function inRect(p, x, y, w, h) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; }
    function shift() { return -(((leftLon + 180) / 360 % 1 + 1) % 1) * MAP.w; }   // maskedAreaMC._x
    function lonToX(lon) { return MAP.x + ((((lon - leftLon) / 360) % 1 + 1) % 1) * MAP.w; }
    function latToY(lat) { return MAP.y + (90 - lat) * K; }
    function grabX(s) { return s.x - s.hw + (s.value - s.min) / (s.max - s.min) * 2 * s.hw; }
    function sliderValueAt(s, x) { return s.min + (s.max - s.min) * (x - (s.x - s.hw)) / (2 * s.hw); }
    function stepSlider(s, mx) {                     // SliderV3Bar: one _minIncrement toward the mouse
      var v = s.value + (mx < grabX(s) ? -1 : 1);
      s.on(Math.max(s.min, Math.min(s.max, v)));
    }
    function hit(p) {
      var mx = lonToX(obsLon), my = latToY(obsLat);
      if (Math.hypot(p.x - mx, p.y - my) <= 8) return { kind: "observer" };
      for (var i = 0; i < SLIDERS.length; i++) {
        var s = SLIDERS[i], gx = grabX(s);
        if (Math.abs(p.x - gx) <= 7 && p.y >= s.y - 11.5 && p.y <= s.y + 11.6) return { kind: "grab", s: s };
        if (inRect(p, s.x - s.hw, s.y - 5, 2 * s.hw, 10)) return { kind: "bar", s: s };
      }
      if (inRect(p, BTN_ANIM.x, BTN_ANIM.y, BTN_ANIM.w, BTN_ANIM.h)) return { kind: "button", b: BTN_ANIM };
      if (inRect(p, BTN_RESET.x, BTN_RESET.y, BTN_RESET.w, BTN_RESET.h)) return { kind: "button", b: BTN_RESET };
      var rs = [RADIO_YEAR, RADIO_DAY];
      for (var j = 0; j < rs.length; j++) {
        S.ctx.font = "12px " + FONT;
        if (inRect(p, rs[j].x, rs[j].y - 2, rs[j].tx - rs[j].x + S.ctx.measureText(I18N.t(rs[j].key)).width, 14)) return { kind: "radio", r: rs[j] };
      }
      if (!running && inRect(p, MAP.x, MAP.y, MAP.w, MAP.h)) return { kind: "map" };
      return null;
    }
    var CURSORS = { observer: "move", grab: "ew-resize", bar: "pointer", button: "pointer", radio: "pointer", map: "grab" };
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      if (!h) return;
      ev.preventDefault();
      S.canvas.setPointerCapture(ev.pointerId);
      press = { kind: h.kind, s: h.s, b: h.b, r: h.r, x0: p.x, inside: true };
      if (h.kind === "grab") press.off = p.x - grabX(h.s);
      else if (h.kind === "bar") {
        stepSlider(h.s, p.x);
        press.mx = p.x; press.wait = performance.now() + 500; press.tStep = 0;
        wake();
      } else if (h.kind === "map") { press.left0 = leftLon; S.canvas.style.cursor = "grabbing"; }
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) {
        var h = hit(p);
        S.canvas.style.cursor = (h && CURSORS[h.kind]) || "default";
        var key = h ? h.kind + (h.b ? h.b.x : "") : "";
        if (key !== hover) { hover = key; S.requestDraw(); }
        return;
      }
      if (press.kind === "grab") press.s.on(Math.round(sliderValueAt(press.s, p.x - press.off)));
      else if (press.kind === "bar") press.mx = p.x;
      else if (press.kind === "map") {              // dragOnMouseMoveFunc
        leftLon = press.left0 - (p.x - press.x0) / K;
        changed();
      } else if (press.kind === "observer") {
        var lon = leftLon + (p.x - MAP.x) / K, lat = 90 - (p.y - MAP.y) / K;
        lon = ((lon + 180) % 360 + 360) % 360 - 180;
        setObserver(lat, lon);
      } else {
        var h2 = hit(p), inside = !!h2 && h2.kind === press.kind && h2.b === press.b && h2.r === press.r;
        if (inside !== press.inside) { press.inside = inside; S.requestDraw(); }
      }
    });
    function release(ev, cancelled) {
      if (!press) return;
      var pr = press;
      press = null;
      if (!cancelled && pr.inside) {
        if (pr.kind === "button") { if (pr.b === BTN_ANIM) setRunning(!running); else resetObserver(); }
        else if (pr.kind === "radio") setMode(pr.r.mode);
      }
      S.canvas.style.cursor = "default";
      changed();
    }
    S.canvas.addEventListener("pointerup", function (ev) { release(ev, false); });
    S.canvas.addEventListener("pointercancel", function (ev) { release(ev, true); });

    /* ------------------------------------------------------------ drawing */
    function t(key) { return I18N.t(key); }
    function font(ctx, size, style, face) { ctx.font = (style ? style + " " : "") + size + "px " + (face || FONT); }

    function map(ctx) {
      var x0 = MAP.x, y0 = MAP.y, W = MAP.w, H = MAP.h, sh = shift();
      ctx.save();
      ctx.beginPath(); ctx.rect(x0, y0, W, H); ctx.clip();
      ctx.fillStyle = "#000000"; ctx.fillRect(x0, y0, W, H);
      var k;
      if (dayImg.complete && dayImg.naturalWidth) {
        for (k = 0; k < 2; k++) ctx.drawImage(dayImg, 0, 0, 452, 229, x0 + sh + k * W, y0, W, H);
      }
      // the night picture, through the night side of the terminator
      var dec = declination(), pts = terminator(dec);
      ctx.save();
      ctx.beginPath();
      if (Math.abs(dec) < 1e-6) {
        nightRectsAtEquinox(ctx);
      } else {
        ctx.moveTo(pts[0].x, pts[0].y);
        for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        var edge = dec > 0 ? y0 + H + 2 : y0 - 2;
        ctx.lineTo(x0 + W + 2, edge); ctx.lineTo(x0 - 2, edge); ctx.closePath();
      }
      ctx.clip();
      if (nightImg.complete && nightImg.naturalWidth) {
        for (k = 0; k < 2; k++) ctx.drawImage(nightImg, 0, 0, 450, 225, x0 + sh + k * W, y0, W, H * 224.7 / 225);
      } else { ctx.fillStyle = "#0b1a3a"; ctx.fillRect(x0, y0, W, H); }
      ctx.restore();
      // the grid (inside the scrolling area) and the terminator line
      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      ctx.beginPath();
      for (i = 1; i < LAT_DIV; i++) { var gy = Math.round(y0 + i * H / LAT_DIV) + 0.5; ctx.moveTo(x0, gy); ctx.lineTo(x0 + W, gy); }
      for (i = 0; i <= 2 * LON_DIV; i++) { var gx = x0 + sh + i * W / LON_DIV; ctx.moveTo(gx, y0); ctx.lineTo(gx, y0 + H); }
      ctx.stroke();
      ctx.strokeStyle = GRID; ctx.beginPath();
      if (Math.abs(dec) < 1e-6) {
        [-90, 90].forEach(function (d) { var tx = lonToX(sunLon + d); ctx.moveTo(tx, y0); ctx.lineTo(tx, y0 + H); });
      } else {
        ctx.moveTo(pts[0].x, pts[0].y);
        for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
      // the observer ("uHere"): a #c1141a disc, 5 px at the map's scale
      ctx.fillStyle = "#c1141a";
      ctx.beginPath(); ctx.arc(lonToX(obsLon), latToY(obsLat), 5 * MAP.h / 225, 0, TAU); ctx.fill();
      ctx.restore();
    }
    function terminator(dec) {                       // tan φ = −cos(λ − λ☉) / tan δ, across the view
      var pts = [], n = 260, cot = 1 / Math.tan(dec * RAD);
      for (var i = 0; i <= n; i++) {
        var lon = leftLon + 360 * i / n, H = (lon - sunLon) * RAD;
        var phi = Math.atan(-Math.cos(H) * cot) / RAD;
        pts.push({ x: MAP.x + MAP.w * i / n, y: latToY(phi) });
      }
      return pts;
    }
    function nightRectsAtEquinox(ctx) {
      for (var k = -1; k <= 1; k++) {
        var a = lonToX(sunLon + 90) + k * MAP.w, b = lonToX(sunLon - 90) + k * MAP.w;
        if (b < a) b += MAP.w;
        ctx.rect(a, MAP.y, b - a, MAP.h);
      }
    }
    function border(ctx) {                           // updateBorder: strips of dark and light, labels
      var x0 = MAP.x, y0 = MAP.y, W = MAP.w, H = MAP.h, B = BORDER, sh = shift(), i;
      ctx.save();
      ctx.lineWidth = 1;
      // the side strips (fixed)
      [[x0 - B, B], [x0 + W, B]].forEach(function (s) {
        ctx.fillStyle = BORDER_LIGHT; ctx.fillRect(s[0], y0 - B, s[1], H + 2 * B);
        ctx.fillStyle = BORDER_DARK;
        for (i = 0; i < LAT_DIV; i += 2) ctx.fillRect(s[0], y0 + i * H / LAT_DIV, s[1], H / LAT_DIV);
        ctx.strokeStyle = BORDER_DARK; ctx.strokeRect(s[0] + 0.5, y0 - B + 0.5, s[1] - 1, H + 2 * B - 1);
      });
      // the top and bottom strips scroll with the map
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0 - B - 5, W, H + 2 * B + 10); ctx.clip();
      [y0 - B, y0 + H].forEach(function (sy) {
        ctx.fillStyle = BORDER_LIGHT; ctx.fillRect(x0, sy, W, B);
        ctx.fillStyle = BORDER_DARK;
        for (i = 0; i < 2 * LON_DIV + 2; i += 2) ctx.fillRect(x0 + sh + i * W / LON_DIV, sy, W / LON_DIV, B);
      });
      ctx.restore();
      ctx.strokeStyle = BORDER_DARK; ctx.beginPath();
      [y0 - B, y0, y0 + H, y0 + H + B].forEach(function (ly) {
        ctx.moveTo(x0 - B, Math.round(ly) + 0.5); ctx.lineTo(x0 + W + B, Math.round(ly) + 0.5);
      });
      ctx.stroke();
      // border labels, Verdana 12 in the border's dark colour. attachBorderLabels makes each with
      // createTextField(name, depth, x, y, 0, 0), which truncates x and y to integers (FlashText.int)
      font(ctx, 12); ctx.fillStyle = BORDER_DARK; ctx.textBaseline = "alphabetic";
      var fh = 18.4, INK = 2 + ASC * 12 + TB;                // fh: borderLabelsField._height (18.25 < fh ≤ 18.5 fits Ruffle's rows)
      ctx.textAlign = "center";
      var yTop = y0 + FlashText.int(-B - LABEL_GAP - fh), yBot = y0 + FlashText.int(H + B + LABEL_GAP);
      for (i = 0; i < LON_DIV; i++) {
        var L = -180 + i * 45, lx = lonToX(L);
        var txt = L === 0 ? "0°" : Math.abs(L) === 180 ? "180°" : Math.abs(L) + t(L < 0 ? "dl.dW" : "dl.dE");
        if (lx > x0 + W - 0.5) lx -= W;
        FlashText.fill(ctx, txt, lx, yTop + INK);          // _x = position − _width / 2 keeps its fraction
        FlashText.fill(ctx, txt, lx, yBot + INK);
      }
      var xRight = x0 + FlashText.int(W + B + LABEL_GAP);
      for (i = 0; i <= LAT_DIV; i++) {
        var lat = 90 - i * 30, yy = y0 + FlashText.int(i * H / LAT_DIV - fh / 2) + INK;
        var lt = lat === 0 ? "0°" : Math.abs(lat) + t(lat > 0 ? "dl.dN" : "dl.dS");
        ctx.textAlign = "right"; FlashText.fill(ctx, lt, x0 - B - LABEL_GAP - 2, yy);
        ctx.textAlign = "left"; FlashText.fill(ctx, lt, xRight + 2, yy);
      }
      ctx.restore();
    }
    function slider(ctx, s) {
      ctx.save(); ctx.translate(s.x, s.y);
      ctx.fillStyle = "#efefef"; ctx.fillRect(-s.hw, -2.75, 2 * s.hw, 5.5);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(-s.hw + 0.5, -2.25, 2 * s.hw - 1, 4.5);
      font(ctx, 12, "bold"); ctx.fillStyle = "#ffffff"; ctx.textBaseline = "alphabetic";
      var base = -35 + 2 + ASC * 12 + TB;
      ctx.textAlign = "left"; FlashText.fill(ctx, t(s.title), -s.hw - 10, base);
      var v = s.value, vt = String(v);
      if (s.minSuffix && v < 0) vt = -v + t(s.minSuffix);
      else if (s.maxSuffix && v > 0) vt = v + t(s.maxSuffix);
      ctx.textAlign = "right"; FlashText.fill(ctx, vt, s.hw + 10, base);
      font(ctx, 10, "bold"); ctx.textAlign = "center";
      var mb = 14 + 2 + ASC * 10 + TB;
      FlashText.fill(ctx, Math.abs(s.min) + (s.minSuffix ? t(s.minSuffix) : ""), -s.hw, mb);
      FlashText.fill(ctx, s.max + (s.maxSuffix ? t(s.maxSuffix) : ""), s.hw, mb);
      // SliderV3Grabber (shape 204): #cccccc, a hairline #666666 and three grip lines
      ctx.translate(grabX(s) - s.x, -2.2);
      ctx.fillStyle = "#cccccc"; ctx.fill(GRABBER);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.stroke(GRABBER);
      ctx.beginPath();
      [-4.5, 0.1, 4.7].forEach(function (gy) { ctx.moveTo(-2.8, gy); ctx.lineTo(2.7, gy); });
      ctx.stroke();
      ctx.restore();
    }
    var GRABBER = new Path2D("M-3 -9.3L3 -9.3Q4.65 -9.3 5.8 -8.15Q7 -6.95 7 -5.3L7 6.7Q7 7.4 3.6 10.65L0.2 13.75" +
      "Q-7 7.8 -7 6.7L-7 -5.3Q-7 -6.9 -5.85 -8.15Q-4.6 -9.3 -3 -9.3Z");
    function pushButton(ctx, b, key) {              // FPushButton: #999 / #ccc (#999 down) / #e8e8e8
      var down = press && press.kind === "button" && press.b === b && press.inside;
      ctx.fillStyle = "#999999"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = down ? "#999999" : "#cccccc"; ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t(key), b.x + b.w / 2 + (down ? 1 : 0), b.y + 17.55 + (down ? 1 : 0));
    }
    function radio(ctx, r, on) {                    // FRadioButton (frb_states), 10 px
      var down = press && press.kind === "radio" && press.r === r && press.inside;
      ctx.save(); ctx.translate(r.x, r.y);
      ctx.fillStyle = "#808080"; ctx.beginPath(); ctx.arc(5, 5, 5, 0, TAU); ctx.fill();
      ctx.fillStyle = "#d4d0d8"; ctx.beginPath(); ctx.arc(5, 5, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = down ? "#cccccc" : "#ffffff"; ctx.beginPath(); ctx.arc(5, 5, 3, 0, TAU); ctx.fill();
      if (on) { ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.arc(5, 5, 2, 0, TAU); ctx.fill(); }
      ctx.restore();
      font(ctx, 12); ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fillStatic(ctx, t(r.key), r.tx, r.ty);          // static text
    }
    function readouts(ctx) {
      var f = info();
      font(ctx, 14, "bold", TREB); ctx.fillStyle = "#ffffff"; ctx.textAlign = "right"; ctx.textBaseline = "alphabetic";   // static texts, the labels
      FlashText.fillStatic(ctx, t("dl.cDate"), 173.2, 365.2);
      FlashText.fillStatic(ctx, t("dl.cTime"), 173.2, 394.2);
      FlashText.fillStatic(ctx, t("dl.cDec"), 173.2, 422.2);
      FlashText.fillStatic(ctx, t("dl.cRays"), 173.2, 452);
      FlashText.fillStatic(ctx, t("dl.cHours"), 173.2, 479.4);
      font(ctx, 14, "", TREB); ctx.textAlign = "left";
      [[f.date, 352.2], [f.time, 381.2], [f.dec, 409.2], [f.rays, 439], [f.hours, 466.4]].forEach(function (r) {
        FlashText.fill(ctx, r[0], 182, r[1] + 15.1);                       // the embedded Trebuchet's ascent, as Ruffle sets it
      });
      font(ctx, 14, "bold", TREB); ctx.textAlign = "left";
      FlashText.fillStatic(ctx, t("dl.cMode"), 595.55, 345.75);
      font(ctx, 12, "", TREB); ctx.textAlign = "right";          // static text 222, ends at 776.1
      FlashText.fillStatic(ctx, t("dl.credit"), 776.1, 508.65);
    }

    function draw() {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.save();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      map(ctx);
      border(ctx);
      readouts(ctx);
      SLIDERS.forEach(function (s) { slider(ctx, s); });
      radio(ctx, RADIO_YEAR, mode === "year");
      radio(ctx, RADIO_DAY, mode === "day");
      pushButton(ctx, BTN_ANIM, running ? "dl.stop" : "dl.start");
      pushButton(ctx, BTN_RESET, "dl.resetBtn");
      ctx.restore();
    }
    S.onDraw(draw);
    changed();
    lastT = performance.now();
    wake();
  }
});
