/* Sidereal Time and Hour Angle Demonstrator ---------------------------------------
   Faithful rebuild of ClassAction's "siderealTimeAndHourAngleDemo.swf" — one SWF,
   two catalogue entries (Coordinates and Motions, and the 200 Level module).

   A celestial sphere sitting inside the observer's horizon. The sphere's tilt is
   the observer's latitude and its rotation is the local sidereal time, which is
   defined as the right ascension currently on the meridian. The hour angle of a
   star is then simply how far west of the meridian it has got:

       H = sidereal time - right ascension

   The horizon diagram is the shared CelestialSphere (_celestialsphere.js), set up
   as the SWF's HourAngleDemoClass.init does: a 320 px sphere seen from azimuth
   160 / altitude 35 (never below 7), the stick figure (95 %), the SWF's "sphere
   outside" shadings, the celestial equator and half the 0h circle in 0xFFE375 at
   70 %, the polar axis and the observer's meridian (NCP over the zenith to the
   SCP) in 0x75A9FF, two faint meridians at 10 %, the star's hour circle and
   declination circle at 30 %, and the measured arcs — right ascension in white,
   declination in 0xFF4040, hour angle in 0xFFCB65 — with their CS Labels. It
   resets to latitude 41, sidereal time 2h and a star at RA 4h, dec 30. Drag the
   star to move it, or the sphere to turn it.                                    */
