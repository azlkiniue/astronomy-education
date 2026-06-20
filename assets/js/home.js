/* ===========================================================================
   home.js — renders the topic-grouped catalog home page.
   Depends on: i18n.js, ui.js, catalog-data.js (window.ANIM)
   =========================================================================== */
(function () {
  var lang = function () { return I18N.getLang(); };
  var state = { q: "", topic: "all", status: "all" };

  function mount() {
    document.body.prepend(UI.header());
    var main = document.createElement("main");
    main.className = "container";
    document.body.appendChild(main);
    document.body.appendChild(UI.footer());
    renderHero(main);
    renderToolbar(main);
    var results = document.createElement("div");
    results.id = "results";
    main.appendChild(results);
    renderResults();
    I18N.apply(document);
  }

  function renderHero(main) {
    var ready = ANIM.sims.filter(function (s) { return s.ready; }).length;
    var total = ANIM.sims.length;
    var hero = document.createElement("section");
    hero.className = "hero";
    hero.innerHTML =
      '<h1 data-i18n="home.heroTitle"></h1>' +
      '<p data-i18n="home.heroLead"></p>' +
      '<p style="margin-top:14px">' +
      '<span class="stat">' + ready + '</span> <span data-i18n="home.readyLabel"></span>' +
      ' · <span class="stat">' + total + '</span> <span data-i18n="home.statLabel"></span></p>';
    main.appendChild(hero);
  }

  function renderToolbar(main) {
    var bar = document.createElement("div");
    bar.className = "toolbar";

    var search = document.createElement("div");
    search.className = "search";
    search.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9fabce" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
    var input = document.createElement("input");
    input.type = "search";
    input.setAttribute("data-i18n-attr", "placeholder:home.searchPlaceholder");
    input.addEventListener("input", function () { state.q = input.value.toLowerCase().trim(); renderResults(); });
    search.appendChild(input);
    bar.appendChild(search);

    var status = document.createElement("div");
    status.className = "chips";
    [["all", "home.all"], ["ready", "home.ready"], ["planned", "home.planned"]].forEach(function (p) {
      var c = document.createElement("button");
      c.className = "chip" + (state.status === p[0] ? " active" : "");
      c.setAttribute("data-i18n", p[1]);
      c.addEventListener("click", function () {
        state.status = p[0];
        status.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        renderResults();
      });
      status.appendChild(c);
    });
    bar.appendChild(status);
    main.appendChild(bar);

    var cats = document.createElement("div");
    cats.className = "chips";
    cats.style.marginBottom = "8px";
    cats.appendChild(makeCatChip("all", I18N.t("home.all"), cats));
    ANIM.topics.forEach(function (t) { cats.appendChild(makeCatChip(t.id, t.title[lang()], cats)); });
    main.appendChild(cats);
    window.addEventListener("langchange", function () { refreshCatChips(cats); });
  }

  function makeCatChip(id, label, container) {
    var c = document.createElement("button");
    c.className = "chip" + (state.topic === id ? " active" : "");
    c.dataset.topic = id;
    c.textContent = label;
    c.addEventListener("click", function () {
      state.topic = id;
      container.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
      c.classList.add("active");
      renderResults();
    });
    return c;
  }

  function refreshCatChips(container) {
    container.querySelectorAll(".chip").forEach(function (c) {
      if (c.dataset.topic === "all") { c.textContent = I18N.t("home.all"); return; }
      var t = ANIM.topics.find(function (x) { return x.id === c.dataset.topic; });
      if (t) c.textContent = t.title[lang()];
    });
  }

  function matches(sim) {
    if (state.topic !== "all" && sim.topic !== state.topic) return false;
    if (state.status === "ready" && !sim.ready) return false;
    if (state.status === "planned" && sim.ready) return false;
    if (state.q) {
      var hay = (sim.title.en + " " + sim.title.id + " " + (sim.desc || "")).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function renderResults() {
    var box = document.getElementById("results");
    box.innerHTML = "";
    var any = false;
    ANIM.topics.forEach(function (t) {
      var sims = ANIM.sims.filter(function (s) { return s.topic === t.id && matches(s); });
      if (!sims.length) return;
      // ready first, then alphabetical
      sims.sort(function (a, b) { return (b.ready ? 1 : 0) - (a.ready ? 1 : 0) || a.title.en.localeCompare(b.title.en); });
      any = true;
      var block = document.createElement("section");
      block.className = "category-block";
      var h2 = document.createElement("h2");
      h2.className = "category-title";
      h2.innerHTML = t.title[lang()] + ' <span class="count">' + sims.length + "</span>";
      var pd = document.createElement("p");
      pd.className = "category-desc";
      pd.textContent = t.desc[lang()];
      block.appendChild(h2); block.appendChild(pd);
      var grid = document.createElement("div");
      grid.className = "card-grid";
      sims.forEach(function (s) { grid.appendChild(card(s)); });
      block.appendChild(grid);
      box.appendChild(block);
    });
    if (!any) {
      var e = document.createElement("p");
      e.className = "empty";
      e.textContent = I18N.t("home.empty");
      box.appendChild(e);
    }
  }

  function card(sim) {
    var el = document.createElement(sim.ready ? "a" : "div");
    el.className = "card " + (sim.ready ? "ready" : "planned");
    if (sim.ready) el.href = "sims/" + sim.ready + ".html";
    var thumb = '<div class="thumb">' + thumbFor(sim.topic) +
      (sim.preview ? '<img src="' + esc(sim.preview) + '" loading="lazy" alt="" onerror="this.remove()">' : "") +
      "</div>";
    // a planned card is a <div>, so we can add a "play original" link inside it
    var actions = (!sim.ready && sim.swf) ?
      '<div class="card-actions"><a class="mini-btn flash" href="play.html?a=' + encodeURIComponent(sim.slug) +
      '" data-i18n="card.playOriginal"></a></div>' : "";
    el.innerHTML =
      thumb +
      '<span class="badge ' + (sim.ready ? "ready" : "planned") + '" data-i18n="' +
        (sim.ready ? "badge.ready" : "badge.planned") + '"></span>' +
      "<h3>" + esc(sim.title[lang()]) + "</h3>" +
      "<p>" + esc(sim.desc || "") + "</p>" + actions;
    I18N.apply(el);
    return el;
  }

  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function thumbFor(topic) {
    var map = { telescopes: "light", solar: "sun", stars: "hr", galaxy: "cosmology" };
    return THUMBS[map[topic] || topic] || THUMBS.math;
  }

  var THUMBS = {
    math: '<svg viewBox="0 0 120 80"><path d="M10 60 L40 30 L60 50" stroke="#6ea8fe" stroke-width="2.5" fill="none"/><circle cx="60" cy="50" r="3" fill="#ffd166"/><text x="66" y="36" fill="#9fabce" font-size="11">θ</text></svg>',
    coords: '<svg viewBox="0 0 120 80"><circle cx="60" cy="40" r="26" stroke="#6ea8fe" stroke-width="2" fill="none"/><ellipse cx="60" cy="40" rx="26" ry="9" stroke="#b692ff" stroke-width="1.5" fill="none"/><line x1="60" y1="10" x2="60" y2="70" stroke="#9fabce" stroke-width="1"/></svg>',
    sun: '<svg viewBox="0 0 120 80"><line x1="10" y1="65" x2="110" y2="65" stroke="#2c3a66" stroke-width="2"/><path d="M14 65 A46 46 0 0 1 106 65" stroke="#ffd166" stroke-width="2" fill="none"/><circle cx="60" cy="20" r="7" fill="#ffd166"/></svg>',
    moon: '<svg viewBox="0 0 120 80"><circle cx="60" cy="40" r="22" fill="#e8ecf8"/><circle cx="68" cy="40" r="22" fill="#0b1020"/></svg>',
    orbits: '<svg viewBox="0 0 120 80"><ellipse cx="64" cy="40" rx="40" ry="22" stroke="#6ea8fe" stroke-width="2" fill="none"/><circle cx="34" cy="40" r="6" fill="#ffd166"/><circle cx="100" cy="40" r="3.5" fill="#b692ff"/></svg>',
    light: '<svg viewBox="0 0 120 80"><circle cx="30" cy="40" r="8" fill="#ffd166"/><path d="M38 40 H110 M40 30 L108 22 M40 50 L108 58" stroke="#6ea8fe" stroke-width="1.5"/></svg>',
    blackbody: '<svg viewBox="0 0 120 80"><path d="M10 70 Q40 10 60 40 T110 70" stroke="#ff6b6b" stroke-width="2.5" fill="none"/></svg>',
    spectra: '<svg viewBox="0 0 120 80"><rect x="14" y="22" width="92" height="36" rx="3" fill="#0b1020" stroke="#2c3a66"/><line x1="34" y1="22" x2="34" y2="58" stroke="#b692ff" stroke-width="2"/><line x1="58" y1="22" x2="58" y2="58" stroke="#6ea8fe" stroke-width="2"/><line x1="80" y1="22" x2="80" y2="58" stroke="#4cd4a0" stroke-width="2"/></svg>',
    hr: '<svg viewBox="0 0 120 80"><line x1="20" y1="68" x2="20" y2="12" stroke="#2c3a66"/><line x1="20" y1="68" x2="108" y2="68" stroke="#2c3a66"/><circle cx="40" cy="28" r="2.5" fill="#6ea8fe"/><circle cx="62" cy="44" r="2" fill="#ffd166"/><circle cx="86" cy="58" r="3" fill="#ff6b6b"/></svg>',
    binary: '<svg viewBox="0 0 120 80"><circle cx="44" cy="40" r="12" fill="#ffd166"/><circle cx="78" cy="40" r="7" fill="#6ea8fe"/><ellipse cx="61" cy="40" rx="30" ry="14" stroke="#2c3a66" stroke-width="1" fill="none"/></svg>',
    exoplanets: '<svg viewBox="0 0 120 80"><circle cx="60" cy="40" r="18" fill="#ffd166"/><circle cx="46" cy="40" r="5" fill="#0b1020"/><path d="M10 68 H110" stroke="#2c3a66"/><path d="M10 66 Q45 66 55 60 T110 66" stroke="#6ea8fe" stroke-width="1.5" fill="none"/></svg>',
    atmosphere: '<svg viewBox="0 0 120 80"><circle cx="60" cy="44" r="20" fill="#6ea8fe" opacity=".5"/><circle cx="60" cy="44" r="14" fill="#4cd4a0"/><circle cx="92" cy="20" r="2" fill="#e8ecf8"/></svg>',
    cosmology: '<svg viewBox="0 0 120 80"><circle cx="30" cy="40" r="2" fill="#fff"/><circle cx="60" cy="30" r="2.5" fill="#ffd166"/><circle cx="90" cy="50" r="2" fill="#ff6b6b"/><path d="M30 40 L60 30 L90 50" stroke="#2c3a66" stroke-width="1" stroke-dasharray="3 3"/></svg>'
  };

  window.addEventListener("langchange", function () { renderResults(); });
  document.addEventListener("DOMContentLoaded", mount);
})();
