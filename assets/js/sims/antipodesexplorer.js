/* Antipodes Explorer -------------------------------------------------------------
   Faithful rebuild of the ClassAction "antipodesexplorer.swf" (its flat-map and
   globe components, decompiled). Drag the red marker anywhere on the world map
   and the blue marker follows to its antipode — the point diametrically opposite
   through the centre of the Earth, at latitude −φ and longitude λ ± 180°.

   The map is the SWF's own bitmap, 360° wide and scrollable, and the globe below
   is drawn the way the original draws it: transparent, so the far-side marker
   shows through the Earth.                                                     */
Sim.create({
  id: "antipodesexplorer",
  width: 760, height: 620,
  strings: {
    en: {
      "ap.opt": "Options", "ap.restrict": "restrict dragging", "ap.free": "free",
      "ap.lonm": "along longitude meridians", "ap.latp": "along latitude parallels",
      "ap.snap": "snap to multiples of 5°", "ap.reset": "Reset",
      "ap.globe": "Transparent Globe View", "ap.points": "Point Locations",
      "ap.lat": "latitude:", "ap.lon": "longitude:", "ap.rRed": "red marker", "ap.rBlue": "blue marker",
      "ap.hint": "Drag a marker to move the pair. Drag the globe itself to spin it, or the map to scroll it round the world.",
      "ap.scroll": "map scroll"
    },
    id: {
      "ap.opt": "Pilihan", "ap.restrict": "batasi seretan", "ap.free": "bebas",
      "ap.lonm": "sepanjang meridian bujur", "ap.latp": "sepanjang paralel lintang",
      "ap.snap": "kancing ke kelipatan 5°", "ap.reset": "Atur ulang",
      "ap.globe": "Tampilan Bola Tembus Pandang", "ap.points": "Lokasi Titik",
      "ap.lat": "lintang:", "ap.lon": "bujur:", "ap.rRed": "penanda merah", "ap.rBlue": "penanda biru",
      "ap.hint": "Seret penanda untuk memindahkan pasangannya. Seret bolanya untuk memutar, atau petanya untuk menggulung keliling dunia.",
      "ap.scroll": "gulungan peta"
    }
  },
  about: {
    en: "<p>Your antipode is the place you would reach by digging straight through the centre of the Earth. Finding it is pure coordinate arithmetic: flip the sign of the latitude (north becomes south) and move the longitude half a turn, 180° east or west.</p>" +
        "<p>Try it and the result is usually water. Land covers 29% of the surface, but land is so unevenly distributed that only about 4% of the Earth's surface has land at both ends — most of it Argentina-to-China and a scattering of islands. Almost every point in the continental United States is antipodal to the Indian Ocean; most of Europe answers to the South Pacific.</p>" +
        "<p>Antipodal points share a longitude line and a latitude circle in mirror image, so they are always exactly 12 hours apart in local solar time, and their seasons are opposite. When the Sun is overhead at one, it is midnight at the other — which is why a total solar eclipse at your antipode is something you could never see, even in principle.</p>",
    id: "<p>Antipode Anda adalah tempat yang akan dicapai bila menggali lurus menembus pusat Bumi. Mencarinya murni aritmetika koordinat: balik tanda lintangnya (utara menjadi selatan) dan geser bujurnya setengah putaran, 180° ke timur atau barat.</p>" +
        "<p>Cobalah dan hasilnya biasanya air. Daratan menutupi 29% permukaan, tetapi persebarannya begitu timpang sehingga hanya sekitar 4% permukaan Bumi berupa daratan di kedua ujungnya — kebanyakan Argentina–Tiongkok dan sejumlah pulau. Hampir setiap titik di daratan Amerika Serikat berpasangan dengan Samudra Hindia; sebagian besar Eropa berpasangan dengan Pasifik Selatan.</p>" +
        "<p>Titik antipodal berbagi garis bujur dan lingkaran lintang secara cermin, sehingga waktu matahari setempatnya selalu terpaut tepat 12 jam dan musimnya berlawanan. Saat Matahari tepat di atas kepala pada satu titik, di titik lainnya tengah malam — sebabnya gerhana matahari total di antipode Anda mustahil terlihat, bahkan pada prinsipnya.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var OY = -30;
    var FONT = "Verdana, Geneva, sans-serif";
    var MAP = { x: 80, y: 74.5 + OY, w: 600, h: 300 };      // mapWidth = 2 × mapHeight
    var GLOBE = { x: 134, y: 545 + OY, r: 87.5 };           // sphereMC size 175
    var RED = "#f06060", BLUE = "#8080ff";
    var LAT_DIV = 6, LON_DIV = 8;

    var red = { lat: 42, lon: -5 };
    var offset = 100;                                       // longitude at the map's left edge
    var restrict = "none", snap = false;
    var view = { lon: -5 + 15, lat: 42 - 5 };               // the globe's own orientation
    var drag = null;
    var mapData = null, mapW = 256, mapH = 128;             // the map, sampled for the globe

    var img = new Image();
    img.onload = function () {
      var c = document.createElement("canvas");
      c.width = mapW; c.height = mapH;
      var cx = c.getContext("2d");
      cx.drawImage(img, 0, 0, img.naturalWidth / 2, img.naturalHeight, 0, 0, mapW, mapH);
      mapData = cx.getImageData(0, 0, mapW, mapH).data;
      S.requestDraw();
    };
    img.src = "../assets/img/sims/world-map.jpg";

    S.group("ap.opt");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ap.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.select({
      labelKey: "ap.restrict", value: "none",
      options: [{ v: "none", labelKey: "ap.free" }, { v: "longitude", labelKey: "ap.lonm" }, { v: "latitude", labelKey: "ap.latp" }],
      on: function (v) { restrict = v; }
    });
    S.toggle({
      labelKey: "ap.snap", value: false,
      on: function (v) { snap = v; if (v) { red.lat = 5 * Math.round(red.lat / 5); red.lon = 5 * Math.round(red.lon / 5); } upd(); }
    });
    S.button({
      labelKey: "ap.reset",
      on: function () { red = { lat: 42, lon: -5 }; offset = 100; recentre(); upd(); }
    });
    var outRed = S.readout({ labelKey: "ap.rRed" });
    var outBlue = S.readout({ labelKey: "ap.rBlue" });
    var outScroll = S.readout({ labelKey: "ap.scroll" });

    var SPIN = 57.2958 / GLOBE.r;                           // the sphere engine's degrees per pixel
    function wrapLon(l) { return ((l + 180) % 360 + 360) % 360 - 180; }
    function globeHit(p) {                                   // which marker, if any, is under the pointer
      var b = anti(red), pr = project(red.lat, red.lon), pb = project(b.lat, b.lon);
      if (pr.front && Math.hypot(p.x - GLOBE.x - pr.x, p.y - GLOBE.y - pr.y) < 9) return "red";
      if (pb.front && Math.hypot(p.x - GLOBE.x - pb.x, p.y - GLOBE.y - pb.y) < 9) return "blue";
      return null;
    }
    function anti(p) { return { lat: -p.lat, lon: wrapLon(p.lon + 180) }; }
    function xOf(lon) { return MAP.x + MAP.w * ((((lon - offset) % 360) + 360) % 360) / 360; }
    function yOf(lat) { return MAP.y + (90 - lat) * MAP.h / 180; }
    function latStr(lat) { return Math.abs(Math.round(lat)) + "° " + (lat < 0 ? "S" : "N"); }
    function lonStr(lon) { return Math.abs(Math.round(lon)) + "° " + (lon < 0 ? "W" : "E"); }

    function upd() {
      var b = anti(red);
      outRed(latStr(red.lat) + ", " + lonStr(red.lon));
      outBlue(latStr(b.lat) + ", " + lonStr(b.lon));
      outScroll(lonStr(wrapLon(offset)));                    // the longitude at the map's left edge
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- dragging: a marker, or the map itself ---- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function place(p, asBlue) {
      var lat = 90 - (p.y - MAP.y) * 180 / MAP.h;
      var lon = wrapLon(offset + (p.x - MAP.x) * 360 / MAP.w);
      var cur = asBlue ? anti(red) : red;
      if (restrict === "longitude") lon = cur.lon;           // slide along the meridian
      if (restrict === "latitude") lat = cur.lat;
      if (snap) { lat = 5 * Math.round(lat / 5); lon = 5 * Math.round(lon / 5); }
      var np = { lat: Math.max(-90, Math.min(90, lat)), lon: wrapLon(lon) };
      red = asBlue ? anti(np) : np;                          // either marker drags the pair
      upd();
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.x < MAP.x || p.x > MAP.x + MAP.w || p.y < MAP.y || p.y > MAP.y + MAP.h) {
        if (Math.hypot(p.x - GLOBE.x, p.y - GLOBE.y) <= GLOBE.r) {
          var hit = globeHit(p);                             // a marker on the near face, or the globe
          drag = hit ? { dot: hit, globeDot: true } : { spin: p, view: { lon: view.lon, lat: view.lat } };
        } else return;
      } else {
        var b = anti(red);
        var onRed = Math.hypot(p.x - xOf(red.lon), p.y - yOf(red.lat)) < 10;
        var onBlue = Math.hypot(p.x - xOf(b.lon), p.y - yOf(b.lat)) < 10;
        drag = onRed ? { dot: "red" } : onBlue ? { dot: "blue" } : { pan: p.x, offset: offset };
      }
      S.canvas.setPointerCapture(ev.pointerId);
      if (drag.dot && !drag.globeDot) place(p, drag.dot === "blue");
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.pan !== undefined) { offset = wrapLon(drag.offset - (p.x - drag.pan) * 360 / MAP.w); upd(); return; }
      if (drag.spin) {                                       // the SWF spins the sphere only
        view.lon = wrapLon(drag.view.lon - (p.x - drag.spin.x) * SPIN);
        view.lat = Math.max(-90, Math.min(90, drag.view.lat + (p.y - drag.spin.y) * SPIN));
        S.requestDraw();
        return;
      }
      if (drag.globeDot) {                                   // a marker dragged across the globe
        var g = unproject(p.x - GLOBE.x, p.y - GLOBE.y);
        if (!g) return;
        var cur = drag.dot === "blue" ? anti(red) : red;
        var lat = restrict === "latitude" ? cur.lat : g.lat;
        var lon = restrict === "longitude" ? cur.lon : wrapLon(g.lon);
        if (snap) { lat = 5 * Math.round(lat / 5); lon = 5 * Math.round(lon / 5); }
        var np = { lat: Math.max(-90, Math.min(90, lat)), lon: wrapLon(lon) };
        red = drag.dot === "blue" ? anti(np) : np;
        upd();
        return;
      }
      place(p, drag.dot === "blue");
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
    });

    /* ---- the globe: an orthographic view built from the same map ---- */
    function viewCentre() { return view; }
    function recentre() { view = { lon: red.lon + 15, lat: red.lat - 5 }; }
    function unproject(dx, dy) {                             // screen offset → lat/lon on the near face
      var rho = Math.hypot(dx, dy);
      if (rho > GLOBE.r) return null;
      var v = viewCentre(), p0 = v.lat * RAD, l0 = v.lon * RAD;
      var c = Math.asin(Math.min(1, rho / GLOBE.r)), y = -dy;
      var lat = Math.asin(Math.cos(c) * Math.sin(p0) + (rho ? y * Math.sin(c) * Math.cos(p0) / rho : 0));
      var lon = l0 + Math.atan2(dx * Math.sin(c), rho * Math.cos(c) * Math.cos(p0) - y * Math.sin(c) * Math.sin(p0));
      return { lat: lat * DEG, lon: lon * DEG };
    }
    function isLand(lat, lon) {
      if (!mapData) return false;
      var x = Math.floor(((((lon + 180) % 360) + 360) % 360) / 360 * mapW) % mapW;
      var y = Math.max(0, Math.min(mapH - 1, Math.floor((90 - lat) / 180 * mapH)));
      return mapData[(y * mapW + x) * 4] < 235;              // the map's land is grey, its sea white
    }
    var globeCanvas = document.createElement("canvas");
    function drawGlobe(ctx) {
      var R = Math.ceil(GLOBE.r), size = 2 * R;
      if (globeCanvas.width !== size) { globeCanvas.width = size; globeCanvas.height = size; }
      var gc = globeCanvas.getContext("2d");
      var im = gc.createImageData(size, size), d = im.data;
      for (var py = 0; py < size; py++) {
        for (var px = 0; px < size; px++) {
          var dx = px - R + 0.5, dy = py - R + 0.5, i = (py * size + px) * 4;
          var f = unproject(dx, dy);
          if (!f) { d[i + 3] = 0; continue; }
          var fl = isLand(f.lat, f.lon), bl = isLand(-f.lat, f.lon + 180);
          var front = fl ? 150 : 252, back = bl ? 205 : 246;
          var v = 0.68 * front + 0.32 * back;
          var sh = 1 - 0.28 * Math.pow(Math.hypot(dx, dy) / GLOBE.r, 3);   // limb shading
          v *= sh;
          d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, v));
          d[i + 3] = 255;
        }
      }
      gc.putImageData(im, 0, 0);
      ctx.drawImage(globeCanvas, GLOBE.x - R, GLOBE.y - R);
      ctx.strokeStyle = "#9aa3a8"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(GLOBE.x, GLOBE.y, GLOBE.r, 0, TAU); ctx.stroke();
      // the equator and the polar axis stubs, as in the SWF
      ctx.strokeStyle = "rgba(48,144,48,0.6)"; ctx.lineWidth = 1;
      ring(ctx, 0);
      var v = viewCentre();
      ctx.strokeStyle = "rgba(48,144,48,0.5)"; ctx.lineWidth = 2;
      [1, -1].forEach(function (s) {
        var a = project(90 * s, 0), b2 = { x: a.x * 1.15, y: a.y * 1.15 };
        ctx.beginPath(); ctx.moveTo(GLOBE.x + a.x, GLOBE.y + a.y); ctx.lineTo(GLOBE.x + b2.x, GLOBE.y + b2.y); ctx.stroke();
      });
      var b = anti(red);
      var pr = project(red.lat, red.lon), pb = project(b.lat, b.lon);
      ctx.strokeStyle = "rgba(64,64,64,0.4)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(GLOBE.x + pr.x, GLOBE.y + pr.y); ctx.lineTo(GLOBE.x + pb.x, GLOBE.y + pb.y); ctx.stroke();
      [[pr, RED], [pb, BLUE]].forEach(function (p) {
        ctx.globalAlpha = p[0].front ? 1 : 0.45;
        dot(ctx, GLOBE.x + p[0].x, GLOBE.y + p[0].y, 5, p[1]);
        ctx.globalAlpha = 1;
      });
    }
    function project(lat, lon) {                             // orthographic, +z toward the viewer
      var v = viewCentre(), p0 = v.lat * RAD, l0 = v.lon * RAD, p = lat * RAD, l = lon * RAD;
      var cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
      return {
        x: GLOBE.r * Math.cos(p) * Math.sin(l - l0),
        y: -GLOBE.r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0)),
        front: cosc >= 0
      };
    }
    function ring(ctx, lat) {
      ctx.beginPath();
      for (var l = -180, started = false; l <= 180; l += 3) {
        var p = project(lat, l);
        if (!p.front) { started = false; continue; }
        if (!started) { ctx.moveTo(GLOBE.x + p.x, GLOBE.y + p.y); started = true; }
        else ctx.lineTo(GLOBE.x + p.x, GLOBE.y + p.y);
      }
      ctx.stroke();
    }

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      panel(ctx, 7, 37 + OY, 746, 375, null);
      panel(ctx, 7, 419 + OY, 244, 234, t("ap.globe"));
      panel(ctx, 258, 419 + OY, 495, 234, t("ap.points"));

      ctx.save();
      ctx.beginPath(); ctx.rect(MAP.x, MAP.y, MAP.w, MAP.h); ctx.clip();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(MAP.x, MAP.y, MAP.w, MAP.h);
      if (img.complete && img.naturalWidth) {                // the map is two worlds wide, so it wraps
        var w = MAP.w, off = -((((offset + 180) % 360) + 360) % 360) / 360 * w;
        for (var k = -1; k <= 1; k++) ctx.drawImage(img, 0, 0, img.naturalWidth / 2, img.naturalHeight, MAP.x + off + k * w, MAP.y, w, MAP.h);
      }
      ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 1;   // the graticule sits on round degrees
      for (var i = 1; i < LAT_DIV; i++) {
        var y = MAP.y + i * MAP.h / LAT_DIV;
        ctx.beginPath(); ctx.moveTo(MAP.x, y); ctx.lineTo(MAP.x + MAP.w, y); ctx.stroke();
      }
      for (var lon = -180; lon < 180; lon += 360 / LON_DIV) {
        var x = xOf(lon);
        ctx.beginPath(); ctx.moveTo(x, MAP.y); ctx.lineTo(x, MAP.y + MAP.h); ctx.stroke();
      }
      var b = anti(red);
      dot(ctx, xOf(b.lon), yOf(b.lat), 6, BLUE);
      dot(ctx, xOf(red.lon), yOf(red.lat), 6, RED);
      ctx.restore();
      border(ctx, t);
      drawGlobe(ctx);
      points(ctx, t);
    });

    function panel(ctx, x, y, w, h, title) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      if (!title) return;
      ctx.fillStyle = "#333333"; ctx.font = "13px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(title, x + 9, y + 13);
      ctx.strokeStyle = "#cccccc";
      ctx.beginPath();
      ctx.moveTo(x + 13 + ctx.measureText(title).width, y + 13); ctx.lineTo(x + w - 9, y + 13);
      ctx.stroke();
    }
    // the black-and-white ticked frame, with the degree labels the SWF puts outside it
    function border(ctx, t) {
      var bw = 6, step = MAP.w / (LON_DIV * 2), vstep = MAP.h / (LAT_DIV * 2);
      ctx.fillStyle = "#ffffff";                             // the frame only, never over the map
      ctx.fillRect(MAP.x - bw, MAP.y - bw, MAP.w + 2 * bw, bw);
      ctx.fillRect(MAP.x - bw, MAP.y + MAP.h, MAP.w + 2 * bw, bw);
      ctx.fillRect(MAP.x - bw, MAP.y, bw, MAP.h);
      ctx.fillRect(MAP.x + MAP.w, MAP.y, bw, MAP.h);
      ctx.save();
      ctx.beginPath();                                       // the ticked frame follows the graticule
      ctx.rect(MAP.x - bw, MAP.y - bw, MAP.w + 2 * bw, bw);
      ctx.rect(MAP.x - bw, MAP.y + MAP.h, MAP.w + 2 * bw, bw);
      ctx.clip();
      ctx.fillStyle = "#000000";
      for (var lon = -180; lon < 180; lon += 360 / (LON_DIV * 2)) {
        if (Math.round((lon + 180) / (360 / (LON_DIV * 2))) % 2) continue;
        var x0 = xOf(lon);
        [x0, x0 - MAP.w].forEach(function (x) {
          ctx.fillRect(x, MAP.y - bw, step, bw); ctx.fillRect(x, MAP.y + MAP.h, step, bw);
        });
      }
      ctx.restore();
      ctx.fillStyle = "#000000";
      for (var i = 0; i < LAT_DIV * 2; i++) {
        var y0 = MAP.y + i * vstep;
        if (i % 2 === 0) { ctx.fillRect(MAP.x - bw, y0, bw, vstep); ctx.fillRect(MAP.x + MAP.w, y0, bw, vstep); }
      }
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.strokeRect(MAP.x - bw - 0.5, MAP.y - bw - 0.5, MAP.w + 2 * bw + 1, MAP.h + 2 * bw + 1);
      ctx.strokeRect(MAP.x - 0.5, MAP.y - 0.5, MAP.w + 1, MAP.h + 1);
      ctx.fillStyle = "#000000"; ctx.font = "11px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      for (var l = -180; l < 180; l += 360 / LON_DIV) {      // one label every 45°, on round degrees
        var x = xOf(l);
        if (x < MAP.x + 12 || x > MAP.x + MAP.w - 12) continue;
        ctx.fillText(l === -180 ? "180°" : (l === 0 ? "0°" : lonStr(l)), x, MAP.y - bw - 4);
      }
      ctx.textBaseline = "middle";
      for (var m = 0; m <= LAT_DIV; m++) {
        var lat = 90 - m * 180 / LAT_DIV, y = MAP.y + m * MAP.h / LAT_DIV;
        ctx.textAlign = "right"; ctx.fillText(lat === 0 ? "0°" : latStr(lat), MAP.x - bw - 6, y);
        ctx.textAlign = "left"; ctx.fillText(lat === 0 ? "0°" : latStr(lat), MAP.x + MAP.w + bw + 6, y);
      }
    }
    function points(ctx, t) {
      var b = anti(red), x = 268, y = 419 + OY;
      [[red, RED, y + 40], [b, BLUE, y + 126]].forEach(function (p) {
        dot(ctx, x + 22, p[2] + 18, 6, p[1]);
        ctx.fillStyle = "#333333"; ctx.font = "13px " + FONT;
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(t("ap.lat"), x + 130, p[2] + 4);
        ctx.fillText(t("ap.lon"), x + 130, p[2] + 32);
        ctx.fillStyle = p[1] === RED ? "#c03030" : "#4040c0";
        ctx.textAlign = "left";
        ctx.fillText(latStr(p[0].lat), x + 140, p[2] + 4);
        ctx.fillText(lonStr(p[0].lon), x + 140, p[2] + 32);
      });
    }
    function dot(ctx, x, y, r, col) {
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = "#333333"; ctx.lineWidth = 1; ctx.stroke();
    }

    upd();
  }
});