Sim.create({
  id: "siderealtimeandhourangledemo",
  width: 440, height: 520,
  strings: {
    en: {
      "ha.obs": "Observer properties", "ha.lat": "latitude", "ha.st": "sidereal time",
      "ha.star": "Star properties", "ha.ra": "right ascension", "ha.dec": "declination",
      "ha.opt": "Options", "ha.arc": "show hour angle arc", "ha.reset": "Reset",
      "ha.rHA": "hour angle", "ha.rAlt": "altitude", "ha.rAz": "azimuth",
      "ha.rWhen": "position",
      "ha.up": "above the horizon", "ha.down": "below the horizon",
      "ha.east": "east of the meridian", "ha.west": "west of the meridian",
      "ha.onMer": "on the meridian",
      "ha.hint": "You can also change the star's position by dragging it. Drag anywhere else on the sphere to swing the viewpoint round.",
      "ha.N": "N", "ha.E": "E", "ha.S": "S", "ha.W": "W",
      "ha.h": "h", "ha.haLabel": "hour angle", "ha.formula": "Hour Angle  =  Sidereal Time  −  Right Ascension"
    },
    id: {
      "ha.obs": "Sifat pengamat", "ha.lat": "lintang", "ha.st": "waktu sideris",
      "ha.star": "Sifat bintang", "ha.ra": "asensiorekta", "ha.dec": "deklinasi",
      "ha.opt": "Pilihan", "ha.arc": "tampilkan busur sudut jam", "ha.reset": "Atur ulang",
      "ha.rHA": "sudut jam", "ha.rAlt": "altitud", "ha.rAz": "azimut",
      "ha.rWhen": "kedudukan",
      "ha.up": "di atas cakrawala", "ha.down": "di bawah cakrawala",
      "ha.east": "timur meridian", "ha.west": "barat meridian",
      "ha.onMer": "di meridian",
      "ha.hint": "Kedudukan bintang juga dapat diubah dengan menyeretnya. Seret di bagian lain bola untuk memutar sudut pandang.",
      "ha.N": "U", "ha.E": "T", "ha.S": "S", "ha.W": "B",
      "ha.h": "j", "ha.haLabel": "sudut jam", "ha.formula": "Sudut Jam  =  Waktu Sideris  −  Asensiorekta"
    }
  },
  about: {
    en: "<p>Sidereal time is a clock set by the stars rather than the Sun, and it has a neat definition: the local sidereal time is the right ascension that is crossing your meridian right now. At sidereal 2h, the stars at RA 2h are due south of you (or due north, from the southern hemisphere).</p>" +
        "<p>That makes the hour angle easy. Subtract a star's right ascension from the sidereal time and you get how long ago it crossed the meridian — a positive hour angle means it is west of the meridian and setting, a negative one means it is still rising in the east, and zero means it is transiting, at its highest for the day.</p>" +
        "<p>Latitude tilts the whole sphere. At the pole the celestial equator lies along the horizon and nothing ever rises or sets; at the equator the poles sit on the horizon and every star is up for exactly twelve hours. In between, a star is above the horizon for longer the closer its declination is to your own latitude's sign.</p>",
    id: "<p>Waktu sideris adalah jam yang diatur oleh bintang, bukan oleh Matahari, dan definisinya rapi: waktu sideris setempat adalah asensiorekta yang sedang melintasi meridian Anda saat itu. Pada sideris 2j, bintang-bintang dengan AR 2j berada tepat di selatan Anda (atau tepat di utara, dari belahan selatan).</p>" +
        "<p>Itu membuat sudut jam menjadi mudah. Kurangkan asensiorekta sebuah bintang dari waktu sideris dan Anda memperoleh berapa lama sejak ia melintasi meridian — sudut jam positif berarti ia di barat meridian dan sedang terbenam, negatif berarti ia masih terbit di timur, dan nol berarti ia sedang transit, pada titik tertingginya hari itu.</p>" +
        "<p>Lintang memiringkan seluruh bola. Di kutub, ekuator langit berimpit dengan cakrawala dan tidak ada yang pernah terbit atau terbenam; di khatulistiwa, kutub-kutub berada di cakrawala dan setiap bintang berada di atas tepat dua belas jam. Di antaranya, sebuah bintang lebih lama berada di atas cakrawala bila deklinasinya makin sesuai tanda lintang Anda.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var OY = -30;                                   // the SWF's title bar is the page header here
    var PANEL = { x: 7, y: 37 + OY, w: 426, h: 426 };   // the black panel behind the sphere
    var INFO = { x: 0, y: 440, w: 440, h: 80 };
    var RA_COLOR = 0xffffff, DEC_COLOR = 0xff4040, HA_COLOR = 0xffcb65;   // HourAngleDemoClass
    var showArc = false, ra = 4, dec = 30;

    /* ---- the CelestialSphere, as HourAngleDemoClass.init sets it up ---- */
    var CS = window.CelestialSphere, sph = new CS({ x: 220, y: 250 + OY });
    sph.size = 320;
    sph.minViewerAltitude = 7;
    sph.addHorizonPlaneClip(CS.directionLabels(function () {
      return { N: I18N.t("ha.N"), S: I18N.t("ha.S"), E: I18N.t("ha.E"), W: I18N.t("ha.W") };
    }), "aboveLabels", "above");
    var DISC = "M70.7 -70.7Q100 -41.4 100 0Q100 41.4 70.7 70.7Q41.4 100 0 100Q-41.4 100 -70.7 70.7Q-100 41.4 -100 0" +
      "Q-100 -41.4 -70.7 -70.7Q-41.4 -100 0 -100Q41.4 -100 70.7 -70.7Z";
    // "sphere outside" (shape 80) and "sphere outside2" (shape 78)
    sph.addShadingClip(CS.shapeDrawer({ nz: false, layers: [[[[{ t: "r", m: [0.17511, 0, 0, 0.17511, 35, -25],
      s: [[0, "rgba(170,170,170,0.451)"], [1, "rgba(170,170,170,0.153)"]] }, DISC]], []]] }), "outsideOfSphere", "front", "inner", "both");
    sph.addShadingClip(CS.shapeDrawer({ nz: false, layers: [[[[{ t: "r", m: [0.17511, 0, 0, 0.17511, 35, -25],
      s: [[0, "rgba(0,0,0,0.251)"], [1, "rgba(0,0,0,0.082)"]] }, DISC]], []]] }), "outsideOfSphere2", "front", "outer", "below");
    sph.addObject("stickfigure", CS.art.stickfigure, { system: "horizon", x: 0, y: 0, z: 0 }, { _yscale: 95, _xscale: 95 });
    sph.stickfigure.setOrientationType("absolute", { system: "horizon", x: -1, y: 0, z: 0 }, { system: "horizon", x: 0, y: 0, z: 1 });
    sph.addObject("raLabel", CS.art.csLabel, { dec: 0, ra: 0 }, { labelColor: RA_COLOR });
    sph.addObject("decLabel", CS.art.csLabel, { dec: 0, ra: 0 }, { labelColor: DEC_COLOR });
    sph.addObject("hourAngleLabel", CS.art.csLabel, { dec: 0, ra: 0 }, { labelColor: HA_COLOR });
    sph.addObject("star", function (ctx, o) { CS.art.star(ctx, o.hot); }, { dec: 0, ra: 0 });
    sph.addLine("ncpAxis", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: 1 }, { system: "celestial", x: 0, y: 0, z: 1.2 });
    sph.addLine("scpAxis", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: -1 }, { system: "celestial", x: 0, y: 0, z: -1.2 });
    sph.addCircle("observerMeridian", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { gammaEnd: 180, gammaStart: 0, tilt: 90, alt: 0, az: 0 });
    sph.addCircle("meridian1", { alpha: 10, color: 0xffffff, thickness: 1 }, { tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("meridian2", { alpha: 10, color: 0xffffff, thickness: 1 }, { tilt: 90, dec: 0, ra: 6 });
    sph.addCircle("zeroHoursCircle", { alpha: 70, color: 0xffe375, thickness: 1 }, { gammaEnd: 90, gammaStart: -90, tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("celestialEquator", { alpha: 70, color: 0xffe375, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("raCircle", { alpha: 30, color: 0xffffff, thickness: 1 }, { tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("decCircle", { alpha: 30, color: 0xffffff, thickness: 1 }, { tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("raArc", { alpha: 100, color: RA_COLOR, thickness: 3 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("decArc", { alpha: 100, color: DEC_COLOR, thickness: 3 }, { tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("hourAngleArc", { alpha: 100, color: HA_COLOR, thickness: 3 }, { dec: 0, ra: 0 });

    function st() { return stCtl.value(); }
    function lat() { return latCtl.value(); }
    /* setStarLocation: the star, its two arcs and their labels */
    function setStarLocation(pt) {
      ra = pt.ra; dec = pt.dec;
      sph.raLabel.labelText = pt.ra.toFixed(1) + I18N.t("ha.h");
      sph.raLabel.setPosition({ r: 1.001, dec: 5, ra: pt.ra - 0.9 });
      sph.raLabel.setOrientationType("absolute");
      sph.decLabel.labelText = pt.dec.toFixed(1) + "°";
      sph.decLabel.setPosition({ r: 1.001, dec: pt.dec / 2, ra: pt.ra + 0.9 });
      sph.decLabel.setOrientationType("absolute");
      sph.star.setPosition(pt);
      sph.star.setOrientationType("absolute");
      if (pt.ra !== 0) { sph.raArc.setParameters({ gammaEnd: 15 * pt.ra, gammaStart: 0, tilt: 0, dec: 0, ra: 0 }); sph.raArc.visible = true; }
      else sph.raArc.visible = false;
      sph.raCircle.setParameters({ gammaEnd: 90, gammaStart: -90, tilt: 90, dec: 0, ra: pt.ra });
      if (pt.dec < 0) { sph.decArc.setParameters({ gammaEnd: 0, gammaStart: pt.dec, tilt: 90, dec: 0, ra: pt.ra }); sph.decArc.visible = true; }
      else if (pt.dec > 0) { sph.decArc.setParameters({ gammaEnd: pt.dec, gammaStart: 0, tilt: 90, dec: 0, ra: pt.ra }); sph.decArc.visible = true; }
      else sph.decArc.visible = false;
      sph.decCircle.setParameters({ tilt: 0, dec: pt.dec, ra: 0 });
      updateHourAngle();
    }
    function hourAngle() {
      var h = ((st() - ra) + 24) % 24;
      return h > 12 ? h - 24 : h;
    }
    function updateHourAngle() {
      var h = hourAngle(), s = st();
      if (showArc) {
        sph.hourAngleLabel.visible = true;
        sph.hourAngleLabel.labelText = h.toFixed(1) + I18N.t("ha.h");
        sph.hourAngleLabel.setPosition({ dec: dec + 5, ra: s - h / 2 });
        sph.hourAngleLabel.setOrientationType("absolute");
        if (h < 0) { sph.hourAngleArc.setParameters({ gammaEnd: 360 - 15 * h, gammaStart: 0, tilt: 0, dec: dec, ra: s }); sph.hourAngleArc.visible = true; }
        else if (h > 0) { sph.hourAngleArc.setParameters({ gammaEnd: 0, gammaStart: -15 * h, tilt: 0, dec: dec, ra: s }); sph.hourAngleArc.visible = true; }
        else sph.hourAngleArc.visible = false;
      } else {
        sph.hourAngleLabel.visible = false;
        sph.hourAngleArc.visible = false;
      }
      S.requestDraw();
    }
    function onLatitudeChanged() {
      sph.observerMeridian.gammaStart = lat();
      sph.observerMeridian.gammaEnd = sph.observerMeridian.gammaStart + 180;
      sph.latitude = lat();
    }
    function onSiderealTimeChanged() { sph.siderealTime = st(); updateHourAngle(); }

    /* ------------------------------------------------------------- controls */
    var syncing = false;
    S.group("ha.obs");
    var stCtl = S.slider({ labelKey: "ha.st", min: 0, max: 23.99, value: 2, step: 0.01,
      format: function (v) { return v.toFixed(2) + " h"; },
      on: function () { if (!syncing) onSiderealTimeChanged(); } });
    var latCtl = S.slider({ labelKey: "ha.lat", min: -90, max: 90, value: 41, step: 0.1,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function () { if (!syncing) { onLatitudeChanged(); S.requestDraw(); } } });
    S.group("ha.star");
    var raCtl = S.slider({ labelKey: "ha.ra", min: 0, max: 23.99, value: 4, step: 0.01,
      format: function (v) { return v.toFixed(2) + " h"; },
      on: function (v) { if (!syncing) setStarLocation({ dec: decCtl.value(), ra: v }); } });
    var decCtl = S.slider({ labelKey: "ha.dec", min: -90, max: 90, value: 30, step: 0.1,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { if (!syncing) setStarLocation({ dec: v, ra: raCtl.value() }); } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ha.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.group("ha.opt");
    var arcCtl = S.toggle({ labelKey: "ha.arc", value: false,
      on: function (v) { showArc = v; updateHourAngle(); } });
    S.button({ labelKey: "ha.reset", on: reset });
    function setSlider(ctl, v) { syncing = true; ctl.set(v); syncing = false; }
    function reset() {                              // HourAngleDemoClass.reset
      arcCtl.set(false);
      sph.viewerAzimuth = 160;
      sph.viewerAltitude = 35;
      setSlider(latCtl, 41); onLatitudeChanged();
      setSlider(stCtl, 2); onSiderealTimeChanged();
      setSlider(raCtl, 4); setSlider(decCtl, 30);
      setStarLocation({ dec: 30, ra: 4 });
    }

    var outHA = S.readout({ labelKey: "ha.rHA" });
    var outAlt = S.readout({ labelKey: "ha.rAlt" });
    var outAz = S.readout({ labelKey: "ha.rAz" });
    var outWhen = S.readout({ labelKey: "ha.rWhen" });
    /* readouts change at most once a frame, and only when their text does */
    var last = {};
    function put(key, fn, text) { if (last[key] !== text) { last[key] = text; fn(text); } }
    function readouts() {
      var H = hourAngle(), h = sph.star.getPositionHorizon();
      put("ha", outHA, H.toFixed(2) + " h");
      put("alt", outAlt, h.alt.toFixed(1) + "°");
      put("az", outAz, h.az.toFixed(1) + "°");
      put("when", outWhen, I18N.t(h.alt >= 0 ? "ha.up" : "ha.down") + ", " +
        I18N.t(Math.abs(H) < 0.005 ? "ha.onMer" : H > 0 ? "ha.west" : "ha.east"));
    }
    window.addEventListener("langchange", function () {
      last = {};
      setStarLocation({ dec: dec, ra: ra });        // the labels carry the unit letter
    });

    /* ---------------------------------------------------------- interaction */
    /* Draggable Star: a press on its near side drags it (getMouseRaDec → setStarLocation);
       anywhere else on the sphere, or on a star round the back, swings the view */
    var drag = null;
    function at(ev) { return CS.canvasPoint(S.canvas, ev, S.W, S.H); }
    function onStar(p) {
      var o = sph.star;
      if (!o.shown) return false;
      var q = o.toLocal(p.x, p.y);
      return q.x * q.x + q.y * q.y <= 10.5 * 10.5;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (onStar(p) && sph.star.screen.z > 0) drag = { kind: "star" };
      else if (sph.startDrag(p.x, p.y)) drag = { kind: "view" };
      else return;
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* no live pointer */ }
      ev.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) {
        var hot = onStar(p) && sph.star.screen.z > 0;
        if (hot !== !!sph.star.hot) { sph.star.hot = hot; S.requestDraw(); }
        return;
      }
      if (drag.kind === "star") {
        var cp = sph.getMouseRaDec(p.x, p.y);
        if (cp.ra === null) return;
        setStarLocation(cp);
        setSlider(raCtl, Math.min(23.99, cp.ra)); setSlider(decCtl, cp.dec);
      } else sph.dragTo(p.x, p.y);
      S.requestDraw();
    });
    ["pointerup", "pointercancel"].forEach(function (k2) {
      S.canvas.addEventListener(k2, function () { drag = null; sph.endDrag(); });
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (!drag && sph.star.hot) { sph.star.hot = false; S.requestDraw(); }
    });

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      FlashText.begin(ctx);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, INFO.y);
      ctx.fillStyle = "#000000"; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
      ctx.save();
      ctx.beginPath(); ctx.rect(PANEL.x, PANEL.y, PANEL.w, PANEL.h); ctx.clip();
      sph.draw(ctx);
      ctx.restore();
      info(ctx, tr);
      readouts();
    });

    /* the SWF's own readout line and its formula */
    function info(ctx, tr) {
      ctx.fillStyle = "#f2f2f2"; ctx.fillRect(INFO.x, INFO.y, INFO.w, INFO.h);
      ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(INFO.x, INFO.y + 0.5); ctx.lineTo(INFO.x + INFO.w, INFO.y + 0.5);
      ctx.stroke();
      ctx.textBaseline = "middle"; ctx.textAlign = "center";
      ctx.fillStyle = "#222222"; ctx.font = "14px " + FONT;
      ctx.fillText(tr("ha.haLabel") + ":  " + hourAngle().toFixed(2) + " h",
        INFO.x + INFO.w / 2, INFO.y + 26);
      ctx.fillStyle = "#333333"; ctx.font = "italic 13px " + FONT;
      ctx.fillText(tr("ha.formula"), INFO.x + INFO.w / 2, INFO.y + 54);
    }
    void TAU;
    reset();
  }
});
