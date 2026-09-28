/* Shared CCD star-field engine ---------------------------------------------------
   The `StarField`, `AiryDisc`, `GammaTransferFunction` and `PixelMask` classes out
   of NAAP's Variable Star Photometry SWFs (photometrySimulator,
   registrationSimulator, blinkComparatorSimulator), disassembled with
   tools/swf-abc.py. All three labs share them, so they live here.

   The model, in the original's own terms: a 16-bit detector (peak 65535) reads a
   Gaussian noise floor, and each star adds an Airy disc scaled by
   peak · 10^((saturationMagnitude − magnitude) / 2.5). The frame is then shown
   through a gamma 1.8 transfer function.

   The noise comes from the SWF's own generator — a Lehmer LCG (seed · 16807 mod
   2^31−1) feeding polar Box–Muller — and is then shuffled in chunks of
   ceil(w·h / round(0.7·w)) (forced odd) by a Fisher–Yates pass driven by the same
   LCG, so a given seed always produces the same frame.                        */
(function () {
  "use strict";

  var PEAK = 65535;                              // bitDepth 16
  var GAMMA = 1.8;

  /* Numerical-Recipes bessj1; the Airy disc only ever needs |x| < 3.83 */
  function besselJ1(x) {
    var ax = Math.abs(x), y, a1, a2;
    if (ax < 8) {
      y = x * x;
      a1 = x * (72362614232 + y * (-7895059235 + y * (242396853.1 +
        y * (-2972611.439 + y * (15704.4826 + y * (-30.16036606))))));
      a2 = 144725228442 + y * (2300535178 + y * (18583304.74 +
        y * (99447.43394 + y * (376.9991397 + y))));
      return a1 / a2;
    }
    var z = 8 / ax, y2 = z * z, xx = ax - 2.356194491;
    a1 = 1 + y2 * (0.183105e-2 + y2 * (-0.3516396496e-4 +
      y2 * (0.2457520174e-5 + y2 * (-0.240337019e-6))));
    a2 = 0.04687499995 + y2 * (-0.2002690873e-3 + y2 * (0.8449199096e-5 +
      y2 * (-0.88228987e-6 + y2 * 0.105787412e-6)));
    var ans = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * a1 - z * Math.sin(xx) * a2);
    return x < 0 ? -ans : ans;
  }

  /* AiryDisc.reset: k = j₁₁ / radius, value 4·J1(r)²/r², cut at the first dark
     ring and forced to 1 at the centre                                        */
  var psfCache = {};
  function airyDisc(radius) {
    if (psfCache[radius]) return psfCache[radius];
    var size = 2 * radius + 1, centre = radius, k = 3.831705970256774 / radius;
    var d = [], i, j;
    for (i = 0; i < size; i++) { d.push(new Float64Array(size)); }
    for (i = 0; i < radius; i++) {
      for (j = 0; j <= i; j++) {
        var u = k * i, v = k * j, r2 = u * u + v * v, val = 0;
        if (r2 < 14.681970642501405) {
          var b = besselJ1(Math.sqrt(r2));
          val = 4 * b * b / r2;
        }
        d[centre + i][centre - j] = val; d[centre + j][centre - i] = val;
        d[centre - j][centre - i] = val; d[centre - i][centre - j] = val;
        d[centre - i][centre + j] = val; d[centre - j][centre + i] = val;
        d[centre + j][centre + i] = val; d[centre + i][centre + j] = val;
      }
    }
    d[centre][centre] = 1;
    psfCache[radius] = { size: size, centre: centre, data: d, radius: radius };
    return psfCache[radius];
  }

  /* StarField.generateNoise + shuffleNoise, giving the noise already in pixel
     order so callers can just add stars on top                                */
  function noiseField(w, h, mean, sigma, seed) {
    var numChunks = Math.round(0.7 * w) || 1;
    var chunkSize = Math.ceil(w * h / numChunks);
    if (chunkSize % 2 !== 1) chunkSize += 1;
    var total = numChunks * chunkSize;
    var raw = new Float64Array(total);
    var s = seed >>> 0 || 1, i, u1, u2, q, f;
    function next() { s = (s * 16807) % 2147483647; return s; }
    for (i = 0; i < total;) {
      do {
        u1 = 2 * (s / 2147483647) - 1; next();
        u2 = 2 * (s / 2147483647) - 1; next();
        q = u1 * u1 + u2 * u2;
      } while (q >= 1 || q === 0);
      f = Math.sqrt(-2 * Math.log(q) / q);
      raw[i++] = mean + sigma * u1 * f;
      if (i < total) raw[i++] = mean + sigma * u2 * f;
    }
    var table = new Int32Array(numChunks);
    for (i = 0; i < numChunks; i++) table[i] = i;
    s = seed >>> 0 || 1;
    for (i = 0; i < numChunks - 1; i++) {
      var j = i + ((numChunks - i) * (s / 2147483647)) | 0;
      next();
      var t = table[j]; table[j] = table[i]; table[i] = t;
    }
    var out = new Float64Array(w * h);
    for (i = 0; i < w * h; i++) {
      var chunk = (i / chunkSize) | 0;
      out[i] = raw[i - chunk * chunkSize + chunkSize * table[chunk]];
    }
    return out;
  }

  /* StarField.update: noise, plus each star's Airy disc scaled by its magnitude */
  function render(cfg) {
    var w = cfg.width, h = cfg.height;
    var counts = noiseField(w, h, cfg.noiseMean, cfg.noiseSigma, cfg.seed || 1);
    var psf = cfg.psf || airyDisc(4);
    var satMag = cfg.saturationMagnitude;
    for (var n = 0; n < cfg.stars.length; n++) {
      var st = cfg.stars[n];
      var peak = PEAK * Math.pow(10, (satMag - st.magnitude) / 2.5);
      var x0 = Math.round(st.x) - psf.centre, y0 = Math.round(st.y) - psf.centre;
      for (var i = 0; i < psf.size; i++) {
        var px = x0 + i;
        if (px < 0 || px >= w) continue;
        var col = psf.data[i];
        for (var j = 0; j < psf.size; j++) {
          var py = y0 + j;
          if (py < 0 || py >= h || col[j] <= 0) continue;
          counts[px + py * w] += peak * col[j];
        }
      }
    }
    return counts;
  }

  /* GammaTransferFunction: 255·(v/peak)^(1/γ), optionally inverted */
  var lut = null, lutInv = null;
  function tables() {
    if (lut) return;
    lut = new Uint8Array(PEAK + 1); lutInv = new Uint8Array(PEAK + 1);
    for (var v = 0; v <= PEAK; v++) {
      var g = 255 * Math.pow(v / PEAK, 1 / GAMMA) | 0;
      lut[v] = g; lutInv[v] = 255 - g;
    }
  }
  function paint(imageData, counts, invert) {
    tables();
    var t = invert ? lutInv : lut, d = imageData.data;
    for (var i = 0, p = 0; i < counts.length; i++, p += 4) {
      var v = counts[i];
      v = v < 0 ? 0 : v > PEAK ? PEAK : v | 0;
      var g = t[v];
      d[p] = g; d[p + 1] = g; d[p + 2] = g; d[p + 3] = 255;
    }
    return imageData;
  }
  function grey(v, invert) {
    tables();
    v = v < 0 ? 0 : v > PEAK ? PEAK : v | 0;
    return (invert ? lutInv : lut)[v];
  }

  /* PixelMask(radius): every integer offset inside the disc. Radius 5 gives 81
     pixels and radius 10 gives 317, which are the counts the SWF reports.     */
  var maskCache = {};
  function pixelMask(radius) {
    if (maskCache[radius]) return maskCache[radius];
    var out = [], r2 = radius * radius;
    for (var dy = -radius; dy <= radius; dy++) {
      for (var dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= r2) out.push([dx, dy]);
      }
    }
    maskCache[radius] = out;
    return out;
  }
  /* StarField.getStatistics: anything off the frame is simply not counted */
  function stats(counts, w, h, cx, cy, mask) {
    var total = 0, n = 0;
    for (var i = 0; i < mask.length; i++) {
      var x = cx + mask[i][0], y = cy + mask[i][1];
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      var v = counts[x + y * w];
      v = v < 0 ? 0 : v > PEAK ? PEAK : v | 0;
      total += v; n++;
    }
    return { totalPixels: n, totalCounts: total, average: n ? total / n : 0 };
  }

  window.STARFIELD = { PEAK: PEAK, GAMMA: GAMMA, airyDisc: airyDisc, render: render,
    paint: paint, grey: grey, pixelMask: pixelMask, stats: stats, besselJ1: besselJ1 };
})();
