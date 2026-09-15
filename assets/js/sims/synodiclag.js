/* Synodic Lag ------------------------------------------------------------------
   Faithful rebuild of the ClassAction "synodiclag.swf" (root timeline script,
   decompiled). Earth circles the Sun while spinning; a cross fixed to Earth has a
   long arm that points at the Sun at noon. Run "one sidereal day" and Earth turns
   exactly 360° — the cross comes back to the same orientation in space — but
   Earth has also moved along its orbit, so the Sun is no longer on the long arm:
   the "angle to noon" readout shows how far short of noon it is. "One solar day"
   runs on until the Sun is back on the arm, a little more than 360° of spin.

   As in the SWF the day can be exaggerated (24, 240 or 1200 hours) so the lag is
   easy to see, the pale "shadow" Earth marks where each run started, and the
   buttons lock while a run is in progress.                                      */
Sim.create({
  id: "synodiclag",
  width: 540, height: 540,
  strings: {
    en: {
      "sl.run": "Run", "sl.sidereal": "one sidereal day", "sl.solar": "one solar day", "sl.noon": "realign to noon",
      "sl.len": "length of day", "sl.h24": "24 hours", "sl.h240": "240 hours", "sl.h1200": "1200 hours",
      "sl.anim": "animation", "sl.fast": "fast", "sl.slow": "slow", "sl.shadow": "shadow",
      "sl.angle": "angle to noon",
      "sl.rAngle": "angle to noon", "sl.rSpin": "Earth spun", "sl.rOrbit": "orbit moved", "sl.rTime": "time elapsed",
      "sl.h": " h"
    },
    id: {
      "sl.run": "Jalankan", "sl.sidereal": "satu hari sideris", "sl.solar": "satu hari surya", "sl.noon": "sejajarkan ke tengah hari",
      "sl.len": "panjang hari", "sl.h24": "24 jam", "sl.h240": "240 jam", "sl.h1200": "1200 jam",
      "sl.anim": "animasi", "sl.fast": "cepat", "sl.slow": "lambat", "sl.shadow": "bayangan",
      "sl.angle": "sudut ke tengah hari",
      "sl.rAngle": "sudut ke tengah hari", "sl.rSpin": "putaran Bumi", "sl.rOrbit": "gerak orbit", "sl.rTime": "waktu berlalu",
      "sl.h": " jam"
    }
  },
  about: {
    en: "<p>A <strong>sidereal day</strong> is the time Earth takes to spin once relative to the distant stars — exactly 360°. A <strong>solar day</strong> is the time from one noon to the next, when the Sun is back on your meridian. They differ because Earth doesn't spin in place: in one day it also travels about 1° along its orbit, so the direction to the Sun swings round by that much and Earth has to turn a little further to catch up.</p>" +
        "<p>For the real Earth that extra turn takes about 4 minutes, which is why the solar day (24 h) is longer than the sidereal day (23 h 56 m) and why the stars rise about 4 minutes earlier each night. Choose a 240- or 1200-hour day to exaggerate the effect: the orbit then moves far enough during one spin that the lag is obvious.</p>" +
        "<p>Over a full year the lags add up to exactly one whole turn: Earth spins 366¼ times relative to the stars but sees only 365¼ sunrises.</p>",
    id: "<p><strong>Hari sideris</strong> adalah waktu yang dibutuhkan Bumi untuk berputar sekali terhadap bintang-bintang jauh — tepat 360°. <strong>Hari surya</strong> adalah waktu dari satu tengah hari ke tengah hari berikutnya, saat Matahari kembali di meridian Anda. Keduanya berbeda karena Bumi tidak berputar di tempat: dalam satu hari ia juga menempuh sekitar 1° di orbitnya, sehingga arah ke Matahari bergeser sebanyak itu dan Bumi harus berputar sedikit lebih jauh untuk mengejarnya.</p>" +
        "<p>Untuk Bumi sebenarnya, putaran tambahan itu memakan sekitar 4 menit, itulah sebabnya hari surya (24 jam) lebih panjang dari hari sideris (23 j 56 m) dan bintang terbit sekitar 4 menit lebih awal setiap malam. Pilih hari 240 atau 1200 jam untuk membesar-besarkan efeknya: orbit bergerak cukup jauh selama satu putaran sehingga ketertinggalannya jelas terlihat.</p>" +
        "<p>Selama setahun penuh, ketertinggalan itu berjumlah tepat satu putaran utuh: Bumi berputar 366¼ kali terhadap bintang tetapi hanya mengalami 365¼ kali matahari terbit.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, TAU = Math.PI * 2;
    var K = S.W / 300;                               // SWF stage px → canvas px
    /* ---- the SWF's constants ---- */
    var X0 = 150, Y0 = 150, R0 = 125, YEAR = 8766.15; // orbit centre/radius; hours per year
    var C = { paper: "#ffffff", orbit: "#d4d4d4", sun: "#f8eb56", earth: "#0066ff", arm: "#7f7f7f", ink: "#000000" };

    /* ---- state (init(): everything at 0, 240-hour day, fast, shadow on) ---- */
    var theta = 0, phi = 0, theta0 = 0, phi0 = 0;     // orbit angle, spin angle (degrees)
    var day = 240, delay = 1, showShadow = true;
    var mode = 0, time = 0;                           // 1 = sidereal run, 2 = solar run
    var run = { time: 0, day: day };                  // the latest run, for the readouts
    var shadow = { theta: 0, phi: 0 };

    /* ================================ controls ================================ */
    S.group("sl.run");
    var bSid = S.button({ labelKey: "sl.sidereal", primary: true, on: function () { start(1); } });
    var bSol = S.button({ labelKey: "sl.solar", primary: true, on: function () { start(2); } });
    var bNoon = S.button({ labelKey: "sl.noon", on: function () { toggleNoon(); } });
    S.select({
      labelKey: "sl.len", value: "240",
      options: [{ v: "24", labelKey: "sl.h24" }, { v: "240", labelKey: "sl.h240" }, { v: "1200", labelKey: "sl.h1200" }],
      on: function (v) { day = +v; upd(); }
    });
    S.select({
      labelKey: "sl.anim", value: "1",
      options: [{ v: "1", labelKey: "sl.fast" }, { v: "10", labelKey: "sl.slow" }],
      on: function (v) { delay = +v; }
    });
    S.toggle({ labelKey: "sl.shadow", value: showShadow, on: function (b) { showShadow = b; } });
    var daySel = S.canvas.parentNode.parentNode.querySelectorAll(".sim-controls select")[0];

    var outAngle = S.readout({ labelKey: "sl.rAngle" });
    var outSpin = S.readout({ labelKey: "sl.rSpin" });
    var outOrbit = S.readout({ labelKey: "sl.rOrbit" });
    var outTime = S.readout({ labelKey: "sl.rTime" });

    var loop = S.loop(function (dt) {
      time += dt / 50 / delay;                       // one year of animation = 50 s × delay
      update();
    });

    // update(time): orbit at 360°/yr, spin at 360·year/day °/yr, stopping exactly on target
    function update() {
      var r1 = 360 * YEAR / day, done = false;
      if (mode === 1 && time > 360 / r1) { time = 360 / r1; done = true; }
      if (mode === 2 && time > 360 / (r1 - 360)) { time = 360 / (r1 - 360); done = true; }
      theta = 360 * time + theta0;
      phi = r1 * time + phi0;
      run.time = time;
      if (done) stop();
      upd();
    }
    function start(m) {
      if (loop.playing) return;
      shadow = { theta: theta, phi: phi };
      time = 0; mode = m; run = { time: 0, day: day };
      setLocked(true);
      loop.play();
    }
    function stop() {
      loop.pause();
      theta0 = theta; phi0 = phi; mode = 0;
      setLocked(false);
    }
    function setLocked(b) {
      [bSid, bSol, bNoon, daySel].forEach(function (el) { el.disabled = b; el.style.opacity = b ? 0.45 : ""; });
    }
    // toggleNoon(): put the long arm back on the Sun without moving along the orbit
    function toggleNoon() {
      phi0 = theta0 + Math.floor(phi0 / 360) * 360;
      theta = theta0; phi = phi0; time = 0; run = { time: 0, day: day };
      upd();
    }
    function angleToNoon() {
      var a = (phi % 360) - (theta % 360);
      if (a < 0) a += 360;
      if (a >= 359.995) a = 0;
      return a;
    }

    function upd() {
      outAngle(angleToNoon().toFixed(2) + "°");
      outSpin((360 * YEAR / run.day * run.time).toFixed(2) + "°");
      outOrbit((360 * run.time).toFixed(2) + "°");
      outTime((run.time * YEAR).toFixed(1) + I18N.t("sl.h"));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = C.paper; roundRect(ctx, 0, 0, S.W, S.H, 10); ctx.fill();
      ctx.save();
      ctx.scale(K, K);

      ctx.strokeStyle = C.orbit; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(X0, Y0, R0, 0, TAU); ctx.stroke();

      // the line from the Sun to Earth
      var ex = X0 + R0 * Math.cos(theta * D2R), ey = Y0 - R0 * Math.sin(theta * D2R);
      ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(ex, ey); ctx.stroke();

      ctx.fillStyle = C.sun;
      ctx.beginPath(); ctx.arc(X0, Y0, 14.75, 0, TAU); ctx.fill();

      if (showShadow && (shadow.theta !== theta || shadow.phi !== phi)) {
        ctx.globalAlpha = 0.25;
        drawEarth(ctx, shadow.theta, shadow.phi);
        ctx.globalAlpha = 1;
      }
      drawEarth(ctx, theta, phi);

      ctx.fillStyle = C.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "12px Verdana, system-ui, sans-serif";
      ctx.fillText(t("sl.angle"), X0, 181);
      ctx.fillText(angleToNoon().toFixed(2) + "°", X0, 201);
      ctx.restore();
    });

    // Earth + the cross fixed to it: long arm (25) toward the Sun at noon, short arms 15
    function drawEarth(ctx, th, ph) {
      var ex = X0 + R0 * Math.cos(th * D2R), ey = Y0 - R0 * Math.sin(th * D2R);
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(-ph * D2R);                          // earth._rotation = −phi (Flash is clockwise)
      ctx.strokeStyle = C.arm; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-25.5, 0); ctx.lineTo(15.2, 0);
      ctx.moveTo(0, -15.3); ctx.lineTo(0, 15.3);
      ctx.stroke();
      ctx.fillStyle = C.earth;
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fill();
      ctx.restore();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    upd();
  }
});
