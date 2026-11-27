"""UGC 17 edit decision list + audio stems, built from the real word timings.

    python scripts/ugc17_edl.py
      -> src/ugc17/edl.json                 beats, scene pieces, caption words (all in frames, 30 fps)
      -> public/ugc17/mix/voice.wav         Ethan VO + re-dubbed dialogue (the stem silencedetect checks)
      -> public/ugc17/mix/bed.wav           room tone of each scene + music bed (ducked under speech)
      -> reel/renders/ugc17/edl.md          the beat table with real times

Rules (UGC 17 brief): scenes trimmed to 0.08 s before the first word and 0.12 s after the last (S3 keeps 0.8 s for
Rachel's clock look); pauses inside a scene longer than 0.35 s are cut down to 0.2 s (the next piece gets a 1.06
punch-in); every dashboard beat is exactly as long as its voice-over; nothing waits between beats.
"""
import json, os, subprocess

FPS = 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
sw = json.load(open(P("src/ugc17/scene-words.json")))
vw = json.load(open(P("src/ugc17/vo-words.json")))
dub = json.load(open(P("src/ugc17/dub.json")))

SCRIPT = {  # the words as written; timings come from whisper token by token
    "s1": "Lakeside's asking where we are on the Bennett referral. No idea. Jenna handled that one, and Friday was her last day.",
    "s2": "Can you just text me Olivia's file? I'm running between rooms. From my phone? Yeah, that's a bad idea, isn't it.",
    "s3": "Doc, Olivia's pano is from 2023. Do we take a new one before her consult? Good question. Remind me after lunch.",
    "s4": "You're still here? Re-typing Dr. Ruiz's consult letter. Same letter, new patient name, every time.",
    "s5": "Daniel Ortiz is back for his cleaning. Did he ever have that implant done? I don't know. Nobody ever told us.",
    "e1": "Sound familiar? Here are five moments every specialist office knows, and how to handle each one.",
    "e2": "None of these are big problems on their own. Together, they're where referrals slip.",
    "e3": "The dashboard you just saw is Tooth Referral.",
    "hook": "Sound familiar? Here are five moments every specialist office knows, and how to handle each one.",
    "fix1": "When someone leaves, the referral shouldn't leave with them. Every update and message stays on the case, so it lives in the platform, not one person's head.",
    "fix2": "Texting X-rays from a personal phone is one of the most common HIPAA slip-ups. Keep it on the case, and open it from any browser.",
    "fix3": "Hallway questions disappear. Put it in a private note and tag the doctor. The answer waits on the case, and the other office never sees it.",
    "fix4": "Turn that Word letter into a template once. Patient and doctor details fill themselves in, the doctor signs digitally, and it goes straight back.",
    "fix5": "If a patient declines, mark it on the case with a short note. The referring dentist sees it the same day, not at the next recall.",
    "close": "None of these are big problems on their own. Together, they're where referrals slip. The dashboard you just saw is Tooth Referral.",
}
# Ethan is on camera for the hook (e1) and the close (e2, e3); the five fixes stay his voice-over over the glass dashboard
ORDER = ["s1", "e1", "fix1", "s2", "fix2", "s3", "fix3", "s4", "fix4", "s5", "fix5", "e2", "e3"]
SCENE = lambda k: k[0] in "se" and k[1:].isdigit()
SPEAKER = {k: v["who"] for k, v in dub.items()}


def words_of(key):
    raw = sw[f"{key}.wav"]["words"] if SCENE(key) else vw[f"vo-{key}.wav"]["words"]
    merged = []  # whisper splits hyphenated words ("Re -typing", "slip -ups"): join them back
    for r in raw:
        if merged and r["word"].strip().startswith("-"):
            merged[-1] = {**merged[-1], "word": merged[-1]["word"] + r["word"].strip(), "end": r["end"]}
        else:
            merged.append(dict(r))
    text = SCRIPT[key].split()
    raw = merged[:len(text)] if key == "e3" else merged  # e3: Flow repeats "the Tooth Referral", cut after the first
    assert len(text) == len(raw), (key, len(text), len(raw))
    return [{"w": t, "s": r["start"], "e": r["end"]} for t, r in zip(text, raw)]


def speaker_at(scene, t):
    for lid, d in dub.items():
        if d["scene"] == scene and d["at"] - 0.01 <= t <= d["end"] + 0.01:
            return d["who"]
    return "?"


