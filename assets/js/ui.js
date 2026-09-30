/* ===========================================================================
   ui.js — shared chrome (header / footer / language switch) used by every page.
   Depends on i18n.js. Pure DOM, no framework.
   =========================================================================== */
window.UI = (function () {
  var LOGO =
    '<svg class="logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<circle cx="24" cy="24" r="9" fill="#ffd166"/>' +
    '<ellipse cx="24" cy="24" rx="21" ry="8" stroke="#6ea8fe" stroke-width="2" transform="rotate(-25 24 24)"/>' +
    '<circle cx="42" cy="13" r="2.4" fill="#b692ff"/>' +
    "</svg>";

  // base path back to site root (sim pages live one level deep in /sims/)
  function root() {
    return location.pathname.indexOf("/sims/") !== -1 ? "../" : "./";
  }

  function langSwitch() {
    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Language");
    I18N.SUPPORTED.forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = l.toUpperCase();
      b.className = I18N.getLang() === l ? "active" : "";
      b.addEventListener("click", function () { I18N.setLang(l); });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function header() {
    var h = document.createElement("header");
    h.className = "site-header";
    var bar = document.createElement("div");
    bar.className = "bar";

    var brand = document.createElement("a");
    brand.className = "brand";
    brand.href = root() + "index.html";
    brand.innerHTML = LOGO + '<span data-i18n="site.title"></span>';

    var nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.innerHTML =
      '<a href="' + root() + 'index.html" data-i18n="nav.topics"></a>' +
      '<a href="' + root() + 'originals.html" data-i18n="nav.originals"></a>';

    var spacer = document.createElement("div");
    spacer.className = "spacer";

    bar.appendChild(brand);
    bar.appendChild(nav);
    bar.appendChild(spacer);
    bar.appendChild(langSwitch());
    h.appendChild(bar);
    return h;
  }

  var GITHUB =
    '<svg class="gh-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">' +
    '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>' +
    "</svg>";

  function footer() {
    var f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML =
      '<div class="container">' +
      '<span data-i18n="footer.note"></span>' +
      '<span class="footer-links">' +
      '<a href="https://astro.unl.edu/" target="_blank" rel="noopener" data-i18n="footer.unl"></a>' +
      '<span class="sep" aria-hidden="true">·</span>' +
      '<a class="gh-link" href="https://github.com/azlkiniue/astronomy-education" target="_blank" rel="noopener">' +
      GITHUB + '<span data-i18n="footer.source"></span></a>' +
      "</span>" +
      "</div>";
    return f;
  }

  // Re-style the language switch buttons when language changes.
  window.addEventListener("langchange", function () {
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.textContent.toLowerCase() === I18N.getLang());
    });
  });

  return { header: header, footer: footer, langSwitch: langSwitch, root: root };
})();
