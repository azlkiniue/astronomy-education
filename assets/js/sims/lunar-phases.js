/* Lunar Phase Simulator ---------------------------------------------------- */
Sim.create({
  id: "lunar-phases",
  width: 760, height: 470,
  strings: {
    en: {
      "lp.ctl": "Moon in its orbit", "lp.angle": "Position in orbit", "lp.options": "Options",
      "lp.sight": "Show sight line to Moon", "lp.label": "Label the phase",
      "lp.phase": "Phase", "lp.illum": "Illuminated", "lp.day": "Day of cycle", "lp.elong": "Elongation",
      "lp.space": "View from space", "lp.earth": "View from Earth",
      "ph.new": "New Moon", "ph.wc": "Waxing Crescent", "ph.fq": "First Quarter",
      "ph.wg": "Waxing Gibbous", "ph.full": "Full Moon", "ph.ng": "Waning Gibbous",
      "ph.lq": "Last Quarter", "ph.wn": "Waning Crescent"
    },
    id: {
      "lp.ctl": "Bulan di orbitnya", "lp.angle": "Posisi di orbit", "lp.options": "Opsi",
      "lp.sight": "Tampilkan garis pandang ke Bulan", "lp.label": "Beri label fase",
      "lp.phase": "Fase", "lp.illum": "Tersinari", "lp.day": "Hari ke-", "lp.elong": "Elongasi",
      "lp.space": "Tampak dari angkasa", "lp.earth": "Tampak dari Bumi",
      "ph.new": "Bulan Baru", "ph.wc": "Sabit Awal", "ph.fq": "Kuartal Pertama",
      "ph.wg": "Cembung Awal", "ph.full": "Bulan Purnama", "ph.ng": "Cembung Akhir",
      "ph.lq": "Kuartal Akhir", "ph.wn": "Sabit Akhir"
    }
  },
  about: {
    en: "<p>Half of the Moon is always lit by the Sun — but from Earth we see that lit half from a changing angle as the Moon orbits us. " +
        "That changing viewing geometry, <em>not</em> Earth's shadow, is what makes the phases.</p>" +
        "<h3>Reading the diagram</h3><p>Sunlight streams in from the right, so the Moon's right hemisphere is always day. " +
        "When the Moon is between Earth and Sun we look at its night side (<strong>New</strong>); on the far side we see its full day side (<strong>Full</strong>).</p>" +
        "<p>The cycle from new moon to new moon — the <strong>synodic month</strong> — takes about 29.5 days.</p>",
    id: "<p>Separuh Bulan selalu disinari Matahari — tetapi dari Bumi kita melihat separuh yang tersinari itu dari sudut yang berubah saat Bulan mengorbit kita. " +
        "Geometri pandang yang berubah inilah, <em>bukan</em> bayangan Bumi, yang menciptakan fase.</p>" +
        "<h3>Membaca diagram</h3><p>Sinar matahari datang dari kanan, jadi belahan kanan Bulan selalu siang. " +
        "Ketika Bulan berada di antara Bumi dan Matahari kita melihat sisi malamnya (<strong>Baru</strong>); di sisi jauh kita melihat sisi siangnya penuh (<strong>Purnama</strong>).</p>" +
        "<p>Siklus dari bulan baru ke bulan baru — <strong>bulan sinodis</strong> — memakan waktu sekitar 29,5 hari.</p>"
  },
  build: function (S) {
    var theta = 90;            // degrees, CCW from Sun direction (+x). 0 = new
    var anim = S.loop(function (dt) { theta = (theta + dt * 30) % 360; angCtl.set(theta); });

    S.group("lp.ctl");
    var angCtl = S.slider({
      labelKey: "lp.angle", min: 0, max: 360, value: theta, step: 1,
      format: function (v) { return Math.round(v) + "°"; },
      on: function (v) { theta = v; upd(); }
    });
    S.playPause(anim);
    S.group("lp.options");
    var showSight = S.toggle({ labelKey: "lp.sight", value: true });
    var showLabel = S.toggle({ labelKey: "lp.label", value: true });

    var outPhase = S.readout({ labelKey: "lp.phase" });
    var outIllum = S.readout({ labelKey: "lp.illum" });
    var outDay = S.readout({ labelKey: "lp.day" });
    var outElong = S.readout({ labelKey: "lp.elong" });

    function phaseKey(p) {
      var e = 0.02;
      if (p < e || p > 1 - e) return "ph.new";
      if (Math.abs(p - 0.25) < e) return "ph.fq";
      if (Math.abs(p - 0.5) < e) return "ph.full";
      if (Math.abs(p - 0.75) < e) return "ph.lq";
      if (p < 0.25) return "ph.wc"; if (p < 0.5) return "ph.wg";
      if (p < 0.75) return "ph.ng"; return "ph.wn";
    }
    function upd() {
      var p = theta / 360;
      var f = (1 - Math.cos(theta * Math.PI / 180)) / 2;
      outPhase(I18N.t(phaseKey(p)));
      outIllum((f * 100).toFixed(0) + "%");
      outDay((p * 29.53).toFixed(1));
      outElong(Math.round(theta) + "°");
      S.requestDraw();
    }
    window.addEventListener("langchange", function () {
      outPhase(I18N.t(phaseKey(theta / 360)));
    });

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      // panel split
      var splitX = 470;
      var cx = 210, cy = H / 2, R = 135;     // space view: Earth center & moon orbit radius
      var th = theta * Math.PI / 180;
      var mx = cx + R * Math.cos(th), my = cy - R * Math.sin(th);

      // ---- sunlight from the right ----
      ctx.strokeStyle = "rgba(255,209,102,0.5)"; ctx.lineWidth = 2;
      for (var y = 40; y < H - 20; y += 34) {
        ctx.beginPath(); ctx.moveTo(splitX - 12, y); ctx.lineTo(cx + R + 30, y);
        ctx.lineTo(cx + R + 22, y - 5); ctx.moveTo(cx + R + 30, y); ctx.lineTo(cx + R + 22, y + 5);
        ctx.stroke();
      }
      ctx.fillStyle = "#ffd166"; ctx.font = "12px system-ui"; ctx.textAlign = "right";
      ctx.fillText("☀ " + (I18N.getLang() === "id" ? "sinar Matahari" : "sunlight"), splitX - 14, 26);

      // ---- moon orbit ----
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

      // ---- Earth (right half lit) ----
      halfLitDisk(ctx, cx, cy, 26, "#3b6fd6", "#16315f");

      // sight line
      if (showSight.value()) {
        ctx.strokeStyle = "rgba(110,168,254,0.7)"; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(mx, my); ctx.stroke(); ctx.setLineDash([]);
      }

      // ---- Moon (right half lit) in space view ----
      halfLitDisk(ctx, mx, my, 13, "#e9eefb", "#2a3252");

      // labels
      ctx.fillStyle = "#9fabce"; ctx.font = "12px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lp.space"), cx, H - 12);

      // ---- View from Earth (phase) ----
      var ex = (splitX + W) / 2, ey = H / 2 - 6, er = 92;
      ctx.fillStyle = "#0a0e1c"; ctx.strokeStyle = "#2c3a66";
      roundRect(ctx, splitX + 14, 24, W - splitX - 28, H - 48, 12); ctx.fill(); ctx.stroke();
      moonPhase(ctx, ex, ey, er, theta / 360);
      ctx.fillStyle = "#9fabce"; ctx.textAlign = "center"; ctx.font = "12px system-ui";
      ctx.fillText(I18N.t("lp.earth"), ex, H - 12);
      if (showLabel.value()) {
        ctx.fillStyle = "#e8ecf8"; ctx.font = "bold 14px system-ui";
        ctx.fillText(I18N.t(phaseKey(theta / 360)), ex, ey - er - 6);
      }
    });

    upd();

    /* draw a disk whose right hemisphere faces the Sun (lit) */
    function halfLitDisk(ctx, x, y, r, litCol, darkCol) {
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.clip();
      ctx.fillStyle = darkCol; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
      ctx.fillStyle = litCol; ctx.fillRect(x, y - r, r, 2 * r);
      ctx.restore();
      ctx.strokeStyle = "#0b1020"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
    }

    /* Moon phase as seen from Earth. phase: 0=new .25=first qtr .5=full .75=last qtr.
       Lit region = everything to the right of the terminator ellipse; waning phases
       are drawn by mirroring the equivalent waxing phase. */
    function moonPhase(ctx, cx, cy, r, phase) {
      ctx.save(); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * Math.PI); ctx.fillStyle = "#191f33"; ctx.fill();
      var p = ((phase % 1) + 1) % 1;
      if (p > 0.5) { ctx.scale(-1, 1); p = 1 - p; }       // mirror waning -> waxing
      var s = Math.cos(2 * Math.PI * p);                  // +1 new -> 0 quarter -> -1 full
      ctx.beginPath();
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false); // bright right limb (top->bottom)
      ctx.save(); ctx.scale(s === 0 ? 1e-4 : s, 1);
      ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2, true);  // terminator (bottom->top via +x)
      ctx.restore();
      ctx.closePath();
      ctx.fillStyle = "#e9eefb"; ctx.fill();
      ctx.restore();
      // rim drawn unmirrored
      ctx.save(); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * Math.PI); ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
