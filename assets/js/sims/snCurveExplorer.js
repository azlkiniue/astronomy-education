/* Supernova Light Curve Fitting Explorer -----------------------------------------
   Faithful rebuild of the NAAP "snCurveExplorer.swf" (SNCurveFittingExplorerClass,
   decompiled), including its thirteen observed B-band light curves and its own
   type Ia template curve, whose peak sits at absolute magnitude −19.5.

   Pick a supernova and slide its measurements until they sit on the template.
   The vertical shift you needed is the <em>distance modulus</em> m − M, and the
   distance follows from it. The horizontal shift only lines up the date of peak
   brightness, which is not otherwise known.                                    */
Sim.create({
  id: "snCurveExplorer",
  width: 650, height: 480,
  strings: {
    en: {
      "sc.fit": "Fit a supernova", "sc.sn": "Supernova", "sc.none": "none chosen",
      "sc.bar": "measuring bar", "sc.answer": "show the accepted value", "sc.reset": "Reset the fit",
      "sc.xaxis": "days", "sc.yaxisL": "Absolute Magnitude (M_B)", "sc.yaxisR": "Apparent Magnitude (m_B)",
      "sc.rMu": "distance modulus", "sc.rDist": "distance", "sc.rShift": "time shift",
      "sc.rHost": "host galaxy", "sc.rAccepted": "accepted modulus", "sc.days": " days",
      "sc.hint": "Drag the measurements onto the red template curve: up and down for brightness, sideways for the date of peak.",
      "sc.template": "type Ia template",
      "sc.calc": "Distance modulus calculator", "sc.app": "apparent magnitude m", "sc.abs": "absolute magnitude M",
      "sc.take": "Take the values from the fit", "sc.rMod": "m − M", "sc.rCdist": "distance"
    },
    id: {
      "sc.fit": "Cocokkan supernova", "sc.sn": "Supernova", "sc.none": "belum dipilih",
      "sc.bar": "batang ukur", "sc.answer": "tampilkan nilai baku", "sc.reset": "Atur ulang",
      "sc.xaxis": "hari", "sc.yaxisL": "Magnitudo Mutlak (M_B)", "sc.yaxisR": "Magnitudo Semu (m_B)",
      "sc.rMu": "modulus jarak", "sc.rDist": "jarak", "sc.rShift": "geseran waktu",
      "sc.rHost": "galaksi induk", "sc.rAccepted": "modulus baku", "sc.days": " hari",
      "sc.hint": "Seret data pengamatan ke kurva acuan merah: naik-turun untuk kecerlangan, ke samping untuk tanggal puncak.",
      "sc.template": "acuan tipe Ia",
      "sc.calc": "Kalkulator modulus jarak", "sc.app": "magnitudo semu m", "sc.abs": "magnitudo mutlak M",
      "sc.take": "Ambil nilai dari kecocokan", "sc.rMod": "m − M", "sc.rCdist": "jarak"
    }
  },
  about: {
    en: "<p>A type Ia supernova is a white dwarf that has been pushed over the Chandrasekhar limit and detonates. Because the trigger mass is always about the same, the explosions are nearly identical — the same peak brightness, the same characteristic rise and decline. That makes them <strong>standard candles</strong>.</p>" +
        "<p>So the shape of the observed light curve tells you which part is peak, and the amount you must slide it down to match the template's true brightness is the distance modulus m − M = 5 log₁₀(d / 10 pc). Everything else in extragalactic distance work rests on this trick.</p>" +
        "<p>Not every supernova here is a Ia. 1987A (type II, in the Large Magellanic Cloud), 1993J, 1994I and 1994Y have different progenitors — massive stars collapsing — and their light curves refuse to fit the template. That mismatch is exactly how astronomers tell the classes apart, and it is why the Ia sample used to measure the accelerating expansion of the universe has to be filtered so carefully.</p>",
    id: "<p>Supernova tipe Ia adalah katai putih yang terdorong melewati batas Chandrasekhar lalu meledak. Karena massa pemicunya selalu hampir sama, ledakannya nyaris identik — puncak kecerlangan yang sama, pola naik dan turun yang sama. Itulah yang menjadikannya <strong>lilin baku</strong>.</p>" +
        "<p>Maka bentuk kurva cahaya yang teramati menunjukkan bagian mana yang merupakan puncak, dan seberapa jauh kurva itu harus digeser ke bawah agar cocok dengan kecerlangan sejati acuan adalah modulus jarak m − M = 5 log₁₀(d / 10 pc). Hampir seluruh pengukuran jarak ekstragalaksi bertumpu pada cara ini.</p>" +
        "<p>Tidak semua supernova di sini bertipe Ia. 1987A (tipe II, di Awan Magellan Besar), 1993J, 1994I, dan 1994Y berasal dari bintang masif yang runtuh, dan kurva cahayanya menolak cocok dengan acuan. Ketidakcocokan itulah cara astronom membedakan kelasnya, dan sebabnya sampel Ia yang dipakai untuk mengukur percepatan pengembangan alam semesta harus disaring dengan cermat.</p>"
  },
  build: function (S) {
    var OY = -30;
    var FONT = "Verdana, Geneva, sans-serif";
    var PX = 94.8, PY = 450.9 + OY, PW = 460, PH = 325;     // plot area, origin bottom-left
    var T_LEFT = -50, T_RANGE = 450, M_TOP = -22, M_BOT = -10;
    var PEAK_ABS = -19.5;
    var T_MAJ = [-50, 0, 50, 100, 150, 200, 250, 300, 350, 400];
    var T_MIN_T = [-25, 25, 75, 125, 175, 225, 275, 325, 375];
    // the SWF's own template: start point then eight quadratic segments, in its own units
    var C_START = { x: -11.5, y: 108.25 };
    var C_PTS = [
      { cx: -12.9, cy: 70.6, ax: -8.8, ay: 30 }, { cx: -5.7, cy: 0.2, ax: 0, ay: 0.1 },
      { cx: 5.1, cy: -0.1, ax: 12.9, ay: 28.4 }, { cx: 17, cy: 43.3, ax: 20.1, ay: 58.2 },
      { cx: 21.5, cy: 64.8, ax: 27.7, ay: 79 }, { cx: 30.4, cy: 85.2, ax: 35.8, ay: 90.9 },
      { cx: 42.2, cy: 97.5, ax: 73.8, ay: 112.6 }, { cx: 112.5, cy: 131, ax: 314.3, ay: 233.3 }
    ];
    var C_XS = 1.20514, C_YS = 0.0330761, C_Y0 = 0.1;       // point units → days and magnitudes

    var SNE = [
      { name: "1999ee", host: "IC 5179", type: "Ia", mu: 33.2, obs: [[0,15.808],[0.88,15.596],[0.88,15.575],[0.89,15.585],[1,15.578],[1,15.57],[1,15.571],[1.91,15.394],[1.92,15.431],[1.94,15.392],[1.94,15.425],[1.94,15.413],[2.88,15.274],[2.89,15.279],[2.91,15.264],[3.89,15.171],[4.87,15.09],[4.93,15.068],[4.94,15.083],[6.92,14.976],[6.92,14.965],[6.92,14.981],[6.94,14.969],[6.95,14.97],[7.85,14.937],[8.91,14.942],[8.91,14.94],[8.91,14.934],[8.94,14.931],[8.95,14.938],[9.91,14.941],[9.92,14.938],[9.92,14.926],[10.82,14.968],[10.83,14.958],[10.94,14.948],[10.95,14.953],[12.87,15.001],[12.95,15.032],[12.96,15.032],[15.95,15.155],[15.96,15.165],[18.84,15.335],[18.97,15.369],[18.98,15.365],[19.83,15.405],[20.85,15.486],[20.96,15.521],[20.98,15.528],[21.87,15.581],[22.9,15.709],[22.93,15.715],[22.94,15.703],[22.95,15.722],[24.87,15.889],[24.9,15.926],[24.91,15.885],[25.92,15.995],[26.86,16.098],[26.94,16.105],[26.95,16.107],[27.85,16.195],[28.9,16.293],[28.95,16.3],[28.96,16.304],[29.85,16.372],[30.85,16.468],[30.95,16.501],[30.96,16.488],[32.84,16.641],[32.94,16.664],[32.95,16.668],[33.86,16.722],[35.89,16.898],[35.91,16.925],[35.92,16.935],[36.88,16.975],[36.98,16.952],[37.86,17.094],[37.87,17.109],[38.86,17.18],[38.87,17.231],[38.88,17.122],[38.89,17.114],[39.88,17.235],[39.89,17.243],[39.98,17.186],[40.86,17.323],[40.87,17.3],[41.84,17.397],[41.85,17.387],[41.89,17.352],[43.84,17.525],[43.85,17.495],[44.85,17.566],[44.86,17.587],[45.84,17.671],[45.85,17.644],[46.87,17.611],[47.9,17.724],[47.91,17.731],[48.86,17.777],[48.87,17.772],[48.9,17.712],[49.87,17.749],[51.88,17.857],[51.89,17.892],[53.91,17.956],[53.92,18.005],[55.91,18.026],[55.92,18.012],[57.85,18.002],[57.86,18.004],[59.85,18.076],[59.86,18.092],[61.9,18.11],[61.91,18.106]] },
      { name: "1990N", host: "NGC 4639", type: "Ia", mu: 31.0, obs: [[0,13.894],[0,13.893],[0,13.888],[1.97,13.638],[1.98,13.636],[5.03,13.131],[5.03,13.132],[6.06,13.053],[6.06,13.054],[13.99,12.79],[13.99,12.784],[21.03,13.133],[23.01,13.318],[24.01,13.443],[24.99,13.502],[27.01,13.774],[28.02,13.885],[33,14.52],[33.98,14.522],[53.97,15.753],[183.33,17.492],[202.32,17.958],[222.26,18.049],[229.37,18.118],[237.3,18.299],[252.33,18.554],[265.24,18.842],[277.2,18.771],[277.24,18.829],[283.19,18.932],[285.19,18.864],[344.11,19.96],[350.04,19.888],[389.01,20.541]] },
      { name: "1998aq", host: "NGC 3982", type: "Ia", mu: 31.2, obs: [[0,13.551],[1,13.264],[1.99,13.046],[3.02,12.861],[3.02,12.867],[4,12.729],[4.01,12.718],[5.13,12.6],[5.13,12.605],[5.15,12.596],[6.1,12.523],[6.1,12.522],[8.11,12.419],[8.11,12.41],[10.12,12.357],[10.13,12.358],[11.15,12.365],[11.15,12.366],[12.1,12.375],[12.1,12.378],[14.12,12.448],[14.12,12.451],[16.03,12.558],[16.03,12.56],[17.17,12.634],[17.17,12.633],[19.11,12.767],[19.11,12.778],[29.06,13.843],[29.06,13.837],[31.1,14.118],[31.1,14.126],[33.06,14.361],[33.06,14.369],[36.01,14.686],[36.01,14.714],[40.05,15.009],[40.05,15.018],[43,15.211],[43,15.209],[60.04,15.785],[62.06,15.778],[67.05,15.828],[75.03,15.942],[90.01,16.138],[93.01,16.197],[104,16.346],[216.38,18.09],[275.27,18.956],[296.27,19.299],[304.21,19.433],[355.16,20.013]] },
      { name: "1999dq", host: "NGC 976", type: "Ia", mu: 33.8, obs: [[0,15.477],[0.98,15.322],[1.89,15.199],[3,15.092],[4.94,14.953],[7.01,14.895],[7.96,14.853],[8.91,14.864],[9.88,14.845],[10.87,14.892],[11.9,14.889],[12.92,14.918],[14.93,14.985],[26.95,16.009],[31.9,16.608],[34.9,16.911],[36.91,17.071],[39.88,17.299],[41.86,17.443],[60.84,18.016],[85.79,18.329],[94.79,18.528],[119.77,18.867],[162.66,19.479],[163.66,19.315]] },
      { name: "1998bu", host: "M96", type: "Ia", mu: 30.9, obs: [[0,12.47],[1.02,12.41],[2.04,12.29],[3.95,12.28],[4.05,12.21],[4.99,12.29],[5.03,12.21],[6,12.34],[6.07,12.24],[8.01,12.28],[8.03,12.26],[8.96,12.35],[9.01,12.32],[10,12.36],[10.02,12.34],[12.05,12.5],[12.94,12.57],[13.06,12.56],[13.94,12.74],[13.97,12.64],[15.03,12.7],[16.01,12.81],[16.05,12.88],[17,12.94],[17.05,12.97],[18.01,13.03],[18.04,13.05],[18.97,13.1],[20.02,13.24],[20.03,13.24],[21.04,13.4],[21.05,13.36],[21.09,13.43],[21.96,13.51],[21.97,13.4],[22.02,13.51],[22.04,13.52],[22.06,13.53],[22.06,13.47],[23.06,13.59],[24.08,13.72],[25.02,13.84],[25.05,13.89],[25.95,13.95],[26.05,14.01],[27.04,14.11],[31.06,14.51],[32.07,14.6],[33.02,14.68],[34.03,14.74],[34.06,14.74],[35.02,14.81],[35.07,14.84],[36.03,14.89],[37.04,14.94],[37.07,14.95],[38.02,15],[39.03,15.05],[39.06,15.09],[40.03,15.09],[41.03,15.12],[42.02,15.18],[43.02,15.21],[43.06,15.22],[44.02,15.22],[45.01,15.24],[46.01,15.26],[47.01,15.29],[48.01,15.31]] },
      { name: "1994ae", host: "NGC 3370", type: "Ia", mu: 31.5, obs: [[0,14.865],[1.99,14.109],[3.99,13.73],[5.03,13.516],[13.03,13.059],[14.02,13.082],[15.07,13.104],[16.09,13.19],[17.06,13.231],[21.06,13.435],[22.06,13.515],[23,13.576],[23.99,13.674],[27.01,13.931],[28,14.048],[29.99,14.26],[32.09,14.446],[34.09,14.669],[42.96,15.491],[48.06,15.79],[52.04,15.949],[53.99,15.996],[67.89,16.262],[71.97,16.34],[72.95,16.348],[77.02,16.381],[96.77,16.645],[110.89,16.861],[132.91,17.235]] },
      { name: "1999aa", host: "NGC 2595", type: "Ia pec", mu: 33.9, obs: [[0,15.603],[0.94,15.417],[1.89,15.276],[3.86,15.088],[4.9,14.96],[7.74,14.933],[9.79,14.876],[10.72,14.895],[11.74,14.899],[23.85,15.629],[25.73,15.806],[27.84,16.058],[29.79,16.302],[35.82,16.914],[38.72,17.13],[52.75,18.025],[56.74,17.973],[58.74,17.983],[61.77,18.032],[62.71,18.009],[68.72,18.218],[83.76,18.311],[89.75,18.399]] },
      { name: "1995D", host: "NGC 2962", type: "Ia", mu: 32.2, obs: [[0,13.53],[0.13,13.52],[1.05,13.47],[1.93,13.47],[4.05,13.42],[4.94,13.5],[6.08,13.47],[6.95,13.56],[8.04,13.58],[10.21,13.72],[10.92,13.78],[10.93,13.77],[14,13.99],[15.14,14.13],[15.92,14.2],[18.03,14.43],[18.98,14.53],[19.03,14.54],[19.96,14.64],[21.95,14.86],[26.93,15.35],[29.99,15.63],[33.89,15.97],[37.89,16.13],[40,16.27],[41.04,16.33],[44.99,16.47],[46.91,16.47],[54.95,16.64],[61.98,16.75],[63.93,16.76],[69.94,16.83],[77.96,16.96],[85.89,17.04]] },
      { name: "1999by", host: "NGC 2841", type: "Ia pec", mu: 30.2, obs: [[0,13.95],[1.01,13.81],[2,13.74],[2.97,13.67],[3.96,13.66],[4.96,13.68],[6.06,13.72],[6.97,13.8],[8.03,13.92],[8.99,14.07],[9.98,14.24],[11.01,14.43],[11.98,14.61],[13.98,14.97],[31.02,16.21],[33.99,16.33],[35.99,16.4],[38,16.45],[43.99,16.6],[45.98,16.66],[183.3,19.72],[217.32,20.39]] },
      { name: "1987A", host: "LMC", type: "II pec", mu: 27.0, obs: [[0,4.952],[1.1,4.911],[3.05,4.86],[4,4.85],[5.99,4.793],[6.99,4.771],[8,4.746],[8.99,4.749],[10.99,4.71],[13,4.6],[13.98,4.63],[14.99,4.65],[15.98,4.62],[19.99,4.572],[21.01,4.53],[22.02,4.53],[27.05,4.53],[28.98,4.533],[30.97,4.547],[31.99,4.538],[32.97,4.544],[37.97,4.542],[38.98,4.552],[39.96,4.611],[43.97,4.704],[45.97,4.779],[48.95,4.91],[50.95,5.007],[51.96,5.074],[55.96,5.279],[57.96,5.427],[58.95,5.487],[61.97,5.666],[62.43,5.707],[62.96,5.731],[63.43,5.756],[63.96,5.789],[64.43,5.799],[64.95,5.833],[67.44,5.914],[68.98,5.94],[72.44,6.005],[74.96,6.049],[76.97,6.066],[77.44,6.079],[77.96,6.078],[78.44,6.075],[78.97,6.088],[79.96,6.093],[80.44,6.096],[134.64,6.57],[134.65,6.56],[134.66,6.55],[138.63,6.6],[138.63,6.6],[138.65,6.59],[141.39,6.61],[141.59,6.61],[141.6,6.6],[144.59,6.63],[144.6,6.63],[144.61,6.63],[147.54,6.64],[147.54,6.66],[147.55,6.64],[151.53,6.66],[151.54,6.68],[151.55,6.72],[161.55,6.75],[161.56,6.73],[161.57,6.75],[184.56,6.88],[184.56,6.89],[184.57,6.89],[186.48,6.91],[186.49,6.91],[192.51,6.93],[192.52,6.94],[193.57,6.95],[193.59,6.95],[200.49,6.99],[200.51,6.99],[200.52,6.99],[203.55,7.03],[203.56,7.01],[207.38,7.03],[207.39,7.04],[207.4,7.04],[214.44,7.1],[214.45,7.08],[214.47,7.08],[218.53,7.11],[218.54,7.11],[220.51,7.12],[220.52,7.11],[227.49,7.16],[227.5,7.16],[227.52,7.16],[232.45,7.19],[232.46,7.19],[239.57,7.23],[239.58,7.25],[242.42,7.26],[242.44,7.27],[242.45,7.27],[244.39,7.27],[244.41,7.28],[248.41,7.3],[248.42,7.3],[248.43,7.3],[255.4,7.33],[255.41,7.34],[255.42,7.35],[263.36,7.41],[263.37,7.38],[263.38,7.4],[268.37,7.43],[268.38,7.43],[268.39,7.43],[275.36,7.47],[275.37,7.46],[275.38,7.48],[277.35,7.48],[277.36,7.49],[277.37,7.48],[278.33,7.52],[284.35,7.52],[284.36,7.54],[286.37,7.54],[286.38,7.54],[286.4,7.54],[291.38,7.58],[291.39,7.59],[292.39,7.59],[292.4,7.59],[292.41,7.59],[295.35,7.61],[295.36,7.62],[302.34,7.65],[302.35,7.66],[308.37,7.7],[308.37,7.69],[308.38,7.71],[315.32,7.74],[315.33,7.74],[316.3,7.75],[318.29,7.76],[318.3,7.75],[318.31,7.77],[324.32,7.82],[324.33,7.81],[328.29,7.84],[328.3,7.84],[328.31,7.84],[333.28,7.88],[333.29,7.88],[333.3,7.88],[337.31,7.94],[337.32,7.91],[337.33,7.92],[340.36,7.94],[340.37,7.94],[342.3,7.95],[342.3,7.96],[342.31,7.95],[346.26,7.98],[346.27,7.97],[346.28,7.99],[348.27,8],[348.28,8],[348.3,7.99],[355.3,8.06],[355.32,8.04],[362.26,8.12],[362.27,8.11],[365.27,8.15],[365.28,8.13],[368.29,8.15],[368.31,8.17],[373.26,8.19],[373.27,8.21],[373.28,8.21],[383.27,8.28],[383.29,8.29],[386.26,8.32],[386.27,8.31],[386.28,8.31],[401.26,8.44],[402.24,8.45],[402.25,8.46],[423.29,8.65]] },
      { name: "1994I", host: "NGC 5194", type: "Ic", mu: 29.7, obs: [[0,14.41],[2.94,13.95],[8.99,14.06],[9.87,14.18],[10.93,14.56],[11.89,14.56],[15.9,15.28],[16.87,15.4],[30.86,16.28],[36.86,16.61],[40.82,16.56],[41.8,16.76],[45.75,16.58],[48.87,16.88],[49.92,16.86],[56.91,17.21],[57.84,17.06],[59.76,16.93],[66.76,17.21]] },
      { name: "1994Y", host: "NGC 5371", type: "IIn", mu: 32.9, obs: [[0,15.25],[11.99,14.59],[13.02,14.58],[18.98,14.76],[20.02,14.84],[20.98,14.5],[23.02,14.9],[219.36,17.45],[246.2,17.98],[273.28,18.56],[310.19,19.49],[338.11,19.74],[369.98,19.79]] },
      { name: "1993J", host: "NGC 3031", type: "IIb", mu: 25.0, obs: [[0,10.8],[17.97,11.55],[20.9,11.55],[24.96,12.08],[24.96,12.07],[80.88,13.95],[199.08,15.65],[199.08,15.63],[223.94,16.25],[232.05,16.35],[257.1,16.31],[291.96,17.07],[317.89,17.36],[317.89,17.33],[346,17.73],[347,17.78]] }
    ];

    var sel = -1, mu = 30, shift = 0, drag = null, showBar = false, showAnswer = false, barM = -19.5;

    S.group("sc.fit");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "sc.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var selCtl = S.select({
      labelKey: "sc.sn", value: "-1",
      options: [{ v: "-1", label: "—" }].concat(SNE.map(function (s, i) {
        return { v: String(i), label: s.name + " (" + s.type + ")" };
      })),
      on: function (v) { sel = parseInt(v, 10); shift = 0; if (sel >= 0) mu = defaultMu(SNE[sel]); upd(); }
    });
    S.toggle({ labelKey: "sc.bar", value: false, on: function (v) { showBar = v; S.requestDraw(); } });
    S.toggle({ labelKey: "sc.answer", value: false, on: function (v) { showAnswer = v; upd(); } });
    S.button({ labelKey: "sc.reset", on: function () { shift = 0; if (sel >= 0) mu = defaultMu(SNE[sel]); upd(); } });
    /* ---- the SWF's Distance Modulus Calculator: type m and M, read off the distance ---- */
    S.group("sc.calc");
    var appIn = numberField("sc.app"), absIn = numberField("sc.abs");
    S.button({
      labelKey: "sc.take",
      on: function () {                                    // the template's peak, shifted by the fit
        absIn.value = String(PEAK_ABS);
        appIn.value = (PEAK_ABS + mu).toFixed(2);
        calc();
      }
    });

    var outMu = S.readout({ labelKey: "sc.rMu" });
    var outDist = S.readout({ labelKey: "sc.rDist" });
    var outShift = S.readout({ labelKey: "sc.rShift" });
    var outHost = S.readout({ labelKey: "sc.rHost" });
    var outAcc = S.readout({ labelKey: "sc.rAccepted" });
    var outMod = S.readout({ labelKey: "sc.rMod" });
    var outCdist = S.readout({ labelKey: "sc.rCdist" });

    function numberField(key) {
      var wrap = document.createElement("div");
      wrap.className = "ctl";
      var lab = document.createElement("label");
      lab.setAttribute("data-i18n", key);
      var input = document.createElement("input");
      input.type = "number"; input.step = "0.1"; input.className = "num";
      input.addEventListener("input", calc);
      wrap.appendChild(lab); wrap.appendChild(input);
      S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(wrap);
      return input;
    }
    function calc() {
      var m = parseFloat(appIn.value), M = parseFloat(absIn.value);
      if (isNaN(m) || isNaN(M)) { outMod("…"); outCdist("…"); return; }
      var dm = m - M, d = Math.pow(10, (dm + 5) / 5);
      outMod(isFinite(dm) ? dm.toFixed(2) : "…");
      if (!isFinite(d)) outCdist("…");
      else if (d === 0) outCdist("0 pc");
      else if (d > 100000) outCdist((d / 1e6).toFixed(1) + " Mpc");
      else outCdist(sig(d, 3) + " pc");
    }

    function range(sn) {                                    // the SWF's drag limits, in magnitudes
      var lo = Infinity, hi = -Infinity;
      sn.obs.forEach(function (p) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); });
      return { min: lo + 1 - M_BOT, max: hi - 1 - M_TOP };
    }
    function defaultMu(sn) { return range(sn).min; }        // the SWF starts from a clamped zero
    function clampMu(v) {
      if (sel < 0) return v;
      var r = range(SNE[sel]);
      return Math.max(r.min, Math.min(r.max, v));
    }
    function xOf(days) { return PX + PW * (days - T_LEFT) / T_RANGE; }
    function yOf(absMag) { return PY + PH * (absMag - M_BOT) / (M_TOP - M_BOT) * -1 + PH * 0; }
    function magOf(y) { return M_BOT + (PY - y) / PH * (M_TOP - M_BOT); }

    function upd() {
      if (sel < 0) {
        outMu("–"); outDist("–"); outShift("–"); outHost(I18N.t("sc.none")); outAcc("–");
      } else {
        var sn = SNE[sel];
        outMu(mu.toFixed(2));
        var pc = Math.pow(10, (mu + 5) / 5);
        outDist(pc > 1e6 ? (pc / 1e6).toFixed(1) + " Mpc" : (pc / 1e3).toFixed(1) + " kpc");
        outShift(shift.toFixed(1) + I18N.t("sc.days"));
        outHost(sn.host);
        outAcc(showAnswer ? sn.mu.toFixed(1) + " (" + sn.type + ")" : "–");
      }
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- drag the observations: sideways in time, up and down in modulus ---- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.x < PX || p.x > PX + PW || p.y < PY - PH || p.y > PY) return;
      if (showBar && Math.abs(p.y - yOf(barM)) < 8) { drag = { bar: true }; }
      else if (sel < 0) return;
      else drag = { x: p.x, y: p.y, shift: shift, mu: mu };
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.bar) { barM = Math.max(M_TOP, Math.min(M_BOT, magOf(p.y))); S.requestDraw(); return; }
      shift = Math.max(0, Math.min(195, drag.shift + (p.x - drag.x) * T_RANGE / PW));
      mu = clampMu(drag.mu - (p.y - drag.y) * (M_BOT - M_TOP) / PH);   // up = brighter = larger modulus
      upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#fafafa"; ctx.fillRect(7, 37 + OY, 636, 470);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(7.5, 37.5 + OY, 635, 469);

      ctx.fillStyle = "#ffffff"; ctx.fillRect(PX, PY - PH, PW, PH);
      ctx.strokeStyle = "#000000"; ctx.strokeRect(PX - 0.5, PY - PH - 0.5, PW + 1, PH + 1);
      axes(ctx, t);

      ctx.save();
      ctx.beginPath(); ctx.rect(PX, PY - PH, PW, PH); ctx.clip();
      ctx.strokeStyle = "#d03030"; ctx.lineWidth = 1;        // the type Ia template
      ctx.beginPath();
      ctx.moveTo(xOf(C_XS * C_START.x), yOf(PEAK_ABS + C_YS * (C_START.y - C_Y0)));
      C_PTS.forEach(function (p) {
        ctx.quadraticCurveTo(xOf(C_XS * p.cx), yOf(PEAK_ABS + C_YS * (p.cy - C_Y0)),
          xOf(C_XS * p.ax), yOf(PEAK_ABS + C_YS * (p.ay - C_Y0)));
      });
      ctx.stroke();
      if (sel >= 0) {                                        // the observations, shifted by the fit
        ctx.fillStyle = "#1d6173";
        SNE[sel].obs.forEach(function (p) {                 // day 0 starts at the axis's left edge
          var x = xOf(T_LEFT + p[0] + shift), y = yOf(p[1] - mu);
          ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.restore();

      if (showBar) {
        var by = yOf(barM);
        ctx.strokeStyle = "#0066cc"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(PX, by); ctx.lineTo(PX + PW, by); ctx.stroke();
        ctx.fillStyle = "#0066cc"; ctx.font = "11px " + FONT;
        ctx.textAlign = "right"; ctx.textBaseline = "bottom";
        ctx.fillText(barM.toFixed(1), PX - 4, by - 2);
        ctx.textAlign = "left";
        ctx.fillText((barM + mu).toFixed(1), PX + PW + 4, by - 2);
      }

      ctx.fillStyle = "#d03030"; ctx.font = "11px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(t("sc.template"), PX + 8, PY - PH + 6);
      if (sel >= 0) {
        ctx.fillStyle = "#1d6173"; ctx.textAlign = "right";
        ctx.fillText("SN " + SNE[sel].name + " · " + SNE[sel].host, PX + PW - 8, PY - PH + 6);
      }
    });

    function axes(ctx, t) {
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.fillStyle = "#000000"; ctx.font = "11px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      T_MIN_T.forEach(function (d) {
        var x = xOf(d);
        ctx.beginPath(); ctx.moveTo(x, PY); ctx.lineTo(x, PY + 3); ctx.stroke();
      });
      T_MAJ.forEach(function (d) {
        var x = xOf(d);
        ctx.beginPath(); ctx.moveTo(x, PY); ctx.lineTo(x, PY + 6); ctx.stroke();
        ctx.fillText(String(d), x, PY + 9);
      });
      ctx.font = "bold 12px " + FONT;
      ctx.fillText(t("sc.xaxis"), PX + PW / 2, PY + 26);
      ctx.font = "11px " + FONT;
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var m = M_TOP; m <= M_BOT; m += 1) {               // absolute magnitude, left
        var y = yOf(m);
        ctx.beginPath(); ctx.moveTo(PX, y); ctx.lineTo(PX - (m % 2 ? 3 : 6), y); ctx.stroke();
        if (m % 2 === 0) ctx.fillText(String(m), PX - 9, y);
      }
      ctx.textAlign = "left";
      var mLo = Math.ceil(M_TOP + mu), mHi = Math.floor(M_BOT + mu);
      for (var a = mLo; a <= mHi; a += 1) {                   // apparent magnitude, right
        var ya = yOf(a - mu);
        ctx.beginPath(); ctx.moveTo(PX + PW, ya); ctx.lineTo(PX + PW + (a % 2 ? 3 : 6), ya); ctx.stroke();
        if (a % 2 === 0) ctx.fillText(String(a), PX + PW + 9, ya);
      }
      ctx.save();
      ctx.font = "bold 12px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.translate(PX - 40, PY - PH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText(t("sc.yaxisL").replace("_B", "\u1D2E"), 0, 0);
      ctx.restore();
      ctx.save();
      ctx.font = "bold 12px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.translate(PX + PW + 42, PY - PH / 2); ctx.rotate(Math.PI / 2);
      ctx.fillText(t("sc.yaxisR").replace("_B", "\u1D2E"), 0, 0);
      ctx.restore();
    }

    upd();
    calc();
  }
});
