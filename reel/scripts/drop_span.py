"""Remove one span of frames from an already-built talent (footage, cutout, matte, voice, hand/face tracks, transcript,
cut segments), so a line can be dropped after the matte and voice are made, without redoing them.

usage: python drop_span.py ID A B   (A, B: output frames at 30 fps; frames A..B-1 are removed)
"""
import json, subprocess, sys, wave
import numpy as np

tid, A, B = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
n = B - A
ta, tb = A / 30, B / 30
sel = f"select='not(between(n\\,{A}\\,{B - 1}))',setpts=N/30/TB"


def vid(src, args):
    tmp = src + ".tmp" + src[src.rfind("."):]
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", src, "-vf", sel, "-an", *args, tmp], check=True)
    subprocess.run(["mv", tmp, src], check=True)


vid(f"public/footage/{tid}.webm", ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "18", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4"])
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-c:v", "libvpx-vp9", "-i", f"public/cutouts/{tid}.webm", "-vf", sel, "-an",
                "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "22", "-row-mt", "1", "-auto-alt-ref", "0", "-deadline", "good",
                "-cpu-used", "4", f"public/cutouts/{tid}.tmp.webm"], check=True)
subprocess.run(["mv", f"public/cutouts/{tid}.tmp.webm", f"public/cutouts/{tid}.webm"], check=True)
vid(f"public/cutouts/{tid}-matte.mp4", ["-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p"])

# voice: cut at the same times with a 12 ms crossfade
p = f"public/audio/voice/{tid}.wav"
w = wave.open(p); sr = w.getframerate(); ch = w.getnchannels(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32).reshape(-1, ch); w.close()
i0, i1 = int(ta * sr), int(tb * sr); f = int(0.012 * sr); r = np.linspace(0, 1, f)[:, None]
head, tail = a[:i0].copy(), a[i1:].copy()
head[-f:] = head[-f:] * (1 - r) + tail[:f] * r
out = np.concatenate([head, tail[f:]])
w = wave.open(p, "wb"); w.setnchannels(ch); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(out, -32767, 32767).astype(np.int16).tobytes()); w.close()

key = {"ms-cut": "ms"}.get(tid, tid)
h = json.load(open(f"src/data/hands-{key}.json")); h["frames"] = h["frames"][:A] + h["frames"][B:]; json.dump(h, open(f"src/data/hands-{key}.json", "w"))
fc = json.load(open("src/data/faces.json"))
for k in list(fc):
    if k == tid or k.startswith(tid + "-"):
        fc[k]["faces"] = fc[k]["faces"][:A] + fc[k]["faces"][B:]
json.dump(fc, open("src/data/faces.json", "w"))
tr = json.load(open(f"src/data/transcript-{key}.json"))
ws = []
for x in tr[tid]["words"]:
    if x["start"] >= ta - 0.02 and x["end"] <= tb + 0.02:
        continue
    if x["start"] >= tb:
        x = {**x, "start": round(x["start"] - (tb - ta), 3), "end": round(x["end"] - (tb - ta), 3)}
    ws.append(x)
tr[tid]["words"] = ws; tr[tid]["text"] = " ".join(x["word"].strip() for x in ws)
json.dump(tr, open(f"src/data/transcript-{key}.json", "w"), indent=1)
cs = json.load(open(f"src/data/{key}-cut-segments.json"))
for sgm in cs["segments"]:
    if sgm["at"] >= tb - 0.001:
        sgm["at"] = round(sgm["at"] - (tb - ta), 4)
cs["duration"] = round(cs["duration"] - (tb - ta), 4)
json.dump(cs, open(f"src/data/{key}-cut-segments.json", "w"), indent=1)
print(f"dropped {n} frames ({ta:.2f}-{tb:.2f} s); new duration {cs['duration']} s")
