/* Newton's Law of Gravity Calculator -----------------------------------------
   Faithful rebuild of the ClassAction "Newton's Law of Gravity Calculator"
   (gravcalc.swf):
     • the headline equation  F = G·M₁·M₂ / R²  with EVERY quantity substituted
       numerically (in scientific notation) and reduced to a force in newtons,
     • the resulting accelerations  a₁ = F/M₁  and  a₂ = F/M₂,
     • three logarithmic "landmark" tracks — M₁, M₂ and R — drawn like the original:
       the whole scale of reference objects is laid out ALONG each track (electron …
       Sun … galaxy ; a proton … a light-year), every landmark tick labelled, and the
       draggable handle names the object it currently sits on. ×⅓ ×½ ×2 ×3 nudge each
       value and a Memory store/show/clear compares two cases.
   Default = a small apple at the surface of the Earth → F ≈ 1.00 N, a₁ ≈ 9.81 m s⁻².
   G = 6.67×10⁻¹¹ m³ kg⁻¹ s⁻² (the constant printed in the original).               */
Sim.create({
  id: "gravcalc",
  width: 760, height: 560,
  strings: {
    en: {
      "g.mass1": "Object 1  (×)", "g.mass2": "Object 2  (×)", "g.dist": "Distance  (×)",
      "g.mem": "Memory", "g.store": "store", "g.show": "show", "g.clear": "clear",
      "g.force": "force F", "g.a1": "accel. a₁", "g.a2": "accel. a₂", "g.stored": "stored case", "g.none": "(empty)"
    },
    id: {
      "g.mass1": "Benda 1  (×)", "g.mass2": "Benda 2  (×)", "g.dist": "Jarak  (×)",
      "g.mem": "Memori", "g.store": "simpan", "g.show": "tampilkan", "g.clear": "hapus",
      "g.force": "gaya F", "g.a1": "percep. a₁", "g.a2": "percep. a₂", "g.stored": "kasus tersimpan", "g.none": "(kosong)"
    }
  },
  about: {
    en: "<p>Newton's law of universal gravitation says every pair of masses pulls on each other with a force <strong>F = G·M₁·M₂ / R²</strong> — proportional to each mass and falling off with the <em>square</em> of the distance between their centres. The same force acts on <em>both</em> bodies (F₁₂ = F₂₁), but it produces very different accelerations: a = F/M, so the lighter body responds far more.</p>" +
        "<p>The default case is a small apple resting on the Earth's surface: the pull works out to about 1&nbsp;newton, and the apple's acceleration is a₁ ≈ 9.81&nbsp;m/s² — exactly the familiar <em>g</em>. The Earth accelerates too, by an utterly negligible amount.</p>" +
        "<p>Drag each landmark track from an electron to a whole galaxy, use ×⅓…×3 to nudge a value, and <strong>store</strong> a case to compare a second one against it.</p>",
    id: "<p>Hukum gravitasi universal Newton menyatakan setiap pasang massa saling menarik dengan gaya <strong>F = G·M₁·M₂ / R²</strong> — sebanding dengan tiap massa dan meluruh dengan <em>kuadrat</em> jarak antar pusatnya. Gaya yang sama bekerja pada <em>kedua</em> benda (F₁₂ = F₂₁), tetapi menghasilkan percepatan yang sangat berbeda: a = F/M, sehingga benda yang lebih ringan merespons jauh lebih besar.</p>" +
        "<p>Kasus bawaan adalah apel kecil di permukaan Bumi: tarikannya sekitar 1&nbsp;newton, dan percepatan apel a₁ ≈ 9,81&nbsp;m/s² — persis <em>g</em> yang kita kenal. Bumi juga dipercepat, tetapi sangat kecil hingga dapat diabaikan.</p>" +
        "<p>Seret tiap trek tengara dari elektron hingga galaksi utuh, gunakan ×⅓…×3 untuk menggeser nilai, lalu <strong>simpan</strong> sebuah kasus untuk membandingkan kasus kedua.</p>"
  },
  build: function (S) {
    var G = 6.67e-11;   // matches the constant printed in the original's headline
    var P = { m1: 0.102, m2: 5.97e24, r: 6.37e6 };   // small apple on Earth's surface
    var stored = null;

    // landmark scales laid out along each track (value, full name EN/ID, short track label)
    var MASS = [
      { v: 9.109e-31, en: "electron", id: "elektron", s: "electron" },
      { v: 1.673e-27, en: "proton", id: "proton", s: "proton" },
      { v: 1e-17, en: "a virus", id: "virus", s: "virus" },
      { v: 1e-7, en: "a speck of dust", id: "butir debu", s: "dust" },
      { v: 3.4e-5, en: "a raindrop", id: "tetes hujan", s: "raindrop" },
      { v: 0.102, en: "small apple", id: "apel kecil", s: "apple" },
      { v: 1, en: "1 kilogram", id: "1 kilogram", s: "1 kg" },
      { v: 70, en: "a person", id: "manusia", s: "person" },
      { v: 1500, en: "an automobile", id: "mobil", s: "car" },
      { v: 1.0e15, en: "a large mountain", id: "gunung besar", s: "mountain" },
      { v: 9.4e20, en: "an asteroid (Ceres)", id: "asteroid (Ceres)", s: "asteroid" },
      { v: 7.35e22, en: "the Moon", id: "Bulan", s: "Moon" },
      { v: 5.97e24, en: "the Earth", id: "Bumi", s: "Earth" },
      { v: 8.68e25, en: "Uranus", id: "Uranus", s: "Uranus" },
      { v: 1.90e27, en: "Jupiter", id: "Jupiter", s: "Jupiter" },
      { v: 1.989e30, en: "the Sun", id: "Matahari", s: "Sun" },
      { v: 2.0e41, en: "the Milky Way", id: "Bima Sakti", s: "galaxy" }
    ];
    var DIST = [
      { v: 1.7e-15, en: "a proton", id: "proton", s: "proton" },
      { v: 1.0e-10, en: "an atom", id: "atom", s: "atom" },
      { v: 5e-4, en: "a grain of sand", id: "butir pasir", s: "sand" },
      { v: 1, en: "1 metre", id: "1 meter", s: "1 m" },
      { v: 1.8, en: "a person's height", id: "tinggi manusia", s: "person" },
      { v: 6.37e6, en: "radius of Earth", id: "jari-jari Bumi", s: "Earth" },
      { v: 3.84e8, en: "Earth to Moon", id: "Bumi ke Bulan", s: "Moon" },
      { v: 1.496e11, en: "1 AU (Earth–Sun)", id: "1 SA (Bumi–Matahari)", s: "1 AU" },
      { v: 5.9e12, en: "Sun to Pluto", id: "Matahari ke Pluto", s: "Pluto" },
      { v: 9.461e15, en: "1 light-year", id: "1 tahun cahaya", s: "1 ly" },
      { v: 4.0e16, en: "to the nearest star", id: "ke bintang terdekat", s: "star" },
      { v: 9.5e20, en: "across the Milky Way", id: "lebar Bima Sakti", s: "galaxy" },
      { v: 2.4e22, en: "to Andromeda", id: "ke Andromeda", s: "M31" }
    ];

    // the three interactive tracks (geometry filled in at draw time)
    var TRACKS = [
      { key: "m1", marks: MASS, unit: "kg", lo: -31, hi: 42, labelKey: "M₁ =", y: 244 },
      { key: "m2", marks: MASS, unit: "kg", lo: -31, hi: 42, labelKey: "M₂ =", y: 354 },
      { key: "r", marks: DIST, unit: "m", lo: -15, hi: 23, labelKey: "R  =", y: 464 }
    ];
    var TX0 = 250, TX1 = 740;                       // track left/right pixel bounds

    function nearest(list, v) {
      var lv = Math.log10(v), best = list[0], bd = 1e9;
      list.forEach(function (m) { var d = Math.abs(Math.log10(m.v) - lv); if (d < bd) { bd = d; best = m; } });
      return best;
    }
    function force() { return G * P.m1 * P.m2 / (P.r * P.r); }
    function clampV(T, v) { return Math.max(Math.pow(10, T.lo), Math.min(Math.pow(10, T.hi), v)); }

    /* ---------- controls (multiplier steppers + memory) ---------- */
    S.group("g.mass1"); multRow("m1");
    S.group("g.mass2"); multRow("m2");
    S.group("g.dist");  multRow("r");
    S.group("g.mem");
    S.button({ labelKey: "g.store", primary: true, on: function () { stored = { m1: P.m1, m2: P.m2, r: P.r, f: force() }; refresh(); } });
    S.button({ labelKey: "g.show", on: function () { if (!stored) return; P.m1 = stored.m1; P.m2 = stored.m2; P.r = stored.r; refresh(); } });
    S.button({ labelKey: "g.clear", on: function () { stored = null; refresh(); } });

    var oForce = S.readout({ labelKey: "g.force" });
    var oA1 = S.readout({ labelKey: "g.a1" });
    var oA2 = S.readout({ labelKey: "g.a2" });
    var oStored = S.readout({ labelKey: "g.stored" });

    function multRow(key) {
      [["×⅓", 1 / 3], ["×½", 0.5], ["×2", 2], ["×3", 3]].forEach(function (b) {
        S.button({ label: b[0], on: function () { var T = trackOf(key); P[key] = clampV(T, P[key] * b[1]); refresh(); } });
      });
    }
    function trackOf(key) { for (var i = 0; i < TRACKS.length; i++) if (TRACKS[i].key === key) return TRACKS[i]; }

    function refresh() {
      var F = force();
      oForce(sciStr(F) + " N");
      oA1(sciStr(F / P.m1) + " m/s²");
      oA2(sciStr(F / P.m2) + " m/s²");
      oStored(stored ? sciStr(stored.f) + " N" : I18N.t("g.none"));
      S.requestDraw();
    }
    S.refreshers.push(refresh);

    /* ---------- drag on the canvas tracks ---------- */
    function localXY(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    function xToVal(T, x) { var t = Math.max(0, Math.min(1, (x - TX0) / (TX1 - TX0))); return Math.pow(10, T.lo + t * (T.hi - T.lo)); }
    function valToX(T, v) { var t = (Math.log10(v) - T.lo) / (T.hi - T.lo); return TX0 + Math.max(0, Math.min(1, t)) * (TX1 - TX0); }
    var dragKey = null;
    S.canvas.addEventListener("pointerdown", function (ev) {
      var m = localXY(ev);
      TRACKS.forEach(function (T) { if (m.x > TX0 - 24 && m.x < TX1 + 12 && Math.abs(m.y - T.y) < 26) dragKey = T.key; });
      if (dragKey) { var T = trackOf(dragKey); P[dragKey] = clampV(T, xToVal(T, m.x)); S.canvas.setPointerCapture(ev.pointerId); refresh(); }
    });
    S.canvas.addEventListener("pointermove", function (ev) { if (!dragKey) return; var T = trackOf(dragKey); P[dragKey] = clampV(T, xToVal(T, localXY(ev).x)); refresh(); });
    S.canvas.addEventListener("pointerup", function () { dragKey = null; });

    /* ---------- number formatting / rendering ---------- */
    function sciParts(x) {                                  // plain only at 10⁰, like the original
      if (x === 0) return { m: "0", e: 0, plain: true };
      var e = Math.floor(Math.log10(Math.abs(x)));
      var m = x / Math.pow(10, e);
      if (Math.abs(m) >= 9.995) { m /= 10; e += 1; }
      return { m: m.toFixed(2), e: e, plain: e === 0 };
    }
    function sciStr(x) { var p = sciParts(x); return p.plain ? (+x).toFixed(2) : p.m + "×10^" + p.e; }
    function drawSci(ctx, x, y, value, color, sz) {        // draws m×10^e with a real superscript
      sz = sz || 17; ctx.fillStyle = color || "#e8ecf5"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var p = sciParts(value);
      ctx.font = sz + "px ui-monospace, Menlo, monospace";
      if (p.plain) { var t = (+value).toFixed(2); ctx.fillText(t, x, y); return x + ctx.measureText(t).width; }
      ctx.fillText(p.m + "×10", x, y); x += ctx.measureText(p.m + "×10").width + 1;
      ctx.font = Math.round(sz * 0.66) + "px ui-monospace, Menlo, monospace";
      ctx.fillText("" + p.e, x, y - sz * 0.5); x += ctx.measureText("" + p.e).width + 2;
      ctx.font = sz + "px ui-monospace, Menlo, monospace";
      return x;
    }
    function txt(ctx, x, y, s, color, sz, bold) {
      ctx.fillStyle = color || "#e8ecf5"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = (bold ? "700 " : "") + (sz || 17) + "px system-ui"; ctx.fillText(s, x, y);
      return x + ctx.measureText(s).width;
    }

    /* ---------- drawing ---------- */
    var COL = { m1: "#ff7a7a", m2: "#7ab8ff", r: "#9ee37a", G: "#caa6ff", f: "#ffd166" };
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 10, y: 8, w: 740, h: 186 }, "F  =  G · M₁ · M₂ / R²");
      formula(ctx);
      TRACKS.forEach(function (T) { drawTrack(ctx, T); });
    });

    function formula(ctx) {
      var F = force(), x, fy = 86, barY = fy - 8;
      x = txt(ctx, 26, fy, "F", COL.f, 22, true);
      x = txt(ctx, x + 8, fy, "=", "#9fb0d0", 22);
      var nx = x + 14, numY = fy - 16, denY = fy + 18;
      var xn = nx + 6;
      xn = paren(ctx, xn, numY, function (xx) { return drawSci(ctx, xx, numY, G, COL.G, 16); });
      xn = paren(ctx, xn + 4, numY, function (xx) { return drawSci(ctx, xx, numY, P.m1, COL.m1, 16); });
      xn = paren(ctx, xn + 4, numY, function (xx) { return drawSci(ctx, xx, numY, P.m2, COL.m2, 16); });
      var xd = nx + 6;
      xd = paren(ctx, xd, denY, function (xx) { return drawSci(ctx, xx, denY, P.r, COL.r, 16); });
      ctx.font = "12px ui-monospace, monospace"; ctx.fillStyle = "#9fb0d0"; ctx.fillText("2", xd + 2, denY - 9); xd += 10;
      var barRight = Math.max(xn, xd) + 6;
      ctx.strokeStyle = "#9fb0d0"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(nx, barY); ctx.lineTo(barRight, barY); ctx.stroke();
      x = txt(ctx, barRight + 12, fy, "=", "#9fb0d0", 22);
      x = drawSci(ctx, x + 12, fy, F, COL.f, 22);
      txt(ctx, x + 6, fy, "N", COL.f, 22, true);

      var ay = 142; x = txt(ctx, 26, ay, "a₁ = F / M₁ =", "#9fb0d0", 18);
      x = drawSci(ctx, x + 8, ay, F / P.m1, "#e8ecf5", 18); txt(ctx, x + 5, ay, "m/s²", "#9fb0d0", 16);
      var ay2 = 176; x = txt(ctx, 26, ay2, "a₂ = F / M₂ =", "#9fb0d0", 18);
      x = drawSci(ctx, x + 8, ay2, F / P.m2, "#e8ecf5", 18); txt(ctx, x + 5, ay2, "m/s²", "#9fb0d0", 16);
      ctx.fillStyle = "#7d8cb0"; ctx.font = "12px system-ui"; ctx.textAlign = "left";
      ctx.fillText("F₁₂ = F₂₁ : the pull on both bodies is equal — the accelerations are not.", 360, 176);
    }

    function drawTrack(ctx, T) {
      var col = COL[T.key], v = P[T.key];
      panel(ctx, { x: 10, y: T.y - 46, w: 740, h: 100 }, "");
      // label + value box
      ctx.fillStyle = "#cfd8ee"; ctx.font = "700 16px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(T.labelKey, 26, T.y + 5);
      roundRect(ctx, 78, T.y - 13, 140, 26, 6); ctx.fillStyle = "#0a0f22"; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke();
      drawSci(ctx, 88, T.y + 5, v, "#fff", 16);
      ctx.fillStyle = "#9fb0d0"; ctx.font = "14px system-ui"; ctx.fillText(T.unit, 226, T.y + 5);

      // track line
      ctx.strokeStyle = "#41507a"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(TX0, T.y); ctx.lineTo(TX1, T.y); ctx.stroke();

      // landmark ticks + labels (two rows below, greedy collision-avoidance)
      var lastR = [-1e9, -1e9], near = nearest(T.marks, v);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      T.marks.forEach(function (mk) {
        var x = valToX(T, mk.v), isNear = mk === near;
        ctx.strokeStyle = isNear ? col : "#5a6a92"; ctx.lineWidth = isNear ? 2 : 1;
        ctx.beginPath(); ctx.moveTo(x, T.y - 5); ctx.lineTo(x, T.y + 5); ctx.stroke();
        ctx.fillStyle = isNear ? col : "#8694b8"; ctx.beginPath(); ctx.arc(x, T.y, isNear ? 3 : 2, 0, 2 * Math.PI); ctx.fill();
        if (isNear) return;                       // the current one is named above the handle instead
        ctx.font = "10px system-ui"; var w = ctx.measureText(mk.s).width;
        var row = (x - w / 2 > lastR[0] + 5) ? 0 : (x - w / 2 > lastR[1] + 5) ? 1 : -1;
        if (row >= 0) { ctx.fillStyle = "#8694b8"; ctx.fillText(mk.s, x, T.y + 20 + row * 13); lastR[row] = x + w / 2; }
      });

      // handle + current object's full name above it
      var hx = valToX(T, v);
      ctx.fillStyle = col; ctx.strokeStyle = "#0a0f22"; ctx.lineWidth = 2;
      roundRect(ctx, hx - 6, T.y - 11, 12, 22, 4); ctx.fill(); ctx.stroke();
      var name = near[I18N.getLang()];
      ctx.font = "700 12px system-ui"; ctx.textAlign = "center"; ctx.fillStyle = col;
      var nw = ctx.measureText(name).width, nx = Math.max(TX0 + nw / 2, Math.min(TX1 - nw / 2, hx));
      ctx.fillText(name, nx, T.y - 18);
    }

    function paren(ctx, x, y, inner) {
      ctx.fillStyle = "#9fb0d0"; ctx.font = "16px ui-monospace, monospace"; ctx.textAlign = "left";
      ctx.fillText("(", x, y); var x2 = inner(x + 7); ctx.fillText(")", x2 + 1, y); return x2 + 8;
    }
    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      if (title) { ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title, r.x + 14, r.y + 20); }
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    refresh();
  }
});
