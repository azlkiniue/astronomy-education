/* Variable Star Photometry Analyzer -------------------------------------------------
   Faithful rebuild of NAAP's "variableStarPhotometryAnalyzer.swf" (AS3; the main
   timeline came out of tools/swf-abc.py, the Plot, PlotSeries, DeltaMagOverlay and
   StarHalo classes are in astroUNL/flash-animations).

   It reads the lab's settings.xml — the same night as the Blink Comparator, shared
   through _vspdata.js — and first does the photometry itself: every one of the 113
   frames is rendered with its own noise seed and each star measured through a
   pixel mask of radius 3 + psfRadius = 8,

       flux = totalCounts − totalPixels · noiseMean.

   Pick a comparison star and a star of interest and each observation becomes a
   magnitude difference, Δm = −2.5 log10(f_star / f_comparison), plotted against
   time or against phase for the chosen period. The period search is Stellingwerf's
   phase dispersion minimisation exactly as the SWF runs it: 5 bins and 2 covers
   (M = 10), 12 000 trial periods from 0.2 to 12 days, and

       θ(P) = c2 − c1 · Σ S_j² / n_j,   c1 = (n − 1) / ((Σd² − (Σd)²/n)(n·Nc − M)),
       c2 = c1 · Nc · Σd²

   — the pooled variance inside the phase bins over the total variance, so the
   true period shows up as a deep dip. Periods are kept to four decimals; the PDM
   plot zooms by dragging a window and clicking it (a 1 s cubic ease), or ×3 around
   the period; the difference tool is two draggable bars that read off Δmag.    */
