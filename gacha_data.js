/* ───────────────────────────────────────────────────────────
   文件: gacha_data.js
   功能: 旧版游戏入口使用的抽卡池数据。
   说明: 必须在 game.js 之前加载，向 window 暴露 GACHA_POOL。
   ⚠️ 只放抽卡池静态数据；不要在这里添加抽卡逻辑。
   ─────────────────────────────────────────────────────────── */

var GACHA_POOL = [
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
