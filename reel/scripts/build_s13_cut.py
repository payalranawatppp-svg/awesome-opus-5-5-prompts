import json, subprocess, sys
S=sys.argv[1]
# per clip: (keep start, keep end, [removed spans inside])
plan={1:(2.00,6.70,[]),2:(0.72,7.25,[(2.80,3.25)]),3:(0.48,7.70,[(3.30,3.62),(5.62,6.15)]),
      4:(0.58,7.80,[(2.30,2.62),(3.85,4.22)]),5:(1.40,6.75,[(4.75,5.00)]),6:(1.02,7.55,[(2.86,3.08)]),
      7:(0.36,7.85,[]),8:(0.28,9.65,[(7.55,7.78)]),9:(0.50,8.75,[(1.98,2.30),(4.40,4.95)]),10:(0.22,9.80,[(7.70,8.70)])}
fps=30; q=lambda t: round(t*fps)/fps
segs=[]; at=0.0
for c,(a,b,rm) in plan.items():
    t=a
    for r0,r1 in rm:
        segs.append((c,q(t),q(r0))); t=r1
    segs.append((c,q(t),q(b)))
ins=[]; fc=[]; out=[]
for i,(c,a,b) in enumerate(segs):
    ins+=['-i',f'{S}/graded/c{c:02d}.mp4']
    fc.append(f"[{i}:v]trim=start={a}:end={b},setpts=PTS-STARTPTS[v{i}];[{i}:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={b-a-0.012:.3f}:d=0.012[a{i}]")
    out.append({'clip':c,'in':a,'out':b,'at':round(at,4)}); at+=b-a
fc.append(''.join(f'[v{i}][a{i}]' for i in range(len(segs)))+f'concat=n={len(segs)}:v=1:a=1[v][a]')
subprocess.run(['ffmpeg','-v','error','-y',*ins,'-filter_complex',';'.join(fc),'-map','[v]','-map','[a]','-c:v','libx264','-crf','12','-preset','fast','-pix_fmt','yuv420p','-c:a','pcm_s16le','-ar','48000',f'{S}/cut.mov'],check=True)
json.dump({'segments':out,'duration':round(at,4)},open(f'{S}/cut.json','w'),indent=1)
print(len(segs),'segments',round(at,2),'s')
