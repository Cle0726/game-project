import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const explorationSave = read('src/exploration/explorationSave.ts');
const legacyPathfinding = read('src/exploration/pathfinding.ts');
const legacyQuestState = read('src/exploration/questState.ts');
const persistence = read('src/simulation/state/SimulationPersistence.ts');
const adapter = read('src/simulation/state/LegacyGameStateAdapter.ts');
const runtime = read('src/simulation/runtime/SimulationRuntime.ts');
const freeRoam = read('src/exploration/FreeRoamPrototype.ts');
const collisionSystem = read('src/simulation/exploration/CollisionSystem.ts');
const movementSystem = read('src/simulation/exploration/MovementSystem.ts');
const navigationSystem = read('src/simulation/exploration/NavigationSystem.ts');
const questSystem = read('src/simulation/quest/QuestSystem.ts');

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
if (!runtime.includes('CommandBus')) {
  failures.push('SimulationRuntime.ts must own a validated CommandBus');
}
if (/window\.GameState/.test(freeRoam)) {
  failures.push('FreeRoamPrototype.ts must not directly mutate window.GameState');
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
if (!collisionSystem.includes('moveCircleWithAxisCollision')) {
  failures.push('CollisionSystem.ts must own axis-separated circle collision');
}
if (!movementSystem.includes('moveActorByDelta')) {
  failures.push('MovementSystem.ts must expose deterministic actor movement');
}
if (!navigationSystem.includes('findNavigationPath')) {
  failures.push('NavigationSystem.ts must own navigation graph traversal');
}
if (!questSystem.includes('canCompleteQuest')) {
  failures.push('QuestSystem.ts must own quest transition validation');
}

if (failures.length) {
  console.error('Simulation architecture guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Simulation architecture guard passed.');
