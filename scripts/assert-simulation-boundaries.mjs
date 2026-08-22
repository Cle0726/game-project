import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const explorationSave = read('src/exploration/explorationSave.ts');
const persistence = read('src/simulation/state/SimulationPersistence.ts');
const adapter = read('src/simulation/state/LegacyGameStateAdapter.ts');
const runtime = read('src/simulation/runtime/SimulationRuntime.ts');
const freeRoam = read('src/exploration/FreeRoamPrototype.ts');

const failures = [];

if (!explorationSave.includes("../simulation/state/SimulationPersistence")) {
  failures.push('explorationSave.ts must delegate to SimulationPersistence');
}
if (explorationSave.includes('cle.exploration.verticalSlice.v1')) {
  failures.push('explorationSave.ts must not own the legacy localStorage key');
}
if (!persistence.includes('cle.exploration.verticalSlice.v1')) {
  failures.push('SimulationPersistence.ts must retain one-time legacy migration support');
}
if (!adapter.includes('simulationV1')) {
  failures.push('LegacyGameStateAdapter.ts must own the GameState.simulationV1 bridge');
}
if (!runtime.includes('CommandBus')) {
  failures.push('SimulationRuntime.ts must own a validated CommandBus');
}
if (/window\.GameState/.test(freeRoam)) {
  failures.push('FreeRoamPrototype.ts must not directly mutate window.GameState');
}

if (failures.length) {
  console.error('Simulation architecture guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Simulation architecture guard passed.');
