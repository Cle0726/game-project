import type { BattleAction } from './battleTypes';

interface BattleActionBarProps {
  actions: BattleAction[];
  onAction: (actionId: string) => void;
}

export function BattleActionBar({ actions, onAction }: BattleActionBarProps) {
  return (
    <nav className="battle-actions" aria-label="Battle actions">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={[
            'battle-action',
            action.danger ? 'battle-action--danger' : '',
            action.ultimate ? 'battle-action--ultimate' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={action.disabled}
          onClick={() => onAction(action.id)}
        >
          <span className="battle-action__icon" aria-hidden="true">
            {action.iconLabel}
          </span>
          <span className="battle-action__body">
            <span className="battle-action__label">{action.label}</span>
            <span className="battle-action__detail">{action.detail}</span>
          </span>
        </button>
      ))}
    </nav>
  );
}
