/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: moodConfig.ts
   功能: 七种 mood 状态 → 立绘动画参数映射
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

import type { MoodAnimationConfig, MoodState } from './portraitAnimationTypes';

/**
 * 情绪-动作映射表
 *
 * | mood      | 呼吸   | 头部倾角 | 眨眼间隔      | 头发摆动 | 脸红 | 饱和度 |
 * |-----------|--------|----------|---------------|----------|------|--------|
 * | neutral   | 平稳   | 0°       | 2.5–4.5s      | ×1.0     | 否   | 0%     |
 * | warm      | 略快   | +2°      | 2.0–3.5s      | ×1.2     | 是   | +5%    |
 * | tense     | 急促   | -1.5°    | 1.5–2.5s      | ×1.5     | 否   | 0%     |
 * | withdrawn | 浅慢   | -3°      | 3.5–5.5s      | ×0.6     | 否   | -40%   |
 * | playful   | 活泼   | +3°      | 1.8–3.0s      | ×1.8     | 否   | +8%    |
 * | sad       | 沉重   | -2.5°    | 4.0–6.0s      | ×0.5     | 否   | -25%   |
 * | alert     | 紧绷   | -2°      | 1.2–2.0s      | ×1.3     | 否   | +10%   |
 */
export const MOOD_ANIMATION_CONFIG: Record<MoodState, MoodAnimationConfig> = {
  neutral: {
    breathAmplitude: 0.008,
    breathDurationSec: 2.8,
    headTiltDegree: 0,
    blinkIntervalMs: [2500, 4500],
    hairSwaySpeedMultiplier: 1.0,
    showBlush: false,
    saturationAdjust: 0,
  },
  warm: {
    breathAmplitude: 0.012,
    breathDurationSec: 2.4,
    headTiltDegree: 2,
    blinkIntervalMs: [2000, 3500],
    hairSwaySpeedMultiplier: 1.2,
    showBlush: true,
    saturationAdjust: 5,
  },
  tense: {
    breathAmplitude: 0.015,
    breathDurationSec: 2.0,
    headTiltDegree: -1.5,
    blinkIntervalMs: [1500, 2500],
    hairSwaySpeedMultiplier: 1.5,
    showBlush: false,
    saturationAdjust: 0,
  },
  withdrawn: {
    breathAmplitude: 0.006,
    breathDurationSec: 3.6,
    headTiltDegree: -3,
    blinkIntervalMs: [3500, 5500],
    hairSwaySpeedMultiplier: 0.6,
    showBlush: false,
    saturationAdjust: -40,
  },
  playful: {
    breathAmplitude: 0.018,
    breathDurationSec: 1.8,
    headTiltDegree: 3,
    blinkIntervalMs: [1800, 3000],
    hairSwaySpeedMultiplier: 1.8,
    showBlush: false,
    saturationAdjust: 8,
  },
  sad: {
    breathAmplitude: 0.007,
    breathDurationSec: 3.2,
    headTiltDegree: -2.5,
    blinkIntervalMs: [4000, 6000],
    hairSwaySpeedMultiplier: 0.5,
    showBlush: false,
    saturationAdjust: -25,
  },
  alert: {
    breathAmplitude: 0.014,
    breathDurationSec: 2.1,
    headTiltDegree: -2,
    blinkIntervalMs: [1200, 2000],
    hairSwaySpeedMultiplier: 1.3,
    showBlush: false,
    saturationAdjust: 10,
  },
};

export function getMoodConfig(mood: MoodState): MoodAnimationConfig {
  return MOOD_ANIMATION_CONFIG[mood];
}

/** 主线对话等无 mood 数据场景使用的默认配置（仅呼吸 + 眨眼） */
export const NEUTRAL_PORTRAIT_CONFIG = MOOD_ANIMATION_CONFIG.neutral;
