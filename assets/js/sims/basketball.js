/* Basketball Phases Simulator ---------------------------------------------------------
   Faithful rebuild of ClassAction's "basketball.swf" (Lunar Cycles), from its decompiled
   ActionScript: the 'animation' clip's onEnterFrame, eye_clip (the eye dragged or animated
   round a 250-unit orbit, its _time running at the slider's degrees per millisecond),
   BasketballRotator (79 photographs of the ball, one per 360°/79 of viewing direction,
   under a 70 % black overlay whose terminator is the SWF's half-ellipse of five quadratic
   curves, x-scaled by cos φ), Slider v2, and the Flash MX radio and push buttons — laid
   out as the SWF places them, with its vignette panels, light arrows and vector ball and
   eye redrawn from the SWF's own shapes (tools/swf-inspect.py canvas).

   The 79 photographs ship as one 10 × 8 sprite sheet (assets/img/sims/basketball-views.jpg,
   re-encoded 4:4:4 from the SWF's JPEGs). The animated ClassAction logo in the corner is
   left out; the page carries the credits. Beyond the SWF: pressing anywhere on the orbit
   circle moves the eye there (the SWF only drags the eye itself), and the eye moves at
   the display's frame rate rather than the SWF's 12 fps, at the same angular speed.
   Text is set as Ruffle sets the SWF's (sims/_flashtext.js): unkerned, advances floored to a twip. */
