# What would a different stack buy the Next-gen sims?

Research for issue #4. Written 2026-11-17. This is input to a later decision ticket, not the decision.

Claims marked **[tested]** were run for this note on throwaway pages outside the repo, opened from `file://` in three browser engines (versions in the appendix). Claims marked **[repo]** were read or measured in this repository at commit `94832d2`. Everything else carries a link to the source that owns it.

## Short answer

Keep the runtime as it is: classic `<script>` files, no build step, Canvas 2D for the picture. Add tooling that runs only on a developer machine and in CI (Node's built-in test runner, `tsc` checking JSDoc types, and a browser sweep that opens every sim from `file://`). Spend the real effort on a second version of the sim framework, because the things a Next-gen sim needs (phone layout, keyboard operation, reduced motion, challenge panels, a testable model) come from how the framework divides a sim into model, DOM and canvas, not from the language or the bundler.

The `file://` constraint decides most of this. Native ES modules, `fetch`, workers, WebGL textures and external SVG references all fail when a page is opened directly in Chromium and WebKit. A bundler survives only if it emits classic scripts or one inlined HTML file, and Vite's default output does neither.

## What is true today

- **[repo]** 104 sim hosts in `sims/`, 116 files and 43,637 lines in `assets/js/sims/` (104 sims plus 12 shared `_*.js` helpers). Every host loads the same four framework scripts by `<script src>`, then helpers, then the sim. Helpers publish one global each (`window.FlashText`, `window.CelestialSphere`, and so on). Load order in the HTML is the dependency graph.
- **[repo]** `assets/js/sim.js` (240 lines) builds the page and offers `S.slider/toggle/select/button/readout/group`, one fixed-size canvas, `S.onDraw/requestDraw` and `S.loop`. It has no notion of a model, of state, of a control being disabled or hidden, of a panel other than the sidebar, or of anything interactive inside the canvas.
- **[repo]** The canvas has a fixed logical size (`width: 760, height: 600` for `gravalgebra`) and is scaled by CSS (`.sim-stage canvas { width: 100%; height: auto }`). The layout has one breakpoint, at 880px, where the sidebar drops below the canvas. On a 360px-wide phone a 760-unit canvas is drawn at under half size, so the 10px and 11px canvas labels in `gravalgebra.js` come out at roughly 4 to 5 CSS pixels (computed from the CSS, not measured on a device).
- **[repo]** `gravalgebra.js` (1,015 lines), the reference Next-gen sim, shows where the framework stops helping:
  - It reaches around the framework for the sidebar (`S.canvas.parentNode.parentNode.querySelector(".sim-controls")`) and for its own `<select>` elements (`controlsEl.lastElementChild.querySelector("select")`), hides buttons with `style.display`, and keeps a `lock` flag because `set()` on a control fires its own change handler.
  - The coefficient chips, callouts, answer buttons and "next question" button are drawn on the canvas and hit-tested by hand (a `hits` array, ten `hits.push` sites, pointer listeners). The only keyboard handler is Escape. `answer()` is called from one place, the canvas `pointerdown` handler, so the "Predict the change" game cannot be played without a pointer.
  - The model (`expOf`, `fracOf`, `valOf`, the 125 combinations, the question generator) is about 40 clean lines, but it lives inside the `build(S)` closure with the drawing code. Nothing outside the page can call it, so nothing can compare it with another implementation.
- **[repo]** Across all sims: 77 files attach pointer listeners, 10 handle `keydown`, 5 mention `aria-`, none mention `prefers-reduced-motion` (nor does the CSS), 50 use `S.loop`.
- **[tested]** The "works when opened directly" constraint is already broken in places, and nothing notices. Opening all 104 hosts from `file://` and waiting 600 ms with no interaction: Firefox logs no errors; WebKit logs errors on 2 (`antipodesexplorer`, `habitable-zone`); Chromium on 4 (those two plus `meltednail`, `transitmovie`). Causes: `getImageData` on a canvas tainted by a `file://` image, and `fetch("../shzStars.dat")` in `habitable-zone.js`. `_filmframes.js` already guards its `fetch` with `location.protocol !== "file:"`, so the problem was known for one sim and missed for others. I did not check how much of each affected sim still works, and a sweep without interaction will miss failures that need a click.

## What `file://` allows

One test page, opened directly from disk. "ok" means the feature worked; "blocked" means the browser refused it.

| Feature | Chromium 159 | WebKit 27.2 | Firefox 159 |
| --- | --- | --- | --- |
| Classic `<script src>` | ok | ok | ok |
| `<script type="module" src>` | blocked (CORS) | blocked (CORS) | ok |
| Inline `<script type="module">` with no imports | ok | ok | ok |
| Inline module that imports `./mod.js` | blocked | blocked | ok |
| `import("./mod.js")` from a classic script | blocked | blocked | ok |
| `fetch` / `XMLHttpRequest` of a sibling file | blocked | blocked | ok |
| `new Worker("worker.js")` | blocked (SecurityError) | blocked | ok |
| Custom element with shadow DOM, defined in a classic script | ok | ok | ok |
| `adoptedStyleSheets`, `localStorage`, `matchMedia("(prefers-reduced-motion)")` | ok | ok | ok |
| Inline SVG, element focusable with `tabindex` | ok | ok | ok |
| SVG `<use href="sprite.svg#id">` (external file) | blocked | blocked | ok |
| Canvas 2D `drawImage` of a local image (display only) | ok | ok | ok |
| Canvas 2D `getImageData` after that `drawImage` | blocked (tainted) | blocked (tainted) | ok |
| WebGL context | ok | ok | ok |
| WebGL `texImage2D` from a local image | blocked (SecurityError) | blocked (SecurityError) | ok |

The documentation agrees with the blocked column. MDN: "you can no longer view your HTML using the `file://` protocol", because "module requests use CORS, and `file://` URLs are never same-origin" ([Using modules on the web](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules/Modules_on_the_web)). MDN on file origins: modern browsers "usually treat the origin of files loaded using the `file:///` scheme as opaque origins", and the URL spec leaves this to the implementation ([Same-origin policy, File origins](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#file_origins)). That is why Firefox differs. MDN on WebGL: "you can't use textures loaded from `file:///` URLs in WebGL and need a web server to test and deploy your code" ([Using textures in WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL)).

A site that must open directly in Chrome and Safari can therefore use classic scripts and inline scripts, and nothing that fetches a second file by script. Firefox passing is not enough.

## Comparison

| Option | Easier for a Next-gen sim | Cost | Survives the fixed constraints | AI agents |
| --- | --- | --- | --- | --- |
| 1. Stay as is | Nothing new. Pointer events already cover touch. | Each sim re-solves layout, keyboard, in-canvas widgets and game UI by hand, as `gravalgebra.js` does. No way to check a model. | Yes, in principle. In practice 4 of 104 sims already log errors from `file://` in Chromium and nothing catches it. | Easy to edit and run. No machine-checkable signal that a change is right, so errors surface only if someone looks. |
| 2. Tests and JSDoc types, no build | Model parity checks against the Original rebuild. Typed framework API. A `file://` sweep. Does nothing by itself for layout or accessibility. | Dev-only `package.json`. One ambient `.d.ts` for the globals. Models must move out of the `build` closure into DOM-free files. 104 old sims stay unchecked unless annotated. | Yes. Runtime files are unchanged; Node is needed only to check. | Good. `node --test` and `tsc --noEmit` give a pass/fail an agent can run after every edit. JSDoc is more verbose than TypeScript syntax. |
| 3. Build step with TypeScript and modules | Imports replace script-order globals. TypeScript syntax. npm packages, JSX, any framework. | Source no longer opens directly. `deploy.yml` needs a build job. Output must be classic IIFE or single-file HTML; Vite's default fails from `file://`. Shared code is duplicated per bundle or kept as a global. The thumbnail tooling assumes served source equals shipped source. | Only with the right output format, and only for the built file. | The most familiar stack to a model, with the strictest checks. Adds a toolchain that can break, and a build before any visual check. |
| 4. UI layer for controls and panels | Real focusable, labelled, responsive controls, game panels and explanations in the DOM. This is where most of the accessibility and phone gains are. | A control kit to design and maintain. A framework adds a vendored dependency and a second idiom. | Custom elements: yes, tested. Frameworks: only those that still ship a classic-script build (htm with Preact 10, Alpine, Vue's global build, petite-vue). Lit and Preact 11 ship ES modules only. | Custom elements and plain DOM are standard and well known. Template strings and HTML-attribute expressions are not type-checked. |
| 5. SVG or WebGL beside Canvas 2D | Inline SVG: draggable parts become DOM nodes that can take focus, ARIA roles and CSS media queries. WebGL: large particle counts and 3D. | SVG: two drawing idioms, slower for dense or per-frame scenes. WebGL: shader code, and no file-loaded textures from `file://`. | Inline SVG yes. External SVG references no. WebGL context yes, textures from local image files no. | Canvas 2D and SVG are both easy for agents. WebGL shaders are harder to verify without looking at the output. |

## Option 1: stay as is

What it keeps is real: an agent or a teacher can open any sim from disk, the deploy is a copy of the repo, and there is no toolchain to rot. Pointer events, which 77 sim files already use, cover touch without extra work.

What it does not give is any of the six things the Next-gen plan asks for. `gravalgebra.js` is the evidence: it had to bypass the framework to manage its own controls, it re-implements buttons and menus on the canvas where the keyboard and screen readers cannot reach them, and its model cannot be called from outside. WCAG 2.2 asks that "All functionality of the content is operable through a keyboard interface" (2.1.1, Level A), that functionality using dragging "can be achieved by a single pointer without dragging" (2.5.7, Level AA), and that for UI components "the name and role can be programmatically determined" (4.1.2, Level A) ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)). Canvas pixels satisfy none of these by themselves; MDN describes fallback content or a sub-DOM as what "adds accessibility to an otherwise non-accessible element" ([Canvas tutorial, Basic usage](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage)). Repeating the `gravalgebra` approach 104 times repeats these gaps 104 times.

## Option 2: a test runner and type checking, no build

**Tests.** Node's built-in runner is marked stable ("v20.0.0: The test runner is now stable"), runs with `node --test`, and includes `describe`/`it`, mocking and snapshot testing ([Node.js test runner](https://nodejs.org/api/test.html)). It needs no dependency and no bundler. **[tested]** Two ways of loading classic scripts into it both work on Node 24:

- A model written as a classic script that sets one global and touches no DOM loads with a plain `require()`; a test then compared all 125 `gravalgebra` coefficient settings against the closed form.
- An unmodified repo file (`assets/js/i18n.js`) loads with `node:vm` and a stub `window` of a few lines.

So a parity check between a Next-gen model and the Original rebuild's model needs no change of stack. It needs both models to exist as callable, DOM-free code. Today neither does: they sit inside `build(S)` closures. That refactor is the real cost, and it is the same cost under every option in this note.

Browser-level checks need a real browser. Playwright runs "Chromium, WebKit and Firefox" ([Playwright docs](https://playwright.dev/docs/intro)) and can open `file://` URLs; the sweep in "What is true today" is about 30 lines of it. Vitest is the other common runner, but "Vitest requires Vite >=v6.4.0" ([Vitest guide](https://vitest.dev/guide/)), so it belongs with option 3.

**Types.** TypeScript checks plain JavaScript: `checkJs` reports errors in `.js` files, types come from JSDoc comments, and `noEmit` makes `tsc` a checker only ([TSConfig reference](https://www.typescriptlang.org/tsconfig/), [JS projects using TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)). **[tested]** with TypeScript 7.0.2, where `strict` defaults to `true`:

| What was checked | Errors |
| --- | --- |
| `i18n.js`, `ui.js`, `catalog-data.js`, `sim.js`, `gravalgebra.js`, default settings | 356 |
| Same files, `--strict false` | 41 |
| `gravalgebra.js` alone with a 30-line `globals.d.ts` describing `Sim`, `I18N` and the `S` context, `--strict false` | 23 |
| A new 20-line model file written with JSDoc from the start, default strict | 1 (the global needs one ambient declaration) |

Two things follow. First, `window.Sim = …` in a classic script is not seen as a global declaration, so an ambient `.d.ts` is required; it is small, and it doubles as the written contract of the framework. Second, old code will not pass cheaply (of the 23 remaining errors, 15 are calls to var-arg helpers that read `arguments`, 6 are numbers passed to `String.replace`, and 2 are object-shape mismatches), so checking should apply to the new framework and Next-gen sims, with the 104 Original rebuilds excluded.

This option changes no shipped file, so it cannot break `file://`. It also does nothing for layout, touch, keyboard or reduced motion. It is the cheapest way to give agents a signal they can run, and it is a precondition for the parity check, but it is not sufficient alone.

A variant, native ES modules without a build, would add imports to this option. It is ruled out: module scripts are blocked from `file://` in Chromium and WebKit (table above).

## Option 3: a build step with TypeScript and modules

**What it buys.** Real `import`/`export` in place of five to eight ordered script tags and one global per helper; TypeScript syntax in place of JSDoc; npm packages; JSX if a framework is wanted; dead-code removal.

**What survives `file://`.** **[tested]** with the same two-module TypeScript project built three ways:

| Build | Output | From `file://` |
| --- | --- | --- |
| Vite 8.3.8, default | `<script type="module" crossorigin src="./assets/index-….js">` | Fails in Chromium and WebKit, works in Firefox |
| Vite with `vite-plugin-singlefile` 2.3.4 | One HTML file with the bundle inlined | Works in all three |
| esbuild 0.28.2, `--bundle --format=iife`, loaded by a plain `<script src>` | One classic script | Works in all three |

Vite documents the failure: "If the HTML file output was opened with `file` protocol, the scripts won't run", and "You will need to access the file with `http` protocol" ([Vite troubleshooting](https://vite.dev/guide/troubleshooting)). esbuild's `iife` format "is intended to be run in the browser" and is the default when bundling for the browser ([esbuild API](https://esbuild.github.io/api/)). The single-file plugin exists for exactly this case, apps "you can double-click and open directly in your web browser, no server needed", and lists its own limits: multi-page apps are poorly supported and lazily imported chunks may stay separate and fail under `file://` ([vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)).

**Costs specific to this repo.**

- The source stops being openable. Only the built output meets the constraint, so either build output is committed, or anyone who wants to open a sim from disk must run a build first.
- `deploy.yml` uploads the repo root today. It would need Node, an install and a build.
- 104 entry points. **[tested]** esbuild cannot share chunks between IIFE bundles ("Splitting currently only works with the "esm" format"), so the framework and helpers are either copied into every sim's bundle or left outside the bundler as a classic global script, which is the present arrangement.
- esbuild "does not do any type checking so you will still need to run `tsc -noEmit`" ([esbuild content types](https://esbuild.github.io/content-types/)). The type checker is a separate step either way, which is the same step option 2 adds.
- The existing dev tooling (`tools/build-thumbs.js` and its capture page) serves and loads source files as they are. It would have to target build output or a dev server.

**Net.** Compared with option 2, the gain is import syntax and TypeScript syntax. Tests, type checking and the model/view split are available without it. The gain is real for agents (TypeScript with Vite is a very familiar setup) but it is ergonomic, and it is paid for by giving up "edit a file, open it".

## Option 4: a UI layer for the controls and panels around the canvas

This is where most of what the Next-gen plan asks for lives. Controls, mode switches, question and feedback panels, explanations and score displays are text and widgets. In the DOM they get focus order, labels, roles, zoom, reflow and translation without extra code. On a canvas each of those must be rebuilt and usually is not, as in `gravalgebra.js`.

**Custom elements.** They need no module, build or framework: define a class, call `customElements.define()`, load it with a classic script ([Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)). **[tested]** a custom element with shadow DOM defined in a classic script works from `file://` in all three engines. For this codebase light DOM (no shadow root) fits better: `I18N.apply` finds strings with `root.querySelectorAll("[data-i18n]")`, which does not look inside shadow roots, and the site stylesheet does not reach inside them either **[repo]**. Custom elements are optional packaging. The same kit can be plain functions, as `S.slider` is now; what matters is that the kit grows to cover what `gravalgebra.js` had to build by hand: mode tabs, a choice group, disabled and hidden states, a feedback region that announces changes, and a proxy for things dragged on the canvas.

**Draggable things on the canvas.** The pattern that works is a real focusable element placed over each draggable object, carrying the slider role and keys from the ARIA Authoring Practices: arrow keys step the value, Home and End jump to the ends, with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` ([APG slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)). PhET does the same at scale with what it calls the Parallel DOM (see below). This is framework work in plain DOM and needs nothing from the other options.

**Small frameworks.** **[tested]** from `file://` in all three engines, loaded as classic scripts: htm with Preact 10 (`htm/preact/standalone.umd.js`, 13 KB), Alpine 3.17 (`cdn.min.js`, 56 KB), Vue 3.5 global build (173 KB), petite-vue 0.4.1 (17 KB, last published January 2022). Not usable this way: Lit, whose bundles "are standard JavaScript modules" ([Lit getting started](https://lit.dev/docs/getting-started/)), and Preact 11.2, whose npm package contains only `.mjs` files (Preact's own no-build guide uses import maps and module scripts throughout, [Preact no-build workflows](https://preactjs.com/guide/v10/no-build-workflows/)). So a framework is possible without a build, but the classic-script builds are the less-travelled path: the htm bundle pins Preact 10, petite-vue is dormant, and current releases of Lit and Preact assume modules. A framework would also put template code in tagged strings or HTML attributes, which `tsc` does not check. The challenge-mode state in `gravalgebra.js` (a mode, a question, a score) is small enough that a framework's rendering model is not obviously worth a dependency.

## Option 5: SVG or WebGL instead of, or beside, Canvas 2D

**Canvas 2D stays the default.** All 104 rebuilds and the shared helpers (`_celestialsphere.js` alone is 1,543 lines) draw with it, and it suits per-frame redraws of dense scenes. Its weakness is the one described under option 1, and the DOM proxy pattern in option 4 addresses it.

**Inline SVG** is the alternative for diagram-like sims with a few movable parts. Each shape is an element, so it can take focus, a role and a label directly, and CSS media queries such as `prefers-reduced-motion` (widely available "since January 2020", [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)) apply to it. **[tested]** inline SVG with a focusable child works from `file://`; an external reference (`<use href="sprite.svg#id">`) is blocked in Chromium and WebKit, so sprites would have to be inlined. A wholesale move to SVG would mean rewriting the shared helpers for no gain in the sims that animate every frame. As a per-sim choice for new sims it is cheap, provided the framework does not assume a canvas.

**WebGL** is justified only where Canvas 2D runs out (many thousands of particles, true 3D). **[tested]** a WebGL context is created from `file://` in all three engines, but uploading a local image file as a texture throws `SecurityError` in Chromium and WebKit, as MDN says it will. Textures would have to be generated in code or embedded as data. Nothing in the current catalog was shown to need it.

## What an established sim project does

PhET is the closest large precedent: a large catalog of maintained, translated science sims with accessibility features. Its framework, now published as SceneryStack, describes itself as "an open-source TypeScript framework" and "the development framework behind PhET Interactive Simulations", with screen-reader access through the "Parallel Document Object Model (PDOM)", keyboard navigation, and voicing ([scenerystack.org](https://scenerystack.org/)). Scenery "can be displayed in a combination of ways (WebGL, SVG, Canvas, etc.)" ([scenery README](https://github.com/phetsims/scenery)).

Two points bear on this ticket. PhET has the same offline constraint and states it as a requirement: sims must be able to be "downloaded and run off line in all identified browsers from the file:// URL", and its build "produces a single file that can be downloaded for offline use", "a single-file HTML that contains all images and audio"; development, by contrast, runs through a dev server ([simulation development overview](https://scenerystack.org/info-sync/simulation-development-overview)). So a build that ends in one self-contained file is a proven way to satisfy `file://`, and it is what option 3 would have to look like. And PhET's accessibility comes from its scene graph mirroring interactive objects into real DOM elements, which is the proxy pattern in option 4, not from TypeScript or the build.

Adopting SceneryStack itself is a larger change than anything in the ticket (a scene graph replacing all Canvas 2D drawing code, plus a bundler). I did not evaluate it beyond its own description.

## Recommendation

1. **Keep classic scripts, no build, Canvas 2D as the default.** It is the only arrangement where both the source and the shipped file open directly, and nothing the Next-gen plan needs is blocked by it.
2. **Add option 2 now, scoped to new code.** `node --test` for models, `tsc --noEmit` with `checkJs` and one ambient `.d.ts` for the framework and Next-gen sims, and a Playwright sweep that opens every sim from `file://` in Chromium and WebKit. The sweep would have caught the four sims that fail today. These are dev and CI dependencies only.
3. **Put the main effort into the framework (option 4 without a third-party framework).** A second-generation `sim.js` that:
   - takes the model as a separate DOM-free classic script, so the same file runs in the page and under `node --test`, and a Next-gen model can be compared with the Original rebuild's over a grid of inputs;
   - provides DOM building blocks for what `gravalgebra.js` hand-built: mode switch, choice group, enabled and visible state, feedback and score regions, explanation panels;
   - gives each draggable canvas object a focusable DOM proxy with the slider keys;
   - owns reduced motion (one `matchMedia` check that `S.loop` and transitions respect) and responsive sizing (canvas drawn at the size it is shown, not scaled down from 760 units).
   Whether the building blocks are functions or light-DOM custom elements is a style choice; both work from `file://`.
4. **Do not adopt a bundler or a UI framework now.** The bundler's gain over step 2 is syntax, at the price of the edit-and-open loop and a rebuilt deploy. If it is adopted later, the output must be classic IIFE scripts or single-file HTML, and the `file://` sweep is what proves it. The frameworks that still load as classic scripts are either pinned to old majors or dormant.
5. **Allow inline SVG per sim; hold WebGL until a sim needs it**, and then with no file-loaded textures.

Reasoning in one line: the constraint removes modules, the measurements show tests and types do not need a build, and the reference sim shows the missing capability is in the framework's shape.

## What I could not settle

- **Phones.** All `file://` tests ran on desktop engines. I did not test mobile Safari or Chrome on Android, or how a phone user would open a local HTML file at all. Phone layout was judged from the CSS, not measured on a device.
- **Real Safari and Chrome.** The WebKit and Chromium used are Playwright's builds (WebKit 27.2, Chromium 159 headless shell). The origin rules are engine-level and match the documentation, but branded Safari and Chrome were not run.
- **Firefox's rule.** Firefox allowed every file-to-file load I tried, including a parent-directory `fetch`. I did not find the current rule in Mozilla's documentation, and it may be a preference that differs between installs.
- **The four sims that fail from `file://` today.** I recorded the load-time errors only. How degraded each sim is, and which further sims fail after interaction, is unknown.
- **Cost of the model/view split.** I showed that a split model is testable, not how long it takes to split one. Whether the Original rebuilds' models can be extracted mechanically, or need per-sim work, decides how expensive the parity check is. That is a separate question from the stack.
- **Agent productivity.** The "AI agents" column is judgment. I did not run agents on the same task under different stacks.
- **JSDoc at scale.** The type-check counts cover five files. How noisy `checkJs` is across a full Next-gen sim with canvas code was not measured.
- **TypeScript's handling of `arguments`.** The handbook says a JavaScript function that reads `arguments` is treated as var-arg ([Type checking JavaScript files](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)); TypeScript 7.0.2 reported "Expected 0 arguments" for such calls in `gravalgebra.js`. I did not find out which is intended.
- **SceneryStack as a base.** Not evaluated hands-on, including whether it has a classic-script distribution.
- **Lit in Firefox.** My vendored-Lit test failed in Firefox on a bare import specifier, not on CORS, so Lit's single-file bundle from `file://` in Firefox is untested. It does not change the conclusion, since Chromium and WebKit block it.

## Appendix: how the tests were run

- Engines: Playwright 1.65.1 with Chromium 159.0.8154.6 (headless shell), Firefox 159.0, WebKit 27.2, on macOS. Pages opened by `file://` URL; results read from a `window` object the page fills in, plus console and page errors.
- Feature page: one HTML file with a classic script, a module entry, a JSON file, a worker, an SVG sprite and a 4x4 PNG beside it in the same directory.
- Sim sweep: every `sims/*.html` in this repo opened from `file://`, 600 ms wait, console errors and uncaught exceptions collected, no interaction.
- Build outputs: a two-file TypeScript project built with Vite 8.3.8 (default config with `base: "./"`), Vite with vite-plugin-singlefile 2.3.4, and esbuild 0.28.2 (`--bundle --format=iife`).
- Classic-script libraries: htm 3.1.1 (bundling Preact 10), alpinejs 3.17.5, vue 3.5.45, petite-vue 0.4.1, each rendering one reactive value; lit 3.3.3 and preact 11.2.0 inspected in `node_modules`.
- Node 24.16.0 for `node --test`; TypeScript 7.0.2 for `tsc --noEmit --allowJs --checkJs --target es2022 --lib es2022,dom`.
- The throwaway pages and scripts were not committed.
