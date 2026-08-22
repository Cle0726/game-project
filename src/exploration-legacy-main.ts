import { FreeRoamPrototype } from './exploration/FreeRoamPrototype';
import { PROTOTYPE_REGION } from './exploration/regionData';
import { resolveProtagonistExplorationSprite } from './exploration/explorationAssets';

interface LegacyGameState {
  奏者性别?: string;
  当前场景ID?: string;
  currentSceneId?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    GameState?: LegacyGameState;
    gamePhase?: string;
    showScene?: (sceneId: string) => void;
    goToScene?: (sceneId: string) => void;
    showMainMenu?: () => void;
    clearReactWorldMapScreen?: () => void;
    enterExplorationRegion?: (regionId?: string) => void;
    leaveExplorationRegion?: () => void;
    openStoryFromExploration?: (sceneId: string) => boolean;
  }
}

const EXPLORATION_ENTRY_SCENES = new Set(['chapter3_white_start']);
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

async function enterWhiteAcademyExploration(): Promise<void> {
  if (runtime || mounting) return;
  mounting = true;

  window.clearReactWorldMapScreen?.();
  window.gamePhase = 'exploration';
  host = createHost();

  const playerSpriteSrc = resolveProtagonistExplorationSprite(window.GameState?.奏者性别);
  runtime = new FreeRoamPrototype(PROTOTYPE_REGION, {
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
    console.error('[exploration] failed to mount live exploration', error);
    destroyRuntime();
    callOriginalScene('chapter3_white_start');
  } finally {
    mounting = false;
  }
}

window.enterExplorationRegion = (regionId = PROTOTYPE_REGION.id) => {
  if (regionId !== PROTOTYPE_REGION.id) return;
  void enterWhiteAcademyExploration();
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

if (originalShowScene) {
  window.showScene = (sceneId: string) => {
    if (!bypassInterception && EXPLORATION_ENTRY_SCENES.has(sceneId)) {
      void enterWhiteAcademyExploration();
      return;
    }
    originalShowScene(sceneId);
  };
}

if (originalGoToScene) {
  window.goToScene = (sceneId: string) => {
    if (!bypassInterception && EXPLORATION_ENTRY_SCENES.has(sceneId)) {
      void enterWhiteAcademyExploration();
      return;
    }
    originalGoToScene(sceneId);
  };
}
