import type { ExplorationRegionDefinition } from './explorationTypes';
import { WHITE_ACADEMY_PLAZA_ASSETS } from './explorationAssets';

const RECEPTION_HALL_BACKGROUND =
  '/assets/generated/chapter3/backgrounds/bg_ch3_reception_hall_v01.png';

export const CH3_HEARING_CHAMBER_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch3_white_hearing_chamber_approach',
  name: '白谱院 · 听证会通道',
  width: 1600,
  height: 900,
  playerSpawn: { x: 300, y: 700 },
  assets: {
    backgroundSrc: RECEPTION_HALL_BACKGROUND,
    playerSpriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFallbackSrc,
  },
  collisionZones: [
    { id: 'hearing-north-wall', x: 0, y: 0, width: 1600, height: 150 },
    { id: 'hearing-south-wall', x: 0, y: 800, width: 1600, height: 100 },
    { id: 'hearing-west-desk', x: 380, y: 240, width: 220, height: 165 },
    { id: 'hearing-center-columns', x: 735, y: 180, width: 150, height: 230 },
    { id: 'hearing-east-desk', x: 1050, y: 235, width: 210, height: 170 },
  ],
  waypoints: [
    { id: 'visitor_quarters_exit', position: { x: 300, y: 700 }, links: ['hearing_west_lane'] },
    { id: 'hearing_west_lane', position: { x: 610, y: 650 }, links: ['visitor_quarters_exit', 'hearing_center'] },
    { id: 'hearing_center', position: { x: 880, y: 625 }, links: ['hearing_west_lane', 'hearing_east_lane'] },
    { id: 'hearing_east_lane', position: { x: 1160, y: 620 }, links: ['hearing_center', 'hearing_chamber_door'] },
    { id: 'hearing_chamber_door', position: { x: 1370, y: 535 }, links: ['hearing_east_lane'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch3_reach_hearing_chamber',
      title: '前往中央大礼堂',
      description: '听证材料已经准备完毕。穿过接待层，前往中央大礼堂参加阿缇娅的身份听证。',
      completionText: '中央大礼堂就在门后。',
      target: { type: 'zone', id: 'ch3-hearing-chamber-door' },
    },
  ],
  initialQuestId: 'ch3_reach_hearing_chamber',
  interactionZones: [
    {
      id: 'ch3-hearing-notice-board',
      name: '听证日程牌',
      area: { x: 910, y: 210, width: 150, height: 150 },
      interactionText: '按 E 查看听证日程',
      statusText: '日程表将阿缇娅写作“未登记自然律者身份评估对象”。名字只出现在备注栏。',
    },
    {
      id: 'ch3-hearing-chamber-door',
      name: '中央大礼堂',
      area: { x: 1270, y: 440, width: 260, height: 220 },
      interactionText: '按 E 进入听证会场',
      statusText: '银色管风琴后的席位已经亮起。沈知微正在等候。',
      questCompleteId: 'ch3_reach_hearing_chamber',
      storySceneId: 'ch3_white_008',
    },
  ],
};
