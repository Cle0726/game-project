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

    let destroyed = false;
    let resizeObserver: ResizeObserver | null = null;
    let animationFrame = 0;
    let time = 0;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.setAttribute('aria-hidden', 'true');
    mount.appendChild(canvas);

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = () => {
      if (destroyed || !context) return;

      const width = mount.clientWidth;
      const height = mount.clientHeight;
      context.clearRect(0, 0, width, height);

      context.fillStyle = '#080a10';
      context.fillRect(0, 0, width, height);

      const warmLight = context.createRadialGradient(width * 0.52, height * 0.34, 0, width * 0.52, height * 0.34, Math.max(width, height) * 0.52);
      warmLight.addColorStop(0, 'rgba(241, 230, 198, 0.12)');
      warmLight.addColorStop(0.58, 'rgba(196, 154, 69, 0.16)');
      warmLight.addColorStop(1, 'rgba(196, 154, 69, 0)');
      context.fillStyle = warmLight;
      context.fillRect(0, 0, width, height);

      context.fillStyle = 'rgba(5, 6, 9, 0.36)';
      context.fillRect(0, 0, width, height);

      const horizon = height * 0.62;
      context.beginPath();
      context.moveTo(0, height);
      context.lineTo(width, height);
      context.lineTo(width * 0.72, horizon);
      context.lineTo(width * 0.28, horizon);
      context.closePath();
      context.fillStyle = 'rgba(17, 24, 39, 0.76)';
      context.fill();

      context.strokeStyle = 'rgba(196, 154, 69, 0.42)';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(width * 0.28, horizon);
      context.lineTo(width * 0.72, horizon);
      context.stroke();

      context.strokeStyle = 'rgba(232, 224, 204, 0.08)';
      context.lineWidth = 1;
      for (let index = 0; index < 9; index += 1) {
        const y = horizon + index * 26;
        context.beginPath();
        context.moveTo(width * 0.22 - index * 34, y);
        context.lineTo(width * 0.78 + index * 34, y);
        context.stroke();
      }

      for (let index = 0; index < 34; index += 1) {
        const x = ((index * 97 + time * 14) % (width + 80)) - 40;
        const y = height * (0.18 + ((index * 37) % 64) / 100);
        context.beginPath();
        context.arc(x, y, 1 + (index % 3), 0, Math.PI * 2);
        context.fillStyle = `rgba(227, 192, 106, ${0.12 + (index % 4) * 0.03})`;
        context.fill();
      }
    };

    const tick = () => {
      time += 1 / 60;
      draw();
      animationFrame = window.requestAnimationFrame(tick);
    };

    resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(mount);
    resize();
    tick();

    return () => {
      destroyed = true;
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(animationFrame);
      canvas.remove();
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
