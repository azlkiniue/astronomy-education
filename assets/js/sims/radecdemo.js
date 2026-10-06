/* Celestial-Equatorial (RA/Dec) Demonstrator ----------------------------------
   Faithful rebuild of the ClassAction "radecdemo.swf" (CelestialEquatorialDemo-
   Class over the UNL CelestialSphere engine, both decompiled): the SWF's "The
   Celestial Sphere" panel, drawn with the shared engine in _celestialsphere.js
   exactly as CelestialEquatorialDemoClass.init sets it up — a 320 px sphere of
   white glass seen from latitude 90 (so the celestial pole is "up"), the
   celestial equator and the 0h circle, the star's hour circle and declination
   circle, and the two measured arcs: RA (blue) east along the equator from the
   0h circle, dec (red) up the star's hour circle, each with its value label.
   At the centre sits the SWF's "Globe Component v2" — a size-60 CelestialSphere
   of its own holding the Earth: the library's water and land art, the land
   masked by the coastlines in _earth.js, plus the globe's equator and axis.
     • Star Position — RA 0–24 h, dec −90–90° (the star is also draggable;
       a star round the back of the sphere passes the press on to the sphere),
     • Labels — show all / hide all, and the seven labels one by one (the East
       Arrow and the Ecliptic checkboxes also show the arrow and the circle),
     • drag the sphere to turn it ("simple drag": a radian per sphere radius). */
