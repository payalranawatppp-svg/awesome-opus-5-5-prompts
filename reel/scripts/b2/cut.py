"""Buried in Emails v2: one take from the 11 Flow clips.
Every segment is re-timed to 30 fps and its audio is trimmed/padded to EXACTLY the video length, so voice and lips can
never drift across joins. An INSERT segment (frozen frame, covered by a full-screen graphic in the edit) holds the
line clip 6 is missing. Writes cut.mov (picture, graded), orig_aligned.wav (the clips' own voices, placed at their
video positions) and edl.json."""
import json, subprocess, sys
FPS = 30
SEG = [  # (clip, in, out)
    ('01', 3.20, 7.35), ('02', 0.80, 7.70), ('03', 0.00, 6.00), ('03', 6.60, 7.60), ('04', 0.00, 4.00), ('04', 4.75, 6.30),
    ('05', 0.00, 7.70), ('06', 1.80, 3.55), ('INS', 0, 0), ('06', 3.95, 6.75), ('07', 0.00, 7.75), ('08', 0.00, 1.70),
    ('08', 2.55, 7.50), ('09', 0.60, 7.60), ('10', 0.00, 5.20), ('10', 5.80, 7.10), ('11', 1.10, 7.90),
]
INS_DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 2.9
parts, edl, t = [], [], 0.0
for i, (c, a, b) in enumerate(SEG):
    o = f'seg{i:02d}.mov'
    if c == 'INS':
        n = round(INS_DUR * FPS); d = n / FPS
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '3.50', '-i', 'src/c06.mp4', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
                        '-filter_complex', f'[0:v]scale=1080:1920:flags=lanczos,fps={FPS},format=rgb24,lut3d=grade_06.cube:interp=tetrahedral,format=yuv420p,trim=end_frame=1,tpad=stop_mode=clone:stop={n},trim=end_frame={n},setpts=PTS-STARTPTS[v]',
                        '-map', '[v]', '-map', '1:a', '-t', f'{d:.4f}', '-c:v', 'libx264', '-crf', '14', '-c:a', 'pcm_s16le', o], check=True)
    else:
        n = round((b - a) * FPS); d = n / FPS
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-i', f'src/c{c}.mp4',
                        '-vf', f'scale=1080:1920:flags=lanczos,fps={FPS},format=rgb24,lut3d=grade_{c}.cube:interp=tetrahedral,format=yuv420p,trim=end_frame={n},setpts=PTS-STARTPTS',
                        '-af', f'aresample=48000,apad,atrim=duration={d:.4f},afade=t=in:d=0.015,afade=t=out:st={d - 0.02:.4f}:d=0.02',
                        '-c:v', 'libx264', '-crf', '14', '-c:a', 'pcm_s16le', '-ac', '2', o], check=True)
    nf = int(subprocess.check_output(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', o]).decode().strip())
    assert nf == n, (o, nf, n)
    edl.append({'i': i, 'clip': c, 'src_in': a, 'src_out': b, 'start': round(t, 4), 'dur': round(n / FPS, 4)})
    parts.append(o); t += n / FPS
open('list.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-map', '0:v', '-c:v', 'libx264', '-crf', '15', '-pix_fmt', 'yuv420p', 'cut.mov'], check=True)
# audio: place each segment's audio at its video start (no concat drift)
import numpy as np, wave
sr = 48000; y = np.zeros(int((t + 0.2) * sr), np.float32)
for s, p in zip(edl, parts):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'])
    a = np.frombuffer(raw, np.int16).astype(np.float32); o = int(round(s['start'] * sr)); y[o:o + len(a)] += a
w = wave.open('orig_aligned.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes(np.clip(y, -32768, 32767).astype(np.int16).tobytes()); w.close()
json.dump({'duration': round(t, 4), 'segments': edl}, open('edl.json', 'w'), indent=1)
print('total', round(t, 3), 'segments', len(edl))
