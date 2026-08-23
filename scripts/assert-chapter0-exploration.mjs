import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const chapter0 = read('src/exploration/chapter0RegionData.ts');
const townHub = read('src/exploration/chapter0TownHubData.ts');
const theaterApproach = read('src/exploration/chapter0TheaterApproachData.ts');
const postContract = read('src/exploration/chapter0PostContractTravelData.ts');

const canonicalBridgeScenes = [
  'ch0_001_road_entrance',
  'ch0_002_silent_town',
  'ch0_009_silent_school',
  'ch0_010_record_shop',
  'ch0_011_backstage_dress',
  'ch0_012_clocktower',
  'ch0_013_forbidden_performance',
  'ch0_018_teabreak_not_tiya',
  'ch0_019_charron_revealed',
];

for (const sceneId of canonicalBridgeScenes) {
  // Require the exact SCENES object key, not a loose substring. This prevents stale
  // aliases such as ch0_001 from accidentally matching ch0_001_road_entrance.
  assert(
    game.includes(`\"${sceneId}\": {`),
    `Canonical scene ${sceneId} must exist as an exact SCENES key in game.js`,
  );
  assert(
    registry.includes(`sceneId: '${sceneId}'`),
    `${sceneId} must be registered as an exploration bridge`,
  );
}

// The authored map-open scene owns dialogue, side-event access, and branch effects.
// It must play normally; only the destination scenes after the choice are intercepted.
assert(game.includes('"ch0_008_map_open": {'), 'Canonical ch0_008_map_open scene must exist');
assert(
  !registry.includes("sceneId: 'ch0_008_map_open'"),
  'ch0_008_map_open must remain canonical and must not be intercepted',
);

// Awakening, baton creation, both tutorial battles, the boss, and the epilogue remain
// fully authored story/battle nodes. Exploration must not swallow those presentations.
for (const protectedSceneId of [
  'ch0_014_atya_awakening',
  'ch0_015_first_baton',
  'ch0_016_moth_swarm_tutorial',
  'ch0_017_stage_crawler',
  'ch0_020_sound_stripping_boss',
  'ch0_021_epilogue',
]) {
  assert(game.includes(`\"${protectedSceneId}\": {`), `Protected Canon scene ${protectedSceneId} must exist`);
  assert(
    !registry.includes(`sceneId: '${protectedSceneId}'`),
    `Protected Canon scene ${protectedSceneId} must not be intercepted`,
  );
}

for (const staleSceneId of ["sceneId: 'ch0_001'", "sceneId: 'ch0_003'", "sceneId: 'ch0_004'"]) {
  assert(!registry.includes(staleSceneId), `Stale chapter-0 bridge must be removed: ${staleSceneId}`);
}

for (const assetPath of [
  'assets/generated/chapter0/backgrounds/bg_ch0_miansha_residential_alley_v01.png',
  'assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png',
  'assets/generated/chapter0/backgrounds/bg_ch0_abandoned_theater_stage_v01.png',
  'assets/generated/chapter0/sprites/characters/char_ch0_anning_sprite_default_v02.png',
  'assets/generated/chapter0/sprites/characters/char_ch0_tiya_sprite_default_ai_v01.png',
  'assets/generated/chapter0/sprites/characters/char_ch0_noi_sprite_default_v03.png',
  'assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinche_sprite_pre_contract_v03.png',
  'assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinsa_sprite_pre_contract_v03.png',
]) {
  assert(exists(assetPath), `Missing chapter-0 exploration asset: ${assetPath}`);
}

