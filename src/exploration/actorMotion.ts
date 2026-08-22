import type { Sprite } from 'pixi.js';

export interface ActorMotionState {
  phase: number;
  facingX: -1 | 1;
}

export interface ActorMotionInput {
  dx: number;
  dy: number;
  deltaSeconds: number;
  isMoving: boolean;
  baseScale: number;
}

const WALK_CYCLES_PER_SECOND = 2.7;

export function createActorMotionState(): ActorMotionState {
  return { phase: 0, facingX: 1 };
}

export function updateActorMotion(
  sprite: Sprite | undefined,
  state: ActorMotionState,
  input: ActorMotionInput,
): void {
  if (!sprite) return;

  if (Math.abs(input.dx) > 0.001) {
    state.facingX = input.dx < 0 ? -1 : 1;
  }

  if (!input.isMoving) {
    state.phase = 0;
    sprite.y += (0 - sprite.y) * Math.min(1, input.deltaSeconds * 12);
    sprite.rotation += (0 - sprite.rotation) * Math.min(1, input.deltaSeconds * 12);
    sprite.scale.set(input.baseScale * state.facingX, input.baseScale);
    return;
  }

  state.phase += input.deltaSeconds * Math.PI * 2 * WALK_CYCLES_PER_SECOND;
  const stride = Math.sin(state.phase);
  const bounce = Math.abs(Math.sin(state.phase));
  const leanDirection = Math.abs(input.dx) > Math.abs(input.dy) ? Math.sign(input.dx) : 0;

  sprite.y = -bounce * 5;
  sprite.rotation = stride * 0.018 + leanDirection * 0.012;
  sprite.scale.set(
    input.baseScale * state.facingX * (1 + bounce * 0.012),
    input.baseScale * (1 - bounce * 0.018),
  );
}
