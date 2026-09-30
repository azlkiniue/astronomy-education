/* Eclipse Table ----------------------------------------------------------------
   Faithful rebuild of the ClassAction "eclipsetable.swf". Every solar and lunar
   eclipse from 2000 to 2029 is plotted by year (across) and date (down), from Fred
   Espenak's NASA/GSFC predictions — the data table is copied from the SWF itself:
   [x, y, type, month, day, year, Saros, γ/magnitude, duration, visibility].

   The eclipses fall in slanting bands: they only happen in the two eclipse seasons
   each year, when the Sun is near one of the Moon's nodes, and the seasons creep
   about 19 days earlier every year as the nodes regress. Hover over (or tap) any
   eclipse for its details, exactly as in the original.                          */
Sim.create({
  id: "eclipsetable",
  width: 700, height: 550,
  strings: {
    en: {
      "et.show": "Show", "et.solar": "solar eclipses", "et.lunar": "lunar eclipses", "et.bands": "shade the eclipse seasons",
      "et.solarOf": "Solar Eclipse of", "et.lunarOf": "Lunar Eclipse of",
      "et.type": "Eclipse Type:", "et.saros": "Saros:", "et.duration": "Duration:", "et.visibility": "Visibility:",
      "et.total": "Total", "et.annular": "Annular", "et.hybrid": "Hybrid", "et.partial": "Partial", "et.penumbral": "Penumbral",
      "et.credit": "Eclipse Predictions by Fred Espenak, NASA/GSFC",
      "et.hint": "Hover over or tap an eclipse to see its details.",
      "et.rSolar": "solar eclipses shown", "et.rLunar": "lunar eclipses shown",
      "et.months": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",
      "et.monthsLong": "January,February,March,April,May,June,July,August,September,October,November,December"
    },
    id: {
      "et.show": "Tampilkan", "et.solar": "gerhana Matahari", "et.lunar": "gerhana Bulan", "et.bands": "arsir musim gerhana",
      "et.solarOf": "Gerhana Matahari", "et.lunarOf": "Gerhana Bulan",
      "et.type": "Jenis Gerhana:", "et.saros": "Saros:", "et.duration": "Durasi:", "et.visibility": "Terlihat dari:",
      "et.total": "Total", "et.annular": "Cincin", "et.hybrid": "Hibrida", "et.partial": "Sebagian", "et.penumbral": "Penumbra",
      "et.credit": "Prediksi gerhana oleh Fred Espenak, NASA/GSFC",
      "et.hint": "Arahkan penunjuk atau ketuk sebuah gerhana untuk melihat rinciannya.",
      "et.rSolar": "gerhana Matahari tampil", "et.rLunar": "gerhana Bulan tampil",
      "et.months": "Jan,Feb,Mar,Apr,Mei,Jun,Jul,Agu,Sep,Okt,Nov,Des",
      "et.monthsLong": "Januari,Februari,Maret,April,Mei,Juni,Juli,Agustus,September,Oktober,November,Desember"
    }
  },
  about: {
    en: "<p>An eclipse needs the Sun, Earth and Moon in a straight line in three dimensions. Because the Moon's orbit is tilted about 5° to Earth's, a new or full Moon usually passes above or below that line. Only when the Sun is near one of the two points where the Moon's orbit crosses the ecliptic — the <strong>nodes</strong> — can the shadows fall on Earth or the Moon.</p>" +
        "<p>That happens during two <strong>eclipse seasons</strong> about 173 days apart, each around five weeks long, which is why the eclipses in this table cluster in pairs and triplets: a solar eclipse at new moon and a lunar eclipse two weeks before or after. The nodes slowly slide westward along the ecliptic, completing a circuit in 18.6 years, so each year the seasons arrive about 19 days earlier — the steady diagonal drift of the bands.</p>" +
        "<p>Eclipses with the same <strong>Saros</strong> number belong to one family: they recur every 18 years 11 days with nearly the same geometry, a cycle Babylonian astronomers used to predict eclipses thousands of years ago.</p>",
    id: "<p>Gerhana memerlukan Matahari, Bumi, dan Bulan berada dalam satu garis lurus secara tiga dimensi. Karena orbit Bulan miring sekitar 5° terhadap orbit Bumi, bulan baru atau purnama biasanya lewat di atas atau di bawah garis itu. Hanya ketika Matahari berada dekat salah satu dari dua titik perpotongan orbit Bulan dengan ekliptika — <strong>simpul</strong> — bayangan dapat jatuh ke Bumi atau Bulan.</p>" +
        "<p>Hal itu terjadi selama dua <strong>musim gerhana</strong> berselang sekitar 173 hari, masing-masing kira-kira lima pekan, itulah sebabnya gerhana dalam tabel ini berkelompok berpasangan atau bertiga: gerhana Matahari saat bulan baru dan gerhana Bulan dua pekan sebelum atau sesudahnya. Simpul perlahan bergeser ke barat sepanjang ekliptika, menuntaskan satu putaran dalam 18,6 tahun, sehingga setiap tahun musim gerhana datang sekitar 19 hari lebih awal — pergeseran diagonal pita-pita itu.</p>" +
        "<p>Gerhana dengan nomor <strong>Saros</strong> yang sama tergolong satu keluarga: berulang setiap 18 tahun 11 hari dengan geometri hampir sama, siklus yang dipakai astronom Babilonia untuk meramalkan gerhana ribuan tahun lalu.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var G = { x: 66.85, y: 498.8 };                  // the plot ("thing"): x 0–600, y −450–0
    var YEAR_C = [11.3, 111.35, 211, 311.45, 411.15, 510.95];               // centres of the year labels (left x + 33/2)
    var MONTH_C = -27.36, MONTH_Y = [-438.8, -402.45, -366.05, -328.45, -290.85, -253.2, -215.6, -177.4, -139.8, -102.2, -64.6, -27];
    /* ---- the SWF's own tables ---- */
    var SOLAR = [
      [2, -405.6, 3, 1, 5, 2000, 150, 0.579, "-", "Antarctica"],
      [10, -225.6, 3, 6, 1, 2000, 117, 0.477, "-", "S Pacific Ocean, s S. America"],
      [11.6, -188.6, 3, 6, 31, 2000, 155, 0.603, "-", "n Asia, nw N. America"],
      [19.7, -7.4, 3, 11, 25, 2000, 122, 0.723, "-", "N. & C. America"],
      [29.4, -237.9, 0, 5, 21, 2001, 127, 1.05, "04m57s", "e S. America, Africa (Total: s Atlantic, s Africa, Madagascar)"],
      [39.1, -21, 1, 11, 14, 2001, 132, 0.968, "03m53s", "N. & C. America, nw S. America (Annular: c Pacific, Costa Rica)"],
      [48.8, -251.5, 1, 5, 10, 2002, 137, 0.996, "00m23s", "e Asia, Australia, w N. America (Annular: n Pacific, w Mexico)"],
      [58.5, -33.3, 0, 11, 4, 2002, 142, 1.024, "02m04s", "s Africa, Antarctica, Indonesia, Australia (Total: s Africa, s Indian, s Australia)"],
      [68.3, -263.8, 1, 4, 31, 2003, 147, 0.938, "03m37s", "Europe, Asia, nw N. America (Annular: Iceland, Greenland)"],
      [77.9, -46.8, 0, 10, 23, 2003, 152, 1.038, "01m57s", "Australia, N. Z., Antarctica, s S. America (Total: Antarctica)"],
      [86, -315.6, 3, 3, 19, 2004, 119, 0.736, "-", "Antarctica, s Africa"],
      [95.7, -96.2, 3, 9, 14, 2004, 124, 0.927, "-", "ne Asia, Hawaii, Alaska"],
      [105.4, -329.2, 2, 3, 8, 2005, 129, 1.007, "00m42s", "N. Zealand, N. & S. America (Hybrid: s Pacific, Panama, Colombia, Venezuela)"],
      [115.1, -109.7, 1, 9, 3, 2005, 134, 0.958, "04m32s", "Europe, Africa, s Asia (Annular: Portugal, Spain, Libya, Sudan, Kenya)"],
      [124.8, -341.5, 0, 2, 29, 2006, 139, 1.052, "04m07s", "Africa, Europe, w Asia (Total: c Africa, Turkey, Russia)"],
      [134.5, -123.3, 1, 8, 22, 2006, 144, 0.935, "07m09s", "S. America, w Africa, Antarctica (Annular: Guyana, Suriname, F. Guiana, s Atlantic)"],
      [144.3, -353.8, 3, 2, 19, 2007, 149, 0.874, "-", "Asia, Alaska"],
      [153.9, -136.8, 3, 8, 11, 2007, 154, 0.749, "-", "S. America, Antarctica"],
      [162.1, -403.2, 1, 1, 7, 2008, 121, 0.965, "02m12s", "Antarctica, e Australia, N. Zealand (Annular: Antarctica)"],
      [171.7, -187.4, 0, 7, 1, 2008, 126, 1.039, "02m27s", "ne N. America, Europe, Asia (Total: n Canada, Greenland, Siberia, Mongolia, China)"],
      [181.4, -417.9, 1, 0, 26, 2009, 131, 0.928, "07m54s", "s Africa, Antarctica, se Asia, Australia (Annular: s Indian, Sumatra, Borneo)"],
      [191.1, -199.7, 0, 6, 22, 2009, 136, 1.08, "06m39s", "e Asia, Pacific Ocean, Hawaii (Total: India, Nepal, China, c Pacific)"],
      [200.8, -431.5, 1, 0, 15, 2010, 141, 0.919, "11m08s", "Africa, Asia (Annular: c Africa, India, Myanmar, China)"],
      [210.5, -213.3, 0, 6, 11, 2010, 146, 1.058, "05m20s", "s S. America (Total: s Pacific, Easter Is., Chile, Argentina)"],
      [220.2, -445.1, 3, 0, 4, 2011, 151, 0.857, "-", "Europe, Africa, c Asia"],
      [228.3, -262.6, 3, 5, 1, 2011, 118, 0.601, "-", "e Asia, n N. America, Iceland"],
      [230, -225.6, 3, 6, 1, 2011, 156, 0.096, "-", "s Indian Ocean"],
      [238, -44.4, 3, 10, 25, 2011, 123, 0.905, "-", "s Africa, Antarctica, Tasmania, N.Z."],
      [247.7, -277.4, 1, 4, 20, 2012, 128, 0.944, "05m46s", "Asia, Pacific, N. America (Annular: China, Japan, Pacific, w U.S.)"],
      [257.4, -59.2, 0, 10, 13, 2012, 133, 1.05, "04m02s", "Australia, N.Z., s Pacific, s S. America (Total: n Australia, s Pacific)"],
      [267.1, -289.7, 1, 4, 10, 2013, 138, 0.954, "06m03s", "Australia, N.Z., c Pacific (Annular: n Australia, Solomon Is., c Pacific)"],
      [276.8, -71.5, 2, 10, 3, 2013, 143, 1.016, "01m40s", "e Americas, s Europe, Africa (Hybrid: Atlantic, c Africa)"],
      [286.5, -303.3, 1, 3, 29, 2014, 148, 0.984, "Non-Central", "s Indian, Australia, Antarctica (Annular: Antarctica)"],
      [296.2, -85.1, 3, 9, 23, 2014, 153, 0.811, "-", "n Pacific, N. America"],
      [304.3, -352.6, 0, 2, 20, 2015, 120, 1.045, "02m47s", "Iceland, Europe, n Africa, n Asia (Total: n Atlantic, Faeroe Is, Svalbard)"],
      [314, -134.4, 3, 8, 13, 2015, 125, 0.787, "-", "s Africa, s Indian, Antarctica"],
      [323.7, -366.2, 0, 2, 9, 2016, 130, 1.045, "04m09s", "e Asia, Australia, Pacific (Total: Sumatra, Borneo, Sulawesi, Pacific)"],
      [333.4, -149.2, 1, 8, 1, 2016, 135, 0.974, "03m06s", "Africa, Indian Ocean (Annular: Atlantic, c Africa, Madagascar, Indian)"],
      [343.1, -379.7, 1, 1, 26, 2017, 140, 0.992, "00m44s", "s S. America, Atlantic, Africa, Antarctica (Annular: Pacific, Chile, Argentina, Atlantic, Africa)"],
      [352.8, -162.7, 0, 7, 21, 2017, 145, 1.031, "02m40s", "N. America, n S. America (Total: n Pacific, U.S., s Atlantic)"],
      [362.5, -393.3, 3, 1, 15, 2018, 150, 0.599, "-", "Antarctica, s S. America"],
      [370.6, -210.8, 3, 6, 13, 2018, 117, 0.337, "-", "s Australia"],
      [372.2, -175.1, 3, 7, 11, 2018, 155, 0.736, "-", "n Europe, ne Asia"],
      [380.3, -442.6, 3, 0, 6, 2019, 122, 0.715, "-", "ne Asia, n Pacific"],
      [390, -224.4, 0, 6, 2, 2019, 127, 1.046, "04m33s", "s Pacific, S. America (Total: s Pacific, Chile, Argentina)"],
      [399.7, -6.2, 1, 11, 26, 2019, 132, 0.97, "03m40s", "Asia, Australia (Annular: Saudi Arabia, India, Sumatra, Borneo)"],
      [409.4, -237.9, 1, 5, 21, 2020, 137, 0.994, "00m38s", "Africa, se Europe, Asia (Annular: c Africa, s Asia, China, Pacific)"],
      [419.1, -21, 0, 11, 14, 2020, 142, 1.025, "02m10s", "Pacific, s S. America, Antarctica (Total: s Pacific, Chile, Argentina, s Atlantic)"],
      [428.8, -251.5, 1, 5, 10, 2021, 147, 0.943, "03m51s", "n N. America, Europe, Asia (Annular: n Canada, Greenland, Russia)"],
      [438.5, -33.3, 0, 11, 4, 2021, 152, 1.037, "01m54s", "Antarctica, S. Africa, s Atlantic (Total: Antarctica)"],
      [446.6, -302.1, 3, 3, 30, 2022, 119, 0.639, "-", "se Pacific, s S. America"],
      [456.3, -82.6, 3, 9, 25, 2022, 124, 0.861, "-", "Europe, ne Africa, Mid East, w Asia"],
      [466, -314.4, 2, 3, 20, 2023, 129, 1.013, "01m16s", "se Asia, E. Indies, Australia, Philippines. N.Z. (Hybrid: Indonesia, Australia, Papua New Guinea)"],
      [475.7, -96.2, 1, 9, 14, 2023, 134, 0.952, "05m17s", "N. America, C. America, S. America (Annular: w US, C. America, Colombia, Brazil)"],
      [485.4, -329.2, 0, 3, 8, 2024, 139, 1.057, "04m28s", "N. America, C. America (Total: Mexico, c US, e Canada)"],
      [495.1, -111, 1, 9, 2, 2024, 144, 0.933, "07m25s", "Pacific, s S. America (Annular: s Chile, s Argentina)"],
      [504.8, -341.5, 3, 2, 29, 2025, 149, 0.936, "-", "nw Africa, Europe, n Russia"],
      [514.5, -124.5, 3, 8, 21, 2025, 154, 0.853, "-", "s Pacific, N.Z., Antarctica"],
      [522.6, -390.8, 1, 1, 17, 2026, 121, 0.963, "02m20s", "s Argentina & Chile, s Africa, Antarctica (Annular: Antarctica)"],
      [532.3, -173.8, 0, 7, 12, 2026, 126, 1.039, "02m18s", "n N. America, w Africa, Europe (Total: Arctic, Greenland, Iceland, Spain)"],
      [542, -404.4, 1, 1, 6, 2027, 131, 0.928, "07m51s", "S. America, Antarctica, w & s Africa (Annular: Chile, Argentina, Atlantic)"],
      [551.7, -186.2, 0, 7, 2, 2027, 136, 1.079, "06m23s", "Africa, Europe, Mid East, w & s Asia (Total: Morocco, Spain, Algeria, Libya, Egypt, Saudi Arabia, Yemen, Somalia)"],
      [561.4, -417.9, 1, 0, 26, 2028, 141, 0.921, "10m27s", "e N. America, C. & S. America, w Europe, nw Africa (Annular: Ecuador, Peru, Brazil, Suriname, Spain, Portugal)"],
      [571.1, -199.7, 0, 6, 22, 2028, 146, 1.056, "05m10s", "SE Asia, E. Indies, Australia, N.Z. (Total: Australia, N.Z.)"],
      [580.8, -432.7, 3, 0, 14, 2029, 151, 0.871, "-", "N. America, C. America"],
      [588.9, -249, 3, 5, 12, 2029, 118, 0.458, "-", "Arctic, Scandinavia, Alaska, n Asia, n Canada"],
      [590.5, -213.3, 3, 6, 11, 2029, 156, 0.23, "-", "s Chile, s Argentina"],
      [598.6, -32.1, 3, 11, 5, 2029, 123, 0.891, "-", "s Argentina, s Chile, Antarctica"]
    ];
    var LUNAR = [
      [1.2, -424.1, 0, 0, 21, 2000, 124, 1.33, "03h24m (01h18m)", "Pacific, Americas, Europe, Africa"],
      [10.8, -207.1, 0, 6, 16, 2000, 129, 1.773, "03h57m (01h47m)", "Asia, Pacific, w Americas"],
      [20.5, -438.9, 0, 0, 9, 2001, 134, 1.195, "03h17m (01h02m)", "e Americas, Europe, Africa, Asia"],
      [30.2, -220.7, 2, 6, 5, 2001, 139, 0.499, "02h40m", "e Africa, Asia, Aus., Pacific"],
      [39.9, -1.2, 1, 11, 30, 2001, 144, -0.11, "-", "e Asia, Aus., Pacific, Americas"],
      [48, -270, 1, 4, 26, 2002, 111, -0.283, "-", "e Asia, Aus., Pacific, w Americas"],
      [49.6, -234.2, 1, 5, 24, 2002, 149, -0.788, "-", "S. America, Europe, Africa, c Asia, Aus."],
      [57.8, -50.5, 1, 10, 20, 2002, 116, -0.222, "-", "Americas, Europe, Africa, e Asia"],
      [67.5, -282.3, 0, 4, 16, 2003, 121, 1.134, "03h15m (00h53m)", "c Pacific, Americas, Europe, Africa"],
      [77.2, -64.1, 0, 10, 9, 2003, 126, 1.022, "03h32m (00h24m)", "Americas, Europe, Africa, c Asia"],
      [86.8, -297.1, 0, 4, 4, 2004, 131, 1.309, "03h24m (01h16m)", "S. America, Europe, Africa, Asia, Aus."],
      [96.5, -78.9, 0, 9, 28, 2004, 136, 1.313, "03h39m (01h21m)", "Americas, Europe, Africa, c Asia"],
      [106.2, -309.5, 1, 3, 24, 2005, 141, -0.139, "-", "e Asia, Aus., Pacific, Americas"],
      [115.9, -92.5, 2, 9, 17, 2005, 146, 0.068, "00h58m", "Asia, Aus., Pacific, North America"],
      [124, -360, 1, 2, 14, 2006, 113, -0.055, "-", "Americas, Europe, Africa, Asia"],
      [133.7, -141.8, 2, 8, 7, 2006, 118, 0.189, "01h33m", "Europe, Africa, Asia, Aus."],
      [143.4, -373.6, 0, 2, 3, 2007, 123, 1.238, "03h42m (01h14m)", "Americas, Europe, Africa, Asia"],
      [153.2, -154.1, 0, 7, 28, 2007, 128, 1.481, "03h33m (01h31m)", "e Asia, Aus., Pacific, Americas"],
      [162.8, -385.9, 0, 1, 21, 2008, 133, 1.111, "03h26m (00h51m)", "c Pacific, Americas, Europe, Africa"],
      [172.5, -168.9, 2, 7, 16, 2008, 138, 0.813, "03h09m", "S. America, Europe, Africa, Asia, Aus."],
      [182.2, -400.7, 1, 1, 9, 2009, 143, -0.083, "-", "e Europe, Asia, Aus., Pacific, w N.A."],
      [190.3, -218.2, 1, 6, 7, 2009, 110, -0.909, "-", "Aus., Pacific, Americas"],
      [191.9, -181.2, 1, 7, 6, 2009, 148, -0.661, "-", "Americas, Europe, Africa, w Asia"],
      [200, 0, 2, 11, 31, 2009, 115, 0.082, "01h02m", "Europe, Africa, Asia, Aus."],
      [209.7, -231.8, 2, 5, 26, 2010, 120, 0.542, "02h44m", "e Asia, Aus., Pacific, w Americas"],
      [219.5, -12.3, 0, 11, 21, 2010, 125, 1.262, "03h29m (01h13m)", "e Asia, Aus., Pacific, Americas, Europe"],
      [229.1, -245.3, 0, 5, 15, 2011, 130, 1.705, "03h40m (01h41m)", "S.America, Europe, Africa, Asia, Aus."],
      [238.8, -25.9, 0, 11, 10, 2011, 135, 1.11, "03h33m (00h52m)", "Europe, e Africa, Asia, Aus., Pacific, N.A."],
      [248.5, -258.9, 2, 5, 4, 2012, 140, 0.376, "02h08m", "Asia, Aus., Pacific, Americas"],
      [258.2, -40.7, 1, 10, 28, 2012, 145, -0.184, "-", "Europe, e Africa, Asia, Aus., Pacific, N.A."],
      [266.3, -308.2, 2, 3, 25, 2013, 112, 0.02, "00h32m", "Europe, Africa, Asia, Aus."],
      [267.9, -271.2, 1, 4, 25, 2013, 150, -0.928, "-", "Americas, Africa"],
      [275.9, -91.2, 1, 9, 18, 2013, 117, -0.266, "-", "Americas, Europe, Africa, Asia"],
      [285.8, -320.5, 0, 3, 15, 2014, 122, 1.296, "03h35m (01h19m)", "Aus., Pacific, Americas"],
      [295.4, -103.6, 0, 9, 8, 2014, 127, 1.172, "03h20m (01h00m)", "Asia, Aus., Pacific, Americas"],
      [305.2, -334.1, 0, 3, 4, 2015, 132, 1.006, "03h30m (00h12m)", "Asia, Aus., Pacific, Americas"],
      [314.8, -115.9, 0, 8, 28, 2015, 137, 1.282, "03h21m (01h13m)", "e Pacific, Americas, Europe, Africa, w Asia"],
      [324.5, -348.9, 1, 2, 23, 2016, 142, -0.307, "-", "Asia, Aus., Pacific, w Americas"],
      [332.6, -166.4, 1, 7, 18, 2016, 109, -0.992, "-", "Aus., Pacific, Americas"],
      [334.2, -130.7, 1, 8, 16, 2016, 147, -0.058, "-", "Europe, Africa, Asia, Aus., w Pacific"],
      [342.3, -398.2, 1, 1, 11, 2017, 114, -0.031, "-", "Americas, Europe, Africa, Asia"],
      [352, -180, 2, 7, 7, 2017, 119, 0.252, "01h57m", "Europe, Africa, Asia, Aus."],
      [361.7, -411.8, 0, 0, 31, 2018, 124, 1.321, "03h23m (01h17m)", "Asia, Aus., Pacific, w N. America"],
      [371.4, -193.6, 0, 6, 27, 2018, 129, 1.614, "03h55m (01h44m)", "S.America, Europe, Africa, Asia, Aus."],
      [381.2, -424.1, 0, 0, 21, 2019, 134, 1.201, "03h17m (01h03m)", "c Pacific, Americas, Europe, Africa"],
      [390.8, -207.1, 2, 6, 16, 2019, 139, 0.657, "02h59m", "S.America, Europe, Africa, Asia, Aus."],
      [400.5, -437.7, 1, 0, 10, 2020, 144, -0.111, "-", "Europe, Africa, Asia, Aus."],
      [408.5, -257.7, 1, 5, 5, 2020, 111, -0.399, "-", "Europe, Africa, Asia, Aus."],
      [410.2, -220.7, 1, 6, 5, 2020, 149, -0.639, "-", "Americas, sw Europe, Africa"],
      [418.3, -38.2, 1, 10, 30, 2020, 116, -0.258, "-", "Asia, Aus., Pacific, Americas"],
      [428, -270, 0, 4, 26, 2021, 121, 1.016, "03h08m (00h19m)", "e Asia, Australia, Pacific, Americas"],
      [437.7, -51.8, 2, 10, 19, 2021, 126, 0.978, "03h29m", "Americas, n Europe, e Asia, Australia, Pacific"],
      [447.5, -282.3, 0, 4, 16, 2022, 131, 1.419, "03h28m (01h26m)", "Americas, Europe, Africa"],
      [457.1, -65.3, 0, 10, 8, 2022, 136, 1.364, "03h40m (01h26m)", "Asia, Australia, Pacific, Americas"],
      [466.8, -295.9, 1, 4, 5, 2023, 141, -0.041, "-", "Africa, Asia, Australia"],
      [476.5, -78.9, 2, 9, 28, 2023, 146, 0.128, "01h19m", "e Americas, Europe, Africa, Asia, Australia"],
      [484.6, -346.4, 1, 2, 25, 2024, 113, -0.127, "-", "Americas"],
      [494.3, -128.2, 2, 8, 18, 2024, 118, 0.09, "01h05m", "Americas, Europe, Africa"],
      [504, -360, 0, 2, 14, 2025, 123, 1.183, "03h39m (01h06m)", "Pacific, Americas, w Europe, w Africa"],
      [513.7, -141.8, 0, 8, 7, 2025, 128, 1.367, "03h30m (01h23m)", "Europe, Africa, Asia, Australia"],
      [523.4, -373.6, 0, 2, 3, 2026, 133, 1.155, "03h28m (00h59m)", "e Asia, Australia, Pacific, Americas"],
      [533.2, -154.1, 2, 7, 28, 2026, 138, 0.935, "03h19m", "e Pacific, Americas, Europe, Africa"],
      [542.8, -387.1, 1, 1, 20, 2027, 143, -0.052, "-", "Americas, Europe, Africa, Asia"],
      [550.9, -204.7, 1, 6, 18, 2027, 110, -1.063, "-", "e Africa, Asia, Australia, Pacific"],
      [552.5, -167.7, 1, 7, 17, 2027, 148, -0.521, "-", "Pacific, Americas"],
      [560.7, -435.2, 2, 0, 12, 2028, 115, 0.072, "00h59m", "Americas, Europe, Africa"],
      [570.2, -219.5, 2, 6, 6, 2028, 120, 0.394, "02h23m", "Europe, Africa, Asia, Australia"],
      [580, 0, 0, 11, 31, 2028, 125, 1.252, "03h30m (01h12m)", "Europe, Africa, Asia, Australia, Pacific"],
      [589.7, -231.8, 0, 5, 26, 2029, 130, 1.849, "03h40m (01h43m)", "Americas, Europe, Africa, Mid East"],
      [599.4, -13.6, 0, 11, 20, 2029, 135, 1.121, "03h34m (00h55m)", "Americas, Europe, Africa, Asia"]
    ];

    var showSolar = true, showLunar = true, bands = false, hover = null, pinned = null;

    S.group("et.show");
    S.toggle({ labelKey: "et.solar", value: showSolar, on: function (b) { showSolar = b; drop(); upd(); } });
    S.toggle({ labelKey: "et.lunar", value: showLunar, on: function (b) { showLunar = b; drop(); upd(); } });
    S.toggle({ labelKey: "et.bands", value: bands, on: function (b) { bands = b; } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "et.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var outS = S.readout({ labelKey: "et.rSolar" });
    var outL = S.readout({ labelKey: "et.rLunar" });
    function drop() { hover = null; pinned = null; }
    function upd() {
      outS(showSolar ? String(SOLAR.length) : "0");
      outL(showLunar ? String(LUNAR.length) : "0");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- hover / tap: the icon under the pointer (radius 7.5) ---- */
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width - G.x, y: (ev.clientY - r.top) * S.H / r.height - G.y };
    }
    function hit(p) {
      var best = null, bd = 9 * 9;
      function scan(list, kind) {
        list.forEach(function (e, i) {
          var d = (p.x - e[0]) * (p.x - e[0]) + (p.y - e[1]) * (p.y - e[1]);
          if (d < bd) { bd = d; best = { kind: kind, i: i }; }
        });
      }
      if (showSolar) scan(SOLAR, "solar");
      if (showLunar) scan(LUNAR, "lunar");
      return best;
    }
    function same(a, b) { return a && b && a.kind === b.kind && a.i === b.i; }
    S.canvas.addEventListener("pointermove", function (ev) {
      var h = hit(stageXY(ev));
      if (!same(h, hover)) { hover = h; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerleave", function () { if (hover) { hover = null; S.requestDraw(); } });
    S.canvas.addEventListener("pointerdown", function (ev) {
      var h = hit(stageXY(ev));
      pinned = same(h, pinned) ? null : h;
      S.requestDraw();
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      FlashText.begin(ctx);
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.save();
      ctx.translate(G.x, G.y);
      drawGrid(ctx, t);
      if (bands) drawSeasons(ctx);
      var active = hover || pinned;
      if (showLunar) LUNAR.forEach(function (e, i) { icon(ctx, e, "lunar", active && active.kind === "lunar" && active.i === i); });
      if (showSolar) SOLAR.forEach(function (e, i) { icon(ctx, e, "solar", active && active.kind === "solar" && active.i === i); });
      if (active) panel(ctx, t, active);
      ctx.restore();
      ctx.fillStyle = "#222222"; ctx.font = "italic 12px Verdana, system-ui, sans-serif";
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fillStatic(ctx, t("et.credit"), 371.95, 513.9 + 12.05);       // static text 52 at (371.95, 513.9), baseline +12.05
    });

    // shape 31: #f7f7f7 bands on the first year of each five, #dfdfdf year lines, then the labels
    function drawGrid(ctx, t) {
      ctx.fillStyle = "#f7f7f7";
      for (var k = 0; k < 6; k++) ctx.fillRect(k * 100, -450, 20, 450);
      ctx.strokeStyle = "#dfdfdf"; ctx.lineWidth = 1;
      for (var yr = 0; yr <= 30; yr++) {
        ctx.beginPath(); ctx.moveTo(yr * 20 + 0.5, -450); ctx.lineTo(yr * 20 + 0.5, 0); ctx.stroke();
      }
      // the labels are static texts, each placed by hand in sprite 50 (baseline = its y + 13.05): their
      // centres wander a little from a regular grid, so the SWF's own positions are kept
      ctx.fillStyle = "#000000"; ctx.font = "13px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      for (var y5 = 0; y5 < 6; y5++) FlashText.fillStatic(ctx, String(2000 + 5 * y5), YEAR_C[y5], -474.35 + 13.05);
      var names = t("et.months").split(",");
      for (var m = 0; m < 12; m++) FlashText.fillStatic(ctx, names[m], MONTH_C, MONTH_Y[m] + 13.05);
    }

    // the eclipse seasons: centred every 173.31 days (the 2000 July 16 season is one of them); each node's
    // season comes 18.6 days earlier every year, so joining a node's seasons year to year gives a slanting band
    function drawSeasons(ctx) {
      var HALF = 17, Y_PER_DAY = 450 / 366;
      function at(t) {                                // t = days since 2000 January 0
        var yr = Math.floor(t / 365.25), doy = t - yr * 365.25;
        return { x: t / 365.25 * 20, y: -(366 - doy) * Y_PER_DAY, doy: doy };
      }
      ctx.save();
      ctx.beginPath(); ctx.rect(0, -450, 600, 450); ctx.clip();
      ctx.fillStyle = "rgba(255,196,80,0.16)";
      for (var n = -2; n < 66; n++) {
        var a = at(198 + n * 173.31), b = at(198 + (n + 2) * 173.31);
        if (b.doy > a.doy) {                          // the next season wrapped into the following year
          b = { x: a.x + 18.98, y: a.y - 18.63 * Y_PER_DAY };
        }
        ctx.beginPath();
        ctx.moveTo(a.x, a.y - HALF * Y_PER_DAY); ctx.lineTo(b.x, b.y - HALF * Y_PER_DAY);
        ctx.lineTo(b.x, b.y + HALF * Y_PER_DAY); ctx.lineTo(a.x, a.y + HALF * Y_PER_DAY);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    function icon(ctx, e, kind, lit) {
      var x = e[0], y = e[1];
      if (lit) {                                      // the highlight glow: blue for solar, green for lunar
        var hg = ctx.createRadialGradient(x, y, 0, x, y, 13);
        var col = kind === "solar" ? "0,96,255" : "0,204,0";
        hg.addColorStop(0, "rgba(" + col + ",1)"); hg.addColorStop(1, "rgba(" + col + ",0)");
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(x, y, 13, 0, TAU); ctx.fill();
      }
      var g;
      if (kind === "solar") {
        g = ctx.createRadialGradient(x, y, 0, x, y, 7.5);
        g.addColorStop(0, "#ffe9c4"); g.addColorStop(1, "#feb316");
      } else {
        g = ctx.createRadialGradient(x + 2.9 * 0.35, y - 2.5 * 0.35, 0, x, y, 7.5);
        g.addColorStop(0, "#dadada"); g.addColorStop(1, "#8a8a8a");
      }
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7.5, 0, TAU); ctx.fill();
    }

    // Solar/LunarEclipseInfoPanel, placed beside the icon the way display…EclipseInfo() does
    function panel(ctx, t, a) {
      var e = (a.kind === "solar" ? SOLAR : LUNAR)[a.i];
      var types = a.kind === "solar" ? ["et.total", "et.annular", "et.hybrid", "et.partial"] : ["et.total", "et.penumbral", "et.partial"];
      var W = 248.9, margin = 15;
      ctx.font = "12px Verdana, system-ui, sans-serif";
      var lines = wrapLines(ctx, e[9], 165);
      var H = 82.85 + lines.length * 15 + 8;
      var px = e[0] < 300 ? e[0] + margin : e[0] - margin - W;
      var py = e[1] < -225 ? e[1] + margin : e[1] - margin - H;
      ctx.fillStyle = "#eaf2ff"; ctx.fillRect(px, py, W, H);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 0.6; ctx.strokeRect(px + 0.3, py + 0.3, W - 0.6, H - 0.6);
      var months = t("et.monthsLong").split(",");
      ctx.fillStyle = "#000000"; ctx.textBaseline = "top";
      ctx.font = "13px Verdana, system-ui, sans-serif"; ctx.textAlign = "center";
      var title = t(a.kind === "solar" ? "et.solarOf" : "et.lunarOf") + " " + months[e[3]] + " " + e[4] + ", " + e[5];
      FlashText.fill(ctx, title, px + W / 2, py + 9);
      ctx.fillRect(px + 11, py + 27.2, 227, 0.9);
      ctx.font = "12px Verdana, system-ui, sans-serif"; ctx.textAlign = "left";
      FlashText.fillStatic(ctx, t("et.type"), px + 10, py + 40);
      FlashText.fill(ctx, t(types[e[2]]), px + 92, py + 40);
      FlashText.fillStatic(ctx, t("et.saros"), px + 168, py + 40);
      FlashText.fill(ctx, String(e[6]), px + 212, py + 40);
      FlashText.fillStatic(ctx, t("et.duration"), px + 10, py + 62);
      FlashText.fill(ctx, e[8], px + 71, py + 62);
      FlashText.fillStatic(ctx, t("et.visibility"), px + 10, py + 84);
      lines.forEach(function (ln, k) { FlashText.fill(ctx, ln, px + 72, py + 84 + k * 15); });
    }
    function wrapLines(ctx, text, maxw) {
      var words = text.split(" "), out = [], line = "";
      words.forEach(function (w) {
        var test = line ? line + " " + w : w;
        if (FlashText.width(ctx, test) > maxw && line) { out.push(line); line = w; } else line = test;
      });
      out.push(line);
      return out;
    }

    upd();
  }
});
