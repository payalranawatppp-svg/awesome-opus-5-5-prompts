"""Per-frame face boxes (source pixel coords) for each clip, smoothed, as JSON.

Output: {clipName: {"fps": 24, "w": 720, "h": 1280, "faces": [[x, y, w, h], ...]}}
"""
import json
import sys

import cv2
import numpy as np

cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
out_path = sys.argv[1]
result = {}
for path in sys.argv[2:]:
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    boxes = []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        found = cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=6, minSize=(150, 150))
        if len(found):
            boxes.append(max(found, key=lambda b: b[2] * b[3]).astype(float).tolist())
        else:
            boxes.append(None)
    # Fill gaps by nearest neighbour, then smooth with a centred moving average.
    idx = [i for i, b in enumerate(boxes) if b is not None]
    filled = []
    for i in range(len(boxes)):
        j = min(idx, key=lambda k: abs(k - i))
        filled.append(boxes[j])
    arr = np.array(filled)
    k = 5
    pad = np.pad(arr, ((k // 2, k // 2), (0, 0)), mode="edge")
    smooth = np.stack([pad[i : i + len(arr)] for i in range(k)]).mean(axis=0)
    name = path.rsplit("/", 1)[-1]
    result[name] = {
        "fps": fps,
        "w": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        "h": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
        "faces": [[round(v, 1) for v in row] for row in smooth.tolist()],
    }
    missing = len(boxes) - len(idx)
    print(
        f"{name}: frames={len(boxes)} missing={missing} "
        f"x={arr[:,0].min():.0f}-{(arr[:,0]+arr[:,2]).max():.0f} "
        f"y={arr[:,1].min():.0f}-{(arr[:,1]+arr[:,3]).max():.0f} "
        f"w={arr[:,2].min():.0f}-{arr[:,2].max():.0f}"
    )

with open(out_path, "w") as f:
    json.dump(result, f)
