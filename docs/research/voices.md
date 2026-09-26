# Voices Research: Pre-Generated TTS for Papaya

Research pass on where to get clear, warm, kid-friendly Spanish (Latin American/Colombian) and English (American) voices for Papaya, done because the browser's built-in `speechSynthesis` (used today in `src/audio/voice.ts` and `src/audio/sound.ts`) sounds different — and often robotic or thin — depending on the kid's phone, tablet, or laptop. Compiled September 2026 from vendor pricing pages, docs, and third-party pricing trackers. Cloud TTS pricing and voice line-ups change often; treat exact dollar figures as "the right order of magnitude," not a locked quote, and re-check before generating a paid batch of audio.

Papaya is a static React app on Vercel with one serverless function (for Claude mascot messages). It has no database and no per-request compute budget for audio, and the app must fully work offline / with no API key. That rules out calling a paid TTS API at runtime. The only architecture that fits Papaya's shape is: **generate every clip once, commit the files, serve them as static assets, keep browser TTS as the fallback.**

---

## 1. Google Cloud Text-to-Speech

Google has the deepest Spanish voice bench of any vendor, across four tiers, plus the most generous free allowance.

- **Standard/WaveNet** — $4/1M chars. Robotic-to-decent; below Papaya's bar.
- **Neural2** — $16/1M chars. `es-US-Neural2-A/B/C` and `es-MX` equivalents; `en-US-Neural2-A` through `-J` (Neural2-C and Neural2-F are commonly recommended for warm narration). Full SSML, including `<prosody rate="...">`.
- **Studio** — $160/1M chars. Very natural, built for news narration, 10x Neural2's price — overkill for single words.
- **Chirp 3: HD** (formerly "Journey") — $30/1M chars. Google's newest, most natural tier: 8 named voices per language (4 male/4 female — Aoede, Puck, Charon, Kore, Fenrir, Leda, Orus, Zephyr) across `es-US`, `es-MX`, and `en-US`. Best "warm and clear" option short of Studio pricing.
- **Gemini TTS (Flash, GA Sept 2026)** — token-based: $0.50/1M input tokens + $9/1M output audio tokens through 2026 (doubling 2027-01-01). Supports natural-language style instructions ("speak warmly to a 5-year-old"), similar to OpenAI's `gpt-4o-mini-tts`, but billed by audio length rather than characters.
- **Free tier**: 4M chars/month Standard/WaveNet, and **1M chars/month each** on Neural2, Studio, and Chirp 3 HD, no stated expiration. Papaya's ~334-word vocabulary plus a first batch of story sentences is well under a few hundred thousand characters per language — **the whole v1 word list can likely be generated at Neural2 or Chirp 3 HD quality for $0.**
- **Licensing**: output is yours to use under the Google Cloud Platform Terms of Service; the intended pattern is generating audio for your own app, not reselling a voice library. Baking ~1,500 clips into a free kids' app is a normal, permitted use.
- **Child-like voices**: no explicit "kid" tier like Azure/Polly. Lever is picking a lighter Neural2/Chirp 3 HD voice and raising pitch slightly via SSML — the same trick `sound.ts` already does for browser TTS (`u.pitch = 1.1`).

## 2. Amazon Polly

- **Pricing**: Standard $4/1M, **Neural $16/1M**, **Generative $30/1M**, Long-Form $100/1M chars.
- **Free tier**: new AWS accounts get 1M chars/month Neural (5M Standard) free for 12 months, plus 100K chars/month Generative free for 12 months.
- **Spanish**: `Mia` (es-MX, Generative/Neural), `Lupe` (es-US, Neural/Generative, "Newscaster" style), `Pedro` (es-US, Neural, male). No native `es-CO` locale — Mia/Lupe are the closest Latin American fit.
- **English**: `Joanna`, `Matthew`, etc. as standard Neural voices; **`Ivy`** (Neural, child-sounding female) and **`Kevin`** (Neural, explicit child US English voice, male) are Polly's real kid voices — the only vendor here with purpose-built child voices, good for a buddy character.
- **Licensing**: output belongs to you; AWS permits storing, reusing, and modifying generated speech under the AWS Customer Agreement. The one restriction is re-exposing Polly itself as a competing TTS service.

