/* Ptolemaic Phases of Venus ----------------------------------------------------
   Faithful rebuild of the ClassAction "renaissance/ptolemaic.swf" (animationUpdate,
   decompiled). In Ptolemy's geocentric scheme Venus rides an epicycle (radius 108)
   whose centre sits on a deferent (radius 150) and always stays on the line from
   Earth to the Sun (radius 290). Venus goes round its epicycle every 0.615 yr.

   The panel on the right draws Venus as a telescope would show it: its phase from
   the angle at Venus between the Sun and Earth, its size ∝ 1/distance. Because
   Venus can never get beyond the Sun in this model it only ever shows new and
   crescent phases — never gibbous or full, which is exactly what Galileo's
   telescope proved wrong in 1610.                                              */
Sim.create({
  id: "ptolemaicvenus",
  width: 900, height: 660,
  strings: {
    en: {
      "pv.anim": "Animation", "pv.start": "start animation", "pv.stop": "stop animation",
      "pv.speed": "seconds per year",
      "pv.caption1": "Venus as would be seen through", "pv.caption2": "a telescope in this configuration:",
      "pv.rPhase": "illuminated", "pv.rName": "phase", "pv.rSize": "apparent size", "pv.rElong": "elongation",
      "pv.new": "new", "pv.crescent": "crescent", "pv.quarter": "quarter", "pv.gibbous": "gibbous", "pv.full": "full",
      "pv.show": "Show", "pv.labels": "labels",
      "lb.earth": "Earth", "lb.sun": "Sun", "lb.venus": "Venus", "lb.deferent": "deferent", "lb.epicycle": "epicycle"
    },
    id: {
      "pv.anim": "Animasi", "pv.start": "mulai animasi", "pv.stop": "hentikan animasi",
      "pv.speed": "detik per tahun",
      "pv.caption1": "Venus seperti terlihat melalui", "pv.caption2": "teleskop pada konfigurasi ini:",
      "pv.rPhase": "bagian terang", "pv.rName": "fase", "pv.rSize": "ukuran tampak", "pv.rElong": "elongasi",
      "pv.new": "baru", "pv.crescent": "sabit", "pv.quarter": "separuh", "pv.gibbous": "cembung", "pv.full": "purnama",
      "pv.show": "Tampilkan", "pv.labels": "label",
      "lb.earth": "Bumi", "lb.sun": "Matahari", "lb.venus": "Venus", "lb.deferent": "deferen", "lb.epicycle": "episiklus"
    }
  },
  about: {
    en: "<p>Venus is never seen far from the Sun — at most about 47° — so Ptolemy tied the centre of its epicycle to the Earth–Sun line. Venus then swings back and forth on either side of the Sun as seen from Earth, just as observed.</p>" +
        "<p>But the model makes a firm prediction about <strong>phases</strong>. Venus shines by reflected sunlight, and in this arrangement it always lies between Earth and the Sun, so we always see mostly its unlit side: new moon-like or thin crescent phases, and it looks largest when it is the thinnest crescent. A gibbous or full Venus is impossible.</p>" +
        "<p>In 1610 Galileo turned his telescope on Venus and watched it go through a <em>full</em> set of phases, gibbous and small when on the far side of the Sun, crescent and large when near us. Only a Sun-centred orbit can do that. Compare this animation with the heliocentric <em>Phases of Venus</em> simulation.</p>",
    id: "<p>Venus tak pernah terlihat jauh dari Matahari — paling jauh sekitar 47° — sehingga Ptolemaeus mengikat pusat episiklusnya pada garis Bumi–Matahari. Venus lalu berayun bolak-balik di kedua sisi Matahari dilihat dari Bumi, sesuai pengamatan.</p>" +
        "<p>Namun model ini membuat ramalan tegas tentang <strong>fase</strong>. Venus bersinar dengan memantulkan cahaya Matahari, dan dalam susunan ini ia selalu berada di antara Bumi dan Matahari, sehingga kita selalu melihat sebagian besar sisi gelapnya: fase baru atau sabit tipis, dan tampak paling besar saat sabitnya paling tipis. Venus cembung atau purnama mustahil terjadi.</p>" +
        "<p>Pada 1610 Galileo mengarahkan teleskopnya ke Venus dan menyaksikannya melewati fase <em>lengkap</em>, cembung dan kecil saat di sisi jauh Matahari, sabit dan besar saat dekat kita. Hanya orbit yang berpusat pada Matahari yang dapat melakukannya. Bandingkan animasi ini dengan simulasi heliosentris <em>Fase Venus</em>.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, R2D = 180 / Math.PI;
    var E = { x: 330, y: 330 };                      // deferentMC's origin = Earth
    var PHASE = { x: 756.95, y: 178.55 };            // phaseMC
    var EPI = 108, DEF = 150, SUNR = 290, VENUS_P = 0.615178;
    var BTN = { x: 690.95, y: 351.45, w: 132, h: 33 };

    var sunAngle = 0, venusAngle = 0, secPerYear = 12, labels = false;

    S.group("pv.anim");
    var loop = S.loop(function (dt) {
      var yr = dt / secPerYear;
      sunAngle += yr * TAU;
      venusAngle += yr / VENUS_P * TAU;
      upd();
    });
    var bAnim = S.button({ labelKey: "pv.start", primary: true, on: toggle });
    bAnim.removeAttribute("data-i18n");
    S.slider({
      labelKey: "pv.speed", min: 3, max: 30, value: secPerYear, step: 1,
      format: function (v) { return v + " s"; },
      on: function (v) { secPerYear = v; }
    });
    S.group("pv.show");
    S.toggle({ labelKey: "pv.labels", value: labels, on: function (b) { labels = b; } });
    var outPhase = S.readout({ labelKey: "pv.rPhase" });
    var outName = S.readout({ labelKey: "pv.rName" });
    var outSize = S.readout({ labelKey: "pv.rSize" });
    var outElong = S.readout({ labelKey: "pv.rElong" });

    function toggle() { if (loop.playing) loop.pause(); else loop.play(); syncBtn(); S.requestDraw(); }
    function syncBtn() { bAnim.textContent = I18N.t(loop.playing ? "pv.stop" : "pv.start"); }

    function geometry() {
      var sun = { x: E.x + SUNR * Math.cos(sunAngle), y: E.y - SUNR * Math.sin(sunAngle) };
      var epi = { x: E.x + DEF * Math.cos(sunAngle), y: E.y - DEF * Math.sin(sunAngle) };
      var ven = { x: epi.x + EPI * Math.cos(venusAngle), y: epi.y - EPI * Math.sin(venusAngle) };
      var evd = Math.hypot(ven.x - E.x, ven.y - E.y), svd = Math.hypot(ven.x - sun.x, ven.y - sun.y);
      var ca = (evd * evd + svd * svd - SUNR * SUNR) / (2 * evd * svd);
      var a = Math.acos(Math.max(-1, Math.min(1, ca)));             // angle at Venus between Earth and Sun
      var f = ((((venusAngle - sunAngle) / TAU) % 1) + 1) % 1 > 0.5 ? 1 : -1;
      return { sun: sun, epi: epi, ven: ven, evd: evd, a: a, f: f, scale: (DEF - EPI) / evd };
    }
    function upd() {
      var g = geometry(), frac = (1 + Math.cos(g.a)) / 2;
      outPhase((frac * 100).toFixed(0) + "%");
      outName(I18N.t(frac < 0.03 ? "pv.new" : frac < 0.45 ? "pv.crescent" : frac < 0.55 ? "pv.quarter" : frac < 0.97 ? "pv.gibbous" : "pv.full"));
      outSize((g.scale * 100).toFixed(0) + "%");
      var el = Math.atan2(-(g.ven.y - E.y), g.ven.x - E.x) - Math.atan2(-(g.sun.y - E.y), g.sun.x - E.x);
      el = ((el * R2D + 540) % 360) - 180;
      outElong(Math.abs(el).toFixed(1) + "° " + (el > 0 ? "E" : el < 0 ? "W" : ""));
      S.requestDraw();
    }
    S.refreshers.push(function () { syncBtn(); upd(); });

    // the SWF's push button on the canvas works too
    S.canvas.addEventListener("pointerdown", function (ev) {
      var r = S.canvas.getBoundingClientRect(), x = (ev.clientX - r.left) * S.W / r.width, y = (ev.clientY - r.top) * S.H / r.height;
      if (x >= BTN.x && x <= BTN.x + BTN.w && y >= BTN.y && y <= BTN.y + BTN.h) toggle();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var r = S.canvas.getBoundingClientRect(), x = (ev.clientX - r.left) * S.W / r.width, y = (ev.clientY - r.top) * S.H / r.height;
      S.canvas.style.cursor = x >= BTN.x && x <= BTN.x + BTN.w && y >= BTN.y && y <= BTN.y + BTN.h ? "pointer" : "default";
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N), g = geometry();
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);

      // the Earth–Sun line, then the deferent, epicycle and Sun's circle (#cccccc hairlines)
      ctx.strokeStyle = "rgba(153,204,255,0.75)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(E.x, E.y); ctx.lineTo(g.sun.x, g.sun.y); ctx.stroke();
      ctx.strokeStyle = "#cccccc";
      ctx.beginPath(); ctx.arc(E.x, E.y, DEF, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(g.epi.x, g.epi.y, EPI, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(E.x, E.y, SUNR, 0, TAU); ctx.stroke();

      halfLit(ctx, g.ven.x, g.ven.y, 10, g.sun, "#ffffff");                 // Venus
      halfLit(ctx, E.x, E.y, 10.5, g.sun, "#66ccff");                       // Earth
      ctx.fillStyle = "#ffff99"; ctx.beginPath(); ctx.arc(g.sun.x, g.sun.y, 14, 0, TAU); ctx.fill();

      if (labels) {
        label(ctx, t("lb.earth"), E.x, E.y + 24);
        label(ctx, t("lb.sun"), g.sun.x, g.sun.y - 24);
        label(ctx, t("lb.venus"), g.ven.x, g.ven.y - 20);
        label(ctx, t("lb.epicycle"), g.epi.x, g.epi.y + EPI + 14);
        label(ctx, t("lb.deferent"), E.x, E.y - DEF - 10);
      }

      // caption + the telescope view
      ctx.fillStyle = "#ffffff"; ctx.font = "13px Verdana, system-ui, sans-serif";
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(t("pv.caption1"), 636, 24);
      ctx.fillText(t("pv.caption2"), 636, 42);
      drawPhase(ctx, g);
      drawButton(ctx, t(loop.playing ? "pv.stop" : "pv.start"));
    });

    // a disc lit on the half that faces the Sun (the SWF rotates a two-colour disc)
    function halfLit(ctx, x, y, r, sun, litCol) {
      var ang = Math.atan2(sun.y - y, sun.x - x);
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      ctx.fillStyle = "#666666"; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI / 2, Math.PI * 1.5); ctx.fill();
      ctx.fillStyle = litCol; ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2); ctx.fill();
      ctx.restore();
    }

    // phaseMC: a radius-100 disc, dark crescent on side f bounded by an ellipse of x-radius r·cos(a),
    // scaled to (deferent − epicycle)/distance
    function drawPhase(ctx, g) {
      var r = 100, s = r * Math.cos(g.a), f = g.f;
      ctx.save();
      ctx.translate(PHASE.x, PHASE.y); ctx.scale(g.scale, g.scale);
      ctx.fillStyle = "#404040";
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.ellipse(0, 0, r, r, 0, -Math.PI / 2, Math.PI / 2, f < 0);       // semicircle on side f
      ctx.ellipse(0, 0, Math.abs(s), r, 0, Math.PI / 2, -Math.PI / 2, f * s > 0);   // terminator, bottom → top
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.ellipse(0, 0, r, r, 0, -Math.PI / 2, Math.PI / 2, f > 0);       // semicircle on the other side
      ctx.ellipse(0, 0, Math.abs(s), r, 0, Math.PI / 2, -Math.PI / 2, f * s > 0);   // terminator, bottom → top
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function drawButton(ctx, text) {
      ctx.fillStyle = "#505050"; ctx.fillRect(BTN.x, BTN.y, BTN.w, BTN.h);
      ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1.5; ctx.strokeRect(BTN.x + 1, BTN.y + 1, BTN.w - 2, BTN.h - 2);
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, BTN.x + BTN.w / 2, BTN.y + BTN.h / 2 + 1);
    }
    function label(ctx, s, x, y) {
      ctx.font = "12px Verdana, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#bfc8d8"; ctx.fillText(s, x, y);
    }

    syncBtn();
    upd();
  }
});
