import type { ExplorationRegionDefinition } from './explorationTypes';
import { WHITE_ACADEMY_PLAZA_ASSETS } from './explorationAssets';

export const PROTOTYPE_REGION: ExplorationRegionDefinition = {
  id: 'white_academy_plaza',
  name: '白谱院前广场',
  width: 2200,
  height: 1400,
  playerSpawn: { x: 1120, y: 990 },
  assets: {
    backgroundSrc: WHITE_ACADEMY_PLAZA_ASSETS.backgroundSrc,
    playerSpriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFallbackSrc,
  },
  collisionZones: [
    { id: 'academy-north-wing', x: 250, y: 90, width: 690, height: 300 },
    { id: 'academy-east-wing', x: 1630, y: 150, width: 500, height: 510 },
    { id: 'central-fountain', x: 270, y: 500, width: 560, height: 430 },
    { id: 'south-garden', x: 430, y: 1110, width: 700, height: 210 },
  ],
  waypoints: [
    { id: 'south_entry', position: { x: 1120, y: 990 }, links: ['plaza_center', 'garden_east', 'atya_rest'] },
    { id: 'garden_east', position: { x: 1260, y: 1080 }, links: ['south_entry', 'east_lower'] },
    { id: 'plaza_center', position: { x: 1110, y: 790 }, links: ['south_entry', 'fountain_east', 'east_lower'] },
    { id: 'fountain_east', position: { x: 910, y: 760 }, links: ['plaza_center', 'north_center', 'atya_rest'] },
    { id: 'north_center', position: { x: 1110, y: 560 }, links: ['fountain_east', 'academy_gate', 'east_upper'] },
    { id: 'academy_gate', position: { x: 1510, y: 520 }, links: ['north_center', 'east_upper'] },
    { id: 'east_upper', position: { x: 1480, y: 700 }, links: ['academy_gate', 'north_center', 'east_lower', 'milo_patrol'] },
    { id: 'east_lower', position: { x: 1430, y: 900 }, links: ['east_upper', 'plaza_center', 'garden_east', 'milo_rest'] },
    { id: 'milo_patrol', position: { x: 1560, y: 760 }, links: ['east_upper', 'milo_rest'] },
    { id: 'milo_rest', position: { x: 1500, y: 940 }, links: ['east_lower', 'milo_patrol'] },
    { id: 'atya_rest', position: { x: 930, y: 990 }, links: ['south_entry', 'fountain_east'] },
  ],
  quests: [
    {
      id: 'find_milo',
      title: '寻找弥洛',
      description: '在白谱院前广场找到弥洛，确认进入白谱院前的安排。',
      completionText: '已找到弥洛。下一步：前往白谱院正门。',
      nextQuestId: 'enter_academy',
    },
    {
      id: 'enter_academy',
      title: '进入白谱院',
      description: '与弥洛会合后，从东侧正门进入白谱院，继续原有第三章剧情。',
      completionText: '已抵达白谱院正门。',
    },
  ],
  initialQuestId: 'find_milo',
  interactionZones: [
    {
      id: 'academy-main-door',
      name: '白谱院正门',
      area: { x: 1540, y: 390, width: 180, height: 190 },
      interactionText: '按 E 进入白谱院',
      statusText: '厚重的门扉后，是白谱院内部。',
      storySceneId: 'chapter3_white_start',
      questCompleteId: 'enter_academy',
    },
    {
      id: 'fountain-inspect',
      name: '调律喷泉',
      area: { x: 810, y: 610, width: 120, height: 220 },
      interactionText: '按 E 调查喷泉',
      statusText: '水面映着白谱院的塔尖。远处传来几段没有奏完的旋律。',
    },
  ],
  npcs: [
    {
      id: 'atya',
      name: '阿缇娅',
      position: { x: 930, y: 990 },
      speed: 95,
      spriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.atyaSrc,
      interactionText: '按 E 与阿缇娅交谈',
      schedule: [
        { minuteOfDay: 480, targetWaypointId: 'atya_rest', activity: '观察白谱院' },
        { minuteOfDay: 660, targetWaypointId: 'fountain_east', activity: '在喷泉旁等待' },
        { minuteOfDay: 900, targetWaypointId: 'plaza_center', activity: '查看周围动静' },
        { minuteOfDay: 1080, targetWaypointId: 'atya_rest', activity: '回到入口附近' },
      ],
    },
    {
      id: 'milo',
      name: '弥洛',
      position: { x: 1500, y: 940 },
      speed: 105,
      spriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.miloSrc,
      interactionText: '按 E 与弥洛交谈',
      questCompleteId: 'find_milo',
      schedule: [
        { minuteOfDay: 480, targetWaypointId: 'milo_rest', activity: '检查装备' },
        { minuteOfDay: 600, targetWaypointId: 'milo_patrol', activity: '巡视东侧回廊' },
        { minuteOfDay: 780, targetWaypointId: 'east_upper', activity: '观察白谱院正门' },
        { minuteOfDay: 960, targetWaypointId: 'milo_rest', activity: '等待奏者会合' },
        { minuteOfDay: 1140, targetWaypointId: 'academy_gate', activity: '准备进入白谱院' },
      ],
    },
  ],
};
