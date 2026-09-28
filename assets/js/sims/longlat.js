/* Longitude/Latitude Demonstrator ------------------------------------------------
   Faithful rebuild of ClassAction's "longlat.swf". The original builds a 300-unit
   sphere, drops a shoreline object on it, and parks the cursor at az 96.7 /
   alt 40.8 with the viewer at theta 290, phi 25 — Lincoln, Nebraska, seen from
   over the Atlantic. Its own colours: latitude arc 0x4B4BFE, longitude arc
   0xFE4B4B, equator 0x478B30, prime meridian and date line 0xFF8039, the faint
   graticule 0x505050.

   The globe's `az` is the negative of longitude, which is why the cursor's
   az 96.7 reads as 96.7° W. The city list and the twenty-five-vertex date line
   are the SWF's own arrays.                                                   */
Sim.create({
  id: "longlat",
  width: 780, height: 452,
  strings: {
    en: {
      "ll.loc": "Point location", "ll.lat": "latitude", "ll.lon": "longitude",
      "ll.fmt": "Coordinate format", "ll.dec": "decimal", "ll.sex": "sexagesimal",
      "ll.google": "Open Google Maps", "ll.show": "Show", "ll.cities": "show cities", "ll.features": "show features",
      "ll.view": "Globe orientation", "ll.spin": "spin", "ll.tilt": "tilt",
      "ll.reset": "Reset", "ll.equator": "Equator", "ll.pm": "Prime Meridian",
      "ll.idl": "International Date Line",
      "ll.hint": "Drag on the globe to move the cursor. The blue arc is the latitude, measured up from the equator; the red arc is the longitude, measured along the equator from Greenwich.",
      "ll.rLat": "latitude", "ll.rLon": "longitude", "ll.rCity": "nearest city",
      "ll.N": "N", "ll.S": "S", "ll.E": "E", "ll.W": "W",
      "ll.h1": "drag on the globe to change the cursor location",
      "ll.h2": "shift-drag to change the globe's orientation"
    },
    id: {
      "ll.loc": "Lokasi titik", "ll.lat": "lintang", "ll.lon": "bujur",
      "ll.fmt": "Format koordinat", "ll.dec": "desimal", "ll.sex": "seksagesimal",
      "ll.google": "Buka Google Maps", "ll.show": "Tampilkan", "ll.cities": "tampilkan kota", "ll.features": "tampilkan penanda",
      "ll.view": "Orientasi bola", "ll.spin": "putar", "ll.tilt": "miring",
      "ll.reset": "Atur ulang", "ll.equator": "Khatulistiwa", "ll.pm": "Meridian Utama",
      "ll.idl": "Garis Tanggal Internasional",
      "ll.hint": "Seret pada bola untuk memindahkan kursor. Busur biru adalah lintang, diukur ke atas dari khatulistiwa; busur merah adalah bujur, diukur sepanjang khatulistiwa dari Greenwich.",
      "ll.rLat": "lintang", "ll.rLon": "bujur", "ll.rCity": "kota terdekat",
      "ll.N": "U", "ll.S": "S", "ll.E": "T", "ll.W": "B",
      "ll.h1": "seret pada bola untuk memindahkan kursor",
      "ll.h2": "seret sambil menekan shift untuk memutar bola"
    }
  },
  about: {
    en: "<p>Latitude and longitude are two angles measured at the centre of the Earth. Latitude is the angle up from the equatorial plane — the blue arc here — and runs from 0° at the equator to 90° at either pole. Longitude is the angle round from the plane of the prime meridian, the red arc, running 180° east and 180° west of Greenwich.</p>" +
        "<p>The asymmetry between the two is historical, not geometric. The equator is picked out by the Earth's own rotation, so latitude has a natural zero. No meridian is special, so the zero for longitude had to be agreed on, and in 1884 the world settled on the one through the Greenwich observatory.</p>" +
        "<p>The system is the same one the sky uses. Declination is latitude projected outward onto the celestial sphere, right ascension is longitude, and the vernal equinox stands in for Greenwich. Altitude and azimuth work the same way again, with the horizon for an equator and the north point for a prime meridian.</p>",
    id: "<p>Lintang dan bujur adalah dua sudut yang diukur di pusat Bumi. Lintang adalah sudut ke atas dari bidang khatulistiwa — busur biru di sini — dan berkisar dari 0° di khatulistiwa hingga 90° di kedua kutub. Bujur adalah sudut memutar dari bidang meridian utama, busur merah, membentang 180° ke timur dan 180° ke barat dari Greenwich.</p>" +
        "<p>Ketidaksimetrisan keduanya bersifat historis, bukan geometris. Khatulistiwa ditetapkan oleh rotasi Bumi sendiri, sehingga lintang punya titik nol yang alami. Tidak ada meridian yang istimewa, sehingga titik nol bujur harus disepakati, dan pada 1884 dunia memilih meridian yang melewati observatorium Greenwich.</p>" +
        "<p>Sistemnya sama dengan yang dipakai langit. Deklinasi adalah lintang yang diproyeksikan keluar ke bola langit, asensiorekta adalah bujurnya, dan ekuinoks Maret menggantikan Greenwich. Altitud dan azimut bekerja dengan cara yang sama lagi, dengan cakrawala sebagai khatulistiwa dan titik utara sebagai meridian utama.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var C = { x: 218, y: 226 }, R = 176;
    var PANEL = { x: 414, y: 12, w: 354, h: 428 };
    var LAT_COL = "#4b4bfe", LON_COL = "#fe4b4b";
    var EQ_COL = "#478b30", PM_COL = "#ff8039", GRID = "rgba(80,80,80,0.28)";

    /* the SWF's own opening state */
    var lat = 40.8, lon = -96.7, theta = 290, phi = 25;
    var sexagesimal = false, showCities = false, showFeatures = false;

    /* cityList, straight out of the original (its "Lincoln" entry has a typo'd
       lat direction of W, which the parser reads as northern; kept as it reads) */
    var CITIES = [
      ["Buenos Aires, Argentina", -34 - 20 / 60, -(58 + 30 / 60)],
      ["Lima, Peru", -(12 + 6 / 60), -(76 + 55 / 60)],
      ["Casablanca, Morocco", 33 + 32 / 60, -(7 + 41 / 60)],
      ["Monrovia, Liberia", 6 + 20 / 60, -(10 + 46 / 60)],
      ["São Paulo, Brazil", -(23 + 34 / 60), -(46 + 38 / 60)],
      ["Lincoln", 40 + 49 / 60, -(96 + 40 / 60)],
      ["Baghdad, Iraq", 33 + 14 / 60, 44 + 22 / 60],
      ["Greenwich, England", 51 + 40 / 60, 0],
      ["Singapore", 1 + 22 / 60, 103 + 45 / 60],
      ["Havana, Cuba", 23 + 8 / 60, -(82 + 23 / 60)],
      ["Canberra, Australia", -(35 + 18 / 60), 149 + 8 / 60],
      ["Calcutta, India", 22 + 32 / 60, 88 + 22 / 60],
      ["Beijing, China", 39 + 55 / 60, 116 + 23 / 60],
      ["Reykjavik, Iceland", 64 + 9 / 60, -(21 + 58 / 60)],
      ["Murmansk, Russia", 68 + 59 / 60, 33 + 8 / 60],
      ["Washington DC", 38 + 53 / 60, -(77 + 2 / 60)],
      ["Barrow, Alaska", 71 + 17 / 60, -(156 + 47 / 60)],
      ["Moscow, Russia", 55 + 45 / 60, 37 + 37 / 60],
      ["Cape Town, South Africa", -(33 + 55 / 60), 18 + 27 / 60],
      ["McMurdo Station", -(77 + 51 / 60), 166 + 40 / 60]
    ];
    /* the IDL polyline, as {lon, lat} in the SWF */
    var IDL = [[180, 90], [180, 75], [-169, 72], [-169, 65.5], [-175, 64], [167, 50.5],
      [180, 48], [180, 2], [-179, 0], [-165, 0], [-165, -3], [-160, -3], [-160, 2],
      [-162, 2], [-162, 5], [-154, 5], [-151, -8], [-151, -12], [-157, -12], [-157, -9],
      [-178, -9], [-175.5, -15], [-175.5, -44.75], [180, -51.5], [180, -90]];

    /* ------------------------------------------------------------ projection */
    /* the sphere's viewer looks at az -theta, alt phi, and az = -longitude, so
       the disc's centre sits at longitude theta and latitude phi             */
    function centreLon() { return ((theta % 360) + 540) % 360 - 180; }
    function proj(la, lo) {
      var l0 = centreLon() * RAD, p0 = phi * RAD;
      var a = la * RAD, d = (lo * RAD - l0);
      var ca = Math.cos(a), sa = Math.sin(a), cd = Math.cos(d), sd = Math.sin(d);
      return { x: C.x + R * ca * sd,
        y: C.y - R * (Math.cos(p0) * sa - Math.sin(p0) * ca * cd),
        z: Math.sin(p0) * sa + Math.cos(p0) * ca * cd };
    }
    /* and back again, for dragging the cursor across the disc */
    function unproj(sx, sy) {
      var u = (sx - C.x) / R, v = -(sy - C.y) / R;
      var r2 = u * u + v * v;
      if (r2 > 1) { var k = 1 / Math.sqrt(r2); u *= k; v *= k; r2 = 1; }
      var w = Math.sqrt(Math.max(0, 1 - r2));
      var p0 = phi * RAD, l0 = centreLon() * RAD;
      var la = Math.asin(Math.max(-1, Math.min(1, v * Math.cos(p0) + w * Math.sin(p0))));
      var lo = l0 + Math.atan2(u, w * Math.cos(p0) - v * Math.sin(p0));
      return { lat: la * DEG, lon: ((lo * DEG + 540) % 360) - 180 };
    }

    /* ---------------------------------------------------------- formatting */
    function dm(v, pos, neg) {
      var d = Math.abs(v), dir = I18N.t(v >= 0 ? pos : neg);
      if (!sexagesimal) return d.toFixed(1) + "° " + dir;
      var deg = Math.floor(d), m = (d - deg) * 60, min = Math.floor(m);
      var sec = Math.round((m - min) * 60);
      if (sec === 60) { sec = 0; min += 1; }
      if (min === 60) { min = 0; deg += 1; }
      return deg + "° " + min + "' " + sec + "\" " + dir;
    }
    function latStr() { return dm(lat, "ll.N", "ll.S"); }
    function lonStr() { return dm(lon, "ll.E", "ll.W"); }

    /* ------------------------------------------------------------- controls */
    S.group("ll.loc");
    var fmtCtl = S.select({ labelKey: "ll.fmt", value: "d",
      options: [{ v: "d", labelKey: "ll.dec" }, { v: "s", labelKey: "ll.sex" }],
      on: function (v) { sexagesimal = v === "s"; refresh(); } });
    /* the SWF's "open Google Maps" button. It sent the cursor's position to
       maps.google.com/maps?q=<lon>+<lat>&spn=30.454102,33.222656&t=k — a pin
       in satellite view, about 30° across — and into a window it names
       googleMapPage, so every click reuses one tab. Google now ignores spn and
       zooms a pinned search right in to street level, so ask for the view
       with a camera instead (zoom 5 is the SWF's 30°).                        */
    S.button({ labelKey: "ll.google", on: function () {
      var pos = lat.toFixed(4) + "," + lon.toFixed(4);
      window.open("https://www.google.com/maps/place/" + pos + "/@" + pos +
        ",5z/data=!3m1!1e3?hl=" + I18N.getLang(), "googleMapPage");
    } });
    S.group("ll.show");
    var cityCtl = S.toggle({ labelKey: "ll.cities", value: false,
      on: function (v) { showCities = v; } });
    var featCtl = S.toggle({ labelKey: "ll.features", value: false,
      on: function (v) { showFeatures = v; } });
    S.group("ll.view");
    var spinCtl = S.slider({ labelKey: "ll.spin", min: 0, max: 359, value: 290, step: 1,
      unit: "°", on: function (v) { theta = v; } });
    var tiltCtl = S.slider({ labelKey: "ll.tilt", min: -90, max: 90, value: 25, step: 1,
      unit: "°", on: function (v) { phi = v; } });
    S.button({ labelKey: "ll.reset", on: function () {
      lat = 40.8; lon = -96.7;
      spinCtl.set(290); tiltCtl.set(25); fmtCtl.set("d");
      cityCtl.set(false); featCtl.set(false);
      refresh();
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ll.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outLat = S.readout({ labelKey: "ll.rLat" });
    var outLon = S.readout({ labelKey: "ll.rLon" });
    var outCity = S.readout({ labelKey: "ll.rCity" });

    function nearestCity() {
      var best = null, bd = 1e9;
      for (var i = 0; i < CITIES.length; i++) {
        var c = CITIES[i];
        var d = Math.acos(Math.max(-1, Math.min(1,
          Math.sin(lat * RAD) * Math.sin(c[1] * RAD) +
          Math.cos(lat * RAD) * Math.cos(c[1] * RAD) * Math.cos((lon - c[2]) * RAD)))) * DEG;
        if (d < bd) { bd = d; best = c; }
      }
      return { name: best[0], sep: bd };
    }
    function refresh() {
      outLat(latStr());
      outLon(lonStr());
      var n = nearestCity();
      outCity(n.name + " (" + Math.round(n.sep * 111) + " km)");
      S.requestDraw();
    }

    /* ---------------------------------------------------------- interaction */
    var drag = null;
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (Math.hypot(p.x - C.x, p.y - C.y) > R + 6) return;
      drag = ev.shiftKey ? { spin: true, x: p.x, y: p.y, th: theta, ph: phi } : { spin: false };
      if (!drag.spin) { var q = unproj(p.x, p.y); lat = q.lat; lon = q.lon; refresh(); }
      S.canvas.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.spin) {
        spinCtl.set(Math.round((((drag.th - (p.x - drag.x) * 0.4) % 360) + 360) % 360));
        tiltCtl.set(Math.round(Math.max(-90, Math.min(90, drag.ph + (p.y - drag.y) * 0.4))));
      } else {
        var q = unproj(p.x, p.y); lat = q.lat; lon = q.lon; refresh();
      }
    });
    ["pointerup", "pointercancel"].forEach(function (k) {
      S.canvas.addEventListener(k, function () { drag = null; });
    });
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }

    /* --------------------------------------------------------------- paint */
    var shade = null;
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);

      if (!shade) {
        shade = ctx.createRadialGradient(C.x - R * 0.35, C.y - R * 0.4, R * 0.08,
          C.x, C.y, R * 1.18);
        shade.addColorStop(0, "#ffffff");
        shade.addColorStop(0.55, "#f0f0f0");
        shade.addColorStop(1, "#b9b9b9");
      }
      ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, TAU);
      ctx.fillStyle = shade; ctx.fill();
      ctx.strokeStyle = "#9a9a9a"; ctx.lineWidth = 1; ctx.stroke();

      ctx.save();
      ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, TAU); ctx.clip();

      /* the faint graticule the SWF keeps on all the time */
      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      meridian(ctx, 0); meridian(ctx, 90);
      if (!showFeatures) parallel(ctx, 0);

      /* coastlines, drawn as outlines the way shoreDemo does */
      ctx.strokeStyle = "#8e8e8e"; ctx.lineWidth = 0.9;
      shores(ctx);

      if (showFeatures) {
        ctx.strokeStyle = EQ_COL; ctx.lineWidth = 1.4; parallel(ctx, 0);
        ctx.strokeStyle = PM_COL; ctx.lineWidth = 1.4; meridian(ctx, 0);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        var started = false;
        for (var i = 0; i < IDL.length - 1; i++) arcSeg(ctx, IDL[i][1], IDL[i][0],
          IDL[i + 1][1], IDL[i + 1][0]);
        ctx.strokeStyle = PM_COL; ctx.stroke();
        label(ctx, 0, centreLon(), tr("ll.equator"), EQ_COL);
        label(ctx, 45, 0, tr("ll.pm"), PM_COL);
        label(ctx, 30, 180, tr("ll.idl"), PM_COL);
      }

      /* the guide circles through the cursor, then the two measured arcs */
      ctx.strokeStyle = "rgba(145,145,145,0.75)"; ctx.lineWidth = 1;
      parallel(ctx, lat); meridian(ctx, lon);
      ctx.lineWidth = 3.4;
      ctx.strokeStyle = LON_COL;
      ctx.beginPath(); arcSeg(ctx, 0, 0, 0, lon, true); ctx.stroke();
      ctx.strokeStyle = LAT_COL;
      ctx.beginPath(); arcSeg(ctx, 0, lon, lat, lon, true); ctx.stroke();

      if (showCities) {
        ctx.font = "9px " + FONT;
        for (var c = 0; c < CITIES.length; c++) {
          var q = proj(CITIES[c][1], CITIES[c][2]);
          if (q.z <= 0) continue;
          ctx.beginPath(); ctx.arc(q.x, q.y, 2.6, 0, TAU);
          ctx.fillStyle = "#c0392b"; ctx.fill();
          ctx.fillStyle = "#555555"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(CITIES[c][0].split(",")[0], q.x + 5, q.y - 5);
        }
      }
      ctx.restore();

      /* the arc labels ride just outside their arcs, as in the original */
      arcLabel(ctx, lat / 2, lon, latStr(), LAT_COL, "right", -12, 4);
      arcLabel(ctx, 0, lon / 2, lonStr(), LON_COL, "center", 0, 18);

      var cur = proj(lat, lon);
      if (cur.z > 0) {
        ctx.beginPath(); ctx.arc(cur.x, cur.y, 5, 0, TAU);
        ctx.fillStyle = "#111111"; ctx.fill();
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.2; ctx.stroke();
      }

      /* the readout panel, the SWF's "point location" box */
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#111111"; ctx.font = "bold 15px " + FONT;
      ctx.fillText(tr("ll.loc"), PANEL.x + PANEL.w / 2, PANEL.y + 46);
      ctx.font = "14px " + FONT;
      ctx.textAlign = "right";
      ctx.fillStyle = "#444444";
      ctx.fillText(tr("ll.lat") + ":", PANEL.x + 150, PANEL.y + 84);
      ctx.fillText(tr("ll.lon") + ":", PANEL.x + 150, PANEL.y + 112);
      ctx.textAlign = "left";
      ctx.fillStyle = LAT_COL; ctx.fillText(latStr(), PANEL.x + 166, PANEL.y + 84);
      ctx.fillStyle = LON_COL; ctx.fillText(lonStr(), PANEL.x + 166, PANEL.y + 112);
      ctx.textAlign = "center";
      ctx.fillStyle = "#777777"; ctx.font = "italic 11px " + FONT;
      ctx.fillText(tr("ll.h1"), PANEL.x + PANEL.w / 2, PANEL.y + PANEL.h - 46);
      ctx.fillText(tr("ll.h2"), PANEL.x + PANEL.w / 2, PANEL.y + PANEL.h - 28);
    });

    function meridian(ctx, lo) {
      ctx.beginPath();
      arcSeg(ctx, -90, lo, 90, lo, true);
      arcSeg(ctx, 90, lo + 180, -90, lo + 180, true);
      ctx.stroke();
    }
    function parallel(ctx, la) {
      ctx.beginPath();
      var started = false;
      for (var i = 0; i <= 180; i++) {
        var q = proj(la, -180 + 360 * i / 180);
        if (q.z <= 0) { started = false; continue; }
        if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
    }
    /* a great-circle-ish segment, sampled along the shorter way round in lon */
    function arcSeg(ctx, la0, lo0, la1, lo1, fresh) {
      var d = lo1 - lo0;
      while (d > 180) d -= 360;
      while (d < -180) d += 360;
      var n = Math.max(2, Math.ceil(Math.max(Math.abs(d), Math.abs(la1 - la0)) / 2));
      var started = false;
      for (var i = 0; i <= n; i++) {
        var t = i / n;
        var q = proj(la0 + (la1 - la0) * t, lo0 + d * t);
        if (q.z <= 0) { started = false; continue; }
        if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
      }
    }
    function label(ctx, la, lo, text, colour) {
      var q = proj(la, lo);
      if (q.z <= 0) return;
      ctx.fillStyle = colour; ctx.font = "11px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      var lines = text.split("\n");
      for (var i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], q.x, q.y - 10 + i * 12);
      }
    }
    /* the arc labels lie flat on the globe, running along the local parallel,
       offset clear of the arc — the way the SWF's Label objects sit            */
    function arcLabel(ctx, la, lo, text, colour, align, dx, dy) {
      var q = proj(la, lo);
      if (q.z <= 0) return;
      var a = proj(la, lo + 0.5), b = proj(la, lo - 0.5);
      var ang = Math.atan2(a.y - b.y, a.x - b.x);
      if (ang > Math.PI / 2) ang -= Math.PI;
      if (ang < -Math.PI / 2) ang += Math.PI;
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate(ang);
      ctx.font = "bold 13px " + FONT;
      ctx.textAlign = align; ctx.textBaseline = "middle";
      ctx.fillStyle = colour;
      ctx.fillText(text, dx, dy);
      ctx.restore();
    }
    /* the shorelines, as visible-run polylines rather than filled shapes */
    function shores(ctx) {
      var SH = EARTH.SHORE;
      ctx.beginPath();
      for (var s = 0; s < SH.length; s++) {
        var poly = SH[s], n = poly.length / 3, started = false;
        for (var i = 0; i <= n; i++) {
          var j = (i % n) * 3;
          var x = poly[j], y = poly[j + 1], z = poly[j + 2];
          var la = Math.asin(Math.max(-1, Math.min(1, z))) * DEG;
          var lo = Math.atan2(y, x) * DEG;
          var q = proj(la, lo);
          if (q.z <= 0) { started = false; continue; }
          if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
        }
      }
      ctx.stroke();
    }

    refresh();
  }
});
