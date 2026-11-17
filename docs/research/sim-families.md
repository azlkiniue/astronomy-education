# The 104 sims, sorted into families

Resolves [Sort the 104 sims into families](https://github.com/azlkiniue/astronomy-education/issues/5), a ticket on the map [Map: next-gen playbook for the 104 sims](https://github.com/azlkiniue/astronomy-education/issues/1). Written 2026-11-17 against `main` at `94832d2`.

A **family** groups sims by what the learner does with them and how they are built. It cuts across the catalog's 14 topics: a topic says what a sim is about, a family says what kind of thing it is.

## How the sorting was done

- Every one of the 104 files in `assets/js/sims/` (the 12 `_*.js` helpers excluded) was read through its header comment, its catalog title and description, the helpers its page loads, and counts of its controls, pointer handlers and animation loops. The code below each header was not read line by line.
- Each sim has exactly one family. Where a sim leans into a second kind, the **Also** column says so.
- **Distance from the Original** has three values. *Matches*: the same model, content and look. *Small departure*: one added display, a pointer convenience or a restyle, named in the row. *Richer*: the Original rebuild already teaches more than its Original. The value comes from each sim's own header and the maintainer's rebuild notes, not from a fresh comparison against the `.swf`.

## What stands out

- **Nine families cover all 104.** None is a catch-all. The largest is Orbit views (19), the smallest Films and timeline movies (4).
- **Five sims are already richer, not four.** `balloon` joins `gravalgebra`, `keplers_third`, `synodic-period` and `snellslaw`: its Original is a passive cartoon, and the rebuild adds a home galaxy, recession arrows and a velocity–distance plot. Four of the five are Formula calculators.
- **84 match their Original and 15 depart in a small way.**
- **Families follow topics only loosely.** Sky spheres and Geometry diagrams sit almost wholly in Coordinates and Sun & Seasons. Orbit views split between Moon & Eclipses and Orbits. Plot explorers and Scenes are spread over nine topics each.
- **Shared code lines up with three families.** `_celestialsphere.js` serves 9 of the 13 Sky spheres and 5 sims elsewhere. `_starfield.js` and `_vspdata.js` serve only the Measurement tools. `_filmframes.js` serves only the Films. Formula calculators share almost nothing. 50 sims load no helper at all.
- **Size varies more inside a family than between families.** Every family has a sim under 20 KB and one over 30 KB. The large ones are the NAAP lab simulators (`habitable-zone`, `gasRetentionSimulator`, `eclipsing-binary`, `kepler`, `variableStarPhotometryAnalyzer`) and sims that embed art or data (`lunarphasequizzer`, `parallax`, `clusterFittingExplorer`).
- **75 sims are dragged on the canvas and 62 animate.** Touch and reduced motion therefore matter in every family.

## Sims that fit their family poorly

- `lunarphasequizzer` is the only sim whose Original is itself a quiz: it hides the phase, the Moon's position or the Sun's direction and asks for it. It is built as an orbit view, so it sits there.
- `lunar_phaser` is a set of eight phase buttons over one Moon picture, closer to flashcards than to a scene. It is under Mechanism and analogy scenes for want of a better place.
- `em-spectrum` is a wavelength slider with read-outs and three photos per band. It is under Plot and spectrum explorers, but there is no curve to read.
- `habitable-zone` ties an orbit diagram to a stellar-evolution timeline, not to a light or velocity curve. It is the largest sim (83 KB).
- `telescope10` is an instrument diagram with an eyepiece view, driven only by lists. It is under Mechanism and analogy scenes.
- `zodiac` is a 3-D band of constellations round the Earth, not a sphere and not a flat diagram. It is under Geometry diagrams and maps.
- `basketball` and `moonphases` are orbit views that show photo sequences, so they share needs with the Films.
- Five sims use the sky-sphere engine from another family: `lunar-phases`, `radial-velocity`, `daylighthoursexplorer`, `fullmoondec` and `transitmovie`.
- `gasRetentionSimulator` and `hydrogen-atom` are full NAAP lab simulators filed under Mechanism and analogy scenes. They are far larger than the analogies beside them.

## Count per family

| Family | Sims | What the learner does | Median size | Shared helpers in use |
|---|---:|---|---:|---|
| **Sky spheres and globes** | 13 | A 3-D celestial sphere, horizon diagram or globe. The learner turns it and places the Sun, a star or an observer on it. | 22 KB | flashtext ×9, celestialsphere ×9, earth ×5 |
| **Geometry diagrams and maps** | 10 | A fixed-view cross-section, landscape or flat map. The learner sets an angle, a place or a date and reads the geometry. | 20 KB | earth ×3, flashtext ×3, swfshape ×1, obliquity-art ×1 |
| **Orbit views** | 19 | Bodies on orbits, seen from above or in 3-D and run by a clock. The learner plays, scrubs or drags a body and reads a phase or configuration. | 16 KB | flashtext ×5, earth ×2, swfshape ×2, celestialsphere ×1, lunarphases-art ×1, tidesim-art ×1 |
| **Orbit-and-curve simulators** | 8 | An orbiting system tied to a live plot: light curve, radial-velocity curve, pulse timing, timeline. | 24 KB | flashtext ×4, swfshape ×3, celestialsphere ×1, earth ×1 |
| **Formula calculators** | 13 | One equation with the numbers written in, beside a small diagram. The learner sets inputs and reads outputs. | 12 KB | flashtext ×1, swfshape ×1 |
| **Plot and spectrum explorers** | 16 | A graph, chart or spectrum is the stage. The learner moves a cursor or a parameter and reads the curve. | 17 KB | flashtext ×7, earth ×3, celestialsphere ×2, swfshape ×2 |
| **Measurement and fitting tools** | 8 | The learner works an image or a data set the way an astronomer would, to get a number. | 29 KB | starfield ×4, vspdata ×2, earth ×1, flashtext ×1, swfshape ×1 |
| **Mechanism and analogy scenes** | 13 | An animated scene that plays out one process or one everyday analogy, with a few knobs. | 22 KB | flashtext ×5, swfshape ×4, telescope-art ×1, drivingthroughsnow-art ×1 |
| **Films and timeline movies** | 4 | Real footage or a fixed frame-by-frame movie that the learner plays and scrubs. | 20 KB | flashtext ×2, filmframes ×2, celestialsphere ×1 |
| **Total** | 104 | | 18 KB | |

## Family by topic

| Family | General & Math | Coordinates | Sun & Seasons | Moon & Eclipses | Orbits | Light & Spectra | Telescopes | Sun & Solar System | Stars | Binary & Variable | Milky Way | Cosmology | Exoplanets | Atmospheres & Habitability |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Sky spheres and globes |  | 8 | 4 | 1 |  |  |  |  |  |  |  |  |  |  |
| Geometry diagrams and maps |  | 4 | 5 | 1 |  |  |  |  |  |  |  |  |  |  |
| Orbit views |  | 1 |  | 9 | 8 |  |  |  |  |  |  |  | 1 |  |
| Orbit-and-curve simulators |  |  |  |  |  | 1 |  |  |  | 2 |  |  | 4 | 1 |
| Formula calculators | 1 |  |  |  | 5 |  | 1 |  | 5 | 1 |  |  |  |  |
| Plot and spectrum explorers |  |  | 2 | 2 | 1 | 4 |  | 2 | 1 |  | 1 | 1 |  | 2 |
| Measurement and fitting tools |  |  |  |  |  |  |  |  | 1 | 4 |  | 3 |  |  |
| Mechanism and analogy scenes |  |  |  | 1 |  | 3 | 2 | 1 |  | 1 | 1 | 2 | 1 | 1 |
| Films and timeline movies |  |  | 1 |  |  | 1 |  | 2 |  |  |  |  |  |  |

## The 104 sims

Size is the sim's own file in `assets/js/sims/`. Controls counts the sidebar sliders, checkboxes, lists and buttons; `+drag` marks a sim that is also dragged on the canvas.

### Sky spheres and globes (13)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `altazimuth` | Azimuth/Altitude Demonstrator | Coordinates |  | flashtext, celestialsphere | 14 KB, 226 lines | 9 +drag | matches |
| `bigdipper` | Big Dipper 3D | Coordinates | own 3-D projection | – | 14 KB, 261 lines | 2 +drag | matches |
| `ce_hc` | Rotating Sky Explorer | Coordinates | two linked spheres | earth, flashtext, celestialsphere | 46 KB, 827 lines | 11 +drag | matches |
| `celestialhorizon` | Celestial and Horizon Systems Comparison | Coordinates | own sphere engine | earth | 27 KB, 526 lines | 2 +drag | matches |
| `heliacalrisingsim` | Heliacal Rising Simulator | Coordinates |  | flashtext, celestialsphere | 57 KB, 937 lines | 9 +drag | small departure: click the timeline to set the time; a circumpolar path is drawn whole |
| `longlat` | Longitude/Latitude Demonstrator | Coordinates | globe | earth | 20 KB, 393 lines | 7 +drag | matches |
| `positionsdemonstrator` | Moon Phases and the Horizon Diagram | Moon & Eclipses |  | flashtext, celestialsphere | 22 KB, 381 lines | 9 +drag | matches |
| `radecdemo` | Celestial-Equatorial (RA/Dec) Demonstrator | Coordinates |  | earth, flashtext, celestialsphere | 23 KB, 345 lines | 12 +drag | matches |
| `seasons_ecliptic` | Seasons and Ecliptic Simulator | Sun & Seasons | orbit view | earth | 48 KB, 915 lines | 10 +drag | matches |
| `siderealtimeandhourangledemo` | Sidereal Time and Hour Angle Demonstrator | Coordinates |  | flashtext, celestialsphere | 17 KB, 278 lines | 6 +drag | matches |
| `sun-motions` | Motions of the Sun Simulator | Sun & Seasons |  | flashtext, celestialsphere | 32 KB, 476 lines | 14 +drag | matches |
| `sunmotionsoverview` | Sun Motions Overview | Sun & Seasons |  | flashtext, celestialsphere | 14 KB, 236 lines | 2 +drag | matches |
| `sunpaths` | Paths of the Sun | Sun & Seasons |  | flashtext, celestialsphere | 16 KB, 240 lines | 3 +drag | matches |

### Geometry diagrams and maps (10)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `antipodesexplorer` | Antipodes Explorer | Coordinates | map and globe | flashtext | 20 KB, 370 lines | 3 +drag | matches |
| `daylightsimulator` | Daylight Simulator | Sun & Seasons | flat map | flashtext | 31 KB, 513 lines | 6 +drag | matches |
| `dipperclock` | Big Dipper Clock | Coordinates |  | earth | 24 KB, 473 lines | 5 +drag | matches |
| `horizon` | Sun's Position on Horizon | Sun & Seasons |  | earth | 14 KB, 282 lines | 4 | small departure: shadows are computed, not the Original's sprite frames |
| `latsim` | Declination Ranges Simulator | Coordinates |  | – | 19 KB, 366 lines | 2 +drag | matches |
| `meridaltdiagram` | Meridional Altitude Simulator | Coordinates |  | – | 23 KB, 438 lines | 5 +drag | matches |
| `obliquity` | Obliquity Simulator | Sun & Seasons |  | flashtext, swfshape, obliquity-art | 9 KB, 169 lines | 2 +drag | matches |
| `shadowsim` | Eclipse Shadow Simulator | Moon & Eclipses |  | – | 13 KB, 230 lines | 5 +drag | small departure: adds readouts naming the eclipse each body sees |
| `sunsrays` | Sun's Rays Simulator | Sun & Seasons |  | – | 12 KB, 218 lines | 3 | matches |
| `zodiac` | Ecliptic (Zodiac) Simulator | Sun & Seasons | 3-D band of constellations | earth | 26 KB, 487 lines | 7 +drag | matches |

### Orbit views (19)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `basketball` | Basketball Phases Simulator | Moon & Eclipses | film (79 photos) | flashtext | 31 KB, 470 lines | 6 +drag | small departure: click the orbit to move the eye; runs at the display's frame rate |
| `ca_extrasolarplanets_starwobble` | Influence of Planets on the Sun | Exoplanets |  | – | 12 KB, 188 lines | 3 | matches |
| `configurationssimulator` | Planetary Configurations Simulator | Orbits | three linked views | – | 38 KB, 715 lines | 10 +drag | matches |
| `kepler` | Planetary Orbit Simulator | Orbits | plots (third law, Newton) | flashtext, swfshape | 57 KB, 914 lines | 20 +drag | matches: control-only panels of the Original moved to the sidebar |
| `lunar-phases` | Lunar Phase Simulator | Moon & Eclipses | sky sphere | flashtext, celestialsphere, lunarphases-art | 51 KB, 851 lines | 9 +drag | matches |
| `lunarphasequizzer` | Lunar Phase Quizzer | Moon & Eclipses | quiz | flashtext | 76 KB, 735 lines | 3 +drag | matches |
| `marsorbit` | Ptolemaic Orbit of Mars | Orbits |  | – | 11 KB, 195 lines | 4 | matches |
| `moonbisector` | Moon Bisector Demo | Moon & Eclipses |  | earth | 34 KB, 631 lines | 11 +drag | matches |
| `mooninc` | Moon Inclination | Moon & Eclipses |  | – | 16 KB, 280 lines | 5 +drag | matches |
| `moonphases` | Three Views Simulator | Moon & Eclipses | film (59-frame Moon) | – | 16 KB, 262 lines | 4 | matches |
| `pathtracer` | Epicycles Demo | Orbits |  | – | 9 KB, 143 lines | 4 | matches |
| `phaseDemonstrator` | Phase Positions Demonstrator | Moon & Eclipses |  | – | 13 KB, 242 lines | 3 +drag | matches |
| `ptolemaic` | Ptolemaic System Simulator | Orbits |  | – | 18 KB, 309 lines | 17 | matches |
| `ptolemaicvenus` | Ptolemaic Phases of Venus | Orbits |  | – | 11 KB, 189 lines | 3 +drag | matches |
| `retrograde` | Retrograde Motion | Orbits |  | – | 13 KB, 213 lines | 6 | small departure: redrawn as one scene with a timeline scrubber |
| `siderealSolarTime` | Sidereal and Solar Time Simulator | Coordinates |  | earth | 24 KB, 464 lines | 17 +drag | matches |
| `synodiclag` | Synodic Lag | Moon & Eclipses |  | – | 10 KB, 189 lines | 6 | matches |
| `tidesim` | Tidal Bulge Simulation | Moon & Eclipses |  | flashtext, swfshape, tidesim-art | 12 KB, 215 lines | 4 +drag | small departure: runs at the display's frame rate and resumes where it stopped |
| `venusphases` | Phases of Venus | Orbits |  | – | 8 KB, 194 lines | 1 +drag | matches |

### Orbit-and-curve simulators (8)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `ca_extrasolarplanets_graph` | Radial Velocity Graph | Exoplanets |  | – | 10 KB, 194 lines | 1 | matches |
| `eclipsing-binary` | Eclipsing Binary Simulator | Binary & Variable | plot (HR window), data sets | flashtext, swfshape | 56 KB, 648 lines | 17 +drag | matches: control-only panels of the Original moved to the sidebar |
| `exoplanet-transit` | Exoplanet Transit Simulator | Exoplanets |  | flashtext | 34 KB, 479 lines | 10 +drag | matches: control-only panels of the Original moved to the sidebar |
| `habitable-zone` | Circumstellar Habitable Zone Simulator | Atmospheres & Habitability | plot (HR diagram, timeline) | flashtext, swfshape | 83 KB, 735 lines | 9 +drag | matches: control-only panels of the Original moved to the sidebar |
| `lightcurve` | Lightcurve Simulator | Binary & Variable |  | – | 14 KB, 368 lines | 3 | matches |
| `pulsarperiodsim001` | Pulsar Period Simulator | Exoplanets | plot (pulse intervals) | earth | 14 KB, 265 lines | 4 | small departure: pulses coloured red/blue, not the Original's yellow–cyan |
| `radial-velocity` | Exoplanet Radial Velocity Simulator | Exoplanets | sky sphere (3-D view) | flashtext, swfshape, celestialsphere | 36 KB, 510 lines | 13 +drag | matches: control-only panels of the Original moved to the sidebar |
| `radialvelocitydemo` | Extrasolar Planet Radial Velocity Demonstrator | Light & Spectra | spectrum, no curve | – | 12 KB, 193 lines | 2 | matches |

### Formula calculators (13)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `center-of-mass` | Center of Mass Simulator | Binary & Variable | orbit view | – | 12 KB, 182 lines | 7 +drag | small departure: adds an "animate as orbit" mode |
| `ellipsedemo` | Eccentricity Demonstrator | Orbits |  | – | 10 KB, 178 lines | 3 +drag | matches |
| `flux-inverse-square` | Flux Simulator | Stars |  | – | 10 KB, 174 lines | 4 +drag | matches |
| `gravalgebra` | Gravity Algebra | Orbits | quiz (added) | – | 59 KB, 1016 lines | 5 +drag | richer: scene, force line and predict/target games around the Original's calculation |
| `gravcalc` | Newton's Law of Gravity Calculator | Orbits |  | – | 16 KB, 254 lines | 4 +drag | matches |
| `keplers_third` | Kepler's Third Law | Orbits | plot | – | 12 KB, 224 lines | 3 +drag | richer: log–log plot with the planets and a draggable marker; the Original is two number boxes |
| `parallaxdiag` | Parallax Calculator | Stars |  | – | 16 KB, 301 lines | 2 | matches |
| `small-angle` | Small-Angle Approximation Demonstrator | General & Math |  | flashtext, swfshape | 38 KB, 313 lines | 5 +drag | matches: control-only panels of the Original moved to the sidebar |
| `snellslaw` | Snell's Law Demonstrator | Telescopes |  | – | 13 KB, 220 lines | 5 +drag | richer: draggable ray diagram |
| `stellarlum` | Stellar Luminosity Calculator | Stars |  | – | 12 KB, 220 lines | 2 | matches |
| `stellarmag` | Distance Modulus Explorer | Stars |  | – | 11 KB, 187 lines | 4 | matches |
| `stellarvel` | Stellar Velocity Calculator | Stars |  | – | 11 KB, 201 lines | 3 | matches |
| `synodic-period` | Synodic Period Calculator | Orbits | orbit view | – | 14 KB, 200 lines | 7 | richer: orbit animation added to the calculator |

### Plot and spectrum explorers (16)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `blackbody` | Blackbody Curves and Filters Explorer | Light & Spectra |  | flashtext, swfshape | 42 KB, 571 lines | 11 +drag | matches: control-only panels of the Original moved to the sidebar |
| `daylighthoursexplorer` | Daylight Hours Explorer | Sun & Seasons | sky sphere (globe) | earth, flashtext, celestialsphere | 37 KB, 631 lines | 5 +drag | matches |
| `earthorbitplot` | Earth Orbit Plot | Orbits |  | earth | 17 KB, 296 lines | 6 +drag | matches |
| `eclipsetable` | Eclipse Table | Moon & Eclipses |  | flashtext | 28 KB, 364 lines | 3 +drag | matches |
| `em-spectrum` | EM Spectrum Module | Light & Spectra | picture browser | – | 15 KB, 219 lines | 2 +drag | small departure: kept in the site's dark style, laid out like the Original |
| `filters` | Light and Filters Simulator | Light & Spectra | optical bench | – | 38 KB, 725 lines | 14 +drag | matches |
| `formationtemps` | Planet Formation Temperatures Plot | Sun & Solar System |  | flashtext | 17 KB, 249 lines | 1 | matches |
| `fullmoondec` | Full Moon Declination Simulator | Moon & Eclipses | sky sphere | flashtext, celestialsphere | 15 KB, 257 lines | 3 +drag | matches |
| `galacticredshift` | Galactic Redshift Simulator | Cosmology |  | – | 13 KB, 239 lines | 3 | matches |
| `gasRetentionPlot` | Gas Retention Plot | Atmospheres & Habitability |  | – | 20 KB, 339 lines | 6 +drag | matches |
| `hr-diagram` | Hertzsprung-Russell Diagram Explorer | Stars | star size comparison | flashtext, swfshape | 43 KB, 553 lines | 10 +drag | matches: control-only panels of the Original moved to the sidebar |
| `milkyWayHabitability` | Milky Way Habitability Explorer | Atmospheres & Habitability |  | flashtext | 18 KB, 325 lines | 3 +drag | small departure: drag the ring or click a graph to set the radius; new explainer text |
| `milkywayrotationalvelocity` | Milky Way Rotational Velocity | Milky Way |  | – | 16 KB, 290 lines | 1 +drag | matches |
| `seasonsim` | Ecliptic Simulator | Sun & Seasons |  | – | 12 KB, 204 lines | 4 | small departure: curve drawn at one continuous rate; the Original has a step at day 186 |
| `solarsystemproperties` | Solar System Properties Explorer | Sun & Solar System |  | – | 12 KB, 194 lines | 2 | matches: leaves out rotation-period data that the Original hides too |
| `spectrum010` | Spectrum Explorer | Light & Spectra |  | earth | 16 KB, 285 lines | 7 | matches |

### Measurement and fitting tools (8)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `blinkcomparatorsimulator` | Blink Comparator Simulator | Binary & Variable | image tool | starfield, vspdata | 14 KB, 275 lines | 9 +drag | matches |
| `clusterFittingExplorer` | HR Diagram Star Cluster Fitting Explorer | Cosmology | plot (HR diagram) | – | 45 KB, 625 lines | 4 +drag | matches |
| `parallax` | Parallax Explorer | Cosmology | map and view | flashtext, swfshape | 59 KB, 275 lines | 6 +drag | matches: control-only panels of the Original moved to the sidebar |
| `photometrysimulator` | Photometry Simulator | Binary & Variable | image tool | starfield | 20 KB, 385 lines | 4 +drag | matches |
| `registrationsimulator` | Registration Simulator | Binary & Variable | image tool | starfield | 14 KB, 257 lines | 7 +drag | matches |
| `snCurveExplorer` | Supernova Light Curve Fitting Explorer | Cosmology | plot (light curve) | – | 25 KB, 290 lines | 5 +drag | matches |
| `spectroparallax` | Spectroscopic Parallax Simulator | Stars | spectrum, HR plot | earth | 32 KB, 626 lines | 4 +drag | matches |
| `variableStarPhotometryAnalyzer` | Variable Star Photometry Analyzer | Binary & Variable | plot (light curve, folding) | starfield, vspdata | 59 KB, 905 lines | 1 +drag | matches |

### Mechanism and analogy scenes (13)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `balloon` | Balloon Universe | Cosmology |  | – | 13 KB, 212 lines | 7 +drag | richer (not on the map's list): the Original is a passive cartoon; the rebuild adds a home galaxy, recession arrows and a velocity–distance plot |
| `buckets` | CCD Simulator | Telescopes |  | – | 22 KB, 420 lines | 3 +drag | matches |
| `dopplershift` | Doppler Shift Demonstrator | Light & Spectra |  | flashtext, swfshape | 25 KB, 426 lines | 5 +drag | matches: control-only panels of the Original moved to the sidebar |
| `drivingthroughsnow` | Driving Through Snow | Sun & Solar System |  | drivingthroughsnow-art | 16 KB, 296 lines | 7 | matches |
| `gasRetentionSimulator` | Gas Retention Simulator | Atmospheres & Habitability | plot (Maxwell curve) | flashtext | 60 KB, 1100 lines | 10 +drag | small departure: click the plot to move the cursor |
| `hammerthrower` | Hammer Thrower Comparison | Exoplanets | orbit view | – | 14 KB, 276 lines | 2 | small departure: the Original's video is replaced by a drawn athlete |
| `hydrogen-atom` | Hydrogen Atom Simulator | Light & Spectra |  | flashtext, swfshape | 53 KB, 701 lines | 4 +drag | matches: control-only panels of the Original moved to the sidebar |
| `lookbacktimesim` | Lookback Time Simulator | Cosmology | timeline | flashtext, swfshape | 45 KB, 438 lines | 4 +drag | matches: control-only panels of the Original moved to the sidebar |
| `lunar_phaser` | Lunar Phase Vocabulary | Moon & Eclipses |  | – | 11 KB, 188 lines | 2 | small departure: the Original's portrait layout is laid on its side |
| `telescope10` | Telescope Simulator | Telescopes |  | flashtext, swfshape, telescope-art | 24 KB, 412 lines | 4 +drag | matches |
| `threeviewsspectra` | Three Views Spectrum Demonstrator | Light & Spectra |  | – | 18 KB, 324 lines | 1 +drag | matches |
| `trafficdensity` | Traffic Density Analogy | Milky Way |  | – | 24 KB, 493 lines | 4 | small departure: adds a density strip under the road |
| `wagonwheel` | Aliasing in Wagon Wheels | Binary & Variable |  | – | 18 KB, 348 lines | 3 +drag | matches |

### Films and timeline movies (4)

| Sim | Title | Topic | Also | Helpers | Size | Controls | Distance from the Original |
|---|---|---|---|---|---:|---|---|
| `fusion01` | Proton-Proton Animation | Sun & Solar System |  | – | 17 KB, 332 lines | 3 | matches: the Original is a timeline movie with no model, redrawn step by step |
| `fusion02` | CNO Cycle Animation | Sun & Solar System |  | – | 18 KB, 357 lines | 3 | matches: the Original is a timeline movie with no model, redrawn step by step |
| `meltednail` | Blackbody Curves of Melting | Light & Spectra | plot (blackbody curve) | flashtext, filmframes | 22 KB, 400 lines | 3 +drag | matches |
| `transitmovie` | Union Seasons Demonstrator | Sun & Seasons | sky sphere | flashtext, filmframes, celestialsphere | 56 KB, 783 lines | 7 +drag | matches |
