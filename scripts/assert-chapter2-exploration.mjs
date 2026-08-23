import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const observatory = read('src/exploration/chapter2ObservatoryData.ts');
const core = read('src/exploration/chapter2CoreData.ts');

const bridgeScenes = [
  'ch2_snow_002',
  'ch2_snow_003',
  'ch2_snow_006',
  'ch2_snow_008',
  'ch2_snow_011',
  'ch2_snow_015',
];
for (const sceneId of bridgeScenes) {
  assert(
    game.includes(`\"${sceneId}\": {`),
    `Canonical chapter-2 scene ${sceneId} must exist as an exact SCENES key`,
  );
  assert(
    registry.includes(`sceneId: '${sceneId}'`),
    `${sceneId} must be registered as an exploration bridge`,
  );
}

for (const protectedSceneId of [
  'chapter2_start',
  'ch2_snow_000',
  'ch2_snow_001',
  'ch2_snow_004',
  'ch2_snow_005',
  'ch2_snow_007',
  'ch2_snow_009',
  'ch2_snow_010',
  'ch2_snow_010_a',
  'ch2_snow_010_b',
  'ch2_snow_010_c',
  'ch2_snow_012',
  'ch2_snow_013',
  'ch2_snow_014',
  'ch2_minigame_silent_step',
  'ch2_minigame_archive_puzzle',
  'ch2_minigame_echo_calibration',
  'ch2_minigame_frost_ensemble',
]) {
  assert(
    game.includes(`\"${protectedSceneId}\": {`),
    `Protected chapter-2 scene ${protectedSceneId} must exist`,
  );
  assert(
    !registry.includes(`sceneId: '${protectedSceneId}'`),
    `Protected chapter-2 scene ${protectedSceneId} must not be intercepted`,
  );
}

for (const assetPath of [
  'assets/generated/chapter2/backgrounds/bg_ch2_snowfield_observatory_approach_v01.png',
  'assets/generated/chapter2/backgrounds/bg_ch2_frost_score_observatory_exterior_v01.png',
  'assets/generated/chapter2/backgrounds/bg_ch2_crystal_resonance_corridor_v01.png',
  'assets/generated/chapter2/backgrounds/bg_ch2_core_recording_chamber_v01.png',
]) {
  assert(exists(assetPath), `Missing chapter-2 exploration asset: ${assetPath}`);
}

for (const exportName of [
  'CH2_OBSERVATORY_SNOW_APPROACH_REGION',
  'CH2_OBSERVATORY_MAIN_DOOR_REGION',
  'CH2_CRYSTAL_CORRIDOR_GUARDIAN_APPROACH_REGION',
]) {
  assert(observatory.includes(`export const ${exportName}`), `Missing chapter-2 region export ${exportName}`);
  assert(registry.includes(exportName), `Chapter-2 region ${exportName} must be registered`);
}

for (const exportName of [
  'CH2_CORE_DOOR_POST_BOSS_REGION',
  'CH2_CORE_RECORDER_APPROACH_REGION',
  'CH2_OBSERVATORY_DEPARTURE_REGION',
]) {
  assert(core.includes(`export const ${exportName}`), `Missing chapter-2 core region export ${exportName}`);
  assert(registry.includes(exportName), `Chapter-2 core region ${exportName} must be registered`);
}

for (const [source, questId, targetId, sceneId] of [
  [observatory, 'ch2_reach_observatory', 'ch2-observatory-overlook', 'ch2_snow_002'],
  [observatory, 'ch2_reach_observatory_door', 'ch2-observatory-main-door', 'ch2_snow_003'],
  [observatory, 'ch2_reach_guardian_area', 'ch2-guardian-area', 'ch2_snow_006'],
  [core, 'ch2_approach_core_door', 'ch2-core-sealed-door', 'ch2_snow_008'],
  [core, 'ch2_reach_residual_recorder', 'ch2-residual-recorder', 'ch2_snow_011'],
  [core, 'ch2_descend_from_observatory', 'ch2-route-split-overlook', 'ch2_snow_015'],
]) {
  assert(source.includes(`id: '${questId}'`), `Missing chapter-2 quest ${questId}`);
  assert(
    source.includes(`target: { type: 'zone', id: '${targetId}' }`),
    `Quest ${questId} must target physical zone ${targetId}`,
  );
  assert(source.includes(`id: '${targetId}'`), `Quest target ${targetId} must exist`);
  assert(
    source.includes(`questCompleteId: '${questId}'`) &&
      source.includes(`storySceneId: '${sceneId}'`),
    `${targetId} must return to canonical ${sceneId}`,
  );
}

// The original chapter-2 route owns survival and resonance state.
assert(
  game.includes('key: "体感温度"') && game.includes('key: "谱鸣共振"'),
  'Chapter-2 survival/resonance state must remain authored in game.js',
);
assert(
  game.includes('nextScene: "ch2_snow_003"'),
  'Both authored observatory-exterior choices must still converge on ch2_snow_003',
);
assert(
  game.includes('effect: () => drawChapter2MapEvent()') &&
    game.includes('nextScene: "ch2_minigame_silent_step"') &&
    game.includes('nextScene: "ch2_minigame_archive_puzzle"') &&
    game.includes('nextScene: "ch2_snow_006"'),
  'ch2_snow_005 must retain its event/minigame/guardian preparation choices',
);

// Major encounter and reveal ownership must stay canonical.
assert(
  game.includes('startBattle("ch2_scoreheart_guardian"'),
  'Scoreheart Guardian boss must remain owned by the canonical battle system',
);
assert(
  game.includes('showScene("ch2_snow_008")'),
  'Scoreheart Guardian result must still return to canonical ch2_snow_008',
);
assert(
  game.includes('startBattle("ch2_ningsu_guardian"'),
  'Ningsu forced confrontation must remain owned by the canonical battle system',
);
for (const outcome of ['ch2_snow_010_a', 'ch2_snow_010_b', 'ch2_snow_010_c']) {
  assert(
    game.includes(`showScene("${outcome}")`) || game.includes(`nextScene: "${outcome}"`),
    `Ningsu resolution must preserve ${outcome}`,
  );
}
assert(
  game.includes('nextScene: "ch2_snow_011"'),
  'All authored Ningsu outcomes must still converge on ch2_snow_011',
);
assert(
  game.includes('nextScene: "ch2_minigame_echo_calibration"') &&
    game.includes('nextScene: "ch2_snow_012"'),
  'Residual-recorder calibration and mother-echo presentation must remain canonical',
);
assert(
  game.includes('nextScene: "ch2_snow_015"'),
  'The authored chapter-2 farewell must still route to ch2_snow_015 after companion/support choice',
);

assert(
  !observatory.includes('DeepSeek') && !observatory.includes('OpenAI') &&
    !core.includes('DeepSeek') && !core.includes('OpenAI'),
  'Chapter-2 exploration must remain LLM OFF',
);

if (failures.length) {
  console.error('Chapter 2 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 2 exploration guard passed.');
