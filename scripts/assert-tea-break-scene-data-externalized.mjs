import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const dataPath = path.join(root, 'tea_break_scene_data.js');
const indexPath = path.join(root, 'index.html');

const requiredScenes = {
  '阿缇娅': 'tea_break_atya',
  '弥洛': 'tea_break_milo',
  '槐序': 'tea_break_huaixu',
  '洛温': 'tea_break_luowen',
  '伊芙白': 'tea_break_yifubai',
  '明弦': 'tea_break_mingxian'
};

function fail(message) {
  console.error(`Tea break scene data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  fail('tea_break_scene_data.js is missing. TEA_BREAK_SCENES must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

if (/\bconst\s+TEA_BREAK_SCENES\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const TEA_BREAK_SCENES. Move it to tea_break_scene_data.js.');
}

if (!/\bvar\s+TEA_BREAK_SCENES\s*=\s*\{/.test(dataSource)) {
  fail('tea_break_scene_data.js must expose legacy global: var TEA_BREAK_SCENES = {...};');
}

const dataScript = '<script src="tea_break_scene_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) fail('index.html must load tea_break_scene_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (dataIndex > gameIndex) fail('tea_break_scene_data.js must be loaded before game.js.');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'tea_break_scene_data.js' });

for (const [name, sceneId] of Object.entries(requiredScenes)) {
  if (sandbox.TEA_BREAK_SCENES?.[name] !== sceneId) {
    fail(`${name}: expected ${sceneId}, got ${sandbox.TEA_BREAK_SCENES?.[name]}`);
  }
}

console.log(`Tea break scene data guard passed for ${Object.keys(requiredScenes).length} scene links.`);
