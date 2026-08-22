import { clampSpatialValue } from './CollisionSystem';
import type { SpatialPoint } from './SpatialTypes';

export interface ScreenSize {
  width: number;
  height: number;
}

export interface CameraLayoutInput {
  screen: ScreenSize;
  region: ScreenSize;
  focus: SpatialPoint;
}

export interface HudLayout {
  clockPanel: SpatialPoint;
  clockText: SpatialPoint;
  controls: SpatialPoint;
  prompt: SpatialPoint;
  dialogue: SpatialPoint;
}

export interface DialogueLayoutSize {
  width: number;
  height: number;
}

export function computeCameraOffset(input: CameraLayoutInput): SpatialPoint {
  const targetX = input.screen.width / 2 - input.focus.x;
  const targetY = input.screen.height / 2 - input.focus.y;
  const minX = Math.min(0, input.screen.width - input.region.width);
  const minY = Math.min(0, input.screen.height - input.region.height);

  return {
    x: clampSpatialValue(targetX, minX, 0),
    y: clampSpatialValue(targetY, minY, 0),
  };
}

export function computeHudLayout(
  screen: ScreenSize,
  dialogue: DialogueLayoutSize,
): HudLayout {
  return {
    clockPanel: { x: screen.width - 208, y: 16 },
    clockText: { x: screen.width - 113, y: 37 },
    controls: { x: screen.width / 2, y: screen.height - 22 },
    prompt: { x: screen.width / 2, y: screen.height - 54 },
    dialogue: {
      x: Math.max(16, (screen.width - dialogue.width) / 2),
      y: Math.max(180, screen.height - dialogue.height - 64),
    },
  };
}

export function depthFromWorldY(worldY: number, offset = 100): number {
  return worldY + offset;
}
