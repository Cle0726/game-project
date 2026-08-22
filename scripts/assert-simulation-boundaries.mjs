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
const explorationRuntime = read('src/simulation/exploration/ExplorationRuntime.ts');
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
const actorViewAdapter = read('src/simulation/exploration/LegacyFreeRoamActorViewAdapter.ts');
const worldViewAdapter = read('src/simulation/exploration/LegacyFreeRoamWorldViewAdapter.ts');
const inputAdapter = read('src/simulation/exploration/LegacyFreeRoamInputAdapter.ts');
const loopAdapter = read('src/simulation/exploration/LegacyFreeRoamLoopAdapter.ts');
const npcAdapter = read('src/simulation/exploration/LegacyFreeRoamNpcAdapter.ts');
const movementAdapter = read('src/simulation/exploration/LegacyFreeRoamMovementAdapter.ts');
const interactionAdapter = read('src/simulation/exploration/LegacyFreeRoamInteractionAdapter.ts');
const presentationAdapter = read('src/simulation/exploration/LegacyFreeRoamPresentationAdapter.ts');
const rendererAdapter = read('src/simulation/exploration/LegacyFreeRoamRendererAdapter.ts');
const actorMotionSystem = read('src/simulation/exploration/ActorMotionSystem.ts');
const navigationSystem = read('src/simulation/exploration/NavigationSystem.ts');
const regionSystem = read('src/simulation/exploration/RegionSystem.ts');
const questSystem = read('src/simulation/quest/QuestSystem.ts');
const simulationClock = read('src/simulation/runtime/SimulationClock.ts');
const scheduleSystem = read('src/simulation/agent/ScheduleSystem.ts');

const failures = [];
const requireText = (condition, message) => { if (!condition) failures.push(message); };

requireText(explorationSave.includes("../simulation/state/SimulationPersistence"), 'explorationSave.ts must delegate to SimulationPersistence');
requireText(!explorationSave.includes('cle.exploration.verticalSlice.v1'), 'explorationSave.ts must not own the legacy localStorage key');
requireText(persistence.includes('cle.exploration.verticalSlice.v1'), 'SimulationPersistence.ts must retain one-time legacy migration support');
requireText(adapter.includes('simulationV1'), 'LegacyGameStateAdapter.ts must own the GameState.simulationV1 bridge');
requireText(runtime.includes('CommandBus') && runtime.includes('registerCoreCommandHandlers'), 'SimulationRuntime.ts must own validated core command handling');
requireText(coreCommands.includes("command.source === 'agent'"), 'CoreCommandHandlers.ts must block agent quest completion');
requireText(coreCommands.includes("type: 'region.entered'"), 'CoreCommandHandlers.ts must emit region entry events');
requireText(coreCommands.includes("type: 'quest.completed'"), 'CoreCommandHandlers.ts must emit quest completion events');
requireText(!/window\.GameState/.test(freeRoam), 'FreeRoamPrototype.ts must not directly mutate window.GameState');
requireText(legacyMain.includes("./simulation/exploration/ExplorationRuntime"), 'legacy entry must depend on ExplorationRuntime');
requireText(!/LegacyFreeRoam(?:ActorView|WorldView|Input|Loop|Npc|Movement|Interaction|Presentation|Renderer)Adapter/.test(legacyMain), 'legacy entry must not know individual migration adapters');

for (const name of [
  'wireLegacyFreeRoamActorViews',
  'wireLegacyFreeRoamWorldView',
  'wireLegacyFreeRoamInput',
  'wireLegacyFreeRoamLoop',
  'wireLegacyFreeRoamNpcs',
  'wireLegacyFreeRoamMovement',
  'wireLegacyFreeRoamInteraction',
  'wireLegacyFreeRoamPresentation',
  'wireLegacyFreeRoamRenderer',
]) requireText(explorationRuntime.includes(name), `ExplorationRuntime.ts must include ${name}`);

