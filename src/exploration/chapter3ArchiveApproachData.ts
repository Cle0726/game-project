import type { ExplorationRegionDefinition } from './explorationTypes';
import { WHITE_ACADEMY_PLAZA_ASSETS } from './explorationAssets';

const ARCHIVE_CORRIDOR_BACKGROUND =
  '/assets/generated/chapter3/backgrounds/bg_ch3_archive_corridor_v01.png';

export const CH3_ARCHIVE_CORRIDOR_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch3_white_archive_corridor_approach',
  name: '白谱院 · 肖像长廊至档案室外',
  width: 1600,
  height: 900,
  playerSpawn: { x: 260, y: 690 },
  assets: {
    backgroundSrc: ARCHIVE_CORRIDOR_BACKGROUND,
    playerSpriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFallbackSrc,
  },
  collisionZones: [
    { id: 'corridor-north-wall', x: 0, y: 0, width: 1600, height: 155 },
    { id: 'corridor-south-wall', x: 0, y: 785, width: 1600, height: 115 },
    { id: 'portrait-plinth-west', x: 330, y: 210, width: 190, height: 155 },
    { id: 'portrait-plinth-center', x: 710, y: 205, width: 190, height: 160 },
    { id: 'archive-column-east', x: 1180, y: 190, width: 150, height: 210 },
  ],
  waypoints: [
    { id: 'portrait_corridor_start', position: { x: 260, y: 690 }, links: ['portrait_corridor_mid'] },
    { id: 'portrait_corridor_mid', position: { x: 650, y: 610 }, links: ['portrait_corridor_start', 'archive_corridor_mid'] },
    { id: 'archive_corridor_mid', position: { x: 1010, y: 600 }, links: ['portrait_corridor_mid', 'archive_outer_door'] },
    { id: 'archive_outer_door', position: { x: 1370, y: 565 }, links: ['archive_corridor_mid'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch3_reach_archive_outer_corridor',
      title: '前往档案室外',
      description: '带着温别克给出的待销毁柜线索，沿肖像长廊前往夜间档案室外。',
      completionText: '档案室外有人在等你们。',
      target: { type: 'zone', id: 'ch3-archive-outer-door' },
    },
  ],
  initialQuestId: 'ch3_reach_archive_outer_corridor',
  interactionZones: [
    {
      id: 'ch3-old-portrait-row',
      name: '旧研究员肖像',
      area: { x: 560, y: 205, width: 170, height: 150 },
      interactionText: '按 E 查看肖像铭牌',
      statusText: '几块铭牌上的名字被翻新过，旧刻痕仍从金漆下透出来。',
    },
    {
      id: 'ch3-archive-outer-door',
      name: '档案室外廊',
      area: { x: 1280, y: 470, width: 250, height: 210 },
      interactionText: '按 E 前往档案室外',
      statusText: '夜间档案室仍亮着灯。一个年轻研究员抱着资料站在门外。',
      questCompleteId: 'ch3_reach_archive_outer_corridor',
      storySceneId: 'ch3_white_006',
    },
  ],
};
