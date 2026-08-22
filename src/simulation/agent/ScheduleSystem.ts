export interface ScheduleEntryLike {
  minuteOfDay: number;
}

export function resolveScheduleEntry<TEntry extends ScheduleEntryLike>(
  schedule: readonly TEntry[] | undefined,
  minuteOfDay: number,
): TEntry | undefined {
  if (!schedule?.length) return undefined;

  let active = schedule[0];
  for (const entry of schedule) {
    if (entry.minuteOfDay > minuteOfDay) break;
    active = entry;
  }
  return active;
}

export function getNextScheduleEntry<TEntry extends ScheduleEntryLike>(
  schedule: readonly TEntry[] | undefined,
  minuteOfDay: number,
): TEntry | undefined {
  if (!schedule?.length) return undefined;
  return schedule.find((entry) => entry.minuteOfDay > minuteOfDay) ?? schedule[0];
}
