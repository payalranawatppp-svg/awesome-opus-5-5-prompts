import cv2, json, numpy as np
e = json.load(open('edl.json'))['segments']
cas = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture('/home/user/awesome-opus-5-5-prompts/reel/public/footage/d1-cut.mp4')
out = []
for s in e:
    boxes = []
    for t in np.linspace(s['start'] + 0.1, s['start'] + s['dur'] - 0.1, 8):
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, fr = cap.read()
        if not ok: continue
        g = cv2.cvtColor(cv2.resize(fr, (540, 960)), cv2.COLOR_BGR2GRAY)
        f = cas.detectMultiScale(g, 1.1, 6, minSize=(80, 80))
        if len(f): boxes.append(max(f, key=lambda b: b[2] * b[3]) * 2)
    b = np.array(boxes)
    x, y, w, h = (b[:, 0].min(), b[:, 1].min(), (b[:, 0] + b[:, 2]).max() - b[:, 0].min(), (b[:, 1] + b[:, 3]).max() - b[:, 1].min()) if len(b) else (0, 0, 0, 0)
    # source-space head span: hair above the face box, chin below
    top, bot = y - 0.45 * (h / 1.15), y + h * 1.12
    # framing used in the composition (scale about origin)
    sc = 1.35 if s['zoom'] == 'top135' else 1.10   # worst-case zoom incl. punch-in + drift
    oy = 0 if s['zoom'] == 'top135' else 0.32 * 1920
    T, B = oy + (top - oy) * sc, oy + (bot - oy) * sc
    out.append({'i': s['i'], 'n': len(b), 'top': int(T), 'bot': int(B), 'x': int(x), 'w': int(w)})
    print(out[-1])
json.dump(out, open('/home/user/awesome-opus-5-5-prompts/reel/src/data/d1-faces.json', 'w'))
