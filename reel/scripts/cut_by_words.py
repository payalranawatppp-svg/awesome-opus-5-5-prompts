"""Tighten one long talking-head recording: remove dead air and flubs, never cutting inside a word.

A pause is cut when ffmpeg silencedetect hears silence there AND no transcribed word starts inside it. Each cut
pause keeps the air a speaker would naturally leave, set by the punctuation of the word before it: --air-stop
after . ? !, --air-comma after , ; : and --residual inside a phrase (split around the cut so breaths land
naturally). Pauses in --hold keep a longer, deliberate beat (for a dramatic "...and in return..."). --drop removes
explicit spans (a stumble, a repeated word); a drop next to a pause is merged into it, so the stumble and the dead
air go together and the pause before the next word still gets its natural length. Video and audio are cut together
from the same file, so lip sync cannot drift.

Writes <out>.mp4 and <out>.json (segments: in/out in the source, `at` in the output).

usage: python cut_by_words.py SRC.mp4 TRANSCRIPT.json OUT_STEM [--start S] [--keep-gap 0.4] [--residual 0.16]
           [--hold T:SECONDS ...] [--drop T0-T1 ...]
"""
import argparse
import json
import re
import subprocess

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("transcript")
ap.add_argument("out")
ap.add_argument("--start", type=float, default=0.0, help="ignore everything before this (leader)")
ap.add_argument("--keep-gap", type=float, default=0.40)
ap.add_argument("--residual", type=float, default=0.14, help="air kept for a pause inside a phrase")
ap.add_argument("--air-comma", type=float, default=0.26, help="air kept after , ; :")
ap.add_argument("--min-cut", type=float, default=0.2, help="skip cuts that would remove less than this")
ap.add_argument("--air-stop", type=float, default=0.42, help="air kept after . ? !")
ap.add_argument("--noise", type=float, default=-38)
ap.add_argument("--blip", type=float, default=0.35, help="sounds shorter than this between silences (a breath, a click) are not speech, unless a word lies there")
ap.add_argument("--hold", nargs="*", default=[], help="T:S, the pause containing time T keeps S seconds")
ap.add_argument("--drop", nargs="*", default=[], help="T0-T1, remove this span outright")
a = ap.parse_args()

fps = 30.0
SR = int(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=sample_rate", "-of", "csv=p=0", a.src],
                        capture_output=True, text=True).stdout)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.src],
                           capture_output=True, text=True).stdout)
err = subprocess.run(["ffmpeg", "-i", a.src, "-af", f"silencedetect=noise={a.noise}dB:d=0.12", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", err)]
en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", err)]
sil = list(zip(st, en + [dur] * (len(st) - len(en))))
# merge silences separated by short blips (a breath, a lip click, a mic tick): they are not words
merged = []
for s, e in sil:
    if merged and s - merged[-1][1] < a.blip:
        merged[-1][1] = e
    else:
        merged.append([s, e])

words = next(iter(json.load(open(a.transcript)).values()))["words"]
spans = [(w["start"], w["end"]) for w in words]
texts = [w["word"].strip() for w in words]
holds = [tuple(map(float, h.split(":"))) for h in a.hold]
drops = [tuple(map(float, d.split("-"))) for d in a.drop]
# words inside a dropped span (the stumble itself) protect nothing
keep_w = [i for i, (ws, we) in enumerate(spans) if not any(d0 - 0.05 <= ws <= d1 for d0, d1 in drops)]
texts = [texts[i] for i in keep_w]
spans = [spans[i] for i in keep_w]
# merge each drop with a pause that touches it (within 0.3 s): they are removed as one piece of dead air
dropped_in = []
for d0, d1 in drops:
    for m in merged:
        if m[0] - 0.3 <= d1 and d0 <= m[1] + 0.3:
            m[0], m[1] = min(m[0], d0), max(m[1], d1)
            dropped_in.append(m)
            break
    else:
        merged.append([d0, d1])
        dropped_in.append(merged[-1])
merged.sort()


def air_for(s):
    """Natural pause after the last word that starts before s, from its punctuation."""
    prev = [t for (ws, we), t in zip(spans, texts) if ws < s + 0.05]
    if not prev:
        return a.residual
    end = prev[-1][-1:]
    return a.air_stop if end in ".?!" else a.air_comma if end in ",;:" else a.residual


def overlaps_word(s, e):
    # a pause is protected only if a whole word lies inside it (quiet speech we must keep): whisper often
    # stretches a word's end into the silence after it or starts the next word early, and silencedetect has
    # already heard that there is no speech in the span
    return any(s + 0.05 < ws and we < e - 0.05 for ws, we in spans)


cuts = []  # (cut_from, cut_to) in source seconds
for m in merged:
    s, e = max(m[0], a.start), m[1]
    is_drop = any(m is d for d in dropped_in)
    if not is_drop and (e - s < a.keep_gap or overlaps_word(s, e)):
        continue
    keep = air_for(s)
    for t, k in holds:
        if s - 0.2 <= t <= e + 0.2:
            keep = k
    gap = e - s
    if is_drop:
        # the span ends in the stumble itself, so all the air goes before it
        cuts.append((s + min(keep, gap), e))
        continue
    if gap <= keep + 0.05:
        continue
    # a cut that removes almost nothing is a visible jump in the picture for no gain in pace
    if gap - keep < a.min_cut:
        continue
    # leave 40% of the kept air after the last word, 60% before the next one
    cuts.append((s + keep * 0.4, e - keep * 0.6))
cuts.append((0.0, a.start))
cuts.sort()
# keep = complement of cuts
segs, t = [], 0.0
for c0, c1 in cuts:
    if c0 > t:
        segs.append([t, c0])
    t = max(t, c1)
if t < dur:
    segs.append([t, dur])
# frame grid and drop slivers
out = []
for s, e in segs:
    s = round(s * fps) / fps
    e = round(e * fps) / fps
    if e - s >= 2 / fps:
        out.append({"in": round(s, 4), "out": round(e, 4)})
t = 0.0
for sg in out:
    sg["at"] = round(t, 4)
    t += sg["out"] - sg["in"]

parts, labels = [], []
for i, sg in enumerate(out):
    d = sg["out"] - sg["in"]
    # exact frame and sample indices on both sides, so the picture and the sound can never drift apart
    f0, f1 = round(sg["in"] * fps), round(sg["out"] * fps)
    s0, s1 = round(f0 / fps * SR), round(f1 / fps * SR)
    parts.append(
        f"[0:v]trim=start_frame={f0}:end_frame={f1},setpts=PTS-STARTPTS[v{i}];"
        f"[0:a]atrim=start_sample={s0}:end_sample={s1},asetpts=PTS-STARTPTS,"
        f"afade=t=in:d=0.006,afade=t=out:st={max(0, d - 0.01):.4f}:d=0.01[a{i}];"
    )
    labels.append(f"[v{i}][a{i}]")
graph = "".join(parts) + "".join(labels) + f"concat=n={len(out)}:v=1:a=1[v][a]"
with open(a.out + ".graph", "w") as f:
    f.write(graph)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.src, "-filter_complex_script", a.out + ".graph", "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k",
                a.out + ".mp4"], check=True)
with open(a.out + ".json", "w") as f:
    json.dump({"src": a.src, "duration": round(t, 4), "segments": out}, f, indent=1)
print(f"{len(out)} segments, {t:.2f} s (from {dur - a.start:.2f} s)")
