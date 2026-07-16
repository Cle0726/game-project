import ashenCorridorMapSrc from '../../assets/worldmap/map_ashen_corridor_manuscript_v01.png';
import ashenCorridorThumbSrc from '../../assets/worldmap/thumb_ashen_corridor_manuscript_v01.png';
import hiddenRegionMapSrc from '../../assets/worldmap/map_hidden_region_sepia_placeholder_v01.png';
import hiddenRegionThumbSrc from '../../assets/worldmap/thumb_hidden_region_sepia_placeholder_v01.png';
import mujianStationMapSrc from '../../assets/worldmap/map_ch1_mujian_station_atlas_v01.png';
import mujianStationThumbSrc from '../../assets/worldmap/thumb_ch1_mujian_station_atlas_v01.png';
import frostScoreTowerMapSrc from '../../assets/worldmap/map_ch2_frost_score_tower_atlas_v01.png';
import frostScoreTowerThumbSrc from '../../assets/worldmap/thumb_ch2_frost_score_tower_atlas_v01.png';
import whiteScoreInstituteMapSrc from '../../assets/worldmap/map_ch3_white_score_institute_atlas_v02.png';
import whiteScoreInstituteThumbSrc from '../../assets/worldmap/thumb_ch3_white_score_institute_atlas_v02.png';
import nightlessTrainMapSrc from '../../assets/worldmap/map_ch4_nightless_train_atlas_v01.png';
import nightlessTrainThumbSrc from '../../assets/worldmap/thumb_ch4_nightless_train_atlas_v01.png';
import floatingCircusMapSrc from '../../assets/worldmap/map_ch5_floating_circus_atlas_v01.png';
import floatingCircusThumbSrc from '../../assets/worldmap/thumb_ch5_floating_circus_atlas_v01.png';
import shiguangVillageMapSrc from '../../assets/worldmap/map_ch6_shiguang_village_atlas_v01.png';
import shiguangVillageThumbSrc from '../../assets/worldmap/thumb_ch6_shiguang_village_atlas_v01.png';
import whiteScoreReformMapSrc from '../../assets/worldmap/map_ch7_white_score_reform_atlas_v01.png';
import whiteScoreReformThumbSrc from '../../assets/worldmap/thumb_ch7_white_score_reform_atlas_v01.png';
import fallenDarkTourMapSrc from '../../assets/worldmap/map_ch8_fallen_dark_tour_atlas_v01.png';
import fallenDarkTourThumbSrc from '../../assets/worldmap/thumb_ch8_fallen_dark_tour_atlas_v01.png';
import firstResonanceOutpostMapSrc from '../../assets/worldmap/map_ch9_first_resonance_outpost_atlas_v01.png';
import firstResonanceOutpostThumbSrc from '../../assets/worldmap/thumb_ch9_first_resonance_outpost_atlas_v01.png';
import residualPathMapSrc from '../../assets/worldmap/map_residual_path_miansha_manuscript_v01.png';
import residualPathThumbSrc from '../../assets/worldmap/thumb_residual_path_miansha_manuscript_v01.png';
import type { WorldRegion } from './worldMapTypes';

