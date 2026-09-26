# Visual Design Research: Replacing Emoji with a Real Character System

**Question:** Papaya uses plain Unicode emoji for the 12 buddies, the hero avatar, and ~334
vocabulary card pictures. Andre wants unique designs, loves Duolingo's simplicity, and loves
the silliness of Duo the owl getting dramatic when a kid skips lessons. This report is the
homework before we touch any code: how Duolingo and other kid apps build simple, consistent
characters, what it would take to build our own 12-animal set in code, what to do about the
334 vocabulary pictures, and how to make a buddy's "sad" moment funny instead of guilty.

---

## 1. Duolingo's design system

**Shape language.** Duolingo's illustration guide is built on three shapes only: the rounded
rectangle, the circle, and the rounded triangle — always with rounded corners, never a sharp
point. The rule of thumb is "fewest shapes possible": a character's head and body are each
just 1–2 basic shapes, not a detailed drawing. Depth is allowed but stays on the same flat
plane — no perspective, no vanishing points. This is exactly the LEGO-brick approach we want:
a small kit of parts, reused everywhere, so a 12-animal set actually feels like one family
instead of 12 unrelated drawings.

**No heavy outlines.** Duolingo characters are built from flat, solid color shapes, not
line drawings colored in. Where a stroke exists it's used sparingly (mostly on UI icons, not
characters) and it's thick, rounded-cap, and a single consistent weight — never a thin
sketchy line. This matters for us: outlines instantly age up or down an illustration style,
and a heavy uniform stroke reads as "toy," which is the target for ages 5–10.

**Limited, named palette.** Duolingo's core colors are Feather Green `#58CC02` (their
signature "go" color, the streak color, the owl), Macaw blue `#1CB0F6`, Cardinal red
`#FF4B4B`, and Bee yellow `#FFC800`, with a couple of darker shade-siblings (Tree `#58A700`,
Whale `#1899D6`) used for shadows/pressed states rather than as separate hues. That's the
whole system: 4 bright primaries plus 1 dark variant of each for the "3D" button edge, plus a
neutral gray (Eel `#4B4B4B`) for text. They literally name colors after animals — a small,
playful detail worth stealing for our own palette names.

**Chunky 3D buttons.** The pressable, bottom-shadow button ("gumdrop" style) everyone
associates with Duolingo and Kahoot is done with a solid (non-blurred) offset shadow in a
darker shade of the button's own color — e.g. `box-shadow: 0 4px 0 #58A700` under a
`#58CC02` button — and on press, the button translates down by roughly that same offset while
the shadow shrinks to zero, so it visually "lands." Papaya's `btn-chunky` class already does
this; the research confirms it's the right pattern to keep and to extend to cards and badges.

**Typography.** Duolingo commissioned a bespoke display face, **Feather** (by Krista Radoeva
at Fontsmith, part of the 2019 Johnson Banks rebrand), whose letterforms are literally shaped
like the owl's wing — a wing-tipped stem junction and a little flick on the lowercase "g." It's
used for headlines, buttons, and big numbers. Body and UI text uses **DIN Next Rounded**, a
licensed commercial rounded grotesk, for a lighter, more legible read at small sizes. We can't
license either, but the *lesson* transfers directly: pair one **rounded, characterful display
face** (Papaya already uses Fredoka, which is genuinely very close in spirit to Feather — both
are rounded, geometric, slightly bouncy) with a **plain, highly legible rounded body face**
(Nunito is a fine analog to DIN Next Rounded). No font change needed — just confirms the
current Fredoka + Nunito pairing is the right call.

**Duo's moods.** Duolingo didn't always have a full emotional range — for years the owl only
had "happy" and "crying." The 2019 redesign rebuilt Duo specifically to carry a wide emotional
range (bewildered, smug, furious, sleepy, sunglasses-cool, heartbroken) while staying simple
enough to animate: his wings are drawn as half-circles tucked behind the body so he reads
consistently from any angle, and moods are conveyed almost entirely through **eyebrows, eye
shape, and mouth** — the body shape barely changes. That's the technical trick worth copying:
one body silhouette, a small swappable face-parts library, and mood is 90% eyebrow + mouth.
Duo's most famous emotional beat — the "sad/crying" state tied to a broken streak — works
because it is *exaggerated and self-aware*, not because it threatens anything concrete (see
Section 5).

