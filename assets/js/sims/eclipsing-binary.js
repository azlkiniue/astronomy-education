/* Eclipsing Binary Simulator --------------------------------------------------------
   Rebuild of the NAAP "Eclipsing Binary Simulator" (ebs.swf, decompiled): the canvas
   is the SWF's stage below its title bar — the 3-D view and the light-curve panel
   (and the HR Diagram window when it is open); the Presets, Star 1 / Star 2 / System
   Properties, System Orientation and Animation panels (controls only) are the sidebar.
     • BinarySystemClass: both stars orbit the centre of mass (a₁ = a·M₂/(M₁+M₂)) on
       Kepler ellipses, the view scaled so the system fills 360 px; the orbital plane
       (grey, 40 %, with its grid), the orbits, the centre-of-mass ×, and each star — a
       Sphere coloured by temperature — drawn whole behind the plane and again, cut at
       its equator, in front of it. From Earth the view looks along longitude and
       inclination; unlock it and drag the view (an orange arrow then shows Earth).
     • LightcurveClass: 300 orbital positions; for each, the overlap area of the two
       projected disks (uniform discs) and which star is in front; the visual flux
       is the stars' σT⁴ × 10^(BC/2.5) × area minus the eclipsed area (the SWF's
       bolometric-correction polynomials); normalised to 1 and plotted with phase 0
       at the primary conjunction; the phase offset can be dragged, as can the cursor.
     • the presets — eight Student-Guide examples and 39 real systems with their
       observed light curves (the SWF's own data images, drawn under the curve).
     • the HR Diagram window: both stars on an HR diagram (3000–45000 K, 10⁻³–10⁶ L☉),
       draggable to set temperature and luminosity, the allowed band shown meanwhile.
   Slider ranges follow the SWF: radii keep the stars from touching (r₁ + r₂ <
   a(1 − e)), and luminosity stays within 10⁻³–10⁶ L☉.                                  */
