import type { ExplorationRegionDefinition } from './explorationTypes';

const SNOWFIELD_BACKGROUND =
  '/assets/generated/chapter2/backgrounds/bg_ch2_snowfield_observatory_approach_v01.png';
const OBSERVATORY_BACKGROUND =
  '/assets/generated/chapter2/backgrounds/bg_ch2_frost_score_observatory_exterior_v01.png';
const CORRIDOR_BACKGROUND =
  '/assets/generated/chapter2/backgrounds/bg_ch2_crystal_resonance_corridor_v01.png';

const EXTERIOR_WIDTH = 1800;
const EXTERIOR_HEIGHT = 1100;

const EXTERIOR_COLLISIONS = [
  { id: 'snow-west-ridge', x: 0, y: 0, width: 260, height: 1100 },
  { id: 'snow-east-ridge', x: 1540, y: 0, width: 260, height: 1100 },
  { id: 'snow-north-tower-left', x: 260, y: 0, width: 520, height: 245 },
  { id: 'snow-north-tower-right', x: 1020, y: 0, width: 520, height: 245 },
  { id: 'snow-west-drift', x: 405, y: 520, width: 245, height: 145 },
  { id: 'snow-east-drift', x: 1160, y: 480, width: 220, height: 150 },
] as const;

const EXTERIOR_WAYPOINTS = [
  { id: 'snow_entry', position: { x: 900, y: 965 }, links: ['snow_lower'] },
  { id: 'snow_lower', position: { x: 900, y: 790 }, links: ['snow_entry', 'snow_west', 'snow_east'] },
  { id: 'snow_west', position: { x: 720, y: 650 }, links: ['snow_lower', 'snow_mid_west'] },
  { id: 'snow_east', position: { x: 1080, y: 650 }, links: ['snow_lower', 'snow_mid_east'] },
  { id: 'snow_mid_west', position: { x: 720, y: 405 }, links: ['snow_west', 'snow_tower_gate'] },
  { id: 'snow_mid_east', position: { x: 1080, y: 405 }, links: ['snow_east', 'snow_tower_gate'] },
  { id: 'snow_tower_gate', position: { x: 900, y: 315 }, links: ['snow_mid_west', 'snow_mid_east'] },
] as const;

function exteriorBase(
  id: string,
  name: string,
  backgroundSrc: string,
  spawn: { x: number; y: number },
): Omit<ExplorationRegionDefinition, 'quests' | 'interactionZones' | 'initialQuestId'> {
  return {
    id,
    name,
    width: EXTERIOR_WIDTH,
    height: EXTERIOR_HEIGHT,
    playerSpawn: { ...spawn },
    assets: { backgroundSrc },
    collisionZones: EXTERIOR_COLLISIONS.map((zone) => ({ ...zone })),
    waypoints: EXTERIOR_WAYPOINTS.map((waypoint) => ({
      ...waypoint,
      position: { ...waypoint.position },
      links: [...waypoint.links],
    })),
    npcs: [],
  };
}

/** After the authored two-day snow trek, make the final approach to the tower physical. */
export const CH2_OBSERVATORY_SNOW_APPROACH_REGION: ExplorationRegionDefinition = {
  ...exteriorBase(
    'ch2_observatory_snow_approach',
    '雪岭无人区 · 冻谱观测塔远眺',
    SNOWFIELD_BACKGROUND,
    { x: 900, y: 965 },
  ),
  quests: [
    {
      id: 'ch2_reach_observatory',
      title: '抵达冻谱观测塔',
      description: '穿过最后一段雪幕，靠近远处冻结音叉般的观测塔。',
      completionText: '冻谱观测塔终于完整出现在雪幕尽头。',
      target: { type: 'zone', id: 'ch2-observatory-overlook' },
    },
  ],
  initialQuestId: 'ch2_reach_observatory',
  interactionZones: [
    {
      id: 'ch2-frozen-track',
      name: '冻住的履带痕',
      area: { x: 690, y: 705, width: 170, height: 110 },
      interactionText: '按 E 查看履带痕',
      statusText: '旧履带痕被新雪盖住大半，方向和冻谱观测塔完全一致。',
    },
    {
      id: 'ch2-observatory-overlook',
      name: '观测塔外缘',
      area: { x: 785, y: 260, width: 230, height: 125 },
      interactionText: '按 E 靠近观测塔',
      statusText: '白色晶体塔身仍有微弱待机灯亮着，说明内部系统并未完全死去。',
      questCompleteId: 'ch2_reach_observatory',
      storySceneId: 'ch2_snow_002',
    },
  ],
};

