import type { ExplorationRegionDefinition } from './explorationTypes';

const CH0_ALLEY_BACKGROUND =
  '/assets/generated/chapter0/backgrounds/bg_ch0_miansha_residential_alley_v01.png';
const CH0_PIANO_SQUARE_BACKGROUND =
  '/assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png';
const ANNING_SPRITE =
  '/assets/generated/character_states/sprites/char_anning_sprite_default_v04.png';
const TIYA_SPRITE =
  '/assets/generated/character_states/sprites/char_tiya_sprite_default_v04.png';

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 900;

/**
 * First chapter-0 exploration slice.
 *
 * The authored opening scene remains canonical. ch0_001 and ch0_003 are intercepted
 * only when the story asks the player to perform a physical action: inspect the silent
 * street, then move toward the town centre. Completing an objective hands control back
 * to the original SCENES entry with interception bypassed.
 */
export const CH0_MIANSHA_ALLEY_REGION: ExplorationRegionDefinition = {
  id: 'ch0_miansha_residential_alley',
  name: '眠沙镇 · 住宅区小巷',
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  playerSpawn: { x: 800, y: 760 },
  assets: {
    backgroundSrc: CH0_ALLEY_BACKGROUND,
  },
  // Keep the first tutorial corridor intentionally forgiving. The background is a
  // cinematic perspective illustration, so collision protects the building edges
  // while leaving a broad central walking lane.
  collisionZones: [
    { id: 'alley-left-facades', x: 0, y: 0, width: 300, height: 900 },
    { id: 'alley-right-facades', x: 1300, y: 0, width: 300, height: 900 },
    { id: 'alley-north-buildings', x: 300, y: 0, width: 1000, height: 150 },
  ],
  waypoints: [
    { id: 'alley_entry', position: { x: 800, y: 760 }, links: ['alley_mid'] },
    {
      id: 'alley_mid',
      position: { x: 800, y: 570 },
      links: ['alley_entry', 'metal_plate', 'anning_wait', 'tiya_wait', 'town_exit'],
    },
    { id: 'metal_plate', position: { x: 610, y: 430 }, links: ['alley_mid'] },
    { id: 'anning_wait', position: { x: 930, y: 610 }, links: ['alley_mid'] },
    { id: 'tiya_wait', position: { x: 1010, y: 650 }, links: ['alley_mid'] },
    { id: 'town_exit', position: { x: 800, y: 225 }, links: ['alley_mid'] },
  ],
  npcs: [
    {
      id: 'anning_ch0_alley',
      name: '安柠',
      position: { x: 930, y: 610 },
      speed: 86,
      interactionText: '按 E 与安柠交谈',
      spriteSrc: ANNING_SPRITE,
      schedule: [
        { minuteOfDay: 0, targetWaypointId: 'anning_wait', activity: '留意四周' },
      ],
      mapDialogue: [
        { speaker: '安柠', text: '先别走太远。这里安静得不太正常。' },
      ],
    },
    {
      id: 'tiya_ch0_alley',
      name: '缇雅',
      position: { x: 1010, y: 650 },
      speed: 74,
      interactionText: '按 E 与缇雅交谈',
      spriteSrc: TIYA_SPRITE,
      schedule: [
        { minuteOfDay: 0, targetWaypointId: 'tiya_wait', activity: '安静地跟着安柠' },
      ],
      mapDialogue: [
        { speaker: '缇雅', text: '……连钟声都没有。' },
      ],
    },
  ],
  quests: [
    {
      id: 'ch0_inspect_silent_alley',
      title: '调查寂静的街区',
      description: '沿小巷查看异常。那块停在黑暗里的澪铁板似乎值得确认。',
      completionText: '街区没有灯火，钟表也停了。先确认澪铁板上的状况。',
      nextQuestId: 'ch0_follow_tiya_to_square',
      target: { type: 'zone', id: 'ch0-metal-plate' },
    },
    {
      id: 'ch0_follow_tiya_to_square',
      title: '前往镇中心',
      description: '沿住宅区小巷向北走，跟着缇雅前往老钢琴所在的广场。',
      completionText: '已经走到通往镇中心的路口。',
      target: { type: 'zone', id: 'ch0-town-exit' },
    },
  ],
  initialQuestId: 'ch0_inspect_silent_alley',
  interactionZones: [
    {
      id: 'ch0-metal-plate',
      name: '澪铁板',
      area: { x: 500, y: 355, width: 225, height: 155 },
      interactionText: '按 E 查看澪铁板',
      statusText: '窗户紧闭，钟表停摆，街区里没有一盏灯亮着。',
      questCompleteId: 'ch0_inspect_silent_alley',
      storySceneId: 'ch0_001',
    },
    {
      id: 'ch0-dark-window',
      name: '紧闭的窗户',
      area: { x: 1040, y: 340, width: 180, height: 150 },
      interactionText: '按 E 查看窗户',
      statusText: '玻璃后没有灯，也没有人影。整条街像被夜色按下了静音。',
    },
    {
      id: 'ch0-town-exit',
      name: '通往镇中心的路',
      area: { x: 650, y: 165, width: 300, height: 145 },
      interactionText: '按 E 前往镇中心',
      statusText: '前方就是眠沙镇中心。缇雅提到的老钢琴应该就在那边。',
      questCompleteId: 'ch0_follow_tiya_to_square',
      storySceneId: 'ch0_003',
    },
  ],
};

