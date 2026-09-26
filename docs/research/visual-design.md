# Visual Design Research: Replacing Emoji with a Real Character System

**Question:** Papaya uses plain Unicode emoji for the 12 buddies, the hero avatar, and ~334
vocabulary card pictures. Andre wants unique designs, loves Duolingo's simplicity, and loves
the silliness of Duo the owl getting dramatic when a kid skips lessons. This is the homework
before touching code: how Duolingo and other kid apps build simple, consistent characters, how
to build our own 12-animal set in code with no designer, what to do about 334 vocabulary
pictures, and how to make a buddy's "sad" moment funny instead of guilty.

---

## 1. Duolingo's design system

**Shape language.** Duolingo's illustration guide uses three shapes only: rounded rectangle,
circle, rounded triangle — always rounded corners, never a sharp point. Rule of thumb: fewest
shapes possible, a character's head and body are each just 1–2 basic shapes. Depth is allowed
but stays on one flat plane, no perspective. This is the LEGO-brick approach we want: a small
kit of parts reused everywhere so 12 animals feel like one family, not 12 unrelated drawings.

**No heavy outlines.** Characters are flat, solid-color shapes, not line drawings colored in.
Where a stroke exists (mostly UI icons, not characters) it's thick, rounded-cap, one consistent
weight. Outline weight instantly ages an illustration style up or down; a uniform heavy stroke
reads as "toy," which is right for ages 5–10.

**Limited, named palette.** Core colors: Feather Green `#58CC02` (the "go" color, streak, owl),
Macaw blue `#1CB0F6`, Cardinal red `#FF4B4B`, Bee yellow `#FFC800`, plus darker shade-siblings
(Tree `#58A700`, Whale `#1899D6`) used for shadows/pressed states rather than new hues, and a
neutral gray (Eel `#4B4B4B`) for text. Four primaries, one dark variant each, one neutral — the
whole system. Colors are named after animals, a playful detail worth stealing.

**Chunky 3D buttons.** The pressable bottom-shadow "gumdrop" button is a solid, non-blurred
offset shadow in a darker shade of the button's own color (e.g. `box-shadow: 0 4px 0 #58A700`
under `#58CC02`); on press the button translates down by that offset while the shadow shrinks
to zero. Papaya's `btn-chunky` already does this — confirmed as the right pattern, worth
extending to cards and badges.

**Typography.** Duolingo commissioned **Feather**, a bespoke display face (Krista Radoeva,
Fontsmith, 2019 rebrand) shaped like the owl's wing, used for headlines and big numbers. Body
text uses **DIN Next Rounded**, a licensed rounded grotesk, for lighter, legible small text. We
can't license either, but the lesson transfers: pair one rounded, characterful display face
with a plain, legible rounded body face. Papaya's Fredoka + Nunito already matches this pairing
in spirit — no change needed.

**Duo's moods.** For years Duo had only "happy" and "crying." The 2019 redesign rebuilt him to
carry a full range (bewildered, smug, furious, sleepy, sunglasses-cool, heartbroken) while
staying simple enough to animate: wings are half-circles tucked behind the body so he reads
consistently from any angle, and mood lives almost entirely in **eyebrows, eye shape, and
mouth** — the body barely changes. That's the technical trick to copy: one body silhouette, a
small swappable face-parts library, mood is 90% eyebrow + mouth. Duo's famous "sad" streak
moment works because it's exaggerated and self-aware, not because it threatens anything
concrete (see Section 5).

**World characters.** Beyond Duo, a small cast (Lily, Zari, Falstaff, Oscar, Eddy, Junior) each
has one dominant trait and a distinct notification "voice" (Lily deadpan/sassy, Oscar dramatic
diary-style). All follow Duo's shape/color rules so the family reads as one system while each
is distinguishable by silhouette alone (Falstaff = squashed oval + jowls; Lily = rectangle body
+ sharp hair shape). Direct model for our 12 buddies: same rig, different silhouette + 2-3
signature shapes per animal.

---

## 2. Other kid apps with great simple illustration

- **Khan Academy Kids** — big heads, tiny simple bodies, flat solid colors, thick even
  outlines, huge dot-and-highlight eyes, no gradients. "Chibi" proportions (head 40-60% of
  height) read as non-threatening.
- **Lingokids** — oversized heads, rounded everything, warm primary-plus-pastel palette
  (6-7 hues max on screen), soft blob-body monsters with 2-3 accent shapes (spots, a horn).
- **Toca Boca / Sago Mini** — the cleanest reference for shape economy: bodies built almost
  entirely from circles and rounded rectangles, a nose can be one dot, eyes are simple ovals
  with no drawn eyelashes. Sago Mini (Robin, Jinja, Harvey, Jack) uses the same economy with a
  softer, more pastel, rounder look for an even younger audience.
