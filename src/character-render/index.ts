export { StaticPortraitStack } from './StaticPortraitStack';
export { HUAIXU_PORTRAIT, PORTRAIT_DATA, getPortraitLayerSet } from './portraitData';
export {
  PORTRAIT_ASPECT,
  PORTRAIT_CANVAS,
  PORTRAIT_LAYER_FILES,
  CHARACTER_ASSET_DIR,
} from './portraitCanvasSpec';
export type { PortraitLayerSet, StaticPortraitStackProps } from './portraitTypes';

/* 第二阶段动画模块（暂未启用） */
export { DynamicPortrait } from './DynamicPortrait';
export { SimplifiedPortrait } from './SimplifiedPortrait';
export { MOOD_ANIMATION_CONFIG, getMoodConfig } from './moodConfig';
export { getPortraitLayers, registerPortraitLayers } from './portraitRegistry';
