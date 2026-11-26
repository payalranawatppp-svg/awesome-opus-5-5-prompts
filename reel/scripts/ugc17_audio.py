"""UGC 17 audio: Ethan's voice-over (ElevenLabs TTS) and the line-by-line re-dub of every Flow scene (speech-to-speech).

    python scripts/ugc17_audio.py vo     -> public/ugc17/vo/vo-*.mp3 (silence trimmed to 40 ms)
    python scripts/ugc17_audio.py dub    -> public/ugc17/dub/sN-NN-name.mp3 + src/ugc17/dub.json
    python scripts/ugc17_audio.py dub s3-01 --seed 11   -> redo one line

Key comes from ELEVENLABS_API_KEY (never printed or written anywhere).
"""
import json, os, subprocess, sys, urllib.request, uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICES = json.load(open(f"{ROOT}/src/ugc17/voices.json"))
VO = {
    "hook": "Sound familiar? Here are five moments every specialist office knows, and how to handle each one.",
    "fix1": "When someone leaves, the referral shouldn't leave with them. Every update and message stays on the case, so it lives in the platform, not one person's head.",
    "fix2": "Texting X-rays from a personal phone is one of the most common HIPAA slip-ups. Keep it on the case, and open it from any browser.",
    "fix3": "Hallway questions disappear. Put it in a private note and tag the doctor. The answer waits on the case, and the other office never sees it.",
    "fix4": "Turn that Word letter into a template once. Patient and doctor details fill themselves in, the doctor signs digitally, and it goes straight back.",
    "fix5": "If a patient declines, mark it on the case with a short note. The referring dentist sees it the same day, not at the next recall.",
    "close": "None of these are big problems on their own. Together, they're where referrals slip. The dashboard you just saw is Tooth Referral.",
}
# (scene, line no, character, first word idx, last word idx) into scene-words.json
LINES = [
    ("s1", 1, "kevin", 0, 8), ("s1", 2, "rachel", 9, 20),
    ("s2", 1, "ruiz", 0, 10), ("s2", 2, "rachel", 11, 13), ("s2", 3, "ruiz", 14, 20),
    ("s3", 1, "rachel", 0, 14), ("s3", 2, "ruiz", 15, 20),
    ("s4", 1, "kevin", 0, 2), ("s4", 2, "rachel", 3, 15),
    ("s5", 1, "whitaker", 0, 13), ("s5", 2, "megan", 14, 20),
    # Ethan on camera (hook + close), re-voiced to his VO voice; e3 stops after the first "Tooth Referral" (Flow repeated it)
    ("e1", 1, "ethan", 0, 15), ("e2", 1, "ethan", 0, 13), ("e3", 1, "ethan", 0, 7),
]


def post(url, body, ctype):
    req = urllib.request.Request(url, data=body, method="POST", headers={"xi-api-key": KEY, "Content-Type": ctype})
    with urllib.request.urlopen(req, timeout=300) as r:
        return r.read()


def multipart(fields, file_field, path):
    b = uuid.uuid4().hex
    out = b""
    for k, v in fields.items():
        out += f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
    out += f"--{b}\r\nContent-Disposition: form-data; name=\"{file_field}\"; filename=\"a.wav\"\r\nContent-Type: audio/wav\r\n\r\n".encode()
    out += open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    return out, f"multipart/form-data; boundary={b}"


def ff(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def tts(text, voice, out, seed=1):
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2", "seed": seed,
                       "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.35,
                                          "use_speaker_boost": True, "speed": 1.05}}).encode()
    raw = post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128", body, "application/json")
    open(out + ".raw.mp3", "wb").write(raw)
    # trim leading/trailing silence, then keep 40 ms of air at both ends
    ff("-i", out + ".raw.mp3", "-af",
       "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
       "adelay=40:all=1,apad=pad_dur=0.04", "-ar", "44100", "-b:a", "128k", out)
    os.remove(out + ".raw.mp3")


def do_vo(only=None, seed=1):
    os.makedirs(f"{ROOT}/public/ugc17/vo", exist_ok=True)
    for k, t in VO.items():
        if only and k != only:
            continue
        tts(t, VOICES["ethan"], f"{ROOT}/public/ugc17/vo/vo-{k}.mp3", seed)
        print("vo", k)


