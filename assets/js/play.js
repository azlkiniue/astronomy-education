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
    "play.notfound": "Animation not found.",
    "play.paused": "Paused while you're away \u2014 it picks up again when you come back"
  },
  id: {
    "play.note": "Ini animasi Flash asli, berjalan di peramban Anda melalui emulator Ruffle — tanpa plugin. Versi modern mungkin menyusul.",
    "play.rebuilt": "Buka interaktif yang dibangun ulang →",
    "play.loading": "Memuat animasi asli…",
    "play.failed": "Tidak dapat memulai pemutar Ruffle. Diperlukan koneksi internet saat pertama kali dimuat.",
    "play.original": "Animasi Flash asli",
    "play.notfound": "Animasi tidak ditemukan.",
    "play.paused": "Dijeda selama Anda di tempat lain \u2014 berlanjut saat Anda kembali"
  }
});

(function () {
  function param(n) { return new URLSearchParams(location.search).get(n); }

  function findItem(slug, swf) {
    if ((!slug && !swf) || !window.ANIM) return null;
    var bySwf = null, bySlug = null;
    ANIM.sections.forEach(function (sec) {
      sec.modules.forEach(function (mod) {
        mod.items.forEach(function (it) {
          if (swf && !bySwf && it.swf === swf) bySwf = it;                         // exact SWF wins (slugs can collide)
          if (slug && !bySlug && it.slug.toLowerCase() === slug.toLowerCase()) bySlug = it;
        });
      });
    });
    return bySwf || bySlug;
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

    var item = findItem(param("a"), param("s"));
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
    var refresh = function () {
      h1.textContent = item.title[I18N.getLang()];
      document.title = h1.textContent + " \u2014 " + I18N.t("play.original") + " \u2014 " + I18N.t("site.title");
    };
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

  /* Ruffle redraws the whole Flash stage on every frame — 12 to 30 a second for
     most of these SWFs — even when nothing on it is moving, so an idle page
     still costs real CPU: 200–415 WebGL draw calls a second on
     siderealTimeAndHourAngleDemo with nobody touching it. Timing Ruffle's own
     animation-frame callbacks there:
         default renderer (wgpu over WebGL2)            5.1 ms each, ~24 a second
         preferredRenderer "webgl", quality "medium"    1.9–2.1 ms each, 60 a second
     and a suspended player draws nothing at all. So use the older, lighter
     WebGL renderer; halve the anti-aliasing (2x MSAA rather than 4x — GPU fill,
     invisible on HiDPI screens); and suspend the player whenever nobody can be
     looking at it. unmuteOverlay: see unmuteOnFirstGesture().               */
  var PLAYER_CONFIG = {
    autoplay: "on", unmuteOverlay: "hidden", scale: "showAll", letterbox: "on",
    wmode: "opaque", preferredRenderer: "webgl", quality: "medium"
  };

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
          var p = player.load(Object.assign({ url: swfUrl }, PLAYER_CONFIG));
          if (p && p.catch) p.catch(fail);
          suspendWhenAway(player, stage);
          unmuteOnFirstGesture(player);
        } catch (e) { fail(); }
        return;
      }
      if (tries++ > 40) { fail(); return; }     // ~4s
      setTimeout(wait, 100);
    })();
  }

  /* Run only while someone can see it: the player is on screen, the tab is
     visible, and the window has focus. The last point is what matters when
     comparing an original with its rebuild side by side — clicking into the
     other window lets it have the machine. A suspended player keeps showing
     its last frame; Ruffle's big play button is hidden for these automatic
     pauses so it does not cover the picture, and a small note says why.     */
  function suspendWhenAway(player, stage) {
    var api = null;
    try { api = player.ruffle ? player.ruffle() : null; } catch (e) { api = null; }
    function suspend() {
      try { if (api && api.suspend) api.suspend(); else if (player.pause) player.pause(); }
      catch (e) { /* still loading */ }
    }
    function resume() {
      try { if (api && api.resume) api.resume(); else if (player.play) player.play(); }
      catch (e) { /* still loading */ }
    }
    if (player.shadowRoot) {
      var style = document.createElement("style");
      style.textContent = ":host([data-autopaused]) #play-button { display: none !important; }";
      player.shadowRoot.appendChild(style);
    }
    var note = document.createElement("div");
    note.className = "play-paused";
    note.setAttribute("data-i18n", "play.paused");
    note.textContent = I18N.t("play.paused");
    note.hidden = true;
    stage.appendChild(note);

    var onScreen = true, focused = document.hasFocus(), visible = !document.hidden;
    var running = null, armed = false;
    function update() {
      if (!armed) return;                        // let it draw a first frame before pausing
      var run = onScreen && focused && visible;
      if (run === running) return;
      running = run;
      if (run) { player.removeAttribute("data-autopaused"); note.hidden = true; resume(); }
      else { player.setAttribute("data-autopaused", ""); note.hidden = false; suspend(); }
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        update();
      }).observe(stage);
    }
    document.addEventListener("visibilitychange", function () { visible = !document.hidden; update(); });
    window.addEventListener("blur", function () { focused = false; update(); });
    window.addEventListener("focus", function () { focused = true; update(); });
    /* Suspending before the first frame is drawn would leave a blank stage, so
       the policy only arms once the page has actually painted a dozen frames
       after the SWF loaded. Counting frames rather than milliseconds matters:
       a page opened in a background tab gets few or no frames, and it must not
       be paused until it has drawn something.                                 */
    player.addEventListener("loadedmetadata", function () {
      var frames = 0;
      (function tick() {
        if (++frames >= 12) { armed = true; running = null; update(); return; }
        requestAnimationFrame(tick);
      })();
    });
  }

  /* Browsers keep a page silent until the visitor first clicks, taps or types
     on it. Ruffle then covers the movie with "Click to unmute" and waits for a
     click on the player itself; with that overlay turned off (unmuteOverlay:
     "hidden"), the sound starts at the first such interaction anywhere on the
     page instead — Ruffle's resume() restarts its audio as well as the movie.
     If the browser lets the page play sound from the start, it is on already.
     The call is only made from an event that really counts as one (not the
     start of a touch that may turn into a scroll), once the movie is loaded,
     and while it is not paused for being out of sight; until then, keep
     listening.                                                              */
  function unmuteOnFirstGesture(player) {
    var events = ["pointerdown", "pointerup", "keydown", "touchend"];
    var loaded = false;
    player.addEventListener("loadedmetadata", function () { loaded = true; });
    function onGesture() {
      var activation = navigator.userActivation;
      if (activation && !activation.isActive) return;
      if (!loaded || player.hasAttribute("data-autopaused")) return;
      events.forEach(function (type) { window.removeEventListener(type, onGesture, true); });
      try { player.ruffle().resume(); } catch (e) { /* nothing to unmute */ }
    }
    events.forEach(function (type) { window.addEventListener(type, onGesture, true); });
  }

  document.addEventListener("DOMContentLoaded", mount);
})();
