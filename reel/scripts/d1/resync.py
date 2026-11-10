# place each segment's piece of the (concatenated-audio-timeline) voice at its video start
import json, subprocess, numpy as np, wave
e = json.load(open('edl.json'))['segments']
adur = [float(subprocess.check_output(['ffprobe','-v','error','-select_streams','a:0','-show_entries','stream=duration','-of','csv=p=0',f'seg{s["i"]:02d}.mov']).decode()) for s in e]
a0 = np.concatenate([[0], np.cumsum(adur)])[:-1]
for s, a, d in zip(e, a0, adur): print(s['i'], 'audio', round(a,3), 'video', s['start'], 'drift', round(s['start']-a,3), 'adur', round(d,3), 'vdur', s['dur'])
subprocess.run(['ffmpeg','-v','error','-y','-i','sts_sarah.mp3','-ar','48000','-ac','1','sarah48.wav'],check=True)
w = wave.open('sarah48.wav'); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
total = json.load(open('edl.json'))['duration']
y = np.zeros(int((total + 0.1) * sr), np.float32)
for s, a, d in zip(e, a0, adur):
    seg = x[int(a*sr):int((a+d)*sr)].copy()
    f = int(0.004*sr); seg[:f] *= np.linspace(0,1,f); seg[-f:] *= np.linspace(1,0,f)
    o = int(s['start']*sr); y[o:o+len(seg)] += seg
wo = wave.open('sarah_sync.wav','wb'); wo.setnchannels(1); wo.setsampwidth(2); wo.setframerate(sr); wo.writeframes(np.clip(y,-32768,32767).astype(np.int16).tobytes()); wo.close()
# remap the word timings onto the video timeline
tr = json.load(open('/home/user/awesome-opus-5-5-prompts/reel/src/data/transcript-d1.json'))
def m(t):
    i = max(k for k in range(len(e)) if a0[k] <= t + 1e-6)
    return round(e[i]['start'] + (t - a0[i]), 3)
for wd in tr['d1']['words']:
    wd['start'], wd['end'] = m(wd['start']), m(wd['end'])
json.dump(tr, open('/home/user/awesome-opus-5-5-prompts/reel/src/data/transcript-d1.json','w'), indent=0)
json.dump({'audio_starts': list(map(float,a0)), 'audio_durs': adur}, open('resync.json','w'))
