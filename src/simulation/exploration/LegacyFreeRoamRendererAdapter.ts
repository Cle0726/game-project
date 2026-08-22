import type { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition, Vec2 } from '../../exploration/explorationTypes';
import { computeCameraOffset, computeHudLayout } from './ExplorationRenderer';

const DIALOGUE_PANEL_WIDTH = 760;
const DIALOGUE_PANEL_HEIGHT = 128;

interface PositionLike {
  set(x: number, y: number): void;
}

interface DisplayLike {
  position: PositionLike;
}

interface WorldLike {
  x: number;
  y: number;
}

interface StageScreenLike {
  screen: {
    width: number;
    height: number;
  };
}

interface LegacyFreeRoamRendererShape {
  app: StageScreenLike;
  world: WorldLike;
  playerPosition: Vec2;
  clockPanel?: DisplayLike;
  clockText: DisplayLike;
  controlsText?: DisplayLike;
  prompt: DisplayLike;
  dialoguePanel?: DisplayLike;
  updateCamera(): void;
  updateHudPositions(): void;
}

/** Transitional renderer-layout bridge for the Phase-A extraction. */
export function wireLegacyFreeRoamRenderer(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamRendererShape;

  legacy.updateCamera = () => {
    const camera = computeCameraOffset({
      screen: legacy.app.screen,
      region: { width: region.width, height: region.height },
      focus: legacy.playerPosition,
    });
    legacy.world.x = camera.x;
    legacy.world.y = camera.y;
  };

  legacy.updateHudPositions = () => {
    const layout = computeHudLayout(legacy.app.screen, {
      width: DIALOGUE_PANEL_WIDTH,
      height: DIALOGUE_PANEL_HEIGHT,
    });

    legacy.clockPanel?.position.set(layout.clockPanel.x, layout.clockPanel.y);
    legacy.clockText.position.set(layout.clockText.x, layout.clockText.y);
    legacy.controlsText?.position.set(layout.controls.x, layout.controls.y);
    legacy.prompt.position.set(layout.prompt.x, layout.prompt.y);
    legacy.dialoguePanel?.position.set(layout.dialogue.x, layout.dialogue.y);
  };
}
