/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: sfxLibrary.ts
   功能: 定义游戏内所有的交互音效 (SFX) 资产清单
   说明: 包含 UI 点击、变量变化提示、场景过渡、独演触发及失调警告等音效
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

import { AudioTrack } from './audioTypes';

export const SFX_TRACKS: Record<string, AudioTrack> = {
  // SFX01: 按钮悬停/点击 - 轻巧的竖琴单音或钢片琴音
  SFX01: {
    id: 'SFX01',
    src: '/audio/sfx/SFX01.mp3',
    volume: 0.8,
    loop: false
  },
  // SFX02_POSITIVE: 变量变化提示音(正面) - 清脆上行音阶
  SFX02_POSITIVE: {
    id: 'SFX02_POSITIVE',
    src: '/audio/sfx/SFX02_POSITIVE.mp3',
    volume: 0.7,
    loop: false
  },
  // SFX02_NEGATIVE: 变量变化提示音(负面) - 低沉下行音
  SFX02_NEGATIVE: {
    id: 'SFX02_NEGATIVE',
    src: '/audio/sfx/SFX02_NEGATIVE.mp3',
    volume: 0.7,
    loop: false
  },
  // SFX03: 场景过渡 - 类似翻页/拉幕的弦乐滑音
  SFX03: {
    id: 'SFX03',
    src: '/audio/sfx/SFX03.mp3',
    volume: 0.9,
    loop: false
  },
  // SFX04: 独演触发 - 短促的全乐团齐奏撞击音，高光时刻信号
  SFX04: {
    id: 'SFX04',
    src: '/audio/sfx/SFX04.mp3',
    volume: 1.0,
    loop: false
  },
  // SFX05_DYSREGULATION: 失调触发 - 短促、故意"抢拍"的强音（配合Tone.js使用）
  SFX05_DYSREGULATION: {
    id: 'SFX05_DYSREGULATION',
    src: '/audio/sfx/SFX05_DYSREGULATION.mp3',
    volume: 1.0,
    loop: false
  }
};
