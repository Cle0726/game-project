import type { Sprite, Text } from 'pixi.js';
import type { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition, Vec2 } from '../../exploration/explorationTypes';
import {
  updateActorMotion,
  type ActorMotionState,
} from '../../exploration/actorMotion';
import { ExplorationInputController } from './ExplorationInputController';
import { ExplorationLoop, type ExplorationLoopPort } from './ExplorationLoop';
import type { SpatialPoint } from './SpatialTypes';

interface LegacyFreeRoamLoopShape {
  clockMinute: number;
  playerSprite?: Sprite;
  playerSpriteBaseScale: number;
  playerMotion: ActorMotionState;
  clockText: Text;
  update(deltaSeconds: number): void;
  updateNpcs(deltaSeconds: number): void;
  tryMovePlayer(dx: number, dy: number): Vec2;
  updateNearbyInteraction(): void;
  updateCamera(): void;
  updateHudPositions(): void;
  updatePrompt(): void;
  updateObjectivePresentation(deltaSeconds: number): void;
  persistState(): void;
  isDialogueActive(): boolean;
}

/** Transitional bridge that moves per-frame ordering out of FreeRoamPrototype. */
export function wireLegacyFreeRoamLoop(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
  input: ExplorationInputController,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamLoopShape;
  const loop = new ExplorationLoop(input);

  const port: ExplorationLoopPort = {
    isPaused: () => legacy.isDialogueActive(),
    getClockMinute: () => legacy.clockMinute,
    setClockMinute: (minute) => {
      legacy.clockMinute = minute;
    },
    updateNpcs: (deltaSeconds) => legacy.updateNpcs(deltaSeconds),
    movePlayer: (delta: SpatialPoint) => legacy.tryMovePlayer(delta.x, delta.y),
    updatePlayerMotion: (movement, deltaSeconds) => {
      updateActorMotion(legacy.playerSprite, legacy.playerMotion, {
        dx: movement.x,
        dy: movement.y,
        deltaSeconds,
        isMoving: Math.hypot(movement.x, movement.y) > 0.01,
        baseScale: legacy.playerSpriteBaseScale,
      });
    },
    updateNearbyInteraction: () => legacy.updateNearbyInteraction(),
    updateCamera: () => legacy.updateCamera(),
    updateHudPositions: () => legacy.updateHudPositions(),
    updatePrompt: () => legacy.updatePrompt(),
    updateObjectivePresentation: (deltaSeconds) =>
      legacy.updateObjectivePresentation(deltaSeconds),
    updateClockLabel: (label) => {
      legacy.clockText.text = `${label} · ${region.name}`;
    },
    persistState: () => legacy.persistState(),
  };

  legacy.update = (deltaSeconds: number) => {
    loop.tick(deltaSeconds, port);
  };
}
