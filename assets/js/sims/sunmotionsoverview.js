/* Sun Motions Overview -----------------------------------------------------------
   Faithful rebuild of the ClassAction "sunmotionsoverview.swf" (sprite105,
   decompiled). One horizon sphere and four steps, revealed by checkbox exactly
   as the SWF's stepOneChanged … stepFourChanged do: the celestial poles, the
   celestial equator, the equinox path, and the two solstice paths.

   The SWF's own numbers: viewerAzimuth 200 (so theta = −200 = 160°),
   viewerAltitude 40, size 250, latitude 41, meridians white at 20 %, the poles
   #75a9ff at 3 px, the equator #ffe375 at 3 px, and the Sun's paths red.      */
Sim.create({
  id: "sunmotionsoverview",
  width: 600, height: 600,
  strings: {
    en: {
      "so.ctl": "Latitude", "so.lat": "latitude",
      "so.steps": "Build up the sky",
      "so.s1": "Step 1: show the poles", "so.s2": "Step 2: show the celestial equator",
      "so.s3": "Step 3: show the equinox path", "so.s4": "Step 4: show the solstice paths",
      "so.rNCP": "north celestial pole", "so.rNoon": "sun's noon altitude at the equinox",
      "so.rSum": "at the summer solstice", "so.rWin": "at the winter solstice",
      "so.hint": "Drag the sphere to swing the view. The Sun's daily path is always parallel to the celestial equator — only its declination changes through the year.",
      "so.ncp": "NCP", "so.scp": "SCP", "so.ce": "Celestial Equator",
      "so.eq": "Equinox Path", "so.ss": "Summer Solstice Path", "so.ws": "Winter Solstice Path",
      "so.N": "N", "so.E": "E", "so.S": "S", "so.W": "W"
    },
    id: {
      "so.ctl": "Lintang", "so.lat": "lintang",
      "so.steps": "Bangun langitnya",
      "so.s1": "Tahap 1: tampilkan kutub", "so.s2": "Tahap 2: tampilkan ekuator langit",
      "so.s3": "Tahap 3: tampilkan jalur ekuinoks", "so.s4": "Tahap 4: tampilkan jalur soltis",
      "so.rNCP": "kutub langit utara", "so.rNoon": "ketinggian matahari tengah hari saat ekuinoks",
      "so.rSum": "saat soltis musim panas", "so.rWin": "saat soltis musim dingin",
      "so.hint": "Seret bolanya untuk mengubah arah pandang. Jalur harian Matahari selalu sejajar ekuator langit — hanya deklinasinya yang berubah sepanjang tahun.",
      "so.ncp": "KLU", "so.scp": "KLS", "so.ce": "Ekuator Langit",
      "so.eq": "Jalur Ekuinoks", "so.ss": "Jalur Soltis Musim Panas", "so.ws": "Jalur Soltis Musim Dingin",
      "so.N": "U", "so.E": "T", "so.S": "S", "so.W": "B"
    }
  },
  about: {
    en: "<p>Build the sky up one piece at a time and the Sun's motion stops being mysterious. First the celestial poles: the sky turns about the line through them, and the visible pole sits at an altitude equal to your latitude. Then the celestial equator, the circle exactly 90° from both poles, which meets your horizon due east and due west whatever your latitude.</p>" +
        "<p>On the equinoxes the Sun sits on the celestial equator, so it rises due east, sets due west, and is up for twelve hours. On the solstices it runs a parallel circle 23.4° above or below — rising and setting well north or well south of east and west, and spending correspondingly more or less of the circle above the horizon.</p>" +
        "<p>Every daily path is parallel to the celestial equator, tilted from vertical by your latitude. Slide the latitude and watch the whole structure tip: at the pole the paths lie flat and the Sun circles without setting, and at the equator they stand upright and every day is twelve hours long.</p>",
    id: "<p>Bangunlah langit sepotong demi sepotong, maka gerak Matahari tak lagi terasa membingungkan. Mula-mula kutub langit: langit berputar pada garis yang menembus keduanya, dan kutub yang tampak berada pada ketinggian yang sama dengan lintang Anda. Lalu ekuator langit, lingkaran yang tepat 90° dari kedua kutub, yang memotong ufuk Anda tepat di timur dan tepat di barat berapa pun lintangnya.</p>" +
        "<p>Pada ekuinoks Matahari berada di ekuator langit, sehingga ia terbit tepat di timur, terbenam tepat di barat, dan berada di atas ufuk selama dua belas jam. Pada soltis ia menempuh lingkaran sejajar 23,4° di atas atau di bawahnya — terbit dan terbenam jauh di utara atau jauh di selatan titik timur dan barat, dan menghabiskan bagian lingkaran yang lebih besar atau lebih kecil di atas ufuk.</p>" +
        "<p>Setiap jalur harian sejajar ekuator langit, condong dari tegak sebesar lintang Anda. Geser lintangnya dan amati seluruh susunan itu miring: di kutub jalur-jalur itu mendatar dan Matahari beredar tanpa terbenam, sedangkan di ekuator jalur-jalur itu tegak dan setiap hari berlangsung dua belas jam.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var FONT = "Verdana, Geneva, sans-serif";
    var K = 2;                                      // the SWF's 300 px stage, drawn at twice the size
    var lat = 41, drag = null;
    var step = { one: false, two: false, three: false, four: false };

    S.group("so.ctl");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "so.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.slider({ labelKey: "so.lat", min: -90, max: 90, value: 41, step: 1,
      format: function (v) { return Math.abs(v).toFixed(0) + "° " + (v < 0 ? "S" : "N"); },
      on: function (v) { lat = v; sph.latitude = v; upd(); } });   // changeLatitude
    S.group("so.steps");
    var HANDLERS = { one: stepOneChanged, two: stepTwoChanged, three: stepThreeChanged, four: stepFourChanged };
    [["one", "so.s1"], ["two", "so.s2"], ["three", "so.s3"], ["four", "so.s4"]]
      .forEach(function (p) {
        S.toggle({ labelKey: p[1], value: false,
          on: (function (k) { return function (b) { step[k] = b; HANDLERS[k](); S.requestDraw(); }; })(p[0]) });
      });
    var outNCP = S.readout({ labelKey: "so.rNCP" });
    var outNoon = S.readout({ labelKey: "so.rNoon" });
    var outSum = S.readout({ labelKey: "so.rSum" });
    var outWin = S.readout({ labelKey: "so.rWin" });

    function noon(dec) {
      var a = 90 - Math.abs(lat - dec);
      return (a > 90 ? 180 - a : a).toFixed(1) + "°";
    }
    function upd() {
      outNCP(Math.abs(lat).toFixed(0) + "° " + I18N.t(lat >= 0 ? "so.N" : "so.S"));
      outNoon(noon(0));
      outSum(noon(23.5));
      outWin(noon(-23.5));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- the CelestialSphere, as sprite105 sets it up (sphere at (147, 140) on the stage) ---- */
    var CS = window.CelestialSphere, sph = new CS({ x: 147, y: 140 });
    sph.viewerAzimuth = 200;
    sph.viewerAltitude = 40;
    sph.size = 250;
    sph.sortObjects = false;
    sph.addObject("stickman", CS.art.stickmanSmall, { system: "horizon", x: 0, y: 0, z: 0 });
    sph.stickman.setOrientationType("skewed", { az: 0, alt: 90 });
    sph.addCircle("meridianCircle1", { alpha: 20, color: 0xffffff, thickness: 1 }, { tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("meridianCircle2", { alpha: 20, color: 0xffffff, thickness: 1 }, { tilt: 90, dec: 0, ra: 6 });
    var DISC = "M70.7 -70.7Q100 -41.4 100 0Q100 41.4 70.7 70.7Q41.4 100 0 100Q-41.4 100 -70.7 70.7Q-100 41.4 -100 0" +
      "Q-100 -41.4 -70.7 -70.7Q-41.4 -100 0 -100Q41.4 -100 70.7 -70.7Z";
    // "sphere outside" (shape 67) and "sphere outside2" (shape 65)
    sph.addShadingClip(CS.shapeDrawer({ nz: false, layers: [[[[{ t: "r", m: [0.17511, 0, 0, 0.17511, 35, -25],
      s: [[0, "rgba(170,170,170,0.502)"], [1, "rgba(170,170,170,0.2)"]] }, DISC]], []]] }), "outsideOfSphere", "front", "inner", "both");
    sph.addShadingClip(CS.shapeDrawer({ nz: false, layers: [[[[{ t: "r", m: [0.17511, 0, 0, 0.17511, 35, -25],
      s: [[0, "rgba(0,0,0,0.302)"], [1, "rgba(0,0,0,0.102)"]] }, DISC]], []]] }), "outsideOfSphere2", "front", "outer", "below");
    function dirs() { return { N: I18N.t("so.N"), S: I18N.t("so.S"), E: I18N.t("so.E"), W: I18N.t("so.W") }; }
    sph.addHorizonPlaneClip(CS.directionLabels(dirs, { color: "#999999" }), "belowLabels", "below");
    sph.addHorizonPlaneClip(CS.directionLabels(dirs), "aboveLabels", "above");
    sph.setLatitude(41);

    /* ---- the four steps (stepOneChanged … stepFourChanged) ---- */
    function stepOneChanged() {
      if (step.one) {
        sph.addLine("ncpAxis", { alpha: 100, color: 0x75a9ff, thickness: 3 }, { system: "celestial", x: 0, y: 0, z: 0 }, { system: "celestial", x: 0, y: 0, z: 1.2 });
        sph.addLine("scpAxis", { alpha: 100, color: 0x75a9ff, thickness: 3 }, { system: "celestial", x: 0, y: 0, z: 0 }, { system: "celestial", x: 0, y: 0, z: -1.2 });
        addDeclinationText(4, "so.ncp", 0, 85, 0.5);
        addDeclinationText(5, "so.ncp", 12, 85, 0.5);
        addDeclinationText(6, "so.scp", 0, -85, 0.5);
        addDeclinationText(7, "so.scp", 12, -85, 0.5);
      } else {
        sph.ncpAxis.remove(); sph.scpAxis.remove();
        [4, 5, 6, 7].forEach(function (id) { setDeclinationTextVisibility(id, false); });
      }
    }
    function stepTwoChanged() {
      if (step.two) {
        sph.addCircle("celestialEquator", { alpha: 100, color: 0xffe375, thickness: 3 }, { tilt: 0, dec: 0, ra: 0 });
        addDeclinationText(100, "so.ce", 0, 0.7, 0.5);
        setDeclinationTextVisibility(101, false);
      } else {
        sph.celestialEquator.remove();
        setDeclinationTextVisibility(100, false);
        if (step.three) setDeclinationTextVisibility(101, true);
      }
    }
    function stepThreeChanged() {
      if (step.three) {
        sph.addCircle("equinoxPath", { alpha: 100, color: 0xff0000, thickness: 3 }, { tilt: 0, dec: 0, ra: 0 });
        addDeclinationText(101, "so.eq", 0, 0.7, 0.5);
        setDeclinationTextVisibility(100, false);
      } else {
        sph.equinoxPath.remove();
        setDeclinationTextVisibility(101, false);
        if (step.two) setDeclinationTextVisibility(100, true);
      }
    }
    function stepFourChanged() {
      if (step.four) {
        sph.addCircle("sSolsticePath", { alpha: 100, color: 0xff0000, thickness: 3 }, { tilt: 0, dec: 23.5, ra: 0 });
        sph.addCircle("wSolsticePath", { alpha: 100, color: 0xff0000, thickness: 3 }, { tilt: 0, dec: -23.5, ra: 0 });
        addDeclinationText(102, "so.ss", 0, 23.5, 0.5);
        addDeclinationText(103, "so.ws", 0, -23.5, 0.5);
      } else {
        sph.sSolsticePath.remove(); sph.wSolsticePath.remove();
        setDeclinationTextVisibility(102, false);
        setDeclinationTextVisibility(103, false);
      }
    }
    /* addDeclinationText: the caption set letter by letter round its own declination
       circle ("Verdana Letter", bold 12, white), each letter flat on the sphere. The
       letters run eastward when the latitude is north at the moment they are added,
       westward otherwise, each one upright toward the celestial pole. */
    var decText = {}, decTextIndex = 0;
    function extent(ctx, ch) { ctx.font = "bold 12px " + FONT; return ctx.measureText(ch).width; }
    function addDeclinationText(id, key, ra, dec, gap) {
      if (decText[id]) decText[id].forEach(function (o) { o.remove(); });
      var ctx = S.ctx, str = I18N.t(key), r = Math.cos(dec * RAD) * (sph.size / 2);
      var spacing = gap * extent(ctx, " ") / r, letters = str.split(""), ras = [], cursor = 0, i;
      for (i = 0; i < letters.length; i++) {
        var a = extent(ctx, letters[i]) / r;
        ras.push(3.819718634205488 * (cursor + a / 2));
        cursor += a + spacing;
      }
      cursor -= spacing;
      var offset = 3.819718634205488 * (cursor / 2), list = [];
      for (i = 0; i < letters.length; i++) {
        var pr = sph.latitude > 0 ? ra + ras[i] - offset : ra - ras[i] + offset;
        var o = sph.addObject("_dt" + decTextIndex, letterGlyph, { ra: pr, dec: dec }, { letter: letters[i] });
        // (the SWF's 'up' names an undefined variable, which a SWF6 player reads as 0:
        // it comes out as the pole, ra ∓ offset at dec ±90)
        o.setOrientationType("absolute", { ra: pr, dec: dec },
          sph.latitude > 0 ? { ra: ra - offset, dec: 90 } : { ra: ra + offset, dec: -90 });
        list.push(o);
        decTextIndex++;
      }
      decText[id] = list;
      decText[id].key = key; decText[id].args = [ra, dec, gap];
    }
    function setDeclinationTextVisibility(id, on) {
      (decText[id] || []).forEach(function (o) { o.visible = on; });
    }
    function letterGlyph(ctx, o) {                  // Verdana Letter: a centred field, top −7.25
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, o.letter, 0, -7.25 + 1.0059 * 12, "center");
    }
    // a language switch re-sets the captions that are showing, in their own direction
    window.addEventListener("langchange", function () {
      Object.keys(decText).forEach(function (id) {
        var L = decText[id], vis = L.length && L[0].visible, a = L.args;
        addDeclinationText(+id, L.key, a[0], a[1], a[2]);
        setDeclinationTextVisibility(+id, vis);
      });
    });

    /* ---- the sphere's own "simple drag" (no lower limit here: the SWF sets none) ---- */
    function at(ev) { var p = CS.canvasPoint(S.canvas, ev, S.W, S.H); return { x: p.x / K, y: p.y / K }; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (!sph.startDrag(p.x, p.y)) return;
      drag = true;
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      sph.dragTo(p.x, p.y);
      S.requestDraw();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; sph.endDrag(); });
    });

    /* ================================= drawing ============================== */
    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.save();
      ctx.scale(K, K);
      sph.draw(ctx);
      ctx.restore();
    });
    void TAU;
    upd();
  }
});
