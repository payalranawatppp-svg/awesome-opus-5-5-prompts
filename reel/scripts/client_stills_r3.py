"""Clean the dashboard recording 3 frames for Script 13 (public/dash3 -> public/dash3c), per the client rules.

Doctor names out (Dr Lee Davis -> Amanda, Office Manager; Tom Colpack and Flora Gibson -> Greg, Front Desk; Jane White
-> Tanya), offices renamed (receiving "Gentle dental clinic" -> St. Andrew's Family Dental, referring "Apex Dental"
-> Gentle Dental), the real-looking email and phone numbers blurred, red turned amber. Line positions come from OCR
of each frame (rapidocr); text is redrawn in Inter at the measured size and colour.

usage: python scripts/client_stills_r3.py SRC_FRAMES_DIR   (tNN.png frames of the recording at 1 fps)
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, os.path.dirname(__file__))
from client_stills import INTER, INTER_MED, INTER_SEMI, fit_font, ink_box, no_red  # noqa: E402

INTER_BOLD = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
DST = "public/dash3c"
SA = "St. Andrew's Family Dental"
GD = "Gentle Dental"


def measure(im, box, ref, font):
    """font sized so ref matches the ink height in box; plus the ink top, ink colour and background."""
    a = np.asarray(im.convert("RGB"))
    (x0, y0, x1, y1), ink, bg = ink_box(a, box)
    f = fit_font(font, ref, y1 - y0)
    return f, x0, y0 - f.getbbox(ref)[1], ink, bg


def erase(im, box, bg):
    ImageDraw.Draw(im).rectangle(box, fill=bg)


def size_h(im, box, ref, font):
    """font size of an unchanged line of the same style, matched on ink height."""
    return measure(im, box, ref, font)[0].size


def size_of(im, box, ref, font):
    """font size of an unchanged line of the same style elsewhere in the frame, matched on the ink WIDTH of ref
    (the app's text renders narrower than Inter at the same height, so width is the better match)."""
    (x0, _, x1, _), _, _ = ink_box(np.asarray(im.convert("RGB")), box)
    best = min(np.arange(10, 40, 0.25), key=lambda s: abs(ImageFont.truetype(font, float(s)).getlength(ref) - (x1 - x0)))
    return float(best)


def line(im, box, ref, font, parts, right=None, pad=3, size=None, x0=None, squeeze=1.0):
    """Erase box and draw parts [(text, fontfile, colour or None for the ink colour, scale)] from the left ink edge.
    size: the font size to use (from size_of on an unchanged line), else measured from the ink in box."""
    f, x, top, ink, bg = measure(im, box, ref, font)
    if size:
        a = np.asarray(im.convert("RGB"))
        (_, iy0, _, iy1), _, _ = ink_box(a, box)
        f = ImageFont.truetype(font, size)
        top = iy0 - f.getbbox(ref)[1]
    if x0 is not None:
        x = x0
    erase(im, (box[0], box[1] - pad, box[2], box[3] + pad), bg)
    fonts = [ImageFont.truetype(p[1], f.size * (p[3] if len(p) > 3 else 1)) for p in parts]
    if right is not None:
        x = right - sum(ff.getlength(p[0]) for p, ff in zip(parts, fonts))
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
    dl = ImageDraw.Draw(layer)
    xs = x
    for p, ff in zip(parts, fonts):
        sc = p[3] if len(p) > 3 else 1
        y = top + (f.getbbox("Ag")[3] - ff.getbbox("Ag")[3]) if sc != 1 else top
        dl.text((x, y), p[0], font=ff, fill=(p[2] or ink) + (255,))
        x += ff.getlength(p[0])
    if squeeze != 1:
        bb = layer.getbbox()
        if bb:
            piece = layer.crop((int(xs), bb[1], bb[2], bb[3]))
            piece = piece.resize((max(1, int(piece.width * squeeze)), piece.height), Image.LANCZOS)
            layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
            layer.paste(piece, (int(xs), bb[1]))
    im.paste(layer, (0, 0), layer)


def blur(im, box, r=7):
    im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(r)), box[:2])


def sample(im, xy):
    return tuple(int(v) for v in np.asarray(im.convert("RGB"))[xy[1], xy[0]])


def tile(im, box, text, fill=(231, 225, 251), ink=(110, 70, 230)):
    d = ImageDraw.Draw(im)
    bg = sample(im, (box[0] - 3, box[1] - 3))
    d.rectangle(box, fill=bg)
    d.rounded_rectangle(box, radius=10, fill=fill)
    d.text(((box[0] + box[2]) / 2, (box[1] + box[3]) / 2), text, font=ImageFont.truetype(INTER_BOLD, (box[3] - box[1]) * 0.42), fill=ink, anchor="mm")


GREY = (120, 116, 140)
PURPLE = (124, 77, 236)


