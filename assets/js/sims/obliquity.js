/* Obliquity Simulator ----------------------------------------------------------
   Faithful rebuild of the ClassAction "Obliquity Simulator" (obliquity.swf,
   decompiled). Everything is the SWF's own: its Earth (an ocean disc, the land
   gradient under the continents' mask, the rotation axis and the spin arrow,
   all turned together by the obliquity), the fixed night-side shading, the
   dashed perpendicular and plane of the ecliptic, the white arc from the
   perpendicular to the axis with its value label, and the SliderV3 that drives
   it (drag the grabber, or press the bar to step 0.1° at a time) — the art
   comes from _obliquity-art.js, generated from the SWF's shape records.
   update(obliquity), as the SWF has it:
     arc   radius 120, from 90° − obliquity to 90° (lineStyle 3, white)
     earth._rotation = obliquity
     label at 150 px along the arc's bisector                                 */
Sim.create({
  id: "obliquity",
  width: 600, height: 400,
  strings: {
    en: {
      "ob.obl": "obliquity", "ob.reset": "reset",
      "ob.ecl1": "plane of", "ob.ecl2": "ecliptic"
    },
    id: {
      "ob.obl": "oblikuitas", "ob.reset": "atur ulang",
      "ob.ecl1": "bidang", "ob.ecl2": "ekliptika"
    }
  },
  about: {
    en: "<p><strong>Obliquity</strong> is the angle between a planet's rotational axis and the line perpendicular to its orbital plane (the ecliptic). Earth's current obliquity is about 23.5°.</p>" +
        "<p>At 0° the axis is straight up and there are no seasons; at 23.5° we get the familiar seasons; at 90° the poles would alternately point directly at the Sun. Past 90° the planet spins backwards relative to its orbit — Venus, at about 177°, is an example. Drag the slider to explore how different tilts change the geometry.</p>",
    id: "<p><strong>Oblikuitas</strong> adalah sudut antara sumbu rotasi planet dan garis tegak lurus bidang orbit (ekliptika). Oblikuitas Bumi saat ini sekitar 23,5°.</p>" +
        "<p>Pada 0° sumbu tegak lurus dan tidak ada musim; pada 23,5° kita mendapat musim yang kita kenal; pada 90° kutub akan bergantian mengarah langsung ke Matahari. Di atas 90° planet berputar terbalik terhadap orbitnya — Venus, sekitar 177°, contohnya. Geser penggeser untuk menjelajahi bagaimana kemiringan berbeda mengubah geometri.</p>"
  },
  build: function (S) {
    var ART = window.OBLIQUITY_ART, draw = SwfShape.draw;
    var FONT = "bold 12px Verdana, Geneva, sans-serif";
    var ASC = 1.0059, RAD = Math.PI / 180;
    var O = { x: 264.35, y: 181.9 };                // the main clip (sprite 28) on the stage

    /* ---- SliderV3 "obliquity": 0–180, precision 1, at (212.85, 152.8) in the main clip ---- */
    var SL = { x: O.x + 212.85, y: O.y + 152.8, min: 0, max: 180, hw: 100, prec: 1 };
    SL.scale = (SL.max - SL.min) / (2 * SL.hw);
    SL.inc = Math.pow(10, -SL.prec);
    var obliquity = 23.5;
    function grabberX() { return (obliquity - SL.min) / SL.scale - SL.hw; }
    function setValue(v, fromSidebar) {             // SliderV3.setValue, then update(obliquity)
      if (!isFinite(v)) return;
      var k = Math.pow(10, SL.prec);
      v = Math.round(k * v) / k;
      obliquity = Math.min(SL.max, Math.max(SL.min, v));
      if (!fromSidebar) { syncing = true; oblC.set(obliquity); syncing = false; }
      S.requestDraw();
    }
    function valueText(v) { return v.toFixed(SL.prec); }

    /* ---- drawing ---- */
    S.onDraw(function () {
      var ctx = S.ctx, o = obliquity;
      FlashText.begin(ctx);
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.save();
      ctx.translate(O.x, O.y);
      // the main clip's own drawing (under its children): the arc, lineStyle(3, white)
      if (o > 0) {
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); arc(ctx, 120, Math.PI / 2 - o * RAD, Math.PI / 2); ctx.stroke();
      }
      draw(ctx, ART[15]);                          // the dashed lines
      ctx.fillStyle = "#66ccff"; ctx.font = FONT;   // "plane of / ecliptic", centred on the SWF's two lines
      FlashText.fillStatic(ctx, I18N.t("ob.ecl1"), 183 + 44.7 + 27.2, -15.5 + 12, "center");
      FlashText.fillStatic(ctx, I18N.t("ob.ecl2"), 183 + 44.7 + 27.2, -15.5 + 29, "center");
      // the Earth (sprite 23), turned by the obliquity
      ctx.save();
      ctx.rotate(o * RAD);
      draw(ctx, ART[17]);                          // the axis and the back of the arrow
      ctx.save();
      ctx.scale(0.179993, 0.179993);               // sprite 21: ocean, then land under the continents' mask
      draw(ctx, ART[18]);
      ctx.save(); ctx.clip(SwfShape.path(ART[19]), "evenodd"); draw(ctx, ART[20]); ctx.restore();
      ctx.restore();
      draw(ctx, ART[22]);                          // the front of the arrow
      ctx.restore();
      draw(ctx, ART[24]);                          // the night side, not turned
      // degreeLabel: 14 px, centred at radius 150 on the arc's bisector. The SWF's
      // embedded font has no "°", so it shows the number alone — the sign is added after it
      var lx = -150 * Math.cos(Math.PI / 2 + o * RAD / 2), ly = -150 * Math.sin(Math.PI / 2 + o * RAD / 2);
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 14px Verdana, Geneva, sans-serif";
      var num = String(o), w = FlashText.fill(ctx, num, lx, ly - 9.55 + ASC * 14, "center");
      FlashText.fill(ctx, "°", lx + w / 2, ly - 9.55 + ASC * 14, "left");
      slider(ctx);
      ctx.restore();
    });
    // MovieClip.drawArc: quadratic pieces of at most 0.5 rad, y up
    function arc(ctx, r, a0, a1) {
      var TAU = 2 * Math.PI;
      a0 = a0 < 0 ? a0 % TAU + TAU : a0 % TAU;
      a1 = a1 < 0 ? a1 % TAU + TAU : a1 % TAU;
      var range = a1 - a0; if (range < 0) range += TAU;
      var n = Math.ceil(range / 0.5), step = range / n, half = step / 2, cr = r / Math.cos(half);
      var a = a0, c = a0 - half;
      ctx.moveTo(r * Math.cos(a), -r * Math.sin(a));
      for (var i = 0; i < n; i++) {
        a += step; c += step;
        ctx.quadraticCurveTo(cr * Math.cos(c), -cr * Math.sin(c), r * Math.cos(a), -r * Math.sin(a));
      }
    }
    function slider(ctx) {                         // SliderV3: bar, grabber, title, value, min and max
      ctx.save();
      ctx.translate(212.85, 152.8);
      draw(ctx, ART[10]);
      ctx.save(); ctx.translate(grabberX(), -2.2); draw(ctx, ART[8]); ctx.restore();
      ctx.fillStyle = "#ffffff"; ctx.font = FONT;
      FlashText.fill(ctx, I18N.t("ob.obl"), -12 - SL.hw + 2, -35 + 2 + ASC * 12, "left");
      FlashText.fill(ctx, valueText(obliquity), 12 + SL.hw - 2, -35 + 2 + ASC * 12, "right");
      ctx.font = "bold 10px Verdana, Geneva, sans-serif";
      FlashText.fill(ctx, String(SL.min), -SL.hw, 14 + 2 + ASC * 10, "center");
      FlashText.fill(ctx, String(SL.max), SL.hw, 14 + 2 + ASC * 10, "center");
      ctx.restore();
    }

    /* ---- the pointer: SliderV3GrabberClass and SliderV3BarClass ---- */
    var press = null;
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width - SL.x, y: (ev.clientY - r.top) * S.H / r.height - SL.y };
    }
    function hit(p) {                              // slider-local
      var gx = grabberX();
      if (p.x >= gx - 7 && p.x <= gx + 7 && p.y >= -2.2 - 9.3 && p.y <= -2.2 + 13.75) return "grab";
      if (p.x >= -SL.hw && p.x <= SL.hw && p.y >= -2.75 && p.y <= 2.75) return "bar";
      return null;
    }
    function barStep(p) { setValue(obliquity + (p.x < grabberX() ? -SL.inc : SL.inc)); }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      if (!h) return;
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      if (h === "grab") press = { kind: "grab", off: p.x - grabberX() };
      else {
        press = { kind: "bar", p: p, start: performance.now() + 500, last: 0 };
        barStep(p);
        requestAnimationFrame(barRepeat);
      }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) { S.canvas.style.cursor = hit(p) ? "pointer" : "default"; return; }
      if (press.kind === "grab") setValue(SL.min + SL.scale * ((p.x - press.off) + SL.hw));
      else press.p = p;
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { press = null; });
    });
    function barRepeat(now) {                      // onEnterFrame after the 500 ms hold: a step a frame (12 fps)
      if (!press || press.kind !== "bar") return;
      if (now > press.start && now - press.last >= 1000 / 12) { press.last = now; barStep(press.p); }
      requestAnimationFrame(barRepeat);
    }

    /* ---- the sidebar ---- */
    var syncing = false;
    var oblC = S.slider({ labelKey: "ob.obl", min: 0, max: 180, step: 0.1, value: obliquity,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { if (!syncing) setValue(v, true); } });
    S.button({ labelKey: "ob.reset", on: function () { setValue(23.5); } });
    S.requestDraw();
  }
});
