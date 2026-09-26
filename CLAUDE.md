# CLAUDE.md

> **Source of truth for the Papaya project.** Claude Code (and any other AI assistant) reads this file at the start of every session. Keep it accurate, keep it lean, and update it as decisions are made.

---

## 1. Project Identity

- **Name:** Papaya (formerly Mundo Quest, renamed 2026-09-26)
- **One-line mission:** A Spanish-learning game for kids ages 5 to 10 who have a native Spanish-speaking parent but live in an English-speaking home. Learning is the only way to earn the points that unlock characters, outfits, and real mini-games.
- **Why it exists:** Andre was born in Colombia. His wife does not speak Spanish, his kids want to learn, and he is not home enough to teach them. Papaya is the teacher that is always home. It should feel like the kids are playing a game, and the parent should trust the Spanish is real.
- **Built by:** Andre plus AI coding agents. Andre's kids are the test players. Every kid-facing word must be readable by a 7-year-old. Every code comment should be understandable to a smart 8-year-old.

---

## 2. Vision

Papaya is Duolingo's habit loop, Prodigy's "learning gates fun" loop, and Kahoot's arcade feel, rebuilt for young kids.

- **From Duolingo:** short lessons, a visible path, daily streaks with a streak freeze, XP and levels, a warm mascot, missed words come back at the end of the lesson, spaced repetition.
- **From Prodigy:** learning is the currency. Lessons earn papayas (coins) and tickets. Papayas buy characters, outfits, and unlock mini-games. Tickets pay for each play. No lessons, no play.
- **From Kahoot:** four big colored buttons, instant feedback, combo counters, music, celebrations.

**What we refuse to copy:** hearts that lock a kid out, leaderboards and leagues, guilt-trip notifications, ads, real-money purchases, loot boxes with hidden odds. Research in `docs/research/` explains why.

---

## 3. Target User

- **Primary:** Kids ages 5 to 10 who can read simple English or are learning to. Every Spanish word can be heard out loud, so pre-readers can play.
- **Secondary:** The Spanish-speaking parent who wants their kid to talk to abuela. The curriculum is household Spanish (Latin American, Colombian flavor) the kid can use at home the same day.
- **Reading level guard:** Any text shown to the kid must be readable by an average 7-year-old. Short words. Short sentences. No jargon.

---

## 4. Design DNA

1. **Immediate feedback.** Every tap gets a sound and a visible reaction within 200ms. No silent moments.
2. **Bite-sized wins.** A lesson takes about 3 minutes and always pays out.
3. **Visible progress.** The top bar always shows streak, papayas, tickets, and the XP bar. The path shows crowns. The collection shows what is unlocked and what is next.
4. **Ownership.** The kid names a hero, picks a buddy, and earns everything they own.
5. **Learning is the currency.** Every fun thing costs something only a lesson can earn. Never the other way around.

---

## 5. Core Loops

### Learning loop (about 3 minutes)
1. Kid opens the app, sees their buddy and today's streak.
2. Kid taps the next lesson on the path.
3. Buddy says one short line about the lesson.
4. 8 to 10 exercises. Missed exercises come back at the end until they are right.
5. Lesson complete screen: XP, papayas, tickets, combo, crowns, streak status, level up if any.
6. Back to the path. Next lesson unlocks. Daily chest available if it is the first lesson today.

### Reward loop
1. Kid has papayas and tickets.
2. Kid goes to Buddies (unlock a character), Shop (buy a hat), or Arcade (unlock a game with papayas, play it with a ticket).
3. Mini-games use the Spanish the kid already learned, so play is also review.
4. Tickets run out. The only way to get more is a lesson. Back to the learning loop.

---

## 6. v1 Scope

### In scope for v1
- World 1: "Mi Casa y Mi Familia" (My Home and My Family). 10 units, about 50 lessons, about 350 words and phrases. Latin American Spanish.
- Exercise types: pick the Spanish, pick the English, listen and tap, match pairs, order the words, true or false.
- Browser text-to-speech reads every Spanish word. No audio files needed.
- XP, hero levels, papayas (coins), tickets, daily streak, streak freeze, daily chest, crowns per lesson.
- Spaced repetition (Leitner boxes) and a Practice mode that picks weak or due words.
- 12 collectible buddy characters (Colombian animals). 3 free starters.
- Hero with color choice and a shop of about 15 cosmetic items (hats, glasses, capes, pets, backgrounds).
- Arcade with 6 mini-games, each unlockable with papayas and playable with tickets.
- AI mascot messages via the Claude API through a Vercel serverless function, with canned fallbacks for every call.
- Sound effects and music generated in the browser with the Web Audio API.
- Local storage only. No accounts, no server state.
- Web app, mobile first, works on a phone, tablet, or laptop.

