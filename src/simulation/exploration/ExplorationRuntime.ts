import { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type {
  FreeRoamPrototypeOptions,
} from '../../exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition } from '../../exploration/explorationTypes';
import { wireLegacyFreeRoamActorViews } from './LegacyFreeRoamActorViewAdapter';
import { wireLegacyFreeRoamInteraction } from './LegacyFreeRoamInteractionAdapter';
import { wireLegacyFreeRoamMovement } from './LegacyFreeRoamMovementAdapter';
import { wireLegacyFreeRoamPresentation } from './LegacyFreeRoamPresentationAdapter';
import { wireLegacyFreeRoamRenderer } from './LegacyFreeRoamRendererAdapter';
import { wireLegacyFreeRoamWorldView } from './LegacyFreeRoamWorldViewAdapter';

export type ExplorationRuntimeOptions = FreeRoamPrototypeOptions;

/**
 * Stable exploration runtime boundary used by story/world-map bridges.
 *
 * During Phase A it composes the existing Pixi FreeRoamPrototype as a renderer shell,
 * then replaces legacy rule/presentation methods with the formal Simulation systems.
 * Callers no longer need to know which parts are still legacy. The wrapped renderer
 * can be replaced later without changing chapter entry code.
 */
export class ExplorationRuntime {
  private readonly renderer: FreeRoamPrototype;

  constructor(
    readonly region: ExplorationRegionDefinition,
    options: ExplorationRuntimeOptions = {},
  ) {
    this.renderer = new FreeRoamPrototype(region, options);
    wireLegacyFreeRoamActorViews(this.renderer, region);
    wireLegacyFreeRoamWorldView(this.renderer, region);
    wireLegacyFreeRoamMovement(this.renderer, region);
    wireLegacyFreeRoamInteraction(this.renderer, region);
    wireLegacyFreeRoamPresentation(this.renderer, region);
    wireLegacyFreeRoamRenderer(this.renderer, region);
  }

  mount(host: HTMLElement): Promise<void> {
    return this.renderer.mount(host);
  }

  destroy(): void {
    this.renderer.destroy();
  }
}
