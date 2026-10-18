import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function generateIcons() {
  const input = path.resolve('public/images/portraits/viven-professional.jpg');
  if (!fs.existsSync(input)) {
    throw new Error(`File not found: ${input}`);
  }

  const size = 512;
  const radius = size / 2;

  // Extract square crop around the face (width 334, height 418, crop from top 15)
  const faceBuffer = await sharp(input)
    .extract({ left: 0, top: 15, width: 334, height: 334 })
    .resize(size, size, { fit: 'cover' })
    .toBuffer();

  // Create circular mask with gold/amber accent rim
  const circleMask = Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius - 12}" fill="white" />
    </svg>
  `);

  const borderRing = Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius - 6}" fill="none" stroke="#f59e0b" stroke-width="12" />
    </svg>
  `);

  const bgCircle = Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="#0b0d12" />
    </svg>
  `);

  const maskedFace = await sharp(faceBuffer)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .toBuffer();

  const finalIcon = await sharp(bgCircle)
    .composite([
      { input: maskedFace, top: 0, left: 0 },
      { input: borderRing, top: 0, left: 0 }
    ])
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

  console.log('Successfully generated all website icons from user portrait!');
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});
