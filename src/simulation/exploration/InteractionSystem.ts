import type { SpatialPoint } from './SpatialTypes';

export interface InteractionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositionedInteractionActor {
  position: SpatialPoint;
}

export interface ZonedInteractionTarget {
  area: InteractionRect;
}

export interface QuestInteractionGateInput {
  requiredQuestId?: string;
  activeQuestId?: string;
  completedQuestIds: readonly string[];
}

export interface QuestInteractionGateResult {
  allowed: boolean;
  reason?: 'quest_not_active';
}

export function distanceBetween(a: SpatialPoint, b: SpatialPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function findNearestInteractionActor<T extends PositionedInteractionActor>(
  actors: readonly T[],
  origin: SpatialPoint,
  maxDistance: number,
): T | undefined {
  let nearest: T | undefined;
  let nearestDistance = Math.max(0, maxDistance);

  for (const actor of actors) {
    const distance = distanceBetween(actor.position, origin);
    if (distance < nearestDistance) {
      nearest = actor;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function pointInsideInteractionRect(
  position: SpatialPoint,
  area: InteractionRect,
): boolean {
  return (
    position.x >= area.x &&
    position.x <= area.x + area.width &&
    position.y >= area.y &&
    position.y <= area.y + area.height
  );
}

export function findContainingInteractionZone<T extends ZonedInteractionTarget>(
  zones: readonly T[] | undefined,
  position: SpatialPoint,
): T | undefined {
  return zones?.find((zone) => pointInsideInteractionRect(position, zone.area));
}

export function evaluateQuestInteractionGate(
  input: QuestInteractionGateInput,
): QuestInteractionGateResult {
  const required = input.requiredQuestId;
  if (!required) return { allowed: true };
  if (input.completedQuestIds.includes(required)) return { allowed: true };
  if (input.activeQuestId === required) return { allowed: true };
  return { allowed: false, reason: 'quest_not_active' };
}