- **Endless Alphabet** — a cast of googly-eyed "monsters," essentially one blob body reused
  with different color/texture and 1-2 signature features (horns, one tooth). The appeal is
  exaggerated, silly, squash-and-stretch reactions — the best reference for "silly without
  being mean" (Section 5).
- **PBS Kids** — the most conservative: flat color, thick uniform outline (4-8px), rounded
  corners, high saturation, strict no-gradient / no-body-drop-shadow rule (only a flat ellipse
  shadow at the feet).

**Shared rules, adopted as our own constraints:**
1. Big head, small/simple body reads as cute and non-scary to a 5-year-old.
2. A palette capped around 6-8 hues, reused by every character — no private colors.
3. Eyes are the emotional engine (oval + pupil + one highlight dot); eyebrows carry mood.
4. Flat color only — no gradients, no body drop-shadows, one flat ground-shadow ellipse allowed.
5. One consistent stroke width app-wide, or none at all — mixed stroke weights is the fastest
   way a homemade character set looks inconsistent.

---

## 3. Building a consistent SVG character set in code

React + inline SVG (or one small `.tsx` file per buddy) works well here *if* every character is
assembled from the same small kit of parts.

**The shared rig:**
```
BuddyBase (shared component)
 ├── ground shadow (flat ellipse, ~30% black, no blur)
 ├── body shape (1 of 3 primitives, per-animal color)
 ├── optional belly/chest patch (lighter ellipse)
 ├── 1-2 signature shapes (the "silhouette tell")
 ├── <Eyes mood="happy|excited|sad|mad|sleepy" />
 ├── <Mouth mood=... />
 └── limbs/feet (2 rounded-rect stubs; birds reuse Duo's half-circle wing trick)
```

- **Base body:** one blob — circle, egg (stretched ellipse), or capsule (rounded rectangle,
  large radius). One `bodyShape` prop per animal, not a bespoke path each time.
- **2-3 shape primitives per animal** on top: e.g. toucan = egg body + huge rounded-triangle
  beak + small round head; capybara = wide low capsule + rounded-rect snout + two oval ears.
  Each signature shape should describe in one sentence.
- **Shared `<Eyes>` component**, parameterized by mood, reused by every animal and the hero:
  two white ovals + two pupil circles + two highlight dots; eyebrows are short arcs positioned
  above, the main mood lever (angled down-in = mad, up-out = excited, drooping = sleepy).
- **Shared `<Mouth>` set, one path per mood:** happy = upward arc; excited = wider arc + tiny
  tongue/teeth marks; sad = the arc flipped into a frown, optional teardrop; mad = a short flat
  or zig-zag line with sharply angled eyebrows; sleepy = a small flat "o" or closed line, paired
  with thin drooping-lid eyes for that mood only.
- **Palette: 6-8 shared hues** reusing Papaya's tokens — papaya orange, leaf green, sky blue,
  sun yellow, coral, seed brown (outlines/eyes/accents), cream (bellies/highlights), plus one
  extra warm neutral for the pinker animals. Every animal gets 1 dominant + 1 accent from this
  set, never a private color.
- **Strokes:** recommend none — flat shapes, facial details drawn as flat darker-shade shapes
  rather than stroked lines. If a stroke is ever needed for legibility, fix it at 2px, ink-
  colored, round-cap, everywhere, no exceptions. This stays crisp even at a tiny top-bar size.

**Spec for the 12 buddies** (names/ids match `src/data/characters.ts`), each = body primitive +
1-2 signature shapes + shared eyes/mouth + 2 colors from the shared palette:

| Buddy | Body | Signature shape(s) | Colors |
|---|---|---|---|
| Tico the Toucan | egg | huge rounded-triangle beak (orange base/yellow tip), small round head | orange beak + seed-brown body |
| Lola the Sloth | squashed circle | long curved arms wrapping the body, sleepy half-closed eyes | leaf green tint + cream face |
| Capi the Capybara | wide low capsule | rounded-rect snout, 2 small oval ears | seed brown + cream belly |
| Pinki the Flamingo | tall egg on one thin leg | thick "S"-curve neck shape, small round head | coral/rose accent |
| Rana the Frog | flattened circle | 2 huge eyes bulging on top of the head, tiny leg stubs | sun yellow + green spots |
| Manu the Monkey | circle head + capsule body | round ears, curved-line tail | seed brown + cream face |
| Coco the Hummingbird | small circle | thin rounded-triangle beak, slim angled wing ovals | sky blue + yellow chest |
| Tortu the Sea Turtle | rounded-rect shell + small head | 2-3 line strokes suggesting shell pattern, flipper capsules | leaf green shell + cream belly |
| Osito the Spectacled Bear | circle head + capsule body | cream figure-8 "glasses" shape around the eyes | seed brown + cream patch |
| Delfi the Pink River Dolphin | horizontal capsule | curved dorsal fin, upturned snout capsule | soft pink + sky-blue water shadow |
| Andi the Condor | large egg | oversized half-circle wings spread wide, ruff shape at neck | seed brown + cream ruff |
| Jagu the Jaguar | low long capsule | 3-4 repeated rounded-square spots, small round ears | orange body + brown spots |

