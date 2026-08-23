import type { WorldEvent } from '../events/WorldEvent';

export const SIMULATION_STATE_VERSION = 1 as const;

export interface SimulationVec2 {
  x: number;
  y: number;
}

export type SimulationFacing = 'up' | 'down' | 'left' | 'right';

export interface SimulationClockStateV1 {
  day: number;
  minuteOfDay: number;
  seed: number;
}

export interface SimulationReturnPointV1 extends SimulationVec2 {
  regionId: string;
  facing: SimulationFacing;
}

export interface RegionRuntimeStateV1 {
  playerPosition?: SimulationVec2;
  npcPositions: Record<string, SimulationVec2>;
  activeQuestId?: string;
  completedQuestIds: string[];
  /** One-shot physical interactions already consumed in this region. */
  consumedInteractionZoneIds?: string[];
  lastVisitedGameTime?: number;
}

export interface QuestRuntimeStateV1 {
  acceptedQuestIds: string[];
  completedQuestIds: string[];
  failedQuestIds: string[];
}

export interface AgentRuntimeStateV1 {
  regionId?: string;
  position?: SimulationVec2;
  activity?: string;
  currentGoalId?: string;
  currentIntentId?: string;
  metadata?: Record<string, unknown>;
}

export interface SimulationStateV1 {
  version: typeof SIMULATION_STATE_VERSION;
  clock: SimulationClockStateV1;
  currentRegionId?: string;
  returnPoint?: SimulationReturnPointV1;
  regions: Record<string, RegionRuntimeStateV1>;
  quests: QuestRuntimeStateV1;
  agents: Record<string, AgentRuntimeStateV1>;
  eventCursor: number;
  eventLedger: WorldEvent[];
}

function createSeed(): number {
  return (Date.now() >>> 0) || 1;
}

export function createSimulationStateV1(seed = createSeed()): SimulationStateV1 {
  return {
    version: SIMULATION_STATE_VERSION,
    clock: {
      day: 1,
      minuteOfDay: 8 * 60,
      seed,
    },
    regions: {},
    quests: {
      acceptedQuestIds: [],
      completedQuestIds: [],
      failedQuestIds: [],
    },
    agents: {},
    eventCursor: 0,
    eventLedger: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeSimulationStateV1(value: unknown): SimulationStateV1 | undefined {
  if (!isRecord(value) || value.version !== SIMULATION_STATE_VERSION) return undefined;

  const fallback = createSimulationStateV1();
  const clock = isRecord(value.clock) ? value.clock : {};
  const quests = isRecord(value.quests) ? value.quests : {};

  return {
    version: SIMULATION_STATE_VERSION,
    clock: {
      day: typeof clock.day === 'number' ? clock.day : fallback.clock.day,
      minuteOfDay:
        typeof clock.minuteOfDay === 'number'
          ? clock.minuteOfDay
          : fallback.clock.minuteOfDay,
      seed: typeof clock.seed === 'number' ? clock.seed : fallback.clock.seed,
    },
    currentRegionId:
      typeof value.currentRegionId === 'string' ? value.currentRegionId : undefined,
    returnPoint: isRecord(value.returnPoint)
      ? {
          regionId:
            typeof value.returnPoint.regionId === 'string'
              ? value.returnPoint.regionId
              : '',
          x: typeof value.returnPoint.x === 'number' ? value.returnPoint.x : 0,
          y: typeof value.returnPoint.y === 'number' ? value.returnPoint.y : 0,
          facing:
            value.returnPoint.facing === 'up' ||
            value.returnPoint.facing === 'down' ||
            value.returnPoint.facing === 'left' ||
            value.returnPoint.facing === 'right'
              ? value.returnPoint.facing
              : 'down',
        }
      : undefined,
    regions: isRecord(value.regions)
      ? (value.regions as Record<string, RegionRuntimeStateV1>)
      : {},
    quests: {
      acceptedQuestIds: Array.isArray(quests.acceptedQuestIds)
        ? quests.acceptedQuestIds.filter((item): item is string => typeof item === 'string')
        : [],
      completedQuestIds: Array.isArray(quests.completedQuestIds)
        ? quests.completedQuestIds.filter((item): item is string => typeof item === 'string')
        : [],
      failedQuestIds: Array.isArray(quests.failedQuestIds)
        ? quests.failedQuestIds.filter((item): item is string => typeof item === 'string')
        : [],
    },
    agents: isRecord(value.agents)
      ? (value.agents as Record<string, AgentRuntimeStateV1>)
      : {},
    eventCursor: typeof value.eventCursor === 'number' ? value.eventCursor : 0,
    eventLedger: Array.isArray(value.eventLedger)
      ? (value.eventLedger as WorldEvent[])
      : [],
  };
}
