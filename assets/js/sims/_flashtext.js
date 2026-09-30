/* ===========================================================================
   _flashtext.js — Flash text, laid out the way Ruffle draws it.
   ---------------------------------------------------------------------------
   The sims in this folder are canvas rebuilds of Flash SWFs, and the live SWF
   (play.html?a=<slug>, Ruffle) is the ground truth. Set with the canvas's own
   text engine a label drifts from Ruffle's by up to a pixel or two. Measured
   against Ruffle 0.6.0 with the pixel-exact harness (memory note
   play-html-swf-reference), Flash text differs in four ways:

     1. It is UNKERNED: ctx.fontKerning = "none".          FlashText.begin(ctx)
        sets that; call it at the start of every draw().
     2. A TextField (dynamic or input text) is laid out with each glyph's advance
        FLOORED to a whole twip (1/20 px), about −0.025 px a glyph, so a label is
        set glyph by glyph on those advances:                FlashText.fill()
        Static text (a DefineText the author typed on the stage) has no runtime
        layout at all: Flash stored each glyph's advance ROUNDED to the nearest
        twip in the SWF (260 static runs checked: 257 sum to exactly the SWF's own
        run width; floored advances come out 0.6 px short on average):
                                                             FlashText.fillStatic()
     3. TextField.textWidth is floored to whole PIXELS. A SWF that positions
        something from textWidth — NAAP's displayText aligns its runs from it, a
        Standard Slider v6 label sits at −fieldMargin − labelOffset − textWidth, a
        Panel Background title rule starts at 2·xMargin + textWidth — needs
        FlashText.textWidth(), not the laid-out width that alignment uses inside a
        field (a field's _width, a centred or right-aligned TextField).
     4. createTextField(name, depth, x, y, w, h) truncates x and y to integers, so
        a label made that way sits at −frac(x), −frac(y) from where its script
        computed it: run the position through FlashText.int().

   Only text that the SWF sets in a Flash font belongs here — leave a sim's own
   captions and HTML controls to the canvas/DOM as they are.

     FlashText.begin(ctx)                     rule 1
     FlashText.fill(ctx, str, x, y [, align [, wholePx]])
                                              TextField text. align "left"|"center"|"right",
                                              default ctx.textAlign; wholePx aligns by
                                              floor(width) (a script that reads textWidth).
                                              Returns the laid-out width.
     FlashText.fillStatic(ctx, str, x, y [, align])    static text
     FlashText.stroke(ctx, str, x, y [, align])        strokeText on the TextField layout
     FlashText.width(ctx, str)                the laid-out width (sum of floored advances)
     FlashText.widthStatic(ctx, str)          the same for static text (rounded advances)
     FlashText.textWidth(ctx, str)            rule 3: floor(width), TextField.textWidth
     FlashText.int(v)                         rule 4: ActionScript int(), truncation toward 0
   =========================================================================== */
window.FlashText = (function () {
  var advCache = { f: {}, r: {} }, layCache = {}, layCount = 0;

  function advance(ctx, ch, mode) {              // one glyph, floored ("f") or rounded ("r") to a twip
    var k = ctx.font + "|" + ch, c = advCache[mode], a = c[k];
    if (a === undefined) {
      var t = ctx.measureText(ch).width * 20;
      a = c[k] = (mode === "r" ? Math.round(t) : Math.floor(t + 1e-6)) / 20;
    }
    return a;
  }
  function layout(ctx, str, mode) {
    var key = mode + "|" + ctx.font + "|" + str, L = layCache[key];
    if (L) return L;
    var g = Array.from(String(str)), xs = new Array(g.length), x = 0;
    for (var i = 0; i < g.length; i++) { xs[i] = x; x += advance(ctx, g[i], mode); }
    if (layCount++ > 4000) { layCache = {}; layCount = 0; }        // readouts churn: keep the cache bounded
    return (layCache[key] = { g: g, xs: xs, w: x });
  }
  function draw(ctx, str, x, y, align, mode, stroke, wholePx) {
    var L = layout(ctx, str, mode), a = typeof align === "string" ? align : ctx.textAlign, was = ctx.textAlign;
    var w = wholePx ? Math.floor(L.w) : L.w;
    var x0 = a === "center" ? x - w / 2 : a === "right" || a === "end" ? x - w : x;
    ctx.textAlign = "left";
    for (var i = 0; i < L.g.length; i++) {
      if (L.g[i] === " ") continue;
      if (stroke) ctx.strokeText(L.g[i], x0 + L.xs[i], y); else ctx.fillText(L.g[i], x0 + L.xs[i], y);
    }
    ctx.textAlign = was;
    return L.w;
  }

  return {
    begin: function (ctx) { ctx.fontKerning = "none"; },
    fill: function (ctx, str, x, y, align, wholePx) { return draw(ctx, str, x, y, align, "f", false, wholePx); },
    fillStatic: function (ctx, str, x, y, align) { return draw(ctx, str, x, y, align, "r", false, false); },
    stroke: function (ctx, str, x, y, align) { return draw(ctx, str, x, y, align, "f", true, false); },
    width: function (ctx, str) { return layout(ctx, str, "f").w; },
    widthStatic: function (ctx, str) { return layout(ctx, str, "r").w; },
    textWidth: function (ctx, str) { return Math.floor(layout(ctx, str, "f").w); },
    int: function (v) { return v < 0 ? Math.ceil(v) : Math.floor(v); }
  };
})();
