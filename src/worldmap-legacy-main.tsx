import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { WorldMapView } from './worldmap';
import type { GameStateLike } from './worldmap';
import type { LocationNode, WorldRegion } from './worldmap';
import './exploration-legacy-main';

export interface WorldMapScreenState {
  gameState?: GameStateLike;
  knownRegionIds?: string[];
}

declare global {
  interface Window {
    GameState?: GameStateLike;
    renderReactWorldMapScreen?: (state: WorldMapScreenState) => void;
    clearReactWorldMapScreen?: () => void;
    __pendingReactWorldMapState?: WorldMapScreenState;
    showScene?: (sceneId: string) => void;
    showMainMenu?: () => void;
    showToast?: (text: string, delta?: number) => void;
  }
}

let root: Root | null = null;

function getWorldMapRoot(): HTMLElement | null {
  const container = document.getElementById('react-worldmap-root');
  if (!container) return null;

  if (!root) {
    root = createRoot(container);
  }

  return container;
}

function getKnownRegionIds(gameState?: GameStateLike): string[] | undefined {
  const explicitKnownRegions = gameState?.knownRegionIds ?? gameState?.['已知世界区域'];
  if (Array.isArray(explicitKnownRegions)) {
    return explicitKnownRegions.filter((regionId): regionId is string => typeof regionId === 'string');
  }

  return undefined;
}

function enterScene(sceneId: string): void {
  window.clearReactWorldMapScreen?.();
  window.showScene?.(sceneId);
}

function openTeaBreak(returnSceneId: string, node: LocationNode, region: WorldRegion, contextType: string): void {
  if (window.GameState) {
    window.GameState['茶歇返回场景'] = returnSceneId;
    window.GameState.worldMapTeaBreakContextType = contextType;
    window.GameState.worldMapTeaBreakSourceNodeId = node.id;
    window.GameState.worldMapTeaBreakRegionId = region.id;
  }

  enterScene('tea_break_hub');
}

function revisitScene(_sceneId: string, node: LocationNode, region: WorldRegion): void {
  const place = region.id === 'ashen_corridor' && node.id.includes('005') ? '槐序：……又是这里。' : `重新回到${node.name}`;
  window.showToast?.(place, 0);
}

function exitWorldMap(): void {
  window.clearReactWorldMapScreen?.();
  window.showMainMenu?.();
}

window.renderReactWorldMapScreen = (state: WorldMapScreenState) => {
  const container = getWorldMapRoot();
  if (!container) return;

  const gameState = state.gameState ?? window.GameState;
  const knownRegionIds = state.knownRegionIds ?? getKnownRegionIds(gameState);
  container.closest('#world-map-area')?.classList.add('has-react-worldmap');

  root?.render(
    <React.StrictMode>
      <div className="legacy-worldmap-shell">
        <button className="legacy-worldmap-exit" type="button" onClick={exitWorldMap}>
          返回主菜单
        </button>
        <WorldMapView
          gameState={gameState}
          knownRegionIds={knownRegionIds}
          onEnterScene={enterScene}
          onOpenTeaBreak={openTeaBreak}
          onRevisitScene={revisitScene}
        />
      </div>
    </React.StrictMode>,
  );
};

window.clearReactWorldMapScreen = () => {
  root?.render(null);
  document.getElementById('world-map-area')?.classList.remove('has-react-worldmap');
};

if (window.__pendingReactWorldMapState) {
  window.renderReactWorldMapScreen(window.__pendingReactWorldMapState);
  window.__pendingReactWorldMapState = undefined;
}
