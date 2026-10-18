import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function generateDotMatrixIcon() {
  const input = path.resolve('public/images/portraits/viven-hero-clean.png');
  if (!fs.existsSync(input)) {
    throw new Error(`File not found: ${input}`);
  }

  const size = 512;
  const radius = size / 2;

  // Sample the face area into a smaller grid for dot matrix
  const sampleSize = 128;
  const dotSpacing = 4; // pixels between dots in the sample
  const maxDotRadius = 2.2;

  // 1. Extract the face crop
  const faceBuffer = await sharp(input)
    .extract({ left: 0, top: 20, width: 334, height: 334 })
    .resize(sampleSize, sampleSize, { fit: 'cover' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: pixels, info } = faceBuffer;
  const { width: sw, height: sh, channels } = info;

  // 2. Build the dot matrix as an SVG
  const scale = size / sampleSize;
  let dots = '';

  const faceCx = sw / 2;
  const faceCy = sh * 0.42;
  const faceRadX = sw * 0.4;
  const faceRadY = sh * 0.4;

  for (let y = 0; y < sh; y += dotSpacing) {
    for (let x = 0; x < sw; x += dotSpacing) {
      const idx = (y * sw + x) * channels;
      const r = pixels[idx] / 255;
      const g = pixels[idx + 1] / 255;
      const b = pixels[idx + 2] / 255;
      const a = pixels[idx + 3] / 255;

      if (a < 0.15) continue;

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum < 0.03 && a < 0.8) continue;

      // Distance from face center for rim detection
      const nx = (x - faceCx) / faceRadX;
      const ny = (y - faceCy) / faceRadY;
      const dist = Math.sqrt(nx * nx + ny * ny);

      const dotR = maxDotRadius * (0.3 + lum * 0.7);

      const isRim = dist > 0.75 || y > sh * 0.62;
      const rimFactor = isRim ? Math.min(1.0, Math.pow(Math.max(0, dist - 0.55) / 0.5, 1.2)) : 0.0;

      let fillColor;
      if (rimFactor > 0.05) {
        // Golden-orange rim
        const oR = Math.round(Math.min(255, (lum * 0.6 + 0.4) * 255));
        const oG = Math.round(Math.min(255, (lum * 0.35 + 0.2) * rimFactor * 255 + lum * (1 - rimFactor) * 255));
        const oB = Math.round(Math.min(255, lum * (1 - rimFactor * 0.8) * 100));
        fillColor = `rgb(${oR},${oG},${oB})`;
      } else {
        // Grayscale
        const gray = Math.round(lum * 245);
        fillColor = `rgb(${gray},${gray},${gray})`;
      }

      const cx = x * scale;
      const cy = y * scale;
      const dr = dotR * scale;

      dots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${dr.toFixed(1)}" fill="${fillColor}" opacity="${(a * 0.92).toFixed(2)}"/>`;
    }
  }

  const dotMatrixSvg = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#0b0d12" rx="${radius}"/>
      ${dots}
      <circle cx="${radius}" cy="${radius}" r="${radius - 6}" fill="none" stroke="#f97316" stroke-width="10" opacity="0.7"/>
    </svg>
  `);

  // Render SVG to PNG
  const finalIcon = await sharp(dotMatrixSvg)
    .resize(size, size)
    .png()
    .toBuffer();

  // Write Next.js App Router icons
  fs.writeFileSync('src/app/icon.png', finalIcon);
  fs.writeFileSync('public/icon.png', finalIcon);
  fs.writeFileSync('public/icon-512.png', finalIcon);

  // 180x180 for Apple touch icon
  const appleIcon = await sharp(finalIcon).resize(180, 180).png().toBuffer();
  fs.writeFileSync('src/app/apple-icon.png', appleIcon);
  fs.writeFileSync('public/apple-touch-icon.png', appleIcon);

  // 32x32 for favicon
  const fav32 = await sharp(finalIcon).resize(32, 32).png().toBuffer();
  fs.writeFileSync('public/favicon-32x32.png', fav32);

  const fav16 = await sharp(finalIcon).resize(16, 16).png().toBuffer();
  fs.writeFileSync('public/favicon-16x16.png', fav16);

  // Valid ICO format header containing 32x32 PNG
  const icoHeader = Buffer.alloc(22);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // type 1 (ico)
  icoHeader.writeUInt16LE(1, 4); // count 1
  icoHeader.writeUInt8(32, 6);  // width
  icoHeader.writeUInt8(32, 7);  // height
  icoHeader.writeUInt8(0, 8);   // colors
  icoHeader.writeUInt8(0, 9);   // reserved
  icoHeader.writeUInt16LE(1, 10); // planes
  icoHeader.writeUInt16LE(32, 12); // bpp
  icoHeader.writeUInt32LE(fav32.length, 14); // image size
  icoHeader.writeUInt32LE(22, 18); // offset

  const icoBuffer = Buffer.concat([icoHeader, fav32]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);

  console.log('✓ Generated dot matrix website icons from portrait!');
}

generateDotMatrixIcon().catch((err) => {
  console.error(err);
  process.exit(1);
});
