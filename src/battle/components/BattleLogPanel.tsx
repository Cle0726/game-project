import type { BattleLogEntry } from '../battleTypes';

interface BattleLogPanelProps {
  entries: BattleLogEntry[];
}

export function BattleLogPanel({ entries }: BattleLogPanelProps) {
  return (
    <section className="battle-log-panel" aria-label="Battle log" aria-live="polite">
      {entries.map((entry) => (
        <article key={entry.id} className={`battle-log-panel__entry battle-log-panel__entry--${entry.tone ?? 'normal'}`}>
          {entry.text}
        </article>
      ))}
    </section>
  );
}
