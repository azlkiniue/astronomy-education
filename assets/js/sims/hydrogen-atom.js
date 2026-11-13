/* Hydrogen Atom Simulator -----------------------------------------------------
   Rebuild of the NAAP "Hydrogen Atom Simulator" (hydrogen_atom.swf =
   hydrogenatom.swf; TheSimulatorClass, AtomDiagramClass, StreamingPhotonsClass,
   EnergyBarClass, EnergyScaleComponentClass, LogComponentClass and
   GenericEntryClass decompiled). The canvas is the SWF's stage below its title
   bar, drawn from its art:
     • the Atom Diagram — the proton and the six Bohr orbits (radii 22, 78, 175,
       310, 486, 700 px; the occupied one brighter), the electron, photons as
       sine waves (wavelength 124/E px, coloured by 1240/E nm) streaming in at
       500 px/s with fading trails, the 1.5-s transition animation (dots running
       between the orbits while the electron cross-fades), ionisation (the
       electron flies off) and recombination (it flies back in),
     • the Energy Level Diagram — levels 1–20 at −13.6/n² eV with the current
       one marked in red, and "ionized",
     • Photon Selection — the frequency, wavelength and energy scales with the
       red cursor and readouts, the visible band, and the energy bar
       (0–15 eV, 584 px) with every n₁ ≤ 3 transition marked; drag the grabber,
       it snaps to the n₁ ≤ 3, n₂ ≤ 6 transitions within 3 px,
     • the Event Log — each event in red fading to grey after 0.75 s, sliding
       in from the bottom.
   The model is the SWF's: a photon excites the atom only when it carries one of
   those transitions *from the current level*; otherwise it ionises the atom if
   it has enough energy, or passes through. 2.5 s later the electron decays
   (each lower level equally likely) or a free electron recombines (levels 1–4
   at 20 %, 5–6 at 10 %). Drag the electron between orbits (this clears the
   log). The fire-photon and spectral-line buttons are in the sidebar.       */