### Explicitly out of scope for v1
- Multiplayer, friends, leaderboards, leagues
- Speech recognition
- Other languages or other worlds
- Native mobile app
- Accounts, cloud sync, parent dashboard
- Push notifications
- AI-generated art
- Any real money

### Future versions
- v2: World 2 (school and town), parent progress view, Supabase accounts, PWA install.
- v3: AI conversation practice with a buddy in simple Spanish.
- v4: Speech recognition for pronunciation.
- v5: More languages (Portuguese, French) for other families.

---

## 7. Curriculum (World 1)

Full data lives in `src/data/curriculum.ts`. Research and the source list are in `docs/research/spanish-curriculum.md`.

| Unit | Id | Topic | Sample words |
|------|----|-------|--------------|
| 1 | u1 | Greetings and family | hola, mamá, papá, abuela, te quiero |
| 2 | u2 | Body and daily routine | cabeza, manos, lávate las manos, a dormir |
| 3 | u3 | Colors and numbers 1 to 10 | rojo, azul, uno, dos, diez |
| 4 | u4 | Food and drink | agua, leche, arepa, jugo, a comer |
| 5 | u5 | Animals | perro, gato, pájaro, pez |
| 6 | u6 | Clothes and weather | camisa, zapatos, hace frío |
| 7 | u7 | Home and rooms | casa, cama, cocina, baño |
| 8 | u8 | School and play | libro, jugar, pelota |
| 9 | u9 | Sentence frames and questions | yo quiero, me gusta, tengo, ¿dónde? |
| 10 | u10 | Parent phrases and review | ven aquí, buenas noches, mi amor |

Rules: articles (el, la) are baked into nouns where natural. No vosotros. Colombian words win (carro, computador, jugo). Every item has an emoji as its picture.

---

## 8. Lesson Mechanic Spec

- **Length:** 8 to 10 exercises. A missed exercise is re-queued at the end.
- **Choices:** Four big buttons in Kahoot colors (red, blue, yellow, green). Big tap targets, at least 56px tall.
- **Audio:** Every Spanish word has a speaker button. The listen-and-tap exercise plays the word first.
- **Timer:** Off by default. Parents can turn it on in Settings for older kids. When on, fast answers earn bonus XP and the music speeds up.
- **Feedback:** Correct = green flash, ding, combo counter ticks. Wrong = gentle shake, soft buzz, the right answer is shown, buddy says "let us try again". Never the word "wrong".
- **Combo:** Consecutive correct answers. Bigger celebrations at 3, 5, and 8.
- **No fail state.** The kid always finishes. Fewer crowns and fewer rewards if many were missed.

---

## 9. Economy Spec

All numbers live in `src/game/economy.ts`. Change them there only.

- **XP:** 10 per correct, +20 for a perfect lesson, combo bonuses at 3/5/8. Levels at 100, 250, 500, 800, 1200 and so on.
- **Papayas (coins):** 3 per correct, +10 for finishing, +15 for perfect, +20 first time on a lesson. A first perfect lesson is about 70 papayas.
- **Tickets:** 2 per lesson, +1 for perfect. Max 10 stored. One ticket per mini-game play.
- **Daily chest:** After the first lesson of the day: 20 to 50 papayas plus 1 ticket.
- **Streak:** Increments on the first lesson each day. Streak freeze earned every 5 days, max 2 stored, used automatically. Milestone papayas at 3, 7, 14, 30 days.
- **Crowns:** 3 for perfect, 2 for 80 percent, 1 for finishing.
- **Buddies:** 0 (starters), 120 to 150 (common), 280 to 320 (rare), 550 to 600 (epic), 900 to 1000 (legendary). Some also require finishing a unit.
- **Shop:** 60 to 500 papayas. Cosmetic only.
- **Games:** First game free. Others 120 to 400 papayas, most gated on a unit.

---

