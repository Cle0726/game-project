import type { BattleLogEntry } from './battleTypes';

interface BattleLogProps {
  entries: BattleLogEntry[];
}

export function BattleLog({ entries }: BattleLogProps) {
  return (
    <section className="battle-log" aria-label="Battle log" aria-live="polite">
      {entries.map((entry) => (
        <p key={entry.id} className={`battle-log__entry battle-log__entry--${entry.tone ?? 'normal'}`}>
          {entry.text}
        </p>
      ))}
    </section>
  );
}
