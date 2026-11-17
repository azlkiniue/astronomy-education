# What teaching material shipped with the Originals?

Research note for issue #3. It inventories the teaching material in the UNL site download (`astroUNL/`, gitignored, mirrored from astro.unl.edu on 19 July 2014) and measures how much of it speaks about each of the 104 sims.

Everything here is inventory and paraphrase. Nothing from the UNL material is reproduced, apart from one six-word quote in the design-intent section. Paths are relative to `astroUNL/`.

## Answer in brief

- Three families of material shipped: **NAAP lab packages** (student guides, background pages, instructor pages, demonstration guides, worksheets, tests), the **ClassAction classroom kit** (519 projected questions, instructor manuals, outlines, tables, images) and a set of **ranking tasks**. The two top-level documents add almost nothing.
- Every one of the 104 sims has a one-sentence description. **77 have something more**; **27 have only the sentence**.
- Depth is very uneven. **50 sims** have a written document that tells a student or instructor what to do with them. **27 more** are only pointed at, by a question link or by a NAAP background page that embeds them.
- The well-covered areas are coordinates and the sky, lunar phases, orbits, stellar properties, binaries and all 15 NAAP labs. The thin areas are light and spectra (outside NAAP), telescopes, the Sun, cosmology, solar system characteristics and most extrasolar-planet demonstrators.
- NAAP guides ask students to tour the controls, predict then check, measure and tabulate, change one variable and describe the effect, and reason about what can be detected. ClassAction questions ask a class to pick an answer from a diagram, graph or short animation, then vote and discuss.
- The authors state their intent plainly. ClassAction sims are feedback tools for an instructor running peer instruction; NAAP sims are the centre of a guided lab. Neither was designed for a student exploring alone without a guide.

## Kinds and formats of material

Whole download: 1,232 html, 810 swf, 410 jpg, 296 png, 108 pdf, 63 doc, 38 xml, 14 txt, 3 ppt, 1 docx, 1 xls. By directory: `classaction/` 1,951 files, `naap/` 794, `interactives/` 282, `mobile/` 31.

### NAAP lab packages (`naap/<lab>/`, `naap/assessment/`, `naap/help/`)

Fifteen labs hold catalog sims. A sixteenth, Scale Height, is an HTML5 lab with a student guide but no catalog sim.

| Kind | Count | Format | What it is |
|---|---|---|---|
| Student guide | 15 current, 4 superseded | PDF and Word | A worksheet a student fills in while working through the lab. Usually opens with questions on the background reading, then a tour of the simulator panels, then numbered exercises with tables and blanks. |
| Background pages | 66 | HTML, many with a small embedded applet | The reading a student does before the simulator: definitions, formulas, diagrams. |
| Lab landing page | 15 | HTML | One-paragraph description, links to the guide, background pages and simulators. |
| Pedagogical objectives page | 12 | HTML | A list of what a student should understand or be able to do after the lab, grouped by concept. |
| Instructor page | 12 | HTML | Description, links to documents, where the lab fits in a course, prerequisites, and a list of the simplifications built into the simulator. |
| Classroom demonstration guide | 7 | PDF and Word | A two-column script: steps the instructor performs in the simulator, paired with questions to ask the class and the expected answers. |
| In-class worksheet | 3 labs, student and instructor versions | PDF and Word | Paper tasks students do while the instructor drives the simulator. The instructor version adds the simulator steps. |
| Pretest and posttest | 10 labs | PDF and Word | Short multiple-choice tests. |
| Test bank | 14 files, 13 distinct | Plain text in the format of the EDU homework system | Roughly 200 question templates grouped by topic, many with randomised parameters. The online version was withdrawn in 2009 for licensing reasons; these files and the paper tests remain. |
| Technical manual | 2, plus 1 stub | PDF and Word | How the simulator's controls and constraints behave where that is not obvious. |
| Site-level help | 4 pages | HTML | General overview, instructor overview, lab descriptions, assessment notice. |

What each lab has:

| Lab | Catalog sims | Guide | Background pages | Objectives and instructor page | Demo guide | Worksheet | Pre/post test | Test bank |
|---|---|---|---|---|---|---|---|---|
| Solar System Models | 2 | yes | 6 | yes | | | yes | yes |
| Basic Coordinates and Seasons | 1 | yes | 7 | yes | yes | yes | yes | yes |
| The Rotating Sky | 1 | yes | 4 | yes | yes | | yes | yes |
| Motions of the Sun | 2 | yes | 4 | yes | yes | | yes | yes |
| Planetary Orbit Simulator | 1 | yes | 2 | yes | yes | | yes | yes |
| Lunar Phase Simulator | 3 | yes | 6 | yes | yes | yes | yes | yes |
| Blackbody Curves and UBV Filters | 2 | yes | 3 | yes | | | yes | yes |
| Hydrogen Energy Levels | 1 | yes | 4 | yes | | | yes | yes |
| Hertzsprung-Russell Diagram | 1 | yes | 3 | yes | | | | |
| Eclipsing Binary Simulator | 1 | yes | 4 | yes | yes | | yes | |
| Atmospheric Retention | 2 | yes | 4 | yes | yes | yes | yes | yes |
| Extrasolar Planets | 2 | yes | 4 | yes | | | | |
| Variable Star Photometry | 4 | yes | 3 | | | | | |
| Cosmic Distance Ladder | 4 | yes | 9 | | | | | |
| Habitable Zones | 2 | yes | 3 | | | | | |

