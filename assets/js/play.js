/* ===========================================================================
   play.js — plays an original UNL Flash animation (.swf) via the Ruffle emulator.
   URL:  play.html?a=<slug>     (slug = original animation file name)
   Depends on: i18n.js, ui.js, catalog-data.js, Ruffle (window.RufflePlayer)
   =========================================================================== */
I18N.add({
  en: {
    "play.note": "This is the original Flash animation, running in your browser through the Ruffle emulator — no plugin needed. A modern rebuild may follow.",
    "play.rebuilt": "Open the rebuilt interactive →",
    "play.loading": "Loading the original animation…",
    "play.failed": "Couldn't start the Ruffle player. It needs an internet connection the first time it loads.",
    "play.original": "Original Flash animation",
    "play.notfound": "Animation not found."
  },
  id: {
    "play.note": "Ini animasi Flash asli, berjalan di peramban Anda melalui emulator Ruffle — tanpa plugin. Versi modern mungkin menyusul.",
    "play.rebuilt": "Buka interaktif yang dibangun ulang →",
    "play.loading": "Memuat animasi asli…",
    "play.failed": "Tidak dapat memulai pemutar Ruffle. Diperlukan koneksi internet saat pertama kali dimuat.",
    "play.original": "Animasi Flash asli",
    "play.notfound": "Animasi tidak ditemukan."
  }
});

(function () {
  function param(n) { return new URLSearchParams(location.search).get(n); }

  function findItem(slug) {
    if (!slug || !window.ANIM) return null;
    var found = null;
    ANIM.sections.forEach(function (sec) {
      sec.modules.forEach(function (mod) {
        mod.items.forEach(function (it) {
          if (!found && it.slug.toLowerCase() === slug.toLowerCase()) found = it;
        });
      });
    });
    return found;
  }

  function mount() {
    document.body.prepend(UI.header());
    var main = document.createElement("main");
    main.className = "container";
    document.body.appendChild(main);
    document.body.appendChild(UI.footer());

    var crumb = document.createElement("div");
    crumb.className = "breadcrumb";
    crumb.innerHTML = '<a href="originals.html" data-i18n="nav.originals"></a>';
    main.appendChild(crumb);

    var item = findItem(param("a"));
    var head = document.createElement("div");
    head.className = "sim-head";
    main.appendChild(head);

    if (!item) {
      head.innerHTML = '<h1 data-i18n="play.notfound"></h1>';
      I18N.apply(document);
      return;
    }

    var h1 = document.createElement("h1");
    var lead = document.createElement("p");
    head.appendChild(h1); head.appendChild(lead);
    var refresh = function () { h1.textContent = item.title[I18N.getLang()]; };
    lead.textContent = item.desc || "";
    refresh();
    window.addEventListener("langchange", refresh);

    // actions
    var actions = document.createElement("div");
    actions.className = "btn-row";
    actions.style.margin = "4px 0 16px";
    if (item.ready) {
      var a = document.createElement("a");
      a.className = "btn primary";
      a.href = "sims/" + item.ready + ".html";
      a.setAttribute("data-i18n", "play.rebuilt");
      actions.appendChild(a);
    }
    main.appendChild(actions);

    var note = document.createElement("p");
    note.className = "category-desc";
    note.setAttribute("data-i18n", "play.note");
    main.appendChild(note);

    var stage = document.createElement("div");
    stage.className = "play-stage";
    stage.innerHTML = '<div class="play-msg" data-i18n="play.loading"></div>';
    main.appendChild(stage);

    I18N.apply(document);
    startRuffle(stage, item.swf);
  }

  function startRuffle(stage, swfUrl) {
    function fail() {
      stage.innerHTML = '<div class="play-msg err">' + I18N.t("play.failed") +
        '<br><a href="' + swfUrl + '" download>' + swfUrl.split("/").pop() + "</a></div>";
    }
    var tries = 0;
    (function wait() {
      if (window.RufflePlayer && window.RufflePlayer.newest) {
        try {
          var ruffle = window.RufflePlayer.newest();
          var player = ruffle.createPlayer();
          player.style.width = "100%";
          player.style.height = "100%";
          stage.innerHTML = "";
          stage.appendChild(player);
          var p = player.load({ url: swfUrl, autoplay: "on", scale: "showAll", letterbox: "on", wmode: "opaque" });
          if (p && p.catch) p.catch(fail);
        } catch (e) { fail(); }
        return;
      }
      if (tries++ > 40) { fail(); return; }     // ~4s
      setTimeout(wait, 100);
    })();
  }

  document.addEventListener("DOMContentLoaded", mount);
})();
