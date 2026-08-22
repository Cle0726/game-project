import {
  loadRegionExplorationSnapshot,
  saveRegionExplorationSnapshot,
} from '../simulation/state/SimulationPersistence';

export interface ExplorationSaveState {
  version: 1;
  regionId: string;
  playerPosition: { x: number; y: number };
  clockMinute: number;
  activeQuestId?: string;
  completedQuestIds: string[];
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
  saveRegionExplorationSnapshot(state);
}
