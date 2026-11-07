"""Music bed for "Buried in Emails" (Script 13), composed against the edit. Numpy only, deterministic.

A modern corporate bed at 96 BPM (A minor -> C major feel): warm electric-piano chords, soft sub bass and a soft pad
under the problem (0 to "Let me show you"); a light plucked arpeggio, soft kick and shaker join when the dashboard
slides in; the last chord lands on the end card and rings out. Mixed low, to sit under dialogue.

    python3 scripts/synth_s13_bed.py  ->  public/audio/music/s13-bed.wav
"""
import json
import wave
from pathlib import Path

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(13)
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT

cut = json.load(open(ROOT / "src/data/s13-cut.json"))
words = json.load(open(ROOT / "src/data/transcript-s13.json"))["s13"]["words"]
END = cut["duration"]  # end card starts here
TOTAL = END + 2.6
LIFT = next(w["start"] for w in words if w["word"].strip().lower().startswith("let")) - 0.45  # "Let me show you"

n = int(TOTAL * SR)
t = np.arange(n) / SR
L = np.zeros(n)
R = np.zeros(n)


def note_hz(name):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    p, o = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[p] + 12 * (o + 1) - 69) / 12)


def env(length, a=0.01, d=0.3, s=0.6, r=0.4):
    m = int(length * SR)
    e = np.ones(m) * s
    ai, di, ri = int(a * SR), int(d * SR), int(r * SR)
    e[:ai] = np.linspace(0, 1, ai)
    e[ai : ai + di] = np.linspace(1, s, di)
    e[-ri:] *= np.linspace(1, 0, ri)
    return e


def add(x, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= n:
        return
    x = x[: n - i]
    L[i : i + len(x)] += x * gain * (1 - max(0, pan))
    R[i : i + len(x)] += x * gain * (1 + min(0, pan))


def epiano(f, length):
    """Soft electric-piano tone: a few sine partials with a bell-ish attack, slight detune chorus."""
    m = int(length * SR)
    tt = np.arange(m) / SR
    tone = np.zeros(m)
    for k, a in [(1, 1.0), (2, 0.32), (3, 0.12), (4, 0.06)]:
        tone += a * (np.sin(2 * np.pi * f * k * tt) + np.sin(2 * np.pi * f * k * 1.003 * tt)) / 2
    bell = 0.25 * np.sin(2 * np.pi * f * 7 * tt) * np.exp(-tt * 9)
    return (tone + bell) * env(length, 0.008, 0.9, 0.35, min(0.8, length * 0.6))


def pad(f, length):
    m = int(length * SR)
    tt = np.arange(m) / SR
    x = sum(np.sin(2 * np.pi * f * d * tt + rng.uniform(0, 6)) for d in (0.996, 1.0, 1.004))
    x += 0.4 * np.sin(2 * np.pi * f * 2 * tt)
    lfo = 0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * tt)
    return x * lfo * env(length, 1.2, 0.5, 0.8, 1.2) / 3


def pluck(f, length=0.5):
    m = int(length * SR)
    tt = np.arange(m) / SR
    x = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt) + 0.1 * np.sin(2 * np.pi * f * 3 * tt)) * np.exp(-tt * 7)
    x[: int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    return x


def sub(f, length):
    m = int(length * SR)
    tt = np.arange(m) / SR
    return np.sin(2 * np.pi * f * tt) * env(length, 0.02, 0.2, 0.8, 0.25)


def kick():
    m = int(0.35 * SR)
    tt = np.arange(m) / SR
    f = 50 + 70 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)


def shaker():
    m = int(0.09 * SR)
    x = rng.standard_normal(m)
    x = np.diff(np.concatenate([[0], x]))  # brighter
    return x * np.exp(-np.arange(m) / SR * 45)


# chords: Am - F - C - G (problem), then F - G - Am - C ... lifting; final C
PROG_A = [["A3", "C4", "E4", "G4"], ["F3", "A3", "C4", "E4"], ["C3", "G3", "C4", "E4"], ["G3", "B3", "D4", "G4"]]
PROG_B = [["F3", "A3", "C4", "E4"], ["G3", "B3", "D4", "F4"], ["A3", "C4", "E4", "G4"], ["C3", "E3", "G3", "C4"]]
BASS_A = ["A1", "F1", "C2", "G1"]
BASS_B = ["F1", "G1", "A1", "C2"]

bar = 0
tb = 0.0
while tb < END:
    after = tb >= LIFT - 0.01
    chord = (PROG_B if after else PROG_A)[bar % 4]
    bass = (BASS_B if after else BASS_A)[bar % 4]
    for i, nn in enumerate(chord):
        add(epiano(note_hz(nn), BAR * 0.98), tb + i * 0.012, 0.16, pan=(-0.25 + 0.5 * i / 3))
    add(pad(note_hz(chord[0]) * 2, BAR), tb, 0.10 if not after else 0.07)
    add(sub(note_hz(bass), BAR * 0.95), tb, 0.30 if after else 0.22)
    if after:
        arp = chord + chord[1:3]
        for s in range(8):  # eighth-note arpeggio, up an octave
            f = note_hz(arp[s % len(arp)]) * 2
            add(pluck(f), tb + s * BEAT / 2, 0.09, pan=0.35 if s % 2 else -0.35)
        for b in range(4):
            add(kick(), tb + b * BEAT, 0.28)
            add(shaker(), tb + b * BEAT + BEAT / 2, 0.05, pan=0.2)
            add(shaker(), tb + b * BEAT + BEAT * 0.75, 0.03, pan=-0.2)
    tb += BAR
    bar += 1
    # snap the bar that would cross the lift so the second section starts on the lift
    if not after and tb > LIFT:
        tb = LIFT

# final chord on the end card
for i, nn in enumerate(["C3", "G3", "C4", "E4", "G4"]):
    add(epiano(note_hz(nn), TOTAL - END + 0.2), END + i * 0.015, 0.18, pan=-0.3 + 0.15 * i)
add(pad(note_hz("C4"), TOTAL - END + 0.2), END, 0.1)
add(sub(note_hz("C2"), TOTAL - END), END, 0.3)

# soft room: a short stereo reverb tail (noise impulse, exponential decay)
ir_len = int(1.6 * SR)
ir_t = np.arange(ir_len) / SR
irL = rng.standard_normal(ir_len) * np.exp(-ir_t * 3.2)
irR = rng.standard_normal(ir_len) * np.exp(-ir_t * 3.2)
irL /= np.abs(irL).sum() ** 0.5 * 30
irR /= np.abs(irR).sum() ** 0.5 * 30


def fconv(x, h):
    m = len(x) + len(h) - 1
    k = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, k) * np.fft.rfft(h, k), k)[: len(x)]


L2 = L + 0.35 * fconv(L, irL)
R2 = R + 0.35 * fconv(R, irR)
# gentle fades
fade_in = np.clip(t / 1.5, 0, 1)
fade_out = np.clip((TOTAL - t) / 1.8, 0, 1)
mix = np.stack([L2, R2], 1) * (fade_in * fade_out)[:, None]
mix /= np.abs(mix).max() / 10 ** (-1 / 20)
pcm = np.clip(mix * 32767 + rng.uniform(-0.5, 0.5, mix.shape), -32768, 32767).astype(np.int16)
out = ROOT / "public/audio/music/s13-bed.wav"
w = wave.open(str(out), "wb")
w.setnchannels(2)
w.setsampwidth(2)
w.setframerate(SR)
w.writeframes(pcm.tobytes())
w.close()
print(out, round(TOTAL, 2), "s, lift at", round(LIFT, 2))
