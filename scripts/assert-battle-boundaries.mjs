import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const battleRoot = join(root, 'src', 'battle');
const allowedTokenImports = new Set([
  '../styles/design-tokens.css',
  '../../styles/design-tokens.css',
]);
const sourceExtensions = new Set(['.ts', '.tsx', '.css']);
const forbiddenPatterns = [
  /\bSceneController\b/,
  /\bDialogueBox\b/,
  /\bChoicePanel\b/,
  /components[\\/]+narrative/,
];

if (!existsSync(battleRoot)) {
  throw new Error('Missing src/battle directory.');
}

const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (sourceExtensions.has(extname(fullPath))) {
      files.push(fullPath);
    }
  }
}

walk(battleRoot);

const failures = [];

for (const file of files) {
  const relativePath = relative(root, file);
  const content = readFileSync(file, 'utf8');

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      failures.push(`${relativePath}: forbidden narrative dependency matched ${pattern}`);
    }
  }

  if (extname(file) === '.css') {
    const imports = [...content.matchAll(/@import\s+["']([^"']+)["']/g)].map((match) => match[1]);
    for (const importPath of imports) {
      if (!allowedTokenImports.has(importPath)) {
        failures.push(`${relativePath}: battle CSS may import only design-tokens.css`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Battle boundary guard passed for ${files.length} files.`);
