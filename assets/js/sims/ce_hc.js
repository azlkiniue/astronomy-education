/* Rotating Sky Explorer ---------------------------------------------------------
   Faithful rebuild of the NAAP "ce_hc.swf" (sprite325's timeline plus the shared
   UNL CelestialSphere engine, both decompiled).

   Two views of one sky, side by side. On the left the celestial sphere with Earth
   turning at its centre; on the right the same sphere re-drawn for the observer,
   with the green horizon plane cutting it into the part of the sky that rises and
   sets, the part that never rises, and the part that never sets.               */
Sim.create({
  id: "ce_hc",
  width: 900, height: 500,
  strings: {
    en: {
      "rs.loc": "Observer's Location", "rs.lat": "latitude", "rs.lon": "longitude",
      "rs.anim": "Animation Controls", "rs.start": "start animation", "rs.pause": "pause animation",
      "rs.for": "animate", "rs.cont": "continuously", "rs.hour1": "for 1 hour", "rs.h3": "for 3 hours", "rs.h6": "for 6 hours",
      "rs.h12": "for 12 hours", "rs.h24": "for 24 hours", "rs.rate": "animation rate",
      "rs.look": "Appearance Settings", "rs.labels": "show labels",
      "rs.zeroh": "show 0h circle", "rs.eq": "show celestial equator",
      "rs.under": "show underside of horizon diagram",
      "rs.never": "show never rise region", "rs.riseset": "show rise and set region",
      "rs.circum": "show circumpolar region", "rs.angle": "show equator–horizon angle",
      "rs.stars": "Star Controls", "rs.add": "add star randomly", "rs.clear": "remove all stars",
      "rs.pattern": "star patterns", "rs.orion": "Orion",
      "rs.dipper": "Big Dipper", "rs.cross": "Southern Cross",
      "rs.trail": "star trails", "rs.tnone": "no trails", "rs.tshort": "short", "rs.tlong": "long",
      "rs.reset": "reset star trails",
      "rs.celestial": "celestial sphere view", "rs.horizon": "horizon diagram view",
      "rs.rTime": "elapsed", "rs.rSid": "sidereal time", "rs.rStar": "selected star",
      "rs.nostar": "none — click a star",
      "rs.hint": "Drag inside a panel to swing that view. Drag a star to move it; click it to read its coordinates. Click the map to move the observer.",
      "rs.N": "N", "rs.E": "E", "rs.S": "S", "rs.W": "W",
      "rs.ncp": "NCP", "rs.scp": "SCP", "rs.ceq": "celestial equator", "rs.zh": "0h",
      "rs.mer": "meridian", "rs.zen": "zenith", "rs.nad": "nadir"
    },
    id: {
      "rs.loc": "Lokasi Pengamat", "rs.lat": "lintang", "rs.lon": "bujur",
      "rs.anim": "Kendali Animasi", "rs.start": "mulai animasi", "rs.pause": "jeda animasi",
      "rs.for": "animasikan", "rs.cont": "terus-menerus", "rs.hour1": "selama 1 jam", "rs.h3": "selama 3 jam", "rs.h6": "selama 6 jam",
      "rs.h12": "selama 12 jam", "rs.h24": "selama 24 jam", "rs.rate": "laju animasi",
      "rs.look": "Pengaturan Tampilan", "rs.labels": "tampilkan label",
      "rs.zeroh": "tampilkan lingkaran 0j", "rs.eq": "tampilkan ekuator langit",
      "rs.under": "tampilkan sisi bawah diagram horizon",
      "rs.never": "tampilkan wilayah tak pernah terbit", "rs.riseset": "tampilkan wilayah terbit–terbenam",
      "rs.circum": "tampilkan wilayah sirkumpolar", "rs.angle": "tampilkan sudut ekuator–horizon",
      "rs.stars": "Kendali Bintang", "rs.add": "tambah bintang acak", "rs.clear": "hapus semua bintang",
      "rs.pattern": "pola bintang", "rs.orion": "Orion",
      "rs.dipper": "Biduk", "rs.cross": "Salib Selatan",
      "rs.trail": "jejak bintang", "rs.tnone": "tanpa jejak", "rs.tshort": "pendek", "rs.tlong": "panjang",
      "rs.reset": "atur ulang jejak",
      "rs.celestial": "tampilan bola langit", "rs.horizon": "tampilan diagram horizon",
      "rs.rTime": "waktu berlalu", "rs.rSid": "waktu sideris", "rs.rStar": "bintang terpilih",
      "rs.nostar": "belum ada — klik bintang",
      "rs.hint": "Seret di dalam panel untuk memutar tampilan. Seret bintang untuk memindahkannya; klik untuk membaca koordinatnya. Klik peta untuk memindahkan pengamat.",
      "rs.N": "U", "rs.E": "T", "rs.S": "S", "rs.W": "B",
      "rs.ncp": "KLU", "rs.scp": "KLS", "rs.ceq": "ekuator langit", "rs.zh": "0j",
      "rs.mer": "meridian", "rs.zen": "zenit", "rs.nad": "nadir"
    }
  },
  about: {
    en: "<p>The sky appears to turn because Earth turns. Once a day every star traces a circle parallel to the celestial equator, and where that circle sits relative to your horizon decides what you see. Stars close to the visible celestial pole never set — they are circumpolar. Stars close to the other pole never rise. Everything in between rises in the east and sets in the west.</p>" +
        "<p>The boundary is set entirely by latitude. A star is circumpolar when its declination exceeds 90° − |latitude|, and it never rises when its declination is below −(90° − |latitude|). Run the animation and watch the same star in both panels: on the left it holds still against a turning Earth, on the right it sweeps across your sky.</p>" +
        "<p>The two extremes make the rule obvious. At the pole your horizon is the celestial equator, nothing rises or sets, and half the sky is permanently hidden. At the equator the celestial poles sit on your horizon, nothing is circumpolar, and over a year you can see every star in the sky.</p>",
    id: "<p>Langit tampak berputar karena Bumi yang berputar. Sekali sehari setiap bintang menyusuri lingkaran sejajar ekuator langit, dan letak lingkaran itu terhadap ufuk Anda menentukan apa yang terlihat. Bintang yang dekat kutub langit yang tampak tak pernah terbenam — bintang itu sirkumpolar. Bintang dekat kutub yang lain tak pernah terbit. Selebihnya terbit di timur dan terbenam di barat.</p>" +
        "<p>Batasnya ditentukan sepenuhnya oleh lintang. Sebuah bintang bersifat sirkumpolar bila deklinasinya melebihi 90° − |lintang|, dan tak pernah terbit bila deklinasinya di bawah −(90° − |lintang|). Jalankan animasinya lalu amati bintang yang sama pada kedua panel: di kiri ia diam terhadap Bumi yang berputar, di kanan ia melintasi langit Anda.</p>" +
        "<p>Kedua ujung ekstremnya membuat aturan ini gamblang. Di kutub, ufuk Anda berimpit dengan ekuator langit, tak ada yang terbit atau terbenam, dan separuh langit tersembunyi selamanya. Di ekuator, kutub langit berada tepat di ufuk, tak ada yang sirkumpolar, dan sepanjang tahun Anda dapat melihat seluruh bintang di langit.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var R = 175;                                          // sphere1.size = sphere2.size = 350
    var P1 = { x: 10, y: 38, w: 433, h: 449 }, P2 = { x: 456.5, y: 38, w: 433, h: 449 };
    var C1 = { x: 226.7, y: 262 }, C2 = { x: 673.3, y: 262 };
    var MAPW = 480, MAPH = 240;                           // the map canvas, 2:1 — one
                                                          // degree of longitude and one
                                                          // of latitude are the same size
    var EQ = "#ffe375", MER = "#e0e0e0", AX = "#75a9ff";
    var C_RISE = "#e0e0e0", C_NEVER = "#606060", C_CIRC = "#e06060";
    var C_RA = "#ffb130", C_DEC = "#ffff70", C_AZ = "#c0c0ff", C_ALT = "#ffffff", C_ANG = "#d0d0d0";

    /* ---- state, at onReset()'s values ---- */
    var time = 0, rate = 0.05;                            // days, and days per second
    var obsLat = 40.8, obsLon = -96.7;                    // setLocation({lon:-96.7, lat:40.8})
    var v1 = { th: 100, ph: 20 }, v2 = { th: 145, ph: 30 };
    var stars = [], selected = null, starCounter = 0, STAR_LIMIT = 50;
    var maxTrail = 0, animateTill = null, drag = null;
    var show = { labels: false, zeroh: true, eq: true, under: true,
      never: false, riseset: false, circum: false, angle: false };

    var CONSTELLATIONS = {                                // the SWF's own catalogue
      orion: { stars: [[5.91953, 7.40706], [5.67931, -1.94257], [5.60356, -1.20192],
        [5.53344, -0.29909], [5.41885, 6.3497], [5.79594, -9.6696], [5.2423, -8.20164]],
        paths: [[0, 1, 2, 3, 4], [1, 5], [3, 6]] },
      dipper: { stars: [[11.06215, 61.75092], [11.03068, 56.38236], [11.89717, 53.69475],
        [12.25709, 57.03258], [12.90048, 55.95989], [13.39875, 54.92539], [13.79235, 49.31336]],
        paths: [[0, 1, 2, 3, 4, 5, 6]] },
      cross: { stars: [[12.4433, -63.09905], [12.51943, -57.11321], [12.79535, -59.68876],
        [12.25242, -58.74893]], paths: [[0, 1], [2, 3]] }
    };
    var shown = { orion: false, dipper: false, cross: false };   // constellations.inUse

    /* ================================ controls =============================== */
    var PANEL = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    S.group("rs.loc");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "rs.hint");
    PANEL.appendChild(hint);
    var latCtl = S.slider({ labelKey: "rs.lat", min: -90, max: 90, value: obsLat, step: 0.1,
      format: function (v) { return Math.abs(v).toFixed(1) + "° " + (v < 0 ? "S" : "N"); },
      on: function (v) { obsLat = v; upd(); drawMap(); } });
    var lonCtl = S.slider({ labelKey: "rs.lon", min: -180, max: 180, value: obsLon, step: 0.1,
      format: function (v) { return Math.abs(v).toFixed(1) + "° " + (v < 0 ? "W" : "E"); },
      on: function (v) { obsLon = v; upd(); drawMap(); } });

    var mapCv = document.createElement("canvas");
    mapCv.className = "ce-map";
    var mdpr = Math.min(window.devicePixelRatio || 1, 2);
    mapCv.width = Math.round(MAPW * mdpr); mapCv.height = Math.round(MAPH * mdpr);
    var mctx = mapCv.getContext("2d");
    mctx.setTransform(mdpr, 0, 0, mdpr, 0, 0);
    var mapWrap = document.createElement("div");
    mapWrap.className = "ctl ce-map-wrap";
    mapWrap.appendChild(mapCv);
    PANEL.appendChild(mapWrap);

    S.group("rs.anim");
    var forCtl = S.select({ labelKey: "rs.for", value: "0", options: [
      { v: "0", labelKey: "rs.cont" }, { v: "1", labelKey: "rs.hour1" },
      { v: "3", labelKey: "rs.h3" }, { v: "6", labelKey: "rs.h6" },
      { v: "12", labelKey: "rs.h12" }, { v: "24", labelKey: "rs.h24" }
    ], on: function () {} });
    var playBtn = S.button({ label: "", primary: true, on: toggleAnimation });
    S.slider({ labelKey: "rs.rate", min: 0.005, max: 0.4, value: rate, step: 0.005,
      format: function (v) { return (v * 24).toFixed(1) + " h/s"; },
      on: function (v) { rate = v; } });

    S.group("rs.look");
    var checks = {};
    [["labels", "rs.labels"], ["zeroh", "rs.zeroh"], ["eq", "rs.eq"], ["under", "rs.under"],
     ["never", "rs.never"], ["riseset", "rs.riseset"], ["circum", "rs.circum"],
     ["angle", "rs.angle"]].forEach(function (p) {
      checks[p[0]] = S.toggle({ labelKey: p[1], value: show[p[0]],
        on: (function (k) { return function (b) { show[k] = b; S.requestDraw(); }; })(p[0]) });
    });

    S.group("rs.stars");
    S.button({ labelKey: "rs.add", on: function () {
      addStar(24 * Math.random(), 180 * Math.random() - 90); S.requestDraw();
    } });
    S.button({ labelKey: "rs.clear", on: function () {   // removeAllStars()
      stars = []; selected = null;
      Object.keys(patChecks).forEach(function (k) { patChecks[k].set(false); });
      S.requestDraw();
    } });
    /* The SWF's "star patterns..." menu is a list of checkmarks, not a picker:
       onConstellationToggled flips one constellation's inUse flag and leaves the
       others alone, so all three can be up at once. One checkbox each.       */
    var patBox = document.createElement("div");
    patBox.className = "ctl ce-pat";
    var patLabel = document.createElement("label");
    patLabel.setAttribute("data-i18n", "rs.pattern");
    patBox.appendChild(patLabel);
    PANEL.appendChild(patBox);
    var patChecks = {};
    [["orion", "rs.orion"], ["dipper", "rs.dipper"], ["cross", "rs.cross"]]
      .forEach(function (p) {
        patChecks[p[0]] = S.toggle({ labelKey: p[1], value: false,
          on: (function (k) { return function (b) { showConstellation(k, b); }; })(p[0]) });
        patBox.appendChild(PANEL.lastElementChild);      // tuck it under the label
      });
    S.select({ labelKey: "rs.trail", value: "none", options: [
      { v: "none", labelKey: "rs.tnone" }, { v: "short", labelKey: "rs.tshort" },
      { v: "long", labelKey: "rs.tlong" }
    ], on: function (v) {                                 // changeTrailType()
      maxTrail = v === "none" ? 0 : (v === "short" ? 45 : 360);
      stars.forEach(function (s) { s.trail = Math.min(s.trail, maxTrail); });
      S.requestDraw();
    } });
    S.button({ labelKey: "rs.reset", on: function () {
      stars.forEach(function (s) { s.trail = 0; }); S.requestDraw();
    } });
    var outTime = S.readout({ labelKey: "rs.rTime" });
    var outSid = S.readout({ labelKey: "rs.rSid" });
    var outStar = S.readout({ labelKey: "rs.rStar" });

    /* ------------------------------- the model ------------------------------ */
    function siderealTime() {                             // update(): (lon + 360·frac) / 15
      return (obsLon + (time - Math.floor(time)) * 360) / 15;
    }
    function addStar(ra, dec, cons) {
      if (!cons && stars.length >= STAR_LIMIT) return null;
      var s = { id: ++starCounter, ra: ra, dec: dec, trail: 0, cons: cons || null };
      stars.push(s);
      return s;
    }
    function showConstellation(key, on) {              // add/removeConstellation()
      if (shown[key] === on) return;
      shown[key] = on;
      if (on) {
        CONSTELLATIONS[key].stars.forEach(function (p, i) {
          var s = addStar(p[0], p[1], key); s.idx = i;
        });
      } else {
        stars = stars.filter(function (s) { return s.cons !== key; });
        if (selected && selected.cons === key) selected = null;
      }
      upd();
    }
    function toggleAnimation() {
      if (loop.playing) { loop.pause(); animateTill = null; }
      else {
        var h = parseInt(forCtl.value(), 10);
        animateTill = h === 0 ? null : time + h / 24;
        loop.play();
      }
      syncPlay();
    }
    function syncPlay() {
      playBtn.textContent = I18N.t(loop.playing ? "rs.pause" : "rs.start");
    }
    var loop = S.loop(function (dt) {                     // onEnterFrameFunc
      var t0 = time;
      time += rate * dt;
      if (animateTill !== null && time > animateTill) {
        time = animateTill; loop.pause(); animateTill = null; syncPlay();
      }
      if (maxTrail) {                                     // growStarTrails(360·Δtime)
        var g = 360 * (time - t0);
        stars.forEach(function (s) {
          s.trail = Math.min(maxTrail, s.trail + g);
        });
      }
      upd();
    });

    function upd() {
      var sid = ((siderealTime() % 24) + 24) % 24;
      outTime((time * 24).toFixed(2) + " h");
      outSid(hms(sid));
      if (selected) {
        var h = toHorizon(selected.ra, selected.dec);
        outStar("RA " + selected.ra.toFixed(1) + "h  dec " + selected.dec.toFixed(1) + "°  |  " +
          "az " + h.az.toFixed(1) + "°  alt " + h.alt.toFixed(1) + "°");
      } else outStar(I18N.t("rs.nostar"));
      S.requestDraw();
    }
    function hms(h) {
      var m = Math.floor((h % 1) * 60);
      return Math.floor(h) + "h " + (m < 10 ? "0" : "") + m + "m";
    }
    S.refreshers.push(function () { syncPlay(); upd(); });

    /* ============ the CelestialSphere projection, one per panel ============== */
    function makeMats(view, latDeg, sTh) {
      var ct = Math.cos(view.th * RAD), st = Math.sin(view.th * RAD);
      var cp = Math.cos(view.ph * RAD), sp = Math.sin(view.ph * RAD);
      var a = { a0: -R * st, a1: R * ct, a3: R * ct * sp, a4: R * st * sp, a5: -R * cp,
        a6: R * ct * cp, a7: R * st * cp, a8: R * sp };
      var L = latDeg * RAD, sT = sTh / 24 * TAU;
      var m2 = Math.cos(L), m3 = Math.sin(sT), m4 = -Math.cos(sT), m8 = Math.sin(L);
      var m = { m0: m4 * m8, m1: -m3 * m8, m2: m2, m3: m3, m4: m4,
        m6: -m2 * m4, m7: m2 * m3, m8: m8 };
      var b = {
        b0: a.a0 * m.m0 + a.a1 * m.m3, b1: a.a0 * m.m1 + a.a1 * m.m4, b2: a.a0 * m.m2,
        b3: a.a3 * m.m0 + a.a4 * m.m3 + a.a5 * m.m6, b4: a.a3 * m.m1 + a.a4 * m.m4 + a.a5 * m.m7,
        b5: a.a3 * m.m2 + a.a5 * m.m8,
        b6: a.a6 * m.m0 + a.a7 * m.m3 + a.a8 * m.m6, b7: a.a6 * m.m1 + a.a7 * m.m4 + a.a8 * m.m7,
        b8: a.a6 * m.m2 + a.a8 * m.m8 };
      return { a: a, m: m, b: b };
    }
    function Sphere(centre, view, latOf, sTOf) {
      this.c = centre; this.view = view; this.latOf = latOf; this.sTOf = sTOf;
    }
    Sphere.prototype.sync = function () {
      this.M = makeMats(this.view, this.latOf(), this.sTOf());
      return this;
    };
    Sphere.prototype.h = function (v, r) {                // horizon vector → screen
      var a = this.M.a, k = (r === undefined ? R : r) / R;
      return { x: this.c.x + (v.x * a.a0 + v.y * a.a1) * k,
        y: this.c.y + (v.x * a.a3 + v.y * a.a4 + v.z * a.a5) * k,
        z: (v.x * a.a6 + v.y * a.a7 + v.z * a.a8) * k };
    };
    Sphere.prototype.cel = function (v, r) {              // celestial vector → screen
      var b = this.M.b, k = (r === undefined ? R : r) / R;
      return { x: this.c.x + (v.x * b.b0 + v.y * b.b1 + v.z * b.b2) * k,
        y: this.c.y + (v.x * b.b3 + v.y * b.b4 + v.z * b.b5) * k,
        z: (v.x * b.b6 + v.y * b.b7 + v.z * b.b8) * k };
    };
    function cart(ra, dec) {
      var d = dec * RAD, h = ra * 15 * RAD;
      return { x: Math.cos(d) * Math.cos(h), y: Math.cos(d) * Math.sin(h), z: Math.sin(d) };
    }
    function hCart(az, alt) {
      var A = -az * RAD, h = alt * RAD;
      return { x: Math.cos(h) * Math.cos(A), y: Math.cos(h) * Math.sin(A), z: Math.sin(h) };
    }
    function toHorizon(ra, dec) {                         // celestial → alt/az via m
      var p = cart(ra, dec), m = makeMats(v2, obsLat, siderealTime()).m;
      var x = p.x * m.m0 + p.y * m.m1 + p.z * m.m2;
      var y = p.x * m.m3 + p.y * m.m4 + p.z * m.m5;
      var z = p.x * m.m6 + p.y * m.m7 + p.z * m.m8;
      void y;
      var alt = Math.asin(Math.max(-1, Math.min(1, z))) * DEG;
      var yh = p.x * m.m3 + p.y * m.m4;
      var az = ((-Math.atan2(yh, x) * DEG) % 360 + 360) % 360;
      return { az: az, alt: alt };
    }
    var sph1 = new Sphere(C1, v1, function () { return 90; }, function () { return 0; });
    var sph2 = new Sphere(C2, v2, function () { return obsLat; }, siderealTime);

    /* addCircle's doW, gamma running gS → gE */
    function circlePts(p, n) {
      var st = Math.sin((p.tilt || 0) * RAD), ct = Math.cos((p.tilt || 0) * RAD);
      var beta = p.sys ? (p.ra || 0) * 15 * RAD : -(p.az || 0) * RAD;
      var lam = (p.sys ? (p.dec || 0) : (p.alt || 0)) * RAD;
      var sb = Math.sin(beta), cb = Math.cos(beta), cl = Math.cos(lam), sl = Math.sin(lam);
      var gS = mod(p.gS === undefined ? 0 : p.gS, 360) * RAD;
      var span = p.gS === undefined ? TAU : (mod(p.gE - p.gS, 360) * RAD || TAU);
      var out = [];
      for (var i = 0; i <= n; i++) {
        var g = gS + span * i / n, cg = Math.cos(g), sg = Math.sin(g);
        out.push({ x: cl * cb * cg - cl * sb * ct * sg + sl * sb * st,
          y: cl * sb * cg + cl * cb * ct * sg - sl * cb * st,
          z: cl * st * sg + sl * ct });
      }
      return out;
    }
    function strokeArc(ctx, sp, p, front, colour, alpha, width) {
      var pts = circlePts(p, p.gS === undefined ? 240 : 120);
      ctx.strokeStyle = colour; ctx.globalAlpha = alpha; ctx.lineWidth = width;
      ctx.beginPath();
      var started = false, prev = null;
      for (var i = 0; i < pts.length; i++) {
        var q = p.sys ? sp.cel(pts[i]) : sp.h(pts[i]);
        if (front !== null && (q.z >= 0) !== front) { started = false; prev = q; continue; }
        if (!started) {
          if (prev && front !== null) {
            var k = prev.z / (prev.z - q.z);
            ctx.moveTo(prev.x + (q.x - prev.x) * k, prev.y + (q.y - prev.y) * k);
          } else ctx.moveTo(q.x, q.y);
          started = true;
        } else ctx.lineTo(q.x, q.y);
        prev = q;
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    function mod(n, m) { return ((n % m) + m) % m; }

    /* ------------------------------- interaction ---------------------------- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function starAt(p) {
      var best = null, bd = 9;
      [sph1, sph2].forEach(function (sp, i) {
        stars.forEach(function (s) {
          var q = sp.cel(cart(s.ra, s.dec));
          if (q.z < 0) return;
          var d = Math.hypot(q.x - p.x, q.y - p.y);
          if (d < bd) { bd = d; best = { star: s, panel: i }; }
        });
      });
      return best;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      var hit = starAt(p);
      if (hit) {
        selected = hit.star;
        drag = hit.star.cons ? null : { star: hit.star, panel: hit.panel };
        upd();
      } else {
        var inside1 = Math.hypot(p.x - C1.x, p.y - C1.y) <= R;
        var inside2 = Math.hypot(p.x - C2.x, p.y - C2.y) <= R;
        if (!inside1 && !inside2) { selected = null; upd(); return; }
        var v = inside1 ? v1 : v2;
        drag = { x: p.x, y: p.y, th: v.th, ph: v.ph, view: v, min: inside2 ? 7 : -90 };
      }
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.star) {                                    // moveStar
        var sp = drag.panel ? sph2 : sph1;
        var v = unproject(sp, p);
        if (v) {
          var c = drag.panel ? horizonToCel(v) : v;
          drag.star.dec = Math.asin(Math.max(-1, Math.min(1, c.z))) * DEG;
          drag.star.ra = mod(Math.atan2(c.y, c.x) * DEG / 15, 24);
          drag.star.trail = 0;
          upd();
        }
        return;
      }
      var k = DEG / R;                                    // the engine's 57.2958 / _c.r
      drag.view.th = mod(drag.th - k * (p.x - drag.x), 360);
      drag.view.ph = Math.max(drag.min, Math.min(90, drag.ph + k * (p.y - drag.y)));
      upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
    });
    /* ---- picking a location off the map ---- */
    var mapDrag = false;
    function mapAt(ev) {
      var r = mapCv.getBoundingClientRect();
      return { x: (ev.clientX - r.left) / r.width * MAPW,
        y: (ev.clientY - r.top) / r.height * MAPH };
    }
    mapCv.addEventListener("pointerdown", function (ev) {
      mapDrag = true; mapCv.setPointerCapture(ev.pointerId);
      setFromMap(mapAt(ev)); ev.preventDefault();
    });
    mapCv.addEventListener("pointermove", function (ev) {
      if (mapDrag) setFromMap(mapAt(ev));
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      mapCv.addEventListener(e, function () { mapDrag = false; });
    });
    function setFromMap(p) {
      var lon = p.x / MAPW * 360 - 180;
      var la = 90 - p.y / MAPH * 180;
      latCtl.set(Math.round(Math.max(-90, Math.min(90, la)) * 10) / 10);
      lonCtl.set(Math.round(Math.max(-180, Math.min(180, lon)) * 10) / 10);
    }
    /* screen point → the unit vector on the near face (the matrix is orthonormal
       up to the factor R, so its transpose inverts it)                          */
    function unproject(sp, p) {
      var X = (p.x - sp.c.x) / R, Y = (p.y - sp.c.y) / R, s2 = 1 - X * X - Y * Y;
      if (s2 < 0) return null;
      var Z = Math.sqrt(s2), b = sp.M.b;
      return { x: (b.b0 * X + b.b3 * Y + b.b6 * Z) / R,
        y: (b.b1 * X + b.b4 * Y + b.b7 * Z) / R,
        z: (b.b2 * X + b.b5 * Y + b.b8 * Z) / R };
    }
    function horizonToCel(v) { return v; }                // cel() already carries m

    /* ================================= drawing =============================== */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, S.W, S.H);
      sph1.sync(); sph2.sync();
      panel(ctx, P1, tr("rs.celestial"));
      panel(ctx, P2, tr("rs.horizon"));
      ctx.save(); ctx.beginPath(); ctx.rect(P1.x, P1.y, P1.w, P1.h); ctx.clip();
      drawCelestialView(ctx, tr); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(P2.x, P2.y, P2.w, P2.h); ctx.clip();
      drawHorizonView(ctx, tr); ctx.restore();
    });
    function panel(ctx, P, title) {
      ctx.fillStyle = "#000000"; ctx.fillRect(P.x, P.y, P.w, P.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(P.x + 0.5, P.y + 0.5, P.w - 1, P.h - 1);
      ctx.fillStyle = "#bbbbbb"; ctx.font = "italic 12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(title, P.x + 8, P.y + 8);
    }
    /* Shading Layers A and B. Identical for both spheres and unchanging, so bake
       it once: painting this gradient live costs about 4 ms a disc, which two
       spheres cannot afford inside a 60 fps frame.                            */
    var washTile = null;
    function wash() {
      if (washTile) return washTile;
      var N = 2 * R;
      washTile = document.createElement("canvas");
      washTile.width = washTile.height = N;
      var g2 = washTile.getContext("2d");
      var g = g2.createRadialGradient(R, R, 0, R, R, R);
      g.addColorStop(0, "rgba(38,38,38,0.86)"); g.addColorStop(1, "rgba(65,65,65,0.86)");
      g2.fillStyle = g;
      g2.beginPath(); g2.arc(R, R, R, 0, TAU); g2.fill();
      return washTile;
    }
    function shade(ctx, sp) {
      ctx.drawImage(wash(), sp.c.x - R, sp.c.y - R, 2 * R, 2 * R);
    }
    function clipDisc(ctx, sp) { ctx.beginPath(); ctx.arc(sp.c.x, sp.c.y, R, 0, TAU); ctx.clip(); }
    function axis(ctx, sp, front) {
      ctx.strokeStyle = AX; ctx.lineWidth = 2;
      [1, -1].forEach(function (k) {
        var p1 = sp.cel({ x: 0, y: 0, z: k }), p2 = sp.cel({ x: 0, y: 0, z: 1.2 * k });
        if ((p1.z >= 0) !== front) return;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      });
    }
    /* the three declination bands: what never rises, what rises and sets, what
       never sets — the limits are ±(90 − |latitude|)                           */
    function bands() {
      var out = [];
      var lim = 90 - Math.abs(obsLat);
      if (Math.abs(obsLat) >= 90) {
        if (obsLat > 0) {
          out.push({ d1: -90, d2: 0, c: C_NEVER, on: show.never });
          out.push({ d1: 0, d2: 90, c: C_CIRC, on: show.circum });
        } else {
          out.push({ d1: 0, d2: 90, c: C_NEVER, on: show.never });
          out.push({ d1: -90, d2: 0, c: C_CIRC, on: show.circum });
        }
      } else if (obsLat === 0) {
        out.push({ d1: -90, d2: 90, c: C_RISE, on: show.riseset });
      } else if (obsLat > 0) {
        out.push({ d1: -lim, d2: lim, c: C_RISE, on: show.riseset });
        out.push({ d1: -90, d2: -lim, c: C_NEVER, on: show.never });
        out.push({ d1: lim, d2: 90, c: C_CIRC, on: show.circum });
      } else {
        out.push({ d1: -lim, d2: lim, c: C_RISE, on: show.riseset });
        out.push({ d1: lim, d2: 90, c: C_NEVER, on: show.never });
        out.push({ d1: -90, d2: -lim, c: C_CIRC, on: show.circum });
      }
      return out.filter(function (b) { return b.on; });
    }
    /* The bands are declination ranges, so they are invariant under the sky's
       daily turn — only the viewpoint and the latitude change them. Render each
       face per pixel (the projection matrix is orthonormal up to R, so its
       transpose inverts it) and cache on the viewpoint.                        */
    var bandCache = {};
    function drawBands(ctx, sp, front) {
      var bs = bands();
      if (!bs.length) return;
      if (front) {                                       // the borders ride both faces
        ctx.save(); clipDisc(ctx, sp);
        bs.forEach(function (b) {                        // 1 px #808080 borders
          [b.d1, b.d2].forEach(function (d) {
            if (Math.abs(d) >= 90) return;
            strokeArc(ctx, sp, { sys: 1, tilt: 0, dec: d, ra: 0 }, true, "#808080", 1, 1);
            strokeArc(ctx, sp, { sys: 1, tilt: 0, dec: d, ra: 0 }, false, "#808080", 0.45, 1);
          });
        });
        ctx.restore();
        return;
      }
      var key = [sp.view.th.toFixed(1), sp.view.ph.toFixed(1), sp.latOf().toFixed(2),
        bs.map(function (b) { return b.d1 + ":" + b.d2 + b.c; }).join()].join("|");
      if (!bandCache[key]) {
        if (Object.keys(bandCache).length > 24) bandCache = {};
        bandCache[key] = bandLayer(sp, bs);
      }
      ctx.drawImage(bandCache[key], sp.c.x - R, sp.c.y - R, 2 * R, 2 * R);
    }
    /* 'full' shaded bands: one 30 % layer over the union of the two faces */
    function bandLayer(sp, bs) {
      var q = 1, N = Math.round(2 * R * q);
      var cv = document.createElement("canvas"); cv.width = cv.height = N;
      var g = cv.getContext("2d"), img = g.createImageData(N, N), px = img.data;
      var b = sp.M.b;
      var cols = bs.map(function (x) {
        return [parseInt(x.c.slice(1, 3), 16), parseInt(x.c.slice(3, 5), 16),
          parseInt(x.c.slice(5, 7), 16), x.d1, x.d2];
      });
      for (var j = 0; j < N; j++) {
        var Y = (j + 0.5) / (N / 2) - 1;
        for (var i = 0; i < N; i++) {
          var X = (i + 0.5) / (N / 2) - 1, s2 = 1 - X * X - Y * Y;
          if (s2 < 0) continue;
          var Zf = Math.sqrt(s2), hit = -1;
          for (var f = 0; f < 2 && hit < 0; f++) {
            var Z = f ? -Zf : Zf;
            var z = (b.b2 * X + b.b5 * Y + b.b8 * Z) / R; // the celestial z = sin(dec)
            var dec = Math.asin(Math.max(-1, Math.min(1, z))) * DEG;
            for (var k = 0; k < cols.length; k++) {
              if (dec >= cols[k][3] && dec <= cols[k][4]) { hit = k; break; }
            }
          }
          if (hit >= 0) {
            var o = 4 * (j * N + i);
            px[o] = cols[hit][0]; px[o + 1] = cols[hit][1]; px[o + 2] = cols[hit][2];
            px[o + 3] = 77;                               // alpha 30 %
          }
        }
      }
      g.putImageData(img, 0, 0);
      return cv;
    }
    /* "show underside" off: black out the part of the sphere below the horizon */
    var underCache = {};
    function undersideCover(ctx, sp) {
      var key = [sp.view.th.toFixed(1), sp.view.ph.toFixed(1)].join();
      if (!underCache[key]) {
        if (Object.keys(underCache).length > 24) underCache = {};
        var N = Math.round(2 * R);
        var cv = document.createElement("canvas"); cv.width = cv.height = N;
        var g = cv.getContext("2d"), img = g.createImageData(N, N), px = img.data;
        var a = sp.M.a;
        for (var j = 0; j < N; j++) {
          var Y = (j + 0.5) / (N / 2) - 1;
          for (var i = 0; i < N; i++) {
            var X = (i + 0.5) / (N / 2) - 1, s2 = 1 - X * X - Y * Y;
            if (s2 < 0) continue;
            var Z = Math.sqrt(s2);
            var alt = (a.a5 * Y + a.a8 * Z) / R;          // the horizon z = sin(alt)
            if (alt >= 0) continue;
            var o = 4 * (j * N + i);
            px[o + 3] = 255;
          }
        }
        g.putImageData(img, 0, 0);
        underCache[key] = cv;
      }
      ctx.drawImage(underCache[key], sp.c.x - R, sp.c.y - R, 2 * R, 2 * R);
    }
    function skyCircles(ctx, sp, front, withMeridian3) {
      ctx.save(); clipDisc(ctx, sp);
      strokeArc(ctx, sp, { sys: 0, tilt: 90, az: 0, alt: 0 }, front, MER, 0.30, 1);
      strokeArc(ctx, sp, { sys: 0, tilt: 90, az: 90, alt: 0 }, front, MER, 0.30, 1);
      if (withMeridian3) strokeArc(ctx, sp, { sys: 0, tilt: 0, az: 0, alt: 0 }, front, MER, 0.30, 1);
      if (show.zeroh) {
        strokeArc(ctx, sp, { sys: 1, tilt: 90, dec: 0, ra: 0, gS: -90, gE: 90 }, front, EQ, 1, 1);
      }
      if (show.eq) strokeArc(ctx, sp, { sys: 1, tilt: 0, dec: 0, ra: 0 }, front, EQ, 1, 1);
      ctx.restore();
    }
    function drawStars(ctx, sp, front, withTrails) {
      if (withTrails && maxTrail) {
        ctx.save(); clipDisc(ctx, sp);
        stars.forEach(function (s) {
          if (s.trail <= 0) return;
          var p = s.trail >= 360
            ? { sys: 1, tilt: 0, dec: s.dec, ra: 0 }
            : { sys: 1, tilt: 0, dec: s.dec, ra: 0, gS: s.ra * 15, gE: s.ra * 15 + s.trail };
          strokeArc(ctx, sp, p, front, "#ffffff", 0.60, 1);
        });
        ctx.restore();
      }
      constellationArcs(ctx, sp, front);
      stars.forEach(function (s) {
        var q = sp.cel(cart(s.ra, s.dec));
        if ((q.z >= 0) !== front) return;
        starGlyph(ctx, q.x, q.y, s === selected);
      });
    }
    function constellationArcs(ctx, sp, front) {       // updateConstellationArcs()
      var keys = Object.keys(CONSTELLATIONS).filter(function (k) { return shown[k]; });
      if (!keys.length) return;
      ctx.save(); clipDisc(ctx, sp);
      ctx.strokeStyle = "#ffffff"; ctx.globalAlpha = 0.80; ctx.lineWidth = 1;
      keys.forEach(function (k) {
        var pts = stars.filter(function (s) { return s.cons === k; });
        if (!pts.length) return;
        CONSTELLATIONS[k].paths.forEach(function (path) {
          for (var i = 0; i + 1 < path.length; i++) {
            greatArc(ctx, sp, pts[path[i]], pts[path[i + 1]], front);
          }
        });
      });
      ctx.globalAlpha = 1; ctx.restore();
    }
    function greatArc(ctx, sp, a, b, front) {             // setArcPoints: the short way round
      if (!a || !b) return;
      var u = cart(a.ra, a.dec), v = cart(b.ra, b.dec);
      var dot = Math.max(-1, Math.min(1, u.x * v.x + u.y * v.y + u.z * v.z));
      var om = Math.acos(dot);
      if (om < 1e-6) return;
      ctx.beginPath();
      var open = false;
      for (var i = 0; i <= 40; i++) {
        var t2 = i / 40;
        var s1 = Math.sin((1 - t2) * om) / Math.sin(om), s2 = Math.sin(t2 * om) / Math.sin(om);
        var q = sp.cel({ x: u.x * s1 + v.x * s2, y: u.y * s1 + v.y * s2, z: u.z * s1 + v.z * s2 });
        if ((q.z >= 0) !== front) { open = false; continue; }
        if (!open) { ctx.moveTo(q.x, q.y); open = true; } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
    }
    function starGlyph(ctx, x, y, sel) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {                       // a small four-pointed star
        var a = i * Math.PI / 4, r = i % 2 ? 1.8 : 5.5;
        var px = Math.cos(a) * r, py = Math.sin(a) * r;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.fill();
      if (sel) {
        ctx.strokeStyle = "#ffcc33"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, 0, 8.5, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    }
    function label(ctx, x, y, text, colour, size) {
      ctx.fillStyle = colour;
      ctx.font = (size || 11) + "px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, x, y);
    }
    function skyLabels(ctx, sp, horizonSide) {
      if (!show.labels) return;
      var pts = [
        { p: cart(0, 85), r: 1.13, t: I18N.t("rs.ncp"), c: "#bbbbbb" },
        { p: cart(0, -85), r: 1.13, t: I18N.t("rs.scp"), c: "#bbbbbb" }
      ];
      if (show.eq) pts.push({ p: cart(3, 0), r: 1.1, t: I18N.t("rs.ceq"), c: EQ });
      if (show.zeroh) pts.push({ p: cart(0, 45), r: 1.1, t: I18N.t("rs.zh"), c: EQ });
      pts.forEach(function (o) {
        var q = sp.cel(o.p, R * o.r);
        label(ctx, q.x, q.y, o.t, o.c);
      });
      if (horizonSide) {
        [[180, 45, I18N.t("rs.mer")], [0, 90, I18N.t("rs.zen")], [0, -90, I18N.t("rs.nad")]]
          .forEach(function (o) {
            var q = sp.h(hCart(o[0], o[1]), R * 1.1);
            label(ctx, q.x, q.y, o[2], "#bbbbbb");
          });
      }
    }
    /* ---- left panel: the celestial sphere, with Earth turning at its centre -- */
    function drawCelestialView(ctx, tr) {
      var sp = sph1;
      axis(ctx, sp, false);
      ctx.save(); clipDisc(ctx, sp);
      skyCircles(ctx, sp, false, true);
      drawStars(ctx, sp, false, false);
      ctx.restore();
      shade(ctx, sp);
      drawBands(ctx, sp, false);
      earth(ctx, sp);
      drawBands(ctx, sp, true);
      skyCircles(ctx, sp, true, true);
      drawStars(ctx, sp, true, false);
      if (selected) celestialArcs(ctx, sp);
      axis(ctx, sp, true);
      skyLabels(ctx, sp, false);
      void tr;
    }
    /* ---- right panel: the same sky seen from the observer's horizon --------- */
    function drawHorizonView(ctx, tr) {
      var sp = sph2;
      axis(ctx, sp, false);
      ctx.save(); clipDisc(ctx, sp);
      skyCircles(ctx, sp, false, false);
      drawStars(ctx, sp, false, true);
      ctx.restore();
      shade(ctx, sp);
      drawBands(ctx, sp, false);
      horizonPlane(ctx, sp, tr);
      stickfigure(ctx, sp);
      drawBands(ctx, sp, true);
      skyCircles(ctx, sp, true, false);
      drawStars(ctx, sp, true, true);
      if (show.angle) angleMarks(ctx, sp);
      if (selected) horizonArcs(ctx, sp);
      axis(ctx, sp, true);
      skyLabels(ctx, sp, true);
    }
    function horizonPlane(ctx, sp, tr) {
      if (!show.under) { ctx.save(); clipDisc(ctx, sp); undersideCover(ctx, sp); ctx.restore(); }
      var e = sp.h(hCart(90, 0)), n = sp.h(hCart(0, 0));
      var ex = e.x - sp.c.x, ey = e.y - sp.c.y, nx = n.x - sp.c.x, ny = n.y - sp.c.y;
      ctx.save();
      ctx.transform(ex / 100, ey / 100, -nx / 100, -ny / 100, sp.c.x, sp.c.y);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 101.4);
      g.addColorStop(0, "#5ac55a"); g.addColorStop(1, "#3aa53a");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 15px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(tr("rs.N"), 0, -73.85);
      ctx.fillText(tr("rs.S"), 0, 86.15);
      ctx.fillText(tr("rs.E"), 81.93, 6.35);
      ctx.fillText(tr("rs.W"), -77.08, 6.35);
      ctx.restore();
    }
    function stickfigure(ctx, sp) {
      var zen = sp.h(hCart(0, 90));
      var vx = zen.x - sp.c.x, vy = zen.y - sp.c.y, vl = Math.hypot(vx, vy) || 1;
      vx /= vl; vy /= vl;
      ctx.save();
      ctx.transform(vy, -vx, -vx, -vy, sp.c.x, sp.c.y);
      ctx.scale(1.2, 1.2);                                // _xscale/_yscale = 120
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, -7); ctx.lineTo(0, -21);
      ctx.moveTo(-7, -11); ctx.lineTo(7, -15);
      ctx.moveTo(0, -7); ctx.lineTo(-5, 0);
      ctx.moveTo(0, -7); ctx.lineTo(5, 0);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -24.5, 3.5, 0, TAU);
      ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    /* globeSphere: size 60 with the Earth art at scale 75, turning once a day  */
    /* globeSphere: size 60 → radius 30, and GlobeComponent.setScale(75) puts its
       art at _radius 40 × 0.75 = 30, so the art fills the sphere.

       Folding the two rotations the SWF applies — the globe's own q matrix
       (rotationAngle 360·frac(time) on top of the sphere's sidereal time) and the
       sphere's celestial→horizon matrix at latitude 90 — leaves a single spin
       about the polar axis: 180° + 360·frac(time) for the land, and the same plus
       the observer's longitude for anything fixed to the observer. That is what
       lands the observer's dot on their own meridian.                          */
    var ER = 30, waterFill = null, landFill = null, limbFill = null;
    function earthFills(ctx) {                   // built once, in globe units
      if (waterFill) return;
      function rad(inner, outer) {
        var g = ctx.createRadialGradient(ER * 0.25, -ER * 0.15, ER * 0.04,
          ER * 0.25, -ER * 0.15, ER * 1.30);
        g.addColorStop(0, inner); g.addColorStop(1, outer);
        return g;
      }
      waterFill = rad("#d0d8fa", "#8a93cf");
      landFill = rad("#cdad78", "#8d7348");
      limbFill = ctx.createRadialGradient(0, 0, ER * 0.55, 0, 0, ER);
      limbFill.addColorStop(0, "rgba(36,42,86,0)");
      limbFill.addColorStop(1, "rgba(36,42,86,0.28)");
    }
    function earth(ctx, sp) {
      earthFills(ctx);
      var rot = (time - Math.floor(time)) * 360;
      var a = makeMats(v1, 90, 0).a;               // the globe keeps sphere1's view
      function gp(v) {                             // globe units, about its centre
        var k = ER / R;
        return { x: (v.x * a.a0 + v.y * a.a1) * k,
          y: (v.x * a.a3 + v.y * a.a4 + v.z * a.a5) * k,
          z: v.x * a.a6 + v.y * a.a7 + v.z * a.a8 };
      }
      var land = EARTH.spin(180 + rot), fixed = EARTH.spin(180 + obsLon + rot);
      ctx.save();
      ctx.translate(sp.c.x, sp.c.y);
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, ER, 0, TAU); ctx.clip();
      ctx.fillStyle = waterFill;
      ctx.fillRect(-ER, -ER, 2 * ER, 2 * ER);
      ctx.beginPath();
      EARTH.landPath(ctx, function (x, y, z) { return gp(land(x, y, z)); }, ER);
      ctx.fillStyle = landFill;
      ctx.fill("evenodd");
      ctx.fillStyle = limbFill;
      ctx.fillRect(-ER, -ER, 2 * ER, 2 * ER);
      ctx.restore();
      ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = 1;
      ringPath(ctx, function (u) {                 // latitudeCircle, dec = latitude
        var la = obsLat * RAD, g = u * TAU;
        return gp(fixed(Math.cos(la) * Math.cos(g), Math.cos(la) * Math.sin(g), Math.sin(la)));
      });
      var dot = gp(fixed(Math.cos(obsLat * RAD), 0, Math.sin(obsLat * RAD)));
      if (dot.z >= 0) {                            // the observer, on their meridian
        ctx.beginPath(); ctx.arc(dot.x, dot.y, 2.2, 0, TAU);
        ctx.fillStyle = "#ff3b30"; ctx.fill();
      }
      ctx.restore();
    }
    function ringPath(ctx, fn) {
      ctx.beginPath();
      var open = false;
      for (var i = 0; i <= 120; i++) {
        var q = fn(i / 120);
        if (q.z < 0) { open = false; continue; }
        if (!open) { ctx.moveTo(q.x, q.y); open = true; } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
    }

    /* ---- the selected star's coordinate arcs, as updateCelestialArcs did ---- */
    function celestialArcs(ctx, sp) {
      var s = selected;
      ctx.save(); clipDisc(ctx, sp);
      strokeArc(ctx, sp, { sys: 1, tilt: 0, dec: 0, ra: 0, gS: 0, gE: 15 * s.ra || 0.001 },
        null, C_RA, 1, 3);
      strokeArc(ctx, sp, { sys: 1, tilt: 90, dec: 0, ra: s.ra,
        gS: Math.min(0, s.dec), gE: Math.max(0, s.dec) || 0.001 }, null, C_DEC, 1, 3);
      ctx.restore();
      var q1 = sp.cel(cart(s.ra - 0.9, 5), R * 1.05);
      var q2 = sp.cel(cart(s.ra + 0.9, s.dec / 2), R * 1.05);
      label(ctx, q1.x, q1.y, s.ra.toFixed(1) + "h", C_RA);
      label(ctx, q2.x, q2.y, s.dec.toFixed(1) + "°", C_DEC);
    }
    function horizonArcs(ctx, sp) {
      var h = toHorizon(selected.ra, selected.dec);
      ctx.save(); clipDisc(ctx, sp);
      strokeArc(ctx, sp, { sys: 0, tilt: 0, alt: 0, az: 0, gS: 360 - h.az, gE: 360 },
        null, C_AZ, 1, 3);
      strokeArc(ctx, sp, { sys: 0, tilt: 90, alt: 0, az: h.az,
        gS: Math.min(0, h.alt), gE: Math.max(0, h.alt) || 0.001 }, null, C_ALT, 1, 3);
      ctx.restore();
      var q1 = sp.h(hCart(h.az - 13, 5), R * 1.05);
      var q2 = sp.h(hCart(h.az + 13, h.alt / 2), R * 1.05);
      label(ctx, q1.x, q1.y, h.az.toFixed(1) + "°", C_AZ);
      label(ctx, q2.x, q2.y, h.alt.toFixed(1) + "°", C_ALT);
    }
    /* two 20°-radius arcs about the east and west points, marking the angle the
       celestial equator makes with the horizon: 90° − |latitude|               */
    function angleMarks(ctx, sp) {
      var lim = 90 - Math.abs(obsLat), r1 = 20, r3 = 90 - r1;
      var p1, p2;
      if (obsLat >= 0) {
        p1 = { sys: 0, tilt: 90, az: 0, alt: r3, gS: 90 + obsLat, gE: 180 };
        p2 = { sys: 0, tilt: 90, az: 0, alt: -r3, gS: 90 + obsLat, gE: 180 };
      } else {
        p1 = { sys: 0, tilt: 90, az: 0, alt: r3, gS: 0, gE: 90 + obsLat };
        p2 = { sys: 0, tilt: 90, az: 0, alt: -r3, gS: 0, gE: 90 + obsLat };
      }
      ctx.save(); clipDisc(ctx, sp);
      strokeArc(ctx, sp, p1, null, C_ANG, 1, 2);
      strokeArc(ctx, sp, p2, null, C_ANG, 1, 2);
      ctx.restore();
      var e = sp.h(hCart(90, r1 * 0.6), R * 1.0), w = sp.h(hCart(270, r1 * 0.6), R * 1.0);
      label(ctx, e.x, e.y, lim.toFixed(1) + "°", C_ANG);
      label(ctx, w.x, w.y, lim.toFixed(1) + "°", C_ANG);
    }
    /* ---- the clickable world map, as in the SWF's Observer's Location panel -
       Equirectangular and square: MAPW = 2 * MAPH, so a degree of longitude and
       a degree of latitude cover the same number of pixels.                   */
    function drawMap() {
      var ctx = mctx;
      ctx.save();
      ctx.fillStyle = "#e9f0f7"; ctx.fillRect(0, 0, MAPW, MAPH);
      ctx.beginPath(); ctx.rect(0, 0, MAPW, MAPH); ctx.clip();
      function mx(lon) { return (lon + 180) / 360 * MAPW; }
      function my(la) { return (90 - la) / 180 * MAPH; }
      ctx.fillStyle = "#c9b48b";                      // land, then the inland seas
      ctx.beginPath();
      EARTH.mapPath(ctx, 0, 0, MAPW, MAPH);
      ctx.fill();
      ctx.fillStyle = "#e9f0f7";
      ctx.beginPath();
      EARTH.mapPath(ctx, 0, 0, MAPW, MAPH, "inner");
      ctx.fill();
      ctx.strokeStyle = "rgba(90,120,150,0.45)"; ctx.lineWidth = 1;
      ctx.beginPath();
      [-60, -30, 0, 30, 60].forEach(function (la) { ctx.moveTo(0, my(la)); ctx.lineTo(MAPW, my(la)); });
      [-120, -60, 0, 60, 120].forEach(function (lo) { ctx.moveTo(mx(lo), 0); ctx.lineTo(mx(lo), MAPH); });
      ctx.stroke();
      var px = mx(obsLon), py = my(obsLat);
      ctx.strokeStyle = "#d11818"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px - 11, py); ctx.lineTo(px + 11, py);
      ctx.moveTo(px, py - 11); ctx.lineTo(px, py + 11);
      ctx.stroke();
      ctx.strokeStyle = "#8899aa"; ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, MAPW - 2, MAPH - 2);
      ctx.restore();
    }

    /* ---------------------------------------------------------------------
       Layout. The SWF puts the observer's panel — latitude, longitude and the
       clickable map — beside the diagrams and its other three panels in a row
       underneath. Do the same: the location panel is the one that wants to sit
       next to the sky it is aiming at, and the rest read better as a row than
       as a column three times the height of the stage.                       */
    (function () {
      var css = document.createElement("style");
      css.textContent =
        // the location panel beside the sky, wide enough for a legible map but
        // never so wide that it starves the diagram
        ".sim-layout{grid-template-columns:minmax(0,1fr) clamp(250px,26%,330px)}" +
        ".ce-map{width:100%;max-width:480px;height:auto;display:block;" +
        "border-radius:6px;cursor:crosshair;touch-action:none}" +
        ".ce-map-wrap{gap:0}" +
        // the other three panels, in a row under the whole thing
        ".ce-bottom{grid-column:1/-1;display:grid;" +
        "grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 26px;align-items:start}" +
        // each panel flows its own controls into as many columns as it has room
        // for, so a half-width panel is two controls wide instead of twice as tall
        ".ce-col{order:1;display:grid;align-content:start;align-items:start;min-width:0;" +
        "grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:11px 20px}" +
        ".ce-col>.group-title{grid-column:1/-1;margin:0 0 2px}" +
        // the eight appearance checkboxes need about 270px each to keep their
        // labels on one line, so they take a full-width row of their own
        ".ce-col.wide{order:2;grid-column:1/-1;gap:9px 22px;" +
        "grid-template-columns:repeat(auto-fit,minmax(270px,1fr))}" +
        ".ce-bottom>.readouts{order:3;grid-column:1/-1;" +
        "grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}" +
        ".sim-controls .sim-note{margin:0 0 2px}" +
        ".ce-pat{gap:7px}.ce-pat>label{font-size:.86rem;color:var(--text)}" +
        "@media (max-width:980px){.sim-layout{grid-template-columns:1fr}}" +
        "@media (max-width:620px){.ce-bottom{grid-template-columns:1fr}}";
      document.head.appendChild(css);

      var bottom = document.createElement("aside");
      bottom.className = "sim-controls ce-bottom";
      PANEL.parentNode.appendChild(bottom);

      var col = null, outs = null, groups = 0;
      [].slice.call(PANEL.children).forEach(function (el) {
        if (el.classList.contains("readouts")) { outs = el; return; }
        if (el.classList.contains("group-title")) groups++;
        if (groups <= 1) return;               // the location panel stays on the right
        if (el.classList.contains("group-title") || !col) {
          col = document.createElement("div");
          col.className = "ce-col";
          bottom.appendChild(col);
        }
        col.appendChild(el);
      });
      [].forEach.call(bottom.querySelectorAll(".ce-col"), function (c) {
        if (c.querySelectorAll(".ctl.row").length >= 4) c.classList.add("wide");
      });
      if (outs) bottom.appendChild(outs);      // readouts run under everything
    })();

    drawMap();
    upd();
  }
});
