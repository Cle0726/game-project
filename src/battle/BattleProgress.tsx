interface BattleProgressProps {
  label: string;
  percent: number;
}

export function BattleProgress({ label, percent }: BattleProgressProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <section className="battle-progress" aria-label={label}>
      <div className="battle-progress__label">
        <span>{label}</span>
        <span>{Math.round(clampedPercent)}%</span>
      </div>
      <div className="battle-progress__track" aria-hidden="true">
        <div className="battle-progress__fill" style={{ width: `${clampedPercent}%` }} />
      </div>
    </section>
  );
}
