import type { Container, Sprite, Text } from 'pixi.js';
import type {
  FreeRoamPrototype,
  FreeRoamPrototypeOptions,
} from '../../exploration/FreeRoamPrototype';
import type {
  ExplorationNpcDefinition,
  ExplorationRegionDefinition,
  Vec2,
} from '../../exploration/explorationTypes';
import { loadExplorationSave } from '../../exploration/explorationSave';
import {
  createActorMotionState,
  type ActorMotionState,
} from './ActorMotionSystem';
import { ExplorationActorViewFactory } from './ExplorationActorViewFactory';
import { depthFromWorldY } from './ExplorationRenderer';

interface LegacyNpcRuntimeShape {
  definition: ExplorationNpcDefinition;
  node: Container;
  position: Vec2;
  activityText: Text;
  sprite?: Sprite;
  spriteBaseScale: number;
  motion: ActorMotionState;
  activeTargetWaypointId?: string;
  route: Vec2[];
}

interface LegacyFreeRoamActorViewShape {
  options: FreeRoamPrototypeOptions;
  world: Container;
  player: Container;
  playerPosition: Vec2;
  playerSprite?: Sprite;
  playerSpriteBaseScale: number;
  npcs: LegacyNpcRuntimeShape[];
  buildPlayer(): Promise<void>;
  buildNpcs(): Promise<void>;
  loadActorSprite(
    src: string | undefined,
    targetHeight: number,
  ): Promise<{ sprite: Sprite; baseScale: number } | undefined>;
}

/** Transitional bridge that moves Pixi actor construction out of FreeRoamPrototype. */
export function wireLegacyFreeRoamActorViews(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamActorViewShape;
  const factory = new ExplorationActorViewFactory();

  legacy.loadActorSprite = (src, targetHeight) => factory.loadActorSprite(src, targetHeight);

  legacy.buildPlayer = async () => {
    const src = legacy.options.playerSpriteSrc ?? region.assets?.playerSpriteSrc;
    const view = await factory.createPlayer(src);
    legacy.player = view.node;
    legacy.playerSprite = view.sprite;
    legacy.playerSpriteBaseScale = view.baseScale;
    legacy.player.position.set(legacy.playerPosition.x, legacy.playerPosition.y);
    legacy.player.zIndex = depthFromWorldY(legacy.playerPosition.y);
    legacy.world.addChild(legacy.player);
  };

  legacy.buildNpcs = async () => {
    const saved = loadExplorationSave(region.id);
    legacy.npcs.length = 0;

    for (const definition of region.npcs) {
      const view = await factory.createNpc(definition);
      const restoredPosition = saved?.npcPositions[definition.id];
      const position = restoredPosition ? { ...restoredPosition } : { ...definition.position };
      view.node.position.set(position.x, position.y);
      view.node.zIndex = depthFromWorldY(position.y);
      legacy.world.addChild(view.node);

      legacy.npcs.push({
        definition,
        node: view.node,
        position,
        activityText: view.activityText,
        sprite: view.sprite,
        spriteBaseScale: view.baseScale,
        motion: createActorMotionState(),
        route: [],
      });
    }
  };
}
