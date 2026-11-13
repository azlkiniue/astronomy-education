/* Doppler Shift Demonstrator ---------------------------------------------------
   Rebuild of the ClassAction "Doppler Shift Demonstrator" (dopplershift.swf,
   AS3: dopplerShiftDemo2, Source, DraggableObject, PositionLog, PhiInterval,
   TimeKeeper, HistoryPlot and CircleCropper decompiled with tools/swf-abc.py).
   The canvas is the SWF's stage below its title bar, drawn from its own art:
     • the two HistoryPlots — the last 15 s of the waves as emitted from the
       source and as detected by the observer, sampled every 25 ms, with the
       "time" arrow,
     • the field — the source S and observer O (the SWF's discs and Lucida
       labels), the wave crests as grey circles expanding at 0.03 px per ms of
       simulation time from where the source was when it emitted them (cropped
       to the field as the SWF's CircleCropper does), and, with "show paths",
       the last 5 s of each object's path fading from white to grey.
   The model is the SWF's: the waves have a 1.5 s period and ramp on and off over
   250 ms (stopping at the end of a cycle), the observer hears each moment of the
   wave emitted when the source was exactly one light-travel-time away (found by
   bisection along the source's logged path), and S and O glide after the mouse
   at 0.02 px/ms — two-thirds of the wave speed — only while it is held down.
   Shift-drag aims a straight-line motion (it carries on after release);
   Ctrl/Cmd-drag moves an object at once, clearing the plots. Clicking the field
   stops both. The SWF's "controls" panel is the sidebar here.               */
