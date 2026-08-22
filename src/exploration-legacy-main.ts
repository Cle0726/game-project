import { FreeRoamPrototype } from './exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition } from './exploration/explorationTypes';
import { resolveProtagonistExplorationSprite } from './exploration/explorationAssets';
import {
  getDefaultExplorationRegion,
  getExplorationEntry,
  getExplorationRegion,
} from './exploration/regionRegistry';

declare global {
  interface Window {
    showMainMenu?: () => void;
    enterExplorationRegion?: (regionId?: string) => void;
    leaveExplorationRegion?: () => void;
    openStoryFromExploration?: (sceneId: string) => boolean;
  }
}

const originalShowScene = typeof window.showScene === 'function' ? window.showScene.bind(window) : undefined;
const originalGoToScene = typeof window.goToScene === 'function' ? window.goToScene.bind(window) : undefined;

let runtime: FreeRoamPrototype | undefined;
let host: HTMLDivElement | undefined;
let mounting = false;
let bypassInterception = false;

function createHost(): HTMLDivElement {
  const existing = document.getElementById('live-exploration-root');
  if (existing instanceof HTMLDivElement) return existing;

  const container = document.createElement('div');
  container.id = 'live-exploration-root';
  container.setAttribute('aria-label', '自由探索区域');
  Object.assign(container.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '100000',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    background: '#0b1220',
  });
  document.body.appendChild(container);
  return container;
}

function destroyRuntime(): void {
  runtime?.destroy();
  runtime = undefined;
  host?.remove();
  host = undefined;
  mounting = false;
}

function callOriginalScene(sceneId: string): boolean {
  bypassInterception = true;
  try {
    if (originalGoToScene) {
      originalGoToScene(sceneId);
      return true;
    }
    if (originalShowScene) {
      originalShowScene(sceneId);
      return true;
    }
    return false;
  } finally {
    bypassInterception = false;
  }
}

async function enterExploration(
  region: ExplorationRegionDefinition,
  fallbackSceneId?: string,
): Promise<void> {
  if (runtime || mounting) return;
  mounting = true;

  window.clearReactWorldMapScreen?.();
  window.gamePhase = 'exploration';
  host = createHost();

  const playerSpriteSrc = resolveProtagonistExplorationSprite(window.GameState?.['奏者性别']);
  runtime = new FreeRoamPrototype(region, {
    playerSpriteSrc,
    onStoryScene: (sceneId) => {
      window.openStoryFromExploration?.(sceneId);
    },
    onExit: () => {
      window.leaveExplorationRegion?.();
      window.showMainMenu?.();
    },
  });

  try {
    await runtime.mount(host);
  } catch (error) {
    console.error(`[exploration] failed to mount region ${region.id}`, error);
    destroyRuntime();
    if (fallbackSceneId) {
      callOriginalScene(fallbackSceneId);
    } else {
      window.showMainMenu?.();
    }
  } finally {
    mounting = false;
  }
}

window.enterExplorationRegion = (regionId = getDefaultExplorationRegion().id) => {
  const region = getExplorationRegion(regionId);
  if (!region) {
    console.warn('[exploration] unknown region', regionId);
    return;
  }
  void enterExploration(region);
};

window.leaveExplorationRegion = () => {
  destroyRuntime();
  window.gamePhase = 'main_story';
};

window.openStoryFromExploration = (sceneId: string): boolean => {
  destroyRuntime();
  window.gamePhase = 'main_story';
  return callOriginalScene(sceneId);
};

function tryInterceptScene(sceneId: string): boolean {
  if (bypassInterception) return false;
  const entry = getExplorationEntry(sceneId);
  if (!entry) return false;
  void enterExploration(entry.region, entry.sceneId);
  return true;
}

if (originalShowScene) {
  window.showScene = (sceneId: string) => {
    if (tryInterceptScene(sceneId)) return;
    originalShowScene(sceneId);
  };
}

if (originalGoToScene) {
  window.goToScene = (sceneId: string) => {
    if (tryInterceptScene(sceneId)) return;
    originalGoToScene(sceneId);
  };
}
