import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const dataPath = path.join(root, 'gacha_data.js');
const indexPath = path.join(root, 'index.html');

const requiredIds = [
  'musicart_atya',
  'musicart_milo',
  'musicart_yuna_sequence07',
  'musicart_seluomi',
  'scene_chapter0_residual_path',
  'scene_chapter1_mujian_station',
  'scene_chapter2_frost_score_tower',
  'scene_chapter3_white_score_institute',
  'scene_chapter3_legacy_archive',
  'dev_ai_teabreak'
];

function fail(message) {
  console.error(`Gacha data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  fail('gacha_data.js is missing. GACHA_POOL must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

if (/\bconst\s+GACHA_POOL\s*=\s*\[/.test(gameSource)) {
  fail('game.js still declares const GACHA_POOL. Move it to gacha_data.js.');
}

if (!/\bvar\s+GACHA_POOL\s*=\s*\[/.test(dataSource)) {
  fail('gacha_data.js must expose legacy global: var GACHA_POOL = [...];');
}

const dataScript = '<script src="gacha_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) fail('index.html must load gacha_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (dataIndex > gameIndex) fail('gacha_data.js must be loaded before game.js.');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'gacha_data.js' });

if (!Array.isArray(sandbox.GACHA_POOL)) fail('GACHA_POOL must be an array.');
if (sandbox.GACHA_POOL.length !== requiredIds.length) {
  fail(`GACHA_POOL expected ${requiredIds.length} entries, got ${sandbox.GACHA_POOL.length}`);
}

const ids = new Set();
for (const item of sandbox.GACHA_POOL) {
  for (const key of ['id', 'rarity', 'type', 'title', 'subtitle', 'image']) {
    if (!item[key]) fail(`gacha item missing ${key}: ${JSON.stringify(item)}`);
  }
  if (ids.has(item.id)) fail(`duplicate gacha id: ${item.id}`);
  ids.add(item.id);
}

for (const id of requiredIds) {
  if (!ids.has(id)) fail(`missing gacha id: ${id}`);
}

console.log(`Gacha data guard passed for ${sandbox.GACHA_POOL.length} entries.`);