## 3. Microsoft Azure AI Speech

- **Pricing**: prebuilt Neural $16/1M chars; newer Neural **HD** $22/1M (down from $30 in March 2026); custom neural $24/1M plus hosting.
- **Free tier**: F0 gives 0.5M chars/month neural TTS — enough on its own for Papaya's whole word list.
- **Colombian Spanish, natively**: `es-CO-SalomeNeural` (female) and `es-CO-GonzaloNeural` (male) — **the only major vendor with a real `es-CO` locale**, matching the curriculum's Colombian-flavored Spanish and Andre's own accent directly.
- **Other Latin voices**: `es-MX` adds Dalia, Jorge, Beatriz, Candela, Carlota, Cecilio, Gerardo, Larissa, Liberto, Luciano, Marina, Nuria, Pelayo, Renata, Yago — the deepest regional Spanish bench of any vendor, none explicitly flagged as a child voice.
- **English**: standard `en-US` Neural voices plus newer **Dragon HD**/`MultilingualNeural` voices (700+ voices, automatic style prediction); styles like "cheerful" via SSML `mstts:express-as`. An "Ana" child voice has appeared in past Azure lists for `en-US`; confirm the current voice ID in Speech Studio before committing, since the catalog moves fast.
- **Licensing**: commercial use of output audio is allowed under Microsoft's Product Terms **only on a paid tier** — the free F0 tier is evaluation-only and does not carry output rights. A low-usage pay-as-you-go key (a few dollars for ~1,500 clips) removes any doubt.

## 4. ElevenLabs

