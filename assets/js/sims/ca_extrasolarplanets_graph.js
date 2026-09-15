/* Radial Velocity Graph --------------------------------------------------------
   Faithful rebuild of the ClassAction "ca_extrasolarplanets_graph.swf" (its
   onClipEvent handlers and the Sinusoid Component II, decompiled). A planet and
   its star orbit their common centre of mass (the green cross), always on
   opposite sides; both orbit clips turn 0.5° per frame at 30 fps.

   The observer is off to the left. As the star swings away from us and back, a
   red dot rides the radial-velocity curve at x = (star's orbital angle) on a sine
   of amplitude 120 and wavelength 360 — positive while the star recedes, negative
   while it approaches, zero when it moves across our line of sight.            */
Sim.create({
  id: "ca_extrasolarplanets_graph",
  width: 780, height: 420,
  strings: {
    en: {
      "rg.anim": "Animation", "rg.speed": "speed",
      "rg.vel": "Radial Velocity (m/s)", "rg.time": "Time (yrs)", "rg.obs": "to observer",
      "rg.rStar": "the star is", "rg.rAngle": "orbital phase",
      "rg.away": "moving away (redshift)", "rg.toward": "approaching (blueshift)", "rg.across": "moving across the line of sight"
    },
    id: {
      "rg.anim": "Animasi", "rg.speed": "kecepatan",
      "rg.vel": "Kecepatan Radial (m/s)", "rg.time": "Waktu (tahun)", "rg.obs": "ke pengamat",
      "rg.rStar": "bintang sedang", "rg.rAngle": "fase orbit",
      "rg.away": "menjauh (pergeseran merah)", "rg.toward": "mendekat (pergeseran biru)", "rg.across": "bergerak melintang garis pandang"
    }
  },
  about: {
    en: "<p>A planet doesn't simply circle its star: both orbit their shared <strong>centre of mass</strong>. The star is far heavier, so its orbit is tiny, but it is there — and it makes the star move back and forth along our line of sight once every orbit of the planet.</p>" +
        "<p>That motion shows up in the star's spectrum as a <strong>Doppler shift</strong>: lines move toward the red while the star recedes and toward the blue while it approaches. Plotting the measured <strong>radial velocity</strong> against time traces out a curve — a sine wave for a circular orbit. Its period is the planet's orbital period, and its height (the amplitude) grows with the planet's mass.</p>" +
        "<p>Watch the timing: the velocity is greatest when the star is moving straight away from or toward the observer, and it passes through zero when the star is nearest or farthest from us and moving sideways. More than a thousand exoplanets have been found with exactly this technique.</p>",
    id: "<p>Planet tidak sekadar mengelilingi bintangnya: keduanya mengorbit <strong>pusat massa</strong> bersama. Bintang jauh lebih berat, sehingga orbitnya sangat kecil, tetapi tetap ada — dan membuat bintang bergerak maju-mundur sepanjang garis pandang kita sekali setiap planet mengorbit.</p>" +
        "<p>Gerak itu tampak di spektrum bintang sebagai <strong>pergeseran Doppler</strong>: garis-garis bergeser ke merah saat bintang menjauh dan ke biru saat mendekat. Memplot <strong>kecepatan radial</strong> terukur terhadap waktu menghasilkan kurva — gelombang sinus untuk orbit lingkaran. Periodenya sama dengan periode orbit planet, dan tingginya (amplitudo) bertambah dengan massa planet.</p>" +
        "<p>Perhatikan waktunya: kecepatan terbesar saat bintang bergerak lurus menjauhi atau mendekati pengamat, dan melewati nol saat bintang paling dekat atau paling jauh dari kita sambil bergerak menyamping. Lebih dari seribu planet luar surya ditemukan dengan teknik persis seperti ini.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, TAU = Math.PI * 2;
    var SYS = { x: 587.55, y: 209.25 }, PLOT = { x: 60, y: 210, w: 340, h: 300 };
    var AMP = 120, WAVE = 360;

    /* ---- state: both orbit clips start at −90°; the sparkles at 90° / −70° ---- */
    var orbitRot = -90, spark0 = 90, spark1 = -70, speed = 1;

    S.group("rg.anim");
    var loop = S.loop(function (dt) {
      var frames = dt * 30 * speed;                   // onClipEvent(enterFrame) at 30 fps
      orbitRot -= 0.5 * frames;
      spark0 += frames; spark1 += frames;
      upd();
    });
    var pp = S.playPause(loop);
    S.slider({
      labelKey: "rg.speed", min: 0.25, max: 4, value: speed, step: 0.25,
      format: function (v) { return v + "×"; },
      on: function (v) { speed = v; }
    });
    var outStar = S.readout({ labelKey: "rg.rStar" });
    var outAngle = S.readout({ labelKey: "rg.rAngle" });

    // componentClip's enterFrame: the dot sits at x = −starRotation − 90, wrapped to 0–360
    function dotX() { return (((-orbitRot - 90) % 360) + 360) % 360; }
    function upd() {
      var x = dotX(), v = Math.sin(TAU * x / WAVE);
      outStar(I18N.t(Math.abs(v) < 0.05 ? "rg.across" : v > 0 ? "rg.away" : "rg.toward"));
      outAngle(x.toFixed(0) + "°");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      drawGraph(ctx);
      drawArrow(ctx, t);
      drawSystem(ctx);

      ctx.fillStyle = "#ffffff"; ctx.font = "bold 12px Verdana, system-ui, sans-serif";
      ctx.textBaseline = "top"; ctx.textAlign = "left";
      ctx.fillText(t("rg.time"), 168.45 + 22.7, 313.3 + 1);
      ctx.save(); ctx.translate(38.05, 267.1); ctx.rotate(-Math.PI / 2);
      ctx.fillText(t("rg.vel"), -10.65 + 2, 1);
      ctx.restore();
    });

    function drawGraph(ctx) {
      // the sine, masked to the plot, then the axes (#cccccc) on top as in the component
      ctx.save();
      ctx.beginPath(); ctx.rect(PLOT.x, PLOT.y - PLOT.h / 2, PLOT.w, PLOT.h); ctx.clip();
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var x = 0; x <= PLOT.w; x += 2) {
        var y = PLOT.y - AMP * Math.sin(TAU * x / WAVE);
        x ? ctx.lineTo(PLOT.x + x, y) : ctx.moveTo(PLOT.x + x, y);
      }
      ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PLOT.x + 0.5, PLOT.y - PLOT.h / 2); ctx.lineTo(PLOT.x + 0.5, PLOT.y + PLOT.h / 2);
      ctx.moveTo(PLOT.x, PLOT.y + 0.5); ctx.lineTo(PLOT.x + PLOT.w, PLOT.y + 0.5);
      ctx.stroke();
      // the red dot (dotRadius 10), at the star's current phase
      var dx = dotX();
      ctx.fillStyle = "#ff0000";
      ctx.beginPath(); ctx.arc(PLOT.x + dx, PLOT.y - AMP * Math.sin(TAU * dx / WAVE), 10, 0, TAU); ctx.fill();
    }

    function drawArrow(ctx, t) {
      var X = 306.55, Y = 170;
      ctx.fillStyle = "#00ff00";
      ctx.beginPath();
      ctx.moveTo(X - 15.6, Y);
      ctx.lineTo(X + 15.6, Y - 31.2); ctx.lineTo(X + 15.6, Y - 18);
      ctx.lineTo(X + 84.8, Y - 18); ctx.lineTo(X + 84.8, Y + 18);
      ctx.lineTo(X + 15.6, Y + 18); ctx.lineTo(X + 15.6, Y + 31.2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#000000"; ctx.font = "bold 12px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("rg.obs"), X + 44, Y + 0.5);
    }

    function drawSystem(ctx) {
      ctx.save();
      ctx.translate(SYS.x, SYS.y);
      // the green centre-of-mass cross
      ctx.strokeStyle = "#00ff00"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(9, 0); ctx.moveTo(0, -9); ctx.lineTo(0, 9); ctx.stroke();

      ctx.save();                                     // planetOrbit
      ctx.rotate(orbitRot * D2R);
      ctx.strokeStyle = "#444488"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 166.5, 0, TAU); ctx.stroke();
      drawPlanet(ctx, 0, 165, 12.4);
      ctx.restore();

      ctx.save();                                     // starOrbit (drawn above the planet orbit)
      ctx.rotate(orbitRot * D2R);
      ctx.strokeStyle = "#666633"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 21.5, 0, TAU); ctx.stroke();
      drawStar(ctx, 0, -20);
      ctx.restore();
      ctx.restore();
    }

    // the planet: orange, lit on the side that faces the star (its gradient turns with the orbit clip)
    function drawPlanet(ctx, x, y, r) {
      ctx.save();
      ctx.translate(x, y);
      var g = ctx.createRadialGradient(0, -r * 1.05, r * 0.05, 0, -r * 0.2, r * 2.1);
      g.addColorStop(0, "#fff1dc"); g.addColorStop(0.35, "#e97a2c"); g.addColorStop(0.75, "#9a4418"); g.addColorStop(1, "#4f2208");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
      ctx.restore();
    }

    // the star (×0.25): soft yellow glow, two twinkling sparkles, orange core
    function drawStar(ctx, x, y) {
      ctx.save();
      ctx.translate(x, y);
      var glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 19);
      glow.addColorStop(0, "rgba(255,255,128,1)"); glow.addColorStop(0.44, "rgba(255,255,128,1)");
      glow.addColorStop(0.49, "rgba(255,255,139,0.5)"); glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, 19, 0, TAU); ctx.fill();
      sparkle(ctx, spark0 * D2R, Math.pow(Math.cos(spark0 * D2R), 20));
      sparkle(ctx, -spark1 * D2R, Math.pow(Math.sin(spark1 * D2R), 20));
      var core = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
      core.addColorStop(0, "#fecb00"); core.addColorStop(0.29, "#fecb00"); core.addColorStop(0.88, "#fea000"); core.addColorStop(1, "#fe9100");
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fill();
      ctx.restore();
    }
    function sparkle(ctx, rot, scale) {
      if (scale < 0.02) return;
      ctx.save();
      ctx.rotate(rot); ctx.scale(scale, scale);
      var R = 23, g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.15, "rgba(255,255,255,0.75)");
      g.addColorStop(0.25, "rgba(255,255,255,0.5)"); g.addColorStop(0.7, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4, rr = i % 2 ? R * 0.18 : R;
        ctx.lineTo(rr * Math.cos(a), rr * Math.sin(a));
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    upd();
    loop.play(); pp.sync();
  }
});
