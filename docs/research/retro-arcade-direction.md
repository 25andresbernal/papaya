# Retro Arcade Direction: Should Papaya Look Like Metal Slug?

**Question:** Andre loves Duolingo's simplicity but doesn't want Papaya to read as a clone of it.
He is drawn to Metal Slug's retro arcade look — pixel art, HUD, "INSERT COIN" energy, chiptune —
but Papaya is for 5-10 year-olds, so we want the arcade *feel*, not the guns and war. This is the
homework before touching code: what makes that look work, which parts translate to a learning
app, how to produce pixel art with no pixel artist on the team, and how much of the app we'd
realistically have to redo.

**Short answer up front:** don't repaint the characters. Build an "arcade shell" — pixel-styled
chrome, HUD, fonts, sound, and stage-select framing — around the flat SVG characters and word art
Papaya already has. It gets most of the Metal Slug *feeling* for a fraction of the *cost*, and it
doesn't put 13 buddies and 334 word pictures at risk. Details below.

---

## 1. What Metal Slug actually looks like, and its kid-friendly cousins

Metal Slug (SNK/Nazca, 1996) is not really about pixel resolution — it's about **animation
density and drawing confidence**. Nazca kept adding in-between frames long after other studios
were cutting them to save memory, so characters run, stumble, and get blown back with far more
frames than their contemporaries. The visual references the artists cited were Miyazaki films,
not war movies — the goal was "limitless exaggeration," not realism. That's the lesson for
Papaya: the arcade feeling comes from *how much a character reacts*, not how many colors are on
screen ([Creative Bloq](https://www.creativebloq.com/entertainment/gaming/why-metal-slug-still-looks-better-than-many-modern-games),
[Linclo Games](https://linclogames.com/metal-slug-is-pixel-art-perfection/)).

The palette is deliberately narrow — heavy on greens and browns for its jungle/desert stages —
with every sprite built the same three-step way: **shape it, color it flat, then shade it** with
one or two darker tones for form ([6th Division's Den](https://6th-divisions-den.com/ms_tutorial.html),
[Sci-Fi-O-Rama](https://www.sci-fi-o-rama.com/2009/10/10/metal-slug-pixel-art/)). Outlines are
thin, dark, and consistent; dithering is sparing (skies, water); every silhouette reads instantly
at small size — a discipline Papaya's flat SVGs already follow, just without the pixel grid.

The HUD is minimal and always visible: score top-left, lives as "1UP"/"2UP," an "ARMS" counter
for the current weapon, a bomb count, and a stage timer that flashes and alarms near zero
([Metal Slug Wiki — Status Screen](https://metalslug.fandom.com/wiki/Status_Screen)). It never
covers the action, sitting in flat colored boxes at the screen edges. The tone stays silly even
mid-battle — comedic ragdolls, happy-dancing rescued prisoners, a continue countdown with a
mascot instead of a grim "game over."

**Kid-friendly cousins, and what they share:**

| Game | Shares with Metal Slug | Kid-safe lesson |
|---|---|---|
| **Kirby** | Soft rounded sprites, huge expressive eyes | Removes menace — nothing reads as a threat |
| **Shovel Knight** | Tight 8-16px palette, hard edges ([style guide](https://www.sprite-ai.art/blog/2d-pixel-art-style-guide)) | Modern-polished animation over an 8-bit skeleton |
| **Stardew Valley** | 16-32px sprites, disciplined seasonal palettes, gentle dithering | Warmth from restraint, not detail |
| **Celeste** | Small, clean, highly expressive sprites | Emotional readability at tiny scale |
| **Pokémon (Gen 3)** | Chunky overworld sprites, simple 2-3 tone shading | A whole game runs on simple, repeating tile art |
| **Advance Wars** | Bright, chibi unit sprites, big readable silhouettes, clean HUD | "War" as a board-game-bright cartoon — chrome without the tone |
| **Cadence of Hyrule** | An existing world redrawn in a warmer modern-retro palette | Proof a "shell" reskin can work on top of existing content |

The throughline, and the rule Papaya should copy: **exaggerated, friendly animation and a tight,
repeated palette matter far more than pixel density.** A 16x16 sprite with great squash-and-
stretch reads more "alive" than a 64x64 sprite with none. Papaya's rig
(`src/components/buddies/rig.tsx`) already treats mood as swappable eyes/mouth on a shared body —
the same underlying idea Metal Slug and Advance Wars use, just drawn as smooth SVG curves instead
of a pixel grid.

I did not find a widely known kids' *learning* app that fully commits to this pixel-arcade look;
the closest is **Pixel Math**, a retro-styled arcade math drill for ages 5-12 that unlocks pixel
sticker rewards ([Google Play](https://play.google.com/store/apps/details?id=com.multiplicationquiz.app&hl=en_US)).
That's a signal, not a crowded lane — the aesthetic is validated for this age but nobody has
taken it seriously for language learning yet.

---

## 2. Retro arcade UI patterns that translate to Papaya

Arcade UI communicates the most important number on screen instantly, in the smallest space,
because arcade players are impatient by design — a lesson that maps directly onto a 3-minute
lesson loop ([Game Design Skills](https://gamedesignskills.com/game-design/arcade/)). Patterns
worth borrowing:

- **Stage banners ("STAGE 1-1").** A short title card before a lesson starts — "UNIT 3 · STAGE
  2" — dresses up the current lesson-intro screen. Cheap, high impact, free real estate.
- **Score pop-ups and combo counters.** Give the existing combo counter a pixel-font "+10" that
  pops and floats up from the tapped button, instead of only updating a number in place.
- **Hi-score tables.** Papaya's local leaderboard (Race mode) is already the arcade hi-score
  table; it just needs the dress — rank numbers, a blinking cursor by the newest entry, a trophy icon.
- **Coin/credit counters.** Papayas and tickets are already currencies; render them in the top bar
  as a HUD readout (icon + chunky number in a dark panel) instead of a soft rounded pill.
- **"PRESS START," blinking prompts.** A blinking "TAP TO PLAY" on idle screens is free
  personality and doubles as an affordance cue for pre-readers.
- **Results screens with rank letters (S/A/B).** A strong fit: letter-grade end screens are one of
  the most recognizable arcade conventions and map neatly onto Papaya's crown system — S for
  perfect, A for 80%+, B for finishing ([TV Tropes — Gameplay Grading](https://tvtropes.org/pmwiki/pmwiki.php/Main/GameplayGrading)).
  The "no fail state" rule stays intact: the worst rank is a friendly "B," never an F.
- **Continue countdowns.** Reframe as a positive beat, not a threat — "NEXT LESSON IN 3... 2... 1"
  on the path screen, arcade personality without the "insert coin or lose progress" pressure that
  made the original mechanic predatory.
- **Character select with portraits.** A natural, better home for the Buddies screen than a card
  grid — numbered portrait boxes, a "PLAYER 1" panel for the chosen buddy, locked slots shown as
  a silhouette.
- **CRT/scanline overlays — keep subtle or off.** CRT effects exist because old monitors drew
  visible scanlines and curved glass, and were historically associated with eye strain from long
  viewing, not a cure for it ([GamesRadar+](https://www.gamesradar.com/hardware/retro/what-are-scanlines/)).
  A heavy scanline layer also lowers contrast, which fights readability for young eyes.
  Recommendation: no scanlines/curvature on any screen with text a kid must read, and a very
  faint, toggle-able scanline texture only on pure celebration screens, never over buttons or words.

---

## 3. Making pixel art with no pixel artist

Ranked for Papaya's real constraints — solo founder, AI coding agents, no stated art budget,
13 buddies (5 moods each) and ~334 word pictures already built as flat SVG this week.

**(a) Code-generated pixel sprites (grids of chars → SVG rects or `<canvas>`).** Represent a
sprite as rows of characters (`".xx.."`) mapped to a small palette, render each cell as a rect
(SVG) or `fillRect` (canvas) at a fixed size, with the container's CSS set to
`image-rendering: pixelated` so later scaling stays crisp instead of blurring
([CSS-Tricks](https://css-tricks.com/fun-times-css-pixel-art/), [theosoti](https://theosoti.com/short/crispy-images/)).
Fully within reach for AI coding agents — data plus a loop, no drawing skill required, and it fits
Papaya's "everything is code" ethos. It's good for **icons, HUD glyphs, coins, small decorations**
at 16x16-32x32, and poor for expressive character animation, where squash-and-stretch at low
resolution genuinely needs a trained eye.

**(b) Keep the flat SVG characters, frame them in a pixel-styled UI.** Mixed style is a real risk
in general, but it's exactly what Cadence of Hyrule and countless indie "juice pass" reskins do
successfully: smooth illustration inside a chunkier, high-contrast frame (panel borders, HUD
chrome, pixel-font labels) reads as "one game's style," because the frame — not the illustration —
is what a player scans first. The risk only shows up if pixel chrome and smooth characters fight
for the same job (e.g. a pixel-font bubble wrapping curved SVG text). Rule: **pixel treatment on
UI chrome and type, smooth treatment on characters and word art, never mixed within one shape.**

**(c) AI image generation for pixel art.** Purpose-built tools beat asking a general model for
"pixel art": **Retro Diffusion** takes up to nine reference images to lock a character's look and
outputs grid-aligned pixels at 16x16-384x384, priced around $0.015-$0.18/image, trained on
licensed art with artist consent ([Retro Diffusion](https://retrodiffusion.ai/),
[astropulse.itch.io](https://astropulse.itch.io/retrodiffusionai)); **PixelLab** generates a
posable sprite skeleton for 4-8 directional facing, the actual hard problem in sprite work
([Sprite-AI roundup](https://www.sprite-ai.art/blog/best-pixel-art-generators-2026)).
General-purpose models (Midjourney, DALL-E) are worse at true pixel grids and holding a character
consistent frame to frame. Licensing is the catch: check each tool's commercial-use terms before
shipping, since some pixel-specific models carry consent terms that restrict resale or need attribution.

**(d) Commission a pixel artist.** Fiverr gigs for a sprite sheet commonly start near $10-15
([Fiverr listings](https://www.fiverr.com/gigs/pixel-art-character)), but that tier is one static
pose, not 5 expressions plus idle motion. Realistic quality pricing runs $20-150 for a basic sprite
up to several hundred for a detailed animated one ([2D Will Never Die](https://2dwillneverdie.com/blog/how-much-do-sprites-cost/)).
For 13 characters × 5 expressions × idle animation, a budget-tier commission lands near
**$50-150 per character** (roughly **$650-2,000 for the cast**), plus a cheaper separate job for
~50 HUD/word icons. Highest quality, lowest effort for Andre, but the only option with real dollar
cost and turnaround/consistency risk.

**(e) Free CC0/permissive asset packs.** Kenney.nl offers 60,000+ CC0 assets, cut into matching
spritesheets, including a **Pixel UI Pack** (750 HUD/UI pieces) and a **Pixel Platformer** pack
([Kenney.nl](https://kenney.nl/assets/pixel-ui-pack)). For a jungle/Colombia backdrop, the **Open
Pixel Project jungle-and-temple set** (500+ tiles, public domain, DB32-consistent —
[OpenGameArt](https://opengameart.org/content/opp2017-jungle-and-temple-set)) and **Green World
Tileset** (CC0 generic jungle — [itch.io](https://itch.io/games-like/435617/fantasy-jungle-pixel-art-tileset))
are strong, zero-cost fits. These solve HUD chrome and background art for free; they don't solve
"13 unique Colombian-animal buddies," since a generic pack won't contain Tico the toucan by name.

**Ranking for Papaya:**
1. **(e) free CC0 packs for HUD chrome and jungle backgrounds** — ship immediately, zero cost, zero risk.
2. **(a) code-generated pixel sprites for icons, coins, badges, and small HUD glyphs** — fits the existing "no binary assets" workflow and AI-agent-friendly production.
3. **(b) keep flat SVG characters inside a pixel frame** — the pragmatic choice for the cast that already exists; see Section 6.
4. **(d) commission a pixel artist** — the right *future* move only if/when Andre decides to fully repaint the 13 buddies, budgeted per Section 6's Option C.
5. **(c) AI-generated pixel art** — promising but immature for a consistent named cast; worth a small trial (e.g., regenerate one buddy with Retro Diffusion's reference-image mode) before committing a budget to option (d).

---

## 4. Typography and sound

**Pixel fonts on Google Fonts, ranked for a 5-10 year-old audience:**

| Font | Best use | Kid readability |
|---|---|---|
| **Press Start 2P** | Logo, one-word HUD labels | True 8x8 bitmap letterforms — most authentic, least legible; large size, short text, all caps only ([Google Fonts](https://fonts.google.com/specimen/Press%2BStart%2B2P), [roundup](https://fontyouneed.com/fonts/top-pixel-fonts-on-google)) |
| **Silkscreen** | Short badges, HUD chips | Same bitmap constraints; bold hurts readability further — labels only |
| **VT323** | Score counters, timers | Terminal font; taller x-height reads better in digit rows than the two above, still thin for prose |
| **Pixelify Sans** | Recommended body/UI text | A *rounded*, humanist pixel font — legible at UI sizes; the "rounded pixel font" this brief asks for |
| **DotGothic16** | Alternative body/label font | Dot-matrix look, more even spacing than Press Start 2P, still clearly retro-digital |

**Recommendation:** pair a genuine bitmap face for flavor moments only (Press Start 2P or
Silkscreen, all caps, short strings: "STAGE 3," "S RANK," "1UP") with **Pixelify Sans** as the
actual UI/body pixel-flavored font wherever a kid reads more than a couple of words, and keep
**Fredoka** as the primary display face for anything that must be instantly legible (lesson
prompts, buddy dialogue, buttons). Fredoka becomes the "readable" register next to the "arcade"
register — the same two-register trick Duolingo uses with Feather vs. DIN Next Rounded, already
validated for this app in the existing visual-design research.

**Chiptune sound.** Papaya already synthesizes SFX/music with the Web Audio API, so chiptune is
additive, not a new dependency. The building blocks map directly onto `OscillatorNode`:
**square waves** (optionally variable duty-cycle/pulse width) for lead melodies and "coin/ding"
stingers, **triangle waves** for soft basslines or arpeggiated chords (rapidly cycling 2-4 notes
to fake polyphony on one voice — the classic NES/Game Boy trick), and **noise** (a white-noise
buffer through a bandpass filter) for drum hits and "hit/miss" impacts
([8-bit synthesis gist](https://gist.github.com/clawdbrit/46d33c53fbfcbff75df6c08f88d23808),
[chiptune-synth](https://github.com/8Binami/chiptune-synth), [Plutiedev](https://plutiedev.com/chiptune-sounds),
[Dan Black — duty-cycle squares](https://www.danblack.co/blog/variable-duty-cycle-square-wave)).
An **arpeggiator** — stepping an oscillator through a chord's notes on a fast timer — is the
single highest-value addition: it turns a one-voice melody into a "big" chiptune riff instead of
a beep, and it's a small, reusable function for `src/audio/`.

---

## 5. Palette: an "arcade Papaya" 16-bit palette

Keep every brand hue as the mid tone, add a darker outline/shadow step and a lighter highlight
step per hue — the dark/mid/light triad DawnBringer-style retro palettes use, matching Metal
Slug's own shape → flat color → shade-step method ([DawnBringer 32](https://lospec.com/palette-list/dawnbringer-32)).
This keeps Papaya's identity intact while every asset reads as pixel-shaded.

| Hue | Outline (darkest) | Mid (brand color, unchanged) | Highlight |
|---|---|---|---|
| Papaya orange | `#7A3B12` | `#FF8A3D` | `#FFC08A` |
| Leaf green | `#153B18` | `#3DAA47` | `#7FCB85` |
| Sky blue | `#12405C` | `#4DA8DA` | `#8FCBEC` |
| Sun yellow | `#7A5A0A` | `#FFC93C` | `#FFE28A` |
| Coral | `#7A2323` | `#FF6B6B` | `#FFA0A0` |
| Rose (already added for pinker buddies) | `#7A2F4D` | `#FFA6C9` | `#FFD3E4` |
| Seed brown (ink/outline neutral) | `#1E140C` | `#3B2A1A` | `#6B4A2E` |
| Cream (background/paper) | `#D8C79E` | `#FFF6E5` | `#FFFFFF` |

That's 24 tokens (8 hues × 3 steps) — inside the typical 16-24 color range for a 16-bit-styled
palette, reusing every existing token as anchor so nothing needs recoloring, only extending.
`seed`'s darkest step becomes the universal pixel-outline color, matching how the rig already
uses `INK` for outlines and rig details.

**Handling the cream background.** A flat cream fill reads as clean-but-plain next to pixel-styled
chrome. Two low-risk, CSS/SVG-only options: **(1) a subtle pixel-pattern texture** — a tiny
repeating dot-matrix or grid pattern in cream + cream-dark, barely-there, tiled behind menus and
the top bar; **(2) a jungle backdrop band** — a low-detail, low-contrast strip of jungle
silhouette (leaves, vines, a distant mountain nod to Colombia) built from the Open Pixel Project
tiles (Section 3e), sitting behind Home/Path content. Recommendation: (1) everywhere as the
default texture, (2) reserved for Home and Path, where a sense of place pays off most.

---

## 6. Risk assessment: how much of the app actually needs to change

Papaya shipped 13 flat SVG buddies (with 5 moods each) and ~334 flat word-art SVGs this week,
built on a shared rig (`Eyes`, `Mouth`, `BuddyFrame`, `<Kid/>`) specifically so the whole app
reads as one illustrated family. That system is valuable, tested, and expensive to reproduce.

- **(A) Full pixel-art rebrand.** Redraw all 13 buddies (5 moods + idle motion each) and all 334
  word pictures as true pixel art. Highest payoff, highest risk: it discards a just-finished
  working system. Even conservatively (0.5-1 agent-day per buddy mood set, 0.1-0.25 per word
  picture, done in code per 3a since there's no in-house pixel artist), that's roughly
  **45-70 agent-days**, before the "doesn't read at 28px" redo pass `docs/design/word-art.md`
  already flags as a risk for detailed art. Not recommended now.
- **(B) Arcade shell rebrand.** Keep every buddy and word-art SVG as-is; change only the frame:
  HUD, top bar, buttons, cards, stage banners, results screens, fonts, backgrounds, sound.
  Estimated **8-14 agent-days**: pixel-styled `Button`/`Card`/`TopBar` (2-3 days), HUD readouts
  (1 day), stage banner + rank-letter results screen (2 days), font wiring (0.5 day), chiptune
  pass on `sfx`/music (2-3 days), jungle band + texture (1-2 days), CC0 icon integration (1 day).
- **(C) Shell first, characters later.** Ship (B), then treat a future buddy-only pixel
  conversion as its own phase — likely commissioned art (Section 3d, ~$650-2,000) once the shell
  has proven the direction with real kids, not a code-only redraw.

**Recommendation: (B), with (C) held open as a later phase, not committed now.** It matches
CLAUDE.md's phased-build and stay-in-scope rules, respects the just-shipped word-art and buddy-rig
investment, and is reversible if the shell doesn't land with Andre's kids. **What the kids would
notice most from (B) alone:** the chiptune sound (the single most immediate "arcade" cue for this
age), the stage-banner/rank-result screens (a strong new beat vs. today's plain complete screen),
and the HUD-style top bar. They would likely not notice the characters staying smooth-SVG, since
moods and reactions — what kids actually respond to — are unchanged.

---

## Papaya Arcade — visual language spec

**Palette:** existing 8 brand hues, each split into outline/mid/highlight per Section 5 (24
tokens total). Seed-dark (`#1E140C`) is the universal pixel-outline color for chrome elements
only (never on characters, which stay outline-free per the current rig).

**Fonts:** Fredoka (display headings, buttons, buddy dialogue — unchanged, primary readable
register) + Nunito (body — unchanged) + **Pixelify Sans** (secondary UI register: HUD labels,
stat chips, small captions, anywhere "retro" flavor is wanted but a kid still has to read it) +
**Press Start 2P**, all-caps, short strings only (logo lockup, "STAGE," "S RANK," "1UP," never
more than one short word or number at a time).

**HUD layout:** top bar becomes a dark seed-brown panel strip (not cream) with three chunky
pixel-icon+number chips (streak, papaya, ticket) left to right, and the XP bar as a segmented,
blocky-notch bar rather than a smooth gradient — same data as today, new frame only.

**Button style:** keep `btn-chunky`'s press-down mechanic unchanged, but square corners slightly
(8-12px radius) and add a 2-3px seed-dark border so buttons read as HUD chrome; the four Kahoot
answer colors stay exactly as-is.

**Card style:** panels get a visible pixel-style border (2-3px) plus one small corner-notch
detail instead of a plain drop shadow; buddy art and word art inside stay smooth SVG, untouched.

**Backgrounds:** cream stays the base, with the faint pixel-pattern texture app-wide and the
low-contrast jungle band on Home/Path only, built from CC0 tiles.

**Animation rules:** keep existing pop/wiggle/bounce/shake/float keyframes for characters
unchanged. Add one new rule: HUD/score numbers snap in discrete steps (no easing), so the HUD
reads as "digital" against the "alive," smoothly-eased characters.

**Sound rules:** every tap keeps its instant sfx (DNA principle 1), shifted to chiptune
waveforms: square-wave "ding" for correct, a short noise "thud" for gentle-wrong (never harsh),
triangle arpeggio for combo milestones and level-ups, and a simple looped square+triangle riff as
lesson music, sped up when the optional timer is on (existing rule, unchanged).

**Build order:**
1. Extend the Tailwind color tokens with the outline/highlight steps (Section 5); add Pixelify
   Sans and Press Start 2P as new `--font-*` tokens, loaded from Google Fonts alongside Fredoka/Nunito.
2. Restyle `Button`, the card wrapper, and `TopBar` with the new border/corner/HUD-panel rules —
   no logic changes, CSS and small markup only.
3. Build a `StageBanner` component ("UNIT N · STAGE N") shown before a lesson starts, and a
   `RankResult` component (S/A/B letter, per today's crown thresholds) for the lesson-complete screen.
4. Add chiptune primitives to `src/audio/` — a square-wave blip, a noise thud, and a simple
   arpeggiator helper — and re-map existing `sfx.*` calls onto them one at a time.
5. Add the pixel-pattern background texture app-wide and the jungle background band on Home/Path,
   sourced from CC0 packs (Kenney Pixel UI Pack for icons, Open Pixel Project jungle set for the backdrop).
6. Playtest with Andre's kids; only after that, scope a character-conversion phase (Option C)
   if the direction is landing and a real art budget is on the table.

---

## Sources

- [Metal Slug 30th Anniversary: why its pixel art still beats many modern "realistic" games — Creative Bloq](https://www.creativebloq.com/entertainment/gaming/why-metal-slug-still-looks-better-than-many-modern-games)
- [Metal Slug Is Pixel Art Perfection — Linclo Games](https://linclogames.com/metal-slug-is-pixel-art-perfection/)
- [Metal Slug Spriting Tutorial — 6th Division's Den](https://6th-divisions-den.com/ms_tutorial.html)
- [Metal Slug Pixel Art — Sci-Fi-O-Rama](https://www.sci-fi-o-rama.com/2009/10/10/metal-slug-pixel-art/)
- [Status Screen — Metal Slug Wiki](https://metalslug.fandom.com/wiki/Status_Screen)
- [2D pixel art style guide: from 8-bit to modern HD — Sprite-AI](https://www.sprite-ai.art/blog/2d-pixel-art-style-guide)
- [Arcade Game Design fundamentals — Game Design Skills](https://gamedesignskills.com/game-design/arcade/)
- [Gameplay Grading (S/A/B rank results screens) — TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/Main/GameplayGrading)
- [Pixel Math — retro arcade math game for kids 5-12](https://play.google.com/store/apps/details?id=com.multiplicationquiz.app&hl=en_US)
- [Press Start 2P — Google Fonts](https://fonts.google.com/specimen/Press%2BStart%2B2P)
- [VT323 — Google Fonts](https://fonts.google.com/specimen/VT323)
- [Top Pixel Fonts On Google Fonts For Retro Designs](https://fontyouneed.com/fonts/top-pixel-fonts-on-google)
- [What are scanlines? — GamesRadar+](https://www.gamesradar.com/hardware/retro/what-are-scanlines/)
- [Fun Times With CSS Pixel Art — CSS-Tricks](https://css-tricks.com/fun-times-css-pixel-art/)
- [CSS image-rendering: pixelated — theosoti](https://theosoti.com/short/crispy-images/)
- [8-Bit Music Synthesis with Web Audio API — GitHub Gist](https://gist.github.com/clawdbrit/46d33c53fbfcbff75df6c08f88d23808)
- [chiptune-synth — 8-bit audio engine for the browser, GitHub](https://github.com/8Binami/chiptune-synth)
- [Chiptune sound design — Plutiedev](https://plutiedev.com/chiptune-sounds)
- [Creating variable duty cycle square waves with the Web Audio API — Dan Black](https://www.danblack.co/blog/variable-duty-cycle-square-wave)
- [Retro Diffusion — AI pixel art generator](https://retrodiffusion.ai/)
- [Best pixel art generators 2026, tested for game devs — Sprite-AI](https://www.sprite-ai.art/blog/best-pixel-art-generators-2026)
- [Kenney.nl — Pixel UI Pack (CC0)](https://kenney.nl/assets/pixel-ui-pack)
- [OPP2017 — Jungle and temple set — OpenGameArt](https://opengameart.org/content/opp2017-jungle-and-temple-set)
- [Fantasy Jungle Pixel Art Tileset — itch.io](https://itch.io/games-like/435617/fantasy-jungle-pixel-art-tileset)
- [Fiverr — pixel art character gigs](https://www.fiverr.com/gigs/pixel-art-character)
- [How much do sprites cost? — 2D Will Never Die](https://2dwillneverdie.com/blog/how-much-do-sprites-cost/)
- [DawnBringer 32 Palette — Lospec](https://lospec.com/palette-list/dawnbringer-32)
