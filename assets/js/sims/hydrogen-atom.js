/* Hydrogen Atom Simulator -----------------------------------------------------
   Faithful rebuild of the NAAP "Hydrogen Atom Simulator" (hydrogen_atom.swf):
     • a Bohr Atom Diagram (proton + electron on quantised orbits) into which
       photons stream from the right,
     • an Energy Level Diagram (E_n = −13.6/n² eV) with the electron's level,
     • Photon Selection — a photon energy slider with linked wavelength/frequency
       and the named spectral-line presets (Lyman / Balmer / Paschen),
     • a fire-photon action that absorbs (excites), ionises, or passes through,
       followed by spontaneous decay, and an Event Log.                          */
Sim.create({
  id: "hydrogen-atom",
  width: 760, height: 540,
  strings: {
    en: {
      "ha.photon": "Photon Selection", "ha.energy": "photon energy", "ha.fire": "fire photon", "ha.clear": "clear log",
      "ha.presets": "preset photons (spectral lines)", "ha.wavelength": "wavelength", "ha.frequency": "frequency",
      "ha.level": "current level", "ha.log": "Event Log", "ha.eld": "Energy Level Diagram", "ha.diag": "Atom Diagram",
      "ha.evExcite": "absorbed — excitation to level", "ha.evNo": "photon not absorbed (passes through)",
      "ha.evIon": "ionization — electron freed", "ha.evEmit": "emission", "ha.evRecomb": "recombination to ground",
      "ha.lyman": "Lyman → n=1", "ha.balmer": "Balmer → n=2", "ha.paschen": "Paschen → n=3"
    },
    id: {
      "ha.photon": "Pemilihan Foton", "ha.energy": "energi foton", "ha.fire": "tembakkan foton", "ha.clear": "bersihkan log",
      "ha.presets": "foton preset (garis spektrum)", "ha.wavelength": "panjang gelombang", "ha.frequency": "frekuensi",
      "ha.level": "tingkat saat ini", "ha.log": "Log Peristiwa", "ha.eld": "Diagram Tingkat Energi", "ha.diag": "Diagram Atom",
      "ha.evExcite": "diserap — eksitasi ke tingkat", "ha.evNo": "foton tidak diserap (lewat)",
      "ha.evIon": "ionisasi — elektron terlepas", "ha.evEmit": "emisi", "ha.evRecomb": "rekombinasi ke dasar",
      "ha.lyman": "Lyman → n=1", "ha.balmer": "Balmer → n=2", "ha.paschen": "Paschen → n=3"
    }
  },
  about: {
    en: "<p>A hydrogen atom can only hold its electron at certain <strong>energy levels</strong>, E<sub>n</sub> = −13.6 eV / n². " +
        "It absorbs a photon <em>only</em> if the photon's energy exactly matches the gap up to an allowed level.</p>" +
        "<p>Pick a photon — by energy, or with a named spectral-line button — and fire it. Watch three outcomes:</p>" +
        "<ul><li><strong>Absorption</strong>: an exact match lifts the electron to a higher level.</li>" +
        "<li><strong>No absorption</strong>: a near-miss passes straight through.</li>" +
        "<li><strong>Ionization</strong>: enough energy frees the electron entirely.</li></ul>" +
        "<p>After absorbing, the electron spontaneously cascades back down, emitting photons — the same lines, in reverse. The Lyman series ends on n=1 (ultraviolet), Balmer on n=2 (visible), Paschen on n=3 (infrared).</p>",
    id: "<p>Atom hidrogen hanya dapat menahan elektronnya pada <strong>tingkat energi</strong> tertentu, E<sub>n</sub> = −13,6 eV / n². " +
        "Ia menyerap foton <em>hanya</em> jika energi foton tepat sama dengan selisih menuju tingkat yang diizinkan.</p>" +
        "<p>Pilih foton — lewat energi, atau tombol garis spektrum — lalu tembakkan. Amati tiga hasil:</p>" +
        "<ul><li><strong>Penyerapan</strong>: kecocokan tepat menaikkan elektron.</li>" +
        "<li><strong>Tidak diserap</strong>: nyaris cocok akan lewat begitu saja.</li>" +
        "<li><strong>Ionisasi</strong>: energi cukup melepaskan elektron.</li></ul>" +
        "<p>Setelah menyerap, elektron meluruh kembali, memancarkan foton — garis yang sama, terbalik. Deret Lyman berakhir di n=1 (UV), Balmer di n=2 (tampak), Paschen di n=3 (inframerah).</p>"
  },
  build: function (S) {
    var NMAX = 6;
    function En(n) { return -13.6 / (n * n); }
    function dE(n, m) { return En(m) - En(n); }            // >0 for m>n
    function evToNm(E) { return 1239.84 / E; }
    function evToHz(E) { return E * 2.41799e14; }

    var curN = 1;                 // electron level (0 = ionised/free)
    var photonE = 10.2;           // selected photon energy (eV)
    var log = [];
    var anim = null;              // S.loop
    var flight = null;            // incoming photon {x, color}
    var emits = [];               // outgoing emitted photons
    var elecAng = 0, elecR = 0, targetN = 1, decayTimer = 0, decayQueue = [];

    /* ---- controls ---- */
    S.group("ha.photon");
    var eCtl = S.slider({ labelKey: "ha.energy", min: 0.5, max: 14, step: 0.01, value: photonE, unit: " eV",
      format: function (v) { return v.toFixed(2) + " eV"; }, on: function (v) { photonE = v; upd(); } });
    var outWl = S.readout({ labelKey: "ha.wavelength" });
    var outHz = S.readout({ labelKey: "ha.frequency" });

    var PRESETS = [
      ["Lα", 1, 2], ["Lβ", 1, 3], ["Lγ", 1, 4], ["Lδ", 1, 5], ["Lε", 1, 6],
      ["Hα", 2, 3], ["Hβ", 2, 4], ["Hγ", 2, 5], ["Hδ", 2, 6],
      ["Pα", 3, 4], ["Pβ", 3, 5], ["Pγ", 3, 6]
    ];
    S.group("ha.presets");
    PRESETS.forEach(function (p) { S.button({ label: p[0], on: function () { eCtl.set(+dE(p[1], p[2]).toFixed(2)); } }); });

    var fireBtn = S.button({ labelKey: "ha.fire", primary: true, on: fire });
    S.button({ labelKey: "ha.clear", on: function () { log = []; S.requestDraw(); } });

    var outLevel = S.readout({ labelKey: "ha.level" });

    function upd() {
      outWl(Math.round(evToNm(photonE)) + " nm");
      outHz((evToHz(photonE) / 1e15).toFixed(2) + "×10¹⁵ Hz");
      outLevel(curN === 0 ? "—" : "n = " + curN);
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- animation engine ---- */
    anim = S.loop(function (dt) { tick(dt); });
    function run() { if (!anim.playing) anim.play(); }
    function idle() { return !flight && emits.length === 0 && decayQueue.length === 0 && Math.abs(elecR - orbitR(targetN)) < 0.5; }

    function fire() {
      if (flight || decayQueue.length) return;            // one at a time
      flight = { x: 470, color: photonColor(photonE) };
      run();
    }
    function logEvent(s) { log.push(s); if (log.length > 40) log.shift(); }

    function resolve() {                                    // photon reaches the atom
      var E = photonE;
      // exact absorption to some higher level?
      var best = -1, bestErr = 0.06;
      for (var m = curN + 1; m <= NMAX; m++) { var err = Math.abs(E - dE(curN, m)); if (err < bestErr) { bestErr = err; best = m; } }
      if (curN >= 1 && best > 0) {
        targetN = best; logEvent("E=" + E.toFixed(2) + " eV · " + I18N.t("ha.evExcite") + " " + best);
        scheduleDecay();
      } else if (curN >= 1 && E >= -En(curN) - 0.02) {       // ionisation
        targetN = 0; logEvent("E=" + E.toFixed(2) + " eV · " + I18N.t("ha.evIon"));
        decayQueue = [{ wait: 1.1, to: 1, recomb: true }];   // recombine to ground after a moment
      } else {
        logEvent("E=" + E.toFixed(2) + " eV · " + I18N.t("ha.evNo"));
      }
      upd();
    }

    function scheduleDecay() {                              // cascade from targetN back toward n=1
      decayQueue = []; var n = targetN, wait = 0.9;
      while (n > 1) { var to = 1 + Math.floor(Math.random() * (n - 1)); decayQueue.push({ wait: wait, to: to, from: n }); n = to; wait = 0.9; }
    }

    function tick(dt) {
      elecAng += dt * 1.8;
      // incoming photon flies left to the atom
      if (flight) {
        flight.x -= dt * 560;
        if (flight.x <= ATOM.x + 6) { flight = null; resolve(); }
      }
      // electron orbit tween
      var tr = orbitR(targetN); elecR += (tr - elecR) * Math.min(1, dt * 6);
      if (targetN >= 1 && Math.abs(elecR - tr) < 1) { if (curN !== targetN) { curN = targetN; upd(); } }
      // decay cascade timers
      if (decayQueue.length) {
        decayTimer += dt;
        if (decayTimer >= decayQueue[0].wait) {
          decayTimer = 0; var step = decayQueue.shift();
          if (step.recomb) { targetN = 1; curN = 1; logEvent(I18N.t("ha.evRecomb")); upd(); }
          else {
            var Eemit = dE(step.to, step.from); targetN = step.to;
            emits.push({ x: ATOM.x, y: ATOM.y, vx: 380, vy: -120, color: photonColor(Eemit), life: 1 });
            logEvent(I18N.t("ha.evEmit") + ": n" + step.from + "→n" + step.to + " (" + Eemit.toFixed(2) + " eV)"); upd();
          }
        }
      }
      // outgoing emitted photons
      for (var i = emits.length - 1; i >= 0; i--) { var e = emits[i]; e.x += e.vx * dt; e.y += e.vy * dt; e.life -= dt * 0.7; if (e.life <= 0 || e.x > 470) emits.splice(i, 1); }
      if (idle()) anim.pause();
    }

    /* ---- geometry ---- */
    var ATOM = { x: 150, y: 215 };
    var ELD = { x: 486, y: 30, w: 262, h: 360 };
    var LOG = { x: 12, y: 404, w: 736, h: 126 };
    function orbitR(n) { return n === 0 ? 175 : 22 + (n - 1) * 26; }
    elecR = orbitR(curN);

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      drawAtom(ctx);
      drawELD(ctx);
      drawLog(ctx);
    });
    upd();

    function panel(ctx, r, key) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      if (key) { ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(I18N.t(key).toUpperCase(), r.x + 14, r.y + 20); }
    }

    function drawAtom(ctx) {
      var r = { x: 12, y: 30, w: 466, h: 360 };
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#05070f"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.stroke();
      ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(I18N.t("ha.diag").toUpperCase(), r.x + 14, r.y + 20);
      ctx.save(); roundRect(ctx, r.x + 1, r.y + 1, r.w - 2, r.h - 2, 11); ctx.clip();

      // orbits
      for (var n = 1; n <= NMAX; n++) {
        ctx.strokeStyle = n === curN ? "rgba(110,168,254,0.6)" : "rgba(120,140,200,0.22)";
        ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ATOM.x, ATOM.y, orbitR(n), 0, 2 * Math.PI); ctx.stroke();
      }
      // proton
      var pg = ctx.createRadialGradient(ATOM.x, ATOM.y, 1, ATOM.x, ATOM.y, 11);
      pg.addColorStop(0, "#ff8a7a"); pg.addColorStop(1, "#d33b2c");
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(ATOM.x, ATOM.y, 10, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("p", ATOM.x, ATOM.y);
      ctx.textBaseline = "alphabetic";

      // electron (hidden while ionised & far)
      if (!(curN === 0 && targetN === 0)) {
        var ex = ATOM.x + elecR * Math.cos(elecAng), ey = ATOM.y + elecR * Math.sin(elecAng);
        var eg = ctx.createRadialGradient(ex, ey, 1, ex, ey, 8);
        eg.addColorStop(0, "#d8ffe0"); eg.addColorStop(1, "#3fcf6b");
        ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(ex, ey, 6, 0, 2 * Math.PI); ctx.fill();
        ctx.fillStyle = "#06210f"; ctx.font = "bold 9px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("e", ex, ey); ctx.textBaseline = "alphabetic";
      }

      // incoming photon (wave packet)
      if (flight) drawWave(ctx, flight.x, ATOM.y, 18, flight.color, -1);
      // emitted photons
      emits.forEach(function (e) { ctx.globalAlpha = Math.max(0, e.life); drawWave(ctx, e.x, e.y, 14, e.color, 1); ctx.globalAlpha = 1; });
      ctx.restore();
    }

    function drawWave(ctx, x, y, len, col, dir) {
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
      for (var i = -len; i <= len; i += 2) { var yy = y + Math.sin(i * 0.5) * 4; i === -len ? ctx.moveTo(x + i * dir, yy) : ctx.lineTo(x + i * dir, yy); }
      ctx.stroke();
    }

    function drawELD(ctx) {
      panel(ctx, ELD, "ha.eld");
      var top = ELD.y + 40, bot = ELD.y + ELD.h - 24, x0 = ELD.x + 40, x1 = ELD.x + ELD.w - 16;
      function yOf(E) { return bot + (E - (-13.6)) / (0 - (-13.6)) * (top - bot); }   // -13.6→bot, 0→top
      // ionisation (0 eV) line
      ctx.strokeStyle = "#3a4a78"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, yOf(0)); ctx.lineTo(x1, yOf(0)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#9fabce"; ctx.font = "10px system-ui"; ctx.textAlign = "right"; ctx.fillText("0 eV (∞)", x1, yOf(0) - 4);
      // levels
      for (var n = 1; n <= NMAX; n++) {
        var y = yOf(En(n)), on = n === curN;
        ctx.strokeStyle = on ? "#ff6b6b" : "#7f8db5"; ctx.lineWidth = on ? 2.4 : 1.4;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
        ctx.fillStyle = on ? "#ff6b6b" : "#9fabce"; ctx.font = (on ? "bold " : "") + "10px system-ui"; ctx.textAlign = "left";
        ctx.fillText("n=" + n, ELD.x + 12, y + 3);
        if (on || n <= 3) { ctx.textAlign = "right"; ctx.fillText(En(n).toFixed(2) + " eV", x1, y + (n === 1 ? 12 : 11)); }
      }
      // electron marker on current level
      if (curN >= 1) {
        var ye = yOf(En(curN));
        ctx.fillStyle = "#3fcf6b"; ctx.beginPath(); ctx.arc(x0 + 8, ye, 4, 0, 2 * Math.PI); ctx.fill();
      }
    }

    function drawLog(ctx) {
      panel(ctx, LOG, "ha.log");
      ctx.font = "12px var(--mono, monospace)"; ctx.textAlign = "left";
      var lines = log.slice(-5);
      for (var i = 0; i < lines.length; i++) {
        ctx.fillStyle = i === lines.length - 1 ? "#e8ecf8" : "#9fabce";
        ctx.fillText(lines[i], LOG.x + 16, LOG.y + 42 + i * 16);
      }
      if (!log.length) { ctx.fillStyle = "#5b6a92"; ctx.fillText("—", LOG.x + 16, LOG.y + 42); }
    }

    /* photon colour from energy: IR (red) → visible → UV (violet) */
    function photonColor(E) {
      var nm = evToNm(E);
      if (nm > 750) return "#e8794f";          // infrared → warm red
      if (nm < 380) return "#9a6cff";          // ultraviolet → violet
      var c = visibleRGB(nm); return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
    }
    function visibleRGB(nm) {
      var r = 0, g = 0, b = 0;
      if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
      else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
      else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
      else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
      else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
      else { r = 1; }
      return [Math.round(255 * r), Math.round(255 * g), Math.round(255 * b)];
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
