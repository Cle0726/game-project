import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const gamePath = path.join(root, 'game.js');
const assetsPath = path.join(root, 'assets_data.js');
const indexPath = path.join(root, 'index.html');

const game = fs.readFileSync(gamePath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');

if (!fs.existsSync(assetsPath)) {
  throw new Error('assets_data.js is missing. ASSETS must live outside game.js.');
}

const assets = fs.readFileSync(assetsPath, 'utf8');

if (/\bconst\s+ASSETS\s*=\s*\{/.test(game)) {
  throw new Error('game.js still declares const ASSETS. Move the resource table to assets_data.js.');
}

if (!/\bvar\s+ASSETS\s*=\s*\{/.test(assets)) {
  throw new Error('assets_data.js must expose the legacy global as: var ASSETS = {...};');
}

const assetsScript = '<script src="assets_data.js"></script>';
const gameScript = '<script src="game.js"></script>';
const assetsIndex = index.indexOf(assetsScript);
const gameIndex = index.indexOf(gameScript);

if (assetsIndex === -1) {
  throw new Error('index.html must load assets_data.js before game.js.');
}

if (gameIndex === -1) {
  throw new Error('index.html no longer loads game.js with the expected script tag.');
}

if (assetsIndex > gameIndex) {
  throw new Error('assets_data.js must be loaded before game.js.');
}

console.log('Assets externalization guard passed.');
