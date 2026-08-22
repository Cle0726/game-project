import type { CommandBus } from './CommandBus';
import type { GameCommand } from './GameCommand';
import { mutateSimulationStateV1, readSimulationStateV1 } from '../state/LegacyGameStateAdapter';
import type { RegionRuntimeStateV1, SimulationReturnPointV1 } from '../state/SimulationState';

interface RegionEnterPayload {
  regionId: string;
  playerPosition?: { x: number; y: number };
}

interface ReturnPointPayload extends SimulationReturnPointV1 {}

interface QuestCompletePayload {
  questId: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFinitePoint(value: unknown): value is { x: number; y: number } {
  return (
    isRecord(value) &&
    typeof value.x === 'number' &&
    Number.isFinite(value.x) &&
    typeof value.y === 'number' &&
    Number.isFinite(value.y)
  );
}

function getGameTime(): number {
  const clock = readSimulationStateV1()?.clock;
  if (!clock) return 0;
  return Math.max(0, clock.day - 1) * 24 * 60 + clock.minuteOfDay;
}

function getRegionState(regionId: string): RegionRuntimeStateV1 {
  const existing = readSimulationStateV1()?.regions[regionId];
  return existing ?? {
    npcPositions: {},
    completedQuestIds: [],
  };
}

function validateRegionEnter(command: GameCommand) {
  const payload = command.payload;
  if (!isRecord(payload) || typeof payload.regionId !== 'string' || !payload.regionId.trim()) {
    return { accepted: false, reason: 'region_enter_requires_region_id' };
  }
  if (payload.playerPosition !== undefined && !isFinitePoint(payload.playerPosition)) {
    return { accepted: false, reason: 'region_enter_invalid_player_position' };
  }
  return { accepted: true };
}

function validateReturnPoint(command: GameCommand) {
  const payload = command.payload;
  if (!isRecord(payload) || typeof payload.regionId !== 'string' || !payload.regionId.trim()) {
    return { accepted: false, reason: 'return_point_requires_region_id' };
  }
  if (!isFinitePoint(payload)) return { accepted: false, reason: 'return_point_invalid_position' };
  if (!['up', 'down', 'left', 'right'].includes(String(payload.facing))) {
    return { accepted: false, reason: 'return_point_invalid_facing' };
  }
  return { accepted: true };
}

function validateQuestComplete(command: GameCommand) {
  if (command.source === 'agent') {
    return { accepted: false, reason: 'agent_cannot_complete_quest' };
  }
  const payload = command.payload;
  if (!isRecord(payload) || typeof payload.questId !== 'string' || !payload.questId.trim()) {
    return { accepted: false, reason: 'quest_complete_requires_quest_id' };
  }
  const state = readSimulationStateV1();
  if (state?.quests.completedQuestIds.includes(payload.questId)) {
    return { accepted: false, reason: 'quest_already_completed' };
  }
  return { accepted: true };
}

export function registerCoreCommandHandlers(bus: CommandBus): () => void {
  const dispose: Array<() => void> = [];

  dispose.push(bus.validator.addGuard('region.enter', validateRegionEnter));
  dispose.push(
    bus.register('region.enter', (command) => {
      const payload = command.payload as RegionEnterPayload;
      const gameTime = getGameTime();
      mutateSimulationStateV1((state) => {
        const region = getRegionState(payload.regionId);
        state.currentRegionId = payload.regionId;
        state.regions[payload.regionId] = {
          ...region,
          playerPosition: payload.playerPosition
            ? { ...payload.playerPosition }
            : region.playerPosition,
          lastVisitedGameTime: gameTime,
        };
      });
      return {
        type: 'region.entered',
        source: command.source,
        gameTime,
        regionId: payload.regionId,
        actorIds: command.actorId ? [command.actorId] : [],
        targetIds: [],
        importance: 1,
        tags: ['region', 'exploration'],
        payload: { ...payload },
      };
    }),
  );

  dispose.push(bus.validator.addGuard('exploration.return_point.set', validateReturnPoint));
  dispose.push(
    bus.register('exploration.return_point.set', (command) => {
      const payload = command.payload as ReturnPointPayload;
      const gameTime = getGameTime();
      mutateSimulationStateV1((state) => {
        state.returnPoint = { ...payload };
      });
      return {
        type: 'exploration.return_point_set',
        source: command.source,
        gameTime,
        regionId: payload.regionId,
        actorIds: command.actorId ? [command.actorId] : [],
        targetIds: [],
        importance: 1,
        tags: ['exploration', 'story-bridge'],
        payload: { ...payload },
      };
    }),
  );

  dispose.push(bus.validator.addGuard('quest.complete', validateQuestComplete));
  dispose.push(
    bus.register('quest.complete', (command) => {
      const payload = command.payload as QuestCompletePayload;
      const gameTime = getGameTime();
      const regionId = readSimulationStateV1()?.currentRegionId;
      mutateSimulationStateV1((state) => {
        state.quests.completedQuestIds.push(payload.questId);
      });
      return {
        type: 'quest.completed',
        source: command.source,
        gameTime,
        regionId,
        actorIds: command.actorId ? [command.actorId] : [],
        targetIds: [payload.questId],
        importance: 3,
        tags: ['quest'],
        payload: { ...payload },
      };
    }),
  );

  return () => {
    for (const fn of dispose.reverse()) fn();
  };
}
