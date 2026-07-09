/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: portraitAnimation.ts
   功能: 立绘 Pixi 层的加载、显隐切换与 GSAP / 定时器动画逻辑
         统一画布规格：所有图层 (0,0) 叠放，不做 per-layer 偏移
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import {
  Application,
  Assets,
  ColorMatrixFilter,
  Container,
  Sprite,
  Texture,
} from 'pixi.js';
import {
  HAIR_SWAY_PIVOT,
  PORTRAIT_ASPECT,
  PORTRAIT_CANVAS,
} from './portraitCanvasSpec';
import { getMoodConfig } from './moodConfig';
import { getPortraitLayers } from './portraitRegistry';
import type {
  MoodAnimationConfig,
  MoodState,
  PortraitLayerSprites,
} from './portraitAnimationTypes';
import type { PortraitLayerSet } from './portraitTypes';

const DEG = Math.PI / 180;
const HAIR_SWAY_DEG = 1.5;
const DEFAULT_DISPLAY_WIDTH = 300;

export interface PortraitRuntime {
  app: Application;
  root: Container;
  layers: PortraitLayerSprites;
  colorFilter: ColorMatrixFilter | null;
  breathTween: gsap.core.Tween | null;
  headTiltTween: gsap.core.Tween | null;
  blushTween: gsap.core.Tween | null;
  blinkTimeoutId: ReturnType<typeof setTimeout> | null;
  talkTimeoutId: ReturnType<typeof setTimeout> | null;
  hairSwayTick: (() => void) | null;
  hairSwayPhase: number;
  currentMood: MoodState;
  isTalking: boolean;
  disposed: boolean;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function setEyeState(layers: PortraitLayerSprites, state: 'open' | 'half' | 'closed'): void {
  layers.eyesOpen.visible = state === 'open';
  layers.eyesHalf.visible = state === 'half';
  layers.eyesClosed.visible = state === 'closed';
}

function setMouthState(layers: PortraitLayerSprites, open: boolean): void {
  layers.mouthClosed.visible = !open;
  layers.mouthOpen.visible = open;
}

function resolveCanvasSize(layerPaths: PortraitLayerSet): { width: number; height: number } {
  return {
    width: layerPaths.canvasWidth || PORTRAIT_CANVAS.width,
    height: layerPaths.canvasHeight || PORTRAIT_CANVAS.height,
  };
}

function calcDisplayMetrics(sourceWidth: number, sourceHeight: number, displayWidth: number) {
  const scale = displayWidth / sourceWidth;
  return {
    displayWidth,
    displayHeight: displayWidth * (sourceHeight / sourceWidth),
    uniformScale: scale,
  };
}

/** 统一画布图层：固定 (0,0)，不做裁剪对齐计算 */
function makeAlignedSprite(path: string): Sprite {
  const texture = Assets.get<Texture>(path) ?? Texture.EMPTY;
  const sprite = new Sprite(texture);
  sprite.position.set(0, 0);
  return sprite;
}

export async function createPortraitRuntime(
  characterId: string,
  displayWidth: number = DEFAULT_DISPLAY_WIDTH,
  mountEl?: HTMLElement,
): Promise<PortraitRuntime> {
  const layerPaths = getPortraitLayers(characterId);
  const { width: canvasWidth, height: canvasHeight } = resolveCanvasSize(layerPaths);
  const { displayHeight, uniformScale } = calcDisplayMetrics(
    canvasWidth,
    canvasHeight,
    displayWidth,
  );

  const paths = [
    layerPaths.hairBack,
    layerPaths.bodyBase,
    layerPaths.eyesOpen,
    layerPaths.eyesHalf,
    layerPaths.eyesClosed,
    layerPaths.mouthClosed,
    layerPaths.mouthOpen,
    layerPaths.hairFront,
  ];
  if (layerPaths.blushOverlay) {
    paths.push(layerPaths.blushOverlay);
  }

  await Promise.all(paths.map((p) => Assets.load<Texture>(p).catch(() => Texture.EMPTY)));

  const app = new Application();
  await app.init({
    width: displayWidth,
    height: displayHeight,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  if (mountEl) {
    mountEl.appendChild(app.canvas as HTMLCanvasElement);
  }

  const root = new Container();
  app.stage.addChild(root);

  const layersContainer = new Container();
  layersContainer.scale.set(uniformScale);

  const hairFrontSprite = makeAlignedSprite(layerPaths.hairFront);
  const hairFrontWrapper = new Container();
  hairFrontWrapper.pivot.set(HAIR_SWAY_PIVOT.x, HAIR_SWAY_PIVOT.y);
  hairFrontWrapper.position.set(HAIR_SWAY_PIVOT.x, HAIR_SWAY_PIVOT.y);
  hairFrontWrapper.addChild(hairFrontSprite);

  const layers: PortraitLayerSprites = {
    hairBack: makeAlignedSprite(layerPaths.hairBack),
    bodyBase: makeAlignedSprite(layerPaths.bodyBase),
    eyesOpen: makeAlignedSprite(layerPaths.eyesOpen),
    eyesHalf: makeAlignedSprite(layerPaths.eyesHalf),
    eyesClosed: makeAlignedSprite(layerPaths.eyesClosed),
    mouthClosed: makeAlignedSprite(layerPaths.mouthClosed),
    mouthOpen: makeAlignedSprite(layerPaths.mouthOpen),
    blushOverlay: layerPaths.blushOverlay
      ? makeAlignedSprite(layerPaths.blushOverlay)
      : null,
    hairFront: hairFrontSprite,
    hairFrontWrapper,
  };

  // 叠放顺序：hairBack → bodyBase → 眼/嘴 → blush → hairFront
  layersContainer.addChild(layers.hairBack);
  layersContainer.addChild(layers.bodyBase);
  layersContainer.addChild(
    layers.eyesOpen,
    layers.eyesHalf,
    layers.eyesClosed,
    layers.mouthClosed,
    layers.mouthOpen,
  );
  if (layers.blushOverlay) {
    layers.blushOverlay.alpha = 0;
    layersContainer.addChild(layers.blushOverlay);
  }
  layersContainer.addChild(hairFrontWrapper);

  root.addChild(layersContainer);

  setEyeState(layers, 'open');
  setMouthState(layers, false);

  root.pivot.set(displayWidth / 2, displayHeight / 2);
  root.position.set(displayWidth / 2, displayHeight / 2);

  return {
    app,
    root,
    layers,
    colorFilter: null,
    breathTween: null,
    headTiltTween: null,
    blushTween: null,
    blinkTimeoutId: null,
    talkTimeoutId: null,
    hairSwayTick: null,
    hairSwayPhase: 0,
    currentMood: 'neutral',
    isTalking: false,
    disposed: false,
  };
}

function clearBlinkTimer(runtime: PortraitRuntime): void {
  if (runtime.blinkTimeoutId !== null) {
    clearTimeout(runtime.blinkTimeoutId);
    runtime.blinkTimeoutId = null;
  }
}

function clearTalkInterval(runtime: PortraitRuntime): void {
  if (runtime.talkTimeoutId !== null) {
    clearTimeout(runtime.talkTimeoutId);
    runtime.talkTimeoutId = null;
  }
}

function startTalkLoop(runtime: PortraitRuntime): void {
  let mouthOpen = false;

  const tick = () => {
    if (runtime.disposed || !runtime.isTalking) return;
    mouthOpen = !mouthOpen;
    setMouthState(runtime.layers, mouthOpen);
    runtime.talkTimeoutId = setTimeout(tick, randomBetween(150, 250));
  };

  tick();
}

function scheduleBlink(runtime: PortraitRuntime, config: MoodAnimationConfig): void {
  if (runtime.disposed) return;

  const delay = randomBetween(config.blinkIntervalMs[0], config.blinkIntervalMs[1]);
  runtime.blinkTimeoutId = setTimeout(() => {
    if (runtime.disposed) return;
    runBlinkSequence(runtime, config);
  }, delay);
}

function runBlinkSequence(runtime: PortraitRuntime, config: MoodAnimationConfig): void {
  if (runtime.disposed) return;

  const { layers } = runtime;
  setEyeState(layers, 'half');

  setTimeout(() => {
    if (runtime.disposed) return;
    setEyeState(layers, 'closed');

    setTimeout(() => {
      if (runtime.disposed) return;
      setEyeState(layers, 'half');

      setTimeout(() => {
        if (runtime.disposed) return;
        setEyeState(layers, 'open');
        scheduleBlink(runtime, config);
      }, 80);
    }, 60);
  }, 80);
}

function applyBreathAnimation(runtime: PortraitRuntime, config: MoodAnimationConfig): void {
  runtime.breathTween?.kill();
  runtime.root.scale.set(1, 1);

  runtime.breathTween = gsap.to(runtime.root.scale, {
    y: 1 + config.breathAmplitude,
    duration: config.breathDurationSec / 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

function applyHeadTilt(runtime: PortraitRuntime, config: MoodAnimationConfig): void {
  runtime.headTiltTween?.kill();
  runtime.headTiltTween = gsap.to(runtime.root, {
    rotation: config.headTiltDegree * DEG,
    duration: 0.6,
    ease: 'power2.out',
  });
}

function applySaturation(runtime: PortraitRuntime, config: MoodAnimationConfig): void {
  if (config.saturationAdjust === 0) {
    runtime.root.filters = null;
    runtime.colorFilter = null;
    return;
  }

  if (!runtime.colorFilter) {
    runtime.colorFilter = new ColorMatrixFilter();
  }

  const sat = Math.max(0, 1 + config.saturationAdjust / 100);
  runtime.colorFilter.saturate(sat, false);
  runtime.root.filters = [runtime.colorFilter];
}

function applyBlush(runtime: PortraitRuntime, config: MoodAnimationConfig, prevShowBlush: boolean): void {
  const blush = runtime.layers.blushOverlay;
  if (!blush) return;

  runtime.blushTween?.kill();

  if (config.showBlush) {
    runtime.blushTween = gsap.to(blush, {
      alpha: 0.4,
      duration: 0.4,
      ease: 'power1.out',
    });
  } else if (prevShowBlush) {
    runtime.blushTween = gsap.to(blush, {
      alpha: 0,
      duration: 0.4,
      ease: 'power1.in',
    });
  } else {
    blush.alpha = 0;
  }
}

function applyHairSway(runtime: PortraitRuntime, config: MoodAnimationConfig): void {
  if (runtime.hairSwayTick) {
    runtime.app.ticker.remove(runtime.hairSwayTick);
    runtime.hairSwayTick = null;
  }

  runtime.hairSwayPhase = 0;
  const wrapper = runtime.layers.hairFrontWrapper;
  const multiplier = config.hairSwaySpeedMultiplier;

  runtime.hairSwayTick = () => {
    runtime.hairSwayPhase += 0.02 * multiplier;
    wrapper.rotation = Math.sin(runtime.hairSwayPhase) * HAIR_SWAY_DEG * DEG;
  };
  runtime.app.ticker.add(runtime.hairSwayTick);
}

export function applyMoodAnimation(
  runtime: PortraitRuntime,
  mood: MoodState,
  options?: { skipBlushTransition?: boolean },
): void {
  const prevConfig = getMoodConfig(runtime.currentMood);
  const config = getMoodConfig(mood);
  runtime.currentMood = mood;

  applyBreathAnimation(runtime, config);
  applyHeadTilt(runtime, config);
  applySaturation(runtime, config);
  applyHairSway(runtime, config);

  if (!options?.skipBlushTransition) {
    applyBlush(runtime, config, prevConfig.showBlush);
  }

  clearBlinkTimer(runtime);
  if (!runtime.isTalking) {
    scheduleBlink(runtime, config);
  }
}

export function setPortraitTalking(runtime: PortraitRuntime, isTalking: boolean): void {
  if (runtime.isTalking === isTalking) return;

  runtime.isTalking = isTalking;
  const config = getMoodConfig(runtime.currentMood);

  if (isTalking) {
    clearBlinkTimer(runtime);
    setEyeState(runtime.layers, 'open');
    clearTalkInterval(runtime);
    startTalkLoop(runtime);
  } else {
    clearTalkInterval(runtime);
    setMouthState(runtime.layers, false);
    scheduleBlink(runtime, config);
  }
}

export function disposePortraitRuntime(runtime: PortraitRuntime): void {
  runtime.disposed = true;
  clearBlinkTimer(runtime);
  clearTalkInterval(runtime);

  runtime.breathTween?.kill();
  runtime.headTiltTween?.kill();
  runtime.blushTween?.kill();

  if (runtime.hairSwayTick) {
    runtime.app.ticker.remove(runtime.hairSwayTick);
  }

  runtime.app.destroy(true, { children: true });
}

export function applyNeutralIdleAnimation(runtime: PortraitRuntime): void {
  applyMoodAnimation(runtime, 'neutral');
}

/** 由渲染宽度推算显示高度（3:4 画布） */
export function calcPortraitDisplayHeight(displayWidth: number): number {
  return displayWidth / PORTRAIT_ASPECT;
}

export type { PortraitLayerSet as PortraitLayers };
