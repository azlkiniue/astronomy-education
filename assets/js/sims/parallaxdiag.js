/* Parallax Calculator ----------------------------------------------------------
   Faithful rebuild of the ClassAction "parallaxdiag.swf": the geometry of stellar
   parallax drawn out — Earth's orbit, the 1 AU baseline, the long thin triangle
   to the star, the parallax angle π, and the star's matching displacement on the
   celestial sphere — over a calculator that ties the three quantities together:

        d = 1/π″   →   d in parsecs   →   d in lightyears  (1 pc = 3.26 ly)

   As in the original, all three boxes are live: type into any one and the other
   two follow, and the diagram redraws to match.                                  */
Sim.create({
  id: "parallaxdiag",
  width: 760, height: 470,
  strings: {
    en: {
      "pd.calc": "Calculator", "pd.pi": "parallax angle π", "pd.pc": "distance", "pd.ly": "distance",
      "pd.slide": "drag the parallax angle", "pd.presets": "real stars",
      "pd.notes": "π is measured in arcseconds (″).  1 parsec (pc) = 3.26 lightyears (ly).",
      "pd.notScale": "diagram not to scale", "pd.orbit": "earth's orbit", "pd.au": "1 AU",
      "pd.star": "star", "pd.d": "d", "pd.disp": "star's displacement on the celestial sphere",
      "pd.tip": "type in any box — the other two follow",
      "pd.rpc": "distance (pc)", "pd.rly": "distance (ly)", "pd.rau": "distance (AU)"
    },
    id: {
      "pd.calc": "Kalkulator", "pd.pi": "sudut paralaks π", "pd.pc": "jarak", "pd.ly": "jarak",
      "pd.slide": "geser sudut paralaks", "pd.presets": "bintang nyata",
      "pd.notes": "π diukur dalam detik busur (″).  1 parsek (pc) = 3,26 tahun cahaya (ty).",
      "pd.notScale": "diagram tidak berskala", "pd.orbit": "orbit Bumi", "pd.au": "1 SA",
      "pd.star": "bintang", "pd.d": "d", "pd.disp": "pergeseran bintang pada bola langit",
      "pd.tip": "ketik di kotak mana pun — dua lainnya menyesuaikan",
      "pd.rpc": "jarak (pc)", "pd.rly": "jarak (ty)", "pd.rau": "jarak (SA)"
    }
  },
  about: {
    en: "<p>Watch a nearby star across six months and it traces a tiny ellipse against the far background — not because it moved, but because <em>you</em> did, from one side of Earth's orbit to the other. Half of that back-and-forth shift is the star's <strong>parallax angle</strong>, π, measured from a baseline of <strong>1 AU</strong>.</p>" +
        "<p>The triangle is so long and thin that the small-angle approximation is exact for our purposes, and the arithmetic collapses to one line: <strong>d = 1/π″</strong>. Define the <strong>parsec</strong> as the distance at which π = 1″ and the formula needs no constants at all. A parallax of 0.1″ means 10 pc; 0.01″ means 100 pc.</p>" +
        "<p>This is why parallax runs out of reach so quickly. Even the nearest star, Proxima Centauri, shifts by only 0.77″ — about the width of a coin seen from three kilometres away. Ground-based measurement stalls near 0.01″; the <em>Gaia</em> spacecraft reaches microarcseconds, and with it the far side of the Galaxy.</p>",
    id: "<p>Amati bintang dekat selama enam bulan dan ia menelusuri elips kecil terhadap latar jauh — bukan karena ia bergerak, melainkan karena <em>Anda</em> yang bergerak, dari satu sisi orbit Bumi ke sisi lain. Setengah dari pergeseran bolak-balik itu adalah <strong>sudut paralaks</strong> bintang, π, diukur dari garis dasar <strong>1 SA</strong>.</p>" +
        "<p>Segitiganya begitu panjang dan tipis sehingga hampiran sudut kecil berlaku persis, dan hitungannya menjadi satu baris: <strong>d = 1/π″</strong>. Definisikan <strong>parsek</strong> sebagai jarak saat π = 1″, dan rumus itu tak butuh konstanta sama sekali. Paralaks 0,1″ berarti 10 pc; 0,01″ berarti 100 pc.</p>" +
        "<p>Itulah sebabnya paralaks cepat kehabisan jangkauan. Bahkan bintang terdekat, Proxima Centauri, hanya bergeser 0,77″ — selebar koin dilihat dari jarak tiga kilometer. Pengukuran dari Bumi mentok di sekitar 0,01″; wahana <em>Gaia</em> mencapai mikrodetik busur, dan bersamanya sisi jauh Galaksi.</p>"
  },
  build: function (S) {
    var C = {
      panel: "#f4f6fb", ink: "#101828", faint: "#8a93a8", rule: "#c8cfdd",
      pi: "#c2410c", pc: "#1d4ed8", ly: "#047857", star: "#eab308"
    };
    var PRESETS = {
      "Proxima Centauri": 0.7687, "Sirius": 0.3792, "Vega": 0.1301,
      "Betelgeuse": 0.00546, "Deneb": 0.00235, "1 parsec (definition)": 1
    };
    var pi = 1.0;                                  // arcseconds — the SWF's opening value
    var lock = false;

    function pcOf(p) { return 1 / p; }
    function lyOf(p) { return 3.26 / p; }
    // 3 significant digits, as the original's toSigDigits does
    function sig(x, n) {
      if (!isFinite(x) || x === 0) return "0";
      var d = Math.ceil(Math.log10(Math.abs(x))), pw = (n || 3) - d;
      var v = Math.round(x * Math.pow(10, pw)) / Math.pow(10, pw);
      return pw > 0 ? v.toFixed(Math.min(pw, 6)).replace(/\.?0+$/, "") : String(v);
    }

    /* ---- controls: three linked number boxes, exactly as in the SWF ---- */
    S.group("pd.calc");
    var boxPi = numBox("pd.pi", "″", function (v) { if (v > 0) { pi = v; sync("pi"); } });
    var boxPc = numBox("pd.pc", "pc", function (v) { if (v > 0) { pi = 1 / v; sync("pc"); } });
    var boxLy = numBox("pd.ly", "ly", function (v) { if (v > 0) { pi = 3.26 / v; sync("ly"); } });
    var tip = document.createElement("p");
    tip.className = "sim-note"; tip.setAttribute("data-i18n", "pd.tip");
    boxLy.ctl.parentNode.appendChild(tip);

    var piCtl = S.slider({
      labelKey: "pd.slide", min: -3, max: 0.5, value: Math.log10(pi), step: 0.001,
      format: function (v) { return sig(Math.pow(10, v)) + "″"; },
      on: function (v) { if (lock) return; pi = Math.pow(10, v); sync("slider"); }
    });
    S.select({
      labelKey: "pd.presets", value: "1 parsec (definition)",
      options: Object.keys(PRESETS).map(function (k) { return { v: k, label: k }; }),
      on: function (v) { if (lock) return; pi = PRESETS[v]; sync("preset"); }
    });

    var outPc = S.readout({ labelKey: "pd.rpc" });
    var outLy = S.readout({ labelKey: "pd.rly" });
    var outAu = S.readout({ labelKey: "pd.rau" });

    function numBox(labelKey, unit, on) {
      var ctl = document.createElement("div"); ctl.className = "ctl";
      var lab = document.createElement("label");
      var name = document.createElement("span"); name.setAttribute("data-i18n", labelKey);
      var u = document.createElement("span"); u.className = "val"; u.textContent = unit;
      lab.appendChild(name); lab.appendChild(u);
      var input = document.createElement("input");
      input.type = "number"; input.step = "any"; input.min = "0";
      ctl.appendChild(lab); ctl.appendChild(input);
      S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(ctl);
      input.addEventListener("input", function () {
        if (lock) return;
        var v = parseFloat(input.value);
        if (isFinite(v) && v > 0) on(v);
      });
      return { input: input, ctl: ctl };
    }

    // push the current π out to every control except the one being edited
    function sync(src) {
      lock = true;
      if (src !== "pi") boxPi.input.value = sig(pi, 4);
      if (src !== "pc") boxPc.input.value = sig(pcOf(pi), 4);
      if (src !== "ly") boxLy.input.value = sig(lyOf(pi), 4);
      if (src !== "slider" && piCtl) { piCtl.input.value = Math.log10(pi); }
      lock = false;
      upd();
    }
    function upd() {
      outPc(sig(pcOf(pi)) + " pc");
      outLy(sig(lyOf(pi)) + " ly");
      outAu(sig(pcOf(pi) * 206265) + " AU");
      S.refreshers.forEach(function (f) { f(); });   // repaint the slider's own value text
      S.requestDraw();
    }
    S.refreshers.push(function () { S.requestDraw(); });

    /* ================================ diagram ================================ */
    var OX = 118, OY = 208, ORB = 52;              // earth's orbit centre + radius
    var SPH = 612;                                 // where the celestial-sphere arc crosses the axis
    var ARC = 0.2496;                              // its half-angle — ±122 px, kept inside the paper
    var NEAR = 300, FAR = 548;                     // the star's x for the largest / smallest parallax

    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();

      // the original draws on white paper — keep that, it is the whole look of the SWF
      ctx.fillStyle = C.panel; roundRect(ctx, 8, 8, S.W - 16, 330, 10); ctx.fill();
      ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.stroke();

      ctx.font = "italic 12px Georgia, serif"; ctx.fillStyle = C.faint; ctx.textAlign = "center";
      ctx.fillText(t("pd.notScale"), 420, 44);

      // the star sits nearer for a big parallax, further for a small one (log scale)
      var f = Math.max(0, Math.min(1, (Math.log10(pi) + 3) / 3.5));
      var SX = NEAR + (1 - f) * (FAR - NEAR);

      // earth's orbit
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(OX, OY, ORB, 0, Math.PI * 2); ctx.stroke();
      ctx.font = "italic 12px Georgia, serif"; ctx.fillStyle = C.ink; ctx.textAlign = "left";
      ctx.fillText(t("pd.orbit"), OX + 14, OY - ORB - 26);
      ctx.beginPath(); ctx.moveTo(OX + 12, OY - ORB - 22); ctx.lineTo(OX - 4, OY - ORB + 4); ctx.stroke();

      // 1 AU baseline — the bracket down the left, as in the original
      var top = OY - ORB, bot = OY + ORB;
      ctx.beginPath();
      ctx.moveTo(OX - ORB - 22, OY); ctx.lineTo(OX, OY);
      ctx.moveTo(OX - ORB - 22, OY); ctx.lineTo(OX - ORB - 22, bot);
      ctx.lineTo(OX, bot);
      ctx.stroke();
      ctx.textAlign = "right"; ctx.fillText(t("pd.au"), OX - ORB - 8, OY + 34);

      // the long thin triangle: both ends of the orbit → through the star → stopping
      // exactly where each sight line meets the celestial-sphere arc
      var A = onSphere(top, SX), B = onSphere(bot, SX);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(OX, top); ctx.lineTo(A.x, A.y);
      ctx.moveTo(OX, bot); ctx.lineTo(B.x, B.y);
      ctx.moveTo(OX, top); ctx.lineTo(OX, bot);
      ctx.stroke();

      // baseline axis through the middle
      ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(SPH + 6, OY);
      ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.stroke();

      // the distance d, under a curly brace from the orbit to the star
      brace(ctx, OX, SX, top - 34, 12);
      ctx.font = "italic 15px Georgia, serif"; ctx.fillStyle = C.ink; ctx.textAlign = "center";
      ctx.fillText(t("pd.d"), (OX + SX) / 2, top - 44);

      // The parallax angle and its vertically-opposite twin (which is the star's
      // displacement on the sky), mirrored about the star as in the SWF. The offset
      // shrinks as the star nears the sphere, so the right-hand box always sits in
      // the gap between the star and the arc instead of on top of the star.
      var off = Math.max(26, Math.min(70, (SPH - SX) * 0.55));
      angleBox(ctx, SX - off - 13, OY - 11);
      angleBox(ctx, SX + off - 13, OY - 11);

      // the star itself
      ctx.beginPath(); ctx.arc(SX, OY, 5, 0, Math.PI * 2);
      ctx.fillStyle = C.star; ctx.fill(); ctx.strokeStyle = "#7c5c00"; ctx.lineWidth = 1; ctx.stroke();
      ctx.font = "italic 12px Georgia, serif"; ctx.fillStyle = C.ink; ctx.textAlign = "center";
      ctx.fillText(t("pd.star"), SX + 6, OY + 30);
      ctx.beginPath(); ctx.moveTo(SX + 2, OY + 18); ctx.lineTo(SX + 1, OY + 6);
      ctx.strokeStyle = C.ink; ctx.stroke();

      // celestial-sphere arc + the displacement bracket
      ctx.beginPath(); ctx.arc(OX, OY, SPH - OX, -ARC, ARC);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; ctx.stroke();
      curlyV(ctx, SPH + 12, A.y, B.y, 9);
      ctx.font = "italic 11.5px Georgia, serif"; ctx.fillStyle = C.ink; ctx.textAlign = "left";
      wrapText(ctx, t("pd.disp"), SPH + 28, (A.y + B.y) / 2 - 16, 78, 14);

      /* ---------------- the equation, spelled out as in the SWF ---------------- */
      var y = 388;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      var x = 74;
      ctx.font = "italic 20px Georgia, serif"; ctx.fillStyle = "#e8ecf8";
      ctx.fillText("d", x, y); x += 20;
      ctx.fillText("=", x, y); x += 26;
      x = frac(ctx, x, y, "1", "π″", "#e8ecf8", C.pi) + 12;
      ctx.fillStyle = "#e8ecf8"; ctx.fillText("=", x, y); x += 26;
      x = frac(ctx, x, y, "1", sig(pi, 4) + " ″", "#e8ecf8", C.pi) + 12;
      ctx.fillStyle = "#e8ecf8"; ctx.fillText("=", x, y); x += 26;
      x = boxed(ctx, x, y, sig(pcOf(pi)), C.pc) + 8;
      ctx.fillStyle = "#9fabce"; ctx.font = "16px system-ui"; ctx.fillText("pc", x, y); x += 30;
      ctx.font = "italic 20px Georgia, serif"; ctx.fillStyle = "#e8ecf8"; ctx.fillText("=", x, y); x += 26;
      x = boxed(ctx, x, y, sig(lyOf(pi)), C.ly) + 8;
      ctx.fillStyle = "#9fabce"; ctx.font = "16px system-ui"; ctx.fillText("ly", x, y);

      ctx.textAlign = "center"; ctx.font = "12.5px system-ui"; ctx.fillStyle = "#9fabce";
      ctx.fillText(t("pd.notes"), S.W / 2, 440);
      ctx.textBaseline = "alphabetic";
    });

    /* ---- drawing primitives (kept out of onDraw so it stays readable) ---- */
    // Where the sight line from the orbit edge (OX, y0) through the star at (sx, OY)
    // meets the celestial-sphere arc: solve |p(s) − O|² = r² for the far root, where
    // p(s) = (OX + s·a, y0 + s·h) and s = 1 is the star itself.
    function onSphere(y0, sx) {
      var a = sx - OX, h = OY - y0, r = SPH - OX, A = a * a + h * h;
      var s = (h * h + Math.sqrt(h * h * h * h - A * (h * h - r * r))) / A;
      return { x: OX + s * a, y: y0 + s * h };
    }
    function angleBox(ctx, x, y) {
      ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
      ctx.strokeRect(x, y, 26, 22);
      ctx.font = "italic 13px Georgia, serif"; ctx.fillStyle = C.pi; ctx.textAlign = "center";
      ctx.textBaseline = "middle"; ctx.fillText("π", x + 13, y + 11); ctx.textBaseline = "alphabetic";
    }
    function brace(ctx, x0, x1, y, h) {          // a shallow horizontal curly brace
      var mid = (x0 + x1) / 2;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.quadraticCurveTo(x0 + 8, y - h * 0.2, mid - 8, y - h * 0.55);
      ctx.quadraticCurveTo(mid, y - h, mid + 8, y - h * 0.55);
      ctx.quadraticCurveTo(x1 - 8, y - h * 0.2, x1, y);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.1; ctx.stroke();
    }
    function curlyV(ctx, x, y0, y1, w) {         // a vertical curly brace
      var mid = (y0 + y1) / 2;
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.quadraticCurveTo(x + w * 0.35, y0 + 6, x + w * 0.6, mid - 8);
      ctx.quadraticCurveTo(x + w, mid, x + w * 0.6, mid + 8);
      ctx.quadraticCurveTo(x + w * 0.35, y1 - 6, x, y1);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.1; ctx.stroke();
    }
    function wrapText(ctx, text, x, y, maxw, lh) {
      var words = text.split(" "), line = "", n = 0;
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(test).width > maxw && line) { ctx.fillText(line, x, y + (n++) * lh); line = words[i]; }
        else line = test;
      }
      ctx.fillText(line, x, y + n * lh);
    }
    // a stacked fraction; returns the x just past it
    function frac(ctx, x, y, num, den, colN, colD) {
      ctx.font = "italic 17px Georgia, serif"; ctx.textAlign = "center";
      var w = Math.max(ctx.measureText(num).width, ctx.measureText(den).width) + 14;
      ctx.fillStyle = colN; ctx.fillText(num, x + w / 2, y - 13);
      ctx.fillStyle = colD; ctx.fillText(den, x + w / 2, y + 15);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y);
      ctx.strokeStyle = "#7f8bab"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.textAlign = "left"; ctx.font = "italic 20px Georgia, serif";
      return x + w;
    }
    // a value in a box, as the SWF's editable fields appear
    function boxed(ctx, x, y, text, col) {
      ctx.font = "600 16px ui-monospace, monospace";
      var w = Math.max(52, ctx.measureText(text).width + 18);
      ctx.fillStyle = "rgba(255,255,255,.05)"; ctx.strokeStyle = col;
      roundRect(ctx, x, y - 15, w, 30, 6); ctx.fill();
      ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, x + w / 2, y);
      ctx.textAlign = "left"; ctx.font = "italic 20px Georgia, serif";
      return x + w;
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    sync("init");
  }
});
