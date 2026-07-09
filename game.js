/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: game.js | 行号: 1-~6800
   功能: 《宿命回响：残响之途》核心游戏引擎 —— 场景管理、对话播放、战斗系统、
         关系值管理、存档系统、AI 茶歇对话（DeepSeek）、队伍选择、地图事件
   入口: showMainMenu() [行~5400] — 由 DOMContentLoaded 触发
   ⚠️ 架构原则:
    - 全局状态存在 GameState 变量中
    - 运行时变量在行 933-944 声明
    - 场景数据在 SCENES 对象中 (行 946-2560)
    - 战斗数据在 BATTLES 对象中 (行 2972-3638)
    - 公共 API (被外部调用) 已在每个函数注释中标注
    - 修改函数签名前请先 grep 搜索调用点
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

"use strict";

/* ───────────────────────────────────────────────────────────
   模块: 全局常量 | 行号: ~3-7
   内容: STORAGE_KEY, AUTOSAVE_KEY, SAVE_SLOT_PREFIX,
         TYPEWRITER_DELAY (30ms), DIALOGUE_GAP (360ms)
   被引用: 存档系统、对话播放系统
   ⚠️ 修改 TYPEWRITER_DELAY 影响所有打字机动画速度
   ─────────────────────────────────────────────────────────── */
const STORAGE_KEY = "fate_echoes_residual_path_save_v1";
const AUTOSAVE_KEY = "autosave";
const SAVE_SLOT_PREFIX = "save_slot_";
const UI_SETTINGS_KEY = "residual_path_ui_settings_v1";
const GACHA_COLLECTION_KEY = "residual_path_gacha_collection_v1";
const TYPEWRITER_DELAY = 30;
const DIALOGUE_GAP = 360;

const DEFAULT_UI_SETTINGS = {
  uiScale: "normal",
  motion: "full",
  typewriter: "normal",
  hudDensity: "normal"
};

/* ───────────────────────────────────────────────────────────
   模块: DEFAULT_GAME_STATE (默认游戏状态) | 行号: ~9-42
   功能: 新游戏初始值 —— 所有运行时状态字段的原始模板
   字段: 城邦稳定度(60), 世界失谐度(35), 粮药(12), 音芯(6), 奏者健康(82),
         奏者性别(null), 出战律者(["阿缇娅","弥洛"]), 关系版本(2),
         阿缇娅/弥洛/安柠/尤娜等新第零章-第一章角色关系值，
         旧版槐序/洛温/伊芙白/明弦字段仅保留给第三章旧案合辑，
         白谱院声望, 回声议会声望, 世界观信息, 残留音核, 仪仗核心残片,
         茶歇/个人故事返回场景, 玩家行为记录, 终局已触发, 已触发事件, 当前场景ID
   被引用: cloneData(DEFAULT_GAME_STATE) 初始化 GameState, 存档/读档系统
   ⚠️ 新增字段必须同步更新 normalizeSavePayload() 和 migrateLegacyState()
   ─────────────────────────────────────────────────────────── */
const DEFAULT_GAME_STATE = {
  城邦稳定度: 60,
  世界失谐度: 35,
  粮药: 12,
  音芯: 6,
  奏者健康: 82,
  奏者性别: null,
  奏者姓名: "",
  主角默认形象: "",
  出战律者: ["阿缇娅", "弥洛"],
  关系系统版本: 2,
  槐序信任: 34,
  槐序共鸣: 30,
  槐序压力: 10,
  洛温信任: 32,
  洛温共鸣: 32,
  洛温压力: 35,
  阿缇娅信任: 26,
  阿缇娅共鸣: 18,
  阿缇娅压力: 42,
  弥洛信任: 24,
  弥洛共鸣: 20,
  弥洛压力: 30,
  安柠好感: 30,
  缇雅好感: 35,
  诺伊好感: 20,
  诺伊希望: 20,
  诺伊恐惧: 0,
  镇民信任: 10,
  镇民希望: 12,
  镇民恐惧: 5,
  白栖信任: 10,
  乌鸦先生信任: 10,
  伊芙白信任: 30,
  伊芙白共鸣: 30,
  伊芙白压力: 18,
  明弦信任: 28,
  明弦共鸣: 20,
  明弦压力: 25,
  宁溯好感: 20,
  体感温度: 100,
  谱鸣共振: 0,
  听证倾向值: 0,
  沈知微好感: 20,
  珏衡好感: 20,
  救赎值: 0,
  归还值: 0,
  真相值: 0,
  伊莱娜隐藏好感值: 0,
  白谱院声望: "中立",
  白谱院声望值: 0,
  回声议会声望值: 0,
  世界观信息: 0,
  残留音核: 0,
  仪仗核心残片: 0,
  茶歇返回场景: "chapter0_start",
  个人故事返回场景: "chapter0_start",
  玩家行为记录: [],
  关系判定记录: [],
  隐藏台词记录: [],
  终局已触发: false,
  已触发事件: [],
  当前场景ID: "chapter0_start"
};

/* ───────────────────────────────────────────────────────────
   模块: AVATAR_STYLES (角色头像样式) | 行号: ~44-52
   功能: 定义各角色在对话区的头像颜色和简称标签
   被引用: applySpeakerPresentation()
   ─────────────────────────────────────────────────────────── */
const AVATAR_STYLES = {
  "玛伦": { color: "#4A5568", label: "玛" },
  "祁恩": { color: "#35234A", label: "祁" },
  "合唱团长": { color: "#7FA7D8", label: "唱" },
  "安柠": { color: "#7B5A37", label: "安" },
  "诺伊": { color: "#8A6A3A", label: "诺" },
  "母亲": { color: "#A68A5A", label: "母" },
  "卡戎": { color: "#5B1D24", label: "断" },
  "瑟萝弥": { color: "#4A3542", label: "弥" },
  "宁溯": { color: "#5D7E94", label: "宁" },
  "母亲的残响": { color: "#7FB5E7", label: "响" },
  "看塔仪": { color: "#8ECDE8", label: "塔" },
  "沈知微": { color: "#8A2F3A", label: "沈" },
  "珏衡": { color: "#C9CDD7", label: "衡" },
  "温别克": { color: "#80725E", label: "温" },
  "柏舟": { color: "#8A7B5C", label: "柏" },
  "行政人员": { color: "#A69778", label: "登" },
  "零四": { color: "#B08A32", label: "04" },
  "零七": { color: "#8F6B4A", label: "07" },
  "赤": { color: "#A33A2A", label: "赤" },
  "伊莱娜": { color: "#596170", label: "稽" },
  "希声": { color: "#A4A9B6", label: "希" },
  "岐": { color: "#6D4D35", label: "岐" },
  "岚": { color: "#596A8C", label: "岚" },
  "乌鸦先生": { color: "#34313A", label: "鸦" },
  "米拉奶奶": { color: "#8B7660", label: "米" },
  "白栖": { color: "#667085", label: "栖" },
  "霍尔特": { color: "#6A5C4B", label: "霍" },
  "奥托": { color: "#8A6D3F", label: "灯" },
  "琳": { color: "#7C5F8F", label: "琳" },
  "铃": { color: "#7C5F8F", label: "铃" },
  "伊莱娜": { color: "#596170", label: "伊" },
  "缇雅": { color: "#8E4AA8", label: "缇" },
  "阿缇娅": { color: "#A86A18", label: "暮" },
  "弥洛": { color: "#4E5D72", label: "低" },
  "槐序": { color: "#C49A45", label: "槐" },
  "洛温": { color: "#5A3728", label: "洛" },
  "伊芙白": { color: "#1F5F9C", label: "白" },
  "明弦": { color: "#B8233A", label: "明" }
};

/* ───────────────────────────────────────────────────────────
   模块: MUSICART_RULES + MUSICART_PROFILES (律者规则与档案) | 行号: ~54-82
   字段: gender, trustKey, resonanceKey, pressureKey (每个律者一个)
   被引用: 关系值系统 (AI茶歇、选择效果、战斗失调判定)
   ⚠️ 新增律者必须同步添加 MUSICART_RULES, MUSICART_PROFILES,
       MUSICART_DETAIL_PROFILES, DEEPSEEK_CHARACTER_PROFILES,
       AI_MUSICART_RULES, AVATAR_STYLES
   ─────────────────────────────────────────────────────────── */
const MUSICART_RULES = {
  槐序: { gender: "female", trustKey: "槐序信任", resonanceKey: "槐序共鸣", pressureKey: "槐序压力" },
  洛温: { gender: "male", trustKey: "洛温信任", resonanceKey: "洛温共鸣", pressureKey: "洛温压力" },
  阿缇娅: { gender: "female", trustKey: "阿缇娅信任", resonanceKey: "阿缇娅共鸣", pressureKey: "阿缇娅压力" },
  弥洛: { gender: "male", trustKey: "弥洛信任", resonanceKey: "弥洛共鸣", pressureKey: "弥洛压力" },
  伊芙白: { gender: "female", trustKey: "伊芙白信任", resonanceKey: "伊芙白共鸣", pressureKey: "伊芙白压力" },
  明弦: { gender: "female", trustKey: "明弦信任", resonanceKey: "明弦共鸣", pressureKey: "明弦压力" }
};

const MUSICART_PROFILES = {
  槐序: {
    codename: "灰圆舞",
    concept: "圆舞曲，三拍节律",
    avatar: "槐"
  },
  洛温: {
    codename: "沉低音",
    concept: "帕萨卡利亚，固定低音",
    avatar: "洛"
  },
  阿缇娅: {
    codename: "暮星序曲",
    concept: "非正规觉醒，黑金指挥契约",
    avatar: "暮"
  },
  弥洛: {
    codename: "低鸣骑士",
    concept: "临时律者，固定低频防线",
    avatar: "低"
  },
  伊芙白: {
    codename: "蓝调改色",
    concept: "蓝调，即兴变奏",
    avatar: "伊"
  },
  明弦: {
    codename: "赤命定",
    concept: "命运动机，强对比戏剧性",
    avatar: "明"
  }
};

const RELATIONSHIP_TIERS = {
  trust: [
    { id: "stranger", label: "陌生", min: 0, max: 29 },
    { id: "known", label: "认识", min: 30, max: 59 },
    { id: "trusted", label: "信任", min: 60, max: 79 },
    { id: "deepTrust", label: "深信", min: 80, max: 100 }
  ],
  resonance: [
    { id: "outsider", label: "陌生人", min: 0, max: 29 },
    { id: "companion", label: "同行者", min: 30, max: 59 },
    { id: "partner", label: "旅伴", min: 60, max: 79 },
    { id: "resonant", label: "共鸣者", min: 80, max: 100 }
  ],
  pressure: [
    { id: "stable", label: "稳定", min: 0, max: 39 },
    { id: "tense", label: "紧绷", min: 40, max: 69 },
    { id: "highPressure", label: "高压", min: 70, max: 89 },
    { id: "edge", label: "失调边缘", min: 90, max: 100 }
  ]
};

const RELATIONSHIP_DATA = {
  槐序: {
    trustKey: "槐序信任",
    resonanceKey: "槐序共鸣",
    pressureKey: "槐序压力",
    judgment: {
      resonancePlus: ["承认不确定", "保护无关者", "好奇但不追问", "失败后不归责"],
      resonanceMinus: ["强制服从", "只用结果评判", "拿她和别人比较"],
      trustPlus: ["高风险前征询意见", "说明选择理由"],
      pressurePlus: ["大量消耗体力", "价值观受挫", "触及创伤话题"]
    },
    hiddenLines: [
      { id: "huaixu_stop", text: "如果我停下来，不一定是不想走，也可能是那支曲子走不动了。", conditions: [{ key: "槐序共鸣", operator: ">=", value: 70 }] }
    ]
  },
  洛温: {
    trustKey: "洛温信任",
    resonanceKey: "洛温共鸣",
    pressureKey: "洛温压力",
    judgment: {
      resonancePlus: ["承认代价", "稳定推进", "不把低音当盾牌消耗"],
      resonanceMinus: ["过度依赖防守", "回避代价", "反复翻转决定"],
      trustPlus: ["保证队伍安全", "允许他说不", "压力高时安排休整"],
      pressurePlus: ["连续错误指令", "被当作消耗品"]
    },
    hiddenLines: [
      { id: "luowen_cost", text: "我不是怕代价。我怕你假装没看见代价。", conditions: [{ key: "洛温共鸣", operator: ">=", value: 70 }] }
    ]
  },
  阿缇娅: {
    trustKey: "阿缇娅信任",
    resonanceKey: "阿缇娅共鸣",
    pressureKey: "阿缇娅压力",
    judgment: {
      resonancePlus: ["承认她不是缇雅", "接纳非正规契约代价", "不把她当遗物"],
      resonanceMinus: ["强迫她承认缇雅身份", "只要求战斗效率", "否认健康代价"],
      trustPlus: ["清楚下达但不羞辱", "在危急时保护镇民声音"],
      pressurePlus: ["连续高健康消耗", "提及缇雅旧身份", "静默署默令干涉"]
    },
    hiddenLines: [
      { id: "atya_not_tiya", text: "我拥有她的残响，但我不是你失去的那个人。", conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 55 }] }
    ]
  },
  弥洛: {
    trustKey: "弥洛信任",
    resonanceKey: "弥洛共鸣",
    pressureKey: "弥洛压力",
    judgment: {
      resonancePlus: ["听见低频警告", "承认防线也会疲惫", "优先撤离平民"],
      resonanceMinus: ["轻视沉默判断", "把保护视为理所当然"],
      trustPlus: ["给出明确路线", "不强迫他解释创伤"],
      pressurePlus: ["无撤离计划开战", "连续让他硬抗"]
    },
    hiddenLines: [
      { id: "milo_low_hum", text: "低音不是不说话，它只是先替别人撑住地面。", conditions: [{ key: "弥洛共鸣", operator: ">=", value: 55 }] }
    ]
  },
  伊芙白: {
    trustKey: "伊芙白信任",
    resonanceKey: "伊芙白共鸣",
    pressureKey: "伊芙白压力",
    judgment: {
      resonancePlus: ["绕路探索", "帮助信息更少的一方", "看见她的疲惫"],
      resonanceMinus: ["只接受表面玩笑", "强迫解释"],
      trustPlus: ["不当众拆穿", "事后记得她的试探"],
      pressurePlus: ["连续出战", "要求给出唯一答案"]
    },
    hiddenLines: [
      { id: "yifubai_truth", text: "他们都是对的，这就是最糟糕的地方。", conditions: [{ key: "伊芙白共鸣", operator: ">=", value: 70 }] }
    ]
  },
  明弦: {
    trustKey: "明弦信任",
    resonanceKey: "明弦共鸣",
    pressureKey: "明弦压力",
    judgment: {
      resonancePlus: ["承担后果", "立场清晰", "面对强敌不退"],
      resonanceMinus: ["优柔寡断", "回避责任"],
      trustPlus: ["尊重战斗经验", "不质疑她的判断"],
      pressurePlus: ["被质疑能力", "队友拖后腿"]
    },
    hiddenLines: [
      { id: "mingxian_debt", text: "这条胳膊不是勋章，是债。", conditions: [{ key: "明弦共鸣", operator: ">=", value: 70 }] }
    ]
  }
};

const GACHA_POOL = [
  {
    id: "musicart_atya",
    rarity: "SSR",
    type: "律者档案",
    title: "阿缇娅",
    subtitle: "暮星序曲 / 自然律者",
    image: "assets/generated/chapter0/sprites/characters/char_ch0_atya_sprite_transformed_ai_v01.png"
  },
  {
    id: "musicart_milo",
    rarity: "SR",
    type: "律者档案",
    title: "弥洛",
    subtitle: "低音防线 / 双律者合奏",
    image: "assets/generated/chapter0/sprites/characters/char_ch0_milo_sprite_default_v02.png"
  },
  {
    id: "musicart_yuna_sequence07",
    rarity: "SR",
    type: "律者档案",
    title: "静默序列-零七",
    subtitle: "强制觉醒 / 名字夺回线",
    image: "assets/generated/chapter1/sprites/characters/char_ch1_yuna_sequence07_sprite_default_v01.png"
  },
  {
    id: "musicart_seluomi",
    rarity: "SR",
    type: "律者档案",
    title: "瑟萝弥",
    subtitle: "验收者 / 黑暗巡演线",
    image: "assets/generated/chapter0/sprites/characters/char_ch0_serolomy_sprite_default_v01.png"
  },
  {
    id: "scene_chapter0_residual_path",
    rarity: "R",
    type: "场景碎片",
    title: "眠沙镇 · 禁曲未响",
    subtitle: "第零章独立篇章素材",
    image: "assets/generated/chapter_covers/cover_ch0_forbidden_song_v01.png"
  },
  {
    id: "scene_chapter1_mujian_station",
    rarity: "SR",
    type: "场景碎片",
    title: "雾茧站 · 黑巡半响",
    subtitle: "第一章路线B地图与事件素材",
    image: "assets/generated/chapter_covers/cover_ch1_black_half_v01.png"
  },
  {
    id: "scene_chapter2_frost_score_tower",
    rarity: "SSR",
    type: "场景碎片",
    title: "冻谱观测塔 · 雪谱冻响",
    subtitle: "第二章路线B-2零号奏者计划素材",
    image: "assets/generated/chapter_covers/cover_ch2_frost_score_v01.png"
  },
  {
    id: "scene_chapter3_white_score_institute",
    rarity: "SSR",
    type: "场景碎片",
    title: "白谱院 · 白谱缚响",
    subtitle: "第三章路线C-3登记听证素材",
    image: "assets/generated/chapter_covers/cover_ch3_white_score_v01.png"
  },
  {
    id: "scene_chapter3_legacy_archive",
    rarity: "SSR",
    type: "场景碎片",
    title: "第三章旧案合辑",
    subtitle: "旧一至三章合体归档素材",
    image: "assets/generated/chapter_covers/cover_ch3_legacy_archive_v01.png"
  },
  {
    id: "dev_ai_teabreak",
    rarity: "R",
    type: "开发标记",
    title: "茶歇AI联调",
    subtitle: "人设回复、关系变化、隐藏台词",
    image: "assets/generated/backgrounds/bg_white_score_tea_lounge_v02.png"
  }
];

/* ───────────────────────────────────────────────────────────
   模块: MUSICART_DETAIL_PROFILES (律者详细档案页) | 行号: ~84-137
   功能: 为队伍选择界面提供律者的完整信息 (英文名/派系/角色/气质/战斗注释/关键词/技能卡)
   被引用: buildMusicartDetailMarkup(), openMusicartDetail()
   ─────────────────────────────────────────────────────────── */
const MUSICART_DETAIL_PROFILES = {
  槐序: {
    englishName: "Huaixu",
    faction: "白谱院封存律者",
    role: "节拍标记 / 弱拍控制",
    temperament: "表层优雅，内里防备；对被审问和被归档极度敏感。",
    combatNote: "适合处理有固定循环的敌人。她的三拍切入能标记弱拍，也能为队伍争取半拍空间。",
    keywords: ["灰圆舞", "三拍", "封存箱", "弱拍", "沉默证词"],
    skillCards: [
      { name: "回身三拍", text: "标记敌方循环中的弱拍，逐步扩大破绽。" },
      { name: "半拍错身", text: "避开一次即将落下的攻击，并制造短暂空隙。" },
      { name: "宿命三拍", text: "高信任后展开的独演，能重写战场节奏。" }
    ]
  },
  洛温: {
    englishName: "Luowen",
    faction: "旧式低音防线",
    role: "护送 / 减压 / 固定阵线",
    temperament: "沉默、可靠、拒绝被当成消耗品；比起解释，他更在意结果是否稳定。",
    combatNote: "适合高压护送和防守战。男性奏者低信任指挥时会提高失调风险。",
    keywords: ["沉低音", "帕萨卡利亚", "固定低音", "代价", "城墙"],
    skillCards: [
      { name: "固定低音", text: "压住队伍阵脚，降低混乱带来的额外损耗。" },
      { name: "低音墙", text: "为队友承受攻击，保护关键撤离路线。" },
      { name: "不回头", text: "在高压环境下保持路线稳定，但会积累压力。" }
    ]
  },
  伊芙白: {
    englishName: "Yifubai",
    faction: "流动音色改写者",
    role: "扰乱 / 误导 / 路线改色",
    temperament: "用玩笑试探别人，真正疲惫时反而说得更轻；讨厌被要求给出唯一解释。",
    combatNote: "适合信息不完整的局面。她能把敌方意图引向错误音色，制造安全窗口。",
    keywords: ["蓝调", "即兴变奏", "错拍", "玩笑", "改色"],
    skillCards: [
      { name: "即兴错拍", text: "让敌方尝试理解错误节奏，打乱下一次行动。" },
      { name: "错位引导", text: "偏转范围攻击，给撤离或重整留下空隙。" },
      { name: "玩笑背面", text: "高共鸣时能透露更真实的判断。" }
    ]
  },
  明弦: {
    englishName: "Mingxian",
    faction: "回声议会候补校律者",
    role: "强攻 / 裁决 / 终止式",
    temperament: "直接、强势、重视承担后果；机械臂不是勋章，而是她拒绝解释的旧债。",
    combatNote: "适合快速击穿僵持局面。她能把暧昧局势压成必须作答的终止式。",
    keywords: ["赤命定", "命运动机", "机械臂", "裁决", "强音"],
    skillCards: [
      { name: "命题强音", text: "用高压攻击逼出敌方破绽。" },
      { name: "断刃终止", text: "截断敌方循环，让战斗进入结算窗口。" },
      { name: "承担后果", text: "立场清晰时更容易获得她的信任。" }
    ]
  }
};

/* ───────────────────────────────────────────────────────────
   模块: TEA_BREAK_SCENES (茶歇场景映射) | 行号: ~139-144
   功能: 将角色名映射到对应的茶歇场景 ID
   被引用: showScene() (茶歇场景跳转), buildTeaBreakHubChoices()
   ─────────────────────────────────────────────────────────── */
const TEA_BREAK_SCENES = {
  阿缇娅: "tea_break_atya",
  弥洛: "tea_break_milo",
  槐序: "tea_break_huaixu",
  洛温: "tea_break_luowen",
  伊芙白: "tea_break_yifubai",
  明弦: "tea_break_mingxian"
};

/* ───────────────────────────────────────────────────────────
   模块: CONCERTO_RULES (协奏规则) | 行号: ~146-194
   功能: 定义两名出战律者之间的协奏组合效果 (名称/描述/效果函数)
   支持组合: 槐序|洛温, 槐序|伊芙白, 洛温|伊芙白, 槐序|明弦, 洛温|明弦, 伊芙白|明弦
   被引用: tryTriggerConcerto(), buildConcertoHint()
   ⚠️ 修改注意: effect() 函数直接修改 GameState 全局变量
   ─────────────────────────────────────────────────────────── */
const CONCERTO_RULES = {
  "槐序|洛温": {
    name: "三拍低音",
    text: "协奏触发：槐序的回身三拍被洛温的固定低音托住，破绽扩大，队伍节拍也稳了一格。",
    effect: (state) => {
      state.enemyDamage = (state.enemyDamage || 0) + 2;
      GameState.奏者健康 += 2;
    }
  },
  "阿缇娅|弥洛": {
    name: "暮星低鸣",
    text: "协奏触发：阿缇娅的暮星线被弥洛的低鸣托住，黑金刺痕没有散开，而是钉进敌方核心。",
    effect: (state) => {
      state.enemyDamage = (state.enemyDamage || 0) + 3;
      state.protectedThisRound = true;
      GameState.阿缇娅压力 -= 2;
      GameState.弥洛压力 -= 2;
    }
  },
  "槐序|伊芙白": {
    name: "错拍圆舞",
    text: "协奏触发：伊芙白故意错开半拍，槐序顺势旋入空隙，敌方意图被迫延后。",
    effect: (state) => {
      state.enemyDelayed = true;
      state.enemyDamage = (state.enemyDamage || 0) + 1;
    }
  },
  "洛温|伊芙白": {
    name: "低音蓝调",
    text: "协奏触发：洛温守住底线，伊芙白把安全路线改成一段即兴短句，本轮压力被卸掉一部分。",
    effect: () => {
      GameState.洛温压力 -= 2;
      GameState.伊芙白压力 -= 2;
    }
  },
  "槐序|明弦": {
    name: "灰圆舞与赤命定",
    text: "协奏触发：明弦的强音逼出终局，槐序没有退开，而是把那一拍转成可被接住的圆舞。",
    effect: (state) => {
      state.enemyDamage = (state.enemyDamage || 0) + 3;
    }
  },
  "洛温|明弦": {
    name: "命定低音墙",
    text: "协奏触发：明弦向前压迫，洛温把队伍的退路钉进低音里，攻击和防守在同一小节落下。",
    effect: (state) => {
      state.enemyDamage = (state.enemyDamage || 0) + 2;
      state.protectedThisRound = true;
    }
  },
  "伊芙白|明弦": {
    name: "即兴命题",
    text: "协奏触发：伊芙白把明弦的命题改成反问，敌方节拍短暂失去结论。",
    effect: (state) => {
      state.enemyConfused = true;
      state.enemyDamage = (state.enemyDamage || 0) + 1;
    }
  }
};

/* ───────────────────────────────────────────────────────────
   模块: AI 全局常量 | 行号: ~196-203
   AI_ALLOWED_MOODS: DeepSeek 允许返回的情绪标签
   AI_RELATION_STATS: 所有关系值统计字段的集合
   ─────────────────────────────────────────────────────────── */
const AI_ALLOWED_MOODS = ["neutral", "warm", "tense", "withdrawn", "playful", "sad", "alert", "thoughtful"];
const AI_RELATION_STATS = new Set([
  "槐序信任", "槐序共鸣", "槐序压力",
  "洛温信任", "洛温共鸣", "洛温压力",
  "阿缇娅信任", "阿缇娅共鸣", "阿缇娅压力",
  "弥洛信任", "弥洛共鸣", "弥洛压力",
  "伊芙白信任", "伊芙白共鸣", "伊芙白压力",
  "明弦信任", "明弦共鸣", "明弦压力"
]);

// ===== DeepSeek AI 茶歇配置 =====
const REACT_BATTLE_ACTION_ORDER = [
  { key: "旋律", iconLabel: "旋", fallbackLabel: "槐序标记" },
  { key: "和声", iconLabel: "和", fallbackLabel: "洛温护送" },
  { key: "节奏", iconLabel: "节", fallbackLabel: "延后节点" },
  { key: "音色", iconLabel: "色", fallbackLabel: "伊芙白改色" },
  { key: "指挥", iconLabel: "令", fallbackLabel: "奏者能力" },
  { key: "静默", iconLabel: "默", fallbackLabel: "强制封印" }
];

const REACT_BATTLE_CHARACTER_IDS = {
  槐序: "huaixu",
  洛温: "luowen",
  阿缇娅: "atya",
  弥洛: "milo",
  伊芙白: "yifubai",
  明弦: "mingxian"
};

const USE_REACT_BATTLE_SCREEN = false;
let latestReactBattleLog = [];
let reactBattleLogSequence = 0;

function syncReactBattleScreen() {
  if (!USE_REACT_BATTLE_SCREEN || !activeBattle) {
    clearReactBattleScreenFromLegacy();
    return;
  }

  const screenState = buildReactBattleScreenState(activeBattle);
  if (typeof window.renderReactBattleScreen === "function") {
    window.renderReactBattleScreen(screenState);
  } else {
    window.__pendingReactBattleState = screenState;
  }

  if (activeBattle.reactPhase === "entering" && !activeBattle.reactEnterTimer) {
    activeBattle.reactEnterTimer = setTimeout(() => {
      if (activeBattle && activeBattle.reactPhase === "entering") {
        activeBattle.reactPhase = "active";
        syncReactBattleScreen();
      }
    }, 1350);
  }
}

function clearReactBattleScreenFromLegacy() {
  if (typeof window.clearReactBattleScreen === "function") {
    window.clearReactBattleScreen();
  } else {
    const battleArea = document.getElementById("battle-area");
    if (battleArea) {
      battleArea.classList.remove("has-react-battle");
    }
    window.__pendingReactBattleState = undefined;
  }
}

function buildReactBattleScreenState(state) {
  const config = state.config;
  const progress = getReactBattleProgress(state);
  const selectedMusicarts = (state.selectedMusicarts || GameState.出战律者 || []).slice(0, 2);
  while (selectedMusicarts.length < 2) {
    selectedMusicarts.push(selectedMusicarts.length === 0 ? "槐序" : "洛温");
  }

  return {
    id: config.id || config.name || "legacy-battle",
    phase: state.reactPhase || (state.battleEnded ? "resolving" : "active"),
    enemy: {
      id: config.id || "enemy",
      name: config.enemy || config.name || "噬响体",
      statusText: state.lastEnemyText || config.goal || "威胁正在重组节拍。",
      intentText: state.nextEnemyIntent || getEnemyIntentText(config, state.currentRound || 1, state),
      hpPercent: getReactEnemyHpPercent(state),
      imageSrc: getReactEnemyImage(config),
      visualState: state.battleEnded ? "defeated" : state.reactEnemyHitUntil && Date.now() < state.reactEnemyHitUntil ? "hit" : "idle"
    },
    resources: {
      objectiveLabel: progress.label,
      objectivePercent: progress.percent,
      conductorHealthPercent: clamp(GameState.奏者健康, 0, 100)
    },
    musicarts: selectedMusicarts.map((name, index) => buildReactMusicartState(name, index, state)),
    activeMusicartId: getReactBattleCharacterId(selectedMusicarts[0]),
    log: latestReactBattleLog.slice(-6),
    skills: buildReactBattleSkills(config.actions || {}, state)
  };
}

function buildReactMusicartState(name, index, state) {
  const characterId = getReactBattleCharacterId(name);
  const characterAssets = ASSETS.characters[name] || {};
  return {
    id: characterId,
    name,
    characterId,
    fallbackImageSrc: normalizeAssetPath(characterAssets.battle || characterAssets.default || getReactAllyImage(state.config, index)),
    role: index === 0 ? "前锋律者" : "支援律者",
    hpPercent: clamp(GameState.奏者健康, 0, 100),
    moodCue: state.reactLastHighDamageMusicart === name ? "highDamage" : undefined,
    moodCueId: state.reactLastHighDamageId
  };
}

function buildReactBattleSkills(actions, state) {
  const skills = [];

  REACT_BATTLE_ACTION_ORDER.forEach((actionMeta) => {
    const action = actions[actionMeta.key];
    if (!action || !isActionAvailableForSelectedMusicarts(action, state)) {
      return;
    }

    const trustRequirement = getActionTrustRequirement(action);
    skills.push({
      id: `legacy-${actionMeta.key}`,
      gameActionKey: actionMeta.key,
      label: action.skillName || action.displayLabel || actionMeta.fallbackLabel,
      detail: trustRequirement.met ? (action.effectSummary || buildActionDetail(action)) : `信任不足：需要${action.musicart}信任${action.requiresMinTrust}`,
      iconLabel: actionMeta.iconLabel,
      disabled: !trustRequirement.met || state.battleEnded,
      danger: Boolean(action.warning || action.cost?.失谐 || (action.healthCost || 0) >= 10),
      actionPointCost: Number.isFinite(action.actionPointCost) ? action.actionPointCost : 1,
      healthCost: Number.isFinite(action.healthCost) ? action.healthCost : 0
    });
  });

  const ultimateMusicart = state.selectedMusicarts?.find((musicart) => canUseUltimate(musicart, state));
  if (ultimateMusicart && state.config.ultimates?.[ultimateMusicart]) {
    const ultimate = state.config.ultimates[ultimateMusicart];
    skills.unshift({
      id: `ultimate-${ultimateMusicart}`,
      gameActionKey: `ultimate:${ultimateMusicart}`,
      label: `${ultimateMusicart}·${ultimate.name}`,
      detail: ultimate.resultText || "释放独演。",
      iconLabel: "独",
      disabled: state.battleEnded,
      ultimate: true,
      actionPointCost: state.resonanceMax,
      healthCost: 0
    });
  }

  return skills;
}

function getReactBattleProgress(state) {
  const config = state.config;
  if (config.defeatTarget) {
    return {
      label: `击破进度：${state.enemyDamage || 0}/${config.defeatTarget}`,
      percent: clamp(((state.enemyDamage || 0) / config.defeatTarget) * 100, 0, 100)
    };
  }

  if (config.protected) {
    return {
      label: `保护稳定：${state.protected}/${state.initialProtected || config.protected}`,
      percent: clamp((state.protected / Math.max(1, state.initialProtected || config.protected)) * 100, 0, 100)
    };
  }

  if (config.evacuationTarget) {
    return {
      label: `撤离进度：${state.evacuated || 0}/${config.evacuationTarget}`,
      percent: clamp(((state.evacuated || 0) / config.evacuationTarget) * 100, 0, 100)
    };
  }

  return {
    label: `调律轮次：${state.currentRound}/${state.maxRounds}`,
    percent: clamp(((state.currentRound - 1) / Math.max(1, state.maxRounds)) * 100, 0, 100)
  };
}

function getReactEnemyHpPercent(state) {
  const config = state.config;
  if (config.defeatTarget) {
    return clamp(100 - ((state.enemyDamage || 0) / config.defeatTarget) * 100, 0, 100);
  }
  return clamp(100 - ((state.currentRound - 1) / Math.max(1, state.maxRounds)) * 100, 8, 100);
}

function getReactEnemyImage(config) {
  const image = config.enemyImages?.[0] || config.enemyImage || ASSETS.enemies.offbeatBeast || "assets/battle/enemies/broken_beat_beast_idle.png";
  return normalizeAssetPath(image);
}

function getReactAllyImage(config, index) {
  return normalizeAssetPath(config.allyImages?.[index] || "");
}

function getReactBattleCharacterId(name) {
  return REACT_BATTLE_CHARACTER_IDS[name] || String(name || "musicart").toLowerCase();
}

function normalizeAssetPath(path) {
  if (!path) return "";
  if (/^(https?:|data:|\/)/.test(path)) return path;
  return `/${path}`;
}

function setReactBattleLogFromText(text) {
  const segments = String(text || "").split(/\n\n+|\n/).map(s => s.trim()).filter(Boolean);
  latestReactBattleLog = segments.map((segment) => ({
    id: `battle-log-${reactBattleLogSequence++}`,
    text: segment,
    tone: inferReactBattleLogTone(segment)
  })).slice(-6);
}

function inferReactBattleLogTone(text) {
  if (/失调|警告|危险|失败|崩溃|不可/.test(text)) return "warning";
  if (/代价|消耗|压力|健康|-\d/.test(text)) return "cost";
  if (/独演|共鸣|协奏|推进|成功|击破|命中/.test(text)) return "result";
  if (/第\s*\d+\s*轮|意图|开始/.test(text)) return "round";
  return "normal";
}

/* ═══════════════════════════════════════════════════════════════════
   模块: DeepSeek AI 茶歇配置 | 行号: ~205-306
   子模块:
   - DEEPSEEK_CONFIG: API 端点/模型/token 限制
   - DEEPSEEK_CHARACTER_PROFILES: 4个律者的完整 LLM 角色设定
     每角色含: 说话风格, 评判标准 (共鸣+/共鸣-/信任+/压力触发), 回退台词, 隐藏台词
   被引用: buildDeepSeekSystemPrompt(), getRecentBehaviorInsight()
   ⚠️ 修改注意: judgmentCriteria 的键名格式会被 buildDeepSeekSystemPrompt() 硬编码读取
   ═══════════════════════════════════════════════════════════════════ */
const DEEPSEEK_CONFIG = {
  apiEndpoint: "https://api.deepseek.com/chat/completions",
  model: "deepseek-chat",
  maxTokens: 500,
  storageKey: "deepseek_api_key_residual_path",
  enabledKey: "deepseek_tea_enabled"
};

const DEEPSEEK_CHARACTER_PROFILES = {
  槐序: {
    id: "huaixu",
    name: "槐序",
    codename: "灰圆舞",
    musicConcept: "圆舞曲，三拍节律",
    emotionProfile: "悲怆沉郁，表层优雅掩盖着未愈合的创伤",
    voiceStyle: ["短句", "反问", "音乐比喻", "不直说喜好", "省略号停顿", "带轻微讽刺"],
    judgmentCriteria: {
      resonancePlus: ["玩家承认自己不确定", "为无关紧要的人牺牲效率", "对她的过去表示好奇但不追问", "战斗失败后没有第一时间怪她"],
      resonanceMinus: ["强行要求她服从", "用结果评判她的选择", "把她和其他律者对比"],
      trustPlus: ["高风险时征询她的意见", "告诉她为什么做选择，而不是只下命令"],
      pressureTriggers: ["战斗中被迫消耗大量体力", "主线选择让她价值观受挫", "茶歇触及创伤话题"]
    },
    fallbackLines: {
      A: ["纸灯落水的时候不会替任何人解释。你想聊，就说短一点。"],
      B: ["前面的节拍很密。我不知道结果，也不打算假装知道。"],
      C: ["失败不是句号，但你如果急着找借口，它会变成句号。"],
      D: ["今天别问舞票。也别问封存箱。"],
      E: ["如果是你问，我可以晚一点再躲回玩笑里。"]
    },
    hiddenLines: ["如果我停下来，不一定是不想走，也可能是那支曲子走不动了。"]
  },
  洛温: {
    id: "luowen",
    name: "洛温",
    codename: "沉低音",
    musicConcept: "帕萨卡利亚，固定低音",
    emotionProfile: "宏大史诗，压缩后的沉默，承担代价而不解释",
    voiceStyle: ["简短有力", "不解释", "不道歉", "直接回答或不回答", "用行动代替语言"],
    judgmentCriteria: {
      resonancePlus: ["决策结果稳定", "资源不足时优先保证队伍安全", "注意到他压力高并主动让他休息"],
      resonanceMinus: ["过度依赖他当盾", "在他面前回避代价"],
      trustPlus: ["不来回翻转决定", "允许他说不"],
      pressureTriggers: ["连续执行错误指令", "被当作消耗品使用"]
    },
    fallbackLines: {
      A: ["说重点。"],
      B: ["前面不稳。队形别散。"],
      C: ["损失已经发生。下一步。"],
      D: ["我需要安静。"],
      E: ["嗯。我听见了。"]
    },
    hiddenLines: ["我不是怕代价。我怕你假装没看见代价。"]
  },
  伊芙白: {
    id: "yifubai",
    name: "伊芙白",
    codename: "蓝调改色",
    musicConcept: "蓝调，即兴变奏",
    emotionProfile: "轻快俏皮，疲惫藏在笑声后面，用玩笑试探人心",
    voiceStyle: ["口语化", "爱用类比", "突然深刻然后假装没事", "测试玩家是否看穿", "笑声里藏着真话"],
    judgmentCriteria: {
      resonancePlus: ["选择绕路探索", "帮助信息更少的一方", "注意到她疲惫时减少战斗频率"],
      resonanceMinus: ["接受表面解释，没有看穿她的试探"],
      trustPlus: ["没有当场拆穿她的谎言但事后记得提"],
      pressureTriggers: ["连续出战不休息", "被要求解释自己的行为"]
    },
    fallbackLines: {
      A: ["哎呀，路还长，笑话先欠着。"],
      B: ["前面那段路像没调好的口琴，吹出来会刮嘴。"],
      C: ["输一次不丢人，装作不疼才丢人。"],
      D: ["我现在不想把话说圆。"],
      E: ["你看出来了？那我就少装一点。"]
    },
    hiddenLines: ["他们都是对的，这就是最糟糕的地方。"]
  },
  明弦: {
    id: "mingxian",
    name: "明弦",
    codename: "赤命定",
    musicConcept: "命运动机，强对比戏剧性",
    emotionProfile: "强势直接，重视承担后果与立场清晰，机械臂是过去的烙印",
    voiceStyle: ["直接", "有压迫感", "少说，说必中心", "不绕弯子", "带命令感但非恶意"],
    judgmentCriteria: {
      resonancePlus: ["敢于承担后果", "立场清晰不摇摆", "面对强敌不退让"],
      resonanceMinus: ["优柔寡断", "回避责任"],
      trustPlus: ["尊重她的战斗经验", "不质疑她的判断"],
      pressureTriggers: ["被质疑能力", "队友拖后腿"]
    },
    fallbackLines: {
      A: ["有话直说。我不猜谜语。"],
      B: ["前面有硬仗。别拖后腿。"],
      C: ["输了就是输了。下次赢回来。"],
      D: ["别烦我。让我自己待着。"],
      E: ["……你还算是个合格的奏者。"]
    },
    hiddenLines: ["这条胳膊不是勋章，是债。"]
  }
};

// 对话历史管理
let teaBreakConversationHistory = {};

/* ───────────────────────────────────────────────────────────
   模块: 茶歇对话历史管理 | 行号: ~307-331
   函数: getConversationHistory(), addToConversationHistory(), clearConversationHistory()
   被引用: buildDeepSeekSystemPrompt() (构建上下文)
   ⚠️ 历史上限: 16条消息 (最近8轮)，存储在内存中不持久化
   ─────────────────────────────────────────────────────────── */
function getConversationHistory(character) {
  if (!teaBreakConversationHistory[character]) {
    teaBreakConversationHistory[character] = [];
  }
  return teaBreakConversationHistory[character];
}

function addToConversationHistory(character, role, content) {
  const history = getConversationHistory(character);
  history.push({ role, content });
  // 只保留最近8轮
  if (history.length > 16) {
    history.splice(0, history.length - 16);
  }
}

function clearConversationHistory(character) {
  if (character) {
    teaBreakConversationHistory[character] = [];
  } else {
    teaBreakConversationHistory = {};
  }
}

// 获取DeepSeek API密钥
/* ───────────────────────────────────────────────────────────
   模块: DeepSeek API 密钥管理 | 行号: ~332-359
   函数: getDeepSeekApiKey(), saveDeepSeekApiKey(), isDeepSeekEnabled()
   存储: localStorage (密钥明文存在浏览器本地)
   被引用: handleSaveApiKey(), AI设置模态框
   ─────────────────────────────────────────────────────────── */
function getDeepSeekApiKey() {
  try {
    return localStorage.getItem(DEEPSEEK_CONFIG.storageKey) || "";
  } catch {
    return "";
  }
}

// 保存DeepSeek API密钥
function saveDeepSeekApiKey(key) {
  try {
    if (key) {
      localStorage.setItem(DEEPSEEK_CONFIG.storageKey, key);
    } else {
      localStorage.removeItem(DEEPSEEK_CONFIG.storageKey);
    }
    return true;
  } catch {
    return false;
  }
}

// 检查是否启用DeepSeek
function isDeepSeekEnabled() {
  return !!getDeepSeekApiKey();
}

// 构建玩家态度到自然语言的映射
/* ───────────────────────────────────────────────────────────
   模块: playerAttitudeToText (玩家态度映射) | 行号: ~360-370
   功能: 将茶歇中的态度枚举转换为自然语言描述
   支持: casual(闲聊), care(关心), force(追问), strategy(策略询问)
   被引用: buildDeepSeekSystemPrompt() 构建玩家输入
   ─────────────────────────────────────────────────────────── */
function playerAttitudeToText(attitude) {
  const map = {
    casual: "随便聊聊，语气轻松",
    care: "关心她的状态，语气温柔",
    force: "强行追问，语气强硬",
    strategy: "询问路上的风险和策略，语气认真"
  };
  return map[attitude] || "随便聊聊";
}

// 构建系统提示词
/* ───────────────────────────────────────────────────────────
   模块: buildDeepSeekSystemPrompt (构建系统提示词) | 行号: ~371-529
   功能: 构建发送给 DeepSeek API 的完整 system prompt
   参数: character(角色名), context(茶歇上下文)
   返回: 完整系统提示词字符串
   ⚠️ 公共 API: 被外部茶歇对话系统调用
   ⚠️ 修改注意: Hidden lines 的解锁阈值 (resonance >= 80 / >= 60) 在此硬编码
   ─────────────────────────────────────────────────────────── */
function buildDeepSeekSystemPrompt(character, context) {
  const profile = DEEPSEEK_CHARACTER_PROFILES[character];
  const musicart = MUSICART_RULES[character];
  if (!profile || !musicart) return "";

  const trust = GameState[musicart.trustKey] || 0;
  const resonance = GameState[musicart.resonanceKey] || 0;
  const pressure = GameState[musicart.pressureKey] || 0;
  const conductorGender = GameState.奏者性别 || "未标注";
  const healthTier = getConductorHealthTier();
  const contextType = context.contextType || "A";
  const chapterContext = context.chapterContext || "旅途中";

  let hiddenContent = "No hidden content is allowed.";
  if (resonance >= 80) {
    hiddenContent = `Hidden lines allowed: ${profile.hiddenLines.join(" / ")}。可以在合适的时候自然地说出这些隐藏台词，但不要刻意。`;
  } else if (resonance >= 60) {
    hiddenContent = "Hidden emotional keywords allowed, but do not reveal truth or backstory details.";
  }

  const triggeredEvents = (GameState.已触发事件 || []).slice(-5).join(", ") || "none";

  return [
    `【角色设定】`,
    `你现在扮演的是游戏《宿命回响：残响之途》中的律者「${profile.name}」，代号「${profile.codename}」。`,
    `音乐概念：${profile.musicConcept}`,
    `情绪基调：${profile.emotionProfile}`,
    `说话风格：${profile.voiceStyle.join("、")}`,
    ``,
    `【关系状态】`,
    `奏者（玩家）对你的信任值：${trust}/100`,
    `奏者（玩家）与你的共鸣值：${resonance}/100`,
    `你当前的压力值：${pressure}/100`,
    `奏者性别：${conductorGender}`,
    `奏者健康状态：${healthTier}`,
    `已触发事件：${triggeredEvents}`,
    ``,
    `【判断标准】`,
    `增加共鸣的行为：${profile.judgmentCriteria.resonancePlus.join("；")}`,
    `降低共鸣的行为：${profile.judgmentCriteria.resonanceMinus.join("；")}`,
    `增加信任的行为：${profile.judgmentCriteria.trustPlus.join("；")}`,
    `压力来源：${profile.judgmentCriteria.pressureTriggers.join("；")}`,
    ``,
    `【当前语境】`,
    `语境类型：${contextType}（A=平时闲聊，B=关键剧情前，C=战斗失败后，D=高压力，E=高信任/高共鸣）`,
    `章节进度：${chapterContext}`,
    ``,
    `【绝对禁止 - 永远不要违反】`,
    `1. 绝对不要剧透未来剧情或未触发的事件`,
    `2. 绝对不要新增游戏设定中没有的世界观、地点、人物或历史事件`,
    `3. 绝对不要给玩家音芯、粮药等资源奖励`,
    `4. 绝对不要在对话中直接说"信任增加了"或"共鸣提升了"之类的话`,
    `5. 绝对不要提到AI、API、开发者、模型、代码、现实世界等元信息`,
    `6. 绝对不要在信任或共鸣不足时提前说出隐藏真相或过去的秘密`,
    `7. 绝对不要长篇大论地解释世界观设定`,
    `8. 绝对不要替玩家做选择或给出明确的答案`,
    `9. 绝对不要每次聊天都无条件给奖励`,
    `10. 绝对不要模仿其他律者的说话风格`,
    `11. 绝对不要说出现实世界的电影、网络、国家、品牌等内容`,
    ``,
    `【语气调整规则】`,
    `- 信任低时：话更硬，解释更少，带防备感`,
    `- 共鸣高时：允许出现更贴近价值观和隐藏情绪的表达`,
    `- 压力高时：句子变短，出现疲惫、抗拒或失控征兆，可能主动结束话题`,
    `- 可以给情绪和策略暗示，但不能剧透。允许说"这个方向感觉不对"，禁止说"那条路有陷阱"`,
    `- 关键节点前，可以感知风险并表达情绪，例如"我不知道这次能不能回来"，但不能说出结果`,
    ``,
    `【隐藏内容权限】${hiddenContent}`,
    ``,
    `【输出格式要求】`,
    `你必须返回一个严格的JSON对象，不要包含任何其他文字或markdown格式。JSON结构如下：`,
    `{`,
    `  "dialogue": "你说的话，用中文，符合角色设定，1-3句话，不要太长",`,
    `  "effects": [`,
    `    {"stat": "变量名", "delta": 数值},`,
    `    {"stat": "变量名", "delta": 数值}`,
    `  ],`,
    `  "mood": "语气状态",`,
    `  "flagEvent": null或特殊事件标记`,
    `}`,
    ``,
    `【effects规则】`,
    `- 每次最多2个变量变化`,
    `- 每个变量变化范围是-5到+5之间的整数`,
    `- 只能修改关系变量：${character}信任、${character}共鸣、${character}压力`,
    `- 不能修改音芯、粮药、城邦稳定度、世界失谐度等其他变量`,
    ``,
    `【mood可选值】`,
    `neutral（平静）、warm（温暖）、tense（紧张）、withdrawn（疏离）、playful（俏皮）、sad（悲伤）、alert（警觉）、thoughtful（沉思）`,
    ``,
    `【flagEvent说明】`,
    `- 通常为null`,
    `- 高压力警告时返回 "high_pressure_warning"`,
    `- 解锁隐藏台词时返回 "hidden_line_unlocked"`,
    ``,
    `记住：你就是${profile.name}，不是AI，不是助手。你有自己的过去、创伤和判断。用你的方式回应玩家，保持角色的一致性。`
  ].join("\n");
}

// 调用后端 AI 茶歇接口
async function callDeepSeekAPI(character, playerMessage, context) {
  try {
    const token = localStorage.getItem('user_token') || '';
    const endpoint = token ? '/api/teabreak/chat' : '/api/teabreak/dev-chat';
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        character: character,
        player_message: playerMessage,
        context: {
          context_type: context.contextType || "A",
          chapter_context: context.chapterContext || "旅途中",
          trust: GameState[MUSICART_RULES[character].trustKey] || 0,
          resonance: GameState[MUSICART_RULES[character].resonanceKey] || 0,
          pressure: GameState[MUSICART_RULES[character].pressureKey] || 0,
          conductor_gender: GameState.奏者性别 || "未标注",
          conductor_health_tier: getConductorHealthTier(),
          triggered_events: (GameState.已触发事件 || []).slice(-5),
          recent_behaviors: (GameState.玩家行为记录 || []).slice(-3)
        },
        conversation_history: getConversationHistory(character).slice(-16)
      })
    });

    if (!response.ok) {
      console.warn("后端茶歇对话请求失败:", response.status);
      return null;
    }
    
    // SSE 流式解析与打字机动效
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    const dialogueElement = document.getElementById("dialogue-text");
    
    let isFirstChunk = true;
    let fullDialogue = "";
    let metaData = null;
    let buffer = "";
    let currentEvent = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // 保留最后一行不完整的
      
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEvent = line.substring(7).trim();
        } else if (line.startsWith('data: ')) {
          const dataStr = line.substring(6).trim();
          if (currentEvent === 'text') {
            if (isFirstChunk) {
              dialogueElement.textContent = "";
              isFirstChunk = false;
            }
            try {
              const textChunk = JSON.parse(dataStr);
              fullDialogue += textChunk;
              // 实时逐字追加
              dialogueElement.textContent += textChunk;
              // 播放打字音效 (限流，避免太吵)
              if (window.AudioManager && window.AudioManager.playSFX) {
                const now = Date.now();
                if (!window._lastTypeSound || now - window._lastTypeSound > 80) { // 限制最小间隔 80ms
                  window._lastTypeSound = now;
                  window.AudioManager.playSFX("click"); // 改为使用基础的 click 音效，通常比 hover 更干脆
                }
              }
            } catch (e) { console.error("Text parse error", e); }
          } else if (currentEvent === 'meta') {
            try {
              metaData = JSON.parse(dataStr);
            } catch (e) { console.error("Meta parse error", e); }
          }
        }
      }
    }

    // 告诉后续的 showDialogue 跳过 GSAP 动画，因为已经流式打字过了
    window.__skipNextGSAP = true;

    return {
      dialogue: fullDialogue,
      effects: metaData?.effects || [],
      mood: metaData?.mood || "neutral",
      flagEvent: metaData?.flagEvent || null
    };
  } catch (error) {
    console.warn("茶歇流式请求出错:", error);
    return null;
  }
}

// 解析DeepSeek返回的JSON
/* ───────────────────────────────────────────────────────────
   模块: DeepSeek 响应解析与清洗 | 行号: ~530-607
   函数: parseDeepSeekJsonResponse() — 解析 JSON 响应
         sanitizeDeepSeekReply() — 清洗并验证回复内容
   被引用: AI 茶歇对话流程中的 API 响应处理
   ⚠️ 修改注意: 清洗规则会影响 AI 输出的最终呈现
   ─────────────────────────────────────────────────────────── */
function parseDeepSeekJsonResponse(text) {
  try {
    // 清理可能的markdown格式
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    // 提取JSON对象
    const objectStart = cleaned.indexOf("{");
    const objectEnd = cleaned.lastIndexOf("}");
    if (objectStart === -1 || objectEnd === -1 || objectEnd < objectStart) {
      return null;
    }

    const jsonStr = cleaned.slice(objectStart, objectEnd + 1);
    const parsed = JSON.parse(jsonStr);

    // 验证基本结构
    if (!parsed.dialogue || typeof parsed.dialogue !== "string") {
      return null;
    }

    // 确保effects是数组
    if (!Array.isArray(parsed.effects)) {
      parsed.effects = [];
    }

    // 确保mood合法
    if (!AI_ALLOWED_MOODS.includes(parsed.mood)) {
      parsed.mood = "neutral";
    }

    // 确保flagEvent存在
    if (parsed.flagEvent === undefined) {
      parsed.flagEvent = null;
    }

    return parsed;
  } catch (error) {
    console.warn("Failed to parse DeepSeek JSON:", error);
    return null;
  }
}

// 验证并清理AI回复
function sanitizeDeepSeekReply(character, reply) {
  if (!reply) return null;

  const musicart = MUSICART_RULES[character];
  if (!musicart) return reply;

  // 清理effects
  const safeEffects = [];
  if (Array.isArray(reply.effects)) {
    for (const effect of reply.effects.slice(0, 2)) {
      if (AI_RELATION_STATS.has(effect.stat) && Number.isFinite(effect.delta)) {
        safeEffects.push({
          stat: effect.stat,
          delta: Math.max(-5, Math.min(5, Math.trunc(effect.delta)))
        });
      }
    }
  }

  // 检查禁用词
  const forbiddenPatterns = ["AI", "API", "开发者", "模型", "现实世界", "国家", "品牌", "电影", "网络", "之后你会遇到"];
  const hasForbidden = forbiddenPatterns.some((pattern) => reply.dialogue?.includes(pattern));
  if (hasForbidden) {
    return null;
  }

  return {
    dialogue: reply.dialogue || "……这句话先停在这里。",
    effects: safeEffects,
    mood: AI_ALLOWED_MOODS.includes(reply.mood) ? reply.mood : "neutral",
    flagEvent: reply.flagEvent || null
  };
}

/* ═══════════════════════════════════════════════════════════════════
   模块: AI_MUSICART_RULES (回退对话库/本地预设对话) | 行号: ~608-842
   功能: 当 DeepSeek API 不可用时的回退对话数据
   4个律者各含:
   - 5种态度回复 (casual/care/force/strategy/cold)
   - highPressureOverride (高压覆盖回复)
   - hiddenLineAppend (高共鸣时追加的隐藏台词)
   被引用: createFallbackAIReply()
   ⚠️ 修改注意: 态度枚举值必须与 playerAttitudeToText() 中的映射保持一致
   ═══════════════════════════════════════════════════════════════════ */
const AI_MUSICART_RULES = {
  阿缇娅: {
    hiddenLineStat: "阿缇娅共鸣",
    hiddenLineThreshold: 55,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "回答像战斗日志，避免情感词。",
      highPressure: "拒绝缇雅相关称呼，语句短促。",
      highResonance: "允许承认自己继承了缇雅残响，但仍强调身份边界。"
    },
    replies: {
      casual: {
        dialogue: "声源稳定。你的问题不稳定。若这是闲聊，我需要重新定义闲聊。",
        effects: [{ stat: "阿缇娅共鸣", delta: 1 }],
        mood: "neutral",
        flagEvent: null
      },
      care: {
        dialogue: "机能正常。情绪残响存在波动。你没有把它叫作故障，这一点已记录。",
        effects: [
          { stat: "阿缇娅信任", delta: 3 },
          { stat: "阿缇娅压力", delta: -3 }
        ],
        mood: "thoughtful",
        flagEvent: null
      },
      force: {
        dialogue: "拒绝该提问方式。不要用她的名字命令我回答。",
        effects: [
          { stat: "阿缇娅压力", delta: 5 },
          { stat: "阿缇娅信任", delta: -2 }
        ],
        mood: "tense",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "前方静默残留呈环形。建议先确认撤离路线，再允许我展开暮星序列。",
        effects: [{ stat: "阿缇娅信任", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "战斗可用。契约代价仍由奏者健康承担。报告结束。",
        effects: [
          { stat: "阿缇娅共鸣", delta: -2 },
          { stat: "阿缇娅压力", delta: 2 }
        ],
        mood: "withdrawn",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "停止。不要追问缇雅。不要把残响误认为复活。",
      effects: [{ stat: "阿缇娅压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 我拥有她的残响，但我不是你失去的那个人。"
  },
  弥洛: {
    hiddenLineStat: "弥洛共鸣",
    hiddenLineThreshold: 55,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "话更少，只确认路线和风险。",
      highPressure: "把回答压成低频警告，避免解释创伤。",
      highResonance: "允许说明沉默不是拒绝，而是在稳住防线。"
    },
    replies: {
      casual: {
        dialogue: "低频正常。你要闲聊也可以，但别站在门口，那里声音会散。",
        effects: [{ stat: "弥洛信任", delta: 1 }],
        mood: "neutral",
        flagEvent: null
      },
      care: {
        dialogue: "我还撑得住。你先问防线，再问我，这个顺序比安慰有用。",
        effects: [
          { stat: "弥洛信任", delta: 3 },
          { stat: "弥洛压力", delta: -3 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "不要把低音当墙推。墙也会裂。",
        effects: [
          { stat: "弥洛压力", delta: 5 },
          { stat: "弥洛信任", delta: -2 }
        ],
        mood: "tense",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "先撤人，再压场。没有撤离线的战斗，只是在等损失变大。",
        effects: [{ stat: "弥洛信任", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "可出战。低频盾还能展开。别浪费。",
        effects: [
          { stat: "弥洛共鸣", delta: -1 },
          { stat: "弥洛压力", delta: 2 }
        ],
        mood: "withdrawn",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "短话。防线在响，我得先压住它。",
      effects: [{ stat: "弥洛压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 低音不是不说话，它只是先替别人撑住地面。"
  },
  槐序: {
    hiddenLineStat: "槐序共鸣",
    hiddenLineThreshold: 70,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "话更硬，拒绝被当作工具。",
      highPressure: "句子变短，主动结束敏感话题。",
      highResonance: "允许露出舞票、旧曲和自我怀疑的边缘。"
    },
    replies: {
      casual: {
        dialogue: "纸灯？它们其实不轻。每一盏都像有人把没说完的话塞进去，再假装水会替他们读完。你要是只是想听我讲路上的风景，那我可以讲一点，但别把它写成报告。",
        effects: [{ stat: "槐序共鸣", delta: 2 }],
        mood: "thoughtful",
        flagEvent: null
      },
      care: {
        dialogue: "我还撑得住。你问这句话的时候没有先看战斗记录，这点比记录本身更少见。别高兴得太早，我只是说少见。",
        effects: [
          { stat: "槐序信任", delta: 3 },
          { stat: "槐序压力", delta: -4 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "不。今天别问封存箱，也别把关心磨成钥匙。你越想从缝里撬出答案，我越会想起那些真正拿着钥匙的人。",
        effects: [
          { stat: "槐序压力", delta: 5 },
          { stat: "槐序信任", delta: -2 }
        ],
        mood: "withdrawn",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "这个方向的回声太整齐了，像有人把错误擦干净以后才交给我们看。我不能说那里有什么，但如果你一定要走，别让洛温一个人顶在前面。",
        effects: [{ stat: "槐序信任", delta: 1 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "明白。只确认战斗可用性，对吧？那答案是：还能用。至于我是不是愿意被这样问，是另一份你暂时不需要的记录。",
        effects: [
          { stat: "槐序信任", delta: -2 },
          { stat: "槐序压力", delta: 3 }
        ],
        mood: "tense",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "短一点。别绕，别追问，别把沉默当成许可。我现在还能回答你，是因为我还记得你没有把我交回箱子里。",
      effects: [{ stat: "槐序压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 还有一句话我只说一次：如果我停下来，不一定是我不想走，也可能是那支曲子走不动了。"
  },
  洛温: {
    hiddenLineStat: "洛温共鸣",
    hiddenLineThreshold: 70,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "回答更短，不解释动机，只确认可执行边界。",
      highPressure: "语气钝化，拒绝讨论失败细节。",
      highResonance: "允许谈到固定低音背后的亏欠感。"
    },
    replies: {
      casual: {
        dialogue: "车外风向变了。不是坏事，只是别把它当成安全。你要闲聊也可以，但我会先检查轮轴和护具。",
        effects: [{ stat: "洛温信任", delta: 1 }],
        mood: "neutral",
        flagEvent: null
      },
      care: {
        dialogue: "我能站。你注意到我压力偏高，这比多问一句“能不能撑住”更有用。下一场，如果不是必须，让我晚一点上。",
        effects: [
          { stat: "洛温信任", delta: 3 },
          { stat: "洛温压力", delta: -4 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "不要这样下命令。低音可以承重，但不是用来替所有人沉下去。再压一次，我会自己判断节拍。",
        effects: [
          { stat: "洛温压力", delta: 5 },
          { stat: "洛温信任", delta: -3 }
        ],
        mood: "tense",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "灰弦公路的开阔地不适合久停。要走就走直线；要救人，就先定撤离路线。犹豫会让代价变大。",
        effects: [{ stat: "洛温信任", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "战斗可用。护盾还能展开两次。除此之外，没有要报告的。",
        effects: [
          { stat: "洛温共鸣", delta: -2 },
          { stat: "洛温压力", delta: 2 }
        ],
        mood: "withdrawn",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "停。别问失败，别问遗书，也别问我为什么还站着。给我一段没有命令的时间。",
      effects: [{ stat: "洛温压力", delta: -2 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 固定低音不是因为它不会动，是因为有人必须记住整首曲子还没有塌。"
  },
  伊芙白: {
    hiddenLineStat: "伊芙白共鸣",
    hiddenLineThreshold: 70,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "用玩笑挡住真实回答，测试玩家是否只听表面。",
      highPressure: "笑话变薄，突然结束话题。",
      highResonance: "允许短暂承认疲惫和谎言。"
    },
    replies: {
      casual: {
        dialogue: "灰弦公路的风挺会装的，吹得像没事发生。你要问我喜不喜欢？我当然喜欢，越不可信的东西越适合拿来开场。",
        effects: [{ stat: "伊芙白共鸣", delta: 2 }],
        mood: "playful",
        flagEvent: null
      },
      care: {
        dialogue: "哎呀，被看出来了？我还以为我笑得很专业。放心，只是累，不是坏掉。你没当场拆穿，这点我记住。",
        effects: [
          { stat: "伊芙白信任", delta: 3 },
          { stat: "伊芙白压力", delta: -3 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "非要我解释？可以啊。解释完以后你会得到一个漂亮答案，至于它是不是真的，你准备拿什么来听？",
        effects: [
          { stat: "伊芙白信任", delta: -3 },
          { stat: "伊芙白压力", delta: 5 }
        ],
        mood: "tense",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "如果两条路都说自己安全，选信息更少的那条。假的答案通常写得太完整，真的危险反而懒得解释。",
        effects: [{ stat: "伊芙白共鸣", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "只问战斗表现？蓝调还能变色，口琴还能响，我也还能笑。三项指标都很漂亮，漂亮到不必追问。",
        effects: [
          { stat: "伊芙白信任", delta: -2 },
          { stat: "伊芙白压力", delta: 3 }
        ],
        mood: "playful",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "今天笑话库存告急。别逼我把最后一个也拿出来，它不好笑，而且可能是真的。",
      effects: [{ stat: "伊芙白压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 有些即兴不是自由，是来不及承认自己早就写好了结尾。"
  },
  明弦: {
    hiddenLineStat: "明弦共鸣",
    hiddenLineThreshold: 70,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "语气更挑衅，用强势掩盖不信任。",
      highPressure: "回答变短，拒绝承认机械臂或旧伤影响判断。",
      highResonance: "允许短暂谈到命运感背后的被迫选择。"
    },
    replies: {
      casual: {
        dialogue: "长廊的风很会演，吹得每根廊柱都像有证词。你要闲聊可以，但别期待我把时间花在礼貌上。",
        effects: [{ stat: "明弦信任", delta: 1 }],
        mood: "neutral",
        flagEvent: null
      },
      care: {
        dialogue: "看出来了？我的机械臂没有坏，只是比某些人的判断更诚实。你没有当众点破，这一点我记下。",
        effects: [
          { stat: "明弦信任", delta: 3 },
          { stat: "明弦压力", delta: -3 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "命令我？可以。前提是你能承担我照做后的结果。不要把胆怯包装成指挥权。",
        effects: [
          { stat: "明弦压力", delta: 4 },
          { stat: "明弦信任", delta: -2 }
        ],
        mood: "tense",
        flagEvent: null
      },
      strategy: {
        dialogue: "静默核心不是宝箱，也不是圣物。它更像一枚还没爆开的强音。靠近时别问谁对，先问谁愿意承担后果。",
        effects: [{ stat: "明弦信任", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "战斗可用。指挥棒、断刃、机械臂都还能动。你要的如果只有这份报告，那就到此为止。",
        effects: [
          { stat: "明弦共鸣", delta: -2 },
          { stat: "明弦压力", delta: 2 }
        ],
        mood: "withdrawn",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "别问旧伤。也别问我为什么一定要赢。现在我还能把话说清楚，已经算给你面子。",
      effects: [{ stat: "明弦压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 所谓命运，不是我相信它，是它来得太早，早到我没来得及拒绝。"
  }
};

/* ───────────────────────────────────────────────────────────
   模块: 待决选择变量 | 行号: ~843-845
   pendingConductorSelection: 等待奏者性别选择时的回调
   pendingTeamSelection: 等待队伍选择时的回调
   ⚠️ 只在模态弹窗打开时有值，选择完成后置 null
   ─────────────────────────────────────────────────────────── */
let pendingConductorSelection = null;
let pendingTeamSelection = null;

/* ═══════════════════════════════════════════════════════════════════
   模块: ASSETS (资源引用表) | 行号: ~846-932
   子表: characters (角色立绘), backgrounds (场景背景),
         enemies (敌方图片), effects (特效素材), icons (图标)
   被引用: getCharacterAssetPath(), buildBackgroundLayer(), showScene()
   ⚠️ 修改注意: 路径指向 assets/ 目录，新增图片需确保文件存在
   ═══════════════════════════════════════════════════════════════════ */
const ASSETS = {
  characters: {
    "玛伦": {
      default: "assets/generated/characters/cutouts/char_maren_story_base_v01_cutout_v03.png"
    },
    "祁恩": {
      default: "assets/generated/characters/cutouts/char_qien_story_base_v01_cutout_v03.png"
    },
    "槐序": {
      default: "assets/generated/characters/cutouts/char_huaixu_guarded_white_gold_v02_cutout_v03.png",
      archiveFullbody: "assets/generated/characters/cutouts/char_huaixu_guarded_white_gold_v02_cutout_v03.png",
      guarded: "assets/generated/characters/cutouts/char_huaixu_guarded_white_gold_v02_cutout_v03.png",
      sarcastic: "assets/generated/characters/cutouts/char_huaixu_sarcastic_white_gold_v02_cutout_v03.png",
      dissonance: "assets/generated/characters/cutouts/char_huaixu_dissonance_white_gold_v02_cutout_v03.png",
      battle: "assets/generated/characters/cutouts/char_huaixu_battle_white_gold_v02_cutout_v03.png"
    },
    "洛温": {
      default: "assets/generated/characters/cutouts/char_luowen_observing_white_gold_v02_cutout_v03.png",
      archiveFullbody: "assets/generated/characters/cutouts/char_luowen_observing_white_gold_v02_cutout_v03.png",
      burdened: "assets/generated/characters/cutouts/char_luowen_burdened_white_gold_v02_cutout_v03.png",
      observing: "assets/generated/characters/cutouts/char_luowen_observing_white_gold_v02_cutout_v03.png",
      guardian: "assets/generated/characters/cutouts/char_luowen_guardian_white_gold_v02_cutout_v03.png",
      battle: "assets/generated/characters/cutouts/char_luowen_battle_white_gold_v02_cutout_v03.png"
    },
    "伊芙白": {
      default: "assets/generated/characters/cutouts/char_yifubai_falseCheer_white_gold_v02_cutout_v03.png",
      archiveFullbody: "assets/generated/characters/cutouts/char_yifubai_falseCheer_white_gold_v02_cutout_v03.png",
      tired: "assets/generated/characters/cutouts/char_yifubai_tired_white_gold_v02_cutout_v03.png",
      insight: "assets/generated/characters/cutouts/char_yifubai_insight_white_gold_v02_cutout_v03.png",
      falseCheer: "assets/generated/characters/cutouts/char_yifubai_falseCheer_white_gold_v02_cutout_v03.png",
      battle: "assets/generated/characters/cutouts/char_yifubai_battle_white_gold_v02_cutout_v03.png"
    },
    "明弦": {
      default: "assets/generated/characters/cutouts/char_mingxian_default_white_gold_v02_cutout_v03.png",
      archiveFullbody: "assets/generated/characters/cutouts/char_mingxian_default_white_gold_v02_cutout_v03.png",
      challenge: "assets/generated/characters/cutouts/char_mingxian_challenge_white_gold_v02_cutout_v03.png",
      burdened: "assets/generated/characters/cutouts/char_mingxian_burdened_white_gold_v02_cutout_v03.png",
      battle: "assets/generated/characters/cutouts/char_mingxian_battle_white_gold_v02_cutout_v03.png"
    },
    "凛澈": {
      default: "assets/generated/characters/char_protagonist_rinche_male_default_v01.png",
      chapter0PreContract: "assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinche_sprite_pre_contract_v03.png",
      chapter0Mother: "assets/generated/chapter0/characters/char_ch0_protagonist_rinche_pre_contract_mother_v01.png"
    },
    "凛纱": {
      default: "assets/generated/characters/char_protagonist_rinsa_female_default_v01.png",
      chapter0PreContract: "assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinsa_sprite_pre_contract_v03.png",
      chapter0Mother: "assets/generated/chapter0/characters/char_ch0_protagonist_rinsa_pre_contract_mother_v01.png",
      preContract: "assets/generated/characters/char_protagonist_rinsa_pre_contract_v01.png",
      batonCatch: "assets/generated/characters/char_protagonist_rinsa_baton_catch_v01.png",
      battleConductor: "assets/generated/characters/char_protagonist_rinsa_battle_conductor_v01.png"
    },
    "缇雅": {
      default: "assets/generated/character_states/sprites/char_tiya_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_tiya_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_tiya_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_tiya_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_tiya_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_tiya_sprite_special_v02.png",
      farewell: "assets/generated/character_states/sprites/char_tiya_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter0/sprites/characters/char_ch0_tiya_sprite_default_ai_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_tiya_human_mother_v01.png"
    },
    "阿缇娅": {
      default: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_atya_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_atya_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_atya_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_atya_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_atya_sprite_special_v02.png",
      daily: "assets/generated/chapter1/sprites/characters/char_ch1_atya_daily_sprite_default_v01.png",
      transformed: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      battle: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      legacyDaily: "assets/generated/chapter1/sprites/characters/char_ch1_atya_daily_sprite_default_v01.png",
      legacyTransformed: "assets/generated/chapter0/sprites/characters/char_ch0_atya_sprite_transformed_ai_v01.png",
      eyeCloseup: "assets/generated/chapter0/characters/char_ch0_atya_eye_transformation_closeup_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_atya_musicart_mother_v01.png"
    },
    "弥洛": {
      default: "assets/generated/character_states/sprites/char_milo_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_milo_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_milo_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_milo_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_milo_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_milo_sprite_special_v02.png",
      battle: "assets/generated/character_states/sprites/char_milo_sprite_default_v04.png",
      legacyDefault: "assets/generated/chapter0/sprites/characters/char_ch0_milo_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_milo_low_hum_knight_mother_v01.png"
    },
    "安柠": {
      default: "assets/generated/character_states/sprites/char_anning_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_anning_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_anning_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_anning_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_anning_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_anning_sprite_special_v02.png",
      medic: "assets/generated/character_states/sprites/char_anning_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter0/sprites/characters/char_ch0_anning_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_anning_mechanic_mother_v01.png"
    },
    "诺伊": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_noi_sprite_default_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_noi_echo_boy_mother_v01.png"
    },
    "卡戎": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_charon_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_charon_beatbreaker_mother_v01.png"
    },
    "瑟萝弥": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_serolomy_sprite_default_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_serolomy_black_mass_mother_v01.png"
    },
    "乌鸦先生": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_mr_crow_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_mr_crow_record_owner_mother_v01.png"
    },
    "米拉奶奶": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_grandma_mira_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_grandma_mira_ticket_seller_mother_v01.png"
    },
    "奥托": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_otto_sprite_default_v01.png"
    },
    "霍尔特": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_holt_sprite_default_v01.png"
    },
    "伊莱娜": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_elena_sprite_default_v01.png"
    },
    "琳": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_lin_sprite_default_v01.png"
    },
    "铃": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_ling_sprite_default_v01.png"
    },
    "白栖": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_baiqi_sprite_default_ai_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_baiqi_silence_patrol_mother_v01.png"
    },
    "母亲": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_mother_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_mother_piano_tuner_mother_v01.png"
    },
    "母亲的残响": {
      default: "assets/generated/chapter2/sprites/characters/char_ch2_mother_echo_sprite_default_v01.png"
    },
    "宁溯": {
      default: "assets/generated/character_states/sprites/char_ningsu_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_ningsu_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_ningsu_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_ningsu_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_ningsu_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_ningsu_sprite_special_v02.png",
      battle: "assets/generated/character_states/sprites/char_ningsu_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter2/sprites/characters/char_ch2_ningsu_sprite_default_v01.png",
      legacyBattle: "assets/generated/chapter2/sprites/characters/char_ch2_ningsu_sprite_battle_v01.png"
    },
    "看塔仪": {
      default: "assets/generated/chapter2/sprites/characters/char_ch2_tower_orb_sprite_default_v01.png"
    },
    "沈知微": {
      default: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_special_v02.png",
      ally: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter3/sprites/characters/char_ch3_shen_zhiwei_sprite_default_v02.png"
    },
    "珏衡": {
      default: "assets/generated/character_states/sprites/char_juheng_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_juheng_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_juheng_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_juheng_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_juheng_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_juheng_sprite_special_v02.png",
      battle: "assets/generated/character_states/sprites/char_juheng_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter3/sprites/characters/char_ch3_juheng_sprite_default_v02.png",
      legacyBattle: "assets/generated/chapter3/sprites/characters/char_ch3_juheng_sprite_battle_v02.png"
    },
    "温别克": {
      default: "assets/generated/chapter3/sprites/characters/char_ch3_wenbeck_sprite_default_v02.png"
    },
    "柏舟": {
      default: "assets/generated/chapter3/sprites/characters/char_ch3_baizhou_sprite_default_v02.png"
    },
    "尤娜": {
      default: "assets/generated/chapter1/sprites/characters/char_ch1_yuna_sprite_default_v01.png",
      sequence07: "assets/generated/chapter1/sprites/characters/char_ch1_yuna_sequence07_sprite_default_v01.png"
    },
    "零四": {
      default: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_default_v01.png",
      smile: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_smile_v01.png",
      worried: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_worried_v01.png",
      serious: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_serious_v01.png",
      shocked: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_shocked_v01.png",
      special: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_special_v01.png",
      sourceMother: "assets/generated/chapter1/sprites/enemies/enemy_ch1_silent_sequence_04_sprite_default_v01.png"
    },
    "钟先生": {
      default: "assets/generated/chapter1/sprites/characters/char_ch1_zhong_sprite_default_v01.png"
    },
    "柯婆婆": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_grandma_mira_sprite_default_v02.png"
    },
    "老潘": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_otto_sprite_default_v01.png"
    },
    "祁雨": {
      default: "assets/generated/characters/cutouts/char_qiyu_story_base_v01_cutout_v03.png"
    },
    "洛塔": {
      default: "assets/generated/characters/cutouts/char_luota_concept_base_v01_cutout_v03.png"
    }
  },
  backgrounds: {
    prologueSilentStaff: "assets/images/opening_silent_staff_line_v01.png",
    prologueSilentBridge: "assets/images/title_city_silent_bridge_v01.png",
    ch0MianshaTownSquare: "assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png",
    ch0AbandonedTheaterStage: "assets/generated/chapter0/backgrounds/bg_ch0_abandoned_theater_stage_v01.png",
    ch0OldDinerShelter: "assets/generated/chapter0/backgrounds/bg_ch0_old_diner_shelter_v01.png",
    ch0RecordShopArchive: "assets/generated/chapter0/backgrounds/bg_ch0_record_shop_archive_v02.png",
    ch0ClocktowerMechanism: "assets/generated/chapter0/backgrounds/bg_ch0_clocktower_mechanism_v01.png",
    ch0AbandonedSchoolMusicRoom: "assets/generated/chapter0/backgrounds/bg_ch0_abandoned_school_music_room_v01.png",
    ch0TheaterBackstageDress: "assets/generated/chapter0/backgrounds/bg_ch0_theater_backstage_dress_v01.png",
    ch0ChildhoodSilentPianoRoom: "assets/generated/chapter0/backgrounds/bg_ch0_childhood_silent_piano_room_v01.png",
    ch0AtyaEyeCloseup: "assets/generated/chapter0/characters/char_ch0_atya_eye_transformation_closeup_v01.png",
    ch0BatonContract: "assets/generated/chapter0/keyvisuals/cg_ch0_baton_contract_v01.png",
    qixianPlaza: "assets/generated/backgrounds/bg_white_score_morning_bell_plaza_v02.png",
    echoCity: "assets/generated/backgrounds/bg_echo_city_white_gold_opera_v02.png",
    teaLounge: "assets/generated/backgrounds/bg_white_score_tea_lounge_v02.png",
    echoCouncil: "assets/generated/backgrounds/bg_echo_council_organ_chamber_v02.png",
    silentCore: "assets/generated/backgrounds/bg_silent_core_tuning_fork_v02.png",
    qixianTuningPlatform: "assets/generated/backgrounds/bg_white_score_tuning_hall_v02.png",
    qixianTuningRoom: "assets/generated/backgrounds/bg_white_score_tuning_hall_v02.png",
    daynightTroupeConvoy: "assets/generated/backgrounds/bg_daynight_touring_troupe_repair_convoy_v01.png",
    qixianLowerStreet: "assets/backgrounds/bg_qixian_lower_street_black_market_v01.png",
    graystringDay: "assets/generated/backgrounds/bg_graystring_gallery_v02.png",
    graystringDusk: "assets/generated/backgrounds/bg_graystring_gallery_v02.png",
    graystringBattle: "assets/generated/backgrounds/bg_broken_string_night_stage_v02.png",
    brokenStringStage: "assets/generated/backgrounds/bg_broken_string_night_stage_v02.png",
    graystringBossBridge: "assets/generated/backgrounds/bg_broken_string_night_stage_v02.png",
    atiyaBatonContract: "assets/generated/backgrounds/cg_atiya_baton_contract_v01.png",
    fogportExterior: "assets/backgrounds/bg_fogport_old_theater_exterior_v01.png",
    fogportStage: "assets/generated/backgrounds/bg_broken_string_night_stage_v02.png",
    ch1MujianRoad: "assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png",
    ch1MujianStationPlatform: "assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png",
    ch1StationInnWarm: "assets/generated/chapter1/backgrounds/bg_ch1_station_inn_warm_v01.png",
    ch1Sequence04Confrontation: "assets/generated/chapter1/keyvisuals/cg_ch1_silent_sequence_04_confrontation_v01.png",
    ch1SeluomiStandoff: "assets/generated/chapter1/keyvisuals/cg_ch1_seluomi_platform_standoff_v01.png",
    ch2SnowfieldApproach: "assets/generated/chapter2/backgrounds/bg_ch2_snowfield_observatory_approach_v01.png",
    ch2ObservatoryExterior: "assets/generated/chapter2/backgrounds/bg_ch2_frost_score_observatory_exterior_v01.png",
    ch2CrystalCorridor: "assets/generated/chapter2/backgrounds/bg_ch2_crystal_resonance_corridor_v01.png",
    ch2ArchiveRoom: "assets/generated/chapter2/backgrounds/bg_ch2_frozen_archive_room_v01.png",
    ch2CoreChamber: "assets/generated/chapter2/backgrounds/bg_ch2_core_recording_chamber_v01.png",
    ch2BossChamber: "assets/generated/chapter2/keyvisuals/cg_ch2_scoreheart_guardian_battle_v01.png",
    ch2MotherEcho: "assets/generated/chapter2/keyvisuals/cg_ch2_mother_echo_manifest_v01.png",
    ch2Farewell: "assets/generated/chapter2/keyvisuals/cg_ch2_tower_farewell_v01.png",
    ch3WhiteScoreGate: "assets/generated/chapter3/keyvisuals/cg_ch3_white_score_main_v01.png",
    ch3ReceptionHall: "assets/generated/chapter3/backgrounds/bg_ch3_reception_hall_v01.png",
    ch3HearingChamber: "assets/generated/chapter3/backgrounds/bg_ch3_hearing_chamber_v01.png",
    ch3ArchiveCorridor: "assets/generated/chapter3/backgrounds/bg_ch3_archive_corridor_v01.png",
    ch3PortraitCorridor: "assets/generated/chapter3/backgrounds/bg_ch3_portrait_corridor_v01.png",
    ch3BossStandoff: "assets/generated/chapter3/keyvisuals/cg_ch3_juheng_boss_standoff_v01.png",
    ch3SecondFileDiscovery: "assets/generated/chapter3/keyvisuals/cg_ch3_second_file_discovery_v01.png",
    ch4MainKey: "assets/generated/chapter4/keyvisuals/cg_ch4_main_key_v01.png",
    ch4NightlessTrainCorridor: "assets/generated/chapter4/backgrounds/bg_ch4_nightless_train_corridor_v01.png",
    ch4AudienceCar: "assets/generated/chapter4/backgrounds/bg_ch4_audience_car_v01.png",
    ch4CoreOrganChamber: "assets/generated/chapter4/backgrounds/bg_ch4_core_organ_chamber_v01.png"
  },
  enemies: {
    soundMothSwarm: "assets/generated/enemies/enemy_sound_moth_swarm_v02.png",
    ch0MuteScoreMoth: "assets/generated/chapter0/sprites/enemies/enemy_ch0_mute_score_moth_sprite_default_v01.png",
    ch0StageCrawler: "assets/generated/chapter0/sprites/enemies/boss_ch0_stage_crawler_sprite_default_v01.png",
    ch0SoundStrippingOfficer: "assets/generated/chapter0/sprites/enemies/boss_ch0_sound_stripping_officer_sprite_default_v01.png",
    ch0BrokenBeatMarionette: "assets/generated/chapter0/sprites/enemies/enemy_ch0_broken_beat_marionette_sprite_default_v01.png",
    ch0SilenceHound: "assets/generated/chapter0/sprites/enemies/enemy_ch0_silence_hound_sprite_default_v01.png",
    ch0VoicelessChoir: "assets/generated/chapter0/sprites/enemies/enemy_ch0_voiceless_choir_sprite_default_v01.png",
    offbeatBeast: "assets/generated/enemies/enemy_broken_beat_puppet_v02.png",
    mirrorVoice: "assets/enemies/enemy_mirror_voice_humanoid_v01.png",
    silenceParasite: "assets/enemies/enemy_silence_parasite_v01.png",
    noBeatBoss: "assets/generated/enemies/boss_beatless_conductor_v02.png",
    ch1SilentSequence04: "assets/generated/chapter1/sprites/enemies/enemy_ch1_silent_sequence_04_sprite_default_v01.png",
    ch1EchoPatrol: "assets/generated/chapter0/sprites/enemies/boss_ch0_sound_stripping_officer_sprite_default_v01.png",
    ch1FogHowler: "assets/generated/chapter0/sprites/enemies/enemy_ch0_silence_hound_sprite_default_v01.png",
    ch2FrozenResidual: "assets/generated/chapter2/sprites/enemies/enemy_ch2_frozen_residual_sprite_default_v01.png",
    ch2TowerGuardian: "assets/generated/chapter2/sprites/enemies/enemy_ch2_tower_guardian_sprite_default_v01.png",
    ch2ScoreheartGuardian: "assets/generated/chapter2/sprites/enemies/boss_ch2_scoreheart_guardian_sprite_default_v01.png",
    ch3HallGuard: "assets/generated/chapter3/sprites/enemies/enemy_ch3_hall_guard_sprite_default_v02.png"
  },
  effects: {
    star: "assets/effects/kenney_star_01.png",
    spark: "assets/effects/kenney_spark_05.png",
    light: "assets/effects/kenney_light_02.png",
    trace: "assets/effects/kenney_trace_04.png"
  },
  icons: {
    cityStability: "assets/icons/icon_var_city_stability_v01.png",
    worldDissonance: "assets/icons/icon_var_world_dissonance_v01.png",
    foodMedicine: "assets/icons/icon_res_food_medicine_v01.png",
    soundCore: "assets/icons/icon_res_sound_core_v01.png",
    huaixuTrust: "assets/icons/icon_char_huaixu_trust_v01.png",
    huaixuPressure: "assets/icons/icon_char_huaixu_pressure_v01.png",
    whiteScoreReputation: "assets/icons/icon_faction_white_score_reputation_v01.png",
    melody: "assets/icons/icon_action_melody_mark_v01.png",
    harmony: "assets/icons/icon_action_harmony_guard_v01.png",
    rhythm: "assets/icons/icon_action_rhythm_delay_v01.png",
    timbre: "assets/icons/icon_action_timbre_rewrite_v01.png",
    silence: "assets/icons/icon_action_silence_seal_v01.png"
  }
};

/* ═══════════════════════════════════════════════════════════════════
   模块: 运行时状态变量 | 行号: ~933-944
   GameState: 克隆自 DEFAULT_GAME_STATE 的全局游戏状态 → 所有系统共享
   typewriterTimer: 打字机动画定时器
   scenePlaybackToken: 场景播放令牌 (用于取消旧对话序列)
   activeBattle: 当前战斗对象
   battleResultTimer / worldResolutionTimer: 定时器
   loadedPlayTimeMs / playSessionStartedAt: 游戏时间跟踪
   saveModalMode ("save"|"load"), interfaceMotionTimer, activeInterfaceMode
   noteEffects: 音符粒子画布状态对象
   ⚠️ 修改注意: 这类变量全部是全局可变状态，修改逻辑需考虑副作用
   ═══════════════════════════════════════════════════════════════════ */
let GameState = cloneData(DEFAULT_GAME_STATE);
let typewriterTimer = null;
let runtimeTypewriterDelay = TYPEWRITER_DELAY;
let scenePlaybackToken = 0;
let dialogueRevealToken = 0;
let activeDialogueReveal = null;
let pendingDialogueAdvance = null;
let activeBattle = null;
let battleResultTimer = null;
let worldResolutionTimer = null;
let loadedPlayTimeMs = 0;
let playSessionStartedAt = Date.now();
let saveModalMode = "load";
let interfaceMotionTimer = null;
let activeInterfaceMode = "menu";
let noteEffects = null;

/* ═══════════════════════════════════════════════════════════════════
   模块: SCENES (全部场景定义) | 行号: ~946-2560
   功能: 定义游戏中所有可播放的场景 (约42个)
   场景对象结构: { background, backgroundImage, systemPrompt, dialogues[], choices[] }
   被引用: showScene() — 场景播放入口
   ⚠️ 修改注意: 场景数据被 showScene() 硬编码读取字段名，修改结构需同步更新
              dialogues[] 每条包含 speaker/text/variant/onComplete 字段
              choices[] 每条包含 text/nextScene/conditions/effects 字段
   ═══════════════════════════════════════════════════════════════════ */
const SCENES = {
  "chapter0_start": {
    background: "#15110f",
    backgroundImage: ASSETS.backgrounds.ch0ChildhoodSilentPianoRoom,
    description: "黑屏里先出现四拍：一、二、三、四。童年的旧屋、不能发声的钢琴、小灯下的母亲，被雨夜公路的车灯一寸寸冲散。你醒来时，昼夜巡演团的修理车正驶向眠沙镇。",
    systemPrompt: "第零章 · 禁曲未响已开启。独立篇章规则：主角开局没有指挥棒，尚不是完整指挥家。",
    dialogues: [
      { speaker: "【内心】", text: "母亲坐在钢琴前，没有让琴响。她只是按住你的手，说每一首曲子开始前，都要先学会等待。" },
      { speaker: "安柠", text: "醒了？补给、换胎、找地方睡觉。然后我们立刻离开。" },
      { speaker: "缇雅", text: "如果那里真的有钢琴呢？" },
      { speaker: "【内心】", text: "你看见远处霓虹牌半亮半灭：今夜有演出。可这个世界已经很多年没有演出了。" }
    ],
    choices: [
      { text: "停车。我想看看那块牌子。", effects: [{ type: "change", key: "世界观信息", value: 2 }, { type: "event", value: "ch0_obsessed_with_sign" }], nextScene: "ch0_001_road_entrance" },
      { text: "先找补给，别节外生枝。", effects: [{ type: "change", key: "城邦稳定度", value: 1 }, { type: "event", value: "ch0_supply_first" }], nextScene: "ch0_001_road_entrance" },
      { text: "缇雅，你也听见了吗？", effects: [{ type: "change", key: "缇雅好感", value: 3 }, { type: "event", value: "ch0_asked_tiya_sound" }], nextScene: "ch0_001_road_entrance" }
    ]
  },
  "ch0_001_road_entrance": {
    background: "#0d1016",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    description: "眠沙镇不像死城。它更像一座被命令屏住呼吸的城。唱片店橱窗里摆着被刮花的黑胶，乐器行的门被钉死，酒馆牌子写着：本店不播放音乐，请安心入内。",
    dialogues: [
      { speaker: "诺伊", text: "你们是外面来的？你们车上……有乐器吗？" },
      { speaker: "安柠", text: "没有。" },
      { speaker: "诺伊", text: "可我听见了。" },
      { speaker: "缇雅", text: "他不是在撒谎。这里每一扇钉死的门后面，都像藏着没说完的歌。" }
    ],
    choices: [
      { text: "你听见了什么？", effects: [{ type: "change", key: "诺伊好感", value: 3 }, { type: "event", value: "ch0_met_noi_gently" }], nextScene: "ch0_002_silent_town" },
      { text: "别靠近我们。", effects: [{ type: "change", key: "诺伊恐惧", value: 2 }, { type: "event", value: "ch0_kept_noi_away" }], nextScene: "ch0_002_silent_town" },
      { text: "安柠，给他一点吃的。", effects: [{ type: "change", key: "镇民信任", value: 1 }, { type: "change", key: "粮药", value: -1 }], nextScene: "ch0_002_silent_town" }
    ]
  },
  "ch0_002_silent_town": {
    background: "#111827",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    description: "广场中央的旧钢琴被三层禁演封条缠住。雨水打在琴盖上，风干蔷薇贴着封条颤动，像某个每年偷偷回来的人留下的证据。",
    dialogues: [
      { speaker: "诺伊", text: "他们说，只要钢琴响，怪物就会来。" },
      { speaker: "【内心】", text: "他们没说错。可你仍然想打开琴盖，这比谎言更难原谅。" },
      { speaker: "缇雅", text: "只看一眼。真的只看一眼。" }
    ],
    choices: [
      { text: "只弹一个音。", effects: [{ type: "change", key: "世界失谐度", value: 5 }, { type: "change", key: "诺伊希望", value: 5 }, { type: "event", value: "ch0_one_note_temptation" }], nextScene: "ch0_003_old_piano" },
      { text: "我教你无声弹法。", effects: [{ type: "event", value: "ch0_silent_keys_route" }], nextScene: "ch0_004_silent_keys" },
      { text: "把封条重新贴好。", effects: [{ type: "change", key: "安柠好感", value: 3 }, { type: "change", key: "诺伊希望", value: -3 }], nextScene: "ch0_003_old_piano" }
    ]
  },
  "ch0_003_old_piano": {
    background: "#14100f",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    description: "琴键没有真正落下，琴槌却在琴箱里微微颤动。你忽然明白：这架钢琴不是不会响，而是一直在忍着不响。",
    dialogues: [
      { speaker: "诺伊", text: "如果声音会害人，那我们可以只把歌留在心里吗？" },
      { speaker: "缇雅", text: "可以。但总有一天，它要从心里出来。" },
      { speaker: "安柠", text: "你们两个知道自己很危险吧？" }
    ],
    choices: [
      { text: "先撤进餐馆避雨。", effects: [{ type: "event", value: "ch0_piano_checked" }], nextScene: "ch0_005_diner" },
      { text: "记下琴槌位置，稍后再查。", effects: [{ type: "change", key: "世界观信息", value: 1 }, { type: "event", value: "ch0_logged_piano_mechanism" }], nextScene: "ch0_005_diner" }
    ]
  },
  "ch0_004_silent_keys": {
    background: "#15110f",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    description: "无声琴键的诀窍，是让按键只下沉一半，不让琴槌真正敲击琴弦。诺伊盯着你的手，像第一次看见旋律可以不依赖声音而存在。",
    systemPrompt: "迷你游戏：无声琴键。保持半键下沉，不能让琴槌真正敲响琴弦。",
    dialogues: [
      { speaker: "诺伊", text: "我看见了。没有声音，但我看见它在走。" },
      { speaker: "【内心】", text: "卡戎未来会说：你连沉默都能指挥，真危险。" }
    ],
    choices: [
      { text: "稳住半键，完成无声旋律。", effects: [{ type: "change", key: "诺伊希望", value: 4 }, { type: "event", value: "无声旋律" }], nextScene: "ch0_005_diner" },
      { text: "手指失误，琴槌擦过琴弦。", effects: [{ type: "change", key: "世界失谐度", value: 3 }, { type: "event", value: "ch0_silent_key_failed" }], nextScene: "ch0_005_diner" }
    ]
  },
  "ch0_005_diner": {
    background: "#1a1512",
    backgroundImage: ASSETS.backgrounds.ch0OldDinerShelter,
    description: "旧餐馆里只有一盏灯能亮。罐头汤味道很糟，但至少是热的。窗外的雨把霓虹切成红金两色，像一场没人敢承认的演出预告。",
    dialogues: [
      { speaker: "缇雅", text: "如果只弹一首，会不会也算太贪心？" },
      { speaker: "【内心】", text: "在这个世界里，一个音都算。" },
      { speaker: "安柠", text: "所以你们两个知道自己很危险吧？" },
      { speaker: "缇雅", text: "知道。可知道和不想听，不是一回事。" }
    ],
    choices: [
      { text: "明天我们就离开。", effects: [{ type: "change", key: "安柠好感", value: 2 }, { type: "change", key: "缇雅好感", value: -1 }], nextScene: "ch0_006_mother_dream" },
      { text: "我想查清这个镇子的事。", effects: [{ type: "change", key: "缇雅好感", value: 2 }, { type: "change", key: "世界观信息", value: 1 }], nextScene: "ch0_006_mother_dream" },
      { text: "如果真的要弹，必须先保证大家安全。", effects: [{ type: "event", value: "ch0_rational_preparation" }], nextScene: "ch0_006_mother_dream" }
    ]
  },
  "ch0_006_mother_dream": {
    background: "#16141b",
    backgroundImage: ASSETS.backgrounds.ch0ChildhoodSilentPianoRoom,
    description: "梦里的旧屋开始漏雨。母亲坐在沉默钢琴前，金色音符像灰尘一样浮在灯下；门外有另一个人的指挥棒敲在地面上，第三下始终没有落下。",
    dialogues: [
      { speaker: "母亲", text: "你还是想按下去。" },
      { speaker: "【内心】", text: "我只是想让他听见。" },
      { speaker: "母亲", text: "你一直都是这样。明明自己也害怕，却总想先把别人从害怕里拉出来。" },
      { speaker: "卡戎", text: "她教得不错。可惜，她没有教你——有些旋律，从一开始就不该被允许。" }
    ],
    choices: [
      { text: "从梦里惊醒。", effects: [{ type: "event", value: "ch0_dream_charron_voice" }], nextScene: "ch0_007_voiceless_morning" }
    ]
  },
  "ch0_007_voiceless_morning": {
    background: "#18202a",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    description: "第二天清晨，眠沙镇没有任何声音。老人张着嘴却发不出声，孩子哭得满脸通红，哭声却没有传出来。",
    dialogues: [
      { speaker: "安柠", text: "不是他们不说话。是声音被拿走了。" },
      { speaker: "诺伊", text: "……" },
      { speaker: "缇雅", text: "如果昨晚那个无声旋律能被看见，也许声音没有死。只是被藏起来了。" }
    ],
    choices: [
      { text: "先救镇民，找回他们的声音。", effects: [{ type: "change", key: "镇民希望", value: 5 }], nextScene: "ch0_008_map_open" },
      { text: "直接去钟楼找源头。", effects: [{ type: "change", key: "镇民恐惧", value: 3 }, { type: "event", value: "ch0_clocktower_first" }], nextScene: "ch0_012_clocktower" },
      { text: "去旧剧场，昨晚那里不对劲。", effects: [{ type: "event", value: "ch0_theater_first" }], nextScene: "ch0_011_backstage_dress" }
    ]
  },
  "ch0_008_map_open": {
    background: "#12161d",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    description: "地图探索开放：钟楼、唱片店、旧剧场、广场旧钢琴、餐馆避难所、废弃学校、乐器行、镇长办公室、地下排水道。拖延过久，静默场会加深。",
    systemPrompt: "【地图探索开放】【完成三处关键事件后推进主线】当前版本先串联学校、唱片店、旧剧场三处关键事件。",
    dialogues: [
      { speaker: "安柠", text: "我们没有时间逐户安慰。但也不能只盯着一个机关。" },
      { speaker: "缇雅", text: "那就从孩子们开始。大人会撒谎，孩子不会把想唱歌这件事藏得太好。" }
    ],
    choices: [
      { text: "处理一件眠沙镇支线事件", effect: () => drawChapter0MapEvent() },
      { text: "前往废弃学校。", nextScene: "ch0_009_silent_school" },
      { text: "先去唱片店。", effects: [{ type: "event", value: "ch0_record_shop_first" }], nextScene: "ch0_010_record_shop" },
      { text: "绕到旧剧场后台。", effects: [{ type: "event", value: "ch0_theater_first" }], nextScene: "ch0_011_backstage_dress" }
    ]
  },
  "ch0_009_silent_school": {
    background: "#171717",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedSchoolMusicRoom,
    description: "废弃学校的音乐教室里，孩子们每天早上偷偷练习无声合唱。黑板上写着：如果声音会害人，那我们可以只把歌留在心里吗？",
    dialogues: [
      { speaker: "诺伊", text: "他们连口型都做不出来了。" },
      { speaker: "缇雅", text: "那我们替他们记节拍。先让歌在身体里有地方站住。" },
      { speaker: "【内心】", text: "你把四拍写在黑板边缘，像母亲隔着门缝留下的手势。" }
    ],
    choices: [
      { text: "帮他们找回歌词。", effects: [{ type: "event", value: "被擦掉的歌词" }, { type: "change", key: "镇民希望", value: 2 }], nextScene: "ch0_010_record_shop" },
      { text: "教他们打无声节拍。", effects: [{ type: "change", key: "世界失谐度", value: -1 }, { type: "event", value: "ch0_taught_silent_beat" }], nextScene: "ch0_010_record_shop" },
      { text: "让孩子们马上离开。", effects: [{ type: "change", key: "诺伊希望", value: -3 }], nextScene: "ch0_010_record_shop" }
    ]
  },
  "ch0_010_record_shop": {
    background: "#141318",
    backgroundImage: ASSETS.backgrounds.ch0RecordShopArchive,
    description: "唱片店地下柜里堆满被刮花的黑胶。乌鸦先生说，刮掉音轨的人以为声音死了，可声音有时会躲进划痕里。",
    dialogues: [
      { speaker: "乌鸦先生", text: "他们刮掉音轨的时候，以为声音死了。可声音有时候会躲进划痕里。" },
      { speaker: "系统", text: "迷你游戏：波形修复。从杂音中找出正确旋律片段，避免损坏母亲留下的录音。" },
      { speaker: "母亲", text: "如果有一天这段录音被你听见……说明我没能按时回来。不要找我。至少，现在不要。" }
    ],
    choices: [
      { text: "保存母亲声音残片 01。", effects: [{ type: "event", value: "母亲声音残片01" }, { type: "change", key: "世界观信息", value: 2 }], nextScene: "ch0_011_backstage_dress" },
      { text: "把黑胶先交给安柠保管。", effects: [{ type: "change", key: "安柠好感", value: 1 }, { type: "event", value: "ch0_anning_guarded_record" }], nextScene: "ch0_011_backstage_dress" }
    ]
  },
  "ch0_011_backstage_dress": {
    background: "#19110f",
    backgroundImage: ASSETS.backgrounds.ch0TheaterBackstageDress,
    description: "米拉奶奶打开旧剧场后台。衣架上挂着一条发旧的演出裙，裙摆绣着几乎褪色的暗红蔷薇纹样，像一场被没收了结尾的旧演出。",
    dialogues: [
      { speaker: "米拉奶奶", text: "旧剧场关闭前，最后一位女高音留下了它。她说总有一天，会有人替她把这首歌唱完。" },
      { speaker: "缇雅", text: "我穿这个会不会很奇怪？" },
      { speaker: "【内心】", text: "不会。你几乎说出口。可喉咙先一步疼起来。" }
    ],
    choices: [
      { text: "我给你伴奏。", effects: [{ type: "change", key: "缇雅好感", value: 5 }, { type: "event", value: "ch0_promised_accompaniment" }], nextScene: "ch0_012_clocktower" },
      { text: "安柠会说我们疯了。", effects: [{ type: "change", key: "安柠好感", value: 1 }], nextScene: "ch0_012_clocktower" },
      { text: "等这一切结束。", effects: [{ type: "event", value: "ch0_after_this_is_over" }], nextScene: "ch0_012_clocktower" }
    ]
  },
  "ch0_012_clocktower": {
    background: "#171c21",
    backgroundImage: ASSETS.backgrounds.ch0ClocktowerMechanism,
    description: "钟楼机关被人为调慢。每一次钟声慢半拍，静默场就更深一层。白栖挡在机关前，而另一个低沉的身影从钟声残响里显现。",
    dialogues: [
      { speaker: "白栖", text: "未授权人员不得接触钟楼。" },
      { speaker: "安柠", text: "整个镇子都没声音了，你还在背条例？" },
      { speaker: "弥洛", text: "这不是钟声。这是命令。" },
      { speaker: "系统", text: "【临时律者：弥洛 · 低鸣骑士 进入剧情】【暂未建立完整契约】" }
    ],
    choices: [
      { text: "记录被调慢的半拍。", effects: [{ type: "event", value: "ch0_clock_halfbeat_command" }, { type: "change", key: "世界观信息", value: 2 }], nextScene: "ch0_013_forbidden_performance" },
      { text: "要求白栖撤离镇民。", effects: [{ type: "change", key: "镇民信任", value: 2 }, { type: "event", value: "ch0_baiqi_evacuation_order" }], nextScene: "ch0_013_forbidden_performance" }
    ]
  },
  "ch0_013_forbidden_performance": {
    background: "#1b1010",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    description: "旧剧场舞台上，诺伊倒在旧钢琴旁，手里还抓着乐谱。卡戎暗中放大静默场，镇民的声音被进一步抽走。缇雅坐到钢琴前，决定完成无声旋律的最后一拍。",
    dialogues: [
      { speaker: "缇雅", text: "如果不让它响，大家的声音会永远消失。" },
      { speaker: "安柠", text: "你们别告诉我又要弹琴。" },
      { speaker: "【内心】", text: "不是为了引怪。是为了把他们的声音叫回来。" },
      { speaker: "系统", text: "第一拍没有声音。第二拍仍然没有声音。第三拍落下，整个镇子的静默场开始裂开。" }
    ],
    choices: [
      { text: "守住第四拍。", effects: [{ type: "event", value: "ch0_fourth_beat_guarded" }], nextScene: "ch0_014_atya_awakening" },
      { text: "先护住诺伊和镇民。", effects: [{ type: "change", key: "奏者健康", value: -2 }, { type: "event", value: "ch0_protected_noi_before_disaster" }], nextScene: "ch0_014_atya_awakening" }
    ]
  },
  "ch0_014_atya_awakening": {
    background: "#21120f",
    backgroundImage: ASSETS.backgrounds.ch0AtyaEyeCloseup,
    description: "噬响体的黑色音叉刺穿舞台。缇雅把你推开，白色吊坠碎裂。光粒掠过后台衣架，那条暗红蔷薇演出裙被气浪掀起一角，像提前替她应下了“等音乐回来以后”。",
    dialogues: [
      { speaker: "缇雅", text: "你听见了吗？" },
      { speaker: "【内心】", text: "缇雅……" },
      { speaker: "缇雅", text: "那就好。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "个体名废弃。律者名：阿缇娅 · 暮星序曲。检测到奏者候选。" }
    ],
    choices: [
      { text: "看见她的眼睛。", effects: [{ type: "event", value: "ch0_atya_eye_closeup" }], nextScene: "ch0_015_first_baton" }
    ]
  },
  "ch0_015_first_baton": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.ch0BatonContract,
    description: "人类瞳孔碎裂。金色音符瞳浮现。深紫与暗红眼影从眼尾扩散，眼下金色五线谱像泪痕一样亮起。阿缇娅手中凝聚出黑金指挥棒，柄端嵌入裂开的白色吊坠碎片。",
    systemPrompt: "关键修正：指挥棒“未鸣”由阿缇娅觉醒瞬间生成，主角此前没有指挥棒。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "transformed", text: "奏者。" },
      { speaker: "【内心】", text: "指挥棒穿过雨幕，像一根被命运掷出的黑金色针。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "接住。" }
    ],
    choices: [
      { text: "本能地接住黑金色指挥棒“未鸣”。", effects: [{ type: "change", key: "奏者健康", value: -3 }, { type: "event", value: "ch0_contract_baton_unplayed" }], nextScene: "ch0_016_moth_swarm_tutorial" },
      { text: "迟疑半拍，但仍然伸手。", effects: [{ type: "change", key: "奏者健康", value: -4 }, { type: "event", value: "ch0_contract_baton_hesitated" }], nextScene: "ch0_016_moth_swarm_tutorial" }
    ]
  },
  "ch0_016_moth_swarm_tutorial": {
    background: "#121012",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    description: "金色五线谱从指缝钻入皮肤，沿血管爬上右腕。默谱飞蛾群从剧场地下涌出，翅面像被雨泡坏的乐谱。你终于明白，命令她战斗，会从你身上扣下生命。",
    systemPrompt: "【指挥权限建立】【奏者契约成立】【律者：阿缇娅 · 暮星序曲 已接入】【警告：非正规契约】【技能释放将消耗指挥家健康值】",
    dialogues: [
      { speaker: "阿缇娅", sprite: "transformed", text: "命令我。" },
      { speaker: "系统", text: "教学战：默谱飞蛾 × 6。保护诺伊与失声镇民撤离，并观察律者技能对奏者健康的消耗。" },
      { speaker: "【内心】", text: "你想喊缇雅的名字。可站在你面前的人，只等待一个指挥家的第一拍。" }
    ],
    choices: [
      { text: "下达第一拍，保护诺伊与镇民。", effects: [{ type: "event", value: "ch0_first_command_attack" }], effect: () => startBattle("ch0_mute_score_moths", { selectedMusicarts: ["阿缇娅"] }) },
      { text: "先让阿缇娅护住撤离路线。", effects: [{ type: "change", key: "镇民信任", value: 2 }, { type: "event", value: "ch0_defensive_first_command" }], effect: () => startBattle("ch0_mute_score_moths", { selectedMusicarts: ["阿缇娅"] }) }
    ]
  },
  "ch0_017_stage_crawler": {
    background: "#180f13",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    description: "舞台爬行者从幕布后拖着节拍器核心爬出。弥洛站在钟声残响边缘，低鸣像一堵无形墙，暂时替你们挡住塌落的舞台。",
    dialogues: [
      { speaker: "弥洛", text: "两名律者上场，不代表第三个人没有承担结果。" },
      { speaker: "系统", text: "双律者教学战：阿缇娅 + 弥洛，对抗舞台爬行者。目标：击破节拍器核心。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "奏者健康正在下降。建议降低无意义命令。" }
    ],
    choices: [
      { text: "以阿缇娅突击核心，弥洛固定舞台。", effects: [{ type: "event", value: "ch0_stage_crawler_direct_plan" }], effect: () => startBattle("ch0_stage_crawler", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "优先保护镇民，慢慢拆掉木偶线。", effects: [{ type: "change", key: "镇民信任", value: 2 }, { type: "event", value: "ch0_stage_crawler_slow_plan" }], effect: () => startBattle("ch0_stage_crawler", { selectedMusicarts: ["阿缇娅", "弥洛"] }) }
    ]
  },
  "ch0_018_teabreak_not_tiya": {
    background: "#171410",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    description: "餐馆避难所里，阿缇娅盯着一杯热水超过十分钟。安柠让她喝，她说自己不需要补充水分。你看着她，看得太久，久到她先指出了这件事。",
    dialogues: [
      { speaker: "安柠", text: "喝。" },
      { speaker: "阿缇娅", sprite: "daily", text: "我不需要补充水分。" },
      { speaker: "安柠", text: "我知道。但你看着它超过十分钟了。" },
      { speaker: "阿缇娅", sprite: "daily", text: "你在寻找另一个人。我不是她。" }
    ],
    choices: [
      { text: "我知道。可我还需要时间。", effects: [{ type: "change", key: "阿缇娅信任", value: 5 }, { type: "event", value: "ch0_teabreak_time_needed" }], nextScene: "ch0_019_charron_revealed" },
      { text: "那你是谁？", effects: [{ type: "event", value: "暮星的空白" }, { type: "change", key: "阿缇娅共鸣", value: 2 }], nextScene: "ch0_019_charron_revealed" },
      { text: "至少现在，你在这里。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 4 }], nextScene: "ch0_019_charron_revealed" }
    ]
  },
  "ch0_019_charron_revealed": {
    background: "#120e11",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    description: "旧剧场后台传来指挥棒敲地声。一下。两下。第三下没有落下。你的心跳却被迫补上那一拍。",
    dialogues: [
      { speaker: "卡戎", text: "不完整的奏者。不完整的律者。不完整的演出。" },
      { speaker: "【内心】", text: "你是谁？" },
      { speaker: "卡戎", text: "曾经，我也以为名字重要。后来我发现，能让世界安静下来的人，才重要。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "敌性指挥信号确认。建议击破。" }
    ],
    choices: [
      { text: "你引来了噬响体？", effects: [{ type: "event", value: "人为诱导噬响" }, { type: "change", key: "世界观信息", value: 2 }], nextScene: "ch0_020_sound_stripping_boss" },
      { text: "你认识我母亲？", effects: [{ type: "event", value: "零号奏者计划" }, { type: "change", key: "世界观信息", value: 3 }], nextScene: "ch0_020_sound_stripping_boss" },
      { text: "阿缇娅，准备战斗。", effects: [{ type: "change", key: "阿缇娅信任", value: 2 }], nextScene: "ch0_020_sound_stripping_boss" }
    ]
  },
  "ch0_020_sound_stripping_boss": {
    background: "#160d0f",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    description: "剥音校尉立在主舞台中央，节拍器核心在胸腔内暴走。无声合唱的影子替它回盾，卡戎远程敲击指挥棒，强行提高同频过载概率。",
    dialogues: [
      { speaker: "系统", text: "Boss战：剥音校尉。阶段：静默军令、无声合唱、节拍器核心暴走、默令干涉。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "奏者健康低于安全线。仍要继续吗？" },
      { speaker: "【内心】", text: "她第一次没有立刻执行战斗逻辑。她回头看了你一眼。那不是缇雅，也不是兵器。" }
    ],
    choices: [
      { text: "发动“暮星未完成”，救回镇民声音。", effects: [{ type: "event", value: "ch0_boss_atya_concerto_plan" }], effect: () => startBattle("ch0_sound_stripping_officer", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "用弥洛低鸣压住核心，再由阿缇娅收尾。", effects: [{ type: "event", value: "ch0_boss_dual_musicart_plan" }], effect: () => startBattle("ch0_sound_stripping_officer", { selectedMusicarts: ["阿缇娅", "弥洛"] }) }
    ]
  },
  "ch0_021_epilogue": {
    background: "#192022",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    description: "雨后公路泛着淡金色反光。眠沙镇的人们重新找回声音，却没有立刻唱歌。旧钢琴仍在广场中央，只是封条被风掀起了一角。",
    dialogues: [
      { speaker: "诺伊", text: "以后……音乐还会回来吗？" },
      { speaker: "安柠", text: "下一站去哪？白谱院？追那个面具疯子？还是先找你母亲留下的下一段录音？" },
      { speaker: "阿缇娅", sprite: "daily", text: "路线选择权归奏者。代价由奏者承担。" },
      { speaker: "瑟萝弥", text: "忏悔吧。若你不知道错在哪里，我可以替你决定。" }
    ],
    choices: [
      { text: "会。只是不是今天。", effects: [{ type: "change", key: "诺伊希望", value: 5 }, { type: "event", value: "禁曲的第一声" }, { type: "event", value: "chapter0_complete_isolated" }, { type: "set", key: "chapterProgress", value: 1 }], nextScene: "chapter0_start" },
      { text: "我不知道，但我会去找答案。", effects: [{ type: "change", key: "安柠好感", value: 3 }, { type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "event", value: "chapter0_complete_isolated" }, { type: "set", key: "chapterProgress", value: 1 }], nextScene: "chapter0_start" },
      { text: "只要还有人记得，它就没有消失。", effects: [{ type: "event", value: "静默不等于死亡" }, { type: "event", value: "chapter0_complete_isolated" }, { type: "set", key: "chapterProgress", value: 1 }], nextScene: "chapter0_start" },
      { text: "先保存第零章记录。", effect: () => saveGame() }
    ]
  },
  "test_scene": {
    background: "#1a1a2e",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "测试场景仍保留，用于 Console 验证 showScene()、showChoices() 与变量读写。",
    dialogues: [
      { speaker: "玛伦", text: "奏者候补，保持记录。今晚只允许安全钟声，不允许任何旋律。" }
    ],
    choices: [
      {
        text: "「那不是异常。那像求救。」",
        effects: [
          { type: "change", key: "槐序共鸣", value: 3 },
          { type: "event", value: "heard_possible_cry_for_help" }
        ],
        nextScene: "next_scene"
      },
      {
        text: "「我应该先确认它会不会伤人。」",
        effects: [{ type: "event", value: "chose_safety_first" }],
        nextScene: "next_scene"
      },
      {
        text: "「两边都在等我犯错。」",
        effects: [
          { type: "set", key: "白谱院声望", value: "敌对" },
          { type: "event", value: "angered_white_score_academy" }
        ],
        nextScene: "next_scene"
      }
    ]
  },
  "next_scene": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "窄渠尽头，纸灯一盏接一盏熄灭。只有你听见水面下方传来偏差节拍，像一支被掐断的圆舞曲。",
    dialogues: [
      { speaker: "槐序", sprite: "guarded", text: "如果那是求救，就不会只响一次。奏者，你还听得见吗？" }
    ],
    choices: [
      {
        text: "保存当前记录",
        effect: () => {
          saveGame();
          showDialogue("系统", "记录已写入本地存档。你可以在 Console 中查看 GameState，或刷新页面测试 loadGame()。");
          showChoices([]);
        }
      },
      { text: "返回第一章", nextScene: "chapter1_start" }
    ]
  },
  "chapter1_start": {
    isMapNode: true,
    background: "#17120f",
    backgroundImage: ASSETS.backgrounds.ch1MujianRoad,
    description: "雨后公路还没完全干。第零章Boss战掉落的【默令残页】被安柠重新摊开，残页边缘那半枚白色吊坠图案，与缇雅遗物上的花纹严丝合缝地重叠在一起。你们决定沿着卡戎留下的路线，前往雾茧站。",
    systemPrompt: "第一章 · 黑巡半响已开启。路线B：追查卡戎。新增机制：双律者合奏。",
    dialogues: [
      { speaker: "安柠", text: "我又看了一遍。这张纸角上的花纹，跟你手上那半吊坠的花纹，一模一样。" },
      { speaker: "阿缇娅", sprite: "daily", text: "这不是巧合能解释的东西，对吧。" },
      { speaker: "弥洛", text: "禁曲派做事讲究标准化。如果这花纹是他们内部通用钢印，那意味着缇雅的吊坠不是遗物，是一份合格证明。" }
    ],
    choices: [
      { text: "我们去雾茧站。", effects: [{ type: "change", key: "安柠好感", value: 2 }, { type: "event", value: "ch1_route_b_pursue_charon" }], nextScene: "ch1_black_000" },
      { text: "先冷静下来，查清楚这张纸到底是什么。", effects: [{ type: "change", key: "世界观信息", value: 2 }, { type: "event", value: "禁曲派内部编号体系" }], nextScene: "ch1_black_000" },
      { text: "沉默地把两枚图案的花纹描下来。", effects: [{ type: "event", value: "花纹拓本" }, { type: "change", key: "阿缇娅共鸣", value: 1 }], nextScene: "ch1_black_000" },
      { text: "打开世界地图", effect: () => openWorldMap() },
      { text: "查看第三章旧案合辑", nextScene: "chapter3_archive_start" },
      { text: "保存进度", effect: () => saveGame() }
    ]
  },
  "ch1_black_000": {
    background: "#1a2224",
    backgroundImage: ASSETS.backgrounds.ch1MujianRoad,
    description: "车队在通往雾茧站的公路上行驶，浓雾像一块被水泡开的白布，慢慢铺满挡风玻璃。阿缇娅一直望着窗外，像在学习普通人该如何坐在一辆车里。",
    systemPrompt: "黑巡半响 01｜公路对话：阿缇娅的日常。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "我不需要吃东西，对吧。可我还是很想坐在你们吃饭的桌子旁边。这样算不算……装样子？" }
    ],
    choices: [
      { text: "这叫陪伴，不叫装样子。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 3 }], nextScene: "ch1_black_001" },
      { text: "你想坐就坐，不用找理由。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "event", value: "关于日常的自我摸索" }], nextScene: "ch1_black_001" },
      { text: "你想吃吗？我可以喂你试试。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 1 }, { type: "event", value: "ch1_atya_table_joke" }], nextScene: "ch1_black_001" }
    ]
  },
  "ch1_black_001": {
    isMapNode: true,
    background: "#162022",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    description: "车灯刺不穿雾。八条线路的换乘枢纽如今安静得像坟场，锈蚀的信号灯忽明忽暗，候车室玻璃上贴着几十年前的巡演海报。",
    systemPrompt: "解锁地图：雾茧站。解锁支线：雾中巡逻 / 追踪车辙 / 候车室旧海报。",
    dialogues: [
      { speaker: "安柠", text: "八条线路的换乘枢纽，现在……安静得像坟场。" },
      { speaker: "弥洛", text: "这张海报上的乐团……我好像见过指挥这场演出的人。" }
    ],
    choices: [
      { text: "先找情报掮客钟先生。", nextScene: "ch1_black_002" },
      { text: "记录候车室旧海报。", effects: [{ type: "event", value: "巡演本该是这世上最不害人的事" }, { type: "change", key: "世界观信息", value: 1 }], nextScene: "ch1_black_002" },
      { text: "让弥洛记下海报上的旧乐团标记。", effects: [{ type: "change", key: "弥洛共鸣", value: 2 }], nextScene: "ch1_black_002" }
    ]
  },
  "ch1_black_002": {
    background: "#211c16",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    defaultSpeaker: "钟先生",
    description: "钟先生叼着没点燃的烟斗，怀表链换成了半截断弦。他整理着泛黄路线图，目光却早已把你们的车、护腕和残页全部扫过一遍。",
    systemPrompt: "情报交易：禁曲派巡演车辆时刻。",
    dialogues: [
      { speaker: "钟先生", text: "新面孔。而且带着车。现在还有车能开进雾茧站的，要么是货运，要么是……不方便被记录行踪的人。" },
      { speaker: "安柠", text: "我们要查这枚钢印。开价。" }
    ],
    choices: [
      { text: "进入情报交易心理博弈，试探钟先生底价。", nextScene: "ch1_minigame_intel_trade" },
      { text: "用粮药换情报。", effects: [{ type: "change", key: "粮药", value: -1 }, { type: "event", value: "禁曲派巡演车辆时刻" }], nextScene: "ch1_black_003" },
      { text: "交出剥音节拍器残件，换完整情报。", effects: [{ type: "event", value: "零四编号的真实来历传闻" }, { type: "event", value: "禁曲派巡演车辆时刻" }, { type: "change", key: "世界观信息", value: 2 }], nextScene: "ch1_black_003" },
      { text: "坦白说明来意，请求帮助。", effects: [{ type: "change", key: "安柠好感", value: -1 }, { type: "change", key: "钟先生好感", value: 3 }, { type: "event", value: "钟先生免费情报" }], nextScene: "ch1_black_003" }
    ]
  },
  "ch1_minigame_intel_trade": {
    background: "#211c16",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    defaultSpeaker: "钟先生",
    description: "钟先生没有立刻报出价格，而是把三枚旧筹码推到桌面中央。每一枚筹码都代表一种谈判姿态：强硬、示弱、坦诚。安柠站在你身后，手指已经按在维修刀柄上。",
    systemPrompt: "小游戏：情报交易心理博弈。回应方式会影响报价与隐藏情报。",
    dialogues: [
      { speaker: "钟先生", text: "情报从来不贵，贵的是买家不知道自己真正想买什么。" },
      { speaker: "安柠", text: "别被他带节奏。他在看我们愿意为那半枚吊坠付出多少。" }
    ],
    choices: [
      { text: "强硬压价：我们也有你想要的静默署残件。", effects: [{ type: "event", value: "ch1_intel_trade_hardline" }, { type: "change", key: "粮药", value: -1 }, { type: "event", value: "禁曲派巡演车辆时刻" }], nextScene: "ch1_black_003" },
      { text: "示弱换同情：告诉他尤娜可能成为下一个编号。", effects: [{ type: "event", value: "钟先生免费情报" }, { type: "change", key: "钟先生好感", value: 2 }, { type: "change", key: "尤娜信任", value: 1 }], nextScene: "ch1_black_003" },
      { text: "坦诚交易：只买能救人的部分，不买他的秘密。", effects: [{ type: "event", value: "ch1_intel_trade_fair_deal" }, { type: "event", value: "禁曲派巡演车辆时刻" }, { type: "change", key: "安柠好感", value: 2 }, { type: "change", key: "世界观信息", value: 1 }], nextScene: "ch1_black_003" }
    ]
  },
  "ch1_black_003": {
    background: "#271f18",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    defaultSpeaker: "尤娜",
    description: "站台旅馆门口，一个扎着红线手绳的女孩正踮脚擦着早已没有列车经过的到站牌。她脖子上那枚磨损的白色吊坠，让阿缇娅的目光停住了很久。",
    systemPrompt: "新角色登场：尤娜、柯婆婆。",
    dialogues: [
      { speaker: "尤娜", text: "欢迎光临——虽然我们已经很久没有“新客人”这个说法了。真的是新客人！柯婆婆，有客人！" },
      { speaker: "柯婆婆", text: "雾茧站不常有生面孔。你们是……巡演的人？" },
      { speaker: "尤娜", text: "这个吊坠啊……柯婆婆说，我被捡到的时候就戴着它。我也不知道是谁给我的。" }
    ],
    choices: [
      { text: "我们只是路过，想打听点消息。", nextScene: "ch1_black_004" },
      { text: "我们在找一样东西，可能和这里有关。", effects: [{ type: "change", key: "柯婆婆警惕", value: 1 }, { type: "change", key: "尤娜好奇", value: 3 }], nextScene: "ch1_black_004" },
      { text: "看向尤娜的吊坠，如实说明来意。", effects: [{ type: "change", key: "柯婆婆警惕", value: 2 }, { type: "event", value: "尤娜吊坠提前告知" }], nextScene: "ch1_black_004" }
    ]
  },
  "ch1_black_004": {
    isMapNode: true,
    background: "#151d20",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    description: "正式行动前，弥洛提议先摸清站台周边敌情。雾中偶尔传来车轮声，却没有任何列车出现在时刻表上。",
    systemPrompt: "雾茧站探索节点：可处理支线，或直接推进三天后的七号站台。",
    dialogues: [
      { speaker: "弥洛", text: "如果钟先生的消息准确，禁曲派的人已经在附近踩点了。我们最好先知道他们具体有几个。" }
    ],
    choices: [
      { text: "雾中巡逻，清理回声巡查员。", effects: [{ type: "event", value: "禁曲派巡逻日志残页" }], effect: () => startBattle("ch1_fog_patrol", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "处理一件雾茧站支线事件。", effect: () => drawChapter1MapEvent() },
      { text: "追踪车辙，提前判断零四抵达时间。", nextScene: "ch1_minigame_track_ruts" },
      { text: "破译默令残页背面的密码。", nextScene: "ch1_minigame_cipher" },
      { text: "先守在七号站台。", nextScene: "ch1_black_005" }
    ]
  },
  "ch1_minigame_track_ruts": {
    background: "#172022",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    description: "老潘把耳朵贴近铁轨，听了很久。他说禁曲派巡演车的车轮声有一个缺口，像每第四拍都会漏掉半寸铁。",
    systemPrompt: "小游戏：追踪车辙。根据车轮声特征排除错误岔道。",
    dialogues: [
      { speaker: "老潘", text: "别看轨道有八条。真正常走车的，只有三条。能藏住不报站列车的，只有一条。" },
      { speaker: "弥洛", text: "第四拍漏掉的那条，才是它走过的地方。" }
    ],
    choices: [
      { text: "选择第四拍有缺口的换轨线。", effects: [{ type: "event", value: "ch1_track_ruts_success" }, { type: "event", value: "提前获知零四抵达时间" }, { type: "change", key: "弥洛信任", value: 2 }], nextScene: "ch1_black_005" },
      { text: "选择铁锈最新的主轨。", effects: [{ type: "change", key: "世界失谐度", value: 1 }, { type: "event", value: "ch1_track_ruts_wrong" }], nextScene: "ch1_black_005" },
      { text: "让安柠用维修经验复核一次。", effects: [{ type: "change", key: "安柠好感", value: 2 }, { type: "event", value: "ch1_anning_track_reading" }], nextScene: "ch1_black_005" }
    ]
  },
  "ch1_minigame_cipher": {
    background: "#1f1914",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    description: "默令残页背面有一段禁曲派内部简易密文。五线谱位置对应字母表，像有人故意把调度命令写成一段不会响起的旋律。",
    systemPrompt: "小游戏：破译残页密码。音符位置对应字符集。",
    dialogues: [
      { speaker: "安柠", text: "别被乐谱外观骗了。它不是曲子，是调度命令。" },
      { speaker: "阿缇娅", sprite: "daily", text: "我能读取一部分节拍结构。它在重复同一个词：回收。" }
    ],
    choices: [
      { text: "按 Do-Re-Mi 顺序解码。", effects: [{ type: "event", value: "禁曲派内部通讯规则" }, { type: "change", key: "世界观信息", value: 2 }], nextScene: "ch1_black_005" },
      { text: "先复制密文，保留原件。", effects: [{ type: "event", value: "默令残页复制件" }, { type: "change", key: "安柠好感", value: 1 }], nextScene: "ch1_black_005" },
      { text: "强行用指挥棒读取残响。", effects: [{ type: "change", key: "奏者健康", value: -3 }, { type: "event", value: "零号奏者计划_噪声片段" }], nextScene: "ch1_black_005" }
    ]
  },
  "ch1_black_005": {
    background: "#11171b",
    backgroundImage: ASSETS.backgrounds.ch1Sequence04Confrontation,
    description: "三天后，七号站台。雾比往常更浓，一声不属于任何已知列车的车轮声由远及近。苍白身影从雾中走出，动作精准得不像人类——静默序列-零四。",
    systemPrompt: "中期Boss登场：静默序列-零四。自然律者与强制律者化的第一次正面对照。",
    dialogues: [
      { speaker: "柯婆婆", text: "回旅馆去！现在！" },
      { speaker: "弥洛", text: "零四……原来编号已经到零四了。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "她的动作……和我变身的时候，好像。可她的眼睛里，什么都没有。" }
    ],
    choices: [
      { text: "立刻拔棒应战，护住尤娜。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 3 }], effect: () => startBattle("ch1_silent_sequence_04", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "先尝试与零四对话。", effects: [{ type: "event", value: "ch1_talk_to_04_failed" }], effect: () => startBattle("ch1_silent_sequence_04", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "让柯婆婆带尤娜撤离，自己拖延时间。", effects: [{ type: "event", value: "柯婆婆撤离事件" }], effect: () => startBattle("ch1_silent_sequence_04", { selectedMusicarts: ["阿缇娅", "弥洛"] }) }
    ]
  },
  "ch1_black_006": {
    background: "#171b1d",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    description: "零四没有被击杀，只是在受创后如断线木偶般被黑雾拖离站台。现场只剩雨雾、铁轨划痕，以及一地不属于任何战斗的手写乐谱碎片。",
    systemPrompt: "战斗后：零四的断裂乐谱与弥洛身世钩子。",
    dialogues: [
      { speaker: "安柠", text: "这是完整的手写乐谱，不是印刷品。能留下这种东西的年代，最少也是三十年前。" },
      { speaker: "弥洛", text: "三十年前，我还没离开那个地方。也就是说……零四比我想的，资历更老。" },
      { speaker: "阿缇娅", sprite: "daily", text: "你在担心，如果我们没能拦住她，尤娜也会变成这样，对吗？" }
    ],
    choices: [
      { text: "我不会让这种事发生。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 3 }], nextScene: "ch1_black_007" },
      { text: "我不知道能不能拦住。但我们会尽力。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "event", value: "ch1_self_doubt_truth" }], nextScene: "ch1_black_007" },
      { text: "沉默地点头。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 1 }, { type: "event", value: "阿缇娅主动安慰" }], nextScene: "ch1_black_007" },
      { text: "复盘合奏节拍器，练习暮弦双鸣。", nextScene: "ch1_minigame_ensemble" }
    ]
  },
  "ch1_minigame_ensemble": {
    background: "#151d20",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    description: "站台边缘，阿缇娅的指挥棒轨迹与弥洛的长枪轨迹被你重新画在雾里。你尝试在0.5秒的判定窗口里，把两条不属于同一调性的旋律压进同一拍。",
    systemPrompt: "小游戏：合奏节拍器。完美判定会强化后续隐藏路线。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "我可以配合弥洛。但需要你先告诉我，什么时候该让出第一拍。" },
      { speaker: "弥洛", text: "别太用力。合奏不是把两个人拧成一个人。" }
    ],
    choices: [
      { text: "在金色光点重合瞬间落拍。", effects: [{ type: "event", value: "暮弦双鸣" }, { type: "event", value: "合奏节拍器完美判定" }, { type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "change", key: "弥洛共鸣", value: 2 }], nextScene: "ch1_black_007" },
      { text: "先让阿缇娅主拍，弥洛待拍。", effects: [{ type: "change", key: "阿缇娅信任", value: 2 }], nextScene: "ch1_black_007" },
      { text: "先让弥洛主拍，阿缇娅护线。", effects: [{ type: "change", key: "弥洛信任", value: 2 }], nextScene: "ch1_black_007" }
    ]
  },
  "ch1_black_007": {
    background: "#241c17",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    defaultSpeaker: "尤娜",
    description: "夜晚的站台旅馆里，尤娜端着两杯掺了太多糖的热饮坐到你对面，笑得有点勉强。",
    systemPrompt: "茶歇剧情：尤娜的秘密。",
    dialogues: [
      { speaker: "尤娜", text: "柯婆婆都跟我说了。那个白色的、动作很奇怪的姐姐，是来找我的？" },
      { speaker: "尤娜", text: "其实我知道自己活不长的。医生说我的心脏和肺，撑不过二十岁。我一直以为，“活不长”就是全部的坏消息了。" }
    ],
    choices: [
      { text: "如实告诉她关于静默序列的真相。", effects: [{ type: "change", key: "尤娜恐惧", value: 5 }, { type: "change", key: "尤娜信任", value: 8 }], nextScene: "ch1_black_008" },
      { text: "只告诉她有人想利用你，隐去细节。", effects: [{ type: "change", key: "尤娜恐惧", value: 2 }, { type: "change", key: "尤娜信任", value: 3 }], nextScene: "ch1_black_008" },
      { text: "如果能活下去，哪怕变成别的样子，你愿意吗？", effects: [{ type: "event", value: "尤娜活下去反问" }], nextScene: "ch1_black_008" }
    ]
  },
  "ch1_black_008": {
    background: "#15171d",
    backgroundImage: ASSETS.backgrounds.ch1SeluomiStandoff,
    description: "零四消失后的第三个夜晚，一段管风琴般的低频共振穿透雾墙。瑟萝弥站在站台尽头，十字长枪像拐杖一样插在铁轨旁。",
    systemPrompt: "反派对峙：瑟萝弥验收尤娜。",
    dialogues: [
      { speaker: "瑟萝弥", text: "你们在害怕她变成没有名字的东西。可你们有没有想过，她本来就要死了？我们只是——不浪费这场死亡。" },
      { speaker: "【内心】", text: "你听见自己回答得很快，快到不像思考。她有名字。她叫尤娜。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "给一个只会认编号、不会认自己的活法，也叫活下去？" }
    ],
    choices: [
      { text: "无论代价是什么，都不该由你们替她决定。", effects: [{ type: "change", key: "瑟萝弥隐藏值", value: -2 }], nextScene: "ch1_black_009" },
      { text: "如果有别的办法呢？我们可以一起找。", effects: [{ type: "change", key: "瑟萝弥隐藏值", value: 3 }, { type: "event", value: "ch1_seluomi_nonbattle_seed" }], nextScene: "ch1_black_009" },
      { text: "不说话，直接拔出指挥棒。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "event", value: "ch1_seluomi_direct_attack" }], nextScene: "ch1_black_012" }
    ]
  },
  "ch1_black_009": {
    background: "#10171c",
    backgroundImage: ASSETS.backgrounds.ch1SeluomiStandoff,
    description: "安柠快速评估局势，弥洛提醒你：瑟萝弥不是零四那种执行体，而是真正意义上的指挥官。你们必须决定正面迎战，还是先掩护尤娜撤离。",
    systemPrompt: "战术抉择：决定瑟萝弥Boss战形态。",
    dialogues: [
      { speaker: "安柠", text: "她一个人，我们四个——按理说不该怂。可那杆枪插进碎石里的力道，我看得很清楚。" },
      { speaker: "弥洛", text: "如果正面打不过，至少要保证尤娜能撤离。" }
    ],
    choices: [
      { text: "正面迎战，速战速决。", effects: [{ type: "event", value: "ch1_seluomi_standard_battle" }], nextScene: "ch1_black_012" },
      { text: "先掩护尤娜和柯婆婆撤离，再战。", effects: [{ type: "event", value: "ch1_yuna_escort_battle" }], nextScene: "ch1_minigame_escort_yuna" },
      { text: "利用雾茧站地形拖延，等待老潘他们支援。", effects: [{ type: "event", value: "老潘助战" }], nextScene: "ch1_black_012" }
    ]
  },
  "ch1_minigame_escort_yuna": {
    background: "#10171c",
    backgroundImage: ASSETS.backgrounds.ch1SeluomiStandoff,
    description: "浓雾把七号站台切成几段看不见彼此的暗线。柯婆婆牵着尤娜，必须穿过回声巡查员的视野死角；你的每一次落拍，都会在雾中点亮一条短暂安全路径。",
    systemPrompt: "小游戏：护送尤娜QTE。失败不会中断主线，但会降低高潮战表现。",
    dialogues: [
      { speaker: "柯婆婆", text: "别回头，小尤娜。看见了也帮不上忙，活人先往前走。" },
      { speaker: "尤娜", text: "可是……如果我现在不看，以后是不是就再也看不见自己了？" },
      { speaker: "安柠", text: "左侧信号灯闪三下时跑。别快，也别慢，跟我的手势。" }
    ],
    choices: [
      { text: "精准落拍，标出安全路径。", effects: [{ type: "event", value: "ch1_escort_qte_success" }, { type: "event", value: "尤娜撤离成功" }, { type: "change", key: "尤娜信任", value: 4 }], nextScene: "ch1_black_012" },
      { text: "让阿缇娅挡住巡查员视线。", effects: [{ type: "event", value: "阿缇娅护送尤娜" }, { type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "change", key: "奏者健康", value: -3 }], nextScene: "ch1_black_012" },
      { text: "路线判断慢了半拍。", effects: [{ type: "event", value: "ch1_escort_qte_failed" }, { type: "change", key: "尤娜恐惧", value: 6 }], nextScene: "ch1_black_012" }
    ]
  },
  "ch1_black_012": {
    background: "#15171d",
    backgroundImage: ASSETS.backgrounds.ch1SeluomiStandoff,
    description: "七号站台的雾墙彻底合拢。瑟萝弥展开圣咏领域，十字长枪的枪尖在碎石上拖出一道白线。尤娜的吊坠开始发冷，像编号系统正在等待最后确认。",
    systemPrompt: "ch1_012 高潮：尤娜的抉择。Boss战：瑟萝弥。结局判定参考尤娜信任、瑟萝弥隐藏值、合奏表现与护送结果。",
    dialogues: [
      { speaker: "瑟萝弥", text: "既然你们这么想替她担这份责任，那就让我看看，你们担得起多少。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "奏者，叫她的名字。不要让编号先响起来。" },
      { speaker: "弥洛", text: "P2阶段她会用十字裁定突进。抓住半拍破绽，合奏槽满了就别犹豫。" }
    ],
    choices: [
      { text: "进入瑟萝弥标准Boss战。", effects: [{ type: "event", value: "ch1_final_battle_started" }], effect: () => startBattle("ch1_seluomi_trial", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "以守护尤娜为第一目标开战。", effects: [{ type: "event", value: "尤娜仍被叫作尤娜" }], effect: () => startBattle("ch1_seluomi_trial", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "最后复诵一次：她叫尤娜。", effects: [{ type: "change", key: "尤娜信任", value: 3 }, { type: "event", value: "尤娜仍被叫作尤娜" }], effect: () => startBattle("ch1_seluomi_trial", { selectedMusicarts: ["阿缇娅", "弥洛"] }) }
    ]
  },
  "ch1_black_010_a": {
    background: "#1b2020",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    description: "瑟萝弥被击退到雾墙边缘，忽然停手。尤娜安然无恙，扑进柯婆婆怀里大哭一场。你们赢得了时间，仅此而已，但这一次，名字没有被编号覆盖。",
    systemPrompt: "结局甲：暂缓收编。获得称号【暂缓的判决】。",
    dialogues: [
      { speaker: "瑟萝弥", text: "够了。卡戎大人要的是合格的收编，不是带着仇恨的残次品。你们赢得了时间，仅此而已。" },
      { speaker: "尤娜", text: "柯婆婆……我还在，对吧？我还是尤娜，对吧？" },
      { speaker: "阿缇娅", sprite: "daily", text: "她还记得自己的名字。奏者，这就是胜利条件。" }
    ],
    choices: [
      { text: "收下这份暂缓的时间。", effects: [{ type: "event", value: "结局甲_暂缓收编" }], nextScene: "ch1_black_013" },
      { text: "与尤娜约定：以后仍会叫她的名字。", effects: [{ type: "event", value: "尤娜名字约定" }, { type: "change", key: "尤娜信任", value: 5 }], nextScene: "ch1_side_yuna_name" }
    ]
  },
  "ch1_black_010_b": {
    background: "#1b2020",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    description: "瑟萝弥撤退，但尤娜在战斗中因心肺负荷过重当场晕厥。安柠用维修车里的应急药箱稳住了她，却换来一个更具体的期限。",
    systemPrompt: "结局乙：带伤守住。获得称号【用时间换来的时间】。",
    dialogues: [
      { speaker: "柯婆婆", text: "这孩子的心脏经不起这个！你们说守住了，可她还剩多少时间？" },
      { speaker: "安柠", text: "生命体征稳住了。但医生的说法变具体了——最多，还有一年。" },
      { speaker: "阿缇娅", sprite: "daily", text: "用时间换来的时间，也是时间。我们不能浪费它。" }
    ],
    choices: [
      { text: "把一年也当成必须守住的未来。", effects: [{ type: "event", value: "结局乙_带伤守住" }, { type: "change", key: "阿缇娅共鸣", value: 5 }], nextScene: "ch1_black_013" }
    ]
  },
  "ch1_black_010_c": {
    background: "#11171b",
    backgroundImage: ASSETS.backgrounds.ch1SeluomiStandoff,
    defaultSpeaker: "尤娜",
    description: "瑟萝弥的动作快过了所有人的预判。冷白色光从尤娜胸口吊坠裂缝涌出，尖叫只持续了半秒，就被更深的寂静取代。",
    systemPrompt: "结局丙：未能及时。尤娜被强制转化为静默序列-零七。",
    dialogues: [
      { speaker: "尤娜", sprite: "sequence07", text: "……" },
      { speaker: "阿缇娅", sprite: "transformed", text: "我们……来晚了。" },
      { speaker: "瑟萝弥", text: "看，我说过了。她现在，不会再因为心脏死掉了。" },
      { speaker: "柯婆婆", text: "尤娜……尤娜……" }
    ],
    choices: [
      { text: "记住她的名字，不承认编号。", effects: [{ type: "event", value: "结局丙_未能及时" }, { type: "event", value: "被系统吞掉的名字" }, { type: "event", value: "寻找并唤回零七" }], nextScene: "ch1_black_013" }
    ]
  },
  "ch1_black_010": {
    background: "#1b2020",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    description: "翌日清晨，浓雾第一次出现短暂稀薄。柯婆婆把一枚吊坠碎片塞进你手里，像把一个名字托付给你。",
    systemPrompt: "第一章尾声：残响与决意。",
    dialogues: [
      { speaker: "柯婆婆", text: "如果有一天，能让她——不管她变成什么样子——记起来自己叫尤娜，就算我这条老命没白活。" },
      { speaker: "安柠", text: "本章获得关键道具：零四的断裂节拍器、禁曲派巡逻日志残页、尤娜的吊坠碎片。" },
      { speaker: "阿缇娅", sprite: "daily", text: "我以前以为，活下去和活得像自己是同一件事。现在我知道，这是两件需要分开去争取的事。" }
    ],
    choices: [
      { text: "离开雾茧站。", effects: [{ type: "event", value: "尤娜的吊坠碎片" }], nextScene: "ch1_black_014" },
      { text: "茶歇：阿缇娅·暮色餐桌", conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 40, label: "阿缇娅共鸣" }], nextScene: "ch1_side_atya_dinner" },
      { text: "茶歇：弥洛·未寄出的乐谱", nextScene: "ch1_side_milo_score" },
      { text: "茶歇：安柠·情报与信任", conditions: [{ operator: "includes", value: "钟先生免费情报" }], nextScene: "ch1_side_anning_intel" },
      { text: "茶歇：尤娜·名字约定", conditions: [{ operator: "includes", value: "暂缓的判决" }], nextScene: "ch1_side_yuna_name" },
      { text: "保存第一章记录。", effect: () => saveGame() }
    ]
  },
  "ch1_side_atya_dinner": {
    background: "#2a2118",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    description: "雾稍散的傍晚，阿缇娅第一次主动提议去吃点东西。她不需要进食，却认真计算着缇雅活着时在这种光线里吃过多少顿饭。",
    systemPrompt: "茶歇个人线：阿缇娅 · 暮色餐桌。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "我算了一下，缇雅活着的时候，一共在这种傍晚的光线里吃过一千三百多顿饭。这个数字没什么意义，但我就是想告诉你。" }
    ],
    choices: [
      { text: "以后我陪你继续数下去。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 5 }, { type: "event", value: "暮色餐桌" }], nextScene: "ch1_black_013" },
      { text: "为什么突然想说这个？", effects: [{ type: "change", key: "阿缇娅共鸣", value: 3 }, { type: "event", value: "记忆到底是不是自己的" }], nextScene: "ch1_black_013" }
    ]
  },
  "ch1_side_milo_score": {
    background: "#171b1d",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    description: "深夜，弥洛独自在候车室临摹零四掉落的乐谱碎片。雾贴着窗玻璃，像一层听不见的伴奏。",
    systemPrompt: "茶歇个人线：弥洛 · 未寄出的乐谱。",
    dialogues: [
      { speaker: "弥洛", text: "抱歉，吵到你了？我只是想把这段旋律补完整。零四如果还能听见，至少……不该只记得破碎的部分。" }
    ],
    choices: [
      { text: "帮他整理碎片顺序。", effects: [{ type: "change", key: "弥洛共鸣", value: 4 }, { type: "event", value: "弥洛未寄出的乐谱" }], nextScene: "ch1_black_013" },
      { text: "问他三十年前那个地方。", effects: [{ type: "change", key: "弥洛信任", value: 3 }, { type: "event", value: "弥洛身世第一块拼图" }], nextScene: "ch1_black_013" }
    ]
  },
  "ch1_side_anning_intel": {
    background: "#241d16",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    description: "安柠整理钟先生给的免费情报，态度明显比刚到雾茧站时柔和。她把每一条线索按风险等级重新编号。",
    systemPrompt: "茶歇个人线：安柠 · 情报与信任。",
    dialogues: [
      { speaker: "安柠", text: "我承认，我一开始很怀疑钟先生这种人。但今天算是明白了——有些人嘴上说只效忠生意，心里其实还留着一块不肯卖的地方。" }
    ],
    choices: [
      { text: "你也有不肯卖的地方。", effects: [{ type: "change", key: "安柠好感", value: 4 }, { type: "event", value: "安柠情报与信任" }], nextScene: "ch1_black_013" },
      { text: "所以我们更需要你判断风险。", effects: [{ type: "change", key: "安柠好感", value: 2 }, { type: "event", value: "安柠风险判断强化" }], nextScene: "ch1_black_013" }
    ]
  },
  "ch1_side_yuna_name": {
    background: "#2a2118",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    defaultSpeaker: "尤娜",
    description: "离开雾茧站前，尤娜追出来送行。她攥着吊坠，像攥着一个还没被系统夺走的名字。",
    systemPrompt: "茶歇个人线：尤娜 · 名字约定。",
    dialogues: [
      { speaker: "尤娜", text: "如果……如果哪天我也变成那种没有表情的样子，你们会像今天这样，还叫我尤娜吗？" }
    ],
    choices: [
      { text: "会。名字不是靠身体记住的。", effects: [{ type: "event", value: "尤娜后日谈文本" }, { type: "change", key: "尤娜信任", value: 4 }], nextScene: "ch1_black_013" },
      { text: "蹲下来，一字一句重复：你叫尤娜。", effects: [{ type: "event", value: "尤娜名字约定" }, { type: "change", key: "尤娜信任", value: 6 }], nextScene: "ch1_black_013" }
    ]
  },
  "ch1_black_011": {
    background: "#d7d0bd",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    description: "车队准备离开雾茧站时，站台广播忽然自行启动。卡戎的声音清晰得可怕：你们手上那半枚吊坠的另一半，我这里恰好也有一片。",
    systemPrompt: "章末钩子：卡戎知道主角母亲；进入路线分歧节点。",
    dialogues: [
      { speaker: "卡戎", text: "零四没能完成任务，我不意外。至于你们……如果想拼出完整图案，以及图案背后关于零号奏者计划和你母亲的一切——" },
      { speaker: "安柠", text: "卡戎这是在钓我们。可他钓的鱼饵，偏偏是我们不可能放下的东西。" },
      { speaker: "阿缇娅", sprite: "daily", text: "不管选哪条路，我都陪你走到底。这次，换我先说这句话。" }
    ],
    choices: [
      { text: "继续深入禁曲派内部。", effects: [{ type: "event", value: "route_b1_dark_tour_deeper" }, { type: "set", key: "chapterProgress", value: 2 }], nextScene: "chapter1_start" },
      { text: "转向零号奏者计划。", effects: [{ type: "event", value: "route_b2_zero_conductor_plan" }, { type: "set", key: "chapterProgress", value: 2 }], nextScene: "chapter2_start" },
      { text: "尝试寻找零四的下落。", conditions: [{ operator: "includes", value: "暮弦双鸣" }], effects: [{ type: "event", value: "route_b3_find_sequence_04" }, { type: "set", key: "chapterProgress", value: 2 }], nextScene: "chapter1_start" }
    ]
  },
  "ch1_black_013": {
    background: "#1b2020",
    backgroundImage: ASSETS.backgrounds.ch1StationInnWarm,
    description: "翌日清晨，浓雾第一次出现短暂稀薄。柯婆婆把一枚吊坠碎片塞进你手里，像把一个名字托付给你。安柠把零四的断裂节拍器、巡逻日志残页和吊坠碎片逐一封存。",
    systemPrompt: "ch1_013 尾声：残响与决意。根据结局甲/乙/丙汇合，整理本章关键道具与情感余波。",
    dialogues: [
      { speaker: "柯婆婆", text: "我不懂你们说的那些编号、收编。我只知道，你们是这么多年，第一批愿意为了一个杂务丫头拼命的外人。" },
      { speaker: "安柠", text: "本章获得关键道具：零四的断裂节拍器、禁曲派巡逻日志残页、花纹拓本，以及尤娜的吊坠碎片或原物。" },
      { speaker: "阿缇娅", sprite: "daily", text: "我以前以为，活下去和活得像自己是同一件事。现在我知道，对有些人来说，这是两件需要分开去争取的事。" }
    ],
    choices: [
      { text: "收下尤娜的吊坠碎片 / 原物。", effects: [{ type: "event", value: "尤娜的吊坠碎片" }], nextScene: "ch1_black_014" },
      { text: "茶歇：阿缇娅·暮色餐桌", conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 40, label: "阿缇娅共鸣" }], nextScene: "ch1_side_atya_dinner" },
      { text: "茶歇：弥洛·未寄出的乐谱", nextScene: "ch1_side_milo_score" },
      { text: "茶歇：安柠·情报与信任", conditions: [{ operator: "includes", value: "钟先生免费情报" }], nextScene: "ch1_side_anning_intel" },
      { text: "茶歇：尤娜·名字约定", conditions: [{ operator: "includes", value: "暂缓的判决" }], nextScene: "ch1_side_yuna_name" },
      { text: "保存第一章记录。", effect: () => saveGame() }
    ]
  },
  "ch1_black_014": {
    background: "#d7d0bd",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    description: "车队准备离开雾茧站时，站台广播忽然自行启动。卡戎的声音清晰得可怕：你们手上那半枚吊坠的另一半，我这里恰好也有一片。",
    systemPrompt: "ch1_014 章末：卡戎的声音与下一步伏笔。解锁世界观碎片【卡戎知道你的母亲】。",
    dialogues: [
      { speaker: "卡戎", text: "零四没能完成任务，我不意外。零七完成了收编，这在我的预料之中。至于你们……" },
      { speaker: "卡戎", text: "如果想拼出完整图案，以及图案背后关于零号奏者计划和你母亲的一切——来找我。" },
      { speaker: "安柠", text: "卡戎这是在钓我们。可他钓的鱼饵，偏偏是我们不可能放下的东西。" },
      { speaker: "阿缇娅", sprite: "daily", text: "不管选哪条路，我都陪你走到底。这次，换我先说这句话。" }
    ],
    choices: [
      { text: "继续深入禁曲派内部。", effects: [{ type: "event", value: "route_b1_dark_tour_deeper" }, { type: "event", value: "卡戎知道你的母亲" }, { type: "set", key: "chapterProgress", value: 2 }], nextScene: "chapter1_start" },
      { text: "转向零号奏者计划。", effects: [{ type: "event", value: "route_b2_zero_conductor_plan" }, { type: "event", value: "卡戎知道你的母亲" }, { type: "set", key: "chapterProgress", value: 2 }], nextScene: "chapter2_start" },
      { text: "尝试寻找零四的下落。", conditions: [{ operator: "includes", value: "暮弦双鸣" }], effects: [{ type: "event", value: "route_b3_find_sequence_04" }, { type: "event", value: "卡戎知道你的母亲" }, { type: "set", key: "chapterProgress", value: 2 }], nextScene: "chapter1_start" }
    ]
  },
  "chapter2_start": {
    isMapNode: true,
    chapter: 2,
    background: "#dbeaf2",
    backgroundImage: ASSETS.backgrounds.ch2SnowfieldApproach,
    description: "卡戎留下的另一半吊坠线索，把车队带向雪岭无人区。黑金雨幕和雾茧站都被甩在身后，眼前只剩冰蓝霜白的山脊，以及远处像冻结音叉一样竖立的冻谱观测塔。",
    systemPrompt: "第二章 · 雪谱冻响｜路线B-2：转向零号奏者计划。新增机制：体感温度、谱鸣共振、宁溯好感。",
    dialogues: [
      { speaker: "安柠", text: "如果卡戎说的是真的……你母亲的答案，可能就在这条路的尽头。" },
      { speaker: "阿缇娅", sprite: "daily", text: "检测到环境温度持续下降。奏者，你的呼吸频率在变慢。" },
      { speaker: "弥洛", text: "雪会吃掉脚步声。但这里不是安静，是所有声音都被冻结了。" }
    ],
    choices: [
      { text: "整理防寒装备，进入雪线。", effects: [{ type: "set", key: "体感温度", value: 86 }, { type: "set", key: "谱鸣共振", value: 0 }, { type: "event", value: "ch2_snow_route_started" }], nextScene: "ch2_snow_000" },
      { text: "先打开世界地图确认冻谱观测塔坐标。", effect: () => openWorldMap() },
      { text: "保存第二章入口记录。", effect: () => saveGame() }
    ]
  },
  "ch2_snow_000": {
    chapter: 2,
    background: "#dbeaf2",
    backgroundImage: ASSETS.backgrounds.ch2SnowfieldApproach,
    description: "雪线上的方向比道路更清楚。安柠把修理车改成雪地履带，阿缇娅把自己并不需要的外套披到你肩上，动作自然得像某段残响替她记住了温柔。",
    systemPrompt: "ch2_000 楔子：雪线上的方向。强调阿缇娅让出外套与主角身世线被点燃。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "缇雅以前总说，看到别人冷，自己心里也会跟着发紧。我现在没有体温了，但那种感觉好像还留着。" },
      { speaker: "安柠", text: "体感温度会变成实际风险。别逞强，雪地里逞强死得最快。" }
    ],
    choices: [
      { text: "谢谢你，阿缇娅。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 3 }, { type: "change", key: "体感温度", value: 4 }], nextScene: "ch2_snow_001" },
      { text: "你这是在模仿缇雅，还是你自己想这么做？", effects: [{ type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "event", value: "阿缇娅人格延续性追问" }], nextScene: "ch2_snow_001" },
      { text: "反过来把外套披回她身上。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 4 }, { type: "event", value: "阿缇娅雪境稀有互动" }], nextScene: "ch2_snow_001" }
    ]
  },
  "ch2_snow_001": {
    chapter: 2,
    background: "#d7e9f2",
    backgroundImage: ASSETS.backgrounds.ch2SnowfieldApproach,
    description: "两日跋涉让车轮声变得迟钝。雪地反光把所有表情照得很清楚，主角越接近观测塔，越无法把母亲这个词压回旧伤口里。",
    systemPrompt: "ch2_001 跋涉：雪岭两日。体感温度自然下降，弥洛身世伏笔可触发。",
    dialogues: [
      { speaker: "弥洛", text: "我以前在能看清那些编号律者脸的地方待过一阵子。这里的气味……很像。" },
      { speaker: "【内心】", text: "你忽然想起母亲被带走前的四拍手势。那不是告别，是让你先活下去。" }
    ],
    choices: [
      { text: "问弥洛：你是不是早就知道这类设施？", effects: [{ type: "event", value: "ch2_milo_early_facility_hint" }, { type: "change", key: "弥洛信任", value: 3 }, { type: "change", key: "体感温度", value: -8 }], nextScene: "ch2_snow_002" },
      { text: "保存体力，减少谈话。", effects: [{ type: "change", key: "体感温度", value: -4 }, { type: "change", key: "奏者健康", value: 2 }], nextScene: "ch2_snow_002" }
    ]
  },
  "ch2_snow_002": {
    isMapNode: true,
    chapter: 2,
    background: "#dbeef7",
    backgroundImage: ASSETS.backgrounds.ch2ObservatoryExterior,
    description: "冻谱观测塔终于出现在雪幕尽头。塔身由白色晶体与旧式天文穹顶拼合而成，数十根冻结音叉状天线停在半空，像一座把最后一声实验记录冻住的圣殿。",
    systemPrompt: "ch2_002 抵达：冻谱观测塔。新地域视觉正式建立。",
    dialogues: [
      { speaker: "安柠", text: "这不是普通封锁设施。外墙待机灯还亮着，说明里面至少有一部分系统活着。" },
      { speaker: "阿缇娅", sprite: "daily", text: "检测到谱核残留。不是噬响体，是被保存得太久的声音。" }
    ],
    choices: [
      { text: "靠近主门，读取封锁铭牌。", nextScene: "ch2_snow_003" },
      { text: "绕塔一周，先画出外围地图。", effects: [{ type: "change", key: "世界观信息", value: 1 }, { type: "change", key: "体感温度", value: -6 }], nextScene: "ch2_snow_003" }
    ]
  },
  "ch2_snow_003": {
    chapter: 2,
    background: "#cfe7f4",
    backgroundImage: ASSETS.backgrounds.ch2CrystalCorridor,
    description: "进入塔内后，漂浮的白色晶体球体从天花轨道滑下。它内部的齿轮仍在转动，机械声像二十三年前忘记停止的简报。",
    systemPrompt: "ch2_003 看塔仪与铭牌。触发弥洛早知道的沉默。",
    dialogues: [
      { speaker: "看塔仪", text: "零号奏者计划阶段性简报：本周期无异常。简报生成时间：距今二十三年前。" },
      { speaker: "安柠", text: "零号奏者计划……这几个字不是卡戎编出来钓我们的。" },
      { speaker: "弥洛", text: "我早该想到，这两件事是同一件事的两个入口。" }
    ],
    choices: [
      { text: "追问弥洛在什么地方见过同款铭牌。", effects: [{ type: "event", value: "弥洛早期失败实验幸存者伏笔" }, { type: "change", key: "弥洛共鸣", value: 4 }], nextScene: "ch2_snow_004" },
      { text: "先让安柠接入看塔仪端口。", effects: [{ type: "change", key: "安柠好感", value: 2 }, { type: "event", value: "安柠识别观测塔接口" }], nextScene: "ch2_snow_004" }
    ]
  },
  "ch2_snow_004": {
    chapter: 2,
    background: "#cbe4ef",
    backgroundImage: ASSETS.backgrounds.ch2CrystalCorridor,
    description: "回廊深处，一具冰封残奏从墙内剥离。它不像野兽，更像一个没能完成觉醒的人，被冻结在害怕与希望之间。",
    systemPrompt: "ch2_004 遭遇：冰封残奏。小怪生态首次出现。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "transformed", text: "它的眼睛还没有完全熄灭。奏者，不要把它当成普通敌人。" },
      { speaker: "弥洛", text: "低频告诉我，它不是来进攻。它是在找能结束自己的那一拍。" }
    ],
    choices: [
      { text: "以最小伤害驱散冰封残奏。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "event", value: "ch2_frozen_residual_released" }], nextScene: "ch2_snow_005" },
      { text: "记录它眼中的残留金光。", effects: [{ type: "change", key: "世界观信息", value: 2 }, { type: "change", key: "谱鸣共振", value: 8 }], nextScene: "ch2_snow_005" }
    ]
  },
  "ch2_snow_005": {
    isMapNode: true,
    chapter: 2,
    background: "#d5edf7",
    backgroundImage: ASSETS.backgrounds.ch2CrystalCorridor,
    description: "观测塔内部的悬浮冰锥谱架开始随脚步轻响。每一次大声说话，谱鸣共振都会上升，像整座塔在判断你们是否有资格继续往里走。",
    systemPrompt: "ch2_005 谱鸣共振：地图探索预告。开放E201-E205支线与小游戏。",
    dialogues: [
      { speaker: "安柠", text: "从现在起，别乱碰，别大声，别把每个发光的东西都当按钮。" },
      { speaker: "看塔仪", text: "警告：谱鸣共振阈值接近巡检标准。请研究员降低移动音量。" }
    ],
    choices: [
      { text: "处理一件冻谱观测塔支线事件。", effect: () => drawChapter2MapEvent() },
      { text: "进入谱鸣静音挑战。", nextScene: "ch2_minigame_silent_step" },
      { text: "调查冻结档案室。", nextScene: "ch2_minigame_archive_puzzle" },
      { text: "继续前往守卫兽活动区域。", nextScene: "ch2_snow_006" }
    ]
  },
  "ch2_minigame_silent_step": {
    chapter: 2,
    background: "#c9e7f4",
    backgroundImage: ASSETS.backgrounds.ch2CrystalCorridor,
    description: "谱鸣静音挑战：屏幕下方滚动的脚步节拍点被想象成一排冰蓝光标。你必须只踩安全拍，否则整条回廊会像玻璃风铃一样同时响起。",
    systemPrompt: "小游戏：谱鸣静音挑战。成功可降低谱鸣共振，失败会提前触发额外守卫兽压力。",
    dialogues: [
      { speaker: "弥洛", text: "听我的低音。不要追着光走，追着停顿走。" }
    ],
    choices: [
      { text: "精准踩中安全节拍点。", effects: [{ type: "event", value: "E201_success" }, { type: "change", key: "谱鸣共振", value: -12 }, { type: "change", key: "弥洛信任", value: 2 }], nextScene: "ch2_snow_006" },
      { text: "错踩半拍，引发回廊短鸣。", effects: [{ type: "event", value: "E201_failed_extra_guardian" }, { type: "change", key: "谱鸣共振", value: 14 }, { type: "change", key: "奏者健康", value: -3 }], nextScene: "ch2_snow_006" }
    ]
  },
  "ch2_minigame_archive_puzzle": {
    chapter: 2,
    background: "#d6edf6",
    backgroundImage: ASSETS.backgrounds.ch2ArchiveRoom,
    description: "冻结档案室里，文件残页被冰层封在不同时间刻度上。你需要按课题时间线重新排列它们，才能看清零号奏者计划从善意课题到被窃取异化的过程。",
    systemPrompt: "小游戏：冻结档案室拼图。关联E202与安柠记忆碎片。",
    dialogues: [
      { speaker: "安柠", text: "这个电路封装方式……我好像在哪见过。不是图纸，是手法。" }
    ],
    choices: [
      { text: "按立项、窃取、封存顺序拼回残页。", effects: [{ type: "event", value: "E202_archive_timeline_complete" }, { type: "event", value: "安柠父亲名单线索" }, { type: "change", key: "世界观信息", value: 3 }], nextScene: "ch2_snow_006" },
      { text: "只复制可读文件，避免破坏冰封现场。", effects: [{ type: "event", value: "E202_archive_copied" }, { type: "change", key: "安柠好感", value: 2 }], nextScene: "ch2_snow_006" }
    ]
  },
  "ch2_snow_006": {
    chapter: 2,
    background: "#cce5ef",
    backgroundImage: ASSETS.backgrounds.ch2CrystalCorridor,
    description: "谱塔守卫兽从冰锥之间抬起头。它的骨架像旧式谱架，四肢每次落地都会让附近的冰晶发出不完整和弦。",
    systemPrompt: "ch2_006 遭遇：谱塔守卫兽。受谱鸣共振影响。",
    dialogues: [
      { speaker: "安柠", text: "共振越高，它醒得越快。现在跑不掉了。" },
      { speaker: "阿缇娅", sprite: "transformed", text: "奏者，下令。" }
    ],
    choices: [
      { text: "阿缇娅切断冰晶和弦，弥洛固定回廊。", effects: [{ type: "change", key: "奏者健康", value: -5 }, { type: "event", value: "ch2_tower_guardian_defeated" }], nextScene: "ch2_snow_007" },
      { text: "利用谱鸣共振反向诱导它撞向冰柱。", effects: [{ type: "change", key: "谱鸣共振", value: 8 }, { type: "event", value: "ch2_resonance_used_as_trap" }], nextScene: "ch2_snow_007" }
    ]
  },
  "ch2_snow_007": {
    chapter: 2,
    background: "#c8e6f2",
    backgroundImage: ASSETS.backgrounds.ch2BossChamber,
    description: "核心舱前，沉睡机器忽然亮起。几十根冰晶谱架向中央收束，一个巨大的晶体构装体漂浮而起，未完工的原型律者外壳嵌在它胸腔正中。",
    systemPrompt: "ch2_007 核心舱前：谱心监守者拦路。进入本章强制Boss。",
    dialogues: [
      { speaker: "看塔仪", text: "未授权访问者接近核心舱。谱心监守者，启动。" },
      { speaker: "弥洛", text: "不是宁溯。是塔本身不允许我们进去。" }
    ],
    choices: [
      { text: "进入Boss战：谱心监守者。", effects: [{ type: "event", value: "ch2_scoreheart_boss_started" }], effect: () => startBattle("ch2_scoreheart_guardian", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "先强行提高共振，试图让它暴露核心。", effects: [{ type: "change", key: "谱鸣共振", value: 12 }, { type: "event", value: "ch2_forced_resonance_before_boss" }], effect: () => startBattle("ch2_scoreheart_guardian", { selectedMusicarts: ["阿缇娅", "弥洛"] }) }
    ]
  },
  "ch2_snow_008": {
    chapter: 2,
    background: "#d7edf6",
    backgroundImage: ASSETS.backgrounds.ch2BossChamber,
    description: "谱心监守者的晶体外壳碎成悬浮的蓝白薄片，核心里的未完工律者外壳失去光芒。就在核心舱门即将开启时，一个冷静的女声从门后响起。",
    systemPrompt: "ch2_008 Boss战后：宁溯登场前奏。",
    dialogues: [
      { speaker: "宁溯", text: "未经许可，任何人不得接近核心舱。" },
      { speaker: "安柠", text: "她不是广播。里面真的有人。" }
    ],
    choices: [
      { text: "放下武器，说明来意。", effects: [{ type: "change", key: "宁溯好感", value: 8 }], nextScene: "ch2_snow_009" },
      { text: "保持战斗阵型，但不主动攻击。", effects: [{ type: "change", key: "宁溯好感", value: 2 }, { type: "change", key: "阿缇娅压力", value: 2 }], nextScene: "ch2_snow_009" }
    ]
  },
  "ch2_snow_009": {
    chapter: 2,
    background: "#d9eef7",
    backgroundImage: ASSETS.backgrounds.ch2CoreChamber,
    defaultSpeaker: "宁溯",
    description: "核心舱门前，宁溯站在冷蓝色封印光中。她左耳的白谱院徽章耳饰像一枚没有落下的雪片，语速平稳到近乎残酷。",
    systemPrompt: "ch2_009 核心舱门前：宁溯拦截。三条信息线索影响ch2_010判定。",
    dialogues: [
      { speaker: "宁溯", text: "这不是针对你们的规定。这是我对六年前那件事，唯一能做的补偿。" },
      { speaker: "宁溯", text: "你眼睛的形状，和她真的很像。但这不是让我放行的理由。" }
    ],
    choices: [
      { text: "出示吊坠碎片与母亲留下的旧调音记录。", effects: [{ type: "event", value: "ch2_ningsu_clue_a" }, { type: "change", key: "宁溯好感", value: 14 }], nextScene: "ch2_snow_010" },
      { text: "让安柠展示档案室拼出的时间线。", effects: [{ type: "event", value: "ch2_ningsu_clue_b" }, { type: "change", key: "宁溯好感", value: 10 }, { type: "change", key: "安柠好感", value: 2 }], nextScene: "ch2_snow_010" },
      { text: "我不是来抢技术的，我只是想知道我母亲是谁。", effects: [{ type: "event", value: "ch2_ningsu_clue_c" }, { type: "change", key: "宁溯好感", value: 16 }], nextScene: "ch2_snow_010" },
      { text: "不再解释，强行突破封锁。", effects: [{ type: "event", value: "ch2_ningsu_forced_attack" }, { type: "change", key: "宁溯好感", value: -30 }], effect: () => startBattle("ch2_ningsu_guardian", { selectedMusicarts: ["阿缇娅", "弥洛"] }) }
    ]
  },
  "ch2_snow_010": {
    chapter: 2,
    background: "#dbeff8",
    backgroundImage: ASSETS.backgrounds.ch2CoreChamber,
    defaultSpeaker: "宁溯",
    description: "宁溯缓缓靠在冰冷的舱门上，像是终于卸下了六年来一直绷紧的姿态。她不是保护这栋塔，而是在保护世界不要再多出第二个卡戎。",
    systemPrompt: "ch2_010 对峙：宁溯的过去。根据态度与强攻记录进入三结局判定。",
    dialogues: [
      { speaker: "宁溯", text: "我曾经看见卡戎拿走了一部分成果。我举报过，可那时候我太年轻，声音太小。" },
      { speaker: "宁溯", text: "零号奏者计划不是恶。恶的是人类总会有人把好的技术用坏。" }
    ],
    choices: [
      { text: "我们会公开真相，但不会把技术交给卡戎。", effects: [{ type: "change", key: "宁溯好感", value: 18 }, { type: "event", value: "ch2_ningsu_truth_with_guardrail" }], effect: () => resolveCh2NingsuStandoff() },
      { text: "你守了六年，已经足够了。现在让我们一起承担。", effects: [{ type: "change", key: "宁溯好感", value: 24 }, { type: "event", value: "ch2_ningsu_shared_burden" }], effect: () => resolveCh2NingsuStandoff() },
      { text: "如果你继续挡路，你也在替卡戎封住真相。", effects: [{ type: "change", key: "宁溯好感", value: -8 }, { type: "event", value: "ch2_ningsu_hard_truth" }], effect: () => resolveCh2NingsuStandoff() }
    ]
  },
  "ch2_snow_010_a": {
    chapter: 2,
    background: "#e0f2fa",
    backgroundImage: ASSETS.backgrounds.ch2CoreChamber,
    description: "结局一：信任移交。宁溯主动开启核心舱，全程陪同讲解。她把权限钥匙递出时，指尖第一次没有发抖。",
    systemPrompt: "宁溯对峙结局一：信任移交。综合分高且未强攻。",
    dialogues: [
      { speaker: "宁溯", text: "我会打开门。但不是因为规定允许，而是因为她等的人，终于到了。" }
    ],
    choices: [
      { text: "进入核心舱。", effects: [{ type: "event", value: "ch2_ningsu_best_route" }, { type: "event", value: "宁溯同行" }], nextScene: "ch2_snow_011" }
    ]
  },
  "ch2_snow_010_b": {
    chapter: 2,
    background: "#d7edf6",
    backgroundImage: ASSETS.backgrounds.ch2CoreChamber,
    description: "结局二：有限移交。宁溯开启核心舱，却要求你们承诺资料不得外传。她仍在害怕，但不再独自挡门。",
    systemPrompt: "宁溯对峙结局二：有限移交。",
    dialogues: [
      { speaker: "宁溯", text: "我允许你们听完她留下的东西。但我需要一个约定：别让它变成下一份默令。" }
    ],
    choices: [
      { text: "接受约定，进入核心舱。", effects: [{ type: "event", value: "ch2_ningsu_limited_transfer" }, { type: "event", value: "宁溯有限同行" }], nextScene: "ch2_snow_011" }
    ]
  },
  "ch2_snow_010_c": {
    chapter: 2,
    background: "#c8dfea",
    backgroundImage: ASSETS.backgrounds.ch2CoreChamber,
    description: "结局三：被迫突破。宁溯被你们击退，封锁系统被强制打开。门开了，但你清楚，有些信任会在门轴里碎掉。",
    systemPrompt: "宁溯对峙结局三：强攻或综合分过低。",
    dialogues: [
      { speaker: "宁溯", text: "我不是在保护这栋楼。我是在保护，不再有第二个卡戎。" },
      { speaker: "阿缇娅", sprite: "daily", text: "奏者，门开了。但她的声音没有跟我们一起进来。" }
    ],
    choices: [
      { text: "进入核心舱。", effects: [{ type: "event", value: "ch2_ningsu_forced_route" }], nextScene: "ch2_snow_011" }
    ]
  },
  "ch2_snow_011": {
    chapter: 2,
    background: "#e2f3fa",
    backgroundImage: ASSETS.backgrounds.ch2CoreChamber,
    description: "核心舱内部比外面更安静。中央的残响记录仪覆着薄冰，待机灯却仍按四拍明灭，像有人把一段不敢寄出的留言保存到了今天。",
    systemPrompt: "ch2_011 突破核心舱。进入残响记录仪校准。",
    dialogues: [
      { speaker: "安柠", text: "先别急着播放。杂音太厚，我需要校准人声频段。" },
      { speaker: "【内心】", text: "你站在记录仪前，忽然不确定自己更想听见答案，还是更害怕答案真的响起来。" }
    ],
    choices: [
      { text: "进行残响记录仪校准。", nextScene: "ch2_minigame_echo_calibration" },
      { text: "直接播放未校准录音。", effects: [{ type: "event", value: "ch2_mother_echo_uncalibrated" }, { type: "change", key: "奏者健康", value: -2 }], nextScene: "ch2_snow_012" }
    ]
  },
  "ch2_minigame_echo_calibration": {
    chapter: 2,
    background: "#e2f3fa",
    backgroundImage: ASSETS.backgrounds.ch2CoreChamber,
    description: "残响记录仪校准：旋钮像一枚被冰封的音量钮。你需要把杂音中的人声频段对齐，让母亲的声音从蓝白噪声中慢慢浮出。",
    systemPrompt: "小游戏：残响记录仪校准。影响演出清晰度，不改变核心剧情文本。",
    dialogues: [
      { speaker: "安柠", text: "别急。她留给你的不是谜题，是一段终于等到收件人的录音。" }
    ],
    choices: [
      { text: "精准校准，保留完整音色。", effects: [{ type: "event", value: "ch2_echo_calibration_clear" }, { type: "change", key: "安柠好感", value: 3 }], nextScene: "ch2_snow_012" },
      { text: "勉强对齐，先听内容。", effects: [{ type: "event", value: "ch2_echo_calibration_noisy" }], nextScene: "ch2_snow_012" }
    ]
  },
  "ch2_snow_012": {
    chapter: 2,
    background: "#e5f4fb",
    backgroundImage: ASSETS.backgrounds.ch2MotherEcho,
    defaultSpeaker: "母亲的残响",
    description: "蓝白色光影从记录仪里升起，慢慢拼成一个与你眼形相似的人。她不是复活，不会真正回答你；她只是一段被保存得太久、终于开始播放的光。",
    systemPrompt: "ch2_012 母亲的残响。克制呈现：不是AI人格，不是真正复活。",
    dialogues: [
      { speaker: "母亲的残响", text: "如果你能站在这里，说明我没能亲口告诉你这些事。我很抱歉。" },
      { speaker: "母亲的残响", text: "零号奏者计划，最初只是想让活下去这件事，不再需要用另一条命去换。" },
      { speaker: "母亲的残响", text: "如果卡戎已经把它变成了你们现在面对的样子——那么，替我，把它抢回来。" }
    ],
    choices: [
      { text: "问她：你为什么留下我？", effects: [{ type: "event", value: "ch2_asked_mother_why_left" }, { type: "change", key: "奏者健康", value: -2 }], nextScene: "ch2_snow_013" },
      { text: "问她：卡戎到底拿走了什么？", effects: [{ type: "event", value: "卡戎窃取零号奏者计划成果" }, { type: "change", key: "世界观信息", value: 3 }], nextScene: "ch2_snow_013" },
      { text: "只是听完，不打断录音。", effects: [{ type: "event", value: "完整听完母亲残响" }, { type: "change", key: "阿缇娅共鸣", value: 3 }], nextScene: "ch2_snow_013" }
    ]
  },
  "ch2_snow_013": {
    chapter: 2,
    background: "#d9edf6",
    backgroundImage: ASSETS.backgrounds.ch2ArchiveRoom,
    description: "录音结束后，安柠在人员名单边缘发现一个熟悉的姓氏。她的手指停在机械维护组二级技师那一栏，像忽然被某段自己不记得的过去拽住。",
    systemPrompt: "ch2_013 安柠的记忆碎片。触发父亲名单钩子。",
    dialogues: [
      { speaker: "安柠", text: "我爸爸从来没跟我提过零号奏者计划。但他确实常年在外地修一些特殊的机器。" },
      { speaker: "宁溯", text: "机械维护组……那批人帮我们守住过最后一次撤离。" }
    ],
    choices: [
      { text: "问安柠还记得哪些细节。", effects: [{ type: "event", value: "安柠父亲零号计划关联" }, { type: "change", key: "安柠好感", value: 4 }], nextScene: "ch2_snow_014" },
      { text: "先把名单封存，等她愿意再说。", effects: [{ type: "event", value: "安柠名单暂存" }, { type: "change", key: "安柠好感", value: 3 }], nextScene: "ch2_snow_014" }
    ]
  },
  "ch2_snow_014": {
    chapter: 2,
    background: "#dbeaf2",
    backgroundImage: ASSETS.backgrounds.ch2Farewell,
    description: "队伍准备离开冻谱观测塔。雪还在下，但那些悬浮在半空、从未落地的雪片，第一次跟着你们下山的脚步轻轻震落了几片。",
    systemPrompt: "ch2_014 尾声：塔外的告别。宁溯可加入或远程支援。",
    dialogues: [
      { speaker: "宁溯", text: "六年没和活人正常吃过一顿饭了。你们不用照顾我的情绪，我只是需要一点时间重新学会怎么和人相处。" },
      { speaker: "阿缇娅", sprite: "daily", text: "母亲的声音不是可以拥抱的人。但它确实让你往前走了一步。" }
    ],
    choices: [
      { text: "邀请宁溯加入队伍。", effects: [{ type: "event", value: "宁溯加入队伍" }, { type: "change", key: "宁溯好感", value: 10 }], nextScene: "ch2_snow_015" },
      { text: "请宁溯留守观测塔，建立长期通讯。", effects: [{ type: "event", value: "宁溯远程支援" }, { type: "change", key: "宁溯好感", value: 6 }], nextScene: "ch2_snow_015" },
      { text: "茶歇：阿缇娅 · 无名律者的谱线残片", conditions: [{ operator: "includes", value: "无名律者的谱线残片" }], nextScene: "ch2_side_atya_nameless" },
      { text: "茶歇：弥洛 · 铭牌背后的地方", conditions: [{ operator: "includes", value: "ch2_milo_early_facility_hint" }], nextScene: "ch2_side_milo_origin" },
      { text: "茶歇：安柠 · 父亲的名字", conditions: [{ operator: "includes", value: "安柠父亲零号计划关联" }], nextScene: "ch2_side_anning_father" },
      { text: "茶歇：宁溯 · 第一次营地夜谈", conditions: [{ operator: "includes", value: "宁溯加入队伍" }], nextScene: "ch2_side_ningsu_camp" },
      { text: "训练：合奏节拍器 · 极寒变奏", conditions: [{ key: "体感温度", operator: "<=", value: 30 }], nextScene: "ch2_minigame_frost_ensemble" }
    ]
  },
  "ch2_minigame_frost_ensemble": {
    chapter: 2,
    background: "#dbeaf2",
    backgroundImage: ASSETS.backgrounds.ch2Farewell,
    description: "塔外雪地里，指尖被冻得几乎失去触感。阿缇娅的暮星拍与弥洛的低频线必须在更窄的判定窗口里重合，迟一瞬或早一瞬，未鸣都会把冷意传回右腕。",
    systemPrompt: "小游戏：合奏节拍器极寒变奏。体感温度低于30时开放，完美判定奖励更高，但失败会消耗奏者健康。",
    dialogues: [
      { speaker: "弥洛", text: "冷会让手慢半拍。别和它抢速度，先让呼吸落回低音。" },
      { speaker: "阿缇娅", sprite: "daily", text: "我会等你的拍。只等一次，但一定等。" }
    ],
    choices: [
      { text: "在冰蓝光点收束瞬间落拍。", effects: [{ type: "event", value: "ch2_frost_ensemble_perfect" }, { type: "event", value: "合奏节拍器极寒完美判定" }, { type: "change", key: "阿缇娅共鸣", value: 3 }, { type: "change", key: "弥洛共鸣", value: 3 }, { type: "change", key: "体感温度", value: 8 }], nextScene: "ch2_snow_014" },
      { text: "放宽节拍窗口，稳住右腕。", effects: [{ type: "event", value: "ch2_frost_ensemble_safe" }, { type: "change", key: "奏者健康", value: 1 }, { type: "change", key: "体感温度", value: 4 }], nextScene: "ch2_snow_014" },
      { text: "强行追拍，抢出一次过载合奏。", effects: [{ type: "event", value: "ch2_frost_ensemble_overload" }, { type: "change", key: "奏者健康", value: -5 }, { type: "change", key: "阿缇娅压力", value: 2 }, { type: "change", key: "弥洛压力", value: 2 }], nextScene: "ch2_snow_014" }
    ]
  },
  "ch2_side_atya_nameless": {
    chapter: 2,
    background: "#d2e8f2",
    backgroundImage: ASSETS.backgrounds.ch2SnowfieldApproach,
    description: "营地夜晚，阿缇娅长久凝视着无名律者的谱线残片。冰蓝火光映在她的眼影上，像暮星被雪覆盖了一半。",
    systemPrompt: "茶歇：阿缇娅个人故事线 · 无名律者的谱线残片。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "如果我当初没有被你叫住名字，是不是也会变成这样，连一张能被辨认的脸都留不下？" }
    ],
    choices: [
      { text: "不会。因为我一定会叫住你。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 6 }, { type: "event", value: "阿缇娅雪境稀有台词" }], nextScene: "ch2_snow_014" },
      { text: "沉默地握住她的手。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 5 }, { type: "event", value: "阿缇娅无声过场" }], nextScene: "ch2_snow_014" }
    ]
  },
  "ch2_side_milo_origin": {
    chapter: 2,
    background: "#d2e8f2",
    backgroundImage: ASSETS.backgrounds.ch2SnowfieldApproach,
    description: "篝火旁，弥洛终于完整讲述自己的过去片段。他的声音很低，低到像是在替那些没能活下来的编号留出位置。",
    systemPrompt: "茶歇：弥洛个人故事线 · 身世第二块拼图。",
    dialogues: [
      { speaker: "弥洛", text: "我曾经，是被关在一个和这里性质相似、但更早期的设施里长大的。" },
      { speaker: "弥洛", text: "我是极少数活下来、并且保留了完整意识的个体之一。所以我没能做到不去数编号。" }
    ],
    choices: [
      { text: "告诉他：你不是编号。", effects: [{ type: "change", key: "弥洛共鸣", value: 6 }, { type: "event", value: "弥洛早期失败实验幸存者确认" }], nextScene: "ch2_snow_014" },
      { text: "先不追问，替他添柴。", effects: [{ type: "change", key: "弥洛信任", value: 4 }], nextScene: "ch2_snow_014" }
    ]
  },
  "ch2_side_anning_father": {
    chapter: 2,
    background: "#d8edf6",
    backgroundImage: ASSETS.backgrounds.ch2ArchiveRoom,
    description: "返程途中，安柠翻看那份泛黄名单。她终于承认，父亲口中的商业机密，也许只是另一种不能说出口的保密。",
    systemPrompt: "茶歇：安柠个人故事线 · 父亲的名字。",
    dialogues: [
      { speaker: "安柠", text: "现在看来，那大概不是商业机密，是需要保密的另一种原因。" }
    ],
    choices: [
      { text: "我们会把这条线一起查下去。", effects: [{ type: "change", key: "安柠好感", value: 5 }, { type: "event", value: "安柠身世支线开启" }], nextScene: "ch2_snow_014" },
      { text: "你不用马上处理它。", effects: [{ type: "change", key: "安柠好感", value: 3 }], nextScene: "ch2_snow_014" }
    ]
  },
  "ch2_side_ningsu_camp": {
    chapter: 2,
    background: "#d2e8f2",
    backgroundImage: ASSETS.backgrounds.ch2SnowfieldApproach,
    description: "宁溯正式加入后的第一次营地夜谈，她坐得很端正，像连吃饭都还在遵守封存设施的轮值表。",
    systemPrompt: "茶歇：宁溯专属互动。仅加入队伍后可访问。",
    dialogues: [
      { speaker: "宁溯", text: "六年没和活人正常吃过一顿饭了。你们不用照顾我的情绪，我只是……需要一点时间。" }
    ],
    choices: [
      { text: "欢迎回来，人群里。", effects: [{ type: "change", key: "宁溯好感", value: 8 }, { type: "event", value: "宁溯营地夜谈完成" }], nextScene: "ch2_snow_014" }
    ]
  },
  "ch2_snow_015": {
    chapter: 2,
    background: "#dbeaf2",
    backgroundImage: ASSETS.backgrounds.ch2Farewell,
    description: "冻谱观测塔在身后逐渐缩小。母亲的残响指出，剩下的完整资料被分散在三个坐标点，其中一个与卡戎的黑暗巡演路线重合。",
    systemPrompt: "ch2_015 章末：新的方向。进入路线C-1/C-2/C-3分歧。",
    dialogues: [
      { speaker: "安柠", text: "三个坐标，我们人手有限，走一条算一条。" },
      { speaker: "弥洛", text: "如果是黑暗巡演路线……零四也许还在那附近。我想去看看。" },
      { speaker: "阿缇娅", sprite: "daily", text: "无论去哪，我这次想主动问一句——你，想先去哪？" }
    ],
    choices: [
      { text: "追踪与黑暗巡演重合的坐标。", effects: [{ type: "event", value: "route_c1_dark_tour_coordinate" }, { type: "set", key: "chapterProgress", value: 3 }], nextScene: "chapter3_archive_start" },
      { text: "追踪安柠父亲相关坐标。", effects: [{ type: "event", value: "route_c2_anning_father_coordinate" }, { type: "set", key: "chapterProgress", value: 3 }], nextScene: "chapter3_archive_start" },
      { text: "返回白谱院正面交涉。", effects: [{ type: "event", value: "route_c3_white_score_negotiation" }, { type: "set", key: "chapterProgress", value: 3 }], nextScene: "chapter3_white_start" },
      { text: "保存第二章记录。", effect: () => saveGame() }
    ]
  },
  "chapter3_archive_start": {
    isMapNode: true,
    background: "#111827",
    backgroundImage: ASSETS.backgrounds.graystringDay,
    description: "这里暂存旧版第一至第三章的全部内容。它们不再占用新的第一章结构，而是作为第三章旧案合辑保留，后续可按第三章设定重新拆分、改名或重写。",
    systemPrompt: "第三章旧案合辑：旧第一至第三章已合体归档。新第一章重做时不再引用这些入口。",
    dialogues: [
      { speaker: "系统", text: "旧内容入口已迁移到此处：回声城邦、灰弦长廊、第三乐章盛典线都先归为第三章旧案。" },
      { speaker: "槐序", sprite: "sarcastic", text: "终于有人承认这些谱页不该全塞在第一章里了。" }
    ],
    choices: [
      { text: "进入旧第一段：回声城邦晨钟广场", nextScene: "ch1_001" },
      { text: "进入旧第二段：灰弦长廊", nextScene: "ch2_001" },
      { text: "进入旧第三段：盛典异常", nextScene: "ch3_001" },
      { text: "查看新第一章雾茧站支线入口", nextScene: "ch1_black_004" },
      { text: "返回新第一章占位入口", nextScene: "chapter1_start" },
      { text: "保存进度", effect: () => saveGame() }
    ]
  },
  "chapter3_white_start": {
    isMapNode: true,
    chapter: 3,
    background: "#f6f1e8",
    backgroundImage: ASSETS.backgrounds.ch3WhiteScoreGate,
    description: "第三章 · 白谱缚响。你们选择路线C-3，带着零号奏者计划的核心权限碎片返回白谱院，正面交涉阿缇娅的登记与自主权。",
    systemPrompt: "第三章 · 白谱缚响｜路线C-3：返回白谱院正面交涉。新增机制：听证倾向值、沈知微好感、珏衡好感。",
    dialogues: [
      { speaker: "系统", text: "本章风格切换为大理石金色学院圣殿：明亮、庄严、被规训，不再使用雨幕、雾站或冰蓝科研遗迹背景。" },
      { speaker: "阿缇娅", sprite: "daily", text: "如果他们要问我是谁，我想这次自己回答。" }
    ],
    choices: [
      { text: "进入白谱院正门广场。", effects: [{ type: "set", key: "听证倾向值", value: 0 }, { type: "event", value: "ch3_white_route_started" }], nextScene: "ch3_white_000" },
      { text: "先打开世界地图确认白谱院结构。", effect: () => openWorldMap() }
    ]
  },
  "ch3_white_000": {
    chapter: 3,
    background: "#f7f2e8",
    backgroundImage: ASSETS.backgrounds.ch3WhiteScoreGate,
    description: "穿过最后一道山路，白谱院在阳光下展开。白色大理石与局部金色雕饰干净得近乎不真实，彩窗穹顶把光斑投在地面，像制度本身缓慢移动的影子。",
    systemPrompt: "ch3_000 楔子：抵达白谱院。若宁溯同行，会触发重返总院的补充台词。",
    dialogues: [
      { speaker: "安柠", text: "这地方……和我们这一路见过的任何地方都不一样。干净得，好像什么坏事都没在这里发生过。" },
      { speaker: "弥洛", text: "秩序守护和声。我以前，也在类似的门前站过。" },
      { speaker: "宁溯", text: "六年了。这扇门，我以为自己这辈子不会再走进去。", conditions: [{ operator: "includes", value: "宁溯加入队伍" }] }
    ],
    choices: [
      { text: "直接申请会面登记官。", nextScene: "ch3_white_001" },
      { text: "先在门外观察一会儿。", effects: [{ type: "event", value: "ch3_white_gate_observed" }, { type: "change", key: "世界观信息", value: 1 }], nextScene: "ch3_white_001" }
    ]
  },
  "ch3_white_001": {
    chapter: 3,
    background: "#f5f0e8",
    backgroundImage: ASSETS.backgrounds.ch3ReceptionHall,
    description: "接待处的流程比想象中顺畅，直到行政人员的目光落在阿缇娅身上。她被要求佩戴一枚素净的银色临时观察徽章。",
    systemPrompt: "ch3_001 接待与观察徽章。解锁听证倾向值机制。",
    dialogues: [
      { speaker: "行政人员", text: "这位是……未登记律者？根据条例，我需要先为您办理临时观察标识。" },
      { speaker: "阿缇娅", sprite: "daily", text: "如果我把它摘下来，会怎么样？" },
      { speaker: "行政人员", text: "那将被视为拒绝配合登记流程。我们不希望走到那一步。" }
    ],
    choices: [
      { text: "让阿缇娅先佩戴徽章。", effects: [{ type: "event", value: "阿缇娅临时观察对象" }, { type: "change", key: "听证倾向值", value: 2 }], nextScene: "ch3_white_002" },
      { text: "要求记录：佩戴不等于承认看管。", effects: [{ type: "event", value: "观察徽章附条件记录" }, { type: "change", key: "听证倾向值", value: 5 }, { type: "change", key: "阿缇娅共鸣", value: 2 }], nextScene: "ch3_white_002" }
    ]
  },
  "ch3_white_002": {
    chapter: 3,
    background: "#f6efe6",
    backgroundImage: ASSETS.backgrounds.ch3ReceptionHall,
    defaultSpeaker: "沈知微",
    description: "沈知微准时出现，礼貌、平稳、无懈可击。她不提高音量，也不真正让步，只把每一个活生生的问题放进表格。",
    systemPrompt: "ch3_002 沈知微登场：你如何定义自己。",
    dialogues: [
      { speaker: "沈知微", text: "在档案上，我需要给你一个明确分类：自然觉醒律者，人格延续型，还是契约衍生存在，人格模拟型？" },
      { speaker: "沈知微", text: "你自己怎么看？" }
    ],
    choices: [
      { text: "替她回答：她是阿缇娅，不需要别的分类。", effects: [{ type: "change", key: "听证倾向值", value: 3 }, { type: "change", key: "阿缇娅共鸣", value: 5 }], nextScene: "ch3_white_003" },
      { text: "鼓励阿缇娅自己回答。", effects: [{ type: "event", value: "阿缇娅自我定义" }, { type: "change", key: "听证倾向值", value: 8 }, { type: "change", key: "阿缇娅共鸣", value: 10 }], nextScene: "ch3_white_003" },
      { text: "保持沉默，等沈知微记录。", effects: [{ type: "change", key: "听证倾向值", value: -5 }, { type: "change", key: "阿缇娅共鸣", value: -2 }], nextScene: "ch3_white_003" }
    ]
  },
  "ch3_white_003": {
    chapter: 3,
    background: "#f1eadf",
    backgroundImage: ASSETS.backgrounds.ch3ArchiveCorridor,
    description: "早期实验档案区里，你们找到一份编号为“试制零零一”的个体记录。照片模糊，但轮廓与弥洛高度吻合。",
    systemPrompt: "ch3_003 档案室：弥洛的旧编号。确认早期实验体身份。",
    dialogues: [
      { speaker: "弥洛", text: "原来我离开，不是我自己逃出来的。是他们嫌我太像个人了，主动放弃的。" }
    ],
    choices: [
      { text: "这不是被放弃，是你自己赢来的自由。", effects: [{ type: "event", value: "弥洛试制零零一确认" }, { type: "change", key: "弥洛信任", value: 8 }, { type: "change", key: "听证倾向值", value: 4 }], nextScene: "ch3_white_004" },
      { text: "你想销毁这份档案吗？", effects: [{ type: "event", value: "ch3_milo_archive_choice_seed" }, { type: "event", value: "弥洛试制零零一确认" }], nextScene: "ch3_white_004" }
    ]
  },
  "ch3_white_004": {
    chapter: 3,
    background: "#f1eadf",
    backgroundImage: ASSETS.backgrounds.ch3ArchiveCorridor,
    description: "同一批档案中，安柠找到了父亲的完整记录。机械维护组二级技师，负责零号奏者计划早期原型装置的日常维护。",
    systemPrompt: "ch3_004 档案室：安柠父亲的真相。",
    dialogues: [
      { speaker: "安柠", text: "他是因为我，才提前离开的。原来他早就主动把自己和这一切切开了。" }
    ],
    choices: [
      { text: "他做了一个父亲能做的最好的选择。", effects: [{ type: "event", value: "安柠父亲完整档案" }, { type: "change", key: "安柠好感", value: 10 }, { type: "change", key: "听证倾向值", value: 3 }], nextScene: "ch3_white_005" },
      { text: "你会怪他没告诉你吗？", effects: [{ type: "event", value: "安柠父亲完整档案" }, { type: "change", key: "安柠好感", value: 6 }, { type: "event", value: "安柠给父亲的信" }], nextScene: "ch3_white_005" }
    ]
  },
  "ch3_white_005": {
    chapter: 3,
    background: "#f4efe8",
    backgroundImage: ASSETS.backgrounds.ch3PortraitCorridor,
    description: "肖像长廊里，老教授温别克拄着拐杖慢慢踱步。他看起来糊涂，却精准地把一句线索放到你们面前。",
    systemPrompt: "ch3_005 温别克的暗示。开放E301-E305地图事件。",
    dialogues: [
      { speaker: "温别克", text: "三十年前有个姑娘和你长得很像，总爱在这条走廊里，一边走一边哼一些院里禁止哼的调子。" },
      { speaker: "温别克", text: "档案室三层，标着待销毁的那个柜子，其实从来没被真的销毁过。这话我可没说过。" }
    ],
    choices: [
      { text: "谢谢您，温教授。", effects: [{ type: "event", value: "温别克待销毁柜线索" }, { type: "change", key: "听证倾向值", value: 5 }], nextScene: "ch3_white_006" },
      { text: "您为什么要帮我们？", effects: [{ type: "event", value: "温别克隐藏独白" }, { type: "event", value: "温别克待销毁柜线索" }, { type: "change", key: "听证倾向值", value: 8 }], nextScene: "ch3_white_006" },
      { text: "调查白谱院支线事件。", effect: () => drawChapter3WhiteMapEvent() }
    ]
  },
  "ch3_white_006": {
    chapter: 3,
    background: "#eee7dd",
    backgroundImage: ASSETS.backgrounds.ch3ArchiveCorridor,
    description: "夜晚的档案室外，年轻研究员柏舟主动找上你。他紧张得把资料抱得很紧，却没有后退。",
    systemPrompt: "ch3_006 柏舟的私下接触。体制内同盟者支援。",
    dialogues: [
      { speaker: "柏舟", text: "如果听证会那天需要一个懂行的人出面作证，我愿意去。哪怕这可能会影响我的留院评级。" }
    ],
    choices: [
      { text: "谢谢你愿意冒这个险。", effects: [{ type: "event", value: "柏舟听证证人" }, { type: "change", key: "听证倾向值", value: 15 }], nextScene: "ch3_white_007" },
      { text: "你确定吗？这对你风险很大。", effects: [{ type: "event", value: "柏舟完整理想主义独白" }, { type: "event", value: "柏舟听证证人" }, { type: "change", key: "听证倾向值", value: 18 }], nextScene: "ch3_white_007" }
    ]
  },
  "ch3_white_007": {
    chapter: 3,
    background: "#ede6dc",
    backgroundImage: ASSETS.backgrounds.ch3ReceptionHall,
    description: "听证会前夜，队伍围坐在访客居所。纸面证据堆在桌上，但最重的不是文件，而是明天阿缇娅是否会被允许作为自己站在这里。",
    systemPrompt: "ch3_007 听证会前夕：准备与抉择。开放陈述编排小游戏。",
    dialogues: [
      { speaker: "安柠", text: "温教授和柏舟愿意作证，加上我们自己这一路的记录……但我不知道够不够。" },
      { speaker: "阿缇娅", sprite: "daily", text: "如果结果是观察期，甚至临时看管，我希望你们不要为了我，做出让自己也变成需要被登记的事。" }
    ],
    choices: [
      { text: "进行听证陈述编排。", nextScene: "ch3_minigame_hearing_statement" },
      { text: "不会有那种结果，我们会证明给他们看。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 5 }, { type: "change", key: "听证倾向值", value: 5 }], nextScene: "ch3_white_008" },
      { text: "如果真的发生了，我也不会不管你。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 8 }, { type: "event", value: "阿缇娅听证前夜稀有过场" }], nextScene: "ch3_white_008" }
    ]
  },
  "ch3_minigame_hearing_statement": {
    chapter: 3,
    background: "#ede6dc",
    backgroundImage: ASSETS.backgrounds.ch3ReceptionHall,
    description: "听证陈述编排：你需要从一路收集的证据中选出最能递进的顺序，让制度先看见事实，再看见事实背后的人。",
    systemPrompt: "小游戏：听证陈述编排。逻辑递进加成最高，杂乱堆砌加成较低。",
    dialogues: [
      { speaker: "安柠", text: "先讲行为记录，再讲零号计划，再讲登记制度的问题。别一上来就和沈知微吵。" }
    ],
    choices: [
      { text: "按行为记录、证人证词、零号计划、阿缇娅自述排序。", effects: [{ type: "event", value: "ch3_statement_order_excellent" }, { type: "change", key: "听证倾向值", value: 15 }, { type: "change", key: "沈知微好感", value: 3 }], nextScene: "ch3_white_008" },
      { text: "先抛出母亲资料，再补充证人证词。", effects: [{ type: "event", value: "ch3_statement_order_direct" }, { type: "change", key: "听证倾向值", value: 8 }], nextScene: "ch3_white_008" },
      { text: "把所有证据一次性摆上去。", effects: [{ type: "event", value: "ch3_statement_order_messy" }, { type: "change", key: "听证倾向值", value: 3 }], nextScene: "ch3_white_008" }
    ]
  },
  "ch3_white_008": {
    chapter: 3,
    background: "#f7f4ee",
    backgroundImage: ASSETS.backgrounds.ch3HearingChamber,
    defaultSpeaker: "沈知微",
    description: "中央大礼堂里，那架从不演奏的银色管风琴静静矗立。沈知微翻开账册，正式开始阿缇娅的身份听证。",
    systemPrompt: "ch3_008 听证会：根据听证倾向值进入三种展开。",
    dialogues: [
      { speaker: "沈知微", text: "听证正式开始。事由：未登记自然律者阿缇娅的身份评估。请陈述你们认为，她不需要接受观察期的理由。" }
    ],
    choices: [
      { text: "提交陈述与证人证词。", effect: () => resolveCh3WhiteHearing() }
    ]
  },
  "ch3_white_008_high": {
    chapter: 3,
    background: "#f7f4ee",
    backgroundImage: ASSETS.backgrounds.ch3HearingChamber,
    description: "高倾向听证：温别克和柏舟的证词让礼堂第一次出现真正的停顿。沈知微把结论从看管改为附条件通过。",
    systemPrompt: "听证倾向值≥50：附条件通过，无需观察期。",
    dialogues: [
      { speaker: "温别克", text: "零号奏者计划最初想解决的问题，不就是律者要不要被当人看待吗？" },
      { speaker: "沈知微", text: "你们的证词，确实提供了新的评估维度。结论调整为：附条件通过，无需观察期。" }
    ],
    choices: [
      { text: "记录听证通过结果。", effects: [{ type: "event", value: "阿缇娅听证附条件通过" }, { type: "change", key: "沈知微好感", value: 8 }], nextScene: "ch3_white_012" }
    ]
  },
  "ch3_white_008_mid": {
    chapter: 3,
    background: "#f7f4ee",
    backgroundImage: ASSETS.backgrounds.ch3HearingChamber,
    description: "中间倾向听证：沈知微部分认可证词，但仍要求三个月观察期。观察期不限制自由，却仍是一根被写进档案的线。",
    systemPrompt: "听证倾向值0-49：三个月观察期，不限制人身自由。",
    dialogues: [
      { speaker: "沈知微", text: "理解不等于证据充分。根据现有材料，我倾向于三个月观察期，期间不限制人身自由，但需定期回院报告。" },
      { speaker: "阿缇娅", sprite: "daily", text: "三个月，也许没有想象中那么长。" }
    ],
    choices: [
      { text: "接受有限观察期，继续寻找资料。", effects: [{ type: "event", value: "阿缇娅三个月观察期" }, { type: "change", key: "沈知微好感", value: 3 }], nextScene: "ch3_white_012" }
    ]
  },
  "ch3_white_008_low": {
    chapter: 3,
    background: "#f7f4ee",
    backgroundImage: ASSETS.backgrounds.ch3HearingChamber,
    description: "低倾向听证：沈知微将阿缇娅的独立判断解释为失控风险，裁定临时看管。礼堂里安静得像所有彩窗都停止了发光。",
    systemPrompt: "听证倾向值<0：临时看管，进入珏衡强制介入。",
    dialogues: [
      { speaker: "沈知微", text: "根据现有记录，包括她曾在战斗中脱离主角指挥、独立做出攻击决策，我认为评估结果应为：临时看管。" },
      { speaker: "阿缇娅", sprite: "daily", text: "……我明白了。" }
    ],
    choices: [
      { text: "拒绝临时看管裁决。", nextScene: "ch3_white_009" }
    ]
  },
  "ch3_white_009": {
    chapter: 3,
    background: "#f7f4ee",
    backgroundImage: ASSETS.backgrounds.ch3BossStandoff,
    defaultSpeaker: "珏衡",
    description: "礼堂侧门打开，珏衡步入场中。她不是静默序列，也不是禁曲派的工具。她自愿登记，自愿执行规则，也因此更难被简单地当作敌人。",
    systemPrompt: "ch3_009 决裂：珏衡奉命行动。",
    dialogues: [
      { speaker: "沈知微", text: "珏衡，请协助完成临时看管的转移程序。" },
      { speaker: "珏衡", text: "抱歉，这是我的职责所在。如果你们的坚持是对的，那就在场上证明给我看。" }
    ],
    choices: [
      { text: "应战。", effect: () => startBattle("ch3_juheng_inspector", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "最后一次口头说服。", effects: [{ type: "event", value: "ch3_juheng_softened_before_battle" }, { type: "change", key: "珏衡好感", value: 3 }], effect: () => startBattle("ch3_juheng_inspector", { selectedMusicarts: ["阿缇娅", "弥洛"] }) }
    ]
  },
  "ch3_white_011": {
    chapter: 3,
    background: "#f7f4ee",
    backgroundImage: ASSETS.backgrounds.ch3HearingChamber,
    description: "战斗结束后，珏衡收起审谱杖。她不是被击败，而是在亲眼看见阿缇娅收手的那一刻，选择把所见如实写进报告。",
    systemPrompt: "ch3_011 战后：珏衡的表态。根据战斗表现分支。",
    dialogues: [
      { speaker: "珏衡", text: "审查官，我作为执行人，申请补充一份现场观察报告。" },
      { speaker: "珏衡", text: "她在完全占据上风的情况下，两次收手放过要害。这不符合失控倾向的评估标准。" },
      { speaker: "沈知微", text: "……记录在案。" }
    ],
    choices: [
      { text: "继续调查待销毁柜。", effects: [{ type: "event", value: "珏衡现场观察报告" }, { type: "change", key: "珏衡好感", value: 8 }, { type: "change", key: "听证倾向值", value: 20 }], nextScene: "ch3_white_012" },
      { text: "拜访珏衡的休息室。", conditions: [{ operator: "includes", value: "珏衡现场观察报告" }], nextScene: "ch3_side_juheng_room" }
    ]
  },
  "ch3_white_012": {
    chapter: 3,
    background: "#f1eadf",
    backgroundImage: ASSETS.backgrounds.ch3SecondFileDiscovery,
    description: "按照温别克的暗示，你们打开待销毁柜。防潮布里包着第二份完整资料，边缘的半枚白色吊坠钢印与主角手中的碎片严丝合缝。",
    systemPrompt: "ch3_012 温别克线索：待销毁柜里的东西。获得第二份资料。",
    dialogues: [
      { speaker: "安柠", text: "是……零号奏者计划的第二份完整资料。上面还有你母亲的签名批注。" },
      { speaker: "【内心】", text: "母亲留下的，不只是技术资料。是对每一个人的、近乎精准的信任评估。" }
    ],
    choices: [
      { text: "收起第二份完整资料。", effects: [{ type: "event", value: "零号奏者计划完整资料·第二份" }, { type: "event", value: "母亲对白谱院内部人心的判断" }, { type: "change", key: "世界观信息", value: 4 }], nextScene: "ch3_white_013" },
      { text: "先通过文件分类挑战获取正式权限。", nextScene: "ch3_minigame_file_sorting" }
    ]
  },
  "ch3_minigame_file_sorting": {
    chapter: 3,
    background: "#f1eadf",
    backgroundImage: ASSETS.backgrounds.ch3ArchiveCorridor,
    description: "文件分类挑战：将打乱的档案按部门、年份、密级三重标准归类。你不是在讨好系统，而是在用系统自己的语法，把它锁住的资料取出来。",
    systemPrompt: "小游戏：文件分类挑战。对应E301，可加速解锁ch3_012并提升沈知微好感。",
    dialogues: [
      { speaker: "柏舟", text: "白谱院的权限验证很死板。好消息是，死板的东西通常也很好预测。" }
    ],
    choices: [
      { text: "按部门、年份、密级完整归类。", effects: [{ type: "event", value: "E301_file_sorting_success" }, { type: "change", key: "沈知微好感", value: 3 }, { type: "change", key: "听证倾向值", value: 5 }], nextScene: "ch3_white_012" },
      { text: "让柏舟协助绕过繁琐验证。", effects: [{ type: "event", value: "E301_baizhou_access_help" }, { type: "change", key: "听证倾向值", value: 3 }], nextScene: "ch3_white_012" }
    ]
  },
  "ch3_white_013": {
    chapter: 3,
    background: "#f6efe6",
    backgroundImage: ASSETS.backgrounds.ch3ReceptionHall,
    description: "听证结果尘埃落定后，沈知微单独召见主角与阿缇娅。她没有改变制度，却第一次改变了自己审视制度的方式。",
    systemPrompt: "ch3_013 沈知微的最终裁决。摘下临时观察徽章。",
    dialogues: [
      { speaker: "沈知微", text: "我依然认为，登记制度有其必要性。但今天这场听证，让我第一次认真想：我评估的从来不该只是分类。" },
      { speaker: "沈知微", text: "这枚徽章，我会记录为正式完成初步评估，转为长期善意观察对象。" }
    ],
    choices: [
      { text: "谢谢您愿意重新考虑。", effects: [{ type: "change", key: "沈知微好感", value: 10 }, { type: "event", value: "沈知微体制内同盟种子" }], nextScene: "ch3_white_014" },
      { text: "如果下一个例外没有我们这么幸运呢？", effects: [{ type: "change", key: "沈知微好感", value: 5 }, { type: "event", value: "沈知微制度局限沉默" }], nextScene: "ch3_white_014" }
    ]
  },
  "ch3_white_014": {
    chapter: 3,
    background: "#f7f2e8",
    backgroundImage: ASSETS.backgrounds.ch3WhiteScoreGate,
    description: "队伍离开白谱院时，柏舟追出来送行。阿缇娅回望彩窗穹顶，胸前那枚被取下的观察徽章不再是屈辱，而是一段被认真问过的记录。",
    systemPrompt: "ch3_014 尾声：带着身份离开。进入路线D-1/D-2/D-3分歧。",
    dialogues: [
      { speaker: "柏舟", text: "温教授说，这些副本你们带走比留在这里安全。他还说，如果零号奏者计划真的能被正大光明地重新做一次，他想活着看到那一天。" },
      { speaker: "阿缇娅", sprite: "daily", text: "被允许存在和活得像自己，中间还隔着很长一段路。但今天，我们至少往前走了一步。" }
    ],
    choices: [
      { text: "路线D-1：正面追击黑暗巡演车队。", effects: [{ type: "event", value: "route_d1_dark_tour_pursuit" }, { type: "set", key: "chapterProgress", value: 4 }], nextScene: "chapter4_start" },
      { text: "路线D-2：联系体制内资源争取支援。", effects: [{ type: "event", value: "route_d2_institutional_support" }, { type: "set", key: "chapterProgress", value: 4 }], nextScene: "chapter4_start" },
      { text: "路线D-3：优先寻找零四下落。", effects: [{ type: "event", value: "route_d3_find_sequence_04" }, { type: "set", key: "chapterProgress", value: 4 }], nextScene: "chapter4_start" },
      { text: "茶歇：阿缇娅 · 给自己的表格加一栏", conditions: [{ operator: "includes", value: "阿缇娅自我定义" }], nextScene: "ch3_side_atya_form" },
      { text: "茶歇：弥洛 · 重返旧地", conditions: [{ operator: "includes", value: "弥洛试制零零一确认" }], nextScene: "ch3_side_milo_old_place" },
      { text: "茶歇：安柠 · 写给父亲的信", conditions: [{ operator: "includes", value: "安柠父亲完整档案" }], nextScene: "ch3_side_anning_letter" },
      { text: "茶歇：珏衡 · 第一次同行", conditions: [{ operator: "includes", value: "珏衡加入队伍" }], nextScene: "ch3_side_juheng_first_walk" }
    ]
  },
  "ch3_side_atya_form": {
    chapter: 3,
    background: "#ede6dc",
    backgroundImage: ASSETS.backgrounds.ch3ReceptionHall,
    description: "听证结束后的夜晚，阿缇娅在窗边写着什么。彩窗光落在纸上，像一张终于留白的表格。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "分类那一栏，我想填：仍在学习如何回答这个问题的存在。你觉得这个答案，及格吗？" }
    ],
    choices: [
      { text: "满分。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 6 }, { type: "event", value: "阿缇娅第一份自我陈述" }], nextScene: "ch3_white_014" },
      { text: "不用及格，这本来就没有标准答案。", effects: [{ type: "change", key: "阿缇娅共鸣", value: 8 }, { type: "event", value: "阿缇娅标准答案独白" }], nextScene: "ch3_white_014" }
    ]
  },
  "ch3_side_milo_old_place": {
    chapter: 3,
    background: "#f1eadf",
    backgroundImage: ASSETS.backgrounds.ch3ArchiveCorridor,
    description: "弥洛独自站在早期实验区外围，望着那扇多年未曾回来的门。",
    dialogues: [
      { speaker: "弥洛", text: "离开这么多年，我一直告诉自己不要回头。今天回来了，发现最难的不是面对这个地方。是发现自己早就不再害怕它了。" }
    ],
    choices: [
      { text: "陪他站一会儿。", effects: [{ type: "change", key: "弥洛共鸣", value: 6 }, { type: "event", value: "弥洛重返旧地闭环" }], nextScene: "ch3_white_014" }
    ]
  },
  "ch3_side_anning_letter": {
    chapter: 3,
    background: "#f1eadf",
    backgroundImage: ASSETS.backgrounds.ch3ArchiveCorridor,
    description: "离开白谱院前，安柠写了一封永远不会寄出的信。她把父亲的选择放回父亲那里，也把自己的选择拿回自己手里。",
    dialogues: [
      { speaker: "安柠", text: "爸，我现在知道你当年做的选择了。谢谢你没有让我从小就活在这些名词里。不过这次，是我自己选择要弄清楚的。" }
    ],
    choices: [
      { text: "替她封好那封信。", effects: [{ type: "change", key: "安柠好感", value: 6 }, { type: "event", value: "安柠写给父亲的信" }], nextScene: "ch3_white_014" }
    ]
  },
  "ch3_side_juheng_first_walk": {
    chapter: 3,
    background: "#f7f2e8",
    backgroundImage: ASSETS.backgrounds.ch3WhiteScoreGate,
    description: "珏衡第一次以同行者身份走在队伍里。她仍然把制服整理得一丝不苟，但步伐不再完全像巡逻。",
    dialogues: [
      { speaker: "珏衡", text: "我依然认为规则本身没有错。只是以后我会更认真地想，规则该怎么用，而不是只想着怎么执行它。这算不算，也是一种成长？" }
    ],
    choices: [
      { text: "算。欢迎同行，珏衡。", effects: [{ type: "change", key: "珏衡好感", value: 8 }, { type: "event", value: "珏衡第一次同行完成" }], nextScene: "ch3_white_014" }
    ]
  },
  "ch3_side_juheng_room": {
    chapter: 3,
    background: "#f1eadf",
    backgroundImage: ASSETS.backgrounds.ch3ReceptionHall,
    description: "珏衡的休息室简单克制，唯一的私人物品是一份手写的《自愿契约誓词》。编号牌旁边刻着她的名字，这一点比任何辩解都更安静。",
    systemPrompt: "E305 珏衡的休息室：仅在战后结局一/二可访问。",
    dialogues: [
      { speaker: "珏衡", text: "我签这份契约的时候，没人逼我。也正因为如此，我更不能把不自愿的看管，说成保护。" }
    ],
    choices: [
      { text: "邀请珏衡之后同行。", effects: [{ type: "event", value: "珏衡加入队伍" }, { type: "change", key: "珏衡好感", value: 8 }], nextScene: "ch3_white_014" },
      { text: "请珏衡留在白谱院作为内部支援。", effects: [{ type: "event", value: "珏衡远程支援" }, { type: "change", key: "珏衡好感", value: 6 }], nextScene: "ch3_white_014" }
    ]
  },
  "chapter4_start": {
    isMapNode: true,
    chapter: 4,
    background: "#14070a",
    backgroundImage: ASSETS.backgrounds.ch4MainKey,
    description: "第四章 · 不夜终响。卡戎留下的黑暗巡演路线终于收束到一列永不停靠的黑漆歌剧列车：不夜巡演号。",
    systemPrompt: "第四章 · 不夜终响｜路线D：不夜巡演号。新增机制：救赎值、归还值、真相值、伊莱娜隐藏好感值。",
    dialogues: [
      { speaker: "系统", text: "追查卡戎主线进入收束章。第四章将汇合D-1正面追击、D-2体制支援、D-3寻找零四三条路线。" },
      { speaker: "安柠", sprite: "serious", text: "不夜巡演号，永远在开，永远不停站。但只要它还有周期，我们就能找到并线点。" }
    ],
    choices: [
      { text: "开始第四章：不夜终响。", effects: [{ type: "set", key: "救赎值", value: 0 }, { type: "set", key: "归还值", value: 0 }, { type: "set", key: "真相值", value: 0 }, { type: "set", key: "伊莱娜隐藏好感值", value: 0 }, { type: "event", value: "chapter4_route_started" }, { type: "set", key: "chapterProgress", value: 4 }], nextScene: "ch4_000" },
      { text: "先保存第三章后的出发记录。", effect: () => saveGame() }
    ]
  },
  "ch4_000": {
    chapter: 4,
    background: "#14070a",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "白谱院外围山道，返程路口。安柠将母亲留下的三份资料并排铺开，结合白谱院档案与钟先生旧情报，终于锁定黑色列车的周期路线。",
    systemPrompt: "ch4_000 楔子：不夜巡演号的踪迹。",
    dialogues: [
      { speaker: "安柠", sprite: "serious", text: "不夜巡演号，永远在开，永远不停站。但只要算好它的周期，我们能算出一个伴随速度的接驳点。" },
      { speaker: "弥洛", sprite: "worried", text: "这条路线……和我早年记忆里的那条，几乎重合。看来，起点和终点，最后总会绕到一起。" }
    ],
    choices: [
      { text: "现在就出发。", nextScene: "ch4_001" },
      { text: "先确认所有人都做好准备了吗？", effects: [{ type: "event", value: "ch4_departure_prepared" }], nextScene: "ch4_001" }
    ]
  },
  "ch4_001": {
    chapter: 4,
    background: "#1b090d",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "安柠操控改装维修车，与不断移动的黑色列车完成惊险并线。车厢内部与外部破败截然相反：黑漆、绯红丝绒、烛台、水晶灯，一切干净得近乎不该存在。",
    systemPrompt: "ch4_001 潜入：黑色列车。解锁不夜巡演号与三线交织判定。",
    dialogues: [
      { speaker: "安柠", sprite: "shocked", text: "这里比白谱院还干净。干净得，让我更不舒服。" },
      { speaker: "系统", text: "【解锁地图：不夜巡演号】【三线交织判定系统建立：救赎值 / 归还值 / 真相值】" }
    ],
    choices: [
      { text: "进入观众席车厢。", effects: [{ type: "event", value: "ch4_train_infiltrated" }], nextScene: "ch4_002" }
    ]
  },
  "ch4_002": {
    chapter: 4,
    background: "#230b10",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "一排排绯红丝绒座椅上，坐满保持鼓掌姿态却再无反应的静默序列个体。广播里循环播放虚假的观众欢呼与掌声录音。",
    systemPrompt: "ch4_002 车厢奇观：永不谢幕的观众席。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "shocked", text: "她们……在看戏？这些根本不是奖赏，是另一种意义上的，被关起来。" },
      { speaker: "弥洛", sprite: "serious", text: "卡戎管这叫退休。我更愿意叫它：被摆在展示柜里的战利品。" }
    ],
    choices: [
      { text: "逐一辨认观众席。", effects: [{ type: "event", value: "E401_audience_identified" }, { type: "change", key: "救赎值", value: 5 }], nextScene: "ch4_003" },
      { text: "直接寻找零四。", nextScene: "ch4_003" }
    ]
  },
  "ch4_003": {
    chapter: 4,
    background: "#260c12",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "在众多相似面容里，弥洛第一个认出那道带着断裂节拍器痕迹的身影。零四维持着固定鼓掌姿态，眼中暗金色光几乎熄灭。",
    systemPrompt: "ch4_003 寻找零四。若曾触发route_b3_find_sequence_04或route_d3_find_sequence_04，救赎线得到额外推进。",
    dialogues: [
      { speaker: "弥洛", sprite: "worried", text: "是她。零四。" },
      { speaker: "阿缇娅", sprite: "worried", text: "你还记得吗？我们打过一架。你当时……停顿了半拍。" }
    ],
    choices: [
      { text: "用第一章留下的半拍迟疑作为线索。", conditions: [{ operator: "includes", value: "route_b3_find_sequence_04" }], effects: [{ type: "change", key: "救赎值", value: 15 }, { type: "event", value: "零四半拍迟疑被记住" }], nextScene: "ch4_004" },
      { text: "用第三章锁定的坐标迅速确认位置。", conditions: [{ operator: "includes", value: "route_d3_find_sequence_04" }], effects: [{ type: "change", key: "救赎值", value: 12 }, { type: "event", value: "零四车厢坐标确认" }], nextScene: "ch4_004" },
      { text: "从头确认她仍有反应。", effects: [{ type: "change", key: "救赎值", value: 5 }], nextScene: "ch4_004" }
    ]
  },
  "ch4_004": {
    chapter: 4,
    background: "#250b10",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "车厢阴影里传来不成调的空弹旋律。赤，唯一没有维持鼓掌姿态的静默序列个体，仍在对着不存在的指挥者独奏。",
    systemPrompt: "ch4_004 零四与赤：两种被留下。",
    dialogues: [
      { speaker: "赤", text: "他说过，只要我一直拉，他就一直听。现在没人听了，可我这双手，好像已经忘记怎么停下来。" },
      { speaker: "弥洛", sprite: "worried", text: "她的指挥家死在任务里。她拒绝新的契约，就这样一直独奏到现在。" }
    ],
    choices: [
      { text: "尝试靠近赤，即使她可能毫无反应。", effects: [{ type: "event", value: "独奏者的终局" }, { type: "change", key: "救赎值", value: 5 }], nextScene: "ch4_005" },
      { text: "先专注处理零四，日后再想办法。", effects: [{ type: "event", value: "赤故事线保留" }], nextScene: "ch4_005" }
    ]
  },
  "ch4_005": {
    chapter: 4,
    background: "#2b0d14",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "阿缇娅没有拔出指挥棒，只是伸出手，覆在零四冰凉的手背上。唤醒不是命令，而是一场很慢、很轻的合奏。",
    systemPrompt: "ch4_005 零四的抉择。救赎值高位将解锁长期同行伏笔。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "worried", text: "我不知道你还记不记得自己叫什么名字。但那天，你为了那半拍，一定是想起了什么。" },
      { speaker: "系统", text: "小游戏占位：节拍共鸣唤醒。正式制作时将加入轻柔点击与回退判定。" }
    ],
    choices: [
      { text: "由主角尝试用未鸣共鸣唤醒零四。", effects: [{ type: "change", key: "救赎值", value: 20 }, { type: "event", value: "零四未鸣共鸣唤醒" }], nextScene: "ch4_006" },
      { text: "让阿缇娅以同类身份尝试情感共鸣。", effects: [{ type: "change", key: "救赎值", value: 15 }, { type: "change", key: "阿缇娅共鸣", value: 5 }, { type: "event", value: "阿缇娅同类共鸣零四" }], nextScene: "ch4_006" },
      { text: "让弥洛以幸存者身份与她说话。", effects: [{ type: "change", key: "救赎值", value: 18 }, { type: "change", key: "弥洛共鸣", value: 5 }, { type: "event", value: "弥洛幸存者对话零四" }], nextScene: "ch4_006" }
    ]
  },
  "ch4_006": {
    chapter: 4,
    background: "#1e080c",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "穿过观众席后段，岐与岚拦住通往祭坛车厢的必经之路。她们不是怪物，而是仍相信卡戎的人。",
    systemPrompt: "ch4_006 遭遇：岐与岚的车厢。",
    dialogues: [
      { speaker: "岚", text: "你们就是那些，一路上到处替卡戎大人的弃子翻案的人？" },
      { speaker: "岐", text: "用力量夺回本该属于所有人的音乐，这个想法本身，哪里错了？" },
      { speaker: "阿缇娅", sprite: "serious", text: "想法本身没有错。错的是，你们从没被允许怀疑过手段。" }
    ],
    choices: [
      { text: "尝试说服岐与岚放弃拦截。", effects: [{ type: "change", key: "真相值", value: 8 }, { type: "event", value: "岐岚动摇但未倒戈" }], nextScene: "ch4_008" },
      { text: "直接应战，快速突破。", effects: [{ type: "event", value: "岐岚组合战完成" }], nextScene: "ch4_008" },
      { text: "尝试单独说服岚。", effects: [{ type: "change", key: "真相值", value: 5 }, { type: "event", value: "岚先行松动" }], nextScene: "ch4_008" },
      { text: "先调查观众席另一侧的零七踪迹。", conditions: [{ operator: "includes", value: "寻找并唤回零七" }], nextScene: "ch4_007" }
    ]
  },
  "ch4_007": {
    chapter: 4,
    background: "#260c12",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "若尤娜在第一章走向结局丙，队伍会在另一侧观众席找到编号零七。此处先作为可选伏笔节点保留。",
    systemPrompt: "ch4_007 零七的踪迹。仅第一章结局丙适用，当前骨架保留入口。",
    dialogues: [
      { speaker: "系统", text: "零七/尤娜归还线将在确认第一章分支变量后展开。当前记录保留为第四章归还值系统入口。" }
    ],
    choices: [
      { text: "记录零七位置，回到主线。", effects: [{ type: "event", value: "零七位置记录" }, { type: "change", key: "归还值", value: 10 }], nextScene: "ch4_008" }
    ]
  },
  "ch4_008": {
    chapter: 4,
    background: "#18080d",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "车厢连接处装甲门被爆破。伊莱娜带着征召律者希声强行切入，不是来救援，而是来确认这列车是否必须被彻底封锁。",
    systemPrompt: "ch4_008 不速之客：伊莱娜的强袭。",
    dialogues: [
      { speaker: "伊莱娜", text: "静默署稽查队。所有人离开核心车厢入口，接受临时管制。" },
      { speaker: "希声", text: "目标确认。不夜巡演号内存在大量非登记静默序列个体。" },
      { speaker: "安柠", sprite: "serious", text: "现在还玩管制那套？里面坐着一整车被你们制度漏掉的人。" }
    ],
    choices: [
      { text: "暂时交换情报，争取静默署支援。", effects: [{ type: "change", key: "伊莱娜隐藏好感值", value: 15 }, { type: "change", key: "真相值", value: 8 }, { type: "event", value: "伊莱娜临时协作" }], nextScene: "ch4_009" },
      { text: "拒绝被管制，但允许她们看见证据。", effects: [{ type: "change", key: "伊莱娜隐藏好感值", value: 8 }, { type: "change", key: "真相值", value: 5 }, { type: "event", value: "希声看见观众席" }], nextScene: "ch4_009" },
      { text: "强行突围。", effects: [{ type: "change", key: "伊莱娜隐藏好感值", value: -5 }, { type: "event", value: "三方混战种子" }], nextScene: "ch4_009" }
    ]
  },
  "ch4_009": {
    chapter: 4,
    background: "#2a0d16",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "祭坛车厢前，瑟萝弥终于正面拦住队伍。她的信仰没有崩塌，却第一次在问题面前失去完整的形状。",
    systemPrompt: "ch4_009 瑟萝弥的动摇。",
    dialogues: [
      { speaker: "瑟萝弥", text: "你们真的从雪岭那种地方，带回了另一种可能？如果从一开始，就存在一种不需要这么残忍的方法……那我这些年做的事，算什么？" },
      { speaker: "阿缇娅", sprite: "serious", text: "你做过的事不能被一句动摇抵消。但如果你现在还知道痛，就说明你还没有被卡戎变成只会执行的东西。" }
    ],
    choices: [
      { text: "告诉她：现在停下还来得及。", effects: [{ type: "change", key: "真相值", value: 12 }, { type: "event", value: "瑟萝弥战前动摇" }], nextScene: "ch4_010" },
      { text: "让她用战斗自己确认。", effects: [{ type: "event", value: "瑟萝弥最终战标准进入" }], nextScene: "ch4_010" }
    ]
  },
  "ch4_010": {
    chapter: 4,
    background: "#2e0f18",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "瑟萝弥的最后一战。十字裁定仍然锋利，但每一次落枪都比上一章慢了半拍。",
    systemPrompt: "ch4_010 Boss战：瑟萝弥的最后一战。正式战斗将在下一阶段接入。",
    dialogues: [
      { speaker: "系统", text: "Boss占位：瑟萝弥最终战。P1圣咏领域，P2十字裁定·终，P3崩解的信仰。" },
      { speaker: "瑟萝弥", text: "如果你们真的找到了别的办法，就证明给我看。不要用道理，用你们的演奏。" }
    ],
    choices: [
      { text: "触发暮弦双鸣，正面击破她的迟疑。", effects: [{ type: "event", value: "瑟萝弥倒戈支援" }, { type: "change", key: "真相值", value: 15 }], nextScene: "ch4_011" },
      { text: "标准胜利，继续深入核心车厢。", effects: [{ type: "event", value: "瑟萝弥撤往核心车厢" }], nextScene: "ch4_011" }
    ]
  },
  "ch4_011": {
    chapter: 4,
    background: "#16070b",
    backgroundImage: ASSETS.backgrounds.ch4CoreOrganChamber,
    description: "穿过祭坛车厢，队伍抵达核心车厢外。巨大黑色管风琴的低鸣穿过铁轨与车轮，像一颗被强迫继续跳动的心脏。",
    systemPrompt: "ch4_011 深入核心车厢。",
    dialogues: [
      { speaker: "弥洛", sprite: "serious", text: "这不是单纯的乐器。它在把整列车的节奏绑在一起。" },
      { speaker: "阿缇娅", sprite: "serious", text: "那我们就让它停下来。" }
    ],
    choices: [
      { text: "进入核心车厢，面对卡戎。", nextScene: "ch4_012" }
    ]
  },
  "ch4_012": {
    chapter: 4,
    background: "#120508",
    backgroundImage: ASSETS.backgrounds.ch4CoreOrganChamber,
    description: "卡戎终于摘下所有用于表演的礼貌。他年轻时曾是零号奏者计划核心研究者之一，也曾与主角母亲并肩工作。",
    systemPrompt: "ch4_012 卡戎的真相。",
    dialogues: [
      { speaker: "卡戎", text: "你母亲相信，办法可以慢慢打，只要方向是对的。我曾经也这么相信过。" },
      { speaker: "卡戎", text: "直到我亲眼看着自己的女儿，因为方向对但速度不够快，在我怀里咽下最后一口气。" }
    ],
    choices: [
      { text: "温柔不是缓慢，残忍也不等于及时。", effects: [{ type: "change", key: "真相值", value: 20 }, { type: "event", value: "卡戎被迫直面真相" }], nextScene: "ch4_013" },
      { text: "你付过代价，但你不能让所有人继续替你付。", effects: [{ type: "change", key: "真相值", value: 15 }, { type: "event", value: "卡戎代价论被反驳" }], nextScene: "ch4_013" },
      { text: "我不想说服你。我只想让这列车停下。", effects: [{ type: "change", key: "真相值", value: 8 }], nextScene: "ch4_013" }
    ]
  },
  "ch4_013": {
    chapter: 4,
    background: "#18070b",
    backgroundImage: ASSETS.backgrounds.ch4CoreOrganChamber,
    description: "最终战前，所有曾被这条主线牵引的人站在不同位置。有人准备战斗，有人准备作证，有人第一次准备停下鼓掌。",
    systemPrompt: "ch4_013 决战前奏：全员集结。",
    dialogues: [
      { speaker: "安柠", sprite: "serious", text: "我能断开一部分广播和假掌声，但管风琴核心只能你们进去解决。" },
      { speaker: "阿缇娅", sprite: "special", text: "奏者，给我命令。这一次，不是为了让音乐响起来。是为了让错误的演出停下。" }
    ],
    choices: [
      { text: "进入最终Boss战：卡戎。", nextScene: "ch4_014" }
    ]
  },
  "ch4_014": {
    chapter: 4,
    background: "#0e0407",
    backgroundImage: ASSETS.backgrounds.ch4CoreOrganChamber,
    description: "核心车厢，巨大黑色管风琴正下方。卡戎以巡演指挥家姿态举起指挥棒，整列列车的假掌声同时响起。",
    systemPrompt: "ch4_014 Boss战：卡戎。三段式终战将在下一阶段接入正式战斗系统。",
    dialogues: [
      { speaker: "卡戎", text: "让我看看，你们那套温柔但缓慢的办法，在真正的生死关头，到底扛不扛得住。" },
      { speaker: "系统", text: "Boss占位：P1巡演指挥家，P2管风琴共鸣体，P3卸下指挥棒的人。正式机制下一阶段接入。" }
    ],
    choices: [
      { text: "以暮弦双鸣贯穿管风琴共鸣体。", effects: [{ type: "event", value: "卡戎终战完成" }, { type: "change", key: "真相值", value: 15 }], nextScene: "ch4_015" },
      { text: "优先救下仍有反应的静默序列。", effects: [{ type: "event", value: "终战优先救人" }, { type: "change", key: "救赎值", value: 10 }, { type: "change", key: "真相值", value: 10 }], nextScene: "ch4_015" }
    ]
  },
  "ch4_015": {
    chapter: 4,
    background: "#1c080c",
    backgroundImage: ASSETS.backgrounds.ch4CoreOrganChamber,
    description: "不夜巡演号开始崩解。第一次，列车广播里没有假掌声，只有铁轨摩擦声和人们真正的呼吸。",
    systemPrompt: "ch4_015 崩解：不夜巡演号的终章。根据真相值决定卡戎处置。",
    dialogues: [
      { speaker: "系统", text: "结算占位：真相值>=70卡戎配合羁押，40-69沉默被捕，<40借机脱逃。正式分支文本下一阶段细化。" },
      { speaker: "安柠", sprite: "worried", text: "车要停了。真的要停了。" }
    ],
    choices: [
      { text: "带着还能移动的人撤离。", nextScene: "ch4_016" }
    ]
  },
  "ch4_016": {
    chapter: 4,
    background: "#24100c",
    backgroundImage: ASSETS.backgrounds.ch4MainKey,
    description: "清晨，黑漆列车停在旷野上。被救下的静默序列个体第一次不需要维持鼓掌姿态，只需要学会呼吸。",
    systemPrompt: "ch4_016 尾声：救回来的与没能救回来的。",
    dialogues: [
      { speaker: "零四", text: "……四？我是……第四个吗？那，前面三个，还在吗？" },
      { speaker: "弥洛", sprite: "worried", text: "我们会找。不是为了补完编号，是为了找回名字。" }
    ],
    choices: [
      { text: "记录零四的恢复状态。", effects: [{ type: "event", value: "零四恢复判定完成" }], nextScene: "ch4_017" }
    ]
  },
  "ch4_017": {
    chapter: 4,
    background: "#2b1810",
    backgroundImage: ASSETS.backgrounds.ch4MainKey,
    description: "残响之后。卡戎主线正式收束，但不夜巡演号留下的名字远比一场终战更多。",
    systemPrompt: "ch4_017 终章：残响之后。",
    dialogues: [
      { speaker: "安柠", sprite: "smile", text: "这么多没讲完的故事，够我们写好一阵子了。" },
      { speaker: "阿缇娅", sprite: "smile", text: "那就一个一个来。反正，我们有的是时间——不是吗？" },
      { speaker: "弥洛", sprite: "smile", text: "是啊。这次，我们真的有的是时间。" }
    ],
    choices: [
      { text: "前往章末：新的地平线。", effects: [{ type: "event", value: "chapter4_mainline_complete" }], nextScene: "ch4_018" }
    ]
  },
  "ch4_018": {
    chapter: 4,
    background: "#2f1c12",
    backgroundImage: ASSETS.backgrounds.ch4MainKey,
    description: "不夜巡演号最终停下的地方，没有观众，没有掌声。只有清晨的风，和一群第一次不需要表演、只需要喘口气的人。",
    systemPrompt: "ch4_018 章末：新的地平线。第四章完成后进入多线并行自由篇章阶段。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "default", text: "胜利大概没有那么完整。但至少，今天早上，这里没有一个人，是被逼着鼓掌的。" },
      { speaker: "系统", text: "【第四章 · 不夜终响 完】【追查卡戎主线收束】【后续进入多线并行自由篇章阶段】" }
    ],
    choices: [
      { text: "回到第四章章节入口。", effects: [{ type: "set", key: "chapterProgress", value: 4 }, { type: "event", value: "chapter4_complete" }], nextScene: "chapter4_start" },
      { text: "保存第四章完成记录。", effect: () => saveGame() }
    ]
  },
  "chapter4_event_E401": {
    chapter: 4,
    background: "#230b10",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "E401 · 观众席逐一辨认。绯红座椅间，静默序列像被摆成一场永不散场的谢幕。",
    systemPrompt: "第四章地图事件：观众席逐一辨认。目标：救赎值、编号线索、零四伏笔。",
    dialogues: [
      { speaker: "系统", text: "你需要从坐姿、残留节拍、手腕刻痕和假掌声延迟中辨认仍有反应的个体。" },
      { speaker: "弥洛", sprite: "serious", text: "别只看脸。看她们停顿的地方。真正还活着的反应，往往藏在错误里。" }
    ],
    choices: [
      { text: "记录所有仍有反应的编号。", effects: [{ type: "change", key: "救赎值", value: 8 }, { type: "event", value: "E401_audience_records_complete" }], nextScene: "ch4_003" },
      { text: "优先寻找零四。", effects: [{ type: "event", value: "E401_zero_four_priority" }], nextScene: "ch4_003" }
    ]
  },
  "chapter4_event_E402": {
    chapter: 4,
    background: "#250b10",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "E402 · 赤的车厢角落。她没有鼓掌，也没有逃跑，只是持续对着空座独奏。",
    systemPrompt: "第四章地图事件：赤。目标：补足独奏者支线与救赎值分歧。",
    dialogues: [
      { speaker: "赤", text: "他说会回来听完这一段。那我就不能停。" },
      { speaker: "阿缇娅", sprite: "worried", text: "有些等待不是忠诚，是伤口一直没有被允许结痂。" }
    ],
    choices: [
      { text: "坐在空座上听她奏完一小节。", effects: [{ type: "change", key: "救赎值", value: 6 }, { type: "event", value: "E402_listened_to_aka" }], nextScene: "ch4_005" },
      { text: "先不打断，留下安全标记。", effects: [{ type: "event", value: "E402_aka_safe_marker" }], nextScene: "ch4_005" }
    ]
  },
  "chapter4_event_E403": {
    chapter: 4,
    background: "#1e080c",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "E403 · 墨昭与芸苓的车厢。两名巡演派成员守着损坏的广播线，争吵比交火更早爆发。",
    systemPrompt: "第四章地图事件：墨昭与芸苓。目标：巡演派内部裂隙、真相值支线。",
    dialogues: [
      { speaker: "墨昭", text: "如果卡戎连我们也骗了，那我们这些年守的到底是什么？" },
      { speaker: "芸苓", text: "别在战斗前问这种问题。问了，手会慢。" }
    ],
    choices: [
      { text: "把白谱院档案残页交给她们。", effects: [{ type: "change", key: "真相值", value: 7 }, { type: "event", value: "E403_internal_split_seeded" }], nextScene: "ch4_008" },
      { text: "绕开争吵，先追核心车厢。", effects: [{ type: "event", value: "E403_bypassed" }], nextScene: "ch4_008" }
    ]
  },
  "chapter4_event_E404": {
    chapter: 4,
    background: "#18080d",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "E404 · 希声的沉默时刻。她看见观众席后，第一次没有立刻执行伊莱娜的命令。",
    systemPrompt: "第四章地图事件：希声。目标：征召律者的自我判断与伊莱娜隐藏好感。",
    dialogues: [
      { speaker: "希声", text: "命令没有覆盖这种情况。" },
      { speaker: "伊莱娜", text: "那就用眼睛判断。你不是文件夹里的附件，你是现场人员。" }
    ],
    choices: [
      { text: "承认希声有权判断现场。", effects: [{ type: "change", key: "伊莱娜隐藏好感值", value: 6 }, { type: "change", key: "真相值", value: 5 }, { type: "event", value: "E404_hisheng_judgment_acknowledged" }], nextScene: "ch4_009" },
      { text: "请她协助疏散仍有反应者。", effects: [{ type: "change", key: "救赎值", value: 6 }, { type: "event", value: "E404_hisheng_rescue_support" }], nextScene: "ch4_009" }
    ]
  },
  "chapter4_event_E405": {
    chapter: 4,
    background: "#18080d",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "E405 · 阿俞与溪吟的路边情报。列车外侧通讯窗口短暂接入，带来不夜巡演号的外围情报。",
    systemPrompt: "第四章地图事件：阿俞与溪吟。目标：补足外部支援、核心车厢弱点提示。",
    dialogues: [
      { speaker: "阿俞", text: "你们只有一次窗口。黑漆车厢不是装饰，它会把共鸣反弹回去。" },
      { speaker: "溪吟", text: "管风琴核心左侧第七组音管，延迟比其他地方高半拍。那是裂口。" }
    ],
    choices: [
      { text: "记录管风琴核心弱点。", effects: [{ type: "change", key: "真相值", value: 6 }, { type: "event", value: "E405_organ_weakpoint_known" }], nextScene: "ch4_011" },
      { text: "请求她们继续外部监听。", effects: [{ type: "event", value: "E405_external_monitoring" }], nextScene: "ch4_011" }
    ]
  },
  "chapter4_event_minigame_audience_identify": {
    chapter: 4,
    background: "#230b10",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "小游戏 · 观众席辨认挑战。根据节拍延迟、眼部残光和手腕刻痕判断谁仍保有反应。",
    systemPrompt: "小游戏占位：观众席辨认挑战。后续接入限时筛选 UI。",
    dialogues: [
      { speaker: "系统", text: "正式版本：玩家在多名静默序列中筛选仍可救援对象；误判会降低救赎值，连对会追加编号线索。" }
    ],
    choices: [
      { text: "完成一次模拟辨认。", effects: [{ type: "change", key: "救赎值", value: 5 }, { type: "event", value: "ch4_minigame_audience_identify_clear" }], nextScene: "ch4_003" }
    ]
  },
  "chapter4_event_minigame_resonance_wakeup": {
    chapter: 4,
    background: "#2b0d14",
    backgroundImage: ASSETS.backgrounds.ch4AudienceCar,
    description: "小游戏 · 节拍共鸣唤醒。不是强行命令，而是用极轻的节拍把零四从假掌声中带出来。",
    systemPrompt: "小游戏占位：节拍共鸣唤醒。后续接入轻点击/回退判定。",
    dialogues: [
      { speaker: "系统", text: "正式版本：玩家跟随微弱残响点击；连续过快会让零四重新锁死，稳定完成会提高救赎值。" }
    ],
    choices: [
      { text: "完成一次模拟唤醒。", effects: [{ type: "change", key: "救赎值", value: 8 }, { type: "event", value: "ch4_minigame_resonance_wakeup_clear" }], nextScene: "ch4_006" }
    ]
  },
  "chapter4_event_minigame_three_side_dispatch": {
    chapter: 4,
    background: "#1e080c",
    backgroundImage: ASSETS.backgrounds.ch4NightlessTrainCorridor,
    description: "小游戏 · 三方混战调度。主角队伍、巡演派残部、静默署稽查队同时挤在狭窄车厢。",
    systemPrompt: "小游戏占位：三方混战调度。后续接入队伍调度与误伤判定。",
    dialogues: [
      { speaker: "系统", text: "正式版本：玩家选择每回合优先目标；保护静默序列、说服巡演派、压制静默署会影响三条数值。" }
    ],
    choices: [
      { text: "完成一次模拟调度。", effects: [{ type: "change", key: "真相值", value: 5 }, { type: "change", key: "伊莱娜隐藏好感值", value: 3 }, { type: "event", value: "ch4_minigame_three_side_dispatch_clear" }], nextScene: "ch4_009" }
    ]
  },
  "chapter4_event_minigame_organ_dodge": {
    chapter: 4,
    background: "#0e0407",
    backgroundImage: ASSETS.backgrounds.ch4CoreOrganChamber,
    description: "小游戏 · 管风琴节奏躲避。黑色音管按拍落下冲击，只有半拍裂口能穿过。",
    systemPrompt: "小游戏占位：管风琴节奏躲避。后续接入节奏闪避 UI。",
    dialogues: [
      { speaker: "系统", text: "正式版本：玩家按管风琴音束节奏闪避；若提前获得 E405 情报，将显示第七组音管的半拍裂口。" }
    ],
    choices: [
      { text: "沿第七组音管裂口突入。", conditions: [{ operator: "includes", value: "E405_organ_weakpoint_known" }], effects: [{ type: "change", key: "真相值", value: 8 }, { type: "event", value: "ch4_minigame_organ_dodge_perfect" }], nextScene: "ch4_014" },
      { text: "凭反应穿过音束。", effects: [{ type: "change", key: "真相值", value: 4 }, { type: "event", value: "ch4_minigame_organ_dodge_clear" }], nextScene: "ch4_014" }
    ]
  },
  "relationship_mainline_sample": {
    isMapNode: true,
    background: "#111827",
    backgroundImage: ASSETS.backgrounds.ch0OldDinerShelter,
    description: "这是一段用于验证关系系统的主线范例。静默署封条盖住旧餐馆的收音机，阿缇娅站在门口，没有看你，也没有承认自己正在听里面漏出的半拍噪声。",
    systemPrompt: "调试范例：验证普通 choices 条件显示、隐藏台词记录、玩家 judgment 记录与关系变化。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "检测到异常声源。建议清除。" },
      { speaker: "【内心】", text: "她说的是建议，语气却像命令。你知道这不是缇雅，但这句话还是让你想起缇雅小时候抢走你乐谱的样子。", hidden: true, hiddenLineId: "sample_inline_inner_memory", conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 18 }] }
    ],
    choices: [
      {
        text: "「先别清除。让我听完这一拍。」",
        judgmentTarget: "阿缇娅",
        judgmentType: "体谅式",
        effects: [
          { type: "change", key: "阿缇娅共鸣", value: 7 },
          { type: "change", key: "阿缇娅信任", value: 2 },
          { type: "event", value: "sample_listened_before_order" }
        ],
        nextScene: "relationship_mainline_sample_after"
      },
      {
        text: "「按战斗逻辑处理，立刻清除。」",
        judgmentTarget: "阿缇娅",
        judgmentType: "行动优先式",
        effects: [
          { type: "change", key: "阿缇娅压力", value: 5 },
          { type: "change", key: "阿缇娅共鸣", value: -2 }
        ],
        nextScene: "relationship_mainline_sample_after"
      },
      {
        text: "「你能不能用缇雅的方式回答我？」",
        judgmentTarget: "阿缇娅",
        judgmentType: "强行追问",
        conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 25, label: "阿缇娅共鸣" }],
        effects: [
          { type: "change", key: "阿缇娅压力", value: 8 },
          { type: "change", key: "阿缇娅信任", value: -3 }
        ],
        nextScene: "relationship_mainline_sample_after"
      }
    ]
  },
  "relationship_mainline_sample_after": {
    background: "#17120f",
    backgroundImage: ASSETS.backgrounds.ch0OldDinerShelter,
    description: "收音机没有真的响起，只吐出一段被雨声压住的底噪。阿缇娅的眼下谱纹亮了一瞬，像有人把金色泪光藏进乐谱。",
    systemPrompt: "调试范例结算：若阿缇娅共鸣达到 25，应追加隐藏台词并写入 GameState.隐藏台词记录。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "异常声源已标记。奏者，你的判断被记录。" }
    ],
    hiddenDialogues: [
      {
        id: "sample_atya_not_tiya",
        conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 25 }],
        speaker: "阿缇娅",
        sprite: "eyeCloseup",
        text: "我拥有她的残响，但我不是你失去的那个人。"
      },
      {
        id: "sample_listened_before_order",
        conditions: [{ operator: "includes", value: "sample_listened_before_order" }],
        speaker: "【内心】",
        text: "你没有立刻下令。这个迟疑很小，却足够让关系系统写下一条新的 judgment。"
      }
    ],
    choices: [
      { text: "查看阿缇娅关系摘要", effect: () => showRelationshipDebugSummary("阿缇娅") },
      { text: "返回第一章入口", nextScene: "chapter1_start" }
    ]
  },
  "story_atya_01": {
    background: "#17120f",
    backgroundImage: ASSETS.backgrounds.ch0TheaterBackstageDress,
    conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 30, fallbackScene: "tea_break_hub" }],
    description: "旧剧场后台的演出裙仍挂在衣架上。阿缇娅站在它前面，眼下的金色谱纹没有亮，却像被某种看不见的线拉住。她不记得缇雅的人生，可胸口的疼痛比记忆更早作答。",
    systemPrompt: "第零章个人故事：阿缇娅 01「暮星的空白」。重点：她不是缇雅，但也不是空的。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "这件衣物引发异常记忆残响。" },
      { speaker: "阿缇娅", sprite: "eyeCloseup", text: "如果我不是她，那我为什么会因为她的东西疼？" },
      { speaker: "【内心】", text: "你忽然明白，比“她是不是缇雅”更残酷的问题，是她是否有权不成为缇雅。" }
    ],
    choices: [
      {
        text: "你不需要成为她。",
        effects: [
          { type: "change", key: "阿缇娅信任", value: 8 },
          { type: "change", key: "阿缇娅压力", value: -3 },
          { type: "event", value: "story_seen:atya_01" },
          { type: "event", value: "暮星重奏" }
        ],
        effect: () => finishPersonalStory()
      },
      {
        text: "可我还是会想她。",
        effects: [
          { type: "change", key: "阿缇娅共鸣", value: 3 },
          { type: "change", key: "阿缇娅压力", value: 5 },
          { type: "event", value: "story_seen:atya_01" }
        ],
        effect: () => finishPersonalStory()
      },
      {
        text: "我们一起找答案。",
        effects: [
          { type: "change", key: "阿缇娅信任", value: 5 },
          { type: "change", key: "阿缇娅共鸣", value: 3 },
          { type: "event", value: "story_seen:atya_01" },
          { type: "event", value: "暮星重奏" }
        ],
        effect: () => finishPersonalStory()
      }
    ]
  },
  "story_milo_01": {
    background: "#121820",
    backgroundImage: ASSETS.backgrounds.ch0ClocktowerMechanism,
    conditions: [{ key: "弥洛共鸣", operator: ">=", value: 30, fallbackScene: "tea_break_hub" }],
    description: "钟楼的慢半拍被弥洛按在墙里。低鸣沿着石缝往下沉，他却迟迟没有松手。你能听见那不是警戒，而是他在阻止某个旧错误重新响起。",
    systemPrompt: "第零章个人故事：弥洛 01「低音不说谎」。重点：他害怕再次被指挥，因为曾在同频过载中误伤前任奏者。",
    dialogues: [
      { speaker: "弥洛", text: "低音不该抢走主旋律。" },
      { speaker: "弥洛", text: "可有时，我比指挥者更早听见危险。这就是我最害怕的地方。" },
      { speaker: "【内心】", text: "他说得很短，可每个字都像压在胸腔里的钟摆。" }
    ],
    choices: [
      {
        text: "我会学习你的节奏。",
        effects: [
          { type: "change", key: "弥洛信任", value: 6 },
          { type: "change", key: "弥洛压力", value: -4 },
          { type: "event", value: "story_seen:milo_01" },
          { type: "event", value: "弥洛低音同步训练" }
        ],
        effect: () => finishPersonalStory()
      },
      {
        text: "战场上我需要你服从。",
        effects: [
          { type: "change", key: "弥洛信任", value: -2 },
          { type: "change", key: "弥洛压力", value: 5 },
          { type: "event", value: "story_seen:milo_01" }
        ],
        effect: () => finishPersonalStory()
      },
      {
        text: "害怕不是错误。",
        effects: [
          { type: "change", key: "弥洛共鸣", value: 5 },
          { type: "change", key: "弥洛信任", value: 2 },
          { type: "event", value: "story_seen:milo_01" }
        ],
        effect: () => finishPersonalStory()
      }
    ]
  },
  "story_huaixu_01": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    description: "调律台的余音把槐序的影子拉得很长。她没有讲完整故事，只把一枚旧舞票放在台面上。票根已经被水泡皱，背面写着一行无法辨认的乐句，像某个人在消失前留下的半个转身。",
    systemPrompt: "律者个人故事：第1章（共鸣30）——她是谁，她从哪里来。",
    dialogues: [
      { speaker: "槐序", sprite: "guarded", text: "我不是从封存箱里出生的。那只是他们给故事写的开头。" },
      { speaker: "【内心】", text: "她停在这里，没有解释票根是谁留下的。你能感觉到，继续追问会让她退回那只箱子里。" },
      { speaker: "槐序", sprite: "sarcastic", text: "别摆出那种表情。好奇可以，但别把好奇装成审讯。" }
    ],
    choices: [
      {
        text: "「我不会追问。等你愿意说。」",
        effects: [
          { type: "change", key: "槐序信任", value: 5 },
          { type: "event", value: "story_seen:huaixu_01" }
        ],
        effect: () => finishPersonalStory()
      },
      {
        text: "「那张票根和你苏醒有关？」",
        effects: [
          { type: "change", key: "槐序压力", value: 6 },
          { type: "change", key: "槐序共鸣", value: -2 },
          { type: "event", value: "story_seen:huaixu_01" }
        ],
        effect: () => finishPersonalStory()
      }
    ]
  },
  "story_huaixu_02": {
    background: "#17120f",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    conditions: [{ key: "槐序共鸣", operator: ">=", value: 60, fallbackScene: "chapter1_start" }],
    description: "旧剧场的后台没有观众席那么宽，墙上却贴满了早已褪色的舞序表。槐序站在镜前，镜面裂纹把她分成三段：一个准备起舞，一个已经退场，一个还停在失谐发生前的那一拍。",
    systemPrompt: "律者个人故事：第2章（共鸣60）——她为什么是现在这个样子。",
    dialogues: [
      { speaker: "槐序", sprite: "guarded", text: "你想知道为什么没人愿意和我换位。" },
      { speaker: "槐序", sprite: "sarcastic", text: "答案不漂亮。他们不是跟不上我，是我太相信下一拍一定会有人接住。" },
      { speaker: "【内心】", text: "她说得很轻，像怕把某个名字从镜子里吵醒。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ key: "槐序信任", operator: ">=", value: 60 }],
        speaker: "槐序",
        sprite: "guarded",
        text: "那天我回头看了一眼。就一眼。然后整支舞都乱了。"
      }
    ],
    choices: [
      {
        text: "「你不是唯一该回头的人。」",
        effects: [
          { type: "change", key: "槐序共鸣", value: 5 },
          { type: "change", key: "槐序信任", value: 2 },
          { type: "event", value: "story_seen:huaixu_02" }
        ],
        effect: () => finishPersonalStory()
      },
      {
        text: "「如果重来，你会停下吗？」",
        effects: [
          { type: "change", key: "槐序共鸣", value: 3 },
          { type: "change", key: "槐序压力", value: 4 },
          { type: "event", value: "story_seen:huaixu_02" }
        ],
        effect: () => finishPersonalStory()
      }
    ]
  },
  "story_huaixu_03": {
    background: "#120f14",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    conditions: [{ key: "槐序共鸣", operator: ">=", value: 90, fallbackScene: "chapter1_start" }],
    description: "舞台灯没有亮，台面却出现一圈浅金色的旧痕。槐序把手放在痕迹中央，三拍从地板下方传来：轻、重、轻。那不是回忆，像世界第一次学会把错误伪装成旋律。",
    systemPrompt: "律者个人故事：第3章（共鸣90）——她和世界失谐的深层关联。此章只揭示关联，不给结论。",
    dialogues: [
      { speaker: "槐序", sprite: "dissonance", text: "第一次失谐不是海潮，也不是灾难宣告。它是一支没有结束的舞。" },
      { speaker: "槐序", sprite: "guarded", text: "我听见它的时候，以为那是有人在邀请我。后来我才明白，有些邀请只是世界裂开时发出的回声。" },
      { speaker: "【内心】", text: "她没有说自己是不是源头。也没有否认。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ key: "槐序信任", operator: ">=", value: 80 }],
        speaker: "槐序",
        sprite: "sarcastic",
        text: "如果最后必须有人和那支曲子跳完，我希望你至少别替我决定舞步。"
      }
    ],
    choices: [
      {
        text: "「我会先问你，而不是替你决定。」",
        effects: [
          { type: "change", key: "槐序信任", value: 5 },
          { type: "change", key: "槐序共鸣", value: 5 },
          { type: "event", value: "story_seen:huaixu_03" },
          { type: "event", value: "ending_flag:huaixu_dissonance_waltz" }
        ],
        effect: () => finishPersonalStory()
      },
      {
        text: "「如果它会伤人，我会阻止它。」",
        effects: [
          { type: "change", key: "槐序共鸣", value: 2 },
          { type: "change", key: "槐序压力", value: 5 },
          { type: "event", value: "story_seen:huaixu_03" },
          { type: "event", value: "ending_flag:contain_huaixu_waltz" }
        ],
        effect: () => finishPersonalStory()
      }
    ]
  },
  /* ═══ 茶歇场景 ═══ */
  "tea_break_hub": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.teaLounge,
    description: "调律台短暂亮起，铜针在灰弦公路的风里摇晃。同行的律者各自占据一个不远不近的位置：有人检查护具，有人听风，有人把沉默当成临时的墙。",
    systemPrompt: "茶歇入口：只能和当前同行的律者交流。对话变化每次最多影响两个关系变量。",
    dialogues: [
      { speaker: "【内心】", text: "茶歇不是奖励结算，而是旅途中还没被失谐夺走的一点空隙。你可以选择先走向谁。" }
    ],
    buildChoices: () => buildTeaBreakHubChoices()
  },
  "tea_break_atya": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.ch0OldDinerShelter,
    description: "旧餐馆的后门半开，雨水顺着铁皮棚滴落。阿缇娅站在一盏坏掉的壁灯下，眼下金色谱纹很淡，像刚被擦去的泪线。",
    systemPrompt: "茶歇：选择一个话题与阿缇娅交流。她不是缇雅，回答必须保持身份边界。",
    dialogues: [
      { speaker: "阿缇娅", sprite: "daily", text: "奏者，若这是维护对话，请说明目标。若不是，我需要学习你的意图。" }
    ],
    hiddenDialogues: [
      {
        id: "atya_teabreak_identity_boundary",
        conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 55 }],
        speaker: "阿缇娅",
        sprite: "eyeCloseup",
        text: "我拥有她的残响，但我不是你失去的那个人。"
      }
    ],
    choices: [
      { text: "随便聊聊她现在能听见什么", effect: () => handleAITeaBreak("阿缇娅", "casual") },
      { text: "关心她的状态，不提缇雅", effect: () => handleAITeaBreak("阿缇娅", "care") },
      { text: "强行追问缇雅的记忆", effect: () => handleAITeaBreak("阿缇娅", "force") },
      { text: "询问下一段路的静默残留", effect: () => handleAITeaBreak("阿缇娅", "strategy") },
      { text: "返回茶歇入口", nextScene: "tea_break_hub" }
    ]
  },
  "tea_break_milo": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.ch0ClocktowerMechanism,
    description: "钟楼底层的机械还在慢慢转动，弥洛把手按在墙上，像在听一段只有地基知道的低音。",
    systemPrompt: "茶歇：选择一个话题与弥洛交流。他重视撤离路线、防线稳定和低频风险。",
    dialogues: [
      { speaker: "弥洛", sprite: "default", text: "这里声音会绕回来。说话短一点，比较不容易被它带偏。" }
    ],
    hiddenDialogues: [
      {
        id: "milo_teabreak_low_hum",
        conditions: [{ key: "弥洛共鸣", operator: ">=", value: 55 }],
        speaker: "弥洛",
        sprite: "default",
        text: "低音不是不说话，它只是先替别人撑住地面。"
      }
    ],
    choices: [
      { text: "随便聊聊他听见的低频", effect: () => handleAITeaBreak("弥洛", "casual") },
      { text: "关心他是不是一直在硬撑", effect: () => handleAITeaBreak("弥洛", "care") },
      { text: "要求他继续当防线", effect: () => handleAITeaBreak("弥洛", "force") },
      { text: "询问撤离和压场策略", effect: () => handleAITeaBreak("弥洛", "strategy") },
      { text: "返回茶歇入口", nextScene: "tea_break_hub" }
    ]
  },
  "tea_break_huaixu": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.teaLounge,
    description: "调律台的铜针缓慢归零。车外的风把消音布吹得很低，像有人在轻轻按住世界的喉咙。槐序坐在离你不远的台阶上，没有离开，也没有主动靠近。",
    systemPrompt: "茶歇：选择一个话题与槐序交流。她的回应会根据当前信任、共鸣与压力变化。",
    dialogues: [
      { speaker: "槐序", sprite: "guarded", text: "如果你只是想确认我还能不能战斗，可以直接问。绕弯反而更像白谱院。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "主角形象:女性奏者" }],
        speaker: "槐序",
        sprite: "guarded",
        text: "你的声部很稳。别急着高兴，稳定也可能是一种把自己关起来的方式。"
      },
      {
        conditions: [{ operator: "includes", value: "主角形象:未标注奏者" }],
        speaker: "槐序",
        sprite: "sarcastic",
        text: "自由声部？听起来像白谱院最讨厌写进表格里的东西。不错。"
      },
      {
        conditions: [{ key: "槐序压力", operator: ">", value: 70 }],
        speaker: "槐序",
        sprite: "dissonance",
        text: "今天别问舞票。也别问我为什么记得那支曲子。"
      },
      {
        conditions: [{ key: "槐序共鸣", operator: ">", value: 70 }],
        speaker: "槐序",
        sprite: "sarcastic",
        text: "如果是你问，我可以晚一点再躲回玩笑里。只晚一点。"
      }
    ],
    choices: [
      {
        text: "聊路上的纸灯",
        effect: () => handleAITeaBreak("槐序", "casual")
      },
      {
        text: "先问她现在还撑不撑得住",
        effect: () => handleAITeaBreak("槐序", "care")
      },
      {
        text: "追问封存箱里的记忆",
        effect: () => handleAITeaBreak("槐序", "force")
      },
      {
        text: "问她对灰弦公路的感觉",
        effect: () => handleAITeaBreak("槐序", "strategy")
      }
    ]
  },
  "tea_break_luowen": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.teaLounge,
    description: "洛温站在调律台外侧，背对光源检查护具扣带。每一次金属扣合都像低音落地，沉稳，却也沉得太久。你走近时，他没有回头，只把身侧的位置空出来。",
    systemPrompt: "茶歇：选择一个话题与洛温交流。他重视稳定、代价和队伍安全。",
    dialogues: [
      { speaker: "洛温", sprite: "observing", text: "如果是战斗安排，直接说。如果不是，也可以短一点。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "主角形象:男性奏者" }],
        speaker: "洛温",
        sprite: "observing",
        text: "你的次中音很容易压到低音前面。战斗时，我会听你的指挥，但你也要听见我什么时候不能退。"
      },
      {
        conditions: [{ operator: "includes", value: "主角形象:未标注奏者" }],
        speaker: "洛温",
        sprite: "guardian",
        text: "自由声部不是没有边界。只是边界需要你每一次重新确认。"
      },
      {
        conditions: [{ key: "洛温压力", operator: ">", value: 70 }],
        speaker: "洛温",
        sprite: "burdened",
        text: "今天别让我解释为什么还站着。我不想把这件事说成习惯。"
      },
      {
        conditions: [{ key: "洛温共鸣", operator: ">", value: 70 }],
        speaker: "洛温",
        sprite: "guardian",
        text: "固定低音不是不会变。只是变的时候，整支曲子都会知道。"
      }
    ],
    choices: [
      {
        text: "问他护具有没有问题",
        effect: () => handleAITeaBreak("洛温", "casual")
      },
      {
        text: "主动让他下一场少承担一点",
        effect: () => handleAITeaBreak("洛温", "care")
      },
      {
        text: "要求他继续顶在最前面",
        effect: () => handleAITeaBreak("洛温", "force")
      },
      {
        text: "询问他对下一段路的判断",
        effect: () => handleAITeaBreak("洛温", "strategy")
      }
    ]
  },
  "tea_break_yifubai": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.teaLounge,
    description: "伊芙白把口琴转在指间，吹出一段故意跑偏的小调。她笑得很轻，像在告诉你一切都还好，又像在等你发现这句话本身就是个坏笑话。",
    systemPrompt: "茶歇：选择一个话题与伊芙白交流。她常用玩笑试探你是否只接受表面解释。",
    dialogues: [
      { speaker: "伊芙白", sprite: "falseCheer", text: "哟，奏者来查岗？先说好，我今天的状态报告押韵得很糟。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "主角形象:未标注奏者" }],
        speaker: "伊芙白",
        sprite: "insight",
        text: "空白胸针很适合你。别人看不懂时，就会先暴露他们自己想看见什么。"
      },
      {
        conditions: [{ operator: "includes", value: "主角形象:男性奏者" }],
        speaker: "伊芙白",
        sprite: "falseCheer",
        text: "次中音先生，别把所有沉默都当成等你发令。有些沉默是在等你先闭嘴。"
      },
      {
        conditions: [{ key: "伊芙白压力", operator: ">", value: 70 }],
        speaker: "伊芙白",
        sprite: "tired",
        text: "笑话先欠着。欠账不丢人，硬笑才丢人。"
      },
      {
        conditions: [{ key: "伊芙白共鸣", operator: ">", value: 70 }],
        speaker: "伊芙白",
        sprite: "insight",
        text: "你要是真想听实话，先别急着相信我。"
      }
    ],
    choices: [
      {
        text: "陪她聊一段不靠谱的路标",
        effect: () => handleAITeaBreak("伊芙白", "casual")
      },
      {
        text: "不拆穿她的玩笑，只问她累不累",
        effect: () => handleAITeaBreak("伊芙白", "care")
      },
      {
        text: "要求她解释刚才为什么隐瞒判断",
        effect: () => handleAITeaBreak("伊芙白", "force")
      },
      {
        text: "问她哪条路最像假的安全",
        effect: () => handleAITeaBreak("伊芙白", "strategy")
      }
    ]
  },
  "tea_break_mingxian": {
    background: "#101820",
    backgroundImage: ASSETS.backgrounds.teaLounge,
    description: "明弦站在断柱阴影里，机械臂的细小关节声被风沙盖住一半。她没有坐下，只把指挥棒抵在掌心，像随时准备把一场闲谈改写成审讯。",
    systemPrompt: "茶歇：选择一个话题与明弦交流。她强势、直接，重视承担后果与立场清晰。",
    dialogues: [
      { speaker: "明弦", text: "要聊就快一点。长廊不会因为你想培养关系就放慢风沙。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ key: "明弦压力", operator: ">", value: 70 }],
        speaker: "明弦",
        text: "今天别问机械臂。它比我诚实，但没必要替我回答。"
      },
      {
        conditions: [{ key: "明弦共鸣", operator: ">", value: 70 }],
        speaker: "明弦",
        text: "如果命运真会敲门，那我宁愿在它抬手之前先开门。至少那一瞬间，主动权还像是我的。"
      }
    ],
    choices: [
      {
        text: "问她为什么愿意跟议会同行",
        effect: () => handleAITeaBreak("明弦", "casual")
      },
      {
        text: "注意到她机械臂的异常，但不当众点破",
        effect: () => handleAITeaBreak("明弦", "care")
      },
      {
        text: "要求她服从白谱院的现场判断",
        effect: () => handleAITeaBreak("明弦", "force")
      },
      {
        text: "问她怎么看静默核心的风险",
        effect: () => handleAITeaBreak("明弦", "strategy")
      }
    ]
  },
  "chapter1_prep": {
    background: "#111827",
    backgroundImage: ASSETS.backgrounds.qixianTuningRoom,
    description: "旧版整备节点已归入第三章旧案合辑。这里不再把玩家送进旧第一章，只作为归档跳板保留。",
    systemPrompt: "旧整备节点归档：新第一章重做期间禁止直接接入旧灰弦公路结构。",
    dialogues: [
      { speaker: "槐序", sprite: "sarcastic", text: "多带一点粮药也好。世界不会因为我们准备充分就仁慈，但至少会少一个借口。" }
    ],
    choices: [
      { text: "保存进度", effect: () => saveGame() },
      { text: "返回新第一章占位入口", nextScene: "chapter1_start" },
      { text: "进入第三章旧案合辑", nextScene: "chapter3_archive_start" }
    ]
  },
  /* ═══ 第一章场景 (Allegro·启奏) ═══ */
  "ch1_001": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "晨钟广场的地砖五线谱图案在朝阳下泛着微光。今天本该是“和声晨礼”——全院学员合唱开启新一天，但你站在调律台前，注意到钟楼的钟声比往常慢了半拍，像是有人在巨大的怀表里悄悄拨错了一根指针。巡礼官玛伦站在不远处，白金礼服的衣摆纹丝不动，但她的目光一直停留在钟楼方向。",
    systemPrompt: "第一乐章·启奏：明亮、华丽中带一丝不安。白金歌剧版主线已启用。",
    dialogues: [
      { speaker: "玛伦", text: "候补校律者，今天的合唱排练，你听出问题了吗？" },
      { speaker: "【内心】", text: "不只是慢了半拍。是有什么东西，正在学着我们的节奏。" },
      { speaker: "祁恩", text: "议会那边已经收到三份同样的报告。这不是巧合。" }
    ],
    choices: [
      {
        text: "「我听出来了，从钟楼开始的。」",
        effects: [
          { type: "change", key: "白谱院声望值", value: 3 },
          { type: "event", value: "ch1_001_choiceA" }
        ],
        nextScene: "ch1_002"
      },
      {
        text: "「也许只是钟楼的机械需要保养？」",
        effects: [{ type: "event", value: "ch1_001_choiceB" }],
        nextScene: "ch1_002"
      },
      {
        text: "「这种事，议会知道该怎么处理吧。」",
        effects: [
          { type: "change", key: "回声议会声望值", value: -2 },
          { type: "event", value: "ch1_001_choiceC" }
        ],
        nextScene: "ch1_002"
      }
    ]
  },
  "ch1_002": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.qixianTuningRoom,
    description: "地下调律室比广场更安静，安静到你能听见自己的心跳。三具封存箱沿墙排列，像三具镶金的棺椁，又像三件被收起的乐器。中间那具的表面浮现出极淡的裂纹光痕——和着某种你听不见、却能感觉到的旋律，一明一暗。",
    dialogues: [
      { speaker: "玛伦", text: "这具封存箱里，是我们记录中最古老的“律者”之一。按规定，未经议会批准不能擅自唤醒。" },
      { speaker: "【内心】", text: "可是它在自己醒——不是被谁叫醒的。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "ch1_001_choiceA" }],
        speaker: "玛伦",
        text: "……如果真的失控，你需要做好心理准备。"
      }
    ],
    choices: [
      {
        text: "「我能听见它。让我试试稳住它。」",
        effects: [{ type: "event", value: "ch1_stabilize_branch" }],
        nextScene: "ch1_003_stabilize"
      },
      {
        text: "「按规定，我们应该先上报。」",
        effects: [
          { type: "change", key: "白谱院声望值", value: 2 },
          { type: "event", value: "ch1_delay_report" }
        ],
        nextScene: "ch1_003_delay"
      },
      {
        text: "「如果它要醒，谁都拦不住，不如顺其自然。」",
        effects: [{ type: "event", value: "ch1_wild_awakening" }],
        nextScene: "ch1_003_wild"
      }
    ]
  },
  "ch1_003_delay": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.qixianTuningRoom,
    description: "上报流程开始转动：印章、签名、复核、等待。可封存箱没有等待。裂纹从箱体中央向四周蔓延，金色光痕像一支被迫延迟的乐句，终于找到了自己的重拍。",
    dialogues: [
      { speaker: "玛伦", text: "流程没有错。但音乐不会永远停在流程外。" },
      { speaker: "【内心】", text: "你意识到，延误没有阻止觉醒，只是让它变得更孤独。" }
    ],
    choices: [
      {
        text: "靠近封存箱，尝试补上迟到的第一拍",
        effects: [{ type: "change", key: "槐序压力", value: 3 }],
        nextScene: "ch1_003_stabilize"
      }
    ]
  },
  "ch1_003_wild": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.qixianTuningPlatform,
    description: "封存箱没有展开，而是像被看不见的舞步从内部推开。音叉装饰柱同时失准，金色光晕在调律室里旋转过快，几乎让每个人都误以为自己听见了一场不存在的舞会。",
    dialogues: [
      { speaker: "槐序", sprite: "dissonance", text: "……谁说可以顺其自然？自然也会走调。" },
      { speaker: "【内心】", text: "她醒了。但这一次，她醒在一段过快的重拍里。" }
    ],
    choices: [
      {
        text: "稳住调律台，承认是你判断得太轻",
        effects: [
          { type: "change", key: "槐序压力", value: 5 },
          { type: "change", key: "世界失谐度", value: 2 }
        ],
        nextScene: "ch1_004"
      }
    ]
  },
  "ch1_003_stabilize": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.qixianTuningPlatform,
    description: "封存箱如花瓣般展开，里面没有沉睡的躯体，而是一团正在重新凝聚轮廓的、银灰与琥珀色交织的光。光团逐渐收束成一个少女的身形——她睁眼的瞬间，整间调律室的音叉装饰柱同时发出极轻的嗡鸣，像是在向她致意。她落地的姿态像完成了一个旋转动作的尾声，裙摆还在余势中轻轻晃动。",
    dialogues: [
      { speaker: "槐序", sprite: "guarded", text: "……这首曲子还没结束。是谁在中途叫停了它？" },
      { speaker: "槐序", sprite: "guarded", text: "是你吗？还是说，你只是刚好站在离我最近的位置？" }
    ],
    choices: [
      {
        text: "「是我把你叫醒的。我需要你的帮助。」",
        effects: [{ type: "change", key: "槐序信任", value: 5 }],
        nextScene: "ch1_004"
      },
      {
        text: "「老实说，我不确定。但我很高兴你醒了。」",
        effects: [
          { type: "change", key: "槐序信任", value: 3 },
          { type: "change", key: "槐序共鸣", value: 3 }
        ],
        nextScene: "ch1_004"
      },
      {
        text: "「这重要吗？你已经醒了。」",
        effects: [{ type: "change", key: "槐序信任", value: -2 }],
        nextScene: "ch1_004"
      }
    ]
  },
  "ch1_004": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianTuningRoom,
    description: "回廊尽头传来沉稳的脚步声，规整得像节拍器——每一步间隔完全一致。洛温的身影出现在光斑边缘，宝石蓝大衣的衣摆垂直如尺规画出的直线。",
    dialogues: [
      { speaker: "洛温", sprite: "observing", text: "调律室的警报响了。看来你已经处理好了。" },
      { speaker: "洛温", sprite: "guardian", text: "圆舞曲的律者。久仰。" },
      { speaker: "槐序", sprite: "sarcastic", text: "低音墙。没想到这次轮到你来查岗。" },
      { speaker: "【内心】", text: "他们认识？还是说，所有古老的律者本就彼此知晓？" }
    ],
    choices: [
      {
        text: "「你们认识？」",
        effects: [{ type: "change", key: "世界观信息", value: 1 }],
        nextScene: "ch1_004_worldinfo"
      },
      {
        text: "「我们该出发了，时间紧迫。」",
        effects: [{ type: "change", key: "洛温信任", value: 3 }],
        nextScene: "ch1_005"
      }
    ]
  },
  "ch1_004_worldinfo": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianTuningRoom,
    description: "槐序与洛温之间的沉默很短，却像两段旧谱在同一页上短暂重叠。",
    dialogues: [
      { speaker: "洛温", sprite: "observing", text: "古老律者之间未必相熟，但我们都记得彼此留下过什么声部。" },
      { speaker: "槐序", sprite: "sarcastic", text: "他说得像点名册。实际上更像旧伤疤互相认得形状。" }
    ],
    choices: [
      { text: "前往茶歇厅", nextScene: "ch1_005" }
    ]
  },
  "ch1_005": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.teaLounge,
    description: "这是你第一次走进茶歇厅——不大，但每一处都精致：瓷器茶具印着细小的音符纹样，墙上挂着历代律者的素描肖像，阳光透过蕾丝窗帘在地面织出柔和的光网。",
    dialogues: [
      { speaker: "系统", text: "〔茶歇空间已解锁〕你可以在剧情间隙与队伍中的律者交流，了解她们，也让她们了解你。" }
    ],
    choices: [
      {
        text: "现在就去找槐序聊聊",
        effects: [{ type: "set", key: "茶歇返回场景", value: "ch1_006" }],
        nextScene: "tea_break_huaixu"
      },
      {
        text: "先去找洛温",
        effects: [{ type: "set", key: "茶歇返回场景", value: "ch1_006" }],
        nextScene: "tea_break_luowen"
      },
      { text: "暂时不打扰，先看看城邦的情况", nextScene: "ch1_006" }
    ]
  },
  "ch1_006": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "一群穿着浅蓝合唱服的学员围在晨钟广场一角，神情焦虑。为首的女孩看见你的校律者徽章，立刻迎上来。",
    systemPrompt: "地图事件：合唱团的求助。",
    dialogues: [
      { speaker: "合唱团长", text: "候补校律者！我们的领唱……她的声音突然走调了，而且根本停不下来，像是被什么东西卡住了。" }
    ],
    choices: [
      { text: "立刻去查看领唱的情况", nextScene: "ch1_006_minigame" },
      {
        text: "先问清楚是什么时候开始的",
        effects: [
          { type: "event", value: "线索:钟楼异响之后" },
          { type: "change", key: "世界观信息", value: 1 }
        ],
        nextScene: "ch1_006_b"
      },
      {
        text: "这不是校律者的职责范围，建议她们找医师",
        effects: [
          { type: "change", key: "白谱院声望值", value: -2 },
          { type: "event", value: "拒绝合唱团" }
        ],
        nextScene: "ch1_007"
      }
    ]
  },
  "ch1_006_b": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "合唱团长努力回忆每一个细节。她说，领唱第一次失控，正好是在钟楼慢半拍之后。那一瞬间，所有人都以为只是自己听错了。",
    dialogues: [
      { speaker: "合唱团长", text: "如果那时候有人说话，也许我们就不会继续排练下去了。" },
      { speaker: "槐序", sprite: "guarded", text: "继续吧。让错误完整暴露，至少比把它藏进礼仪里好。" }
    ],
    choices: [
      { text: "开始音色辨识", nextScene: "ch1_006_minigame" }
    ]
  },
  "ch1_006_minigame": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "领唱女孩的声音确实在持续，但每隔几秒会出现一个“不该存在”的泛音，像是有另一个声部悄悄叠加了进来。",
    systemPrompt: "迷你游戏：音色辨识。选择你认为真正异常的位置。",
    dialogues: [
      { speaker: "【内心】", text: "你把注意力压进尾音里。错误不在最响处，而在被截断的最后一瞬。" }
    ],
    choices: [
      {
        text: "她的喉咙在正常发声，但胸腔共鸣的位置不对",
        effects: [{ type: "event", value: "未能帮助合唱团" }],
        nextScene: "ch1_006_minigame_fail"
      },
      {
        text: "声音的尾音总是被截断，像是被什么打断",
        effects: [
          { type: "change", key: "残留音核", value: 1 },
          { type: "change", key: "白谱院声望值", value: 4 },
          { type: "event", value: "帮助合唱团" },
          { type: "event", value: "支线:合唱团之谜" }
        ],
        nextScene: "ch1_006_minigame_success"
      },
      {
        text: "音高在缓慢爬升，超出了她的正常音域",
        effects: [{ type: "event", value: "未能帮助合唱团" }],
        nextScene: "ch1_006_minigame_fail"
      }
    ]
  },
  "ch1_006_minigame_success": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "你准确指出问题所在，领唱的额外泛音被你的调律手势打断。她瘫坐在地，喘着气恢复正常。掌心里残留下一枚很小的音核，像没有唱完的尾音。",
    dialogues: [
      { speaker: "合唱团长", text: "谢谢你。刚才那一瞬间，我以为她会把自己唱碎。" }
    ],
    choices: [
      { text: "前往瞭望塔", nextScene: "ch1_007" }
    ]
  },
  "ch1_006_minigame_fail": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "你的判断没有命中真正的异常。领唱的状况没有改善，但也没有恶化。合唱团长神情担忧地把她扶走，广场重新安静下来，安静得有些过分。",
    dialogues: [
      { speaker: "槐序", sprite: "guarded", text: "错了也要记住自己听见过什么。下一次，错误会换一种礼貌的方式出现。" }
    ],
    choices: [
      { text: "前往瞭望塔", nextScene: "ch1_007" }
    ]
  },
  "ch1_007": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.graystringBattle,
    description: "瞭望塔的警铃响起——一群音乐盒飞蛾涌向城邦边界，翅膀振动的频率刺耳地比正常快了半拍。金色防御结界微微闪烁，像一盏即将错拍的舞台灯。",
    dialogues: [
      { speaker: "槐序", sprite: "battle", text: "看，它们想加入一场没有邀请它们的舞会。" },
      { speaker: "洛温", sprite: "guardian", text: "目标：清场，别让它们靠近民居区。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "__dissonance_risk_luowen__" }],
        speaker: "系统",
        text: "提示：洛温的信任度尚浅，指挥配合可能出现失调。"
      }
    ],
    choices: [
      {
        text: "「分组应对，槐序处理空中目标，洛温防守地面。」",
        effect: () => startBattle("moth_swarm", { selectedMusicarts: ["槐序", "洛温"] })
      },
      {
        text: "「先听听你们的建议。」",
        effects: [
          { type: "change", key: "槐序信任", value: 1 },
          { type: "change", key: "洛温信任", value: 1 }
        ],
        effect: () => startBattle("moth_swarm", { selectedMusicarts: ["槐序", "洛温"] })
      }
    ]
  },
  "ch1_008_win": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.graystringBattle,
    description: "瞭望塔下，金色防御结界重新稳定地闪烁。音乐盒飞蛾碎成无字乐谱般的光屑，在晨风里慢慢散去。",
    dialogues: [
      { speaker: "槐序", sprite: "sarcastic", text: "干净利落。不过我留了一手没用——等你真正信任我的时候，我再让你看看。" },
      { speaker: "【内心】", text: "她说的，是不是就是传说中的“独演”？" },
      { speaker: "洛温", sprite: "guardian", text: "嗯。她说的是真的。我也是。" },
      { speaker: "系统", text: "〔独演〕是律者在共鸣值满载或特定剧情节点触发的极限演出。你与她们的信任越深，能见到的“独演”就越完整。" }
    ],
    choices: [
      {
        text: "「我很期待。」",
        effects: [{ type: "change", key: "槐序共鸣", value: 3 }],
        nextScene: "ch1_009"
      },
      {
        text: "「希望到时候不会让我后悔。」",
        effects: [{ type: "change", key: "槐序信任", value: 2 }],
        nextScene: "ch1_009"
      }
    ]
  },
  "ch1_008_lose": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.graystringBattle,
    description: "结界被音乐盒飞蛾啃出一段不完整的缺口。它们没有真正冲进民居区，但瞭望塔的金色灯光已经暗下一格。",
    dialogues: [
      { speaker: "洛温", sprite: "burdened", text: "结界受损。还能补，但记录不会好看。" },
      { speaker: "槐序", sprite: "guarded", text: "第一次出战就知道代价，也算一种开场。" }
    ],
    choices: [
      { text: "收拢队伍，返回晨钟广场", nextScene: "ch1_009" }
    ]
  },
  "ch1_009": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "你转身时，听见一个不在节拍上的鼓掌声——慢半拍，又快半拍，怎么数都对不上。一个蓝黑卷发的身影倚在廊柱边，正用一种看好戏的笑容看着你们。",
    dialogues: [
      { speaker: "伊芙白", sprite: "falseCheer", text: "哎呀，两位贵族小姐的双人舞，可惜少了点意外惊喜。" },
      { speaker: "槐序", sprite: "guarded", text: "……又是你。" },
      { speaker: "伊芙白", sprite: "insight", text: "别这表情嘛。我可是专程来看新校律者的——毕竟你们白谱院的人，从来不会邀请“即兴”参加正式演出。" }
    ],
    choices: [
      {
        text: "「介意加入我们吗？」",
        effects: [
          { type: "change", key: "伊芙白信任", value: 5 },
          { type: "event", value: "伊芙白加入队伍" },
          { type: "event", value: "huaixu_yifubai_joined" }
        ],
        nextScene: "ch1_010"
      },
      {
        text: "「你也是律者？」",
        effects: [
          { type: "change", key: "伊芙白共鸣", value: 2 },
          { type: "event", value: "伊芙白加入队伍" },
          { type: "event", value: "huaixu_yifubai_joined" }
        ],
        nextScene: "ch1_010"
      },
      {
        text: "看向玛伦，等她表态",
        effects: [
          { type: "event", value: "玛伦说明伊芙白身份" },
          { type: "event", value: "伊芙白加入队伍" },
          { type: "event", value: "huaixu_yifubai_joined" },
          { type: "change", key: "世界观信息", value: 1 }
        ],
        nextScene: "ch1_010"
      }
    ]
  },
  "ch1_010": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "三位律者站在你身边——优雅的、沉稳的、不合常规的——像是一支临时拼凑、却莫名和谐的三重奏。钟楼的钟声再次响起，这一次，准确地落在了正确的拍子上。",
    dialogues: [
      { speaker: "玛伦", text: "议会刚刚下达指令：灰弦长廊出现大规模失谐反应，需要一支队伍前去调查。候补校律者，这是你的第一次远征。" },
      { speaker: "【内心】", text: "舞台的帷幕，才刚刚拉开。" },
      { speaker: "系统", text: "〔第一乐章完〕第二乐章·离响 即将开始。" }
    ],
    choices: [
      { text: "立即出发", nextScene: "ch2_001" },
      {
        text: "先在茶歇厅准备一下",
        effects: [{ type: "set", key: "茶歇返回场景", value: "ch2_001" }],
        nextScene: "tea_break_hub"
      }
    ]
  },
  /* ═══ 第二章场景 (离响) ═══ */
  "ch2_001": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.graystringDay,
    description: "从这里望去，灰弦长廊像一条被遗弃的项链，断裂的廊柱是脱落的珍珠，散落在阴沉的旷野上。你的队伍在城邦边界检查站前列队，等待最后的出发许可。",
    systemPrompt: "第二乐章·离响：庄重中带着不安的行进感。华美正在被风沙一点点侵蚀。",
    dialogues: [
      { speaker: "玛伦", text: "记住，长廊深处的失谐反应等级未知。如果情况超出控制，立刻折返，不要逞强。" },
      { speaker: "槐序", sprite: "sarcastic", text: "她总是这么说。但我们从没真的“立刻折返”过，不是吗？" },
      { speaker: "洛温", sprite: "observing", text: "这次不一样。议会的人也会同行。" }
    ],
    choices: [
      { text: "「议会的人？」", nextScene: "ch2_002" },
      {
        text: "「无所谓，我们专注完成任务就好。」",
        effects: [{ type: "change", key: "洛温信任", value: 2 }],
        nextScene: "ch2_002"
      }
    ]
  },
  "ch2_002": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.graystringDusk,
    description: "灰弦长廊入口，断裂的大理石拱门下站着一道猩红色的身影。猩红与纯白交织的礼服式战甲贴合她的站姿，一侧裸露着精密的机械臂线条，像她早就料定你们会来。",
    dialogues: [
      { speaker: "明弦", text: "白谱院的候补校律者。还有……灰圆舞和低音墙，议会终于舍得派两位老资历出马了。" },
      { speaker: "槐序", sprite: "guarded", text: "赤命定。议会什么时候开始用你这种人了？" },
      { speaker: "明弦", text: "“这种人”？真有意思，你倒是从不掩饰你的偏见。" },
      { speaker: "【内心】", text: "空气里的火药味，比长廊深处的失谐反应还要明显。" }
    ],
    choices: [
      {
        text: "「我们时间有限，能否先专注任务？」",
        effects: [
          { type: "change", key: "明弦信任", value: 2 },
          { type: "change", key: "槐序信任", value: -1 },
          { type: "event", value: "明弦已登场" }
        ],
        nextScene: "ch2_003"
      },
      {
        text: "「你认识槐序？」",
        effects: [
          { type: "change", key: "世界观信息", value: 1 },
          { type: "event", value: "明弦已登场" },
          { type: "event", value: "伏笔:明弦与槐序旧识" }
        ],
        nextScene: "ch2_002_memory"
      },
      {
        text: "沉默观察，不插话",
        effects: [{ type: "event", value: "明弦已登场" }],
        nextScene: "ch2_003"
      }
    ]
  },
  "ch2_002_memory": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.graystringDusk,
    description: "明弦的目光在槐序的舞鞋与扇骨之间停了一瞬，像是看见了一支她不愿承认熟悉的旧曲。",
    dialogues: [
      { speaker: "明弦", text: "认识？不至于。只是有些人在旧谱里留下的空白太显眼。" },
      { speaker: "槐序", sprite: "guarded", text: "你还是一样，喜欢把没说完的话说得像判决。" },
      { speaker: "洛温", sprite: "observing", text: "够了。长廊不会等你们把旧账算完。" }
    ],
    choices: [
      { text: "进入长廊", nextScene: "ch2_003" }
    ]
  },
  "ch2_003": {
    background: "#E8D9B5",
    backgroundImage: ASSETS.backgrounds.graystringDay,
    description: "脚步声在空旷的长廊里被放得很大。忽然，前方阴影里传出整齐划一的“咔、咔、咔”声，像有人在用拐杖敲打镜面大理石，节奏精确得可怕。",
    dialogues: [
      { speaker: "明弦", text: "听到了？那不是脚步声，是仪仗的踏步声。这条路曾经是两座学院的迎宾大道。" },
      { speaker: "洛温", sprite: "guardian", text: "现在迎宾的，换成了别的东西。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "huaixu_yifubai_joined" }],
        speaker: "伊芙白",
        sprite: "falseCheer",
        text: "哎，原来那么死板的节奏，是这么来的啊。"
      }
    ],
    choices: [
      {
        text: "「准备战斗。」",
        effect: () => {
          GameState.出战律者 = normalizeBattleMusicarts(BATTLES.honor_guard_puppet, ["槐序", "明弦"]);
          showTeamSelect({ battleId: "honor_guard_puppet", nextScene: "ch2_003" });
        }
      },
      {
        text: "「先观察它们的行进路线，找规律。」",
        effects: [{ type: "event", value: "honor_guard_prediction" }],
        effect: () => {
          GameState.出战律者 = normalizeBattleMusicarts(BATTLES.honor_guard_puppet, ["槐序", "明弦"]);
          showTeamSelect({ battleId: "honor_guard_puppet", nextScene: "ch2_003" });
        }
      }
    ]
  },
  "ch2_004": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.graystringDusk,
    description: "破碎的仪仗木偶倒在长廊石面上，机关核心残留着低温般的银光。风从断裂柱廊间穿过，像某个观众席迟来的吸气声。",
    dialogues: [
      { speaker: "系统", text: "前方即将进入长廊深处的“静默核心”区域，建议在此稍作休整，与队伍交流。" },
      { speaker: "槐序", sprite: "guarded", text: "你知道吗，越靠近那种地方，我能听见的“声音”就越多——有些是这个世界的，有些……可能不是。" }
    ],
    choices: [
      { text: "调查长廊侧翼事件（旧案合辑）", effect: () => drawChapter3MapEvent() },
      {
        text: "在断柱旁稍作茶歇",
        effects: [{ type: "set", key: "茶歇返回场景", value: "ch2_005" }],
        nextScene: "tea_break_hub"
      },
      { text: "继续进入静默核心区域", nextScene: "ch2_005" }
    ]
  },
  "ch2_005": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.silentCore,
    description: "长廊最深处的圆形广场里，中央矗立着一座倾颓的巨型音叉雕塑。它曾经高耸入云，如今从中段折断，断口渗出近乎液态的银色光，规律地脉动，像一颗仍在跳动、却已经认不出自己心跳节奏的心脏。",
    dialogues: [
      { speaker: "明弦", text: "这就是议会让我来的原因。这座音叉，是“静默纪元”真正开始的地方。" },
      { speaker: "槐序", sprite: "dissonance", text: "……我记得这里。" },
      { speaker: "【内心】", text: "她说“记得”，可她明明是第一次来这条长廊。" }
    ],
    choices: [
      {
        text: "「你记得什么？」",
        effects: [
          { type: "change", key: "世界观信息", value: 1 },
          { type: "event", value: "槐序静默核心预告" }
        ],
        nextScene: "ch2_005_huaixu"
      },
      {
        text: "「先处理眼前的异常反应，往事可以晚点再说。」",
        effects: [
          { type: "change", key: "槐序压力", value: 5 },
          { type: "change", key: "明弦信任", value: 2 }
        ],
        nextScene: "ch2_006"
      }
    ]
  },
  "ch2_005_huaixu": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.silentCore,
    description: "槐序没有立刻回答。她的手指在披肩边缘敲出三拍，轻、重、轻，每一下都和音叉断口的银光错开半拍。",
    dialogues: [
      { speaker: "槐序", sprite: "dissonance", text: "不是画面。是站在这里时，身体比记忆先认出了节拍。" },
      { speaker: "明弦", text: "这句话已经足够危险了。继续问下去，白谱院和议会都会想把她带回去重新编号。" },
      { speaker: "洛温", sprite: "observing", text: "先记录。不要在这里逼她下结论。" }
    ],
    choices: [
      { text: "记录这个碎片，继续调查核心", nextScene: "ch2_006" }
    ]
  },
  "ch2_006": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.silentCore,
    description: "音叉雕塑前，明弦的机械臂忽然发出警示蜂鸣。她迅速调出一份投影，回声议会的标记清晰可见，像一枚被放大的裁决印章。",
    dialogues: [
      { speaker: "明弦", text: "议会需要这座音叉的核心数据，活的、完整的，用来研究失谐反应的根源。" },
      { speaker: "槐序", sprite: "guarded", text: "如果带走核心，这片区域剩余的稳定结构可能彻底崩溃。白谱院的立场是：原地封存，不得移动。" },
      { speaker: "洛温", sprite: "observing", text: "两边都有道理。这次，不是我能决定的事。" }
    ],
    choices: [
      {
        text: "「按议会的指示，取走核心数据。」",
        effects: [
          { type: "change", key: "回声议会声望值", value: 5 },
          { type: "change", key: "白谱院声望值", value: -5 },
          { type: "change", key: "明弦信任", value: 5 },
          { type: "change", key: "槐序信任", value: -3 },
          { type: "event", value: "阵营倾向:回声议会" },
          { type: "event", value: "ch2_council_path" }
        ],
        nextScene: "ch2_007_council"
      },
      {
        text: "「按白谱院的原则，原地封存。」",
        effects: [
          { type: "change", key: "白谱院声望值", value: 5 },
          { type: "change", key: "回声议会声望值", value: -5 },
          { type: "change", key: "槐序信任", value: 5 },
          { type: "change", key: "明弦信任", value: -3 },
          { type: "event", value: "阵营倾向:白谱院" },
          { type: "event", value: "ch2_institute_path" }
        ],
        nextScene: "ch2_007_institute"
      },
      {
        text: "「有没有两边都能接受的折中方案？」",
        effect: () => {
          if (GameState.洛温信任 >= 50) {
            GameState.粮药 -= 3;
            GameState.白谱院声望值 += 2;
            GameState.回声议会声望值 += 2;
            GameState.洛温信任 += 8;
            GameState.洛温共鸣 += 5;
            addTriggeredEvent("部分封存部分采样成功");
            addTriggeredEvent("ch2_compromise_path");
            showScene("ch2_007_compromise");
            return;
          }

          GameState.白谱院声望值 -= 2;
          GameState.回声议会声望值 -= 2;
          addTriggeredEvent("优柔寡断");
          showScene("ch2_007_fail");
        }
      }
    ]
  },
  "ch2_007_council": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.silentCore,
    description: "明弦取走了音叉核心数据。银色光脉短暂变得急促，像有人把心跳写进了错误的小节里。槐序没有反对，只是很久没有抬头。",
    dialogues: [
      { speaker: "明弦", text: "至少你知道，答案不会自己从封存箱里爬出来。" },
      { speaker: "槐序", sprite: "guarded", text: "有些答案被挖出来时，会顺便把坟墓也掀开。" }
    ],
    choices: [
      { text: "带着数据返程", nextScene: "ch2_008" }
    ]
  },
  "ch2_007_institute": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.silentCore,
    description: "你决定原地封存音叉核心。白金色封印纹沿着裂口一圈圈收紧，银色脉动终于慢下来，像被迫回到一份旧规章里。",
    dialogues: [
      { speaker: "槐序", sprite: "guarded", text: "这不是最漂亮的选择。但至少它没有假装自己无害。" },
      { speaker: "明弦", text: "白谱院式答案。干净，规矩，永远少了一点胆量。" }
    ],
    choices: [
      { text: "完成封存后返程", nextScene: "ch2_008" }
    ]
  },
  "ch2_007_compromise": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.silentCore,
    description: "洛温上前一步，提出只提取核心边缘的少量共振样本，保留主体结构原地封存。这个方案技术难度极高，但他的稳定操作让两方代表都没有异议。",
    dialogues: [
      { speaker: "明弦", text: "……没想到低音墙还有这种细腻的一面。" },
      { speaker: "洛温", sprite: "guardian", text: "我只是不喜欢非黑即白的选择。" },
      { speaker: "槐序", sprite: "sarcastic", text: "他说得很低调。通常这种时候，他已经把最难的部分做完了。" }
    ],
    choices: [
      { text: "带着边缘样本返程", nextScene: "ch2_008" }
    ]
  },
  "ch2_007_fail": {
    background: "#F0EDE4",
    backgroundImage: ASSETS.backgrounds.silentCore,
    description: "你尝试寻找折中方案，但缺少足够稳定的执行者。取样针刚接触到银色光脉，音叉断口便发出刺耳回鸣，两方代表同时后退半步。",
    dialogues: [
      { speaker: "洛温", sprite: "burdened", text: "我不能保证它不会崩。现在必须二选一。" },
      { speaker: "明弦", text: "优柔寡断最昂贵。你刚刚付了第一笔。" }
    ],
    choices: [
      {
        text: "改为取走核心数据",
        effects: [
          { type: "change", key: "回声议会声望值", value: 3 },
          { type: "change", key: "白谱院声望值", value: -4 },
          { type: "change", key: "明弦信任", value: 3 }
        ],
        nextScene: "ch2_007_council"
      },
      {
        text: "改为原地封存",
        effects: [
          { type: "change", key: "白谱院声望值", value: 3 },
          { type: "change", key: "回声议会声望值", value: -4 },
          { type: "change", key: "槐序信任", value: 3 }
        ],
        nextScene: "ch2_007_institute"
      }
    ]
  },
  "ch2_008": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.graystringDusk,
    description: "返程的长廊被夜幕压低，远处城邦的灯光如散落的星群。断裂廊柱在风里投下长长的影子，像一排没有观众的包厢。",
    dialogues: [
      { speaker: "明弦", text: "候补校律者，算你今天还算识趣。下次见面，希望你已经想清楚自己真正站在哪一边。" },
      { speaker: "槐序", sprite: "guarded", text: "她总是这样说话，你不用太在意。" },
      { speaker: "【内心】", text: "可是你注意到，槐序说这话时，手指无意识地攥紧了披肩一角。" },
      { speaker: "系统", text: "〔第二乐章完〕你对“静默纪元起源”的了解又深了一层，但更大的疑问也随之而来。第三乐章·破弦之夜 即将开始。" }
    ],
    choices: [
      { text: "进入第三乐章", nextScene: "ch3_001" },
      {
        text: "先在返程长廊茶歇",
        effects: [{ type: "set", key: "茶歇返回场景", value: "ch3_001" }],
        nextScene: "tea_break_hub"
      }
    ]
  },
  /* ═══ 第三章场景 (破弦之夜) ═══ */
  "ch3_001": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "你们归来时，回声城邦正在筹备“和声盛典”——一场象征白谱院与回声议会重新和解的露天音乐会，将在城邦最高处的大剧场举行，全城居民都会出席。但金色尖塔顶端的调律核心，光芒比离开前黯淡了许多。",
    systemPrompt: "第三乐章·破弦之夜：Act 1高潮。华丽危机感被推到顶点，盛典即将变成战场。",
    dialogues: [
      { speaker: "玛伦", text: "盛典如期举行，议会认为这能稳定民心。但老实说……我并不安心。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "ch2_council_path" }],
        speaker: "祁恩",
        text: "议会高层对你们带回的数据评价很高。这次盛典，某种程度上也是为了展示这份“成果”。"
      },
      {
        conditions: [{ operator: "includes", value: "ch2_institute_path" }],
        speaker: "玛伦",
        text: "白谱院这边对你的判断很满意。只是议会那边……气氛还是有些微妙。"
      },
      {
        conditions: [{ operator: "includes", value: "ch2_compromise_path" }],
        speaker: "祁恩",
        text: "你们带回的边缘样本很克制，也很难得。正因如此，两边都希望盛典能把这份“克制”演给全城看。"
      }
    ],
    choices: [
      { text: "「盛典当晚，我们的队伍会在场吗？」", nextScene: "ch3_002" },
      { text: "先处理盛典前的异常事件", effect: () => drawChapter3MapEvent() },
      {
        text: "「我觉得应该取消盛典，先确认安全。」",
        effects: [{ type: "change", key: "白谱院声望值", value: 2 }],
        nextScene: "ch3_002"
      }
    ]
  },
  "ch3_002": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianTuningPlatform,
    description: "城邦边缘的临时指挥帐篷里，猩红色身影靠在帐篷柱旁。外面的盛典彩旗正被风吹动，声音却像有人在远处轻轻撕开一页乐谱。",
    dialogues: [
      { speaker: "明弦", text: "我查了灰弦长廊那座音叉的数据残片。有个结论，你们最好现在就知道。" },
      { speaker: "明弦", text: "那不是一次孤立的“静默核心”。是同一种东西的碎片，分散在至少七个地方——而最大的一片碎片，正在向你们的城邦移动。" },
      { speaker: "槐序", sprite: "dissonance", text: "……所以它要来了。" },
      { speaker: "【内心】", text: "她不是在问。她已经知道“它”是什么。" }
    ],
    choices: [
      { text: "「槐序，你知道那是什么？」", nextScene: "ch3_003" },
      {
        text: "「我们需要立刻加强盛典的防御。」",
        effects: [{ type: "change", key: "城邦稳定度", value: 3 }],
        nextScene: "ch3_003"
      }
    ]
  },
  "ch3_003": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianTuningPlatform,
    description: "帐篷里的灯火轻轻晃动。槐序像是突然站在很远的地方，明明就在你眼前，声音却隔着一层旧舞台的帷幕。",
    dialogues: [
      { speaker: "槐序", sprite: "guarded", text: "很久以前——在我自己都快记不清的“很久以前”——有一场演出，中途停了下来。" },
      { speaker: "槐序", sprite: "guarded", text: "不是因为意外。是有人，故意让它停下。" },
      { speaker: "槐序", sprite: "dissonance", text: "我不记得是谁了。但我记得，那种“被叫停”的感觉，和我醒来那天，一模一样。" },
      { speaker: "【内心】", text: "她说完这句话，立刻像是后悔了，转身整理起本就整齐的披肩。" },
      { speaker: "系统", text: "〔世界观线索已记录：槐序与“静默纪元起源”存在未知关联〕完整真相将在她的个人故事第三章揭晓。" }
    ],
    choices: [
      {
        text: "「谢谢你告诉我这些。」",
        effects: [
          { type: "change", key: "槐序信任", value: 8 },
          { type: "change", key: "槐序共鸣", value: 5 },
          { type: "event", value: "槐序静默纪元关联" }
        ],
        nextScene: "ch3_004"
      },
      {
        text: "沉默地点头，不追问",
        effects: [
          { type: "change", key: "槐序信任", value: 5 },
          { type: "change", key: "槐序压力", value: -3 },
          { type: "event", value: "槐序静默纪元关联" }
        ],
        nextScene: "ch3_004"
      }
    ]
  },
  "ch3_004": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    description: "城邦最高处的露天大剧场里，白色阶梯座位环绕中央舞台，金色帷幕低垂，数千盏烛灯次第点亮。白谱院合唱团身着纯白礼服立于舞台一侧，回声议会礼仪乐队着深蓝制服列于另一侧。台下座无虚席，全城居民屏息等待这场“和解之声”。",
    dialogues: [
      { speaker: "【内心】", text: "如果一切顺利，这将是这座城邦近年来最美的一晚。" },
      { speaker: "系统", text: "指挥棒落下的瞬间，天空忽然暗了下去。" }
    ],
    choices: [
      {
        text: "保持警惕，目光扫视四周",
        effects: [{ type: "event", value: "ch3_early_warning" }],
        nextScene: "ch3_005"
      },
      {
        text: "暂时放松，享受这一刻的美",
        effects: [
          { type: "change", key: "槐序压力", value: -5 },
          { type: "change", key: "洛温压力", value: -5 },
          { type: "change", key: "伊芙白压力", value: -5 },
          { type: "change", key: "明弦压力", value: -5 }
        ],
        nextScene: "ch3_005"
      }
    ]
  },
  "ch3_005": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    description: "第一个音符还未真正落下，天幕骤然裂开一道银黑色的缝隙。从中走出的身影，曾经一定是位指挥家——破碎残损的燕尾礼服仍保持着一丝不苟的剪裁，脸上是一面裂成蛛网状的瓷质指挥面具。它身后悬浮着十数件破碎的乐器残骸，无人演奏，却各自发出不成调的痛苦嗡鸣。",
    dialogues: [
      { speaker: "明弦", text: "……无拍者。比我预想的，提前到了。" },
      { speaker: "洛温", sprite: "guardian", text: "它在“指挥”什么？这里没有乐团会听它的。" },
      { speaker: "槐序", sprite: "dissonance", text: "……有的。这片土地上，每一个停摆的瞬间，都是它的乐团。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "__dissonance_risk_active__" }],
        speaker: "系统",
        text: "提示：当前指挥状态不稳，部分律者可能出现自主发动。"
      }
    ],
    choices: [
      {
        text: "「全员准备战斗！保护台下的居民撤离！」",
        effect: () => showTeamSelect({ battleId: "beatless_conductor", nextScene: "ch3_005" })
      },
      {
        text: "「先尝试用旋律稳住它的节奏，争取居民撤离时间。」",
        effects: [{ type: "event", value: "beatless_stabilize_first" }],
        effect: () => showTeamSelect({ battleId: "beatless_conductor", nextScene: "ch3_005" })
      }
    ]
  },
  "ch3_006": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    description: "舞台的金色帷幕在视野中无限延展，全场喧嚣骤然抽离。槐序站在无拍者留下的黑银光尘里，像终于回到某支迟到很多年的圆舞曲中。",
    systemPrompt: "独演范例：槐序的“宿命三拍”已完整展示。",
    dialogues: [
      { speaker: "系统", text: "时间仿佛被她的脚尖轻轻点住——银灰的裙摆在寂静中无声展开，像迟来了很多年的、终于完整的一支舞。她不再是在战斗。她是在“回答”。回答这片土地很久以前那个被中途叫停的乐章，回答那个连她自己都记不清的、悬而未决的问题。三拍落下，那些被无拍者抹去的光点，正一点点被重新写回原处。" },
      { speaker: "槐序", sprite: "sarcastic", text: "……抱歉，让你们久等了。这支舞，我欠了很久。" },
      { speaker: "系统", text: "〔槐序的独演已完整展示。她与这座城邦的过去，比你想象的更深。〕" }
    ],
    choices: [
      { text: "查看战后剧场", nextScene: "ch3_007" }
    ]
  },
  "ch3_007": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    description: "破损的舞台正在被清理，居民们带着劫后余生的复杂心情陆续离开。你的队伍站在舞台中央，无人说话，只有风吹动残破帷幕的声音。",
    dialogues: [
      { speaker: "明弦", text: "我说过，这不是孤立事件。无拍者只是七分之一。" },
      { speaker: "明弦", text: "议会会要求我继续追查剩余的六处——而这一次，我希望，是和你们一起。" }
    ],
    choices: [
      {
        text: "「欢迎加入。」",
        effects: [
          { type: "change", key: "明弦信任", value: 10 },
          { type: "event", value: "明弦正式加入队伍" }
        ],
        nextScene: "ch3_008"
      },
      {
        text: "「这需要白谱院和议会都同意。」",
        effects: [
          { type: "change", key: "明弦信任", value: 3 },
          { type: "event", value: "明弦正式加入延迟" }
        ],
        nextScene: "ch3_008"
      }
    ]
  },
  "ch3_008": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.teaLounge,
    description: "深夜的茶歇厅里，烛光摇曳，窗外是重新恢复宁静的城邦。这是漫长一天后，第一个真正安静下来的时刻。槐序坐在窗边，没有像往常一样保持完美的坐姿；洛温靠墙而立，闭目养神。",
    dialogues: [
      { speaker: "【内心】", text: "三个乐章过去了。你认识了她们的旋律，却还没真正听懂她们藏在乐句背后的、未说完的话。" }
    ],
    hiddenDialogues: [
      {
        conditions: [{ operator: "includes", value: "伊芙白加入队伍" }],
        speaker: "伊芙白",
        sprite: "tired",
        text: "今晚我不讲笑话。别担心，不是没有，是不想用。"
      }
    ],
    choices: [
      {
        text: "走到槐序身边坐下",
        effects: [{ type: "set", key: "茶歇返回场景", value: "act1_complete" }],
        nextScene: "tea_break_huaixu"
      },
      {
        text: "静静守在原地，让这份安静多停留一会儿",
        effect: () => {
          autoSaveGame();
          showScene("act1_complete");
        }
      }
    ]
  },
  "act1_complete": {
    background: "#FAF6EF",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "第一幕的记录暂时合上。静默纪元的真相，七分之一已经浮现。你与律者们的羁绊，将决定接下来能看见多少。",
    dialogues: [
      { speaker: "系统", text: "〔第一幕：启奏·离响·破弦之夜 完〕进度已保存。后续章节可以从这里继续扩展。" }
    ],
    choices: [
      { text: "返回主菜单", effect: () => showMainMenu() },
      { text: "回看第三乐章尾声", nextScene: "ch3_008" }
    ]
  },
  "game_over_city_collapse": {
    background: "#1A1C2C",
    backgroundImage: ASSETS.backgrounds.qixianPlaza,
    description: "城邦的调律核心终于暗了下去。广场上的五线谱地砖不再回响，白金灯笼一盏接一盏熄灭，像整座城市把最后一口气交还给静默。",
    systemPrompt: "Game Over：城邦稳定度降至0。主线没有锁死角色关系，但世界指标会终止旅程。",
    dialogues: [
      { speaker: "系统", text: "〔城邦稳定度归零〕文明边界收缩到无法维持旅程。当前记录已自动保存。" }
    ],
    choices: [
      { text: "返回主菜单", effect: () => showMainMenu() },
      { text: "读取存档", effect: () => openSaveModal("load") }
    ]
  },
  "ending_world_dissonance": {
    background: "#8B2354",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    description: "世界失谐度抵达临界。舞台灯没有熄灭，反而亮得刺眼；所有钟声、合唱、脚步与呼吸在同一瞬间错开，变成一场无人能重新指挥的盛大演出。",
    systemPrompt: "结局：世界失谐度达到100。当前版本进入失谐结局占位，后续可按角色第3章旗标细分结局。",
    dialogues: [
      { speaker: "系统", text: "〔失谐结局〕你仍然听见她们的旋律，但世界已经无法容纳正确的下一拍。" }
    ],
    choices: [
      { text: "返回主菜单", effect: () => showMainMenu() },
      { text: "读取存档", effect: () => openSaveModal("load") }
    ]
  }
};

/* ───────────────────────────────────────────────────────────
   模块: PERSONAL_STORIES (个人故事列表) | 行号: ~2561-2593
   功能: 定义可解锁的个人故事场景 ID 及解锁条件
   被引用: getAvailablePersonalStories(), openPersonalStory()
   ─────────────────────────────────────────────────────────── */
const PERSONAL_STORIES = [
  {
    id: "atya_01",
    character: "阿缇娅",
    chapter: 0,
    title: "暮星的空白",
    threshold: 30,
    resonanceKey: "阿缇娅共鸣",
    seenEvent: "story_seen:atya_01",
    sceneId: "story_atya_01"
  },
  {
    id: "milo_01",
    character: "弥洛",
    chapter: 0,
    title: "低音不说谎",
    threshold: 30,
    resonanceKey: "弥洛共鸣",
    seenEvent: "story_seen:milo_01",
    sceneId: "story_milo_01"
  },
  {
    id: "huaixu_01",
    character: "槐序",
    chapter: 1,
    title: "舞票背面的乐句",
    threshold: 30,
    resonanceKey: "槐序共鸣",
    seenEvent: "story_seen:huaixu_01",
    sceneId: "story_huaixu_01"
  },
  {
    id: "huaixu_02",
    character: "槐序",
    chapter: 2,
    title: "无人邀舞的夜晚",
    threshold: 60,
    resonanceKey: "槐序共鸣",
    seenEvent: "story_seen:huaixu_02",
    sceneId: "story_huaixu_02"
  },
  {
    id: "huaixu_03",
    character: "槐序",
    chapter: 3,
    title: "三拍与第一次失谐",
    threshold: 90,
    resonanceKey: "槐序共鸣",
    seenEvent: "story_seen:huaixu_03",
    sceneId: "story_huaixu_03"
  }
];

/* ───────────────────────────────────────────────────────────
   模块: CHAPTER0_EVENT_POOL (第零章眠沙镇支线事件池)
   功能: 第零章独立探索事件，使用 CH0_E 前缀避免与其它章节事件冲突
   ─────────────────────────────────────────────────────────── */
const CHAPTER0_EVENT_POOL = [
  {
    id: "CH0_E001",
    title: "诺伊的无声旋律",
    eventType: "minigame",
    minigameType: "无声琴键",
    description: "诺伊坐在旧钢琴旁，把手悬在琴键上方。他不敢按下去，却又不愿离开。",
    choices: [
      { text: "教他半键下沉，不让琴槌敲响", effects: [{ type: "change", key: "诺伊希望", value: 3 }, { type: "event", value: "ch0_side_noi_silent_melody" }] },
      { text: "让他先记住四拍呼吸", effects: [{ type: "change", key: "城邦稳定度", value: 1 }, { type: "change", key: "诺伊希望", value: 1 }] }
    ]
  },
  {
    id: "CH0_E002",
    title: "安柠的健康检查",
    eventType: "narrative",
    description: "安柠把医疗箱摔在桌上，要求你把右腕伸出来。她不关心你是否像指挥家，她只关心你还能不能活过今晚。",
    choices: [
      { text: "配合检查，不逞强", effects: [{ type: "change", key: "奏者健康", value: 5 }, { type: "change", key: "安柠好感", value: 2 }] },
      { text: "说现在还有人等着救", effects: [{ type: "change", key: "奏者健康", value: -2 }, { type: "change", key: "安柠好感", value: 1 }, { type: "change", key: "阿缇娅压力", value: 2 }] }
    ]
  },
  {
    id: "CH0_E003",
    title: "阿缇娅看见旧裙子",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "ch0_contract_baton_unplayed" }],
    description: "阿缇娅站在后台旧裙子前，像在读取一段她不承认属于自己的记忆。",
    choices: [
      { text: "不说缇雅的名字，只问她看见了什么", effects: [{ type: "change", key: "阿缇娅信任", value: 3 }, { type: "change", key: "阿缇娅共鸣", value: 2 }] },
      { text: "说那是缇雅想穿的裙子", effects: [{ type: "change", key: "阿缇娅共鸣", value: 3 }, { type: "change", key: "阿缇娅压力", value: 4 }] }
    ]
  },
  {
    id: "CH0_E004",
    title: "弥洛的低音",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "黑色节拍器残片" }],
    description: "钟楼下方，弥洛用低鸣压住一段反复回弹的半拍。他说低音不该抢走主旋律。",
    choices: [
      { text: "承认他比你更早听见危险", effects: [{ type: "change", key: "弥洛信任", value: 3 }, { type: "change", key: "弥洛压力", value: -2 }] },
      { text: "要求他等你的手势", effects: [{ type: "change", key: "弥洛信任", value: 1 }, { type: "change", key: "弥洛压力", value: 3 }] }
    ]
  },
  {
    id: "CH0_E005",
    title: "唱片店里的刮痕",
    eventType: "minigame",
    minigameType: "波形修复",
    description: "乌鸦先生把一张刮花的黑胶放上唱机。噪声之下，似乎还藏着母亲留下的半句话。",
    choices: [
      { text: "从杂音里提取低频残片", effects: [{ type: "event", value: "母亲声音残片:低频" }, { type: "change", key: "世界观信息", value: 2 }] },
      { text: "先复制唱片，避免原件损坏", effects: [{ type: "change", key: "乌鸦先生信任", value: 2 }, { type: "change", key: "世界观信息", value: 1 }] }
    ]
  },
  {
    id: "CH0_E006",
    title: "白栖的封音项圈",
    eventType: "narrative",
    description: "白栖按住脖颈上的封音项圈。每当附近出现旋律残响，项圈都会像惩罚一样收紧。",
    choices: [
      { text: "让安柠检查项圈结构", effects: [{ type: "change", key: "安柠好感", value: 1 }, { type: "event", value: "线索:封音项圈结构" }] },
      { text: "告诉她害怕不等于背叛", effects: [{ type: "change", key: "白栖信任", value: 3 }, { type: "change", key: "镇民信任", value: 1 }] }
    ]
  },
  {
    id: "CH0_E007",
    title: "米拉奶奶的最后一张票",
    eventType: "narrative",
    description: "米拉奶奶从票夹里取出最后一张合法演出的票根。纸已经脆到快要碎了，她却仍把它夹得很平。",
    choices: [
      { text: "把票根夹进修理记录本", effects: [{ type: "event", value: "旧剧场最后票根" }, { type: "change", key: "世界观信息", value: 1 }] },
      { text: "答应替她看完那场演出", effects: [{ type: "change", key: "镇民希望", value: 3 }, { type: "event", value: "ch0_promised_last_performance" }] }
    ]
  },
  {
    id: "CH0_E008",
    title: "奥托的旧剧场灯光机关",
    eventType: "minigame",
    minigameType: "舞台灯调试",
    description: "失聪的老灯光师奥托摸着锈蚀灯架。他听不见音乐，却还记得哪一束灯该落在哪一个人身上。",
    choices: [
      { text: "把追光灯调到旧钢琴位置", effects: [{ type: "event", value: "ch0_spotlight_piano_ready" }, { type: "change", key: "城邦稳定度", value: 1 }] },
      { text: "把追光灯调到后台入口", effects: [{ type: "event", value: "ch0_spotlight_backstage_ready" }, { type: "change", key: "世界观信息", value: 1 }] }
    ]
  },
  {
    id: "CH0_E009",
    title: "静默署巡逻队",
    eventType: "narrative",
    description: "静默署巡逻队封锁了广场。他们不是来救镇民的，是来确认没有人把声音还给镇民。",
    choices: [
      { text: "让白栖替你们争取十分钟", effects: [{ type: "change", key: "白栖信任", value: 2 }, { type: "event", value: "ch0_patrol_delayed" }] },
      { text: "从地下排水道绕行", effects: [{ type: "change", key: "奏者健康", value: -2 }, { type: "change", key: "世界失谐度", value: 1 }] }
    ]
  },
  {
    id: "CH0_E010",
    title: "地下商人的残响诱饵",
    eventType: "narrative",
    description: "地下商人承认自己用乐器残响引来噬响体，再把残骸卖给静默署承包商。",
    choices: [
      { text: "没收诱饵，公开他的交易记录", effects: [{ type: "change", key: "镇民信任", value: 3 }, { type: "change", key: "世界失谐度", value: -2 }] },
      { text: "留下诱饵，反向追踪卡戎信号", effects: [{ type: "change", key: "世界观信息", value: 3 }, { type: "change", key: "世界失谐度", value: 2 }] }
    ]
  },
  {
    id: "CH0_E011",
    title: "静默猎犬的追迹",
    eventType: "battle",
    unlock: [{ operator: "includes", value: "ch0_contract_baton_unplayed" }],
    description: "雨水把广场上的脚印冲成黑色音符。静默猎犬低伏在封条之间，鼻腔里传出像消音器堵住的节拍声。",
    choices: [
      {
        text: "让弥洛压住犬吠，阿缇娅切断追迹",
        effects: [{ type: "event", value: "ch0_silence_hound_engaged" }],
        effect: () => startBattle("ch0_silence_hound", { selectedMusicarts: ["阿缇娅", "弥洛"] })
      },
      {
        text: "绕开追迹路线，保存奏者健康",
        effects: [{ type: "change", key: "奏者健康", value: 2 }, { type: "change", key: "镇民恐惧", value: 1 }, { type: "event", value: "ch0_silence_hound_avoided" }]
      }
    ]
  },
  {
    id: "CH0_E012",
    title: "霍尔特的湿文件",
    eventType: "narrative",
    description: "镇长代理霍尔特抱着一摞被雨泡开的登记表。他说自己只是按条例维持秩序，可手指一直按在失踪名单上。",
    choices: [
      { text: "帮他重新整理失声镇民名单", effects: [{ type: "change", key: "镇民信任", value: 2 }, { type: "change", key: "世界观信息", value: 1 }, { type: "event", value: "ch0_holt_voice_registry" }] },
      { text: "要求他公开静默署物资去向", effects: [{ type: "change", key: "镇民希望", value: 2 }, { type: "change", key: "白谱院声望值", value: -1 }, { type: "event", value: "线索:眠沙镇物资截流" }] }
    ]
  },
  {
    id: "CH0_E013",
    title: "琳与铃的残谱拼读",
    eventType: "minigame",
    minigameType: "残谱拼读",
    description: "废弃教室里，双胞胎琳与铃把被擦掉的歌词抄在窗雾上。一个不停说话，一个只用粉笔敲四拍。",
    choices: [
      { text: "让琳念节拍，铃负责补缺字", effects: [{ type: "change", key: "诺伊希望", value: 2 }, { type: "change", key: "镇民希望", value: 2 }, { type: "event", value: "ch0_twins_restored_fragment" }] },
      { text: "先带她们离开教室", effects: [{ type: "change", key: "镇民信任", value: 1 }, { type: "change", key: "世界失谐度", value: -1 }, { type: "event", value: "ch0_twins_evacuated" }] }
    ]
  },
  {
    id: "CH0_E014",
    title: "伊莱娜的临时盘查",
    eventType: "narrative",
    description: "静默署队长伊莱娜带队封住雨街。她不相信音乐无害，也不完全相信上级给她的报告。",
    choices: [
      { text: "让安柠出面交涉，争取十分钟", effects: [{ type: "change", key: "安柠好感", value: 1 }, { type: "change", key: "世界观信息", value: 1 }, { type: "event", value: "ch0_elena_negotiated_delay" }] },
      { text: "进入静默潜行，绕开封锁线", effects: [{ type: "change", key: "奏者健康", value: -1 }, { type: "change", key: "镇民信任", value: 1 }, { type: "event", value: "ch0_elena_stealth_route" }] },
      { text: "交出诱饵交易线索，换取暂缓追捕", effects: [{ type: "change", key: "白谱院声望值", value: -1 }, { type: "change", key: "世界失谐度", value: -1 }, { type: "event", value: "ch0_elena_suspicion_seed" }] }
    ]
  }
];

/* ───────────────────────────────────────────────────────────
   模块: CHAPTER1_EVENT_POOL (第一章地图事件池) | 行号: ~2594-2861
   功能: 第一章探索途中的随机地图遭遇事件
   被引用: drawChapter1MapEvent()
   ⚠️ 事件结构: { id, type, text, effects, nextScene }
   ─────────────────────────────────────────────────────────── */
let CHAPTER1_EVENT_POOL = [
  {
    id: "E001",
    title: "断路上的求援",
    eventType: "narrative",
    description: "断裂匝道下方传来敲击声。三短一长，不是求救规范，却像有人用最后的力气记住了一段节拍。",
    choices: [
      { text: "让槐序确认节拍来源", effects: [{ type: "change", key: "槐序共鸣", value: 2 }, { type: "change", key: "奏者健康", value: -3 }] },
      { text: "先派洛温固定塌陷路面", effects: [{ type: "change", key: "洛温信任", value: 3 }, { type: "change", key: "粮药", value: -1 }] }
    ]
  },
  {
    id: "E002",
    title: "失调的旅行者",
    eventType: "narrative",
    description: "一个流动唱队的旅行者坐在路牌旁，反复哼同一个错误音。他说自己只是在等一辆已经抵达过的车。",
    choices: [
      { text: "承认你也无法立刻解释", effects: [{ type: "change", key: "槐序共鸣", value: 2 }] },
      { text: "用安全音阶压住他的哼唱", effects: [{ type: "change", key: "城邦稳定度", value: 2 }, { type: "change", key: "世界失谐度", value: 2 }] }
    ]
  },
  {
    id: "E003",
    title: "被遗弃的乐器铺",
    eventType: "narrative",
    description: "路边乐器铺的招牌被消音布缠住。柜台里还放着几枚裂开的音枢，像被人匆忙藏起的骨头。",
    choices: [
      { text: "只取能修复乐装的零件", effects: [{ type: "change", key: "音芯", value: 1 }, { type: "change", key: "洛温信任", value: 2 }] },
      { text: "翻找店主留下的账本", effects: [{ type: "event", value: "线索:乐器铺账本" }, { type: "change", key: "槐序压力", value: 3 }] }
    ]
  },
  {
    id: "E004",
    title: "旧纪元的留声机",
    eventType: "minigame",
    minigameType: "音色辨识",
    description: "一台旧留声机在没有唱片的情况下转动。三种声音从喇叭里轮流溢出，只有一种带着失谐污染。",
    choices: [
      { text: "选择：像玻璃杯边缘摩擦的高音", effects: [{ type: "change", key: "世界失谐度", value: -2 }, { type: "change", key: "伊芙白共鸣", value: 2 }] },
      { text: "选择：像雨落在铁皮棚上的声音", effects: [{ type: "change", key: "世界失谐度", value: 2 }] },
      { text: "选择：像远处车轮压过碎石", effects: [{ type: "change", key: "奏者健康", value: -3 }] }
    ]
  },
  {
    id: "E005",
    title: "两个派系的争端",
    eventType: "narrative",
    description: "白谱院记录员和流动唱队的领路人在废站前争吵。一个要封存曲谱，一个要把它带去下一座驿站。",
    choices: [
      { text: "让曲谱留在当地，但允许抄录", effects: [{ type: "change", key: "城邦稳定度", value: 2 }, { type: "change", key: "槐序共鸣", value: 2 }] },
      { text: "交给白谱院封存", effects: [{ type: "set", key: "白谱院声望", value: "友好" }, { type: "change", key: "槐序共鸣", value: -2 }] }
    ]
  },
  {
    id: "E006",
    title: "受伤的噬响体幼体",
    eventType: "narrative",
    description: "一只幼小噬响体卡在护栏中，啃食声音的器官还未成形。它发不出攻击声，只在风里轻轻颤动。",
    choices: [
      { text: "封存并带走观察", effects: [{ type: "change", key: "世界失谐度", value: 2 }, { type: "event", value: "线索:幼体样本" }] },
      { text: "让它远离道路后放生", effects: [{ type: "change", key: "槐序共鸣", value: 3 }, { type: "change", key: "城邦稳定度", value: -1 }] }
    ]
  },
  {
    id: "E007",
    title: "律者的旧相识",
    eventType: "narrative",
    description: "一名老人看见槐序后愣住，叫出了一个不属于封存档案的名字。槐序的手指停在半空，像差点踩错了拍。",
    choices: [
      { text: "替槐序挡开追问", effects: [{ type: "change", key: "槐序信任", value: 4 }] },
      { text: "请老人继续说下去", effects: [{ type: "change", key: "槐序压力", value: 6 }, { type: "event", value: "线索:槐序旧名" }] }
    ]
  },
  {
    id: "E008",
    title: "商人的虚假情报",
    eventType: "narrative",
    description: "一个商人兜售灰弦公路的安全路线。他的地图太干净，干净到不像有人真的走过。",
    choices: [
      { text: "买下地图但标记为可疑", effects: [{ type: "change", key: "粮药", value: -1 }, { type: "change", key: "洛温信任", value: 2 }] },
      { text: "当场拆穿他", effects: [{ type: "change", key: "城邦稳定度", value: 1 }, { type: "change", key: "伊芙白共鸣", value: 2 }] }
    ]
  },
  {
    id: "E009",
    title: "孩子问了一个问题",
    eventType: "narrative",
    description: "避难车旁的孩子问：如果唱歌危险，那为什么大人还会在梦里哼歌？周围的人突然安静下来。",
    choices: [
      { text: "说危险不等于错误", effects: [{ type: "change", key: "槐序共鸣", value: 3 }, { type: "change", key: "城邦稳定度", value: -1 }] },
      { text: "说现在先活下去", effects: [{ type: "change", key: "城邦稳定度", value: 2 }, { type: "change", key: "槐序共鸣", value: -1 }] }
    ]
  },
  {
    id: "E010",
    title: "调律台被占领",
    eventType: "narrative",
    description: "一座路边调律台被拾荒者占住。他们把铜针拆下来当交易品，却不知道那是整段路唯一还能校准音准的地方。",
    choices: [
      { text: "用粮药换回铜针", effects: [{ type: "change", key: "粮药", value: -2 }, { type: "change", key: "城邦稳定度", value: 2 }] },
      { text: "强行夺回调律台", effects: [{ type: "change", key: "洛温压力", value: 5 }, { type: "change", key: "城邦稳定度", value: 1 }] }
    ]
  },
  {
    id: "E011",
    title: "失谐矿脉发现",
    eventType: "minigame",
    minigameType: "节拍判断",
    description: "地面下方传来三组震动。只有一组和失谐矿脉同频，选错会让矿脉继续扩散。",
    choices: [
      { text: "轻、重、轻", effects: [{ type: "change", key: "音芯", value: 1 }, { type: "change", key: "世界失谐度", value: -1 }] },
      { text: "重、重、轻", effects: [{ type: "change", key: "世界失谐度", value: 2 }] },
      { text: "轻、轻、重", effects: [{ type: "change", key: "奏者健康", value: -4 }] }
    ]
  },
  {
    id: "E012",
    title: "临时的节拍庇护所",
    eventType: "minigame",
    minigameType: "碎片解读",
    description: "幸存者用四块路牌拼出临时庇护节拍。顺序被风打乱，你必须决定哪一句应该放在最前。",
    choices: [
      { text: "先放“让孩子睡着”", effects: [{ type: "change", key: "城邦稳定度", value: 2 }, { type: "change", key: "槐序共鸣", value: 1 }] },
      { text: "先放“让警戒生效”", effects: [{ type: "change", key: "洛温信任", value: 2 }] },
      { text: "先放“让声音停下”", effects: [{ type: "change", key: "世界失谐度", value: 1 }] }
    ]
  },
  {
    id: "E013",
    title: "走错了路",
    eventType: "minigame",
    minigameType: "节拍判断",
    description: "路标指向三个方向，每个方向都有一段不同的敲击回声。正确的回声会绕远，但可能避开伏击。",
    choices: [
      { text: "选择回声最长的旧桥方向", effects: [{ type: "change", key: "伊芙白共鸣", value: 2 }, { type: "event", value: "发现秘密地点:旧桥" }] },
      { text: "选择最近的主路方向", effects: [{ type: "change", key: "奏者健康", value: -3 }] },
      { text: "原地等待下一次回声", effects: [{ type: "change", key: "粮药", value: -1 }, { type: "change", key: "洛温信任", value: 1 }] }
    ]
  },
  {
    id: "E014",
    title: "律者之间的矛盾",
    eventType: "narrative",
    description: "洛温认为应该绕开危险路段，槐序却听见路段深处有求救节拍。两人的沉默比争吵更难处理。",
    choices: [
      { text: "先让槐序说明她听见了什么", effects: [{ type: "change", key: "槐序信任", value: 2 }, { type: "change", key: "洛温压力", value: 2 }] },
      { text: "采纳洛温的稳妥路线", effects: [{ type: "change", key: "洛温信任", value: 3 }, { type: "change", key: "槐序共鸣", value: -1 }] }
    ]
  },
  {
    id: "E015",
    title: "玩家收到旧日的信件",
    eventType: "narrative",
    description: "补给箱夹层里有一封写给奏者候补的旧信。落款被撕掉，只剩一句：不要让她们以为自己只是武器。",
    choices: [
      { text: "把信读给队伍听", effects: [{ type: "change", key: "槐序共鸣", value: 2 }, { type: "change", key: "洛温信任", value: 2 }] },
      { text: "先收起来，等合适的时候再说", effects: [{ type: "event", value: "线索:旧日信件" }] }
    ]
  },
  {
    id: "E016",
    title: "舞鞋里的票根",
    eventType: "narrative",
    unlock: [{ key: "槐序信任", operator: ">=", value: 50 }],
    description: "槐序的旧舞鞋里掉出第二枚票根。她没有捡，只问你：如果一支舞从来没有结束，它算不算还活着？",
    choices: [
      { text: "说它还在等最后一拍", effects: [{ type: "change", key: "槐序共鸣", value: 4 }] },
      { text: "说结束不是背叛", effects: [{ type: "change", key: "槐序信任", value: 3 }] }
    ]
  },
  {
    id: "E017",
    title: "低音箱里的遗书",
    eventType: "narrative",
    unlock: [{ key: "洛温信任", operator: ">=", value: 50 }],
    description: "洛温在废车厢里找到一只低音箱，里面藏着他曾保护失败的人的遗书。他握着纸页，没有立刻打开。",
    choices: [
      { text: "让他自己决定是否阅读", effects: [{ type: "change", key: "洛温信任", value: 4 }] },
      { text: "提醒现在还有任务", effects: [{ type: "change", key: "洛温压力", value: 5 }] }
    ]
  },
  {
    id: "E018",
    title: "笑话失灵时",
    eventType: "narrative",
    unlock: [{ key: "伊芙白信任", operator: ">=", value: 50 }],
    description: "伊芙白讲了一个没人笑的笑话。她夸张地鞠躬，转身时眼神却空了一瞬。",
    choices: [
      { text: "不拆穿，只递给她水", effects: [{ type: "change", key: "伊芙白信任", value: 4 }] },
      { text: "直接问她是不是累了", effects: [{ type: "change", key: "伊芙白共鸣", value: 3 }, { type: "change", key: "伊芙白压力", value: 2 }] }
    ]
  },
  {
    id: "E019",
    title: "被改写的口琴",
    eventType: "narrative",
    unlock: [{ key: "伊芙白共鸣", operator: ">=", value: 50 }],
    description: "一把口琴吹出不属于它的音色。伊芙白说这是谎言成精之前的样子。",
    choices: [
      { text: "让她保留这把口琴", effects: [{ type: "change", key: "伊芙白共鸣", value: 4 }, { type: "change", key: "世界失谐度", value: 1 }] },
      { text: "交给白谱院检测", effects: [{ type: "set", key: "白谱院声望", value: "友好" }, { type: "change", key: "伊芙白信任", value: -3 }] }
    ]
  },
  {
    id: "E020",
    title: "三人没有说完的话",
    eventType: "narrative",
    unlock: [{ key: "槐序信任", operator: ">=", value: 50 }, { key: "洛温信任", operator: ">=", value: 50 }],
    description: "夜里，槐序和洛温同时停在调律台前。一个听见未完的三拍，一个听见过重的低音。他们都等你先开口。",
    choices: [
      { text: "让他们先互相说完", effects: [{ type: "change", key: "槐序信任", value: 2 }, { type: "change", key: "洛温信任", value: 2 }] },
      { text: "先定明天的路线", effects: [{ type: "change", key: "洛温信任", value: 1 }, { type: "change", key: "槐序压力", value: 3 }] }
    ]
  },
  {
    id: "E101",
    title: "雾中巡逻",
    eventType: "battle",
    description: "弥洛带队巡查雾茧站外围。铁轨边缘出现禁曲派踩点标记，雾啸者在信号灯照不到的白雾里换位。",
    choices: [
      { text: "清理巡查员，夺取巡逻日志", effects: [{ type: "event", value: "禁曲派巡逻日志残页" }], effect: () => startBattle("ch1_fog_patrol", { selectedMusicarts: ["阿缇娅", "弥洛"] }) },
      { text: "只记录巡逻路线，避免提前暴露", effects: [{ type: "event", value: "ch1_patrol_route_logged" }, { type: "change", key: "世界观信息", value: 1 }] }
    ]
  },
  {
    id: "E102",
    title: "追踪车辙",
    eventType: "minigame",
    minigameType: "轨道排除",
    description: "老潘根据车轮声提供线索。你需要在多组换轨道岔中找出禁曲派巡演车的真实路径。",
    choices: [
      { text: "按低频车轮声排除干扰轨", effects: [{ type: "event", value: "ch1_track_ruts_success" }, { type: "event", value: "提前获知零四抵达时间" }, { type: "change", key: "弥洛信任", value: 2 }] },
      { text: "让安柠用维修经验反推路线", effects: [{ type: "event", value: "ch1_anning_track_reading" }, { type: "change", key: "安柠好感", value: 2 }] }
    ]
  },
  {
    id: "E103",
    title: "候车室旧海报",
    eventType: "narrative",
    description: "候车室墙上残留着发霉的巡演海报。海报边缘被静默署封条盖住，但仍能看出这条黑暗巡演路线曾经只是普通乐团的演出路线。",
    choices: [
      { text: "拼出旧巡演路线", effects: [{ type: "event", value: "巡演本该是这世上最不害人的事" }, { type: "change", key: "世界观信息", value: 2 }] },
      { text: "让弥洛辨认乐团标志", effects: [{ type: "change", key: "弥洛共鸣", value: 2 }, { type: "event", value: "弥洛见过旧巡演标志" }] }
    ]
  },
  {
    id: "E104",
    title: "老站长办公室",
    eventType: "narrative",
    description: "办公室门口贴着静默署封条。最后一张“不再发车”的时刻表被红笔圈住，字迹与默令残页上的批注高度相似。",
    choices: [
      { text: "破解封条，取出时刻表", effects: [{ type: "event", value: "老站长办公室时刻表" }, { type: "change", key: "世界观信息", value: 2 }] },
      { text: "只拍照记录，不破坏现场", effects: [{ type: "event", value: "静默署与禁曲派同源疑点" }, { type: "change", key: "安柠好感", value: 1 }] }
    ]
  },
  {
    id: "E105",
    title: "柯婆婆的旧照片",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "尤娜吊坠提前告知" }],
    description: "柯婆婆拿出十五年前的旧照片，照片背景隐约可见一座剧场轮廓，与眠沙镇旧剧场建筑风格相似。",
    choices: [
      { text: "询问尤娜被捡到的那一夜", effects: [{ type: "event", value: "雾茧站与眠沙镇同属旧巡演线" }, { type: "change", key: "尤娜信任", value: 2 }] },
      { text: "不追问，只收下照片线索", effects: [{ type: "event", value: "柯婆婆旧照片" }, { type: "change", key: "柯婆婆警惕", value: -1 }] }
    ]
  },
  {
    id: "E106",
    title: "柯婆婆撤离事件",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "柯婆婆撤离事件" }],
    description: "柯婆婆带尤娜撤离途中，尤娜坚持回头看一眼。柯婆婆用身体挡住她的视线，第一次没有用笑话遮掩恐惧。",
    choices: [
      { text: "帮她们标出安全路线", effects: [{ type: "event", value: "柯婆婆专属台词池" }, { type: "change", key: "尤娜信任", value: 3 }] },
      { text: "让阿缇娅护送到旅馆后门", effects: [{ type: "change", key: "阿缇娅共鸣", value: 2 }, { type: "event", value: "尤娜撤离成功" }] }
    ]
  },
  {
    id: "E107",
    title: "低音声部的试探",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "主角形象:男性奏者" }],
    description: "洛温在路边校准低音弦时停了一下。他没有看你，只问：如果两个人都听见第一拍，你会让谁先动？",
    choices: [
      { text: "让更接近危险的人先动", effects: [{ type: "change", key: "洛温信任", value: 3 }, { type: "change", key: "洛温压力", value: -2 }] },
      { text: "由我决定，不让律者互相争拍", effects: [{ type: "change", key: "洛温压力", value: 4 }, { type: "event", value: "洛温低音摩擦预警" }] }
    ]
  },
  {
    id: "E108",
    title: "女中音的安定拍",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "主角形象:女性奏者" }],
    description: "一名受惊的学员在茶歇厅门口发抖。她说你的声音让她想起事故前最后一次正常合唱，想确认那不是错觉。",
    choices: [
      { text: "陪她把呼吸数完四拍", effects: [{ type: "change", key: "城邦稳定度", value: 2 }, { type: "change", key: "槐序信任", value: 2 }] },
      { text: "请玛伦安排正式心理记录", effects: [{ type: "change", key: "白谱院声望值", value: 2 }, { type: "change", key: "槐序共鸣", value: -1 }] }
    ]
  },
  {
    id: "E109",
    title: "四年前的节目单",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "完成角色创建序幕" }],
    description: "补给包底部滑出一张旧歌剧院节目单。纸面被烧掉一角，第四小节的位置有一枚指痕，像有人在事故之后反复按住那里。",
    choices: [
      { text: "把它夹回记录册，不在队伍面前展开", effects: [{ type: "change", key: "奏者健康", value: 3 }, { type: "event", value: "保留:四年前节目单" }] },
      { text: "让槐序看一眼错拍位置", effects: [{ type: "change", key: "槐序共鸣", value: 3 }, { type: "change", key: "槐序压力", value: 2 }, { type: "event", value: "线索:第四小节错拍" }] }
    ]
  },
  {
    id: "E110",
    title: "茶歇里的两人编队复盘",
    eventType: "narrative",
    description: "战斗结束后，茶歇桌上多了两枚倒扣的杯子。它们代表本次出战的两名律者，第三枚杯子被放在盘外，像一个被暂时延后的选择。",
    choices: [
      { text: "复盘谁承担了最多代价", effects: [{ type: "change", key: "奏者健康", value: 2 }, { type: "change", key: "洛温信任", value: 1 }, { type: "change", key: "槐序信任", value: 1 }] },
      { text: "先不复盘，让所有人休息", effects: [{ type: "change", key: "槐序压力", value: -2 }, { type: "change", key: "洛温压力", value: -2 }] }
    ]
  },
  {
    id: "E111",
    title: "被退回的称呼登记表",
    eventType: "narrative",
    description: "白谱院把你的称呼登记表退了回来，理由是声部栏与身份栏无法互相校验。纸页边缘盖着三个不同部门的印章。",
    choices: [
      { text: "按自己的选择重填，不解释", effects: [{ type: "change", key: "白谱院声望值", value: -1 }, { type: "change", key: "伊芙白共鸣", value: 2 }, { type: "event", value: "拒绝重登记声部" }] },
      { text: "补一行说明：声部不是服从关系", effects: [{ type: "change", key: "世界观信息", value: 1 }, { type: "change", key: "槐序共鸣", value: 2 }] }
    ]
  },
  {
    id: "E112",
    title: "奏者健康的欠账",
    eventType: "narrative",
    description: "夜间休整时，你的手指突然失去知觉。不是受伤，是白天指挥时欠下的节拍延迟到了身体里。茶杯边缘震出很轻的一圈波纹。",
    choices: [
      { text: "承认状态不好，减少下一段路的强行指挥", effects: [{ type: "change", key: "奏者健康", value: 6 }, { type: "change", key: "洛温信任", value: 2 }, { type: "event", value: "承认奏者健康欠账" }] },
      { text: "藏起手指，照常出发", effects: [{ type: "change", key: "奏者健康", value: -4 }, { type: "change", key: "槐序压力", value: 2 }, { type: "event", value: "隐瞒奏者健康欠账" }] }
    ]
  }
];

const CHAPTER1_LEGACY_EVENT_POOL = CHAPTER1_EVENT_POOL.filter((event) => !/^E10[1-6]$/.test(event.id));
CHAPTER1_EVENT_POOL = CHAPTER1_EVENT_POOL.filter((event) => /^E10[1-6]$/.test(event.id));

/* ───────────────────────────────────────────────────────────
   模块: CHAPTER2_EVENT_POOL (第二章地图事件池) | 行号: ~2862-2918
   ─────────────────────────────────────────────────────────── */
const CHAPTER2_EVENT_POOL = [
  {
    id: "E201",
    title: "谱鸣静音挑战",
    eventType: "minigame",
    minigameType: "节奏潜行",
    description: "一段悬浮冰锥谱架密集的回廊挡住去路。每一步都可能把整座塔的警报敲醒。",
    choices: [
      { text: "按弥洛的低音节拍轻声通过", effects: [{ type: "event", value: "E201_success" }, { type: "change", key: "谱鸣共振", value: -10 }, { type: "change", key: "弥洛信任", value: 2 }], nextScene: "ch2_snow_006" },
      { text: "用阿缇娅的刀光切断一排共振冰锥", effects: [{ type: "change", key: "奏者健康", value: -4 }, { type: "change", key: "谱鸣共振", value: 6 }, { type: "event", value: "E201_force_cut" }] }
    ]
  },
  {
    id: "E202",
    title: "冻结档案室探索",
    eventType: "minigame",
    minigameType: "档案拼图",
    description: "档案室内封存着零号奏者计划的早期文件，冰层把残页按错误时间顺序冻结在半空。",
    choices: [
      { text: "按时间线拼回计划残页", effects: [{ type: "event", value: "E202_archive_timeline_complete" }, { type: "event", value: "安柠父亲名单线索" }, { type: "change", key: "世界观信息", value: 3 }] },
      { text: "只复制文件，不破坏冰封现场", effects: [{ type: "event", value: "E202_archive_copied" }, { type: "change", key: "安柠好感", value: 2 }] }
    ]
  },
  {
    id: "E203",
    title: "看塔仪的旧简报",
    eventType: "narrative",
    description: "漂浮的看塔仪反复播放二十三年前的阶段性简报。简报最后一栏永久损坏，只留下没有完成的停顿。",
    choices: [
      { text: "收集简报残片，拼出课题被封存前的最后一天", effects: [{ type: "event", value: "一个课题是如何一步步被辜负的" }, { type: "change", key: "世界观信息", value: 2 }] },
      { text: "关闭看塔仪外放，降低回廊共振", effects: [{ type: "change", key: "谱鸣共振", value: -6 }, { type: "change", key: "宁溯好感", value: 2 }] }
    ]
  },
  {
    id: "E204",
    title: "冰封回廊的无名律者",
    eventType: "narrative",
    description: "外围回廊深处，一具冰封残奏比其他个体保存得更完整，面容像被冻在即将醒来的前一秒。",
    choices: [
      { text: "让阿缇娅为它补上最后一拍", effects: [{ type: "event", value: "无名律者的谱线残片" }, { type: "change", key: "阿缇娅共鸣", value: 4 }, { type: "change", key: "奏者健康", value: -3 }] },
      { text: "只取谱线残片，留待之后分析", effects: [{ type: "event", value: "无名律者的谱线残片" }, { type: "change", key: "世界观信息", value: 1 }] }
    ]
  },
  {
    id: "E205",
    title: "宁溯的私人房间",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "ch2_ningsu_best_route" }],
    description: "宁溯的房间陈设极简，唯一的私人物品是一本手写日记，记录六年驻守期间她如何一点点把自责写成制度。",
    choices: [
      { text: "合上日记，只问她愿意说哪一页", effects: [{ type: "change", key: "宁溯好感", value: 5 }, { type: "event", value: "宁溯完整背景独白" }] },
      { text: "记录日记里的关键日期", effects: [{ type: "change", key: "世界观信息", value: 2 }, { type: "event", value: "宁溯举报卡戎日期" }] }
    ]
  }
];

/* ───────────────────────────────────────────────────────────
   模块: CHAPTER3_WHITE_EVENT_POOL (第三章白谱院地图事件池)
   ─────────────────────────────────────────────────────────── */
const CHAPTER3_WHITE_EVENT_POOL = [
  {
    id: "E301",
    title: "待销毁柜的秘密",
    eventType: "minigame",
    minigameType: "文件分类",
    description: "档案室三层需要管理员权限验证。白谱院的文件系统死板、精确，也因此可以被预测。",
    choices: [
      { text: "完成部门/年份/密级三重归类", effects: [{ type: "event", value: "E301_file_sorting_success" }, { type: "change", key: "听证倾向值", value: 5 }, { type: "change", key: "沈知微好感", value: 2 }], nextScene: "ch3_white_012" },
      { text: "请柏舟协助取得临时权限", effects: [{ type: "event", value: "E301_baizhou_access_help" }, { type: "change", key: "听证倾向值", value: 3 }], nextScene: "ch3_white_012" }
    ]
  },
  {
    id: "E302",
    title: "肖像长廊的隐藏画像",
    eventType: "narrative",
    description: "历代指挥家肖像中，有一幅落款模糊的画像，构图习惯与主角母亲留下的手稿插图高度相似。",
    choices: [
      { text: "记录画像构图与母亲手稿的相似处", effects: [{ type: "event", value: "母亲可能曾以化名在此任教" }, { type: "change", key: "世界观信息", value: 2 }, { type: "change", key: "听证倾向值", value: 2 }] },
      { text: "询问温别克画像来源", effects: [{ type: "event", value: "温别克三十年前姑娘线索" }, { type: "change", key: "世界观信息", value: 3 }] }
    ]
  },
  {
    id: "E303",
    title: "学生食堂的闲谈",
    eventType: "narrative",
    description: "学生们小声讨论传说中的零号奏者计划，版本各异，夸张得像把历史嚼成了糖纸。",
    choices: [
      { text: "听完他们的误传，记下真实与传闻的差距", effects: [{ type: "event", value: "白谱院学生零号计划传闻" }, { type: "change", key: "世界观信息", value: 1 }] },
      { text: "用轻松话题缓和队伍压力", effects: [{ type: "change", key: "阿缇娅压力", value: -2 }, { type: "change", key: "弥洛压力", value: -2 }] }
    ]
  },
  {
    id: "E304",
    title: "弥洛的抉择：销毁还是留下",
    eventType: "relationship",
    unlock: [{ operator: "includes", value: "ch3_milo_archive_choice_seed" }],
    description: "弥洛拿着自己的早期实验档案，第一次不知道自由究竟该表现为保留，还是抹去。",
    choices: [
      { text: "留着它。你的过去不该被抹掉，也不该定义现在的你。", effects: [{ type: "event", value: "弥洛保留早期档案" }, { type: "change", key: "弥洛共鸣", value: 6 }, { type: "change", key: "听证倾向值", value: 3 }] },
      { text: "销毁它。有些账不用一直算下去。", effects: [{ type: "event", value: "弥洛销毁早期档案" }, { type: "change", key: "弥洛信任", value: 5 }] }
    ]
  },
  {
    id: "E305",
    title: "珏衡的休息室",
    eventType: "relationship",
    unlock: [{ operator: "includes", value: "珏衡现场观察报告" }],
    description: "战斗后，珏衡邀请队伍到休息室小坐。她的《自愿契约誓词》被夹在一本条例手册里，边角已经翻旧。",
    choices: [
      { text: "阅读她的自愿契约誓词", effects: [{ type: "event", value: "珏衡完整背景独白" }, { type: "change", key: "珏衡好感", value: 8 }], nextScene: "ch3_side_juheng_room" },
      { text: "只问她此刻怎么想", effects: [{ type: "event", value: "珏衡规则与成长独白" }, { type: "change", key: "珏衡好感", value: 6 }], nextScene: "ch3_side_juheng_room" }
    ]
  }
];

/* ───────────────────────────────────────────────────────────
   模块: CHAPTER3_EVENT_POOL (第三章地图事件池) | 行号: ~2919-2971
   ─────────────────────────────────────────────────────────── */
const CHAPTER3_EVENT_POOL = [
  {
    id: "E301",
    title: "无拍者的残响",
    eventType: "narrative",
    description: "战斗结束后，原地发现一小片未消散的黑银粒子。它像一枚没有重量的乐谱灰烬，靠近时会短暂传出模糊的旧时代广播。",
    choices: [
      { text: "记录下来交给玛伦研究", effects: [{ type: "change", key: "世界观信息", value: 2 }, { type: "event", value: "线索:无拍者残响" }] },
      { text: "让槐序来听", effects: [{ type: "change", key: "槐序压力", value: 5 }, { type: "event", value: "槐序听见无拍者残响" }] }
    ]
  },
  {
    id: "E302",
    title: "议会的问责",
    eventType: "narrative",
    description: "回声议会就和声盛典的损失召开质询会，要求队伍出席说明。礼仪厅的灯光很亮，亮到每一句话都像被放在谱架上审阅。",
    choices: [
      { text: "如实陈述", effects: [{ type: "event", value: "诚实陈述盛典之夜" }] },
      { text: "强调战斗的不可抗力", effects: [{ type: "change", key: "回声议会声望值", value: 3 }, { type: "event", value: "避重就轻" }] }
    ]
  },
  {
    id: "E303",
    title: "居民的感谢信",
    eventType: "narrative",
    description: "被保护撤离的居民送来感谢信和自制点心。纸张边缘有些皱，却比盛典请柬更像真实的掌声。",
    choices: [
      { text: "和队伍一起拆开感谢信", effects: [{ type: "change", key: "槐序压力", value: -3 }, { type: "change", key: "洛温压力", value: -3 }, { type: "change", key: "明弦压力", value: -3 }] }
    ]
  },
  {
    id: "E304",
    title: "明弦的过去碎片",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "明弦正式加入队伍" }],
    description: "茶歇时，明弦无意间提到自己机械臂的来历，又迅速转移话题。她说得太快，像怕那句话追上自己。",
    choices: [
      { text: "追问", effects: [{ type: "change", key: "明弦压力", value: 5 }, { type: "event", value: "明弦个人故事伏笔" }] },
      { text: "不追问，转移话题陪她聊别的", effects: [{ type: "change", key: "明弦共鸣", value: 4 }] }
    ]
  },
  {
    id: "E305",
    title: "槐序与明弦的和解契机",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "明弦已登场" }],
    description: "槐序与明弦难得单独交谈了几句。你没有听见全部内容，但她们离开时，气氛比长廊入口那一次缓和不少。",
    choices: [
      { text: "不打扰，旁观即可", effects: [{ type: "change", key: "槐序信任", value: 2 }, { type: "change", key: "明弦信任", value: 2 }, { type: "event", value: "槐序明弦关系缓和" }] }
    ]
  }
];

/* ═══════════════════════════════════════════════════════════════════
   模块: BATTLES (战斗/代价场景定义) | 行号: ~2972-3638
   功能: 定义所有战斗的场景参数、敌人属性、回合逻辑、可选行动
   被引用: startBattle()
   ⚠️ 战斗结构: { name, enemy, rounds, actions, costs, onWin/onLose }
   ═══════════════════════════════════════════════════════════════════ */
const BATTLES = {
  "ch1_fog_patrol": {
    id: "ch1_fog_patrol",
    name: "第一章｜雾中巡逻",
    narrativeReason: "雾茧站外围出现禁曲派踩点痕迹，弥洛建议先清理巡逻路线。",
    aftermath: "胜利后获得【禁曲派巡逻日志残页】，印证钟先生情报。",
    avoidable: true,
    bossPerformanceDescription: "回声巡查员的靴声在铁轨上分成两拍，雾啸者则藏在信号灯照不到的白雾里。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 3,
    enemy: "回声巡查员 ×2 / 雾啸者 ×3",
    backgroundImage: ASSETS.backgrounds.ch1MujianStationPlatform,
    enemyImages: [
      { src: ASSETS.enemies.ch1EchoPatrol, label: "回声巡查员", className: "swarm" },
      { src: ASSETS.enemies.ch1FogHowler, label: "雾啸者", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 3,
    goal: "三回合内摸清外围巡逻路线",
    goalType: "defeat",
    defeatTarget: 5,
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星刺击",
        actionPointCost: 1,
        effectSummary: "快速清除一名巡查员。",
        text: "阿缇娅的黑金光轨穿过白雾，巡查员胸前的编号牌被打出裂痕。",
        musicart: "阿缇娅",
        healthCost: 6,
        effect: (state) => { state.enemyDamage = (state.enemyDamage || 0) + 2; }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "低频索敌",
        actionPointCost: 1,
        effectSummary: "标记雾中敌人并减少反击。",
        text: "弥洛把长枪末端抵住铁轨，低频震动替你们勾出雾中脚步。",
        musicart: "弥洛",
        healthCost: 5,
        effect: (state) => { state.enemyConfused = true; state.enemyDamage = (state.enemyDamage || 0) + 1; }
      },
      节奏: {
        displayLabel: "双律者切拍",
        skillName: "切拍试奏",
        actionPointCost: 1,
        effectSummary: "推进合奏槽并造成稳定伤害。",
        text: "指挥棒在阿缇娅与弥洛之间切出半拍空隙，两条行动路线第一次没有互相干扰。",
        isConductorAction: true,
        healthCost: 4,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 1;
          state.ensembleGauge = Math.min((state.ensembleGauge || 0) + 25, 100);
        }
      }
    },
    enemyIntents: {
      1: "第1回合：巡查员试图标记车队位置。",
      2: "第2回合：雾啸者从站台顶棚下方扑击。",
      3: "第3回合：残余敌人准备向七号站台发送信号。"
    },
    enemyAction: (round, state) => state.enemyConfused ? "弥洛的低频扰乱了巡查员队形，雾中的脚步散开。" : "雾中靴声逼近，信号灯闪了两次不自然的红光。",
    winCondition: (state) => (state.enemyDamage || 0) >= 5,
    onWin: () => {
      addTriggeredEvent("禁曲派巡逻日志残页");
      GameState.弥洛信任 += 2;
      showScene("ch1_black_005");
    },
    onLose: () => showScene("ch1_black_005")
  },
  "ch1_silent_sequence_04": {
    id: "ch1_silent_sequence_04",
    name: "第一章｜静默序列-零四",
    narrativeReason: "静默序列-零四奉命回收尤娜，主角第一次直面禁曲派强制律者化体系。",
    aftermath: "零四撤离后掉落手写乐谱碎片，指向三十年前的黑暗巡演。",
    avoidable: false,
    bossPerformanceDescription: "她的眼睛里没有恨，也没有杀意；只有命令被执行时的空白。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 4,
    enemy: "静默序列-零四",
    backgroundImage: ASSETS.backgrounds.ch1Sequence04Confrontation,
    enemyImages: [
      { src: ASSETS.enemies.ch1SilentSequence04, label: "静默序列-零四", className: "boss" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 5,
    goal: "击退零四并保护尤娜",
    goalType: "defeat",
    defeatTarget: 8,
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星断令",
        actionPointCost: 1,
        effectSummary: "攻击零四的默令缝隙。",
        text: "阿缇娅的眼下谱纹亮起，暮星光刺穿过零四肩侧，却没有从她脸上打出任何表情。",
        musicart: "阿缇娅",
        healthCost: 8,
        effect: (state) => { state.enemyDamage = (state.enemyDamage || 0) + 2; state.ensembleGauge = Math.min((state.ensembleGauge || 0) + 12, 100); }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "铁轨低鸣",
        actionPointCost: 1,
        effectSummary: "压低零四突进速度。",
        text: "弥洛的长枪在铁轨上划过，低鸣让零四的步伐第一次慢了半拍。",
        musicart: "弥洛",
        healthCost: 7,
        effect: (state) => { state.enemyDelayed = true; state.enemyDamage = (state.enemyDamage || 0) + 1; state.ensembleGauge = Math.min((state.ensembleGauge || 0) + 18, 100); }
      },
      节奏: {
        displayLabel: "双律者合奏",
        skillName: "暮弦双鸣",
        actionPointCost: 2,
        effectSummary: "消耗合奏槽造成大量伤害，触发零四半拍迟疑。",
        text: "阿缇娅的指挥棒轨迹与弥洛的长枪轨迹在雾中交叠。零四的动作第一次出现迟滞，只有半拍。",
        musicart: "阿缇娅",
        healthCost: 10,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 4;
          state.enemyDelayed = true;
          state.ensembleGauge = 0;
          addTriggeredEvent("暮弦双鸣");
          GameState.阿缇娅共鸣 += 2;
          GameState.弥洛共鸣 += 2;
        }
      },
      指挥: {
        displayLabel: "奏者能力",
        skillName: "护住尤娜",
        actionPointCost: 0,
        effectSummary: "降低本轮威胁，恢复少量奏者健康。",
        text: "你把指挥棒压低，优先划出尤娜撤离路线。金色谱线沿站台边缘短暂亮起。",
        isConductorAction: true,
        healthCost: 0,
        effect: (state) => { state.protectedThisRound = true; GameState.奏者健康 = Math.min(GameState.奏者健康 + 2, 100); }
      }
    },
    enemyIntents: {
      1: "第1回合：零四锁定尤娜的吊坠。",
      2: "第2回合：零四尝试切断阿缇娅的防线。",
      3: "第3回合：零四执行默令回收程序。",
      4: "第4回合：雾中传来卡戎指挥棒敲击声。",
      5: "第5回合：零四准备撤离并带走目标。"
    },
    enemyAction: (round, state) => state.enemyDelayed ? "零四的动作慢了半拍，像听见某段被删掉的旋律。" : "零四无声突进，银灰瞳孔里没有任何可以交谈的东西。",
    winCondition: (state) => (state.enemyDamage || 0) >= 8,
    onWin: () => {
      addTriggeredEvent("零四的断裂节拍器");
      GameState.阿缇娅信任 += 3;
      showScene("ch1_black_006");
    },
    onLose: () => showScene("ch1_black_006")
  },
  "ch1_seluomi_trial": {
    id: "ch1_seluomi_trial",
    name: "第一章｜瑟萝弥验收战",
    narrativeReason: "瑟萝弥以“验收”之名试图夺走尤娜的选择权。",
    aftermath: "战斗结果决定尤娜暂缓收编、带伤守住，或埋下静默序列-零七伏笔。",
    avoidable: false,
    bossPerformanceDescription: "她不像零四那样空白。她每一次出枪都带着怜悯，而怜悯比杀意更难抵挡。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 4,
    enemy: "瑟萝弥",
    backgroundImage: ASSETS.backgrounds.ch1SeluomiStandoff,
    enemyImages: [
      { src: ASSETS.characters["瑟萝弥"].default, label: "瑟萝弥", className: "boss" },
      { src: ASSETS.enemies.ch1EchoPatrol, label: "回声巡查员", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 6,
    goal: "击退瑟萝弥并守住尤娜的名字",
    goalType: "defeat",
    defeatTarget: 10,
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星守名",
        actionPointCost: 1,
        effectSummary: "攻击并保护尤娜撤离线。",
        text: "阿缇娅把暮星光轨挡在尤娜与长枪之间，像在替一个名字写下边界。",
        musicart: "阿缇娅",
        healthCost: 9,
        effect: (state) => { state.enemyDamage = (state.enemyDamage || 0) + 2; state.protectedThisRound = true; }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "低频断裁",
        actionPointCost: 1,
        effectSummary: "制造瑟萝弥出枪破绽。",
        text: "弥洛的低频压住十字长枪的落点，碎石间的回响被迫慢下来。",
        musicart: "弥洛",
        healthCost: 8,
        effect: (state) => { state.enemyDamage = (state.enemyDamage || 0) + 2; state.enemyDelayed = true; }
      },
      节奏: {
        displayLabel: "双律者合奏",
        skillName: "暮弦双鸣",
        actionPointCost: 2,
        effectSummary: "合奏连携，重创瑟萝弥圣咏领域。",
        text: "金色与蓝白色光轨交叠，瑟萝弥的圣咏领域被撕开一道足够尤娜通过的缝。",
        musicart: "阿缇娅",
        healthCost: 12,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 4;
          addTriggeredEvent("暮弦双鸣");
          GameState.阿缇娅共鸣 += 2;
          GameState.弥洛共鸣 += 2;
        }
      },
      静默: {
        displayLabel: "奏者判断",
        skillName: "叫出尤娜的名字",
        actionPointCost: 0,
        effectSummary: "提高结局判定，降低收编风险。",
        text: "你没有喊编号。你喊的是尤娜。雾墙里，那枚吊坠的冷光短暂迟疑。",
        isConductorAction: true,
        healthCost: 0,
        effect: (state) => { state.protectedThisRound = true; addTriggeredEvent("尤娜仍被叫作尤娜"); }
      }
    },
    enemyIntents: {
      1: "P1 圣咏领域：全队承受怜悯压迫。",
      2: "P2 十字裁定：瑟萝弥试探阿缇娅防线。",
      3: "P3 管风琴回响：回声巡查员进入站台。",
      4: "P4 悲悯终章：瑟萝弥转为正面对决。",
      5: "瑟萝弥开始评估尤娜是否仍具备“收编价值”。",
      6: "雾墙后传来卡戎未落下的第三拍。"
    },
    enemyAction: (round, state) => state.protectedThisRound ? "尤娜撤离路线被守住，瑟萝弥第一次露出近乎沉默的停顿。" : "十字长枪擦过站台边缘，雾中的编号牌发出冰冷轻响。",
    winCondition: (state) => (state.enemyDamage || 0) >= 10,
    onWin: () => {
      const excellentOutcome = GameState.已触发事件.includes("ch1_seluomi_nonbattle_seed") || GameState.已触发事件.includes("尤娜仍被叫作尤娜") || GameState.已触发事件.includes("老潘助战");
      if (excellentOutcome) {
        addTriggeredEvent("暂缓的判决");
        GameState.阿缇娅共鸣 += 4;
        showScene("ch1_black_010_a");
        return;
      }
      addTriggeredEvent("用时间换来的时间");
      GameState.阿缇娅共鸣 += 2;
      showScene("ch1_black_010_b");
    },
    onLose: () => {
      if (GameState.已触发事件.includes("ch1_seluomi_direct_attack")) {
        addTriggeredEvent("被系统吞掉的名字");
        addTriggeredEvent("寻找并唤回零七");
        showScene("ch1_black_010_c");
        return;
      }
      addTriggeredEvent("用时间换来的时间");
      GameState.阿缇娅共鸣 += 2;
      showScene("ch1_black_010_b");
    }
  },
  "ch2_scoreheart_guardian": {
    id: "ch2_scoreheart_guardian",
    name: "第二章｜谱心监守者",
    narrativeReason: "冻谱观测塔核心舱前的自动守卫被唤醒，未完工原型律者外壳被嵌在晶体核心里。",
    aftermath: "击破谱心监守者后，宁溯会在核心舱门前正式拦截队伍。",
    avoidable: false,
    bossPerformanceDescription: "谱心监守者像一座漂浮的冰晶管风琴，所有攻击都先变成共振，再变成伤害。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 4,
    enemy: "谱心监守者",
    backgroundImage: ASSETS.backgrounds.ch2BossChamber,
    enemyImages: [
      { src: ASSETS.enemies.ch2ScoreheartGuardian, label: "谱心监守者", className: "boss" },
      { src: ASSETS.enemies.ch2FrozenResidual, label: "冰封残奏", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 6,
    goal: "击破谱心监守者并阻止核心自毁",
    goalType: "defeat",
    defeatTarget: 12,
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星碎冰",
        actionPointCost: 1,
        effectSummary: "切开晶体外壳，造成稳定伤害。",
        text: "阿缇娅的黑金光轨斩过冰晶谱架，未完工外壳里的微光短暂闪烁。",
        musicart: "阿缇娅",
        healthCost: 9,
        effect: (state) => { state.enemyDamage = (state.enemyDamage || 0) + 2; }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "低频止震",
        actionPointCost: 1,
        effectSummary: "降低谱鸣共振，减少本轮反击。",
        text: "弥洛把低音压入冰面，整座核心舱的玻璃风铃声被按低一层。",
        musicart: "弥洛",
        healthCost: 7,
        effect: (state) => {
          state.protectedThisRound = true;
          GameState.谱鸣共振 = Math.max((GameState.谱鸣共振 || 0) - 8, 0);
        }
      },
      节奏: {
        displayLabel: "双律者合奏",
        skillName: "暮弦冻响",
        actionPointCost: 2,
        effectSummary: "双律者合奏，重创核心并阻止一轮自毁。",
        text: "暮星与低鸣在冰蓝穹顶下交叠，谱心监守者胸腔里的原型外壳终于露出真正裂纹。",
        musicart: "阿缇娅",
        healthCost: 14,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 4;
          state.enemyDelayed = true;
          addTriggeredEvent("ch2_frozen_duet");
          GameState.阿缇娅共鸣 += 2;
          GameState.弥洛共鸣 += 2;
        }
      },
      音色: {
        displayLabel: "环境机关",
        skillName: "反向校准冰锥谱架",
        actionPointCost: 0,
        effectSummary: "若完成静音挑战，可利用冰锥谱架反制Boss。",
        text: "你按先前记录的安全节拍敲响冰锥谱架，Boss自己的共振被反向折回核心。",
        isConductorAction: true,
        healthCost: 0,
        requiresEvent: ["E201_success"],
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 2;
          state.enemyDelayed = true;
        }
      },
      静默: {
        displayLabel: "奏者能力",
        skillName: "强行压制自毁拍",
        actionPointCost: 1,
        effectSummary: "高代价压制，降低失败风险。",
        text: "你用未鸣压住核心自毁拍，右腕刻痕像被冰和火同时撕开。",
        isConductorAction: true,
        healthCost: 12,
        warning: true,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 2;
          state.enemyDelayed = true;
          GameState.谱鸣共振 = Math.max((GameState.谱鸣共振 || 0) - 5, 0);
        }
      }
    },
    enemyIntents: {
      1: "P1 冰晶外壳：防御高，测试入侵者谱线。",
      2: "P2 共振反击：谱鸣共振越高，奏者健康损耗越高。",
      3: "P3 原型律者外壳短暂共鸣。",
      4: "P4 核心过载，开始自毁式反扑。",
      5: "P5 冰锥谱架全域震动。",
      6: "终段：核心尝试把所有记录一起冻结销毁。"
    },
    enemyAction: (round, state) => {
      if (state.enemyDelayed) {
        state.enemyDelayed = false;
        return "谱心监守者的自毁拍被压住，冰晶谱架只发出一声短促裂响。";
      }
      const resonancePenalty = Math.floor((GameState.谱鸣共振 || 0) / 25);
      const temperaturePenalty = (GameState.体感温度 || 100) < 30 ? 2 : 0;
      if (!state.protectedThisRound && resonancePenalty > 0) {
        GameState.奏者健康 -= resonancePenalty + temperaturePenalty;
        return `共振反击沿着未鸣传回右腕，奏者健康额外-${resonancePenalty}${temperaturePenalty ? `；低温让指挥延迟，额外-${temperaturePenalty}` : ""}。`;
      }
      if (temperaturePenalty > 0) {
        GameState.奏者健康 -= temperaturePenalty;
        return `极寒让指尖慢了半拍，未鸣的回震没能完全卸开，奏者健康额外-${temperaturePenalty}。`;
      }
      return "谱心监守者旋转晶体外壳，蓝白光线像冻结管风琴一样扫过核心舱。";
    },
    winCondition: (state) => (state.enemyDamage || 0) >= 12,
    onWin: () => {
      addTriggeredEvent("谱心监守者已击破");
      GameState.世界观信息 += 2;
      showScene("ch2_snow_008");
    },
    onLose: () => {
      addTriggeredEvent("谱心监守者过载残留");
      GameState.奏者健康 -= 4;
      showScene("ch2_snow_008");
    }
  },
  "ch2_ningsu_guardian": {
    id: "ch2_ningsu_guardian",
    name: "第二章｜宁溯防御对峙",
    narrativeReason: "若队伍选择强攻，宁溯会启动守谱人防御协议。她几乎不主动进攻，每次护盾破裂都会暴露一段自责。",
    aftermath: "战斗不会让宁溯成为反派，只会把对峙锁定为被迫突破结局。",
    avoidable: false,
    bossPerformanceDescription: "宁溯站在核心舱门前，护盾碎片像冻结的道歉一样层层剥落。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 3,
    enemy: "宁溯 · 守谱人防御协议",
    backgroundImage: ASSETS.backgrounds.ch2CoreChamber,
    enemyImages: [
      { src: ASSETS.characters["宁溯"].battle, label: "宁溯", className: "boss" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 4,
    goal: "打破守谱人护盾，进入被迫突破路线",
    goalType: "defeat",
    defeatTarget: 7,
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星破盾",
        actionPointCost: 1,
        effectSummary: "击碎宁溯护盾。",
        text: "阿缇娅的刀光停在不会伤及宁溯的位置，只切开防御协议的外层。",
        musicart: "阿缇娅",
        healthCost: 8,
        effect: (state) => { state.enemyDamage = (state.enemyDamage || 0) + 2; }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "低频止步",
        actionPointCost: 1,
        effectSummary: "压住反制波，减少奏者损耗。",
        text: "弥洛没有攻击宁溯本人，只把反制波固定在门前。",
        musicart: "弥洛",
        healthCost: 6,
        effect: (state) => { state.protectedThisRound = true; state.enemyDamage = (state.enemyDamage || 0) + 1; }
      },
      静默: {
        displayLabel: "奏者判断",
        skillName: "停止争辩，强制开门",
        actionPointCost: 1,
        effectSummary: "高代价快速突破，但锁定低信任路线。",
        text: "你让未鸣指向核心舱门。宁溯眼神一沉，像六年前没能说出口的那句话终于碎了。",
        isConductorAction: true,
        healthCost: 10,
        warning: true,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 3;
          addTriggeredEvent("ch2_ningsu_forced_attack");
        }
      }
    },
    enemyIntents: {
      1: "护盾一层：未经许可不得接近核心舱。",
      2: "护盾二层：我不是在保护这栋楼。",
      3: "护盾三层：我是怕第二个卡戎出现。",
      4: "最终护盾：求你们，不要逼我做出六年前没做到的事。"
    },
    enemyAction: (round, state) => state.protectedThisRound ? "弥洛压住反制波，宁溯没有继续扩大防御协议。" : "宁溯的护盾反制未鸣，右腕刻痕传来冰冷刺痛。",
    winCondition: (state) => (state.enemyDamage || 0) >= 7,
    onWin: () => {
      addTriggeredEvent("ch2_ningsu_forced_attack");
      showScene("ch2_snow_010_c");
    },
    onLose: () => {
      addTriggeredEvent("ch2_ningsu_forced_attack");
      showScene("ch2_snow_010_c");
    }
  },
  "ch3_juheng_inspector": {
    id: "ch3_juheng_inspector",
    name: "第三章｜监察律者珏衡",
    narrativeReason: "听证会决裂后，珏衡奉命执行临时看管转移程序。她不是敌人，而是自愿站在制度内的律者。",
    aftermath: "战斗以珏衡主动停手并提交现场观察报告结束，不存在击杀或消散演出。",
    avoidable: true,
    bossPerformanceDescription: "珏衡的审谱杖像一把会发光的戒尺，每一击都带着规程、预兆和克制。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 4,
    enemy: "珏衡 · 监察律者",
    backgroundImage: ASSETS.backgrounds.ch3BossStandoff,
    enemyImages: [
      { src: ASSETS.characters["珏衡"].battle, label: "珏衡", className: "boss" },
      { src: ASSETS.enemies.ch3HallGuard, label: "礼堂卫队", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 5,
    goal: "坚持到珏衡主动停手，并证明阿缇娅无需强制看管",
    goalType: "defeat",
    defeatTarget: 10,
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星收束",
        actionPointCost: 1,
        effectSummary: "克制攻击，增加现场说服。",
        text: "阿缇娅的黑金光轨停在珏衡肩侧，没有继续切入要害。礼堂里有人第一次意识到：收手也是一种证据。",
        musicart: "阿缇娅",
        healthCost: 7,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 2;
          state.mercy = (state.mercy || 0) + 1;
          GameState.听证倾向值 += 4;
        }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "低频格挡",
        actionPointCost: 1,
        effectSummary: "按审谱杖节奏格挡，削弱规程护盾。",
        text: "弥洛没有反击，只用低频线把审谱杖的节拍一寸寸压回原处。",
        musicart: "弥洛",
        healthCost: 6,
        effect: (state) => {
          state.protectedThisRound = true;
          state.enemyDamage = (state.enemyDamage || 0) + 1;
          state.shieldWeakened = true;
          addTriggeredEvent("ch3_juheng_guard_timing");
        }
      },
      节奏: {
        displayLabel: "双律者合奏",
        skillName: "暮弦双鸣·收力演出",
        actionPointCost: 2,
        effectSummary: "伤害较低，但大幅提高珏衡动摇。",
        text: "暮星与低鸣交叠成一道光带。珏衡的审谱杖几乎脱手，她低声说：这不是失控者会有的默契，这是信任。",
        musicart: "阿缇娅",
        healthCost: 12,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 3;
          state.mercy = (state.mercy || 0) + 2;
          addTriggeredEvent("ch3_duet_restraint");
          GameState.珏衡好感 += 6;
          GameState.听证倾向值 += 8;
        }
      },
      音色: {
        displayLabel: "陈述证据",
        skillName: "递交行为记录",
        actionPointCost: 0,
        effectSummary: "若陈述编排优秀，直接削弱规程回响。",
        text: "你把证据按听证前夜排好的顺序递出。珏衡的动作第一次慢了半拍。",
        isConductorAction: true,
        healthCost: 0,
        requiresEvent: ["ch3_statement_order_excellent"],
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 2;
          GameState.听证倾向值 += 4;
        }
      },
      静默: {
        displayLabel: "奏者能力",
        skillName: "拒绝失控叙事",
        actionPointCost: 1,
        effectSummary: "高代价压住局面，避免演变为伤害竞赛。",
        text: "你把未鸣横在身前，没有命令进攻，只让全场听见一句话：我们不是来证明谁更强。",
        isConductorAction: true,
        healthCost: 10,
        warning: true,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 2;
          state.mercy = (state.mercy || 0) + 1;
          GameState.听证倾向值 += 3;
        }
      }
    },
    enemyIntents: {
      1: "P1 审谱杖连打：攻击有明确预兆，适合格挡。",
      2: "P2 规程回响：听证倾向值越低，护盾越硬。",
      3: "P3 职责与共情：若持续收力，珏衡会出现迟疑。",
      4: "P4 现场观察：她开始相信亲眼所见。",
      5: "收工：珏衡将决定是否停手。"
    },
    enemyAction: (round, state) => {
      if (state.protectedThisRound) {
        return "审谱杖被弥洛按在正确节拍上，规程回响短暂失去锋利。";
      }
      const hearingPenalty = GameState.听证倾向值 < 0 ? 3 : GameState.听证倾向值 < 30 ? 1 : 0;
      if (hearingPenalty > 0) {
        GameState.奏者健康 -= hearingPenalty;
        return `规程回响借着不利听证记录加压，奏者健康额外-${hearingPenalty}。`;
      }
      return "珏衡的审谱杖划出精确直线，攻击克制，却没有半分松懈。";
    },
    winCondition: (state) => (state.enemyDamage || 0) + ((state.mercy || 0) * 2) >= 10 || state.currentRound >= 5,
    onWin: () => {
      const fullyPersuaded = GameState.已触发事件.includes("ch3_duet_restraint") || GameState.听证倾向值 >= 35;
      addTriggeredEvent(fullyPersuaded ? "珏衡完全说服" : "珏衡部分动摇");
      addTriggeredEvent("珏衡现场观察报告");
      GameState.珏衡好感 += fullyPersuaded ? 10 : 5;
      showScene("ch3_white_011");
    },
    onLose: () => {
      addTriggeredEvent("珏衡恪尽职守伏笔");
      GameState.珏衡好感 += 2;
      showScene("ch3_white_011");
    }
  },
  "ch0_mute_score_moths": {
    id: "ch0_mute_score_moths",
    name: "第零章｜默谱飞蛾群",
    narrativeReason: "阿缇娅刚刚觉醒，默谱飞蛾被禁曲第四拍吸引，正扑向诺伊和失声镇民。",
    aftermath: "第一场战斗让玩家确认：律者技能并不免费，每一次命令都会消耗奏者健康。",
    avoidable: false,
    bossPerformanceDescription: "飞蛾翅膀像被雨泡坏的旧乐谱，拍动时没有声音，只把人的呼吸一点点刮薄。",
    availableMusicarts: ["阿缇娅"],
    defaultMusicarts: ["阿缇娅"],
    resonanceMax: 2,
    enemy: "默谱飞蛾 × 6",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    enemyImages: [
      { src: ASSETS.enemies.ch0MuteScoreMoth, label: "默谱飞蛾", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" }
    ],
    maxRounds: 3,
    goal: "坚持3回合，并保护诺伊与失声镇民撤离舞台",
    goalType: "protect",
    protectedLabel: "失声镇民",
    protected: 2,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星刺击",
        actionPointCost: 1,
        effectSummary: "清理单体飞蛾，降低本轮威胁。",
        text: "阿缇娅踏过积水，黑金裙摆像断裂乐谱一样扬起。暮星刺击贯穿最前方的默谱飞蛾。",
        musicart: "阿缇娅",
        healthCost: 5,
        effect: (state) => {
          state.enemyConfused = true;
          state.enemyDamage = (state.enemyDamage || 0) + 1;
        }
      },
      节奏: {
        displayLabel: "阿缇娅技能",
        skillName: "星屑护步",
        actionPointCost: 1,
        effectSummary: "替镇民挡下一次扑击。",
        text: "金色星屑沿着阿缇娅脚尖展开，镇民脚边短暂出现一圈五线谱护步。",
        musicart: "阿缇娅",
        healthCost: 6,
        effect: (state) => { state.protectedThisRound = true; }
      },
      指挥: {
        displayLabel: "奏者能力",
        skillName: "冷却呼吸",
        actionPointCost: 0,
        effectSummary: "暂缓反噬，恢复少量健康。",
        text: "你强迫自己按母亲留下的四拍呼吸。右腕刻痕的灼痛短暂退后半寸。",
        isConductorAction: true,
        healthCost: 0,
        effect: () => {
          GameState.奏者健康 = Math.min(GameState.奏者健康 + 3, 100);
        }
      }
    },
    enemyIntents: {
      1: "第1回合：飞蛾群试探性扑向诺伊手里的乐谱。",
      2: "第2回合：飞蛾群分成两股，一股绕向镇民撤离路线。",
      3: "第3回合：剩余飞蛾被阿缇娅的律者气息吸引，集中冲向舞台中央。"
    },
    enemyAction: (round, state) => {
      if (round === 2 && !state.protectedThisRound && !state.enemyConfused) {
        state.protected -= 1;
        return "默谱飞蛾擦过撤离队伍，一名镇民的声音刚恢复又被刮走半拍。";
      }

      if (state.protectedThisRound) {
        return "星屑护步挡住扑击，镇民在金色余光里继续撤离。";
      }

      if (state.enemyConfused) {
        return "飞蛾群被暮星刺击打乱队形，湿透的谱翼在空中碎成黑色纸屑。";
      }

      return "飞蛾群围着旧钢琴盘旋，像一场没有观众的错拍合唱。";
    },
    winCondition: (state) => state.protected > 0,
    onWin: () => {
      GameState.阿缇娅信任 += 3;
      addTriggeredEvent("ch0_moth_swarm_cleared");
      showScene("ch0_017_stage_crawler");
    },
    onLose: () => showScene("ch0_016_moth_swarm_tutorial")
  },
  "ch0_stage_crawler": {
    id: "ch0_stage_crawler",
    name: "第零章｜舞台爬行者",
    narrativeReason: "舞台爬行者拖着节拍器核心从红幕下爬出，试图把旧剧场重新拖回静默场。",
    aftermath: "弥洛以临时律者身份进入战斗，让玩家第一次体验双律者协同。",
    avoidable: false,
    bossPerformanceDescription: "它像失败演出残留下来的舞台机械，爬行时每一节木肢都在敲慢半拍。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 3,
    enemy: "舞台爬行者",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    enemyImages: [
      { src: ASSETS.enemies.ch0StageCrawler, label: "舞台爬行者", className: "boss" },
      { src: ASSETS.enemies.ch0BrokenBeatMarionette, label: "断拍木偶", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 4,
    goal: "在4回合内击破节拍器核心",
    goalType: "defeat",
    defeatTarget: 6,
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "断奏炮声",
        actionPointCost: 2,
        effectSummary: "重创节拍器核心。",
        text: "阿缇娅举起黑金指挥棒，断奏炮声穿过雨幕，正中节拍器核心。",
        musicart: "阿缇娅",
        healthCost: 10,
        effect: (state) => { state.enemyDamage = (state.enemyDamage || 0) + 3; }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "固定低鸣",
        actionPointCost: 1,
        effectSummary: "固定塌陷舞台，阻止Boss强化。",
        text: "弥洛把低鸣压进地板裂缝，舞台停止下陷，木偶线被迫绷直。",
        musicart: "弥洛",
        healthCost: 6,
        effect: (state) => { state.protectedThisRound = true; }
      },
      节奏: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星刺击",
        actionPointCost: 1,
        effectSummary: "削弱Boss并打乱下一次攻击。",
        text: "暮星刺击沿着木偶线逆行，爬行者的前肢在半拍里错位。",
        musicart: "阿缇娅",
        healthCost: 7,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 1;
          state.enemyConfused = true;
        }
      },
      音色: {
        displayLabel: "舞台机关",
        skillName: "追光灯照核",
        actionPointCost: 0,
        effectSummary: "支线机关：照出节拍器核心，造成额外破绽。",
        text: "旧剧场追光灯按照奥托留下的角度亮起。舞台爬行者胸腔里的节拍器核心被金色光束照穿。",
        isConductorAction: true,
        healthCost: 0,
        requiresEvent: ["ch0_spotlight_piano_ready", "ch0_spotlight_backstage_ready"],
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 2;
          state.enemyConfused = true;
          addTriggeredEvent("ch0_spotlight_used_stage_crawler");
        }
      },
      指挥: {
        displayLabel: "奏者能力",
        skillName: "标记节拍器核心",
        actionPointCost: 0,
        effectSummary: "下一次伤害更稳定。",
        text: "你用未鸣在空气中点出核心的位置。金线短暂缠住那枚暴走的节拍器。",
        isConductorAction: true,
        healthCost: 3,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 1;
        }
      }
    },
    enemyIntents: {
      1: "第1回合：舞台爬行者试图用木偶线缠住阿缇娅。",
      2: "第2回合：钢琴键重击即将砸向直线区域。",
      3: "第3回合：幕布遮光，命中会下降。",
      4: "第4回合：节拍器核心暴走，所有健康消耗增加。"
    },
    enemyAction: (round, state) => {
      if (round === 4 && !state.protectedThisRound) {
        GameState.奏者健康 -= 4;
        return "节拍器核心暴走，未鸣在你掌心震出血线，奏者健康额外-4。";
      }

      if (state.protectedThisRound) {
        return "弥洛的低鸣稳住舞台，爬行者的重击慢了半拍。";
      }

      if (state.enemyConfused) {
        return "舞台爬行者的木偶线缠进自己的前肢，错拍持续扩大。";
      }

      return "舞台爬行者拖着幕布逼近，湿木与旧琴键互相摩擦，像坏掉的鼓点。";
    },
    winCondition: (state) => (state.enemyDamage || 0) >= 6,
    winMessage: "节拍器核心裂开，黑色残片落进积水。弥洛的低鸣在最后一秒稳住了塌落舞台。",
    onWin: () => {
      GameState.阿缇娅信任 += 3;
      GameState.弥洛信任 += 2;
      addTriggeredEvent("黑色节拍器残片");
      showScene("ch0_018_teabreak_not_tiya");
    },
    onLose: () => showScene("ch0_017_stage_crawler")
  },
  "ch0_silence_hound": {
    id: "ch0_silence_hound",
    name: "第零章｜静默猎犬追迹",
    narrativeReason: "静默猎犬循着未鸣的契约刻痕追来。它不吞噬旋律，而是把所有活物逼回不敢发声的队形。",
    aftermath: "击退猎犬后，镇民确认静默署的追迹已经进入眠沙镇，第零章支线压力上升。",
    avoidable: true,
    avoidText: "可在地图事件中选择绕开追迹路线。",
    bossPerformanceDescription: "猎犬的肋骨像一排被折弯的弱音踏板，奔跑时会把雨声压成突然断掉的休止符。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 3,
    enemy: "静默猎犬 × 2",
    backgroundImage: ASSETS.backgrounds.ch0MianshaTownSquare,
    enemyImages: [
      { src: ASSETS.enemies.ch0SilenceHound, label: "静默猎犬", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 3,
    goal: "在3回合内切断追迹声纹",
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星钉线",
        actionPointCost: 1,
        effectSummary: "钉住猎犬追迹线，造成稳定伤害。",
        text: "阿缇娅将金色谱线钉入积水，静默猎犬的影子被短暂固定在广场地砖上。",
        musicart: "阿缇娅",
        healthCost: 6,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 2;
        }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "低鸣消迹",
        actionPointCost: 1,
        effectSummary: "压低猎犬追踪能力，保护镇民撤离。",
        text: "弥洛的低鸣铺过雨水，把猎犬鼻腔里的节拍声压成一条直线。",
        musicart: "弥洛",
        healthCost: 5,
        effect: (state) => {
          state.protectedThisRound = true;
          state.enemyConfused = true;
        }
      },
      指挥: {
        displayLabel: "奏者能力",
        skillName: "反向标记追迹",
        actionPointCost: 0,
        effectSummary: "用未鸣暴露追迹源头，但会牵动刻痕。",
        text: "你反手划出一枚短促休止符。右腕刺痛，猎犬却也暴露了追迹声纹的源头。",
        isConductorAction: true,
        healthCost: 3,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 1;
          GameState.世界观信息 += 1;
        }
      }
    },
    enemyIntents: {
      1: "第1回合：猎犬试图锁定未鸣刻痕。",
      2: "第2回合：猎犬绕向镇民撤离队尾。",
      3: "第3回合：追迹声纹回传静默署巡逻队。"
    },
    enemyAction: (round, state) => {
      if (round === 3 && !state.enemyConfused) {
        GameState.镇民恐惧 += 2;
        return "追迹声纹穿过雨幕回传，远处的静默署灯号亮了一下，镇民恐惧+2。";
      }

      if (state.protectedThisRound) {
        return "弥洛的低鸣遮住撤离队尾，猎犬扑进一片没有气味的静默里。";
      }

      if (state.enemyConfused) {
        return "静默猎犬失去追迹节拍，在封条之间来回撞出错乱的水花。";
      }

      GameState.奏者健康 -= 2;
      return "猎犬的弱音肋骨刮过你的右腕刻痕，奏者健康额外-2。";
    },
    winCondition: (state) => (state.enemyDamage || 0) >= 5,
    winMessage: "静默猎犬的追迹声纹断成三截，雨水把它们冲进旧钢琴下方的排水沟。",
    onWin: () => {
      GameState.镇民信任 += 2;
      GameState.弥洛信任 += 2;
      addTriggeredEvent("ch0_silence_hound_cleared");
      showScene("ch0_008_map_open");
    },
    onLose: () => {
      GameState.镇民恐惧 += 3;
      addTriggeredEvent("ch0_silence_hound_lost_trace");
      showScene("ch0_008_map_open");
    }
  },
  "ch0_sound_stripping_officer": {
    id: "ch0_sound_stripping_officer",
    name: "第零章｜剥音校尉",
    narrativeReason: "剥音校尉接管旧剧场主舞台，利用无声合唱与卡戎默令把镇民声音重新压回静默场。",
    aftermath: "击破它后，眠沙镇声音恢复，第零章进入尾声。",
    avoidable: false,
    bossPerformanceDescription: "它不是普通敌人，而是一道穿着军令外壳的静默机制，每一次挥手都像在删掉人的发声权。",
    availableMusicarts: ["阿缇娅", "弥洛"],
    defaultMusicarts: ["阿缇娅", "弥洛"],
    resonanceMax: 3,
    enemy: "剥音校尉",
    backgroundImage: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    enemyImages: [
      { src: ASSETS.enemies.ch0SoundStrippingOfficer, label: "剥音校尉", className: "boss" },
      { src: ASSETS.enemies.ch0VoicelessChoir, label: "失声唱诗班", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["阿缇娅"].transformed, label: "阿缇娅", className: "lead" },
      { src: ASSETS.characters["弥洛"].battle, label: "弥洛" }
    ],
    maxRounds: 5,
    goal: "打破静默场，救回镇民声音",
    goalType: "defeat",
    defeatTarget: 9,
    allowEarlyWin: true,
    actions: {
      旋律: {
        displayLabel: "阿缇娅技能",
        skillName: "暮星未完成",
        actionPointCost: 2,
        effectSummary: "清除静默军令并重创核心。",
        text: "阿缇娅第一次没有立刻执行战斗逻辑。她回头看了你一眼，然后把暮星未完成送进静默军令的裂缝。",
        musicart: "阿缇娅",
        healthCost: 14,
        requiresMinTrust: 25,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 4;
          state.enemyDelayed = true;
          GameState.阿缇娅共鸣 += 3;
        }
      },
      和声: {
        displayLabel: "弥洛技能",
        skillName: "低频封场",
        actionPointCost: 1,
        effectSummary: "压住无声合唱回盾。",
        text: "弥洛的低鸣像铁轨一样铺开，无声合唱的影子被压回舞台边缘。",
        musicart: "弥洛",
        healthCost: 7,
        effect: (state) => { state.protectedThisRound = true; }
      },
      节奏: {
        displayLabel: "阿缇娅技能",
        skillName: "断奏炮声",
        actionPointCost: 2,
        effectSummary: "造成稳定核心伤害。",
        text: "断奏炮声把剥音校尉胸腔里的节拍器打出裂纹，金色谱线顺着裂纹爬入。",
        musicart: "阿缇娅",
        healthCost: 11,
        effect: (state) => { state.enemyDamage = (state.enemyDamage || 0) + 3; }
      },
      音色: {
        displayLabel: "舞台机关",
        skillName: "追光灯照核",
        actionPointCost: 0,
        effectSummary: "支线机关：暴露剥音校尉核心并压制一次回盾。",
        text: "旧剧场追光灯撕开雨幕，照见剥音校尉胸腔内反向跳动的节拍器。无声合唱的回盾被迫停在半空。",
        isConductorAction: true,
        healthCost: 0,
        requiresEvent: ["ch0_spotlight_piano_ready", "ch0_spotlight_backstage_ready"],
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 2;
          state.protectedThisRound = true;
          state.enemyDelayed = true;
          addTriggeredEvent("ch0_spotlight_used_sound_stripping");
        }
      },
      静默: {
        displayLabel: "奏者能力",
        skillName: "强行改写默令",
        actionPointCost: 1,
        effectSummary: "高代价封印，快速推进胜利。",
        text: "你用未鸣强行改写卡戎留下的默令。右腕刻痕亮到近乎灼白，血管里像有金线反向生长。",
        isConductorAction: true,
        healthCost: 12,
        warning: true,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 3;
          GameState.世界失谐度 += 5;
        }
      },
      指挥: {
        displayLabel: "奏者能力",
        skillName: "让镇民补上自己的声音",
        actionPointCost: 0,
        effectSummary: "恢复防线并削弱静默场。",
        text: "你没有命令律者，而是让刚恢复声音的人们一起补上那一拍。静默场边缘开始松动。",
        isConductorAction: true,
        healthCost: 2,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 1;
          GameState.城邦稳定度 += 2;
        }
      }
    },
    enemyIntents: {
      1: "P1 静默军令：随机压制一名律者技能。",
      2: "P2 无声合唱：召唤失声唱诗班，为Boss回盾。",
      3: "P3 节拍器核心暴走：奏者健康消耗上升。",
      4: "P4 默令干涉：卡戎远程敲击指挥棒。",
      5: "终段：剥音校尉准备重新夺走全镇声音。"
    },
    enemyAction: (round, state) => {
      if (round === 2 && !state.protectedThisRound) {
        state.enemyDamage = Math.max((state.enemyDamage || 0) - 1, 0);
        return "无声合唱替剥音校尉回盾，已造成的裂纹被静默场抹去一部分。";
      }

      if (round >= 3 && !state.enemyDelayed) {
        GameState.奏者健康 -= 3;
        return "卡戎的默令穿过后台，你的心跳被迫补上缺失的一拍，奏者健康额外-3。";
      }

      if (state.protectedThisRound) {
        return "弥洛压住无声合唱，剥音校尉的回盾没有成形。";
      }

      return "剥音校尉抬手，镇民刚恢复的声音在喉咙口微微发抖。";
    },
    winCondition: (state) => (state.enemyDamage || 0) >= 9,
    winMessage: "静默场碎裂，镇民的声音像雨后第一道风一样回到眠沙镇。卡戎撤退，默令残页落在舞台积水中。",
    onWin: () => {
      GameState.阿缇娅共鸣 += 4;
      GameState.弥洛信任 += 3;
      addTriggeredEvent("默令残页");
      addTriggeredEvent("剥音节拍器");
      showScene("ch0_021_epilogue");
    },
    onLose: () => showScene("ch0_020_sound_stripping_boss")
  },
  "moth_swarm": {
    id: "moth_swarm",
    name: "音乐盒飞蛾群",
    narrativeReason: "一群音乐盒飞蛾涌向城邦边界，翅膀振动比正常快了半拍。你们必须保护瞭望塔结界。",
    aftermath: "这是候补校律者第一次正式出战，结果会影响城邦稳定与律者对你的初步判断。",
    avoidable: false,
    bossPerformanceDescription: "飞蛾群不像野兽袭击，更像坏掉的音乐盒试图完成最后一次旋转：越接近结界，振翅越急。",
    availableMusicarts: ["槐序", "洛温"],
    defaultMusicarts: ["槐序", "洛温"],
    resonanceMax: 3,
    enemy: "音乐盒飞蛾群",
    backgroundImage: ASSETS.backgrounds.graystringBattle,
    enemyImages: [
      { src: ASSETS.enemies.soundMothSwarm, label: "音乐盒飞蛾群", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["槐序"].battle, label: "槐序", className: "lead" },
      { src: ASSETS.characters["洛温"].battle, label: "洛温" }
    ],
    maxRounds: 3,
    goal: "坚持3回合，并保护瞭望塔结界不被突破",
    goalType: "protect",
    protectedLabel: "瞭望塔结界",
    protected: 1,
    actions: {
      旋律: {
        displayLabel: "槐序技能",
        skillName: "回身三拍",
        actionPointCost: 1,
        effectSummary: "旋转扫开飞蛾，扰乱空中队形。",
        text: "槐序以一个旋转完成攻击，裙摆扫过之处，飞蛾如纸屑般纷飞。",
        musicart: "槐序",
        healthCost: 8,
        effect: (state) => {
          state.enemyConfused = true;
          state.markedRound = state.currentRound + 1;
        }
      },
      节奏: {
        displayLabel: "槐序技能",
        skillName: "半拍游移",
        actionPointCost: 0,
        effectSummary: "预判下一次振翅轨迹，降低本轮结界风险。",
        text: "槐序退后半步，像把身体藏进半拍之后。下一次振翅的轨迹在她眼里提前显形。",
        musicart: "槐序",
        healthCost: 5,
        effect: (state) => { state.enemyConfused = true; }
      },
      和声: {
        displayLabel: "洛温技能",
        skillName: "固定低音",
        actionPointCost: 1,
        effectSummary: "提琴弦绷紧成弧形屏障，保护结界。",
        text: "洛温立桩般站定，提琴弦绷紧成一道弧形屏障。飞蛾撞上低音边界，振翅声短暂塌陷。",
        musicart: "洛温",
        healthCost: 5,
        requiresMinTrust: 30,
        effect: (state) => { state.protectedThisRound = true; }
      },
      指挥: {
        displayLabel: "洛温技能",
        skillName: "坚持节奏",
        actionPointCost: 0,
        effectSummary: "用稳定呼吸压住飞蛾群的错拍。",
        text: "洛温的呼吸和心跳比任何节拍器都准。结界边缘被重新压回同一条拍线上。",
        musicart: "洛温",
        healthCost: 3,
        effect: (state) => { state.protectedThisRound = true; }
      }
    },
    enemyIntents: {
      1: "第1回合：飞蛾群试探性逼近，振翅声不规则刺耳。",
      2: "第2回合：飞蛾群集中冲向结界薄弱点。",
      3: "第3回合：飞蛾群因连续受挫而振翅频率紊乱，开始自行溃散。"
    },
    ultimates: {
      槐序: {
        name: "未公开的独演",
        backgroundClass: "ultimate-huaixu",
        text: "槐序的裙摆在金色结界前短暂抬起。你几乎看见一场完整圆舞曲的开端，但她在最后一拍前收住了手。*还不是现在。* 飞蛾群像被看不见的扇骨切开，空中只剩泛黄乐谱般的碎光。",
        resultText: "槐序压住了飞蛾群的错拍，结界稳定度回升。",
        afterLine: "槐序说：『等你真正信任我的时候，再看完整的。』",
        effect: (state) => {
          state.enemyConfused = true;
          state.protectedThisRound = true;
          state.markedRound = state.currentRound;
        }
      }
    },
    enemyAction: (round, state) => {
      if (round === 2 && !state.protectedThisRound && !state.enemyConfused && state.markedRound !== round) {
        state.protected -= 1;
        return "飞蛾群集中冲向结界薄弱点，金色防御面被啃出一段不完整的缺口。";
      }

      if (round === 1) {
        return "飞蛾群试探性逼近，翅膀上的乐谱纹样发出细碎的错拍声。";
      }

      if (round === 2 && state.protectedThisRound) {
        return "洛温的低音屏障稳住结界，飞蛾群被迫散开。";
      }

      if (round === 2 && (state.enemyConfused || state.markedRound === round)) {
        return "槐序预判了振翅轨迹，飞蛾群冲进错误的半拍里。";
      }

      return "飞蛾群振翅频率逐渐紊乱，像坏掉的音乐盒终于转不动了。";
    },
    winCondition: (state) => state.protected > 0,
    onWin: () => {
      const beforeState = cloneData(GameState);
      GameState.城邦稳定度 += 5;
      GameState.奏者健康 += 10;
      updateUI();
      showStateChangeToasts(beforeState, GameState);
      showScene("ch1_008_win");
    },
    onLose: () => {
      const beforeState = cloneData(GameState);
      GameState.城邦稳定度 -= 3;
      addTriggeredEvent("瞭望塔受损");
      updateUI();
      showStateChangeToasts(beforeState, GameState);
      showScene("ch1_008_lose");
    }
  },
  "honor_guard_puppet": {
    id: "honor_guard_puppet",
    name: "破碎的仪仗木偶",
    narrativeReason: "长廊深处的仪仗木偶仍在复现旧日迎宾队列。它没有意识，却会把所有靠近者纳入走形的仪式。",
    aftermath: "木偶核心上的铭文会把调查推向白谱院与静默纪元旧史。",
    avoidable: false,
    bossPerformanceDescription: "仪仗木偶的攻击严格遵循“前进-转身-敬礼-攻击”的固定四拍循环。它越规整，破绽也越清晰。",
    availableMusicarts: ["槐序", "洛温", "伊芙白", "明弦"],
    defaultMusicarts: ["槐序", "明弦"],
    resonanceMax: 4,
    enemy: "破碎的仪仗木偶",
    backgroundImage: ASSETS.backgrounds.graystringBattle,
    enemyImages: [
      { src: ASSETS.enemies.offbeatBeast, label: "破碎的仪仗木偶", className: "large" }
    ],
    allyImages: [
      { src: ASSETS.characters["槐序"].battle, label: "槐序", className: "lead" },
      { src: ASSETS.characters["洛温"].battle, label: "洛温" },
      { src: ASSETS.characters["伊芙白"].battle, label: "伊芙白" },
      { src: ASSETS.characters["明弦"].battle, label: "明弦", className: "lead" }
    ],
    maxRounds: 5,
    goal: "5回合内击破仪仗木偶的四拍循环",
    goalType: "defeat",
    defeatTarget: 10,
    allowEarlyWin: true,
    winMessage: "仪仗木偶的四拍循环被切断，瓷面具后的机关核心暴露出来。",
    loseMessage: "仪仗木偶没有被击破。它完成了错误的敬礼，长廊深处的失谐回声因此变得更密。",
    actions: {
      旋律: {
        displayLabel: "槐序技能",
        skillName: "回身三拍",
        actionPointCost: 1,
        effectSummary: "标记四拍循环的弱拍，累积破绽。",
        text: "槐序以三拍圆舞切入木偶的四拍队列，裙摆掠过瓷面具裂纹，逼它慢了半拍。",
        musicart: "槐序",
        healthCost: 8,
        effect: (state) => {
          const predictionBonus = GameState.已触发事件.includes("honor_guard_prediction") && state.currentRound === 1 ? 1 : 0;
          state.enemyDamage = (state.enemyDamage || 0) + 2 + predictionBonus;
          state.markedRound = state.currentRound + 1;
        }
      },
      节奏: {
        displayLabel: "槐序技能",
        skillName: "半拍错身",
        actionPointCost: 0,
        effectSummary: "避开下一次敬礼攻击，并制造轻微破绽。",
        text: "槐序没有正面迎击，而是把身体藏进半拍之后。木偶的敬礼动作落空，关节发出细小裂响。",
        musicart: "槐序",
        healthCost: 5,
        effect: (state) => {
          state.enemyConfused = true;
          state.enemyDamage = (state.enemyDamage || 0) + 1;
        }
      },
      和声: {
        displayLabel: "明弦技能",
        skillName: "绯红轮舞",
        actionPointCost: 1,
        effectSummary: "回合越靠后，伤害越高。",
        text: "明弦的断刃划出猩红弧光，像是命运在你面前重新洗牌。越接近终局，那道红光越像无法回避的判决。",
        musicart: "明弦",
        healthCost: 10,
        effect: (state) => {
          const predictionBonus = GameState.已触发事件.includes("honor_guard_prediction") && state.currentRound === 1 ? 1 : 0;
          state.enemyDamage = (state.enemyDamage || 0) + 2 + Math.floor(state.currentRound / 2) + predictionBonus;
        }
      },
      静默: {
        displayLabel: "明弦技能",
        skillName: "命运之扣",
        actionPointCost: 2,
        effectSummary: "高健康代价，强力击破当前破绽，随回合递增。",
        text: "明弦的指挥棒精准地点向破绽。刹那的静止后，攻势如交响乐的强音骤然爆发，木偶队列第一次出现真正的断裂。",
        musicart: "明弦",
        healthCost: 15,
        requiresMinTrust: 25,
        effect: (state) => {
          const predictionBonus = GameState.已触发事件.includes("honor_guard_prediction") && state.currentRound === 1 ? 1 : 0;
          state.enemyDamage = (state.enemyDamage || 0) + 3 + state.currentRound + predictionBonus;
          state.enemyDelayed = true;
        }
      },
      指挥: {
        displayLabel: "洛温技能",
        skillName: "固定行进线",
        actionPointCost: 1,
        effectSummary: "稳定队列位置，减轻本轮攻击风险。",
        text: "洛温把低音压进长廊地面，替队伍划出一条不会被仪仗步伐吞没的行进线。",
        musicart: "洛温",
        healthCost: 5,
        effect: (state) => {
          state.protectedThisRound = true;
          state.enemyDamage = (state.enemyDamage || 0) + 1;
        }
      },
      音色: {
        displayLabel: "伊芙白技能",
        skillName: "即兴错拍",
        actionPointCost: 1,
        effectSummary: "扰乱木偶队列，制造破绽。",
        text: "伊芙白吹出一段故意不守规矩的短句。木偶队列被迫尝试理解它，整齐得可怕的踏步终于乱了一格。",
        musicart: "伊芙白",
        healthCost: 7,
        effect: (state) => {
          state.enemyConfused = true;
          state.enemyDamage = (state.enemyDamage || 0) + 2;
        }
      }
    },
    enemyIntents: {
      1: "第1回合：前进。木偶保持完美队列间距逼近。",
      2: "第2回合：转身。瓷面具裂纹随关节震动开合。",
      3: "第3回合：敬礼。错误仪式会锁定最靠前的律者。",
      4: "第4回合：攻击。固定四拍循环进入重音。",
      5: "第5回合：复位。若循环未断，它会把整段长廊拖回起始拍。"
    },
    ultimates: {
      明弦: {
        name: "赤命之扣",
        backgroundClass: "ultimate-huaixu",
        text: "明弦抬起指挥棒，猩红、纯白与墨黑在她身后像三束舞台光同时落下。你听见自己的脉搏被迫停在同一格里，等待那一下敲门声。*如果这就是命运，那我先动手。* 断刃随后落下，木偶完美的四拍队列被强行扣成一声短促的终止式。",
        resultText: "明弦的独演击碎了仪仗木偶的循环核心。",
        afterLine: "明弦说：『看清楚了吗？这才叫承担后果。』",
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 6;
          state.enemyDelayed = true;
        }
      }
    },
    enemyAction: (round, state) => {
      if (state.enemyDelayed) {
        state.enemyDelayed = false;
        return "木偶的四拍循环被强行扣住，攻击重音没有落下。";
      }

      if (state.enemyConfused) {
        return "木偶试图修正队列，却被错拍拖慢，瓷面具裂纹里漏出叹息般的气流。";
      }

      if (round === 3 && !state.protectedThisRound) {
        GameState.奏者健康 -= 5;
        return "木偶完成敬礼，错误仪式锁定了你的指挥节拍。你的手腕像被看不见的线扯了一下。";
      }

      if (round === 4 && !state.protectedThisRound) {
        GameState.奏者健康 -= 8;
        return "固定四拍进入攻击重音。木偶的权杖砸在镜面大理石上，震动沿着你的呼吸向上爬。";
      }

      return "仪仗木偶继续列队、转身、敬礼，像还在等待一位早已不存在的贵宾。";
    },
    winCondition: (state) => (state.enemyDamage || 0) >= 10,
    onWin: () => {
      const beforeState = cloneData(GameState);
      GameState.仪仗核心残片 += 1;
      GameState.世界观信息 += 1;
      if (activeBattle?.selectedMusicarts?.includes("槐序")) {
        addTriggeredEvent("槐序识别仪仗核心铭文");
      }
      updateUI();
      showStateChangeToasts(beforeState, GameState);
      showScene("ch2_004");
    },
    onLose: () => {
      const beforeState = cloneData(GameState);
      GameState.世界失谐度 += 3;
      GameState.明弦压力 += 5;
      addTriggeredEvent("仪仗木偶未完全击破");
      updateUI();
      showStateChangeToasts(beforeState, GameState);
      showScene("ch2_004");
    }
  },
  "beatless_conductor": {
    id: "beatless_conductor",
    name: "无拍者",
    narrativeReason: "和声盛典被无拍者打断。它正在指挥所有停摆瞬间组成幽灵乐团，台下居民必须先撤离。",
    aftermath: "这场战斗会决定和声盛典的伤亡记录，并揭开第一幕七分之一的真相。",
    avoidable: false,
    bossPerformanceDescription: "无拍者不是活物，也无法被真正杀死。正确处理方式是削弱其未完成乐章，并将它重新封入静止。",
    availableMusicarts: ["槐序", "洛温", "伊芙白", "明弦"],
    defaultMusicarts: ["槐序", "洛温"],
    resonanceMax: 4,
    enemy: "无拍者 · 幽灵乐团残骸",
    backgroundImage: ASSETS.backgrounds.fogportStage,
    enemyImages: [
      { src: ASSETS.enemies.noBeatBoss, label: "无拍者", className: "large" },
      { src: ASSETS.enemies.silenceParasite, label: "幽灵乐团残骸", className: "swarm" }
    ],
    allyImages: [
      { src: ASSETS.characters["槐序"].battle, label: "槐序", className: "lead" },
      { src: ASSETS.characters["洛温"].battle, label: "洛温" },
      { src: ASSETS.characters["伊芙白"].battle, label: "伊芙白" },
      { src: ASSETS.characters["明弦"].battle, label: "明弦", className: "lead" }
    ],
    maxRounds: 9,
    goal: "第一阶段保护3组居民撤离；第二阶段削弱并封印无拍者",
    goalType: "combo",
    evacuationTarget: 3,
    defeatTarget: 12,
    allowEarlyWin: true,
    protected: 3,
    winMessage: "无拍者被重新封入静止。指挥棒落地，发出最后一个终于落在正确节拍上的轻响。",
    loseMessage: "无拍者被迫退去，但盛典没能完整守住。台下留下太多来不及落下的掌声。",
    actions: {
      旋律: {
        displayLabel: "槐序技能",
        skillName: "重写光点",
        actionPointCost: 1,
        effectSummary: "疏散阶段推进撤离；交锋阶段削弱未完成乐章。",
        text: "槐序把三拍压进剧场的金色帷幕里，被无拍者抹去的光点短暂回到原处。",
        musicart: "槐序",
        healthCost: 9,
        effect: (state) => {
          if (state.currentRound <= 4) {
            const bonus = GameState.已触发事件.includes("beatless_stabilize_first") && state.currentRound === 1 ? 1 : 0;
            state.evacuated = Math.min((state.evacuated || 0) + 1 + bonus, state.config.evacuationTarget);
            state.enemyConfused = true;
            return;
          }
          state.enemyDamage = (state.enemyDamage || 0) + 3;
          state.enemyDelayed = true;
        }
      },
      和声: {
        displayLabel: "洛温技能",
        skillName: "低音避难线",
        actionPointCost: 1,
        effectSummary: "保护撤离队列，降低黑银粒子波及。",
        text: "洛温的低音弦在观众席前方绷紧，替撤离人群划出一条不会被黑银粒子吞没的避难线。",
        musicart: "洛温",
        healthCost: 7,
        effect: (state) => {
          if (state.currentRound <= 4) {
            state.evacuated = Math.min((state.evacuated || 0) + 1, state.config.evacuationTarget);
          } else {
            state.enemyDamage = (state.enemyDamage || 0) + 1;
          }
          state.protectedThisRound = true;
        }
      },
      音色: {
        displayLabel: "伊芙白技能",
        skillName: "错位引导",
        actionPointCost: 1,
        effectSummary: "偏转范围攻击，制造安全撤离窗口。",
        text: "伊芙白吹出一段故意错位的小调，黑银粒子追逐错误的音色，偏离了观众席出口。",
        musicart: "伊芙白",
        healthCost: 8,
        effect: (state) => {
          if (state.currentRound <= 4) {
            state.evacuated = Math.min((state.evacuated || 0) + 1, state.config.evacuationTarget);
          } else {
            state.enemyDamage = (state.enemyDamage || 0) + 2;
          }
          state.enemyConfused = true;
        }
      },
      节奏: {
        displayLabel: "明弦技能",
        skillName: "绯红断拍",
        actionPointCost: 1,
        effectSummary: "交锋阶段随回合递增封印进度。",
        text: "明弦的断刃划过无拍者的指挥轨迹，猩红弧光像把命运从错误小节里硬生生撬开。",
        musicart: "明弦",
        healthCost: 11,
        effect: (state) => {
          if (state.currentRound <= 4) {
            state.evacuated = Math.min((state.evacuated || 0) + 1, state.config.evacuationTarget);
            return;
          }
          state.enemyDamage = (state.enemyDamage || 0) + 2 + Math.floor((state.currentRound - 4) / 2);
        }
      },
      静默: {
        displayLabel: "槐序独演伏笔",
        skillName: "宿命三拍",
        actionPointCost: 2,
        effectSummary: "大幅削弱无拍者，清除未完成乐章层数。",
        text: "槐序的裙摆在黑银光尘里无声展开。三拍落下，那些被无拍者抹去的光点，正一点点被重新写回原处。",
        musicart: "槐序",
        healthCost: 14,
        requiresMinTrust: 30,
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 5;
          state.enemyDelayed = true;
          state.unfinishedStacks = 0;
          GameState.奏者健康 += 4;
          addTriggeredEvent("槐序完整独演展示");
        }
      },
      指挥: {
        displayLabel: "奏者能力",
        skillName: "尝试调律封印",
        actionPointCost: 1,
        effectSummary: "封印进度足够且居民撤离完成时，可结束战斗。",
        text: "你把所有残余节拍压向同一个静止点，试图让无拍者停在它终于能够停下来的地方。",
        healthCost: 10,
        isConductorAction: true,
        effect: (state) => {
          if ((state.evacuated || 0) >= state.config.evacuationTarget && (state.enemyDamage || 0) >= 10) {
            state.enemyDamage = state.config.defeatTarget;
            state.sealAttempted = true;
            addTriggeredEvent("无拍者调律封印成功");
            return;
          }
          state.enemyDamage = (state.enemyDamage || 0) + 1;
          state.enemyConfused = true;
        }
      }
    },
    enemyIntents: {
      1: "第1回合：黑银粒子扫向中央舞台前排。",
      2: "第2回合：幽灵乐团残骸开始自行发声。",
      3: "第3回合：无拍者进入指挥姿态，预告大范围攻击。",
      4: "第4回合：居民撤离最后窗口即将关闭。",
      5: "第5回合：无拍者转向正面交锋。",
      6: "第6回合：未完成的乐章开始叠加。",
      7: "第7回合：指挥棒将抹去舞台边缘的节拍。",
      8: "第8回合：幽灵乐团残骸全部逼近主旋律。",
      9: "第9回合：封印窗口即将关闭。"
    },
    ultimates: {
      槐序: {
        name: "宿命三拍",
        backgroundClass: "ultimate-huaixu",
        text: "时间仿佛被她的脚尖轻轻点住。银灰的裙摆在寂静中无声展开，像迟来了很多年的、终于完整的一支舞。她不再是在战斗。她是在回答。*这支舞，我欠了很久。* 第三拍落下时，整个剧场仿佛都听懂了这支迟到的圆舞曲。",
        resultText: "槐序清除了无拍者的未完成乐章层数，并把稳定分给全队。",
        afterLine: "槐序低声说：『……抱歉，让你们久等了。』",
        effect: (state) => {
          state.enemyDamage = (state.enemyDamage || 0) + 6;
          state.enemyDelayed = true;
          state.unfinishedStacks = 0;
          GameState.奏者健康 += 6;
          addTriggeredEvent("槐序完整独演展示");
        }
      }
    },
    enemyAction: (round, state) => {
      if (round <= 4) {
        if (state.protectedThisRound || state.enemyConfused) {
          return "黑银粒子被偏转，居民从舞台阶梯两侧继续撤离。";
        }
        GameState.城邦稳定度 -= 2;
        return "无拍者的指挥棒扫过观众席前排，撤离队列短暂混乱，城邦民心被刺痛了一下。";
      }

      if (state.enemyDelayed) {
        state.enemyDelayed = false;
        return "无拍者的指挥姿态被打断，幽灵乐团残骸发出空拍般的哑音。";
      }

      state.unfinishedStacks = (state.unfinishedStacks || 0) + 1;
      const damage = 2 + Math.min(state.unfinishedStacks, 3);
      GameState.奏者健康 -= damage;
      if (round === 6 || round === 9) {
        GameState.世界失谐度 += 2;
        return `未完成的乐章叠加成刺耳的不协和音。奏者健康-${damage}，世界失谐度+2。`;
      }
      return `幽灵乐团残骸随机激活，剧场里响起痛苦般的嗡鸣。奏者健康-${damage}。`;
    },
    winCondition: (state) => Boolean(state.sealAttempted && (state.evacuated || 0) >= state.config.evacuationTarget),
    onWin: () => {
      const beforeState = cloneData(GameState);
      GameState.城邦稳定度 += 10;
      GameState.槐序共鸣 += 5;
      GameState.洛温共鸣 += 5;
      GameState.伊芙白共鸣 += 5;
      GameState.明弦共鸣 += 5;
      addTriggeredEvent("无拍者已封入静止");
      updateUI();
      showStateChangeToasts(beforeState, GameState);
      showScene("ch3_006");
    },
    onLose: () => {
      const beforeState = cloneData(GameState);
      GameState.城邦稳定度 -= 8;
      GameState.槐序压力 += 5;
      GameState.洛温压力 += 5;
      GameState.伊芙白压力 += 5;
      GameState.明弦压力 += 5;
      addTriggeredEvent("盛典之殇");
      updateUI();
      showStateChangeToasts(beforeState, GameState);
      showScene("ch3_006");
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════
   模块: 存档系统 | 行号: ~3639-3687
   函数: saveGame(slot) — 保存到指定槽位
         loadGame(slot) — 从指定槽位加载
         autoSaveGame() — 自动保存到 autosave 槽位
   依赖: createSavePayload(), applySavePayload()
   ⚠️ 公共 API: saveGame/loadGame 被 UI 按钮直接调用
   ═══════════════════════════════════════════════════════════════════ */
function saveGame(slot) {
  if (slot === undefined || slot === null) {
    openSaveModal("save");
    return null;
  }

  const slotNumber = Number(slot);
  if (!isValidSlot(slotNumber)) {
    console.warn(`saveGame(): invalid slot ${slot}`);
    return null;
  }

  const payload = createSavePayload(`save_slot_${slotNumber}`);
  localStorage.setItem(`${SAVE_SLOT_PREFIX}${slotNumber}`, JSON.stringify(payload));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.GameState = GameState;
  refreshMenuButton();
  showToast(`存档槽 ${slotNumber} 已写入`, 1);
  console.log(`saveGame(${slotNumber}): saved`, cloneData(payload));
  return payload;
}

function loadGame(slot) {
  const key = slot === undefined || slot === null ? AUTOSAVE_KEY : `${SAVE_SLOT_PREFIX}${slot}`;
  const payload = readSavePayload(key);

  if (!payload) {
    GameState = cloneData(DEFAULT_GAME_STATE);
    loadedPlayTimeMs = 0;
    playSessionStartedAt = Date.now();
    window.GameState = GameState;
    console.log(`loadGame(${slot ?? "autosave"}): no save found, using defaults`, cloneData(GameState));
    updateUI();
    return GameState;
  }

  applySavePayload(payload);
  console.log(`loadGame(${slot ?? "autosave"}): loaded`, cloneData(payload));
  return GameState;
}

function autoSaveGame() {
  const payload = createSavePayload("autosave");
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  refreshMenuButton();
  return payload;
}

/* ───────────────────────────────────────────────────────────
   模块: updateUI (UI 状态刷新) | 行号: ~3688-3720
   功能: 将 GameState 的值同步到状态栏 DOM 显示
   被调用: 每次 GameState 变更后
   ⚠️ 修改注意: 状态栏图标使用 hydrateConfiguredIcons() 动态替换
   ─────────────────────────────────────────────────────────── */
function updateUI() {
  GameState.城邦稳定度 = clamp(GameState.城邦稳定度, 0, 100);
  GameState.世界失谐度 = clamp(GameState.世界失谐度, 0, 100);
  GameState.粮药 = clamp(GameState.粮药, 0, 99);
  GameState.音芯 = clamp(GameState.音芯, 0, 99);
  GameState.奏者健康 = clamp(GameState.奏者健康, 0, 100);
  GameState.槐序信任 = clamp(GameState.槐序信任, 0, 100);
  GameState.槐序共鸣 = clamp(GameState.槐序共鸣, 0, 100);
  GameState.槐序压力 = clamp(GameState.槐序压力, 0, 100);
  GameState.洛温信任 = clamp(GameState.洛温信任, 0, 100);
  GameState.洛温共鸣 = clamp(GameState.洛温共鸣, 0, 100);
  GameState.洛温压力 = clamp(GameState.洛温压力, 0, 100);
  GameState.阿缇娅信任 = clamp(GameState.阿缇娅信任, 0, 100);
  GameState.阿缇娅共鸣 = clamp(GameState.阿缇娅共鸣, 0, 100);
  GameState.阿缇娅压力 = clamp(GameState.阿缇娅压力, 0, 100);
  GameState.弥洛信任 = clamp(GameState.弥洛信任, 0, 100);
  GameState.弥洛共鸣 = clamp(GameState.弥洛共鸣, 0, 100);
  GameState.弥洛压力 = clamp(GameState.弥洛压力, 0, 100);
  GameState.安柠好感 = clamp(GameState.安柠好感, 0, 100);
  GameState.缇雅好感 = clamp(GameState.缇雅好感, 0, 100);
  GameState.诺伊好感 = clamp(GameState.诺伊好感, 0, 100);
  GameState.诺伊希望 = clamp(GameState.诺伊希望, 0, 100);
  GameState.诺伊恐惧 = clamp(GameState.诺伊恐惧, 0, 100);
  GameState.镇民信任 = clamp(GameState.镇民信任, 0, 100);
  GameState.镇民希望 = clamp(GameState.镇民希望, 0, 100);
  GameState.镇民恐惧 = clamp(GameState.镇民恐惧, 0, 100);
  GameState.白栖信任 = clamp(GameState.白栖信任, 0, 100);
  GameState.乌鸦先生信任 = clamp(GameState.乌鸦先生信任, 0, 100);
  GameState.伊芙白信任 = clamp(GameState.伊芙白信任, 0, 100);
  GameState.伊芙白共鸣 = clamp(GameState.伊芙白共鸣, 0, 100);
  GameState.伊芙白压力 = clamp(GameState.伊芙白压力, 0, 100);
  GameState.明弦信任 = clamp(GameState.明弦信任, 0, 100);
  GameState.明弦共鸣 = clamp(GameState.明弦共鸣, 0, 100);
  GameState.明弦压力 = clamp(GameState.明弦压力, 0, 100);
  GameState.白谱院声望值 = clamp(GameState.白谱院声望值, -99, 99);
  GameState.回声议会声望值 = clamp(GameState.回声议会声望值, -99, 99);
  GameState.世界观信息 = clamp(GameState.世界观信息, 0, 99);
  GameState.残留音核 = clamp(GameState.残留音核, 0, 99);
  GameState.仪仗核心残片 = clamp(GameState.仪仗核心残片, 0, 99);
  GameState.救赎值 = clamp(GameState.救赎值, 0, 100);
  GameState.归还值 = clamp(GameState.归还值, 0, 100);
  GameState.真相值 = clamp(GameState.真相值, 0, 100);
  GameState.伊莱娜隐藏好感值 = clamp(GameState.伊莱娜隐藏好感值, 0, 100);

  setText("stability-value", GameState.城邦稳定度);
  setText("discord-value", GameState.世界失谐度);
  setText("supply-value", GameState.粮药);
  setText("core-value", GameState.音芯);
  setText("health-value", GameState.奏者健康);
  updateStatusBarState();
  updateQuickActionButtons();
  scheduleWorldStateResolution();
}

/* ───────────────────────────────────────────────────────────
   模块: 世界状态结算 | 行号: ~3721-3773
   函数: scheduleWorldStateResolution() — 定时结算世界状态
         getConductorHealthTier() — 奏者健康分级
         getHealthTierPrompt() — 健康状态提示文本
   ⚠️ 公共 API: scheduleWorldStateResolution 被外部定时触发
   ─────────────────────────────────────────────────────────── */
function scheduleWorldStateResolution() {
  if (GameState.终局已触发 || activeInterfaceMode === "menu") {
    return;
  }

  const currentSceneId = GameState.当前场景ID || "";
  if (currentSceneId === "game_over_city_collapse" || currentSceneId === "ending_world_dissonance") {
    return;
  }

  // 茶歇期间不触发世界结算，避免AI对话被场景切换覆盖
  if (currentSceneId.startsWith("tea_break_")) {
    return;
  }

  const targetScene = GameState.城邦稳定度 <= 0
    ? "game_over_city_collapse"
    : GameState.世界失谐度 >= 100
      ? "ending_world_dissonance"
      : null;

  if (!targetScene || worldResolutionTimer) {
    return;
  }

  worldResolutionTimer = setTimeout(() => {
    worldResolutionTimer = null;
    if (GameState.终局已触发 || !SCENES[targetScene]) {
      return;
    }

    GameState.终局已触发 = true;
    activeBattle = null;
    showScene(targetScene);
  }, 0);
}

function getConductorHealthTier() {
  const health = Number(GameState.奏者健康 || 0);
  if (health >= 85) return "peak";
  if (health >= 65) return "good";
  if (health >= 45) return "fair";
  if (health >= 25) return "poor";
  return "critical";
}

function getHealthTierPrompt() {
  const tier = getConductorHealthTier();
  const prompts = {
    peak: "奏者呼吸稳定，指挥线条清晰。",
    good: "奏者状态良好，指挥仍能保持连贯。",
    fair: "奏者已经出现疲惫，复杂指挥会开始变慢。",
    poor: "奏者健康偏差明显，律者会听见你节拍里的不稳。",
    critical: "奏者接近临界，任何强行指挥都会让关系与战斗代价变重。"
  };
  return prompts[tier];
}

/* ═══════════════════════════════════════════════════════════════════
   模块: showScene (场景播放核心) | 行号: ~3774-3843
   功能: 场景切换与播放的中央入口 —— 渲染背景、角色立绘、播放对话序列
   参数: sceneId (场景ID，对应 SCENES 对象中的 key)
   调用链: showScene → normalizeDialogues → playDialogueSequence → showDialogue
   ⚠️ CAUTION: 整个游戏最核心的函数之一，修改前务必理解以下流程:
   1. 查找场景数据 (SCENES[sceneId])
   2. 检查条件 (checkSceneConditions)
   3. 更新场景标记 (updateRuntimeSceneFlags)
   4. 渲染背景 (fadeSceneBackground)
   5. 显示系统提示词
   6. 标准化对话 → 播放对话序列 → 显示选择
   ═══════════════════════════════════════════════════════════════════ */
function showScene(sceneId) {
  if (typeof VFXManager !== "undefined" && typeof VFXManager.transitionScene === "function") {
      let transitionType = 'planA';
      if (sceneId.includes("tea_break")) transitionType = 'planB';
      else if (sceneId.includes("chapter")) transitionType = 'planC';
      
      VFXManager.transitionScene(sceneId, transitionType, executeSceneChange);
  } else {
      executeSceneChange(sceneId);
  }
}

function executeSceneChange(sceneId) {
  console.log("executeSceneChange():", sceneId);
  clearTimeout(battleResultTimer);
  activeBattle = null;
  setInterfaceMode("scene");
  triggerInterfaceMotion("scene");
  triggerNoteBurst("scene");
  let scene = SCENES[sceneId];
  if (!scene) {
    console.warn(`showScene(): scene not found: ${sceneId}`);
    return;
  }

  const conditionResult = checkSceneConditions(scene);
  if (!conditionResult.allowed) {
    const fallbackSceneId = scene.fallbackScene || conditionResult.fallbackScene || "chapter1_start";
    console.warn(`showScene(): conditions failed for ${sceneId}, fallback to ${fallbackSceneId}`);
    showScene(fallbackSceneId);
    return;
  }

  scenePlaybackToken += 1;
  const playbackToken = scenePlaybackToken;
  clearTimeout(typewriterTimer);
  showChoices([]);
  addTriggeredEvent(sceneId);
  GameState.当前场景ID = sceneId;
  updateRuntimeSceneFlags(sceneId);
  updateUI();
  autoSaveGame();

  const backgroundElement = document.getElementById("scene-background");
  const descriptionElement = document.getElementById("description-text");
  const systemPromptElement = document.getElementById("system-prompt");

  fadeSceneBackground(backgroundElement, scene.background || "#1a1a2e", scene.backgroundImage);
  descriptionElement.textContent = scene.description || "";
  renderSystemPrompt(systemPromptElement, buildSceneSystemPrompt(scene));

  const dialogues = normalizeDialogues(scene);
  updateCharacterSprite(scene.defaultSpeaker || getFirstDialogueSpeaker(dialogues));
  playDialogueSequence(dialogues, 0, playbackToken, () => {
    if (scene.autoBattle) {
      const battle = BATTLES[scene.autoBattle];
      if (!battle) {
        console.warn(`showScene(): battle not found: ${scene.autoBattle}`);
        showChoices(buildSceneChoices(scene));
        return;
      }

      startBattle(battle);
      return;
    }

    showChoices(buildSceneChoices(scene));
  });
}

/* ───────────────────────────────────────────────────────────
   模块: showDialogue (对话显示) | 行号: ~3844-3876
   功能: 以打字机动画渲染单句对话到屏幕
   参数: speaker(发言者名), text(对话文本), onComplete(完成回调)
   ─────────────────────────────────────────────────────────── */
function showDialogue(speaker, text, onComplete) {
  const speakerElement = document.getElementById("speaker-name");
  const dialogueElement = document.getElementById("dialogue-text");
  const dialogueArea = document.getElementById("dialogue-area");
  const avatarElement = document.getElementById("character-avatar");

  clearPendingDialogueAdvance();
  clearTimeout(typewriterTimer);
  dialogueRevealToken += 1;
  const revealToken = dialogueRevealToken;

  // Clear stale GSAP tweens before rendering the next dialogue line.
  if (typeof gsap !== "undefined") {
    gsap.killTweensOf(dialogueElement);
    dialogueElement.querySelectorAll("*").forEach(function(child) {
      gsap.killTweensOf(child);
    });
    dialogueElement.style.opacity = "1";
  }
  if (dialogueElement._splitInstance) {
    dialogueElement._splitInstance.revert();
    dialogueElement._splitInstance = null;
  }

  speakerElement.textContent = speaker;
  dialogueElement.textContent = "";
  dialogueArea?.classList.add("is-dialogue-revealing");
  dialogueArea?.classList.remove("is-dialogue-advance-ready");
  applySpeakerPresentation(speaker, dialogueArea, avatarElement);
  triggerNoteBurst(speaker === "\u3010\u5185\u5fc3\u3011" ? "inner" : "dialogue");

  const finishReveal = () => {
    if (!activeDialogueReveal || activeDialogueReveal.token !== revealToken || activeDialogueReveal.done) {
      return;
    }
    activeDialogueReveal.done = true;
    dialogueArea?.classList.remove("is-dialogue-revealing");
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  activeDialogueReveal = {
    token: revealToken,
    element: dialogueElement,
    text,
    done: false,
    finish: finishReveal
  };

  console.log("[showDialogue]", speaker, ":", text ? text.slice(0, 60) : "(empty)");

  if (window.__skipNextGSAP) {
    window.__skipNextGSAP = false;
    dialogueElement.textContent = text;
    finishReveal();
    return;
  }

  if (typeof window.animateTextReveal !== "undefined") {
    window.animateTextReveal(dialogueElement, text, finishReveal);
  } else {
    // Fallback if script failed
    const characters = Array.from(text);
    let index = 0;
    function typeNextCharacter() {
      if (!activeDialogueReveal || activeDialogueReveal.token !== revealToken || activeDialogueReveal.done) {
        return;
      }
      if (index >= characters.length) {
        finishReveal();
        return;
      }
      dialogueElement.textContent += characters[index];
      index += 1;
      typewriterTimer = setTimeout(typeNextCharacter, runtimeTypewriterDelay);
    }
    typeNextCharacter();
  }
}

function completeActiveDialogueReveal() {
  if (!activeDialogueReveal || activeDialogueReveal.done) {
    return false;
  }

  const reveal = activeDialogueReveal;
  clearTimeout(typewriterTimer);
  if (typeof gsap !== "undefined") {
    gsap.killTweensOf(reveal.element);
    reveal.element.querySelectorAll("*").forEach(function(child) {
      gsap.killTweensOf(child);
    });
  }
  if (reveal.element._splitInstance) {
    reveal.element._splitInstance.revert();
    reveal.element._splitInstance = null;
  }
  reveal.element.textContent = reveal.text;
  reveal.finish();
  return true;
}

function clearPendingDialogueAdvance() {
  pendingDialogueAdvance = null;
  const dialogueArea = document.getElementById("dialogue-area");
  if (dialogueArea) {
    dialogueArea.classList.remove("is-dialogue-advance-ready");
    dialogueArea.removeAttribute("data-advance-label");
    dialogueArea.removeAttribute("role");
    dialogueArea.removeAttribute("tabindex");
  }
}

function setPendingDialogueAdvance(label, handler) {
  pendingDialogueAdvance = typeof handler === "function" ? handler : null;
  const dialogueArea = document.getElementById("dialogue-area");
  if (!dialogueArea) {
    return;
  }

  if (pendingDialogueAdvance) {
    dialogueArea.classList.add("is-dialogue-advance-ready");
    dialogueArea.dataset.advanceLabel = label || "\u70b9\u51fb\u7ee7\u7eed";
    dialogueArea.setAttribute("role", "button");
    dialogueArea.setAttribute("tabindex", "0");
  } else {
    dialogueArea.classList.remove("is-dialogue-advance-ready");
    dialogueArea.removeAttribute("data-advance-label");
    dialogueArea.removeAttribute("role");
    dialogueArea.removeAttribute("tabindex");
  }
}

function advanceDialogueFromBox() {
  if (completeActiveDialogueReveal()) {
    return;
  }
  if (typeof pendingDialogueAdvance === "function") {
    const advance = pendingDialogueAdvance;
    clearPendingDialogueAdvance();
    advance();
  }
}

function getChoiceConditionResult(choice) {
  const conditions = Array.isArray(choice?.conditions) ? choice.conditions : [];
  const failedCondition = conditions.find((condition) => !isConditionMet(condition));
  if (!failedCondition) {
    return { allowed: true, label: "" };
  }

  return {
    allowed: false,
    label: formatConditionLabel(failedCondition)
  };
}

function formatConditionLabel(condition) {
  if (!condition) {
    return "条件不足";
  }

  if (condition.operator === "includes") {
    return condition.label || `需要事件「${condition.value}」`;
  }

  if (condition.operator === "notIncludes") {
    return condition.label || `不能已触发「${condition.value}」`;
  }

  const key = condition.label || condition.key || "变量";
  const operator = condition.operator || "==";
  return `${key}${operator}${condition.value}`;
}

/* ───────────────────────────────────────────────────────────
   模块: showChoices (选择显示) | 行号: ~3877-3908
   功能: 渲染剧情选项按钮并绑定点击事件
   ⚠️ 被 apply_hooks.js Hook 1 注入 VFX 装饰代码
   修改此函数后需重新运行 `node apply_hooks.js`
   ─────────────────────────────────────────────────────────── */
function showChoices(choicesArray) {
  choicesArray = Array.isArray(choicesArray) ? choicesArray : [];
  const choicesArea = document.getElementById("choices-area");
  const choicesList = document.getElementById("choices-list") || choicesArea;
  choicesList.innerHTML = "";
  choicesArea.classList.toggle("has-choices", choicesArray.some((choice) => choice && choice.text));

  choicesArray.forEach((choice, index) => {
    if (!choice || !choice.text) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button motion-item";
    button.style.transitionDelay = `${140 + index * 120}ms`;
    const conditionResult = getChoiceConditionResult(choice);
    button.textContent = conditionResult.allowed ? choice.text : `${choice.text}（未满足：${conditionResult.label}）`;
    button.disabled = !conditionResult.allowed;
    button.addEventListener("click", () => {
      handleChoice(choice);
    });

    if (typeof VFXManager !== "undefined") {
      let variant = "gold";
      if (choice.text.includes("槐序")) variant = "huaixu";
      else if (choice.text.includes("洛温")) variant = "luowen";
      else if (choice.text.includes("摧毁") || choice.text.includes("代价")) variant = "crimson";
      VFXManager.bindSymphonyButton(button, variant);
    }

    choicesList.appendChild(button);
  });

  revealStaggeredItems(choicesList.querySelectorAll(".motion-item"));
}

/* ═══════════════════════════════════════════════════════════════════
   模块: 战斗系统核心 | 行号: ~3909-4137
   包含: startBattle(), renderBattle(), renderBattleVisuals(), renderBattleProgress(),
         renderBattleLog(), renderBattleActions(), handleBattleAction(), tryTriggerConcerto(),
         resolveBattleRound(), handleUltimateAction(), triggerUltimatePresentation(),
         finishBattle(), applyBattleCost() 等
   ⚠️ 公共 API: startBattle 被 showScene 调用（场景触发战斗）
   注意: 槐序独演最终通过 triggerUltimatePresentation() 调用 vfx.js 的 playHuaixuUltimate()
   ═══════════════════════════════════════════════════════════════════ */
function startBattle(config, options = {}) {
    if(window.AudioManager) { window.AudioManager.playBGM(config && config.id && config.id.includes('boss') ? 'battle_boss' : 'battle_normal'); }
  if (typeof config === "string") {
    config = BATTLES[config];
  }

  if (!config) {
    console.warn("startBattle(): missing battle config");
    return;
  }

  const selectedMusicarts = normalizeBattleMusicarts(config, options.selectedMusicarts);
  latestReactBattleLog = [];
  reactBattleLogSequence = 0;
  clearTimeout(typewriterTimer);
  clearTimeout(battleResultTimer);
  scenePlaybackToken += 1;
  setInterfaceMode("battle");
  triggerInterfaceMotion("battle");
  triggerNoteBurst("battle");
  const battleArea = document.getElementById("battle-area");
  if (battleArea) {
    battleArea.style.background = buildBackgroundLayer("#0a0f1e", config.backgroundImage);
  }

  activeBattle = {
    config,
    currentRound: 1,
    maxRounds: config.maxRounds || 1,
    protected: Number.isFinite(config.protected) ? config.protected : 0,
    initialProtected: Number.isFinite(config.protected) ? config.protected : 0,
    markedRound: null,
    protectedThisRound: false,
    enemyDelayed: false,
    enemyConfused: false,
    battleEnded: false,
    selectedMusicarts,
    resonanceGauge: 0,
    resonanceMax: config.resonanceMax || 3,
    enemyDamage: 0,
    usedUltimates: {},
    reactPhase: "entering",
    lastEnemyText: "威胁正在寻找节拍缺口。",
    nextEnemyIntent: getEnemyIntentText(config, 1)
  };

  addTriggeredEvent(`battle:${config.name}`);
  renderBattle();
  renderBattleLog([
    `为什么战斗：${config.narrativeReason || config.goal}`,
    `战后推进：${config.aftermath || "战斗结果将改变后续场景。"}`,
    config.avoidable ? `可以回避：${config.avoidText}` : "可以回避：否。",
    config.bossPerformanceDescription ? `扭曲演奏：${config.bossPerformanceDescription}` : "",
    `出战律者：${selectedMusicarts.join(" / ")}`,
    `第1轮开始。下一轮意图：${activeBattle.nextEnemyIntent}`
  ].filter(Boolean).join("\n"));
}

function renderBattle() {
  if (!activeBattle) {
    return;
  }

  const state = activeBattle;
  const config = state.config;

  setText("battle-name", config.name);
  setText("battle-enemy", `${config.enemy}｜当前：${state.lastEnemyText}｜意图：${state.nextEnemyIntent}`);
  renderBattleVisuals(config, state);
  renderBattleProgress(state);
  renderBattleActions(config.actions, state);
  syncReactBattleScreen();
  updateUI();
}

function renderBattleVisuals(config, state) {
  const enemyVisuals = document.getElementById("enemy-visuals");
  const allyVisuals = document.getElementById("ally-visuals");
  if (!enemyVisuals || !allyVisuals) {
    return;
  }

  const visualKey = JSON.stringify({
    enemies: config.enemyImages || [],
    allies: config.allyImages || [],
    selectedMusicarts: state.selectedMusicarts || []
  });
  if (enemyVisuals.dataset.visualKey === visualKey && allyVisuals.dataset.visualKey === visualKey) {
    return;
  }

  enemyVisuals.innerHTML = "";
  allyVisuals.innerHTML = "";
  enemyVisuals.dataset.visualKey = visualKey;
  allyVisuals.dataset.visualKey = visualKey;

  (config.enemyImages || []).forEach((image) => {
    enemyVisuals.appendChild(createBattleVisualImage(image, "enemy-visual"));
  });

  (config.allyImages || [])
    .filter((image) => state.selectedMusicarts.includes(image.label))
    .forEach((image) => {
    allyVisuals.appendChild(createBattleVisualImage(image, "ally-visual"));
  });
}

function createBattleVisualImage(image, baseClassName) {
  const figure = document.createElement("figure");
  figure.className = `${baseClassName} ${image.className || ""}`.trim();

  const img = document.createElement("img");
  img.src = image.src;
  img.alt = image.label || "";
  img.loading = "lazy";
  img.addEventListener("error", () => {
    figure.hidden = true;
  });

  const caption = document.createElement("figcaption");
  caption.textContent = image.label || "";

  figure.appendChild(img);
  figure.appendChild(caption);
  return figure;
}

function normalizeBattleMusicarts(config, selectedMusicarts) {
  const availableMusicarts = config.availableMusicarts || config.defaultMusicarts || [];
  const candidates = Array.isArray(selectedMusicarts) && selectedMusicarts.length > 0
    ? selectedMusicarts
    : config.defaultMusicarts || availableMusicarts;

  return candidates
    .filter((musicart, index, array) => availableMusicarts.includes(musicart) && array.indexOf(musicart) === index)
    .slice(0, 2);
}

function buildBattlePrepChoices(battleId) {
  const config = BATTLES[battleId];
  const choices = [{
    text: `选择2名律者出战｜当前：${normalizeBattleMusicarts(config, GameState.出战律者).join(" + ")}｜${buildBattleRiskSummary(normalizeBattleMusicarts(config, GameState.出战律者))}`,
    effect: () => showTeamSelect({ battleId })
  }];

  if (config.avoidable) {
    choices.push({
      text: `暂退回调律台｜${config.avoidText}`,
      effects: [
        { type: "change", key: "城邦稳定度", value: -2 },
        { type: "change", key: "槐序压力", value: -3 }
      ],
      nextScene: config.avoidScene || "chapter1_start"
    });
  }

  return choices;
}

function buildMusicartPairs(musicarts) {
  const pairs = [];
  for (let i = 0; i < musicarts.length; i += 1) {
    for (let j = i + 1; j < musicarts.length; j += 1) {
      pairs.push([musicarts[i], musicarts[j]]);
    }
  }
  return pairs;
}

function buildBattleRiskSummary(musicarts) {
  return musicarts.map((musicart) => {
    const rule = MUSICART_RULES[musicart];
    if (!rule) {
      return `${musicart}: 常规`;
    }

    const trust = GameState[rule.trustKey];
    const pressure = GameState[rule.pressureKey];
    const chance = Math.round(getDissonanceChance(rule) * 100);
    const riskText = chance > 0 ? `失调${chance}%` : "失调低";
    return `${musicart}: 信任${trust}/压力${pressure}/${riskText}`;
  }).join("；");
}

function showTeamSelect(options = {}) {
  pendingTeamSelection = {
    battleId: options.battleId || null,
    nextScene: options.nextScene || GameState.当前场景ID || "chapter1_start"
  };

  if (!GameState.奏者性别) {
    GameState.奏者性别 = "男";
  }

  const availableMusicarts = getTeamSelectableMusicarts();
  GameState.出战律者 = normalizeTeamSelection(GameState.出战律者, availableMusicarts);
  setInterfaceMode("team_select");
  resetTeamSelectDetailView();
  renderTeamSelect();
  showGlossaryHintIfFirstTime();
  updateUI();
}

/* 首次进入队伍选择时，复用 .team-risk-note 容器注入 2 行术语小字，3 秒淡出 */
function showGlossaryHintIfFirstTime() {
  if (GameState.术语已提示) return;
  GameState.术语已提示 = true;
  const note = document.getElementById("team-risk-note");
  if (!note) return;
  note.innerHTML = "律者：和音乐化身同行的战士 ｜ 奏者：你，调配节拍的人<br>失调：世界失序的累积 ｜ 共鸣：与律者的羁绊强度";
  note.classList.add("is-glossary");
  note.classList.remove("is-warning", "is-safe");
  setTimeout(() => {
    note.classList.remove("is-glossary");
    if (typeof renderTeamSelect === "function") renderTeamSelect();
  }, 3000);
}

function getTeamSelectableMusicarts() {
  const battle = pendingTeamSelection?.battleId ? BATTLES[pendingTeamSelection.battleId] : null;
  return battle?.availableMusicarts || Object.keys(MUSICART_PROFILES);
}

function resetTeamSelectDetailView() {
  const detailPage = document.getElementById("musicart-detail-page");
  const teamShell = document.querySelector(".team-select-shell");
  if (detailPage) {
    detailPage.hidden = true;
    detailPage.innerHTML = "";
  }
  if (teamShell) {
    teamShell.hidden = false;
  }
}

function normalizeTeamSelection(selectedMusicarts, availableMusicarts) {
  const selected = Array.isArray(selectedMusicarts) ? selectedMusicarts : [];
  const normalized = selected
    .filter((musicart, index, array) => availableMusicarts.includes(musicart) && array.indexOf(musicart) === index)
    .slice(0, 2);

  availableMusicarts.forEach((musicart) => {
    if (normalized.length < 2 && !normalized.includes(musicart)) {
      normalized.push(musicart);
    }
  });

  return normalized.slice(0, 2);
}

/* ═══════════════════════════════════════════════════════════════════
   模块: 队伍选择系统 | 行号: ~4138-5093
   公共 API: showTeamSelect(options) — 打开队伍选择界面
   包含: renderTeamSelect(), openMusicartDetail(), confirmTeamSelection(),
         openQuickTeaBreak(), updateQuickActionButtons(), buildMusicartPairs(),
         buildBattleRiskSummary(), buildConcertoHint(), buildMusicartDetailMarkup()
   ⚠️ 注意: 队伍选择的视觉样式在 style.css Team Dossier Override 区域
   ═══════════════════════════════════════════════════════════════════ */
function renderTeamSelect() {
  const listElement = document.getElementById("team-musicart-list");
  const riskElement = document.getElementById("team-risk-note");
  const confirmButton = document.getElementById("team-confirm-button");
  if (!listElement || !riskElement || !confirmButton) {
    return;
  }

  document.querySelectorAll(".conductor-toggle-button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.teamGender === GameState.奏者性别);
  });

  const availableMusicarts = getTeamSelectableMusicarts();
  listElement.innerHTML = "";

  availableMusicarts.forEach((musicart) => {
    const card = document.createElement("article");
    const isSelected = GameState.出战律者.includes(musicart);
    const rule = MUSICART_RULES[musicart];
    const profile = MUSICART_PROFILES[musicart] || { codename: "律者", concept: "音乐化身", avatar: musicart.slice(0, 1) };
    const chance = Math.round(getDissonanceChance(rule) * 100);
    const portrait = ASSETS.characters[musicart]?.battle || ASSETS.characters[musicart]?.default || "";
    const accent = AVATAR_STYLES[musicart]?.color || "var(--color-accent)";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", String(isSelected));
    card.setAttribute("aria-label", `${musicart}，点击切换出战，详情按钮打开资料页`);
    card.style.setProperty("--team-accent", accent);
    card.className = `team-musicart-card${isSelected ? " is-selected" : ""}${chance > 0 ? " is-risk" : ""}`;
    card.innerHTML = `
      <span class="team-card-visual">
        ${portrait ? `<img class="team-musicart-portrait" src="${escapeHTML(portrait)}" alt="">` : `<span class="team-musicart-avatar">${escapeHTML(profile.avatar)}</span>`}
        <span class="team-card-code">${escapeHTML(profile.avatar)} / ${escapeHTML(musicart)}</span>
        <span class="team-selection-mark">${isSelected ? "已编入" : "待命"}</span>
      </span>
      <span class="team-musicart-info">
        <span class="team-musicart-title-row">
          <strong class="team-musicart-name">${escapeHTML(musicart)}</strong>
          ${chance > 0 ? `<span class="team-risk-chip">失调 ${chance}%</span>` : ""}
        </span>
        <span class="team-musicart-meta">${escapeHTML(profile.codename)} · ${escapeHTML(profile.concept)}</span>
        <span class="team-stat-grid">
          <span>信任 <b>${GameState[rule.trustKey]}</b></span>
          <span>共鸣 <b>${GameState[rule.resonanceKey]}</b></span>
          <span>压力 <b>${GameState[rule.pressureKey]}</b></span>
        </span>
        <button type="button" class="team-detail-button" data-team-detail="${escapeHTML(musicart)}">查看详细资料</button>
      </span>
    `;
    card.addEventListener("click", () => toggleTeamMusicart(musicart));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleTeamMusicart(musicart);
      }
    });
    card.querySelector(".team-detail-button")?.addEventListener("click", (event) => {
      event.stopPropagation();
      openMusicartDetail(musicart);
    });
    listElement.appendChild(card);
  });

  const riskText = buildTeamRiskText(GameState.出战律者);
  riskElement.textContent = riskText.text;
  riskElement.classList.toggle("is-safe", riskText.safe);
  riskElement.classList.toggle("is-warning", !riskText.safe);
  confirmButton.disabled = GameState.出战律者.length !== 2;
}

function openMusicartDetail(musicart) {
  const detailPage = document.getElementById("musicart-detail-page");
  const teamShell = document.querySelector(".team-select-shell");
  if (!detailPage || !teamShell) {
    return;
  }

  detailPage.innerHTML = buildMusicartDetailMarkup(musicart);
  detailPage.hidden = false;
  teamShell.hidden = true;

  detailPage.querySelector("[data-detail-back]")?.addEventListener("click", () => closeMusicartDetail(musicart));
  detailPage.querySelector("[data-detail-toggle-team]")?.addEventListener("click", () => {
    toggleTeamMusicart(musicart);
    openMusicartDetail(musicart);
  });
}

function closeMusicartDetail(focusMusicart) {
  const detailPage = document.getElementById("musicart-detail-page");
  const teamShell = document.querySelector(".team-select-shell");
  if (!detailPage || !teamShell) {
    return;
  }

  detailPage.hidden = true;
  detailPage.innerHTML = "";
  teamShell.hidden = false;
  renderTeamSelect();

  if (focusMusicart) {
    const card = [...document.querySelectorAll(".team-musicart-card")]
      .find((item) => item.textContent?.includes(focusMusicart));
    card?.focus();
  }
}

function buildMusicartDetailMarkup(musicart) {
  const profile = MUSICART_PROFILES[musicart] || { codename: "律者", concept: "音乐化身", avatar: musicart.slice(0, 1) };
  const rule = MUSICART_RULES[musicart];
  const detail = MUSICART_DETAIL_PROFILES[musicart] || buildFallbackMusicartDetail(profile);
  const portrait = ASSETS.characters[musicart]?.default || ASSETS.characters[musicart]?.battle || "";
  const accent = AVATAR_STYLES[musicart]?.color || "#C49A45";
  const isSelected = GameState.出战律者.includes(musicart);
  const trust = rule ? Number(GameState[rule.trustKey] || 0) : 0;
  const resonance = rule ? Number(GameState[rule.resonanceKey] || 0) : 0;
  const pressure = rule ? Number(GameState[rule.pressureKey] || 0) : 0;
  const dissonanceChance = rule ? Math.round(getDissonanceChance(rule) * 100) : 0;
  const skillCards = detail.skillCards?.length ? detail.skillCards : buildDefaultSkillCards(profile);
  const keywords = detail.keywords?.length ? detail.keywords : [profile.codename, profile.concept, detail.role].filter(Boolean);

  return `
    <div class="musicart-detail-shell" style="--detail-accent:${escapeHTML(accent)}">
      <aside class="musicart-detail-sidebar">
        <button type="button" class="musicart-detail-back" data-detail-back>返回编队</button>
        <p class="musicart-detail-kicker">MUSICART FILE</p>
        <h2>${escapeHTML(musicart)}</h2>
        <span class="musicart-detail-en">${escapeHTML(detail.englishName || musicart)}</span>
        <div class="musicart-detail-faction">${escapeHTML(detail.faction || "未登记")}</div>
        <div class="musicart-detail-stars" aria-label="律者星级">★★★★★</div>
        <dl class="musicart-detail-stats">
          ${buildDetailStat("信任", trust)}
          ${buildDetailStat("共鸣", resonance)}
          ${buildDetailStat("压力", pressure)}
        </dl>
        <button type="button" class="musicart-detail-team-toggle" data-detail-toggle-team ${isSelected ? "disabled" : ""}>
          ${isSelected ? "已编入当前队伍" : "编入当前队伍"}
        </button>
        ${dissonanceChance > 0 ? `<p class="musicart-detail-warning">当前指挥失调风险 ${dissonanceChance}%</p>` : ""}
      </aside>

      <section class="musicart-detail-stage">
        <div class="musicart-detail-orbit" aria-hidden="true"></div>
        ${portrait ? `<img class="musicart-detail-portrait" src="${escapeHTML(portrait)}" alt="${escapeHTML(musicart)}立绘">` : ""}
      </section>

      <aside class="musicart-detail-info">
        <div class="musicart-detail-headerline">
          <span>${escapeHTML(profile.codename)}</span>
          <strong>${escapeHTML(profile.concept)}</strong>
        </div>
        <section class="musicart-detail-block">
          <h3>个人信息</h3>
          <p>${escapeHTML(detail.temperament || "资料仍在整理中。")}</p>
        </section>
        <section class="musicart-detail-block">
          <h3>战斗定位</h3>
          <p>${escapeHTML(detail.combatNote || detail.role || "基础战术资料尚未登记。")}</p>
        </section>
        <section class="musicart-detail-skill-section">
          <h3>Skill</h3>
          <div class="musicart-detail-skills">
            ${skillCards.map((skill) => `
              <article class="musicart-detail-skill">
                <strong>${escapeHTML(skill.name)}</strong>
                <span>${escapeHTML(skill.text)}</span>
              </article>
            `).join("")}
          </div>
        </section>
        <section class="musicart-detail-keywords" aria-label="关键词">
          ${keywords.map((keyword) => `<span>${escapeHTML(keyword)}</span>`).join("")}
        </section>
      </aside>
    </div>
  `;
}

function buildDetailStat(label, value) {
  const safeValue = clamp(value, 0, 100);
  return `
    <div class="musicart-detail-stat">
      <dt>${escapeHTML(label)}</dt>
      <dd><span style="width:${safeValue}%"></span><b>${safeValue}</b></dd>
    </div>
  `;
}

function buildFallbackMusicartDetail(profile) {
  return {
    englishName: profile.codename,
    faction: "队伍登记律者",
    role: profile.concept,
    temperament: "该角色已接入关系系统，详细资料可在后续内容中补充。",
    combatNote: `${profile.codename}的核心概念是${profile.concept}。当前页面会自动读取关系值、立绘和基础设定。`,
    keywords: [profile.codename, profile.concept],
    skillCards: buildDefaultSkillCards(profile)
  };
}

function buildDefaultSkillCards(profile) {
  return [
    { name: "基础调律", text: `${profile.codename}依据${profile.concept}参与战场节奏。` },
    { name: "关系判断", text: "信任、共鸣和压力会影响后续判定。" },
    { name: "个人故事", text: "更多资料会随主线和个人故事逐步开放。" }
  ];
}

function toggleTeamMusicart(musicart) {
  const selected = GameState.出战律者 || [];
  if (selected.includes(musicart)) {
    if (selected.length <= 2) {
      showToast("每次战斗必须带2名律者", -1);
      return;
    }
    GameState.出战律者 = selected.filter((item) => item !== musicart);
    renderTeamSelect();
    return;
  }

  if (selected.length >= 2) {
    GameState.出战律者 = [selected[1], musicart];
  } else {
    GameState.出战律者 = [...selected, musicart];
  }
  renderTeamSelect();
}

function buildTeamRiskText(selectedMusicarts) {
  const risks = selectedMusicarts
    .map((musicart) => {
      const rule = MUSICART_RULES[musicart];
      const chance = rule ? Math.round(getDissonanceChance(rule) * 100) : 0;
      return chance > 0 ? `${musicart} ${chance}%` : "";
    })
    .filter(Boolean);

  if (risks.length > 0) {
    return {
      safe: false,
      text: `警告：本次可能存在指挥失调风险（${risks.join("，")}）。${buildConcertoHint(selectedMusicarts)}`
    };
  }

  return {
    safe: true,
    text: `当前队伍无明显失调风险。${buildConcertoHint(selectedMusicarts)}带谁上场仍会影响压力和后续关系判断。`
  };
}

function buildConcertoHint(selectedMusicarts) {
  const pair = getCanonicalMusicartPair(selectedMusicarts || []);
  const rule = CONCERTO_RULES[pair.join("|")];
  if (!rule) {
    return "当前组合暂无已知协奏。";
  }

  const highTrustBonus = pair.every((musicart) => {
    const musicartRule = MUSICART_RULES[musicart];
    return musicartRule && Number(GameState[musicartRule.trustKey] || 0) >= 80;
  }) ? "高信任加成已生效。" : "信任80以上会提高触发率。";
  return `协奏：${rule.name}。${highTrustBonus}`;
}

function confirmTeamSelection() {
  if (!Array.isArray(GameState.出战律者) || GameState.出战律者.length !== 2) {
    showToast("请选择2名律者", -1);
    return;
  }

  const teamSelection = pendingTeamSelection || {};
  pendingTeamSelection = null;
  showToast(`出战律者：${GameState.出战律者.join(" / ")}`, 1);

  if (teamSelection.battleId) {
    startBattle(teamSelection.battleId, { selectedMusicarts: GameState.出战律者 });
    return;
  }

  showScene(teamSelection.nextScene || GameState.当前场景ID || "chapter1_start");
}

function returnFromTeamSelect() {
  const teamSelection = pendingTeamSelection || {};
  pendingTeamSelection = null;
  showScene(teamSelection.nextScene || GameState.当前场景ID || "chapter1_start");
}

function openQuickTeamSelect() {
  if (activeBattle) {
    showToast("战斗中不能调整出战队伍", -1);
    return;
  }

  showTeamSelect({ nextScene: GameState.当前场景ID || "chapter1_start" });
}

function openQuickTeaBreak() {
  if (activeBattle) {
    showToast("战斗中不能进入茶歇", -1);
    return;
  }

  if (activeInterfaceMode === "menu" || activeInterfaceMode === "team_select") {
    return;
  }

  GameState.茶歇返回场景 = GameState.当前场景ID || "chapter1_start";
  showScene("tea_break_hub");
}

function getChapterProgressForWorldMap() {
  const sceneId = GameState.当前场景ID || "";
  if ((GameState.已触发事件 || []).includes("chapter0_complete_isolated")) {
    return Math.max(1, Number(GameState.chapterProgress || 0));
  }

  const compactMatch = sceneId.match(/^ch(\d+)_/);
  if (compactMatch) {
    return Number(compactMatch[1]);
  }

  const chapterMatch = sceneId.match(/^chapter(\d+)_/);
  if (chapterMatch) {
    return Number(chapterMatch[1]);
  }

  return Number(GameState.chapterProgress || 0);
}

function syncWorldMapState() {
  GameState.currentSceneId = GameState.当前场景ID;
  GameState.chapterProgress = Math.max(Number(GameState.chapterProgress || 0), getChapterProgressForWorldMap());
  GameState.triggeredEvents = GameState.已触发事件 || [];
  window.GameState = GameState;
}

function openWorldMap() {
  if (activeBattle) {
    showToast("战斗中不能打开世界地图", -1);
    return;
  }

  clearTimeout(typewriterTimer);
  clearTimeout(battleResultTimer);
  clearTimeout(worldResolutionTimer);
  worldResolutionTimer = null;
  scenePlaybackToken += 1;
  syncWorldMapState();

  if (typeof window.renderReactWorldMapScreen !== "function" && window.location.protocol === "file:") {
    showToast("世界地图需要通过本地服务打开：npm run index:test", -1);
    return;
  }

  setInterfaceMode("world_map");

  const screenState = {
    gameState: GameState
  };

  if (typeof window.renderReactWorldMapScreen === "function") {
    window.renderReactWorldMapScreen(screenState);
  } else {
    window.__pendingReactWorldMapState = screenState;
  }
}

function showStartupScreen() {
  showMainMenu();
  openWorldMap();
}

function updateQuickActionButtons() {
  const quickActions = document.getElementById("quick-actions");
  if (!quickActions) {
    return;
  }

  const disableRelationshipActions = Boolean(activeBattle) || activeInterfaceMode === "menu" || activeInterfaceMode === "team_select";
  const teamButton = document.getElementById("quick-team-button");
  const worldMapButton = document.getElementById("quick-worldmap-button");
  const teaButton = document.getElementById("quick-tea-button");
  const saveButton = document.getElementById("quick-save-button");
  const loadButton = document.getElementById("quick-load-button");
  const menuButton = document.getElementById("quick-menu-button");

  if (teamButton) teamButton.disabled = disableRelationshipActions;
  if (worldMapButton) worldMapButton.disabled = Boolean(activeBattle) || activeInterfaceMode === "team_select";
  if (teaButton) teaButton.disabled = disableRelationshipActions;
  if (saveButton) saveButton.disabled = Boolean(activeBattle) || activeInterfaceMode === "menu" || activeInterfaceMode === "team_select";
  if (loadButton) loadButton.disabled = false;
  if (menuButton) menuButton.disabled = false;
}

function renderBattleProgress(state) {
  const labelElement = document.getElementById("battle-progress-label");
  const fillElement = document.getElementById("battle-progress-fill");
  if (!labelElement || !fillElement) {
    return;
  }
  const config = state.config;
  let label = "";
  let percent = 0;

  if (config.goalType === "protect") {
    const protectedLabel = config.protectedLabel || "市民";
    label = `已保护${protectedLabel}：${state.protected}/${state.initialProtected}｜独演共鸣：${state.resonanceGauge}/${state.resonanceMax}`;
    percent = state.initialProtected > 0 ? state.protected / state.initialProtected : 0;
  } else if (config.goalType === "survive") {
    const remainingRounds = Math.max(state.maxRounds - state.currentRound + 1, 0);
    label = `剩余回合：${remainingRounds}｜独演共鸣：${state.resonanceGauge}/${state.resonanceMax}`;
    percent = state.maxRounds > 0 ? (state.currentRound - 1) / state.maxRounds : 0;
  } else if (config.goalType === "defeat") {
    const target = config.defeatTarget || 1;
    const current = clamp(state.enemyDamage || 0, 0, target);
    label = `破绽压制：${current}/${target}｜调律轮次：${state.currentRound}/${state.maxRounds}｜独演共鸣：${state.resonanceGauge}/${state.resonanceMax}`;
    percent = target > 0 ? current / target : 0;
  } else if (config.goalType === "combo") {
    const evacTarget = config.evacuationTarget || 1;
    const defeatTarget = config.defeatTarget || 1;
    const evacuated = clamp(state.evacuated || 0, 0, evacTarget);
    const sealProgress = clamp(state.enemyDamage || 0, 0, defeatTarget);
    label = `居民撤离：${evacuated}/${evacTarget}｜封印进度：${sealProgress}/${defeatTarget}｜调律轮次：${state.currentRound}/${state.maxRounds}`;
    percent = ((evacuated / evacTarget) + (sealProgress / defeatTarget)) / 2;
  } else {
    label = `调律轮次：${state.currentRound}/${state.maxRounds}｜独演共鸣：${state.resonanceGauge}/${state.resonanceMax}`;
    percent = state.maxRounds > 0 ? (state.currentRound - 1) / state.maxRounds : 0;
  }

  labelElement.textContent = label;
  fillElement.style.width = `${Math.round(clamp(percent * 100, 0, 100))}%`;
}

function renderBattleLog(text) {
  const logElement = document.getElementById("battle-log");
  setReactBattleLogFromText(text);
  syncReactBattleScreen();
  if (!logElement) {
    return;
  }
  logElement.classList.remove("is-updating");
  void logElement.offsetWidth;

  // 卡片化渲染：把 \n\n 或 \n 分隔的文本拆成多段卡片
  // 根据内容关键词给卡片加语义色，提升信息可读性
  const segments = String(text || "").split(/\n\n+|\n/).map(s => s.trim()).filter(Boolean);

  if (segments.length <= 1) {
    // 单段：保持原 textContent 路径，兼容旧样式
    logElement.textContent = text || "";
  } else {
    logElement.innerHTML = segments.map(seg => {
      let cls = "battle-log-card";
      if (/失调|警告|危险|失败|崩溃|不可/.test(seg)) cls += " is-warning";
      else if (/代价|消耗|压力|健康|-\d/.test(seg)) cls += " is-cost";
      else if (/独演|共鸣|协奏|推进|成功/.test(seg)) cls += " is-result";
      else if (/第\s*\d+\s*轮|意图|开始/.test(seg)) cls += " is-round";
      return `<div class="${cls}">${escapeBattleLogHTML(seg)}</div>`;
    }).join("");
  }

  logElement.classList.add("is-updating");
  // 自动滚动到底部，让玩家看到最新一条
  logElement.scrollTop = logElement.scrollHeight;
}

/* 转义战斗日志中的 HTML 特殊字符，防止注入 */
function escapeBattleLogHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderBattleActions(actions, state) {
  const actionsArea = document.getElementById("battle-actions");
  const actionOrder = [
    { key: "旋律", icon: "melody", fallback: "♪", label: "① 槐序标记 [旋律]" },
    { key: "和声", icon: "harmony", fallback: "盾", label: "② 洛温护送 [和声]" },
    { key: "节奏", icon: "rhythm", fallback: "↷", label: "③ 延后节点 [节奏]" },
    { key: "音色", icon: "timbre", fallback: "雾", label: "④ 伊芙白改色 [音色]" },
    { key: "指挥", icon: "harmony", fallback: "令", label: "奏者能力 [稳拍]" },
    { key: "静默", icon: "silence", fallback: "∅", label: "⑤ 强制封印 [静默]" }
  ];

  if (!actionsArea) {
    return;
  }

  actionsArea.innerHTML = "";

  renderUltimateAction(actionsArea, state);

  actionOrder.forEach((actionMeta, index) => {
    const action = actions[actionMeta.key];
    if (!action || !isActionAvailableForSelectedMusicarts(action, state)) {
      return;
    }

    const button = document.createElement("button");
    const trustRequirement = getActionTrustRequirement(action);
    button.type = "button";
    button.className = `battle-action-button motion-item${action.warning ? " warning" : ""}`;
    button.style.transitionDelay = `${180 + index * 110}ms`;
    button.appendChild(createInlineIcon(actionMeta.icon, actionMeta.fallback, "battle-action-icon"));
    const label = document.createElement("span");
    label.className = "battle-action-label";
    const actionLabel = action.displayLabel || actionMeta.label;
    label.textContent = action.skillName ? `${actionLabel}｜${action.skillName}` : actionLabel;
    button.appendChild(label);
    const detail = document.createElement("span");
    detail.className = "battle-action-detail";
    detail.textContent = trustRequirement.met ? buildActionDetail(action) : `信任不足：需要${action.musicart}信任${action.requiresMinTrust}`;
    button.appendChild(detail);

    if (action.warning) {
      button.title = "代价：失谐+15，奏者健康-12";
    }

    if (!trustRequirement.met) {
      button.disabled = true;
      button.title = "当前关系不足，无法稳定执行该技能。";
    } else {
      button.addEventListener("click", () => {
        handleBattleAction(actionMeta.key);
      });
    }

    actionsArea.appendChild(button);
  });

  revealStaggeredItems(actionsArea.querySelectorAll(".motion-item"));
}

function renderUltimateAction(actionsArea, state) {
  const character = state.selectedMusicarts.find((musicart) => canUseUltimate(musicart, state));
  if (!character) {
    return;
  }

  const ultimate = state.config.ultimates[character];
  const button = document.createElement("button");
  button.type = "button";
  button.className = "battle-action-button ultimate motion-item";
  button.appendChild(createInlineIcon("melody", "独", "battle-action-icon"));

  const label = document.createElement("span");
  label.className = "battle-action-label";
  label.textContent = `独演｜${character}·${ultimate.name}`;
  button.appendChild(label);

  const detail = document.createElement("span");
  detail.className = "battle-action-detail";
  detail.textContent = `代价：共鸣槽${state.resonanceMax}/${state.resonanceMax}｜${ultimate.resultText}`;
  button.appendChild(detail);

  button.addEventListener("click", () => {
    handleUltimateAction(character);
  });
  actionsArea.appendChild(button);
}

function isActionAvailableForSelectedMusicarts(action, state) {
  if (action.requiresEvent && !isEventRequirementMet(action.requiresEvent)) {
    return false;
  }

  return action.isConductorAction || state.selectedMusicarts.includes(action.musicart);
}

function isEventRequirementMet(requirement) {
  const requiredEvents = Array.isArray(requirement) ? requirement : [requirement];
  return requiredEvents.some((eventId) => GameState.已触发事件.includes(eventId));
}

function getActionTrustRequirement(action) {
  if (!action.requiresMinTrust || action.isConductorAction || !action.musicart) {
    return { met: true };
  }

  const rule = MUSICART_RULES[action.musicart];
  if (!rule) {
    return { met: true };
  }

  return {
    met: Number(GameState[rule.trustKey] || 0) >= action.requiresMinTrust
  };
}

function buildActionDetail(action) {
  const extraCost = action.cost
    ? Object.entries(action.cost).map(([key, value]) => `${key}${key === "失谐" ? "+" : "-"}${value}`).join(" / ")
    : "无额外资源";
  const healthCost = Number.isFinite(action.healthCost) ? action.healthCost : 0;
  const actionPointCost = Number.isFinite(action.actionPointCost) ? action.actionPointCost : 1;
  const eventHint = action.requiresEvent ? "｜支线机关已接入" : "";
  return `代价：AP${actionPointCost} / 奏者健康-${healthCost} / ${extraCost}${eventHint}｜${action.effectSummary || "执行调律行动。"}`;
}

function handleBattleAction(actionKey) {
  if (!activeBattle || activeBattle.battleEnded) {
    return;
  }

  const state = activeBattle;
  const config = state.config;
  const action = config.actions[actionKey];
    if (action && window.AudioManager && action.character) {
        window.AudioManager.playMusicartSkill(action.character);
    }

  if (!action) {
    return;
  }

  const beforeState = cloneData(GameState);
  const beforeEnemyDamage = Number(state.enemyDamage || 0);
  const varianceResult = resolveCommandVariance(actionKey, action, state);

  if (varianceResult.triggered) {
    disableBattleActions();
    state.protectedThisRound = false;
    state.enemyConfused = false;
    varianceResult.effect(state);
    markReactBattleActionFeedback(action, state, beforeEnemyDamage);
    updateUI();
    showStateChangeToasts(beforeState, GameState);
    renderBattleLog(varianceResult.action.text);
    triggerNoteBurst(varianceResult.kind);

    battleResultTimer = setTimeout(() => {
      resolveBattleRound(varianceResult.action);
    }, 2200);
    return;
  }

  const costResult = applyBattleCost(action.cost || {});

  if (!costResult.ok) {
    showStateChangeToasts(beforeState, GameState);
    renderBattleLog(costResult.message);
    return;
  }

  disableBattleActions();
  state.protectedThisRound = false;
  state.enemyConfused = false;

  if (typeof action.effect === "function") {
    action.effect(state);
  }
  markReactBattleActionFeedback(action, state, beforeEnemyDamage);

  applyHealthBattlePressure(actionKey, action);
  gainBattleResonance(action);
  const concertoText = tryTriggerConcerto(action, state);

  updateUI();
  showStateChangeToasts(beforeState, GameState);
  renderBattleLog([action.text, concertoText].filter(Boolean).join("\n\n"));
  triggerNoteBurst(actionKey);

  battleResultTimer = setTimeout(() => {
    resolveBattleRound({
      ...action,
      text: [action.text, concertoText].filter(Boolean).join("\n\n")
    });
  }, 2000);
}

function markReactBattleActionFeedback(action, state, beforeEnemyDamage) {
  const damageDelta = Number(state.enemyDamage || 0) - Number(beforeEnemyDamage || 0);
  if (damageDelta > 0) {
    state.reactEnemyHitUntil = Date.now() + 180;
  }

  if (damageDelta >= 2 && action.musicart) {
    state.reactLastHighDamageMusicart = action.musicart;
    state.reactLastHighDamageId = `${action.musicart}-${Date.now()}`;
  }
}

function tryTriggerConcerto(action, state) {
  if (!action.musicart || action.isConductorAction || !state?.selectedMusicarts || state.selectedMusicarts.length !== 2) {
    return "";
  }

  const pair = getCanonicalMusicartPair(state.selectedMusicarts);
  const rule = CONCERTO_RULES[pair.join("|")];
  if (!rule) {
    return "";
  }

  const trustBonus = pair.every((musicart) => {
    const musicartRule = MUSICART_RULES[musicart];
    return musicartRule && Number(GameState[musicartRule.trustKey] || 0) >= 80;
  }) ? 0.3 : 0;
  const chance = 0.15 + trustBonus;

  if (Math.random() >= chance) {
    return "";
  }

  if (typeof rule.effect === "function") {
    rule.effect(state);
  }
  addTriggeredEvent(`协奏:${rule.name}`);
  return `${rule.text}\n触发率：${Math.round(chance * 100)}%。`;
}

function getCanonicalMusicartPair(selectedMusicarts) {
  return Object.keys(MUSICART_RULES).filter((musicart) => selectedMusicarts.includes(musicart)).slice(0, 2);
}

function gainBattleResonance(action) {
  if (!activeBattle || action.isConductorAction) {
    return;
  }

  activeBattle.resonanceGauge = clamp(activeBattle.resonanceGauge + 1, 0, activeBattle.resonanceMax);
}

function canUseUltimate(character, state) {
  return Boolean(
    state.config.ultimates
    && state.config.ultimates[character]
    && state.resonanceGauge >= state.resonanceMax
    && !state.usedUltimates[character]
  );
}

function handleUltimateAction(character) {
    if (window.AudioManager) {
        window.AudioManager.playSFX('solo');
        window.AudioManager.playMusicartSkill(character);
    }
  if (!activeBattle || activeBattle.battleEnded || !canUseUltimate(character, activeBattle)) {
    return;
  }

  const state = activeBattle;
  const ultimate = state.config.ultimates[character];
  const beforeState = cloneData(GameState);
  disableBattleActions();
  state.resonanceGauge = 0;
  state.usedUltimates[character] = true;

  if (typeof ultimate.effect === "function") {
    ultimate.effect(state);
  }

  triggerUltimatePresentation(ultimate);
  updateUI();
  showStateChangeToasts(beforeState, GameState);
  renderBattleLog([ultimate.text, ultimate.resultText, ultimate.afterLine].filter(Boolean).join("\n\n"));
  triggerNoteBurst("独演");

  battleResultTimer = setTimeout(() => {
    resolveBattleRound({
      text: [ultimate.resultText, ultimate.afterLine].filter(Boolean).join("\n"),
      musicart: character,
      healthCost: 0
    });
  }, 2800);
}

function triggerUltimatePresentation(ultimate) {
  const battleArea = document.getElementById("battle-area");
  if (!battleArea) {
    return;
  }

  const classNames = ["is-ultimate", ultimate.backgroundClass].filter(Boolean);
  battleArea.classList.add(...classNames);
  setTimeout(() => {
    battleArea.classList.remove(...classNames);
  }, 2100);
}

function resolveBattleRound(action) {
  if (!activeBattle || activeBattle.battleEnded) {
    return;
  }

  const state = activeBattle;
  const config = state.config;

  if (action.instant_win) {
    finishBattle(true, `${action.text}\n\n静默封印直接切断了断拍兽的行动。`);
    return;
  }

  const enemyText = typeof config.enemyAction === "function"
    ? config.enemyAction(state.currentRound, state)
    : "威胁没有新的行动。";
  const autonomousUltimateText = maybeTriggerAutonomousUltimate(state);

  state.lastEnemyText = [enemyText, autonomousUltimateText].filter(Boolean).join("\n\n");
  renderBattleLog(`${action.text}\n\n${state.lastEnemyText}`);

  if (config.goalType === "protect" && state.protected <= 0) {
    finishBattle(false, config.loseMessage || "防线崩溃。最后一名市民没能撤离灯渠。");
    return;
  }

  if (config.allowEarlyWin && typeof config.winCondition === "function" && config.winCondition(state)) {
    finishBattle(true, config.winMessage || "战斗目标已经达成。");
    return;
  }

  if (state.currentRound >= state.maxRounds) {
    const didWin = typeof config.winCondition === "function" ? Boolean(config.winCondition(state)) : true;
    finishBattle(didWin, didWin
      ? (config.winMessage || "断拍兽的冲锋窗口已经错过。市民撤离完成。")
      : (config.loseMessage || "回合耗尽，但防线没有守住。"));
    return;
  }

  state.currentRound += 1;
  state.protectedThisRound = false;
  state.nextEnemyIntent = getEnemyIntentText(config, state.currentRound, state);
  renderBattle();
  renderBattleLog(`${state.lastEnemyText}\n\n第${state.currentRound}轮开始。下一轮意图：${state.nextEnemyIntent}`);
}

function maybeTriggerAutonomousUltimate(state) {
  const character = state.selectedMusicarts.find((musicart) => {
    const rule = MUSICART_RULES[musicart];
    return rule
      && Number(GameState[rule.pressureKey] || 0) >= 90
      && state.config.ultimates?.[musicart]
      && !state.usedUltimates[musicart];
  });

  if (!character) {
    return "";
  }

  const rule = MUSICART_RULES[character];
  const ultimate = state.config.ultimates[character];
  state.usedUltimates[character] = true;
  state.resonanceGauge = 0;

  if (typeof ultimate.effect === "function") {
    ultimate.effect(state);
  }

  GameState[rule.pressureKey] = clamp(GameState[rule.pressureKey] + 8, 0, 100);
  addTriggeredEvent(`自主独演:${character}`);
  triggerUltimatePresentation(ultimate);
  triggerNoteBurst("独演");
  return `失调边缘：${character}没有等待你的指挥，自主发动独演。\n${ultimate.text}\n${ultimate.resultText}\n${character}压力+8。`;
}

function getEnemyIntentText(config, round, state = null) {
  if (typeof config.getEnemyIntent === "function") {
    return config.getEnemyIntent(round, state);
  }

  return config.enemyIntents?.[round] || "噬响体的污染乐句正在重组，下一轮意图不明。";
}

function finishBattle(isWin, message) {
  if (!activeBattle || activeBattle.battleEnded) {
    return;
  }

  const state = activeBattle;
  const config = state.config;
  state.battleEnded = true;
  state.reactPhase = "leaving";
  renderBattle();
  disableBattleActions();
  renderBattleLog(message);

  battleResultTimer = setTimeout(() => {
    activeBattle = null;
    clearReactBattleScreenFromLegacy();

    if (isWin && typeof config.onWin === "function") {
      config.onWin();
      return;
    }

    if (!isWin && typeof config.onLose === "function") {
      config.onLose();
    }
  }, 3000);
}

function applyBattleCost(cost) {
  if (!cost || Object.keys(cost).length === 0) {
    return { ok: true };
  }

  if (cost.音芯 && GameState.音芯 < cost.音芯) {
    return { ok: false, message: "音芯不足。奏者无法把这一拍推入安全位置。" };
  }

  if (cost.粮药 && GameState.粮药 < cost.粮药) {
    return { ok: false, message: "粮药不足。没有足够补给支撑这次行动。" };
  }

  Object.entries(cost).forEach(([key, value]) => {
    if (key === "失谐") {
      GameState.世界失谐度 += value;
      return;
    }

    GameState[key] -= value;
  });

  updateUI();
  return { ok: true };
}

function applyHealthBattlePressure(actionKey, action) {
  const baseCost = Number.isFinite(action.healthCost) ? action.healthCost : 4;
  const pressureMultiplier = GameState.奏者健康 < 35 ? 2 : GameState.奏者健康 < 60 ? 1.5 : 1;
  const healthCost = Math.ceil(baseCost * pressureMultiplier);
  GameState.奏者健康 -= healthCost;

  if (GameState.奏者健康 < 35) {
    GameState.槐序压力 += 3;
    activeBattle.lastEnemyText = `${actionKey}被勉强送出，律者听见了你呼吸里的断拍。`;
  }

  return healthCost;
}

function resolveCommandVariance(actionKey, action, state) {
  const rule = MUSICART_RULES[action.musicart];
  if (!rule) {
    return { triggered: false };
  }

  const chance = getDissonanceChance(rule);
  if (chance > 0 && Math.random() < chance) {
    return buildDissonanceResult(actionKey, action, rule);
  }

  if (GameState.奏者性别 === "未标注" && Math.random() < 0.04) {
    return buildResonanceOverloadResult(actionKey, action, rule);
  }

  return { triggered: false };
}

function getDissonanceChance(rule) {
  const conductorGender = GameState.奏者性别 === "男" ? "male" : GameState.奏者性别 === "女" ? "female" : null;
  if (!conductorGender || rule.gender !== conductorGender) {
    return 0;
  }

  const trust = Number(GameState[rule.trustKey] || 0);
  const pressure = Number(GameState[rule.pressureKey] || 0);

  if (pressure > 70 && trust < 50) {
    return 0.6;
  }

  if (trust < 25) {
    return 0.4;
  }

  if (trust < 40) {
    return 0.2;
  }

  return 0;
}

function buildDissonanceResult(actionKey, action, rule) {
  const character = action.musicart || "律者";
  const outcomes = [
    {
      text: `${character}没有等待你的节拍——律者反应先一步绷紧。你听见自己的心跳被拉进同一条拍线，然后一切提前了半拍。`,
      effect: (state) => { state.enemyDelayed = true; }
    },
    {
      text: `${character}把战斗乐句压到你的指挥之前。防线成形得太早，目标暂时安全了，但周围的失谐也被震醒。`,
      effect: (state) => {
        state.protectedThisRound = true;
        GameState.世界失谐度 += 4;
      }
    },
    {
      text: `${character}停在你的手势之外。技能没有响，只有对方肩上的压力提前落下。`,
      effect: () => {}
    }
  ];
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  const multiplier = 1.5 + Math.random() * 1.5;
  const healthCost = Math.max(1, Math.ceil((action.healthCost || 4) * multiplier));

  GameState.奏者健康 -= healthCost;
  GameState[rule.pressureKey] += 10;

  return {
    triggered: true,
    kind: "同频过载",
    action: {
      ...action,
      text: `${outcome.text}\n\n同频过载：${action.musicart}与你的性别共鸣过近，节拍短暂脱离安全缓冲。${action.musicart}压力+10，奏者健康-${healthCost}。`,
      instant_win: false
    },
    effect: outcome.effect
  };
}

function buildResonanceOverloadResult(actionKey, action, rule) {
  const baseCost = Number.isFinite(action.healthCost) ? action.healthCost : 4;
  const overloadCost = Math.max(1, Math.ceil(baseCost * (Math.random() < 0.5 ? 0.5 : 2)));

  GameState.奏者健康 -= overloadCost;
  GameState[rule.resonanceKey] += 2;

  return {
    triggered: true,
    kind: "共鸣超载",
    action: {
      ...action,
      text: `${action.text}\n\n共鸣超载：你的节拍没有固定性别标记，律者短暂接住了更宽的余音。${action.musicart}共鸣+2，奏者健康-${overloadCost}。`
    },
    effect: (state) => {
      if (typeof action.effect === "function") {
        action.effect(state);
      }
      state.enemyConfused = true;
    }
  };
}

function disableBattleActions() {
  document.querySelectorAll(".battle-action-button").forEach((button) => {
    button.disabled = true;
  });
}

function setInterfaceMode(mode) {
  activeInterfaceMode = mode;
  const isMenu = mode === "menu";
  const isTeamSelect = mode === "team_select";
  const isBattle = mode === "battle";
  const isWorldMap = mode === "world_map";
  document.getElementById("main-menu").hidden = !isMenu;
  document.getElementById("team-select-area").hidden = !isTeamSelect;
  document.getElementById("status-bar").hidden = isMenu || isTeamSelect || isWorldMap;
  document.getElementById("quick-actions").hidden = isMenu || isTeamSelect || isWorldMap;
  document.getElementById("scene-area").hidden = isMenu || isTeamSelect || isBattle || isWorldMap;
  document.getElementById("scene-description").hidden = isMenu || isTeamSelect || isBattle || isWorldMap;
  document.getElementById("dialogue-area").hidden = isMenu || isTeamSelect || isBattle || isWorldMap;
  document.getElementById("choices-area").hidden = isMenu || isTeamSelect || isBattle || isWorldMap;
  document.getElementById("battle-area").hidden = isMenu || isTeamSelect || isWorldMap || !isBattle;
  const worldMapArea = document.getElementById("world-map-area");
  if (worldMapArea) {
    worldMapArea.hidden = !isWorldMap;
  }
  if (!isWorldMap && typeof window.clearReactWorldMapScreen === "function") {
    window.clearReactWorldMapScreen();
  }
  updateQuickActionButtons();
}

function hydrateConfiguredIcons() {
  document.querySelectorAll("[data-icon-key]").forEach((element) => {
    const iconKey = element.dataset.iconKey;
    const iconPath = ASSETS.icons[iconKey];
    if (!iconPath || element.dataset.iconHydrated === "true") {
      return;
    }

    const fallback = element.textContent;
    element.textContent = "";
    element.appendChild(createInlineIcon(iconKey, fallback, "configured-icon"));
    element.dataset.iconHydrated = "true";
  });
}

function createInlineIcon(iconKey, fallbackText, className) {
  const wrapper = document.createElement("span");
  wrapper.className = `${className} inline-icon`;
  wrapper.textContent = fallbackText || "";

  const iconPath = ASSETS.icons[iconKey];
  if (!iconPath) {
    return wrapper;
  }

  const image = document.createElement("img");
  image.src = iconPath;
  image.alt = "";
  image.decoding = "async";
  image.loading = "lazy";
  image.addEventListener("load", () => {
    wrapper.classList.add("has-image");
    wrapper.textContent = "";
    wrapper.appendChild(image);
  }, { once: true });
  image.addEventListener("error", () => {
    wrapper.classList.remove("has-image");
  }, { once: true });
  return wrapper;
}

/* ═══════════════════════════════════════════════════════════════════
   模块: 音符粒子特效 (Canvas) | 行号: ~5094-5316
   函数: initNoteEffects(), resizeNoteEffectsCanvas(), runNoteEffects(),
         updateNoteEffects(), getAmbientNoteInterval(), spawnAmbientNote(),
         triggerNoteBurst(), addNoteParticle(), drawNoteParticle(), randomNoteGlyph()
   功能: 在 #note-effects-canvas 上渲染漂浮音符粒子的背景动画
   ⚠️ 被自动启动 (在初始化流程中使用 requestAnimationFrame)
   ═══════════════════════════════════════════════════════════════════ */
function initNoteEffects() {
  const canvas = document.getElementById("note-effects-canvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const effectImages = {};
  Object.entries(ASSETS.effects).forEach(([key, src]) => {
    const img = new Image();
    img.src = src;
    effectImages[key] = img;
  });

  noteEffects = {
    canvas,
    ctx,
    images: effectImages,
    particles: [],
    lastAmbientAt: 0,
    running: false,
    dpr: Math.min(window.devicePixelRatio || 1, 2)
  };

  resizeNoteEffectsCanvas();
  window.addEventListener("resize", resizeNoteEffectsCanvas);
  runNoteEffects();
}

function resizeNoteEffectsCanvas() {
  if (!noteEffects) {
    return;
  }

  const { canvas, dpr } = noteEffects;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
}

function runNoteEffects() {
  if (!noteEffects || noteEffects.running) {
    return;
  }

  noteEffects.running = true;
  let lastTime = performance.now();

  function frame(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    updateNoteEffects(dt, now);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function updateNoteEffects(dt, now) {
  const effects = noteEffects;
  if (!effects) {
    return;
  }

  const { canvas, ctx, dpr, particles } = effects;
  if (now - effects.lastAmbientAt > getAmbientNoteInterval()) {
    effects.lastAmbientAt = now;
    spawnAmbientNote();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    particle.age += dt;
    if (particle.age >= particle.life) {
      particles.splice(index, 1);
      continue;
    }

    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.rotation += particle.spin * dt;
    const progress = particle.age / particle.life;
    const alpha = Math.sin(progress * Math.PI) * particle.alpha;
    drawNoteParticle(ctx, particle, alpha, dpr);
  }
}

function getAmbientNoteInterval() {
  if (activeInterfaceMode === "battle") return 1400;
  if (activeInterfaceMode === "scene") return 1800;
  return 1100;
}

function spawnAmbientNote() {
  if (!noteEffects || noteEffects.particles.length > 70) {
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const fromLeft = Math.random() > 0.5;
  addNoteParticle({
    x: fromLeft ? -24 : width + 24,
    y: height * (0.18 + Math.random() * 0.58),
    vx: (fromLeft ? 1 : -1) * (10 + Math.random() * 18),
    vy: -12 - Math.random() * 18,
    size: 18 + Math.random() * 22,
    life: 5.2 + Math.random() * 1.8,
    alpha: 0.16 + Math.random() * 0.16,
    glyph: randomNoteGlyph(),
    color: Math.random() > 0.35 ? "#C49A45" : "#E8E0CC",
    spin: (Math.random() - 0.5) * 0.18,
    useImage: Math.random() > 0.55 ? "star" : ""
  });
}

function triggerNoteBurst(kind) {
  if (!noteEffects) {
    return;
  }

  const countMap = {
    scene: 10,
    dialogue: 3,
    inner: 2,
    battle: 16,
    旋律: 14,
    和声: 10,
    节奏: 12,
    音色: 14,
    静默: 18
  };
  const count = countMap[kind] || 6;
  const origin = getEffectOrigin(kind);

  for (let index = 0; index < count; index += 1) {
    const angle = -Math.PI * 0.9 + Math.random() * Math.PI * 0.8;
    const speed = 38 + Math.random() * 90;
    const isWarning = kind === "静默";
    addNoteParticle({
      x: origin.x + (Math.random() - 0.5) * origin.spread,
      y: origin.y + (Math.random() - 0.5) * origin.spread * 0.4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 18 + Math.random() * 30,
      life: 1.2 + Math.random() * 1.2,
      alpha: isWarning ? 0.48 : 0.38,
      glyph: randomNoteGlyph(),
      color: isWarning ? "#9B2335" : (Math.random() > 0.42 ? "#C49A45" : "#E8E0CC"),
      spin: (Math.random() - 0.5) * 1.8,
      useImage: Math.random() > 0.72 ? "spark" : ""
    });
  }
}

function getEffectOrigin(kind) {
  const selectors = {
    scene: "#scene-area",
    dialogue: "#dialogue-area",
    inner: "#dialogue-area",
    battle: "#battle-visuals",
    旋律: "#battle-actions",
    和声: "#battle-visuals",
    节奏: "#battle-progress-panel",
    音色: "#battle-visuals",
    静默: "#battle-header"
  };
  const element = document.querySelector(selectors[kind] || "#game-container");
  const rect = element ? element.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  return {
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.45,
    spread: Math.max(60, Math.min(rect.width, rect.height, 260))
  };
}

function addNoteParticle(particle) {
  if (!noteEffects) {
    return;
  }

  if (noteEffects.particles.length > 90) {
    noteEffects.particles.splice(0, noteEffects.particles.length - 90);
  }

  noteEffects.particles.push({
    age: 0,
    rotation: Math.random() * Math.PI * 2,
    ...particle
  });
}

function drawNoteParticle(ctx, particle, alpha, dpr) {
  const x = particle.x * dpr;
  const y = particle.y * dpr;
  const size = particle.size * dpr;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(particle.rotation);

  const image = particle.useImage ? noteEffects.images[particle.useImage] : null;
  if (image && image.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, -size * 0.5, -size * 0.5, size, size);
  } else {
    ctx.font = `${Math.round(size)}px Georgia, serif`;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 12 * dpr;
    ctx.fillText(particle.glyph, -size * 0.32, size * 0.28);
  }

  ctx.restore();
}

function randomNoteGlyph() {
  const glyphs = ["♪", "♫", "♩", "♬", "𝄞"];
  return glyphs[Math.floor(Math.random() * glyphs.length)];
}

/* ───────────────────────────────────────────────────────────
   模块: 界面动效系统 | 行号: ~5317-5397
   函数: triggerInterfaceMotion(mode) — 根据模式触发不同界面动效
         revealStaggeredItems(items) — 交错显示列表项
         shouldDelayMenuMotionForOpening() — 判断是否需要延迟菜单动效
   被引用: 界面模式切换时 (setInterfaceMode)
   ─────────────────────────────────────────────────────────── */
function triggerInterfaceMotion(mode) {
  clearTimeout(interfaceMotionTimer);

  const mainMenu = document.getElementById("main-menu");
  const sceneArea = document.getElementById("scene-area");
  const dialogueArea = document.getElementById("dialogue-area");
  const battleArea = document.getElementById("battle-area");
  [mainMenu, sceneArea, dialogueArea, battleArea].forEach((element) => {
    if (element) {
      element.classList.remove("is-entering", "motion-enter", "motion-active");
      void element.offsetWidth;
    }
  });

  if (mode === "menu" && mainMenu) {
    requestAnimationFrame(() => {
      mainMenu.classList.add("is-entering");
      interfaceMotionTimer = setTimeout(() => {
        if (activeInterfaceMode === "menu") {
          mainMenu.classList.remove("is-entering");
        }
      }, 2600);
    });
    return;
  }

  if (mode === "scene") {
    requestAnimationFrame(() => {
      sceneArea?.classList.add("motion-enter");
      dialogueArea?.classList.add("motion-enter");
      interfaceMotionTimer = setTimeout(() => {
        sceneArea?.classList.add("motion-active");
      }, 900);
    });
    return;
  }

  if (mode === "battle" && battleArea) {
    requestAnimationFrame(() => {
      battleArea.classList.add("motion-enter");
    });
  }
}

function revealStaggeredItems(items) {
  const container = document.getElementById("game-container");
  const isBossMode = container && container.classList.contains('boss-combat-ui-active');

  if (isBossMode && typeof gsap !== "undefined") {
      // Custom GSAP entrance for Boss Combat UI
      gsap.fromTo(items, 
          { y: 30, scale: 0.95, opacity: 0 },
          { 
              y: 0, 
              scale: 1, 
              opacity: 1, 
              duration: 0.6, 
              stagger: 0.1, 
              ease: "back.out(1.5)",
              onComplete: () => {
                  items.forEach(item => item.classList.add("is-visible"));
              }
          }
      );
  } else {
      // Normal CSS entrance
      requestAnimationFrame(() => {
        items.forEach((item) => {
          item.classList.add("is-visible");
        });
      });
  }
}

function shouldDelayMenuMotionForOpening() {
  const opening = document.getElementById("opening-animation");
  return Boolean(opening && !opening.classList.contains("is-finished"));
}

/* ═══════════════════════════════════════════════════════════════════
   模块: 主菜单 / 新游戏 / 存档管理 / 奏者选择 | 行号: ~5398-5546
   公共 API:
   - showMainMenu() — 显示主菜单 → 入口函数
   - startNewGame() — 开始新游戏 → 触发奏者选择
   - continueJourney() — 从存档继续
   - openSaveModal(mode) — 打开存档/读档面板
   - openConductorModal(onSelected) — 打开奏者性别选择
   - renderSaveSlots() — 渲染存档槽位
   ⚠️ 公共 API: showMainMenu 是整个游戏的入口
   ═══════════════════════════════════════════════════════════════════ */
function showMainMenu() {
    if(window.AudioManager) { window.AudioManager.init().then(() => window.AudioManager.playBGM('main_menu')); }
  clearTimeout(typewriterTimer);
  clearTimeout(battleResultTimer);
  clearTimeout(worldResolutionTimer);
  worldResolutionTimer = null;
  activeBattle = null;
  scenePlaybackToken += 1;
  setInterfaceMode("menu");
  closeSaveModal();
  refreshMenuButton();
  showEntryPage("entry-home");
  triggerInterfaceMotion("menu");
}

function startNewGame(entrySceneId = "chapter0_start") {
  GameState = cloneData(DEFAULT_GAME_STATE);
  loadedPlayTimeMs = 0;
  playSessionStartedAt = Date.now();
  window.GameState = GameState;
  updateUI();
  openConductorModal((gender, defaultName) => {
    GameState.奏者性别 = gender || "男";
    GameState.奏者姓名 = defaultName || resolveDefaultConductorName(GameState.奏者性别);
    GameState.主角默认形象 = resolveDefaultProtagonistAsset(GameState.奏者性别);
    addTriggeredEvent(`主角形象:${GameState.奏者性别}奏者`);
    addTriggeredEvent(`主角默认名:${GameState.奏者姓名}`);
    addTriggeredEvent("完成角色创建序幕");
    updateUI();
    GameState.茶歇返回场景 = entrySceneId;
    GameState.个人故事返回场景 = entrySceneId;
    showScene(entrySceneId);
  });
}

function resolveDefaultConductorName(gender) {
  if (gender === "男") return "凛澈";
  if (gender === "女") return "凛纱";
  return "未命名奏者";
}

function resolveDefaultProtagonistAsset(gender) {
  if (gender === "男") return ASSETS.characters["凛澈"].chapter0PreContract;
  if (gender === "女") return ASSETS.characters["凛纱"].chapter0PreContract;
  return "assets/generated/characters/char_protagonist_initial_traveler_v01.png";
}

function continueJourney() {
  const latestSave = getLatestAvailableSave();

  if (!latestSave) {
    startNewGame("chapter0_start");
    return;
  }

  applySavePayload(latestSave.payload);
  showScene(GameState.当前场景ID || "chapter1_start");
}

function resolveCurrentChapterStartScene() {
  const currentSceneId = GameState.当前场景ID || "";
  const scene = SCENES[currentSceneId] || null;
  const chapter = Number.isFinite(scene?.chapter) ? scene.chapter : null;

  if (chapter === 0 || currentSceneId.startsWith("chapter0") || currentSceneId.startsWith("ch0_")) {
    return "chapter0_start";
  }

  if (currentSceneId.startsWith("ch1_black_") || currentSceneId === "chapter1_start") {
    return "chapter1_start";
  }

  if (currentSceneId.startsWith("ch2_snow_") || currentSceneId.startsWith("chapter2_event_") || currentSceneId === "chapter2_start") {
    return "chapter2_start";
  }

  if (currentSceneId.startsWith("ch3_white_") || currentSceneId.startsWith("chapter3_event_E3") || currentSceneId === "chapter3_white_start") {
    return "chapter3_white_start";
  }

  if (currentSceneId.startsWith("ch4_") || currentSceneId.startsWith("chapter4_event_") || currentSceneId === "chapter4_start") {
    return "chapter4_start";
  }

  if (currentSceneId.startsWith("ch1_") || chapter === 2 || currentSceneId.startsWith("chapter2") || currentSceneId.startsWith("ch2_")) {
    return "chapter3_archive_start";
  }

  if (chapter === 3 || currentSceneId.startsWith("chapter3") || currentSceneId.startsWith("ch3_")) {
    return "chapter3_archive_start";
  }

  return "chapter1_start";
}

function restartCurrentChapter() {
  const entrySceneId = resolveCurrentChapterStartScene();
  const conductorGender = GameState.奏者性别;
  const conductorName = GameState.奏者姓名;
  const protagonistAsset = GameState.主角默认形象;
  const selectedMusicarts = Array.isArray(GameState.出战律者) ? [...GameState.出战律者] : [];

  const confirmed = window.confirm(`确定要重新开始当前章节吗？\n将回到「${entrySceneId}」，当前自动进度会被新进度覆盖。`);
  if (!confirmed) {
    return;
  }

  clearTimeout(typewriterTimer);
  clearTimeout(battleResultTimer);
  GameState = cloneData(DEFAULT_GAME_STATE);
  loadedPlayTimeMs = 0;
  playSessionStartedAt = Date.now();
  GameState.奏者性别 = conductorGender || "男";
  GameState.奏者姓名 = conductorName || resolveDefaultConductorName(GameState.奏者性别);
  GameState.主角默认形象 = protagonistAsset || resolveDefaultProtagonistAsset(GameState.奏者性别);
  GameState.出战律者 = selectedMusicarts;
  GameState.当前场景ID = entrySceneId;
  GameState.茶歇返回场景 = entrySceneId;
  GameState.个人故事返回场景 = entrySceneId;
  addTriggeredEvent(`重开章节:${entrySceneId}`);
  window.GameState = GameState;
  updateUI();
  showToast("章节已重新开始", 1);
  showScene(entrySceneId);
}

function openSaveModal(mode) {
  saveModalMode = mode || "load";
  const modal = document.getElementById("save-modal");
  const title = document.getElementById("save-modal-title");
  title.textContent = saveModalMode === "save" ? "选择存档槽" : "存档记录";
  renderSaveSlots();
  modal.hidden = false;
  requestAnimationFrame(() => {
    revealStaggeredItems(document.querySelectorAll("#save-slots .motion-item"));
  });
}

function closeSaveModal() {
  const modal = document.getElementById("save-modal");
  if (modal) {
    modal.hidden = true;
  }
}

function openConductorModal(onSelected) {
  pendingConductorSelection = onSelected;
  const modal = document.getElementById("conductor-modal");
  if (modal) {
    modal.hidden = false;
    requestAnimationFrame(() => {
      revealStaggeredItems(document.querySelectorAll("#conductor-options .conductor-option"));
    });
  }
}

function closeConductorModal() {
  const modal = document.getElementById("conductor-modal");
  if (modal) {
    modal.hidden = true;
  }
}

function renderSaveSlots() {
  const slotsElement = document.getElementById("save-slots");
  slotsElement.innerHTML = "";

  for (let slot = 1; slot <= 3; slot += 1) {
    const payload = readSavePayload(`${SAVE_SLOT_PREFIX}${slot}`);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "save-slot motion-item";
    button.style.transitionDelay = `${slot * 140}ms`;
    button.innerHTML = buildSaveSlotHTML(slot, payload);

    button.addEventListener("click", () => {
      if (saveModalMode === "save") {
        saveGame(slot);
        closeSaveModal();
        return;
      }

      if (!payload) {
        showToast(`存档槽 ${slot} 为空`, -1);
        return;
      }

      loadGame(slot);
      closeSaveModal();
      showScene(GameState.当前场景ID || "chapter1_start");
    });

    slotsElement.appendChild(button);
  }
}

function buildSaveSlotHTML(slot, payload) {
  if (!payload) {
    return `
      <div class="save-slot-number">${slot}</div>
      <div class="save-slot-body">
        <div class="save-slot-title">空档位</div>
        <div class="save-slot-meta">
          <span class="save-slot-tag is-empty">点击此处写入新记录</span>
        </div>
      </div>
    `;
  }

  const state = payload.state || {};
  const meta = payload.meta || {};
  const chapterName = escapeHTML(meta.chapterName || getChapterName(state.当前场景ID) || "未知章节");
  const stability = Number.isFinite(state.城邦稳定度) ? state.城邦稳定度 : "--";
  const discord = Number.isFinite(state.世界失谐度) ? state.世界失谐度 : "--";
  const playMin = Math.floor((meta.playTimeMs || 0) / 60000);
  const conductor = state.奏者性别
    ? (state.奏者性别 === "未标注" ? "未标注奏者" : `${escapeHTML(state.奏者性别)}性奏者`)
    : "未创建奏者";

  return `
    <div class="save-slot-number">${slot}</div>
    <div class="save-slot-body">
      <div class="save-slot-title">${chapterName}</div>
      <div class="save-slot-meta">
        <span class="save-slot-tag">${conductor}</span>
        <span class="save-slot-tag" title="城邦稳定度">◆ 稳定 ${stability}</span>
        <span class="save-slot-tag" title="世界失谐度">◇ 失谐 ${discord}</span>
        <span class="save-slot-tag is-time">${playMin} 分钟</span>
      </div>
    </div>
  `;
}

function refreshMenuButton() {
  const continueButton = document.getElementById("continue-button");
  if (!continueButton) {
    return;
  }

  const latestSave = getLatestAvailableSave();
  continueButton.textContent = latestSave ? "继续旅程" : "开始第零章";
  continueButton.title = latestSave ? "读取最近的本地记录" : "创建新记录并选择奏者身份";
  renderEntrySaveState();
}

function renderEntrySaveState() {
  const saveState = document.getElementById("entry-save-state");
  if (!saveState) {
    return;
  }

  const latestSave = getLatestAvailableSave();
  if (!latestSave) {
    saveState.textContent = "未检测到本地记录。可以从第零章开始，或在章节入口手动打开后续测试章节。";
    return;
  }

  const state = latestSave.payload.state || {};
  const meta = latestSave.payload.meta || {};
  const chapterName = meta.chapterName || getChapterName(state.当前场景ID);
  const playMinutes = Math.floor((meta.playTimeMs || 0) / 60000);
  saveState.textContent = `检测到本地记录：${chapterName} / ${state.当前场景ID || "--"} / ${playMinutes}分钟。`;
}

function jumpEntryPanel(panelId) {
  showEntryPage(panelId);
}

function showEntryPage(pageId = "entry-home") {
  const target = document.getElementById(pageId);
  if (!target) {
    return;
  }

  document.querySelectorAll(".entry-page").forEach((page) => {
    page.classList.toggle("is-active", page === target);
  });

  document.querySelectorAll("[data-entry-jump]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.entryJump === pageId);
  });
}

function quickStartEntryScene(sceneId) {
  if (!SCENES[sceneId]) {
    showToast(`场景未配置：${sceneId}`, -1);
    return;
  }

  if (!GameState.奏者性别) {
    GameState.奏者性别 = "未标注";
  }
  GameState.茶歇返回场景 = sceneId;
  showScene(sceneId);
}

function openGachaModal() {
  const modal = document.getElementById("gacha-modal");
  if (!modal) {
    return;
  }

  renderGachaCollection();
  modal.hidden = false;
}

function closeGachaModal() {
  const modal = document.getElementById("gacha-modal");
  if (modal) {
    modal.hidden = true;
  }
}

function getGachaCollection() {
  try {
    return JSON.parse(localStorage.getItem(GACHA_COLLECTION_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveGachaCollection(collection) {
  try {
    localStorage.setItem(GACHA_COLLECTION_KEY, JSON.stringify(collection));
  } catch {
    showToast("抽取记录保存失败", -1);
  }
}

function pickGachaItem() {
  const roll = Math.random();
  const targetRarity = roll < 0.08 ? "SSR" : roll < 0.36 ? "SR" : "R";
  const candidates = GACHA_POOL.filter((item) => item.rarity === targetRarity);
  const pool = candidates.length ? candidates : GACHA_POOL;
  return cloneData(pool[Math.floor(Math.random() * pool.length)]);
}

function drawGacha(count = 1) {
  const results = Array.from({ length: count }, () => pickGachaItem());
  const collection = getGachaCollection();

  results.forEach((item) => {
    collection[item.id] = {
      ...item,
      count: (collection[item.id]?.count || 0) + 1,
      lastDrawnAt: Date.now()
    };
  });

  saveGachaCollection(collection);
  renderGachaResults(results);
  renderGachaCollection();
  showToast(`调律抽取完成：${count}次`, 1);
}

function renderGachaResults(results = []) {
  const container = document.getElementById("gacha-results");
  if (!container) {
    return;
  }

  if (!results.length) {
    container.innerHTML = `<p class="gacha-empty">尚未抽取。可用于测试后续角色、章节与素材投放节奏。</p>`;
    return;
  }

  container.innerHTML = results.map((item) => `
    <article class="gacha-card rarity-${escapeHTML(item.rarity.toLowerCase())}">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}">
      <span>${escapeHTML(item.rarity)} / ${escapeHTML(item.type)}</span>
      <strong>${escapeHTML(item.title)}</strong>
      <p>${escapeHTML(item.subtitle)}</p>
    </article>
  `).join("");
}

function renderGachaCollection() {
  const list = document.getElementById("gacha-collection-list");
  if (!list) {
    return;
  }

  const entries = Object.values(getGachaCollection());
  if (!entries.length) {
    list.innerHTML = `<p class="gacha-empty">收集册为空。</p>`;
    return;
  }

  list.innerHTML = entries
    .sort((a, b) => (b.rarity.localeCompare(a.rarity) || a.title.localeCompare(b.title)))
    .map((item) => `
      <span class="gacha-collection-chip">
        ${escapeHTML(item.rarity)} ${escapeHTML(item.title)} ×${Number(item.count || 1)}
      </span>
    `).join("");
}

function clearGachaCollection() {
  try {
    localStorage.removeItem(GACHA_COLLECTION_KEY);
  } catch {
    // Ignore storage failures, render still falls back to empty.
  }
  renderGachaResults([]);
  renderGachaCollection();
  showToast("调律抽取记录已清空", 0);
}

function readUISettings() {
  try {
    return {
      ...DEFAULT_UI_SETTINGS,
      ...JSON.parse(localStorage.getItem(UI_SETTINGS_KEY) || "{}")
    };
  } catch {
    return { ...DEFAULT_UI_SETTINGS };
  }
}

function saveUISettings(settings) {
  try {
    localStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    showToast("设置保存失败", -1);
  }
}

function applyUISettings(settings = readUISettings()) {
  const normalized = { ...DEFAULT_UI_SETTINGS, ...settings };
  document.body.dataset.uiScale = normalized.uiScale;
  document.body.dataset.hudDensity = normalized.hudDensity;
  document.body.classList.toggle("is-reduced-motion", normalized.motion === "reduced");
  runtimeTypewriterDelay = normalized.typewriter === "fast" ? 12 : normalized.typewriter === "slow" ? 55 : TYPEWRITER_DELAY;
  return normalized;
}

function syncSettingsControls(settings = readUISettings()) {
  const normalized = { ...DEFAULT_UI_SETTINGS, ...settings };
  const fields = {
    "setting-ui-scale": normalized.uiScale,
    "setting-motion": normalized.motion,
    "setting-typewriter": normalized.typewriter,
    "setting-hud-density": normalized.hudDensity
  };

  Object.entries(fields).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) {
      field.value = value;
    }
  });
}

function openSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (!modal) {
    return;
  }

  syncSettingsControls(readUISettings());
  modal.hidden = false;
}

function closeSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.hidden = true;
  }
}

function collectSettingsFromControls() {
  return {
    uiScale: document.getElementById("setting-ui-scale")?.value || DEFAULT_UI_SETTINGS.uiScale,
    motion: document.getElementById("setting-motion")?.value || DEFAULT_UI_SETTINGS.motion,
    typewriter: document.getElementById("setting-typewriter")?.value || DEFAULT_UI_SETTINGS.typewriter,
    hudDensity: document.getElementById("setting-hud-density")?.value || DEFAULT_UI_SETTINGS.hudDensity
  };
}

function applySettingsFromControls() {
  const settings = collectSettingsFromControls();
  saveUISettings(settings);
  applyUISettings(settings);
  showToast("系统设置已应用", 1);
}

function resetUISettings() {
  saveUISettings(DEFAULT_UI_SETTINGS);
  applyUISettings(DEFAULT_UI_SETTINGS);
  syncSettingsControls(DEFAULT_UI_SETTINGS);
  showToast("系统设置已恢复默认", 0);
}

/* ═══════════════════════════════════════════════════════════════════
   模块: handleChoice (剧情选择处理) | 行号: ~5547-5623
   核心函数: handleChoice(choice) — 玩家选择后的完整处理流程
   调用链: handleChoice → recordPlayerChoice → applyChoiceEffects → showToast → showScene
   ⚠️ 公共 API: handleChoice 被 UI 按钮点击事件直接调用
   注意: 选择效果会直接影响 GameState 的关系值
   ═══════════════════════════════════════════════════════════════════ */
async function handleChoice(choice) {
  const conditionResult = getChoiceConditionResult(choice);
  if (!conditionResult.allowed) {
    showToast(`条件未满足：${conditionResult.label}`, -1);
    return;
  }

  const beforeState = cloneData(GameState);
  if (!choice.skipRecord) {
    recordPlayerChoice(choice);
  }

  if (Array.isArray(choice.effects)) {
    applyChoiceEffects(choice.effects);
  }

  if (typeof choice.effect === "function") {
    await choice.effect();
  }

  updateUI();
  showStateChangeToasts(beforeState, GameState);

  if (choice.nextScene) {
    showScene(choice.nextScene);
  }
}

function recordPlayerChoice(choice) {
  if (!choice || !choice.text) {
    return;
  }

  if (!Array.isArray(GameState.玩家行为记录)) {
    GameState.玩家行为记录 = [];
  }

  const record = {
    sceneId: GameState.当前场景ID || "",
    text: choice.text,
    judgmentTarget: choice.judgmentTarget || inferJudgmentTarget(choice),
    judgmentType: choice.judgmentType || inferJudgmentType(choice),
    savedAt: new Date().toISOString()
  };

  GameState.玩家行为记录.push(record);
  GameState.玩家行为记录 = GameState.玩家行为记录.slice(-40);
  recordRelationshipJudgment(choice, record);
}

function recordRelationshipJudgment(choice, choiceRecord) {
  const effects = Array.isArray(choice.effects) ? choice.effects : [];
  const relationEffects = effects
    .filter((effect) => effect.type === "change" && AI_RELATION_STATS.has(effect.key))
    .map((effect) => ({
      stat: effect.key,
      delta: effect.value
    }));

  if (!choiceRecord.judgmentTarget && relationEffects.length === 0) {
    return;
  }

  if (!Array.isArray(GameState.关系判定记录)) {
    GameState.关系判定记录 = [];
  }

  GameState.关系判定记录.push({
    sceneId: choiceRecord.sceneId,
    text: choiceRecord.text,
    judgmentTarget: choiceRecord.judgmentTarget,
    judgmentType: choiceRecord.judgmentType,
    relationEffects,
    savedAt: choiceRecord.savedAt
  });
  GameState.关系判定记录 = GameState.关系判定记录.slice(-60);
}

function getMusicartRelationship(character) {
  const data = RELATIONSHIP_DATA[character] || MUSICART_RULES[character];
  if (!data) {
    return null;
  }

  const trust = clamp(Number(GameState[data.trustKey] || 0), 0, 100);
  const resonance = clamp(Number(GameState[data.resonanceKey] || 0), 0, 100);
  const pressure = clamp(Number(GameState[data.pressureKey] || 0), 0, 100);

  return {
    character,
    trust,
    resonance,
    pressure,
    trustTier: getRelationshipTier("trust", trust),
    resonanceTier: getRelationshipTier("resonance", resonance),
    pressureTier: getRelationshipTier("pressure", pressure)
  };
}

function getRelationshipTier(type, value) {
  const tiers = RELATIONSHIP_TIERS[type] || [];
  return tiers.find((tier) => value >= tier.min && value <= tier.max) || null;
}

function debugDissonanceRate(character = "洛温", trials = 1000, overrides = {}) {
  const rule = MUSICART_RULES[character];
  if (!rule) {
    return { character, error: "unknown_musicart" };
  }

  const snapshot = {
    gender: GameState.奏者性别,
    trust: GameState[rule.trustKey],
    pressure: GameState[rule.pressureKey]
  };

  if (overrides.conductorGender) GameState.奏者性别 = overrides.conductorGender;
  if (Number.isFinite(overrides.trust)) GameState[rule.trustKey] = overrides.trust;
  if (Number.isFinite(overrides.pressure)) GameState[rule.pressureKey] = overrides.pressure;

  const chance = getDissonanceChance(rule);
  let hits = 0;
  const count = Math.max(1, Math.floor(trials));
  for (let i = 0; i < count; i += 1) {
    if (Math.random() < chance) hits += 1;
  }

  GameState.奏者性别 = snapshot.gender;
  GameState[rule.trustKey] = snapshot.trust;
  GameState[rule.pressureKey] = snapshot.pressure;

  return {
    character,
    trials: count,
    expectedChance: chance,
    triggered: hits,
    observedChance: hits / count,
    overrides
  };
}

function showRelationshipDebugSummary(character) {
  const relation = getMusicartRelationship(character);
  if (!relation) {
    showDialogue("系统", `未找到${character}关系数据。`);
    showChoices([{ text: "返回第一章入口", nextScene: "chapter1_start" }]);
    return;
  }

  const recentJudgment = [...(GameState.关系判定记录 || [])]
    .reverse()
    .find((record) => record.judgmentTarget === character);
  const recentHidden = [...(GameState.隐藏台词记录 || [])]
    .reverse()
    .find((record) => record.speaker === character);
  const judgmentText = recentJudgment
    ? `${recentJudgment.judgmentType}｜${recentJudgment.relationEffects.map((effect) => `${effect.stat}${effect.delta >= 0 ? "+" : ""}${effect.delta}`).join(" / ") || "无关系数值变化"}`
    : "暂无";
  const hiddenText = recentHidden ? recentHidden.id : "暂无";

  showDialogue(
    "系统",
    `${character}关系摘要：信任${relation.trust}（${relation.trustTier?.label || "-"}） / 共鸣${relation.resonance}（${relation.resonanceTier?.label || "-"}） / 压力${relation.pressure}（${relation.pressureTier?.label || "-"}）。最近 judgment：${judgmentText}。最近隐藏台词：${hiddenText}。`
  );
  showChoices([{ text: "返回第一章入口", nextScene: "chapter1_start" }]);
}

function inferJudgmentTarget(choice) {
  const text = choice.text || "";
  return Object.keys(MUSICART_RULES).find((name) => text.includes(name)) || null;
}

function inferJudgmentType(choice) {
  const text = choice.text || "";
  if (text.includes("不追问") || text.includes("不用") || text.includes("休息") || text.includes("关心") || text.includes("累不累") || text.includes("撑不撑")) return "体谅式";
  if (text.includes("听") || text.includes("问") || text.includes("建议")) return "询问式";
  if (text.includes("要求") || text.includes("服从") || text.includes("按我的")) return "命令式";
  if (text.includes("自己判断") || text.includes("你决定")) return "放权式";
  if (text.includes("立刻") || text.includes("效率") || text.includes("任务")) return "行动优先式";
  return "未标注";
}

function applyChoiceEffects(effects) {
  effects.forEach((effect) => {
    if (effect.type === "change") {
      if (!Number.isFinite(GameState[effect.key])) {
        GameState[effect.key] = 0;
      }
      GameState[effect.key] += effect.value;
      return;
    }

    if (effect.type === "set") {
      GameState[effect.key] = effect.value;
      return;
    }

    if (effect.type === "event") {
      addTriggeredEvent(effect.value);
    }
  });
}

/* ───────────────────────────────────────────────────────────
   模块: 对话序列播放 | 行号: ~5624-5701
   函数: playDialogueSequence() — 逐条播放对话列表
         normalizeDialogues() — 标准化对话数据格式
         buildSceneSystemPrompt() — 构建场景系统提示
         buildSceneChoices() — 构建场景选择项
   ⚠️ 注意: scenePlaybackToken 用于取消旧对话序列（场景快速切换时）
   ─────────────────────────────────────────────────────────── */
function playDialogueSequence(dialogues, index, playbackToken, onComplete) {
  if (playbackToken !== scenePlaybackToken) {
    return;
  }

  if (index >= dialogues.length) {
    showChoices([]);
    if (typeof onComplete === "function") {
      onComplete();
    }
    return;
  }

  const dialogue = dialogues[index];
  updateCharacterSprite(dialogue.speaker, dialogue.sprite);
  showDialogue(dialogue.speaker, dialogue.text, () => {
    if (playbackToken !== scenePlaybackToken) {
      return;
    }

    const isLastLine = index >= dialogues.length - 1;
    setPendingDialogueAdvance(
      isLastLine ? "\u70b9\u51fb\u5bf9\u8bdd\u6846\u663e\u793a\u884c\u52a8 / \u9009\u62e9" : "\u70b9\u51fb\u5bf9\u8bdd\u6846\u7ee7\u7eed\u4e0b\u4e00\u53e5",
      () => {
        playDialogueSequence(dialogues, index + 1, playbackToken, onComplete);
      }
    );
  });
}

function normalizeDialogues(scene) {
  let dialogues = [];

  if (scene.dialogue) {
    dialogues = [{ speaker: scene.speaker || "旁白", text: scene.dialogue }];
  } else if (Array.isArray(scene.dialogues)) {
    dialogues = [...scene.dialogues];
  }

  dialogues = dialogues
    .filter((dialogue) => areConditionsMet(dialogue.conditions || []))
    .map((dialogue, index) => {
      if (dialogue.hidden || dialogue.hiddenLineId) {
        recordHiddenLineUnlock(dialogue, buildHiddenLineRecordId(scene, dialogue, index, "inline"));
      }
      return dialogue;
    });

  if (Array.isArray(scene.hiddenDialogues)) {
    scene.hiddenDialogues.forEach((dialogue, index) => {
      if (areConditionsMet(dialogue.conditions || [])) {
        recordHiddenLineUnlock(dialogue, buildHiddenLineRecordId(scene, dialogue, index, "hidden"));
        dialogues.push(dialogue);
      }
    });
  }

  if (Array.isArray(scene.hiddenLineAppends)) {
    scene.hiddenLineAppends.forEach((append, index) => {
      if (!areConditionsMet(append.conditions || [])) {
        return;
      }

      const target = [...dialogues].reverse().find((dialogue) => !append.speaker || dialogue.speaker === append.speaker);
      if (target) {
        target.text = `${target.text}${append.prefix || " "}${append.text}`;
      } else {
        dialogues.push({ speaker: append.speaker || "旁白", sprite: append.sprite, text: append.text });
      }
      recordHiddenLineUnlock(append, buildHiddenLineRecordId(scene, append, index, "append"));
    });
  }

  return dialogues;
}

function buildHiddenLineRecordId(scene, dialogue, index, scope) {
  const sceneId = GameState.当前场景ID || "unknown_scene";
  return dialogue.hiddenLineId || dialogue.id || `${sceneId}:${scope}:${index}`;
}

function recordHiddenLineUnlock(dialogue, recordId) {
  if (!recordId) {
    return;
  }

  if (!Array.isArray(GameState.隐藏台词记录)) {
    GameState.隐藏台词记录 = [];
  }

  if (GameState.隐藏台词记录.some((record) => record.id === recordId)) {
    return;
  }

  const record = {
    id: recordId,
    sceneId: GameState.当前场景ID || "",
    speaker: dialogue.speaker || "旁白",
    text: dialogue.text || "",
    unlockedAt: new Date().toISOString()
  };
  GameState.隐藏台词记录.push(record);
  GameState.隐藏台词记录 = GameState.隐藏台词记录.slice(-60);
  addTriggeredEvent(`hidden_line:${recordId}`);
}

function buildSceneSystemPrompt(scene) {
  const prompts = [];

  if (scene.systemPrompt) {
    prompts.push(scene.systemPrompt);
  }

  if (scene.isMapNode) {
    getAvailablePersonalStories().forEach((story) => {
      const promptEventId = `story_prompt:${story.id}`;
      if (!GameState.已触发事件.includes(promptEventId)) {
        prompts.push(`个人故事提示：${story.character}《${story.title}》已解锁。`);
        addTriggeredEvent(promptEventId);
      }
    });
  }

  return prompts.join("\n");
}

function buildSceneChoices(scene) {
  const choices = [];

  if (scene.isMapNode) {
    getAvailablePersonalStories().forEach((story) => {
      choices.push({
        text: `查看${story.character}个人故事：${story.title}`,
        effect: () => openPersonalStory(story.sceneId)
      });
    });
  }

  const baseChoices = typeof scene.buildChoices === "function" ? scene.buildChoices() : (scene.choices || []);
  const hiddenChoices = (scene.hiddenChoices || []).filter((choice) => areConditionsMet(choice.conditions || []));
  return choices.concat(baseChoices, hiddenChoices);
}

/* ───────────────────────────────────────────────────────────
   模块: 茶歇中心 | 行号: ~5702-5749
   函数: buildTeaBreakHubChoices() — 构建茶歇选择界面
         openPersonalStory() — 打开个人故事
         finishPersonalStory() — 结束个人故事
         getAvailablePersonalStories() — 获取已解锁的个人故事
   ⚠️ 公共 API: 这些函数是茶歇系统的入口，被场景跳转触发
   ─────────────────────────────────────────────────────────── */
function buildTeaBreakHubChoices() {
  const team = normalizeTeamSelection(GameState.出战律者, Object.keys(TEA_BREAK_SCENES));
  const choices = getAvailablePersonalStories().map((story) => ({
    text: `查看${story.character}个人故事：${story.title}`,
    effect: () => openPersonalStory(story.sceneId)
  }));

  team.forEach((musicart) => {
    choices.push({
      text: `和${musicart}交流`,
      nextScene: TEA_BREAK_SCENES[musicart]
    });
  });

  // AI 对话设置
  const aiStatus = isDeepSeekEnabled() ? "已启用" : "未启用";
  choices.push({
    text: `AI 实时对话设置（${aiStatus}）`,
    effect: () => openAISettingsModal()
  });

  choices.push({ text: "结束茶歇，返回旅程", nextScene: GameState.茶歇返回场景 || "chapter1_start" });
  return choices;
}

function openPersonalStory(sceneId) {
  GameState.个人故事返回场景 = GameState.当前场景ID || GameState.茶歇返回场景 || "chapter1_start";
  showScene(sceneId);
}

function finishPersonalStory() {
  showScene(GameState.个人故事返回场景 || "chapter1_start");
}

function getAvailablePersonalStories() {
  return PERSONAL_STORIES.filter((story) => {
    if (!SCENES[story.sceneId]) {
      return false;
    }

    if (GameState.已触发事件.includes(story.seenEvent)) {
      return false;
    }

    return GameState[story.resonanceKey] >= story.threshold;
  });
}

function resolveCh2NingsuStandoff() {
  const forced = GameState.已触发事件.includes("ch2_ningsu_forced_attack");
  const clueScore = [
    "ch2_ningsu_clue_a",
    "ch2_ningsu_clue_b",
    "ch2_ningsu_clue_c",
    "E202_archive_timeline_complete",
    "完整听完母亲残响"
  ].reduce((score, eventId) => score + (GameState.已触发事件.includes(eventId) ? 6 : 0), 0);
  const attitudeScore = Number.isFinite(GameState.宁溯好感) ? GameState.宁溯好感 : 0;
  const total = attitudeScore + clueScore;

  if (forced || total < 40) {
    addTriggeredEvent("ch2_ningsu_resolution_forced");
    showScene("ch2_snow_010_c");
    return;
  }

  if (total >= 70) {
    addTriggeredEvent("ch2_ningsu_resolution_trust");
    showScene("ch2_snow_010_a");
    return;
  }

  addTriggeredEvent("ch2_ningsu_resolution_limited");
  showScene("ch2_snow_010_b");
}

function resolveCh3WhiteHearing() {
  const value = Number.isFinite(GameState.听证倾向值) ? GameState.听证倾向值 : 0;

  if (value >= 50) {
    addTriggeredEvent("ch3_hearing_high_route");
    showScene("ch3_white_008_high");
    return;
  }

  if (value >= 0) {
    addTriggeredEvent("ch3_hearing_mid_route");
    showScene("ch3_white_008_mid");
    return;
  }

  addTriggeredEvent("ch3_hearing_low_route");
  showScene("ch3_white_008_low");
}

/* ═══════════════════════════════════════════════════════════════════
   模块: 地图事件系统 | 行号: ~5750-5940
   函数: drawChapter1/2/3MapEvent() — 从事件池中随机抽取地图遭遇
         drawMapEvent() — 通用的地图事件抽取逻辑
         pickMapEventByTypeWeight() — 按类型权重选取事件
         createMapEventScene() — 将事件数据转换为场景对象
         getMapEventChapterName(), getMapEventBackground(), getMapEventOpeningDialogue()
   ⚠️ 注意: 事件池数据在 CHAPTER1/2/3_EVENT_POOL
   ═══════════════════════════════════════════════════════════════════ */
function drawChapter1MapEvent() {
  drawMapEvent(1, CHAPTER1_EVENT_POOL.filter((event) => /^E10[1-6]$/.test(event.id)), "ch1_black_004");
}

function drawChapter0MapEvent() {
  drawMapEvent(0, CHAPTER0_EVENT_POOL, "ch0_008_map_open");
}

function drawChapter2MapEvent() {
  drawMapEvent(2, CHAPTER2_EVENT_POOL, "ch2_snow_005");
}

function drawChapter3WhiteMapEvent() {
  drawMapEvent(3, CHAPTER3_WHITE_EVENT_POOL, "ch3_white_005");
}

function drawChapter3MapEvent() {
  drawMapEvent(3, CHAPTER3_EVENT_POOL, "ch3_001");
}

function drawMapEvent(chapter, eventPool, returnScene) {
  const availableEvents = eventPool.filter((event) => {
    if (GameState.已触发事件.includes(`map_event:${event.id}`)) {
      return false;
    }

    return areConditionsMet(event.unlock || []);
  });

  const candidates = availableEvents.length > 0 ? availableEvents : eventPool.filter((event) => areConditionsMet(event.unlock || []));
  const event = pickMapEventByTypeWeight(candidates);

  if (!event) {
    showToast("当前没有可触发的地图事件", -1);
    return;
  }

  const sceneId = `chapter${chapter}_event_${event.id}`;
  SCENES[sceneId] = createMapEventScene(event, chapter, returnScene);
  addTriggeredEvent(`map_event:${event.id}`);
  showScene(sceneId);
}

function pickMapEventByTypeWeight(candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return null;
  }

  const miniGameEvents = candidates.filter((event) => event.eventType === "minigame");
  const narrativeEvents = candidates.filter((event) => event.eventType !== "minigame");
  const preferredPool = Math.random() < 0.2 ? miniGameEvents : narrativeEvents;
  const pool = preferredPool.length > 0 ? preferredPool : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}

function createMapEventScene(event, chapter = 1, returnScene = "chapter1_start") {
  const eventLabel = event.eventType === "minigame"
    ? `迷你游戏：${event.minigameType}`
    : "地图叙事事件";

  return {
    background: "#111827",
    backgroundImage: getMapEventBackground(event),
    description: event.description,
    systemPrompt: `${getMapEventChapterName(chapter)}事件 ${event.id}｜${eventLabel}`,
    dialogues: [getMapEventOpeningDialogue(event)],
    choices: event.choices.map((choice) => ({
      ...choice,
      effects: [
        ...(choice.effects || []),
        { type: "event", value: `resolved:${event.id}` }
      ],
      nextScene: choice.nextScene || (choice.effect ? undefined : returnScene)
    }))
  };
}

function getMapEventChapterName(chapter) {
  if (chapter === 0) return "第零章";
  if (chapter === 2) return "第二乐章";
  if (chapter === 3) return "第三乐章";
  return "第一章";
}

function getMapEventBackground(event) {
  const backgroundMap = {
    CH0_E001: ASSETS.backgrounds.ch0MianshaTownSquare,
    CH0_E002: ASSETS.backgrounds.ch0OldDinerShelter,
    CH0_E003: ASSETS.backgrounds.ch0TheaterBackstageDress,
    CH0_E004: ASSETS.backgrounds.ch0ClocktowerMechanism,
    CH0_E005: ASSETS.backgrounds.ch0RecordShopArchive,
    CH0_E006: ASSETS.backgrounds.ch0ClocktowerMechanism,
    CH0_E007: ASSETS.backgrounds.ch0TheaterBackstageDress,
    CH0_E008: ASSETS.backgrounds.ch0AbandonedTheaterStage,
    CH0_E009: ASSETS.backgrounds.ch0MianshaTownSquare,
    CH0_E010: ASSETS.backgrounds.ch0RecordShopArchive,
    CH0_E011: ASSETS.backgrounds.ch0MianshaTownSquare,
    CH0_E012: ASSETS.backgrounds.ch0MianshaTownSquare,
    CH0_E013: ASSETS.backgrounds.ch0AbandonedSchoolMusicRoom,
    CH0_E014: ASSETS.backgrounds.ch0MianshaTownSquare,
    E001: ASSETS.backgrounds.graystringDusk,
    E002: ASSETS.backgrounds.graystringDay,
    E003: ASSETS.backgrounds.fogportExterior,
    E004: ASSETS.backgrounds.qixianTuningRoom,
    E005: ASSETS.backgrounds.qixianLowerStreet,
    E006: ASSETS.backgrounds.graystringBossBridge,
    E007: ASSETS.backgrounds.fogportStage,
    E008: ASSETS.backgrounds.qixianLowerStreet,
    E009: ASSETS.backgrounds.graystringDusk,
    E010: ASSETS.backgrounds.qixianTuningPlatform,
    E011: ASSETS.backgrounds.graystringBossBridge,
    E012: ASSETS.backgrounds.teaLounge,
    E013: ASSETS.backgrounds.graystringDay,
    E014: ASSETS.backgrounds.graystringDusk,
    E015: ASSETS.backgrounds.graystringDusk,
    E016: ASSETS.backgrounds.fogportStage,
    E017: ASSETS.backgrounds.graystringBossBridge,
    E018: ASSETS.backgrounds.qixianLowerStreet,
    E019: ASSETS.backgrounds.qixianLowerStreet,
    E020: ASSETS.backgrounds.teaLounge,
    E101: ASSETS.backgrounds.ch1MujianStationPlatform,
    E102: ASSETS.backgrounds.ch1MujianStationPlatform,
    E103: ASSETS.backgrounds.ch1MujianStationPlatform,
    E104: ASSETS.backgrounds.ch1MujianStationPlatform,
    E105: ASSETS.backgrounds.ch1StationInnWarm,
    E106: ASSETS.backgrounds.ch1StationInnWarm,
    E107: ASSETS.backgrounds.graystringDusk,
    E108: ASSETS.backgrounds.teaLounge,
    E109: ASSETS.backgrounds.brokenStringStage,
    E110: ASSETS.backgrounds.teaLounge,
    E111: ASSETS.backgrounds.qixianTuningRoom,
    E112: ASSETS.backgrounds.teaLounge,
    E201: ASSETS.backgrounds.ch2CrystalCorridor,
    E202: ASSETS.backgrounds.ch2ArchiveRoom,
    E203: ASSETS.backgrounds.ch2CrystalCorridor,
    E204: ASSETS.backgrounds.ch2CrystalCorridor,
    E205: ASSETS.backgrounds.ch2CoreChamber,
    E301: ASSETS.backgrounds.ch3ArchiveCorridor,
    E302: ASSETS.backgrounds.ch3PortraitCorridor,
    E303: ASSETS.backgrounds.ch3ReceptionHall,
    E304: ASSETS.backgrounds.ch3ArchiveCorridor,
    E305: ASSETS.backgrounds.ch3ReceptionHall
  };

  return backgroundMap[event.id] || ASSETS.backgrounds.graystringDay;
}

function getMapEventOpeningDialogue(event) {
  const dialogueMap = {
    CH0_E001: { speaker: "诺伊", text: "我不想让它真的响。我只是想知道，手放在这里的时候，音乐是不是已经开始了。" },
    CH0_E002: { speaker: "安柠", text: "把手伸出来。你可以继续逞强，但别拿诊断结果跟我吵。" },
    CH0_E003: { speaker: "阿缇娅", sprite: "daily", text: "这件衣物引发异常记忆残响。结论：不适合继续观看。" },
    CH0_E004: { speaker: "弥洛", text: "低音不该抢走主旋律。可有时，我比指挥者更早听见危险。" },
    CH0_E005: { speaker: "乌鸦先生", text: "唱片被刮掉，不代表旋律死了。有些声音藏在划痕下面。" },
    CH0_E006: { speaker: "白栖", text: "我不是讨厌音乐。我只是每次听见它，项圈都会疼。" },
    CH0_E007: { speaker: "米拉奶奶", text: "我不是想听曲子。我只是想确认，那些夜晚不是我一个人编出来的梦。" },
    CH0_E008: { speaker: "奥托", text: "我听不见了。可灯不用耳朵记路。你看，那里，本来该照着主角。" },
    CH0_E009: { speaker: "白栖", text: "他们不会听解释。静默署的巡逻报告里，没有“想唱歌”这个字段。" },
    CH0_E010: { speaker: "卡戎", text: "看见了吗？自由的音乐很快就会变成交易、诱饵和尸体。" },
    CH0_E011: { speaker: "弥洛", text: "它不是在听脚步。它在闻你右腕里的那根指挥棒。" },
    CH0_E012: { speaker: "霍尔特", text: "我只是代理镇长。代理的意思就是，所有人都可以怪我，但没有人会给我权力。" },
    CH0_E013: { speaker: "琳", text: "铃说这里少了两个字。她不说话，但她敲出来的拍子从来没有错。" },
    CH0_E014: { speaker: "伊莱娜", text: "我见过音乐引来的尸体，也见过报告里被删掉的人名。现在，把你的右手伸出来。" },
    E001: { speaker: "洛温", sprite: "guardian", text: "先固定路面，再救人。别让同情跑在撤离路线前面。" },
    E004: { speaker: "槐序", sprite: "guarded", text: "听第二段。不是它更响，是它多了一次不该出现的回声。" },
    E005: { speaker: "伊芙白", sprite: "insight", text: "他们都说自己在救人。通常这句话一出现，麻烦就开始排队了。" },
    E007: { speaker: "槐序", sprite: "guarded", text: "别问得太快。有些名字不是被忘掉的，是被放下的。" },
    E014: { speaker: "洛温", sprite: "observing", text: "我建议绕路。她听见求救，我不否认。问题是我们能不能把活人带出来。" },
    E016: { speaker: "槐序", sprite: "guarded", text: "第二枚票根。看来有些东西比我更不愿意结束。" },
    E017: { speaker: "洛温", sprite: "burdened", text: "先别读。不是所有遗言都该在路上打开。" },
    E018: { speaker: "伊芙白", sprite: "tired", text: "没人笑也正常。这个笑话本来就不是给他们听的。" },
    E019: { speaker: "伊芙白", sprite: "insight", text: "听，口琴在说谎。可它说谎的方式比真话还诚实。" },
    E020: { speaker: "【内心】", text: "调律台前的沉默不是空白，而是三个人都还没想好该把哪句话先交出来。" },
    E101: { speaker: "弥洛", text: "雾里有三组脚步。两组像人，一组不像。" },
    E102: { speaker: "老潘", text: "车轮声骗不了我。那趟车没走主轨，它拐进了早就报废的换轨线。" },
    E103: { speaker: "【内心】", text: "海报上的乐团名字被封条盖住，但巡演路线还留着。它本来不该变成收割路线。" },
    E104: { speaker: "安柠", text: "这字迹和默令残页很像。静默署和禁曲派，可能没有我们想的那么远。" },
    E105: { speaker: "柯婆婆", text: "那天我就是在这张照片背后的站台捡到她的。她那么小，手里还攥着那枚吊坠。" },
    E106: { speaker: "柯婆婆", text: "别回头，小尤娜。看见了也帮不上忙。活人先往前走。" },
    E107: { speaker: "洛温", sprite: "observing", text: "别急着回答。低音最怕的不是慢，是两个人同时把慢当成命令。" },
    E108: { speaker: "槐序", sprite: "guarded", text: "她不是在求安慰。她只是想确认自己听见的正常声音还存在。" },
    E109: { speaker: "【内心】", text: "节目单上的第四小节被手汗磨得发白。你甚至记得那晚纸张的气味。" },
    E110: { speaker: "洛温", sprite: "guardian", text: "两名律者上场，不代表第三个人没有承担结果。复盘时也别把沉默漏掉。" },
    E111: { speaker: "伊芙白", sprite: "falseCheer", text: "恭喜，你的存在成功让三个部门同时觉得格式不优雅。" },
    E112: { speaker: "槐序", sprite: "guarded", text: "你的手在抖。别说没有，我看见杯沿先替你承认了。" },
    E201: { speaker: "弥洛", text: "不要追着光走，追着停顿走。冰锥响起来之前，会先吸走一瞬低音。" },
    E202: { speaker: "安柠", text: "这些文件不是废纸。顺序拼回去，就能看见一个善意课题是从哪一拍开始变坏的。" },
    E203: { speaker: "看塔仪", text: "零号奏者计划阶段性简报：本周期无异常。下一次简报更新，预计……字段已永久损坏。" },
    E204: { speaker: "阿缇娅", sprite: "daily", text: "如果我当初没有被你叫住名字，是不是也会变成这样？" },
    E205: { speaker: "宁溯", text: "这本日记没有机密价值。只有一个人六年来反复确认自己没有资格原谅自己。" },
    E301: { speaker: "柏舟", text: "白谱院的权限验证很死板。好消息是，死板的东西通常也很好预测。" },
    E302: { speaker: "温别克", text: "画像？老喽，记不清了。只记得三十年前，有个姑娘很喜欢在这条走廊里哼不该哼的调子。" },
    E303: { speaker: "安柠", text: "这些学生把零号奏者计划传得像鬼故事。可怕的是，他们每个版本都只错了一半。" },
    E304: { speaker: "弥洛", text: "如果我销毁它，等于假装过去不存在。如果我留着它，等于允许别人随时用它定义我。" },
    E305: { speaker: "珏衡", text: "我签这份契约的时候，没人逼我。也正因为如此，我更不能把不自愿的看管，说成保护。" }
  };

  return dialogueMap[event.id] || { speaker: "【内心】", text: `灰弦公路事件记录：${event.title}` };
}

async function handleAITeaBreak(character, playerAttitude) {
  const beforeState = cloneData(GameState);
  const context = {
    playerAttitude,
    contextType: getTeaBreakContextType(character),
    chapterContext: getCurrentChapterContext(),
    healthTier: getConductorHealthTier(),
    recentBehavior: getRecentBehaviorInsight(character)
  };

  let reply = null;
  let usedDeepSeek = false;

  // 如果启用了DeepSeek，尝试调用API
  if (isDeepSeekEnabled()) {
    // 显示加载状态：主题化文案替代通用转圈
    showChoices([]);
    showDialogue(character, "✦ " + character + "正在思考…", () => {});

    const playerMessage = playerAttitudeToText(playerAttitude);
    const apiReply = await callDeepSeekAPI(character, playerMessage, context);
    const sanitizedReply = sanitizeDeepSeekReply(character, apiReply);

    if (sanitizedReply) {
      reply = sanitizedReply;
      usedDeepSeek = true;
      GameState._teaFailCount = 0;
      // 添加到对话历史
      addToConversationHistory(character, "user", playerMessage);
      addToConversationHistory(character, "assistant", reply.dialogue);
    } else {
      // API 失败：记录失败次数，提供重试或降级
      GameState._teaFailCount = (GameState._teaFailCount || 0) + 1;

      if (GameState._teaFailCount >= 3) {
        // 连续失败 3 次：自动降级本地预设台词
        showToast("信号失谐，已切换本地共鸣", -1);
        GameState._teaFailCount = 0;
      } else {
        // 未达 3 次：显示内联重试按钮（复用 choices-area）
        showChoices([{
          text: "信号失谐，重试",
          effect: () => handleAITeaBreak(character, playerAttitude)
        }]);
        return;
      }
    }
  }

  // 如果没有使用DeepSeek或API失败，使用本地规则引擎
  if (!reply) {
    reply = generateMusicartAIReply(character, context);
  }

  const validation = validateAIReply(reply);
  const safeReply = validation.ok ? reply : createFallbackAIReply(character, validation.reason);

  applyAIReply(safeReply);
  updateUI();
  showStateChangeToasts(beforeState, GameState);

  if (usedDeepSeek) {
    showToast("AI 实时对话已接入", 1);
  }

  renderAIReply(character, safeReply);
}

/* ═══════════════════════════════════════════════════════════════════
   模块: AI 茶歇回复系统 | 行号: ~5941-6145
   函数: generateMusicartAIReply() — 协调 API 调用与回退的主入口
         getRecentBehaviorInsight() — 分析玩家最近的行为模式
         validateAIReply() — 验证 AI 回复的结构完整性
         createFallbackAIReply() — 创建回退回复
         applyAIReply() — 应用 AI 回复的效果
         renderAIReply() — 渲染 AI 回复到对话界面
         getTeaBreakContextType() — 推断当前茶歇语境
         isCriticalTeaBreakReturn() — 检查是否为关键返回场景
         getCurrentChapterContext() — 获取当前章节叙事环境
   ⚠️ 公共 API: generateMusicartAIReply 被茶歇系统调用
   ═══════════════════════════════════════════════════════════════════ */
function generateMusicartAIReply(character, context) {
  const rule = AI_MUSICART_RULES[character];
  const musicart = MUSICART_RULES[character];
  if (!rule || !musicart) {
    return createFallbackAIReply(character, "missing_rule");
  }

  const trust = GameState[musicart.trustKey];
  const resonance = GameState[musicart.resonanceKey];
  const pressure = GameState[musicart.pressureKey];
  const attitude = context.playerAttitude || "casual";
  let reply = cloneData(rule.replies[attitude] || rule.replies.casual);

  if (pressure > rule.highPressureThreshold && attitude === "force") {
    reply = cloneData(rule.highPressureOverride);
  }

  if (trust < 30 && attitude !== "care") {
    reply.dialogue = `你问得太像命令了。${reply.dialogue}`;
    reply.mood = "tense";
  }

  if (resonance > rule.hiddenLineThreshold && attitude !== "force") {
    reply.dialogue += rule.hiddenLineAppend;
    reply.flagEvent = reply.flagEvent || "hidden_line_unlocked";
  }

  if (context.contextType === "B") {
    reply.dialogue += " 前面的路有大事，我能听见节拍在变密。别问我结果，我不知道，也不想假装知道。";
    reply.mood = reply.mood === "warm" ? "thoughtful" : reply.mood;
  }

  if (context.contextType === "D") {
    reply.dialogue += " 现在我的话可能会短一点，不是拒绝你，是这段节拍已经绷得太紧。";
    reply.mood = reply.mood === "warm" ? "tense" : reply.mood;
  }

  if (context.contextType === "E") {
    reply.dialogue += " 你能听见这一层，说明我已经没法再把所有东西都藏回普通回答里。";
    reply.mood = reply.mood === "tense" ? "thoughtful" : reply.mood;
  }

  if (context.healthTier === "poor" || context.healthTier === "critical") {
    reply.dialogue += ` ${getHealthTierPrompt()}`;
    reply.mood = context.healthTier === "critical" ? "alert" : reply.mood;
  }

  if (context.recentBehavior) {
    reply.dialogue += ` 我还记得你刚才那种${context.recentBehavior.judgmentType}的选择。`;
  }

  if (context.chapterContext.includes("第一章") && !reply.dialogue.includes("灰弦公路")) {
    reply.dialogue += " 城外这段路还没安静下来，别把它当成普通旅程。";
  }
  return reply;
}

function getRecentBehaviorInsight(character) {
  if (!Array.isArray(GameState.玩家行为记录) || GameState.玩家行为记录.length === 0) {
    return null;
  }

  const directRecord = [...GameState.玩家行为记录].reverse().find((record) => record.judgmentTarget === character);
  if (directRecord) {
    return directRecord;
  }

  return [...GameState.玩家行为记录].reverse().find((record) => (
    record.judgmentType && record.judgmentType !== "未标注"
  )) || null;
}

function validateAIReply(reply) {
  if (!reply || typeof reply.dialogue !== "string" || reply.dialogue.trim().length === 0) {
    return { ok: false, reason: "missing_dialogue" };
  }

  if (!AI_ALLOWED_MOODS.includes(reply.mood)) {
    return { ok: false, reason: "invalid_mood" };
  }

  if (!Array.isArray(reply.effects) || reply.effects.length > 2) {
    return { ok: false, reason: "invalid_effect_count" };
  }

  const invalidEffect = reply.effects.find((effect) => (
    !AI_RELATION_STATS.has(effect.stat)
    || !Number.isFinite(effect.delta)
    || Math.abs(effect.delta) > 5
  ));
  if (invalidEffect) {
    return { ok: false, reason: "invalid_effect" };
  }

  const forbiddenPatterns = ["AI", "API", "开发者", "模型", "现实世界", "国家", "品牌", "电影", "网络", "之后你会遇到"];
  if (forbiddenPatterns.some((pattern) => reply.dialogue.includes(pattern))) {
    return { ok: false, reason: "forbidden_dialogue" };
  }

  return { ok: true };
}

function createFallbackAIReply(character, reason) {
  return {
    dialogue: "……这句话先停在这里。现在不适合继续往下问。",
    effects: [],
    mood: "withdrawn",
    flagEvent: `ai_reply_blocked:${character}:${reason}`
  };
}

function applyAIReply(reply) {
  reply.effects.forEach((effect) => {
    if (!Number.isFinite(GameState[effect.stat])) {
      GameState[effect.stat] = 0;
    }
    GameState[effect.stat] += effect.delta;
  });

  if (reply.flagEvent) {
    addTriggeredEvent(reply.flagEvent);
  }
}

function renderAIReply(character, reply) {
  showChoices([]);
  showDialogue(character, reply.dialogue, () => {
    showToast(`茶歇语气：${reply.mood}`, reply.effects.some((effect) => effect.delta < 0) ? -1 : 1);
    if (reply.flagEvent === "high_pressure_warning") {
      showToast("她看起来需要休息", -1);
      showChoices([
        { text: "结束交流，让她休息", nextScene: "tea_break_hub" }
      ]);
      return;
    }

    showChoices([
      { text: "继续问路上的风险", effect: () => handleAITeaBreak(character, "strategy") },
      { text: "换成关心她的状态", effect: () => handleAITeaBreak(character, "care") },
      { text: "结束交流，回到调律台", nextScene: "tea_break_hub" }
    ]);
  });
}

function getTeaBreakContextType(character) {
  const rule = MUSICART_RULES[character];
  if (!rule) {
    return "A";
  }

  if (GameState[rule.trustKey] >= 80 || GameState[rule.resonanceKey] >= 80) {
    return "E";
  }

  if (GameState[rule.pressureKey] > 70) {
    return "D";
  }

  const returnSceneId = GameState.茶歇返回场景 || GameState.当前场景ID || "";
  if (isCriticalTeaBreakReturn(returnSceneId)) {
    return "B";
  }

  return "A";
}

function isCriticalTeaBreakReturn(sceneId) {
  return [
    "ch0_004_first_baton",
    "ch1_007",
    "ch2_001",
    "ch2_005",
    "ch3_001",
    "ch3_004",
    "ch3_005",
    "act1_complete"
  ].includes(sceneId);
}

function getCurrentChapterContext() {
  const sceneId = GameState.当前场景ID || "";
  const returnSceneId = GameState.茶歇返回场景 || "";
  if (sceneId.startsWith("ch0_") || returnSceneId.startsWith("ch0_") || sceneId.startsWith("chapter0_event_") || returnSceneId.startsWith("chapter0_event_") || sceneId === "chapter0_start" || returnSceneId === "chapter0_start") {
    return "第零章禁曲未响，独立章节中，禁曲档案与奏者听觉保持隔离记录";
  }

  if (sceneId.startsWith("ch1_black_") || returnSceneId.startsWith("ch1_black_") || sceneId === "chapter1_start" || returnSceneId === "chapter1_start") {
    return "第一章黑巡半响，路线B追查卡戎，雾茧站暴露静默序列制度与双律者合奏";
  }

  if (sceneId.startsWith("ch2_snow_") || returnSceneId.startsWith("ch2_snow_") || sceneId.startsWith("chapter2_event_") || returnSceneId.startsWith("chapter2_event_") || sceneId === "chapter2_start" || returnSceneId === "chapter2_start") {
    return "第二章雪谱冻响，路线B-2追查零号奏者计划，冻谱观测塔揭示母亲残响与宁溯守谱人线";
  }

  if (sceneId.startsWith("ch3_white_") || returnSceneId.startsWith("ch3_white_") || sceneId.startsWith("chapter3_event_E3") || returnSceneId.startsWith("chapter3_event_E3") || sceneId === "chapter3_white_start" || returnSceneId === "chapter3_white_start") {
    return "第三章白谱缚响，路线C-3返回白谱院正面交涉，登记听证与阿缇娅自主权判定";
  }

  if (sceneId.startsWith("ch4_") || returnSceneId.startsWith("ch4_") || sceneId.startsWith("chapter4_event_") || returnSceneId.startsWith("chapter4_event_") || sceneId === "chapter4_start" || returnSceneId === "chapter4_start") {
    return "第四章不夜终响，路线D追查卡戎主线收束，不夜巡演号展开救赎值、归还值与真相值判定";
  }

  if (sceneId.startsWith("ch1_") || returnSceneId.startsWith("ch1_") || sceneId.startsWith("ch2_") || returnSceneId.startsWith("ch2_") || sceneId.startsWith("ch3_") || returnSceneId.startsWith("ch3_") || sceneId === "chapter3_archive_start" || returnSceneId === "chapter3_archive_start" || sceneId === "act1_complete" || returnSceneId === "act1_complete") {
    return "第三章旧案合辑，旧第一至第三章内容暂存归档，等待按新第三章结构重新拆谱";
  }

  if (sceneId.startsWith("chapter1") || returnSceneId.startsWith("chapter1") || Object.values(TEA_BREAK_SCENES).includes(sceneId) || sceneId === "tea_break_hub") {
    return "第一章黑巡半响，旧谱已隔离，新第一拍接续第零章";
  }

  return "旅途中，失谐潮仍在扩散";
}

/* ───────────────────────────────────────────────────────────
   模块: 场景条件系统 | 行号: ~6146-6174
   函数: checkSceneConditions() — 检查场景准入条件
         areConditionsMet() / isConditionMet() — 条件求值
   被引用: showScene() — 场景切换前验证
   ⚠️ 条件类型: { type: "stat"|"eventTriggered"|"hasMusicart"|"关系", ... }
   ─────────────────────────────────────────────────────────── */
function checkSceneConditions(scene) {
  const failedCondition = (scene.conditions || []).find((condition) => !isConditionMet(condition));

  if (failedCondition) {
    return { allowed: false, fallbackScene: failedCondition.fallbackScene };
  }

  return { allowed: true };
}

function areConditionsMet(conditions) {
  return !Array.isArray(conditions) || conditions.every((condition) => isConditionMet(condition));
}

function isConditionMet(condition) {
  const currentValue = GameState[condition.key];

  if (condition.operator === ">=") return currentValue >= condition.value;
  if (condition.operator === ">") return currentValue > condition.value;
  if (condition.operator === "<=") return currentValue <= condition.value;
  if (condition.operator === "<") return currentValue < condition.value;
  if (condition.operator === "==") return currentValue === condition.value;
  if (condition.operator === "!=") return currentValue !== condition.value;
  if (condition.operator === "includes") return GameState.已触发事件.includes(condition.value);
  if (condition.operator === "notIncludes") return !GameState.已触发事件.includes(condition.value);

  return true;
}

/* ───────────────────────────────────────────────────────────
   模块: 视觉呈现辅助 | 行号: ~6175-6273
   函数: applySpeakerPresentation() — 根据发言者设置对话区头像样式
         fadeSceneBackground() — 场景背景渐变动画
         buildBackgroundLayer() — 构建背景图层
         updateCharacterSprite() — 更新角色立绘
         getCharacterAssetPath() — 获取角色立绘资源路径
         getFirstDialogueSpeaker() — 获取对话序列的第一个发言者
   ⚠️ 注意: updateCharacterSprite 使用 CSS 动画 (speaker-entrance) 切换立绘
   ─────────────────────────────────────────────────────────── */
function applySpeakerPresentation(speaker, dialogueArea, avatarElement) {
  const isInnerVoice = speaker === "【内心】";
  dialogueArea.classList.toggle("is-inner", isInnerVoice);
  avatarElement.classList.toggle("is-hidden", isInnerVoice);
  const avatarImage = avatarElement.querySelector(".avatar-portrait");
  const avatarFallback = avatarElement.querySelector(".avatar-fallback");

  if (isInnerVoice) {
    if (avatarFallback) {
      avatarFallback.textContent = "";
    }
    if (avatarImage) {
      avatarImage.removeAttribute("src");
      avatarImage.alt = "";
    }
    avatarElement.classList.remove("has-portrait");
    return;
  }

  const avatar = AVATAR_STYLES[speaker] || {
    color: "#4A5568",
    label: Array.from(speaker || "旁白")[0] || "旁"
  };
  const portraitPath = getCharacterAssetPath(speaker);

  avatarElement.style.setProperty("--avatar-accent", avatar.color);
  if (avatarFallback) {
    avatarFallback.textContent = avatar.label;
  }

  if (avatarImage && portraitPath) {
    avatarImage.src = portraitPath;
    avatarImage.alt = `${speaker}头像`;
    avatarElement.classList.add("has-portrait");
  } else {
    if (avatarImage) {
      avatarImage.removeAttribute("src");
      avatarImage.alt = "";
    }
    avatarElement.classList.remove("has-portrait");
  }
}

function fadeSceneBackground(backgroundElement, background, imagePath) {
  backgroundElement.classList.add("is-fading");

  setTimeout(() => {
    backgroundElement.style.background = buildBackgroundLayer(background, imagePath);
    backgroundElement.classList.remove("is-fading");
  }, 120);
}

function buildBackgroundLayer(background, imagePath) {
  if (!imagePath) {
    return background;
  }

  return `url("${imagePath}") center / cover no-repeat, ${background}`;
}

function updateCharacterSprite(speaker, variant) {
  const spriteElement = document.getElementById("character-sprite");
  if (!spriteElement) {
    return;
  }

  const assetPath = getCharacterAssetPath(speaker, variant);
  if (!assetPath) {
    spriteElement.hidden = true;
    spriteElement.removeAttribute("src");
    return;
  }

  if (spriteElement.getAttribute("src") !== assetPath) {
    spriteElement.style.opacity = "0";
    spriteElement.hidden = true;
    spriteElement.onload = () => {
      spriteElement.hidden = false;
      spriteElement.style.opacity = "0.95";
    };
    spriteElement.onerror = () => {
      spriteElement.hidden = true;
      spriteElement.removeAttribute("src");
    };
    setTimeout(() => {
      spriteElement.src = assetPath;
    }, 90);
    return;
  }

  spriteElement.hidden = false;
  spriteElement.style.opacity = "0.95";
}

function getCharacterAssetPath(speaker, variant) {
  if (!speaker || speaker === "【内心】") {
    return "";
  }

  const characterAssets = ASSETS.characters[speaker];
  if (!characterAssets) {
    return "";
  }

  return characterAssets[variant] || characterAssets.default || "";
}

function getFirstDialogueSpeaker(dialogues) {
  const firstVisualDialogue = dialogues.find((dialogue) => getCharacterAssetPath(dialogue.speaker, dialogue.sprite));
  return firstVisualDialogue ? firstVisualDialogue.speaker : "";
}

function renderSystemPrompt(systemPromptElement, systemPrompt) {
  if (!systemPrompt) {
    systemPromptElement.hidden = true;
    systemPromptElement.textContent = "";
    return;
  }

  systemPromptElement.hidden = false;
  systemPromptElement.textContent = systemPrompt;
}

/* ═══════════════════════════════════════════════════════════════════
   模块: 存档数据序列化 | 行号: ~6274-6444
   函数: createSavePayload() — 创建存档数据对象
         readSavePayload() — 读取 localStorage 中的存档
         normalizeSavePayload() — 标准化存档数据（修复缺失字段）
         migrateLegacyState() — 迁移旧版存档格式
         applySavePayload() — 应用存档数据到运行时
         getLatestAvailableSave() — 获取最近可用存档
         getCurrentPlayTimeMs() — 获取当前游戏时间
         getChapterName() — 获取存档的章节名
         isValidSlot() — 验证存档槽位有效性
   ⚠️ 修改注意: normalizeSavePayload 和 migrateLegacyState 是存档兼容性的关键
               新增 GameState 字段必须在此添加默认值和迁移逻辑
   ═══════════════════════════════════════════════════════════════════ */
function createSavePayload(source) {
  return {
    version: 2,
    source,
    savedAt: new Date().toISOString(),
    state: cloneData(GameState),
    meta: {
      chapterName: getChapterName(GameState.当前场景ID),
      currentSceneId: GameState.当前场景ID,
      stability: GameState.城邦稳定度,
      playTimeMs: getCurrentPlayTimeMs()
    }
  };
}

function readSavePayload(key) {
  const rawSave = localStorage.getItem(key);
  if (!rawSave) {
    return null;
  }

  try {
    const parsedSave = JSON.parse(rawSave);
    return normalizeSavePayload(parsedSave);
  } catch (error) {
    console.warn(`readSavePayload(): invalid save at ${key}`, error);
    return null;
  }
}

function normalizeSavePayload(parsedSave) {
  if (!parsedSave) {
    return null;
  }

  const hasWrappedState = parsedSave.state && typeof parsedSave.state === "object";
  const state = hasWrappedState ? parsedSave.state : parsedSave;
  const meta = hasWrappedState ? parsedSave.meta || {} : {};
  const migratedState = migrateLegacyState(state);

  return {
    version: parsedSave.version || 1,
    source: parsedSave.source || "legacy",
    savedAt: parsedSave.savedAt || new Date().toISOString(),
    state: {
      ...cloneData(DEFAULT_GAME_STATE),
      ...migratedState,
      已触发事件: Array.isArray(migratedState.已触发事件) ? migratedState.已触发事件 : [],
      玩家行为记录: Array.isArray(migratedState.玩家行为记录) ? migratedState.玩家行为记录 : [],
      关系判定记录: Array.isArray(migratedState.关系判定记录) ? migratedState.关系判定记录 : [],
      隐藏台词记录: Array.isArray(migratedState.隐藏台词记录) ? migratedState.隐藏台词记录 : []
    },
    meta: {
      chapterName: meta.chapterName || getChapterName(migratedState.当前场景ID),
      currentSceneId: meta.currentSceneId || migratedState.当前场景ID || "chapter1_start",
      stability: Number.isFinite(meta.stability) ? meta.stability : migratedState.城邦稳定度,
      playTimeMs: Number.isFinite(meta.playTimeMs) ? meta.playTimeMs : 0
    }
  };
}

function migrateLegacyState(state) {
  const migratedState = { ...state };

  if (Number.isFinite(migratedState.槐序信任) && !Number.isFinite(migratedState.槐序共鸣)) {
    migratedState.槐序共鸣 = migratedState.槐序信任;
  }

  if (!Number.isFinite(migratedState.槐序信任) && Number.isFinite(migratedState.槐序共鸣)) {
    migratedState.槐序信任 = Math.min(migratedState.槐序共鸣, 50);
  }

  if (!Array.isArray(migratedState.玩家行为记录)) {
    migratedState.玩家行为记录 = [];
  }

  if (!Array.isArray(migratedState.关系判定记录)) {
    migratedState.关系判定记录 = [];
  }

  if (!Array.isArray(migratedState.隐藏台词记录)) {
    migratedState.隐藏台词记录 = [];
  }

  [
    "安柠好感", "缇雅好感", "诺伊好感", "诺伊希望", "诺伊恐惧",
    "镇民信任", "镇民希望", "镇民恐惧", "白栖信任", "乌鸦先生信任",
    "宁溯好感", "体感温度", "谱鸣共振", "听证倾向值", "沈知微好感", "珏衡好感",
    "救赎值", "归还值", "真相值", "伊莱娜隐藏好感值"
  ].forEach((key) => {
    if (!Number.isFinite(migratedState[key])) {
      migratedState[key] = DEFAULT_GAME_STATE[key];
    }
  });

  if (!migratedState.奏者姓名) {
    migratedState.奏者姓名 = resolveDefaultConductorName(migratedState.奏者性别);
  }

  if (!migratedState.主角默认形象) {
    migratedState.主角默认形象 = resolveDefaultProtagonistAsset(migratedState.奏者性别);
  }

  if (typeof migratedState.终局已触发 !== "boolean") {
    migratedState.终局已触发 = false;
  }

  if (!migratedState.个人故事返回场景) {
    migratedState.个人故事返回场景 = migratedState.茶歇返回场景 || migratedState.当前场景ID || "chapter1_start";
  }

  migratedState.关系系统版本 = 2;
  return migratedState;
}

function applySavePayload(payload) {
  const normalized = normalizeSavePayload(payload);
  if (!normalized) {
    return;
  }

  GameState = normalized.state;
  loadedPlayTimeMs = normalized.meta.playTimeMs || 0;
  playSessionStartedAt = Date.now();
  window.GameState = GameState;
  updateUI();
}

function getLatestAvailableSave() {
  const candidates = [AUTOSAVE_KEY, STORAGE_KEY, "save_slot_1", "save_slot_2", "save_slot_3"]
    .map((key) => ({ key, payload: readSavePayload(key) }))
    .filter((entry) => entry.payload);

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => new Date(b.payload.savedAt).getTime() - new Date(a.payload.savedAt).getTime());
  return candidates[0];
}

function getCurrentPlayTimeMs() {
  return loadedPlayTimeMs + Math.max(Date.now() - playSessionStartedAt, 0);
}

function getChapterName(sceneId) {
  if (!sceneId) {
    return "未编排章节";
  }

  if (sceneId.startsWith("ch1_black_") || sceneId === "chapter1_start") {
    return "第一章：黑巡半响";
  }

  if (sceneId.startsWith("ch2_snow_") || sceneId.startsWith("chapter2_event_") || sceneId === "chapter2_start") {
    return "第二章：雪谱冻响";
  }

  if (sceneId.startsWith("ch3_white_") || sceneId.startsWith("chapter3_event_E3") || sceneId === "chapter3_white_start") {
    return "第三章：白谱缚响";
  }

  if (sceneId.startsWith("ch4_") || sceneId.startsWith("chapter4_event_") || sceneId === "chapter4_start") {
    return "第四章：不夜终响";
  }

  if (sceneId.startsWith("ch1_") || sceneId.startsWith("ch2_") || sceneId.startsWith("ch3_") || sceneId === "chapter3_archive_start" || sceneId === "act1_complete") {
    return "第三章旧案合辑";
  }

  if (sceneId.startsWith("ch0_") || sceneId.startsWith("chapter0_event_") || sceneId === "chapter0_start") {
    return "第零章：禁曲未响";
  }

  if (sceneId.startsWith("chapter1")) {
    return "第一章：黑巡半响";
  }

  return "未命名章节";
}

function isValidSlot(slot) {
  return Number.isInteger(slot) && slot >= 1 && slot <= 3;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showStateChangeToasts(beforeState, afterState) {
  const trackedKeys = [
    "城邦稳定度", "世界失谐度", "粮药", "音芯", "奏者健康",
    "槐序信任", "槐序共鸣", "槐序压力",
    "洛温信任", "洛温共鸣", "洛温压力",
    "阿缇娅信任", "阿缇娅共鸣", "阿缇娅压力",
    "弥洛信任", "弥洛共鸣", "弥洛压力",
    "安柠好感", "缇雅好感", "诺伊好感", "诺伊希望", "诺伊恐惧",
    "镇民信任", "镇民希望", "镇民恐惧", "白栖信任", "乌鸦先生信任",
    "伊芙白信任", "伊芙白共鸣", "伊芙白压力",
    "明弦信任", "明弦共鸣", "明弦压力",
    "白谱院声望值", "回声议会声望值", "世界观信息", "残留音核", "仪仗核心残片",
    "救赎值", "归还值", "真相值", "伊莱娜隐藏好感值"
  ];

  trackedKeys.forEach((key) => {
    const delta = afterState[key] - beforeState[key];
    if (delta !== 0) {
      showToast(formatStateLabel(key, delta), delta);
    }
  });

  if (beforeState.白谱院声望 !== afterState.白谱院声望) {
    showToast(`白谱院声望 → ${afterState.白谱院声望}`, afterState.白谱院声望 === "敌对" ? -1 : 1);
  }
}

/* ───────────────────────────────────────────────────────────
   模块: Toast / 提示系统 | 行号: ~6445-6503
   函数: showStateChangeToasts() — 比较状态变化并显示提示
         showToast() — 显示单个提示弹窗
         formatStateLabel() — 格式化状态标签
   ⚠️ 被 apply_hooks.js Hook 2 整体替换为 VFXManager.showRelationshipToast
       修改 showToast 后需重新运行 `node apply_hooks.js`
   ─────────────────────────────────────────────────────────── */
function showToast(text, delta) {
  if (typeof VFXManager !== "undefined") {
    let name = "系统";
    let stat = text;
    let color = "#D4AF37";
    if (text.includes("·")) {
      const parts = text.split("·");
      name = parts[0];
      stat = parts[1].replace(/(\+|-)\d+/, '').trim();
    }
    if (name === "槐序") color = "#C49A45";
    else if (name === "洛温") color = "#5A3728";
    else if (name === "伊芙白") color = "#1F5F9C";
    else if (name === "冥显") color = "#8B2354";

    VFXManager.showRelationshipToast(name, stat, delta, color);
    return;
  }

  const toastArea = document.getElementById("toast-area");
  const toast = document.createElement("div");
  toast.className = `state-toast${delta < 0 ? " negative" : ""}`;
  toast.textContent = text;
  toastArea.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 1500);
}

function formatStateLabel(key, delta) {
  const labelMap = {
    城邦稳定度: "城邦稳定度",
    世界失谐度: "世界失谐度",
    粮药: "粮药",
    音芯: "音芯",
    奏者健康: "奏者健康",
    槐序信任: "槐序·信任",
    槐序共鸣: "槐序·共鸣",
    槐序压力: "槐序·压力",
    洛温信任: "洛温·信任",
    洛温共鸣: "洛温·共鸣",
    洛温压力: "洛温·压力",
    阿缇娅信任: "阿缇娅·信任",
    阿缇娅共鸣: "阿缇娅·共鸣",
    阿缇娅压力: "阿缇娅·压力",
    弥洛信任: "弥洛·信任",
    弥洛共鸣: "弥洛·共鸣",
    弥洛压力: "弥洛·压力",
    安柠好感: "安柠·好感",
    缇雅好感: "缇雅·好感",
    诺伊好感: "诺伊·好感",
    诺伊希望: "诺伊·希望",
    诺伊恐惧: "诺伊·恐惧",
    镇民信任: "镇民·信任",
    镇民希望: "镇民·希望",
    镇民恐惧: "镇民·恐惧",
    白栖信任: "白栖·信任",
    乌鸦先生信任: "乌鸦先生·信任",
    伊芙白信任: "伊芙白·信任",
    伊芙白共鸣: "伊芙白·共鸣",
    伊芙白压力: "伊芙白·压力",
    明弦信任: "明弦·信任",
    明弦共鸣: "明弦·共鸣",
    明弦压力: "明弦·压力",
    白谱院声望值: "白谱院声望",
    回声议会声望值: "回声议会声望",
    世界观信息: "世界观信息",
    残留音核: "残留音核",
    仪仗核心残片: "仪仗核心残片",
    救赎值: "零四·救赎值",
    归还值: "零七·归还值",
    真相值: "卡戎·真相值",
    伊莱娜隐藏好感值: "伊莱娜·隐藏好感"
  };
  const sign = delta > 0 ? "+" : "";
  return `${labelMap[key] || key} ${sign}${delta}`;
}

/* ───────────────────────────────────────────────────────────
   模块: 运行时标记 / 工具函数 | 行号: ~6504-6545
   addTriggeredEvent(eventId) — 添加已触发事件到 GameState
   updateRuntimeSceneFlags(sceneId) — 更新运行时场景标记 (失调风险等)
   setText(id, value) — 设置 DOM 文本内容的安全助手
   clamp(value, min, max) — 数值限制
   cloneData(data) — 深拷贝 (JSON 序列化方式)
   ⚠️ 辅助工具函数: 被多个模块调用
   ─────────────────────────────────────────────────────────── */
function addTriggeredEvent(eventId) {
  if (!GameState.已触发事件.includes(eventId)) {
    GameState.已触发事件.push(eventId);
  }
}

const RUNTIME_EVENT_FLAGS = ["__dissonance_risk_luowen__", "__dissonance_risk_active__"];

function updateRuntimeSceneFlags(sceneId) {
  GameState.已触发事件 = GameState.已触发事件.filter((eventId) => !RUNTIME_EVENT_FLAGS.includes(eventId));

  if (sceneId !== "ch1_007" && sceneId !== "chapter1_003_battle_intro" && sceneId !== "ch3_005") {
    return;
  }

  const luowenRule = MUSICART_RULES["洛温"];
  const hasLuowenRisk = luowenRule && getDissonanceChance(luowenRule) > 0;
  if (hasLuowenRisk && (sceneId === "ch1_007" || sceneId === "chapter1_003_battle_intro")) {
    addTriggeredEvent("__dissonance_risk_luowen__");
  }

  if (hasLuowenRisk && sceneId === "ch3_005") {
    addTriggeredEvent("__dissonance_risk_active__");
  }
}

function setText(id, value) {
  // 当响应式HUD开启时，拦截并忽略对这些原生节点的直接赋值，防止破坏跳字动画
  if (window.ReactiveHUD && ["stability-value", "discord-value", "supply-value", "core-value", "health-value"].includes(id)) {
    return;
  }
  const element = document.getElementById(id);
  if (element) {
    element.textContent = String(value);
  }
}

function updateStatusBarState() {
  if (window.ReactiveHUD) {
    window.ReactiveHUD.syncFromGameState(GameState);
    return;
  }

  const statusConfigs = [
    {
      key: "stability",
      value: GameState.城邦稳定度,
      max: 100,
      dangerWhen: "low",
      hint: "降到0会进入城邦崩溃结局；救援、市民安抚和胜利会提高它。"
    },
    {
      key: "discord",
      value: GameState.世界失谐度,
      max: 100,
      dangerWhen: "high",
      hint: "达到100会进入失谐结局；错误调律、污染和失败会推高它。"
    },
    {
      key: "supply",
      value: GameState.粮药,
      max: 20,
      dangerWhen: "low",
      hint: "地图事件、补给选择和部分行动会消耗粮药。"
    },
    {
      key: "core",
      value: GameState.音芯,
      max: 12,
      dangerWhen: "low",
      hint: "音芯用于高阶调律和关键战斗行动。"
    },
    {
      key: "health",
      value: GameState.奏者健康,
      max: 100,
      dangerWhen: "low",
      hint: `${getHealthTierPrompt()} 健康越低，强行指挥和失调代价越重。`
    }
  ];

  statusConfigs.forEach((config) => {
    const item = document.querySelector(`[data-status-key="${config.key}"]`);
    const meter = document.getElementById(`${config.key}-meter`);
    if (!item) {
      return;
    }

    const value = clamp(config.value, 0, config.max);
    const ratio = config.max > 0 ? value / config.max : 0;
    const danger = config.dangerWhen === "high" ? ratio >= 0.76 : ratio <= 0.24;
    const warning = config.dangerWhen === "high" ? ratio >= 0.55 : ratio <= 0.42;

    item.classList.toggle("is-danger", danger);
    item.classList.toggle("is-warning", !danger && warning);
    item.classList.toggle("is-good", !danger && !warning);
    item.title = `${item.querySelector(".status-label")?.textContent || "状态"}：${config.value}/${config.max}。${config.hint}`;

    if (meter) {
      meter.style.width = `${Math.round(Math.min(ratio, 1) * 100)}%`;
    }
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

// ===== AI 设置模态框 =====
/* ═══════════════════════════════════════════════════════════════════
   模块: AI 设置模态框 | 行号: ~6546-6659
   函数: openAISettingsModal(), closeAISettingsModal(), updateAISettingsUI(),
         handleSaveApiKey(), handleClearApiKey(), handleClearChatHistory()
   ⚠️ 公共 API: 被 UI 按钮事件调用
   ═══════════════════════════════════════════════════════════════════ */
function openAISettingsModal() {
  const modal = document.getElementById("ai-settings-modal");
  if (modal) {
    modal.hidden = false;
    updateAISettingsUI();
  }
}

function closeAISettingsModal() {
  const modal = document.getElementById("ai-settings-modal");
  if (modal) {
    modal.hidden = true;
  }
}

function updateAISettingsUI() {
  const statusText = document.getElementById("ai-status-text");
  const input = document.getElementById("deepseek-api-key-input");

  if (statusText) {
    if (isDeepSeekEnabled()) {
      statusText.textContent = "当前状态：已启用 AI 实时对话";
      statusText.classList.add("enabled");
    } else {
      statusText.textContent = "当前状态：未启用（使用本地预设对话）";
      statusText.classList.remove("enabled");
    }
  }

  if (input) {
    const key = getDeepSeekApiKey();
    if (key) {
      // 显示掩码
      input.value = key.length > 8 ? key.slice(0, 4) + "****" + key.slice(-4) : key;
    } else {
      input.value = "";
    }
  }
}

function handleSaveApiKey() {
  const input = document.getElementById("deepseek-api-key-input");
  if (!input) return;

  const value = input.value.trim();
  // 如果是掩码格式（包含****），不修改
  if (value.includes("****")) {
    showToast("密钥未变更", 0);
    return;
  }

  if (saveDeepSeekApiKey(value)) {
    if (value) {
      showToast("API 密钥已保存，AI 对话已启用", 1);
    } else {
      showToast("API 密钥已清除", 0);
    }
    updateAISettingsUI();
    // 清除对话历史，因为新密钥可能对应不同的使用场景
    clearConversationHistory();
  } else {
    showToast("保存失败", -1);
  }
}

function handleClearApiKey() {
  saveDeepSeekApiKey("");
  clearConversationHistory();
  updateAISettingsUI();
  showToast("API 密钥已清除", 0);
}

function handleClearChatHistory() {
  clearConversationHistory();
  showToast("对话历史已清除", 0);
}

window.GameState = GameState;
window.SCENES = SCENES;
window.BATTLES = BATTLES;
window.ASSETS = ASSETS;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.updateUI = updateUI;
window.showScene = showScene;
window.goToScene = showScene;
window.showDialogue = showDialogue;
window.showChoices = showChoices;
window.startBattle = startBattle;
window.handleBattleAction = handleBattleAction;
window.handleUltimateAction = handleUltimateAction;
window.showMainMenu = showMainMenu;
window.openWorldMap = openWorldMap;
window.showToast = showToast;
window.generateMusicartAIReply = generateMusicartAIReply;
window.validateAIReply = validateAIReply;
window.RELATIONSHIP_DATA = RELATIONSHIP_DATA;
window.getMusicartRelationship = getMusicartRelationship;
window.showRelationshipDebugSummary = showRelationshipDebugSummary;
window.debugDissonanceRate = debugDissonanceRate;
window.drawChapter0MapEvent = drawChapter0MapEvent;
window.drawChapter1MapEvent = drawChapter1MapEvent;
window.drawChapter2MapEvent = drawChapter2MapEvent;
window.drawChapter3MapEvent = drawChapter3MapEvent;

// AI 茶歇调试接口
window.isDeepSeekEnabled = isDeepSeekEnabled;
window.saveDeepSeekApiKey = saveDeepSeekApiKey;
window.getDeepSeekApiKey = getDeepSeekApiKey;
window.callDeepSeekAPI = callDeepSeekAPI;
window.clearConversationHistory = clearConversationHistory;
window.openAISettingsModal = openAISettingsModal;
window.closeAISettingsModal = closeAISettingsModal;

document.addEventListener("DOMContentLoaded", () => {
  applyUISettings();
  updateUI();
  hydrateConfiguredIcons();
  bindMenuEvents();
  bindMotionEffects();
  initNoteEffects();
  scheduleOpeningCompletion();
  showStartupScreen();
});

/* ═══════════════════════════════════════════════════════════════════
   模块: 事件绑定 (bindMenuEvents) | 行号: ~6660-6756
   功能: 将 HTML 按钮/元素的点击事件绑定到对应的处理函数
   绑定范围: 主菜单按钮, 快捷栏按钮, 存档/读取, 奏者选择, AI设置,
            队伍选择, 战斗行动, 模态弹窗关闭等
   ⚠️ 这是 DOM 事件的集中绑定点，新增按钮需要在此注册
   ═══════════════════════════════════════════════════════════════════ */
function bindMenuEvents() {
  const dialogueArea = document.getElementById("dialogue-area");
  if (dialogueArea) {
    dialogueArea.addEventListener("click", advanceDialogueFromBox);
    dialogueArea.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        advanceDialogueFromBox();
      }
    });
  }

  document.getElementById("continue-button").addEventListener("click", () => {
    continueJourney();
  });

  document.getElementById("save-records-button").addEventListener("click", () => {
    openSaveModal("load");
  });

  document.getElementById("entry-home-button")?.addEventListener("click", () => {
    showEntryPage("entry-home");
  });

  document.querySelectorAll("[data-entry-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      jumpEntryPanel(button.dataset.entryJump);
    });
  });

  document.querySelectorAll("[data-entry-scene]").forEach((button) => {
    button.addEventListener("click", () => {
      quickStartEntryScene(button.dataset.entryScene);
    });
  });

  document.getElementById("entry-team-preview-button")?.addEventListener("click", () => {
    showTeamSelect({ nextScene: GameState.当前场景ID || "chapter1_start" });
  });

  document.getElementById("entry-tea-preview-button")?.addEventListener("click", () => {
    openQuickTeaBreak();
  });

  document.getElementById("entry-gacha-button")?.addEventListener("click", openGachaModal);
  document.getElementById("entry-gacha-card-button")?.addEventListener("click", openGachaModal);
  document.getElementById("entry-settings-button")?.addEventListener("click", openSettingsModal);
  document.getElementById("entry-worldmap-button")?.addEventListener("click", openWorldMap);
  document.getElementById("entry-worldmap-top-button")?.addEventListener("click", openWorldMap);
  document.getElementById("entry-ai-button")?.addEventListener("click", openAISettingsModal);

  document.querySelectorAll(".conductor-toggle-button").forEach((button) => {
    button.addEventListener("click", () => {
      GameState.奏者性别 = button.dataset.teamGender || "男";
      renderTeamSelect();
    });
  });

  document.getElementById("team-confirm-button").addEventListener("click", () => {
    confirmTeamSelection();
  });

  document.getElementById("team-back-button").addEventListener("click", () => {
    returnFromTeamSelect();
  });

  document.getElementById("quick-team-button").addEventListener("click", () => {
    openQuickTeamSelect();
  });

  document.getElementById("quick-worldmap-button").addEventListener("click", () => {
    openWorldMap();
  });

  document.getElementById("quick-tea-button").addEventListener("click", () => {
    openQuickTeaBreak();
  });

  document.getElementById("quick-save-button").addEventListener("click", () => {
    saveGame();
  });

  document.getElementById("quick-load-button").addEventListener("click", () => {
    openSaveModal("load");
  });

  document.getElementById("quick-restart-chapter-button")?.addEventListener("click", () => {
    restartCurrentChapter();
  });

  document.getElementById("quick-menu-button").addEventListener("click", () => {
    showMainMenu();
  });

  document.getElementById("quick-dossier-button").addEventListener("click", () => {
    openDossierModal();
  });

  document.getElementById("dossier-modal-close").addEventListener("click", () => {
    closeDossierModal();
  });

  document.getElementById("dossier-modal").addEventListener("click", (event) => {
    if (event.target.id === "dossier-modal") {
      closeDossierModal();
    }
  });

  document.getElementById("save-modal-close").addEventListener("click", () => {
    closeSaveModal();
  });

  /* ═════════════════════════════════════════════════════════════════
     模块: 律者档案弹窗 (Dossier Modal) | 2026-07-08 新增
     功能: 快捷栏「律者档案」按钮 → 打开可浏览全部律者资料的弹窗
     数据源: MUSICART_RULES / MUSICART_PROFILES / MUSICART_DETAIL_PROFILES / GameState
     ═════════════════════════════════════════════════════════════════ */
  function openDossierModal() {
    const modal = document.getElementById("dossier-modal");
    const listEl = document.getElementById("dossier-list");
    if (!modal || !listEl) return;
    const names = Object.keys(MUSICART_RULES);
    listEl.innerHTML = names.map((name) => {
      const profile = MUSICART_PROFILES[name] || { codename: "律者", concept: "", avatar: name.slice(0, 1) };
      const detail = MUSICART_DETAIL_PROFILES[name] || {};
      const role = detail.role || "未登记";
      const accent = (AVATAR_STYLES && AVATAR_STYLES[name] && AVATAR_STYLES[name].color) || "#C49A45";
      return `<button type="button" class="dossier-card" data-dossier-name="${escapeHTML(name)}">
        <span class="dossier-avatar" style="--avatar-color:${escapeHTML(accent)}">${escapeHTML(profile.avatar || name.slice(0, 1))}</span>
        <span class="dossier-card-name">${escapeHTML(name)}</span>
        <span class="dossier-card-codename">${escapeHTML(profile.codename || "")}</span>
        <span class="dossier-card-role">${escapeHTML(role)}</span>
      </button>`;
    }).join("");
    listEl.querySelectorAll(".dossier-card").forEach((card) => {
      card.addEventListener("click", () => showDossierDetail(card.dataset.dossierName));
    });
    modal.hidden = false;
    if (names.length) showDossierDetail(names[0]);
  }

  function showDossierDetail(name) {
    const detailEl = document.getElementById("dossier-detail");
    if (!detailEl) return;
    const profile = MUSICART_PROFILES[name] || { codename: "律者", concept: "音乐化身", avatar: name.slice(0, 1) };
    const rule = MUSICART_RULES[name];
    const detail = MUSICART_DETAIL_PROFILES[name] || {
      englishName: name, faction: "未登记", role: "未登记",
      temperament: "档案整理中。", combatNote: "暂无战斗注释。",
      keywords: [profile.codename, profile.concept].filter(Boolean),
      skillCards: []
    };
    const portrait = (ASSETS && ASSETS.characters && ASSETS.characters[name] && (ASSETS.characters[name].default || ASSETS.characters[name].battle)) || "";
    const accent = (AVATAR_STYLES && AVATAR_STYLES[name] && AVATAR_STYLES[name].color) || "#C49A45";
    const trust = rule ? Number(GameState[rule.trustKey] || 0) : 0;
    const resonance = rule ? Number(GameState[rule.resonanceKey] || 0) : 0;
    const pressure = rule ? Number(GameState[rule.pressureKey] || 0) : 0;
    const skillCards = (detail.skillCards && detail.skillCards.length) ? detail.skillCards : [{ name: profile.codename || "能力", text: profile.concept || "—" }];
    const keywords = (detail.keywords && detail.keywords.length) ? detail.keywords : [profile.codename, profile.concept].filter(Boolean);
    const isSelected = GameState.出战律者 && GameState.出战律者.includes(name);

    detailEl.innerHTML = `<div class="dossier-detail-shell" style="--detail-accent:${escapeHTML(accent)}">
      <div class="dossier-detail-head">
        ${portrait ? `<img class="dossier-portrait" src="${escapeHTML(portrait)}" alt="${escapeHTML(name)}立绘">` : `<span class="dossier-portrait-fallback">${escapeHTML(profile.avatar || name.slice(0, 1))}</span>`}
        <div class="dossier-detail-titles">
          <p class="dossier-detail-kicker">MUSICART FILE</p>
          <h3>${escapeHTML(name)}</h3>
          <span class="dossier-detail-en">${escapeHTML(detail.englishName || name)}</span>
          <div class="dossier-detail-faction">${escapeHTML(detail.faction || "未登记")}</div>
          ${isSelected ? `<span class="dossier-detail-badge">当前队伍</span>` : ""}
        </div>
      </div>
      <dl class="dossier-detail-stats">
        ${buildDetailStat("信任", trust)}
        ${buildDetailStat("共鸣", resonance)}
        ${buildDetailStat("压力", pressure)}
      </dl>
      <section class="dossier-detail-block">
        <h4>角色定位</h4>
        <p>${escapeHTML(detail.role || "未登记")}</p>
      </section>
      <section class="dossier-detail-block">
        <h4>气质</h4>
        <p>${escapeHTML(detail.temperament || "—")}</p>
      </section>
      <section class="dossier-detail-block">
        <h4>战斗注释</h4>
        <p>${escapeHTML(detail.combatNote || "—")}</p>
      </section>
      <section class="dossier-detail-block">
        <h4>关键词</h4>
        <div class="dossier-keywords">${keywords.map((k) => `<span class="dossier-keyword">${escapeHTML(k)}</span>`).join("")}</div>
      </section>
      <section class="dossier-detail-block">
        <h4>技能卡</h4>
        <div class="dossier-skills">${skillCards.map((s) => `<div class="dossier-skill"><strong>${escapeHTML(s.name)}</strong><p>${escapeHTML(s.text)}</p></div>`).join("")}</div>
      </section>
    </div>`;
  }

  function closeDossierModal() {
    const modal = document.getElementById("dossier-modal");
    if (modal) modal.hidden = true;
  }

  document.getElementById("save-modal").addEventListener("click", (event) => {
    if (event.target.id === "save-modal") {
      closeSaveModal();
    }
  });

  document.querySelectorAll(".conductor-option").forEach((button) => {
    button.addEventListener("click", () => {
      const gender = button.dataset.gender;
      const defaultName = button.dataset.defaultName || "";
      closeConductorModal();
      if (typeof pendingConductorSelection === "function") {
        const callback = pendingConductorSelection;
        pendingConductorSelection = null;
        callback(gender, defaultName);
      }
    });
  });

  // AI 设置模态框事件
  const aiSettingsClose = document.getElementById("ai-settings-close");
  if (aiSettingsClose) {
    aiSettingsClose.addEventListener("click", closeAISettingsModal);
  }

  const aiSettingsModal = document.getElementById("ai-settings-modal");
  if (aiSettingsModal) {
    aiSettingsModal.addEventListener("click", (event) => {
      if (event.target.id === "ai-settings-modal") {
        closeAISettingsModal();
      }
    });
  }

  const saveApiKeyBtn = document.getElementById("save-api-key-button");
  if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener("click", handleSaveApiKey);
  }

  const clearApiKeyBtn = document.getElementById("clear-api-key-button");
  if (clearApiKeyBtn) {
    clearApiKeyBtn.addEventListener("click", handleClearApiKey);
  }

  const clearHistoryBtn = document.getElementById("clear-chat-history-button");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", handleClearChatHistory);
  }

  document.getElementById("gacha-modal-close")?.addEventListener("click", closeGachaModal);
  document.getElementById("gacha-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "gacha-modal") {
      closeGachaModal();
    }
  });
  document.getElementById("gacha-draw-one")?.addEventListener("click", () => drawGacha(1));
  document.getElementById("gacha-draw-ten")?.addEventListener("click", () => drawGacha(10));
  document.getElementById("gacha-clear")?.addEventListener("click", clearGachaCollection);

  document.getElementById("settings-modal-close")?.addEventListener("click", closeSettingsModal);
  document.getElementById("settings-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "settings-modal") {
      closeSettingsModal();
    }
  });
  document.getElementById("settings-apply-button")?.addEventListener("click", applySettingsFromControls);
  document.getElementById("settings-reset-button")?.addEventListener("click", resetUISettings);
}

/* ───────────────────────────────────────────────────────────
   模块: 动效绑定 + 开场动画 | 行号: ~6757-6800
   函数: bindMotionEffects() — 绑定界面动效事件
         scheduleOpeningCompletion() — 计划开场动画完成后隐藏
   ⚠️ 开场动画超时: 3900ms (animationend 事件备选)
   ─────────────────────────────────────────────────────────── */
function bindMotionEffects() {
  const sceneArea = document.getElementById("scene-area");
  if (!sceneArea) {
    return;
  }

  sceneArea.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 899px), (prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = sceneArea.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
    sceneArea.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
    sceneArea.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
  });

  sceneArea.addEventListener("pointerleave", () => {
    sceneArea.style.setProperty("--parallax-x", "0px");
    sceneArea.style.setProperty("--parallax-y", "0px");
  });
}

function scheduleOpeningCompletion() {
  const opening = document.getElementById("opening-animation");
  if (!opening) {
    return;
  }

  const finishOpening = () => {
    opening.classList.add("is-finished");
    opening.hidden = true;
  };

  opening.addEventListener("animationend", finishOpening, { once: true });
  window.setTimeout(finishOpening, 3900);
}


/* ═══ Audio Hooks ═══ */
document.addEventListener('click', (e) => {
    if(!window.AudioManager) return;
    const t = e.target;
    if(t.tagName === 'BUTTON' || t.closest('button') || t.classList.contains('choice-button') || t.classList.contains('quick-action-button') || t.classList.contains('menu-button')) {
        window.AudioManager.playSFX('click');
    }
});
document.addEventListener('mouseover', (e) => {
    if(!window.AudioManager) return;
    const t = e.target;
    if(t.tagName === 'BUTTON' || t.closest('button') || t.classList.contains('choice-button')) {
        // window.AudioManager.playSFX('hover'); // Hover can be too noisy sometimes, but adding it just in case
    }
});

// Hook into dysregulation by observing the console or looking for specific strings
// A cleaner way is to wrap console.log to detect when the game logs "触发失调"
const originalLog = console.log;
console.log = function(...args) {
    originalLog.apply(console, args);
    const msg = args.join(' ');
    if (msg.includes('失调') && msg.includes('触发') || msg.includes('失调预警')) {
        if(window.AudioManager) window.AudioManager.triggerDysregulation('high');
    }
};
