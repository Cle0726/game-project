import type { ExplorationRegionDefinition } from '../../exploration/explorationTypes';
import { ExplorationHost, type ExplorationHostOptions } from './ExplorationHost';

export type ExplorationRuntimeOptions = ExplorationHostOptions;

/** Stable exploration boundary used by story/world-map bridges. */
export class ExplorationRuntime {
  private readonly host: ExplorationHost;

  constructor(
    readonly region: ExplorationRegionDefinition,
    options: ExplorationRuntimeOptions = {},
  ) {
    this.host = new ExplorationHost(region, options);
  }

  mount(container: HTMLElement): Promise<void> {
    return this.host.mount(container);
  }

  destroy(): void {
    this.host.destroy();
  }
}
