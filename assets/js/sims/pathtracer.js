/* Epicycles Demo ---------------------------------------------------------------
   Faithful rebuild of the ClassAction "pathtracer.swf" (PathTracingDemo1Class,
   decompiled). A blue and a red object revolve round a yellow one on circular
   orbits (radii 85 and 200, periods in the ratio (200/85)^1.5, Kepler's third
   law), drawn as black circles. Choose which object to keep fixed: the whole
   system is shifted every frame so that object stays at the centre, and the other
   two trace red tracks that fade with age.

   Hold the yellow object still and you have a heliocentric picture; hold the blue
   one still and the same motions become loops on loops — epicycles — the
   geocentric picture. Same predictions, different bookkeeping.

   Note: the SWF's incrementTime() draws the tracks into `lineSegments` fading
   segments, but that count is never set, so the original shows no tracks at all
   even though its caption describes them. We draw them (300 segments).        */
Sim.create({
  id: "pathtracer",
  width: 600, height: 600,
  strings: {
    en: {
      "pt.view": "View", "pt.keep": "keep this object fixed", "pt.yellow": "yellow object", "pt.blue": "blue object",
      "pt.red": "red object", "pt.speed": "animation speed", "pt.tracks": "show the red tracks", "pt.clear": "clear tracks",
      "pt.caption1": "In this animation the blue and red objects revolve around the yellow object in circular orbits, shown in black. The red tracks are the paths that result when the system moves to make the selected object appear stationary.",
      "pt.caption2": "This demonstrates that for simple circular orbits the heliocentric and geocentric models are equivalent, at least for predictive purposes.",
      "pt.rBlue": "blue orbits", "pt.rRed": "red orbits"
    },
    id: {
      "pt.view": "Tampilan", "pt.keep": "tahan objek ini diam", "pt.yellow": "objek kuning", "pt.blue": "objek biru",
      "pt.red": "objek merah", "pt.speed": "kecepatan animasi", "pt.tracks": "tampilkan jejak merah", "pt.clear": "hapus jejak",
      "pt.caption1": "Dalam animasi ini objek biru dan merah beredar mengelilingi objek kuning pada orbit lingkaran, digambar hitam. Jejak merah adalah lintasan yang terjadi saat sistem digeser agar objek terpilih tampak diam.",
      "pt.caption2": "Ini menunjukkan bahwa untuk orbit lingkaran sederhana, model heliosentris dan geosentris setara, setidaknya untuk keperluan ramalan.",
      "pt.rBlue": "orbit biru", "pt.rRed": "orbit merah"
    }
  },
  about: {
    en: "<p>Motion is always measured relative to something. Describe the planets from the Sun and their orbits are simple circles (to a first approximation); describe exactly the same motions from Earth and each planet appears to trace loops — the <strong>epicycles</strong> of ancient astronomy.</p>" +
        "<p>This demo makes the change of viewpoint literal. With the yellow object fixed you see two plain circular orbits. Fix the blue object instead: now the yellow object circles <em>it</em>, and the red object's path becomes a circle carried round on another circle, looping backward each time the blue object overtakes it. That loop is retrograde motion.</p>" +
        "<p>Since both descriptions reproduce the same relative positions, early astronomers could not choose between a Sun-centred and an Earth-centred system from positions alone. What settled it was simplicity, physics — and new observations like the full set of phases of Venus.</p>",
    id: "<p>Gerak selalu diukur relatif terhadap sesuatu. Gambarkan planet dari Matahari dan orbitnya berupa lingkaran sederhana (sebagai pendekatan pertama); gambarkan gerak yang persis sama dari Bumi dan setiap planet tampak menelusuri simpul-simpul — <strong>episiklus</strong> astronomi kuno.</p>" +
        "<p>Demo ini membuat pergantian sudut pandang itu harfiah. Dengan objek kuning ditahan diam Anda melihat dua orbit lingkaran biasa. Tahan objek biru sebagai gantinya: kini objek kuning mengitari <em>objek biru</em>, dan lintasan objek merah menjadi lingkaran yang dibawa berputar pada lingkaran lain, membentuk simpul mundur setiap kali objek biru menyalipnya. Simpul itu adalah gerak retrograd.</p>" +
        "<p>Karena kedua uraian menghasilkan posisi relatif yang sama, astronom awal tidak bisa memilih antara sistem berpusat Matahari dan berpusat Bumi hanya dari posisi. Yang menentukan adalah kesederhanaan, fisika — dan pengamatan baru seperti fase lengkap Venus.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var O = { x: 300, y: 300 };                      // the "test" clip's placement
    var R2 = 85, R3 = 200, P3 = Math.pow(R3 / R2, 1.5);
    var SEGMENTS = 300, MAX_STEP = 0.025, MIN_STEP = 0.003;
    var COL = { yellow: "#ffcc00", blue: "#3300ff", red: "#ff0000" };

    /* ---- state: yellow fixed, speed 0.0005 orbits per ms ---- */
    var center = "yellow", speed = 0.0005, showTracks = true;
    var time = 0, pending = 0, trackB = [], trackC = [];

    S.group("pt.view");
    S.select({
      labelKey: "pt.keep", value: center,
      options: [{ v: "yellow", labelKey: "pt.yellow" }, { v: "blue", labelKey: "pt.blue" }, { v: "red", labelKey: "pt.red" }],
      on: function (v) { center = v; trackB = []; trackC = []; S.requestDraw(); }   // setTime() clears the paths
    });
    var loop = S.loop(function (dt) {
      pending += speed * dt * 1000;                   // incrementTime(speed × elapsed ms)
      if (Math.abs(pending) >= MIN_STEP) { incrementTime(pending); pending = 0; }
      upd();
    });
    var pp = S.playPause(loop);
    S.slider({
      labelKey: "pt.speed", min: 0, max: 0.002, value: speed, step: 0.00005,
      format: function (v) { return (v * 1000).toFixed(2) + " /s"; },
      on: function (v) { speed = v; }
    });
    S.toggle({ labelKey: "pt.tracks", value: showTracks, on: function (b) { showTracks = b; } });
    S.button({ labelKey: "pt.clear", on: function () { trackB = []; trackC = []; S.requestDraw(); } });
    ["pt.caption1", "pt.caption2"].forEach(function (k) {
      var p = document.createElement("p");
      p.className = "sim-note"; p.setAttribute("data-i18n", k);
      S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(p);
    });
    var outBlue = S.readout({ labelKey: "pt.rBlue" });
    var outRed = S.readout({ labelKey: "pt.rRed" });

    // positions of blue (2) and red (3) about yellow, and the offset that holds the chosen object still
    function state(t) {
      var a2 = t * TAU, a3 = t * TAU / P3;
      var x2 = R2 * Math.cos(a2), y2 = -R2 * Math.sin(a2), x3 = R3 * Math.cos(a3), y3 = -R3 * Math.sin(a3);
      var dx = 0, dy = 0;
      if (center === "blue") { dx = -x2; dy = -y2; }
      if (center === "red") { dx = -x3; dy = -y3; }
      // tracks follow the two objects that are NOT held still (B and C in the SWF)
      var B, C;
      if (center === "yellow") { B = { x: x2, y: y2 }; C = { x: x3, y: y3 }; }
      else if (center === "blue") { B = { x: dx, y: dy }; C = { x: x3 + dx, y: y3 + dy }; }
      else { B = { x: x2 + dx, y: y2 + dy }; C = { x: dx, y: dy }; }
      return { x2: x2, y2: y2, x3: x3, y3: y3, dx: dx, dy: dy, B: B, C: C };
    }
    function push(track, p) { track.push(p); if (track.length > SEGMENTS + 1) track.shift(); }
    function incrementTime(arg) {
      var n = Math.ceil(Math.abs(arg / MAX_STEP)), step = arg / n;
      if (!trackB.length) { var s0 = state(time); push(trackB, s0.B); push(trackC, s0.C); }
      for (var i = 1; i <= n; i++) {
        var s = state(time + i * step);
        push(trackB, s.B); push(trackC, s.C);
      }
      time += arg;
    }
    function upd() {
      outBlue(time.toFixed(2));
      outRed((time / P3).toFixed(2));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, s = state(time);
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.save();
      ctx.translate(O.x, O.y);
      if (showTracks) { fade(ctx, trackB); fade(ctx, trackC); }   // pathsMC sits beneath systemMC
      ctx.translate(s.dx, s.dy);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, R3, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, R2, 0, TAU); ctx.stroke();
      ball(ctx, 0, 0, COL.yellow);
      ball(ctx, s.x2, s.y2, COL.blue);
      ball(ctx, s.x3, s.y3, COL.red);
      ctx.restore();
    });
    function fade(ctx, tr) {
      ctx.lineWidth = 1;
      for (var i = 1; i < tr.length; i++) {
        var age = tr.length - 1 - i;
        ctx.strokeStyle = "rgba(255,0,0," + Math.max(0, 1 - age / SEGMENTS).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(tr[i - 1].x, tr[i - 1].y); ctx.lineTo(tr[i].x, tr[i].y); ctx.stroke();
      }
    }
    function ball(ctx, x, y, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill(); }

    upd();
    loop.play(); pp.sync();
  }
});
