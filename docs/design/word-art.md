# Word art: the pictures in lessons

Every word a kid learns gets a hand-drawn picture. No emoji. The pictures are flat SVG
built from the same parts as the buddies, so the whole app looks like one family.

Code lives in `src/components/wordart/`. One file per unit (`u1.tsx` to `u10.tsx`), each
exporting a map from word id to a small React component. `index.tsx` gathers them into
`<WordArt wordId emoji size />`, which falls back to a flat Twemoji picture if a word has no
drawing yet. `examples.tsx` holds four reference drawings. Copy their style exactly.

## The rules

1. **Box.** Draw in a 100 x 100 viewBox. Keep art inside x 8..92 and y 8..92 so the rounded
   tile behind it always shows a margin. One `<Tile/>` per picture, first.
2. **Flat.** Solid fills only. No gradients, no filters, no drop shadows. A `<Ground/>` ellipse
   under standing people or heavy objects is the only shadow.
3. **Colors.** Only the constants in `primitives.tsx`. Pick a tile color that contrasts with the
   subject (a red apple on a cream tile, a white cloud on a sky tile).
4. **Strokes.** None on people and animals. On objects, only when a line is the thing (a pencil
   edge, a wire, a clock hand): 3px, INK, round caps.
5. **Big and simple.** The subject fills 60 to 80 percent of the box. At most 12 shapes per
   picture. If you need more, simplify. It must read at 28px in a match-pairs tile.
6. **People are `<Kid/>`.** Every person is the same figure. Difference comes from hair,
   colors, arms, pose, glasses, and mood. Never draw a person from scratch.
7. **Faces come from the rig.** `<Kid mood="sad"/>` uses the buddy eyes and mouth. Feelings are
   a big, close-up Kid (scale 1.5, baseY 118) on a colored tile: happy = sun, sad = sky,
   angry = coral, tired = purple, scared = gray, surprised = papaya, calm = leaf.
8. **Said out loud = `<Bubble/>`.** Greetings, thanks, questions, and phrases show a Kid plus a
   bubble. Inside the bubble: a tiny glyph, not a sentence. Use `<BigText/>` for at most one
   short word ("¡Hola!", "¿?", "+", "1, 2, 3"), or a heart, a star, a sun, a moon.
9. **Commands = a Kid doing it.** "wash your hands" is a Kid at a sink with sparkles.
   "don't touch" is a Kid reaching for a thing with `<NoSign/>` over it.
10. **Verbs = a Kid doing it, mid-action.** Use `pose="run"`, `pose="jump"`, `arms="up"`, and
    `<Zoom/>` motion lines.
11. **Colors (the words red, blue...)** are a big round paint blob of that color on a cream tile,
    with a small white shine dot. "sky blue" and "pink" and "gold" use SKY, ROSE, SUN with a
    sparkle for gold and GRAY for silver.
12. **Numbers** are the numeral in `<BigText size={44}/>` on a tile, plus that many small dots
    in a row underneath (up to 10; for 11 to 20 show two rows of dots, max 20). "first, second"
    are a little podium with the numeral.
13. **Animals** are drawn like the buddies: big round head, rig eyes, one silhouette cue.
    Reuse `<Eyes/>` and `<Mouth/>` from `src/components/buddies/rig.tsx` through the Kid, or
    import them directly for animals.
14. **Sizes.** Pictures show at 76px (question prompt), 40px (answer choice), 28px (match tile),
    and 34px (word list). Check yours at 28px before calling it done.

## Recipes by category

| Category | Recipe |
|---|---|
| Family member | `<Kid/>` with a signature: mom long hair + earrings, dad short hair + beard dot, grandma gray bun + glasses, grandpa bald + gray mustache + glasses, baby tiny scale 0.7 with a tuft and a pacifier circle, brother/sister/cousin/friend kids with different hair and shirt colors, family = three Kids at scale 0.6 together. |
| Body part | A close-up Kid head or body with a `<Highlight/>` ring on the part. Hands and feet: draw the part alone, big, in SKIN. |
| Routine and command | Kid mid-action with one prop (toothbrush, comb, bed, pillow, pajamas). |
| Feeling | Close-up Kid, rig mood, colored tile (rule 7). |
| Greeting or phrase | Kid + Bubble with a glyph (rule 8). Night phrases use a moon; morning uses a sun. |
| Color | Paint blob (rule 11). |
| Shape | The shape itself, big, in a bright color, on a cream tile. |
| Size and speed words | Two things compared (a big and a small ball; a fast Kid with Zoom lines vs a slow snail). |
| Number | Rule 12. |
| Food | The food, big, flat, with one highlight dot. Drinks are a glass or a mug with a colored liquid. Colombian foods: arepa = a round pale yellow disc with darker speckles; empanada = a golden half-moon with a crimped edge; buñuelo = a golden ball; sancocho = a bowl with a leaf and a corn piece; aguapanela = a mug with a lime slice. |
| Animal | Rule 13. |
| Clothes | The garment alone, big, in a bright color. |
| Weather | Sun, cloud, rain drops, snowflake dots, wind lines. Sentences ("it's hot out") add a small Kid reacting. |
| Room or object | The object alone, big. Rooms: a simple doorway view with one signature object (kitchen = pot on stove, bathroom = tub, bedroom = bed). |
| School | The object alone, big. Teacher = Kid with glasses and a pointer. Class = three tiny Kids at desks. Recess = Kid jumping with a ball. |
| Question word | A Bubble with a big `?` and one glyph: what = a box, who = a Kid silhouette, where = a map pin, when = a clock, why = a lightbulb, how = a gear. |
| Yes and no | A green check and a red X side by side. |

## Checklist before you finish a unit

- Every word id in the unit has a drawing and the file exports `U#_ART`.
- `npx tsc -p tsconfig.app.json --noEmit` shows no errors for your file.
- You rendered a contact sheet of every picture at 76px and at 28px and looked at it.
- No emoji characters anywhere in your file.