The three newest labs (Variable Star Photometry, Cosmic Distance Ladder, Habitable Zones) have a guide and background pages only.

### ClassAction classroom kit (`classaction/`)

| Kind | Count | Format | What it is |
|---|---|---|---|
| Questions | 519 | One SWF each, with an HTML wrapper, in 23 module folders | A projected question. Most can be switched between several variants of the same question by the instructor, and some can reveal a hint or the answer. |
| Question bank | 1 file, 4 dated backups | XML (`questions/questions.xml`) | One record per question: name, a one- or two-sentence description of what the student is shown and asked, keywords, type, and lists of relevant animations, images, outlines and tables. |
| Module specifications | 24 | XML (`<module>.xml`) | Which questions, animations, images, outlines and tables belong to a module. |
| Animation list | 93 records | XML (`animations/animations.xml`) | Name and one-sentence description of each sim. The same sentences appear on the simulations list page and in the catalog. |
| Instructor's manuals | 3 | Word and PDF, roughly 45 to 60 pages each | Coordinates and Motions, Lunar Cycles, Stellar Properties. See below. |
| Overview, Classroom Usage Guidelines, Literature Review | 3 | Word and PDF, a few pages each | The authors' account of why and how to use the kit. |
| Outlines | 101 | JPG slides with HTML wrappers; 3 PowerPoint decks | One-page primers on a topic, meant as handouts. |
| Tables | 11 | JPG with HTML wrappers, 1 spreadsheet | Reference data such as unit prefixes, lookback times, distance modulus. |
| Images | 57 pages, 112 JPGs | JPG with HTML wrappers | Textbook figures, credited to a commercial publisher. |
| Project pages | 5 | HTML (`mainfiles/`) | Overview, pedagogy, how to use, PowerPoint import, one module page. |

Question types in the bank: 14 warm-up, 388 general, 84 challenge, 33 discussion.

The three manuals cover 60 questions and 25 animations between them. A question entry gives the key concept, secondary concepts, a description, the answer with its reasoning for each variant, teaching suggestions (which animations, images and outlines to show) and a difficulty from 1 to 5. Most are rated 2 to 4. An animation entry gives the sim's main purpose, what the display shows and what each control does. These 25 entries are the only place in the kit where a ClassAction sim is described at more than one sentence.

Gaps in the bank itself: 39 of the 519 descriptions are placeholders (mostly in the solar system, extrasolar planets and cosmology modules), and only 91 questions name a relevant animation.

### Ranking tasks (`interactives/`)

46 one-page paper tasks (PDF) and about 85 computer versions (SWF) across some 15 topics, by a three-university collaboration. Each shows several labelled situations and asks the student to rank them by a quantity, or say they are all equal, and explain why. They are tied to topics, not to particular sims, so they are not counted in the coverage below.

### The two top-level documents and `about.html`

- `Ruckman2012.pdf` is a one-page flyer for a public lecture. It is not teaching material.
- `Sims3.docx` is a short workshop handout listing simulation collections on the web, with a few references on teaching with simulations. Its one line on the UNL sims says they serve student labs or feedback during peer instruction.
- `about.html` is two sentences naming the group and its director.

## Coverage of the 104 sims

### How coverage was counted

A sim can be covered at five levels beyond its one-sentence description:

- **Guide**: a NAAP student guide has exercises that name and use the sim.
- **NAAP page**: a NAAP lab landing page or background page links or embeds the sim.
- **Linked question**: at least one ClassAction question lists the sim as a relevant animation in the question bank.
- **Manual**: a ClassAction instructor's manual has an entry describing the sim.
- **Demo / worksheet**: a NAAP classroom demonstration guide or in-class worksheet is built around the sim.

Question links and NAAP page links were computed from the files (XML records; SWF references in page source matched to catalog SWFs). Guide, manual and demo flags were set by reading.

### Totals

| Level | Sims (of 104) |
|---|---|
| One-sentence description | 104 |
| Any deeper material | 77 |
| A document written about how to use it (guide, manual or demo guide) | 50 |
| Only pointed at (question link, NAAP page, or both) | 27 |
| Description only | 27 |

