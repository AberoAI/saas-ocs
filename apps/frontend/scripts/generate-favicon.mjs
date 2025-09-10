// apps/frontend/scripts/generate-favicon.mjs
// (perbaikan: PNG ke /public agar tidak 404; path-independent; alpha benar)

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

// Resolve paths relatif terhadap file ini, bukan CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, "..", "app");
const publicDir = path.resolve(__dirname, "..", "public"); // <- output PNG ke /public

const inputSvg = path.join(appDir, "icon.svg"); // sumber utama (SVG)
const tmpDir = path.join(appDir, ".favtmp");
const outIco = path.join(appDir, "favicon.ico"); // favicon.ico tetap di /app

// Ukuran aman untuk ICO (multi-res)
const icoSizes = [16, 32, 48, 64, 128, 256];

// Aset tambahan (disimpan ke /public agar selalu tersedia di root URL)
const extraPngs = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  // opsional (kalau manifest pakai maskable)
  { name: "icon-192-maskable.png", size: 192 },
  { name: "icon-512-maskable.png", size: 512 }
];

async function ensureSvgExists() {
  try {
    await fs.access(inputSvg);
  } catch {
    throw new Error(
      `Tidak menemukan ${inputSvg}. Pastikan apps/frontend/app/icon.svg tersedia.`
    );
  }
}

async function cleanTmp() {
  await fs.rm(tmpDir, { recursive: true, force: true });
}

async function genPngTo(dir, size, filename) {
  await fs.mkdir(dir, { recursive: true });
  const out = path.join(dir, filename);
  await sharp(inputSvg)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(out);
  return out;
}

async function main() {
  await ensureSvgExists();
  await cleanTmp();
  await fs.mkdir(tmpDir, { recursive: true });

  // 1) raster SVG -> PNG berbagai ukuran (sementara untuk ICO)
  const pngPaths = [];
  for (const s of icoSizes) {
    const out = path.join(tmpDir, `icon-${s}.png`);
    await sharp(inputSvg)
      .resize(s, s, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(out);
    pngPaths.push(out);
  }

  // 2) gabungkan ke .ico (fallback universal)
  const icoBuffer = await pngToIco(pngPaths);
  await fs.writeFile(outIco, icoBuffer);

  // 3) generate PNG tambahan ke /public (agar tidak 404)
  for (const e of extraPngs) {
    await genPngTo(publicDir, e.size, e.name);
  }

  // 4) bersihkan tmp
  await cleanTmp();
  console.log("✅ Generated favicon.ico (in /app) + PNGs (in /public).");
}

main().catch((e) => {
  console.error("❌ generate-favicon failed:", e);
  process.exit(1);
});
