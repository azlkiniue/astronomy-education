# What makes an interactive science sim teach?

Research note for issue #2. Written 2026-11-17. Throwaway branch; not meant to be merged.

## The answer in brief

A sim teaches when the student, not the sim, is asking the questions. The research supports ten principles for getting there. The strongest evidence is for three of them: build the guidance into the sim, make the student commit to a prediction before the result appears, and answer a wrong idea with an explanation instead of a red cross. The weakest evidence is for the phone: no study was found that tests sim learning on a phone-sized touch screen, so that principle rests on accessibility standards and on reading the code.

`gravalgebra` already follows six of the ten (1, 2, 3, 4, 6, 7), partly follows three (5, 8, 9), and misses one (10, the phone). Its main gaps: targets too small on a phone, two challenge modes hidden behind a dropdown, and no prediction in its default mode.

## How to read this note

Every claim carries one of three marks.

- **Read**: taken from the source itself. The source list at the end says how much of each source was read (full text, abstract, or a search excerpt only).
- **Inferred**: my own reasoning from the sources or from the code. Not stated in any source.
- **Recalled**: from background knowledge; the source could not be opened to confirm it.

Evidence strength uses four labels.

| Label | Meaning |
|---|---|
| Strong | A meta-analysis, or controlled studies that agree with each other |
| Moderate | Controlled studies, but in a neighbouring setting (lecture demonstrations, classroom worksheets), or with mixed results |
| Design research | Think-aloud interviews and case studies by the people who built the sims. Rich, but not a controlled comparison |
| Standard | A normative specification. It says what to do, and is not evidence about learning |

