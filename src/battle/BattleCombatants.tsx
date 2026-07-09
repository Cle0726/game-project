import type { BattleCombatantVisual, BattleSide } from './battleTypes';

interface BattleCombatantsProps {
  combatants: BattleCombatantVisual[];
}

function sideLabel(side: BattleSide) {
  return side === 'ally' ? 'Allied musicarts' : 'Enemy formation';
}

export function BattleCombatants({ combatants }: BattleCombatantsProps) {
  const allies = combatants.filter((combatant) => combatant.side === 'ally');
  const enemies = combatants.filter((combatant) => combatant.side === 'enemy');

  return (
    <section className="battle-combatants" aria-label="Battlefield combatants">
      <CombatantLine side="enemy" combatants={enemies} />
      <CombatantLine side="ally" combatants={allies} />
    </section>
  );
}

interface CombatantLineProps {
  side: BattleSide;
  combatants: BattleCombatantVisual[];
}

function CombatantLine({ side, combatants }: CombatantLineProps) {
  return (
    <div className={`battle-line battle-line--${side}`} aria-label={sideLabel(side)}>
      {combatants.map((combatant) => (
        <figure
          key={combatant.id}
          className={[
            'battle-figure',
            `battle-figure--${side}`,
            combatant.stance ? `battle-figure--${combatant.stance}` : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <img src={combatant.imageSrc} alt={combatant.name} draggable={false} />
          <figcaption>
            <span>{combatant.name}</span>
            {combatant.role ? <small>{combatant.role}</small> : null}
          </figcaption>
          {typeof combatant.hpPercent === 'number' ? (
            <meter min={0} max={100} value={combatant.hpPercent} aria-label={`${combatant.name} vitality`} />
          ) : null}
        </figure>
      ))}
    </div>
  );
}
