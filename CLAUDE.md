# CLAUDE.md

> **Source of truth for the Mundo Quest project.** This file is read by Claude Code (and any other AI assistant) at the start of every session. Keep it accurate, keep it lean, and update it as decisions are made.

---

## 1. Project Identity

- **Working name:** Mundo Quest
- **One-line mission:** A Spanish-learning adventure game for kids ages 6 to 10 who live in non-Spanish-speaking countries and want to learn the language in a way that feels like play, not school.
- **Built by:** A father-and-son team. The son is 8 years old and learning to code alongside the build. All explanations, comments, and commit messages should be understandable to a smart 8-year-old where possible.

---

## 2. Vision

Mundo Quest is the lovechild of three apps:

- **Prodigy** gives us the spine. Kids pick a hero, travel a world map of Spanish-speaking regions, and beat friendly creatures in battles. Learning is the way to win, not the point.
- **Duolingo** gives us the habit. Daily streaks, XP, levels, a friendly mascot, and a streak freeze pull kids back tomorrow and the day after.
- **Kahoot** gives us the thrill. Fast 6-second timers, four big colorful buttons, catchy music, instant feedback, and big celebrations make every answer feel like an arcade moment.

The combination is the differentiator. Duolingo is not built for kids. Prodigy is math-only. Kahoot is a quiz tool, not a journey. Mundo Quest is all three at once, designed from the ground up for a child reader of simple English learning Spanish.

---

## 3. Target User

- **Primary:** Children ages 6 to 10 who can read simple English (cat, dog, run, jump) and who live in households where Spanish is not the dominant language at home.
- **Secondary:** Parents (often with Latin American heritage) who want their kids to connect with the language and culture without nagging.
- **Reading level guard:** Any text shown to the kid must be readable by an average 7-year-old. Short words, short sentences, no jargon.

---

## 4. Design DNA

Four principles every screen and feature must honor:

1. **Immediate feedback.** Every tap gets a visible and audible reaction within 200ms. No silent moments.
2. **Bite-sized wins.** A full play session can complete in 3 to 5 minutes with a real reward.
3. **Visible progress.** The kid always sees how they are growing (XP bar, streak number, map progress, collection).
4. **Ownership.** The kid has a hero they named, a mascot they picked, and items they earned. It feels like theirs.

---

## 5. Core Gameplay Loop

1. Kid opens app and sees their hero on the world map.
2. Kid taps the next available level.
3. Short story beat introduces the challenge ("A friendly jaguar is blocking the path. Defeat it in a Word Battle to pass.")
4. **Word Battle** begins (Kahoot-style speed quiz, 8 to 10 questions).
5. Victory screen shows XP earned, coins gained, item unlocked, streak status.
6. Kid returns to map. Next level unlocks. Daily streak counter ticks up if it was the first session today.

A complete session is 3 to 5 minutes. Kids can play multiple sessions back-to-back.

---

## 6. v1 Scope

### In scope for v1
- 1 region: **Colombia** (chosen for cultural meaning to the founding family)
- 6 to 8 levels within Colombia
- 1 battle type: Word Battle (Kahoot-style speed quiz)
- 3 hero options for the kid to choose from
- 1 mascot companion
- Hero customization: name, basic color choice
- XP, levels, coins, daily streak, streak freeze
- A small shop with hats and accessories for the hero
- 40 to 50 Spanish words and 10 simple phrases
- AI-personalized question selection (weighted toward weak words)
- AI-generated story beats per level
- Sound effects and background music for battles
- Local storage only (no accounts, no server)
- Web app, mobile-responsive

### Explicitly out of scope for v1
- Multiplayer or friend features
- Speech recognition or pronunciation grading
- Multiple regions beyond Colombia
- Native mobile app (web only for now)
- User accounts or cloud sync
- Parent dashboard
- Multiple battle types
- AI-generated illustrations
- Localization to languages other than English-to-Spanish

### Future versions (do not build yet, but design with these in mind)
- v2: More regions (Mexico, Spain, Argentina), React Native mobile app, Supabase backend, accounts
- v3: AI boss conversations in Spanish at end of each region
- v4: Speech recognition for spoken pronunciation practice
- v5: Parent dashboard with progress reports

---

## 7. World Structure (Colombia Region)