Sim.create({
  id: "eclipsing-binary",
  width: 817, height: 414,
  strings: {
    en: {
      "eb.presets": "Presets", "eb.select": "- select a preset -", "eb.match": "reset parameters to match",
      "eb.star1": "Star 1 Properties", "eb.star2": "Star 2 Properties", "eb.system": "System Properties",
      "eb.mass": "mass (M☉)", "eb.radius": "radius (R☉)", "eb.temp": "temperature (K)",
      "eb.sep": "separation (R☉)", "eb.ecc": "eccentricity",
      "eb.orient": "System Orientation", "eb.long": "longitude (°)", "eb.incl": "inclination (°)",
      "eb.anim": "Animation and Visualization Controls", "eb.start": "start animation", "eb.pause": "pause animation",
      "eb.speed": "animation speed", "eb.phase": "phase", "eb.lock": "lock on perspective from earth",
      "eb.paths": "show orbital paths", "eb.plane": "show orbital plane", "eb.showHR": "show HR diagram",
      "eb.lc": "show lightcurve", "eb.ms": "show main sequence track", "eb.reset": "reset",
      "eb.fromEarth": "perspective from earth", "eb.drag": "click and drag to change perspective",
      "eb.period": "system period: {p} days", "eb.flux": "Normalized Visual Flux", "eb.phaseAxis": "Phase",
      "eb.hr": "HR Diagram", "eb.hrT": "Temperature (K)", "eb.hrL": "Luminosity (L",
      "eb.g1": "Student Guide Examples", "eb.g2": "Datasets with Complete Parameters", "eb.g3": "Datasets with Incomplete Parameters", "eb.g4": "More Datasets",
      "eb.secPerOrbit": "{s} s per orbit"
    },
    id: {
      "eb.presets": "Preset", "eb.select": "- pilih preset -", "eb.match": "atur ulang parameter agar cocok",
      "eb.star1": "Sifat Bintang 1", "eb.star2": "Sifat Bintang 2", "eb.system": "Sifat Sistem",
      "eb.mass": "massa (M☉)", "eb.radius": "radius (R☉)", "eb.temp": "suhu (K)",
      "eb.sep": "jarak pisah (R☉)", "eb.ecc": "eksentrisitas",
      "eb.orient": "Orientasi Sistem", "eb.long": "bujur (°)", "eb.incl": "inklinasi (°)",
      "eb.anim": "Kontrol Animasi dan Visualisasi", "eb.start": "mulai animasi", "eb.pause": "jeda animasi",
      "eb.speed": "kecepatan animasi", "eb.phase": "fase", "eb.lock": "kunci pada sudut pandang dari Bumi",
      "eb.paths": "tampilkan lintasan orbit", "eb.plane": "tampilkan bidang orbit", "eb.showHR": "tampilkan diagram HR",
      "eb.lc": "tampilkan kurva cahaya", "eb.ms": "tampilkan jalur deret utama", "eb.reset": "atur ulang",
      "eb.fromEarth": "sudut pandang dari Bumi", "eb.drag": "klik dan seret untuk mengubah sudut pandang",
      "eb.period": "periode sistem: {p} hari", "eb.flux": "Fluks Visual Ternormalisasi", "eb.phaseAxis": "Fase",
      "eb.hr": "Diagram HR", "eb.hrT": "Suhu (K)", "eb.hrL": "Luminositas (L",
      "eb.g1": "Contoh Panduan Siswa", "eb.g2": "Data dengan Parameter Lengkap", "eb.g3": "Data dengan Parameter Tak Lengkap", "eb.g4": "Data Lainnya",
      "eb.secPerOrbit": "{s} dtk per orbit"
    }
  },
  about: {
    en: "<p>Two stars orbit their common centre of mass. If our line of sight lies near their orbital plane (high <strong>inclination</strong>), each star periodically passes in front of the other and we see <strong>eclipses</strong> — dips in the combined brightness.</p>" +
        "<p>The <strong>light curve</strong> has two dips per orbit. The <strong>primary</strong> (deeper) eclipse happens when the hotter star is hidden, because more surface brightness is blocked. Their depths and widths encode the stars' sizes, temperatures and the inclination; an eccentric orbit moves the secondary eclipse away from phase 0.5.</p>" +
        "<p>Pick one of the real systems under <strong>Presets</strong> to see its observed light curve (grey dots) under the model, then adjust the radii, temperatures, separation and inclination until the model fits. Unlock the perspective and drag the view to see the system from any direction; open the HR diagram to place the stars on it.</p>",
    id: "<p>Dua bintang mengorbit pusat massa bersama. Bila garis pandang kita dekat dengan bidang orbitnya (<strong>inklinasi</strong> tinggi), tiap bintang berkala lewat di depan yang lain dan kita melihat <strong>gerhana</strong> — penurunan kecerlangan total.</p>" +
        "<p><strong>Kurva cahaya</strong> punya dua lekukan per orbit. Gerhana <strong>primer</strong> (lebih dalam) terjadi saat bintang lebih panas tertutup, karena lebih banyak kecerlangan permukaan terhalang. Kedalaman dan lebarnya menyandikan ukuran, suhu, dan inklinasi bintang; orbit eksentrik menggeser gerhana sekunder dari fase 0,5.</p>" +
        "<p>Pilih salah satu sistem nyata di <strong>Preset</strong> untuk melihat kurva cahaya hasil pengamatannya (titik abu-abu) di bawah model, lalu atur radius, suhu, jarak pisah, dan inklinasi sampai model cocok. Buka kunci sudut pandang dan seret tampilan untuk melihat sistem dari arah mana pun; buka diagram HR untuk menempatkan bintang di sana.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif", ASC = 1.0059, OY = -30, D2R = Math.PI / 180, TAU = 2 * Math.PI;
    function t(k) { return I18N.t(k); }
    function fmt(k, o) { return t(k).replace(/\{(\w+)\}/g, function (m, n) { return o[n]; }); }
    function font(ctx, size, style) { ctx.font = (style ? style + " " : "") + size + "px " + FONT; }
    function mod(v, m) { return ((v % m) + m) % m; }
    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
    function flashString(v) { return String(parseFloat(v.toPrecision(15))); }
    function flashToFixed(x, f) {
      var s = x < 0 ? "-" : "";
      x = Math.abs(x);
      var n = String(Math.round(x * Math.pow(10, f)));
      if (f > 0) { while (n.length < f + 1) n = "0" + n; n = n.slice(0, n.length - f) + "." + n.slice(n.length - f); }
      return s + n;
    }
    function sigDigits(x, d) {
      if (x === 0) return 0;
      var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), f = Math.pow(10, d - (1 + e));
      return Math.round(f * x) / f;
    }
    function sigRound(v, sigs) {                   // the slider's 'significant digits' value and text
      var dec = 1 + Math.floor(Math.log(v) / Math.LN10), pow = Math.pow(10, dec), res = Math.pow(10, sigs);
      var tick = Math.round(v * res / pow);
      if (tick === res) { tick = res / 10; dec += 1; pow = Math.pow(10, dec); }
      var val = tick / res * pow, prec = sigs - dec;
      return { v: val, s: prec > 0 ? flashToFixed(val, prec) : flashString(val) };
    }
    function fixRound(v, d) { var k = Math.pow(10, -d); return { v: k * Math.round(v / k), s: flashToFixed(k * Math.round(v / k), d) }; }

    /* ---------------- the SWF's art ---------------- */
    var ART = {
      highlight: {nz:false, layers:[[[[{t:"r",m:[0.123779,0,0,0.123779,0,0],s:[[0,"rgba(255,255,255,0.702)"],[0.6667,"rgba(255,255,255,0.451)"],[1,"rgba(255,255,255,0.102)"]]},"M70.7 -70.75Q100 -41.45 100 0Q100 41.45 70.7 70.7Q41.45 100 0 100Q-41.45 100 -70.75 70.7Q-100 41.45 -100 0Q-100 -41.45 -70.75 -70.75Q-41.45 -100 0 -100Q41.45 -100 70.7 -70.75Z"]],[[0.05,"rgba(45,45,45,0.302)","M70.7 -70.75Q100 -41.45 100 0Q100 41.45 70.7 70.7Q41.45 100 0 100Q-41.45 100 -70.75 70.7Q-100 41.45 -100 0Q-100 -41.45 -70.75 -70.75Q-41.45 -100 0 -100Q41.45 -100 70.7 -70.75"]]]]},
      disc: new Path2D("M0 -100Q41.45 -100 70.7 -70.75Q100 -41.45 100 0Q100 41.4 70.7 70.7Q41.45 100 0 100Q-41.4 100 -70.7 70.7Q-100 41.4 -100 0Q-100 -41.45 -70.7 -70.75Q-41.4 -100 0 -100Z"),
      com: {nz:false, layers:[[[["rgba(0,153,0,0.6)","M0 -2.85L8.6 -11.4Q9.15 -12 10 -12Q10.85 -12 11.45 -11.4Q12 -10.85 12 -10Q12 -9.15 11.45 -8.55L2.85 0L11.45 8.6Q12 9.15 12 10Q12 10.85 11.45 11.45Q10.85 12 10 12Q9.15 12 8.6 11.45L0 2.85L-8.55 11.45Q-9.15 12 -10 12Q-10.85 12 -11.4 11.45Q-12 10.85 -12 10Q-12 9.15 -11.4 8.6L-2.85 0L-11.4 -8.55Q-12 -9.15 -12 -10Q-12 -10.85 -11.4 -11.4Q-10.85 -12 -10 -12Q-9.15 -12 -8.55 -11.4L0 -2.85Z"]],[]]]},
      sun: {nz:false, layers:[[[["#000000","M5.35 4.35L4.9 4.2L4.65 3.7Q4.65 3.4 4.9 3.2Q5.05 3 5.35 3L5.8 3.2L6 3.7L5.8 4.2L5.35 4.35Z"]],[[0.05,"#000000","M6.9 5.25Q6.25 5.95 5.35 5.95Q4.4 5.95 3.7 5.25Q3.05 4.65 3.1 3.7Q3.05 2.75 3.7 2.1Q4.4 1.4 5.35 1.4Q6.25 1.4 6.9 2.1Q7.55 2.75 7.6 3.7Q7.55 4.65 6.9 5.25"]]]]},
      close: {nz:false, layers:[[[["#ffffff","M16 16L0 16L0 0L16 0L16 16Z"]],[[3.0,"#666666","M13.35 13.3L8 7.95L2.7 13.3M2.65 2.65L8 7.95L13.35 2.65"]]]]}
    };
    var MS_PTS = "0,-189.44;5,-185.74;10,-182.14;15,-178.64;20,-175.25;25,-171.95;30,-168.73;35,-165.6;40,-162.56;45,-159.59;50,-156.69;55,-153.86;60,-151.1;65,-148.39;70,-145.74;75,-143.14;80,-140.59;85,-138.08;90,-135.61;95,-133.17;100,-130.76;105,-128.38;110,-126.02;115,-123.68;120,-121.34;125,-119.02;130,-116.7;135,-114.39;140,-112.06;145,-109.73;150,-107.39;155,-105.03;160,-102.64;165,-100.24;170,-97.8;175,-95.33;180,-92.82;185,-90.26;190,-87.66;195,-85.01;200,-82.31;205,-79.54;210,-76.71;215,-73.81;220,-70.84;225,-67.79;230,-64.66;235,-61.45;240,-58.14;245,-54.74;250,-51.25;255,-47.65;260,-43.94;265,-40.13;270,-36.2;275,-32.15;280,-27.97;285,-23.67;290,-19.24;295,-14.66;300,-9.95";
    var MS = MS_PTS.split(";").filter(Boolean).map(function (p) { return p.split(",").map(Number); });
    function img(src) { var i = new Image(); i.onload = function () { S.requestDraw(); }; i.src = src; return i; }
    var DATA = img("../assets/img/sims/eclipsing-binary-data.webp"), HRBG = img("../assets/img/sims/eclipsing-binary-hr.webp");
    var DATA_NAMES = ["V885 Cyg", "V541 Cyg", "V526 Sgr", "V478 Cyg", "V477 Cyg", "V459 Cas", "V442 Cyg", "V380 Cyg", "V364 Lac", "UZ Dra", "TX UMa", "TW Cas", "TT Lyr", "T LMi", "SW Cyg", "SW CMa", "RZ Cas", "RX Ari", "RT CrB", "RS Ind", "NN Cep", "MR Cyg", "KP Aql", "IQ Per", "IM Aur", "HS Aur", "GG Ori", "FS Mon", "FL Lyr", "EW Ori", "EK Cep", "EF Dra", "DM Del", "DI Her", "CW CMa", "CD Tau", "BP Vul", "AY Cam", "AW UMa", "AW Lac", "AR Aur", "AG Phe", "AF Gem", "AE Phe", "AD Her", "AD Boo"];                 // atlas order: 8 columns of 320 × 220 images

    /* ---------------- stellar relations (the SWF's fits) ---------------- */
    var LMIN = 0.001, LMAX = 1000000, TMIN = 3000, TMAX = 45000, RMIN = 0.1, RMAX = 50, MMIN = 0.1, MMAX = 85, AMIN = 0.5, AMAX = 60, EMIN = 0, EMAX = 0.6;
    function RfromTL(T, L) { return 33736108.2311059 * Math.sqrt(L) / (T * T); }
    function LfromRT(R, T) { return R * R * Math.pow(T / 5808.27928315314, 4); }
    function TfromLR(L, R) { return 5808.27928315314 * Math.pow(L / (R * R), 0.25); }
    function colorFromTemp(T) {                    // Sphere.getColorFromTemp
      T = clamp(T, 1000, 40000);
      var l = Math.log(T) / Math.LN10, l2 = l * l, l3 = l * l2;
      var r = clamp(22686.34111 - l * 15082.52755 + l2 * 3375.333832 - l3 * 252.4073853, 0, 255);
      var g = T > 6500 ? 13836.23586 - l * 9069.078214 + l2 * 2015.254756 - l3 * 149.7766966 : -811.6499145 + l * 36.97365953 + l2 * 160.7861677 - l3 * 25.57573664;
      var b = clamp(-11545.34298 + l * 8529.658165 - l2 * 2150.198586 + l3 * 190.0306573, 0, 255);
      return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
    }

    /* ---------------- the presets ---------------- */
    var SYSTEMS = [{comment:'Discuss Flat Top of Light Curve, Partial Eclipses (Flat Bottoms)', w:0, i:90, e:0, a:6, t2:6000, r2:0.16667, m2:1, t1:6000, r1:0.16667, m1:1, id:null, name:'Example 1'}, {comment:'Total Eclipses', w:0, i:90, e:0, a:6, t2:6000, r2:0.16667, m2:1, t1:6000, r1:0.33333, m1:1, id:null, name:'Example 2'}, {comment:'Uneven Eclipse Depths', w:0, i:90, e:0, a:6, t2:6000, r2:0.16667, m2:1, t1:8000, r1:0.16667, m1:1, id:null, name:'Example 3'}, {comment:'Different Masses - (Change viewpoint to looking down on plane)', w:0, i:90, e:0, a:6, t2:6000, r2:0.16667, m2:1, t1:6000, r1:0.16667, m1:2, id:null, name:'Example 4'}, {comment:'Non-zero Eccentricity - Masses Equal', w:0, i:90, e:0.4, a:6, t2:6000, r2:0.16667, m2:1, t1:6000, r1:0.16667, m1:1, id:null, name:'Example 5'}, {comment:"Non-zero Eccentricity - Masses Not Equal - Tie to Kepler's Second Law", w:0, i:90, e:0.4, a:6, t2:6000, r2:0.16667, m2:1, t1:6000, r1:0.16667, m1:2, id:null, name:'Example 6'}, {comment:'Conditions for Eclipses (Return to Earth Viewpoint) - Slowly Decrease inclination - when do eclipses become partial/nonexistent', w:0, i:90, e:0, a:6, t2:6000, r2:0.16667, m2:1, t1:6000, r1:0.5, m1:3, id:null, name:'Example 7'}, {comment:'Conditions for Eclipses (Earth Viewpoint) - Slowly Decrease inclination - when do eclipses become partial/nonexistent', w:0, i:90, e:0, a:25, t2:6000, r2:0.04, m2:1, t1:6000, r1:0.12, m1:3, id:null, name:'Example 8'}, {e:0, w:0, i:90, t2:7400, t1:7400, r2:0.128, r1:0.134, a:13.61, m2:1.48, m1:1.5, m:0.988, type:'F0V/F0V', parErr:0, par:0, V:9.42, id:42, name:'KP Aql'}, {e:0.068, w:314, i:89.65, t2:5781, t1:5970, r2:0.0536, r1:0.0561, a:19.5, m2:1.02, m1:1.05, m:0.97, type:'G0V/G5V', parErr:0, par:0, V:9.94, id:124, name:'EW Ori'}, {e:0, w:0, i:86.3, t2:5297, t1:6152, r2:0.105, r1:0.14, a:8.87, m2:0.87, m1:1.11, m:0.786, type:'F8V/?', parErr:0.89, par:7.69, V:9.33, id:126, name:'FL Lyr'}, {e:0.109, w:49.8, i:89.16, t2:5689, t1:8995, r2:0.0791, r1:0.095, a:16.58, m2:1.11, m1:2.02, m:0.55, type:'A1.5V/?', parErr:0.58, par:6.53, V:7.85, id:122, name:'EK Cep'}, {e:0, w:0, i:74.7, t2:5400, t1:10500, r2:0.3182, r1:0.25, a:8.17, m2:1.08, m1:2.51, m:0.432, type:'A0V/?', parErr:0.93, par:3.99, V:8.32, id:171, name:'TW Cas'}, {e:0, w:0, i:84.1, t2:3900, t1:8610, r2:0.312003, r1:0.085041, a:26.14, m2:0.62, m1:1.89, m:0.33, type:'A4V/K2', parErr:2.28, par:-0.18, V:9.36, id:41, name:'AD Her'}, {e:0, w:0, i:78.3, t2:7022, t1:7175, r2:0.275627, r1:0.660024, a:2.81, m2:0.11, m1:1.43, m:0.0803, type:'F0/?', parErr:0.9, par:15.13, V:6.84, id:45, name:'AW UMa'}, {e:0, w:0, i:78.9, t2:17300, t1:20500, r2:0.497003, r1:0.497003, a:10.65, m2:6.22, m1:6.22, m:1, type:'B2V?/?', parErr:0.71, par:-0.57, V:10.6, id:18, name:'AW Lac'}, {e:0, w:0, i:87.4, t2:5200, t1:8770, r2:0.293378, r1:0.528004, a:5.07, m2:0.5, m1:1.94, m:0.26, type:'A2V/G8', parErr:0, par:0, V:8.65, id:8, name:'DM Del'}, {e:0, w:0, i:84.9, t1:5781, t2:5075, r1:0.007, r2:0.1707, a:14.5, m1:0.79, m2:0.78, id:149, name:'RT CrB'}, {e:0.0295, w:65, i:0, t2:30308, t1:30900, r2:0.271, r1:0.286, a:24.29, m2:11.43, m1:11.76, m:0.9717, type:'B0V/B0V', parErr:0.92, par:0, V:8.73, id:195, name:'V478 Cyg'}, {e:0.331, w:162.8, i:85.66, t2:6528, t1:8727, r2:0.024739, r1:0.027762, a:60, m2:1.44, m1:1.93, m:0.749, type:'A3V/F5V', parErr:1.05, par:5.22, V:8.55, id:196, name:'V477 Cyg'}, {e:0, w:329.9, i:89.3, t2:15100, t1:17000, r2:0.0574, r1:0.0621, a:42.12, m2:4.22, m1:4.8, m:0.88, type:'B5III/?', parErr:1.11, par:1.47, V:8.42, id:110, name:'DI Her'}, {e:0, w:0, i:87.624, t2:3000, t1:7500, r2:0.247057, r1:0.413152, a:4.22, m2:0.24, m1:1.53, m:0.1559, type:'A9V/?', parErr:1.15, par:4.76, V:8.98, id:95, name:'AG Phe'}, {e:0, w:0, i:0, t2:3000, t1:8600, r2:0.312262, r1:0.249291, a:6.44, m2:0.62, m1:1.89, m:0.3311, type:'A3V/K0IV', parErr:0.62, par:15.99, V:6.18, id:155, name:'RZ Cas'}, {e:0, w:0, i:87.4, t2:3300, t1:10000, r2:0.0142, r1:0.32975, a:7.13, m2:0.8, m1:2.34, m:0.342, type:'B9.5V/G0III-', parErr:0, par:0, V:10.54, id:92, name:'AF Gem'}, {e:0, w:0, i:83.3, t2:10300, t1:10800, r2:0.156894, r1:0.176215, a:11.92, m2:2.46, m1:2.61, m:0.944, type:'A0V/?', parErr:0, par:0, V:8.58, id:109, name:'CW CMa'}, {e:0, w:0, i:81.88, t2:3520, t1:6800, r2:0.228586, r1:0.393886, a:5.09, m2:0.36, m1:1.31, m:0.2749, type:'F2V/?', parErr:0, par:0, V:9.48, id:152, name:'RX Ari'}, {e:0, w:0, i:84.4, t2:13900, t1:20900, r2:0.32667, r1:0.360635, a:12.33, m2:2.55, m1:6.39, m:0.399, type:'B3V/?', parErr:0.87, par:1.32, V:8.95, id:138, name:'MR Cyg'}, {e:0, w:0, i:83.5, t2:5500, t1:12900, r2:0.253, r1:0.176, a:14.24, m2:0.82, m1:3.31, m:0.247, type:'B8V/G0III', parErr:1.08, par:4.74, V:7.06, id:44, name:'TX UMa'}, {e:0, w:0, i:86, t2:6725, t1:6900, r2:0.154, r1:0.192, a:10.27, m2:1.21, m1:1.34, m:0.902, type:'F1V/F2V', parErr:0, par:0, V:9.713, id:191, name:'V442 Cyg'}, {e:0, w:0, i:87.8, t2:5930, t1:6383, r2:0.1277, r1:0.1702, a:8.88, m2:1.01, m1:1.18, m:0.86, type:'F6V/G0V', parErr:0, par:0, V:9.45, id:5, name:'AD Boo'}, {e:0, w:0, i:89.32, t2:5844, t1:6100, r2:0.0897, r1:0.104601, a:11.84, m2:1, m1:1.09, m:0.92, type:'F7V/G0V', parErr:0, par:0, V:9.58, id:180, name:'UZ Dra'}, {e:0, w:0, i:88.52, t2:10600, t1:11125, r2:0.0996, r1:0.0977, a:18.81, m2:2.51, m1:2.71, m:0.925, type:'B9.5V/?', parErr:0.78, par:8.2, V:6.14, id:97, name:'AR Aur'}, {e:0, w:0, i:89.7, t2:5200, t1:5346, r2:0.037, r1:0.043, a:23.01, m2:0.84, m1:0.86, m:0.977, type:'G8V/K0V', parErr:2.21, par:10.05, V:10.16, id:127, name:'HS Aur'}, {e:0, w:0, i:88.465, t2:7395, t1:7250, r2:0.161294, r1:0.222022, a:11.54, m2:1.3, m1:1.45, m:0.8972, type:'A9V/F1V', parErr:0, par:0, V:9.683, id:204, name:'AY Cam'}, {e:0, w:0, i:87.7, t2:6200, t1:6200, r2:0.1172, r1:0.133, a:12.43, m2:1.06, m1:1.12, m:0.948, type:'F6V/F6V', parErr:1.64, par:13.66, V:6.8, id:35, name:'CD Tau'}, {e:0, w:0, i:87.7, t2:6550, t1:6715, r2:0.1729, r1:0.2177, a:8.7, m2:1.15, m1:1.28, m:0.8959, type:'F2V/F4V', parErr:0, par:0, V:9.601, id:21, name:'FS Mon'}, {e:0.0355, w:154.7, i:87.67, t2:6775, t1:7709, r2:0.1553, r1:0.1931, a:9.33, m2:1.3, m1:1.6, m:0.8105, type:'A7m/F2m', parErr:1.51, par:1.03, V:9.803, id:31, name:'BP Vul'}, {e:0.0243, w:240.1, i:89.465, t2:9099, t1:9141, r2:0.071, r1:0.0726, a:27.89, m2:2.01, m1:2.06, m:0.974, type:'A1V/A1V', parErr:0, par:0, V:10.34, id:206, name:'V459 Cas'}, {e:0.2873, w:85.265, i:89.19, t1:8500, t2:8251, r1:0.113222, r2:0.12572, a:24.33, m1:1.8, m2:1.77, id:185, name:'V364 Lac'}, {e:0.2194, w:254.76, i:87.3, t2:8450, t1:10100, r2:0.1521, r1:0.1843, a:10.43, m2:1.76, m1:2.38, m:0.74, type:'B9.5V/A2V', parErr:0, par:0, V:9.708, id:208, name:'V526 Sgr'}, {e:0.2218, w:122.76, i:89.24, t2:9950, t1:9950, r2:0.071778, r1:0.071891, a:24.78, m2:2.32, m1:2.33, m:0.9982, type:'B9.5V/B9.5V', parErr:0, par:0, V:10.385, id:131, name:'GG Ori'}, {e:0.3179, w:162.4, i:88.72, t2:8500, t1:8500, r2:0.0775, r1:0.09458, a:29.97, m2:1.7, m1:1.85, m:0.914, type:'A5V/A5V', parErr:1.13, par:2.33, V:9.126, id:163, name:'SW CMa'}, {e:0.479, w:262.82, i:89.88, t2:9954, t1:9885, r2:0.0419, r1:0.044, a:43.23, m2:2.31, m1:2.31, m:1, type:'B9.5V/B9.5V', parErr:0, par:0, V:10.35, id:209, name:'V541 Cyg'}, {e:0.075, w:70, i:89.3, t2:8100, t1:12300, r2:0.142, r1:0.231, a:10.17, m2:1.53, m1:3.11, m:0.493, type:'B7.5/A6', parErr:1.08, par:2.99, V:7.73, id:19, name:'IQ Per'}, {e:0, w:0, i:78, t2:5095, t1:10350, r2:0.279333, r1:0.371908, a:7.28, m2:0.87, m1:2.46, m:0.353, type:'B7V/?', parErr:0, par:0, V:7.94, id:136, name:'IM Aur'}, {e:0, w:0, i:83.7, t2:4900, t1:9500, r2:0.27, r1:0.167, a:17.83, m2:0.59, m1:2.18, m:0.27, type:'A0V/G5?', parErr:0, par:0, V:9.2, id:169, name:'TT Lyr'}, {e:0, w:0, i:86.3, t2:5055, t1:9860, r2:0.2, r1:0.158, a:11.97, m2:0.23, m1:2.3, m:0.1, type:'A3V/G5III', parErr:2.05, par:1.87, V:10.87, id:168, name:'T LMi'}, {e:0, w:0, i:82.7, t2:3813, t1:9070, r2:0.320215, r1:0.171295, a:16.31, m2:0.75, m1:2.04, m:0.3664, type:'A2e/K0', parErr:0.96, par:0.81, V:9.24, id:164, name:'SW Cyg'}, {e:0.234, w:132.7, i:82.4, t2:20500, t1:21350, r2:0.0631, r1:0.2478, a:49.76, m2:4.13, m1:6.59, m:0.626, type:'B1.5II/B2V', parErr:0.49, par:1.27, V:5.68, id:187, name:'V380 Cyg'}, {e:0, w:0, i:80.3, t2:8500, t1:8262, r2:0.177005, r1:0.340992, a:11.03, m2:2.47, m1:1.78, m:1.39, type:'A5/?', parErr:0.92, par:3.31, V:8.1, id:139, name:'NN Cep'}, {e:0, w:0, i:87.99, t2:6145, t1:6000, r2:0.343278, r1:0.502069, a:3.31, m2:2.65, m1:1.06, m:2.5006, type:'G1V/G2V', parErr:0.81, par:20.49, V:7.79, id:39, name:'AE Phe'}, {e:0, w:0, i:84, t2:4730, t1:4400, r2:0.360782, r1:0.476368, a:7.15, m2:1.13, m1:0.58, m:1.938, type:'A3mV/A4mV', parErr:0, par:0, V:9.96, id:207, name:'V885 Cyg'}, {e:0, w:0, i:90, t2:4659, t1:7200, r2:0.3039, r1:0.4983, a:3.81, m2:0.46, m1:1.44, m:0.322, type:'F0-F2/?', parErr:0, par:0, V:9.37, id:146, name:'RS Ind'}, {e:0, w:0, i:78.13, t2:6054, t1:6000, r2:0.292257, r1:0.594226, a:2.54, m2:0.17, m1:1.06, m:0.16, type:'F9V/?', parErr:0, par:0, V:10.8, id:120, name:'EF Dra'}];
    var COMPLETE = 8, INCOMPLETE = 17, EXTRA = 24;

    /* ---------------- state ---------------- */
    var star = [null, { m: 1, r: 1.5, t: 8700 }, { m: 1, r: 1.5, t: 5000 }];
    var sys = { a: 10, e: 0.3 }, longitude = 150, inclination = 80;
    var viewTheta = 0, viewPhi = 0, locked = true, showPaths = true, showPlane = true, showCurve = true, showMS = false;
    var cursorPhase = 0.7, phaseOffset = 0.5, speed = 0.0001, animating = false, timeLast = 0;
    var preset = -1, dataset = null, hrOpen = false, hrPos = { x: -412, y: -294.05 };
    function lum(i) { return LfromRT(star[i].r, star[i].t); }
    function systemTheta() { return mod(90 - longitude, 360); }
    function systemPhi() { return 90 - inclination; }
    function period() { return 0.115496 * Math.sqrt(Math.pow(sys.a, 3) / (star[1].m + star[2].m)); }

    /* ---------------- LightcurveClass ---------------- */
    var N = 300, RSUN = 696000000, LC = { x: 475, y: 268.36, w: 320, h: 200, top: 17, bottom: 5 };
    var lcFlux = [], lcMax = 1, lcNoEclipse = true, closestIndex = 0, positions = [];
    function keplerE(m, e) { var e1 = m + e * Math.sin(m), e0; do { e0 = e1; e1 = m + e * Math.sin(e0); } while (Math.abs(e1 - e0) > 0.001); return e1; }
    function generatePositions(e) {
      var k1 = Math.sqrt((1 + e) / (1 - e)), k = RSUN * (1 - e * e), half = N / 2;
      positions = new Array(N);
      positions[0] = { x: k / (1 + e), y: 0 }; positions[half] = { x: -k / (1 - e), y: 0 };
      for (var i = 1; i < half; i++) {
        var E = keplerE(i * TAU / N, e), nu = 2 * Math.atan(k1 * Math.tan(E / 2)), r = k / (1 + e * Math.cos(nu));
        positions[i] = { x: r * Math.cos(nu), y: r * Math.sin(nu) };
        positions[N - i] = { x: r * Math.cos(nu), y: -r * Math.sin(nu) };
      }
    }
    function lightCurve() {
      var e = sys.e, th = systemTheta() * D2R, ph = systemPhi() * D2R;
      generatePositions(e);
      var c57 = sys.a * Math.cos(th), c58 = sys.a * Math.sin(th), cP = Math.cos(ph), sP = Math.sin(ph);
      var r28 = -c58, r26 = c57, r31 = c57 * sP, r30 = c58 * sP, r49 = c57 * cP, r47 = c58 * cP;
      var R1 = RSUN * star[1].r, R2 = RSUN * star[2].r, R1s = R1 * R1, R2s = R2 * R2, sum2 = (R1 + R2) * (R1 + R2);
      var r39 = 1 / (2 * R2), r43 = (R2s - R1s) * r39, r38 = 1 / (2 * R1), r53 = (R1s - R2s) * r38;
      var overlap = [], best = Infinity, closest = 0, i;
      for (i = 0; i < N; i++) {
        var p = positions[i], X = r28 * p.x + r26 * p.y, Y = r31 * p.x + r30 * p.y, Z = r49 * p.x + r47 * p.y, d2 = X * X + Y * Y;
        if (Z > 0 && d2 < best) { best = d2; closest = i; }
        if (!(d2 < sum2)) { overlap.push(0); continue; }
        var d = Math.sqrt(d2) || 1e-8;
        var c7 = clamp(r39 * d + r43 / d, -1, 1), c6 = clamp(r38 * d + r53 / d, -1, 1), a23 = Math.acos(c7), a21 = Math.acos(c6);
        var A = R2s * (a23 - c7 * Math.sin(a23)) + R1s * (a21 - c6 * Math.sin(a21));
        overlap.push(Z < 0 ? A : -A);
      }
      // refine the conjunction around the closest tabulated point
      var k1 = Math.sqrt((1 + e) / (1 - e)), k = RSUN * (1 - e * e), r37 = N / TAU, step = 2 / (r37 * 15), m0 = (closest - 1) / r37, ci = closest;
      for (i = 1; i < 15; i++) {
        var M = m0 + i * step, E = keplerE(M, e), nu = 2 * Math.atan(k1 * Math.tan(E / 2)), r = k / (1 + e * Math.cos(nu));
        var x = r * Math.cos(nu), y = r * Math.sin(nu), X2 = r28 * x + r26 * y, Y2 = r31 * x + r30 * y, dd = X2 * X2 + Y2 * Y2;
        if (dd < best) { best = dd; ci = M * r37; }
      }
      closestIndex = mod(ci, N);
      // generateMagnitudeTable: visual flux from σT⁴ and the bolometric correction
      function bc(T) {
        var l = Math.log(T) / Math.LN10, c;
        if (l > 3.9) c = [-100139.4991, 116264.1842, -53931.97541, 12495.04227, -1445.868048, 66.84924471];
        else if (l < 3.7) c = [-13884.14899, 8595.127427, -488.3425525, -627.0092238, 137.4608131, -7.549572042];
        else c = [1439.981506, -151.9002581, -995.1089203, 582.5176671, -123.3293641, 9.160761128];
        return c[0] + l * (c[1] + l * (c[2] + l * (c[3] + l * (c[4] + c[5] * l))));
      }
      var f1 = 1.89553328524593e-43 * Math.pow(star[1].t, 4) * Math.pow(10, bc(star[1].t) / 2.5);
      var f2 = -1.89553328524593e-43 * Math.pow(star[2].t, 4) * Math.pow(10, bc(star[2].t) / 2.5);
      var total = (star[1].r * star[1].r * f1 - star[2].r * star[2].r * f2) * 1.52183774688135e18, min = Infinity;
      lcFlux = overlap.map(function (v) { var f = v < 0 ? total + f1 * v : total + f2 * v; if (f < min) min = f; return f; });
      lcNoEclipse = total === min; lcMax = total;
    }

    /* ---------------- BinarySystemClass ---------------- */
    var VIEW = { x: 207, y: 237.08 }, TARGET = 360, LINE_EXTRA = 20;
    function sysGeom() {
      var mt = star[1].m + star[2].m, a1 = sys.a * star[2].m / mt, a2 = sys.a * star[1].m / mt, e = sys.e;
      var scale = TARGET / (2 * Math.max(a1 * (1 + e) + star[1].r, a2 * (1 + e) + star[2].r));
      var th = viewTheta * D2R, ph = viewPhi * D2R, s = scale;
      var A = { a0: -s * Math.sin(th), a1: s * Math.cos(th), a3: s * Math.cos(th) * Math.sin(ph), a4: s * Math.sin(th) * Math.sin(ph),
        a5: -s * Math.cos(ph), a6: s * Math.cos(th) * Math.cos(ph), a7: s * Math.sin(th) * Math.cos(ph), a8: s * Math.sin(ph) };
      return { a1: a1, a2: a2, e: e, s: s, th: th, ph: ph, A: A };
    }
    function project(A, x, y, z) { return { x: x * A.a0 + y * A.a1, y: x * A.a3 + y * A.a4 + z * A.a5, z: x * A.a6 + y * A.a7 + z * A.a8 }; }
    function starPositions(g) {                    // updatePositions
      var ph = mod(cursorPhase + closestIndex / N, 1) * TAU, E = 0, e1 = ph + g.e * Math.sin(ph), c = 0;
      do { E = e1; e1 = ph + g.e * Math.sin(E); c++; } while (Math.abs(e1 - E) > 0.001 && c < 100);
      var nu = 2 * Math.atan(Math.sqrt((1 + g.e) / (1 - g.e)) * Math.tan(e1 / 2)), q = (1 - g.e * g.e) / (1 + g.e * Math.cos(nu));
      var r1 = g.a1 * q, r2 = g.a2 * q;
      return [null, project(g.A, -r1 * Math.cos(nu), -r1 * Math.sin(nu), 0), project(g.A, r2 * Math.cos(nu), r2 * Math.sin(nu), 0)];
    }
    function drawSphere(ctx, R, T) {
      ctx.save(); ctx.scale(R / 100, R / 100);
      ctx.fillStyle = colorFromTemp(T); ctx.fill(ART.disc);
      SwfShape.draw(ctx, ART.highlight);
      ctx.restore();
    }
    function frontMask(ctx, R, ph) {              // updateMask: the half above the plane plus the near half of the equator
      var n = 12, step = TAU / n, R2 = R / Math.cos(step / 2), a = 0, c = -step / 2, sgn = ph > 0 ? -1 : 1, i;
      ctx.moveTo(R, 0);
      for (i = 0; i < n / 2; i++) { a += step; c += step; ctx.quadraticCurveTo(R2 * Math.cos(c), sgn * R2 * Math.sin(c), R * Math.cos(a), sgn * R * Math.sin(a)); }
      var ey = -R * Math.sin(ph), ey2 = -R2 * Math.sin(ph), pts = [];
      for (i = n / 2; i < n; i++) { a += step; c += step; ctx.quadraticCurveTo(R2 * Math.cos(c), ey2 * Math.sin(c), R * Math.cos(a), ey * Math.sin(a)); pts.push([R2 * Math.cos(c), ey2 * Math.sin(c), R * Math.cos(a), ey * Math.sin(a)]); }
      return pts;
    }
    function drawView(ctx) {
      var g = sysGeom(), pos = starPositions(g), R = [0, g.s * star[1].r, g.s * star[2].r];
      var order = pos[1].z > pos[2].z ? [2, 1] : [1, 2];          // the nearer star on top
      var line = locked ? null : sightLine(g, pos);
      ctx.save(); ctx.beginPath(); ctx.rect(7, 37, 400, 400.05); ctx.clip();
      ctx.fillStyle = "#000000"; ctx.fillRect(7, 37.1, 400, 400);
      ctx.translate(VIEW.x, VIEW.y);
      // backHalfMC: the line behind both stars, the stars whole, the line between them
      if (line && !line.front) drawLine(ctx, line, "C");
      order.forEach(function (i, k) {
        ctx.save(); ctx.translate(pos[i].x, pos[i].y); drawSphere(ctx, R[i], star[i].t); ctx.restore();
        if (k === 0 && line && !line.front) drawLine(ctx, line, "B");
      });
      if (line && !line.front) drawLine(ctx, line, "A");
      // orbitalPlaneMC
      ctx.save(); ctx.scale(1, Math.sin(g.ph)); ctx.rotate((90 + g.th / D2R) * D2R);
      if (showPlane) drawGrid(ctx, g);
      if (showPaths) drawPaths(ctx, g);
      SwfShape.draw(ctx, ART.com);
      ctx.restore();
      // frontHalfMC: each star again, cut at its equator, with the equator drawn
      if (line && line.front) drawLine(ctx, line, "C");
      order.forEach(function (i, k) {
        ctx.save(); ctx.translate(pos[i].x, pos[i].y);
        ctx.save(); ctx.beginPath(); var eq = frontMask(ctx, R[i], g.ph); ctx.closePath(); ctx.clip();
        drawSphere(ctx, R[i], star[i].t);
        if (showPlane) {
          ctx.strokeStyle = "rgba(176,176,176,0.8)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-R[i], 0);
          eq.forEach(function (q) { ctx.quadraticCurveTo(q[0], q[1], q[2], q[3]); }); ctx.stroke();
        }
        ctx.restore(); ctx.restore();
        if (k === 0 && line && line.front) drawLine(ctx, line, "B");
      });
      if (line && line.front) drawLine(ctx, line, "A");
      ctx.restore();
      // the window's two labels
      font(ctx, 12, "italic"); ctx.fillStyle = "#ffffff";
      FlashText.fill(ctx, t(locked ? "eb.fromEarth" : "eb.drag"), 18, 46.76 + ASC * 12, "left");
      FlashText.fill(ctx, fmt("eb.period", { p: flashString(sigDigits(period(), 3)) }), 39 + 357 - 2, 412.8 + ASC * 12, "right");
    }
    function drawGrid(ctx, g) {                    // updateOrbitalPlane
      var s = g.s, e = g.e, sq = Math.sqrt(1 - e * e), b1 = g.a1 * sq, b2 = g.a2 * sq, r1 = star[1].r, r2 = star[2].r;
      var x0 = -Math.max(g.a2 * (1 + e) + 1.75 * r2, g.a1 * (1 - e) + 1.75 * r1), x1 = Math.max(g.a1 * (1 + e) + 1.75 * r1, g.a2 * (1 - e) + 1.75 * r2);
      var y1 = Math.max(b1 + 1.75 * r1, b2 + 1.75 * r2), y0 = -y1;
      ctx.fillStyle = "rgba(176,176,176,0.4)"; ctx.fillRect(s * x0, s * y0, s * (x1 - x0), s * (y1 - y0));
      var m = 20 / s, lg = Math.log(m) / Math.LN10, k = Math.ceil(lg), sp, below, mult;
      if (k - lg > 0.30102999566398114) { below = Math.pow(10, k - 1); sp = 5 * below; mult = 2; } else { sp = Math.pow(10, k); below = 0.5 * sp; mult = 5; }
      var minorA = (5 + (45 * (sp - m)) / (sp - below)) / 100;
      ctx.lineWidth = 1;
      function styleFor(i) { return i === 0 ? "rgba(77,169,77,0.65)" : "rgba(144,144,144," + (i % mult === 0 ? 0.5 : minorA) + ")"; }
      var i;
      for (i = Math.ceil(x0 / sp); i < Math.ceil(x1 / sp); i++) { ctx.strokeStyle = styleFor(i); ctx.beginPath(); ctx.moveTo(i * sp * s, s * y0); ctx.lineTo(i * sp * s, s * y1); ctx.stroke(); }
      for (i = Math.ceil(y0 / sp); i < Math.ceil(y1 / sp); i++) { ctx.strokeStyle = styleFor(i); ctx.beginPath(); ctx.moveTo(s * x0, i * sp * s); ctx.lineTo(s * x1, i * sp * s); ctx.stroke(); }
    }
    function drawPaths(ctx, g) {                   // updateOrbitalPaths
      var n = 12, st = TAU / n, sq = Math.sqrt(1 - g.e * g.e), c = 1 / Math.cos(st / 2);
      [[g.s * g.a1, g.s * g.a1 * sq, g.s * g.a1 * g.e], [g.s * g.a2, g.s * g.a2 * sq, -g.s * g.a2 * g.e]].forEach(function (p) {
        ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p[0] + p[2], 0);
        for (var i = 0, a = 0, cc = -st / 2; i < n; i++) { a += st; cc += st; ctx.quadraticCurveTo(p[0] * c * Math.cos(cc) + p[2], p[1] * c * Math.sin(cc), p[0] * Math.cos(a) + p[2], p[1] * Math.sin(a)); }
        ctx.stroke();
      });
    }
    function sightLine(g, pos) {                   // updateLine: the arrow towards Earth, cut where the stars hide it
      var lt = systemTheta() * D2R, lp = systemPhi() * D2R, len = (LINE_EXTRA + TARGET / 2) / g.s;
      var dir = [Math.cos(lt) * Math.cos(lp), Math.sin(lt) * Math.cos(lp), Math.sin(lp)];
      var E = project(g.A, len * dir[0], len * dir[1], len * dir[2]);
      var f = pos[1].z > pos[2].z ? 1 : 2, b = 3 - f, F = pos[f], B = pos[b], rf = g.s * star[f].r, rb = g.s * star[b].r;
      var us = [0, 1];
      function hits(P, r) {
        var qa = E.x * E.x + E.y * E.y + E.z * E.z, qb = -2 * (E.x * P.x + E.y * P.y + E.z * P.z), qc = P.x * P.x + P.y * P.y + P.z * P.z - r * r, D = qb * qb - 4 * qa * qc;
        if (D > 0) { us.push((-qb + Math.sqrt(D)) / (2 * qa)); us.push((-qb - Math.sqrt(D)) / (2 * qa)); }
      }
      hits(F, rf); hits(B, rb);
      if (E.z !== 0) { us.push(F.z / E.z); us.push(B.z / E.z); }
      us.sort(function (p, q) { return p - q; });
      function region(u) {
        var x = u * E.x, y = u * E.y, z = u * E.z;
        if (Math.pow(x - F.x, 2) + Math.pow(y - F.y, 2) + Math.pow(z - F.z, 2) < rf * rf) return null;
        if (Math.pow(x - B.x, 2) + Math.pow(y - B.y, 2) + Math.pow(z - B.z, 2) < rb * rb) return null;
        return !(z < F.z) ? "A" : !(z < B.z) ? "B" : "C";
      }
      var segs = [], u0 = us[0];
      for (var i = 0; i + 1 < us.length && us[i] !== 1; i++) {
        var ua = us[i], ub = us[i + 1];
        if (ua < 0) continue;
        var rg = region(ua + (ub - ua) / 2);
        if (rg) segs.push([rg, ua * E.x, ua * E.y, Math.min(ub, 1) * E.x, Math.min(ub, 1) * E.y]);
        if (ub >= 1) break;
      }
      var r11 = (LINE_EXTRA + TARGET / 2 - LINE_EXTRA * 2 / 3) / g.s, r20 = 0.25 * LINE_EXTRA / g.s;
      var hx = Math.cos(lt) * Math.cos(lp) * r11, hy = Math.sin(lt) * Math.cos(lp) * r11, hz = Math.sin(lp) * r11;
      var sx = -Math.sin(lt) * r20, sy = Math.cos(lt) * r20;
      var h1 = project(g.A, hx + sx, hy + sy, hz), h2 = project(g.A, hx - sx, hy - sy, hz);
      segs.push([region(1) || "A", h1.x, h1.y, E.x, E.y, h2.x, h2.y]);
      return { segs: segs, front: lp === 0 || (lp > 0) === (g.ph > 0) };
    }
    function drawLine(ctx, line, rg) {
      ctx.strokeStyle = "#ff8080"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
      line.segs.forEach(function (sg) {
        if (sg[0] !== rg) return;
        ctx.beginPath(); ctx.moveTo(sg[1], sg[2]); ctx.lineTo(sg[3], sg[4]); if (sg.length > 5) ctx.lineTo(sg[5], sg[6]); ctx.stroke();
      });
    }

    /* ---------------- the light-curve panel ---------------- */
    function drawLightCurvePanel(ctx) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(414, 37, 396, 275);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(414, 37, 396, 275);
      ctx.save(); ctx.translate(LC.x, LC.y);
      var top = -(LC.h + LC.top), bot = LC.bottom;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(-1, top, LC.w + 2, bot - top);
      var off = phaseOffset * LC.w;
      ctx.save(); ctx.beginPath(); ctx.rect(-1, top, LC.w + 2, bot - top); ctx.clip();
      // the observed light curve (three copies, under the model)
      if (dataset != null && DATA.complete && DATA.naturalWidth) {
        var di = DATA_NAMES.indexOf(dataset);
        if (di >= 0) {
          var dx0 = phaseOffset < 0.5 ? off : off - LC.w, sx = (di % 8) * 320, sy = Math.floor(di / 8) * 220;
          [-LC.w, 0, LC.w].forEach(function (k) { ctx.drawImage(DATA, sx, sy, 320, 220, dx0 + k, -220, 320, 220); });
        }
      }
      if (showCurve) {
        var r5 = -LC.h / lcMax, i0 = Math.floor(closestIndex), r10 = -(LC.w / N) * (closestIndex - i0);
        var starts = phaseOffset < 0.5 ? [off - LC.w, off, off + LC.w] : [off - 2 * LC.w, off - LC.w, off];
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.lineCap = "round";
        starts.forEach(function (x0) {
          ctx.beginPath();
          if (lcNoEclipse) { ctx.moveTo(x0, -LC.h); ctx.lineTo(x0 + LC.w, -LC.h); }
          else {
            ctx.moveTo(x0, r5 * lcFlux[i0]);
            for (var i = 0; i < N; i++) ctx.lineTo(x0 + r10 + i * LC.w / N, r5 * lcFlux[(i + i0) % N]);
            ctx.lineTo(x0 + LC.w, r5 * lcFlux[i0]);
          }
          ctx.stroke();
        });
      }
      // the cursor
      var cx = LC.w * ((phaseOffset + cursorPhase) % 1);
      ctx.strokeStyle = "#ff0000"; ctx.lineWidth = lcHover === "cursor" || (drag && drag.kind === "cursor") ? 2 : 1; ctx.lineCap = "butt";
      ctx.beginPath(); ctx.moveTo(cx, -221); ctx.lineTo(cx, 9); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.strokeRect(-1, top, LC.w + 2, bot - top);
      // phase ticks and labels (positionTimeTicks)
      var r6 = 10 * phaseOffset, r7 = Math.floor(r6), r3 = LC.w * (r6 - r7) / 10, r4 = (20 - r7) % 10, i;
      ctx.beginPath();
      for (i = 0; i < 10; i++) { var tx = r3 + 32 * i; ctx.moveTo(tx, -217); ctx.lineTo(tx, -212); ctx.moveTo(tx, 0); ctx.lineTo(tx, 5); }
      ctx.stroke();
      font(ctx, 10); ctx.fillStyle = "#000000";
      for (i = 0; i < 10; i++) FlashText.fillStatic(ctx, "0." + ((i + r4) % 10), r3 + i * 32 - 8.25, 4.75 + 2 + 10);
      font(ctx, 10, "bold"); FlashText.fillStatic(ctx, t("eb.phaseAxis"), 143.55 + 33.75 / 2 - FlashText.widthStatic(ctx, t("eb.phaseAxis")) / 2, 23.9 + 10);
      // flux ticks and labels
      ctx.beginPath();
      for (i = 0; i < 5; i++) { var ty = -200 + 50 * i; ctx.moveTo(-1, ty); ctx.lineTo(4, ty); ctx.moveTo(316, ty); ctx.lineTo(321, ty); }
      ctx.stroke();
      font(ctx, 10);
      [["1.0", 30.8, 2], ["0.75", 24.45, 52.05], ["0.5", 30.8, 102.1], ["0.25", 24.45, 152.15], ["0.0", 30.8, 202.2]].forEach(function (q) {
        FlashText.fillStatic(ctx, q[0], q[1] - 51.5, q[2] - 208.3 + 10);
      });
      font(ctx, 10, "bold");
      ctx.save(); ctx.translate(1.003113 * 10 + 2 - 51.5, 33.65 + 139.05 - 208.3); ctx.rotate(-Math.PI / 2);
      var fw = FlashText.widthStatic(ctx, t("eb.flux"));
      FlashText.fillStatic(ctx, t("eb.flux"), (128.65 - fw) / 2, 0); ctx.restore();
      ctx.restore();
    }

    /* ---------------- the HR Diagram window ---------------- */
    var HR = { tMin: 3000, tMax: 45000, lMin: 0.001, lMax: 1000000, w: 300, h: 200 };
    HR.xs = HR.w / Math.log(HR.tMax / HR.tMin); HR.ys = HR.h / Math.log(HR.lMax / HR.lMin);
    function hrX(T) { return HR.w - HR.xs * Math.log(T / HR.tMin); }
    function hrY(L) { return -HR.ys * Math.log(L / HR.lMin); }
    function hrT(x) { return HR.tMin * Math.exp((HR.w - x) / HR.xs); }
    function hrL(y) { return HR.lMin * Math.exp(-y / HR.ys); }
    function hrOrigin() { return { x: 425 + hrPos.x, y: 380 + hrPos.y }; }
    function drawHR(ctx) {
      var o = hrOrigin();
      ctx.save(); ctx.translate(o.x, o.y);
      ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = "#666666"; ctx.fillRect(0, 0, 400, 24);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(0, 0, 400, 300);
      ctx.save(); ctx.translate(380, 4); SwfShape.draw(ctx, ART.close); ctx.restore();
      font(ctx, 12, "bold"); ctx.fillStyle = "#ffffff"; FlashText.fillStatic(ctx, t("eb.hr"), 8, 3.95 + 12);
      ctx.translate(74.45, 244.05);
      if (HRBG.complete && HRBG.naturalWidth) ctx.drawImage(HRBG, 0, -200, 300, 200);
      ctx.strokeStyle = "#000000"; ctx.strokeRect(0, -200, 300, 200);
      ctx.beginPath(); [300, 243.4, 166.6, 89.8, 0].forEach(function (x) { ctx.moveTo(x, 0); ctx.lineTo(x, 4); });
      for (var k = 0; k < 10; k++) { var yy = -0.2 - 22.2 * k; ctx.moveTo(-4, yy); ctx.lineTo(0, yy); }
      ctx.stroke();
      font(ctx, 10); ctx.fillStyle = "#000000";
      [["3000", 287.45], ["5000", 230.45], ["10000", 150.5], ["20000", 73.5], ["45000", -17]].forEach(function (q) { FlashText.fillStatic(ctx, q[0], q[1], 8 + 10); });
      [["1000000", -51.75, -206.25], ["100000", -45.4, -184.05], ["10000", -39.05, -161.85], ["1000", -32.7, -139.65], ["100", -26.35, -117.45],
        ["10", -20, -95.25], ["1", -13.65, -73.05], ["0.1", -23.65, -50.85], ["0.01", -30, -28.65], ["0.001", -36.35, -6.45]].forEach(function (q) { FlashText.fillStatic(ctx, q[0], q[1], q[2] + 10); });
      font(ctx, 10, "bold");
      FlashText.fillStatic(ctx, t("eb.hrT"), 102.6 + (94.6 - FlashText.widthStatic(ctx, t("eb.hrT"))) / 2, 29 + 10);
      // "Luminosity (L  )" turned −90°, the ☉ (shape 192) set unrotated into the gap
      var lw = FlashText.widthStatic(ctx, t("eb.hrL")), lwEn = FlashText.widthStatic(ctx, "Luminosity (L");
      ctx.save(); ctx.translate(-64 + 1.003113 * 10, -55.3); ctx.rotate(-Math.PI / 2); FlashText.fillStatic(ctx, t("eb.hrL") + "  )", 0, 0); ctx.restore();
      ctx.save(); ctx.translate(-59.7, -140 - (lw - lwEn)); ctx.scale(1.011108, 1); SwfShape.draw(ctx, ART.sun); ctx.restore();
      // the plot area (masked)
      ctx.save(); ctx.beginPath(); ctx.rect(0, -200, 300, 200); ctx.clip();
      if (hrRanges) {
        ctx.fillStyle = "rgba(153,153,153,0.3)"; ctx.beginPath();
        ctx.rect(-10, -210, 320, 220);
        if (hrRanges.line) ctx.fill();
        else { ctx.moveTo(hrRanges.q[0][0], hrRanges.q[0][1]); hrRanges.q.slice(1).forEach(function (p) { ctx.lineTo(p[0], p[1]); }); ctx.closePath(); ctx.fill("evenodd"); }
        if (hrRanges.line) { ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hrRanges.q[0][0], hrRanges.q[0][1]); ctx.lineTo(hrRanges.q[3][0], hrRanges.q[3][1]); ctx.stroke(); }
      }
      if (showMS) { ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.beginPath(); MS.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); }
      var P = [null, [hrX(star[1].t), hrY(lum(1))], [hrX(star[2].t), hrY(lum(2))]];
      [1, 2].forEach(function (i) {
        var o2 = P[3 - i], dx = o2[0] - P[i][0], dy = o2[1] - P[i][1], d = Math.sqrt(dx * dx + dy * dy) || 1, f = 14 / d;
        ctx.fillStyle = "#ff0000"; ctx.beginPath(); ctx.arc(P[i][0], P[i][1], hrHover === i ? 4 : 3, 0, TAU); ctx.fill();
        font(ctx, 12); ctx.fillStyle = "#000000";
        FlashText.fill(ctx, String(i), P[i][0] - f * dx, P[i][1] - f * dy - 7.75 + ASC * 12, "center");
      });
      ctx.restore();
      ctx.restore();
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.save(); ctx.clearRect(0, 0, S.W, S.H); ctx.translate(0, OY);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 30, S.W, S.H);
      drawView(ctx);
      drawLightCurvePanel(ctx);
      if (hrOpen) drawHR(ctx);
      ctx.restore();
    });

    /* ---------------- the model's setters (unrestricted branches of the SWF's) ---------------- */
    function radiusRange(i) { var o = star[3 - i]; return [Math.max(RMIN, RfromTL(star[i].t, LMIN)), Math.min(RMAX, RfromTL(star[i].t, LMAX), sys.a * (1 - sys.e) - o.r)]; }
    function tempRange(i) { return [Math.max(TMIN, TfromLR(LMIN, star[i].r)), Math.min(TMAX, TfromLR(LMAX, star[i].r))]; }
    function sepRange() { return [Math.max(AMIN, (star[1].r + star[2].r) / (1 - sys.e)), AMAX]; }
    function eccRange() { return [EMIN, Math.min(EMAX, 1 - (star[1].r + star[2].r) / sys.a)]; }
    function changed(curve) { if (curve) lightCurve(); matchBtn.disabled = preset < 0; sync(); S.requestDraw(); }
    function setMass(i, m) { star[i].m = clamp(m, MMIN, MMAX); changed(false); }
    function setRadius(i, r) { var rg = radiusRange(i); star[i].r = clamp(r, rg[0], rg[1]); changed(true); }
    function setTemp(i, T) { var rg = tempRange(i); star[i].t = clamp(T, rg[0], rg[1]); changed(true); }
    function setSeparation(a) { var rg = sepRange(); sys.a = clamp(a, rg[0], rg[1]); changed(true); }
    function setEccentricity(e) { var rg = eccRange(); sys.e = clamp(e, rg[0], rg[1]); changed(true); }
    function setTempAndLuminosity(i, T, L) {
      T = clamp(T, TMIN, TMAX);
      var R = RfromTL(T, L), lo = Math.max(RMIN, RfromTL(T, LMIN)), lim = sys.a * (1 - sys.e) - star[3 - i].r, hi = Math.min(RMAX, RfromTL(T, LMAX), lim);
      if (lo > hi + 1e-8) { R = lim; T = TfromLR(LMIN, R); } else R = clamp(R, lo, hi);
      star[i].r = R; star[i].t = T; changed(true);
    }
    function setPhase(p) { cursorPhase = mod(p, 1); syncing = true; phaseCtl.set(cursorPhase); syncing = false; S.requestDraw(); }
    function applyPreset(idx) {                    // setParametersToMatch
      var p = SYSTEMS[idx];
      sys.a = p.a; sys.e = p.e; star[1].m = p.m1; star[2].m = p.m2;
      star[1].r = p.r1 === -1 ? 0.1 : p.a * p.r1; star[2].r = p.r2 === -1 ? 0.1 : p.a * p.r2;
      star[1].t = p.t1; star[2].t = p.t2;
      longitude = p.w; inclination = p.i;
      if (locked) { viewTheta = systemTheta(); viewPhi = systemPhi(); }
      lightCurve(); sync(); matchBtn.disabled = true; S.requestDraw();
    }

    /* ---------------- pointer: view, light curve, HR window ---------------- */
    var drag = null, lcHover = null, hrHover = null, hrRanges = null;
    function stagePt(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY }; }
    function hitTest(p) {
      if (hrOpen) {
        var o = hrOrigin(), lx = p.x - o.x, ly = p.y - o.y;
        if (lx >= 0 && lx <= 400 && ly >= 0 && ly <= 300) {
          if (lx >= 380 && lx <= 396 && ly >= 4 && ly <= 20) return { kind: "hrClose" };
          if (ly <= 24) return { kind: "hrBar" };
          var px = lx - 74.45, py = ly - 244.05;
          for (var i = 2; i >= 1; i--) { var dx = px - hrX(star[i].t), dy = py - hrY(lum(i)); if (dx * dx + dy * dy <= 4.5 * 4.5 && px >= 0 && px <= 300 && py >= -200 && py <= 0) return { kind: "hrPoint", id: i }; }
          return { kind: "hrBlock" };
        }
      }
      var lx2 = p.x - LC.x, ly2 = p.y - LC.y;
      if (lx2 >= -1 && lx2 <= LC.w + 1 && ly2 >= -217 && ly2 <= 5) {
        var cx = LC.w * ((phaseOffset + cursorPhase) % 1);
        if (Math.abs(lx2 - cx) <= 2.5) return { kind: "cursor" };
        return { kind: "lcBg" };
      }
      if (!locked && p.x >= 7 && p.x <= 407 && p.y >= 37 && p.y <= 437) return { kind: "view" };
      return null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = stagePt(ev), h = hitTest(p);
      if (!h || h.kind === "hrBlock") return;
      ev.preventDefault();
      if (h.kind === "hrClose") { hrOpen = false; S.requestDraw(); return; }
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (err) {}
      drag = { kind: h.kind, id: h.id, x0: p.x, y0: p.y, phase0: cursorPhase, off0: phaseOffset, th0: viewTheta, ph0: viewPhi, pos0: { x: hrPos.x, y: hrPos.y } };
      if (h.kind === "hrPoint") {
        var o = hrOrigin(); drag.dx = hrX(star[h.id].t) - (p.x - o.x - 74.45); drag.dy = hrY(lum(h.id)) - (p.y - o.y - 244.05);
        showRanges(h.id);
      }
      S.requestDraw();
    });
    function showRanges(i) {                       // MiniHRDiagram.showRanges
      var rr = radiusRange(i), f1 = Math.pow(TMAX / 5808.3, 4), f0 = 0.071168672, x4 = hrX(TMAX), x5 = HR.w;
      var q = [[x4, hrY(rr[0] * rr[0] * f1)], [x4, hrY(rr[1] * rr[1] * f1)], [x5, hrY(rr[1] * rr[1] * f0)], [x5, hrY(rr[0] * rr[0] * f0)]];
      hrRanges = { q: q, line: rr[0] === rr[1] };
    }
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stagePt(ev);
      if (drag) {
        if (drag.kind === "cursor") setPhase(drag.phase0 + (p.x - drag.x0) / LC.w);
        else if (drag.kind === "lcBg") { phaseOffset = mod(drag.off0 + (p.x - drag.x0) / LC.w, 1); S.requestDraw(); }
        else if (drag.kind === "view") {
          viewPhi = clamp(drag.ph0 - (57.29577951308232 * (drag.y0 - p.y)) / 400, -90, 90);
          viewTheta = drag.th0 - (57.29577951308232 * (p.x - drag.x0)) / 400; S.requestDraw();
        } else if (drag.kind === "hrBar") {
          hrPos.x = clamp(drag.pos0.x + p.x - drag.x0, -420, 392 - 5 - 401);
          hrPos.y = clamp(drag.pos0.y + p.y - drag.y0, -345, (444 - 380) - 301);
          S.requestDraw();
        } else if (drag.kind === "hrPoint") {
          var o = hrOrigin();
          setTempAndLuminosity(drag.id, hrT(drag.dx + p.x - o.x - 74.45), hrL(drag.dy + p.y - o.y - 244.05));
          showRanges(drag.id);
        }
        return;
      }
      var h = hitTest(p), lh = h && h.kind === "cursor" ? "cursor" : null, hh = h && h.kind === "hrPoint" ? h.id : null;
      if (lh !== lcHover || hh !== hrHover) { lcHover = lh; hrHover = hh; S.requestDraw(); }
      S.canvas.style.cursor = !h || h.kind === "hrBlock" ? "default" : h.kind === "hrClose" ? "pointer" : h.kind === "cursor" || h.kind === "lcBg" ? "ew-resize" : "move";
    });
    function release() { if (drag && drag.kind === "hrPoint") hrRanges = null; drag = null; S.requestDraw(); }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", release);

    /* ---------------- animation ---------------- */
    var loop = S.loop(function () {
      var now = performance.now();
      setPhase(cursorPhase + (now - timeLast) * speed);
      timeLast = now;
    });

    /* ---------------- the sidebar ---------------- */
    var syncing = false;
    function logSlider(key, lo, hi, sigs, get, set) {
      return S.slider({ labelKey: key, min: Math.log(lo) / Math.LN10, max: Math.log(hi) / Math.LN10, step: 0.0005, value: Math.log(get()) / Math.LN10,
        format: function (v) { return sigRound(Math.pow(10, v), sigs).s; },
        on: function (v) { if (!syncing) set(sigRound(Math.pow(10, v), sigs).v); } });
    }
    S.group("eb.presets");
    var opts = [{ v: "-1", labelKey: "eb.select" }];
    var presetCtl = S.select({ labelKey: "eb.presets", value: "-1", options: opts, on: function (v) {
      preset = +v; dataset = preset >= 0 ? SYSTEMS[preset].name : null;
      if (preset >= 0) applyPreset(preset); else { matchBtn.disabled = true; S.requestDraw(); }
      noteEl.textContent = preset >= 0 ? (SYSTEMS[preset].comment || "") : "";
    } });
    (function fillPresets() {                      // headed groups, as the SWF's combo box lists them
      var sel = presetCtl && S.canvas.closest(".sim-layout").querySelector(".sim-controls select");
      function group(key, from, to) {
        var og = document.createElement("optgroup"); og.setAttribute("data-i18n-label", key); og.label = t(key);
        for (var i = from; i < to; i++) { var o = document.createElement("option"); o.value = String(i); o.textContent = (i + 1) + ". " + SYSTEMS[i].name; og.appendChild(o); }
        sel.appendChild(og);
      }
      group("eb.g1", 0, COMPLETE); group("eb.g2", COMPLETE, INCOMPLETE); group("eb.g3", INCOMPLETE, EXTRA); group("eb.g4", EXTRA, SYSTEMS.length);
      S.refreshers.push(function () { Array.prototype.forEach.call(sel.querySelectorAll("optgroup"), function (og) { og.label = t(og.getAttribute("data-i18n-label")); }); });
    })();
    var matchBtn = S.button({ labelKey: "eb.match", on: function () { if (preset >= 0) applyPreset(preset); } });
    matchBtn.disabled = true;
    var noteEl = document.createElement("div"); noteEl.className = "ctl"; noteEl.style.cssText = "font-size:12px;opacity:.75;line-height:1.35";
    S.canvas.closest(".sim-layout").querySelector(".sim-controls").appendChild(noteEl);

    var ctls = {};
    [1, 2].forEach(function (i) {
      S.group("eb.star" + i);
      ctls["m" + i] = logSlider("eb.mass", MMIN, MMAX, 2, function () { return star[i].m; }, function (v) { setMass(i, v); });
      ctls["r" + i] = logSlider("eb.radius", RMIN, RMAX, 2, function () { return star[i].r; }, function (v) { setRadius(i, v); });
      ctls["t" + i] = logSlider("eb.temp", TMIN, TMAX, 3, function () { return star[i].t; }, function (v) { setTemp(i, v); });
    });
    S.group("eb.system");
    ctls.a = S.slider({ labelKey: "eb.sep", min: Math.log(AMIN) / Math.LN10, max: Math.log(AMAX) / Math.LN10, step: 0.0005, value: 1,
      format: function (v) { return fixRound(Math.pow(10, v), 2).s; },
      on: function (v) { if (!syncing) setSeparation(fixRound(Math.pow(10, v), 2).v); } });
    ctls.e = S.slider({ labelKey: "eb.ecc", min: EMIN, max: EMAX, step: 0.01, value: 0.3,
      format: function (v) { return flashToFixed(v, 2); }, on: function (v) { if (!syncing) setEccentricity(fixRound(v, 2).v); } });
    S.group("eb.orient");
    ctls.lon = S.slider({ labelKey: "eb.long", min: 0, max: 360, step: 0.1, value: 150, format: function (v) { return flashToFixed(v, 1); },
      on: function (v) { if (syncing) return; longitude = fixRound(v, 1).v; if (locked) viewTheta = systemTheta(); changed(true); } });
    ctls.inc = S.slider({ labelKey: "eb.incl", min: 0, max: 90, step: 0.01, value: 80, format: function (v) { return flashToFixed(v, 2); },
      on: function (v) { if (syncing) return; inclination = fixRound(v, 2).v; if (locked) viewPhi = systemPhi(); changed(true); } });
    S.group("eb.anim");
    var animBtn = S.button({ labelKey: "eb.start", primary: true, on: function () { toggleAnimation(); } });
    var speedCtl = S.slider({ labelKey: "eb.speed", min: Math.log(2e-5) / Math.LN10, max: Math.log(0.001) / Math.LN10, step: 0.001, value: -4,
      format: function (v) { return fmt("eb.secPerOrbit", { s: flashString(sigDigits(1 / (1000 * Math.pow(10, v)), 2)) }); },
      on: function (v) { speed = sigRound(Math.pow(10, v), 3).v; } });
    var phaseCtl = S.slider({ labelKey: "eb.phase", min: 0, max: 1, step: 0.01, value: 0.7, format: function (v) { return flashToFixed(v, 2); },
      on: function (v) { if (!syncing) { cursorPhase = mod(v, 1); S.requestDraw(); } } });
    var lockCtl = S.toggle({ labelKey: "eb.lock", value: true, on: function (v) {
      locked = v; if (v) { viewTheta = systemTheta(); viewPhi = systemPhi(); } } });
    var pathsCtl = S.toggle({ labelKey: "eb.paths", value: true, on: function (v) { showPaths = v; } });
    var planeCtl = S.toggle({ labelKey: "eb.plane", value: true, on: function (v) { showPlane = v; } });
    var lcCtl = S.toggle({ labelKey: "eb.lc", value: true, on: function (v) { showCurve = v; } });
    S.button({ labelKey: "eb.showHR", on: function () { hrOpen = true; S.requestDraw(); } });
    var msCtl = S.toggle({ labelKey: "eb.ms", value: false, on: function (v) { showMS = v; } });
    S.button({ labelKey: "eb.reset", on: function () { onReset(); } });

    function toggleAnimation() {
      animating = !animating;
      if (animating) { timeLast = performance.now(); loop.play(); } else loop.pause();
      animBtn.setAttribute("data-i18n", animating ? "eb.pause" : "eb.start"); animBtn.textContent = t(animating ? "eb.pause" : "eb.start");
    }
    function sync() {
      syncing = true;
      [1, 2].forEach(function (i) {
        ctls["m" + i].set(Math.log(star[i].m) / Math.LN10); ctls["r" + i].set(Math.log(star[i].r) / Math.LN10); ctls["t" + i].set(Math.log(star[i].t) / Math.LN10);
      });
      ctls.a.set(Math.log(sys.a) / Math.LN10); ctls.e.set(sys.e); ctls.lon.set(longitude); ctls.inc.set(inclination);
      syncing = false;
    }
    function onReset() {
      if (animating) toggleAnimation();
      hrOpen = false; hrPos = { x: -412, y: -294.05 };
      speedCtl.set(-4);
      star[1] = { m: 1, r: 1.5, t: 8700 }; star[2] = { m: 1, r: 1.5, t: 5000 }; sys = { a: 10, e: 0.3 };
      longitude = 150; inclination = 80;
      lcCtl.set(true); lockCtl.set(true); pathsCtl.set(true); planeCtl.set(true);
      viewTheta = systemTheta(); viewPhi = systemPhi();
      phaseOffset = 0.5; preset = -1; dataset = null; presetCtl.set("-1");
      lightCurve(); sync(); setPhase(0.7);
    }
    onReset();
  }
});
