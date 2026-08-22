export interface ActorMotionState {
  phase: number;
  facingX: -1 | 1;
}

export interface ActorMotionInput {
  dx: number;
  dy: number;
  deltaSeconds: number;
  isMoving: boolean;
}

export interface ActorMotionPose {
  offsetY: number;
  rotation: number;
  scaleXFactor: number;
  scaleYFactor: number;
}

const WALK_CYCLES_PER_SECOND = 2.7;

export function createActorMotionState(): ActorMotionState {
  return { phase: 0, facingX: 1 };
}

export function stepActorMotion(
  state: ActorMotionState,
  input: ActorMotionInput,
): ActorMotionPose {
  if (Math.abs(input.dx) > 0.001) {
    state.facingX = input.dx < 0 ? -1 : 1;
  }

  if (!input.isMoving) {
    state.phase = 0;
    return {
      offsetY: 0,
      rotation: 0,
      scaleXFactor: state.facingX,
      scaleYFactor: 1,
    };
  }

  state.phase += Math.max(0, input.deltaSeconds) * Math.PI * 2 * WALK_CYCLES_PER_SECOND;
  const stride = Math.sin(state.phase);
  const bounce = Math.abs(stride);
  const leanDirection = Math.abs(input.dx) > Math.abs(input.dy) ? Math.sign(input.dx) : 0;

  return {
    offsetY: -bounce * 5,
    rotation: stride * 0.018 + leanDirection * 0.012,
    scaleXFactor: state.facingX * (1 + bounce * 0.012),
    scaleYFactor: 1 - bounce * 0.018,
  };
}
