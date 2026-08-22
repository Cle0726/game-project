import type { ExplorationRegionDefinition } from './explorationTypes';
import { WHITE_ACADEMY_PLAZA_ASSETS } from './explorationAssets';

export const PROTOTYPE_REGION: ExplorationRegionDefinition = {
  id: 'white_academy_plaza',
  name: '白谱院前广场',
  width: 2200,
  height: 1400,
  // Spawn on the open southeast approach of the approved plaza artwork.
  playerSpawn: { x: 1700, y: 1120 },
  assets: {
    backgroundSrc: WHITE_ACADEMY_PLAZA_ASSETS.backgroundSrc,
    playerSpriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFallbackSrc,
  },
  // Invisible collision follows the major architecture in the dedicated plaza art.
  // Stairs and walkable stone paths stay open; solid building masses, fountain and
  // planted garden beds are blocked.
  collisionZones: [
    { id: 'academy-north-left', x: 0, y: 0, width: 420, height: 320 },
    { id: 'academy-north-main', x: 420, y: 0, width: 760, height: 170 },
    { id: 'academy-left-flowerbed', x: 340, y: 170, width: 250, height: 145 },
    { id: 'academy-right-flowerbed', x: 875, y: 170, width: 245, height: 145 },
    { id: 'east-chapel-main', x: 1660, y: 0, width: 540, height: 650 },
    { id: 'east-chapel-garden', x: 1880, y: 615, width: 320, height: 250 },
    { id: 'central-fountain', x: 690, y: 430, width: 520, height: 390 },
    { id: 'southwest-terrace', x: 0, y: 760, width: 330, height: 640 },
    { id: 'south-garden-west', x: 600, y: 930, width: 380, height: 220 },
    { id: 'south-garden-east', x: 1050, y: 920, width: 430, height: 235 },
    { id: 'south-gazebo-core', x: 900, y: 1130, width: 280, height: 270 },
    { id: 'southeast-wall', x: 1870, y: 1040, width: 330, height: 360 },
  ],
  waypoints: [
    { id: 'south_east_entry', position: { x: 1700, y: 1120 }, links: ['garden_east', 'milo_rest'] },
    { id: 'garden_east', position: { x: 1530, y: 1050 }, links: ['south_east_entry', 'garden_corner', 'atya_rest'] },
    { id: 'garden_corner', position: { x: 1540, y: 885 }, links: ['garden_east', 'south_plaza'] },
    { id: 'south_plaza', position: { x: 1350, y: 865 }, links: ['garden_corner', 'fountain_east'] },
    { id: 'fountain_east', position: { x: 1325, y: 690 }, links: ['south_plaza', 'east_mid', 'academy_east'] },
    { id: 'east_mid', position: { x: 1500, y: 725 }, links: ['fountain_east', 'milo_patrol', 'chapel_south'] },
    { id: 'chapel_south', position: { x: 1640, y: 840 }, links: ['east_mid', 'milo_rest'] },
    { id: 'milo_rest', position: { x: 1710, y: 910 }, links: ['south_east_entry', 'chapel_south'] },
    { id: 'milo_patrol', position: { x: 1510, y: 615 }, links: ['east_mid', 'academy_east'] },
    { id: 'academy_east', position: { x: 1270, y: 355 }, links: ['fountain_east', 'milo_patrol', 'fountain_north'] },
    { id: 'fountain_north', position: { x: 1040, y: 350 }, links: ['academy_east', 'academy_gate'] },
    { id: 'academy_gate', position: { x: 760, y: 360 }, links: ['fountain_north'] },
    { id: 'atya_rest', position: { x: 1550, y: 1020 }, links: ['garden_east'] },
  ],
  quests: [
    {
      id: 'find_milo',
      title: '寻找弥洛',
      description: '在白谱院前广场找到弥洛，确认进入白谱院前的安排。',
      completionText: '已与弥洛会合。下一步：去调律喷泉查看广场中央的异常回响。',
      nextQuestId: 'inspect_fountain',
      target: { type: 'npc', id: 'milo' },
    },
    {
      id: 'inspect_fountain',
      title: '调查调律喷泉',
      description: '沿花园外侧前往中央喷泉，调查水声中断续出现的失谐旋律。',
      completionText: '喷泉的回响已经确认。下一步：沿北侧石路前往白谱院主阶。',
      nextQuestId: 'enter_academy',
      target: { type: 'zone', id: 'fountain-inspect' },
    },
    {
      id: 'enter_academy',
      title: '进入白谱院',
      description: '沿喷泉北侧走上主阶，从白谱院正门继续第三章剧情。',
      completionText: '已抵达白谱院正门。',
      target: { type: 'zone', id: 'academy-main-door' },
    },
  ],
  initialQuestId: 'find_milo',
  interactionZones: [
    {
      id: 'academy-main-door',
      name: '白谱院正门',
      area: { x: 650, y: 180, width: 225, height: 205 },
      interactionText: '按 E 进入白谱院',
      statusText: '白谱院的主阶就在眼前。门扉之后，原有第三章剧情将继续。',
      storySceneId: 'chapter3_white_start',
      questCompleteId: 'enter_academy',
    },
    {
      id: 'fountain-inspect',
      name: '调律喷泉',
      area: { x: 1205, y: 540, width: 145, height: 225 },
      interactionText: '按 E 调查喷泉',
      statusText: '水声里夹着一段极短的失谐回响，像是从白谱院内部折回来。',
      questCompleteId: 'inspect_fountain',
    },
    {
      id: 'chapel-inspect',
      name: '东侧礼拜堂',
      area: { x: 1585, y: 690, width: 110, height: 160 },
      interactionText: '按 E 查看礼拜堂入口',
      statusText: '礼拜堂侧门暂时关闭。门缝里没有灯光，只有巡查留下的脚步声。',
    },
  ],
  npcs: [
    {
      id: 'atya',
      name: '阿缇娅',
      position: { x: 1550, y: 1020 },
      speed: 95,
      spriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.atyaSrc,
      interactionText: '按 E 与阿缇娅交谈',
      mapDialogue: [
        { speaker: '阿缇娅', text: '弥洛刚才往礼拜堂外侧去了。先和他会合吧。' },
        { speaker: '阿缇娅', text: '我会留意广场这边的动静。' },
      ],
      schedule: [
        { minuteOfDay: 480, targetWaypointId: 'atya_rest', activity: '观察白谱院' },
        { minuteOfDay: 660, targetWaypointId: 'south_plaza', activity: '沿花园外侧散步' },
        { minuteOfDay: 900, targetWaypointId: 'fountain_east', activity: '在喷泉旁等待' },
        { minuteOfDay: 1080, targetWaypointId: 'atya_rest', activity: '回到入口附近' },
      ],
    },
    {
      id: 'milo',
      name: '弥洛',
      position: { x: 1710, y: 910 },
      speed: 105,
      spriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.miloSrc,
      interactionText: '按 E 与弥洛交谈',
      questCompleteId: 'find_milo',
      mapDialogue: [
        { speaker: '弥洛', text: '你来了。我已经把礼拜堂外侧和主阶附近看过一遍。' },
        { speaker: '弥洛', text: '先去中央喷泉看看。那边的回响有点不对，确认后我们再进白谱院。' },
      ],
      schedule: [
        { minuteOfDay: 480, targetWaypointId: 'milo_rest', activity: '检查装备' },
        { minuteOfDay: 600, targetWaypointId: 'milo_patrol', activity: '巡视礼拜堂外侧' },
        { minuteOfDay: 780, targetWaypointId: 'academy_east', activity: '观察白谱院主阶' },
        { minuteOfDay: 960, targetWaypointId: 'milo_rest', activity: '等待奏者会合' },
        { minuteOfDay: 1140, targetWaypointId: 'academy_gate', activity: '准备进入白谱院' },
      ],
    },
  ],
};
