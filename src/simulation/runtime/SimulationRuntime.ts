import { CommandBus } from '../command/CommandBus';
import {
  getOrCreateSimulationStateV1,
  readSimulationStateV1,
} from '../state/LegacyGameStateAdapter';
import type { SimulationStateV1 } from '../state/SimulationState';

export class SimulationRuntime {
  readonly commands = new CommandBus();
  readonly events = this.commands.events;
  private running = false;

  start(): SimulationStateV1 {
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

  get state(): SimulationStateV1 {
    return readSimulationStateV1() ?? this.start();
  }

  destroy(): void {
    this.stop();
    this.commands.clear();
  }
}

let sharedRuntime: SimulationRuntime | undefined;

export function getSimulationRuntime(): SimulationRuntime {
  sharedRuntime ??= new SimulationRuntime();
  return sharedRuntime;
}
