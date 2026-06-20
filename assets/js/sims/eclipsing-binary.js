/* Eclipsing Binary Simulator ----------------------------------------------- */
Sim.create({
  id: "eclipsing-binary",
  width: 760, height: 500,
  strings: {
    en: {
      "eb.sys": "The two stars", "eb.r2": "Radius ratio R₂/R₁", "eb.t2": "Temperature ratio T₂/T₁",
      "eb.sep": "Separation", "eb.inc": "Inclination", "eb.anim": "Animation",
      "eb.primary": "Primary eclipse depth", "eb.secondary": "Secondary eclipse depth", "eb.flux": "Current brightness"
    },
    id: {
      "eb.sys": "Dua bintang", "eb.r2": "Rasio radius R₂/R₁", "eb.t2": "Rasio suhu T₂/T₁",
      "eb.sep": "Pemisahan", "eb.inc": "Inklinasi", "eb.anim": "Animasi",
      "eb.primary": "Kedalaman gerhana primer", "eb.secondary": "Kedalaman gerhana sekunder", "eb.flux": "Kecerahan saat ini"
    }
  },
  about: {
    en: "<p>Many stars come in pairs. If we happen to view the orbit nearly edge-on, each star periodically passes in front of the other and the combined light dips — an <strong>eclipsing binary</strong>.</p>" +
        "<p>The curve has two dips per orbit. The <strong>primary</strong> (deeper) eclipse happens when the hotter star is hidden, because more surface brightness is lost. " +
        "From the depths, widths and timing astronomers extract the stars' relative sizes, temperatures and the orbit's tilt — even for stars far too close together to see separately.</p>" +
        "<p>Lower the inclination toward face-on and the eclipses shrink and vanish: we no longer see the stars cross.</p>",
    id: "<p>Banyak bintang berpasangan. Jika kebetulan kita melihat orbitnya hampir dari tepi, tiap bintang berkala melintas di depan yang lain dan cahaya gabungannya meredup — sebuah <strong>biner gerhana</strong>.</p>" +
        "<p>Kurvanya memiliki dua lekuk per orbit. Gerhana <strong>primer</strong> (lebih dalam) terjadi saat bintang yang lebih panas tertutup, karena lebih banyak kecerahan permukaan hilang. " +
        "Dari kedalaman, lebar, dan waktunya, astronom memperoleh ukuran relatif, suhu, dan kemiringan orbit — bahkan untuk bintang yang terlalu rapat untuk dilihat terpisah.</p>" +
        "<p>Turunkan inklinasi ke arah muka-penuh dan gerhana mengecil lalu lenyap: kita tak lagi melihat bintang saling melintas.</p>"
  },
  build: function (S) {
    var r2 = 0.6, t2 = 0.7, sep = 3, inc = 90, theta = 0;
    var R1 = 1;
    var loop = S.loop(function (dt) { theta = (theta + dt * 0.6) % (2 * Math.PI); S.requestDraw(); });

    S.group("eb.sys");
    S.slider({ labelKey: "eb.r2", min: 0.2, max: 1.4, value: r2, step: 0.05, format: function (v) { return v.toFixed(2); }, on: function (v) { r2 = v; upd(); } });
    S.slider({ labelKey: "eb.t2", min: 0.3, max: 1.5, value: t2, step: 0.05, format: function (v) { return v.toFixed(2); }, on: function (v) { t2 = v; upd(); } });
    S.slider({ labelKey: "eb.sep", min: 2.2, max: 5, value: sep, step: 0.1, on: function (v) { sep = v; upd(); } });
    S.slider({ labelKey: "eb.inc", min: 70, max: 90, value: inc, step: 0.5, unit: "°", on: function (v) { inc = v; upd(); } });
    S.group("eb.anim");
    S.playPause(loop);

    var outP = S.readout({ labelKey: "eb.primary" });
    var outS = S.readout({ labelKey: "eb.secondary" });
    var outF = S.readout({ labelKey: "eb.flux" });

    function overlap(d, R, r) {
      if (d >= R + r) return 0;
      if (d <= Math.abs(R - r)) return Math.PI * Math.min(R, r) * Math.min(R, r);
      var a1 = Math.acos((d * d + R * R - r * r) / (2 * d * R)), a2 = Math.acos((d * d + r * r - R * R) / (2 * d * r));
      return R * R * (a1 - Math.sin(2 * a1) / 2) + r * r * (a2 - Math.sin(2 * a2) / 2);
    }
    // surface brightness ∝ T^4 ; L ∝ R^2 T^4
    function fluxAt(th) {
      var sb1 = 1, sb2 = Math.pow(t2, 4);
      var L1 = Math.PI * R1 * R1 * sb1, L2 = Math.PI * r2 * r2 * sb2, Ltot = L1 + L2;
      var ci = Math.cos(inc * Math.PI / 180);
      var dx = sep * Math.sin(th), dy = sep * Math.cos(th) * ci;     // projected centre separation
      var s = Math.sqrt(dx * dx + dy * dy);
      var ov = overlap(s, Math.max(R1, r2), Math.min(R1, r2));
      // which star is in front? larger line-of-sight depth (cos th * sin i)
      var oneInFront = Math.cos(th) > 0;     // star1 toward viewer
      var blocked;
      if (oneInFront) blocked = ov * sb2;     // star2 (behind) is blocked
      else blocked = ov * sb1;                // star1 (behind) blocked
      return (Ltot - blocked) / Ltot;
    }
    function upd() {
      // primary at th=0 (star1 front, blocks star2) or π depending; sample both conjunctions
      var f0 = fluxAt(0), fpi = fluxAt(Math.PI);
      var dPrim = (1 - Math.min(f0, fpi)) * 100, dSec = (1 - Math.max(f0, fpi)) * 100;
      outP(dPrim.toFixed(1) + " %");
      outS(dSec.toFixed(1) + " %");
      outF(fluxAt(theta).toFixed(3));
      S.requestDraw();
    }
    window.addEventListener("langchange", upd);

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var cx = W / 2, cy = 130, scale = 38;
      var ci = Math.cos(inc * Math.PI / 180);
      // positions (equal half-orbit each side of COM)
      function star(th, sign) {
        var x = sign * (sep / 2) * Math.sin(th);
        var y = sign * (sep / 2) * Math.cos(th) * ci;
        var z = sign * (sep / 2) * Math.cos(th);     // depth
        return { x: cx + x * scale, y: cy + y * scale, z: z };
      }
      var s1 = star(theta, 1), s2 = star(theta, -1);
      // orbit guide
      ctx.strokeStyle = "#23304f"; ctx.beginPath(); ctx.ellipse(cx, cy, (sep / 2) * scale, (sep / 2) * scale * Math.max(0.04, ci), 0, 0, 2 * Math.PI); ctx.stroke();
      // draw far star first
      var arr = s1.z < s2.z ? [[s1, 1], [s2, 2]] : [[s2, 2], [s1, 1]];
      arr.forEach(function (pair) {
        var st = pair[0], which = pair[1];
        var R = which === 1 ? R1 : r2, T = which === 1 ? 1 : t2;
        var c = starColor(T);
        var g = ctx.createRadialGradient(st.x, st.y, 1, st.x, st.y, R * scale);
        g.addColorStop(0, "#fff"); g.addColorStop(0.6, c); g.addColorStop(1, shade(c));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(st.x, st.y, R * scale, 0, 2 * Math.PI); ctx.fill();
      });

      // ===== light curve over one orbit =====
      var lx0 = 70, lx1 = W - 24, ly0 = H - 36, ly1 = 250;
      var fmin = 1;
      for (var i = 0; i <= 360; i += 2) fmin = Math.min(fmin, fluxAt(i * Math.PI / 180));
      var top = 1.01, bot = Math.min(0.999, fmin - 0.02);
      var mapF = function (f) { return ly1 + (top - f) / (top - bot) * (ly0 - ly1); };
      ctx.strokeStyle = "#2c3a66"; ctx.beginPath(); ctx.moveTo(lx0, ly1 - 6); ctx.lineTo(lx0, ly0); ctx.lineTo(lx1, ly0); ctx.stroke();
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "left";
      ctx.fillText(I18N.getLang() === "id" ? "kecerahan total" : "total brightness", lx0 + 4, ly1 - 10);

      ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 2; ctx.beginPath();
      for (var j = 0; j <= 360; j++) {
        var f = fluxAt(j * Math.PI / 180), X = lx0 + j / 360 * (lx1 - lx0), Y = mapF(f);
        j === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
      }
      ctx.stroke();
      var mX = lx0 + (theta / (2 * Math.PI)) * (lx1 - lx0);
      ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.arc(mX, mapF(fluxAt(theta)), 5, 0, 2 * Math.PI); ctx.fill();
    });

    upd();

    function starColor(T) { return T >= 1.2 ? "#aac7ff" : T >= 0.95 ? "#fff4d6" : T >= 0.7 ? "#ffd166" : "#ff8a5a"; }
    function shade(c) { return c === "#aac7ff" ? "#5b78c4" : c === "#fff4d6" ? "#d99a2a" : c === "#ffd166" ? "#c77f1e" : "#b8431f"; }
  }
});
