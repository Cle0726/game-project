import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const requireText = (condition, message) => { if (!condition) failures.push(message); };

const explorationSave = read('src/exploration/explorationSave.ts');
const legacyMain = read('src/exploration-legacy-main.ts');
const legacyPathfinding = read('src/exploration/pathfinding.ts');
const legacyQuestState = read('src/exploration/questState.ts');
const legacySchedule = read('src/exploration/npcSchedule.ts');
const legacyRegionRegistry = read('src/exploration/regionRegistry.ts');
const legacyActorMotion = read('src/exploration/actorMotion.ts');
const persistence = read('src/simulation/state/SimulationPersistence.ts');
const stateAdapter = read('src/simulation/state/LegacyGameStateAdapter.ts');
const simulationRuntime = read('src/simulation/runtime/SimulationRuntime.ts');
const coreCommands = read('src/simulation/command/CoreCommandHandlers.ts');
const explorationRuntime = read('src/simulation/exploration/ExplorationRuntime.ts');
const explorationHost = read('src/simulation/exploration/ExplorationHost.ts');
const inputController = read('src/simulation/exploration/ExplorationInputController.ts');
const explorationLoop = read('src/simulation/exploration/ExplorationLoop.ts');
const npcController = read('src/simulation/exploration/ExplorationNpcController.ts');
const collisionSystem = read('src/simulation/exploration/CollisionSystem.ts');
const movementSystem = read('src/simulation/exploration/MovementSystem.ts');
const interactionSystem = read('src/simulation/exploration/InteractionSystem.ts');
const explorationRenderer = read('src/simulation/exploration/ExplorationRenderer.ts');
const actorViewFactory = read('src/simulation/exploration/ExplorationActorViewFactory.ts');
const worldPresentation = read('src/simulation/exploration/ExplorationWorldPresentation.ts');
const dialoguePresentation = read('src/simulation/exploration/ExplorationDialoguePresentation.ts');
const hudPresentation = read('src/simulation/exploration/ExplorationHudPresentation.ts');
const objectivePresentation = read('src/simulation/exploration/ExplorationObjectivePresentation.ts');
const actorMotionSystem = read('src/simulation/exploration/ActorMotionSystem.ts');
const navigationSystem = read('src/simulation/exploration/NavigationSystem.ts');
const regionSystem = read('src/simulation/exploration/RegionSystem.ts');
const questSystem = read('src/simulation/quest/QuestSystem.ts');
const simulationClock = read('src/simulation/runtime/SimulationClock.ts');
const scheduleSystem = read('src/simulation/agent/ScheduleSystem.ts');

requireText(explorationSave.includes("../simulation/state/SimulationPersistence"), 'explorationSave.ts must delegate persistence');
requireText(!explorationSave.includes('cle.exploration.verticalSlice.v1'), 'explorationSave.ts must not own legacy localStorage');
requireText(persistence.includes('cle.exploration.verticalSlice.v1'), 'SimulationPersistence must retain one-time legacy migration');
requireText(stateAdapter.includes('simulationV1'), 'LegacyGameStateAdapter must own GameState.simulationV1 bridge');
requireText(simulationRuntime.includes('CommandBus') && simulationRuntime.includes('registerCoreCommandHandlers'), 'SimulationRuntime must own validated command handling');
requireText(coreCommands.includes("command.source === 'agent'"), 'core commands must block agent quest completion');
requireText(coreCommands.includes("type: 'region.entered'"), 'core commands must emit region entry events');
requireText(coreCommands.includes("type: 'quest.completed'"), 'core commands must emit quest completion events');

requireText(legacyMain.includes("./simulation/exploration/ExplorationRuntime"), 'legacy chapter entry must depend only on ExplorationRuntime');
requireText(!/LegacyFreeRoam\w+Adapter/.test(legacyMain), 'legacy chapter entry must not know migration adapters');
requireText(explorationRuntime.includes("from './ExplorationHost'"), 'ExplorationRuntime must compose the direct ExplorationHost');
requireText(!explorationRuntime.includes('FreeRoamPrototype'), 'ExplorationRuntime must not depend on FreeRoamPrototype');
requireText(!explorationRuntime.includes('LegacyFreeRoam'), 'ExplorationRuntime must not depend on migration adapters');

