"""Cut explicit spans out of a recording, frame-exact, video and audio together (so lip sync cannot drift).

For generated clips whose pauses are full of breaths and clicks, silence detection keeps too much air; here the
spans to remove are chosen by hand from the audio envelope. Each audio join gets a 10 ms fade so it never clicks.

Writes <out>.mp4 and <out>.json in the same format as cut_by_words.py (segments: in/out in the source, `at` in
the output), so morph_cuts.py and the compositions read it unchanged.

usage: python cut_spans.py SRC.mp4 OUT_STEM T0-T1 [T0-T1 ...]
"""
import json
import subprocess
import sys

src, out, spans = sys.argv[1], sys.argv[2], sys.argv[3:]
fps = 30
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                           capture_output=True, text=True).stdout)
drops = sorted(tuple(round(float(x) * fps) / fps for x in s.split("-")) for s in spans)
keep, t = [], 0.0
for d0, d1 in drops:
    if d0 > t:
        keep.append((t, d0))
    t = max(t, d1)
end = int(dur * fps) / fps
if end > t:
    keep.append((t, end))

parts, chains, at = [], [], 0.0
for k, (a, b) in enumerate(keep):
    chains.append(f"[0:v]trim=start={a:.4f}:end={b:.4f},setpts=PTS-STARTPTS[v{k}];"
                  f"[0:a]atrim=start={a:.4f}:end={b:.4f},asetpts=PTS-STARTPTS,"
                  f"afade=t=in:d=0.01,afade=t=out:st={b - a - 0.01:.4f}:d=0.01[a{k}];")
    parts.append(f"[v{k}][a{k}]")
    at += b - a
fc = "".join(chains) + "".join(parts) + f"concat=n={len(keep)}:v=1:a=1[v][a]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p", "-r", str(fps),
                "-c:a", "aac", "-b:a", "320k", "-ar", "48000", out + ".mp4"], check=True)
segs, at = [], 0.0
for a, b in keep:
    segs.append({"in": round(a, 4), "out": round(b, 4), "at": round(at, 4)})
    at += b - a
json.dump({"src": src, "duration": round(at, 4), "segments": segs}, open(out + ".json", "w"), indent=1)
print(f"{len(keep)} segments, {at:.2f} s (from {dur:.2f} s)")
