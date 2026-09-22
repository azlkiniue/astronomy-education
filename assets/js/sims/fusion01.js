/* Proton-Proton Animation -------------------------------------------------------
   Rebuild of the ClassAction "fusion01.swf". The original is a pure timeline
   movie — no ActionScript model — so this reproduces its diagram and the order
   in which it builds up, with the same particle key and the same three steps
   drawn twice side by side before the two helium-3 nuclei meet.               */
Sim.create({
  id: "fusion01",
  width: 600, height: 500,
  strings: {
    en: {
      "pp.ctl": "Animation", "pp.start": "start animation", "pp.pause": "pause animation",
      "pp.reset": "reset animation", "pp.rate": "speed",
      "pp.proton": "Proton", "pp.neutron": "Neutron", "pp.positron": "Positron",
      "pp.gamma": "Gamma ray", "pp.neutrino": "Neutrino",
      "pp.rStep": "step", "pp.rNet": "net reaction",
      "pp.s0": "waiting to start", "pp.s1": "two protons fuse into deuterium",
      "pp.s2": "deuterium captures a proton to make helium-3",
      "pp.s3": "two helium-3 nuclei make helium-4 and return two protons",
      "pp.done": "chain complete"
    },
    id: {
      "pp.ctl": "Animasi", "pp.start": "mulai animasi", "pp.pause": "jeda animasi",
      "pp.reset": "atur ulang animasi", "pp.rate": "kecepatan",
      "pp.proton": "Proton", "pp.neutron": "Neutron", "pp.positron": "Positron",
      "pp.gamma": "Sinar gama", "pp.neutrino": "Neutrino",
      "pp.rStep": "tahap", "pp.rNet": "reaksi total",
      "pp.s0": "menunggu dimulai", "pp.s1": "dua proton melebur menjadi deuterium",
      "pp.s2": "deuterium menangkap proton menjadi helium-3",
      "pp.s3": "dua inti helium-3 membentuk helium-4 dan mengembalikan dua proton",
      "pp.done": "rantai selesai"
    }
  },
  about: {
    en: "<p>Almost all of the Sun's energy comes from this chain. Two protons collide hard enough to touch despite their mutual repulsion; one of them turns into a neutron, emitting a positron and a neutrino, and the pair sticks together as deuterium. That first step is the bottleneck — it relies on the weak interaction and takes a given proton billions of years on average, which is why the Sun burns so slowly.</p>" +
        "<p>The rest is fast. Deuterium picks up another proton within seconds to make helium-3, releasing a gamma ray. When two helium-3 nuclei meet they form helium-4 and hand back two protons to start again.</p>" +
        "<p>Add it up and four protons become one helium-4 nucleus, two positrons, two neutrinos and energy. The helium-4 weighs about 0.7 % less than the four protons did, and that missing mass is the energy, via E = mc². The neutrinos leave immediately and are the only direct evidence we have of the Sun's core.</p>",
    id: "<p>Hampir seluruh energi Matahari berasal dari rantai ini. Dua proton bertumbukan cukup keras untuk bersentuhan meski saling menolak; salah satunya berubah menjadi neutron sambil memancarkan positron dan neutrino, dan pasangan itu melekat sebagai deuterium. Langkah pertama inilah penyempitannya — ia bergantung pada interaksi lemah dan rata-rata menuntut miliaran tahun bagi satu proton, sebabnya Matahari membakar begitu lambat.</p>" +
        "<p>Sisanya berlangsung cepat. Dalam hitungan detik deuterium menangkap proton lain menjadi helium-3 sambil melepas sinar gama. Ketika dua inti helium-3 bertemu, terbentuklah helium-4 dan dua proton dikembalikan untuk memulai lagi.</p>" +
        "<p>Bila dijumlahkan, empat proton menjadi satu inti helium-4, dua positron, dua neutrino, dan energi. Helium-4 itu sekitar 0,7 % lebih ringan daripada keempat proton semula, dan massa yang hilang itulah energinya, lewat E = mc². Neutrino langsung pergi dan merupakan satu-satunya bukti langsung yang kita punya tentang inti Matahari.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var SERIF = "Georgia, 'Times New Roman', serif";
    var P = "#3f62c4", N = "#d83a3a", POS = "#d9a92e", GAM = "#7fd4f0", NU = "#e02020";
    var RR = 19.3, PR = 13;                        // nucleon and positron radii,
                                                   // measured off the SWF recording
    var t = 0, rate = 1, STEPS = 3;                // three reactions, each animated
    S.group("pp.ctl");
    var playBtn = S.button({ label: "", primary: true, on: function () {
      if (loop.playing) loop.pause(); else { if (t >= STEPS) t = 0; loop.play(); }
      sync();
    } });
    S.button({ labelKey: "pp.reset", on: function () {
      loop.pause(); t = 0; sync(); upd();
    } });
    S.slider({ labelKey: "pp.rate", min: 0.3, max: 3, value: 1, step: 0.1,
      format: function (v) { return v.toFixed(1) + "×"; }, on: function (v) { rate = v; } });
    var outStep = S.readout({ labelKey: "pp.rStep" });
    var outNet = S.readout({ labelKey: "pp.rNet" });

    var loop = S.loop(function (dt) {
      t = Math.min(STEPS, t + dt * rate * 0.55);
      if (t >= STEPS) { loop.pause(); sync(); }
      upd();
    });
    function sync() { playBtn.textContent = I18N.t(loop.playing ? "pp.pause" : "pp.start"); }
    function upd() {
      var k = t <= 0 ? "pp.s0" : (t < 1 ? "pp.s1" : (t < 2 ? "pp.s2" : (t < STEPS ? "pp.s3" : "pp.done")));
      outStep(I18N.t(k));
      outNet("4 ¹H → ⁴He + 2e⁺ + 2ν + 26.7 MeV");
      S.requestDraw();
    }
    S.refreshers.push(function () { sync(); upd(); });

    /* --- the diagram, at the SWF's own measurements (stage 600 × 500) --------
       Sizes and positions read off the original: its stage renders at 2.54× in
       the recording, where a nucleon is 98px across, so RR = 19.3. The five
       reaction groups sit at PlaceObject coordinates (15,15), (15,344),
       (142,76), (142,286) and (284,97); everything below is expressed as an
       offset from the reaction star each group is built around.              */
    var HUB = [103.5, 75], HUB_LO = 408;            // upper star, lower baseline
    var OFF = {                                     // offsets from the branch star
      h1: [-66, -37.5], h2: [-66, 42.5],            // the two incoming protons
      pos: [15.5, -48], nu: [24.5, 65],             // positron and neutrino
      d: [55.5, -7],                                // the deuteron
      h3: [60, 102],                                // the proton entering step 2
      hub2: [127.5, 62],                            // the second reaction star
      he3: [210.5, 53], gam: [180.5, 143]           // helium-3 and its gamma ray
    };
    var HUB3 = [392, 245], HE4 = [530, 243], H_OUT = 78;
    function nucleus(ctx, x, y, kind, label, lx, ly) {
      var parts = { H: [[0, 0, P]],
        D: [[-3, 8, P], [4, -8, N]],
        He3: [[-23, 9, P], [23, 9, P], [0, -15, N]],
        He4: [[-32, -3, P], [32, -3, P], [-1, 12, N], [-1, -27, N]] }[kind];
      parts.forEach(function (p) { ball(ctx, x + p[0], y + p[1], p[2], RR); });
      if (label) label_(ctx, x + lx, y + ly, label);
    }
    function label_(ctx, x, y, label) {
      var sup = label.replace(/[A-Za-z].*$/, ""), el = label.slice(sup.length);
      ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.font = "13px " + SERIF;
      ctx.fillText(sup, x, y - 8);
      var w = ctx.measureText(sup).width;
      ctx.font = "21px " + SERIF;
      ctx.fillText(el, x + w + 1, y);
    }
    function ball(ctx, x, y, colour, r) {
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, lighten(colour, 0.6)); g.addColorStop(0.6, colour);
      g.addColorStop(1, lighten(colour, -0.4));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    function lighten(hex, k) {
      var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
      function f(v) { return Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); }
      return "rgb(" + f(r) + "," + f(g) + "," + f(b) + ")";
    }
    /* the SWF's arrowheads are big solid triangles, about 18 long */
    function arrow(ctx, x1, y1, x2, y2) {
      var a = Math.atan2(y2 - y1, x2 - x1), L = 17, W = 0.33;
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 3; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x1, y1);
      ctx.lineTo(x2 - Math.cos(a) * L * 0.85, y2 - Math.sin(a) * L * 0.85);
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - Math.cos(a - W) * L, y2 - Math.sin(a - W) * L);
      ctx.lineTo(x2 - Math.cos(a + W) * L, y2 - Math.sin(a + W) * L);
      ctx.closePath(); ctx.fill();
    }
    function neutrino(ctx, x1, y1, x2, y2) {
      ctx.strokeStyle = NU; ctx.lineWidth = 2.6; ctx.setLineDash([9, 7]);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#000000"; ctx.font = "italic 24px " + SERIF;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("ν", x2 + (x2 > x1 ? 11 : -11), y2 + (y2 > y1 ? 9 : -9));
    }
    function wave(ctx, x1, y1, x2, y2, label) {
      var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
      ctx.save();
      ctx.translate(x1, y1); ctx.rotate(a);
      ctx.strokeStyle = GAM; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0);
      for (var i = 0; i <= L; i += 1.5) ctx.lineTo(i, Math.sin(i / 13) * 7);
      ctx.stroke();
      ctx.restore();
      if (label) {
        ctx.fillStyle = "#000000"; ctx.font = "italic 26px " + SERIF;
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText("γ", x2 + 6, y2 + 4);
      }
    }
    function flash(ctx, x, y) {                     // the reaction burst
      ctx.fillStyle = "#ffe800"; ctx.strokeStyle = "#d8d8d8"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (var i = 0; i < 20; i++) {
        var a = i * Math.PI / 10 - 0.25, r = i % 2 ? 4.5 : 12;
        var px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    /* Motion, the way the SWF runs it (sampled from the recording at 6fps): the
       nuclei already on the diagram stay where they are, a COPY of each reactant
       travels along its arrow into the reaction point with the arrow growing
       behind it, the burst fires when they meet, and the product then travels
       out to its resting place while the positron flies off and the neutrino
       line draws. Previously the reactants slid in and snapped back and the
       products appeared all at once, which is what made it look stepped.     */
    function lerpPt(a, b, u) {
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    }
    function trim(a, b, gapA, gapB) {
      var d = Math.atan2(b[1] - a[1], b[0] - a[0]);
      return [[a[0] + Math.cos(d) * gapA, a[1] + Math.sin(d) * gapA],
        [b[0] - Math.cos(d) * gapB, b[1] - Math.sin(d) * gapB]];
    }
    function link(ctx, a, b, u, gapA, gapB) {
      var v = trim(a, b, gapA === undefined ? RR + 3 : gapA,
        gapB === undefined ? RR + 4 : gapB);
      if (u === undefined) u = 1;
      if (u <= 0.03) return;
      var tip = lerpPt(v[0], v[1], u);
      arrow(ctx, v[0][0], v[0][1], tip[0], tip[1]);
    }
    function growNu(ctx, from, to, u) {
      if (u <= 0.04) return;
      var e = lerpPt(from, to, u);
      ctx.strokeStyle = NU; ctx.lineWidth = 2.6; ctx.setLineDash([9, 7]);
      ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
      ctx.setLineDash([]);
      if (u > 0.85) {
        ctx.fillStyle = "#000000"; ctx.font = "italic 24px " + SERIF;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("ν", to[0] + (to[0] > from[0] ? 11 : -11),
          to[1] + (to[1] > from[1] ? 9 : -9));
      }
    }
    function growWave(ctx, from, to, u) {
      if (u <= 0.05) return;
      var e = lerpPt(from, to, u);
      wave(ctx, from[0], from[1], e[0], e[1], u > 0.85);
    }

    /* one branch. `up` picks the upper copy; stage is how far the chain has run
       (0-3 as a float), so each reaction converges, fires, then delivers.    */
    function branch(ctx, up, stage) {
      var s = up ? 1 : -1, y0 = up ? HUB[1] : HUB_LO;
      function Y(v) { return y0 + s * v; }
      var hx = HUB[0];
      function O(k) { return [hx + OFF[k][0], Y(OFF[k][1])]; }
      var h1 = O("h1"), h2 = O("h2"), d = O("d"), pos = O("pos"), nu = O("nu");
      var h3 = O("h3"), hub2 = O("hub2"), he3 = O("he3"), gam = O("gam");
      var star1 = [hx, Y(0)];
      var p1 = Math.max(0, Math.min(1, stage)), p2 = Math.max(0, Math.min(1, stage - 1));

      if (p1 > 0) {                                 // step 1: two protons → deuteron
        nucleus(ctx, h1[0], h1[1], "H", "1H", -17, 29);
        nucleus(ctx, h2[0], h2[1], "H", "1H", -17, 29);
        var inU = Math.min(1, p1 / 0.5), outU = Math.max(0, (p1 - 0.62) / 0.38);
        link(ctx, h1, star1, inU, RR + 3, 20);
        link(ctx, h2, star1, inU, RR + 3, 20);
        if (p1 < 0.7) {                             // the copies running in
          var c1 = lerpPt(h1, star1, inU), c2 = lerpPt(h2, star1, inU);
          nucleus(ctx, c1[0], c1[1], "H");
          nucleus(ctx, c2[0], c2[1], "H");
        }
        if (p1 > 0.45) flash(ctx, star1[0], star1[1]);
        if (outU > 0) {                             // deuteron, positron, neutrino
          link(ctx, star1, d, outU, 16, RR + 4);
          var q = lerpPt(star1, d, outU);
          nucleus(ctx, q[0], q[1], "D");
          if (outU > 0.9) nucleus(ctx, d[0], d[1], "D", "2H", 25, s * 8);
          link(ctx, [hx + 6, Y(-10)], pos, outU, 8, PR + 4);
          var e = lerpPt([hx + 6, Y(-10)], pos, outU);
          ball(ctx, e[0], e[1], POS, PR);
          growNu(ctx, [hx + 6, Y(12)], nu, outU);
        }
      }
      if (p2 > 0) {                                 // step 2: deuteron + proton
        nucleus(ctx, h3[0], h3[1], "H", "1H", -14, 31);
        var i2 = Math.min(1, p2 / 0.5), o2 = Math.max(0, (p2 - 0.62) / 0.38);
        link(ctx, d, hub2, i2, RR + 8, 20);
        link(ctx, h3, hub2, i2, RR + 3, 20);
        if (p2 < 0.7) {
          var a2 = lerpPt(d, hub2, i2), b2 = lerpPt(h3, hub2, i2);
          nucleus(ctx, a2[0], a2[1], "D");
          nucleus(ctx, b2[0], b2[1], "H");
        }
        if (p2 > 0.45) flash(ctx, hub2[0], hub2[1]);
        if (o2 > 0) {
          link(ctx, hub2, he3, o2, 18, RR + 22);
          var r2 = lerpPt(hub2, he3, o2);
          nucleus(ctx, r2[0], r2[1], "He3");
          if (o2 > 0.9) nucleus(ctx, he3[0], he3[1], "He3", "3He", 25, -17);
          growWave(ctx, [hub2[0] + 6, hub2[1] + s * 14], gam, o2);
        }
      }
    }
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 600, 500);
      ctx.lineJoin = "round";
      branch(ctx, true, t);
      branch(ctx, false, t);
      /* step 3: the two helium-3 nuclei close on the last star, then hand back
         two protons and a helium-4                                          */
      var p3 = Math.max(0, Math.min(1, t - 2));
      var upHe = [HUB[0] + OFF.he3[0], HUB[1] + OFF.he3[1]];
      var loHe = [HUB[0] + OFF.he3[0], HUB_LO - OFF.he3[1]];
      if (p3 > 0) {
        var i3 = Math.min(1, p3 / 0.5), o3 = Math.max(0, (p3 - 0.62) / 0.38);
        link(ctx, upHe, HUB3, i3, RR + 22, 22);
        link(ctx, loHe, HUB3, i3, RR + 22, 22);
        if (p3 < 0.7) {
          var u3 = lerpPt(upHe, HUB3, i3), l3 = lerpPt(loHe, HUB3, i3);
          nucleus(ctx, u3[0], u3[1], "He3");
          nucleus(ctx, l3[0], l3[1], "He3");
        }
        if (p3 > 0.45) flash(ctx, HUB3[0], HUB3[1]);
        if (o3 > 0) {
          var hiH = [HUB3[0] + 30, HUB3[1] - H_OUT], loH = [HUB3[0] + 30, HUB3[1] + H_OUT];
          link(ctx, HUB3, HE4, o3, 20, RR + 34);
          link(ctx, HUB3, hiH, o3, 16, RR + 4);
          link(ctx, HUB3, loH, o3, 16, RR + 4);
          var a3 = lerpPt(HUB3, HE4, o3), b3 = lerpPt(HUB3, hiH, o3),
            c3 = lerpPt(HUB3, loH, o3);
          nucleus(ctx, a3[0], a3[1], "He4");
          nucleus(ctx, b3[0], b3[1], "H");
          nucleus(ctx, c3[0], c3[1], "H");
          if (o3 > 0.9) {
            nucleus(ctx, hiH[0], hiH[1], "H", "1H", 24, -20);
            nucleus(ctx, loH[0], loH[1], "H", "1H", 24, 20);
            nucleus(ctx, HE4[0], HE4[1], "He4", "4He", 20, -36);
          }
        }
      }
      legend(ctx, tr);
    });
    /* the key, at the SWF's own coordinates: nucleons at x 509, y 396/441/481 */
    function legend(ctx, tr) {
      [[P, "pp.proton", 396, RR], [N, "pp.neutron", 441, RR], [POS, "pp.positron", 481, PR]]
        .forEach(function (o) {
          ball(ctx, 509, o[2], o[0], o[3]);
          ctx.fillStyle = "#000000"; ctx.font = "14px " + FONT;
          ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(tr(o[1]), 535, o[2]);
        });
      wave(ctx, 290, 431, 366, 431, true);
      ctx.fillStyle = "#000000"; ctx.font = "14px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(tr("pp.gamma"), 396, 431);
      ctx.strokeStyle = NU; ctx.lineWidth = 2.6; ctx.setLineDash([9, 7]);
      ctx.beginPath(); ctx.moveTo(290, 470); ctx.lineTo(366, 470); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#000000"; ctx.font = "italic 24px " + SERIF;
      ctx.fillText("\u03bd", 374, 473);
      ctx.font = "14px " + FONT;
      ctx.fillText(tr("pp.neutrino"), 396, 470);
    }

    upd();
  }
});
