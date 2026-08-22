import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const explorationSave = read('src/exploration/explorationSave.ts');
const legacyMain = read('src/exploration-legacy-main.ts');
const legacyPathfinding = read('src/exploration/pathfinding.ts');
const legacyQuestState = read('src/exploration/questState.ts');
const legacySchedule = read('src/exploration/npcSchedule.ts');
const legacyRegionRegistry = read('src/exploration/regionRegistry.ts');
const legacyActorMotion = read('src/exploration/actorMotion.ts');
const persistence = read('src/simulation/state/SimulationPersistence.ts');
const adapter = read('src/simulation/state/LegacyGameStateAdapter.ts');
const runtime = read('src/simulation/runtime/SimulationRuntime.ts');
const coreCommands = read('src/simulation/command/CoreCommandHandlers.ts');
const freeRoam = read('src/exploration/FreeRoamPrototype.ts');
const collisionSystem = read('src/simulation/exploration/CollisionSystem.ts');
const movementSystem = read('src/simulation/exploration/MovementSystem.ts');
const interactionSystem = read('src/simulation/exploration/InteractionSystem.ts');
const movementAdapter = read('src/simulation/exploration/LegacyFreeRoamMovementAdapter.ts');
const interactionAdapter = read('src/simulation/exploration/LegacyFreeRoamInteractionAdapter.ts');
const actorMotionSystem = read('src/simulation/exploration/ActorMotionSystem.ts');
const navigationSystem = read('src/simulation/exploration/NavigationSystem.ts');
const regionSystem = read('src/simulation/exploration/RegionSystem.ts');
const questSystem = read('src/simulation/quest/QuestSystem.ts');
const simulationClock = read('src/simulation/runtime/SimulationClock.ts');
const scheduleSystem = read('src/simulation/agent/ScheduleSystem.ts');

const failures = [];

if (!explorationSave.includes("../simulation/state/SimulationPersistence")) {
  failures.push('explorationSave.ts must delegate to SimulationPersistence');
}
if (explorationSave.includes('cle.exploration.verticalSlice.v1')) {
  failures.push('explorationSave.ts must not own the legacy localStorage key');
}
if (!persistence.includes('cle.exploration.verticalSlice.v1')) {
  failures.push('SimulationPersistence.ts must retain one-time legacy migration support');
}
if (!adapter.includes('simulationV1')) {
  failures.push('LegacyGameStateAdapter.ts must own the GameState.simulationV1 bridge');
}
if (!runtime.includes('CommandBus') || !runtime.includes('registerCoreCommandHandlers')) {
  failures.push('SimulationRuntime.ts must own a validated CommandBus with core handlers');
}
if (!coreCommands.includes("command.source === 'agent'")) {
  failures.push('CoreCommandHandlers.ts must explicitly block agent quest completion');
}
if (!coreCommands.includes("type: 'region.entered'")) {
  failures.push('CoreCommandHandlers.ts must emit canonical region entry events');
}
if (!coreCommands.includes("type: 'quest.completed'")) {
  failures.push('CoreCommandHandlers.ts must emit canonical quest completion events');
}
if (/window\.GameState/.test(freeRoam)) {
  failures.push('FreeRoamPrototype.ts must not directly mutate window.GameState');
}
if (!legacyMain.includes('wireLegacyFreeRoamMovement')) {
  failures.push('exploration-legacy-main.ts must wire live movement through Simulation systems');
}
if (!legacyMain.includes('wireLegacyFreeRoamInteraction')) {
  failures.push('exploration-legacy-main.ts must wire live interaction through Simulation systems');
}
if (!movementAdapter.includes("from './MovementSystem'")) {
  failures.push('LegacyFreeRoamMovementAdapter.ts must delegate to MovementSystem');
}
if (!interactionAdapter.includes("from './InteractionSystem'")) {
  failures.push('LegacyFreeRoamInteractionAdapter.ts must delegate to InteractionSystem');
}
if (!legacyPathfinding.includes('../simulation/exploration/NavigationSystem')) {
  failures.push('legacy pathfinding.ts must delegate to NavigationSystem');
}
if (legacyPathfinding.includes('const queue: string[]')) {
  failures.push('legacy pathfinding.ts must not own graph traversal logic');
}
if (!legacyQuestState.includes('../simulation/quest/QuestSystem')) {
  failures.push('legacy questState.ts must delegate to QuestSystem');
}
if (legacyQuestState.includes('completedQuestIds.includes')) {
  failures.push('legacy questState.ts must not own quest transition rules');
}
if (!legacySchedule.includes('../simulation/runtime/SimulationClock')) {
  failures.push('legacy npcSchedule.ts must delegate time advancement to SimulationClock');
}
if (!legacySchedule.includes('../simulation/agent/ScheduleSystem')) {
  failures.push('legacy npcSchedule.ts must delegate schedule resolution to ScheduleSystem');
}
if (!legacyRegionRegistry.includes('../simulation/exploration/RegionSystem')) {
  failures.push('legacy regionRegistry.ts must delegate lookup to RegionSystem');
}
if (!legacyActorMotion.includes('../simulation/exploration/ActorMotionSystem')) {
  failures.push('legacy actorMotion.ts must delegate motion math to ActorMotionSystem');
}
if (!collisionSystem.includes('moveCircleWithAxisCollision')) {
  failures.push('CollisionSystem.ts must own axis-separated circle collision');
}
if (!movementSystem.includes('moveActorByDelta')) {
  failures.push('MovementSystem.ts must expose deterministic actor movement');
}
if (!interactionSystem.includes('findNearestInteractionActor')) {
  failures.push('InteractionSystem.ts must own deterministic nearby actor selection');
}
if (!interactionSystem.includes('evaluateQuestInteractionGate')) {
  failures.push('InteractionSystem.ts must own deterministic quest interaction gating');
}
if (!actorMotionSystem.includes('stepActorMotion')) {
  failures.push('ActorMotionSystem.ts must own renderer-independent walk motion math');
}
if (!navigationSystem.includes('findNavigationPath')) {
  failures.push('NavigationSystem.ts must own navigation graph traversal');
}
if (!regionSystem.includes('createRegionRegistry')) {
  failures.push('RegionSystem.ts must own region lookup/indexing');
}
if (!questSystem.includes('canCompleteQuest')) {
  failures.push('QuestSystem.ts must own quest transition validation');
}
if (!simulationClock.includes('advanceSimulationClock')) {
  failures.push('SimulationClock.ts must own accelerated game time');
}
if (!scheduleSystem.includes('resolveScheduleEntry')) {
  failures.push('ScheduleSystem.ts must own npc schedule selection');
}

if (failures.length) {
  console.error('Simulation architecture guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Simulation architecture guard passed.');
