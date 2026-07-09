import type { BattlePhase } from './battleTypes';

interface BattleTransitionOverlayProps {
  phase: BattlePhase;
}

export function BattleTransitionOverlay({ phase }: BattleTransitionOverlayProps) {
  if (phase !== 'entering' && phase !== 'leaving') {
    return null;
  }

  return (
    <div className={`battle-transition battle-transition--${phase}`} aria-hidden="true">
      <div className="battle-transition__bar" />
      <div className="battle-transition__title">{phase === 'entering' ? 'BATTLE MODE' : 'SCENE MODE'}</div>
    </div>
  );
}
