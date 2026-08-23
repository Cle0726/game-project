import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const plaza = read('src/exploration/chapter3PlazaData.ts');
const legacyPlaza = read('src/exploration/regionData.ts');
const archive = read('src/exploration/archiveRegionData.ts');
const archiveApproach = read('src/exploration/chapter3ArchiveApproachData.ts');
const hearingApproach = read('src/exploration/chapter3HearingApproachData.ts');

for (const sceneId of [
  'chapter3_white_start',
  'ch3_white_000',
  'ch3_white_001',
  'ch3_white_002',
  'ch3_white_003',
  'ch3_white_004',
  'ch3_white_005',
  'ch3_white_006',
  'ch3_white_007',
  'ch3_minigame_hearing_statement',
  'ch3_white_008',
]) {
  assert(game.includes(`\"${sceneId}\": {`), `Canonical chapter-3 scene ${sceneId} must exist`);
}

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

for (const protectedSceneId of [
  'ch3_white_001',
  'ch3_white_002',
  'ch3_white_005',
  'ch3_white_007',
  'ch3_minigame_hearing_statement',
]) {
  assert(
    !registry.includes(`sceneId: '${protectedSceneId}'`),
    `${protectedSceneId} must remain an authored story/minigame scene`,
  );
}

assert(
  plaza.includes("id: 'white_academy_plaza_ch3_canon'") &&
    plaza.includes("storySceneId: 'ch3_white_000'") &&
    !plaza.includes("storySceneId: 'chapter3_white_start'"),
  'Formal White Academy plaza must preserve the canonical chapter-entry order',
);
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
    `${sceneId} archive slice must remain registered`,
  );
  assert(archive.includes(`export const ${exportName}`), `Missing archive region export ${exportName}`);
}
assert(
  game.includes('nextScene: "ch3_white_003"') &&
    game.includes('nextScene: "ch3_white_004"') &&
    game.includes('nextScene: "ch3_white_005"'),
  'Milo and Anning archive scenes must retain their canonical convergence',
);

assert(
  registry.includes("sceneId: 'ch3_white_006', region: CH3_ARCHIVE_CORRIDOR_APPROACH_REGION"),
  'ch3_white_006 must be preceded by the portrait-to-archive corridor traversal',
);
assert(
  archiveApproach.includes("id: 'ch3_reach_archive_outer_corridor'") &&
    archiveApproach.includes("target: { type: 'zone', id: 'ch3-archive-outer-door' }") &&
    archiveApproach.includes("storySceneId: 'ch3_white_006'"),
  'Archive approach must resolve to canonical ch3_white_006',
);
assert(
  game.includes('effect: () => drawChapter3WhiteMapEvent()') &&
    game.includes('nextScene: "ch3_white_006"'),
  'ch3_white_005 must retain its side-event entry and authored forward edge',
);

assert(
  registry.includes("sceneId: 'ch3_white_008', region: CH3_HEARING_CHAMBER_APPROACH_REGION"),
  'ch3_white_008 must be preceded by the hearing-chamber traversal',
);
assert(
  hearingApproach.includes("id: 'ch3_reach_hearing_chamber'") &&
    hearingApproach.includes("target: { type: 'zone', id: 'ch3-hearing-chamber-door' }") &&
    hearingApproach.includes("storySceneId: 'ch3_white_008'"),
  'Hearing approach must resolve to canonical ch3_white_008',
);
assert(
  game.includes('nextScene: "ch3_minigame_hearing_statement"') &&
    game.includes('nextScene: "ch3_white_008"'),
  'Direct preparation and hearing-statement minigame must still converge on ch3_white_008',
);
assert(
  game.includes('function resolveCh3WhiteHearing()'),
  'Hearing outcome resolution must remain owned by game.js',
);

for (const assetPath of [
  'assets/generated/chapter3/backgrounds/bg_ch3_archive_corridor_v01.png',
  'assets/generated/chapter3/backgrounds/bg_ch3_reception_hall_v01.png',
]) {
  assert(exists(assetPath), `Missing chapter-3 exploration asset: ${assetPath}`);
}

assert(
  !plaza.includes('DeepSeek') && !plaza.includes('OpenAI') &&
    !archive.includes('DeepSeek') && !archive.includes('OpenAI') &&
    !archiveApproach.includes('DeepSeek') && !archiveApproach.includes('OpenAI') &&
    !hearingApproach.includes('DeepSeek') && !hearingApproach.includes('OpenAI'),
  'Chapter-3 exploration must remain LLM OFF during formal migration',
);

if (failures.length) {
  console.error('Chapter 3 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 3 exploration guard passed.');
