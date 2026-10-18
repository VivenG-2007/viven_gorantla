import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function generateParticleData(imageName, options = {}) {
  const filePath = path.resolve('public/images/portraits', imageName);
  const { width = 200, height = 250, threshold = 20 } = options;

  const { data, info } = await sharp(filePath)
    .resize(width, height, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const points = [];
  const cx = info.width / 2;
  const cy = info.height * 0.42;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Distance from center
      const nx = (x - cx) / (info.width * 0.5);
      const ny = (y - cy) / (info.height * 0.5);
      const rad = Math.sqrt(nx * nx + ny * ny);

      if (lum < 0.08 && rad > 0.8) continue;

      // Volumetric head depth: ellipsoid
      const ellipsoid = Math.sqrt(Math.max(0, 1.0 - Math.min(1.0, nx * nx * 1.2 + ny * ny * 0.9)));
      const z = ellipsoid * 0.45 + (lum - 0.5) * 0.25;

      points.push({
        x: (x / info.width - 0.5) * 2.8,
        y: -(y / info.height - 0.5) * 3.5,
        z,
        lum,
        isEdge: rad > 0.65 || (nx > 0.4 || nx < -0.4)
      });
    }
  }

  console.log(`[${imageName}] generated ${points.length} particles.`);
  return points;
}

async function run() {
  await generateParticleData('viven-signature.jpg', { width: 190, height: 238 });
  await generateParticleData('viven-professional.jpg', { width: 190, height: 238 });
}

run();
