/* Phase Positions Demonstrator ---------------------------------------------------
   Faithful rebuild of the ClassAction "phaseDemonstrator.swf" (PhaseDemonstratorClass,
   decompiled). Two worlds orbit a star; drag either one and the two panels show how
   each looks from the other. The lit fraction depends only on the angle at the
   observed body between its star and its observer — the phase angle.

   Drop one world within 42 px of the other and it becomes its moon, 30 px away,
   exactly as the original does, and the panel titles change to match.          */
Sim.create({
  id: "phaseDemonstrator",
  width: 745, height: 515,
  strings: {
    en: {
      "pd.opt": "Options", "pd.orbits": "show orbits", "pd.keep": "keep each body on its orbit",
      "pd.reset": "Reset", "pd.panel": "Disc Appearances",
      "pd.hint": "Drag either body. Hold Shift (or tick the box) to slide it round its orbit; drop one close to the other to make it a moon.",
      "pd.p1": "planet 1", "pd.p2": "planet 2", "pd.m1": "moon 1", "pd.m2": "moon 2", "pd.seen": " as seen from ",
      "pd.rPhase1": "1 seen from 2", "pd.rPhase2": "2 seen from 1", "pd.rSep": "separation",
      "pd.full": "full", "pd.gibbous": "gibbous", "pd.quarter": "quarter", "pd.crescent": "crescent", "pd.new": "new"
    },
    id: {
      "pd.opt": "Pilihan", "pd.orbits": "tampilkan orbit", "pd.keep": "tahan setiap benda pada orbitnya",
      "pd.reset": "Atur ulang", "pd.panel": "Tampak Cakram",
      "pd.hint": "Seret salah satu benda. Tahan Shift (atau centang kotak) untuk menggesernya sepanjang orbit; dekatkan satu ke yang lain untuk menjadikannya bulan.",
      "pd.p1": "planet 1", "pd.p2": "planet 2", "pd.m1": "bulan 1", "pd.m2": "bulan 2", "pd.seen": " dilihat dari ",
      "pd.rPhase1": "1 dari 2", "pd.rPhase2": "2 dari 1", "pd.rSep": "pemisahan",
      "pd.full": "purnama", "pd.gibbous": "cembung", "pd.quarter": "separuh", "pd.crescent": "sabit", "pd.new": "baru"
    }
  },
  about: {
    en: "<p>Phases are a matter of viewing angle. Half of any sunlit world is always lit; how much of that lit half you can see depends on where you stand. Put the observer almost behind the object, looking at its night side, and you see a thin crescent; stand opposite the star and the whole lit face is turned your way — full.</p>" +
        "<p>The angle that matters is measured <em>at the observed body</em>, between the direction to the star and the direction to the observer. That single number sets the phase, and the panels here compute it from the two positions alone: no orbits, speeds or masses required.</p>" +
        "<p>Notice what happens when you make one body a moon of the other. The pair now sits at nearly the same place in the system, so both see almost the same phase angle from the star — but they see <em>each other</em> at opposite phases: when one is full to the other, the second is new. That is exactly the relationship between the Moon's phases and the Earth's phases as seen from the Moon.</p>",
    id: "<p>Fase adalah soal sudut pandang. Separuh dari setiap dunia yang disinari selalu terang; seberapa banyak bagian terang itu yang tampak bergantung pada tempat Anda berdiri. Tempatkan pengamat hampir di belakang objek, menghadap sisi malamnya, dan Anda melihat sabit tipis; berdirilah di seberang bintang dan seluruh muka terangnya menghadap Anda — purnama.</p>" +
        "<p>Sudut yang menentukan diukur <em>di benda yang diamati</em>, antara arah ke bintang dan arah ke pengamat. Satu angka itu menetapkan fasenya, dan panel di sini menghitungnya hanya dari kedua posisi: tanpa perlu orbit, laju, atau massa.</p>" +
        "<p>Perhatikan yang terjadi ketika satu benda dijadikan bulan bagi yang lain. Pasangan itu kini berada nyaris di tempat yang sama dalam sistem, sehingga keduanya melihat sudut fase yang hampir sama terhadap bintang — tetapi keduanya saling melihat pada fase berlawanan: saat yang satu purnama bagi yang lain, yang kedua justru baru. Persis seperti hubungan fase Bulan dengan fase Bumi yang dilihat dari Bulan.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var OY = -30;
    var FONT = "Verdana, Geneva, sans-serif";
    var FIELD = { x: 260, y: 285 + OY, half: 253 };           // activeAreaMC, a 506 px black square
    var PANEL = { x: 520, y: 32 + OY, w: 218, h: 506 };
    var DISC = [{ x: 629, y: 219 + OY, light: "#ffe0e0", dark: "#604040" },
                { x: 629, y: 429 + OY, light: "#e0e0ff", dark: "#404060" }];
    var R_DISC = 70, R_PLANET = 6;
    var MOON_D = 30, SNAP_D = 42, SUN_SEP = 50, MARGIN = 20;
    var LIMIT = FIELD.half - R_PLANET - MARGIN;
    var COL = [{ disc: "#ff9090", orbit: "#ffa0a0" }, { disc: "#9090ff", orbit: "#8c8db3" }];

    // positions are relative to the star, in the SWF's own starting places
    var P = [{ x: 100, y: -160, r: 0, state: 0 }, { x: 120, y: -40, r: 0, state: 0 }];
    P.forEach(function (p) { p.r = Math.hypot(p.x, p.y); });
    var showOrbits = true, keepOrbit = false, drag = -1, shift = false;

    S.group("pd.opt");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "pd.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.toggle({ labelKey: "pd.orbits", value: true, on: function (v) { showOrbits = v; S.requestDraw(); } });
    S.toggle({ labelKey: "pd.keep", value: false, on: function (v) { keepOrbit = v; } });
    S.button({
      labelKey: "pd.reset", on: function () {
        P[0] = { x: 100, y: -160, r: Math.hypot(100, -160), state: 0 };
        P[1] = { x: 120, y: -40, r: Math.hypot(120, -40), state: 0 };
        upd();
      }
    });
    var outPhase1 = S.readout({ labelKey: "pd.rPhase1" });
    var outPhase2 = S.readout({ labelKey: "pd.rPhase2" });
    var outSep = S.readout({ labelKey: "pd.rSep" });

    /* ---- updatePhases: the phase angle at each body ---- */
    function phases() {
      var r1 = Math.hypot(P[0].x, P[0].y), r2 = Math.hypot(P[1].x, P[1].y);
      var a1 = Math.atan2(P[0].y, P[0].x), a2 = Math.atan2(P[1].y, P[1].x);
      var theta = TAU * ((((a1 - a2) / TAU) % 1 + 1) % 1);
      var ct = Math.cos(theta);
      var d = Math.sqrt(r1 * r1 + r2 * r2 - 2 * r1 * r2 * ct);
      var cb1 = Math.max(-1, Math.min(1, (r1 - r2 * ct) / d));
      var cb2 = Math.max(-1, Math.min(1, (r2 - r1 * ct) / d));
      var b1 = Math.acos(cb1), b2 = Math.acos(cb2);
      return theta < Math.PI ? { a1: b1, a2: TAU - b2, d: d } : { a1: TAU - b1, a2: b2, d: d };
    }
    function phaseName(a) {
      var f = (1 + Math.cos(a)) / 2;                          // lit fraction
      return I18N.t(f > 0.97 ? "pd.full" : f > 0.6 ? "pd.gibbous" : f > 0.4 ? "pd.quarter" : f > 0.03 ? "pd.crescent" : "pd.new");
    }
    function upd() {
      var ph = phases();
      outPhase1(phaseName(ph.a1) + " · " + Math.round((1 + Math.cos(ph.a1)) / 2 * 100) + "%");
      outPhase2(phaseName(ph.a2) + " · " + Math.round((1 + Math.cos(ph.a2)) / 2 * 100) + "%");
      outSep(Math.round(ph.d) + " px");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- setPlanetPosition: limits, the minimum star distance, and moon snapping ---- */
    function setPlanet(i, x, y) {
      var me = P[i], other = P[1 - i];
      if ((shift || keepOrbit) && me.state >= 0) {             // slide along the existing orbit
        var a = Math.atan2(y, x);
        x = me.r * Math.cos(a); y = me.r * Math.sin(a);
      }
      var out = false;
      if (x < -LIMIT) { x = -LIMIT; out = true; } else if (x > LIMIT) { x = LIMIT; out = true; }
      if (y < -LIMIT) { y = -LIMIT; out = true; } else if (y > LIMIT) { y = LIMIT; out = true; }
      if (Math.hypot(x, y) < SUN_SEP) {                        // never inside the star
        var a2 = Math.atan2(y, x);
        x = SUN_SEP * Math.cos(a2); y = SUN_SEP * Math.sin(a2);
      }
      var dx = x - other.x, dy = y - other.y;
      if (me.state === 1) {                                    // I host a moon: it comes along
        var am = Math.atan2(-dy, -dx);
        other.x = x + MOON_D * Math.cos(am);
        other.y = y + MOON_D * Math.sin(am);
      } else {
        var dist = Math.hypot(dx, dy);
        if (dist < SNAP_D && !(shift || keepOrbit)) {          // become its moon
          var a3 = Math.atan2(dy, dx);
          x = other.x + MOON_D * Math.cos(a3);
          y = other.y + MOON_D * Math.sin(a3);
          me.state = -1; other.state = 1;
        } else if (me.state !== -1 || dist >= SNAP_D) {
          me.state = 0; other.state = 0;
        }
      }
      me.x = x; me.y = y;
      if (out && me.state >= 0) me.r = Math.hypot(x, y);
      if (me.state >= 0) me.r = Math.hypot(x, y);
      upd();
    }

    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return {
        x: (ev.clientX - r.left) * S.W / r.width - FIELD.x,
        y: (ev.clientY - r.top) * S.H / r.height - FIELD.y
      };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      shift = ev.shiftKey;
      for (var i = 0; i < 2; i++) if (Math.hypot(p.x - P[i].x, p.y - P[i].y) < 14) { drag = i; break; }
      if (drag >= 0) { S.canvas.setPointerCapture(ev.pointerId); setPlanet(drag, p.x, p.y); }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (drag < 0) return;
      shift = ev.shiftKey;
      var p = at(ev);
      setPlanet(drag, p.x, p.y);
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = -1; });
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#000000";
      ctx.fillRect(FIELD.x - FIELD.half, FIELD.y - FIELD.half, 2 * FIELD.half, 2 * FIELD.half);

      ctx.save();
      ctx.translate(FIELD.x, FIELD.y);
      if (showOrbits) {
        ctx.lineWidth = 1;
        P.forEach(function (p, i) {
          var o = P[1 - i];
          ctx.strokeStyle = COL[i].orbit;
          ctx.beginPath();
          if (p.state < 0) ctx.arc(o.x, o.y, MOON_D, 0, TAU);
          else ctx.arc(0, 0, Math.hypot(p.x, p.y), 0, TAU);
          ctx.stroke();
        });
      }
      var g = ctx.createRadialGradient(0, 0, 1, 0, 0, 26);     // the star
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.25, "#ffe89a");
      g.addColorStop(0.6, "rgba(255,196,60,0.45)"); g.addColorStop(1, "rgba(255,170,30,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill();
      ctx.fillStyle = "#fff6c0"; ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fill();

      var lab = Math.atan2(P[1].y - P[0].y, P[1].x - P[0].x);  // labels face away from each other
      P.forEach(function (p, i) {
        ctx.fillStyle = COL[i].disc;
        ctx.beginPath(); ctx.arc(p.x, p.y, R_PLANET, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1; ctx.stroke();
        var a = i === 0 ? lab + Math.PI : lab;
        ctx.fillStyle = "#ffffff"; ctx.font = "12px " + FONT;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), p.x + 14 * Math.cos(a), p.y + 14 * Math.sin(a));
      });
      ctx.restore();

      ctx.fillStyle = "#fafafa"; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(PANEL.x + 0.5, PANEL.y + 0.5, PANEL.w - 1, PANEL.h - 1);
      ctx.fillStyle = "#333333"; ctx.font = "12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(t("pd.panel"), PANEL.x + 8, PANEL.y + 12);
      ctx.strokeStyle = "#cccccc";
      ctx.beginPath();
      ctx.moveTo(PANEL.x + 12 + ctx.measureText(t("pd.panel")).width, PANEL.y + 12);
      ctx.lineTo(PANEL.x + PANEL.w - 8, PANEL.y + 12); ctx.stroke();

      var ph = phases();
      var n1 = t(P[0].state < 0 ? "pd.m1" : "pd.p1"), n2 = t(P[1].state < 0 ? "pd.m2" : "pd.p2");
      [[ph.a1, n1 + t("pd.seen") + n2, 0], [ph.a2, n2 + t("pd.seen") + n1, 1]].forEach(function (d) {
        var D = DISC[d[2]];
        ctx.fillStyle = "#ffffff"; ctx.fillRect(D.x - 84, D.y - 100, 168, 190);
        ctx.strokeStyle = "#aaaaaa"; ctx.strokeRect(D.x - 84.5, D.y - 100.5, 169, 191);
        ctx.fillStyle = "#333333"; ctx.font = "11px " + FONT;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(d[1], D.x, D.y - 94);
        phaseDisc(ctx, D, d[0]);
      });
    });

    // setPhaseAngle: a dark disc, the lit half, and a terminator ellipse of x-radius r·cos(angle)
    function phaseDisc(ctx, D, angle) {
      angle = ((angle % TAU) + TAU) % TAU;
      var sign = angle < Math.PI ? -1 : 1;
      var s = R_DISC * Math.cos(angle);
      ctx.save();
      ctx.translate(D.x, D.y + 8);
      ctx.fillStyle = D.dark;
      ctx.beginPath(); ctx.arc(0, 0, R_DISC, 0, TAU); ctx.fill();
      ctx.fillStyle = D.light;
      ctx.beginPath();
      ctx.arc(0, 0, R_DISC, -Math.PI / 2, Math.PI / 2, sign > 0);
      ctx.ellipse(0, 0, Math.abs(s), R_DISC, 0, Math.PI / 2, -Math.PI / 2, sign * s > 0);
      ctx.fill();
      ctx.strokeStyle = "#888888"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, R_DISC, 0, TAU); ctx.stroke();
      ctx.restore();
    }

    upd();
  }
});
