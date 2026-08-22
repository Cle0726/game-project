import { moveCircleWithAxisCollision } from './CollisionSystem';
import type { CollisionRect, RegionBounds, SpatialPoint } from './SpatialTypes';

export interface MovementInput {
  x: number;
  y: number;
}

export interface ActorMovementConfig {
  speed: number;
  radius: number;
  bounds: RegionBounds;
  collisionZones: readonly CollisionRect[];
}

export interface ActorMovementResult {
  position: SpatialPoint;
  movement: SpatialPoint;
  blockedX: boolean;
  blockedY: boolean;
}

export function normalizeMovementInput(input: MovementInput): SpatialPoint {
  const length = Math.hypot(input.x, input.y);
  if (length <= Number.EPSILON) return { x: 0, y: 0 };
  return { x: input.x / length, y: input.y / length };
}

export function movementDelta(
  input: MovementInput,
  speed: number,
  deltaSeconds: number,
): SpatialPoint {
  const direction = normalizeMovementInput(input);
  const distance = Math.max(0, speed) * Math.max(0, deltaSeconds);
  return {
    x: direction.x * distance,
    y: direction.y * distance,
  };
}

export function moveActor(
  position: SpatialPoint,
  input: MovementInput,
  deltaSeconds: number,
  config: ActorMovementConfig,
): ActorMovementResult {
  return moveCircleWithAxisCollision({
    position,
    delta: movementDelta(input, config.speed, deltaSeconds),
    radius: config.radius,
    bounds: config.bounds,
    collisionZones: config.collisionZones,
  });
}

export function moveActorByDelta(
  position: SpatialPoint,
  delta: SpatialPoint,
  config: Omit<ActorMovementConfig, 'speed'>,
): ActorMovementResult {
  return moveCircleWithAxisCollision({
    position,
    delta,
    radius: config.radius,
    bounds: config.bounds,
    collisionZones: config.collisionZones,
  });
}

export function moveTowardPoint(
  from: SpatialPoint,
  target: SpatialPoint,
  speed: number,
  deltaSeconds: number,
): SpatialPoint {
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= Number.EPSILON) return { x: 0, y: 0 };
  const step = Math.min(Math.max(0, speed) * Math.max(0, deltaSeconds), distance);
  return {
    x: (dx / distance) * step,
    y: (dy / distance) * step,
  };
}
