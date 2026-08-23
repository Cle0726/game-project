import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const station = read('src/exploration/chapter1StationData.ts');
const aftermath = read('src/exploration/chapter1AftermathData.ts');

const bridgeScenes = [
  'ch1_black_001',
  'ch1_black_002',
  'ch1_black_003',
  'ch1_black_005',
  'ch1_black_006',
];

for (const sceneId of bridgeScenes) {
  assert(
    game.includes(`\"${sceneId}\": {`),
    `Canonical chapter-1 scene ${sceneId} must exist as an exact SCENES key`,
  );
  assert(
    registry.includes(`sceneId: '${sceneId}'`),
    `${sceneId} must be registered as an exploration bridge`,
  );
}

for (const protectedSceneId of [
  'chapter1_start',
  'ch1_black_000',
  'ch1_black_004',
  'ch1_black_007',
  'ch1_minigame_intel_trade',
  'ch1_minigame_track_ruts',
  'ch1_minigame_cipher',
  'ch1_minigame_ensemble',
]) {
  assert(
    game.includes(`\"${protectedSceneId}\": {`),
    `Protected chapter-1 scene ${protectedSceneId} must exist`,
  );
  assert(
    !registry.includes(`sceneId: '${protectedSceneId}'`),
    `Protected chapter-1 scene ${protectedSceneId} must not be intercepted`,
  );
}

for (const assetPath of [
  'assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png',
  'assets/generated/chapter1/sprites/characters/char_ch1_zhong_sprite_default_v01.png',
]) {
  assert(exists(assetPath), `Missing chapter-1 exploration asset: ${assetPath}`);
}

const expectedRegions = [
  'CH1_MUJIAN_STATION_ARRIVAL_REGION',
  'CH1_MUJIAN_FIND_ZHONG_REGION',
  'CH1_MUJIAN_STATION_INN_REGION',
  'CH1_MUJIAN_PLATFORM7_REGION',
];
for (const exportName of expectedRegions) {
  assert(station.includes(`export const ${exportName}`), `Missing chapter-1 region export ${exportName}`);
  assert(registry.includes(exportName), `Chapter-1 region ${exportName} must be registered`);
}

const questTargets = [
  ['ch1_enter_mujian_station', 'zone', 'ch1-station-concourse'],
  ['ch1_find_zhong', 'npc', 'zhong_ch1_station'],
  ['ch1_reach_station_inn', 'zone', 'ch1-station-inn-door'],
  ['ch1_reach_platform7', 'zone', 'ch1-platform7-gate'],
];
for (const [questId, targetType, targetId] of questTargets) {
  assert(station.includes(`id: '${questId}'`), `Missing chapter-1 quest ${questId}`);
  assert(
    station.includes(`target: { type: '${targetType}', id: '${targetId}' }`),
    `Quest ${questId} must target ${targetType} ${targetId}`,
  );
  assert(station.includes(`id: '${targetId}'`), `Quest target ${targetId} must exist`);
}

assert(
  station.includes("name: '钟先生'") && station.includes("spriteSrc: ZHONG_SPRITE"),
  'Mr. Zhong must be represented as the repository NPC sprite',
);
assert(
  station.includes("questCompleteId: 'ch1_find_zhong'") &&
    station.includes("storySceneId: 'ch1_black_002'"),
  'Interacting with Mr. Zhong must complete the find quest and open canonical ch1_black_002',
);

for (const [targetId, sceneId] of [
  ['ch1-station-concourse', 'ch1_black_001'],
  ['ch1-station-inn-door', 'ch1_black_003'],
  ['ch1-platform7-gate', 'ch1_black_005'],
]) {
  assert(station.includes(`id: '${targetId}'`), `Missing chapter-1 interaction target ${targetId}`);
  assert(
    station.includes(`storySceneId: '${sceneId}'`),
    `${targetId} must return to canonical ${sceneId}`,
  );
}

for (const waypointId of [
  'station_entry',
  'station_south',
  'station_west_lane',
  'station_east_lane',
  'station_zhong',
  'station_inn',
  'station_north_west',
  'station_north_east',
  'station_platform7',
]) {
  assert(station.includes(`id: '${waypointId}'`), `Missing Mujian station waypoint ${waypointId}`);
}

// Current Canon convergence guarantees all preparation routes can use one physical
// Platform-7 approach without duplicating minigame or patrol effects.
assert(
  game.includes('nextScene: "ch1_black_005"'),
  'Chapter-1 preparation routes must still converge on ch1_black_005',
);

// Sequence-04 battle remains authoritative. Exploration begins only when its authored
// battle callback routes into ch1_black_006.
assert(
  game.includes('showScene("ch1_black_006")'),
  'Sequence-04 battle must still return to canonical ch1_black_006',
);
assert(
  aftermath.includes('export const CH1_SEQUENCE04_AFTERMATH_REGION'),
  'Sequence-04 aftermath exploration region must exist',
);
assert(
  registry.includes('CH1_SEQUENCE04_AFTERMATH_REGION'),
  'Sequence-04 aftermath region must be registered',
);
assert(
  aftermath.includes("id: 'ch1_inspect_sequence04_tracks'") &&
    aftermath.includes("nextQuestId: 'ch1_inspect_sequence04_score'"),
  'Sequence-04 aftermath must inspect tracks before the score fragments',
);
assert(
  aftermath.includes("target: { type: 'zone', id: 'ch1-sequence04-tracks' }") &&
    aftermath.includes("target: { type: 'zone', id: 'ch1-sequence04-score' }"),
  'Sequence-04 aftermath quests must resolve to their physical evidence zones',
);
assert(
  aftermath.includes("questCompleteId: 'ch1_inspect_sequence04_score'") &&
    aftermath.includes("storySceneId: 'ch1_black_006'"),
  'Only the second evidence check may hand control back to canonical ch1_black_006',
);

assert(
  !station.includes('DeepSeek') && !station.includes('OpenAI') &&
    !aftermath.includes('DeepSeek') && !aftermath.includes('OpenAI'),
  'Chapter-1 exploration must remain LLM OFF',
);

if (failures.length) {
  console.error('Chapter 1 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 1 exploration guard passed.');
