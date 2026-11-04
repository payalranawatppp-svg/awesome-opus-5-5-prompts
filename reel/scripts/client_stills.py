"""Client-revised dashboard stills for the Magic Show edit (public/dash2 -> public/dash2c).

The client asked for: no red anywhere (it reads as blood), no doctors' names on referrals, the referring office
"R Dental" renamed "Gentle Dental", the specialist office signing as St. Andrew's Family Dental, and staff named
Barbara, Tanya, Amanda or Greg. Each edit erases a text run (filled with the surrounding background) and redraws the
new text in a matching font, size and colour measured from the original pixels; then every red/pink pixel is turned
amber.

usage: python scripts/client_stills.py
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, DST = "public/dash2", "public/dash2c"
INTER = "/usr/share/fonts/opentype/inter/Inter-Regular.otf"
INTER_MED = "/usr/share/fonts/opentype/inter/Inter-Medium.otf"
INTER_SEMI = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
ARIAL = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"


def ink_box(a, box, thr=70):
    """bbox (x0,y0,x1,y1) of the text pixels inside box, and the text colour."""
    x0, y0, x1, y1 = box
    reg = a[y0:y1, x0:x1].astype(np.int32)
    border = np.concatenate([reg[0], reg[-1], reg[:, 0], reg[:, -1]])
    bg = np.median(border, 0)
    d = np.abs(reg - bg).sum(2)
    ys, xs = np.nonzero(d > thr)
    if not len(xs):
        raise SystemExit(f"no text in {box}")
    lum = reg[..., :3].mean(2)
    sel = d > thr
    dark = reg[sel][np.argsort(lum[sel])[: max(5, sel.sum() // 6)]]
    return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1), tuple(int(v) for v in np.median(dark, 0)[:3]), tuple(int(v) for v in bg[:3])


def fit_font(path, ref, h):
    """font size whose rendering of ref has the same ink height (top of caps to bottom of descenders) as h."""
    best = None
    for s in np.arange(8, 60, 0.25):
        f = ImageFont.truetype(path, float(s))
        b = f.getbbox(ref)
        if best is None or abs((b[3] - b[1]) - h) < abs(best[1] - h):
            best = (f, b[3] - b[1])
    return best[0]


def replace(im, box, old, new, font=INTER, color=None, erase=None, f=None):
    """Erase the text run in box (old string) and draw new in its place, same size/colour, left-aligned."""
    a = np.asarray(im.convert("RGB"))
    (tx0, ty0, tx1, ty1), ink, bg = ink_box(a, box)
    f = f or fit_font(font, old, ty1 - ty0)
    d = ImageDraw.Draw(im)
    ex = erase or (box[0], ty0 - 3, box[2], ty1 + 3)
    d.rectangle(ex, fill=bg)
    b = f.getbbox(new)
    d.text((tx0 - b[0], ty0 - f.getbbox(old)[1]), new, font=f, fill=color or ink)
    return im


def avatar(im, center, r, text, font=INTER_SEMI, size=None):
    """Re-letter a round initials avatar: keep its fill, redraw the initials."""
    a = np.asarray(im.convert("RGB"))
    cx, cy = center
    fill = tuple(int(v) for v in np.median(a[cy - r + 3 : cy - r + 6, cx - 3 : cx + 3].reshape(-1, 3), 0))
    (tx0, ty0, tx1, ty1), ink, _ = ink_box(a, (cx - r + 3, cy - r + 3, cx + r - 3, cy + r - 3), thr=60)
    d = ImageDraw.Draw(im)
    d.ellipse((cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2), fill=fill)
    f = ImageFont.truetype(font, size) if size else fit_font(font, "RD", ty1 - ty0)
    d.text((cx, cy), text, font=f, fill=ink, anchor="mm")
    return im


def no_red(im):
    """Every red/pink pixel (hue within 22 deg of red, visibly saturated) becomes the same lightness of amber."""
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255
    mx, mn = a.max(2), a.min(2)
    c = mx - mn
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    cc = np.maximum(c, 1e-6)
    hue = np.where(mx == r, ((g - b) / cc) % 6, np.where(mx == g, (b - r) / cc + 2, (r - g) / cc + 4)) * 60
    sat = np.where(mx > 0, c / np.maximum(mx, 1e-6), 0)
    # reds, pinks and magentas (brand purple sits near 265 and is kept)
    red = (c > 0.025) & ((hue < 22) | (hue > 300)) & (sat > 0.03)
    # amber at hue 38: keep each pixel's max/min (lightness and chroma), rotate the hue
    h = 38 / 60
    out = a.copy()
    x = c * (1 - abs(h % 2 - 1))
    out[..., 0] = np.where(red, mx, r)
    out[..., 1] = np.where(red, mn + x, g)
    out[..., 2] = np.where(red, mn, b)
    return Image.fromarray((out * 255).round().astype(np.uint8)), int(red.sum())


def main():
    os.makedirs(DST, exist_ok=True)
    for name in ["an-00-kpis-ghost-rate", "an-02-senders-procedures", "an-03-volume-funnel", "an-07-outcomes-sources", "cs-04b-docusign-letter", "cs-05-signature-placed", "cs-07-signed-success"]:
        im = Image.open(f"{SRC}/{name}.jpg").convert("RGB")
        if name in ("an-02-senders-procedures", "an-03-volume-funnel"):
            y = 541 if name.startswith("an-02") else 158
            sender_row(im, y)
        if name == "an-07-outcomes-sources":
            replace(im, (1318, 470, 1450, 492), "Lee Davis", "Tanya", font=INTER_MED)
            replace(im, (1318, 494, 1450, 514), "Associate dentist", "Front Desk")
            avatar(im, (1291, 492), 18, "T", size=15)
        if name == "cs-04b-docusign-letter":
            letter(im, 0)
        if name == "cs-05-signature-placed":
            letter(im, -234)
        im, n = no_red(im)
        if name.startswith("cs-0"):
            # the DocuSign logo keeps its brand colours
            im.paste(Image.open(f"{SRC}/{name}.jpg").convert("RGB").crop((272, 18, 302, 50)), (272, 18))
            im.paste(Image.open(f"{SRC}/{name}.jpg").convert("RGB").crop((124, 792, 140, 808)), (124, 792))
        im.save(f"{DST}/{name}.jpg", quality=95)
        print(name, "red px ->amber:", n)


def sender_row(im, y):
    """The R DENTAL row of Top senders, centred at y."""
    a = np.asarray(im)
    (lx0, ly0, lx1, ly1), lcol, _ = ink_box(a, (555, y - 11, 700, y + 11))
    loc = fit_font(INTER, "East Syracuse, NY", ly1 - ly0)
    a0 = np.asarray(im).copy()
    (nx0, ny0, nx1, ny1), _, _ = ink_box(a0, (462, y - 13, 552, y + 13))
    name_f = fit_font(INTER, "R DENTAL", ny1 - ny0)
    replace(im, (462, y - 13, 552, y + 13), "R DENTAL", "Gentle Dental", erase=(462, y - 14, 798, y + 14))
    # the location follows the new, longer name
    d = ImageDraw.Draw(im)
    w = name_f.getlength("Gentle Dental")
    d.text((nx0 + w + (lx0 - nx1), ly0 - loc.getbbox("East Syracuse, NY")[1]), "East Syracuse, NY", font=loc, fill=lcol)
    avatar(im, (441, y), 14, "GD")


def letter(im, dy):
    """The DocuSign completion letter (cs-04b at dy=0; cs-05 is the same page scrolled up 234 px)."""
    rows = [
        (380, "Dr. Sarah Chen, DDS,MD", "Gentle Dental"),
        (483, "Dear Dr. Sarah Chen, DDS,MD,", "Dear Gentle Dental team,"),
        (582, "Dr. Sarah Chen, DDS,MD, thank you again for the kind referral and I appreciate the opportunity", "Thank you again for the kind referral. We truly appreciate the opportunity"),
        (688, "Lee Davis", "Amanda, St. Andrew's Family Dental"),
    ]
    H, W = im.size[1], im.size[0]
    # one size for the whole letter, measured on its unchanged line "Thank you for referring Bob Smith  to our..."
    ref = "Thank you for referring Bob Smith  to our office for treatment."
    a = np.asarray(im.convert("RGB"))
    (_, r0, _, r1), _, _ = ink_box(a, (470, 532 + dy - 14, 1100, 532 + dy + 14))
    lf = fit_font(ARIAL, ref, r1 - r0)
    for y, old, new in rows:
        yy = y + dy
        if yy < 185 or yy > H - 20:
            continue  # scrolled out of the page view
        if old == "Lee Davis" and dy:
            # cs-05: the signature field sits over this line: clear the line and the field, redraw both
            a0 = np.asarray(im.convert("RGB"))
            yellow = tuple(int(v) for v in a0[490, 522])
            navy = (36, 28, 84)
            d = ImageDraw.Draw(im)
            replace(im, (470, yy - 13, 516, yy + 13), "Lee", new, font=ARIAL, erase=(470, yy - 14, 900, yy + 14), f=lf)
            d.rectangle((514, 469, 668, 500), fill=(255, 255, 255))
            d.text((476 - lf.getbbox(new)[0], 0), "", font=lf)
            # redraw the part of the line the cleared box covered
            line = Image.new("RGB", (430, 30), (255, 255, 255))
            ImageDraw.Draw(line).text((0, 4), new, font=lf, fill=(20, 20, 20))
            src = np.asarray(im.convert("RGB"))
            (lx0, ly0, lx1, ly1), ink2, _ = ink_box(src, (470, yy - 13, 516, yy + 13))
            d.rectangle((470, yy - 14, 900, yy + 14), fill=(255, 255, 255))
            d.rectangle((600, yy - 26, 668, yy), fill=(255, 255, 255))  # the field's remove button
            d.text((lx0 - lf.getbbox(new)[0], ly0 - lf.getbbox("Lee")[1]), new, font=lf, fill=ink2)
            d.rectangle((518, 455, 638, 494), fill=yellow)
            d.rectangle((526, 461, 630, 484), outline=navy, width=2, fill=yellow)
            mf = ImageFont.truetype(MONO, 15)
            d.text((532, 472), "Amanda", font=mf, fill=navy, anchor="lm")
            continue
        replace(im, (470, yy - 14, 1330, yy + 14), old, new, font=ARIAL, f=lf)


def mono_field(im, box, text):
    a = np.asarray(im.convert("RGB"))
    (tx0, ty0, tx1, ty1), ink, bg = ink_box(a, box, thr=90)
    d = ImageDraw.Draw(im)
    d.rectangle((box[0] + 1, ty0 - 2, box[2] - 1, ty1 + 2), fill=bg)
    f = fit_font(MONO, "Lee Davis", ty1 - ty0)
    d.text((tx0, ty0 - f.getbbox("Lee Davis")[1]), text, font=f, fill=ink)


if __name__ == "__main__":
    main()


# ---------------------------------------------------------------------------------------------------
# The older dashboard recording (public/dash -> public/dashc), used by the Leak video: the specialist office
# "D Care Alliance" becomes St. Andrew's Family Dental, its associate dentist Lee Davis becomes Amanda (Office
# Manager), the referring dentist Sarah Chen becomes Greg (Front Desk), R DENTAL becomes Gentle Dental.

INTER_BOLD = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"


def runs(im, box, ref, ref_font, parts, right=None, size=None, scale=1.0):
    """Erase the line in box and draw parts [(text, font, colour)] in a row at the original text size.
    ref/ref_font: the original text of the line's first run, to measure the size. right: right-align at x."""
    a = np.asarray(im.convert("RGB"))
    (tx0, ty0, tx1, ty1), _, bg = ink_box(a, box)
    probe = fit_font(ref_font, ref, ty1 - ty0)
    top = ty0 - probe.getbbox(ref)[1]
    if size:
        probe2 = ImageFont.truetype(ref_font, size)
        top = ty1 - probe2.getbbox(ref)[3]  # keep the baseline
    size = (size or probe.size) * scale
    d = ImageDraw.Draw(im)
    d.rectangle((box[0], box[1], box[2], box[3]), fill=bg)
    fonts = [ImageFont.truetype(f, size) for _, f, _ in parts]
    width = sum(f.getlength(t) for (t, _, _), f in zip(parts, fonts))
    x = (right - width) if right else tx0
    for (t, _, c), f in zip(parts, fonts):
        d.text((x, top), t, font=f, fill=c)
        x += f.getlength(t)
    return x


