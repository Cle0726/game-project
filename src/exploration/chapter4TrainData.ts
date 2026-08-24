import type { ExplorationRegionDefinition } from './explorationTypes';
import { WHITE_ACADEMY_PLAZA_ASSETS } from './explorationAssets';

const AUDIENCE_BACKGROUND =
  '/assets/generated/chapter4/backgrounds/bg_ch4_audience_car_v01.png';
const CORRIDOR_BACKGROUND =
  '/assets/generated/chapter4/backgrounds/bg_ch4_nightless_train_corridor_v01.png';
const ALTAR_BACKGROUND =
  '/assets/generated/chapter4/backgrounds/bg_ch4_altar_carriage_v01.png';

const PLAYER_SPRITE_VARIANTS = {
  male: WHITE_ACADEMY_PLAZA_ASSETS.protagonistMaleSrc,
  female: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFemaleSrc,
  fallback: WHITE_ACADEMY_PLAZA_ASSETS.protagonistFallbackSrc,
} as const;

export const CH4_AUDIENCE_CAR_ENTRY_REGION: ExplorationRegionDefinition = {
  id: 'ch4_nightless_audience_car_entry',
  name: '不夜巡演号 · 观众席入口',
  width: 1600,
  height: 900,
  playerSpawn: { x: 245, y: 700 },
  assets: { backgroundSrc: AUDIENCE_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'audience-north-wall', x: 0, y: 0, width: 1600, height: 130 },
    { id: 'audience-south-wall', x: 0, y: 820, width: 1600, height: 80 },
    { id: 'audience-seat-bank-west', x: 360, y: 210, width: 310, height: 300 },
    { id: 'audience-seat-bank-east', x: 930, y: 210, width: 310, height: 300 },
  ],
  waypoints: [
    { id: 'audience_entry', position: { x: 245, y: 700 }, links: ['audience_aisle_west'] },
    { id: 'audience_aisle_west', position: { x: 560, y: 650 }, links: ['audience_entry', 'audience_aisle_center'] },
    { id: 'audience_aisle_center', position: { x: 800, y: 650 }, links: ['audience_aisle_west', 'audience_aisle_east'] },
    { id: 'audience_aisle_east', position: { x: 1080, y: 650 }, links: ['audience_aisle_center', 'audience_forward'] },
    { id: 'audience_forward', position: { x: 1370, y: 605 }, links: ['audience_aisle_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_enter_audience_car',
      title: '进入观众席车厢',
      description: '从并线登车口穿过前厅，进入播放着虚假掌声的观众席车厢。',
      completionText: '绯红座椅之间，一排排静默序列仍维持着鼓掌姿态。',
      target: { type: 'zone', id: 'ch4-audience-forward' },
    },
  ],
  initialQuestId: 'ch4_enter_audience_car',
  interactionZones: [
    {
      id: 'ch4-false-applause-speaker',
      name: '掌声广播',
      area: { x: 700, y: 150, width: 200, height: 120 },
      interactionText: '按 E 检查广播',
      statusText: '欢呼声的循环间隔精确得不像观众。每一次掌声都从同一个采样点开始。',
    },
    {
      id: 'ch4-audience-forward',
      name: '观众席主车厢',
      area: { x: 1270, y: 500, width: 250, height: 220 },
      interactionText: '按 E 进入观众席',
      statusText: '这里不是退休后的休息区，更像一座仍在演出的展示柜。',
      questCompleteId: 'ch4_enter_audience_car',
      storySceneId: 'ch4_002',
    },
  ],
};

/**
 * Runs after ch4_002. It turns the authored E401 branch and audience-identification
 * minigame into optional physical investigations before the party reaches Sequence-04.
 */