By kind: guide 30, NAAP page 43, linked question 46, manual 24, demo or worksheet 8. The 91 linking questions carry 94 links.

### Coverage by module

Rows are catalog modules, so a sim listed in two modules is counted in both; the last row counts each sim once. "CA" is ClassAction. The number of questions is the module's whole question list, whether or not the questions link to a sim.

| Module | Entries | Guide | NAAP page | Linked question | Manual | Demo / worksheet | Any | Blurb only |
|---|---|---|---|---|---|---|---|---|
| CA: Introductory Concepts (18 questions) | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |
| CA: Basic Motions & Ancient Astronomy (15 questions) | 3 | 0 | 0 | 3 | 0 | 0 | 3 | 0 |
| CA: Coordinates and Motions (49 questions) | 23 | 6 | 10 | 18 | 11 | 3 | 21 | 2 |
| CA: Lunar Cycles (27 questions) | 14 | 2 | 4 | 10 | 7 | 1 | 12 | 2 |
| CA: Renaissance Astronomy (40 questions) | 13 | 3 | 4 | 8 | 0 | 1 | 9 | 4 |
| CA: Light & Spectra (44 questions) | 9 | 3 | 3 | 0 | 0 | 0 | 3 | 6 |
| CA: Telescopes and Astronomical Instruments (15 questions) | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| CA: Sun and Solar Energy (21 questions) | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| CA: Stellar Properties (21 questions) | 7 | 2 | 4 | 0 | 6 | 0 | 7 | 0 |
| CA: Binary and Variable Stars (28 questions) | 4 | 1 | 3 | 4 | 0 | 1 | 4 | 0 |
| CA: Milky Way Galaxy (17 questions) | 2 | 0 | 0 | 1 | 0 | 0 | 1 | 1 |
| CA: Cosmology (17 questions) | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| CA: Solar System Characteristics (22 questions) | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| CA: ExtraSolar Planets (28 questions) | 8 | 2 | 3 | 0 | 0 | 0 | 3 | 5 |
| CA: Solar System Debris (27 questions) | 3 | 2 | 2 | 3 | 0 | 1 | 3 | 0 |
| CA: 200 Level (4 questions) | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 0 |
| NAAP: Solar System Models | 2 | 1 | 2 | 1 | 0 | 0 | 2 | 0 |
| NAAP: Basic Coordinates and Seasons | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 0 |
| NAAP: The Rotating Sky | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 0 |
| NAAP: Motions of the Sun | 2 | 1 | 2 | 1 | 1 | 1 | 2 | 0 |
| NAAP: Planetary Orbit Simulator | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 0 |
| NAAP: Lunar Phase Simulator | 3 | 2 | 3 | 2 | 1 | 1 | 3 | 0 |
| NAAP: Blackbody Curves and UBV Filters | 2 | 2 | 2 | 0 | 0 | 0 | 2 | 0 |
| NAAP: Hydrogen Energy Levels | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 0 |
| NAAP: Hertzsprung-Russell Diagram | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 0 |
| NAAP: Eclipsing Binary Simulator | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 0 |
| NAAP: Atmospheric Retention | 2 | 2 | 2 | 0 | 0 | 2 | 2 | 0 |
| NAAP: Extrasolar Planets | 2 | 2 | 2 | 0 | 0 | 0 | 2 | 0 |
| NAAP: Variable Star Photometry | 4 | 4 | 4 | 0 | 0 | 0 | 4 | 0 |
| NAAP: Cosmic Distance Ladder | 4 | 4 | 4 | 0 | 1 | 0 | 4 | 0 |
| NAAP: Habitable Zones | 2 | 2 | 2 | 0 | 0 | 0 | 2 | 0 |
| **All 126 entries** | 126 | | | | | | 97 | 29 |
| **104 unique sims** | 104 | 30 | 43 | 46 | 24 | 8 | 77 | 27 |

What the table shows:

- Every NAAP lab sim is covered, most of them by a guide.
- Question links are concentrated in six modules: introductory concepts, ancient astronomy, coordinates, lunar cycles, Renaissance astronomy and binaries, with one more each in Milky Way and debris. In Light & Spectra, Telescopes, Sun and Solar Energy, Stellar Properties, Cosmology, Solar System Characteristics and ExtraSolar Planets no question names a sim, although those modules have 15 to 44 questions each on the same topics.
- The Stellar Properties sims have no question links but are all described in their instructor's manual.

### Sims with no material beyond the one-sentence description (27)

