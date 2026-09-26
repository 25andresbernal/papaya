# Kids' Game Design Research — for Papaya

**Purpose:** Ground Papaya's design (Spanish learning for ages 5-10, in English-speaking homes with a Spanish-speaking parent) in what already works — and what backfires — in the best kids' learning and gamification apps. Papaya's core bet is "learning is the currency that buys fun": lessons earn points, points unlock collectible characters, cosmetics, and real mini-games. This report surveys the games that pioneered each piece of that loop, the reward-economics research behind it, the ethics of chance-based rewards for children, and concrete mini-game ideas buildable in React.

---

## 1. Prodigy Math — the gold standard for "learning gates fun," and its cautionary tale

Prodigy wraps math practice in an RPG battle system. A kid picks a wizard, walks a top-down **world map** split into themed islands, and gets pulled into a **battle** against a monster or rival wizard when they bump into one. Combat is turn-based: answering a math question correctly generates **Magic Points**, which the kid spends to cast a **spell**. Spells have elemental types (fire, water, plant, etc.) and a rock-paper-scissors-style strength chart against the enemy's element — so part of the "game" is choosing the right spell, not just getting the math right. Some **Epic Spells** are free to cast (no energy cost) and serve as high-value payoffs. During **pet battles**, weakening a wild monster with the right elemental spell lets the kid catch and add it to a collection, which can then be leveled up and evolved. Players can bring multiple pets into a fight to cover more than one element. ([Prodigy: What is Prodigy Math?](https://www.prodigygame.com/main-en/blog/what-is-prodigy-math-game), [Prodigy: Battling in Prodigy Math](https://prodigygame.zendesk.com/hc/en-us/articles/12910978061844-Battling-in-Prodigy-Math))

**Why the loop works:** the math question isn't a gate the kid must clear before the game resumes — it *is* the action that produces the resource (Magic Points) spent on the fun part (the spell). That's the single most important structural idea to borrow.

