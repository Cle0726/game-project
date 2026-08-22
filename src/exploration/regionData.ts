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
      storySceneId: 'ch0_001',
      interactionText: '按 E 与阿缇娅交谈',
    },
    {
      id: 'milo',
      name: '弥洛',
      position: { x: 1440, y: 900 },
      interactionText: '按 E 与弥洛交谈',
    },
  ],
};
