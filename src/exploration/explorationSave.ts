import {
  loadRegionExplorationSnapshot,
  saveRegionExplorationSnapshot,
} from '../simulation/state/SimulationPersistence';
import { getSimulationRuntime } from '../simulation/runtime/SimulationRuntime';

export interface ExplorationSaveState {
  version: 1;
  regionId: string;
  playerPosition: { x: number; y: number };
  clockMinute: number;
  activeQuestId?: string;
  completedQuestIds: string[];
  /** Optional for compatibility with callers that predate one-shot interaction state. */
  consumedInteractionZoneIds?: string[];
  npcPositions: Record<string, { x: number; y: number }>;
}

export function loadExplorationSave(regionId: string): ExplorationSaveState | undefined {
  const snapshot = loadRegionExplorationSnapshot(regionId);
  if (!snapshot) return undefined;
  return {
    version: 1,
    ...snapshot,
  };
}

export function saveExplorationState(state: ExplorationSaveState): void {
  const newlyCompletedQuestIds = saveRegionExplorationSnapshot({
    regionId: state.regionId,
    playerPosition: { ...state.playerPosition },
    clockMinute: state.clockMinute,
    activeQuestId: state.activeQuestId,
    completedQuestIds: [...state.completedQuestIds],
    consumedInteractionZoneIds: [...(state.consumedInteractionZoneIds ?? [])],
    npcPositions: Object.fromEntries(
      Object.entries(state.npcPositions).map(([id, position]) => [id, { ...position }]),
    ),
  });
  if (!newlyCompletedQuestIds.length) return;

  const runtime = getSimulationRuntime();
  const simulationState = runtime.start();
  const issuedAt =
    Math.max(0, simulationState.clock.day - 1) * 1440 + simulationState.clock.minuteOfDay;

  for (const questId of newlyCompletedQuestIds) {
    runtime.commands.dispatch({
      type: 'quest.complete',
      source: 'player',
      actorId: 'player',
      issuedAt,
      payload: { questId },
    });
  }
}
