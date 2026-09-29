/* The Variable Star Photometry lab's one night of data -----------------------------
   NAAP's blinkComparatorSimulator and variableStarPhotometryAnalyzer both load
   the same settings.xml (they sit side by side in naap/vsp/animations): a 400 x 300
   frame at noise mean 2300 / sigma 330, saturation magnitude 3, an Airy disc of
   radius 5, twenty-six stars and 113 observations, each an epoch in days and the
   noise seed that makes its frame reproducible. Both sims read it from here.

   The variable stars are the SWFs' own prototypes (swf-abc.py on either SWF):
   a PulsatingStar is a Fourier sum, m = centre + Σ A_k cos((k+1)θ + φ_k) with
   θ = 2π·epoch / period; the EclipsingBinary is two uniform discs on a Kepler
   orbit whose light is weighted by each star's visual surface brightness,
   σT⁴·10^(BC/2.5) with the SWF's own bolometric-correction fit, and whose
   period follows from Kepler's third law — 1.42503 d for TW Cas.             */
(function () {
  "use strict";
  var TAU = Math.PI * 2;

  var FIELD = { width: 400, height: 300, noiseMean: 2300, noiseSigma: 330,
    saturationMagnitude: 3, psfRadius: 5 };

  /* k: c constant, p pulsating, e eclipsing binary; m is the magnitude, the
     centre magnitude or the peak magnitude respectively                       */
  var STARS = [
    {k:"c",m:3.95,x:29,y:42}, {k:"e",m:3.2,x:331,y:22,p:"TW_Cas"}, {k:"p",m:4.2,x:64,y:113,p:"MT_Tel"},
    {k:"p",m:4.5,x:308,y:175,p:"del_Cep"}, {k:"p",m:4,x:124,y:259,p:"PZ_Aql"}, {k:"c",m:4.46,x:43,y:26},
    {k:"c",m:4.23,x:29,y:157}, {k:"c",m:4.73,x:129,y:105}, {k:"c",m:3.2,x:111,y:54},
    {k:"c",m:4.26,x:213,y:220}, {k:"c",m:4.89,x:57,y:192}, {k:"c",m:4.78,x:239,y:252},
    {k:"c",m:5.1,x:323,y:84}, {k:"c",m:3.77,x:296,y:243}, {k:"c",m:4.85,x:246,y:82},
    {k:"c",m:4.02,x:121,y:26}, {k:"c",m:4.89,x:62,y:255}, {k:"c",m:4.15,x:169,y:204},
    {k:"c",m:5.87,x:259,y:147}, {k:"c",m:4.57,x:287,y:41}, {k:"c",m:3.89,x:359,y:129},
    {k:"c",m:3.42,x:113,y:186}, {k:"c",m:5.02,x:343,y:272}, {k:"c",m:6.2,x:341,y:215},
    {k:"c",m:3.89,x:169,y:52}, {k:"p",m:3.7,x:131,y:201,p:"RR_Leo"}
  ];

  /* [epoch, noise seed] */
  var OBS = [
    [1.7215,1256978718], [1.7422,1785390230], [1.7691,1382680561], [1.8123,1742185764],
    [1.8526,710265087], [1.9156,1066486183], [1.9812,1058998707], [2.7147,51459824],
    [2.768,1972335412], [2.8578,1343915649], [2.9237,439876688], [3.7344,782899726],
    [3.7833,1806118830], [3.8127,863406004], [3.8765,1134287060], [3.9185,2014380068],
    [3.9687,260793590], [3.9901,560787509], [4.701,2039223079], [4.712,1383056705],
    [4.758,334011648], [4.8253,650444998], [4.8678,1533482619], [4.9125,947130937],
    [4.9758,466707171], [5.7012,1102868459], [5.768,1700291428], [5.8125,1225051256],
    [5.8735,422685015], [5.9858,947825811], [5.9564,1130423571], [7.7788,378344826],
    [7.826,334337871], [7.9145,97763772], [7.9845,2019259761], [8.7025,563134417],
    [8.7525,1058706842], [8.7845,1861643419], [8.8125,1959485046], [8.8226,2128826760],
    [8.8514,338299181], [8.8847,391630794], [8.9051,478658298], [8.92456,974094161],
    [8.946,1518012349], [8.987,977973922], [8.992,1345149825], [9.8453,1226434322],
    [9.9458,699621619], [10.8245,461278720], [10.8874,298765266], [10.9256,1772726031],
    [10.9785,160593917], [11.73,1691674262], [11.7468,44305564], [11.7746,1893314026],
    [11.7945,139024690], [11.8246,218340389], [11.869,1456980283], [11.9145,169069842],
    [11.9877,1299197317], [12.856,626914566], [12.9147,813106012], [12.9682,1735412833],
    [14.87,342551949], [14.95,406023499], [15.7234,2045040691], [15.7481,1006521879],
    [15.7896,790956861], [15.8465,179188123], [15.8879,1829230385], [15.9236,968013572],
    [15.9478,1252509015], [15.9689,537516409], [15.9868,1373484650], [15.9978,1552091327],
    [16.7246,1979619431], [16.7896,233906902], [16.8355,144395622], [16.8798,1432660673],
    [16.9024,774857072], [16.9387,1340574206], [16.9789,8901314], [17.7365,1556295523],
    [17.8135,594204072], [17.9022,1579063958], [17.9847,1226140192], [18.7149,699600884],
    [18.7458,207512030], [18.8125,274329189], [18.8566,150394260], [18.885,952547410],
    [18.9021,761675836], [18.9285,1383633344], [18.9624,604471612], [19.812,1552913782],
    [19.874,927649061], [19.9452,142240048], [19.9987,781575733], [20.7124,236368276],
    [20.7587,243326267], [20.8435,83280748], [20.9025,354767634], [20.9902,528950464],
    [21.732,1790701462], [21.7546,2131261980], [21.7896,1385672575], [21.8125,924250012],
    [21.827,1080889661], [21.8799,1736180932], [21.9125,1964361350], [21.9364,1554201757],
    [21.9987,815966561]
  ];

  /* PulsatingStar.PRESETS, the entries settings.xml names (all cosine series) */
  var PULSE = {
    del_Cep: { period: 5.366341, terms: [[0.3496, 2.491], [0.1385, 3.084],
      [0.05499, 3.811], [0.02277, 4.083], [0.009765, 4.709]] },
    PZ_Aql: { period: 8.7513, terms: [[0.365, 4.66], [0.0459, 1.75],
      [0.0208, 2.76], [0.0188, 5.98]] },
    MT_Tel: { period: 0.316897, terms: [[0.26, 1.93], [0.0735, 1.89], [0.0166, 1.85],
      [0.01, 1.95], [0.0056, 1.35], [0.00489, 1.48], [0.00453, 1.62], [0.00151, 1.11]] },
    RR_Leo: { period: 0.4523933, terms: [[0.455, 0.691], [0.228, 5.16], [0.161, 3.69],
      [0.0991, 2.33], [0.0779, 1.02], [0.0491, 5.81], [0.0327, 4.45], [0.0314, 2.97]] }
  };

  /* EclipsingBinary.PRESETS.TW_Cas and the class's own constants */
  var BINARY = { TW_Cas: { argument: 0, inclination: 74.7, eccentricity: 0, separation: 8.17,
    mass1: 2.5, radius1: 2, temperature1: 10500, mass2: 1.1, radius2: 2.6, temperature2: 5400 } };
  var SOLAR_MASS = 1.98892e30, SOLAR_RADIUS = 695500000, G = 6.673e-11;

  /* EclipsingBinary.getBolometricCorrection: a quintic in log T, three ranges */
  function bolometricCorrection(T) {
    var L = Math.log(T) / Math.LN10, c;
    if (L > 3.9) c = [-100139.4991, 116264.1842, -53931.97541, 12495.04227, -1445.868048, 66.84924471];
    else if (L < 3.7) c = [-13884.14899, 8595.127427, -488.3425525, -627.0092238, 137.4608131, -7.549572042];
    else c = [1439.981506, -151.9002581, -995.1089203, 582.5176671, -123.3293641, 9.160761128];
    return c[0] + L * (c[1] + L * (c[2] + L * (c[3] + L * (c[4] + c[5] * L))));
  }

  /* EclipsingBinary.calculateConstants + get magnitude, ported */
  var binaries = {};
  function binary(name) {
    if (binaries[name]) return binaries[name];
    var p = BINARY[name];
    var e = p.eccentricity, arg = p.argument * Math.PI / 180, inc = p.inclination * Math.PI / 180;
    var sep = p.separation * SOLAR_RADIUS, r1 = p.radius1 * SOLAR_RADIUS, r2 = p.radius2 * SOLAR_RADIUS;
    var C1 = Math.sqrt((1 + e) / (1 - e)), ci = Math.cos(inc), l = sep * (1 - e * e);
    var J1 = l * l * (1 - ci * ci), J2 = l * l * ci * ci, J3 = 2 * e, J4 = e * e;
    var R12 = r1 * r1, R22 = r2 * r2;
    var Z0 = 1 / (2 * r2), Z1 = (R22 - R12) * Z0, Z2 = 1 / (2 * r1), Z3 = (R12 - R22) * Z2;
    var H1 = 1.89553328524593e-43 * Math.pow(p.temperature1, 4) * Math.pow(10, bolometricCorrection(p.temperature1) / 2.5);
    var H2 = 1.89553328524593e-43 * Math.pow(p.temperature2, 4) * Math.pow(10, bolometricCorrection(p.temperature2) / 2.5);
    var maxVisFlux = (R12 * H1 + R22 * H2) * Math.PI;
    var minVisMag = -18.9669559998301 - 2.5 / Math.LN10 * Math.log(maxVisFlux);
    var period = Math.sqrt(4 * Math.PI * Math.PI * sep * sep * sep /
      (G * (p.mass1 + p.mass2) * SOLAR_MASS)) / 86400;
    function clamp(v) { return v < -1 ? -1 : v > 1 ? 1 : v; }
    binaries[name] = {
      period: period,
      magnitude: function (peakMagnitude, epoch) {
        var M = TAU * epoch / period, E = M, E0, n = 0;
        do { E0 = E; E = E0 + (M + e * Math.sin(E0) - E0) / (1 - e * Math.cos(E0)); n++; }
        while (Math.abs(E - E0) > 0.001 && n < 100);
        var nu = 2 * Math.atan(C1 * Math.tan(E / 2)), cn = Math.cos(nu), cw = Math.cos(nu + arg);
        var d = Math.sqrt((J1 * cw * cw + J2) / (1 + J3 * cn + J4 * cn * cn)) || 1e-8;
        var z2 = clamp(Z0 * d + Z1 / d), z1 = clamp(Z2 * d + Z3 / d);
        var a2 = Math.acos(z2), a1 = Math.acos(z1);
        var area = R22 * (a2 - z2 * Math.sin(a2)) + R12 * (a1 - z1 * Math.sin(a1));
        var front1 = ((nu + arg) % TAU + TAU) % TAU < Math.PI;   // star 1 is the one covered
        var flux = maxVisFlux - (front1 ? H1 : H2) * area;
        return peakMagnitude - minVisMag - 18.9669559998301 - 2.5 / Math.LN10 * Math.log(flux);
      }
    };
    return binaries[name];
  }

  function magnitudeAt(st, epoch) {
    if (st.k === "p") {
      var pr = PULSE[st.p], th = TAU * epoch / pr.period, m = st.m;
      for (var k = 0; k < pr.terms.length; k++) m += pr.terms[k][0] * Math.cos((k + 1) * th + pr.terms[k][1]);
      return m;
    }
    if (st.k === "e") return binary(st.p).magnitude(st.m, epoch);
    return st.m;
  }

  window.VSP = { FIELD: FIELD, STARS: STARS, OBS: OBS, PULSE: PULSE, BINARY: BINARY,
    binary: binary, magnitudeAt: magnitudeAt, bolometricCorrection: bolometricCorrection };
})();