**World characters.** Beyond Duo, Duolingo has a small cast (Lily the sarcastic teen, Zari,
Falstaff the bulldog, Oscar, Eddy, Junior) each with one dominant personality trait and a
distinct "voice" used in notification copy — Lily is deadpan/sassy, Oscar is dramatic and
diary-style. Visually they follow the exact same shape/color rules as Duo so the *family* reads
as one system even though each character is instantly distinguishable by silhouette (Falstaff
is a squashed oval + big jowls; Lily is a rectangle body + sharp asymmetric hair shape). This
is the direct model for our 12 buddies: same rig, different silhouette accessory + 2-3 signature
shapes per animal.

---

## 2. Other kid apps with great simple illustration

A pattern repeats across every well-regarded kids' app:

- **Khan Academy Kids** — friendly animal cast (Kodi the fox, Lee the panda, etc.) with big
  heads, tiny simplified bodies, flat solid colors, thick even outlines, and huge dot-and-highlight
  eyes. No gradients. Characters are drawn "chibi" (head is 40–60% of total height) which reads
  as instantly non-threatening and toddler-friendly.
- **Lingokids** — similarly oversized heads, rounded everything, a warm primary-plus-pastel
  palette (never more than 6-7 hues on screen at once), and mascots (Lingokids' monsters) built
  from soft blob bodies with 2-3 accent shapes (spots, a tuft of hair, a horn).
- **Toca Boca / Sago Mini** — arguably the cleanest reference for "shape economy." Toca Boca
  characters are built almost entirely from circles and rounded rectangles with minimal
  interior detail — a nose might be a single dot, eyes are simple ovals or dots with no
  eyelashes or eyebrows drawn as separate strokes. Sago Mini (Robin the Bird, Jinja the Cat,
  Harvey the Dog, Jack the Rabbit) uses the same shape economy but a softer, slightly more
  pastel palette and rounder proportions aimed at an even younger (2-5) audience.
- **Endless Alphabet / Endless Reader** — a cast of googly-eyed "monsters" that are essentially
  one blob body reused with a different texture/color and 1-2 signature features (horns, a
  single tooth, extra eyes). The whole appeal is *exaggerated, silly reactions* to each letter
  or word — bodies squash, stretch, and wobble. This is the best real-world reference for "silly
  without being mean" (see Section 5).
- **PBS Kids** — the most conservative of the group: flat color, thick uniform outline stroke
  (usually 4-8px at typical display size), rounded corners everywhere, high color saturation,
  and a strict "no gradient, no drop shadow on the character itself" rule (shadows are a simple
  flat ellipse under the character's feet, not a glow).

**Shared rules across all of them**, which should become our own hard constraints:

1. **Big head, small/simple body** for anything meant to look "cute" and non-scary to a 5-year-old.
2. **A palette that tops out around 6-8 total hues**, reused across every character — no
   character gets a "private" color nobody else uses.
3. **Eyes are the emotional engine.** Big, simple (circle or oval + a smaller pupil dot),
   usually with one small white highlight dot. Eyebrows do almost all of the mood work.
4. **Flat color only.** No gradients, no drop shadows on the character body, no bevels. A
   single flat drop-shadow ellipse under the feet is the one "3D" cue allowed.
5. **Consistent stroke width app-wide, if you use strokes at all.** Papaya can go stroke-free
   (Duolingo-style, flatter/cleaner) or pick one stroke width (e.g. 3px) and never deviate —
   mixing stroke weights is the #1 thing that makes a homemade character set look inconsistent.

---

## 3. Building a consistent SVG character set in code (no designer, no paid assets)

This is the practical payoff: React + inline SVG (or small standalone `.tsx` files, one per
buddy) is genuinely a good medium for this, *if* every character is assembled from the same
small kit of parts. Below is a concrete rig.

### 3.1 The shared rig

```
BuddyBase (shared component)
 ├── <ellipse> ground shadow (flat, 30% black, no blur)
 ├── Body shape        (1 of 3 body primitives, per-animal color)
 ├── Belly/chest patch (optional lighter ellipse, ~70% of body width)
 ├── 1-2 signature shapes (the "silhouette tell" — see spec below)
 ├── Eyes (shared <Eyes mood="happy|excited|sad|mad|sleepy" /> component)
 ├── Mouth (shared <Mouth mood=... /> component)
 └── Limbs/feet (2 simple rounded-rectangle stubs, same for every ground animal;
                 wings for birds reuse the Duo trick — a half-circle behind the body)
```

- **Base body template:** a single rounded blob — either a circle, an egg (ellipse stretched
  vertically), or a rounded rectangle with a large corner radius (`rx`/`ry` at 30-40% of the
  shorter side). Pick ONE of these three per animal, driven by a `bodyShape` prop
  (`"circle" | "egg" | "capsule"`), not a fourth bespoke path per animal.
- **2-3 shape primitives per animal** on top of that body: e.g. the toucan is [egg body] +
  [huge triangle-with-rounded-tip beak] + [small circle head]. The capybara is [capsule body,
  wide and low] + [small rounded-rectangle snout] + [two small oval ears]. Nothing fancier than
  that — every "signature shape" should be describable in one sentence.
- **Shared eye component.** One `<Eyes>` SVG component, parameterized by mood, reused by every
  animal and by the hero. Two white ovals + two black pupil circles + two tiny highlight dots is
  enough; eyebrows are separate short rounded-rect or arc paths positioned above the eyes and are
  the main mood lever (angled down-in for mad, angled up-out and raised for excited, drooping
  outer corners for sleepy).
- **Shared mouth set for moods**, one path shape per mood, swapped by a `mood` prop:
  - **happy** — simple upward arc (a "u" shape), open, no teeth.
  - **excited** — wider arc + a small rounded rectangle "tongue" or two tooth-marks, corners
    turned up more sharply.
  - **sad** — the same arc flipped upside down (a frown), optionally paired with a single
    oversized teardrop ellipse.
  - **mad** — a flat or slightly zig-zag line, tight and short, with eyebrows angled sharply in.
  - **sleepy** — a small flat oval ("o" mouth) or a closed flat line, paired with drooping-lid
    eyes (draw the eyes as thin ovals rather than full circles for this one mood only).
- **Color palette: 6-8 total hues** shared across all 12 buddies (reuse Papaya's existing
  tokens): papaya orange, leaf green, sky blue, sun yellow, coral, seed brown (for outlines/eyes/
  accents), cream (for belly patches/highlights), plus one extra warm neutral (a soft pink or
  tan) for variety on the pinker animals (flamingo, dolphin). No animal invents a brand-new hue;
  each is assigned 1 dominant + 1 accent color from this shared set.
- **Strokes:** either none (flat Duolingo style, shapes separated by color contrast and a subtle
  1px darker-shade edge if needed for legibility on the cream background), or a single flat
  2-3px seed-brown stroke on every shape, app-wide, no exceptions. Recommend **no stroke, flat
  shapes with a slightly darker shade for facial details** (eyes, mouth, feet) — it matches the
  papaya/Duolingo direction better than PBS Kids' heavier stroke look and is easier to keep
  crisp at small sizes (buddy avatar in the top bar can be tiny).

### 3.2 Rough spec for each of the 12 buddies

All use the same rig: body primitive + 1-2 signature shapes + eyes/mouth component + 2-color
assignment from the shared 8-hue palette. (Names/ids match `src/data/characters.ts`.)

| Buddy | Body | Signature shape(s) | Colors |
|---|---|---|---|
| Tico the Toucan | egg, upright | huge rounded-triangle beak (2-tone: orange base, yellow tip), small round head | papaya orange (beak) + seed-brown/ink body |
| Lola the Sloth | circle, squashed | long curved arm shapes wrapping the body, permanently half-closed sleepy eyes | leaf green undertone (algae) + cream face patch |
| Capi the Capybara | wide low capsule | flat rounded-rectangle snout, 2 small oval ears | seed brown body + cream belly |
| Pinki the Flamingo | egg, tall, balanced on one thin capsule leg | long "S"-curve neck as a thick rounded stroke shape, small round head | coral / pink (new accent hue) |
| Rana the Frog | circle, flattened | 2 huge bulging circle eyes sitting ON TOP of the head (not inside it), tiny rounded-rectangle legs | sun yellow + leaf green spots |
| Manu the Monkey | circle head + smaller capsule body | round ears, long simple curved-line tail | seed brown + cream face patch |
| Coco the Hummingbird | small circle body | long thin rounded-triangle beak, 2 slim wing ovals angled back | sky blue + sun yellow chest |
| Tortu the Sea Turtle | rounded-rectangle shell (the signature shape) + small circle head | hexagon-pattern suggested with 2-3 simple line strokes on shell, flipper capsules | leaf green shell + cream belly |
| Osito the Spectacled Bear | circle head + capsule body | pale cream "glasses" shape (a figure-8 outline) around the eyes — the one universally recognized tell for this species | seed brown + cream eye-patch |
| Delfi the Pink River Dolphin | long capsule, horizontal | curved dorsal-fin triangle, upturned beak-snout capsule | soft pink (shared new accent) + sky blue water-shadow ellipse |
| Andi the Condor | large egg body | oversized wing shapes (half-circles like Duo, spread wide since condor = biggest flying bird), white rounded-rectangle neck ruff | ink/seed-brown body + cream ruff |
| Jagu the Jaguar | capsule body, low and long | simple rounded-square spot pattern (3-4 repeated shapes, not a full jaguar-print texture), small round ears | sun-yellow/orange body + seed-brown spots |

Recognizability comes from **one strong silhouette cue per animal** (turtle = shell, flamingo =
neck+one leg, spectacled bear = glasses, condor = huge wings, jaguar = spots) rather than from
detail — exactly the Duolingo "world characters" approach in Section 1.

### 3.3 Implementation shape

- One file per buddy in a new `src/components/buddies/` folder (or a single
  `src/components/BuddyArt.tsx` with a data-driven switch, if 12 separate files feel heavy) —
  each exports a component taking `mood` and `size` props and rendering `<Eyes>`/`<Mouth>` plus
  its own body path.
- Keep `Eyes` and `Mouth` as the two shared, exhaustively tested components — every future
  character (new buddies, the hero) reuses them, so mood logic lives in exactly one place.
- The hero avatar can use the *same* rig (body shape + eyes + mouth + hair/hat overlays for
  customization) so hero and buddies visually belong to the same world.
- No new dependency needed — plain inline SVG in `.tsx` files, consistent with "ask before
  installing libraries."

---

## 4. Options for the ~334 vocabulary pictures

Hand-drawing 334 unique SVGs is not realistic for a solo-plus-AI team. Three real options:

**(a) Keep Unicode emoji.** Free, zero effort, but renders differently per OS/browser (Apple
emoji on an iPad look nothing like Windows emoji), so "consistent look" is not achievable, and
it can't be recolored or restyled to match Papaya's palette.

**(b) Render emoji as SVGs from a CDN (Twemoji or OpenMoji).** Every device shows the exact
same artwork, it can be sized, and it's a two-line change in `SpeakButton`/`WordCard`-style
components: swap the emoji glyph for an `<img>` pointing at a CDN URL keyed by the Unicode
codepoint. No npm install needed — jsDelivr serves the raw SVGs directly:
  - Twemoji: `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/{codepoint}.svg`
  - OpenMoji: `https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/{codepoint}.svg` (also has
    a flatter "black" line-art variant if a more graphic look is wanted)
  Both are single flat-color, rounded, no-gradient SVGs already — Twemoji in particular reads as
  friendly and simple, close in spirit to Duolingo's own shape language.

**(c) Hand-code SVGs for the ~60 highest-frequency words** (family members, numbers, colors,
core foods, body parts — the words a kid sees dozens of times) **and use styled emoji (option
b) for the long tail.** This gets bespoke, on-brand art exactly where a kid will stare at it
most often, without a 334-illustration backlog.

**Recommendation: (c), built on top of (b).** Use Twemoji SVGs as the default renderer for all
334 words immediately (this alone is a big visual upgrade over raw emoji with zero new
illustration work), then hand-build ~40-60 custom SVGs (using the exact same shape/eye/mouth
kit as the buddies) for the words that recur across many lessons — mamá, papá, agua, casa,
perro, gato, colors, numbers 1-10, common foods. Swap those in word-by-word as they're made; the
rest keep using styled Twemoji indefinitely. This is incremental, ships the palette-matching
win on day one, and lets bespoke art grow over time without blocking anything.

**Licensing notes:**
- **Twemoji** — CC BY 4.0. Requires attribution (a line of credit somewhere reachable, e.g. an
  About/Settings screen or footer: "Emoji graphics by Twemoji, CC BY 4.0"). Very permissive
  otherwise — no share-alike requirement, safe to mix with proprietary app code.
- **OpenMoji** — CC BY-SA 4.0. Share-alike: if OpenMoji artwork is modified and redistributed,
  the modified files must carry the same license. Fine to use as-is (recolor via CSS filters
  rather than editing the SVG source to stay clear of the share-alike question), but slightly
  more legal surface area than Twemoji.
- **Noto Emoji** (Google) — Apache 2.0, the most permissive, but visually more literal/detailed
  than Twemoji, a bit less "toy-like" for this app's tone.
- **Recommendation:** Twemoji for the default look (best license terms + closest visual fit to
  a Duolingo-adjacent flat style), add the one attribution line, done.

---

## 5. Mood mechanics kids find funny, not guilty

Duo's "sad owl" moment works as pop culture precisely because it is **theatrical and
self-aware** — a cartoon owl being melodramatic about missing you is funny in the way a
cartoon character fainting is funny; it stops being funny and starts being a "dark pattern"
the moment it ties to a real, sharpening penalty (streak loss, escalating notification
pressure, guilt phrased as the *user's* fault). Duolingo's own reminder copy that got called
out — "You're scaring me... I'm afraid of people who skip lessons," diary-style "my apprentice
is ignoring me. AGAIN." — crossed the line specifically by making it personal ("you" did this
to "me") and repeated/escalating. CLAUDE.md already bans guilt-trip notifications and this
research confirms why: it's not the drama that's the problem, it's aiming the drama at the kid
as blame, and doing it at increasing volume.

**How to keep the fun and drop the guilt:**

1. **Make it about the buddy, not the kid.** The buddy is having an exaggerated, silly day —
   never says "you made me sad" or "you're ignoring me." It's slapstick happening TO the
   buddy, which a 5-10 year old finds funny (kids this age respond strongly to exaggeration and
   incongruity — a a sloth being "extra" dramatic about being lonely is funny; a message that
   assigns blame is not).
2. **1 missed day = a pouting buddy, shown only inside the app, once.** Not a push
   notification. When the kid opens the app, the buddy is on-screen with arms crossed, a single
   comically oversized pout, maybe one small floating rain-cloud doodle over its head, and a
   line like "Hmph. I practiced my Spanish ALL by myself yesterday." One line, dry, a little
   sassy (Lily-style), never sad-eyes-crying. No penalty is attached — it resolves the instant
   the kid taps the next lesson (buddy immediately brightens: "Okay okay, I forgive you.
   ¡Vamos!").
3. **3+ missed days = a "dramatic flop."** The buddy is shown flopped flat on its back/belly
   (a single reused "flop" pose asset, works for any buddy shape), eyes as flat closed lines, a
   single exaggerated prop (a tiny fan, a melted-ice-cube emoji, a "SOS" sign) — pure slapstick,
   like a cartoon character fainting from heat, not distress. Line stays playful and
   self-deprecating, e.g. "I have been lying here since Tuesday. Save me with Spanish!" Still no
   real penalty — streak freeze already covers the mechanical side per Section 9's economy
   spec; this is purely a screen the kid smiles at, then taps past.
4. **Never escalate, never repeat the same beat with more intensity, never phrase it as the
   kid's fault or use "you made me..."** Cap it at exactly these two beats (pout at 1 day, flop
   at 3+ days) and hold there — no growing sadder every day after that. Comedy needs a stable
   bit, not a ratchet.
5. **Age-appropriate humor patterns that land for 5-10 year-olds:** exaggeration and slapstick
   (Endless Alphabet's whole engine), silly incongruity (an animal doing a very human, mundane
   thing dramatically — "watching paint dry," "learning to knit" — while waiting), a
   catchphrase delivered deadpan, physical comedy over verbal wit (younger end of the range
   won't get sarcasm; keep any snark simple and paired with a visual gag). Avoid: any line that
   starts with "you," any reference to letting the buddy down, any comparison to other kids/
   streaks, any visual of the buddy literally crying (that one specific image is what reads as
   guilt-inducing rather than funny, per the Duolingo backlash research).

---

## 6. Papaya visual language — proposal

**Palette (unchanged, now formalized as the full character/UI palette):** papaya orange
`#FF8A3D`, leaf green `#3DAA47`, sky blue `#4DA8DA`, sun yellow `#FFC93C`, coral `#FF6B6B`,
cream `#FFF6E5`, seed brown `#3B2A1A`, ink `#2D2A26`. Add exactly **one** new accent for the
pinker animals (flamingo, river dolphin) — a soft rose, e.g. `#FFA6C9` — so the shared palette
covers 9 tokens total, still well within the "6-8 hues, reused everywhere" rule other kid apps
follow.

**Stroke rules:** no outline strokes on character bodies (flat shapes only, Duolingo-style);
facial details (eyes, mouth, feet, small accents) are drawn as flat shapes in seed-brown/ink,
never as stroked lines. If a stroke is ever needed for legibility (e.g. a light-on-light
overlap), it's always exactly 2px, ink-colored, round-cap, and used consistently everywhere it
appears — never mixed weights.

**Corner radius:** everything rounded, nothing pointed — cards, buttons, buddy bodies, badges.
Standardize on a small radius scale (e.g. 12px small elements, 20px cards, "fully round" pill
shape for buttons/badges) rather than ad hoc values per component.

**Shadow rules:** two shadow types only, used consistently: (1) the chunky UI "press" shadow —
solid, non-blurred, offset straight down, in a darker shade of the element's own color (already
`btn-chunky`); (2) a character's ground shadow — a single flat, semi-transparent dark ellipse
under the feet, no blur gradient. No glows, no soft drop-shadows anywhere else.

**Icon style:** flat, single or dual-tone, rounded corners, no gradients — matching the
character rig, so top-bar icons (streak flame, papaya coin, ticket) look like they were drawn
by the same hand as the buddies rather than borrowed from a generic icon font.

**Typography:** keep Fredoka (display/headings/buttons) + Nunito (body) — validated by
research as functionally equivalent in spirit to Duolingo's Feather + DIN Next Rounded pairing.
No change needed.

**5 concrete low-effort UI upgrades:**

1. **Unit banners with a patterned background** — a simple repeating flat-shape motif (dots,
   leaf shapes, or small emoji-scale icons of that unit's vocabulary) behind the unit title on
   the Path screen, using 1-2 palette colors at low opacity. Pure CSS/SVG background, no new
   art pipeline.
2. **Hero standing on a small platform/pedestal** wherever the hero avatar appears large (Home
   screen, Hero customization) — a simple flat rounded-capsule "stage" shape with a soft ground
   shadow, instantly reads as more "designed" than a floating avatar.
3. **Cards get a visible 2px border in a darker shade of their own fill**, not just a drop
   shadow — this is the single fastest fix for the "looks like default Tailwind" problem and
   matches the flat, bordered card style common to Khan Academy Kids and Toca Boca.
4. **Top bar badges (streak, papayas, tickets) get a small flat icon in an outlined pill/badge
   shape** instead of a raw emoji glyph — reuses the same icon style as #4 in Section on icon
   style, and removes the last emoji from the app's most-viewed screen real estate.
5. **Buddy mood swaps app-wide**, not just on the pouting/flop screens: once `Eyes`/`Mouth`
   components exist, use them everywhere a buddy already appears (lesson intro, lesson
   complete, home screen) so the *same* buddy visibly reacts to context (excited on a perfect
   lesson, sleepy if opened very early/late, happy by default) — cheap to add once the rig
   exists, and it's the single upgrade with the highest "feels alive" payoff for the DNA
   principle of immediate, visible feedback.

---

## Build order

1. Build the shared `Eyes` and `Mouth` SVG components with the 5 required moods (happy,
   excited, sad, mad, sleepy) as pure, prop-driven, stroke-free flat shapes.
2. Build 2-3 shared body primitives (`circle`, `egg`, `capsule`) as a `BuddyBase` component
   taking body shape, 2 colors, and children (signature shapes) as props.
3. Build the 12 buddy components from the Section 3.2 spec, each just `BuddyBase` + its 1-2
   signature shapes + `Eyes`/`Mouth`, replacing the `emoji` field usage in
   `src/data/characters.ts` and everywhere `character.emoji` is rendered.
4. Rebuild the hero avatar on the same rig (body + eyes + mouth + swappable hair/hat/color)
   so hero and buddies match visually.
5. Swap all vocabulary card art to Twemoji SVGs served from jsDelivr (`cdn.jsdelivr.net/gh/
   twitter/twemoji/...`), keyed by each word's existing emoji codepoint — no new data needed,
   just a rendering change in the word-card component. Add the one required attribution line
   in Settings/About.
6. Hand-build custom SVGs (same rig/eye/mouth kit where relevant, or simple flat-shape icons
   for non-character words) for the ~40-60 highest-frequency vocabulary words, swapping them in
   over time; everything else keeps using styled Twemoji indefinitely.
7. Add the "pouting buddy" screen (1+ missed day) and "dramatic flop" screen (3+ missed days)
   as two new illustration states using the existing buddy rig plus one new pose/prop each,
   shown once on next app open, never as a push notification, with copy reviewed against the
   Section 5 "never say you" rule.
8. Roll the new flat-shape/border/shadow rules from Section 6 into `Button`, a card wrapper
   component, and `TopBar` badges so the whole app (not just characters) reads as one visual
   system.

---

## Sources

- [The typeface used by Duolingo, "Feather Bold"](https://note.com/shijimiota/n/nf7cb10c00dcf?hl=en)
- [Duolingo custom font 'Feather' is inspired by their owl mascot — Monotype](https://www.monotype.com/resources/duolingo-custom-font-inspired-their-owl-mascot-duo)
- [Duolingo Design System — Colors, Typography & Tokens](https://oh-my-design.kr/design-systems/duolingo)
- [About Duolingo's grumpy 3-eyed owl — UX Planet](https://uxplanet.org/about-duolingos-grumpy-3-eyed-owl-1e36c455e7ab)
- [The evolution of the Duolingo owl — Apple Developer](https://developer.apple.com/news/?id=e2e1faj4)
- [Duolingo Illustration Style Guide (shape language) — Scribd](https://www.scribd.com/document/583545694/Duolingo-Illustration-Guidelines)
- [Duolingo Colors - Hex, RGB and CMYK Color Codes](https://brandpalettes.com/duolingo-colors/)
- [Duolingo Branding and Brand Guidelines — Canny Creative](https://www.canny-creative.com/brand-breakdown/brand/duolingo/)
- [Sago Mini — Wikipedia](https://en.wikipedia.org/wiki/Sago_Mini)
- [Toca Boca — Wikipedia](https://en.wikipedia.org/wiki/Toca_Boca)
- [twemoji CDN by jsDelivr](https://www.jsdelivr.com/package/npm/twemoji)
- [openmoji CDN by jsDelivr](https://www.jsdelivr.com/package/npm/openmoji)
- [Emoji licensing guide — luizbizzio/emojis on GitHub](https://github.com/luizbizzio/emojis)
- [The Duolingo Owl, Dark Patterns, and Digital Guilt](https://opinionsandconditions.substack.com/p/duolingo-owl-dark-patterns-digital-guilt)
- [I reverse-engineered Duolingo's guilt algorithm — Medium](https://medium.com/@milessightings/i-reverse-engineered-duolingos-guilt-algorithm-6ddf598d2a72)
- [Why Duolingo Is Scary: The Psychology Behind That Green Owl](https://duoowl.com/why-duolingo-is-scary/)
- [UI/UX Design for Children: Age-Appropriate App Guidelines](https://www.aufaitux.com/blog/ui-ux-designing-for-children/)
- [Designing for Kids: Creating an Ethical Framework for Digital Play — Medium](https://matthewlarn.medium.com/designing-for-kids-creating-an-ethical-framework-for-digital-play-2fb83088c19b)
- ["Clicky" 3D Buttons With CSS — Gregory Schier](https://schier.co/blog/clicky-3d-buttons-with-css)
- [Building a Magical 3D Button with HTML and CSS — Josh W. Comeau](https://www.joshwcomeau.com/animation/3d-button/)
- [CSS { In Real Life } — Creating Generative SVG Characters](https://css-irl.info/creating-generative-svg-characters/)
