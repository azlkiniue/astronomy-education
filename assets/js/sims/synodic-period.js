/* Synodic Period Calculator --------------------------------------------------
   Faithful rebuild of the ClassAction "Synodic Period Calculator"
   (synodiccalculator.swf), expanded with an orbit animation:
     • the calculator itself — superior vs inferior planet, years vs days, and the
       relation 1/S = 1/E − 1/P (superior) or 1/S = 1/P − 1/E (inferior),
     • a top-down orbit view of the Sun, Earth and the chosen planet revolving at
       their true relative rates, with the Sun–Earth–planet alignment drawn and the
       synodic cycle counted — the synodic period is the time between repeats.
   E = 1 sidereal year; a = P^(2/3) AU (Kepler III).                                */
Sim.create({
  id: "synodic-period",
  width: 760, height: 460,
  strings: {
    en: {
      "sy.kind": "Planet type", "sy.superior": "Superior (outside Earth)", "sy.inferior": "Inferior (inside Earth)",
      "sy.preset": "Preset planet", "sy.none": "— custom —",
      "sy.period": "Period", "sy.sid": "sidereal period P", "sy.units": "Display units", "sy.yr": "years", "sy.day": "days",
      "sy.anim": "Animation", "sy.start": "start", "sy.pause": "pause", "sy.speed": "speed", "sy.reset": "reset",
      "sy.oSid": "sidereal period (P)", "sy.oSyn": "synodic period (S)", "sy.oEarthLaps": "Earth–planet laps", "sy.oElapsed": "elapsed time",
      "sy.calc": "Synodic Period Calculator", "sy.orbitTitle": "heliocentric view (not to scale)",
      "sy.aligned": "aligned!", "sy.earth": "Earth", "sy.sun": "Sun",
      "sy.superiorNote": "Earth laps the planet once per synodic period.",
      "sy.inferiorNote": "the planet laps Earth once per synodic period."
    },
    id: {
      "sy.kind": "Jenis planet", "sy.superior": "Superior (luar Bumi)", "sy.inferior": "Inferior (dalam Bumi)",
      "sy.preset": "Planet praset", "sy.none": "— ubahan —",
      "sy.period": "Periode", "sy.sid": "periode sideris P", "sy.units": "Satuan tampilan", "sy.yr": "tahun", "sy.day": "hari",
      "sy.anim": "Animasi", "sy.start": "mulai", "sy.pause": "jeda", "sy.speed": "kecepatan", "sy.reset": "atur ulang",
      "sy.oSid": "periode sideris (P)", "sy.oSyn": "periode sinodis (S)", "sy.oEarthLaps": "putaran Bumi–planet", "sy.oElapsed": "waktu berlalu",
      "sy.calc": "Kalkulator Periode Sinodis", "sy.orbitTitle": "pandangan heliosentris (tak berskala)",
      "sy.aligned": "sejajar!", "sy.earth": "Bumi", "sy.sun": "Matahari",
      "sy.superiorNote": "Bumi menyalip planet sekali tiap periode sinodis.",
      "sy.inferiorNote": "planet menyalip Bumi sekali tiap periode sinodis."
    }
  },
  about: {
    en: "<p>A planet's <strong>sidereal period</strong> is one full orbit against the stars. But from moving Earth we see its <strong>synodic period</strong> — the time to return to the same configuration (say, opposition to opposition). Because both worlds move, the two periods differ.</p>" +
        "<p>It's a lap-counting problem: <em>1/S = 1/E − 1/P</em> for an outer (superior) planet that Earth overtakes, and <em>1/S = 1/P − 1/E</em> for an inner (inferior) planet that overtakes Earth. Here E = 1 year.</p>" +
        "<p>Run the animation and watch the Sun–Earth–planet line come back into alignment: that interval is S. Mars takes 1.88 yr to orbit but 2.13 yr between oppositions; Jupiter, barely crawling, repeats almost every Earth year.</p>",
    id: "<p><strong>Periode sideris</strong> planet adalah satu orbit penuh terhadap bintang. Namun dari Bumi yang bergerak kita melihat <strong>periode sinodis</strong> — waktu untuk kembali ke konfigurasi sama (misalnya oposisi ke oposisi). Karena kedua dunia bergerak, kedua periode berbeda.</p>" +
        "<p>Ini soal menghitung putaran: <em>1/S = 1/E − 1/P</em> untuk planet luar (superior) yang disalip Bumi, dan <em>1/S = 1/P − 1/E</em> untuk planet dalam (inferior) yang menyalip Bumi. Di sini E = 1 tahun.</p>" +
        "<p>Jalankan animasi dan amati garis Matahari–Bumi–planet kembali sejajar: selang itulah S. Mars butuh 1,88 thn mengorbit tetapi 2,13 thn antar oposisi; Jupiter yang nyaris merangkak berulang hampir tiap tahun Bumi.</p>"
  },
  build: function (S) {
    var E = 1.0;                                             // Earth sidereal period (years)
    var P = { kind: "superior", per: 1.881 };               // default: Mars
    var t = 0, speed = 0.6, laps = 0, alignFlash = 0;
    var lock = false;                                       // guard: echoing a value to another control must not re-fire its handler
    var PRESETS = {
      "Mercury": { kind: "inferior", per: 0.2408 }, "Venus": { kind: "inferior", per: 0.6152 },
      "Mars": { kind: "superior", per: 1.881 }, "Jupiter": { kind: "superior", per: 11.862 },
      "Saturn": { kind: "superior", per: 29.457 }, "Uranus": { kind: "superior", per: 84.02 },
      "Neptune": { kind: "superior", per: 164.8 }
    };

    function synodic() { return 1 / Math.abs(1 / E - 1 / P.per); }   // years
    function isSup() { return P.per > E; }

    /* ---- controls ---- */
    S.group("sy.kind");
    var kindSel = S.select({ labelKey: "sy.kind", value: P.kind,
      options: [{ v: "superior", labelKey: "sy.superior" }, { v: "inferior", labelKey: "sy.inferior" }],
      on: function (v) { if (lock) return; lock = true; P.kind = v; if (v === "superior" && P.per <= E) P.per = 1.881; if (v === "inferior" && P.per >= E) P.per = 0.615; perC.set(P.per); presetSel.set(""); lock = false; resetAnim(); } });

    var presetSel = S.select({ labelKey: "sy.preset", value: "Mars",
      options: [{ v: "", labelKey: "sy.none" }].concat(Object.keys(PRESETS).map(function (n) { return { v: n, label: n }; })),
      on: function (v) { if (lock || !PRESETS[v]) return; lock = true; P.kind = PRESETS[v].kind; P.per = PRESETS[v].per; kindSel.set(P.kind); perC.set(P.per); lock = false; resetAnim(); } });

    S.group("sy.period");
    var perC = S.slider({ labelKey: "sy.sid", min: 0.2, max: 200, step: 0.001, value: P.per,
      format: function (v) { return fmtT(v); }, on: function (v) { if (lock) return; lock = true; P.per = v; P.kind = isSup() ? "superior" : "inferior"; kindSel.set(P.kind); presetSel.set(""); lock = false; upd(); } });
    var unitSel = S.select({ labelKey: "sy.units", value: "yr",
      options: [{ v: "yr", labelKey: "sy.yr" }, { v: "day", labelKey: "sy.day" }], on: function () { upd(); } });

    S.group("sy.anim");
    var loop = S.loop(function (dt) {
      var prevRel = relAngle(t); t += speed * dt;
      var rel = relAngle(t);
      if (Math.floor(rel / (2 * Math.PI)) > Math.floor(prevRel / (2 * Math.PI))) { laps++; alignFlash = 1; }
      if (alignFlash > 0) alignFlash = Math.max(0, alignFlash - dt * 1.5);
      upd();
    });
    var playBtn = S.button({ labelKey: "sy.start", primary: true, on: function () { loop.toggle(); syncPlay(); } });
    function syncPlay() { var key = loop.playing ? "sy.pause" : "sy.start"; playBtn.setAttribute("data-i18n", key); playBtn.textContent = I18N.t(key); }
    S.refreshers.push(syncPlay);
    S.button({ labelKey: "sy.reset", on: function () { resetAnim(); } });
    S.slider({ labelKey: "sy.speed", min: 0.1, max: 3, step: 0.1, value: speed, format: function (v) { return v.toFixed(1) + " yr/s"; }, on: function (v) { speed = v; } });

    var oSid = S.readout({ labelKey: "sy.oSid" });
    var oSyn = S.readout({ labelKey: "sy.oSyn" });
    var oLaps = S.readout({ labelKey: "sy.oEarthLaps" });
    var oElapsed = S.readout({ labelKey: "sy.oElapsed" });

    function relAngle(tt) { return Math.abs((2 * Math.PI / E - 2 * Math.PI / P.per) * tt); }   // Earth−planet relative angle
    function resetAnim() { t = 0; laps = 0; alignFlash = 0; upd(); }
    function upd() {
      oSid(fmtT(P.per));
      oSyn(fmtT(synodic()));
      oLaps(String(laps));
      oElapsed(fmtT(t));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ===================================================================== */
    var ORB = { x: 12, y: 28, w: 446, h: 424 };
    var CAL = { x: 470, y: 28, w: 278, h: 424 };
    S.onDraw(function () { var ctx = S.ctx; S.clear(); drawOrbit(ctx); drawCalc(ctx); });

    function drawOrbit(ctx) {
      panel(ctx, ORB, I18N.t("sy.orbitTitle"));
      var cx = ORB.x + ORB.w / 2, cy = ORB.y + ORB.h / 2 + 6;
      var aP = Math.pow(P.per, 2 / 3);                       // planet semimajor axis (AU)
      var aMax = Math.max(aP, E);
      var rOf = function (a) { return 40 + (Math.sqrt(a) - 0) * (ORB.w * 0.40 - 40) / Math.sqrt(aMax); }; // sqrt scale
      var rE = rOf(E), rP = rOf(aP);
      // orbits
      ctx.strokeStyle = "rgba(120,160,235,0.5)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, rE, 0, 2 * Math.PI); ctx.stroke();
      ctx.strokeStyle = "rgba(220,150,90,0.5)"; ctx.beginPath(); ctx.arc(cx, cy, rP, 0, 2 * Math.PI); ctx.stroke();
      // Sun
      var sg = ctx.createRadialGradient(cx, cy, 1, cx, cy, 12); sg.addColorStop(0, "#fff6cf"); sg.addColorStop(1, "#ffb338");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 2 * Math.PI); ctx.fill();
      // angles (start aligned to the right)
      var thE = (2 * Math.PI / E) * t, thP = (2 * Math.PI / P.per) * t;
      var ex = cx + rE * Math.cos(thE), ey = cy - rE * Math.sin(thE);
      var pxp = cx + rP * Math.cos(thP), pyp = cy - rP * Math.sin(thP);
      // alignment sight line (Sun → Earth, extended) flashes green at conjunction
      ctx.strokeStyle = alignFlash > 0 ? "rgba(105,219,124," + (0.4 + 0.6 * alignFlash) + ")" : "rgba(160,170,200,0.35)";
      ctx.lineWidth = alignFlash > 0 ? 2.5 : 1; ctx.setLineDash(alignFlash > 0 ? [] : [3, 4]);
      var far = Math.max(rE, rP) + 16;
      ctx.beginPath(); ctx.moveTo(cx - far * Math.cos(thE), cy + far * Math.sin(thE)); ctx.lineTo(cx + far * Math.cos(thE), cy - far * Math.sin(thE)); ctx.stroke(); ctx.setLineDash([]);
      // Earth + planet
      ctx.fillStyle = "#6ea8fe"; ctx.beginPath(); ctx.arc(ex, ey, 6, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#0b1020"; ctx.font = "700 9px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("E", ex, ey); ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#e8a060"; ctx.beginPath(); ctx.arc(pxp, pyp, 7, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#0b1020"; ctx.font = "700 9px system-ui"; ctx.textBaseline = "middle"; ctx.fillText("P", pxp, pyp); ctx.textBaseline = "alphabetic";
      // alignment banner
      if (alignFlash > 0.5) { ctx.fillStyle = "rgba(105,219,124," + alignFlash + ")"; ctx.font = "700 14px system-ui"; ctx.textAlign = "center"; ctx.fillText(I18N.t("sy.aligned"), cx, ORB.y + 36); }
      // legend
      ctx.font = "10px system-ui"; ctx.textAlign = "left";
      ctx.fillStyle = "#6ea8fe"; ctx.fillText("● " + I18N.t("sy.earth") + " (E = 1 yr)", ORB.x + 14, ORB.y + ORB.h - 30);
      ctx.fillStyle = "#e8a060"; ctx.fillText("● " + (presetSel.value() || "planet") + " (P = " + fmtT(P.per) + ")", ORB.x + 14, ORB.y + ORB.h - 14);
    }

    function drawCalc(ctx) {
      panel(ctx, CAL, I18N.t("sy.calc"));
      var cx = CAL.x + CAL.w / 2;
      ctx.textAlign = "center";
      ctx.fillStyle = "#cbd6f0"; ctx.font = "700 13px system-ui";
      ctx.fillText(isSup() ? I18N.t("sy.superior") : I18N.t("sy.inferior"), cx, CAL.y + 50);

      // the relation 1/S = 1/E ∓ 1/P
      var y = CAL.y + 110;
      ctx.font = "700 22px ui-monospace, monospace"; ctx.fillStyle = "#ffd166";
      var a = isSup() ? "1/E" : "1/P", b = isSup() ? "1/P" : "1/E";
      ctx.fillText("1/S  =  " + a + "  −  " + b, cx, y);
      // plug in numbers
      ctx.font = "16px ui-monospace, monospace"; ctx.fillStyle = "#9fdcff";
      var Eterm = "1/" + E.toFixed(2), Pterm = "1/" + P.per.toFixed(3);
      var lhs = isSup() ? Eterm : Pterm, rhs = isSup() ? Pterm : Eterm;
      ctx.fillText("1/S  =  " + lhs + "  −  " + rhs, cx, y + 36);
      ctx.fillText("1/S  =  " + (1 / synodic()).toFixed(4) + " /yr", cx, y + 64);

      // big result
      ctx.fillStyle = "#69db7c"; ctx.font = "700 26px system-ui";
      ctx.fillText("S = " + fmtT(synodic()), cx, y + 112);

      // note
      ctx.fillStyle = "#9fabce"; ctx.font = "12px system-ui";
      wrap(ctx, isSup() ? I18N.t("sy.superiorNote") : I18N.t("sy.inferiorNote"), CAL.x + 20, y + 150, CAL.w - 40, 17, true);

      // progress through current synodic cycle
      var frac = (relAngle(t) % (2 * Math.PI)) / (2 * Math.PI);
      var bx = CAL.x + 20, bw = CAL.w - 40, byy = CAL.y + CAL.h - 30;
      ctx.fillStyle = "#1c2747"; roundRect(ctx, bx, byy, bw, 12, 6); ctx.fill();
      ctx.fillStyle = "#69db7c"; roundRect(ctx, bx, byy, bw * frac, 12, 6); ctx.fill();
      ctx.fillStyle = "#5b6a86"; ctx.font = "9px system-ui"; ctx.textAlign = "left"; ctx.fillText("current synodic cycle", bx, byy - 5);
    }

    upd();

    /* ---- helpers ---- */
    function fmtT(yr) {
      if (unitSel && unitSel.value() === "day") { var d = yr * 365.25; return d < 1000 ? d.toFixed(1) + " d" : d.toFixed(0) + " d"; }
      return yr < 100 ? yr.toFixed(yr < 10 ? 3 : 2) + " yr" : yr.toFixed(1) + " yr";
    }
    function wrap(ctx, text, x, y, maxw, lh, center) { var words = text.split(" "), line = "", yy = y; ctx.textAlign = center ? "center" : "left"; var ax = center ? x + maxw / 2 : x; for (var i = 0; i < words.length; i++) { var test = line + words[i] + " "; if (ctx.measureText(test).width > maxw && line) { ctx.fillText(line, ax, yy); line = words[i] + " "; yy += lh; } else line = test; } ctx.fillText(line, ax, yy); }
    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title.toUpperCase(), r.x + 14, r.y + 18);
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
