/* Paths of the Sun -------------------------------------------------------------
   Faithful rebuild of the ClassAction "sunpaths.swf" (its root timeline and its
   copy of the UNL CelestialSphere engine, decompiled), drawn with the shared
   engine in _celestialsphere.js. The whole 550 × 280 stage is here: the horizon
   diagram — a sky-blue dome over the green horizon plane (showUnder off), the
   stick man and his shadow, the Sun at noon on the chosen day, the celestial
   equator (black), the ecliptic (red), the Sun's path for the day (yellow) and the
   north-south meridian (gray) — the latitude slider, the "animate" checkbox that
   walks the date through the year a day a frame (12 a second), the date and the
   legend. As in the SWF the day sets both the Sun (RA = day·24/365 h, dec =
   23.5° sin(2π·day/365), day 0 = 21 March) and the sidereal time, so the Sun is
   always on the meridian: the diagram shows each day's path through its noon.
   The sky brightens with the Sun's altitude, and the shadow stretches with it.
   Drag the sphere to spin it ("simple drag").                                   */
Sim.create({
  id: "sunpaths",
  width: 550, height: 280,
  strings: {
    en: {
      "sp.obs": "Observer", "sp.lat": "latitude", "sp.day": "date",
      "sp.animate": "animate",
      "sp.legend1": "black - celestial equator", "sp.legend2": "red - ecliptic",
      "sp.legend3": "yellow - sun's path on the given day", "sp.legend4": "gray - north-south meridian",
      "sp.dec": "Sun's declination", "sp.alt": "Sun's noon altitude",
      "sp.len": "hours of daylight", "sp.up": "up all day", "sp.down": "down all day",
      "sp.drag": "Drag the sphere to spin it around. The latitude slider and the animate box on the picture work as in the original.",
      "dir.N": "N", "dir.S": "S", "dir.E": "E", "dir.W": "W",
      "m0": "January", "m1": "February", "m2": "March", "m3": "April", "m4": "May", "m5": "June",
      "m6": "July", "m7": "August", "m8": "September", "m9": "October", "m10": "November", "m11": "December"
    },
    id: {
      "sp.obs": "Pengamat", "sp.lat": "lintang", "sp.day": "tanggal",
      "sp.animate": "animasikan",
      "sp.legend1": "hitam - ekuator langit", "sp.legend2": "merah - ekliptika",
      "sp.legend3": "kuning - lintasan Matahari hari itu", "sp.legend4": "abu-abu - meridian utara-selatan",
      "sp.dec": "deklinasi Matahari", "sp.alt": "ketinggian Matahari tengah hari",
      "sp.len": "lama siang", "sp.up": "di atas horizon sepanjang hari", "sp.down": "di bawah horizon sepanjang hari",
      "sp.drag": "Seret bola langit untuk memutarnya. Penggeser lintang dan kotak animasi pada gambar bekerja seperti aslinya.",
      "dir.N": "U", "dir.S": "S", "dir.E": "T", "dir.W": "B",
      "m0": "Januari", "m1": "Februari", "m2": "Maret", "m3": "April", "m4": "Mei", "m5": "Juni",
      "m6": "Juli", "m7": "Agustus", "m8": "September", "m9": "Oktober", "m10": "November", "m11": "Desember"
    }
  },
  about: {
    en: "<p>The Sun rises, arcs across the sky and sets along a circle called its <strong>diurnal path</strong>. That circle is fixed by just one number — the Sun's <strong>declination</strong> — and its tilt relative to your horizon is fixed by your <strong>latitude</strong>.</p>" +
        "<p>Because Earth's axis is tilted 23.5°, the Sun's declination swings from +23.5° at the June solstice to −23.5° in December, riding the <strong>ecliptic</strong>. So the whole daily path slides north and south through the year, always parallel to the <strong>celestial equator</strong>: long, high summer days and short, low winter ones. Here the Sun is always shown at noon, on the meridian.</p>" +
        "<p>Try latitude 0° — the paths stand straight up, every day is 12 hours. Try 90° — they lie flat, and the Sun simply circles at constant altitude for six months before vanishing for six more. At 66.5° and beyond you get the midnight Sun.</p>",
    id: "<p>Matahari terbit, melengkung melintasi langit, lalu terbenam sepanjang sebuah lingkaran yang disebut <strong>lintasan hariannya</strong>. Lingkaran itu ditentukan oleh satu angka saja — <strong>deklinasi</strong> Matahari — dan kemiringannya terhadap horizon ditentukan oleh <strong>lintang</strong> Anda.</p>" +
        "<p>Karena sumbu Bumi miring 23,5°, deklinasi Matahari berayun dari +23,5° pada solstis Juni hingga −23,5° pada Desember, menyusuri <strong>ekliptika</strong>. Maka seluruh lintasan harian bergeser ke utara dan selatan sepanjang tahun, selalu sejajar <strong>ekuator langit</strong>: siang musim panas yang panjang dan tinggi, siang musim dingin yang pendek dan rendah. Di sini Matahari selalu ditampilkan pada tengah hari, di meridian.</p>" +
        "<p>Coba lintang 0° — lintasannya tegak lurus, setiap hari 12 jam. Coba 90° — lintasannya mendatar, dan Matahari hanya berputar pada ketinggian tetap selama enam bulan lalu menghilang enam bulan berikutnya. Mulai 66,5° ke atas muncul Matahari tengah malam.</p>"
  },
  build: function (S) {
    var RAD = Math.PI / 180, FONT = "Verdana, Geneva, sans-serif";
    var MONTHS = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    var SLIDER = { x: 410.95, y: 43.2, half: 100 };   // the latitude slider (−90 … 90 over ±100 px)
    var CHECK = { x: 372.4, y: 86.5 };
    var lat = 41, animate = false, drag = null;

    /* ---- the CelestialSphere, as the root timeline sets it up (sphere at (140, 140)) ---- */
    var CS = window.CelestialSphere, sph = new CS({ x: 140, y: 140 });
    // the constructor's own Sun ('experi sun', shape 53), day 0
    sph.addObject("_sunObject", CS.shapeDrawer({ nz: false, layers: [[[["#ffcc00", "M5.3 -5.3Q7.5 -3.1 7.5 0Q7.5 3.1 5.3 5.3Q3.1 7.5 0 7.5Q-3.1 7.5 -5.3 5.3Q-7.5 3.1 -7.5 0Q-7.5 -3.1 -5.3 -5.3Q-3.1 -7.5 0 -7.5Q3.1 -7.5 5.3 -5.3Z"]],
      [[1, "#000000", "M5.3 -5.3Q7.5 -3.1 7.5 0Q7.5 3.1 5.3 5.3Q3.1 7.5 0 7.5Q-3.1 7.5 -5.3 5.3Q-7.5 3.1 -7.5 0Q-7.5 -3.1 -5.3 -5.3Q-3.1 -7.5 0 -7.5Q3.1 -7.5 5.3 -5.3"]]]] }), { dec: 0, ra: 0 });
    var day = 0;
    sph.size = 240;
    sph.addCircle("celestialEquator", { alpha: 100, color: 0x505050, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("sunsPath", { alpha: 100, color: 0xffffc0, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("meridian", { alpha: 100, color: 0xc0c0c0, thickness: 1 }, { tilt: 90, alt: 0, az: 0 });
    sph.addCircle("ecliptic", { alpha: 100, color: 0xff5050, thickness: 1 }, { tilt: 23.5, dec: 0, ra: 0 });
    sph.showUnder = false;
    function dirs() { return { N: I18N.t("dir.N"), S: I18N.t("dir.S"), E: I18N.t("dir.E"), W: I18N.t("dir.W") }; }
    sph.addHorizonPlaneClip(CS.directionLabels(dirs, { color: "#999999" }), "darkLabels", "below");
    sph.addHorizonPlaneClip(CS.directionLabels(dirs), "lightLabels", "above");
    sph.addShadingClip(CS.GradientDisk, "underSky", "front", "inner", "below",
      { outerColor: 0x84cbff, outerAlpha: 30, innerColor: 0x84cbff, innerAlpha: 20 });
    sph.removeClip("celestialBowl");
    sph.addShadingClip(CS.GradientDisk, "frontSky", "front", "inner", "above", { outerColor: 0x84cbff, innerColor: 0x84cbff });
    sph.addShadingClip(CS.GradientDisk, "backSky", "back", "outer", "above", { outerColor: 0x84cbff, innerColor: 0x84cbff });
    sph.addObject("stickman", CS.art.stickmanSunpaths, { system: "horizon", x: 0, y: 0, z: 0.001 });
    sph.stickman.setOrientationType("absolute", { az: 180, alt: 0 }, { az: 0, alt: 90 });
    sph.addObject("stickmanShadow", shadowGlyph, { system: "horizon", x: 0, y: 0, z: 0 });
    sph.stickmanShadow.setOrientationType("absolute", { az: 0, alt: 90 }, { az: 0, alt: 0 });
    sph.minViewerAltitude = 7;
    sph.viewerAzimuth = 200;

    /* ---- the SWF's own model: setDay / updateSun, setShadow, setSkyColor ---- */
    function setDay(arg) {
      day = arg % 365;
      sph._sunObject.setPosition({ dec: 23.5 * Math.sin(day * 0.01721420632103996), ra: day * 0.06575342465753424 });
      sph.siderealTime = 24 * ((1.0027397260273974 * day) % 1);
      sph.sunsPath.setCircleParameters({ tilt: 0, dec: sph._sunObject.dec, ra: 0 });
      setSkyColor(); setShadow();
    }
    var shadow = { visible: false, alpha: 100, yscale: 100 };
    function setShadow() {
      var h = sph._sunObject.getPositionHorizon();
      if (h.alt > 0) {
        var lim = 400, r1 = 100 / Math.tan(RAD * h.alt);
        if (r1 > lim) r1 = lim;
        if (h.az < 90 || h.az > 270) r1 = -r1;    // a Sun in the north throws the shadow south
        shadow = { visible: true, alpha: (lim - Math.abs(r1)) * (100 / lim), yscale: r1 };
      } else shadow.visible = false;
    }
    function shadowGlyph(ctx) {                     // StickmanShadow, its _yscale and _alpha set above
      if (!shadow.visible) return;
      CS.groupAlpha(ctx, shadow.alpha, function (g) {
        g.scale(1, shadow.yscale / 100);
        CS.art.stickmanShadowSunpaths(g);
      }, CS.shadowBounds({ m: [1, 0, 0, shadow.yscale / 100] }, CS.art.shapes.stickmanShadowSunpaths));
    }
    function setSkyColor() {
      var k = sph._sunObject.alt / 10 + 0.5;
      k = k > 1 ? 1 : k < 0 ? 0 : k;
      sph.backSky.innerAlpha = k * 70 + 30; sph.backSky.outerAlpha = k * 60 + 20;
      sph.frontSky.innerAlpha = k * 10; sph.frontSky.outerAlpha = k * 25 + 15;
    }
    function changeLatitude(arg) { lat = arg; sph.latitude = arg; setShadow(); setSkyColor(); upd(); }
    function dateString() {                          // getDateString
      var d = (day + 79.5) % 365, i = 0;
      while (i < 12 && !(d < MONTHS[i])) i++;
      d = i === 0 ? d + 1 : d - MONTHS[i - 1] + 1;
      return I18N.t("m" + i) + " " + Math.floor(d);
    }

    /* ---- the sidebar: the date (the SWF only moves it by animating) and readouts ---- */
    S.group("sp.obs");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "sp.drag");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var syncing = false;
    var latCtl = S.slider({ labelKey: "sp.lat", min: -90, max: 90, value: 41, step: 0.1,
      format: fmtLat, on: function (v) { if (!syncing) changeLatitude(v); } });
    var dayCtl = S.slider({ labelKey: "sp.day", min: 0, max: 364, value: 0, step: 1,
      format: function () { return dateString(); }, on: function (v) { if (!syncing) { setDay(v); upd(); } } });
    var animCtl = S.toggle({ labelKey: "sp.animate", value: false, on: function (b) { if (!syncing) setAnimate(b); } });
    var outDec = S.readout({ labelKey: "sp.dec" });
    var outAlt = S.readout({ labelKey: "sp.alt" });
    var outLen = S.readout({ labelKey: "sp.len" });
    function fmtLat(v) { return Math.abs(v).toFixed(1) + " " + I18N.t(v < 0 ? "dir.S" : "dir.N"); }
    function upd() {
      var d = sph._sunObject.dec, h = sph._sunObject.getPositionHorizon();
      outDec((d >= 0 ? "+" : "−") + Math.abs(d).toFixed(1) + "°");
      outAlt(h.alt.toFixed(1) + "°");
      var c = -Math.tan(lat * RAD) * Math.tan(d * RAD);
      outLen(c <= -1 ? I18N.t("sp.up") : c >= 1 ? I18N.t("sp.down") : (2 * Math.acos(c) / RAD / 15).toFixed(1) + " h");
      syncing = true; latCtl.set(lat); dayCtl.set(day); animCtl.set(animate); syncing = false;
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- the animation: the SWF's onEnterFrame, one day a frame at 12 frames a second ---- */
    var acc = 0;
    var loop = S.loop(function (dt) {
      acc += dt * 12;
      while (acc >= 1) { acc -= 1; setDay(day + 1); }
      upd();
    });
    function setAnimate(b) { animate = b; acc = 0; if (b) loop.play(); else loop.pause(); S.requestDraw(); }

    /* ---- pointer: the canvas slider and checkbox, else the sphere's simple drag ---- */
    function at(ev) { return CS.canvasPoint(S.canvas, ev, S.W, S.H); }
    function grabX() { return SLIDER.x + lat / 90 * SLIDER.half; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.x >= SLIDER.x - SLIDER.half - 8 && p.x <= SLIDER.x + SLIDER.half + 8 && Math.abs(p.y - SLIDER.y) <= 14) {
        var off = Math.abs(p.x - grabX()) <= 7 ? p.x - grabX() : 0;
        drag = { kind: "slider", off: off };
        sliderTo(p.x);
      } else if (p.x >= CHECK.x - 2 && p.x <= CHECK.x + 80 && p.y >= CHECK.y - 2 && p.y <= CHECK.y + 16) {
        setAnimate(!animate); upd(); return;
      } else if (sph.startDrag(p.x, p.y)) drag = { kind: "sphere" };
      else return;
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      ev.preventDefault();
    });
    function sliderTo(x) {
      var v = (x - drag.off - SLIDER.x) / SLIDER.half * 90;
      changeLatitude(Math.round(Math.max(-90, Math.min(90, v)) * 10) / 10);
    }
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.kind === "slider") sliderTo(p.x);
      else { sph.dragTo(p.x, p.y); S.requestDraw(); }
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; sph.endDrag(); });
    });

    /* ================================= drawing ============================== */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      FlashText.begin(ctx);
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      sph.draw(ctx);
      // the latitude slider: title and value, the bar, the grabber, the end labels
      ctx.fillStyle = "#ffffff"; ctx.textBaseline = "alphabetic";
      ctx.font = "bold 12px " + FONT; ctx.textAlign = "left";
      FlashText.fill(ctx, t("sp.lat"), 302, 22.25);
      ctx.textAlign = "right";
      FlashText.fill(ctx, fmtLat(lat), 519.5, 22.25);
      ctx.font = "bold 10px " + FONT;
      ctx.textAlign = "left"; FlashText.fill(ctx, "90 " + t("dir.S"), 299.25, 69.25);
      ctx.textAlign = "right"; FlashText.fill(ctx, "90 " + t("dir.N"), 523, 69.25);
      ctx.save(); ctx.translate(SLIDER.x, SLIDER.y);
      CS.drawShape(ctx, { nz: false, layers: [[[["#efefef", "M-100 -2.75L100 -2.75L100 2.75L-100 2.75L-100 -2.75Z"]],
        [[0.05, "#666666", "M-100 -2.75L100 -2.75L100 2.75L-100 2.75L-100 -2.75"]]]] });
      ctx.translate(lat / 90 * SLIDER.half, -2.2);
      CS.drawShape(ctx, GRABBER);
      ctx.restore();
      // the animate checkbox
      ctx.fillStyle = "#ffffff"; ctx.fillRect(CHECK.x + 1.5, CHECK.y + 1.5, 12, 12);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(CHECK.x + 1.5, CHECK.y + 1.5, 12, 12);
      if (animate) {
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(CHECK.x + 4, CHECK.y + 7.5); ctx.lineTo(CHECK.x + 6.5, CHECK.y + 10.5); ctx.lineTo(CHECK.x + 11, CHECK.y + 4); ctx.stroke();
      }
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 12px " + FONT; ctx.textAlign = "left";
      FlashText.fill(ctx, t("sp.animate"), CHECK.x + 19, CHECK.y + 11.6);
      // the two rules (shape 62), the date, the legend
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(292.2, 114.75); ctx.lineTo(533.2, 114.75); ctx.moveTo(292.2, 177.2); ctx.lineTo(533.2, 177.2); ctx.stroke();
      ctx.font = "bold 14px " + FONT; ctx.textAlign = "center";
      FlashText.fill(ctx, dateString(), 412.7, 137.45 + 1.0059 * 14);
      ctx.font = "bold 12px " + FONT;
      [["sp.legend1", 201.95], ["sp.legend2", 221.9], ["sp.legend3", 241.85], ["sp.legend4", 261.8]].forEach(function (l) {
        var s = t(l[0]), i = s.indexOf(" - "), left = s.slice(0, i), right = s.slice(i);
        ctx.textAlign = "right"; FlashText.fillStatic(ctx, left, 337, l[1]);     // the dashes line up, as in the SWF
        ctx.textAlign = "left"; FlashText.fillStatic(ctx, right, 337, l[1]);
      });
    });
    var GRABBER = { nz: false, layers: [[[["#cccccc", "M-3 -9.3L3 -9.3Q4.65 -9.3 5.8 -8.15Q7 -6.95 7 -5.3L7 6.7Q7 7.4 3.6 10.65L0.2 13.75Q-7 7.8 -7 6.7L-7 -5.3Q-7 -6.9 -5.85 -8.15Q-4.6 -9.3 -3 -9.3Z"]],
      [[0.05, "#666666", "M3 -9.3L-3 -9.3Q-4.6 -9.3 -5.85 -8.15Q-7 -6.9 -7 -5.3L-7 6.7Q-7 7.8 0.2 13.75L3.6 10.65Q7 7.4 7 6.7L7 -5.3Q7 -6.95 5.8 -8.15Q4.65 -9.3 3 -9.3M-2.8 4.7L2.7 4.7M-2.8 0.1L2.7 0.1M-2.8 -4.5L2.7 -4.5"]]]] };

    sph.latitude = lat;
    setDay(0);
    upd();
  }
});
