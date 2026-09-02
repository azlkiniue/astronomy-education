/* Tidal Bulge Simulation ------------------------------------------------------
   Faithful rebuild of the ClassAction "Tidal Bulge Simulation" (tidesim.swf).
   Shows Earth at center with an ocean layer that deforms into a tidal bulge
   toward (and away from) the Moon. The Moon orbits Earth. Optional toggles
   add the Sun's tidal effect and Earth's rotation.
   Physics: the tidal bulge points along the line connecting Earth to the
   tide-raising body. The far-side bulge arises because the body's gravity
   is weaker there than at Earth's center (differential / tidal force). */
Sim.create({
  id: "tidesim",
  width: 760, height: 520,
  strings: {
    en: {
      "td.run": "run", "td.sun": "include Sun",
      "td.rot": "include effects of Earth's rotation",
      "td.reset": "reset", "td.moon": "Moon", "td.sunLabel": "Sun",
      "td.earth": "Earth"
    },
    id: {
      "td.run": "jalankan", "td.sun": "sertakan Matahari",
      "td.rot": "sertakan efek rotasi Bumi",
      "td.reset": "atur ulang", "td.moon": "Bulan", "td.sunLabel": "Matahari",
      "td.earth": "Bumi"
    }
  },
  about: {
    en: "<p>Tides are caused by the <strong>differential gravitational force</strong> (tidal force) of the Moon and Sun across Earth's diameter. The side of Earth nearest the Moon feels a stronger pull than the center, creating a bulge toward the Moon. The far side feels a weaker pull, so water there is \"left behind,\" creating a second bulge.</p>" +
        "<p>Check <em>Include Sun</em> to see how the Sun's tidal effect (about 46% of the Moon's) reinforces the bulge at new and full Moon (spring tides) and partially cancels it at quarter phases (neap tides). <em>Include rotation</em> adds Earth's spin, which drags the bulge slightly ahead of the Moon's position.</p>",
    id: "<p>Pasang surut disebabkan oleh <strong>gaya gravitasi diferensial</strong> (gaya pasang) Bulan dan Matahari pada diameter Bumi. Sisi Bumi terdekat Bulan merasakan tarikan lebih kuat, menciptakan tonjolan. Sisi jauh merasakan tarikan lebih lemah, sehingga air \"tertinggal\" membentuk tonjolan kedua.</p>" +
        "<p>Centang <em>Sertakan Matahari</em> untuk melihat efek pasang Matahari (≈46% Bulan) yang memperkuat tonjolan saat bulan baru dan purnama (pasang purnama) dan sebagian membatalkannya saat kuarter (pasang perbani). <em>Sertakan rotasi</em> menambahkan putaran Bumi.</p>"
  },
  build: function (S) {
    var ctx = S.ctx, W = S.W, H = S.H;
    var CX = 300, CY = 240;
    var EARTH_R = 80;
    var MOON_ORBIT = 200;
    var MOON_R = 18;
    var SUN_DIST = 350;

    var P = {
      moonAngle: 0,
      earthRot: 0,
      running: false,
      showSun: false,
      showRot: false
    };

    var runT = S.toggle({ labelKey: "td.run", value: false, on: function (b) {
      P.running = b;
      if (b) loop.play(); else loop.pause();
    }});
    var sunT = S.toggle({ labelKey: "td.sun", value: false, on: function (b) { P.showSun = b; } });
    var rotT = S.toggle({ labelKey: "td.rot", value: false, on: function (b) { P.showRot = b; } });
    S.button({ labelKey: "td.reset", on: function () {
      P.moonAngle = 0; P.earthRot = 0;
      runT.set(false); sunT.set(false); rotT.set(false);
      loop.pause();
      S.requestDraw();
    }});

    var loop = S.loop(function (dt) {
      var moonOmega = 2 * Math.PI / 8;
      var earthOmega = 2 * Math.PI / (8 / 27.3);
      P.moonAngle += moonOmega * dt;
      if (P.showRot) P.earthRot += earthOmega * dt;
    });

    S.onDraw(function () {
      S.clear();

      var mx = CX + Math.cos(P.moonAngle) * MOON_ORBIT;
      var my = CY + Math.sin(P.moonAngle) * MOON_ORBIT;

      // Moon orbit (faint)
      ctx.strokeStyle = "rgba(150,150,150,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(CX, CY, MOON_ORBIT, 0, Math.PI * 2);
      ctx.stroke();

      // compute tidal bulge direction
      var bulgeAngle = P.moonAngle;
      var bulgeAmp = 22;
      var sunBulgeAmp = bulgeAmp * 0.70;

      // Sun position (far right for visual)
      var sunAngle = 0;
      var sunX = CX + SUN_DIST;
      var sunY = CY;

      // rotation drag offset
      var rotOffset = P.showRot ? 0.4 : 0;

      // draw Earth with tidal bulge
      ctx.save();
      ctx.translate(CX, CY);

      // ocean layer with tidal deformation
      ctx.beginPath();
      var steps = 120;
      for (var i = 0; i <= steps; i++) {
        var a = (i / steps) * Math.PI * 2;
        // moon tidal bulge: cos²(a - bulgeAngle) pattern → two bulges
        var moonTide = bulgeAmp * Math.pow(Math.cos(a - bulgeAngle - rotOffset), 2);
        var r = EARTH_R + moonTide - bulgeAmp / 2;

        if (P.showSun) {
          var sunTide = sunBulgeAmp * Math.pow(Math.cos(a - sunAngle - rotOffset), 2);
          r += sunTide - sunBulgeAmp / 2;
        }

        var px = Math.cos(a) * r;
        var py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(60,130,200,0.45)";
      ctx.fill();
      ctx.strokeStyle = "rgba(80,160,240,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // solid Earth
      ctx.save();
      if (P.showRot) ctx.rotate(P.earthRot);

      ctx.beginPath();
      ctx.arc(0, 0, EARTH_R - 2, 0, Math.PI * 2);

      // gradient for 3D look
      var eg = ctx.createRadialGradient(-20, -20, EARTH_R * 0.1, 0, 0, EARTH_R);
      eg.addColorStop(0, "#4499cc");
      eg.addColorStop(0.5, "#226699");
      eg.addColorStop(1, "#113355");
      ctx.fillStyle = eg;
      ctx.fill();

      // simple continents
      ctx.fillStyle = "#338855";
      ctx.beginPath(); ctx.ellipse(-25, -20, 18, 14, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-10, 20, 10, 18, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(25, -10, 10, 14, 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(22, 18, 9, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(50, -20, 18, 12, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(55, 25, 10, 7, 0.3, 0, Math.PI * 2); ctx.fill();

      // ice caps
      ctx.fillStyle = "rgba(220,235,255,0.6)";
      ctx.beginPath(); ctx.ellipse(0, -(EARTH_R - 8), 28, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, EARTH_R - 6, 24, 8, 0, 0, Math.PI * 2); ctx.fill();

      ctx.restore();

      // Earth outline
      ctx.beginPath();
      ctx.arc(0, 0, EARTH_R - 2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(80,160,240,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // Earth label
      ctx.fillStyle = "#88bbff"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("td.earth"), CX, CY + EARTH_R + 30);

      // Moon
      ctx.save();
      var mg = ctx.createRadialGradient(mx - 4, my - 4, 2, mx, my, MOON_R);
      mg.addColorStop(0, "#ddddcc");
      mg.addColorStop(1, "#888877");
      ctx.beginPath();
      ctx.arc(mx, my, MOON_R, 0, Math.PI * 2);
      ctx.fillStyle = mg;
      ctx.fill();
      ctx.strokeStyle = "rgba(200,200,180,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // craters
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.beginPath(); ctx.arc(mx - 5, my - 4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(mx + 4, my + 3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(mx - 2, my + 6, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      ctx.fillStyle = "#ccccaa"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("td.moon"), mx, my + MOON_R + 14);

      // Sun (if shown)
      if (P.showSun) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
        var sg = ctx.createRadialGradient(sunX - 5, sunY - 5, 3, sunX, sunY, 24);
        sg.addColorStop(0, "#ffee88");
        sg.addColorStop(1, "#ddaa22");
        ctx.fillStyle = sg;
        ctx.fill();

        // rays
        ctx.strokeStyle = "rgba(255,220,100,0.4)";
        ctx.lineWidth = 2;
        for (var r = 0; r < 8; r++) {
          var ra = r * Math.PI / 4;
          ctx.beginPath();
          ctx.moveTo(sunX + Math.cos(ra) * 28, sunY + Math.sin(ra) * 28);
          ctx.lineTo(sunX + Math.cos(ra) * 36, sunY + Math.sin(ra) * 36);
          ctx.stroke();
        }
        ctx.restore();

        ctx.fillStyle = "#ffdd44"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(I18N.t("td.sunLabel"), sunX, sunY + 38);
      }
    });

    S.requestDraw();
  }
});
