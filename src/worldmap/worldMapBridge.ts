import type { LocationNode, UnlockCondition, WorldRegion } from './worldMapTypes';

export type GamePhase =
  | 'main_story'
  | 'battle'
  | 'tea_break'
  | 'world_map'
  | 'region_map'
  | 'exploration';

export type WorldMapPhase = Extract<GamePhase, 'world_map' | 'region_map'>;

export type TeaBreakContextType = 'A' | 'B' | 'C' | 'D' | 'E';

export interface GameStateLike {
  当前场景ID?: string;
  已触发事件?: string[];
  chapterProgress?: number;
  currentSceneId?: string;
  triggeredEvents?: string[];
  [key: string]: unknown;
}

export interface TeaBreakEntry {
  returnSceneId: string;
  contextType: TeaBreakContextType;
  sourceNodeId: string;
  regionId: string;
}

export interface WorldMapNodeAccess {
  isAccessible: boolean;
  isCompleted: boolean;
}

interface StoryPosition {
  chapter: number;
  step: number;
}

declare global {
  interface Window {
    GameState?: GameStateLike;
    gamePhase?: GamePhase;
    goToScene?: (sceneId: string) => void;
    showScene?: (sceneId: string) => void;
  }
}

export const WORLD_MAP_PHASES: readonly WorldMapPhase[] = ['world_map', 'region_map'];

const CHARACTER_ID_TO_DISPLAY_NAME: Record<string, string> = {
  atya: '阿缇娅',
  milo: '弥洛',
  yuna: '尤娜',
  anning: '安柠',
  seluomi: '瑟萝弥',
  huaixu: '槐序',
  luowen: '洛温',
  yifubai: '伊芙白',
  mingxian: '明弦'
};

function parseStoryPosition(sceneId: string | undefined): StoryPosition | undefined {
  if (!sceneId) return undefined;

  const compactMatch = sceneId.match(/^ch(\d+)_(\d{3})/);
  if (compactMatch) {
    return { chapter: Number(compactMatch[1]), step: Number(compactMatch[2]) };
  }

  const chapterStartMatch = sceneId.match(/^chapter(\d+)_start$/);
  if (chapterStartMatch) {
    return { chapter: Number(chapterStartMatch[1]), step: -1 };
  }

  return undefined;
}

function getCurrentStoryPosition(gameState?: GameStateLike): StoryPosition | undefined {
  if (!gameState) return undefined;

  const candidates = [
    gameState.当前场景ID,
    gameState.currentSceneId,
    typeof gameState['茶歇返回场景'] === 'string' ? gameState['茶歇返回场景'] : undefined,
  ]
    .map(parseStoryPosition)
    .filter((position): position is StoryPosition => Boolean(position));

  if (!candidates.length) return undefined;
  return candidates.reduce((latest, candidate) => {
    if (candidate.chapter !== latest.chapter) {
      return candidate.chapter > latest.chapter ? candidate : latest;
    }
    return candidate.step > latest.step ? candidate : latest;
  });
}

function getRegionChapter(region: WorldRegion): number | undefined {
  for (const node of region.locationNodes) {
    const position = parseStoryPosition(node.id);
    if (position) return position.chapter;
  }
  return undefined;
}

/**
 * Chapter-4 authored side scenes moved into physical exploration. They remain in the
 * atlas data as labels, but direct world-map launch would bypass their story gates and
 * one-shot persistence, so only the exploration layer may open them.
 */
export function isExplorationOwnedWorldMapNode(nodeId: string): boolean {
  return nodeId.startsWith('chapter4_event_');
}

export function getWorldMapNodeAccess(
  node: LocationNode,
  region: WorldRegion,
  gameState?: GameStateLike,
): WorldMapNodeAccess {
  if (isExplorationOwnedWorldMapNode(node.id)) {
    return { isAccessible: false, isCompleted: false };
  }

  const regionChapter = getRegionChapter(region);
  const progress = inferChapterProgress(gameState);
  const currentPosition = getCurrentStoryPosition(gameState);
  const nodePosition = parseStoryPosition(node.id);

  // Keep legacy/custom regions without chapter-shaped node IDs working as before.
  if (typeof regionChapter !== 'number' || typeof progress !== 'number') {
    return { isAccessible: true, isCompleted: node.isCompleted };
  }

  if (progress < regionChapter) {
    return { isAccessible: false, isCompleted: false };
  }

  // Once a later chapter has been unlocked, this chapter is historical: map nodes are
  // revisit-only rather than fresh launches that can reapply authored effects.
  if (progress > regionChapter) {
    return { isAccessible: true, isCompleted: true };
  }

  const firstNodeId = region.locationNodes[0]?.id;
  if (!currentPosition || currentPosition.chapter < regionChapter) {
    return {
      isAccessible: node.id === firstNodeId,
      isCompleted: false,
    };
  }

  if (currentPosition.chapter > regionChapter) {
    return { isAccessible: true, isCompleted: true };
  }

  if (!nodePosition) {
    // Nested legacy nodes are only reachable after their parent layer was opened. Keep
    // them compatible unless ownership has explicitly moved to Exploration above.
    return { isAccessible: true, isCompleted: node.isCompleted };
  }

  if (nodePosition.step > currentPosition.step) {
    return { isAccessible: false, isCompleted: false };
  }

  return {
    isAccessible: true,
    isCompleted: node.isCompleted || nodePosition.step < currentPosition.step,
  };
}

