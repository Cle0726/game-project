import { resolveScheduleEntry } from '../agent/ScheduleSystem';
import { moveTowardPoint } from './MovementSystem';
import { findNavigationPath } from './NavigationSystem';
import type { NavigationWaypoint, SpatialPoint } from './SpatialTypes';

export interface NpcScheduleEntry {
  minuteOfDay: number;
  targetWaypointId: string;
  activity: string;
}

export interface NpcDefinitionLike {
  id: string;
  speed?: number;
  schedule?: readonly NpcScheduleEntry[];
}

export interface NpcNavigationState {
  position: SpatialPoint;
  activeTargetWaypointId?: string;
  route: SpatialPoint[];
}

export interface NpcFrameContext {
  clockMinute: number;
  playerPosition: SpatialPoint;
  dialogueNpcId?: string;
  waypoints: readonly NavigationWaypoint[];
  deltaSeconds: number;
  conversationPauseDistance?: number;
}

export type NpcFramePlan =
  | { kind: 'idle'; activityText: string; facePlayer: boolean }
  | { kind: 'snap'; activityText: string; target: SpatialPoint }
  | { kind: 'move'; activityText: string; delta: SpatialPoint };

const DEFAULT_NPC_SPEED = 100;
const DEFAULT_CONVERSATION_PAUSE_DISTANCE = 105;

/** Calculates an NPC's deterministic action for one frame without touching Pixi. */
export function planNpcFrame(
  definition: NpcDefinitionLike,
  state: NpcNavigationState,
  context: NpcFrameContext,
): NpcFramePlan {
  const scheduleEntry = resolveScheduleEntry(definition.schedule, context.clockMinute);
  if (!scheduleEntry) {
    return { kind: 'idle', activityText: '自由行动', facePlayer: false };
  }

  const playerDistance = Math.hypot(
    state.position.x - context.playerPosition.x,
    state.position.y - context.playerPosition.y,
  );
  const talkingToNpc = context.dialogueNpcId === definition.id;
  const pauseDistance =
    context.conversationPauseDistance ?? DEFAULT_CONVERSATION_PAUSE_DISTANCE;

  if (talkingToNpc || playerDistance <= pauseDistance) {
    return {
      kind: 'idle',
      activityText: talkingToNpc
        ? `${scheduleEntry.activity} · 交谈中`
        : `${scheduleEntry.activity} · 可交谈`,
      facePlayer: true,
    };
  }

  if (state.activeTargetWaypointId !== scheduleEntry.targetWaypointId) {
    state.activeTargetWaypointId = scheduleEntry.targetWaypointId;
    state.route = findNavigationPath(
      context.waypoints,
      state.position,
      scheduleEntry.targetWaypointId,
    );
  }

  const nextPoint = state.route[0];
  if (!nextPoint) {
    return { kind: 'idle', activityText: scheduleEntry.activity, facePlayer: false };
  }

  const distance = Math.hypot(
    nextPoint.x - state.position.x,
    nextPoint.y - state.position.y,
  );
  if (distance < 2) {
    state.route.shift();
    return {
      kind: 'snap',
      activityText: scheduleEntry.activity,
      target: { ...nextPoint },
    };
  }

  return {
    kind: 'move',
    activityText: scheduleEntry.activity,
    delta: moveTowardPoint(
      state.position,
      nextPoint,
      definition.speed ?? DEFAULT_NPC_SPEED,
      context.deltaSeconds,
    ),
  };
}
