/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: musicTracks.ts
   功能: 定义游戏内所有的背景音乐 (BGM) 资产清单
   说明: 根据“音频内容需求总表”，定义各场景的主题音乐及其淡入淡出参数
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

import { AudioTrack } from './audioTypes';

export const BGM_TRACKS: Record<string, AudioTrack> = {
  // BGM01: 主菜单 / 白金歌剧厅主题 - 华丽开场，明亮庄重
  BGM01: {
    id: 'BGM01',
    src: '/audio/bgm/BGM01.mp3',
    volume: 0.8,
    loop: true,
    fadeInMs: 1000,
    fadeOutMs: 1000
  },
  // BGM02: 茶歇 / 生活日环境音 - 温暖午后沙龙感
  BGM02: {
    id: 'BGM02',
    src: '/audio/bgm/BGM02.mp3',
    volume: 0.6,
    loop: true,
    fadeInMs: 1500,
    fadeOutMs: 1500
  },
  // BGM03: 地图探索 / 长廊行进 - 中速行进感，拨奏为主
  BGM03: {
    id: 'BGM03',
    src: '/audio/bgm/BGM03.mp3',
    volume: 0.7,
    loop: true,
    fadeInMs: 1000,
    fadeOutMs: 1000
  },
  // BGM04: 普通战斗 - 有张力但依然优雅，弦乐震音+铜管点缀
  BGM04: {
    id: 'BGM04',
    src: '/audio/bgm/BGM04.mp3',
    volume: 0.8,
    loop: true,
    fadeInMs: 500,
    fadeOutMs: 1000
  },
  // BGM05: 首领战（无拍者） - "美丽的旋律正在腐坏"，管弦乐轻微走音
  BGM05: {
    id: 'BGM05',
    src: '/audio/bgm/BGM05.mp3',
    volume: 0.9,
    loop: true,
    fadeInMs: 500,
    fadeOutMs: 2000
  },
  // BGM06_VICTORY: 胜利结算 - 短促辉煌收尾
  BGM06_VICTORY: {
    id: 'BGM06_VICTORY',
    src: '/audio/bgm/BGM06_VICTORY.mp3',
    volume: 0.8,
    loop: false,
    fadeInMs: 0,
    fadeOutMs: 500
  },
  // BGM06_DEFEAT: 失败结算 - "未完成感"的悬置和弦
  BGM06_DEFEAT: {
    id: 'BGM06_DEFEAT',
    src: '/audio/bgm/BGM06_DEFEAT.mp3',
    volume: 0.8,
    loop: false,
    fadeInMs: 0,
    fadeOutMs: 2000
  }
};
