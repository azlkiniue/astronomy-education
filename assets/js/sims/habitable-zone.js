/* Circumstellar Habitable Zone Simulator -------------------------------------
   Faithful rebuild of the NAAP "Circumstellar Habitable Zone Simulator"
   (stellarHabitableZone.swf):
     • a top-down orbital view with the habitable-zone annulus (where liquid water
       can exist), an optional scale grid and the inner solar-system orbits for
       reference, plus your planet on its orbit,
     • Star Properties driven by the star's mass (→ luminosity, temperature,
       radius, spectral type, main-sequence lifetime),
     • a Timeline that ages the star: it slowly brightens on the main sequence,
       then balloons into a red giant — watch the habitable zone race outward and
       engulf the inner planets.
   HZ:  inner = √(L/1.1) AU, outer = √(L/0.53) AU  (flux-based estimate).          */
Sim.create({
  id: "habitable-zone",
  width: 760, height: 540,
  strings: {
    en: {
      "hz.settings": "General Settings", "hz.grid": "show scale grid", "hz.solar": "show solar-system orbits",
      "hz.starset": "Star & Planet", "hz.mass": "star mass", "hz.dist": "planet distance",
      "hz.time": "Timeline", "hz.age": "age since formation", "hz.start": "play", "hz.pause": "pause", "hz.rate": "rate", "hz.reset": "reset to formation",
      "hz.lum": "luminosity", "hz.temp": "temperature", "hz.rad": "radius", "hz.type": "spectral type",
      "hz.life": "main-sequence life", "hz.zone": "habitable zone", "hz.status": "planet",
      "hz.viewTitle": "circumstellar habitable zone", "hz.tlTitle": "stellar luminosity over time", "hz.hr": "H–R Diagram",
      "hz.hzLabel": "Habitable Zone", "hz.now": "now",
      "hz.hot": "too hot — water boils", "hz.cold": "too cold — water freezes", "hz.ok": "habitable — liquid water!",
      "hz.gone": "engulfed by the star", "hz.ms": "main sequence", "hz.giant": "red giant", "hz.dead": "white dwarf"
    },
    id: {
      "hz.settings": "Pengaturan Umum", "hz.grid": "tampilkan grid skala", "hz.solar": "tampilkan orbit tata surya",
      "hz.starset": "Bintang & Planet", "hz.mass": "massa bintang", "hz.dist": "jarak planet",
      "hz.time": "Garis Waktu", "hz.age": "usia sejak pembentukan", "hz.start": "mainkan", "hz.pause": "jeda", "hz.rate": "laju", "hz.reset": "kembali ke pembentukan",
      "hz.lum": "luminositas", "hz.temp": "suhu", "hz.rad": "radius", "hz.type": "tipe spektral",
      "hz.life": "umur deret utama", "hz.zone": "zona laik huni", "hz.status": "planet",
      "hz.viewTitle": "zona laik huni sekeliling bintang", "hz.tlTitle": "luminositas bintang terhadap waktu", "hz.hr": "Diagram H–R",
      "hz.hzLabel": "Zona Laik Huni", "hz.now": "kini",
      "hz.hot": "terlalu panas — air mendidih", "hz.cold": "terlalu dingin — air membeku", "hz.ok": "laik huni — air cair!",
      "hz.gone": "ditelan bintang", "hz.ms": "deret utama", "hz.giant": "raksasa merah", "hz.dead": "katai putih"
    }
  },
  about: {
    en: "<p>The <strong>habitable zone</strong> is the ring of orbits around a star where a rocky planet could hold <strong>liquid water</strong> — not so close that oceans boil away, not so far that they freeze solid. A bright star pushes the zone outward; a dim red dwarf hugs it close in.</p>" +
        "<p>Set the star's <strong>mass</strong> — it fixes the luminosity (L ≈ M³·⁵), temperature and lifetime — then place your planet and see whether it lands in the zone.</p>" +
        "<p>Now run the <strong>timeline</strong>. The star slowly brightens as it ages (the faint-young-Sun effect), then swells into a <strong>red giant</strong>: the habitable zone sweeps outward past the gas giants while the inner planets are scorched or swallowed. Habitability is a moving target.</p>",
    id: "<p><strong>Zona laik huni</strong> adalah cincin orbit di sekitar bintang tempat planet batuan dapat menahan <strong>air cair</strong> — tidak terlalu dekat hingga lautan mendidih, tidak terlalu jauh hingga membeku. Bintang terang mendorong zona keluar; katai merah redup memeluknya rapat.</p>" +
        "<p>Atur <strong>massa</strong> bintang — itu menetapkan luminositas (L ≈ M³·⁵), suhu, dan umurnya — lalu tempatkan planet Anda dan lihat apakah ia masuk zona.</p>" +
        "<p>Sekarang jalankan <strong>garis waktu</strong>. Bintang perlahan menerang seiring usia, lalu mengembang menjadi <strong>raksasa merah</strong>: zona laik huni menyapu keluar melewati planet raksasa sementara planet dalam hangus atau ditelan. Kelaikhunian adalah sasaran yang bergerak.</p>"
  },
  build: function (S) {
    var RSUN_AU = 0.0046524;
    var P = { M: 1.0, dist: 1.0, t: 0 };                 // t = age in Gyr
    var rate = 0.5;                                       // Gyr per second
    var SOLAR = [{ n: "Mercury", a: 0.39 }, { n: "Venus", a: 0.72 }, { n: "Earth", a: 1.0 }, { n: "Mars", a: 1.52 }];

    /* ---- stellar evolution model (approximate but pedagogically sound) ---- */
    function tms(M) { return 10 * Math.pow(M, -2.5); }    // main-sequence lifetime, Gyr
    function giantDur(M) { return 0.12 * tms(M); }        // post-MS giant phase, Gyr
    function totalLife(M) { return tms(M) + giantDur(M); }
    function stateAt(M, t) {
      var tm = tms(M), gd = giantDur(M), Lms0 = Math.pow(M, 3.5);
      if (t <= tm) {
        var f = t / tm;
        var L = Lms0 * (0.735 + 0.58 * f);                // brightens ~ faint-young-Sun → +35%
        var R = Math.pow(M, 0.8) * (0.88 + 0.34 * f);     // ZAMS → slightly swollen across the MS
        return { phase: "ms", L: L, R: R, T: 5772 * Math.pow(L / (R * R), 0.25) };
      } else if (t <= tm + gd) {
        var g = (t - tm) / gd;                            // 0..1 through giant phase
        var Tg = 3300;
        var R = Math.pow(M, 0.8) * 1.3 + 230 * Math.pow(M, 0.5) * (g * g);   // balloons
        var L = R * R * Math.pow(Tg / 5772, 4);
        return { phase: "giant", L: L, R: R, T: Tg };
      }
      return { phase: "dead", L: 0.001 * Math.pow(M, 1), R: 0.013, T: 9000 };  // white dwarf
    }
    function hzInner(L) { return Math.sqrt(L / 1.1); }
    function hzOuter(L) { return Math.sqrt(L / 0.53); }
    function specType(T) { return T >= 30000 ? "O" : T >= 10000 ? "B" : T >= 7500 ? "A" : T >= 6000 ? "F" : T >= 5200 ? "G" : T >= 3700 ? "K" : "M"; }

    function cur() { return stateAt(P.M, P.t); }

    /* ---- controls ---- */
    S.group("hz.settings");
    var optGrid = S.toggle({ labelKey: "hz.grid", value: false });
    var optSolar = S.toggle({ labelKey: "hz.solar", value: true });

    S.group("hz.starset");
    var mC = S.slider({ labelKey: "hz.mass", min: 0.2, max: 3.0, step: 0.01, value: P.M, unit: " M☉",
      on: function (v) { P.M = v; if (P.t > totalLife(v)) { P.t = totalLife(v); tC.set(P.t); } upd(); } });
    var dC = S.slider({ labelKey: "hz.dist", min: 0.05, max: 12, step: 0.01, value: P.dist, format: function (v) { return v.toFixed(2) + " AU"; }, on: function (v) { P.dist = v; upd(); } });

    S.group("hz.time");
    var loop = S.loop(function (dt) { P.t = Math.min(totalLife(P.M), P.t + rate * dt); tC.set(P.t); if (P.t >= totalLife(P.M)) { loop.pause(); syncPlay(); } });
    var playBtn = S.button({ labelKey: "hz.start", primary: true, on: function () { if (P.t >= totalLife(P.M)) { P.t = 0; tC.set(0); } loop.toggle(); syncPlay(); } });
    function syncPlay() { var key = loop.playing ? "hz.pause" : "hz.start"; playBtn.setAttribute("data-i18n", key); playBtn.textContent = I18N.t(key); }
    S.refreshers.push(syncPlay);
    S.button({ labelKey: "hz.reset", on: function () { loop.pause(); syncPlay(); P.t = 0; tC.set(0); upd(); } });
    S.slider({ labelKey: "hz.rate", min: 0.02, max: 3, step: 0.02, value: rate, format: function (v) { return v.toFixed(2) + " Gyr/s"; }, on: function (v) { rate = v; } });
    var tC = S.slider({ labelKey: "hz.age", min: 0, max: 50, step: 0.01, value: P.t, format: function (v) { return v < 1 ? Math.round(v * 1000) + " Myr" : v.toFixed(2) + " Gyr"; }, on: function (v) { P.t = Math.min(totalLife(P.M), v); upd(); } });

    var oType = S.readout({ labelKey: "hz.type" });
    var oLum = S.readout({ labelKey: "hz.lum" });
    var oTemp = S.readout({ labelKey: "hz.temp" });
    var oRad = S.readout({ labelKey: "hz.rad" });
    var oLife = S.readout({ labelKey: "hz.life" });
    var oZone = S.readout({ labelKey: "hz.zone" });
    var oStatus = S.readout({ labelKey: "hz.status" });

    function planetStatus(st) {
      if (P.dist <= st.R * RSUN_AU) return { key: "hz.gone", col: "#ff6b6b" };
      if (P.dist < hzInner(st.L)) return { key: "hz.hot", col: "#ffa94d" };
      if (P.dist > hzOuter(st.L)) return { key: "hz.cold", col: "#74c0fc" };
      return { key: "hz.ok", col: "#69db7c" };
    }
    function upd() {
      var st = cur();
      var ph = st.phase === "ms" ? I18N.t("hz.ms") : st.phase === "giant" ? I18N.t("hz.giant") : I18N.t("hz.dead");
      oType(specType(st.T) + " · " + ph);
      oLum(st.L >= 100 ? Math.round(st.L) + " L☉" : st.L.toFixed(3) + " L☉");
      oTemp(Math.round(st.T) + " K");
      oRad(st.R >= 10 ? Math.round(st.R) + " R☉" : st.R.toFixed(2) + " R☉");
      oLife(tms(P.M).toFixed(2) + " Gyr");
      oZone(hzInner(st.L).toFixed(2) + "–" + hzOuter(st.L).toFixed(2) + " AU");
      oStatus(I18N.t(planetStatus(st).key));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ===================================================================== */
    var VIEW = { x: 12, y: 28, w: 556, h: 332 };
    var HR = { x: 580, y: 28, w: 168, h: 332 };
    var TL = { x: 12, y: 372, w: 736, h: 156 };
    S.onDraw(function () { var ctx = S.ctx; S.clear(); drawView(ctx); drawHR(ctx); drawTimeline(ctx); });

    function niceStep(span) { var raw = span / 5, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }

    function drawView(ctx) {
      panel(ctx, VIEW, I18N.t("hz.viewTitle"));
      ctx.save(); roundRect(ctx, VIEW.x + 1, VIEW.y + 1, VIEW.w - 2, VIEW.h - 2, 11); ctx.clip();
      ctx.fillStyle = "#04060d"; ctx.fillRect(VIEW.x, VIEW.y, VIEW.w, VIEW.h);
      var cx = VIEW.x + VIEW.w / 2, cy = VIEW.y + VIEW.h / 2 + 6;
      var st = cur(), inn = hzInner(st.L), out = hzOuter(st.L);
      var fit = Math.max(out * 1.18, P.dist * 1.12, st.R * RSUN_AU * 1.3, 0.3);
      var sc = Math.min(VIEW.w * 0.46, VIEW.h * 0.44) / fit;     // px per AU

      // scale grid
      if (optGrid.value()) {
        var stp = niceStep(fit), dl = 0.707;            // label along the lower-left diagonal so rings never crowd
        ctx.strokeStyle = "rgba(120,140,190,0.16)"; ctx.fillStyle = "rgba(150,170,210,0.5)"; ctx.font = "9px system-ui"; ctx.textAlign = "right"; ctx.lineWidth = 1;
        for (var rr = stp; rr <= fit; rr += stp) { ctx.beginPath(); ctx.arc(cx, cy, rr * sc, 0, 2 * Math.PI); ctx.stroke(); ctx.fillText(rr.toFixed(rr < 1 ? 2 : (rr < 10 ? 1 : 0)) + " AU", cx - rr * sc * dl - 2, cy + rr * sc * dl + 3); }
      }
      // habitable-zone annulus (blue ring, like the SWF)
      ctx.beginPath(); ctx.arc(cx, cy, out * sc, 0, 2 * Math.PI); ctx.arc(cx, cy, inn * sc, 0, 2 * Math.PI, true);
      ctx.fillStyle = "rgba(96,165,250,0.20)"; ctx.fill("evenodd");
      ctx.strokeStyle = "rgba(125,185,255,0.6)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(cx, cy, inn * sc, 0, 2 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, out * sc, 0, 2 * Math.PI); ctx.stroke();
      ctx.fillStyle = "rgba(160,205,255,0.95)"; ctx.font = "700 10px system-ui"; ctx.textAlign = "center";
      if ((out - inn) * sc > 26) ctx.fillText(I18N.t("hz.hzLabel"), cx, cy - (inn + out) / 2 * sc);

      // solar-system reference orbits
      if (optSolar.value()) {
        ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(140,160,210,0.35)"; ctx.font = "9px system-ui"; ctx.lineWidth = 1; ctx.textAlign = "center";
        SOLAR.forEach(function (pl, idx) { if (pl.a * sc < VIEW.w * 0.5 && pl.a * sc > 4) { ctx.beginPath(); ctx.arc(cx, cy, pl.a * sc, 0, 2 * Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(cx + pl.a * sc, cy, 2.2, 0, 2 * Math.PI); ctx.fillStyle = "rgba(160,180,220,0.85)"; ctx.fill(); ctx.fillStyle = "rgba(160,180,220,0.7)"; ctx.fillText(pl.n, cx + pl.a * sc, cy + (idx % 2 ? 14 : -6)); } });
        ctx.setLineDash([]);
      }
      // star (true scaled size if a giant, else a visible minimum)
      var rgb = tempToRGB(st.T), Rpx = Math.max(7, st.R * RSUN_AU * sc);
      var g = ctx.createRadialGradient(cx, cy, 1, cx, cy, Rpx);
      g.addColorStop(0, "rgb(" + rgb.map(function (v) { return Math.min(255, v + 60); }).map(Math.round).join(",") + ")");
      g.addColorStop(0.75, "rgb(" + rgb.map(Math.round).join(",") + ")");
      g.addColorStop(1, "rgba(" + rgb.map(function (v) { return Math.round(v * 0.4); }).join(",") + ",0.6)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, Rpx, 0, 2 * Math.PI); ctx.fill();

      // planet on its orbit
      var status = planetStatus(st);
      ctx.strokeStyle = "rgba(220,225,240,0.45)"; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.arc(cx, cy, P.dist * sc, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      var ang = -0.6, px = cx + P.dist * sc * Math.cos(ang), py = cy + P.dist * sc * Math.sin(ang);
      if (status.key !== "hz.gone") {
        ctx.fillStyle = status.col; ctx.beginPath(); ctx.arc(px, py, 5.5, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = "#0b1020"; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.restore();

      // status caption
      ctx.fillStyle = status.col; ctx.font = "700 12px system-ui"; ctx.textAlign = "left";
      ctx.fillText("● " + I18N.t(status.key), VIEW.x + 14, VIEW.y + VIEW.h - 14);
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "right";
      ctx.fillText("planet @ " + P.dist.toFixed(2) + " AU   ·   HZ " + inn.toFixed(2) + "–" + out.toFixed(2) + " AU", VIEW.x + VIEW.w - 14, VIEW.y + VIEW.h - 14);
    }

    function drawHR(ctx) {
      panel(ctx, HR, I18N.t("hz.hr"));
      var px0 = HR.x + 26, px1 = HR.x + HR.w - 12, py0 = HR.y + HR.h - 26, py1 = HR.y + 34;
      var lThi = Math.log10(40000), lTlo = Math.log10(2500), lLlo = -4, lLhi = 5;
      function xT(T) { return px0 + (lThi - Math.log10(T)) / (lThi - lTlo) * (px1 - px0); }   // hot → left
      function yL(L) { return py0 - (Math.log10(Math.max(L, 1e-4)) - lLlo) / (lLhi - lLlo) * (py0 - py1); }
      // axes + labels
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px0, py1); ctx.lineTo(px0, py0); ctx.lineTo(px1, py0); ctx.stroke();
      ctx.fillStyle = "#7d8bb0"; ctx.font = "8px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("hz.temp") + " (hot → cool)", (px0 + px1) / 2, py0 + 13);
      ctx.save(); ctx.translate(HR.x + 9, (py0 + py1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(I18N.t("hz.lum"), 0, 0); ctx.restore();
      // main-sequence line (consistent with the sim's L=M^3.5, T=5810·M^0.51)
      ctx.strokeStyle = "rgba(150,170,210,0.45)"; ctx.lineWidth = 1.5; ctx.beginPath();
      var first = true;
      for (var m = 0.2; m <= 20.0001; m *= 1.16) { var X = xT(5810 * Math.pow(m, 0.51)), Y = yL(Math.pow(m, 3.5)); first ? (ctx.moveTo(X, Y), first = false) : ctx.lineTo(X, Y); }
      ctx.stroke();
      ctx.fillStyle = "rgba(150,170,210,0.6)"; ctx.font = "italic 8px system-ui"; ctx.textAlign = "left"; ctx.fillText("main sequence", xT(7000), yL(8));
      // evolutionary track from formation up to "now"
      ctx.strokeStyle = "rgba(255,209,102,0.75)"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (var i = 0; i <= 60; i++) { var s = stateAt(P.M, P.t * i / 60); i === 0 ? ctx.moveTo(xT(s.T), yL(s.L)) : ctx.lineTo(xT(s.T), yL(s.L)); }
      ctx.stroke();
      // current position
      var st = cur(), rgb = tempToRGB(st.T);
      ctx.fillStyle = "rgb(" + rgb.map(Math.round).join(",") + ")"; ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(xT(st.T), yL(st.L), 4.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }

    function drawTimeline(ctx) {
      panel(ctx, TL, I18N.t("hz.tlTitle"));
      var x0 = TL.x + 16, x1 = TL.x + TL.w - 16, y0 = TL.y + TL.h - 26, y1 = TL.y + 30;
      var T = totalLife(P.M), tm = tms(P.M);
      function xf(t) { return x0 + t / T * (x1 - x0); }
      // log-L axis
      var lmax = stateAt(P.M, tm + giantDur(P.M)).L, lo = -2, hi = Math.max(1, Math.ceil(Math.log10(lmax)));
      function yf(L) { var e = Math.log10(Math.max(L, 1e-3)); return y0 - (e - lo) / (hi - lo) * (y0 - y1); }
      // grid
      ctx.strokeStyle = "#16213f"; ctx.fillStyle = "#9fabce"; ctx.font = "9px system-ui"; ctx.textAlign = "right"; ctx.lineWidth = 1;
      for (var e = lo; e <= hi; e++) { var yy = yf(Math.pow(10, e)); ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); ctx.stroke(); ctx.fillText((e === 0 ? "1" : "10" + sup(e)) + " L☉", x0 + 34, yy + 3); }
      // main-sequence end marker
      ctx.strokeStyle = "rgba(255,180,80,0.6)"; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(xf(tm), y1); ctx.lineTo(xf(tm), y0); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,180,80,0.85)"; ctx.font = "9px system-ui"; ctx.textAlign = "center"; ctx.fillText(I18N.t("hz.giant") + " →", (xf(tm) + x1) / 2, y1 - 4);
      ctx.textAlign = "left"; ctx.fillStyle = "rgba(120,200,255,0.8)"; ctx.fillText("← " + I18N.t("hz.ms"), x0 + 2, y1 - 4);
      // luminosity track
      ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 2; ctx.beginPath();
      for (var i = 0; i <= 240; i++) { var t = T * i / 240, L = stateAt(P.M, t).L, X = xf(t), Y = yf(L); i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); }
      ctx.stroke();
      // current-time cursor
      var st = cur();
      ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(xf(P.t), y1); ctx.lineTo(xf(P.t), y0); ctx.stroke();
      ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(xf(P.t), yf(st.L), 3.5, 0, 2 * Math.PI); ctx.fill();
      // axis labels
      ctx.fillStyle = "#9fabce"; ctx.font = "9px system-ui"; ctx.textAlign = "left"; ctx.fillText("0", x0, y0 + 12);
      ctx.textAlign = "right"; ctx.fillText(T.toFixed(1) + " Gyr", x1, y0 + 12);
      var nearEnd = P.t > 0.7 * T;                        // flip the label to the left so it clears the total
      ctx.textAlign = nearEnd ? "right" : "left"; ctx.fillStyle = "#ff6b6b";
      ctx.fillText(I18N.t("hz.now") + ": " + (P.t < 1 ? Math.round(P.t * 1000) + " Myr" : P.t.toFixed(2) + " Gyr"), xf(P.t) + (nearEnd ? -5 : 5), y1 + 9);
    }

    upd();

    /* ---- helpers ---- */
    function sup(e) { var m = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" }; return String(e).split("").map(function (c) { return m[c] || c; }).join(""); }
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

/* blackbody colour (Tanner Helland approximation), T in K */
function tempToRGB(T) {
  var t = T / 100, r, g, b;
  if (t <= 66) r = 255; else r = clamp(329.7 * Math.pow(t - 60, -0.1332));
  if (t <= 66) g = clamp(99.47 * Math.log(t) - 161.12); else g = clamp(288.12 * Math.pow(t - 60, -0.0755));
  if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = clamp(138.52 * Math.log(t - 10) - 305.04);
  return [r, g, b];
  function clamp(x) { return Math.max(0, Math.min(255, x)); }
}
