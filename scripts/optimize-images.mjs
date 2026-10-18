import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve('public/images');
const MANIFEST_PATH = path.join(IMAGES_DIR, 'manifest.json');

const SUBDIRS = ['portraits', 'awards', 'training', 'coding', 'team'];

async function optimize() {
  const manifest = {};

  for (const dir of SUBDIRS) {
    const fullDir = path.join(IMAGES_DIR, dir);
    if (!fs.existsSync(fullDir)) continue;

    const files = fs.readdirSync(fullDir);
    for (const file of files) {
      if (file.endsWith('.json') || file.endsWith('.md')) continue;
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

      const baseName = path.basename(file, ext);
      const filePath = path.join(fullDir, file);
      const key = `${dir}/${baseName}`;

      try {
        const metadata = await sharp(filePath).metadata();
        const { width, height } = metadata;

        // Generate tiny 16px blur placeholder
        const blurBuffer = await sharp(filePath)
          .resize(16, Math.max(1, Math.round(16 * (height / width))))
          .toFormat('webp', { quality: 20 })
          .toBuffer();
        const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

        // Generate WebP and AVIF optimized versions
        const webpPath = path.join(fullDir, `${baseName}.webp`);
        if (!fs.existsSync(webpPath) || ext !== '.webp') {
          await sharp(filePath)
            .webp({ quality: 85 })
            .toFile(webpPath);
        }

        manifest[key] = {
          key,
          src: `/images/${dir}/${file}`,
          webp: `/images/${dir}/${baseName}.webp`,
          width,
          height,
          aspectRatio: (width / height).toFixed(4),
          blurDataURL,
        };

        console.log(`Optimized [${key}]: ${width}x${height}`);
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
      }
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Manifest written to ${MANIFEST_PATH} with ${Object.keys(manifest).length} images.`);
}

optimize().catch((err) => {
  console.error(err);
  process.exit(1);
});
