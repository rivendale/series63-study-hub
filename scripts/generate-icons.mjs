// Generates PNG icons from public/icon.svg using a tiny rasterizer.
// We avoid adding sharp/canvas deps; we ship a minimal solid-fill PNG
// that satisfies the PWA manifest and Apple touch icon requirements.
// If you want a high-fidelity raster, install sharp and replace this script.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

function makeSolidPng(size, [r, g, b, a] = [37, 99, 235, 255]) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.concat([t, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(crcBuf) >>> 0, 0);
    return Buffer.concat([len, t, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const row = Buffer.concat([Buffer.from([0]), Buffer.alloc(size * 4)]);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const off = 1 + j * 4;
      row[off] = r;
      row[off + 1] = g;
      row[off + 2] = b;
      row[off + 3] = a;
    }
  }
  const raw = Buffer.alloc(row.length * size);
  for (let i = 0; i < size; i++) row.copy(raw, i * row.length);
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

writeFileSync(resolve(outDir, 'icon-192.png'), makeSolidPng(192));
writeFileSync(resolve(outDir, 'icon-512.png'), makeSolidPng(512));
writeFileSync(resolve(outDir, 'favicon.ico'), makeSolidPng(32));
console.log('Generated icon-192.png, icon-512.png, favicon.ico in public/');
