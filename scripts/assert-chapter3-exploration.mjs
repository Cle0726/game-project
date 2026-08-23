import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const plaza = read('src/exploration/chapter3PlazaData.ts');
const legacyPlaza = read('src/exploration/regionData.ts');
const archive = read('src/exploration/archiveRegionData.ts');

for (const sceneId of [
  'chapter3_white_start',
  'ch3_white_000',
  'ch3_white_001',
  'ch3_white_002',
  'ch3_white_003',
  'ch3_white_004',
]) {
  assert(
    game.includes(`\"${sceneId}\": {`),
    `Canonical chapter-3 scene ${sceneId} must exist`,
  );
}

// The chapter opening owns route initialization and must play before free roaming.
assert(
  !registry.includes("sceneId: 'chapter3_white_start'"),
  'chapter3_white_start must remain canonical and must not be intercepted',
);
assert(
  registry.includes("sceneId: 'ch3_white_000', region: CH3_WHITE_ACADEMY_PLAZA_REGION"),
  'ch3_white_000 must be the canonical front-plaza exploration handoff',
);
assert(
  game.includes('key: "听证倾向值", value: 0') &&
    game.includes('value: "ch3_white_route_started"') &&
    game.includes('nextScene: "ch3_white_000"'),
  'chapter3_white_start must still initialize hearing state before ch3_white_000',
);

for (const protectedSceneId of ['ch3_white_001', 'ch3_white_002']) {
  assert(
    !registry.includes(`sceneId: '${protectedSceneId}'`),
    `${protectedSceneId} must remain an authored story scene`,
  );
}

assert(
  plaza.includes("id: 'white_academy_plaza_ch3_canon'"),
  'Formal chapter-3 plaza wrapper must have its own region id',
);
assert(
  plaza.includes("storySceneId: 'ch3_white_000'"),
  'White Academy main door must return to canonical ch3_white_000',
);
assert(
  !plaza.includes("storySceneId: 'chapter3_white_start'"),
  'Formal chapter-3 plaza must not loop back to the chapter entry node',
);

// Keep the old prototype untouched as a regression artifact while the formal wrapper
// corrects only the Canon-facing return scene.
assert(
  legacyPlaza.includes("id: 'white_academy_plaza'"),
  'Legacy plaza regression region must remain available',
);

for (const [sceneId, exportName] of [
  ['ch3_white_003', 'WHITE_ACADEMY_ARCHIVE_MILO_REGION'],
  ['ch3_white_004', 'WHITE_ACADEMY_ARCHIVE_ANNING_REGION'],
]) {
  assert(
    registry.includes(`sceneId: '${sceneId}', region: ${exportName}`),
    `${sceneId} archive regression slice must remain registered during Canon audit`,
  );
  assert(
    archive.includes(`export const ${exportName}`),
    `Missing archive region export ${exportName}`,
  );
}

assert(
  !plaza.includes('DeepSeek') && !plaza.includes('OpenAI') &&
    !archive.includes('DeepSeek') && !archive.includes('OpenAI'),
  'Chapter-3 exploration must remain LLM OFF during formal migration',
);

if (failures.length) {
  console.error('Chapter 3 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 3 exploration guard passed.');
