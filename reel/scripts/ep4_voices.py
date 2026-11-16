"""Episode 4 "Front Row": one ElevenLabs voice per character, plus the closing line (the recital clip was not delivered).

1. Speech-to-speech on every spoken clip (keeps each take's timing, emotion and lip sync, swaps the timbre so a
   character sounds the same in every clip): Tanya = Laura, Amanda = Matilda, Dr. Vance = Brian,
   Greg = Will (new voices for this episode, at the user's request).
2. Text-to-speech: tanya_home "When the loop closes on time, everybody wins. Especially at home."
usage: ELEVENLABS_API_KEY=... python ep4_voices.py [names...]
writes public/ep4/voice/<clip>.wav. Never commit the key."""
import json, os, subprocess, sys, tempfile, urllib.request, uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public/ep4/voice")
KEY = os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")
VOICE = {"TANYA": "FGY2WhTYpPnrIDTdsKH5", "AMANDA": "XrExE9yKIg1WjnnlVkGX", "VANCE": "nPczCjzI2devNBz1zQrb", "GREG": "bIHbv24MWmeRgasZH58o"}
CLIPS = {"e01": "TANYA", "e02": "TANYA", "e03": "GREG", "e04": "TANYA", "e05": "AMANDA", "e06": "TANYA", "e07": "AMANDA", "e08": "VANCE",
         "e09": "TANYA", "e10": "AMANDA", "e11": "TANYA", "e12": "TANYA", "e14": "GREG", "e15": "GREG", "e16": "AMANDA"}
LINES = {"tanya_home": ("TANYA", "When the loop closes on time... everybody wins. Especially at home.", 0.35)}


def post(url, body, ctype):
    req = urllib.request.Request(url, data=body, method="POST", headers={"xi-api-key": KEY, "Content-Type": ctype})
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read()


def norm(p, name):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "48000", os.path.join(OUT, f"{name}.wav")], check=True)


def sts(clip, voice):
    wav = os.path.join(tempfile.gettempdir(), f"ep4_{clip}.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(ROOT, f"public/ep4/{clip}.mp4"), "-vn", "-ac", "1", "-ar", "44100", wav], check=True)
    b = uuid.uuid4().hex
    parts = [f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode() for k, v in [
        ("model_id", "eleven_multilingual_sts_v2"), ("remove_background_noise", "true"), ("seed", "7"),
        ("voice_settings", json.dumps({"stability": 0.5, "similarity_boost": 0.8, "style": 0, "use_speaker_boost": True}))]]
    parts.append(f'--{b}\r\nContent-Disposition: form-data; name="audio"; filename="{clip}.wav"\r\nContent-Type: audio/wav\r\n\r\n'.encode() + open(wav, "rb").read() + b"\r\n")
    parts.append(f"--{b}--\r\n".encode())
    mp3 = post(f"https://api.elevenlabs.io/v1/speech-to-speech/{voice}?output_format=mp3_44100_128", b"".join(parts), f"multipart/form-data; boundary={b}")
    p = os.path.join(OUT, f"{clip}.mp3"); open(p, "wb").write(mp3); norm(p, clip)


def tts(name, voice, text, style):
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2",
                       "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": style, "use_speaker_boost": True}}).encode()
    mp3 = post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128", body, "application/json")
    p = os.path.join(OUT, f"{name}.mp3"); open(p, "wb").write(mp3); norm(p, name)


os.makedirs(OUT, exist_ok=True)
only = set(sys.argv[1:])
for c, who in CLIPS.items():
    if not only or c in only:
        sts(c, VOICE[who]); print("sts", c, who, flush=True)
for n, (who, text, style) in LINES.items():
    if not only or n in only:
        tts(n, VOICE[who], text, style); print("tts", n, who, flush=True)
