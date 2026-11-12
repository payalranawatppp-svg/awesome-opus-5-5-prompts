"""Script 20 "Did They Ever Send It?": one clean take from the 17 Flow clips.

Fixes (user notes 2026-11-12): silences trimmed; duplicate takes dropped (c01 = alt of c04, c02 = c03);
c05 tail (keypad beeps + phone ring) removed; Sarah's lip-synced "On it" in c06 removed (Barbara's "Calling them now"
stays); a 0.75 s held beat after Barbara's "I'll hold" (c07) filled with the hold tone from c09; c08 is kept whole
(the glass-door glitch at 4.15-6.0 s is covered by a full-screen cutaway in the composition).
usage: python build_s20_cut.py <work-dir>   (expects <work-dir>/src/cNN.mov, writes cut.mov + cut.json)"""
import json, subprocess, sys
S = sys.argv[1]
FPS = 24
q = lambda t: round(t * FPS) / FPS
# (clip, in, out) ; ('freeze', clip, at, dur, audio_clip, audio_in)
PLAN = [
    ('c03', 1.40, 7.95),
    ('c04', 0.90, 7.90),
    ('c05', 0.15, 3.30),
    ('c06', 0.95, 5.60), ('c06', 6.92, 7.80),
    ('c07', 0.00, 5.08), ('freeze', 'c07', 5.04, 0.75, 'c09', 0.20), ('c07', 5.08, 6.85),
    ('c08', 2.40, 7.95),
    ('c09', 1.55, 7.60),
    ('c10', 0.00, 1.65), ('c10', 2.10, 4.20), ('c10', 5.10, 7.85),
    ('c11', 0.00, 2.15), ('c11', 2.85, 5.10), ('c11', 5.65, 6.95),
    ('c12', 0.00, 3.25), ('c12', 3.70, 5.85), ('c12', 6.35, 7.50),
    ('c18', 0.55, 3.45), ('c18', 4.05, 5.75), ('c18', 6.15, 7.55),  # "Let's set up Tooth Referral" (clip sent later)
    ('c13', 0.00, 7.55),
    ('c14', 1.30, 4.05), ('c14', 4.45, 5.90), ('c14', 6.30, 7.80),
    ('c15', 1.00, 7.85),
    ('c16', 0.55, 7.25),
    ('c17', 0.55, 3.50), ('c17', 3.95, 7.95),
]
ins, fc, out = [], [], []
at = 0.0
for i, seg in enumerate(PLAN):
    if seg[0] == 'freeze':
        _, c, t, d, ac, a0 = seg
        t, d = q(t), q(d)
        ins += ['-i', f'{S}/src/{c}.mov', '-i', f'{S}/src/{ac}.mov']
        vi, ai = len(ins) // 2 - 2, len(ins) // 2 - 1
        fc.append(f"[{vi}:v]trim=start={t}:end={t + 1 / FPS},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={d},trim=duration={d}[v{i}];"
                  f"[{ai}:a]atrim=start={a0}:end={a0 + d},asetpts=PTS-STARTPTS,volume=0.55,afade=t=in:d=0.08,afade=t=out:st={d - 0.12:.3f}:d=0.12[a{i}]")
        out.append({'clip': c, 'in': t, 'out': t, 'freeze': d, 'at': round(at, 4)})
        at += d
        continue
    c, a, b = seg
    a, b = q(a), q(b)
    ins += ['-i', f'{S}/src/{c}.mov']
    k = len(ins) // 2 - 1
    fc.append(f"[{k}:v]trim=start={a}:end={b},setpts=PTS-STARTPTS[v{i}];"
              f"[{k}:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={b - a - 0.015:.3f}:d=0.015[a{i}]")
    out.append({'clip': c, 'in': a, 'out': b, 'at': round(at, 4)})
    at += b - a
n = len(PLAN)
fc.append(''.join(f'[v{i}][a{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=1[vc][ac];[ac]loudnorm=I=-16:TP=-1.5:LRA=9[a]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fc), '-map', '[vc]', '-map', '[a]',
                '-r', str(FPS), '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p',
                '-c:a', 'pcm_s16le', '-ar', '48000', f'{S}/cut.mov'], check=True)
json.dump({'fps': FPS, 'segments': out, 'duration': round(at, 4)}, open(f'{S}/cut.json', 'w'), indent=1)
print(n, 'segments', round(at, 2), 's')
