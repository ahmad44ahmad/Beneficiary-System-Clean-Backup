#!/usr/bin/env python
"""Optimize screenshots (resize + JPEG), rebuild a smaller docx for Drive upload."""
import os, shutil, sys
from PIL import Image

SRC = r"C:\dev\basira\docs\guide\assets\screenshots"
OPT = r"C:\dev\basira\docs\guide\assets\screenshots_opt"
os.makedirs(OPT, exist_ok=True)

MAX_WIDTH = 1280

count = 0
for fn in sorted(os.listdir(SRC)):
    if not fn.lower().endswith((".png", ".jpg", ".jpeg")):
        continue
    src = os.path.join(SRC, fn)
    base = os.path.splitext(fn)[0]
    out = os.path.join(OPT, base + ".jpg")
    try:
        img = Image.open(src).convert("RGB")
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_size = (MAX_WIDTH, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        img.save(out, "JPEG", quality=78, optimize=True)
        count += 1
    except Exception as e:
        print(f"FAIL {fn}: {e}")

# Total size
total = sum(os.path.getsize(os.path.join(OPT, f)) for f in os.listdir(OPT))
print(f"Optimized {count} images, total {total/1024:.1f} KB in {OPT}")
