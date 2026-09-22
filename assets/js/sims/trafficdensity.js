/* Traffic Density Analogy -------------------------------------------------------
   Faithful rebuild of the ClassAction "trafficdensity.swf" (highwayClass,
   decompiled). The stage, the geometry and the traffic rules are the original's:

     stage 1200 x 265        cars enter at mt_mc x = 0, i.e. 200 px off-screen left
     myTractor._x  = 752.4   the queue's leader stops 10 px behind that mark
     _maxCarCount  = 15      a ring of fifteen slots, recycled once a car is
                             past x = 1500
     _initCarSpeed = 0.5     px per millisecond; the tractor (and so the whole
                             scene) creeps at 0.02
     gap in the queue = the car ahead's own width + 20

   Half the cars arrive in the far lane and drive straight through; while any of
   them is still short of the tractor the near lane's leader cannot pull out, so
   the queue keeps growing. That gating is the whole point of the analogy — the
   jam is never the same cars twice, yet it never goes away.

   The density strip underneath is added here to make that explicit: the bunch is
   a pattern that moves with the tractor, not with any of the cars.            */
Sim.create({
  id: "trafficdensity",
  width: 1200, height: 340,
  strings: {
    en: {
      "td.ctl": "Traffic", "td.speed": "tractor speed", "td.carSpeed": "car speed",
      "td.flow": "cars arriving", "td.plot": "show density strip",
      "td.rQueue": "cars in the queue", "td.rDens": "cars in the busiest stretch",
      "td.rPattern": "the jam moves at",
      "td.dens": "traffic density along the road",
      "td.hint": "Watch one car, then watch the jam. Cars enter the queue, crawl, pass and leave — but the bunch itself stays with the tractor.",
      "td.kmh": "km/h"
    },
    id: {
      "td.ctl": "Lalu Lintas", "td.speed": "laju traktor", "td.carSpeed": "laju mobil",
      "td.flow": "kedatangan mobil", "td.plot": "tampilkan pita kepadatan",
      "td.rQueue": "mobil dalam antrean", "td.rDens": "mobil di ruas terpadat",
      "td.rPattern": "kemacetan bergerak",
      "td.dens": "kepadatan lalu lintas sepanjang jalan",
      "td.hint": "Amati satu mobil, lalu amati kemacetannya. Mobil masuk antrean, merayap, menyalip, lalu pergi — tetapi gumpalan itu sendiri tetap bersama traktor.",
      "td.kmh": "km/jam"
    }
  },
  about: {
    en: "<p>A slow tractor on a two-lane road creates a traffic jam that is easy to misread. Cars pile up behind it, crawl, pull out one at a time, pass, and speed away. No individual car stays in the jam for long — but the jam is always there, and it travels along the road at the tractor's speed, not at the cars' speed.</p>" +
        "<p>That is the idea behind density wave theory. The spiral arms of a galaxy are not fixed collections of stars winding up as the galaxy turns. If they were, they would have wound themselves into a blur after a few rotations — the winding problem.</p>" +
        "<p>Instead the arms are a pattern of enhanced density that rotates more slowly than the material. Stars and gas clouds drift into an arm, linger where the crowding is worst, and drift out the far side. The crowding triggers star formation, which is why arms are picked out by bright, short-lived blue stars: those stars are born in the arm and die before they leave it.</p>",
    id: "<p>Traktor lambat di jalan dua lajur menciptakan kemacetan yang mudah disalahtafsirkan. Mobil menumpuk di belakangnya, merayap, keluar satu per satu, menyalip, lalu melesat pergi. Tak ada satu mobil pun yang lama berada dalam kemacetan — tetapi kemacetannya selalu ada, dan ia bergerak di sepanjang jalan dengan laju traktor, bukan laju mobil.</p>" +
        "<p>Itulah gagasan di balik teori gelombang kepadatan. Lengan spiral galaksi bukanlah kumpulan bintang tetap yang menggulung seiring galaksi berputar. Bila demikian, lengan itu akan tergulung menjadi kabur setelah beberapa putaran — persoalan penggulungan.</p>" +
        "<p>Sebaliknya, lengan adalah pola kerapatan berlebih yang berputar lebih lambat daripada materinya. Bintang dan awan gas hanyut memasuki lengan, tertahan di tempat yang paling berjejal, lalu hanyut keluar di sisi seberang. Kepadatan itu memicu pembentukan bintang, sebabnya lengan tampak ditandai bintang biru yang terang dan berumur pendek: bintang-bintang itu lahir di dalam lengan dan mati sebelum sempat meninggalkannya.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var W = 1200;

    /* ---- stage geometry, straight out of the SWF --------------------------
       highway is placed at (0, 137.5); inside it myScene sits at (1, 0), mt_mc
       at (-200, 27) and myTractor at (752.4, 50.2). A car's own _y is 0 in the
       far lane and 30 in the near one, so it lands at stage y = _y + 164.5.  */
    var MT_X = -200, LANE_Y = 164.5;
    var TRACTOR_X = 752.4, TRACTOR_Y = 187.7, TRACTOR_W = 157.8;
    var SCENE_W = 1430;                                  // the scenery tile's period
    var Y_YELLOW = 176.5, Y_DASH = 202.2, Y_EDGE = 234.4, Y_BOT = 265;

    /* ---- the model's own constants ---------------------------------------- */
    var MAX = 15, INIT_SPEED = 0.5, TRACTOR_SPEED = 0.02;
    var SPAWN_RATE = 3;              // one attempt per frame, p = 1/4, at 12 fps
    var LANE_RATE = 120;             // carPositions -= 10 per frame while passing
    var KMH = 168;                   // one scale for all three speed readouts

    /* the seven vehicles, with the widths the original's symbols actually have */
    var VEH = [
      { w: 146.8, h: 30.8, b: 26.0, r: 13.0, kind: "car",   body: "#2f5fb4", top: "#7ba0de" },
      { w: 162.7, h: 31.5, b: 27.8, r: 13.5, kind: "car",   body: "#c33a2c", top: "#ef7565" },
      { w: 154.7, h: 29.9, b: 26.6, r: 13.2, kind: "car",   body: "#b9bec2", top: "#f2f4f6" },
      { w: 189.1, h: 32.9, b: 32.9, r: 16.0, kind: "truck", body: "#24262a", top: "#5b5f66" },
      { w: 185.1, h: 34.4, b: 33.1, r: 16.0, kind: "truck", body: "#dcdee0", top: "#ffffff" },
      { w: 162.7, h: 31.5, b: 27.8, r: 13.5, kind: "car",   body: "#cfa142", top: "#f0d590" },
      { w: 185.2, h: 34.5, b: 33.1, r: 16.0, kind: "truck", body: "#15491f", top: "#3c8547" }
    ];

    /* ---- state: the SWF's parallel arrays, indexed 1..15 ------------------- */
    var veh = [], carX = [], carY = [], carSp = [], rightPos = [], leftPos = [], deep = [];
    var carNum = 0, posCount = 0, ready = false, lastThru = true;
    var sceneX = 0, sceneT = 0, wheelSpin = 0, lastDt = 0;
    var tractorSpeed = TRACTOR_SPEED, carSpeed = INIT_SPEED, arriving = 1;
    var showPlot = true;

    S.group("td.ctl");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "td.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var loop = S.loop(step);
    S.playPause(loop).el.click();
    S.slider({ labelKey: "td.speed", min: 0.005, max: 0.06, value: tractorSpeed, step: 0.005,
      format: kmh, on: function (v) { tractorSpeed = v; } });
    S.slider({ labelKey: "td.carSpeed", min: 0.15, max: 1.2, value: carSpeed, step: 0.05,
      format: kmh, on: function (v) { carSpeed = v; } });
    S.slider({ labelKey: "td.flow", min: 0.2, max: 3, value: 1, step: 0.1,
      format: function (v) { return v.toFixed(1) + "×"; }, on: function (v) { arriving = v; } });
    S.toggle({ labelKey: "td.plot", value: true, on: function (b) { showPlot = b; } });
    var outQueue = S.readout({ labelKey: "td.rQueue" });
    var outDens = S.readout({ labelKey: "td.rDens" });
    var outPat = S.readout({ labelKey: "td.rPattern" });
    function kmh(v) { return (v * KMH).toFixed(0) + " " + I18N.t("td.kmh"); }

    /* ================== the model, following highwayClass ==================== */
    function makeCar(colour, pos) {
      if (pos === 0) {                                   // straight through, far lane
        carY[carNum] = 0; rightPos[carNum] = 0; leftPos[carNum] = true;
        deep[carNum] = carNum;
      } else {                                           // joins the queue, near lane
        carY[carNum] = 30; posCount++; rightPos[carNum] = posCount; leftPos[carNum] = false;
        deep[carNum] = carNum + MAX;
      }
      veh[carNum] = VEH[colour - 1];
      carX[carNum] = 0;
      carSp[carNum] = INIT_SPEED;
    }
    /* every queued car from position 2 up to mine contributes its own length plus
       the twenty-pixel gap the original leaves in front of it */
    function stopDistance(p) {
      var d = 0;
      for (var j = 1; j <= MAX; j++) {
        if (veh[j] && rightPos[j] > 1 && rightPos[j] <= p) d += veh[j].w + 20;
      }
      return d;
    }
    function stopPoint(p, i) {
      var pt = TRACTOR_X - 10;
      for (var k = 1; k <= MAX; k++) {
        if (veh[k] && rightPos[k] !== 0 && rightPos[k] === p - 1) pt = carX[k] - veh[i].w - 20;
      }
      return pt;
    }
    function makePass() {
      var carPos = 0, i;
      for (i = 1; i <= MAX; i++) if (rightPos[i] === 1) carPos = i;
      if (!carPos) return;
      var leftClear = true;
      for (i = 1; i <= MAX; i++) if (leftClear) leftClear = !leftPos[i];
      /* the original only gates the DECISION on a clear lane — once a car has
         committed it finishes the manoeuvre whatever pulls up behind it       */
      if (leftClear && carSp[carPos] === 0) ready = true;
      if (!ready) return;
      if (carY[carPos] >= 0) carY[carPos] -= LANE_RATE * lastDt;
      if (carY[carPos] <= 0) {                           // it is in the far lane now
        carY[carPos] = 0;
        ready = false;
        for (i = 1; i <= MAX; i++) if (rightPos[i] > 0) rightPos[i]--;
        posCount--;
      }
    }
    function step(dt) {
      dt = Math.min(dt, 0.1);
      lastDt = dt;
      var ms = dt * 1000;                                // the SWF works in ms
      var i;

      /* makeCar: one attempt per frame, one in four, but only when the slot we
         are about to reuse is long gone and the last car has cleared 250 px    */
      var space = !veh[carNum] || carX[carNum] > 250;
      if (space && lastThru && Math.random() < 1 - Math.exp(-SPAWN_RATE * arriving * dt)) {
        carNum = carNum % MAX + 1;
        makeCar(Math.round(1 + Math.random() * 6), Math.round(Math.random()));
      }

      sceneT -= ms * tractorSpeed;                       // the scene, not the tractor
      if (sceneT <= -SCENE_W) sceneT += SCENE_W;
      sceneX = sceneT;
      wheelSpin += ms * tractorSpeed;

      for (i = 1; i <= MAX; i++) {
        if (!veh[i]) continue;
        var nextX = carX[i] + ms * carSp[i];
        var stopPos = (TRACTOR_X - 10) - stopDistance(rightPos[i]);
        var stopPt = stopPoint(rightPos[i], i);
        if (nextX >= stopPos && carX[i] <= TRACTOR_X && carY[i] === 30) {
          carSp[i] = 0; nextX = stopPos;                 // nose to the bumper ahead
        } else {
          carSp[i] = carSpeed;
          if (rightPos[i] > 1 && nextX > stopPt) nextX = stopPt;
        }
        carX[i] = nextX;
        /* a far-lane car blocks the overtake until it is past the tractor */
        leftPos[i] = carX[i] < TRACTOR_X + TRACTOR_W ? carY[i] === 0 : false;
      }

      var nextCar = carNum % MAX + 1;
      lastThru = !veh[nextCar] || carX[nextCar] > 1500;
      makePass();
      upd();
    }
    function upd() {
      outQueue(Math.max(0, posCount) + " / " + MAX);
      outDens(density().peak + " / " + living());
      outPat(kmh(tractorSpeed));
      S.requestDraw();
    }
    S.refreshers.push(upd);
    function living() {
      var n = 0;
      for (var i = 1; i <= MAX; i++) if (veh[i] && sx(i) > -veh[i].w && sx(i) < W) n++;
      return n;
    }
    function sx(i) { return carX[i] + MT_X; }            // stage x of car i

    /* how much road each stretch is carrying, and the fullest 380 px of it */
    var NBIN = 60, BINW = W / NBIN, SMOOTH = 5;
    function density() {
      var raw = new Array(NBIN).fill(0), bins = new Array(NBIN).fill(0);
      var mid = [], i, b;
      for (i = 1; i <= MAX; i++) {
        if (!veh[i]) continue;
        var a = sx(i), c = a + veh[i].w;
        if (c < 0 || a > W) continue;
        mid.push((a + c) / 2);
        for (b = 0; b < NBIN; b++) {
          var lo = Math.max(a, b * BINW), hi = Math.min(c, (b + 1) * BINW);
          if (hi > lo) raw[b] += (hi - lo) / BINW;
        }
      }
      /* a bare coverage bin is either 1 (a car is here) or 0 (it is not), which
         says nothing; the local average over 220 px is the density we mean */
      for (b = 0; b < NBIN; b++) {
        var sum = 0, n = 0;
        for (i = -SMOOTH; i <= SMOOTH; i++) {
          var k = b + i;
          if (k >= 0 && k < NBIN) { sum += raw[k]; n++; }
        }
        bins[b] = sum / n;
      }
      var peak = 0;                                    // cars in the busiest 380 px
      mid.forEach(function (m) {
        var n = 0;
        mid.forEach(function (o) { if (o >= m - 190 && o <= m + 190) n++; });
        if (n > peak) peak = n;
      });
      return { bins: bins, peak: peak };
    }

    /* ================================= drawing ============================== */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      sky(ctx);
      hills(ctx);
      road(ctx);
      var order = [];
      for (var i = 1; i <= MAX; i++) if (veh[i]) order.push(i);
      order.sort(function (a, b) { return deep[a] - deep[b]; });
      order.forEach(function (i) { vehicle(ctx, i); });
      tractor(ctx);                                      // depth 67: above every car
      if (showPlot) densityStrip(ctx, tr);
    });

    function sky(ctx) {
      var g = ctx.createLinearGradient(0, 0, 0, Y_YELLOW);
      g.addColorStop(0, "#8fccfe"); g.addColorStop(0.28, "#a0c1e0");
      g.addColorStop(0.55, "#b1b6c1"); g.addColorStop(1, "#c3aea4");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, Y_YELLOW);
    }
    /* one 1430-wide tile of scenery, repeated; hills, trees and road markings
       all travel together at the tractor's speed, exactly as myScene does */
    function tile(ctx, x0) {
      ctx.save(); ctx.translate(x0, 0);
      var g = ctx.createLinearGradient(0, 78, 0, Y_YELLOW);
      g.addColorStop(0, "#c6a172"); g.addColorStop(1, "#8e7854");
      ctx.fillStyle = g;                                 // the far tan ridge
      ctx.beginPath();
      ctx.moveTo(-40, Y_YELLOW);
      ctx.bezierCurveTo(180, 96, 430, 78, 690, 100);
      ctx.bezierCurveTo(900, 118, 1020, 86, 1180, 92);
      ctx.bezierCurveTo(1300, 96, 1380, 120, 1470, Y_YELLOW);
      ctx.closePath(); ctx.fill();
      var g2 = ctx.createLinearGradient(0, 96, 0, Y_YELLOW);
      g2.addColorStop(0, "#3f5837"); g2.addColorStop(1, "#9c8a55");
      ctx.fillStyle = g2;                                // the near green hills
      ctx.beginPath();
      ctx.moveTo(-40, Y_YELLOW);
      ctx.bezierCurveTo(60, 120, 230, 104, 360, 146);
      ctx.lineTo(360, Y_YELLOW);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(1010, Y_YELLOW);
      ctx.bezierCurveTo(1120, 138, 1290, 98, 1470, 128);
      ctx.lineTo(1470, Y_YELLOW);
      ctx.closePath(); ctx.fill();
      [[70, 126, 26], [108, 134, 19], [140, 122, 22], [300, 148, 14],
       [332, 152, 11], [1185, 118, 24], [1224, 126, 18], [1256, 116, 21]
      ].forEach(function (t) { tree(ctx, t[0], t[1], t[2]); });
      [[262, 156, 13], [1150, 128, 15], [640, 168, 9]].forEach(function (t) {
        pine(ctx, t[0], t[1], t[2]);
      });
      ctx.restore();
    }
    function hills(ctx) {
      var off = ((sceneX % SCENE_W) + SCENE_W) % SCENE_W;
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, Y_YELLOW); ctx.clip();
      tile(ctx, off - SCENE_W); tile(ctx, off);
      ctx.restore();
    }
    function tree(ctx, x, y, r) {
      ctx.fillStyle = "#6d4b26";
      ctx.fillRect(x - r * 0.10, y - r * 0.9, r * 0.2, r * 0.95);
      ctx.fillStyle = "#2f8a33";
      ctx.beginPath(); ctx.arc(x, y - r * 1.55, r * 0.74, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(x - r * 0.62, y - r * 1.02, r * 0.58, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(x + r * 0.62, y - r * 1.02, r * 0.58, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y - r * 0.88, r * 0.66, 0, TAU); ctx.fill();
    }
    function pine(ctx, x, y, r) {
      ctx.fillStyle = "#7a5a30";
      ctx.fillRect(x - r * 0.10, y - r * 0.8, r * 0.2, r * 0.85);
      ctx.fillStyle = "#2f8a33";
      for (var k = 0; k < 3; k++) {
        var yy = y - r * (0.7 + k * 0.62), ww = r * (0.92 - k * 0.22);
        ctx.beginPath();
        ctx.moveTo(x, yy - r * 1.05); ctx.lineTo(x + ww, yy); ctx.lineTo(x - ww, yy);
        ctx.closePath(); ctx.fill();
      }
    }
    function road(ctx) {
      var g = ctx.createLinearGradient(0, Y_YELLOW, 0, Y_EDGE);
      g.addColorStop(0, "#8f7d66"); g.addColorStop(0.32, "#bcaf9e");
      g.addColorStop(0.8, "#bcaf9e"); g.addColorStop(1, "#b2a391");
      ctx.fillStyle = g; ctx.fillRect(0, Y_YELLOW, W, Y_EDGE - Y_YELLOW);
      var s = ctx.createLinearGradient(0, Y_EDGE, 0, Y_BOT);
      s.addColorStop(0, "#aa9986"); s.addColorStop(1, "#8a735b");
      ctx.fillStyle = s; ctx.fillRect(0, Y_EDGE, W, Y_BOT - Y_EDGE);
      ctx.fillStyle = "#ffb820";                         // the far edge is yellow:
      ctx.fillRect(0, Y_YELLOW - 2.4, W, 2.4);           // both lanes run one way
      ctx.fillStyle = "#f1ebdf";
      ctx.fillRect(0, Y_EDGE - 2.1, W, 4.2);
      var off = ((sceneX % 161) + 161) % 161;            // the lane dashes
      for (var x = -161; x < W + 161; x += 161) {
        ctx.fillRect(x + off, Y_DASH - 2.1, 28, 4.2);
      }
    }

    function vehicle(ctx, i) {
      var v = veh[i], x = sx(i), y = LANE_Y + carY[i];
      if (x > W + 40 || x + v.w < -40) return;
      var L = v.w, H = v.h, r = v.r, ax = v.b - r;       // the axle line
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath(); ctx.ellipse(L / 2, v.b + 1, L * 0.47, 3.4, 0, 0, TAU); ctx.fill();
      var g = ctx.createLinearGradient(0, -H, 0, ax);
      g.addColorStop(0, v.top); g.addColorStop(0.45, v.body); g.addColorStop(1, v.body);
      ctx.fillStyle = g;
      ctx.beginPath();
      if (v.kind === "truck") {
        ctx.moveTo(L * 0.015, ax);
        ctx.lineTo(L * 0.015, -H * 0.52);
        ctx.lineTo(L * 0.50, -H * 0.52);                 // the bed rail
        ctx.lineTo(L * 0.525, -H * 0.99);
        ctx.lineTo(L * 0.80, -H * 0.99);                 // the cab roof
        ctx.lineTo(L * 0.875, -H * 0.46);
        ctx.lineTo(L * 0.985, -H * 0.40);                // the bonnet
        ctx.quadraticCurveTo(L, -H * 0.1, L * 0.985, ax);
      } else {
        ctx.moveTo(L * 0.01, ax);
        ctx.lineTo(L * 0.012, -H * 0.34);
        ctx.quadraticCurveTo(L * 0.05, -H * 0.46, L * 0.15, -H * 0.50);
        ctx.lineTo(L * 0.31, -H * 0.99);                 // the rear screen
        ctx.lineTo(L * 0.60, -H * 0.99);                 // the roof
        ctx.lineTo(L * 0.755, -H * 0.48);                // the windscreen
        ctx.quadraticCurveTo(L * 0.90, -H * 0.44, L * 0.99, -H * 0.28);
        ctx.quadraticCurveTo(L, -H * 0.08, L * 0.985, ax);
      }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#93b6cf";                         // glass
      ctx.beginPath();
      if (v.kind === "truck") {
        ctx.moveTo(L * 0.565, -H * 0.90); ctx.lineTo(L * 0.775, -H * 0.90);
        ctx.lineTo(L * 0.845, -H * 0.52); ctx.lineTo(L * 0.565, -H * 0.52);
      } else {
        ctx.moveTo(L * 0.335, -H * 0.90); ctx.lineTo(L * 0.585, -H * 0.90);
        ctx.lineTo(L * 0.715, -H * 0.53); ctx.lineTo(L * 0.215, -H * 0.53);
      }
      ctx.closePath(); ctx.fill();
      if (v.kind === "truck") {                          // the open bed, in shadow
        ctx.fillStyle = "rgba(0,0,0,0.30)";
        ctx.fillRect(L * 0.055, -H * 0.46, L * 0.42, H * 0.20);
      }
      ctx.fillStyle = "rgba(0,0,0,0.16)";                // the rocker shadow
      ctx.fillRect(L * 0.02, ax - H * 0.10, L * 0.96, H * 0.10);
      var spin = carX[i] / r;
      wheel(ctx, L * (v.kind === "truck" ? 0.185 : 0.20), ax, r, spin);
      wheel(ctx, L * (v.kind === "truck" ? 0.795 : 0.795), ax, r, spin);
      ctx.restore();
    }
    function wheel(ctx, x, y, r, a) {
      ctx.fillStyle = "#171717";
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = "#c6c8cb";
      ctx.beginPath(); ctx.arc(x, y, r * 0.52, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#8d9094"; ctx.lineWidth = Math.max(1, r * 0.12);
      for (var k = 0; k < 3; k++) {
        var t = a + k * Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(t) * r * 0.44, y - Math.sin(t) * r * 0.44);
        ctx.lineTo(x + Math.cos(t) * r * 0.44, y + Math.sin(t) * r * 0.44);
        ctx.stroke();
      }
      ctx.fillStyle = "#6f7276";
      ctx.beginPath(); ctx.arc(x, y, r * 0.17, 0, TAU); ctx.fill();
    }

    /* the tractor: bbox x[0,158] y[-60,60] about its own registration point */
    function tractor(ctx) {
      ctx.save();
      ctx.translate(TRACTOR_X, TRACTOR_Y);
      ctx.fillStyle = "rgba(0,0,0,0.26)";
      ctx.beginPath(); ctx.ellipse(84, 58, 78, 5, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#1f6b2c";
      ctx.fillRect(92, -20, 62, 40);                     // the bonnet
      ctx.fillStyle = "#17521f";
      ctx.fillRect(148, -18, 8, 36);                     // the grille
      ctx.fillStyle = "#e8c93a";
      ctx.fillRect(150, -12, 5, 8);
      ctx.fillStyle = "#1f6b2c";
      ctx.fillRect(32, -8, 80, 30);                      // the chassis
      ctx.fillRect(88, -56, 7, 40);                      // the exhaust stack
      ctx.fillRect(101, -50, 5, 32);                     // the air intake
      ctx.fillStyle = "#17521f";                         // the cab
      ctx.beginPath();
      ctx.moveTo(10, -14); ctx.lineTo(14, -56); ctx.lineTo(84, -56);
      ctx.lineTo(84, -14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#b9d7e8";
      ctx.fillRect(22, -50, 54, 28);                     // the window
      ctx.fillStyle = "#c8506a";                         // the driver
      ctx.beginPath(); ctx.arc(52, -40, 6, 0, TAU); ctx.fill();
      ctx.fillRect(45, -36, 15, 14);
      ctx.fillStyle = "#1f6b2c";
      ctx.fillRect(4, -18, 78, 9);                       // the rear fender
      wheel(ctx, 135, 31, 25, wheelSpin * 0.05);         // the front wheel
      tyre(ctx, 43, 19, 37, wheelSpin * 0.03);           // the drive wheel
      ctx.restore();
    }
    function tyre(ctx, x, y, r, a) {
      ctx.fillStyle = "#1b1b1b";
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#333"; ctx.lineWidth = 3;
      for (var k = 0; k < 11; k++) {
        var t = a + k * TAU / 11;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(t) * r * 0.72, y + Math.sin(t) * r * 0.72);
        ctx.lineTo(x + Math.cos(t + 0.22) * r * 0.99, y + Math.sin(t + 0.22) * r * 0.99);
        ctx.stroke();
      }
      ctx.fillStyle = "#e8c93a";
      ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, TAU); ctx.fill();
      ctx.fillStyle = "#1b1b1b";
      ctx.beginPath(); ctx.arc(x, y, r * 0.17, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#b39a2c"; ctx.lineWidth = 2;
      for (k = 0; k < 6; k++) {
        var u = a + k * TAU / 6;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(u) * r * 0.2, y + Math.sin(u) * r * 0.2);
        ctx.lineTo(x + Math.cos(u) * r * 0.38, y + Math.sin(u) * r * 0.38);
        ctx.stroke();
      }
    }

    function densityStrip(ctx, tr) {
      var y0 = 270, h = 70, d = density();
      ctx.fillStyle = "#101522"; ctx.fillRect(0, y0, W, h);
      ctx.fillStyle = "#8d9bb5"; ctx.font = "12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(tr("td.dens"), 8, y0 + 4);
      /* nose-to-tail in one lane is about 0.9 of a bin, so 1.4 puts a solid
         queue near the top of the strip and leaves open road well below it  */
      var base = y0 + h - 6, span = 42;
      for (var i = 0; i < d.bins.length; i++) {
        var v = Math.min(1, d.bins[i] / 1.4);
        if (v < 0.02) continue;
        ctx.fillStyle = v > 0.55 ? "#ff8a4c" : "#4c8aff";
        ctx.fillRect(i * BINW + 1, base - v * span, BINW - 2, v * span);
      }
      ctx.strokeStyle = "#57c06a"; ctx.lineWidth = 2;    // where the tractor is
      ctx.beginPath();
      ctx.moveTo(TRACTOR_X + TRACTOR_W / 2, y0 + 20);
      ctx.lineTo(TRACTOR_X + TRACTOR_W / 2, base);
      ctx.stroke();
    }

    upd();
  }
});
