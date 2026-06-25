/* Sun's Rays Simulator --------------------------------------------------------
   Faithful rebuild of the ClassAction "Sun's Rays Simulator" (sunsrays.swf).
   Parallel sunlight arrives horizontally from the left. Earth is shown from the
   side with its rotation axis tilted by the season, so the latitude where the
   rays strike most directly (perpendicular to the surface — the sub-solar point)
   swings between the Tropic of Cancer (+23.4°, June solstice) and the Tropic of
   Capricorn (−23.4°, December solstice), passing the equator at the equinoxes.
   A readout reports that latitude; another shows the date / season. Press Start
   (or drag the day slider) to run through the year.                             */
Sim.create({
  id: "sunsrays",
  width: 760, height: 470,
  strings: {
    en: {
      "sr.day": "day of year", "sr.speed": "animation speed", "sr.labels": "latitude labels",
      "sr.rDir": "direct rays hit at", "sr.rDate": "date", "sr.rSeason": "season", "sr.rDecl": "Sun's declination"
    },
    id: {
      "sr.day": "hari ke-", "sr.speed": "kecepatan animasi", "sr.labels": "label lintang",
      "sr.rDir": "sinar langsung mengenai", "sr.rDate": "tanggal", "sr.rSeason": "musim", "sr.rDecl": "deklinasi Matahari"
    }
  },
  about: {
    en: "<p>Sunlight reaches Earth as essentially <strong>parallel rays</strong>. Where those rays strike the ground <em>straight on</em>, their energy is concentrated and that spot is warmest — the <strong>most direct</strong> point. Near the poles the same rays graze the surface and spread out — the <strong>least direct</strong>.</p>" +
        "<p>Because Earth's axis is tilted 23.4°, the most-direct latitude (the <strong>sub-solar point</strong>) moves through the year: up to the Tropic of Cancer in June, down to the Tropic of Capricorn in December, crossing the equator at the equinoxes. That migration — not Earth's changing distance from the Sun — is what makes the seasons.</p>",
    id: "<p>Cahaya Matahari mencapai Bumi sebagai <strong>sinar sejajar</strong>. Di tempat sinar mengenai tanah <em>tegak lurus</em>, energinya terpusat dan paling hangat — titik <strong>paling langsung</strong>. Dekat kutub sinar yang sama menyerempet permukaan dan menyebar — <strong>paling tidak langsung</strong>.</p>" +
        "<p>Karena sumbu Bumi miring 23,4°, lintang paling-langsung (<strong>titik subsolar</strong>) bergerak sepanjang tahun: naik ke Tropik Cancer pada Juni, turun ke Tropik Capricorn pada Desember, melintasi ekuator saat ekuinoks. Pergerakan itu — bukan perubahan jarak Bumi ke Matahari — yang menyebabkan musim.</p>"
  },
  build: function (S) {
    var OBLIQ = 23.44, YEAR = 365.24, VERNAL = 80;        // vernal equinox ≈ day 80
    var C = { x: 372, y: 214 }, R = 168;
    var P = { day: VERNAL };

    function decl(d) { return OBLIQ * Math.sin(2 * Math.PI * (d - VERNAL) / YEAR); }   // degrees

    var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var MLEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function dateLabel(d) {
      var n = Math.floor(d), m = 0; n = Math.max(1, Math.min(365, n));
      while (m < 11 && n > MLEN[m]) { n -= MLEN[m]; m++; }
      return MONTHS[m] + " " + n;
    }
    function seasonLabel(d) {
      var near = function (a) { var dd = Math.abs(d - a); return Math.min(dd, 365 - dd) < 5; };
      if (near(80)) return "Vernal Equinox";
      if (near(172)) return "Summer Solstice";
      if (near(266)) return "Autumnal Equinox";
      if (near(355)) return "Winter Solstice";
      return "";
    }

    /* ---------- controls ---------- */
    var dayC = S.slider({ labelKey: "sr.day", min: 1, max: 365, step: 1, value: P.day,
      format: function (v) { return dateLabel(v); }, on: function (v) { P.day = v; apply(); } });
    var speedC = S.slider({ labelKey: "sr.speed", min: 5, max: 60, step: 5, value: 20,
      format: function (v) { return v + " d/s"; } });
    var labelsT = S.toggle({ labelKey: "sr.labels", value: true, on: function () { S.requestDraw(); } });

    var oDir = S.readout({ labelKey: "sr.rDir" });
    var oDate = S.readout({ labelKey: "sr.rDate" });
    var oSeason = S.readout({ labelKey: "sr.rSeason" });
    var oDecl = S.readout({ labelKey: "sr.rDecl" });

    function apply() {
      var dl = decl(P.day);
      oDir(fmtLat(dl));
      oDate(dateLabel(P.day));
      var s = seasonLabel(P.day); oSeason(s || "—");
      oDecl((dl >= 0 ? "+" : "") + dl.toFixed(1) + "°");
      S.requestDraw();
    }
    function fmtLat(lat) {
      if (Math.abs(lat) < 0.05) return "the equator  (0.0°)";
      return Math.abs(lat).toFixed(1) + "° " + (lat > 0 ? "N" : "S");
    }
    S.refreshers.push(apply);

    var loop = S.loop(function (dt) {
      P.day += speedC.value() * dt; if (P.day > 365) P.day -= 365; if (P.day < 1) P.day += 365;
      dayC.set(P.day);                 // moves thumb + label, fires apply()
    });
    S.playPause(loop);

    /* ---------- geometry ---------- */
    function nDir(dRad) { return { x: -Math.sin(dRad), y: -Math.cos(dRad) }; }   // toward N pole (screen, y-down)
    function pDir(dRad) { return { x: Math.cos(dRad), y: -Math.sin(dRad) }; }    // along a latitude chord
    function chord(latDeg, dRad) {
      var lat = latDeg * Math.PI / 180, n = nDir(dRad), p = pDir(dRad);
      var cx = C.x + R * Math.sin(lat) * n.x, cy = C.y + R * Math.sin(lat) * n.y, h = R * Math.cos(lat);
      return { a: { x: cx - h * p.x, y: cy - h * p.y }, b: { x: cx + h * p.x, y: cy + h * p.y } };
    }

    /* ---------- drawing ---------- */
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 8, y: 8, w: 744, h: 454 });
      var dRad = decl(P.day) * Math.PI / 180;
      rays(ctx);
      globe(ctx, dRad);
      latitudes(ctx, dRad);
      directMarker(ctx, dRad);
      infoBoxes(ctx);
    });

    function rays(ctx) {
      ctx.strokeStyle = "#ffe14d"; ctx.lineWidth = 2.4;
      var x0 = 22, n = 13;
      for (var i = 0; i < n; i++) {
        var y = C.y - R + 8 + i * (2 * R - 16) / (n - 1);
        var dy = y - C.y, hit = Math.abs(dy) <= R ? C.x - Math.sqrt(R * R - dy * dy) : C.x;
        ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(hit - 1, y); ctx.stroke();
        // arrowhead
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(hit - 1, y); ctx.lineTo(hit - 9, y - 4); ctx.lineTo(hit - 9, y + 4); ctx.closePath(); ctx.fillStyle = "#ffe14d"; ctx.fill();
      }
      ctx.globalAlpha = 1;
      // most/least direct labels
      ctx.font = "700 14px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#cfd8ee"; ctx.fillText("Least Direct", 24, C.y - R - 1);
      ctx.fillStyle = "#ffe14d"; ctx.fillText("Most Direct", 24, C.y - 8);
      ctx.fillStyle = "#cfd8ee"; ctx.fillText("Least Direct", 24, C.y + R + 2);
    }

    function globe(ctx, dRad) {
      ctx.save();
      ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, 2 * Math.PI); ctx.clip();
      // day hemisphere — lit from the left (sub-solar point)
      var g = ctx.createRadialGradient(C.x - R * 0.55, C.y, R * 0.1, C.x - R * 0.2, C.y, R * 1.5);
      g.addColorStop(0, "#5aa6e8"); g.addColorStop(0.5, "#2f74c4"); g.addColorStop(1, "#1b4f8c");
      ctx.fillStyle = g; ctx.fillRect(C.x - R, C.y - R, 2 * R, 2 * R);
      // night hemisphere — right of the vertical terminator
      ctx.fillStyle = "rgba(8,14,30,.82)"; ctx.fillRect(C.x, C.y - R, R, 2 * R);
      // soft terminator shading
      var tg = ctx.createLinearGradient(C.x - 42, 0, C.x + 6, 0);
      tg.addColorStop(0, "rgba(8,14,30,0)"); tg.addColorStop(1, "rgba(8,14,30,.55)");
      ctx.fillStyle = tg; ctx.fillRect(C.x - 42, C.y - R, 48, 2 * R);
      ctx.restore();
      // outline
      ctx.strokeStyle = "#9fb6d8"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, 2 * Math.PI); ctx.stroke();
      // rotation axis (faint)
      var n = nDir(dRad);
      ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(C.x - (R + 16) * n.x, C.y - (R + 16) * n.y); ctx.lineTo(C.x + (R + 16) * n.x, C.y + (R + 16) * n.y); ctx.stroke(); ctx.setLineDash([]);
    }

    function latitudes(ctx, dRad) {
      var lats = [
        { v: 90, k: "NP", c: "#dfe8f7", pt: true }, { v: 66.56, k: "Arctic Circle", c: "#bcd0ef" },
        { v: 23.44, k: "Tropic of Cancer", c: "#ffd98a" }, { v: 0, k: "EQ", c: "#ffffff" },
        { v: -23.44, k: "Tropic of Capricorn", c: "#ffd98a" }, { v: -66.56, k: "Antarctic Circle", c: "#bcd0ef" },
        { v: -90, k: "SP", c: "#dfe8f7", pt: true }
      ];
      ctx.save();
      ctx.beginPath(); ctx.arc(C.x, C.y, R + 1, 0, 2 * Math.PI); ctx.clip();
      lats.forEach(function (L) {
        if (L.pt) return;
        var ch = chord(L.v, dRad);
        ctx.strokeStyle = L.c; ctx.globalAlpha = L.v === 0 ? 0.95 : 0.6; ctx.lineWidth = L.v === 0 ? 2 : 1.4;
        ctx.beginPath(); ctx.moveTo(ch.a.x, ch.a.y); ctx.lineTo(ch.b.x, ch.b.y); ctx.stroke();
      });
      ctx.globalAlpha = 1; ctx.restore();
      // poles as dots
      var n = nDir(dRad);
      [{ s: 1, k: "NP" }, { s: -1, k: "SP" }].forEach(function (q) {
        var x = C.x + q.s * R * n.x, y = C.y + q.s * R * n.y;
        ctx.fillStyle = "#dfe8f7"; ctx.beginPath(); ctx.arc(x, y, 3, 0, 2 * Math.PI); ctx.fill();
      });
      // right-side labels with leaders
      if (!labelsT.value()) return;
      ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      var LX = C.x + R + 26;
      lats.forEach(function (L) {
        var pt, x, y;
        if (L.pt) { var nn = nDir(dRad), s = L.v > 0 ? 1 : -1; x = C.x + s * R * nn.x; y = C.y + s * R * nn.y; }
        else { var ch = chord(L.v, dRad); pt = ch.b.x >= ch.a.x ? ch.b : ch.a; x = pt.x; y = pt.y; }
        ctx.strokeStyle = "rgba(159,176,208,.45)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(LX - 4, y); ctx.stroke();
        ctx.fillStyle = L.c === "#ffffff" ? "#eef2fb" : L.c; ctx.fillText(L.k, LX, y);
      });
    }

    function directMarker(ctx, dRad) {
      var x = C.x - R, y = C.y;                 // sub-solar point = geometric left limb
      ctx.fillStyle = "#fff4b0"; ctx.strokeStyle = "#ffcf33"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      // little inward arrow showing the perpendicular hit
      ctx.strokeStyle = "#ffcf33"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x - 26, y); ctx.lineTo(x - 8, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 16, y - 4); ctx.lineTo(x - 16, y + 4); ctx.closePath(); ctx.fillStyle = "#ffcf33"; ctx.fill();
    }

    function infoBoxes(ctx) {
      var dl = decl(P.day), s = seasonLabel(P.day);
      box(ctx, 30, 396, 320, 52);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#9fb0d0"; ctx.font = "12px system-ui"; ctx.fillText("The direct rays hit at latitude:", 44, 418);
      ctx.fillStyle = "#ffe14d"; ctx.font = "700 18px system-ui"; ctx.fillText(fmtLat(dl), 44, 440);
      box(ctx, 366, 396, 250, 52);
      ctx.fillStyle = "#eef2fb"; ctx.font = "700 18px system-ui"; ctx.textAlign = "center"; ctx.fillText(dateLabel(P.day), 491, 420);
      ctx.fillStyle = "#6ee7a8"; ctx.font = "700 13px system-ui"; ctx.fillText(s || " ", 491, 440);
    }
    function box(ctx, x, y, w, h) {
      roundRect(ctx, x, y, w, h, 8); ctx.fillStyle = "#0a1124"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
    }

    function panel(ctx, r) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    apply();
  }
});
