import type { ExplorationRegionDefinition } from './explorationTypes';

const STATION_BACKGROUND =
  '/assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png';
const ZHONG_SPRITE =
  '/assets/generated/chapter1/sprites/characters/char_ch1_zhong_sprite_default_v01.png';

const WIDTH = 1600;
const HEIGHT = 900;

const STATION_COLLISIONS = [
  { id: 'station-west-structure', x: 0, y: 0, width: 235, height: 900 },
  { id: 'station-east-structure', x: 1365, y: 0, width: 235, height: 900 },
  { id: 'station-north-wall', x: 235, y: 0, width: 1130, height: 125 },
  { id: 'station-center-kiosk', x: 705, y: 380, width: 190, height: 150 },
  { id: 'station-west-benches', x: 340, y: 610, width: 220, height: 95 },
  { id: 'station-east-luggage', x: 1040, y: 610, width: 180, height: 95 },
] as const;

const STATION_WAYPOINTS = [
  { id: 'station_entry', position: { x: 800, y: 790 }, links: ['station_south'] },
  {
    id: 'station_south',
    position: { x: 800, y: 675 },
    links: ['station_entry', 'station_west_lane', 'station_east_lane'],
  },
  {
    id: 'station_west_lane',
    position: { x: 625, y: 555 },
    links: ['station_south', 'station_zhong', 'station_north_west'],
  },
  {
    id: 'station_east_lane',
    position: { x: 975, y: 555 },
    links: ['station_south', 'station_inn', 'station_north_east'],
  },
  { id: 'station_zhong', position: { x: 420, y: 455 }, links: ['station_west_lane'] },
  { id: 'station_inn', position: { x: 1190, y: 500 }, links: ['station_east_lane'] },
  {
    id: 'station_north_west',
    position: { x: 625, y: 315 },
    links: ['station_west_lane', 'station_platform7'],
  },
  {
    id: 'station_north_east',
    position: { x: 975, y: 315 },
    links: ['station_east_lane', 'station_platform7'],
  },
  {
    id: 'station_platform7',
    position: { x: 800, y: 215 },
    links: ['station_north_west', 'station_north_east'],
  },
] as const;

function stationBase(
  id: string,
  spawn: { x: number; y: number },
): Omit<ExplorationRegionDefinition, 'quests' | 'interactionZones' | 'initialQuestId'> {
  return {
    id,
    name: '雾茧站 · 换乘站台',
    width: WIDTH,
    height: HEIGHT,
    playerSpawn: { ...spawn },
    assets: { backgroundSrc: STATION_BACKGROUND },
    collisionZones: STATION_COLLISIONS.map((zone) => ({ ...zone })),
    waypoints: STATION_WAYPOINTS.map((waypoint) => ({
      ...waypoint,
      position: { ...waypoint.position },
      links: [...waypoint.links],
    })),
    npcs: [],
  };
}

/** Arrival after the canonical ch1_black_000 road conversation. */
export const CH1_MUJIAN_STATION_ARRIVAL_REGION: ExplorationRegionDefinition = {
  ...stationBase('ch1_mujian_station_arrival', { x: 800, y: 790 }),
  quests: [
    {
      id: 'ch1_enter_mujian_station',
      title: '进入雾茧站',
      description: '穿过废弃换乘站台，确认候车区和旧线路的情况。',
      completionText: '已经进入雾茧站。候车室和旧海报就在前方。',
      target: { type: 'zone', id: 'ch1-station-concourse' },
    },
  ],
  initialQuestId: 'ch1_enter_mujian_station',
  interactionZones: [
    {
      id: 'ch1-rusted-signal',
      name: '锈蚀信号灯',
      area: { x: 1040, y: 460, width: 145, height: 125 },
      interactionText: '按 E 查看信号灯',
      statusText: '信号灯忽明忽暗，但时刻表上已经没有对应列车。',
    },
    {
      id: 'ch1-station-concourse',
      name: '候车区',
      area: { x: 590, y: 260, width: 420, height: 110 },
      interactionText: '按 E 进入候车区',
      statusText: '几十年前的巡演海报还贴在玻璃上，边角已经被雾气泡软。',
      questCompleteId: 'ch1_enter_mujian_station',
      storySceneId: 'ch1_black_001',
    },
  ],
};