Sim.create({
  id: "basketball",
  width: 720, height: 430,
  strings: {
    en: {
      "bb.view": "View of Ball", "bb.light": "Light", "bb.manual": "Move Eye Manually",
      "bb.animate": "Animate Eye", "bb.withPh": "With Phases", "bb.noPh": "No Phases",
      "bb.speed": "Speed of Animation", "bb.slow": "Slow", "bb.fast": "Fast",
      "bb.hide": "Hide Basketball", "bb.show": "Show Basketball",
      "bb.eye": "Eye", "bb.pos": "eye position", "bb.mode": "eye", "bb.phases": "phases",
      "bb.speedS": "speed of animation", "bb.ball": "basketball in the view",
      "bb.degps": "°/s", "bb.reset": "Reset",
      "bb.hint": "Drag the eye around the ball, or press anywhere on the circle to move it there. The View of Ball panel shows what the eye sees."
    },
    id: {
      "bb.view": "Tampilan Bola", "bb.light": "Cahaya", "bb.manual": "Gerakkan Mata Manual",
      "bb.animate": "Animasikan Mata", "bb.withPh": "Dengan Fase", "bb.noPh": "Tanpa Fase",
      "bb.speed": "Kecepatan Animasi", "bb.slow": "Lambat", "bb.fast": "Cepat",
      "bb.hide": "Sembunyikan Bola", "bb.show": "Tampilkan Bola",
      "bb.eye": "Mata", "bb.pos": "posisi mata", "bb.mode": "mata", "bb.phases": "fase",
      "bb.speedS": "kecepatan animasi", "bb.ball": "bola basket pada tampilan",
      "bb.degps": "°/d", "bb.reset": "Atur ulang",
      "bb.hint": "Seret mata mengelilingi bola, atau tekan di mana saja pada lingkaran untuk memindahkannya ke sana. Panel Tampilan Bola menunjukkan apa yang dilihat mata."
    }
  },
  about: {
    en: "<p>Why does the Moon go through phases? This simulator is the classroom demonstration with a basketball and a lamp. The light comes from the left, so the half of the ball that faces it is always lit, wherever you stand. What changes as you walk around the ball is how much of that lit half you can see.</p>" +
        "<p>Drag the eye around the ball, or choose <b>Animate Eye</b>, and watch the <b>View of Ball</b> panel. Seen from the side of the light the ball looks full; from the far side it looks new, a dark ball; from either side you see it half lit, like a quarter Moon, and in between as a crescent or a gibbous ball. The photographs turn with your viewpoint, so the ball's own markings show that you are looking at it from a different direction each time.</p>" +
        "<p>The Moon works the same way: the Sun always lights the half facing it, and as the Moon orbits Earth we see different amounts of that sunlit half. With <b>No Phases</b> the ball is lit evenly from every side and looks full from everywhere, which shows why phases are not caused by Earth's shadow falling on the Moon.</p>",
    id: "<p>Mengapa Bulan mengalami fase? Simulator ini adalah peragaan kelas dengan bola basket dan lampu. Cahaya datang dari kiri, sehingga separuh bola yang menghadap cahaya selalu terang, di mana pun Anda berdiri. Yang berubah ketika Anda berjalan mengelilingi bola adalah berapa banyak bagian terang itu yang dapat Anda lihat.</p>" +
        "<p>Seret mata mengelilingi bola, atau pilih <b>Animasikan Mata</b>, dan perhatikan panel <b>Tampilan Bola</b>. Dilihat dari sisi cahaya, bola tampak penuh; dari sisi seberangnya tampak gelap seperti bulan baru; dari samping tampak separuh terang seperti Bulan kuartir, dan di antaranya berbentuk sabit atau cembung. Foto-fotonya berputar mengikuti sudut pandang Anda, sehingga tanda-tanda pada bola menunjukkan bahwa Anda melihatnya dari arah yang berbeda setiap kali.</p>" +
        "<p>Bulan pun demikian: Matahari selalu menerangi separuh Bulan yang menghadapnya, dan saat Bulan mengorbit Bumi kita melihat bagian terang itu dalam jumlah yang berbeda-beda. Dengan <b>Tanpa Fase</b> bola diterangi merata dari segala arah dan tampak penuh dari mana pun, yang menunjukkan bahwa fase tidak disebabkan oleh bayangan Bumi yang jatuh ke Bulan.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var SANS = "Arial, Helvetica, sans-serif", VERDANA = "Verdana, Geneva, sans-serif";
    var COMIC = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', cursive";
    var ANIM = { a: 0.720001, d: 0.716675, x: 288, y: 215 };     // the 'animation' clip on the stage

    /* ---- the SWF's numbers ---- */
    var FRAMES = 79, R_ORBIT = 250;                 // BasketballRotator._frames, eye_clip radius
    var R_BALL = 86, MARGIN = 10, DARK = 0.7;       // _radius, _margin, initDarkAlpha 70
    var TA = [], TC = [];                            // the terminator's anchors and controls
    (function () {
      var step = Math.PI / 4, cRad = R_BALL / Math.cos(step / 2);
      for (var i = 0; i < 5; i++) {
        TA.push({ x: R_BALL * Math.sin(i * step), y: -R_BALL * Math.cos(i * step) });
        var a2 = step / 2 + (i - 1) * step;
        TC.push({ x: cRad * Math.sin(a2), y: -cRad * Math.cos(a2) });
      }
    })();
    var SPEED_MIN = 0.01, SPEED_MAX = 0.1, PX_PER_UNIT = 160 / (SPEED_MAX - SPEED_MIN);

    /* ---- layout, in the 'animation' clip's coordinates ---- */
    var PANELS = [                                   // mask rect; vignette shape and its matrix
      { clip: [-400, -300, 300, 300], m: [1.166672, 1.000015, -50, 0], rect: [-300, -300, 300, 300], bands: [
        [83.05, "#f2f2f2", 145.45], [83.05, "#f1f1f1", 162], [83.05, "#f0f0f0", 178.5], [83.05, "#eeeeee", 195.05],
        [259.85, "#ededed"], [226.8, "#ececec"], [193.7, "#ebebeb"], [160.65, "#eaeaea"], [127.55, "#e9e9e9"],
        [94.5, "#e8e8e8"], [61.4, "#e7e7e7"], [28.35, "#e6e6e6"], [26.3, "#e2e2e2"], [24.3, "#dfdfdf"],
        [22.25, "#dbdbdb"], [20.25, "#d7d7d7"], [18.2, "#d4d4d4"], [16.2, "#d0d0d0"], [14.15, "#cccccc"],
        [12.15, "#c9c9c9"], [10.1, "#c5c5c5"], [8.1, "#c1c1c1"], [6.05, "#bebebe"], [4.05, "#bababa"],
        [2.0, "#b6b6b6"], [1.0, "#b3b3b3"]] },
      { clip: null, m: [1, 1.122742, 449.15, -164.05], rect: [-149.75, -121.1, 149.75, 121.05], bands: [
        [179.0, "#f2f2f2"], [164.45, "#f1f1f1"], [149.9, "#f0f0f0"], [135.3, "#eeeeee"], [120.75, "#ededed"],
        [106.2, "#ececec"], [91.65, "#ebebeb"], [77.1, "#eaeaea"], [62.5, "#e9e9e9"], [47.95, "#e8e8e8"],
        [33.4, "#e7e7e7"], [18.85, "#e6e6e6"], [16.75, "#e3e3e3"], [14.65, "#e0e0e0"], [12.55, "#dddddd"],
        [10.45, "#dbdbdb"], [8.35, "#d8d8d8"], [6.25, "#d5d5d5"], [4.15, "#d2d2d2"], [2.05, "#cfcfcf"], [1.0, "#cccccc"]] },
      { clip: null, m: [1, 0.915161, 449.75, 135.95], rect: [-150.15, -179.3, 150.2, 179.25], bands: [
        [217.5, "#f2f2f2"], [200.1, "#f1f1f1"], [182.75, "#f0f0f0"], [165.4, "#eeeeee"], [148.0, "#ededed"],
        [130.65, "#ececec"], [113.3, "#ebebeb"], [95.95, "#eaeaea"], [78.55, "#e9e9e9"], [61.2, "#e8e8e8"],
        [43.85, "#e7e7e7"], [26.5, "#e6e6e6"], [24.45, "#e2e2e2"], [22.4, "#dedede"], [20.35, "#dadada"],
        [18.3, "#d6d6d6"], [16.3, "#d2d2d2"], [14.25, "#cecece"], [12.2, "#cacaca"], [10.15, "#c6c6c6"],
        [8.15, "#c2c2c2"], [6.1, "#bfbfbf"], [4.05, "#bbbbbb"], [2.0, "#b7b7b7"], [1.0, "#b3b3b3"]] }
    ];
    var ROTATOR = { x: 470, y: -177.8, sx: 0.893387, sy: 0.893326 };
    var RADIO_GROUPS = [                             // man_auto and phaseRadio, two FRadioButtons each
      { x: 330.4, y: 0, sx: 1.606873, sy: 1.605545, keys: ["bb.manual", "bb.animate"], id: "mode" },
      { x: 330, y: 99.2, sx: 1.606232, sy: 1.60582, keys: ["bb.withPh", "bb.noPh"], id: "phase" }
    ];
    var LIGHT = { x: -330.85, y: 4.2 };             // myLight: four arrows and the label
    var SLIDER = { x: 456.45, y: 229.85, sx: 1.408737, sy: 1.409515 };
    var BUTTON = { x: 390.95, y: -69.15, s: 1.199722, w: 130, h: 20 };   // hide_show, FPushButton 130 × 20
    var VIEW_TEXT = [-0.00444, -0.999802, 0.999802, -0.00444, 325.2, -88.95];
    var SMITH = [-0.063782, -0.372345, 0.384888, 0.135513, 33.7, 1.75];
    var SHADOW_M = [-0.544662, 0.000198, -0.000198, -0.575409, 2.55, 0.05];

    /* ---- the SWF's own art ---- */
    function P(d) { return new Path2D(d); }
    var BALL = [                                     // shape 252, the ball at the orbit's centre
      { p: P("M-43.85 18.25Q-40.4 26.7 -34.05 33.25Q-27.65 39.8 -19.45 43.4Q-10.9 47.1 -1.55 47.1Q7.8 47.1 16.35 43.4Q24.6 39.8 30.95 33.25Q37.3 26.7 40.8 18.25Q44.4 9.45 44.4 -0.2Q44.4 -9.8 40.8 -18.6Q37.3 -27.1 30.95 -33.65Q24.6 -40.15 16.35 -43.75Q7.8 -47.5 -1.55 -47.5Q-10.9 -47.5 -19.45 -43.75Q-27.65 -40.15 -34.05 -33.65Q-40.4 -27.1 -43.85 -18.6Q-47.5 -9.8 -47.5 -0.2Q-47.5 9.45 -43.85 18.25Z"),
        g: { t: "r", m: [0.064056, 0, 0, 0.065948, -1.6, -0.2], s: [[0, "#ef9c00"], [0.5373, "#ef7b00"], [1, "#ef6300"]] } },
      { p: P("M-2.6 -5Q-2.6 0.05 -4.2 47.1L-1.45 47.5L-0.5 -4.8Q-0.5 -10.8 0.7 -47.05L-2.05 -47.4L-2.6 -5Z"),
        g: { t: "r", m: [0.056274, 0, 0, 0.057938, -1.75, 0.1], s: [[0, "#b3b3b3"], [0.7882, "#000000"], [1, "#000000"]] } },
      { p: P("M-6.65 -0.2L43.95 1.4L44.4 -1.4L-6.45 -2.35L-47.2 -0.15L-47.45 2.25L-6.65 -0.2Z"),
        g: { t: "r", m: [0.056107, 0, 0, 0.05777, -1.55, -0.05], s: [[0, "#b3b3b3"], [0.7255, "#000000"], [1, "#000000"]] } },
      { p: P("M34.7 -29.1Q20.95 -17.1 -1.1 -16.15Q-19.2 -15.4 -37.55 -29.75L-38.8 -27.5Q-26.3 -13.3 -1.1 -13.65Q22.75 -13.95 36.55 -26.55L34.7 -29.1Z"),
        g: { t: "r", m: [0.046494, 0, 0, 0.047867, -1.15, -21.65], s: [[0, "#999999"], [1, "#000000"]] } },
      { p: P("M-1.45 13.45Q-26.6 13.15 -39.1 27.35L-37.85 29.55Q-19.5 15.25 -1.45 16Q20.65 16.95 34.4 28.9L36.25 26.4Q22.45 13.8 -1.45 13.45Z"),
        g: { t: "r", m: [0.046494, 0, 0, 0.047867, -1.45, 21.55], s: [[0, "#999999"], [1, "#000000"]] } },
      { p: P("M-15.1 44.45L-15.35 45L-6.95 46.35L-6.95 45.75L-6.9 44.45Q-6.55 44.05 -4.6 43.9L-4.6 42.5L-15.1 44.45Z"), fill: "#000000", stroke: 1 },
      { p: P("M-8.85 46.55L-8.85 44.75L-12.7 45.45L-8.85 46.55Z"), fill: "#ef6300" }
    ];
    var MARKS = P("M42.15 15.65L41.65 15.35L41.4 16.25L40.95 16.95Q40.65 16.45 40.3 12.9Q41.05 13.6 42.5 14.35L42.15 15.65Z" +
      "M43.15 10.55L40.4 9.4L40.25 10L39.7 10.95L39.05 6.9Q40.05 7.9 41.3 8.55L43.45 9.4L43.15 10.55Z");   // shape 255
    var EYE = [                                      // shape 256, drawn at 50 %
      { p: P("M-41 4.4L16 31.4Q32 3.4 22 -19.6Q12 -42.6 -41 4.4Z"),
        g: { t: "r", m: [0.074585, 0, 0, 0.074585, 20, 1.5], s: [[0, "#ffffff"], [1, "#f1e8e1"]] } },
      { p: P("M-42 4.4Q16.95 -20.95 26 -26.6Q28.5 -28.15 27.75 -28.55L23.5 -30.1Q14.35 -34.7 12 -51.6Q8 -80.6 -42 4.4Z"),
        g: { t: "l", m: [0.016068, 0.016647, 0.035065, -0.033859, -2.7, -19.75], s: [[0, "#e6e6e6"], [0.1294, "#e6e6e6"], [1, "#b58865"]] } },
      { p: P("M-41.5 2.9Q19.9 68.4 21 57.4Q21.6 51.5 21.4 48L21 40.4Q21 38.65 21.9 36.8L23.5 33.95Q24.4 32.5 24.4 31.6Q24.4 30.45 23 29.4Q19 26.4 -41.5 2.9Z"),
        g: { t: "l", m: [0.011093, -0.011902, -0.037155, -0.034653, 0.6, 29.35], s: [[0, "#e6e6e6"], [0.102, "#e6e6e6"], [1, "#b58865"]] } },
      { p: P("M20 -23.6Q34.85 -23.7 35 -34.6M11 -18.6Q25.1 -18.7 26 -29.6M1 -14.6Q14.5 -13.45 16 -25.6M-7 -10.6Q7 -9.6 8 -21.6M-16 -6.6Q-3.9 -5.1 -1 -17.6"), line: 1 },
      { p: P("M15 18.05Q16.35 24.25 18.25 24.15Q19.25 24.1 20.7 22.5Q22.3 20.8 23.7 18.1Q27.3 11.3 27.3 3.45Q27.3 -4.5 23.75 -11.85Q22.3 -14.8 20.75 -16.65Q19.25 -18.45 18.25 -18.5Q16.35 -18.55 15 -12.25Q13.65 -5.95 13.65 2.95Q13.65 11.85 15 18.05Z"),
        g: { t: "r", m: [0.03009, 0, 0, 0.03009, 26.2, 3.75], s: [[0, "#b58865"], [1, "#573b25"]] } },
      { p: P("M23.25 -4.7Q22.55 -1.55 22.55 2.9Q22.55 7.3 23.25 10.45Q23.9 13.55 24.85 13.5Q25.8 13.4 26.65 10Q27.45 6.45 27.5 2.15Q27.5 -2.05 26.65 -5Q25.85 -7.8 24.85 -7.85Q23.9 -7.85 23.25 -4.7Z"), fill: "#000000" },
      { p: P("M27 -28.6Q41 -29.45 42 -39.6M23.75 29.9Q29.5 26.9 33.5 37.9M15.75 26.9Q21.5 23.9 25.5 34.9M7.75 22.9Q13.5 19.9 17.5 30.9M-1.25 19.9Q4.5 16.9 8.5 27.9"), line: 1 }
    ];
    var SHADOW = { p: P("M1.7 -81.5Q-2.25 -45.45 -1.55 1.05Q-0.85 47.55 7.05 82.6Q-13.15 82.4 -29.25 75.65Q-44.7 69.1 -56.75 57.45Q-68.9 45.75 -75.6 30.95Q-82.5 15.55 -82.5 -0.9Q-82.5 -17.5 -75.8 -32.7Q-69.3 -47.3 -57.45 -58.6Q-45.65 -69.95 -30.3 -76.1Q-14.4 -82.55 3 -82.5L1.7 -81.5Z"),
      g: { t: "r", m: [0.121628, 0, 0, 0.115997, -2.25, 3.6], s: [[0, "#b3b3b3"], [1, "#4c4c4c"]] } };   // shape 260
    var ARROW = P("M35.75 4.2L38.9 4.2Q40.3 4.25 44.65 2.2Q48.9 0.2 49.2 -0.6L42.9 -2.8L38.4 -4.2L36.35 -4.2Q35.9 -3.35 36.3 -1.5" +
      "L-49.2 -1.5L-48.7 1.55L36.75 1.55Q36.45 1.75 35.75 4.2Z");                       // shape 240, tinted #ffcc00
    var GRABBER = P("M-3 -9.3L3 -9.3Q4.65 -9.3 5.8 -8.15Q7 -6.95 7 -5.3L7 6.7Q7 7.4 3.6 10.65L0.2 13.75Q-7 7.8 -7 6.7L-7 -5.3" +
      "Q-7 -6.9 -5.85 -8.15Q-4.6 -9.3 -3 -9.3Z");                                       // shape 237
    var GRIP = P("M-2.8 0.1L2.7 0.1M-2.8 -4.5L2.7 -4.5M-2.8 4.7L2.7 4.7");
    var TRACK = P("M80 11.5L80 13.5L80 15.5M-80 15.5L-80 13.5L-80 11.5M-80 13.5L80 13.5");   // shape 233
    var GROOVES = [                                  // shape 272: two engraved rules
      { p: P("M327.35 84.1L579.15 84.1Q581.2 84.1 582.7 83.15Q584.15 82.2 584.15 80.85Q584.15 79.5 582.7 78.55Q581.2 77.6 579.15 77.6L327.35 77.6Q325.3 77.6 323.8 78.55Q322.35 79.5 322.35 80.85Q322.35 82.2 323.8 83.15Q325.3 84.1 327.35 84.1Z"),
        g: { t: "l", m: [0, 0.003998, 0.15976, 0, 453.2, 80.85], s: [[0, "#808080"], [1, "#f3f3f3"]] } },
      { p: P("M325.2 187.35L577 187.35Q579.05 187.35 580.55 186.4Q582 185.45 582 184.1Q582 182.75 580.55 181.8Q579.05 180.85 577 180.85L325.2 180.85Q323.15 180.85 321.65 181.8Q320.2 182.75 320.2 184.1Q320.2 185.45 321.65 186.4Q323.15 187.35 325.2 187.35Z"),
        g: { t: "l", m: [0, 0.003998, 0.15976, 0, 451.05, 184.1], s: [[0, "#808080"], [1, "#f3f3f3"]] } }
    ];

    /* ------------------------------------------------ state */
    var time = 0, angle = 0;                         // eye_clip._time and angle (degrees)
    var animate = false, withPhases = true, hidden = false, speed = 0.05;
    var sheet = new Image();
    sheet.onload = function () { S.requestDraw(); };
    sheet.src = "../assets/img/sims/basketball-views.jpg";

    function mod(n, m) { return n < 0 ? (n % m) + m : n % m; }       // BasketballRotator.mod
    function setAngle(a) { angle = mod(a, 360); time = angle; changed(); }
    function frameOf(a) { return mod(Math.floor(a * RAD / (TAU / FRAMES)), FRAMES); }   // setLongitude
    function phaseOf() {                             // setSunAngle(withShad ? angle : 0)
      return RAD * mod(-(withPhases ? angle : 0) + 180, 360);
    }
    function reset() {
      time = 0; angle = 0; animate = false; withPhases = true; hidden = false; speed = 0.05;
      changed();
    }

    /* ------------------------------------------------ sidebar */
    var controlsEl = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    function last(sel) { var all = controlsEl.querySelectorAll(sel); return all[all.length - 1]; }
    var syncing = false;
    function t(key) { return I18N.t(key); }
    S.group("bb.eye");
    var angSl = S.slider({ labelKey: "bb.pos", min: 0, max: 359, step: 1, value: 0,
      format: function (v) { return Math.round(v) + "°"; },
      on: function (v) { if (!syncing) setAngle(v); } });
    S.select({ labelKey: "bb.mode", value: "manual",
      options: [{ v: "manual", labelKey: "bb.manual" }, { v: "anim", labelKey: "bb.animate" }],
      on: function (v) { if (!syncing) { animate = v === "anim"; changed(); } } });
    var modeEl = last("select");
    S.select({ labelKey: "bb.phases", value: "with",
      options: [{ v: "with", labelKey: "bb.withPh" }, { v: "none", labelKey: "bb.noPh" }],
      on: function (v) { if (!syncing) { withPhases = v === "with"; changed(); } } });
    var phEl = last("select");
    var spSl = S.slider({ labelKey: "bb.speedS", min: SPEED_MIN, max: SPEED_MAX, step: 0.001, value: speed,
      format: function (v) { return Math.round(v * 1000) + " " + t("bb.degps"); },
      on: function (v) { if (!syncing) { speed = v; changed(); } } });
    var ballTog = S.toggle({ labelKey: "bb.ball", value: true,
      on: function (b) { if (!syncing) { hidden = !b; changed(); } } });
    S.button({ labelKey: "bb.reset", on: reset });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "bb.hint");
    controlsEl.appendChild(hint);
    function syncSidebar() {
      syncing = true;
      angSl.set(Math.round(angle) % 360);
      modeEl.value = animate ? "anim" : "manual";
      phEl.value = withPhases ? "with" : "none";
      spSl.set(speed); ballTog.set(!hidden);
      syncing = false;
    }
    function changed() { syncSidebar(); S.requestDraw(); wake(); }

    /* ------------------------------------------------ the eye's clock (eye_clip.onEnterFrame) */
    var rafId = 0, lastT = 0;
    function wake() {
      if (!rafId && animate) { lastT = performance.now(); rafId = requestAnimationFrame(tick); }
    }
    function tick(now) {
      rafId = 0;
      if (!animate) return;
      var dt = Math.min(now - lastT, 250); lastT = now;
      time += dt * speed; angle = time % 360;
      S.requestDraw();
      if (Math.round(angle) % 360 !== +angSl.input.value) { syncing = true; angSl.set(Math.round(angle) % 360); syncing = false; }
      rafId = requestAnimationFrame(tick);
    }

    /* ------------------------------------------------ canvas interaction */
    var hover = null, press = null;
    function at(ev) {                                // → the animation clip's coordinates
      var r = S.canvas.getBoundingClientRect();
      var sx = (ev.clientX - r.left) * S.W / r.width, sy = (ev.clientY - r.top) * S.H / r.height;
      return { x: (sx - ANIM.x) / ANIM.a, y: (sy - ANIM.y) / ANIM.d };
    }
    function eyePos() { return { x: -R_ORBIT * Math.cos(angle * RAD), y: -R_ORBIT * Math.sin(angle * RAD) }; }
    function textW(str, size, bold) { S.ctx.font = (bold ? "bold " : "") + size + "px " + SANS; return FlashText.width(S.ctx, str); }
    function grabberX() { return (speed - SPEED_MIN) * PX_PER_UNIT - 80; }
    function hit(p) {
      var e = eyePos(), c = Math.cos(-angle * RAD), s = Math.sin(-angle * RAD);
      var dx = p.x - e.x, dy = p.y - e.y, lx = (dx * c - dy * s) / 0.630692, ly = (dx * s + dy * c) / 0.627121;
      if (lx > -42 && lx < 42.5 && ly > -59 && ly < 59) return { kind: "eye" };
      for (var g = 0; g < RADIO_GROUPS.length; g++) {
        var G = RADIO_GROUPS[g], gx = (p.x - G.x) / G.sx, gy = (p.y - G.y) / G.sy;
        for (var i = 0; i < 2; i++) {
          if (gx >= 0 && gx <= 13 + textW(t(G.keys[i]), 12) && gy >= 25 * i - 2 && gy <= 25 * i + 14) return { kind: "radio", g: G, i: i };
        }
      }
      var bx = (p.x - BUTTON.x) / BUTTON.s, by = (p.y - BUTTON.y) / BUTTON.s;
      if (bx >= 0 && bx <= BUTTON.w && by >= 0 && by <= BUTTON.h) return { kind: "button" };
      var sx = (p.x - SLIDER.x) / SLIDER.sx, sy = (p.y - SLIDER.y) / SLIDER.sy;
      if (Math.abs(sx - grabberX()) <= 7.5 && sy >= 11.15 - 9.8 && sy <= 11.15 + 14.25) return { kind: "grab", sx: sx };
      if (Math.abs(Math.hypot(p.x, p.y) - R_ORBIT) <= 14) return { kind: "orbit" };
      return null;
    }
    var CURSORS = { eye: "grab", orbit: "pointer", radio: "pointer", button: "pointer", grab: "ew-resize" };
    function setHover(h) {
      var key = h ? h.kind + (h.g ? h.g.id + h.i : "") : "", was = hover ? hover.kind + (hover.g ? hover.g.id + hover.i : "") : "";
      hover = h;
      if (!press) S.canvas.style.cursor = (h && CURSORS[h.kind]) || "default";
      if (key !== was) S.requestDraw();
    }
    function dragEye(p) {                            // the_eye.onMouseMove
      var a = Math.atan2(p.y, p.x) * DEG;
      angle = mod(180 + a, 360); time = 180 + a;
      changed();
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      if (!h) return;
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic events */ }
      press = { kind: h.kind, g: h.g, i: h.i, inside: true };
      if (h.kind === "orbit") { press.kind = "eye"; dragEye(p); }
      else if (h.kind === "grab") press.off = grabberX() - h.sx;
      if (press.kind === "eye") S.canvas.style.cursor = "grabbing";
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) { setHover(hit(p)); return; }
      if (press.kind === "eye") dragEye(p);
      else if (press.kind === "grab") {             // Slider v2's grabber.onMouseMove
        var x = Math.max(-80, Math.min(80, (p.x - SLIDER.x) / SLIDER.sx + press.off));
        speed = (x + 80) / PX_PER_UNIT + SPEED_MIN;
        changed();
      } else {
        var h = hit(p), inside = !!h && h.kind === press.kind && h.g === press.g && h.i === press.i;
        if (inside !== press.inside) { press.inside = inside; S.requestDraw(); }
      }
    });
    function release(ev, cancelled) {
      if (!press) return;
      var pr = press;
      press = null;
      if (!cancelled && pr.inside) {
        if (pr.kind === "radio") {
          if (pr.g.id === "mode") animate = pr.i === 1; else withPhases = pr.i === 0;
        } else if (pr.kind === "button") hidden = !hidden;      // hide_show
      }
      setHover(hit(at(ev)));
      changed();
    }
    S.canvas.addEventListener("pointerup", function (ev) { release(ev, false); });
    S.canvas.addEventListener("pointercancel", function (ev) { release(ev, true); });
    S.canvas.addEventListener("pointerleave", function () {
      if (!press && hover) { hover = null; S.canvas.style.cursor = "default"; S.requestDraw(); }
    });
    S.canvas.tabIndex = 0;
    S.canvas.setAttribute("aria-label", "basketball, lamp and eye, with the eye's view of the ball");
    S.canvas.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowRight" || ev.key === "ArrowUp") { setAngle(angle + 5); ev.preventDefault(); }
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") { setAngle(angle - 5); ev.preventDefault(); }
    });

    /* ------------------------------------------------ drawing helpers */
    function font(ctx, size, bold, family) { ctx.font = (bold ? "bold " : "") + size + "px " + (family || SANS); }
    /* a Flash gradient fill: clip to the shape, map the gradient square (±819.2) through its matrix */
    function gfill(ctx, path, g) {
      ctx.save();
      ctx.clip(path);
      var m = g.m;
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      var gr = g.t === "r" ? ctx.createRadialGradient(0, 0, 0, 0, 0, 819.2) : ctx.createLinearGradient(-819.2, 0, 819.2, 0);
      g.s.forEach(function (s) { gr.addColorStop(s[0], s[1]); });
      ctx.fillStyle = gr; ctx.fillRect(-1e5, -1e5, 2e5, 2e5);
      ctx.restore();
    }
    function layers(ctx, list) {
      list.forEach(function (L) {
        if (L.g) gfill(ctx, L.p, L.g);
        else if (L.fill) { ctx.fillStyle = L.fill; ctx.fill(L.p); if (L.stroke) { ctx.strokeStyle = L.fill; ctx.lineWidth = L.stroke; ctx.stroke(L.p); } }
        else if (L.line) { ctx.strokeStyle = "#000000"; ctx.lineWidth = L.line; ctx.stroke(L.p); }
      });
    }

    /* ------------------------------------------------ the parts */
    function panels(ctx) {                           // soft vignette squares under their masks
      PANELS.forEach(function (pn) {
        var m = pn.m, r = pn.rect;
        ctx.save();
        if (pn.clip) { ctx.beginPath(); ctx.rect(pn.clip[0], pn.clip[1], pn.clip[2] - pn.clip[0], pn.clip[3] - pn.clip[1]); ctx.clip(); }
        ctx.transform(m[0], 0, 0, m[1], m[2], m[3]);
        ctx.beginPath(); ctx.rect(r[0], r[1], r[2] - r[0], r[3] - r[1]); ctx.clip();
        ctx.fillStyle = "#f3f3f3"; ctx.fillRect(r[0], r[1], r[2] - r[0], r[3] - r[1]);
        ctx.lineJoin = "round";
        pn.bands.forEach(function (b) {
          ctx.strokeStyle = b[1]; ctx.lineWidth = b[0];
          if (b[2]) ctx.strokeRect(-b[2], -b[2], 2 * b[2], 2 * b[2]);
          else ctx.strokeRect(r[0], r[1], r[2] - r[0], r[3] - r[1]);
        });
        ctx.restore();
      });
      GROOVES.forEach(function (g) { gfill(ctx, g.p, g.g); });
    }
    function eyeball(ctx) {                          // eye_clip at the orbit's centre
      layers(ctx, BALL);
      ctx.save();                                    // static text 254: "Smith", Comic Sans 24
      ctx.transform(SMITH[0], SMITH[1], SMITH[2], SMITH[3], SMITH[4], SMITH[5]);
      font(ctx, 24, false, COMIC); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, "Smith", 0, 26.45, "left");
      ctx.restore();
      ctx.fillStyle = "#000000"; ctx.fill(MARKS);
      var e = eyePos();                              // the_eye: 63 %, turned by the angle, at 50 %
      ctx.save();
      ctx.translate(e.x, e.y); ctx.rotate(angle * RAD); ctx.scale(0.630692, 0.627121);
      ctx.globalAlpha = 0.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
      layers(ctx, EYE);
      ctx.restore();
      ctx.save();                                    // the orbit, 1 px black at 20 %
      ctx.globalAlpha = 0.2; ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, R_ORBIT, 0, TAU); ctx.stroke();
      ctx.restore();
      if (withPhases) {                              // myShadow at 85 %
        ctx.save();
        ctx.transform(SHADOW_M[0], SHADOW_M[1], SHADOW_M[2], SHADOW_M[3], SHADOW_M[4], SHADOW_M[5]);
        ctx.globalAlpha = 218 / 256;
        gfill(ctx, SHADOW.p, SHADOW.g);
        ctx.restore();
      }
    }
    function rotator(ctx) {                          // BasketballRotator: photo and phase overlay
      ctx.save();
      ctx.translate(ROTATOR.x, ROTATOR.y); ctx.scale(ROTATOR.sx, ROTATOR.sy);
      ctx.fillStyle = "#000000"; ctx.fillRect(-112.5, -112.5, 225, 225);
      if (!hidden && sheet.complete && sheet.naturalWidth) {
        var k = frameOf(angle);
        ctx.drawImage(sheet, (k % 10) * 175, Math.floor(k / 10) * 175, 175, 175, -87.5, -87.5, 175, 175);
      }
      var ph = phaseOf(), dir = ph < Math.PI ? -1 : 1, B = R_BALL + MARGIN, cp = Math.cos(mod(ph, Math.PI));
      ctx.beginPath();                               // updateMask
      ctx.moveTo(0, R_BALL); ctx.lineTo(0, B); ctx.lineTo(dir * B, B); ctx.lineTo(dir * B, -B);
      ctx.lineTo(0, -B); ctx.lineTo(0, -R_BALL);
      for (var i = 0; i < 5; i++) ctx.quadraticCurveTo(cp * TC[i].x, TC[i].y, cp * TA[i].x, TA[i].y);
      ctx.closePath();
      ctx.fillStyle = "rgba(0,0,0," + DARK + ")"; ctx.fill("evenodd");
      ctx.restore();
    }
    function radios(ctx) {                           // FRadioButtons (frb_states), 10 px, '_sans' labels
      RADIO_GROUPS.forEach(function (G) {
        var sel = G.id === "mode" ? (animate ? 1 : 0) : (withPhases ? 0 : 1);
        ctx.save(); ctx.translate(G.x, G.y); ctx.scale(G.sx, G.sy);
        for (var i = 0; i < 2; i++) {
          var y = 25 * i, down = press && press.kind === "radio" && press.g === G && press.i === i && press.inside;
          ctx.fillStyle = "#808080"; ctx.beginPath(); ctx.arc(5, y + 5, 5, 0, TAU); ctx.fill();
          ctx.fillStyle = "#d4d0d8"; ctx.beginPath(); ctx.arc(5, y + 5, 4, 0, TAU); ctx.fill();
          ctx.fillStyle = down ? "#cccccc" : "#ffffff"; ctx.beginPath(); ctx.arc(5, y + 5, 3, 0, TAU); ctx.fill();
          if (sel === i) { ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.arc(5, y + 5, 2, 0, TAU); ctx.fill(); }
          font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
          FlashText.fill(ctx, t(G.keys[i]), 13, y + 9.8, "left");   // Arial in the SWF's label field
        }
        ctx.restore();
      });
    }
    function light(ctx) {                            // myLight: four #ffcc00 arrows and "Light"
      if (!withPhases) return;
      ctx.save(); ctx.translate(LIGHT.x, LIGHT.y);
      [100, 34, -34, -100].forEach(function (y) {
        ctx.save(); ctx.translate(-44.95 + 50, y);
        ctx.fillStyle = "#ffcc00"; ctx.fill(ARROW);
        ctx.strokeStyle = "#ffcc00"; ctx.lineWidth = 1; ctx.lineJoin = "round"; ctx.stroke(ARROW);
        ctx.restore();
      });
      font(ctx, 24, true, VERDANA); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t("bb.light"), -6.4, 9.79, "center");
      ctx.restore();
    }
    function slider(ctx) {                           // Slider v2
      ctx.save(); ctx.translate(SLIDER.x, SLIDER.y); ctx.scale(SLIDER.sx, SLIDER.sy);
      font(ctx, 11, true); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t("bb.speed"), -93.4, -22.85 + 0.905 * 11, "left");
      ctx.strokeStyle = "#333333"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke(TRACK);
      font(ctx, 10);
      FlashText.fill(ctx, t("bb.slow"), -97 + 16.5, 25.3 + 0.905 * 10, "center");
      FlashText.fill(ctx, t("bb.fast"), 62.45 + 16.775, 25.4 + 0.905 * 10, "center");
      ctx.translate(grabberX(), 11.15);
      ctx.fillStyle = "#9ca9ab"; ctx.fill(GRABBER);
      ctx.lineWidth = 0.75; ctx.stroke(GRIP);
      ctx.lineWidth = 1; ctx.lineJoin = "round"; ctx.stroke(GRABBER);
      ctx.restore();
    }
    function viewTitle(ctx) {                        // static text 277, Verdana 29, turned −90°
      var m = VIEW_TEXT;
      ctx.save(); ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      font(ctx, 29, false, VERDANA); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t("bb.view"), 0.35, 29.15, "left");
      ctx.restore();
    }
    function button(ctx) {                           // hide_show: FPushButton 130 × 20 (#999 / #ccc / #e8e8e8)
      var down = press && press.kind === "button" && press.inside, w = BUTTON.w, h = BUTTON.h;
      ctx.save(); ctx.translate(BUTTON.x, BUTTON.y); ctx.scale(BUTTON.s, BUTTON.s);
      ctx.fillStyle = "#999999"; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = down ? "#999999" : "#cccccc"; ctx.fillRect(1, 1, w - 2, h - 2);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(2, 2, w - 4, h - 4);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t(hidden ? "bb.show" : "bb.hide"), w / 2 + (down ? 1 : 0), 14.8 + (down ? 1 : 0), "center");
      ctx.restore();
    }

    function draw() {
      var ctx = S.ctx;
      ctx.save();
      FlashText.begin(ctx);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.transform(ANIM.a, 0, 0, ANIM.d, ANIM.x, ANIM.y);
      panels(ctx);
      eyeball(ctx);
      rotator(ctx);
      radios(ctx);
      light(ctx);
      slider(ctx);
      viewTitle(ctx);
      button(ctx);
      ctx.restore();
    }
    S.onDraw(draw);
    S.refreshers.push(syncSidebar);
    changed();
  }
});
