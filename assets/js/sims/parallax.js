/* Stellar Parallax --------------------------------------------------------- */
Sim.create({
  id: "parallax",
  width: 760, height: 480,
  strings: {
    en: {
      "px.sys": "Setup", "px.dist": "Star distance", "px.anim": "Animation",
      "px.spaceView": "Top-down (Earth's orbit)", "px.skyView": "The sky (as we see it)",
      "px.angle": "Parallax angle p", "px.distpc": "Distance", "px.formula": "p = 1 / d"
    },
    id: {
      "px.sys": "Penyiapan", "px.dist": "Jarak bintang", "px.anim": "Animasi",
      "px.spaceView": "Tampak atas (orbit Bumi)", "px.skyView": "Langit (seperti kita lihat)",
      "px.angle": "Sudut paralaks p", "px.distpc": "Jarak", "px.formula": "p = 1 / d"
    }
  },
  about: {
    en: "<p>As Earth swings from one side of its orbit to the other, a nearby star appears to shift back and forth against the far-distant background stars. " +
        "Half of that total shift is the <strong>parallax angle</strong> p.</p>" +
        "<p>The closer the star, the bigger the wobble — so distance follows the beautifully simple rule " +
        "<strong>d (parsecs) = 1 / p (arcseconds)</strong>. A star with a parallax of one arcsecond sits one parsec (3.26 light-years) away. " +
        "Real parallaxes are tiny — even the nearest star shifts by less than an arcsecond — which is why measuring them took until 1838.</p>",
    id: "<p>Saat Bumi berayun dari satu sisi orbitnya ke sisi lain, bintang dekat tampak bergeser maju-mundur terhadap bintang latar yang sangat jauh. " +
        "Separuh dari total pergeseran itu adalah <strong>sudut paralaks</strong> p.</p>" +
        "<p>Makin dekat bintang, makin besar goyangannya — sehingga jarak mengikuti aturan yang indah sederhananya " +
        "<strong>d (parsek) = 1 / p (detik busur)</strong>. Bintang dengan paralaks satu detik busur berjarak satu parsek (3,26 tahun cahaya). " +
        "Paralaks nyata sangat kecil — bahkan bintang terdekat bergeser kurang dari satu detik busur — itulah mengapa pengukurannya baru berhasil pada 1838.</p>"
  },
  build: function (S) {
    var d = 3;                  // parsecs
    var t = 0;                  // orbital phase
    var loop = S.loop(function (dt) { t = (t + dt * 0.5) % 1; S.requestDraw(); });

    S.group("px.sys");
    S.slider({ labelKey: "px.dist", min: 1, max: 12, value: d, step: 0.5, unit: " pc", on: function (v) { d = v; upd(); } });
    S.group("px.anim");
    S.playPause(loop);

    var outA = S.readout({ labelKey: "px.angle" });
    var outD = S.readout({ labelKey: "px.distpc" });

    function upd() {
      outA((1 / d).toFixed(3) + "″");
      outD(d.toFixed(1) + " pc · " + (d * 3.26).toFixed(1) + " ly");
      S.requestDraw();
    }

    // fixed background star field (far away) for the sky view
    var bg = [];
    for (var i = 0; i < 60; i++) bg.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.4 });

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var splitX = 360;

      // ===== left: top-down view =====
      var sunX = 150, sunY = H - 120, orbitR = 60;
      var earthAng = t * 2 * Math.PI;
      var ex = sunX + orbitR * Math.cos(earthAng), ey = sunY + orbitR * 0.5 * Math.sin(earthAng); // foreshortened
      var starX = sunX, starY = sunY - 30 - (d / 12) * 230;     // nearby star up the page, farther = higher

      // sight line from Earth to star, extended to background
      ctx.strokeStyle = "rgba(110,168,254,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(starX + (starX - ex) * 1.4, starY + (starY - ey) * 1.4); ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "#2c3a66"; ctx.beginPath(); ctx.ellipse(sunX, sunY, orbitR, orbitR * 0.5, 0, 0, 2 * Math.PI); ctx.stroke();
      // Sun
      ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.arc(sunX, sunY, 9, 0, 2 * Math.PI); ctx.fill();
      // Earth
      ctx.fillStyle = "#3b6fd6"; ctx.beginPath(); ctx.arc(ex, ey, 6, 0, 2 * Math.PI); ctx.fill();
      // nearby star
      ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(starX, starY, 5, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#9fabce"; ctx.font = "12px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("px.spaceView"), sunX, H - 22);

      // ===== right: sky view =====
      var bx = splitX + 20, by = 40, bw = W - splitX - 44, bh = H - 110;
      ctx.fillStyle = "#05070f"; ctx.strokeStyle = "#2c3a66";
      ctx.fillRect(bx, by, bw, bh); ctx.strokeRect(bx, by, bw, bh);
      ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
      // background stars (fixed)
      ctx.fillStyle = "#cdd6ee";
      bg.forEach(function (s) { ctx.beginPath(); ctx.arc(bx + s.x * bw, by + s.y * bh, s.r, 0, 2 * Math.PI); ctx.fill(); });
      // nearby star apparent shift ∝ (1/d) * cos(orbital phase along baseline)
      var shiftPix = (1 / d) * 150 * Math.cos(earthAng);
      var nsx = bx + bw / 2 + shiftPix, nsy = by + bh / 2;
      // ghost extremes
      ctx.fillStyle = "rgba(255,107,107,0.3)";
      ctx.beginPath(); ctx.arc(bx + bw / 2 - (1 / d) * 150, nsy, 5, 0, 2 * Math.PI); ctx.fill();
      ctx.beginPath(); ctx.arc(bx + bw / 2 + (1 / d) * 150, nsy, 5, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "rgba(255,107,107,0.4)"; ctx.beginPath();
      ctx.moveTo(bx + bw / 2 - (1 / d) * 150, nsy); ctx.lineTo(bx + bw / 2 + (1 / d) * 150, nsy); ctx.stroke();
      // current
      ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(nsx, nsy, 6, 0, 2 * Math.PI); ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#9fabce"; ctx.textAlign = "center"; ctx.fillText(I18N.t("px.skyView"), bx + bw / 2, H - 22);
    });

    upd();
  }
});
