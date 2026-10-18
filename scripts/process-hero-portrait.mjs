import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function processHero() {
  const input = 'C:/Users/viven/.gemini/antigravity-ide/brain/2ba43297-8964-4906-81ba-54329b51b515/.user_uploaded/media_1792336453713.jpg';
  if (!fs.existsSync(input)) {
    throw new Error(`File not found: ${input}`);
  }

  // Also copy original jpg into public/images/portraits
  fs.copyFileSync(input, 'public/images/portraits/viven-hero-raw.jpg');

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const maxVal = Math.max(r, g, b);
    if (maxVal <= 6) {
      out[i + 3] = 0;
    } else if (maxVal <= 18) {
      // Soft antialiasing on hair/suit boundary
      out[i + 3] = Math.round(((maxVal - 6) / 12) * 255);
    }
  }

  // Save clean portrait
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ quality: 95 })
    .toFile('public/images/portraits/viven-hero-clean.png');

  console.log('✓ Successfully processed and updated public/images/portraits/viven-hero-clean.png');
}

processHero().catch((err) => {
  console.error(err);
  process.exit(1);
});
