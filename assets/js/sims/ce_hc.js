/* Rotating Sky Explorer ---------------------------------------------------------
   Faithful rebuild of the NAAP "ce_hc.swf" (sprite325's timeline plus the shared
   UNL CelestialSphere engine, both decompiled).

   Two views of one sky, side by side. On the left the celestial sphere with Earth
   turning at its centre; on the right the same sphere re-drawn for the observer,
   with the green horizon plane cutting it into the part of the sky that rises and
   sets, the part that never rises, and the part that never sets.               */
Sim.create({
  id: "ce_hc",
  width: 900, height: 500,
  strings: {
    en: {
      "rs.loc": "Observer's Location", "rs.lat": "latitude", "rs.lon": "longitude",
      "rs.anim": "Animation Controls", "rs.start": "start animation", "rs.pause": "pause animation",
      "rs.for": "animate", "rs.cont": "continuously", "rs.hour1": "for 1 hour", "rs.h3": "for 3 hours", "rs.h6": "for 6 hours",
      "rs.h12": "for 12 hours", "rs.h24": "for 24 hours", "rs.rate": "animation rate",
      "rs.look": "Appearance Settings", "rs.labels": "show labels",
      "rs.zeroh": "show 0h circle", "rs.eq": "show celestial equator",
      "rs.under": "show underside of horizon diagram",
      "rs.never": "show never rise region", "rs.riseset": "show rise and set region",
      "rs.circum": "show circumpolar region", "rs.angle": "show equator–horizon angle",
      "rs.stars": "Star Controls", "rs.add": "add star randomly", "rs.clear": "remove all stars",
      "rs.pattern": "star patterns", "rs.orion": "Orion",
      "rs.dipper": "Big Dipper", "rs.cross": "Southern Cross",
      "rs.trail": "star trails", "rs.tnone": "no trails", "rs.tshort": "short", "rs.tlong": "long",
      "rs.reset": "reset star trails",
      "rs.celestial": "celestial sphere view", "rs.horizon": "horizon diagram view",
      "rs.rTime": "elapsed", "rs.rSid": "sidereal time", "rs.rStar": "selected star",
      "rs.nostar": "none — click a star",
      "rs.hint": "Drag inside a panel to swing that view. Drag a star to move it; click it to read its coordinates. Click the map to move the observer.",
      "rs.N": "N", "rs.E": "E", "rs.S": "S", "rs.W": "W",
      "rs.ncp": "ncp", "rs.scp": "scp", "rs.ceq": "celestial equator", "rs.zh": "0h circle",
      "rs.mer": "meridian", "rs.zen": "zenith", "rs.nad": "nadir", "rs.h": "h"
    },
    id: {
      "rs.loc": "Lokasi Pengamat", "rs.lat": "lintang", "rs.lon": "bujur",
      "rs.anim": "Kendali Animasi", "rs.start": "mulai animasi", "rs.pause": "jeda animasi",
      "rs.for": "animasikan", "rs.cont": "terus-menerus", "rs.hour1": "selama 1 jam", "rs.h3": "selama 3 jam", "rs.h6": "selama 6 jam",
      "rs.h12": "selama 12 jam", "rs.h24": "selama 24 jam", "rs.rate": "laju animasi",
      "rs.look": "Pengaturan Tampilan", "rs.labels": "tampilkan label",
      "rs.zeroh": "tampilkan lingkaran 0j", "rs.eq": "tampilkan ekuator langit",
      "rs.under": "tampilkan sisi bawah diagram horizon",
      "rs.never": "tampilkan wilayah tak pernah terbit", "rs.riseset": "tampilkan wilayah terbit–terbenam",
      "rs.circum": "tampilkan wilayah sirkumpolar", "rs.angle": "tampilkan sudut ekuator–horizon",
      "rs.stars": "Kendali Bintang", "rs.add": "tambah bintang acak", "rs.clear": "hapus semua bintang",
      "rs.pattern": "pola bintang", "rs.orion": "Orion",
      "rs.dipper": "Biduk", "rs.cross": "Salib Selatan",
      "rs.trail": "jejak bintang", "rs.tnone": "tanpa jejak", "rs.tshort": "pendek", "rs.tlong": "panjang",
      "rs.reset": "atur ulang jejak",
      "rs.celestial": "tampilan bola langit", "rs.horizon": "tampilan diagram horizon",
      "rs.rTime": "waktu berlalu", "rs.rSid": "waktu sideris", "rs.rStar": "bintang terpilih",
      "rs.nostar": "belum ada — klik bintang",
      "rs.hint": "Seret di dalam panel untuk memutar tampilan. Seret bintang untuk memindahkannya; klik untuk membaca koordinatnya. Klik peta untuk memindahkan pengamat.",
      "rs.N": "U", "rs.E": "T", "rs.S": "S", "rs.W": "B",
      "rs.ncp": "klu", "rs.scp": "kls", "rs.ceq": "ekuator langit", "rs.zh": "lingkaran 0j",
      "rs.mer": "meridian", "rs.zen": "zenit", "rs.nad": "nadir", "rs.h": "j"
    }
  },
  about: {
    en: "<p>The sky appears to turn because Earth turns. Once a day every star traces a circle parallel to the celestial equator, and where that circle sits relative to your horizon decides what you see. Stars close to the visible celestial pole never set — they are circumpolar. Stars close to the other pole never rise. Everything in between rises in the east and sets in the west.</p>" +
        "<p>The boundary is set entirely by latitude. A star is circumpolar when its declination exceeds 90° − |latitude|, and it never rises when its declination is below −(90° − |latitude|). Run the animation and watch the same star in both panels: on the left it holds still against a turning Earth, on the right it sweeps across your sky.</p>" +
        "<p>The two extremes make the rule obvious. At the pole your horizon is the celestial equator, nothing rises or sets, and half the sky is permanently hidden. At the equator the celestial poles sit on your horizon, nothing is circumpolar, and over a year you can see every star in the sky.</p>",
    id: "<p>Langit tampak berputar karena Bumi yang berputar. Sekali sehari setiap bintang menyusuri lingkaran sejajar ekuator langit, dan letak lingkaran itu terhadap ufuk Anda menentukan apa yang terlihat. Bintang yang dekat kutub langit yang tampak tak pernah terbenam — bintang itu sirkumpolar. Bintang dekat kutub yang lain tak pernah terbit. Selebihnya terbit di timur dan terbenam di barat.</p>" +
        "<p>Batasnya ditentukan sepenuhnya oleh lintang. Sebuah bintang bersifat sirkumpolar bila deklinasinya melebihi 90° − |lintang|, dan tak pernah terbit bila deklinasinya di bawah −(90° − |lintang|). Jalankan animasinya lalu amati bintang yang sama pada kedua panel: di kiri ia diam terhadap Bumi yang berputar, di kanan ia melintasi langit Anda.</p>" +
        "<p>Kedua ujung ekstremnya membuat aturan ini gamblang. Di kutub, ufuk Anda berimpit dengan ekuator langit, tak ada yang terbit atau terbenam, dan separuh langit tersembunyi selamanya. Di ekuator, kutub langit berada tepat di ufuk, tak ada yang sirkumpolar, dan sepanjang tahun Anda dapat melihat seluruh bintang di langit.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var R = 175;                                          // sphere1.size = sphere2.size = 350
    var P1 = { x: 10, y: 38, w: 433, h: 449 }, P2 = { x: 456.5, y: 38, w: 433, h: 449 };
    var C1 = { x: 226.7, y: 262 }, C2 = { x: 673.3, y: 262 };
    var MAPW = 480, MAPH = 240;                           // the map canvas, 2:1 — one
                                                          // degree of longitude and one
                                                          // of latitude are the same size

    /* ---- state, at onReset()'s values ---- */
    var time = 0, rate = 0.05;                            // days, and days per second
    var obsLat = 40.8, obsLon = -96.7;                    // setLocation({lon:-96.7, lat:40.8})
    var stars = [], selected = null, starCounter = 0, STAR_LIMIT = 50;
    var maxTrail = 0, animateTill = null, drag = null, syncing = false;
    var show = { labels: false, zeroh: true, eq: true, under: true,
      never: false, riseset: false, circum: false, angle: false };

    var CONSTELLATIONS = {                                // the SWF's own catalogue
      orion: { stars: [[5.91953, 7.40706], [5.67931, -1.94257], [5.60356, -1.20192],
        [5.53344, -0.29909], [5.41885, 6.3497], [5.79594, -9.6696], [5.2423, -8.20164]],
        paths: [[0, 1, 2, 3, 4], [1, 5], [3, 6]] },
      dipper: { stars: [[11.06215, 61.75092], [11.03068, 56.38236], [11.89717, 53.69475],
        [12.25709, 57.03258], [12.90048, 55.95989], [13.39875, 54.92539], [13.79235, 49.31336]],
        paths: [[0, 1, 2, 3, 4, 5, 6]] },
      cross: { stars: [[12.4433, -63.09905], [12.51943, -57.11321], [12.79535, -59.68876],
        [12.25242, -58.74893]], paths: [[0, 1], [2, 3]] }
    };
    var shown = { orion: false, dipper: false, cross: false };   // constellations.inUse

    /* ================================ controls =============================== */
    var PANEL = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    S.group("rs.loc");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "rs.hint");
    PANEL.appendChild(hint);
    var latCtl = S.slider({ labelKey: "rs.lat", min: -90, max: 90, value: obsLat, step: 0.1,
      format: function (v) { return Math.abs(v).toFixed(1) + "° " + (v < 0 ? "S" : "N"); },
      on: function (v) { obsLat = v; upd(); drawMap(); } });
    var lonCtl = S.slider({ labelKey: "rs.lon", min: -180, max: 180, value: obsLon, step: 0.1,
      format: function (v) { return Math.abs(v).toFixed(1) + "° " + (v < 0 ? "W" : "E"); },
      on: function (v) { obsLon = v; upd(); drawMap(); } });

    var mapCv = document.createElement("canvas");
    mapCv.className = "ce-map";
    var mdpr = Math.min(window.devicePixelRatio || 1, 2);
    mapCv.width = Math.round(MAPW * mdpr); mapCv.height = Math.round(MAPH * mdpr);
    var mctx = mapCv.getContext("2d");
    mctx.setTransform(mdpr, 0, 0, mdpr, 0, 0);
    var mapWrap = document.createElement("div");
    mapWrap.className = "ctl ce-map-wrap";
    mapWrap.appendChild(mapCv);
    PANEL.appendChild(mapWrap);

    S.group("rs.anim");
    var forCtl = S.select({ labelKey: "rs.for", value: "0", options: [
      { v: "0", labelKey: "rs.cont" }, { v: "1", labelKey: "rs.hour1" },
      { v: "3", labelKey: "rs.h3" }, { v: "6", labelKey: "rs.h6" },
      { v: "12", labelKey: "rs.h12" }, { v: "24", labelKey: "rs.h24" }
    ], on: function () {} });
    var playBtn = S.button({ label: "", primary: true, on: toggleAnimation });
    S.slider({ labelKey: "rs.rate", min: 0.005, max: 0.4, value: rate, step: 0.005,
      format: function (v) { return (v * 24).toFixed(1) + " h/s"; },
      on: function (v) { rate = v; } });

    S.group("rs.look");
    var checks = {};
    [["labels", "rs.labels"], ["zeroh", "rs.zeroh"], ["eq", "rs.eq"], ["under", "rs.under"],
     ["never", "rs.never"], ["riseset", "rs.riseset"], ["circum", "rs.circum"],
     ["angle", "rs.angle"]].forEach(function (p) {
      checks[p[0]] = S.toggle({ labelKey: p[1], value: show[p[0]],
        on: (function (k) { return function (b) { show[k] = b; upd(); }; })(p[0]) });
    });

    S.group("rs.stars");
    S.button({ labelKey: "rs.add", on: function () {      // addStarRandomly()
      addStar({ dec: 180 * Math.random() - 90, ra: 24 * Math.random() }); upd();
    } });
    S.button({ labelKey: "rs.clear", on: function () {   // removeAllStars()
      removeAllStars(); upd();
    } });
    /* The SWF's "star patterns..." menu is a list of checkmarks, not a picker:
       onConstellationToggled flips one constellation's inUse flag and leaves the
       others alone, so all three can be up at once. One checkbox each.       */
    var patBox = document.createElement("div");
    patBox.className = "ctl ce-pat";
    var patLabel = document.createElement("label");
    patLabel.setAttribute("data-i18n", "rs.pattern");
    patBox.appendChild(patLabel);
    PANEL.appendChild(patBox);
    var patChecks = {};
    [["orion", "rs.orion"], ["dipper", "rs.dipper"], ["cross", "rs.cross"]]
      .forEach(function (p) {
        patChecks[p[0]] = S.toggle({ labelKey: p[1], value: false,
          on: (function (k) { return function (b) {
            if (syncing) return;
            if (b) addConstellation(k); else removeConstellation(k);
            upd();
          }; })(p[0]) });
        patBox.appendChild(PANEL.lastElementChild);      // tuck it under the label
      });
    S.select({ labelKey: "rs.trail", value: "none", options: [
      { v: "none", labelKey: "rs.tnone" }, { v: "short", labelKey: "rs.tshort" },
      { v: "long", labelKey: "rs.tlong" }
    ], on: function (v) { changeTrailType(v); } });
    S.button({ labelKey: "rs.reset", on: function () { resetTrails(); } });
    var outTime = S.readout({ labelKey: "rs.rTime" });
    var outSid = S.readout({ labelKey: "rs.rSid" });
    var outStar = S.readout({ labelKey: "rs.rStar" });

    /* ------------------------------- the model ------------------------------ */
    var CS = window.CelestialSphere;
    function siderealTime() {                             // update(): (lon + 360·frac) / 15
      return (obsLon + (time - Math.floor(time)) * 360) / 15;
    }
    function toggleAnimation() {
      if (loop.playing) { loop.pause(); animateTill = null; }
      else {
        var h = parseInt(forCtl.value(), 10);
        animateTill = h === 0 ? null : time + h / 24;
        loop.play();
      }
      paused = false;
      syncPlay();
    }
    function syncPlay() {
      playBtn.textContent = I18N.t(loop.playing || paused ? "rs.pause" : "rs.start");
    }
    // pauseAnimation / resumeAnimation: a press on a sphere or a star holds the clock
    var paused = false;
    function pauseAnimation() { if (loop.playing) { loop.pause(); paused = true; } }
    function resumeAnimation() { if (paused) { paused = false; loop.play(); } }
    var loop = S.loop(function (dt) {                     // onEnterFrameFunc
      var t0 = time;
      time += rate * dt;
      if (animateTill !== null && time > animateTill) {
        time = animateTill; loop.pause(); animateTill = null; syncPlay();
      }
      growStarTrails(360 * (time - t0));
      upd();
    });

    /* ============ the two CelestialSpheres, as init() sets them up ============ */
    var sph1 = new CS({ x: C1.x, y: C1.y }), sph2 = new CS({ x: C2.x, y: C2.y });
    sph2.size = 350; sph1.size = 350;
    sph1.latitude = 90; sph1.siderealTime = 0;
    sph1.showHorizonPlane = false;
    sph2.theta = 145;
    sph1.setThetaAndPhi(100, 20);
    var BAND_ART = {
      neverRiseBand: { outerColor: 0x6060e0, outerAlpha: 30, innerColor: 0x6060e0, innerAlpha: 30 },
      neverSetBand: { outerColor: 0xe06060, outerAlpha: 30, innerColor: 0xe06060, innerAlpha: 30 },
      riseAndSetBand: { outerColor: 0xe0e0e0, outerAlpha: 30, innerColor: 0xe0e0e0, innerAlpha: 30 }
    };
    [sph2, sph1].forEach(function (sp) {
      ["neverRiseBand", "neverSetBand", "riseAndSetBand"].forEach(function (k) {
        sp.addShadedBand(CS.GradientDisk, CS.GradientDisk, k, null, "inner", "full", BAND_ART[k]);
      });
    });
    [sph2, sph1].forEach(function (sp) {
      ["neverRiseBand", "neverSetBand", "riseAndSetBand"].forEach(function (k) {
        sp[k].setBorderStyle(1, 0x808080, 100); sp[k].showBorder = true;
      });
    });
    [sph1, sph2].forEach(function (sp) {
      sp.removeClip("celestialBowl");
      sp.addShadingClip(CS.art.shadingLayerB, "shading1", "back", "inner", "both");
      sp.addShadingClip(CS.art.shadingLayerA, "shading2", "front", "outer", "both");
      sp.addShadingClip(CS.art.shadingLayerA, "shading3", "back", "outer", "both");
    });
    sph2.minViewerAltitude = 7;
    sph2.addHorizonPlaneClip(CS.directionLabels(function () {
      return { N: I18N.t("rs.N"), S: I18N.t("rs.S"), E: I18N.t("rs.E"), W: I18N.t("rs.W") };
    }), "aboveLabels", "above");
    sph1.sortObjects = false; sph2.sortObjects = false;
    sph1.addCircle("meridian1", { alpha: 30, color: 0xe0e0e0, thickness: 1 }, { tilt: 90, az: 0, alt: 0 });
    sph1.addCircle("meridian2", { alpha: 30, color: 0xe0e0e0, thickness: 1 }, { tilt: 90, az: 90, alt: 0 });
    sph1.addCircle("meridian3", { alpha: 30, color: 0xe0e0e0, thickness: 1 }, { tilt: 0, az: 0, alt: 0 });
    sph2.addCircle("meridian1", { alpha: 30, color: 0xe0e0e0, thickness: 1 }, { tilt: 90, az: 0, alt: 0 });
    sph2.addCircle("meridian2", { alpha: 30, color: 0xe0e0e0, thickness: 1 }, { tilt: 90, az: 90, alt: 0 });
    [sph1, sph2].forEach(function (sp) {
      sp.addCircle("zeroHoursCircle", { alpha: 100, color: 0xffe375, thickness: 1 }, { gammaEnd: 90, gammaStart: -90, tilt: 90, dec: 0, ra: 0 });
      sp.addCircle("celestialEquator", { alpha: 100, color: 0xffe375, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    });
    var raColor = 0xffb0b0, decColor = 0xffffb0, azColor = 0xc0c0ff, altColor = 0xffffff, angColor = 0xd0d0d0;
    sph1.addObject("raLabel", csLabel, { dec: 0, ra: 0 }, { labelColor: raColor });
    sph1.addObject("decLabel", csLabel, { dec: 0, ra: 0 }, { labelColor: decColor });
    sph1.addCircle("raArc", { alpha: 100, color: raColor, thickness: 3 }, { tilt: 0, dec: 0, ra: 0 });
    sph1.addCircle("decArc", { alpha: 100, color: decColor, thickness: 3 }, { tilt: 0, dec: 0, ra: 0 });
    sph2.addObject("azLabel", csLabel, { az: 0, alt: 0 }, { labelColor: azColor });
    sph2.addObject("altLabel", csLabel, { az: 0, alt: 0 }, { labelColor: altColor });
    sph2.addCircle("azArc", { alpha: 100, color: azColor, thickness: 3 }, { tilt: 0, alt: 0, az: 0 });
    sph2.addCircle("altArc", { alpha: 100, color: altColor, thickness: 3 }, { tilt: 0, alt: 0, az: 0 });
    sph2.addObject("angle1Label", csLabel, { az: 0, alt: 0 }, { labelColor: angColor });
    sph2.addObject("angle2Label", csLabel, { az: 0, alt: 0 }, { labelColor: angColor });
    sph2.addCircle("angle1Circle", { alpha: 100, color: angColor, thickness: 2 }, { tilt: 0, az: 0, alt: 0 });
    sph2.addCircle("angle2Circle", { alpha: 100, color: angColor, thickness: 2 }, { tilt: 0, az: 0, alt: 0 });
    sph1.raLabel.visible = false; sph1.decLabel.visible = false;
    sph2.azLabel.visible = false; sph2.altLabel.visible = false;
    // the Earth: a size-60 sphere of its own at sphere1's centre, turned with sphere1's view
    var OBSERVER_DOT = { nz: false, layers: [[[], [[1, "#000000", "M2.3 -2.3Q3.25 -1.35 3.25 0Q3.25 1.35 2.3 2.3Q1.35 3.25 0 3.25Q-1.35 3.25 -2.3 2.3Q-3.25 1.35 -3.25 0Q-3.25 -1.35 -2.3 -2.3Q-1.35 -3.25 0 -3.25Q1.35 -3.25 2.3 -2.3"]]],
      [[["#ffffff", "M2.3 -2.3Q3.25 -1.35 3.25 0Q3.25 1.35 2.3 2.3Q1.35 3.25 0 3.25Q-1.35 3.25 -2.3 2.3Q-3.25 1.35 -3.25 0Q-3.25 -1.35 -2.3 -2.3Q-1.35 -3.25 0 -3.25Q1.35 -3.25 2.3 -2.3Z"]], []]] };
    var globe = new CS({ x: 0, y: 0 });
    globe.showHorizonPlane = false;
    globe.size = 60;
    globe.latitude = 90;
    globe.siderealTime = 0;
    globe.setThetaAndPhi(sph1.theta, sph1.phi);
    globe.removeClip("celestialBowl");
    globe.sortObjects = false;
    globe.setMouseBehavior("none");
    globe.addObject("globe", earthArt, { system: "celestial", x: 0, y: 0, z: 0 });
    globe.addObject("observerDot", CS.shapeDrawer(OBSERVER_DOT), { dec: 0, ra: 0 });
    globe.addCircle("latitudeCircle", { alpha: 30, color: 0x000000, thickness: 0 }, { tilt: 0, dec: 0, ra: 0 });
    globe.addCircle("longitudeCircle", { alpha: 30, color: 0x000000, thickness: 0 }, { gammaEnd: 90, gammaStart: -90, tilt: 90, dec: 0, ra: 0 });
    sph1.addObject("globeSphere", function (ctx) { globe.draw(ctx); }, { system: "celestial", x: 0, y: 0, z: 0 });
    // labels
    sph1.addObject("ncpLabel", staticLabel("rs.ncp", "#75a9ff", 0), { r: 1.13, dec: 85, ra: 0 });
    sph1.addObject("scpLabel", staticLabel("rs.scp", "#75a9ff", 0.425), { r: 1.13, dec: -85, ra: 0 });
    sph2.addObject("ncpLabel", staticLabel("rs.ncp", "#75a9ff", 0), { r: 1.16, dec: 85, ra: 0 });
    sph2.ncpLabel.setOrientationType("skewed", { dec: 90, ra: 0 });
    sph2.addObject("scpLabel", staticLabel("rs.scp", "#75a9ff", 0.425), { r: 1.16, dec: -85, ra: 0 });
    sph2.scpLabel.setOrientationType("skewed", { dec: 90, ra: 0 });
    [sph1, sph2].forEach(function (sp) {
      sp.addObject("celestialEquatorLabel", staticLabel("rs.ceq", "#ffe375", -0.1), { r: 1.1, dec: 0, ra: 3 });
      sp.celestialEquatorLabel.setOrientationType("absolute");
      sp.addObject("zeroHoursLabel", staticLabel("rs.zh", "#ffe375", -0.1), { r: 1.1, dec: 45, ra: 0 });
      sp.zeroHoursLabel.setOrientationType("absolute", { dec: 45, ra: 0 }, { dec: 0, ra: 18 });
    });
    sph2.addObject("meridianLabel", staticLabel("rs.mer", "#cccccc", -0.1), { r: 1.1, alt: 45, az: 180 });
    sph2.meridianLabel.setOrientationType("absolute", { alt: 45, az: 180 }, { alt: 0, az: 270 });
    sph2.addObject("zenithLabel", staticLabel("rs.zen", "#cccccc", 0.375), { r: 1.09, alt: 90, az: 0 });
    sph2.zenithLabel.setOrientationType("skewed", { alt: 90, az: 0 });
    sph2.addObject("nadirLabel", staticLabel("rs.nad", "#cccccc", -0.425), { r: 1.09, alt: -90, az: 0 });
    sph2.nadirLabel.setOrientationType("skewed", { alt: 90, az: 0 });
    sph2.addObject("zenithDot", grayDot, { alt: 90, az: 0 });
    sph2.zenithDot.setOrientationType("absolute");
    sph2.addObject("nadirDot", grayDot, { alt: -90, az: 0 });
    sph2.nadirDot.setOrientationType("absolute");
    ["ncpLabel", "scpLabel", "celestialEquatorLabel", "zeroHoursLabel"].forEach(function (k) {
      sph1[k].visible = false; sph2[k].visible = false;
    });
    ["meridianLabel", "zenithLabel", "nadirLabel", "zenithDot", "nadirDot"].forEach(function (k) { sph2[k].visible = false; });
    [sph1, sph2].forEach(function (sp) {
      sp.addLine("ncpAxis", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: 1 }, { system: "celestial", x: 0, y: 0, z: 1.2 });
      sp.addLine("scpAxis", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: -1 }, { system: "celestial", x: 0, y: 0, z: -1.2 });
    });
    sph2.addObject("stickfigure", CS.art.stickfigure, { system: "horizon", x: 0, y: 0, z: 0 }, { _yscale: 120, _xscale: 120 });
    sph2.stickfigure.setOrientationType("absolute", { system: "horizon", x: -1, y: 0, z: 0 }, { system: "horizon", x: 0, y: 0, z: 1 });

    /* ---- the art: CS Label (a Verdana bold 14 field, coloured), the bold 10 static
       labels, Small Gray Dot, Observer Dot, and the stars (Draggable / Constellation) */
    function csLabel(ctx, o) {
      if (!o.labelText) return;
      ctx.fillStyle = CS.colorCss(o.labelColor); ctx.font = "bold 14px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, o.labelText, -0.025, -8.55 + 1.0059 * 14);
    }
    function staticLabel(key, colour, cx) {
      return function (ctx) {
        ctx.fillStyle = colour; ctx.font = "bold 10px " + FONT;
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        FlashText.fillStatic(ctx, I18N.t(key), cx, 3.95);
      };
    }
    function grayDot(ctx) {                               // Small Gray Dot: shape 85 at 83 %
      ctx.fillStyle = "#cccccc"; ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, TAU); ctx.fill();
    }
    function starArt(ctx, o) { CS.art.star(ctx, o.hot); }

    /* ---- stars: a Draggable Star (or Constellation Star, half size) in each sphere ---- */
    // stars: {id, cons, s1, s2 (the objects in each sphere), trail, trailCircle}
    function addStar(cp, cons) {                          // addStar(cp, isConstellationStar)
      if (!cons && stars.length >= STAR_LIMIT) return null;   // (starsList holds the constellations' stars too)
      starCounter++;
      var id = "_" + starCounter, init = cons ? { _xscale: 50, _yscale: 50 } : null;
      var st = { id: id, cons: cons || null, trail: 0 };
      st.s1 = sph1.addObject(id, starArt, { ra: cp.ra, dec: cp.dec }, init);
      st.s2 = sph2.addObject(id, starArt, { ra: cp.ra, dec: cp.dec }, init);
      st.s1.setOrientationType("absolute"); st.s2.setOrientationType("absolute");
      // addTrail — every star, a constellation's too (both branches of the SWF's addStar end here)
      st.trailCircle = sph2.addCircle("t" + id, { alpha: 60, color: 0xffffff, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
      st.trailCircle.visible = false;
      stars.push(st);
      return st;
    }
    function removeStar(st) {
      if (selected === st) deselectSelectedStar();
      st.s1.remove(); st.s2.remove();
      if (st.trailCircle) st.trailCircle.remove();
      stars = stars.filter(function (s) { return s !== st; });
    }
    function removeAllStars() {
      deselectSelectedStar();
      Object.keys(shown).forEach(function (k) { removeConstellation(k); });
      stars.slice().forEach(removeStar);
      stars = [];
    }
    function addConstellation(key) {
      if (shown[key]) return;
      shown[key] = true;
      var C = CONSTELLATIONS[key], pts = C.stars.map(function (p) { return addStar({ ra: p[0], dec: p[1] }, key); });
      C.arcs = [];
      var n = 0;
      C.paths.forEach(function (path) {
        for (var i = 0; i + 1 < path.length; i++) {
          var a = C.stars[path[i]], b = C.stars[path[i + 1]], name = "_" + key + (++n);
          [sph1, sph2].forEach(function (sp) {
            var c = sp.addCircle(name, { alpha: 80, color: 0xffffff, thickness: 1 }, { dec: 0, ra: 0 });
            c.setArcPoints({ ra: a[0], dec: a[1] }, { ra: b[0], dec: b[1] });
            C.arcs.push(c);
          });
        }
      });
      void pts;
    }
    function removeConstellation(key) {
      if (!shown[key]) return;
      shown[key] = false;
      stars.filter(function (s) { return s.cons === key; }).forEach(removeStar);
      (CONSTELLATIONS[key].arcs || []).forEach(function (c) { c.remove(); });
      CONSTELLATIONS[key].arcs = [];
      if (patChecks[key] && patChecks[key].value()) { syncing = true; patChecks[key].set(false); syncing = false; }
    }
    function moveStar(st, cp) {
      if (cp.ra === null) return;
      st.s1.setPosition(cp); st.s2.setPosition(cp);
      st.s1.setOrientationType("absolute"); st.s2.setOrientationType("absolute");
      if (st.trailCircle) updateTrail(st);
      upd();
    }
    function selectStar(st) {
      selected = st;
      ["raArc", "decArc", "raLabel", "decLabel"].forEach(function (k) { sph1[k].visible = true; });
      ["azArc", "altArc", "azLabel", "altLabel"].forEach(function (k) { sph2[k].visible = true; });
      upd();
    }
    function deselectSelectedStar() {
      selected = null;
      ["raArc", "decArc", "raLabel", "decLabel"].forEach(function (k) { sph1[k].visible = false; });
      ["azArc", "altArc", "azLabel", "altLabel"].forEach(function (k) { sph2[k].visible = false; });
      upd();
    }
    /* star trails: an arc of each star's own declination circle, maxTrail degrees at most */
    function updateTrail(st) {
      var p = st.s2._p, d = DEG * Math.asin(p.z);
      if (st.trail >= 360) st.trailCircle.setParameters({ gammaEnd: 0, gammaStart: 0, tilt: 0, dec: d, ra: 0 });
      else {
        var g = DEG * Math.atan2(p.y, p.x);
        st.trailCircle.setParameters({ gammaEnd: g + st.trail, gammaStart: g, tilt: 0, dec: d, ra: 0 });
      }
    }
    function setTrailLength(st, L) {
      st.trail = L;
      if (L === 0) st.trailCircle.visible = false;
      else { updateTrail(st); st.trailCircle.visible = true; }
    }
    function changeTrailType(v) {
      maxTrail = v === "none" ? 0 : v === "short" ? 45 : 360;
      stars.forEach(function (st) {
        if (!st.trailCircle) return;
        if (maxTrail === 0) setTrailLength(st, 0);
        else if (st.trail > maxTrail) setTrailLength(st, maxTrail);
      });
      S.requestDraw();
    }
    function resetTrails() { stars.forEach(function (st) { if (st.trailCircle) setTrailLength(st, 0); }); S.requestDraw(); }
    function growStarTrails(delta) {
      if (!maxTrail) return;
      stars.forEach(function (st) {
        if (!st.trailCircle || !(st.trail < maxTrail)) return;
        setTrailLength(st, Math.min(maxTrail, st.trail + delta));
      });
    }

    /* ---- the location, the bands, the arcs (setLocation, updateBands, update…Arcs) ---- */
    function updateBands() {
      var la = obsLat, b1 = { r: "riseAndSetBand", n: "neverRiseBand", s: "neverSetBand" }, P;
      if (!(la < 90)) P = { r: null, n: { dec2: 0, dec1: -90 }, s: { dec2: 90, dec1: 0 } };
      else if (!(la > -90)) P = { r: null, n: { dec2: 90, dec1: 0 }, s: { dec2: -90, dec1: 0 } };
      else if (la > 0) { var u = 90 - la; P = { r: { dec2: u, dec1: -u }, n: { dec2: -u, dec1: -90 }, s: { dec2: 90, dec1: u } }; }
      else if (la < 0) { var u2 = 90 + la; P = { r: { dec2: u2, dec1: -u2 }, n: { dec2: u2, dec1: 90 }, s: { dec2: -90, dec1: -u2 } }; }
      else P = { r: { dec2: 90, dec1: -90 }, n: null, s: null };
      [sph1, sph2].forEach(function (sp) {
        sp[b1.r].setParameters(P.r); sp[b1.n].setParameters(P.n); sp[b1.s].setParameters(P.s);
        sp.riseAndSetBand.visible = show.riseset;
        sp.neverSetBand.visible = show.circum;
        sp.neverRiseBand.visible = show.never;
      });
    }
    function updateCelestialArcs() {
      var c = selected.s1.getPositionCelestial();
      if (c.dec < -0.0001) sph1.decArc.setParameters({ gammaEnd: 0, gammaStart: c.dec, tilt: 90, dec: 0, ra: c.ra });
      else if (c.dec > 0.0001) sph1.decArc.setParameters({ gammaEnd: c.dec, gammaStart: 0, tilt: 90, dec: 0, ra: c.ra });
      else sph1.decArc.setParameters({ gammaEnd: 0.001, gammaStart: 0, tilt: 90, dec: 0, ra: c.ra });
      if (c.ra < 1e-6) sph1.raArc.setParameters({ gammaEnd: 0.001, gammaStart: 0, tilt: 0, dec: 0, ra: 0 });
      else sph1.raArc.setParameters({ gammaEnd: 15 * c.ra, gammaStart: 0, tilt: 0, dec: 0, ra: 0 });
      sph1.decLabel.labelText = c.dec.toFixed(1) + "°";
      sph1.decLabel.setPosition({ r: 1.001, dec: c.dec / 2, ra: c.ra + 0.9 });
      sph1.decLabel.setOrientationType("absolute");
      sph1.raLabel.labelText = c.ra.toFixed(1) + I18N.t("rs.h");
      sph1.raLabel.setPosition({ r: 1.001, dec: 5, ra: c.ra - 0.9 });
      sph1.raLabel.setOrientationType("absolute");
      return c;
    }
    function updateHorizonArcs() {
      var h = selected.s2.getPositionHorizon();
      if (h.alt < -0.0001) sph2.altArc.setParameters({ gammaEnd: 0, gammaStart: h.alt, tilt: 90, alt: 0, az: h.az });
      else if (h.alt > 0.0001) sph2.altArc.setParameters({ gammaEnd: h.alt, gammaStart: 0, tilt: 90, alt: 0, az: h.az });
      else sph2.altArc.setParameters({ gammaEnd: 0.001, gammaStart: 0, tilt: 90, alt: 0, az: h.az });
      if (h.az < 0.0001) sph2.azArc.setParameters({ gammaEnd: 0.001, gammaStart: 0, tilt: 0, alt: 0, az: 0 });
      else sph2.azArc.setParameters({ gammaEnd: 0, gammaStart: 360 - h.az, tilt: 0, alt: 0, az: 0 });
      sph2.altLabel.labelText = h.alt.toFixed(1) + "°";
      sph2.altLabel.setPosition({ r: 1.001, alt: h.alt / 2, az: h.az + 13 });
      sph2.altLabel.setOrientationType("absolute");
      sph2.azLabel.labelText = h.az.toFixed(1) + "°";
      sph2.azLabel.setPosition({ r: 1.001, alt: 5, az: h.az - 13 });
      sph2.azLabel.setOrientationType("absolute");
      return h;
    }
    function updateAngle() {
      var on = show.angle;
      ["angle1Label", "angle2Label", "angle1Circle", "angle2Circle"].forEach(function (k) { sph2[k].visible = on; });
      if (!on) return;
      var a7 = 0.4363323129985824, r1 = 20, r3 = 90 - r1, la = obsLat, txt, r2, r4;
      if (!(la < 90)) {
        txt = "0°";
        sph2.angle1Circle.setParameters({ gammaEnd: 270, gammaStart: 270 - r1, alt: 0, tilt: 0, az: 0 });
        sph2.angle2Circle.setParameters({ gammaEnd: 90 + r1, gammaStart: 90, alt: 0, tilt: 0, az: 0 });
        r2 = 0; r4 = 1;
      } else if (!(la < 0)) {
        txt = (90 - la).toFixed(1) + "°";
        sph2.angle1Circle.setParameters({ gammaEnd: 180, gammaStart: 90 + la, alt: r3, tilt: 90, az: 0 });
        sph2.angle2Circle.setParameters({ gammaEnd: 180, gammaStart: 90 + la, alt: -r3, tilt: 90, az: 0 });
        r2 = (90 - la) / 2 * RAD; r4 = 1;
      } else if (la > -90) {
        txt = (90 + la).toFixed(1) + "°";
        sph2.angle1Circle.setParameters({ gammaEnd: 90 + la, gammaStart: 0, alt: r3, tilt: 90, az: 0 });
        sph2.angle2Circle.setParameters({ gammaEnd: 90 + la, gammaStart: 0, alt: -r3, tilt: 90, az: 0 });
        r2 = (90 + la) / 2 * RAD; r4 = -1;
      } else {
        txt = "0°";
        sph2.angle1Circle.setParameters({ gammaEnd: 270 + r1, gammaStart: 270, alt: 0, tilt: 0, az: 0 });
        sph2.angle2Circle.setParameters({ gammaEnd: 90, gammaStart: 90 - r1, alt: 0, tilt: 0, az: 0 });
        r2 = 0; r4 = -1;
      }
      var alt = DEG * Math.asin(Math.sin(r2) * Math.sin(a7)), d = DEG * Math.atan(Math.cos(r2) * Math.tan(a7));
      var p1 = { az: 90 + r4 * d, alt: alt }, p2 = { az: 270 - r4 * d, alt: alt };
      var up = r4 === -1 ? { alt: r2 * DEG, az: 0 } : { alt: r2 * DEG, az: 180 };
      sph2.angle1Label.setPosition(p1); sph2.angle2Label.setPosition(p2);
      sph2.angle1Label.setOrientationType("absolute", p1, up);
      sph2.angle2Label.setOrientationType("absolute", p2, up);
      sph2.angle1Label.labelText = txt; sph2.angle2Label.labelText = txt;
    }
    function changeShowLabels() {
      var L = show.labels;
      [sph1, sph2].forEach(function (sp) {
        sp.celestialEquatorLabel.visible = L && show.eq;
        sp.zeroHoursLabel.visible = L && show.zeroh;
        sp.ncpLabel.visible = L; sp.scpLabel.visible = L;
        sp.zeroHoursCircle.visible = show.zeroh;
        sp.celestialEquator.visible = show.eq;
      });
      ["meridianLabel", "zenithLabel", "nadirLabel", "zenithDot", "nadirDot"].forEach(function (k) { sph2[k].visible = L; });
    }
    // update(): the clock turns sphere2's sky and the Earth inside sphere1
    function syncSky() {
      var rot = (time % 1) * 360, sid = (obsLon + rot) / 15;
      globe.siderealTime = -sid;
      sph2.latitude = obsLat;
      sph2.siderealTime = sid;
      globe.latitudeCircle.setParameters({ dec: obsLat, tilt: 0, ra: 0 });
      globe.observerDot.setPosition({ dec: obsLat, ra: 0 });
      globe.observerDot.setOrientationType("absolute");
      globe.setThetaAndPhi(sph1.theta, sph1.phi);
      earthRot = rot;
      sph2.showUnder = show.under;
      changeShowLabels();
      updateBands();
      updateAngle();
      if (selected) { updateCelestialArcs(); updateHorizonArcs(); }
    }
    var earthRot = 0;

    function upd() {
      var sid = ((siderealTime() % 24) + 24) % 24;
      syncSky();
      outTime((time * 24).toFixed(2) + " h");
      outSid(hms(sid));
      if (selected) {
        var c = selected.s1.getPositionCelestial(), h = selected.s2.getPositionHorizon();
        outStar("RA " + c.ra.toFixed(1) + "h  dec " + c.dec.toFixed(1) + "°  |  " +
          "az " + h.az.toFixed(1) + "°  alt " + h.alt.toFixed(1) + "°");
      } else outStar(I18N.t("rs.nostar"));
      S.requestDraw();
    }
    function hms(h) {
      var m = Math.floor((h % 1) * 60);
      return Math.floor(h) + "h " + (m < 10 ? "0" : "") + m + "m";
    }
    S.refreshers.push(function () { syncPlay(); upd(); });
    function mod(n, m) { return ((n % m) + m) % m; }

    /* ------------------------------- interaction ---------------------------- */
    function at(ev) { return CS.canvasPoint(S.canvas, ev, S.W, S.H); }
    var delKey = false;                                   // Key.isDown(46): Delete removes the star pressed
    window.addEventListener("keydown", function (ev) { if (ev.key === "Delete") delKey = true; });
    window.addEventListener("keyup", function (ev) { if (ev.key === "Delete") delKey = false; });
    function starAt(p) {                                  // the top-most star under the pointer
      var best = null;
      [{ sp: sph1, k: "s1" }, { sp: sph2, k: "s2" }].forEach(function (S2) {
        stars.forEach(function (st) {
          var o = st[S2.k];
          if (!o.shown) return;
          var q = o.toLocal(p.x, p.y);
          if (Math.abs(q.x) > 11 || Math.abs(q.y) > 11 || !inStar(q)) return;
          if (!best || (best.sp === S2.sp && o._sp.z > best.o._sp.z)) best = { st: st, o: o, sp: S2.sp, k: S2.k };
        });
      });
      return best;
    }
    function inStar(q) {                                  // within the star's outline, roughly
      return q.x * q.x + q.y * q.y <= 10.5 * 10.5;
    }
    function sphereAt(p) { return sph1.inMouseArea(p.x, p.y) ? sph1 : sph2.inMouseArea(p.x, p.y) ? sph2 : null; }
    function setHot(st) {
      stars.forEach(function (s) { s.s1.hot = s.s2.hot = false; });
      if (st) st.o.hot = true;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), hit = starAt(p);
      if (hit && hit.o._sp.z > 0) {                       // Draggable / Constellation Star.onPress
        if (delKey) { if (hit.st.cons) removeConstellation(hit.st.cons); else removeStar(hit.st); upd(); return; }
        pauseAnimation();
        drag = { star: hit.st, sp: hit.sp, already: selected === hit.st, moved: false };
        if (!drag.already) selectStar(hit.st);
      } else {
        var sp = hit ? hit.sp : sphereAt(p);              // a star round the back passes the press on
        if (!sp) { if (!hit) { deselectSelectedStar(); } return; }   // backgroundMC.onPress
        if (ev.shiftKey) {                                // add a star where the mouse is
          var cp = sp.getMouseRaDec(p.x, p.y);
          if (cp.ra !== null) { var st = addStar(cp); if (st) selectStar(st); }
          return;
        }
        pauseAnimation();
        sp.startDrag(p.x, p.y);
        drag = { sphere: sp, moved: false };
      }
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) {
        var hit = starAt(p);
        setHot(hit && hit.o._sp.z > 0 ? hit : null);
        S.requestDraw();
        return;
      }
      drag.moved = true;
      if (drag.star) {                                    // onMouseMoveFunc: getMouseRaDec, moveStar
        if (drag.star.cons) return;
        var cp = drag.sp.getMouseRaDec(p.x, p.y);
        if (cp.ra !== null) moveStar(drag.star, cp);
        return;
      }
      drag.sphere.dragTo(p.x, p.y);
      upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () {
        if (!drag) return;
        resumeAnimation();
        if (drag.star) { if (drag.already && !drag.moved) deselectSelectedStar(); }
        else {
          drag.sphere.endDrag();
          if (!drag.moved) deselectSelectedStar();
        }
        drag = null;
        upd();
      });
    });
    S.canvas.addEventListener("pointerleave", function () { if (!drag) { setHot(null); S.requestDraw(); } });
    /* ---- picking a location off the map ---- */
    var mapDrag = false;
    function mapAt(ev) {
      var r = mapCv.getBoundingClientRect();
      return { x: (ev.clientX - r.left) / r.width * MAPW,
        y: (ev.clientY - r.top) / r.height * MAPH };
    }
    mapCv.addEventListener("pointerdown", function (ev) {
      mapDrag = true; mapCv.setPointerCapture(ev.pointerId);
      setFromMap(mapAt(ev)); ev.preventDefault();
    });
    mapCv.addEventListener("pointermove", function (ev) {
      if (mapDrag) setFromMap(mapAt(ev));
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      mapCv.addEventListener(e, function () { mapDrag = false; });
    });
    function setFromMap(p) {
      var lon = p.x / MAPW * 360 - 180;
      var la = 90 - p.y / MAPH * 180;
      latCtl.set(Math.round(Math.max(-90, Math.min(90, la)) * 10) / 10);
      lonCtl.set(Math.round(Math.max(-180, Math.min(180, lon)) * 10) / 10);
    }

    /* ================================= drawing =============================== */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      FlashText.begin(ctx);
      S.clear();
      ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, S.W, S.H);
      panel(ctx, P1, tr("rs.celestial"));
      panel(ctx, P2, tr("rs.horizon"));
      ctx.save(); ctx.beginPath(); ctx.rect(P1.x, P1.y, P1.w, P1.h); ctx.clip();
      sph1.draw(ctx); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(P2.x, P2.y, P2.w, P2.h); ctx.clip();
      sph2.draw(ctx); ctx.restore();
    });
    function panel(ctx, P, title) {
      ctx.fillStyle = "#000000"; ctx.fillRect(P.x, P.y, P.w, P.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(P.x + 0.5, P.y + 0.5, P.w - 1, P.h - 1);
      ctx.fillStyle = "#bbbbbb"; ctx.font = "italic 12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(title, P.x + 8, P.y + 8);
    }

    /* GlobeComponent: the land and sea of _earth.js, spun by the clock about the pole.
       The globe sphere sits at latitude 90 with sidereal time −(lon + rot)/15, so its
       sky → horizon turn is 180° + lon + rot; the land carries 180° + rot.      */
    var ER = 30, waterFill = null, landFill = null, limbFill = null;
    function earthFills(ctx) {                   // built once, in globe units
      if (waterFill) return;
      function rad(inner, outer) {
        var g = ctx.createRadialGradient(ER * 0.25, -ER * 0.15, ER * 0.04,
          ER * 0.25, -ER * 0.15, ER * 1.30);
        g.addColorStop(0, inner); g.addColorStop(1, outer);
        return g;
      }
      waterFill = rad("#d0d8fa", "#8a93cf");
      landFill = rad("#cdad78", "#8d7348");
      limbFill = ctx.createRadialGradient(0, 0, ER * 0.55, 0, 0, ER);
      limbFill.addColorStop(0, "rgba(36,42,86,0)");
      limbFill.addColorStop(1, "rgba(36,42,86,0.28)");
    }
    function earthArt(ctx) {
      earthFills(ctx);
      var land = EARTH.spin(180 + earthRot);
      function gp(x, y, z) { var v = land(x, y, z); return globe.WtoSz(v, {}); }
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, ER, 0, TAU); ctx.clip();
      ctx.fillStyle = waterFill;
      ctx.fillRect(-ER, -ER, 2 * ER, 2 * ER);
      ctx.beginPath();
      EARTH.landPath(ctx, gp, ER);
      ctx.fillStyle = landFill;
      ctx.fill("evenodd");
      ctx.fillStyle = limbFill;
      ctx.fillRect(-ER, -ER, 2 * ER, 2 * ER);
      ctx.restore();
    }

    /* ---- the clickable world map, as in the SWF's Observer's Location panel -
       Equirectangular and square: MAPW = 2 * MAPH, so a degree of longitude and
       a degree of latitude cover the same number of pixels.                   */
    function drawMap() {
      var ctx = mctx;
      ctx.save();
      ctx.fillStyle = "#e9f0f7"; ctx.fillRect(0, 0, MAPW, MAPH);
      ctx.beginPath(); ctx.rect(0, 0, MAPW, MAPH); ctx.clip();
      function mx(lon) { return (lon + 180) / 360 * MAPW; }
      function my(la) { return (90 - la) / 180 * MAPH; }
      ctx.fillStyle = "#c9b48b";                      // land, then the inland seas
      ctx.beginPath();
      EARTH.mapPath(ctx, 0, 0, MAPW, MAPH);
      ctx.fill();
      ctx.fillStyle = "#e9f0f7";
      ctx.beginPath();
      EARTH.mapPath(ctx, 0, 0, MAPW, MAPH, "inner");
      ctx.fill();
      ctx.strokeStyle = "rgba(90,120,150,0.45)"; ctx.lineWidth = 1;
      ctx.beginPath();
      [-60, -30, 0, 30, 60].forEach(function (la) { ctx.moveTo(0, my(la)); ctx.lineTo(MAPW, my(la)); });
      [-120, -60, 0, 60, 120].forEach(function (lo) { ctx.moveTo(mx(lo), 0); ctx.lineTo(mx(lo), MAPH); });
      ctx.stroke();
      var px = mx(obsLon), py = my(obsLat);
      ctx.strokeStyle = "#d11818"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px - 11, py); ctx.lineTo(px + 11, py);
      ctx.moveTo(px, py - 11); ctx.lineTo(px, py + 11);
      ctx.stroke();
      ctx.strokeStyle = "#8899aa"; ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, MAPW - 2, MAPH - 2);
      ctx.restore();
    }

    /* ---------------------------------------------------------------------
       Layout. The SWF puts the observer's panel — latitude, longitude and the
       clickable map — beside the diagrams and its other three panels in a row
       underneath. Do the same: the location panel is the one that wants to sit
       next to the sky it is aiming at, and the rest read better as a row than
       as a column three times the height of the stage.                       */
    (function () {
      var css = document.createElement("style");
      css.textContent =
        // the location panel beside the sky, wide enough for a legible map but
        // never so wide that it starves the diagram
        ".sim-layout{grid-template-columns:minmax(0,1fr) clamp(250px,26%,330px)}" +
        ".ce-map{width:100%;max-width:480px;height:auto;display:block;" +
        "border-radius:6px;cursor:crosshair;touch-action:none}" +
        ".ce-map-wrap{gap:0}" +
        // the other three panels, in a row under the whole thing
        ".ce-bottom{grid-column:1/-1;display:grid;" +
        "grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 26px;align-items:start}" +
        // each panel flows its own controls into as many columns as it has room
        // for, so a half-width panel is two controls wide instead of twice as tall
        ".ce-col{order:1;display:grid;align-content:start;align-items:start;min-width:0;" +
        "grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:11px 20px}" +
        ".ce-col>.group-title{grid-column:1/-1;margin:0 0 2px}" +
        // the eight appearance checkboxes need about 270px each to keep their
        // labels on one line, so they take a full-width row of their own
        ".ce-col.wide{order:2;grid-column:1/-1;gap:9px 22px;" +
        "grid-template-columns:repeat(auto-fit,minmax(270px,1fr))}" +
        ".ce-bottom>.readouts{order:3;grid-column:1/-1;" +
        "grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}" +
        ".sim-controls .sim-note{margin:0 0 2px}" +
        ".ce-pat{gap:7px}.ce-pat>label{font-size:.86rem;color:var(--text)}" +
        "@media (max-width:980px){.sim-layout{grid-template-columns:1fr}}" +
        "@media (max-width:620px){.ce-bottom{grid-template-columns:1fr}}";
      document.head.appendChild(css);

      var bottom = document.createElement("aside");
      bottom.className = "sim-controls ce-bottom";
      PANEL.parentNode.appendChild(bottom);

      var col = null, outs = null, groups = 0;
      [].slice.call(PANEL.children).forEach(function (el) {
        if (el.classList.contains("readouts")) { outs = el; return; }
        if (el.classList.contains("group-title")) groups++;
        if (groups <= 1) return;               // the location panel stays on the right
        if (el.classList.contains("group-title") || !col) {
          col = document.createElement("div");
          col.className = "ce-col";
          bottom.appendChild(col);
        }
        col.appendChild(el);
      });
      [].forEach.call(bottom.querySelectorAll(".ce-col"), function (c) {
        if (c.querySelectorAll(".ctl.row").length >= 4) c.classList.add("wide");
      });
      if (outs) bottom.appendChild(outs);      // readouts run under everything
    })();

    deselectSelectedStar();                               // onReset: removeAllStars() hides the arcs
    drawMap();
    upd();
  }
});