Coordinates and Motions:
- `horizon` (Sun's Position on Horizon)
- `bigdipper` (Big Dipper 3D)

Lunar Cycles:
- `synodiclag` (Synodic Lag)
- `lunarphasequizzer` (Lunar Phase Quizzer)

Renaissance Astronomy:
- `marsorbit` (Ptolemaic Orbit of Mars)
- `pathtracer` (Epicycles Demo)
- `retrograde` (Retrograde Motion)
- `keplers_third` (Kepler's Third Law)

Light & Spectra (two of these are also listed under ExtraSolar Planets):
- `meltednail` (Blackbody Curves of Melting)
- `spectrum010` (Spectrum Explorer)
- `em-spectrum` (EM Spectrum Module)
- `threeviewsspectra` (Three Views Spectrum Demonstrator)
- `radialvelocitydemo` (Extrasolar Planet Radial Velocity Demonstrator)
- `dopplershift` (Doppler Shift Demonstrator)

Telescopes and Astronomical Instruments:
- `telescope10` (Telescope Simulator)
- `buckets` (CCD Simulator)
- `snellslaw` (Snell's Law Demonstrator)

Sun and Solar Energy:
- `fusion01` (Proton-Proton Animation)
- `fusion02` (CNO Cycle Animation)

Milky Way Galaxy:
- `trafficdensity` (Traffic Density Analogy)

Cosmology:
- `balloon` (Balloon Universe)
- `galacticredshift` (Galactic Redshift Simulator)

Solar System Characteristics:
- `formationtemps` (Planet Formation Temperatures Plot)
- `solarsystemproperties` (Solar System Properties Explorer)

ExtraSolar Planets:
- `ca_extrasolarplanets_graph` (Radial Velocity Graph)
- `pulsarperiodsim001` (Pulsar Period Simulator)
- `hammerthrower` (Hammer Thrower Comparison)

For these the modules still hold topic questions, and in the ClassAction browser any animation in a module can be shown alongside any question in that module. But no document says which question a sim answers or what a student should take from it.

## What the material asks students to do with a sim

### NAAP student guides: a guided lab on paper

The guides follow one pattern, and the same handful of task types recur.

- **Check the reading first.** Most guides open with questions on the background pages before the sim is opened. The lunar guide starts with multiple-choice items aimed at common wrong ideas about the far side of the Moon and the cause of phases.
- **Tour the controls.** A bulleted walk through each panel and what can be dragged, so the student knows the instrument before using it.
- **Predict, then check.** The Rotating Sky guide asks for the horizon coordinates of named points to be worked out first and then confirmed by dragging a star there. The coordinates guide does the same with map locations, and the Motions of the Sun guide asks for meridian altitudes to be solved by hand before the explorer is used to confirm them.
- **Measure and tabulate, then find the trend.** In Solar System Models the student times how long each planet takes to return to the same configuration, records the values, converts them to orbital periods and states how period depends on distance. In Habitable Zones the student records the inner and outer edge of the zone for stars of seven masses and draws a conclusion about location and width.
- **Change one variable and describe the effect.** The extrasolar planets guide starts from a preset system and has the student change planet mass, star mass, orbit size and tilt one at a time, describing what happens to the velocity curve each time. The eclipsing binary guide steps through presets that each differ from the previous one in a single property.
- **Decide what an observer could detect.** With simulated noise switched on, the student judges whether a planet's signal could be recovered, then fills in a table of systems as detectable, not detectable or marginal, with the reason.
- **Fit real data.** The eclipsing binary guide ends with real light curves where some parameters are left for the student to find by matching the model to the data. The distance ladder guide has the student slide a cluster's main sequence onto a reference one and read off the distance.
- **Carry out a procedure.** Variable Star Photometry walks through an observer's workflow across four sims: align images, blink them to find the variables, measure brightness in apertures, then analyse the light curve.
- **Draw on the page.** Shade the lit half and the visible half of the Moon; mark where the Moon will be two days later; draw the Sun's three seasonal paths on a blank horizon diagram; sketch a velocity curve.
- **Move the viewpoint.** Redo the planetary configurations as seen from Mars; consider an icy moon orbiting a planet inside another star's habitable zone.

### NAAP demonstration guides and in-class worksheets

The demonstration guides turn a sim into a scripted class conversation. Each simulator step is paired with a question for the class, some of them asking what will happen before the instructor makes the change. The worksheets give students something to mark on paper at each step. One worksheet ends by asking students to devise their own procedure for answering a question with the simulator before the instructor works through it.

### ClassAction questions: pick, vote, discuss

Read from the 519 descriptions in the question bank, the dominant form is a multiple-choice question about something shown on screen. Nearly half of the descriptions say the student must determine something from what is shown. Representative shapes, paraphrased:

- **Spot the error.** A warm-up shows an animated star or Sun path and asks whether the motion is physically possible.
- **Read a display backwards.** From star-trail animations, work out the hemisphere and the direction the observer faces. From the Sun's position on a graph of the ecliptic, work out the date.
- **Interpret a graph.** From an eclipsing binary light curve, say how the two stars compare in size and temperature. Choose which of four graphs correctly relates orbital speed to distance.
- **Apply a relation.** Given declinations and latitudes, find the altitude at which stars cross the meridian.
- **Everyday analogy.** Compare the eccentricity of familiar objects; a desert-island rain-collecting question stands in for light-gathering power.
- **Open discussion.** A few questions per module have no vote: what seasons would be like on a planet tipped on its side, or what phases would look like from the pole.

Most questions come in several variants so the instructor can re-ask the same idea with different numbers or a different case. The manuals record between 4 and 8 variants for the questions sampled. Sims appear in this kit as the thing the instructor opens after the vote, to give a hint or to show why an answer is right.

### Ranking tasks

Rank five labelled situations by a quantity, with an explicit option to say they are all equal, and write the reasoning.

## The authors' stated design intent

### ClassAction

Sources: `classaction/mainfiles/overview.html`, `pedagogy.html`, `usage.html`, and the Overview, Classroom Usage Guidelines and Literature Review documents in `classaction/manuals/`.

- **Purpose.** Material for interactive lectures in large introductory courses, at college or advanced high-school level. Questions are projected, students answer by voting or discussion, and the instructor uses the bundled resources to respond.
- **Role of the sims.** The usage guidelines give animations three jobs: offer a hint for a question, explain or reinforce an answer, and confront a common misconception. They are instructor-driven feedback tools.
- **Four stated beliefs.** Astronomy is visual, so questions are built on images, diagrams, data and animations. "Students learn through feedback and iteration" (pedagogy page), so most questions can be re-asked in a slightly different form after instruction. Science teaching should be practical, so concepts are tied to everyday experience and to what students can observe. Misconceptions are widespread and stubborn, with no quick cure, so the kit supplies questions that expose them and resources to argue against them.
- **Two design principles.** Provide more material, across a wider range of difficulty, than any one instructor will use, and err toward including too much. Make it convenient, because instructors have little time to build their own.
- **Question ladder.** Warm-ups are single-concept ice-breakers shown as students arrive. General questions test one or two concepts in the context in which they were taught. Challenge questions combine two to four concepts in an unfamiliar context. Discussion questions have no simple answer and are worked in groups.
- **Research base.** The literature review rests the approach on studies showing that lecture alone produces small conceptual gains and that interactive engagement roughly doubles them, on peer instruction, and on findings that learners need their prior ideas challenged, repeated exposure, and practice reflecting on their own understanding. The authors single out the last of these as what the adaptable questions are meant to support.

### NAAP

Sources: `naap/index.html`, `naap/help/general_overview.html`, `instructor_overview.html`, `descriptions.html`, and each lab's objectives and instructor pages.

- **Purpose.** Online laboratories for introductory undergraduate astronomy. A lab is background reading, one or more simulators and a student guide, with tests before and after to measure learning.
- **Intended sequence.** Read the background pages, print the guide, follow the guide. The guide is described as the way a student first meets a simulator: questions on the reading, prompts that steer exploration of what the simulator can do, and questions that consolidate understanding.
- **Flexibility.** Guides are supplied in an editable format so instructors can change them. Demonstration guides and worksheets exist so that an instructor can use a simulator in class without assigning the lab.
- **Objectives stated per lab.** Twelve labs list what a student should understand or be able to do afterwards. Examples in paraphrase: estimate where the centre of mass lies from two masses; tell from a light curve whether an eclipse is total or partial; give the phase of the Moon that crosses the meridian at a given time; show that orbital period does not depend on eccentricity.
- **Honesty about the model.** Each instructor page lists what the simulator simplifies or leaves out, and the instructor overview warns that a simplification can itself plant a misconception. Examples: the lunar simulator loops one day with Sun and Moon on the celestial equator, and its Moon orbit is not to scale; the orbit simulator ignores orbital tilt and draws planets at arbitrary sizes; the eclipsing binary simulator treats stars as uniform discs.
- **Open access.** The simulators are described as freely usable outside a course.

### Ranking tasks and the handout

The ranking tasks are presented as formative assessment: the paper versions for class or homework, the computer versions for students working outside class and for distance courses. The `Sims3.docx` handout treats simulations as a teaching method with its own research literature and lists the UNL collection among others.

## What this offers the Next-gen sims

- **Learning goals are already written for 12 labs.** The objectives pages can seed the "what this sim teaches" statement for the sims those labs use.
- **The guides are ready-made challenge sequences.** Predict then check, vary one thing, measure and find the trend, and judge detectability all translate directly into challenges a solo student can attempt in the sim, with the sim itself confirming the answer.
- **The simplification lists are a head start on "what the model leaves out"**, which a Next-gen sim must keep true to the Original's model while being candid about it.
- **The question bank is a large pool of challenge ideas, but only 91 of 519 questions are tied to a sim**, and most assume an instructor and a room. Matching the rest to sims is new work.
- **27 sims need their teaching purpose written from scratch**, from the Original itself and the one-sentence description.
- **The whole design assumed a guide beside the sim**: a paper guide in NAAP, an instructor in ClassAction. Building that guidance into the sim is the main thing the Next-gen versions add.

Reuse limits were not established here. Two pages in the download state that non-profit educational use is permitted with few restrictions, but the usage-guidelines page they point to is not in the mirror, and the ClassAction images and tables are credited to a commercial publisher. Treat the material as a source of ideas to paraphrase, as this note does.

## How this was sampled, and what was not read

Parsed in full by script:
- `classaction/questions/questions.xml` (all 519 records), `animations/animations.xml`, `outlines/outlines.xml`, `tables/tables.xml` and all 24 module XML files.
- SWF references in every NAAP lab HTML page, matched to catalog SWFs.
- The catalog (`assets/js/catalog-data.js`), for the 126 entries and 104 unique sims.

Read in full:
- ClassAction Overview, Classroom Usage Guidelines and Literature Review documents; the overview, pedagogy, how-to-use, PowerPoint and v2 pages.
- NAAP general overview, instructor overview, lab descriptions and assessment notice; all 12 objectives pages; 5 instructor pages (lunar phases, eclipsing binaries, planetary orbits, coordinates and seasons, hydrogen).
- Student guides for Lunar Phase Simulator, Solar System Models and Extrasolar Planets.
- The eclipsing binary technical manual, `Sims3.docx`, `Ruckman2012.pdf`, `about.html`, the ranking-task index and two ranking tasks.

Read in part:
- Student guides for the distance ladder, habitable zones, coordinates and seasons, rotating sky, motions of the Sun, atmospheric retention, eclipsing binaries, variable star photometry and hydrogen (opening third to half of each). The blackbody and HR diagram guides were only searched for sim names.
- The Coordinates and Motions manual: contents, the first questions and most of the animation section. The Lunar Cycles and Stellar Properties manuals: contents and entry counts only.
- The planetary orbits demonstration guide and the atmospheric retention instructor worksheet; the other demonstration guides and worksheets by their opening lines.
- About 60 question descriptions, drawn across modules and types.
- One test bank's opening and the topic lists of two; the rest by counts.

Not read:
- The question SWFs themselves. One was decompiled to confirm the variant and answer controls; the wording of the questions on screen was not examined.
- Outlines, tables and images (all image files) and the three PowerPoint decks.
- The pretests and posttests, beyond their length.
- Most of the 66 background pages (one was read).
- The superseded guide versions, apart from confirming that an older lunar guide (`naap_lps_sg_05`) uses the horizon-diagram sim.
- Any help or instruction text inside the Originals themselves.
- The Scale Height lab, the `mobile/` HTML5 pages and the blog posts, apart from one post on code release.

Limits on the coverage numbers:
- A missing question link does not mean a sim is unrelated to its module's questions. It means no file says which question it serves.
- Of the 43 "NAAP page" matches, 35 are byte-identical SWFs. Three rest on an identical file name and five on a near-identical build under another name, so those eight are probable, not certain.
- One animation in the Coordinates and Motions manual (a simplified RA/Dec demonstrator) has no match in the catalog.
- Several NAAP background applets cover the same idea as a ClassAction sim under a different build (Sun's rays, Doppler shift, declination ranges, meridian altitude). They were not counted as coverage.
- Two question records in the bank share an id with another record. Counts here are by record.

No file read contained text addressed to an automated reader.

## Appendix: coverage per sim

"NAAP page" gives the lab folder and page under `naap/`. "Linked questions" is the number of ClassAction questions that list the sim.

| Sim id | Original title | Guide | NAAP page | Linked questions | Manual | Demo / worksheet |
|---|---|---|---|---|---|---|
| `lookbacktimesim` | Lookback Time Simulator |  |  | 2 |  |  |
| `small-angle` | Small-Angle Approximation Demonstrator |  |  | 2 |  |  |
| `heliacalrisingsim` | Heliacal Rising Simulator |  |  | 1 |  |  |
| `dipperclock` | Big Dipper Clock |  |  | 1 |  |  |
| `meridaltdiagram` | Meridional Altitude Simulator |  |  | 2 | yes |  |
| `latsim` | Declination Ranges Simulator |  |  | 1 | yes |  |
| `seasonsim` | Ecliptic Simulator |  |  | 3 | yes |  |
| `transitmovie` | Union Seasons Demonstrator |  |  | 1 | yes |  |
| `altazimuth` | Azimuth/Altitude Demonstrator |  |  | 3 | yes |  |
| `daylightsimulator` | Daylight Simulator |  |  | 2 |  |  |
| `obliquity` | Obliquity Simulator |  |  | 1 | yes |  |
| `zodiac` | Ecliptic (Zodiac) Simulator | yes | motion3/zodiac | 1 |  |  |
| `longlat` | Longitude/Latitude Demonstrator | yes | motion1/motion1, motion1/tc_both | 2 | yes |  |
| `radecdemo` | Celestial-Equatorial (RA/Dec) Demonstrator |  |  | 1 | yes |  |
| `sunpaths` | Paths of the Sun |  | motion1/orbits_light |  | yes |  |
| `sunmotionsoverview` | Sun Motions Overview |  | motion3/sunpaths | 2 |  |  |
| `sun-motions` | Sun Motions Demonstrator | yes | motion3/motion3 | 6 | yes | yes |
| `sunsrays` | Sun's Rays Simulator |  |  | 1 | yes |  |
| `horizon` | Sun's Position on Horizon |  |  |  |  |  |
| `bigdipper` | Big Dipper 3D |  |  |  |  |  |
| `seasons_ecliptic` | Seasons and Ecliptic Simulator | yes | motion1/motion1 | 4 |  | yes |
| `ce_hc` | Rotating Sky Explorer | yes | motion2/motion2 | 4 |  | yes |
| `daylighthoursexplorer` | Daylight Hours Explorer |  |  | 1 |  |  |
| `antipodesexplorer` | Antipodes Explorer |  |  | 2 |  |  |
| `siderealtimeandhourangledemo` | Sidereal Time and Hour Angle Demonstrator | yes | motion2/motion2 |  |  |  |
| `celestialhorizon` | Celestial and Horizon Systems Comparison |  | motion2/two_systems | 4 |  |  |
| `siderealSolarTime` | Sidereal and Solar Time Simulator |  | motion3/motion3 |  |  |  |
| `lunar_phaser` | Lunar Phase Vocabulary |  |  | 1 | yes |  |
| `basketball` | Basketball Phases Simulator |  |  | 1 | yes |  |
| `moonphases` | Three Views Simulator |  | lps/lunarPage1 | 1 | yes |  |
| `lunar-phases` | Lunar Phase Simulator | yes | lps/lps | 5 | yes | yes |
| `mooninc` | Moon Inclination |  |  | 1 | yes |  |
| `eclipsetable` | Eclipse Table |  |  | 1 | yes |  |
| `shadowsim` | Eclipse Shadow Simulator |  |  | 1 |  |  |
| `tidesim` | Tidal Bulge Simulation |  |  |  | yes |  |
| `phaseDemonstrator` | Phase Positions Demonstrator |  |  | 1 |  |  |
| `positionsdemonstrator` | Moon Phases and the Horizon Diagram | yes (older guide) | lps/lps | 3 |  |  |
| `synodiclag` | Synodic Lag |  |  |  |  |  |
| `fullmoondec` | Full Moon Declination Simulator |  |  | 1 |  |  |
| `lunarphasequizzer` | Lunar Phase Quizzer |  |  |  |  |  |
| `moonbisector` | Moon Phases With Bisectors |  | lps/lps |  |  |  |
| `venusphases` | Phases of Venus |  |  | 1 |  |  |
| `ptolemaicvenus` | Ptolemaic Phases of Venus |  |  | 1 |  |  |
| `marsorbit` | Ptolemaic Orbit of Mars |  |  |  |  |  |
| `pathtracer` | Epicycles Demo |  |  |  |  |  |
| `retrograde` | Retrograde Motion |  |  |  |  |  |
| `keplers_third` | Kepler's Third Law |  |  |  |  |  |
| `synodic-period` | Synodic Period Calculator | yes (optional) | ssm/modeling2 |  |  |  |
| `configurationssimulator` | Planetary Configurations Simulator | yes | ssm/ssm | 3 |  |  |
| `kepler` | Planetary Orbit Simulator | yes | pos/pos | 8 |  | yes |
| `ellipsedemo` | Eccentricity Demonstrator |  | pos/pos_background1 | 1 |  |  |
| `earthorbitplot` | Earth Orbit Plot |  |  | 1 |  |  |
| `gravcalc` | Newton's Law of Gravity Calculator |  |  | 2 |  |  |
| `gravalgebra` | Gravity Algebra |  |  | 1 |  |  |
| `meltednail` | Blackbody Curves of Melting |  |  |  |  |  |
| `spectrum010` | Spectrum Explorer |  |  |  |  |  |
| `em-spectrum` | EM Spectrum Module |  |  |  |  |  |
| `blackbody` | Blackbody Curves and Filters Explorer | yes | blackbody/blackbody, ebs/spectraltype |  |  |  |
| `filters` | Light and Filters Simulator | yes | blackbody/blackbody |  |  |  |
| `hydrogen-atom` | Hydrogen Atom Simulator | yes | hydrogen/hydrogen |  |  |  |
| `threeviewsspectra` | Three Views Spectrum Demonstrator |  |  |  |  |  |
| `radialvelocitydemo` | Extrasolar Planet Radial Velocity Demonstrator |  |  |  |  |  |
| `dopplershift` | Doppler Shift Demonstrator |  |  |  |  |  |
| `telescope10` | Telescope Simulator |  |  |  |  |  |
| `buckets` | CCD Simulator |  |  |  |  |  |
| `snellslaw` | Snell's Law Demonstrator |  |  |  |  |  |
| `fusion01` | Proton-Proton Animation |  |  |  |  |  |
| `fusion02` | CNO Cycle Animation |  |  |  |  |  |
| `stellarmag` | Distance Modulus Explorer |  |  |  | yes |  |
| `stellarvel` | Stellar Velocity Calculator |  |  |  | yes |  |
| `parallaxdiag` | Parallax Calculator |  | distance/parallax |  | yes |  |
| `spectroparallax` | Spectroscopic Parallax Simulator | yes | distance/distance |  | yes |  |
| `stellarlum` | Stellar Luminosity Calculator |  | ebs/luminosity, hr/hr_background2 |  | yes |  |
| `flux-inverse-square` | Flux Simulator |  |  |  | yes |  |
| `hr-diagram` | Hertzsprung-Russell Diagram Explorer | yes | hr/hr |  |  |  |
| `eclipsing-binary` | Eclipsing Binary Simulator | yes | ebs/ebs | 4 |  | yes |
| `wagonwheel` | Aliasing in Wagon Wheels |  |  | 1 |  |  |
| `center-of-mass` | Center of Mass Simulator |  | ebs/centerofmass, esp/centerofmass | 2 |  |  |
| `lightcurve` | Lightcurve Simulator |  | ebs/lightcurve | 4 |  |  |
| `milkywayrotationalvelocity` | Milky Way Rotational Velocity |  |  | 1 |  |  |
| `trafficdensity` | Traffic Density Analogy |  |  |  |  |  |
| `balloon` | Balloon Universe |  |  |  |  |  |
| `galacticredshift` | Galactic Redshift Simulator |  |  |  |  |  |
| `formationtemps` | Planet Formation Temperatures Plot |  |  |  |  |  |
| `solarsystemproperties` | Solar System Properties Explorer |  |  |  |  |  |
| `ca_extrasolarplanets_starwobble` | Influence of Planets on the Sun |  | esp/detection |  |  |  |
| `ca_extrasolarplanets_graph` | Radial Velocity Graph |  |  |  |  |  |
| `exoplanet-transit` | Exoplanet Transit Simulator | yes | esp/esp |  |  |  |
| `radial-velocity` | Exoplanet Radial Velocity Simulator | yes | esp/esp |  |  |  |
| `pulsarperiodsim001` | Pulsar Period Simulator |  |  |  |  |  |
| `hammerthrower` | Hammer Thrower Comparison |  |  |  |  |  |
| `drivingthroughsnow` | Driving Through Snow |  |  | 1 |  |  |
| `ptolemaic` | Ptolemaic System Simulator |  | ssm/modeling, ssm/ssm |  |  |  |
| `gasRetentionPlot` | Gas Retention Plot | yes | atmosphere/atmosphere |  |  | yes |
| `gasRetentionSimulator` | Gas Retention Simulator | yes | atmosphere/atmosphere |  |  | yes |
| `registrationsimulator` | Registration Simulator | yes | vsp/vsp |  |  |  |
| `blinkcomparatorsimulator` | Blink Comparator Simulator | yes | vsp/vsp |  |  |  |
| `photometrysimulator` | Photometry Simulator | yes | vsp/vsp |  |  |  |
| `variableStarPhotometryAnalyzer` | Variable Star Photometry Analyzer | yes | vsp/vsp |  |  |  |
| `parallax` | Parallax Explorer | yes | distance/distance |  |  |  |
| `clusterFittingExplorer` | HR Diagram Star Cluster Fitting Explorer | yes | distance/distance |  |  |  |
| `snCurveExplorer` | Supernova Light Curve Fitting Explorer | yes | distance/distance |  |  |  |
| `habitable-zone` | Circumstellar Habitable Zone Simulator | yes | habitablezones/habitablezones |  |  |  |
| `milkyWayHabitability` | Milky Way Habitability Explorer | yes | habitablezones/habitablezones |  |  |  |
