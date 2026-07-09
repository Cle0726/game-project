/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: audioStore.ts
   功能: 基于 Zustand 的音频全局状态管理 (支持 localStorage 持久化)
   说明: 管理全局的音量大小、静音状态。AudioManager 会订阅此 Store，
         UI 层面（如设置面板）也可通过此 Store 读写音量配置。
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AudioState } from './audioTypes';

// 扩展 State 接口，添加修改状态的 Action 方法
interface AudioStore extends AudioState {
  setBGMVolume: (vol: number) => void;
  setSFXVolume: (vol: number) => void;
  setCurrentBGM: (trackId: string | null) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      // --- 初始状态 ---
      bgmVolume: 0.5,
      sfxVolume: 0.8,
      currentBGM: null, // currentBGM 不需要持久化，但 persist 默认存全量。可以用 partialize 过滤
      isMuted: false,

      // --- Actions ---
      setBGMVolume: (vol) => set({ bgmVolume: vol }),
      setSFXVolume: (vol) => set({ sfxVolume: vol }),
      setCurrentBGM: (trackId) => set({ currentBGM: trackId }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted }))
    }),
    {
      name: 'takt-op-audio-settings', // localStorage 的 key
      storage: createJSONStorage(() => localStorage),
      // 只持久化音量和静音设置，不持久化当前播放的背景音乐ID
      partialize: (state) => ({ 
        bgmVolume: state.bgmVolume, 
        sfxVolume: state.sfxVolume, 
        isMuted: state.isMuted 
      }),
    }
  )
);
