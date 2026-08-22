export interface SimulationClockConfig {
  startMinute: number;
  endMinute: number;
  minutesPerRealSecond: number;
}

export const DEFAULT_EXPLORATION_CLOCK: Readonly<SimulationClockConfig> = {
  startMinute: 8 * 60,
  endMinute: 20 * 60,
  minutesPerRealSecond: 20,
};

export function advanceSimulationClock(
  currentMinute: number,
  deltaSeconds: number,
  config: SimulationClockConfig = DEFAULT_EXPLORATION_CLOCK,
): number {
  const span = config.endMinute - config.startMinute;
  if (span <= 0) return config.startMinute;

  const advanced = currentMinute + Math.max(0, deltaSeconds) * config.minutesPerRealSecond;
  return (
    config.startMinute +
    (((advanced - config.startMinute) % span) + span) % span
  );
}

export function formatMinuteOfDay(minuteOfDay: number): string {
  const rounded = Math.floor(minuteOfDay);
  const normalized = ((rounded % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
