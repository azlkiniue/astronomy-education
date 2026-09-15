/* Planetary Configurations Simulator -------------------------------------------
   Faithful rebuild of the NAAP "configurationsSimulator.swf": a simplified
   Copernican solar system in which an observer's planet and a target planet run
   on circular, coplanar orbits, and the configurations they form — conjunction,
   opposition, quadrature, greatest elongation — are read off three linked views:

     • Diagram      the two orbits from above, with the Sun at the centre
     • Zodiac Strip the sky along the ecliptic as seen from the observer's
                    planet: a fixed chart of the twelve zodiac constellations
                    along which the Sun and the target both travel, with the
                    elongation arrowed from the Sun to the planet (east to the
                    left, west to the right) — ported from the SWF's own
                    ZodiacStripClass, including drag-to-scroll and hover names
     • Timeline     one full synodic period, past above and future below, with
                    every configuration marked at the time it happens

   Periods come from Kepler's third law, P = a^1.5. Every configuration occurs at
   a particular value of the relative heliocentric angle Δ = θ_target − θ_observer:
   Δ = 0 and Δ = 180° give the two collinear cases, and quadrature (or greatest
   elongation, for an inferior target) is at cos Δ = a_inner / a_outer.           */
Sim.create({
  id: "configurationssimulator",
  width: 720, height: 668,
  strings: {
    en: {
      "cf.orbits": "Orbit Sizes", "cf.rObs": "observer's planet's orbit", "cf.rTgt": "target planet's orbit",
      "cf.presetObs": "observer preset", "cf.presetTgt": "target preset",
      "cf.anim": "Animation Controls", "cf.speed": "speed", "cf.onEvent": "when an event occurs",
      "cf.evStop": "stop", "cf.evGo": "keep going", "cf.evPause": "pause for 5 seconds",
      "cf.opts": "Options", "cf.labelOrbits": "label orbits", "cf.showElong": "show elongation angle",
      "cf.snap": "snap to events when dragging planets", "cf.zero": "zero counter",
      "cf.diagram": "Diagram", "cf.zodiac": "Zodiac Strip", "cf.timeline": "Timeline",
      "cf.obsPlanet": "observer's planet", "cf.tgtPlanet": "target planet",
      "cf.sun": "sun", "cf.planet": "planet", "cf.east": "east", "cf.west": "west",
      "cf.past": "past", "cf.future": "future",
      "cf.conj": "conjunction", "cf.opp": "opposition",
      "cf.quadE": "quadrature (eastern)", "cf.quadW": "quadrature (western)",
      "cf.infConj": "inferior conjunction", "cf.supConj": "superior conjunction",
      "cf.gee": "greatest eastern elongation", "cf.gwe": "greatest western elongation",
      "cf.rElong": "elongation", "cf.rConfig": "nearest configuration",
      "cf.rSyn": "synodic period", "cf.rPobs": "observer's period", "cf.rPtgt": "target's period",
      "cf.rCount": "counter", "cf.yr": "yr", "cf.E": "E", "cf.W": "W",
      "cf.drag": "drag either planet around its orbit, or drag the zodiac strip sideways to scroll the sky"
    },
    id: {
      "cf.orbits": "Ukuran Orbit", "cf.rObs": "orbit planet pengamat", "cf.rTgt": "orbit planet sasaran",
      "cf.presetObs": "prasetel pengamat", "cf.presetTgt": "prasetel sasaran",
      "cf.anim": "Kontrol Animasi", "cf.speed": "kecepatan", "cf.onEvent": "saat peristiwa terjadi",
      "cf.evStop": "berhenti", "cf.evGo": "lanjut terus", "cf.evPause": "jeda 5 detik",
      "cf.opts": "Opsi", "cf.labelOrbits": "beri label orbit", "cf.showElong": "tampilkan sudut elongasi",
      "cf.snap": "kancing ke peristiwa saat menyeret planet", "cf.zero": "nolkan pencacah",
      "cf.diagram": "Diagram", "cf.zodiac": "Jalur Zodiak", "cf.timeline": "Garis Waktu",
      "cf.obsPlanet": "planet pengamat", "cf.tgtPlanet": "planet sasaran",
      "cf.sun": "matahari", "cf.planet": "planet", "cf.east": "timur", "cf.west": "barat",
      "cf.past": "lampau", "cf.future": "mendatang",
      "cf.conj": "konjungsi", "cf.opp": "oposisi",
      "cf.quadE": "kuadratur (timur)", "cf.quadW": "kuadratur (barat)",
      "cf.infConj": "konjungsi inferior", "cf.supConj": "konjungsi superior",
      "cf.gee": "elongasi timur terbesar", "cf.gwe": "elongasi barat terbesar",
      "cf.rElong": "elongasi", "cf.rConfig": "konfigurasi terdekat",
      "cf.rSyn": "periode sinodis", "cf.rPobs": "periode pengamat", "cf.rPtgt": "periode sasaran",
      "cf.rCount": "pencacah", "cf.yr": "thn", "cf.E": "T", "cf.W": "B",
      "cf.drag": "seret salah satu planet mengelilingi orbitnya, atau geser jalur zodiak ke samping untuk menggulir langit"
    }
  },
  about: {
    en: "<p>A <strong>configuration</strong> is just a name for where a planet sits relative to the Sun <em>as you see it</em>. The geometry is fixed by one number: the angle between the two planets as measured from the Sun. Everything else — what the sky looks like, when the planet rises, whether you can see it at all — follows from that.</p>" +
        "<p>For a <strong>superior</strong> target (outside your orbit) the elongation sweeps the full 0°–180°: <strong>opposition</strong> when it is opposite the Sun and visible all night, <strong>quadrature</strong> at 90°, and <strong>conjunction</strong> when it is lost in the Sun's glare. For an <strong>inferior</strong> target (inside your orbit) the elongation can never exceed arcsin(a<sub>t</sub>/a<sub>o</sub>) — which is why Mercury and Venus are only ever morning or evening objects, never seen at midnight.</p>" +
        "<p>The pattern repeats every <strong>synodic period</strong>, 1/S = |1/P<sub>o</sub> − 1/P<sub>t</sub>| — the time for one planet to lap the other as seen from the Sun. Note that this is not the orbital period: Mars takes 1.88 years to orbit, but 2.14 years pass between one opposition and the next, because Earth has to catch up.</p>",
    id: "<p><strong>Konfigurasi</strong> hanyalah nama bagi kedudukan sebuah planet relatif terhadap Matahari <em>menurut penglihatan Anda</em>. Geometrinya ditentukan oleh satu angka: sudut antara kedua planet diukur dari Matahari. Selebihnya — rupa langit, kapan planet terbit, apakah ia terlihat sama sekali — mengikuti dari sana.</p>" +
        "<p>Untuk sasaran <strong>superior</strong> (di luar orbit Anda), elongasi menyapu penuh 0°–180°: <strong>oposisi</strong> saat ia berseberangan dengan Matahari dan terlihat semalam suntuk, <strong>kuadratur</strong> pada 90°, dan <strong>konjungsi</strong> saat ia tenggelam dalam silau Matahari. Untuk sasaran <strong>inferior</strong> (di dalam orbit Anda), elongasi tak pernah melebihi arcsin(a<sub>s</sub>/a<sub>p</sub>) — itulah sebabnya Merkurius dan Venus selalu menjadi objek pagi atau petang, tak pernah tampak tengah malam.</p>" +
        "<p>Polanya berulang setiap <strong>periode sinodis</strong>, 1/S = |1/P<sub>p</sub> − 1/P<sub>s</sub>| — waktu bagi satu planet menyalip planet lain dilihat dari Matahari. Perhatikan ini bukan periode orbit: Mars mengorbit dalam 1,88 tahun, tetapi 2,14 tahun berlalu antara satu oposisi dan berikutnya, karena Bumi harus mengejar.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, D2R = Math.PI / 180, R2D = 180 / Math.PI;
    var C = {
      panel: "#0e1530", border: "#2c3a66", text: "#e8ecf8", dim: "#9fabce",
      sun: "#ffd45e", obs: "#5b9bff", tgt: "#c4ccdd", orbit: "#3d4d78", accent: "#6ea8fe",
      elong: "#7ee0a0", mark: "#ff6b6b"
    };
    var PLANETS = {
      Mercury: 0.387, Venus: 0.723, Earth: 1.000, Mars: 1.524,
      Jupiter: 5.203, Saturn: 9.537, Uranus: 19.19, Neptune: 30.07
    };

    /* ---- state (defaults match the SWF's opening screen) ---- */
    var a1 = 1.00, a2 = 2.40;          // observer's and target's orbital radii, AU
    var th1 = 0, th2 = 0;              // heliocentric angles, radians — start at opposition
    var counter = 0, speed = 0.25, onEvent = "go", lock = false;
    var pauseLeft = 0, lastEventKey = null;

    function P(a) { return Math.pow(a, 1.5); }
    function synodic() {
      var d = Math.abs(1 / P(a1) - 1 / P(a2));
      return d < 1e-9 ? Infinity : 1 / d;
    }
    function wrapPi(x) { x = (x + Math.PI) % TAU; if (x < 0) x += TAU; return x - Math.PI; }
    function wrapTau(x) { x %= TAU; return x < 0 ? x + TAU : x; }

    // positions
    function obsPos(t1) { return { x: a1 * Math.cos(t1), y: a1 * Math.sin(t1) }; }
    function tgtPos(t2) { return { x: a2 * Math.cos(t2), y: a2 * Math.sin(t2) }; }
    // signed elongation: + is east of the Sun (evening sky), − is west (morning sky)
    function elongAt(t1, t2) {
      var O = obsPos(t1), T = tgtPos(t2);
      var ls = Math.atan2(-O.y, -O.x);
      var lp = Math.atan2(T.y - O.y, T.x - O.x);
      return wrapPi(lp - ls);
    }
    function elong() { return elongAt(th1, th2); }

    /* ---- the four configurations, as relative angles Δ = θ2 − θ1 ---- */
    function events() {
      var k = Math.min(a1, a2) / Math.max(a1, a2);
      var q = Math.acos(Math.max(-1, Math.min(1, k)));
      var sup = a2 > a1;                        // is the target outside the observer's orbit?
      var list = [
        { d: 0, key: sup ? "cf.opp" : "cf.infConj" },
        { d: Math.PI, key: sup ? "cf.conj" : "cf.supConj" },
        { d: q, key: null }, { d: -q, key: null }
      ];
      // name the two quadratures / greatest elongations by which side of the Sun they fall on
      [2, 3].forEach(function (i) {
        var e = elongAt(0, list[i].d);
        list[i].key = sup ? (e > 0 ? "cf.quadE" : "cf.quadW") : (e > 0 ? "cf.gee" : "cf.gwe");
      });
      return list;
    }
    // Δ advances linearly, so each event's time follows directly
    function eventTimes() {
      var S0 = synodic();
      if (!isFinite(S0)) return [];
      var omega = TAU * (1 / P(a2) - 1 / P(a1));      // dΔ/dt
      var d0 = wrapPi(th2 - th1);
      return events().map(function (ev) {
        var t = wrapPi(ev.d - d0) / omega;
        // fold into (−S/2, +S/2]
        while (t <= -S0 / 2) t += S0;
        while (t > S0 / 2) t -= S0;
        return { t: t, key: ev.key };
      }).sort(function (p, q2) { return p.t - q2.t; });
    }

    /* ---- controls ---- */
    S.group("cf.orbits");
    var r1Ctl = S.slider({
      labelKey: "cf.rObs", min: 0.1, max: 12, value: a1, step: 0.01,
      format: function (v) { return v.toFixed(2) + " AU"; },
      on: function (v) { if (lock) return; a1 = v; syncPresets(); upd(); }
    });
    var p1Sel = S.select({
      labelKey: "cf.presetObs", value: "Earth",
      options: [{ v: "", label: "—" }].concat(Object.keys(PLANETS).map(function (k) { return { v: k, label: k }; })),
      on: function (v) { if (lock || !v) return; a1 = PLANETS[v]; lock = true; r1Ctl.set(a1); lock = false; upd(); }
    });
    var r2Ctl = S.slider({
      labelKey: "cf.rTgt", min: 0.1, max: 32, value: a2, step: 0.01,
      format: function (v) { return v.toFixed(2) + " AU"; },
      on: function (v) { if (lock) return; a2 = v; syncPresets(); upd(); }
    });
    var p2Sel = S.select({
      labelKey: "cf.presetTgt", value: "",
      options: [{ v: "", label: "—" }].concat(Object.keys(PLANETS).map(function (k) { return { v: k, label: k }; })),
      on: function (v) { if (lock || !v) return; a2 = PLANETS[v]; lock = true; r2Ctl.set(a2); lock = false; upd(); }
    });
    // keep the preset dropdowns honest when the sliders are moved by hand
    function syncPresets() {
      lock = true;
      p1Sel.set(matchPreset(a1)); p2Sel.set(matchPreset(a2));
      lock = false;
    }
    function matchPreset(a) {
      var best = "";
      Object.keys(PLANETS).forEach(function (k) { if (Math.abs(PLANETS[k] - a) < 0.006) best = k; });
      return best;
    }

    S.group("cf.anim");
    S.slider({
      labelKey: "cf.speed", min: 0.02, max: 2, value: speed, step: 0.01,
      format: function (v) { return v.toFixed(2) + " " + I18N.t("cf.yr") + "/s"; },
      on: function (v) { speed = v; }
    });
    var loop = S.loop(function (dt) {
      if (pauseLeft > 0) { pauseLeft -= dt; if (pauseLeft > 0) return; }
      var d = speed * dt;
      th1 += TAU * d / P(a1); th2 += TAU * d / P(a2); counter += d;
      checkEvent();
      upd();
    });
    var pp = S.playPause(loop);
    S.select({
      labelKey: "cf.onEvent", value: "go",
      options: [{ v: "stop", labelKey: "cf.evStop" }, { v: "go", labelKey: "cf.evGo" }, { v: "pause", labelKey: "cf.evPause" }],
      on: function (v) { onEvent = v; }
    });
    S.button({ labelKey: "cf.zero", on: function () { counter = 0; upd(); } });

    S.group("cf.opts");
    var optLabels = S.toggle({ labelKey: "cf.labelOrbits", value: true });
    var optElong = S.toggle({ labelKey: "cf.showElong", value: false });
    var optSnap = S.toggle({ labelKey: "cf.snap", value: true });
    var dragHint = document.createElement("p");
    dragHint.className = "sim-note"; dragHint.setAttribute("data-i18n", "cf.drag");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(dragHint);

    var outElong = S.readout({ labelKey: "cf.rElong" });
    var outConfig = S.readout({ labelKey: "cf.rConfig" });
    var outSyn = S.readout({ labelKey: "cf.rSyn" });
    var outP1 = S.readout({ labelKey: "cf.rPobs" });
    var outP2 = S.readout({ labelKey: "cf.rPtgt" });
    var outCount = S.readout({ labelKey: "cf.rCount" });

    // fire the "when an event occurs" behaviour as we sweep past a configuration
    function checkEvent() {
      var evs = eventTimes(), near = null;
      evs.forEach(function (e) { if (Math.abs(e.t) < 0.004 && (!near || Math.abs(e.t) < Math.abs(near.t))) near = e; });
      var key = near ? near.key : null;
      if (key && key !== lastEventKey) {
        lastEventKey = key;
        if (onEvent === "stop") { loop.pause(); pp.sync(); }
        else if (onEvent === "pause") pauseLeft = 5;
      } else if (!key) lastEventKey = null;
    }

    function upd() {
      var e = elong() * R2D;
      outElong(Math.abs(e).toFixed(1) + "°" + (Math.abs(e) < 0.05 || Math.abs(e) > 179.95 ? "" : (e > 0 ? " E" : " W")));
      var evs = eventTimes(), best = null;
      evs.forEach(function (x) { if (!best || Math.abs(x.t) < Math.abs(best.t)) best = x; });
      outConfig(best ? I18N.t(best.key) : "—");
      var S0 = synodic();
      outSyn(isFinite(S0) ? S0.toFixed(3) + " " + I18N.t("cf.yr") : "∞");
      outP1(P(a1).toFixed(3) + " " + I18N.t("cf.yr"));
      outP2(P(a2).toFixed(3) + " " + I18N.t("cf.yr"));
      outCount(counter.toFixed(3) + " " + I18N.t("cf.yr"));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- dragging either planet around its orbit ---- */
    var DX = 222, DY = 224, DR = 172;              // diagram centre + max drawn radius
    function scale() { return DR / Math.max(a1, a2); }
    function toScreen(p) { return { x: DX + p.x * scale(), y: DY - p.y * scale() }; }
    function localXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    var drag = null;
    S.canvas.addEventListener("pointerdown", function (ev) {
      var m = localXY(ev);
      var o = toScreen(obsPos(th1)), g = toScreen(tgtPos(th2));
      if (Math.hypot(m.x - o.x, m.y - o.y) < 16) drag = "obs";
      else if (Math.hypot(m.x - g.x, m.y - g.y) < 16) drag = "tgt";
      if (drag) S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var m = localXY(ev), ang = Math.atan2(DY - m.y, m.x - DX);
      if (drag === "obs") th1 = ang; else th2 = ang;
      if (optSnap.value()) snapToEvent();
      upd();
    });
    S.canvas.addEventListener("pointerup", function () { drag = null; });

    // pull the dragged planet onto the nearest configuration
    function snapToEvent() {
      var d0 = wrapPi(th2 - th1), best = null;
      events().forEach(function (ev) {
        var diff = Math.abs(wrapPi(ev.d - d0));
        if (diff < 6 * D2R && (!best || diff < best.diff)) best = { d: ev.d, diff: diff };
      });
      if (!best) return;
      if (drag === "tgt") th2 = th1 + best.d; else th1 = th2 - best.d;
    }

    /* ================================ drawing ================================ */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      drawDiagram(ctx, t);
      drawTimeline(ctx, t);
      drawZodiac(ctx, t);
    });

    function panel(ctx, x, y, w, h, title) {
      ctx.fillStyle = C.panel; ctx.strokeStyle = C.border; ctx.lineWidth = 1;
      roundRect(ctx, x, y, w, h, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = "12px system-ui"; ctx.textAlign = "left";
      ctx.fillText(title, x + 14, y + 20);
    }

    function drawDiagram(ctx, t) {
      panel(ctx, 12, 12, 418, 424, t("cf.diagram"));
      var s = scale();

      // the two orbits
      [[a1, C.obs], [a2, C.tgt]].forEach(function (o) {
        ctx.beginPath(); ctx.arc(DX, DY, o[0] * s, 0, TAU);
        ctx.strokeStyle = C.orbit; ctx.lineWidth = 1.2; ctx.stroke();
      });

      // orbit captions, curved along the top / bottom of each circle
      if (optLabels.value()) {
        arcText(ctx, t("cf.tgtPlanet"), DX, DY, a2 * s - 14, -Math.PI / 2, true, C.dim);
        arcText(ctx, t("cf.obsPlanet"), DX, DY, a1 * s - 14, Math.PI / 2, false, C.dim);
      }

      var O = toScreen(obsPos(th1)), T = toScreen(tgtPos(th2));

      // the elongation wedge, measured at the observer's planet
      if (optElong.value()) {
        var as = Math.atan2(DY - O.y, DX - O.x), ap = Math.atan2(T.y - O.y, T.x - O.x);
        ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(DX, DY);
        ctx.moveTo(O.x, O.y); ctx.lineTo(T.x, T.y);
        ctx.strokeStyle = "rgba(126,224,160,.55)"; ctx.lineWidth = 1; ctx.stroke();
        var sweep = wrapPi(ap - as);
        ctx.beginPath();
        ctx.arc(O.x, O.y, 34, as, as + sweep, sweep < 0);
        ctx.strokeStyle = C.elong; ctx.lineWidth = 2; ctx.stroke();
        var mid = as + sweep / 2;
        ctx.fillStyle = C.elong; ctx.font = "600 11px system-ui"; ctx.textAlign = "center";
        ctx.fillText(Math.abs(elong() * R2D).toFixed(1) + "°", O.x + 50 * Math.cos(mid), O.y + 50 * Math.sin(mid) + 4);
      }

      // the Sun
      var g = ctx.createRadialGradient(DX, DY, 1, DX, DY, 16);
      g.addColorStop(0, "#fff6cf"); g.addColorStop(1, C.sun);
      ctx.beginPath(); ctx.arc(DX, DY, 9, 0, TAU); ctx.fillStyle = g; ctx.fill();

      // the planets
      dot(ctx, T.x, T.y, 7, C.tgt);
      dot(ctx, O.x, O.y, 7, C.obs);
    }

    function drawTimeline(ctx, t) {
      var X = 442, Y = 12, W = 266, H = 424;
      panel(ctx, X, Y, W, H, t("cf.timeline"));
      var S0 = synodic();
      var top = Y + 54, bot = Y + H - 46, mid = (top + bot) / 2;
      if (!isFinite(S0)) {
        ctx.fillStyle = C.dim; ctx.font = "12px system-ui"; ctx.textAlign = "center";
        ctx.fillText("—", X + W / 2, mid); return;
      }
      var half = S0 / 2;
      function ty(time) { return mid + (time / half) * (bot - mid); }

      // the axis and its quarter ticks
      ctx.strokeStyle = "rgba(200,215,255,.16)"; ctx.lineWidth = 1;
      [-1, -0.5, 0, 0.5, 1].forEach(function (f) {
        var y = ty(f * half);
        ctx.beginPath(); ctx.moveTo(X + 14, y); ctx.lineTo(X + W - 14, y); ctx.stroke();
        ctx.fillStyle = C.dim; ctx.font = "10px ui-monospace, monospace"; ctx.textAlign = "right";
        ctx.fillText((f * half).toFixed(2) + " " + t("cf.yr"), X + W - 16, y - 4);
      });

      ctx.fillStyle = "rgba(159,171,206,.6)"; ctx.font = "italic 12px system-ui"; ctx.textAlign = "center";
      ctx.fillText(t("cf.past"), X + W / 2, top - 14);
      ctx.fillText(t("cf.future"), X + W / 2, bot + 30);

      // every configuration in this synodic period, at the time it happens. An
      // event sitting on one end of the window also belongs at the other, so the
      // cycle reads as a loop the way the original's timeline does.
      var shown = [];
      eventTimes().forEach(function (e) {
        shown.push(e);
        if (e.t > half * 0.98) shown.push({ t: e.t - S0, key: e.key });
        else if (e.t < -half * 0.98) shown.push({ t: e.t + S0, key: e.key });
      });
      shown.forEach(function (e) {
        var y = ty(e.t), now = Math.abs(e.t) < half * 0.02;
        ctx.fillStyle = now ? C.mark : C.text;
        ctx.font = (now ? "600 " : "") + "11.5px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(t(e.key), X + 18, y + 12);
      });

      // the "now" line, with the SWF's red arrowheads
      var y0 = ty(0);
      ctx.strokeStyle = C.mark; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(X + 14, y0); ctx.lineTo(X + W - 14, y0); ctx.stroke();
      tri(ctx, X + 14, y0, 1); tri(ctx, X + W - 14, y0, -1);
    }

    /* ============================ the zodiac strip ============================
       A port of the SWF's own ZodiacStripClass (decoded from its ActionScript).
       The strip is a 400×60 chart of the ecliptic — drawn here at ZK canvas px per
       SWF px — carrying the real stick figures of the twelve zodiac constellations.
       The sky stays put: the Sun and the planet ride along it at
       x = −longitude·400/2π plus a drag offset (the SWF opens at −100), wrapped
       around the strip, so both drift eastward (leftward) as the planets orbit.
       "sun" and "planet" hang above their icons on leader lines — the Sun's label
       higher, so the two never collide — and under the strip one arrow runs from
       the Sun to the planet with the elongation printed beneath it, spilling off
       both edges with dotted stubs when it wraps. Hovering a figure lights it up
       blue and names it; dragging anywhere on the strip scrolls the sky.        */
    var ZW = 400, ZH = 60, ZK = 1.4;                   // SWF strip size; canvas px per SWF px
    var ZX = 80, ZY = 524;                             // the strip's top-left corner on the canvas
    var ZSCALE = ZW / 6.28319;                         // strip px per radian of longitude
    var Z_ACTIVE = "#1b76e4", Z_NORMAL = "#b0b0b0", Z_BORDER = "#999999";
    var zOffset = -100, zHover = null, zDrag = null;

    // the SWF's constellationsData: star-chart positions + stick-figure runs [m, b, e]
    var CONSTELLATIONS = (function () {
      var raw = [
      { name: "leo", stars: [415.2,-46.2,422.1,-44.7,425.5,-50.9,411.9,-50.6,400.2,-45.5,398.6,-37.6,378,-39.2,372.3,-39.9,355.3,-28.3,372.3,-30,367.5,-20.5,368.9,-11.7,392.4,-18.1,404.8,-32.6,404.3,-23.3,417.5,-19.2],
        paths: [3,0,9,7,9,12,9,12,13,9,13,15,13,0,1,13,5,6,13,15,16] },
      { name: "gemini", stars: [523,-45.2,517.8,-43.8,513.8,-43.8,503.7,-48.9,490.4,-58.8,483.3,-54.1,478.4,-52.3,486.1,-42.7,493.8,-40,506.6,-31.9,487,-32.2,503,-25.1,510.9,-39.3,499.3,-66,481.7,-61.8,479,-62,473.8,-54.5,474.2,-47.4],
        paths: [0,1,10,7,10,12,3,12,13,4,13,14,4,14,16,6,16,17,6,17,18] },
      { name: "sagittarius", stars: [163.2,66.9,166.4,71.5,172.2,59.2,168.3,40.9,161.4,49.4,164.8,58,152.8,52.5,148.1,51.1,141.1,40.9,135.3,34.7,135.3,31,146.9,41,142.4,53.8,144.6,58.1,134.2,79,116.8,68.6,119,81.4,134.8,86.4,134.6,87.1],
        paths: [5,0,11,2,5,6,11,8,9,11,7,8,15,12,17,14,17,19,7,12,13,6,13,14] },
      { name: "capricornus", stars: [73.5,42.4,74.6,43.6,84.6,33.5,76.7,32.7,68,32.4,64.6,31.4,85.4,38.6,102.6,34.6,106.5,28.7,107.9,24.4,84,48.6,94.3,49.1,91.5,52.3],
        paths: [3,0,6,2,6,10,2,8,9,6,10,11,7,11,13] },
      { name: "aries", stars: [617.4,-53,618.4,-56.9,620.6,-53.9,638.2,-45.6,642.7,-45.9,644.3,-40.5,644.8,-37.5,635.5,-41.2,612.9,-41.5,606.8,-38.4],
        paths: [2,0,6,5,3,4,3,7,8,6,7,10,8,0,1] },
      { name: "cancer", stars: [460.7,-34.3,458.6,-17.9,444.9,-35.3,445.6,-41.7,444,-55.9,438.2,-23.1],
        paths: [3,0,5,2,5,6] },
      { name: "virgo", stars: [347.5,-17,356.9,-12.7,354.5,-3.4,340.3,1.3,329.8,2.8,316,10.8,308.6,21.7,285.4,20,283.9,11.7,290.8,-3,304,1.2,323,-6.6,319.8,-21.3,269.2,-3.7,270.7,11],
        paths: [4,0,13,8,14,15,9,13,14,10,6,7,11,4,5] },
      { name: "pisces", stars: [665.2,-58.5,661.4,-53,664.2,-47.8,655.5,-29.8,648.7,-17.8,640.7,-5.4,650.7,-10.7,669.4,-15.3,676.3,-14.7,700.3,-13.3,709.7,-10.9,715.6,-12.4,720.8,-6.4,716.1,-2.4,708.7,-3.5,727.3,-7.4],
        paths: [0,1,15,14,10,11,12,15,16] },
      { name: "scorpius", stars: [179.9,72,187.8,72.2,189.2,72.5,186.2,74.6,183.5,75.9,181,78,186,83.6,198.2,84.1,206.8,82.4,208.1,74,209,66.7,215.9,54.9,219,51.4,223,49.8,227.4,54.3,234.9,56.8,233.9,50.8,227.5,37.8,230.7,38.5,233.2,44],
        paths: [0,1,17,13,17,20] },
      { name: "aquarius", stars: [22.2,11.8,19.9,18.7,8.4,28.3,6.8,36.3,16.5,40.1,24.6,41.2,31.8,30.8,34.2,26.4,32.8,14.7,44.3,0,47.8,2.7,56.7,4.2,72.2,10.8,93.5,18.5,46.1,-2.7],
        paths: [8,0,14,9,14,15] },
      { name: "taurus", stars: [541.4,-55.6,562.8,-44.6,569.4,-37.3,570.9,-34.9,572.2,-34.1,573.7,-30.4,583,-24.3,599.3,-18.9,600.4,-17.6,569.4,-30.9,565.9,-32.1,535.9,-41.1],
        paths: [0,1,9,5,9,12] },
      { name: "libra", stars: [243.7,57.9,244.5,54.7,245.2,28.8,254.2,18.2,266.9,31.2,260.5,49.2],
        paths: [0,1,6,2,4,5] }
    ];
      var e = 0.409134;                                // obliquity, as the SWF writes it
      return raw.map(function (c) {
        var pts = [];
        for (var i = 0; i < c.stars.length; i += 2) {  // chart (x, y) → RA/Dec → ecliptic → strip
          var ra = -c.stars[i] * 3.14159 / 350, dec = -c.stars[i + 1] * 3.14159 / 350;
          var elat = Math.asin(Math.sin(dec) * Math.cos(e) - Math.cos(dec) * Math.sin(ra) * Math.sin(e));
          var coselon = Math.cos(dec) * Math.cos(ra) / Math.cos(elat);
          var sinelon = (Math.cos(dec) * Math.sin(ra) * Math.cos(e) + Math.sin(dec) * Math.sin(e)) / Math.cos(elat);
          var elon = ((Math.atan2(sinelon, coselon) % 6.28319) + 6.28319) % 6.28319;
          pts.push({ x: zWrap(-elon * ZSCALE), y: ZH / 2 - elat * ZSCALE });
        }
        // keep a figure that straddles longitude 0 in one piece (the SWF special-cases Pisces)
        var xs = pts.map(function (p) { return p.x; });
        if (Math.max.apply(null, xs) - Math.min.apply(null, xs) > ZW / 2)
          pts.forEach(function (p) { if (p.x > ZW / 2) p.x -= ZW; });
        var runs = [];
        for (var j = 0; j < c.paths.length; j += 3) {  // moveTo star m, then lineTo stars b … e−1
          var run = [c.paths[j]];
          for (var k = c.paths[j + 1]; k < c.paths[j + 2]; k++) run.push(k);
          runs.push(run);
        }
        var box = { x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9 };
        pts.forEach(function (p) {
          box.x0 = Math.min(box.x0, p.x - 3); box.x1 = Math.max(box.x1, p.x + 3);
          box.y0 = Math.min(box.y0, p.y - 3); box.y1 = Math.max(box.y1, p.y + 3);
        });
        return { label: c.name.charAt(0).toUpperCase() + c.name.slice(1), pts: pts, runs: runs, box: box };
      });
    })();
    function zWrap(v) { return ((v % ZW) + ZW) % ZW; }
    function zAreaX() { var off = zWrap(zOffset); return off < ZW / 2 ? off : off - ZW; }   // stripAreaMC._x

    function drawFigures(c, shift, color, only) {
      c.lineWidth = 1; c.strokeStyle = color; c.lineJoin = "round"; c.lineCap = "round";
      c.fillStyle = color === Z_NORMAL ? "#8a8a8a" : color;
      CONSTELLATIONS.forEach(function (con) {
        if (only && con !== only) return;
        c.beginPath();
        con.runs.forEach(function (run) {
          run.forEach(function (idx, n) {
            var p = con.pts[idx];
            n ? c.lineTo(p.x + shift, p.y) : c.moveTo(p.x + shift, p.y);
          });
        });
        c.stroke();
        con.pts.forEach(function (p) { c.fillRect(p.x + shift - 0.7, p.y - 0.7, 1.4, 1.4); });
      });
    }

    // the 'Zodiac Image' — a speckled star chart with the figures in their resting grey —
    // rendered once, then tiled three times per frame like the SWF's three copies
    var zTile = (function () {
      var dpr = S.canvas.width / S.W;
      var cv = document.createElement("canvas");
      cv.width = Math.round(ZW * ZK * dpr); cv.height = Math.round(ZH * ZK * dpr);
      var c = cv.getContext("2d");
      c.scale(ZK * dpr, ZK * dpr);
      c.fillStyle = "#fdfdfd"; c.fillRect(0, 0, ZW, ZH);
      var s = 424242;
      function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
      for (var i = 0; i < 2400; i++) {                 // faint background speckle
        var g = 175 + Math.floor(rnd() * 70);
        c.fillStyle = "rgb(" + g + "," + g + "," + g + ")";
        c.fillRect(rnd() * ZW, rnd() * ZH, 0.5 + rnd() * 0.45, 0.5 + rnd() * 0.45);
      }
      for (var j = 0; j < 70; j++) {                   // brighter field stars print as darker specks
        var d = 70 + Math.floor(rnd() * 80), sz = 0.7 + rnd() * 0.8;
        c.fillStyle = "rgb(" + d + "," + d + "," + d + ")";
        c.fillRect(rnd() * ZW, rnd() * ZH, sz, sz);
      }
      [-ZW, 0, ZW].forEach(function (shift) { drawFigures(c, shift, Z_NORMAL, null); });
      return cv;
    })();

    // longitudes and the elongation string, exactly as the SWF's update() works them out
    function zodiacState() {
      var x1 = a1 * Math.cos(th1), y1 = a1 * Math.sin(th1);
      var x2 = a2 * Math.cos(th2), y2 = a2 * Math.sin(th2);
      var planetLon = ((Math.atan2(y2 - y1, x2 - x1) % 6.28319) + 6.28319) % 6.28319;
      var sunLon = ((Math.atan2(-y1, -x1) % 6.28319) + 6.28319) % 6.28319;
      var el = (((sunLon - planetLon) * 180 / 3.14159) % 360 + 360) % 360;
      if (el > 180) el -= 360;
      var text = Math.abs(el).toFixed(1), value = parseFloat(text);
      if (el < 0 && value !== 180) value = -value;     // negative ⇒ the planet is east of the Sun
      text += "°";
      if (value < 0) text += " " + I18N.t("cf.E");
      else if (value > 0 && value !== 180) text += " " + I18N.t("cf.W");
      return { planetLon: planetLon, sunLon: sunLon, value: value, text: text };
    }

    function figureAt(p) {                             // which constellation's area is under p?
      var tx = p.x - zAreaX(), best = null, bestD = 1e9;
      CONSTELLATIONS.forEach(function (con) {
        [-ZW, 0, ZW].forEach(function (k) {
          var b = con.box;
          if (tx < b.x0 + k || tx > b.x1 + k || p.y < b.y0 || p.y > b.y1) return;
          var d = Math.hypot(tx - (b.x0 + b.x1) / 2 - k, p.y - (b.y0 + b.y1) / 2);
          if (d < bestD) { bestD = d; best = con; }
        });
      });
      return best;
    }

    /* ---- strip interaction: drag to scroll (setOffset), hover to name a figure ---- */
    function stripXY(ev) { var m = localXY(ev); return { x: (m.x - ZX) / ZK, y: (m.y - ZY) / ZK }; }
    function inStrip(p) { return p.x >= 0 && p.x < ZW && p.y >= 0 && p.y < ZH; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = stripXY(ev);
      if (!inStrip(p)) return;
      zDrag = { x: p.x, offset: zOffset };
      S.canvas.setPointerCapture(ev.pointerId);
      S.canvas.style.cursor = "grabbing";
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stripXY(ev);
      if (zDrag) { zOffset = zDrag.offset + (p.x - zDrag.x); S.requestDraw(); return; }
      var over = inStrip(p), hit = over ? figureAt(p) : null;
      S.canvas.style.cursor = over ? "grab" : "";
      if (hit !== zHover) { zHover = hit; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerup", function () {
      if (zDrag) { zDrag = null; S.canvas.style.cursor = "grab"; }
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (zHover) { zHover = null; S.requestDraw(); }
      if (!zDrag) S.canvas.style.cursor = "";
    });

    function drawZodiac(ctx, t) {
      var X = 12, Y = 448, W = 696, H = 208;
      panel(ctx, X, Y, W, H, t("cf.zodiac"));

      var z = zodiacState(), off = zWrap(zOffset), areaX = zAreaX();
      var planetX = zWrap(ZW - z.planetLon * ZSCALE + off);
      var sunX = zWrap(ZW - z.sunLon * ZSCALE + off);

      ctx.save();
      ctx.translate(ZX, ZY);
      ctx.scale(ZK, ZK);                               // SWF strip coordinates from here on

      /* ---- inside the strip (the SWF masks stripAreaMC to the 400×60 box) ---- */
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, ZW, ZH); ctx.clip();
      [-ZW, 0, ZW].forEach(function (k) { ctx.drawImage(zTile, areaX + k, 0, ZW, ZH); });
      if (zHover) {
        [-ZW, 0, ZW].forEach(function (k) { drawFigures(ctx, areaX + k, Z_ACTIVE, zHover); });
        ctx.fillStyle = Z_ACTIVE; ctx.font = "10px Verdana, Geneva, sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        var nx = (zHover.box.x0 + zHover.box.x1) / 2;
        [-ZW, 0, ZW].forEach(function (k) { ctx.fillText(zHover.label, areaX + nx + k, 8); });
      }
      // Sun and planet icons, three copies each so they wrap smoothly off the edges. A
      // superior planet always passes behind the Sun; an inferior one does so while on
      // the far side of its orbit. The planet's outline is always drawn on top.
      var behind = a2 > a1 || Math.cos(th2 - th1) < 0;
      [-ZW, 0, ZW].forEach(function (k) {
        if (behind) { planetIcon(ctx, planetX + k); sunIcon(ctx, sunX + k); }
        else { sunIcon(ctx, sunX + k); planetIcon(ctx, planetX + k); }
        ctx.beginPath(); ctx.arc(planetX + k, ZH / 2, 4.6, 0, TAU);
        ctx.lineWidth = 0.8; ctx.strokeStyle = "#3a3a3a"; ctx.stroke();
      });
      ctx.restore();

      ctx.lineWidth = 1; ctx.strokeStyle = Z_BORDER;
      ctx.strokeRect(0, 0, ZW, ZH);

      /* ---- leader lines + labels: the Sun's hangs 18 px up, the planet's 5 px ---- */
      leaderLine(ctx, sunX, 18, 12);
      leaderLine(ctx, planetX, 5, 8);
      ctx.fillStyle = C.text; ctx.font = "11px Verdana, Geneva, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("cf.sun"), sunX, -25);
      ctx.fillText(t("cf.planet"), planetX, -12);

      ctx.save(); ctx.translate(-9, ZH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText(t("cf.east"), 0, 0); ctx.restore();
      ctx.save(); ctx.translate(ZW + 9, ZH / 2); ctx.rotate(Math.PI / 2);
      ctx.fillText(t("cf.west"), 0, 0); ctx.restore();

      /* ---- the elongation arrow, Sun → planet, as updateLabelPositions() draws it ---- */
      var y = ZH + 7, len = Math.abs(z.value) * ZW / 360, labelX = sunX;
      ctx.beginPath();
      if (z.value < 0) {                               // east: the planet lies to the Sun's left
        if (planetX > sunX) {                          // …unless it wrapped round the strip
          ctx.moveTo(sunX, y); ctx.lineTo(-2, y); edgeDashes(ctx, y);
          ctx.moveTo(ZW + 2, y); ctx.lineTo(planetX, y);
          labelX = sunX - len / 2; if (labelX < 0) labelX += ZW;
        } else {
          ctx.moveTo(sunX, y); ctx.lineTo(planetX, y);
          labelX = sunX - len / 2;
        }
      } else if (z.value > 0) {                        // west: the planet lies to the Sun's right
        if (planetX < sunX) {
          ctx.moveTo(sunX, y); ctx.lineTo(ZW + 2, y); edgeDashes(ctx, y);
          ctx.moveTo(-2, y); ctx.lineTo(planetX, y);
          labelX = sunX + len / 2; if (labelX > ZW) labelX -= ZW;
        } else {
          ctx.moveTo(sunX, y); ctx.lineTo(planetX, y);
          labelX = sunX + len / 2;
        }
      }
      ctx.lineWidth = 1; ctx.strokeStyle = C.text; ctx.lineCap = "butt"; ctx.stroke();
      if (z.value !== 0) {                             // the one arrowhead, at the planet, shrinking
        var f = Math.min(1, len / 27), dir = z.value < 0 ? -1 : 1;   // for short arrows
        ctx.beginPath();
        ctx.moveTo(planetX - dir * 9 * f, y - 3.5 * f); ctx.lineTo(planetX, y);
        ctx.lineTo(planetX - dir * 9 * f, y + 3.5 * f);
        ctx.lineWidth = 1.2; ctx.lineJoin = "miter"; ctx.stroke();
      }
      ctx.fillStyle = C.text;
      ctx.fillText(z.text, labelX, y + 13);
      ctx.textBaseline = "alphabetic";
      ctx.restore();
    }
    function leaderLine(ctx, x, top, gap) {            // broken around the icon it points at
      ctx.beginPath();
      ctx.moveTo(x, -top); ctx.lineTo(x, ZH / 2 - gap);
      ctx.moveTo(x, ZH / 2 + gap); ctx.lineTo(x, ZH + 14);
      ctx.lineWidth = 1; ctx.strokeStyle = Z_BORDER; ctx.stroke();
    }
    function edgeDashes(ctx, y) {                      // "- - -" where a wrapped arrow leaves the strip
      [4, 7, 10].forEach(function (d) {
        ctx.moveTo(-d, y); ctx.lineTo(-d - 1, y);
        ctx.moveTo(ZW + d, y); ctx.lineTo(ZW + d + 1, y);
      });
    }
    function sunIcon(ctx, x) {
      var g = ctx.createRadialGradient(x - 2.6, ZH / 2 - 3, 0.8, x, ZH / 2, 8.6);
      g.addColorStop(0, "#fde68a"); g.addColorStop(0.55, "#fbbf3b"); g.addColorStop(1, "#f0a91e");
      ctx.beginPath(); ctx.arc(x, ZH / 2, 8.6, 0, TAU);
      ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = Z_BORDER; ctx.stroke();
    }
    function planetIcon(ctx, x) {
      var g = ctx.createRadialGradient(x - 1.5, ZH / 2 - 1.8, 0.4, x, ZH / 2, 4.6);
      g.addColorStop(0, "#cacaca"); g.addColorStop(1, "#4e4e4e");
      ctx.beginPath(); ctx.arc(x, ZH / 2, 4.6, 0, TAU);
      ctx.fillStyle = g; ctx.fill();
    }

    /* ---- small canvas helpers ---- */
    function dot(ctx, x, y, r, col) {
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,.45)"; ctx.lineWidth = 1; ctx.stroke();
    }
    function tri(ctx, x, y, dir, col) {
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + dir * 9, y - 5); ctx.lineTo(x + dir * 9, y + 5); ctx.closePath();
      ctx.fillStyle = col || C.mark; ctx.fill();
    }
    /* A caption bent around a circle, the way the original labels its orbits.
       Angles here are screen angles (y down). Along the top of the circle the
       glyphs advance clockwise and lean by φ+90°; along the bottom they advance
       the other way and lean by φ−90°, which is what keeps them upright. */
    function arcText(ctx, text, cx, cy, r, phiC, top, col) {
      if (r < 26) return;
      ctx.save(); ctx.fillStyle = col; ctx.font = "italic 11px system-ui";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      var w = [], total = 0, i;
      for (i = 0; i < text.length; i++) { w[i] = ctx.measureText(text[i]).width; total += w[i]; }
      var dir = top ? 1 : -1, phi = phiC - dir * (total / (2 * r));
      for (i = 0; i < text.length; i++) {
        phi += dir * (w[i] / 2) / r;
        ctx.save();
        ctx.translate(cx + r * Math.cos(phi), cy + r * Math.sin(phi));
        ctx.rotate(phi + dir * Math.PI / 2);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
        phi += dir * (w[i] / 2) / r;
      }
      ctx.restore(); ctx.textBaseline = "alphabetic";
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    syncPresets();
    upd();
  }
});
