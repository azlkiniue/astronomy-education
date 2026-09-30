/* ===========================================================================
   sim.js — shared framework for an individual simulation page.
   ---------------------------------------------------------------------------
   A simulation file calls:

     Sim.create({
       id: "blackbody",                 // must match catalog id + file name
       width: 760, height: 460,         // logical canvas size
       strings: { en:{...}, id:{...} }, // sim-specific i18n keys
       about:   { en:"<p>…</p>", id:"<p>…</p>" },   // explainer HTML
       build: function (S) { … }        // wire controls + drawing
     });

   Inside build(S) you get a context with canvas helpers and control builders:
     S.ctx, S.W, S.H, S.clear()
     S.group(labelKey)
     S.slider({labelKey,min,max,value,step,unit,format,on}) -> {value(),set(v),input}
     S.toggle({labelKey,value,on})         -> {value(),set(b)}
     S.select({labelKey,value,options,on}) -> {value(),set(v)}
     S.button({labelKey,primary,on})
     S.readout({labelKey})                 -> set(text)
     S.onDraw(fn)  S.requestDraw()
     S.loop(step)  -> {play(),pause(),toggle(),playing}
     S.playPause(loop)                     -> button bound to a loop
   Depends on: i18n.js, ui.js, catalog.js
   =========================================================================== */
