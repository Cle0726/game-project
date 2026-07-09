/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: portraitCanvasSpec.ts
   功能: 立绘图层制作规格 — 统一画布尺寸与文件命名约定
   ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * 【核心规则】所有图层导出为同一完整画布尺寸，内容区域外全部透明。
 * 代码侧各层 Sprite 统一叠放在 (0, 0)，无需 per-layer 偏移坐标。
 *
 * 验收标准（Photopea / PS）：
 *   1. 按编号顺序叠加所有图层，应像素级还原完整立绘，无错位、无露白
 *   2. eyes_open / eyes_half / eyes_closed 切换时瞳孔水平位置不得跳动
 *
 * 文件夹：public/assets/characters/{character_id}/
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */

/** 标准立绘画布尺寸（所有图层必须与此一致） */
export const PORTRAIT_CANVAS = {
  width: 1200,
  height: 1600,
} as const;

/** 宽高比，用于 UI 渲染区域计算 */
export const PORTRAIT_ASPECT = PORTRAIT_CANVAS.width / PORTRAIT_CANVAS.height;

/**
 * 图层文件名（带序号，方便外包按顺序交付）
 *
 * 叠放顺序（底 → 顶）与编号无关，以渲染逻辑为准：
 *   hairBack → bodyBase → eyes → mouth → blush → hairFront
 */
export const PORTRAIT_LAYER_FILES = {
  hairBack: '01_hair_back.png',
  bodyBase: '02_body_base.png',
  hairFront: '03_hair_front.png',
  eyesOpen: '04_eyes_open.png',
  eyesHalf: '05_eyes_half.png',
  eyesClosed: '06_eyes_closed.png',
  mouthClosed: '07_mouth_closed.png',
  mouthOpen: '07_mouth_open.png',
  blushOverlay: '08_blush_overlay.png',
} as const;

/** 资源根目录（Vite public 目录，URL 前缀 /assets/characters） */
export const CHARACTER_ASSET_DIR = 'assets/characters';

/** 头发前层摆动枢轴（源画布像素，统一画布下所有角色通用） */
export const HAIR_SWAY_PIVOT = {
  x: PORTRAIT_CANVAS.width / 2,
  y: PORTRAIT_CANVAS.height * 0.12,
} as const;

export type PortraitLayerFileKey = keyof typeof PORTRAIT_LAYER_FILES;
