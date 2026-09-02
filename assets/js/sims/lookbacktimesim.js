/* Lookback Time Simulator -----------------------------------------------------
   Faithful rebuild of the ClassAction "Lookback Time Simulator"
   (lookbacktimesim.swf).  An observer on Earth and a distant star are shown.
   The user sets when a supernova occurs at the star; pressing "go supernova"
   launches the light signal, which crosses the intervening distance at c.
   Because the star is thousands of light-years away, the observer doesn't
   see the event until thousands of years later — the lookback time concept.
   A timeline (BC/AD) tracks the explosion event and when the light arrives. */
Sim.create({
  id: "lookbacktimesim",
  width: 760, height: 500,
  strings: {
    en: {
      "lb.dist": "distance (light-years)", "lb.snYear": "supernova occurs",
      "lb.go": "go supernova", "lb.reset": "reset",
      "lb.observer": "Observer", "lb.star": "Star",
      "lb.arrives": "light arrives", "lb.status": "status",
      "lb.waiting": "waiting…", "lb.boom": "supernova!",
      "lb.traveling": "light traveling…", "lb.seen": "observer sees supernova!",
      "lb.ly": "ly", "lb.ad": "AD", "lb.bc": "BC"
    },
    id: {
      "lb.dist": "jarak (tahun cahaya)", "lb.snYear": "supernova terjadi",
      "lb.go": "ledakkan supernova", "lb.reset": "atur ulang",
      "lb.observer": "Pengamat", "lb.star": "Bintang",
      "lb.arrives": "cahaya tiba", "lb.status": "status",
      "lb.waiting": "menunggu…", "lb.boom": "supernova!",
      "lb.traveling": "cahaya merambat…", "lb.seen": "pengamat melihat supernova!",
      "lb.ly": "tc", "lb.ad": "M", "lb.bc": "SM"
    }
  },
  about: {
    en: "<p>Light travels at a finite speed — about 300 000 km/s. Across everyday distances this is practically instantaneous, but astronomical distances are so vast that light takes years, centuries, or millennia to reach us.</p>" +
        "<p>A <strong>lookback time</strong> is the travel time of the light we see. When we observe a star 3 000 light-years away, we see it as it was 3 000 years ago. A supernova that occurred there in 1200 AD would not be visible from Earth until 4200 AD.</p>",
    id: "<p>Cahaya merambat dengan kecepatan terbatas — sekitar 300 000 km/s. Pada jarak sehari-hari ini praktis seketika, tetapi jarak astronomis sangat besar sehingga cahaya memerlukan tahun, abad, atau milenium untuk mencapai kita.</p>" +
        "<p><strong>Waktu tilik-balik</strong> adalah waktu tempuh cahaya yang kita amati. Saat mengamati bintang 3 000 tahun cahaya, kita melihatnya seperti 3 000 tahun lalu. Supernova yang terjadi di sana pada 1200 M tidak akan terlihat dari Bumi hingga 4200 M.</p>"
  },
  build: function (S) {
    var ctx = S.ctx, W = S.W, H = S.H;

    // scene layout
    var SCENE = { x: 30, y: 30, w: 700, h: 220 };
    var TL    = { x: 30, y: 290, w: 700, h: 80 };

    var P = {
      dist: 3000,
      snYear: 1200,
      phase: "idle",   // idle | exploded | traveling | arrived
      lightFrac: 0,
      arriveYear: 0
    };

    var distC = S.slider({ labelKey: "lb.dist", min: 500, max: 10000, step: 100, value: P.dist,
      format: function (v) { return v + " " + I18N.t("lb.ly"); },
      on: function (v) { P.dist = v; resetSim(); }
    });
    var snYearC = S.slider({ labelKey: "lb.snYear", min: -5000, max: 5000, step: 50, value: P.snYear,
      format: function (v) { return fmtYear(v); },
      on: function (v) { P.snYear = v; resetSim(); }
    });

    var oStatus  = S.readout({ labelKey: "lb.status" });
    var oArrives = S.readout({ labelKey: "lb.arrives" });

    S.button({ labelKey: "lb.go", primary: true, on: function () {
      if (P.phase !== "idle") return;
      P.phase = "exploded";
      P.lightFrac = 0;
      P.arriveYear = P.snYear + P.dist;
      oArrives(fmtYear(P.arriveYear));
      setTimeout(function () { P.phase = "traveling"; loop.play(); S.requestDraw(); }, 600);
      S.requestDraw();
    }});
    S.button({ labelKey: "lb.reset", on: function () { resetSim(); }});

    function resetSim() {
      P.phase = "idle"; P.lightFrac = 0;
      loop.pause();
      oStatus("–");
      oArrives("–");
      S.requestDraw();
    }

    var loop = S.loop(function (dt) {
      if (P.phase === "traveling") {
        P.lightFrac += dt * 0.4;
        if (P.lightFrac >= 1) {
          P.lightFrac = 1;
          P.phase = "arrived";
          loop.pause();
        }
      }
    });

    function fmtYear(y) {
      if (y >= 1) return Math.round(y) + " " + I18N.t("lb.ad");
      if (y <= 0) return Math.abs(Math.round(y)) + " " + I18N.t("lb.bc");
      return "1 " + I18N.t("lb.ad");
    }

    S.onDraw(function () {
      S.clear();

      // --- scene ---
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(SCENE.x, SCENE.y, SCENE.w, SCENE.h);

      var starX  = SCENE.x + 80;
      var starY  = SCENE.y + SCENE.h * 0.45;
      var obsX   = SCENE.x + SCENE.w - 80;
      var obsY   = SCENE.y + SCENE.h * 0.55;

      // distance bracket
      ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1;
      var bY = SCENE.y + SCENE.h - 25;
      ctx.beginPath(); ctx.moveTo(starX, bY); ctx.lineTo(obsX, bY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(starX, bY - 6); ctx.lineTo(starX, bY + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(obsX, bY - 6); ctx.lineTo(obsX, bY + 6); ctx.stroke();
      ctx.fillStyle = "#ccc"; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(P.dist + " " + I18N.t("lb.ly"), (starX + obsX) / 2, bY + 18);

      // star
      if (P.phase === "exploded" || (P.phase === "traveling" && P.lightFrac < 0.15)) {
        // supernova flash
        var flashR = 25 + Math.random() * 8;
        var fg = ctx.createRadialGradient(starX, starY, 2, starX, starY, flashR);
        fg.addColorStop(0, "#ffffcc");
        fg.addColorStop(0.4, "#ffaa33");
        fg.addColorStop(1, "rgba(255,100,0,0)");
        ctx.beginPath(); ctx.arc(starX, starY, flashR, 0, Math.PI * 2);
        ctx.fillStyle = fg; ctx.fill();
      } else {
        // normal star
        var sg = ctx.createRadialGradient(starX, starY, 1, starX, starY, 12);
        sg.addColorStop(0, "#ffffdd");
        sg.addColorStop(0.5, "#ffcc44");
        sg.addColorStop(1, "rgba(255,200,50,0)");
        ctx.beginPath(); ctx.arc(starX, starY, 12, 0, Math.PI * 2);
        ctx.fillStyle = sg; ctx.fill();
      }

      // star label
      ctx.fillStyle = "#ffdd88"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lb.star"), starX, starY - 20);

      // observer (stick figure)
      drawObserver(ctx, obsX, obsY, P.phase === "arrived");
      ctx.fillStyle = "#88bbff"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lb.observer"), obsX, obsY - 30);

      // light wave traveling
      if (P.phase === "traveling" || P.phase === "arrived") {
        var lx = starX + (obsX - starX) * P.lightFrac;
        var ly = starY + (obsY - starY) * P.lightFrac;

        // trail
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,100,0.3)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(starX, starY); ctx.lineTo(lx, ly); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // light wavefront
        if (P.phase === "traveling") {
          var wg = ctx.createRadialGradient(lx, ly, 1, lx, ly, 10);
          wg.addColorStop(0, "#ffffaa");
          wg.addColorStop(1, "rgba(255,255,150,0)");
          ctx.beginPath(); ctx.arc(lx, ly, 10, 0, Math.PI * 2);
          ctx.fillStyle = wg; ctx.fill();
        }
      }

      // thought bubble for arrived
      if (P.phase === "arrived") {
        ctx.save();
        var bx = obsX - 35, by = obsY - 55;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1;
        // bubble
        ctx.beginPath();
        ctx.ellipse(bx, by, 22, 16, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        // small circles leading to head
        ctx.beginPath(); ctx.arc(bx + 15, by + 18, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx + 20, by + 24, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // star in bubble
        drawSmallStar(ctx, bx - 2, by, 6, "#ff8800");
        ctx.restore();
      }

      ctx.restore();

      // --- timeline ---
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(TL.x, TL.y, TL.w, TL.h);

      var tlMinYear = Math.min(P.snYear - P.dist * 0.2, -8000);
      var tlMaxYear = Math.max(P.snYear + P.dist * 1.3, 10000);
      function yearToX(y) { return TL.x + (y - tlMinYear) / (tlMaxYear - tlMinYear) * TL.w; }

      // axis line
      var axY = TL.y + 35;
      ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(TL.x, axY); ctx.lineTo(TL.x + TL.w, axY); ctx.stroke();

      // arrows
      ctx.fillStyle = "#888";
      ctx.beginPath(); ctx.moveTo(TL.x, axY); ctx.lineTo(TL.x + 8, axY - 4); ctx.lineTo(TL.x + 8, axY + 4); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(TL.x + TL.w, axY); ctx.lineTo(TL.x + TL.w - 8, axY - 4); ctx.lineTo(TL.x + TL.w - 8, axY + 4); ctx.closePath(); ctx.fill();

      // tick marks
      ctx.fillStyle = "#aaa"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      var step = bestStep(tlMaxYear - tlMinYear);
      var firstTick = Math.ceil(tlMinYear / step) * step;
      for (var ty = firstTick; ty <= tlMaxYear; ty += step) {
        var tx = yearToX(ty);
        if (tx < TL.x + 15 || tx > TL.x + TL.w - 15) continue;
        ctx.beginPath(); ctx.moveTo(tx, axY - 3); ctx.lineTo(tx, axY + 3); ctx.stroke();
        ctx.fillText(fmtYear(ty), tx, axY + 16);
      }

      // SN marker
      var snX = yearToX(P.snYear);
      ctx.fillStyle = "#ff6633"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
      ctx.beginPath(); ctx.moveTo(snX, axY - 5); ctx.lineTo(snX - 6, axY - 16); ctx.lineTo(snX + 6, axY - 16); ctx.closePath(); ctx.fill();
      ctx.fillText("SN", snX, axY - 20);

      // arrival marker
      if (P.phase !== "idle") {
        var arrX = yearToX(P.arriveYear);
        ctx.fillStyle = "#44cc88";
        ctx.beginPath(); ctx.moveTo(arrX, axY - 5); ctx.lineTo(arrX - 6, axY - 16); ctx.lineTo(arrX + 6, axY - 16); ctx.closePath(); ctx.fill();
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(I18N.t("lb.arrives"), arrX, axY - 20);

        // traveling progress on timeline
        if (P.phase === "traveling") {
          var progX = yearToX(P.snYear + P.dist * P.lightFrac);
          ctx.strokeStyle = "rgba(255,255,100,0.6)"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(snX, axY); ctx.lineTo(progX, axY); ctx.stroke();
        } else if (P.phase === "arrived") {
          ctx.strokeStyle = "rgba(255,255,100,0.4)"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(snX, axY); ctx.lineTo(arrX, axY); ctx.stroke();
        }
      }

      ctx.restore();

      // status readout
      if (P.phase === "idle")       oStatus(I18N.t("lb.waiting"));
      else if (P.phase === "exploded")  oStatus(I18N.t("lb.boom"));
      else if (P.phase === "traveling") oStatus(I18N.t("lb.traveling"));
      else if (P.phase === "arrived")   oStatus(I18N.t("lb.seen"));
    });

    function drawObserver(ctx, x, y, excited) {
      ctx.save();
      ctx.strokeStyle = excited ? "#ffdd44" : "#88bbff";
      ctx.fillStyle = excited ? "#ffdd44" : "#88bbff";
      ctx.lineWidth = 2;
      // head
      ctx.beginPath(); ctx.arc(x, y - 12, 7, 0, Math.PI * 2); ctx.stroke();
      // body
      ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 15); ctx.stroke();
      // arms
      if (excited) {
        ctx.beginPath(); ctx.moveTo(x - 12, y - 5); ctx.lineTo(x, y + 3); ctx.lineTo(x + 12, y - 5); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(x - 10, y + 8); ctx.lineTo(x, y + 2); ctx.lineTo(x + 10, y + 8); ctx.stroke();
      }
      // legs
      ctx.beginPath(); ctx.moveTo(x - 8, y + 25); ctx.lineTo(x, y + 15); ctx.lineTo(x + 8, y + 25); ctx.stroke();
      ctx.restore();
    }

    function drawSmallStar(ctx, x, y, r, col) {
      ctx.save();
      ctx.fillStyle = col;
      ctx.beginPath();
      for (var i = 0; i < 5; i++) {
        var a = -Math.PI / 2 + i * Math.PI * 2 / 5;
        var ox = x + Math.cos(a) * r, oy = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
        a += Math.PI * 2 / 10;
        ox = x + Math.cos(a) * r * 0.4; oy = y + Math.sin(a) * r * 0.4;
        ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function bestStep(range) {
      if (range > 15000) return 5000;
      if (range > 8000) return 2000;
      if (range > 4000) return 1000;
      if (range > 2000) return 500;
      return 200;
    }

    resetSim();
  }
});
