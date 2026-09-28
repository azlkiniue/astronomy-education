/* Spectrum Explorer --------------------------------------------------------------
   Faithful rebuild of ClassAction's "spectrum010.swf". Build a stellar spectrum a
   piece at a time: start with the continuum, choose emission or absorption, then
   switch on the elements one by one and watch which lines a star of that type
   would actually show.

   Its line data is the same set the Spectroscopic Parallax simulator carries, and
   both come out of the same ClassAction code: six families of wavelengths, and a
   piecewise-linear strength ramp for each across the seventy spectral types. The
   luminosity class only sets how wide the lines are drawn — 1 px for I, 2 for III,
   3 for V — because pressure broadening is what tells a dwarf from a supergiant.

   The SWF opens on a continuous spectrum, class V, spectral type 42 (G2), with
   every element switched off.                                                 */
Sim.create({
  id: "spectrum010",
  width: 648, height: 340,
  strings: {
    en: {
      "sx.kind": "Spectrum", "sx.cont": "Continuous", "sx.emis": "Emission",
      "sx.abs": "Absorption",
      "sx.el": "Elements", "sx.iHe": "Ionized helium", "sx.He": "Helium",
      "sx.H": "Hydrogen", "sx.iMet": "Ionized metals", "sx.met": "Metals",
      "sx.mol": "Molecules", "sx.all": "Show all", "sx.noneBtn": "Hide all",
      "sx.star": "Star", "sx.class": "Luminosity class", "sx.type": "Spectral type",
      "sx.c1": "I — supergiant", "sx.c3": "III — giant", "sx.c5": "V — main sequence",
      "sx.reset": "Reset",
      "sx.rType": "spectral type", "sx.rTemp": "temperature", "sx.rWidth": "line width",
      "sx.rShown": "elements shown",
      "sx.strength": "Line strength at this spectral type",
      "sx.wave": "Wavelength (nm)", "sx.none": "none",
      "sx.hint": "Switch to absorption, then bring the elements in one at a time. Slide the spectral type from O to M and watch each family rise and fade — that pattern is how a star's temperature is read off its spectrum."
    },
    id: {
      "sx.kind": "Spektrum", "sx.cont": "Kontinu", "sx.emis": "Emisi",
      "sx.abs": "Serapan",
      "sx.el": "Unsur", "sx.iHe": "Helium terion", "sx.He": "Helium",
      "sx.H": "Hidrogen", "sx.iMet": "Logam terion", "sx.met": "Logam",
      "sx.mol": "Molekul", "sx.all": "Tampilkan semua", "sx.noneBtn": "Sembunyikan semua",
      "sx.star": "Bintang", "sx.class": "Kelas luminositas", "sx.type": "Tipe spektrum",
      "sx.c1": "I — maharaksasa", "sx.c3": "III — raksasa", "sx.c5": "V — deret utama",
      "sx.reset": "Atur ulang",
      "sx.rType": "tipe spektrum", "sx.rTemp": "temperatur", "sx.rWidth": "lebar garis",
      "sx.rShown": "unsur ditampilkan",
      "sx.strength": "Kekuatan garis pada tipe spektrum ini",
      "sx.wave": "Panjang gelombang (nm)", "sx.none": "tidak ada",
      "sx.hint": "Beralihlah ke serapan, lalu munculkan unsur satu per satu. Geser tipe spektrum dari O ke M dan amati setiap keluarga menguat lalu memudar — pola itulah cara temperatur sebuah bintang dibaca dari spektrumnya."
    }
  },
  about: {
    en: "<p>Kirchhoff's three rules are all here. A hot dense body gives a continuous spectrum, all colours at once. A hot thin gas gives an emission spectrum, bright lines at the wavelengths that gas emits and nothing in between. The same gas in front of a continuous source gives an absorption spectrum — the same lines, now dark.</p>" +
        "<p>A star gives the third kind. Its dense interior makes the continuum, and its cooler outer layers absorb at their own wavelengths on the way out. Which lines you see depends almost entirely on temperature, because temperature decides what state the atoms are in: helium needs a hot star to be excited at all, hydrogen peaks around A0, and by the coolest stars the atoms have paired up into molecules.</p>" +
        "<p>The width of the lines carries a second piece of information. Densely packed atoms jostle each other and smear their lines out, so narrow lines mean a thin, extended atmosphere — a giant or a supergiant — and broad ones mean the compact atmosphere of a dwarf. Type from the pattern, luminosity class from the width: together they place the star on the H–R diagram.</p>",
    id: "<p>Ketiga kaidah Kirchhoff semuanya ada di sini. Benda panas dan rapat memberi spektrum kontinu, semua warna sekaligus. Gas panas dan renggang memberi spektrum emisi, garis-garis terang pada panjang gelombang yang dipancarkan gas itu dan kosong di antaranya. Gas yang sama di depan sumber kontinu memberi spektrum serapan — garis yang sama, kini gelap.</p>" +
        "<p>Bintang memberikan jenis yang ketiga. Bagian dalamnya yang rapat menghasilkan kontinum, dan lapisan luarnya yang lebih dingin menyerap pada panjang gelombangnya sendiri dalam perjalanan keluar. Garis mana yang terlihat hampir sepenuhnya bergantung pada temperatur, karena temperatur menentukan keadaan atom-atomnya: helium baru tereksitasi pada bintang panas, hidrogen memuncak di sekitar A0, dan pada bintang terdingin atom-atom telah berpasangan menjadi molekul.</p>" +
        "<p>Lebar garisnya membawa keterangan kedua. Atom yang berjejal saling berdesakan dan mengaburkan garisnya, sehingga garis yang sempit berarti atmosfer yang renggang dan meluas — raksasa atau maharaksasa — dan garis yang lebar berarti atmosfer padat sebuah katai. Tipe dari polanya, kelas luminositas dari lebarnya: bersama-sama keduanya menempatkan bintang pada diagram H–R.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif";
    var MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
    var LAM0 = 380, LAM1 = 720;
    var STRIP = { x: 24, y: 46, w: 600, h: 96 };
    var BARS = { x: 24, y: 190, w: 600 };

    /* createArrays: the six families and their wavelengths, in nm */
    var FAMILIES = [
      { key: "iHe", label: "sx.iHe", colour: "#e89a20", lines: [433.9, 454.2, 468.6] },
      { key: "He", label: "sx.He", colour: "#2a7fd4", lines: [402.6, 438.8, 447.1, 706.5] },
      { key: "H", label: "sx.H", colour: "#d8332a", lines: [397, 410.1, 434, 486.1, 656.3] },
      { key: "iMet", label: "sx.iMet", colour: "#3f9e46",
        lines: [393.3, 396.8, 407.7, 417.5, 421.5, 423.3, 424.6, 426.7, 430, 444.4, 448.1] },
      { key: "met", label: "sx.met", colour: "#d63fd6",
        lines: [403.2, 404.5, 432.5, 422.6, 589] },
      { key: "mol", label: "sx.mol", colour: "#b8791f",
        lines: [421.5, 430, 458.4, 462.5, 467, 469.7, 467, 478] }
    ];
    /* createLineArrays: the strength ramps over spectral types 0..69 */
    function ramp(i) {
      return {
        iHe: i < 8 ? Math.floor(-12.5 * i + 100) : 0,
        He: i < 8 ? Math.floor(3.75 * i + 70) : i < 21 ? Math.floor(-7.7 * i + 161.7) : 0,
        H: i < 7 ? 0 : i < 20 ? Math.floor(7.7 * i - 53.9)
          : i < 54 ? Math.floor(-2.94 * i + 158.7) : 0,
        iMet: i < 11 ? 0 : i < 38 ? Math.floor(3.7 * i - 40.7)
          : i < 52 ? Math.floor(-7.14 * i + 371.3) : 0,
        met: i < 30 ? 0 : i < 49 ? Math.floor(5.26 * i - 157.8)
          : i < 62 ? Math.floor(-7.7 * i + 477.4) : 0,
        mol: i < 50 ? 0 : Math.floor(5.26 * i - 263.16)
      };
    }
    /* the NAAP HR component's spectral type -> log temperature fit, the same one
       the Spectroscopic Parallax simulator uses (G2 reads 5840 K)            */
    var logTempFromType = (function (segs) {
      return function (x) {
        for (var i = 0; i < segs.length; i++) {
          var s = segs[i];
          if (s[0] === null || x < s[0]) return s[1] + x * (s[2] + x * (s[3] + x * s[4]));
        }
        return NaN;
      };
    })([[8.5167, 4.7009, -0.01, 3.92e-05, -0.00014247],
      [16.1, 4.4348, 0.08374, -0.010967, 0.000288299],
      [23.2167, 6.0516, -0.21754, 0.007746, -9.9133e-05],
      [34.1833, 5.0538, -0.08861, 0.0021924, -1.9396e-05],
      [50.5108, 4.7553, -0.06241, 0.0014259, -1.1922e-05],
      [57.9775, 1.1584, 0.15122, -0.0028034, 1.5988e-05],
      [64.3942, 26.4612, -1.15805, 0.019779, -0.000113846],
      [null, -115.7858, 5.46896, -0.0831343, 0.000418879]]);
    var LETTERS = ["O", "B", "A", "F", "G", "K", "M"];
    function typeName(n) { return LETTERS[Math.floor(n / 10)] + (n % 10); }
    function sig(v, d) {
      var e = Math.floor(Math.log(v) / Math.LN10) - (d - 1);
      if (e < 0) return v.toFixed(-e);
      var p = Math.pow(10, e);
      return String(p * Math.round(v / p));
    }
    function visibleRGB(nm) {
      var r = 0, g = 0, b = 0;
      if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
      else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
      else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
      else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
      else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
      else { r = 1; }
      var f = nm > 700 ? 0.3 + 0.7 * (780 - nm) / 80
        : nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : 1;
      return [Math.round(255 * r * f), Math.round(255 * g * f), Math.round(255 * b * f)];
    }

    /* the SWF's opening state */
    var kind = "cont", lumClass = 5, type = 42;
    var on = { iHe: false, He: false, H: false, iMet: false, met: false, mol: false };

    /* ------------------------------------------------------------- controls */
    S.group("sx.kind");
    var kindCtl = S.select({ labelKey: "sx.kind", value: "cont",
      options: [{ v: "cont", labelKey: "sx.cont" }, { v: "emis", labelKey: "sx.emis" },
        { v: "abs", labelKey: "sx.abs" }],
      on: function (v) { kind = v; sync(); } });
    S.group("sx.el");
    var elCtl = {};
    FAMILIES.forEach(function (f) {
      elCtl[f.key] = S.toggle({ labelKey: f.label, value: false,
        on: function (v) { on[f.key] = v; sync(); } });
    });
    S.button({ labelKey: "sx.all", on: function () { setAll(true); } });
    S.button({ labelKey: "sx.noneBtn", on: function () { setAll(false); } });
    S.group("sx.star");
    var classCtl = S.select({ labelKey: "sx.class", value: "5",
      options: [{ v: "1", labelKey: "sx.c1" }, { v: "3", labelKey: "sx.c3" },
        { v: "5", labelKey: "sx.c5" }],
      on: function (v) { lumClass = parseInt(v, 10); sync(); } });
    var typeCtl = S.slider({ labelKey: "sx.type", min: 0, max: 69, value: 42, step: 1,
      format: function (v) { return typeName(v); },
      on: function (v) { type = v; sync(); } });
    /* the SWF's shape 107, under its slider: O B A F G K M, each in its class's
       star colour and centred on its ten subtypes. Here each is also a button
       that jumps to subtype 5, which puts the thumb right under the letter. O
       and M are a shade lighter than the SWF's pure blue and red, which would
       barely show on this dark panel.                                         */
    var CLASS_COL = ["#5b7cff", "#9a9bfe", "#cacaff", "#ffffff", "#ffff00", "#ff6600", "#ff4040"];
    var scale = document.createElement("div");
    scale.className = "slider-scale";
    LETTERS.forEach(function (L, i) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = L; b.title = L + "5";
      b.style.color = CLASS_COL[i];
      b.style.left = "calc(8px + (100% - 16px) * " + ((10 * i + 5) / 69).toFixed(4) + ")";
      b.addEventListener("click", function () { typeCtl.set(10 * i + 5); });
      scale.appendChild(b);
    });
    typeCtl.input.parentNode.appendChild(scale);
    S.button({ labelKey: "sx.reset", on: function () {
      kindCtl.set("cont"); classCtl.set("5"); typeCtl.set(42); setAll(false);
    } });
    function setAll(v) { FAMILIES.forEach(function (f) { elCtl[f.key].set(v); }); }

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "sx.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outType = S.readout({ labelKey: "sx.rType" });
    var outTemp = S.readout({ labelKey: "sx.rTemp" });
    var outWidth = S.readout({ labelKey: "sx.rWidth" });
    var outShown = S.readout({ labelKey: "sx.rShown" });

    /* classChange: the luminosity class only sets the line width */
    function lineWidth() { return lumClass === 1 ? 1 : lumClass === 3 ? 2 : 3; }
    function sync() {
      var T = Math.pow(10, logTempFromType(type));
      outType(typeName(type));
      outTemp(kind === "cont" ? "—" : sig(T, 3) + " K");
      outWidth(kind === "cont" ? "—" : lineWidth() + " px");
      var n = FAMILIES.filter(function (f) { return on[f.key]; }).length;
      outShown(kind === "cont" ? "—" : n ? String(n) : I18N.t("sx.none"));
      S.requestDraw();
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#f4f5f8"; ctx.fillRect(0, 0, S.W, S.H);

      /* drawContinuous / drawEmission: the strip the lines are laid onto */
      if (kind === "emis") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(STRIP.x, STRIP.y, STRIP.w, STRIP.h);
      } else {
        var g = ctx.createLinearGradient(STRIP.x, 0, STRIP.x + STRIP.w, 0);
        for (var t = 0; t <= 48; t++) {
          var c = visibleRGB(LAM0 + (LAM1 - LAM0) * t / 48);
          g.addColorStop(t / 48, "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")");
        }
        ctx.fillStyle = g;
        ctx.fillRect(STRIP.x, STRIP.y, STRIP.w, STRIP.h);
      }

      /* drawColorSet: each family's lines at the strength its ramp gives */
      if (kind !== "cont") {
        var r = ramp(type), w = lineWidth();
        FAMILIES.forEach(function (f) {
          if (!on[f.key]) return;
          var a = Math.min(1, r[f.key] / 100);
          if (a <= 0) return;
          ctx.globalAlpha = a;
          f.lines.forEach(function (nm) {
            if (nm < LAM0 || nm > LAM1) return;
            var x = STRIP.x + STRIP.w * (nm - LAM0) / (LAM1 - LAM0);
            if (kind === "emis") {
              var c = visibleRGB(nm);
              ctx.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
            } else ctx.fillStyle = "#000000";
            ctx.fillRect(x - w / 2, STRIP.y, w, STRIP.h);
          });
        });
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = "#8a8f98"; ctx.lineWidth = 1;
      ctx.strokeRect(STRIP.x + 0.5, STRIP.y + 0.5, STRIP.w - 1, STRIP.h - 1);

      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillStyle = "#555555"; ctx.font = "10px " + FONT;
      for (var nm = 400; nm <= 700; nm += 50) {
        var x = STRIP.x + STRIP.w * (nm - LAM0) / (LAM1 - LAM0);
        ctx.beginPath();
        ctx.moveTo(x, STRIP.y + STRIP.h); ctx.lineTo(x, STRIP.y + STRIP.h + 4);
        ctx.strokeStyle = "#8a8f98"; ctx.stroke();
        ctx.fillText(String(nm), x, STRIP.y + STRIP.h + 6);
      }
      ctx.fillStyle = "#333333"; ctx.font = "11px " + FONT;
      ctx.fillText(tr("sx.wave"), STRIP.x + STRIP.w / 2, STRIP.y + STRIP.h + 22);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#222222"; ctx.font = "12px " + FONT;
      ctx.fillText(tr("sx." + (kind === "cont" ? "cont" : kind === "emis" ? "emis" : "abs")) +
        (kind === "cont" ? "" : "  ·  " + typeName(type) + "  ·  " +
          sig(Math.pow(10, logTempFromType(type)), 3) + " K"), STRIP.x, STRIP.y - 10);

      /* a strength bar per family, so it is clear why a line is faint */
      ctx.fillStyle = "#333333"; ctx.font = "12px " + FONT;
      ctx.fillText(tr("sx.strength"), BARS.x, BARS.y - 6);
      var rr = ramp(type);
      FAMILIES.forEach(function (f, i) {
        var col = i % 2, row = Math.floor(i / 2);
        var bx = BARS.x + col * 304, by = BARS.y + 8 + row * 34;
        ctx.globalAlpha = on[f.key] || kind === "cont" ? 1 : 0.4;
        ctx.fillStyle = f.colour;
        ctx.fillRect(bx, by, 10, 10);
        ctx.fillStyle = "#333333"; ctx.font = "11px " + FONT;
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(tr(f.label), bx + 16, by + 5);
        ctx.fillStyle = "#dfe3ea";
        ctx.fillRect(bx + 130, by, 120, 10);
        ctx.fillStyle = f.colour;
        ctx.fillRect(bx + 130, by, 120 * Math.min(1, rr[f.key] / 100), 10);
        ctx.fillStyle = "#666666"; ctx.font = "10px " + MONO;
        ctx.fillText(String(rr[f.key]), bx + 256, by + 5);
        ctx.globalAlpha = 1;
      });
    });

    sync();
  }
});
