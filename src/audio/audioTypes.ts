/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: audioTypes.ts
   功能: 定义音频管理系统的所有 TypeScript 接口与类型
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

export interface AudioTrack {
  id: string;
  src: string;              // 音频文件路径 (例如: /audio/bgm/BGM01.mp3)
  volume: number;           // 默认音量基准 (0-1)
  loop: boolean;            // 是否循环播放 (BGM通常为true，SFX为false)
  fadeInMs?: number;        // 淡入时间(毫秒)，用于平滑过渡
  fadeOutMs?: number;       // 淡出时间(毫秒)，用于平滑过渡
}

export interface AudioState {
  bgmVolume: number;        // 全局 BGM 音量乘数，0-1，由用户在设置中控制
  sfxVolume: number;        // 全局 SFX 音量乘数，0-1，由用户在设置中控制
  currentBGM: string | null;// 当前正在播放的 BGM ID，用于 UI 状态回显
  isMuted: boolean;         // 全局静音状态
}