for (const questId of ['ch0_reach_road_entrance', 'ch0_reach_sealed_piano']) {
  assert(chapter0.includes(`id: '${questId}'`), `Missing quest ${questId}`);
}
for (const zoneId of ['ch0-road-entrance', 'ch0-sealed-piano']) {
  const targetUse = chapter0.includes(`target: { type: 'zone', id: '${zoneId}' }`);
  const zoneUse = chapter0.includes(`id: '${zoneId}',`);
  assert(targetUse && zoneUse, `Quest target ${zoneId} must resolve to an interaction zone`);
}
for (const waypointId of [
  'alley_entry', 'alley_mid', 'anning_wait', 'tiya_wait', 'road_entrance',
  'square_entry', 'square_mid', 'sealed_piano', 'noi_wait', 'anning_square', 'tiya_square',
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

const townHubTargets = [
  { key: 'school', questId: 'ch0_hub_reach_school', zoneId: 'ch0-hub-school-gate', sceneId: 'ch0_009_silent_school', exportName: 'CH0_MIANSHA_TOWN_HUB_SCHOOL_REGION' },
  { key: 'recordShop', questId: 'ch0_hub_reach_record_shop', zoneId: 'ch0-hub-record-shop', sceneId: 'ch0_010_record_shop', exportName: 'CH0_MIANSHA_TOWN_HUB_RECORD_SHOP_REGION' },
  { key: 'theater', questId: 'ch0_hub_reach_theater', zoneId: 'ch0-hub-theater-door', sceneId: 'ch0_011_backstage_dress', exportName: 'CH0_MIANSHA_TOWN_HUB_THEATER_REGION' },
  { key: 'clocktower', questId: 'ch0_hub_reach_clocktower', zoneId: 'ch0-hub-clocktower-gate', sceneId: 'ch0_012_clocktower', exportName: 'CH0_MIANSHA_TOWN_HUB_CLOCKTOWER_REGION' },
];
for (const target of townHubTargets) {
  assert(townHub.includes(`key: '${target.key}'`), `Missing town-hub target ${target.key}`);
  assert(townHub.includes(`questId: '${target.questId}'`), `Missing town-hub quest ${target.questId}`);
  assert(townHub.includes(`zoneId: '${target.zoneId}'`), `Missing town-hub zone ${target.zoneId}`);
  assert(townHub.includes(`sceneId: '${target.sceneId}'`), `Town-hub target must return to ${target.sceneId}`);
  assert(townHub.includes(`export const ${target.exportName}`), `Missing town-hub region export ${target.exportName}`);
}
for (const waypointId of [
  'hub_entry', 'hub_south_west', 'hub_south_east', 'hub_west_cross', 'hub_east_cross',
  'hub_north_west', 'hub_north_east', 'hub_school_gate', 'hub_record_gate',
  'hub_theater_gate', 'hub_clock_gate', 'hub_anning', 'hub_tiya',
]) {
  assert(townHub.includes(`id: '${waypointId}'`), `Missing town-hub waypoint ${waypointId}`);
}
assert(
  townHub.includes('playerSpriteVariants: CH0_PRE_CONTRACT_PLAYER_SPRITES'),
  'Town hub must keep the protagonist in pre-contract chapter-0 state',
);

assert(
  theaterApproach.includes("id: 'ch0_reach_forbidden_performance_stage'"),
  'Forbidden-performance approach quest must exist',
);
assert(
  theaterApproach.includes("target: { type: 'zone', id: 'ch0-forbidden-stage-focus' }"),
  'Forbidden-performance approach quest must target the stage focus zone',
);
assert(
  theaterApproach.includes("storySceneId: 'ch0_013_forbidden_performance'"),
  'Theater approach must return to canonical ch0_013_forbidden_performance',
);
assert(
  theaterApproach.includes('playerSpriteVariants: CH0_PRE_CONTRACT_PLAYER_SPRITES'),
  'Theater approach must keep the protagonist pre-contract before ch0_015_first_baton',
);

// Canon battle flow: moths -> stage crawler -> diner tea break. We only turn the
// post-stage-crawler location change into movement, never battle resolution itself.
assert(
  game.includes('showScene("ch0_017_stage_crawler")'),
  'Moth-swarm victory must still route to canonical ch0_017_stage_crawler',
);
assert(
  game.includes('showScene("ch0_018_teabreak_not_tiya")'),
  'Stage-crawler victory must still route to canonical ch0_018 tea break',
);
assert(
  game.includes('nextScene: "ch0_019_charron_revealed"'),
  'Canonical ch0_018 choices must still route toward ch0_019',
);
assert(
  postContract.includes("id: 'ch0_retreat_to_diner'"),
  'Post-contract diner-retreat quest must exist',
);
assert(
  postContract.includes("storySceneId: 'ch0_018_teabreak_not_tiya'"),
  'Diner retreat must return to canonical ch0_018',
);
assert(
  postContract.includes("id: 'ch0_follow_knock_to_theater'"),
  'Post-contract return-to-theater quest must exist',
);
assert(
  postContract.includes("storySceneId: 'ch0_019_charron_revealed'"),
  'Return-to-theater travel must open canonical ch0_019',
);
assert(
  !postContract.includes('playerSpriteVariants:'),
  'Post-contract travel must not reuse pre-contract protagonist sprite variants',
);
assert(
  registry.includes('CH0_POST_BATTLE_DINER_RETREAT_REGION') &&
    registry.includes('CH0_RETURN_TO_CHARON_THEATER_REGION'),
  'Both post-contract travel regions must be registered',
);

assert(
  !chapter0.includes('DeepSeek') && !chapter0.includes('OpenAI') &&
    !townHub.includes('DeepSeek') && !townHub.includes('OpenAI') &&
    !theaterApproach.includes('DeepSeek') && !theaterApproach.includes('OpenAI') &&
    !postContract.includes('DeepSeek') && !postContract.includes('OpenAI'),
  'Chapter 0 exploration must remain LLM OFF',
);

if (failures.length) {
  console.error('Chapter 0 exploration guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 0 exploration guard passed.');