Recognizability comes from one strong silhouette cue per animal (shell, neck+leg, glasses,
wingspan, spots) rather than detail — the Duolingo world-character approach.

**Implementation:** one file per buddy under `src/components/buddies/` (or one data-driven
`BuddyArt.tsx`), each taking `mood`/`size` props and rendering `<Eyes>`/`<Mouth>` plus its own
body path. `Eyes` and `Mouth` stay the two shared, well-tested components so mood logic lives
in one place. The hero avatar should use the same rig (body + eyes + mouth + hair/hat overlays)
so hero and buddies visibly belong to one world. No new dependency — plain inline SVG.

---

## 4. Options for the ~334 vocabulary pictures

Hand-drawing 334 unique SVGs isn't realistic for a solo-plus-AI team.

- **(a) Keep Unicode emoji.** Free, zero effort, but renders differently per OS (Apple vs.
  Windows), so a consistent look isn't achievable and it can't be recolored.
- **(b) Render emoji as SVGs from a CDN (Twemoji/OpenMoji).** Every device shows identical
  artwork; it's a small change swapping the emoji glyph for an `<img>` keyed by Unicode
  codepoint, no npm install:
  - Twemoji: `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/{codepoint}.svg`
  - OpenMoji: `https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/{codepoint}.svg`
  Both are already flat, rounded, no-gradient SVGs; Twemoji reads closest to Duolingo's shape
  language.
- **(c) Hand-code SVGs for the ~60 highest-frequency words** (family, numbers, colors, core
  foods, body parts) and use styled emoji (b) for the long tail — bespoke art exactly where a
  kid stares most, no 334-illustration backlog.

**Recommendation: (c) on top of (b).** Ship Twemoji SVGs for all 334 words immediately (a real
upgrade over raw emoji, zero new illustration work), then hand-build ~40-60 custom SVGs (same
shape/eye/mouth kit as the buddies) for the most-repeated words, swapped in over time; the rest
keep using styled Twemoji indefinitely.

**Licensing:**
- **Twemoji** — CC BY 4.0. Needs one attribution line somewhere reachable (About/Settings);
  otherwise very permissive, no share-alike, safe with proprietary app code.
- **OpenMoji** — CC BY-SA 4.0; modified, redistributed artwork must carry the same license
  (fine to use as-is; recolor via CSS filters rather than editing source SVGs).
- **Noto Emoji** (Google) — Apache 2.0, most permissive, but more literal/detailed, less
  toy-like for this app's tone.
- **Recommendation:** Twemoji as default (best license terms + closest visual fit), one
  attribution line, done.

---

## 5. Mood mechanics kids find funny, not guilty

Duo's "sad owl" beat works because it's **theatrical and self-aware** — a melodramatic cartoon
owl is funny the way a fainting cartoon character is funny. It stops being funny and becomes a
"dark pattern" the moment it's tied to a real penalty and phrased as the user's fault. The
reminder copy that drew backlash — "I'm afraid of people who skip lessons," "my apprentice is
ignoring me. AGAIN." — crossed the line by making it personal ("you" did this to "me") and
repeated/escalating. CLAUDE.md already bans guilt-trip notifications; this confirms why: the
drama isn't the problem, aiming it at the kid as blame and escalating it is.

**How to keep the fun and drop the guilt:**

1. **It's about the buddy, never the kid.** The buddy is having a silly, exaggerated day — it
   never says "you made me sad." Slapstick happening *to* the buddy lands with 5-10 year-olds
   (who respond strongly to exaggeration/incongruity); a message that assigns blame doesn't.
