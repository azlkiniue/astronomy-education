/* Azimuth/Altitude Demonstrator -----------------------------------------------
   Faithful rebuild of the ClassAction "Azimuth/Altitude Demonstrator"
   (altazimuth.swf, AltAzDemoClass over the UNL CelestialSphere engine, both
   decompiled): the SWF's "The Horizon Diagram" panel, drawn with the shared
   engine in _celestialsphere.js exactly as AltAzDemoClass.init sets it up — a
   320 px sphere of white glass, the observer at the centre of the green horizon
   plane, the meridian, the star's vertical circle and its altitude circle, and
   the two measured arcs: azimuth (blue) along the horizon from north, altitude
   (red) up the star's vertical circle, each with its value label.
     • Star Position — az 0–360°, alt −90–90° (the star is also draggable;
       a star round the back of the sphere passes the press on to the sphere),
     • Labels — show all / hide all, and the zenith, horizon plane, nadir and
       meridian labels one by one,
     • drag the sphere to turn it ("simple drag": a radian per sphere radius). */
Sim.create({
  id: "altazimuth",
  width: 464, height: 480,
  strings: {
    en: {
      "aa.pos": "Star Position", "aa.az": "az", "aa.alt": "alt",
      "aa.dragHint": "you can also change the star's position by dragging it",
      "aa.labels": "Labels", "aa.showAll": "show all", "aa.hideAll": "hide all",
      "aa.zenith": "Zenith", "aa.horizon": "Horizon Plane", "aa.nadir": "Nadir", "aa.meridian": "Meridian",
      "aa.title": "The Horizon Diagram", "aa.reset": "Reset",
      "dir.N": "N", "dir.S": "S", "dir.E": "E", "dir.W": "W"
    },
    id: {
      "aa.pos": "Posisi Bintang", "aa.az": "az", "aa.alt": "alt",
      "aa.dragHint": "posisi bintang juga bisa diubah dengan menyeretnya",
      "aa.labels": "Label", "aa.showAll": "tampilkan semua", "aa.hideAll": "sembunyikan semua",
      "aa.zenith": "Zenit", "aa.horizon": "Bidang Horizon", "aa.nadir": "Nadir", "aa.meridian": "Meridian",
      "aa.title": "Diagram Horizon", "aa.reset": "Atur ulang",
      "dir.N": "U", "dir.S": "S", "dir.E": "T", "dir.W": "B"
    }
  },
  about: {
    en: "<p>The <strong>horizon (alt-azimuth) system</strong> pins any object in the sky with two angles measured by a local observer. <strong>Altitude</strong> is the angle up from the horizon (0° at the horizon, 90° straight overhead at the zenith). <strong>Azimuth</strong> is the compass bearing of the point directly below the object, measured from due north through east (N = 0°, E = 90°, S = 180°, W = 270°).</p>" +
        "<p>Drag the star around the sphere, or set its azimuth and altitude with the sliders. The red arc traces the altitude up the star's vertical circle; the blue arc along the green horizon plane traces the azimuth from north. Drag anywhere else on the sphere to turn it.</p>" +
        "<p>This system is wonderfully intuitive — it's how you'd point at a star — but it's tied to <em>your</em> location and the <em>moment</em>: as Earth turns, every star's altitude and azimuth change. That's why catalogues instead use the fixed equatorial (RA/Dec) system.</p>",
    id: "<p><strong>Sistem horizon (alt-azimut)</strong> menetapkan posisi benda langit dengan dua sudut yang diukur pengamat lokal. <strong>Altitudo</strong> adalah sudut naik dari horizon (0° di horizon, 90° tepat di atas kepala di zenit). <strong>Azimut</strong> adalah arah kompas titik tepat di bawah benda, diukur dari utara melalui timur (U = 0°, T = 90°, S = 180°, B = 270°).</p>" +
        "<p>Seret bintang mengelilingi bola, atau atur azimut dan altitudonya dengan penggeser. Busur merah menelusuri altitudo pada lingkaran vertikal bintang; busur biru di bidang horizon hijau menelusuri azimut dari utara. Seret bagian lain bola untuk memutarnya.</p>" +
        "<p>Sistem ini sangat intuitif — seperti cara kamu menunjuk bintang — tetapi terikat pada <em>lokasi</em> dan <em>saat</em>-mu: seiring Bumi berputar, altitudo dan azimut tiap bintang berubah. Karena itu katalog memakai sistem ekuatorial (AR/Dek) yang tetap.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif";
    var OY = -30;                                   // the SWF's title bar is the page header here
    var PANEL = { x: 7, y: 37 + OY, w: 450, h: 466 };   // Panel Background 300×150 at (1.5, 3.107)
    var AZ_COLOR = 0x5645f5, ALT_COLOR = 0xa63843;  // AltAzDemoClass.azColor / altColor
    var syncing = false, drag = null;

    /* ---- the CelestialSphere, as AltAzDemoClass.init sets it up ---- */
    var CS = window.CelestialSphere, sph = new CS({ x: 232, y: 278 + OY });
    sph.size = 320;
    sph.minViewerAltitude = 7;
    sph.addShadingClip(CS.GradientDisk, "sphereBack", "back", "inner", "both",
      { outerColor: 0xffffff, innerColor: 0xffffff, outerAlpha: 60, innerAlpha: 50 });
    sph.addShadingClip(CS.GradientDisk, "sphereFront", "front", "inner", "both",
      { outerColor: 0xffffff, innerColor: 0xffffff, outerAlpha: 20, innerAlpha: 5 });
    sph.addObject("azLabel", CS.art.csLabel, { alt: 0, az: 0 }, { labelColor: AZ_COLOR });
    sph.addObject("altLabel", CS.art.csLabel, { alt: 0, az: 0 }, { labelColor: ALT_COLOR });
    sph.addObject("stickfigure", CS.art.stickfigureAltaz, { system: "horizon", x: 0, y: 0, z: 0 }, { _yscale: 120, _xscale: 120 });
    sph.stickfigure.setOrientationType("absolute", { system: "horizon", x: -1, y: 0, z: 0 }, { system: "horizon", x: 0, y: 0, z: 1 });
    sph.minViewerAltitude = 1;
    sph.addHorizonPlaneClip(CS.directionLabels(function () {
      return { N: I18N.t("dir.N"), S: I18N.t("dir.S"), E: I18N.t("dir.E"), W: I18N.t("dir.W") };
    }), "aboveLabels", "above");
    sph.addObject("zenithMarker", marker, { alt: 90, az: 0 }, { labelText: "" });
    sph.zenithMarker.setOrientationType("absolute");
    sph.addObject("nadirMarker", marker, { alt: -90, az: 0 }, { labelText: "" });
    sph.nadirMarker.setOrientationType("absolute");
    sph.addLine("npLine", { alpha: 100, color: 0x505050, thickness: 2 }, { r: 1, alt: 90, az: 0 }, { r: 1.2, alt: 90, az: 0 });
    sph.addLine("spLine", { alpha: 100, color: 0x505050, thickness: 2 }, { r: 1, alt: -90, az: 0 }, { r: 1.2, alt: -90, az: 0 });
    // the four labels: a leader line and an 11 px Verdana caption, flat on the screen
    sph.addObject("zenithLabel", label([4.75, -4.25, 24.5, -24], "aa.zenith", 26.75, -20.25, "left"), { system: "horizon", x: 0, y: 0, z: 1 });
    sph.addObject("nadirLabel", label([4.5, 4, 23.5, 24], "aa.nadir", 25.75, 28.4, "left"), { system: "horizon", x: 0, y: 0, z: -1 });
    sph.addObject("horizonLabel", label([-23.15, 9.15, -5.15, 2.4], "aa.horizon", -29.25, 16.25, "right"), { system: "horizon", x: 0, y: 0, z: 0 });
    sph.addObject("meridianLabel", label([-24.35, -6.5, -5.25, -1.65], "aa.meridian", -27.05, -3.75, "right"), { r: 1, az: 180, alt: 35 });
    sph.addCircle("meridian2", { alpha: 10, color: 0x000000, thickness: 1 }, { tilt: 90, alt: 0, az: 90 });
    sph.addCircle("azCircle", { alpha: 100, color: 0xa0a0a0, thickness: 1 }, { tilt: 90, alt: 0, az: 0 });
    sph.addCircle("altCircle", { alpha: 100, color: 0xa0a0a0, thickness: 1 }, { tilt: 90, alt: 0, az: 0 });
    sph.addCircle("meridian", { alpha: 100, color: 0x216331, thickness: 2 }, { tilt: 90, alt: 0, az: 0 });
    sph.addCircle("azArc", { alpha: 100, color: AZ_COLOR, thickness: 3 }, { tilt: 0, alt: 0, az: 0 });
    sph.addCircle("altArc", { alpha: 100, color: ALT_COLOR, thickness: 3 }, { tilt: 90, alt: 0, az: 0 });
    sph.addObject("star", function (ctx, o) { CS.art.star(ctx, o.hot); }, { alt: 0, az: 0 });
    sph.onMouseUpdate = onSphereOrientationChanged;

    /* ---- the art: Marker (shape 70), and the Zenith / Nadir / Horizon Plane / Meridian labels ---- */
    function marker(ctx) {
      ctx.beginPath(); ctx.arc(0, 0, 5.75, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(162,162,162,0.8)"; ctx.fill();
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.stroke();
    }
    function label(line, key, x, y, align) {
      return function (ctx) {
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(line[0], line[1]); ctx.lineTo(line[2], line[3]); ctx.stroke();
        ctx.fillStyle = "#000000"; ctx.font = "11px " + FONT;
        ctx.textAlign = align; ctx.textBaseline = "alphabetic";
        FlashText.fillStatic(ctx, I18N.t(key), x, y, align);
      };
    }

    /* ---- AltAzDemoClass: setStarLocation, onSphereOrientationChanged, updateLabels ---- */
    function setStarLocation(pt, skipSliderSync) {
      if (pt.az !== 360) pt.az = ((pt.az % 360) + 360) % 360;
      sph.azLabel.labelText = pt.az.toFixed(1) + "°";
      sph.azLabel.setPosition({ r: 1.001, alt: 5, az: pt.az - 13 });
      sph.azLabel.setOrientationType("absolute");
      sph.altLabel.labelText = pt.alt.toFixed(1) + "°";
      sph.altLabel.setPosition({ r: 1.001, alt: pt.alt / 2, az: pt.az + 13 });
      sph.altLabel.setOrientationType("absolute");
      sph.star.setPosition(pt);
      sph.star.setOrientationType("absolute");
      if (pt.az !== 0) { sph.azArc.setParameters({ gammaEnd: 0, gammaStart: 360 - pt.az, tilt: 0, alt: 0, az: 0 }); sph.azArc.visible = true; }
      else sph.azArc.visible = false;
      sph.azCircle.setParameters({ gammaEnd: 90, gammaStart: -90, tilt: 90, alt: 0, az: pt.az });
      if (pt.alt < 0) { sph.altArc.setParameters({ gammaEnd: 0, gammaStart: pt.alt, tilt: 90, alt: 0, az: pt.az }); sph.altArc.visible = true; }
      else if (pt.alt > 0) { sph.altArc.setParameters({ gammaEnd: pt.alt, gammaStart: 0, tilt: 90, alt: 0, az: pt.az }); sph.altArc.visible = true; }
      else sph.altArc.visible = false;
      sph.altCircle.setParameters({ tilt: 0, alt: pt.alt, az: 0 });
      if (!skipSliderSync) { syncing = true; azCtl.set(pt.az); altCtl.set(pt.alt); syncing = false; }
      S.requestDraw();
    }
    function onSphereOrientationChanged() {        // the horizon label follows the view round
      sph.horizonLabel.setPosition({ r: 1, az: 394 - sph.theta, alt: 0 });
    }
    function updateLabels() {
      sph.zenithLabel.visible = optZen.value();
      sph.horizonLabel.visible = optHor.value();
      sph.nadirLabel.visible = optNad.value();
      sph.meridianLabel.visible = optMer.value();
      S.requestDraw();
    }
    function setAll(b) {
      syncing = true; [optZen, optHor, optNad, optMer].forEach(function (o) { o.set(b); }); syncing = false;
      updateLabels();
    }
    function reset() {
      setStarLocation({ alt: 45, az: 140 });
      sph.setThetaAndPhi(190, 28);
      onSphereOrientationChanged();
      setAll(false);
    }

    /* ---- controls: the Star Position and Labels panels ---- */
    S.group("aa.pos");
    var azCtl = S.slider({ labelKey: "aa.az", min: 0, max: 360, step: 0.1, value: 140,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { if (!syncing) setStarLocation({ alt: altCtl.value(), az: v }, true); } });
    var altCtl = S.slider({ labelKey: "aa.alt", min: -90, max: 90, step: 0.1, value: 45,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { if (!syncing) setStarLocation({ alt: v, az: azCtl.value() }, true); } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "aa.dragHint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.group("aa.labels");
    S.button({ labelKey: "aa.showAll", on: function () { setAll(true); } });
    S.button({ labelKey: "aa.hideAll", on: function () { setAll(false); } });
    function onToggle() { if (!syncing) updateLabels(); }
    var optZen = S.toggle({ labelKey: "aa.zenith", value: false, on: onToggle });
    var optHor = S.toggle({ labelKey: "aa.horizon", value: false, on: onToggle });
    var optNad = S.toggle({ labelKey: "aa.nadir", value: false, on: onToggle });
    var optMer = S.toggle({ labelKey: "aa.meridian", value: false, on: onToggle });
    S.button({ labelKey: "aa.reset", on: reset });

    /* ---- pointer: the AzAlt Draggable Star, else the sphere's simple drag ---- */
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
      if (drag === "star") {                        // onMouseMoveFunc: StoMH at the mouse
        var h = sph.screenToHorizon(p.x, p.y);
        setStarLocation({ alt: h.alt, az: h.az });
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
      var ctx = S.ctx, title = I18N.t("aa.title");
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
    window.addEventListener("langchange", function () { S.requestDraw(); });

    reset();
  }
});
