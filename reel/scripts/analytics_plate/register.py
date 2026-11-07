import numpy as np, subprocess
from PIL import Image
plate=np.asarray(Image.open('page.png').convert('L'),dtype=np.float32)
W,H=1920,842
p=subprocess.Popen(['ffmpeg','-v','error','-i','rec4.mp4','-f','rawvideo','-pix_fmt','gray','-'],stdout=subprocess.PIPE)
ys=[];pred=0;i=0
cols=slice(340,1780)
while True:
    b=p.stdout.read(W*H)
    if len(b)<W*H: break
    f=np.frombuffer(b,np.uint8).reshape(H,W).astype(np.float32)
    best=(1e9,pred)
    for y in range(max(0,pred-60),min(plate.shape[0]-H,pred+60)+1):
        e=np.mean(np.abs(plate[y+40:y+H-40:2,cols][:, ::2]-f[40:H-40:2,cols][:, ::2]))
        if e<best[0]: best=(e,y)
    ys.append(best[1]); pred=best[1]; i+=1
    if i%300==0: print(i,best,flush=True)
np.save('ys30.npy',np.array(ys)); print(len(ys))
