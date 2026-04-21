const fs = require("fs");
const path = require("path");

const ICON_DIR = path.join(process.cwd(), "public/icons/games");
const OUTPUT_FILE = path.join(process.cwd(), "data/gameIconMap.js");

function toKey(name) {
  return name
    .replace(".webp", "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function toTitle(name) {
  return name
    .replace(".webp", "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

const files = fs.readdirSync(ICON_DIR);

const map = {};

files.forEach(file => {
  if (!file.endsWith(".webp")) return;

  const baseName = file.replace(".webp", "");
  const key = toKey(file);

  map[key] = {
    base: `/icons/games/${baseName}`,
    title: toTitle(file)
  };
});

const output = `export const GAME_ICON_MAP = ${JSON.stringify(map, null, 2)};`;

fs.writeFileSync(OUTPUT_FILE, output);

console.log("✅ GAME_ICON_MAP berhasil dibuat tanpa warning");