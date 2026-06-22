/* ===========================================================================
   originals.js — the faithful "All 126" listing: ClassAction + NAAP, in the
   original module groupings. Mirrors astro.unl.edu/animationsLinks.html.
   Depends on: i18n.js, ui.js, catalog-data.js (window.ANIM)
   =========================================================================== */
(function () {
  var lang = function () { return I18N.getLang(); };
  var FILTER = { q: "", sections: [], noResults: null };

  function mount() {
    document.body.prepend(UI.header());
    var main = document.createElement("main");
    main.className = "container";
    document.body.appendChild(main);
    document.body.appendChild(UI.footer());

    var total = ANIM.sections.reduce(function (a, s) {
      return a + s.modules.reduce(function (b, m) { return b + m.items.length; }, 0);
    }, 0);

    var hero = document.createElement("section");
    hero.className = "hero";
    hero.style.paddingBottom = "10px";
    hero.innerHTML =
      '<h1 data-i18n="originals.title"></h1>' +
      '<p data-i18n="originals.lead"></p>' +
      '<p style="margin-top:12px"><span class="stat">' + total + '</span> ' +
      '<span data-i18n="home.statLabel"></span></p>';
    main.appendChild(hero);

    render(main);
    I18N.apply(document);
  }

  function modId(secId, i) { return "m-" + secId + "-" + i; }

  function renderSearch(main) {
    var bar = document.createElement("div");
    bar.className = "toolbar";
    var search = document.createElement("div");
    search.className = "search";
    search.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9fabce" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
    var input = document.createElement("input");
    input.type = "search";
    input.setAttribute("data-i18n-attr", "placeholder:home.searchPlaceholder");
    input.addEventListener("input", function () { FILTER.q = input.value.toLowerCase().trim(); applyFilter(); });
    search.appendChild(input);
    bar.appendChild(search);
    main.appendChild(bar);
  }

  function render(main) {
    renderSearch(main);

    // table of contents (module chips) — kept in sync with each module's visibility
    var toc = document.createElement("div");
    toc.className = "chips";
    toc.style.margin = "0 0 10px";
    main.appendChild(toc);

    FILTER.sections = [];
    ANIM.sections.forEach(function (sec) {
      var secEl = document.createElement("section");
      secEl.style.margin = "30px 0 10px";
      var h2 = document.createElement("h2");
      h2.className = "category-title";
      h2.style.fontSize = "1.6rem";
      h2.dataset.en = sec.title.en; h2.dataset.idt = sec.title.id;
      h2.textContent = sec.title[lang()];
      secEl.appendChild(h2);
      main.appendChild(secEl);
      var secRec = { secEl: secEl, mods: [] };

      sec.modules.forEach(function (mod, i) {
        var id = modId(sec.id, i);
        var chip = document.createElement("a");
        chip.className = "chip";
        chip.href = "#" + id;
        chip.dataset.en = mod.title.en; chip.dataset.idt = mod.title.id;
        chip.textContent = mod.title[lang()];
        toc.appendChild(chip);

        var block = document.createElement("section");
        block.className = "category-block";
        block.id = id;
        block.style.scrollMarginTop = "72px";
        var h3 = document.createElement("h3");
        h3.className = "category-title";
        h3.style.fontSize = "1.12rem";
        h3.dataset.en = mod.title.en; h3.dataset.idt = mod.title.id;
        var nameSpan = document.createElement("span");
        nameSpan.textContent = mod.title[lang()];
        h3.appendChild(nameSpan);
        var cnt = document.createElement("span");
        cnt.className = "count"; cnt.textContent = mod.items.length;
        h3.appendChild(document.createTextNode(" "));
        h3.appendChild(cnt);
        block.appendChild(h3);

        var grid = document.createElement("div");
        grid.className = "card-grid";
        var cards = [];
        mod.items.forEach(function (it) {
          var card = itemCard(it);
          grid.appendChild(card);
          cards.push({ el: card, hay: (it.title.en + " " + it.title.id + " " + (it.desc || "")).toLowerCase() });
        });
        block.appendChild(grid);
        main.appendChild(block);

        secRec.mods.push({ block: block, countEl: cnt, chip: chip, cards: cards });
      });
      FILTER.sections.push(secRec);
    });

    var nr = document.createElement("p");
    nr.className = "empty-msg";
    nr.style.cssText = "display:none;text-align:center;color:#9fabce;margin:40px 0";
    nr.setAttribute("data-i18n", "home.empty");
    main.appendChild(nr);
    FILTER.noResults = nr;
  }

  function applyFilter() {
    var q = FILTER.q, any = false;
    FILTER.sections.forEach(function (sec) {
      var secVisible = false;
      sec.mods.forEach(function (m) {
        var vis = 0;
        m.cards.forEach(function (c) {
          var show = !q || c.hay.indexOf(q) !== -1;
          c.el.style.display = show ? "" : "none";
          if (show) vis++;
        });
        m.block.style.display = vis ? "" : "none";
        m.chip.style.display = vis ? "" : "none";
        m.countEl.textContent = vis;
        if (vis) { secVisible = true; any = true; }
      });
      sec.secEl.style.display = secVisible ? "" : "none";
    });
    FILTER.noResults.style.display = any ? "none" : "";
  }

  function itemCard(it) {
    var ready = !!it.ready;
    var el = document.createElement("div");
    el.className = "card compact" + (ready ? "" : " planned");
    var actions = '<div class="card-actions">';
    if (ready) actions += '<a class="mini-btn primary" href="sims/' + it.ready +
      '.html" data-i18n="orig.interactive"></a>';
    if (it.swf) actions += '<a class="mini-btn flash" href="play.html?a=' + encodeURIComponent(it.slug) +
      '&s=' + encodeURIComponent(it.swf) + '" data-i18n="card.playOriginal"></a>';
    actions += "</div>";
    el.innerHTML =
      '<span class="badge ' + (ready ? "ready" : "planned") + '" data-i18n="' +
        (ready ? "badge.ready" : "badge.planned") + '"></span>' +
      '<h3 data-en="' + attr(it.title.en) + '" data-idt="' + attr(it.title.id) + '">' +
        esc(it.title[lang()]) + "</h3>" +
      '<p>' + esc(it.desc || "") + "</p>" + actions;
    I18N.apply(el);
    return el;
  }

  function attr(s) { return (s || "").replace(/"/g, "&quot;"); }
  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  // re-localize on language change (titles/module names carry data-en / data-idt)
  window.addEventListener("langchange", function () {
    document.querySelectorAll("[data-idt]").forEach(function (el) {
      var t = lang() === "id" ? el.dataset.idt : el.dataset.en;
      if (el.tagName === "H3" && el.querySelector("span")) el.querySelector("span").textContent = t;
      else el.textContent = t;
    });
  });

  document.addEventListener("DOMContentLoaded", mount);
})();