## 10. AI Integration Points (v1)

Claude powers the mascot's voice. Everything has a canned fallback.

1. **Mascot messages.** Welcome back, lesson start, lesson complete, streak, level up, comeback after days away. Two short sentences max.
2. **Encouragement after a miss.** One line, warm, names the word.

### AI guardrails
- The API key lives only in the Vercel serverless function (`api/`). Never in the browser bundle.
- Every AI call has a fallback in `src/ai/fallbacks.ts`. The app must work fully offline.
- Any Spanish the AI outputs must be from the curated word list, or the fallback is used.
- Max 2 short sentences for any kid-facing AI text. Readable by a 7-year-old.
- Cache messages in localStorage so we do not call the API for the same moment twice in a day.

---

## 11. Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4
- **Routing:** react-router-dom (hash router so it works on any static host)
- **State:** `PlayerContext` (React context) + localStorage via `src/game/storage.ts`
- **Audio:** Web Audio API for sound effects and music (`src/audio/`), browser speech synthesis for Spanish
- **AI:** Anthropic Claude API via Vercel serverless function in `api/`
- **Hosting:** Vercel free tier
- **Lint:** oxlint. **Typecheck:** `npm run build` runs `tsc -b`.

### Folder structure
```
/papaya
  /api              # Vercel serverless functions (Claude API calls)
  /docs/research    # research reports that shaped the design
  /public           # favicon and static assets
  /src
    /ai             # mascot messages, fallbacks, API client
    /audio          # sound effects, music, speech
    /components     # shared UI: Button, TopBar, Mascot, Hero, Confetti...
    /components/exercises  # one component per exercise kind
    /data           # curriculum, characters, shop, games
    /game           # economy, progression, spaced repetition, PlayerContext
    /games          # mini-games, one file each, registered in index.ts
    /screens        # full pages: Home, Path, Lesson, Arcade, Shop...
    /utils          # small helpers
    types.ts        # every shared shape
  CLAUDE.md
  README.md
```

### Key contracts (do not change without updating callers)
- `src/types.ts` holds every shared shape.
- `usePlayer()` from `src/game/PlayerContext.tsx` is the only way to read or change progress.
- `sfx.*` and `speak()` from `src/audio/sound.ts` are the only way to make sound.
- Mini-games take `MiniGameProps` from `src/games/types.ts` and are registered in `src/games/index.ts`.
- Exercise generation lives in `src/game/exercises.ts`. Exercise UI lives in `src/components/exercises/`.

---

## 12. Design System

- **Palette:** papaya orange `#FF8A3D`, leaf green `#3DAA47`, sky blue `#4DA8DA`, sun yellow `#FFC93C`, coral `#FF6B6B`, cream background `#FFF6E5`, seed brown `#3B2A1A`, ink `#2D2A26`. Defined as Tailwind theme tokens in `src/index.css` (`bg-papaya`, `text-leaf`, etc).
- **Answer buttons:** Kahoot red, blue, yellow, green (`bg-btn-red` and friends).
- **Typography:** Fredoka for headings and buttons (`font-display`), Nunito for body (`font-body`). Loaded from Google Fonts.
- **Buttons:** Chunky with a bottom shadow that presses down (`btn-chunky` class). Use the shared `Button` component.
- **Voice and tone:** Warm, playful, never condescending. Mistakes are "let us try again", never "wrong". Spanish is always shown with correct accents.
- **Sound:** Every tap makes a sound. Sounds are short and bouncy. Music only in lessons and games.
- **Animations:** `animate-pop`, `animate-wiggle`, `animate-bounce-soft`, `animate-shake`, `animate-float` in `src/index.css`.

---

## 13. Build Phases

1. **Phase 1 (Foundation):** Types, economy, progression, storage, audio, shared components, routing. Done 2026-09-26.
2. **Phase 2 (Content and engine):** Curriculum data, exercise generator, lesson screen, practice mode.
3. **Phase 3 (Meta game):** Home, path, buddies, shop, arcade, settings, daily chest, celebrations.
4. **Phase 4 (Arcade):** Six mini-games.
5. **Phase 5 (AI):** Mascot messages through Claude with fallbacks.
6. **Phase 6 (Test and polish):** Andre's kids play. Fix what breaks. Tune the economy.

---

## 14. Decision Log

