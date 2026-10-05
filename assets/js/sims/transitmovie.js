/* Time-Lapse Seasons Demonstrator (Union Seasons Demonstrator) ----------------------
   Faithful rebuild of ClassAction's "transitmovie.swf" (Coordinates and Motions),
   decompiled with tools/swf-actions.py. The SWF is a shell that loads a second,
   8.4 MB movie, transitimages.swf: 434 frames, 315 of them holding a 320 x 240
   webcam photo of Memorial Plaza on the University of Nebraska–Lincoln campus, each
   taken at the Sun's meridian transit, plus the TransitImageSequence day table —
   for every one of 366 days the photo's time, the Sun's noon altitude and
   declination, and which days are missing or overcast. Here the photos are one
   315-frame video (assets/video/transitmovie.mp4, frame k = the k-th day that has
   a picture) and the table is inlined below. The video is decoded once into memory
   (_filmframes.js), so like the SWF's bitmaps any day's photo is on screen at once.

   setDay() is the SWF's own: with "exclude overcast days" it falls back to the
   last clear day, otherwise to the last day with a picture; the Sun sits on the
   meridian at the table's altitude, the yellow circle at the table's declination,
   and the clock shows the photo's time rounded to the minute. Dragging the Sun
   runs setSunDec(): the table is split at the solstices (days 171 and 356, moved
   back to the nearest usable day) into a falling and a rising half, and the Sun's
   new declination is looked up in whichever half the current day is in. The
   timeline is 2 px a day (732 px) with the no-image (or overcast) bands under
   it; pressing beside the cursor steps a day, then 10 days a second after 0.5 s.
   The animation runs at `rate` days per millisecond.

   The horizon diagram is the UNL CelestialSphere engine at latitude 40.8°, size
   260, viewer azimuth 200° and altitude 40° (no view below 7°), showUnder off —
   so everything under the horizon is masked away and the sky dome is three
   CSGradientDisk shades (#b2d3e6 behind, #bfe4ff over it and in front) plus the
   engine's own "celestial bowl". Circles: meridian and prime vertical (white
   20 %), the solstice declinations ±23.44° (white 50 %), the celestial equator
   (#2c7bfe 2 px 60 %) and the day's declination (#ffcc00 2 px 70 %); rolling
   over the last four shows the SWF's labels. The stick figure faces south, its
   shadow is the ShadowMaker skew (length 1/tan alt, alpha 100 − 100/(15 tan alt)).

   The SWF's title bar is left out (its help and about live in the page). The
   mouse wheel steps days over the timeline panel, as the SWF's host page did.   */
