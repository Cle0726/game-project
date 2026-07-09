/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: portraitTypes.ts
   功能: 分层立绘系统 — 类型定义（第一阶段：静态拼装）
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * 单个角色的完整图层路径集。
 * 所有 PNG 均为同一画布尺寸，代码侧统一 (0,0) 叠放。
 */
export interface PortraitLayerSet {
  characterId: string;
  canvasWidth: number;
  canvasHeight: number;
  hairBack: string;
  bodyBase: string;
  hairFront: string;
  eyesOpen: string;
  eyesHalf: string;
  eyesClosed: string;
  mouthClosed: string;
  mouthOpen: string;
  blushOverlay?: string;
}

export interface StaticPortraitStackProps {
  layerSet: PortraitLayerSet;
  /** 显示宽度（px），高度按 canvas 比例缩放，默认 300 */
  width?: number;
}

/** @deprecated 第二阶段动画模块使用，别名保留兼容 */
export type PortraitLayers = PortraitLayerSet;
