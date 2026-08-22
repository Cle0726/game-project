import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const chapter0 = read('src/exploration/chapter0RegionData.ts');

for (const sceneId of ['ch0_001', 'ch0_003', 'ch0_004']) {
  assert(game.includes(sceneId), `Canonical scene ${sceneId} must exist in game.js`);
  assert(registry.includes(`sceneId: '${sceneId}'`), `${sceneId} must be registered as an exploration bridge`);
}

for (const assetPath of [
  'assets/generated/chapter0/backgrounds/bg_ch0_miansha_residential_alley_v01.png',
  'assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png',
  'assets/generated/character_states/sprites/char_anning_sprite_default_v04.png',
  'assets/generated/character_states/sprites/char_tiya_sprite_default_v04.png',
]) {
  assert(exists(assetPath), `Missing chapter-0 exploration asset: ${assetPath}`);
}

for (const questId of [
  'ch0_inspect_silent_alley',
  'ch0_follow_tiya_to_square',
  'ch0_reach_old_piano',
]) {
  assert(chapter0.includes(`id: '${questId}'`), `Missing quest ${questId}`);
}

for (const zoneId of ['ch0-metal-plate', 'ch0-town-exit', 'ch0-old-piano']) {
  const matches = chapter0.match(new RegExp(`id: '${zoneId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g')) ?? [];
  // Each main target appears once in the quest target and once as the interaction zone.
  assert(matches.length >= 2, `Quest target ${zoneId} must resolve to an interaction zone`);
}

const waypointLinkTargets = [
  'alley_entry', 'alley_mid', 'metal_plate', 'anning_wait', 'tiya_wait', 'town_exit',
  'square_entry', 'square_mid', 'old_piano', 'square_west', 'square_east',
];
for (const waypointId of waypointLinkTargets) {
  assert(chapter0.includes(`id: '${waypointId}'`), `Missing waypoint ${waypointId}`);
}

assert(chapter0.includes("nextQuestId: 'ch0_follow_tiya_to_square'"), 'Alley tutorial quest chain must advance to town-centre travel');
assert(chapter0.includes("storySceneId: 'ch0_001'"), 'Metal plate must return to canonical ch0_001');
assert(chapter0.includes("storySceneId: 'ch0_003'"), 'Town exit must return to canonical ch0_003');
assert(chapter0.includes("storySceneId: 'ch0_004'"), 'Old piano must return to canonical ch0_004');
assert(!chapter0.includes('DeepSeek') && !chapter0.includes('OpenAI'), 'Chapter 0 first slice must remain LLM OFF');

if (failures.length) {
  console.error('Chapter 0 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 0 exploration guard passed.');
