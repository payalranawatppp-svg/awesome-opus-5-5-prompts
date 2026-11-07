import numpy as np, subprocess
ys=np.load('ys30.npy'); W,H=1920,842; PH=int(ys.max())+H
# pick frames: one per distinct offset, max 3000; store frames subsampled in time (every 3rd)
idx=list(range(0,len(ys),3))
p=subprocess.Popen(['ffmpeg','-v','error','-i','rec4.mp4','-vf',"select='not(mod(n\\,3))'",'-vsync','0','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
frames=[]
for k in idx:
    b=p.stdout.read(W*H*3)
    if len(b)<W*H*3: break
    frames.append(np.frombuffer(b,np.uint8).reshape(H,W,3))
print(len(frames))
out=np.zeros((PH,W,3),np.uint8)
BUB=(730,825,1790,1882)  # viewport rows/cols of the chat bubble
for R0 in range(0,PH,64):
    R1=min(PH,R0+64)
    for R in range(R0,R1):
        rows=[];masks=[]
        for j,k in enumerate(idx[:len(frames)]):
            r=R-ys[k]
            if 0<=r<H:
                rows.append(frames[j][r]); masks.append(BUB[0]<=r<BUB[1])
        rows=np.array(rows); masks=np.array(masks)
        med=np.median(rows,axis=0)
        if masks.any() and (~masks).any():
            med[BUB[2]:BUB[3]]=np.median(rows[~masks][:,BUB[2]:BUB[3]],axis=0)
        out[R]=med
from PIL import Image
Image.fromarray(out).save('plate.png'); print(PH)
