import { Application, Assets, ColorMatrixFilter, Container, Sprite, Texture } from 'pixi.js';
import { useEffect, useRef } from 'react';
import type { BattleEnemyState } from '../battleTypes';

interface EnemyDisplayProps {
  enemy: BattleEnemyState;
}

export function EnemyDisplay({ enemy }: EnemyDisplayProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Container | null>(null);
  const spriteRef = useRef<Sprite | null>(null);
  const visualStateRef = useRef(enemy.visualState);

  useEffect(() => {
    visualStateRef.current = enemy.visualState;
  }, [enemy.visualState]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const app = new Application();
    let destroyed = false;
    let initialized = false;
    let elapsed = 0;

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
      const texture = await Assets.load<Texture>(enemy.imageSrc).catch(() => Texture.EMPTY);
      const root = new Container();
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      root.addChild(sprite);
      app.stage.addChild(root);
      rootRef.current = root;
      spriteRef.current = sprite;

      app.ticker.add(() => {
        if (!spriteRef.current || !rootRef.current) return;
        const { width, height } = app.renderer;
        elapsed += app.ticker.deltaTime / 60;
        rootRef.current.position.set(width * 0.66, height * 0.38);
        const baseScale = Math.min(width / 1254, height / 1254) * 0.58;
        const defeatedScale = visualStateRef.current === 'defeated' ? 0.9 : 1;
        rootRef.current.scale.set(baseScale * defeatedScale * (1 + Math.sin(elapsed * 2.2) * 0.018));
      });
    })();

    return () => {
      destroyed = true;
      rootRef.current = null;
      spriteRef.current = null;
      if (initialized) {
        app.destroy(true, { children: true });
      }
    };
  }, [enemy.imageSrc]);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;

    if (enemy.visualState === 'hit') {
      const filter = makeEnemyHitFilter();
      sprite.filters = [filter];
      sprite.alpha = 0.78;
      const timeoutId = window.setTimeout(() => {
        if (spriteRef.current === sprite && enemy.visualState === 'hit') {
          sprite.filters = null;
          sprite.alpha = 1;
        }
      }, 150);

      return () => window.clearTimeout(timeoutId);
    }

    if (enemy.visualState === 'defeated') {
      sprite.filters = null;
      sprite.alpha = 0.18;
      return;
    }

    sprite.filters = null;
    sprite.alpha = 1;
  }, [enemy.visualState]);

  return (
    <div ref={mountRef} className={`enemy-display enemy-display--${enemy.visualState}`} aria-hidden="true">
      <img className="enemy-display__fallback" src={enemy.imageSrc} alt="" />
    </div>
  );
}

function makeEnemyHitFilter(): ColorMatrixFilter {
  const filter = new ColorMatrixFilter();
  filter.brightness(1.35, false);
  filter.tint(0xff334c, true);
  return filter;
}
