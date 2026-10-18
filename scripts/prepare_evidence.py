import os
from PIL import Image, ImageDraw, ImageFilter
import pypdfium2 as pdfium

def prepare_evidence():
    os.makedirs('public/images/portraits', exist_ok=True)
    os.makedirs('public/images/awards', exist_ok=True)
    os.makedirs('public/images/training', exist_ok=True)
    os.makedirs('public/images/coding', exist_ok=True)
    os.makedirs('public/images/team', exist_ok=True)

    # 1. Rotate black.jpeg (BLACKBOX AI 1.0) 270 deg (counter-clockwise 90) & crop border
    print("Processing black.jpeg...")
    with Image.open('ref/black.jpeg') as img:
        rot = img.rotate(270, expand=True)
        w, h = rot.size
        # Trim outer frame slightly: 20px padding
        cropped = rot.crop((20, 20, w - 20, h - 20))
        cropped.save('public/images/awards/blackbox-certificate.jpg', quality=95)

    # 2. Process dec.jpeg (DECODEX 2.0) - MASK THE ROLL NUMBER
    print("Processing dec.jpeg with roll number privacy mask...")
    with Image.open('ref/dec.jpeg') as img:
        img_masked = img.copy()
        draw = ImageDraw.Draw(img_masked)
        
        # Roll number bounding box: 25R11A0CM
        # Absolute coords: x from 210 to 450, y from 770 to 825
        x1, y1, x2, y2 = 215, 770, 445, 825
        
        # We sample background color around it (clean light off-white paper #f2f2f2)
        # and blur the roll number area heavily, then place a clean subtle censorship badge
        box_region = img.crop((x1, y1, x2, y2))
        blurred_box = box_region.filter(ImageFilter.GaussianBlur(radius=8))
        img_masked.paste(blurred_box, (x1, y1))
        
        # Draw a clean privacy pill/tag over it: "[CONFIDENTIAL]" or dark obsidian pill
        draw.rounded_rectangle([x1 + 5, y1 + 6, x2 - 5, y2 - 6], radius=4, fill=(30, 32, 40), outline=(139, 92, 246), width=1)
        # Draw text indicator
        # We can draw small dot indicators or line inside pill
        for dot_x in range(x1 + 25, x2 - 25, 18):
            draw.ellipse([dot_x - 3, (y1 + y2)//2 - 3, dot_x + 3, (y1 + y2)//2 + 3], fill=(244, 242, 236))
            
        img_masked.save('public/images/awards/decodex-certificate.jpg', quality=95)

    # 3. Process launch_trof.jpeg
    print("Processing launch_trof.jpeg...")
    with Image.open('ref/launch_trof.jpeg') as img:
        img.save('public/images/awards/launchpadx-trophy.jpg', quality=95)

    # 4. Process launch.jpeg
    print("Processing launch.jpeg...")
    with Image.open('ref/launch.jpeg') as img:
        img.save('public/images/awards/launchpadx-certificate.jpg', quality=95)

    # 5. Process dec_cert.jpeg (team photo - event context)
    print("Processing dec_cert.jpeg...")
    with Image.open('ref/dec_cert.jpeg') as img:
        img.save('public/images/team/decodex-group.jpg', quality=95)

    # 6. Process leetcode.jpeg
    print("Processing leetcode.jpeg...")
    with Image.open('ref/leetcode.jpeg') as img:
        img.save('public/images/coding/leetcode-50-days.jpg', quality=95)

    # 7. Process aws badge png
    print("Processing aws badge...")
    with Image.open('ref/aws-simulearn-cloud-practitioner-training-badge (1).png') as img:
        img.save('public/images/training/aws-simulearn-badge.png')

    # 8. Rasterize aws-simulearn.pdf (Page 1)
    print("Rasterizing aws-simulearn.pdf...")
    doc1 = pdfium.PdfDocument('ref/aws-simulearn.pdf')
    page1 = doc1[0]
    # Render at scale 2.5 for crisp text
    image1 = page1.render(scale=2.5).to_pil()
    image1.save('public/images/training/aws-simulearn-certificate.jpg', quality=95)

    # 9. Rasterize awscloud-quest-cloudpractitione.pdf (Page 1)
    print("Rasterizing awscloud-quest-cloudpractitione.pdf...")
    doc2 = pdfium.PdfDocument('ref/awscloud-quest-cloudpractitione.pdf')
    page2 = doc2[0]
    image2 = page2.render(scale=2.5).to_pil()
    image2.save('public/images/training/aws-cloudquest-certificate.jpg', quality=95)

    # 10. Copy and map Portraits
    print("Processing portraits...")
    portrait_map = {
        '01_professional.jpg': 'viven-standing.jpg',
        '04_achiever.jpg': 'viven-launchpad-trophy.jpg',
        '02_developer.jpg': 'viven-hackathon-candid.jpg',
        '03_explorer.jpg': 'viven-explorer.jpg',
        '05_focused.jpg': 'viven-focused.jpg',
        '06_student.jpg': 'viven-student.jpg',
        '07_dreamer.jpg': 'viven-dreamer.jpg',
        '08_real-me.jpg': 'viven-real-me.jpg',
        '09_signature.jpg': 'viven-signature.jpg'
    }

    for src_name, dst_name in portrait_map.items():
        src_path = os.path.join('ref', src_name)
        if os.path.exists(src_path):
            with Image.open(src_path) as img:
                img.save(os.path.join('public/images/portraits', dst_name), quality=95)
                if src_name == '01_professional.jpg':
                    # Also save as viven-professional.jpg
                    img.save('public/images/portraits/viven-professional.jpg', quality=95)

    print("Evidence preparation complete! All assets placed into public/images/.")

if __name__ == '__main__':
    prepare_evidence()
