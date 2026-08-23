import type { ExplorationRegionDefinition } from './explorationTypes';

const CH0_TOWN_SQUARE_BACKGROUND =
  '/assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png';

const WIDTH = 1600;
const HEIGHT = 900;

const SHARED_COLLISIONS = [
  { id: 'post-north-left-buildings', x: 0, y: 0, width: 635, height: 145 },
  { id: 'post-north-right-buildings', x: 965, y: 0, width: 635, height: 145 },
  { id: 'post-west-upper-buildings', x: 0, y: 145, width: 215, height: 245 },
  { id: 'post-west-lower-buildings', x: 0, y: 570, width: 215, height: 330 },
  { id: 'post-east-upper-buildings', x: 1385, y: 145, width: 215, height: 270 },
  { id: 'post-east-lower-buildings', x: 1385, y: 610, width: 215, height: 290 },
  { id: 'post-sealed-piano', x: 705, y: 430, width: 190, height: 175 },
] as const;

const SHARED_WAYPOINTS = [
  { id: 'post_theater', position: { x: 500, y: 760 }, links: ['post_south_mid'] },
  {
    id: 'post_south_mid',
    position: { x: 800, y: 760 },
    links: ['post_theater', 'post_diner', 'post_square_south'],
  },
  { id: 'post_diner', position: { x: 1180, y: 730 }, links: ['post_south_mid'] },
  { id: 'post_square_south', position: { x: 800, y: 660 }, links: ['post_south_mid'] },
] as const;

function baseRegion(
  id: string,
  spawn: { x: number; y: number },
): Omit<ExplorationRegionDefinition, 'quests' | 'interactionZones' | 'initialQuestId'> {
  return {
    id,
    name: '眠沙镇 · 镇中心',
    width: WIDTH,
    height: HEIGHT,
    playerSpawn: { ...spawn },
    assets: {
      backgroundSrc: CH0_TOWN_SQUARE_BACKGROUND,
      // Deliberately no chapter-0 pre-contract override here. ch0_015_first_baton has
      // already happened, so ExplorationRuntime falls back to the normal protagonist
      // exploration sprite selected by gender.
    },
    collisionZones: SHARED_COLLISIONS.map((zone) => ({ ...zone })),
    waypoints: SHARED_WAYPOINTS.map((waypoint) => ({
      ...waypoint,
      position: { ...waypoint.position },
      links: [...waypoint.links],
    })),
    npcs: [],
  };
}

/**
 * The stage-crawler battle canonically jumps straight to ch0_018 in the diner. This
 * bridge preserves the battle result but makes the physical retreat from the theater
 * to the shelter player-controlled.
 */
export const CH0_POST_BATTLE_DINER_RETREAT_REGION: ExplorationRegionDefinition = {
  ...baseRegion('ch0_post_battle_diner_retreat', { x: 500, y: 760 }),
  quests: [
    {
      id: 'ch0_retreat_to_diner',
      title: '撤回餐馆避难所',
      description: '舞台爬行者已经倒下。穿过镇中心，先回餐馆避难所稍作整理。',
      completionText: '已经回到餐馆避难所。',
      target: { type: 'zone', id: 'ch0-post-diner-door' },
    },
  ],
  initialQuestId: 'ch0_retreat_to_diner',
  interactionZones: [
    {
      id: 'ch0-post-square-after-battle',
      name: '战后的广场',
      area: { x: 720, y: 610, width: 160, height: 100 },
      interactionText: '按 E 查看广场',
      statusText: '静默还没有结束，但刚才剧场里的震动已经停了下来。',
    },
    {
      id: 'ch0-post-diner-door',
      name: '餐馆避难所',
      area: { x: 1080, y: 655, width: 220, height: 165 },
      interactionText: '按 E 进入餐馆避难所',
      statusText: '旧餐馆的灯还亮着。先进去确认所有人的状态。',
      questCompleteId: 'ch0_retreat_to_diner',
      storySceneId: 'ch0_018_teabreak_not_tiya',
    },
  ],
};

/**
 * Every canonical choice in ch0_018 routes to ch0_019. Instead of teleporting back to
 * the theater, the player follows the knocking sound across the same town centre.
 */
export const CH0_RETURN_TO_CHARON_THEATER_REGION: ExplorationRegionDefinition = {
  ...baseRegion('ch0_return_to_charon_theater', { x: 1180, y: 730 }),
  quests: [
    {
      id: 'ch0_follow_knock_to_theater',
      title: '循声返回旧剧场',
      description: '旧剧场方向传来规律的敲击声。穿过镇中心，返回后台确认来源。',
      completionText: '敲击声就在旧剧场后台。',
      target: { type: 'zone', id: 'ch0-post-theater-door' },
    },
  ],
  initialQuestId: 'ch0_follow_knock_to_theater',
  interactionZones: [
    {
      id: 'ch0-post-sealed-piano-after-battle',
      name: '广场旧钢琴',
      area: { x: 920, y: 475, width: 125, height: 115 },
      interactionText: '按 E 看向旧钢琴',
      statusText: '封条仍贴在琴盖上。真正的敲击声来自更远的旧剧场。',
    },
    {
      id: 'ch0-post-theater-door',
      name: '旧剧场后台入口',
      area: { x: 390, y: 685, width: 220, height: 165 },
      interactionText: '按 E 返回旧剧场后台',
      statusText: '敲击声隔着门板传来。节拍稳定得不像偶然。',
      questCompleteId: 'ch0_follow_knock_to_theater',
      storySceneId: 'ch0_019_charron_revealed',
    },
  ],
};
