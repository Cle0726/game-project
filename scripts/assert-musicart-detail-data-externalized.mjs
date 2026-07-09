import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const detailDataPath = path.join(root, 'musicart_detail_data.js');
const indexPath = path.join(root, 'index.html');

const requiredMusicarts = ['槐序', '洛温', '伊芙白', '明弦'];
const requiredDetailKeys = ['englishName', 'faction', 'role', 'temperament', 'combatNote', 'keywords', 'skillCards'];

function fail(message) {
  console.error(`Musicart detail data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(detailDataPath)) {
  fail('musicart_detail_data.js is missing. MUSICART_DETAIL_PROFILES must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(detailDataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

if (/\bconst\s+MUSICART_DETAIL_PROFILES\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const MUSICART_DETAIL_PROFILES. Move it to musicart_detail_data.js.');
}

if (!/\bvar\s+MUSICART_DETAIL_PROFILES\s*=\s*\{/.test(dataSource)) {
  fail('musicart_detail_data.js must expose legacy global: var MUSICART_DETAIL_PROFILES = {...};');
}

const detailScript = '<script src="musicart_detail_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const detailIndex = indexSource.indexOf(detailScript);
const gameIndex = indexSource.indexOf(gameScript);

if (detailIndex === -1) fail('index.html must load musicart_detail_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (detailIndex > gameIndex) fail('musicart_detail_data.js must be loaded before game.js.');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'musicart_detail_data.js' });

for (const name of requiredMusicarts) {
  const detail = sandbox.MUSICART_DETAIL_PROFILES?.[name];
  if (!detail) fail(`${name}: missing MUSICART_DETAIL_PROFILES entry`);
  for (const key of requiredDetailKeys) {
    if (!detail[key]) fail(`${name}: missing detail key ${key}`);
  }
  if (!Array.isArray(detail.keywords) || detail.keywords.length === 0) {
    fail(`${name}: keywords must be a non-empty array`);
  }
  if (!Array.isArray(detail.skillCards) || detail.skillCards.length === 0) {
    fail(`${name}: skillCards must be a non-empty array`);
  }
}

console.log(`Musicart detail data guard passed for ${requiredMusicarts.length} musicarts.`);
