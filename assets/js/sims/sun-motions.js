/* Motions of the Sun Simulator ------------------------------------------------
   Faithful rebuild of the NAAP "Motions of the Sun Simulator" (sunmotions.swf):
   a 3-D celestial-sphere horizon diagram with a stick-figure observer, showing
   the Sun's daily and seasonal motion. Controls mirror the original — day of
   year, time of day, observer's latitude; animation (by time of day / by day of
   year); and settings for the celestial equator, ecliptic, the Sun's diurnal
   path, the stickfigure shadow and the analemma. The Information readouts (alt,
   az, RA, dec, hour angle, sidereal time, equation of time) match the SWF.      */
Sim.create({
  id: "sun-motions",
  width: 680, height: 600,
  strings: {
    en: {
      "sm.timeLoc": "Time & Location", "sm.day": "day of year", "sm.time": "time of day", "sm.lat": "observer's latitude",
      "sm.anim": "Animation", "sm.start": "start animation", "sm.pause": "pause animation", "sm.speed": "animation speed", "sm.mode": "animate",
      "sm.modeTime": "time of day", "sm.modeDay": "day of year",
      "sm.settings": "Settings", "sm.eq": "show celestial equator", "sm.ecl": "show the ecliptic",
      "sm.diur": "show the Sun's path", "sm.shadow": "show stickfigure shadow", "sm.analemma": "show analemma",
      "sm.alt": "Sun's altitude", "sm.az": "Sun's azimuth", "sm.dec": "Sun's declination", "sm.ra": "Sun's right ascension",
      "sm.ha": "hour angle", "sm.lst": "sidereal time", "sm.eot": "equation of time",
      "sm.captAt": "Horizon diagram for an observer at", "sm.on": "on", "sm.at": "at",
      "dir.N": "N", "dir.S": "S", "dir.E": "E", "dir.W": "W"
    },
    id: {
      "sm.timeLoc": "Waktu & Lokasi", "sm.day": "hari ke-", "sm.time": "waktu hari", "sm.lat": "lintang pengamat",
      "sm.anim": "Animasi", "sm.start": "mulai animasi", "sm.pause": "jeda animasi", "sm.speed": "kecepatan animasi", "sm.mode": "animasikan",
      "sm.modeTime": "waktu hari", "sm.modeDay": "hari dalam tahun",
      "sm.settings": "Pengaturan", "sm.eq": "tampilkan ekuator langit", "sm.ecl": "tampilkan ekliptika",
      "sm.diur": "tampilkan lintasan Matahari", "sm.shadow": "tampilkan bayangan", "sm.analemma": "tampilkan analema",
      "sm.alt": "altitudo Matahari", "sm.az": "azimut Matahari", "sm.dec": "deklinasi Matahari", "sm.ra": "asensiorekta Matahari",
      "sm.ha": "sudut jam", "sm.lst": "waktu sideris", "sm.eot": "perata waktu",
      "sm.captAt": "Diagram horizon untuk pengamat di", "sm.on": "pada", "sm.at": "pukul",
      "dir.N": "U", "dir.S": "S", "dir.E": "T", "dir.W": "B"
    }
  },
  about: {
    en: "<p>The Sun's place in your sky changes through the day (it rises, climbs to the meridian, and sets) and through the year (its noon height and rising point drift with the seasons). This <strong>celestial-sphere horizon diagram</strong> shows both at once for a stick-figure observer.</p>" +
        "<p>Drag the <strong>day of year</strong>, <strong>time of day</strong> and <strong>latitude</strong> sliders, or press play to animate. The <strong>celestial equator</strong> is fixed; the <strong>ecliptic</strong> is the Sun's yearly path; the Sun's own <strong>diurnal path</strong> is the circle it traces on any single day.</p>" +
        "<p>Turn on the <strong>analemma</strong> to see the figure-8 the Sun makes if photographed at the same clock time all year — it comes from Earth's axial tilt and its elliptical orbit (the <em>equation of time</em>). At the equator the noon Sun can pass overhead; beyond the polar circles it can stay up or down for 24 hours.</p>",
    id: "<p>Posisi Matahari di langit berubah sepanjang hari (terbit, naik ke meridian, lalu terbenam) dan sepanjang tahun (tinggi tengah harinya dan titik terbitnya bergeser dengan musim). <strong>Diagram horizon bola langit</strong> ini menampilkan keduanya sekaligus untuk pengamat.</p>" +
        "<p>Geser penggeser <strong>hari</strong>, <strong>waktu</strong>, dan <strong>lintang</strong>, atau tekan putar untuk menganimasikan. <strong>Ekuator langit</strong> tetap; <strong>ekliptika</strong> adalah lintasan tahunan Matahari; <strong>lintasan harian</strong> Matahari adalah lingkaran yang ditempuhnya dalam satu hari.</p>" +
        "<p>Aktifkan <strong>analema</strong> untuk melihat angka-8 yang dibentuk Matahari bila difoto pada jam yang sama sepanjang tahun — berasal dari kemiringan sumbu Bumi dan orbit elipsnya (<em>perata waktu</em>). Di ekuator Matahari tengah hari bisa melewati zenit; di luar lingkaran kutub ia bisa tetap di atas atau di bawah horizon selama 24 jam.</p>"
  },
  build: function (S) {
    var C = {
      panel: "#0e1530", border: "#2c3a66", text: "#e8ecf8", dim: "#9fabce",
      accent: "#6ea8fe", warm: "#ffd166", eq: "#7fd1ff", ecl: "#ffd166", diur: "#ffffff", ana: "#b692ff"
    };
    var D2R = Math.PI / 180, R2D = 180 / Math.PI, EPS = 23.44 * D2R;
    var MONTHS = { en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                   id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"] };
    var CUM = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var MLEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /* ---- state (defaults match the original's opening screen) ---- */
    var day = 147, time = 12, lat = 40.8;     // 27 May, noon, 40.8°N
    var mode = "time", speed = 3;

    function wrap(v, m) { return ((v % m) + m) % m; }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function eotMin(d) { var B = 2 * Math.PI * (d - 81) / 364; return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); }
    function monthDay(d) {
      var m = 11; for (var i = 0; i < 12; i++) if (d <= CUM[i] + MLEN[i]) { m = i; break; }
      return { m: m, dd: d - CUM[m] };
    }
    function sky() {
      var lam = (day - 80) / 365.2422 * 360 * D2R;
      var dec = Math.asin(Math.sin(EPS) * Math.sin(lam));
      var ra = Math.atan2(Math.cos(EPS) * Math.sin(lam), Math.cos(lam));
      var raH = wrap(ra * R2D / 15, 24);
      var eot = eotMin(day);
      var haH = (time - 12) + eot / 60;
      var ha = haH * 15 * D2R;
      var lst = wrap(raH + haH, 24);
      return { lam: lam, dec: dec, raH: raH, eot: eot, haH: haH, ha: ha, lst: lst };
    }
    function eq2hor(HA, dec, latR) {
      var sinL = Math.sin(latR), cosL = Math.cos(latR);
      var sinAlt = clamp(sinL * Math.sin(dec) + cosL * Math.cos(dec) * Math.cos(HA), -1, 1);
      var alt = Math.asin(sinAlt), cA = Math.cos(alt) || 1e-6;
      var az = Math.atan2(-Math.cos(dec) * Math.sin(HA) / cA, (Math.sin(dec) - sinL * sinAlt) / (cosL * cA));
      return { alt: alt, az: az };
    }

    /* ---- controls : Time & Location ---- */
    S.group("sm.timeLoc");
    var dayCtl = S.slider({ labelKey: "sm.day", min: 1, max: 365, step: 1, value: day,
      format: function (v) { var md = monthDay(v); return md.dd + " " + MONTHS[I18N.getLang()][md.m]; },
      on: function (v) { day = v; upd(); } });
    var timeCtl = S.slider({ labelKey: "sm.time", min: 0, max: 24, step: 0.05, value: time,
      format: fmtClock, on: function (v) { time = v; upd(); } });
    var latCtl = S.slider({ labelKey: "sm.lat", min: -90, max: 90, step: 0.1, value: lat,
      format: function (v) { return Math.abs(v).toFixed(1) + "° " + I18N.t(v >= 0 ? "dir.N" : "dir.S"); },
      on: function (v) { lat = v; upd(); } });

    /* ---- controls : Animation ---- */
    S.group("sm.anim");
    var dayAcc = 0;
    var loop = S.loop(function (dt) {
      if (mode === "time") { timeCtl.set(wrap(time + speed * dt, 24)); }
      else { dayAcc += speed * dt; while (dayAcc >= 1) { dayAcc -= 1; dayCtl.set(day % 365 + 1); } }
    });
    var playBtn = S.button({ labelKey: "sm.start", primary: true, on: function () { loop.toggle(); syncPlay(); } });
    function syncPlay() { var k = loop.playing ? "sm.pause" : "sm.start"; playBtn.setAttribute("data-i18n", k); playBtn.textContent = I18N.t(k); }
    S.refreshers.push(syncPlay);
    S.slider({ labelKey: "sm.speed", min: 1, max: 20, step: 0.5, value: speed,
      format: function (v) { return v.toFixed(1) + (mode === "time" ? " hr/s" : " d/s"); }, on: function (v) { speed = v; } });
    S.select({ labelKey: "sm.mode", value: mode, on: function (v) { mode = v; },
      options: [{ v: "time", labelKey: "sm.modeTime" }, { v: "day", labelKey: "sm.modeDay" }] });

    /* ---- controls : Settings ---- */
    S.group("sm.settings");
    var optEq = S.toggle({ labelKey: "sm.eq", value: true });
    var optEcl = S.toggle({ labelKey: "sm.ecl", value: true });
    var optDiur = S.toggle({ labelKey: "sm.diur", value: true });
    var optShadow = S.toggle({ labelKey: "sm.shadow", value: true });
    var optAna = S.toggle({ labelKey: "sm.analemma", value: false });

    /* ---- readouts (the Information panel) ---- */
    var oAlt = S.readout({ labelKey: "sm.alt" }), oAz = S.readout({ labelKey: "sm.az" });
    var oDec = S.readout({ labelKey: "sm.dec" }), oRA = S.readout({ labelKey: "sm.ra" });
    var oHA = S.readout({ labelKey: "sm.ha" }), oLST = S.readout({ labelKey: "sm.lst" });
    var oEoT = S.readout({ labelKey: "sm.eot" });

    function fmtClock(v) { var h = Math.floor(v), m = Math.round((v - h) * 60); if (m === 60) { m = 0; h = (h + 1) % 24; } return ((h < 10 ? "0" : "") + h) + ":" + (m < 10 ? "0" : "") + m; }
    function fmtHM(hours, signed) {
      var s = hours < 0 ? "−" : (signed ? "+" : ""); var a = Math.abs(hours);
      var h = Math.floor(a), m = Math.round((a - h) * 60); if (m === 60) { m = 0; h++; }
      return s + h + "h " + (m < 10 ? "0" : "") + m + "m";
    }
    function fmtEoT(min) { var s = min < 0 ? "−" : ""; var a = Math.abs(min); var m = Math.floor(a), sec = Math.round((a - m) * 60); if (sec === 60) { sec = 0; m++; } return s + m + ":" + (sec < 10 ? "0" : "") + sec; }

    function upd() {
      var k = sky(), h = eq2hor(k.ha, k.dec, lat * D2R);
      oAlt((h.alt * R2D).toFixed(1) + "°");
      oAz(wrap(h.az * R2D, 360).toFixed(1) + "°");
      oDec((k.dec * R2D).toFixed(1) + "°");
      oRA(fmtHM(k.raH));
      oHA(fmtHM(k.haH, true));
      oLST(fmtHM(k.lst));
      oEoT(fmtEoT(k.eot) + " min");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ===================== celestial-sphere drawing ===================== */
    var SCx = 340, SCy = 330, R = 232, TILT = 22 * D2R;
    var sinB = Math.sin(TILT), cosB = Math.cos(TILT), rx = R, ry = R * sinB;
    function projVec(E, N, U) { return { x: SCx - R * E, y: SCy - R * (U * cosB - N * sinB) }; }
    function project(alt, az) { var c = Math.cos(alt); return projVec(c * Math.sin(az), c * Math.cos(az), Math.sin(alt)); }

    function curve(pts, col, w) {     // pts: [{alt,az}] — solid above horizon, faint below
      var ctx = S.ctx;
      for (var seg = 0; seg < 2; seg++) {
        ctx.beginPath(); var pen = false;
        for (var i = 0; i < pts.length; i++) {
          if ((pts[i].alt >= 0) !== (seg === 0)) { pen = false; continue; }
          var p = project(pts[i].alt, pts[i].az);
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.strokeStyle = col; ctx.lineWidth = seg === 0 ? w : 1;
        ctx.globalAlpha = seg === 0 ? 1 : 0.22; ctx.stroke(); ctx.globalAlpha = 1;
      }
    }

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      var k = sky(), latR = lat * D2R;
      var sun = eq2hor(k.ha, k.dec, latR);
      var night = sun.alt < -0.105, twilight = !night && sun.alt < 0.105;

      // caption
      var md = monthDay(day), lang = I18N.getLang();
      ctx.fillStyle = C.dim; ctx.font = "12px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("sm.captAt") + " " + Math.abs(lat).toFixed(1) + "° " + I18N.t(lat >= 0 ? "dir.N" : "dir.S") +
        " " + I18N.t("sm.on") + " " + md.dd + " " + MONTHS[lang][md.m] + " " + I18N.t("sm.at") + " " + fmtClock(time), SCx, 22);

      ctx.save(); ctx.beginPath(); ctx.arc(SCx, SCy, R + 2, 0, 2 * Math.PI); ctx.clip();

      // sky dome (upper hemisphere)
      var skyTop = night ? "#0b1733" : twilight ? "#3a2f63" : "#5b9bd8";
      var skyHor = night ? "#16244a" : twilight ? "#c8794a" : "#cfe2f5";
      ctx.beginPath(); ctx.arc(SCx, SCy, R, Math.PI, 2 * Math.PI, false);
      ctx.ellipse(SCx, SCy, rx, ry, 0, 2 * Math.PI, Math.PI, true); ctx.closePath();
      var sg = ctx.createLinearGradient(0, SCy - R, 0, SCy + ry);
      sg.addColorStop(0, skyTop); sg.addColorStop(1, skyHor); ctx.fillStyle = sg; ctx.fill();

      // underside (lower hemisphere) dark
      ctx.beginPath(); ctx.arc(SCx, SCy, R, 0, Math.PI, false);
      ctx.ellipse(SCx, SCy, rx, ry, 0, Math.PI, 0, true); ctx.closePath();
      ctx.fillStyle = "#060a16"; ctx.fill();

      // great circles
      var i;
      if (optEq.value()) { var eqp = []; for (i = 0; i <= 360; i += 3) eqp.push(eq2hor(i * D2R, 0, latR)); curve(eqp, C.eq, 1.4); }
      if (optDiur.value()) { var dp = []; for (i = 0; i <= 360; i += 3) dp.push(eq2hor(i * D2R, k.dec, latR)); curve(dp, C.diur, 1.4); }
      if (optEcl.value()) {
        var ep = [];
        for (i = 0; i <= 360; i += 3) {
          var lam = i * D2R, dec = Math.asin(Math.sin(EPS) * Math.sin(lam));
          var ra = wrap(Math.atan2(Math.cos(EPS) * Math.sin(lam), Math.cos(lam)) * R2D / 15, 24);
          ep.push(eq2hor((k.lst - ra) * 15 * D2R, dec, latR));
        }
        curve(ep, C.ecl, 1.6);
      }
      if (optAna.value()) {
        var ap = [];
        for (i = 0; i <= 365; i += 3) {
          var lm = (i - 80) / 365.2422 * 360 * D2R, dc = Math.asin(Math.sin(EPS) * Math.sin(lm));
          ap.push(eq2hor(((time - 12) + eotMin(i) / 60) * 15 * D2R, dc, latR));
        }
        curve(ap, C.ana, 1.4);
      }

      // horizon plane (translucent green, drawn over the lower paths for depth)
      ctx.beginPath(); ctx.ellipse(SCx, SCy, rx, ry, 0, 0, 2 * Math.PI);
      var gg = ctx.createLinearGradient(0, SCy - ry, 0, SCy + ry);
      gg.addColorStop(0, night ? "#16301f" : "#3f8a45"); gg.addColorStop(1, night ? "#0e2014" : "#2c6a36");
      ctx.fillStyle = gg; ctx.globalAlpha = 0.82; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();

      // sphere outline
      ctx.strokeStyle = C.border; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(SCx, SCy, R, 0, 2 * Math.PI); ctx.stroke();

      // NCP marker
      var ncp = project(latR, 0);
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ncp.x - 4, ncp.y); ctx.lineTo(ncp.x + 4, ncp.y); ctx.moveTo(ncp.x, ncp.y - 4); ctx.lineTo(ncp.x, ncp.y + 4); ctx.stroke();

      // stickfigure shadow
      if (optShadow.value() && sun.alt > 0.02) {
        var az2 = sun.az + Math.PI, rho = clamp(0.42 / Math.tan(sun.alt), 0, 0.92);
        var spS = projVec(rho * Math.sin(az2), rho * Math.cos(az2), 0);
        ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(SCx, SCy); ctx.lineTo(spS.x, spS.y); ctx.stroke(); ctx.lineCap = "butt";
      }

      // the Sun
      var sp2 = project(sun.alt, sun.az);
      ctx.save(); if (sun.alt < 0) ctx.globalAlpha = 0.3;
      var g = ctx.createRadialGradient(sp2.x, sp2.y, 1, sp2.x, sp2.y, 16);
      g.addColorStop(0, "#fff6cf"); g.addColorStop(1, C.warm);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sp2.x, sp2.y, 10, 0, 2 * Math.PI); ctx.fill(); ctx.restore();

      // observer
      stick(ctx, SCx, SCy);

      // cardinals
      ctx.fillStyle = "#eaf2ff"; ctx.font = "bold 12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(I18N.t("dir.S"), SCx, SCy - ry - 10);
      ctx.fillText(I18N.t("dir.N"), SCx, SCy + ry + 11);
      ctx.fillText(I18N.t("dir.E"), SCx - R - 11, SCy);
      ctx.fillText(I18N.t("dir.W"), SCx + R + 11, SCy);
      ctx.textBaseline = "alphabetic";

      // legend
      var lx = 16, ly = S.H - 70;
      if (optEcl.value()) { legend(ctx, lx, ly, C.ecl, stripShow("sm.ecl")); }
      if (optEq.value()) { legend(ctx, lx, ly + 18, C.eq, stripShow("sm.eq")); }
      if (optDiur.value()) { legend(ctx, lx, ly + 36, C.diur, stripShow("sm.diur")); }
    });

    upd();

    function stripShow(key) { return I18N.t(key).replace(/^show (the )?/, "").replace(/^tampilkan /, ""); }
    function legend(ctx, x, y, col, label) {
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 22, y); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(label, x + 28, y); ctx.textBaseline = "alphabetic";
    }
    function stick(ctx, x, baseY) {
      var top = baseY - 18;
      ctx.fillStyle = "#0d1430"; ctx.beginPath(); ctx.arc(x, top, 3.2, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "#0d1430"; ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, top + 3); ctx.lineTo(x, baseY - 6);
      ctx.moveTo(x - 5, top + 7); ctx.lineTo(x + 5, top + 7);
      ctx.moveTo(x, baseY - 6); ctx.lineTo(x - 4, baseY);
      ctx.moveTo(x, baseY - 6); ctx.lineTo(x + 4, baseY);
      ctx.stroke(); ctx.lineCap = "butt";
    }
  }
});
