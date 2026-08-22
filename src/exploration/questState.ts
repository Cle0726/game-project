import {
  completeQuest as completeSimulationQuest,
  findQuestById as findSimulationQuestById,
} from '../simulation/quest/QuestSystem';

/**
 * Legacy compatibility wrappers.
 * New quest transition rules live under src/simulation/quest/QuestSystem.ts.
 */
export function findQuestById<T extends { id: string }>(
  items: T[] | undefined,
  id: string | undefined,
): T | undefined {
  return findSimulationQuestById(items, id);
}

export function completeQuest(
  quests: Array<{ id: string; nextQuestId?: string }> | undefined,
  activeQuestId: string | undefined,
  completedQuestIds: string[],
  completedQuestId: string | undefined,
): { activeQuestId?: string; completedQuestIds: string[]; changed: boolean } {
  const result = completeSimulationQuest(
    quests,
    { activeQuestId, completedQuestIds },
    completedQuestId,
  );
  return {
    activeQuestId: result.activeQuestId,
    completedQuestIds: result.completedQuestIds,
    changed: result.changed,
  };
}
