import React, { useEffect, useRef } from 'react';
import { Application, Assets, Container, Sprite } from 'pixi.js';
import type { PortraitLayerSet, StaticPortraitStackProps } from './portraitTypes';

const DEFAULT_WIDTH = 300;

/**
 * 第一阶段：静态分层立绘拼装。
 * 叠放顺序（底 → 顶）：
 *   hairBack → bodyBase → hairFront → eyesOpen → mouthClosed
 * 所有 Sprite 锚点 (0,0)，仅对整体 Container 做等比缩放。
 */
export const StaticPortraitStack: React.FC<StaticPortraitStackProps> = ({
  layerSet,
  width = DEFAULT_WIDTH,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const displayHeight = width * (layerSet.canvasHeight / layerSet.canvasWidth);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    let app: Application | null = null;
    let cancelled = false;

    const layerPaths: string[] = [
      layerSet.hairBack,
      layerSet.bodyBase,
      layerSet.hairFront,
      layerSet.eyesOpen,
      layerSet.mouthClosed,
    ];

    void (async () => {
      await Assets.load(layerPaths);

      if (cancelled) return;

      const uniformScale = width / layerSet.canvasWidth;

      app = new Application();
      await app.init({
        width,
        height: displayHeight,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (cancelled) {
        app.destroy(true);
        return;
      }

      const stack = new Container();
      stack.scale.set(uniformScale);

      for (const path of layerPaths) {
        const sprite = Sprite.from(path);
        sprite.position.set(0, 0);
        stack.addChild(sprite);
      }

      app.stage.addChild(stack);
      mountEl.appendChild(app.canvas as HTMLCanvasElement);
    })();

    return () => {
      cancelled = true;
      mountEl.replaceChildren();
      app?.destroy(true, { children: true });
      app = null;
    };
  }, [layerSet, width, displayHeight]);

  return (
    <div
      ref={mountRef}
      className="static-portrait-stack"
      style={{
        width,
        height: displayHeight,
        position: 'relative',
        overflow: 'hidden',
      }}
      data-character-id={layerSet.characterId}
    />
  );
};

export type { PortraitLayerSet };
