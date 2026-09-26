# Papaya

**Learn Spanish by playing.** A game for kids ages 5 to 10 who have a Spanish-speaking parent but live in an English-speaking home.

Lessons earn papayas and tickets. Papayas unlock buddy characters, outfits, and mini-games. Tickets let you play them. No lessons, no play. Learning is the currency.

## What is inside

- A learning path with 10 units and about 50 short lessons of household Spanish (Latin American, Colombian flavor).
- Six exercise types: pick the Spanish, pick the English, listen and tap, match pairs, order the words, true or false.
- Every Spanish word is read out loud by the browser, so kids who cannot read yet can still play.
- XP, hero levels, daily streaks with a streak freeze, a daily chest, and crowns for every lesson.
- 12 collectible Colombian animal buddies, a cosmetic shop, and an arcade of 6 mini-games.
- An AI mascot voice powered by Claude, with built-in lines when the AI is off.
- Everything saves in the browser. No accounts. No ads. No real money.

## Run it

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

## Build it

```bash
npm run build
npm run preview
```

## Turn on the AI mascot (optional)

The app works without it. To turn it on when deployed to Vercel, add an environment variable named `ANTHROPIC_API_KEY`. The key is only read by the serverless function in `api/`. It never reaches the browser.

## Project docs

- `CLAUDE.md` is the source of truth for scope, design, and decisions.
- `docs/research/` holds the research on Duolingo, kids' game design, and the Spanish curriculum that shaped the app.

## Made by

Andre Bernal and a swarm of Claude agents. Tested by Andre's kids.
