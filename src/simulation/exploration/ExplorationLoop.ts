import { advanceSimulationClock, formatMinuteOfDay } from '../runtime/SimulationClock';
import { ExplorationInputController } from './ExplorationInputController';
import { movementDelta } from './MovementSystem';
import type { SpatialPoint } from './SpatialTypes';

export interface ExplorationLoopPort {
  isPaused(): boolean;
  getClockMinute(): number;
  setClockMinute(minute: number): void;
  updateNpcs(deltaSeconds: number): void;
  movePlayer(delta: SpatialPoint): SpatialPoint;
  updatePlayerMotion(movement: SpatialPoint, deltaSeconds: number): void;
  updateNearbyInteraction(): void;
  updateCamera(): void;
  updateHudPositions(): void;
  updatePrompt(): void;
  updateObjectivePresentation(deltaSeconds: number): void;
  updateClockLabel(label: string): void;
  persistState(): void;
}

export interface ExplorationLoopConfig {
  playerMoveSpeed: number;
  autosaveSeconds: number;
}

const DEFAULT_LOOP_CONFIG: Readonly<ExplorationLoopConfig> = {
  playerMoveSpeed: 290,
  autosaveSeconds: 3,
};

/** Owns deterministic per-frame ordering; renderer/state details are supplied by a port. */
export class ExplorationLoop {
  private autosaveElapsed = 0;

  constructor(
    private readonly input: ExplorationInputController,
    private readonly config: ExplorationLoopConfig = DEFAULT_LOOP_CONFIG,
  ) {}

  tick(deltaSeconds: number, port: ExplorationLoopPort): void {
    const delta = Math.max(0, deltaSeconds);
    const paused = port.isPaused();

    if (!paused) {
      port.setClockMinute(advanceSimulationClock(port.getClockMinute(), delta));
    }

    port.updateNpcs(delta);

    const input = this.input.movementInput(!paused);
    const desiredMovement = movementDelta(input, this.config.playerMoveSpeed, delta);
    const actualMovement =
      Math.abs(desiredMovement.x) > Number.EPSILON ||
      Math.abs(desiredMovement.y) > Number.EPSILON
        ? port.movePlayer(desiredMovement)
        : { x: 0, y: 0 };

    port.updatePlayerMotion(actualMovement, delta);
    port.updateNearbyInteraction();
    port.updateCamera();
    port.updateHudPositions();
    port.updatePrompt();
    port.updateObjectivePresentation(delta);
    port.updateClockLabel(formatMinuteOfDay(port.getClockMinute()));

    this.autosaveElapsed += delta;
    if (this.autosaveElapsed >= this.config.autosaveSeconds) {
      this.autosaveElapsed = 0;
      port.persistState();
    }
  }
}