Sim.create({
  id: "variableStarPhotometryAnalyzer",
  width: 900, height: 685,
  strings: {
    en: {
      "va.group": "Analysis", "va.reset": "Reset",
      "va.hint": "Click a steady star first (the comparison), then a star you suspect of varying. Look for the deepest dip in the PDM plot, then drag the triangle onto it — or type the period — and switch the lightcurve to phase to see it fold.",
      "va.rComp": "comparison star", "va.rStar": "star of interest", "va.rPeriod": "period", "va.rTheta": "θ at this period",
      "va.none": "—", "va.day": " d",
      "va.sfTitle": "Star Field", "va.opTitle": "Observations Plot", "va.pdmTitle": "PDM Plot and Period Selection",
      "va.key": "key:", "va.keyComp": "comparison star", "va.keyStar": "star of interest",
      "va.cross": "show crosshairs", "va.plotType": "lightcurve plot type:", "va.time": "time", "va.phase": "phase",
      "va.diff": "show difference tool", "va.period": "period:", "va.days": "days",
      "va.zoomIn": "zoom in around period", "va.zoomOut": "zoom out around period",
      "va.zoomFull": "zoom out to full range", "va.undo": "undo last zoom",
      "va.help": "Click and drag on the plot to create a custom zoom window. Click on the window to complete the zoom.",
      "va.loading": "Loading data, please wait.", "va.done": "% done",
      "va.begin1": "Select two stars to compare by clicking", "va.begin2": "on them in the star field at left.",
      "va.magDiff": "magnitude difference", "va.theta": "theta",
      "va.offLeft": "selected period is off to the left", "va.offRight": "selected period is off to the right",
      "va.mag": "mag"
    },
    id: {
      "va.group": "Analisis", "va.reset": "Atur ulang",
      "va.hint": "Klik dulu bintang yang tetap (pembanding), lalu bintang yang Anda duga berubah-ubah. Cari lembah terdalam pada grafik PDM, seret segitiga ke sana — atau ketik periodenya — lalu ubah kurva cahaya ke fase agar terlipat.",
      "va.rComp": "bintang pembanding", "va.rStar": "bintang sasaran", "va.rPeriod": "periode", "va.rTheta": "θ pada periode ini",
      "va.none": "—", "va.day": " h",
      "va.sfTitle": "Medan Bintang", "va.opTitle": "Grafik Pengamatan", "va.pdmTitle": "Grafik PDM dan Pemilihan Periode",
      "va.key": "ket.:", "va.keyComp": "bintang pembanding", "va.keyStar": "bintang sasaran",
      "va.cross": "garis bidik", "va.plotType": "jenis kurva cahaya:", "va.time": "waktu", "va.phase": "fase",
      "va.diff": "alat selisih", "va.period": "periode:", "va.days": "hari",
      "va.zoomIn": "perbesar di periode", "va.zoomOut": "perkecil di periode",
      "va.zoomFull": "rentang penuh", "va.undo": "batalkan zoom",
      "va.help": "Klik dan seret pada grafik untuk membuat jendela zoom. Klik jendela itu untuk menyelesaikan zoom.",
      "va.loading": "Memuat data, harap tunggu.", "va.done": "% selesai",
      "va.begin1": "Pilih dua bintang untuk dibandingkan dengan", "va.begin2": "mengkliknya di medan bintang sebelah kiri.",
      "va.magDiff": "selisih magnitudo", "va.theta": "theta",
      "va.offLeft": "periode terpilih ada di luar kiri", "va.offRight": "periode terpilih ada di luar kanan",
      "va.mag": "mag"
    }
  },
  about: {
    en: "<p>This is the last step of the Variable Star Photometry lab: turning a night's worth of CCD frames into a period. Every frame has already been measured by aperture photometry — the light inside a small circle round each star, minus what the sky alone would have put there.</p>" +
        "<p><b>Differential photometry.</b> A single star's brightness wanders from frame to frame for reasons that have nothing to do with the star: thin cloud, the star's height above the horizon, the exposure. A second star in the same frame suffers exactly the same, so the magnitude <i>difference</i> between the two cancels all of it. Pick a steady comparison star first, then the star you want to study; if the difference jumps about, the second star is the variable one.</p>" +
        "<p><b>Finding the period.</b> The observations are scattered over three weeks, with gaps, so the period is not obvious by eye. Phase dispersion minimisation tries thousands of periods: each one folds the data onto a single cycle, sorts it into phase bins and asks how much the points in each bin disagree. The statistic θ is that scatter divided by the scatter of the data as a whole — about 1 for a wrong period, much smaller for the right one. The deepest dip is the answer, although halves and doubles of the true period and aliases from the nightly gaps can dip too.</p>" +
        "<p>Zoom in on the dip, drag the triangle to its bottom, and switch the lightcurve to <b>phase</b>: at the right period the scattered points line up into one smooth cycle. The field holds twenty-one steady stars, four pulsating stars — among them δ Cephei at 5.37 days — and one eclipsing binary, TW Cassiopeiae.</p>",
    id: "<p>Inilah langkah terakhir praktikum Fotometri Bintang Variabel: mengubah citra CCD semalam menjadi sebuah periode. Setiap citra sudah diukur dengan fotometri apertur — cahaya di dalam lingkaran kecil di sekitar tiap bintang, dikurangi cahaya yang semestinya berasal dari langit saja.</p>" +
        "<p><b>Fotometri diferensial.</b> Kecerlangan satu bintang berubah-ubah dari citra ke citra karena hal yang tak ada hubungannya dengan bintang itu: awan tipis, ketinggian bintang di atas horizon, lama pencahayaan. Bintang kedua di citra yang sama mengalami hal serupa, sehingga <i>selisih</i> magnitudo keduanya menghapus semua itu. Pilih dulu bintang pembanding yang tetap, lalu bintang yang ingin Anda teliti; jika selisihnya naik-turun, bintang kedua itulah yang variabel.</p>" +
        "<p><b>Mencari periode.</b> Pengamatan tersebar selama tiga minggu dan berselang-seling, sehingga periodenya tak tampak jelas oleh mata. Minimisasi dispersi fase mencoba ribuan periode: tiap periode melipat data menjadi satu siklus, membaginya ke dalam kotak fase, lalu menilai seberapa jauh titik-titik di tiap kotak berselisih. Statistik θ adalah sebaran itu dibagi sebaran data secara keseluruhan — sekitar 1 untuk periode yang salah, jauh lebih kecil untuk yang benar. Lembah terdalam adalah jawabannya, meski setengah dan dua kali periode sebenarnya serta alias dari jeda antarmalam juga dapat membentuk lembah.</p>" +
        "<p>Perbesar lembah itu, seret segitiga ke dasarnya, lalu ubah kurva cahaya ke <b>fase</b>: pada periode yang tepat, titik-titik yang tersebar berjajar menjadi satu siklus yang mulus. Medan ini memuat dua puluh satu bintang tetap, empat bintang berdenyut — di antaranya δ Cephei dengan periode 5,37 hari — dan satu bintang ganda gerhana, TW Cassiopeiae.</p>"
  },
  build: function (S) {
    var OY = -30;                                   // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif";
    var TAU = Math.PI * 2;

    /* ------------------------------------------------ the SWF's own art */
    var ART = {
      132: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.013428,0.013443,0.0,71.0,11.0],s:[[0,"#585f63"],[1,"#b7babc"]]},"M41 21L78.15 21Q81 20.95 81 18L81 4Q81 1.05 78.15 1L41 1L41 0L78 0Q82 0 82 4L82 18Q82 22 78 22L41 22L41 21Z"],[{t:"l",m:[0.0,-0.013428,-0.013443,0.0,11.05,11.0],s:[[0,"#585f63"],[1,"#b7babc"]]},"M41 1L3.9 1Q1 1.05 1 4L1 18Q1 20.95 3.9 21L41 21L41 22L4.05 22Q0 22 0 18L0 4Q0 0 4.05 0L41 0L41 1Z"]],[]],[[[{t:"l",m:[0.0,-0.013428,0.013443,0.0,71.0,11.0],s:[[0,"rgba(204,204,204,0.4)"],[1,"rgba(255,255,255,0.6)"]]},"M41.05 1L78.15 1Q81.05 1.05 81.05 4L81.05 18Q81.05 20.95 78.15 21L41.05 21L41.05 1Z"],[{t:"l",m:[0.0,-0.013428,-0.013443,0.0,11.05,11.0],s:[[0,"rgba(204,204,204,0.4)"],[1,"rgba(255,255,255,0.6)"]]},"M41.05 21L3.9 21Q1 20.95 1.05 18L1.05 4Q1 1.05 3.9 1L41.05 1L41.05 21Z"]],[]],[[[{t:"l",m:[0.0,-0.003967,0.018326,0.0,80.5,4.75],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M41 1L78 1Q81 1 81 4L81.05 12L41 12L41 1Z"],[{t:"l",m:[0.0,-0.006409,0.018326,0.0,61.55,6.75],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M41 12L1.05 12L1 4Q1 1 4 1L41 1L41 12Z"]],[]]]},
      122: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.013428,0.013443,0.0,71.0,11.0],s:[[0,"#0075bf"],[0.9922,"#009dff"]]},"M41 0L78 0Q82 0 82 4L82 18Q82 22 78 22L41 22L41 21L78.15 21Q81 20.95 81 18L81 4Q81 1.05 78.15 1L41 1L41 0Z"],[{t:"l",m:[0.0,-0.013428,-0.013443,0.0,11.05,11.0],s:[[0,"#0075bf"],[0.9922,"#009dff"]]},"M41 22L4.05 22Q0 22 0 18L0 4Q0 0 4.05 0L41 0L41 1L3.9 1Q1 1.05 1 4L1 18Q1 20.95 3.9 21L41 21L41 22Z"]],[]],[[[{t:"l",m:[0.0,-0.013428,0.013443,0.0,71.0,11.0],s:[[0,"rgba(204,204,204,0.4)"],[1,"rgba(255,255,255,0.6)"]]},"M81.05 18Q81.05 20.95 78.15 21L3.9 21Q1 20.95 1.05 18L1.05 4Q1 1.05 3.9 1L78.15 1Q81.05 1.05 81.05 4L81.05 18Z"]],[]],[[[{t:"l",m:[0.0,-0.003967,0.018326,0.0,80.5,4.75],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M41 1L78 1Q80.95 1 81 4L81 12L41 12L41 1Z"],[{t:"l",m:[0.0,-0.006409,0.018326,0.0,61.55,6.75],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M41 12L1 12L1 4Q1 1 4 1L41 1L41 12Z"]],[]]]},
      118: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.013428,0.013443,0.0,71.0,11.0],s:[[0,"#0075bf"],[0.9922,"#009dff"]]},"M41 0L78 0Q82 0 82 4L82 18Q82 22 78 22L41 22L41 21L78.15 21Q81 20.95 81 18L81 4Q81 1.05 78.15 1L41 1L41 0Z"],[{t:"l",m:[0.0,-0.013428,-0.013443,0.0,11.05,11.0],s:[[0,"#0075bf"],[0.9922,"#009dff"]]},"M41 22L4.05 22Q0 22 0 18L0 4Q0 0 4.05 0L41 0L41 1L3.9 1Q1 1.05 1 4L1 18Q1 20.95 3.9 21L41 21L41 22Z"]],[]],[[[{t:"l",m:[0.0,-0.013428,0.013443,0.0,71.0,11.0],s:[[0,"#99d7fe"],[1,"#d9f0fe"]]},"M78.15 21L41.05 21L41.05 1L78.15 1Q81.05 1.05 81.05 4L81.05 18Q81.05 20.95 78.15 21Z"],[{t:"l",m:[0.0,-0.013428,-0.013443,0.0,11.05,11.0],s:[[0,"#99d7fe"],[1,"#d9f0fe"]]},"M41.05 1L41.05 21L3.9 21Q1 20.95 1.05 18L1.05 4Q1 1.05 3.9 1L41.05 1Z"]],[]],[[[{t:"l",m:[0.0,-0.003967,0.018326,0.0,80.5,4.75],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M41 1L78 1Q80.95 1 81 4L81 12L41 12L41 1Z"],[{t:"l",m:[0.0,-0.006409,0.018326,0.0,61.55,6.75],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M41 12L1 12L1 4Q1 1 4 1L41 1L41 12Z"]],[]]]},
      116: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.013428,0.013443,0.0,71.0,11.0],s:[[0,"rgba(88,95,99,0.302)"],[1,"rgba(183,186,188,0.302)"]]},"M41 21L78.15 21Q81.05 20.95 81.05 18L81.05 4Q81.05 1.05 78.15 1L41 1L41 0L78.05 0Q82.05 0 82.05 4L82.05 18Q82.05 22 78.05 22L41 22L41 21Z"],[{t:"l",m:[0.0,-0.013428,-0.013443,0.0,11.05,11.0],s:[[0,"rgba(88,95,99,0.302)"],[1,"rgba(183,186,188,0.302)"]]},"M41 1L3.9 1Q1 1.05 1.05 4L1.05 18Q1 20.95 3.9 21L41 21L41 22L4.05 22Q0 22 0.05 18L0.05 4Q0 0 4.05 0L41 0L41 1Z"]],[]],[[[{t:"l",m:[0.0,-0.013428,0.013443,0.0,71.0,11.0],s:[[0,"rgba(204,204,204,0.2)"],[1,"rgba(255,255,255,0.302)"]]},"M81.05 18Q81.05 20.95 78.15 21L3.9 21Q1 20.95 1.05 18L1.05 4Q1 1.05 3.9 1L78.15 1Q81.05 1.05 81.05 4L81.05 18Z"]],[]],[[[{t:"l",m:[0.0,-0.003967,0.018326,0.0,80.5,4.75],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.153)"]]},"M81.05 12L1.05 12L1 4Q1 1 4 1L78 1Q81 1 81 4L81.05 12Z"]],[]]]},
      100: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.007324,0.007324,0.0,5.95,6.3],s:[[0,"rgba(204,204,204,0.4)"],[1,"rgba(255,255,255,0.6)"]]},"M11.25 11.25Q9.5 13 7 13Q4.5 13 2.75 11.25Q1 9.5 1 7Q1 4.7 2.5 3.05L2.75 2.75Q4.5 1 7 1Q9.5 1 11.25 2.75L11.55 3.05Q13 4.7 13 7Q13 9.5 11.25 11.25Z"],[{t:"l",m:[0.0,-0.008942,0.008942,0.0,7.5,6.65],s:[[0,"#5b5d5e"],[1,"#b7babc"]]},"M11.95 2.05L12.8 3.05Q14 4.75 14 7Q14 9.9 11.95 11.95Q9.9 14 7 14Q4.1 14 2.05 11.95Q0 9.9 0 7Q0 4.75 1.2 3.05L2.05 2.05Q4.1 0 7 0Q9.9 0 11.95 2.05ZM7 13Q9.5 13 11.25 11.25Q13 9.5 13 7Q13 4.7 11.55 3.05L11.25 2.75Q9.5 1 7 1Q4.5 1 2.75 2.75L2.5 3.05Q1 4.7 1 7Q1 9.5 2.75 11.25Q4.5 13 7 13Z"]],[]],[[[{t:"l",m:[0.0,-0.003723,0.007324,0.0,5.9,4.0],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M2.75 2.75Q4.5 1 7 1Q9.5 1 11.25 2.75L11.55 3.05Q13 4.7 13 7L1 7Q1 4.7 2.5 3.05L2.75 2.75Z"]],[]]]},
      102: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.007324,0.007324,0.0,5.95,6.3],s:[[0,"rgba(238,238,238,0.651)"],[1,"rgba(255,255,255,0.753)"]]},"M13 7Q13 9.5 11.25 11.25Q9.5 13 7 13Q4.5 13 2.75 11.25Q1 9.5 1 7Q1 4.5 2.75 2.75Q4.5 1 7 1Q9.5 1 11.25 2.75Q13 4.5 13 7Z"],[{t:"l",m:[0.0,-0.009613,0.009613,0.0,7.25,7.0],s:[[0,"#0075bf"],[0.9922,"#009dff"]]},"M11.25 11.25Q13 9.5 13 7Q13 4.5 11.25 2.75Q9.5 1 7 1Q4.5 1 2.75 2.75Q1 4.5 1 7Q1 9.5 2.75 11.25Q4.5 13 7 13Q9.5 13 11.25 11.25ZM7 0Q9.9 0 11.95 2.05Q14 4.1 14 7Q14 9.9 11.95 11.95Q9.9 14 7 14Q4.1 14 2.05 11.95Q0 9.9 0 7Q0 4.1 2.05 2.05Q4.1 0 7 0Z"]],[]],[[[{t:"l",m:[0.0,-0.003723,0.007324,0.0,5.9,4.05],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M2.75 2.8Q4.5 1.05 7 1.05Q9.5 1.05 11.25 2.8L11.55 3.1Q13 4.75 13 7.05L1 7.05Q1 4.75 2.5 3.1L2.75 2.8Z"]],[]]]},
      104: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.007324,0.007324,0.0,5.95,6.3],s:[[0,"#99d7fe"],[1,"#d9f0fe"]]},"M11.25 11.25Q9.5 13 7 13Q4.5 13 2.75 11.25Q1 9.5 1 7Q1 4.5 2.75 2.75Q4.5 1 7 1Q9.5 1 11.25 2.75Q13 4.5 13 7Q13 9.5 11.25 11.25Z"],[{t:"l",m:[0.0,-0.009613,0.009613,0.0,7.25,7.0],s:[[0,"#0075bf"],[0.9922,"#009dff"]]},"M7 13Q9.5 13 11.25 11.25Q13 9.5 13 7Q13 4.5 11.25 2.75Q9.5 1 7 1Q4.5 1 2.75 2.75Q1 4.5 1 7Q1 9.5 2.75 11.25Q4.5 13 7 13ZM11.95 2.05Q14 4.1 14 7Q14 9.9 11.95 11.95Q9.9 14 7 14Q4.1 14 2.05 11.95Q0 9.9 0 7Q0 4.1 2.05 2.05Q4.1 0 7 0Q9.9 0 11.95 2.05Z"]],[]],[[[{t:"l",m:[0.0,-0.003723,0.007324,0.0,5.9,4.0],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M2.75 2.75Q4.5 1 7 1Q9.5 1 11.25 2.75L11.55 3.05Q13 4.7 13 7L1 7Q1 4.7 2.5 3.05L2.75 2.75Z"]],[]]]},
      106: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.007324,0.007324,0.0,5.95,6.3],s:[[0,"rgba(204,204,204,0.2)"],[1,"rgba(255,255,255,0.302)"]]},"M13 7Q13 9.5 11.25 11.25Q9.5 13 7 13Q4.5 13 2.75 11.25Q1 9.5 1 7Q1 4.7 2.5 3.05L2.75 2.75Q4.5 1 7 1Q9.5 1 11.25 2.75L11.55 3.05Q13 4.7 13 7Z"],[{t:"l",m:[0.0,-0.008942,0.008942,0.0,7.5,6.65],s:[[0,"rgba(91,93,94,0.302)"],[1,"rgba(183,186,188,0.302)"]]},"M11.25 11.25Q13 9.5 13 7Q13 4.7 11.55 3.05L11.25 2.75Q9.5 1 7 1Q4.5 1 2.75 2.75L2.5 3.05Q1 4.7 1 7Q1 9.5 2.75 11.25Q4.5 13 7 13Q9.5 13 11.25 11.25ZM11.95 2.05L12.8 3.05Q14 4.75 14 7Q14 9.9 11.95 11.95Q9.9 14 7 14Q4.1 14 2.05 11.95Q0 9.9 0 7Q0 4.75 1.2 3.05L2.05 2.05Q4.1 0 7 0Q9.9 0 11.95 2.05Z"]],[]],[[[{t:"l",m:[0.0,-0.003723,0.007324,0.0,5.9,4.0],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M2.75 2.75Q4.5 1 7 1Q9.5 1 11.25 2.75L11.55 3.05Q13 4.7 13 7L1 7Q1 4.7 2.5 3.05L2.75 2.75Z"]],[]]]},
      108: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.008942,0.008942,0.0,7.5,6.65],s:[[0,"#5b5d5e"],[1,"#b7babc"]]},"M7 13Q9.5 13 11.25 11.25Q13 9.5 13 7Q13 4.5 11.25 2.75Q9.5 1 7 1Q4.5 1 2.75 2.75Q1 4.5 1 7Q1 9.5 2.75 11.25Q4.5 13 7 13ZM7 0Q9.9 0 11.95 2.05Q14 4.1 14 7Q14 9.9 11.95 11.95Q9.9 14 7 14Q4.1 14 2.05 11.95Q0 9.9 0 7Q0 4.1 2.05 2.05Q4.1 0 7 0Z"],[{t:"l",m:[0.0,-0.007324,0.007324,0.0,5.95,6.3],s:[[0,"rgba(204,204,204,0.4)"],[1,"rgba(255,255,255,0.6)"]]},"M11.25 11.25Q9.5 13 7 13Q4.5 13 2.75 11.25Q1 9.5 1 7Q1 4.5 2.75 2.75Q4.5 1 7 1Q9.5 1 11.25 2.75Q13 4.5 13 7Q13 9.5 11.25 11.25Z"]],[]],[[[{t:"l",m:[0.0,-0.003723,0.007324,0.0,5.9,3.95],s:[[0,"rgba(204,204,204,0)"],[1,"rgba(255,255,255,0.302)"]]},"M2.75 2.7Q4.5 0.95 7 0.95Q9.5 0.95 11.25 2.7L11.55 3Q13 4.65 13 6.95L1 6.95Q1 4.65 2.5 3L2.75 2.7Z"]],[]]]},
      109: {nz:false, layers:[[[["#333333","M2 4Q0 4 0 2Q0 0 2 0Q4 0 4 2Q4 4 2 4Z"]],[]]]},
      84: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.007874,0.007874,0.0,8.5,6.45],s:[[0,"#5b5d5e"],[1,"#b7babc"]]},"M13 1L1 1L1 13L13 13L13 1ZM0 14L0 0L14 0L14 14L0 14Z"]],[]],[[[{t:"l",m:[0.0,-0.008316,0.008316,0.0,6.0,7.15],s:[[0,"rgba(204,204,204,0.4)"],[1,"rgba(255,255,255,0.6)"]]},"M1 1L13 1L13 13L1 13L1 1Z"]],[]],[[[{t:"l",m:[0.0,-0.004089,0.008316,0.0,6.0,4.35],s:[[0,"rgba(238,238,238,0)"],[1,"rgba(255,255,255,0.302)"]]},"M13 7.5L1 7.5L1 1L13 1L13 7.5Z"]],[]]]},
      86: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.008865,0.008865,0.0,7.8,6.45],s:[[0,"#0075bf"],[0.9922,"#009dff"]]},"M0 14L0 0L14 0L14 14L0 14ZM1 1L1 13L13 13L13 1L1 1Z"]],[]],[[[{t:"l",m:[0.0,-0.008316,0.008316,0.0,6.0,7.15],s:[[0,"rgba(238,238,238,0.651)"],[1,"rgba(255,255,255,0.753)"]]},"M1 13L1 1L13 1L13 13L1 13Z"]],[]],[[[{t:"l",m:[0.0,-0.004089,0.008316,0.0,6.0,4.35],s:[[0,"rgba(238,238,238,0)"],[1,"rgba(255,255,255,0.302)"]]},"M13 7.5L1 7.5L1 1L13 1L13 7.5Z"]],[]]]},
      88: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.008865,0.008865,0.0,7.8,6.45],s:[[0,"#0075bf"],[0.9922,"#009dff"]]},"M0 14L0 0L14 0L14 14L0 14ZM1 1L1 13L13 13L13 1L1 1Z"]],[]],[[[{t:"l",m:[0.0,-0.008316,0.008316,0.0,6.0,7.15],s:[[0,"#99d7fe"],[1,"#d9f0fe"]]},"M13 1L13 13L1 13L1 1L13 1Z"]],[]],[[[{t:"l",m:[0.0,-0.004089,0.008316,0.0,6.0,4.35],s:[[0,"rgba(238,238,238,0)"],[1,"rgba(255,255,255,0.302)"]]},"M13 7.5L1 7.5L1 1L13 1L13 7.5Z"]],[]]]},
      90: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.007874,0.007874,0.0,8.5,6.45],s:[[0,"rgba(91,93,94,0.302)"],[1,"rgba(183,186,188,0.302)"]]},"M13 13L13 1L1 1L1 13L13 13ZM14 14L0 14L0 0L14 0L14 14Z"]],[]],[[[{t:"l",m:[0.0,-0.008316,0.008316,0.0,6.0,7.15],s:[[0,"rgba(204,204,204,0.2)"],[1,"rgba(255,255,255,0.302)"]]},"M1 1L13 1L13 13L1 13L1 1Z"]],[]],[[[{t:"l",m:[0.0,-0.008316,0.008316,0.0,6.0,7.15],s:[[0,"rgba(204,204,204,0.2)"],[1,"rgba(255,255,255,0.302)"]]},"M13 1L13 13L1 13L1 1L13 1Z"]],[]],[[[{t:"l",m:[0.0,-0.004089,0.008316,0.0,6.0,4.35],s:[[0,"rgba(238,238,238,0)"],[1,"rgba(255,255,255,0.302)"]]},"M13 7.5L1 7.5L1 1L13 1L13 7.5Z"]],[]]]},
      92: {nz:false, layers:[[[["#000000","M0 3.8L1.95 3.65L3.5 6.75L7.85 0L10 0L8.85 1.4L4.5 9L2.25 9L0 3.8Z"]],[]]]},
      97: {nz:false, layers:[[[[{t:"l",m:[0.0,-0.007874,0.007874,0.0,8.5,6.45],s:[[0,"rgba(91,93,94,0.302)"],[1,"rgba(183,186,188,0.302)"]]},"M14 14L0 14L0 0L14 0L14 14ZM1 13L13 13L13 1L1 1L1 13Z"]],[]],[[[{t:"l",m:[0.0,-0.008316,0.008316,0.0,6.0,7.15],s:[[0,"rgba(204,204,204,0.2)"],[1,"rgba(255,255,255,0.302)"]]},"M13 13L1 13L1 1L13 1L13 13Z"]],[]],[[[{t:"l",m:[0.0,-0.004089,0.008316,0.0,6.0,4.35],s:[[0,"rgba(238,238,238,0)"],[1,"rgba(255,255,255,0.302)"]]},"M13 7.5L1 7.5L1 1L13 1L13 7.5Z"]],[]]]},
      77: {nz:false, layers:[[[["#c9cbcc","M151 21L151 1L151 0L152 0L152 22L151 22L151 21ZM1 1L1 21L1 22L0 22L0 1L1 1Z"],["#6d6f70","M151 1L1 1L0 1L0 0L151 0L151 1Z"],["#d3d5d6","M1 21L151 21L151 22L1 22L1 21Z"],["#ffffff","M151 1L151 21L1 21L1 1L151 1Z"]],[]]]},
      1: {nz:false, layers:[[[["#c9cbcc","M1 21L1 22L0 22L0 1L1 1L1 21ZM151 22L151 21L151 1L151 0L152 0L152 22L151 22Z"],["#6d6f70","M151 0L151 1L1 1L0 1L0 0L151 0Z"],["#d3d5d6","M151 21L151 22L1 22L1 21L151 21Z"],["#ffffeb","M151 1L151 21L1 21L1 1L151 1Z"]],[]]]},
      146: {nz:false, layers:[[[["#cacadf","M0 7.8L-8.05 -7.8L8.1 -7.8L0 7.8Z"]],[[1.0,"#36365a","M0 7.8L-8.05 -7.8L8.1 -7.8L0 7.8"]]]]},
      153: {nz:false, layers:[[[["#6f6f88","M8 -6.1L5.4 -0.4L30.15 -0.4L30.15 1.6L5.45 1.6L8.05 7.3L-0.15 0.6L8 -6.1Z"]],[]]]},
      156: {nz:false, layers:[[[["#6f6f88","M191.9 -0.5L216.6 -0.5L214 -6.2L222.2 0.5L214.05 7.2L216.65 1.5L191.9 1.5L191.9 -0.5Z"]],[]]]},
      169: {nz:false, layers:[[[["#cccccc","M24 -40.45L24 -24.5Q24 -16 15.55 -16L-15.55 -16Q-24 -16 -24 -24.5L-24 -40.45Q-24 -49 -15.55 -49L15.55 -49Q24 -49 24 -40.45Z"]],[]],[[["#ffffff","M14.9 -48Q23 -48 23 -40L23 -25Q23 -17 14.9 -17L-14.9 -17Q-23 -17 -23 -25L-23 -40Q-23 -48 -14.9 -48L14.9 -48Z"]],[]],[[],[[1.0,"#cccccc","M0 -3L0 -10M10 0L3 0M-3 0.3L-10 0.3"]]]]}
    };
    var PATHS = {};
    Object.keys(ART).forEach(function (id) {
      PATHS[id] = ART[id].layers.map(function (L) {
        return {
          fills: L[0].map(function (f) { return { style: f[0], path: new Path2D(f[1]) }; }),
          strokes: L[1].map(function (s) { return { w: s[0], style: s[1], path: new Path2D(s[2]) }; })
        };
      });
    });
    function paintOf(g, st) {
      if (typeof st === "string") return st;
      var m = st.m, grad;
      if (st.t === "l") {
        var det = m[0] * m[3] - m[1] * m[2];
        if (!det) return st.s[0][1];
        var ix = m[3] / det, iy = -m[2] / det, q = ix * ix + iy * iy;
        var ax = m[4] - 819.2 * ix / q, ay = m[5] - 819.2 * iy / q;
        grad = g.createLinearGradient(ax, ay, ax + 1638.4 * ix / q, ay + 1638.4 * iy / q);
      } else {
        grad = g.createRadialGradient(m[4], m[5], 0, m[4], m[5], 819.2 * Math.hypot(m[0], m[1]));
      }
      st.s.forEach(function (s) { grad.addColorStop(s[0], s[1]); });
      return grad;
    }
    function drawShape(g, id) {
      PATHS[id].forEach(function (L) {
        L.fills.forEach(function (f) { g.fillStyle = paintOf(g, f.style); g.fill(f.path, "evenodd"); });
        L.strokes.forEach(function (s) {
          g.lineWidth = s.w; g.strokeStyle = paintOf(g, s.style); g.stroke(s.path);
        });
      });
    }
    function draw9(g, id, grid, sw, sh, x, y, w, h) {
      var xs = [0, grid[0], grid[1], sw], ys = [0, grid[2], grid[3], sh];
      var xd = [0, grid[0], w - (sw - grid[1]), w], yd = [0, grid[2], h - (sh - grid[3]), h];
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          var kx = (xd[i + 1] - xd[i]) / (xs[i + 1] - xs[i]), ky = (yd[j + 1] - yd[j]) / (ys[j + 1] - ys[j]);
          g.save();
          g.beginPath(); g.rect(x + xd[i], y + yd[j], xd[i + 1] - xd[i], yd[j + 1] - yd[j]); g.clip();
          g.translate(x + xd[i] - xs[i] * kx, y + yd[j] - ys[j] * ky);
          g.scale(kx, ky);
          drawShape(g, id);
          g.restore();
        }
      }
    }
    function checker(size, c1, c2) {                // Flash's BitmapData checkerboards
      var c = document.createElement("canvas"); c.width = c.height = 2 * size;
      var g = c.getContext("2d");
      g.fillStyle = c1; g.fillRect(0, 0, size, size); g.fillRect(size, size, size, size);
      g.fillStyle = c2; g.fillRect(size, 0, size, size); g.fillRect(0, size, size, size);
      return S.ctx.createPattern(c, "repeat");
    }
    var ZOOM_CHECKER = checker(2, "rgba(208,208,208,0.314)", "rgba(160,160,160,0.314)");
    var DIFF_CHECKER = checker(4, "rgba(240,240,240,0.314)", "rgba(192,192,192,0.314)");

    /* --------------------------------------------------------- the data */
    var F = VSP.FIELD, OBS = VSP.OBS;
    var FIELD = { x: 14, y: 62 + OY, w: F.width, h: F.height };
    var MASK = STARFIELD.pixelMask(3 + F.psfRadius);
    var PSF = STARFIELD.airyDisc(F.psfRadius);
    var STARS = VSP.STARS.map(function (st, i) { return { i: i, x: st.x, y: st.y, src: st, flux: [] }; });
    var minEpoch = Infinity, maxEpoch = -Infinity;
    OBS.forEach(function (o) { minEpoch = Math.min(minEpoch, o[0]); maxEpoch = Math.max(maxEpoch, o[0]); });
    var minT = Math.floor(minEpoch - 1), maxT = Math.ceil(maxEpoch + 1);
    var fieldImage = null, genIndex = 0, genDone = false;

    function renderObservation(k) {
      var o = OBS[k];
      return STARFIELD.render({ width: F.width, height: F.height, noiseMean: F.noiseMean,
        noiseSigma: F.noiseSigma, saturationMagnitude: F.saturationMagnitude, seed: o[1], psf: PSF,
        stars: STARS.map(function (s) { return { x: s.x, y: s.y, magnitude: VSP.magnitudeAt(s.src, o[0]) }; }) });
    }
    /* generateDataFunc: one frame at a time, ~30 ms of work per slice */
    var channel = new MessageChannel();
    channel.port1.onmessage = generate;
    function generate() {
      var t0 = performance.now();
      while (genIndex < OBS.length && performance.now() - t0 < 30) {
        var counts = renderObservation(genIndex);
        STARS.forEach(function (s) {
          var st = STARFIELD.stats(counts, F.width, F.height, s.x, s.y, MASK);
          s.flux.push(st.totalCounts - st.totalPixels * F.noiseMean);
        });
        if (genIndex === 0) {                       // the field shown is the first frame
          var c = document.createElement("canvas"); c.width = F.width; c.height = F.height;
          var g = c.getContext("2d"), img = g.createImageData(F.width, F.height);
          STARFIELD.paint(img, counts, false); g.putImageData(img, 0, 0);
          fieldImage = c;
        }
        genIndex++;
      }
      if (genIndex < OBS.length) channel.port2.postMessage(0);
      else genDone = true;
      S.requestDraw();
    }

    /* ------------------------------------------------------------ plots */
    /* edu.unl.astro.utils.Plot: origin at the bottom-left, ticks outside, labels
       7 px out in 12 px Verdana, tick spacing from getTickmarksInfo            */
    function Plot(x, y, w, h) {
      this.x = x; this.y = y; this.w = w; this.h = h;
      this.xMin = 0; this.xMax = 10; this.yMin = 0; this.yMax = 1; this.invertY = false;
    }
    Plot.prototype.px = function (v) { return this.x + this.w * (v - this.xMin) / (this.xMax - this.xMin); };
    Plot.prototype.py = function (v) {
      var f = (v - this.yMin) / (this.yMax - this.yMin);
      return this.invertY ? this.y - this.h + f * this.h : this.y - f * this.h;
    };
    Plot.prototype.vx = function (px) { return this.xMin + (px - this.x) * (this.xMax - this.xMin) / this.w; };
    function ticks(len, min, max, minTick, minLabel, inverted) {
      var scale = len / (max - min), minSp = minTick / scale, minLab = minLabel / scale;
      var prec = Math.ceil(Math.log(minSp) / Math.LN10), sp = Math.pow(10, prec), longs, mediums, labels, i;
      if (sp / 2 >= minSp) {
        sp /= 2; longs = 20; mediums = 2;
        for (i = 1; i <= 100000; i *= 10) {
          if (minLab <= i * sp) { labels = i; prec -= 1; break; }
          else if (minLab <= 2 * i * sp) { labels = 2 * i; break; }
          prec += 1;
        }
      } else {
        longs = 10; mediums = 5;
        for (i = 1; i <= 100000; i *= 10) {
          if (minLab <= i * sp) { labels = i; break; }
          else if (minLab <= 5 * i * sp) { labels = 5 * i; break; }
          prec += 1;
        }
      }
      var out = [], start = Math.ceil(min / sp), limit = 1 + Math.floor(max / sp);
      for (i = start; i < limit; i++) {
        var v = i * sp, pos = scale * (v - min);
        if (inverted) pos = len - pos;
        out.push({ pos: pos, len: i % longs === 0 ? 6 : i % mediums === 0 ? 4 : 2,
          label: i % labels === 0 ? fmt(v, prec) : null });
      }
      return out;
    }
    function fmt(v, place) {
      if (place >= 0) { var p = Math.pow(10, place); return String(p * Math.round(v / p)); }
      return v.toFixed(-place);
    }
    Plot.prototype.frame = function (ctx) {
      var P = this;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(P.x, P.y - P.h, P.w, P.h);
    };
    Plot.prototype.axes = function (ctx) {
      var P = this;
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.strokeRect(P.x + 0.5, P.y - P.h + 0.5, P.w, P.h);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT; ctx.textBaseline = "alphabetic";
      ctx.beginPath();
      ctx.textAlign = "center";
      ticks(P.w, P.xMin, P.xMax, 9, 34, false).forEach(function (t) {
        var x = Math.round(P.x + t.pos) + 0.5;
        ctx.moveTo(x, P.y); ctx.lineTo(x, P.y + t.len);
        if (t.label !== null) ctx.fillText(t.label, P.x + t.pos, P.y + 19.6);
      });
      ctx.textAlign = "right";
      ticks(P.h, P.yMin, P.yMax, 9, 25, P.invertY).forEach(function (t) {
        var y = Math.round(P.y - t.pos) + 0.5;
        ctx.moveTo(P.x, y); ctx.lineTo(P.x - t.len, y);
        if (t.label !== null) ctx.fillText(t.label, P.x - 9, P.y - t.pos + 3.8);
      });
      ctx.stroke();
    };
    Plot.prototype.clip = function (ctx) {
      ctx.beginPath(); ctx.rect(this.x, this.y - this.h, this.w, this.h); ctx.clip();
    };

    var lightcurve = new Plot(493, 335 + OY, 380, 260);
    lightcurve.xMin = 0; lightcurve.xMax = 10; lightcurve.yMin = -1.5; lightcurve.yMax = 1.5; lightcurve.invertY = true;
    var MIN_P = 0.2, MAX_P = 12, PREC = 4, RES = 12000;
    var pdm = new Plot(220, 673 + OY, 650, 230);
    pdm.xMin = MIN_P; pdm.xMax = MAX_P; pdm.yMin = 0; pdm.yMax = 1.2;
    var ZOOM_LIMIT = pdm.w * Math.pow(10, -PREC);

    /* ------------------------------------------------------------ state */
    var comparison = null, featured = null, comparisons = null, pdmCurve = null;
    var period = 7, plotType = "epoch", showCross = true, showDiff = false;
    var lastZoom = { min: MIN_P, max: MAX_P }, undoEnabled = false;
    var hover = null, pressed = null, cursorPx = null;
    var zoomWin = null, zoomAnim = null, periodDrag = null, diffDrag = null;
    var diff = { l1: -50, l2: -100, active: null };

    function onHaloClicked(s) {
      if (!genDone) return;
      if (comparison && featured && (s === comparison || s === featured)) {
        var t = comparison; comparison = featured; featured = t;
      } else if (!comparison) comparison = s;
      else featured = s;
      calculateComparisons();
      updatePeriodAndPhases();
      pdmZoomOut();
      computePDM();
      syncReadouts();
    }
    function calculateComparisons() {
      if (!comparison || !featured) { comparisons = null; return; }
      comparisons = [];
      var hi = -Infinity, lo = Infinity;
      for (var k = 0; k < OBS.length; k++) {
        var d = -2.5 * Math.log(featured.flux[k] / comparison.flux[k]) / Math.LN10;
        comparisons.push({ epoch: OBS[k][0], delta: d, phase: 0 });
        hi = Math.max(hi, d); lo = Math.min(lo, d);
      }
      var range = hi - lo;
      if (range < 1) { var mid = lo + range / 2; range = 1; lo = mid - 0.5; hi = mid + 0.5; }
      var pad = 0.1 * range;
      lightcurve.yMin = lo - pad; lightcurve.yMax = hi + pad;
    }
    /* doPDMCalculation, over the 12 000 periods of the full range at once */
    function computePDM() {
      pdmCurve = null;
      if (!comparisons) return;
      var n = comparisons.length, Nb = 5, Nc = 2, M = Nb * Nc, sum = 0, sum2 = 0, k;
      for (k = 0; k < n; k++) { sum += comparisons[k].delta; sum2 += comparisons[k].delta * comparisons[k].delta; }
      var c1 = (n - 1) / ((sum2 - sum * sum / n) * (n * Nc - M)), c2 = c1 * Nc * sum2;
      var start = pdm.xMin, step = (pdm.xMax - pdm.xMin) / (RES - 1);
      var S1 = new Float64Array(M), N1 = new Float64Array(M), out = new Float64Array(RES * 2);
      for (var i = 0; i < RES; i++) {
        var p = start + step * i;
        S1.fill(0); N1.fill(0);
        for (k = 0; k < n; k++) {
          var ph = (comparisons[k].epoch % p) / p;
          for (var c = 0; c < Nc; c++) {
            var b = Math.floor(Nb * (((ph + c / M) % 1) + c));
            S1[b] += comparisons[k].delta; N1[b] += 1;
          }
        }
        var acc = 0;
        for (var j = 0; j < M; j++) if (N1[j]) acc += S1[j] * S1[j] / N1[j];
        out[2 * i] = p; out[2 * i + 1] = c2 - c1 * acc;
      }
      pdmCurve = out;
    }
    function thetaAt(p) {
      if (!pdmCurve) return null;
      var i = Math.round((p - pdmCurve[0]) / (pdmCurve[2] - pdmCurve[0]));
      return i >= 0 && i < RES ? pdmCurve[2 * i + 1] : null;
    }
    function updatePeriodAndPhases() {
      if (comparisons) comparisons.forEach(function (c) { c.phase = ((c.epoch / period) % 1 + 1) % 1; });
      if (!periodField.editing) periodField.set(period.toFixed(PREC));
      syncReadouts();
      S.requestDraw();
    }
    function setPlotType(t) {
      plotType = t;
      if (t === "epoch") { lightcurve.xMin = minT; lightcurve.xMax = maxT; }
      else { lightcurve.xMin = 0; lightcurve.xMax = 1; }
      S.requestDraw();
    }

    /* the PDM zooms */
    function setPdmRange(min, max) {
      zoomWin = null; zoomAnim = null;
      pdm.xMin = min; pdm.xMax = max;
      S.requestDraw();
    }
    function atFull() { return pdm.xMin === MIN_P && pdm.xMax === MAX_P; }
    function pdmZoomOut() {
      if (atFull()) return;
      lastZoom = { min: pdm.xMin, max: pdm.xMax }; undoEnabled = true;
      setPdmRange(MIN_P, MAX_P);
    }
    function pdmZoomBy(f) {
      var w = Math.max(f * (pdm.xMax - pdm.xMin), ZOOM_LIMIT), lo = period - w / 2, hi = period + w / 2;
      if (lo < MIN_P) { lo = MIN_P; hi = Math.min(MIN_P + w, MAX_P); }
      else if (hi > MAX_P) { hi = MAX_P; lo = Math.max(MAX_P - w, MIN_P); }
      var q = Math.pow(10, PREC);
      lo = Math.round(lo * q) / q; hi = Math.round(hi * q) / q;
      if (lo === pdm.xMin && hi === pdm.xMax) return;
      lastZoom = { min: pdm.xMin, max: pdm.xMax }; undoEnabled = true;
      setPdmRange(lo, hi);
    }
    function pdmUndo() {
      var was = { min: pdm.xMin, max: pdm.xMax };
      setPdmRange(lastZoom.min, lastZoom.max);
      lastZoom = was;
    }
    /* Plot.zoomTo: the window's ends ease out to the plot's edges in 1 s */
    function easeInOutCubic(t) { t *= 2; return t < 1 ? t * t * t / 2 : ((t -= 2) * t * t + 2) / 2; }
    function zoomTo(min, max) {
      lastZoom = { min: pdm.xMin, max: pdm.xMax }; undoEnabled = true;   // onZoomStart
      zoomAnim = { t0: performance.now(), from: { min: pdm.xMin, max: pdm.xMax }, to: { min: min, max: max },
        win: { a: pdm.vx(pdm.x + zoomWin.a), b: pdm.vx(pdm.x + zoomWin.b) } };
      requestAnimationFrame(function tick() {
        if (!zoomAnim) return;
        var t = performance.now() - zoomAnim.t0, u = t >= 1000 ? 1 : easeInOutCubic(t / 1000);
        pdm.xMin = zoomAnim.from.min + u * (zoomAnim.to.min - zoomAnim.from.min);
        pdm.xMax = zoomAnim.from.max + u * (zoomAnim.to.max - zoomAnim.from.max);
        zoomWin.a = pdm.px(zoomAnim.win.a) - pdm.x; zoomWin.b = pdm.px(zoomAnim.win.b) - pdm.x;
        if (u >= 1) { zoomAnim = null; zoomWin = null; }
        paint();
        if (zoomAnim) requestAnimationFrame(tick);
      });
    }

    /* ---------------------------------------------------- the sidebar */
    S.group("va.group");
    var outComp = S.readout({ labelKey: "va.rComp" });
    var outStar = S.readout({ labelKey: "va.rStar" });
    var outPeriod = S.readout({ labelKey: "va.rPeriod" });
    var outTheta = S.readout({ labelKey: "va.rTheta" });
    S.button({ labelKey: "va.reset", on: reset });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "va.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var shown = {};
    function put(key, fn, text) { if (shown[key] !== text) { shown[key] = text; fn(text); } }
    function syncReadouts() {
      var none = I18N.t("va.none");
      put("c", outComp, comparison ? "x " + comparison.x + ", y " + comparison.y : none);
      put("s", outStar, featured ? "x " + featured.x + ", y " + featured.y : none);
      put("p", outPeriod, period.toFixed(PREC) + I18N.t("va.day"));
      var th = thetaAt(period);
      put("t", outTheta, th === null ? none : th.toFixed(3));
    }
    S.refreshers.push(function () { shown = {}; syncReadouts(); });
    function reset() {
      comparison = featured = comparisons = pdmCurve = null;
      period = 7; showCross = true; showDiff = false; diff = { l1: -50, l2: -100, active: null };
      lastZoom = { min: MIN_P, max: MAX_P }; undoEnabled = false;
      setPdmRange(MIN_P, MAX_P);
      lightcurve.yMin = -1.5; lightcurve.yMax = 1.5;
      setPlotType("epoch");
      periodField.editing = false;
      updatePeriodAndPhases();
    }

    /* ------------------------------------ the period field (TextInput) */
    /* a real input laid over the canvas where the SWF has its TextInput */
    var TI = { x: 54, y: 455.3 + OY, w: 72, h: 20 };
    var periodField = (function () {
      var wrap = document.createElement("div");
      wrap.style.position = "relative";
      S.canvas.parentNode.insertBefore(wrap, S.canvas);
      wrap.appendChild(S.canvas);
      var input = document.createElement("input");
      input.type = "text"; input.inputMode = "decimal"; input.maxLength = 8;
      input.setAttribute("aria-label", "period (days)");
      input.style.cssText = "position:absolute;border:0;background:transparent;padding:0;margin:0;" +
        "text-align:center;color:#000;outline:none;font-family:Verdana, Geneva, sans-serif;";
      input.style.left = (TI.x / S.W * 100) + "%"; input.style.top = (TI.y / S.H * 100) + "%";
      input.style.width = (TI.w / S.W * 100) + "%"; input.style.height = (TI.h / S.H * 100) + "%";
      wrap.appendChild(input);
      function fit() { input.style.fontSize = (12 * S.canvas.clientWidth / S.W) + "px"; }
      if (window.ResizeObserver) new ResizeObserver(fit).observe(S.canvas); else window.addEventListener("resize", fit);
      fit();
      var api = { editing: false, input: input, set: function (v) { input.value = v; } };
      input.addEventListener("input", function () {
        input.value = input.value.replace(/[^0-9.]/g, "");      // restrict = "0-9."
        api.editing = true; input.style.fontStyle = "italic"; S.requestDraw();
      });
      function enter() {                           // onPeriodEntered
        var v = parseFloat(input.value);
        if (isFinite(v) && v >= MIN_P && v <= MAX_P) period = Math.round(v * 1e4) / 1e4;
        api.editing = false; input.style.fontStyle = "normal";
        updatePeriodAndPhases();
      }
      input.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { enter(); input.blur(); } });
      input.addEventListener("blur", function () { if (api.editing) enter(); });
      return api;
    })();

    /* ------------------------------------------------------ widgets */
    var CHK_CROSS = { x: 302, y: 366.5 + OY, w: 115, key: "va.cross" };
    var CHK_DIFF = { x: 742.3, y: 364.75 + OY, w: 150, key: "va.diff" };
    var RAD_TIME = { x: 582, y: 364.8 + OY, w: 55, key: "va.time", value: "epoch" };
    var RAD_PHASE = { x: 638, y: 364.8 + OY, w: 65, key: "va.phase", value: "phase" };
    var BUTTONS = [
      { id: "zin", x: 26.5, y: 499.5 + OY, w: 127, key: "va.zoomIn", on: function () { pdmZoomBy(1 / 3); },
        enabled: function () { return pdm.xMax - pdm.xMin > ZOOM_LIMIT + 1e-12; } },
      { id: "zout", x: 26.5, y: 533 + OY, w: 127, key: "va.zoomOut", on: function () { pdmZoomBy(3); },
        enabled: function () { return !atFull(); } },
      { id: "zfull", x: 26.5, y: 566.5 + OY, w: 127, key: "va.zoomFull", on: pdmZoomOut,
        enabled: function () { return !atFull(); } },
      { id: "undo", x: 40, y: 600 + OY, w: 100, key: "va.undo", on: pdmUndo,
        enabled: function () { return undoEnabled; } }
    ];
    function inBox(p, b, h) { return p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + (h || 22); }
    function pointerX() {                           // repositionPeriodPointer
      var x = pdm.x + pdm.w * (period - pdm.xMin) / (pdm.xMax - pdm.xMin);
      if (x < pdm.x) return { x: pdm.x - 10, mode: -1 };
      if (x > pdm.x + pdm.w) return { x: pdm.x + pdm.w + 10, mode: 1 };
      return { x: x, mode: 0 };
    }
    var POINTER_Y = 431 + OY;

    function hit(p) {
      if (p.x >= FIELD.x && p.x < FIELD.x + FIELD.w && p.y >= FIELD.y && p.y < FIELD.y + FIELD.h) {
        if (genDone) {
          for (var i = STARS.length - 1; i >= 0; i--) {
            var s = STARS[i];
            if (Math.hypot(p.x - (FIELD.x + s.x + 0.5), p.y - (FIELD.y + s.y + 0.5)) <= 8) return { kind: "halo", star: s };
          }
        }
        return { kind: "field" };
      }
      if (inBox(p, CHK_CROSS)) return { kind: "chkCross" };
      if (inBox(p, CHK_DIFF)) return { kind: "chkDiff" };
      if (inBox(p, RAD_TIME)) return { kind: "radio", value: "epoch" };
      if (inBox(p, RAD_PHASE)) return { kind: "radio", value: "phase" };
      for (var b = 0; b < BUTTONS.length; b++) if (inBox(p, BUTTONS[b])) return { kind: "button", b: BUTTONS[b] };
      var ptr = pointerX();
      if (Math.abs(p.x - ptr.x) <= 9 && Math.abs(p.y - POINTER_Y) <= 9) return { kind: "pointer" };
      if (p.x >= lightcurve.x && p.x <= lightcurve.x + lightcurve.w && p.y >= lightcurve.y - lightcurve.h && p.y <= lightcurve.y) {
        if (showDiff) {
          var ly = p.y - lightcurve.y;
          if (Math.abs(ly - diff.l1) <= 3) return { kind: "diffBar", bar: "l1" };
          if (Math.abs(ly - diff.l2) <= 3) return { kind: "diffBar", bar: "l2" };
          return { kind: "diffArea" };
        }
        return { kind: "lightcurve" };
      }
      if (p.x >= pdm.x && p.x <= pdm.x + pdm.w && p.y >= pdm.y - pdm.h && p.y <= pdm.y) {
        if (zoomWin && zoomWin.listening) {
          var lx = p.x - pdm.x;
          if (lx >= Math.min(zoomWin.a, zoomWin.b) && lx <= Math.max(zoomWin.a, zoomWin.b)) return { kind: "zoomWindow" };
        }
        return { kind: "pdm" };
      }
      return null;
    }
    function at(ev) {
      var b = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - b.left) * S.W / b.width, y: (ev.clientY - b.top) * S.H / b.height };
    }
    function same(a, b) {
      if (!a || !b) return a === b;
      return a.kind === b.kind && a.star === b.star && a.b === b.b && a.value === b.value && a.bar === b.bar;
    }

    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      if (!h || h.kind === "field" || h.kind === "lightcurve") return;
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic events */ }
      ev.preventDefault();
      pressed = h;
      if (h.kind === "halo") { onHaloClicked(h.star); }
      else if (h.kind === "pointer") {
        var ptr = pointerX();
        periodDrag = { off: p.x - ptr.x, mode: ptr.mode, period: period };
      } else if (h.kind === "diffBar" || h.kind === "diffArea") {
        var ly = p.y - lightcurve.y, bar = h.bar;
        if (!bar) {                                 // the nearer bar jumps to the pointer
          bar = Math.abs(ly - diff.l1) < Math.abs(ly - diff.l2) ? "l1" : "l2";
          diff[bar] = ly;
        }
        diff.active = bar;
        diffDrag = { bar: bar, off: ly - diff[bar] };
      } else if (h.kind === "pdm" && !zoomAnim) {
        var lx = Math.max(0, Math.min(pdm.w, p.x - pdm.x));
        zoomWin = { a: lx, b: lx, valid: false, listening: false, dragging: true };
      }
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (p.x >= FIELD.x && p.x < FIELD.x + FIELD.w && p.y >= FIELD.y && p.y < FIELD.y + FIELD.h) {
        var c = { x: Math.floor(p.x - FIELD.x), y: Math.floor(p.y - FIELD.y) };
        if (!cursorPx || c.x !== cursorPx.x || c.y !== cursorPx.y) { cursorPx = c; S.requestDraw(); }
      } else if (cursorPx) { cursorPx = null; S.requestDraw(); }
      if (periodDrag) {                             // continuePeriodDragging
        var x = p.x - periodDrag.off;
        if (periodDrag.mode === 1 && x > pdm.x + pdm.w + 7) period = periodDrag.period;
        else if (periodDrag.mode === -1 && x < pdm.x - 7) period = periodDrag.period;
        else {
          x = Math.max(pdm.x, Math.min(pdm.x + pdm.w, x));
          var v = Math.max(MIN_P, Math.min(MAX_P, pdm.vx(x)));
          period = Math.round(v * 1e4) / 1e4;
          if (period > pdm.xMax) period -= 1e-4; else if (period < pdm.xMin) period += 1e-4;
        }
        updatePeriodAndPhases();
        return;
      }
      if (diffDrag) {
        var y = p.y - lightcurve.y - diffDrag.off;
        diff[diffDrag.bar] = Math.max(-lightcurve.h, Math.min(0, y));
        S.requestDraw();
        return;
      }
      if (zoomWin && zoomWin.dragging) {
        zoomWin.b = Math.max(0, Math.min(pdm.w, p.x - pdm.x));
        zoomWin.valid = zoomWin.a !== zoomWin.b;
        S.requestDraw();
        return;
      }
      var h = hit(p);
      if (!same(h, hover)) {
        hover = h;
        if (showDiff) diff.active = h && h.kind === "diffBar" ? h.bar : null;
        var k = h && h.kind;
        S.canvas.style.cursor = k === "halo" || k === "pointer" || k === "button" || k === "radio" ||
          k === "chkCross" || k === "chkDiff" || k === "zoomWindow" ? "pointer"
          : k === "diffBar" ? "ns-resize" : k === "pdm" ? "crosshair" : "";
        S.requestDraw();
      }
    });
    function release(ev) {
      var p = ev ? at(ev) : null, h = p ? hit(p) : null, was = pressed;
      pressed = null;
      if (periodDrag) { periodDrag = null; S.requestDraw(); return; }
      if (diffDrag) {
        diffDrag = null;
        if (!(h && h.kind === "diffBar")) diff.active = null;
        S.requestDraw(); return;
      }
      if (zoomWin && zoomWin.dragging) {           // stopZoomWindowDragging
        zoomWin.dragging = false;
        if (!zoomWin.valid) zoomWin = null; else zoomWin.listening = true;
        S.requestDraw(); return;
      }
      if (!was || !same(was, h)) { S.requestDraw(); return; }
      if (h.kind === "chkCross") showCross = !showCross;
      else if (h.kind === "chkDiff") showDiff = !showDiff;
      else if (h.kind === "radio") setPlotType(h.value);
      else if (h.kind === "button" && h.b.enabled()) h.b.on();
      else if (h.kind === "zoomWindow") {         // onZoomWindowClicked
        var lo = pdm.vx(pdm.x + Math.min(zoomWin.a, zoomWin.b)), hi = pdm.vx(pdm.x + Math.max(zoomWin.a, zoomWin.b));
        if (hi - lo < ZOOM_LIMIT) { var mid = lo + (hi - lo) / 2; lo = mid - ZOOM_LIMIT / 2; hi = mid + ZOOM_LIMIT / 2; }
        zoomTo(lo, hi);
      }
      S.requestDraw();
    }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", function () { release(null); });
    S.canvas.addEventListener("pointerleave", function () {
      var changed = cursorPx || hover;
      cursorPx = null;
      if (!pressed) { hover = null; if (showDiff && !diffDrag) diff.active = null; }
      if (changed) S.requestDraw();
    });

    /* --------------------------------------------------------------- paint */
    S.onDraw(paint);
    function paint() {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      panels(ctx, t);
      starField(ctx, t);
      lightcurvePlot(ctx, t);
      pdmPlot(ctx, t);
      controls(ctx, t);
      if (!comparisons) clickToBegin(ctx, t);
      crosshair(ctx);
    }

    /* shape 135: three #fafafa panels with 1 px #666666 edges, and their titles */
    function panels(ctx, t) {
      [[7, 37, 421, 392], [428, 37, 893, 392], [7, 399, 893, 708]].forEach(function (r) {
        ctx.fillStyle = "#fafafa"; ctx.fillRect(r[0], r[1] + OY, r[2] - r[0], r[3] - r[1]);
        ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
        ctx.strokeRect(r[0] + 0.5, r[1] + OY + 0.5, r[2] - r[0], r[3] - r[1]);
      });
      ctx.fillStyle = "#000000"; ctx.font = "14px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t("va.sfTitle"), 12, 55 + OY);
      ctx.fillText(t("va.opTitle"), 433, 55 + OY);
      ctx.fillText(t("va.pdmTitle"), 12, 417 + OY);
      ctx.strokeStyle = "#666666";                  // the two short separators (shapes 143, 161)
      ctx.beginPath();
      ctx.moveTo(721.95 + 0.5, 363 + OY); ctx.lineTo(721.95 + 0.5, 385 + OY);
      ctx.moveTo(286.5, 369 + OY); ctx.lineTo(286.5, 387 + OY);
      ctx.stroke();
    }

    function starField(ctx, t) {
      if (genDone && fieldImage) {
        ctx.drawImage(fieldImage, FIELD.x, FIELD.y);
        STARS.forEach(function (s) {                // StarHalo.drawHalo
          var x = FIELD.x + s.x, y = FIELD.y + s.y;
          if (s === comparison) {
            ctx.strokeStyle = "#3399ff"; ctx.lineWidth = 1;
            ctx.strokeRect(x - 8, y - 8, 16, 16);
          }
          if (s === featured) {
            ctx.strokeStyle = "#339900"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(x + 0.5, y + 0.5, 8, 0, TAU); ctx.stroke();
          }
        });
      } else {                                      // loadingInfoMC
        ctx.fillStyle = "#fafafa"; ctx.fillRect(214 - 150, 203.1 + OY - 56, 300, 112);
        ctx.fillStyle = "#ff0000"; ctx.font = "14px " + FONT; ctx.textAlign = "center";
        ctx.fillText(t("va.loading"), 214, 190.9 + OY);
        ctx.fillText((100 * genIndex / OBS.length).toFixed(1) + t("va.done"), 214, 228.4 + OY);
      }
      /* the key and the crosshair checkbox */
      ctx.fillStyle = "#000000"; ctx.textAlign = "left";
      ctx.font = fitFont(ctx, t("va.key"), 12, 31); ctx.fillText(t("va.key"), 21.3, 382.75 + OY);
      ctx.strokeStyle = "#3399ff"; ctx.lineWidth = 1; ctx.strokeRect(55.5, 370.75 + OY + 0.5, 15, 15);
      ctx.strokeStyle = "#339900"; ctx.beginPath(); ctx.arc(178.5, 378.75 + OY, 8, 0, TAU); ctx.stroke();
      ctx.font = fitFont(ctx, t("va.keyComp"), 10, 95);
      ctx.fillText(t("va.keyComp"), 75.25, 382.75 + OY);
      ctx.font = fitFont(ctx, t("va.keyStar"), 10, 90);
      ctx.fillText(t("va.keyStar"), 192.2, 382.75 + OY);
    }
    function fitFont(ctx, text, size, max) {
      ctx.font = size + "px " + FONT;
      var w = ctx.measureText(text).width;
      return (w > max ? Math.max(7, Math.floor(size * max / w * 10) / 10) : size) + "px " + FONT;
    }

    function lightcurvePlot(ctx, t) {
      var P = lightcurve;
      P.frame(ctx);
      if (comparisons) {                            // points r 2, #606060, no outline
        ctx.save(); P.clip(ctx);
        ctx.fillStyle = "#606060";
        comparisons.forEach(function (c) {
          var x = P.px(plotType === "epoch" ? c.epoch : c.phase), y = P.py(c.delta);
          ctx.beginPath(); ctx.arc(x, y, 2, 0, TAU); ctx.fill();
        });
        ctx.restore();
      }
      P.axes(ctx);
      if (plotType === "epoch") {                   // the period lines, 1 px #36365a at 20 %
        ctx.strokeStyle = "rgba(54,54,90,0.2)"; ctx.lineWidth = 1; ctx.beginPath();
        var k0 = Math.ceil(minT / period), k1 = k0 + Math.ceil((maxT - minT) / period);
        for (var k = k0; k < k1; k++) {
          var x = Math.round(P.px(k * period)) + 0.5;
          ctx.moveTo(x, P.y - P.h); ctx.lineTo(x, P.y);
        }
        ctx.stroke();
      }
      ctx.save();                                   // static text 150, turned up the page
      ctx.translate(449.7, 272.15 + OY); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#000000"; ctx.font = fitFont(ctx, t("va.magDiff"), 12, 200); ctx.font = "bold " + ctx.font;
      ctx.textAlign = "left"; ctx.fillText(t("va.magDiff"), 0, 0);
      ctx.restore();
      if (showDiff) diffOverlay(ctx, t);
    }

    /* DeltaMagOverlay: two bars, checkers outside them, the gap read off in mag */
    function diffOverlay(ctx, t) {
      var P = lightcurve, x0 = P.x, y0 = P.y;
      var y2 = Math.min(diff.l1, diff.l2), y3 = Math.max(diff.l1, diff.l2);
      ctx.save();
      ctx.translate(x0, y0);
      ctx.fillStyle = DIFF_CHECKER;
      ctx.fillRect(0, -P.h, P.w, y2 + P.h);
      ctx.fillRect(0, y3, P.w, -y3);
      ["l1", "l2"].forEach(function (b) {
        var w = diff.active === b ? 3 : 1;
        ctx.fillStyle = "#909090"; ctx.fillRect(0, diff[b] - w / 2, P.w, w);
      });
      var d = (P.yMax - P.yMin) * ((y3 - y2) / P.h);
      var label = " " + d.toFixed(2) + " " + t("va.mag") + " ";
      ctx.font = "12px " + FONT;
      var tw = ctx.measureText(label).width + 4, th = 18.6, tx = P.w / 2 - tw / 2, ty = y2 - 1.3 * th;
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(tx, ty, tw, th);
      ctx.strokeStyle = "rgba(128,128,128,0.5)"; ctx.lineWidth = 1; ctx.strokeRect(tx + 0.5, ty + 0.5, tw - 1, th - 1);
      ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.fillText(label, tx + 2, ty + 14);
      ctx.restore();
    }

    function pdmPlot(ctx, t) {
      var P = pdm;
      P.frame(ctx);
      if (pdmCurve) {                               // the series: 1 px #a0a0a0 lines
        ctx.save(); P.clip(ctx);
        ctx.strokeStyle = "#a0a0a0"; ctx.lineWidth = 1; ctx.beginPath();
        var i0 = Math.max(0, Math.floor((P.xMin - pdmCurve[0]) / (pdmCurve[2] - pdmCurve[0])) - 1);
        var i1 = Math.min(RES - 1, Math.ceil((P.xMax - pdmCurve[0]) / (pdmCurve[2] - pdmCurve[0])) + 1);
        for (var i = i0; i <= i1; i++) {
          var x = P.px(pdmCurve[2 * i]), y = P.py(pdmCurve[2 * i + 1]);
          if (i === i0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }
      P.axes(ctx);
      /* the zoom window: checkers outside it, faint green-grey sides */
      if (zoomWin && (zoomWin.valid || zoomAnim)) {
        var a = Math.min(zoomWin.a, zoomWin.b), b = Math.max(zoomWin.a, zoomWin.b);
        ctx.save(); ctx.translate(P.x, P.y);
        ctx.fillStyle = ZOOM_CHECKER;
        ctx.fillRect(0, -P.h, Math.max(0, a), P.h);
        ctx.fillRect(b, -P.h, Math.max(0, P.w - b), P.h);
        if (!zoomAnim) {
          ctx.strokeStyle = "rgba(196,204,196,0.5)"; ctx.lineWidth = 1; ctx.beginPath();
          ctx.moveTo(zoomWin.a + 0.5, 0); ctx.lineTo(zoomWin.a + 0.5, -P.h);
          ctx.moveTo(zoomWin.b + 0.5, -P.h); ctx.lineTo(zoomWin.b + 0.5, 0);
          ctx.stroke();
        }
        ctx.restore();
      }
      /* the period cursor, pointer and out-of-range notes */
      var ptr = pointerX();
      if (ptr.mode === 0) {
        ctx.strokeStyle = periodDrag ? "#36365a" : "rgba(54,54,90,0.4)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(Math.round(ptr.x) + 0.5, P.y - P.h); ctx.lineTo(Math.round(ptr.x) + 0.5, P.y); ctx.stroke();
      }
      ctx.save();
      ctx.globalAlpha = ptr.mode === 0 ? 1 : 0.4;
      ctx.translate(ptr.x, POINTER_Y); drawShape(ctx, 146);
      ctx.restore();
      ctx.font = "11px " + FONT; ctx.fillStyle = "#4b4b5f"; ctx.textAlign = "left";
      if (ptr.mode === -1) {
        ctx.save(); ctx.translate(220.5, 431.15 + OY); drawShape(ctx, 153); ctx.restore();
        ctx.fillText(t("va.offLeft"), 255.95, 435.15 + OY);
      } else if (ptr.mode === 1) {
        ctx.save(); ctx.translate(648.15, 431.15 + OY); drawShape(ctx, 156); ctx.restore();
        ctx.textAlign = "right"; ctx.fillText(t("va.offRight"), 833.85, 435.15 + OY);
      }
      ctx.save();                                   // static text 151, "theta"
      ctx.translate(182.15, 573.1 + OY); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#000000"; ctx.font = "bold 12px " + FONT; ctx.textAlign = "left";
      ctx.fillText(t("va.theta"), 0, 0);
      ctx.restore();
    }

    function controls(ctx, t) {
      checkbox(ctx, t, CHK_CROSS, showCross);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT; ctx.textAlign = "left";
      ctx.fillText(t("va.plotType"), 452.65, 379.5 + OY);
      radio(ctx, t, RAD_TIME, plotType === "epoch");
      radio(ctx, t, RAD_PHASE, plotType === "phase");
      checkbox(ctx, t, CHK_DIFF, showDiff);
      /* the period box: TextInput skin, #ffffeb while being edited */
      draw9(ctx, periodField.editing ? 1 : 77, [2.25, 150.05, 1.45, 20.05], 152, 22, TI.x, TI.y, TI.w, TI.h);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT; ctx.textAlign = "left";
      ctx.fillText(t("va.period"), 20, 445.8 + OY);
      ctx.fillText(t("va.days"), 131, 469.3 + OY);
      BUTTONS.forEach(function (b) { button(ctx, t, b); });
      ctx.fillStyle = "#000000"; ctx.font = "italic 10px " + FONT; ctx.textAlign = "center";
      lines(ctx, t("va.help"), 150).forEach(function (l, i) { ctx.fillText(l, 93.5, 649.8 + OY + 14 * i); });
    }
    function lines(ctx, text, width) {
      var out = [], line = "";
      text.split(" ").forEach(function (w) {
        var test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > width && line) { out.push(line); line = w; } else line = test;
      });
      if (line) out.push(line);
      return out;
    }
    function state(kind, extra) {
      var h = hover && hover.kind === kind && (!extra || hover.value === extra || hover.b === extra);
      var p = pressed && pressed.kind === kind && (!extra || pressed.value === extra || pressed.b === extra);
      return p && h ? "down" : h ? "over" : "up";
    }
    /* CS3 CheckBox / RadioButton: 14 px icon at (5, 4), label from x 26 */
    function checkbox(ctx, t, c, on) {
      var st = state(c === CHK_CROSS ? "chkCross" : "chkDiff");
      ctx.save(); ctx.translate(c.x + 5, c.y + 4);
      drawShape(ctx, st === "down" ? 88 : st === "over" ? 86 : 84);
      if (on) { ctx.translate(3, 1); drawShape(ctx, 92); }
      ctx.restore();
      ctx.fillStyle = "#000000"; ctx.font = fitFont(ctx, t(c.key), 12, c.w - 28); ctx.textAlign = "left";
      ctx.fillText(t(c.key), c.x + 26, c.y + 16);
    }
    function radio(ctx, t, r, on) {
      var st = state("radio", r.value);
      ctx.save(); ctx.translate(r.x + 5, r.y + 4);
      drawShape(ctx, st === "down" ? 104 : st === "over" ? 102 : on ? 108 : 100);
      if (on) { ctx.translate(5, 5); drawShape(ctx, 109); }
      ctx.restore();
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT; ctx.textAlign = "left";
      ctx.fillText(t(r.key), r.x + 26, r.y + 16);
    }
    function button(ctx, t, b) {
      var en = b.enabled(), st = en ? state("button", b) : "disabled";
      var skin = st === "down" ? [118, [4, 76, 5, 16]] : st === "over" ? [122, [5, 76, 5, 16]] :
        st === "disabled" ? [116, [6, 74, 5, 16]] : [132, [7, 75, 5, 16]];
      draw9(ctx, skin[0], skin[1], 82, 22, b.x, b.y, b.w, 22);
      ctx.fillStyle = en ? "#000000" : "#999999";
      ctx.font = fitFont(ctx, t(b.key), 12, b.w - 10); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t(b.key), b.x + b.w / 2, b.y + 11.5);
      ctx.textBaseline = "alphabetic";
    }

    function clickToBegin(ctx, t) {                 // clickToBeginMC, centred on the plot
      var cx = lightcurve.x + lightcurve.w / 2, cy = 200.45 + OY;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(cx - 135.5, cy - 28.9, 271, 51);
      ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1; ctx.strokeRect(cx - 135, cy - 28.4, 270, 50);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT; ctx.textAlign = "center";
      ctx.fillText(t("va.begin1"), cx, cy - 6.9);
      ctx.fillText(t("va.begin2"), cx, cy + 10.1);
    }

    /* crosshairMC ("Coordinates"): a rounded box of x and y over three short arms */
    function crosshair(ctx) {
      if (!showCross || !cursorPx || !genDone) return;
      ctx.save();
      ctx.translate(FIELD.x + cursorPx.x, FIELD.y + cursorPx.y);
      drawShape(ctx, 169);
      ctx.fillStyle = "#000000"; ctx.font = "10px " + FONT; ctx.textAlign = "left";
      ctx.fillText("x:", -17, -36); ctx.fillText(String(cursorPx.x), 0, -35.4);
      ctx.fillText("y:", -17, -22); ctx.fillText(String(cursorPx.y), 0, -21.4);
      ctx.restore();
    }

    setPlotType("epoch");
    updatePeriodAndPhases();
    channel.port2.postMessage(0);
  }
});
