export function findQuestById<T extends { id: string }>(items: T[] | undefined, id: string | undefined): T | undefined {
  if (!id) return undefined;
  return items?.find((item) => item.id === id);
}

export function completeQuest(
  quests: Array<{ id: string; nextQuestId?: string }> | undefined,
  activeQuestId: string | undefined,
  completedQuestIds: string[],
  completedQuestId: string | undefined,
): { activeQuestId?: string; completedQuestIds: string[]; changed: boolean } {
  if (!completedQuestId || activeQuestId !== completedQuestId || completedQuestIds.includes(completedQuestId)) {
    return { activeQuestId, completedQuestIds, changed: false };
  }

  const quest = quests?.find((item) => item.id === completedQuestId);
  return {
    activeQuestId: quest?.nextQuestId,
    completedQuestIds: [...completedQuestIds, completedQuestId],
    changed: true,
  };
}
