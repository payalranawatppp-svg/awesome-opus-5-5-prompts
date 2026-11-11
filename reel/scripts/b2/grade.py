# per-clip LUTs: exposure/contrast matched on the whole frame, white balance matched on skin tones
import subprocess, numpy as np, os
SEG=[('01',3.20,7.35),('02',0.80,7.70),('03',0.0,7.6),('04',0.0,6.3),('05',0.0,7.7),('06',1.8,6.75),('07',0.0,7.75),('08',0.0,7.5),('09',0.6,7.6),('10',0.0,7.1),('11',1.1,8.0)]
def srgb2lin(c): return np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
def lin2srgb(c): c=np.clip(c,0,1); return np.where(c<=0.0031308,c*12.92,1.055*c**(1/2.4)-0.055)
M=np.array([[0.4124,0.3576,0.1805],[0.2126,0.7152,0.0722],[0.0193,0.1192,0.9505]]); Mi=np.linalg.inv(M); Wn=np.array([0.95047,1,1.08883])
def f(t): return np.where(t>0.008856,np.cbrt(np.maximum(t,0)),7.787*t+16/116)
def fi(t): return np.where(t>0.206893,t**3,(t-16/116)/7.787)
def rgb2lab(rgb):
  xyz=srgb2lin(rgb)@M.T/Wn; fx,fy,fz=f(xyz[...,0]),f(xyz[...,1]),f(xyz[...,2])
  return np.stack([116*fy-16,500*(fx-fy),200*(fy-fz)],-1)
def lab2rgb(lab):
  fy=(lab[...,0]+16)/116; fx=fy+lab[...,1]/500; fz=fy-lab[...,2]/200
  return lin2srgb(np.stack([fi(fx),fi(fy),fi(fz)],-1)*Wn@Mi.T)
st={}
for c in sorted(set(s[0] for s in SEG)):
  px=[]
  for (cc,a,b) in SEG:
    if cc!=c: continue
    for t in np.linspace(a+0.1,b-0.1,4):
      raw=subprocess.check_output(['ffmpeg','-v','error','-ss',f'{t:.2f}','-i',f'src/c{c}.mp4','-frames:v','1','-vf','scale=180:320','-f','rawvideo','-pix_fmt','rgb24','-'])
      px.append(np.frombuffer(raw,np.uint8).reshape(320,180,3)/255.)
  im=np.stack(px); lab=rgb2lab(im)
  face=lab[:,40:150,40:140].reshape(-1,3)            # face/upper body window
  sk=face[(face[:,1]>6)&(face[:,1]<30)&(face[:,2]>8)&(face[:,2]<35)&(face[:,0]>35)&(face[:,0]<85)]
  L=lab.reshape(-1,3)[:,0]
  st[c]=dict(L=(L.mean(),L.std()),sk=sk[:,1:].mean(0),skL=sk[:,0].mean(),n=len(sk))
  print(c,'L',np.round(st[c]['L'],1),'skin ab',np.round(st[c]['sk'],1),'skinL',round(st[c]['skL'],1),len(sk))
tL=np.median([v['L'][0] for v in st.values()]); tS=np.median([v['L'][1] for v in st.values()])
tsk=np.median([v['sk'] for v in st.values()],0); tskL=np.median([v['skL'] for v in st.values()])
print('target L',round(tL,1),round(tS,1),'skin',np.round(tsk,1),round(tskL,1))
N=33; g=np.linspace(0,1,N); B,G,R=np.meshgrid(g,g,g,indexing='ij'); grid=np.stack([R,G,B],-1).reshape(-1,3); lab=rgb2lab(grid)
for c,v in st.items():
  m,s=v['L']; o=lab.copy()
  k=np.clip(tS/s,0.9,1.12); k=1+(k-1)*0.6
  # exposure: half whole-frame, half skin brightness
  dL=0.5*(tL-m)+0.5*(tskL-v['skL']); dL=np.clip(dL*0.8,-8,12)
  o[:,0]=(lab[:,0]-m)*k+m+dL
  d=(tsk-v['sk'])*0.8
  w=np.clip(1-np.abs(lab[:,0]-50)/70,0.25,1)  # keep the brightest highlights and deepest shadows neutral-ish
  o[:,1]+=d[0]*w; o[:,2]+=d[1]*w
  with open(f'grade_{c}.cube','w') as fh:
    fh.write(f'LUT_3D_SIZE {N}\n'); fh.writelines(f'{r:.6f} {g_:.6f} {b:.6f}\n' for r,g_,b in lab2rgb(o))
