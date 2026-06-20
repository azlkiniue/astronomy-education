/* Motions of the Sun — daily path across the sky --------------------------- */
Sim.create({
  id: "sun-motions",
  width: 760, height: 470,
  strings: {
    en: {
      "sm.place": "Place & date", "sm.lat": "Latitude", "sm.day": "Day of year", "sm.hour": "Time of day",
      "sm.anim": "Animation",
      "sm.alt": "Sun altitude", "sm.az": "Sun azimuth", "sm.rise": "Sunrise", "sm.set": "Sunset",
      "sm.daylen": "Daylight", "sm.noon": "Noon altitude",
      "sm.below": "below horizon", "sm.season": "Season"
    },
    id: {
      "sm.place": "Tempat & tanggal", "sm.lat": "Lintang", "sm.day": "Hari ke-", "sm.hour": "Waktu",
      "sm.anim": "Animasi",
      "sm.alt": "Altitud Matahari", "sm.az": "Azimut Matahari", "sm.rise": "Terbit", "sm.set": "Terbenam",
      "sm.daylen": "Lama siang", "sm.noon": "Altitud tengah hari",
      "sm.below": "di bawah ufuk", "sm.season": "Musim"
    }
  },
  about: {
    en: "<p>The Sun's track across your sky changes with your <strong>latitude</strong> and the <strong>date</strong>. " +
        "The chart plots the Sun's altitude (height above the horizon) against its azimuth (compass direction) for the whole day; " +
        "the shaded band below the line is night.</p>" +
        "<p>The date sets the Sun's <strong>declination</strong> — from +23.4° at the June solstice to −23.4° in December. " +
        "Higher declination in summer lifts the Sun's whole arc, lengthening daylight and raising noon higher; in winter the arc sinks and days shorten. " +
        "At the equator the Sun climbs nearly straight up; near the poles it can circle without setting.</p>",
    id: "<p>Lintasan Matahari di langit Anda berubah menurut <strong>lintang</strong> dan <strong>tanggal</strong>. " +
        "Bagan ini memplot altitud Matahari (tinggi di atas ufuk) terhadap azimutnya (arah kompas) sepanjang hari; " +
        "pita gelap di bawah garis adalah malam.</p>" +
        "<p>Tanggal menentukan <strong>deklinasi</strong> Matahari — dari +23,4° pada titik balik Juni hingga −23,4° pada Desember. " +
        "Deklinasi lebih tinggi saat musim panas mengangkat seluruh busur Matahari, memperpanjang siang dan meninggikan tengah hari; saat musim dingin busur turun dan hari memendek. " +
        "Di khatulistiwa Matahari naik hampir tegak lurus; dekat kutub ia bisa berputar tanpa terbenam.</p>"
  },
  build: function (S) {
    var lat = 40, day = 172, hour = 12;     // June solstice-ish
    var loop = S.loop(function (dt) { hour = (hour + dt * 2) % 24; hourCtl.set(hour); });

    S.group("sm.place");
    S.slider({ labelKey: "sm.lat", min: -90, max: 90, value: lat, step: 1, format: function (v) { return v + "° " + (v >= 0 ? "N" : "S"); }, on: function (v) { lat = v; upd(); } });
    S.slider({ labelKey: "sm.day", min: 1, max: 365, value: day, step: 1, format: fmtDate, on: function (v) { day = v; upd(); } });
    var hourCtl = S.slider({ labelKey: "sm.hour", min: 0, max: 24, value: hour, step: 0.1, format: fmtHour, on: function (v) { hour = v; upd(); } });
    S.group("sm.anim");
    S.playPause(loop);

    var outAlt = S.readout({ labelKey: "sm.alt" });
    var outAz = S.readout({ labelKey: "sm.az" });
    var outNoon = S.readout({ labelKey: "sm.noon" });
    var outDay = S.readout({ labelKey: "sm.daylen" });
    var outRise = S.readout({ labelKey: "sm.rise" });
    var outSet = S.readout({ labelKey: "sm.set" });

    function decl() { return 23.44 * Math.sin(2 * Math.PI * (day - 81) / 365.24) * Math.PI / 180; }
    function rad(d) { return d * Math.PI / 180; }
    function altAz(h) {       // h = hour
      var H = rad(15 * (h - 12)), d = decl(), phi = rad(lat);
      var sinAlt = Math.sin(phi) * Math.sin(d) + Math.cos(phi) * Math.cos(d) * Math.cos(H);
      var alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
      var cosA = (Math.sin(d) - Math.sin(phi) * Math.sin(alt)) / (Math.cos(phi) * Math.cos(alt) || 1e-6);
      var A = Math.acos(Math.max(-1, Math.min(1, cosA)));
      var az = (H > 0) ? (2 * Math.PI - A) : A;     // morning east, afternoon west
      return { alt: alt * 180 / Math.PI, az: az * 180 / Math.PI };
    }
    function dayLength() {
      var d = decl(), phi = rad(lat), x = -Math.tan(phi) * Math.tan(d);
      if (x <= -1) return 24; if (x >= 1) return 0;
      return 2 * Math.acos(x) * 180 / Math.PI / 15;
    }

    function upd() {
      var s = altAz(hour);
      outAlt(s.alt.toFixed(1) + "°" + (s.alt < 0 ? " (" + I18N.t("sm.below") + ")" : ""));
      outAz(s.az.toFixed(0) + "° " + compass(s.az));
      outNoon(altAz(12).alt.toFixed(1) + "°");
      var dl = dayLength();
      outDay(Math.floor(dl) + "h " + Math.round((dl % 1) * 60) + "m");
      if (dl <= 0) { outRise("—"); outSet("—"); }
      else if (dl >= 24) { outRise("—"); outSet("—"); }
      else { outRise(fmtHour(12 - dl / 2)); outSet(fmtHour(12 + dl / 2)); }
      S.requestDraw();
    }
    window.addEventListener("langchange", upd);

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var x0 = 50, x1 = W - 20, y0 = H - 40, y1 = 30;
      function xOf(az) { return x0 + az / 360 * (x1 - x0); }
      function yOf(alt) { return y0 - (alt + 18) / (90 + 18) * (y0 - y1); }   // show down to -18

      // sky gradient above horizon / ground below
      var horizonY = yOf(0);
      var g = ctx.createLinearGradient(0, y1, 0, horizonY);
      g.addColorStop(0, "#0a1840"); g.addColorStop(1, "#274a86");
      ctx.fillStyle = g; ctx.fillRect(x0, y1, x1 - x0, horizonY - y1);
      ctx.fillStyle = "#0a0d18"; ctx.fillRect(x0, horizonY, x1 - x0, y0 - horizonY);

      // grid: azimuth compass
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.strokeStyle = "#26334f";
      [["N", 0], ["E", 90], ["S", 180], ["W", 270], ["N", 360]].forEach(function (c) {
        var gx = xOf(c[1]); ctx.beginPath(); ctx.moveTo(gx, y1); ctx.lineTo(gx, y0); ctx.stroke();
        ctx.fillText(c[0], gx, y0 + 14);
      });
      // altitude lines
      ctx.textAlign = "right";
      [0, 30, 60, 90].forEach(function (al) { var gy = yOf(al); ctx.strokeStyle = al === 0 ? "#5b78c4" : "#26334f"; ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, gy); ctx.stroke(); ctx.fillStyle = "#9fabce"; ctx.fillText(al + "°", x0 - 4, gy + 3); });

      // Sun's path for the day
      ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 2; ctx.beginPath();
      var started = false;
      for (var h = 0; h <= 24; h += 0.1) {
        var s = altAz(h);
        if (s.alt < -18) { started = false; continue; }
        var X = xOf(s.az), Y = yOf(s.alt);
        if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
      }
      ctx.stroke();

      // current Sun
      var cur = altAz(hour);
      var sx = xOf(cur.az), sy = yOf(cur.alt);
      var gg = ctx.createRadialGradient(sx, sy, 1, sx, sy, 14);
      gg.addColorStop(0, "#fff"); gg.addColorStop(0.5, "#ffd166"); gg.addColorStop(1, "rgba(255,209,102,0)");
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(sx, sy, 14, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = cur.alt >= 0 ? "#fff" : "#888"; ctx.beginPath(); ctx.arc(sx, sy, 6, 0, 2 * Math.PI); ctx.fill();

      ctx.fillStyle = "#9fabce"; ctx.textAlign = "center";
      ctx.fillText(I18N.getLang() === "id" ? "azimut (arah kompas)" : "azimuth (compass direction)", (x0 + x1) / 2, H - 6);
    });

    upd();

    function compass(az) { return ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"][Math.round(az / 45)]; }
    function fmtHour(h) { h = (h + 24) % 24; var hh = Math.floor(h), mm = Math.round((h - hh) * 60); if (mm === 60) { mm = 0; hh++; } return (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm; }
    function fmtDate(d) {
      var months = I18N.getLang() === "id"
        ? ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var cum = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
      for (var m = 0; m < 12; m++) if (d <= cum[m + 1]) return (d - cum[m]) + " " + months[m];
      return d + "";
    }
  }
});
