"""Episode 2: one ElevenLabs voice per character, plus the lines Flow never delivered.

1. Speech-to-speech on every spoken line in the 12 Flow clips (keeps each take's timing, emotion and lip sync, swaps
   the timbre so every character sounds the same in every clip): Mrs. Ortiz = Sarah, Dr. Vance = Eric, Amanda = Bella,
   Tanya = Jessica.
2. Text-to-speech for the missing lines, in the same voices:
   tanya_square  "We called, got voicemail. They called back while I was checking someone out. We're right back at square one."
   amanda_stop   "Remember what we set up? Stop calling. Move the conversation onto the case."
   amanda_mention "Both offices share the case. So I just mention Barbara."
   amanda_tail   "No downloading, no scanning, no chasing emails."
   amanda_anymore "We aren't anymore."
usage: ELEVENLABS_API_KEY=... python ep2_voices.py   (or with the key injected by the network proxy: any dummy value)
writes public/ep2/voice/<clip>.wav (re-voiced clip audio) and public/ep2/voice/<line>.mp3. Never commit the key."""
import json, os, subprocess, sys, tempfile, urllib.request, uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public/ep2/voice")
KEY = os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")
VOICE = {"ORTIZ": "EXAVITQu4vr4xnSDxMaL", "VANCE": "cjVigY5qzO86Huf0OWal", "AMANDA": "hpp4J3VqNfWAUOO0d1Us", "TANYA": "cgSgspJ2msm6clMCkdW9"}
CLIPS = {"u01": "ORTIZ", "u02": "VANCE", "u03": "VANCE", "u04": "TANYA", "u06": "AMANDA", "u08": "AMANDA", "u10": "VANCE", "u11": "TANYA", "u12": "AMANDA"}
LINES = {
    "tanya_square": ("TANYA", "We called, got voicemail... They called back while I was checking someone out. We're right back at square one.", 0.35),
    "amanda_stop": ("AMANDA", "Remember what we set up? Stop calling. Move the conversation onto the case.", 0.4),
    "amanda_mention": ("AMANDA", "Both offices share the case. So I just mention Barbara.", 0.45),
    "amanda_tail": ("AMANDA", "No downloading, no scanning, no chasing emails.", 0.45),
    "amanda_anymore": ("AMANDA", "We aren't anymore.", 0.5),
}


def post(url, body, ctype):
    req = urllib.request.Request(url, data=body, method="POST", headers={"xi-api-key": KEY, "Content-Type": ctype})
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read()


def sts(clip, voice):
    wav = os.path.join(tempfile.gettempdir(), f"{clip}.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(ROOT, f"public/ep2/{clip}.mp4"), "-vn", "-ac", "1", "-ar", "44100", wav], check=True)
    b = uuid.uuid4().hex
    parts = []
    for k, v in [("model_id", "eleven_multilingual_sts_v2"), ("remove_background_noise", "true"), ("seed", "7"),
                 ("voice_settings", json.dumps({"stability": 0.5, "similarity_boost": 0.8, "style": 0, "use_speaker_boost": True}))]:
        parts.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    parts.append(f'--{b}\r\nContent-Disposition: form-data; name="audio"; filename="{clip}.wav"\r\nContent-Type: audio/wav\r\n\r\n'.encode() + open(wav, "rb").read() + b"\r\n")
    parts.append(f"--{b}--\r\n".encode())
    mp3 = post(f"https://api.elevenlabs.io/v1/speech-to-speech/{voice}?output_format=mp3_44100_128", b"".join(parts), f"multipart/form-data; boundary={b}")
    p = os.path.join(OUT, f"{clip}.mp3"); open(p, "wb").write(mp3)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "48000", os.path.join(OUT, f"{clip}.wav")], check=True)


def tts(name, voice, text, style):
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2",
                       "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": style, "use_speaker_boost": True}}).encode()
    mp3 = post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128", body, "application/json")
    p = os.path.join(OUT, f"{name}.mp3"); open(p, "wb").write(mp3)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "48000", os.path.join(OUT, f"{name}.wav")], check=True)


os.makedirs(OUT, exist_ok=True)
only = set(sys.argv[1:])
for clip, who in CLIPS.items():
    if not only or clip in only:
        sts(clip, VOICE[who]); print("sts", clip, who, flush=True)
for name, (who, text, style) in LINES.items():
    if not only or name in only:
        tts(name, VOICE[who], text, style); print("tts", name, who, flush=True)
