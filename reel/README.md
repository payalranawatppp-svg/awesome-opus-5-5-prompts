# Signal Reach — Instagram Reel (Remotion)

A 29-second, 1080×1920 / 30 fps Reel cut from four AI-generated talking-head clips, with
kinetic captions, context-specific motion graphics and synchronized sound design.
Everything is rendered by Remotion from code. All audio is synthesized or derived from the
footage, so the project has no third-party media.

**Final render:** [`renders/signal-reach-reel.mp4`](renders/signal-reach-reel.mp4) — H.264 (CRF 16) + AAC 256k,
ElevenLabs voice, −15.2 LUFS integrated, −2.1 dBTP true peak, 877 frames. Post caption: [`CAPTION.md`](CAPTION.md).

## The edit

| Section | Narration | On-screen story |
| --- | --- | --- |
| Problem (0–6.6 s) | "Does your LinkedIn look like this? Quiet page, hardly any updates? Running a business leaves little time for posting." | A neglected profile card: the activity line flatlines on "Quiet", an empty month flashes on "updates?", then a time donut where *Posting* gets a sliver on "little time". |
| Solution (6.6–14.2 s) | "At Signal Reach, we help with the whole picture. Useful posts, thoughtful comment replies, personalized outreach, and managing your inbox." | Brand mark reveal that becomes the hub of a 2×2 "whole picture" grid; each service lights up and gets a check on the exact word that names it. |
| Outcome (14.2–21.4 s) | "The aim? A more active page, relevant followers, and conversations that could become leads, without taking over your day." | An arrow thuds into a bullseye after "aim?"; three outcome cards (rising activity bars, followers joining, chat → *Lead* badge); a calm clock — "Your day, still yours." |
| Call to action (21.4–29.2 s) | "Start with one useful post and a few genuine replies. Need a hand staying consistent? Let's build your plan." | One post (badge "1") + three genuine replies; the empty month from the hook returns as a fully checked week; logo + **Build your plan** button clicked on "plan". |

Editorial decisions:

- **Clip order 1 → 2 → 4 → 5.** Upload 3 was a byte-identical copy of upload 2 (same MD5), so it is not used.
- **Dead air removed** only where pauses were ≥0.7 s (after "look like this?", after "updates?", and the two
  pauses in the CTA clip), plus trailing silence. Every cut sits in a measured quiet region of the audio
  envelope; jump cuts alternate wide and punched-in framings. Shorter rhetorical beats ("The aim? …") are kept.
- **Garbled burned-in captions and the generator watermark** in the source clips sit at source y ≥ 1040.
  The framing never shows source y below ≈ 815, so both stay out of frame on every shot.
- **Section transitions** (problem → solution → outcome → CTA) are zoom-throughs with motion blur and a
  light sweep, each with a whoosh peaking on the cut. Jump cuts inside a section are plain cuts.
- The generated clips fade toward grey over their final ~0.3 s, so the last segment stops at 7.6 s and that
  clean frame is held for 32 frames under the end card while the music's final chord rings out.
- Polish pass against the `remotion-motion-graphics` skill's delivery checklist: procedural film grain and
  a vignette on top of the whole stack, subtle idle breathing on graphics that stay on screen, eased (not
  linear) caption exits, highlight fades and light sweeps, and a CRF 16 master for platform re-compression.

## Layout: the avatar is never covered

Fixed safe zones (`src/theme.ts`), top to bottom: **caption band** (y 150–372) → **graphics stage**
(y 392–806) → **gap** → **avatar** (head top always ≥ y 834).

- `src/camera.ts` projects a per-frame face track (`src/data/faces.json`, OpenCV, every source frame)
  through the framing, punch-ins and transition zooms to get the avatar's head-top keep-out line for
  every output frame. Hair height above the face box was measured (max 37% of face height); 40% is used.
- `src/layout.ts` measures caption words with the real font (`@remotion/layout-utils` `measureText`), picks
  balanced line breaks, and shrinks the font until the block fits **both** the caption band and the space
  above the avatar for that caption's whole lifetime. The graphics stage scales down the same way if the
  avatar would ever reach it.
- Graphics scenes run back-to-back (one exits fully before the next enters). Entrances are scale-ins with
  ≤20 px travel, so no animation moves toward the captions or the face.
- **Verified on the rendered output, every frame:** the `LayoutQA` composition renders captions, graphics
  and the avatar keep-out box as white silhouettes in three panels, and `scripts/check_layout_qa.py` ANDs them
  per frame. Current result: no overlap on any of the 877 frames, at least 8 px between captions and
  graphics, and at least 36 px between any overlay and the avatar.

## Sound

- **Voice (ElevenLabs):** the four clips were generated separately, so their voices drifted in pitch
  (median 114–137 Hz) and carried AI-audio artefacts. `scripts/elevenlabs_sts.sh` re-voices each clip with
  ElevenLabs **speech-to-speech** (model `eleven_multilingual_sts_v2`, premade voice "Chris", the closest
  pitch match at ≈132 Hz, background-noise removal on). Speech-to-speech keeps the original performance's
  timing, so lip-sync, captions and every cue stay locked. Verified per clip with `scripts/verify_voice.py`:
  a Whisper re-transcription matches the original word for word, and the timing offset is 0 ms
  (−5 ms on clip 1). The raw takes live in `public/audio/voice-elevenlabs/`. Set `VOICE_SOURCE=original` for
  `process_voice.sh` to fall back to the clips' own voice.