export const CH4_AUDIENCE_INVESTIGATION_REGION: ExplorationRegionDefinition = {
  id: 'ch4_nightless_audience_investigation',
  name: '不夜巡演号 · 观众席调查段',
  width: 1600,
  height: 900,
  playerSpawn: { x: 250, y: 700 },
  assets: { backgroundSrc: AUDIENCE_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'audience-investigation-north-wall', x: 0, y: 0, width: 1600, height: 130 },
    { id: 'audience-investigation-south-wall', x: 0, y: 820, width: 1600, height: 80 },
    { id: 'audience-investigation-seat-bank-west', x: 360, y: 210, width: 310, height: 300 },
    { id: 'audience-investigation-seat-bank-east', x: 930, y: 210, width: 310, height: 300 },
  ],
  waypoints: [
    { id: 'audience_investigation_start', position: { x: 250, y: 700 }, links: ['audience_investigation_west'] },
    { id: 'audience_investigation_west', position: { x: 560, y: 650 }, links: ['audience_investigation_start', 'audience_investigation_center'] },
    { id: 'audience_investigation_center', position: { x: 800, y: 650 }, links: ['audience_investigation_west', 'audience_investigation_east'] },
    { id: 'audience_investigation_east', position: { x: 1080, y: 650 }, links: ['audience_investigation_center', 'sequence04_search'] },
    { id: 'sequence04_search', position: { x: 1370, y: 605 }, links: ['audience_investigation_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_find_sequence04_after_audience',
      title: '继续寻找零四',
      description: '如果刚才选择逐一辨认观众席，可以顺路做更深入的调查；主线目标仍是找到零四。',
      completionText: '弥洛在相似面容里认出了那道带着断裂节拍器痕迹的身影。',
      target: { type: 'zone', id: 'ch4-sequence04-search' },
    },
  ],
  initialQuestId: 'ch4_find_sequence04_after_audience',
  interactionZones: [
    {
      id: 'ch4-audience-records-event',
      name: '仍有反应的编号席',
      area: { x: 700, y: 540, width: 180, height: 100 },
      interactionText: '按 E 逐一核对编号',
      statusText: '几名静默序列的停顿并不完全一致。那些错误节拍像是还没有熄灭的自主反应。',
      storySceneId: 'chapter4_event_E401',
      requiredGameEvent: 'E401_audience_identified',
      once: true,
    },
    {
      id: 'ch4-audience-identify-minigame',
      name: '假掌声辨认点',
      area: { x: 900, y: 540, width: 180, height: 100 },
      interactionText: '按 E 进行观众席辨认挑战',
      statusText: '广播掌声与真实反应之间存在半拍误差，可以用来筛出仍有自主反应的人。',
      storySceneId: 'chapter4_event_minigame_audience_identify',
      requiredGameEvent: 'E401_audience_identified',
      once: true,
    },
    {
      id: 'ch4-sequence04-search',
      name: '零四所在区域',
      area: { x: 1270, y: 500, width: 250, height: 220 },
      interactionText: '按 E 继续寻找零四',
      statusText: '相似的鼓掌姿态里，有一道身影的节拍痕迹与弥洛记忆中的零四一致。',
      questCompleteId: 'ch4_find_sequence04_after_audience',
      storySceneId: 'ch4_003',
    },
  ],
};

/** Physical follow-up to the ch4_004 choice about the lone soloist Aka. */
export const CH4_AKA_FOLLOWUP_REGION: ExplorationRegionDefinition = {
  id: 'ch4_nightless_aka_followup',
  name: '不夜巡演号 · 独奏者侧廊',
  width: 1600,
  height: 900,
  playerSpawn: { x: 255, y: 700 },
  assets: { backgroundSrc: AUDIENCE_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'aka-followup-north-wall', x: 0, y: 0, width: 1600, height: 130 },
    { id: 'aka-followup-south-wall', x: 0, y: 820, width: 1600, height: 80 },
    { id: 'aka-followup-seat-bank-west', x: 360, y: 210, width: 310, height: 300 },
    { id: 'aka-followup-seat-bank-east', x: 930, y: 210, width: 310, height: 300 },
  ],
  waypoints: [
    { id: 'aka_followup_start', position: { x: 255, y: 700 }, links: ['aka_followup_west'] },
    { id: 'aka_followup_west', position: { x: 570, y: 650 }, links: ['aka_followup_start', 'aka_followup_center'] },
    { id: 'aka_followup_center', position: { x: 810, y: 650 }, links: ['aka_followup_west', 'aka_followup_east'] },
    { id: 'aka_followup_east', position: { x: 1090, y: 650 }, links: ['aka_followup_center', 'sequence04_resonance'] },
    { id: 'sequence04_resonance', position: { x: 1370, y: 600 }, links: ['aka_followup_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_return_to_sequence04',
      title: '回到零四身边',
      description: '赤的独奏仍在车厢阴影里回响。处理完眼前的选择后，回到零四身边继续唤醒。',
      completionText: '阿缇娅在零四身边蹲下，准备以最轻的一拍回应她自己的残响。',
      target: { type: 'zone', id: 'ch4-sequence04-resonance' },
    },
  ],
  initialQuestId: 'ch4_return_to_sequence04',
  interactionZones: [
    {
      id: 'ch4-aka-side-event',
      name: '赤的空座独奏',
      area: { x: 730, y: 540, width: 210, height: 105 },
      interactionText: '按 E 再听一小节',
      statusText: '她仍对着空座演奏。靠近并不会立刻得到回应，但这一次有人真正坐下来听。',
      storySceneId: 'chapter4_event_E402',
      requiredGameEvent: '独奏者的终局',
      once: true,
    },
    {
      id: 'ch4-sequence04-resonance',
      name: '零四所在座席',
      area: { x: 1270, y: 500, width: 250, height: 220 },
      interactionText: '按 E 回到零四身边',
      statusText: '她的手仍维持着固定鼓掌姿态，但眼里的暗金色已经出现极轻的波动。',
      questCompleteId: 'ch4_return_to_sequence04',
      storySceneId: 'ch4_005',
    },
  ],
};

