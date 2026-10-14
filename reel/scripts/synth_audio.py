"""Synthesize every sound effect and the music bed for the reel (deterministic, numpy only).

    python3 scripts/synth_audio.py            # writes public/audio/sfx/*.wav and public/audio/music/bed.wav

The music is composed against the edit: it reads src/data/edl.json + transcript.json to
place the drop on the brand reveal cut, the breakdown under "Need a hand…" and the final
chord on the CTA button click ("plan.").
"""
import json
import wave
from pathlib import Path

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
SFX_DIR = ROOT / "public/audio/sfx"
MUSIC_DIR = ROOT / "public/audio/music"
rng = np.random.default_rng(7)


# ----------------------------------------------------------------------------- utils
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def write(path, x, peak_db=-1.0):
    """Write mono (n,) or stereo (n,2) float audio, peak-normalised, 16-bit with TPDF dither."""
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    peak = np.max(np.abs(x)) + 1e-12
    x = x / peak * 10 ** (peak_db / 20)
    fade = min(len(x), int(0.004 * SR))
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    dither = (rng.random(x.shape) - rng.random(x.shape)) / 32768
    pcm = np.clip((x + dither) * 32767, -32768, 32767).astype("<i2")
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())


def band(x, lo, hi):
    """Static brick-ish band filter via FFT with soft edges."""
    n = len(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    X = np.fft.rfft(x)
    m = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) * 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, n)


def swept_noise(dur, centers, q=1.2, seed=0):
    """Noise through a band-pass whose centre follows `centers(t_norm)` (STFT overlap-add)."""
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    win = 2048
    hop = 512
    noise = r.standard_normal(n + win)
    out = np.zeros(n + win)
    w = np.hanning(win)
    f = np.fft.rfftfreq(win, 1 / SR)
    for start in range(0, n, hop):
        c = centers(start / n)
        bw = c / q
        mask = np.exp(-0.5 * ((f - c) / bw) ** 2)
        seg = np.fft.irfft(np.fft.rfft(noise[start : start + win] * w) * mask, win)
        out[start : start + win] += seg * w
    return out[:n]


def env_ar(n, attack, release_shape=4.0):
    t = np.linspace(0, 1, n)
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-release_shape * np.clip(t - attack, 0, None) / max(1 - attack, 1e-4))


def pan(x, p):
    """Equal-power pan; p in [-1, 1] scalar or per-sample array."""
    p = np.asarray(p)
    ang = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(ang), x * np.sin(ang)], axis=1)


# ----------------------------------------------------------------------------- SFX
def whoosh(dur, peak, seed, lo=250, hi=3200):
    t = t_axis(dur)
    tn = t / dur
    pk = peak / dur
    centers = lambda u: lo + (hi - lo) * np.exp(-((u - pk) / 0.32) ** 2)
    x = swept_noise(dur, centers, q=1.6, seed=seed)
    rise = np.clip(tn / pk, 0, 1) ** 2.2
    fall = np.exp(-np.clip(tn - pk, 0, None) * 9)
    x *= rise * fall
    return pan(x, np.linspace(-0.6, 0.6, len(x)))


def pop(f0=900, f1=320, dur=0.11):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t * 70)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 38)
    x += 0.15 * band(rng.standard_normal(len(t)), 2000, 8000) * np.exp(-t * 400)
    return x


def click():
    t = t_axis(0.06)
    x = band(rng.standard_normal(len(t)), 1500, 9000) * np.exp(-t * 900)
    x += 0.5 * np.sin(2 * np.pi * 3100 * t) * np.exp(-t * 260)
    late = np.zeros_like(t)
    k = int(0.022 * SR)
    late[k:] = (band(rng.standard_normal(len(t) - k), 1200, 6000) * np.exp(-t[: len(t) - k] * 1100)) * 0.6
    return x + late


def tick(freq=2600):
    t = t_axis(0.05)
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 160) + 0.2 * band(rng.standard_normal(len(t)), 3000, 10000) * np.exp(-t * 600)


