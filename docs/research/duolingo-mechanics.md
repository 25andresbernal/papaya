# Duolingo Mechanics Research

Research pass on how Duolingo is built and why it retains users, done to inform Mundo Quest's design. Compiled September 2026 from Duolingo's own published research, the Duolingo wiki/help center, product-teardown sites, and coverage of Duolingo's former Head of Product Jorge Mazal. Duolingo A/B-tests constantly, so exact numbers (XP amounts, gem costs, league sizes) drift over time — treat them as "the shape of the mechanic," not a frozen spec.

---

## 1. Core Lesson Loop

A lesson takes **3-5 minutes**. The number of exercises isn't fixed: every wrong answer adds another exercise to the queue, so a clean run is shorter than a mistake-heavy one. Exercise types are mixed together within one lesson rather than blocked by type:

- **Select the word** — multiple choice translation.
- **Tap the pairs** — an even grid of boxes, half base-language and half target-language; tap matches to clear the board.
- **Fill in the blank** — complete a sentence with the missing word.
- **Translate** — a full sentence, typed or built from word tiles, either direction.
- **Type what you hear** — audio plays, learner transcribes it.
- **What do you hear?** — audio plays, learner picks the matching transcription from options.
- **Speak this sentence** — learner speaks aloud into the mic; speech recognition scores it (skippable without mic access).
- **Stories** — short illustrated dialogues voiced by the character cast, combining reading and listening with taps to pick the word a character just said.

Consecutive correct answers build an in-lesson **combo counter**; a long enough streak (bonus caps around a 15-in-a-row streak) adds bonus XP on top of the base reward. A lesson ends either when the exercise queue clears (success) or when hearts run out (see Section 3), bumping the learner to a "try again" state.

The **lesson-complete screen** shows total XP (base + combo bonus + any active boosts) alongside an animated mascot reaction tuned to performance — a "no mistakes" celebration, a bigger "perfect lesson" animation, a "foam finger" combo animation for a long streak — plus updated daily-goal ring, streak flame, and league position, all landing in one screen so reward and progress feedback arrive together.

## 2. Learning Path Structure

**Sections** are top-level chapters (Duolingo compares them to "a season of a TV show"). **Units** sit inside sections, are thematic (food, travel, past tense), and on the current "path" UI are deliberately small — a handful of levels each, replacing the old flat "tree's" long skill chains. **Path nodes** are laid out as a winding trail with varied icons (book, dumbbell, chest, boss character) that signal exercise variety before tapping in.

Each unit has a **guidebook** — a short, skippable grammar/vocabulary explainer available before or during the unit, so instruction is optional and just-in-time. The old tree used **checkpoints** as hard end-of-skill exams; the newer path has mostly dropped hard gates in favor of continuous flow. **Legendary levels**: after finishing a unit, a learner can replay it in Legendary mode — harder, no hints, worth a bonus trophy (~40 XP) — an optional mastery lap, not a requirement.

Free users tap the heart icon anytime for a short adaptive **practice** session mixing recently-missed words; Super subscribers get a dedicated **Practice Hub** tab with multiple curated sets (weak words, listening, timed challenges). Missed words and grammar points are automatically re-fed into future lessons and practice — the visible surface of the spaced-repetition engine in Section 4.

## 3. Gamification Systems

