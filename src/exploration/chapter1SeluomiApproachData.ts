import type { ExplorationRegionDefinition } from './explorationTypes';

const STATION_BACKGROUND =
  '/assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png';

export const CH1_SELUOMI_STANDOFF_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch1_mujian_seluomi_standoff_approach',
  name: '雾茧站 · 七号站台夜雾',
  width: 1600,
  height: 900,
  playerSpawn: { x: 1180, y: 520 },
  assets: { backgroundSrc: STATION_BACKGROUND },
  collisionZones: [
    { id: 'night-west-structure', x: 0, y: 0, width: 235, height: 900 },
    { id: 'night-east-structure', x: 1365, y: 0, width: 235, height: 900 },
    { id: 'night-north-wall', x: 235, y: 0, width: 1130, height: 125 },
    { id: 'night-center-kiosk', x: 705, y: 380, width: 190, height: 150 },
    { id: 'night-west-benches', x: 340, y: 610, width: 220, height: 95 },
    { id: 'night-east-luggage', x: 1040, y: 610, width: 180, height: 95 },
  ],
  waypoints: [
    { id: 'night_inn_side', position: { x: 1180, y: 520 }, links: ['night_east_lane'] },
    { id: 'night_east_lane', position: { x: 990, y: 555 }, links: ['night_inn_side', 'night_south', 'night_north_east'] },
    { id: 'night_south', position: { x: 800, y: 675 }, links: ['night_east_lane', 'night_west_lane'] },
    { id: 'night_west_lane', position: { x: 620, y: 555 }, links: ['night_south', 'night_north_west'] },
    { id: 'night_north_west', position: { x: 620, y: 310 }, links: ['night_west_lane', 'night_platform7'] },
    { id: 'night_north_east', position: { x: 980, y: 310 }, links: ['night_east_lane', 'night_platform7'] },
    { id: 'night_platform7', position: { x: 800, y: 230 }, links: ['night_north_west', 'night_north_east', 'night_low_frequency'] },
    { id: 'night_low_frequency', position: { x: 800, y: 180 }, links: ['night_platform7'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch1_follow_low_frequency',
      title: '追踪异常低频',
      description: '离开站台旅馆，循着穿透雾墙的低频共振前往七号站台尽头。',
      completionText: '低频共振就在前方。有人站在雾墙边缘。',
      target: { type: 'zone', id: 'ch1-seluomi-standoff-edge' },
    },
  ],
  initialQuestId: 'ch1_follow_low_frequency',
  interactionZones: [
    {
      id: 'ch1-night-signal',
      name: '夜间信号灯',
      area: { x: 1030, y: 270, width: 145, height: 105 },
      interactionText: '按 E 查看信号灯',
      statusText: '信号灯没有对应列车，却在低频共振出现后开始重复闪烁。',
    },
    {
      id: 'ch1-seluomi-standoff-edge',
      name: '异常低频源',
      area: { x: 675, y: 150, width: 250, height: 110 },
      interactionText: '按 E 靠近低频源',
      statusText: '雾墙后的低频共振已经近到能压住呼吸节拍。',
      questCompleteId: 'ch1_follow_low_frequency',
      storySceneId: 'ch1_black_008',
    },
  ],
};
