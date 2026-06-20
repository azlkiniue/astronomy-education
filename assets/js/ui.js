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

  function footer() {
    var f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML =
      '<div class="container">' +
      '<span data-i18n="footer.note"></span>' +
      '<span>Cosmos Lab · <a href="https://github.com/" target="_blank" rel="noopener" data-i18n="footer.source"></a></span>' +
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