- **XP:** a standard lesson awards roughly **20 XP** base, plus up to ~5 bonus XP from the in-lesson combo. A Legendary replay is worth more (~40 XP). XP drives daily goals, levels, and league placement.
- **XP boosts:** timed multipliers — e.g. a "Perfect Lesson" boost (bonus XP only with zero mistakes) or a 2x XP window from quests — stack on base XP for a limited window (commonly 15-30 minutes).
- **Daily goal:** historically four tiers — Casual (~10 XP / ~5 min), Regular (~20 XP / ~10 min), Serious (~30 XP / ~15 min), Intense (~50 XP / ~20 min) — though Duolingo has shifted toward auto-setting this from a learner's own habits and streak history rather than a fixed manual pick.
- **Streaks:** consecutive calendar days the learner hits their daily goal — Duolingo's single most-cited retention lever (Section 7).
- **Streak freeze:** auto-activates the next missed day, preserving the streak instead of resetting it. Learners can hold up to **2** at once. Reported cost is roughly 200 gems (mobile) or 10 lingots (legacy web currency); freezes are also awarded at streak milestones.
- **Streak Society:** unlocks at a 7-day streak, with further tiers at 30, 100, and 365 days, granting extra streak-freeze capacity (reportedly up to 3 more) and status rewards — turning streak-keeping into a collectible identity, not just a counter.
- **Hearts:** learners start a lesson with **5 hearts**, lose one per mistake, and are locked out of new lessons at zero. Regeneration is slow (roughly one heart per 5 hours, ~1 day for a full refill), speedable via a short practice session (often paired with a rewarded ad) or spent directly with gems (reported ~350-450 gems for a refill). **Super Duolingo** and school/classroom accounts remove hearts entirely — a headline subscription selling point.
- **Gems / Lingots:** currency earned from lessons, quests, and leveling up; spent on streak freezes, heart refills, and cosmetic mascot outfits — never gameplay content, keeping monetization cosmetic rather than pay-to-win (though heart scarcity is a common free-tier friction point — Section 8).
- **Leagues:** ten weekly tiers — Bronze, Silver, Gold, Sapphire, Ruby, Emerald, Amethyst, Pearl, Obsidian, Diamond. Each cohort is randomly assigned (~30 users) and ranked by weekly XP. A **promotion zone** of top finishers moves up; the zone shrinks as tiers rise — early leagues promote 15-20 users, later ones (e.g. Obsidian into Diamond) promote as few as the top 5 — making the climb progressively harder.
- **Quests:** **Daily quests** — typically 3/day, each a small XP/accuracy challenge rewarding a gem chest. **Friends quests** — weekly, paired with a rotating partner toward a joint goal; completing it together rewards both (commonly ~100 gems plus a temporary 2x XP window each). **Monthly badges** — quest points accumulate (1 point per daily quest, ~10 per friends quest); hitting a threshold (historically 20-50 points, trending higher) earns an exclusive badge, often skinned per-month with a different character.
- **Achievements:** a permanent badge layer independent of the weekly cycle — Wildfire (streak-length tiers to 365 days), Sharpshooter/"Flawless Finisher" (mistake-free lesson counts), Scholar/"Word Collector" (words learned, 50 up into the thousands), Champion (league-tier climbing). Each has multiple levels, so a learner is almost always one small push from the next tier.
- **"Sad Duo" notifications:** push copy is explicitly built on loss aversion and parasocial guilt — a subject line like "You made Duo sad" reportedly outperformed neutral alternatives by a meaningful margin in Duolingo's own testing, with sad/crying mascot art deployed specifically when a streak is at risk. The tactic escalates: after repeated unopened reminders, copy shifts to reverse-psychology framing ("we'll stop bothering you," "guess this language isn't for you") to provoke a learner into proving the app wrong. It's also throttled by response data — ignored reminders or a lapsed streak get that notification channel scaled back, not escalated indefinitely.

## 4. Spaced Repetition and Adaptive Difficulty

**Half-life regression (HLR)**, published by Duolingo Research (Settles & Meeder, ACL 2016), is the core spaced-repetition model. Every studied word gets a "half-life" — time until a 50% chance of having forgotten it — and recall probability decays exponentially relative to that half-life, updated continuously from the learner's own answer history (correct/incorrect, response time, time since last seen) rather than a fixed schedule. When HLR replaced Duolingo's earlier review system, reported gains were roughly **+9.5% practice-session retention, +1.7% lesson retention, +12% overall activity**.

**Birdbrain** is the successor system, folding memory-decay tracking into a unified model that, per learner and session, personalizes on the order of a billion-plus exercises daily. Duolingo also rewrote its session-generation service (in Scala), reportedly cutting lesson-generation latency from ~750ms to ~14ms — personalization only works if it isn't felt as lag. The visible product: practice sessions and mistake-review are weighted toward words a learner is statistically about to forget, not shuffled randomly — the same goal behind Mundo Quest's planned AI-personalized question selection.

## 5. Duolingo ABC and Duolingo for Kids

**Duolingo ABC** (ages ~3-8) teaches English reading/phonics, is a fully separate app from the flagship product, and is free, ad-free, with no in-app purchases. It packs 700+ short self-contained lessons (~5 minutes each), uses multi-sensory input (tracing, drag-and-drop, tapping) instead of text-heavy multiple choice, and has **no social layer at all** — no friends, chat, leaderboard, or streak-based comparison. It's built to be usable by a young child with zero adult supervision.

On the **flagship app**, under-13 users get parent-linked child accounts that strip the competitive layer — leaderboards and friend-adding are disabled — because Duolingo has concluded leagues, streak-loss guilt, and social comparison suit teens/adults but are "too much" for younger kids. What's removed for young users: timers/urgency, competitive leaderboards, streak-shaming copy, any friend graph. What's kept or added: stickers/rewards, character stories, short and forgiving sessions.

