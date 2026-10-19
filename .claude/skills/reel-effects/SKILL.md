---
name: reel-effects
description: Library of 17 ready-made Remotion video effects for talking-head Reels/Shorts in reel/src/effects (orbit, couch wall, UI world, frame break, digital zoom, phone mockup, checklist, headline wall, zoom-through cut, chart grow, pull-back reveal, green screen, paper cut, doodle boil, vertigo, cover story, glass type). Use it whenever the user asks for a new video, Reel, Short or ad from talking-head footage, asks to "add effects", or names any of these effects; pick the effects that fit the script's beats instead of building new ones from scratch.
---

# Reel effects library

`reel/src/effects/` holds 17 effects for vertical (1080x1920, 30 fps) talking-head videos, built on
Remotion 4.0.535. Each file exports `meta` (what it is, when to use it, when not to) and one component
whose props all have defaults. Read `reel/src/effects/shared.tsx` before using them; it is short.

They were made as ideas from a creator's "17 video effects Claude can create" reel, then designed and
verified frame by frame here. **Use them selectively: pick what suits the script, not all of them.**

Also read before editing any Remotion code: `.claude/skills/remotion-motion-graphics/SKILL.md` (craft
rules) and, if installed, `.claude/skills/remotion-best-practices/` (restore it with
`npx skills experimental_install` if the folder is missing; it is git-ignored).

## 1. Choosing effects for a script

Read the script (or transcript), mark its beats, then map beats to effects:

| Beat in the script | Reach for | Notes |
| --- | --- | --- |
| The hook, first 1-2 s | Glass type, Frame break, Cover story, Digital zoom | One only. Land the effect's peak on the hook word. |
| "We do X, Y and Z" (a list of names) | Orbit (3-8 one-word chips) | Names, not sentences. |
| Steps, requirements, "what you get", recap | Checklist (3-5 items) | Items tick in order: time them to the words. |
| A number, a result, growth | Chart grow; Green screen (results page with the number circled) | Only numbers the client can back up. |
| Volume, body of work, social proof | Couch wall | "30 posts a month", "everything we've published". |
| Problem framing, a trend, "everyone is talking about it" | Headline wall | Generic mastheads only. |
| How the product works, what it touches | UI world, Phone mockup | Phone mockup takes any `screen` content. |
| Reacting to a page, post or site | Green screen (`background` takes any page) | Speaker covers the bottom ~40%. |
| "This is what your customers see", ending on the product | Pull-back reveal | Needs the full-frame setup first; not in the first second. |
| Moving to a new section, "let me show you" | Zoom-through cut (clip A into clip B) | Chapter changes only. |
| A realisation, a dramatic turn | Vertigo; Digital zoom | Once per video at most. |
| Storytelling, personal, playful aside | Paper cut, Doodle boil, Cover story | Not for formal or sensitive lines. |

Rules for one video:
- 30 s video: 3-4 effects. 60 s: 5-7. Leave at least 4 s of plain talking head between effects.
- Never use the same effect twice in one video, and never two "big camera" effects back to back
  (vertigo, pull-back reveal, zoom-through cut, digital zoom).
- The voice leads: start the effect 2-5 frames before the key word so its peak lands on it.
- Every effect enters from, and exits back to, the speaker. Keep captions out of the area the effect
  uses (checklist/chart cards sit in the upper half; green screen and orbit use the middle).
- The catalogue below, `meta.bestFor` and `meta.avoid` in each file are the ground truth for fit.

## 2. Catalogue

