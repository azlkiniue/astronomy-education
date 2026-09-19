/* Gas Retention Plot -------------------------------------------------------------
   Faithful rebuild of the NAAP "gasRetentionPlot.swf" (GasRetentionPlotClass and
   GRPGasClass, decompiled). Escape speed against temperature, both logarithmic.
   Each gas is a band: below 6 × its average molecular speed a world loses the gas
   quickly, above 10 × it holds on to it, and the dashed line marks 10 × v_avg.

   Plot a planet or moon and read off what it can keep — or build your own world
   with the radius, density and temperature sliders and drag its red marker
   around the plot. The data, the physics and the 6×/10× thresholds are the
   SWF's own.                                                                    */
Sim.create({
  id: "gasRetentionPlot",
  width: 544, height: 470,
  strings: {
    en: {
      "gr.gases": "Gases in the plot", "gr.objects": "Objects", "gr.custom": "Your own object",
      "gr.giants": "gas giants", "gr.terr": "terrestrial planets", "gr.icy": "icy bodies and moons",
      "gr.temp": "temperature", "gr.density": "density", "gr.radius": "radius", "gr.reset": "Reset",
      "gr.xaxis": "Temperature (K)", "gr.yaxis": "Speed (km/s)", "gr.vavg": "avg",
      "gr.rMass": "mass and escape speed", "gr.rDist": "that temperature suits", "gr.au": " AU from the Sun",
      "gr.hint": "Drag the red marker on the plot, or use the sliders. It snaps to an object when you drop it close by.",
      "g.h2": "hydrogen (H₂) · 2 u", "g.he": "helium (He) · 4 u", "g.ch4": "methane (CH₄) · 16 u",
      "g.nh3": "ammonia (NH₃) · 17 u", "g.h2o": "water (H₂O) · 18 u", "g.n2": "nitrogen (N₂) · 28 u",
      "g.o2": "oxygen (O₂) · 32 u", "g.co2": "carbon dioxide (CO₂) · 44 u", "g.xe": "xenon (Xe) · 131 u",
      "o.Mercury": "Mercury", "o.Venus": "Venus", "o.Earth": "Earth", "o.Moon": "Moon", "o.Mars": "Mars",
      "o.Jupiter": "Jupiter", "o.Saturn": "Saturn", "o.Uranus": "Uranus", "o.Neptune": "Neptune",
      "o.Pluto": "Pluto", "o.Titan": "Titan", "o.Ganymede": "Ganymede", "o.Triton": "Triton"
    },
    id: {
      "gr.gases": "Gas dalam grafik", "gr.objects": "Objek", "gr.custom": "Objek buatan Anda",
      "gr.giants": "raksasa gas", "gr.terr": "planet kebumian", "gr.icy": "benda es dan satelit",
      "gr.temp": "suhu", "gr.density": "kerapatan", "gr.radius": "jari-jari", "gr.reset": "Atur ulang",
      "gr.xaxis": "Suhu (K)", "gr.yaxis": "Kelajuan (km/d)", "gr.vavg": "rata",
      "gr.rMass": "massa dan kelajuan lepas", "gr.rDist": "suhu itu cocok untuk", "gr.au": " SA dari Matahari",
      "gr.hint": "Seret penanda merah pada grafik, atau gunakan penggeser. Penanda akan menempel ke objek terdekat saat dilepas.",
      "g.h2": "hidrogen (H₂) · 2 u", "g.he": "helium (He) · 4 u", "g.ch4": "metana (CH₄) · 16 u",
      "g.nh3": "amonia (NH₃) · 17 u", "g.h2o": "air (H₂O) · 18 u", "g.n2": "nitrogen (N₂) · 28 u",
      "g.o2": "oksigen (O₂) · 32 u", "g.co2": "karbon dioksida (CO₂) · 44 u", "g.xe": "xenon (Xe) · 131 u",
      "o.Mercury": "Merkurius", "o.Venus": "Venus", "o.Earth": "Bumi", "o.Moon": "Bulan", "o.Mars": "Mars",
      "o.Jupiter": "Jupiter", "o.Saturn": "Saturnus", "o.Uranus": "Uranus", "o.Neptune": "Neptunus",
      "o.Pluto": "Pluto", "o.Titan": "Titan", "o.Ganymede": "Ganymede", "o.Triton": "Triton"
    }
  },
  about: {
    en: "<p>Whether a world keeps an atmosphere is a race between two speeds. Gas molecules at temperature <em>T</em> jostle about with an average speed that depends on how heavy they are — light molecules move fastest. If that speed is an appreciable fraction of the world's escape speed, the fastest molecules in the tail of the distribution leak away, and over billions of years the gas is gone.</p>" +
        "<p>The rule of thumb drawn here is the standard one: a world holds a gas comfortably when its escape speed is more than <strong>10 × the average molecular speed</strong>, and loses it quickly below 6 ×. Because the average speed goes as √(T/m), the boundary for each gas is a straight line on these log–log axes, and heavier gases sit lower — easier to keep.</p>" +
        "<p>Read the plot and the Solar System falls into place. Jupiter holds everything, including hydrogen. Earth keeps nitrogen, oxygen and water but loses hydrogen and helium — which is why our helium comes from underground and escapes for good once released. The Moon and Mercury, small and hot, keep nothing. Titan is colder than Ganymede and barely heavier, yet it alone has a thick nitrogen atmosphere.</p>",
    id: "<p>Apakah sebuah dunia mampu mempertahankan atmosfer adalah perlombaan antara dua kelajuan. Molekul gas pada suhu <em>T</em> bergerak dengan kelajuan rata-rata yang bergantung pada massanya — molekul ringan bergerak paling cepat. Jika kelajuan itu cukup besar dibandingkan kelajuan lepas dunia tersebut, molekul tercepat pada ekor sebaran akan lolos, dan dalam miliaran tahun gasnya habis.</p>" +
        "<p>Aturan praktis yang digambar di sini adalah yang baku: sebuah dunia mempertahankan gas dengan aman bila kelajuan lepasnya lebih dari <strong>10 × kelajuan molekul rata-rata</strong>, dan kehilangannya dengan cepat di bawah 6 ×. Karena kelajuan rata-rata sebanding dengan √(T/m), batas untuk setiap gas berupa garis lurus pada sumbu log–log ini, dan gas yang lebih berat berada lebih rendah — lebih mudah dipertahankan.</p>" +
        "<p>Bacalah grafiknya dan Tata Surya menemukan tempatnya. Jupiter menahan segalanya, termasuk hidrogen. Bumi mempertahankan nitrogen, oksigen, dan air tetapi kehilangan hidrogen dan helium — sebabnya helium kita berasal dari perut bumi dan lolos selamanya begitu terlepas. Bulan dan Merkurius, kecil dan panas, tak mempertahankan apa pun. Titan lebih dingin daripada Ganymede dan nyaris tak lebih berat, namun hanya ia yang memiliki atmosfer nitrogen tebal.</p>"
  },
  build: function (S) {
    var LOG = Math.log10, TAU = Math.PI * 2;
    var OY = -30;
    var PX = 79.8, PY = 437.9 + OY, PW = 351.1, PH = 381.1;   // plotMC: origin bottom-left
    var T_MIN = 30, T_MAX = 1000, V_MIN = 0.5, V_MAX = 100;
    var FONT = "Verdana, Geneva, sans-serif";
    var K_B = 1.38065e-23, AMU = 1.66054e-27;
    var T_MAJ = [30, 50, 100, 200, 500, 1000];
    var T_MIN_T = [40, 60, 70, 80, 90, 300, 400, 500, 600, 700, 800, 900];
    var V_MAJ = [0.5, 1, 2, 3, 4, 6, 10, 20, 40, 60, 100];
    var V_MIN_T = [0.6, 0.7, 0.8, 0.9, 5, 7, 8, 9, 30, 50, 70, 80, 90];

    var GASES = [
      { key: "g.h2", sym: "H₂", mass: 2.01588, color: "#ff0000" },
      { key: "g.he", sym: "He", mass: 4.0026, color: "#00ff00" },
      { key: "g.ch4", sym: "CH₄", mass: 16.0425, color: "#ccff00" },
      { key: "g.nh3", sym: "NH₃", mass: 17.0305, color: "#ff00cc" },
      { key: "g.h2o", sym: "H₂O", mass: 18.0153, color: "#0050ff" },
      { key: "g.n2", sym: "N₂", mass: 28.0134, color: "#00ffcc" },
      { key: "g.o2", sym: "O₂", mass: 31.9988, color: "#a050ff" },
      { key: "g.co2", sym: "CO₂", mass: 44.0095, color: "#ffcc00" },
      { key: "g.xe", sym: "Xe", mass: 131.293, color: "#cc00ff" }
    ];
    // temperature K, density g/cm³, radius km; the escape speed is computed, as in the SWF
    var OBJECTS = [
      { name: "Mercury", group: "terr", temperature: 445, density: 5.427, radius: 2439.7 },
      { name: "Venus", group: "terr", temperature: 325, density: 5.204, radius: 6051, textAngle: 180 },
      { name: "Earth", group: "terr", temperature: 277, density: 5.5153, radius: 6376 },
      { name: "Moon", group: "icy", temperature: 277, density: 3.3464, radius: 1737.1 },
      { name: "Mars", group: "terr", temperature: 225, density: 3.934, radius: 3390 },
      { name: "Jupiter", group: "giants", temperature: 122, density: 1.326, radius: 69911 },
      { name: "Saturn", group: "giants", temperature: 90, density: 0.6873, radius: 58229 },
      { name: "Uranus", group: "giants", temperature: 63, density: 1.318, radius: 25363, textAngle: 180 },
      { name: "Neptune", group: "giants", temperature: 50, density: 1.638, radius: 24624 },
      { name: "Pluto", group: "icy", temperature: 44, density: 2.03, radius: 1195, textAngle: 180 },
      { name: "Titan", group: "icy", temperature: 90, density: 1.88, radius: 2575, textAngle: 180 },
      { name: "Ganymede", group: "icy", temperature: 122, density: 1.942, radius: 2631 },
      { name: "Triton", group: "icy", temperature: 50, density: 2.05, radius: 1353.4 }
    ];
    OBJECTS.forEach(function (o) {
      var mass = o.density * 1000 * Math.pow(o.radius * 1000, 3) * 4 * 3.14159 / 3;
      o.escapeSpeed = Math.sqrt(1.3346e-10 * mass / (o.radius * 1000)) / 1000;
    });

    var show = { giants: false, terr: false, icy: false };
    var user = { temperature: 70, radius: 600, density: 5, escapeSpeed: 0, hot: false };
    var drag = null, snapped = null;

    function speedFrom(r, d) { return r * 0.0007477 * Math.sqrt(d); }
    user.escapeSpeed = speedFrom(user.radius, user.density);

    S.group("gr.gases");
    GASES.forEach(function (g) {
      g.on = false;
      S.toggle({ labelKey: g.key, value: false, on: function (v) { g.on = v; S.requestDraw(); } });
    });
    S.group("gr.objects");
    [["giants", "gr.giants"], ["terr", "gr.terr"], ["icy", "gr.icy"]].forEach(function (p) {
      S.toggle({ labelKey: p[1], value: false, on: function (v) { show[p[0]] = v; S.requestDraw(); } });
    });
    S.group("gr.custom");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "gr.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var tCtl = S.slider({
      labelKey: "gr.temp", min: LOG(T_MIN), max: LOG(T_MAX), value: LOG(user.temperature), step: 0.001,
      format: function (v) { return sig(Math.pow(10, v), 2) + " K"; },
      on: function (v) { user.temperature = Math.pow(10, v); unsnap(); upd(); }
    });
    var dCtl = S.slider({
      labelKey: "gr.density", min: LOG(0.3), max: LOG(7), value: LOG(user.density), step: 0.001,
      format: function (v) { return sig(Math.pow(10, v), 2) + " g/cm³"; },
      on: function (v) { user.density = Math.pow(10, v); unsnap(); fromSliders("density"); }
    });
    var rCtl = S.slider({
      labelKey: "gr.radius", min: LOG(300), max: LOG(150000), value: LOG(user.radius), step: 0.001,
      format: function (v) { return sig(Math.pow(10, v), 3) + " km"; },
      on: function (v) { user.radius = Math.pow(10, v); unsnap(); fromSliders("radius"); }
    });
    S.button({
      labelKey: "gr.reset", on: function () {
        GASES.forEach(function (g) { g.on = false; });
        Object.keys(show).forEach(function (k) { show[k] = false; });
        S.canvas.parentNode.parentNode.querySelectorAll(".sim-controls input[type=checkbox]").forEach(function (c) { c.checked = false; });
        user.radius = 600; user.density = 5; user.temperature = 70;
        user.escapeSpeed = speedFrom(600, 5);
        unsnap(); syncSliders(); upd();
      }
    });
    var outMass = S.readout({ labelKey: "gr.rMass" });
    var outDist = S.readout({ labelKey: "gr.rDist" });

    function sig(x, digits) {                          // the SWF's "significant digits" slider format
      if (!isFinite(x) || x <= 0) return "0";
      var L = Math.floor(LOG(x)) - (digits - 1), M = Math.pow(10, L);
      return L < 0 ? (M * Math.round(x / M)).toFixed(-L) : String(M * Math.round(x / M));
    }
    function unsnap() { snapped = null; }
    function syncSliders() {
      tCtl.set(LOG(user.temperature)); dCtl.set(LOG(user.density)); rCtl.set(LOG(user.radius));
    }
    // the two sliders trade off: whichever one you did not move gets clamped back into range
    function fromSliders(moved) {
      var v = speedFrom(user.radius, user.density);
      if (v < V_MIN) {
        v = V_MIN;
        if (moved === "density") { user.radius = V_MIN / (0.0007477 * Math.sqrt(user.density)); rCtl.set(LOG(user.radius)); }
        else { user.density = Math.pow(V_MIN / (user.radius * 0.0007477), 2); dCtl.set(LOG(user.density)); }
      } else if (v > V_MAX) {
        v = V_MAX;
        if (moved === "density") { user.radius = V_MAX / (0.0007477 * Math.sqrt(user.density)); rCtl.set(LOG(user.radius)); }
        else { user.density = Math.pow(V_MAX / (user.radius * 0.0007477), 2); dCtl.set(LOG(user.density)); }
      }
      user.escapeSpeed = v;
      upd();
    }

    function getX(t) { return PX + PW / (LOG(T_MAX) - LOG(T_MIN)) * (LOG(t) - LOG(T_MIN)); }
    function getY(v) { return PY - PH / (LOG(V_MAX) - LOG(V_MIN)) * (LOG(v) - LOG(V_MIN)); }
    function getT(x) { return Math.pow(10, (x - PX) / PW * (LOG(T_MAX) - LOG(T_MIN)) + LOG(T_MIN)); }
    function getV(y) { return Math.pow(10, (PY - y) / PH * (LOG(V_MAX) - LOG(V_MIN)) + LOG(V_MIN)); }
    function vrms(g, t) { return Math.sqrt(3 * K_B * t / (g.mass * AMU)) / 1000; }

    function upd() {
      var mass = user.density * 1.33333 * 3.14159 * Math.pow(user.radius * 1000, 3) * 1000;
      outMass(expo(mass, 2) + " kg · " + user.escapeSpeed.toFixed(1) + " km/s");
      outDist(sig(Math.pow(278.8 / user.temperature, 2), 2) + I18N.t("gr.au"));
      S.requestDraw();
    }
    S.refreshers.push(upd);
    function expo(x, digits) {
      var e = Math.floor(LOG(x));
      return (x / Math.pow(10, e)).toFixed(digits - 1) + "×10" + sup(e);
    }
    function sup(n) {
      var map = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
      return String(n).split("").map(function (c) { return map[c] || c; }).join("");
    }

    /* ---- dragging the custom object, with an 8 px snap to any shown object ---- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (Math.hypot(p.x - getX(user.temperature), p.y - getY(user.escapeSpeed)) > 8) return;
      drag = true; user.hot = true;
      S.canvas.setPointerCapture(ev.pointerId);
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      var x = Math.max(PX, Math.min(PX + PW, p.x)), y = Math.max(PY - PH, Math.min(PY, p.y));
      snapped = null;
      OBJECTS.forEach(function (o) {
        if (!show[o.group]) return;
        var d = Math.hypot(x - getX(o.temperature), y - getY(o.escapeSpeed));
        if (d < 8) { snapped = o; x = getX(o.temperature); y = getY(o.escapeSpeed); }
      });
      user.temperature = getT(x); user.escapeSpeed = getV(y);
      user.radius = user.escapeSpeed / (0.0007477 * Math.sqrt(user.density));
      if (user.radius > 150000) { user.radius = 150000; user.density = Math.pow(user.escapeSpeed / (150000 * 0.0007477), 2); }
      if (user.radius < 300) { user.radius = 300; user.density = Math.pow(user.escapeSpeed / (300 * 0.0007477), 2); }
      syncSliders(); upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; user.hot = false; S.requestDraw(); });
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#fafafa"; ctx.fillRect(7, 37 + OY, 530, 457);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(7.5, 37.5 + OY, 529, 456);

      ctx.fillStyle = "#ffffff"; ctx.fillRect(PX, PY - PH, PW, PH);
      ctx.save();
      ctx.beginPath(); ctx.rect(PX, PY - PH, PW, PH); ctx.clip();
      GASES.forEach(function (g) { if (g.on) band(ctx, g); });
      ctx.restore();
      GASES.forEach(function (g) { if (g.on) gasLine(ctx, g, t); });

      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.strokeRect(PX - 0.5, PY - PH - 0.5, PW + 1, PH + 1);
      ticks(ctx, t);

      OBJECTS.forEach(function (o) {
        if (!show[o.group]) return;
        dot(ctx, getX(o.temperature), getY(o.escapeSpeed), 3, "#909090", "#000000");
        label(ctx, t("o." + o.name), getX(o.temperature), getY(o.escapeSpeed), o.textAngle || 0);
      });

      var ux = getX(user.temperature), uy = getY(user.escapeSpeed);
      if (user.hot) dot(ctx, ux, uy, 5, "#ff0000", null);
      else dot(ctx, ux, uy, 4, "#ff6060", "#000000");
      if (snapped) {
        ctx.fillStyle = "#cc0000"; ctx.font = "11px " + FONT;
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(t("o." + snapped.name), ux + 9, uy + 9);
      }
    });

    function band(ctx, g) {                            // 6× fading into 10×, then solid above
      var y1 = getY(6 * vrms(g, T_MIN)), y2 = getY(6 * vrms(g, T_MAX));
      var y3 = getY(10 * vrms(g, T_MAX)), y4 = getY(10 * vrms(g, T_MIN));
      var mx = (PX + PX + PW) / 2, my = (y1 + (y3 - y1) / 2);
      var ang = Math.atan2(Math.abs(y2 - y1), PW);
      var len = (y1 - y4) / 2;
      var gx = Math.cos(Math.PI / 2 - ang) * len, gy = Math.sin(Math.PI / 2 - ang) * len;
      var grad = ctx.createLinearGradient(mx - gx, my - gy, mx + gx, my + gy);
      grad.addColorStop(0, hexA(g.color, 0.2)); grad.addColorStop(1, hexA(g.color, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(PX, y1); ctx.lineTo(PX + PW, y2); ctx.lineTo(PX + PW, y3); ctx.lineTo(PX, y4);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = hexA(g.color, 0.2);
      ctx.beginPath();
      ctx.moveTo(PX, y4); ctx.lineTo(PX + PW, y3); ctx.lineTo(PX + PW, PY - PH); ctx.lineTo(PX, PY - PH);
      ctx.closePath(); ctx.fill();
    }
    function gasLine(ctx, g, t) {
      var y4 = getY(10 * vrms(g, T_MIN)), y3 = getY(10 * vrms(g, T_MAX));
      ctx.save();
      ctx.beginPath(); ctx.rect(PX, PY - PH, PW, PH); ctx.clip();
      ctx.strokeStyle = "#909090"; ctx.lineWidth = 2; ctx.setLineDash([4, 8]);
      ctx.beginPath(); ctx.moveTo(PX, y4); ctx.lineTo(PX + PW, y3); ctx.stroke();
      ctx.restore();
      if (y3 < PY - PH - 6 || y3 > PY + 6) return;
      ctx.fillStyle = "#000000"; ctx.font = "11px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      var head = g.sym + ", 10×V";
      ctx.fillText(head, PX + PW + 5, y3);
      ctx.font = "9px " + FONT;
      ctx.fillText(t("gr.vavg"), PX + PW + 5 + ctx.measureText(head).width * 1.22, y3 + 4);
    }
    function ticks(ctx, t) {
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.fillStyle = "#000000"; ctx.font = "11px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      T_MAJ.forEach(function (v) {
        var x = getX(v);
        ctx.beginPath(); ctx.moveTo(x, PY); ctx.lineTo(x, PY + 6); ctx.stroke();
        ctx.fillText(String(v), x, PY + 8);
      });
      T_MIN_T.forEach(function (v) {
        var x = getX(v);
        ctx.beginPath(); ctx.moveTo(x, PY); ctx.lineTo(x, PY + 3); ctx.stroke();
      });
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      V_MAJ.forEach(function (v) {
        var y = getY(v);
        ctx.beginPath(); ctx.moveTo(PX, y); ctx.lineTo(PX - 6, y); ctx.stroke();
        ctx.fillText(String(v), PX - 9, y);
      });
      V_MIN_T.forEach(function (v) {
        var y = getY(v);
        ctx.beginPath(); ctx.moveTo(PX, y); ctx.lineTo(PX - 3, y); ctx.stroke();
      });
      ctx.font = "bold 13px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("gr.xaxis"), PX + PW / 2, PY + 32);
      ctx.save();
      ctx.translate(30, PY - PH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText(t("gr.yaxis"), 0, 0);
      ctx.restore();
    }
    function dot(ctx, x, y, r, fill, stroke) {
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = fill; ctx.fill();
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
    }
    function label(ctx, text, x, y, angle) {           // textRadius 7, above (0°) or below (180°)
      ctx.fillStyle = "#404040"; ctx.font = "11px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, x, y + (angle === 180 ? 13 : -13));
    }
    function hexA(hex, a) {
      return "rgba(" + parseInt(hex.slice(1, 3), 16) + "," + parseInt(hex.slice(3, 5), 16) + "," +
        parseInt(hex.slice(5, 7), 16) + "," + a + ")";
    }

    upd();
  }
});
