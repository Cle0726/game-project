import type { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type {
  ExplorationInteractionZone,
  ExplorationNpcDefinition,
  ExplorationQuestDefinition,
  ExplorationRegionDefinition,
  Vec2,
} from '../../exploration/explorationTypes';
import {
  evaluateQuestInteractionGate,
  findContainingInteractionZone,
  findNearestInteractionActor,
  pointInsideInteractionRect,
} from './InteractionSystem';

const INTERACTION_DISTANCE = 120;

interface LegacyNpcRuntimeShape {
  definition: ExplorationNpcDefinition;
  position: Vec2;
}

interface LegacyStatusText {
  text: string;
}

interface LegacyFreeRoamInteractionShape {
  playerPosition: Vec2;
  npcs: LegacyNpcRuntimeShape[];
  nearbyNpc?: LegacyNpcRuntimeShape;
  nearbyZone?: ExplorationInteractionZone;
  activeQuestId?: string;
  completedQuestIds: string[];
  status: LegacyStatusText;
  updateNearbyInteraction(): void;
  pointInsideZone(position: Vec2, zone: ExplorationInteractionZone): boolean;
  interactWithZone(zone: ExplorationInteractionZone): void;
  tryCompleteQuest(questId: string | undefined): boolean;
  openStory(sceneId: string): void;
}

function findQuest(
  quests: readonly ExplorationQuestDefinition[] | undefined,
  id: string | undefined,
): ExplorationQuestDefinition | undefined {
  if (!id) return undefined;
  return quests?.find((quest) => quest.id === id);
}

/** Transitional adapter until interaction/rendering leave FreeRoamPrototype entirely. */
export function wireLegacyFreeRoamInteraction(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamInteractionShape;

  legacy.updateNearbyInteraction = () => {
    legacy.nearbyNpc = findNearestInteractionActor(
      legacy.npcs,
      legacy.playerPosition,
      INTERACTION_DISTANCE,
    );
    legacy.nearbyZone = findContainingInteractionZone(
      region.interactionZones,
      legacy.playerPosition,
    );
  };

  legacy.pointInsideZone = (position, zone) =>
    pointInsideInteractionRect(position, zone.area);

  legacy.interactWithZone = (zone) => {
    const gate = evaluateQuestInteractionGate({
      requiredQuestId: zone.questCompleteId,
      activeQuestId: legacy.activeQuestId,
      completedQuestIds: legacy.completedQuestIds,
    });

    if (!gate.allowed) {
      const currentQuest = findQuest(region.quests, legacy.activeQuestId);
      legacy.status.text = currentQuest
        ? `当前目标：${currentQuest.title}。完成后再前往${zone.name}。`
        : `现在还不能进入${zone.name}。`;
      return;
    }

    legacy.tryCompleteQuest(zone.questCompleteId);
    if (zone.statusText) legacy.status.text = zone.statusText;
    if (zone.storySceneId) legacy.openStory(zone.storySceneId);
  };
}
