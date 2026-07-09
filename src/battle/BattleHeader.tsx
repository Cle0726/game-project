interface BattleHeaderProps {
  title: string;
  enemyStatus: string;
}

export function BattleHeader({ title, enemyStatus }: BattleHeaderProps) {
  return (
    <header className="battle-header" aria-labelledby="battle-title">
      <div>
        <p className="battle-header__kicker">TACTICAL SCORE</p>
        <h1 id="battle-title" className="battle-header__title">
          {title}
        </h1>
      </div>
      <p className="battle-header__status">{enemyStatus}</p>
    </header>
  );
}
