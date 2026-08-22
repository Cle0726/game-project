import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const chapter0 = read('src/exploration/chapter0RegionData.ts');

const canonicalBridgeScenes = [
  'ch0_001_road_entrance',
  'ch0_002_silent_town',
];

for (const sceneId of canonicalBridgeScenes) {
  // Require the exact SCENES object key, not a loose substring. This prevents stale
  // aliases such as ch0_001 from accidentally matching ch0_001_road_entrance.
  assert(
    game.includes(`"${sceneId}": {`),
    `Canonical scene ${sceneId} must exist as an exact SCENES key in game.js`,
  );
  assert(
    registry.includes(`sceneId: '${sceneId}'`),
    `${sceneId} must be registered as an exploration bridge`,
  );
}

for (const staleSceneId of ["sceneId: 'ch0_001'", "sceneId: 'ch0_003'", "sceneId: 'ch0_004'"]) {
  assert(!registry.includes(staleSceneId), `Stale chapter-0 bridge must be removed: ${staleSceneId}`);
}

for (const assetPath of [
  'assets/generated/chapter0/backgrounds/bg_ch0_miansha_residential_alley_v01.png',
  'assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png',
  'assets/generated/chapter0/sprites/characters/char_ch0_anning_sprite_default_v02.png',
  'assets/generated/chapter0/sprites/characters/char_ch0_tiya_sprite_default_ai_v01.png',
  'assets/generated/chapter0/sprites/characters/char_ch0_noi_sprite_default_v03.png',
]) {
  assert(exists(assetPath), `Missing chapter-0 exploration asset: ${assetPath}`);
}

for (const questId of [
  'ch0_reach_road_entrance',
  'ch0_reach_sealed_piano',
]) {
  assert(chapter0.includes(`id: '${questId}'`), `Missing quest ${questId}`);
}

for (const zoneId of ['ch0-road-entrance', 'ch0-sealed-piano']) {
  const targetUse = chapter0.includes(`target: { type: 'zone', id: '${zoneId}' }`);
  const zoneUse = chapter0.includes(`id: '${zoneId}',`);
  assert(targetUse && zoneUse, `Quest target ${zoneId} must resolve to an interaction zone`);
}

for (const waypointId of [
  'alley_entry',
  'alley_mid',
  'anning_wait',
  'tiya_wait',
  'road_entrance',
  'square_entry',
  'square_mid',
  'sealed_piano',
  'noi_wait',
  'anning_square',
  'tiya_square',
]) {
  assert(chapter0.includes(`id: '${waypointId}'`), `Missing waypoint ${waypointId}`);
}

assert(
  chapter0.includes("storySceneId: 'ch0_001_road_entrance'"),
  'Road entrance must return to canonical ch0_001_road_entrance',
);
assert(
  chapter0.includes("storySceneId: 'ch0_002_silent_town'"),
  'Sealed piano must return to canonical ch0_002_silent_town',
);
assert(
  !chapter0.includes('DeepSeek') && !chapter0.includes('OpenAI'),
  'Chapter 0 first slice must remain LLM OFF',
);

if (failures.length) {
  console.error('Chapter 0 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 0 exploration guard passed.');
