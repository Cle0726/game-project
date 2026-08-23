import type {
  ExplorationInteractionZone,
  ExplorationRegionDefinition,
} from './explorationTypes';

const CH0_TOWN_HUB_BACKGROUND =
  '/assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png';
const CH0_ANNING_SPRITE =
  '/assets/generated/chapter0/sprites/characters/char_ch0_anning_sprite_default_v02.png';
const CH0_TIYA_SPRITE =
  '/assets/generated/chapter0/sprites/characters/char_ch0_tiya_sprite_default_ai_v01.png';
const CH0_PRE_CONTRACT_PLAYER_SPRITES = {
  male: '/assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinche_sprite_pre_contract_v03.png',
  female: '/assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinsa_sprite_pre_contract_v03.png',
} as const;

const HUB_WIDTH = 1600;
const HUB_HEIGHT = 900;

type TownHubTargetKey = 'school' | 'recordShop' | 'theater' | 'clocktower';

interface TownHubDestination {
  key: TownHubTargetKey;
  sceneId: string;
  questId: string;
  questTitle: string;
  questDescription: string;
  completionText: string;
  zoneId: string;
  name: string;
  area: { x: number; y: number; width: number; height: number };
  activeInteractionText: string;
  inactiveInteractionText: string;
  activeStatusText: string;
  inactiveStatusText: string;
}

const HUB_DESTINATIONS: Record<TownHubTargetKey, TownHubDestination> = {
  school: {
    key: 'school',
    sceneId: 'ch0_009_silent_school',
    questId: 'ch0_hub_reach_school',
    questTitle: '前往废弃学校',
    questDescription: '从镇中心向西走，去废弃学校确认孩子们的情况。',
    completionText: '已经到达废弃学校。',
    zoneId: 'ch0-hub-school-gate',
    name: '废弃学校',
    area: { x: 245, y: 365, width: 190, height: 170 },
    activeInteractionText: '按 E 进入废弃学校',
    inactiveInteractionText: '按 E 查看废弃学校方向',
    activeStatusText: '音乐教室就在里面。先确认孩子们是否安全。',
    inactiveStatusText: '废弃学校在镇中心西侧。路线已经记下。',
  },
  recordShop: {
    key: 'recordShop',
    sceneId: 'ch0_010_record_shop',
    questId: 'ch0_hub_reach_record_shop',
    questTitle: '前往唱片店',
    questDescription: '穿过镇中心向东走，去唱片店调查被刮花的旧黑胶。',
    completionText: '已经到达唱片店。',
    zoneId: 'ch0-hub-record-shop',
    name: '唱片店',
    area: { x: 1175, y: 420, width: 195, height: 170 },
    activeInteractionText: '按 E 进入唱片店',
    inactiveInteractionText: '按 E 查看唱片店方向',
    activeStatusText: '旧招牌下的门还留着一道缝。地下柜应该就在里面。',
    inactiveStatusText: '唱片店在镇中心东侧。路线已经记下。',
  },
  theater: {
    key: 'theater',
    sceneId: 'ch0_011_backstage_dress',
    questId: 'ch0_hub_reach_theater',
    questTitle: '前往旧剧场',
    questDescription: '从广场往西南绕行，去旧剧场后台继续调查。',
    completionText: '已经到达旧剧场后台入口。',
    zoneId: 'ch0-hub-theater-door',
    name: '旧剧场后台',
    area: { x: 390, y: 685, width: 220, height: 165 },
    activeInteractionText: '按 E 进入旧剧场后台',
    inactiveInteractionText: '按 E 查看旧剧场方向',
    activeStatusText: '后台门没有完全锁死。里面仍留着旧演出的痕迹。',
    inactiveStatusText: '旧剧场在广场西南侧。路线已经记下。',
  },
  clocktower: {
    key: 'clocktower',
    sceneId: 'ch0_012_clocktower',
    questId: 'ch0_hub_reach_clocktower',
    questTitle: '前往钟楼',
    questDescription: '沿镇中心北侧道路前进，调查被人为调慢的钟楼机关。',
    completionText: '已经到达钟楼入口。',
    zoneId: 'ch0-hub-clocktower-gate',
    name: '钟楼',
    area: { x: 690, y: 145, width: 220, height: 180 },
    activeInteractionText: '按 E 进入钟楼',
    inactiveInteractionText: '按 E 查看钟楼方向',
    activeStatusText: '钟楼机关就在上方。每一次迟到的钟声都让静默更深一层。',
    inactiveStatusText: '钟楼位于镇中心正北。路线已经记下。',
  },
};

const HUB_WAYPOINTS = [
  { id: 'hub_entry', position: { x: 800, y: 785 }, links: ['hub_south_west', 'hub_south_east'] },
  {
    id: 'hub_south_west',
    position: { x: 650, y: 655 },
    links: ['hub_entry', 'hub_south_east', 'hub_west_cross', 'hub_theater_gate', 'hub_anning'],
  },
  {
    id: 'hub_south_east',
    position: { x: 950, y: 655 },
    links: ['hub_entry', 'hub_south_west', 'hub_east_cross', 'hub_tiya'],
  },
  {
    id: 'hub_west_cross',
    position: { x: 545, y: 525 },
    links: ['hub_south_west', 'hub_north_west', 'hub_school_gate'],
  },
  {
    id: 'hub_east_cross',
    position: { x: 1055, y: 525 },
    links: ['hub_south_east', 'hub_north_east', 'hub_record_gate'],
  },
  {
    id: 'hub_north_west',
    position: { x: 655, y: 355 },
    links: ['hub_west_cross', 'hub_north_east', 'hub_clock_gate'],
  },
  {
    id: 'hub_north_east',
    position: { x: 945, y: 355 },
    links: ['hub_east_cross', 'hub_north_west', 'hub_clock_gate'],
  },
  { id: 'hub_school_gate', position: { x: 335, y: 450 }, links: ['hub_west_cross'] },
  { id: 'hub_record_gate', position: { x: 1260, y: 500 }, links: ['hub_east_cross'] },
  { id: 'hub_theater_gate', position: { x: 500, y: 760 }, links: ['hub_south_west'] },
  {
    id: 'hub_clock_gate',
    position: { x: 800, y: 235 },
    links: ['hub_north_west', 'hub_north_east'],
  },
  { id: 'hub_anning', position: { x: 730, y: 700 }, links: ['hub_south_west'] },
  { id: 'hub_tiya', position: { x: 1010, y: 705 }, links: ['hub_south_east'] },
];

