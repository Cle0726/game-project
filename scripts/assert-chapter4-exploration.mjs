import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const exists = (path) => fs.existsSync(path);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const game = read('game.js');
const registry = read('src/exploration/regionRegistry.ts');
const types = read('src/exploration/explorationTypes.ts');
const train = read('src/exploration/chapter4TrainData.ts');
const core = read('src/exploration/chapter4CoreData.ts');
const bridge = read('src/exploration-legacy-main.ts');
const host = read('src/simulation/exploration/ExplorationHost.ts');
const persistence = read('src/simulation/state/SimulationPersistence.ts');
const worldMapBridge = read('src/worldmap/worldMapBridge.ts');
const worldMapData = read('src/worldmap/worldMapData.ts');
const regionMapView = read('src/worldmap/components/RegionMapView.tsx');
const worldMapView = read('src/worldmap/components/WorldMapView.tsx');

const bridgeScenes = [
  'ch4_002',
  'ch4_003',
  'ch4_005',
  'ch4_006',
  'ch4_008',
  'ch4_009',
  'ch4_011',
  'ch4_012',
  'ch4_014',
];
for (const sceneId of bridgeScenes) {
  assert(game.includes(`\"${sceneId}\": {`), `Canonical chapter-4 scene ${sceneId} must exist`);
  assert(registry.includes(`sceneId: '${sceneId}'`), `${sceneId} must be registered as an exploration bridge`);
}

