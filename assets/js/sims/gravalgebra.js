/* Gravity Algebra --------------------------------------------------------------
   Faithful rebuild of the ClassAction "gravalgebra.swf" (MultiplierSelectorClass
   and the root onChange(), decompiled). Newton's law of gravity is written out
   twice:

        F  = G M₁ M₂ / R²
        F′ = G (a M₁)(b M₂) / (c R)²  =  (a·b / c²) F

   Click any red coefficient and a callout offers ⅓, ½, 1, 2 or 3. The answer is
   kept exact, as in the original: every choice is a power of 2 and 3, so the
   ratio is 2^(p₂) · 3^(p₃) and is shown either as a whole number or as a
   fraction.                                                                     */
Sim.create({
  id: "gravalgebra",
  width: 720, height: 480,
  strings: {
    en: {
      "ga.coefs": "Coefficients", "ga.m1": "multiply M₁ by", "ga.m2": "multiply M₂ by", "ga.r": "multiply R by",
      "ga.hint": "click the coefficients to change their values",
      "ga.reset": "reset all to 1",
      "ga.rRatio": "F′ ÷ F", "ga.rDec": "as a decimal", "ga.rWhat": "the force becomes",
      "ga.stronger": "{x}× stronger", "ga.weaker": "{x} as strong", "ga.same": "unchanged"
    },
    id: {
      "ga.coefs": "Koefisien", "ga.m1": "kalikan M₁ dengan", "ga.m2": "kalikan M₂ dengan", "ga.r": "kalikan R dengan",
      "ga.hint": "klik koefisien untuk mengubah nilainya",
      "ga.reset": "setel ulang semua ke 1",
      "ga.rRatio": "F′ ÷ F", "ga.rDec": "dalam desimal", "ga.rWhat": "gayanya menjadi",
      "ga.stronger": "{x}× lebih kuat", "ga.weaker": "{x} kali semula", "ga.same": "tidak berubah"
    }
  },
  about: {
    en: "<p>You rarely need the value of <strong>G</strong> to reason about gravity. Newton's law, F = GM₁M₂/R², says how the force <em>scales</em>: double one mass and the force doubles; double both and it quadruples.</p>" +
        "<p>Distance works the other way and twice as hard, because it is squared in the denominator. Move two bodies twice as far apart and the force drops to ¼; three times as far and it drops to ⅑. Halve the distance and it grows fourfold.</p>" +
        "<p>Combine changes by multiplying their effects: tripling one mass while doubling the distance gives 3 × 1 ÷ 2² = ¾ of the original force. Try to predict each answer before you click.</p>",
    id: "<p>Anda jarang memerlukan nilai <strong>G</strong> untuk menalar gravitasi. Hukum Newton, F = GM₁M₂/R², menyatakan bagaimana gaya itu <em>berskala</em>: gandakan satu massa dan gayanya berlipat dua; gandakan keduanya dan gayanya berlipat empat.</p>" +
        "<p>Jarak bekerja sebaliknya dan dua kali lebih kuat, karena dikuadratkan di penyebut. Jauhkan dua benda menjadi dua kali lipat dan gayanya turun menjadi ¼; tiga kali lipat dan turun menjadi ⅑. Separuhkan jaraknya dan gaya naik empat kali.</p>" +
        "<p>Gabungkan perubahan dengan mengalikan efeknya: melipattigakan satu massa sambil menggandakan jarak menghasilkan 3 × 1 ÷ 2² = ¾ gaya semula. Coba tebak setiap jawaban sebelum Anda mengeklik.</p>"
  },
  build: function (S) {
    var K = S.W / 533.5, OY = 36.6;                  // SWF panel (8.3..541.8 × 36.6..392.6) → canvas
    var OXs = 8.3;
    // choicesList exactly as MultiplierSelectorClass defines it
    var CHOICES = [
      { key: "1/3", p3: -1, p2: 0, value: 1 / 3 }, { key: "1/2", p3: 0, p2: -1, value: 0.5 },
      { key: "1", p3: 0, p2: 0, value: 1 }, { key: "2", p3: 0, p2: 1, value: 2 }, { key: "3", p3: 1, p2: 0, value: 3 }
    ];
    var C = { panel: "#fafafa", ink: "#000000", red: "#ff0000", hint: "#333333", grey: "#808080", hover: "#cfe2f7", border: "#a0a0a0" };

    /* ---- state: all three coefficients start at 1 ---- */
    var sel = { m1: 2, m2: 2, r: 2 };
    var COEF = {                                     // where each coefficient sits on the stage
      m1: { x: 221.4, y: 202 }, m2: { x: 294.3, y: 202 }, r: { x: 243.4, y: 251.6 }
    };
    var open = null, hover = -1;

    /* ================================ controls ================================ */
    S.group("ga.coefs");
    var ctls = {};
    [["m1", "ga.m1"], ["m2", "ga.m2"], ["r", "ga.r"]].forEach(function (d) {
      ctls[d[0]] = S.select({
        labelKey: d[1], value: "2",
        options: CHOICES.map(function (c, i) { return { v: String(i), label: c.key.replace("1/3", "⅓").replace("1/2", "½") }; }),
        on: function (v) { sel[d[0]] = +v; upd(); }
      });
    });
    S.button({ labelKey: "ga.reset", on: function () { ["m1", "m2", "r"].forEach(function (k) { setCoef(k, 2); }); } });

    var outRatio = S.readout({ labelKey: "ga.rRatio" });
    var outDec = S.readout({ labelKey: "ga.rDec" });
    var outWhat = S.readout({ labelKey: "ga.rWhat" });

    // the select's on() stores the choice and redraws, so the canvas callout just drives it
    function setCoef(k, i) { ctls[k].set(String(i)); }

    /* ---- onChange(): exact ratio as 2^p2 · 3^p3 ---- */
    function ratio() {
      var a = CHOICES[sel.m1], b = CHOICES[sel.m2], c = CHOICES[sel.r];
      var p2 = (a.p2 + b.p2) - (c.p2 + c.p2), p3 = (a.p3 + b.p3) - (c.p3 + c.p3);
      var den = 1, num = 1;
      if (p2 < 0) den *= Math.pow(2, -p2); else num *= Math.pow(2, p2);
      if (p3 < 0) den *= Math.pow(3, -p3); else num *= Math.pow(3, p3);
      return { num: num, den: den };
    }
    function upd() {
      var q = ratio(), v = q.num / q.den;
      outRatio(q.den === 1 ? String(q.num) : q.num + "/" + q.den);
      outDec(+v.toPrecision(4) + "");
      var frac = q.den === 1 ? String(q.num) : q.num + "/" + q.den;
      outWhat(v === 1 ? I18N.t("ga.same") : I18N.t(v > 1 ? "ga.stronger" : "ga.weaker").replace("{x}", frac));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- the callout (choicesMC): 5 × 26 px choices at 60 %, 7 px margin, tail to the coefficient ---- */
    var CW = 26 * 0.6, CH = 30 * 0.6, MARGIN = 7 * 0.6;
    function calloutRect(k) {
      var c = COEF[k], w = CW * 5;
      var x0 = c.x - w / 2, y1 = c.y - 17, y0 = y1 - CH;
      return { x0: x0, y0: y0, y1: y1, w: w };
    }
    function choiceAt(k, p) {
      var r = calloutRect(k);
      if (p.y < r.y0 - MARGIN || p.y > r.y1 + MARGIN) return -1;
      var i = Math.floor((p.x - r.x0) / CW);
      return i >= 0 && i < 5 ? i : -1;
    }
    function coefAt(p) {
      var hit = null;
      Object.keys(COEF).forEach(function (k) {
        var c = COEF[k];
        if (Math.abs(p.x - c.x) < 11 && Math.abs(p.y - c.y) < 15) hit = k;
      });
      return hit;
    }
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      var cx = (ev.clientX - r.left) * S.W / r.width, cy = (ev.clientY - r.top) * S.H / r.height;
      return { x: cx / K + OXs, y: cy / K + OY };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = stageXY(ev);
      if (open) {
        var i = choiceAt(open, p);
        if (i >= 0) { setCoef(open, i); open = null; hover = -1; S.requestDraw(); return; }
      }
      var k = coefAt(p);
      open = k && k !== open ? k : null;
      hover = -1;
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stageXY(ev), h = open ? choiceAt(open, p) : -1;
      if (h !== hover) { hover = h; S.requestDraw(); }
      S.canvas.style.cursor = (h >= 0 || coefAt(p)) ? "pointer" : "default";
    });
    S.canvas.addEventListener("pointerleave", function () { if (hover !== -1) { hover = -1; S.requestDraw(); } });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.save();
      ctx.scale(K, K); ctx.translate(-OXs, -OY);
      ctx.fillStyle = C.panel; ctx.fillRect(8.3, 36.6, 533.5, 356);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(8.8, 37.1, 532.5, 355);

      ctx.textBaseline = "middle"; ctx.fillStyle = C.ink;
      // F = G M1 M2 / R^2
      it(ctx, "F", 199.4, 100.3, 23, "center");
      txt(ctx, "=", 236.5, 100.3, 23, "center");
      var nx = 270.5;
      nx = it(ctx, "G", nx, 81.7, 23, "left") + 1;
      nx = it(ctx, "M", nx, 81.7, 23, "left"); nx = sub(ctx, "1", nx, 81.7);
      nx = it(ctx, "M", nx, 81.7, 23, "left"); sub(ctx, "2", nx, 81.7);
      ctx.fillRect(269.5, 98.5, 89.5, 1.1);
      var rx = it(ctx, "R", 305, 118.9, 23, "left"); sup(ctx, "2", rx, 118.9);

      // F′ = G a M1 b M2 / (c R)^2
      it(ctx, "F′", 86, 227.5, 25, "center");
      txt(ctx, "=", 125.8, 227.5, 25, "center");
      it(ctx, "G", 177.4, 203.4, 25, "center");
      coef(ctx, "m1");
      nx = it(ctx, "M", 238.5, 203.4, 25, "left"); sub(ctx, "1", nx, 203.4);
      coef(ctx, "m2");
      nx = it(ctx, "M", 310.5, 203.4, 25, "left"); sub(ctx, "2", nx, 203.4);
      ctx.fillStyle = C.ink; ctx.fillRect(168.4, 226.3, 175.4, 1.1);
      txt(ctx, "(", 221.4 - 3, 250.2, 25, "center");
      coef(ctx, "r");
      it(ctx, "R", 269.5, 250.2, 25, "center");
      var px = txt(ctx, ")", 285, 250.2, 25, "left"); sup(ctx, "2", px + 1, 250.2);

      txt(ctx, "=", 390.5, 227.5, 25, "center");
      var q = ratio();
      ctx.fillStyle = C.ink;
      if (q.den === 1) {
        txt(ctx, String(q.num), 446.9, 227.5, 25, "center");
      } else {
        txt(ctx, String(q.num), 440, 212.4, 25, "center");
        ctx.fillRect(422.8, 226.3, 34.4, 1.1);
        txt(ctx, String(q.den), 440, 244, 25, "center");
      }
      it(ctx, "F", 471.6, 227.5, 25, "center");

      ctx.fillStyle = C.hint;
      ctx.font = "italic 13px Verdana, system-ui, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(t("ga.hint"), 275, 358.8);

      if (open) drawCallout(ctx, open);
      ctx.restore();
    });

    function txt(ctx, s, x, y, size, align) {
      ctx.font = size + "px Verdana, system-ui, sans-serif"; ctx.textAlign = align;
      ctx.fillText(s, x, y);
      return align === "left" ? x + ctx.measureText(s).width : x;
    }
    function it(ctx, s, x, y, size, align) {
      ctx.font = "italic " + size + "px Verdana, system-ui, sans-serif"; ctx.textAlign = align;
      ctx.fillText(s, x, y);
      return align === "left" ? x + ctx.measureText(s).width : x;
    }
    // italic capitals lean right, so scripts start a touch past the measured advance
    function sub(ctx, s, x, y) {
      ctx.font = "14px Verdana, system-ui, sans-serif"; ctx.textAlign = "left";
      ctx.fillText(s, x + 1.5, y + 6);
      return x + 1.5 + ctx.measureText(s).width + 2;
    }
    function sup(ctx, s, x, y) {
      ctx.font = "14px Verdana, system-ui, sans-serif"; ctx.textAlign = "left";
      ctx.fillText(s, x + 2, y - 9);
      return x + 2 + ctx.measureText(s).width;
    }
    // a coefficient in red — ⅓ and ½ are drawn as stacked fractions like the SWF's symbols
    function coef(ctx, k) {
      var c = COEF[k];
      ctx.save();
      drawChoice(ctx, CHOICES[sel[k]].key, c.x, c.y, 1, C.red);
      ctx.restore();
    }
    function drawChoice(ctx, key, x, y, s, col) {
      ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      if (key.indexOf("/") < 0) {
        ctx.font = (26 * s) + "px Verdana, system-ui, sans-serif";
        ctx.fillText(key, x, y + 1 * s);
      } else {
        var d = key.split("/")[1];
        ctx.font = (14 * s) + "px Verdana, system-ui, sans-serif";
        ctx.fillText("1", x - 3.5 * s, y - 5 * s);
        ctx.fillText(d, x + 3.5 * s, y + 6 * s);
        ctx.save();
        ctx.strokeStyle = col; ctx.lineWidth = 1.2 * s;
        ctx.beginPath(); ctx.moveTo(x + 4.5 * s, y - 10 * s); ctx.lineTo(x - 4.5 * s, y + 10 * s); ctx.stroke();
        ctx.restore();
      }
    }
    function drawCallout(ctx, k) {
      var r = calloutRect(k), c = COEF[k], mid = c.x;
      ctx.fillStyle = "#ffffff"; ctx.strokeStyle = C.border; ctx.lineWidth = 1.8; ctx.lineJoin = "miter";
      ctx.beginPath();
      ctx.moveTo(r.x0 - MARGIN, r.y0 - MARGIN);
      ctx.lineTo(r.x0 + r.w + MARGIN, r.y0 - MARGIN);
      ctx.lineTo(r.x0 + r.w + MARGIN, r.y1 + MARGIN);
      ctx.lineTo(mid + 18 * 0.6, r.y1 + MARGIN);
      ctx.lineTo(mid, r.y1 + MARGIN + 8 * 0.6);
      ctx.lineTo(mid - 18 * 0.6, r.y1 + MARGIN);
      ctx.lineTo(r.x0 - MARGIN, r.y1 + MARGIN);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      for (var i = 0; i < 5; i++) {
        var cx = r.x0 + (i + 0.5) * CW, cy = (r.y0 + r.y1) / 2;
        if (i === hover) { ctx.fillStyle = C.hover; ctx.fillRect(r.x0 + i * CW + 1, r.y0 + 0.5, CW - 2, CH - 1); }
        drawChoice(ctx, CHOICES[i].key, cx, cy, 0.6, i === sel[k] ? C.red : C.grey);
      }
    }

    upd();
  }
});
