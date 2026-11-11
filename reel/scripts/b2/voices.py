"""Two ElevenLabs voices (speech-to-speech keeps each take's emotion and timing): Tanya -> Matilda, Amanda -> Jessica.
All of one speaker's pieces go in one request, separated by silence, then are cut back out and placed at their exact
positions on the cut's timeline. Clip 6's missing line (TTS, Amanda's voice) goes on the INSERT segment."""
import json, subprocess, numpy as np, wave, os
SR = 48000
KEY = open('../secrets/elevenlabs2.key').read().strip()
VOICE = {'T': 'XrExE9yKIg1WjnnlVkGX', 'A': 'cgSgspJ2msm6clMCkdW9'}
# speaker turns in clip-local seconds
TURNS = {'01': [('A', 0, 99)], '02': [('T', 0, 99)], '03': [('T', 0, 99)], '04': [('A', 0, 4.4), ('T', 4.4, 99)],
         '05': [('T', 0, 5.45), ('A', 5.45, 99)], '06': [('A', 0, 6.05), ('T', 6.05, 99)], '07': [('A', 0, 99)],
         '08': [('T', 0, 2.1), ('A', 2.1, 99)], '09': [('T', 0, 3.95), ('A', 3.95, 99)], '10': [('A', 0, 5.5), ('T', 5.5, 99)],
         '11': [('T', 0, 3.9), ('A', 3.9, 99)]}
edl = json.load(open('edl.json'))
total = edl['duration']


def read(p):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'])
    return np.frombuffer(raw, np.int16).astype(np.float32)


pieces = {'T': [], 'A': []}  # (out_start_sec, samples)
for s in edl['segments']:
    if s['clip'] == 'INS':
        continue
    a = read(f"seg{s['i']:02d}.mov")
    for spk, t0, t1 in TURNS[s['clip']]:
        lo, hi = max(t0, s['src_in']), min(t1, s['src_out'])
        if hi - lo < 0.05:
            continue
        i0, i1 = int((lo - s['src_in']) * SR), int((hi - s['src_in']) * SR)
        pieces[spk].append((s['start'] + lo - s['src_in'], a[i0:i1]))

GAP = int(0.6 * SR)
out = np.zeros(int((total + 0.3) * SR), np.float32)
for spk, ps in pieces.items():
    buf, offs = [], []
    for st, x in ps:
        offs.append(sum(len(b) for b in buf)); buf += [x, np.zeros(GAP, np.float32)]
    src = np.concatenate(buf)
    fn = f'in_{spk}.wav'
    w = wave.open(fn, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.clip(src, -32768, 32767).astype(np.int16).tobytes()); w.close()
    res = f'sts_{spk}.mp3'
    if not os.path.exists(res):
        code = subprocess.check_output(['curl', '-s', '-o', res, '-w', '%{http_code}', f'https://api.elevenlabs.io/v1/speech-to-speech/{VOICE[spk]}?output_format=mp3_44100_128',
                                        '-H', f'xi-api-key: {KEY}', '-F', f'audio=@{fn}', '-F', 'model_id=eleven_multilingual_sts_v2', '-F', 'remove_background_noise=true',
                                        '-F', 'voice_settings={"stability":0.45,"similarity_boost":0.8,"style":0.2,"use_speaker_boost":true}']).decode()
        assert code == '200', (spk, code, open(res).read()[:300])
    conv = read(res)
    # check alignment of the converted track against the source (envelope cross-correlation)
    e = lambda v: np.abs(v[:len(v) // 480 * 480]).reshape(-1, 480).mean(1)
    ea, eb = e(src), e(conv)
    n = min(len(ea), len(eb)) - 40
    best = max(range(-20, 21), key=lambda o: np.corrcoef(ea[20:n], eb[20 + o:n + o])[0, 1])
    print(spk, 'pieces', len(ps), 'offset ms', best * 10)
    sh = best * 480
    for (st, x), off in zip(ps, offs):
        y = conv[off + sh: off + sh + len(x)].copy()
        f = int(0.008 * SR); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
        o = int(round(st * SR)); out[o:o + len(y)] += y
# the missing line on the insert
ins = next(s for s in edl['segments'] if s['clip'] == 'INS')
tts = read('ins_tts.wav')
o = int((ins['start'] + 0.22) * SR); out[o:o + len(tts)] += tts * 0.9
w = wave.open('voice_raw.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.clip(out, -32768, 32767).astype(np.int16).tobytes()); w.close()
print('ok', round(total, 2))
