/* Phases of Venus Simulator ---------------------------------------------------
   Faithful rebuild of the ClassAction "Phases of Venus" (venusphases.swf).
   Top-down orbital view: Sun at center, Venus (0.723 AU) and Earth (1 AU).
   An inset shows Venus's phase as seen from Earth — the illuminated fraction
   and apparent size both change with geometry.  Drag either planet along its
   orbit or animate. Readouts: elongation and Earth–Venus distance. */
Sim.create({
  id: "venusphases",
  width: 760, height: 520,
  strings: {
    en: {
      "vp.elong": "elongation", "vp.dist": "Earth–Venus distance",
      "vp.reset": "reset", "vp.sun": "Sun", "vp.venus": "Venus",
      "vp.earth": "Earth", "vp.scale": "1 arcminute",
      "vp.draggable": "Venus and the Earth are draggable"
    },
    id: {
      "vp.elong": "elongasi", "vp.dist": "jarak Bumi–Venus",
      "vp.reset": "atur ulang", "vp.sun": "Matahari", "vp.venus": "Venus",
      "vp.earth": "Bumi", "vp.scale": "1 menit busur",
      "vp.draggable": "Venus dan Bumi dapat diseret"
    }
  },
  about: {
    en: "<p>In the Copernican model Venus orbits closer to the Sun than Earth. As it moves, the angle between its Sun-lit hemisphere and our line of sight changes, producing <strong>phases</strong> like the Moon's.</p>" +
        "<p>When Venus is far (beyond the Sun) it appears nearly full but tiny. Near inferior conjunction (between Earth and Sun) it shows a thin crescent but looks much larger. Galileo's observation of this full range of phases was strong evidence for the heliocentric model — in Ptolemy's model Venus could never appear nearly full.</p>",
    id: "<p>Dalam model Kopernikan, Venus mengorbit lebih dekat ke Matahari. Saat bergerak, sudut antara belahan yang diterangi dan garis pandang kita berubah, menghasilkan <strong>fase</strong> seperti Bulan.</p>" +
        "<p>Saat Venus jauh (di balik Matahari) tampak hampir penuh tapi kecil. Dekat konjungsi inferior tampak sabit tipis tapi besar. Pengamatan Galileo atas rentang fase penuh ini menjadi bukti kuat model heliosentris.</p>"
  },
  build: function (S) {
    var ctx = S.ctx, W = S.W, H = S.H;
    var AU = 160;
    var SUN = { x: 240, y: 260 };
    var R_V = 0.723 * AU;
    var R_E = 1.0 * AU;
    var INSET = { x: 590, y: 180, maxR: 55 };

    var P = { va: Math.PI * 1.3, ea: 0 };

    var oElong = S.readout({ labelKey: "vp.elong" });
    var oDist  = S.readout({ labelKey: "vp.dist" });

    var loop = S.loop(function (dt) {
      P.va += (2 * Math.PI / 0.6152) * dt * 0.15;
      P.ea += (2 * Math.PI / 1.0)    * dt * 0.15;
    });
    var ppBtn = S.playPause(loop);
    S.button({ labelKey: "vp.reset", on: function () {
      P.va = Math.PI * 1.3; P.ea = 0;
      loop.pause(); ppBtn.sync(); S.requestDraw();
    }});

    /* --- drag --- */
    var drag = null;
    function canvasXY(e) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * W / r.width,
               y: (e.clientY - r.top)  * H / r.height };
    }
    function d2(ax, ay, bx, by) { return (ax - bx) * (ax - bx) + (ay - by) * (ay - by); }
    S.canvas.addEventListener("mousedown", function (e) {
      if (loop.playing) return;
      var m = canvasXY(e);
      var vx = SUN.x + Math.cos(P.va) * R_V, vy = SUN.y + Math.sin(P.va) * R_V;
      var ex = SUN.x + Math.cos(P.ea) * R_E, ey = SUN.y + Math.sin(P.ea) * R_E;
      if (d2(m.x, m.y, vx, vy) < 400) drag = "v";
      else if (d2(m.x, m.y, ex, ey) < 400) drag = "e";
    });
    S.canvas.addEventListener("mousemove", function (e) {
      if (!drag) return;
      var m = canvasXY(e);
      var a = Math.atan2(m.y - SUN.y, m.x - SUN.x);
      if (drag === "v") P.va = a; else P.ea = a;
      S.requestDraw();
    });
    S.canvas.addEventListener("mouseup",    function () { drag = null; });
    S.canvas.addEventListener("mouseleave", function () { drag = null; });

    /* --- draw --- */
    S.onDraw(function () {
      S.clear();
      var vx = SUN.x + Math.cos(P.va) * R_V, vy = SUN.y + Math.sin(P.va) * R_V;
      var ex = SUN.x + Math.cos(P.ea) * R_E, ey = SUN.y + Math.sin(P.ea) * R_E;

      // orbits
      ctx.strokeStyle = "rgba(150,150,150,0.35)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(SUN.x, SUN.y, R_V, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(SUN.x, SUN.y, R_E, 0, Math.PI * 2); ctx.stroke();

      // Sun
      ctx.beginPath(); ctx.arc(SUN.x, SUN.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#ffdd44"; ctx.fill();
      ctx.fillStyle = "#ffdd44"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("vp.sun"), SUN.x, SUN.y + 24);

      // Venus
      ctx.beginPath(); ctx.arc(vx, vy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#bbbbbb"; ctx.fill();
      ctx.fillStyle = "#cccccc"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("vp.venus"), vx, vy + 16);

      // Earth
      ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#4488dd"; ctx.fill();
      ctx.fillStyle = "#88bbff"; ctx.font = "12px sans-serif";
      ctx.fillText(I18N.t("vp.earth"), ex, ey + 18);

      // --- elongation ---
      var sedx = SUN.x - ex, sedy = SUN.y - ey;
      var vedx = vx - ex,    vedy = vy - ey;
      var dot = sedx * vedx + sedy * vedy;
      var mSE = Math.sqrt(sedx * sedx + sedy * sedy);
      var mVE = Math.sqrt(vedx * vedx + vedy * vedy);
      var elongRad = Math.acos(Math.max(-1, Math.min(1, dot / (mSE * mVE))));
      var elongDeg = elongRad * 180 / Math.PI;
      var cross = sedx * vedy - sedy * vedx;
      oElong(elongDeg.toFixed(1) + "°" + (cross > 0 ? " E" : " W"));
      oDist((mVE / AU).toFixed(2) + " AU");

      // --- scale bar ---
      ctx.save();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
      var sbx = INSET.x - 55, sby = INSET.y - 85;
      ctx.beginPath(); ctx.moveTo(sbx, sby); ctx.lineTo(sbx + 110, sby); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sbx, sby - 4); ctx.lineTo(sbx, sby + 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sbx + 110, sby - 4); ctx.lineTo(sbx + 110, sby + 4); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("vp.scale"), sbx + 55, sby - 10);
      ctx.restore();

      // --- phase inset ---
      drawPhase(vx, vy, ex, ey, mVE);

      // hint
      ctx.fillStyle = "rgba(200,200,200,0.5)"; ctx.font = "italic 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(I18N.t("vp.draggable"), W / 2, H - 12);
    });

    function drawPhase(vx, vy, ex, ey, evDist) {
      // apparent size: inversely proportional to distance
      var maxDist = R_E + R_V;
      var minDist = R_E - R_V;
      var t = (evDist - minDist) / (maxDist - minDist);
      var diskR = INSET.maxR * (1 - t * 0.7);
      diskR = Math.max(8, Math.min(INSET.maxR, diskR));

      // phase angle: angle Sun-Venus-Earth
      var svx = SUN.x - vx, svy = SUN.y - vy;
      var evx = ex - vx,    evy = ey - vy;
      var dotSVE = svx * evx + svy * evy;
      var mSV = Math.sqrt(svx * svx + svy * svy);
      var mEV = Math.sqrt(evx * evx + evy * evy);
      var phaseAngle = Math.acos(Math.max(-1, Math.min(1, dotSVE / (mSV * mEV))));

      // orientation: which direction does the lit limb face from Earth's view?
      var sunPA = Math.atan2(SUN.y - ey, SUN.x - ex);
      var venPA = Math.atan2(vy - ey, vx - ex);
      var orient = sunPA - venPA;

      ctx.save();
      ctx.translate(INSET.x, INSET.y);

      // dark disk
      ctx.beginPath();
      ctx.arc(0, 0, diskR, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();
      ctx.strokeStyle = "rgba(100,100,100,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // illuminated crescent/gibbous
      ctx.save();
      ctx.rotate(orient);

      ctx.beginPath();
      // lit semicircle: right half
      ctx.arc(0, 0, diskR, -Math.PI / 2, Math.PI / 2);
      // terminator: ellipse connecting top to bottom
      var tw = diskR * Math.cos(phaseAngle);
      ctx.ellipse(0, 0, Math.abs(tw), diskR, 0, Math.PI / 2, -Math.PI / 2, tw < 0);
      ctx.closePath();
      ctx.fillStyle = "#eee";
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    S.requestDraw();
  }
});
