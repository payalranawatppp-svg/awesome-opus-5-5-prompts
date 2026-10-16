"""Music bed for the EffectsShowcase composition (deterministic, numpy only).

    python3 scripts/synth_showcase.py --seconds 56.5     # writes public/audio/music/showcase-bed.m4a

120 BPM, so one beat is 15 frames at 30 fps: the showcase sizes every section in whole beats, so each
effect cut lands on a beat. Pad and arpeggio under the 3 s intro, drums from the first effect cut,
then the drums stop for a final chord that rings under the 3 s outro. Reuses the instruments in
synth_audio.py (the reel's sound kit).
"""
import argparse
import subprocess

import numpy as np

from synth_audio import MUSIC_DIR, SR, add, clap, hat, kick, midi, pluck, reverb, riser, saw_pad, write

ap = argparse.ArgumentParser()
ap.add_argument("--seconds", type=float, required=True, help="showcase length (npx remotion compositions)")
ap.add_argument("--intro", type=float, default=3.0)
ap.add_argument("--outro", type=float, default=3.0)
args = ap.parse_args()

BEAT = 0.5
BAR = 4 * BEAT
total = args.seconds
drums_from = args.intro
drums_to = total - args.outro

# Am7 | Fmaj7 | C(add9) | G6  -- one chord per bar, roots in octave 2 for the bass
CHORDS = [
    (45, [57, 60, 64, 67]),
    (41, [57, 60, 64, 65]),
    (48, [55, 60, 62, 64]),
    (43, [55, 59, 62, 64]),
]

n = int((total + 3.0) * SR)
music = np.zeros((n, 2))
drums = np.zeros((n, 2))

bars = int(np.ceil(drums_to / BAR))
for b in range(bars):
    t0 = b * BAR
    root, tones = CHORDS[b % len(CHORDS)]
    add(music, saw_pad([midi(m) for m in tones], BAR + 0.25, cut=4.0, seed=b), t0, 0.55)
    for k in range(8):                                     # eighth-note arpeggio, alternating pan
        m = tones[[0, 2, 1, 3, 2, 1, 3, 2][k]] + 12
        add(music, pluck(midi(m), 0.38), t0 + k * BEAT / 2, 0.16 if k % 2 else 0.22, -0.35 if k % 2 else 0.35)
    if t0 >= drums_from - 1e-6:
        for beat in (0, 2):                                 # bass on beats 1 and 3
            add(music, pluck(midi(root), 0.6), t0 + beat * BEAT, 0.5)

t = drums_from
i = 0
while t < drums_to - 1e-6:
    pos = i % 8                                             # eighth notes in a bar
    if pos in (0, 4):
        add(drums, kick(), t, 0.8)
    if pos in (2, 6):
        add(drums, clap(seed=i), t, 0.22, 0.1)
    add(drums, hat(seed=1000 + i), t, 0.09 if pos % 2 == 0 else 0.14, -0.2 if pos % 2 else 0.2)
    t += BEAT / 2
    i += 1

add(music, riser(args.intro), 0.0, 0.18)                    # lifts into the first cut

# final chord under the outro (Am add9), long release
final = saw_pad([midi(m) for m in (57, 60, 64, 71)], args.outro + 2.0, cut=5.0, seed=99)
add(music, final, drums_to, 0.7)
add(drums, kick(), drums_to, 0.9)
add(music, pluck(midi(45), 1.6), drums_to, 0.7)

wet = reverb(music, seconds=2.2, decay=0.5)
mix = music * 0.85 + wet * 0.35 + drums
mix = mix[: int(total * SR)]
fade = int(0.9 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
mix = np.tanh(mix * 1.3) / 1.3
wav = MUSIC_DIR / "showcase-bed.wav"
write(wav, mix, -3)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-c:a", "aac", "-b:a", "256k",
                str(MUSIC_DIR / "showcase-bed.m4a")], check=True)    # AAC keeps the repo small
wav.unlink()
print(f"showcase bed: {total:.2f}s at 120 bpm, drums {drums_from:.1f}-{drums_to:.1f}s")
