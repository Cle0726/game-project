import type { BattleScreenState } from '../battleTypes';
import { BattleLogPanel } from './BattleLogPanel';
import { SkillButton } from './SkillButton';

interface BattleHUDProps {
  state: BattleScreenState;
  onSelectMusicart?: (musicartId: string) => void;
  onSkill: (skillId: string) => void;
}

export function BattleHUD({ state, onSelectMusicart, onSkill }: BattleHUDProps) {
  const activeMusicart = state.musicarts.find((musicart) => musicart.id === state.activeMusicartId) ?? state.musicarts[0];

  return (
    <section className="battle-hud" aria-label="Battle HUD">
      <header className="battle-hud__topline">
        <div className="battle-hud__enemy-card">
          <p className="battle-hud__label">敌方目标</p>
          <h1>{state.enemy.name}</h1>
          <p>{state.enemy.statusText}</p>
        </div>
        <div className="battle-hud__intent-card">
          <span>下一拍意图</span>
          <strong>{state.enemy.intentText}</strong>
        </div>
      </header>

      <section className="battle-hud__meters" aria-label="Battle resources">
        <BattleMeter label={state.resources.objectiveLabel} value={state.resources.objectivePercent} tone="gold" />
        <BattleMeter label="奏者健康" value={state.resources.conductorHealthPercent} tone="health" />
      </section>

      <BattleLogPanel entries={state.log.slice(-5)} />

      <section className="battle-hud__command" aria-label="Musicart commands">
        <div className="battle-hud__command-header">
          <span>指令谱面</span>
          <strong>{activeMusicart?.name ?? '律者'}</strong>
        </div>
        <div className="battle-hud__switcher" role="tablist" aria-label="律者切换">
          {state.musicarts.slice(0, 2).map((musicart) => (
            <button
              key={musicart.id}
              type="button"
              className={musicart.id === state.activeMusicartId ? 'is-active' : ''}
              onClick={() => onSelectMusicart?.(musicart.id)}
              role="tab"
              aria-selected={musicart.id === state.activeMusicartId}
            >
              <span>{musicart.name}</span>
              <small>{musicart.role}</small>
            </button>
          ))}
        </div>
        <div className="battle-hud__skills">
          {state.skills.map((skill) => (
            <SkillButton key={skill.id} skill={skill} onClick={onSkill} />
          ))}
        </div>
      </section>
    </section>
  );
}

interface BattleMeterProps {
  label: string;
  value: number;
  tone: 'gold' | 'health';
}

function BattleMeter({ label, value, tone }: BattleMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`battle-meter battle-meter--${tone}`}>
      <div className="battle-meter__label">
        <span>{label}</span>
        <strong>{Math.round(clamped)}%</strong>
      </div>
      <div className="battle-meter__track" aria-hidden="true">
        <div className="battle-meter__fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
