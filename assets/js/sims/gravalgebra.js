/* Gravity Algebra --------------------------------------------------------------
   Built on the ClassAction "gravalgebra.swf" (MultiplierSelectorClass and the
   root onChange(), decompiled). Newton's law is written out twice,

        F  = G M₁ M₂ / R²
        F′ = G (a M₁)(b M₂) / (c R)²  =  (a·b / c²) F

   and each of a, b, c is picked from ⅓, ½, 1, 2 or 3. The answer is kept exact,
   as in the original: every choice is a power of 2 or 3, so the ratio is
   2^(p₂) · 3^(p₃) and reads as a whole number or a fraction.

   Around that same calculation this version adds
     • a picture of the two bodies — each grows or shrinks with its mass (radius
       ∝ ∛mass), M₂ can be dragged along a ⅓R … 3R ruler, the "before" system
       stays behind as a dashed ghost, and the equal-and-opposite pulls are
       drawn to scale;
     • a force line on a log scale (1/81 … 81) where the change is built hop by
       hop — ×a for M₁ and ×b for M₂ above the line, then the distance factor
       TWICE below it, because R is squared;
     • two games: "predict the change" (pick F′ from four answers whose wrong
       ones are the classic slips) and "hit the target" (find every setting
       that gives a target force).                                              */
