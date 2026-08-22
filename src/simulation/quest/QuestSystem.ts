export interface QuestDefinitionLike {
  id: string;
  nextQuestId?: string;
}

export interface QuestRuntimeSnapshot {
  activeQuestId?: string;
  completedQuestIds: string[];
}

export interface QuestTransitionResult extends QuestRuntimeSnapshot {
  changed: boolean;
  completedQuestId?: string;
}

export function findQuestById<TQuest extends { id: string }>(
  quests: readonly TQuest[] | undefined,
  questId: string | undefined,
): TQuest | undefined {
  if (!questId) return undefined;
  return quests?.find((quest) => quest.id === questId);
}

export function canCompleteQuest(
  runtime: QuestRuntimeSnapshot,
  questId: string | undefined,
): boolean {
  return Boolean(
    questId &&
      runtime.activeQuestId === questId &&
      !runtime.completedQuestIds.includes(questId),
  );
}

export function completeQuest(
  quests: readonly QuestDefinitionLike[] | undefined,
  runtime: QuestRuntimeSnapshot,
  questId: string | undefined,
): QuestTransitionResult {
  if (!canCompleteQuest(runtime, questId) || !questId) {
    return { ...runtime, completedQuestIds: [...runtime.completedQuestIds], changed: false };
  }

  const quest = quests?.find((item) => item.id === questId);
  return {
    activeQuestId: quest?.nextQuestId,
    completedQuestIds: [...runtime.completedQuestIds, questId],
    completedQuestId: questId,
    changed: true,
  };
}
