import {
  createSimulationStateV1,
  normalizeSimulationStateV1,
  type SimulationStateV1,
} from './SimulationState';

type LegacyGameState = Record<string, unknown> & {
  simulationV1?: unknown;
};

function getWindowGameState(): LegacyGameState {
  const host = window as Window & { GameState?: LegacyGameState };
  if (!host.GameState || typeof host.GameState !== 'object') {
    host.GameState = {};
  }
  return host.GameState;
}

export function readSimulationStateV1(): SimulationStateV1 | undefined {
  return normalizeSimulationStateV1(getWindowGameState().simulationV1);
}

export function getOrCreateSimulationStateV1(): SimulationStateV1 {
  const gameState = getWindowGameState();
  const existing = normalizeSimulationStateV1(gameState.simulationV1);
  if (existing) {
    gameState.simulationV1 = existing;
    return existing;
  }

  const created = createSimulationStateV1();
  gameState.simulationV1 = created;
  return created;
}

export function mutateSimulationStateV1(
  mutator: (state: SimulationStateV1) => void,
): SimulationStateV1 {
  const gameState = getWindowGameState();
  const state = getOrCreateSimulationStateV1();
  mutator(state);
  gameState.simulationV1 = state;

  window.dispatchEvent(
    new CustomEvent('simulation:state-changed', {
      detail: { version: state.version, eventCursor: state.eventCursor },
    }),
  );

  return state;
}

export function replaceSimulationStateV1(nextState: SimulationStateV1): void {
  const gameState = getWindowGameState();
  gameState.simulationV1 = normalizeSimulationStateV1(nextState) ?? createSimulationStateV1();
}