def t11(im):  # Messages tab
    hb = size_h(im, (802, 509, 1000, 536), "TomColpack", INTER_BOLD)
    body = size_h(im, (802, 535, 1470, 567), "@Barbara Smith I updated the latest xray let me know if you need anything", INTER)
    line(im, (730, 329, 960, 356), "Messaging with Apex Dental", INTER, [("Messaging with " + GD, INTER, None)])
    line(im, (540, 464, 660, 493), "Apex Dental", INTER, [(GD, INTER, None)], right=658)
    line(im, (430, 502, 660, 529), "Gentle dental clinic", INTER, [(SA, INTER, None)], right=657)
    for box, t in [((800, 434, 1440, 465), "9:52 AM"), ((802, 581, 1440, 609), "9:55 AM")]:
        line(im, box, "Dr Lee Davis DDS", INTER_BOLD, [("Amanda (" + SA + ")", INTER_BOLD, None), ("   Office Manager   Nov 7, " + t, INTER, GREY, 0.82)], size=hb, x0=805)
    line(im, (802, 509, 1320, 536), "TomColpack, DDS", INTER_BOLD, [("Greg (" + GD + ")", INTER_BOLD, None), ("   Front Desk   Nov 7, 9:54 AM", INTER, GREY, 0.82)], size=hb, x0=805)
    line(im, (800, 466, 1590, 496), "@Flora Gibson Seems like", INTER, [("@Greg", INTER_MED, PURPLE), (" Seems like the x-rays are from May 2022. Do you have updated x-rays?", INTER, (30, 28, 45))], size=body, x0=804, pad=1)
    line(im, (814, 618, 1060, 641), "Tom Colpack, DDS (Apex Dental)", INTER_SEMI, [("Greg (" + GD + ")", INTER_SEMI, None)], size=int(body * 0.85), pad=1)
    line(im, (802, 668, 1290, 697), "@Tom Colpack, DDS Got the updated", INTER, [("@Greg", INTER_MED, PURPLE), (" Got the updated x-ray, thank you!", INTER, (30, 28, 45))], size=body, x0=804)
    line(im, (742, 742, 935, 773), "Message Apex Dental", INTER, [("Message " + GD, INTER, None)])
    for y in (436, 583):  # the specialist office's logo avatar -> initials
        tile(im, (737, y, 782, y + 45), "SA")


def t14(im):  # Incoming list: referring Apex -> Gentle Dental, receiving Gentle dental clinic -> St. Andrew's
    dental = sample(im, (812, 460))
    f, x, top, ink, bg = measure(im, (805, 444, 870, 476), "Dental", INTER)
    line(im, (832, 419, 880, 448), "Apex", INTER, [("Gentle", INTER, ink)], size=f.size, x0=x + 26, pad=1)
    for y in (405, 545, 684, 810):
        f, x, top, ink, bg = measure(im, (938, y - 2, 1004, y + 28), "Gentle", INTER)
        erase(im, (938, y - 3, 1046, y + 86), bg)
        d = ImageDraw.Draw(im)
        for k, w in enumerate(["St. Andrew's", "Family", "Dental"]):
            d.text((x, top + k * 28), w, font=ImageFont.truetype(INTER, f.size * 0.92), fill=ink)


def t20(im):
    line(im, (1396, 51, 1590, 85), "Message Apex Dental", INTER, [("Message " + GD, INTER, None)])


def t28(im):
    line(im, (1452, 296, 1560, 324), "JaneWhite", INTER_SEMI, [("Tanya", INTER_SEMI, None)])
    tile(im, (1402, 302, 1440, 332), "TA", fill=(84, 92, 199), ink=(255, 255, 255))


def t51(im):  # Activity log (the audit trail)
    sz = size_h(im, (415, 108, 541, 138), "Barbara Smith", INTER_SEMI)
    sq = size_of(im, (415, 108, 541, 138), "Barbara Smith", INTER_SEMI) / sz  # the app font is narrower
    rows = [
        ((414, 211, 870, 236), "Tanya", "(11/7/2026 10:04 am)", " scheduled Referral"),
        ((412, 253, 900, 281), "Tanya", "(11/7/2026 10:02 am)", " updated: x-rays added"),
        ((414, 296, 960, 324), "Amanda", "(11/7/2026 9:55 am)", " scheduled Referral"),
        ((414, 370, 945, 395), "Amanda", "(11/7/2026 9:45 am)", " received Referral"),
        ((415, 412, 1080, 440), "Greg", "(11/7/2026 9:41 am)", " new referral created for " + SA),
    ]
    for box, who, when, what in rows:
        line(im, box, "JaneWhite", INTER_SEMI, [(who + " ", INTER_SEMI, (40, 38, 55)), (when, INTER, GREY), (what, INTER, (40, 38, 55))], size=sz, x0=418, squeeze=sq)


def t53(im):  # Primary referral source
    tile(im, (391, 568, 528, 648), "GD", fill=(225, 240, 233), ink=(20, 120, 80))
    line(im, (410, 669, 560, 697), "Apex Dental", INTER_SEMI, [(GD, INTER_SEMI, None)])
    blur(im, (476, 770, 610, 803))
    blur(im, (476, 805, 700, 840))


JOBS = {"t11": ("r3c-messages", t11), "t14": ("r3c-incoming", t14), "t20": ("r3c-status-xrays", t20),
        "t22": ("r3c-admin-notes", None), "t28": ("r3c-insurance", t28), "t51": ("r3c-activity-log", t51),
        "t53": ("r3c-referral-source", t53)}

if __name__ == "__main__":
    src = sys.argv[1]
    os.makedirs(DST, exist_ok=True)
    for t, (name, fn) in JOBS.items():
        im = Image.open(f"{src}/{t}.png").convert("RGB")
        if fn:
            fn(im)
        im, n = no_red(im)
        im.save(f"{DST}/{name}.jpg", quality=94)
        print(name, n)