/** Both authored ch2_snow_002 choices converge here after their original effects apply. */
export const CH2_OBSERVATORY_MAIN_DOOR_REGION: ExplorationRegionDefinition = {
  ...exteriorBase(
    'ch2_observatory_main_door',
    '冻谱观测塔 · 外环',
    OBSERVATORY_BACKGROUND,
    { x: 900, y: 690 },
  ),
  quests: [
    {
      id: 'ch2_reach_observatory_door',
      title: '前往观测塔主门',
      description: '完成外围判断后，前往仍有供能反应的观测塔主门。',
      completionText: '主门封锁铭牌仍在供能。塔内传来二十三年前没有停止的机械声。',
      target: { type: 'zone', id: 'ch2-observatory-main-door' },
    },
  ],
  initialQuestId: 'ch2_reach_observatory_door',
  interactionZones: [
    {
      id: 'ch2-frozen-antenna-base',
      name: '冻结音叉天线',
      area: { x: 1130, y: 400, width: 170, height: 125 },
      interactionText: '按 E 查看天线基座',
      statusText: '天线没有工作，却仍维持着极弱的谱核共振。',
    },
    {
      id: 'ch2-observatory-main-door',
      name: '观测塔主门',
      area: { x: 785, y: 250, width: 230, height: 135 },
      interactionText: '按 E 读取封锁铭牌并进入',
      statusText: '封锁铭牌仍在运行。零号奏者计划的旧接口就在门后。',
      questCompleteId: 'ch2_reach_observatory_door',
      storySceneId: 'ch2_snow_003',
    },
  ],
};

const CORRIDOR_WIDTH = 1750;
const CORRIDOR_HEIGHT = 1000;

/** All ch2_snow_005 side/minigame routes converge on the same deeper corridor. */
export const CH2_CRYSTAL_CORRIDOR_GUARDIAN_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch2_crystal_corridor_guardian_approach',
  name: '冻谱观测塔 · 晶体回廊',
  width: CORRIDOR_WIDTH,
  height: CORRIDOR_HEIGHT,
  playerSpawn: { x: 875, y: 885 },
  assets: { backgroundSrc: CORRIDOR_BACKGROUND },
  collisionZones: [
    { id: 'corridor-west-wall', x: 0, y: 0, width: 250, height: 1000 },
    { id: 'corridor-east-wall', x: 1500, y: 0, width: 250, height: 1000 },
    { id: 'corridor-north-left', x: 250, y: 0, width: 500, height: 145 },
    { id: 'corridor-north-right', x: 1000, y: 0, width: 500, height: 145 },
    { id: 'corridor-west-crystals', x: 390, y: 410, width: 235, height: 190 },
    { id: 'corridor-east-crystals', x: 1125, y: 385, width: 235, height: 205 },
    { id: 'corridor-center-rack', x: 760, y: 500, width: 230, height: 130 },
  ],
  waypoints: [
    { id: 'corridor_entry', position: { x: 875, y: 885 }, links: ['corridor_south'] },
    { id: 'corridor_south', position: { x: 875, y: 735 }, links: ['corridor_entry', 'corridor_west', 'corridor_east'] },
    { id: 'corridor_west', position: { x: 690, y: 650 }, links: ['corridor_south', 'corridor_mid_west'] },
    { id: 'corridor_east', position: { x: 1060, y: 650 }, links: ['corridor_south', 'corridor_mid_east'] },
    { id: 'corridor_mid_west', position: { x: 690, y: 345 }, links: ['corridor_west', 'corridor_guardian'] },
    { id: 'corridor_mid_east', position: { x: 1060, y: 345 }, links: ['corridor_east', 'corridor_guardian'] },
    { id: 'corridor_guardian', position: { x: 875, y: 225 }, links: ['corridor_mid_west', 'corridor_mid_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch2_reach_guardian_area',
      title: '深入晶体回廊',
      description: '完成观测塔内的准备后，沿晶体回廊前往守卫兽活动区域。',
      completionText: '前方冰锥之间传来不完整的和弦。守卫兽已经醒了。',
      target: { type: 'zone', id: 'ch2-guardian-area' },
    },
  ],
  initialQuestId: 'ch2_reach_guardian_area',
  interactionZones: [
    {
      id: 'ch2-resonance-rack',
      name: '悬浮冰锥谱架',
      area: { x: 785, y: 650, width: 180, height: 105 },
      interactionText: '按 E 查看谱架',
      statusText: '冰锥会对脚步声作出轻微回应。这里的谱鸣共振仍在监测移动。',
    },
    {
      id: 'ch2-guardian-area',
      name: '守卫兽活动区域',
      area: { x: 745, y: 155, width: 260, height: 155 },
      interactionText: '按 E 继续深入',
      statusText: '骨架般的谱架结构在冰锥后方移动。继续靠近就会进入遭遇。',
      questCompleteId: 'ch2_reach_guardian_area',
      storySceneId: 'ch2_snow_006',
    },
  ],
};
