import type { ExplorationRegionDefinition } from './explorationTypes';

export const PROTOTYPE_REGION: ExplorationRegionDefinition = {
  id: 'prototype_plaza',
  name: '自由探索原型 · 广场',
  width: 2200,
  height: 1400,
  playerSpawn: { x: 1080, y: 760 },
  collisionZones: [
    { id: 'north-building', x: 300, y: 160, width: 520, height: 300 },
    { id: 'east-building', x: 1600, y: 240, width: 360, height: 360 },
    { id: 'fountain', x: 940, y: 500, width: 300, height: 220 },
    { id: 'south-garden', x: 420, y: 1040, width: 620, height: 180 },
  ],
  waypoints: [
    { id: 'atya_home', position: { x: 760, y: 760 }, links: ['south_west'] },
    { id: 'south_west', position: { x: 820, y: 900 }, links: ['atya_home', 'south_center'] },
    { id: 'south_center', position: { x: 1180, y: 900 }, links: ['south_west', 'plaza_east'] },
    { id: 'plaza_east', position: { x: 1380, y: 760 }, links: ['south_center', 'east_corridor', 'milo_home'] },
    { id: 'east_corridor', position: { x: 1500, y: 760 }, links: ['plaza_east', 'east_north', 'milo_home'] },
    { id: 'east_north', position: { x: 1460, y: 650 }, links: ['east_corridor'] },
    { id: 'milo_home', position: { x: 1440, y: 900 }, links: ['plaza_east', 'east_corridor'] },
  ],
  npcs: [
    {
      id: 'atya',
      name: '阿缇娅',
      position: { x: 760, y: 760 },
      speed: 120,
      storySceneId: 'ch0_001',
      interactionText: '按 E 与阿缇娅交谈',
      schedule: [
        { minuteOfDay: 480, targetWaypointId: 'atya_home', activity: '在广场休息' },
        { minuteOfDay: 540, targetWaypointId: 'south_west', activity: '前往训练区' },
        { minuteOfDay: 720, targetWaypointId: 'south_center', activity: '午后散步' },
        { minuteOfDay: 900, targetWaypointId: 'plaza_east', activity: '查看巡演团补给' },
        { minuteOfDay: 1080, targetWaypointId: 'atya_home', activity: '返回广场休息' },
      ],
    },
    {
      id: 'milo',
      name: '弥洛',
      position: { x: 1440, y: 900 },
      speed: 105,
      interactionText: '按 E 与弥洛交谈',
      schedule: [
        { minuteOfDay: 480, targetWaypointId: 'milo_home', activity: '检查装备' },
        { minuteOfDay: 600, targetWaypointId: 'east_corridor', activity: '前往东侧通道' },
        { minuteOfDay: 780, targetWaypointId: 'east_north', activity: '巡视周边' },
        { minuteOfDay: 960, targetWaypointId: 'plaza_east', activity: '短暂休息' },
        { minuteOfDay: 1140, targetWaypointId: 'milo_home', activity: '返回装备区' },
      ],
    },
  ],
};
