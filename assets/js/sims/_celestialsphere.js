/* ===========================================================================
   _celestialsphere.js — the UNL "CelestialSphere" component, shared.
   ---------------------------------------------------------------------------
   Every horizon diagram in the ClassAction / NAAP SWFs is one Flash component,
   CelestialSphereClass (AS2, with CSObjectsClass, CSCirclesClass, CSLinesClass
   and CSShadedBandClass), linked into each SWF as the library symbol
   "CelestialSphere". This file is a port of that component, read from the
   decompiled ActionScript (python3 tools/swf-actions.py <swf> CelestialSphere):
   the same matrices, the same layer stack, the same hemisphere masks, the same
   quadratic-curve circles and the same mouse behaviours, so a sim that sets it
   up the way its SWF did draws and drags the way its SWF did.

   Used by altazimuth, ce_hc, fullmoondec, heliacalrisingsim, lunar-phases,
   positionsdemonstrator, siderealtimeandhourangledemo, sun-motions, sunpaths,
   sunmotionsoverview and transitmovie. A sim keeps only what was its own in
   the SWF: which circles, objects and clips it adds, their art and colours, and
   what it does when they change.

     var sph = new CelestialSphere({ x: 213, y: 228, size: 320,
                                     viewerAzimuth: 200, viewerAltitude: 30,
                                     latitude: 41, siderealTime: 0 });
     sph.addCircle("celestialEquator", { thickness: 2, color: 0xe8d898, alpha: 100 },
                   { tilt: 0, dec: 0, ra: 0 });
     sph.addObject("stickfigure", CelestialSphere.art.stickfigure,
                   { system: "horizon", x: 0, y: 0, z: 0.0001 });
     sph.stickfigure.setOrientationType("absolute", { system: "horizon", x: -1, y: 0, z: 0 },
                                                    { system: "horizon", x: 0, y: 0, z: 1 });
     sph.draw(ctx);                      // the whole stack, in stage coordinates

   ---- Coordinates (the SWF's own) --------------------------------------------
   horizon system  x = north, y = WEST, z = zenith;  {alt, az}: az from north
                   through east (x = cos alt cos az, y = −cos alt sin az)
   celestial       x toward RA 0h, y toward RA 6h, z = NCP;  {ra (hours), dec}
   either          {x, y, z, system: "horizon" | "celestial"}, any {r: …}
   r < 1 is inside the sphere, r = 1 on it, r > 1 outside — that decides the
   layer an object is drawn in. theta/phi are the view: phi is the viewer's
   altitude, theta = 360 − the viewer's azimuth.

   ---- The layer stack (CelestialSphereClass constructor, N = depth band) -----
     back external objects · _bEL back lines outside the sphere
     _bOSB _bOSA _bOSF (shading, outer surface, back) · _bC back circle halves
     back surface objects · _bISB _bISA _bISF (shading, inner surface, back)
     inner objects below the horizon · _iLB · _hP horizon plane · inner objects
     above · _iLA · _fISB _fISA _fISF · _fC front circle halves · front surface
     objects · _fOSB _fOSA _fOSF · front external objects · _fEL
   (viewed from below the horizon the inner objects and inner lines swap sides
   of the plane). B / A / F = below the horizon / above / full: each shading
   layer is masked by its hemisphere's outline (createMasks M1–M4), and with
   showUnder off everything below the horizon is masked away (M5).
   =========================================================================== */
