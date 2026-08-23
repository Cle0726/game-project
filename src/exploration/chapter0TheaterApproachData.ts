import type { ExplorationRegionDefinition } from './explorationTypes';

const CH0_THEATER_STAGE_BACKGROUND =
  '/assets/generated/chapter0/backgrounds/bg_ch0_abandoned_theater_stage_v01.png';
const CH0_PRE_CONTRACT_PLAYER_SPRITES = {
  male: '/assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinche_sprite_pre_contract_v03.png',
  female: '/assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinsa_sprite_pre_contract_v03.png',
} as const;

/**
 * Physical lead-in to ch0_013_forbidden_performance.
 *
 * The canonical scene still owns Noi's condition, Tiya's decision, the fourth beat,
 * all state effects, and the transition into Atya's awakening. This region only makes
 * the urgent return to the old theater and the walk onto the stage player-controlled.
 */
export const CH0_FORBIDDEN_PERFORMANCE_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch0_forbidden_performance_theater_approach',
  name: '眠沙镇 · 旧剧场主舞台',
  width: 1600,
  height: 900,
  playerSpawn: { x: 800, y: 790 },
  assets: {
    backgroundSrc: CH0_THEATER_STAGE_BACKGROUND,
    playerSpriteVariants: CH0_PRE_CONTRACT_PLAYER_SPRITES,
  },
  collisionZones: [
    { id: 'theater-west-wing', x: 0, y: 0, width: 250, height: 900 },
    { id: 'theater-east-wing', x: 1350, y: 0, width: 250, height: 900 },
    { id: 'theater-back-wall-left', x: 250, y: 0, width: 480, height: 145 },
    { id: 'theater-back-wall-right', x: 870, y: 0, width: 480, height: 145 },
    { id: 'theater-prop-west', x: 350, y: 330, width: 210, height: 190 },
    { id: 'theater-prop-east', x: 1040, y: 330, width: 210, height: 190 },
  ],
  waypoints: [
    { id: 'theater_entry', position: { x: 800, y: 790 }, links: ['theater_aisle'] },
    {
      id: 'theater_aisle',
      position: { x: 800, y: 650 },
      links: ['theater_entry', 'theater_stage_south', 'theater_curtain_west', 'theater_curtain_east'],
    },
    {
      id: 'theater_stage_south',
      position: { x: 800, y: 515 },
      links: ['theater_aisle', 'theater_stage_focus'],
    },
    {
      id: 'theater_stage_focus',
      position: { x: 800, y: 285 },
      links: ['theater_stage_south'],
    },
    {
      id: 'theater_curtain_west',
      position: { x: 620, y: 610 },
      links: ['theater_aisle'],
    },
    {
      id: 'theater_curtain_east',
      position: { x: 980, y: 610 },
      links: ['theater_aisle'],
    },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch0_reach_forbidden_performance_stage',
      title: '赶回旧剧场',
      description: '穿过旧剧场，走上主舞台。诺伊和那架旧钢琴就在前面。',
      completionText: '已经抵达主舞台。禁曲的最后一拍即将落下。',
      target: { type: 'zone', id: 'ch0-forbidden-stage-focus' },
    },
  ],
  initialQuestId: 'ch0_reach_forbidden_performance_stage',
  interactionZones: [
    {
      id: 'ch0-theater-curtain',
      name: '破旧幕布',
      area: { x: 580, y: 555, width: 150, height: 120 },
      interactionText: '按 E 查看幕布',
      statusText: '幕布受潮发沉，边缘仍留着过去演出的金线。',
    },
    {
      id: 'ch0-forbidden-stage-focus',
      name: '主舞台旧钢琴',
      area: { x: 690, y: 205, width: 220, height: 175 },
      interactionText: '按 E 走近旧钢琴',
      statusText: '诺伊倒在旧钢琴旁。舞台上的静默正在被第四拍撕开。',
      questCompleteId: 'ch0_reach_forbidden_performance_stage',
      storySceneId: 'ch0_013_forbidden_performance',
    },
  ],
};
