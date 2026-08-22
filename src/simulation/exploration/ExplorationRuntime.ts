import { FreeRoamPrototype } from '../../exploration/FreeRoamPrototype';
import type {
  FreeRoamPrototypeOptions,
} from '../../exploration/FreeRoamPrototype';
import type { ExplorationRegionDefinition } from '../../exploration/explorationTypes';
import { wireLegacyFreeRoamActorViews } from './LegacyFreeRoamActorViewAdapter';
import { wireLegacyFreeRoamInput } from './LegacyFreeRoamInputAdapter';
import { wireLegacyFreeRoamInteraction } from './LegacyFreeRoamInteractionAdapter';
import { wireLegacyFreeRoamLoop } from './LegacyFreeRoamLoopAdapter';
import { wireLegacyFreeRoamMovement } from './LegacyFreeRoamMovementAdapter';
import { wireLegacyFreeRoamNpcs } from './LegacyFreeRoamNpcAdapter';
import { wireLegacyFreeRoamPresentation } from './LegacyFreeRoamPresentationAdapter';
import { wireLegacyFreeRoamRenderer } from './LegacyFreeRoamRendererAdapter';
import { wireLegacyFreeRoamWorldView } from './LegacyFreeRoamWorldViewAdapter';

export type ExplorationRuntimeOptions = FreeRoamPrototypeOptions;

/**
 * Stable exploration runtime boundary used by story/world-map bridges.
 *
 * During Phase A it composes the existing Pixi FreeRoamPrototype as a compatibility
 * shell, then replaces legacy rules, presentation, input and frame/NPC orchestration
 * with formal Runtime systems. Chapter callers only depend on this boundary.
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
    wireLegacyFreeRoamNpcs(this.renderer, region);
    const input = wireLegacyFreeRoamInput(this.renderer);
    wireLegacyFreeRoamRenderer(this.renderer, region);
    wireLegacyFreeRoamLoop(this.renderer, region, input);
  }

  mount(host: HTMLElement): Promise<void> {
    return this.renderer.mount(host);
  }

  destroy(): void {
    this.renderer.destroy();
  }
}