export const CH4_QILAN_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch4_nightless_qilan_approach',
  name: '不夜巡演号 · 观众席后段',
  width: 1600,
  height: 900,
  playerSpawn: { x: 260, y: 690 },
  assets: { backgroundSrc: CORRIDOR_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'qilan-north-wall', x: 0, y: 0, width: 1600, height: 140 },
    { id: 'qilan-south-wall', x: 0, y: 810, width: 1600, height: 90 },
    { id: 'qilan-west-service-bank', x: 420, y: 210, width: 220, height: 180 },
    { id: 'qilan-east-service-bank', x: 1010, y: 210, width: 220, height: 180 },
  ],
  waypoints: [
    { id: 'qilan_start', position: { x: 260, y: 690 }, links: ['qilan_west'] },
    { id: 'qilan_west', position: { x: 570, y: 620 }, links: ['qilan_start', 'qilan_center'] },
    { id: 'qilan_center', position: { x: 820, y: 600 }, links: ['qilan_west', 'qilan_east'] },
    { id: 'qilan_east', position: { x: 1110, y: 615 }, links: ['qilan_center', 'qilan_chokepoint'] },
    { id: 'qilan_chokepoint', position: { x: 1380, y: 560 }, links: ['qilan_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_reach_qilan_chokepoint',
      title: '穿过观众席后段',
      description: '零四的唤醒尝试已经结束。继续沿列车向祭坛车厢方向推进。',
      completionText: '前方有人封住了通往祭坛车厢的必经之路。',
      target: { type: 'zone', id: 'ch4-qilan-chokepoint' },
    },
  ],
  initialQuestId: 'ch4_reach_qilan_chokepoint',
  interactionZones: [
    {
      id: 'ch4-resonance-wakeup-minigame',
      name: '零四残响稳定点',
      area: { x: 730, y: 440, width: 200, height: 120 },
      interactionText: '按 E 进行节拍共鸣稳定',
      statusText: '离开观众席前，还能再用一次克制的节拍确认零四是否真正脱离假掌声。',
      storySceneId: 'chapter4_event_minigame_resonance_wakeup',
      requiredAnyGameEvents: [
        '零四未鸣共鸣唤醒',
        '阿缇娅同类共鸣零四',
        '弥洛幸存者对话零四',
      ],
      once: true,
    },
    {
      id: 'ch4-severed-command-cable',
      name: '命令广播线',
      area: { x: 760, y: 170, width: 170, height: 135 },
      interactionText: '按 E 查看广播线',
      statusText: '线路同时向祭坛车厢和观众席送出节拍，像整列车共享着同一条命令神经。',
    },
    {
      id: 'ch4-qilan-chokepoint',
      name: '祭坛车厢必经通道',
      area: { x: 1280, y: 455, width: 260, height: 230 },
      interactionText: '按 E 继续推进',
      statusText: '两道不同的脚步声停在门后，同一个节拍同时落下。',
      questCompleteId: 'ch4_reach_qilan_chokepoint',
      storySceneId: 'ch4_006',
    },
  ],
};

export const CH4_ARMORED_CONNECTOR_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch4_nightless_armored_connector',
  name: '不夜巡演号 · 装甲连接廊',
  width: 1600,
  height: 900,
  playerSpawn: { x: 280, y: 690 },
  assets: { backgroundSrc: CORRIDOR_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'connector-north-wall', x: 0, y: 0, width: 1600, height: 140 },
    { id: 'connector-south-wall', x: 0, y: 810, width: 1600, height: 90 },
    { id: 'connector-left-machinery', x: 420, y: 205, width: 240, height: 190 },
    { id: 'connector-right-machinery', x: 980, y: 205, width: 240, height: 190 },
  ],
  waypoints: [
    { id: 'connector_start', position: { x: 280, y: 690 }, links: ['connector_west'] },
    { id: 'connector_west', position: { x: 590, y: 620 }, links: ['connector_start', 'connector_center'] },
    { id: 'connector_center', position: { x: 820, y: 610 }, links: ['connector_west', 'connector_east'] },
    { id: 'connector_east', position: { x: 1110, y: 620 }, links: ['connector_center', 'connector_door'] },
    { id: 'connector_door', position: { x: 1380, y: 555 }, links: ['connector_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_reach_armored_connector',
      title: '继续向核心方向推进',
      description: '岐岚拦截已经处理。沿装甲连接廊继续前往祭坛车厢。',
      completionText: '装甲门另一侧突然传来爆破震动。',
      target: { type: 'zone', id: 'ch4-armored-connector-door' },
    },
  ],
  initialQuestId: 'ch4_reach_armored_connector',
  interactionZones: [
    {
      id: 'ch4-tour-faction-split-event',
      name: '损坏广播线旁的争执',
      area: { x: 730, y: 445, width: 210, height: 115 },
      interactionText: '按 E 接近墨昭与芸苓',
      statusText: '巡演派内部的争吵已经压过广播噪声。白谱院档案也许能让这道裂缝继续扩大。',
      storySceneId: 'chapter4_event_E403',
      once: true,
    },
    {
      id: 'ch4-armored-connector-door',
      name: '装甲连接门',
      area: { x: 1270, y: 445, width: 270, height: 235 },
      interactionText: '按 E 接近装甲门',
      statusText: '门锁没有从列车内部解除。下一秒，外侧响起陌生的爆破倒数。',
      questCompleteId: 'ch4_reach_armored_connector',
      storySceneId: 'ch4_008',
    },
  ],
};

