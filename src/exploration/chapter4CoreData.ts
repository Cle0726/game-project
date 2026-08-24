import type { ExplorationRegionDefinition } from './explorationTypes';
import { WHITE_ACADEMY_PLAZA_ASSETS } from './explorationAssets';

const ALTAR_BACKGROUND =
  '/assets/generated/chapter4/backgrounds/bg_ch4_altar_carriage_v01.png';
const CORE_BACKGROUND =
  '/assets/generated/chapter4/backgrounds/bg_ch4_core_organ_chamber_v01.png';
const PLAYER_SPRITE_VARIANTS = {
  male: WHITE_ACADEMY_PLAZA_ASSETS.protagonistMaleSrc,
  female: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFemaleSrc,
  fallback: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFallbackSrc,
} as const;

export const CH4_POST_SELUOMI_CORE_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch4_post_seluomi_core_approach',
  name: '不夜巡演号 · 祭坛车厢后段',
  width: 1600,
  height: 900,
  playerSpawn: { x: 270, y: 700 },
  assets: { backgroundSrc: ALTAR_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'post-seluomi-north-wall', x: 0, y: 0, width: 1600, height: 145 },
    { id: 'post-seluomi-south-wall', x: 0, y: 815, width: 1600, height: 85 },
    { id: 'post-seluomi-west-altar', x: 405, y: 215, width: 235, height: 220 },
    { id: 'post-seluomi-east-altar', x: 970, y: 215, width: 235, height: 220 },
  ],
  waypoints: [
    { id: 'post_seluomi_start', position: { x: 270, y: 700 }, links: ['post_seluomi_west'] },
    { id: 'post_seluomi_west', position: { x: 585, y: 640 }, links: ['post_seluomi_start', 'post_seluomi_center'] },
    { id: 'post_seluomi_center', position: { x: 820, y: 620 }, links: ['post_seluomi_west', 'post_seluomi_east'] },
    { id: 'post_seluomi_east', position: { x: 1110, y: 625 }, links: ['post_seluomi_center', 'core_car_outer'] },
    { id: 'core_car_outer', position: { x: 1370, y: 550 }, links: ['post_seluomi_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_reach_core_car_outer',
      title: '前往核心车厢',
      description: '瑟萝弥的最终战已经结束。穿过祭坛车厢后段，继续追向黑色管风琴的低鸣。',
      completionText: '核心车厢就在前方，整列车的节拍正在从门后传来。',
      target: { type: 'zone', id: 'ch4-core-car-outer' },
    },
  ],
  initialQuestId: 'ch4_reach_core_car_outer',
  interactionZones: [
    {
      id: 'ch4-external-intel-event',
      name: '外侧通讯窗口',
      area: { x: 730, y: 470, width: 220, height: 115 },
      interactionText: '按 E 接入阿俞与溪吟',
      statusText: '列车外侧通讯短暂恢复。阿俞与溪吟一直在外围追踪管风琴核心的拍点差。',
      storySceneId: 'chapter4_event_E405',
      once: true,
    },
    {
      id: 'ch4-faded-seluomi-halo',
      name: '残留圣咏光环',
      area: { x: 720, y: 180, width: 180, height: 145 },
      interactionText: '按 E 查看残留光环',
      statusText: '白光正在熄灭。它第一次没有继续执行下一道裁定。',
    },
    {
      id: 'ch4-core-car-outer',
      name: '核心车厢外门',
      area: { x: 1260, y: 445, width: 280, height: 240 },
      interactionText: '按 E 接近核心车厢',
      statusText: '巨大管风琴的低鸣穿过门板和车轮，像把整列车绑在同一颗心脏上。',
      questCompleteId: 'ch4_reach_core_car_outer',
      storySceneId: 'ch4_011',
    },
  ],
};