def do_dub(only=None, seed=7):
    words = json.load(open(f"{ROOT}/src/ugc17/scene-words.json"))
    os.makedirs(f"{ROOT}/public/ugc17/dub", exist_ok=True)
    tmp = f"{ROOT}/tmp17"
    mp = json.load(open(f"{ROOT}/src/ugc17/dub.json")) if os.path.exists(f"{ROOT}/src/ugc17/dub.json") else {}
    for sc, n, who, i0, i1 in LINES:
        lid = f"{sc}-{n:02d}"
        if only and lid != only:
            continue
        w = words[f"{sc}.wav"]["words"]
        # generous air around the line: speech-to-speech drops words that touch the segment edge
        prev_end = w[i0 - 1]["end"] if i0 > 0 else 0.0
        next_start = w[i1 + 1]["start"] if i1 + 1 < len(w) else 8.04
        a = max(0.0, w[i0]["start"] - min(0.3, (w[i0]["start"] - prev_end) - 0.04))
        b = w[i1]["end"] + min(0.4, (next_start - w[i1]["end"]) - 0.04)
        seg = f"{tmp}/{lid}.wav"
        # plus 0.5 s of digital silence each side (the model swallows a final word with no air after it); removed below
        ff("-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", f"{ROOT}/public/ugc17/{sc}.mp4", "-vn", "-ac", "1", "-ar", "44100",
           "-af", "adelay=500:all=1,apad=pad_dur=0.5", seg)
        body, ct = multipart({"model_id": "eleven_multilingual_sts_v2", "remove_background_noise": "true", "seed": str(seed),
                              "voice_settings": json.dumps({"stability": 0.55, "similarity_boost": 0.85, "style": 0,
                                                            "use_speaker_boost": True})}, "audio", seg)
        raw = post(f"https://api.elevenlabs.io/v1/speech-to-speech/{VOICES[who]}?output_format=mp3_44100_128", body, ct)
        out = f"{ROOT}/public/ugc17/dub/{lid}-{who}.mp3"
        open(out + ".raw.mp3", "wb").write(raw)
        # loudness-match every line to -16 LUFS
        ff("-ss", "0.5", "-t", f"{b - a:.3f}", "-i", out + ".raw.mp3", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100",
           "-b:a", "128k", out)
        os.remove(out + ".raw.mp3")
        mp[lid] = {"scene": sc, "who": who, "file": f"ugc17/dub/{lid}-{who}.mp3", "at": round(a, 3), "end": round(b, 3),
                   "text": " ".join(x["word"].strip() for x in w[i0:i1 + 1]), "seed": seed}
        print("dub", lid, who)
    json.dump(mp, open(f"{ROOT}/src/ugc17/dub.json", "w"), indent=1)


if __name__ == "__main__" and sys.argv[1] in ("vo", "dub"):
    mode = sys.argv[1]
    only = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else None
    seed = int(sys.argv[sys.argv.index("--seed") + 1]) if "--seed" in sys.argv else (1 if mode == "vo" else 7)
    (do_vo if mode == "vo" else do_dub)(only, seed)