## 6. Character Cast

Beyond Duo (green owl, the face of notifications), a full ensemble recurs across exercises and Stories, each with a distinct look, personality, and color: **Lily** (deadpan, purple-haired teen, dry humor), **Zari** (Lily's outgoing, type-A best friend, wears a hijab), **Bea** (energetic, confident, afro; often paired with Junior), **Eddy** (Junior's sporty, easygoing dad), **Junior** (Eddy's curious 8-year-old son, obsessed with frogs — the closest character in age to Mundo Quest's own player), **Oscar** (warm, mustachioed, food/culture stories), **Vikram** (suave, confident adult), **Lucy** (older woman, Lin's grandmother, the "wise elder" voice), **Lin** (Lucy's tomboyish granddaughter, casual/slang dialogue), and **Falstaff** (a scarf-wearing bear, secondary comic mascot).

Recurring relationships (Lily & Zari's friendship, Eddy & Junior's father-son dynamic, Lucy & Lin's grandmother-granddaughter pair) turn isolated vocabulary drills into a continuing story a learner wants to follow, independent of the vocabulary itself. Consistent per-character colors make them instantly recognizable in small thumbnails, and the same characters voice listening exercises, so learners build familiarity with specific "voices," not just abstract audio.

## 7. Retention Data and the Growth Model

The most detailed public account comes from Jorge Mazal, Duolingo's former Head of Product/CPO, describing a multi-year effort starting when he joined in late 2017 (DAU growth had slowed to single digits). Over roughly four years, Duolingo raised what it calls CURR (a current/retention rate measure) by about **21%**, translating into cutting daily churn among its most engaged users by **over 40%**. That compounded into a reported **4.5x increase in DAU**. The share of DAU with a 7+ day streak nearly tripled, rising to over **half** of all daily actives — streaks went from a superfan behavior to the majority behavior.

Three levers are credited: (1) introducing **leaderboards/leagues**, (2) a disciplined focus on **push notifications**, and (3) deliberately optimizing the **streak** mechanic — including the finding that crossing roughly a **10-day streak** substantially reduced a learner's odds of dropping off (a threshold effect, not linear). Notifications were adaptive, not indefinite spam: a week of ignored reminders suppressed that channel, and streak/leaderboard nudges were pulled back once a learner clearly disengaged. This is the strongest evidence that Duolingo's DAU growth was a **behavioral-loop story** — daily habit formation, competitive pressure, and tuned reminder psychology — layered on an already-good lesson product, not primarily a content story.

## 8. Criticisms

- **Hearts as frustration:** the shift from a forgiving mistake allowance to a slowly-regenerating heart economy is the most consistently cited free-tier complaint — running out can lock a motivated learner out for hours without ads, gems, or a subscription.
- **Ad load:** free-tier users report lesson segments interrupted by lengthy, sometimes unskippable ads, with some accounts describing ad time approaching or exceeding lesson time.
- **Monetization creep:** a recurring post-IPO critique is that gamification, meant to serve learning motivation, has been increasingly tuned toward subscription conversion — heart scarcity, upsell prompts, and streak-repair paywalls.
- **Guilt notifications as a dark pattern:** "sad Duo" and reverse-psychology copy draw direct criticism as manipulative, fostering an anxious relationship with what should be low-stakes learning.
- **Depth vs. engagement:** language-learning communities argue the format optimizes for streaks and app engagement over durable fluency, with badges/leagues/XP becoming the goal rather than a proxy for learning.
- **Nothing validated for young kids in the core loop:** no source found a version of the flagship loop (streaks, leagues, guilt notifications, ads, heart scarcity) considered healthy for a 6-10-year-old. Duolingo's own answer is to strip those mechanics out entirely for young users (ABC, restricted child accounts) rather than adapt them — a signal the core engagement engine is built for teens/adults, not young children.

---

## What Papaya (Mundo Quest) Should Copy

1. **A visible streak with a forgiving safety net.** Streak freeze (auto-activating, capped at a small stored number, earned as well as bought) is Duolingo's best-evidenced retention lever — copy its shape, not necessarily its currency cost.
2. **A daily goal small enough to always be winnable.** Duolingo's "Casual" 5-minute tier is the model for Mundo Quest's 3-5-minute session — it should never feel like homework.
3. **Layered feedback plus one big payoff screen.** Combo counters, performance-tuned mascot animations, and a single victory screen showing every reward at once map directly onto Design DNA principles 1 and 3.
4. **Weighted review of missed words, not random review.** Half-life regression's "surface what's about to be forgotten" is exactly the AI-personalized question selection already planned in CLAUDE.md Section 10 — Duolingo's own reported lift (+9.5% practice retention, +12% activity) justifies prioritizing it.
5. **A recurring character cast with real relationships**, not just one mascot, to give story beats continuity kids want to follow.
6. **Optional mastery replay, not mandatory gates.** Let a confident kid replay a level for a bonus reward without blocking new content behind a hard checkpoint.

## What Papaya Should Do Differently for Kids Ages 5 to 10

1. **No competitive leaderboards or leagues.** Duolingo disables this for its own under-13 accounts — skip social ranking entirely in v1, matching current CLAUDE.md scope.
2. **No guilt-based or "sad mascot" notifications.** "Sad Duo" is built on loss aversion aimed at adults embarrassed to disappoint an app; a young child's mascot should stay warm even on a missed day, matching CLAUDE.md's "let us try again" tone rule.
3. **No scarcity-based lives that lock a motivated kid out for hours.** Duolingo's heart-depletion-plus-paywall pattern is the most criticized mechanic; Mundo Quest's "energy bar hit but the creature stays a friend anyway" failure state is the healthier version — never turn a mistake into a multi-hour lockout.
4. **No ads, ever.** Duolingo ABC's own answer for young children is fully ad-free and IAP-free; Mundo Quest's local-storage-only v1 should hold that line by design.
5. **Simpler, multi-sensory exercise variety for early readers**, closer to ABC's tracing/drag-and-drop style than the flagship app's dense translation exercises, driven by the 7-year-old reading-level guard already in CLAUDE.md.
6. **Make streaks about pride, not fear of loss.** Keep the mechanic but frame every touchpoint around what the kid is building, avoiding Duolingo's reverse-psychology notification pattern entirely.
7. **Keep any future parent visibility low-pressure.** Duolingo has no parent dashboard in its main product; when Mundo Quest builds one (v5), make it a summary, not a leaderboard.

---

## Sources

- https://duolingo.fandom.com/wiki/Lesson
- https://duolingo.fandom.com/wiki/XP
- https://duolingo.fandom.com/wiki/Exercise
- https://duolingo.fandom.com/wiki/Combo_bonus
- https://duolingo.fandom.com/wiki/Streak
- https://duolingo.fandom.com/wiki/Gem
- https://duolingo.fandom.com/wiki/Hearts
- https://duolingo.fandom.com/wiki/League
- https://duolingo.fandom.com/wiki/Quests
- https://duolingo.fandom.com/wiki/Achievements
- https://duolingo.fandom.com/wiki/Category:Main_Characters
- https://www.duolingo.com/help/what-is-a-streak
- https://www.duolingo.com/help/leaderboards-and-league
- https://duoplanet.com/duolingo-streak-freeze/
- https://duoplanet.com/duolingo-leagues-the-essential-guide-everything-you-need-to-know/
- https://duoplanet.com/duolingo-units-and-checkpoints/
- https://duoplanet.com/duolingo-learning-path/
- https://duoplanet.com/duolingo-perfect-lesson-boost/
- https://duoplanet.com/duolingo-challenges/
- https://duoplanet.com/duolingo-achievements-guide/
- https://research.duolingo.com/papers/settles.acl16.pdf
- https://github.com/duolingo/halflife-regression
- https://www.techaheadcorp.com/blog/how-duolingo-personalizes-learning/
- https://www.buildmvpfast.com/blog/ai-learning-personalization-duolingo-ai-driven-lessons-2026
- https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth (Jorge Mazal, "How Duolingo reignited user growth")
- https://www.reachcapital.com/resources/thought-leadership/product-lessons-from-duolingos-former-chief-product-officer-jorge-mazal/
- https://www.trypropel.ai/resources/blogs/duolingo-customer-retention-strategy
- https://opinionsandconditions.substack.com/p/duolingo-owl-dark-patterns-digital-guilt
- https://aftermath.site/duolingo-gamification/
- https://www.classcentral.com/report/duolingo-please-control-your-ads/
- https://divinations.substack.com/p/why-duolingos-gamification-is-a-trojan-horse
- https://www.commonsense.org/education/reviews/duolingo-abc-learn-to-read
- https://darlingmellow.co.uk/duolingo-kids-review-home-education/
- https://findmykids.org/blog/en/duolingo-for-kids
- https://www.commonsensemedia.org/app-reviews/duolingo