Sim.create({
  id: "gravalgebra",
  width: 760, height: 600,
  strings: {
    en: {
      "ga.mode": "Mode", "ga.modeExplore": "Explore", "ga.modePredict": "Predict the change", "ga.modeTarget": "Hit the target",
      "ga.noteExplore": "Click a coloured coefficient in the equation, or a body in the picture, to change it. Drag M₂ to change the distance.",
      "ga.notePredict": "The coefficients are set for you. Work out how strong the new force is, then pick your answer on the force line.",
      "ga.noteTarget": "Change the coefficients until F′ lands on the pink flag. Most targets can be reached in more than one way — find them all!",
      "ga.coefs": "Coefficients", "ga.m1": "multiply M₁ by", "ga.m2": "multiply M₂ by", "ga.r": "multiply R by",
      "ga.reset": "reset all to 1", "ga.newQ": "new question", "ga.newT": "new target",
      "ga.rRatio": "F′ ÷ F", "ga.rDec": "as a decimal", "ga.rWhat": "the force becomes",
      "ga.stronger": "{x}× stronger", "ga.times": "{x} times as strong", "ga.weaker": "{x} as strong", "ga.same": "unchanged",
      "ga.before": "before", "ga.after": "after",
      "ga.hint": "click a coloured coefficient to change it",
      "ga.hintQ": "what does F′ become? pick an answer below",
      "ga.hintA": "press “next question” for another one",
      "ga.scene": "THE TWO BODIES", "ga.sceneHint": "click a body to change its mass   ·   drag M₂ to change the distance",
      "ga.line": "HOW THE FORCE CHANGES", "ga.log": "log scale",
      "ga.lgM1": "M₁ factor", "ga.lgM2": "M₂ factor", "ga.lgR": "distance factor — used twice, because R is squared",
      "ga.score": "score {a}/{b}   ·   streak {s}",
      "ga.q": "How strong is the new force F′?",
      "ga.right": "Correct!", "ga.wrong": "Not quite.",
      "ga.why.square": "The distance factor must be squared.",
      "ga.why.dist": "More distance means a weaker pull: R² is in the denominator.",
      "ga.why.flip": "That is upside down: check which way each change pushes the force.",
      "ga.why.mass": "Only the distance is squared; each mass counts just once.",
      "ga.why.one": "Both masses count, so multiply by both factors.",
      "ga.why.gen": "Multiply the two mass factors, then divide by the distance factor squared.",
      "ga.next": "next question ▸", "ga.nextT": "new target ▸",
      "ga.tPrompt": "Choose coefficients that make  F′ = {x} F",
      "ga.tHit": "Bull's-eye! Can you find another way?",
      "ga.tAll": "All {b} ways found — try a new target!",
      "ga.tWays": "ways found  {a} of {b}"
    },
    id: {
      "ga.mode": "Mode", "ga.modeExplore": "Jelajahi", "ga.modePredict": "Tebak perubahannya", "ga.modeTarget": "Kenai sasaran",
      "ga.noteExplore": "Klik koefisien berwarna pada persamaan, atau benda pada gambar, untuk mengubahnya. Seret M₂ untuk mengubah jarak.",
      "ga.notePredict": "Koefisien sudah diatur untukmu. Hitung seberapa kuat gaya barunya, lalu pilih jawabanmu pada garis gaya.",
      "ga.noteTarget": "Ubah koefisien sampai F′ mendarat di bendera merah muda. Kebanyakan sasaran bisa dicapai dengan lebih dari satu cara — temukan semuanya!",
      "ga.coefs": "Koefisien", "ga.m1": "kalikan M₁ dengan", "ga.m2": "kalikan M₂ dengan", "ga.r": "kalikan R dengan",
      "ga.reset": "setel ulang semua ke 1", "ga.newQ": "soal baru", "ga.newT": "sasaran baru",
      "ga.rRatio": "F′ ÷ F", "ga.rDec": "dalam desimal", "ga.rWhat": "gayanya menjadi",
      "ga.stronger": "{x}× lebih kuat", "ga.times": "{x} kali semula", "ga.weaker": "{x} kali semula", "ga.same": "tidak berubah",
      "ga.before": "sebelum", "ga.after": "sesudah",
      "ga.hint": "klik koefisien berwarna untuk mengubahnya",
      "ga.hintQ": "menjadi berapa F′? pilih jawaban di bawah",
      "ga.hintA": "tekan “soal berikutnya” untuk soal lain",
      "ga.scene": "KEDUA BENDA", "ga.sceneHint": "klik benda untuk mengubah massanya   ·   seret M₂ untuk mengubah jarak",
      "ga.line": "BAGAIMANA GAYA BERUBAH", "ga.log": "skala log",
      "ga.lgM1": "faktor M₁", "ga.lgM2": "faktor M₂", "ga.lgR": "faktor jarak — dipakai dua kali karena R dikuadratkan",
      "ga.score": "skor {a}/{b}   ·   beruntun {s}",
      "ga.q": "Seberapa kuat gaya baru F′?",
      "ga.right": "Benar!", "ga.wrong": "Belum tepat.",
      "ga.why.square": "Faktor jarak harus dikuadratkan.",
      "ga.why.dist": "Makin jauh, makin lemah tarikannya: R² ada di penyebut.",
      "ga.why.flip": "Itu terbalik: periksa ke arah mana tiap perubahan menggeser gaya.",
      "ga.why.mass": "Hanya jarak yang dikuadratkan; tiap massa dihitung sekali saja.",
      "ga.why.one": "Kedua massa berpengaruh, jadi kalikan dengan kedua faktornya.",
      "ga.why.gen": "Kalikan kedua faktor massa, lalu bagi dengan kuadrat faktor jarak.",
      "ga.next": "soal berikutnya ▸", "ga.nextT": "sasaran baru ▸",
      "ga.tPrompt": "Pilih koefisien agar  F′ = {x} F",
      "ga.tHit": "Tepat sasaran! Bisakah kamu menemukan cara lain?",
      "ga.tAll": "Semua {b} cara ditemukan — coba sasaran baru!",
      "ga.tWays": "cara ditemukan  {a} dari {b}"
    }
  },
  about: {
    en: "<p>You rarely need the value of <strong>G</strong> to reason about gravity. Newton's law, F = GM₁M₂/R², says how the force <em>scales</em>: double one mass and the force doubles; double both and it quadruples.</p>" +
        "<p>Distance works the other way and twice as hard, because it is squared in the denominator. Move two bodies twice as far apart and the force drops to ¼; three times as far and it drops to ⅑. Halve the distance and it grows fourfold.</p>" +
        "<p>Combine changes by multiplying their effects. The <strong>force line</strong> builds the answer hop by hop on a logarithmic scale, where multiplying by the same factor is always a step of the same size: one hop for each mass, then <em>two</em> hops for the distance. Tripling M₁ while doubling R gives 3 × 1 ÷ 2² = ¾ of the original force.</p>" +
        "<p>Then test yourself. <strong>Predict the change</strong> hides the answer until you choose — its wrong options are the classic slips, such as forgetting to square the distance. <strong>Hit the target</strong> asks for a given force and counts how many of the possible settings you find. Can you find all nine ways to leave the force unchanged?</p>",
    id: "<p>Anda jarang memerlukan nilai <strong>G</strong> untuk menalar gravitasi. Hukum Newton, F = GM₁M₂/R², menyatakan bagaimana gaya itu <em>berskala</em>: gandakan satu massa dan gayanya berlipat dua; gandakan keduanya dan gayanya berlipat empat.</p>" +
        "<p>Jarak bekerja sebaliknya dan dua kali lebih kuat, karena dikuadratkan di penyebut. Jauhkan dua benda menjadi dua kali lipat dan gayanya turun menjadi ¼; tiga kali lipat dan turun menjadi ⅑. Separuhkan jaraknya dan gaya naik empat kali.</p>" +
        "<p>Gabungkan perubahan dengan mengalikan efeknya. <strong>Garis gaya</strong> menyusun jawabannya lompatan demi lompatan pada skala logaritmik, tempat perkalian dengan faktor yang sama selalu berupa langkah yang sama panjang: satu lompatan untuk tiap massa, lalu <em>dua</em> lompatan untuk jarak. Melipattigakan M₁ sambil menggandakan R menghasilkan 3 × 1 ÷ 2² = ¾ gaya semula.</p>" +
        "<p>Lalu uji dirimu. <strong>Tebak perubahannya</strong> menyembunyikan jawaban sampai kamu memilih — pilihan salahnya adalah kekeliruan klasik, misalnya lupa mengkuadratkan jarak. <strong>Kenai sasaran</strong> meminta gaya tertentu dan menghitung berapa banyak pengaturan yang kamu temukan. Bisakah kamu menemukan kesembilan cara agar gayanya tidak berubah?</p>"
  },
  build: function (S) {
    var controlsEl = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    function t(k) { return I18N.t(k); }

    /* ======================= the calculation (as in the SWF) ======================= */
    // choicesList exactly as MultiplierSelectorClass defines it
    var CHOICES = [
      { key: "1/3", p3: -1, p2: 0, value: 1 / 3, txt: "⅓" }, { key: "1/2", p3: 0, p2: -1, value: 0.5, txt: "½" },
      { key: "1", p3: 0, p2: 0, value: 1, txt: "1" }, { key: "2", p3: 0, p2: 1, value: 2, txt: "2" },
      { key: "3", p3: 1, p2: 0, value: 3, txt: "3" }
    ];
    var ONE = 2, KEYS = ["m1", "m2", "r"];
    var sel = { m1: ONE, m2: ONE, r: ONE };

    // onChange(): F′/F = a·b/c² = 2^p2 · 3^p3, kept exact
    function expOf(s) {
      var a = CHOICES[s.m1], b = CHOICES[s.m2], c = CHOICES[s.r];
      return { p2: (a.p2 + b.p2) - (c.p2 + c.p2), p3: (a.p3 + b.p3) - (c.p3 + c.p3) };
    }
    function fracOf(e) {
      var num = 1, den = 1;
      if (e.p2 < 0) den *= Math.pow(2, -e.p2); else num *= Math.pow(2, e.p2);
      if (e.p3 < 0) den *= Math.pow(3, -e.p3); else num *= Math.pow(3, e.p3);
      return { num: num, den: den };
    }
    function fracStr(q) { return q.den === 1 ? String(q.num) : q.num + "/" + q.den; }
    function valOf(e) { return Math.pow(2, e.p2) * Math.pow(3, e.p3); }
    function sameE(x, y) { return x.p2 === y.p2 && x.p3 === y.p3; }

    // all 5³ settings, and the 41 different answers they can give
    var COMBOS = [], TARGETS = [];
    CHOICES.forEach(function (_, i) { CHOICES.forEach(function (_, j) { CHOICES.forEach(function (_, k) {
      var e = expOf({ m1: i, m2: j, r: k });
      COMBOS.push(e);
      if (!TARGETS.some(function (x) { return sameE(x, e); })) TARGETS.push(e);
    }); }); });

    /* ================================== state ================================== */
    var mode = "explore";
    var quiz = { opts: [], answered: false, pick: -1, right: 0, total: 0, streak: 0, last: "" };
    var targ = { e: null, ways: 0, found: {}, count: 0, hitNow: false, last: "" };
    function locked() { return mode === "predict"; }                       // the question owns the coefficients
    function hidden() { return mode === "predict" && !quiz.answered; }     // ... and the answer stays secret

    /* ================================= controls ================================= */
    var lock = false;                       // echoing a value into a select must not re-fire its handler
    S.group("ga.mode");
    S.select({ labelKey: "ga.mode", value: "explore",
      options: [{ v: "explore", labelKey: "ga.modeExplore" }, { v: "predict", labelKey: "ga.modePredict" }, { v: "target", labelKey: "ga.modeTarget" }],
      on: function (v) { if (!lock) setMode(v); } });
    var note = document.createElement("p");
    note.className = "sim-note";
    controlsEl.appendChild(note);

    S.group("ga.coefs");
    var ctls = {}, selEls = {};
    [["m1", "ga.m1"], ["m2", "ga.m2"], ["r", "ga.r"]].forEach(function (d) {
      ctls[d[0]] = S.select({
        labelKey: d[1], value: String(ONE),
        options: CHOICES.map(function (c, n) { return { v: String(n), label: c.txt }; }),
        on: function (v) { if (lock) return; if (locked()) { syncCtls(); return; } setCoef(d[0], +v); }
      });
      selEls[d[0]] = controlsEl.lastElementChild.querySelector("select");
    });
    var bReset = S.button({ labelKey: "ga.reset", on: function () {
      if (locked()) return;
      KEYS.forEach(function (key) { sel[key] = ONE; }); changed();
    } });
    var bNewQ = S.button({ labelKey: "ga.newQ", primary: true, on: function () { newQuestion(); } });
    var bNewT = S.button({ labelKey: "ga.newT", primary: true, on: function () { newTarget(); } });

    var outRatio = S.readout({ labelKey: "ga.rRatio" });
    var outDec = S.readout({ labelKey: "ga.rDec" });
    var outWhat = S.readout({ labelKey: "ga.rWhat" });

    function syncCtls() {
      lock = true;
      KEYS.forEach(function (key) { ctls[key].set(String(sel[key])); });
      lock = false;
    }
    function setCoef(key, n) { if (sel[key] === n) return; sel[key] = n; changed(); }

    function verdict(q) {
      var v = q.num / q.den;
      if (v === 1) return t("ga.same");
      return t(v > 1 ? (q.den === 1 ? "ga.stronger" : "ga.times") : "ga.weaker").replace("{x}", fracStr(q));
    }
    function upd() {
      var q = fracOf(expOf(sel));
      if (hidden()) { outRatio("?"); outDec("?"); outWhat("?"); }
      else { outRatio(fracStr(q)); outDec(String(+(q.num / q.den).toPrecision(4))); outWhat(verdict(q)); }
      S.requestDraw();
    }
    S.refreshers.push(upd);

    // every change of a coefficient runs through here
    function changed() {
      syncCtls();
      hopClock = 0; attract = 0;
      if (mode === "target" && targ.e) {
        targ.hitNow = sameE(expOf(sel), targ.e);
        var key = sel.m1 + "," + sel.m2 + "," + sel.r;
        if (targ.hitNow && !targ.found[key]) { targ.found[key] = true; targ.count++; burst = true; }
      }
      upd(); kick();
    }

    /* ---------------------------------- modes ---------------------------------- */
    function setMode(v) {
      mode = v; open = null;
      if (v === "predict") newQuestion();
      else if (v === "target") { KEYS.forEach(function (key) { sel[key] = ONE; }); targ.e = null; newTarget(); }
      else changed();
      modeUI();
    }
    function modeUI() {
      var key = mode === "predict" ? "ga.notePredict" : mode === "target" ? "ga.noteTarget" : "ga.noteExplore";
      note.setAttribute("data-i18n", key); note.textContent = t(key);
      KEYS.forEach(function (k2) {
        selEls[k2].disabled = locked();
        selEls[k2].parentNode.style.opacity = locked() ? "0.45" : "";
      });
      bReset.style.display = locked() ? "none" : "";
      bNewQ.style.display = mode === "predict" ? "" : "none";
      bNewT.style.display = mode === "target" ? "" : "none";
      upd();
    }

    function rnd(n) { return Math.floor(Math.random() * n); }
    function shuffle(a) { for (var n = a.length - 1; n > 0; n--) { var m = rnd(n + 1), x = a[n]; a[n] = a[m]; a[m] = x; } return a; }

    // Predict: 1 coefficient changes at first, then 2, then mostly all 3 as the right answers pile up
    function newQuestion() {
      open = null;
      var n = 1 + Math.min(2, Math.floor(quiz.right / 2)), s, key, guard = 0;
      if (n === 3 && Math.random() < 0.3) n = 2;
      do {
        s = { m1: ONE, m2: ONE, r: ONE };
        shuffle(KEYS.slice()).slice(0, n).forEach(function (k2) { s[k2] = [0, 1, 3, 4][rnd(4)]; });
        key = s.m1 + "," + s.m2 + "," + s.r;
      } while (key === quiz.last && guard++ < 20);
      quiz.last = key;
      KEYS.forEach(function (k2) { sel[k2] = s[k2]; });
      quiz.opts = options(s); quiz.answered = false; quiz.pick = -1;
      changed();
    }
    // the right answer plus three wrong ones, preferring the classic slips
    function options(s) {
      var a = CHOICES[s.m1], b = CHOICES[s.m2], c = CHOICES[s.r], E = expOf(s), slips = [], near = [];
      function add(list, p2, p3, why) { list.push({ e: { p2: p2, p3: p3 }, why: why }); }
      if (c.value !== 1) {
        add(slips, a.p2 + b.p2 - c.p2, a.p3 + b.p3 - c.p3, "square");             // forgot to square R
        add(slips, a.p2 + b.p2 + 2 * c.p2, a.p3 + b.p3 + 2 * c.p3, "dist");       // put R² on top
      }
      if (E.p2 || E.p3) add(slips, -E.p2, -E.p3, "flip");                          // the whole ratio upside down
      if (a.value !== 1 || b.value !== 1) add(slips, 2 * (a.p2 + b.p2) - 2 * c.p2, 2 * (a.p3 + b.p3) - 2 * c.p3, "mass");
      if (a.value !== 1 && b.value !== 1) {                                         // used only one of the masses
        add(slips, a.p2 - 2 * c.p2, a.p3 - 2 * c.p3, "one"); add(slips, b.p2 - 2 * c.p2, b.p3 - 2 * c.p3, "one");
      }
      [[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [1, 1], [-1, -1]].forEach(function (d) { add(near, E.p2 + d[0], E.p3 + d[1], "gen"); });
      var out = [], seen = {};
      seen[E.p2 + "," + E.p3] = true;
      shuffle(slips).concat(shuffle(near)).forEach(function (o) {
        var key = o.e.p2 + "," + o.e.p3, v = valOf(o.e);
        if (out.length >= 3 || seen[key] || v > 81.5 || v < 1 / 81.5) return;        // (it must fit on the force line)
        seen[key] = true; out.push(o);
      });
      out.push({ e: E, why: "ok" });
      return shuffle(out);
    }
    function answer(n) {
      if (quiz.answered) return;
      quiz.answered = true; quiz.pick = n; quiz.total++;
      if (quiz.opts[n].why === "ok") { quiz.right++; quiz.streak++; burst = true; } else quiz.streak = 0;
      hopClock = 0;
      upd(); kick();
    }

    // Target: any of the 41 answers except the one already showing
    function newTarget() {
      open = null;
      var cur = expOf(sel), e, guard = 0;
      do { e = TARGETS[rnd(TARGETS.length)]; }
      while ((sameE(e, cur) || e.p2 + "," + e.p3 === targ.last) && guard++ < 60);
      targ.e = e; targ.last = e.p2 + "," + e.p3;
      targ.ways = COMBOS.filter(function (x) { return sameE(x, e); }).length;
      targ.found = {}; targ.count = 0; targ.hitNow = false;
      changed();
    }

    /* ================================ animation ================================ */
    var R0 = 20, L0 = 46;                                   // radius of a 1·M body; length of the F arrow
    var disp = { r1: R0, r2: R0, x2: 1, lr: 0, show: 1 };   // what is on screen, easing toward goal()
    var hopClock = 99, burst = false, particles = [], drag = null;
    var attract = 4.5;                                      // seconds of "click me" ripples on the chips, until the first change
    var HOP_DELAY = 0.06, HOP_D = 0.3, HOP_GAP = 0.06;

    function goal() {
      return {
        r1: R0 * Math.cbrt(CHOICES[sel.m1].value), r2: R0 * Math.cbrt(CHOICES[sel.m2].value),
        x2: CHOICES[sel.r].value, lr: hidden() ? 0 : Math.log(valOf(expOf(sel))), show: hidden() ? 0 : 1
      };
    }
    function hopsDone() { return HOP_DELAY + hops().length * (HOP_D + HOP_GAP); }

    var loop = S.loop(function (dt) {
      var G = goal(), f = 1 - Math.exp(-dt * 11), moving = false;
      ["r1", "r2", "lr", "show", "x2"].forEach(function (p) {
        if (p === "x2" && drag && drag.moved) return;       // the pointer holds M₂
        var d = G[p] - disp[p];
        if (Math.abs(d) < 1e-3) disp[p] = G[p]; else { disp[p] += d * f; moving = true; }
      });
      hopClock += dt;
      if (attract > 0) attract = Math.max(0, attract - dt);
      if (burst && !hidden() && hopClock >= hopsDone()) { burst = false; sparkle(); }
      particles = particles.filter(function (q) {
        q.life -= dt; q.vy += 140 * dt; q.x += q.vx * dt; q.y += q.vy * dt;
        return q.life > 0;
      });
      if (!moving && !drag && particles.length === 0 && !burst && !attract && hopClock > hopsDone() + 0.3) loop.pause();
    });
    function kick() { if (!loop.playing) loop.play(); }

    function sparkle() {
      var x = LXof(valOf(expOf(sel))), cols = [COL.res, "#ffffff", mode === "target" ? COL.target : COL.good];
      for (var n = 0; n < 34; n++) {
        var a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 150;
        particles.push({ x: x, y: LY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 70, life: 0.7 + Math.random() * 0.6,
          col: cols[n % 3], r: 1.4 + Math.random() * 2 });
      }
    }

    /* ================================== layout ================================== */
    var EQ = { x: 10, y: 8, w: 740, h: 122 };
    var SC = { x: 10, y: 138, w: 740, h: 236 };
    var FL = { x: 10, y: 382, w: 740, h: 210 };
    var X1 = SC.x + 108, RPX = 181, CY = SC.y + 112, RY = CY + 74;  // M₁ sits at X1; M₂ at X1 + c·RPX
    var LX0 = FL.x + 50, LX1 = FL.x + FL.w - 50, LY = FL.y + 120;   // the force line
    var LMIN = Math.log(1 / 81), LMAX = Math.log(81);
    function LXof(v) { return LX0 + (Math.log(v) - LMIN) / (LMAX - LMIN) * (LX1 - LX0); }

    var COL = {
      m1: "#ffa64d", m2: "#56b4ff", r: "#c39bff", res: "#ffd166", target: "#ff7ab8", good: "#5fdc9a", bad: "#ff6b6b",
      ink: "#e8ecf8", soft: "#cfd8ee", dim: "#9fabce", faint: "#6b7aa1", panel: "#0e1530", edge: "#2c3a66", accent: "#6ea8fe"
    };
    var PAL = {
      m1: { hi: "#ffe6c4", mid: "#ff9b3d", lo: "#5e2906", glow: "255,166,77" },
      m2: { hi: "#dcf0ff", mid: "#3f97f5", lo: "#0a2552", glow: "86,180,255" }
    };
    var STARS = (function () {
      var seed = 11, out = [];
      function r() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
      for (var n = 0; n < 120; n++) {
        out.push({ x: SC.x + 4 + r() * (SC.w - 8), y: SC.y + 4 + r() * (SC.h - 8),
          r: r() < 0.88 ? 0.5 + r() * 0.6 : 1.1 + r() * 0.6, a: 0.2 + r() * 0.55 });
      }
      return out;
    })();

    /* =============================== math typesetting ===============================
       A tiny box layout: each node knows its width and its height above (up) and
       below (dn) the baseline, so fractions stack and whole expressions centre.   */
    var MATH = "'Times New Roman', 'STIX Two Text', Times, serif";
    function mfont(px, it, b) { return (it ? "italic " : "") + (b ? "700 " : "") + px.toFixed(2) + "px " + MATH; }
    function tx(s, o) { o = o || {}; return { t: "tx", s: s, it: !!o.it, b: !!o.b, col: o.col, sc: o.sc || 1, dy: o.dy || 0 }; }
    function vr(s, col) { return tx(s, { it: true, col: col }); }
    function sub(s) { return tx(s, { sc: 0.6, dy: 0.24 }); }
    function sup(s) { return tx(s, { sc: 0.6, dy: -0.42 }); }
    function row() { return { t: "row", k: [].slice.call(arguments) }; }
    function frac(n, d, col) { return { t: "frac", n: n, d: d, col: col }; }
    function gap(em) { return { t: "gap", em: em }; }
    function chip(key) { return { t: "chip", key: key }; }
    function grp(key, node) { return { t: "grp", key: key, k: node }; }   // chip + its letter: one click target
    function coef(key) { return { t: "coef", key: key }; }
    function hl(node) { return { t: "hl", k: node }; }
    function qbox() { return { t: "q" }; }
    function fracNode(q, col) { return q.den === 1 ? tx(String(q.num), { col: col }) : frac(tx(String(q.num), { col: col }), tx(String(q.den), { col: col }), col); }

    function meas(ctx, n, px) {
      if (n.t === "tx") {
        var f = px * n.sc;
        ctx.font = mfont(f, n.it, n.b);
        return { w: ctx.measureText(n.s).width + (n.it ? f * 0.05 : 0), up: Math.max(0, 0.7 * f - n.dy * px), dn: Math.max(0, 0.22 * f + n.dy * px) };
      }
      if (n.t === "row") {
        var w = 0, up = 0, dn = 0;
        n.k.forEach(function (c) { var m = meas(ctx, c, px); w += m.w; up = Math.max(up, m.up); dn = Math.max(dn, m.dn); });
        return { w: w, up: up, dn: dn };
      }
      if (n.t === "frac") {
        var mn = meas(ctx, n.n, px), md = meas(ctx, n.d, px), ax = 0.3 * px, g = 0.14 * px;
        return { w: Math.max(mn.w, md.w) + 0.3 * px, up: ax + g + mn.dn + mn.up, dn: g + md.up + md.dn - ax };
      }
      if (n.t === "gap") return { w: n.em * px, up: 0, dn: 0 };
      if (n.t === "chip" || n.t === "q") return { w: 1.2 * px, up: 0.86 * px, dn: 0.34 * px };
      if (n.t === "coef") {
        var key = CHOICES[sel[n.key]].key;
        if (key.indexOf("/") >= 0) return { w: 0.56 * px, up: 0.86 * px, dn: 0.3 * px };
        ctx.font = mfont(px); return { w: ctx.measureText(key).width, up: 0.7 * px, dn: 0.22 * px };
      }
      if (n.t === "hl") { var mk = meas(ctx, n.k, px); return { w: mk.w + 0.4 * px, up: mk.up + 0.16 * px, dn: mk.dn + 0.16 * px }; }
      if (n.t === "grp") return meas(ctx, n.k, px);
      return { w: 0, up: 0, dn: 0 };
    }
    function rend(ctx, n, x, y, px, col) {
      if (n.t === "tx") {
        ctx.font = mfont(px * n.sc, n.it, n.b); ctx.fillStyle = n.col || col;
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillText(n.s, x, y + n.dy * px);
      } else if (n.t === "row") {
        n.k.forEach(function (c) { rend(ctx, c, x, y, px, col); x += meas(ctx, c, px).w; });
      } else if (n.t === "frac") {
        var mn = meas(ctx, n.n, px), md = meas(ctx, n.d, px), w = Math.max(mn.w, md.w) + 0.3 * px;
        var by = y - 0.3 * px, g = 0.14 * px;
        rend(ctx, n.n, x + (w - mn.w) / 2, by - g - mn.dn, px, col);
        rend(ctx, n.d, x + (w - md.w) / 2, by + g + md.up, px, col);
        ctx.fillStyle = n.col || col;
        ctx.fillRect(x + 0.08 * px, by - Math.max(0.6, px * 0.03), w - 0.16 * px, Math.max(1.2, px * 0.06));
      } else if (n.t === "chip") {
        drawChip(ctx, n.key, x, y, px);
      } else if (n.t === "grp") {                         // (the group starts with its chip, so the callout still points at the chip)
        var mg = meas(ctx, n.k, px);
        rend(ctx, n.k, x, y, px, col);
        hits.push({ kind: "chip", key: n.key, x: x, y: y - mg.up, w: mg.w, h: mg.up + mg.dn, ax: x + 0.6 * px, ay: y + 0.34 * px });
      } else if (n.t === "q") {
        var qw = 1.2 * px, top = y - 0.86 * px, qh = 1.2 * px;
        rr(ctx, x + 1, top, qw - 2, qh, 6);
        ctx.fillStyle = rgba(COL.res, 0.1); ctx.fill();
        ctx.setLineDash([4, 3]); ctx.strokeStyle = rgba(COL.res, 0.8); ctx.lineWidth = 1.3; ctx.stroke(); ctx.setLineDash([]);
        ctx.font = mfont(px * 0.9, false, true); ctx.fillStyle = COL.res; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("?", x + qw / 2, top + qh / 2 + 1); ctx.textBaseline = "alphabetic";
      } else if (n.t === "coef") {
        var key = CHOICES[sel[n.key]].key;
        if (key.indexOf("/") >= 0) glyph(ctx, key, x + 0.28 * px, y - 0.28 * px, px, KCOL[n.key]);
        else { ctx.font = mfont(px); ctx.fillStyle = KCOL[n.key]; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.fillText(key, x, y); }
      } else if (n.t === "hl") {
        var m = meas(ctx, n, px);
        rr(ctx, x, y - m.up, m.w, m.up + m.dn, 8);
        ctx.fillStyle = rgba(COL.res, 0.1); ctx.fill();
        ctx.strokeStyle = rgba(COL.res, 0.45); ctx.lineWidth = 1; ctx.stroke();
        rend(ctx, n.k, x + 0.2 * px, y, px, col);
      }
    }
    function drawMath(ctx, node, cx, cy, px, col, align) {      // align: "center" (default) or "left"/"right" at cx
      var m = meas(ctx, node, px), x = align === "left" ? cx : align === "right" ? cx - m.w : cx - m.w / 2;
      rend(ctx, node, x, cy + (m.up - m.dn) / 2, px, col);
      return { x: x, w: m.w, top: cy - (m.up + m.dn) / 2, h: m.up + m.dn };
    }
    // ⅓ and ½ as small stacked fractions, whole numbers as they are
    function glyph(ctx, key, cx, cy, px, col) {
      ctx.fillStyle = col; ctx.strokeStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      if (key.indexOf("/") < 0) { ctx.font = mfont(px); ctx.fillText(key, cx, cy + px * 0.05); }
      else {
        ctx.font = mfont(px * 0.6);
        ctx.fillText("1", cx, cy - px * 0.29);
        ctx.fillText(key.split("/")[1], cx, cy + px * 0.33);
        ctx.fillRect(cx - px * 0.21, cy + px * 0.02 - Math.max(0.6, px * 0.028), px * 0.42, Math.max(1.2, px * 0.056));
      }
      ctx.textBaseline = "alphabetic";
    }
    var KCOL = { m1: COL.m1, m2: COL.m2, r: COL.r };

    /* ================================= drawing ================================= */
    var hits = [], hover = null, hoverSig = "", open = null;

    S.onDraw(function () {
      var ctx = S.ctx;
      hits = [];
      S.clear();
      ctx.fillStyle = "#070b18"; ctx.fillRect(0, 0, S.W, S.H);
      drawEq(ctx);
      drawScene(ctx);
      drawLine(ctx);
      if (open) drawCallout(ctx);
    });

    /* ---- the equations ---- */
    function drawEq(ctx) {
      panel(ctx, EQ);
      var cy = EQ.y + 62, divX = EQ.x + 196;
      caption(ctx, t("ga.before").toUpperCase(), EQ.x + 102, EQ.y + 20);
      drawMath(ctx, row(vr("F"), gap(0.28), tx("="), gap(0.28),
        frac(row(vr("G"), gap(0.05), vr("M"), sub("1"), gap(0.02), vr("M"), sub("2")), row(vr("R"), sup("2")))),
        EQ.x + 102, cy, 21, COL.soft);
      ctx.fillStyle = COL.edge; ctx.fillRect(divX, EQ.y + 18, 1, EQ.h - 36);

      var midX = (divX + EQ.x + EQ.w) / 2 + 4;
      caption(ctx, t("ga.after").toUpperCase(), midX, EQ.y + 20);
      var num = row(vr("G"), gap(0.1), tx("("), grp("m1", row(chip("m1"), gap(0.04), vr("M"), sub("1"))), tx(")"),
        tx("("), grp("m2", row(chip("m2"), gap(0.04), vr("M"), sub("2"))), tx(")"));
      var den = row(tx("("), grp("r", row(chip("r"), gap(0.04), vr("R"))), tx(")"), sup("2"));
      var c = CHOICES[sel.r], cpow = c.value % 1 === 0 ? row(coef("r"), sup("2")) : row(tx("("), coef("r"), tx(")"), sup("2"));
      var parts = [vr("F′"), gap(0.28), tx("="), gap(0.28), frac(num, den), gap(0.3), tx("="), gap(0.3)];
      if (hidden()) parts.push(qbox(), gap(0.12), vr("F"));
      else {
        parts.push(frac(row(coef("m1"), gap(0.14), tx("×"), gap(0.14), coef("m2")), cpow), gap(0.08), vr("F"),
          gap(0.3), tx("="), gap(0.3), hl(row(fracNode(fracOf(expOf(sel)), COL.res), gap(0.1), vr("F", COL.res))));
      }
      drawMath(ctx, row.apply(null, parts), midX, cy, 25, COL.ink);

      ctx.font = "italic 12px system-ui, sans-serif"; ctx.fillStyle = "#7d8cb0"; ctx.textAlign = "center";
      ctx.fillText(t(mode !== "predict" ? "ga.hint" : quiz.answered ? "ga.hintA" : "ga.hintQ"), midX, EQ.y + EQ.h - 10);
    }
    function drawChip(ctx, key, x, y, px) {
      var w = 1.2 * px, top = y - 0.86 * px, h = 1.2 * px, col = KCOL[key];
      var hot = !locked() && (hoverIs("chip", key) || (open && open.key === key));
      if (attract > 0 && !locked()) {                       // a ripple that says "click me", one chip after another
        var ph = ((4.5 - attract) * 0.8 + KEYS.indexOf(key) * 0.22) % 1, grow = ph * 7;
        rr(ctx, x + 1.5 - grow, top - grow, w - 3 + 2 * grow, h + 2 * grow, 7 + grow);
        ctx.strokeStyle = rgba(col, 0.75 * (1 - ph) * Math.min(1, attract)); ctx.lineWidth = 1.5; ctx.stroke();
      }
      rr(ctx, x + 1.5, top, w - 3, h, 7);
      ctx.fillStyle = rgba(col, hot ? 0.3 : 0.14); ctx.fill();
      ctx.strokeStyle = rgba(col, hot ? 1 : locked() ? 0.3 : 0.6); ctx.lineWidth = hot ? 1.6 : 1.1; ctx.stroke();
      glyph(ctx, CHOICES[sel[key]].key, x + w / 2, top + h / 2, px * 0.9, col);
      hits.push({ kind: "chip", key: key, x: x, y: top, w: w, h: h, ax: x + w / 2, ay: top + h });
    }

    /* ---- the two bodies ---- */
    function drawScene(ctx) {
      ctx.save();
      rr(ctx, SC.x, SC.y, SC.w, SC.h, 12);
      var bg = ctx.createLinearGradient(0, SC.y, 0, SC.y + SC.h);
      bg.addColorStop(0, "#0b1230"); bg.addColorStop(1, "#070c22");
      ctx.fillStyle = bg; ctx.fill();
      ctx.clip();
      STARS.forEach(function (st) {
        ctx.fillStyle = "rgba(220,230,255," + st.a + ")";
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
      rr(ctx, SC.x, SC.y, SC.w, SC.h, 12); ctx.strokeStyle = COL.edge; ctx.lineWidth = 1; ctx.stroke();

      // title + legend
      title(ctx, t("ga.scene"), SC.x + 16, SC.y + 22);
      ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.fillStyle = COL.dim;
      var lx = SC.x + SC.w - 16, ly = SC.y + 22;
      ctx.fillText(t("ga.after"), lx, ly); lx -= ctx.measureText(t("ga.after")).width + 8;
      ctx.fillStyle = COL.res; ctx.fillRect(lx - 22, ly - 5, 22, 2.5); lx -= 40;
      ctx.fillStyle = COL.dim; ctx.fillText(t("ga.before"), lx, ly); lx -= ctx.measureText(t("ga.before")).width + 8;
      ctx.strokeStyle = "rgba(207,216,238,0.65)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(lx - 22, ly - 4); ctx.lineTo(lx, ly - 4); ctx.stroke(); ctx.setLineDash([]);

      var x1 = X1, x2 = X1 + RPX * disp.x2, lock2 = locked();

      // the distance ruler: a stop for every choice of c, the current span in lavender
      ctx.strokeStyle = "rgba(195,155,255,0.22)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X1, RY); ctx.lineTo(X1 + RPX * 3, RY); ctx.stroke();
      CHOICES.forEach(function (c, n) {
        var sx = X1 + RPX * c.value, cur = n === sel.r, hot = hoverIs("stop", n);
        ctx.fillStyle = cur ? COL.r : rgba(COL.r, 0.45);
        ctx.fillRect(sx - 0.75, RY - 5, 1.5, 10);
        ctx.font = (cur || hot ? "700 " : "") + "12px system-ui, sans-serif"; ctx.textAlign = "center";
        ctx.fillStyle = cur ? COL.r : hot ? COL.ink : rgba(COL.r, 0.6);
        var lab = (c.value === 1 ? "" : c.txt) + "R";
        ctx.fillText(lab, sx, RY + 20);
        var lw = ctx.measureText(lab).width + 10;
        hits.push({ kind: "stop", i: n, x: sx - lw / 2, y: RY + 7, w: lw, h: 18 });
      });
      ctx.strokeStyle = COL.r; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x1, RY); ctx.lineTo(x2, RY); ctx.stroke(); ctx.lineCap = "butt";
      ctx.fillStyle = COL.r; ctx.fillRect(x1 - 1, RY - 7, 2, 14); ctx.fillRect(x2 - 1, RY - 7, 2, 14);
      // the span's name sits above the line, like a dimension on a drawing
      var spanTxt = (CHOICES[sel.r].value === 1 ? "" : CHOICES[sel.r].txt) + "R";
      ctx.font = "700 13px system-ui, sans-serif";
      var pw = ctx.measureText(spanTxt).width + 14, px = (x1 + x2) / 2;
      var spanHot = !lock2 && (hoverIs("span") || (open && open.key === "r" && open.from === "span"));
      rr(ctx, px - pw / 2, RY - 24, pw, 18, 6);
      ctx.fillStyle = spanHot ? "#3a2d5e" : "rgba(14,21,48,0.85)"; ctx.fill();
      if (spanHot) { ctx.strokeStyle = COL.r; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = COL.r; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(spanTxt, px, RY - 14.5);
      ctx.textBaseline = "alphabetic";
      hits.push({ kind: "span", x: px - pw / 2, y: RY - 24, w: pw, h: 18 });

      // bodies, with the "before" system as dashed ghosts on top
      body(ctx, x1, CY, disp.r1, PAL.m1, !lock2 && (hoverIs("body", "m1") || hoverIs("blabel", "m1") || (open && open.key === "m1")));
      body(ctx, x2, CY, disp.r2, PAL.m2, !lock2 && (hoverIs("body", "m2") || hoverIs("blabel", "m2") || (open && open.key === "m2") || !!drag));
      hits.push({ kind: "body", key: "m1", cx: x1, cy: CY, r: disp.r1 + 6 });
      hits.push({ kind: "body", key: "m2", cx: x2, cy: CY, r: disp.r2 + 6 });
      ctx.save();
      ctx.setLineDash([4, 4]); ctx.lineWidth = 1.3; ctx.strokeStyle = "rgba(207,216,238,0.55)";
      ctx.beginPath(); ctx.arc(X1, CY, R0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(X1 + RPX, CY, R0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // mass labels: M₁ to the left of its body, M₂ to the right of its body
      var b1 = drawMath(ctx, row(coef("m1"), gap(0.12), vr("M"), sub("1")), x1 - disp.r1 - 12, CY, 19, COL.ink, "right");
      var b2 = drawMath(ctx, row(coef("m2"), gap(0.12), vr("M"), sub("2")), x2 + disp.r2 + 12, CY, 19, COL.ink, "left");
      hits.push({ kind: "blabel", key: "m1", x: b1.x - 4, y: b1.top - 4, w: b1.w + 8, h: b1.h + 8 });
      hits.push({ kind: "blabel", key: "m2", x: b2.x - 4, y: b2.top - 4, w: b2.w + 8, h: b2.h + 8 });

      // forces: F′ (gold) hugs each body, the "before" F (dashed) runs alongside it, one lane further out,
      // so the two read as bars of the same scale; on M₂ the lanes only stack when the two tails meet
      var ghost = "rgba(207,216,238,0.6)", L = L0 * Math.exp(disp.lr);
      var cap = Math.min(250, SC.x + SC.w - 40 - x1, x2 - SC.x - 40);
      var yA = CY - disp.r1 - 13, gA = yA - 16;
      var yB = CY + disp.r2 + 13, near = Math.max(0, Math.min(1, 1 - (Math.abs(x2 - X1 - RPX) - 30) / 40));
      var gB = (CY + R0 + 13) * (1 - near) + (yB + 16) * near;
      var g1 = arrow(ctx, X1, gA, 1, L0, ghost, { dash: true, w: 1.5 });
      var g2 = arrow(ctx, X1 + RPX, gB, -1, L0, ghost, { dash: true, w: 1.5 });
      armLabel(ctx, "F", g1.xe, gA, 1, ghost); armLabel(ctx, "F", g2.xe, gB, -1, ghost);
      if (!hidden() && disp.show > 0.02) {               // (a new question hides them at once; a reveal fades them in)
        var mult = "×" + fracStr(fracOf(expOf(sel)));
        ctx.globalAlpha = disp.show;
        var a1 = arrow(ctx, x1, yA, 1, L, COL.res, { cap: cap, w: 3, mult: mult });
        var a2 = arrow(ctx, x2, yB, -1, L, COL.res, { cap: cap, w: 3, mult: mult });
        armLabel(ctx, "F′", a1.xe, yA, 1, COL.res);
        armLabel(ctx, "F′", a2.xe, yB, -1, COL.res);
        ctx.globalAlpha = 1;
      }
      if (hidden()) {                                     // each body's pull is the unknown
        ctx.font = mfont(16, true); ctx.fillStyle = COL.res; ctx.textBaseline = "middle"; ctx.textAlign = "center";
        ctx.fillText("F′ = ?", x1, yA); ctx.fillText("F′ = ?", x2, yB + 2);
        ctx.textBaseline = "alphabetic";
      }

      ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = "#6b7aa1"; ctx.textAlign = "center";
      if (!lock2) ctx.fillText(t("ga.sceneHint"), SC.x + SC.w / 2, SC.y + SC.h - 10);
    }
    function body(ctx, x, y, r, pal, hot) {
      var gl = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 2.6);
      gl.addColorStop(0, "rgba(" + pal.glow + ",0.28)"); gl.addColorStop(1, "rgba(" + pal.glow + ",0)");
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, Math.PI * 2); ctx.fill();
      var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.08, x, y, r * 1.02);
      g.addColorStop(0, pal.hi); g.addColorStop(0.45, pal.mid); g.addColorStop(1, pal.lo);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      // a few soft bands so it reads as a world rather than a dot
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      [-0.42, 0.05, 0.5].forEach(function (b, n) { ctx.fillRect(x - r, y + b * r, 2 * r, r * (n === 1 ? 0.16 : 0.1)); });
      ctx.restore();
      if (hot) {
        ctx.strokeStyle = "rgba(" + pal.glow + ",0.95)"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(x, y, r + 5, 0, Math.PI * 2); ctx.stroke();
      }
    }
    // a horizontal force arrow from (x, y), pointing dir (+1 right / −1 left)
    function arrow(ctx, x, y, dir, L, col, o) {
      var capped = o.cap != null && L > o.cap, len = capped ? o.cap : L;
      var hl2 = Math.min(11, Math.max(4.5, len * 0.5)), hw = hl2 * 0.52, xe = x + dir * len;
      ctx.save();
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = o.w; ctx.lineCap = "round";
      if (o.dash) ctx.setLineDash([5, 4]);
      var se = xe - dir * hl2 * 0.7;
      if (capped) {                                   // too long for the picture: break the shaft and say how long
        ctx.font = "700 12px system-ui, sans-serif";
        var bx = x + dir * len * 0.5, gw = ctx.measureText(o.mult).width / 2 + 10;
        seg(ctx, x, y, bx - dir * gw, y); seg(ctx, bx + dir * gw, y, se, y);
        ctx.lineWidth = 1.6;
        seg(ctx, bx - gw - 3, y + 6, bx - gw + 3, y - 6); seg(ctx, bx + gw - 3, y + 6, bx + gw + 3, y - 6);
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.mult, bx, y + 1); ctx.textBaseline = "alphabetic";
      } else if (len > hl2 * 0.7) seg(ctx, x, y, se, y);
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(xe, y); ctx.lineTo(xe - dir * hl2, y - hw); ctx.lineTo(xe - dir * hl2, y + hw); ctx.closePath();
      if (o.dash) { ctx.lineWidth = 1.3; ctx.stroke(); } else ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, o.dash ? 2 : 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return { xe: xe };
    }
    function armLabel(ctx, s, x, y, dir, col) {
      ctx.font = mfont(16, true); ctx.fillStyle = col; ctx.textBaseline = "middle";
      ctx.textAlign = dir > 0 ? "left" : "right"; ctx.fillText(s, x + dir * 6, y + 1);
      ctx.textBaseline = "alphabetic";
    }

    /* ---- the force line ---- */
    function hops() {
      var a = CHOICES[sel.m1].value, b = CHOICES[sel.m2].value, c = CHOICES[sel.r].value, v = 1, out = [];
      if (a !== 1) { out.push({ from: v, to: v * a, side: -1, col: COL.m1, lab: eff(a) }); v *= a; }
      if (b !== 1) { out.push({ from: v, to: v * b, side: -1, col: COL.m2, lab: eff(b) }); v *= b; }
      if (c !== 1) for (var n = 0; n < 2; n++) { out.push({ from: v, to: v / c, side: 1, col: COL.r, lab: eff(1 / c) }); v /= c; }
      out.forEach(function (h, n) {
        h.xa = LXof(h.from); h.xb = LXof(h.to);
        h.hgt = Math.min(40, Math.max(14, Math.abs(h.xb - h.xa) * 0.42));
        for (var m = 0; m < n; m++) {                     // a hop that retraces ground on the same side flies inside the first
          var g = out[m], lo = Math.max(Math.min(g.xa, g.xb), Math.min(h.xa, h.xb)), hi = Math.min(Math.max(g.xa, g.xb), Math.max(h.xa, h.xb));
          if (g.side === h.side && hi - lo > 2) { g.hgt = Math.max(g.hgt, 34); h.hgt = Math.max(18, g.hgt * 0.6); h.inner = true; }
        }
      });
      return out;
    }
    function eff(f) { return f > 1 ? "×" + Math.round(f) : "÷" + Math.round(1 / f); }
    function hopPos(h, u) {
      var y0 = LY + h.side * 11, cx = (h.xa + h.xb) / 2, cy = y0 + h.side * 2 * h.hgt, w = 1 - u;
      return { x: w * w * h.xa + 2 * w * u * cx + u * u * h.xb, y: w * w * y0 + 2 * w * u * cy + u * u * y0 };
    }
    function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }

    function drawLine(ctx) {
      panel(ctx, FL);
      title(ctx, t("ga.line"), FL.x + 16, FL.y + 22);
      ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = COL.faint; ctx.textAlign = "left";
      ctx.fillText("·  " + t("ga.log"), FL.x + 22 + titleW, FL.y + 22);

      var q = fracOf(expOf(sel)), v = q.num / q.den, H = hidden() ? [] : hops(), done = hopsDone();

      // status (right of the title) and the message row
      ctx.textAlign = "right"; ctx.font = "700 13px system-ui, sans-serif";
      if (mode === "explore") { ctx.fillStyle = COL.res; ctx.fillText(verdict(q), FL.x + FL.w - 16, FL.y + 22); }
      else if (mode === "predict") {
        ctx.fillStyle = COL.res;
        ctx.fillText(t("ga.score").replace("{a}", quiz.right).replace("{b}", quiz.total).replace("{s}", quiz.streak), FL.x + FL.w - 16, FL.y + 22);
      } else if (targ.e) {
        ctx.fillStyle = COL.target;
        ctx.fillText(t("ga.tWays").replace("{a}", targ.count).replace("{b}", targ.ways), FL.x + FL.w - 16, FL.y + 22);
      }
      var my = FL.y + 47;
      if (mode === "explore") legend(ctx, my);
      else {
        var msg = "", mcol = COL.soft;
        if (mode === "predict") {
          if (!quiz.answered) msg = t("ga.q");
          else if (quiz.opts[quiz.pick].why === "ok") { msg = "✓  " + t("ga.right"); mcol = COL.good; }
          else { msg = "✗  " + t("ga.wrong") + "  " + t("ga.why." + quiz.opts[quiz.pick].why); mcol = COL.bad; }
        } else if (targ.e) {
          if (targ.hitNow) { msg = targ.count === targ.ways ? t("ga.tAll").replace("{b}", targ.ways) : t("ga.tHit"); mcol = COL.target; }
          else msg = t("ga.tPrompt").replace("{x}", fracStr(fracOf(targ.e)));
        }
        ctx.font = "600 13px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = mcol;
        ctx.fillText(msg, FL.x + 16, my);
        if (mode === "target" || quiz.answered) actionChip(ctx, t(mode === "predict" ? "ga.next" : "ga.nextT"), my);
      }

      // the track: labels for every ×3, small ticks for every ×2
      rr(ctx, LX0 - 16, LY - 11, LX1 - LX0 + 32, 22, 11);
      ctx.fillStyle = "#121b3b"; ctx.fill(); ctx.strokeStyle = COL.edge; ctx.lineWidth = 1; ctx.stroke();
      [1 / 16, 1 / 8, 1 / 4, 1 / 2, 2, 4, 8, 16].forEach(function (w) {
        var x = LXof(w); ctx.fillStyle = "#3d4d80";
        ctx.fillRect(x - 0.6, LY - 11, 1.2, 4); ctx.fillRect(x - 0.6, LY + 7, 1.2, 4);
      });

      // pills: the starting point F (= 1), a wrong guess, the answer F′
      var pills = [];
      if (mode === "predict" && quiz.answered && quiz.opts[quiz.pick].why !== "ok") {
        var wq = fracOf(quiz.opts[quiz.pick].e);
        pills.push({ v: wq.num / wq.den, txt: "✗ " + fracStr(wq), fill: "#2a1020", stroke: COL.bad, ink: COL.bad, a: 1 });
      }
      if (!hidden()) pills.push({ v: v, txt: fracStr(q), fill: COL.res, ink: "#1d1604", a: hopClock >= done ? 1 : 0.35, pop: hopClock - done, fixed: true });
      if (!pills.some(function (p) { return p.v === 1; })) pills.unshift({ v: 1, txt: "1", fill: "#121b3b", stroke: COL.soft, ink: COL.ink, a: 1 });
      ctx.font = "700 12px system-ui, sans-serif";
      pills.forEach(function (p) { p.w = ctx.measureText(p.txt).width + 14; p.x = LXof(p.v); });
      for (var it = 0; it < 4; it++) pills.forEach(function (p) {     // nudge pills apart rather than hide one
        if (p.fixed) return;
        pills.forEach(function (o) {
          var need = (p.w + o.w) / 2 + 3, d = p.x - o.x;
          if (o !== p && Math.abs(d) < need) p.x = o.x + (d >= 0 ? need : -need);
        });
      });
      [1 / 81, 1 / 27, 1 / 9, 1 / 3, 3, 9, 27, 81].forEach(function (w) {
        var x = LXof(w), lab = w < 1 ? "1/" + Math.round(1 / w) : String(w);
        ctx.font = "11px system-ui, sans-serif";
        var lw = ctx.measureText(lab).width;
        if (pills.some(function (p) { return Math.abs(p.x - x) < (p.w + lw) / 2 + 3; })) return;
        ctx.fillStyle = "#7d8cb0"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(lab, x, LY + 0.5); ctx.textBaseline = "alphabetic";
      });

      // target flag
      if (mode === "target" && targ.e) {
        var fx = LXof(valOf(targ.e)), fc = targ.hitNow ? COL.res : COL.target, ft = fracStr(fracOf(targ.e));
        ctx.fillStyle = fc; ctx.fillRect(fx - 1, LY - 58, 2, 47);
        ctx.font = "700 12px system-ui, sans-serif";
        var fw = ctx.measureText(ft).width + 26, right = fx + fw < LX1 + 20, f0 = right ? fx + 1 : fx - 1 - fw;
        ctx.beginPath();
        if (right) { ctx.moveTo(f0, LY - 58); ctx.lineTo(f0 + fw, LY - 58); ctx.lineTo(f0 + fw - 7, LY - 49); ctx.lineTo(f0 + fw, LY - 40); ctx.lineTo(f0, LY - 40); }
        else { ctx.moveTo(f0 + fw, LY - 58); ctx.lineTo(f0, LY - 58); ctx.lineTo(f0 + 7, LY - 49); ctx.lineTo(f0, LY - 40); ctx.lineTo(f0 + fw, LY - 40); }
        ctx.closePath(); ctx.fill();
        // a little bull's-eye on the pennant
        var bx2 = right ? f0 + 9 : f0 + fw - 9;
        ctx.strokeStyle = "#2a0d1c"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(bx2, LY - 49, 4, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#2a0d1c"; ctx.beginPath(); ctx.arc(bx2, LY - 49, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.textAlign = right ? "left" : "right"; ctx.textBaseline = "middle";
        ctx.fillText(ft, right ? f0 + 16 : f0 + fw - 16, LY - 48.5); ctx.textBaseline = "alphabetic";
      }

      // the hops: masses above the line, the distance (twice) below it
      var token = null;
      H.forEach(function (h, n) {
        var u = Math.max(0, Math.min(1, (hopClock - HOP_DELAY - n * (HOP_D + HOP_GAP)) / HOP_D));
        if (u <= 0) return;
        var e2 = ease(u);
        ctx.strokeStyle = h.col; ctx.lineWidth = 2.2; ctx.beginPath();
        for (var m = 0; m <= 28; m++) { var p = hopPos(h, e2 * m / 28); if (m) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
        ctx.stroke();
        if (u < 1) token = hopPos(h, e2);
        else {
          var c0 = hopPos(h, 0.92), c1 = hopPos(h, 1), an = Math.atan2(c1.y - c0.y, c1.x - c0.x);
          ctx.fillStyle = h.col; ctx.beginPath();
          ctx.moveTo(c1.x, c1.y); ctx.lineTo(c1.x - 9 * Math.cos(an - 0.42), c1.y - 9 * Math.sin(an - 0.42));
          ctx.lineTo(c1.x - 9 * Math.cos(an + 0.42), c1.y - 9 * Math.sin(an + 0.42)); ctx.closePath(); ctx.fill();
        }
        if (u > 0.55) {                                   // the factor, over the hop (or tucked inside a nested one)
          var ap = hopPos(h, 0.5), ly = h.side > 0 ? ap.y + 15 : h.inner ? ap.y + 14 : ap.y - 6;
          ctx.font = "700 13px system-ui, sans-serif"; ctx.textAlign = "center";
          ctx.strokeStyle = COL.panel; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.strokeText(h.lab, ap.x, ly);
          ctx.fillStyle = h.col; ctx.fillText(h.lab, ap.x, ly);
        }
      });
      // ... and what the two distance hops add up to
      var dist = H.filter(function (h) { return h.side > 0; });
      if (dist.length === 2 && hopClock > HOP_DELAY + (H.length - 0.3) * (HOP_D + HOP_GAP)) {
        var c = CHOICES[sel.r], f2 = 1 / (c.value * c.value);
        var lab = "(" + c.txt + "R)²  ⇒  " + (f2 > 1 ? "×" + Math.round(f2) : "÷" + Math.round(1 / f2));
        ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = rgba(COL.r, 0.9); ctx.textAlign = "center";
        ctx.fillText(lab, (dist[0].xa + dist[1].xb) / 2, LY + 11 + dist[0].hgt + 31);
      }
      if (token) {
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(token.x, token.y, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = COL.res; ctx.lineWidth = 2; ctx.stroke();
      }

      // pills on top of everything on the line
      pills.forEach(function (p) {
        var sc = p.pop != null && p.pop >= 0 && p.pop < 0.22 ? 1 + 0.35 * (1 - p.pop / 0.22) : 1;
        ctx.save(); ctx.globalAlpha = p.a;
        ctx.translate(p.x, LY); ctx.scale(sc, sc);
        rr(ctx, -p.w / 2, -10, p.w, 20, 10);
        ctx.fillStyle = p.fill; ctx.fill();
        if (p.stroke) { ctx.strokeStyle = p.stroke; ctx.lineWidth = 1.3; ctx.stroke(); }
        ctx.font = "700 12px system-ui, sans-serif"; ctx.fillStyle = p.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(p.txt, 0, 0.5);
        ctx.restore();
      });
      ctx.textBaseline = "alphabetic";

      // Predict: the four answers to choose from
      if (hidden()) {
        var cw = 104, ch = 40, sp = 16, x0 = FL.x + FL.w / 2 - (4 * cw + 3 * sp) / 2, y0 = FL.y + 60;
        quiz.opts.forEach(function (o, n) {
          var x = x0 + n * (cw + sp), hot = hoverIs("answer", n);
          rr(ctx, x, y0, cw, ch, 10);
          ctx.fillStyle = hot ? "#22306a" : "#151e44"; ctx.fill();
          ctx.strokeStyle = hot ? COL.res : "#3a4a80"; ctx.lineWidth = hot ? 1.8 : 1; ctx.stroke();
          var ink = hot ? COL.res : COL.ink;
          drawMath(ctx, row(fracNode(fracOf(o.e), ink), gap(0.16), vr("F", ink)), x + cw / 2, y0 + ch / 2, 18, ink);
          hits.push({ kind: "answer", i: n, x: x, y: y0, w: cw, h: ch });
        });
      }

      particles.forEach(function (p) {
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 0.5));
        ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
    function legend(ctx, y) {
      var items = [[COL.m1, t("ga.lgM1")], [COL.m2, t("ga.lgM2")], [COL.r, t("ga.lgR")]];
      ctx.font = "12px system-ui, sans-serif";
      var w = items.reduce(function (s2, it) { return s2 + 16 + ctx.measureText(it[1]).width + 22; }, -22), x = FL.x + FL.w / 2 - w / 2;
      items.forEach(function (it) {
        ctx.fillStyle = it[0]; ctx.beginPath(); ctx.arc(x + 5, y - 4, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = COL.dim; ctx.textAlign = "left"; ctx.fillText(it[1], x + 16, y);
        x += 16 + ctx.measureText(it[1]).width + 22;
      });
    }
    function actionChip(ctx, label, y) {
      ctx.font = "700 12px system-ui, sans-serif";
      var w = ctx.measureText(label).width + 22, x = FL.x + FL.w - 16 - w, hot = hoverIs("next");
      rr(ctx, x, y - 15, w, 22, 11);
      ctx.fillStyle = hot ? "#9cc4ff" : COL.accent; ctx.fill();
      ctx.fillStyle = "#06112b"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, x + w / 2, y - 3.5); ctx.textBaseline = "alphabetic";
      hits.push({ kind: "next", x: x, y: y - 15, w: w, h: 22 });
    }

    /* ---- the callout: ⅓ ½ 1 2 3, with a tail pointing at what was clicked ---- */
    var CW = 38, CH = 40, CP = 6;
    function openCallout(key, ax, ay, dir, from) { open = { key: key, ax: ax, ay: ay, dir: dir, from: from }; hover = null; hoverSig = ""; }
    function calloutBox() {
      var w = CW * 5 + CP * 2, h = CH + CP * 2;
      var x = Math.max(6, Math.min(S.W - 6 - w, open.ax - w / 2));
      var y = open.dir > 0 ? open.ay + 10 : open.ay - 10 - h;
      return { x: x, y: Math.max(4, Math.min(S.H - h - 4, y)), w: w, h: h };
    }
    function calloutChoiceAt(p) {
      var b = calloutBox();
      if (p.x < b.x || p.x > b.x + b.w || p.y < b.y || p.y > b.y + b.h) return -1;
      return Math.max(0, Math.min(4, Math.floor((p.x - b.x - CP) / CW)));
    }
    function drawCallout(ctx) {
      var b = calloutBox(), col = KCOL[open.key], tx2 = Math.max(b.x + 16, Math.min(b.x + b.w - 16, open.ax));
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
      ctx.beginPath();
      if (open.dir > 0) {                                  // tail on top, pointing up at a chip
        ctx.moveTo(b.x + 8, b.y); ctx.lineTo(tx2 - 9, b.y); ctx.lineTo(tx2, b.y - 9); ctx.lineTo(tx2 + 9, b.y); ctx.lineTo(b.x + b.w - 8, b.y);
        ctx.arcTo(b.x + b.w, b.y, b.x + b.w, b.y + 8, 8); ctx.arcTo(b.x + b.w, b.y + b.h, b.x + b.w - 8, b.y + b.h, 8);
        ctx.arcTo(b.x, b.y + b.h, b.x, b.y + b.h - 8, 8); ctx.arcTo(b.x, b.y, b.x + 8, b.y, 8);
      } else {                                             // tail underneath, pointing down at a body
        ctx.moveTo(b.x + 8, b.y); ctx.lineTo(b.x + b.w - 8, b.y);
        ctx.arcTo(b.x + b.w, b.y, b.x + b.w, b.y + 8, 8); ctx.arcTo(b.x + b.w, b.y + b.h, b.x + b.w - 8, b.y + b.h, 8);
        ctx.lineTo(tx2 + 9, b.y + b.h); ctx.lineTo(tx2, b.y + b.h + 9); ctx.lineTo(tx2 - 9, b.y + b.h);
        ctx.arcTo(b.x, b.y + b.h, b.x, b.y + b.h - 8, 8); ctx.arcTo(b.x, b.y, b.x + 8, b.y, 8);
      }
      ctx.closePath();
      ctx.fillStyle = "#141c3e"; ctx.fill();
      ctx.restore();
      ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke();
      for (var n = 0; n < 5; n++) {
        var cx = b.x + CP + (n + 0.5) * CW, cy = b.y + CP + CH / 2, cur = n === sel[open.key], hot = hoverIs("opt", n);
        if (cur || hot) {
          rr(ctx, b.x + CP + n * CW + 2, b.y + CP + 2, CW - 4, CH - 4, 7);
          ctx.fillStyle = cur ? rgba(col, 0.28) : "rgba(255,255,255,0.08)"; ctx.fill();
        }
        glyph(ctx, CHOICES[n].key, cx, cy, 22, cur ? col : hot ? COL.ink : COL.dim);
      }
    }

    /* ================================ interaction ================================ */
    function localXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function hitAt(p) {
      for (var n = hits.length - 1; n >= 0; n--) {
        var h = hits[n];
        if (h.r != null ? Math.hypot(p.x - h.cx, p.y - h.cy) <= h.r : (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h)) return h;
      }
      return null;
    }
    function usable(h) {
      if (!h) return false;
      if (h.kind === "answer") return hidden();
      if (h.kind === "next") return true;
      return !locked();
    }
    function hoverIs(kind, id) { return !!hover && hover.kind === kind && (id == null || hover.key === id || hover.i === id); }

    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = localXY(ev);
      if (open) {
        var n = calloutChoiceAt(p), was = open;
        open = null;
        if (n >= 0) { setCoef(was.key, n); S.requestDraw(); return; }
        var h0 = hitAt(p);                                 // clicking the same thing again just closes it
        if (h0 && h0.key === was.key && (h0.kind === "chip" || h0.kind === "body" || h0.kind === "blabel" || h0.kind === "span")) { S.requestDraw(); return; }
      }
      var h = hitAt(p);
      if (!usable(h)) { S.requestDraw(); return; }
      if (h.kind === "chip") openCallout(h.key, h.ax, h.ay, 1, "chip");
      else if (h.kind === "body" && h.key === "m2") {      // M₂: press and drag to move it, or just click it
        drag = { x0: p.x, moved: false };
        S.canvas.setPointerCapture(ev.pointerId);
      }
      else if (h.kind === "body" || h.kind === "blabel") {
        var bx = h.key === "m1" ? X1 : X1 + RPX * disp.x2, br = h.key === "m1" ? disp.r1 : disp.r2;
        openCallout(h.key, bx, CY - br - 4, -1, "body");
      }
      else if (h.kind === "span") openCallout("r", h.x + h.w / 2, h.y, -1, "span");
      else if (h.kind === "stop") setCoef("r", h.i);
      else if (h.kind === "answer") answer(h.i);
      else if (h.kind === "next") { if (mode === "predict") newQuestion(); else newTarget(); }
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = localXY(ev);
      if (drag) {
        if (!drag.moved && Math.abs(p.x - drag.x0) > 3) drag.moved = true;
        if (drag.moved) {
          var u = Math.max(1 / 3, Math.min(3, (p.x - X1) / RPX)), best = 0;
          disp.x2 = u;
          CHOICES.forEach(function (c, n) { if (Math.abs(c.value - u) < Math.abs(CHOICES[best].value - u)) best = n; });
          if (best !== sel.r) setCoef("r", best); else S.requestDraw();
        }
        S.canvas.style.cursor = "grabbing";
        return;
      }
      var hv = null, h;
      if (open) { var n = calloutChoiceAt(p); if (n >= 0) hv = { kind: "opt", i: n }; }
      if (!hv && usable(h = hitAt(p))) hv = { kind: h.kind, key: h.key, i: h.i };
      var sig = hv ? hv.kind + ":" + (hv.key || "") + ":" + (hv.i != null ? hv.i : "") : "";
      if (sig !== hoverSig) { hoverSig = sig; hover = hv; S.requestDraw(); }
      S.canvas.style.cursor = !hv ? "default" : (hv.kind === "body" && hv.key === "m2") ? "grab" : "pointer";
    });
    function endDrag() {
      if (!drag) return;
      var d = drag; drag = null;
      if (!d.moved) openCallout("m2", X1 + RPX * disp.x2, CY - disp.r2 - 4, -1, "body");
      kick();                                              // glide M₂ onto its stop
      S.requestDraw();
    }
    S.canvas.addEventListener("pointerup", endDrag);
    S.canvas.addEventListener("pointercancel", endDrag);
    S.canvas.addEventListener("pointerleave", function () { if (!drag && hover) { hover = null; hoverSig = ""; S.requestDraw(); } });
    window.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && open) { open = null; S.requestDraw(); } });

    /* ================================== helpers ================================== */
    function rgba(hex, a) {
      var n = parseInt(hex.slice(1), 16);
      return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
    }
    function rr(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function seg(ctx, x0, y0, x1, y1) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
    function panel(ctx, r) {
      rr(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = COL.panel; ctx.fill();
      ctx.strokeStyle = COL.edge; ctx.lineWidth = 1; ctx.stroke();
    }
    var titleW = 0;
    function title(ctx, s, x, y) {
      ctx.font = "700 11px system-ui, sans-serif"; ctx.fillStyle = COL.accent; ctx.textAlign = "left";
      ctx.fillText(s, x, y); titleW = ctx.measureText(s).width;
    }
    function caption(ctx, s, x, y) {
      ctx.font = "700 10px system-ui, sans-serif"; ctx.fillStyle = COL.faint; ctx.textAlign = "center";
      ctx.fillText(s, x, y);
    }

    modeUI();
    upd();
    kick();                                                 // (runs the opening ripples)
  }
});
