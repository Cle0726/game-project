import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const dataPath = path.join(root, 'ui_settings_data.js');
const indexPath = path.join(root, 'index.html');

const expectedDefaults = {
  uiScale: 'normal',
  motion: 'full',
  typewriter: 'normal',
  hudDensity: 'normal'
};

function fail(message) {
  console.error(`UI settings data guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  fail('ui_settings_data.js is missing. DEFAULT_UI_SETTINGS must live outside game.js.');
}

const gameSource = fs.readFileSync(gamePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const indexSource = fs.readFileSync(indexPath, 'utf8');

if (/\bconst\s+DEFAULT_UI_SETTINGS\s*=\s*\{/.test(gameSource)) {
  fail('game.js still declares const DEFAULT_UI_SETTINGS. Move it to ui_settings_data.js.');
}

if (!/\bvar\s+DEFAULT_UI_SETTINGS\s*=\s*\{/.test(dataSource)) {
  fail('ui_settings_data.js must expose legacy global: var DEFAULT_UI_SETTINGS = {...};');
}

const dataScript = '<script src="ui_settings_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const dataIndex = indexSource.indexOf(dataScript);
const gameIndex = indexSource.indexOf(gameScript);

if (dataIndex === -1) fail('index.html must load ui_settings_data.js before game.js.');
if (gameIndex === -1) fail('index.html no longer loads game.js with the expected script tag.');
if (dataIndex > gameIndex) fail('ui_settings_data.js must be loaded before game.js.');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: 'ui_settings_data.js' });

for (const [key, value] of Object.entries(expectedDefaults)) {
  if (sandbox.DEFAULT_UI_SETTINGS?.[key] !== value) {
    fail(`${key}: expected ${value}, got ${sandbox.DEFAULT_UI_SETTINGS?.[key]}`);
  }
}

console.log(`UI settings data guard passed for ${Object.keys(expectedDefaults).length} defaults.`);
