import { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type {
  FreeRoamPrototypeOptions,
} from '../../exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition } from '../../exploration/explorationTypes';
import { wireLegacyFreeRoamInteraction } from './LegacyFreeRoamInteractionAdapter';
import { wireLegacyFreeRoamMovement } from './LegacyFreeRoamMovementAdapter';
import { wireLegacyFreeRoamRenderer } from './LegacyFreeRoamRendererAdapter';

export type ExplorationRuntimeOptions = FreeRoamPrototypeOptions;

/**
 * Stable exploration runtime boundary used by story/world-map bridges.
 *
 * During Phase A it composes the existing Pixi FreeRoamPrototype as a renderer shell,
 * then replaces legacy rule methods with the formal Simulation systems. Callers no
 * longer need to know which parts are still legacy. The wrapped renderer can be
 * replaced later without changing chapter entry code.
 */
export class ExplorationRuntime {
  private readonly renderer: FreeRoamPrototype;

  constructor(
    readonly region: ExplorationRegionDefinition,
    options: ExplorationRuntimeOptions = {},
  ) {
    this.renderer = new FreeRoamPrototype(region, options);
    wireLegacyFreeRoamMovement(this.renderer, region);
    wireLegacyFreeRoamInteraction(this.renderer, region);
    wireLegacyFreeRoamRenderer(this.renderer, region);
  }

  mount(host: HTMLElement): Promise<void> {
    return this.renderer.mount(host);
  }

  destroy(): void {
    this.renderer.destroy();
  }
}
