import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const dataPath = path.join(root, 'runtime_config_data.js');
const indexPath = path.join(root, 'index.html');

const requiredMoods = ['neutral', 'warm', 'tense', 'withdrawn', 'playful', 'sad', 'alert', 'thoughtful'];
const requiredActionKeys = ['旋律', '和声', '节奏', '音色', '指挥', '静默'];
const requiredCharacters = ['槐序', '洛温', '阿缇娅', '弥洛', '伊芙白', '明弦'];
const requiredRuntimeFlags = ['__dissonance_risk_luowen__', '__dissonance_risk_active__'];

function fail(message) {
  console.error(`Runtime config data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  fail('runtime_config_data.js is missing. Runtime config constants must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

for (const constantName of ['AI_ALLOWED_MOODS', 'AI_RELATION_STATS', 'REACT_BATTLE_ACTION_ORDER', 'REACT_BATTLE_CHARACTER_IDS', 'DEEPSEEK_CONFIG', 'RUNTIME_EVENT_FLAGS']) {
  const assignmentPattern = new RegExp(`\\bconst\\s+${constantName}\\s*=`);
  if (assignmentPattern.test(gameSource)) {
    fail(`game.js still declares const ${constantName}. Move it to runtime_config_data.js.`);
  }
  const exposedPattern = new RegExp(`\\bvar\\s+${constantName}\\s*=`);
  if (!exposedPattern.test(dataSource)) {
    fail(`runtime_config_data.js must expose legacy global: var ${constantName} = ...;`);
  }
}

const dataScript = '<script src="runtime_config_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) fail('index.html must load runtime_config_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (dataIndex > gameIndex) fail('runtime_config_data.js must be loaded before game.js.');

const sandbox = { Set };
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'runtime_config_data.js' });

for (const mood of requiredMoods) {
  if (!sandbox.AI_ALLOWED_MOODS?.includes(mood)) fail(`missing allowed mood: ${mood}`);
}

for (const stat of ['槐序信任', '洛温压力', '阿缇娅共鸣', '弥洛压力', '伊芙白信任', '明弦共鸣']) {
  if (!sandbox.AI_RELATION_STATS?.has(stat)) fail(`missing relation stat: ${stat}`);
}

const actionKeys = sandbox.REACT_BATTLE_ACTION_ORDER?.map((action) => action.key) || [];
for (const key of requiredActionKeys) {
  if (!actionKeys.includes(key)) fail(`missing React battle action key: ${key}`);
}

for (const name of requiredCharacters) {
  if (!sandbox.REACT_BATTLE_CHARACTER_IDS?.[name]) fail(`${name}: missing React battle character id`);
}

if (sandbox.DEEPSEEK_CONFIG?.apiKey || sandbox.DEEPSEEK_CONFIG?.api_key || sandbox.DEEPSEEK_CONFIG?.key) {
  fail('DEEPSEEK_CONFIG must not contain an API key.');
}
for (const key of ['apiEndpoint', 'model', 'maxTokens', 'storageKey', 'enabledKey']) {
  if (!sandbox.DEEPSEEK_CONFIG?.[key]) fail(`DEEPSEEK_CONFIG missing ${key}`);
}

for (const flag of requiredRuntimeFlags) {
  if (!sandbox.RUNTIME_EVENT_FLAGS?.includes(flag)) fail(`missing runtime flag: ${flag}`);
}

console.log('Runtime config data guard passed.');