Each level is themed to teach a specific cluster of Spanish vocabulary tied to a Colombian setting.

| Level | Setting | Theme | Vocabulary cluster |
|------|---------|-------|----------------------|
| 1 | Cartagena beach | Greetings & family | hola, adios, mama, papa, hermano, hermana, abuela, abuelo |
| 2 | Coffee farm | Colors & numbers 1-5 | rojo, azul, amarillo, verde, uno, dos, tres, cuatro, cinco |
| 3 | Amazon jungle | Animals | perro, gato, mono, jaguar, pajaro, pez, serpiente |
| 4 | Bogota market | Food | manzana, pan, agua, leche, arroz, pollo, queso |
| 5 | Soccer field | Action verbs | correr, saltar, comer, beber, jugar, dormir |
| 6 | Cartagena fort | Numbers 6-10 & review | seis, siete, ocho, nueve, diez + 5 review words |
| 7 | Medellin city | Common phrases | "buenos dias", "gracias", "por favor", "como estas" |
| 8 | Boss level | Final review battle | mix of all words and phrases from levels 1-7 |

Final word list to be locked in collaboratively with the 8-year-old co-founder before Phase 5.

---

## 8. Battle Mechanic Spec

- **Format:** 8 to 10 questions per battle.
- **Question types for v1:** 
  - English picture or word shown, kid taps Spanish word from four choices (most common)
  - Spanish word shown, kid taps the matching picture from four pictures
- **Timer:** 6 seconds per question. Visible countdown.
- **Scoring:** Faster correct answers earn more XP. 6-second answer = 100 XP. 2-second answer = 200 XP. Wrong answer = 0 XP and a small energy bar hit.
- **Visual:** Four large buttons in distinct colors (red, blue, yellow, green) similar to Kahoot.
- **Audio:** Background music speeds up as timer drops. Ding for correct, soft buzz for wrong. Victory fanfare at end.
- **Streak inside battle:** A "combo counter" tracks consecutive correct answers and triggers bigger celebrations at 3, 5, and 8 in a row.
- **Failure state:** If kid loses all energy, the creature stays as a friend anyway (no harsh fail screen) but kid earns less reward and gets encouraged to try again.

---

## 9. Progression Layer Spec

- **XP and levels:** Kid's hero levels up at 500, 1000, 2000, 3500 XP, etc. Each level-up triggers a celebration.
- **Coins:** Earned from battles. Spent in the shop on hats, capes, accessories.
- **Daily streak:** Counter on home screen. Increments when kid completes at least one battle in a day.
- **Streak freeze:** Earned automatically every 5 streak days. Protects from one missed day. Maximum 2 freezes stored.
- **Daily goal:** One battle per day to maintain streak. Low bar by design.
- **Shop:** Small. 8 to 12 cosmetic items in v1. No pay-to-win, no real money.

---

## 10. AI Integration Points (v1)

The Claude API is the AI engine. Four uses in v1:

1. **Personalized question selection.** AI tracks which words the kid misses repeatedly (stored in local storage) and weights the next battle's question pool toward those words.
2. **Dynamic question generation.** AI generates fresh phrasings of questions so the kid never sees identical quizzes back-to-back.
3. **Story beats.** AI writes the short intro narration for each level in a tone matching the kid's chosen hero.
4. **Encouragement messages.** AI generates the mascot's celebration and recovery messages so they feel fresh, not canned.

### AI guardrails
- All AI outputs shown to the kid must be filtered for age-appropriate language.
- All AI-generated Spanish must be validated against the curated word list before display.
- Fallback canned content must exist for every AI call in case the API fails.
- Maximum response length for any kid-facing AI text is 2 short sentences.

---

## 11. Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **State:** React hooks for component state, browser localStorage for persistence
- **AI:** Anthropic Claude API (the same family that built this assistant)
- **Audio:** Free sound effects (freesound.org or similar), background music loops under 1MB
- **Hosting:** Vercel (free tier)
- **Source control:** GitHub
- **AI coding assistant:** Claude Code (reads this file)

### Folder structure (target)
```
/mundo-quest
  /public           # static assets, sounds, images
  /src
    /components     # reusable UI pieces
    /screens        # full screens (Home, Map, Battle, Shop)
    /game           # game logic (battle engine, scoring, progression)
    /ai             # Claude API calls and prompts
    /data           # word lists, level definitions
    /styles         # tailwind config and globals
    /utils          # helpers
  CLAUDE.md         # this file
  README.md         # public-facing readme
```

