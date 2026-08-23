import type { ExplorationRegionDefinition } from './explorationTypes';

const CORE_BACKGROUND =
  '/assets/generated/chapter2/backgrounds/bg_ch2_core_recording_chamber_v01.png';
const FAREWELL_BACKGROUND =
  '/assets/generated/chapter2/backgrounds/bg_ch2_snowfield_observatory_approach_v01.png';

/** After the Scoreheart Guardian battle, approach the still-sealed core door physically. */
export const CH2_CORE_DOOR_POST_BOSS_REGION: ExplorationRegionDefinition = {
  id: 'ch2_core_door_post_boss',
  name: '冻谱观测塔 · 核心舱前',
  width: 1700,
  height: 1000,
  playerSpawn: { x: 850, y: 865 },
  assets: { backgroundSrc: CORE_BACKGROUND },
  collisionZones: [
    { id: 'core-pre-west-wall', x: 0, y: 0, width: 245, height: 1000 },
    { id: 'core-pre-east-wall', x: 1455, y: 0, width: 245, height: 1000 },
    { id: 'core-pre-north-left', x: 245, y: 0, width: 505, height: 145 },
    { id: 'core-pre-north-right', x: 950, y: 0, width: 505, height: 145 },
    { id: 'core-pre-west-shards', x: 390, y: 465, width: 245, height: 175 },
    { id: 'core-pre-east-shards', x: 1065, y: 445, width: 245, height: 190 },
  ],
  waypoints: [
    { id: 'core_pre_entry', position: { x: 850, y: 865 }, links: ['core_pre_south'] },
    { id: 'core_pre_south', position: { x: 850, y: 710 }, links: ['core_pre_entry', 'core_pre_west', 'core_pre_east'] },
    { id: 'core_pre_west', position: { x: 700, y: 555 }, links: ['core_pre_south', 'core_pre_door'] },
    { id: 'core_pre_east', position: { x: 1000, y: 555 }, links: ['core_pre_south', 'core_pre_door'] },
    { id: 'core_pre_door', position: { x: 850, y: 235 }, links: ['core_pre_west', 'core_pre_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch2_approach_core_door',
      title: '确认核心舱状态',
      description: '穿过谱心监守者留下的晶体碎片，靠近即将开启的核心舱门。',
      completionText: '核心舱门开始响应。门后传来一个冷静的女声。',
      target: { type: 'zone', id: 'ch2-core-sealed-door' },
    },
  ],
  initialQuestId: 'ch2_approach_core_door',
  interactionZones: [
    {
      id: 'ch2-scoreheart-shell',
      name: '谱心监守者残壳',
      area: { x: 690, y: 610, width: 320, height: 115 },
      interactionText: '按 E 查看晶体残壳',
      statusText: '未完工律者外壳已经失去光芒，只有破碎晶片仍缓慢悬浮。',
    },
    {
      id: 'ch2-core-sealed-door',
      name: '核心舱门',
      area: { x: 730, y: 150, width: 240, height: 170 },
      interactionText: '按 E 靠近核心舱门',
      statusText: '门锁正在解除。就在最后一道封印熄灭前，门后有人开口。',
      questCompleteId: 'ch2_approach_core_door',
      storySceneId: 'ch2_snow_008',
    },
  ],
};

/** The Ningsu resolution is canonical; once the door is open, walk to the recorder. */
export const CH2_CORE_RECORDER_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch2_core_recorder_approach',
  name: '冻谱观测塔 · 核心记录舱',
  width: 1700,
  height: 1000,
  playerSpawn: { x: 850, y: 835 },
  assets: { backgroundSrc: CORE_BACKGROUND },
  collisionZones: [
    { id: 'core-rec-west-wall', x: 0, y: 0, width: 245, height: 1000 },
    { id: 'core-rec-east-wall', x: 1455, y: 0, width: 245, height: 1000 },
    { id: 'core-rec-north-left', x: 245, y: 0, width: 460, height: 140 },
    { id: 'core-rec-north-right', x: 995, y: 0, width: 460, height: 140 },
    { id: 'core-rec-west-console', x: 365, y: 410, width: 285, height: 175 },
    { id: 'core-rec-east-console', x: 1050, y: 410, width: 285, height: 175 },
    { id: 'core-rec-center-plinth', x: 760, y: 335, width: 180, height: 175 },
  ],
  waypoints: [
    { id: 'core_rec_entry', position: { x: 850, y: 835 }, links: ['core_rec_south'] },
    { id: 'core_rec_south', position: { x: 850, y: 690 }, links: ['core_rec_entry', 'core_rec_west', 'core_rec_east'] },
    { id: 'core_rec_west', position: { x: 705, y: 560 }, links: ['core_rec_south', 'core_rec_north_west'] },
    { id: 'core_rec_east', position: { x: 995, y: 560 }, links: ['core_rec_south', 'core_rec_north_east'] },
    { id: 'core_rec_north_west', position: { x: 705, y: 285 }, links: ['core_rec_west', 'core_rec_recorder'] },
    { id: 'core_rec_north_east', position: { x: 995, y: 285 }, links: ['core_rec_east', 'core_rec_recorder'] },
    { id: 'core_rec_recorder', position: { x: 850, y: 220 }, links: ['core_rec_north_west', 'core_rec_north_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch2_reach_residual_recorder',
      title: '接近残响记录仪',
      description: '穿过已经开启的核心舱，找到仍按四拍明灭的残响记录仪。',
      completionText: '记录仪仍在待机。二十三年前留下的录音就在这里。',
      target: { type: 'zone', id: 'ch2-residual-recorder' },
    },
  ],
  initialQuestId: 'ch2_reach_residual_recorder',
  interactionZones: [
    {
      id: 'ch2-core-maintenance-console',
      name: '旧维护台',
      area: { x: 1040, y: 600, width: 180, height: 115 },
      interactionText: '按 E 查看维护台',
      statusText: '维护台上的日志停在撤离前夜，最后一条记录只有四拍校准标记。',
    },
    {
      id: 'ch2-residual-recorder',
      name: '残响记录仪',
      area: { x: 730, y: 145, width: 240, height: 155 },
      interactionText: '按 E 靠近记录仪',
      statusText: '薄冰覆盖着控制面板，待机灯仍以四拍循环。',
      questCompleteId: 'ch2_reach_residual_recorder',
      storySceneId: 'ch2_snow_011',
    },
  ],
};

/** After the authored farewell/companion choice, make the first downhill leg physical. */
export const CH2_OBSERVATORY_DEPARTURE_REGION: ExplorationRegionDefinition = {
  id: 'ch2_observatory_departure',
  name: '雪岭无人区 · 下山雪坡',
  width: 1800,
  height: 1100,
  playerSpawn: { x: 900, y: 300 },
  assets: { backgroundSrc: FAREWELL_BACKGROUND },
  collisionZones: [
    { id: 'farewell-west-ridge', x: 0, y: 0, width: 260, height: 1100 },
    { id: 'farewell-east-ridge', x: 1540, y: 0, width: 260, height: 1100 },
    { id: 'farewell-north-tower-left', x: 260, y: 0, width: 520, height: 220 },
    { id: 'farewell-north-tower-right', x: 1020, y: 0, width: 520, height: 220 },
    { id: 'farewell-west-drift', x: 420, y: 520, width: 230, height: 140 },
    { id: 'farewell-east-drift', x: 1160, y: 510, width: 225, height: 145 },
  ],
  waypoints: [
    { id: 'farewell_start', position: { x: 900, y: 300 }, links: ['farewell_mid_west', 'farewell_mid_east'] },
    { id: 'farewell_mid_west', position: { x: 720, y: 450 }, links: ['farewell_start', 'farewell_lower'] },
    { id: 'farewell_mid_east', position: { x: 1080, y: 450 }, links: ['farewell_start', 'farewell_lower'] },
    { id: 'farewell_lower', position: { x: 900, y: 750 }, links: ['farewell_mid_west', 'farewell_mid_east', 'farewell_route_split'] },
    { id: 'farewell_route_split', position: { x: 900, y: 945 }, links: ['farewell_lower'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch2_descend_from_observatory',
      title: '离开冻谱观测塔',
      description: '沿雪坡下山，让冻谱观测塔留在身后，整理母亲残响给出的三个坐标。',
      completionText: '观测塔已经缩成雪幕中的冰蓝轮廓。接下来必须决定先追哪一个坐标。',
      target: { type: 'zone', id: 'ch2-route-split-overlook' },
    },
  ],
  initialQuestId: 'ch2_descend_from_observatory',
  interactionZones: [
    {
      id: 'ch2-fallen-frozen-snow',
      name: '震落的冻雪',
      area: { x: 1030, y: 390, width: 170, height: 115 },
      interactionText: '按 E 查看冻雪',
      statusText: '原本悬在半空的雪片终于落地，像观测塔长久停住的时间开始重新移动。',
    },
    {
      id: 'ch2-route-split-overlook',
      name: '下山路线',
      area: { x: 760, y: 865, width: 280, height: 170 },
      interactionText: '按 E 继续下山',
      statusText: '三个坐标仍在地图上。黑暗巡演路线与其中一处重合。',
      questCompleteId: 'ch2_descend_from_observatory',
      storySceneId: 'ch2_snow_015',
    },
  ],
};