- **Pricing**: $0.10/1,000 chars ($100/1M) on Multilingual v2/v3, $0.05/1,000 ($50/1M) on Flash/Turbo — 3-6x Azure/Google's Neural rate, but widely regarded as the warmest, most expressive prosody available.
- **Free tier**: 10,000 credits/month (~10 min of v2 audio) — enough to audition voices, not the full batch. **Free-tier output has no commercial license and requires attribution**; the paid "Starter" plan (30,000 credits/month) is the cheapest tier with commercial rights and instant cloning.
- **Spanish quality**: handles Spanish well with regional accent control via voice selection, but the library skews Spain/generic-Latin-American rather than a labeled "Colombian" tag.
- **Kid-sounding voices**: a "Youthful"/"Playful" library category and specific kid-styled voices (e.g. "Johnny Kid") — usable for a buddy character.
- **Voice cloning (Andre's own voice)**: explicitly supported, including on paid plans with commercial rights, gated by an in-product consent confirmation. A **Professional Voice Clone** can only be made of your own verified voice — never someone else's, even with permission — while **Instant Voice Cloning** of another person's voice requires their explicit, documented consent. Andre cloning himself as the Spanish narrator is straightforward; cloning a grandmother's voice would need her explicit recorded consent first, worth having in writing even for a private family app.

## 5. OpenAI TTS

- **`tts-1`**: $15/1M chars. **`tts-1-hd`**: $30/1M chars. Simple, non-instructable.
- **`gpt-4o-mini-tts`**: token-priced — $0.60/1M input + $12/1M output audio tokens (roughly $15/1M-characters-equivalent, scaling with audio length). Headline feature: **instructable delivery** — a prompt like "speak slowly and warmly, like reading to a five-year-old" measurably changes pacing/tone, matching the "let us try again" warm-mascot voice in CLAUDE.md §12. Spanish output is fluent, neutral-Latin-American-leaning by default, no explicit Colombian dial.
- No documented child/kid preset voices; the roster (Alloy, Echo, Fable, Onyx, Nova, Shimmer, etc.) is adult-toned throughout.

## 6. Open-source / local models (generate once, offline, zero ongoing cost)

- **Piper** — the most practical open-source option. Real-time on CPU, ~50-100MB per voice, Apache-licensed, free forever. Spanish: `es_MX-claude-high` (one of few non-English Piper voices at "high" quality — most top out at "medium") and `es_AR-daniela-high`. **No dedicated `es_CO` voice**; `es_MX-claude-high` is the closest neutral stand-in, a clear step below Chirp 3 HD/Azure HD/ElevenLabs. Many solid `en_US` voices at "high" quality.
- **Coqui XTTS v2** — best open-source voice *cloning* (as little as 6 seconds of reference audio), strong multilingual quality, but 10x+ slower and far heavier than Piper. Fine for a one-time offline batch: a legitimate free way to clone Andre's own voice locally, with rougher edges than ElevenLabs.
- **Kokoro** — small, fast, high quality, but English-only voices — not usable for Spanish.
- **MeloTTS** — fast, moderate multilingual quality, a notch below Piper's best voice.
- **Bottom line**: worth it only for a $0 budget and a "better than the browser" bar — Piper's `es_MX-claude-high` plus a solid `en_US` Piper voice already beats relying on whatever `speechSynthesis` voice a device happens to expose, but isn't close to Duolingo-ABC-level polish.

## 7. Human voice actors and Duolingo ABC's own approach

- **Fiverr**: Spanish/kid-styled voice-over gigs start around $20, scaling with line count, usage rights, and turnaround; exact Colombian-specific per-word rates aren't published and vary by seller.
- **Voices.com**: has a dedicated Colombian Spanish accent filter; typical quotes for a few hundred short lines from a native, warm-toned narrator land roughly $200-800 depending on experience and whether it's straight narration or a "character" read. Turnaround for ~400-600 lines is commonly 3-7 business days once booked.
- **Why this might sound best**: no cloud TTS voice fully replicates a genuine, warm Colombian home-Spanish cadence the way a real Colombian parent or actor reading to a kid does — which is literally Andre's value proposition ("the teacher that is always home"). Recording his own voice (mic, or a one-time XTTS/ElevenLabs clone of it) costs nothing but his time and would be the most authentic option of all.
- **Duolingo ABC's approach**: Duolingo doesn't use a raw TTS engine for character voices. It casts native/near-native actors, records them fully, then trains custom TTS models on those recordings (ML-driven phrasing, timing, emotion) so new lines can be generated later without re-booking. That hybrid — real actor once, synthetic scale after — is why Duolingo ABC sounds "so nice and clear." Papaya can't replicate the custom-model training step at this budget, but the same *shape* (record a warm voice once, generate everything from it) is achievable today via ElevenLabs Instant Voice Cloning or a local XTTS clone of Andre reading a script.

---

## Recommended Architecture

**Pre-generate every clip once with a Node script, commit the audio files, serve them as static assets from `/public/audio/`, and keep the existing browser `speechSynthesis` code as the fallback exactly as it works today.**

```
public/
  audio/
    es/
      hola.mp3
      mama.mp3
      ...              # one file per curriculum item id (~334) + story sentences (~150-500)
    en/
      hello.mp3
      mom.mp3
      ...              # same ids, English text
```

- **File format**: Opus in an `.ogg`/`.webm` container at 24 kbps mono is more than enough for clear speech and works in every browser Papaya targets. MP3 at 48 kbps mono is the safe universal fallback if any tooling in the pipeline doesn't handle Opus cleanly. A 22.05-24 kHz mono sample rate is standard for TTS output; music-grade 44.1/48 kHz stereo is unnecessary.
- **Size estimate**: for ~800 clips averaging ~2.5s each: 24 kbps Opus ≈ 7.5 KB/clip (**~6 MB for 800 clips**); 48 kbps MP3 ≈ 15 KB/clip (**~12 MB for 800**). Scaling to the full ~1,500-clip plan (334 words × 2 languages, plus a few hundred story sentences × 2 languages): **roughly 11-14 MB at Opus, 22-28 MB at MP3** — trivial next to Vercel's Hobby-tier free bandwidth (100 GB/month) and any reasonable repo size. Opus is the better default.
- **Playback**: a small helper (e.g. `src/audio/clips.ts`) does `new Audio(`/audio/${lang}/${id}.mp3`).play()` for a known id, falling back to the existing `speak()`/`speakEnglish()` browser-TTS path in `sound.ts` when no file exists yet for that id — keeping `speak()` as "the only way to make sound" per CLAUDE.md §11 intact, just static-file-first internally.
- **One narrator vs. several voices**: recommend **one warm, consistent narrator per language** for all word/phrase/story audio — what Duolingo ABC and most kids' apps do, since consistency builds trust for a 5-10 year old. Reserve a **second voice per buddy character** only for the buddy's own dialogue lines (mascot messages, encouragement), not the curriculum words — giving every buddy its own full curriculum voice would multiply cost and file count by 12 (v1's buddy count) for no teaching benefit.

### Ranked recommendation

**Spanish:**
1. **Top pick — Azure `es-CO-SalomeNeural`/`es-CO-GonzaloNeural`**: the only vendor with a real Colombian locale, matching the curriculum's "Colombian words win" rule (§7) and Andre's own accent, cheaply ($16-22/1M chars, likely under the 0.5M/month free tier for the whole word list).
2. **Runner-up — Google Chirp 3 HD (`es-US`/`es-MX`)**: the most natural tier from the vendor with the best free allowance (1M chars/month, likely $0 for the whole batch), if Salome/Gonzalo don't audition as warm enough.
3. **Aspirational — Andre's own voice**, cloned via ElevenLabs Instant Voice Cloning (paid, commercial rights) or a local Coqui XTTS clone (free): the most authentic match for "the teacher that is always home," at the cost of an extra recording/cloning step.

**English:**
1. **Top pick — Google Chirp 3 HD `en-US`**: same natural quality and free allowance as the Spanish pick, one less vendor to manage.
2. **Runner-up — Amazon Polly `Ivy` or `Kevin`**: Polly's purpose-built child voices, strong either as the main narrator or a specific buddy character's voice.

**Total one-time cost for ~1,500 clips (≈300K-500K characters total):**
- **$0** on Google Chirp 3 HD/Neural2 within the 1M-char/month free tier, or Azure's 0.5M/month F0 tier for a first pass (confirm F0 output carries the commercial rights Papaya needs — see §3; a low-usage paid Azure key removes the doubt for a few dollars).
- **$5-15** on Azure's or Google's paid tier to sidestep any free-tier ambiguity.
- **$30-50** on ElevenLabs Multilingual v2 at commercial pricing for a warmer read.
- **$100-800** for a human actor (Fiverr/Voices.com) to record the full set once — reusable afterward as a voice-cloning reference.

### Sketch of the generation script

```js
// scripts/generate-audio.mjs
// Reads the curriculum + story sentences, calls a TTS API once per item per
// language, writes an audio file for each — skips files that already exist
// so re-runs after adding new curriculum items don't re-spend quota.

import fs from "node:fs/promises";
import path from "node:path";
import { curriculum } from "../src/data/curriculum.ts"; // or a pre-built JSON export
// import whichever SDK: @google-cloud/text-to-speech, microsoft-cognitiveservices-speech-sdk, etc.

const OUT_DIR = { es: "public/audio/es", en: "public/audio/en" };

async function synthesize(text, lang, voiceName) {
  // Call the provider's API. Ask for a compressed format (OGG_OPUS for
  // Google, ogg-24khz-16bit-mono-opus for Azure) and a slightly slowed
  // rate via SSML: <speak><prosody rate="-10%">${escapeSsml(text)}</prosody></speak>
  // Returns a Buffer of audio bytes.
}

async function generateOne(id, text, lang, voiceName) {
  const outPath = path.join(OUT_DIR[lang], `${id}.ogg`);
  try {
    await fs.access(outPath);
    return; // already generated — skip
  } catch { /* doesn't exist yet */ }
  const audio = await synthesize(text, lang, voiceName);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, audio);
  console.log(`wrote ${outPath}`);
}

async function main() {
  const items = curriculum.flatMap((unit) => unit.items); // { id, es, en }
  for (const item of items) {
    await generateOne(item.id, item.es, "es", "es-CO-SalomeNeural");
    await generateOne(item.id, item.en, "en", "en-US-Chirp3HD-Aoede");
  }
  // Repeat for story-sentence data once that content exists.
}

main();
```

Run once locally or in CI, commit `public/audio/`, and Papaya ships instant, consistent, high-quality audio for every kid — no API key in the browser, no runtime cost, no dependence on whatever voice a device happens to expose.

---

## Sources

- [Google Cloud Text-to-Speech Pricing 2026 — TextToLab](https://texttolab.com/blog/google-cloud-tts-pricing)
- [Google Cloud TTS — Quality/Speed/Price Analysis — Artificial Analysis](https://artificialanalysis.ai/text-to-speech/model-families/google)
- [Chirp 3: HD voices — Google Cloud Documentation](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd)
- [Supported voices and languages — Google Cloud Documentation](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types)
- [Neural2 voices issue thread — Google Issue Tracker](https://issuetracker.google.com/issues/236512595)
- [Gemini 3.8 Flash TTS pricing 2026 — eesel AI](https://www.eesel.ai/blog/gemini-3-8-flash-tts-pricing)
- [Amazon Polly Pricing 2026 — CostBench](https://costbench.com/software/ai-voice-tools/amazon-polly/)
- [Amazon Polly adds Italian/Castilian Spanish and Mexican Spanish support — AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/amazon-polly-adds-italian-and-castilian-spanish-voices-and-mexican-spanish-language-support/)
- [Amazon Polly launches a child US English NTTS voice — AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/amazon-polly-launches-a-child-us-english-ntts-voice/)
- [Amazon Polly's voice license — AWS re:Post](https://repost.aws/questions/QU1slb0Zf6R5unDpAp9UCT7A/amazon-polly-s-voice-license)
- [Azure Text to Speech Pricing 2026 — TextToLab](https://texttolab.com/blog/azure-text-to-speech-pricing)
- [Salome: Text to Speech (es-CO) — json2video](https://json2video.com/ai-voices/azure/voices/es-co-salomeneural/)
- [Gonzalo: Text to Speech (es-CO) — json2video](https://json2video.com/ai-voices/azure/voices/es-co-gonzaloneural/)
- [Dalia: Text to Speech (es-MX) — json2video](https://json2video.com/ai-voices/azure/voices/es-mx-dalianeural/)
- [Azure Speech – Neural HD Text to Speech updates — Microsoft Community Hub](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-speech-%E2%80%93-neural-hd-text-to-speech-recent-voice-updates/4505380)
- [Using Azure text-to-speech for commercial purposes — Microsoft Q&A](https://learn.microsoft.com/en-us/answers/a/1321550)
- [ElevenLabs Pricing](https://elevenlabs.io/pricing)
- [ElevenLabs Pricing 2026 breakdown — TextToLab](https://texttolab.com/blog/elevenlabs-pricing)
- [Can I create a Professional Voice Clone of someone else's voice? — ElevenLabs Docs](https://elevenlabs.io/docs/help-center/product/voices/voice-cloning/can-i-create-a-professional-voice-clone-of-someone-elses-voice)
- [Youthful AI Voices — ElevenLabs Voice Library](https://elevenlabs.io/voice-library/youthful)
- [OpenAI TTS Pricing 2026 — TextToLab](https://texttolab.com/blog/openai-tts-pricing)
- [Understanding gpt-4o-mini-tts pricing — OpenAI Developer Community](https://community.openai.com/t/understanding-gpt-4o-mini-tts-pricing-input-characters-cost/1151816)
- [Best Local TTS Models in 2026 — LocalClaw](https://localclaw.io/blog/local-tts-guide-2026)
- [Every Piper Voice, Ranked — Quick TTS](https://quick-tts.com/blog/piper-voices-ranked.html)
- [es_MX-claude-high Piper voice — Quick TTS](https://quick-tts.com/voice/es-mx-claude-high/)
- [rhasspy/piper-voices — Hugging Face](https://huggingface.co/rhasspy/piper-voices)
- [Kokoro vs Piper vs XTTS v2 — Contra Collective](https://contracollective.com/blog/kokoro-vs-piper-vs-xtts-local-text-to-speech-m5-max-2026)
- [Spanish Colombian Accent Voice Actors — Voices.com](https://www.voices.com/voice-actors/accent/south-american-colombian)
- [24 Best Spanish Voice Over Services — Fiverr](https://www.fiverr.com/gigs/spanish-voice-over)
- [Meet the Voices behind Duolingo Characters — Toolify](https://www.toolify.ai/ai-news/meet-the-voices-behind-duolingo-characters-35701)
- [Duolingo character voices — Duolingo Blog](https://blog.duolingo.com/character-voices)