Sim.create({
  id: "transitmovie",
  width: 820, height: 575,
  strings: {
    en: {
      "tm.day": "Day of year", "tm.dayCtl": "day", "tm.prev": "◀ previous day", "tm.next": "next day ▶",
      "tm.exclude": "exclude overcast days", "tm.dirs": "show directions",
      "tm.anim": "Animation", "tm.start": "start animation", "tm.pause": "pause animation",
      "tm.rate": "rate", "tm.perSec": " days/s",
      "tm.rDate": "date", "tm.rTime": "time of the picture", "tm.rAlt": "sun's altitude",
      "tm.rDec": "sun's declination",
      "tm.hint": "Drag the Sun in the horizon diagram or the red marker on the timeline to change the day; drag the diagram itself to turn it. Over the timeline the mouse wheel steps a day at a time.",
      "tm.place": "University of Nebraska Memorial Plaza", "tm.coords": "40.8° N, 96.7° W",
      "tm.horizon": "Horizon Diagram", "tm.controls": "Animation Controls", "tm.timeline": "Timeline",
      "tm.altLabel": "Sun's Altitude:", "tm.decLabel": "Declination:", "tm.rateLabel": "rate:",
      "tm.noImage": "days with no image", "tm.loading": "loading the pictures…",
      "tm.pm": "pm",
      "tm.N": "N", "tm.S": "S", "tm.E": "E", "tm.W": "W",
      "tm.lDec1": "sun's declination", "tm.lDec2": "(its daily path)",
      "tm.lMin1": "sun's minimum", "tm.lMax1": "sun's maximum", "tm.lMM2": "declination",
      "tm.lEq1": "celestial", "tm.lEq2": "equator",
      "tm.wd0": "Sunday", "tm.wd1": "Monday", "tm.wd2": "Tuesday", "tm.wd3": "Wednesday",
      "tm.wd4": "Thursday", "tm.wd5": "Friday", "tm.wd6": "Saturday",
      "tm.m0": "January", "tm.m1": "February", "tm.m2": "March", "tm.m3": "April", "tm.m4": "May",
      "tm.m5": "June", "tm.m6": "July", "tm.m7": "August", "tm.m8": "September", "tm.m9": "October",
      "tm.m10": "November", "tm.m11": "December",
      "tm.s0": "Jan", "tm.s1": "Feb", "tm.s2": "Mar", "tm.s3": "Apr", "tm.s4": "May", "tm.s5": "Jun",
      "tm.s6": "Jul", "tm.s7": "Aug", "tm.s8": "Sep", "tm.s9": "Oct", "tm.s10": "Nov", "tm.s11": "Dec"
    },
    id: {
      "tm.day": "Hari dalam setahun", "tm.dayCtl": "hari", "tm.prev": "◀ hari sebelumnya", "tm.next": "hari berikutnya ▶",
      "tm.exclude": "lewati hari berawan", "tm.dirs": "tampilkan arah",
      "tm.anim": "Animasi", "tm.start": "mulai animasi", "tm.pause": "jeda animasi",
      "tm.rate": "laju", "tm.perSec": " hari/d",
      "tm.rDate": "tanggal", "tm.rTime": "waktu pemotretan", "tm.rAlt": "ketinggian matahari",
      "tm.rDec": "deklinasi matahari",
      "tm.hint": "Seret Matahari pada diagram horizon atau penanda merah pada garis waktu untuk mengganti hari; seret diagramnya untuk memutarnya. Di atas garis waktu, roda tetikus melangkah satu hari sekali putar.",
      "tm.place": "University of Nebraska Memorial Plaza", "tm.coords": "40.8° LU, 96.7° BB",
      "tm.horizon": "Diagram Horizon", "tm.controls": "Kendali Animasi", "tm.timeline": "Garis Waktu",
      "tm.altLabel": "Ketinggian Matahari:", "tm.decLabel": "Deklinasi:", "tm.rateLabel": "laju:",
      "tm.noImage": "hari tanpa gambar", "tm.loading": "memuat gambar…",
      "tm.pm": "",
      "tm.N": "U", "tm.S": "S", "tm.E": "T", "tm.W": "B",
      "tm.lDec1": "deklinasi matahari", "tm.lDec2": "(lintasan hariannya)",
      "tm.lMin1": "deklinasi minimum", "tm.lMax1": "deklinasi maksimum", "tm.lMM2": "matahari",
      "tm.lEq1": "ekuator", "tm.lEq2": "langit",
      "tm.wd0": "Minggu", "tm.wd1": "Senin", "tm.wd2": "Selasa", "tm.wd3": "Rabu",
      "tm.wd4": "Kamis", "tm.wd5": "Jumat", "tm.wd6": "Sabtu",
      "tm.m0": "Januari", "tm.m1": "Februari", "tm.m2": "Maret", "tm.m3": "April", "tm.m4": "Mei",
      "tm.m5": "Juni", "tm.m6": "Juli", "tm.m7": "Agustus", "tm.m8": "September", "tm.m9": "Oktober",
      "tm.m10": "November", "tm.m11": "Desember",
      "tm.s0": "Jan", "tm.s1": "Feb", "tm.s2": "Mar", "tm.s3": "Apr", "tm.s4": "Mei", "tm.s5": "Jun",
      "tm.s6": "Jul", "tm.s7": "Agu", "tm.s8": "Sep", "tm.s9": "Okt", "tm.s10": "Nov", "tm.s11": "Des"
    }
  },
  about: {
    en: "<p>Once a day, at the moment the Sun crossed the meridian and stood highest in the sky, a webcam on the University of Nebraska–Lincoln campus photographed Memorial Plaza, north of the Student Union. Put a year of those noon pictures in order (they were taken in 2003 and 2004) and the seasons play out in the shadow of the Union building: short in June, when the noon Sun is high, and long in December, when it hangs low in the south.</p>" +
        "<p>The camera looks east, so the Sun — due south at the moment of every picture — is up and to the right, and the building throws its shadow north across the plaza. Because each picture is taken at the same moment of the solar day, the only thing that changes from one to the next is the Sun's declination, its angle north or south of the celestial equator. At latitude 40.8° N the noon altitude is simply 90° − 40.8° + declination: 72.6° at the June solstice, 49.2° at the equinoxes and 25.8° at the December solstice.</p>" +
        "<p>The horizon diagram shows the same sky for a stick-figure observer standing in the plaza. The yellow circle is the Sun's path across the sky that day; through the year it slides between the two white circles at ±23.44°, the solstice limits. Drag the Sun, or the red marker on the timeline, to choose a day, or animate the whole year. Some days have no picture, and on overcast days the building casts no shadow at all — tick <b>exclude overcast days</b> to skip them and follow the shadow more easily.</p>" +
        "<p>The clock times drift from 12:28 to 1:17 pm over the year: an hour of that is daylight saving time, and the rest is the equation of time — noon by the Sun is not noon by the clock.</p>",
    id: "<p>Sekali sehari, tepat saat Matahari melintasi meridian dan berada paling tinggi di langit, sebuah kamera web di kampus University of Nebraska–Lincoln memotret Memorial Plaza di sebelah utara Student Union. Susun foto-foto tengah hari selama setahun itu (diambil pada 2003 dan 2004), dan pergantian musim tampak pada bayangan gedung Union: pendek pada bulan Juni, saat Matahari tengah hari tinggi, dan panjang pada bulan Desember, saat Matahari rendah di selatan.</p>" +
        "<p>Kamera menghadap ke timur, sehingga Matahari — tepat di selatan pada setiap pemotretan — berada di atas sebelah kanan, dan gedung melemparkan bayangannya ke utara melintasi plaza. Karena setiap foto diambil pada saat yang sama dalam hari Matahari, satu-satunya yang berubah dari hari ke hari adalah deklinasi Matahari, yaitu sudutnya di utara atau selatan ekuator langit. Pada lintang 40,8° LU, ketinggian tengah hari hanyalah 90° − 40,8° + deklinasi: 72,6° pada titik balik Juni, 49,2° pada ekuinoks, dan 25,8° pada titik balik Desember.</p>" +
        "<p>Diagram horizon menunjukkan langit yang sama bagi pengamat (orang-orangan) yang berdiri di plaza. Lingkaran kuning adalah lintasan Matahari di langit pada hari itu; sepanjang tahun lingkaran ini bergeser di antara dua lingkaran putih pada ±23,44°, batas-batas titik balik. Seret Matahari, atau penanda merah pada garis waktu, untuk memilih hari, atau jalankan animasi setahun penuh. Beberapa hari tidak memiliki foto, dan pada hari berawan gedung sama sekali tidak berbayang — centang <b>lewati hari berawan</b> untuk melewatinya agar gerak bayangan lebih mudah diikuti.</p>" +
        "<p>Waktu pada jam bergeser dari 12:28 hingga 13:17 sepanjang tahun: satu jam di antaranya karena waktu musim panas (daylight saving time), dan sisanya karena persamaan waktu — tengah hari menurut Matahari tidak sama dengan tengah hari menurut jam.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var OY = -25;                                   // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif";
    var ASC = 1.0059, EM_H = 1.2159, TB = 0;        // TB: a TextField's baseline is field top + 2 + ascent

    /* ---- TransitImageSequence.dayTable (day 0 = 1 January; days 270–365 are 2003) ---- */
    var ALT = [26.17,26.26,26.35,26.45,26.56,26.67,26.8,26.93,27.07,27.21,27.36,27.52,27.69,27.86,28.04,28.23,28.42,28.62,28.83,29.04,29.26,29.48,29.72,29.95,30.2,30.44,30.7,30.96,31.23,31.5,31.77,32.05,32.34,32.63,32.93,33.23,33.54,33.85,34.16,34.48,34.8,35.13,35.46,35.79,36.13,36.47,36.82,37.16,37.52,37.87,38.23,38.59,38.95,39.32,39.68,40.05,40.43,40.8,41.18,41.56,41.94,42.32,42.71,43.09,43.48,43.87,44.26,44.65,45.04,45.43,45.82,46.22,46.61,47,47.4,47.79,48.19,48.59,48.98,49.38,49.77,50.17,50.56,50.95,51.35,51.74,52.13,52.52,52.91,53.3,53.68,54.07,54.45,54.83,55.21,55.59,55.97,56.35,56.72,57.09,57.46,57.83,58.19,58.55,58.91,59.27,59.62,59.97,60.32,60.66,61,61.34,61.68,62.01,62.34,62.66,62.98,63.3,63.61,63.92,64.23,64.53,64.82,65.12,65.4,65.69,65.97,66.24,66.51,66.78,67.04,67.29,67.54,67.78,68.02,68.26,68.49,68.71,68.93,69.14,69.35,69.55,69.74,69.93,70.11,70.29,70.46,70.63,70.78,70.94,71.08,71.22,71.36,71.48,71.6,71.72,71.82,71.92,72.02,72.11,72.19,72.26,72.33,72.39,72.44,72.49,72.53,72.56,72.59,72.6,72.62,72.62,72.62,72.61,72.6,72.57,72.55,72.51,72.47,72.42,72.36,72.3,72.23,72.15,72.07,71.98,71.88,71.78,71.67,71.55,71.43,71.3,71.17,71.02,70.88,70.72,70.56,70.4,70.22,70.05,69.86,69.67,69.48,69.28,69.07,68.86,68.64,68.42,68.19,67.96,67.72,67.47,67.22,66.97,66.71,66.45,66.18,65.91,65.63,65.35,65.07,64.78,64.48,64.18,63.88,63.57,63.27,62.95,62.63,62.31,61.99,61.66,61.33,61,60.66,60.32,59.98,59.63,59.28,58.93,58.58,58.22,57.86,57.5,57.14,56.77,56.4,56.03,55.66,55.29,54.92,54.54,54.16,53.78,53.4,53.02,52.64,52.25,51.87,51.48,51.09,50.71,50.32,49.93,49.54,49.15,48.76,48.37,47.98,47.6,47.5,47.11,46.72,46.33,45.95,45.56,45.17,44.79,44.4,44.02,43.63,43.25,42.87,42.49,42.12,41.74,41.36,40.99,40.62,40.25,39.89,39.52,39.16,38.8,38.44,38.09,37.74,37.39,37.04,36.7,36.36,36.02,35.69,35.36,35.04,34.72,34.4,34.08,33.77,33.47,33.17,32.87,32.58,32.29,32.01,31.73,31.46,31.19,30.93,30.67,30.42,30.17,29.93,29.69,29.47,29.24,29.03,28.81,28.61,28.41,28.22,28.03,27.86,27.68,27.52,27.36,27.21,27.07,26.93,26.8,26.68,26.56,26.45,26.35,26.26,26.17,26.1,26.03,25.96,25.91,25.86,25.82,25.79,25.77,25.75,25.74,25.74,25.75,25.77,25.79,25.82,25.86,25.91,25.96,26.02,26.09];
    var DEC = [-23.01,-22.93,-22.83,-22.73,-22.62,-22.51,-22.38,-22.25,-22.12,-21.97,-21.82,-21.66,-21.49,-21.32,-21.14,-20.96,-20.76,-20.56,-20.36,-20.14,-19.92,-19.7,-19.47,-19.23,-18.99,-18.74,-18.48,-18.22,-17.96,-17.69,-17.41,-17.13,-16.84,-16.55,-16.25,-15.95,-15.65,-15.34,-15.02,-14.7,-14.38,-14.05,-13.72,-13.39,-13.05,-12.71,-12.37,-12.02,-11.67,-11.31,-10.95,-10.59,-10.23,-9.87,-9.5,-9.13,-8.75,-8.38,-8,-7.62,-7.24,-6.86,-6.48,-6.09,-5.7,-5.32,-4.93,-4.54,-4.15,-3.75,-3.36,-2.97,-2.57,-2.18,-1.78,-1.39,-0.99,-0.6,-0.2,0.19,0.59,0.98,1.38,1.77,2.16,2.56,2.95,3.34,3.73,4.11,4.5,4.89,5.27,5.65,6.03,6.41,6.79,7.16,7.54,7.91,8.28,8.64,9.01,9.37,9.73,10.08,10.44,10.79,11.14,11.48,11.82,12.16,12.5,12.83,13.16,13.48,13.8,14.12,14.43,14.74,15.04,15.35,15.64,15.93,16.22,16.51,16.79,17.06,17.33,17.59,17.85,18.11,18.36,18.6,18.84,19.08,19.3,19.53,19.75,19.96,20.16,20.36,20.56,20.75,20.93,21.11,21.28,21.44,21.6,21.75,21.9,22.04,22.17,22.3,22.42,22.53,22.64,22.74,22.84,22.92,23,23.08,23.15,23.21,23.26,23.31,23.35,23.38,23.4,23.42,23.44,23.44,23.44,23.43,23.42,23.39,23.36,23.33,23.28,23.24,23.18,23.12,23.05,22.97,22.89,22.8,22.7,22.6,22.49,22.37,22.25,22.12,21.98,21.84,21.69,21.54,21.38,21.21,21.04,20.86,20.68,20.49,20.3,20.09,19.89,19.68,19.46,19.24,19.01,18.77,18.53,18.29,18.04,17.79,17.53,17.27,17,16.73,16.45,16.17,15.88,15.59,15.3,15,14.7,14.39,14.08,13.77,13.45,13.13,12.81,12.48,12.15,11.82,11.48,11.14,10.79,10.45,10.1,9.75,9.39,9.04,8.68,8.32,7.96,7.59,7.22,6.85,6.48,6.11,5.73,5.36,4.98,4.6,4.22,3.84,3.45,3.07,2.68,2.3,1.91,1.53,1.14,0.75,0.36,-0.03,-0.42,-0.81,-1.2,-1.59,-1.68,-2.07,-2.46,-2.85,-3.24,-3.62,-4.01,-4.4,-4.78,-5.16,-5.55,-5.93,-6.31,-6.69,-7.07,-7.44,-7.82,-8.19,-8.56,-8.93,-9.3,-9.66,-10.02,-10.38,-10.74,-11.09,-11.44,-11.79,-12.14,-12.48,-12.82,-13.16,-13.49,-13.82,-14.15,-14.47,-14.78,-15.1,-15.41,-15.71,-16.02,-16.31,-16.6,-16.89,-17.17,-17.45,-17.73,-17.99,-18.26,-18.51,-18.77,-19.01,-19.25,-19.49,-19.72,-19.94,-20.16,-20.37,-20.57,-20.77,-20.96,-21.15,-21.33,-21.5,-21.66,-21.82,-21.97,-22.12,-22.25,-22.38,-22.51,-22.62,-22.73,-22.83,-22.92,-23.01,-23.09,-23.16,-23.22,-23.27,-23.32,-23.36,-23.39,-23.42,-23.43,-23.44,-23.44,-23.43,-23.42,-23.39,-23.36,-23.32,-23.28,-23.22,-23.16,-23.09];
    var TIME = [1072960150,1073046578,1073133006,1073219433,1073305860,1073392287,1073478713,1073565139,1073651564,1073737989,1073824413,1073910836,1073997259,1074083681,1074170103,1074256524,1074342944,1074429364,1074515782,1074602201,1074688618,1074775034,1074861450,1074947865,1075034280,1075120693,1075207106,1075293517,1075379929,1075466339,1075552748,1075639157,1075725564,1075811971,1075898378,1075984783,1076071187,1076157591,1076243994,1076330396,1076416797,1076503198,1076589598,1076675997,1076762395,1076848793,1076935189,1077021586,1077107981,1077194376,1077280770,1077367163,1077453556,1077539948,1077626340,1077712731,1077799121,1077885511,1077971900,1078058289,1078144677,1078231064,1078317452,1078403838,1078490225,1078576611,1078662996,1078749381,1078835766,1078922151,1079008535,1079094919,1079181302,1079267686,1079354069,1079440452,1079526834,1079613217,1079699599,1079785981,1079872363,1079958745,1080045127,1080131509,1080217891,1080304273,1080390655,1080477037,1080563418,1080649800,1080736183,1080822565,1080908947,1080995329,1081085312,1081171695,1081258078,1081344461,1081430845,1081517228,1081603612,1081689996,1081776381,1081862766,1081949151,1082035537,1082121923,1082208309,1082294696,1082381083,1082467470,1082553858,1082640247,1082726636,1082813025,1082899415,1082985805,1083072196,1083158587,1083244979,1083331371,1083417764,1083504158,1083590552,1083676946,1083763341,1083849737,1083936133,1084022530,1084108928,1084195326,1084281724,1084368123,1084454523,1084540923,1084627324,1084713725,1084800127,1084886530,1084972933,1085059336,1085145741,1085232145,1085318550,1085404956,1085491362,1085577769,1085664176,1085750584,1085836992,1085923400,1086009809,1086096218,1086182628,1086269038,1086355448,1086441859,1086528270,1086614681,1086701093,1086787505,1086873917,1086960329,1087046741,1087133154,1087219567,1087305980,1087392392,1087478805,1087565219,1087651632,1087738045,1087824458,1087910871,1087997284,1088083697,1088170109,1088256522,1088342934,1088429346,1088515758,1088602170,1088688582,1088774993,1088861404,1088947815,1089034225,1089120635,1089207044,1089293453,1089379862,1089466271,1089552678,1089639086,1089725493,1089811899,1089898305,1089984711,1090071116,1090157520,1090243924,1090330327,1090416730,1090503132,1090589533,1090675934,1090762335,1090848734,1090935134,1091021532,1091107930,1091194328,1091280724,1091367120,1091453516,1091539911,1091626305,1091712699,1091799092,1091885485,1091971877,1092058268,1092144659,1092231049,1092317439,1092403828,1092490216,1092576604,1092662992,1092749379,1092835765,1092922151,1093008537,1093094922,1093181307,1093267691,1093354074,1093440458,1093526841,1093613223,1093699606,1093785987,1093872369,1093958750,1094045131,1094131512,1094217892,1094304272,1094390652,1094477032,1094563411,1094649790,1094736170,1094822549,1094908927,1094995306,1095081685,1095168064,1095254442,1095340821,1095427199,1095513578,1095599957,1095686335,1095772714,1095859093,1095945472,1096031851,1096118230,1096204610,1064668605,1064754985,1064841365,1064927745,1065014126,1065100506,1065186887,1065273269,1065359651,1065446033,1065532415,1065618798,1065705182,1065791566,1065877950,1065964335,1066050720,1066137106,1066223492,1066309879,1066396267,1066482655,1066569044,1066655433,1066741823,1066828214,1066914605,1067000997,1067087390,1067170183,1067256577,1067342972,1067429368,1067515764,1067602162,1067688560,1067774958,1067861358,1067947758,1068034160,1068120562,1068206965,1068293369,1068379773,1068466179,1068552585,1068638992,1068725400,1068811809,1068898219,1068984629,1069071041,1069157453,1069243866,1069330280,1069416694,1069503110,1069589526,1069675943,1069762361,1069848780,1069935199,1070021619,1070108040,1070194461,1070280883,1070367306,1070453729,1070540153,1070626578,1070713003,1070799429,1070885855,1070972281,1071058708,1071145136,1071231564,1071317992,1071404420,1071490849,1071577278,1071663707,1071750137,1071836566,1071922996,1072009426,1072095856,1072182286,1072268715,1072355145,1072441575,1072528005,1072614434,1072700863,1072787292,1072873721];
    var OVERCAST = [2,3,4,8,15,16,19,21,23,24,27,28,31,34,35,38,41,46,53,54,55,60,61,62,63,64,72,74,75,78,82,83,84,85,86,88,99,102,108,110,112,113,114,119,120,121,122,127,131,132,133,135,136,137,138,144,150,160,161,171,175,177,183,186,187,188,196,198,203,204,205,209,214,216,222,223,224,225,231,235,240,257,258,264,272,273,283,284,286,289,297,304,305,306,307,308,309,311,312,314,317,319,321,326,327,335,336,337,338,339,340,341,343,345,347,348,349,351,356,359,360];
    var MISSING = [10,14,25,44,58,59,73,87,98,107,128,139,140,149,154,155,156,157,158,159,162,163,164,169,189,190,191,192,195,212,213,219,227,233,234,238,239,245,248,254,262,278,280,298,299,300,301,302,303,344,350];
    var LEN = 366, SUMMER = 171, WINTER = 356, MIN_DEC = -23.44, MAX_DEC = 23.44;
    var overcast = [], missing = [], frameOf = [];
    (function () {
      var i, k = 0;
      for (i = 0; i < LEN; i++) { overcast.push(false); missing.push(false); }
      OVERCAST.forEach(function (d) { overcast[d] = true; });
      MISSING.forEach(function (d) { missing[d] = true; });
      for (i = 0; i < LEN; i++) frameOf.push(missing[i] ? -1 : k++);
    })();
    function tzOf(d) { return d >= 94 && d < 299 ? "CDT" : "CST"; }

    /* analyzeDayTable: the solstices moved back to usable days, and the declination
       lookup tables for the falling (0) and rising (1) halves of the year           */
    var sol = { clear: {}, overcast: {} };
    function back(d, bad) { while (bad(d)) d -= 1; return d; }
    sol.clear.w = back(WINTER, function (d) { return overcast[d] || missing[d]; });
    sol.clear.s = back(SUMMER, function (d) { return overcast[d] || missing[d]; });
    sol.overcast.w = back(WINTER, function (d) { return missing[d]; });
    sol.overcast.s = back(SUMMER, function (d) { return missing[d]; });
    var decLookup = { clear: [[], []], overcast: [[], []] };
    (function () {
      ["clear", "overcast"].forEach(function (kind) {
        var s = sol[kind].s, w = sol[kind].w, d, k;
        function ok(day) { return !missing[day] && (kind === "overcast" || !overcast[day]); }
        for (d = s + 1; d < w; d++) if (ok(d)) decLookup[kind][0].push({ dec: DEC[d], day: d });
        var count = s + (LEN - w);
        for (k = 1; k < count; k++) {
          d = (w + k) % LEN;
          if (ok(d)) decLookup[kind][1].push({ dec: DEC[d], day: d });
        }
      });
    })();

    /* ---- layout, in SWF stage coordinates (drawn shifted up by OY) ---- */
    var PANELS = [
      { x: 7, y: 32, w: 500, h: 455, key: null },
      { x: 514, y: 32, w: 299, h: 335, key: "tm.horizon" },
      { x: 514, y: 374, w: 299, h: 113, key: "tm.controls" },
      { x: 7, y: 494, w: 806, h: 99, key: "tm.timeline" }
    ];
    var PHOTO = { x: 17, y: 42, w: 480, h: 360 };
    var DIRS = { x: 260, y: 240 };                  // Image Direction Labels
    var C = { x: 663, y: 190 }, R = 130, LAT = 40.8;
    var TL = { x: 44, y: 538.8, w: 732 };           // the Timeline clip; 2 px a day
    var SCALE = TL.w / LEN;
    var BTN = { x: 600, y: 407, w: 127, h: 25 };
    var CHK_DIRS = { x: 381.85, y: 464.35, key: "tm.dirs" };
    var CHK_EXCL = { x: 647.35, y: 571.75, key: "tm.exclude" };

    /* the SWF's own art (tools/swf-inspect.py canvas): Image Direction Labels (shape 11),
       Stickman (55), StickmanShadow (53) and the FCheckBox tick */
    var DIR_ARROWS = new Path2D("M-55 -10.25L-82.5 12.25L-136 -4L-55 -10.25ZM59.75 15.75L74 -6L136 3.5L59.75 15.75ZM-37 -14.5L30 -31L60 -12.75L-37 -14.5ZM35 21.5L-43 42L-65.25 19L35 21.5Z");
    var DIR_LETTERS = new Path2D("M42.8 -54.9L30.55 -54.9L30.55 -51.8L41.9 -51.8L41.9 -46.4L30.55 -46.4L30.55 -42.4L43.15 -42.4L43.15 -36.4L22.6 -36.4L22.6 -60.6L42.8 -60.6L42.8 -54.9ZM151.75 -0.7Q156.6 0.4 158.7 1.45Q160.85 2.55 161.85 4.2Q162.8 5.8 162.8 7.8Q162.8 10.2 161.5 12.2Q160.2 14.2 157.9 15.2Q155.5 16.2 152.05 16.2Q145.9 16.2 143.5 13.8Q141.1 11.4 140.75 7.4L148.3 6.95Q148.55 8.8 149.2 9.6Q150.25 10.95 152.15 10.95Q153.6 10.95 154.3 10.3Q155.1 9.65 155.1 8.85Q155.1 8.05 154.35 7.45Q153.65 6.8 150.55 6.1Q145.9 5.05 143.7 2.65Q141.65 1.35 141.65 -1.6Q141.65 -3.5 142.7 -5.2Q143.85 -6.9 146.05 -7.85Q148.25 -8.8 152 -8.8Q156.6 -8.8 159.1 -7.05Q161.55 -5.3 162.05 -1.2L154.55 -0.75Q154.25 -2.45 153.5 -3.15Q152.7 -3.8 151.3 -3.8Q150.1 -3.8 149.6 -3.3Q149.05 -2.85 149.05 -2.25Q149.05 -1.8 149.55 -1.4Q149.9 -1.05 151.75 -0.7ZM-142.5 -17.6L-142.5 6.6L-149.9 6.6L-158.15 -6.35L-158.15 6.6L-165.7 6.6L-165.7 -17.6L-158.4 -17.6L-150 -4.6L-150 -17.6L-142.5 -17.6ZM-32.75 47.4L-38.05 71.6L-45.7 71.6L-49.6 56.8L-53.45 71.6L-61.1 71.6L-66.4 47.4L-58.9 47.4L-56.6 60.55L-53.3 47.4L-45.9 47.4L-42.55 60.55L-40.3 47.4L-32.75 47.4Z");
    var CHECK = new Path2D("M7.1 0.6Q7.1 0 6.5 0Q6.35 0 6.05 0.25L2.6 3.95L1 2.15L0.6 1.95Q0.05 1.95 0.05 2.5" +
      "L0 4.4L0.15 4.75L2.25 6.9L2.3 6.9L2.5 6.95L2.9 6.75L6.9 2.75L7.1 2.35Z");

    /* ---- Slider Logic v6 (the rate slider: log 0.0015–0.25, 2 significant digits) ---- */
    function SliderLogic(o) {
      var s = { min: o.min, max: o.max, digs: o.digits, minP: o.minP, maxP: o.minP + o.range };
      s.lower = Math.pow(10, s.digs - 1); s.upper = Math.pow(10, s.digs); s.perMag = 9 * s.lower;
      s.scale = (Math.log(s.max) - Math.log(s.min)) / (s.maxP - s.minP);
      s.fromParam = function (p) { return Math.exp((p - s.minP) * s.scale + Math.log(s.min)); };
      s.toParam = function (v) { return s.minP + (Math.log(v) - Math.log(s.min)) / s.scale; };
      function valueOf(sig, mag) {
        var e = mag - (s.digs - 1);
        return e >= 0 ? sig * Math.pow(10, e) : sig / Math.pow(10, -e);
      }
      s.snap = function (x) {
        x = Math.min(s.max, Math.max(s.min, x));
        var mag = Math.floor(Math.log(x) / Math.LN10), sig = Math.round(x * s.lower / Math.pow(10, mag));
        if (sig >= s.upper) { sig = s.lower; mag += 1; }
        return { value: valueOf(sig, mag), mag: mag, sig: sig };
      };
      s.step = function (obj, ticks) {
        ticks = Math.round(ticks);
        var f = ticks / s.perMag, dMag, dSig;
        if (f >= 1) { dMag = Math.floor(f); dSig = ticks - dMag * s.perMag; }
        else if (f <= -1) { dMag = Math.ceil(f); dSig = ticks - dMag * s.perMag; }
        else { dMag = 0; dSig = ticks; }
        var sig = obj.sig + dSig, mag = obj.mag + dMag;
        if (sig >= s.upper) { sig -= s.perMag; mag += 1; } else if (sig < s.lower) { sig += s.perMag; mag -= 1; }
        var v = valueOf(sig, mag);
        if (v < s.min) return s.snap(s.min);
        if (v > s.max) return s.snap(s.max);
        return { value: v, mag: mag, sig: sig };
      };
      s.obj = s.snap(o.value);
      return s;
    }
    // animateRateSlider: _width 201.05 × 1.000244, no field, barSpacing 10, barMargin 7
    var RATE = SliderLogic({ min: 0.0015, max: 0.25, digits: 2, minP: 17, range: 177.1, value: 0.03 });
    RATE.x = 570.8; RATE.y = 461; RATE.barX = 10;

    /* ------------------------------------------------------------------ state */
    var day = 282, exclude = false, showDirs = false;
    var animating = false, animDay = 0, timeLast = 0, lastAnimD = -1;
    var lastInterval = 0, atSolstice = false;
    var shadowCursor = null;                        // a day, while dragging or animating
    var hover = null, press = null;

    /* setDay: fall back to a usable day, then place the Sun and the day's circle */
    function setDay(arg) {
      var d = ((Math.floor(arg) % LEN) + LEN) % LEN, s;
      if (exclude) {
        while (overcast[d] || missing[d]) d = (d - 1 + LEN) % LEN;
        s = sol.clear;
      } else {
        while (missing[d]) d = (d - 1 + LEN) % LEN;
        s = sol.overcast;
      }
      if (d > s.s && d < s.w) { lastInterval = 0; atSolstice = false; }
      else if (d > s.w || d < s.s) { lastInterval = 1; atSolstice = false; }
      else atSolstice = true;
      day = d;
      seekTo(frameOf[d]);
      changed();
    }
    function step(dir, count) {                     // incrementUpBy / incrementDownBy
      var d = day;
      for (var i = 0; i < count; i++) {
        do { d = (d + dir + LEN) % LEN; } while (missing[d] || (exclude && overcast[d]));
      }
      setDay(d);
    }
    function setSunDec(dec) {
      if (!isFinite(dec)) return;
      var kind = exclude ? "clear" : "overcast";
      if (dec <= MIN_DEC) { setDay(sol[kind].w); return; }
      if (dec >= MAX_DEC) { setDay(sol[kind].s); return; }
      var interval = atSolstice ? (lastInterval + 1) % 2 : lastInterval;
      var tab = decLookup[kind][interval], len = tab.length, i = 0;
      if (interval === 0) while (i < len && dec < tab[i].dec) i++;
      else while (i < len && dec > tab[i].dec) i++;
      if (i !== 0) i -= 1;
      setDay(tab[i].day);
    }
    function setAnimate(b) {                        // setAnimateState
      if (b && !animating) { timeLast = performance.now(); animDay = day; lastAnimD = day; }
      animating = b;
      shadowCursor = b ? day : null;
      wake();
    }
    function toggleAnimate() { buttonAnimating = !buttonAnimating; setAnimate(buttonAnimating); changed(); }
    var buttonAnimating = false;                    // the button's label: resume after a drag
    function setExclude(b) { exclude = b; setDay(day); }
    function setDirs(b) { showDirs = b; changed(); }
    function setRate(obj) { RATE.obj = obj; changed(); }

    /* -------------------------------------------------------------- the photos */
    var still = new Image();
    still.onload = function () { S.requestDraw(); };
    still.src = "../assets/img/sims/transitmovie-start.jpg";   // frame 239 = day 282
    var STILL_FRAME = 239;
    var film = FilmFrames.load("../assets/video/transitmovie.mp4", {
      fps: 30, count: 315, fullRange: false,                      // video-range BT.601
      onframe: function (k) { if (k === frameOf[day]) S.requestDraw(); }
    });
    film.want(frameOf[day]);
    function seekTo(k) { film.want(k); }
    function unlock() { film.unlock(); }

    /* ------------------------------------------------ strings for the day */
    function info(d) {
      var t = new Date(TIME[d] * 1000);             // the SWF reads its times back as UTC
      var h = t.getUTCHours(), m = t.getUTCMinutes();
      if (t.getUTCSeconds() >= 30) { if (m === 59) { h += 1; m = 0; } else m += 1; }
      var id = I18N.getLang() === "id", time;
      if (id) time = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + " " + tzOf(d);
      else {
        var h12 = h % 12;
        time = (h12 === 0 ? 12 : h12) + ":" + (m < 10 ? "0" : "") + m + " " + I18N.t("tm.pm") + " " + tzOf(d);
      }
      return { wd: I18N.t("tm.wd" + t.getUTCDay()), dm: t.getUTCDate(), mon: I18N.t("tm.m" + t.getUTCMonth()),
        year: t.getUTCFullYear(), time: time, alt: fixed1(ALT[d]) + "°", dec: fixed1(DEC[d]) + "°" };
    }
    function fixed1(x) {                            // the SWF's own Number.toFixed
      var s = x < 0 ? "-" : "", n = Math.round(Math.abs(x) * 10);
      return s + Math.floor(n / 10) + "." + (n % 10);
    }

    /* ------------------------------------------------------------ sidebar */
    var controlsEl = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    function last(sel) { var all = controlsEl.querySelectorAll(sel); return all[all.length - 1]; }
    var syncing = false;
    S.group("tm.day");
    var dayCtl = S.slider({ labelKey: "tm.dayCtl", min: 0, max: LEN - 1, step: 1, value: day,
      format: function (v) { var f = info(v | 0); return f.dm + " " + f.mon + " " + f.year; },
      on: function (v) { if (!syncing) { setAnimate(false); buttonAnimating = false; setDay(v); } } });
    S.button({ labelKey: "tm.prev", on: function () { step(-1, 1); } });
    S.button({ labelKey: "tm.next", on: function () { step(1, 1); } });
    var exclToggle = S.toggle({ labelKey: "tm.exclude", value: false, on: function (b) { if (!syncing) setExclude(b); } });
    var dirsToggle = S.toggle({ labelKey: "tm.dirs", value: false, on: function (b) { if (!syncing) setDirs(b); } });
    S.group("tm.anim");
    var animBtn = S.button({ labelKey: "tm.start", primary: true, on: toggleAnimate });
    var rateCtl = S.slider({ labelKey: "tm.rate", min: Math.log10(0.0015), max: Math.log10(0.25), step: 0.001,
      value: Math.log10(0.03),
      format: function (v) { return sig2(1000 * RATE.snap(Math.pow(10, v)).value) + I18N.t("tm.perSec"); },
      on: function (v) { if (!syncing) setRate(RATE.snap(Math.pow(10, v))); } });
    function sig2(x) { return x >= 100 ? String(Math.round(x)) : x >= 10 ? String(Math.round(x)) : x.toFixed(1); }
    var outDate = S.readout({ labelKey: "tm.rDate" });
    var outTime = S.readout({ labelKey: "tm.rTime" });
    var outAlt = S.readout({ labelKey: "tm.rAlt" });
    var outDec = S.readout({ labelKey: "tm.rDec" });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "tm.hint");
    controlsEl.appendChild(hint);
    var shown = {};
    function put(k, fn, v) { if (shown[k] !== v) { shown[k] = v; fn(v); } }
    function syncSidebar() {
      syncing = true;
      if (Number(dayCtl.input.value) !== day) dayCtl.set(day);
      exclToggle.set(exclude); dirsToggle.set(showDirs);
      var lv = Math.log10(RATE.obj.value);
      if (Math.abs(Number(rateCtl.input.value) - lv) > 0.0006) rateCtl.set(lv);
      var key = buttonAnimating ? "tm.pause" : "tm.start";
      if (animBtn.getAttribute("data-i18n") !== key) { animBtn.setAttribute("data-i18n", key); animBtn.textContent = I18N.t(key); }
      syncing = false;
      var f = info(day);
      put("d", outDate, f.wd + ", " + f.dm + " " + f.mon + " " + f.year);
      put("t", outTime, f.time);
      put("a", outAlt, f.alt);
      put("c", outDec, f.dec);
    }
    S.refreshers.push(function () { shown = {}; syncSidebar(); });
    function changed() { syncSidebar(); S.requestDraw(); }

    /* ------------------------------------------------ the CelestialSphere, as initializeHorizonDiagram sets it up */
    var CS = window.CelestialSphere, sph = new CS({ x: C.x, y: C.y });
    sph.size = 260;
    sph.latitude = LAT;
    sph.showUnder = false;
    sph.viewerAzimuth = 200;
    sph.viewerAltitude = 40;
    sph.minViewerAltitude = 7;
    sph.addObject("stickman", CS.art.stickmanTransit, { system: "horizon", x: 0, y: 0, z: 0.001 });
    sph.stickman.setOrientationType("absolute", { system: "horizon", x: -1, y: 0, z: 0 }, { system: "horizon", x: 0, y: 0, z: 1 });
    sph.addObject("shadow", shadowGlyph, { system: "horizon", x: 0, y: 0, z: 0 });
    sph.shadow.setOrientationType("absolute", { system: "horizon", x: 0, y: 0, z: 1 }, { system: "horizon", x: 1, y: 0, z: 0 });
    sph.addObject("sun", sunGlyph, { dec: 0, ra: 0 });
    sph.addCircle("meridianCircle1", { alpha: 20, color: 0xffffff, thickness: 1 }, { tilt: 90, alt: 0, az: 0 });
    sph.addCircle("meridianCircle2", { alpha: 20, color: 0xffffff, thickness: 1 }, { tilt: 90, alt: 0, az: 90 });
    sph.addCircle("maxDeclinationCircle", { alpha: 50, color: 0xffffff, thickness: 1 }, { tilt: 0, dec: 23.44, ra: 0 });
    sph.addCircle("minDeclinationCircle", { alpha: 50, color: 0xffffff, thickness: 1 }, { tilt: 0, dec: -23.44, ra: 0 });
    sph.addCircle("celestialEquator", { alpha: 60, color: 0x2c7bfe, thickness: 2 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("decCircle", { alpha: 70, color: 0xffcc00, thickness: 2 }, { tilt: 90, dec: 0, ra: 0 });
    sph.addShadingClip(CS.GradientDisk, "skyBack", "back", "inner", "above", { outerColor: 0xbfe4ff, innerColor: 0xbfe4ff, outerAlpha: 35, innerAlpha: 15 });
    sph.addShadingClip(CS.GradientDisk, "skyFront", "front", "inner", "above", { outerColor: 0xbfe4ff, innerColor: 0xbfe4ff, outerAlpha: 30, innerAlpha: 10 });
    sph.addShadingClip(CS.GradientDisk, "skyBackDark", "back", "outer", "both", { outerColor: 0xb2d3e6, innerColor: 0xb2d3e6, outerAlpha: 100, innerAlpha: 100 });
    // ('direction labels dark' is not in this SWF's library, so nothing lies under the plane)
    sph.addHorizonPlaneClip(CS.directionLabels(function () {
      return { N: t("tm.N"), S: t("tm.S"), E: t("tm.E"), W: t("tm.W") };
    }), "aboveLabels", "above");
    /* the four circles with mouse functions ('front only'): their roll-over styles and labels */
    var HOT = [
      { id: "max", c: sph.maxDeclinationCircle, off: [1, 0xffffff, 50], on: [3, 0xffffff, 70],
        label: ["tm.lMax1", "tm.lMM2"], box: 100.5 },
      { id: "min", c: sph.minDeclinationCircle, off: [1, 0xffffff, 50], on: [3, 0xffffff, 70],
        label: ["tm.lMin1", "tm.lMM2"], box: 100.5 },
      { id: "eq", c: sph.celestialEquator, off: [2, 0x2c7bfe, 60], on: [3, 0x2c7bfe, 90],
        label: ["tm.lEq1", "tm.lEq2"], box: 60, ink: "#000000" },
      { id: "dec", c: sph.decCircle, off: [2, 0xffcc00, 70], on: [3, 0xffcc00, 90],
        label: ["tm.lDec1", "tm.lDec2"], box: 110 }
    ];
    HOT.forEach(function (h) { h.c.setUseMouseFunctions(true, "front only"); });
    var sunOutline = false;                         // SunDisk frame 2
    function sunGlyph(ctx) {                        // SunDisk: shape 49, and 50 on roll-over
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 11.34);
      g.addColorStop(0, "#ffcc00"); g.addColorStop(1, "#edb101");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fill();
      if (sunOutline) { ctx.strokeStyle = "#666666"; ctx.lineWidth = 2; ctx.stroke(); }
    }
    var shadowSource = { az: 180, alt: 45 };
    function shadowGlyph(ctx) {                     // ShadowMaker with StickmanShadow (no Shadow Mask here)
      var sm = CS.shadowMatrix(shadowSource);
      if (!sm) return;
      var spec = CS.art.shapes.stickmanShadowTransit;
      CS.groupAlpha(ctx, sm.alpha, function (g) {
        g.transform(sm.m[0], sm.m[1], sm.m[2], sm.m[3], 0, 0);
        CS.drawShape(g, spec);
      }, CS.shadowBounds(sm, spec));
    }
    /* setDay's tail: the Sun due south at the day's noon altitude, its shadow, the day's circle */
    function syncSphere() {
      sph.sun.setPosition({ alt: ALT[day], az: 180 });
      sph.sun.setOrientationType("absolute");
      shadowSource = { az: sph.sun.az, alt: sph.sun.alt };
      sph.decCircle.setCircleParameters({ tilt: 0, dec: DEC[day], ra: 0 });
      var hot = hover && hover.kind === "circle" && !press ? hover.c : null;
      HOT.forEach(function (h) { var st = h === hot ? h.on : h.off; h.c.setStyle(st[0], st[1], st[2]); });
      sunOutline = !!((hover && hover.kind === "sun" && sunPressable()) || (press && press.kind === "sun" && press.offset !== null));
    }
    function sunPressable() {                       // SunDisk.onPress needs it on the near side
      var o = sph.sun;
      return o.visible && o.shown && o.screen.z > 0;
    }
    function overSun(p) {
      var o = sph.sun;
      if (!o.visible || !o.shown) return false;
      var q = o.toLocal(p.x, p.y);
      return q.x * q.x + q.y * q.y <= 11 * 11;
    }

    /* ------------------------------------------------------ interaction */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY };
    }
    function inRect(p, x, y, w, h) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; }
    function textW(key, size) { S.ctx.font = size + "px " + FONT; return FlashText.width(S.ctx, I18N.t(key)); }
    function circleAt(p) {                           // a circle's front stroke, inside its mask (M1)
      if (!aboveNear(p)) return null;
      for (var i = HOT.length - 1; i >= 0; i--) {
        var h = HOT[i], w = h.c._thick;
        if (h.c.hitTest(S.ctx, p.x, p.y, 2 * Math.max(3, w + 1) - Math.max(1, w)) === "front") return h;
      }
      return null;
    }
    function aboveNear(q) {                          // inside mask M1
      var dx = (q.x - C.x) / R, s = Math.sin(sph.phi * RAD);
      if (q.y <= C.y) return true;
      return Math.abs(dx) <= 1 && q.y - C.y <= R * s * Math.sqrt(Math.max(0, 1 - dx * dx));
    }
    function hit(p) {
      if (overSun(p)) return { kind: "sun" };
      if (sph.inMouseArea(p.x, p.y)) {
        var c = circleAt(p);
        return c ? { kind: "circle", c: c } : { kind: "sphere" };
      }
      if (inRect(p, BTN.x, BTN.y, BTN.w, BTN.h)) return { kind: "button" };
      if (inRect(p, CHK_DIRS.x, CHK_DIRS.y - 2, 21 + textW(CHK_DIRS.key, 12), 17)) return { kind: "check", c: CHK_DIRS };
      if (inRect(p, CHK_EXCL.x, CHK_EXCL.y - 2, 21 + textW(CHK_EXCL.key, 12), 17)) return { kind: "check", c: CHK_EXCL };
      var gx = RATE.x + RATE.toParam(RATE.obj.value);
      if (Math.abs(p.x - gx) <= 5.5 && Math.abs(p.y - RATE.y) <= 13) return { kind: "grab" };
      if (inRect(p, RATE.x + RATE.barX - 3, RATE.y - 4, RATE.maxP - RATE.minP + 20, 8)) return { kind: "bar" };
      var cx = TL.x + day * SCALE + SCALE / 2;
      if (inRect(p, cx - 7, TL.y - 21, 14, 12)) return { kind: "cursor" };
      if (inRect(p, TL.x - 10, TL.y - 15, TL.w + 20, 40)) return { kind: "timeline" };
      return null;
    }
    var CURSORS = { sun: "ns-resize", sphere: "grab", cursor: "ew-resize", grab: "ew-resize",
      button: "pointer", check: "pointer", bar: "pointer", timeline: "pointer", circle: "grab" };
    function setHover(h) {
      var key = h ? h.kind + (h.c ? h.c.id || h.c.key : "") : "";
      var was = hover ? hover.kind + (hover.c ? hover.c.id || hover.c.key : "") : "";
      hover = h;
      if (!press) S.canvas.style.cursor = (h && CURSORS[h.kind]) || "default";
      if (key !== was || (h && h.kind === "circle")) S.requestDraw();
    }
    function wasAnimating() { return buttonAnimating; }

    S.canvas.addEventListener("pointerdown", function (ev) {
      unlock();
      var p = at(ev), h = hit(p);
      if (!h) return;
      ev.preventDefault();
      S.canvas.setPointerCapture(ev.pointerId);
      press = { kind: h.kind, c: h.c, x0: p.x, y0: p.y, inside: true };
      if (h.kind === "sun") {
        setAnimate(false);
        press.offset = null;                         // a Sun round the back takes the press and does nothing
        if (sunPressable()) {
          var md = sph.getMouseRaDec(p.x, p.y).dec;
          press.offset = (md === null ? DEC[day] : md) - DEC[day];
        }
      } else if (h.kind === "sphere" || h.kind === "circle") {
        press.kind = "sphere"; sph.startDrag(p.x, p.y);
        S.canvas.style.cursor = "grabbing";
      } else if (h.kind === "cursor") {
        setAnimate(false);
        press.offset = p.x - (TL.x + day * SCALE + SCALE / 2);
      } else if (h.kind === "timeline") {
        setAnimate(false);
        var cx = TL.x + day * SCALE + SCALE / 2;
        if (p.x > cx) step(1, 1); else if (p.x < cx) step(-1, 1);
        press.tLast = performance.now(); press.wait = press.tLast + 500; press.mx = p.x;
        wake();
      } else if (h.kind === "grab") {
        press.off = p.x - (RATE.x + RATE.toParam(RATE.obj.value));
      } else if (h.kind === "bar") {
        var m = RATE.snap(RATE.fromParam(p.x - RATE.x));
        if (m.value !== RATE.obj.value) setRate(RATE.step(RATE.obj, m.value < RATE.obj.value ? -1 : 1));
        press.tLast = performance.now(); press.wait = press.tLast + 500; press.mx = p.x;
        wake();
      }
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) { setHover(hit(p)); lastMouse = p; return; }
      lastMouse = p;
      if (press.kind === "sun") {                    // SunDisk.onMouseMoveFunc
        var md = press.offset === null ? null : sph.getMouseRaDec(p.x, p.y).dec;
        if (md !== null) setSunDec(md - press.offset);
      } else if (press.kind === "sphere") {          // "simple drag"
        sph.dragTo(p.x, p.y); S.requestDraw();
      } else if (press.kind === "cursor") {         // TimelineCursor.onMouseMoveFunc
        var d = Math.floor(((((p.x - TL.x - press.offset) % TL.w) + TL.w) % TL.w) / SCALE);
        shadowCursor = d;
        setDay(d);
      } else if (press.kind === "timeline" || press.kind === "bar") {
        press.mx = p.x;
      } else if (press.kind === "grab") {
        var v = RATE.snap(RATE.fromParam(p.x - press.off - RATE.x));
        if (v.value !== RATE.obj.value) setRate(v);
      } else {
        var h = hit(p), inside = !!h && h.kind === press.kind && h.c === press.c;
        if (inside !== press.inside) { press.inside = inside; S.requestDraw(); }
      }
    });
    function release(ev, cancelled) {
      if (!press) return;
      var pr = press, p = at(ev);
      press = null;
      sph.endDrag();
      if (!cancelled) {
        if (pr.kind === "button" && pr.inside) toggleAnimate();
        else if (pr.kind === "check" && pr.inside) {
          if (pr.c === CHK_DIRS) setDirs(!showDirs); else setExclude(!exclude);
        }
      }
      if (pr.kind === "sun" || pr.kind === "cursor" || pr.kind === "timeline") {
        shadowCursor = null;
        setAnimate(wasAnimating());                  // resume if the button says "pause"
      }
      setHover(hit(p));
      changed();
    }
    S.canvas.addEventListener("pointerup", function (ev) { release(ev, false); });
    S.canvas.addEventListener("pointercancel", function (ev) { release(ev, true); });
    var lastMouse = null;
    S.canvas.addEventListener("pointerleave", function () {
      lastMouse = null;
      if (!press && hover) { hover = null; S.canvas.style.cursor = "default"; S.requestDraw(); }
    });
    /* the host page fed the SWF the mouse wheel; here it works over the timeline */
    S.canvas.addEventListener("wheel", function (ev) {
      var p = at(ev), b = PANELS[3];
      if (!inRect(p, b.x, b.y, b.w, b.h) || press || animating) return;
      ev.preventDefault();
      if (ev.deltaY < 0) step(1, 1); else if (ev.deltaY > 0) step(-1, 1);
    }, { passive: false });
    S.canvas.tabIndex = 0;
    S.canvas.setAttribute("aria-label", "time-lapse photo, horizon diagram and timeline");
    S.canvas.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowRight" || ev.key === "ArrowUp") { step(1, 1); ev.preventDefault(); }
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") { step(-1, 1); ev.preventDefault(); }
    });

    /* one rAF loop: the animation, a held timeline or slider bar */
    var rafId = 0;
    function wake() {
      if (!rafId && (animating || (press && (press.kind === "timeline" || press.kind === "bar")))) {
        rafId = requestAnimationFrame(frameStep);
      }
    }
    function frameStep(now) {
      rafId = 0;
      if (animating) {                               // animateOnEnterFrame
        animDay = (((animDay + RATE.obj.value * (now - timeLast)) % LEN) + LEN) % LEN;
        timeLast = now;
        var d = Math.floor(animDay);
        shadowCursor = d;
        if (d !== lastAnimD) { lastAnimD = d; setDay(d); } else S.requestDraw();
      }
      if (press && press.kind === "timeline" && now > press.wait) {   // backgroundMC.onEnterFrameFunc
        var n = Math.floor((now - press.tLast) * 0.01);
        if (n > 0) {
          var cx = TL.x + day * SCALE + SCALE / 2;
          if (press.mx > cx) step(1, n); else if (press.mx < cx) step(-1, n);
          press.tLast += n / 0.01;
        }
      }
      if (press && press.kind === "bar" && now > press.wait) {        // barMC.onEnterFrameFunc
        var ticks = 0.05 * (now - press.tLast), m = RATE.snap(RATE.fromParam(press.mx - RATE.x));
        if (m.value < RATE.obj.value) { var dn = RATE.step(RATE.obj, -ticks); setRate(dn.value > m.value ? dn : m); }
        else if (m.value > RATE.obj.value) { var up = RATE.step(RATE.obj, ticks); setRate(up.value < m.value ? up : m); }
        press.tLast = now;
      }
      wake();
    }

    /* ------------------------------------------------------------ drawing */
    function t(key) { return I18N.t(key); }
    function font(ctx, size, style) { ctx.font = (style ? style + " " : "") + size + "px " + FONT; }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }
    function panel(ctx, b) {                         // Panel Background, 12 px #333333 title
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      if (!b.key) return;
      font(ctx, 12); ctx.fillStyle = "#333333"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var title = t(b.key), tw = FlashText.textWidth(ctx, title);           // tmc.textWidth: whole px
      FlashText.fill(ctx, title, b.x + 5, b.y + 4 + ASC * 12 + TB);
      ctx.strokeStyle = "#cccccc"; ctx.lineCap = "round";                // the rule: 2·xMargin + textWidth, then 13.25 down (12 px title)
      ctx.beginPath(); ctx.moveTo(b.x + 10 + tw, b.y + 13.25); ctx.lineTo(b.x + b.w - 5, b.y + 13.25); ctx.stroke();
      ctx.lineCap = "butt";
    }
    function pushButton(ctx, b, key) {              // FPushButton: #999 / #ccc (#999 down) / #e8e8e8
      var down = press && press.kind === "button" && press.inside;
      ctx.fillStyle = "#999999"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = down ? "#999999" : "#cccccc"; ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t(key), b.x + b.w / 2 + (down ? 1 : 0), b.y + 17.55 + (down ? 1 : 0));
    }
    function checkBox(ctx, c, checked) {            // FCheckBox with its own ' label'
      var down = press && press.kind === "check" && press.c === c && press.inside;
      ctx.fillStyle = "#808080"; ctx.fillRect(c.x, c.y, 13, 13);
      ctx.fillStyle = "#d4d0d8"; ctx.fillRect(c.x + 1, c.y + 1, 11, 11);
      ctx.fillStyle = down ? "#cccccc" : "#ffffff"; ctx.fillRect(c.x + 2, c.y + 2, 9, 9);
      if (checked) {
        ctx.save(); ctx.translate(c.x + 2.9, c.y + 3.15); ctx.fillStyle = "#000000"; ctx.fill(CHECK); ctx.restore();
      }
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t(c.key), c.x + 19.2, c.y + 11.7);           // ' label': the leading space takes no room
    }
    function rateSlider(ctx) {                       // Standard Slider v6 without its field
      var sl = RATE;
      ctx.save(); ctx.translate(sl.x, sl.y);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t("tm.rateLabel"), -FlashText.textWidth(ctx, t("tm.rateLabel")),        // labelTextMC._x = … − totalWidth
        -(EM_H * 12 + 4) / 2 + 2 + ASC * 12 + TB);
      var L = sl.maxP - sl.minP + 14;
      roundRect(ctx, sl.barX - 3.1, -4, L + 6.2, 8, 3.1); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var g = ctx.createLinearGradient(0, -3, 0, 3);
      g.addColorStop(0, "#fafafa"); g.addColorStop(1, "#d0d0d0");
      roundRect(ctx, sl.barX - 2.1, -3, L + 4.2, 6, 2.1); ctx.fillStyle = g; ctx.fill();
      var gx = sl.toParam(sl.obj.value);
      roundRect(ctx, gx - 5.5, -13.1, 11, 26.2, 4.6); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var gg = ctx.createLinearGradient(gx - 4.5, 0, gx + 4.5, 0);
      gg.addColorStop(0, "#e0e0e0"); gg.addColorStop(128 / 255, "#f4f4f4"); gg.addColorStop(1, "#e0e0e0");
      roundRect(ctx, gx - 4.5, -12.1, 9, 24.2, 3.6); ctx.fillStyle = gg; ctx.fill();
      ctx.restore();
    }

    function photo(ctx) {
      var P = PHOTO, k = frameOf[day], loading;
      if (film.has(k) || film.shown >= 0) {          // until k arrives, the last photo shown
        loading = !film.draw(ctx, k, P.x, P.y, P.w, P.h);
      } else if (still.complete && still.naturalWidth) {
        ctx.drawImage(still, P.x, P.y, P.w, P.h);
        loading = k !== STILL_FRAME;
      } else {
        ctx.fillStyle = "#e8e8e8"; ctx.fillRect(P.x, P.y, P.w, P.h);
      }
      if (loading) {
        font(ctx, 12); ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(P.x, P.y + P.h - 24, P.w, 24);
        ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; FlashText.fill(ctx, t("tm.loading"), P.x + P.w / 2, P.y + P.h - 8);
      }
      if (showDirs) {                                // Image Direction Labels (shape 11)
        ctx.save(); ctx.translate(DIRS.x, DIRS.y);
        ctx.fillStyle = "rgba(255,255,255,0.851)"; ctx.fill(DIR_ARROWS);
        ctx.strokeStyle = "#333333"; ctx.lineWidth = 1; ctx.stroke(DIR_ARROWS);
        ctx.fillStyle = "rgba(255,255,255,0.902)"; ctx.lineWidth = 0.6;
        if (I18N.getLang() === "en") { ctx.fill(DIR_LETTERS); ctx.stroke(DIR_LETTERS); }
        else {                                       // the SWF's letters are outlines: set U T S B instead
          font(ctx, 33, "bold"); ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
          [["tm.N", -154.1, 6.6], ["tm.E", 32.9, -36.4], ["tm.S", 151.8, 15.9], ["tm.W", -49.6, 71.6]].forEach(function (l) {
            FlashText.fill(ctx, t(l[0]), l[1], l[2]); FlashText.stroke(ctx, t(l[0]), l[1], l[2]);
          });
        }
        ctx.restore();
      }
    }
    function caption(ctx) {
      var f = info(day);
      ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      font(ctx, 14); ctx.textAlign = "left"; FlashText.fillStatic(ctx, t("tm.place"), 24.05, 422.45);
      font(ctx, 12); ctx.textAlign = "right"; FlashText.fillStatic(ctx, t("tm.coords"), 490.45, 420.45);
      font(ctx, 14);
      var base = 435.5 + ASC * 14 + TB;
      ctx.textAlign = "center"; FlashText.fill(ctx, f.wd, 95.05, base);
      ctx.textAlign = "right"; FlashText.fill(ctx, String(f.dm), 192.55, base);
      ctx.textAlign = "center"; FlashText.fill(ctx, f.mon, 236.28, base);
      ctx.textAlign = "left"; FlashText.fill(ctx, String(f.year), 279.6, base);
      ctx.textAlign = "right"; FlashText.fill(ctx, f.time, 463.9, base);
    }

    function horizonDiagram(ctx) {
      syncSphere();
      ctx.save(); sph.draw(ctx); ctx.restore();
    }
    function circleLabel(ctx) {                      // Declination/Equator Circle Labels, at mouse − 5
      var c = hover && hover.kind === "circle" && !press ? hover.c : null;
      if (!c || !lastMouse) return;
      var x = lastMouse.x - 5, y = lastMouse.y - 5;
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(-c.box, -35, c.box, 35);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.strokeRect(-c.box + 0.5, -34.5, c.box - 1, 34);
      font(ctx, 10, "bold"); ctx.fillStyle = c.ink || "#333333"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var mid = -c.box / 2;
      ctx.textAlign = "center";
      FlashText.fillStatic(ctx, t(c.label[0]), mid, -20.55);
      FlashText.fillStatic(ctx, t(c.label[1]), mid, -6.55);
      ctx.restore();
    }
    function diagramText(ctx) {
      var f = info(day);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      ctx.textAlign = "right";
      FlashText.fillStatic(ctx, t("tm.altLabel"), 675.5, 337.4);
      FlashText.fillStatic(ctx, t("tm.decLabel"), 675.5, 358.75);
      ctx.textAlign = "left";
      FlashText.fill(ctx, f.alt, 679.45, 337.47 + TB);
      FlashText.fill(ctx, f.dec, 679.45, 358.82 + TB);
    }
    function timeline(ctx) {
      var ox = TL.x, oy = TL.y;
      ctx.save(); ctx.translate(ox, oy);
      ctx.fillStyle = "#999999";                     // days with no image (or overcast)
      for (var d = 0; d < LEN; d++) {
        var bad = exclude ? (overcast[d] || missing[d]) : missing[d];
        if (!bad) continue;
        var e = d;
        while (e + 1 < LEN && (exclude ? (overcast[e + 1] || missing[e + 1]) : missing[e + 1])) e++;
        ctx.fillRect(d * SCALE, 16, (e + 1 - d) * SCALE, 5);
        d = e;
      }
      var MP = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.beginPath();
      MP.forEach(function (m) { ctx.moveTo(Math.round(m * SCALE) + 0.5, -5); ctx.lineTo(Math.round(m * SCALE) + 0.5, 5); });
      ctx.stroke();
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      for (var i = 0; i < 12; i++) FlashText.fill(ctx, t("tm.s" + i), SCALE * (MP[i] + (MP[i + 1] - MP[i]) / 2), -7.25 + ASC * 12 + TB);
      font(ctx, 10, "italic"); ctx.fillStyle = "#333333"; ctx.textAlign = "left";
      FlashText.fillStatic(ctx, t("tm.noImage"), 2, 31.4);
      if (shadowCursor !== null) {                   // TimelineShadowCursor: a black hairline
        var sx = shadowCursor * SCALE + SCALE / 2;
        ctx.beginPath(); ctx.moveTo(sx, -21 + 11.4); ctx.lineTo(sx, -21 + 31.4); ctx.stroke();
      }
      var cx = day * SCALE + SCALE / 2;              // TimelineCursor: red triangle and 2 px line
      ctx.translate(cx, -21);
      ctx.strokeStyle = "#ff0000"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-0.05, 8.85); ctx.lineTo(0, 41.95); ctx.stroke();
      ctx.fillStyle = "#ff0000"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-5.45, 0); ctx.lineTo(5.45, 0); ctx.lineTo(-0.05, 8.9); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    function draw() {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.save();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.translate(0, OY);
      PANELS.forEach(function (b) { panel(ctx, b); });
      photo(ctx);
      caption(ctx);
      checkBox(ctx, CHK_DIRS, showDirs);
      horizonDiagram(ctx);
      diagramText(ctx);
      pushButton(ctx, BTN, buttonAnimating ? "tm.pause" : "tm.start");
      rateSlider(ctx);
      timeline(ctx);
      checkBox(ctx, CHK_EXCL, exclude);
      circleLabel(ctx);
      ctx.restore();
    }
    S.onDraw(draw);
    setDay(day);
  }
});
