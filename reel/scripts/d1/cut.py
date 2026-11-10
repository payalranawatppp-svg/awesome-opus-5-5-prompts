import json, subprocess
SEG = [  # (clip, in, out, zoom) zoom: 'top135' hides burned captions
 ('01', 0.25, 1.15, 'top135'), ('01', 1.55, 7.62, None),
 ('03', 1.15, 5.05, 'top135'), ('03', 5.30, 7.55, 'top135'),
 ('04', 0.25, 1.32, None), ('04', 1.70, 7.66, None),
 ('05', 0.15, 4.95, None), ('05', 6.35, 7.15, None),
 ('06', 0.15, 1.38, None), ('06', 1.60, 7.30, None),
 ('07', 0.25, 7.20, None),
 ('08', 0.35, 6.25, None), ('08', 6.75, 7.55, None),
 ('10', 0.45, 6.10, None),
 ('12', 0.45, 7.30, None),
 ('13', 0.60, 7.78, None),
 ('14', 0.40, 3.00, None), ('14', 3.40, 7.75, None),
 ('15', 0.40, 4.60, None),
]
parts = []; edl = []; t = 0
for i, (c, a, b, z) in enumerate(SEG):
    o = f'seg{i:02d}.mp4'
    d = b - a
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-t', str(d), '-i', f'u{c}.mp4',
        '-vf', f'scale=1080:1920:flags=lanczos,fps=30,format=rgb24,lut3d=grade_{c}.cube:interp=tetrahedral,format=yuv420p',
        '-af', f'aresample=48000,afade=t=in:d=0.02,afade=t=out:st={d-0.03:.3f}:d=0.03',
        '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-c:a', 'pcm_s16le', '-ac', '2', o.replace('.mp4', '.mov')], check=True)
    parts.append(o.replace('.mp4', '.mov'))
    real = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', parts[-1]]).decode())
    edl.append({'i': i, 'clip': c, 'src_in': a, 'src_out': b, 'start': round(t, 4), 'dur': round(real, 4), 'zoom': z})
    t += real
open('list.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', 'cut.mov'], check=True)
json.dump({'duration': round(t, 4), 'segments': edl}, open('edl.json', 'w'), indent=1)
print('total', round(t, 2))