Sim.create({
  id: "radecdemo",
  width: 464, height: 480,
  strings: {
    en: {
      "rd.pos": "Star Position", "rd.ra": "RA", "rd.dec": "dec",
      "rd.hint": "you can also change the star's position by dragging it",
      "rd.labels": "Labels", "rd.showAll": "show all", "rd.hideAll": "hide all",
      "rd.lPoles": "North and South Poles", "rd.lEquator": "Equator",
      "rd.lCelPoles": "North and South Celestial Poles", "rd.lCelEq": "Celestial Equator",
      "rd.lZero": "0h Circle", "rd.lEast": "East Arrow", "rd.lEcliptic": "Ecliptic",
      "rd.title": "The Celestial Sphere", "rd.reset": "Reset",
      "rd.np": "North Pole", "rd.sp": "South Pole",
      "rd.ncp": "North Celestial Pole", "rd.scp": "South Celestial Pole",
      "rd.eq": "Equator", "rd.ce": "Celestial Equator", "rd.zero": "0h Circle",
      "rd.east": "East", "rd.ecl": "Ecliptic", "rd.h": "h"
    },
    id: {
      "rd.pos": "Posisi Bintang", "rd.ra": "AR", "rd.dec": "dek",
      "rd.hint": "posisi bintang juga bisa diubah dengan menyeretnya",
      "rd.labels": "Label", "rd.showAll": "tampilkan semua", "rd.hideAll": "sembunyikan semua",
      "rd.lPoles": "Kutub Utara dan Selatan", "rd.lEquator": "Ekuator",
      "rd.lCelPoles": "Kutub Langit Utara dan Selatan", "rd.lCelEq": "Ekuator Langit",
      "rd.lZero": "Lingkaran 0j", "rd.lEast": "Panah Timur", "rd.lEcliptic": "Ekliptika",
      "rd.title": "Bola Langit", "rd.reset": "Atur ulang",
      "rd.np": "Kutub Utara", "rd.sp": "Kutub Selatan",
      "rd.ncp": "Kutub Langit Utara", "rd.scp": "Kutub Langit Selatan",
      "rd.eq": "Ekuator", "rd.ce": "Ekuator Langit", "rd.zero": "Lingkaran 0j",
      "rd.east": "Timur", "rd.ecl": "Ekliptika", "rd.h": "j"
    }
  },
  about: {
    en: "<p>The <strong>celestial-equatorial</strong> system is the sky's version of latitude and longitude. Project Earth's equator outward and you get the <strong>celestial equator</strong>; project its poles and you get the <strong>north and south celestial poles</strong>. Because the grid is pinned to Earth's rotation axis rather than to your horizon, a star keeps the same coordinates no matter where or when you observe it.</p>" +
        "<p><strong>Declination (dec)</strong> is the angle north (+) or south (−) of the celestial equator, from −90° to +90° — the red arc. <strong>Right ascension (RA)</strong> is the angle measured <em>eastward</em> along the celestial equator from the <strong>0h circle</strong>, the hour circle through the vernal equinox — the blue arc. RA is quoted in hours rather than degrees because the sky turns 15° per hour: 1<sup>h</sup> = 15°, and a full circle is 24<sup>h</sup>.</p>" +
        "<p>Drag the star, or use the sliders; drag anywhere else on the sphere to turn it. Notice that the star's declination circle stays the same size as RA changes, and shrinks toward the pole as dec grows — which is why an hour of RA covers less sky at high declination.</p>",
    id: "<p>Sistem <strong>ekuatorial langit</strong> adalah versi lintang–bujur untuk langit. Proyeksikan ekuator Bumi ke luar dan diperoleh <strong>ekuator langit</strong>; proyeksikan kutubnya dan diperoleh <strong>kutub langit utara dan selatan</strong>. Karena kisi ini terpaku pada sumbu rotasi Bumi, bukan pada horizon Anda, koordinat sebuah bintang tetap sama di mana pun dan kapan pun diamati.</p>" +
        "<p><strong>Deklinasi (dek)</strong> adalah sudut ke utara (+) atau selatan (−) dari ekuator langit, −90° hingga +90° — busur merah. <strong>Asensiorekta (AR)</strong> adalah sudut yang diukur <em>ke timur</em> sepanjang ekuator langit dari <strong>lingkaran 0j</strong>, yaitu lingkaran jam yang melewati titik musim semi — busur biru. AR dinyatakan dalam jam karena langit berputar 15° per jam: 1<sup>j</sup> = 15°, dan satu lingkaran penuh 24<sup>j</sup>.</p>" +
        "<p>Seret bintangnya, atau gunakan penggeser; seret bagian lain bola untuk memutarnya. Perhatikan bahwa lingkaran deklinasi bintang mengecil ke arah kutub saat dek membesar — itulah sebabnya satu jam AR mencakup langit yang lebih sempit pada deklinasi tinggi.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif";
    var OY = -30;                                   // the SWF's title bar is the page header here
    var PANEL = { x: 7, y: 37 + OY, w: 450, h: 466 };   // Panel Background 300×150 at (1.5, 3.107)
    var RA_COLOR = 0x4b4bfe, DEC_COLOR = 0xfe4b4b;  // CelestialEquatorialDemoClass.raColor / decColor
    var CS = window.CelestialSphere, EARTH = window.EARTH;
    var syncing = false, drag = null;

    /* ---- the art, from the SWF's library (python3 tools/swf-inspect.py canvas) ---- */
    var CIRCLE50 = "M35.35 -35.35Q50 -20.7 50 0Q50 20.7 35.35 35.35Q20.7 50 0 50Q-20.7 50 -35.35 35.35" +
      "Q-50 20.7 -50 0Q-50 -20.7 -35.35 -35.35Q-20.7 -50 0 -50Q20.7 -50 35.35 -35.35Z";
    var ART = {
      // "Globe Component v2 Water" (shape 110) and "Globe Component v2 Land" (shape 112)
      water: { nz: false, layers: [[[[{ t: "r", m: [0.08905, 0, 0, 0.08905, 16, -15.95], s: [[0, "#e2eafc"], [1, "#8493f0"]] }, CIRCLE50]], []]] },
      land: { nz: false, layers: [[[[{ t: "r", m: [0.089066, 0, 0, 0.08905, 16, -15.95], s: [[0, "#c8a977"], [1, "#98753d"]] },
        "M35.35 -35.35Q43.35 -27.35 47 -17.5Q50 -9.35 50 0Q50 20.7 35.35 35.35Q20.7 50 0 50Q-20.7 50 -35.35 35.35" +
        "Q-50 20.7 -50 0Q-50 -20.7 -35.35 -35.35Q-21.5 -49.2 -2.25 -49.95L0 -50Q20.7 -50 35.35 -35.35Z"]], []]] },
      // "Sphere Edge Shading" (shape 86): a rim of grey on the front of the glass
      edge: { nz: false, layers: [[[[{ t: "r", m: [0.123779, 0, 0, 0.123779, -0.05, 0], s: [[0.5804, "rgba(255,255,255,0)"], [1, "rgba(215,215,215,0.353)"]] },
        "M-0.05 -100Q41.4 -100 70.65 -70.75Q99.95 -41.45 99.95 0Q99.95 41.4 70.65 70.7Q41.4 100 -0.05 100" +
        "Q-41.45 100 -70.75 70.7Q-100.05 41.4 -100 0Q-100.05 -41.45 -70.75 -70.75Q-41.45 -100 -0.05 -100Z"]], []]] },
      // "Rotation Arrow" (shape 88): the curled arrow over the pole
      rotation: { nz: false, layers: [
        [[["#505050", "M0 12L2 11.85L2 13L10.35 13Q5.9 16.6 0 16.6Q-6.45 16.6 -11.15 12.35L-11.75 11.75Q-16.6 6.9 -16.6 0" +
          "Q-16.6 -6.9 -11.75 -11.75Q-6.9 -16.6 0 -16.6L4.2 -16.1L3 -11.65L0 -12Q-5 -12 -8.5 -8.5Q-10.25 -6.7 -11.15 -4.55" +
          "Q-12 -2.45 -12 0Q-12 5 -8.5 8.5Q-5 12 0 12Z"]],
         [[1, "#505050", "M2 11.85L0 12Q-5 12 -8.5 8.5Q-12 5 -12 0Q-12 -2.45 -11.15 -4.55Q-10.25 -6.7 -8.5 -8.5Q-5 -12 0 -12" +
          "L3 -11.65L4.2 -16.1L0 -16.6Q-6.9 -16.6 -11.75 -11.75Q-16.6 -6.9 -16.6 0Q-16.6 6.9 -11.75 11.75L-11.15 12.35" +
          "Q-6.45 16.6 0 16.6Q5.9 16.6 10.35 13"]]],
        [[["#505050", "M11.15 12.35L10.35 13L2 13L2 11.85Q5.7 11.3 8.5 8.5Q11.65 5.35 11.95 1L6.45 2.15L14.2 -5.75L21.9 2.15" +
          "L16.6 1.05Q16.25 7.25 11.75 11.75L11.15 12.35Z"]],
         [[1, "#505050", "M10.35 13L11.15 12.35L11.75 11.75Q16.25 7.25 16.6 1.05L21.9 2.15L14.2 -5.75L6.45 2.15L11.95 1" +
          "Q11.65 5.35 8.5 8.5Q5.7 11.3 2 11.85"]]]] },
      // "East Arrow" (shape 148)
      east: { nz: false, layers: [[[["#505050", "M-19.6 -2.65L11.95 -2.65L10.55 -9.35L20.6 0.55L10.55 10.4L11.95 3.75" +
        "L-19.6 3.75Q-20.05 3.75 -20.35 2.9L-20.65 0.85L-20.65 0.3L-20.35 -1.75Q-20.05 -2.65 -19.6 -2.65Z"]],
        [[1, "#505050", "M11.95 -2.65L-19.6 -2.65Q-20.05 -2.65 -20.35 -1.75L-20.65 0.3L-20.65 0.85L-20.35 2.9" +
          "Q-20.05 3.75 -19.6 3.75L11.95 3.75L10.55 10.4L20.6 0.55L10.55 -9.35L11.95 -2.65"]]]] },
      // "Marker" (shape 83): the caps at the two celestial poles
      marker: { nz: false, layers: [[[["rgba(162,162,162,0.8)", "M4.05 -4.1Q5.75 -2.4 5.75 0Q5.75 2.4 4.05 4.05Q2.4 5.75 0 5.75" +
        "Q-2.4 5.75 -4.1 4.05Q-5.75 2.4 -5.75 0Q-5.75 -2.4 -4.1 -4.1Q-2.4 -5.75 0 -5.75Q2.4 -5.75 4.05 -4.1Z"]],
        [[1, "#000000", "M4.05 -4.1Q5.75 -2.4 5.75 0Q5.75 2.4 4.05 4.05Q2.4 5.75 0 5.75Q-2.4 5.75 -4.1 4.05Q-5.75 2.4 -5.75 0" +
          "Q-5.75 -2.4 -4.1 -4.1Q-2.4 -5.75 0 -5.75Q2.4 -5.75 4.05 -4.1"]]]] }
    };

    /* ---- the CelestialSphere, as CelestialEquatorialDemoClass.init sets it up ---- */
    var sph = new CS({ x: 232, y: 278 + OY });
    sph.size = 320;
    sph.latitude = 90;
    sph.showHorizonPlane = false;
    sph.addShadingClip(CS.GradientDisk, "sphereBack", "back", "inner", "both",
      { outerColor: 0xffffff, innerColor: 0xffffff, outerAlpha: 60, innerAlpha: 50 });
    sph.addShadingClip(CS.GradientDisk, "sphereFront", "front", "inner", "both",
      { outerColor: 0xffffff, innerColor: 0xffffff, outerAlpha: 20, innerAlpha: 5 });
    sph.addShadingClip(CS.shapeDrawer(ART.edge), "sphereEdge", "front", "inner", "both");

    // the Earth: a size-60 CelestialSphere of its own at the centre, holding the globe
    var inner = new CS({ x: 0, y: 0 });
    inner.size = 60;
    inner.latitude = 90;
    inner.showHorizonPlane = false;
    inner.removeClip("celestialBowl");
    inner.setMouseBehavior("none");
    // GlobeComponentV2 (not standalone): two CSLines on its sphere for the axis, styled
    // by setAxisStyle(1, 0x000000, 100), running from the surface out to axisLength 1.4
    inner.addLine("__PrecessingGlobeV2SouthPoleAxis", { alpha: 100, color: 0x000000, thickness: 1 },
      { system: "horizon", x: 0, y: 0, z: -1 }, { system: "horizon", x: 0, y: 0, z: -1.4 });
    inner.addLine("__PrecessingGlobeV2NorthPoleAxis", { alpha: 100, color: 0x000000, thickness: 1 },
      { system: "horizon", x: 0, y: 0, z: 1 }, { system: "horizon", x: 0, y: 0, z: 1.4 });
    inner.addObject("globe", globeArt, { system: "celestial", x: 0, y: 0, z: 0 });
    inner.addCircle("equator", { alpha: 100, color: 0x216331, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addObject("innerSphere", function (ctx) { inner.draw(ctx); }, { system: "celestial", x: 0, y: 0, z: 0 });

    sph.addObject("raLabel", CS.art.csLabel, { dec: 0, ra: 0 }, { labelColor: RA_COLOR });
    sph.addObject("decLabel", CS.art.csLabel, { dec: 0, ra: 0 }, { labelColor: DEC_COLOR });
    sph.addObject("ncpMarker", CS.shapeDrawer(ART.marker), { dec: 90, ra: 0 });
    sph.ncpMarker.setOrientationType("absolute");
    sph.addObject("scpMarker", CS.shapeDrawer(ART.marker), { dec: -90, ra: 0 });
    sph.scpMarker.setOrientationType("absolute");
    sph.addObject("rotationArrow", CS.shapeDrawer(ART.rotation), { r: 0.4, dec: 90, ra: 0 });
    sph.rotationArrow.setOrientationType("absolute");
    // the labels: a leader line and an 11 px Verdana caption, flat on the screen
    var LEAD = [-23.15, 9.15, -5.15, 2.4];          // shape 76, the leader most of them share
    function moved(l, dx, dy) { return [l[0] + dx, l[1] + dy, l[2] + dx, l[3] + dy]; }
    sph.addObject("northPoleLabel", label(moved(LEAD, 27.9, -10.65), "rd.np", 26.75, -5.25, "left"), { system: "horizon", x: 0, y: 0, z: 0.2 });
    sph.addObject("southPoleLabel", label([4.8, 1.5, 22.8, 8.3], "rd.sp", 26.75, 15, "left"), { system: "horizon", x: 0, y: 0, z: -0.2 });
    sph.addObject("equatorLabel", label(LEAD, "rd.eq", -29.15, 17.25, "right"), { system: "horizon", x: 0, y: 0, z: 0 });
    sph.addObject("ncpLabel", label(moved(LEAD, 27.9, -10.65), "rd.ncp", 26.75, -5.25, "left"), { system: "horizon", x: 0, y: 0, z: 1 });
    sph.addObject("scpLabel", label([4.8, 1.5, 22.8, 8.3], "rd.scp", 25.75, 16, "left"), { system: "horizon", x: 0, y: 0, z: -1 });
    sph.addObject("eclipticLabel", label(moved(LEAD, 31, -12.25), "rd.ecl", 30, -8, "left"), { system: "horizon", x: 0, y: 0, z: 0 });
    sph.addObject("ceLabel", label(LEAD, "rd.ce", -29.25, 16.25, "right"), { system: "horizon", x: 0, y: 0, z: 0 });
    sph.addObject("eastArrow", eastArrow, { r: 1.2, x: 0, y: 0, z: 0 });
    sph.addObject("zeroHoursLabel", label([-13.25, -5.55, -2.5, -1.5], "rd.zero", -18.1, -4.35, "right"), { r: 1, ra: 0, dec: 35 });
    sph.addObject("star", function (ctx, o) { CS.art.star(ctx, o.hot); }, { dec: 0, ra: 0 });
    sph.addLine("ncpLineExtension", { alpha: 100, color: 0x505050, thickness: 2 }, { r: 1, dec: 90, ra: 0 }, { r: 1.3, dec: 90, ra: 0 });
    sph.addLine("scpLineExtension", { alpha: 100, color: 0x505050, thickness: 2 }, { r: 1, dec: -90, ra: 0 }, { r: 1.3, dec: -90, ra: 0 });
    sph.addCircle("celestialEquator", { alpha: 100, color: 0x216331, thickness: 2 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("meridian1", { alpha: 10, color: 0x000000, thickness: 1 }, { gammaEnd: -90, gammaStart: 90, tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("meridian2", { alpha: 10, color: 0x000000, thickness: 1 }, { tilt: 90, dec: 0, ra: 6 });
    sph.addCircle("zeroHoursCircle", { alpha: 100, color: 0x216331, thickness: 2 }, { gammaEnd: 90, gammaStart: -90, tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("ecliptic", { alpha: 100, color: 0x9930df, thickness: 2 }, { tilt: 23.5, dec: 0, ra: 0 });
    sph.addCircle("raCircle", { alpha: 100, color: 0xa0a0a0, thickness: 1 }, { tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("decCircle", { alpha: 100, color: 0xa0a0a0, thickness: 1 }, { tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("raArc", { alpha: 100, color: RA_COLOR, thickness: 3 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("decArc", { alpha: 100, color: DEC_COLOR, thickness: 3 }, { tilt: 90, dec: 0, ra: 0 });
    sph.onMouseUpdate = onSphereOrientationChanged;

    function label(line, key, x, y, align) {
      return function (ctx) {
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(line[0], line[1]); ctx.lineTo(line[2], line[3]); ctx.stroke();
        ctx.fillStyle = "#000000"; ctx.font = "11px " + FONT;
        ctx.textAlign = align; ctx.textBaseline = "alphabetic";
        FlashText.fillStatic(ctx, I18N.t(key), x, y, align);
      };
    }
    // "East Arrow": shape 148 and a centred 12 px Verdana field under it
    function eastArrow(ctx) {
      CS.drawShape(ctx, ART.east);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, I18N.t("rd.east"), -1, 10.95 + 1.0059 * 12, "center");
    }
    /* "Globe Component v2" inside the size-60 sphere: globeMC is scaled to
       2·r·size = 60 %, so the library's 50-unit water and land discs come out
       30 px across — the sphere's own radius — and the land is masked by the
       coastlines, projected through the sphere exactly as the globe's update()
       does it (the q matrix is the identity: no rotation, no precession).    */
    var GLOBE_K = 0.6;
    function shore(x, y, z) { return inner.CtoSz({ x: x, y: y, z: z }); }
    function globeArt(ctx) {
      ctx.save();
      ctx.scale(GLOBE_K, GLOBE_K);
      CS.drawShape(ctx, ART.water);
      ctx.restore();
      var rings = EARTH.ringPaths(shore, inner.r);
      for (var i = 0; i < rings.length; i++) {
        ctx.save();
        ctx.clip(rings[i], "evenodd");
        ctx.scale(GLOBE_K, GLOBE_K);
        CS.drawShape(ctx, ART.land);
        ctx.restore();
      }
    }

    /* ---- CelestialEquatorialDemoClass: setStarLocation, onSphereOrientationChanged, updateLabels ---- */
    function setStarLocation(pt, skipSliderSync) {
      sph.raLabel.labelText = pt.ra.toFixed(1) + I18N.t("rd.h");
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
      star = { ra: pt.ra, dec: pt.dec };
      if (!skipSliderSync) { syncing = true; raCtl.set(pt.ra); decCtl.set(pt.dec); syncing = false; }
      S.requestDraw();
    }
    var star = { ra: 4, dec: 60 };
    function onSphereOrientationChanged() {
      var th = sph.theta;
      inner.setThetaAndPhi(th, sph.phi);
      sph.equatorLabel.setPosition({ r: 0.2, az: 394 - th, alt: 0 });
      var az = -34 - th, alt = Math.atan(Math.sin(az * Math.PI / 180) * 0.4348123749609336) * 180 / Math.PI;
      sph.eclipticLabel.setPosition({ r: 1.01, az: az, alt: alt });
      sph.ceLabel.setPosition({ r: 1.01, az: 394 - th, alt: 0 });
      sph.eastArrow.setPosition({ r: 1.15, az: 0 - th, alt: 0 });
      sph.eastArrow.setOrientationType("absolute");
    }
    function updateLabels() {
      sph.eastArrow.visible = optEast.value();
      sph.ecliptic.visible = optEcl.value();
      sph.eclipticLabel.visible = optEcl.value();
      sph.northPoleLabel.visible = optPoles.value();
      sph.southPoleLabel.visible = optPoles.value();
      sph.equatorLabel.visible = optEq.value();
      sph.ncpLabel.visible = optCelPoles.value();
      sph.scpLabel.visible = optCelPoles.value();
      sph.ceLabel.visible = optCelEq.value();
      sph.zeroHoursLabel.visible = optZero.value();
      S.requestDraw();
    }
    function setAll(b) {
      syncing = true;
      [optPoles, optEq, optCelPoles, optCelEq, optZero, optEast, optEcl].forEach(function (o) { o.set(b); });
      syncing = false;
      updateLabels();
    }
    function reset() {
      setStarLocation({ dec: 60, ra: 4 });
      sph.setThetaAndPhi(217, 32);
      onSphereOrientationChanged();
      setAll(false);
    }

    /* ---- controls: the Star Position and Labels panels ---- */
    S.group("rd.pos");
    var raCtl = S.slider({ labelKey: "rd.ra", min: 0, max: 24, step: 0.1, value: 4,
      format: function (v) { return v.toFixed(1) + " " + I18N.t("rd.h"); },
      on: function (v) { if (!syncing) setStarLocation({ ra: v, dec: decCtl.value() }, true); } });
    var decCtl = S.slider({ labelKey: "rd.dec", min: -90, max: 90, step: 0.1, value: 60,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { if (!syncing) setStarLocation({ ra: raCtl.value(), dec: v }, true); } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "rd.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.group("rd.labels");
    S.button({ labelKey: "rd.showAll", on: function () { setAll(true); } });
    S.button({ labelKey: "rd.hideAll", on: function () { setAll(false); } });
    function onToggle() { if (!syncing) updateLabels(); }
    var optPoles = S.toggle({ labelKey: "rd.lPoles", value: false, on: onToggle });
    var optEq = S.toggle({ labelKey: "rd.lEquator", value: false, on: onToggle });
    var optCelPoles = S.toggle({ labelKey: "rd.lCelPoles", value: false, on: onToggle });
    var optCelEq = S.toggle({ labelKey: "rd.lCelEq", value: false, on: onToggle });
    var optZero = S.toggle({ labelKey: "rd.lZero", value: false, on: onToggle });
    var optEast = S.toggle({ labelKey: "rd.lEast", value: false, on: onToggle });
    var optEcl = S.toggle({ labelKey: "rd.lEcliptic", value: false, on: onToggle });
    S.button({ labelKey: "rd.reset", on: reset });

    /* ---- pointer: the Draggable Star, else the sphere's simple drag ---- */
    function at(ev) { return CS.canvasPoint(S.canvas, ev, S.W, S.H); }
    function onStar(p) {
      var o = sph.star;
      if (!o.shown) return false;
      var q = o.toLocal(p.x, p.y);
      return q.x * q.x + q.y * q.y <= 10.5 * 10.5;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (onStar(p) && sph.star.screen.z > 0) drag = "star";
      else if (sph.startDrag(p.x, p.y)) drag = "sphere";
      else return;
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      ev.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) {
        var hot = onStar(p) && sph.star.screen.z > 0;
        if (hot !== !!sph.star.hot) { sph.star.hot = hot; S.requestDraw(); }
        return;
      }
      if (drag === "star") {                        // onMouseMoveFunc: getMouseRaDec at the mouse
        var c = sph.getMouseRaDec(p.x, p.y);
        if (c.ra !== null) setStarLocation({ ra: c.ra, dec: c.dec });
      } else { sph.dragTo(p.x, p.y); S.requestDraw(); }
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; sph.endDrag(); });
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (!drag && sph.star.hot) { sph.star.hot = false; S.requestDraw(); }
    });

    /* ---- drawing: the panel, then the sphere ---- */
    S.onDraw(function () {
      var ctx = S.ctx, title = I18N.t("rd.title");
      FlashText.begin(ctx);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      var b = PANEL;                                // Panel Background, a 14 px #333333 title
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      ctx.fillStyle = "#333333"; ctx.font = "14px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, title, b.x + 5, b.y + 4 + 1.0059 * 14);
      ctx.strokeStyle = "#cccccc"; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(b.x + 10 + FlashText.textWidth(ctx, title), b.y + 14.44); ctx.lineTo(b.x + b.w - 5, b.y + 14.44);
      ctx.stroke(); ctx.lineCap = "butt";
      ctx.save();
      ctx.beginPath(); ctx.rect(b.x + 1, b.y + 1, b.w - 2, b.h - 2); ctx.clip();
      sph.draw(ctx);
      ctx.restore();
    });
    // the RA label's unit follows the language
    window.addEventListener("langchange", function () { setStarLocation(star, true); });

    reset();
  }
});