2. **1 missed day = a pouting buddy, in-app only, shown once.** Not a push notification. On
   next open: arms crossed, one comically oversized pout, maybe a tiny rain-cloud doodle, a dry
   one-liner ("Hmph. I practiced my Spanish ALL by myself yesterday.") — never sad-crying eyes.
   No penalty attached; resolves the instant the kid taps the next lesson ("Okay okay, I
   forgive you. ¡Vamos!").
3. **3+ missed days = a "dramatic flop."** Buddy flat on its back, flat closed-line eyes, one
   silly prop (a tiny fan, a melted ice cube, an "SOS" sign) — pure slapstick like fainting from
   heat, not distress. Playful, self-deprecating copy ("I've been lying here since Tuesday.
   Save me with Spanish!"). Streak freeze already covers the mechanical side; this is a smile,
   then tap-past.
4. **Never escalate past these two beats, never phrase it as the kid's fault.** Cap it at pout
   (1 day) and flop (3+ days) and hold there — comedy needs a stable bit, not a ratchet.
5. **Age-appropriate humor:** exaggeration and slapstick (Endless Alphabet's whole engine),
   silly incongruity (an animal doing a mundane human thing dramatically), a deadpan
   catchphrase, physical comedy over verbal wit (younger kids won't get sarcasm). Avoid: any
   line starting with "you," references to letting the buddy down, comparisons to other kids or
   streaks, and any image of the buddy literally crying — that specific image is what reads as
   guilt rather than funny.

---

## 6. Papaya visual language — proposal

**Palette:** keep papaya orange `#FF8A3D`, leaf green `#3DAA47`, sky blue `#4DA8DA`, sun yellow
`#FFC93C`, coral `#FF6B6B`, cream `#FFF6E5`, seed brown `#3B2A1A`, ink `#2D2A26`. Add one new
accent for the pinker animals (flamingo, river dolphin) — soft rose, e.g. `#FFA6C9` — nine
tokens total, still within the "6-8 hues reused everywhere" rule.

**Stroke rules:** no outlines on character bodies — flat shapes only; facial details are flat
darker shapes, not stroked lines. If a stroke is ever needed, fix it at 2px, ink, round-cap,
used the same way everywhere.

**Corner radius:** everything rounded, nothing pointed. Standardize a small scale (e.g. 12px
small elements, 20px cards, fully round for buttons/badges) instead of ad hoc values.

**Shadow rules:** two types only — the chunky UI "press" shadow (solid, non-blurred, offset
down, darker shade of the element's own color, already `btn-chunky`), and a character ground
shadow (flat semi-transparent ellipse at the feet, no blur). No glows or soft drop-shadows
elsewhere.

**Icon style:** flat, single/dual-tone, rounded, no gradients, matching the character rig — top
bar icons should look hand-drawn by the same system as the buddies, not borrowed from a generic
icon font.

**Typography:** keep Fredoka (display/headings/buttons) + Nunito (body) — already the
functional equivalent of Duolingo's Feather + DIN Next Rounded pairing.

**5 concrete low-effort UI upgrades:**
1. **Unit banners with a patterned background** — a repeating flat-shape motif (dots, leaves,
   small vocabulary icons) behind the unit title on the Path screen, 1-2 palette colors at low
   opacity, pure CSS/SVG, no new art pipeline.
2. **Hero standing on a small platform** wherever the hero avatar appears large — a flat
   rounded-capsule "stage" with a soft ground shadow, reads far more designed than a floating
   avatar.
3. **Cards get a visible 2px border in a darker shade of their own fill**, not just a drop
   shadow — the fastest fix for the "default Tailwind" look, matching Khan Academy Kids/Toca
   Boca's bordered flat-card style.
4. **Top bar badges (streak, papayas, tickets) get a small flat icon in an outlined pill**
   instead of a raw emoji glyph — same icon style as above, removes the last emoji from the
   app's most-viewed screen.
5. **Buddy mood swaps app-wide**, not just on pout/flop screens: once `Eyes`/`Mouth` exist, use
   them everywhere a buddy appears (lesson intro, lesson complete, home) so the same buddy
   visibly reacts to context — cheap once the rig exists, and the highest "feels alive" payoff
   for the DNA principle of immediate feedback.

---

## Build order

1. Build shared `Eyes` and `Mouth` SVG components with the 5 moods (happy, excited, sad, mad,
   sleepy) as prop-driven, stroke-free flat shapes.
2. Build 2-3 shared body primitives (`circle`, `egg`, `capsule`) as a `BuddyBase` component
   taking body shape, 2 colors, and signature-shape children as props.
3. Build the 12 buddy components from the Section 3 spec, replacing `character.emoji` usage in
   `src/data/characters.ts` and everywhere it's rendered.
4. Rebuild the hero avatar on the same rig (body + eyes + mouth + swappable hair/hat/color).
5. Swap vocabulary card art to Twemoji SVGs from jsDelivr, keyed by each word's existing emoji
   codepoint — a rendering change only, no new data. Add the required attribution line.
6. Hand-build custom SVGs for the ~40-60 highest-frequency vocabulary words, swapping them in
   over time; everything else keeps using styled Twemoji.
7. Add the "pouting buddy" (1+ missed day) and "dramatic flop" (3+ missed days) screens using
   the buddy rig plus one new pose/prop each, shown once on next open, never as a push
   notification, copy reviewed against the "never say you" rule.
8. Roll the flat-shape/border/shadow rules into `Button`, a card wrapper, and `TopBar` badges
   so the whole app reads as one visual system, not just the characters.

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
