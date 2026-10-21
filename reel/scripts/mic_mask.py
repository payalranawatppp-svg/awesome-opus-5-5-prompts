"""Static mask of the mic and boom arm in front of the speaker (ToothReferral UGC #2), so it stays solid over a
new background: everything inside a tight outline that differs from an inpainted model of the studio wall,
plus the matte where the mic lies on the shoulder. Writes reel/public/cutouts/tr2-cut-mic.png; run from reel/
with the matte venv (cv2). The preview path at the end is a scratch file."""
import cv2, numpy as np
def med(path, k=30):
    cap=cv2.VideoCapture(path); n=int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); fs=[]
    for i in np.linspace(5,n-5,k).astype(int):
        cap.set(cv2.CAP_PROP_POS_FRAMES,int(i)); ok,f=cap.read()
        if ok: fs.append(f)
    return np.median(np.stack(fs),0).astype(np.uint8)
img=med('public/footage/tr2-cut.mp4')
alpha=med('public/cutouts/tr2-cut-matte.mp4')[...,0].astype(np.float32)/255
H,W=img.shape[:2]
arm=np.array([[0,428],[130,412],[178,418],[208,468],[222,560],[218,612],[174,612],[162,560],[152,548],[80,548],[0,548]])
body=np.array([[58,778],[92,834],[165,826],[336,642],[304,566],[258,566],[150,636],[74,716]])
o_arm=np.zeros((H,W),np.uint8); cv2.fillPoly(o_arm,[arm],1)
o_body=np.zeros((H,W),np.uint8); cv2.fillPoly(o_body,[body],1)
outline=cv2.dilate(np.maximum(o_arm,o_body),np.ones((7,7),np.uint8))
wall=cv2.inpaint(img,outline*255,9,cv2.INPAINT_TELEA)
d=np.abs(img.astype(np.float32)-wall.astype(np.float32)).max(2)
m=np.clip((d-8)/10,0,1)
m=np.maximum(m,np.clip((alpha-0.2)/0.3,0,1)*cv2.dilate(o_body,np.ones((5,5),np.uint8)))*outline
b=(m>0.5).astype(np.uint8)
b=cv2.morphologyEx(b,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))
# fill only small enclosed holes (specular spots), never the wall seen between the arm bars
inv=(1-b).astype(np.uint8); nl,lab,st,_=cv2.connectedComponentsWithStats(inv)
inner=cv2.erode(o_body,np.ones((9,9),np.uint8))
for k in range(1,nl):
    comp=lab==k
    # small specks anywhere; any size inside the mic body (the shine on the barrel is never wall)
    if st[k,cv2.CC_STAT_AREA]<250 or (inner[comp].mean()>0.98): b[comp]=1
nl,lab,st,_=cv2.connectedComponentsWithStats(b)
keep=np.zeros_like(b)
for k in range(1,nl):
    if st[k,cv2.CC_STAT_AREA]>300: keep[lab==k]=1
soft=np.maximum(keep*np.clip(m*1.4,0,1), cv2.erode(keep,np.ones((3,3),np.uint8)).astype(np.float32))
soft=cv2.GaussianBlur(soft.astype(np.float32),(3,3),0)
rgba=np.zeros((H,W,4),np.uint8); rgba[...,:3]=255; rgba[...,3]=(soft*255).astype(np.uint8)
cv2.imwrite('public/cutouts/tr2-cut-mic.png',rgba)
capv=cv2.VideoCapture('public/footage/tr2-cut.mp4'); capm=cv2.VideoCapture('public/cutouts/tr2-cut-matte.mp4')
out=[]
for fi,bgc in [(96,(180,40,200)),(700,(90,30,40)),(840,(120,90,200))]:
    capv.set(cv2.CAP_PROP_POS_FRAMES,fi); _,f=capv.read(); capm.set(cv2.CAP_PROP_POS_FRAMES,fi); _,am=capm.read()
    a=np.maximum(am[...,0].astype(np.float32)/255, soft)[...,None]
    bg=np.zeros_like(f); bg[:]=bgc
    out.append((f*a+bg*(1-a)).astype(np.uint8)[380:900,0:440])
cv2.imwrite('/tmp/claude-0/-home-user-awesome-opus-5-5-prompts/61ad0f1a-77a7-5e04-8546-bd1e8a80b8f4/scratchpad/tr2/mic8.png',cv2.resize(np.hstack(out),None,fx=1.4,fy=1.4))
