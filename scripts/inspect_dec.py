import os
from PIL import Image, ImageDraw, ImageFilter
import pypdfium2 as pdfium

os.makedirs('public/images/portraits', exist_ok=True)
os.makedirs('public/images/awards', exist_ok=True)
os.makedirs('public/images/training', exist_ok=True)
os.makedirs('public/images/coding', exist_ok=True)
os.makedirs('public/images/team', exist_ok=True)

print("Directories created.")

# 1. Inspect dec.jpeg
with Image.open('ref/dec.jpeg') as img:
    w, h = img.size
    print(f"dec.jpeg size: {w}x{h}")
