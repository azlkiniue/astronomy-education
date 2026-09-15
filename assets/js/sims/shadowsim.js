/* Eclipse Shadow Simulator -----------------------------------------------------
   Faithful rebuild of the ClassAction "shadowsim.swf" (ShadowClass.update(),
   decompiled). Drag Earth and the Moon anywhere on the stage; each casts the two
   cones an extended light source produces:

     • the umbra   — bounded by the external tangents to Sun and body, closing to
                     a point d·s/(s − r) from the Sun; inside it the Sun is hidden;
     • the penumbra — bounded by the internal tangents, widening forever; inside
                     it the Sun is only partly covered;
     • the antumbra — the cone beyond the umbra's tip (outlined, as in the SWF),
                     where the body looks smaller than the Sun: an annular eclipse.

   Sizes and distances are wildly out of scale, exactly as in the original, so the
   geometry is easy to see. The readouts (our addition) name the eclipse each body
   would experience.                                                             */
Sim.create({
  id: "shadowsim",
  width: 900, height: 500,
  strings: {
    en: {
      "sh.place": "Arrange", "sh.reset": "reset", "sh.lunar": "lunar eclipse", "sh.solar": "total solar eclipse",
      "sh.annular": "annular eclipse", "sh.show": "Show", "sh.labels": "label the shadow regions",
      "sh.hint": "Drag Earth and the Moon.",
      "sh.rMoon": "the Moon (lunar eclipse)", "sh.rEarth": "Earth (solar eclipse)",
      "sh.none": "no eclipse", "sh.penumbral": "penumbral eclipse", "sh.partialL": "partial eclipse",
      "sh.totalL": "total eclipse", "sh.partialS": "partial eclipse", "sh.totalS": "total eclipse (in the umbra's path)",
      "sh.annularS": "annular eclipse", "sh.umbra": "umbra", "sh.penumbra": "penumbra", "sh.antumbra": "antumbra"
    },
    id: {
      "sh.place": "Susun", "sh.reset": "atur ulang", "sh.lunar": "gerhana Bulan", "sh.solar": "gerhana Matahari total",
      "sh.annular": "gerhana cincin", "sh.show": "Tampilkan", "sh.labels": "beri label daerah bayangan",
      "sh.hint": "Seret Bumi dan Bulan.",
      "sh.rMoon": "Bulan (gerhana Bulan)", "sh.rEarth": "Bumi (gerhana Matahari)",
      "sh.none": "tidak ada gerhana", "sh.penumbral": "gerhana penumbra", "sh.partialL": "gerhana sebagian",
      "sh.totalL": "gerhana total", "sh.partialS": "gerhana sebagian", "sh.totalS": "gerhana total (di jalur umbra)",
      "sh.annularS": "gerhana cincin", "sh.umbra": "umbra", "sh.penumbra": "penumbra", "sh.antumbra": "antumbra"
    }
  },
  about: {
    en: "<p>The Sun is not a point: it is a disc half a degree wide. So the shadow behind Earth or the Moon has two parts. In the <strong>umbra</strong> the whole Sun is blocked; in the surrounding <strong>penumbra</strong> only part of it is. Because the Sun is bigger than the body casting the shadow, the umbra is a cone that narrows to a point, while the penumbra keeps widening.</p>" +
        "<p>Put the Moon in Earth's shadow and you have a <strong>lunar eclipse</strong>: <em>penumbral</em> if it only grazes the penumbra (hard to notice), <em>partial</em> when it dips into the umbra, <em>total</em> when it is wholly inside. Put Earth in the Moon's shadow for a <strong>solar eclipse</strong>: the Moon's umbra is so narrow it only touches a small patch of Earth — there the eclipse is total, and everywhere in the penumbra it is partial.</p>" +
        "<p>If Earth lies beyond the tip of the Moon's umbra, in the <strong>antumbra</strong>, the Moon looks too small to cover the Sun and leaves a bright ring: an <strong>annular eclipse</strong>. The real Moon's umbra is almost exactly as long as the Earth–Moon distance, which is why both total and annular eclipses happen.</p>",
    id: "<p>Matahari bukan titik: ia cakram selebar setengah derajat. Maka bayangan di belakang Bumi atau Bulan punya dua bagian. Di <strong>umbra</strong> seluruh Matahari terhalang; di <strong>penumbra</strong> di sekelilingnya hanya sebagian. Karena Matahari lebih besar daripada benda yang membentuk bayangan, umbra berupa kerucut yang menyempit menjadi titik, sedangkan penumbra terus melebar.</p>" +
        "<p>Letakkan Bulan di bayangan Bumi dan terjadilah <strong>gerhana Bulan</strong>: <em>penumbra</em> jika hanya menyerempet penumbra (sulit terlihat), <em>sebagian</em> saat masuk ke umbra, <em>total</em> saat sepenuhnya di dalamnya. Letakkan Bumi di bayangan Bulan untuk <strong>gerhana Matahari</strong>: umbra Bulan begitu sempit sehingga hanya menyentuh sebagian kecil Bumi — di sana gerhananya total, dan di seluruh daerah penumbra gerhananya sebagian.</p>" +
        "<p>Jika Bumi berada di luar ujung umbra Bulan, di <strong>antumbra</strong>, Bulan tampak terlalu kecil untuk menutupi Matahari dan menyisakan cincin terang: <strong>gerhana cincin</strong>. Panjang umbra Bulan yang sebenarnya hampir persis sama dengan jarak Bumi–Bulan, itulah sebabnya gerhana total maupun cincin sama-sama terjadi.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var SUN = { x: 54, y: 250, r: 50 };
    var START = { earth: { x: 310.8, y: 203.9 }, moon: { x: 327.9, y: 313.9 } };   // the SWF's layout
    var bodies = {
      earth: { x: START.earth.x, y: START.earth.y, r: 24.85 },
      moon: { x: START.moon.x, y: START.moon.y, r: 9.9 }
    };
    var labels = false, drag = null;

    /* ================================ controls ================================ */
    S.group("sh.place");
    S.button({ labelKey: "sh.reset", on: function () { place(START.earth, START.moon); } });
    S.button({ labelKey: "sh.lunar", on: function () { place({ x: 300, y: 250 }, { x: 410, y: 252 }); } });
    S.button({ labelKey: "sh.solar", on: function () { place({ x: 392, y: 262 }, { x: 330, y: 250 }); } });
    S.button({ labelKey: "sh.annular", on: function () { place({ x: 560, y: 250 }, { x: 300, y: 250 }); } });
    S.group("sh.show");
    S.toggle({ labelKey: "sh.labels", value: labels, on: function (b) { labels = b; } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "sh.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var outMoon = S.readout({ labelKey: "sh.rMoon" });
    var outEarth = S.readout({ labelKey: "sh.rEarth" });

    function place(e, m) {
      bodies.earth.x = e.x; bodies.earth.y = e.y;
      bodies.moon.x = m.x; bodies.moon.y = m.y;
      upd();
    }

    /* ---- ShadowClass geometry, in the frame "Sun at the origin, body along +x" ---- */
    function shadowOf(b) {
      var dx = b.x - SUN.x, dy = b.y - SUN.y, d = Math.hypot(dx, dy);
      var s = SUN.r, r = b.r;
      var sa = (s + r) / d, a = Math.asin(Math.min(1, sa)), ca = Math.cos(a), ta = Math.tan(a);
      var sb = (s - r) / d, bb = Math.asin(sb), cb = Math.cos(bb), tb = Math.tan(bb);
      return {
        ang: Math.atan2(dy, dx), d: d,
        x2: d - r * sa, y2: r * ca, x3: s / sa, ta: ta,          // penumbra (internal tangents)
        x6: d + r * sb, y6: r * cb, x7: d + r / sb, tb: tb        // umbra (external) + its tip
      };
    }
    function toLocal(sh, x, y) {
      var dx = x - SUN.x, dy = y - SUN.y, c = Math.cos(sh.ang), s = Math.sin(sh.ang);
      return { x: dx * c + dy * s, y: -dx * s + dy * c };
    }
    function region(sh, p) {                        // which parts of the shadow a point is in
      var ay = Math.abs(p.y);
      return {
        umbra: p.x >= sh.x6 && p.x <= sh.x7 && ay <= sh.y6 * (sh.x7 - p.x) / (sh.x7 - sh.x6),
        antumbra: p.x > sh.x7 && ay <= (p.x - sh.x7) * sh.tb,
        penumbra: p.x >= sh.x2 && ay <= (p.x - sh.x3) * sh.ta
      };
    }
    // sample the target disc and see which shadow regions it touches
    function coverage(caster, target) {
      var sh = shadowOf(caster), n = 0, inU = 0, inA = 0, inP = 0;
      for (var ring = 0; ring <= 4; ring++) {
        var rr = target.r * ring / 4, k = ring === 0 ? 1 : ring * 10;
        for (var i = 0; i < k; i++) {
          var a = i / k * TAU;
          var q = region(sh, toLocal(sh, target.x + rr * Math.cos(a), target.y + rr * Math.sin(a)));
          n++; if (q.umbra) inU++; if (q.antumbra) inA++; if (q.penumbra) inP++;
        }
      }
      return { all: n, umbra: inU, antumbra: inA, penumbra: inP };
    }
    function upd() {
      var lm = coverage(bodies.earth, bodies.moon);
      outMoon(I18N.t(lm.umbra === lm.all ? "sh.totalL" : lm.umbra ? "sh.partialL" : lm.penumbra ? "sh.penumbral" : "sh.none"));
      var se = coverage(bodies.moon, bodies.earth);
      outEarth(I18N.t(se.umbra ? "sh.totalS" : se.antumbra ? "sh.annularS" : se.penumbra ? "sh.partialS" : "sh.none"));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- dragging: onPressFunc / onMouseMoveFuncFunc ---- */
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function bodyAt(p) {                            // the Moon sits on top, as in the SWF
      if (Math.hypot(p.x - bodies.moon.x, p.y - bodies.moon.y) <= bodies.moon.r + 3) return bodies.moon;
      if (Math.hypot(p.x - bodies.earth.x, p.y - bodies.earth.y) <= bodies.earth.r + 2) return bodies.earth;
      return null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = stageXY(ev), b = bodyAt(p);
      if (!b) return;
      drag = { b: b, ox: p.x - b.x, oy: p.y - b.y };
      S.canvas.setPointerCapture(ev.pointerId); S.canvas.style.cursor = "grabbing";
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stageXY(ev);
      if (!drag) { S.canvas.style.cursor = bodyAt(p) ? "grab" : "default"; return; }
      moveTo(drag.b, p.x - drag.ox, p.y - drag.oy);
      upd();
    });
    function endDrag() { drag = null; S.canvas.style.cursor = "default"; }
    S.canvas.addEventListener("pointerup", endDrag);
    S.canvas.addEventListener("pointercancel", endDrag);

    function moveTo(b, nx, ny) {
      var margin = 20, keep = SUN.r + b.r + margin;
      var xs = nx - SUN.x, ys = ny - SUN.y, ds = Math.hypot(xs, ys);
      if (ds < keep) {                              // never closer to the Sun than its radius + ours + 20
        var as = Math.atan2(ys, xs);
        nx = SUN.x + keep * Math.cos(as); ny = SUN.y + keep * Math.sin(as);
      }
      if (nx < 0) {
        nx = 0;
        var delta = Math.sqrt(keep * keep - SUN.x * SUN.x);
        if (ny < SUN.y && ny > SUN.y - delta) ny = SUN.y - delta;
        else if (ny >= SUN.y && ny < SUN.y + delta) ny = SUN.y + delta;
      } else if (nx > 900) nx = 900;
      if (ny < 0) ny = 0; else if (ny > 500) ny = 500;
      b.x = nx; b.y = ny;
    }

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);
      drawShadow(ctx, bodies.earth);
      drawShadow(ctx, bodies.moon);
      if (labels) drawLabels(ctx, t, bodies.earth);
      drawBody(ctx, bodies.earth, "#a8a7f4", "#7670ef");
      drawBody(ctx, SUN, "#f7e9c4", "#f7bf4e");
      drawBody(ctx, bodies.moon, "#c0c0c0", "#818181");
    });

    function drawShadow(ctx, b) {
      var sh = shadowOf(b), X = 1200;
      ctx.save();
      ctx.translate(SUN.x, SUN.y); ctx.rotate(sh.ang);
      ctx.strokeStyle = "rgba(80,80,80,0.5)"; ctx.lineWidth = 1;
      // penumbra: 10 % #505050 between the internal tangents
      var y4 = (X - sh.x3) * sh.ta;
      ctx.fillStyle = "rgba(80,80,80,0.10)";
      ctx.beginPath();
      ctx.moveTo(sh.x2, sh.y2); ctx.lineTo(X, y4); ctx.lineTo(X, -y4); ctx.lineTo(sh.x2, -sh.y2); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // umbra: 90 % #b0b0b0 closing to its tip
      ctx.fillStyle = "rgba(176,176,176,0.90)";
      ctx.beginPath();
      ctx.moveTo(sh.x6, sh.y6); ctx.lineTo(sh.x6, -sh.y6); ctx.lineTo(sh.x7, 0); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // antumbra: outline only
      var y8 = (X - sh.x7) * sh.tb;
      ctx.beginPath();
      ctx.moveTo(sh.x7, 0); ctx.lineTo(X, y8); ctx.lineTo(X, -y8); ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    function drawLabels(ctx, t, b) {
      var sh = shadowOf(b);
      ctx.save();
      ctx.translate(SUN.x, SUN.y); ctx.rotate(sh.ang);
      ctx.font = "italic 13px Georgia, serif"; ctx.fillStyle = "#333333"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      label(ctx, t("sh.umbra"), sh.x6 + Math.min(42, (sh.x7 - sh.x6) * 0.3), 0, sh.ang);
      var xp = Math.min(sh.x7 + 60, 760);
      label(ctx, t("sh.penumbra"), xp, (xp - sh.x3) * sh.ta * 0.75, sh.ang);
      label(ctx, t("sh.antumbra"), Math.min(sh.x7 + 150, 860), 0, sh.ang);
      ctx.restore();
    }
    function label(ctx, s, x, y, ang) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(-ang);           // keep the words upright
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.strokeText(s, 0, 0);
      ctx.fillText(s, 0, 0); ctx.restore();
    }

    function drawBody(ctx, b, inner, outer) {
      var g = ctx.createRadialGradient(b.x - b.r * 0.15, b.y - b.r * 0.15, b.r * 0.05, b.x, b.y, b.r);
      g.addColorStop(0, inner); g.addColorStop(1, outer);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill();
    }

    upd();
  }
});
