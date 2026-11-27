"""Lip-sync check for the UGC 17 re-dub: every re-voiced word start vs the Flow word start (frames at 30 fps)."""
import json, subprocess, wave, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("medium.en", device="cpu", compute_type="int8")
dub = json.load(open("src/ugc17/dub.json")); sw = json.load(open("src/ugc17/scene-words.json"))
norm = lambda t: "".join(c for c in t.lower() if c.isalnum())
worst = 0
for lid, d in dub.items():
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"public/{d['file']}", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", "tmp17/ls.wav"], check=True)
    with wave.open("tmp17/ls.wav") as wf:
        pcm = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768.0
    segs, _ = m.transcribe(pcm, word_timestamps=True, language="en")
    got = [w for s in segs for w in s.words]
    ref = [w for w in sw[f"{d['scene']}.wav"]["words"] if d["at"] - 0.01 <= w["start"] and w["end"] <= d["end"] + 0.01]
    offs = [round((g.start + d["at"] - r["start"]) * 30, 1) for g, r in zip(got, ref)]
    worst = max(worst, max(map(abs, offs)))
    print(lid, d["who"], "|", " ".join(w.word.strip() for w in got), "| frames", offs)
print("worst", worst)
