import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const dataPath = path.join(root, 'ai_teabreak_data.js');
const indexPath = path.join(root, 'index.html');

const requiredDeepSeekProfiles = ['槐序', '洛温', '伊芙白', '明弦'];
const requiredFallbackRules = ['阿缇娅', '弥洛', '槐序', '洛温', '伊芙白', '明弦'];
const requiredAttitudes = ['casual', 'care', 'force', 'strategy', 'cold'];

function fail(message) {
  console.error(`AI teabreak data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  fail('ai_teabreak_data.js is missing. DEEPSEEK_CHARACTER_PROFILES and AI_MUSICART_RULES must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

if (/\bconst\s+DEEPSEEK_CHARACTER_PROFILES\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const DEEPSEEK_CHARACTER_PROFILES. Move it to ai_teabreak_data.js.');
}

if (/\bconst\s+AI_MUSICART_RULES\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const AI_MUSICART_RULES. Move it to ai_teabreak_data.js.');
}

if (!/\bvar\s+DEEPSEEK_CHARACTER_PROFILES\s*=\s*\{/.test(dataSource)) {
  fail('ai_teabreak_data.js must expose legacy global: var DEEPSEEK_CHARACTER_PROFILES = {...};');
}

if (!/\bvar\s+AI_MUSICART_RULES\s*=\s*\{/.test(dataSource)) {
  fail('ai_teabreak_data.js must expose legacy global: var AI_MUSICART_RULES = {...};');
}

const dataScript = '<script src="ai_teabreak_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) fail('index.html must load ai_teabreak_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (dataIndex > gameIndex) fail('ai_teabreak_data.js must be loaded before game.js.');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'ai_teabreak_data.js' });

for (const name of requiredDeepSeekProfiles) {
  const profile = sandbox.DEEPSEEK_CHARACTER_PROFILES?.[name];
  if (!profile) fail(`${name}: missing DEEPSEEK_CHARACTER_PROFILES entry`);
  for (const key of ['id', 'name', 'codename', 'musicConcept', 'emotionProfile', 'voiceStyle', 'judgmentCriteria', 'fallbackLines', 'hiddenLines']) {
    if (!profile[key]) fail(`${name}: missing DeepSeek profile key ${key}`);
  }
}

for (const name of requiredFallbackRules) {
  const rule = sandbox.AI_MUSICART_RULES?.[name];
  if (!rule) fail(`${name}: missing AI_MUSICART_RULES entry`);
  for (const key of ['hiddenLineStat', 'hiddenLineThreshold', 'highPressureThreshold', 'voiceRules', 'replies', 'highPressureOverride', 'hiddenLineAppend']) {
    if (!rule[key]) fail(`${name}: missing fallback rule key ${key}`);
  }
  for (const attitude of requiredAttitudes) {
    const reply = rule.replies?.[attitude];
    if (!reply) fail(`${name}: missing ${attitude} fallback reply`);
    if (!reply.dialogue || !reply.mood || !Array.isArray(reply.effects)) {
      fail(`${name}.${attitude}: reply must include dialogue, mood, and effects array`);
    }
  }
}

console.log(`AI teabreak data guard passed for ${requiredDeepSeekProfiles.length} DeepSeek profiles / ${requiredFallbackRules.length} fallback rules.`);
