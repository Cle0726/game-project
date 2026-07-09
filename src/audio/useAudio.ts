/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: useAudio.ts
   功能: 提供给 React 组件使用的自定义 Hook
   说明: 将 AudioManager 的指令方法与 Zustand 的响应式状态打包暴露，
         方便在任何 React 组件内直接调用，例如触发按键音或切换游戏阶段背景乐。
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

import { useCallback } from 'react';
import { audioManager } from './audioManager';
import { useAudioStore } from './audioStore';

export const useAudio = () => {
  // 订阅 Store 中管理的状态，当设置界面改变音量时，组件也能实时获取
  const { bgmVolume, sfxVolume, currentBGM, isMuted } = useAudioStore();

  /**
   * 播放背景音乐
   * @param trackId BGM 资产 ID，例如 'BGM01'
   * @param crossfadeMs 淡入淡出交叉时间 (可选)
   */
  const playBGM = useCallback((trackId: string, crossfadeMs?: number) => {
    audioManager.playBGM(trackId, crossfadeMs);
  }, []);

  /**
   * 停止当前背景音乐
   * @param fadeOutMs 淡出时间 (可选)
   */
  const stopBGM = useCallback((fadeOutMs?: number) => {
    audioManager.stopBGM(fadeOutMs);
  }, []);

  /**
   * 播放互动音效
   * @param sfxId SFX 资产 ID，例如 'SFX01'
   */
  const playSFX = useCallback((sfxId: string) => {
    audioManager.playSFX(sfxId);
  }, []);

  // --- 全局状态控制方法 ---
  
  const setBGMVolume = useCallback((volume: number) => {
    audioManager.setBGMVolume(volume);
  }, []);

  const setSFXVolume = useCallback((volume: number) => {
    audioManager.setSFXVolume(volume);
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      audioManager.unmute();
    } else {
      audioManager.mute();
    }
  }, [isMuted]);

  /**
   * 预加载指定音频，防卡顿
   */
  const preload = useCallback((trackIds: string[]) => {
    audioManager.preload(trackIds);
  }, []);

  return {
    // 导出的响应式状态
    bgmVolume,
    sfxVolume,
    currentBGM,
    isMuted,
    
    // 导出的播放控制与设置方法
    playBGM,
    stopBGM,
    playSFX,
    setBGMVolume,
    setSFXVolume,
    toggleMute,
    preload
  };
};
