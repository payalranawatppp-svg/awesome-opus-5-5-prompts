"""Check an ElevenLabs speech-to-speech take against the original clip audio.

    python scripts/verify_voice.py ORIGINAL.wav NEW.(wav|mp3) [--transcribe]

Reports the timing offset (amplitude-envelope cross-correlation, 5 ms resolution) and
envelope correlation, so a re-voiced take can be proven to keep the original lip sync.
With --transcribe it also runs faster-whisper on the new take and diffs the words
against the original transcript. Requires numpy, ffmpeg (+ faster-whisper for words).
"""
import re
import subprocess
import sys

import numpy as np

SR = 16000


def load(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def envelope(a, hop=80):  # 5 ms
    n = len(a) // hop
    e = np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(1))
    e = 20 * np.log10(e + 1e-5)
    return np.clip(e, -60, 0) + 60


orig, new = load(sys.argv[1]), load(sys.argv[2])
eo, en = envelope(orig), envelope(new)
n = min(len(eo), len(en))
eo, en = eo[:n] - eo[:n].mean(), en[:n] - en[:n].mean()
lags = range(-40, 41)  # ±200 ms
scores = [np.dot(eo[max(0, -l) : n - max(0, l)], en[max(0, l) : n - max(0, -l)]) for l in lags]
best = list(lags)[int(np.argmax(scores))]
corr = max(scores) / (np.linalg.norm(eo) * np.linalg.norm(en))
print(f"duration orig {len(orig) / SR:.3f}s new {len(new) / SR:.3f}s")
print(f"timing offset (new vs orig): {best * 5:+d} ms   envelope correlation {corr:.2f}")

if "--transcribe" in sys.argv:
    from faster_whisper import WhisperModel

    model = WhisperModel("medium.en", device="cpu", compute_type="int8")
    norm = lambda s: re.sub(r"[^a-z' ]", "", s.lower()).split()
    texts = []
    for a in (orig, new):
        segs, _ = model.transcribe(a, language="en", beam_size=5)
        texts.append(" ".join(s.text.strip() for s in segs))
    print("orig:", texts[0])
    print("new: ", texts[1])
    wo, wn = norm(texts[0]), norm(texts[1])
    print("WORDS MATCH" if wo == wn else f"WORD DIFF: {sorted(set(wo) ^ set(wn))}")
