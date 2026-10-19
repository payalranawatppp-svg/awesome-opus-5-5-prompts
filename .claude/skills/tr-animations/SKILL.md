---
name: tr-animations
description: Design and build new ToothReferral product animations (Remotion, reel/src/tr) in the house style, in vertical, horizontal and transparent formats. Use when asked for a new ToothReferral/dashboard animation, UGC insert, end card, stat beat or overlay, or to improve existing ones.
---

# ToothReferral animations

All code lives in `reel/src/tr/`. Read `reel/TOOTHREFERRAL-DASHBOARD.md` first for what the product does; every
animation should tell one step of the referral story (send → receive → insurance → talk → status → outcome).

| File | What it holds |
| --- | --- |
| `ui.tsx` | Brand kit: `TR` palette, `Stage`, `Card`, `Badge`, `Avatar`, `Button`, `Cursor`, `Toast`, `Icon`/`ICON`, `useIn`, `rise`, `useExit`, `TransparentContext` |
| `motion.tsx` | v2 motion toolkit (below) |
| `scenes.tsx` | TR-01…07, rebuilt dashboard screens |
| `custom.tsx` | TR-08…11, improvised product stories |
| `v2.tsx` | TR-12…16, original brand pieces (before/after, network, 3D case stack, big stats, CTA) |
| `formats.tsx` | `TR_ALL` + `TrFormatted`: every scene becomes vertical, horizontal and transparent |

## Design rules (keep every new piece consistent)

1. **Stage**: deep purple gradient (`<Stage>`). Never paint your own background: transparent mode depends on Stage.
2. **Two surfaces only**: white product `Card` (real UI, dark text) or dark `glass()` (brand elements, white text).
3. **One hero colour**: `TR.purple` for actions, `TR.purpleBright` for accents on dark, `TR.green` only for
   success/verified, `TR.red` only for pain points, `TR.amber` for attention. No other colours.
4. **Type**: headlines `KineticLine` (Plus Jakarta Sans 800, 80–92 px, one accent word); UI text Inter 24–38 px.
5. **Motion**: springs or `easeIO`/`easeOut`, never linear. Stagger entrances 3–8 frames. Exits are faster than
   entrances (`useExit(8)`). Something moves in every second, but only one hero moment at a time; mark it with
   `LightSweep`, a ring pulse or a `Counter`.
6. **Frame**: 1080×1920, 30 fps, 4–5 s (120–150 frames). Keep all content between **y 280 and 1700** and x 60–1020,
   otherwise the horizontal format crops it. Headline at top ≈ 320–330.
7. **Data**: fictional demo people and offices (Maria Alvarez, Endo Specialists, Toledo Family Dental…). Numbers
   are illustrative; say so in the docs table.
8. **No emoji, no screenshots**: icons come from `ICON` (stroke paths), UI is rebuilt from components.

## Toolkit (`motion.tsx`)

| Piece | Use |
| --- | --- |
| `useSpring(at, {damping, stiffness, mass})` | 0→1 spring from frame `at` (top level of a component) |
| `ramp(frame, a, b, ease?)` | keyed 0→1 for camera moves, wipes, flattening |
| `easeIO`, `easeOut` | cubic in-out, expo out |
| `glass(radius)` | dark glass style object |
| `LightSweep({at, dur, opacity})` | diagonal shine; parent needs `position: relative; overflow: hidden` |
| `Counter({to, at, dur, decimals, prefix, suffix, style})` | count-up with tabular figures |
| `KineticLine({text, at, size, accent, stagger})` | word-by-word rise with blur |
| `FlowDot({from, to, at, dur, color, size})` | glowing dot with a trail travelling between two points |
| `bezier(t, p0, p1, p2, p3)` | point on a curve (for curved flights, see `ReferralJourney`) |
| `LogoWhite({width})` | white wordmark for the dark stage (`ui.tsx` `Logo` is the original black one) |

Patterns worth copying from `v2.tsx`: a phase switch with a shock-ring wipe (`BeforeAfter`), nodes plus flowing
dots (`NetworkMap`), CSS 3D with `perspective` + `preserve-3d` that flattens into a column (`CaseStack3D`), beats
that hand off with blur-up exits (`BigStats`), a clip-path logo reveal plus a cursor click and ripple (`CtaEndCard`).

## Recipe: add a new animation

1. Write the component in `v2.tsx` (or a new `src/tr/<name>.tsx`): `<Stage><Exit>…</Exit></Stage>`; skip `Exit`
   only for end cards that should hold.
2. Add `{ id: "TR-17-<slug>", C: Component, dur: 135 }` to the scene array (`TR_V2`). Anything in `TR_ALL`
   automatically gets `TR-17-<slug>` (vertical) and `TR-17-<slug>-h` (horizontal) compositions and transparent
   support, and joins `TR-Dashboard-Tour`.
3. `cd reel && npx tsc --noEmit`.
4. Check stills at the key frames (entrance, hero moment, just before exit) for both formats:
   ```bash
   export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
   npx remotion still TR-17-<slug> out/check.png --frame=60
   npx remotion still TR-17-<slug>-h out/check-h.png --frame=60
   ```
   Look for: text overflow, overlap with the headline, empty halves of the frame, content outside y 280–1700.
5. Render: `npx remotion render TR-17-<slug> out/x.mp4`; transparent overlays with
   `scripts/render_tr_alpha.sh TR-17-<slug>` (ProRes 4444 in `out/tr-alpha/`, uncommitted; WebM alpha in
   `renders/tr-alpha/`, committed). `SIDE=left|right` places the horizontal version beside a speaker.
6. To put it in a reel without the purple background and keep it looking polished, follow
   `reel/src/reelfx/ToothDepth.tsx`: frost the room, push the speaker cutout back, float `<TrFormatted id transparent />`
   on top, and mask the cutout above any burned-in captions. A `<Sequence>` shorter than the scene still exits
   cleanly, because `useExit` reads the sequence length.
7. Add a row to the animations table in `reel/TOOTHREFERRAL-DASHBOARD.md`.

## Ideas not built yet

- Patient-side phone flow end to end (link SMS → form → verified → appointment reminder).
- "Day-Prep Station" morning brief: today's cases fanning out as a timeline.
- Outgoing vs incoming split screen with mirrored flows.
- Specialist leaderboard (Top senders) racing bars.
- Map pins of offices dropping on a stylised city (Offices screen).
