/* EM Spectrum Module ---------------------------------------------------------
   Rebuild of the ClassAction "EM Spectrum Module" (emspectrum.swf, decompiled),
   kept in the site's dark style but laid out like the SWF's own stage:
     • the SWF's spectrum bar (its bitmap: the blue bar with the white
       atmospheric-opacity profile, the wavelength scale above and the red
       frequency scale below, its labels lightened for the dark page) and its
       blue handle, 25 px per decade from 10⁻¹⁷ to 10⁷ m,
     • "Blackbody Color" — the colour of a blackbody whose Wien peak is at the
       handle (T = 0.002898 m·K / λ, the SWF's colour fit),
     • the Spectrum Screen — wavelength, frequency (c = 3×10⁸ m/s) and photon
       energy (the SWF's h = 6.6×10⁻³⁴ J·s) to four significant figures, and the
       band: gamma rays < 10⁻¹² m < X-rays < 10⁻⁹ m < ultraviolet < 400 nm <
       visible < 750 nm < near-infrared < 2.5 µm < infrared < 25 µm < microwave
       < 1 mm < radio,
     • the three pictures for that band — something of that size, an
       instrument that observes it, and an astronomy picture taken in it — the
       SWF's own photos and captions.
   Inside each decade the SWF's wavelength runs linearly (1 × 10ⁿ at the decade's
   start, reaching 10 × 10ⁿ nine-tenths of the way across), exactly as here.
   Drag the handle (or anywhere on the bar); the sidebar mirrors it.         */