- **2026-05-13:** First region chosen as Colombia for cultural meaning to the founding family.
- **2026-05-13:** v1 is web-only, React. Mobile (React Native) is v2.
- **2026-05-13:** No user accounts in v1. Local storage only.
- **2026-05-13:** Streak freeze is mandatory from day one. Duolingo's biggest retention lever.
- **2026-09-26:** Renamed from Mundo Quest to Papaya. Andre's call.
- **2026-09-26:** Vision widened from "one region, one battle type" to "Duolingo-style path plus unlockable characters and mini-games". Learning is the currency.
- **2026-09-26:** Three currencies: XP (never spent), papayas (spend on unlocks), tickets (spend on plays). Tickets exist so kids cannot grind the fun and skip the learning, the main criticism of Prodigy.
- **2026-09-26:** No hearts, no leaderboards, no guilt notifications, no loot boxes with hidden odds. See `docs/research/duolingo-mechanics.md`.
- **2026-09-26:** Audio is generated in the browser (Web Audio + speech synthesis). No sound files. Keeps the app tiny and avoids licensing.
- **2026-09-26:** Hash routing so the app works on any static host without rewrite rules.
- **2026-09-26:** Claude API key lives only in a Vercel serverless function. The browser never sees it.
- **2026-09-26:** All commits are authored by Andre with no AI attribution trailers. Andre's call.
- **2026-09-26:** Timer is off by default. Research says no time pressure for the youngest kids. Parents can turn it on.

---

## 15. Open Questions

- [ ] Real illustrations to replace emoji placeholders for the buddies and curriculum items.
- [ ] Which Claude model for mascot messages (cheapest that reads well for kids). Default to Haiku.
- [ ] Should tickets refill slowly over time (like 1 per hour) or only from lessons? Start lesson-only and watch the kids.
- [ ] Recorded native audio (Andre's voice?) for the words instead of browser TTS.
- [ ] A "family mode" where the parent records their own pronunciation.

---

## 16. Instructions for AI Coding Assistants

1. **Read this file first.** If you are about to do something that contradicts it, stop and ask.
2. **Stay in v1 scope.** Section 6 is the law.
3. **Match the reading level.** Any text the kid sees must be readable by a 7-year-old.
4. **Honor the design DNA.** Every feature must satisfy at least one principle in Section 4.
5. **Never silent.** Every interaction needs a sound (use `sfx`) and a visual reaction.
6. **Fallback first.** Every AI call needs a canned fallback.
7. **Comment for the 8-year-old.** Plain English. Explain the why.
8. **Commit messages are sentences.** "Add streak freeze counter to home screen" not "fix stuff".
9. **Ask before installing libraries.** Current dependencies: react, react-dom, react-router-dom, tailwindcss. That is it.
10. **Use the shared pieces.** `Button`, `Screen`, `TopBar`, `Mascot`, `Hero`, `Modal`, `Celebration`, `Confetti`, `SpeakButton`, `ProgressBar`, `BackButton`. Do not reinvent them.
11. **Update this file.** Decisions go in Section 14. Questions go in Section 15.
12. **`npm run build` must pass** before any commit.
13. **Commits are authored by Andre.** Set git author and committer to `Andre Bernal <25andresbernal@gmail.com>`. Do not add `Co-Authored-By`, `Claude-Session`, or any other AI attribution trailer to commit messages or pull request descriptions. Andre is the sole contributor on GitHub.

---

## 17. Glossary

- **Hero:** The kid's avatar. Colored and dressed by the kid.
- **Buddy:** A collectible animal character. One is picked as the companion and appears on the home screen and in lessons.
- **Lesson:** 8 to 10 exercises on 5 to 8 words. The main learning unit.
- **Unit:** A group of 4 to 6 lessons on one topic.
- **World:** A group of units. v1 has World 1 only.
- **Papayas:** Coins. Earned by lessons, spent on buddies, shop items, and game unlocks.
- **Tickets:** Earned by lessons, spent to play a mini-game.
- **Crowns:** 1 to 3 stars per lesson showing how well the kid did.
- **Streak:** Days in a row with at least one lesson.
- **Streak freeze:** Protects the streak for one missed day. Earned every 5 streak days.
- **Daily chest:** A once-a-day bonus after the first lesson.
- **Practice:** A lesson built from weak or due words instead of a path lesson.
