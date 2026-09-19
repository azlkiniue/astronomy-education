/* Moon Phases and the Horizon Diagram --------------------------------------------
   Faithful rebuild of the ClassAction / NAAP "positionsdemonstrator.swf"
   (MoonPositionsDemonstratorClass over UNL's CelestialSphere engine, decompiled).
   A horizon diagram for an observer at a chosen latitude, with eight numbered
   positions around the celestial equator. Put the Sun at one of them to set the
   time of day, and the Moon at another to set its phase.

   Sun and Moon both sit at right ascension 6 − 3·(position − 1) hours on the
   equator (positions 1–8), the phase angle is 15·(RA_sun − RA_moon) + 180, and
   the clock reads 6 am + 3 hours per position — all as in the original, which
   also lets you drag either disc along the equator and eases it onto the
   nearest position when you let go.                                           */
Sim.create({
  id: "positionsdemonstrator",
  width: 560, height: 440,
  strings: {
    en: {
      "pd.general": "General", "pd.sun": "Sun", "pd.moon": "Moon",
      "pd.lat": "latitude", "pd.sunPos": "sun position", "pd.moonPos": "moon position",
      "pd.showSun": "show sun", "pd.showMoon": "show moon", "pd.showPhase": "show phase",
      "pd.onDisc": "show phase on the moon disc", "pd.labels": "show position labels",
      "pd.band": "show ecliptic band", "pd.time": "show time",
      "pd.rTime": "time of day", "pd.rPhase": "phase of moon", "pd.rSunAlt": "sun's altitude",
      "pd.rMoonAlt": "moon's altitude", "pd.diagram": "Horizon Diagram", "pd.view": "Viewing angle",
      "pd.hint": "Drag the diagram to swing the viewpoint, or grab the Sun or the Moon and slide it along the equator. The stick figure stands at the centre of the horizon.",
      "pd.new": "New Moon", "pd.wxc": "Waxing Crescent", "pd.fq": "First Quarter", "pd.wxg": "Waxing Gibbous",
      "pd.full": "Full Moon", "pd.wng": "Waning Gibbous", "pd.tq": "Third Quarter", "pd.wnc": "Waning Crescent",
      "pd.N": "N", "pd.E": "E", "pd.S": "S", "pd.W": "W", "pd.up": "up", "pd.down": "below the horizon"
    },
    id: {
      "pd.general": "Umum", "pd.sun": "Matahari", "pd.moon": "Bulan",
      "pd.lat": "lintang", "pd.sunPos": "posisi matahari", "pd.moonPos": "posisi bulan",
      "pd.showSun": "tampilkan matahari", "pd.showMoon": "tampilkan bulan", "pd.showPhase": "tampilkan fase",
      "pd.onDisc": "tampilkan fase pada cakram bulan", "pd.labels": "tampilkan label posisi",
      "pd.band": "tampilkan sabuk ekliptika", "pd.time": "tampilkan waktu",
      "pd.rTime": "waktu setempat", "pd.rPhase": "fase bulan", "pd.rSunAlt": "ketinggian matahari",
      "pd.rMoonAlt": "ketinggian bulan", "pd.diagram": "Diagram Horizon", "pd.view": "Sudut pandang",
      "pd.hint": "Seret diagram untuk mengubah arah pandang, atau pegang Matahari atau Bulan lalu geser di sepanjang ekuator. Sosok tongkat berdiri di pusat ufuk.",
      "pd.new": "Bulan Baru", "pd.wxc": "Sabit Awal", "pd.fq": "Kuartal Pertama", "pd.wxg": "Cembung Awal",
      "pd.full": "Purnama", "pd.wng": "Cembung Akhir", "pd.tq": "Kuartal Ketiga", "pd.wnc": "Sabit Akhir",
      "pd.N": "U", "pd.E": "T", "pd.S": "S", "pd.W": "B", "pd.up": "di atas ufuk", "pd.down": "di bawah ufuk"
    }
  },
  about: {
    en: "<p>The horizon diagram is the bridge between the two pictures of the sky. The green plane is your horizon, the stick figure is you, and the great circle tilted across the sphere is the celestial equator — tilted by exactly your latitude, which is why the Sun climbs higher from the tropics than from Alaska.</p>" +
        "<p>Put the Sun at a position and you have set the <strong>time of day</strong>: the Sun on your meridian is noon, on the eastern horizon is sunrise, below the horizon is night. Put the Moon at another position and the angle between them fixes its <strong>phase</strong> — 180° apart is full, together is new, a quarter turn apart is a quarter moon.</p>" +
        "<p>Read the two together and the whole lunar timetable falls out. A first-quarter moon is 90° east of the Sun, so it rises around noon and sets around midnight. A full moon rises as the Sun sets. A waning crescent only clears the horizon in the small hours before dawn — which is why most people have never knowingly seen one.</p>",
    id: "<p>Diagram horizon adalah jembatan antara dua gambaran langit. Bidang hijau adalah ufuk Anda, sosok tongkat adalah Anda, dan lingkaran besar yang miring melintasi bola adalah ekuator langit — kemiringannya persis sebesar lintang Anda, sebabnya Matahari naik lebih tinggi di daerah tropis daripada di Alaska.</p>" +
        "<p>Tempatkan Matahari pada sebuah posisi dan Anda telah menetapkan <strong>waktu setempat</strong>: Matahari di meridian berarti tengah hari, di ufuk timur berarti terbit, di bawah ufuk berarti malam. Tempatkan Bulan pada posisi lain dan sudut antara keduanya menetapkan <strong>fasenya</strong> — berseberangan 180° berarti purnama, berimpit berarti bulan baru, terpisah seperempat putaran berarti kuartal.</p>" +
        "<p>Baca keduanya bersama dan seluruh jadwal Bulan terungkap. Bulan kuartal pertama berada 90° di timur Matahari, jadi ia terbit sekitar tengah hari dan terbenam sekitar tengah malam. Purnama terbit saat Matahari terbenam. Sabit akhir baru muncul di atas ufuk menjelang fajar — sebabnya kebanyakan orang tak pernah sadar pernah melihatnya.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var OY = -25;
    var PANEL = { x: 7, y: 32 + OY, w: 411, h: 426 };
    var C = { x: 213, y: 253 + OY }, R = 160;              // sphereMC, size 320
    var SIDE = { x: 432, y: PANEL.y, w: 121, h: 150 };     // the phase disc panel
    var DISC = { x: SIDE.x + SIDE.w / 2, y: SIDE.y + 62, r: 30 };
    var PHASE_KEYS = ["pd.new", "pd.wxc", "pd.fq", "pd.wxg", "pd.full", "pd.wng", "pd.tq", "pd.wnc"];
    var NORTH = { x: 1, y: 0, z: 0 }, EAST = { x: 0, y: -1, z: 0 }, ZENITH = { x: 0, y: 0, z: 1 };
    var NCP = { x: 0, y: 0, z: 1 };

    var lat = 41, sunPos = 4, moonPos = 2, sT = 0;
    var theta = 360 - 200, phi = 30;                       // viewerAzimuth 200, default altitude 30°
    var showSun = true, showMoon = true, showPhase = true, onDisc = false;
    var showLabels = false, showBand = false, showTime = true;
    var drag = null, hover = null;

    S.group("pd.general");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "pd.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.slider({
      labelKey: "pd.lat", min: -90, max: 90, value: lat, step: 0.5,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { lat = v; upd(); }
    });
    S.toggle({ labelKey: "pd.labels", value: false, on: function (v) { showLabels = v; S.requestDraw(); } });
    S.toggle({ labelKey: "pd.band", value: false, on: function (v) { showBand = v; S.requestDraw(); } });
    S.group("pd.sun");
    S.toggle({ labelKey: "pd.showSun", value: true, on: function (v) { showSun = v; upd(); } });
    var sunCtl = positionSlider("pd.sunPos", sunPos, function (v) { sunPos = v; });
    S.toggle({ labelKey: "pd.time", value: true, on: function (v) { showTime = v; upd(); } });
    S.group("pd.moon");
    S.toggle({ labelKey: "pd.showMoon", value: true, on: function (v) { showMoon = v; upd(); } });
    var moonCtl = positionSlider("pd.moonPos", moonPos, function (v) { moonPos = v; });
    S.toggle({ labelKey: "pd.showPhase", value: true, on: function (v) { showPhase = v; S.requestDraw(); } });
    S.toggle({ labelKey: "pd.onDisc", value: false, on: function (v) { onDisc = v; S.requestDraw(); } });
    var outTime = S.readout({ labelKey: "pd.rTime" });
    var outPhase = S.readout({ labelKey: "pd.rPhase" });
    var outSunAlt = S.readout({ labelKey: "pd.rSunAlt" });
    var outMoonAlt = S.readout({ labelKey: "pd.rMoonAlt" });

    // The SWF's hackSlider: the eight positions are continuous (0.51–8.49) while
    // dragged, shown rounded, and eased onto the nearest whole position (200 ms)
    // when let go. The arrow keys step by one and wrap from 8 back to 1.
    function positionSlider(key, value, set) {
      var ctl = S.slider({
        labelKey: key, min: 0.51, max: 8.49, value: value, step: 0.01,
        format: function (v) { return String(Math.round(v)); },
        on: function (v) { set(v); upd(); }
      });
      ctl.tween = 0;
      ctl.input.addEventListener("input", function () { ctl.tween++; });
      ctl.input.addEventListener("change", function () { settle(ctl); });
      ctl.input.addEventListener("keydown", function (ev) {
        var d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[ev.key];
        if (!d) return;
        ev.preventDefault();
        var v = Math.round(ctl.value()) + d;
        ctl.tween++;
        ctl.set(v < 1 ? 8 : v > 8 ? 1 : v);
      });
      return ctl;
    }
    function settle(ctl, from) {
      if (from === undefined) from = ctl.value();
      var to = Math.round(from), id = ++ctl.tween, t0 = performance.now();
      to = to < 1 ? to + 8 : to > 8 ? to - 8 : to;
      if (Math.abs(from - to) > 4) from += from > to ? -8 : 8;   // ease the short way round
      (function step(now) {
        if (id !== ctl.tween) return;
        var k = Math.min(1, (now - t0) / 200);
        ctl.set(k >= 1 ? to : from + (to - from) * Math.pow(k, 0.3));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }

    /* ---- the CelestialSphere projection: a (horizon → screen) and b = a·m ---- */
    function mats() {
      var ct = Math.cos(theta * RAD), st = Math.sin(theta * RAD);
      var cp = Math.cos(phi * RAD), sp = Math.sin(phi * RAD);
      var a = {
        a0: -R * st, a1: R * ct, a2: 0, a3: R * ct * sp, a4: R * st * sp, a5: -R * cp,
        a6: R * ct * cp, a7: R * st * cp, a8: R * sp
      };
      var m2 = Math.cos(lat * RAD), m3 = Math.sin(sT), m4 = -Math.cos(sT), m8 = Math.sin(lat * RAD);
      var m = { m0: m4 * m8, m1: -m3 * m8, m2: m2, m3: m3, m4: m4, m6: -m2 * m4, m7: m2 * m3, m8: m8 };
      var b = {
        b0: a.a0 * m.m0 + a.a1 * m.m3, b1: a.a0 * m.m1 + a.a1 * m.m4, b2: a.a0 * m.m2,
        b3: a.a3 * m.m0 + a.a4 * m.m3 + a.a5 * m.m6, b4: a.a3 * m.m1 + a.a4 * m.m4 + a.a5 * m.m7,
        b5: a.a3 * m.m2 + a.a5 * m.m8,
        b6: a.a6 * m.m0 + a.a7 * m.m3 + a.a8 * m.m6, b7: a.a6 * m.m1 + a.a7 * m.m4 + a.a8 * m.m7,
        b8: a.a6 * m.m2 + a.a8 * m.m8
      };
      return { a: a, m: m, b: b };
    }
    var M = mats();
    function horizonCart(az, alt) {                        // the engine measures azimuth clockwise
      var A = -az * RAD, h = alt * RAD;
      return { x: Math.cos(h) * Math.cos(A), y: Math.cos(h) * Math.sin(A), z: Math.sin(h) };
    }
    function celestialCart(ra, dec, r) {
      var d = dec * RAD, h = ra * 15 * RAD;
      r = r || 1;
      return { x: r * Math.cos(d) * Math.cos(h), y: r * Math.cos(d) * Math.sin(h), z: r * Math.sin(d) };
    }
    function vecH(v) {                                     // horizon vector → screen offset (R-scaled)
      var a = M.a;
      return { x: v.x * a.a0 + v.y * a.a1, y: v.x * a.a3 + v.y * a.a4 + v.z * a.a5,
        z: v.x * a.a6 + v.y * a.a7 + v.z * a.a8 };
    }
    function vecC(v) {                                     // celestial vector → screen offset
      var b = M.b;
      return { x: v.x * b.b0 + v.y * b.b1 + v.z * b.b2, y: v.x * b.b3 + v.y * b.b4 + v.z * b.b5,
        z: v.x * b.b6 + v.y * b.b7 + v.z * b.b8 };
    }
    function projH(p) { var q = vecH(p); return { x: C.x + q.x, y: C.y + q.y, z: q.z }; }
    function projC(p) { var q = vecC(p); return { x: C.x + q.x, y: C.y + q.y, z: q.z }; }
    function toHorizon(ra, dec) {                          // CtoW → altitude and azimuth
      var p = celestialCart(ra, dec), m = M.m;
      var w = { x: p.x * m.m0 + p.y * m.m1 + p.z * m.m2, y: p.x * m.m3 + p.y * m.m4,
        z: p.x * m.m6 + p.y * m.m7 + p.z * m.m8 };
      return { alt: Math.asin(Math.max(-1, Math.min(1, w.z))) * DEG,
        az: ((-Math.atan2(w.y, w.x) * DEG) % 360 + 360) % 360 };
    }
    function screenToCelestial(p) {                        // the near hemisphere, clamped to the limb
      var x = (p.x - C.x) / R, y = (p.y - C.y) / R, q = x * x + y * y;
      if (q > 1) { var k = 1 / Math.sqrt(q); x *= k; y *= k; q = 1; }
      var z = Math.sqrt(1 - q), b = M.b;                   // b/R is orthonormal: invert by transposing
      var cx = b.b0 * x + b.b3 * y + b.b6 * z, cy = b.b1 * x + b.b4 * y + b.b7 * z;
      return { ra: Math.atan2(cy, cx) * DEG / 15 };
    }

    function sunRa() { return -3 * (sunPos - 1) + 6; }
    function moonRa() { return -3 * (moonPos - 1) + 6; }
    function phaseAngle() { return 15 * (sunRa() - moonRa()) + 180; }
    function phaseKey() {                                  // the SWF's own thresholds, 12° and 5°
      var r = (((180 - phaseAngle()) % 360) + 360) % 360;
      if (r <= 12) return PHASE_KEYS[0];
      if (r <= 85) return PHASE_KEYS[1];
      if (r <= 95) return PHASE_KEYS[2];
      if (r <= 168) return PHASE_KEYS[3];
      if (r <= 192) return PHASE_KEYS[4];
      if (r <= 265) return PHASE_KEYS[5];
      if (r <= 275) return PHASE_KEYS[6];
      if (r <= 348) return PHASE_KEYS[7];
      return PHASE_KEYS[0];
    }
    function timeString() {
      var h = (((6 + 3 * (sunPos - 1)) % 24) + 24) % 24, suffix = h < 12 ? "AM" : "PM";
      if (h >= 12) h -= 12;
      var hh = Math.floor(h), mm = Math.floor(60 * (h - hh));
      if (hh === 0) hh = 12;
      return hh + ":" + (mm < 10 ? "0" : "") + mm + " " + suffix;
    }
    function upd() {
      M = mats();
      outTime(showTime ? timeString() : "–");
      outPhase(I18N.t(phaseKey()));
      var sa = toHorizon(sunRa(), 0).alt, ma = toHorizon(moonRa(), 0).alt;
      outSunAlt(showSun ? sa.toFixed(0) + "° " + I18N.t(sa >= 0 ? "pd.up" : "pd.down") : "–");
      outMoonAlt(showMoon ? ma.toFixed(0) + "° " + I18N.t(ma >= 0 ? "pd.up" : "pd.down") : "–");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- pointer: grab the Sun or Moon to move it along the equator, or swing the view ---- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function discAt(p) {                                   // only a disc on the near side reacts
      var list = [];
      if (showSun) list.push({ body: "sun", ra: sunRa(), s: projC(celestialCart(sunRa(), 0, 1.00001)) });
      if (showMoon) list.push({ body: "moon", ra: moonRa(), s: projC(celestialCart(moonRa(), 0)) });
      for (var i = 0; i < list.length; i++) {
        var d = list[i];
        if (d.s.z > 0 && Math.hypot(p.x - d.s.x, p.y - d.s.y) <= 12) return d;
      }
      return null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), d = discAt(p);
      if (d) {
        var ctl = d.body === "sun" ? sunCtl : moonCtl;
        ctl.tween++;
        drag = { body: d.body, ctl: ctl, offset: screenToCelestial(p).ra - d.ra };
      } else {
        if (Math.hypot(p.x - C.x, p.y - C.y) > R + 20) return;
        drag = { x: p.x, y: p.y, theta: theta, phi: phi };
      }
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) {
        var d = discAt(p), h = d ? d.body : null;
        if (h !== hover) { hover = h; S.requestDraw(); }
        return;
      }
      if (drag.body) {                                     // Sun/Moon Disc onMouseMoveFunc
        var v = 1 + (screenToCelestial(p).ra - drag.offset - 6) / -3;
        drag.ctl.set(0.5 + ((((v - 0.5) % 8) + 8) % 8));
        return;
      }
      var k = 57.2958 / R;
      theta = (((drag.theta + k * (p.x - drag.x)) % 360) + 360) % 360;
      phi = Math.max(7, Math.min(90, drag.phi - k * (p.y - drag.y)));
      upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () {
        if (drag && drag.body) settle(drag.ctl, drag.body === "sun" ? sunPos : moonPos);
        drag = null;
      });
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (hover) { hover = null; S.requestDraw(); }
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, S.W, S.H);
      panel(ctx, PANEL, t("pd.diagram"));

      ctx.save();
      ctx.beginPath(); ctx.rect(PANEL.x + 1, PANEL.y + 1, PANEL.w - 2, PANEL.h - 2); ctx.clip();
      var objs = objects();
      // the engine's layers, bottom to top (viewer above the horizon)
      drawObjects(ctx, objs, "back", "external");
      axis(ctx, false);
      ctx.save(); discClip(ctx);
      greatCircles(ctx, false);
      ctx.restore();
      drawObjects(ctx, objs, "back", "surface");
      if (showBand) band(ctx, false);
      horizonPlane(ctx, t);
      if (showSun) shadow(ctx);
      stickFigure(ctx);
      ctx.save(); discClip(ctx);
      var bowl = ctx.createRadialGradient(C.x, C.y, 0, C.x, C.y, R);   // the "celestialBowl"
      bowl.addColorStop(0, "rgba(255,255,255,0)"); bowl.addColorStop(1, "rgba(0,0,0,0.2)");
      ctx.fillStyle = bowl; ctx.fillRect(C.x - R, C.y - R, 2 * R, 2 * R);
      ctx.restore();
      if (showBand) band(ctx, true);
      ctx.save(); discClip(ctx);
      greatCircles(ctx, true);
      ctx.restore();
      drawObjects(ctx, objs, "front", "surface");
      drawObjects(ctx, objs, "front", "external");
      axis(ctx, true);
      ctx.restore();

      if (showPhase) phasePanel(ctx, t);
    });

    function panel(ctx, b, title) {                        // Panel Background, 12 px black title
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(title, b.x + 7, b.y + 6);
      ctx.strokeStyle = "#cccccc";
      ctx.beginPath();
      ctx.moveTo(b.x + 14 + ctx.measureText(title).width, b.y + 10.5);
      ctx.lineTo(b.x + b.w - 5, b.y + 10.5); ctx.stroke();
    }
    function discClip(ctx) { ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, TAU); ctx.clip(); }

    // 'absolute' orientation: the clip lies in the plane normal to n, its −y along u and
    // its +x along w = u × n, so an unmirrored figure faces a viewer the normal points at
    function frame(n, a) {
      var u;
      if (a) {
        var d = a.x * n.x + a.y * n.y + a.z * n.z;
        u = { x: a.x - d * n.x, y: a.y - d * n.y, z: a.z - d * n.z };
      } else if (n.x === 0 && n.y === 0) u = { x: 0, y: 1, z: 0 };
      else u = { x: -n.x * n.z, y: -n.z * n.y, z: n.x * n.x + n.y * n.y };
      var l = Math.hypot(u.x, u.y, u.z);
      u = { x: u.x / l, y: u.y / l, z: u.z / l };
      return { u: u, w: { x: u.y * n.z - u.z * n.y, y: u.z * n.x - u.x * n.z, z: u.x * n.y - u.y * n.x } };
    }
    function enter(ctx, origin, f, vec) {                  // local px → screen
      var w = vec(f.w), u = vec(f.u);
      ctx.transform(w.x / R, w.y / R, -u.x / R, -u.y / R, origin.x, origin.y);
      return Math.sqrt(Math.abs(w.x * u.y - w.y * u.x)) / R;   // linear scale, for hairlines
    }
    function unit(v) { var l = Math.hypot(v.x, v.y, v.z); return { x: v.x / l, y: v.y / l, z: v.z / l }; }

    function objects() {                                   // everything the engine sorts by depth
      var list = [];
      if (showLabels) for (var i = 1; i <= 8; i++) {
        var pd = celestialCart(9 - i * 3, 0, 1.00005);
        list.push({ kind: "dot", p: pd, s: projC(pd), layer: "external" });
        var pl = celestialCart(9 - i * 3, 12);
        list.push({ kind: "label", n: i, p: pl, s: projC(pl), layer: "surface" });
      }
      if (showMoon) {
        var pm = celestialCart(moonRa(), 0);
        list.push({ kind: "moon", p: pm, s: projC(pm), layer: "surface" });
      }
      if (showSun) {
        var ps = celestialCart(sunRa(), 0, 1.00001);
        list.push({ kind: "sun", p: ps, s: projC(ps), layer: "external" });
      }
      list.sort(function (a, b) { return a.s.z - b.s.z; });
      return list;
    }
    function drawObjects(ctx, list, side, layer) {
      list.forEach(function (o) {
        if (o.layer !== layer || (o.s.z < 0) !== (side === "back")) return;
        ctx.save();
        if (o.kind === "dot") dotGlyph(ctx, o);
        else if (o.kind === "label") labelGlyph(ctx, o);
        else if (o.kind === "moon") moonGlyph(ctx, o);
        else sunGlyph(ctx, o);
        ctx.restore();
      });
    }
    function dotGlyph(ctx, o) {                            // Position Dot: a red plus, 2 px
      enter(ctx, o.s, frame(unit(o.p)), vecC);
      ctx.strokeStyle = "#d11818"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.moveTo(0, -3); ctx.lineTo(0, 3);
      ctx.stroke();
    }
    function labelGlyph(ctx, o) {                          // Position Label: bold 16 px, #d11818
      enter(ctx, o.s, frame(unit(o.p)), vecC);
      ctx.fillStyle = "#d11818"; ctx.font = "bold 16px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(o.n), 0, 1.5);
    }
    function sunGlyph(ctx, o) {                            // Sun Disc: shape 88 + ring 89 (90 on hover)
      enter(ctx, o.s, frame(unit(o.p)), vecC);
      var g = ctx.createRadialGradient(0, 0.05, 0, 0, 0.05, 13.6);
      g.addColorStop(0, "#ffcc00"); g.addColorStop(1, "#edb101");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
      ctx.strokeStyle = hover === "sun" ? "#000000" : "#999999"; ctx.lineWidth = 1;
      ctx.stroke();
    }
    function moonGlyph(ctx, o) {                           // Moon Disc: faces the sphere's centre
      var k = enter(ctx, o.s, frame({ x: -o.p.x, y: -o.p.y, z: -o.p.z }, NCP), vecC);
      if (onDisc) {
        ctx.fillStyle = "#d0d0d0";
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
        shade(ctx, 0, 0, 12, phaseAngle() * RAD, "#909090");
      } else {
        ctx.fillStyle = "#a8a8a8";
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = hover === "moon" ? "#000000" : "#808080";
      ctx.lineWidth = 1 / Math.max(k, 0.2);
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.stroke();
    }

    // a great circle through the poles or along the equator, split at the limb
    function greatCircles(ctx, front) {
      meridian(ctx, 0, front);
      meridian(ctx, 6, front);
      seg(ctx, function (u) { return projC(celestialCart(u * 24, 0)); }, front, "#e8d898", 2, 1);
    }
    function meridian(ctx, ra, front) {
      seg(ctx, function (u) {
        var d = u * 360 - 180;
        return projC(celestialCart(Math.abs(d) > 90 ? ra + 12 : ra, d > 90 ? 180 - d : (d < -90 ? -180 - d : d)));
      }, front, "#e0e0e0", 1, 0.7);
    }
    function seg(ctx, fn, front, colour, w, alpha) {
      ctx.strokeStyle = colour; ctx.lineWidth = w; ctx.globalAlpha = alpha;
      ctx.beginPath();
      var started = false, prev = null;
      for (var i = 0; i <= 240; i++) {
        var p = fn(i / 240);
        if ((p.z >= 0) !== front) { started = false; prev = p; continue; }
        if (!started) {
          if (prev) {                                       // start on the limb, not a step inside it
            var k = prev.z / (prev.z - p.z);
            ctx.moveTo(prev.x + (p.x - prev.x) * k, prev.y + (p.y - prev.y) * k);
          } else ctx.moveTo(p.x, p.y);
          started = true;
        }
        ctx.lineTo(p.x, p.y);
        prev = p;
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function axis(ctx, front) {                            // ncpAxis / scpAxis, 2 px #2174fe
      ctx.strokeStyle = "#2174fe"; ctx.lineWidth = 2;
      [1, -1].forEach(function (s) {
        var p1 = projC({ x: 0, y: 0, z: s }), p2 = projC({ x: 0, y: 0, z: 1.2 * s });
        if ((p1.z >= 0) !== front) return;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      });
    }

    // the ecliptic band, dec −30…+30: the Band Disc gradient masked to the band, its near and
    // far halves on either side of the horizon plane, bordered 1 px #b0b0b0 at 50 %
    var bandCache = {};
    function band(ctx, front) {
      var key = [theta, phi, lat, front].join();
      if (!bandCache[key]) {
        if (Object.keys(bandCache).length > 8) bandCache = {};
        bandCache[key] = bandLayer(front);
      }
      var L = bandCache[key];
      ctx.drawImage(L.canvas, C.x - R, C.y - R, 2 * R, 2 * R);
      ctx.save(); discClip(ctx);
      [30, -30].forEach(function (d) {
        seg(ctx, function (u) { return projC(celestialCart(u * 24, d)); }, front, "#b0b0b0", 1, 0.5);
      });
      ctx.restore();
    }
    function bandLayer(front) {
      var q = 2, N = 2 * R * q, cv = document.createElement("canvas");
      cv.width = cv.height = N;
      var g = cv.getContext("2d"), img = g.createImageData(N, N), px = img.data, b = M.b;
      var c0 = [154, 209, 250, 77 / 255], c1 = [28, 44, 68, 102 / 255];
      var gx = 0.31, gy = -0.34, gr = 1.469;               // gradient centre and radius, sphere units
      var sgn = front ? 1 : -1, lim = Math.sin(30 * RAD);
      for (var j = 0; j < N; j++) {
        var y = (j + 0.5) / (R * q) - 1;
        for (var i = 0; i < N; i++) {
          var x = (i + 0.5) / (R * q) - 1, s = 1 - x * x - y * y;
          if (s < 0) continue;
          var z = sgn * Math.sqrt(s);
          if (Math.abs((b.b2 * x + b.b5 * y + b.b8 * z) / R) > lim) continue;
          var tt = Math.min(1, Math.hypot(x - gx, y - gy) / gr), o = 4 * (j * N + i);
          px[o] = c0[0] + (c1[0] - c0[0]) * tt;
          px[o + 1] = c0[1] + (c1[1] - c0[1]) * tt;
          px[o + 2] = c0[2] + (c1[2] - c0[2]) * tt;
          px[o + 3] = 255 * (c0[3] + (c1[3] - c0[3]) * tt);
        }
      }
      g.putImageData(img, 0, 0);
      return { canvas: cv };
    }

    function horizonPlane(ctx, t) {                        // CSAboveHorizonPlane, labels, night shade
      ctx.save();
      var e = vecH(EAST), n = vecH(NORTH);                 // plane units: radius 100, north = −y
      ctx.transform(e.x / 100, e.y / 100, -n.x / 100, -n.y / 100, C.x, C.y);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 101.4);
      g.addColorStop(0, "#51c451"); g.addColorStop(1, "#3aa53a");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t("pd.N"), 0, -80.3);                  // Direction Labels Light
      ctx.fillText(t("pd.S"), 0, 88.7);
      ctx.fillText(t("pd.E"), 83.25, 4.75);
      ctx.fillText(t("pd.W"), -83, 4.75);
      var alt = toHorizon(sunRa(), 0).alt;                 // updateShadow: darker as the Sun sinks
      var dark = showSun ? Math.min(40, 40 * Math.pow(1 - alt / 90, 4)) : 0;
      if (dark > 0) {
        ctx.fillStyle = "rgba(0,0,0," + dark / 100 + ")";
        ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    // Stickfigure: stands in the plane facing south, white head, 2 px black lines
    function figurePath(ctx) {
      ctx.moveTo(-0.15, -23.05); ctx.lineTo(6.3, -20.4);
      ctx.moveTo(-0.15, -27.25); ctx.lineTo(-0.15, -23.05); ctx.lineTo(-0.2, -15.45); ctx.lineTo(5.35, 0);
      ctx.moveTo(-5.5, 0); ctx.lineTo(-0.25, -15.6); ctx.lineTo(-0.2, -15.45);
      ctx.moveTo(-0.15, -23.05); ctx.lineTo(-6.3, -20.4);
    }
    function head(ctx) {
      ctx.beginPath(); ctx.ellipse(-0.15, -30.8, 3.5, 3.52, 0, 0, TAU);
    }
    function stickFigure(ctx) {
      ctx.save();
      enter(ctx, projH({ x: 0, y: 0, z: 0.0001 }), { w: EAST, u: ZENITH }, vecH);
      ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = "#000000";
      ctx.beginPath(); figurePath(ctx); ctx.stroke();
      head(ctx); ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    // ShadowMaker: the figure skewed away from the Sun by (az − 180°) and stretched by
    // 1/tan(alt), laid in the horizon plane, faded to 100 − 100/(15·tan alt) %, and
    // clipped by the Shadow Mask (a 160 px disc, i.e. the plane)
    var SHADOW_LINES = [
      [[-0.15, -27.25], [-0.15, -23.05], [6.3, -20.4]],
      [[-5.5, 0], [-0.25, -15.6], [-0.2, -15.45], [-0.15, -23.05], [-6.3, -20.4]],
      [[-0.2, -15.45], [5.35, 0]]
    ];
    var shadowLayer = document.createElement("canvas");  // faded as one clip, as Flash does
    function shadow(ctx) {
      var h = toHorizon(sunRa(), 0);
      if (h.alt < 0.1) return;
      var tn = Math.tan(h.alt * RAD), alpha = 100 - 100 / (15 * tn);
      if (alpha <= 0) return;
      var s = (h.az - 180) * RAD, L = 1 / tn;
      var e = vecH(EAST), n = vecH(NORTH);
      var A = e.x / R, B = e.y / R;
      var X = -L * (Math.sin(s) * e.x + Math.cos(s) * n.x) / R;
      var Y = -L * (Math.sin(s) * e.y + Math.cos(s) * n.y) / R;
      function pt(x, y) { return { x: C.x + A * x + X * y, y: C.y + B * x + Y * y }; }
      var off = shadowLayer;
      if (off.width !== S.canvas.width || off.height !== S.canvas.height) {
        off.width = S.canvas.width; off.height = S.canvas.height;
      }
      var o = off.getContext("2d");
      o.setTransform(1, 0, 0, 1, 0, 0);
      o.clearRect(0, 0, off.width, off.height);
      o.setTransform(off.width / S.W, 0, 0, off.height / S.H, 0, 0);
      o.fillStyle = "#333333"; o.strokeStyle = "#333333"; o.lineWidth = 1;
      o.beginPath();                                       // the head
      for (var i = 0; i <= 40; i++) {
        var a = i / 40 * TAU, q = pt(-0.15 + 3.5 * Math.cos(a), -30.8 + 3.52 * Math.sin(a));
        if (i === 0) o.moveTo(q.x, q.y); else o.lineTo(q.x, q.y);
      }
      o.fill(); o.stroke();
      o.beginPath();                                       // hairlines stay one pixel wide
      SHADOW_LINES.forEach(function (run) {
        run.forEach(function (v, j) {
          var q = pt(v[0], v[1]);
          if (j) o.lineTo(q.x, q.y); else o.moveTo(q.x, q.y);
        });
      });
      o.stroke();
      ctx.save();
      ctx.beginPath(); ctx.ellipse(C.x, C.y, R, R * Math.sin(phi * RAD), 0, 0, TAU); ctx.clip();
      ctx.globalAlpha = Math.min(1, alpha / 100);
      ctx.drawImage(off, 0, 0, S.W, S.H);
      ctx.restore();
    }

    function phasePanel(ctx, t) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(SIDE.x, SIDE.y, SIDE.w, SIDE.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(SIDE.x + 0.5, SIDE.y + 0.5, SIDE.w - 1, SIDE.h - 1);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(t("pd.moon"), DISC.x, SIDE.y + 6);
      ctx.fillStyle = "#d0d0d0";                           // drawPhaseDisc radius 30
      ctx.beginPath(); ctx.arc(DISC.x, DISC.y, DISC.r, 0, TAU); ctx.fill();
      shade(ctx, DISC.x, DISC.y, DISC.r, phaseAngle() * RAD, "#909090");
      ctx.strokeStyle = "#909090"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(DISC.x, DISC.y, DISC.r, 0, TAU); ctx.stroke();
      ctx.fillStyle = "#000000"; ctx.font = "11px " + FONT;
      ctx.fillText(t(phaseKey()), DISC.x, DISC.y + DISC.r + 8);
      if (showTime) {
        ctx.font = "12px " + FONT;
        ctx.fillText(timeString(), DISC.x, DISC.y + DISC.r + 28);
      }
    }
    // the dark half of a phase: angle 0 = fully lit, π = fully dark
    function shade(ctx, cx, cy, r, angle, colour) {
      angle = ((angle % TAU) + TAU) % TAU;
      var sign = angle < Math.PI ? -1 : 1, s = r * Math.cos(angle);
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, sign < 0);
      ctx.ellipse(cx, cy, Math.abs(s), r, 0, Math.PI / 2, -Math.PI / 2, sign * s > 0);
      ctx.fill();
    }

    upd();
  }
});
