import type { BattleLogEntry } from '../battleTypes';

interface BattleLogPanelProps {
  entries: BattleLogEntry[];
}

export function BattleLogPanel({ entries }: BattleLogPanelProps) {
  return (
    <section className="battle-log-panel" aria-label="Battle log" aria-live="polite">
      <header className="battle-log-panel__header">
        <span>战斗记录</span>
        <small>最近 {entries.length} 条</small>
      </header>
      {entries.map((entry) => (
        <article key={entry.id} className={`battle-log-panel__entry battle-log-panel__entry--${entry.tone ?? 'normal'}`}>
          {entry.text}
        </article>
      ))}
    </section>
  );
}
