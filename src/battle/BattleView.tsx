import { BattleActionBar } from './BattleActionBar';
import { BattleCombatants } from './BattleCombatants';
import { BattleHeader } from './BattleHeader';
import { BattleLog } from './BattleLog';
import { BattleProgress } from './BattleProgress';
import { BattleStage } from './BattleStage';
import { BattleTransitionOverlay } from './BattleTransitionOverlay';
import type { BattleViewProps } from './battleTypes';
import './BattleView.css';

export function BattleView({ state, onAction }: BattleViewProps) {
  return (
    <BattleStage state={state}>
      <BattleTransitionOverlay phase={state.phase} />
      <BattleHeader title={state.title} enemyStatus={state.enemyStatus} />
      <BattleProgress label={state.progressLabel} percent={state.progressPercent} />
      <BattleCombatants combatants={state.combatants} />
      <BattleLog entries={state.log} />
      <BattleActionBar actions={state.actions} onAction={onAction} />
    </BattleStage>
  );
}
