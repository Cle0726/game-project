import type { ExplorationRegionDefinition } from './explorationTypes';
import {
  WHITE_ACADEMY_ARCHIVE_ASSETS,
  WHITE_ACADEMY_PLAZA_ASSETS,
} from './explorationAssets';

const ARCHIVE_WIDTH = 1800;
const ARCHIVE_HEIGHT = 1100;

const ARCHIVE_COLLISION_ZONES = [
  { id: 'north-wall-left', x: 0, y: 0, width: 620, height: 120 },
  { id: 'north-wall-center', x: 700, y: 0, width: 400, height: 120 },
  { id: 'north-wall-right', x: 1180, y: 0, width: 620, height: 120 },
  { id: 'west-cabinet-bank', x: 120, y: 170, width: 420, height: 210 },
  { id: 'east-cabinet-bank', x: 1260, y: 170, width: 420, height: 210 },
  { id: 'center-reading-table', x: 735, y: 500, width: 330, height: 180 },
  { id: 'west-lower-shelves', x: 120, y: 620, width: 360, height: 210 },
  { id: 'east-lower-shelves', x: 1320, y: 620, width: 360, height: 210 },
] as const;

const ARCHIVE_WAYPOINTS = [
  { id: 'entry', position: { x: 900, y: 930 }, links: ['reading_south'] },
  { id: 'reading_south', position: { x: 900, y: 760 }, links: ['entry', 'west_lane', 'east_lane'] },
  { id: 'west_lane', position: { x: 610, y: 520 }, links: ['reading_south', 'milo_file'] },
  { id: 'east_lane', position: { x: 1190, y: 520 }, links: ['reading_south', 'anning_file'] },
  { id: 'milo_file', position: { x: 420, y: 430 }, links: ['west_lane'] },
  { id: 'anning_file', position: { x: 1380, y: 430 }, links: ['east_lane'] },
] as const;

function archiveBase(id: string, initialQuestId: string): Omit<ExplorationRegionDefinition, 'quests' | 'interactionZones'> {
  return {
    id,
    name: '白谱院 · 档案层',
    width: ARCHIVE_WIDTH,
    height: ARCHIVE_HEIGHT,
    playerSpawn: { x: 900, y: 930 },
    assets: {
      backgroundSrc: WHITE_ACADEMY_ARCHIVE_ASSETS.backgroundSrc,
      playerSpriteSrc: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFallbackSrc,
    },
    collisionZones: ARCHIVE_COLLISION_ZONES.map((zone) => ({ ...zone })),
    waypoints: ARCHIVE_WAYPOINTS.map((waypoint) => ({
      ...waypoint,
      position: { ...waypoint.position },
      links: [...waypoint.links],
    })),
    npcs: [],
    initialQuestId,
  };
}

export const WHITE_ACADEMY_ARCHIVE_MILO_REGION: ExplorationRegionDefinition = {
  ...archiveBase('white_academy_archive_milo', 'archive_find_milo_record'),
  quests: [
    {
      id: 'archive_find_milo_record',
      title: '查找「试制零零一」',
      description: '在早期实验档案区检索与弥洛外观特征相符的旧编号记录。',
      completionText: '已找到「试制零零一」记录。',
      target: { type: 'zone', id: 'milo-record-terminal' },
    },
  ],
  interactionZones: [
    {
      id: 'milo-record-terminal',
      name: '早期实验索引终端',
      area: { x: 330, y: 385, width: 190, height: 105 },
      interactionText: '按 E 检索试制体档案',
      statusText: '索引返回一份编号为「试制零零一」的个体记录。',
      questCompleteId: 'archive_find_milo_record',
      storySceneId: 'ch3_white_003',
    },
    {
      id: 'archive-catalog',
      name: '旧式纸质目录',
      area: { x: 630, y: 220, width: 160, height: 120 },
      interactionText: '按 E 翻看目录',
      statusText: '大部分早期实验条目只留下编号，姓名栏被统一留空。',
    },
    {
      id: 'sealed-cabinet',
      name: '封存档案柜',
      area: { x: 1110, y: 220, width: 160, height: 120 },
      interactionText: '按 E 查看封条',
      statusText: '封条上的日期比零号奏者计划终止时间晚了整整两年。',
    },
  ],
};

export const WHITE_ACADEMY_ARCHIVE_ANNING_REGION: ExplorationRegionDefinition = {
  ...archiveBase('white_academy_archive_anning', 'archive_find_anning_record'),
  quests: [
    {
      id: 'archive_find_anning_record',
      title: '查找安柠父亲的维护记录',
      description: '根据同批实验档案的维护签名，找到安柠父亲留下的完整人员记录。',
      completionText: '已找到安柠父亲的完整维护记录。',
      target: { type: 'zone', id: 'anning-record-terminal' },
    },
  ],
  interactionZones: [
    {
      id: 'anning-record-terminal',
      name: '维护组人员索引',
      area: { x: 1280, y: 385, width: 210, height: 105 },
      interactionText: '按 E 检索维护组档案',
      statusText: '记录显示：机械维护组二级技师，曾负责零号奏者计划早期原型装置。',
      questCompleteId: 'archive_find_anning_record',
      storySceneId: 'ch3_white_004',
    },
    {
      id: 'milo-file-after',
      name: '试制零零一档案柜',
      area: { x: 330, y: 385, width: 190, height: 105 },
      interactionText: '按 E 再看一眼档案',
      statusText: '弥洛的旧编号仍停在终端上。那一串数字已经不再能定义他。',
    },
    {
      id: 'maintenance-ledger',
      name: '维护组纸质台账',
      area: { x: 1010, y: 760, width: 170, height: 115 },
      interactionText: '按 E 查看维护台账',
      statusText: '几页纸被反复折过，边角留下了长期携带工具造成的油迹。',
    },
  ],
};
