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
