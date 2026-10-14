import json
import sys
import wave

import numpy as np

from faster_whisper import WhisperModel

model = WhisperModel(sys.argv[1], device="cpu", compute_type="int8")
out = {}
for path in sys.argv[3:]:
    with wave.open(path) as wf:
        audio = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768.0
    segments, info = model.transcribe(
        audio, word_timestamps=True, language="en", beam_size=5, vad_filter=False
    )
    words = []
    text = []
    for seg in segments:
        text.append(seg.text)
        for w in seg.words:
            words.append(
                {"word": w.word, "start": round(w.start, 3), "end": round(w.end, 3), "p": round(w.probability, 3)}
            )
    key = path.rsplit("/", 1)[-1]
    out[key] = {"text": "".join(text).strip(), "words": words}
    print(key, "|", out[key]["text"], flush=True)

with open(sys.argv[2], "w") as f:
    json.dump(out, f, indent=1)
