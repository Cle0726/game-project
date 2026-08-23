import type { ExplorationRegionDefinition } from './explorationTypes';

const STATION_BACKGROUND =
  '/assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png';

export const CH1_MUJIAN_DEPARTURE_REGION: ExplorationRegionDefinition = {
  id: 'ch1_mujian_station_departure',
  name: '雾茧站 · 离站通道',
  width: 1600,
  height: 900,
  playerSpawn: { x: 800, y: 390 },
  assets: { backgroundSrc: STATION_BACKGROUND },
  collisionZones: [
    { id: 'departure-west-structure', x: 0, y: 0, width: 235, height: 900 },
    { id: 'departure-east-structure', x: 1365, y: 0, width: 235, height: 900 },
    { id: 'departure-north-wall', x: 235, y: 0, width: 1130, height: 125 },
    { id: 'departure-center-kiosk', x: 705, y: 380, width: 190, height: 150 },
    { id: 'departure-west-benches', x: 340, y: 610, width: 220, height: 95 },
    { id: 'departure-east-luggage', x: 1040, y: 610, width: 180, height: 95 },
  ],
  waypoints: [
    { id: 'departure_start', position: { x: 800, y: 325 }, links: ['departure_west_lane', 'departure_east_lane'] },
    { id: 'departure_west_lane', position: { x: 620, y: 555 }, links: ['departure_start', 'departure_south'] },
    { id: 'departure_east_lane', position: { x: 980, y: 555 }, links: ['departure_start', 'departure_south'] },
    { id: 'departure_south', position: { x: 800, y: 700 }, links: ['departure_west_lane', 'departure_east_lane', 'departure_exit'] },
    { id: 'departure_exit', position: { x: 800, y: 805 }, links: ['departure_south'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch1_leave_mujian_station',
      title: '离开雾茧站',
      description: '整理完本章线索后，穿过换乘站台前往车队停靠处。',
      completionText: '离站口就在前方。站台广播忽然自行启动。',
      target: { type: 'zone', id: 'ch1-station-departure-exit' },
    },
  ],
  initialQuestId: 'ch1_leave_mujian_station',
  interactionZones: [
    {
      id: 'ch1-sealed-evidence-crate',
      name: '封存箱',
      area: { x: 980, y: 535, width: 150, height: 105 },
      interactionText: '按 E 查看封存箱',
      statusText: '安柠已经把零四的断裂节拍器、巡逻日志残页和吊坠相关证物逐一封存。',
    },
    {
      id: 'ch1-station-departure-exit',
      name: '离站口',
      area: { x: 670, y: 735, width: 260, height: 140 },
      interactionText: '按 E 离开雾茧站',
      statusText: '车队就在站外。就在你准备离开时，沉寂的广播线路突然被接通。',
      questCompleteId: 'ch1_leave_mujian_station',
      storySceneId: 'ch1_black_014',
    },
  ],
};
