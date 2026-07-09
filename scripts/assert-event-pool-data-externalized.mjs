import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const dataPath = path.join(root, 'event_pool_data.js');
const indexPath = path.join(root, 'index.html');

const eventPoolNames = [
  'PERSONAL_STORIES',
  'CHAPTER0_EVENT_POOL',
  'CHAPTER2_EVENT_POOL',
  'CHAPTER3_WHITE_EVENT_POOL',
  'CHAPTER3_EVENT_POOL'
];

function fail(message) {
  console.error(`Event pool data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  fail('event_pool_data.js is missing. Personal story and chapter event pools must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

for (const poolName of eventPoolNames) {
  const gamePattern = new RegExp(`\\bconst\\s+${poolName}\\s*=\\s*\\[`);
  if (gamePattern.test(gameSource)) {
    fail(`game.js still declares const ${poolName}. Move it to event_pool_data.js.`);
  }
  const dataPattern = new RegExp(`\\bvar\\s+${poolName}\\s*=\\s*\\[`);
  if (!dataPattern.test(dataSource)) {
    fail(`event_pool_data.js must expose legacy global: var ${poolName} = [...];`);
  }
}

const dataScript = '<script src="event_pool_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) fail('index.html must load event_pool_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (dataIndex > gameIndex) fail('event_pool_data.js must be loaded before game.js.');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'event_pool_data.js' });

const expectedLengths = {
  PERSONAL_STORIES: 5,
  CHAPTER0_EVENT_POOL: 14,
  CHAPTER2_EVENT_POOL: 5,
  CHAPTER3_WHITE_EVENT_POOL: 5,
  CHAPTER3_EVENT_POOL: 5
};

for (const [poolName, expectedLength] of Object.entries(expectedLengths)) {
  const pool = sandbox[poolName];
  if (!Array.isArray(pool)) fail(`${poolName} must be an array.`);
  if (pool.length !== expectedLength) fail(`${poolName} expected ${expectedLength} entries, got ${pool.length}`);
  const ids = new Set();
  for (const item of pool) {
    if (!item.id) fail(`${poolName}: item missing id`);
    if (ids.has(item.id)) fail(`${poolName}: duplicate id ${item.id}`);
    ids.add(item.id);
    if (poolName === 'PERSONAL_STORIES') {
      for (const key of ['character', 'chapter', 'title', 'threshold', 'resonanceKey', 'seenEvent', 'sceneId']) {
        if (item[key] === undefined || item[key] === null) fail(`${poolName}.${item.id}: missing ${key}`);
      }
    } else {
      for (const key of ['title', 'eventType', 'description', 'choices']) {
        if (!item[key]) fail(`${poolName}.${item.id}: missing ${key}`);
      }
      if (!Array.isArray(item.choices) || item.choices.length === 0) fail(`${poolName}.${item.id}: choices must be a non-empty array`);
    }
  }
}

console.log('Event pool data guard passed.');
