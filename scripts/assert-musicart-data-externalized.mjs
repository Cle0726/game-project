import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const musicartDataPath = path.join(root, 'musicart_data.js');
const indexPath = path.join(root, 'index.html');

const requiredMusicarts = ['槐序', '洛温', '阿缇娅', '弥洛', '伊芙白', '明弦'];
const requiredRuleKeys = ['gender', 'trustKey', 'resonanceKey', 'pressureKey'];
const requiredProfileKeys = ['codename', 'concept', 'avatar'];

function fail(message) {
  console.error(`Musicart data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(musicartDataPath)) {
  fail('musicart_data.js is missing. MUSICART_RULES and MUSICART_PROFILES must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(musicartDataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

if (/\bconst\s+MUSICART_RULES\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const MUSICART_RULES. Move it to musicart_data.js.');
}

if (/\bconst\s+MUSICART_PROFILES\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const MUSICART_PROFILES. Move it to musicart_data.js.');
}

if (!/\bvar\s+MUSICART_RULES\s*=\s*\{/.test(dataSource)) {
  fail('musicart_data.js must expose legacy global: var MUSICART_RULES = {...};');
}

if (!/\bvar\s+MUSICART_PROFILES\s*=\s*\{/.test(dataSource)) {
  fail('musicart_data.js must expose legacy global: var MUSICART_PROFILES = {...};');
}

const dataScript = '<script src="musicart_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) {
  fail('index.html must load musicart_data.js before game.js.');
}

if (gameIndex === -1) {
  fail('index.html no longer loads game.js with the expected script tag.');
}

if (dataIndex > gameIndex) {
  fail('musicart_data.js must be loaded before game.js.');
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'musicart_data.js' });

for (const name of requiredMusicarts) {
  const rule = sandbox.MUSICART_RULES?.[name];
  const profile = sandbox.MUSICART_PROFILES?.[name];
  if (!rule) fail(`${name}: missing MUSICART_RULES entry`);
  if (!profile) fail(`${name}: missing MUSICART_PROFILES entry`);
  for (const key of requiredRuleKeys) {
    if (!rule[key]) fail(`${name}: missing rule key ${key}`);
  }
  for (const key of requiredProfileKeys) {
    if (!profile[key]) fail(`${name}: missing profile key ${key}`);
  }
}

console.log(`Musicart data guard passed for ${requiredMusicarts.length} musicarts.`);
