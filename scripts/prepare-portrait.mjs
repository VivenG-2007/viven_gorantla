import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function main() {
  const inputPath = path.resolve('ref/01_professional.jpg');
  const outputPath = path.resolve('public/images/portraits/viven-hero-clean.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const out = Buffer.from(data);

  // Center of face
  const cx = width * 0.52;
  const cy = height * 0.38;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Distance from face center
      const dx = (x - cx) / (width * 0.28);
      const dy = (y - cy) / (height * 0.28);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Strong skin detection: warm reddish-yellow tone
      const isSkin = (r > g) && (g > b) && (r - b > 22) && (r > 70);
      
      // Face core
      const isCoreFace = dist < 0.85;

      // Chest collar
      const isCollar = (y > height * 0.52) && (Math.abs(x - cx) < width * 0.2) && (r > 150 && g > 150 && b > 150);

      // Suit
      const isSuit = (y > height * 0.55) && (lum < 75);

      // Hair: dark and located in upper head region
      const isHair = (lum < 60) && (dist < 1.35) && (y < height * 0.5);

      // Window background condition
      const isWindowBg = (y < height * 0.68) && (b > r - 15) && (lum > 65) && !isSkin && !isCoreFace;

      let alpha = 255;
      if (isWindowBg) {
        alpha = 0;
      } else if (!isSkin && !isHair && !isSuit && !isCollar && !isCoreFace) {
        if (dist > 1.2 && y < height * 0.65) {
          alpha = 0;
        }
      }

      // Smooth fade bottom
      if (y > height * 0.88) {
        const bottomFade = Math.max(0, 1.0 - (y - height * 0.88) / (height * 0.12));
        alpha = Math.round(alpha * bottomFade);
      }

      out[idx + 3] = alpha;
    }
  }

  // Smooth the alpha channel slightly using a 3x3 box blur on alpha only
  const smoothed = Buffer.from(out);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4 + 3;
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          sum += out[((y + dy) * width + (x + dx)) * 4 + 3];
        }
      }
      smoothed[idx] = Math.round(sum / 9);
    }
  }

  await sharp(smoothed, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log('Saved clean segmented portrait to:', outputPath);
}

main().catch(console.error);
