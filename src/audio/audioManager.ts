/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: audioManager.ts
   功能: 核心音频播放管理器 (单例模式)
   说明: 封装 Howler.js 进行实际的音频播放、资源缓存、交叉淡化 (Crossfade) 处理，
         并订阅 audioStore 的状态变化以实时同步音量。
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

import { Howl, Howler } from 'howler';
import { BGM_TRACKS } from './musicTracks';
import { SFX_TRACKS } from './sfxLibrary';
import { useAudioStore } from './audioStore';

class AudioManager {
  private static instance: AudioManager;
  
  // 当前播放的 BGM 实例与 ID
  private currentBgmHowl: Howl | null = null;
  private currentBgmId: string | null = null;
  
  // 缓存短音效以提高播放性能
  private sfxCache: Record<string, Howl> = {};

  private constructor() {
    // 监听全局 Zustand 状态的变化，实时调整 Howler 的音量和静音状态
    useAudioStore.subscribe((state, prevState) => {
      if (state.bgmVolume !== prevState?.bgmVolume && this.currentBgmHowl) {
        this.currentBgmHowl.volume(state.bgmVolume);
      }
      if (state.isMuted !== prevState?.isMuted) {
        Howler.mute(state.isMuted);
      }
    });
  }

  // 获取单例
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * 播放背景音乐 (带无缝淡入淡出 / Crossfade)
   * @param trackId BGM 资产 ID
   * @param crossfadeMs 淡入淡出时长(毫秒)
   */
  public playBGM(trackId: string, crossfadeMs: number = 1000): void {
    const track = BGM_TRACKS[trackId];
    if (!track) {
      console.warn(`[AudioManager] BGM track not found: ${trackId}`);
      return;
    }

    // 避免重复播放正在播放的同首曲目
    if (this.currentBgmId === trackId && this.currentBgmHowl?.playing()) {
      return;
    }

    const { bgmVolume } = useAudioStore.getState();
    const newHowl = new Howl({
      src: [track.src],
      loop: track.loop,
      volume: 0,
      html5: true, // 对于较大的背景音乐文件，使用 html5 模式以支持流式加载
      onloaderror: () => console.warn(`[AudioManager] Failed to load BGM: ${track.src}`)
    });

    // 如果当前有 BGM 正在播放，执行 FadeOut，然后停止
    if (this.currentBgmHowl) {
      const oldHowl = this.currentBgmHowl;
      oldHowl.fade(oldHowl.volume(), 0, crossfadeMs);
      setTimeout(() => {
        oldHowl.stop();
        oldHowl.unload();
      }, crossfadeMs);
    }

    // 播放新的 BGM，并执行 FadeIn
    newHowl.play();
    newHowl.fade(0, bgmVolume, track.fadeInMs || crossfadeMs);
    
    this.currentBgmHowl = newHowl;
    this.currentBgmId = trackId;
    
    // 更新 Store 状态
    useAudioStore.getState().setCurrentBGM(trackId);
  }

  /**
   * 停止当前 BGM
   */
  public stopBGM(fadeOutMs: number = 1000): void {
    if (this.currentBgmHowl) {
      this.currentBgmHowl.fade(this.currentBgmHowl.volume(), 0, fadeOutMs);
      setTimeout(() => {
        if (this.currentBgmHowl) {
          this.currentBgmHowl.stop();
          this.currentBgmHowl.unload();
          this.currentBgmHowl = null;
        }
      }, fadeOutMs);
    }
    this.currentBgmId = null;
    useAudioStore.getState().setCurrentBGM(null);
  }

  /**
   * 播放音效 (SFX)
   * @param sfxId SFX 资产 ID
   */
  public playSFX(sfxId: string): void {
    const track = SFX_TRACKS[sfxId];
    if (!track) {
      console.warn(`[AudioManager] SFX track not found: ${sfxId}`);
      return;
    }

    const { sfxVolume } = useAudioStore.getState();

    // 如果未缓存，则创建并缓存
    if (!this.sfxCache[sfxId]) {
      this.sfxCache[sfxId] = new Howl({
        src: [track.src],
        loop: track.loop,
        volume: track.volume * sfxVolume,
        onloaderror: () => console.warn(`[AudioManager] Failed to load SFX: ${track.src}`)
      });
    } else {
      // 每次播放前同步最新音量设置
      this.sfxCache[sfxId].volume(track.volume * sfxVolume);
    }

    this.sfxCache[sfxId].play();
  }

  // --- 全局控制方法 (代理至 Store) ---
  
  public setBGMVolume(volume: number): void {
    useAudioStore.getState().setBGMVolume(volume);
  }

  public setSFXVolume(volume: number): void {
    useAudioStore.getState().setSFXVolume(volume);
  }

  public mute(): void {
    if (!useAudioStore.getState().isMuted) {
      useAudioStore.getState().toggleMute();
    }
  }

  public unmute(): void {
    if (useAudioStore.getState().isMuted) {
      useAudioStore.getState().toggleMute();
    }
  }

  /**
   * 预加载音频资产，防止游戏运行时出现播放延迟
   * @param trackIds 资产 ID 数组
   */
  public preload(trackIds: string[]): void {
    trackIds.forEach(id => {
      const track = BGM_TRACKS[id] || SFX_TRACKS[id];
      if (track) {
        if (SFX_TRACKS[id] && !this.sfxCache[id]) {
          this.sfxCache[id] = new Howl({ src: [track.src], preload: true });
        } else if (BGM_TRACKS[id]) {
          new Howl({ src: [track.src], preload: true, html5: false });
        }
      }
    });
  }
}

export const audioManager = AudioManager.getInstance();