Two background numbers frame everything below (Read, [D'Angelo 2014]). A meta-analysis of 59 studies found that teaching with a sim beat similar teaching without one (g = 0.62 on achievement, 46 effect sizes). It also found that the same sim with added support, such as scaffolding and certain kinds of feedback, beat the plain version (g = 0.49, 50 effect sizes). So the design work this ticket asks about is worth nearly as much as having a sim at all. The studies were in K-12 instructional settings and mostly in science.

## The principles

### 1. The student drives

- **Finding (Read, [Adams 2008a])**: Across more than 200 think-aloud interviews with 89 students, sims taught when students were posing their own questions and answering them by interacting. When a sim only showed motion, students rarely formed new ideas. Students who believed they already knew the topic rushed through to show what they knew and learned much less; the authors call this performance mode.
- **Evidence**: Design research, large sample. Backed at the level of "sims help" by the meta-analysis above (Strong).
- **In a Next-gen sim**: Open in a still state that needs the student to act. Nothing important should happen by itself on load. Every representation changes because the student changed something. (Inferred) A challenge that a confident student gets wrong is the natural cure for performance mode.

### 2. Build the guidance into the sim

- **Finding (Read, [Podolefsky 2013])**: PhET calls this implicit scaffolding. The sim guides through what it lets the student do (affordances), what it prevents (productive constraints), what it draws the eye to (cueing), and what it shows back (feedback). Their summary of the aim: "guides without students feeling guided." Concrete strategies they list:
  - One sim, a few narrow learning goals.
  - A simple opening screen with one obvious first action, cued by colour and placement, almost never by text.
  - Complexity added in later screens, with early constraints relaxed.
  - Readouts closed at the start so the student opens them one at a time.
  - A large reset button, so nothing feels risky.
  - Parameter ranges bounded so that extremes are informative, with values that support simple ratios such as twice or half.
  - Shortcuts to specific illuminating cases.
- **Finding (Read, [Moore 2013])**: 80 chemistry students, working in 22 groups, were given a sim with no instructions. The groups explored on average 18 of its 23 features in ten minutes, with little or no frustration.
- **Finding (Read, [Chamberlain 2014])**: With 210 students and one sim, use of features the worksheet did not mention fell from 85% under light guidance to 68% under moderate and 9% under heavy guidance. This measured exploration, not learning.
- **Counterweight (Read, [Lazonder 2016] through a secondary summary)**: A meta-analysis of 72 studies found that guided inquiry beats unguided inquiry on learning outcomes (d = 0.50). The kinds of guidance did not differ significantly from each other. The summary's practical reading is that a short hint at the right moment often does as much as a long explanation.
- **Evidence**: Design research for the strategies (the authors report over 600 interviews across 125 sims, plus one case study). Moderate for the claim that heavy explicit guidance suppresses exploration. Strong for the claim that some guidance beats none.
- **In a Next-gen sim**: The two bodies of evidence agree once put together: guidance is needed, and it works best when it sits in the design. For each sim, name two or three learning goals, pick the first action, and make the layout lead to it. Limit ranges to values that produce clean comparisons. Keep explicit text for the moment a student is stuck or wrong (see principle 6).

### 3. Let the student move the thing itself

- **Finding (Read, [Adams 2008b])**: Students tried to grab objects in the scene before they looked at any control panel, and click-and-drag was the most natural motion for them. Where a control cannot sit on the object, it should sit next to it. Sliders encouraged exploration more than typed numbers. Students rarely found play, pause and step buttons unprompted.
- **Evidence**: Design research.
- **In a Next-gen sim**: The primary variable is changed by dragging the object that has it: the planet along its orbit, the observer along the horizon, the Moon around the Earth. Sidebar controls repeat what the scene can do; they are not the only way in.

### 4. Link a second representation to the scene

- **Finding (Read, [Podolefsky 2013])**: Making sense of how representations relate is often the key to understanding the concept. Links are shown by proximity, by shared colour, and by changing at the same moment. An unfamiliar representation should become familiar through its tie to a familiar one. Some representations are chosen because they do cognitive work for the student.
- **Framework (Recalled, [Ainsworth 2006])**: A second representation can do one of three jobs: add information the first lacks, constrain how the first is read, or help build a deeper abstraction. The abstract was confirmed only through a search excerpt; the three jobs are from memory of the paper.
- **Caution (Read, [van der Meij 2003]; search excerpt for the 2006 journal version)**: A study of the same sim with separate, dynamically linked, and integrated representations found no significant difference between conditions in the conference version (90 learners aged 16 to 18). The 2006 journal version reportedly found differences only on the high-complexity items. Linking is not a guaranteed gain.
- **Evidence**: Design research for the linking techniques. Moderate and mixed for learning gains from linking itself.
- **In a Next-gen sim**: Add a second representation only when it answers "why does the answer come out like that?" Share colours between the two, update both in the same frame, and place them close together. If the second view does not explain the first, leave it out.

### 5. Ask for a prediction before showing the result

- **Finding (Read, [Crouch 2004])**: Students who only watched a lecture demonstration understood the concept no better than students who never saw it. Students who predicted the outcome first understood significantly more.
- **Finding (Read, [Miller 2013])**: About one in five students' reports of a demonstration contradicted what actually happened. Students who predicted first were roughly 20% more likely to observe correctly, whether or not the prediction was right.
- **Finding (Read, [Brod 2018])**: In a lab study, predicting beat judging after the fact for learning geography facts. Pupil measurements showed a surprise response to an unexpected outcome only when a prediction had been made, and stronger surprise went with more learning. The same paper notes that guessing helps only when corrective feedback follows promptly.
- **Caution (search excerpt only, [Chinn 1993])**: People have several ways of discounting data that contradicts their theory; changing the theory is only one of them. A surprising result does not by itself change a mind.
- **Related finding (Read, [Adams 2008a])**: Students trust sims. In one case a misleading default led students to abandon a correct prediction. A surprising output had better be the physics and not an artefact of the setup.
- **Evidence**: Moderate. The controlled studies are from lecture demonstrations and lab memory tasks. No study was found that tests predict-then-reveal inside a self-paced sim, so applying it here is **Inferred**.
- **In a Next-gen sim**: Before the sim reveals a result, the student commits: picks an answer, places a marker, or sketches a curve. Then the sim shows the outcome next to the prediction, and explains the gap (principle 6). Because surprise alone can be explained away, the reveal should show the mechanism and not only the number.

### 6. Answer a wrong idea with an explanation

- **Finding (Read, [van der Kleij 2015])**: A meta-analysis of feedback in computer-based learning (40 studies, 70 effect sizes) found that feedback with an explanation had an effect of 0.49, giving the correct answer 0.32, and saying only right or wrong 0.05. The advantage of explanation was larger for higher-order outcomes.
- **Finding (search excerpt only, [Moreno 2004])**: In a discovery-based multimedia game, novices given explanatory feedback transferred better than those given corrective feedback, in two experiments.
- **Finding (search excerpt only, [Schroeder 2022])**: A meta-analysis of refutation texts, which name a misconception and then say why it is wrong, found a moderate benefit (g = 0.41, 44 comparisons).
- **Evidence**: Strong for explanation over right/wrong. Moderate for naming the misconception.
- **In a Next-gen sim**: This is the main way a sim explains itself to a student working alone. Build each wrong option from a known wrong idea, and attach to each a one-sentence reason that names the idea and corrects it. Never show a bare "wrong." (Inferred) Showing the explanation inside the second representation, as an animation of how the answer is built, is stronger than text alone because students read little (principle 8).

### 7. Put the challenge inside the model

- **Finding (Read, [Podolefsky 2013])**: Puzzles and challenges keep students engaged after first exploration and give them a way to check their own understanding. An explicit challenge poses a question without saying how to use the sim to answer it.
- **Finding (Read, [Adams 2008a])**: Small puzzles and clues prompt students to form questions. But fun can pull away from the physics: in one sim a decorative character became a game of its own until the team limited it.
- **Evidence**: Design research. No controlled study isolating challenge modes in sims was found.
- **In a Next-gen sim**: A challenge is a goal stated in the sim's own quantities ("make the force a quarter", "find the latitude where the Sun never sets today"), with more than one route where the model allows it. The reward is the model responding, not a decoration. Make the challenge visible on the opening screen; a hidden mode is a mode most students never meet (see principle 8 for why).

### 8. Everything on screen has a job, and words are few

- **Finding (Read, [Adams 2008b])**: Students read as little as they can, often one to three words at a time. On-screen instructions led them to follow directions instead of exploring. Extensive help went unused; short help on request, next to the object, worked best. Colour cues beat text labels. Students treat every visual detail as meaningful, so irrelevant detail misleads. Large, bright tabs were noticed and small standard ones were not. The same thing drawn two ways across sims was taken to be two different things.
- **Finding (Read, [Adams 2008a])**: Every added feature adds load, so each needs an educational purpose. A control disabled for no physical reason sent students hunting for one; removing it worked better than greying it out.
- **Evidence**: Design research. Consistent with the coherence principle from multimedia learning, which the authors cite and which was not checked independently.
- **In a Next-gen sim**: Labels of one to three words, attached to what they label. No paragraph of instructions in the scene. One colour per quantity, the same in every representation and, as far as possible, across all 104 sims. Decorative animation only where it carries meaning. This sits in tension with a solo learner's need for explanation; the resolution suggested by principle 6 is to give words at the moment of need, not up front.

### 9. In astronomy, aim at the named misconception and show both viewpoints

- **Findings on what students believe**:
  - Seasons (Read, [Sneider 2011]): a review of 41 studies; the reason for seasons defeats even strong students.
  - Seasons (Recalled): the usual wrong model is that Earth is closer to the Sun in summer. The abstracts read here do not name it.
  - Lunar phases (Read, [Kavanagh 2005]): misconceptions are widespread and resist change; the most common is that phases happen when the Moon enters Earth's shadow.
  - Gravity (Read, [Williamson 2012]): among college astronomy students, 50% explained floating astronauts by saying there is no gravity in space. The most prominent pattern was a "boundary model", in which gravity stops at the surface, the atmosphere, or an orbit. Others tied gravity to air, magnetism or rotation.
  - Scale (Read, [Miller 2010]): 83 undergraduates, placing objects on a scale where Earth is a baseball, overestimated the distance to the Moon, moderately underestimated the Sun's, and greatly underestimated the distances to the nearest star and galaxy.
- **Findings on what helps**:
  - (Read, [Plummer 2014]) Progress on seasons depends on connecting what is seen from the ground to Earth's motion seen from space, and that link is one of the main obstacles.
  - (Read, [Plummer 2022]) Two middle-school units on phases and seasons that train perspective-taking improved it, and better perspective-taking predicted better astronomy understanding. A search excerpt, not the abstract, gives the sample as 877 students and says the units pair physical models with a visualisation tool.
  - (Read, [Bell 2008]) 50 preservice teachers used planetarium software inside an inquiry-based teaching sequence. None understood the cause of phases before; 82% did after.
  - (Search excerpt only, [Trundle 2010]) A three-way comparison with 157 preservice teachers found the software as effective as observing the real sky.
  - (Read, [Adams 2008a]) Let students adjust a parameter they wrongly think matters, and be surprised when it does not.
- **Evidence**: Strong that these misconceptions exist and persist. Moderate that sims help, and only inside a teaching sequence; no study was found of a sim confronting an astronomy misconception with a student working alone.
- **In a Next-gen sim**:
  - Each sim's spec names the misconception it targets, from the literature, before any design work.
  - (Inferred) Give the wrong model a control. A seasons sim lets the student change the Earth-Sun distance and see the seasons barely move, then change the tilt and see them vanish. A phases sim draws Earth's shadow and lets the student see it point away from the Moon at every phase but one.
  - Show the ground view and the space view together, linked as in principle 4, so that moving one moves the other.
  - (Inferred) A scale sim should make the student place the object first, as in the baseball task, and then show the true position.
  - (Inferred) A gravity sim should let distance run far enough that the force gets tiny and visibly never reaches zero.

### 10. On a phone, a finger is not a mouse

- **Standard (Read, [WCAG 2.5.8], [WCAG 2.5.7])**: Pointer targets are at least 24 by 24 CSS pixels (level AA), with 44 by 44 as the enhanced target for important controls. Anything done by dragging must also be possible with a single tap or click, for example tapping a point on a track.
- **Finding (Read, [Parhi 2006])**: For one-handed thumb use, targets of 9.2 mm for single taps and 9.6 mm for sequences were large enough not to cost speed, accuracy or preference. (Inferred) At the nominal 96 CSS pixels per inch that is about 35 CSS pixels.
- **Finding (search excerpt only, [Sung 2013])**: A well-designed lesson beat a plain one on both desktop and handheld devices; the method mattered on either medium.
- **Evidence**: Standard, plus one HCI study. No study of sim learning on a phone was found, and PhET's own touch-design guidance could not be located. Everything below about learning on a phone is **Inferred**.
- **In a Next-gen sim**:
  - Size hit areas in CSS pixels after scaling, not in canvas units. A canvas drawn at 760 units and shown at 320 pixels shrinks every target to 42% of its drawn size.
  - No state reachable only by hover. Hover can decorate; it cannot inform.
  - Every drag has a tap alternative, and the canvas claims the gesture so the page does not scroll in the middle of a drag.
  - (Inferred) The finger covers what it drags. Put the readout for a dragged object above or beside it, not under it.
  - (Inferred) Linked representations must both be visible without scrolling, or the link of principle 4 is lost. On a narrow screen that means stacking them tightly and moving controls below, not shrinking the whole canvas until text is unreadable.

## How a sim explains itself to a student working alone

The ticket asks this directly, and the answer is spread across the principles above. Gathered in one place:

1. The layout says what to do first (principle 2). (Read)
2. The model's response is the first explanation: change one thing, see what follows (principles 1 and 3). (Read)
3. A second representation shows why (principle 4). (Read)
4. A committed prediction makes the student notice the gap (principle 5). (Read for demonstrations; Inferred for sims)
5. A wrong answer gets a sentence that names the wrong idea and corrects it (principle 6). (Read)
6. A challenge lets the student check whether they have it (principle 7). (Read)

What the sources do not support is a block of instructions up front. Students do not read it, and when they do, they follow it instead of exploring (principle 8). (Read)

One gap remains. All of PhET's interview evidence comes from students who were asked to think aloud next to a researcher, and most classroom evidence comes with a teacher or worksheet. None of it describes a student alone with a phone and no reason to stay. (Inferred)

## gravalgebra against the principles

Based on reading `assets/js/sims/gravalgebra.js`. Nothing here was tested with a student or on a device; the phone numbers are computed from the code and CSS. Line numbers refer to the file at commit `94832d2`.

| # | Principle | Verdict | What the code shows |
|---|---|---|---|
| 1 | Student drives | Follows | Opens still, apart from a brief cue. Nothing changes until the student picks a coefficient or drags M₂. All views update from one `changed()` path (l. 196). |
| 2 | Guidance in the design | Mostly follows | One learning goal. Choices limited to ⅓, ½, 1, 2, 3, which is exactly the simple-ratio constraint PhET describes (l. 106). A "click me" ripple on the chips for 4.5 s, cleared by the first change (l. 294). Predict questions start with one changed coefficient and grow to three (l. 232). Reset button present. Weak spot: the opening screen shows everything at once; nothing is closed or staged. |
| 3 | Move the thing itself | Follows | M₂ drags along the ruler; bodies and equation coefficients are tappable and open a picker beside them (l. 929 on). Sidebar selects repeat the same choices. |
| 4 | Linked second representation | Follows | The log-scale force line builds the answer hop by hop, with the distance hop drawn twice. Colours are shared between equation, scene and line, and all update together. The line does real cognitive work: it shows why R counts twice. |
| 5 | Predict first | Partly | Predict mode hides the result, the readouts and the force line until the student picks one of four answers (l. 141, 189). But Explore, the default mode, shows the answer instantly with no prediction, and Predict is a separate mode the student must find. |
| 6 | Explain the wrong idea | Follows | Wrong options are generated from specific slips: forgot to square R, put R² on top, inverted the ratio, squared a mass, used one mass (l. 247 to 258). Each has its own one-line reason (l. 46 to 51), and the hop animation then replays the correct construction. Caveat: these slips are the author's list, not taken from a study. |
| 7 | Challenge inside the model | Follows, but hidden | "Hit the target" states a goal in the model's own terms, gives no recipe, and counts the distinct settings that reach it (l. 279). Both challenges sit behind a sidebar dropdown labelled "Mode" (l. 147). PhET found that small, standard-looking controls go unnoticed. |
| 8 | Few words, everything has a job | Partly | Labels are short and colour-coded. But there is a sentence of instructions in the sidebar for each mode, a hint line in the scene, and four paragraphs of About text. One legend entry states the key idea outright: the distance factor is "used twice, because R is squared" (l. 42). That helps a solo learner and also removes the discovery. |
| 9 | Named misconception, two viewpoints | Partly | It targets a real difficulty, the inverse square, and draws equal and opposite pulls to scale, which quietly answers "the bigger body pulls harder". It does not touch the misconceptions the gravity literature reports as most common: no gravity in space, and gravity ending at a boundary. Distance stops at 3R. Two viewpoints do not apply to this topic. |
| 10 | Phone | Misses | See below. |

### The phone, in detail (Inferred from code)

The canvas is 760 by 600 units and is shown at `width: 100%`. On a 375-pixel-wide phone, after page and stage padding, it is about 313 pixels wide, a scale of about 0.41.

| Target | Size in canvas units | Approx. size on that phone | WCAG minimum |
|---|---|---|---|
| Distance stops on the ruler (l. 557) | height 18 | 7 px | 24 px |
| "Next question" chip (l. 863) | height 22 | 9 px | 24 px |
| Answer pills in Predict (l. 828) | 104 by 40 | 43 by 16 px | 24 px |
| A body of mass 1 (l. 577) | radius 26 | 21 px across | 24 px |

Other points from the code:

- Canvas text scales with the canvas. The 18-unit answer text is about 7 pixels tall on that phone.
- No `touch-action` is set on the canvas in `styles.css` or `sim.js`. A horizontal drag on M₂ may be taken by the browser as a page gesture and cancelled. Not tested.
- A drag starts after 3 canvas units of movement (l. 958), a little over one pixel on that phone, so a tap on M₂ may register as a drag.
- Hover only highlights; nothing depends on it. Good.
- Dragging has tap alternatives (tap a stop, or use the picker), which meets the dragging criterion. Good.
- Below 880 pixels the sidebar moves under the canvas (`styles.css` l. 273). The mode dropdown, where the challenges live, is then off screen below a 600-unit canvas.
- The answer pills, picker and "next" chip exist only on the canvas, so Predict mode cannot be completed by keyboard. The only key handled is Escape (l. 985).

### What gravalgebra suggests for the standard (Inferred)

Its strongest ideas are the ones the research backs most: a second representation that shows the mechanism, wrong answers built from named slips, and feedback that explains. A Next-gen standard could keep those three as requirements and add what gravalgebra lacks:

1. Design for the phone first, with targets sized after scaling.
2. Put the challenge on the opening screen.
3. Offer a prediction in the main flow, not only in a separate mode.
4. Take the wrong ideas from the misconception literature for that topic, where it exists.

## Open questions

1. **Does predict-then-reveal work in a self-paced sim?** The controlled evidence is from lecture demonstrations and lab memory tasks. Nothing found tests it with a student alone who can skip the prediction.
2. **How much text can a sim carry for a solo learner?** PhET's interviews say almost none. The guidance meta-analysis says guidance helps. Neither studied a student with no teacher and no worksheet, and neither studied a bilingual interface.
3. **Does any of this hold on a phone?** No study of sim learning on a phone-sized screen was found. PhET's touch-design guidance, if published, was not located.
4. **Are multiple-choice predictions as good as open ones?** The demonstration studies do not separate the two. Distractors built from misconceptions are a reasonable guess, not a finding.
5. **Do linked representations pay off?** The one controlled comparison read here found no significant difference. When a second view helps and when it only adds load, especially on a small screen, is unsettled.
6. **Do students find and use challenge modes?** No data. PhET's own method is the cheapest way to find out: watch a handful of students think aloud with the sim.
7. **Have the UNL applets themselves been evaluated?** No published evaluation of the NAAP or ClassAction sims was found in this pass.
8. **Does the evidence transfer to this audience?** Almost all of it comes from students in the United States, mostly undergraduates or middle-schoolers in class. Indonesian students exploring alone are not in any sample.

### Could not verify

- Renken and Nuñez (2013), "Computer simulations and clear observations do not guarantee conceptual understanding", *Learning and Instruction*. Recalled as a counter-example in which a pendulum sim did not shift misconceptions. Neither the paper nor its abstract could be opened, so it is not used above.
- The specific numbers behind Crouch 2004 (percentages per condition) appear only in conference slides found by search; the abstract gives the direction of the effect and no figures.
- The quotes and details attributed to the two Adams 2008 papers were read through a tool that summarises the fetched page, not from the raw page. The Podolefsky, D'Angelo, Brod and Williamson texts were read directly.

## Sources

How much of each was read is in brackets.

- **[Adams 2008a]** Adams, Reid, LeMaster, McKagan, Perkins, Dubson, Wieman. "A Study of Educational Simulations Part I: Engagement and Learning." *Journal of Interactive Learning Research* 19(3), 397-419. https://phet.colorado.edu/publications/archive/PhET%20interview%20Paper%20Part%20I.htm [full page, through a summarising fetch]
- **[Adams 2008b]** Same authors. "A Study of Educational Simulations Part II: Interface Design." *Journal of Interactive Learning Research* 19(4), 551-577. https://phet.colorado.edu/publications/archive/PhET%20Interview%20Paper%20Part%20II.htm [full page, through a summarising fetch]
- **[Ainsworth 2006]** Ainsworth. "DeFT: A conceptual framework for considering learning with multiple representations." *Learning and Instruction* 16(3), 183-198. https://doi.org/10.1016/j.learninstruc.2006.03.001 [search excerpt of the abstract only]
- **[Bell 2008]** Bell, Trundle. "The use of a computer simulation to promote scientific conceptions of moon phases." *Journal of Research in Science Teaching* 45(3), 346-372. https://istardb.org/aerpublications/the-use-of-a-computer-simulation-to-promote-scientific-conceptions-of-moon-phases/ [abstract]
- **[Brod 2018]** Brod, Hasselhorn, Bunge. "When generating a prediction boosts learning: The element of surprise." *Learning and Instruction* 55, 22-31. https://doi.org/10.1016/j.learninstruc.2018.01.013 ; open copy https://escholarship.org/content/qt0qn99739/qt0qn99739_noSplash_c8cf6501aac0923a831547b6df257a04.pdf [abstract and introduction, from the PDF]
- **[Chamberlain 2014]** Chamberlain, Lancaster, Parson, Perkins. "How guidance affects student engagement with an interactive simulation." *Chemistry Education Research and Practice* 15(4), 628-638. https://doi.org/10.1039/c4rp00009a ; abstract at https://www.per-central.org/items/detail.cfm?ID=16327 [abstract]
- **[Chinn 1993]** Chinn, Brewer. "The role of anomalous data in knowledge acquisition." *Review of Educational Research* 63(1), 1-49. https://www.causeweb.org/cause/node/6957 [search excerpt only]
- **[Crouch 2004]** Crouch, Fagen, Callan, Mazur. "Classroom demonstrations: Learning tools or entertainment?" *American Journal of Physics* 72(6), 835-838. https://doi.org/10.1119/1.1707018 ; abstract at https://www.compadre.org/portal/items/detail.cfm?ID=2329 [abstract]
- **[D'Angelo 2014]** D'Angelo, Rutstein, Harris, Haertel, Bernard, Borokhovski. "Simulations for STEM Learning: Systematic Review and Meta-Analysis." SRI International. Overview brief: https://www.sri.com/wp-content/uploads/2022/04/simulations-for-stem-learning-brief.pdf [the five-page overview in full; not the full report or its moderator analyses]
- **[Kavanagh 2005]** Kavanagh, Agan, Sneider. "Learning about Phases of the Moon and Eclipses: A Guide for Teachers and Curriculum Developers." *Astronomy Education Review* 4(1), 19-52. https://www.doi.org/10.3847/AER2005002 ; abstract at https://istardb.org/aerpublications/learning-about-phases-of-the-moon-and-eclipses-a-guide-for-teachers-and-curriculum-developers/ [abstract]
- **[Lazonder 2016]** Lazonder, Harmsen. "Meta-Analysis of Inquiry-Based Learning: Effects of Guidance." *Review of Educational Research* 86(3), 681-718. https://doi.org/10.3102/0034654315627366 [not read directly; read the Clearing House Unterricht summary, Kurzreview 5, in German: https://www.clearinghouse.edu.tum.de/wp-content/uploads/2018/12/CHU_KR-5_Lazonder-Harmsen_2016_Forschendes-Lernen.pdf]
- **[Miller 2010]** Miller, Brewer. "Misconceptions of Astronomical Distances." *International Journal of Science Education* 32(12), 1549-1560. https://doi.org/10.1080/09500690903144099 ; abstract at https://istardb.org/aerpublications/misconceptions-of-astronomical-distances/ [abstract]
- **[Miller 2013]** Miller, Lasry, Chu, Mazur. "Role of physics lecture demonstrations in conceptual learning." *Physical Review Special Topics - Physics Education Research* 9, 020113. https://journals.aps.org/prper/abstract/10.1103/PhysRevSTPER.9.020113 [abstract]
- **[Moore 2013]** Moore, Herzog, Perkins. "Interactive simulations as implicit support for guided-inquiry." *Chemistry Education Research and Practice* 14(3), 257-268. https://doi.org/10.1039/c3rp20157k ; abstract at https://www.per-central.org/items/detail.cfm?ID=16328 [abstract]
- **[Moreno 2004]** Moreno. "Decreasing cognitive load for novice students: Effects of explanatory versus corrective feedback in discovery-based multimedia." *Instructional Science* 32, 99-113. https://serc.carleton.edu/resources/40398.html [search excerpt only]
- **[Parhi 2006]** Parhi, Karlson, Bederson. "Target size study for one-handed thumb use on small touchscreen devices." MobileHCI 2006, 203-210. https://doi.org/10.1145/1152215.1152260 ; abstract at https://www.microsoft.com/en-us/research/?p=155150 [abstract]
- **[Plummer 2014]** Plummer, Maynard. "Building a learning progression for celestial motion: An exploration of students' reasoning about the seasons." *Journal of Research in Science Teaching* 51(7), 902-929. https://doi.org/10.1002/tea.21151 [abstract]
- **[Plummer 2022]** Plummer, Udomprasert, Vaishampayan, Sunbury, Cho, Houghton, Johnson, Wright, Sadler, Goodman. "Learning to think spatially through curricula that embed spatial training." *Journal of Research in Science Teaching* 59(7), 1134-1168. https://doi.org/10.1002/tea.21754 [abstract]
- **[Podolefsky 2013]** Podolefsky, Moore, Perkins. "Implicit scaffolding in interactive simulations: Design strategies to support multiple educational goals." arXiv:1306.6544. https://arxiv.org/abs/1306.6544 [pages 1 to 13 of 30 read in full: the framework and the design strategies; the case-study interview was not read]
- **[Schroeder 2022]** Schroeder, Kucera. "Refutation Text Facilitates Learning: a Meta-Analysis of Between-Subjects Experiments." *Educational Psychology Review* 34, 957-987. https://doi.org/10.1007/s10648-021-09656-z [search excerpt only]
- **[Sneider 2011]** Sneider, Bar, Kavanagh. "Learning about Seasons: A Guide for Teachers and Curriculum Developers." *Astronomy Education Review* 10(1), 010103. https://www.doi.org/10.3847/AER2010035 ; abstract at https://istardb.org/aerpublications/learning-about-seasons-a-guide-for-teachers-and-curriculum-developers/ [abstract]
- **[Sung 2013]** Sung, Mayer. "Online multimedia learning with mobile devices and desktop computers: An experimental test of Clark's methods-not-media hypothesis." *Computers in Human Behavior* 29(3), 639-647. https://doi.org/10.1016/j.chb.2012.10.022 [search excerpt only]
- **[Trundle 2010]** Trundle, Bell. "The use of a computer simulation to promote conceptual change: A quasi-experimental study." *Computers & Education* 54(4), 1078-1088. https://doi.org/10.1016/j.compedu.2009.10.012 [search excerpt only]
- **[van der Kleij 2015]** van der Kleij, Feskens, Eggen. "Effects of Feedback in a Computer-Based Learning Environment on Students' Learning Outcomes: A Meta-Analysis." *Review of Educational Research* 85(4), 475-511. https://doi.org/10.3102/0034654314564881 ; abstract at https://people.acer.org/en/publications/effects-of-feedback-in-a-computer-based-learning-environment-on-s/ [abstract]
- **[van der Meij 2003]** van der Meij, de Jong. "Learning with multiple representations: Supporting students' translation between representations in a simulation-based learning environment." EARLI 2003. https://research.utwente.nl/en/publications/learning-with-multiple-representations-supporting-students-transl/ [abstract]. The 2006 journal version, *Learning and Instruction* 16, 199-212, was seen only as a search excerpt.
- **[WCAG 2.5.7]** W3C. "Understanding Success Criterion 2.5.7: Dragging Movements." https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html [read]
- **[WCAG 2.5.8]** W3C. "Understanding Success Criterion 2.5.8: Target Size (Minimum)." https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html [read]
- **[Williamson 2012]** Williamson, Willoughby. "Student Understanding of Gravity in Introductory College Astronomy." *Astronomy Education Review* 11(1). https://www.doi.org/10.3847/AER2011025 ; record at https://istardb.org/aerpublications/student-understanding-of-gravity-in-introductory-college-astronomy/ [results and discussion read in part, from the PDF]
