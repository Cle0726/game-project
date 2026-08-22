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
  npcs: [
    {
      id: 'atya',
      name: '阿缇娅',
      position: { x: 760, y: 760 },
      speed: 120,
      storySceneId: 'ch0_001',
      interactionText: '按 E 与阿缇娅交谈',
      schedule: [
        { minuteOfDay: 480, position: { x: 760, y: 760 }, activity: '在广场休息' },
        { minuteOfDay: 540, position: { x: 820, y: 900 }, activity: '前往训练区' },
        { minuteOfDay: 720, position: { x: 1180, y: 900 }, activity: '午后散步' },
        { minuteOfDay: 900, position: { x: 1380, y: 760 }, activity: '查看巡演团补给' },
        { minuteOfDay: 1080, position: { x: 760, y: 760 }, activity: '返回广场休息' },
      ],
    },
    {
      id: 'milo',
      name: '弥洛',
      position: { x: 1440, y: 900 },
      speed: 105,
      interactionText: '按 E 与弥洛交谈',
      schedule: [
        { minuteOfDay: 480, position: { x: 1440, y: 900 }, activity: '检查装备' },
        { minuteOfDay: 600, position: { x: 1500, y: 760 }, activity: '前往东侧通道' },
        { minuteOfDay: 780, position: { x: 1460, y: 650 }, activity: '巡视周边' },
        { minuteOfDay: 960, position: { x: 1360, y: 760 }, activity: '短暂休息' },
        { minuteOfDay: 1140, position: { x: 1440, y: 900 }, activity: '返回装备区' },
      ],
    },
  ],
};