window.CelestialSphere = (function () {
  "use strict";
  var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
  var H2R = 0.2617993877991494, R2H = 3.819718634205488;
  var HALF_PI = Math.PI / 2;

  function mod(n, m) { return ((n % m) + m) % m; }
  function isNum(v) { return typeof v === "number" && isFinite(v); }
  function colorCss(c, alpha) {                  // 0xRRGGBB (or "#rrggbb") and a Flash alpha 0–100
    if (typeof c === "string") {
      if (alpha === undefined || alpha >= 100) return c;
      c = parseInt(c.slice(1), 16);
    }
    var a = alpha === undefined ? 1 : isFinite(alpha) ? Math.max(0, Math.min(100, alpha)) / 100 : 0;   // NaN: none, as Flash
    return "rgba(" + ((c >> 16) & 255) + "," + ((c >> 8) & 255) + "," + (c & 255) + "," + a + ")";
  }

  /* ---- parsePointInput: {alt, az} | {ra, dec} | {x, y, z, system}, optional r ---- */
  function parsePoint(p) {
    var o = { sys: null, system: null, x: null, y: null, z: null, r: null };
    if (!p) return o;
    var r, d;
    if (p.az !== undefined && p.alt !== undefined) {
      r = p.r === undefined ? 1 : p.r;
      d = r * Math.cos(p.alt * RAD);
      o.sys = 0; o.system = "horizon";
      o.x = d * Math.cos(p.az * RAD); o.y = d * Math.sin(-p.az * RAD); o.z = r * Math.sin(p.alt * RAD);
      o.r = Math.abs(r);
    } else if (p.ra !== undefined && p.dec !== undefined) {
      r = p.r === undefined ? 1 : p.r;
      d = r * Math.cos(p.dec * RAD);
      o.sys = 1; o.system = "celestial";
      o.x = d * Math.cos(p.ra * H2R); o.y = d * Math.sin(p.ra * H2R); o.z = r * Math.sin(p.dec * RAD);
      o.r = Math.abs(r);
    } else if (p.x !== undefined && p.y !== undefined && p.z !== undefined) {
      if (p.system === "horizon") { o.sys = 0; o.system = "horizon"; }
      else if (p.system === "celestial") { o.sys = 1; o.system = "celestial"; }
      else { o.sys = -1; o.system = "unknown"; }
      o.x = p.x; o.y = p.y; o.z = p.z;
      o.r = Math.sqrt(o.x * o.x + o.y * o.y + o.z * o.z);
      if (o.r < 1.000001 && o.r > 0.999999) o.r = 1;
    }
    return o;
  }

  /* ================================================================ the sphere */
  function Sphere(opts) {
    opts = opts || {};
    this.x = opts.x || 0;                          // the sphere clip's position on the stage
    this.y = opts.y || 0;
    this._c = { r: 150, r2: 22500 };
    this._aVer = -1; this._bVer = -1;
    this._objectList = []; this._objectFreeID = 0;
    this._circleList = [];
    this._lineList = [];
    this._bandList = [];
    this._maxPhi = 90; this._minPhi = -90;
    this._showUnder = true;
    this._showHPlane = true;
    this._phi = 30 * RAD;
    this._theta = 90 * RAD;
    this._sortObjects = true;
    this._mouseBehavior = "simple drag";
    this._drag = null;
    this.onMouseUpdate = null;
    // shading layers, each a list of clips and bands in attach order
    this._layers = {};
    ["bOSB", "bOSA", "bOSF", "bISB", "bISA", "bISF", "fISB", "fISA", "fISF", "fOSB", "fOSA", "fOSF"]
      .forEach(function (k) { this._layers[k] = []; }, this);
    this._plane = { above: [], below: [] };
    Sphere.instances.push(this);                   // (for tests and debugging)
    this.setThetaAndPhi(90, 30);
    this.setLatitude(41);
    this.setSiderealTime(0);
    // the constructor's own clips
    this.addHorizonPlaneClip(ART.planeAbove, "aboveHorizonPlane", "above", 0);
    this.addHorizonPlaneClip(ART.planeBelow, "belowHorizonPlane", "below", 0);
    this.addShadingClip(GradientDisk, "celestialBowl", "front", "inner", "both",
      { outerColor: 0x000000, outerAlpha: 20, innerColor: 0xffffff, innerAlpha: 0 });
    // the options, in the order a SWF's init code usually sets them
    if (opts.size !== undefined) this.size = opts.size;
    if (opts.maxViewerAltitude !== undefined) this.maxViewerAltitude = opts.maxViewerAltitude;
    if (opts.minViewerAltitude !== undefined) this.minViewerAltitude = opts.minViewerAltitude;
    if (opts.theta !== undefined || opts.phi !== undefined)
      this.setThetaAndPhi(opts.theta !== undefined ? opts.theta : this.theta, opts.phi !== undefined ? opts.phi : this.phi);
    if (opts.viewerAzimuth !== undefined) this.viewerAzimuth = opts.viewerAzimuth;
    if (opts.viewerAltitude !== undefined) this.viewerAltitude = opts.viewerAltitude;
    if (opts.latitude !== undefined) this.latitude = opts.latitude;
    if (opts.siderealTime !== undefined) this.siderealTime = opts.siderealTime;
    if (opts.showUnder !== undefined) this.showUnder = opts.showUnder;
    if (opts.showHorizonPlane !== undefined) this.showHorizonPlane = opts.showHorizonPlane;
    if (opts.sortObjects !== undefined) this.sortObjects = opts.sortObjects;
    if (opts.mouseBehavior !== undefined) this.setMouseBehavior(opts.mouseBehavior);
  }
  var P = Sphere.prototype;
  Sphere.instances = [];

  /* ---- the view and the sky (init102) ---- */
  P.setThetaAndPhi = function (newTheta, newPhi) {
    this._theta = RAD * mod(newTheta, 360);
    if (newPhi > this._maxPhi) newPhi = this._maxPhi;
    else if (newPhi < this._minPhi) newPhi = this._minPhi;
    this._phi = newPhi * RAD;
    this.doA(); this.doB();
  };
  P.setPhiAndTheta = function (newPhi, newTheta) { this.setThetaAndPhi(newTheta, newPhi); };
  P.setLatitude = function (arg) {
    if (arg > 90) arg = 90; else if (arg < -90) arg = -90;
    this._lat = arg * RAD;
    this.doM(); this.doB();
  };
  P.setSiderealTime = function (arg) {
    this._sTime = mod(arg, 24) * H2R;
    this.doM(); this.doB();
  };
  P.setMinPhi = function (arg) { this._minPhi = arg > 90 || arg < -90 ? 90 : arg; };
  P.setMaxPhi = function (arg) { this._maxPhi = arg > 90 || arg < -90 ? 90 : arg; };
  Object.defineProperties(P, {
    theta: { get: function () { return DEG * this._theta; },
      set: function (v) { this._theta = RAD * mod(v, 360); this.doA(); this.doB(); } },
    phi: { get: function () { return DEG * this._phi; },
      set: function (v) { this.setThetaAndPhi(this.theta, v); } },
    viewerAltitude: { get: function () { return DEG * this._phi; },
      set: function (v) { this.setThetaAndPhi(this.theta, v); } },
    // getViewerAzimuth reads this.theta (the property), i.e. (360 − θ°) % 360
    viewerAzimuth: { get: function () { return (360 - this.theta) % 360; },
      set: function (v) { this.theta = 360 - v; } },
    size: { get: function () { return 2 * this._c.r; },
      set: function (v) { this._c.r = v / 2; this._c.r2 = this._c.r * this._c.r; this.doA(); this.doB(); } },
    r: { get: function () { return this._c.r; } },
    siderealTime: { get: function () { return this._sTime * R2H; }, set: function (v) { this.setSiderealTime(v); } },
    latitude: { get: function () { return DEG * this._lat; }, set: function (v) { this.setLatitude(v); } },
    showUnder: { get: function () { return this._showUnder; }, set: function (v) { this._showUnder = Boolean(v); } },
    showHorizonPlane: { get: function () { return this._showHPlane; }, set: function (v) { this._showHPlane = Boolean(v); } },
    minViewerAltitude: { get: function () { return this._minPhi; }, set: function (v) { this.setMinPhi(v); } },
    maxViewerAltitude: { get: function () { return this._maxPhi; }, set: function (v) { this.setMaxPhi(v); } },
    sortObjects: { get: function () { return this._sortObjects; }, set: function (v) { this._sortObjects = Boolean(v); } }
  });

  /* ---- the matrices (init101): A = view, M = sky → horizon, B = A·M ---- */
  P.doA = function () {
    var c = this._c, ct = Math.cos(this._theta), st = Math.sin(this._theta);
    var cp = Math.cos(this._phi), sp = Math.sin(this._phi);
    c.a0 = -c.r * st; c.a1 = c.r * ct; c.a2 = 0;
    c.a3 = c.r * ct * sp; c.a4 = c.r * st * sp; c.a5 = -c.r * cp;
    c.a6 = c.r * ct * cp; c.a7 = c.r * st * cp; c.a8 = c.r * sp;
    this._aVer++;
  };
  P.doM = function () {
    var c = this._c;
    c.m2 = Math.cos(this._lat); c.m3 = Math.sin(this._sTime); c.m4 = -Math.cos(this._sTime);
    c.m8 = Math.sin(this._lat);
    c.m0 = c.m4 * c.m8; c.m1 = -c.m3 * c.m8; c.m5 = 0;
    c.m6 = -c.m2 * c.m4; c.m7 = c.m2 * c.m3;
  };
  P.doB = function () {
    var c = this._c;
    if (c.m0 === undefined) return;
    c.b0 = c.a0 * c.m0 + c.a1 * c.m3; c.b1 = c.a0 * c.m1 + c.a1 * c.m4; c.b2 = c.a0 * c.m2;
    c.b3 = c.a3 * c.m0 + c.a4 * c.m3 + c.a5 * c.m6; c.b4 = c.a3 * c.m1 + c.a4 * c.m4 + c.a5 * c.m7;
    c.b5 = c.a3 * c.m2 + c.a5 * c.m8;
    c.b6 = c.a6 * c.m0 + c.a7 * c.m3 + c.a8 * c.m6; c.b7 = c.a6 * c.m1 + c.a7 * c.m4 + c.a8 * c.m7;
    c.b8 = c.a6 * c.m2 + c.a8 * c.m8;
    this._bVer++;
  };
  // horizon / celestial cartesian → sphere-local screen offset (x right, y down, z toward the viewer)
  P.WtoSz = function (p, out) {
    var c = this._c; out = out || {};
    out.x = p.x * c.a0 + p.y * c.a1;
    out.y = p.x * c.a3 + p.y * c.a4 + p.z * c.a5;
    out.z = p.x * c.a6 + p.y * c.a7 + p.z * c.a8;
    return out;
  };
  P.CtoSz = function (p, out) {
    var c = this._c; out = out || {};
    out.x = p.x * c.b0 + p.y * c.b1 + p.z * c.b2;
    out.y = p.x * c.b3 + p.y * c.b4 + p.z * c.b5;
    out.z = p.x * c.b6 + p.y * c.b7 + p.z * c.b8;
    return out;
  };
  P.CtoW = function (p, out) {
    var c = this._c; out = out || {};
    out.x = p.x * c.m0 + p.y * c.m1 + p.z * c.m2;
    out.y = p.x * c.m3 + p.y * c.m4;
    out.z = p.x * c.m6 + p.y * c.m7 + p.z * c.m8;
    return out;
  };
  P.WtoC = function (p, out) {
    var c = this._c; out = out || {};
    out.x = p.x * c.m0 + p.y * c.m3 + p.z * c.m6;
    out.y = p.x * c.m1 + p.y * c.m4 + p.z * c.m7;
    out.z = p.x * c.m2 + p.z * c.m8;
    return out;
  };
  // celestial (radians) ↔ the engine's own horizon angles (radians, az measured the other way)
  P.CtoMH = function (cp, hp) {
    var sd = Math.sin(cp.dec), cd = Math.cos(cp.dec), sl = Math.sin(this._lat), cl = Math.cos(this._lat);
    var h = this._sTime - cp.ra, ch = Math.cos(h);
    var caz = sd * cl - cd * ch * sl, saz = cd * Math.sin(h);
    hp.az = caz === 0 ? 0 : mod(Math.atan2(saz, caz), TAU);
    hp.alt = Math.asin(sd * sl + cd * ch * cl);
    return hp;
  };
  P.MHtoC = function (hp, cp) {
    var salt = Math.sin(hp.alt), calt = Math.cos(hp.alt), saz = Math.sin(hp.az), caz = Math.cos(hp.az);
    var sl = Math.sin(this._lat), cl = Math.cos(this._lat);
    var sh = calt * saz, ch = salt * cl - calt * sl * caz;
    cp.ra = ch === 0 ? 0 : mod(this._sTime - Math.atan2(sh, ch), TAU);
    cp.dec = Math.asin(salt * sl + calt * caz * cl);
    return cp;
  };
  // sphere-local screen point → the engine's horizon angles (radians), on the near hemisphere
  P.StoMH = function (sp, hp) {
    var d = Math.sqrt(sp.x * sp.x + sp.y * sp.y) / this._c.r;
    if (d > 1) d = 1;
    var b = Math.asin(d), A = Math.atan2(sp.x, -sp.y);
    if (this._phi === HALF_PI) { hp.alt = HALF_PI - b; hp.az = this._theta + Math.PI - A; }
    else if (this._phi === -HALF_PI) { hp.alt = -HALF_PI + b; hp.az = this._theta + A; }
    else {
      var c = HALF_PI - this._phi, cc = Math.cos(c), sc = Math.sin(c), cb = Math.cos(b), sb = Math.sin(b);
      var ca = cb * cc + sb * sc * Math.cos(A);
      hp.alt = HALF_PI - Math.acos(ca);
      hp.az = this._theta + Math.atan2(sb * Math.sin(A), (cb - ca * cc) / sc);
    }
    hp.az = mod(hp.az, TAU);
    return hp;
  };

  /* ---- public conversions; screen points are STAGE coordinates ---- */
  P.toScreen = function (up) {                     // → {x, y, z} on the stage, z toward the viewer
    var p = parsePoint(up), s;
    if (p.sys === 0 || p.sys === -1) s = this.WtoSz(p);
    else if (p.sys === 1) s = this.CtoSz(p);
    else return { x: null, y: null, z: null };
    return { x: this.x + s.x, y: this.y + s.y, z: s.z };
  };
  P.screenToHorizon = function (x, y) {            // {alt, az} in degrees, az from north through east
    var hp = this.StoMH({ x: x - this.x, y: y - this.y }, {});
    return { az: (360 - hp.az * DEG) % 360, alt: hp.alt * DEG };
  };
  P.screenToCelestial = function (x, y) {          // {ra (hours), dec}
    var hp = this.StoMH({ x: x - this.x, y: y - this.y }, {}), cp = this.MHtoC(hp, {});
    return { ra: cp.ra * R2H, dec: cp.dec * DEG };
  };
  P.pointToHorizon = function (up) {
    var p = parsePoint(up), q = p;
    if (p.sys === 1) q = this.CtoW(p);
    else if (p.sys !== 0 && p.sys !== -1) return { az: null, alt: null, r: null };
    var s = Math.max(-1, Math.min(1, q.z / p.r));
    return { az: mod(-DEG * Math.atan2(q.y, q.x), 360), alt: DEG * Math.asin(s), r: p.r };
  };
  P.pointToCelestial = function (up) {
    var p = parsePoint(up), q = p;
    if (p.sys === 0 || p.sys === -1) q = this.WtoC(p);
    else if (p.sys !== 1) return { ra: null, dec: null, r: null };
    var s = Math.max(-1, Math.min(1, q.z / p.r));
    return { ra: mod(R2H * Math.atan2(q.y, q.x), 24), dec: DEG * Math.asin(s), r: p.r };
  };
  P.getMouseAltAz = function (x, y) {              // null outside the disc, as the SWF
    var dx = x - this.x, dy = y - this.y;
    if (Math.sqrt(dx * dx + dy * dy) > this._c.r) return { alt: null, az: null };
    return this.screenToHorizon(x, y);
  };
  P.getMouseRaDec = function (x, y) {
    var dx = x - this.x, dy = y - this.y;
    if (Math.sqrt(dx * dx + dy * dy) > this._c.r) return { ra: null, dec: null };
    return this.screenToCelestial(x, y);
  };

  /* ---- the mouse (init100): updateMouseArea + the three drag behaviours ---- */
  P.setMouseBehavior = function (arg) { this._mouseBehavior = arg; this._drag = null; };
  P.inMouseArea = function (x, y) {
    var dx = x - this.x, dy = y - this.y, r = this._c.r;
    if (this._showUnder || dy <= 0) return dx * dx + dy * dy <= r * r;
    var s = Math.sin(Math.abs(this._phi)) * r;     // the lower half of the horizon ellipse
    return s > 0 && (dx * dx) / (r * r) + (dy * dy) / (s * s) <= 1;
  };
  // returns true when a drag starts (the press was on the sphere's mouse area)
  P.startDrag = function (x, y) {
    var b = this._mouseBehavior;
    if (b !== "simple drag" && b !== "rotate about zenith" && b !== "rotate about NCP") return false;
    if (!this.inMouseArea(x, y)) return false;
    var lx = x - this.x, ly = y - this.y;
    if (b === "simple drag") {
      this._drag = { b: b, x: lx, y: ly, theta: this._theta, phi: this._phi };
    } else {
      if (Math.sqrt(lx * lx + ly * ly) > this._c.r) return false;
      var hp = this.StoMH({ x: lx, y: ly }, {});
      if (b === "rotate about zenith") this._drag = { b: b, az: hp.az };
      else this._drag = { b: b, ra: this.MHtoC(hp, {}).ra };
    }
    return true;
  };
  P.dragTo = function (x, y) {
    var d = this._drag;
    if (!d) return false;
    var lx = x - this.x, ly = y - this.y, hp;
    if (d.b === "simple drag") {
      this.setThetaAndPhi(DEG * (d.theta - (lx - d.x) / this._c.r), DEG * (d.phi + (ly - d.y) / this._c.r));
    } else if (d.b === "rotate about zenith") {
      hp = this.StoMH({ x: lx, y: ly }, {});
      this.theta = DEG * (this._theta + (d.az - hp.az));
    } else {
      hp = this.StoMH({ x: lx, y: ly }, {});
      this.setSiderealTime((this._sTime - this.MHtoC(hp, {}).ra + d.ra) * R2H);
    }
    if (this.onMouseUpdate) this.onMouseUpdate();
    return true;
  };
  P.endDrag = function () { var was = !!this._drag; this._drag = null; return was; };
  Object.defineProperty(P, "dragging", { get: function () { return !!this._drag; } });

  /* ---- clips: the horizon plane's and the shading layers' (init99, init98) ---- */
  function makeClip(draw, name, init) {
    var clip = { name: name, draw: draw, visible: true, alpha: 100 };
    if (init) for (var k in init) clip[k] = init[k];
    return clip;
  }
  P.addHorizonPlaneClip = function (draw, name, side, depth, init) {
    var list = this._plane[side === "below" ? "below" : "above"];
    if (typeof depth !== "number") {               // the first free depth from 0
      depth = 0;
      while (list.some(function (c) { return c.depth === depth; })) depth++;
    }
    list = list.filter(function (c) { return c.depth !== depth; });
    var clip = makeClip(draw, name, init);
    clip.depth = depth;
    list.push(clip);
    list.sort(function (a, b) { return a.depth - b.depth; });
    this._plane[side === "below" ? "below" : "above"] = list;
    this[name] = clip;
    return clip;
  };
  function layerKey(side, surface, hemisphere) {
    return (side === "back" ? "b" : "f") + (surface === "inner" ? "I" : "O") + "S" +
      (hemisphere === "below" ? "B" : hemisphere === "above" ? "A" : "F");
  }
  P.addShadingClip = function (draw, name, side, surface, hemisphere, init) {
    var clip = makeClip(draw, name, init);
    this._layers[layerKey(side, surface, hemisphere)].push(clip);
    this[name] = clip;
    return clip;
  };

  // clip.removeMovieClip(): drop a shading or horizon-plane clip by name
  P.removeClip = function (name) {
    var self = this;
    Object.keys(this._layers).forEach(function (k) {
      self._layers[k] = self._layers[k].filter(function (c) { return c.name !== name || c.band; });
    });
    ["above", "below"].forEach(function (k) {
      self._plane[k] = self._plane[k].filter(function (c) { return c.name !== name; });
    });
    if (this[name] && !this[name].band) delete this[name];
  };

  /* ---- the hemisphere masks M1–M4 (createMasks / updateMasks) ---- */
  // 1 = above the near half of the horizon, 2 = below it, 3 = above the far half,
  // 4 = below the far half (sphere-local, radius r; d = 1.2 r beyond the disc)
  P._maskPath = function (k) {
    var r = this._c.r, d = 1.2 * r, s = Math.sin(this._phi);
    var hnp = 4, step = Math.PI / hnp, half = step / 2, cr = r / Math.cos(half);
    var top = k === 1 || k === 3, flip = k === 3 || k === 4 ? -1 : 1;
    var y0 = top ? -d : d, path = new Path2D();
    path.moveTo(d, y0); path.lineTo(d, 0); path.lineTo(r, 0);
    for (var i = 0, a = step, c = step - half; i < hnp; i++, a += step, c += step)
      path.quadraticCurveTo(cr * Math.cos(c), flip * s * cr * Math.sin(c), r * Math.cos(a), flip * s * r * Math.sin(a));
    path.lineTo(-d, 0); path.lineTo(-d, y0); path.lineTo(d, y0);
    path.closePath();
    return path;
  };
  var MASK_UNDER = { bOSB: 4, bOSA: 3, bOSF: 0, bC: 0, bISB: 4, bISA: 3, bISF: 0,
    fISB: 2, fISA: 1, fISF: 0, fC: 0, fOSB: 2, fOSA: 1, fOSF: 0 };
  var MASK_NOUNDER = { bOSB: 5, bOSA: 3, bOSF: 3, bC: 3, bISB: 5, bISA: 3, bISF: 3,
    fISB: 5, fISA: 1, fISF: 1, fC: 1, fOSB: 5, fOSA: 1, fOSF: 1 };
  // set up a layer's mask on ctx (already at the sphere's centre); false = nothing shows
  P._applyMask = function (ctx, layer) {
    var k = (this._showUnder ? MASK_UNDER : MASK_NOUNDER)[layer];
    if (k === 5) return false;
    if (k) {
      var cache = this._maskCache || (this._maskCache = {});
      var key = k + "|" + this._c.r + "|" + this._phi;
      if (!cache[key]) {
        if (Object.keys(cache).length > 16) cache = this._maskCache = {};
        cache[key] = this._maskPath(k);
      }
      ctx.clip(cache[key]);
    }
    return true;
  };

  /* ================================================================ objects (init97) */
  function CSObject(sphere, name, id, draw, position, init) {
    this._sphere = sphere;
    this.name = name;
    this._id = id;
    this.draw = draw;
    this._p = parsePoint({ az: 0, alt: 0, r: 1 });
    this._sp = { x: 0, y: 0, z: 0 };
    this._o = { x: 0, y: 0, z: 0 };
    this._n = { x: 0, y: 0, z: 0 };
    this._u = { x: 0, y: 0, z: 0 };
    this._oType = 0;
    this.alpha = 100;
    this.xscale = 100; this.yscale = 100;          // the instance's own _xscale / _yscale
    this.shown = false;                            // shell._visible after the last update
    if (init) for (var k in init) {
      if (k === "_xscale") this.xscale = init[k];
      else if (k === "_yscale") this.yscale = init[k];
      else if (k === "_alpha") this.alpha = init[k];
      else this[k] = init[k];
    }
    if (typeof position !== "object" || !position) {
      this.setPosition({ r: 1, az: 0, alt: 0 });
      this._visible = false;
    } else {
      this.setPosition(position);
      this._visible = true;
    }
  }
  var O = CSObject.prototype;
  function vadd(a, b) { return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }; }
  O.setPosition = function (arg) {
    var p = parsePoint(arg);
    if (p.sys === 0 || p.sys === -1) this._sys = 0;
    else if (p.sys === 1) this._sys = 1;
    else return;
    this._p = p; this._r = p.r;
    this._p_o = vadd(p, this._o); this._p_n = vadd(p, this._n); this._p_u = vadd(p, this._u);
  };
  O.getPosition = function () {
    return { x: this._p.x, y: this._p.y, z: this._p.z, system: this._sys === 0 ? "horizon" : "celestial" };
  };
  // a direction given in either system, expressed in this object's own system
  O._inOwnSystem = function (arg) {
    var v = parsePoint(arg), s = this._sphere;
    if (v.sys === null) return null;
    if (v.sys === 0 && this._sys === 1) v = s.WtoC(v);
    else if (v.sys === 1 && this._sys === 0) v = s.CtoW(v);
    return v;
  };
  O.setOrientationType = function (type, arg2, arg3) {
    var p = this._p, m;
    if (type === "flat") { this._oType = 0; return; }
    if (type === "skewed") {
      this._oType = 1;
      var o;
      if (typeof arg2 !== "object") o = p;
      else { o = this._inOwnSystem(arg2); if (!o) return; }
      m = Math.sqrt(o.x * o.x + o.y * o.y + o.z * o.z);
      this._o = { x: o.x / m, y: o.y / m, z: o.z / m };
      this._p_o = vadd(p, this._o);
      return;
    }
    if (type !== "absolute") return;
    this._oType = 2;
    if (typeof arg2 !== "object" || typeof arg3 !== "object") {
      // no frame given: the normal is the position itself, "up" toward the system's pole
      m = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
      var n = { x: p.x / m, y: p.y / m, z: p.z / m };
      this._n = n;
      if (n.x === 0 && n.y === 0) this._u = { x: 0, y: 1, z: 0 };
      else {
        var u = { x: -n.x * n.z, y: -n.z * n.y, z: n.x * n.x + n.y * n.y };
        var un = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z);
        this._u = { x: u.x / un, y: u.y / un, z: u.z / un };
      }
    } else {
      var nv = this._inOwnSystem(arg2), av = this._inOwnSystem(arg3);
      if (!nv || !av) return;
      m = Math.sqrt(nv.x * nv.x + nv.y * nv.y + nv.z * nv.z);
      var nx = nv.x / m, ny = nv.y / m, nz = nv.z / m;
      this._n = { x: nx, y: ny, z: nz };
      var ax = av.x, ay = av.y, az = av.z;
      var ux = ny * ny * ax - nx * ny * ay - nx * nz * az + nz * nz * ax;
      var uy = nz * nz * ay - ny * nz * az - nx * ny * ax + nx * nx * ay;
      var uz = nx * nx * az - nx * nz * ax - ny * nz * ay + ny * ny * az;
      var un2 = Math.sqrt(ux * ux + uy * uy + uz * uz);
      this._u = { x: ux / un2, y: uy / un2, z: uz / un2 };
    }
    this._p_u = vadd(p, this._u);
    this._p_n = vadd(p, this._n);
  };
  // the shell's and the instance's transforms, as CSObjectsClass.update sets them
  // (Flash ignores a NaN or infinite write to _rotation / _yscale, so each value below
  // only replaces the previous one when it is finite)
  O.update = function () {
    var s = this._sphere, c = s._c, sp = this._sp;
    var prev = this._m || { rot: 0, ys: 1, irot: 0 };
    var m = { rot: prev.rot, ys: prev.ys, irot: prev.irot };
    function set(k, v) { if (isFinite(v)) m[k] = v; }
    if (this._oType === 1) {
      var opz, so;
      if (this._sys === 0) { opz = this._o.x * c.a6 + this._o.y * c.a7 + this._o.z * c.a8; so = s.WtoSz(this._p_o); }
      else { opz = this._o.x * c.b6 + this._o.y * c.b7 + this._o.z * c.b8; so = s.CtoSz(this._p_o); }
      set("ys", Math.sqrt(Math.max(0, 1 - opz * opz / c.r2)));
      set("rot", Math.atan2(so.y - sp.y, so.x - sp.x) + HALF_PI);
      m.irot = 0;
    } else if (this._oType === 2) {
      var npz, sn, su;
      if (this._sys === 0) {
        npz = (this._n.x * c.a6 + this._n.y * c.a7 + this._n.z * c.a8) / c.r;
        sn = s.WtoSz(this._p_n); su = s.WtoSz(this._p_u);
      } else {
        npz = (this._n.x * c.b6 + this._n.y * c.b7 + this._n.z * c.b8) / c.r;
        sn = s.CtoSz(this._p_n); su = s.CtoSz(this._p_u);
      }
      var A = Math.atan2(sn.y - sp.y, sn.x - sp.x) + HALF_PI;
      var cA = Math.cos(A), sA = Math.sin(A), x0 = su.x - sp.x, y0 = su.y - sp.y;
      var x1 = cA * x0 + sA * y0, y1 = -sA * x0 + cA * y0;
      set("rot", A); set("ys", npz); set("irot", Math.atan2(y1 / npz, x1) + HALF_PI);
    } else { m.rot = 0; m.ys = 1; m.irot = 0; }
    this._m = m;
  };
  // the full local → stage matrix [a, b, c, d, e, f] of the instance
  O.matrix = function () {
    var m = this._m || { rot: 0, ys: 1, irot: 0 }, s = this._sphere;
    var cr = Math.cos(m.rot), sr = Math.sin(m.rot), ci = Math.cos(m.irot), si = Math.sin(m.irot);
    // R(rot) · S(1, ys) · R(irot) · S(xscale, yscale)
    var a1 = cr, b1 = sr, c1 = -sr * m.ys, d1 = cr * m.ys;
    var a2 = a1 * ci + c1 * si, b2 = b1 * ci + d1 * si, c2 = -a1 * si + c1 * ci, d2 = -b1 * si + d1 * ci;
    var kx = this.xscale / 100, ky = this.yscale / 100;
    return [a2 * kx, b2 * kx, c2 * ky, d2 * ky, s.x + this._sp.x, s.y + this._sp.y];
  };
  O.toLocal = function (x, y) {                    // a stage point in the instance's own coordinates
    var t = this.matrix(), det = t[0] * t[3] - t[1] * t[2];
    if (!det) return { x: Infinity, y: Infinity };
    var dx = x - t[4], dy = y - t[5];
    return { x: (t[3] * dx - t[2] * dy) / det, y: (-t[1] * dx + t[0] * dy) / det };
  };
  O.render = function (ctx) {
    if (!this.draw) return;
    var t = this.matrix();
    ctx.save();
    ctx.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
    if (this.alpha !== 100) ctx.globalAlpha *= Math.max(0, this.alpha) / 100;
    this.draw(ctx, this);
    ctx.restore();
  };
  O.getPositionHorizon = function () { return this._sphere.pointToHorizon(this._p); };
  O.getPositionCelestial = function () { return this._sphere.pointToCelestial(this._p); };
  O.remove = function () {
    var list = this._sphere._objectList, i = list.indexOf(this);
    if (i >= 0) list.splice(i, 1);
  };
  Object.defineProperty(O, "screen", { get: function () {
    var s = this._sphere; return { x: s.x + this._sp.x, y: s.y + this._sp.y, z: this._sp.z };
  } });
  Object.defineProperties(O, {
    alt: { get: function () { return this.getPositionHorizon().alt; },
      set: function (v) { var h = this.getPositionHorizon(); h.alt = v; this.setPosition(h); } },
    az: { get: function () { return this.getPositionHorizon().az; },
      set: function (v) { var h = this.getPositionHorizon(); h.az = v; this.setPosition(h); } },
    ra: { get: function () { return this.getPositionCelestial().ra; },
      set: function (v) { var q = this.getPositionCelestial(); q.ra = v; this.setPosition(q); } },
    dec: { get: function () { return this.getPositionCelestial().dec; },
      set: function (v) { var q = this.getPositionCelestial(); q.dec = v; this.setPosition(q); } },
    r: { get: function () { return this._r; },
      set: function (v) {
        var k = v / this._r, p = this._p;
        p.x *= k; p.y *= k; p.z *= k; this._r = v; p.r = v;
        this._p_o = vadd(p, this._o); this._p_n = vadd(p, this._n); this._p_u = vadd(p, this._u);
      } },
    visible: { get: function () { return this._visible; }, set: function (v) { this._visible = Boolean(v); } }
  });

  P.addObject = function (name, draw, position, init) {
    var id = ++this._objectFreeID;
    var obj = new CSObject(this, name, id, draw, position, init);
    this._objectList.push(obj);
    this[name] = obj;
    return obj;
  };
  P.removeObjects = function () {
    this._objectList.forEach(function (o) { if (this[o.name] === o) delete this[o.name]; }, this);
    this._objectList = []; this._objectFreeID = 0;
  };
  // updateObjectsSort / NoSort: which band each object is drawn in, and its screen point
  P._sortObjects2 = function () {
    var bands = { bE: [], bS: [], bI: [], aI: [], fS: [], fE: [] };
    var hU = !this._showUnder, list = this._objectList;
    for (var i = 0; i < list.length; i++) {
      var o = list[i], wp;
      o.shown = false;
      if (!o._visible) continue;
      wp = o._sys === 1 ? this.CtoW(o._p) : o._p;
      if (hU && wp.z < 0) continue;                // (SWF6: hu ≡ hU, so this hides every kind)
      if (o._r < 1) this.WtoSz(wp, o._sp);
      else if (o._sys === 0) this.WtoSz(o._p, o._sp);
      else this.CtoSz(o._p, o._sp);
      o.shown = true;
      if (o._r > 1) (o._sp.z < 0 ? bands.bE : bands.fE).push(o);
      else if (o._r < 1) (wp.z < 0 ? bands.bI : bands.aI).push(o);
      else (o._sp.z < 0 ? bands.bS : bands.fS).push(o);
      o.update();
    }
    if (this._sortObjects) {
      if (!this._showHPlane) { while (bands.aI.length) bands.bI.push(bands.aI.pop()); }
      var byZ = function (a, b) { return a._sp.z - b._sp.z; };
      for (var k in bands) bands[k].sort(byZ);
    }
    return bands;
  };

  /* ================================================================ circles (init96) */
  function CSCircle(sphere, name, depth) {
    this._sphere = sphere;
    this.name = name;
    this.depth = depth;
    this._gS = 0; this._gE = 0;
    this._beta = 0; this._tilt = 0; this._lambda = 0;
    this._sys = 0;
    this._visible = true;
    this._color = 0xff0000; this._thick = 1; this._alpha = 80;
    this.useMouse = false; this.mouseSides = "both";
    this._w = {};
    this.doW();
  }
  var Ci = CSCircle.prototype;
  Ci.setStyle = function (thickness, color, alpha) {
    if (thickness !== undefined) this._thick = thickness;
    if (color !== undefined) this._color = color;
    if (alpha !== undefined) this._alpha = alpha;
  };
  Ci.setParameters = Ci.setCircleParameters = function (arg) {
    // (az ‖ alt) && tilt → horizon; (ra ‖ dec) && tilt → celestial; anything else is ignored
    // (the SWFs add trails and the hour-angle arc as {dec, ra} and set them up later)
    var sys;
    if ((arg.az !== undefined || arg.alt !== undefined) && arg.tilt !== undefined) sys = 0;
    else if ((arg.ra !== undefined || arg.dec !== undefined) && arg.tilt !== undefined) sys = 1;
    else { this.doW(); return; }
    this._sys = sys;
    if (isNum(arg.tilt)) this._tilt = arg.tilt < 0 ? 0 : arg.tilt > 180 ? Math.PI : arg.tilt * RAD;
    var lam = sys === 0 ? arg.alt : arg.dec;
    if (isNum(lam)) this._lambda = lam < -90 ? -Math.PI : lam > 90 ? Math.PI : lam * RAD;
    if (sys === 0 && isNum(arg.az)) this._beta = RAD * mod(-arg.az, 360);
    if (sys === 1 && isNum(arg.ra)) this._beta = H2R * mod(arg.ra, 24);
    if (isNum(arg.gammaStart)) this._gS = RAD * mod(arg.gammaStart, 360);
    if (isNum(arg.gammaEnd)) this._gE = RAD * mod(arg.gammaEnd, 360);
    this.doW();
  };
  Ci.doW = function () {
    var st = Math.sin(this._tilt), ct = Math.cos(this._tilt), sb = Math.sin(this._beta), cb = Math.cos(this._beta);
    var cl = Math.cos(this._lambda), sl = Math.sin(this._lambda), w = this._w;
    w.w0 = cl * cb; w.w1 = -cl * sb * ct; w.w2 = sl * sb * st;
    w.w3 = cl * sb; w.w4 = cl * cb * ct; w.w5 = -sl * cb * st;
    w.w6 = 0; w.w7 = cl * st; w.w8 = sl * ct;
  };
  // the great-circle arc from p1 to p2 (each {alt, az} | {ra, dec} | an object's name)
  Ci.setArcPoints = function (p1, p2) {
    var s = this._sphere, t1, f1, t2, f2, o, cp, hp;
    if (typeof p1 === "string") {
      o = s[p1]; if (!(o instanceof CSObject)) return false;
      this._sys = o._sys;
      if (this._sys === 0) { t1 = (360 - o.az) * RAD; f1 = o.alt * RAD; } else { t1 = o.ra * H2R; f1 = o.dec * RAD; }
    } else if (p1.az !== undefined && p1.alt !== undefined) { this._sys = 0; t1 = (360 - p1.az) * RAD; f1 = p1.alt * RAD; }
    else if (p1.ra !== undefined && p1.dec !== undefined) { this._sys = 1; t1 = p1.ra * H2R; f1 = p1.dec * RAD; }
    else return false;
    if (typeof p2 === "string") {
      o = s[p2]; if (!(o instanceof CSObject)) return false;
      if (this._sys === 0) { t2 = (360 - o.az) * RAD; f2 = o.alt * RAD; } else { t2 = o.ra * H2R; f2 = o.dec * RAD; }
    } else if (p2.az !== undefined && p2.alt !== undefined) {
      if (this._sys === 0) { t2 = (360 - p2.az) * RAD; f2 = p2.alt * RAD; }
      else { cp = s.MHtoC({ alt: p2.alt * RAD, az: (360 - p2.az) * RAD }, {}); t2 = cp.ra; f2 = cp.dec; }
    } else if (p2.ra !== undefined && p2.dec !== undefined) {
      if (this._sys === 0) { hp = s.CtoMH({ dec: p2.dec * RAD, ra: p2.ra * H2R }, {}); t2 = hp.az; f2 = hp.alt; }
      else { t2 = p2.ra * H2R; f2 = p2.dec * RAD; }
    } else return false;
    var cp1 = Math.cos(f1), z1 = Math.sin(f1), x1 = cp1 * Math.cos(t1), y1 = cp1 * Math.sin(t1);
    var cp2 = Math.cos(f2), z2 = Math.sin(f2), x2 = cp2 * Math.cos(t2), y2 = cp2 * Math.sin(t2);
    var ax = y1 * z2 - y2 * z1, ay = x2 * z1 - x1 * z2, az = x1 * y2 - x2 * y1;
    var aN = Math.sqrt(ax * ax + ay * ay + az * az);
    if (aN < 1e-6) {
      if (x1 === x2 && y1 === y2 && z1 === z2) return false;
      this._lambda = 0; this._tilt = HALF_PI; this._beta = Math.atan2(y1, x1);
      this._gS = Math.acos(Math.sqrt(x1 * x1 + y1 * y1));
      if (z1 < 0) this._gS = -this._gS;
      this._gS = mod(this._gS, TAU); this._gE = (this._gS + Math.PI) % TAU;
      this.doW(); return true;
    }
    this._lambda = 0;
    this._tilt = Math.acos(az / aN);
    if (this._tilt === 0) {
      this._beta = 0; this._gS = mod(Math.atan2(y1, x1), TAU); this._gE = mod(Math.atan2(y2, x2), TAU);
    } else if (this._tilt === Math.PI) {
      this._beta = 0; this._gS = mod(Math.atan2(-y1, x1), TAU); this._gE = mod(Math.atan2(-y2, x2), TAU);
    } else {
      this._beta = Math.atan2(ax, -ay);
      var st = Math.sin(this._tilt);
      this._gS = mod(Math.atan2(z1 / st, cp1 * Math.cos(t1 - this._beta)), TAU);
      this._gE = mod(Math.atan2(z2 / st, cp2 * Math.cos(t2 - this._beta)), TAU);
    }
    this.doW();
    return true;
  };
  Object.defineProperties(Ci, {
    gammaStart: { get: function () { return DEG * this._gS; }, set: function (v) { if (isNum(v)) this._gS = RAD * mod(v, 360); } },
    gammaEnd: { get: function () { return DEG * this._gE; }, set: function (v) { if (isNum(v)) this._gE = RAD * mod(v, 360); } },
    tilt: { get: function () { return DEG * this._tilt; },
      set: function (v) { if (isNum(v)) { this._tilt = v < 0 ? 0 : v > 180 ? Math.PI : v * RAD; this.doW(); } } },
    alt: { get: function () { return DEG * this._lambda; }, set: function (v) { if (this._setLambda(v)) this._sys = 0; } },
    dec: { get: function () { return DEG * this._lambda; }, set: function (v) { if (this._setLambda(v)) this._sys = 1; } },
    az: { get: function () { return mod(-DEG * this._beta, 360); },
      set: function (v) { if (isNum(v)) { this._beta = RAD * mod(-v, 360); this.doW(); this._sys = 0; } } },
    ra: { get: function () { return DEG * this._beta / 15; },
      set: function (v) { if (isNum(v)) { this._beta = RAD * mod(15 * v, 360); this.doW(); this._sys = 1; } } },
    visible: { get: function () { return this._visible; }, set: function (v) { this._visible = Boolean(v); } }
  });
  Ci._setLambda = function (v) {
    if (!isNum(v)) return false;
    this._lambda = v < -90 ? -Math.PI : v > 90 ? Math.PI : v * RAD;
    this.doW(); return true;
  };
  Ci.setUseMouseFunctions = function (on, options) {
    this.useMouse = Boolean(on);
    this.mouseSides = options === "front only" ? "front" : options === "back only" ? "back" : "both";
  };
  // the circle's two halves as Path2Ds in sphere-local coordinates (CSCirclesClass.update)
  Ci.paths = function () {
    var s = this._sphere, c = s._c, w = this._w, A, v;
    if (this._sys === 0)
      A = [c.a0, c.a1, 0, c.a3, c.a4, c.a5, c.a6, c.a7, c.a8];
    else
      A = [c.b0, c.b1, c.b2, c.b3, c.b4, c.b5, c.b6, c.b7, c.b8];
    v = [A[0] * w.w0 + A[1] * w.w3, A[0] * w.w1 + A[1] * w.w4 + A[2] * w.w7, A[0] * w.w2 + A[1] * w.w5 + A[2] * w.w8,
         A[3] * w.w0 + A[4] * w.w3, A[3] * w.w1 + A[4] * w.w4 + A[5] * w.w7, A[3] * w.w2 + A[4] * w.w5 + A[5] * w.w8,
         A[6] * w.w0 + A[7] * w.w3, A[6] * w.w1 + A[7] * w.w4 + A[8] * w.w7, A[6] * w.w2 + A[7] * w.w5 + A[8] * w.w8];
    var front = new Path2D(), back = new Path2D();
    function drawArc(g1, g2, path) {
      if (g2 < g1) g2 += TAU;
      var arc = g2 - g1;
      if (arc === 0) arc = TAU;
      var n = Math.ceil(arc / (Math.PI / 4)), step = arc / n, half = step / 2, cR = 1 / Math.cos(half);
      var ax = Math.cos(g1), ay = Math.sin(g1);
      path.moveTo(v[0] * ax + v[1] * ay + v[2], v[3] * ax + v[4] * ay + v[5]);
      for (var i = 0, a = g1 + step, cA = a - half; i < n; i++, a += step, cA += step) {
        ax = Math.cos(a); ay = Math.sin(a);
        var cx = cR * Math.cos(cA), cy = cR * Math.sin(cA);
        path.quadraticCurveTo(v[0] * cx + v[1] * cy + v[2], v[3] * cx + v[4] * cy + v[5],
          v[0] * ax + v[1] * ay + v[2], v[3] * ax + v[4] * ay + v[5]);
      }
    }
    var gS = this._gS, gE = this._gE, Am = Math.sqrt(v[6] * v[6] + v[7] * v[7]);
    if (Am === 0) { drawArc(gS, gE, v[8] < 0 ? back : front); return { front: front, back: back }; }
    var sj = -v[8] / Am;
    if (!(sj > -1)) { drawArc(gS, gE, front); return { front: front, back: back }; }
    if (!(sj < 1)) { drawArc(gS, gE, back); return { front: front, back: back }; }
    var j = Math.asin(sj), t = Math.atan2(v[6], v[7]), gDesc, gAsc;
    if (Math.cos(j) < 0) { gDesc = mod(j - t, TAU); gAsc = mod(Math.PI - j - t, TAU); }
    else { gDesc = mod(Math.PI - j - t, TAU); gAsc = mod(j - t, TAU); }
    if (gS === gE) { drawArc(gAsc, gDesc, front); drawArc(gDesc, gAsc, back); return { front: front, back: back }; }
    var g = [[gAsc, 0], [gDesc, 1], [gS, 2], [gE, 3]];
    g.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
    var draw = false, isFront = true, k;
    function step2(e) { if (e[1] === 0) isFront = true; else if (e[1] === 1) isFront = false; else draw = e[1] === 2; }
    for (k = 0; k < 4; k++) step2(g[k]);
    var prev = g[3];
    for (k = 0; k < 4; k++) {
      var e = g[k];
      if (draw && prev[0] !== e[0]) drawArc(prev[0], e[0], isFront ? front : back);
      step2(e);
      prev = e;
    }
    return { front: front, back: back };
  };
  Ci.remove = function () {
    var list = this._sphere._circleList, i = list.indexOf(this);
    if (i >= 0) list.splice(i, 1);
  };
  // which half of the circle's stroke the stage point is on ('front' | 'back' | null); a half's
  // masked-off stretch takes no mouse, as in Flash
  Ci.hitTest = function (ctx, x, y, slop) {
    if (!this._visible || !this._last) return null;
    var s = this._sphere, sides = this.mouseSides === "both" ? ["front", "back"] : [this.mouseSides];
    var lx = x - s.x, ly = y - s.y, masks = s._showUnder ? MASK_UNDER : MASK_NOUNDER, hit = null;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineWidth = Math.max(1, this._thick) + (slop || 0);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (var i = 0; i < sides.length && !hit; i++) {
      var k = masks[sides[i] === "front" ? "fC" : "bC"];
      if (k === 5 || (k && !ctx.isPointInPath(s._maskPath(k), lx, ly))) continue;
      if (ctx.isPointInStroke(this._last[sides[i]], lx, ly)) hit = sides[i];
    }
    ctx.restore();
    return hit;
  };

  P.addCircle = function (name, style, definition, depth) {
    if (depth === undefined) {
      depth = 0;
      while (this._circleList.some(function (c) { return c.depth === depth; })) depth++;
    }
    var circle = new CSCircle(this, name, depth);
    this._circleList.push(circle);
    this._circleList.sort(function (a, b) { return a.depth - b.depth; });
    if (style && typeof style === "object") circle.setStyle(style.thickness, style.color, style.alpha);
    if (definition && typeof definition === "object") circle.setParameters(definition);
    this[name] = circle;
    return circle;
  };
  P.showCircles = function () { this._circleList.forEach(function (c) { c.visible = true; }); };
  P.hideCircles = function () { this._circleList.forEach(function (c) { c.visible = false; }); };
  P.removeCircles = function () {
    this._circleList.forEach(function (c) { if (this[c.name] === c) delete this[c.name]; }, this);
    this._circleList = [];
  };

  /* ================================================================ lines (init95) */
  function CSLine(sphere, name, depth, style, head, tail) {
    this._sphere = sphere;
    this.name = name;
    this.depth = depth;
    this._thick = 1; this._color = 0x0000ff; this._alpha = 100;
    if (style && typeof style === "object") this.setStyle(style.thickness, style.color, style.alpha);
    this._visible = true;
    this.setPoints(head, tail);
  }
  var L = CSLine.prototype;
  L.setStyle = Ci.setStyle;
  L.setPoints = function (head, tail) { this.setHeadPoint(head); this.setTailPoint(tail); };
  L.setHeadPoint = function (h) { this._head = parsePoint(h); if (this._head.sys === -1) this._head.sys = 0; };
  L.setTailPoint = function (t) { this._tail = parsePoint(t); if (this._tail.sys === -1) this._tail.sys = 0; };
  Object.defineProperty(L, "visible", { get: function () { return this._visible; }, set: function (v) { this._visible = Boolean(v); } });
  L.remove = function () {
    var list = this._sphere._lineList, i = list.indexOf(this);
    if (i >= 0) list.splice(i, 1);
  };
  // the line cut where it enters the sphere and crosses the horizon plane: segments by clip
  L.segments = function () {
    var s = this._sphere, out = { bE: [], fE: [], aI: [], bI: [] };
    if (!this._visible) return out;
    var head, tail;
    if (this._head.sys === 0) head = s.WtoSz(this._head); else if (this._head.sys === 1) head = s.CtoSz(this._head); else return out;
    if (this._tail.sys === 0) tail = s.WtoSz(this._tail); else if (this._tail.sys === 1) tail = s.CtoSz(this._tail); else return out;
    var mx = head.x - tail.x, my = head.y - tail.y, mz = head.z - tail.z;
    var A = mx * mx + my * my + mz * mz, B = 2 * (mx * tail.x + my * tail.y + mz * tail.z);
    var C = tail.x * tail.x + tail.y * tail.y + tail.z * tail.z;
    var rad2 = s._c.r * s._c.r, phi = s._phi, stmp = [], tp, tmp;
    var D = B * B - 4 * A * (C - rad2);
    if (D > 0) {
      var sD = Math.sqrt(D);
      stmp.push((-B + sD) / (2 * A)); stmp.push((-B - sD) / (2 * A));
      if (phi > -HALF_PI && phi < HALF_PI) {
        tp = Math.tan(phi);
        if (my !== tp * mz) stmp.push((tp * tail.z - tail.y) / (my - tp * mz));
      } else if (mz !== 0) {
        tmp = -tail.z / mz;
        if (tmp * (tmp * A + B) + C < rad2) stmp.push(tmp);
      }
    } else if (mz !== 0) stmp.push(-tail.z / mz);
    var sl = [0, 1];
    for (var i = 0; i < stmp.length; i++) {
      var v = stmp[i];
      if (v > 0 && v < 1) {
        var k = 1;
        while (v > sl[k]) k++;
        if (v !== sl[k]) sl.splice(k, 0, v);
      }
    }
    if (tp === undefined) tp = Math.tan(phi);
    var under = s._showUnder;
    for (i = 0; i < sl.length - 1; i++) {
      var s1 = sl[i], s2 = sl[i + 1], m = s1 + (s2 - s1) / 2, r2 = m * (m * A + B) + C, z = m * mz + tail.z, mc;
      var below;                                   // below the horizon plane?
      if (phi === -HALF_PI) below = z > 0;
      else if (phi === HALF_PI) below = !(z > 0);
      else below = (m * my + tail.y) - z * tp > 1e-9;
      if (r2 < rad2) mc = below ? "bI" : "aI";
      else mc = z < 0 ? "bE" : "fE";
      if (!under && below) continue;
      out[mc].push([s1 * mx + tail.x, s1 * my + tail.y, s2 * mx + tail.x, s2 * my + tail.y]);
    }
    return out;
  };
  P.addLine = function (name, style, head, tail, depth) {
    if (depth === undefined) {
      depth = 0;
      while (this._lineList.some(function (c) { return c.depth === depth; })) depth++;
    }
    var line = new CSLine(this, name, depth, style, head, tail);
    this._lineList.push(line);
    this._lineList.sort(function (a, b) { return a.depth - b.depth; });
    this[name] = line;
    return line;
  };
  P.showLines = function () { this._lineList.forEach(function (l) { l.visible = true; }); };
  P.hideLines = function () { this._lineList.forEach(function (l) { l.visible = false; }); };

  /* ================================================================ shaded bands (init103) */
  function CSBand(sphere, name, drawFront, drawBack, params, surface, hemisphere, init) {
    this._sphere = sphere;
    this.name = name;
    this._visible = true;
    this.showBorder = false;
    this._bThick = 0; this._bColor = 0; this._bAlpha = 100;
    this._k = {};
    var key = layerKey("front", surface, hemisphere).slice(1);
    this._front = drawFront ? makeClip(drawFront, name, init) : null;
    this._back = drawBack ? makeClip(drawBack, name, init) : null;
    if (this._front) { this._front.band = this; this._front.side = "front"; sphere._layers["f" + key].push(this._front); }
    if (this._back) { this._back.band = this; this._back.side = "back"; sphere._layers["b" + key].push(this._back); }
    this.setParameters(params);
  }
  var Bd = CSBand.prototype;
  Bd.setBorderStyle = function (t, c, a) {
    if (t !== undefined) this._bThick = t;
    if (c !== undefined) this._bColor = c;
    if (a !== undefined) this._bAlpha = a;
  };
  Object.defineProperty(Bd, "visible", { get: function () { return this._visible; }, set: function (v) { this._visible = Boolean(v); } });
  // the art's own properties (an init object's colours, say) live on the clips
  Bd.set = function (k, v) { if (this._front) this._front[k] = v; if (this._back) this._back[k] = v; };
  Bd.setParameters = function (arg) {
    function lim(v) { return !(v > -90) ? [-HALF_PI, 1] : !(v < 90) ? [HALF_PI, 1] : [v * RAD, 0]; }
    var a, b;
    if (arg && arg.dec1 !== undefined && arg.dec2 !== undefined) {
      this._sys = 1;
      this._beta = arg.ra !== undefined ? H2R * mod(arg.ra, 24) : 0;
      a = lim(arg.dec1); b = lim(arg.dec2);
    } else if (arg && arg.alt1 !== undefined && arg.alt2 !== undefined) {
      this._sys = 0;
      this._beta = arg.az !== undefined ? RAD * mod(-arg.az, 360) : 0;
      a = lim(arg.alt1); b = lim(arg.alt2);
    } else { this._noDef = true; return; }
    this._tilt = arg.tilt === undefined ? 0 : arg.tilt < 0 ? 0 : arg.tilt > 180 ? Math.PI : arg.tilt * RAD;
    this._noDef = false;
    this._lambda1 = a[0]; this._type1 = a[1]; this._lambda2 = b[0]; this._type2 = b[1];
    if (this._lambda1 > this._lambda2) {
      var t = this._lambda2; this._lambda2 = this._lambda1; this._lambda1 = t;
      t = this._type2; this._type2 = this._type1; this._type1 = t;
    }
    var st = Math.sin(this._tilt), ct = Math.cos(this._tilt), sb = Math.sin(this._beta), cb = Math.cos(this._beta), k = this._k;
    k.k0 = cb; k.k1 = -sb * ct; k.k2 = sb * st; k.k3 = sb; k.k4 = cb * ct; k.k5 = -cb * st; k.k6 = 0; k.k7 = st; k.k8 = ct;
  };
  // the band's two masks and borders, in the shading layers' units (radius 100)
  Bd.paths = function () {
    var s = this._sphere, c = s._c, k = this._k, sc = 100 / c.r, A;
    var out = { front: new Path2D(), back: new Path2D(), fBorder: new Path2D(), bBorder: new Path2D() };
    if (!this._visible || this._noDef) return null;
    if (this._sys === 0) A = [c.a0, c.a1, 0, c.a3, c.a4, c.a5, c.a6, c.a7, c.a8];
    else A = [c.b0, c.b1, c.b2, c.b3, c.b4, c.b5, c.b6, c.b7, c.b8];
    var v = [sc * (A[0] * k.k0 + A[1] * k.k3), sc * (A[0] * k.k1 + A[1] * k.k4 + A[2] * k.k7), sc * (A[0] * k.k2 + A[1] * k.k5 + A[2] * k.k8),
             sc * (A[3] * k.k0 + A[4] * k.k3), sc * (A[3] * k.k1 + A[4] * k.k4 + A[5] * k.k7), sc * (A[3] * k.k2 + A[4] * k.k5 + A[5] * k.k8),
             sc * (A[6] * k.k0 + A[7] * k.k3), sc * (A[6] * k.k1 + A[7] * k.k4 + A[8] * k.k7), sc * (A[6] * k.k2 + A[7] * k.k5 + A[8] * k.k8)];
    var minStep = Math.PI / 6;
    var fm = out.front, bm = out.back, fb = out.fBorder, bb = out.bBorder;
    function perimeter(t1, t2, dir, m1, m2) {
      var arc, doMove, n, step;
      arc = dir === 1 ? mod(t2 - t1, TAU) : mod(t1 - t2, TAU);
      doMove = arc === 0; if (doMove) arc = TAU;
      n = Math.ceil(arc / minStep); step = (dir === 1 ? arc : -arc) / n;
      var half = step / 2, cr = 100 / Math.cos(half);
      if (doMove) { m1.moveTo(100 * Math.cos(t1), 100 * Math.sin(t1)); m2.moveTo(100 * Math.cos(t1), 100 * Math.sin(t1)); }
      for (var i = 0, a = t1 + step, cA = a - half; i < n; i++, a += step, cA += step) {
        var ax = 100 * Math.cos(a), ay = 100 * Math.sin(a), cx = cr * Math.cos(cA), cy = cr * Math.sin(cA);
        m1.quadraticCurveTo(cx, cy, ax, ay); m2.quadraticCurveTo(cx, cy, ax, ay);
      }
    }
    function sph(g1, g2, cl, sl, dir, m, bm2) {
      var arc = dir === 1 ? mod(g2 - g1, TAU) : mod(g1 - g2, TAU), doMove = arc === 0;
      if (doMove) arc = TAU;
      var n = Math.ceil(arc / minStep), step = (dir === 1 ? arc : -arc) / n, half = step / 2, cR = 1 / Math.cos(half);
      function px(ix, iy) { return cl * (v[0] * ix + v[1] * iy) + sl * v[2]; }
      function py(ix, iy) { return cl * (v[3] * ix + v[4] * iy) + sl * v[5]; }
      if (doMove) {
        var x0 = px(Math.cos(g1), Math.sin(g1)), y0 = py(Math.cos(g1), Math.sin(g1));
        m.moveTo(x0, y0); bm2.moveTo(x0, y0);
      }
      for (var i = 0, a = g1 + step, cA = a - half; i < n; i++, a += step, cA += step) {
        var ix = Math.cos(a), iy = Math.sin(a), icx = cR * Math.cos(cA), icy = cR * Math.sin(cA);
        var cx = px(icx, icy), cy = py(icx, icy), ax = px(ix, iy), ay = py(ix, iy);
        m.quadraticCurveTo(cx, cy, ax, ay); bm2.quadraticCurveTo(cx, cy, ax, ay);
      }
    }
    var cl1 = Math.cos(this._lambda1), sl1 = Math.sin(this._lambda1), cl2 = Math.cos(this._lambda2), sl2 = Math.sin(this._lambda2);
    var startX = null, startY = null, loc1, loc2, gD1, gA1, tD1, tA1, gD2, gA2, tD2, tA2;
    function cross(cl, sl) {                       // where a circle meets the limb: 0 crosses, 1 front, 2 back
      var Am = cl * Math.sqrt(v[6] * v[6] + v[7] * v[7]);
      if (Am === 0) return { loc: sl * v[8] < 0 ? 2 : 1 };
      var sj = -sl * v[8] / Am;
      if (!(sj > -1)) return { loc: 1 };
      if (!(sj < 1)) return { loc: 2 };
      var j = Math.asin(sj), t = Math.atan2(v[6], v[7]), gD, gA;
      if (Math.cos(j) < 0) { gD = j - t; gA = Math.PI - j - t; } else { gD = Math.PI - j - t; gA = j - t; }
      var xD = cl * (v[0] * Math.cos(gD) + v[1] * Math.sin(gD)) + sl * v[2];
      var yD = cl * (v[3] * Math.cos(gD) + v[4] * Math.sin(gD)) + sl * v[5];
      var xA = cl * (v[0] * Math.cos(gA) + v[1] * Math.sin(gA)) + sl * v[2];
      var yA = cl * (v[3] * Math.cos(gA) + v[4] * Math.sin(gA)) + sl * v[5];
      return { loc: 0, gD: gD, gA: gA, tD: Math.atan2(yD, xD), xA: xA, yA: yA, tA: Math.atan2(yA, xA) };
    }
    var c1 = cross(cl1, sl1), c2 = cross(cl2, sl2);
    loc1 = c1.loc; loc2 = c2.loc;
    if (loc1 === 0) { gD1 = c1.gD; gA1 = c1.gA; tD1 = c1.tD; tA1 = c1.tA; startX = c1.xA; startY = c1.yA; }
    if (loc2 === 0) {
      gD2 = c2.gD; gA2 = c2.gA; tD2 = c2.tD; tA2 = c2.tA;
      if (startX === null) { startX = c2.xA; startY = c2.yA; }
    }
    function start() { fm.moveTo(startX, startY); bm.moveTo(startX, startY); fb.moveTo(startX, startY); bb.moveTo(startX, startY); }
    var t1 = this._type1, t2 = this._type2;
    if (loc1 === 0 && loc2 === 0) {
      start();
      perimeter(tA1, tA2, 1, fm, bm);
      sph(gA2, gD2, cl2, sl2, 1, fm, fb); sph(gA2, gD2, cl2, sl2, -1, bm, bb);
      perimeter(tD2, tD1, 1, fm, bm);
      sph(gD1, gA1, cl1, sl1, -1, fm, fb); sph(gD1, gA1, cl1, sl1, 1, bm, bb);
    } else if (loc1 === 0 && loc2 === 1) {
      start();
      sph(gA1, gD1, cl1, sl1, 1, fm, fb); sph(gA1, gD1, cl1, sl1, -1, bm, bb);
      perimeter(tD1, tA1, -1, fm, bm);
      if (t2 === 0) sph(0, 0, cl2, sl2, -1, fm, fb);
    } else if (loc1 === 0 && loc2 === 2) {
      start();
      sph(gA1, gD1, cl1, sl1, 1, fm, fb); sph(gA1, gD1, cl1, sl1, -1, bm, bb);
      perimeter(tD1, tA1, -1, fm, bm);
      if (t2 === 0) sph(0, 0, cl2, sl2, 1, bm, bb);
    } else if (loc1 === 1 && loc2 === 0) {
      start();
      sph(gA2, gD2, cl2, sl2, 1, fm, fb); sph(gA2, gD2, cl2, sl2, -1, bm, bb);
      perimeter(tD2, tA2, 1, fm, bm);
      if (t1 === 0) sph(0, 0, cl1, sl1, -1, fm, fb);
    } else if (loc1 === 1 && loc2 === 1) {
      if (t1 === 0) sph(0, 0, cl1, sl1, 1, fm, fb);
      if (t2 === 0) sph(0, 0, cl2, sl2, -1, fm, fb);
    } else if (loc1 === 1 && loc2 === 2) {
      if (t1 === 0) sph(0, 0, cl1, sl1, 1, fm, fb);
      if (t2 === 0) sph(0, 0, cl2, sl2, 1, bm, bb);
      perimeter(0, 0, -1, fm, bm);
    } else if (loc1 === 2 && loc2 === 0) {
      start();
      sph(gA2, gD2, cl2, sl2, 1, fm, fb); sph(gA2, gD2, cl2, sl2, -1, bm, bb);
      perimeter(tD2, tA2, 1, fm, bm);
      if (t1 === 0) sph(0, 0, cl1, sl1, 1, bm, bb);
    } else if (loc1 === 2 && loc2 === 1) {
      if (t1 === 0) sph(0, 0, cl1, sl1, 1, bm, bb);
      if (t2 === 0) sph(0, 0, cl2, sl2, 1, fm, fb);
      perimeter(0, 0, 1, fm, bm);
    } else {
      if (t1 === 0) sph(0, 0, cl1, sl1, 1, bm, bb);
      if (t2 === 0) sph(0, 0, cl2, sl2, -1, bm, bb);
    }
    return out;
  };
  P.addShadedBand = function (drawFront, drawBack, name, params, surface, hemisphere, init) {
    var band = new CSBand(this, name, drawFront, drawBack, params, surface, hemisphere, init);
    this._bandList.push(band);
    this[name] = band;
    return band;
  };

  /* ================================================================ drawing */
  function strokeStyle(ctx, thick, color, alpha) {
    ctx.lineWidth = thick > 0 ? thick : 1;          // lineStyle(0) is a hairline
    ctx.strokeStyle = colorCss(color, alpha);
  }
  P._drawShadingLayer = function (ctx, key, bandPaths) {
    var list = this._layers[key];
    if (!list.length) return;
    ctx.save();
    if (!this._applyMask(ctx, key)) { ctx.restore(); return; }
    var k = this._c.r / 100;
    ctx.scale(k, k);
    for (var i = 0; i < list.length; i++) {
      var clip = list[i];
      if (!clip.visible || !clip.draw) continue;
      ctx.save();
      if (clip.alpha !== 100) ctx.globalAlpha *= Math.max(0, clip.alpha) / 100;
      if (clip.band) {
        var bp = bandPaths[clip.band.name + "|" + this._bandList.indexOf(clip.band)];
        if (!bp) { ctx.restore(); continue; }
        ctx.save();
        ctx.clip(clip.side === "front" ? bp.front : bp.back, "evenodd");
        clip.draw(ctx, clip);
        ctx.restore();
        if (clip.band.showBorder) {
          ctx.lineCap = "round"; ctx.lineJoin = "round";
          strokeStyle(ctx, clip.band._bThick / k, clip.band._bColor, clip.band._bAlpha);
          if (!(clip.band._bThick > 0)) ctx.lineWidth = 1 / k;
          ctx.stroke(clip.side === "front" ? bp.fBorder : bp.bBorder);
        }
      } else clip.draw(ctx, clip);
      ctx.restore();
    }
    ctx.restore();
  };
  P._drawPlane = function () {
    return this._phi > 0 ? this._plane.above : this._plane.below;
  };
  P._drawHorizonPlane = function (ctx) {
    if (!this._showHPlane) return;
    var list = this._drawPlane(), r = this._c.r;
    ctx.save();
    ctx.scale(r / 100, r * Math.sin(this._phi) / 100);
    ctx.rotate((180 + this._theta * DEG) * RAD);
    for (var i = 0; i < list.length; i++) {
      var clip = list[i];
      if (!clip.visible || !clip.draw) continue;
      ctx.save();
      if (clip.alpha !== 100) ctx.globalAlpha *= Math.max(0, clip.alpha) / 100;
      clip.draw(ctx, clip);
      ctx.restore();
    }
    ctx.restore();
  };
  P._drawCircles = function (ctx, side, cache) {
    var list = this._circleList;
    if (!list.length) return;
    ctx.save();
    if (!this._applyMask(ctx, side === "front" ? "fC" : "bC")) { ctx.restore(); return; }
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (!c._visible) continue;
      strokeStyle(ctx, c._thick, c._color, c._alpha);
      ctx.stroke(cache[i][side]);
    }
    ctx.restore();
  };
  P._drawLines = function (ctx, which, segs) {
    var list = this._lineList;
    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (var i = 0; i < list.length; i++) {
      var l = list[i], s = segs[i][which];
      if (!s.length) continue;
      strokeStyle(ctx, l._thick, l._color, l._alpha);
      ctx.beginPath();
      for (var j = 0; j < s.length; j++) { ctx.moveTo(s[j][0], s[j][1]); ctx.lineTo(s[j][2], s[j][3]); }
      ctx.stroke();
    }
    ctx.restore();
  };
  // the whole stack, onto ctx in stage coordinates
  P.draw = function (ctx) {
    var self = this, bands = this._sortObjects2();
    var circlePaths = this._circleList.map(function (c) { return c._visible ? (c._last = c.paths()) : null; });
    var lineSegs = this._lineList.map(function (l) { return l.segments(); });
    var bandPaths = {};
    this._bandList.forEach(function (b, i) { var p = b.paths(); if (p) bandPaths[b.name + "|" + i] = p; });
    function objs(list) {
      for (var i = 0; i < list.length; i++) list[i].render(ctx);
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    // objects carry their own stage translation, so draw them from an untranslated context
    function stageObjs(list) { ctx.save(); ctx.translate(-self.x, -self.y); objs(list); ctx.restore(); }
    stageObjs(bands.bE);
    this._drawLines(ctx, "bE", lineSegs);
    this._drawShadingLayer(ctx, "bOSB", bandPaths);
    this._drawShadingLayer(ctx, "bOSA", bandPaths);
    this._drawShadingLayer(ctx, "bOSF", bandPaths);
    this._drawCircles(ctx, "back", circlePaths);
    stageObjs(bands.bS);
    this._drawShadingLayer(ctx, "bISB", bandPaths);
    this._drawShadingLayer(ctx, "bISA", bandPaths);
    this._drawShadingLayer(ctx, "bISF", bandPaths);
    if (this._phi < 0) {                           // seen from below: the plane's two sides swap
      stageObjs(bands.aI);
      this._drawLines(ctx, "aI", lineSegs);
      this._drawHorizonPlane(ctx);
      stageObjs(bands.bI);
      this._drawLines(ctx, "bI", lineSegs);
    } else {
      stageObjs(bands.bI);
      this._drawLines(ctx, "bI", lineSegs);
      this._drawHorizonPlane(ctx);
      stageObjs(bands.aI);
      this._drawLines(ctx, "aI", lineSegs);
    }
    this._drawShadingLayer(ctx, "fISB", bandPaths);
    this._drawShadingLayer(ctx, "fISA", bandPaths);
    this._drawShadingLayer(ctx, "fISF", bandPaths);
    this._drawCircles(ctx, "front", circlePaths);
    stageObjs(bands.fS);
    this._drawShadingLayer(ctx, "fOSB", bandPaths);
    this._drawShadingLayer(ctx, "fOSA", bandPaths);
    this._drawShadingLayer(ctx, "fOSF", bandPaths);
    stageObjs(bands.fE);
    this._drawLines(ctx, "fE", lineSegs);
    ctx.restore();
  };

  /* ================================================================ art */
  // the radial gradient disc every shading layer starts from (CSGradientDiskClass):
  // radius 100, 10 quadratic segments, inner colour at the centre, outer at the rim
  var DISC100 = (function () {
    var p = new Path2D(), n = 10, step = TAU / n, half = step / 2, cr = 100 / Math.cos(half);
    p.moveTo(100 * Math.cos(n * step), -100 * Math.sin(n * step));
    for (var i = 0; i < n; i++) {
      var a = (i + 1) * step, c = a - half;
      p.quadraticCurveTo(cr * Math.cos(c), -cr * Math.sin(c), 100 * Math.cos(a), -100 * Math.sin(a));
    }
    p.closePath();
    return p;
  })();
  function GradientDisk(ctx, clip) {
    var ic = clip.innerColor === undefined ? 0xff0000 : clip.innerColor;
    var ia = clip.innerAlpha === undefined ? 80 : clip.innerAlpha;
    var oc = clip.outerColor === undefined ? 0xff00ff : clip.outerColor;
    var oa = clip.outerAlpha === undefined ? 40 : clip.outerAlpha;
    if (!(ia > 0) && !(oa > 0)) return;
    if (ic === oc && ia === oa) ctx.fillStyle = colorCss(ic, ia);   // one colour: no gradient to paint
    else {
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
      g.addColorStop(0, colorCss(ic, ia)); g.addColorStop(1, colorCss(oc, oa));
      ctx.fillStyle = g;
    }
    ctx.fill(DISC100);
  }

  // shapes in tools/swf-inspect.py's "canvas" form: {layers: [[fills, strokes], …]}
  function compileShape(spec) {
    if (spec._c) return spec._c;
    spec._c = spec.layers.map(function (Lr) {
      return {
        fills: Lr[0].map(function (f) { return { style: f[0], path: new Path2D(f[1]) }; }),
        strokes: Lr[1].map(function (s) { return { w: s[0], style: s[1], path: new Path2D(s[2]) }; })
      };
    });
    return spec._c;
  }
  function paintOf(ctx, st) {
    if (typeof st === "string") return st;
    var m = st.m, grad;                            // m = [sx, r0, r1, sy, tx, ty]
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
  // a stroke narrower than a pixel (the SWFs' 0.05 px "hairlines") still shows one device pixel
  function hairline(ctx) {
    var t = ctx.getTransform(), k = Math.sqrt(Math.abs(t.a * t.d - t.b * t.c));
    return k > 0 ? 1 / k : 1;
  }
  function drawShape(ctx, spec, override) {
    var Ls = compileShape(spec);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (var i = 0; i < Ls.length; i++) {
      var Lr = Ls[i];
      for (var j = 0; j < Lr.fills.length; j++) {
        ctx.fillStyle = override && override.fill ? override.fill : paintOf(ctx, Lr.fills[j].style);
        ctx.fill(Lr.fills[j].path, spec.nz ? "nonzero" : "evenodd");
      }
      for (j = 0; j < Lr.strokes.length; j++) {
        var s = Lr.strokes[j];
        ctx.lineWidth = s.w >= 1 ? s.w : Math.max(s.w, hairline(ctx));
        ctx.strokeStyle = override && override.stroke ? override.stroke : paintOf(ctx, s.style);
        ctx.stroke(s.path);
      }
    }
  }

  var CIRCLE100 = "M70.7 -70.75Q100 -41.45 100 0Q100 41.4 70.7 70.7L64 76.9Q36.8 100 0.05 100Q-32.15 100 " +
    "-57 82.35Q-64.15 77.25 -70.7 70.7Q-100 41.4 -99.95 0Q-100 -41.45 -70.7 -70.75Q-64.15 -77.3 -57 -82.35" +
    "Q-32.15 -100 0.05 -100Q36.8 -100 64 -76.9Q67.45 -74 70.7 -70.75Z";
  var DISC_SHADE = "M100 0Q99.95 41.4 70.7 70.7Q41.4 99.95 0 100Q-41.45 99.95 -70.75 70.7Q-100.05 41.4 -100 0" +
    "Q-100.05 -41.45 -70.75 -70.75Q-41.45 -100.05 0 -100Q41.4 -100.05 70.7 -70.75Q99.95 -41.45 100 0Z";
  var SHAPES = {
    // "Shading Layer A" / "Shading Layer B" (heliacalrisingsim, ce_hc — the same art in both)
    shadingLayerA: { nz: false, layers: [[[[{ t: "r", m: [0.12384, 0, 0, 0.12384, 0, 0], s: [[0, "rgba(133,133,133,0.024)"], [0.4275, "rgba(114,114,114,0.122)"], [1, "rgba(101,101,101,0.322)"]] }, DISC_SHADE]], []]] },
    shadingLayerB: { nz: false, layers: [[[[{ t: "r", m: [0.12384, 0, 0, 0.12384, 0, 0], s: [[0, "rgba(0,0,0,0.302)"], [0.4275, "rgba(0,0,0,0.4)"], [1, "rgba(0,0,0,0.6)"]] }, DISC_SHADE]], []]] },
    // CSAboveHorizonPlane / CSBelowHorizonPlane — the same art in all eleven SWFs
    planeAbove: { nz: false, layers: [[[[{ t: "r", m: [0.123779, 0, 0, 0.123779, 0, 0], s: [[0, "#51c451"], [1, "#3aa53a"]] }, CIRCLE100]], []]] },
    planeBelow: { nz: false, layers: [[[["#006600", CIRCLE100]], []]] },
    // "Stickfigure" (ce_hc, siderealTimeAndHourAngleDemo, sunmotionsoverview, heliacalrisingsim)
    stickfigure: { nz: false, layers: [[[["#ffffff", "M2.3 -28.3Q1.25 -27.3 -0.15 -27.25Q-1.6 -27.3 -2.65 -28.3Q-3.7 -29.35 -3.65 -30.8Q-3.7 -32.3 -2.65 -33.3Q-1.6 -34.35 -0.15 -34.3Q1.25 -34.35 2.3 -33.3Q3.3 -32.3 3.35 -30.8Q3.3 -29.35 2.3 -28.3Z"]],
      [[2, "#000000", "M0.8 -23.05L6.3 -20.4M2.3 -28.3Q1.25 -27.3 -0.15 -27.25Q-1.6 -27.3 -2.65 -28.3Q-3.7 -29.35 -3.65 -30.8Q-3.7 -32.3 -2.65 -33.3Q-1.6 -34.35 -0.15 -34.3Q1.25 -34.35 2.3 -33.3Q3.3 -32.3 3.35 -30.8Q3.3 -29.35 2.3 -28.3M-0.15 -15.35L5.35 0M-5.5 0L-0.25 -15.6L-0.15 -15.35M-0.15 -23.05L-6.3 -20.4"],
       [2, "#000000", "M-0.15 -25.75L-0.15 -23.05L-0.15 -15.35"]]]] },
    // positionsdemonstrator's "Stickfigure" (one stroke run) and its "Stickfigure Shadow"
    stickfigurePositions: { nz: false, layers: [[[["#ffffff", "M-0.15 -27.25Q-1.6 -27.3 -2.65 -28.3Q-3.7 -29.35 -3.65 -30.8Q-3.7 -32.3 -2.65 -33.3Q-1.6 -34.35 -0.15 -34.3Q1.25 -34.35 2.3 -33.3Q3.3 -32.3 3.35 -30.8Q3.3 -29.35 2.3 -28.3Q1.25 -27.3 -0.15 -27.25Z"]],
      [[2, "#000000", "M0.8 -23.05L6.3 -20.4M-0.15 -27.25Q-1.6 -27.3 -2.65 -28.3Q-3.7 -29.35 -3.65 -30.8Q-3.7 -32.3 -2.65 -33.3Q-1.6 -34.35 -0.15 -34.3Q1.25 -34.35 2.3 -33.3Q3.3 -32.3 3.35 -30.8Q3.3 -29.35 2.3 -28.3Q1.25 -27.3 -0.15 -27.25L-0.15 -23.05L-0.2 -15.45L5.35 0M-5.5 0L-0.25 -15.6L-0.2 -15.45M-0.15 -23.05L-6.3 -20.4"]]]] },
    stickfigureShadowPositions: { nz: false, layers: [[[["#333333", "M-0.15 -27.25Q-1.6 -27.3 -2.65 -28.3Q-3.7 -29.35 -3.65 -30.8Q-3.7 -32.3 -2.65 -33.3Q-1.6 -34.35 -0.15 -34.3Q1.25 -34.35 2.3 -33.3Q3.3 -32.3 3.35 -30.8Q3.3 -29.35 2.3 -28.3Q1.25 -27.3 -0.15 -27.25Z"]],
      [[0.05, "#333333", "M-0.15 -27.25Q-1.6 -27.3 -2.65 -28.3Q-3.7 -29.35 -3.65 -30.8Q-3.7 -32.3 -2.65 -33.3Q-1.6 -34.35 -0.15 -34.3Q1.25 -34.35 2.3 -33.3Q3.3 -32.3 3.35 -30.8Q3.3 -29.35 2.3 -28.3Q1.25 -27.3 -0.15 -27.25L-0.15 -23.05L6.3 -20.4M-5.5 0L-0.25 -15.6L-0.2 -15.45L-0.15 -23.05L-6.3 -20.4M-0.2 -15.45L5.35 0"]]]] },
    // altazimuth's "Stickfigure" (a little shorter)
    stickfigureAltaz: { nz: false, layers: [[[["#ffffff", "M-0.15 -25.25Q-1.6 -25.3 -2.65 -26.3Q-3.7 -27.35 -3.65 -28.8Q-3.7 -30.3 -2.65 -31.3Q-1.6 -32.35 -0.15 -32.3Q1.25 -32.35 2.3 -31.3Q3.3 -30.3 3.35 -28.8Q3.3 -27.35 2.3 -26.3Q1.25 -25.3 -0.15 -25.25Z"]],
      [[2, "#000000", "M-0.15 -25.25Q-1.6 -25.3 -2.65 -26.3Q-3.7 -27.35 -3.65 -28.8Q-3.7 -30.3 -2.65 -31.3Q-1.6 -32.35 -0.15 -32.3Q1.25 -32.35 2.3 -31.3Q3.3 -30.3 3.35 -28.8Q3.3 -27.35 2.3 -26.3Q1.25 -25.3 -0.15 -25.25L-0.15 -21.05L6.15 -18.4M-4.8 0L-0.25 -13.6L-0.15 -13.35L-0.15 -21.05L-6.3 -18.4M-0.15 -13.35L4.65 0"]]]] },
    // sunmotions' "Stickfigure" and "Stickfigure Shadow"
    stickfigureSunmotions: { nz: false, layers: [[[["#ffffff", "M3.25 -40.55Q1.8 -39.05 -0.25 -39.05Q-2.35 -39.05 -3.8 -40.55Q-5.25 -42.05 -5.25 -44.1Q-5.25 -46.2 -3.8 -47.65Q-2.35 -49.15 -0.25 -49.1Q1.8 -49.15 3.25 -47.65Q4.75 -46.2 4.75 -44.1Q4.75 -42.05 3.25 -40.55Z"]],
      [[2, "#000000", "M1.15 -33L9 -29.25M3.25 -40.55Q1.8 -39.05 -0.25 -39.05Q-2.35 -39.05 -3.8 -40.55Q-5.25 -42.05 -5.25 -44.1Q-5.25 -46.2 -3.8 -47.65Q-2.35 -49.15 -0.25 -49.1Q1.8 -49.15 3.25 -47.65Q4.75 -46.2 4.75 -44.1Q4.75 -42.05 3.25 -40.55M-0.25 -33L-9 -29.25M-0.25 -22L7.65 -0.05M-7.85 -0.05L-0.35 -22.35L-0.25 -22"],
       [2, "#000000", "M-0.25 -36.85L-0.25 -33L-0.25 -22"]]]] },
    stickfigureShadowSunmotions: { nz: false, layers: [[[["#333333", "M-0.25 -39.05Q-2.35 -39.05 -3.8 -40.55Q-5.25 -42.05 -5.25 -44.1Q-5.25 -46.2 -3.8 -47.65Q-2.35 -49.15 -0.25 -49.1Q1.8 -49.15 3.25 -47.65Q4.75 -46.2 4.75 -44.1Q4.75 -42.05 3.25 -40.55Q1.8 -39.05 -0.25 -39.05Z"]],
      [[0.05, "#333333", "M1.15 -33L9 -29.25M-0.25 -39.05Q-2.35 -39.05 -3.8 -40.55Q-5.25 -42.05 -5.25 -44.1Q-5.25 -46.2 -3.8 -47.65Q-2.35 -49.15 -0.25 -49.1Q1.8 -49.15 3.25 -47.65Q4.75 -46.2 4.75 -44.1Q4.75 -42.05 3.25 -40.55Q1.8 -39.05 -0.25 -39.05L-0.25 -33L-0.3 -22.15L7.65 -0.05M-0.25 -39.8L-0.25 -39.05M-0.25 -33L-9 -29.25M-7.85 -0.05L-0.35 -22.35L-0.3 -22.15"]]]] },
    // sunpaths' "Stickman" and "StickmanShadow"
    stickmanSunpaths: { nz: false, layers: [[[["#cccccc", "M3.65 -31.95Q3.65 -30.45 2.5 -29.35Q1.4 -28.3 -0.2 -28.3Q-1.8 -28.3 -2.9 -29.35Q-4.05 -30.45 -4.05 -31.95Q-4.05 -33.5 -2.9 -34.55Q-1.8 -35.6 -0.2 -35.6Q1.4 -35.6 2.5 -34.55Q3.65 -33.5 3.65 -31.95Z"]],
      [[3, "#333333", "M3.65 -31.95Q3.65 -30.45 2.5 -29.35Q1.4 -28.3 -0.2 -28.3Q-1.8 -28.3 -2.9 -29.35Q-4.05 -30.45 -4.05 -31.95Q-4.05 -33.5 -2.9 -34.55Q-1.8 -35.6 -0.2 -35.6Q1.4 -35.6 2.5 -34.55Q3.65 -33.5 3.65 -31.95"], [3, "#333333", "M-0.2 -26.7L-0.2 -24.75"]]],
      [[], [[3, "#333333", "M0.9 -23.85L6.95 -21.15M-0.2 -23.85L-6.95 -21.15M-6.05 0L-0.25 -16.15L-0.2 -15.9L5.85 0"], [3, "#333333", "M-0.2 -15.9L-0.2 -23.85L-0.2 -24.75"]]]] },
    stickmanShadowSunpaths: { nz: false, layers: [[[["#666666", "M-0.2 -28.3Q-1.8 -28.3 -2.9 -29.35Q-4.05 -30.45 -4.05 -31.95Q-4.05 -33.5 -2.9 -34.55Q-1.8 -35.6 -0.2 -35.6Q1.4 -35.6 2.5 -34.55Q3.65 -33.5 3.65 -31.95Q3.65 -30.45 2.5 -29.35Q1.4 -28.3 -0.2 -28.3Z"]],
      [[2, "#666666", "M-0.2 -28.3Q-1.8 -28.3 -2.9 -29.35Q-4.05 -30.45 -4.05 -31.95Q-4.05 -33.5 -2.9 -34.55Q-1.8 -35.6 -0.2 -35.6Q1.4 -35.6 2.5 -34.55Q3.65 -33.5 3.65 -31.95Q3.65 -30.45 2.5 -29.35Q1.4 -28.3 -0.2 -28.3L-0.2 -23.85L-0.25 -16.05L-0.2 -15.9L5.85 0M0.9 -23.85L6.95 -21.15M-0.2 -28.8L-0.2 -28.3M-0.2 -23.85L-6.95 -21.15M-6.05 0L-0.25 -16.15L-0.25 -16.05"]]]] },
    // the small "Stickman" (lunarapplet, sunmotionsoverview)
    stickmanSmall: { nz: false, layers: [[[["#ffffff", "M1.3 -16.2Q0.7 -15.65 -0.1 -15.6Q-0.95 -15.65 -1.5 -16.2Q-2.1 -16.8 -2.1 -17.65Q-2.1 -18.5 -1.5 -19.05Q-0.95 -19.65 -0.1 -19.65Q0.7 -19.65 1.3 -19.05Q1.9 -18.5 1.9 -17.65Q1.9 -16.8 1.3 -16.2Z"]],
      [[2, "#333333", "M1.3 -16.2Q0.7 -15.65 -0.1 -15.6Q-0.95 -15.65 -1.5 -16.2Q-2.1 -16.8 -2.1 -17.65Q-2.1 -18.5 -1.5 -19.05Q-0.95 -19.65 -0.1 -19.65Q0.7 -19.65 1.3 -19.05Q1.9 -18.5 1.9 -17.65Q1.9 -16.8 1.3 -16.2M0.45 -13.2L3.6 -11.7M-0.1 -13.2L-3.6 -11.7M-0.1 -8.8L3.05 0M-3.15 0L-0.15 -8.95L-0.1 -8.8"],
       [2, "#333333", "M-0.1 -14.75L-0.1 -13.2L-0.1 -8.8"]]]] },
    // transitmovie's "Stickman" and "StickmanShadow"
    stickmanTransit: { nz: false, layers: [[[["#ffffff", "M0 -26.55Q-1.5 -26.6 -2.5 -27.6Q-3.55 -28.6 -3.5 -30.05Q-3.55 -31.55 -2.5 -32.55Q-1.5 -33.6 0 -33.55Q1.45 -33.6 2.45 -32.55Q3.45 -31.55 3.5 -30.05Q3.45 -28.6 2.45 -27.6Q1.45 -26.6 0 -26.55Z"]],
      [[2, "#000000", "M6.15 -19.75L0 -24.1L0 -15.4L5 0M0 -26.55L0 -24.1L-6.15 -19.75M0 -26.55Q-1.5 -26.6 -2.5 -27.6Q-3.55 -28.6 -3.5 -30.05Q-3.55 -31.55 -2.5 -32.55Q-1.5 -33.6 0 -33.55Q1.45 -33.6 2.45 -32.55Q3.45 -31.55 3.5 -30.05Q3.45 -28.6 2.45 -27.6Q1.45 -26.6 0 -26.55M0 -15.4L-4.95 0"]]]] },
    stickmanShadowTransit: { nz: false, layers: [[[["#000000", "M0 -26.55Q-1.5 -26.6 -2.5 -27.6Q-3.55 -28.6 -3.5 -30.05Q-3.55 -31.55 -2.5 -32.55Q-1.5 -33.6 0 -33.55Q1.45 -33.6 2.45 -32.55Q3.45 -31.55 3.5 -30.05Q3.45 -28.6 2.45 -27.6Q1.45 -26.6 0 -26.55Z"]],
      [[0.05, "#000000", "M6.15 -19.75L0 -24.1L0 -15.4L5 0M0 -26.55L0 -24.1L-6.15 -19.75M0 -26.55Q-1.5 -26.6 -2.5 -27.6Q-3.55 -28.6 -3.5 -30.05Q-3.55 -31.55 -2.5 -32.55Q-1.5 -33.6 0 -33.55Q1.45 -33.6 2.45 -32.55Q3.45 -31.55 3.5 -30.05Q3.45 -28.6 2.45 -27.6Q1.45 -26.6 0 -26.55M0 -15.4L-4.95 0"]]]] }
  };
  function shapeDrawer(name) { return function (ctx) { drawShape(ctx, SHAPES[name]); }; }

  /* ShadowMaker: the figure laid in the horizon plane away from a light at {alt, az},
     built from the SWF's own nested rotate/scale clips (ShadowMakerClass.setSourcePosition).
     Returns null when the light is too low, else {m: [a, b, c, d], alpha} — the
     shadow's matrix in the object's own frame and its alpha (0–100). */
  function shadowMatrix(pos, lengthLimit) {
    lengthLimit = lengthLimit || 15;
    if (pos.alt < 0.1) return null;
    var alpha = 100 - 100 / (lengthLimit * Math.tan(pos.alt * RAD));
    if (!(alpha > 0)) return null;
    var xskew = pos.az - 180, yskew = 0;
    var baseY = 100 * Math.sin((pos.az - 90) * RAD) / Math.tan(RAD * pos.alt);
    var xr = xskew * RAD, yr = yskew * RAD, cosxr = Math.cos(xr), cosyr = Math.cos(yr);
    var oRot = 45 + (xskew + yskew) / 2;
    var k = Math.sin(oRot * RAD) * 0.707106781186547;
    if (!k) k = 1e-7;
    var oxs = (Math.sin(yr) + cosxr) / k, oys = (Math.sin(xr) + cosyr) / k;
    var ixs = 0.5 / cosyr, iys = baseY / 100 * 0.5 / cosxr;
    function rs(rotDeg, xs, ys) {                  // a clip's R(rot)·S(xs, ys)
      var c = Math.cos(rotDeg * RAD), s = Math.sin(rotDeg * RAD);
      return [c * xs, s * xs, -s * ys, c * ys];
    }
    function mul(A, B) {
      return [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3]];
    }
    return { m: mul(rs(oRot, oxs, oys), rs(-45, ixs, iys)), alpha: Math.min(100, alpha) };
  }

  /* "Direction Labels Light" — four bold 12 px Verdana letters on the plane, in the
     plane's units (N up). Text comes from labels(): {N, S, E, W} (localised). The
     positions are the static texts' centres in the SWFs. */
  var DIR_LABELS = { N: [-0.075, -80.3], S: [-0.075, 88.7], E: [83.25, 4.75], W: [-83.025, 4.75] };
  // "White Direction Labels" (heliacalrisingsim) — bold 16 px; fullmoondec's copy sits 0.05, 0.1 px further
  var DIR_LABELS_16 = { N: [-0.075, -73.95], S: [-0.075, 86.05], E: [81.925, 6.25], W: [-77.075, 6.25] };
  function directionLabels(labels, opts) {
    opts = opts || {};
    var pos = opts.pos || DIR_LABELS, size = opts.size || 12, color = opts.color || "#ffffff";
    var font = (opts.bold === false ? "" : "bold ") + size + "px " + (opts.font || "Verdana, Geneva, sans-serif");
    return function (ctx) {
      var t = typeof labels === "function" ? labels() : labels;
      ctx.fillStyle = color; ctx.font = font;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ["N", "S", "E", "W"].forEach(function (k) {
        var p = pos[k];
        if (window.FlashText) FlashText.fillStatic(ctx, t[k], p[0], p[1], "center");
        else ctx.fillText(t[k], p[0], p[1]);
      });
    };
  }

  /* the star (Draggable Star / Star / AzAlt Draggable Star — one drawing in every SWF):
     a grey outline (shape 203), black on roll-over (205), under the two-tone fill (204) */
  var STAR_EDGE = "M3.7 -2.55L10.45 -2.8L5.1 1.4L7.6 3.2L4.55 3.2L6.85 9.65L1.05 5.7L0.05 8.7L-0.85 6.05L-6.05 10.1" +
    "L-4.1 3.2L-7.55 3.2L-5.15 1.5L-10.45 -2.05L-3.5 -2.3L-4.6 -5.7L-2.1 -3.85L-0.25 -10.05L2 -3.7L4.7 -5.7L3.7 -2.55";
  SHAPES.starFill = { nz: false, layers: [[[[{ t: "r", m: [0.014236, 0, 0, 0.014191, 0.05, 0.2], s: [[0, "#ffffff"], [1, "#e4e466"]] },
    "M10.45 -2.8L4.15 2.15L6.85 9.65L0.25 5.15L-6.05 10.1L-3.85 2.4L-10.45 -2.05L-2.5 -2.35L-0.25 -10.05L2.45 -2.5L10.45 -2.8Z"]], []],
    [[[{ t: "r", m: [0.010437, 0, 0, 0.010483, 0.05, 1.55], s: [[0, "#ffffff"], [1, "#f5f5c2"]] },
    "M4.7 -5.7L2.95 -0.15L7.6 3.2L1.85 3.2L0.05 8.7L-1.75 3.2L-7.55 3.2L-2.8 -0.15L-4.6 -5.7L0.05 -2.25L4.7 -5.7Z"]], []]] };
  SHAPES.starEdge = { nz: false, layers: [[[], [[1, "#999999", STAR_EDGE]]]] };
  SHAPES.starEdgeHot = { nz: false, layers: [[[], [[1, "#000000", "M4.7 -5.7L3.7 -2.55L10.45 -2.8L5.1 1.4L7.6 3.2" +
    "L4.55 3.2L6.85 9.65L1.05 5.7L0.05 8.7L-0.85 6.05L-6.05 10.1L-4.1 3.2L-7.55 3.2L-5.15 1.5L-10.45 -2.05L-3.5 -2.3" +
    "L-4.6 -5.7L-2.1 -3.85L-0.25 -10.05L2 -3.7L4.7 -5.7"]]]] };
  function star(ctx, hot) {
    drawShape(ctx, hot ? SHAPES.starEdgeHot : SHAPES.starEdge);
    drawShape(ctx, SHAPES.starFill);
  }

  /* "CS Label" / "DCS Label": a Verdana bold 14 field, centred, tinted with labelColor
     (Color.setRGB), its text in o.labelText */
  function csLabel(ctx, o) {
    if (o.labelText === undefined || o.labelText === null || o.labelText === "") return;
    ctx.fillStyle = colorCss(o.labelColor === undefined ? 0xffffff : o.labelColor);
    ctx.font = "bold 14px Verdana, Geneva, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    var y = -8.55 + 1.0059 * 14;                   // field top (−8.55) + Verdana's ascent
    if (window.FlashText) FlashText.fill(ctx, String(o.labelText), -0.025, y, "center");
    else ctx.fillText(String(o.labelText), -0.025, y);
  }

  var ART = {
    star: star,
    csLabel: csLabel,
    planeAbove: shapeDrawer("planeAbove"),
    planeBelow: shapeDrawer("planeBelow"),
    stickfigure: shapeDrawer("stickfigure"),
    stickfigurePositions: shapeDrawer("stickfigurePositions"),
    stickfigureAltaz: shapeDrawer("stickfigureAltaz"),
    stickfigureSunmotions: shapeDrawer("stickfigureSunmotions"),
    stickmanSunpaths: shapeDrawer("stickmanSunpaths"),
    stickmanShadowSunpaths: shapeDrawer("stickmanShadowSunpaths"),
    stickmanSmall: shapeDrawer("stickmanSmall"),
    stickmanTransit: shapeDrawer("stickmanTransit"),
    shadingLayerA: shapeDrawer("shadingLayerA"),
    shadingLayerB: shapeDrawer("shadingLayerB"),
    shapes: SHAPES
  };

  /* fade a whole clip at once, as Ruffle composites a faded clip (overlaps don't darken twice):
     draw() runs on an offscreen copy of ctx's current transform and the result lands at alpha
     0–100. bounds = [x, y, w, h] in ctx's current units limits the work to that box (in device
     pixels); without it the whole canvas is used. draw() gets a fresh state every call (its clips
     and transforms are undone afterwards: kept, they piled up frame after frame and slowed every
     later call down). */
  var groupCanvas = null, groupCtx = null;
  function groupAlpha(ctx, alpha, draw, bounds) {
    if (!(alpha > 0)) return;
    if (alpha >= 100) { ctx.save(); try { draw(ctx); } finally { ctx.restore(); } return; }
    var cv = ctx.canvas, T = ctx.getTransform(), x0 = 0, y0 = 0, x1 = cv.width, y1 = cv.height;
    if (bounds) {
      var bx = bounds[0], by = bounds[1], bw = bounds[2], bh = bounds[3], mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
      [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].forEach(function (q) {
        var X = T.a * q[0] + T.c * q[1] + T.e, Y = T.b * q[0] + T.d * q[1] + T.f;
        if (X < mnx) mnx = X; if (X > mxx) mxx = X; if (Y < mny) mny = Y; if (Y > mxy) mxy = Y;
      });
      x0 = Math.max(0, Math.floor(mnx) - 2); y0 = Math.max(0, Math.floor(mny) - 2);
      x1 = Math.min(cv.width, Math.ceil(mxx) + 2); y1 = Math.min(cv.height, Math.ceil(mxy) + 2);
      if (!(x1 > x0 && y1 > y0)) return;
    }
    var w = x1 - x0, h = y1 - y0;
    if (!groupCanvas) groupCanvas = document.createElement("canvas");
    if (groupCanvas.width < w || groupCanvas.height < h) {          // grows only: no reallocation per frame
      groupCanvas.width = Math.max(groupCanvas.width, w); groupCanvas.height = Math.max(groupCanvas.height, h);
      groupCtx = null;
    }
    var g = groupCtx || (groupCtx = groupCanvas.getContext("2d"));
    g.save();
    try {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, w, h);
      g.setTransform(T.a, T.b, T.c, T.d, T.e - x0, T.f - y0);
      draw(g);
    } finally { g.restore(); }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha *= alpha / 100;
    ctx.drawImage(groupCanvas, 0, 0, w, h, x0, y0, w, h);
    ctx.restore();
  }
  // a canvas-spec shape's bounding box [x, y, w, h] (its path points, strokes included)
  function shapeBounds(spec) {
    if (spec._b) return spec._b;
    var mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity, pad = 0;
    spec.layers.forEach(function (Lr) {
      Lr[0].forEach(function (f) { scan(f[1], 0); });
      Lr[1].forEach(function (st) { scan(st[2], st[0] / 2); });
    });
    function scan(d, half) {
      var n = d.match(/-?\d*\.?\d+(?:e-?\d+)?/g) || [];
      for (var i = 0; i + 1 < n.length; i += 2) {
        var x = +n[i], y = +n[i + 1];
        if (x < mnx) mnx = x; if (x > mxx) mxx = x; if (y < mny) mny = y; if (y > mxy) mxy = y;
      }
      if (half > pad) pad = half;
    }
    pad += 1;                                        // (hairlines and anti-aliasing)
    return (spec._b = [mnx - pad, mny - pad, mxx - mnx + 2 * pad, mxy - mny + 2 * pad]);
  }
  // where a ShadowMaker's shape lands: its bounds through the shadow matrix, cut to a mask of radius r
  function shadowBounds(sm, spec, r) {
    var b = shapeBounds(spec), m = sm.m, mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
    [[b[0], b[1]], [b[0] + b[2], b[1]], [b[0], b[1] + b[3]], [b[0] + b[2], b[1] + b[3]]].forEach(function (q) {
      var X = m[0] * q[0] + m[2] * q[1], Y = m[1] * q[0] + m[3] * q[1];
      if (X < mnx) mnx = X; if (X > mxx) mxx = X; if (Y < mny) mny = Y; if (Y > mxy) mxy = Y;
    });
    if (r) { mnx = Math.max(mnx, -r); mny = Math.max(mny, -r); mxx = Math.min(mxx, r); mxy = Math.min(mxy, r); }
    return [mnx, mny, Math.max(0, mxx - mnx), Math.max(0, mxy - mny)];
  }

  Sphere.art = ART;
  Sphere.groupAlpha = groupAlpha;
  Sphere.shapeBounds = shapeBounds;
  Sphere.shadowBounds = shadowBounds;
  Sphere.GradientDisk = GradientDisk;
  Sphere.drawShape = drawShape;
  Sphere.shadowMatrix = shadowMatrix;
  Sphere.directionLabels = directionLabels;
  Sphere.DIR_LABELS = DIR_LABELS;
  Sphere.DIR_LABELS_16 = DIR_LABELS_16;
  Sphere.shapeDrawer = function (spec) { return function (ctx) { drawShape(ctx, spec); }; };
  Sphere.colorCss = colorCss;
  Sphere.parsePoint = parsePoint;
  Sphere.mod = mod;
  // a pointer event → the canvas's own (logical) coordinates
  Sphere.canvasPoint = function (canvas, ev, W, H) {
    var r = canvas.getBoundingClientRect();
    return { x: (ev.clientX - r.left) * (W / r.width), y: (ev.clientY - r.top) * (H / r.height) };
  };
  return Sphere;
})();
