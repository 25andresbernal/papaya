# Duolingo ABC: what it is, and what Papaya should take from it

> Research brief for the Papaya team. Andre's prompt: "it's more for younger children, great graphics, sounds, and stories" — he wants that depth for Spanish, going beyond where ABC falls short (English only, capped/repetitive content) toward deep lessons and bilingual book stories.

---

## 1. Product structure

**Age and positioning.** Duolingo ABC ("Learn to Read") launched March 26, 2020 as a free, ad-free iOS app for ages 3–6, released early because of COVID-19 school closures so parents suddenly homeschooling had something to hand their kids ([9to5Mac](https://9to5mac.com/2020/03/26/duolingo-abc-learn-to-read-ios-free-app/), [TechCrunch](https://techcrunch.com/2020/03/26/duolingos-new-app-teaches-children-how-to-read-and-write/)). Its stated range has since broadened to 3–8, positioning it as a bridge from pre-reading to roughly 2nd-grade literacy ([Common Sense Media](https://www.commonsensemedia.org/app-reviews/duolingo-abc-learn-to-read), [alephlab.ai](https://alephlab.ai/a/compare/duolingo-abc-cost-and-review)). It is a fully separate app from core Duolingo — different mission, different account system, no shared login or data ([Common Sense privacy evaluation](https://privacy.commonsense.org/evaluation/Duolingo-ABC---Learn-to-Read)).

**The learning path.** ABC renders progress as a small city: each Level is a building, with Level 1 living inside "The School." Kids climb a building's path lesson by lesson; passing through a "doorway" moves them to the next unit ([Duolingo Wiki](https://duolingo.fandom.com/wiki/Duolingo_ABC)). Sources converge on roughly **10 levels at ~15 lessons each** in the original structure, while the catalog has since grown — cited counts range from **300+ lessons** at 2020 launch to **700+ lessons and stories** today ([Common Sense Media](https://www.commonsensemedia.org/app-reviews/duolingo-abc-learn-to-read), [duolingoguides.com](https://duolingoguides.com/duolingo-abc/)). Each lesson runs **about 5 minutes or less** ([Duolingo Wiki](https://duolingo.fandom.com/wiki/Duolingo_ABC)).

**A lesson, step by step.** Short "games" chain together, each drilling one micro-skill before the next reviews it: trace a letter, match a letter to its sound, tap the picture that starts with a sound, drag letters into slots to build a word, listen-and-repeat aloud (speech recognition checks pronunciation), and, once enough sounds are known, read a short decodable story with a comprehension question ([GIANT Room](https://www.thegiantroom.com/blog/05/31/2023/report-duolingoabc-playtesting-session), [Common Sense Media](https://www.commonsensemedia.org/app-reviews/duolingo-abc-learn-to-read), [SmartBrief](https://www.smartbrief.com/original/strengthen-early-literacy-skills-with-duolingo-abc)). Common Sense's review calls out the pattern directly: "each step along the path is purposeful — new games review what's already been introduced and then build on those concepts" ([Common Sense Education](https://www.commonsense.org/education/reviews/duolingo-abc-learn-to-read)).

**Exercise types:** letter tracing with guide strokes, tap-the-picture/tap-the-letter, drag-and-drop spelling, listen-and-repeat with speech recognition, matching pairs, sight-word taps, and read-along stories with a comprehension check. Reviews also mention a handful of arcade-style mini-games between lessons as a pacing reward, though we could not confirm specific titles beyond general "fun mini games and rewards" descriptions ([duolingoguides.com](https://duolingoguides.com/duolingo-abc/)).

**Pre-readers.** Everything is spoken, by design — a 3-year-old can't read instructions, so a narrator reads every prompt, choice, and story word aloud ([abc.duolingo.com/how-we-teach](https://abc.duolingo.com/how-we-teach)). Duolingo brought preschoolers into live sessions with the GIANT DesignLab specifically to watch pre-readers use prototypes and catch anything that assumed reading ability ([GIANT Room report](https://www.thegiantroom.com/blog/05/31/2023/report-duolingoabc-playtesting-session)).

**Progression, rewards, daily structure.** Settings let a parent turn a "heart system" (lose a life on a wrong answer) on or off — optional, unlike core Duolingo where hearts are central ([duoplanet.com](https://duoplanet.com/how-to-beat-the-heart-system-on-duolingo/)). Sources describe "delightful sound effects, illustrations, and animation to celebrate every achievement," but a granular sticker-collection UI could not be independently confirmed — treat that detail as directional, not verified. There's no streak/league system like core Duolingo; ABC leans on short sessions and gentle progression rather than daily-return pressure.

**Parent side.** Settings let a parent set a starting level, add or remove activity types, set practice reminders, toggle hearts, and view progress reports. Signup needs only a parent email; Common Sense's privacy review confirms no user-generated content and no social features ([Common Sense privacy evaluation](https://privacy.commonsense.org/evaluation/Duolingo-ABC---Learn-to-Read)). The app is **100% free, no ads, no in-app purchases** — confirmed at launch ([Duolingo on X](https://x.com/duolingo/status/1243175091334152193)) and still true, funded as a mission project rather than through subscription revenue.

---

## 2. Stories and books — the model for Papaya

**Structure.** ABC stories are short, illustrated, read-aloud picture books unlocked once a child knows enough letter-sounds to sustain one. A narrator reads the story with **each word highlighted as it's spoken**, syncing print and sound for kids who can't fully decode yet ([SmartBrief](https://www.smartbrief.com/original/strengthen-early-literacy-skills-with-duolingo-abc)). Text is **decodable** — limited to sounds already taught in the sequence, so a story never surprises a reader with an unlearned sound ([scope-and-sequence PDF](https://lit-lessons-cdn.duolingo.com/resources/duolingo_abc_scope_and_sequence_english.pdf)).

**Comprehension.** Stories carry mid- or end-of-story questions that push kids to "predict story events" and "infer the meaning of new vocabulary," not just decode. Tone is "imbued with positive messages and a heavy dose of kid-directed humor" ([duolingoguides.com](https://duolingoguides.com/duolingo-abc/)) — written to be genuinely funny for a 4–7 year old, not pedagogical filler.

**Illustration and layout.** Sources describe "cute and colorful illustrations" that reiterate the word being taught, paired one-to-one with the read-aloud text ([LearningWorks for Kids](https://learningworksforkids.com/apps/duo-abc/), [educationalappstore.com](https://www.educationalappstore.com/app/duolingo-abc)). The art follows Duolingo's company-wide "shape language" — flat, rounded, geometric, built for legibility at small sizes ([blog.duolingo.com](https://blog.duolingo.com/shape-language-duolingos-art-style/)) — with a softer, brighter palette for this younger audience.

**Reading levels and modes.** Stories are levelled to the phonics sequence, effectively a reading-level ladder, since a story only appears once its sounds are known. We could not independently confirm a named dual toggle like "Read to Me" vs. "Read by Myself" — **treat any specific claim about such a toggle as unverified.** What is verified: narration-with-highlighting is the universal default, and speech-recognition elsewhere in the app has kids read/repeat words aloud, which functions like a "read it yourself, checked by the app" mode at the word level.

**How many books, and unlocking.** Stories are distributed across the ~700 total lessons rather than a separate library; an exact story count isn't published. They unlock strictly by path position — a story is the payoff once its unit's phonics content is done, not something a child can jump to freely ([Common Sense Education](https://www.commonsense.org/education/reviews/duolingo-abc-learn-to-read) notes there is "no option for customizing the order of activities").

**What parents say.** Coverage is positive but modest: stories make letter-sound review "not feel like a drill," and the humor lands, but no review treats stories as best-in-class next to dedicated story apps (Epic!, Homer) — the consensus is that phonics drills are ABC's strength and stories are a strong complement, not the headline. That is exactly the gap Andre wants Papaya's bilingual books to fill.

---

## 3. Voice and audio

Every prompt, choice, and story line is voiced — non-negotiable for a pre-reader audience. Public detail on who voices it is thin, but Duolingo hired **Linda Simensky**, a veteran children's-TV executive (ex–PBS Kids, Cartoon Network), as Head of Animation and Scripted Content in 2021 specifically to oversee "the creation of scripted and character-driven stories" for ABC ([Duolingo investor release](https://investors.duolingo.com/news-releases/news-release-details/veteran-animation-executive-linda-simensky-joins-duolingo)) — a strong signal of professional voice-acting and real children's-media production, not raw text-to-speech. We could not confirm specific voice credits line-by-line.

Correct answers get a short, cheerful chime (fans call it "Ding-dilin!") plus a mascot line like "Excellent!" Wrong answers get a soft negative cue and an immediate re-show of the right answer — never a harsh buzzer or loud failure aimed at a preschooler. One reviewer asked for an option to turn *down* the celebration on correct answers, implying the default is generous, even a bit much for repeat play. Ambient/background music is not well documented in available sources; the emphasis throughout is narration clarity and short celebratory stings rather than a persistent music bed.

---

## 4. Graphics and characters

**Cast.** ABC uses **younger versions of the core Duolingo character roster** rather than a new cast: Duo, Junior (the youngest), Lily, Zari, Bea, Oscar, Lucy, Lin, Vikram and others appear as kids, each keeping a simplified version of their main-app personality (Zari outgoing and type-A, Lily deadpan) so the IP feels continuous with what parents may already use ([Duolingo Wiki](https://duolingo.fandom.com/wiki/Category:Main_Characters), [duoplanet.com](https://duoplanet.com/duolingo-character-names/)).

**Art style.** The company-wide "shape language" — simple, rounded, geometric construction for clarity and warmth — carries into ABC with a brighter, softer palette ([blog.duolingo.com](https://blog.duolingo.com/shape-language-duolingos-art-style/)). Reviews call it "cute" and "consistent," explicitly not cinematic: one reviewer states it "is not going to win any awards for entertainment value — it's phonics practice dressed up with cute characters, not Pixar" ([alephlab.ai](https://alephlab.ai/a/compare/duolingo-abc-cost-and-review)).

**Where "premium" actually comes from.** Across sources, the premium feel reads as coming less from animation budget and more from: total absence of ads/paywalls/dark patterns; tight, purposeful sound-and-motion on every tap ("little flourishes... never intrude on the learning but just make the experience that bit more fun"); and content depth (700+ lessons) most free kids' apps don't match. That combination, not art spend, is what parents and kids experience as quality.

**Navigation as design.** The city/building metaphor is Duolingo's own way of making progression feel like exploring a place rather than climbing a bar — close in spirit to Papaya's crowned path, and worth leaning into further.

---

## 5. Where it falls short, per reviews

- **English only.** ABC teaches English literacy exclusively and launched "English only, iOS only, in limited territories" with no other languages added since ([Duolingo's 2020 announcement](https://x.com/duolingo/status/1243175091334152193)). Multiple App Store reviewers ask for this to change — including, notably, **a reviewer in a Hispanic household who wished their child could learn letters/words in Spanish** — a parent in almost exactly Andre's situation, unserved by ABC.
- **Fixed starting point.** "All kids must start at the beginning," so a child who already knows some letters sits through material below their level; teachers report the same rigidity blocks classroom alignment ([Common Sense Media](https://www.commonsensemedia.org/app-reviews/duolingo-abc-learn-to-read), [Common Sense Education](https://www.commonsense.org/education/reviews/duolingo-abc-learn-to-read)).
- **Repetitive for some kids.** Parent and teacher reviews both call early content "tedious" for advanced readers; other reviews call the small mini-game set repetitive over long sessions and recommend short daily doses.
- **Kids age out of it.** Several sources frame ABC as a "bridge" app: once a child reads short sentences and moves into early chapter books, its mechanics "start to feel like baby stuff" — it isn't built to grow with a reader all the way to fluency.
- **Little explicit instruction.** Common Sense's teacher review notes kids mostly learn "by trial and error" rather than direct instruction — fine for reinforcement, weaker as a first-teach tool without an adult present.
- **Thin, sometimes contradictory public detail.** Exact story counts, any named "read to me/read myself" toggle, and specific mini-game rosters are sparse or inconsistent across sources (lesson counts alone range from "300+" to "700+") — a real information gap, not something to assume without testing the app directly.

---

## 6. Pedagogy

Duolingo grounds ABC in the **"science of reading"** — research aligned with National Reading Panel recommendations and Common Core K–2 standards on how children learn to decode print ([abc.duolingo.com/how-we-teach](https://abc.duolingo.com/how-we-teach); [scope-and-sequence PDF](https://lit-lessons-cdn.duolingo.com/resources/duolingo_abc_scope_and_sequence_english.pdf)). Concretely: **explicit, systematic phonics** in a fixed, deliberate order; **cumulative review** woven into later lessons rather than taught once and dropped; **decodable text** limited to sounds already taught, so comprehension is scaffolded rather than assumed; and coverage of the **five components of literacy** — phonemic awareness, phonics, fluency, vocabulary, comprehension.

**What transfers to Papaya, and what doesn't.** Papaya's job differs: kids already read English fluently; the task is teaching **spoken Spanish vocabulary and simple phrases**. The phonics-sequence idea doesn't map onto letter-sounds, but its spirit does — teach a small controlled set, then only ever combine what's already known, never surfacing a word or sentence frame the learner hasn't been taught. Papaya's unit-based curriculum (CLAUDE.md §7) already does this; the same discipline should extend to story text: "decodable text" becomes **decodable Spanish**, where every sentence in a story uses only words the curriculum has already taught by that point. Papaya's Leitner-box spaced repetition is the direct cousin of ABC's cumulative review, already doing the harder version of the same job for vocabulary retention. A short spoken comprehension question after a story ("What did Mamá ask for?") is worth borrowing directly. What does **not** transfer: letter tracing, phonemic awareness, and sight-word memorization are print-literacy mechanics for a child who can't yet decode English — irrelevant to Papaya's already-literate audience. Papaya should import the sequencing discipline and the story-as-comprehension-check pattern, not the letters-and-tracing exercises themselves.

---

## What Papaya should copy from ABC

1. **Absolute narration coverage** — every word, prompt, and choice spoken, with word-level highlighting in stories; extend Papaya's existing exercise narration fully into storybooks.
2. **Cumulative, controlled vocabulary discipline** — never show a word or phrase in a story that hasn't been explicitly taught yet.
3. **Short, purposeful sessions with review baked in** — 5-minutes-or-less content where old skills recur inside new exercises rather than being one-and-done.
4. **Generous, immediate multisensory feedback on every tap** — sound plus animation plus character reaction, celebratory but not garish, with room for a "turn it down" option later.
5. **A visual "world" for progression**, in the spirit of ABC's city of buildings, to make Papaya's path feel like exploring a place rather than climbing a bar.
6. **Comprehension checks after stories**, not just after individual exercises — a short spoken question confirming the story landed, not just that words were recognized.
7. **No ads, no in-app purchases, total transparency about being free** — already Papaya's design, and worth stating plainly since it's one of the most consistently praised traits across every review type.
8. **Optional strictness controls for parents**, mirroring ABC's heart-system toggle — Papaya's no-fail default is already ahead here, but an optional Settings toggle for older kids (harder pacing, mild fail state) is worth considering for the 9–10 edge of the range.

## Where Papaya can beat ABC

1. **Bilingual, not monolingual.** ABC cannot serve a family like Andre's at all — a reviewer in his exact situation said so. Papaya's stories show and read Spanish and English together, serving the "talk to abuela today" goal ABC structurally can't touch.
2. **No lesson cap, no aging out.** ABC is explicitly a bridge kids outgrow; Papaya's spaced repetition and Practice mode let it keep serving the same kid for years as vocabulary and sentences grow, with no ceiling.
3. **Real household-Spanish specificity** — Colombian words like arepa, jugo, carro — instead of ABC's generic, dialect-neutral English; Papaya's Spanish should feel like it comes from a real family, not a textbook.
4. **A story-as-reward loop tied to an economy ABC doesn't have.** ABC has no papayas, tickets, or arcade; finishing a Papaya storybook can pay out currency that unlocks buddies, cosmetics, and mini-games — a second job stories perform that ABC's never do.
5. **Freely explorable progress once earned**, unlike ABC's rigid "start at the very beginning, no reordering," which both parents and teachers flagged as a weakness; Papaya's Practice mode already pulls weak/due words on demand instead of forcing linear replay.
6. **Sharper, bilingual comprehension** — using the same controlled-vocabulary story text to ask questions in both languages, reinforcing translation, not just recall.

---

## Concrete spec proposal: Papaya story books

- **Length:** 6–8 pages per book, short enough to finish in one ~3-minute session, matching Papaya's lesson-length target.
- **Sentence length:** 4–8 words per page, one simple sentence or sentence-frame per page (e.g. unit 9's "yo quiero / me gusta / tengo"), never more than one new-to-this-book construction per page.
- **Vocabulary mapping:** every Spanish word in a book must already exist in `src/data/curriculum.ts` at or before the unit it's attached to — mirroring ABC's decodable-text rule, but for taught vocabulary instead of taught letter-sounds.
- **Two-language layout:** the Spanish sentence sits first, larger and bolded, in the primary reading position, with the English translation stacked directly beneath in a smaller, secondary style — never side-by-side columns, which fragments a young reader's eye.
- **Read-along highlighting:** tapping "play" reads the Spanish line aloud first with word-by-word highlighting (via the existing `speak()` function with per-word timing), then optionally the English line on a second tap — a real read-along in both languages without forcing both at once.
- **Tap-a-word:** any single word, Spanish or English, is tappable to hear it again, reusing `SpeakButton` — the same interaction as ABC's tap-to-hear.
- **End-of-book check:** one spoken, four-button comprehension question per book (Kahoot-color buttons, matching existing exercise UI), paying out papayas/XP through the same economy as a lesson.
- **Unlock rule:** a book unlocks when its linked unit reaches its first complete lesson; finishing the book once pays a one-time papaya/ticket bonus, mirroring the "first time on a lesson" bonus in CLAUDE.md §9.

**Eight example book titles (household Spanish only, one-line plot each):**

1. *A Comer* — Mamá calls everyone to the table for arepas and jugo, but Junior's dog wants a bite too.
2. *Buenas Noches, Mi Amor* — A bedtime routine of brushing teeth, pajamas, and a goodnight kiss from abuela.
3. *Lávate las Manos* — Before dinner, a messy hero has to find water, soap, and a towel before Papá lets them eat.
4. *¿Dónde Está el Gato?* — A hide-and-seek search through the casa's rooms to find a mischievous gato.
5. *Mi Ropa Favorita* — Getting dressed on a cold day: camisa, zapatos, and a debate over whether it's really "hace frío" enough for a cape.
6. *El Cumpleaños de Abuela* — The family picks colors and counts candles from uno to diez to decorate for abuela's birthday.
7. *Vamos al Parque* — A trip to play pelota and spot un perro, un pájaro, and a pez in the park pond.
8. *Ven Aquí, Hermanito* — A big sibling teaches a little one their first words — hola, te quiero, mi amor — ending in a shared buenas noches.

---

## Sources

- [Duolingo ABC — Learn to Read, App Store](https://apps.apple.com/us/app/learn-to-read-duolingo-abc/id1440502568)
- [Learn to Read — Duolingo ABC, Google Play](https://play.google.com/store/apps/details?id=com.duolingo.literacy&hl=en_US)
- [Duolingo ABC — Learn to Read, Common Sense Media (parent guide & review)](https://www.commonsensemedia.org/app-reviews/duolingo-abc-learn-to-read)
- [Duolingo ABC — Learn to Read, Common Sense Education (teacher reviews)](https://www.commonsense.org/education/reviews/duolingo-abc-learn-to-read)
- [Common Sense Privacy Evaluation for Duolingo ABC](https://privacy.commonsense.org/evaluation/Duolingo-ABC---Learn-to-Read)
- [Duolingo ABC — official "How We Teach" page](https://abc.duolingo.com/how-we-teach)
- [Duolingo ABC Scope and Sequence: English (2022), PDF](https://lit-lessons-cdn.duolingo.com/resources/duolingo_abc_scope_and_sequence_english.pdf)
- [TechCrunch — "Duolingo's new app teaches children how to read and write" (Mar. 26, 2020)](https://techcrunch.com/2020/03/26/duolingos-new-app-teaches-children-how-to-read-and-write/)
- [9to5Mac — "Duolingo ABC arrives as free interactive iOS app"](https://9to5mac.com/2020/03/26/duolingo-abc-learn-to-read-ios-free-app/)
- [Duolingo (@duolingo) on X, launch announcement thread, March 2020](https://x.com/duolingo/status/1243175091334152193)
- [Duolingo Investor News — "Veteran Animation Executive Linda Simensky Joins Duolingo"](https://investors.duolingo.com/news-releases/news-release-details/veteran-animation-executive-linda-simensky-joins-duolingo)
- [Duolingo Blog — "Shape language: Duolingo's art style"](https://blog.duolingo.com/shape-language-duolingos-art-style/)
- [Duolingo Blog — "A good read: building Duolingo ABC for Android"](https://blog.duolingo.com/a-good-read-building-duolingo-abc-for-android/)
- [Duolingo ABC, Duolingo Wiki (Fandom)](https://duolingo.fandom.com/wiki/Duolingo_ABC)
- [Duolingo Character Names guide, duoplanet.com](https://duoplanet.com/duolingo-character-names/)
- [Duo ABC review, LearningWorks for Kids](https://learningworksforkids.com/apps/duo-abc/)
- [Duolingo ABC Review, EducationalAppStore](https://www.educationalappstore.com/app/duolingo-abc)
- [The GIANT Room — "Report: Duolingo ABC Playtesting & Prototyping Series"](https://www.thegiantroom.com/blog/05/31/2023/report-duolingoabc-playtesting-session)
- [SmartBrief — "Strengthen early literacy skills with Duolingo ABC"](https://www.smartbrief.com/original/strengthen-early-literacy-skills-with-duolingo-abc)
- [Duolingo ABC Cost & Review (2026), alephlab.ai](https://alephlab.ai/a/compare/duolingo-abc-cost-and-review)
- [Duolingo for Kids: Pros and Cons for Parents, Findmykids blog](https://findmykids.org/blog/en/duolingo-for-kids)
- [Duolingo for Kids: An Honest Review from a Home Educating Mum, darlingmellow.co.uk](https://darlingmellow.co.uk/duolingo-kids-review-home-education/)
- [Duolingo ABC — WISE Score & Parent Review, Screenwise](https://screenwiseapp.com/media/duolingo-abc-app)
- [Duolingo ABC review for families, SafeAppsForKids](https://safeappsforkids.com/en/app/learn-to-read---duolingo-abc-global/)
- [Duolingo ABC — Kids App Review, kidsappreview.com](https://kidsappreview.com/app/duolingo-abc/)
