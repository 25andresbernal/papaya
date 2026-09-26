# Turning on the AI mascot

The app works fine with no setup: the buddy uses the canned lines in
`src/ai/fallbacks.ts` and nothing ever calls the internet.

## Turn it on

1. Get an API key from [console.anthropic.com](https://console.anthropic.com).
2. In the Vercel project: **Settings -> Environment Variables**, add
   `ANTHROPIC_API_KEY` with that key. Apply it to Production (and Preview if
   you want AI lines on preview deploys too).
3. Redeploy. That's it - no code changes needed.

The key lives only on Vercel's servers, inside `api/mascot.ts`. It is never
sent to the browser.

## Testing locally (optional)

`npm run dev` has no `/api` routes, so the mascot always falls back to canned
lines - that's expected. To test the real thing locally, install the Vercel
CLI and run `vercel dev` instead, with `ANTHROPIC_API_KEY` set in a local
`.env` file (copy `.env.example`).

## Without a key

`api/mascot.ts` returns `{ line: null }` when no key is set. The app treats
that exactly like a slow network: it just shows the canned line instead.

## Cost

Each mascot line uses Claude Haiku, about 100 tokens total. That's a small
fraction of a cent per call - a few cents per month even if a kid plays every
day.
