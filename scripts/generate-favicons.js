const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function makeIcons() {
  const rootDir = path.join(__dirname, '..');
  const src = path.join(rootDir, 'public', 'images', 'rise_up_consultancy_pune_logo.png');
  const iconsDir = path.join(rootDir, 'public', 'icons');
  fs.mkdirSync(iconsDir, { recursive: true });

  const sizes = [16, 32, 48, 96, 144, 192, 512];
  const pngBuffers = {};
  for (const s of sizes) {
    const buf = await sharp(src).resize(s, s).png().toBuffer();
    pngBuffers[s] = buf;
    fs.writeFileSync(path.join(iconsDir, `icon-${s}x${s}.png`), buf);
  }

  // Also create a 48x48 icon directly at public/favicon-48x48.png for Google Search Console
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon-48x48.png'), pngBuffers[48]);

  // Apple touch icon 180x180
  const appleBuf = await sharp(src).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleBuf);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'apple-icon.png'), appleBuf);

  // App router icon.png (512x512)
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'icon.png'), pngBuffers[512]);

  // Build proper multi-size .ico (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(icoSizes.length, 4); // count

  let offset = 6 + 16 * icoSizes.length;
  const dirEntries = [];
  const imageBuffers = [];

  for (const s of icoSizes) {
    const imgBuf = pngBuffers[s];
    imageBuffers.push(imgBuf);

    const entry = Buffer.alloc(16);
    entry.writeUInt8(s, 0); // width
    entry.writeUInt8(s, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(imgBuf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);

    offset += imgBuf.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...imageBuffers]);
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'favicon.ico'), icoBuffer);

  console.log(`[Favicon Generator] Successfully created multi-size ICO (${icoBuffer.length} bytes) and resized icons.`);
}

makeIcons().catch((err) => {
  console.error('[Favicon Generator Error]', err);
  process.exit(1);
});