/** Every authored choice in ch1_black_001 converges on finding Mr. Zhong. */
export const CH1_MUJIAN_FIND_ZHONG_REGION: ExplorationRegionDefinition = {
  ...stationBase('ch1_mujian_find_zhong', { x: 800, y: 675 }),
  npcs: [
    {
      id: 'zhong_ch1_station',
      name: '钟先生',
      position: { x: 420, y: 455 },
      speed: 70,
      interactionText: '按 E 与钟先生交谈',
      spriteSrc: ZHONG_SPRITE,
      schedule: [
        { minuteOfDay: 0, targetWaypointId: 'station_zhong', activity: '整理泛黄路线图' },
      ],
      questCompleteId: 'ch1_find_zhong',
      storySceneId: 'ch1_black_002',
    },
  ],
  quests: [
    {
      id: 'ch1_find_zhong',
      title: '寻找钟先生',
      description: '在旧站台找到情报掮客钟先生，询问禁曲派巡演车辆时刻。',
      completionText: '已经找到钟先生。情报交易由你决定怎么谈。',
      target: { type: 'npc', id: 'zhong_ch1_station' },
    },
  ],
  initialQuestId: 'ch1_find_zhong',
  interactionZones: [
    {
      id: 'ch1-old-route-map',
      name: '旧线路图',
      area: { x: 560, y: 425, width: 145, height: 120 },
      interactionText: '按 E 查看线路图',
      statusText: '八条线路被不同年代的笔迹反复改过，几条废线仍留着手写标记。',
    },
  ],
};

/** After the authored information trade, travel to the station inn for Yuna's intro. */
export const CH1_MUJIAN_STATION_INN_REGION: ExplorationRegionDefinition = {
  ...stationBase('ch1_mujian_station_inn_approach', { x: 420, y: 455 }),
  quests: [
    {
      id: 'ch1_reach_station_inn',
      title: '前往站台旅馆',
      description: '穿过换乘站台，去站台旅馆整理刚得到的情报。',
      completionText: '已经到达站台旅馆。门口有人正在擦旧到站牌。',
      target: { type: 'zone', id: 'ch1-station-inn-door' },
    },
  ],
  initialQuestId: 'ch1_reach_station_inn',
  interactionZones: [
    {
      id: 'ch1-station-inn-door',
      name: '站台旅馆',
      area: { x: 1090, y: 425, width: 220, height: 165 },
      interactionText: '按 E 走近站台旅馆',
      statusText: '到站牌已经很久没有真正的列车停靠，但门口仍被擦得很干净。',
      questCompleteId: 'ch1_reach_station_inn',
      storySceneId: 'ch1_black_003',
    },
  ],
};

/** All ch1_black_004 preparation routes eventually converge on Platform 7. */
export const CH1_MUJIAN_PLATFORM7_REGION: ExplorationRegionDefinition = {
  ...stationBase('ch1_mujian_platform7_approach', { x: 800, y: 675 }),
  quests: [
    {
      id: 'ch1_reach_platform7',
      title: '前往七号站台',
      description: '准备完成。沿雾中的换乘通道前往七号站台，等待异常列车。',
      completionText: '七号站台就在前面。雾里已经传来不属于时刻表的车轮声。',
      target: { type: 'zone', id: 'ch1-platform7-gate' },
    },
  ],
  initialQuestId: 'ch1_reach_platform7',
  interactionZones: [
    {
      id: 'ch1-platform-number-board',
      name: '站台编号牌',
      area: { x: 535, y: 255, width: 135, height: 110 },
      interactionText: '按 E 查看编号牌',
      statusText: '七号站台的编号被重新描过，像是有人不希望它彻底从线路图上消失。',
    },
    {
      id: 'ch1-platform7-gate',
      name: '七号站台',
      area: { x: 680, y: 135, width: 240, height: 170 },
      interactionText: '按 E 进入七号站台',
      statusText: '雾比其他站台更浓。远处传来一阵没有报站声的车轮摩擦。',
      questCompleteId: 'ch1_reach_platform7',
      storySceneId: 'ch1_black_005',
    },
  ],
};