Sim.create({
  id: "em-spectrum",
  width: 800, height: 650,
  strings: {
    en: {
      "em.band": "Jump to band", "em.tune": "Wavelength", "em.wl": "handle position",
      "em.screen": "Spectrum Screen", "em.bb": "Blackbody Color",
      "em.size": "Size", "em.inst": "Instrument", "em.pic": "Astronomy Picture",
      "em.wave": "Wavelength = {m} × 10", "em.freq": "Frequency = {m} × 10", "em.energy": "E = h × f = {m} × 10",
      "em.m": "m", "em.hz": "Hz", "em.joule": "Joule",
      "em.gamma": "Gamma-rays", "em.xray": "X-rays", "em.uv": "Ultraviolet", "em.vis": "Visible",
      "em.nir": "Near-infrared", "em.ir": "Infrared", "em.micro": "Microwave", "em.radio": "Radio waves",
      "em.cap": "Carbon Nucleus|Compton Gamma-Ray Observatory|False Color Gamma-Ray Image of Galaxy 3C279|Helium Atom|Chandra X-Ray Observer|X-Ray Image of the Orion Region|Bacteria|Extreme Ultraviolet Explorer|Ultraviolet image of the Spiral Galaxy M74|Dust|Hubble Space Telescope|Visual Image of Spiral Galaxy M51|Pin-head|Artists Conception of IRAS|Infrared Image of the Orion Nebula|Fingernail|Owens Valley Microwave Telescope|False color image of the cosmic microwave background|Mountain|A Radio Telescope|Radio Image of Spiral Galaxy M51"
    },
    id: {
      "em.band": "Lompat ke pita", "em.tune": "Panjang gelombang", "em.wl": "posisi pegangan",
      "em.screen": "Layar Spektrum", "em.bb": "Warna Benda Hitam",
      "em.size": "Ukuran", "em.inst": "Instrumen", "em.pic": "Citra Astronomi",
      "em.wave": "Panjang gelombang = {m} × 10", "em.freq": "Frekuensi = {m} × 10", "em.energy": "E = h × f = {m} × 10",
      "em.m": "m", "em.hz": "Hz", "em.joule": "Joule",
      "em.gamma": "Sinar gamma", "em.xray": "Sinar-X", "em.uv": "Ultraungu", "em.vis": "Cahaya tampak",
      "em.nir": "Inframerah dekat", "em.ir": "Inframerah", "em.micro": "Gelombang mikro", "em.radio": "Gelombang radio",
      "em.cap": "Inti karbon|Observatorium Sinar Gamma Compton|Citra sinar gamma berwarna semu Galaksi 3C279|Atom helium|Observatorium Sinar-X Chandra|Citra sinar-X wilayah Orion|Bakteri|Extreme Ultraviolet Explorer|Citra ultraungu Galaksi Spiral M74|Debu|Teleskop Antariksa Hubble|Citra tampak Galaksi Spiral M51|Kepala peniti|Gambaran seniman tentang IRAS|Citra inframerah Nebula Orion|Kuku jari|Teleskop Gelombang Mikro Owens Valley|Citra berwarna semu latar belakang gelombang mikro kosmik|Gunung|Sebuah teleskop radio|Citra radio Galaksi Spiral M51"
    }
  },
  about: {
    en: "<p>Visible light is a tiny slice of the <strong>electromagnetic spectrum</strong> — the same kind of wave stretches from gamma rays smaller than an atomic nucleus out to radio waves longer than a mountain. They differ only in <strong>wavelength</strong> (and so frequency and energy).</p>" +
        "<p>Drag the handle across the bar. Frequency is <em>f = c / λ</em> and the photon energy is <em>E = h·f</em>, so short waves on the left are high-energy and long waves on the right are low-energy. The white profile on the bar shows where Earth's atmosphere blocks the light — only the optical and radio windows reach the ground.</p>" +
        "<p>The three pictures show something about the size of the wavelength, an instrument that observes it, and what the sky looks like in it. The <strong>blackbody colour</strong> is the colour of a hot object whose thermal glow peaks at the handle — by Wien's law, hotter means bluer and shorter.</p>",
    id: "<p>Cahaya tampak hanyalah irisan kecil <strong>spektrum elektromagnetik</strong> — gelombang serupa terbentang dari sinar gamma yang lebih kecil dari inti atom hingga gelombang radio yang lebih panjang dari gunung. Mereka hanya berbeda <strong>panjang gelombang</strong> (dan karenanya frekuensi serta energi).</p>" +
        "<p>Seret pegangan melintasi pita. Frekuensi adalah <em>f = c / λ</em> dan energi foton <em>E = h·f</em>, jadi gelombang pendek di kiri berenergi tinggi dan gelombang panjang di kanan berenergi rendah. Profil putih pada pita menunjukkan bagian yang dihalangi atmosfer Bumi — hanya jendela optik dan radio yang sampai ke tanah.</p>" +
        "<p>Ketiga gambar menunjukkan sesuatu seukuran panjang gelombang itu, instrumen yang mengamatinya, dan rupa langit pada panjang gelombang itu. <strong>Warna benda hitam</strong> adalah warna benda panas yang puncak pancarannya di pegangan — menurut hukum Wien, makin panas makin biru dan pendek.</p>"
  },
  build: function (S) {
    var UI = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
    function t(k) { return I18N.t(k); }
    function fmt(k, o) { return t(k).replace(/\{(\w+)\}/g, function (m, n) { return o[n]; }); }

    /* ---------------- the SWF's model (onClipEvent(enterFrame) of the handle) ---------------- */
    var X0 = 526, XMIN = X0 - 425, XMAX = X0 + 175, HANDLE_Y = 116;
    var BANDS = [                                  // [max wavelength, status, picture frame]
      [1e-12, "em.gamma", 0], [1e-9, "em.xray", 1], [4e-7, "em.uv", 2], [7.5e-7, "em.vis", 3],
      [2.5e-6, "em.nir", 4], [2.5e-5, "em.ir", 4], [1e-3, "em.micro", 5], [Infinity, "em.radio", 6]
    ];
    var handleX = X0, band = 7, status = "em.radio", frame = 6;
    function wavelength(x) {
      var tm = x - X0, n = Math.floor(tm / 25), f = (tm - 25 * n) / 25;
      var w = Math.pow(10, n) + f * Math.pow(10, n + 1);
      return Math.min(w, Math.pow(10, n + 1));
    }
    function update() {
      var w = wavelength(handleX), i, pick = -1;
      for (i = 0; i < BANDS.length; i++) {
        var lo = i ? BANDS[i - 1][0] : 0;
        if (w > lo && w < BANDS[i][0]) { pick = i; break; }
        // exactly on a boundary the SWF changes nothing (the band the handle came from stays);
        // a jump from further away (sidebar) takes the band below
        if (w === BANDS[i][0]) { pick = band === i || band === i + 1 ? band : i; break; }
      }
      if (pick < 0) return;
      band = pick; status = BANDS[pick][1]; frame = BANDS[pick][2];
    }
    function toScientific(num) {                   // Math.toScientific(num, 4): a 3-decimal mantissa
      var e = num === 0 ? 0 : Math.floor(Math.log(Math.abs(num)) / Math.LN10), m = num / Math.pow(10, e);
      var s = String(Math.round(m * 1000) / 1000);
      if (s.indexOf(".") < 0) s += ".0";
      while (s.split(".")[1].length < 3) s += "0";
      return { m: s, e: e };
    }
    function colorFromTemp(T) {                    // getColorFromTemp, clamped 700–240 000 K
      T = Math.min(240000, Math.max(700, T));
      var l = Math.log(T) / Math.LN10, l2 = l * l, l3 = l * l2;
      var r = Math.min(255, Math.max(0, 22686.34111 - l * 15082.52755 + l2 * 3375.333832 - l3 * 252.4073853));
      var g = T > 6500 ? 13836.23586 - l * 9069.078214 + l2 * 2015.254756 - l3 * 149.7766966
        : -811.6499145 + l * 36.97365953 + l2 * 160.7861677 - l3 * 25.57573664;
      g = Math.min(255, Math.max(0, g));
      var b = Math.min(255, Math.max(0, -11545.34298 + l * 8529.658165 - l2 * 2150.198586 + l3 * 190.0306573));
      return [Math.floor(r), Math.floor(g), Math.floor(b)];
    }

    /* ---------------- images: the bar, the handle, the photo atlas ---------------- */
    function img(src) { var i = new Image(); i.onload = function () { S.requestDraw(); }; i.src = src; return i; }
    var BAR = img("../assets/img/sims/em-spectrum-bar.webp");
    var HANDLE = img("../assets/img/sims/em-spectrum-handle.webp");
    var PHOTOS = img("../assets/img/sims/em-spectrum-photos.webp");   // 3 × 7 tiles of 200 px: pic1a … pic7c

    /* ---------------- drawing ---------------- */
    function rr(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function sciLine(ctx, key, num, unit, x, y) {  // "Wavelength = 1.000 × 10⁰ m"
      var p = toScientific(num);
      ctx.font = "16px " + UI; ctx.textAlign = "left";
      var head = fmt(key, { m: p.m }), w = ctx.measureText(head).width;
      ctx.fillStyle = "#e8ecf8"; ctx.fillText(head, x, y);
      ctx.font = "11px " + UI; ctx.fillStyle = "#9be7c0";
      var es = String(p.e).replace("-", "−"), ew = ctx.measureText(es).width;
      ctx.fillText(es, x + w + 1, y - 8);
      ctx.font = "16px " + UI; ctx.fillStyle = "#e8ecf8";
      ctx.fillText(" " + t(unit), x + w + 2 + ew, y);
    }
    function wrapCentered(ctx, text, cx, y, maxw, lh) {
      var words = text.split(" "), line = "", lines = [];
      words.forEach(function (wd) { var tst = line ? line + " " + wd : wd; if (ctx.measureText(tst).width > maxw && line) { lines.push(line); line = wd; } else line = tst; });
      lines.push(line);
      lines.slice(0, 2).forEach(function (l, i) { ctx.fillText(l, cx, y + i * lh); });
    }

    S.onDraw(function () {
      var ctx = S.ctx, w = wavelength(handleX);
      ctx.clearRect(0, 0, S.W, S.H);
      // the stage: one rounded dark card, as the SWF's glossy background
      rr(ctx, 4, 1, 791, 645, 18);
      var bg = ctx.createLinearGradient(0, 0, 0, 646);
      bg.addColorStop(0, "#111a37"); bg.addColorStop(1, "#0a1027");
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      // the spectrum bar (the SWF's bitmap) and the handle
      if (BAR.complete && BAR.naturalWidth) ctx.drawImage(BAR, 95, 42);
      if (HANDLE.complete && HANDLE.naturalWidth) ctx.drawImage(HANDLE, handleX - 8, HANDLE_Y - 34);
      // Blackbody Color
      ctx.font = "12px " + UI; ctx.fillStyle = "#9fabce"; ctx.textAlign = "left";
      ctx.fillText(t("em.bb"), 568, 203);
      var c = colorFromTemp(0.002898 / w), cx = 682.6, cy = 198.6;
      var sw = ctx.createRadialGradient(cx - 3, cy - 3, 1, cx, cy, 9);
      sw.addColorStop(0, "rgb(" + c.map(function (v) { return Math.min(255, v + 60); }).join(",") + ")");
      sw.addColorStop(1, "rgb(" + c.join(",") + ")");
      ctx.fillStyle = sw; ctx.beginPath(); ctx.arc(cx, cy, 8.6, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "rgba(232,236,248,0.35)"; ctx.stroke();
      // the Spectrum Screen
      rr(ctx, 49, 214, 702, 160, 10);
      var sg = ctx.createLinearGradient(0, 214, 0, 374);
      sg.addColorStop(0, "rgba(64,190,140,0.20)"); sg.addColorStop(0.5, "rgba(30,120,90,0.16)"); sg.addColorStop(1, "rgba(64,190,140,0.24)");
      ctx.fillStyle = "#0b1a24"; ctx.fill(); ctx.fillStyle = sg; ctx.fill();
      ctx.strokeStyle = "rgba(105,219,160,0.45)"; ctx.stroke();
      ctx.font = "14px " + UI; ctx.fillStyle = "#9be7c0"; ctx.textAlign = "center";
      ctx.fillText(t("em.screen"), 403, 240);
      sciLine(ctx, "em.wave", w, "em.m", 83, 282);
      sciLine(ctx, "em.freq", 300000000 / w, "em.hz", 83, 317);
      sciLine(ctx, "em.energy", 6.6e-34 * (300000000 / w), "em.joule", 83, 352);
      ctx.font = "600 16px " + UI; ctx.fillStyle = "#e8ecf8"; ctx.textAlign = "right";
      ctx.fillText(t(status), 702, 282);
      // the three pictures with their headers and captions
      var caps = t("em.cap").split("|");
      [["em.size", 51], ["em.inst", 301], ["em.pic", 551]].forEach(function (col, k) {
        var x = col[1];
        ctx.font = "16px " + UI; ctx.fillStyle = "#cbd6f0"; ctx.textAlign = "center";
        ctx.fillText(t(col[0]), x + 100, 402);
        rr(ctx, x - 4, 411, 208, 208, 8); ctx.fillStyle = "#070b16"; ctx.fill();
        ctx.strokeStyle = "#2c3a66"; ctx.stroke();
        if (PHOTOS.complete && PHOTOS.naturalWidth) {
          ctx.save(); rr(ctx, x, 415, 200, 200, 5); ctx.clip();
          ctx.drawImage(PHOTOS, k * 200, frame * 200, 200, 200, x, 415, 200, 200);
          ctx.restore();
        }
        ctx.font = "11px " + UI; ctx.fillStyle = "#cbd6f0";
        wrapCentered(ctx, caps[frame * 3 + k], x + 100, 628, 200, 12);
      });
    });

    /* ---------------- dragging the handle (or pressing on the bar) ---------------- */
    var drag = null;
    function at(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height }; }
    function onBar(p) { return p.x >= XMIN - 10 && p.x <= XMAX + 10 && p.y >= 70 && p.y <= 160; }
    function setX(x) { handleX = Math.round(Math.min(XMAX, Math.max(XMIN, x))); update(); sync(); S.requestDraw(); }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (!onBar(p)) return;
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      drag = { off: Math.abs(p.x - handleX) <= 8 ? p.x - handleX : 0 };
      setX(p.x - drag.off);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) { S.canvas.style.cursor = onBar(p) ? "ew-resize" : "default"; return; }
      setX(p.x - drag.off);
    });
    function release() { drag = null; }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", release);

    /* ---------------- the sidebar ---------------- */
    var syncing = false;
    S.group("em.tune");
    var posCtl = S.slider({ labelKey: "em.wl", min: XMIN, max: XMAX, step: 1, value: handleX,
      format: function (v) { var p = toScientific(wavelength(v)); return p.m + "×10" + String(p.e).replace("-", "−") + " m"; },
      on: function (v) { if (!syncing) setX(v); } });
    S.group("em.band");
    // handle offsets (px from 1 m) that sit inside each band: 3×10⁻¹³, 10⁻¹⁰, 10⁻⁸, 5.4×10⁻⁷, 10⁻⁶, 10⁻⁵, 5.8×10⁻⁴, 1 m
    [["em.gamma", -320], ["em.xray", -250], ["em.uv", -200], ["em.vis", -164], ["em.nir", -150], ["em.ir", -125], ["em.micro", -88], ["em.radio", 0]].forEach(function (b) {
      S.button({ labelKey: b[0], on: function () { setX(X0 + b[1]); } });
    });
    function sync() { syncing = true; if (posCtl.value() !== handleX) posCtl.set(handleX); syncing = false; }
    update();
  }
});