def blip(f0=520, f1=1250):
    t = t_axis(0.09)
    f = f0 + (f1 - f0) * (1 - np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ar(len(t), 0.04, 5)


def chime(base=1046.5):
    t = t_axis(1.4)
    x = np.zeros_like(t)
    for ratio, amp, dec in [(1, 1, 2.6), (2.0, 0.4, 3.5), (2.76, 0.25, 5), (5.4, 0.12, 8)]:
        x += amp * np.sin(2 * np.pi * base * ratio * t) * np.exp(-t * dec)
    y = np.zeros_like(t)
    d = int(0.07 * SR)
    y[d:] = 0.8 * sum(
        amp * np.sin(2 * np.pi * base * 1.5 * ratio * t[: len(t) - d]) * np.exp(-t[: len(t) - d] * dec)
        for ratio, amp, dec in [(1, 1, 2.8), (2.0, 0.35, 3.8)]
    )
    att = np.clip(t / 0.004, 0, 1)
    return np.stack([(x + 0.7 * y) * att, (0.7 * x + y) * att], axis=1)


def shimmer(dur=0.9, seed=3):
    r = np.random.default_rng(seed)
    t = t_axis(dur)
    out = np.zeros((len(t), 2))
    for _ in range(46):
        st = r.uniform(0, dur * 0.7)
        f = r.uniform(3000, 8500)
        g = t_axis(0.12)
        grain = np.sin(2 * np.pi * f * g) * np.exp(-g * 40) * (1 - st / dur)
        i = int(st * SR)
        j = min(len(t), i + len(grain))
        out[i:j] += pan(grain[: j - i], r.uniform(-0.8, 0.8))
    return out


def impact(dur=0.9, deep=True):
    t = t_axis(dur)
    f = 38 + 70 * np.exp(-t * 18)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (4 if deep else 9))
    body = band(rng.standard_normal(len(t)), 60, 1400) * np.exp(-t * 22) * 0.5
    snap = band(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t * 180) * 0.35
    return boom + body + snap


def thud():
    t = t_axis(0.35)
    f = 60 + 160 * np.exp(-t * 40)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)
    x += band(rng.standard_normal(len(t)), 600, 2600) * np.exp(-t * 70) * 0.6
    return x


def riser(dur=1.6):
    t = t_axis(dur)
    tn = t / dur
    x = swept_noise(dur, lambda u: 400 + 6000 * u**2.2, q=2.2, seed=11)
    f = 180 + 700 * tn**2
    tone = 0.25 * np.sin(2 * np.pi * np.cumsum(f) / SR)
    y = (x + tone) * tn**2.5
    return pan(y, 0.3 * np.sin(tn * 12))


def flatline():
    t = t_axis(0.62)
    x = np.sin(2 * np.pi * 988 * t) + 0.18 * np.sin(2 * np.pi * 1976 * t)
    return x * np.clip(t / 0.02, 0, 1) * np.clip((t[-1] - t) / 0.12, 0, 1)


def make_sfx():
    S = SFX_DIR
    write(S / "whoosh-long.wav", whoosh(0.7, 0.42, seed=1), -3)
    write(S / "whoosh-short.wav", whoosh(0.36, 0.2, seed=2, lo=500, hi=4200), -3)
    for i, (a, b) in enumerate([(820, 300), (960, 360), (1120, 420)]):
        write(S / f"pop-{i + 1}.wav", pop(a, b), -3)
    write(S / "click.wav", click(), -3)
    for i, f in enumerate([2200, 2400, 2600, 2800, 3000, 3250, 3500]):
        write(S / f"tick-{i + 1}.wav", tick(f), -6)
    for i, (a, b) in enumerate([(460, 1100), (560, 1300), (660, 1500)]):
        write(S / f"blip-{i + 1}.wav", blip(a, b), -4)
    write(S / "chime.wav", chime(), -3)
    write(S / "shimmer.wav", shimmer(), -4)
    write(S / "impact.wav", impact(), -1)
    write(S / "thud.wav", thud(), -2)
    write(S / "riser.wav", riser(), -3)
    write(S / "flatline.wav", flatline(), -6)


# ----------------------------------------------------------------------------- music
def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def saw_pad(freqs, dur, cut=6.0, detune_cents=(-9, 0, 8), seed=0):
    r = np.random.default_rng(seed)
    t = t_axis(dur)
    out = np.zeros((len(t), 2))
    for fq in freqs:
        for ch in range(2):
            for dc in detune_cents:
                f = fq * 2 ** ((dc + (3 if ch else -3)) / 1200)
                ph = r.uniform(0, 2 * np.pi)
                for n in range(1, 14):
                    if f * n > 9000:
                        break
                    out[:, ch] += np.sin(2 * np.pi * f * n * t + ph * n) * (1 / n) * np.exp(-n / cut)
    a = np.clip(t / 0.35, 0, 1)
    rel = np.clip((dur - t) / 0.45, 0, 1)
    return out * (a * rel)[:, None] / (len(freqs) * len(detune_cents))


