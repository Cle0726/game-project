import React from 'react';
import { useAudio } from '../../audio/useAudio';
import './AudioSettings.css';

export const AudioSettings: React.FC = () => {
  const { bgmVolume, sfxVolume, isMuted, setBGMVolume, setSFXVolume, toggleMute, playSFX } = useAudio();

  const handleBGMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 实时响应：拖动滑块时立刻更新 Zustand Store，
    // 由于 AudioManager 订阅了 Store，当前播放的 BGM 音量会立刻发生变化
    setBGMVolume(Number(e.target.value) / 100);
  };

  const handleSFXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSFXVolume(Number(e.target.value) / 100);
  };

  const handleSFXRelease = () => {
    // 用户松开滑块时，播放一声测试音效
    playSFX('SFX01');
  };

  return (
    <div className="audio-settings-container">
      <h3 className="audio-settings-title">听觉校准</h3>
      
      <div className="audio-setting-row">
        <label className="audio-setting-label">主旋律 (BGM)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(bgmVolume * 100)}
          onChange={handleBGMChange}
          className="platinum-slider"
          aria-label="背景音乐音量"
        />
        <span className="audio-setting-value">{Math.round(bgmVolume * 100)}</span>
      </div>

      <div className="audio-setting-row">
        <label className="audio-setting-label">环境与交互 (SFX)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(sfxVolume * 100)}
          onChange={handleSFXChange}
          onMouseUp={handleSFXRelease}
          onTouchEnd={handleSFXRelease}
          className="platinum-slider"
          aria-label="音效音量"
        />
        <span className="audio-setting-value">{Math.round(sfxVolume * 100)}</span>
      </div>

      <div className="audio-setting-row toggle-row">
        <label className="audio-setting-label">绝对静音</label>
        <button 
          className={`platinum-toggle ${isMuted ? 'active' : ''}`}
          onClick={toggleMute}
          aria-pressed={isMuted}
        >
          {isMuted ? '已静音' : '未静音'}
        </button>
      </div>
    </div>
  );
};