window.Sim = (function () {
  function create(cfg) {
    if (cfg.strings) I18N.add(cfg.strings);
    document.addEventListener("DOMContentLoaded", function () { build(cfg); });
  }

  function build(cfg) {
    var refreshers = [];           // run on language change (formatted values, titles)
    var drawFn = null, drawScheduled = false;

    // ---- page scaffold ----
    document.body.prepend(UI.header());
    var main = document.createElement("main");
    main.className = "container";

    var crumb = document.createElement("div");
    crumb.className = "breadcrumb";
    crumb.innerHTML = '<a href="' + UI.root() + 'index.html" data-i18n="sim.backToCatalog"></a>';
    main.appendChild(crumb);

    var entry = (window.ANIM && ANIM.sims.find(function (s) { return s.ready === cfg.id; })) || null;
    var head = document.createElement("div");
    head.className = "sim-head";
    var h1 = document.createElement("h1");
    var lead = document.createElement("p");
    head.appendChild(h1);
    head.appendChild(lead);
    main.appendChild(head);
    refreshers.push(function () {
      var l = I18N.getLang();
      h1.textContent = entry ? entry.title[l] : (cfg.title ? cfg.title[l] : cfg.id);
      document.title = h1.textContent + " \u2014 " + I18N.t("site.title");
      // catalog descriptions are English-only for now (translated in a later pass)
      lead.textContent = entry ? entry.desc : (cfg.desc ? (cfg.desc[l] || cfg.desc.en) : "");
    });

    var layout = document.createElement("div");
    layout.className = "sim-layout";
    var stage = document.createElement("div");
    stage.className = "sim-stage";
    var canvas = document.createElement("canvas");
    stage.appendChild(canvas);
    var controls = document.createElement("aside");
    controls.className = "sim-controls";
    layout.appendChild(stage);
    layout.appendChild(controls);
    main.appendChild(layout);

    var explain = document.createElement("section");
    explain.className = "sim-explain";
    var aboutH = document.createElement("h2");
    aboutH.setAttribute("data-i18n", "sim.aboutTitle");
    var aboutBody = document.createElement("div");
    explain.appendChild(aboutH);
    explain.appendChild(aboutBody);
    main.appendChild(explain);
    if (cfg.about) {
      refreshers.push(function () { aboutBody.innerHTML = cfg.about[I18N.getLang()] || cfg.about.en; });
    }

    document.body.appendChild(main);
    document.body.appendChild(UI.footer());

    // ---- canvas setup (HiDPI aware) ----
    var W = cfg.width || 760, H = cfg.height || 460;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ---- shared readout grid (created lazily) ----
    var readoutGrid = null;
    function ensureReadouts() {
      if (readoutGrid) return readoutGrid;
      readoutGrid = document.createElement("div");
      readoutGrid.className = "readouts";
      controls.appendChild(readoutGrid);
      return readoutGrid;
    }

    var S = {
      canvas: canvas, ctx: ctx, W: W, H: H,
      clear: function () { ctx.clearRect(0, 0, W, H); },
      onDraw: function (fn) { drawFn = fn; },
      requestDraw: function () {
        if (drawScheduled) return;
        drawScheduled = true;
        requestAnimationFrame(function () { drawScheduled = false; if (drawFn) drawFn(); });
      },
      group: function (labelKey) {
        var g = document.createElement("div");
        g.className = "group-title";
        g.setAttribute("data-i18n", labelKey);
        controls.appendChild(g);
        return g;
      },
      slider: function (o) {
        var ctl = el("div", "ctl");
        var label = el("label");
        var name = el("span"); name.setAttribute("data-i18n", o.labelKey);
        var val = el("span", "val");
        label.appendChild(name); label.appendChild(val);
        var input = el("input"); input.type = "range";
        input.min = o.min; input.max = o.max; input.step = o.step != null ? o.step : 1; input.value = o.value;
        ctl.appendChild(label); ctl.appendChild(input); controls.appendChild(ctl);
        var fmt = o.format || function (v) { return round(v) + (o.unit || ""); };
        function refresh() { val.textContent = fmt(parseFloat(input.value)); }
        input.addEventListener("input", function () {
          refresh(); if (o.on) o.on(parseFloat(input.value)); S.requestDraw();
        });
        refreshers.push(refresh); refresh();
        return { input: input, value: function () { return parseFloat(input.value); },
          set: function (v) { input.value = v; refresh(); if (o.on) o.on(parseFloat(v)); S.requestDraw(); } };
      },
      toggle: function (o) {
        var ctl = el("div", "ctl row");
        var lab = el("label", "toggle");
        var input = el("input"); input.type = "checkbox"; input.checked = !!o.value;
        var span = el("span"); span.setAttribute("data-i18n", o.labelKey);
        lab.appendChild(input); lab.appendChild(span); ctl.appendChild(lab); controls.appendChild(ctl);
        input.addEventListener("change", function () { if (o.on) o.on(input.checked); S.requestDraw(); });
        return { value: function () { return input.checked; },
          set: function (b) { input.checked = b; if (o.on) o.on(b); S.requestDraw(); } };
      },
      select: function (o) {
        var ctl = el("div", "ctl");
        var name = el("label"); name.setAttribute("data-i18n", o.labelKey);
        var sel = el("select");
        o.options.forEach(function (op) {
          var opt = el("option"); opt.value = op.v;
          if (op.labelKey) { opt.setAttribute("data-i18n", op.labelKey); opt.textContent = I18N.t(op.labelKey); }
          else opt.textContent = op.label;
          sel.appendChild(opt);
        });
        sel.value = o.value;
        ctl.appendChild(name); ctl.appendChild(sel); controls.appendChild(ctl);
        sel.addEventListener("change", function () { if (o.on) o.on(sel.value); S.requestDraw(); });
        return { value: function () { return sel.value; },
          set: function (v) { sel.value = v; if (o.on) o.on(v); S.requestDraw(); } };
      },
      button: function (o) {
        var b = el("button", "btn" + (o.primary ? " primary" : ""));
        b.type = "button";
        if (o.labelKey) b.setAttribute("data-i18n", o.labelKey); else b.textContent = o.label || "";
        b.addEventListener("click", function () { if (o.on) o.on(b); });
        // group consecutive buttons into a row
        var last = controls.lastElementChild;
        if (last && last.classList && last.classList.contains("btn-row")) last.appendChild(b);
        else { var row = el("div", "btn-row"); row.appendChild(b); controls.appendChild(row); }
        return b;
      },
      readout: function (o) {
        var grid = ensureReadouts();
        var r = el("div", "readout");
        var k = el("div", "k"); k.setAttribute("data-i18n", o.labelKey);
        var v = el("div", "v"); v.textContent = "–";
        r.appendChild(k); r.appendChild(v); grid.appendChild(r);
        return function (text) { v.textContent = text; };
      },
      loop: function (step) {
        var raf = null, last = 0;
        var api = {
          playing: false,
          play: function () {
            if (api.playing) return; api.playing = true; last = 0;
            raf = requestAnimationFrame(function f(ts) {
              if (!api.playing) return;
              if (!last) last = ts;
              var dt = Math.min((ts - last) / 1000, 0.05); last = ts;
              step(dt); if (drawFn) drawFn();
              raf = requestAnimationFrame(f);
            });
          },
          pause: function () { api.playing = false; if (raf) cancelAnimationFrame(raf); },
          toggle: function () { api.playing ? api.pause() : api.play(); }
        };
        return api;
      },
      playPause: function (loop) {
        var b = el("button", "btn primary");
        b.type = "button";
        function sync() { b.textContent = loop.playing ? I18N.t("sim.pause") : I18N.t("sim.play"); }
        b.addEventListener("click", function () { loop.toggle(); sync(); });
        refreshers.push(sync); sync();
        var row = el("div", "btn-row"); row.appendChild(b); controls.appendChild(row);
        return { el: b, sync: sync };
      },
      refreshers: refreshers
    };

    // language change -> re-apply text, re-run formatters, redraw
    window.addEventListener("langchange", function () {
      refreshers.forEach(function (fn) { fn(); });
      S.requestDraw();
    });

    cfg.build(S);
    refreshers.forEach(function (fn) { fn(); });
    I18N.apply(document);
    S.requestDraw();
  }

  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function round(v) { return Math.round(v * 100) / 100; }

  return { create: create };
})();