`needs`: `cutout` = the speaker matte, `plate` = the clean background, `face` = the face track. All
effects take `talent` and `startAt` (seconds into the clip at the effect's first frame).

| # | Effect (component) | Length | Needs | What the viewer sees | Main extra props |
| --- | --- | --- | --- | --- | --- |
| 01 | Orbit (`Orbit`) | 3.0 s | cutout, face | Glass chips ride a tilted ring around the head: behind it on the far side, over the chest on the near side | `items`, `accent`, `roll`, `speed`, `dim` |
| 02 | Couch wall (`CouchWall`) | 3.5 s | cutout | The room is papered over with content tiles, row by row; the camera eases back, speaker in front with a shadow | `content`, `accent`, `pullBackScale` |
| 03 | UI world (`UiWorld`) | 3.5 s | cutout | Speaker inside a 3D space: grid floor, floating app panels at different depths, camera arcs | `content`, `accent`, `scale`, `arc` |
| 04 | Frame break (`FrameBreak`) | 3.0 s | cutout, plate, face | Shot shrinks into a tilted photo print; the head pops out over its top edge | `caption`, `tilt` |
| 05 | Digital zoom (`DigitalZoom`) | 3.0 s | face | Camera HUD: brackets lock on the face, the shot snaps in with a digital glitch, holds, eases out | `zoom`, `snapAt` |
| 06 | Phone mockup (`PhoneMockup`) | 3.0 s | - | A 3D phone tilts up and plays the clip as a Reel (UI, double-tap heart) over the blurred shot | `screen`, `ui`, `handle`, `caption`, `likes` |
| 07 | Checklist (`Checklist`) | 3.5 s | plate | Speaker eases down; a glass checklist drops in above; items land, then tick in turn | `title`, `eyebrow`, `items`, `accent` |
| 08 | Headline wall (`HeadlineWall`) | 4.0 s | cutout, plate | Newsprint headline cards slam onto the wall behind the speaker until it is covered | `headlines`, `dateline`, `accent` |
| 09 | Zoom-through cut (`ZoomThroughCut`) | 2.5 s | - | An "up next" card plays clip B; the camera dives into it until clip B fills the frame | `talentB`, `startAtB`, `kicker`, `title` |
| 10 | Chart grow (`ChartGrow`) | 3.0 s | plate | A glass chart tilts up above the speaker: bars grow, a trend line draws, a counter runs | `values`, `labels`, `change`, `title`, `accent` |
| 11 | Pull-back reveal (`PullBackReveal`) | 3.5 s | - | Full frame, then pulls back: the clip is a post in a feed on a desk monitor in a creator setup | `label`, `author` |
| 12 | Green screen (`GreenScreen`) | 3.0 s | cutout | Room keys out, speaker drops to the bottom, a page scrolls behind with the key number circled | `background`, `scroll`, `side`, `headline`, `stat` |
| 13 | Paper cut (`PaperCut`) | 3.0 s | cutout | 12 fps stop-motion collage: speaker as a white-edged sticker, torn paper, ransom-note title | `words`, `stepVideo` |
| 14 | Doodle boil (`DoodleBoil`) | 3.0 s | face | Marker doodles (circle, arrow + note, underline, sparkles) draw on and keep wobbling | `label`, `color`, `boilEvery` |
| 15 | Vertigo (`Vertigo`) | 3.0 s | cutout, plate, face | Dolly zoom: the speaker holds still while the room stretches away, softens and cools | `depth`, `release`, `tint` |
| 16 | Cover story (`CoverStory`) | 3.0 s | cutout, face | A flash turns the shot into a live magazine cover: masthead behind the head, cover lines, barcode | `masthead`, `color`, `headline`, `lines`, `sticker` |
| 17 | Glass type (`GlassType`) | 3.0 s | - | One to three huge frosted-glass words refract the footage behind them | `text` (`\n` sets lines), `y`, `tint` |

Copy limits that matter: orbit chips one word; checklist items about 22 characters; paper-cut title
about two words of six letters or fewer; cover lines 2-4 words and a 4-7 letter masthead; glass type one
to three short words; doodle note 1-3 words. No real brands, outlets or magazine names.

## 3. New footage: preparing a talent

Each clip becomes a "talent": the clip, a cutout with alpha, a clean plate and a face track.

1. Put the clip in `reel/public/footage/<id>.mp4` (vertical works best; any size).
2. Matte it (CPU, about 2 min per 8 s of 720p):
   ```bash
   python3 -m venv /tmp/mv && /tmp/mv/bin/pip install onnxruntime "opencv-python-headless<5" numpy
   curl -L -o rvm_mobilenetv3_fp32.onnx \
     https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx
   cd reel && /tmp/mv/bin/python scripts/matte.py public/footage/<id>.mp4 public/cutouts --model ../rvm_mobilenetv3_fp32.onnx
   ```
   Writes `public/cutouts/<id>.webm` (speaker with alpha), `<id>-plate.jpg`, `<id>-matte.mp4`, and the
   VP9 copy `public/footage/<id>.webm`. Add `--fade-bottom Y0:Y1` if the clip has burned-in text or a
   watermark low in the frame. Run clips one at a time (each run holds ~2 GB). Look at the matte.
   The model is GPL-3.0: download it, never commit it.
3. Face track: `python3 scripts/facetrack.py src/data/faces.json public/footage/*.mp4`. It rewrites the
   whole file, so pass every clip that needs a track (the reel's four clips too). Its detector expects
   faces of at least 150 px, so lower `minSize` for small-face shots.
4. Register it in `src/effects/shared.tsx`: add the id to `TalentId` and an entry to `TALENT` with
   `makeTalent(id, { w, h, fps, seconds, usableBottom })`. `usableBottom` is the first source row that
   must never show (burned-in text); omit it for clean footage.

Hard-won facts:
- The render browser (Chrome headless shell) cannot decode H.264. Effects use the VP9 copy; an .mp4 in
  `<Video>` silently falls back to a decoder that ignores `effects`.
- `@remotion/effects` need WebGL: `remotion.config.ts` sets `Config.setChromiumOpenGlRenderer("angle")`.
- `zoomBlur({ center })` measures y from the BOTTOM (GL texture space): pass `[x / w, 1 - y / h]`.
- The full clip and the cutout, placed with the same `Framing` and `startAt`, line up pixel for pixel.
  That is how graphics go *behind* the speaker: full clip → graphics → cutout → foreground graphics.
- `frameOnFace(talent)` fills the frame and keeps rows below `usableBottom` off screen (the scale rises
  to at least 1920 / usableBottom). Use `fill: false` only for clips inside a smaller frame.
- Inside a `<Sequence>`, `useVideoConfig().durationInFrames` is the Sequence's own length, so the
  effects time their exits to whatever length you give them.

## 4. Using an effect in a video

```tsx
import { Sequence } from "remotion";
import { Checklist, TALENT } from "./effects";

// The voice says "what you get" at output frame 412, from 3.4 s into clip 03-outcome.
<Sequence from={410} durationInFrames={105} premountFor={30}>
  <Checklist talent={TALENT["03-outcome"]} startAt={3.4 - 2 / 30}
    title="What you get" items={["Profile refreshed", "3 posts a week", "Replies within a day"]} />
</Sequence>
```

- The effect draws the whole frame, including the clip, so set `startAt` to the source time of the
  footage underneath at the Sequence's first frame: lip sync stays intact and the cut is invisible.
- How each effect meets the shots around it (checked on the first and last rendered frames):
  - **Seamless in and out** (open and close on the plain shot in the default `frameOnFace(talent)`
    framing, so they can sit in the middle of a shot): Orbit, Frame break, Digital zoom, Phone mockup,
    Green screen, Doodle boil, Vertigo, Cover story, Glass type. Zoom-through cut opens on clip A and
    lands on clip B's plain framing.
  - **Seamless in, own ending** (cut away on their last frame): Couch wall (ends on the wall), Pull-back
    reveal (ends on the desk scene).
  - **Own framing throughout** (put them on a cut): UI world, Checklist, Chart grow (speaker lower and
    smaller), Headline wall (speaker at scale 1.55 on a dark wall), Paper cut (opens and closes on paper).
  Use the default framing for the plain talking-head shots so the seamless ones join invisibly.
- The clip must have `startAt + length` seconds of footage left (the zoom-through cut needs that for
  both clips).
- Sound: give each effect's main hit a SFX 2-3 frames early (`public/audio/sfx/`: whooshes, pops,
  clicks, ticks, shimmer, impact).

## 5. Verify every time

- Preview any effect in Studio as `Fx-NN-slug` (e.g. `Fx-07-checklist`). `EffectsShowcase` plays all
  17 (`renders/effects-showcase.mp4`).
- Render stills at the entrance, the peak, the hold and the last frame, and look at them:
  `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell npx remotion still Fx-07-checklist out/f.png --frame 60`
- Check: no source rows below `usableBottom`, no floating faded torso (the cutout's soft bottom must be
  off frame or covered), text inside the safe zone and readable, and the last frame back to the speaker.
- `npx tsc --noEmit` clean.

## 6. ToothReferral product animations

For ToothReferral videos (or any dental-referral explainer), `reel/src/tr/` has 11 animated dashboard scenes:
new referral, incoming, office chat, case lifecycle, analytics, needs attention, referral journey,
insurance link, notification stack, funnel and an overview. Each comes vertical (`TR-NN-slug`), horizontal
(`TR-NN-slug-h`) and transparent (`--props='{"transparent":true}'`, ProRes 4444 via
`reel/scripts/render_tr_alpha.sh`). `reel/TOOTHREFERRAL-DASHBOARD.md` explains every dashboard screen and which
scene fits which line. Use them as cut-away inserts or as alpha overlays beside the speaker; analytics numbers
are illustrative until the client confirms real ones.
