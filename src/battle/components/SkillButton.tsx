import type { BattleAction } from '../battleTypes';

interface SkillButtonProps {
  skill: BattleAction;
  onClick: (skillId: string) => void;
}

export function SkillButton({ skill, onClick }: SkillButtonProps) {
  return (
    <button
      type="button"
      className={[
        'skill-button',
        skill.danger ? 'skill-button--danger' : '',
        skill.ultimate ? 'skill-button--ultimate' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={skill.disabled}
      onClick={() => onClick(skill.gameActionKey ?? skill.id)}
    >
      <span className="skill-button__sigil" aria-hidden="true">
        {skill.iconLabel}
      </span>
      <span className="skill-button__content">
        <span className="skill-button__name">{skill.label}</span>
        <span className="skill-button__costs" aria-label="Skill costs">
          {typeof skill.actionPointCost === 'number' ? <span>AP {skill.actionPointCost}</span> : null}
          {typeof skill.healthCost === 'number' ? <span>HP {skill.healthCost}</span> : null}
        </span>
        <span className="skill-button__detail">{skill.detail}</span>
      </span>
    </button>
  );
}
