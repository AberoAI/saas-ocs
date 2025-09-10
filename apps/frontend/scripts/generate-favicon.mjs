// apps/frontend/scripts/generate-favicon.mjs
// (perbaikan: path-independent + perbaikan properti background.alpha)

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

// Resolve paths relatif terhadap file ini, bukan CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, "..", "app");

const inputSvg = path.join(appDir, "icon.svg"); // sumber utama (SVG)
const tmpDir = path.join(appDir, ".favtmp");
const outIco = path.join(appDir, "favicon.ico");

// Ukuran aman untuk ICO (multi-res)
const icoSizes = [16, 32, 48, 64, 128, 256];

// (opsional) aset tambahan
const extraPngs = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 }
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

async function genPng(size) {
  const out = path.join(tmpDir, `icon-${size}.png`);
  await sharp(inputSvg)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 } // <- perbaikan: alpha
    })
    .png()
    .toFile(out);
  return out;
}

async function main() {
  await ensureSvgExists();
  await cleanTmp();
  await fs.mkdir(tmpDir, { recursive: true });

  // 1) raster SVG -> PNG berbagai ukuran
  const pngPaths = [];
  for (const s of icoSizes) {
    pngPaths.push(await genPng(s));
  }

  // 2) gabungkan ke .ico
  const icoBuffer = await pngToIco(pngPaths);
  await fs.writeFile(outIco, icoBuffer);

  // 3) (opsional) icon tambahan
  for (const e of extraPngs) {
    const out = path.join(appDir, e.name);
    await sharp(inputSvg)
      .resize(e.size, e.size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 } // <- perbaikan: alpha
      })
      .png()
      .toFile(out);
  }

  // 4) bersihkan tmp
  await cleanTmp();
  console.log("✅ Generated app/favicon.ico + extra PNGs (apple-touch-icon, 192, 512).");
}

main().catch((e) => {
  console.error("❌ generate-favicon failed:", e);
  process.exit(1);
});
