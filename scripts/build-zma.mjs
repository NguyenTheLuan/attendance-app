/**
 * Build + zip script for Zalo Mini App deployment.
 *
 * Usage:     npm run zip:zma
 *
 * Steps:
 *   1. Vite build with mode "zma" → output to www/
 *   2. Remove files not needed for ZMA (e.g. 404.html for GitHub Pages)
 *   3. Fix app-config.json pages from root config
 *   4. Zip www/ → attendance-app-zma.zip
 */

import { execSync } from "child_process";
import {
  createWriteStream,
  existsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { join, resolve } from "path";
import { readFile, stat } from "fs/promises";
import { ZipArchive } from "archiver";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = join(ROOT, "www");
const OUT_ZIP = join(ROOT, "attendance-app-zma.zip");

async function main() {
  // 1. Build
  console.log("[1/2] Building for Zalo Mini App...");
  execSync("npx vite build --mode zma", { cwd: ROOT, stdio: "inherit" });

  if (!existsSync(DIST)) {
    console.error("ERROR: www/ folder not found after build");
    process.exit(1);
  }

  // 2. Remove files not needed for ZMA (e.g. 404.html for GitHub Pages)
  const dist404 = join(DIST, "404.html");
  if (existsSync(dist404)) unlinkSync(dist404);

  // 3. Fix app-config.json: inject pages from root config
  //    (zmp-vite-plugin generates pages: [] incorrectly)
  console.log(
    "   Fixing app-config.json (injecting pages from root config)..."
  );
  const rootConfig = JSON.parse(
    readFileSync(join(ROOT, "app-config.json"), "utf-8")
  );
  const distConfigPath = join(DIST, "app-config.json");
  const distConfig = JSON.parse(readFileSync(distConfigPath, "utf-8"));
  Object.assign(distConfig, { pages: rootConfig.pages || [] });
  writeFileSync(distConfigPath, JSON.stringify(distConfig));

  // 4. Remove old zip
  if (existsSync(OUT_ZIP)) unlinkSync(OUT_ZIP);

  // 5. Create zip
  console.log("[2/2] Creating zip archive...");
  await new Promise((resolve, reject) => {
    const output = createWriteStream(OUT_ZIP);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(DIST, false);
    archive.finalize();
  });

  // 6. Show result
  const pkg = JSON.parse(await readFile(join(ROOT, "package.json"), "utf-8"));
  const stats = await stat(OUT_ZIP);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  console.log("\n✅ Done!");
  console.log(`   📍 File:  ${OUT_ZIP}`);
  console.log(`   📦 Size:  ${sizeMB} MB`);
  console.log(`   📌 Ver:   ${pkg.version}`);
  console.log("\n👉 Upload this zip to https://mini.zalo.me/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
