import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function main() {
  const inputPath = path.resolve('ref/09_signature.jpg');
  const outputPath = path.resolve('public/images/portraits/viven-signature-clean.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const out = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Dark background suppression: if luminance is under 18, smoothly fade alpha to 0
      let alpha = 255;
      if (lum < 20) {
        alpha = Math.max(0, Math.round(255 * (lum / 20)));
      }

      // Soft feather bottom edge
      if (y > height * 0.88) {
        const bottomFade = Math.max(0, 1.0 - (y - height * 0.88) / (height * 0.12));
        alpha = Math.round(alpha * bottomFade);
      }

      out[idx + 3] = alpha;
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log('Saved signature clean to:', outputPath);
}

main().catch(console.error);
