# Papaya v2 plan: ABC depth, real voices, story books, arcade look

Written 2026-09-26 after three research passes: `docs/research/duolingo-abc.md`,
`docs/research/voices.md`, and `docs/research/retro-arcade-direction.md`. This page is the
short version with decisions. Andre decides the two open calls at the bottom.

## What Andre asked for

1. Duolingo ABC's depth for young kids (graphics, sounds, stories), but for Spanish.
2. A retro arcade look "kind of like Metal Slug" so Papaya is not a Duolingo knock-off.
3. Lots of clear, kid-friendly voices, because many kids cannot read yet.
4. Bilingual story books, Spanish and English both shown and read, with no lesson cap.

## What the research says, in one paragraph each

**Duolingo ABC.** Ages 3 to 8, five-minute lessons, every word spoken, sticker and character
rewards, and decodable storybooks with word-by-word highlighting and a comprehension question.
Reviewers praise the polish and the total absence of ads. The gaps: English only (a Hispanic
parent in Andre's exact situation asked for Spanish in a review), a rigid linear path with no
reordering, and kids age out. Papaya already has the economy, the buddies, and spaced repetition;
what it lacks is stories and recorded voices.

**Voices.** Duolingo ABC uses professional recordings, not the phone's voice. For Papaya the best
answer is to generate every line once with a cloud voice and ship the files with the app. Azure is
the only service with real Colombian Spanish voices (es-CO Gonzalo and Salome) and it has a child
English voice (Ana). Cost for all ~700 clips: under one dollar. The dream version is Andre's own
voice, cloned with his consent through ElevenLabs, so the kids hear Papá.

**Arcade look.** Metal Slug's magic is exaggerated animation, a tight palette, and a minimal HUD,
not raw pixel count. Redrawing our 13 buddies and 334 word pictures as pixel art would take 45
to 70 agent-days and throw away a system that works. An "arcade shell" (pixel HUD, pixel fonts
for labels, chiptune sounds, stage banners, S/A/B rank results, jungle backgrounds, pixel borders)
around the existing art takes 8 to 14 agent-days and is what kids notice most anyway.

## Decisions taken today (already built on this branch)

- **Recorded voices, provider-independent.** `src/audio/clips.ts` plays a recorded MP3 for any
  line that has one and falls back to the phone voice otherwise. `scripts/generate-audio.mts`
  makes all the files with Azure. `docs/audio-setup.md` is the 15-minute setup.
- **Story books.** `src/data/stories.ts` holds eight bilingual books written only with words the
  kid has learned by that unit. `StoriesScreen` is the bookshelf, `StoryScreen` is the reader:
  big picture from the word art, Spanish line as tappable words with read-along highlighting,
  English beneath with its own speaker, a four-button comprehension question at the end that
  pays into the economy like a short lesson. Books unlock as units are started, and there is no
  cap: more books can be added any time.
- **Arcade shell mockups.** `docs/mockups/arcade-home.png`, `arcade-lesson.png`,
  `arcade-results.png`, and `before-after.png` show the direction with the real buddy and word
  art inside the new chrome, so the call can be made on a picture, not a description.

## Open call 1: the arcade look

Options, in order of recommendation:

- **B. Arcade shell (recommended).** Pixel HUD strip, blocky XP bar, Pixelify Sans for HUD
  labels, Press Start 2P only for one-word banners like STAGE CLEAR, 3px pixel borders on cards
  and buttons, a low-contrast pixel jungle band on Home and Path, chiptune sound effects and
  music, stage banners before lessons, rank letters on results. Characters and word art stay as
  they are. About two weeks of agent work. Reversible.
- **C. Shell first, pixel characters later.** Ship B, playtest with the kids, then commission a
  pixel artist for the 13 buddies only (research estimate $650 to $2,000) if the look lands.
- **A. Full pixel rebrand.** Not recommended now. It discards the art built this week for a
  result that would read worse at small sizes.

If Andre picks B, the build order is in the last section of
`docs/research/retro-arcade-direction.md`.

## Open call 2: whose voice

- **Azure Gonzalo (Colombian male) + Ana (child English).** Ready today. Run the script, commit
  the files, done. Under a dollar.
- **Azure Salome (Colombian female) for Spanish.** Same script, one environment variable.
- **Andre's voice via ElevenLabs.** Record 10 to 15 minutes of clean audio, clone with consent,
  point the script at the ElevenLabs API. Warmest possible result and a real family feature.
  Paid tier required for shipping the audio.

Any of these can be swapped later; the app only looks at the manifest.

## Next after the calls

1. Generate the voice files and ship them (one afternoon).
2. Build the arcade shell in five swarm passes: tokens and fonts, Button/Card/TopBar, stage
   banner and rank results, chiptune sfx and music, backgrounds.
3. Write eight more story books (units 8 to 10, and seasonal ones like Navidad and cumpleaños).
4. Playtest with the kids and tune the economy.
