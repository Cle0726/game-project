import type { Container, Graphics, Text } from 'pixi.js';
import type { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type {
  ExplorationDialogueLine,
  ExplorationInteractionZone,
  ExplorationNpcDefinition,
  ExplorationRegionDefinition,
  Vec2,
} from '../../exploration/explorationTypes';
import { findQuestById } from '../quest/QuestSystem';
import { ExplorationDialoguePresentation } from './ExplorationDialoguePresentation';
import { ExplorationHudPresentation } from './ExplorationHudPresentation';
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
  nearbyNpc?: LegacyNpcRuntimeShape;
  nearbyZone?: ExplorationInteractionZone;
  activeQuestId?: string;
  dialogueNpcId?: string;
  dialoguePanel?: Container;
  prompt: Text;
  status: Text;
  clockText: Text;
  questTitle: Text;
  questDescription: Text;
  clockPanel?: Graphics;
  controlsText?: Text;
  buildHud(): void;
  buildDialoguePanel(): void;
  updateHudPositions(): void;
  updatePrompt(): void;
  refreshQuestHud(): void;
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
 * Transitional bridge that moves HUD/dialogue/objective presentation ownership out of
 * FreeRoamPrototype while keeping its current Pixi shell/API intact.
 */
export function wireLegacyFreeRoamPresentation(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamPresentationShape;
  let hud: ExplorationHudPresentation | undefined;
  let dialogue: ExplorationDialoguePresentation | undefined;
  let objective: ExplorationObjectivePresentation | undefined;

  const ensureHud = () => {
    hud ??= new ExplorationHudPresentation(legacy.app.stage, region.name);
    legacy.prompt = hud.prompt;
    legacy.status = hud.status;
    legacy.clockText = hud.clockText;
    legacy.questTitle = hud.questTitle;
    legacy.questDescription = hud.questDescription;
    legacy.clockPanel = hud.clockPanel;
    legacy.controlsText = hud.controlsText;
    return hud;
  };

  legacy.buildHud = () => {
    ensureHud();
    legacy.buildDialoguePanel();
    legacy.refreshQuestHud();
    legacy.updateHudPositions();
  };

  legacy.refreshQuestHud = () => {
    const currentHud = ensureHud();
    const quest = findQuestById(region.quests, legacy.activeQuestId);
    if (!quest) {
      currentHud.setQuest('探索目标已完成', '继续探索，或前往下一个剧情入口。');
      return;
    }
    currentHud.setQuest(`◆ ${quest.title}`, quest.description);
  };

  legacy.updatePrompt = () => {
    const currentHud = ensureHud();
    if (legacy.isDialogueActive()) {
      currentHud.setPrompt('');
      return;
    }
    currentHud.setPrompt(
      legacy.nearbyNpc?.definition.interactionText ??
        legacy.nearbyZone?.interactionText ??
        '',
    );
  };

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
