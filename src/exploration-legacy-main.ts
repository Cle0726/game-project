import { FreeRoamPrototype } from './exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition } from './exploration/explorationTypes';
import { resolveProtagonistExplorationSprite } from './exploration/explorationAssets';
import {
  getDefaultExplorationRegion,
  getExplorationEntry,
  getExplorationRegion,
} from './exploration/regionRegistry';
import { getSimulationRuntime } from './simulation/runtime/SimulationRuntime';
import type { GameCommandSource } from './simulation/command/GameCommand';
import { wireLegacyFreeRoamMovement } from './simulation/exploration/LegacyFreeRoamMovementAdapter';
import { wireLegacyFreeRoamInteraction } from './simulation/exploration/LegacyFreeRoamInteractionAdapter';

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
const simulationRuntime = getSimulationRuntime();

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

function getIssuedAt(): number {
  const state = simulationRuntime.start();
  return Math.max(0, state.clock.day - 1) * 1440 + state.clock.minuteOfDay;
}

function destroyRuntime(): void {
  runtime?.destroy();
  runtime = undefined;
  host?.remove();
  host = undefined;
  mounting = false;
}

function recordCurrentReturnPoint(): void {
  const state = simulationRuntime.state;
  const regionId = state.currentRegionId;
  if (!regionId) return;
  const position = state.regions[regionId]?.playerPosition;
  if (!position) return;

  simulationRuntime.commands.dispatch({
    type: 'exploration.return_point.set',
    source: 'story',
    actorId: 'player',
    issuedAt: getIssuedAt(),
    payload: {
      regionId,
      x: position.x,
      y: position.y,
      facing: 'down',
    },
  });
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
  source: GameCommandSource = 'player',
): Promise<void> {
  if (runtime || mounting) return;
  mounting = true;
  simulationRuntime.start();

  window.clearReactWorldMapScreen?.();
  window.gamePhase = 'exploration';
  host = createHost();

  const playerSpriteSrc = resolveProtagonistExplorationSprite(window.GameState?.['奏者性别']);

  // Construct first: its compatibility load performs one-time migration of the old
  // single-region localStorage snapshot before region.enter can create a fresh slot.
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

  // Phase-A migration bridges: FreeRoam still owns Pixi/UI, while deterministic
  // displacement, collision, proximity selection and quest-zone gating are now
  // resolved by the formal Simulation systems.
  wireLegacyFreeRoamMovement(runtime, region);
  wireLegacyFreeRoamInteraction(runtime, region);

  const savedPosition = simulationRuntime.state.regions[region.id]?.playerPosition;

  try {
    await runtime.mount(host);

    // Record entry only after the Pixi region is successfully mounted. A failed load
    // must never leave a canonical "region.entered" event behind.
    simulationRuntime.commands.dispatch({
      type: 'region.enter',
      source,
      actorId: 'player',
      issuedAt: getIssuedAt(),
      payload: {
        regionId: region.id,
        playerPosition: savedPosition ? { ...savedPosition } : { ...region.playerSpawn },
      },
    });
  } catch (error) {
    console.error(`[exploration] failed to mount region ${region.id}`, error);
    destroyRuntime();
    window.gamePhase = 'main_story';
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
  void enterExploration(region, undefined, 'player');
};

window.leaveExplorationRegion = () => {
  destroyRuntime();
  window.gamePhase = 'main_story';
};

window.openStoryFromExploration = (sceneId: string): boolean => {
  // destroy() performs the final exact exploration persistence before we snapshot
  // the return point used when story hands control back to free roam.
  destroyRuntime();
  recordCurrentReturnPoint();
  window.gamePhase = 'main_story';
  return callOriginalScene(sceneId);
};

function tryInterceptScene(sceneId: string): boolean {
  if (bypassInterception) return false;
  const entry = getExplorationEntry(sceneId);
  if (!entry) return false;
  void enterExploration(entry.region, entry.sceneId, 'story');
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
