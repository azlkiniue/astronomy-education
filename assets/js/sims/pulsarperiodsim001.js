/* Pulsar Period Simulator --------------------------------------------------------
   Faithful rebuild of ClassAction's "pulsarPeriodSim001.swf". A pulsar ticks
   perfectly evenly, but if something is swinging it around, the pulses have
   further or less far to travel on their way to us. The arrival times bunch up
   and spread out, and that timing wobble is how the first planets outside the
   solar system were found.

   The SWF's own numbers: pulse period 250, pulse speed 0.1 px per unit time,
   orbit radius 100 about (120, 120), orbital period 12000, Earth at (864, 568),
   and an intervals plot 350 x 180 spanning 40000 units, scaled between
   250 (1 -/+ 1.07 v / c) with v = 2 pi r / P. The pulses are coloured by the
   pulsar's velocity along the line of sight, as in the SWF, but in red and
   blue rather than its yellow-to-cyan ramp.                                   */
Sim.create({
  id: "pulsarperiodsim001",
  width: 900, height: 470,
  strings: {
    en: {
      "pp.ctl": "Pulsar motion", "pp.mode": "motion", "pp.stationary": "stationary",
      "pp.circular": "circular orbit", "pp.colour": "colour the pulses by Doppler shift",
      "pp.speed": "Animation speed", "pp.reset": "Reset",
      "pp.rEmit": "emitted period", "pp.rArrive": "arrival interval",
      "pp.rPhase": "orbital phase", "pp.rVel": "line-of-sight velocity",
      "pp.plot": "Interval between arriving pulses", "pp.earth": "Earth",
      "pp.toward": "towards us", "pp.away": "away from us", "pp.across": "across our line of sight",
      "pp.hint": "The pulsar ticks like a metronome. Watch the arrival intervals on the right stretch and squeeze as it swings towards us and away — with the pulsar held still they are a flat line.",
      "pp.units": "u"
    },
    id: {
      "pp.ctl": "Gerak pulsar", "pp.mode": "gerak", "pp.stationary": "diam",
      "pp.circular": "orbit lingkaran", "pp.colour": "warnai pulsa menurut efek Doppler",
      "pp.speed": "Kecepatan animasi", "pp.reset": "Atur ulang",
      "pp.rEmit": "periode pancaran", "pp.rArrive": "selang kedatangan",
      "pp.rPhase": "fase orbit", "pp.rVel": "kecepatan arah pandang",
      "pp.plot": "Selang antara pulsa yang tiba", "pp.earth": "Bumi",
      "pp.toward": "mendekati kita", "pp.away": "menjauhi kita",
      "pp.across": "melintang arah pandang",
      "pp.hint": "Pulsar berdetak seperti metronom. Perhatikan selang kedatangan di kanan merentang dan memampat saat ia berayun mendekat lalu menjauh — bila pulsar ditahan diam, selangnya berupa garis datar.",
      "pp.units": "u"
    }
  },
  about: {
    en: "<p>A pulsar is a neutron star sweeping a beam of radio waves past us as it spins, and the spin is astonishingly steady — some of them keep better time than an atomic clock. That makes any irregularity in the arrival of the pulses interesting, because the pulsar itself is almost certainly not to blame.</p>" +
        "<p>If something is in orbit around the pulsar, the pulsar orbits the shared centre of mass in return. When that motion carries it towards us the pulses have a slightly shorter journey and arrive early; half an orbit later they have further to go and arrive late. The pulses are still emitted perfectly evenly; only their travel time has changed.</p>" +
        "<p>This is how the first confirmed planets outside the solar system were found. In 1992 Aleksander Wolszczan and Dale Frail timed the millisecond pulsar PSR B1257+12 and pulled two planets out of a wobble of a few milliseconds — three years before the first planet was found around an ordinary star.</p>",
    id: "<p>Pulsar adalah bintang neutron yang menyapukan berkas gelombang radio melewati kita saat berputar, dan putarannya sangat mantap — sebagian di antaranya menyimpan waktu lebih baik daripada jam atom. Itu membuat setiap ketidakteraturan kedatangan pulsanya menarik, karena hampir pasti bukan pulsar itu sendiri yang bersalah.</p>" +
        "<p>Bila ada sesuatu yang mengorbit pulsar, pulsar itu pun mengelilingi pusat massa bersama. Ketika gerak itu membawanya mendekat kepada kita, pulsanya menempuh perjalanan sedikit lebih pendek dan tiba lebih awal; setengah orbit kemudian jaraknya lebih jauh dan pulsanya tiba terlambat. Pulsa itu tetap dipancarkan dengan selang yang sempurna rata; hanya waktu tempuhnya yang berubah.</p>" +
        "<p>Beginilah planet pertama di luar tata surya yang terkonfirmasi ditemukan. Pada 1992 Aleksander Wolszczan dan Dale Frail mengukur waktu pulsar milidetik PSR B1257+12 dan menarik dua planet dari goyangan beberapa milidetik — tiga tahun sebelum planet pertama ditemukan mengelilingi bintang biasa.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

    /* the SWF's frame1 constants */
    var PULSE_PERIOD = 250, PULSE_SPEED = 0.1;
    var ORBIT_R = 100, ORBIT_X = 120, ORBIT_Y = 120, ORBIT_PERIOD = 12000;
    var EARTH = { x: 864, y: 428 };               // the SWF's (863.95, 567.9), lifted
    var V_PULSAR = TAU * ORBIT_R / ORBIT_PERIOD;
    var MIN_DELTA = PULSE_PERIOD * (1 - 1.07 * V_PULSAR / PULSE_SPEED);
    var MAX_DELTA = PULSE_PERIOD * (1 + 1.07 * V_PULSAR / PULSE_SPEED);
    var PLOT = { x: 535, y: 26, w: 350, h: 180, span: 40000 };

    var time = 0, lastPulseNum = 1, circular = true, colour = true, speedExp = 0;
    var pulses = [], arrivals = [], lastArrival = null, lastDelta = null;

    function pulsarAt(t) {
      if (!circular) return { x: ORBIT_X, y: ORBIT_Y, vx: 0, vy: 0 };
      var a = TAU * t / ORBIT_PERIOD;
      return { x: ORBIT_X + ORBIT_R * Math.cos(a), y: ORBIT_Y + ORBIT_R * Math.sin(a),
        vx: -Math.sin(a), vy: Math.cos(a) };
    }
    /* keyed to the line-of-sight velocity u: soft red while the pulsar moves
       away, soft blue while it comes toward us, through a neutral grey as it
       crosses. (The SWF ran yellow → grey → cyan; red and blue are the Doppler
       convention, and these tones read on the dark sky and the white plot.)  */
    var AWAY = [229, 115, 115], TOWARD = [122, 162, 247], ACROSS = [160, 168, 182];
    function doppler(u) {
      var k = Math.min(1, Math.abs(u)), end = u < 0 ? AWAY : TOWARD;
      return "rgb(" + [0, 1, 2].map(function (i) {
        return Math.round(ACROSS[i] + (end[i] - ACROSS[i]) * k);
      }).join(",") + ")";
    }
    function losAt(t) {
      var p = pulsarAt(t);
      var dx = EARTH.x - p.x, dy = EARTH.y - p.y, d = Math.hypot(dx, dy);
      return { u: (p.vx * dx + p.vy * dy) / d, d: d, p: p };
    }

    function emit(upTo) {
      var n = Math.floor(upTo / PULSE_PERIOD);
      while (lastPulseNum <= n) {
        var t0 = lastPulseNum * PULSE_PERIOD;
        var s = losAt(t0);
        var t1 = t0 + s.d / PULSE_SPEED;
        pulses.push({ x0: s.p.x, y0: s.p.y, t0: t0, t1: t1, d: s.d,
          mx: (EARTH.x - s.p.x) / (t1 - t0), my: (EARTH.y - s.p.y) / (t1 - t0),
          colour: doppler(s.u), arrived: false });
        lastPulseNum++;
      }
    }
    function harvest() {
      for (var i = 0; i < pulses.length; i++) {
        var p = pulses[i];
        if (p.arrived || p.t1 > time) continue;
        p.arrived = true;
        if (lastArrival !== null) {
          lastDelta = p.t1 - lastArrival;
          arrivals.push({ t: p.t1, d: lastDelta, colour: p.colour });
        }
        lastArrival = p.t1;
      }
      while (pulses.length && pulses[0].arrived && pulses[0].t1 < time - 500) pulses.shift();
      while (arrivals.length && arrivals[0].t < time - PLOT.span) arrivals.shift();
    }
    function reset() {
      time = 0; lastPulseNum = 1; pulses = []; arrivals = [];
      lastArrival = null; lastDelta = null;
      emit(0);
      sync();
    }

    /* ------------------------------------------------------------- controls */
    S.group("pp.ctl");
    var modeCtl = S.select({ labelKey: "pp.mode", value: "circular",
      options: [{ v: "circular", labelKey: "pp.circular" },
        { v: "stationary", labelKey: "pp.stationary" }],
      on: function (v) { circular = v === "circular"; reset(); } });
    var colCtl = S.toggle({ labelKey: "pp.colour", value: true,
      on: function (v) { colour = v; } });
    var speedCtl = S.slider({ labelKey: "pp.speed", min: -1.5, max: 2.5, value: 0, step: 0.1,
      format: function (v) { return Math.exp(v).toFixed(2) + "×"; },
      on: function (v) { speedExp = v; } });
    var loop = S.loop(function (dt) {
      time += Math.exp(speedExp) * dt * 1000;
      emit(time);
      harvest();
      sync();
    });
    S.playPause(loop);
    S.button({ labelKey: "pp.reset", on: function () {
      loop.pause(); modeCtl.set("circular"); colCtl.set(true); speedCtl.set(0); reset();
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "pp.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outEmit = S.readout({ labelKey: "pp.rEmit" });
    var outArr = S.readout({ labelKey: "pp.rArrive" });
    var outPhase = S.readout({ labelKey: "pp.rPhase" });
    var outVel = S.readout({ labelKey: "pp.rVel" });

    function sync() {
      var u = losAt(time).u;
      outEmit(PULSE_PERIOD.toFixed(0) + " " + I18N.t("pp.units"));
      outArr(lastDelta === null ? "—" : lastDelta.toFixed(1) + " " + I18N.t("pp.units"));
      outPhase(circular ? (((time / ORBIT_PERIOD) % 1) * 360).toFixed(0) + "°" : "—");
      outVel(!circular ? I18N.t("pp.across")
        : Math.abs(u) < 0.05 ? I18N.t("pp.across")
        : u > 0 ? I18N.t("pp.toward") : I18N.t("pp.away"));
      S.requestDraw();
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#08090f"; ctx.fillRect(0, 0, S.W, S.H);

      /* the orbit, tinted by what the Doppler shift would be at each point */
      if (circular) {
        for (var k = 0; k < 180; k++) {
          var a0 = TAU * k / 180, a1 = TAU * (k + 1) / 180;
          var mid = (a0 + a1) / 2;
          var px = ORBIT_X + ORBIT_R * Math.cos(mid), py = ORBIT_Y + ORBIT_R * Math.sin(mid);
          var dx = EARTH.x - px, dy = EARTH.y - py, dd = Math.hypot(dx, dy);
          var u = (-Math.sin(mid) * dx + Math.cos(mid) * dy) / dd;
          ctx.beginPath();
          ctx.arc(ORBIT_X, ORBIT_Y, ORBIT_R, a0, a1);
          ctx.strokeStyle = colour ? doppler(u) : "#9a9a9a";
          ctx.lineWidth = 3; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(ORBIT_X, ORBIT_Y, 2.5, 0, TAU);
        ctx.fillStyle = "#6a6a6a"; ctx.fill();
      }

      /* the pulses, each a short wavefront running along its own sight line */
      pulses.forEach(function (p) {
        if (p.arrived || p.t0 > time) return;
        var f = time - p.t0;
        var x = p.x0 + p.mx * f, y = p.y0 + p.my * f;
        var ang = Math.atan2(p.my, p.mx);
        var nx = 4 * Math.cos(ang + Math.PI / 2), ny = 4 * Math.sin(ang + Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(x + nx, y + ny); ctx.lineTo(x - nx, y - ny);
        ctx.strokeStyle = colour ? p.colour : "#cccccc";
        ctx.lineWidth = 2; ctx.stroke();
      });

      var pp = pulsarAt(time);
      ctx.beginPath(); ctx.arc(pp.x, pp.y, 8, 0, TAU);
      ctx.fillStyle = "#e8eefc"; ctx.fill();
      ctx.beginPath(); ctx.arc(pp.x, pp.y, 14, 0, TAU);
      ctx.strokeStyle = "rgba(190,210,255,0.45)"; ctx.lineWidth = 1.5; ctx.stroke();

      ctx.beginPath(); ctx.arc(EARTH.x, EARTH.y, 9, 0, TAU);
      var g = ctx.createRadialGradient(EARTH.x - 3, EARTH.y - 3, 1, EARTH.x, EARTH.y, 10);
      g.addColorStop(0, "#9fd0f5"); g.addColorStop(1, "#22558c");
      ctx.fillStyle = g; ctx.fill();
      ctx.fillStyle = "#c9d6ea"; ctx.font = "11px " + FONT;
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText(tr("pp.earth"), EARTH.x - 14, EARTH.y);

      plot(ctx, tr);
    });

    function plot(ctx, tr) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(PLOT.x, PLOT.y, PLOT.w, PLOT.h);
      ctx.strokeStyle = "#d0d0d0"; ctx.lineWidth = 1;
      ctx.strokeRect(PLOT.x + 0.5, PLOT.y + 0.5, PLOT.w - 1, PLOT.h - 1);
      ctx.fillStyle = "#cfd8ea"; ctx.font = "12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(tr("pp.plot"), PLOT.x, PLOT.y - 8);

      /* the emitted period, for comparison with what actually arrives */
      var yFlat = yOf(PULSE_PERIOD);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#b8c2d0"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PLOT.x, yFlat); ctx.lineTo(PLOT.x + PLOT.w, yFlat);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#8a93a3"; ctx.font = "10px " + MONO;
      ctx.textAlign = "left";
      ctx.fillText(String(PULSE_PERIOD), PLOT.x + 4, yFlat - 4);

      ctx.save();
      ctx.beginPath(); ctx.rect(PLOT.x, PLOT.y, PLOT.w, PLOT.h); ctx.clip();
      var t0 = Math.max(0, time - PLOT.span);
      arrivals.forEach(function (a) {
        var x = PLOT.x + (a.t - t0) / PLOT.span * PLOT.w;
        var y = yOf(a.d);
        ctx.beginPath();
        ctx.moveTo(x, PLOT.y + PLOT.h); ctx.lineTo(x, y);
        ctx.strokeStyle = colour ? a.colour : "#808080";
        ctx.lineWidth = 1.5; ctx.stroke();
      });
      ctx.restore();

      ctx.fillStyle = "#8a93a3"; ctx.font = "10px " + FONT;
      ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText(MAX_DELTA.toFixed(0), PLOT.x - 4, PLOT.y);
      ctx.textBaseline = "bottom";
      ctx.fillText(MIN_DELTA.toFixed(0), PLOT.x - 4, PLOT.y + PLOT.h);
    }
    function yOf(d) {
      var f = (d - MIN_DELTA) / (MAX_DELTA - MIN_DELTA);
      return PLOT.y + PLOT.h * (1 - Math.max(0, Math.min(1, f)));
    }

    reset();
  }
});
