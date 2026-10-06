/* ===========================================================================
   _swfshape.js — draw vector art lifted out of a SWF.
   ---------------------------------------------------------------------------
   `python3 tools/swf-inspect.py canvas <file.swf> <ids>` turns DefineShape
   records into plain data: { nz, layers: [[fills, strokes], …] }, a fill being
   [style, pathData] and a stroke [width, style, pathData], with SVG path data
   in the shape's own pixels. A style is a CSS colour or a gradient
   { t: "l" | "r", m: [sx, r0, r1, sy, tx, ty], s: [[offset, colour], …] }
   laid over Flash's ±819.2 px gradient square by its matrix.

   This is the same renderer _celestialsphere.js carries (CelestialSphere.
   drawShape), for the sims that draw SWF art without a celestial sphere:
     SwfShape.draw(ctx, spec [, {fill, stroke}])   the whole shape, layer by layer
     SwfShape.path(spec)                            its fills as one Path2D (a mask)
   Strokes get round caps and joins, like Flash's lineStyle; one thinner than a
   device pixel (the SWFs' 0.05 px "hairlines") is drawn one device pixel wide.
   =========================================================================== */
window.SwfShape = (function () {
  function compile(spec) {
    if (spec._c) return spec._c;
    spec._c = spec.layers.map(function (L) {
      return {
        fills: L[0].map(function (f) { return { style: f[0], path: new Path2D(f[1]) }; }),
        strokes: L[1].map(function (s) { return { w: s[0], style: s[1], path: new Path2D(s[2]) }; })
      };
    });
    return spec._c;
  }
  // a gradient is built in the shape's own space: a linear one runs along its matrix's
  // x axis between the gradient square's edges (worked out from the inverse matrix, so a
  // skewed one comes out right); the radial ones are plain circles of 819.2 × the scale
  function paint(ctx, st) {
    if (typeof st === "string") return st;
    var m = st.m, grad;
    if (st.t === "l") {
      var det = m[0] * m[3] - m[1] * m[2];
      if (!det) return st.s[0][1];
      var ix = m[3] / det, iy = -m[2] / det, q = ix * ix + iy * iy;
      var ax = m[4] - 819.2 * ix / q, ay = m[5] - 819.2 * iy / q;
      grad = ctx.createLinearGradient(ax, ay, ax + 1638.4 * ix / q, ay + 1638.4 * iy / q);
    } else grad = ctx.createRadialGradient(m[4], m[5], 0, m[4], m[5], 819.2 * Math.hypot(m[0], m[1]));
    st.s.forEach(function (s) { grad.addColorStop(s[0], s[1]); });
    return grad;
  }
  function hairline(ctx) {
    var t = ctx.getTransform(), k = Math.sqrt(Math.abs(t.a * t.d - t.b * t.c));
    return k > 0 ? 1 / k : 1;
  }
  function draw(ctx, spec, override) {
    var Ls = compile(spec);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (var i = 0; i < Ls.length; i++) {
      var L = Ls[i], j;
      for (j = 0; j < L.fills.length; j++) {
        ctx.fillStyle = override && override.fill ? override.fill : paint(ctx, L.fills[j].style);
        ctx.fill(L.fills[j].path, spec.nz ? "nonzero" : "evenodd");
      }
      for (j = 0; j < L.strokes.length; j++) {
        var s = L.strokes[j];
        ctx.lineWidth = s.w >= 1 ? s.w : Math.max(s.w, hairline(ctx));
        ctx.strokeStyle = override && override.stroke ? override.stroke : paint(ctx, s.style);
        ctx.stroke(s.path);
      }
    }
  }
  function path(spec) {
    if (spec._mask) return spec._mask;
    var p = new Path2D();
    spec.layers.forEach(function (L) { L[0].forEach(function (f) { p.addPath(new Path2D(f[1])); }); });
    return (spec._mask = p);
  }
  return { draw: draw, paint: paint, path: path };
})();
