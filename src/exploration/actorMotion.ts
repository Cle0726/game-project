import type { Sprite } from 'pixi.js';
import {
  createActorMotionState as createSimulationActorMotionState,
  stepActorMotion,
  type ActorMotionState,
} from '../simulation/exploration/ActorMotionSystem';

export type { ActorMotionState } from '../simulation/exploration/ActorMotionSystem';

export interface ActorMotionInput {
  dx: number;
  dy: number;
  deltaSeconds: number;
  isMoving: boolean;
  baseScale: number;
}

export function createActorMotionState(): ActorMotionState {
  return createSimulationActorMotionState();
}

/**
 * Legacy Pixi adapter. Motion math lives in ActorMotionSystem; this file only
 * applies the calculated pose to the current Sprite implementation.
 */
export function updateActorMotion(
  sprite: Sprite | undefined,
  state: ActorMotionState,
  input: ActorMotionInput,
): void {
  if (!sprite) return;

  const pose = stepActorMotion(state, input);

  if (!input.isMoving) {
    const smoothing = Math.min(1, Math.max(0, input.deltaSeconds) * 12);
    sprite.y += (pose.offsetY - sprite.y) * smoothing;
    sprite.rotation += (pose.rotation - sprite.rotation) * smoothing;
  } else {
    sprite.y = pose.offsetY;
    sprite.rotation = pose.rotation;
  }

  sprite.scale.set(
    input.baseScale * pose.scaleXFactor,
    input.baseScale * pose.scaleYFactor,
  );
}
