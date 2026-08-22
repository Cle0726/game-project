import type { ExplorationNpcScheduleEntry } from './explorationTypes';
import {
  advanceSimulationClock,
  DEFAULT_EXPLORATION_CLOCK,
  formatMinuteOfDay as formatSimulationMinuteOfDay,
} from '../simulation/runtime/SimulationClock';
import { resolveScheduleEntry as resolveSimulationScheduleEntry } from '../simulation/agent/ScheduleSystem';

export const PROTOTYPE_DAY_START_MINUTE = DEFAULT_EXPLORATION_CLOCK.startMinute;
export const PROTOTYPE_DAY_END_MINUTE = DEFAULT_EXPLORATION_CLOCK.endMinute;
export const PROTOTYPE_MINUTES_PER_REAL_SECOND = DEFAULT_EXPLORATION_CLOCK.minutesPerRealSecond;

/** Legacy compatibility wrappers for the current exploration runtime. */
export function advancePrototypeClock(currentMinute: number, deltaSeconds: number): number {
  return advanceSimulationClock(currentMinute, deltaSeconds, DEFAULT_EXPLORATION_CLOCK);
}

export function resolveScheduleEntry(
  schedule: ExplorationNpcScheduleEntry[] | undefined,
  minuteOfDay: number,
): ExplorationNpcScheduleEntry | undefined {
  return resolveSimulationScheduleEntry(schedule, minuteOfDay);
}

export function formatMinuteOfDay(minuteOfDay: number): string {
  return formatSimulationMinuteOfDay(minuteOfDay);
}