export const CH4_CORE_ORGAN_ENTRY_REGION: ExplorationRegionDefinition = {
  id: 'ch4_core_organ_entry',
  name: '不夜巡演号 · 核心管风琴舱',
  width: 1600,
  height: 900,
  playerSpawn: { x: 250, y: 710 },
  assets: { backgroundSrc: CORE_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'core-entry-north-wall', x: 0, y: 0, width: 1600, height: 130 },
    { id: 'core-entry-south-wall', x: 0, y: 825, width: 1600, height: 75 },
    { id: 'core-entry-west-pipes', x: 370, y: 190, width: 270, height: 280 },
    { id: 'core-entry-east-pipes', x: 990, y: 190, width: 270, height: 280 },
  ],
  waypoints: [
    { id: 'core_entry_start', position: { x: 250, y: 710 }, links: ['core_entry_west'] },
    { id: 'core_entry_west', position: { x: 570, y: 650 }, links: ['core_entry_start', 'core_entry_center'] },
    { id: 'core_entry_center', position: { x: 820, y: 625 }, links: ['core_entry_west', 'core_entry_east'] },
    { id: 'core_entry_east', position: { x: 1100, y: 640 }, links: ['core_entry_center', 'charon_conversation'] },
    { id: 'charon_conversation', position: { x: 1370, y: 555 }, links: ['core_entry_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_enter_core_organ_chamber',
      title: '进入核心车厢',
      description: '确认管风琴正在绑定全车节拍后，进入核心舱面对卡戎。',
      completionText: '管风琴正下方有人等待着你们。',
      target: { type: 'zone', id: 'ch4-charon-conversation' },
    },
  ],
  initialQuestId: 'ch4_enter_core_organ_chamber',
  interactionZones: [
    {
      id: 'ch4-organ-drive-shaft',
      name: '管风琴传动轴',
      area: { x: 760, y: 160, width: 160, height: 155 },
      interactionText: '按 E 检查传动轴',
      statusText: '这套结构同时连接车轮、广播与管风琴。演奏和列车运行从来不是两套系统。',
    },
    {
      id: 'ch4-charon-conversation',
      name: '管风琴主台前',
      area: { x: 1260, y: 445, width: 280, height: 240 },
      interactionText: '按 E 走向管风琴主台',
      statusText: '卡戎没有再用广播说话。他就在前方。',
      questCompleteId: 'ch4_enter_core_organ_chamber',
      storySceneId: 'ch4_012',
    },
  ],
};

export const CH4_FINAL_BOSS_DAIS_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch4_final_boss_dais_approach',
  name: '不夜巡演号 · 管风琴指挥台',
  width: 1600,
  height: 900,
  playerSpawn: { x: 300, y: 710 },
  assets: { backgroundSrc: CORE_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'final-dais-north-wall', x: 0, y: 0, width: 1600, height: 130 },
    { id: 'final-dais-south-wall', x: 0, y: 825, width: 1600, height: 75 },
    { id: 'final-dais-west-organ', x: 350, y: 180, width: 285, height: 290 },
    { id: 'final-dais-east-organ', x: 1000, y: 180, width: 285, height: 290 },
  ],
  waypoints: [
    { id: 'final_dais_start', position: { x: 300, y: 710 }, links: ['final_dais_west'] },
    { id: 'final_dais_west', position: { x: 590, y: 650 }, links: ['final_dais_start', 'final_dais_center'] },
    { id: 'final_dais_center', position: { x: 820, y: 620 }, links: ['final_dais_west', 'final_dais_east'] },
    { id: 'final_dais_east', position: { x: 1100, y: 635 }, links: ['final_dais_center', 'final_dais'] },
    { id: 'final_dais', position: { x: 1375, y: 545 }, links: ['final_dais_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_reach_final_boss_dais',
      title: '走向最后的指挥台',
      description: '最后的准备已经完成。走到黑色管风琴正下方，结束这场被强迫延续的演出。',
      completionText: '假掌声同时响起。卡戎举起了指挥棒。',
      target: { type: 'zone', id: 'ch4-final-boss-dais' },
    },
  ],
  initialQuestId: 'ch4_reach_final_boss_dais',
  interactionZones: [
    {
      id: 'ch4-organ-dodge-minigame',
      name: '第七组音管裂口',
      area: { x: 735, y: 510, width: 230, height: 115 },
      interactionText: '按 E 进行管风琴节奏躲避',
      statusText: '黑色音管的冲击并不同步。若之前记录过核心弱点，第七组音管会留下更稳定的半拍裂口。',
      storySceneId: 'chapter4_event_minigame_organ_dodge',
      once: true,
    },
    {
      id: 'ch4-final-boss-dais',
      name: '黑色管风琴指挥台',
      area: { x: 1260, y: 435, width: 285, height: 245 },
      interactionText: '按 E 走上指挥台',
      statusText: '整列车的假掌声在同一瞬间对齐。最后的演出开始了。',
      questCompleteId: 'ch4_reach_final_boss_dais',
      storySceneId: 'ch4_014',
    },
  ],
};
