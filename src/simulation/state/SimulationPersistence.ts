import {
  getOrCreateSimulationStateV1,
  mutateSimulationStateV1,
} from './LegacyGameStateAdapter';
import type {
  RegionRuntimeStateV1,
  SimulationFacing,
  SimulationVec2,
} from './SimulationState';

const LEGACY_EXPLORATION_STORAGE_KEY = 'cle.exploration.verticalSlice.v1';

export interface RegionExplorationSnapshotV1 {
  regionId: string;
  playerPosition: SimulationVec2;
  clockMinute: number;
  activeQuestId?: string;
  completedQuestIds: string[];
  npcPositions: Record<string, SimulationVec2>;
}

interface LegacyExplorationSnapshot extends RegionExplorationSnapshotV1 {
  version?: number;
}

function clonePositions(
  positions: Record<string, SimulationVec2> | undefined,
): Record<string, SimulationVec2> {
  return Object.fromEntries(
    Object.entries(positions ?? {}).map(([id, position]) => [id, { ...position }]),
  );
}

function toSnapshot(
  regionId: string,
  region: RegionRuntimeStateV1,
): RegionExplorationSnapshotV1 | undefined {
  if (!region.playerPosition) return undefined;
  const state = getOrCreateSimulationStateV1();
  return {
    regionId,
    playerPosition: { ...region.playerPosition },
    clockMinute: state.clock.minuteOfDay,
    activeQuestId: region.activeQuestId,
    completedQuestIds: [...region.completedQuestIds],
    npcPositions: clonePositions(region.npcPositions),
  };
}

function readLegacySnapshot(regionId: string): LegacyExplorationSnapshot | undefined {
  try {
    const raw = window.localStorage.getItem(LEGACY_EXPLORATION_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<LegacyExplorationSnapshot>;
    if (parsed.version !== 1 || parsed.regionId !== regionId) return undefined;
    if (!parsed.playerPosition || typeof parsed.clockMinute !== 'number') return undefined;

    return {
      version: 1,
      regionId,
      playerPosition: { ...parsed.playerPosition },
      clockMinute: parsed.clockMinute,
      activeQuestId: parsed.activeQuestId,
      completedQuestIds: Array.isArray(parsed.completedQuestIds)
        ? parsed.completedQuestIds.filter((item): item is string => typeof item === 'string')
        : [],
      npcPositions: clonePositions(parsed.npcPositions),
    };
  } catch {
    return undefined;
  }
}

function migrateLegacySnapshot(regionId: string): RegionExplorationSnapshotV1 | undefined {
  const legacy = readLegacySnapshot(regionId);
  if (!legacy) return undefined;
  saveRegionExplorationSnapshot(legacy);
  try {
    window.localStorage.removeItem(LEGACY_EXPLORATION_STORAGE_KEY);
  } catch {
    // The canonical copy already lives in GameState.simulationV1.
  }
  return legacy;
}

export function loadRegionExplorationSnapshot(
  regionId: string,
): RegionExplorationSnapshotV1 | undefined {
  const state = getOrCreateSimulationStateV1();
  const region = state.regions[regionId];
  if (region) return toSnapshot(regionId, region);
  return migrateLegacySnapshot(regionId);
}

export function saveRegionExplorationSnapshot(
  snapshot: RegionExplorationSnapshotV1,
): void {
  mutateSimulationStateV1((state) => {
    state.currentRegionId = snapshot.regionId;
    state.clock.minuteOfDay = snapshot.clockMinute;
    state.regions[snapshot.regionId] = {
      playerPosition: { ...snapshot.playerPosition },
      activeQuestId: snapshot.activeQuestId,
      completedQuestIds: [...snapshot.completedQuestIds],
      npcPositions: clonePositions(snapshot.npcPositions),
      lastVisitedGameTime: state.clock.day * 1440 + snapshot.clockMinute,
    };
  });
}

export function setSimulationReturnPoint(
  regionId: string,
  position: SimulationVec2,
  facing: SimulationFacing = 'down',
): void {
  mutateSimulationStateV1((state) => {
    state.returnPoint = { regionId, ...position, facing };
  });
}
