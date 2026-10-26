"""Mask of everything fixed in front of the speaker in the "PDF dead end" set: the mic (cable, clamp, pole, mount,
grille, body) and the laptop edge bottom left. Traced as polygons (the camera is locked off and these never move
between takes), feathered by a pixel. Writes public/cutouts/pd-cut-mic.png (RGBA, alpha = in front), 720x1280.
Used by morph_cuts.py (kept unwarped) and by the composition (kept in front of graphics behind the speaker)."""
import cv2
import numpy as np

polys = [
    [(0, 562), (38, 566), (60, 600), (72, 645), (58, 650), (44, 606), (28, 581), (0, 580)],  # cable
    [(0, 630), (55, 630), (72, 652), (80, 700), (98, 778), (102, 812), (80, 818), (60, 760), (45, 750), (0, 747)],  # clamp, XLR barrel
    [(18, 745), (72, 745), (72, 865), (18, 865)],  # pole
    [(0, 860), (30, 845), (100, 820), (150, 811), (200, 819), (226, 845), (230, 885), (208, 916), (160, 945), (150, 958),
     (110, 995), (60, 1045), (0, 1066)],  # mount, grille, body
    [(0, 1110), (85, 1102), (100, 1120), (124, 1280), (0, 1280)],  # laptop edge
]
m = np.zeros((1280, 720), np.uint8)
for p in polys:
    cv2.fillPoly(m, [np.array(p, np.int32)], 255)
m = cv2.GaussianBlur(m, (3, 3), 0)
rgba = np.dstack([np.full_like(m, 255)] * 3 + [m])
cv2.imwrite("public/cutouts/pd-cut-mic.png", rgba)
print("front mask covers", round((m > 128).mean() * 100, 1), "% of the frame")
