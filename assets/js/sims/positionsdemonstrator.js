/* Moon Phases and the Horizon Diagram --------------------------------------------
   Faithful rebuild of the ClassAction / NAAP "positionsdemonstrator.swf"
   (MoonPositionsDemonstratorClass over UNL's CelestialSphere engine, decompiled).
   A horizon diagram for an observer at a chosen latitude, with eight numbered
   positions around the celestial equator. Put the Sun at one of them to set the
   time of day, and the Moon at another to set its phase.

   Sun and Moon both sit at right ascension 6 − 3·(position − 1) hours on the
   equator (positions 1–8), the phase angle is 15·(RA_sun − RA_moon) + 180, and
   the clock reads 6 am + 3 hours per position — all as in the original, which
   also lets you drag either disc along the equator and eases it onto the
   nearest position when you let go.                                           */
Sim.create({
  id: "positionsdemonstrator",
  width: 560, height: 440,
  strings: {
    en: {
      "pd.general": "General", "pd.sun": "Sun", "pd.moon": "Moon",
      "pd.lat": "latitude", "pd.sunPos": "sun position", "pd.moonPos": "moon position",
      "pd.showSun": "show sun", "pd.showMoon": "show moon", "pd.showPhase": "show phase",
      "pd.onDisc": "show phase on the moon disc", "pd.labels": "show position labels",
      "pd.band": "show ecliptic band", "pd.time": "show time",
      "pd.rTime": "time of day", "pd.rPhase": "phase of moon", "pd.rSunAlt": "sun's altitude",
      "pd.rMoonAlt": "moon's altitude", "pd.diagram": "Horizon Diagram", "pd.view": "Viewing angle",
      "pd.hint": "Drag the diagram to swing the viewpoint, or grab the Sun or the Moon and slide it along the equator. The stick figure stands at the centre of the horizon.",
      "pd.new": "New Moon", "pd.wxc": "Waxing Crescent", "pd.fq": "First Quarter", "pd.wxg": "Waxing Gibbous",
      "pd.full": "Full Moon", "pd.wng": "Waning Gibbous", "pd.tq": "Third Quarter", "pd.wnc": "Waning Crescent",
      "pd.N": "N", "pd.E": "E", "pd.S": "S", "pd.W": "W", "pd.up": "up", "pd.down": "below the horizon"
    },
    id: {
      "pd.general": "Umum", "pd.sun": "Matahari", "pd.moon": "Bulan",
      "pd.lat": "lintang", "pd.sunPos": "posisi matahari", "pd.moonPos": "posisi bulan",
      "pd.showSun": "tampilkan matahari", "pd.showMoon": "tampilkan bulan", "pd.showPhase": "tampilkan fase",
      "pd.onDisc": "tampilkan fase pada cakram bulan", "pd.labels": "tampilkan label posisi",
      "pd.band": "tampilkan sabuk ekliptika", "pd.time": "tampilkan waktu",
      "pd.rTime": "waktu setempat", "pd.rPhase": "fase bulan", "pd.rSunAlt": "ketinggian matahari",
      "pd.rMoonAlt": "ketinggian bulan", "pd.diagram": "Diagram Horizon", "pd.view": "Sudut pandang",
      "pd.hint": "Seret diagram untuk mengubah arah pandang, atau pegang Matahari atau Bulan lalu geser di sepanjang ekuator. Sosok tongkat berdiri di pusat ufuk.",
      "pd.new": "Bulan Baru", "pd.wxc": "Sabit Awal", "pd.fq": "Kuartal Pertama", "pd.wxg": "Cembung Awal",
      "pd.full": "Purnama", "pd.wng": "Cembung Akhir", "pd.tq": "Kuartal Ketiga", "pd.wnc": "Sabit Akhir",
      "pd.N": "U", "pd.E": "T", "pd.S": "S", "pd.W": "B", "pd.up": "di atas ufuk", "pd.down": "di bawah ufuk"
    }
  },
  about: {
    en: "<p>The horizon diagram is the bridge between the two pictures of the sky. The green plane is your horizon, the stick figure is you, and the great circle tilted across the sphere is the celestial equator — tilted by exactly your latitude, which is why the Sun climbs higher from the tropics than from Alaska.</p>" +
        "<p>Put the Sun at a position and you have set the <strong>time of day</strong>: the Sun on your meridian is noon, on the eastern horizon is sunrise, below the horizon is night. Put the Moon at another position and the angle between them fixes its <strong>phase</strong> — 180° apart is full, together is new, a quarter turn apart is a quarter moon.</p>" +
        "<p>Read the two together and the whole lunar timetable falls out. A first-quarter moon is 90° east of the Sun, so it rises around noon and sets around midnight. A full moon rises as the Sun sets. A waning crescent only clears the horizon in the small hours before dawn — which is why most people have never knowingly seen one.</p>",
    id: "<p>Diagram horizon adalah jembatan antara dua gambaran langit. Bidang hijau adalah ufuk Anda, sosok tongkat adalah Anda, dan lingkaran besar yang miring melintasi bola adalah ekuator langit — kemiringannya persis sebesar lintang Anda, sebabnya Matahari naik lebih tinggi di daerah tropis daripada di Alaska.</p>" +
        "<p>Tempatkan Matahari pada sebuah posisi dan Anda telah menetapkan <strong>waktu setempat</strong>: Matahari di meridian berarti tengah hari, di ufuk timur berarti terbit, di bawah ufuk berarti malam. Tempatkan Bulan pada posisi lain dan sudut antara keduanya menetapkan <strong>fasenya</strong> — berseberangan 180° berarti purnama, berimpit berarti bulan baru, terpisah seperempat putaran berarti kuartal.</p>" +
        "<p>Baca keduanya bersama dan seluruh jadwal Bulan terungkap. Bulan kuartal pertama berada 90° di timur Matahari, jadi ia terbit sekitar tengah hari dan terbenam sekitar tengah malam. Purnama terbit saat Matahari terbenam. Sabit akhir baru muncul di atas ufuk menjelang fajar — sebabnya kebanyakan orang tak pernah sadar pernah melihatnya.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var OY = -25;
    var PANEL = { x: 7, y: 32 + OY, w: 411, h: 426 };
    var C = { x: 213, y: 253 + OY }, R = 160;              // sphereMC, size 320
    var SIDE = { x: 432, y: PANEL.y, w: 121, h: 150 };     // the phase disc panel
    var DISC = { x: SIDE.x + SIDE.w / 2, y: SIDE.y + 62, r: 30 };
    var PHASE_KEYS = ["pd.new", "pd.wxc", "pd.fq", "pd.wxg", "pd.full", "pd.wng", "pd.tq", "pd.wnc"];

    var lat = 41, sunPos = 4, moonPos = 2;
    var showSun = true, showMoon = true, showPhase = true, onDisc = false;
    var showLabels = false, showBand = false, showTime = true;
    var drag = null, hover = null;

    S.group("pd.general");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "pd.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.slider({
      labelKey: "pd.lat", min: -90, max: 90, value: lat, step: 0.5,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { lat = v; upd(); }
    });
    S.toggle({ labelKey: "pd.labels", value: false, on: function (v) { showLabels = v; upd(); } });
    S.toggle({ labelKey: "pd.band", value: false, on: function (v) { showBand = v; upd(); } });
    S.group("pd.sun");
    S.toggle({ labelKey: "pd.showSun", value: true, on: function (v) { showSun = v; upd(); } });
    var sunCtl = positionSlider("pd.sunPos", sunPos, function (v) { sunPos = v; });
    S.toggle({ labelKey: "pd.time", value: true, on: function (v) { showTime = v; upd(); } });
    S.group("pd.moon");
    S.toggle({ labelKey: "pd.showMoon", value: true, on: function (v) { showMoon = v; upd(); } });
    var moonCtl = positionSlider("pd.moonPos", moonPos, function (v) { moonPos = v; });
    S.toggle({ labelKey: "pd.showPhase", value: true, on: function (v) { showPhase = v; S.requestDraw(); } });
    S.toggle({ labelKey: "pd.onDisc", value: false, on: function (v) { onDisc = v; S.requestDraw(); } });
    var outTime = S.readout({ labelKey: "pd.rTime" });
    var outPhase = S.readout({ labelKey: "pd.rPhase" });
    var outSunAlt = S.readout({ labelKey: "pd.rSunAlt" });
    var outMoonAlt = S.readout({ labelKey: "pd.rMoonAlt" });

    // The SWF's hackSlider: the eight positions are continuous (0.51–8.49) while
    // dragged, shown rounded, and eased onto the nearest whole position (200 ms)
    // when let go. The arrow keys step by one and wrap from 8 back to 1.
    function positionSlider(key, value, set) {
      var ctl = S.slider({
        labelKey: key, min: 0.51, max: 8.49, value: value, step: 0.01,
        format: function (v) { return String(Math.round(v)); },
        on: function (v) { set(v); upd(); }
      });
      ctl.tween = 0;
      ctl.input.addEventListener("input", function () { ctl.tween++; });
      ctl.input.addEventListener("change", function () { settle(ctl); });
      ctl.input.addEventListener("keydown", function (ev) {
        var d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[ev.key];
        if (!d) return;
        ev.preventDefault();
        var v = Math.round(ctl.value()) + d;
        ctl.tween++;
        ctl.set(v < 1 ? 8 : v > 8 ? 1 : v);
      });
      return ctl;
    }
    function settle(ctl, from) {
      if (from === undefined) from = ctl.value();
      var to = Math.round(from), id = ++ctl.tween, t0 = performance.now();
      to = to < 1 ? to + 8 : to > 8 ? to - 8 : to;
      if (Math.abs(from - to) > 4) from += from > to ? -8 : 8;   // ease the short way round
      (function step(now) {
        if (id !== ctl.tween) return;
        var k = Math.min(1, (now - t0) / 200);
        ctl.set(k >= 1 ? to : from + (to - from) * Math.pow(k, 0.3));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }

    /* ---- the CelestialSphere, set up as MoonPositionsDemonstratorClass.init does ---- */
    var CS = window.CelestialSphere, sph = new CS({ x: C.x, y: C.y });
    sph.siderealTime = 0;
    sph.viewerAzimuth = 200;
    sph.latitude = lat;
    sph.size = 320;
    sph.minViewerAltitude = 7;
    sph.addHorizonPlaneClip(CS.directionLabels(function () {
      return { N: I18N.t("pd.N"), S: I18N.t("pd.S"), E: I18N.t("pd.E"), W: I18N.t("pd.W") };
    }), "aboveLabels", "above");
    sph.addHorizonPlaneClip(CS.GradientDisk, "horizonShade", "above", 5,
      { outerColor: 0, outerAlpha: 0, innerColor: 0, innerAlpha: 0 });
    sph.addObject("stickfigure", CS.art.stickfigurePositions, { system: "horizon", x: 0, y: 0, z: 0.0001 });
    sph.stickfigure.setOrientationType("absolute", { system: "horizon", x: -1, y: 0, z: 0 }, { system: "horizon", x: 0, y: 0, z: 1 });
    sph.addObject("shadow", shadowGlyph, { system: "horizon", x: 0, y: 0, z: 0 });
    sph.shadow.setOrientationType("absolute", { system: "horizon", x: 0, y: 0, z: 1 }, { system: "horizon", x: 1, y: 0, z: 0 });
    sph.addCircle("meridian1", { alpha: 70, color: 0xe0e0e0, thickness: 1 }, { tilt: 90, ra: 0, dec: 0 });
    sph.addCircle("meridian2", { alpha: 70, color: 0xe0e0e0, thickness: 1 }, { tilt: 90, ra: 90, dec: 0 });
    sph.addCircle("celestialEquator", { alpha: 100, color: 0xe8d898, thickness: 2 }, { tilt: 0, ra: 0, dec: 0 });
    sph.addLine("ncpAxis", { alpha: 100, color: 0x2174fe, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: 1 }, { system: "celestial", x: 0, y: 0, z: 1.2 });
    sph.addLine("scpAxis", { alpha: 100, color: 0x2174fe, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: -1 }, { system: "celestial", x: 0, y: 0, z: -1.2 });
    sph.addObject("moon", moonGlyph, { dec: 0, ra: 0 });
    sph.addObject("sun", sunGlyph, { r: 1.00001, dec: 0, ra: 4 });
    for (var i = 1; i <= 8; i++) {
      sph.addObject("dot" + i, dotGlyph, { r: 1.00005, dec: 0, ra: 9 - i * 3 });
      sph["dot" + i].setOrientationType("absolute");
    }
    for (i = 1; i <= 8; i++) {
      sph.addObject("label" + i, labelGlyph, { r: 1, dec: 12, ra: 9 - i * 3 }, { labelText: i });
      sph["label" + i].setOrientationType("absolute");
    }
    sph.addShadedBand(bandDisc, bandDisc, "eclipticBand", { dec2: 30, dec1: -30 }, "inner", "full");
    sph.eclipticBand.setBorderStyle(1, 0xb0b0b0, 50);
    sph.eclipticBand.showBorder = true;

    function sunRa() { return -3 * (sunPos - 1) + 6; }
    function moonRa() { return -3 * (moonPos - 1) + 6; }
    function phaseAngle() { return 15 * (sunRa() - moonRa()) + 180; }
    function phaseKey() {                                  // the SWF's own thresholds, 12° and 5°
      var r = (((180 - phaseAngle()) % 360) + 360) % 360;
      if (r <= 12) return PHASE_KEYS[0];
      if (r <= 85) return PHASE_KEYS[1];
      if (r <= 95) return PHASE_KEYS[2];
      if (r <= 168) return PHASE_KEYS[3];
      if (r <= 192) return PHASE_KEYS[4];
      if (r <= 265) return PHASE_KEYS[5];
      if (r <= 275) return PHASE_KEYS[6];
      if (r <= 348) return PHASE_KEYS[7];
      return PHASE_KEYS[0];
    }
    function timeString() {
      var h = (((6 + 3 * (sunPos - 1)) % 24) + 24) % 24, suffix = h < 12 ? "AM" : "PM";
      if (h >= 12) h -= 12;
      var hh = Math.floor(h), mm = Math.floor(60 * (h - hh));
      if (hh === 0) hh = 12;
      return hh + ":" + (mm < 10 ? "0" : "") + mm + " " + suffix;
    }
    // onSunPositionChanged / onMoonPositionChanged / updateShadow / onLatitudeChanged …
    function upd() {
      sph.latitude = lat;
      sph.sun.setPosition({ r: 1.00001, dec: 0, ra: sunRa() });
      sph.sun.setOrientationType("absolute");
      sph.sun.visible = showSun;
      sph.moon.setPosition({ dec: 0, ra: moonRa() });
      var mp = sph.moon.getPosition();                    // the Moon faces the sphere's centre
      sph.moon.setOrientationType("absolute", { system: "celestial", x: -mp.x, y: -mp.y, z: -mp.z }, { dec: 90, ra: 0 });
      sph.moon.visible = showMoon;
      for (var i = 1; i <= 8; i++) { sph["dot" + i].visible = showLabels; sph["label" + i].visible = showLabels; }
      sph.eclipticBand.visible = showBand;
      var sunH = sph.sun.getPositionHorizon();
      if (showSun) {
        shadowSource = sunH;
        var dark = Math.min(40, 40 * Math.pow(1 - sunH.alt / 90, 4));
        sph.horizonShade.outerAlpha = sph.horizonShade.innerAlpha = dark;
      } else {
        shadowSource = { az: 0, alt: -10 };
        sph.horizonShade.outerAlpha = sph.horizonShade.innerAlpha = 0;
      }
      outTime(showTime ? timeString() : "–");
      outPhase(I18N.t(phaseKey()));
      var sa = sunH.alt, ma = sph.moon.getPositionHorizon().alt;
      outSunAlt(showSun ? sa.toFixed(0) + "° " + I18N.t(sa >= 0 ? "pd.up" : "pd.down") : "–");
      outMoonAlt(showMoon ? ma.toFixed(0) + "° " + I18N.t(ma >= 0 ? "pd.up" : "pd.down") : "–");
      S.requestDraw();
    }
    var shadowSource = { az: 0, alt: -10 };
    S.refreshers.push(upd);

    /* ---- pointer: the Sun and Moon Discs take the press when they face us; else the sphere ---- */
    function at(ev) { return CS.canvasPoint(S.canvas, ev, S.W, S.H); }
    function overDisc(o, p) {                                // the disc's own shape, radius 12
      if (!o.visible || !o.shown) return false;
      var q = o.toLocal(p.x, p.y);
      return q.x * q.x + q.y * q.y <= 12.5 * 12.5;
    }
    function discAt(p) {                                   // the top-most disc under the pointer
      var list = [sph.sun, sph.moon].filter(function (o) { return overDisc(o, p); });
      list.sort(function (a, b) { return b._sp.z - a._sp.z; });
      return list[0] || null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), o = discAt(p);
      if (o) {                                             // a disc round the back swallows the press
        if (o.screen.z > 0) {
          var ctl = o === sph.sun ? sunCtl : moonCtl;
          ctl.tween++;
          drag = { body: o === sph.sun ? "sun" : "moon", ctl: ctl, offset: sph.screenToCelestial(p.x, p.y).ra - o.ra };
        }
      } else if (sph.startDrag(p.x, p.y)) drag = { sphere: true };
      if (drag) try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) {
        var o = discAt(p), h = o && o.screen.z > 0 ? (o === sph.sun ? "sun" : "moon") : null;
        if (h !== hover) { hover = h; S.requestDraw(); }
        return;
      }
      if (drag.body) {                                     // Sun/Moon Disc onMouseMoveFunc
        var v = 1 + (sph.screenToCelestial(p.x, p.y).ra - drag.offset - 6) / -3;
        drag.ctl.set(0.5 + ((((v - 0.5) % 8) + 8) % 8));
        return;
      }
      sph.dragTo(p.x, p.y);
      upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () {
        if (drag && drag.body) settle(drag.ctl, drag.body === "sun" ? sunPos : moonPos);
        sph.endDrag();
        drag = null;
      });
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (hover) { hover = null; S.requestDraw(); }
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      FlashText.begin(ctx);
      S.clear();
      ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, S.W, S.H);
      panel(ctx, PANEL, t("pd.diagram"));
      ctx.save();
      ctx.beginPath(); ctx.rect(PANEL.x + 1, PANEL.y + 1, PANEL.w - 2, PANEL.h - 2); ctx.clip();
      sph.draw(ctx);
      ctx.restore();
      if (showPhase) phasePanel(ctx, t);
    });

    function panel(ctx, b, title) {                        // Panel Background, 12 px black title
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, title, b.x + 5, b.y + 4 + 1.0059 * 12);      // a field at (xMargin, 4): baseline = top + 2 + ascent
      ctx.strokeStyle = "#cccccc"; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(b.x + 10 + FlashText.textWidth(ctx, title), b.y + 13.25);   // 2·xMargin + tmc.textWidth; 13.25 down for a 12 px title
      ctx.lineTo(b.x + b.w - 5, b.y + 13.25); ctx.stroke();
      ctx.lineCap = "butt";
    }
    function hairline(o) {                                 // lineStyle(0): one stage pixel whatever the clip's scale
      var m = o.matrix();
      return 1 / Math.max(Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])), 0.2);
    }

    /* the objects' own art, each in its clip's coordinates */
    function dotGlyph(ctx) {                               // Position Dot: a red plus, 2 px
      ctx.strokeStyle = "#d11818"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.moveTo(0, -3); ctx.lineTo(0, 3);
      ctx.stroke();
    }
    function labelGlyph(ctx, o) {                          // Position Label: bold 16 px, #d11818
      ctx.fillStyle = "#d11818"; ctx.font = "bold 16px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      FlashText.fill(ctx, String(o.labelText), 0, 1.5);
    }
    function sunGlyph(ctx) {                               // Sun Disc: shape 88 + ring 89 (90 on hover)
      var g = ctx.createRadialGradient(0, 0.05, 0, 0, 0.05, 13.6);
      g.addColorStop(0, "#ffcc00"); g.addColorStop(1, "#edb101");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
      ctx.strokeStyle = hover === "sun" ? "#000000" : "#999999"; ctx.lineWidth = 1;
      ctx.stroke();
    }
    function moonGlyph(ctx, o) {                           // Moon Disc: faces the sphere's centre
      if (onDisc) {
        ctx.fillStyle = "#d0d0d0";
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
        shade(ctx, 0, 0, 12, phaseAngle() * RAD, "#909090");
      } else {
        ctx.fillStyle = "#a8a8a8";
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = hover === "moon" ? "#000000" : "#808080";
      ctx.lineWidth = hairline(o);
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.stroke();
    }
    // Band Disc (shape 86): a radial #9ad1fa α77 → #1c2c44 α102, centred (31, −34), radius 146.9
    function bandDisc(ctx) {
      var g = ctx.createRadialGradient(31, -34, 0, 31, -34, 146.9);
      g.addColorStop(0, "rgba(154,209,250," + 77 / 255 + ")"); g.addColorStop(1, "rgba(28,44,68," + 102 / 255 + ")");
      ctx.fillStyle = g;
      ctx.fillRect(-100, -100, 200, 200);
    }
    // ShadowMaker with its Stickfigure Shadow, masked by the Shadow Mask (a 160 px disc in the plane)
    function shadowGlyph(ctx) {
      var sm = CS.shadowMatrix(shadowSource);
      if (!sm) return;
      var spec = CS.art.shapes.stickfigureShadowPositions;
      CS.groupAlpha(ctx, sm.alpha, function (g) {
        g.beginPath(); g.arc(0, 0, 160, 0, TAU); g.clip();
        g.transform(sm.m[0], sm.m[1], sm.m[2], sm.m[3], 0, 0);
        CS.drawShape(g, spec);
      }, CS.shadowBounds(sm, spec, 160));
    }

    function phasePanel(ctx, t) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(SIDE.x, SIDE.y, SIDE.w, SIDE.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(SIDE.x + 0.5, SIDE.y + 0.5, SIDE.w - 1, SIDE.h - 1);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      FlashText.fill(ctx, t("pd.moon"), DISC.x, SIDE.y + 6);
      ctx.fillStyle = "#d0d0d0";                           // drawPhaseDisc radius 30
      ctx.beginPath(); ctx.arc(DISC.x, DISC.y, DISC.r, 0, TAU); ctx.fill();
      shade(ctx, DISC.x, DISC.y, DISC.r, phaseAngle() * RAD, "#909090");
      ctx.strokeStyle = "#909090"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(DISC.x, DISC.y, DISC.r, 0, TAU); ctx.stroke();
      ctx.fillStyle = "#000000"; ctx.font = "11px " + FONT;
      FlashText.fill(ctx, t(phaseKey()), DISC.x, DISC.y + DISC.r + 8);
      if (showTime) {
        ctx.font = "12px " + FONT;
        FlashText.fill(ctx, timeString(), DISC.x, DISC.y + DISC.r + 28);
      }
    }
    // the dark half of a phase: angle 0 = fully lit, π = fully dark
    function shade(ctx, cx, cy, r, angle, colour) {
      angle = ((angle % TAU) + TAU) % TAU;
      var sign = angle < Math.PI ? -1 : 1, s = r * Math.cos(angle);
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, sign < 0);
      ctx.ellipse(cx, cy, Math.abs(s), r, 0, Math.PI / 2, -Math.PI / 2, sign * s > 0);
      ctx.fill();
    }

    upd();
  }
});
