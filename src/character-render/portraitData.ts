/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: portraitData.ts
   功能: 角色立绘图层数据（路径约定 + 测试基准角色）
   ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * 资源放置位置（Vite public 目录）：
 *   public/assets/characters/{characterId}/01_hair_back.png
 *   public/assets/characters/{characterId}/02_body_base.png
 *   ……（见 portraitCanvasSpec.ts）
 *
 * 访问 URL：/assets/characters/{characterId}/{filename}
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */

import { PORTRAIT_CANVAS, PORTRAIT_LAYER_FILES } from './portraitCanvasSpec';
import type { PortraitLayerSet } from './portraitTypes';

function buildLayerSet(characterId: string): PortraitLayerSet {
  const base = `/assets/characters/${characterId}`;
  const f = PORTRAIT_LAYER_FILES;

  return {
    characterId,
    canvasWidth: PORTRAIT_CANVAS.width,
    canvasHeight: PORTRAIT_CANVAS.height,
    hairBack: `${base}/${f.hairBack}`,
    bodyBase: `${base}/${f.bodyBase}`,
    hairFront: `${base}/${f.hairFront}`,
    eyesOpen: `${base}/${f.eyesOpen}`,
    eyesHalf: `${base}/${f.eyesHalf}`,
    eyesClosed: `${base}/${f.eyesClosed}`,
    mouthClosed: `${base}/${f.mouthClosed}`,
    mouthOpen: `${base}/${f.mouthOpen}`,
    blushOverlay: `${base}/${f.blushOverlay}`,
  };
}

/** 槐序 — 静态叠层测试基准角色 */
export const HUAIXU_PORTRAIT: PortraitLayerSet = buildLayerSet('huaixu');

/** 按 characterId 查找（后续扩展更多角色） */
export const PORTRAIT_DATA: Record<string, PortraitLayerSet> = {
  huaixu: HUAIXU_PORTRAIT,
};

export function getPortraitLayerSet(characterId: string): PortraitLayerSet {
  return PORTRAIT_DATA[characterId] ?? buildLayerSet(characterId);
}
