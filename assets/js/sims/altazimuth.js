/* Azimuth/Altitude Demonstrator -----------------------------------------------
   Faithful rebuild of the ClassAction "Azimuth/Altitude Demonstrator"
   (altazimuth.swf): a 3-D celestial-sphere horizon diagram with a single
   draggable star, showing how the horizon (alt-az) coordinates locate an object.
     • Star Position — azimuth and altitude sliders (the star is also draggable),
     • the altitude measured up from the horizon along the star's vertical circle,
       and the azimuth measured along the horizon from due north,
     • a Labels panel — show all / hide all, plus individual toggles for the
       zenith, horizon plane, nadir and meridian.
   Reuses the tilted alt-az sphere projection from the lunar-phases / sun-motions
   horizon diagrams.                                                              */
Sim.create({
  id: "altazimuth",
  width: 620, height: 480,
  strings: {
    en: {
      "aa.pos": "Star Position", "aa.az": "azimuth", "aa.alt": "altitude",
      "aa.dragHint": "you can also move the star by dragging it",
      "aa.labels": "Labels", "aa.showAll": "show all", "aa.hideAll": "hide all",
      "aa.zenith": "zenith", "aa.horizon": "horizon plane", "aa.nadir": "nadir", "aa.meridian": "meridian",
      "dir.N": "N", "dir.S": "S", "dir.E": "E", "dir.W": "W"
    },
    id: {
      "aa.pos": "Posisi Bintang", "aa.az": "azimut", "aa.alt": "altitudo",
      "aa.dragHint": "kamu juga bisa memindahkan bintang dengan menyeretnya",
      "aa.labels": "Label", "aa.showAll": "tampilkan semua", "aa.hideAll": "sembunyikan semua",
      "aa.zenith": "zenit", "aa.horizon": "bidang horizon", "aa.nadir": "nadir", "aa.meridian": "meridian",
      "dir.N": "U", "dir.S": "S", "dir.E": "T", "dir.W": "B"
    }
  },
  about: {
    en: "<p>The <strong>horizon (alt-azimuth) system</strong> pins any object in the sky with two angles measured by a local observer. <strong>Altitude</strong> is the angle up from the horizon (0° at the horizon, 90° straight overhead at the zenith). <strong>Azimuth</strong> is the compass bearing of the point directly below the object, measured clockwise from due north (N = 0°, E = 90°, S = 180°, W = 270°).</p>" +
        "<p>Drag the star around the dome, or set its azimuth and altitude with the sliders. The yellow arc traces the altitude up the star's vertical circle; the arc along the green horizon plane traces the azimuth from north.</p>" +
        "<p>This system is wonderfully intuitive — it's how you'd point at a star — but it's tied to <em>your</em> location and the <em>moment</em>: as Earth turns, every star's altitude and azimuth change. That's why catalogues instead use the fixed equatorial (RA/Dec) system.</p>",
    id: "<p><strong>Sistem horizon (alt-azimut)</strong> menetapkan posisi benda langit dengan dua sudut yang diukur pengamat lokal. <strong>Altitudo</strong> adalah sudut naik dari horizon (0° di horizon, 90° tepat di atas kepala di zenit). <strong>Azimut</strong> adalah arah kompas titik tepat di bawah benda, diukur searah jarum jam dari utara (U = 0°, T = 90°, S = 180°, B = 270°).</p>" +
        "<p>Seret bintang mengelilingi kubah, atau atur azimut dan altitudonya dengan penggeser. Busur kuning menelusuri altitudo pada lingkaran vertikal bintang; busur di bidang horizon hijau menelusuri azimut dari utara.</p>" +
        "<p>Sistem ini sangat intuitif — seperti cara kamu menunjuk bintang — tetapi terikat pada <em>lokasi</em> dan <em>saat</em>-mu: seiring Bumi berputar, altitudo dan azimut tiap bintang berubah. Karena itu katalog memakai sistem ekuatorial (AR/Dek) yang tetap.</p>"
  },
  build: function (S) {
    var C = { text: "#e8ecf8", dim: "#9fabce", border: "#2c3a66", star: "#ffd166",
              alt: "#ff6b6b", az: "#6ea8fe", merid: "#b692ff", green: "#3f8a45" };
    var D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = Math.PI * 2;
    var az = 140, alt = 45;

    /* ---- controls ---- */
    S.group("aa.pos");
    var azCtl = S.slider({ labelKey: "aa.az", min: 0, max: 360, step: 0.5, value: az,
      format: function (v) { return v.toFixed(1) + "°"; }, on: function (v) { az = v; S.requestDraw(); } });
    var altCtl = S.slider({ labelKey: "aa.alt", min: -90, max: 90, step: 0.5, value: alt,
      format: function (v) { return v.toFixed(1) + "°"; }, on: function (v) { alt = v; S.requestDraw(); } });

    S.group("aa.labels");
    S.button({ labelKey: "aa.showAll", on: function () { setAll(true); } });
    S.button({ labelKey: "aa.hideAll", on: function () { setAll(false); } });
    var optZen = S.toggle({ labelKey: "aa.zenith", value: true });
    var optHor = S.toggle({ labelKey: "aa.horizon", value: true });
    var optNad = S.toggle({ labelKey: "aa.nadir", value: false });
    var optMer = S.toggle({ labelKey: "aa.meridian", value: true });
    function setAll(b) { [optZen, optHor, optNad, optMer].forEach(function (o) { o.set(b); }); }

    /* ===================== projection (tilted alt-az globe) ===================== */
    var SCx = 300, SCy = 252, R = 196, TILT = 24 * D2R;
    var sinB = Math.sin(TILT), cosB = Math.cos(TILT), rx = R, ry = R * sinB;
    // azimuth from north, measured to the EAST: N at the back (top), S front, E right, W left
    function projVec(E, N, U) { return { x: SCx + R * E, y: SCy - R * (U * cosB + N * sinB) }; }
    function project(a, z) { var c = Math.cos(a * D2R); return projVec(c * Math.sin(z * D2R), c * Math.cos(z * D2R), Math.sin(a * D2R)); }

    /* draw a great/small circle given a list of {alt,az}, solid above horizon, faint below */
    function curve(pts, col, w, dashBelow) {
      var ctx = S.ctx;
      for (var seg = 0; seg < 2; seg++) {
        ctx.beginPath(); var pen = false;
        for (var i = 0; i < pts.length; i++) {
          if ((pts[i].alt >= 0) !== (seg === 0)) { pen = false; continue; }
          var p = project(pts[i].alt, pts[i].az);
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.strokeStyle = col; ctx.lineWidth = seg === 0 ? w : 1;
        ctx.globalAlpha = seg === 0 ? 1 : 0.22; if (seg === 1 && dashBelow) ctx.setLineDash([4, 4]);
        ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
    }

    /* drag the star: pick nearest (alt,az) on the visible dome to the pointer */
    var dragging = false;
    function localXY(ev) { var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var m = localXY(ev), p = project(alt, az);
      if (Math.hypot(m.x - p.x, m.y - p.y) < 36) { dragging = true; S.canvas.setPointerCapture(ev.pointerId); }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!dragging) return;
      var m = localXY(ev), best = 1e9, ba = alt, bz = az;
      for (var a = -90; a <= 90; a += 1.5) for (var z = 0; z < 360; z += 2) {
        // prefer the near (viewer-facing) side so the star follows the cursor on the visible globe
        var depth = Math.sin(a * D2R) * sinB - Math.cos(a * D2R) * Math.cos(z * D2R) * cosB;
        if (depth < -0.12) continue;
        var p = project(a, z), d = (p.x - m.x) * (p.x - m.x) + (p.y - m.y) * (p.y - m.y);
        if (d < best) { best = d; ba = a; bz = z; }
      }
      alt = ba; az = bz; azCtl.set(az); altCtl.set(alt); S.requestDraw();
    });
    S.canvas.addEventListener("pointerup", function () { dragging = false; });

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      ctx.save(); ctx.beginPath(); ctx.arc(SCx, SCy, R + 2, 0, TAU); ctx.clip();

      // sky dome (upper hemisphere) + dark underside
      ctx.beginPath(); ctx.arc(SCx, SCy, R, Math.PI, TAU, false);
      ctx.ellipse(SCx, SCy, rx, ry, 0, TAU, Math.PI, true); ctx.closePath();
      var sg = ctx.createLinearGradient(0, SCy - R, 0, SCy + ry);
      sg.addColorStop(0, "#1a2a52"); sg.addColorStop(1, "#243a63"); ctx.fillStyle = sg; ctx.fill();
      ctx.beginPath(); ctx.arc(SCx, SCy, R, 0, Math.PI, false);
      ctx.ellipse(SCx, SCy, rx, ry, 0, Math.PI, 0, true); ctx.closePath();
      ctx.fillStyle = "#060a16"; ctx.fill();

      // meridian (vertical great circle through N–zenith–S–nadir, i.e. az 0/180)
      if (optMer.value()) {
        var mp = [];
        for (var t = 0; t <= 180; t += 2) mp.push({ alt: 90 - Math.abs(90 - t), az: t <= 90 ? 0 : 180 });   // N→zenith→S
        for (var t2 = 0; t2 <= 180; t2 += 2) mp.push({ alt: -(90 - Math.abs(90 - t2)), az: t2 <= 90 ? 180 : 0 }); // S→nadir→N
        curve(mp, C.merid, 1.4, true);
      }

      // horizon plane (translucent green)
      if (optHor.value()) {
        ctx.beginPath(); ctx.ellipse(SCx, SCy, rx, ry, 0, 0, TAU);
        var gg = ctx.createLinearGradient(0, SCy - ry, 0, SCy + ry);
        gg.addColorStop(0, "#3f8a45"); gg.addColorStop(1, "#2c6a36");
        ctx.fillStyle = gg; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      } else {
        ctx.strokeStyle = "rgba(120,200,140,0.6)"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(SCx, SCy, rx, ry, 0, 0, TAU); ctx.stroke();
      }
      ctx.restore();

      // sphere outline
      ctx.strokeStyle = C.border; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(SCx, SCy, R, 0, TAU); ctx.stroke();

      var below = alt < 0;

      // azimuth arc along the horizon from N (az 0) to the star's foot
      var foot = []; for (var z = 0; z <= az; z += 2) foot.push({ alt: 0, az: z });
      strokePath(ctx, foot, C.az, 2);
      // altitude arc along the star's vertical circle from the horizon to the star (up or down)
      var lo = Math.min(0, alt), hi = Math.max(0, alt), vc = [];
      for (var a2 = lo; a2 <= hi; a2 += 2) vc.push({ alt: a2, az: az });
      if (!vc.length || vc[vc.length - 1].alt !== alt) vc.push({ alt: alt, az: az });
      ctx.save(); if (below) ctx.globalAlpha = 0.45; strokePath(ctx, vc, C.alt, 2); ctx.restore();

      // zenith / nadir markers
      if (optZen.value()) { var ze = project(90, 0); marker(ctx, ze.x, ze.y, "#cfe0ff", I18N.t("aa.zenith"), -10); }
      if (optNad.value()) { var na = projVec(0, 0, -1); marker(ctx, na.x, na.y, "#7d8bb0", I18N.t("aa.nadir"), 14); }

      // the star + dotted drop line to its foot (dimmed when the star is below the horizon)
      var sp = project(alt, az), fp = project(0, az);
      ctx.save(); if (below) ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "rgba(255,209,102,0.45)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(fp.x, fp.y); ctx.lineTo(sp.x, sp.y); ctx.stroke(); ctx.setLineDash([]);
      drawStar(ctx, sp.x, sp.y, 9);
      ctx.restore();
      dot(ctx, fp.x, fp.y, C.az, 3);

      // observer stick figure at centre
      stick(ctx, SCx, SCy);

      // cardinal labels (N back/top, S front/bottom, E right, W left — matches the original)
      ctx.fillStyle = "#eaf2ff"; ctx.font = "bold 13px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(I18N.t("dir.N"), SCx, SCy - ry - 11);
      ctx.fillText(I18N.t("dir.S"), SCx, SCy + ry + 12);
      ctx.fillText(I18N.t("dir.E"), SCx + R + 12, SCy);
      ctx.fillText(I18N.t("dir.W"), SCx - R - 12, SCy);
      ctx.textBaseline = "alphabetic";

      // angle readouts near the star
      ctx.font = "12px var(--mono, monospace)"; ctx.textAlign = "left";
      ctx.fillStyle = C.alt; ctx.fillText("alt " + alt.toFixed(1) + "°", sp.x + 12, sp.y - 4);
      ctx.fillStyle = C.az; ctx.fillText("az " + az.toFixed(1) + "°", sp.x + 12, sp.y + 12);

      // drag hint
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("aa.dragHint"), SCx, S.H - 12);
    });

    function strokePath(ctx, pts, col, w) {
      ctx.beginPath();
      for (var i = 0; i < pts.length; i++) { var p = project(pts[i].alt, pts[i].az); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
    }
    function marker(ctx, x, y, col, label, dy) {
      dot(ctx, x, y, col, 3.5);
      ctx.fillStyle = col; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText(label, x, y + dy);
    }
    function drawStar(ctx, x, y, r) {
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.star;
      ctx.beginPath();
      for (var i = 0; i < 10; i++) { var ang = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
        i ? ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr) : ctx.moveTo(Math.cos(ang) * rr, Math.sin(ang) * rr); }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#7a5a00"; ctx.lineWidth = 0.8; ctx.stroke(); ctx.restore();
    }
    function stick(ctx, x, baseY) {
      var top = baseY - 16;
      ctx.fillStyle = "#d6e2ff"; ctx.beginPath(); ctx.arc(x, top, 3, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#d6e2ff"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, top + 3); ctx.lineTo(x, baseY - 5);
      ctx.moveTo(x - 4, top + 7); ctx.lineTo(x + 4, top + 7);
      ctx.moveTo(x, baseY - 5); ctx.lineTo(x - 3, baseY);
      ctx.moveTo(x, baseY - 5); ctx.lineTo(x + 3, baseY);
      ctx.stroke(); ctx.lineCap = "butt";
    }
    function dot(ctx, x, y, col, r) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  }
});
