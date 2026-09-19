/* Extrasolar Planet Radial Velocity Demonstrator -------------------------------
   Faithful rebuild of the ClassAction "radialvelocitydemo.swf" (root script,
   decompiled; spectrum and line shapes read from the SWF's own fill styles). A
   telescope on the left watches a star and its planet orbit their common centre
   of mass. The bodies turn 0.04° per millisecond; the star's absorption lines in
   the spectrometer slide by sin(orbit angle) × 20 px — redward while the star
   moves away from the telescope, blueward while it approaches, and back through
   the rest position as it crosses the line of sight. The shift is, as the SWF
   says, greatly exaggerated.                                                    */
Sim.create({
  id: "radialvelocitydemo",
  width: 600, height: 450,
  strings: {
    en: {
      "rd.anim": "Animation", "rd.start": "start animation", "rd.pause": "pause animation",
      "rd.speed": "speed", "rd.title": "SPECTROMETER", "rd.exag": "doppler shift greatly exaggerated",
      "rd.rStar": "the star is", "rd.rShift": "line shift",
      "rd.away": "moving away (redshift)", "rd.toward": "approaching (blueshift)", "rd.across": "moving across our line of sight",
      "rd.red": "toward red", "rd.blue": "toward blue", "rd.none": "none"
    },
    id: {
      "rd.anim": "Animasi", "rd.start": "mulai animasi", "rd.pause": "jeda animasi",
      "rd.speed": "kecepatan", "rd.title": "SPEKTROMETER", "rd.exag": "pergeseran doppler sangat dilebih-lebihkan",
      "rd.rStar": "bintang sedang", "rd.rShift": "pergeseran garis",
      "rd.away": "menjauh (pergeseran merah)", "rd.toward": "mendekat (pergeseran biru)", "rd.across": "melintang garis pandang",
      "rd.red": "ke arah merah", "rd.blue": "ke arah biru", "rd.none": "tidak ada"
    }
  },
  about: {
    en: "<p>A planet is far too faint to see beside its star, but it still gives itself away. Star and planet both circle their shared centre of mass, so the star makes a small orbit of its own and, seen from the side, moves alternately toward and away from us.</p>" +
        "<p>Light from a receding source is stretched to longer wavelengths (<strong>redshift</strong>); from an approaching one it is squeezed shorter (<strong>blueshift</strong>). The star's dark absorption lines — fingerprints of the elements in its atmosphere — therefore rock back and forth in its spectrum, once per orbit of the planet. The size of the swing tells us how fast the star moves, and from that, how massive the planet is.</p>" +
        "<p>The real effect is tiny: Jupiter makes the Sun wobble at about 12 m/s, shifting its lines by one part in 25 million. Astronomers measure it with extremely stable spectrographs, and this <strong>radial velocity method</strong> found many of the first exoplanets.</p>",
    id: "<p>Planet terlalu redup untuk terlihat di samping bintangnya, tetapi tetap membuka rahasianya. Bintang dan planet sama-sama mengelilingi pusat massa bersama, sehingga bintang membuat orbit kecilnya sendiri dan, dilihat dari samping, bergantian bergerak mendekat dan menjauhi kita.</p>" +
        "<p>Cahaya dari sumber yang menjauh teregang ke panjang gelombang lebih panjang (<strong>pergeseran merah</strong>); dari sumber yang mendekat termampatkan lebih pendek (<strong>pergeseran biru</strong>). Garis-garis serapan gelap bintang — sidik jari unsur-unsur di atmosfernya — karenanya bergoyang bolak-balik di spektrumnya, sekali setiap planet mengorbit. Besar ayunannya menunjukkan kecepatan bintang, dan dari situ, massa planet.</p>" +
        "<p>Efek sebenarnya sangat kecil: Jupiter membuat Matahari bergoyang sekitar 12 m/s, menggeser garisnya satu per 25 juta. Astronom mengukurnya dengan spektrograf yang sangat stabil, dan <strong>metode kecepatan radial</strong> inilah yang menemukan banyak planet luar surya pertama.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, D2R = Math.PI / 180;
    var CM = { x: 462, y: 163 }, STAR_R = 18.25, PLANET_R = 106;
    var SPEC = { x: 139.35, y: 350.8, w: 542.1 * 0.6, h: 81.7 * 0.6 };
    var LINES_X = 139.35 + 162.45, LINES_RANGE = 20;
    // shape 193: soft dark lines — centre x and full width (1638.4 × gradient scale)
    var LINES = [[-95, 2.95], [-75, 2.95], [-46.25, 3.93], [5, 2.95], [25.95, 5.08], [35, 2.95], [55, 2.95], [75, 2.95], [85, 2.95], [95, 2.95]];
    var RAINBOW = [[1, "#000000"], [32, "#8700c7"], [66, "#0000ff"], [95, "#00fff0"], [116, "#00fc00"], [152, "#f1ff43"], [195, "#ff0000"], [255, "#000000"]];
    var BTN = { x: 237.5, y: 10, w: 125, h: 26.4 };

    var rotation = 0, rate = 0.04;                   // degrees per ms (animRate)

    S.group("rd.anim");
    var loop = S.loop(function (dt) {
      rotation = (rotation + rate * dt * 1000) % 360;
      upd();
    });
    var bAnim = S.button({ labelKey: "rd.start", primary: true, on: toggle });
    bAnim.removeAttribute("data-i18n");
    S.slider({
      labelKey: "rd.speed", min: 0.01, max: 0.12, value: rate, step: 0.005,
      format: function (v) { return (360 / (v * 1000)).toFixed(1) + " s / orbit"; },
      on: function (v) { rate = v; }
    });
    var outStar = S.readout({ labelKey: "rd.rStar" });
    var outShift = S.readout({ labelKey: "rd.rShift" });

    function toggle() { if (loop.playing) loop.pause(); else loop.play(); syncBtn(); S.requestDraw(); }
    function syncBtn() { bAnim.textContent = I18N.t(loop.playing ? "rd.pause" : "rd.start"); }
    function shift() { return Math.sin(rotation * D2R) * LINES_RANGE; }
    function upd() {
      var s = shift();
      outStar(I18N.t(Math.abs(s) < 1 ? "rd.across" : s > 0 ? "rd.away" : "rd.toward"));
      outShift(Math.abs(s) < 0.05 ? I18N.t("rd.none") : Math.abs(s).toFixed(1) + " px " + I18N.t(s > 0 ? "rd.red" : "rd.blue"));
      S.requestDraw();
    }
    S.refreshers.push(function () { syncBtn(); upd(); });

    S.canvas.addEventListener("pointerup", function (ev) {
      var r = S.canvas.getBoundingClientRect(), x = (ev.clientX - r.left) * S.W / r.width, y = (ev.clientY - r.top) * S.H / r.height;
      if (x >= BTN.x && x <= BTN.x + BTN.w && y >= BTN.y && y <= BTN.y + BTN.h) toggle();
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      drawButton(ctx, t(loop.playing ? "rd.pause" : "rd.start"));
      drawTelescope(ctx);
      drawSystem(ctx);
      drawSpectrometer(ctx, t);
    });

    function drawButton(ctx, label) {
      var g = ctx.createLinearGradient(0, BTN.y, 0, BTN.y + BTN.h);
      g.addColorStop(0, "#f4f4f4"); g.addColorStop(1, "#d6d6d6");
      ctx.fillStyle = g; ctx.fillRect(BTN.x, BTN.y, BTN.w, BTN.h);
      ctx.strokeStyle = "#8a8a8a"; ctx.lineWidth = 1; ctx.strokeRect(BTN.x + 0.5, BTN.y + 0.5, BTN.w - 1, BTN.h - 1);
      ctx.fillStyle = "#000000"; ctx.font = "13px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, BTN.x + BTN.w / 2, BTN.y + BTN.h / 2 + 1);
    }

    function drawSystem(ctx) {
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(CM.x, CM.y, PLANET_R, 0, TAU); ctx.stroke();
      ctx.strokeStyle = "#8c8c8c";
      ctx.beginPath(); ctx.arc(CM.x, CM.y, STAR_R, 0, TAU); ctx.stroke();
      ctx.save();
      ctx.translate(CM.x, CM.y); ctx.rotate(rotation * D2R);   // bodiesMC._rotation (clockwise)
      var sx = -STAR_R;
      var glow = ctx.createRadialGradient(sx, 0, 5.5, sx, 0, 18.5);
      glow.addColorStop(0, "rgba(255,255,204,0.33)"); glow.addColorStop(1, "rgba(255,255,204,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sx, 0, 18.5, 0, TAU); ctx.fill();
      ctx.fillStyle = "#ffffcc"; ctx.beginPath(); ctx.arc(sx, 0, 5.75, 0, TAU); ctx.fill();
      ctx.fillStyle = "#cccccc"; ctx.beginPath(); ctx.arc(PLANET_R, 0, 4.5, 0, TAU); ctx.fill();
      ctx.restore();
    }

    // the telescope on its stand, looking right at the star system
    function drawTelescope(ctx) {
      var y = 163;
      // stand
      ctx.strokeStyle = "#2c2c2c"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(72, y + 4); ctx.lineTo(72, 211); ctx.stroke();
      ctx.fillStyle = "#8a6a4f";
      ctx.beginPath(); ctx.moveTo(62, 211); ctx.lineTo(82, 211); ctx.lineTo(89, 227); ctx.lineTo(55, 227); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#1d1d1d"; ctx.beginPath(); ctx.arc(72, 211, 2.3, 0, TAU); ctx.fill();
      // tube
      var tg = ctx.createLinearGradient(0, y - 14, 0, y + 14);
      tg.addColorStop(0, "#7a7d7f"); tg.addColorStop(0.35, "#f3f4f5"); tg.addColorStop(0.7, "#a6aaac"); tg.addColorStop(1, "#5d6062");
      ctx.fillStyle = tg; ctx.fillRect(30, y - 14, 112, 28);
      ctx.fillStyle = "#2a2c2e"; roundRect(ctx, 142, y - 17, 8, 34, 3); ctx.fill();
      var bg = ctx.createLinearGradient(0, y - 16, 0, y + 16);
      bg.addColorStop(0, "#5e4027"); bg.addColorStop(0.45, "#a47552"); bg.addColorStop(1, "#4b301c");
      ctx.fillStyle = bg; roundRect(ctx, 63, y - 16, 19, 32, 3); ctx.fill();
      ctx.fillStyle = "#1d1d1d"; ctx.beginPath(); ctx.arc(72.5, y + 1, 2.3, 0, TAU); ctx.fill();
      // finder
      ctx.fillStyle = "#6c6f71"; ctx.fillRect(44, y - 26, 3, 12);
      ctx.fillStyle = "#bfc2c4"; ctx.fillRect(41.5, y - 31, 8, 6);
    }

    function drawSpectrometer(ctx, t) {
      var g = ctx.createLinearGradient(0, 294, 0, 438);
      g.addColorStop(0, "#a3a5a6"); g.addColorStop(1, "#8b8d8e");
      ctx.fillStyle = g; roundRect(ctx, 104.45, 294, 391, 143.7, 9); ctx.fill();
      ctx.strokeStyle = "#eeeeee"; ctx.lineWidth = 1.2; ctx.stroke();
      [[123, 312], [478, 312], [123, 420], [478, 420]].forEach(function (c) { screw(ctx, c[0], c[1], 10); });
      var rg = ctx.createLinearGradient(0, 302, 0, 336);
      rg.addColorStop(0, "#c9564f"); rg.addColorStop(1, "#8f2a25");
      ctx.fillStyle = rg; roundRect(ctx, 185.3, 302.3, 224.2, 33, 5); ctx.fill();
      ctx.strokeStyle = "#5f1612"; ctx.lineWidth = 1; ctx.stroke();
      [[191, 308], [403.5, 308], [191, 329.5], [403.5, 329.5]].forEach(function (c) { screw(ctx, c[0], c[1], 2.3); });
      ctx.fillStyle = "#f3c7c3"; ctx.font = "21px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("rd.title"), 297.4, 319.5);
      // spectrum window + rainbow + the shifting absorption lines (masked to the rainbow)
      ctx.fillStyle = "#000000"; ctx.fillRect(134, 346.8, 336, 58.15);
      var sg = ctx.createLinearGradient(SPEC.x, 0, SPEC.x + SPEC.w, 0);
      RAINBOW.forEach(function (s) { sg.addColorStop(s[0] / 255, s[1]); });
      ctx.fillStyle = sg; ctx.fillRect(SPEC.x, SPEC.y, SPEC.w, SPEC.h);
      ctx.save();
      ctx.beginPath(); ctx.rect(SPEC.x - 1.15, SPEC.y, 327, 48); ctx.clip();
      var off = shift();
      LINES.forEach(function (l) {
        var cx = LINES_X + l[0] + off, hw = l[1] / 2;
        var lg = ctx.createLinearGradient(cx - hw, 0, cx + hw, 0);
        lg.addColorStop(0, "rgba(0,0,0,0)"); lg.addColorStop(132 / 255, "rgba(0,0,0,1)"); lg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = lg; ctx.fillRect(cx - hw, SPEC.y, l[1], SPEC.h);
      });
      ctx.restore();
      ctx.fillStyle = "#2a2a2a"; ctx.font = "italic 13px Verdana, system-ui, sans-serif";
      ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText(t("rd.exag"), 460, 413.5);
    }
    function screw(ctx, x, y, r) {
      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      g.addColorStop(0, "#5c5f60"); g.addColorStop(1, "#1e2021");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      if (r > 4) {
        ctx.strokeStyle = "#0e0f10"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r * 0.2); ctx.lineTo(x + r * 0.6, y + r * 0.2); ctx.stroke();
      }
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    syncBtn();
    upd();
  }
});
