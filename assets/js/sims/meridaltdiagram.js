/* Meridional Altitude Simulator ------------------------------------------------
   Faithful rebuild of the ClassAction "meridaltdiagram.swf" — geometry, colours
   and every formula taken from the SWF's own ActionScript (questionClass /
   diagClass). Two linked diagrams on the SWF's charcoal panel:

     • left  — Earth, with the observer's local arrows (zenith Z, north N, south S
               and the celestial pole) standing on the globe at their latitude.
               Drag the arrows around the globe to change latitude, as in the SWF.
     • right — the meridian: a half circle of sky from the north horizon through
               the zenith to the south, with the celestial pole at altitude =
               latitude and the celestial equator (CE) square to it.

   Choose an object and its declination places it on the meridian; the strip
   below spells out the meridional altitude, 90 − latitude + declination — or
   180 − (…) once the object culminates beyond the zenith.                      */
Sim.create({
  id: "meridaltdiagram",
  width: 760, height: 506,
  strings: {
    en: {
      "ma.object": "Object", "ma.none": "No Object", "ma.star": "Star", "ma.sun": "Sun",
      "ma.planet": "Planet", "ma.moon": "Moon",
      "ma.coords": "Coordinates", "ma.lat": "Latitude", "ma.dec": "Declination",
      "ma.ranges": "Ranges", "ma.sunRange": "Show Sun/Planet Range", "ma.moonRange": "Show Moon Range",
      "ma.title": "Meridional  Altitude",
      "ma.pick": "choose an object to calculate its meridional altitude",
      "ma.belowNote": "(below the horizon — at this declination it never rises here)",
      "ma.drag": "Drag the arrows on the globe to change the observer's latitude.",
      "ma.rAlt": "meridional altitude", "ma.rDir": "crosses the meridian",
      "ma.rCE": "CE altitude", "ma.rPole": "pole altitude",
      "ma.south": "due south", "ma.north": "due north", "ma.zenith": "at the zenith", "ma.below": "below horizon",
      "lb.N": "N", "lb.S": "S", "lb.Z": "Z", "lb.NCP": "NCP", "lb.SCP": "SCP", "lb.CE": "CE",
      "lb.NP": "NP", "lb.SP": "SP", "lb.EQ": "EQ"
    },
    id: {
      "ma.object": "Objek", "ma.none": "Tanpa Objek", "ma.star": "Bintang", "ma.sun": "Matahari",
      "ma.planet": "Planet", "ma.moon": "Bulan",
      "ma.coords": "Koordinat", "ma.lat": "Lintang", "ma.dec": "Deklinasi",
      "ma.ranges": "Rentang", "ma.sunRange": "Tampilkan Rentang Matahari/Planet", "ma.moonRange": "Tampilkan Rentang Bulan",
      "ma.title": "Altitudo  Meridian",
      "ma.pick": "pilih objek untuk menghitung altitudo meridiannya",
      "ma.belowNote": "(di bawah horizon — pada deklinasi ini ia tak pernah terbit di sini)",
      "ma.drag": "Seret panah pada bola Bumi untuk mengubah lintang pengamat.",
      "ma.rAlt": "altitudo meridian", "ma.rDir": "melintasi meridian",
      "ma.rCE": "altitudo EL", "ma.rPole": "altitudo kutub",
      "ma.south": "tepat di selatan", "ma.north": "tepat di utara", "ma.zenith": "di zenit", "ma.below": "di bawah horizon",
      "lb.N": "U", "lb.S": "S", "lb.Z": "Z", "lb.NCP": "KLU", "lb.SCP": "KLS", "lb.CE": "EL",
      "lb.NP": "KU", "lb.SP": "KS", "lb.EQ": "EK"
    }
  },
  about: {
    en: "<p>An object's <strong>meridional altitude</strong> is how high it stands when it crosses your <strong>meridian</strong> — the north–south line through the zenith — which is also the highest it ever gets in the sky. Two numbers settle it: your <strong>latitude</strong> and the object's <strong>declination</strong>.</p>" +
        "<p>The left diagram shows why. Your horizon is tangent to Earth where you stand, so your zenith points straight out from Earth's centre. The celestial pole is parallel to Earth's axis, which puts it at an altitude equal to your latitude, and the celestial equator, square to the pole, at 90° − latitude. An object sits its declination above or below the equator, so in the northern hemisphere its meridional altitude is <strong>90° − latitude + declination</strong>, measured up from the southern horizon.</p>" +
        "<p>If that sum passes 90°, the object has climbed over the zenith and culminates in the <em>north</em>, at 180° minus the sum. If it comes out negative, the object never rises. Turn on the Sun and Moon ranges to see how high each can ever get from your latitude: the Sun keeps within ±23.5° of the equator, the Moon within about ±29.3°.</p>",
    id: "<p><strong>Altitudo meridian</strong> sebuah objek adalah ketinggiannya saat melintasi <strong>meridian</strong> Anda — garis utara–selatan yang melewati zenit — sekaligus titik tertinggi yang pernah dicapainya di langit. Dua angka menentukannya: <strong>lintang</strong> Anda dan <strong>deklinasi</strong> objek.</p>" +
        "<p>Diagram kiri menunjukkan alasannya. Horizon Anda menyinggung Bumi di tempat Anda berdiri, sehingga zenit menunjuk lurus keluar dari pusat Bumi. Kutub langit sejajar sumbu Bumi, sehingga altitudonya sama dengan lintang Anda, dan ekuator langit, tegak lurus terhadap kutub, berada pada 90° − lintang. Objek berada sejauh deklinasinya di atas atau di bawah ekuator, sehingga di belahan utara altitudo meridiannya adalah <strong>90° − lintang + deklinasi</strong>, diukur dari horizon selatan.</p>" +
        "<p>Jika jumlah itu melewati 90°, objek telah melampaui zenit dan berkulminasi di <em>utara</em>, pada 180° dikurangi jumlah tersebut. Jika hasilnya negatif, objek tak pernah terbit. Nyalakan rentang Matahari dan Bulan untuk melihat seberapa tinggi masing-masing dapat naik dari lintang Anda: Matahari tetap dalam ±23,5° dari ekuator, Bulan dalam sekitar ±29,3°.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180;
    /* ---- the SWF's own colours (sampled from its render + questionClass) ---- */
    var C = {
      bg: "#262626", panel: "#333333", line: "#cccccc", label: "#cccccc",
      north: "#33cc99", south: "#3399cc", zenith: "#999999", pole: "#ffffcc", equator: "#ffffff",
      lat: "#d80101", dec: "#ffff00", title: "#ffffcc",
      sunRange: "rgba(255,153,153,0.4)", moonRange: "rgba(255,153,51,0.4)"
    };
    // declination limits per object, exactly as the SWF sets decSlider.min/max
    var OBJ = {
      none: { lim: 90 }, star: { lim: 90 }, sun: { lim: 23.5 }, planet: { lim: 23.5 }, moon: { lim: 29.3 }
    };

    /* ---- state: the SWF opens on No Object, 41° N; declination starts at 23.5 ---- */
    var obj = "none", lat = 41, dec = 23.5, showSun = false, showMoon = false;

    /* ---- stage geometry (SWF px), drawn at K and shifted by OFF ---- */
    var K = 1.05, OFFX = 24, OFFY = 2;
    var G = { x: 155, y: 200 }, GR = 60;          // tanDiag: globe centre + radius
    var M = { x: 477.5, y: 258.6 }, MR = 120;     // merDiag: meridian centre + radius
    var ALEN = 121.5;                              // arrow length (tip), both diagrams

    /* ================================ controls ================================ */
    S.group("ma.object");
    S.select({
      labelKey: "ma.object", value: obj,
      options: [{ v: "none", labelKey: "ma.none" }, { v: "star", labelKey: "ma.star" },
                { v: "sun", labelKey: "ma.sun" }, { v: "planet", labelKey: "ma.planet" },
                { v: "moon", labelKey: "ma.moon" }],
      on: function (v) { obj = v; applyObject(); upd(); }
    });

    S.group("ma.coords");
    var latCtl = S.slider({
      labelKey: "ma.lat", min: -90, max: 90, value: lat, step: 0.1,
      format: function (v) { return latStr(v); },
      on: function (v) { lat = Math.round(v * 10) / 10; upd(); }
    });
    var decCtl = S.slider({
      labelKey: "ma.dec", min: -90, max: 90, value: dec, step: 0.1,
      format: function (v) { return trim1(v) + "°"; },
      on: function (v) { dec = Math.round(v * 10) / 10; upd(); }
    });
    // colour-code the two slider values as the SWF does (latitude red, declination yellow)
    latCtl.input.parentNode.querySelector(".val").style.color = "#ff5a4f";
    decCtl.input.parentNode.querySelector(".val").style.color = C.dec;
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ma.drag");
    decCtl.input.parentNode.parentNode.insertBefore(hint, decCtl.input.parentNode.nextSibling);

    S.group("ma.ranges");
    S.toggle({ labelKey: "ma.sunRange", value: showSun, on: function (b) { showSun = b; } });
    S.toggle({ labelKey: "ma.moonRange", value: showMoon, on: function (b) { showMoon = b; } });

    var outAlt = S.readout({ labelKey: "ma.rAlt" });
    var outDir = S.readout({ labelKey: "ma.rDir" });
    var outCE = S.readout({ labelKey: "ma.rCE" });
    var outPole = S.readout({ labelKey: "ma.rPole" });

    function trim1(v) { var r = Math.round(v * 10) / 10; return (Math.abs(r) < 0.05 ? 0 : r).toString().replace("-", "−"); }
    function latStr(v) {
      var r = Math.round(v * 10) / 10, dir = r > 0 ? " N" : r < 0 ? " S" : "";
      if (I18N.getLang() === "id") dir = r > 0 ? " LU" : r < 0 ? " LS" : "";
      return Math.abs(r) + "°" + dir;
    }

    // switching object clamps the declination into that object's range (SWF behaviour)
    function applyObject() {
      var lim = OBJ[obj].lim;
      decCtl.input.min = -lim; decCtl.input.max = lim;
      if (dec > lim) dec = lim;
      if (dec < -lim) dec = -lim;
      decCtl.input.value = dec;
      decCtl.input.parentNode.style.display = obj === "none" ? "none" : "";
    }

    /* ---- the SWF's calcAlt(): equation text + answer, in coloured runs ---- */
    function altitude() {
      var L = Math.round(lat * 10) / 10, D = Math.round(dec * 10) / 10;
      var sum = L >= 0 ? 90 - L + D : 90 + L - D;       // measured from the S (N) horizon
      var over = sum > 90;
      var ans = Math.round((over ? 180 - sum : sum) * 10) / 10;
      // 90 − |lat| ± |dec|: the sign in front of dec flips south of the equator
      var decPlus = L >= 0 ? D >= 0 : D < 0;
      return { sum: sum, over: over, ans: ans, latTxt: String(Math.abs(L)), decTxt: String(Math.abs(D)), decPlus: decPlus };
    }
    // the SWF's moveObj(): screen angle of the object on the meridian (y down)
    function objAngle() { return lat - 90 - dec; }
    function objVisible() { var a = objAngle(); return obj !== "none" && a >= -180 && a <= 0; }

    function upd() {
      var a = altitude();
      if (obj === "none") { outAlt("–"); outDir("–"); }
      else {
        outAlt(trim1(a.ans) + "°");
        var ang = objAngle();
        outDir(I18N.t(!objVisible() ? "ma.below" : Math.abs(ang + 90) < 0.05 ? "ma.zenith" : ang > -90 ? "ma.south" : "ma.north"));
      }
      outCE(trim1(90 - Math.abs(lat)) + "°");
      outPole(trim1(Math.abs(lat)) + "°");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- drag the tangent arrows around the globe (diagClass.calculatePos) ---- */
    var dragging = false;
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      var cx = (ev.clientX - r.left) * S.W / r.width, cy = (ev.clientY - r.top) * S.H / r.height;
      return { x: (cx - OFFX) / K, y: (cy - OFFY) / K };
    }
    function observer() { return { x: G.x + GR * Math.cos(-lat * D2R), y: G.y + GR * Math.sin(-lat * D2R) }; }
    function onArrows(p) {
      var o = observer(), la = lat * D2R;
      var dirs = [[Math.cos(la), -Math.sin(la)], [-Math.sin(la), -Math.cos(la)], [Math.sin(la), Math.cos(la)], [0, lat >= 0 ? -1 : 1]];
      if (Math.hypot(p.x - o.x, p.y - o.y) < 16) return true;
      return dirs.some(function (d) {
        var t = (p.x - o.x) * d[0] + (p.y - o.y) * d[1];
        if (t < 0 || t > ALEN + 4) return false;
        return Math.abs((p.x - o.x) * d[1] - (p.y - o.y) * d[0]) < 9;
      });
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      if (!onArrows(stageXY(ev))) return;
      dragging = true; S.canvas.setPointerCapture(ev.pointerId); dragTo(ev);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (dragging) { dragTo(ev); return; }
      S.canvas.style.cursor = onArrows(stageXY(ev)) ? "grab" : "default";
    });
    S.canvas.addEventListener("pointerup", function () { dragging = false; });
    S.canvas.addEventListener("pointercancel", function () { dragging = false; });
    function dragTo(ev) {
      var p = stageXY(ev), x = Math.max(0, p.x - G.x), y = p.y - G.y;   // right half of the globe only
      if (x === 0 && y === 0) return;
      lat = Math.round(-Math.atan2(y, x) / D2R * 10) / 10;
      latCtl.input.value = lat;
      S.refreshers.forEach(function (f) { f(); });
    }

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, S.W, S.H);
      bevelPanel(ctx, 6, 6, S.W - 12, 404, 10);
      bevelPanel(ctx, 6, 416, S.W - 12, S.H - 422, 10);

      ctx.save();
      ctx.translate(OFFX, OFFY); ctx.scale(K, K);
      drawGlobe(ctx, t);
      drawMeridian(ctx, t);
      ctx.restore();

      drawEquation(ctx, t);
    });

    function drawGlobe(ctx, t) {
      var la = lat * D2R, o = observer();
      // Earth: outline, equator and polar axis, with their labels
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(G.x, G.y, GR, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(G.x - GR, G.y); ctx.lineTo(G.x + GR, G.y);
      ctx.moveTo(G.x, G.y - GR); ctx.lineTo(G.x, G.y + GR);
      ctx.stroke();
      ctx.font = "bold 10px Verdana, system-ui, sans-serif"; ctx.fillStyle = C.label;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("lb.NP"), G.x, G.y - GR - 16);
      ctx.fillText(t("lb.SP"), G.x, G.y + GR + 17);
      ctx.textAlign = "right"; ctx.fillText(t("lb.EQ"), G.x - GR - 6, G.y);

      // the observer's arrows (authored content, under the drawn wedges)
      var Z = [Math.cos(la), -Math.sin(la)], N = [-Math.sin(la), -Math.cos(la)], Sd = [Math.sin(la), Math.cos(la)];
      var P = [0, lat >= 0 ? -1 : 1];
      arrow(ctx, o.x, o.y, Z, C.zenith);
      arrow(ctx, o.x, o.y, N, C.north);
      arrow(ctx, o.x, o.y, Sd, C.south);
      arrow(ctx, o.x, o.y, P, C.pole);

      // latitude at Earth's centre (equator → observer) …
      wedge(ctx, G.x, G.y, 0, lat, C.lat);
      // … and again at the observer, between the pole and the horizon
      if (lat >= 0) wedgeDir(ctx, o.x, o.y, P, N, C.lat);
      else wedgeDir(ctx, o.x, o.y, P, Sd, C.lat);

      // zenith line from Earth's centre out to the observer
      ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(G.x, G.y); ctx.lineTo(o.x, o.y); ctx.stroke();

      // labels, placed as moveText() places them. (The SWF also positions an "S" here,
      // but its −10 px offset tucks it under the blue arrowhead, so it never shows.)
      ctx.font = "13px Verdana, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = C.zenith;
      ctx.fillText(t("lb.Z"), G.x + 180 * Math.cos(la) + 13, G.y - 180 * Math.sin(la) - 9);
      if (Math.abs(lat) !== 90) {
        ctx.fillStyle = C.north; ctx.fillText(t("lb.N"), o.x + 130 * N[0] - 4, o.y + 130 * N[1] + 1);
      }
      ctx.fillStyle = C.pole; ctx.textAlign = "left";
      ctx.fillText(t(lat >= 0 ? "lb.NCP" : "lb.SCP"), o.x + 12, lat >= 0 ? o.y - 117 : o.y + 124);
    }

    function drawMeridian(ctx, t) {
      var la = lat * D2R;
      // the meridian: sky from the north horizon, over the zenith, to the south
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(M.x, M.y, MR, Math.PI, 0); ctx.stroke();

      var P = lat >= 0 ? [-Math.cos(la), -Math.sin(la)] : [Math.cos(la), Math.sin(la)];
      var E = [Math.sin(la), -Math.cos(la)];                 // celestial equator, square to the pole
      arrow(ctx, M.x, M.y, [-1, 0], C.north);
      arrow(ctx, M.x, M.y, [1, 0], C.south);
      arrow(ctx, M.x, M.y, [0, -1], C.zenith);
      arrow(ctx, M.x, M.y, E, C.equator);
      arrow(ctx, M.x, M.y, P, C.pole);
      // right-angle mark between pole and equator
      var q = 7;
      ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(M.x + q * P[0], M.y + q * P[1]);
      ctx.lineTo(M.x + q * (P[0] + E[0]), M.y + q * (P[1] + E[1]));
      ctx.lineTo(M.x + q * E[0], M.y + q * E[1]);
      ctx.stroke();

      // the object on the meridian
      var vis = objVisible(), ang = objAngle() * D2R;
      if (vis) {
        drawObject(ctx, M.x + 123 * Math.cos(ang), M.y + 123 * Math.sin(ang));
        // declination: from the celestial equator to the object
        wedge(ctx, M.x, M.y, 90 - lat, 90 - lat + dec, C.dec);
        ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(M.x, M.y);
        ctx.lineTo(M.x + 115 * Math.cos(ang), M.y + 115 * Math.sin(ang)); ctx.stroke();
      }
      // latitude = altitude of the celestial pole above the horizon
      if (lat >= 0) wedge(ctx, M.x, M.y, 180 - lat, 180, C.lat);
      else wedge(ctx, M.x, M.y, 0, -lat, C.lat);

      // how high the Sun/planets (±23.5°) and the Moon (±29.3°) can ever culminate
      if (showSun) range(ctx, 23.5, 121, C.sunRange);
      if (showMoon) range(ctx, 29.3, 124, C.moonRange);

      // labels
      ctx.font = "13px Verdana, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = C.north; ctx.fillText(t("lb.N"), M.x - 117, M.y + 17);
      ctx.fillStyle = C.south; ctx.fillText(t("lb.S"), M.x + 117, M.y + 17);
      ctx.fillStyle = C.zenith; ctx.fillText(t("lb.Z"), M.x - 2, M.y - 129);
      var pa = (lat >= 0 ? lat + 180 : lat) * D2R;
      ctx.fillStyle = C.pole;
      ctx.fillText(t(lat >= 0 ? "lb.NCP" : "lb.SCP"), M.x + 130 * Math.cos(pa), M.y + 130 * Math.sin(pa) - 12);
      var ea = (lat - 90) * D2R;
      ctx.fillStyle = C.equator;
      ctx.fillText(t("lb.CE"), M.x + 130 * Math.cos(ea) + 7, M.y + 130 * Math.sin(ea) - 11);
    }

    // the Meridional Altitude box of the SWF, as a strip under the diagrams
    function drawEquation(ctx, t) {
      var cx = S.W / 2, y0 = 444;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "bold 19px Verdana, system-ui, sans-serif"; ctx.fillStyle = C.title;
      var tw = ctx.measureText(t("ma.title")).width;
      ctx.fillText(t("ma.title"), cx, y0 - 10);
      ctx.fillStyle = C.title; ctx.fillRect(cx - tw / 2 - 18, y0 + 3, tw + 36, 1.5);

      if (obj === "none") {
        ctx.font = "italic 13px system-ui, sans-serif"; ctx.fillStyle = "#9a9a9a";
        ctx.fillText(t("ma.pick"), cx, y0 + 26);
        return;
      }
      var a = altitude();
      var runs = [];
      if (a.over) runs.push(["180 − ( ", "#ffffff"]);
      runs.push(["90 − ", "#ffffff"], [a.latTxt, "#ff4a3d"], [a.decPlus ? " + " : " − ", "#ffffff"], [a.decTxt, C.dec]);
      if (a.over) runs.push([" )", "#ffffff"]);
      runs.push([" = " + String(a.ans).replace("-", "−") + "°", "#ffffff"]);
      ctx.font = "17px Verdana, system-ui, sans-serif";
      var w = runs.reduce(function (s, r) { return s + ctx.measureText(r[0]).width; }, 0);
      var x = cx - w / 2;
      ctx.textAlign = "left";
      runs.forEach(function (r) { ctx.fillStyle = r[1]; ctx.fillText(r[0], x, y0 + 24); x += ctx.measureText(r[0]).width; });
      if (!objVisible()) {
        ctx.textAlign = "center"; ctx.font = "italic 11.5px system-ui, sans-serif"; ctx.fillStyle = "#9a9a9a";
        ctx.fillText(t("ma.belowNote"), cx, y0 + 45);
      }
    }

    /* ---- primitives ---- */
    // an SWF arrow: 4 px shaft + slim head, tip ALEN from the origin
    function arrow(ctx, x, y, d, col) {
      var hl = 17, hw = 4.8, L = ALEN;
      var bx = x + d[0] * (L - hl), by = y + d[1] * (L - hl);
      ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = "butt";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(bx + d[0], by + d[1]); ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x + d[0] * L, y + d[1] * L);
      ctx.lineTo(bx - d[1] * hw, by + d[0] * hw);
      ctx.lineTo(bx + d[1] * hw, by - d[0] * hw);
      ctx.closePath(); ctx.fill();
    }
    // a filled 30 px wedge between two maths angles (degrees, CCW, y up)
    function wedge(ctx, x, y, a0, a1, col) {
      if (Math.abs(a1 - a0) < 0.05) return;
      ctx.fillStyle = col; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.arc(x, y, 30, -a0 * D2R, -a1 * D2R, a1 > a0);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // a wedge between two screen directions
    function wedgeDir(ctx, x, y, d0, d1, col) {
      var a0 = Math.atan2(-d0[1], d0[0]) / D2R, a1 = Math.atan2(-d1[1], d1[0]) / D2R;
      var diff = ((a1 - a0) % 360 + 540) % 360 - 180;
      wedge(ctx, x, y, a0, a0 + diff, col);
    }
    // the SWF's sunRange/moonRange fans: declinations ±lim, clipped to the horizon
    function range(ctx, lim, r, col) {
      var a0 = Math.max(0, 90 - lat - lim), a1 = Math.min(180, 90 - lat + lim);
      if (a1 <= a0) return;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(M.x, M.y);
      ctx.arc(M.x, M.y, r, -a0 * D2R, -a1 * D2R, true);
      ctx.closePath(); ctx.fill();
    }
    function drawObject(ctx, x, y) {
      if (obj === "star") {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        for (var i = 0; i < 16; i++) {
          var rr = i % 2 === 0 ? (i % 4 === 0 ? 8 : 5) : 2, a = i * Math.PI / 8;
          ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a));
        }
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#8a8a8a"; ctx.lineWidth = 0.6; ctx.stroke();
      } else if (obj === "sun") {
        var g = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 8);
        g.addColorStop(0, "#ffe680"); g.addColorStop(1, "#f2a900");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#d67f00"; ctx.lineWidth = 1.2; ctx.stroke();
      } else if (obj === "planet") {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.45);
        ctx.fillStyle = "#c9a36b"; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#e7d2a8"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(0, 0, 10, 3, 0, Math.PI * 0.05, Math.PI * 0.95, true); ctx.stroke();
        ctx.fillStyle = "#b8905a"; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0, 0, 10, 3, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
        ctx.restore();
      } else if (obj === "moon") {
        ctx.fillStyle = "#a3a39a"; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#7f7d70";
        [[-2, -2, 2], [2.5, 1, 1.6], [-1, 3, 1.2]].forEach(function (c) {
          ctx.beginPath(); ctx.arc(x + c[0], y + c[1], c[2], 0, Math.PI * 2); ctx.fill();
        });
      }
    }
    // the SWF's panels are charcoal with a soft, dark bevel round the edge
    function bevelPanel(ctx, x, y, w, h, r) {
      ctx.save();
      roundRect(ctx, x, y, w, h, r);
      ctx.fillStyle = C.panel; ctx.fill();
      ctx.clip();
      ctx.lineWidth = 12; ctx.strokeStyle = "rgba(0,0,0,0.28)";
      roundRect(ctx, x - 3, y - 3, w + 6, h + 6, r + 3); ctx.stroke();
      ctx.lineWidth = 5; ctx.strokeStyle = "rgba(0,0,0,0.30)";
      roundRect(ctx, x, y, w, h, r); ctx.stroke();
      ctx.restore();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    applyObject();
    upd();
  }
});
