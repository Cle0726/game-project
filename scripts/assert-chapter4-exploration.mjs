import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const train = read('src/exploration/chapter4TrainData.ts');
const core = read('src/exploration/chapter4CoreData.ts');

const bridgeScenes = ['ch4_002', 'ch4_006', 'ch4_008', 'ch4_009', 'ch4_011', 'ch4_012', 'ch4_014'];
for (const sceneId of bridgeScenes) {
  assert(game.includes(`\"${sceneId}\": {`), `Canonical chapter-4 scene ${sceneId} must exist`);
  assert(registry.includes(`sceneId: '${sceneId}'`), `${sceneId} must be registered as an exploration bridge`);
}

for (const protectedSceneId of [
  'chapter4_start',
  'ch4_000',
  'ch4_001',
  'ch4_003',
  'ch4_004',
  'ch4_005',
  'ch4_007',
  'ch4_010',
  'ch4_013',
  'ch4_015',
  'ch4_016',
  'ch4_017',
  'ch4_018',
]) {
  assert(game.includes(`\"${protectedSceneId}\": {`), `Protected chapter-4 scene ${protectedSceneId} must exist`);
  assert(
    !registry.includes(`sceneId: '${protectedSceneId}'`),
    `Protected chapter-4 scene ${protectedSceneId} must not be intercepted`,
  );
}

for (const [key, value] of [
  ['救赎值', '0'],
  ['归还值', '0'],
  ['真相值', '0'],
  ['伊莱娜隐藏好感值', '0'],
]) {
  assert(game.includes(`key: \"${key}\", value: ${value}`), `chapter4_start must initialize ${key}`);
}
assert(
  game.includes('value: "chapter4_route_started"') && game.includes('nextScene: "ch4_000"'),
  'chapter4_start must retain its route-start event and ch4_000 handoff',
);

for (const assetPath of [
  'assets/generated/chapter4/backgrounds/bg_ch4_audience_car_v01.png',
  'assets/generated/chapter4/backgrounds/bg_ch4_nightless_train_corridor_v01.png',
  'assets/generated/chapter4/backgrounds/bg_ch4_altar_carriage_v01.png',
  'assets/generated/chapter4/backgrounds/bg_ch4_core_organ_chamber_v01.png',
]) {
  assert(exists(assetPath), `Missing chapter-4 exploration asset: ${assetPath}`);
}

for (const exportName of [
  'CH4_AUDIENCE_CAR_ENTRY_REGION',
  'CH4_QILAN_APPROACH_REGION',
  'CH4_ARMORED_CONNECTOR_APPROACH_REGION',
  'CH4_ALTAR_CARRIAGE_APPROACH_REGION',
]) {
  assert(train.includes(`export const ${exportName}`), `Missing chapter-4 region export ${exportName}`);
  assert(registry.includes(exportName), `Chapter-4 region ${exportName} must be registered`);
}
for (const exportName of [
  'CH4_POST_SELUOMI_CORE_APPROACH_REGION',
  'CH4_CORE_ORGAN_ENTRY_REGION',
  'CH4_FINAL_BOSS_DAIS_APPROACH_REGION',
]) {
  assert(core.includes(`export const ${exportName}`), `Missing chapter-4 core region export ${exportName}`);
  assert(registry.includes(exportName), `Chapter-4 core region ${exportName} must be registered`);
}

for (const [source, questId, targetId, sceneId] of [
  [train, 'ch4_enter_audience_car', 'ch4-audience-forward', 'ch4_002'],
  [train, 'ch4_reach_qilan_chokepoint', 'ch4-qilan-chokepoint', 'ch4_006'],
  [train, 'ch4_reach_armored_connector', 'ch4-armored-connector-door', 'ch4_008'],
  [train, 'ch4_reach_seluomi_standoff', 'ch4-seluomi-standoff', 'ch4_009'],
  [core, 'ch4_reach_core_car_outer', 'ch4-core-car-outer', 'ch4_011'],
  [core, 'ch4_enter_core_organ_chamber', 'ch4-charon-conversation', 'ch4_012'],
  [core, 'ch4_reach_final_boss_dais', 'ch4-final-boss-dais', 'ch4_014'],
]) {
  assert(source.includes(`id: '${questId}'`), `Missing chapter-4 quest ${questId}`);
  assert(
    source.includes(`target: { type: 'zone', id: '${targetId}' }`),
    `Quest ${questId} must target physical zone ${targetId}`,
  );
  assert(source.includes(`id: '${targetId}'`), `Missing chapter-4 target zone ${targetId}`);
  assert(
    source.includes(`questCompleteId: '${questId}'`) && source.includes(`storySceneId: '${sceneId}'`),
    `${targetId} must return to canonical ${sceneId}`,
  );
}

assert(
  game.includes('value: "ch4_train_infiltrated"') && game.includes('nextScene: "ch4_002"'),
  'Train infiltration event must apply before ch4_002 exploration',
);
assert(game.includes('nextScene: "ch4_006"'), 'Sequence-04 wake-up choices must converge on ch4_006');
assert(
  game.includes('startBattle("ch4_qilan_duo"') && game.includes('nextScene: "ch4_007"') && game.includes('nextScene: "ch4_008"'),
  'Qilan persuasion, battle, and optional Sequence-07 branch must remain canonical',
);
assert(game.includes('showScene("ch4_008")'), 'Qilan battle must still return to ch4_008');
assert(
  game.includes('key: "伊莱娜隐藏好感值"') && game.includes('nextScene: "ch4_009"'),
  'Elena response effects must remain canonical before ch4_009',
);
assert(
  game.includes('nextScene: "ch4_010"') && game.includes('startBattle("ch4_seluomi_final"'),
  'Seluomi standoff and final battle must remain canonical',
);
assert(
  game.includes('showScene("ch4_011")'),
  'Seluomi battle must still return to ch4_011 before the post-battle traversal',
);
assert(
  game.includes('nextScene: "ch4_012"') && game.includes('nextScene: "ch4_013"') && game.includes('nextScene: "ch4_014"'),
  'Core-car truth and final-prelude scene edges must remain canonical',
);
assert(
  game.includes('startBattle("ch4_charon_final"'),
  'Charon final battle must remain owned by the canonical battle system',
);

assert(
  !train.includes('DeepSeek') && !train.includes('OpenAI') &&
    !core.includes('DeepSeek') && !core.includes('OpenAI'),
  'Chapter-4 exploration must remain LLM OFF',
);

if (failures.length) {
  console.error('Chapter 4 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 4 exploration guard passed.');