export const WORLD_MAP_REGIONS: WorldRegion[] = [
  {
    id: 'residual_path',
    name: '残响之途',
    subtitle: '第零章 · 禁曲未响',
    musicEmotion: '雨幕禁曲',
    colorTheme: {
      primary: '#D4AF37',
      secondary: '#F3E4C6',
      accent: '#8B1F35'
    },
    thumbnailSrc: residualPathThumbSrc,
    fullMapSrc: residualPathMapSrc,
    unlockCondition: { type: 'always' },
    isHidden: false,
    narrativeHook: '眠沙镇的旧钢琴仍被封条锁住；第一根黑金指挥棒会从这里被抛向奏者。',
    locationNodes: [
      {
        id: 'chapter0_start',
        name: '禁曲公路入口',
        positionPercent: { x: 8, y: 78 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch0_002_silent_town',
        name: '眠沙镇封门',
        positionPercent: { x: 24, y: 52 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch0_003_old_piano',
        name: '锁琴广场',
        positionPercent: { x: 43, y: 45 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch0_008_map_open',
        name: '眠沙镇调查',
        positionPercent: { x: 36, y: 57 },
        nodeType: 'event_pool',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch0_010_record_shop',
        name: '乌鸦唱片店',
        positionPercent: { x: 15, y: 42 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch0_005_diner',
        name: '旧餐馆避雨处',
        positionPercent: { x: 20, y: 74 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch0_009_silent_school',
        name: '废弃学校音乐室',
        positionPercent: { x: 73, y: 43 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch0_012_clocktower',
        name: '半拍钟楼',
        positionPercent: { x: 31, y: 23 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch0_011_backstage_dress',
        name: '旧剧场后台',
        positionPercent: { x: 49, y: 76 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch0_013_forbidden_performance',
            name: '禁演舞台',
            positionPercent: { x: 42, y: 45 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch0_015_first_baton',
            name: '未鸣接棒',
            positionPercent: { x: 55, y: 52 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch0_020_sound_stripping_boss',
            name: '剥音校尉核心',
            positionPercent: { x: 72, y: 66 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch0_021_epilogue',
        name: '雨后余响',
        positionPercent: { x: 88, y: 23 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      }
    ]
  },
  {
    id: 'chapter1_rebuild',
    name: '黑巡半响',
    subtitle: '第一章 · 路线B：追查卡戎',
    musicEmotion: '雾与铁轨',
    colorTheme: {
      primary: '#D4AF37',
      secondary: '#FAF6EF',
      accent: '#8B2354'
    },
    thumbnailSrc: mujianStationThumbSrc,
    fullMapSrc: mujianStationMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 1 },
    isHidden: false,
    narrativeHook: '默令残页把主角一行带向雾茧站；在雾与铁轨之间，禁曲派的静默序列制度第一次暴露。',
    locationNodes: [
      {
        id: 'chapter1_start',
        name: '残页上的图案',
        positionPercent: { x: 12, y: 68 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_black_000',
        name: '公路对话',
        positionPercent: { x: 23, y: 60 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_black_001',
        name: '雾茧站入口',
        positionPercent: { x: 34, y: 52 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_black_002',
        name: '钟先生黑市摊',
        positionPercent: { x: 43, y: 45 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch1_minigame_intel_trade',
            name: '情报交易心理博弈',
            positionPercent: { x: 48, y: 52 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch1_black_003',
        name: '站台旅馆',
        positionPercent: { x: 53, y: 57 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_black_004',
        name: '雾中巡逻',
        positionPercent: { x: 62, y: 47 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch1_minigame_track_ruts',
            name: '追踪车辙',
            positionPercent: { x: 38, y: 55 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch1_minigame_cipher',
            name: '破译残页密码',
            positionPercent: { x: 58, y: 43 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch1_black_005',
        name: '静默序列-零四',
        positionPercent: { x: 70, y: 38 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_black_006',
        name: '战斗后的沉默',
        positionPercent: { x: 73, y: 47 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_black_007',
        name: '尤娜的秘密',
        positionPercent: { x: 76, y: 57 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch1_minigame_ensemble',
            name: '合奏节拍器',
            positionPercent: { x: 46, y: 48 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch1_side_yuna_name',
            name: '名字约定',
            positionPercent: { x: 62, y: 58 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch1_black_008',
        name: '瑟萝弥验收',
        positionPercent: { x: 84, y: 42 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_black_009',
        name: '战术抉择',
        positionPercent: { x: 86, y: 52 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch1_minigame_escort_yuna',
            name: '护送尤娜QTE',
            positionPercent: { x: 50, y: 55 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch1_black_012',
        name: '尤娜的抉择',
        positionPercent: { x: 90, y: 45 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch1_black_010_a',
            name: '结局甲 · 暂缓收编',
            positionPercent: { x: 34, y: 48 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch1_black_010_b',
            name: '结局乙 · 带伤守住',
            positionPercent: { x: 50, y: 58 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch1_black_010_c',
            name: '结局丙 · 未能及时',
            positionPercent: { x: 66, y: 48 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch1_black_011',
        name: '章末广播',
        positionPercent: { x: 94, y: 51 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_black_013',
        name: '残响与决意',
        positionPercent: { x: 92, y: 58 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch1_side_atya_dinner',
            name: '暮色餐桌',
            positionPercent: { x: 35, y: 48 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch1_side_milo_score',
            name: '未寄出的乐谱',
            positionPercent: { x: 52, y: 44 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch1_side_anning_intel',
            name: '情报与信任',
            positionPercent: { x: 66, y: 56 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch1_black_014',
        name: '雾中广播',
        positionPercent: { x: 95, y: 66 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      }
    ]
  },
  {
    id: 'chapter2_frost_score',
    name: '雪谱冻响',
    subtitle: '第二章 · 路线B-2：零号奏者计划',
    musicEmotion: '冰蓝残响',
    colorTheme: {
      primary: '#8BD8FF',
      secondary: '#F1FBFF',
      accent: '#6F8FA8'
    },
    thumbnailSrc: frostScoreTowerThumbSrc,
    fullMapSrc: frostScoreTowerMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 2 },
    isHidden: false,
    narrativeHook: '卡戎抛出的母亲线索指向雪岭深处的冻谱观测塔；零号奏者计划、宁溯与母亲残响都冻结在这里。',
    locationNodes: [
      {
        id: 'chapter2_start',
        name: '雪线方向',
        positionPercent: { x: 10, y: 72 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_000',
        name: '雪线楔子',
        positionPercent: { x: 20, y: 66 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_001',
        name: '雪岭两日',
        positionPercent: { x: 30, y: 58 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_002',
        name: '冻谱观测塔',
        positionPercent: { x: 40, y: 49 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_003',
        name: '看塔仪与铭牌',
        positionPercent: { x: 48, y: 43 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_004',
        name: '冰封残奏',
        positionPercent: { x: 55, y: 50 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_005',
        name: '谱鸣回廊',
        positionPercent: { x: 60, y: 40 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch2_minigame_silent_step',
            name: '谱鸣静音挑战',
            positionPercent: { x: 32, y: 52 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch2_minigame_archive_puzzle',
            name: '冻结档案室拼图',
            positionPercent: { x: 50, y: 42 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E201',
            name: 'E201 谱鸣静音',
            positionPercent: { x: 66, y: 52 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E202',
            name: 'E202 冻结档案',
            positionPercent: { x: 76, y: 40 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E203',
            name: 'E203 旧简报',
            positionPercent: { x: 42, y: 66 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E204',
            name: 'E204 无名律者',
            positionPercent: { x: 60, y: 68 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E205',
            name: 'E205 宁溯房间',
            positionPercent: { x: 82, y: 62 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch2_snow_006',
        name: '谱塔守卫兽',
        positionPercent: { x: 67, y: 48 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_007',
        name: '谱心监守者',
        positionPercent: { x: 75, y: 42 },
        nodeType: 'tuning_platform',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_008',
        name: '战后舱门',
        positionPercent: { x: 80, y: 50 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_009',
        name: '宁溯拦截',
        positionPercent: { x: 84, y: 44 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_010',
        name: '守谱人对峙',
        positionPercent: { x: 88, y: 51 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch2_snow_010_a',
            name: '结局一 · 信任移交',
            positionPercent: { x: 34, y: 44 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch2_snow_010_b',
            name: '结局二 · 有限移交',
            positionPercent: { x: 52, y: 56 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch2_snow_010_c',
            name: '结局三 · 被迫突破',
            positionPercent: { x: 70, y: 44 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch2_snow_011',
        name: '核心舱',
        positionPercent: { x: 90, y: 58 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch2_minigame_echo_calibration',
            name: '残响记录仪校准',
            positionPercent: { x: 52, y: 48 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch2_snow_012',
        name: '母亲的残响',
        positionPercent: { x: 92, y: 47 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_013',
        name: '安柠的记忆',
        positionPercent: { x: 91, y: 36 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_snow_014',
        name: '塔外告别',
        positionPercent: { x: 86, y: 28 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch2_side_atya_nameless',
            name: '阿缇娅 · 无名律者',
            positionPercent: { x: 28, y: 46 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch2_side_milo_origin',
            name: '弥洛 · 铭牌背后',
            positionPercent: { x: 46, y: 58 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch2_side_anning_father',
            name: '安柠 · 父亲的名字',
            positionPercent: { x: 64, y: 46 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch2_side_ningsu_camp',
            name: '宁溯 · 营地夜谈',
            positionPercent: { x: 78, y: 60 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch2_minigame_frost_ensemble',
            name: '合奏节拍器 · 极寒变奏',
            positionPercent: { x: 52, y: 74 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch2_snow_015',
        name: '三个残留坐标',
        positionPercent: { x: 96, y: 20 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      }
    ]
  },
  {
    id: 'chapter3_white_score',
    name: '白谱缚响',
    subtitle: '第三章 · 路线C-3：返回白谱院正面交涉',
    musicEmotion: '登记听证',
    colorTheme: {
      primary: '#F7F2E8',
      secondary: '#BFA263',
      accent: '#8A2F3A'
    },
    thumbnailSrc: whiteScoreInstituteThumbSrc,
    fullMapSrc: whiteScoreInstituteMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 3 },
    isHidden: false,
    narrativeHook: '队伍带着零号奏者计划权限碎片回到白谱院，在大理石与彩窗光下，为阿缇娅争取被正式记录为自己的权利。',
    locationNodes: [
      {
        id: 'chapter3_white_start',
        name: '章节入口',
        positionPercent: { x: 50, y: 92 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_000',
        name: '白谱院正门',
        positionPercent: { x: 50, y: 84 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_001',
        name: '接待与观察徽章',
        positionPercent: { x: 48, y: 74 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_002',
        name: '如何定义自己',
        positionPercent: { x: 54, y: 66 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_003',
        name: '弥洛的旧编号',
        positionPercent: { x: 33, y: 58 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_004',
        name: '安柠父亲档案',
        positionPercent: { x: 28, y: 48 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_005',
        name: '肖像长廊',
        positionPercent: { x: 39, y: 39 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'E301',
            name: 'E301 待销毁柜',
            positionPercent: { x: 24, y: 44 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E302',
            name: 'E302 隐藏画像',
            positionPercent: { x: 42, y: 30 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E303',
            name: 'E303 学生食堂',
            positionPercent: { x: 68, y: 68 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E304',
            name: 'E304 弥洛的抉择',
            positionPercent: { x: 34, y: 68 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'E305',
            name: 'E305 珏衡休息室',
            positionPercent: { x: 74, y: 36 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch3_white_006',
        name: '柏舟私下接触',
        positionPercent: { x: 55, y: 44 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_007',
        name: '听证前夜',
        positionPercent: { x: 62, y: 52 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch3_minigame_hearing_statement',
            name: '听证陈述编排',
            positionPercent: { x: 50, y: 52 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch3_white_008',
        name: '阿缇娅听证会',
        positionPercent: { x: 69, y: 45 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_008_high',
        name: '附条件通过',
        positionPercent: { x: 82, y: 32 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_008_mid',
        name: '三个月观察期',
        positionPercent: { x: 82, y: 45 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_008_low',
        name: '临时看管裁决',
        positionPercent: { x: 82, y: 58 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_009',
        name: '珏衡奉命行动',
        positionPercent: { x: 72, y: 62 },
        nodeType: 'battle',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_011',
        name: '珏衡现场报告',
        positionPercent: { x: 72, y: 72 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_012',
        name: '第二份完整资料',
        positionPercent: { x: 55, y: 26 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch3_minigame_file_sorting',
            name: '文件分类挑战',
            positionPercent: { x: 42, y: 44 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch3_white_013',
        name: '最终裁决',
        positionPercent: { x: 50, y: 18 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_white_014',
        name: '带着身份离开',
        positionPercent: { x: 50, y: 8 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch3_side_atya_form',
            name: '阿缇娅 · 表格加一栏',
            positionPercent: { x: 24, y: 40 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch3_side_milo_old_place',
            name: '弥洛 · 重返旧地',
            positionPercent: { x: 42, y: 56 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch3_side_anning_letter',
            name: '安柠 · 写给父亲的信',
            positionPercent: { x: 62, y: 56 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch3_side_juheng_room',
            name: '珏衡 · 休息室',
            positionPercent: { x: 76, y: 40 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch3_side_juheng_first_walk',
            name: '珏衡 · 第一次同行',
            positionPercent: { x: 80, y: 62 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      }
    ]
  },
  {
    id: 'chapter4_nightless_train',
    name: '不夜终响',
    subtitle: '第四章 · 路线D：不夜巡演号',
    musicEmotion: '黑漆绯红终战',
    colorTheme: {
      primary: '#120508',
      secondary: '#7D1020',
      accent: '#D8A94A'
    },
    thumbnailSrc: nightlessTrainThumbSrc,
    fullMapSrc: nightlessTrainMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 4 },
    isHidden: false,
    narrativeHook: '卡戎主线收束于永不停站的黑漆歌剧列车；这里的黑不是废墟，而是抛光漆面、绯红丝绒和金色烛光构成的终幕舞台。',
    locationNodes: [
      {
        id: 'chapter4_start',
        name: '章节入口',
        positionPercent: { x: 8, y: 82 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch4_000',
        name: '不夜巡演号的踪迹',
        positionPercent: { x: 16, y: 72 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch4_001',
        name: '并线潜入黑色列车',
        positionPercent: { x: 24, y: 62 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch4_002',
        name: '永不谢幕的观众席',
        positionPercent: { x: 34, y: 54 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'chapter4_event_E401',
            name: 'E401 观众席逐一辨认',
            positionPercent: { x: 28, y: 54 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'chapter4_event_E402',
            name: 'E402 赤的车厢角落',
            positionPercent: { x: 38, y: 62 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'chapter4_event_minigame_audience_identify',
            name: '观众席辨认挑战',
            positionPercent: { x: 44, y: 48 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch4_003',
        name: '寻找零四',
        positionPercent: { x: 44, y: 46 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch4_005',
        name: '节拍共鸣唤醒',
        positionPercent: { x: 52, y: 40 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'chapter4_event_minigame_resonance_wakeup',
            name: '节拍共鸣唤醒',
            positionPercent: { x: 52, y: 52 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch4_007',
            name: '零七的踪迹',
            positionPercent: { x: 42, y: 36 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch4_006',
        name: '岐与岚的拦截车厢',
        positionPercent: { x: 60, y: 46 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'chapter4_event_E403',
            name: 'E403 墨昭与芸苓的车厢',
            positionPercent: { x: 56, y: 58 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'chapter4_event_minigame_three_side_dispatch',
            name: '三方混战调度',
            positionPercent: { x: 66, y: 54 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch4_008',
        name: '伊莱娜与希声强袭',
        positionPercent: { x: 68, y: 38 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'chapter4_event_E404',
            name: 'E404 希声的沉默时刻',
            positionPercent: { x: 70, y: 50 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'chapter4_event_E405',
            name: 'E405 阿俞与溪吟情报',
            positionPercent: { x: 78, y: 44 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch4_010',
        name: '瑟萝弥最后一战',
        positionPercent: { x: 76, y: 32 },
        nodeType: 'event_pool',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch4_011',
        name: '核心车厢外',
        positionPercent: { x: 82, y: 26 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch4_014',
        name: '卡戎三段式终战',
        positionPercent: { x: 90, y: 18 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'chapter4_event_minigame_organ_dodge',
            name: '管风琴节奏躲避',
            positionPercent: { x: 84, y: 38 },
            nodeType: 'event_pool',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch4_018',
        name: '清晨停站',
        positionPercent: { x: 96, y: 10 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      }
    ]
  },
  {
    id: 'chapter5_floating_circus',
    name: '浮光马戏团',
    subtitle: '第五章 · 浮光伶响',
    musicEmotion: '暖幕之下的自由抉择',
    colorTheme: { primary: '#E6AF57', secondary: '#23162D', accent: '#B93C4A' },
    thumbnailSrc: floatingCircusThumbSrc,
    fullMapSrc: floatingCircusMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 5 },
    isHidden: false,
    narrativeHook: '暖色帐篷、巡演车厢与训练场围成短暂的家；零一与零四的选择在此交汇。',
    locationNodes: [
      { id: 'chapter5_start', name: '浮光来讯', positionPercent: { x: 14, y: 82 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch5_001', name: '营地入口', positionPercent: { x: 28, y: 65 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch5_004', name: '小雀的秘密接触', positionPercent: { x: 52, y: 48 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch5_008', name: '琉璃团长的心防', positionPercent: { x: 68, y: 35 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch5_014', name: '帐篷外的月亮', positionPercent: { x: 86, y: 18 }, nodeType: 'story', isCompleted: false, isRevisitable: true }
    ]
  },
  {
    id: 'chapter6_shiguang_village',
    name: '拾光村',
    subtitle: '第六章 · 拾光缓响',
    musicEmotion: '温泉与慢慢复原的心',
    colorTheme: { primary: '#D8B66E', secondary: '#245B58', accent: '#80C7B3' },
    thumbnailSrc: shiguangVillageThumbSrc,
    fullMapSrc: shiguangVillageMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 6 },
    isHidden: false,
    narrativeHook: '温泉、梯田、古树与河桥把疗愈地带连在一起；这里不催促任何人立刻好起来。',
    locationNodes: [
      { id: 'chapter6_start', name: '拾光村入口', positionPercent: { x: 14, y: 82 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch6_000', name: '古树下的停步', positionPercent: { x: 28, y: 60 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch6_003', name: '温泉边的旧伤', positionPercent: { x: 52, y: 42 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch6_006', name: '田野里的轻战斗', positionPercent: { x: 68, y: 28 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch6_008', name: '拾光村余响', positionPercent: { x: 86, y: 16 }, nodeType: 'story', isCompleted: false, isRevisitable: true }
    ]
  },
  {
    id: 'chapter7_white_score_reform',
    name: '白谱院·改革夜',
    subtitle: '第七章 · 谱变余响',
    musicEmotion: '雨夜听证与制度回声',
    colorTheme: { primary: '#E7DAB5', secondary: '#13223E', accent: '#7699C9' },
    thumbnailSrc: whiteScoreReformThumbSrc,
    fullMapSrc: whiteScoreReformMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 7 },
    isHidden: false,
    narrativeHook: '同一座学院在夜里呈现另一面：听证、档案、签名与撤离路线共同决定规则是否重写。',
    locationNodes: [
      { id: 'chapter7_start', name: '改革议程', positionPercent: { x: 14, y: 82 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch7_004', name: '档案核查请求', positionPercent: { x: 30, y: 60 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch7_010', name: '弥洛的回应', positionPercent: { x: 48, y: 46 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch7_016', name: '证据护送', positionPercent: { x: 66, y: 34 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch7_021', name: '表决大会', positionPercent: { x: 82, y: 22 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch7_023', name: '改革后告别', positionPercent: { x: 92, y: 12 }, nodeType: 'story', isCompleted: false, isRevisitable: true }
    ]
  },
  {
    id: 'chapter8_fallen_dark_tour',
    name: '暗巡残站',
    subtitle: '第八章 · 续弦入响',
    musicEmotion: '废站中的新契约',
    colorTheme: { primary: '#CB7188', secondary: '#1D1930', accent: '#9D72D6' },
    thumbnailSrc: fallenDarkTourThumbSrc,
    fullMapSrc: fallenDarkTourMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 8 },
    isHidden: false,
    narrativeHook: '暗巡旧站的断轨仍通向过去，赤与屿却在这里尝试写下不再重复的回应。',
    locationNodes: [
      { id: 'chapter8_start', name: '独奏残响', positionPercent: { x: 14, y: 82 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch8_000', name: '残站入口', positionPercent: { x: 28, y: 64 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch8_004', name: '屿向赤靠近', positionPercent: { x: 48, y: 46 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch8_012', name: '新契约准备', positionPercent: { x: 68, y: 30 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch8_013', name: '保卫新生战', positionPercent: { x: 78, y: 22 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch8_015', name: '续弦余响', positionPercent: { x: 90, y: 12 }, nodeType: 'story', isCompleted: false, isRevisitable: true }
    ]
  },
  {
    id: 'chapter9_first_resonance_outpost',
    name: '初响会荒废据点',
    subtitle: '第九章 · 暗音初响',
    musicEmotion: '雨夜档案与无法力敌的威压',
    colorTheme: { primary: '#B48FE6', secondary: '#1D1B28', accent: '#A65D70' },
    thumbnailSrc: firstResonanceOutpostThumbSrc,
    fullMapSrc: firstResonanceOutpostMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 9 },
    isHidden: false,
    narrativeHook: '焚毁档案、残余营地与封闭实验室把所有人推向初响会第一次真正的阴影。',
    locationNodes: [
      { id: 'chapter9_start', name: '岚与岐的线索', positionPercent: { x: 14, y: 82 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch9_001', name: '荒废据点入口', positionPercent: { x: 30, y: 64 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch9_006', name: '辞照的威压', positionPercent: { x: 52, y: 44 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch9_008', name: '岚的选择', positionPercent: { x: 68, y: 30 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch9_012', name: '岐的决定', positionPercent: { x: 82, y: 20 }, nodeType: 'story', isCompleted: false, isRevisitable: true },
      { id: 'ch9_016', name: '安娜的远景', positionPercent: { x: 92, y: 12 }, nodeType: 'story', isCompleted: false, isRevisitable: true }
    ]
  },
  {
    id: 'chapter3_legacy_combined',
    name: '第三章旧案合辑',
    subtitle: '旧第一至第三章内容暂存区',
    musicEmotion: '旧谱合卷',
    colorTheme: {
      primary: '#A77A3D',
      secondary: '#D4C2A0',
      accent: '#6C2638'
    },
    thumbnailSrc: ashenCorridorThumbSrc,
    fullMapSrc: ashenCorridorMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 3 },
    isHidden: false,
    narrativeHook: '这里不是新第三章最终结构，而是把旧第一、旧第二、旧第三章先合体归档，后续按第三章重新拆谱。',
    locationNodes: [
      {
        id: 'chapter3_archive_start',
        name: '旧案总入口',
        positionPercent: { x: 10, y: 68 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_001',
        name: '旧第一段 · 晨钟广场',
        positionPercent: { x: 22, y: 57 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_006',
        name: '旧第一段 · 合唱异常',
        positionPercent: { x: 34, y: 48 },
        nodeType: 'event_pool',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch1_007',
        name: '旧第一段 · 瞭望塔战前',
        positionPercent: { x: 44, y: 40 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_001',
        name: '旧第二段 · 灰弦长廊入口',
        positionPercent: { x: 55, y: 44 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch2_005',
        name: '旧第二段 · 静默核心',
        positionPercent: { x: 66, y: 36 },
        nodeType: 'sublevel_entry',
        isCompleted: false,
        isRevisitable: true,
        sublevels: [
          {
            id: 'ch2_005_huaixu',
            name: '槐序真相碎片',
            positionPercent: { x: 48, y: 50 },
            nodeType: 'story',
            isCompleted: false,
            isRevisitable: true
          },
          {
            id: 'ch2_006',
            name: '封存分歧',
            positionPercent: { x: 63, y: 42 },
            nodeType: 'tuning_platform',
            isCompleted: false,
            isRevisitable: true
          }
        ]
      },
      {
        id: 'ch2_008',
        name: '旧第二段 · 返程边界',
        positionPercent: { x: 76, y: 52 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_001',
        name: '旧第三段 · 盛典前夜',
        positionPercent: { x: 84, y: 43 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_005',
        name: '旧第三段 · 无拍指挥者',
        positionPercent: { x: 90, y: 31 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      },
      {
        id: 'ch3_008',
        name: '旧第三段 · 终幕选择',
        positionPercent: { x: 93, y: 63 },
        nodeType: 'story',
        isCompleted: false,
        isRevisitable: true
      }
    ]
  },
  {
    id: 'truth_fragment_second_seal',
    name: '真相碎片 II',
    subtitle: '尚未命名的第二封印地',
    musicEmotion: '未知',
    colorTheme: {
      primary: '#8A8A8A',
      secondary: '#D8D8D8',
      accent: '#5F6C7B'
    },
    thumbnailSrc: hiddenRegionThumbSrc,
    fullMapSrc: hiddenRegionMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 4 },
    isHidden: true,
    narrativeHook: '第二处碎片仅留下无声坐标，等待第四乐章确认舞台。',
    locationNodes: []
  },
  {
    id: 'truth_fragment_third_seal',
    name: '真相碎片 III',
    subtitle: '尚未命名的第三封印地',
    musicEmotion: '未知',
    colorTheme: {
      primary: '#8A8A8A',
      secondary: '#D8D8D8',
      accent: '#5F6C7B'
    },
    thumbnailSrc: hiddenRegionThumbSrc,
    fullMapSrc: hiddenRegionMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 5 },
    isHidden: true,
    narrativeHook: '第三处碎片先以褪色轮廓保留，避免早期地图暴露后续真相。',
    locationNodes: []
  },
  {
    id: 'truth_fragment_fourth_seal',
    name: '真相碎片 IV',
    subtitle: '尚未命名的第四封印地',
    musicEmotion: '未知',
    colorTheme: {
      primary: '#8A8A8A',
      secondary: '#D8D8D8',
      accent: '#5F6C7B'
    },
    thumbnailSrc: hiddenRegionThumbSrc,
    fullMapSrc: hiddenRegionMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 6 },
    isHidden: true,
    narrativeHook: '第四处碎片暂不命名，只暴露它与静默纪元同源。',
    locationNodes: []
  },
  {
    id: 'truth_fragment_fifth_seal',
    name: '真相碎片 V',
    subtitle: '尚未命名的第五封印地',
    musicEmotion: '未知',
    colorTheme: {
      primary: '#8A8A8A',
      secondary: '#D8D8D8',
      accent: '#5F6C7B'
    },
    thumbnailSrc: hiddenRegionThumbSrc,
    fullMapSrc: hiddenRegionMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 7 },
    isHidden: true,
    narrativeHook: '第五处碎片以灰化节点占位，后续根据角色个人线补全。',
    locationNodes: []
  },
  {
    id: 'truth_fragment_sixth_seal',
    name: '真相碎片 VI',
    subtitle: '尚未命名的第六封印地',
    musicEmotion: '未知',
    colorTheme: {
      primary: '#8A8A8A',
      secondary: '#D8D8D8',
      accent: '#5F6C7B'
    },
    thumbnailSrc: hiddenRegionThumbSrc,
    fullMapSrc: hiddenRegionMapSrc,
    unlockCondition: { type: 'chapter_progress', minChapter: 8 },
    isHidden: true,
    narrativeHook: '第六处碎片保留给最终真相前的反转区域。',
    locationNodes: []
  }
];

export const WORLD_MAP_REGION_BY_ID: Record<string, WorldRegion> =
  Object.fromEntries(WORLD_MAP_REGIONS.map((region) => [region.id, region]));
