/* Hammer Thrower Comparison -----------------------------------------------------
   Rebuild of the ClassAction "hammerthrower.swf". The original pairs a short
   embedded video of an athlete throwing the hammer with a BinarySystemComponent
   animation; the video cannot be carried over, so the left panel here draws the
   same thing — an athlete and hammer turning about their common centre of mass.

   The right panel is the SWF's own component, with its own numbers: mass1 6.2,
   mass2 1.2, radius1 1, radius2 0.6, separation 11, e 0, theta 36, phi 35, the
   window rotated −20°, and the phase advancing 1/23 of a turn per frame.      */
Sim.create({
  id: "hammerthrower",
  width: 830, height: 420,
  strings: {
    en: {
      "ht.ctl": "Animation", "ht.rate": "speed", "ht.com": "mark the centre of mass",
      "ht.athlete": "hammer thrower", "ht.system": "star and planet",
      "ht.rRatio": "mass ratio", "ht.rOrbits": "orbit sizes", "ht.rPhase": "phase",
      "ht.hint": "Both panels turn about the point where the two masses balance. The heavier body barely moves; the lighter one does the travelling.",
      "ht.comLabel": "centre of mass"
    },
    id: {
      "ht.ctl": "Animasi", "ht.rate": "kecepatan", "ht.com": "tandai pusat massa",
      "ht.athlete": "pelempar martil", "ht.system": "bintang dan planet",
      "ht.rRatio": "nisbah massa", "ht.rOrbits": "ukuran orbit", "ht.rPhase": "fase",
      "ht.hint": "Kedua panel berputar mengelilingi titik tempat kedua massa seimbang. Benda yang lebih berat nyaris tak bergerak; yang lebih ringan menempuh jarak jauh.",
      "ht.comLabel": "pusat massa"
    }
  },
  about: {
    en: "<p>A hammer thrower and the ball do not spin about the athlete — they spin about the point where the two masses balance, which sits between them, much closer to the athlete because the athlete is heavier. The athlete leans back and traces a small circle while the ball sweeps a large one. That is why throwers look like they are being pulled off their feet: they are.</p>" +
        "<p>A star and its planet do exactly the same thing. The star does not sit still while the planet orbits it; both orbit their common centre of mass, with orbit sizes in inverse proportion to their masses. Jupiter is about a thousandth of the Sun's mass, so the Sun's circle is about a thousandth the size of Jupiter's — but it is not zero.</p>" +
        "<p>That small stellar wobble is how many exoplanets were first found. The star's motion towards and away from us shifts its spectral lines by the Doppler effect, and the size of the shift tells you the planet's mass. The analogy is exact: watch the athlete, not the ball.</p>",
    id: "<p>Pelempar martil dan bolanya tidak berputar mengelilingi sang atlet — keduanya berputar mengelilingi titik tempat kedua massa seimbang, yang terletak di antara mereka, jauh lebih dekat ke atlet karena atlet lebih berat. Atlet mencondongkan badan ke belakang dan menelusuri lingkaran kecil sementara bolanya menyapu lingkaran besar. Itulah sebabnya para pelempar tampak seperti hendak terseret: memang begitu.</p>" +
        "<p>Bintang dan planetnya melakukan hal yang persis sama. Bintang tidak diam sementara planet mengitarinya; keduanya mengorbit pusat massa bersama, dengan ukuran orbit berbanding terbalik dengan massanya. Jupiter kira-kira seperseribu massa Matahari, jadi lingkaran Matahari kira-kira seperseribu lingkaran Jupiter — tetapi bukan nol.</p>" +
        "<p>Goyangan kecil bintang itulah cara banyak planet luar surya pertama kali ditemukan. Gerak bintang mendekat dan menjauh menggeser garis spektrumnya lewat efek Doppler, dan besar pergeseran itu memberi tahu massa planetnya. Analoginya tepat: amati atletnya, bukan bolanya.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var FONT = "Verdana, Geneva, sans-serif";
    var L = { x: 10, y: 20, w: 395, h: 385 }, Rp = { x: 420, y: 20, w: 400, h: 385 };

    /* the SWF's own binary parameters */
    var M1 = 6.2, M2 = 1.2, RAD1 = 1, RAD2 = 0.6, SEP = 11, ECC = 0;
    var THETA = 36 * RAD, PHI = 35 * RAD, WINDOW_ROT = -20 * RAD;
    var A1 = SEP * M2 / (M1 + M2), A2 = SEP * M1 / (M1 + M2);
    var TARGET = 360;
    var SCALE = TARGET / (2 * Math.max(A1 * (1 + ECC) + RAD1, A2 * (1 + ECC) + RAD2));

    var phase = 0, rate = 1, showCom = true;

    S.group("ht.ctl");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ht.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var play = S.playPause(S.loop(function (dt) {
      phase = (phase + dt * rate * 0.28) % 1;             // animationRate 0.28 turns/s
      upd();
    }));
    S.slider({ labelKey: "ht.rate", min: 0.2, max: 3, value: 1, step: 0.1,
      format: function (v) { return v.toFixed(1) + "×"; }, on: function (v) { rate = v; } });
    S.toggle({ labelKey: "ht.com", value: true, on: function (b) { showCom = b; } });
    var outRatio = S.readout({ labelKey: "ht.rRatio" });
    var outOrbits = S.readout({ labelKey: "ht.rOrbits" });
    var outPhase = S.readout({ labelKey: "ht.rPhase" });
    play.el.click();                                      // the SWF starts running

    function upd() {
      outRatio("m₁ : m₂ = " + M1.toFixed(1) + " : " + M2.toFixed(1) +
        "  (" + (M1 / M2).toFixed(1) + "×)");
      outOrbits("a₁ : a₂ = 1 : " + (A2 / A1).toFixed(1));
      outPhase((phase * 360).toFixed(0) + "°");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* updatePositions(): Kepler's equation, then the doA projection */
    function positions() {
      var Mean = phase * TAU, E = Mean, i;
      for (i = 0; i < 100; i++) {
        var d = (Mean + ECC * Math.sin(E) - E) / (1 - ECC * Math.cos(E));
        E += d;
        if (Math.abs(d) < 0.001) break;
      }
      var nu = 2 * Math.atan(Math.sqrt((1 + ECC) / (1 - ECC)) * Math.tan(E / 2));
      var f = (1 - ECC * ECC) / (1 + ECC * Math.cos(nu));
      var cn = Math.cos(nu), sn = Math.sin(nu);
      return { nu: nu,
        p1: { x: -A1 * f * cn, y: -A1 * f * sn },
        p2: { x: A2 * f * cn, y: A2 * f * sn } };
    }
    var ct = Math.cos(THETA), st = Math.sin(THETA);
    var cp = Math.cos(PHI), sp = Math.sin(PHI);
    var A = { a0: -SCALE * st, a1: SCALE * ct,
      a3: SCALE * ct * sp, a4: SCALE * st * sp, a5: -SCALE * cp,
      a6: SCALE * ct * cp, a7: SCALE * st * cp, a8: SCALE * sp };
    function proj(p) {
      var x = p.x * A.a0 + p.y * A.a1;
      var y = p.x * A.a3 + p.y * A.a4;
      var z = p.x * A.a6 + p.y * A.a7;
      var c = Math.cos(WINDOW_ROT), s = Math.sin(WINDOW_ROT);
      return { x: x * c - y * s, y: x * s + y * c, z: z };
    }

    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      frame(ctx, L, tr("ht.athlete"));
      frame(ctx, Rp, tr("ht.system"));
      ctx.save(); ctx.beginPath(); ctx.rect(L.x, L.y, L.w, L.h); ctx.clip();
      thrower(ctx, tr); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(Rp.x, Rp.y, Rp.w, Rp.h); ctx.clip();
      binary(ctx, tr); ctx.restore();
    });
    function frame(ctx, P, title) {
      ctx.fillStyle = "#050505"; ctx.fillRect(P.x, P.y, P.w, P.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(P.x + 0.5, P.y + 0.5, P.w - 1, P.h - 1);
      ctx.fillStyle = "#bbbbbb"; ctx.font = "italic 12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(title, P.x + 8, P.y + 8);
    }

    /* ---- the right panel: the SWF's BinarySystemComponent ------------------ */
    function binary(ctx, tr) {
      var cx = Rp.x + Rp.w / 2, cy = Rp.y + Rp.h / 2;
      var P = positions();
      var s1 = proj(P.p1), s2 = proj(P.p2);
      ctx.save();
      ctx.translate(cx, cy);
      plane(ctx);
      orbit(ctx, A1, true); orbit(ctx, A2, true);          // the far halves
      var far = s1.z < s2.z ? [s1, 1] : [s2, 2];
      var near = s1.z < s2.z ? [s2, 2] : [s1, 1];
      body(ctx, far[0], far[1]);
      orbit(ctx, A1, false); orbit(ctx, A2, false);        // the near halves
      body(ctx, near[0], near[1]);
      if (showCom) {
        ctx.strokeStyle = "#5ad45a"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.moveTo(0, -7); ctx.lineTo(0, 7);
        ctx.stroke();
      }
      ctx.restore();
      if (showCom) {
        ctx.strokeStyle = "rgba(90,212,90,0.7)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx + 5, cy + 5); ctx.lineTo(cx + 40, cy + 40); ctx.stroke();
        ctx.fillStyle = "#5ad45a"; ctx.font = "11px " + FONT;
        ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText(tr("ht.comLabel"), cx + 43, cy + 34);
      }
    }
    function plane(ctx) {                                  // orbitalPlane, #b0b0b0 at 40 %
      var half = TARGET / 2 / SCALE * 1.02;
      ctx.save();
      ctx.beginPath();
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c, i) {
        var q = proj({ x: c[0] * half, y: c[1] * half });
        i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(176,176,176,0.40)"; ctx.fill();
      ctx.clip();
      ctx.strokeStyle = "rgba(90,160,90,0.55)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var k = -3; k <= 3; k++) {
        var u = k / 3 * half;
        var a = proj({ x: u, y: -half }), b = proj({ x: u, y: half });
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        a = proj({ x: -half, y: u }); b = proj({ x: half, y: u });
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
      ctx.restore();
    }
    function orbit(ctx, a, farHalf) {                      // white orbital paths
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.2;
      ctx.beginPath();
      var open = false;
      for (var i = 0; i <= 200; i++) {
        var nu = i / 200 * TAU;
        var f = (1 - ECC * ECC) / (1 + ECC * Math.cos(nu));
        var q = proj({ x: a * f * Math.cos(nu), y: a * f * Math.sin(nu) });
        if ((q.z < 0) !== farHalf) { open = false; continue; }
        if (!open) { ctx.moveTo(q.x, q.y); open = true; } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
    }
    function body(ctx, s, which) {
      var r = (which === 1 ? RAD1 : RAD2) * SCALE;
      var g = ctx.createRadialGradient(s.x - r * 0.3, s.y - r * 0.35, r * 0.1, s.x, s.y, r);
      if (which === 1) {                                   // the star, 4900 K warm white
        g.addColorStop(0, "#fffaf0"); g.addColorStop(0.6, "#fbe6c8"); g.addColorStop(1, "#e2b483");
      } else {
        g.addColorStop(0, "#f2f5ff"); g.addColorStop(0.6, "#cdd6f5"); g.addColorStop(1, "#98a6d8");
      }
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, TAU); ctx.fill();
    }

    /* ---- the left panel: the same motion, acted out by the athlete --------- */
    function thrower(ctx, tr) {
      var cx = L.x + L.w / 2, cy = L.y + L.h / 2 + 48;
      /* Both halves of this sim are one motion, so drive the athlete from the
         very same projection as the binary rather than from a separate circle:
         that fixes the sense (the orbit runs counter-clockwise on screen, the
         old cos/sin pair ran clockwise) and keeps the two exactly in phase.  */
      var pp = positions(), bp = proj(pp.p2), ap = proj(pp.p1);
      var RB = 136, k = RB / (A2 * SCALE);
      var bx = cx + bp.x * k, by = cy + bp.y * k;
      var ax = cx + ap.x * k, ay = cy + ap.y * k;
      function ring(r, a) {                                // the projected orbit
        ctx.beginPath();
        for (var i = 0; i <= 96; i++) {
          var nu = i * TAU / 96;
          var q = proj({ x: r * Math.cos(nu), y: r * Math.sin(nu) });
          i ? ctx.lineTo(cx + q.x * k, cy + q.y * k) : ctx.moveTo(cx + q.x * k, cy + q.y * k);
        }
        ctx.closePath();
        void a;
      }
      // the throwing circle
      ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 2;
      ring(A2 * 1.18); ctx.stroke();
      ctx.fillStyle = "#171a12";
      ring(A2 * 1.18); ctx.fill();
      // the two paths
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1;
      ring(A2); ctx.stroke();
      ring(A1); ctx.stroke();
      // the wire
      ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ax, ay - 62); ctx.lineTo(bx, by); ctx.stroke();
      // the athlete, leaning away from the ball
      var lean = (ax - bx) / RB * 9;                       // lean away from the ball
      ctx.save();
      ctx.translate(ax, ay);
      ctx.scale(1.35, 1.35);
      ctx.strokeStyle = "#e8483c"; ctx.lineWidth = 7; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(lean, -52); ctx.stroke();
      ctx.strokeStyle = "#dddddd"; ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -18); ctx.lineTo(-7, 0);
      ctx.moveTo(0, -18); ctx.lineTo(7, 0);
      ctx.stroke();
      ctx.strokeStyle = "#e8483c"; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(lean, -46);
      ctx.lineTo(lean + (bx - ax) * 0.16, -46 + (by - ay) * 0.16);
      ctx.stroke();
      ctx.fillStyle = "#f0d0a8";
      ctx.beginPath(); ctx.arc(lean * 1.2, -60, 7, 0, TAU); ctx.fill();
      ctx.restore();
      // the hammer
      /* the ball sits ON its own path — it used to be lifted 30px clear of the
         ground plane, which left it floating off the ellipse it traces       */
      var g = ctx.createRadialGradient(bx - 5, by - 5, 2, bx, by, 14);
      g.addColorStop(0, "#f0f0f0"); g.addColorStop(1, "#8a8a8a");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(bx, by, 14, 0, TAU); ctx.fill();
      if (showCom) {
        ctx.strokeStyle = "#5ad45a"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 7, cy); ctx.lineTo(cx + 7, cy);
        ctx.moveTo(cx, cy - 7); ctx.lineTo(cx, cy + 7);
        ctx.stroke();
        ctx.fillStyle = "#5ad45a"; ctx.font = "11px " + FONT;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(tr("ht.comLabel"), cx, cy + RB * 0.42 + 14);
      }
    }

    upd();
  }
});
