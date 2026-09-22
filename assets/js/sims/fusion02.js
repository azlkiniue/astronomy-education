/* CNO Cycle Animation -----------------------------------------------------------
   Rebuild of the ClassAction "fusion02.swf" — a timeline movie with no
   ActionScript model, so this reproduces its diagram: the six steps of the
   carbon-nitrogen-oxygen cycle cascading down the stage, with the same particle
   key, revealed one reaction at a time.                                        */
Sim.create({
  id: "fusion02",
  width: 550, height: 550,
  strings: {
    en: {
      "cno.ctl": "Animation", "cno.start": "start animation", "cno.pause": "pause animation",
      "cno.reset": "reset animation", "cno.rate": "speed",
      "cno.proton": "Proton", "cno.neutron": "Neutron", "cno.positron": "Positron",
      "cno.gamma": "Gamma ray", "cno.neutrino": "Neutrino",
      "cno.rStep": "step", "cno.rNet": "net reaction",
      "cno.s0": "waiting to start",
      "cno.s1": "carbon-12 captures a proton → nitrogen-13",
      "cno.s2": "nitrogen-13 decays → carbon-13",
      "cno.s3": "carbon-13 captures a proton → nitrogen-14",
      "cno.s4": "nitrogen-14 captures a proton → oxygen-15",
      "cno.s5": "oxygen-15 decays → nitrogen-15",
      "cno.s6": "nitrogen-15 captures a proton → carbon-12 + helium-4",
      "cno.s7": "the carbon-12 travels back to start the cycle again",
      "cno.done": "cycle complete — the carbon is back"
    },
    id: {
      "cno.ctl": "Animasi", "cno.start": "mulai animasi", "cno.pause": "jeda animasi",
      "cno.reset": "atur ulang animasi", "cno.rate": "kecepatan",
      "cno.proton": "Proton", "cno.neutron": "Neutron", "cno.positron": "Positron",
      "cno.gamma": "Sinar gama", "cno.neutrino": "Neutrino",
      "cno.rStep": "tahap", "cno.rNet": "reaksi total",
      "cno.s0": "menunggu dimulai",
      "cno.s1": "karbon-12 menangkap proton → nitrogen-13",
      "cno.s2": "nitrogen-13 meluruh → karbon-13",
      "cno.s3": "karbon-13 menangkap proton → nitrogen-14",
      "cno.s4": "nitrogen-14 menangkap proton → oksigen-15",
      "cno.s5": "oksigen-15 meluruh → nitrogen-15",
      "cno.s6": "nitrogen-15 menangkap proton → karbon-12 + helium-4",
      "cno.s7": "karbon-12 kembali untuk memulai siklus lagi",
      "cno.done": "siklus selesai — karbonnya kembali"
    }
  },
  about: {
    en: "<p>The CNO cycle is the other way stars turn hydrogen into helium. Carbon-12 acts as a catalyst: it absorbs four protons one at a time, passing through nitrogen and oxygen, and at the end spits out a helium-4 nucleus and the original carbon, ready to go round again. Nothing is used up but the hydrogen.</p>" +
        "<p>Two of the steps are beta decays. Nitrogen-13 and oxygen-15 are unstable, and each converts a proton into a neutron, emitting a positron and a neutrino. The rest are proton captures that release gamma rays.</p>" +
        "<p>Which cycle dominates depends almost entirely on temperature. The proton-proton chain scales roughly as T⁴, but the CNO cycle has to push protons into a nucleus with six times the charge, so it scales as about T¹⁷. Below roughly 17 million K the p-p chain wins; above it the CNO cycle takes over. The Sun's core, at 15.7 million K, sits just below the crossover and gets only a percent or so of its energy this way — but stars much heavier than the Sun run almost entirely on CNO.</p>",
    id: "<p>Siklus CNO adalah cara lain bintang mengubah hidrogen menjadi helium. Karbon-12 berperan sebagai katalis: ia menyerap empat proton satu per satu, melewati nitrogen dan oksigen, dan di akhir mengeluarkan satu inti helium-4 beserta karbon semula, siap berputar lagi. Tak ada yang habis kecuali hidrogennya.</p>" +
        "<p>Dua dari langkahnya adalah peluruhan beta. Nitrogen-13 dan oksigen-15 tidak stabil, dan masing-masing mengubah satu proton menjadi neutron sambil memancarkan positron dan neutrino. Sisanya adalah penangkapan proton yang melepaskan sinar gama.</p>" +
        "<p>Siklus mana yang dominan hampir sepenuhnya bergantung pada suhu. Rantai proton-proton meningkat kira-kira sebanding T⁴, tetapi siklus CNO harus mendorong proton masuk ke inti bermuatan enam kali lipat, sehingga sebanding kira-kira T¹⁷. Di bawah sekitar 17 juta K rantai p-p menang; di atasnya siklus CNO mengambil alih. Inti Matahari, pada 15,7 juta K, berada tepat di bawah titik silang itu dan hanya memperoleh sekitar satu persen energinya dari jalur ini — tetapi bintang yang jauh lebih berat dari Matahari berjalan hampir seluruhnya dengan CNO.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var SERIF = "Georgia, 'Times New Roman', serif";
    var P = "#3f62c4", N = "#d83a3a", POS = "#d9a92e", GAM = "#7fd4f0", NU = "#e02020";
    var RR = 19.5, PR = 13;                        // measured off the SWF recording
    /* Every node's place on the 550 × 550 stage, read off the original. The
       cycle walks down and to the right in four captures, with two beta decays
       dropping straight down, and a long arc carrying carbon-12 back.        */
    var Q = {
      c12: [38, 46], h1: [38, 140], s1: [89, 94], n13: [158, 93],
      e1: [101, 164], c13: [158, 172],
      h2: [158, 291], s2: [215, 233], n14: [278, 232],
      h3: [278, 351], s3: [335, 294], o15: [399, 291],
      e2: [344, 367], n15: [399, 377],
      h4: [399, 497], s4: [456, 438], he4: [519, 492], c12b: [519, 392]
    };

    var t = 0, rate = 1, STEPS = 7;             // six reactions, then the return
    S.group("cno.ctl");
    var playBtn = S.button({ label: "", primary: true, on: function () {
      if (loop.playing) loop.pause(); else { if (t >= STEPS) t = 0; loop.play(); }
      sync();
    } });
    S.button({ labelKey: "cno.reset", on: function () { loop.pause(); t = 0; sync(); upd(); } });
    S.slider({ labelKey: "cno.rate", min: 0.3, max: 3, value: 1, step: 0.1,
      format: function (v) { return v.toFixed(1) + "×"; }, on: function (v) { rate = v; } });
    var outStep = S.readout({ labelKey: "cno.rStep" });
    var outNet = S.readout({ labelKey: "cno.rNet" });

    var loop = S.loop(function (dt) {
      t = Math.min(STEPS, t + dt * rate * 0.55);
      if (t >= STEPS) { loop.pause(); sync(); }
      upd();
    });
    function sync() { playBtn.textContent = I18N.t(loop.playing ? "cno.pause" : "cno.start"); }
    function upd() {
      /* t is now 0-6 with each whole number one finished reaction, so the step
         in progress is floor(t) + 1 — s0 is only the idle state             */
      var k = t >= STEPS ? "cno.done" : (t === 0 ? "cno.s0" : "cno.s" + (Math.floor(t) + 1));
      outStep(I18N.t(k));
      outNet("4 ¹H → ⁴He + 2e⁺ + 2ν + 26.7 MeV");
      S.requestDraw();
    }
    S.refreshers.push(function () { sync(); upd(); });

    function ball(ctx, x, y, colour, r) {
      r = r || RR;
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, lighten(colour, 0.55)); g.addColorStop(0.65, colour);
      g.addColorStop(1, lighten(colour, -0.35));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = lighten(colour, -0.5); ctx.lineWidth = 0.8; ctx.stroke();
    }
    function lighten(hex, k) {
      var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
      function f(v) { return Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); }
      return "rgb(" + f(r) + "," + f(g) + "," + f(b) + ")";
    }
    /* The SWF draws each nucleus as a single sphere — red for everything in the
       cycle, blue only for the incoming protons — rather than as a cluster of
       nucleons. The cluster version was the main thing that made this diagram
       read differently from the original.                                   */
    function nucleus(ctx, at, label, lx, ly, isProton) {
      ball(ctx, at[0], at[1], isProton ? P : N, RR);
      if (!label) return;
      var m = /^(\d+)(.+)$/.exec(label);
      ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.font = "14px " + SERIF;
      ctx.fillText(m[1], at[0] + lx, at[1] + ly - 9);
      var w = ctx.measureText(m[1]).width;
      ctx.font = "23px " + SERIF;
      ctx.fillText(m[2], at[0] + lx + w + 1, at[1] + ly);
    }
    /* The arc that closes the cycle. In the SWF it is drawn from the starting
       carbon outward, and only then does a carbon-12 ride back along it to the
       top left — which is the bit that was missing.                          */
    var ARC = [[62, 34], [360, 18], [556, 150], [539, 384]];
    function arcPt(u) {
      var v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
      return [a * ARC[0][0] + b * ARC[1][0] + c * ARC[2][0] + d * ARC[3][0],
        a * ARC[0][1] + b * ARC[1][1] + c * ARC[2][1] + d * ARC[3][1]];
    }
    function cycleArc(ctx, upTo) {
      if (upTo === undefined) upTo = 1;
      if (upTo <= 0.01) return;
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1.6; ctx.setLineDash([]);
      ctx.beginPath();
      for (var i = 0; i <= 64; i++) {
        var p = arcPt(upTo * i / 64);
        i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
    }
    function arrow(ctx, x1, y1, x2, y2) {
      var a = Math.atan2(y2 - y1, x2 - x1), L = 17, W = 0.33;
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 3; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x1, y1);
      ctx.lineTo(x2 - Math.cos(a) * L * 0.85, y2 - Math.sin(a) * L * 0.85);
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - Math.cos(a - W) * L, y2 - Math.sin(a - W) * L);
      ctx.lineTo(x2 - Math.cos(a + W) * L, y2 - Math.sin(a + W) * L);
      ctx.closePath(); ctx.fill();
    }
    function dashed(ctx, x1, y1, x2, y2) {
      ctx.strokeStyle = NU; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#000000"; ctx.font = "italic 14px Georgia, serif";
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText("ν", x2 + 4, y2 + 4);
    }
    function wave(ctx, x1, y1, x2, y2, showLabel) {
      var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
      ctx.save(); ctx.translate(x1, y1); ctx.rotate(a);
      ctx.strokeStyle = GAM; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0);
      for (var i = 0; i <= L; i += 1.5) ctx.lineTo(i, Math.sin(i / 13) * 7);
      ctx.stroke(); ctx.restore();
      if (showLabel) {
        ctx.fillStyle = "#000000"; ctx.font = "italic 26px " + SERIF;
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText("\u03b3", x2 + 5, y2 - 3);
      }
    }
    /* the burst: about 21 units across in the original, half a nucleus wide */
    function flash(ctx, x, y) {
      ctx.fillStyle = "#ffe800"; ctx.strokeStyle = "#d8d8d8"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (var i = 0; i < 20; i++) {
        var a = i * Math.PI / 10 - 0.25, r = i % 2 ? 4.5 : 12;
        i ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
          : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    /* the cascade, running down and to the right as the SWF draws it, with the
       carbon returning along the arc.

       The original does not simply reveal each stage: a copy of each reactant
       travels along its arrow into the reaction point while the arrow grows
       behind it, the burst fires when they meet, and the product then travels
       out to its resting place. The nuclei already on the diagram stay put —
       what moves is the copy.                                               */
    function dir(a, b, gapA, gapB) {                // trim an arrow to the spheres
      var d = Math.atan2(b[1] - a[1], b[0] - a[0]);
      return [a[0] + Math.cos(d) * gapA, a[1] + Math.sin(d) * gapA,
        b[0] - Math.cos(d) * gapB, b[1] - Math.sin(d) * gapB];
    }
    function lerpPt(a, b, u) {
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    }
    function link(ctx, a, b, u) {                   // an arrow, optionally part-drawn
      var v = dir(a, b, RR + 3, RR + 4);
      if (u === undefined) u = 1;
      if (u <= 0.03) return;
      arrow(ctx, v[0], v[1], v[0] + (v[2] - v[0]) * u, v[1] + (v[3] - v[1]) * u);
    }
    function outLink(ctx, star, b, u) {
      var v = dir(star, b, 14, RR + 4);
      if (u === undefined) u = 1;
      if (u <= 0.03) return;
      arrow(ctx, v[0], v[1], v[0] + (v[2] - v[0]) * u, v[1] + (v[3] - v[1]) * u);
    }
    function gammaAt(ctx, star, u) {
      if (u <= 0.05) return;
      wave(ctx, star[0] + 12, star[1] - 12,
        star[0] + 12 + 50 * u, star[1] - 12 - 34 * u, u > 0.85);
    }
    /* a proton capture. u < 1 animates it; u >= 1 leaves the finished picture */
    function capture(ctx, heavy, proton, star, out, label, lx, ly, u) {
      if (u >= 1) {
        link(ctx, heavy, star); link(ctx, proton, star);
        outLink(ctx, star, out);
        gammaAt(ctx, star, 1);
        flash(ctx, star[0], star[1]);
        nucleus(ctx, out, label, lx, ly);
        return;
      }
      var inU = Math.min(1, u / 0.55), outU = Math.max(0, (u - 0.7) / 0.3);
      link(ctx, heavy, star, inU); link(ctx, proton, star, inU);
      if (u < 0.62) {                               // the copies running in
        ball(ctx, lerpPt(heavy, star, inU)[0], lerpPt(heavy, star, inU)[1], N, RR);
        ball(ctx, lerpPt(proton, star, inU)[0], lerpPt(proton, star, inU)[1], P, RR);
      }
      if (u > 0.5) flash(ctx, star[0], star[1]);
      if (outU > 0) {                               // and the product running out
        outLink(ctx, star, out, outU);
        gammaAt(ctx, star, outU);
        var q = lerpPt(star, out, outU);
        ball(ctx, q[0], q[1], N, RR);
        if (outU > 0.9) nucleus(ctx, out, label, lx, ly);
      }
    }
    /* a beta-plus decay: the parent drops to the daughter, shedding a positron */
    function decay(ctx, from, to, pos, label, lx, ly, u) {
      var mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
      function tail(k) {
        arrow(ctx, mid[0] - 2, mid[1], lerpPt(mid, [pos[0] + PR + 4, pos[1] - 6], k)[0],
          lerpPt(mid, [pos[0] + PR + 4, pos[1] - 6], k)[1]);
        ctx.strokeStyle = NU; ctx.lineWidth = 2.6; ctx.setLineDash([9, 7]);
        ctx.beginPath(); ctx.moveTo(mid[0] + 6, mid[1] - 4);
        ctx.lineTo(mid[0] + 6 + 46 * k, mid[1] - 4 - 18 * k); ctx.stroke();
        ctx.setLineDash([]);
      }
      if (u >= 1) {
        link(ctx, from, to);
        tail(1);
        ball(ctx, pos[0], pos[1], POS, PR);
        nucleus(ctx, to, label, lx, ly);
        return;
      }
      var dU = Math.min(1, u / 0.6), sU = Math.max(0, (u - 0.5) / 0.5);
      link(ctx, from, to, dU);
      var q = lerpPt(from, to, dU);
      ball(ctx, q[0], q[1], N, RR);
      if (sU > 0) {
        tail(sU);
        var e = lerpPt([mid[0] - 6, mid[1] + 4], pos, sU);
        ball(ctx, e[0], e[1], POS, PR);
      }
      if (dU > 0.95) nucleus(ctx, to, label, lx, ly);
    }
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 550, 550);
      ctx.lineJoin = "round";
      var done = Math.floor(t), u = t - done;       // whole steps, then the current one
      function at(i) { return i < done ? 1 : (i === done ? u : 0); }
      /* stage 7: the arc grows, then the carbon travels it back to the start */
      var back = at(6);
      if (back > 0) {
        cycleArc(ctx, Math.min(1, back / 0.45));
        if (back > 0.45 && back < 1) {
          var k = Math.min(1, (back - 0.45) / 0.55);
          var q = arcPt(1 - k);
          ball(ctx, q[0], q[1], N, RR);
        }
      }
      nucleus(ctx, Q.c12, "12C", -34, 34);
      if (at(0) > 0) {
        nucleus(ctx, Q.h1, "1H", -18, 36, true);
        capture(ctx, Q.c12, Q.h1, Q.s1, Q.n13, "13N", 26, -18, at(0));
      }
      if (at(1) > 0) decay(ctx, Q.n13, Q.c13, Q.e1, "13C", -36, 32, at(1));
      if (at(2) > 0) {
        nucleus(ctx, Q.h2, "1H", -18, 36, true);
        capture(ctx, Q.c13, Q.h2, Q.s2, Q.n14, "14N", 26, -18, at(2));
      }
      if (at(3) > 0) {
        nucleus(ctx, Q.h3, "1H", -18, 36, true);
        capture(ctx, Q.n14, Q.h3, Q.s3, Q.o15, "15O", 26, -18, at(3));
      }
      if (at(4) > 0) decay(ctx, Q.o15, Q.n15, Q.e2, "15N", -36, 32, at(4));
      if (at(5) > 0) {                              // the last capture splits in two
        var v = at(5);
        nucleus(ctx, Q.h4, "1H", -18, 36, true);
        var inU = Math.min(1, v / 0.55), outU = Math.max(0, (v - 0.7) / 0.3);
        link(ctx, Q.n15, Q.s4, inU); link(ctx, Q.h4, Q.s4, inU);
        if (v < 0.62 && v < 1) {
          var a1 = lerpPt(Q.n15, Q.s4, inU), b1 = lerpPt(Q.h4, Q.s4, inU);
          ball(ctx, a1[0], a1[1], N, RR); ball(ctx, b1[0], b1[1], P, RR);
        }
        if (v > 0.5) flash(ctx, Q.s4[0], Q.s4[1]);
        if (outU > 0) {
          outLink(ctx, Q.s4, Q.he4, outU); outLink(ctx, Q.s4, Q.c12b, outU);
          var p1 = lerpPt(Q.s4, Q.he4, outU), p2 = lerpPt(Q.s4, Q.c12b, outU);
          ball(ctx, p1[0], p1[1], N, RR); ball(ctx, p2[0], p2[1], N, RR);
          if (outU > 0.9) {
            nucleus(ctx, Q.c12b, "12C", -40, -22);
            nucleus(ctx, Q.he4, "4He", -22, 36);
          }
        }
      }
      legend(ctx, tr);
    });
    function legend(ctx, tr) {
      [[P, "cno.proton", 395, 15.6], [N, "cno.neutron", 436, 15.6],
       [POS, "cno.positron", 472, 10]].forEach(function (o) {
        ball(ctx, 35, o[2], o[0], o[3]);
        ctx.fillStyle = "#000000"; ctx.font = "14px " + FONT;
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(tr(o[1]), 61, o[2]);
      });
      wave(ctx, 16, 508, 78, 508, true);
      ctx.fillStyle = "#000000"; ctx.font = "14px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(tr("cno.gamma"), 108, 508);
      ctx.strokeStyle = NU; ctx.lineWidth = 2.6; ctx.setLineDash([9, 7]);
      ctx.beginPath(); ctx.moveTo(16, 536); ctx.lineTo(78, 536); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#000000"; ctx.font = "italic 24px " + SERIF;
      ctx.fillText("\u03bd", 84, 539);
      ctx.font = "14px " + FONT;
      ctx.fillText(tr("cno.neutrino"), 108, 536);
    }

    upd();
  }
});
