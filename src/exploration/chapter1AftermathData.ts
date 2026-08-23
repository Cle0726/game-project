import type { ExplorationRegionDefinition } from './explorationTypes';

const STATION_BACKGROUND =
  '/assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png';

/**
 * Physical investigation between the Sequence-04 battle result and the authored
 * ch1_black_006 analysis scene. Canon still owns every interpretation and relationship
 * change; exploration only makes the player inspect the two traces already named by
 * the scene description.
 */
export const CH1_SEQUENCE04_AFTERMATH_REGION: ExplorationRegionDefinition = {
  id: 'ch1_sequence04_platform_aftermath',
  name: '雾茧站 · 七号站台',
  width: 1600,
  height: 900,
  playerSpawn: { x: 800, y: 340 },
  assets: { backgroundSrc: STATION_BACKGROUND },
  collisionZones: [
    { id: 'aftermath-west-structure', x: 0, y: 0, width: 235, height: 900 },
    { id: 'aftermath-east-structure', x: 1365, y: 0, width: 235, height: 900 },
    { id: 'aftermath-north-wall', x: 235, y: 0, width: 1130, height: 125 },
    { id: 'aftermath-center-kiosk', x: 705, y: 410, width: 190, height: 150 },
    { id: 'aftermath-west-benches', x: 340, y: 640, width: 220, height: 95 },
    { id: 'aftermath-east-luggage', x: 1040, y: 640, width: 180, height: 95 },
  ],
  waypoints: [
    {
      id: 'aftermath_center',
      position: { x: 800, y: 340 },
      links: ['aftermath_tracks', 'aftermath_score', 'aftermath_platform'],
    },
    { id: 'aftermath_tracks', position: { x: 590, y: 315 }, links: ['aftermath_center'] },
    { id: 'aftermath_score', position: { x: 1010, y: 330 }, links: ['aftermath_center'] },
    { id: 'aftermath_platform', position: { x: 800, y: 210 }, links: ['aftermath_center'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch1_inspect_sequence04_tracks',
      title: '检查铁轨划痕',
      description: '查看零四被黑雾拖离后留在七号站台上的铁轨痕迹。',
      completionText: '已经确认铁轨上的异常划痕。附近还有散落的纸页。',
      nextQuestId: 'ch1_inspect_sequence04_score',
      target: { type: 'zone', id: 'ch1-sequence04-tracks' },
    },
    {
      id: 'ch1_inspect_sequence04_score',
      title: '检查散落乐谱',
      description: '查看战斗现场留下的手写乐谱碎片。',
      completionText: '现场痕迹已经确认。接下来由队伍分析这些乐谱。',
      target: { type: 'zone', id: 'ch1-sequence04-score' },
    },
  ],
  initialQuestId: 'ch1_inspect_sequence04_tracks',
  interactionZones: [
    {
      id: 'ch1-sequence04-tracks',
      name: '铁轨划痕',
      area: { x: 485, y: 250, width: 220, height: 145 },
      interactionText: '按 E 检查铁轨划痕',
      statusText: '划痕从站台边缘一直延向雾里，和正常车轮留下的痕迹并不一致。',
      questCompleteId: 'ch1_inspect_sequence04_tracks',
    },
    {
      id: 'ch1-sequence04-score',
      name: '手写乐谱碎片',
      area: { x: 920, y: 260, width: 220, height: 145 },
      interactionText: '按 E 检查乐谱碎片',
      statusText: '纸页不是战斗时撕裂的印刷品，而是明显由人亲手写下的乐谱。',
      questCompleteId: 'ch1_inspect_sequence04_score',
      storySceneId: 'ch1_black_006',
    },
    {
      id: 'ch1-after-battle-signal',
      name: '熄灭的信号灯',
      area: { x: 1160, y: 180, width: 130, height: 110 },
      interactionText: '按 E 查看信号灯',
      statusText: '刚才战斗时反复闪烁的信号灯已经彻底熄灭。',
    },
  ],
};