export const CH0_MIANSHA_PIANO_SQUARE_REGION: ExplorationRegionDefinition = {
  id: 'ch0_miansha_piano_square',
  name: '眠沙镇 · 老钢琴广场',
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  playerSpawn: { x: 800, y: 760 },
  assets: {
    backgroundSrc: CH0_PIANO_SQUARE_BACKGROUND,
  },
  collisionZones: [
    { id: 'square-west-edge', x: 0, y: 0, width: 230, height: 900 },
    { id: 'square-east-edge', x: 1370, y: 0, width: 230, height: 900 },
    { id: 'square-north-buildings', x: 230, y: 0, width: 1140, height: 135 },
  ],
  waypoints: [
    { id: 'square_entry', position: { x: 800, y: 760 }, links: ['square_mid'] },
    {
      id: 'square_mid',
      position: { x: 800, y: 555 },
      links: ['square_entry', 'old_piano', 'square_west', 'square_east'],
    },
    { id: 'old_piano', position: { x: 800, y: 315 }, links: ['square_mid'] },
    { id: 'square_west', position: { x: 470, y: 560 }, links: ['square_mid'] },
    { id: 'square_east', position: { x: 1130, y: 560 }, links: ['square_mid'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch0_reach_old_piano',
      title: '靠近老钢琴',
      description: '穿过空荡的广场，看看那架被留在镇中心的旧钢琴。',
      completionText: '老钢琴就在眼前。附近似乎还有另一个人。',
      target: { type: 'zone', id: 'ch0-old-piano' },
    },
  ],
  initialQuestId: 'ch0_reach_old_piano',
  interactionZones: [
    {
      id: 'ch0-old-piano',
      name: '老钢琴',
      area: { x: 650, y: 220, width: 300, height: 190 },
      interactionText: '按 E 靠近老钢琴',
      statusText: '琴盖附近落着薄灰。一个陌生的身影就在钢琴旁。',
      questCompleteId: 'ch0_reach_old_piano',
      storySceneId: 'ch0_004',
    },
    {
      id: 'ch0-silent-square',
      name: '空荡的广场',
      area: { x: 1030, y: 490, width: 190, height: 150 },
      interactionText: '按 E 观察广场',
      statusText: '没有叫卖声，也没有晚归的人。只剩脚步声在广场上显得格外清楚。',
    },
  ],
};