export function resolveMainStorySceneId(nodeId: string): string {
  const chapterMatch = nodeId.match(/^chapter(\d+)_(\d{3})(.*)$/);
  if (!chapterMatch) return nodeId;

  const [, chapter, index, suffix] = chapterMatch;
  if (suffix) return nodeId;
  return `ch${chapter}_${index}`;
}

export function goToMainStoryScene(sceneId: string): void {
  window.gamePhase = 'main_story';

  if (typeof window.goToScene === 'function') {
    window.goToScene(sceneId);
    return;
  }

  window.showScene?.(sceneId);
}

export function inferChapterProgress(gameState?: GameStateLike): number | undefined {
  if (!gameState) return undefined;

  const candidates: number[] = [];
  if (typeof gameState.chapterProgress === 'number' && Number.isFinite(gameState.chapterProgress)) {
    candidates.push(gameState.chapterProgress);
  }

  const sceneId = gameState.当前场景ID ?? gameState.currentSceneId;
  if (sceneId) {
    const compactMatch = sceneId.match(/^ch(\d+)_/);
    if (compactMatch) candidates.push(Number(compactMatch[1]));

    const chapterMatch = sceneId.match(/^chapter(\d+)/);
    if (chapterMatch) candidates.push(Number(chapterMatch[1]));
  }

  const triggeredEvents = gameState.已触发事件 ?? gameState.triggeredEvents ?? [];
  for (const eventId of triggeredEvents) {
    const completedChapterMatch = eventId.match(/^chapter(\d+)_complete(?:$|_)/);
    if (completedChapterMatch) {
      candidates.push(Number(completedChapterMatch[1]) + 1);
    }
  }

  return candidates.length ? Math.max(...candidates) : undefined;
}

export function getRelationshipValue(
  gameState: GameStateLike | undefined,
  characterId: string,
  relationship: 'trust' | 'resonance'
): number {
  const englishKey = `${characterId}.${relationship}`;
  const directValue = gameState?.[englishKey];
  if (typeof directValue === 'number') return directValue;

  const chineseRelationship = relationship === 'trust' ? '信任' : '共鸣';
  const displayName = CHARACTER_ID_TO_DISPLAY_NAME[characterId] ?? characterId;
  const mappedValue = gameState?.[`${displayName}${chineseRelationship}`];
  return typeof mappedValue === 'number' ? mappedValue : 0;
}

export function isUnlockConditionMet(condition: UnlockCondition, gameState?: GameStateLike): boolean {
  if (condition.type === 'always') return true;
  if (!gameState) return true;

  if (condition.type === 'chapter_progress') {
    const chapterProgress = inferChapterProgress(gameState);
    return typeof chapterProgress === 'number' && chapterProgress >= condition.minChapter;
  }

  if (condition.type === 'event_triggered') {
    const triggeredEvents = gameState.已触发事件 ?? gameState.triggeredEvents ?? [];
    return triggeredEvents.includes(condition.eventId);
  }

  if (condition.type === 'trust') {
    return getRelationshipValue(gameState, condition.characterId, 'trust') >= condition.minValue;
  }

  return getRelationshipValue(gameState, condition.characterId, 'resonance') >= condition.minValue;
}

export function getTeaBreakContextType(node: LocationNode, region: WorldRegion): TeaBreakContextType {
  if (region.id === 'chapter1_rebuild') return 'B';
  if (region.id === 'chapter3_legacy_combined') return 'E';
  if (node.isCompleted && node.isRevisitable) return 'E';
  return 'A';
}

export function openTeaBreakFromWorldMap(entry: TeaBreakEntry): void {
  window.gamePhase = 'tea_break';

  if (window.GameState) {
    window.GameState.茶歇返回场景 = entry.returnSceneId;
    window.GameState.worldMapTeaBreakContextType = entry.contextType;
    window.GameState.worldMapTeaBreakSourceNodeId = entry.sourceNodeId;
    window.GameState.worldMapTeaBreakRegionId = entry.regionId;
  }

  window.dispatchEvent(new CustomEvent('worldmap:enter-tea-break', { detail: entry }));
  if (typeof window.goToScene === 'function') {
    window.goToScene('tea_break_hub');
    return;
  }

  window.showScene?.('tea_break_hub');
}
