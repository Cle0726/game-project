import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const dataPath = path.join(root, 'avatar_style_data.js');
const indexPath = path.join(root, 'index.html');

const requiredAvatars = ['阿缇娅', '弥洛', '槐序', '洛温', '伊芙白', '明弦', '安柠', '缇雅'];

function fail(message) {
  console.error(`Avatar style data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  fail('avatar_style_data.js is missing. AVATAR_STYLES must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

if (/\bconst\s+AVATAR_STYLES\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const AVATAR_STYLES. Move it to avatar_style_data.js.');
}

if (!/\bvar\s+AVATAR_STYLES\s*=\s*\{/.test(dataSource)) {
  fail('avatar_style_data.js must expose legacy global: var AVATAR_STYLES = {...};');
}

const dataScript = '<script src="avatar_style_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) fail('index.html must load avatar_style_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (dataIndex > gameIndex) fail('avatar_style_data.js must be loaded before game.js.');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'avatar_style_data.js' });

for (const name of requiredAvatars) {
  const style = sandbox.AVATAR_STYLES?.[name];
  if (!style) fail(`${name}: missing AVATAR_STYLES entry`);
  if (!style.color || !/^#[0-9A-Fa-f]{6}$/.test(style.color)) fail(`${name}: invalid avatar color`);
  if (!style.label) fail(`${name}: missing avatar label`);
}

console.log(`Avatar style data guard passed for ${requiredAvatars.length} required avatars.`);
