import type { ExplorationRegionDefinition } from './explorationTypes';

const CH0_ALLEY_BACKGROUND =
  '/assets/generated/chapter0/backgrounds/bg_ch0_miansha_residential_alley_v01.png';
const CH0_PIANO_SQUARE_BACKGROUND =
  '/assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png';

const CH0_ANNING_SPRITE =
  '/assets/generated/chapter0/sprites/characters/char_ch0_anning_sprite_default_v02.png';
const CH0_TIYA_SPRITE =
  '/assets/generated/chapter0/sprites/characters/char_ch0_tiya_sprite_default_ai_v01.png';
const CH0_NOI_SPRITE =
  '/assets/generated/chapter0/sprites/characters/char_ch0_noi_sprite_default_v03.png';

const CH0_PRE_CONTRACT_PLAYER_SPRITES = {
  male: '/assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinche_sprite_pre_contract_v03.png',
  female: '/assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinsa_sprite_pre_contract_v03.png',
} as const;

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 900;

/**
 * Chapter 0 first exploration step.
 *
 * `chapter0_start` keeps all authored dialogue and its three canonical choices. Each
 * choice already routes to `ch0_001_road_entrance`; that physical arrival is what this
 * region replaces. Reaching the north end hands control back to the exact original
 * scene, where Noi is introduced and all choice effects remain owned by game.js.
 */
export const CH0_MIANSHA_ALLEY_REGION: ExplorationRegionDefinition = {
  id: 'ch0_miansha_road_entrance',
  name: '眠沙镇 · 入镇小巷',
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  playerSpawn: { x: 800, y: 760 },
  assets: {
    backgroundSrc: CH0_ALLEY_BACKGROUND,
    playerSpriteVariants: CH0_PRE_CONTRACT_PLAYER_SPRITES,
  },
  collisionZones: [
    { id: 'alley-left-facades', x: 0, y: 0, width: 300, height: 900 },
    { id: 'alley-right-facades', x: 1300, y: 0, width: 300, height: 900 },
    { id: 'alley-north-block', x: 300, y: 0, width: 1000, height: 145 },
  ],
  waypoints: [
    { id: 'alley_entry', position: { x: 800, y: 760 }, links: ['alley_mid'] },
    {
      id: 'alley_mid',
      position: { x: 800, y: 555 },
      links: ['alley_entry', 'anning_wait', 'tiya_wait', 'road_entrance'],
    },
    { id: 'anning_wait', position: { x: 980, y: 625 }, links: ['alley_mid'] },
    { id: 'tiya_wait', position: { x: 1080, y: 665 }, links: ['alley_mid'] },
    { id: 'road_entrance', position: { x: 800, y: 225 }, links: ['alley_mid'] },
  ],
  npcs: [
    {
      id: 'anning_ch0_road',
      name: '安柠',
      position: { x: 980, y: 625 },
      speed: 86,
      interactionText: '按 E 与安柠交谈',
      spriteSrc: CH0_ANNING_SPRITE,
      schedule: [
        { minuteOfDay: 0, targetWaypointId: 'anning_wait', activity: '警惕地观察街区' },
      ],
      mapDialogue: [
        { speaker: '安柠', text: '补给、换胎、找地方睡觉。别在这里耽搁太久。' },
      ],
    },
    {
      id: 'tiya_ch0_road',
      name: '缇雅',
      position: { x: 1080, y: 665 },
      speed: 74,
      interactionText: '按 E 与缇雅交谈',
      spriteSrc: CH0_TIYA_SPRITE,
      schedule: [
        { minuteOfDay: 0, targetWaypointId: 'tiya_wait', activity: '听着街区里的寂静' },
      ],
      mapDialogue: [
        { speaker: '缇雅', text: '这里不是没有歌……更像是都被关起来了。' },
      ],
    },
  ],
  quests: [
    {
      id: 'ch0_reach_road_entrance',
      title: '走进眠沙镇',
      description: '沿住宅区小巷前进，看看那片被命令保持安静的街区。',
      completionText: '已经进入眠沙镇。街口似乎有人注意到了修理车。',
      target: { type: 'zone', id: 'ch0-road-entrance' },
    },
  ],
  initialQuestId: 'ch0_reach_road_entrance',
  interactionZones: [
    {
      id: 'ch0-record-window',
      name: '唱片店橱窗',
      area: { x: 430, y: 340, width: 210, height: 150 },
      interactionText: '按 E 查看唱片店橱窗',
      statusText: '橱窗里摆着被刮花的黑胶。划痕几乎把音轨全部切断。',
    },
    {
      id: 'ch0-nailed-instrument-shop',
      name: '被钉死的乐器行',
      area: { x: 1010, y: 330, width: 220, height: 160 },
      interactionText: '按 E 查看乐器行',
      statusText: '木板和钉子把门封得严严实实，没有留下可以推开的缝隙。',
    },
    {
      id: 'ch0-road-entrance',
      name: '眠沙镇街口',
      area: { x: 650, y: 160, width: 300, height: 145 },
      interactionText: '按 E 继续进入眠沙镇',
      statusText: '半亮半灭的霓虹后，是一座主动压低了所有声音的镇子。',
      questCompleteId: 'ch0_reach_road_entrance',
      storySceneId: 'ch0_001_road_entrance',
    },
  ],
};