---

## 12. Design System

- **Color palette (working):** Tropical and warm to evoke Colombia. Primary yellow `#FFC93C`, sky blue `#4DA8DA`, jungle green `#3DAA47`, sunset coral `#FF6B6B`, soft cream background `#FFF6E5`.
- **Battle button colors:** red, blue, yellow, green (high contrast for fast recognition).
- **Typography:** A rounded friendly display font for headings (Fredoka, Baloo 2, or similar) and a clean readable body font (Nunito or similar). No Inter, no Roboto.
- **Voice and tone:** Warm, encouraging, playful. Never condescending. Mistakes are framed as "let us try again" not "wrong."
- **Sound principles:** Every interaction makes a sound. No silent taps. Sounds are short, bouncy, and never harsh.

---

## 13. Build Phases

1. **Phase 1 (Skeleton):** Home screen, hero standing on a static map, one tappable level, hardcoded battle. Goal: prove the loop.
2. **Phase 2 (Feel):** Add sound effects, music, animations, celebration moments. The battle should already feel good even before content is real.
3. **Phase 3 (Meta game):** Wire up XP, coins, streak, streak freeze, shop, hero customization, mascot.
4. **Phase 4 (AI):** Integrate Claude API for question selection, story beats, and mascot messages. Add fallback canned content.
5. **Phase 5 (Content):** Fill in all 6 to 8 levels with their word lists and themed art.
6. **Phase 6 (Test & polish):** Real kids play. Fix what breaks. Polish what feels weak.

---

## 14. Decision Log

Every meaningful decision gets one line here so future-us and future-AI know why things are the way they are.

- **2026-05-13:** First region chosen as Colombia for cultural meaning to founding family.
- **2026-05-13:** v1 is web-only, React. Mobile (React Native) is v2.
- **2026-05-13:** No user accounts in v1. Local storage only.
- **2026-05-13:** Streak freeze is mandatory from day one. Duolingo's biggest retention lever.

---

## 15. Open Questions

Things still to decide. Update as we close them.

- [ ] Final 40 to 50 word list for Colombia region (lock with son before Phase 5)
- [ ] Hero character options (sketch with son before Phase 1)
- [ ] Mascot character (sketch with son before Phase 1)
- [ ] Final color palette and font pairing
- [ ] Choice of background music tracks (royalty-free)
- [ ] Specific Claude model and prompts for AI integration points

---

## 16. Instructions for AI Coding Assistants

When working in this codebase, follow these rules:

1. **Read this file first.** It is the source of truth. If you are about to do something that contradicts this file, stop and ask.
2. **Stay in v1 scope.** Do not build v2 features even if they seem easy. Section 6 is the law.
3. **Match the reading level.** Any text the kid sees must be readable by a 7-year-old. Short words. Short sentences.
4. **Honor the design DNA.** Every feature must satisfy at least one of the four principles in Section 4. If it does not, push back.
5. **Never silent.** Every interaction needs a sound and a visual reaction. If you build a button with no feedback, you have failed.
6. **Fallback first.** Every AI call needs a canned fallback so the app works when the API is down.
7. **Comment for the 8-year-old.** Write code comments that the son can read and learn from. Plain English. Explain the why, not just the what.
8. **Commit messages are sentences.** "Add streak freeze counter to home screen" not "fix stuff."
9. **Ask before installing libraries.** Each new dependency is a long-term cost. If it is not essential, do not add it.
10. **Update this file.** If you make a decision, log it in Section 14. If you discover an open question, add it to Section 15.

---

## 17. Glossary

- **Hero:** The character the kid picks and customizes. Their avatar in the world.
- **Mascot:** The AI tutor companion that lives on the home screen and gives encouragement.
- **Word Battle:** The core Kahoot-style speed quiz. The main gameplay unit.
- **Level:** One themed location on the world map. Contains 1 to 2 Word Battles.
- **Region:** A collection of levels themed around one Spanish-speaking country. v1 has only Colombia.
- **Streak:** Number of consecutive days the kid has played at least one Word Battle.
- **Streak freeze:** A one-time pass that protects the streak from a missed day. Earned every 5 streak days.
