import React from "react";
import { Audio, Sequence, getInputProps, interpolate, staticFile } from "remotion";
import { CUES, DURATION, SEGMENTS, WORDS } from "../edit";

// ---------------------------------------------------------------------------
// Voice: cleaned + levelled per clip (scripts/process_voice.sh), cut with the
// same in/out points as the picture, with 2-frame fades to avoid clicks at cuts.
// ---------------------------------------------------------------------------
export const Voice: React.FC = () => (
  <>
    {SEGMENTS.map((seg) => (
      <Sequence key={seg.id} from={seg.from} durationInFrames={seg.duration} layout="none" name={`voice ${seg.id}`}>
        <Audio
          src={staticFile(`audio/voice/${seg.clip}.wav`)}
          trimBefore={seg.in}
          volume={(f) =>
            interpolate(f, [0, 2, seg.duration - 2, seg.duration], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </Sequence>
    ))}
  </>
);

// ---------------------------------------------------------------------------
// Music: ducked under speech. Speech activity comes from the word timings;
// the bed rises in pauses and swells for the end card.
// ---------------------------------------------------------------------------
// Measured on rendered stems: ~14 dB under dialogue while speaking, lifting in pauses.
const MUSIC_UNDER_VOICE = 0.18;
const MUSIC_IN_GAPS = 0.45;
const MUSIC_END = 0.62;

const speechActive: boolean[] = (() => {
  const a = new Array<boolean>(DURATION).fill(false);
  for (const w of WORDS) {
    for (let f = Math.floor(w.start) - 3; f <= Math.ceil(w.end) + 5; f++) if (f >= 0 && f < DURATION) a[f] = true;
  }
  return a;
})();

/** One-pole smoothed duck envelope (fast attack, slower release). */
const musicGain: number[] = (() => {
  const g: number[] = [];
  let cur = MUSIC_IN_GAPS;
  for (let f = 0; f < DURATION; f++) {
    const target = f >= CUES.ctaClick ? MUSIC_END : speechActive[f] ? MUSIC_UNDER_VOICE : MUSIC_IN_GAPS;
    const k = target < cur ? 0.45 : 0.14;
    cur += (target - cur) * k;
    g.push(cur);
  }
  return g;
})();

export const Music: React.FC = () => (
  <Audio src={staticFile("audio/music/bed.wav")} volume={(f) => musicGain[Math.min(DURATION - 1, Math.max(0, Math.round(f)))]} />
);

// ---------------------------------------------------------------------------
// SFX: each cue is tied to the frame its animation lands on. Whooshes are
// offset so their peak (not their start) hits the cut or arrival.
// ---------------------------------------------------------------------------
type Sfx = { at: number; file: string; volume: number; peak?: number };

const PEAK = { "whoosh-long": 0.42 * 30, "whoosh-short": 0.2 * 30, riser: 1.6 * 30 } as const;

export const SFX: Sfx[] = [
  // Hook
  { at: CUES.hookPunch, file: "impact", volume: 0.32 },
  { at: CUES.profileIn + 6, file: "whoosh-short", volume: 0.3, peak: PEAK["whoosh-short"] },
  { at: CUES.profileThis, file: "pop-2", volume: 0.42 },
  { at: CUES.quiet + 4, file: "flatline", volume: 0.07 },
  { at: CUES.updates + 10, file: "pop-1", volume: 0.36 },
  // Time squeeze
  { at: CUES.timeIn, file: "whoosh-short", volume: 0.26, peak: PEAK["whoosh-short"] },
  { at: CUES.timeIn + 4, file: "tick-2", volume: 0.2 },
  { at: CUES.timeIn + 12, file: "tick-3", volume: 0.2 },
  { at: CUES.timeIn + 20, file: "tick-4", volume: 0.2 },
  { at: CUES.littleTime, file: "pop-1", volume: 0.36 },
  { at: CUES.toSolution, file: "riser", volume: 0.12, peak: PEAK.riser },
  // Solution
  { at: CUES.toSolution, file: "whoosh-long", volume: 0.4, peak: PEAK["whoosh-long"] },
  { at: CUES.brand, file: "chime", volume: 0.24 },
  { at: CUES.brand + 4, file: "shimmer", volume: 0.16 },
  { at: CUES.wholePicture + 6, file: "whoosh-short", volume: 0.24, peak: PEAK["whoosh-short"] },
  { at: CUES.svcPosts, file: "pop-1", volume: 0.36 },
  { at: CUES.svcPosts + 4, file: "click", volume: 0.22 },
  { at: CUES.svcReplies, file: "pop-2", volume: 0.36 },
  { at: CUES.svcReplies + 4, file: "click", volume: 0.22 },
  { at: CUES.svcOutreach, file: "pop-3", volume: 0.36 },
  { at: CUES.svcOutreach + 4, file: "click", volume: 0.22 },
  { at: CUES.svcInbox, file: "pop-3", volume: 0.38 },
  { at: CUES.svcInbox + 4, file: "click", volume: 0.24 },
  { at: CUES.servicesComplete, file: "shimmer", volume: 0.2 },
  // Outcome
  { at: CUES.toOutcome, file: "whoosh-long", volume: 0.4, peak: PEAK["whoosh-long"] },
  { at: CUES.aimHit, file: "whoosh-short", volume: 0.2, peak: PEAK["whoosh-short"] },
  { at: CUES.aimHit, file: "thud", volume: 0.22 },
  { at: CUES.outActive - 2, file: "pop-1", volume: 0.32 },
  { at: CUES.outFollowers - 2, file: "pop-2", volume: 0.32 },
  { at: CUES.outFollowers + 2, file: "tick-3", volume: 0.14 },
  { at: CUES.outFollowers + 8, file: "tick-5", volume: 0.14 },
  { at: CUES.outFollowers + 14, file: "tick-7", volume: 0.14 },
  { at: CUES.outConversations - 2, file: "pop-3", volume: 0.32 },
  { at: CUES.outConversations + 3, file: "blip-1", volume: 0.24 },
  { at: CUES.outConversations + 10, file: "blip-2", volume: 0.24 },
  { at: CUES.outLeads, file: "chime", volume: 0.24 },
  { at: CUES.yourDay - 2, file: "whoosh-short", volume: 0.22, peak: PEAK["whoosh-short"] },
  { at: CUES.dayCheck, file: "pop-2", volume: 0.3 },
  { at: CUES.dayCheck + 2, file: "click", volume: 0.22 },
  // Call to action
  { at: CUES.toCta, file: "whoosh-long", volume: 0.4, peak: PEAK["whoosh-long"] },
  { at: CUES.onePost, file: "pop-2", volume: 0.38 },
  ...CUES.replies.map((at, i) => ({ at, file: `blip-${i + 1}`, volume: 0.28 })),
  { at: CUES.consistent - 8, file: "whoosh-short", volume: 0.2, peak: PEAK["whoosh-short"] },
  ...Array.from({ length: 7 }, (_, i) => ({ at: CUES.weekTicks - 6 + i * 3, file: `tick-${i + 1}`, volume: 0.16 })),
  { at: CUES.weekTicks - 6 + 7 * 3 + 2, file: "pop-3", volume: 0.3 },
  { at: CUES.ctaIn, file: "whoosh-short", volume: 0.26, peak: PEAK["whoosh-short"] },
  { at: CUES.ctaIn + 5, file: "pop-1", volume: 0.26 },
  { at: CUES.ctaClick, file: "click", volume: 0.36 },
  { at: CUES.ctaClick + 1, file: "shimmer", volume: 0.22 },
];

/** Bus gain for all SFX (relative levels above were balanced against each other). */
const SFX_GAIN = 1.5;

const SfxTrack: React.FC = () => (
  <>
    {SFX.map((s, i) => {
      const from = Math.round(s.at - (s.peak ?? 0));
      return (
        <Sequence key={`${s.file}-${i}`} from={from} layout="none" name={`sfx ${s.file}`}>
          <Audio src={staticFile(`audio/sfx/${s.file}.wav`)} volume={Math.min(1, s.volume * SFX_GAIN)} />
        </Sequence>
      );
    })}
  </>
);

/** `--props='{"stem":"voice"}'` (or music / sfx) renders one stem for mix QA; default is the full mix. */
export const SoundTrack: React.FC = () => {
  const { stem } = getInputProps() as { stem?: "voice" | "music" | "sfx" };
  return (
    <>
      {(!stem || stem === "voice") && <Voice />}
      {(!stem || stem === "music") && <Music />}
      {(!stem || stem === "sfx") && <SfxTrack />}
    </>
  );
};
