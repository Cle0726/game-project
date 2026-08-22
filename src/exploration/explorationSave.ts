export interface ExplorationSaveState {
  version: 1;
  regionId: string;
  playerPosition: { x: number; y: number };
  clockMinute: number;
  activeQuestId?: string;
  completedQuestIds: string[];
  npcPositions: Record<string, { x: number; y: number }>;
}

const STORAGE_KEY = 'cle.exploration.verticalSlice.v1';

export function loadExplorationSave(regionId: string): ExplorationSaveState | undefined {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<ExplorationSaveState>;
    if (parsed.version !== 1 || parsed.regionId !== regionId) return undefined;
    if (!parsed.playerPosition || typeof parsed.clockMinute !== 'number') return undefined;

    return {
      version: 1,
      regionId,
      playerPosition: parsed.playerPosition,
      clockMinute: parsed.clockMinute,
      activeQuestId: parsed.activeQuestId,
      completedQuestIds: Array.isArray(parsed.completedQuestIds) ? parsed.completedQuestIds : [],
      npcPositions: parsed.npcPositions ?? {},
    };
  } catch {
    return undefined;
  }
}

export function saveExplorationState(state: ExplorationSaveState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Exploration persistence is additive; storage failure must not stop the game.
  }
}
