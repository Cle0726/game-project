import type { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition, Vec2 } from '../../exploration/explorationTypes';
import { moveActorByDelta } from './MovementSystem';

const PLAYER_RADIUS = 24;
const NPC_RADIUS = 24;

interface LegacyDisplayNode {
  position: {
    set(x: number, y: number): void;
  };
  zIndex: number;
}

interface LegacyNpcRuntimeShape {
  position: Vec2;
  node: LegacyDisplayNode;
}

interface LegacyFreeRoamMovementShape {
  playerPosition: Vec2;
  player: LegacyDisplayNode;
  tryMovePlayer(dx: number, dy: number): Vec2;
  tryMoveNpc(npc: LegacyNpcRuntimeShape, dx: number, dy: number): Vec2;
}

function applyMovement(
  position: Vec2,
  delta: Vec2,
  radius: number,
  region: ExplorationRegionDefinition,
): { position: Vec2; movement: Vec2 } {
  return moveActorByDelta(position, delta, {
    radius,
    bounds: { width: region.width, height: region.height },
    collisionZones: region.collisionZones,
  });
}

/**
 * Transitional Phase-A bridge.
 *
 * FreeRoamPrototype predates SimulationRuntime and still owns its Pixi containers.
 * This adapter replaces only its legacy movement methods at the instance boundary,
 * so the live game uses MovementSystem/CollisionSystem without duplicating renderer
 * or chapter logic. Remove this file when FreeRoamPrototype is retired.
 */
export function wireLegacyFreeRoamMovement(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamMovementShape;

  legacy.tryMovePlayer = (dx, dy) => {
    const result = applyMovement(
      legacy.playerPosition,
      { x: dx, y: dy },
      PLAYER_RADIUS,
      region,
    );

    legacy.playerPosition.x = result.position.x;
    legacy.playerPosition.y = result.position.y;
    legacy.player.position.set(result.position.x, result.position.y);
    legacy.player.zIndex = result.position.y + 100;
    return result.movement;
  };

  legacy.tryMoveNpc = (npc, dx, dy) => {
    const result = applyMovement(
      npc.position,
      { x: dx, y: dy },
      NPC_RADIUS,
      region,
    );

    npc.position.x = result.position.x;
    npc.position.y = result.position.y;
    npc.node.position.set(result.position.x, result.position.y);
    npc.node.zIndex = result.position.y + 100;
    return result.movement;
  };
}
