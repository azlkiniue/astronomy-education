/* Small-Angle Approximation Demonstrator --------------------------------------
   Faithful rebuild of the ClassAction "Small-Angle Approximation Demonstrator"
   (smallangledemo.swf). Mirrors the original:
     • the headline equation  α = 206,265 × (linear diameter / distance) = N arcsec
     • an observer sighting a distant object, with the angle α subtended
     • distance + diameter sliders, each with the original's preset buttons
       (distance 20/30/40/50/60, diameter 1/2/3).                              */
Sim.create({
  id: "small-angle",
  width: 760, height: 470,
  strings: {
    en: {
      "sa.controls": "Controls", "sa.dist": "distance", "sa.diam": "diameter", "sa.units": "units",
      "sa.exact": "angular size (exact)", "sa.err": "approximation error",
      "sa.num": "linear diameter", "sa.den": "distance", "sa.arcsec": "arcsec"
    },
    id: {
      "sa.controls": "Kontrol", "sa.dist": "jarak", "sa.diam": "diameter", "sa.units": "satuan",
      "sa.exact": "ukuran sudut (eksak)", "sa.err": "galat aproksimasi",
      "sa.num": "diameter linier", "sa.den": "jarak", "sa.arcsec": "detik busur"
    }
  },
  about: {
    en: "<p>How big something <em>looks</em> — its <strong>angular size</strong> α — depends on both its real size and its distance. " +
        "For a small angle, α (in arcseconds) ≈ <strong>206,265 × (linear diameter / distance)</strong>. " +
        "The number 206,265 is just the count of arcseconds in one radian.</p>" +
        "<p>Drag the sliders (or use the preset buttons) and watch the object's apparent size change. Doubling the diameter doubles the angle; doubling the distance halves it.</p>" +
        "<p>The approximation is excellent while the angle stays small — push the diameter up or the distance down and the <em>approximation error</em> (vs. the exact 2·arctan formula) starts to grow.</p>" +
        "<p>Why astronomers care: almost everything in the sky is tiny in angle, so this shortcut is used constantly. The Moon and Sun each span about <strong>0.5°</strong>.</p>",
    id: "<p>Seberapa besar sesuatu <em>terlihat</em> — <strong>ukuran sudut</strong> α — bergantung pada ukuran asli dan jaraknya. " +
        "Untuk sudut kecil, α (dalam detik busur) ≈ <strong>206.265 × (diameter linier / jarak)</strong>. " +
        "Angka 206.265 hanyalah banyaknya detik busur dalam satu radian.</p>" +
        "<p>Geser penggeser (atau pakai tombol preset) dan amati perubahan ukuran tampak objek. Menggandakan diameter menggandakan sudut; menggandakan jarak memotongnya separuh.</p>" +
        "<p>Aproksimasi ini sangat baik selama sudut tetap kecil — naikkan diameter atau turunkan jarak, maka <em>galat aproksimasi</em> (terhadap rumus eksak 2·arctan) mulai membesar.</p>" +
        "<p>Mengapa astronom peduli: hampir semua benda langit kecil secara sudut, jadi jalan pintas ini terus dipakai. Bulan dan Matahari masing-masing membentang sekitar <strong>0,5°</strong>.</p>"
  },
  build: function (S) {
    var diam = 2, dist = 40;        // "units"

    S.group("sa.controls");
    var distCtl = S.slider({ labelKey: "sa.dist", min: 10, max: 100, step: 0.5, value: dist,
      format: function (v) { return v.toFixed(1) + " " + I18N.t("sa.units"); }, on: function (v) { dist = v; upd(); } });
    [20, 30, 40, 50, 60].forEach(function (v) { S.button({ label: String(v), on: function () { distCtl.set(v); } }); });

    var diamCtl = S.slider({ labelKey: "sa.diam", min: 0.5, max: 5, step: 0.1, value: diam,
      format: function (v) { return v.toFixed(1) + " " + I18N.t("sa.units"); }, on: function (v) { diam = v; upd(); } });
    [1, 2, 3].forEach(function (v) { S.button({ label: String(v), on: function () { diamCtl.set(v); } }); });

    var outExact = S.readout({ labelKey: "sa.exact" });
    var outErr = S.readout({ labelKey: "sa.err" });

    function approxArcsec() { return 206265 * diam / dist; }            // small-angle
    function exactRad() { return 2 * Math.atan(diam / (2 * dist)); }    // true angle
    function upd() {
      var ap = approxArcsec() / 206265;            // approx in radians
      var ex = exactRad();
      outExact(fmtAngle(ex));
      outErr(((ap - ex) / ex * 100).toFixed(3) + " %");
      S.requestDraw();
    }

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      drawEquation(ctx, W, 56);

      var vx = 96, cy = 300, ox = W - 110, baseLen = ox - vx;
      var ang = exactRad();
      var halfH = Math.min(baseLen * Math.tan(ang / 2), 150);

      // baseline (line of sight to centre)
      ctx.strokeStyle = "#2c3a66"; ctx.setLineDash([5, 5]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(vx, cy); ctx.lineTo(ox, cy); ctx.stroke(); ctx.setLineDash([]);

      // sight lines to top & bottom of the object
      ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(vx, cy); ctx.lineTo(ox, cy - halfH);
      ctx.moveTo(vx, cy); ctx.lineTo(ox, cy + halfH); ctx.stroke();

      // angle marker at the vertex
      ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(vx, cy, 42, -ang / 2, ang / 2); ctx.stroke();
      ctx.fillStyle = "#ffd166"; ctx.font = "italic 15px Georgia, serif"; ctx.textAlign = "left";
      ctx.textBaseline = "middle"; ctx.fillText("α", vx + 50, cy);
      ctx.textBaseline = "alphabetic";

      drawObserver(ctx, vx, cy);
      drawObject(ctx, ox, cy, halfH);

      // distance + diameter annotations
      ctx.fillStyle = "#9fabce"; ctx.font = "12px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("sa.dist") + " = " + dist.toFixed(1) + " " + I18N.t("sa.units"), (vx + ox) / 2, cy + 26);
      ctx.save();
      ctx.strokeStyle = "#9fabce"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox + halfH * 0.5 + 14, cy - halfH); ctx.lineTo(ox + halfH * 0.5 + 14, cy + halfH); ctx.stroke();
      ctx.translate(ox + halfH * 0.5 + 28, cy); ctx.rotate(-Math.PI / 2);
      ctx.fillText(I18N.t("sa.diam") + " = " + diam.toFixed(1) + " " + I18N.t("sa.units"), 0, 0);
      ctx.restore();
    });

    upd();

    /* ---- the headline equation ---- */
    function drawEquation(ctx, W, midY) {
      var lang = I18N.getLang();
      var k = lang === "id" ? "206.265" : "206,265";
      var a = "α  =  " + k + "  ×  ";
      var b = "  =  " + approxArcsec().toFixed(1) + " " + I18N.t("sa.arcsec");
      var num = I18N.t("sa.num"), den = I18N.t("sa.den");
      ctx.textBaseline = "middle";
      ctx.font = "18px Georgia, serif"; var wa = ctx.measureText(a).width, wb = ctx.measureText(b).width;
      ctx.font = "14px Georgia, serif";
      var wf = Math.max(ctx.measureText(num).width, ctx.measureText(den).width) + 16;
      var total = wa + wf + wb, x = (W - total) / 2;

      ctx.fillStyle = "#e8ecf8"; ctx.textAlign = "left"; ctx.font = "18px Georgia, serif";
      ctx.fillText(a, x, midY);
      // fraction
      var fx = x + wa, fcx = fx + wf / 2;
      ctx.font = "14px Georgia, serif"; ctx.textAlign = "center";
      ctx.fillText(num, fcx, midY - 11);
      ctx.fillText(den, fcx, midY + 11);
      ctx.strokeStyle = "#e8ecf8"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(fx + 4, midY); ctx.lineTo(fx + wf - 4, midY); ctx.stroke();
      // result
      ctx.font = "18px Georgia, serif"; ctx.textAlign = "left";
      ctx.fillStyle = "#ffd166"; ctx.fillText(b, fx + wf, midY);
      ctx.textBaseline = "alphabetic";
    }

    function drawObserver(ctx, x, y) {
      ctx.fillStyle = "#cfe0ff";
      ctx.beginPath(); ctx.arc(x, y, 9, 0, 2 * Math.PI); ctx.fill();          // head
      ctx.fillStyle = "#3b6fd6";
      roundRect(ctx, x - 9, y + 8, 18, 34, 7); ctx.fill();                    // body
      ctx.strokeStyle = "#3b6fd6"; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x + 5, y + 16); ctx.lineTo(x + 22, y + 6); ctx.stroke();  // arm
      ctx.lineCap = "butt";
    }

    function drawObject(ctx, x, y, r) {
      r = Math.max(4, r);
      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
      g.addColorStop(0, "#ffe0a3"); g.addColorStop(1, "#e8794f");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
      // beach-ball stripes
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1;
      for (var i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.ellipse(x, y, Math.max(1, r * Math.abs(i) * 0.55 + (i === 0 ? 0 : 0)), r, 0, 0, 2 * Math.PI);
        if (i === 0) { ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); }
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
    }

    function fmtAngle(rad) {
      var deg = rad * 180 / Math.PI;
      if (deg >= 1) return deg.toFixed(2) + "°";
      var arcmin = deg * 60;
      if (arcmin >= 1) return arcmin.toFixed(2) + "′";
      return (arcmin * 60).toFixed(1) + "″";
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
