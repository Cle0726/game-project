/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: portraitAnimationTypes.ts
   功能: 分层立绘动态系统类型（第二阶段预留）
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

export type MoodState =
  | 'neutral'
  | 'warm'
  | 'tense'
  | 'withdrawn'
  | 'playful'
  | 'sad'
  | 'alert';

export interface MoodAnimationConfig {
  breathAmplitude: number;
  breathDurationSec: number;
  headTiltDegree: number;
  blinkIntervalMs: [number, number];
  hairSwaySpeedMultiplier: number;
  showBlush: boolean;
  saturationAdjust: number;
}

export interface DynamicPortraitProps {
  characterId: string;
  currentMood: MoodState;
  width?: number;
  battleStance?: boolean;
  className?: string;
}

export interface SimplifiedPortraitProps {
  characterId: string;
  width?: number;
}

export interface PortraitHandle {
  setTalking: (isTalking: boolean) => void;
}

export interface PortraitLayerSprites {
  hairBack: import('pixi.js').Sprite;
  bodyBase: import('pixi.js').Sprite;
  eyesOpen: import('pixi.js').Sprite;
  eyesHalf: import('pixi.js').Sprite;
  eyesClosed: import('pixi.js').Sprite;
  mouthClosed: import('pixi.js').Sprite;
  mouthOpen: import('pixi.js').Sprite;
  blushOverlay: import('pixi.js').Sprite | null;
  hairFront: import('pixi.js').Sprite;
  hairFrontWrapper: import('pixi.js').Container;
}