def tts_line(lid, text, seed=3):
    """Fallback when speech-to-speech keeps a word the Flow clip mispronounced: TTS in the same voice, time-stretched
    (max +-8 %) so its spoken span matches the original line, placed with its first word on the original first word."""
    from faster_whisper import WhisperModel
    mp = json.load(open(f"{ROOT}/src/ugc17/dub.json"))
    d = mp[lid]
    sw = json.load(open(f"{ROOT}/src/ugc17/scene-words.json"))[f"{d['scene']}.wav"]["words"]
    lw = [w for w in sw if d["at"] - 0.01 <= w["start"] and w["end"] <= d["end"] + 0.01]
    span = lw[-1]["end"] - lw[0]["start"]
    tmp = f"{ROOT}/tmp17/{lid}-tts.mp3"
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2", "seed": seed,
                       "voice_settings": {"stability": 0.55, "similarity_boost": 0.85, "style": 0.2, "use_speaker_boost": True}}).encode()
    open(tmp, "wb").write(post(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICES[d['who']]}?output_format=mp3_44100_128", body, "application/json"))
    ff("-i", tmp, "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
       "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", tmp + ".wav")
    m = WhisperModel("medium.en", device="cpu", compute_type="int8")
    import wave, numpy as np
    with wave.open(tmp + ".wav") as wf:
        pcm = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768.0
    segs, _ = m.transcribe(pcm, word_timestamps=True, language="en")
    tw = [w for s in segs for w in s.words]
    assert len(tw) == len(lw), (len(tw), len(lw))
    # align sentence by sentence: each piece is stretched (max +-8 %) to its own span and starts on its original first word
    cuts = [i + 1 for i, w in enumerate(lw[:-1]) if w["word"].strip()[-1] in ".?!,"]
    groups = list(zip([0] + cuts, cuts + [len(lw)]))
    raw = tmp + ".wav"
    parts, tempos = [], []
    for k, (i, j) in enumerate(groups):
        t0 = tw[i].start - (0.03 if i else 0.0)
        t1 = tw[j].start - 0.03 if j < len(tw) else tw[-1].end + 0.08
        tempo = max(0.92, min(1.08, (tw[j - 1].end - tw[i].start) / (lw[j - 1]["end"] - lw[i]["start"])))
        tempos.append(round(tempo, 3))
        pf = f"{ROOT}/tmp17/{lid}-p{k}.wav"
        ff("-i", raw, "-af", f"atrim={max(0, t0):.3f}:{t1:.3f},asetpts=PTS-STARTPTS,atempo={tempo:.4f}", "-ar", "44100", pf)
        parts.append((pf, lw[i]["start"] - d["at"] - (0.03 if i else 0.0) / tempo))
    out = f"{ROOT}/public/{d['file']}"
    ins = sum((["-i", pf] for pf, _ in parts), [])
    fc = "".join(f"[{n}]adelay={int(max(0, at) * 1000)}:all=1[p{n}];" for n, (_, at) in enumerate(parts))
    fc += "".join(f"[p{n}]" for n in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0,apad=pad_dur=1,atrim=0:{d['end'] - d['at']:.3f},loudnorm=I=-16:TP=-1.5:LRA=11[o]"
    ff(*ins, "-filter_complex", fc, "-map", "[o]", "-ar", "44100", "-b:a", "128k", out)
    tempo = tempos
    d.update({"tts": True, "tempo": tempo, "text": text})
    json.dump(mp, open(f"{ROOT}/src/ugc17/dub.json", "w"), indent=1)
    print("tts", lid, "tempo", tempo, " ".join(w.word for w in tw))


if __name__ == "__main__" and sys.argv[1] == "ttsline":
    tts_line(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 3)


def splice_word(lid, sentence, word, seed=3):
    """Keep the speech-to-speech take (exact lip-sync) and replace only its last word, which the Flow actor misspoke,
    with that word cut from a TTS take of `sentence` in the same voice (S3: "console" -> "consult")."""
    import wave, numpy as np
    from faster_whisper import WhisperModel
    mp = json.load(open(f"{ROOT}/src/ugc17/dub.json")); d = mp[lid]
    do_dub(lid, d.get("seed", 7)); mp = json.load(open(f"{ROOT}/src/ugc17/dub.json")); d = mp[lid]
    sw = json.load(open(f"{ROOT}/src/ugc17/scene-words.json"))[f"{d['scene']}.wav"]["words"]
    last = [w for w in sw if w["end"] <= d["end"] + 0.01][-1]
    tmp = f"{ROOT}/tmp17/{lid}-w"
    body = json.dumps({"text": sentence, "model_id": "eleven_multilingual_v2", "seed": seed,
                       "voice_settings": {"stability": 0.55, "similarity_boost": 0.85, "style": 0.2, "use_speaker_boost": True}}).encode()
    open(tmp + ".mp3", "wb").write(post(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICES[d['who']]}?output_format=mp3_44100_128", body, "application/json"))
    ff("-i", tmp + ".mp3", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", tmp + "16.wav")
    with wave.open(tmp + "16.wav") as wf:
        pcm = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768.0
    tw = [w for s in WhisperModel("medium.en", device="cpu", compute_type="int8").transcribe(pcm, word_timestamps=True, language="en")[0] for w in s.words]
    tword = [w for w in tw if norm(w.word) == norm(word)][-1]
    cut = last["start"] - d["at"] - 0.07  # (whisper starts a word late) where the misspoken word starts inside the line file
    out = f"{ROOT}/public/{d['file']}"
    ff("-i", out, "-i", tmp + ".mp3", "-filter_complex",
       f"[0]atrim=0:{cut + 0.02:.3f},afade=t=out:st={cut - 0.01:.3f}:d=0.03[a];"
       f"[1]atrim={tword.start - 0.02:.3f}:{tword.end + 0.12:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,aresample=44100,"
       f"loudnorm=I=-16:TP=-1.5:LRA=11[b];[a][b]concat=n=2:v=0:a=1,apad=pad_dur=0.3[o]", "-map", "[o]", "-ar", "44100", "-b:a", "128k", out + ".s.mp3")
    os.replace(out + ".s.mp3", out)
    d.update({"spliced": word, "text": d["text"].rsplit(" ", 1)[0] + " " + word + "?"})
    json.dump(mp, open(f"{ROOT}/src/ugc17/dub.json", "w"), indent=1)
    print("spliced", lid, word)


norm = lambda t: "".join(c for c in t.lower() if c.isalnum())

if __name__ == "__main__" and sys.argv[1] == "splice":
    splice_word(sys.argv[2], sys.argv[3], sys.argv[4])


def tighten(path, keep=0.16, noise="-38dB", min_gap=0.2):
    """Shorten every pause inside a voice file to `keep` s (the brief allows no silence >= 0.25 s)."""
    import re
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"silencedetect=noise={noise}:d={min_gap}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    total = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True).stdout)
    keep_spans, t = [], 0.0
    for a, b in zip(st, en):
        if a < 0.05 or b > total - 0.05:  # lead/trail air is handled by the 40 ms trim
            continue
        keep_spans.append((t, a + keep / 2)); t = b - keep / 2
    keep_spans.append((t, total))
    if len(keep_spans) == 1:
        return 0
    fc = "".join(f"[0]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={max(0, b - a - 0.01):.3f}:d=0.01[p{i}];"
                 for i, (a, b) in enumerate(keep_spans))
    fc += "".join(f"[p{i}]" for i in range(len(keep_spans))) + f"concat=n={len(keep_spans)}:v=0:a=1[o]"
    ff("-i", path, "-filter_complex", fc, "-map", "[o]", "-ar", "44100", "-b:a", "128k", path + ".t.mp3")
    os.replace(path + ".t.mp3", path)
    return len(keep_spans) - 1


if __name__ == "__main__" and sys.argv[1] == "tighten":
    for p in sys.argv[2:]:
        print(p, "pauses shortened:", tighten(p))