for (const dependency of [
  'ExplorationInputController',
  'ExplorationLoop',
  'planNpcFrame',
  'ExplorationActorViewFactory',
  'ExplorationWorldPresentation',
  'ExplorationHudPresentation',
  'ExplorationDialoguePresentation',
  'ExplorationObjectivePresentation',
  'moveActorByDelta',
  'findNearestInteractionActor',
  'computeCameraOffset',
  'saveRegionExplorationSnapshot',
]) requireText(explorationHost.includes(dependency), `ExplorationHost must compose ${dependency}`);

requireText(explorationHost.includes('implements ExplorationLoopPort'), 'ExplorationHost must implement the deterministic loop port');
requireText(!/window\.GameState/.test(explorationHost), 'ExplorationHost must not mutate window.GameState directly');
requireText(inputController.includes('movementInput'), 'InputController must own movement key interpretation');
requireText(explorationLoop.includes('class ExplorationLoop') && explorationLoop.includes('port.updateNpcs') && explorationLoop.includes('port.persistState'), 'ExplorationLoop must own frame ordering/autosave');
requireText(npcController.includes('planNpcFrame') && npcController.includes('resolveScheduleEntry') && npcController.includes('findNavigationPath'), 'NpcController must compose schedule/navigation planning');

requireText(actorViewFactory.includes('createPlayer') && actorViewFactory.includes('createNpc'), 'ActorViewFactory must own player/NPC Pixi construction');
requireText(worldPresentation.includes('buildEnvironment'), 'WorldPresentation must own map background/debug construction');
requireText(dialoguePresentation.includes('class ExplorationDialoguePresentation'), 'DialoguePresentation must own dialogue state/panel');
requireText(hudPresentation.includes('class ExplorationHudPresentation'), 'HudPresentation must own HUD Pixi objects');
requireText(objectivePresentation.includes('class ExplorationObjectivePresentation'), 'ObjectivePresentation must own marker/highlight');

requireText(legacyPathfinding.includes('../simulation/exploration/NavigationSystem') && !legacyPathfinding.includes('const queue: string[]'), 'legacy pathfinding must delegate graph traversal');
requireText(legacyQuestState.includes('../simulation/quest/QuestSystem') && !legacyQuestState.includes('completedQuestIds.includes'), 'legacy quest state must delegate transitions');
requireText(legacySchedule.includes('../simulation/runtime/SimulationClock') && legacySchedule.includes('../simulation/agent/ScheduleSystem'), 'legacy schedule must delegate clock/schedule rules');
requireText(legacyRegionRegistry.includes('../simulation/exploration/RegionSystem'), 'legacy region registry must delegate indexing');
requireText(legacyActorMotion.includes('../simulation/exploration/ActorMotionSystem'), 'legacy actor motion must delegate motion math');

requireText(collisionSystem.includes('moveCircleWithAxisCollision'), 'CollisionSystem must own collision');
requireText(movementSystem.includes('moveActorByDelta'), 'MovementSystem must own deterministic movement');
requireText(interactionSystem.includes('findNearestInteractionActor') && interactionSystem.includes('evaluateQuestInteractionGate'), 'InteractionSystem must own proximity/gating');
requireText(explorationRenderer.includes('computeCameraOffset') && explorationRenderer.includes('computeHudLayout'), 'ExplorationRenderer must own camera/HUD layout math');
requireText(actorMotionSystem.includes('stepActorMotion'), 'ActorMotionSystem must own motion math');
requireText(navigationSystem.includes('findNavigationPath'), 'NavigationSystem must own navigation');
requireText(regionSystem.includes('createRegionRegistry'), 'RegionSystem must own region indexing');
requireText(questSystem.includes('canCompleteQuest'), 'QuestSystem must own quest validation');
requireText(simulationClock.includes('advanceSimulationClock'), 'SimulationClock must own game time');
requireText(scheduleSystem.includes('resolveScheduleEntry'), 'ScheduleSystem must own schedule selection');

if (failures.length) {
  console.error('Simulation architecture guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Simulation architecture guard passed.');
