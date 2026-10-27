"""Per-frame hand positions (source px) for a talking-head clip, so graphics can ride on the gestures.

For each frame, up to two hands: which side of the image it is on, the palm centre (mean of the wrist and the four
knuckles), the index fingertip and the thumb tip. Uses MediaPipe's hand landmarker in video mode.

Output: {"fps": 30, "w": 720, "h": 1280, "frames": [[{"side": "L"|"R", "palm": [x, y], "index": [x, y],
          "thumb": [x, y], "score": s}, ...], ...]}

usage: python handtrack.py CLIP.mp4 hand_landmarker.task OUT.json
Needs mediapipe, opencv. (Runs in .claude/skills/effects/.venv.)
"""
import json
import sys

import cv2
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import HandLandmarker, HandLandmarkerOptions, RunningMode

clip, model, out = sys.argv[1:4]
cap = cv2.VideoCapture(clip)
fps = cap.get(cv2.CAP_PROP_FPS)
w, h = int(cap.get(3)), int(cap.get(4))
det = HandLandmarker.create_from_options(HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model), running_mode=RunningMode.VIDEO, num_hands=2,
    min_hand_detection_confidence=0.4, min_tracking_confidence=0.4))
frames, i = [], 0
while True:
    ok, f = cap.read()
    if not ok:
        break
    res = det.detect_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(f, cv2.COLOR_BGR2RGB)), int(i * 1000 / fps))
    hands = []
    for lm, hd in zip(res.hand_landmarks, res.handedness):
        p = lambda k: [round(lm[k].x * w, 1), round(lm[k].y * h, 1)]
        palm = [round(sum(lm[k].x for k in (0, 5, 9, 13, 17)) / 5 * w, 1), round(sum(lm[k].y for k in (0, 5, 9, 13, 17)) / 5 * h, 1)]
        hands.append({"side": "L" if palm[0] < w / 2 else "R", "palm": palm, "index": p(8), "thumb": p(4), "score": round(hd[0].score, 2)})
    frames.append(hands)
    i += 1
json.dump({"fps": fps, "w": w, "h": h, "frames": frames}, open(out, "w"), separators=(",", ":"))
print(f"{i} frames, hands found in {sum(1 for x in frames if x)}")
