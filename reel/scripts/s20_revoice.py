"""Script 20: re-voice every line with ElevenLabs speech-to-speech, one cast voice per character.

Speech-to-speech keeps each take's own timing, emotion and intonation (so lip sync and captions stay locked) and swaps
the timbre for a voice that fits the character's age. Lines are cut from the clean cut by word timings, converted,
and laid back at the same times; the original track stays under them only between lines (footsteps, door, room tone).
usage: ELEVENLABS_API_KEY=... python s20_revoice.py <work-dir>   (needs cut.mov + cut_words.json; writes voice.wav, mix.wav)
Never commit the key."""
import json, os, subprocess, sys, wave
import numpy as np

S = sys.argv[1]
KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE = {  # premade, American
    "GREG": "bIHbv24MWmeRgasZH58o",     # Will — young, relaxed, optimistic
    "BARBARA": "XrExE9yKIg1WjnnlVkGX",  # Matilda — middle-aged, warm, professional
    "SARAH": "EXAVITQu4vr4xnSDxMaL",    # Sarah — mature, reassuring
    "DAVID": "CwhRBWXzGAHq8TQ4Fs17",    # Roger — middle-aged, laid-back
    "TANYA": "cgSgspJ2msm6clMCkdW9",    # Jessica — young, bright
    "AMANDA": "hpp4J3VqNfWAUOO0d1Us",   # Bella — middle-aged, calm, professional
}
# (speaker, first word, last word) as 0-based indexes into cut_words.json
W = json.load(open(f"{S}/cut_words.json"))["cut.wav"]["words"]
txt = [w["word"].strip().lower().strip(".,?!'") for w in W]
def find(seq, start=0):
    seq = seq.lower().split()
    for i in range(start, len(txt)):
        if txt[i:i + len(seq)] == [s.strip(".,?!'") for s in seq]: return i
    raise SystemExit(f"not found: {seq} after {start}")
LINES_TXT = [
    ("GREG", "barbara did", "note"), ("BARBARA", "not yet", "week"), ("GREG", "hi sarah", "today"),
    ("SARAH", "finally", "perfectly"), ("GREG", "that's great", "file"), ("GREG", "hey barbara", "here"),
    ("BARBARA", "calling them", "now"), ("BARBARA", "hi it's barbara", "hold"), ("GREG", "just one form", "seat"),
    ("GREG", "barbara sarah's", "minutes"), ("BARBARA", "i know", "it"), ("BARBARA", "yes i'm still", "you"),
    ("GREG", "anything", "anything"), ("BARBARA", "you found", "thank you"), ("BARBARA", "they're faxing", "now"),
    ("GREG", "every office", "way"), ("BARBARA", "and the patient", "waits"), ("AMANDA", "sending it", "that"),
    ("TANYA", "it was sitting", "friday"), ("AMANDA", "this keeps", "happening"), ("AMANDA", "messages", "too"),
    ("TANYA", "let's invite", "today"), ("TANYA", "and invite", "dental"), ("AMANDA", "that took", "this"),
    ("GREG", "hi david", "day"), ("DAVID", "hey greg", "over"), ("GREG", "already here", "case"),
    ("DAVID", "that fast", "calls"), ("GREG", "not anymore", "referral"), ("TANYA", "gentle dental hasn't", "week"),
    ("AMANDA", "two offices", "referral"),
]
lines, pos = [], 0
for sp, a, b in LINES_TXT:
    i = find(a, pos); j = find(b, i) + len(b.split()) - 1; pos = j + 1
    lines.append({"sp": sp, "a": W[i]["start"], "b": W[j]["end"], "text": " ".join(w["word"].strip() for w in W[i:j + 1])})
for k, L in enumerate(lines):
    lo = lines[k - 1]["b"] + 0.03 if k else 0
    hi = lines[k + 1]["a"] - 0.03 if k + 1 < len(lines) else 999
    L["a0"] = max(lo, L["a"] - 0.12); L["b0"] = min(hi, L["b"] + 0.22)
SR = 44100
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{S}/cut.mov", "-vn", "-ac", "1", "-ar", str(SR), f"{S}/orig.wav"], check=True)
os.makedirs(f"{S}/vo", exist_ok=True)
with wave.open(f"{S}/orig.wav") as wf: orig = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768
voice = np.zeros_like(orig); duck = np.ones_like(orig)
for k, L in enumerate(lines):
    i0, i1 = int(L["a0"] * SR), int(L["b0"] * SR)
    src, out = f"{S}/vo/l{k:02d}.wav", f"{S}/vo/l{k:02d}_{L['sp']}.mp3"
    with wave.open(src, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((orig[i0:i1] * 32767).astype(np.int16).tobytes())
    if not os.path.exists(out):
        r = subprocess.run(["curl", "-sS", "--fail-with-body", "-X", "POST",
            f"https://api.elevenlabs.io/v1/speech-to-speech/{VOICE[L['sp']]}?output_format=mp3_44100_128",
            "-H", f"xi-api-key: {KEY}", "-F", f"audio=@{src};type=audio/wav", "-F", "model_id=eleven_multilingual_sts_v2",
            "-F", 'voice_settings={"stability":0.42,"similarity_boost":0.85,"style":0.15,"use_speaker_boost":true}',
            "-F", "remove_background_noise=true", "-F", "seed=11", "-o", out], capture_output=True, text=True)
        if r.returncode: raise SystemExit(f"line {k}: {r.stdout[:300]} {r.stderr[:300]}")
    dec = subprocess.run(["ffmpeg", "-v", "error", "-i", out, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    y = np.frombuffer(dec, np.int16).astype(np.float32) / 32768
    n = i1 - i0; y = y[:n] if len(y) >= n else np.pad(y, (0, n - len(y)))
    f = int(0.012 * SR); ramp = np.linspace(0, 1, f)
    y[:f] *= ramp; y[-f:] *= ramp[::-1]
    voice[i0:i1] += y
    g = int(0.06 * SR); duck[i0:i1] = 0
    duck[max(0, i0 - g):i0] = np.minimum(duck[max(0, i0 - g):i0], np.linspace(1, 0, i0 - max(0, i0 - g)))
    duck[i1:i1 + g] = np.minimum(duck[i1:i1 + g], np.linspace(0, 1, len(duck[i1:i1 + g])))
    print(f"{k:02d} {L['sp']:8s} {L['a0']:6.2f}-{L['b0']:6.2f}  {L['text']}", flush=True)
# room tone so ducked gaps never drop to digital silence
rng = np.random.default_rng(3); brown = np.cumsum(rng.normal(0, 1, len(orig))); brown -= np.convolve(brown, np.ones(4410) / 4410, "same")
brown = brown / (np.abs(brown).max() + 1e-9) * 10 ** (-52 / 20)
def save(p, x):
    with wave.open(p, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
save(f"{S}/voice.wav", voice)
save(f"{S}/mix_raw.wav", voice + orig * duck * 0.9 + brown)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{S}/mix_raw.wav", "-af", "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,loudnorm=I=-16:TP=-1.5:LRA=8", "-ar", "48000", f"{S}/mix.wav"], check=True)
json.dump(lines, open(f"{S}/lines.json", "w"), indent=1)
print("done", len(lines))
