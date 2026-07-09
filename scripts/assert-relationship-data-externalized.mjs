import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const dataPath = path.join(root, 'relationship_data.js');
const indexPath = path.join(root, 'index.html');

const requiredCharacters = ['槐序', '洛温', '阿缇娅', '弥洛', '伊芙白', '明弦'];
const requiredTierGroups = ['trust', 'resonance', 'pressure'];

function fail(message) {
  console.error(`Relationship data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  fail('relationship_data.js is missing. RELATIONSHIP_TIERS and RELATIONSHIP_DATA must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

if (/\bconst\s+RELATIONSHIP_TIERS\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const RELATIONSHIP_TIERS. Move it to relationship_data.js.');
}

if (/\bconst\s+RELATIONSHIP_DATA\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const RELATIONSHIP_DATA. Move it to relationship_data.js.');
}

if (!/\bvar\s+RELATIONSHIP_TIERS\s*=\s*\{/.test(dataSource)) {
  fail('relationship_data.js must expose legacy global: var RELATIONSHIP_TIERS = {...};');
}

if (!/\bvar\s+RELATIONSHIP_DATA\s*=\s*\{/.test(dataSource)) {
  fail('relationship_data.js must expose legacy global: var RELATIONSHIP_DATA = {...};');
}

const dataScript = '<script src="relationship_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) fail('index.html must load relationship_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (dataIndex > gameIndex) fail('relationship_data.js must be loaded before game.js.');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'relationship_data.js' });

for (const group of requiredTierGroups) {
  const tiers = sandbox.RELATIONSHIP_TIERS?.[group];
  if (!Array.isArray(tiers) || tiers.length === 0) fail(`${group}: missing relationship tiers`);
  for (const tier of tiers) {
    for (const key of ['id', 'label', 'min', 'max']) {
      if (tier[key] === undefined || tier[key] === null) fail(`${group}: tier missing ${key}`);
    }
  }
}

for (const name of requiredCharacters) {
  const data = sandbox.RELATIONSHIP_DATA?.[name];
  if (!data) fail(`${name}: missing RELATIONSHIP_DATA entry`);
  for (const key of ['trustKey', 'resonanceKey', 'pressureKey', 'judgment', 'hiddenLines']) {
    if (!data[key]) fail(`${name}: missing relationship key ${key}`);
  }
  if (!Array.isArray(data.hiddenLines) || data.hiddenLines.length === 0) {
    fail(`${name}: hiddenLines must be a non-empty array`);
  }
}

console.log(`Relationship data guard passed for ${requiredCharacters.length} characters / ${requiredTierGroups.length} tier groups.`);
