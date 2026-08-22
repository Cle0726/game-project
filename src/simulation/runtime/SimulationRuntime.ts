import { CommandBus } from '../command/CommandBus';
import { registerCoreCommandHandlers } from '../command/CoreCommandHandlers';
import {
  getOrCreateSimulationStateV1,
  readSimulationStateV1,
} from '../state/LegacyGameStateAdapter';
import type { SimulationStateV1 } from '../state/SimulationState';

export class SimulationRuntime {
  readonly commands = new CommandBus();
  readonly events = this.commands.events;
  private running = false;
  private destroyed = false;
  private disposeCoreCommands: () => void;

  constructor() {
    this.disposeCoreCommands = registerCoreCommandHandlers(this.commands);
  }

  start(): SimulationStateV1 {
    if (this.destroyed) {
      throw new Error('SimulationRuntime.start(): runtime has been destroyed');
    }

    const state = getOrCreateSimulationStateV1();
    if (!this.running) {
      this.running = true;
      window.dispatchEvent(
        new CustomEvent('simulation:runtime-started', {
          detail: { version: state.version },
        }),
      );
    }
    return state;
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    window.dispatchEvent(new CustomEvent('simulation:runtime-stopped'));
  }

  get isRunning(): boolean {
    return this.running;
  }

  get isDestroyed(): boolean {
    return this.destroyed;
  }

  get state(): SimulationStateV1 {
    if (this.destroyed) {
      throw new Error('SimulationRuntime.state: runtime has been destroyed');
    }
    return readSimulationStateV1() ?? this.start();
  }

  destroy(): void {
    if (this.destroyed) return;
    this.stop();
    this.disposeCoreCommands();
    this.commands.clear();
    this.destroyed = true;
  }
}

let sharedRuntime: SimulationRuntime | undefined;

export function getSimulationRuntime(): SimulationRuntime {
  if (!sharedRuntime || sharedRuntime.isDestroyed) {
    sharedRuntime = new SimulationRuntime();
  }
  return sharedRuntime;
}
