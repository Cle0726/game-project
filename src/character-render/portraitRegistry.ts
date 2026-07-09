/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: portraitRegistry.ts
   功能: 按 characterId 解析分层立绘资源路径
         路径规则：src/assets/characters/{character_id}/{序号_图层名}.png
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

import {
  CHARACTER_ASSET_DIR,
  PORTRAIT_LAYER_FILES,
} from './portraitCanvasSpec';
import type { PortraitLayerSet } from './portraitTypes';

/**
 * Vite 静态资源 glob：构建时收集 src/assets/characters 下所有 PNG，
 * 运行时按 characterId + 文件名解析为带 hash 的 URL。
 */
const portraitUrlGlob = import.meta.glob<string>(
  '../assets/characters/**/*.png',
  { eager: true, query: '?url', import: 'default' },
);

function resolveAssetUrl(characterId: string, filename: string): string {
  const key = `../${CHARACTER_ASSET_DIR}/${characterId}/${filename}`;
  const url = portraitUrlGlob[key];
  if (url) return url;

  // 开发阶段占位：文件尚未放入时返回逻辑路径，Pixi 加载失败后显示空白
  return `/${CHARACTER_ASSET_DIR}/${characterId}/${filename}`;
}

function buildPortraitLayers(characterId: string): PortraitLayerSet {
  const f = PORTRAIT_LAYER_FILES;
  return {
    characterId,
    canvasWidth: 1200,
    canvasHeight: 1600,
    hairBack: resolveAssetUrl(characterId, f.hairBack),
    bodyBase: resolveAssetUrl(characterId, f.bodyBase),
    hairFront: resolveAssetUrl(characterId, f.hairFront),
    eyesOpen: resolveAssetUrl(characterId, f.eyesOpen),
    eyesHalf: resolveAssetUrl(characterId, f.eyesHalf),
    eyesClosed: resolveAssetUrl(characterId, f.eyesClosed),
    mouthClosed: resolveAssetUrl(characterId, f.mouthClosed),
    mouthOpen: resolveAssetUrl(characterId, f.mouthOpen),
    blushOverlay: resolveAssetUrl(characterId, f.blushOverlay),
  };
}

/** 已注册角色；后续可从 JSON / CMS 加载 */
const REGISTRY: Record<string, PortraitLayerSet> = {
  angle: buildPortraitLayers('angle'),
};

export function getPortraitLayers(characterId: string): PortraitLayerSet {
  return REGISTRY[characterId] ?? buildPortraitLayers(characterId);
}

export function registerPortraitLayers(layers: PortraitLayerSet): void {
  REGISTRY[layers.characterId] = layers;
}