Sim.create({
  id: "dopplershift",
  width: 700, height: 540,
  strings: {
    en: {
      "ds.emit": "waves as emitted from source", "ds.detect": "waves as detected by observer", "ds.time": "time",
      "ds.controls": "controls", "ds.rate": "rate",
      "ds.pause": "pause simulation", "ds.resume": "resume simulation",
      "ds.start": "start emission", "ds.stop": "stop emission", "ds.paths": "show paths", "ds.reset": "reset"
    },
    id: {
      "ds.emit": "gelombang yang dipancarkan sumber", "ds.detect": "gelombang yang diterima pengamat", "ds.time": "waktu",
      "ds.controls": "kontrol", "ds.rate": "laju",
      "ds.pause": "jeda simulasi", "ds.resume": "lanjutkan simulasi",
      "ds.start": "mulai pancaran", "ds.stop": "hentikan pancaran", "ds.paths": "tampilkan jejak", "ds.reset": "atur ulang"
    }
  },
  about: {
    en: "<p>A wave's measured frequency depends on how the source and observer move <em>relative to each other</em>. When a source approaches, each successive crest is launched a little nearer than the last, so the crests bunch up — a shorter wavelength, a higher pitch, a <strong>blueshift</strong>. When it recedes, the crests spread out — a longer wavelength, a <strong>redshift</strong>.</p>" +
        "<p>Press <em>start emission</em>, then drag the source (S) or the observer (O): they follow the mouse at two-thirds of the wave speed. Shift-drag to set one moving in a straight line; Ctrl-drag (Cmd-drag on a Mac) to move it at once. Each circle is a crest expanding from where the source was when it emitted it — they crowd together ahead of a moving source and spread out behind.</p>" +
        "<p>The two plots are running histories: the top one is the wave as the source emits it, the bottom one as the observer receives it. Only the <em>radial</em> part of the motion matters — at closest approach the motion is transverse and there is no shift. This is how astronomers measure speeds across the cosmos.</p>",
    id: "<p>Frekuensi gelombang yang terukur bergantung pada gerak sumber dan pengamat <em>relatif satu sama lain</em>. Saat sumber mendekat, tiap puncak berikutnya dipancarkan sedikit lebih dekat, sehingga puncak merapat — panjang gelombang lebih pendek, nada lebih tinggi, <strong>pergeseran biru</strong>. Saat menjauh, puncak merenggang — <strong>pergeseran merah</strong>.</p>" +
        "<p>Tekan <em>mulai pancaran</em>, lalu seret sumber (S) atau pengamat (O): keduanya mengikuti tetikus dengan dua pertiga laju gelombang. Shift-seret untuk membuatnya bergerak lurus; Ctrl-seret (Cmd-seret di Mac) untuk memindahkannya seketika. Tiap lingkaran adalah puncak yang meluas dari tempat sumber saat memancarkannya — merapat di depan sumber yang bergerak dan merenggang di belakangnya.</p>" +
        "<p>Kedua grafik adalah riwayat berjalan: yang atas gelombang seperti dipancarkan sumber, yang bawah seperti diterima pengamat. Hanya komponen gerak <em>radial</em> yang berpengaruh. Beginilah astronom mengukur kecepatan di alam semesta.</p>"
  },
  build: function (S) {
    var OY = -30;                                  // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif";
    var TAU = 2 * Math.PI;
    function t(k) { return I18N.t(k); }

    /* ---------------- TimeKeeper: simulation time = rate · getTimer() + offset ---------------- */
    var TK = { rate: 1, offset: 0, stopped: false, stoppedTime: 0 };
    function getTimer() { return performance.now(); }
    function simTime() { return TK.stopped ? TK.stoppedTime : TK.rate * getTimer() + TK.offset; }
    function setRate(r) {
      var now = getTimer(), cur = TK.stopped ? TK.stoppedTime : TK.rate * now + TK.offset;
      TK.rate = r; TK.offset = cur - TK.rate * now;
    }
    function setRunning(b) {
      if (b && TK.stopped) { TK.offset = TK.stoppedTime - TK.rate * getTimer(); TK.stopped = false; }
      else if (!b && !TK.stopped) { TK.stoppedTime = simTime(); TK.stopped = true; }
    }

    /* ---------------- PositionLog ---------------- */
    function Log() { this.e = []; }
    Log.prototype.add = function (p) { this.e.push(p); };
    Log.prototype.clear = function () { this.e = []; };
    Log.prototype.at = function (tm) {             // getPosition: linear between entries, clamped at the ends
      var e = this.e, n = e.length;
      if (!(tm > e[0].time)) return { time: tm, x: e[0].x, y: e[0].y };
      if (!(tm < e[n - 1].time)) return { time: tm, x: e[n - 1].x, y: e[n - 1].y };
      var later = e[n - 1];
      for (var i = n - 2; i >= 0; i--) {
        var p = e[i];
        if (p.time <= tm) {
          var f = (tm - p.time) / (later.time - p.time);
          return { time: tm, x: p.x + f * (later.x - p.x), y: p.y + f * (later.y - p.y) };
        }
        later = p;
      }
      return { time: tm, x: e[0].x, y: e[0].y };
    };
    Log.prototype.expireForward = function (tm) {  // drop everything from the first entry at or after tm
      for (var i = 0; i < this.e.length; i++) if (tm <= this.e[i].time) { this.e.splice(i); return; }
    };
    Log.prototype.expire = function (tm) {          // keep one entry older than tm
      var i = 0;
      while (i < this.e.length && this.e[i].time < tm) i++;
      if (i > 0) this.e.splice(0, i - 1);
    };

    /* ---------------- DraggableObject ---------------- */
    var MAX_V = 0.02, FIELD = { x: 7, y: 209, w: 686, h: 354 };
    var RANGE = { left: FIELD.x + 5, top: FIELD.y + 5, right: FIELD.x + FIELD.w - 5, bottom: FIELD.y + FIELD.h - 5 };
    function Obj(kind) { this.kind = kind; this.log = new Log(); this.pos = { x: 0, y: 0 }; this.updateTime = 0; }
    Obj.prototype.setPosition = function (p) {
      this.log.clear(); this.log.add(p); this.update(p.time);
      if (this.kind === "S") { clearSourceHistory(); sourceData = []; observerData = []; }
      else observerData = [];
    };
    Obj.prototype.update = function (tm) { this.updateTime = tm; var p = this.log.at(tm); this.pos.x = p.x; this.pos.y = p.y; };
    Obj.prototype.stopMotionAt = function (tm) {
      var p = this.log.at(tm);
      this.log.expireForward(tm); this.log.add(p);
      return p;
    };
    Obj.prototype.target = function (from, mx, my) {   // getMouseTarget: clipped to the range, timed at MaxVelocity
      var x = mx + this.xOff, y = my + this.yOff, k = 1, f;
      if (x < RANGE.left) { f = (RANGE.left - from.x) / (x - from.x); if (f >= 0 && f <= 1) k = Math.min(k, f); }
      if (x > RANGE.right) { f = (RANGE.right - from.x) / (x - from.x); if (f >= 0 && f <= 1) k = Math.min(k, f); }
      if (y < RANGE.top) { f = (RANGE.top - from.y) / (y - from.y); if (f >= 0 && f <= 1) k = Math.min(k, f); }
      if (y > RANGE.bottom) { f = (RANGE.bottom - from.y) / (y - from.y); if (f >= 0 && f <= 1) k = Math.min(k, f); }
      if (k < 1) { x = from.x + k * (x - from.x); y = from.y + k * (y - from.y); }
      var dx = x - from.x, dy = y - from.y;
      return { time: from.time + Math.sqrt(dx * dx + dy * dy) / MAX_V, x: x, y: y };
    };
    Obj.prototype.chase = function (tm, mx, my) { var p = this.stopMotionAt(tm); this.log.add(this.target(p, mx, my)); };

    var source = new Obj("S"), observer = new Obj("O");

    /* ---------------- Source: the emitted wave, interval by interval ---------------- */
    var OMEGA = TAU / 1500, RAMP = 250, WAVE_V = 30 / 1000;
    var intervals = [], active = null, emitting = false, inTransition = false, transitionEnd = 0;
    function easeInOut(tm, b, c, d) {             // Exponential.easeInOut
      if (tm === 0) return b;
      if (tm === d) return b + c;
      tm /= d / 2;
      if (tm < 1) return c / 2 * Math.pow(2, 10 * (tm - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * (tm - 1)) + 2) + b;
    }
    function intervalValue(I, tm) {               // PhiInterval.getValue
      if (tm < I.start || tm > I.end) return 0;
      var s = Math.sin(tm * OMEGA + I.phi);
      if (tm < I.start + RAMP) return s * easeInOut(tm - I.start, 0, 1, RAMP);
      if (tm > I.end - RAMP) return s * easeInOut(tm - (I.end - RAMP), 1, -1, RAMP);
      return s;
    }
    function sourceValue(tm) {
      for (var i = 0; i < intervals.length; i++) if (intervals[i].start <= tm && tm <= intervals[i].end) return intervalValue(intervals[i], tm);
      return 0;
    }
    function setEmission(on) {                    // Source.setEmissionState
      if (inTransition || on === emitting) return;
      var tm = simTime();
      if (on) {
        if (active === null) {
          active = { start: tm, phi: 1.85 * Math.PI - (tm * OMEGA) % TAU, end: Infinity };
          intervals.push(active);
          transitionEnd = tm + RAMP;
        }
      } else if (active !== null) {
        var P = TAU / OMEGA, L4 = (2.15 * Math.PI - active.phi) / OMEGA, frac = ((L4 / P) % 1 + 1) % 1;
        var L7 = active.start / P, L8 = tm / P, L9 = Math.floor(L8) + frac;
        if (L9 < L8) L9 += 1;
        if ((L9 - L8) / (RAMP / P) < 1) L9 += 1;
        if (L9 - L7 < 1) L9 += 1;
        active.end = transitionEnd = P * L9;
        active = null;
      }
      emitting = on; inTransition = true;
      syncSidebar();
    }
    function clearSourceHistory() { intervals = []; active = null; emitting = false; inTransition = false; syncSidebar(); }
    function peaks(t0, t1) {                       // Source.getPeaks: crest times, placed on the source's path
      var out = [];
      intervals.forEach(function (I) {
        var first = (Math.PI / 2 - I.phi) / OMEGA, P = TAU / OMEGA;
        var k0 = Math.ceil((t0 - first) / P), k1 = Math.floor((t1 - first) / P);
        if (I.end >= t0 && I.start <= t1) for (var k = k0; k <= k1; k++) {
          var tm = first + k * P;
          if (I.start <= tm && tm <= I.end) { var p = source.log.at(tm); out.push({ time: tm, x: p.x, y: p.y }); }
        }
      });
      return out;
    }
    function observedValue(o) {                   // Source.getObservedValue: when was this moment emitted?
      var e = source.log.e, tObs = o.time, emitT = NaN, later = null;
      function f(p) { return Math.sqrt((p.x - o.x) * (p.x - o.x) + (p.y - o.y) * (p.y - o.y)) - WAVE_V * (tObs - p.time); }
      for (var i = e.length - 1; i >= 0; i--) {
        var p = e[i];
        if (f(p) < 0) {
          if (i < e.length - 1) {
            var a = 0, b = 1, A = p, B = later;
            var at = function (s) { return { time: A.time + s * (B.time - A.time), x: A.x + s * (B.x - A.x), y: A.y + s * (B.y - A.y) }; };
            var fa = f(at(a));
            for (var n = 0; n < 50; n++) {
              var m = (a + b) / 2, fm = f(at(m));
              if (fa * fm > 0) { a = m; fa = fm; } else b = m;
            }
            emitT = at(a).time;
          } else emitT = tObs - Math.sqrt((p.x - o.x) * (p.x - o.x) + (p.y - o.y) * (p.y - o.y)) / WAVE_V;
          break;
        }
        later = p;
      }
      if (isNaN(emitT)) { var q = e[0]; emitT = tObs - Math.sqrt((q.x - o.x) * (q.x - o.x) + (q.y - o.y) * (q.y - o.y)) / WAVE_V; }
      return sourceValue(emitT);
    }

    /* ---------------- the main loop (onEnterFrameFunc) ---------------- */
    var STEP = 25, HISTORY = 15000;
    var EXPIRE = 1.25 * Math.max(Math.sqrt(FIELD.w * FIELD.w + FIELD.h * FIELD.h) / WAVE_V, HISTORY);
    var sourceData = [], observerData = [], timeLast = 0, secondLast = 0, crests = [];
    function step() {
      var tm = simTime();
      if (tm === timeLast) return;
      var sec = Math.floor(tm / 1000), n1 = Math.floor(tm / STEP), n0 = Math.floor(timeLast / STEP);
      source.update(tm); observer.update(tm);
      if (inTransition && tm >= transitionEnd) { inTransition = false; syncSidebar(); }
      for (var k = 0; k < n1 - n0; k++) {
        var ts = (n0 + 1 + k) * STEP;
        sourceData.push({ time: ts, value: sourceValue(ts) });
        var op = observer.log.at(ts);
        observerData.push({ time: ts, value: observedValue({ time: ts, x: op.x, y: op.y }) });
      }
      crests = peaks(tm - EXPIRE, tm);
      if (secondLast !== sec && sec % 5 === 0) {
        expireData(sourceData, tm - HISTORY); expireData(observerData, tm - HISTORY);
        intervals = intervals.filter(function (I) { return !(I.end < tm - EXPIRE); });
        source.log.expire(tm - EXPIRE); observer.log.expire(tm - EXPIRE);
      }
      timeLast = tm; secondLast = sec;
    }
    function expireData(a, tm) { var i = 0; while (i < a.length && a[i].time < tm) i++; a.splice(0, i); }
    var loop = S.loop(step);

    /* ---------------- drawing ---------------- */
    var ART = {
      85: {nz:false, layers:[[[["#fafafa","M437 202L7 202L7 37L437 37L437 202Z"]],[[1.0,"#606060","M437 202L7 202L7 37L437 37L437 202"]]],[[["#fafafa","M693 202L444 202L444 37L693 37L693 202Z"]],[[1.0,"#606060","M693 202L444 202L444 37L693 37L693 202"]]]]},
      92: {nz:false, layers:[[[["#b0b0b0","M412.85 188.8L396.3 188.8L396.3 186.7L412.9 186.7L408.85 182.3L423.9 187.65L408.85 193.3L412.85 188.8Z"]],[]]]},
      19: {nz:false, layers:[[[[{t:"r",m:[0.013962,0.0,0.0,0.013962,2.4,-2.4],s:[[0,"#ffffff"],[1,"#c4c4c4"]]},"M5.7 -5.7Q8 -3.3 8 0Q8 3.3 5.7 5.7Q3.3 8 0 8Q-3.3 8 -5.7 5.7Q-8 3.3 -8 0Q-8 -3.3 -5.7 -5.7Q-3.3 -8 0 -8Q3.3 -8 5.7 -5.7Z"]],[[1.0,"#cccccc","M5.7 -5.7Q8 -3.3 8 0Q8 3.3 5.7 5.7Q3.3 8 0 8Q-3.3 8 -5.7 5.7Q-8 3.3 -8 0Q-8 -3.3 -5.7 -5.7Q-3.3 -8 0 -8Q3.3 -8 5.7 -5.7"]]]]},
    };
    var GLYPH = {name: 'Lucida Sans Unicode', bold: true, italic: false, em: 1024.0, asc: null, desc: null, lead: null, g: {
        'O': [null, "M400.5 18Q241 18 146 -88.5Q51 -195.5 51 -372.5Q51 -550 146 -656.5Q241.5 -763.5 400.5 -763.5Q559.5 -763.5 654.5 -656.5Q750 -549.5 750 -372.5Q750 -195.5 654.5 -89Q559.5 18 400.5 18L400.5 18M400.5 -79Q503.5 -79 561.5 -156.5Q620 -233.5 620 -373.5Q620 -513 562 -589.5Q503.5 -666.5 400.5 -666.5Q297 -666.5 239 -590Q181 -513 181 -373.5Q181 -233.5 239 -156Q297.5 -79 400.5 -79L400.5 -79"],
        'S': [null, "M49 -16.5L49 -136Q184 -79 261 -79Q317.5 -79 351 -108.5Q385 -137.5 385 -184.5Q385 -223.5 362.5 -251.5Q340 -279 271.5 -318.5L221.5 -351.5Q132 -398 92.5 -446.5Q53 -495.5 53 -561Q53 -649.5 117 -706.5Q181 -763.5 278.5 -763.5Q364 -763.5 466 -733L466 -621.5Q338.5 -666.5 284.5 -666.5Q235 -666.5 203.5 -641Q172 -615 172 -576.5Q172 -544 195.5 -518Q219.5 -492 285 -454.5L337 -425Q433 -370.5 472 -320.5Q511 -271 511 -201Q511 -102 438 -42Q365 18 246 18Q171 18 49 -16.5L49 -16.5"]
    }};
    function font(ctx, size, style) { ctx.font = (style ? style + " " : "") + size + "px " + FONT; }
    function plot(ctx, x, y, data, now) {         // HistoryPlot: 400 × ±20 px, 15 s, curve at 0.82
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillRect(0, -20, 400, 40);
      if (data.length) {
        var t0 = now - HISTORY, kx = 400 / HISTORY, ky = -0.82 * 20, i = 0;
        while (i < data.length && data[i].time < t0) i++;
        if (i < data.length) {
          ctx.beginPath(); ctx.moveTo(kx * (data[i].time - t0), ky * data[i].value);
          for (i++; i < data.length; i++) ctx.lineTo(kx * (data[i].time - t0), ky * data[i].value);
          ctx.strokeStyle = "#a0a0a0"; ctx.lineWidth = 1; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
        }
      }
      ctx.strokeStyle = "#e0e0e0"; ctx.lineWidth = 1; ctx.strokeRect(0, -20, 400, 40);
      ctx.restore();
    }
    function cropArc(ctx, x, y, r, a0, a1) {     // CircleCropper.drawArc (y up)
      a0 = (a0 % TAU + TAU) % TAU; a1 = (a1 % TAU + TAU) % TAU;
      var range = a1 - a0; if (range <= 0) range += TAU;
      var n = Math.ceil(range / 0.5), st = range / n, half = st / 2, cr = r / Math.cos(half), a = a0, c = a0 - half;
      ctx.moveTo(x + r * Math.cos(a), y - r * Math.sin(a));
      for (var i = 0; i < n; i++) {
        a += st; c += st;
        ctx.quadraticCurveTo(x + cr * Math.cos(c), y - cr * Math.sin(c), x + r * Math.cos(a), y - r * Math.sin(a));
      }
    }
    function cropCircle(ctx, x, y, r) {          // CircleCropper.drawCircle: only the arcs inside the field
      var R = { left: FIELD.x, top: FIELD.y, right: FIELD.x + FIELD.w, bottom: FIELD.y + FIELD.h };
      function m(v) { return (v % TAU + TAU) % TAU; }
      var a = Math.acos((R.right - x) / r), s, e;
      if (isNaN(a)) { s = 0; e = TAU; } else { s = m(a); e = TAU - a; }
      a = Math.asin((y - R.top) / r);
      if (!isNaN(a)) { a = m(a); if (a > s) cropArc(ctx, x, y, r, s, a); s = m(Math.PI - a); }
      a = Math.acos((R.left - x) / r);
      if (!isNaN(a)) { a = m(a); if (a > s) cropArc(ctx, x, y, r, s, a); s = m(-a); }
      a = Math.asin((y - R.bottom) / r);
      if (!isNaN(a)) { a = m(Math.PI - a); if (a > s) cropArc(ctx, x, y, r, s, a); s = m(Math.PI - a); }
      if (e > s) cropArc(ctx, x, y, r, s, e);
    }
    function path(ctx, o, now) {                   // DraggableObject.updatePath: 5 s, fading 255 → 190
      var t0 = now - 5000, dt = 1 / MAX_V, n = Math.ceil(5000 / dt), d = 5000 / n, L6 = (255 - 190) / 0.5, prev = o.log.at(t0);
      ctx.lineWidth = 1; ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (var i = 1; i <= n; i++) {
        var p = o.log.at(t0 + d * i), g = Math.max(190, Math.round(255 - L6 * (p.time - t0) / 5000));
        ctx.strokeStyle = "rgb(" + g + "," + g + "," + g + ")";
        ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        prev = p;
      }
    }
    function marker(ctx, o) {                      // the Source / Observer symbols: disc + Lucida label
      ctx.save(); ctx.translate(o.pos.x, o.pos.y);
      SwfShape.draw(ctx, ART[19]);
      var g = GLYPH.g[o.kind], k = 11 / GLYPH.em;
      ctx.translate(o.kind === "S" ? -2.3 : -3.1, o.kind === "S" ? -5.5 : -5.7); ctx.scale(0.799988, 0.799988);
      ctx.translate(0, 11); ctx.scale(k, k);
      ctx.fillStyle = "#666666"; ctx.fill(GLYPH.p[o.kind] || (GLYPH.p[o.kind] = new Path2D(g[1])));
      ctx.restore();
    }
    GLYPH.p = {};
    var top = [observer, source];                  // display order in the field (the last pressed on top)

    S.onDraw(function () {
      var ctx = S.ctx, now = timeLast;
      FlashText.begin(ctx);
      ctx.save();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.translate(0, OY);
      // the plots' panel (the SWF's controls panel to its right is the sidebar here)
      ctx.fillStyle = "#fafafa"; ctx.fillRect(7, 37, 686, 165);
      ctx.strokeStyle = "#606060"; ctx.lineWidth = 1; ctx.strokeRect(7, 37, 686, 165);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fillStatic(ctx, t("ds.emit"), 22, 58);
      FlashText.fillStatic(ctx, t("ds.detect"), 22, 128);
      font(ctx, 11, "italic"); ctx.fillStyle = "#787878";
      FlashText.fillStatic(ctx, t("ds.time"), 365, 191.9);
      SwfShape.draw(ctx, ART[92]);
      plot(ctx, 22, 83, sourceData, now);
      plot(ctx, 22, 153, observerData, now);
      // the field
      ctx.fillStyle = "#fafafa"; ctx.fillRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);
      ctx.strokeStyle = "#606060"; ctx.strokeRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);
      ctx.save();
      ctx.beginPath(); ctx.rect(FIELD.x, FIELD.y, FIELD.w, FIELD.h); ctx.clip();
      ctx.beginPath();
      crests.forEach(function (c) { cropCircle(ctx, c.x, c.y, WAVE_V * (now - c.time)); });
      ctx.strokeStyle = "#a0a0a0"; ctx.lineWidth = 1; ctx.stroke();
      if (showPaths) { path(ctx, observer, now); path(ctx, source, now); }
      if (drag && drag.mode === 1 && drag.aim) {   // shift-drag: the aiming line, lineStyle(2, 0xFFC080)
        ctx.strokeStyle = "#ffc080"; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(drag.o.pos.x, drag.o.pos.y); ctx.lineTo(drag.aim.x, drag.aim.y); ctx.stroke();
      }
      top.forEach(function (o) { marker(ctx, o); });
      ctx.restore();
      ctx.restore();
    });

    /* ---------------- the pointer ---------------- */
    var drag = null, showPaths = false;
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY };
    }
    function hitObj(p, touch) {
      for (var i = top.length - 1; i >= 0; i--) {
        var o = top[i], dx = p.x - o.pos.x, dy = p.y - o.pos.y, r = touch ? 14 : 8.5;
        if (dx * dx + dy * dy <= r * r) return o;
      }
      return null;
    }
    function inField(p) { return p.x >= FIELD.x && p.x <= FIELD.x + FIELD.w && p.y >= FIELD.y && p.y <= FIELD.y + FIELD.h; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), o = hitObj(p, ev.pointerType === "touch"), tm = simTime();
      if (!o) {
        if (inField(p)) { observer.stopMotionAt(tm); source.stopMotionAt(tm); }   // onBackgroundPressed
        return;
      }
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      top.splice(top.indexOf(o), 1); top.push(o);
      o.stopMotionAt(tm);
      var mode = ev.shiftKey ? 1 : ev.ctrlKey || ev.metaKey ? 2 : 0;
      o.xOff = mode === 1 ? 0 : o.pos.x - p.x; o.yOff = mode === 1 ? 0 : o.pos.y - p.y;
      drag = { o: o, mode: mode, aim: null };
      S.canvas.style.cursor = "grabbing";
      wake();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) { S.canvas.style.cursor = hitObj(p, ev.pointerType === "touch") ? "grab" : "default"; return; }
      var o = drag.o, tm = simTime();
      if (drag.mode === 0) { o.chase(tm, p.x, p.y); o.update(tm); }
      else if (drag.mode === 1) drag.aim = o.target(o.log.at(tm), p.x, p.y);
      else {
        var x = Math.min(RANGE.right, Math.max(RANGE.left, p.x + o.xOff)), y = Math.min(RANGE.bottom, Math.max(RANGE.top, p.y + o.yOff));
        o.setPosition({ time: tm, x: x, y: y });
      }
      S.requestDraw();
    });
    function release(ev) {
      if (!drag) return;
      var o = drag.o, tm = simTime(), p = at(ev);
      if (drag.mode === 0) o.stopMotionAt(tm);
      else if (drag.mode === 1) o.chase(tm, p.x, p.y);
      drag = null;
      S.canvas.style.cursor = "grab";
    }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", release);
    function wake() { if (!loop.playing) loop.play(); }

    /* ---------------- the sidebar: the SWF's controls panel ---------------- */
    var syncing = false;
    S.group("ds.controls");
    var animBtn = S.button({ labelKey: "ds.pause", on: function () { setRunning(TK.stopped); syncSidebar(); } });
    var rateCtl = S.slider({ labelKey: "ds.rate", min: 0.1, max: 2, step: 0.01, value: 1,
      format: function (v) { return v.toFixed(2); },
      on: function (v) { if (!syncing) setRate(v); } });
    var emitBtn = S.button({ labelKey: "ds.start", primary: true, on: function () { setEmission(!emitting); } });
    var pathsCtl = S.toggle({ labelKey: "ds.paths", value: false, on: function (b) { if (!syncing) { showPaths = b; S.requestDraw(); } } });
    S.button({ labelKey: "ds.reset", on: reset });
    function label(b, key) { if (b.getAttribute("data-i18n") !== key) { b.setAttribute("data-i18n", key); b.textContent = t(key); } }
    function syncSidebar() {
      if (!animBtn) return;
      syncing = true;
      label(animBtn, TK.stopped ? "ds.resume" : "ds.pause");
      label(emitBtn, emitting ? "ds.stop" : "ds.start");
      emitBtn.disabled = inTransition;
      if (Math.abs(rateCtl.value() - TK.rate) > 1e-9) rateCtl.set(TK.rate);
      pathsCtl.set(showPaths);
      syncing = false;
    }

    function reset() {                             // onReset
      setRunning(true);
      setRate(1);
      showPaths = false;
      var tm = simTime();
      source.setPosition({ time: tm, x: 300, y: 250 });
      observer.setPosition({ time: tm, x: 500, y: 300 });
      timeLast = tm; secondLast = Math.floor(tm / 1000);
      crests = [];
      syncSidebar();
      wake();
    }
    reset();
  }
});
