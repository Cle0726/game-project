import { useLayoutEffect, useRef } from 'react';
import { createBattleEnterTransition } from '../transitions/battleEnterTransition';
import { createBattleExitTransition } from '../transitions/battleExitTransition';
import { BattleArena } from './BattleArena';
import { BattleHUD } from './BattleHUD';
import type { BattleScreenProps } from '../battleTypes';
import './BattleScreen.css';

export function BattleScreen({
  gamePhase = 'battle',
  state,
  onSelectMusicart,
  onSkill,
}: BattleScreenProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (gamePhase !== 'battle') return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const timeline = state.phase === 'entering'
      ? createBattleEnterTransition(root)
      : state.phase === 'leaving'
        ? createBattleExitTransition(root)
        : null;

    return () => {
      timeline?.progress(1).kill();
    };
  }, [gamePhase, state.phase]);

  if (gamePhase !== 'battle') {
    return null;
  }

  const variant = state.variant ?? 'standard';

  return (
    <main ref={rootRef} className={`battle-screen battle-screen--${state.phase} battle-screen--${variant}`} data-game-phase="battle">
      <BattleArena state={state} />
      <BattleHUD state={state} onSelectMusicart={onSelectMusicart} onSkill={onSkill} />
      <div className="battle-transition-layer" aria-hidden="true">
        <div className="battle-transition-curtain battle-transition-curtain--top" />
        <div className="battle-transition-curtain battle-transition-curtain--bottom" />
        <div className="battle-transition-spotlight" />
        <div className="battle-transition-title">BATTLE MODE</div>
      </div>
    </main>
  );
}