/**
 * After the canonical road-entrance meeting with Noi, `ch0_002_silent_town` is the
 * moment the party reaches the sealed piano. This region makes that approach physical
 * while keeping the canonical "one note / silent keys / reseal" branch untouched.
 */
export const CH0_MIANSHA_PIANO_SQUARE_REGION: ExplorationRegionDefinition = {
  id: 'ch0_miansha_sealed_piano_square',
  name: '眠沙镇 · 禁演钢琴广场',
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  playerSpawn: { x: 800, y: 760 },
  assets: {
    backgroundSrc: CH0_PIANO_SQUARE_BACKGROUND,
    playerSpriteVariants: CH0_PRE_CONTRACT_PLAYER_SPRITES,
  },
  collisionZones: [
    { id: 'square-west-edge', x: 0, y: 0, width: 230, height: 900 },
    { id: 'square-east-edge', x: 1370, y: 0, width: 230, height: 900 },
    { id: 'square-north-block', x: 230, y: 0, width: 1140, height: 135 },
  ],
  waypoints: [
    { id: 'square_entry', position: { x: 800, y: 760 }, links: ['square_mid'] },
    {
      id: 'square_mid',
      position: { x: 800, y: 555 },
      links: ['square_entry', 'sealed_piano', 'noi_wait', 'anning_square', 'tiya_square'],
    },
    { id: 'sealed_piano', position: { x: 800, y: 300 }, links: ['square_mid'] },
    { id: 'noi_wait', position: { x: 650, y: 500 }, links: ['square_mid'] },
    { id: 'anning_square', position: { x: 1030, y: 620 }, links: ['square_mid'] },
    { id: 'tiya_square', position: { x: 1120, y: 660 }, links: ['square_mid'] },
  ],
  npcs: [
    {
      id: 'noi_ch0_square',
      name: '诺伊',
      position: { x: 650, y: 500 },
      speed: 82,
      interactionText: '按 E 与诺伊交谈',
      spriteSrc: CH0_NOI_SPRITE,
      schedule: [
        { minuteOfDay: 0, targetWaypointId: 'noi_wait', activity: '盯着被封住的旧钢琴' },
      ],
      mapDialogue: [
        { speaker: '诺伊', text: '他们说，只要钢琴响，怪物就会来。' },
      ],
    },
    {
      id: 'anning_ch0_square',
      name: '安柠',
      position: { x: 1030, y: 620 },
      speed: 86,
      interactionText: '按 E 与安柠交谈',
      spriteSrc: CH0_ANNING_SPRITE,
      schedule: [
        { minuteOfDay: 0, targetWaypointId: 'anning_square', activity: '观察封条和撤离路线' },
      ],
      mapDialogue: [
        { speaker: '安柠', text: '只看。先别让任何东西真的响起来。' },
      ],
    },
    {
      id: 'tiya_ch0_square',
      name: '缇雅',
      position: { x: 1120, y: 660 },
      speed: 74,
      interactionText: '按 E 与缇雅交谈',
      spriteSrc: CH0_TIYA_SPRITE,
      schedule: [
        { minuteOfDay: 0, targetWaypointId: 'tiya_square', activity: '看着旧钢琴' },
      ],
      mapDialogue: [
        { speaker: '缇雅', text: '只看一眼。真的只看一眼。' },
      ],
    },
  ],
  quests: [
    {
      id: 'ch0_reach_sealed_piano',
      title: '查看禁演旧钢琴',
      description: '穿过广场，靠近被三层禁演封条缠住的旧钢琴。',
      completionText: '旧钢琴就在眼前。接下来怎么处理它，由你决定。',
      target: { type: 'zone', id: 'ch0-sealed-piano' },
    },
  ],
  initialQuestId: 'ch0_reach_sealed_piano',
  interactionZones: [
    {
      id: 'ch0-sealed-piano',
      name: '被封住的旧钢琴',
      area: { x: 650, y: 205, width: 300, height: 190 },
      interactionText: '按 E 查看禁演旧钢琴',
      statusText: '三层禁演封条缠在琴盖上。雨水下，风干蔷薇贴着封条轻轻颤动。',
      questCompleteId: 'ch0_reach_sealed_piano',
      storySceneId: 'ch0_002_silent_town',
    },
    {
      id: 'ch0-square-rose',
      name: '风干蔷薇',
      area: { x: 960, y: 340, width: 150, height: 120 },
      interactionText: '按 E 查看蔷薇',
      statusText: '花早已干了，却仍有人把它留在禁演封条旁。',
    },
  ],
};