Sim.create({
  id: "hydrogen-atom",
  width: 950, height: 610,
  strings: {
    en: {
      "ha.eld": "Energy Level Diagram", "ha.photon": "Photon Selection", "ha.log": "Event Log",
      "ha.energy": "photon energy", "ha.fire": "fire photon", "ha.clear": "clear log",
      "ha.presets": "spectral lines", "ha.frequency": "frequency", "ha.wavelength": "wavelength", "ha.energyScale": "energy",
      "ha.infrared": "infrared", "ha.visible": "visible", "ha.ultraviolet": "ultraviolet",
      "ha.level": "level {n}", "ha.ionized": "ionized", "ha.atomIs": "atom is",
      "ha.photonE": "{e} eV photon", "ha.absorbed": "absorbed", "ha.emitted": "emitted", "ha.notAbsorbed": "not absorbed",
      "ha.ionization": "ionization", "ha.excitation": "excitation", "ha.recombination": "recombination", "ha.deexcitation": "deexcitation"
    },
    id: {
      "ha.eld": "Diagram Tingkat Energi", "ha.photon": "Pemilihan Foton", "ha.log": "Log Peristiwa",
      "ha.energy": "energi foton", "ha.fire": "tembakkan foton", "ha.clear": "bersihkan log",
      "ha.presets": "garis spektrum", "ha.frequency": "frekuensi", "ha.wavelength": "panjang gelombang", "ha.energyScale": "energi",
      "ha.infrared": "inframerah", "ha.visible": "tampak", "ha.ultraviolet": "ultraungu",
      "ha.level": "tingkat {n}", "ha.ionized": "terionisasi", "ha.atomIs": "atom",
      "ha.photonE": "foton {e} eV", "ha.absorbed": "diserap", "ha.emitted": "dipancarkan", "ha.notAbsorbed": "tidak diserap",
      "ha.ionization": "ionisasi", "ha.excitation": "eksitasi", "ha.recombination": "rekombinasi", "ha.deexcitation": "deeksitasi"
    }
  },
  about: {
    en: "<p>A hydrogen atom can only hold its electron at certain <strong>energy levels</strong>, E<sub>n</sub> = −13.6 eV / n². " +
        "It absorbs a photon <em>only</em> if the photon's energy exactly matches the gap from the electron's level up to another allowed level.</p>" +
        "<p>Pick a photon — drag the grabber along the energy bar (it snaps to the transitions), or press a spectral-line button — and fire it. Watch three outcomes:</p>" +
        "<ul><li><strong>Absorption</strong>: an exact match lifts the electron to a higher level.</li>" +
        "<li><strong>No absorption</strong>: anything else passes straight through.</li>" +
        "<li><strong>Ionization</strong>: enough energy frees the electron entirely.</li></ul>" +
        "<p>A couple of seconds after absorbing, the electron drops back down, emitting photons — the same lines, in reverse. The Lyman series ends on n=1 (ultraviolet), Balmer on n=2 (visible), Paschen on n=3 (infrared). You can also drag the electron to another orbit.</p>",
    id: "<p>Atom hidrogen hanya dapat menahan elektronnya pada <strong>tingkat energi</strong> tertentu, E<sub>n</sub> = −13,6 eV / n². " +
        "Ia menyerap foton <em>hanya</em> jika energi foton tepat sama dengan selisih dari tingkat elektron ke tingkat lain yang diizinkan.</p>" +
        "<p>Pilih foton — seret pegangan di sepanjang batang energi (ia menempel pada transisi), atau tekan tombol garis spektrum — lalu tembakkan. Amati tiga hasil:</p>" +
        "<ul><li><strong>Penyerapan</strong>: kecocokan tepat menaikkan elektron.</li>" +
        "<li><strong>Tidak diserap</strong>: selain itu foton lewat begitu saja.</li>" +
        "<li><strong>Ionisasi</strong>: energi yang cukup membebaskan elektron.</li></ul>" +
        "<p>Beberapa detik setelah menyerap, elektron turun kembali sambil memancarkan foton — garis yang sama, terbalik. Deret Lyman berakhir di n=1 (ultraungu), Balmer di n=2 (tampak), Paschen di n=3 (inframerah). Elektron juga bisa diseret ke orbit lain.</p>"
  },
  build: function (S) {
    var OY = -30;                                  // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif", ASC = 1.0059, TAU = 2 * Math.PI;
    function t(k) { return I18N.t(k); }
    function fmt(k, o) { return t(k).replace(/\{(\w+)\}/g, function (m, n) { return o[n]; }); }
    function now() { return performance.now(); }
    function flashToFixed(x, f) {
      var s = x < 0 ? "-" : ""; x = Math.abs(x);
      var n = String(Math.round(x * Math.pow(10, f)));
      if (f > 0) { while (n.length < f + 1) n = "0" + n; n = n.slice(0, n.length - f) + "." + n.slice(n.length - f); }
      return s + n;
    }
    var ART = {
      215: {nz:false, layers:[[[["#ffffff","M616.95 -110L-31 -110L-31 -155L616.95 -155L616.95 -110ZM616.95 -45L-31 -45L-31 -90L616.95 -90L616.95 -45ZM617.1 -175L-30.9 -175L-30.9 -220L617.1 -220L617.1 -175Z"]],[[1.0,"#cccccc","M616.95 -110L-31 -110L-31 -155L616.95 -155L616.95 -110M616.95 -45L-31 -45L-31 -90L616.95 -90L616.95 -45M617.1 -175L-30.9 -175L-30.9 -220L617.1 -220L617.1 -175"]]]]},
      146: {nz:false, layers:[[[[{t:"r",m:[0.012817,0.0,0.0,0.012817,2.0,-2.5],s:[[0,"#02d702"],[1,"#017801"]]},"M4.95 -4.9Q7 -2.9 7 0Q7 2.9 4.95 4.95Q2.9 7 0 7Q-2.9 7 -4.9 4.95Q-7 2.9 -7 0Q-7 -2.9 -4.9 -4.9Q-2.9 -7 0 -7Q2.9 -7 4.95 -4.9Z"]],[]]]},
      149: {nz:false, layers:[[[["rgba(228,228,228,0.502)","M1.15 0L-4 -4.3L-1.2 -4.3L3.95 0L-1.2 4.35L-4 4.35L1.15 0Z"]],[]]]},
      151: {nz:false, layers:[[[[{t:"r",m:[0.025635,0.0,0.0,0.025635,3.95,-5.05],s:[[0,"#f30101"],[1,"#9e0101"]]},"M14 0Q14 5.75 9.9 9.9Q5.75 14 0 14Q-5.8 14 -9.9 9.9Q-14 5.75 -14 0Q-14 -5.8 -9.9 -9.85Q-5.8 -14 0 -14Q5.75 -14 9.9 -9.85Q14 -5.8 14 0Z"]],[]]]},
      190: {nz:false, layers:[[[["#cccccc","M1.3 -7.35L1.3 1.2L-1.3 1.2L-1.3 -7.35L-9.8 -7.35L-9.8 -9.85L-1.3 -9.85L-1.3 -18.35L1.3 -18.35L1.3 -9.85L9.8 -9.85L9.8 -7.35L1.3 -7.35Z"]],[]]]},
      193: {nz:false, layers:[[[["#000000","M768.9 125L-0.1 125L-0.1 -125L768.9 -125L768.9 125Z"]],[]]]},
      21: {nz:false, layers:[[[],[[1.0,"#666666","M-15 0L15 0"]]]]},
      23: {nz:false, layers:[[[],[[3.0,"#cc0000","M-15 0.7L15 0.7"]]]]},
      166: {nz:false, layers:[[[],[[1.0,"#000000","M-9.5 0.1L10.5 0.1"]]],[[],[[1.0,"#000000","M-5.65 -2.8L-10.5 0L-5.65 2.8"]]]]},
      168: {nz:false, layers:[[[],[[1.0,"#000000","M6.2 -6.3L4.35 -4.4L4.35 -4.2L4.4 -3.9Q4 -2.75 2.85 -2.6L2.65 -2.7L2.6 -2.75L1.95 -2.85Q1.5 -2.75 1.1 -2.35L0.6 -1.5Q0.45 -1.05 0.75 -0.8Q1 -0.55 0.9 -0.1L0.4 0.75L0.3 0.8L-0.45 1.25L-1.15 1.1Q-1.45 0.85 -1.9 0.95L-2.75 1.5Q-3.15 1.85 -3.2 2.3Q-3.3 2.75 -3.05 3Q-2.85 3.25 -2.95 3.7L-3.4 4.55L-4.25 5.05L-5 4.9L-5.05 4.85L-5.7 4.8L-6.2 5L-6.55 5.3L-6.95 5.9L-7.05 6.1Q-7.15 6.55 -6.9 6.85L-6.75 7.1"]]],[[],[[1.0,"#000000","M5.7 -1.65L7.1 -7.05L1.75 -5.6"]]]]},
      170: {nz:false, layers:[[[],[]],[[["#000000","M10 -0.25L10.15 -0.2L10.25 0L10.15 0.15L10 0.25L9.8 0.15L9.75 0L9.8 -0.2L10 -0.25ZM20.15 -0.2L20.25 0L20.15 0.15L20 0.25L19.8 0.15L19.75 0L19.8 -0.2L20 -0.25L20.15 -0.2ZM17.65 -0.2L17.75 0L17.65 0.15L17.5 0.25L17.3 0.15L17.25 0L17.3 -0.2L17.5 -0.25L17.65 -0.2ZM15.15 -0.2L15.25 0L15.15 0.15L15 0.25L14.8 0.15L14.75 0L14.8 -0.2L15 -0.25L15.15 -0.2ZM12.65 -0.2L12.75 0L12.65 0.15L12.5 0.25L12.3 0.15L12.25 0L12.3 -0.2L12.5 -0.25L12.65 -0.2ZM22.5 -0.25L22.65 -0.2L22.75 0L22.65 0.15L22.5 0.25L22.3 0.15L22.25 0L22.3 -0.2L22.5 -0.25ZM25 -0.25L25.15 -0.2L25.25 0L25.15 0.15L25 0.25L24.8 0.15L24.75 0L24.8 -0.2L25 -0.25ZM27.5 -0.25L27.65 -0.2L27.75 0L27.65 0.15L27.5 0.25L27.3 0.15L27.25 0L27.3 -0.2L27.5 -0.25ZM30 -0.25L30.15 -0.2L30.25 0L30.15 0.15L30 0.25L29.8 0.15L29.75 0L29.8 -0.2L30 -0.25ZM32.5 -0.25L32.65 -0.2L32.75 0L32.65 0.15L32.5 0.25L32.3 0.15L32.25 0L32.3 -0.2L32.5 -0.25ZM35 -0.25L35.15 -0.2L35.25 0L35.15 0.15L35 0.25L34.8 0.15L34.75 0L34.8 -0.2L35 -0.25ZM37.5 -0.25L37.65 -0.2L37.75 0L37.65 0.15L37.5 0.25L37.3 0.15L37.25 0L37.3 -0.2L37.5 -0.25ZM40 -0.25L40.15 -0.2L40.25 0L40.15 0.15L40 0.25L39.8 0.15L39.75 0L39.8 -0.2L40 -0.25ZM42.5 -0.25L42.65 -0.2L42.75 0L42.65 0.15L42.5 0.25L42.3 0.15L42.25 0L42.3 -0.2L42.5 -0.25ZM45 -0.25L45.15 -0.2L45.25 0L45.15 0.15L45 0.25L44.8 0.15L44.75 0L44.8 -0.2L45 -0.25ZM47.5 -0.25L47.65 -0.2L47.75 0L47.65 0.15L47.5 0.25L47.3 0.15L47.25 0L47.3 -0.2L47.5 -0.25ZM50 -0.25L50.15 -0.2L50.25 0L50.15 0.15L50 0.25L49.8 0.15L49.75 0L49.8 -0.2L50 -0.25ZM60.15 -0.2L60.25 0L60.15 0.15L60 0.25L59.8 0.15L59.75 0L59.8 -0.2L60 -0.25L60.15 -0.2ZM57.65 -0.2L57.75 0L57.65 0.15L57.5 0.25L57.3 0.15L57.25 0L57.3 -0.2L57.5 -0.25L57.65 -0.2ZM55.15 -0.2L55.25 0L55.15 0.15L55 0.25L54.8 0.15L54.75 0L54.8 -0.2L55 -0.25L55.15 -0.2ZM52.65 -0.2L52.75 0L52.65 0.15L52.5 0.25L52.3 0.15L52.25 0L52.3 -0.2L52.5 -0.25L52.65 -0.2ZM62.5 -0.25L62.65 -0.2L62.75 0L62.65 0.15L62.5 0.25L62.3 0.15L62.25 0L62.3 -0.2L62.5 -0.25ZM65 -0.25L65.15 -0.2L65.25 0L65.15 0.15L65 0.25L64.8 0.15L64.75 0L64.8 -0.2L65 -0.25ZM67.5 -0.25L67.65 -0.2L67.75 0L67.65 0.15L67.5 0.25L67.3 0.15L67.25 0L67.3 -0.2L67.5 -0.25ZM70 -0.25L70.15 -0.2L70.25 0L70.15 0.15L70 0.25L69.8 0.15L69.75 0L69.8 -0.2L70 -0.25ZM72.5 -0.25L72.65 -0.2L72.75 0L72.65 0.15L72.5 0.25L72.3 0.15L72.25 0L72.3 -0.2L72.5 -0.25ZM75 -0.25L75.15 -0.2L75.25 0L75.15 0.15L75 0.25L74.8 0.15L74.75 0L74.8 -0.2L75 -0.25ZM77.5 -0.25L77.65 -0.2L77.75 0L77.65 0.15L77.5 0.25L77.3 0.15L77.25 0L77.3 -0.2L77.5 -0.25ZM80 -0.25L80.15 -0.2L80.25 0L80.15 0.15L80 0.25L79.8 0.15L79.75 0L79.8 -0.2L80 -0.25ZM82.5 -0.25L82.65 -0.2L82.75 0L82.65 0.15L82.5 0.25L82.3 0.15L82.25 0L82.3 -0.2L82.5 -0.25ZM85 -0.25L85.15 -0.2L85.25 0L85.15 0.15L85 0.25L84.8 0.15L84.75 0L84.8 -0.2L85 -0.25ZM87.5 -0.25L87.65 -0.2L87.75 0L87.65 0.15L87.5 0.25L87.3 0.15L87.25 0L87.3 -0.2L87.5 -0.25ZM90 -0.25L90.15 -0.2L90.25 0L90.15 0.15L90 0.25L89.8 0.15L89.75 0L89.8 -0.2L90 -0.25ZM100.15 -0.2L100.25 0L100.15 0.15L100 0.25L99.8 0.15L99.75 0L99.8 -0.2L100 -0.25L100.15 -0.2ZM97.65 -0.2L97.75 0L97.65 0.15L97.5 0.25L97.3 0.15L97.25 0L97.3 -0.2L97.5 -0.25L97.65 -0.2ZM95.15 -0.2L95.25 0L95.15 0.15L95 0.25L94.8 0.15L94.75 0L94.8 -0.2L95 -0.25L95.15 -0.2ZM92.65 -0.2L92.75 0L92.65 0.15L92.5 0.25L92.3 0.15L92.25 0L92.3 -0.2L92.5 -0.25L92.65 -0.2ZM102.5 -0.25L102.65 -0.2L102.75 0L102.65 0.15L102.5 0.25L102.3 0.15L102.25 0L102.3 -0.2L102.5 -0.25ZM105 -0.25L105.15 -0.2L105.25 0L105.15 0.15L105 0.25L104.8 0.15L104.75 0L104.8 -0.2L105 -0.25ZM107.5 -0.25L107.65 -0.2L107.75 0L107.65 0.15L107.5 0.25L107.3 0.15L107.25 0L107.3 -0.2L107.5 -0.25ZM110 -0.25L110.15 -0.2L110.25 0L110.15 0.15L110 0.25L109.8 0.15L109.75 0L109.8 -0.2L110 -0.25ZM112.5 -0.25L112.65 -0.2L112.75 0L112.65 0.15L112.5 0.25L112.3 0.15L112.25 0L112.3 -0.2L112.5 -0.25ZM115 -0.25L115.15 -0.2L115.25 0L115.15 0.15L115 0.25L114.8 0.15L114.75 0L114.8 -0.2L115 -0.25ZM117.5 -0.25L117.65 -0.2L117.75 0L117.65 0.15L117.5 0.25L117.3 0.15L117.25 0L117.3 -0.2L117.5 -0.25ZM120 -0.25L120.15 -0.2L120.25 0L120.15 0.15L120 0.25L119.8 0.15L119.75 0L119.8 -0.2L120 -0.25ZM122.5 -0.25L122.65 -0.2L122.75 0L122.65 0.15L122.5 0.25L122.3 0.15L122.25 0L122.3 -0.2L122.5 -0.25ZM125 -0.25L125.15 -0.2L125.25 0L125.15 0.15L125 0.25L124.8 0.15L124.75 0L124.8 -0.2L125 -0.25ZM127.5 -0.25L127.65 -0.2L127.75 0L127.65 0.15L127.5 0.25L127.3 0.15L127.25 0L127.3 -0.2L127.5 -0.25ZM130 -0.25L130.15 -0.2L130.25 0L130.15 0.15L130 0.25L129.8 0.15L129.75 0L129.8 -0.2L130 -0.25ZM140.15 -0.2L140.25 0L140.15 0.15L140 0.25L139.8 0.15L139.75 0L139.8 -0.2L140 -0.25L140.15 -0.2ZM137.65 -0.2L137.75 0L137.65 0.15L137.5 0.25L137.3 0.15L137.25 0L137.3 -0.2L137.5 -0.25L137.65 -0.2ZM135.15 -0.2L135.25 0L135.15 0.15L135 0.25L134.8 0.15L134.75 0L134.8 -0.2L135 -0.25L135.15 -0.2ZM132.65 -0.2L132.75 0L132.65 0.15L132.5 0.25L132.3 0.15L132.25 0L132.3 -0.2L132.5 -0.25L132.65 -0.2ZM142.5 -0.25L142.65 -0.2L142.75 0L142.65 0.15L142.5 0.25L142.3 0.15L142.25 0L142.3 -0.2L142.5 -0.25ZM145 -0.25L145.15 -0.2L145.25 0L145.15 0.15L145 0.25L144.8 0.15L144.75 0L144.8 -0.2L145 -0.25ZM147.5 -0.25L147.65 -0.2L147.75 0L147.65 0.15L147.5 0.25L147.3 0.15L147.25 0L147.3 -0.2L147.5 -0.25ZM150 -0.25L150.15 -0.2L150.25 0L150.15 0.15L150 0.25L149.8 0.15L149.75 0L149.8 -0.2L150 -0.25ZM152.5 -0.25L152.65 -0.2L152.75 0L152.65 0.15L152.5 0.25L152.3 0.15L152.25 0L152.3 -0.2L152.5 -0.25ZM155 -0.25L155.15 -0.2L155.25 0L155.15 0.15L155 0.25L154.8 0.15L154.75 0L154.8 -0.2L155 -0.25ZM157.5 -0.25L157.65 -0.2L157.75 0L157.65 0.15L157.5 0.25L157.3 0.15L157.25 0L157.3 -0.2L157.5 -0.25ZM160 -0.25L160.15 -0.2L160.25 0L160.15 0.15L160 0.25L159.8 0.15L159.75 0L159.8 -0.2L160 -0.25ZM162.5 -0.25L162.65 -0.2L162.75 0L162.65 0.15L162.5 0.25L162.3 0.15L162.25 0L162.3 -0.2L162.5 -0.25ZM165 -0.25L165.15 -0.2L165.25 0L165.15 0.15L165 0.25L164.8 0.15L164.75 0L164.8 -0.2L165 -0.25ZM167.5 -0.25L167.65 -0.2L167.75 0L167.65 0.15L167.5 0.25L167.3 0.15L167.25 0L167.3 -0.2L167.5 -0.25ZM170 -0.25L170.15 -0.2L170.25 0L170.15 0.15L170 0.25L169.8 0.15L169.75 0L169.8 -0.2L170 -0.25ZM180.15 -0.2L180.25 0L180.15 0.15L180 0.25L179.8 0.15L179.75 0L179.8 -0.2L180 -0.25L180.15 -0.2ZM177.65 -0.2L177.75 0L177.65 0.15L177.5 0.25L177.3 0.15L177.25 0L177.3 -0.2L177.5 -0.25L177.65 -0.2ZM175.15 -0.2L175.25 0L175.15 0.15L175 0.25L174.8 0.15L174.75 0L174.8 -0.2L175 -0.25L175.15 -0.2ZM172.65 -0.2L172.75 0L172.65 0.15L172.5 0.25L172.3 0.15L172.25 0L172.3 -0.2L172.5 -0.25L172.65 -0.2ZM182.5 -0.25L182.65 -0.2L182.75 0L182.65 0.15L182.5 0.25L182.3 0.15L182.25 0L182.3 -0.2L182.5 -0.25ZM185 -0.25L185.15 -0.2L185.25 0L185.15 0.15L185 0.25L184.8 0.15L184.75 0L184.8 -0.2L185 -0.25ZM187.5 -0.25L187.65 -0.2L187.75 0L187.65 0.15L187.5 0.25L187.3 0.15L187.25 0L187.3 -0.2L187.5 -0.25ZM190 -0.25L190.15 -0.2L190.25 0L190.15 0.15L190 0.25L189.8 0.15L189.75 0L189.8 -0.2L190 -0.25ZM192.65 -0.2L192.75 0L192.65 0.15L192.5 0.25L192.3 0.15L192.25 0L192.3 -0.2L192.5 -0.25L192.65 -0.2ZM195 -0.25L195.15 -0.2L195.25 0L195.15 0.15L195 0.25L194.8 0.15L194.75 0L194.8 -0.2L195 -0.25ZM197.5 -0.25L197.65 -0.2L197.75 0L197.65 0.15L197.5 0.25L197.3 0.15L197.25 0L197.3 -0.2L197.5 -0.25ZM200 -0.25L200.15 -0.2L200.25 0L200.15 0.15L200 0.25L199.8 0.15L199.75 0L199.8 -0.2L200 -0.25ZM202.65 -0.2L202.75 0L202.65 0.15L202.5 0.25L202.3 0.15L202.25 0L202.3 -0.2L202.5 -0.25L202.65 -0.2ZM205 -0.25L205.15 -0.2L205.25 0L205.15 0.15L205 0.25L204.8 0.15L204.75 0L204.8 -0.2L205 -0.25ZM207.5 -0.25L207.65 -0.2L207.75 0L207.65 0.15L207.5 0.25L207.3 0.15L207.25 0L207.3 -0.2L207.5 -0.25ZM210 -0.25L210.15 -0.2L210.25 0L210.15 0.15L210 0.25L209.8 0.15L209.75 0L209.8 -0.2L210 -0.25ZM212.5 -0.25L212.65 -0.2L212.75 0L212.65 0.15L212.5 0.25L212.3 0.15L212.25 0L212.3 -0.2L212.5 -0.25ZM217.65 -0.2L217.75 0L217.65 0.15L217.5 0.25L217.3 0.15L217.25 0L217.3 -0.2L217.5 -0.25L217.65 -0.2ZM220 -0.25L220.15 -0.2L220.25 0L220.15 0.15L220 0.25L219.8 0.15L219.75 0L219.8 -0.2L220 -0.25ZM222.5 -0.25L222.65 -0.2L222.75 0L222.65 0.15L222.5 0.25L222.3 0.15L222.25 0L222.3 -0.2L222.5 -0.25ZM215.15 -0.2L215.25 0L215.15 0.15L215 0.25L214.8 0.15L214.75 0L214.8 -0.2L215 -0.25L215.15 -0.2ZM227.65 -0.2L227.75 0L227.65 0.15L227.5 0.25L227.3 0.15L227.25 0L227.3 -0.2L227.5 -0.25L227.65 -0.2ZM225.15 -0.2L225.25 0L225.15 0.15L225 0.25L224.8 0.15L224.75 0L224.8 -0.2L225 -0.25L225.15 -0.2Z"]],[]]]},
      178: {nz:false, layers:[[[["#ffffff","M253.1 54L253.1 309L18.1 309L18.1 54L253.1 54Z"]],[[0.05,"#cccccc","M253.1 54L253.1 309L18.1 309L18.1 54L253.1 54"]]]]},
      202: {nz:false, layers:[[[["#999999","M-4.25 -11.9Q-2.45 -13.5 0 -13.5Q2.45 -13.5 4.2 -11.9Q6 -10.3 6 -8.1L6 8.1Q6 10.3 4.2 11.9Q2.45 13.5 0 13.5Q-2.45 13.5 -4.25 11.9Q-6 10.3 -6 8.1L-6 -8.1Q-6 -10.3 -4.25 -11.9Z"]],[]],[[[{t:"l",m:[0.006104,0.0,0.0,0.015259,0.0,0.0],s:[[0,"#e4e4e4"],[0.5255,"#f4f4f4"],[1,"#e1e1e1"]]},"M-3.55 -11.05Q-2.05 -12.5 0 -12.5Q2.05 -12.5 3.5 -11.05Q5 -9.55 5 -7.5L5 7.5Q5 9.55 3.5 11Q2.05 12.5 0 12.5Q-2.05 12.5 -3.55 11Q-5 9.55 -5 7.5L-5 -7.5Q-5 -9.55 -3.55 -11.05Z"]],[[3.0,"#cc0000","M0 -137.05L0 -132.05M0 -72L0 -67M0 -201.05L0 -196.05"]]]]},
      207: {nz:false, layers:[[[["#999999","M-4.2 -4.5L588.2 -4.45Q590.15 -4.45 591.55 -3.1Q593 -1.85 593 0Q593 1.85 591.55 3.2Q590.15 4.45 588.2 4.5L-4.2 4.4Q-6.2 4.4 -7.6 3.15Q-9 1.8 -9 -0.05Q-9 -1.9 -7.6 -3.15Q-6.2 -4.5 -4.2 -4.5Z"]],[]],[[[{t:"l",m:[0.0,-0.004242,0.366211,3.1e-05,291.95,-0.05],s:[[0,"#c1c1c1"],[1,"#fafafa"]]},"M-3.2 -3.5L587.2 -3.45Q589.15 -3.45 590.55 -2.4Q591.95 -1.45 592 0Q591.95 1.45 590.55 2.5Q589.15 3.45 587.2 3.5L-3.2 3.45Q-5.2 3.45 -6.65 2.45Q-8.05 1.4 -8 -0.05Q-8.05 -1.5 -6.65 -2.45Q-5.2 -3.5 -3.2 -3.5Z"]],[]]]},
      208: {nz:false, layers:[[[["rgba(255,0,204,0.361)","M-3.2 -3.5L587.2 -3.45Q589.15 -3.45 590.55 -2.4Q591.95 -1.45 592 0Q591.95 1.45 590.55 2.5Q589.15 3.45 587.2 3.5L-3.2 3.45Q-5.2 3.45 -6.65 2.45Q-8.05 1.4 -8 -0.05Q-8.05 -1.5 -6.65 -2.45Q-5.2 -3.5 -3.2 -3.5Z"]],[]]]},
      211: {nz:false, layers:[[[],[[1.0,"#666666","M0 -8L0 8"]]]]},
      213: {nz:false, layers:[[[],[[1.0,"#666666","M0 -20L0 20"]]]]},
      219: {nz:false, layers:[[[],[[1.0,"#666666","M96.6 -138.15L96.6 -128.15M4.8 -138.15L4.8 -128.15M48.3 -138.15L48.3 -128.15M241.4 -138.15L241.4 -128.15M482.7 -138.15L482.7 -128.15"]]]]},
      225: {nz:false, layers:[[[],[[1.0,"#666666","M77.8 -73.05L77.8 -67.05M38.9 -73.05L38.9 -67.05M0 -73.05L0 -63.05M155.6 -73.05L155.6 -67.05M116.7 -73.05L116.7 -67.05M233.4 -73.05L233.4 -67.05M194.5 -73.05L194.5 -63.05M311.2 -73.05L311.2 -67.05M272.3 -73.05L272.3 -67.05M389 -73.05L389 -63.05M350.1 -73.05L350.1 -67.05M466.8 -73.05L466.8 -67.05M427.9 -73.05L427.9 -67.05M544.6 -73.05L544.6 -67.05M505.7 -73.05L505.7 -67.05M584 -73.05L584 -63.05"]]]]},
      230: {nz:false, layers:[[[],[[1.0,"#666666","M322.1 -202L322.1 -192M16.1 -202L16.1 -192M161 -202L161 -192M483.1 -202L483.1 -192"]]]]},
    };
    var GREEK = {name: 'WP Greek Century', bold: false, italic: false, em: 51.2, asc: 49, desc: 12.6, lead: 10.4, g: {
        '"': [29.9, "M19.15 -14.6L22.3 -24.1L26.95 -24.1L25.25 -19.9L23.3 -15.95L20.1 -9.6L20.35 -8.4Q21.1 -5.25 21.65 -4.3Q22.2 -3.3 23.3 -3.3Q25.35 -3.3 25.35 -6.8L27.75 -6.8Q27.75 0.7 23.15 0.7Q21.3 0.7 20.25 -0.85Q19.25 -2.35 18.3 -6.3L16.55 -3.5L15 -1.7Q12.8 0.7 10 0.7Q6.6 0.7 4.75 -2.2Q2.9 -5.1 2.9 -10.4Q2.9 -16.15 5.8 -20.45Q8.65 -24.75 12.45 -24.75Q15.1 -24.75 16.5 -22.6L17.3 -21L17.85 -19.25L19.15 -14.6M12.75 -21.45Q10.75 -21.45 9.2 -17.95Q7.6 -14.45 7.6 -10.05Q7.6 -6.6 8.55 -4.45Q9.45 -2.35 11 -2.35Q12.65 -2.35 14.1 -4.1Q15.5 -5.85 17.5 -10.4Q16.25 -16.95 15.15 -19.45Q14.35 -21.45 12.75 -21.45"],
        '$': [28.45, "M23.2 -28.8Q23.2 -26.1 21.95 -24.5Q20.75 -22.9 17.8 -21.95Q20.6 -21.65 21.9 -20.7Q25.8 -18.2 25.8 -12.1Q25.8 -6.45 23.05 -3.05Q20.3 0.3 15.65 0.3Q13.2 0.3 11.65 -0.45Q10.15 -1.2 8.4 -3.3L8.4 10.8L3.85 10.8L3.85 -22.75Q3.85 -26.95 4.25 -29.9Q4.7 -32.8 6.85 -35Q9.45 -37.6 13.75 -37.6Q18.05 -37.6 20.65 -35.25Q23.2 -32.9 23.2 -28.8M8.4 -25.65L8.4 -7.75Q9.8 -4.8 11.3 -3.6Q12.75 -2.4 14.95 -2.4Q17.5 -2.4 19.2 -4.9Q20.9 -7.35 20.9 -11.15Q20.9 -16.2 19.3 -18.3Q17.7 -20.35 13.75 -20.35L13 -20.35L13 -22.75Q16 -22.75 17.4 -24.2Q18.8 -25.65 18.8 -28.7Q18.8 -35.15 13.75 -35.15Q12.15 -35.15 10.8 -34.15Q9.5 -33.15 8.95 -31.45L8.55 -29.1Q8.4 -27.75 8.4 -25.65"],
        '(': [29.5, "M7.2 -24.5Q10.85 -24.5 12.75 -16.95L15.15 -6.1L21.25 -24.1L26.6 -24.1L16 -1.2L16.9 3.75L17.15 5.8L17.3 7.6Q17.3 9.3 16.6 10.25Q15.9 11.25 14.65 11.25Q11.95 11.25 11.95 7.95Q11.95 6.7 12.6 4.1L13.95 -1.2L12.5 -7.5L11.4 -11.7L10.05 -16.25Q9.3 -18.55 8.65 -19.45Q8 -20.3 6.95 -20.3Q4.85 -20.3 4.85 -17.3L2.55 -17.3Q2.55 -24.5 7.2 -24.5"],
        '*': [27.25, "M8.25 -36.2Q9.7 -37.65 11.8 -37.65Q13.2 -37.65 14.85 -36.8Q16.5 -35.95 18.9 -34L21.5 -31.8L18.9 -28.65L16.5 -30.7Q14.4 -32.5 13.1 -33.35Q11.75 -34.2 11.05 -34.2Q9.45 -34.2 9.45 -32.65Q9.45 -31.55 10.85 -30.05L13.1 -28.05Q14.15 -27.15 17 -25Q20.4 -22.5 21.8 -20.9Q23.25 -19.3 24.05 -17.15Q24.85 -15 24.85 -12.25Q24.85 -6.8 21.65 -3.25Q18.45 0.3 13.55 0.3Q9 0.3 5.8 -3.1Q2.55 -6.5 2.55 -11.35Q2.55 -17.2 5.6 -20.65Q8.65 -24.1 13.85 -24.1Q6.8 -28.9 6.8 -32.6Q6.8 -34.7 8.25 -36.2M9.05 -4.65Q10.7 -2.05 13.6 -2.05Q16.55 -2.05 18.25 -4.6Q20 -7.2 20 -11.6Q20 -21.9 13.65 -21.9Q10.75 -21.9 9.05 -19.25Q7.4 -16.6 7.4 -11.9Q7.4 -7.3 9.05 -4.65"],
        'g': [22.55, "M20.15 -19.3Q20.15 -17.95 19.4 -17.1Q18.6 -16.2 17.55 -16.2Q16.45 -16.2 15.7 -16.85Q14.95 -17.5 14.95 -18.4L14.95 -18.9L15.3 -20L15.3 -20.4Q15.3 -22 12.65 -22Q10.2 -22 8.85 -20.95Q7.5 -19.9 7.5 -18Q7.5 -16.1 9 -15.1Q10.45 -14.05 13.15 -14.05L14.2 -14.05L14.2 -11.65L13.4 -11.7Q7.1 -11.7 7.1 -7.05Q7.1 -4.9 8.55 -3.5Q10.05 -2.15 12.3 -2.15Q14.65 -2.15 16.2 -3.35Q17.8 -4.55 18.95 -7.3L21.1 -6.55Q18.9 0.3 11.2 0.3Q7.1 0.3 4.6 -1.6Q2.1 -3.45 2.1 -6.65Q2.1 -11 7.15 -12.85Q2.5 -14.2 2.5 -17.9Q2.5 -20.85 5.05 -22.65Q7.65 -24.5 11.8 -24.5Q15.5 -24.5 17.8 -23.05Q20.15 -21.6 20.15 -19.3"]
    }};
    GREEK.p = {};
    function shape(ctx, id, x, y, override) { ctx.save(); ctx.translate(x || 0, y || 0); SwfShape.draw(ctx, ART[id], override); ctx.restore(); }
    function font(ctx, size, style) { ctx.font = (style ? style + " " : "") + size + "px " + FONT; }
    function greek(ctx, ch, x, y, size, align) {  // the "WP Greek Century" subscripts
      var g = GREEK.g[ch], k = size / GREEK.em, w = 20 * g[0] * k;
      w = Math.floor(w + 1e-6) / 20;
      var x0 = align === "center" ? x - w / 2 : x;
      ctx.save(); ctx.translate(x0, y); ctx.scale(k, k);
      ctx.fill(GREEK.p[ch] || (GREEK.p[ch] = new Path2D(g[1])));
      ctx.restore();
    }

    /* ---------------- the atom (AtomDiagramClass) ---------------- */
    var DIAG = { x: 7.1, y: 162, w: 769, hh: 125 };
    var LEVELS = [22, 78, 175, 310, 486, 700];
    var OCC = 0.8, UNOCC = 0.3, PHOTON_SPEED = 500, TRANSITION_TIME = 1500;
    var NULL_TIME = 1000 * DIAG.w / PHOTON_SPEED;
    var atom = {
      level: 1, orbitAlpha: LEVELS.map(function (_, i) { return i === 0 ? OCC : UNOCC; }),
      e1: { x: LEVELS[0], y: 0, a: 1 }, e2: { x: 0, y: 0, a: 0 },
      ionized: false, anim: null, progress: null
    };
    var photons = [], trail = [], trailHead = 0, TRAIL_N = 10, timeLastPhotons = now();
    for (var ti = 0; ti < TRAIL_N; ti++) trail.push([]);

    function photonStyle(wl) {                     // getPhotonStyleFromWavelength
      var dw = (wl - 380) / 340;
      if (dw < 0) return "#8a00ff";
      if (dw > 1) return "#ff003a";
      var sp = [[0, 138, 0, 255], [0.24313725490196078, 90, 27, 255], [0.28627450980392155, 16, 151, 223], [0.4196078431372549, 0, 255, 192],
        [0.5058823529411764, 36, 255, 0], [0.5529411764705883, 233, 236, 0], [0.6823529411764706, 255, 23, 0], [1, 255, 0, 58]];
      var k = 1;
      while (dw > sp[k][0]) k++;
      var f = (dw - sp[k - 1][0]) / (sp[k][0] - sp[k - 1][0]);
      var c = [1, 2, 3].map(function (i) { return Math.floor(f * (sp[k][i] - sp[k - 1][i]) + sp[k - 1][i]); });
      return "rgb(" + c.join(",") + ")";
    }
    function addPhoton(x0, y0, x1, y1, energy) {   // StreamingPhotonsClass.addPhoton
      var dx = x1 - x0, dy = y1 - y0, a = Math.atan2(dy, dx);
      photons.push({ sx: x0, sy: y0, lx: x0, ly: y0, pos: 0, len: Math.sqrt(dx * dx + dy * dy),
        freq: TAU / (124 / energy), amp: 8, color: photonStyle(1240 / energy), c: Math.cos(a), s: Math.sin(a) });
    }
    function stepPhotons(tm) {                     // one frame: a new trail segment, the oldest faded out
      var dpos = PHOTON_SPEED / 1000 * (tm - timeLastPhotons), n = Math.ceil(dpos / 1.2), st = n ? dpos / n : 0, seg = [];
      for (var i = photons.length - 1; i >= 0; i--) {
        var p = photons[i], pts = [[p.lx, p.ly]], x = p.pos;
        for (var j = 0; j < n; j++) {
          x += st;
          if (x > p.len) break;
          var y = p.amp * Math.sin(x * p.freq);
          p.lx = p.sx + x * p.c - y * p.s; p.ly = p.sy + x * p.s + y * p.c;
          pts.push([p.lx, p.ly]);
        }
        p.pos = x;
        seg.push({ color: p.color, pts: pts });
        if (!(p.pos < p.len)) photons.splice(i, 1);
      }
      trail[trailHead] = seg;
      trailHead = (trailHead + 1) % TRAIL_N;
      timeLastPhotons = tm;
    }

    function startTransition(newLevel) {           // startElectronTransition
      var oldLevel = atom.level, xOld = LEVELS[oldLevel - 1], xNew = LEVELS[newLevel - 1];
      atom.progress = { x0: Math.min(xOld, xNew), x1: Math.max(xOld, xNew), dir: newLevel < oldLevel ? -1 : 1, alpha: 1, off: 0 };
      atom.orbitAlpha[oldLevel - 1] = OCC; atom.orbitAlpha[newLevel - 1] = UNOCC;
      atom.e1 = { x: xNew, y: 0, a: 0 }; atom.e2 = { x: xOld, y: 0, a: 1 };
      atom.anim = { kind: "transition", start: now(), oldLevel: oldLevel, newLevel: newLevel };
      atom.level = newLevel;
    }
    function atomFirePhoton(energy, newLevel, extra) {   // AtomDiagramClass.firePhoton
      var xEnd;
      if (newLevel != null) {
        xEnd = LEVELS[atom.level - 1];
        atom.anim = { kind: "absorption", until: now() + 1000 * (DIAG.w - xEnd) / PHOTON_SPEED, energy: energy, newLevel: newLevel, extra: extra };
      } else {
        xEnd = 0;
        atom.anim = { kind: "none", until: now() + NULL_TIME, energy: energy };
      }
      addPhoton(DIAG.w, 0, xEnd, 0, energy);
    }
    function deexcite(energy, newLevel) {          // deexciteAtom: the photon leaves up and to the right
      var mx = LEVELS[newLevel - 1] + (LEVELS[atom.level - 1] - LEVELS[newLevel - 1]) / 2, dx = DIAG.w / 0.5253219888177297;
      addPhoton(mx, 0, mx + dx, -dx, energy);
      onDeexcitation(energy, atom.level, newLevel);
      startTransition(newLevel);
    }
    function ionize(extra) {                       // ionizeAtom
      var oldLevel = atom.level;
      atom.orbitAlpha[atom.level - 1] = UNOCC;
      atom.ionized = true;
      atom.level = Infinity;
      var ang = 2.6 * (Math.random() - 0.5);
      ang += Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2;
      atom.anim = { kind: "ionization", start: now(), sx: atom.e1.x, sy: atom.e1.y, ang: ang,
        speed: 0.1 + PHOTON_SPEED / 1000 * Math.sqrt(extra / 15) };
      onIonization(atom.photonEnergy, oldLevel);
    }
    function recapture(newLevel) {                 // recaptureElectron
      var ang = 2.6 * (Math.random() - 0.5), d = 5 + 14 + DIAG.hh / Math.cos(ang);
      ang += Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2;
      var ex = LEVELS[newLevel - 1];
      atom.anim = { kind: "recombination", start: now(), sx: ex + d * Math.cos(ang), sy: d * Math.sin(ang), ex: ex,
        ang: ang + Math.PI, len: d, dur: d / 0.15, newLevel: newLevel };
      atom.e1 = { x: atom.anim.sx, y: atom.anim.sy, a: 1 };
      atom.level = newLevel;
    }
    function stepAtom(tm) {
      var A = atom.anim;
      if (!A) return;
      if (A.kind === "transition") {
        var dt = tm - A.start, u = dt / TRANSITION_TIME;
        if (u > 1) {
          atom.progress = null;
          atom.e1.a = 1; atom.e2.a = 0;
          atom.orbitAlpha[A.newLevel - 1] = OCC; atom.orbitAlpha[A.oldLevel - 1] = UNOCC;
          atom.anim = null; onAnimationFinished();
        } else {
          atom.progress.off = atom.progress.dir * ((dt * 0.03) % 12);
          atom.e1.a = u; atom.e2.a = 1 - u;
          var d = u * (OCC - UNOCC);
          atom.orbitAlpha[A.newLevel - 1] = UNOCC + d; atom.orbitAlpha[A.oldLevel - 1] = OCC - d;
          atom.progress.alpha = u < 0.5 ? 1 : 1 - 2 * (u - 0.5);
        }
      } else if (A.kind === "absorption" && tm > A.until) {
        atom.anim = null;
        if (isFinite(A.newLevel)) { onExcitation(A.energy, atom.level, A.newLevel); startTransition(A.newLevel); }
        else ionize(A.extra);
      } else if (A.kind === "none" && tm > A.until) {
        atom.anim = null; onAnimationFinished(); onNoAbsorption(A.energy);
      } else if (A.kind === "ionization") {
        var dd = (tm - A.start) * A.speed;
        atom.e1.x = A.sx + dd * Math.cos(A.ang); atom.e1.y = A.sy + dd * Math.sin(A.ang);
        if (atom.e1.x < -7 || atom.e1.x > DIAG.w + 7 || atom.e1.y < -DIAG.hh - 7 || atom.e1.y > DIAG.hh + 7) { atom.anim = null; onAnimationFinished(); }
      } else if (A.kind === "recombination") {
        var uu = (tm - A.start) / A.dur;
        if (uu > 1) {
          atom.e1 = { x: A.ex, y: 0, a: 1 };
          atom.orbitAlpha[A.newLevel - 1] = OCC;
          atom.ionized = false;
          atom.anim = null; onAnimationFinished(); onRecombination(atom.level);
        } else { atom.e1.x = A.sx + uu * A.len * Math.cos(A.ang); atom.e1.y = A.sy + uu * A.len * Math.sin(A.ang); }
      }
    }

    /* ---------------- the simulator (TheSimulatorClass) ---------------- */
    var sim = { level: 1, queued: null, timer: null, transitionID: null, busy: false };
    var scaleLevel = 1;                            // what the Energy Level Diagram shows (set by the events)
    var DECAY = [[], [1], [0.5, 0.5], [0.33, 0.33, 0.34], [0.25, 0.25, 0.25, 0.25], [0.2, 0.2, 0.2, 0.2, 0.2]];
    var RECOMB = [0.2, 0.2, 0.2, 0.2, 0.1, 0.1];
    var TRANSITION_IDS = [[null], [null, null, 0, 1, 2, 3, 4], [null, null, null, 5, 6, 7, 8], [null, null, null, null, 9, 10, 11]];
    function pick(table) {
      var p = Math.random(), ps = 0, i = 0;
      for (; i < table.length; i++) { ps += table[i]; if (p < ps) break; }
      return Math.min(i, table.length - 1) + 1;
    }
    function onAnimationFinished() {
      if (sim.queued) { var q = sim.queued; sim.queued = null; firePhoton(q.energy, q.l1, q.l2); return; }
      if (!sim.timer) {
        if (sim.level === Infinity) {
          sim.timer = { at: now() + 2500, kind: "recombination", level: pick(RECOMB) };
        } else if (sim.level > 1) {
          sim.timer = { at: now() + 2500, kind: "decay", level: pick(DECAY[sim.level - 1]) };
        }
      }
      sim.busy = false; syncSidebar();
    }
    function stepSim(tm) {
      var T = sim.timer;
      if (T && tm > T.at) {
        sim.timer = null;
        if (T.kind === "recombination") { recapture(T.level); sim.level = T.level; }
        else {
          var nL = T.level, energy = 13.6 * (1 / (nL * nL) - 1 / (sim.level * sim.level));
          sim.transitionID = (TRANSITION_IDS[nL] || [])[sim.level];
          if (sim.transitionID === undefined) sim.transitionID = null;
          deexcite(energy, nL);
          sim.level = nL;
        }
      }
    }
    function firePhoton(energy, l1, l2) {          // TheSimulatorClass.firePhoton
      if (atom.anim) { sim.queued = { energy: energy, l1: l1, l2: l2 }; return; }
      var ionE = 13.6 / (sim.level * sim.level);
      sim.transitionID = l1 != null ? TRANSITION_IDS[l1][l2] : null;
      atom.photonEnergy = energy;
      sim.busy = true;
      if (l1 === sim.level) { sim.level = l2; atomFirePhoton(energy, l2); sim.timer = null; }
      else if (isFinite(sim.level) && energy > ionE) { sim.level = Infinity; atomFirePhoton(energy, Infinity, energy - ionE); sim.timer = null; }
      else {
        atomFirePhoton(energy, null);
        if (sim.timer) sim.timer.at = now() + (isFinite(sim.level) ? 2500 : 2500) + NULL_TIME;
      }
      syncSidebar();
      wake();
    }

    /* ---------------- the log (LogComponentClass + Generic Entry) ---------------- */
    var LOG = { x: 665.9 + 18.1, y: 272 + 59, w: 240, h: 245, rows: 7, rowH: 35 };
    var entries = [], logY = 0, slide = null;
    function addEntry(e) {
      e.t0 = now() + 750;
      entries.push(e);
      var target = Math.max(0, entries.length - LOG.rows) * LOG.rowH;
      if (target !== logY) slide = { start: now(), from: logY, to: target };
      wake();
    }
    function clearLog() { entries = []; logY = 0; slide = null; S.requestDraw(); }
    function onExcitation(energy, oldLevel, newLevel) { scaleLevel = newLevel; addEntry({ type: "e", energy: energy, oldLevel: oldLevel, newLevel: newLevel, tid: sim.transitionID }); }
    function onDeexcitation(energy, oldLevel, newLevel) { scaleLevel = newLevel; addEntry({ type: "d", energy: energy, oldLevel: oldLevel, newLevel: newLevel, tid: sim.transitionID }); }
    function onIonization(energy, oldLevel) { scaleLevel = Infinity; addEntry({ type: "i", energy: energy, oldLevel: oldLevel, tid: sim.transitionID }); }
    function onRecombination(newLevel) { scaleLevel = newLevel; addEntry({ type: "r", newLevel: newLevel, tid: null }); }
    function onNoAbsorption(energy) { addEntry({ type: "n", energy: energy, tid: sim.transitionID }); }
    var TRANS = [["L", "\""], ["L", "$"], ["L", "("], ["L", "*"], ["L", "g"], ["H", "\""], ["H", "$"], ["H", "("], ["H", "*"], ["P", "\""], ["P", "$"], ["P", "("]];
    function entryColor(e, tm) {
      var u = (tm - e.t0) / 1500;
      if (!(u > 0)) return "rgb(204,0,0)";
      if (!(u < 1)) return "rgb(80,80,80)";
      return "rgb(" + Math.floor(204 - 124 * u) + "," + Math.floor(80 * u) + "," + Math.floor(80 * u) + ")";
    }
    function drawEntry(ctx, e, y, tm) {
      var col = entryColor(e, tm), paint = { fill: col, stroke: col };
      ctx.save(); ctx.translate(LOG.x, y);
      ctx.fillStyle = col;
      shape(ctx, 170, 0, 0, paint);                // the dotted separator
      var buffer = e.tid != null ? "       " : "";
      font(ctx, 10);
      if (e.type !== "r") FlashText.fill(ctx, fmt("ha.photonE", { e: flashToFixed(e.energy, 2) }) + buffer, 174.85, 5 + ASC * 10, "center");
      var action = { i: "ha.absorbed", e: "ha.absorbed", d: "ha.emitted", n: "ha.notAbsorbed" }[e.type];
      if (action) { font(ctx, 10, "italic"); FlashText.fill(ctx, t(action), 174.875, 18 + ASC * 10, "center"); }
      var type = { i: "ha.ionization", e: "ha.excitation", r: "ha.recombination", d: "ha.deexcitation" }[e.type];
      font(ctx, 10);
      if (type) FlashText.fill(ctx, t(type), 41.05, 10.85 + ASC * 10, "center");
      var left = e.type === "i" || e.type === "e" ? e.oldLevel : e.newLevel, right = e.type === "e" ? e.newLevel : e.type === "d" ? e.oldLevel : "";
      if (e.type !== "n") {
        FlashText.fill(ctx, String(left), 86.5, 18.15 + ASC * 10, "right");
        if (right !== "") FlashText.fill(ctx, String(right), 111.85, 18.15 + ASC * 10, "left");
        ctx.save(); ctx.translate(99.1, 24.15);
        if (e.type === "i" || e.type === "e") ctx.rotate(Math.PI);
        SwfShape.draw(ctx, ART[166], paint); ctx.restore();
      }
      if (e.type === "i" || e.type === "e" || e.type === "d") {
        ctx.save();
        ctx.translate(e.type === "d" ? 105.65 : 105.65 - 15.2, 13);
        if (e.type !== "d") ctx.rotate(Math.PI / 2);
        SwfShape.draw(ctx, ART[168], paint); ctx.restore();
      }
      if (e.tid != null) {                         // the transition descriptor: "H(β)" in Verdana + WP Greek Century
        var tr = TRANS[e.tid];
        ctx.save(); ctx.translate(219.1, 11.85);
        font(ctx, 10);
        FlashText.fillStatic(ctx, "(", -11.95, -7.1 + 10);
        FlashText.fill(ctx, tr[0], -4.05, -7.1 + ASC * 10, "center");
        greek(ctx, tr[1], 3.0, -4.85 + 0.957 * 10, 10, "center");
        FlashText.fillStatic(ctx, ")", 5.8, -7.1 + 10);
        ctx.restore();
      }
      ctx.restore();
    }

    /* ---------------- the energy bar (EnergyBarClass) ---------------- */
    var BAR = { x: 45, y: 554.15, w: 584 }, SCALE = BAR.w / 15;
    var SNAPS = [];
    for (var n1 = 1; n1 <= 3; n1++) for (var n2 = n1 + 1; n2 <= 6; n2++) {
      var ee = 13.6 * (1 / (n1 * n1) - 1 / (n2 * n2));
      SNAPS.push({ n1: n1, n2: n2, e: ee, x: SCALE * ee });
    }
    var grabX = 177.85, selectedTransition = null;
    function moveGrabber(x) {
      x = Math.min(BAR.w, Math.max(1, x));
      var dMin = Infinity, iMin = 0;
      SNAPS.forEach(function (p, i) { var d = Math.abs(x - p.x); if (d < dMin) { dMin = d; iMin = i; } });
      if (dMin < 3) { x = SNAPS[iMin].x; selectedTransition = iMin; } else selectedTransition = null;
      grabX = x;
      syncSidebar(); S.requestDraw();
    }
    function barEnergy() { return grabX / SCALE; }
    function fireFromBar() {
      if (selectedTransition != null) { var p = SNAPS[selectedTransition]; firePhoton(p.e, p.n1, p.n2); }
      else firePhoton(barEnergy());
    }
    function firePreset(id) {                      // onButtonPressed(id): transition id − 1, the bar left alone
      var p = SNAPS[id - 1]; firePhoton(p.e, p.n1, p.n2);
    }
    function sciParts(num, digs) {                 // Scientific Notation Number
      var expo = Math.floor(Math.log(num) / Math.LN10), fact = Math.pow(10, digs - 1);
      var num2 = Math.round(fact * Math.pow(10, -expo) * num) / fact;
      if (!(num2 < 10)) { num2 /= 10; expo += 1; }
      var s = String(parseFloat(num2.toPrecision(15))), sf = s.replace(/[^0-9]/g, "").length, z = digs - sf;
      if (z > 0) { if (s.indexOf(".") < 0) s += "."; while (z-- > 0) s += "0"; }
      return { c: s, e: String(expo) };
    }
    function barReadouts() {
      var e = barEnergy(), w = 1240 / e, f = 299792458 / (w * 1e-09);
      var ws = w < 100 ? flashToFixed(w, 1) + " nm" : w < 1000 ? Math.round(w) + " nm" : flashToFixed(w / 1000, 2) + " µm";
      var es = !(e < 1) ? flashToFixed(e, 1) + " eV" : flashToFixed(e, 2) + " eV";
      return { w: ws, e: es, f: sciParts(f, 2) };
    }

    /* ---------------- drawing ---------------- */
    function panel(ctx, x, y, w, h, title, size, bar) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
      font(ctx, size); ctx.fillStyle = "#333333";
      FlashText.fill(ctx, title, x + 5, y + 4 + ASC * size);
      if (bar) {
        ctx.strokeStyle = "#cccccc"; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x + 10 + FlashText.textWidth(ctx, title), y + 5.93 + 0.60795 * size);
        ctx.lineTo(x + w - 5, y + 5.93 + 0.60795 * size); ctx.stroke(); ctx.lineCap = "butt";
      }
    }
    function circle(ctx, r) {                      // drawArc's eight quadratic segments
      var n = Math.ceil(TAU / 0.5), st = TAU / n, h = st / 2, cr = r / Math.cos(h), a = 0, c = -h;
      ctx.moveTo(r, 0);
      for (var i = 0; i < n; i++) { a += st; c += st; ctx.quadraticCurveTo(cr * Math.cos(c), -cr * Math.sin(c), r * Math.cos(a), -r * Math.sin(a)); }
    }
    function drawAtom(ctx) {
      ctx.save(); ctx.translate(DIAG.x, DIAG.y);
      shape(ctx, 193);
      ctx.beginPath(); ctx.rect(0, -DIAG.hh, DIAG.w, 2 * DIAG.hh); ctx.clip();
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.lineCap = "round";
      LEVELS.forEach(function (r, i) { ctx.globalAlpha = atom.orbitAlpha[i]; ctx.beginPath(); circle(ctx, r); ctx.stroke(); });
      ctx.globalAlpha = 1;
      if (atom.progress) {                         // transitionProgressMC under its mask
        var P = atom.progress;
        ctx.save(); ctx.beginPath(); ctx.rect(P.x0, -10, P.x1 - P.x0, 20); ctx.clip();
        ctx.globalAlpha = P.alpha;
        var base = P.dir > 0 ? P.off : DIAG.w + P.off;
        for (var k = 0; k < 2 + Math.ceil(DIAG.w / 12); k++) {
          ctx.save(); ctx.translate(base + P.dir * k * 12, 0); if (P.dir < 0) ctx.scale(-1, 1);
          SwfShape.draw(ctx, ART[149]); ctx.restore();
        }
        ctx.restore();
      }
      // the proton, the two electrons, the photon trails (oldest faintest)
      ctx.save(); SwfShape.draw(ctx, ART[151]); font(ctx, 12, "bold"); ctx.fillStyle = "#ffffff"; FlashText.fillStatic(ctx, "p", -65.8 + 67.7 + 0.1, -8.95 + 12.05); ctx.restore();
      [atom.e2, atom.e1].forEach(function (e) {
        if (!(e.a > 0)) return;
        ctx.save(); ctx.globalAlpha = e.a; ctx.translate(e.x, e.y);
        SwfShape.draw(ctx, ART[146]); font(ctx, 12, "bold"); ctx.fillStyle = "#ffffff";
        FlashText.fillStatic(ctx, "e", -72 + 67.95 + 0.05, -8.55 + 12.05);
        ctx.restore();
      });
      ctx.lineWidth = 2; ctx.lineJoin = "round";
      for (var s = 0; s < TRAIL_N; s++) {
        var idx = (trailHead + s) % TRAIL_N;      // the segment just drawn is the newest
        ctx.globalAlpha = s / TRAIL_N;              // the oldest invisible, the newest at 90 %
        trail[idx].forEach(function (seg) {
          if (seg.pts.length < 2) return;
          ctx.strokeStyle = seg.color; ctx.beginPath(); ctx.moveTo(seg.pts[0][0], seg.pts[0][1]);
          for (var q = 1; q < seg.pts.length; q++) ctx.lineTo(seg.pts[q][0], seg.pts[q][1]);
          ctx.stroke();
        });
      }
      ctx.globalAlpha = 1;
      if (atom.ionized) {                          // ionizedSymbolMC
        ctx.save(); ctx.translate(737.2, -100.45); SwfShape.draw(ctx, ART[190]);
        font(ctx, 10); ctx.fillStyle = "#cccccc";
        FlashText.fillStatic(ctx, t("ha.atomIs"), -72 + 53.3 + 0.1 + 18.6, 4.45 + 10, "center");
        FlashText.fillStatic(ctx, t("ha.ionized"), -72 + 53.3 + 1 + 17.675, 4.45 + 24.05, "center");
        ctx.restore();
      }
      ctx.restore();
    }
    function drawLevels(ctx) {                     // the Energy Level Diagram (scaleMC at 863, 273.6)
      ctx.save(); ctx.translate(863, 273.6);
      var yk = -150 / 13.6, active = isFinite(scaleLevel) ? scaleLevel : null;
      for (var i = 1; i <= 20; i++) {
        var y = yk * (13.6 - 13.6 / (i * i));
        if (i !== active) shape(ctx, 21, 0.15, y + 0.7);
      }
      font(ctx, 11); ctx.fillStyle = "#cc0000";
      if (active) {
        var ya = yk * (13.6 - 13.6 / (active * active)) - 0.7;
        ctx.save(); ctx.translate(-0.15, ya);
        SwfShape.draw(ctx, ART[23]);
        FlashText.fill(ctx, "-" + flashToFixed(13.6 / (active * active), 1) + " eV", 20.25, -7.4 + ASC * 11);
        FlashText.fill(ctx, fmt("ha.level", { n: active }), -20.75, -7.1 + ASC * 11, "right");
        ctx.restore();
      } else {
        FlashText.fillStatic(ctx, t("ha.ionized"), 0, -175 - 25.05 + 11, "center");
        FlashText.fillStatic(ctx, ">0 eV", -16.95, -175 - 25.05 + 26.25);
      }
      ctx.restore();
    }
    function drawPhotonPanel(ctx) {
      ctx.save(); ctx.translate(BAR.x, BAR.y);
      font(ctx, 10, "italic"); ctx.fillStyle = "#333333";
      FlashText.fillStatic(ctx, t("ha.frequency"), 565.55 + 49.7, -235.15 + 10, "right");
      FlashText.fillStatic(ctx, t("ha.wavelength"), 557.55 + 57.6, -170.05 + 10, "right");
      FlashText.fillStatic(ctx, t("ha.energyScale"), 580.55 + 34.6, -105.05 + 10, "right");
      shape(ctx, 215); shape(ctx, 230); shape(ctx, 219); shape(ctx, 225);
      ctx.fillStyle = "#000000"; font(ctx, 10);
      [[-58.9, "1", "×1", "0", "14"], [90.25, "1", "×1", "0", "15"], [250.95, "2×1", "", "0", "15"], [412.95, "3×1", "", "0", "15"]].forEach(function (L) {
        var x = L[0] + 45.6, y = -191.15 + 11;
        font(ctx, 10); var w = FlashText.fillStatic(ctx, L[1] + L[2] + L[3], x, y);
        font(ctx, 7.15); var w2 = FlashText.fillStatic(ctx, L[4], x + w, -191.15 + 7.15);
        font(ctx, 10); FlashText.fillStatic(ctx, " Hz", x + w + w2, y);
      });
      font(ctx, 10);
      [[-70.9 + 55.75 + 0.05, "10 µm"], [168.4 + 52.6 + 0.05, "200 nm"], [23.1 + 52.6 + 0.05, "500 nm"], [-25.9 + 58.9 + 0.1, "1 µm"],
        [408.1 + 52.6 + 0.05, "100 nm"]].forEach(function (L) { FlashText.fillStatic(ctx, L[1], L[0], -126.25 + 10); });
      [[123.1 + 60.6 + 0.05, "5 eV"], [318.1 + 57.4 + 0.1, "10 eV"], [510.1 + 57.4 + 0.1, "15 eV"], [-70.9 + 60.6 + 0.05, "0 eV"]].forEach(function (L) {
        FlashText.fillStatic(ctx, L[1], L[0], -61.15 + 10);
      });
      [[23.1 + 56.15 + 0.05 + 15.775, "ha.visible"], [-39.9 + 52.25 + 0.1 + 19.65, "ha.infrared"], [225.1 + 46.6 + 0.05 + 25.325, "ha.ultraviolet"]].forEach(function (L) {
        FlashText.fillStatic(ctx, t(L[1]), L[0], -37.3 + 10, "center");
      });
      // the visible band, the bar and its transition lines
      var g = ctx.createLinearGradient(67, 0, 127, 0);
      [[0, "rgba(255,0,58,0)"], [51, "#ff1700"], [76, "#e9ec00"], [88, "#24ff00"], [108, "#00ffc0"], [146, "#1097df"], [159, "#5a1bff"], [255, "rgba(138,0,255,0)"]]
        .forEach(function (s) { g.addColorStop(s[0] / 255, s[1]); });
      ctx.fillStyle = g; ctx.fillRect(67, -23, 60, 5);
      shape(ctx, 207);
      ctx.save(); ctx.clip(SwfShape.path(ART[208]));
      ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1 / ctx.getTransform().a;
      ctx.beginPath();
      for (var a = 1; a <= 3; a++) for (var b = a + 1; b <= 20; b++) { var x = SCALE * 13.6 * (1 / (a * a) - 1 / (b * b)); ctx.moveTo(x, -10); ctx.lineTo(x, 10); }
      ctx.stroke(); ctx.restore();
      // the grabber with its cursor and readouts
      var r = barReadouts();
      ctx.save(); ctx.translate(grabX, 0);
      shape(ctx, 202);
      font(ctx, 10); ctx.fillStyle = "#cc0000";
      FlashText.fill(ctx, r.e, 0, -86.75 + ASC * 10, "center");
      FlashText.fill(ctx, r.w, 0, -151.85 + ASC * 10, "center");
      ctx.save(); ctx.translate(-10.8, -206.9);
      var twC = FlashText.textWidth(ctx, r.f.c);
      FlashText.fill(ctx, r.f.c, -4.75 - twC, -10.05 + ASC * 10);
      FlashText.fillStatic(ctx, "×10", -3.7, -10.05 + 10);
      font(ctx, 8); FlashText.fill(ctx, r.f.e, 17.55, -12.05 + ASC * 8);
      ctx.restore();
      font(ctx, 10); FlashText.fillStatic(ctx, "Hz", -111.05 + 131.05 + 0.2, -217 + 10);
      ctx.restore();
      ctx.restore();
    }
    function drawLog(ctx, tm) {
      shape(ctx, 178, 665.9, 272);
      ctx.save(); ctx.beginPath(); ctx.rect(LOG.x, LOG.y, LOG.w, LOG.h); ctx.clip();
      entries.forEach(function (e, i) {
        var y = LOG.y + i * LOG.rowH - logY;
        if (y > LOG.y - LOG.rowH && y < LOG.y + LOG.h) drawEntry(ctx, e, y, tm);
      });
      ctx.restore();
      // the scroll bar (FScrollBar): 16-px arrow boxes and the #cccccc track, a thumb once it can scroll
      var sx = 919, sy = 326.25, sh = 255, total = Math.max(entries.length, LOG.rows);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(sx, sy + 16, 16, sh - 32);
      [[sy, -1], [sy + sh - 16, 1]].forEach(function (b) {
        ctx.fillStyle = "#808080"; ctx.fillRect(sx, b[0], 16, 16);
        ctx.fillStyle = "#e8e8e8"; ctx.fillRect(sx + 1, b[0] + 1, 14, 14);
        ctx.fillStyle = "#808080"; ctx.beginPath();
        var cy = b[0] + 8;
        ctx.moveTo(sx + 8, cy + b[1] * 2); ctx.lineTo(sx + 4.5, cy - b[1] * 1.75); ctx.lineTo(sx + 11.5, cy - b[1] * 1.75); ctx.closePath(); ctx.fill();
      });
      if (entries.length > LOG.rows) {
        var track = sh - 32, th = Math.max(14, track * LOG.rows / total), ty = sy + 16 + (track - th) * (logY / ((total - LOG.rows) * LOG.rowH));
        ctx.fillStyle = "#808080"; ctx.fillRect(sx, ty, 16, th);
        ctx.fillStyle = "#e8e8e8"; ctx.fillRect(sx + 1, ty + 1, 14, th - 2);
      }
    }

    var loop = S.loop(function () {
      var tm = now();
      if (tm - timeLastPhotons >= 1000 / 30) stepPhotons(tm);   // the trail advances at the SWF's 30 fps
      stepAtom(tm); stepSim(tm);
      if (slide) {
        var u = (tm - slide.start) / 600;
        if (!(u < 1)) { logY = slide.to; slide = null; }
        else logY = slide.from + (1 - Math.pow(1 - u, 5)) * (slide.to - slide.from);
      }
      var fading = entries.some(function (e) { return tm < e.t0 + 1500; });
      var trailsLive = trail.some(function (s) { return s.length; });
      if (!atom.anim && !sim.timer && !photons.length && !trailsLive && !slide && !fading) loop.pause();
    });
    function wake() { if (!loop.playing) { timeLastPhotons = now(); loop.play(); } }

    S.onDraw(function () {
      var ctx = S.ctx, tm = now();
      FlashText.begin(ctx);
      ctx.save();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.translate(0, OY);
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      drawAtom(ctx);
      panel(ctx, 783, 37, 160, 250, t("ha.eld"), 13, false);
      drawLevels(ctx);
      panel(ctx, 7, 294.1, 662, 339, t("ha.photon"), 14, true);
      panel(ctx, 676, 294.1, 267, 339, t("ha.log"), 14, true);
      drawPhotonPanel(ctx);
      drawLog(ctx, tm);
      ctx.restore();
    });

    /* ---------------- the pointer: the electron, the grabber, the bar, the log ---------------- */
    var drag = null;
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY };
    }
    function hit(p, touch) {
      var r = touch ? 12 : 7;
      if (isFinite(sim.level) && !(atom.anim && (atom.anim.kind === "recombination" || atom.anim.kind === "ionization"))) {
        var ex = DIAG.x + atom.e1.x, ey = DIAG.y + atom.e1.y;
        if ((p.x - ex) * (p.x - ex) + (p.y - ey) * (p.y - ey) <= r * r) return "electron";
      }
      var gx = BAR.x + grabX;
      if (Math.abs(p.x - gx) <= (touch ? 10 : 6) && p.y >= BAR.y - 13.5 && p.y <= BAR.y + 13.5) return "grabber";
      if (p.x >= BAR.x - 9 && p.x <= BAR.x + 593 && Math.abs(p.y - BAR.y) <= 4.5) return "bar";
      return null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p, ev.pointerType === "touch");
      if (!h) return;
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      if (h === "electron") {                      // onElectronDraggingStart: stop everything, clear the log
        sim.timer = null; sim.queued = null; clearLog();
        atom.anim = null; atom.progress = null;
        atom.e1.a = 0.4; atom.e1.y = 0; atom.e2 = { x: atom.e1.x, y: 0, a: 1 };
        drag = { kind: h, off: p.x - (DIAG.x + atom.e1.x) };
      } else if (h === "grabber") drag = { kind: h, off: p.x - (BAR.x + grabX) };
      else {                                       // barMC.onPress: one step toward the mouse, then repeat
        drag = { kind: "bar", mx: p.x, t0: now(), last: now() };
        barStep(1);
        requestAnimationFrame(barRepeat);
      }
    });
    function barStep(dx) {
      var old = grabX;
      if (selectedTransition == null) moveGrabber(drag.mx - BAR.x < old ? old - dx : old + dx);
      else moveGrabber(drag.mx - BAR.x < old ? old - 3.5 : old + 3.5);
    }
    function barRepeat() {
      if (!drag || drag.kind !== "bar") return;
      var tm = now();
      if (tm > drag.t0 + 500) barStep(0.02 * (tm - drag.last));
      drag.last = tm;
      requestAnimationFrame(barRepeat);
    }
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) { var h = hit(p, ev.pointerType === "touch"); S.canvas.style.cursor = h === "electron" || h === "grabber" ? "ew-resize" : h ? "pointer" : "default"; return; }
      if (drag.kind === "electron") {              // electron1MC.onMouseMoveFunc: snap to the nearest orbit
        var xm = p.x - drag.off - DIAG.x, best = 0;
        LEVELS.forEach(function (x, i) { if (Math.abs(xm - x) < Math.abs(xm - LEVELS[best])) best = i; });
        var old = sim.level;
        atom.e1.x = LEVELS[best]; atom.e2.x = xm;
        sim.level = atom.level = scaleLevel = best + 1;
        if (old !== sim.level) { atom.orbitAlpha[old - 1] = UNOCC; atom.orbitAlpha[best] = OCC; }
        S.requestDraw();
      } else if (drag.kind === "grabber") moveGrabber(p.x - drag.off - BAR.x);
      else drag.mx = p.x;
    });
    function release() {
      if (!drag) return;
      if (drag.kind === "electron") { atom.e1.a = 1; atom.e2.a = 0; onAnimationFinished(); wake(); S.requestDraw(); }
      drag = null;
    }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", release);
    S.canvas.addEventListener("wheel", function (ev) {
      var p = at(ev);
      if (p.x < LOG.x || p.x > LOG.x + LOG.w + 20 || p.y < LOG.y || p.y > LOG.y + LOG.h) return;
      var max = Math.max(0, entries.length - LOG.rows) * LOG.rowH;
      if (!max) return;
      ev.preventDefault();
      slide = null;
      logY = Math.min(max, Math.max(0, logY + (ev.deltaY > 0 ? LOG.rowH : -LOG.rowH)));
      S.requestDraw();
    }, { passive: false });

    /* ---------------- the sidebar: the energy, fire photon, the spectral lines, clear log ---------------- */
    var syncing = false;
    S.group("ha.photon");
    var energyCtl = S.slider({ labelKey: "ha.energy", min: 1, max: BAR.w, step: 0.05, value: grabX,
      format: function () { var r = barReadouts(); return r.e + " · " + r.w; },
      on: function (v) { if (!syncing) moveGrabber(v); } });
    var fireBtn = S.button({ labelKey: "ha.fire", primary: true, on: fireFromBar });
    S.group("ha.presets");
    var NAMES = ["Lα", "Lβ", "Lγ", "Lδ", "Lε", "Hα", "Hβ", "Hγ", "Hδ", "Pα", "Pβ", "Pγ"];
    var presetBtns = NAMES.map(function (name, i) { return S.button({ label: name, on: function () { firePreset(i + 1); } }); });
    S.group("ha.log");
    S.button({ labelKey: "ha.clear", on: clearLog });
    function syncSidebar() {
      if (!energyCtl) return;
      syncing = true;
      if (Math.abs(energyCtl.value() - grabX) > 1e-6) energyCtl.set(grabX);
      fireBtn.disabled = sim.busy;
      presetBtns.forEach(function (b) { b.disabled = sim.busy; });
      syncing = false;
    }
    syncSidebar();
  }
});
