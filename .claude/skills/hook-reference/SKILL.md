---
name: hook-reference
description: The user's chosen reference for hooks and talking-head editing (the Devin Jatho style, broken down layer by layer in instagram.com/reel/DcJNJurOtH9). Use whenever writing a script or a hook for a talking-head/avatar video, or editing one (captions, punch-in zooms, flashes, text, cards, SFX), so the first 3 seconds follow this pattern.
---

# Hook & edit reference (user-chosen, 2026-11-01)

Reference: instagram.com/reel/DcJNJurOtH9 ("Devin Jatho Editing Breakdown", @harshit.motion). It builds one 3-second
hook in layers: **Raw → Tracking → CC → Zooms → Texts → Animations → SFX**. A second reference the user sent,
instagram.com/reel/DbeVHuGspag, was unavailable (removed or private); ask for a screen recording if it matters.

## 1. Writing the hook (first 3 seconds)

The reference hook: *"Never ever do these 3 things if you want to go viral."*

Pattern = **warning + number + the viewer's desire**, said in one breath, under 3 s:
- Open on a hard negative or a command ("Never…", "Stop…", "Don't…"), doubled for weight ("never *ever*").
- A small concrete number ("these 3 things") so the viewer knows the video has an end.
- Close on what *they* want ("if you want to go viral" → for ToothReferral: "if you want referrals that don't get lost").
- No intro, no name, no "hey guys". The first word is the hook.

ToothReferral versions in this shape:
- "Never, ever send a referral these 3 ways if you want the patient to actually show up."
- "Stop doing these 3 things with referrals if you want GPs to keep sending them."
- "Don't touch another fax until you've seen these 3 things."

In Flow prompts, give the hook its own beats: a sharp head-forward lean and raised brows on "never", a hand raised
on the number, eyes on the lens throughout.

## 2. Editing the hook: the layers, in order

| Layer | What it does in the reference | How to do it here (Remotion, `reel/src/reelfx/`) |
|---|---|---|
| Tracking | graphics stick to the speaker; slight follow motion | `handOut`/face track from `scripts/handtrack.py` + `faces.json`; tie text to the chest box |
| CC | cool teal/cyan background, warm skin, strong contrast | per-clip `match_grade.py`, then a global `contrast(1.08) saturate(1.1)` and a teal-leaning background |
| Zooms | **punch-ins** on the strong words: instant 1.0 → ~1.12, hold, ease back; alternate in/out each phrase | animate the TalentLayer framing scale on the word frames (`at("never")` …), 2–4 frames in, 8–12 out |
| Texts | heavy condensed UPPERCASE (Anton/Bebas-like), lower third over the chest; **red** (#FF2D3A, soft red glow) for the trigger words, **white** for the rest; lines **stack** ("NEVER" → "NEVER EVER", then "DON'T DO THIS" / "3 THINGS") | one text block that adds words as they are spoken; each word pops in from scale 1.3 + blur to 1 in ~4 frames |
| Animations | **full-frame red flash** on the first trigger word ("NEVER", ~6 frames, fades out); a dimmer red pulse on the repeat ("EVER"); an **icon row** under the number (three small glass icons); on the payoff a **dark glass analytics card** ("Views Insight", purple line graph) slides up in the lower third | red `AbsoluteFill` with `mix-blend-mode: screen`, opacity 0.85 → 0 over 6 frames; icons and card as small glass components |
| SFX | a hit/whoosh on every text change and flash, a riser into the payoff | `public/audio/sfx/` (impact on the flash, pop per word, whoosh on the card) |

Rhythm: something changes on screen roughly every 0.4–0.6 s during the hook (word, flash, zoom, card). After the hook,
drop to the calmer pace of the rest of the video.

## 3. Checklist for every new script/edit

- [ ] Hook = warning + number + desire, ≤ 3 s, first word is the hook.
- [ ] Trigger words red, rest white, stacked lower third, word-by-word.
- [ ] One red flash on the first trigger word; punch-ins on the 2–3 strongest words.
- [ ] A visual for the number (icons) and for the payoff (card/graph/dashboard).
- [ ] SFX on every visual change in the hook.
- [ ] After the hook, keep the established caption style and pacing of the earlier ToothReferral edits.