def pluck(f, dur=0.42):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for n in range(1, 8):
        x += np.sin(2 * np.pi * f * n * t) * (0.7**n) * np.exp(-t * (6 + 5 * n))
    return x * np.clip(t / 0.003, 0, 1)


def kick():
    t = t_axis(0.42)
    f = 46 + 110 * np.exp(-t * 32)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8.5)
    x += band(rng.standard_normal(len(t)), 2000, 8000) * np.exp(-t * 900) * 0.25
    return x


def hat(seed):
    r = np.random.default_rng(seed)
    t = t_axis(0.07)
    return band(r.standard_normal(len(t)), 7000, 16000) * np.exp(-t * 70)


def clap(seed):
    r = np.random.default_rng(seed)
    t = t_axis(0.22)
    e = np.zeros_like(t)
    for off in (0, 0.009, 0.019):
        e += np.exp(-np.clip(t - off, 0, None) * 140) * (t >= off)
    e += 0.35 * np.exp(-t * 18)
    return band(r.standard_normal(len(t)), 900, 5000) * e


def wood(f):
    t = t_axis(0.08)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 55)


def add(buf, x, at, gain=1.0, p=0.0):
    i = int(round(at * SR))
    if i >= len(buf):
        return
    x = pan(x, p) if x.ndim == 1 else x.copy()
    j = min(len(buf), i + len(x))
    x = x[: j - i]
    fade = min(len(x), int(0.008 * SR))  # de-click truncated one-shots
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    buf[i:j] += x * gain


def reverb(x, seconds=1.8, decay=0.42, seed=5):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)) * np.exp(-t / decay)[:, None]
    ir[:, 0] = band(ir[:, 0], 200, 7000)
    ir[:, 1] = band(ir[:, 1], 200, 7000)
    ir /= np.sqrt(np.sum(ir**2, axis=0))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    out = np.zeros((len(x), 2))
    for ch in range(2):
        y = np.fft.irfft(np.fft.rfft(x[:, ch], size) * np.fft.rfft(ir[:, ch], size), size)
        out[:, ch] = y[: len(x)]
    return out


def timeline():
    edl = json.loads((ROOT / "src/data/edl.json").read_text())
    tr = json.loads((ROOT / "src/data/transcript.json").read_text())
    fps = edl["fps"]
    pos = 0
    segs = []
    for s in edl["segments"]:
        segs.append({**s, "from": pos})
        pos += s["out"] - s["in"]
    total = (pos + edl["tailHoldFrames"]) / fps

    def word_time(clip, text):
        for s in segs:
            if s["clip"] != clip:
                continue
            for w in tr[clip]["words"]:
                mid = (w["start"] + w["end"]) / 2 * fps
                if w["word"].lower().strip(".,?") == text and s["in"] <= mid < s["out"]:
                    return (s["from"] + w["start"] * fps - s["in"]) / fps
        raise KeyError(text)

    section_start = {}
    for s in segs:
        section_start.setdefault(s["section"], s["from"] / fps)
    return {
        "total": total,
        "drop": section_start["solution"],
        "outcome": section_start["outcome"],
        "cta": section_start["cta"],
        "need": word_time("04-cta", "need"),
        "button": round(word_time("04-cta", "plan") * fps) / fps,
    }