for (const protectedSceneId of [
  'chapter4_start',
  'ch4_000',
  'ch4_001',
  'ch4_004',
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
  'CH4_AUDIENCE_INVESTIGATION_REGION',
  'CH4_AKA_FOLLOWUP_REGION',
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

// Chapter 4 used to force the generic traveler via playerSpriteSrc, overriding the
// bridge's conductor-gender resolution. Every Chapter-4 region must expose variants.
for (const [source, expectedCount, label] of [
  [train, 6, 'train'],
  [core, 3, 'core'],
]) {
  const variantUses = source.match(/playerSpriteVariants: PLAYER_SPRITE_VARIANTS/g) ?? [];
  assert(
    variantUses.length === expectedCount,
    `Every chapter-4 ${label} region must use protagonist sprite variants`,
  );
  assert(
    source.includes('protagonistMaleSrc') &&
      source.includes('protagonistFemaleSrc') &&
      source.includes('protagonistFallbackSrc'),
    `Chapter-4 ${label} sprite variants must include male, female, and fallback art`,
  );
  assert(
    !source.includes('playerSpriteSrc: PLAYER_SPRITE'),
    `Chapter-4 ${label} regions must not force the fallback protagonist sprite`,
  );
}

for (const [source, questId, targetId, sceneId] of [
  [train, 'ch4_enter_audience_car', 'ch4-audience-forward', 'ch4_002'],
  [train, 'ch4_find_sequence04_after_audience', 'ch4-sequence04-search', 'ch4_003'],
  [train, 'ch4_return_to_sequence04', 'ch4-sequence04-resonance', 'ch4_005'],
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

// The authored Chapter-4 side scenes used to exist only as dead SCENES entries.
// They now surface through branch-aware, one-shot physical interactions instead of a
// random Chapter-4 event pool, so the authored return scenes and values stay untouched.
for (const sceneId of [
  'chapter4_event_E401',
  'chapter4_event_E402',
  'chapter4_event_E403',
  'chapter4_event_E404',
  'chapter4_event_E405',
  'chapter4_event_minigame_audience_identify',
  'chapter4_event_minigame_resonance_wakeup',
  'chapter4_event_minigame_three_side_dispatch',
  'chapter4_event_minigame_organ_dodge',
]) {
  assert(game.includes(`\"${sceneId}\": {`), `Authored Chapter-4 side scene ${sceneId} must exist`);
  assert(
    train.includes(`storySceneId: '${sceneId}'`) || core.includes(`storySceneId: '${sceneId}'`),
    `Authored Chapter-4 side scene ${sceneId} must be physically reachable`,
  );
}
assert(
  train.includes("requiredGameEvent: 'E401_audience_identified'") &&
    train.includes("requiredGameEvent: '独奏者的终局'") &&
    train.includes("requiredGameEvent: '希声看见观众席'") &&
    train.includes("requiredGameEvent: '三方混战种子'"),
  'Branch-specific Chapter-4 side interactions must respect their authored story choices',
);
assert(
  train.includes("requiredAnyGameEvents: [") &&
    train.includes("'零四未鸣共鸣唤醒'") &&
    train.includes("'阿缇娅同类共鸣零四'") &&
    train.includes("'弥洛幸存者对话零四'"),
  'Sequence-04 resonance minigame must unlock after any authored wake-up route',
);
assert(
  types.includes('requiredGameEvent?: string;') &&
    types.includes('requiredAnyGameEvents?: string[];') &&
    types.includes('once?: boolean;'),
  'Exploration interaction zones must support authored-event gates and one-shot use',
);
assert(
  host.includes('getAvailableInteractionZones()') &&
    host.includes('this.triggeredGameEvents.has(zone.requiredGameEvent)') &&
    host.includes('this.consumedInteractionZoneIds.push(zone.id)'),
  'Exploration host must hide unavailable/consumed side interactions',
);
assert(
  persistence.includes('consumedInteractionZoneIds: string[];') &&
    persistence.includes('consumedInteractionZoneIds: [...snapshot.consumedInteractionZoneIds]'),
  'One-shot side interactions must persist with the region snapshot',
);

// ch4_018 explicitly supports replaying the chapter. A replay must not restore the
// previous run's last coordinates/completed exploration objectives or one-shot zones.
assert(
  game.includes('nextScene: "chapter4_start"') && game.includes('nextScene: "ch4_000"'),
  'Chapter 4 must retain its authored replay path through chapter4_start -> ch4_000',
);
assert(
  persistence.includes('export function resetExplorationProgressByPrefix') &&
    persistence.includes('delete state.regions[regionId]') &&
    persistence.includes('state.quests.completedQuestIds = state.quests.completedQuestIds.filter(keepQuest)'),
  'Simulation persistence must support clearing chapter-local region and quest snapshots',
);
assert(
  bridge.includes("sceneId === 'ch4_000'") &&
    bridge.includes("resetExplorationProgressByPrefix('ch4_')"),
  'Entering canonical ch4_000 must reset stale chapter-4 exploration progress before replay',
);

// The authored ch4_018 completion choice still stores chapterProgress=4. The world map
// must therefore treat chapter4_complete as progress 5 or Chapter 5 remains locked.
assert(
  game.includes('value: "chapter4_complete"'),
  'Chapter 4 epilogue must emit chapter4_complete',
);
assert(
  worldMapData.includes("id: 'chapter5_floating_circus'") &&
    worldMapData.includes("unlockCondition: { type: 'chapter_progress', minChapter: 5 }"),
  'Chapter 5 world-map region must retain its progress-5 unlock contract',
);
assert(
  worldMapBridge.includes("eventId.match(/^chapter(\\d+)_complete(?:$|_)/)") &&
    worldMapBridge.includes('candidates.push(Number(completedChapterMatch[1]) + 1)') &&
    worldMapBridge.includes('Math.max(...candidates)'),
  'World-map progress inference must advance from chapter completion events without discarding explicit progress',
);

// Region maps previously trusted static node data, so an unlocked chapter exposed its
// finale and branch-only side scenes immediately. Runtime access must now be derived
// from story progress, and exploration-owned Chapter-4 events cannot launch directly.
assert(
  worldMapBridge.includes('export function getWorldMapNodeAccess') &&
    worldMapBridge.includes("nodeId.startsWith('chapter4_event_')") &&
    worldMapBridge.includes('nodePosition.step > currentPosition.step'),
  'World-map bridge must gate future nodes and reserve Chapter-4 physical side scenes for Exploration',
);
assert(
  regionMapView.includes('getWorldMapNodeAccess(node, region, gameState)') &&
    regionMapView.includes('disabled={!access.isAccessible}') &&
    regionMapView.includes("!access.isAccessible ? 'is-locked' : ''"),
  'Region map buttons must enforce derived node accessibility instead of static atlas flags',
);
assert(
  worldMapView.includes('gameState={gameState}'),
  'World map must pass the live GameState into RegionMapView node gating',
);

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
