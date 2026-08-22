import type { Container, Sprite, Text } from 'pixi.js';
import type { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type {
  ExplorationNpcDefinition,
  ExplorationRegionDefinition,
  Vec2,
} from '../../exploration/explorationTypes';
import {
  updateActorMotion,
  type ActorMotionState,
} from '../../exploration/actorMotion';
import { depthFromWorldY } from './ExplorationRenderer';
import { planNpcFrame } from './ExplorationNpcController';

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

interface LegacyFreeRoamNpcShape {
  npcs: LegacyNpcRuntimeShape[];
  clockMinute: number;
  playerPosition: Vec2;
  dialogueNpcId?: string;
  updateNpcs(deltaSeconds: number): void;
  setNpcIdle(npc: LegacyNpcRuntimeShape, deltaSeconds: number): void;
  tryMoveNpc(npc: LegacyNpcRuntimeShape, dx: number, dy: number): Vec2;
}

/** Transitional bridge that moves NPC frame planning out of FreeRoamPrototype. */
export function wireLegacyFreeRoamNpcs(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamNpcShape;

  legacy.updateNpcs = (deltaSeconds: number) => {
    for (const npc of legacy.npcs) {
      const plan = planNpcFrame(npc.definition, npc, {
        clockMinute: legacy.clockMinute,
        playerPosition: legacy.playerPosition,
        dialogueNpcId: legacy.dialogueNpcId,
        waypoints: region.waypoints,
        deltaSeconds,
      });

      npc.activityText.text = plan.activityText;

      if (plan.kind === 'idle') {
        if (plan.facePlayer) {
          npc.motion.facingX = legacy.playerPosition.x < npc.position.x ? -1 : 1;
        }
        legacy.setNpcIdle(npc, deltaSeconds);
        continue;
      }

      if (plan.kind === 'snap') {
        npc.position.x = plan.target.x;
        npc.position.y = plan.target.y;
        npc.node.position.set(npc.position.x, npc.position.y);
        npc.node.zIndex = depthFromWorldY(npc.position.y);
        legacy.setNpcIdle(npc, deltaSeconds);
        continue;
      }

      const movement = legacy.tryMoveNpc(npc, plan.delta.x, plan.delta.y);
      updateActorMotion(npc.sprite, npc.motion, {
        dx: movement.x,
        dy: movement.y,
        deltaSeconds,
        isMoving: Math.hypot(movement.x, movement.y) > 0.01,
        baseScale: npc.spriteBaseScale,
      });
    }
  };
}
