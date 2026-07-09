import type { CSSProperties, ReactNode } from 'react';
import type { BattleViewState } from './battleTypes';

interface BattleStageProps {
  state: Pick<BattleViewState, 'battlefieldImage' | 'battlefieldTone' | 'phase'>;
  children: ReactNode;
}

export function BattleStage({ state, children }: BattleStageProps) {
  const style = {
    '--battle-stage-image': state.battlefieldImage ? `url("${state.battlefieldImage}")` : 'none',
  } as CSSProperties;

  return (
    <main
      className={`battle-stage battle-stage--${state.battlefieldTone ?? 'theater'} battle-stage--${state.phase}`}
      style={style}
      data-battle-mode="battle"
    >
      <div className="battle-stage__background" aria-hidden="true" />
      <div className="battle-stage__grid" aria-hidden="true" />
      <div className="battle-stage__content">{children}</div>
    </main>
  );
}
