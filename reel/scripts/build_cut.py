"""Join talking-head takes into one continuous clip with the dead air removed.

Speech regions come from ffmpeg silencedetect. Pauses shorter than --keep-gap stay in (natural rhythm,
no visible jump); longer pauses and the silent heads/tails of each take are cut, leaving --pad-in /
--pad-out of air around the words. Cuts are snapped to the source frame grid, and every audio piece gets
a few ms fade so the joins never click.

Writes <out>.mp4 (H.264 + AAC) and <out>.json (the segment list: source clip, in, out, and where each lands
in the output, which the edit uses to alternate the framing on every cut).

usage: python build_cut.py <out-stem> <clip1> <clip2> ... [--keep-gap 0.45] [--noise -38]
"""
import argparse
import json
import re
import subprocess

ap = argparse.ArgumentParser()
ap.add_argument("out")
ap.add_argument("clips", nargs="+")
ap.add_argument("--keep-gap", type=float, default=0.45, help="pauses shorter than this stay in (s)")
ap.add_argument("--noise", type=float, default=-38, help="silence threshold (dB)")
ap.add_argument("--pad-in", type=float, default=0.06)
ap.add_argument("--pad-out", type=float, default=0.10)
ap.add_argument("--transcript", help="faster-whisper JSON (scripts/transcribe.py) keyed by clip stem; speech outside the\n    first..last word of each take (breaths, room noise) is dropped")
a = ap.parse_args()
words = json.load(open(a.transcript)) if a.transcript else {}


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate:format=duration",
         "-of", "json", path], capture_output=True, text=True, check=True).stdout
    j = json.loads(out)
    num, den = j["streams"][0]["r_frame_rate"].split("/")
    return float(j["format"]["duration"]), float(num) / float(den)


def silences(path):
    err = subprocess.run(
        ["ffmpeg", "-i", path, "-af", f"silencedetect=noise={a.noise}dB:d=0.15", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", err)]
    return list(zip(starts, ends + [None] * (len(starts) - len(ends))))


segments = []
for ci, clip in enumerate(a.clips):
    dur, fps = probe(clip)
    sil = [(s, e if e is not None else dur) for s, e in silences(clip)]
    # speech = complement of silences
    speech, t = [], 0.0
    for s, e in sil:
        if s > t:
            speech.append([t, s])
        t = max(t, e)
    if t < dur:
        speech.append([t, dur])
    # drop clicks, breaths and noise blips first, then merge across short pauses
    speech = [r for r in speech if r[1] - r[0] > 0.25]
    stem = clip.rsplit("/", 1)[-1].rsplit(".", 1)[0]
    w = next((v["words"] for k, v in words.items() if k.rsplit(".", 1)[0] == stem), None)
    if w:
        lo, hi = w[0]["end"] - 0.05, w[-1]["start"] + 0.05  # whisper's outer word edges drift; inner ones don't
        speech = [[max(s0, 0.0), e0] for s0, e0 in speech if e0 > lo and s0 < hi]
    merged = []
    for s, e in speech:
        if merged and s - merged[-1][1] < a.keep_gap:
            merged[-1][1] = e
        else:
            merged.append([s, e])
    for s, e in merged:
        s = max(0.0, s - a.pad_in)
        e = min(dur, e + a.pad_out)
        s = int(s * fps) / fps  # frame grid
        e = round(e * fps) / fps
        segments.append({"clip": ci, "src": clip, "in": round(s, 4), "out": round(e, 4), "fps": fps})

t = 0.0
for sg in segments:
    sg["at"] = round(t, 4)
    t += sg["out"] - sg["in"]

parts, labels = [], []
for i, sg in enumerate(segments):
    d = sg["out"] - sg["in"]
    parts.append(
        f"[{sg['clip']}:v]trim=start={sg['in']}:end={sg['out']},setpts=PTS-STARTPTS[v{i}];"
        f"[{sg['clip']}:a]atrim=start={sg['in']}:end={sg['out']},asetpts=PTS-STARTPTS,"
        f"afade=t=in:d=0.008,afade=t=out:st={d - 0.012:.4f}:d=0.012[a{i}];"
    )
    labels.append(f"[v{i}][a{i}]")
graph = "".join(parts) + "".join(labels) + f"concat=n={len(segments)}:v=1:a=1[v][a]"
cmd = ["ffmpeg", "-v", "error", "-y"]
for clip in a.clips:
    cmd += ["-i", clip]
cmd += ["-filter_complex", graph, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "14", "-preset", "slow",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", f"{a.out}.mp4"]
subprocess.run(cmd, check=True)
with open(f"{a.out}.json", "w") as f:
    json.dump({"duration": round(t, 4), "segments": segments}, f, indent=1)
print(f"{len(segments)} segments, {t:.2f} s")