requireText(inputController.includes('movementInput'), 'ExplorationInputController.ts must own movement key interpretation');
requireText(explorationLoop.includes('class ExplorationLoop') && explorationLoop.includes('port.updateNpcs') && explorationLoop.includes('port.persistState'), 'ExplorationLoop.ts must own frame ordering and autosave timing');
requireText(npcController.includes('planNpcFrame'), 'ExplorationNpcController.ts must own NPC frame planning');
requireText(npcController.includes('resolveScheduleEntry') && npcController.includes('findNavigationPath') && npcController.includes('moveTowardPoint'), 'ExplorationNpcController.ts must compose schedule/navigation/movement rules');
requireText(inputAdapter.includes("from './ExplorationInputController'"), 'Input adapter must delegate to ExplorationInputController');
requireText(loopAdapter.includes("from './ExplorationLoop'"), 'Loop adapter must delegate to ExplorationLoop');
requireText(npcAdapter.includes("from './ExplorationNpcController'"), 'NPC adapter must delegate to ExplorationNpcController');
requireText(actorViewAdapter.includes("from './ExplorationActorViewFactory'"), 'Actor view adapter must delegate to ExplorationActorViewFactory');
requireText(worldViewAdapter.includes("from './ExplorationWorldPresentation'"), 'World view adapter must delegate to ExplorationWorldPresentation');
requireText(movementAdapter.includes("from './MovementSystem'"), 'Movement adapter must delegate to MovementSystem');
requireText(interactionAdapter.includes("from './InteractionSystem'"), 'Interaction adapter must delegate to InteractionSystem');
requireText(presentationAdapter.includes("from './ExplorationDialoguePresentation'") && presentationAdapter.includes("from './ExplorationHudPresentation'") && presentationAdapter.includes("from './ExplorationObjectivePresentation'"), 'Presentation adapter must delegate HUD/dialogue/objective presentation');
requireText(rendererAdapter.includes("from './ExplorationRenderer'"), 'Renderer adapter must delegate to ExplorationRenderer');

requireText(actorViewFactory.includes('createPlayer') && actorViewFactory.includes('createNpc'), 'ExplorationActorViewFactory.ts must own player/NPC Pixi construction');
requireText(worldPresentation.includes('buildEnvironment'), 'ExplorationWorldPresentation.ts must own world construction');
requireText(dialoguePresentation.includes('class ExplorationDialoguePresentation'), 'Dialogue presentation must own dialogue state/panel');
requireText(hudPresentation.includes('class ExplorationHudPresentation'), 'HUD presentation must own HUD Pixi objects');
requireText(objectivePresentation.includes('class ExplorationObjectivePresentation'), 'Objective presentation must own marker/highlight');

requireText(legacyPathfinding.includes('../simulation/exploration/NavigationSystem') && !legacyPathfinding.includes('const queue: string[]'), 'legacy pathfinding must delegate graph traversal');
requireText(legacyQuestState.includes('../simulation/quest/QuestSystem') && !legacyQuestState.includes('completedQuestIds.includes'), 'legacy questState must delegate quest transitions');
requireText(legacySchedule.includes('../simulation/runtime/SimulationClock') && legacySchedule.includes('../simulation/agent/ScheduleSystem'), 'legacy schedule must delegate clock/schedule logic');
requireText(legacyRegionRegistry.includes('../simulation/exploration/RegionSystem'), 'legacy region registry must delegate lookup');
requireText(legacyActorMotion.includes('../simulation/exploration/ActorMotionSystem'), 'legacy actor motion must delegate motion math');

requireText(collisionSystem.includes('moveCircleWithAxisCollision'), 'CollisionSystem.ts must own collision');
requireText(movementSystem.includes('moveActorByDelta'), 'MovementSystem.ts must own deterministic movement');
requireText(interactionSystem.includes('findNearestInteractionActor') && interactionSystem.includes('evaluateQuestInteractionGate'), 'InteractionSystem.ts must own proximity/gating');
requireText(explorationRenderer.includes('computeCameraOffset') && explorationRenderer.includes('computeHudLayout'), 'ExplorationRenderer.ts must own camera/HUD layout math');
requireText(actorMotionSystem.includes('stepActorMotion'), 'ActorMotionSystem.ts must own motion math');
requireText(navigationSystem.includes('findNavigationPath'), 'NavigationSystem.ts must own navigation');
requireText(regionSystem.includes('createRegionRegistry'), 'RegionSystem.ts must own region indexing');
requireText(questSystem.includes('canCompleteQuest'), 'QuestSystem.ts must own quest validation');
requireText(simulationClock.includes('advanceSimulationClock'), 'SimulationClock.ts must own game time');
requireText(scheduleSystem.includes('resolveScheduleEntry'), 'ScheduleSystem.ts must own schedule selection');

if (failures.length) {
  console.error('Simulation architecture guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Simulation architecture guard passed.');