def activity(scene):
    """Speech spans (clip seconds) measured on the re-dubbed lines themselves: 20 ms RMS above -36 dBFS.
    Whisper's first/last word times are off by up to 0.3 s, so trims and pause cuts use these instead."""
    import numpy as np
    spans = []
    for d in dub.values():
        if d["scene"] != scene:
            continue
        pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", P("public", d["file"]), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                                           capture_output=True).stdout, np.int16).astype(np.float32) / 32768
        hop = 320
        rms = np.sqrt(np.mean(pcm[: len(pcm) // hop * hop].reshape(-1, hop) ** 2, axis=1) + 1e-12)
        on = 20 * np.log10(rms) > -36
        i = 0
        while i < len(on):
            if on[i]:
                j = i
                while j < len(on) and on[j]: j += 1
                if j - i >= 2: spans.append((d["at"] + i * 0.02, d["at"] + j * 0.02))
                i = j
            else:
                i += 1
    spans.sort()
    merged = [list(spans[0])]
    for a, b in spans[1:]:
        if a - merged[-1][1] < 0.12: merged[-1][1] = max(merged[-1][1], b)
        else: merged.append([a, b])
    return merged


def pieces(scene, act):
    tail = 0.8 if scene == "s3" else 0.12
    a, out = act[0][0] - 0.06, []
    for (_, e0), (s1, _) in zip(act, act[1:]):
        if s1 - e0 > 0.22:  # brief: <= 0.35 s; tighter so silencedetect (d=0.25) stays clean
            out.append((a, e0 + 0.08)); a = s1 - 0.08
    out.append((a, act[-1][1] + tail))
    return out


def dur(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True).stdout)


f, beats, caps = 0, [], []
for key in ORDER:
    ws = words_of(key)
    if SCENE(key):
        ps, f0 = [], f
        act = activity(key)
        for w in ws:  # a word whisper starts in a measured pause really starts at the next speech onset
            if not any(s - 0.03 <= w["s"] <= e for s, e in act):
                nxt = [s for s, _ in act if s > w["s"]]
                if nxt: w["s"] = min(nxt[0], w["e"] - 0.05)
        for i, (a, b) in enumerate(pieces(key, act)):
            n = round((b - a) * FPS)
            ps.append({"a": round(a, 3), "b": round(a + n / FPS, 3), "f0": f, "f1": f + n, "punch": i % 2 == 1})
            f += n
        for w in ws:  # map clip time -> timeline frame through the pieces
            p = next(p for p in ps if p["a"] - 0.001 <= w["s"] <= p["b"] + 0.001)
            caps.append({"w": w["w"], "f": round(p["f0"] + (w["s"] - p["a"]) * FPS), "e": round(p["f0"] + (min(w["e"], p["b"]) - p["a"]) * FPS),
                         "beat": key, "who": speaker_at(key, w["s"])})
        beats.append({"id": key, "kind": "scene", "f0": f0, "f1": f, "pieces": ps})
    else:
        n = round(dur(P(f"public/ugc17/vo/vo-{key}.mp3")) * FPS)
        for w in ws:
            caps.append({"w": w["w"], "f": f + round(w["s"] * FPS), "e": f + round(w["e"] * FPS), "beat": key, "who": "ethan"})
        beats.append({"id": key, "kind": "vo", "f0": f, "f1": f + n, "words": [{"w": w["w"], "f": round(w["s"] * FPS)} for w in ws]})
        f += n
beats.append({"id": "end", "kind": "end", "f0": f, "f1": f + 60})
TOTAL = f + 60
json.dump({"fps": FPS, "total": TOTAL, "beats": beats, "captions": caps}, open(P("src/ugc17/edl.json"), "w"), indent=1)

# ------------------------------------------------------------------------------------------- audio stems
mix = P("public/ugc17/mix"); os.makedirs(mix, exist_ok=True)
tmp = P("tmp17"); T = TOTAL / FPS


def ff(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


# room tone per scene: the non-speech stretches of the Flow audio (voices excluded), looped
for sc in ["s1", "s2", "s3", "s4", "s5", "e1", "e2", "e3"]:
    ws = sw[f"{sc}.wav"]["words"]
    gaps, t = [], 0.05
    for w in ws:
        if w["start"] - 0.2 - t > 0.15: gaps.append((t, w["start"] - 0.2))
        t = w["end"] + 0.25
    if 7.95 - t > 0.15: gaps.append((t, 7.95))
    sel = "+".join(f"between(t,{a:.2f},{b:.2f})" for a, b in gaps)
    ff("-i", P(f"public/ugc17/{sc}.mp4"), "-vn", "-ac", "2", "-ar", "48000", "-af",
       f"aselect='{sel}',asetpts=N/SR/TB,highpass=f=60,afade=t=in:d=0.05", f"{tmp}/{sc}-rt0.wav")
    ff("-stream_loop", "-1", "-i", f"{tmp}/{sc}-rt0.wav", "-t", "40", "-af", "loudnorm=I=-34:TP=-9:LRA=7", "-ar", "48000", f"{tmp}/{sc}-rt.wav")

# voice stem: VO files at their beat start, dub lines at their timeline position (3-frame fades at both ends)
ins, fc, k = [], [], 0
for b in beats:
    if b["kind"] == "vo":
        ins += ["-i", P(f"public/ugc17/vo/vo-{b['id']}.mp3")]
        fc.append(f"[{k}]aresample=48000,adelay={round(b['f0'] / FPS * 1000)}:all=1[v{k}]"); k += 1
    elif b["kind"] == "scene":
        for lid, d in dub.items():
            if d["scene"] != b["id"]:
                continue
            for p in b["pieces"]:  # play the part of the line that falls inside each kept piece
                lo, hi = max(p["a"], d["at"]), min(p["b"], d["end"])
                if hi - lo < 0.02:
                    continue
                ins += ["-i", P("public", d["file"])]
                at = p["f0"] / FPS + (lo - p["a"])
                fc.append(f"[{k}]aresample=48000,atrim={lo - d['at']:.3f}:{hi - d['at']:.3f},asetpts=PTS-STARTPTS,"
                          f"afade=t=in:d=0.1,afade=t=out:st={max(0, hi - lo - 0.1):.3f}:d=0.1,adelay={round(at * 1000)}:all=1[v{k}]"); k += 1
fc.append("".join(f"[v{i}]" for i in range(k)) + f"amix=inputs={k}:normalize=0,apad=whole_dur={T:.3f},atrim=0:{T:.3f}[o]")
ff(*ins, "-filter_complex", ";".join(fc), "-map", "[o]", "-ac", "2", "-ar", "48000", f"{mix}/voice.wav")

# bed: room tone of the scene on screen (it carries on under the dashboard that follows), 6-frame crossfades, + music
scene_beats = [b for b in beats if b["kind"] == "scene"]
ins, fc = [], []
for i, b in enumerate(scene_beats):
    start = b["f0"] / FPS
    stop = scene_beats[i + 1]["f0"] / FPS if i + 1 < len(scene_beats) else T
    ins += ["-i", f"{tmp}/{b['id']}-rt.wav"]
    fc.append(f"[{i}]atrim=0:{stop - start + 0.2:.3f},afade=t=in:d=0.2,afade=t=out:st={stop - start:.3f}:d=0.2,"
              f"adelay={round(max(0, start - 0.1) * 1000)}:all=1[r{i}]")
n = len(scene_beats)
music = P("public/audio/music/s13-bed.wav")
ins += ["-stream_loop", "-1", "-i", music, "-i", f"{mix}/voice.wav"]
fc.append(f"[{n}]atrim=0:{T:.3f},loudnorm=I=-30:TP=-9:LRA=7,afade=t=in:d=1.5,afade=t=out:st={T - 2.2:.3f}:d=2.2[m0]")
fc.append(f"[{n + 1}]asplit[key][kv]")
fc.append("[m0][key]sidechaincompress=threshold=0.03:ratio=2.5:attack=40:release=350:makeup=1[m]")  # ~4 dB under speech
fc.append("[kv]anullsink")
fc.append("".join(f"[r{i}]" for i in range(n)) + f"[m]amix=inputs={n + 1}:normalize=0,apad=whole_dur={T:.3f},atrim=0:{T:.3f}[o]")
ff(*ins, "-filter_complex", ";".join(fc), "-map", "[o]", "-ac", "2", "-ar", "48000", f"{mix}/bed.wav")

# beat table
os.makedirs(P("renders/ugc17"), exist_ok=True)
NAME = {"e1": "HOOK (Ethan on camera)", "e2": "CLOSE (Ethan on camera)", "e3": "CLOSE (Ethan on camera)", "s1": "S1 cold open", "hook": "HOOK", "fix1": "FIX 1", "s2": "S2", "fix2": "FIX 2", "s3": "S3", "fix3": "FIX 3",
        "s4": "S4", "fix4": "FIX 4", "s5": "S5", "fix5": "FIX 5", "close": "CLOSE", "end": "END CARD"}
ts = lambda fr: f"{fr / FPS:5.2f}"
rows = ["# UGC 17 · Five moments every specialist office knows: edit decision list", "",
        f"Total {TOTAL} frames = {T:.2f} s at 30 fps. Times are the real beat boundaries, rebuilt from `vo-words.json` and `scene-words.json`.", "",
        "| Time (s) | Frames | Beat | Audio | Source |", "|---|---|---|---|---|"]
for b in beats:
    if b["kind"] == "scene":
        lines = " / ".join(f"{d['who'].title()}: {d['text']}" for d in dub.values() if d["scene"] == b["id"])
        src = ", ".join(f"{b['id']}.mp4 {p['a']:.2f}–{p['b']:.2f}{' (punch-in)' if p['punch'] else ''}" for p in b["pieces"])
    elif b["kind"] == "vo":
        lines, src = f"Ethan VO: {SCRIPT[b['id']]}", f"vo-{b['id']}.mp3 + glass dashboard"
    else:
        lines, src = "music tail", "end card"
    rows.append(f"| {ts(b['f0'])}–{ts(b['f1'])} | {b['f0']}–{b['f1']} | {NAME[b['id']]} | {lines} | {src} |")
open(P("renders/ugc17/edl.md"), "w", encoding="utf8").write("\n".join(rows) + "\n")
print("total", TOTAL, "frames", f"{T:.2f}s")
for b in beats:
    print(f"{b['id']:6s} {b['f0']:5d}-{b['f1']:5d}  {ts(b['f0'])}-{ts(b['f1'])}")