- **Voice processing:** high-passed and compressed, then levelled to the same loudness behind a −1.5 dBFS
  limiter (`scripts/process_voice.sh`). The voice is cut with the same in/out points as the picture, with
  2-frame fades at every cut. Each segment was cross-correlated against its source and lands within ±0.3 ms.
- **Music bed** (`scripts/synth_audio.py`, numpy-synthesized, 109 BPM): a sparse filtered pad with clock-like
  woodblock ticks under the problem section, a drop **exactly on the brand cut** (three intro bars are sized to
  land on it), a breakdown under "Need a hand…", and a final C-major chord **on the CTA button click**.
  It is ducked under speech from the word timings (median 14 dB under the voice while he talks) and lifts in pauses
  and under the end card.
- **SFX** (also synthesized): whooshes, pops, clicks, ticks, blips, chime, shimmer, impact, thud, riser and a
  soft flatline beep. Each sound is tied to the same cue frame that drives its animation (`CUES` in
  `src/edit.ts`), and whooshes are offset so their *peak* hits the cut. Levels were set from rendered stems:
  transients sit 2–3 dB under the voice peaks, and the arrow thud lands in the pause after "aim?" so it
  never masks the word.

## Effects library

`src/effects/` holds 17 reusable effects for talking-head Reels, inspired by a creator's "17 video effects
Claude can create" reel and built for the next videos: orbit, couch wall, UI world, frame break, digital zoom,
phone mockup, checklist, headline wall, zoom-through cut, chart grow, pull-back reveal, green screen, paper
cut, doodle boil, vertigo, cover story and glass type. Each file exports `meta` (what it is, when to use it,
when not to) and one component with defaults; preview any of them in Studio as `Fx-NN-slug`.
**Showcase:** [`renders/effects-showcase.mp4`](renders/effects-showcase.mp4) plays all 17 (59.5 s, every cut on
the beat of a 120 BPM bed made by `scripts/synth_showcase.py`).

How to pick effects for a script, prepare new footage and verify the result is in the project skill
[`.claude/skills/reel-effects/SKILL.md`](../.claude/skills/reel-effects/SKILL.md). The building blocks:

- `scripts/matte.py` cuts the speaker out locally with Robust Video Matting (ONNX, model downloaded at run
  time): a VP9 cutout with alpha, a clean background plate and a VP9 copy of the clip (the render browser
  cannot decode H.264, and `@remotion/effects` need the browser to decode the video).
- `src/effects/shared.tsx`: talents (clip + cutout + plate + face track), `frameOnFace` framing that keeps
  burned-in text off screen, `useFace`, `TalentLayer`, and the shared motion vocabulary.

## Run it

Requires Node ≥ 22, ffmpeg, and Python 3 with `numpy` (plus `faster-whisper` and `opencv-python-headless<5` only to redo the analysis).

```bash
cd reel
npm ci
npm run studio          # preview in Remotion Studio
npm run render          # → out/signal-reach-reel.mp4
npm run showcase        # → out/effects-showcase.mp4 (all 17 effects)
npm run qa:layout       # per-frame caption / graphics / avatar overlap check
npm run stems           # out/stem-{voice,music,sfx}.wav for mix checks
npm run audio           # re-synthesize SFX + music and re-level the voice
ELEVENLABS_API_KEY=… ./scripts/elevenlabs_sts.sh   # regenerate the ElevenLabs voice takes (uses credits)
node scripts/stills.mjs 0 200 437 827   # review stills → out/stills/
```

Set `REMOTION_BROWSER=/path/to/chrome-headless-shell` to use a locally installed browser instead of
Remotion's download.

To redo the analysis: `scripts/transcribe.py` (faster-whisper word timestamps →
`src/data/transcript.json`; the first-word onsets of clips 2–4 were corrected from the audio envelope) and
`scripts/facetrack.py` (face boxes → `src/data/faces.json`).

## Files

```
src/
  edit.ts          EDL → output timeline, word timings, caption chunks, story cues (single source of truth)
  camera.ts        framing, punch-ins, transitions, avatar keep-out per frame
  layout.ts        measured caption fitting + stage sizing against the avatar
  theme.ts         palette, fonts, safe zones
  components/      Footage, Backdrop, Captions, Stage, SoundTrack, kit (icons/helpers), scenes/*
  effects/         the 17-effect library (NN-slug.tsx), shared.tsx, index.ts, FxPreview.tsx
  showcase/        EffectsShowcase: all 17 effects back to back
  LayoutQA.tsx     silhouette render used by the overlap check
  data/            edl.json, transcript.json, faces.json
public/
  footage/         the four source clips (renamed by story beat) + VP9 copies for the effects
  cutouts/         speaker cutouts (VP9 + alpha), clean plates and raw mattes from scripts/matte.py
  audio/           processed voice, synthesized music bed + SFX
  fonts/           Plus Jakarta Sans, Inter, Instrument Serif, Caveat, JetBrains Mono (SIL OFL 1.1 — licences included)
scripts/           analysis, audio synthesis, voice processing, QA, review tools
renders/           final MP4s (the reel and the effects showcase)
```
