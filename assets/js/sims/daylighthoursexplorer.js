/* Daylight Hours Explorer ------------------------------------------------------
   Faithful rebuild of the ClassAction "Daylight Hours Explorer"
   (daylighthoursexplorer.swf):
     • a year-long plot of daylight hours for a chosen latitude — yellow daytime area
       under the curve, grey night above, season markers (equinoxes/solstices) and
       month labels, with a draggable point that reads off the hours on any date,
     • a latitude slider and a day-of-year slider,
     • a globe panel showing the observer's latitude circle and the day/night line,
     • options to show the yearly-average line and the draggable point.
   Daylight from  cos H = −tan φ · tan δ,  with δ = 23.44°·sin(2π·d / 365.25).        */
Sim.create({
  id: "daylighthoursexplorer",
  width: 760, height: 470,
  strings: {
    en: {
      "dh.set": "Settings", "dh.lat": "latitude", "dh.day": "day of year",
      "dh.opt": "Options", "dh.avg": "show yearly average", "dh.pt": "show point on curve",
      "dh.rh": "daylight hours", "dh.rdate": "date", "dh.rdec": "Sun's declination", "dh.ravg": "yearly average"
    },
    id: {
      "dh.set": "Pengaturan", "dh.lat": "lintang", "dh.day": "hari ke-",
      "dh.opt": "Opsi", "dh.avg": "tampilkan rata-rata tahunan", "dh.pt": "tampilkan titik pada kurva",
      "dh.rh": "jam siang", "dh.rdate": "tanggal", "dh.rdec": "deklinasi Matahari", "dh.ravg": "rata-rata tahunan"
    }
  },
  about: {
    en: "<p>The number of daylight hours changes through the year because the Earth's axis is tilted 23.4°. As the Sun's declination swings from +23.4° (June solstice) to −23.4° (December solstice), an observer's days lengthen and shorten — and the effect grows with latitude.</p>" +
        "<p>At the equator every day is ≈12 hours. At 41° N midsummer days run past 15 hours; above the Arctic Circle the curve hits 24 (midnight Sun) or 0 (polar night). The yearly average is 12 hours everywhere.</p>" +
        "<p>Drag the point along the curve, or change the latitude, and watch the globe's day/night line tilt with the seasons.</p>",
    id: "<p>Jumlah jam siang berubah sepanjang tahun karena sumbu Bumi miring 23,4°. Saat deklinasi Matahari berayun dari +23,4° (solstis Juni) ke −23,4° (solstis Desember), hari seorang pengamat memanjang dan memendek — dan efeknya membesar dengan lintang.</p>" +
        "<p>Di khatulistiwa setiap hari ≈12 jam. Pada 41° LU hari pertengahan musim panas lebih dari 15 jam; di atas Lingkar Arktik kurva mencapai 24 (Matahari tengah malam) atau 0 (malam kutub). Rata-rata tahunan 12 jam di mana saja.</p>" +
        "<p>Seret titik di sepanjang kurva, atau ubah lintang, dan amati garis siang/malam globe miring mengikuti musim.</p>"
  },
  build: function (S) {
    var RAD = Math.PI / 180, YEAR = 365.25;
    var P = { lat: 41, d: 43 };           // 41°N, day 43 after vernal equinox = May 2
    var MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var FIRST = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];   // first day-of-year per month (non-leap)
    var VE = 79;                          // vernal equinox ≈ day-of-year 79 (Mar 20)

    function decl(d) { return 23.44 * Math.sin(2 * Math.PI * d / YEAR); }
    function daylight(lat, d) {            // hours
      var dr = decl(d) * RAD, c = -Math.tan(lat * RAD) * Math.tan(dr);
      if (c <= -1) return 24; if (c >= 1) return 0;
      return 24 * Math.acos(c) / Math.PI;
    }
    function doyFromD(d) { return ((Math.round(d) + VE - 1) % 365 + 365) % 365 + 1; }
    function dateStr(d) {
      var doy = doyFromD(d), m = 11; while (m > 0 && FIRST[m] > doy) m--;
      return MONTH[m] + " " + (doy - FIRST[m] + 1);
    }
    var yearlyAvg = (function () { var s = 0, n = 0; for (var d = 0; d < YEAR; d += 1) { s += daylight(P.lat, d); n++; } return s / n; })();

    /* ---------- controls ---------- */
    S.group("dh.set");
    var latC = S.slider({ labelKey: "dh.lat", min: -90, max: 90, step: 1, value: P.lat,
      format: function (v) { return Math.abs(v) + "°" + (v >= 0 ? " N" : " S"); }, on: function (v) { P.lat = v; recompAvg(); upd(); } });
    var dayC = S.slider({ labelKey: "dh.day", min: 0, max: 364, step: 1, value: P.d,
      format: function (v) { return dateStr(v); }, on: function (v) { P.d = v; upd(); } });

    S.group("dh.opt");
    var optAvg = S.toggle({ labelKey: "dh.avg", value: false });
    var optPt = S.toggle({ labelKey: "dh.pt", value: true });

    var oH = S.readout({ labelKey: "dh.rh" });
    var oDate = S.readout({ labelKey: "dh.rdate" });
    var oDec = S.readout({ labelKey: "dh.rdec" });
    var oAvg = S.readout({ labelKey: "dh.ravg" });

    function recompAvg() { var s = 0, n = 0; for (var d = 0; d < YEAR; d += 1) { s += daylight(P.lat, d); n++; } yearlyAvg = s / n; }
    function upd() {
      oH(daylight(P.lat, P.d).toFixed(1) + " h");
      oDate(dateStr(P.d));
      oDec((decl(P.d) >= 0 ? "+" : "") + decl(P.d).toFixed(1) + "°");
      oAvg(yearlyAvg.toFixed(1) + " h");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---------- graph geometry + drag ---------- */
    var GR = { x: 64, y: 64, w: 432, h: 320 };   // plot rectangle (inside left panel)
    function xForD(d) { return GR.x + (d / YEAR) * GR.w; }
    function dForX(x) { return Math.max(0, Math.min(364, (x - GR.x) / GR.w * YEAR)); }
    function yForH(h) { return GR.y + (1 - h / 24) * GR.h; }

    function localXY(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    var dragging = false;
    S.canvas.addEventListener("pointerdown", function (ev) { var m = localXY(ev); if (m.x > GR.x - 14 && m.x < GR.x + GR.w + 8 && m.y > GR.y - 8 && m.y < GR.y + GR.h + 14) { dragging = true; S.canvas.setPointerCapture(ev.pointerId); P.d = Math.round(dForX(m.x)); dayC.set(P.d); } });
    S.canvas.addEventListener("pointermove", function (ev) { if (!dragging) return; P.d = Math.round(dForX(localXY(ev).x)); dayC.set(P.d); });
    S.canvas.addEventListener("pointerup", function () { dragging = false; });

    /* ---------- drawing ---------- */
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 10, y: 8, w: 510, h: 454 }, "");
      panel(ctx, { x: 530, y: 8, w: 220, h: 454 }, "GLOBE");
      graph(ctx);
      globe(ctx, 640, 200, 92, P.lat, decl(P.d));
      caption(ctx);
    });

    function graph(ctx) {
      ctx.save();
      // title
      ctx.fillStyle = "#cfe0ff"; ctx.font = "700 14px system-ui"; ctx.textAlign = "center";
      ctx.fillText("Hours of Daylight at " + Math.abs(P.lat) + "° " + (P.lat >= 0 ? "N" : "S"), GR.x + GR.w / 2, GR.y - 40);
      // night (grey) background, day (yellow) below the curve
      ctx.fillStyle = "rgba(150,160,180,0.30)"; ctx.fillRect(GR.x, GR.y, GR.w, GR.h);
      ctx.beginPath(); ctx.moveTo(GR.x, GR.y + GR.h);
      for (var px = 0; px <= GR.w; px++) { var d = (px / GR.w) * YEAR; ctx.lineTo(GR.x + px, yForH(daylight(P.lat, d))); }
      ctx.lineTo(GR.x + GR.w, GR.y + GR.h); ctx.closePath();
      ctx.fillStyle = "rgba(245,225,120,0.45)"; ctx.fill();
      // curve
      ctx.beginPath();
      for (var qx = 0; qx <= GR.w; qx++) { var dd = (qx / GR.w) * YEAR; var yy = yForH(daylight(P.lat, dd)); qx ? ctx.lineTo(GR.x + qx, yy) : ctx.moveTo(GR.x + qx, yy); }
      ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 2; ctx.stroke();
      // axes box
      ctx.strokeStyle = "#3a4a72"; ctx.lineWidth = 1; ctx.strokeRect(GR.x, GR.y, GR.w, GR.h);
      // y ticks
      ctx.fillStyle = "#9fb0d0"; ctx.font = "11px system-ui"; ctx.textAlign = "right";
      [0, 6, 12, 18, 24].forEach(function (h) { var yy = yForH(h); ctx.fillText(h + "", GR.x - 8, yy + 4); ctx.strokeStyle = "rgba(120,140,180,0.18)"; ctx.beginPath(); ctx.moveTo(GR.x, yy); ctx.lineTo(GR.x + GR.w, yy); ctx.stroke(); });
      ctx.save(); ctx.translate(GR.x - 40, GR.y + GR.h / 2); ctx.rotate(-Math.PI / 2); ctx.fillStyle = "#9fb0d0"; ctx.textAlign = "center"; ctx.fillText("Daylight Hours", 0, 0); ctx.restore();
      // season markers (top)
      var seasons = [[0, "vernal\nequinox"], [YEAR / 4, "summer\nsolstice"], [YEAR / 2, "autumnal\nequinox"], [3 * YEAR / 4, "winter\nsolstice"]];
      ctx.textAlign = "center"; ctx.font = "italic 10px system-ui";
      seasons.forEach(function (s) {
        var x = xForD(s[0]); if (x > GR.x + GR.w - 2) return;
        ctx.strokeStyle = "rgba(150,170,210,0.4)"; ctx.beginPath(); ctx.moveTo(x, GR.y); ctx.lineTo(x, GR.y - 6); ctx.stroke();
        ctx.fillStyle = "#8fa0c4"; s[1].split("\n").forEach(function (ln, i) { ctx.fillText(ln, x, GR.y - 20 + i * 11); });
      });
      // month labels (bottom)
      ctx.font = "10px system-ui"; ctx.fillStyle = "#9fb0d0";
      for (var m = 0; m < 12; m++) { var d = ((FIRST[m] - VE) % 365 + 365) % 365; var x = xForD(d); if (x < GR.x + 4 || x > GR.x + GR.w - 4) continue; ctx.fillText(MONTH[m], x, GR.y + GR.h + 16); }
      ctx.fillText("Day of Year", GR.x + GR.w / 2, GR.y + GR.h + 34);
      // yearly average
      if (optAvg.value()) {
        var ya = yForH(yearlyAvg); ctx.strokeStyle = "rgba(120,210,140,0.8)"; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(GR.x, ya); ctx.lineTo(GR.x + GR.w, ya); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#7fd79a"; ctx.textAlign = "left"; ctx.fillText("avg " + yearlyAvg.toFixed(1) + " h", GR.x + 6, ya - 4);
      }
      // draggable point + crosshair
      if (optPt.value()) {
        var h = daylight(P.lat, P.d), x = xForD(P.d), y = yForH(h);
        ctx.strokeStyle = "rgba(255,120,120,0.8)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, GR.y + GR.h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(GR.x, y); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#ff5a5a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
        // hour bubble
        bubble(ctx, GR.x - 30, y, h.toFixed(1));
        // date bubble
        bubble(ctx, x, GR.y + GR.h + 30, dateStr(P.d));
      }
      ctx.restore();
    }
    function bubble(ctx, x, y, text) {
      ctx.font = "700 11px system-ui"; ctx.textAlign = "center"; var w = ctx.measureText(text).width + 14;
      ctx.fillStyle = "#15203f"; ctx.strokeStyle = "#ff7a7a"; ctx.lineWidth = 1.5;
      roundRect(ctx, x - w / 2, y - 9, w, 18, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffd9d9"; ctx.fillText(text, x, y + 4);
    }

    function globe(ctx, cx, cy, r, phi, dec) {
      // ocean sphere
      var g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.2, cx, cy, r);
      g.addColorStop(0, "#5b86c4"); g.addColorStop(1, "#27406e");
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.clip();
      ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      // night side: half-plane away from the Sun (Sun toward upper-right by declination)
      var sx = Math.cos(dec * RAD), sy = -Math.sin(dec * RAD);         // Sun direction in view (y down)
      var perpx = -sy, perpy = sx, big = r * 2.4;
      ctx.fillStyle = "rgba(6,10,26,0.62)";
      ctx.beginPath();
      ctx.moveTo(cx + perpx * big, cy + perpy * big);
      ctx.lineTo(cx - perpx * big, cy - perpy * big);
      ctx.lineTo(cx - perpx * big - sx * big, cy - perpy * big - sy * big);
      ctx.lineTo(cx + perpx * big - sx * big, cy + perpy * big - sy * big);
      ctx.closePath(); ctx.fill();
      // equator + latitude rings
      ring(ctx, cx, cy, r, 0, "rgba(120,220,150,0.85)", 1.5);
      ring(ctx, cx, cy, r, phi, "#ffe14d", 2.5);
      ctx.restore();
      // outline + axis
      ctx.strokeStyle = "#9fb0d0"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke();
      ctx.strokeStyle = "rgba(200,210,235,0.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, cy - r - 10); ctx.lineTo(cx, cy + r + 10); ctx.stroke();
      // observer dot at noon-ish on the latitude ring (right/lit side)
      var oy = cy - r * Math.sin(phi * RAD), ox = cx + r * Math.cos(phi * RAD) * 0.62;
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ox, oy, 3, 0, 2 * Math.PI); ctx.fill();
    }
    function ring(ctx, cx, cy, r, phi, col, w) {       // latitude circle in side view (orthographic)
      var yy = cy - r * Math.sin(phi * RAD), rx = r * Math.cos(phi * RAD), ry = rx * 0.16;
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.ellipse(cx, yy, rx, ry, 0, 0, 2 * Math.PI); ctx.stroke();
    }

    function caption(ctx) {
      var h = daylight(P.lat, P.d);
      ctx.fillStyle = "#cfd8ee"; ctx.font = "12px system-ui"; ctx.textAlign = "center";
      var lines = ["an observer at " + Math.abs(P.lat) + "° " + (P.lat >= 0 ? "N" : "S"), "receives " + h.toFixed(1) + " hours of", "daylight on " + dateStr(P.d)];
      lines.forEach(function (ln, i) { ctx.fillText(ln, 640, 330 + i * 18); });
      ctx.fillStyle = "#7d8cb0"; ctx.font = "11px system-ui";
      ctx.fillText("Sun's declination " + (decl(P.d) >= 0 ? "+" : "") + decl(P.d).toFixed(1) + "°", 640, 396);
    }

    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      if (title) { ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title, r.x + 14, r.y + 20); }
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    upd();
  }
});
