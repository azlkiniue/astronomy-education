/* Inverse-Square Law of Brightness ---------------------------------------- */
Sim.create({
  id: "flux-inverse-square",
  width: 760, height: 440,
  strings: {
    en: {
      "is.ctl": "Detector", "is.dist": "Distance from source",
      "is.bright": "Relative brightness", "is.area": "Light spread over", "is.cells": "× the area"
    },
    id: {
      "is.ctl": "Detektor", "is.dist": "Jarak dari sumber",
      "is.bright": "Kecerahan relatif", "is.area": "Cahaya tersebar pada", "is.cells": "× luas"
    }
  },
  about: {
    en: "<p>Light from a point source spreads out over the surface of an ever-growing sphere. " +
        "At distance <strong>d</strong> the same energy is smeared across an area proportional to <strong>d²</strong>, " +
        "so the brightness you measure drops as <strong>1 / d²</strong>.</p>" +
        "<p>Move the detector: at 2× the distance the light covers 4× the area and looks ¼ as bright; at 3× it is 1/9 as bright. " +
        "This single rule lets astronomers turn a star's apparent brightness into its distance.</p>",
    id: "<p>Cahaya dari sumber titik menyebar ke permukaan bola yang terus membesar. " +
        "Pada jarak <strong>d</strong> energi yang sama tersebar pada luas yang sebanding dengan <strong>d²</strong>, " +
        "sehingga kecerahan yang Anda ukur turun sebagai <strong>1 / d²</strong>.</p>" +
        "<p>Geser detektor: pada jarak 2× cahaya menutupi 4× luas dan tampak ¼ lebih terang; pada 3× menjadi 1/9. " +
        "Aturan tunggal ini memungkinkan astronom mengubah kecerahan tampak bintang menjadi jaraknya.</p>"
  },
  build: function (S) {
    var d = 1;

    S.group("is.ctl");
    S.slider({ labelKey: "is.dist", min: 1, max: 5, value: d, step: 1, unit: "×", on: function (v) { d = v; upd(); } });
    var outB = S.readout({ labelKey: "is.bright" });
    var outA = S.readout({ labelKey: "is.area" });

    function upd() { outB("1/" + (d * d) + " = " + (1 / (d * d)).toFixed(3)); outA("×" + d * d); S.requestDraw(); }

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var sx = 70, cy = H / 2 - 10;
      var unit = 118;                     // px per distance unit
      var base = 56;                      // half-size of the 1× patch

      // diverging rays
      ctx.strokeStyle = "rgba(255,209,102,0.35)"; ctx.lineWidth = 1;
      for (var a = -1; a <= 1; a += 0.5) {
        ctx.beginPath(); ctx.moveTo(sx, cy);
        ctx.lineTo(sx + 5.4 * unit, cy + a * base * 5.4); ctx.stroke();
      }

      // patches at distances 1..d (the chosen one highlighted)
      for (var k = 1; k <= 5; k++) {
        var x = sx + k * unit;
        var half = base * k;
        var isSel = k === d;
        ctx.strokeStyle = isSel ? "#6ea8fe" : "#2c3a66";
        ctx.lineWidth = isSel ? 2 : 1;
        // grid of k×k cells
        var cell = (2 * half) / k;
        ctx.save();
        ctx.globalAlpha = isSel ? 1 : 0.5;
        for (var i = 0; i < k; i++) for (var j = 0; j < k; j++) {
          var bright = 1 / (k * k);
          ctx.fillStyle = "rgba(255,209,102," + (bright * 0.9 + 0.05) + ")";
          ctx.fillRect(x - half + i * cell, cy - half + j * cell, cell - 1, cell - 1);
        }
        ctx.strokeRect(x - half, cy - half, 2 * half, 2 * half);
        ctx.restore();
        ctx.fillStyle = isSel ? "#e8ecf8" : "#9fabce";
        ctx.font = (isSel ? "bold " : "") + "12px system-ui"; ctx.textAlign = "center";
        ctx.fillText(k + "×", x, cy + half + 18);
      }

      // source
      var g = ctx.createRadialGradient(sx, cy, 1, sx, cy, 16);
      g.addColorStop(0, "#fff"); g.addColorStop(0.5, "#ffd166"); g.addColorStop(1, "rgba(255,209,102,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, cy, 16, 0, 2 * Math.PI); ctx.fill();

      // 1/d^2 curve
      var px0 = 90, px1 = W - 30, py0 = H - 26, py1 = H - 96;
      ctx.strokeStyle = "#2c3a66"; ctx.beginPath();
      ctx.moveTo(px0, py0); ctx.lineTo(px1, py0); ctx.stroke();
      ctx.strokeStyle = "#b692ff"; ctx.lineWidth = 2; ctx.beginPath();
      for (var t = 1; t <= 5; t += 0.05) {
        var X = px0 + (t - 1) / 4 * (px1 - px0);
        var Y = py0 - (1 / (t * t)) * (py0 - py1);
        if (t === 1) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      var mx = px0 + (d - 1) / 4 * (px1 - px0), my = py0 - (1 / (d * d)) * (py0 - py1);
      ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.arc(mx, my, 5, 0, 2 * Math.PI); ctx.fill();
    });

    upd();
  }
});