export const CH4_ALTAR_CARRIAGE_APPROACH_REGION: ExplorationRegionDefinition = {
  id: 'ch4_nightless_altar_approach',
  name: '不夜巡演号 · 祭坛车厢前段',
  width: 1600,
  height: 900,
  playerSpawn: { x: 250, y: 700 },
  assets: { backgroundSrc: ALTAR_BACKGROUND, playerSpriteVariants: PLAYER_SPRITE_VARIANTS },
  collisionZones: [
    { id: 'altar-north-wall', x: 0, y: 0, width: 1600, height: 145 },
    { id: 'altar-south-wall', x: 0, y: 815, width: 1600, height: 85 },
    { id: 'altar-west-pews', x: 390, y: 215, width: 250, height: 220 },
    { id: 'altar-east-pews', x: 960, y: 215, width: 250, height: 220 },
  ],
  waypoints: [
    { id: 'altar_entry', position: { x: 250, y: 700 }, links: ['altar_west'] },
    { id: 'altar_west', position: { x: 570, y: 640 }, links: ['altar_entry', 'altar_center'] },
    { id: 'altar_center', position: { x: 820, y: 620 }, links: ['altar_west', 'altar_east'] },
    { id: 'altar_east', position: { x: 1100, y: 625 }, links: ['altar_center', 'altar_standoff'] },
    { id: 'altar_standoff', position: { x: 1375, y: 555 }, links: ['altar_east'] },
  ],
  npcs: [],
  quests: [
    {
      id: 'ch4_reach_seluomi_standoff',
      title: '前往祭坛车厢深处',
      description: '与伊莱娜的冲突暂时告一段落。继续向卡戎所在的核心方向推进。',
      completionText: '白色圣咏领域在前方展开。瑟萝弥挡在祭坛车厢深处。',
      target: { type: 'zone', id: 'ch4-seluomi-standoff' },
    },
  ],
  initialQuestId: 'ch4_reach_seluomi_standoff',
  interactionZones: [
    {
      id: 'ch4-hisheng-side-event',
      name: '希声的停顿',
      area: { x: 660, y: 475, width: 190, height: 110 },
      interactionText: '按 E 与希声说话',
      statusText: '她看过观众席后没有立刻跟上伊莱娜。这个停顿第一次不像等待命令。',
      storySceneId: 'chapter4_event_E404',
      requiredGameEvent: '希声看见观众席',
      once: true,
    },
    {
      id: 'ch4-three-side-dispatch-minigame',
      name: '三方混战狭道',
      area: { x: 875, y: 475, width: 190, height: 110 },
      interactionText: '按 E 进行三方混战调度',
      statusText: '主角队伍、巡演派残部与静默署都在抢同一条狭窄退路，必须先决定保护顺序。',
      storySceneId: 'chapter4_event_minigame_three_side_dispatch',
      requiredGameEvent: '三方混战种子',
      once: true,
    },
    {
      id: 'ch4-altar-score-stand',
      name: '祭坛谱架',
      area: { x: 760, y: 165, width: 170, height: 140 },
      interactionText: '按 E 查看谱架',
      statusText: '谱面上只有裁定节拍，没有任何观众应该听见的旋律。',
    },
    {
      id: 'ch4-seluomi-standoff',
      name: '圣咏领域边缘',
      area: { x: 1270, y: 450, width: 270, height: 230 },
      interactionText: '按 E 接近圣咏领域',
      statusText: '十字裁定的白光没有立刻落下。对面的人第一次像是在等一个答案。',
      questCompleteId: 'ch4_reach_seluomi_standoff',
      storySceneId: 'ch4_009',
    },
  ],
};
