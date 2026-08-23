import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const station = read('src/exploration/chapter1StationData.ts');
const aftermath = read('src/exploration/chapter1AftermathData.ts');
const seluomiApproach = read('src/exploration/chapter1SeluomiApproachData.ts');
const departure = read('src/exploration/chapter1DepartureData.ts');

const bridgeScenes = [
  'ch1_black_001',
  'ch1_black_002',
  'ch1_black_003',
  'ch1_black_005',
  'ch1_black_006',
  'ch1_black_008',
  'ch1_black_014',
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
  'ch1_black_009',
  'ch1_black_010_a',
  'ch1_black_010_b',
  'ch1_black_010_c',
  'ch1_black_012',
  'ch1_black_013',
  'ch1_minigame_intel_trade',
  'ch1_minigame_track_ruts',
  'ch1_minigame_cipher',
  'ch1_minigame_ensemble',
  'ch1_minigame_escort_yuna',
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

assert(
  game.includes('nextScene: "ch1_black_005"'),
  'Chapter-1 preparation routes must still converge on ch1_black_005',
);

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
  seluomiApproach.includes('export const CH1_SELUOMI_STANDOFF_APPROACH_REGION'),
  'Seluomi standoff approach region must exist',
);
assert(
  registry.includes('CH1_SELUOMI_STANDOFF_APPROACH_REGION'),
  'Seluomi standoff approach region must be registered',
);
assert(
  seluomiApproach.includes("id: 'ch1_follow_low_frequency'") &&
    seluomiApproach.includes("target: { type: 'zone', id: 'ch1-seluomi-standoff-edge' }"),
  'Seluomi approach must follow the low-frequency source to a physical zone',
);
assert(
  seluomiApproach.includes("questCompleteId: 'ch1_follow_low_frequency'") &&
    seluomiApproach.includes("storySceneId: 'ch1_black_008'"),
  'Low-frequency approach must hand control back to canonical ch1_black_008',
);
assert(
  !seluomiApproach.includes("name: '瑟萝弥'") && !seluomiApproach.includes('spriteSrc:'),
  'Do not fabricate a Seluomi map sprite when the repository has no dedicated asset',
);
assert(
  game.includes('nextScene: "ch1_black_009"') &&
    game.includes('nextScene: "ch1_black_012"') &&
    game.includes('ch1_minigame_escort_yuna'),
  'Seluomi confrontation tactics and escort minigame must remain canonical',
);
assert(
  game.includes('startBattle("ch1_seluomi_trial"'),
  'Seluomi boss battle must remain owned by the canonical battle system',
);

assert(
  departure.includes('export const CH1_MUJIAN_DEPARTURE_REGION'),
  'Mujian station departure region must exist',
);
assert(
  registry.includes('CH1_MUJIAN_DEPARTURE_REGION'),
  'Mujian station departure region must be registered',
);
assert(
  departure.includes("id: 'ch1_leave_mujian_station'") &&
    departure.includes("target: { type: 'zone', id: 'ch1-station-departure-exit' }"),
  'Departure quest must target the physical station exit',
);
assert(
  departure.includes("questCompleteId: 'ch1_leave_mujian_station'") &&
    departure.includes("storySceneId: 'ch1_black_014'"),
  'Station exit must hand control back to canonical ch1_black_014',
);
assert(
  game.includes('nextScene: "ch1_black_014"'),
  'Canonical chapter-1 epilogue must still route to ch1_black_014 when leaving Mujian Station',
);
assert(
  game.includes('nextScene: "chapter2_start"') && game.includes('nextScene: "chapter1_start"'),
  'Canonical ch1_black_014 route choices must remain available after the broadcast',
);

assert(
  !station.includes('DeepSeek') && !station.includes('OpenAI') &&
    !aftermath.includes('DeepSeek') && !aftermath.includes('OpenAI') &&
    !seluomiApproach.includes('DeepSeek') && !seluomiApproach.includes('OpenAI') &&
    !departure.includes('DeepSeek') && !departure.includes('OpenAI'),
  'Chapter-1 exploration must remain LLM OFF',
);

if (failures.length) {
  console.error('Chapter 1 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 1 exploration guard passed.');