const HUB_COLLISION_ZONES = [
  { id: 'hub-north-left-buildings', x: 0, y: 0, width: 635, height: 145 },
  { id: 'hub-north-right-buildings', x: 965, y: 0, width: 635, height: 145 },
  { id: 'hub-west-upper-buildings', x: 0, y: 145, width: 215, height: 245 },
  { id: 'hub-west-lower-buildings', x: 0, y: 570, width: 215, height: 330 },
  { id: 'hub-east-upper-buildings', x: 1385, y: 145, width: 215, height: 270 },
  { id: 'hub-east-lower-buildings', x: 1385, y: 610, width: 215, height: 290 },
  { id: 'hub-sealed-piano', x: 705, y: 430, width: 190, height: 175 },
] as const;

function createDestinationZone(
  destination: TownHubDestination,
  activeTarget: TownHubTargetKey,
): ExplorationInteractionZone {
  const active = destination.key === activeTarget;
  return {
    id: destination.zoneId,
    name: destination.name,
    area: { ...destination.area },
    interactionText: active
      ? destination.activeInteractionText
      : destination.inactiveInteractionText,
    statusText: active ? destination.activeStatusText : destination.inactiveStatusText,
    questCompleteId: active ? destination.questId : undefined,
    storySceneId: active ? destination.sceneId : undefined,
  };
}

function createTownHubRegion(targetKey: TownHubTargetKey): ExplorationRegionDefinition {
  const target = HUB_DESTINATIONS[targetKey];
  return {
    id: `ch0_miansha_town_hub_${targetKey}`,
    name: '眠沙镇 · 镇中心',
    width: HUB_WIDTH,
    height: HUB_HEIGHT,
    playerSpawn: { x: 800, y: 785 },
    assets: {
      backgroundSrc: CH0_TOWN_HUB_BACKGROUND,
      playerSpriteVariants: CH0_PRE_CONTRACT_PLAYER_SPRITES,
    },
    collisionZones: HUB_COLLISION_ZONES.map((zone) => ({ ...zone })),
    waypoints: HUB_WAYPOINTS.map((waypoint) => ({
      ...waypoint,
      position: { ...waypoint.position },
      links: [...waypoint.links],
    })),
    npcs: [
      {
        id: 'anning_ch0_hub',
        name: '安柠',
        position: { x: 730, y: 700 },
        speed: 86,
        interactionText: '按 E 与安柠交谈',
        spriteSrc: CH0_ANNING_SPRITE,
        schedule: [
          { minuteOfDay: 0, targetWaypointId: 'hub_anning', activity: '确认镇中心的撤离路线' },
        ],
        mapDialogue: [
          { speaker: '安柠', text: '路线记清楚。这个镇子现在经不起我们迷路。' },
        ],
      },
      {
        id: 'tiya_ch0_hub',
        name: '缇雅',
        position: { x: 1010, y: 705 },
        speed: 74,
        interactionText: '按 E 与缇雅交谈',
        spriteSrc: CH0_TIYA_SPRITE,
        schedule: [
          { minuteOfDay: 0, targetWaypointId: 'hub_tiya', activity: '分辨静默里残留的节拍' },
        ],
        mapDialogue: [
          { speaker: '缇雅', text: '声音没有消失干净。每个方向都还剩一点点。' },
        ],
      },
    ],
    quests: [
      {
        id: target.questId,
        title: target.questTitle,
        description: target.questDescription,
        completionText: target.completionText,
        target: { type: 'zone', id: target.zoneId },
      },
    ],
    initialQuestId: target.questId,
    interactionZones: [
      createDestinationZone(HUB_DESTINATIONS.school, targetKey),
      createDestinationZone(HUB_DESTINATIONS.recordShop, targetKey),
      createDestinationZone(HUB_DESTINATIONS.theater, targetKey),
      createDestinationZone(HUB_DESTINATIONS.clocktower, targetKey),
      {
        id: 'ch0-hub-silent-piano-side',
        name: '封条钢琴旁',
        area: { x: 905, y: 455, width: 120, height: 120 },
        interactionText: '按 E 查看广场中央',
        statusText: '旧钢琴仍被封条缠住。现在最重要的是把镇民的声音找回来。',
      },
    ],
  };
}

export const CH0_MIANSHA_TOWN_HUB_SCHOOL_REGION = createTownHubRegion('school');
export const CH0_MIANSHA_TOWN_HUB_RECORD_SHOP_REGION = createTownHubRegion('recordShop');
export const CH0_MIANSHA_TOWN_HUB_THEATER_REGION = createTownHubRegion('theater');
export const CH0_MIANSHA_TOWN_HUB_CLOCKTOWER_REGION = createTownHubRegion('clocktower');