**Where it breaks down, per parents/critics/researchers:**
- **Math is bolted on, not woven in.** Critics note Prodigy's actual math problems are "essentially the same rote memorization you can find on worksheets anywhere" — they don't get easier or harder based on *how* the kid is playing, and they don't touch the fantasy at all (a jaguar doesn't care if you multiply or divide). ([Nibble Blog review](https://nibble-app.com/blog/prodigy-review))
- **Grinding.** Kid reviewers on Common Sense Media specifically flag "too much grinding" — repetitive fights with little new content. ([Common Sense Media parent/kid reviews](https://www.commonsensemedia.org/app-reviews/prodigy-kids-math-game/user-reviews/adult))
- **Aggressive monetization pressure.** Membership runs roughly $9-10/month (or ~$5-8/month annualized), up to ~$120/year, across Core/Level Up/Ultimate tiers. Free players are shown pets, gear, and epic spells they cannot get, and a Change.org petition ("Make Prodigy Math Game not Pay-Win") accuses the game of gating pet evolution behind payment or forced ad-views. ([Prodigy: Is Membership Worth It?](https://www.prodigygame.com/main-en/blog/is-prodigy-membership-worth-it), [Change.org petition](https://www.change.org/p/make-prodigy-math-game-not-pay-win))
- **Advocacy-group criticism.** Fairplay for Kids argues the reward loop doesn't map cleanly to learning outcomes and that upgrade prompts appear *mid-lesson*, not just between sessions — raising the question of how much of a session is actually spent learning versus being marketed to. ([Fairplay for Kids: 7 reasons to say no to Prodigy](https://fairplayforkids.org/pf/prodigy/))
- **Mixed evidence of efficacy.** At least one district reported "modest but measurable" score improvements from regular classroom use, but most reviewers say it can't replace real instruction and works best as supplementary practice. ([Brighterly review](https://brighterly.com/blog/prodigy-math-reviews/))

**Takeaway for Papaya:** copy the "answer = resource → resource = spell/fun" structure and the world-map-of-themed-zones metaphor. Reject the free-vs-paid content split entirely (Papaya has no accounts/no monetization pressure per Mundo Quest's own v1 scope) and make sure the *fun* content — mini-games — periodically requires actual new Spanish, not just banked points, so grinding old lessons doesn't fully replace learning.

---

## 2. Kahoot — why the speed quiz feels like an arcade moment

Kahoot's feel comes from a small number of reinforcing mechanics stacked together: a visible **countdown timer** that creates urgency, **four big colored answer tiles**, **speed-weighted scoring** (faster correct answers score more), an **Answer Streak Bonus** that rewards consecutive correct answers and resets on a miss, and a **podium** at the end that publicly celebrates the top finishers. ([Kahoot: How points work](https://support.kahoot.com/hc/en-us/articles/115002303908-How-points-work), [Kahoot: Answer Streak experiment](https://medium.com/inside-kahoot/experimenting-with-answer-streaks-to-help-make-learning-awesome-3b3357e42595))

Two nuances worth stealing:
- Kahoot found that **players cared more about protecting their streak than about their raw point total** — the "don't break the chain" feeling is a stronger motivator than a bigger number. That validates leaning on combo/streak counters (already in Mundo Quest's Battle Mechanic Spec) over pure point maximization.
- Kahoot *added* the streak bonus specifically because pure speed-scoring created a "rush to answer" problem — fast, careless guessing beats careful, correct answers. Kahoot's own team calls this out as a balance issue they had to design around. ([Kahoot: Developing new game mechanics](https://medium.com/inside-kahoot/developing-new-game-mechanics-at-kahoot-be7ddb52f6df))

**Takeaway for Papaya:** the four-color-button, countdown-timer format is a proven, high-energy shell — keep it. But for 5-10 year-olds (and per the reading-level/no-time-pressure-for-youngest UX rules below), consider a longer or optional timer for the youngest players, and weight the reward toward *correctness with a reasonable speed band* rather than raw milliseconds, so a careful 6-year-old isn't structurally punished versus an impulsive one.

---

## 3. Other kids' apps worth stealing from

| App | Mechanic worth copying |
|---|---|
| **Khan Academy Kids** | Free, ad-free, and adapts difficulty to the child's actual level in real time — a model for "invisible" adaptive difficulty that doesn't feel like a placement test. ([Khan Academy blog](https://blog.khanacademy.org/best-early-learning-apps-for-kids/)) |
| **Lingokids** | "Playlearning" — curriculum content is stitched directly into the play mechanic so the child never perceives a "now it's quiz time" mode-switch; 1200+ activities span subjects without ever feeling like schoolwork. Steal the principle of *dissolving* the learning/play boundary rather than alternating between two modes. ([Lingokids overview](https://www.mmguardian.com/blog/learning-apps-for-kids)) |
| **Endless Alphabet** | Turns each vocabulary word into a tiny animated sketch (monsters act out the word) plus a drag-the-letters puzzle to spell it — vocabulary becomes a physical, funny, memorable event instead of a flashcard. Directly portable to Spanish vocabulary teaching. ([nipsapp roundup](https://nipsapp.com/top-10-kids-learning-games-2025/)) |
| **Gus on the Go** | Wraps vocabulary lessons inside a familiar story (e.g., Three Little Pigs) and unlocks a mini-game as a reward for finishing a lesson chunk — a clean, simple version of exactly Papaya's "lesson unlocks play" loop, worth studying as a build-complexity floor. ([nipsapp roundup](https://nipsapp.com/top-10-kids-learning-games-2025/)) |
| **Homer** | Personalizes a learning path per child (name, interests) and leans hard on read-aloud narration so pre-readers are never blocked by text — steal the "every word is voiced, nothing is silent" rule. |
| **ABCmouse** | A literal step-by-step curriculum map with a visible path and prize tickets earned per activity, redeemable in a virtual prize store — an early, simple prototype of exactly the "points buy stuff" loop Papaya wants, worth reviewing for its reward-store pacing. |
| **Toca Boca** | Zero rules, zero time limits, zero win/lose state — pure sandbox creativity (dress-up, room decorating, interactive objects). No in-app ads, no competitive pressure. Steal this for the *cosmetics/customization* layer: hero customization and the shop should feel like this — playful and pressure-free, not a graded activity. ([Toca Boca design summary](https://www.taroo.ai/blog/better-tocaboca-alternatives)) |
| **PBS Kids games** | Attaches familiar TV characters and social situations to a clear single learning goal per game (an emotion, a reading skill) — steal the "one game, one clear skill, familiar face" simplicity. |
| **Pokemon-style collection** | The "gotta catch 'em all" structure (visible checklist of what's missing, rarity tiers, evolution as a second-order reward for the same creature) is the most durable collection mechanic in gaming — pair it with Papaya's character collectibles so kids see *exactly* what's left to earn, which drives completionist motivation without needing chance mechanics. |

---

## 4. Reward and unlock economics: making the currency feel fair, not like a paywall

**The core design tension:** if "learning is the currency," the currency must arrive reliably and generously enough that a 6-year-old never feels cheated, while unlocks must feel special enough that they're worth wanting. Three ideas from the wider reward-economy literature apply directly:

- **Sources, sinks, and gates.** A reward economy has *sources* (ways to earn currency — lessons, streak bonuses, daily chests), *sinks* (ways to spend it — characters, cosmetics, game unlocks), and *gates* (content locked behind a currency threshold). Gates work best when they're a "pay X to open the next area" speed bump, not an artificial wall that requires grinding old content to pass. ([DEV.to: How to Design a Game Economy](https://dev.to/hiroshi_takamura_c851fe71/how-to-design-a-game-economy-sources-sinks-loops-and-balance-j05))
- **Escalating daily rewards.** The proven pattern (used across mobile games and Duolingo) is a 5-7 day cycle where each day's login/completion reward is a little better than the last, with a clearly bigger prize on day 7, which is what makes the *cycle itself* worth protecting rather than any single day's prize. ([egamersworld: daily bonuses](https://egamersworld.com/blog/how-daily-bonuses-and-login-rewards-work-in-social-98CGDRjJw))
- **Duolingo's stack, in miniature.** Gems (currency) are earned from lessons and quests, spent on Streak Freezes, Streak Repair, and XP/Timer Boosts; introducing **Leagues** (a lightweight, low-stakes leaderboard) alone lifted lesson completion 25%. Streak Freezes specifically exist to soften the punishment of a missed day so one bad day doesn't end the whole habit. ([Duolingo Streak Freeze breakdown](https://duoplanet.com/duolingo-streak-freeze/), [Deconstructor of Fun: Duolingo streaks](https://duolingo.deconstructoroffun.com/mechanics/streaks))

### Variable rewards and "mystery eggs" — proceed carefully

Uncertain rewards are neurologically stickier than fixed ones: dopamine spikes on *anticipation*, not receipt, which is exactly the mechanism behind slot machines and loot boxes, and behind Skinner's classic finding that variable-ratio reinforcement produces more compulsive repeated behavior than a fixed schedule. ([Yu-kai Chou: Mystery Box Reward Design](https://yukaichou.com/advanced-gamification/decoding-the-mystery-box-a-dive-into-the-intricacies-of-reward-design/), [ESET: Gaming or gambling?](https://www.welivesecurity.com/en/kids-online/gaming-gambling-lifting-lid-in-game-loot-boxes/))

For children specifically, this is not a neutral mechanic. Peer-reviewed research has found reproducible associations between loot-box engagement and problem gambling/problem gaming, and child-development researchers describe loot boxes as a gambling-adjacent system many kids don't recognize as gambling at all. ([PMC: loot box engagement research](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10731324/), [Taylor & Francis: children's experiences of loot boxes](https://www.tandfonline.com/doi/full/10.1080/24694452.2023.2248293))

**If Papaya uses a "mystery egg," it must be ethically bounded, not a real gacha:**
1. **No real-money purchase path, ever** — the egg can only be earned through learning, never bought. (This is already guaranteed by Papaya having no monetization.)
2. **A guaranteed floor ("pity" mechanic).** Every egg contains *something* of real value — never an empty or purely negative outcome. Screenwise and others call this the ethical floor of mystery-box design: "never let a user walk away empty." ([Screenwise: loot boxes and variable rewards](https://screenwiseapp.com/guides/loot-boxes-and-variable-rewards))
3. **Bounded, visible odds, not deceptive ones.** Show the child a short list/checklist of what's in the pool, and let rare items become guaranteed after N eggs (a "duplicate protection" or "pity counter") so persistence — not luck — is what ultimately determines full collection.
4. **Frequency, not depth.** Reserve chance for a *small* slice of the economy (say, one bonus egg per day) — the main currency-to-character purchase path should be a transparent, fixed price, so a kid can always plan and choose rather than gamble.

**Collection completion, evolution, and sticker books** are the ethically clean alternative to chance and should carry most of the weight: a visible "collection book" with silhouettes of un-earned characters (borrowed from Pokedex/Pokemon UX) turns "collect them all" into a transparent checklist rather than a gamble, and character evolution (a creature visibly growing/leveling as the kid keeps practicing) gives a second reward moment for the same collectible without needing randomness at all.

---

## 5. Twelve mini-game candidates for a React web app

All are designed for mouse or touchscreen only (no keyboard, no drag-precision beyond big targets), playable by a 6-year-old, and buildable without a physics engine or complex assets.

1. **Fruit/Piñata Smash** — Spanish words fall or float across the screen; the kid taps/clicks the one matching a spoken prompt ("¿Dónde está la manzana?") to pop it with a burst animation. Controls: single tap. Spanish: direct vocabulary review, reusable indefinitely as pure reward play with word-of-the-day variation. Complexity: **Small**.
2. **Matching Pairs (Memory)** — classic flip-two-cards matching game, using word/picture pairs instead of generic icons. Controls: tap two tiles. Spanish: strong, tests word-picture association. Complexity: **Small**.
3. **Feed the Pet** — a collected pet character sits on screen; foods with Spanish labels scroll by and the kid drags/taps the correct one into its mouth for a happy animation and a small XP tick. Controls: tap or drag-to-drop (large target). Spanish: vocabulary reinforcement, but can also run as pure reward play (no prompt, just care for the pet). Complexity: **Small-Medium**.
4. **Coloring Book** — free digital coloring of a hero, mascot, or unlocked character with a simple palette; no failure state at all. Controls: tap-to-fill regions or simple brush drag. Spanish: none — pure reward/ownership play (Design DNA principle 4). Complexity: **Small**.
5. **Dress-Up / Hero Customizer** — drag hats, capes, and accessories (shop items) onto the hero and see them combine live. Controls: drag-and-drop among a handful of large slots. Spanish: none — pure reward play, doubles as the existing "hero customization" feature. Complexity: **Small-Medium**.
6. **Balloon Pop Counting/Colors** — balloons carrying numbers or colors float up; pop the one called out in Spanish ("¡el globo azul!"). Controls: tap. Spanish: numbers/colors vocabulary from Level 2. Complexity: **Small**.
7. **Simple Maze/Path Runner** — the hero auto-walks or taps-to-advance along a path collecting coins shaped like Spanish word tiles, occasionally forced to pick the correct-language tile to keep moving. Controls: tap-to-move or tap-to-choose at forks. Spanish: light integration (word choice at forks); can be run in a "pure fun" mode with no words. Complexity: **Medium**.
8. **Whack-a-Word** — moles/animals pop out of holes holding word cards; tap the one matching the prompt before it ducks back down (Kahoot-style but self-paced, no shared timer pressure). Controls: tap. Spanish: strong, vocabulary drill disguised as an arcade game. Complexity: **Small-Medium**.
9. **Puzzle Piece Reveal** — completing lessons awards puzzle pieces that assemble into a picture of a new creature/scene; the mini-game itself is just dragging 6-9 large jigsaw pieces into place. Controls: drag-and-drop with magnetic snapping. Spanish: none directly, but the completed image can be the "reward reveal" for a themed word set. Complexity: **Medium** (needs image-slicing + snap logic).
10. **Rhythm Tap / Music Game** — simple 4-lane rhythm game (like a toddler-friendly Kahoot button mash) synced to a background song, tapping colored circles as they reach a line. Controls: tap on beat. Spanish: none — pure reward play, leans on the "sound and music" Design DNA pillar. Complexity: **Medium** (needs beat-mapping and timing logic).
11. **Fishing Game** — cast a line by tapping/holding, reel in fish that have Spanish words on them, must catch the fish matching a prompt while avoiding "junk" fish. Controls: tap-and-hold then release (or simple tap-to-cast/tap-to-reel). Spanish: moderate, works as a themed vocabulary sorter (Level 3 Amazon jungle river variant). Complexity: **Medium**.
12. **Pet Battle Arena (mini Prodigy)** — the collected pets face off in a simplified, non-random turn-based clash (tap an attack button; outcome is deterministic/visual, not stat-based) purely as a showcase for the pets the kid has earned — no learning content, just a stage to enjoy owned collectibles. Controls: tap 1 of 2-3 large attack buttons. Spanish: none — pure reward/ownership play. Complexity: **Large** (needs animation states, simple AI, and win/lose sequencing that must still feel gentle per the "no harsh fail screen" rule).

---

## 6. Age-appropriate UX rules (ages 5-10)

- **Tap targets:** young children need touch targets roughly **2cm x 2cm** — about 4x the ~1cm adult-app minimum — because fine motor control (and precision dragging) is still developing. Favor tap-to-select over drag-and-precision wherever a 5- or 6-year-old will be the one interacting. ([NN/g: Design for Kids by Physical Development](https://www.nngroup.com/articles/children-ux-physical-development/))
- **No time pressure for the youngest.** Timed mechanics (Kahoot-style countdowns) should be optional or generously long for the 5-6 age band, tightening only for 8-10 year-olds who can handle the pressure as part of the fun — this matches Mundo Quest's own instinct to keep the loop "immediate feedback," which is different from "fast."
- **Reading level and audio-first.** Text should assume many players are pre-readers or early readers: every word shown must also be spoken aloud, icons and animation should carry meaning without requiring text, and any text that does appear should be large (14pt+) and short. ([Ungrammary: UX tips for children's apps](https://www.ungrammary.com/post/designing-for-kids-ux-design-tips-for-children-apps), [Gapsy: UX Design for Kids](https://gapsystudio.com/blog/ux-design-for-kids/))
- **Avoid text-heavy screens.** Replace instructions with a character demonstrating the action, or a single spoken sentence, rather than paragraphs.
- **Session length.** Attention span for the youngest band (4-6) runs roughly 8-12 minutes per task; design each play unit (a Word Battle, a mini-game round) to comfortably finish inside that window with a natural, celebratory stopping point — this aligns with Mundo Quest's 3-5 minute session target, which sits safely inside the range. ([mmguardian: learning app roundup](https://www.mmguardian.com/blog/learning-apps-for-kids))
- **Parent gates.** Any settings, purchases, or exit-to-outside-content screen needs a simple "parent gate" (e.g., a math problem an adult can solve quickly, or a press-and-hold) to prevent an unsupervised child from leaving the app or changing settings — standard practice even in apps with no real purchases, because it also protects against accidental data resets. ([thisisglance: designing safe apps for kids](https://thisisglance.com/learning-centre/how-do-i-design-apps-that-kids-can-use-safely))
- **COPPA basics for a local-only app.** Because Mundo Quest/Papaya stores everything in `localStorage` with no accounts and no server, most COPPA data-collection obligations (verifiable parental consent for collecting personal information, data retention/deletion rights) simply don't attach — there's no personal information leaving the device. The one thing still worth doing even in a local-only app: never ask the child to type their real name, birthdate, or location into a field that could later sync or be screen-recorded/shared, and keep any AI-API calls (Section 10 of CLAUDE.md) stripped of anything identifying before they leave the device.

---

## 7. Motivation science: why the reward loop can backfire, and how to guard against it

Self-Determination Theory (Deci & Ryan) holds that intrinsic motivation depends on satisfying three psychological needs: **autonomy** (feeling in control of one's choices), **competence** (a sense of mastery and growth), and **relatedness** (social connection/belonging). ([University XP: What is SDT?](https://www.universityxp.com/blog/2021/2/9/what-is-self-determination-theory))

A recent meta-analysis found gamification **does** boost perceived autonomy and relatedness, but has **minimal measurable effect on competence** — meaning badges and points alone don't reliably make kids feel *actually better at the skill*, only more engaged and social. ([Springer: gamification meta-analysis](https://link.springer.com/article/10.1007/s11423-023-10337-7))

The sharper warning: **"do X to earn Y" reward structures can undermine a child's developing intrinsic interest** in the underlying activity (the classic overjustification effect) — a kid who learns Spanish "to get the coin" may stop caring about Spanish itself once the coin stops appearing. Game mechanics protect against this only when they deliver **competence feedback** (clear signals of "you're getting better," not just "you got a coin"), **meaningful choice** (autonomy — letting the kid pick which level, which pet, which cosmetic, not railroading them), and **social/relatedness cues** (the mascot's warmth, a hero that feels like "theirs" per Mundo Quest's own Design DNA). ([Learning Scientists guest post](https://www.learningscientists.org/blog/2024/10/24))

**Practical guardrails for Papaya:**
- Always pair a currency reward with an explicit competence signal (e.g., "You knew 8 of 8 words!" not just "+400 points") so the kid's internal story is "I'm getting good at Spanish," not just "I'm earning coins."
- Preserve autonomy wherever possible: let the kid choose the order of levels within a region, which mini-game to spend points on, which cosmetic to buy — avoid a single forced linear path.
- Keep the mascot's relatedness role central — its job (per Section 17 of CLAUDE.md) is encouragement, not scorekeeping; use it to build the relatedness leg of SDT, separate from the point economy.
- **Juice every moment, not just the big ones.** Game-feel research stresses that "juice" (animation, sound, VFX, screen response) should reinforce the *core, moment-to-moment* interaction — the tap, the correct answer, the coin flying into a bag — not just be saved for rare milestones. A celebration hierarchy (small ding → combo flourish → level-up fanfare → session-end party) keeps the "immediate feedback" and "never silent" Design DNA principles alive at every layer, echoing the "five layers of confirmation" (animation, sound, VFX, camera motion, controller feedback) that make hits feel real in well-juiced games. ([Cornell CS5152: Gamefeel Critique](https://www.cs.cornell.edu/courses/cs5152/2024sp/assignments/critique4), [The Design Lab: Making Gameplay Irresistibly Satisfying](https://thedesignlab.blog/2025/01/06/making-gameplay-irresistibly-satisfying-using-game-juice/))

---

## Recommended reward economy for Papaya

A concrete starting point, tuned to be generous (never feels like a paywall — there is no wall), transparent (no hidden odds beyond one small daily chance element), and paced to a 3-5 minute session:

**Earning (sources):**
- **10 points per correct answer**, no penalty for wrong answers beyond "no points this time" (matches the "no harsh fail" spirit already in Mundo Quest's Battle Mechanic Spec).
- **+50 point completion bonus** for finishing a full Word Battle (8-10 questions), regardless of score, so simply finishing always feels worth it.
- **Perfect-round bonus:** +100 points if every question in the battle was answered correctly (rewards competence, not just participation).
- **Combo bonus:** +20 points at a 3-in-a-row streak, +50 at 5-in-a-row, +100 at 8-in-a-row within a single battle (mirrors the existing combo-counter spec and Kahoot's finding that streaks motivate more than raw totals).
- **Typical session total:** roughly **150-350 points** for one battle (80-100 from correct answers + 50 completion + streak bonuses), so a single 3-5 minute session always nets a meaningful, spendable amount.

**Daily habit layer:**
- **Daily Chest:** opens after the day's first completed battle. A 5-day escalating cycle: Day 1 = 50 points, Day 2 = 75, Day 3 = 100 + a cosmetic scrap, Day 4 = 125, Day 5 = 250 points + a guaranteed small collectible, then the cycle repeats. This mirrors the proven "escalating cycle, big day-5/7 payoff" pattern from mobile game design and Duolingo.
- **Streak Freeze:** automatically earned every 5 streak days (already specified in CLAUDE.md Section 9) — keep this; it is the single highest-leverage retention mechanic in the research and costs nothing to the kid.
- **One "Mystery Seed/Egg" per day (optional, capped):** costs 0 extra currency — it's simply available once daily as a bonus, never purchasable. Contains a small cosmetic or points; guarantee no duplicate of an already-fully-collected item, and guarantee a rare creature after **10 opens without one** (a visible pity counter shown to the kid as "X more sprouts until a surprise friend!"). This is the *only* chance-based element in the whole economy, capped in frequency and value, with a visible floor — following the ethical-design guardrails in Section 4.

**Spending (sinks):**
- **Collectible creature ("egg hatch" via points, not chance):** 300-500 points for a common creature, 800-1200 for an uncommon one, earnable in roughly 2-4 sessions — always purchasable outright with banked points, so persistence (not luck) is the primary path to a full collection.
- **Cosmetic item (hat, cape, accessory) in the shop:** 100-250 points each, matching Mundo Quest's existing "8-12 cosmetic items" shop scope.
- **Mini-game unlock:** 200-400 points to permanently unlock a new mini-game from the 12 candidates above (one-time cost, not a per-play toll) — once unlocked, a mini-game is always free to replay, so it becomes a "reward for showing up," not a second, resentment-building tollbooth.
- **Character evolution:** free (no points), triggered automatically once a creature has been "played with" (used in N mini-game sessions or fed via Feed the Pet) — this creates a second reward beat for an already-owned collectible without inventing a new currency sink.

**Guardrails baked into the numbers:** every number above is reachable through play alone, nothing requires real money (already guaranteed by Papaya's no-monetization design), the only randomness is capped at one low-stakes event per day with a visible pity floor, and completion (the shop, the collection book) is always achievable by points, never blocked by luck.

---

## Top 6 mini-games to build first (ranked)

1. **Fruit/Piñata Smash** — smallest build, most directly reinforces vocabulary, highest "immediate feedback" payoff per line of code.
2. **Matching Pairs (Memory)** — equally small, a second vocabulary-reinforcing game so kids aren't stuck with only one game mode on day one.
3. **Dress-Up / Hero Customizer** — doubles as the already-planned hero customization feature; pure reward play with no new learning logic needed, high "ownership" payoff (Design DNA #4).
4. **Feed the Pet** — ties directly into the pet/mascot-collection system, gives collected creatures an ongoing reason to be interacted with (not just displayed), moderate build cost.
5. **Whack-a-Word** — a second, more energetic vocabulary drill (channels Kahoot's arcade energy without a shared/competitive timer), good variety alongside Piñata Smash.
6. **Coloring Book** — trivially simple to build, zero learning logic, but very high perceived value for young kids and a good "cool-down" reward activity between battles.

*(Rationale: the top 6 front-load the smallest, highest-leverage builds — pure vocabulary games and pure reward games — and defer anything needing physics, snapping logic, or animation-state machines (Puzzle Reveal, Rhythm Tap, Fishing, Pet Battle Arena) to later phases, consistent with Mundo Quest's own Phase 1→2→3 build order of skeleton, then feel, then meta-game.)*

---

## Sources

- [Prodigy: What is Prodigy Math?](https://www.prodigygame.com/main-en/blog/what-is-prodigy-math-game)
- [Prodigy: Battling in Prodigy Math](https://prodigygame.zendesk.com/hc/en-us/articles/12910978061844-Battling-in-Prodigy-Math)
- [Prodigy: Is Membership Worth It?](https://www.prodigygame.com/main-en/blog/is-prodigy-membership-worth-it)
- [Common Sense Media: Prodigy parent/kid reviews](https://www.commonsensemedia.org/app-reviews/prodigy-kids-math-game/user-reviews/adult)
- [Nibble Blog: Prodigy Review](https://nibble-app.com/blog/prodigy-review)
- [Fairplay for Kids: 7 reasons to say no to Prodigy](https://fairplayforkids.org/pf/prodigy/)
- [Change.org: Make Prodigy Math Game not Pay-Win](https://www.change.org/p/make-prodigy-math-game-not-pay-win)
- [Brighterly: Prodigy Math Reviews](https://brighterly.com/blog/prodigy-math-reviews/)
- [Kahoot: How points work](https://support.kahoot.com/hc/en-us/articles/115002303908-How-points-work)
- [Kahoot: Experimenting with Answer Streaks](https://medium.com/inside-kahoot/experimenting-with-answer-streaks-to-help-make-learning-awesome-3b3357e42595)
- [Kahoot: Developing New Game Mechanics](https://medium.com/inside-kahoot/developing-new-game-mechanics-at-kahoot-be7ddb52f6df)
- [Khan Academy Blog: Best Early Learning Apps](https://blog.khanacademy.org/best-early-learning-apps-for-kids/)
- [mmguardian: Best Learning Apps for Kids](https://www.mmguardian.com/blog/learning-apps-for-kids)
- [nipsapp: Top 10 Kids Learning Games](https://nipsapp.com/top-10-kids-learning-games-2025/)
- [Taroo: Toca Boca Alternatives](https://www.taroo.ai/blog/better-tocaboca-alternatives)
- [Yu-kai Chou: Mystery Box Reward Design](https://yukaichou.com/advanced-gamification/decoding-the-mystery-box-a-dive-into-the-intricacies-of-reward-design/)
- [ESET welivesecurity: Gaming or gambling? Loot boxes](https://www.welivesecurity.com/en/kids-online/gaming-gambling-lifting-lid-in-game-loot-boxes/)
- [Screenwise: Understanding Loot Boxes and Variable Rewards](https://screenwiseapp.com/guides/loot-boxes-and-variable-rewards)
- [PMC: Loot box engagement psychological variables, part 1](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10731324/)
- [Taylor & Francis: Children's Experiences of Loot Boxes](https://www.tandfonline.com/doi/full/10.1080/24694452.2023.2248293)
- [DEV.to: How to Design a Game Economy](https://dev.to/hiroshi_takamura_c851fe71/how-to-design-a-game-economy-sources-sinks-loops-and-balance-j05)
- [egamersworld: Daily Bonuses and Login Rewards](https://egamersworld.com/blog/how-daily-bonuses-and-login-rewards-work-in-social-98CGDRjJw)
- [Duoplanet: Duolingo Streak Freeze](https://duoplanet.com/duolingo-streak-freeze/)
- [Deconstructor of Fun: Duolingo Streaks](https://duolingo.deconstructoroffun.com/mechanics/streaks)
- [NN/g: Design for Kids Based on Physical Development](https://www.nngroup.com/articles/children-ux-physical-development/)
- [Ungrammary: UX Design Tips for Children's Apps](https://www.ungrammary.com/post/designing-for-kids-ux-design-tips-for-children-apps)
- [Gapsy: UX Design for Kids](https://gapsystudio.com/blog/ux-design-for-kids/)
- [thisisglance: Designing Apps Kids Can Use Safely](https://thisisglance.com/learning-centre/how-do-i-design-apps-that-kids-can-use-safely)
- [University XP: What is Self-Determination Theory?](https://www.universityxp.com/blog/2021/2/9/what-is-self-determination-theory)
- [Springer: Gamification meta-analysis on motivation](https://link.springer.com/article/10.1007/s11423-023-10337-7)
- [The Learning Scientists: Gamified Technology and Intrinsic Motivation](https://www.learningscientists.org/blog/2024/10/24)
- [Cornell CS5152: Gamefeel Critique](https://www.cs.cornell.edu/courses/cs5152/2024sp/assignments/critique4)
- [The Design Lab: Making Gameplay Irresistibly Satisfying Using Game Juice](https://thedesignlab.blog/2025/01/06/making-gameplay-irresistibly-satisfying-using-game-juice/)
