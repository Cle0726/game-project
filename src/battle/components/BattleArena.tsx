import { Application, Container, Graphics } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { DynamicPortrait } from '../../character-render';
import type { MoodState } from '../../character-render/portraitAnimationTypes';
import type { BattleMusicartState, BattleScreenState } from '../battleTypes';
import { EnemyDisplay } from './EnemyDisplay';

interface BattleArenaProps {
  state: BattleScreenState;
}

export function BattleArena({ state }: BattleArenaProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const musicarts = state.musicarts.slice(0, 2);

  useEffect(() => {
    const mount = stageRef.current;
    if (!mount) return;

    const app = new Application();
    let destroyed = false;
    let initialized = false;
    let resizeObserver: ResizeObserver | null = null;
    let tick: (() => void) | null = null;

    void (async () => {
      await app.init({
        resizeTo: mount,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });
      initialized = true;

      if (destroyed) {
        app.destroy(true);
        return;
      }

      mount.appendChild(app.canvas as HTMLCanvasElement);

      const root = new Container();
      const floor = new Graphics();
      const spotlight = new Graphics();
      const staffLines = new Graphics();
      const particles = new Graphics();
      root.addChild(spotlight, floor, staffLines, particles);
      app.stage.addChild(root);

      let time = 0;

      const draw = () => {
        const { width, height } = app.renderer;
        spotlight.clear();
        floor.clear();
        staffLines.clear();
        particles.clear();

        spotlight.rect(0, 0, width, height).fill(0x080a10);
        spotlight.circle(width * 0.52, height * 0.34, Math.max(width, height) * 0.52).fill({
          color: 0xc49a45,
          alpha: 0.18,
        });
        spotlight.circle(width * 0.52, height * 0.34, Math.max(width, height) * 0.34).fill({
          color: 0xf1e6c6,
          alpha: 0.12,
        });
        spotlight.rect(0, 0, width, height).fill({ color: 0x050609, alpha: 0.36 });

        const horizon = height * 0.62;
        floor.poly([0, height, width, height, width * 0.72, horizon, width * 0.28, horizon]).fill({
          color: 0x111827,
          alpha: 0.76,
        });
        floor
          .moveTo(width * 0.28, horizon)
          .lineTo(width * 0.72, horizon)
          .stroke({ color: 0xc49a45, alpha: 0.42, width: 2 });

        for (let i = 0; i < 9; i += 1) {
          const y = horizon + i * 26;
          staffLines
            .moveTo(width * 0.22 - i * 34, y)
            .lineTo(width * 0.78 + i * 34, y)
            .stroke({ color: 0xe8e0cc, alpha: 0.08, width: 1 });
        }

        for (let i = 0; i < 34; i += 1) {
          const x = ((i * 97 + time * 14) % (width + 80)) - 40;
          const y = height * (0.18 + ((i * 37) % 64) / 100);
          particles.circle(x, y, 1 + (i % 3)).fill({ color: 0xe3c06a, alpha: 0.12 + (i % 4) * 0.03 });
        }
      };

      tick = () => {
        time += app.ticker.deltaTime / 60;
        draw();
      };

      resizeObserver = new ResizeObserver(draw);
      resizeObserver.observe(mount);
      app.ticker.add(tick);
      draw();
    })();

    return () => {
      destroyed = true;
      resizeObserver?.disconnect();
      if (tick) app.ticker.remove(tick);
      if (initialized) {
        app.destroy(true, { children: true });
      }
    };
  }, []);

  return (
    <section className="battle-arena" aria-label="Battlefield">
      <div ref={stageRef} className="battle-arena__pixi-stage" aria-hidden="true" />
      <EnemyDisplay enemy={state.enemy} />
      <div className="battle-arena__musicarts" aria-label="Deployed musicarts">
        {musicarts.map((musicart, index) => (
          <BattlePortrait
            key={musicart.id}
            musicart={musicart}
            conductorHealthPercent={state.resources.conductorHealthPercent}
            enemyHpPercent={state.enemy.hpPercent}
            side={index === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </section>
  );
}

interface BattlePortraitProps {
  musicart: BattleMusicartState;
  conductorHealthPercent: number;
  enemyHpPercent: number;
  side: 'left' | 'right';
}

function BattlePortrait({
  musicart,
  conductorHealthPercent,
  enemyHpPercent,
  side,
}: BattlePortraitProps) {
  const [celebrationCueId, setCelebrationCueId] = useState<string | null>(null);

  useEffect(() => {
    if (musicart.moodCue !== 'highDamage' || !musicart.moodCueId) return;

    setCelebrationCueId(musicart.moodCueId);
    const timeoutId = window.setTimeout(() => {
      setCelebrationCueId((current) => (current === musicart.moodCueId ? null : current));
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [musicart.moodCue, musicart.moodCueId]);

  const mood = resolveBattleMood(
    musicart,
    conductorHealthPercent,
    enemyHpPercent,
    celebrationCueId === musicart.moodCueId,
  );

  return (
    <figure className={`battle-arena__portrait battle-arena__portrait--${side}`}>
      <DynamicPortrait
        characterId={musicart.characterId}
        currentMood={mood}
        width={360}
        battleStance
        className="battle-arena__dynamic-portrait"
      />
      {musicart.fallbackImageSrc ? (
        <img className="battle-arena__portrait-fallback" src={musicart.fallbackImageSrc} alt="" aria-hidden="true" />
      ) : null}
      <figcaption>
        <span>{musicart.name}</span>
        <small>{musicart.role}</small>
      </figcaption>
    </figure>
  );
}

function resolveBattleMood(
  musicart: BattleMusicartState,
  conductorHealthPercent: number,
  enemyHpPercent: number,
  isCelebratingHighDamage: boolean,
): MoodState {
  if (musicart.moodCue === 'dissonance') return 'alert';
  if (isCelebratingHighDamage) return 'playful';
  if (enemyHpPercent < 20) return 'warm';
  if (conductorHealthPercent < 30) return 'withdrawn';
  if (conductorHealthPercent <= 60) return 'tense';
  return 'neutral';
}
