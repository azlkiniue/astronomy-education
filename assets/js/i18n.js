/* ===========================================================================
   i18n.js — tiny translation engine (no dependencies, works on file://)
   ---------------------------------------------------------------------------
   Usage:
     I18N.add({ en: { key: "..." }, id: { key: "..." } });  // register strings
     I18N.t("key")                                          // translate
     I18N.apply(root)                                       // fill [data-i18n]
     I18N.setLang("id"); I18N.getLang();
   Mark up HTML with:
     <span data-i18n="key"></span>            -> textContent
     <span data-i18n-html="key"></span>       -> innerHTML
     <input data-i18n-attr="placeholder:key"> -> attribute value
   Listen for language changes via:  window.addEventListener('langchange', fn)
   =========================================================================== */
window.I18N = (function () {
  var SUPPORTED = ["en", "id"];
  var dict = { en: {}, id: {} };

  function detect() {
    var saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("id") === 0 ? "id" : "en";
  }
  var lang = detect();

  function add(strings) {
    SUPPORTED.forEach(function (l) {
      if (strings[l]) {
        for (var k in strings[l]) dict[l][k] = strings[l][k];
      }
    });
  }

  function t(key) {
    if (dict[lang] && dict[lang][key] != null) return dict[lang][key];
    if (dict.en[key] != null) return dict.en[key];
    return key;
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      // format "attr:key, attr2:key2"
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });
    if (dict[lang]["meta.title"]) document.title = t("meta.title");
  }

  function setLang(l) {
    if (SUPPORTED.indexOf(l) === -1) return;
    lang = l;
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
    apply(document);
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: l } }));
  }

  function getLang() { return lang; }

  return { add: add, t: t, apply: apply, setLang: setLang, getLang: getLang, SUPPORTED: SUPPORTED };
})();

/* ---- Shared UI strings (header, footer, home, common control labels) ---- */
I18N.add({
  en: {
    "site.title": "Astronomy Education",
    "site.tagline": "Interactive Astronomy",
    "nav.topics": "Topics",
    "nav.originals": "All 126",
    "nav.home": "All simulations",
    "originals.title": "The Complete Original Catalog",
    "originals.lead": "All 126 animations from the UNL ClassAction and NAAP collections, in their original groupings. Each one links to its rebuilt interactive and to the original Flash animation.",
    "originals.jump": "Jump to:",
    "orig.interactive": "Open interactive",
    "home.heroTitle": "Astronomy Simulations & Animations",
    "home.heroLead":
      "A modern, open recreation of the classic UNL Flash astronomy applets — rebuilt in plain HTML & JavaScript so they run on any modern device.",
    "home.searchPlaceholder": "Search simulations…",
    "home.all": "All",
    "home.statLabel": "simulations catalogued",
    "home.empty": "No simulations match your search.",
    "home.whyFewer": "why not 126?",
    "home.mergesLead":
      "The original UNL catalog has {total} entries, but {extra} of them repeat a simulator that is already listed elsewhere — mostly NAAP lab simulators that ClassAction lists again in its own modules, plus a few ClassAction animations that appear in two of its modules. Each simulator was rebuilt once, so the {total} entries make {unique} simulations. The {groups} below each stand in for more than one original entry; the <a href=\"originals.html\">All {total}</a> page still lists every entry in its original place.",
    "home.dup.file": "same file",
    "home.dup.copy": "identical copy",
    "home.dup.build": "another build",
    "home.dupNote.file": "the very same .swf, listed again in another module",
    "home.dupNote.copy": "a byte-for-byte copy of the .swf, saved under another name or folder",
    "home.dupNote.build": "a separately compiled version of the same simulator",
    "card.open": "Open",
    "card.playOriginal": "▶ Original (Flash)",
    "footer.note":
      "Educational recreation inspired by the UNL Astronomy Education Group (NAAP & ClassAction). Not affiliated with UNL.",
    "footer.source": "Open source",
    "footer.unl": "Original UNL Astronomy Education site",
    "sim.backToCatalog": "← All simulations",
    "sim.aboutTitle": "About this simulation",
    "sim.reset": "Reset",
    "sim.play": "Play",
    "sim.pause": "Pause",
    "sim.speed": "Animation speed",
    "sim.show": "Show",
    "common.on": "On",
    "common.off": "Off"
  },
  id: {
    "site.title": "Astronomy Education",
    "site.tagline": "Astronomi Interaktif",
    "nav.topics": "Topik",
    "nav.originals": "Semua 126",
    "nav.home": "Semua simulasi",
    "originals.title": "Katalog Asli Lengkap",
    "originals.lead": "Seluruh 126 animasi dari koleksi UNL ClassAction dan NAAP, dalam pengelompokan aslinya. Setiap item terhubung ke versi interaktif yang dibangun ulang dan ke animasi Flash aslinya.",
    "originals.jump": "Lompat ke:",
    "orig.interactive": "Buka interaktif",
    "home.heroTitle": "Simulasi & Animasi Astronomi",
    "home.heroLead":
      "Pembuatan ulang modern dan terbuka dari applet astronomi Flash klasik UNL — dibangun ulang dengan HTML & JavaScript murni agar berjalan di perangkat modern.",
    "home.searchPlaceholder": "Cari simulasi…",
    "home.all": "Semua",
    "home.statLabel": "simulasi terdaftar",
    "home.empty": "Tidak ada simulasi yang cocok dengan pencarian Anda.",
    "home.whyFewer": "mengapa bukan 126?",
    "home.mergesLead":
      "Katalog asli UNL memiliki {total} entri, tetapi {extra} di antaranya mengulang simulator yang sudah tercantum di tempat lain — kebanyakan simulator lab NAAP yang dicantumkan lagi oleh ClassAction di modulnya sendiri, ditambah beberapa animasi ClassAction yang muncul di dua modulnya. Setiap simulator hanya dibangun ulang sekali, sehingga {total} entri tersebut menjadi {unique} simulasi. Masing-masing dari {groups} simulasi di bawah ini mewakili lebih dari satu entri asli; halaman <a href=\"originals.html\">Semua {total}</a> tetap mencantumkan setiap entri di tempat aslinya.",
    "home.dup.file": "berkas sama",
    "home.dup.copy": "salinan identik",
    "home.dup.build": "build lain",
    "home.dupNote.file": "berkas .swf yang persis sama, dicantumkan lagi di modul lain",
    "home.dupNote.copy": "salinan .swf yang identik byte demi byte, disimpan dengan nama atau di folder lain",
    "home.dupNote.build": "versi simulator yang sama yang dikompilasi terpisah",
    "card.open": "Buka",
    "card.playOriginal": "▶ Asli (Flash)",
    "footer.note":
      "Pembuatan ulang edukatif terinspirasi oleh UNL Astronomy Education Group (NAAP & ClassAction). Tidak berafiliasi dengan UNL.",
    "footer.source": "Sumber terbuka",
    "footer.unl": "Situs asli UNL Astronomy Education",
    "sim.backToCatalog": "← Semua simulasi",
    "sim.aboutTitle": "Tentang simulasi ini",
    "sim.reset": "Atur ulang",
    "sim.play": "Putar",
    "sim.pause": "Jeda",
    "sim.speed": "Kecepatan animasi",
    "sim.show": "Tampilkan",
    "common.on": "Aktif",
    "common.off": "Mati"
  }
});
