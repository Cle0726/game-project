import type { ExplorationNpcScheduleEntry } from './explorationTypes';

export const PROTOTYPE_DAY_START_MINUTE = 8 * 60;
export const PROTOTYPE_DAY_END_MINUTE = 20 * 60;
export const PROTOTYPE_MINUTES_PER_REAL_SECOND = 20;

export function advancePrototypeClock(currentMinute: number, deltaSeconds: number): number {
  const advanced = currentMinute + deltaSeconds * PROTOTYPE_MINUTES_PER_REAL_SECOND;
  const span = PROTOTYPE_DAY_END_MINUTE - PROTOTYPE_DAY_START_MINUTE;
  if (span <= 0) return PROTOTYPE_DAY_START_MINUTE;
  return PROTOTYPE_DAY_START_MINUTE + ((advanced - PROTOTYPE_DAY_START_MINUTE) % span + span) % span;
}

export function resolveScheduleEntry(
  schedule: ExplorationNpcScheduleEntry[] | undefined,
  minuteOfDay: number,
): ExplorationNpcScheduleEntry | undefined {
  if (!schedule?.length) return undefined;

  let active = schedule[0];
  for (const entry of schedule) {
    if (entry.minuteOfDay > minuteOfDay) break;
    active = entry;
  }
  return active;
}

export function formatMinuteOfDay(minuteOfDay: number): string {
  const rounded = Math.floor(minuteOfDay);
  const hours = Math.floor(rounded / 60) % 24;
  const minutes = rounded % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