def make_music():
    tl = timeline()
    total = tl["total"]
    bar = tl["drop"] / 3  # three intro bars land the drop exactly on the brand cut
    beat = bar / 4
    n = int((total + 0.5) * SR)
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))
    drums = np.zeros((n, 2))
    bass_bus = np.zeros((n, 2))
    pump = np.ones(n)

    # Key of C: intro sits on A minor; groove runs IV–I–V–vi (F–C–G–Am).
    intro_chords = [[57, 60, 64, 71], [53, 57, 60, 67], [57, 60, 64, 71]]
    prog = [[53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 67], [57, 60, 64, 67]]
    roots = [41, 36, 43, 45]

    # Break: drums out on the beat nearest "Need", back for the final button chord.
    brk = tl["drop"] + round((tl["need"] - tl["drop"]) / beat) * beat
    button = tl["button"]

    # Intro: dark filtered pad + clock-like woodblock ticks ("little time").
    for i, ch in enumerate(intro_chords):
        add(send, saw_pad([midi(m) for m in ch], bar + 0.5, cut=2.2, seed=i) * 0.45, i * bar)
    for k in range(int(tl["drop"] / beat)):
        add(dry, wood(1650 if k % 2 == 0 else 1250), k * beat, 0.05, -0.3 if k % 2 else 0.3)
    add(dry, saw_pad([midi(45)], tl["drop"], cut=1.2, detune_cents=(0,)) * 0.12, 0.0)

    # Groove
    t = tl["drop"]
    bar_i = 0
    while t < brk - 1e-6:
        chord = prog[bar_i % 4]
        root = roots[bar_i % 4]
        span = min(bar, brk - t)
        add(send, saw_pad([midi(m) for m in chord], span + 0.4, cut=4.0, seed=10 + bar_i) * 1.1, t)
        arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[2] + 24, chord[3] + 12, chord[1] + 12, chord[2] + 12]
        for k in range(8):
            at = t + k * beat / 2
            if at >= brk:
                break
            p = pluck(midi(arp[k]))
            add(send, p, at, 0.16, 0.45 if k % 2 else -0.45)
            add(send, p, at + beat * 0.75, 0.06, -0.6 if k % 2 else 0.6)  # dotted-8th echo
        for b in range(4):
            at = t + b * beat
            if at >= brk:
                break
            add(drums, kick(), at, 0.55)
            i0 = int(at * SR)
            m = min(n - i0, int(beat * SR))
            pump[i0 : i0 + m] = np.minimum(pump[i0 : i0 + m], 1 - 0.5 * np.exp(-np.arange(m) / SR / 0.11))
            add(bass_bus, np.sin(2 * np.pi * midi(root) * t_axis(beat * 0.95)) * env_ar(int(beat * 0.95 * SR), 0.02, 2.2), at, 0.42)
            add(drums, hat(bar_i * 8 + b), at + beat / 2, 0.11 if b % 2 else 0.08, 0.25)
            if b in (1, 3):
                add(drums, clap(bar_i * 4 + b), at, 0.16, -0.1)
        t += bar
        bar_i += 1

    # Breakdown under "Need a hand staying consistent?": open pad, no drums, building to the button.
    gap = button - brk
    add(send, saw_pad([midi(m) for m in [53, 57, 60, 64, 67]], gap + 0.3, cut=3.0, seed=40) * 1.0, brk)
    for k in range(int(gap / (beat / 2))):
        add(send, pluck(midi([72, 76, 79, 84][k % 4]), 0.3), brk + k * beat / 2, 0.07 + 0.05 * k / max(1, gap / (beat / 2)), 0.3 if k % 2 else -0.3)

    # Final button: C major add9 hit with a soft kick, ringing out to the end.
    tail = total - button + 0.4
    add(send, saw_pad([midi(m) for m in [48, 55, 60, 64, 67, 74]], tail, cut=5.0, seed=60) * 1.4, button)
    for m, g in [(72, 0.22), (76, 0.18), (79, 0.18), (84, 0.14)]:
        add(send, pluck(midi(m), 1.2), button, g, 0.0)
    add(drums, kick(), button, 0.6)
    add(bass_bus, np.sin(2 * np.pi * midi(36) * t_axis(tail)) * env_ar(int(tail * SR), 0.01, 3), button, 0.45)

    pad_bus = send * pump[:, None]
    wet = reverb(pad_bus, 2.2, 0.55)
    mix = 0.55 * pad_bus + 0.45 * wet + dry + drums + bass_bus * pump[:, None]
    end = int(total * SR)
    mix = mix[:end]
    mix[-int(0.35 * SR) :] *= np.linspace(1, 0, int(0.35 * SR))[:, None] ** 2
    mix = np.tanh(mix * 1.4) / 1.4
    write(MUSIC_DIR / "bed.wav", mix, -3)
    print(
        f"music: {total:.2f}s, bar={bar:.3f}s ({240 / bar:.1f} bpm), drop={tl['drop']:.2f}s, "
        f"break={brk:.2f}s, button={button:.2f}s"
    )


if __name__ == "__main__":
    make_sfx()
    make_music()
    print("sfx:", ", ".join(sorted(p.stem for p in SFX_DIR.glob("*.wav"))))
