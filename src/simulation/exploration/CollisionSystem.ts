import type { CollisionRect, RegionBounds, SpatialPoint } from './SpatialTypes';

export interface MoveWithCollisionInput {
  position: SpatialPoint;
  delta: SpatialPoint;
  radius: number;
  bounds: RegionBounds;
  collisionZones: readonly CollisionRect[];
}

export interface MoveWithCollisionResult {
  position: SpatialPoint;
  movement: SpatialPoint;
  blockedX: boolean;
  blockedY: boolean;
}

export function clampSpatialValue(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.max(min, Math.min(max, value));
}

export function circleIntersectsRect(
  center: SpatialPoint,
  radius: number,
  rect: CollisionRect,
): boolean {
  const closestX = clampSpatialValue(center.x, rect.x, rect.x + rect.width);
  const closestY = clampSpatialValue(center.y, rect.y, rect.y + rect.height);
  const dx = center.x - closestX;
  const dy = center.y - closestY;
  return dx * dx + dy * dy < radius * radius;
}

export function collidesWithAnyRect(
  center: SpatialPoint,
  radius: number,
  collisionZones: readonly CollisionRect[],
): boolean {
  return collisionZones.some((zone) => circleIntersectsRect(center, radius, zone));
}

export function moveCircleWithAxisCollision(
  input: MoveWithCollisionInput,
): MoveWithCollisionResult {
  const { position, delta, radius, bounds, collisionZones } = input;
  const next = { ...position };

  const nextX = clampSpatialValue(position.x + delta.x, radius, bounds.width - radius);
  const blockedX = collidesWithAnyRect({ x: nextX, y: next.y }, radius, collisionZones);
  if (!blockedX) next.x = nextX;

  const nextY = clampSpatialValue(position.y + delta.y, radius, bounds.height - radius);
  const blockedY = collidesWithAnyRect({ x: next.x, y: nextY }, radius, collisionZones);
  if (!blockedY) next.y = nextY;

  return {
    position: next,
    movement: {
      x: next.x - position.x,
      y: next.y - position.y,
    },
    blockedX,
    blockedY,
  };
}
