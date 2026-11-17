"""Buried in Emails v1: a brand-new dialogue track, every line generated from scratch with ElevenLabs eleven_v4
(no original audio, no speech-to-speech, no sound effects). Tanya = Matilda, Amanda = Jessica (the same voices as
Buried in Emails v2, so the characters match across the week). Each line is placed at the moment the character speaks
on screen (word timings in src/data/transcript-s13.json) and fitted to the time before the next line.
usage: ELEVENLABS_API_KEY=... python scripts/bie_redub.py  -> public/audio/voice/s13-dub.wav. Never commit the key."""
import json, os, subprocess, sys, tempfile, urllib.request
import numpy as np, soundfile as sf, librosa

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE = {"T": "XrExE9yKIg1WjnnlVkGX", "A": "cgSgspJ2msm6clMCkdW9"}
SR = 48000
TMP = os.environ.get("BIE_TMP", tempfile.mkdtemp())
# lip timings of the footage (the original takes); transcript-s13.json is re-timed to this track afterwards
W = json.load(open(os.path.join(ROOT, "src/data/transcript-s13-lips.json")))["s13"]["words"]
END = 70.187

# (speaker, first word index, last word index, text with delivery tags)
LINES = [
    ("A", 0, 6, "[concerned] [quickly] Hey, what happened? You look really stressed."),
    ("T", 7, 12, "[frustrated] We lost eight referrals this month."),
    ("T", 13, 26, "[frustrated] They got buried in a pile of emails, and nobody followed up in time."),
    ("T", 27, 30, "[exasperated] [quickly] Faxes, voicemails, inbox threads."),
    ("T", 31, 42, "[upset] [quickly] I don't even know where half of them went. I'm so frustrated."),
    ("A", 43, 51, "[warmly] Hey, that's not on you. That's the old way."),
    ("A", 52, 57, "[encouraging] Why don't you use Tooth Referral?"),
    ("T", 58, 61, "[curious] [quickly] Tooth Referral? What's that?"),
    ("A", 62, 73, "[confident] Let me show you. It's one centralized system, built just for referrals."),
    ("T", 74, 76, "[surprised] Just for referrals?"),
    ("A", 77, 91, "[confident] [quickly] Yep, and it builds a real network between dental offices, so the referrals keep coming."),
    ("A", 92, 112, "Open any patient and you see the whole audit trail: who added the X-rays, who changed the status, and when."),
    ("T", 113, 121, "[curious] [quickly] Everything? And if I need something from their office?"),
    ("A", 122, 141, "[confident] [quickly] Just message the general dentist right inside the platform. No phone calls, no emails. It saves your time and theirs."),
    ("A", 142, 160, "And for our own team, there are administrative notes. We talk inside our office without a single phone call."),
    ("T", 161, 168, "[hopeful] So no more calling around for patient info?"),
    ("A", 169, 184, "[warmly] None. Everything's in one place, and they're offering a free trial. Why don't you try it?"),
]


def tts(text, voice, path):
    body = json.dumps({"text": text, "model_id": "eleven_v4"}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128", data=body,
                                 method="POST", headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    open(path, "wb").write(urllib.request.urlopen(req, timeout=180).read())


def trim(y):
    yt, _ = librosa.effects.trim(y, top_db=40, frame_length=1024, hop_length=256)
    return yt


def loud(x):
    f = librosa.feature.rms(y=x, frame_length=2048, hop_length=512)[0]
    f = f[f > np.percentile(f, 50)]
    return f.mean()


out = np.zeros(int(END * SR) + SR)
report = []
for i, (who, a, b, text) in enumerate(LINES):
    mp3 = os.path.join(TMP, f"line{i:02d}.mp3")
    if not os.path.exists(mp3) or "--fresh" in sys.argv:
        tts(text, VOICE[who], mp3)
    y, _ = librosa.load(mp3, sr=SR)
    y = trim(y)
    start = W[a]["start"]
    nxt = W[LINES[i + 1][1]]["start"] if i + 1 < len(LINES) else END
    avail = nxt - start - 0.12
    dur = len(y) / SR
    rate = 1.0
    lips = W[b]["end"] - start
    if dur < lips * 0.92:  # a take shorter than the mouth movement: slow it gently to fill the shot
        rate = max(dur / lips, 0.85)
        y = librosa.effects.time_stretch(y, rate=rate)
    elif dur > avail:
        rate = min(dur / avail, 1.32)
        y = librosa.effects.time_stretch(y, rate=rate)
    y = y * (0.12 / loud(y))
    s = int((start - 0.04) * SR)
    seg = y[: len(out) - s]
    out[s:s + len(seg)] += seg
    report.append((i, who, round(start, 2), round(dur, 2), round(avail, 2), round(rate, 2)))
    print(i, who, f"start {start:.2f}", f"take {dur:.2f}s", f"room {avail:.2f}s", f"speed x{rate:.2f}", flush=True)

tmpwav = os.path.join(TMP, "dub_raw.wav")
sf.write(tmpwav, np.clip(out, -1, 1), SR)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmpwav, "-af", "alimiter=limit=0.95:level=disabled,loudnorm=I=-16:TP=-1.5:LRA=9",
                "-ar", str(SR), os.path.join(ROOT, "public/audio/voice/s13-dub.wav")], check=True)
print("wrote public/audio/voice/s13-dub.wav")
