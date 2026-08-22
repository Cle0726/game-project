import type { Container } from 'pixi.js';
import type {
  FreeRoamPrototype,
  FreeRoamPrototypeOptions,
} from '../../exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition } from '../../exploration/explorationTypes';
import { ExplorationWorldPresentation } from './ExplorationWorldPresentation';

interface LegacyFreeRoamWorldViewShape {
  options: FreeRoamPrototypeOptions;
  world: Container;
  buildWorld(): Promise<void>;
  buildPlayer(): Promise<void>;
  buildNpcs(): Promise<void>;
}

/** Transitional bridge that moves background/debug world construction out of FreeRoam. */
export function wireLegacyFreeRoamWorldView(
  runtime: FreeRoamPrototype,
  region: ExplorationRegionDefinition,
): void {
  const legacy = runtime as unknown as LegacyFreeRoamWorldViewShape;
  const presentation = new ExplorationWorldPresentation(legacy.world, region);

  legacy.buildWorld = async () => {
    const debugNavigation =
      Boolean(legacy.options.debugNavigation) ||
      new URLSearchParams(window.location.search).get('debugNav') === '1';

    await presentation.buildEnvironment(debugNavigation);
    await legacy.buildPlayer();
    await legacy.buildNpcs();
  };
}