def colour(im, box, thr=70):
    return ink_box(np.asarray(im.convert("RGB")), box, thr)[1]


def initials(im, box, text, fill=(231, 225, 251), ink=(110, 70, 230), size=17):
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = box
    a = np.asarray(im.convert("RGB"))
    bg = tuple(int(v) for v in a[y0 - 2, x0 - 2])
    d.rectangle(box, fill=bg)
    d.ellipse(box, fill=fill)
    d.text(((x0 + x1) / 2, (y0 + y1) / 2), text, font=ImageFont.truetype(INTER_SEMI, size), fill=ink, anchor="mm")


def old_stills():
    src, dst = "public/dash", "public/dashc"
    os.makedirs(dst, exist_ok=True)
    SA, SA2 = "St. Andrew's", "Family Dental"
    # rec-2: Incoming list
    im = Image.open(f"{src}/rec-2.jpg").convert("RGB")
    # the office name, right-aligned to the buttons (the building icon is dropped: the longer name needs the room)
    c = colour(im, (778, 36, 910, 60))
    runs(im, (740, 33, 916, 63), "D Care Alliance", INTER, [("St. Andrew's Family Dental", INTER, c)], right=908, scale=0.9)
    cn, cr = colour(im, (1690, 24, 1845, 47)), colour(im, (1690, 52, 1845, 74))
    runs(im, (1688, 22, 1845, 48), "Lee Davis", INTER_MED, [("Amanda", INTER_MED, cn)])
    runs(im, (1688, 51, 1845, 75), "Associate Dentist", INTER, [("Office Manager", INTER, cr)])
    initials(im, (1642, 29, 1682, 67), "A")
    a0 = np.asarray(im.convert("RGB"))
    (_, d0, _, d1), _, _ = ink_box(a0, (930, 477, 1046, 499))
    cell = fit_font(INTER, "D Care", d1 - d0).size
    for y1, y2 in [(488, 513), (604, 629), (707, 732)]:
        c = colour(im, (930, y1 - 11, 1046, y1 + 11))
        runs(im, (930, y1 - 12, 1047, y1 + 11), "D Care", INTER, [(SA, INTER, c)], size=cell)
        runs(im, (930, y2 - 11, 1047, y2 + 12), "Alliance", INTER, [(SA2, INTER, c)], size=cell)
    c = colour(im, (808, 708, 930, 732))
    runs(im, (806, 707, 930, 733), "R DENTAL", INTER, [("Gentle Dental", INTER, c)])
    # the "Consultation completed" pill is magenta-pink: turn the whole pill amber
    pill = im.crop((1040, 598, 1250, 636))
    pa = np.asarray(pill).astype(np.float32)
    lum = pa.mean(2, keepdims=True)
    amber = np.array([232, 157, 21], np.float32)
    soft = np.array([255, 241, 214], np.float32)
    t = np.clip((255 - lum) / (255 - 90), 0, 1)
    im.paste(Image.fromarray((soft * (1 - t) + amber * 0.75 * t).round().astype(np.uint8)), (1040, 598))
    im, n = no_red(im)
    im.save(f"{dst}/rec-2.jpg", quality=95)
    print("rec-2", n)

    # rec-18: case detail
    im = Image.open(f"{src}/rec-18.jpg").convert("RGB")
    c = colour(im, (389, 205, 580, 234))
    runs(im, (387, 204, 860, 235), "D Care Alliance", INTER, [("St. Andrew's Family Dental", INTER, c)])
    a = np.asarray(im)
    ImageDraw.Draw(im).rectangle((387, 239, 860, 272), fill=tuple(int(v) for v in a[236, 760]))
    dark = colour(im, (1460, 290, 1770, 312))
    runs(im, (1460, 288, 1800, 313), "Sarah Chen, DDS,MD (Oral Surgery", INTER_SEMI, [("Greg (Oral Surgery", INTER_SEMI, dark)])
    grey = colour(im, (1460, 348, 1565, 367))
    a0 = np.asarray(im.convert("RGB"))
    (_, d0, _, d1), _, _ = ink_box(a0, (1572, 348, 1700, 368))
    meta = fit_font(INTER, "Oct 26, 1:50 PM", d1 - d0).size
    runs(im, (1460, 346, 1568, 368), "Owner Dentist", INTER, [("Front Desk", INTER, grey)], size=meta, scale=1.15)
    men, body = colour(im, (1460, 371, 1567, 393)), colour(im, (1570, 371, 1785, 393))
    runs(im, (1460, 369, 1786, 394), "@Lee Davis Patient has a struamaan", INTER, [("@Amanda", INTER, men), (" Patient has a struamaan", INTER, body)])
    q = colour(im, (1472, 441, 1675, 459))
    runs(im, (1471, 440, 1682, 460), "Lee Davis (D Care Alliance)", INTER_SEMI, [("Amanda (St. Andrew's Family Dental)", INTER_SEMI, q)])
    men, body = colour(im, (1460, 488, 1567, 509)), colour(im, (1570, 488, 1670, 509))
    runs(im, (1460, 486, 1685, 511), "@Lee Davis Sure I Can", INTER, [("@Amanda", INTER, men), (" Sure I Can", INTER, body)])
    im, n = no_red(im)
    im.save(f"{dst}/rec-18.jpg", quality=95)
    print("rec-18", n)

    # rec-27.5: attachments (no names)
    im, n = no_red(Image.open(f"{src}/rec-27.5.jpg").convert("RGB"))
    im.save(f"{dst}/rec-27.5.jpg", quality=95)
    print("rec-27.5", n)

    # rec-47: messages
    im = Image.open(f"{src}/rec-47.jpg").convert("RGB")
    dark, grey = colour(im, (806, 319, 1030, 340)), colour(im, (1046, 320, 1170, 339))
    runs(im, (804, 317, 1300, 341), "Lee Davis (D Care Alliance)", INTER_SEMI, [("Amanda (St. Andrew's Family Dental)", INTER_SEMI, dark), ("   Office Manager   Oct 26, 1:49 PM", INTER, grey)])
    dark, grey = colour(im, (806, 386, 1210, 407)), colour(im, (1222, 387, 1320, 406))
    runs(im, (804, 384, 1450, 408), "Sarah Chen, DDS,MD (Oral Surgery Associates)", INTER_SEMI, [("Greg (Oral Surgery Associates)", INTER_SEMI, dark), ("   Front Desk   Oct 26, 1:50 PM", INTER, grey)])
    men, body = colour(im, (806, 410, 912, 433)), colour(im, (916, 410, 1300, 433))
    runs(im, (804, 409, 1310, 434), "@Lee Davis Patient has a struamaan implant 3D titanuim", INTER, [("@Amanda", INTER, men), (" Patient has a struamaan implant 3D titanuim", INTER, body)])
    q = colour(im, (816, 453, 1015, 471))
    runs(im, (815, 452, 1030, 472), "Lee Davis (D Care Alliance)", INTER_SEMI, [("Amanda (St. Andrew's Family Dental)", INTER_SEMI, q)])
    men, body = colour(im, (806, 500, 912, 522)), colour(im, (916, 500, 1010, 522))
    runs(im, (804, 499, 1015, 523), "@Lee Davis Sure I Can", INTER, [("@Amanda", INTER, men), (" Sure I Can", INTER, body)])
    initials(im, (736, 318, 781, 363), "A")
    initials(im, (736, 385, 781, 430), "G", fill=(220, 240, 230), ink=(20, 120, 80))
    im, n = no_red(im)
    im.save(f"{dst}/rec-47.jpg", quality=95)
    print("rec-47", n)


if __name__ == "__main__" and os.environ.get("OLD"):
    old_stills()
