import type { Container } from 'pixi.js';
import type { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type {
  ExplorationDialogueLine,
  ExplorationNpcDefinition,
  ExplorationRegionDefinition,
  Vec2,
} from '../../exploration/explorationTypes';
import { findQuestById } from '../quest/QuestSystem';
import { ExplorationDialoguePresentation } from './ExplorationDialoguePresentation';
import {
  ExplorationObjectivePresentation,
  type ObjectiveNpcPosition,
} from './ExplorationObjectivePresentation';

interface LegacyNpcRuntimeShape {
  definition: ExplorationNpcDefinition;
  position: Vec2;
}

interface LegacyFreeRoamPresentationShape {
  app: { stage: Container };
  world: Container;
  keys: Set<string>;
  npcs: LegacyNpcRuntimeShape[];
  activeQuestId?: string;
  dialogueNpcId?: string;
  dialoguePanel?: Container;
  buildDialoguePanel(): void;
  startDialogue(
    lines: ExplorationDialogueLine[],
    npcId: string | undefined,
    onComplete?: () => void,
  ): void;
  advanceDialogue(): void;
  finishDialogue(triggerComplete: boolean): void;
  isDialogueActive(): boolean;
  buildObjectivePresentation(): void;
  refreshObjectivePresentation(): void;
  updateObjectivePresentation(deltaSeconds: number): void;
}

/**
 * Transitional bridge that moves dialogue state and objective marker ownership out of
 * FreeRoamPrototype while keeping its current Pixi shell/API intact.
 */
export function wireLegacyFreeRoamPresentation(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamPresentationShape;
  let dialogue: ExplorationDialoguePresentation | undefined;
  let objective: ExplorationObjectivePresentation | undefined;

  legacy.buildDialoguePanel = () => {
    dialogue ??= new ExplorationDialoguePresentation(legacy.app.stage);
    legacy.dialoguePanel = dialogue.panel;
  };

  legacy.startDialogue = (lines, npcId, onComplete) => {
    dialogue ??= new ExplorationDialoguePresentation(legacy.app.stage);
    legacy.dialoguePanel = dialogue.panel;
    legacy.keys.clear();
    if (dialogue.start(lines, npcId, onComplete)) {
      legacy.dialogueNpcId = dialogue.activeNpcId;
    }
  };

  legacy.advanceDialogue = () => {
    dialogue?.advance();
    legacy.dialogueNpcId = dialogue?.activeNpcId;
  };

  legacy.finishDialogue = (triggerComplete) => {
    legacy.dialogueNpcId = undefined;
    dialogue?.finish(triggerComplete);
  };

  legacy.isDialogueActive = () => dialogue?.active ?? false;

  const updateObjective = (deltaSeconds: number) => {
    objective ??= new ExplorationObjectivePresentation(legacy.world);
    const quest = findQuestById(region.quests, legacy.activeQuestId);
    const npcs: ObjectiveNpcPosition[] = legacy.npcs.map((npc) => ({
      id: npc.definition.id,
      position: npc.position,
    }));
    objective.update(deltaSeconds, quest?.target, npcs, region.interactionZones);
  };

  legacy.buildObjectivePresentation = () => {
    objective ??= new ExplorationObjectivePresentation(legacy.world);
    objective.refresh();
    updateObjective(0);
  };

  legacy.refreshObjectivePresentation = () => {
    objective?.refresh();
    updateObjective(0);
  };

  legacy.updateObjectivePresentation = updateObjective;
}
