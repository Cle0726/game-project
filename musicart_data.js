/* ───────────────────────────────────────────────────────────
   文件: musicart_data.js
   功能: 旧版游戏入口使用的律者规则与基础档案。
   说明: 必须在 game.js 之前加载，向 window 暴露 MUSICART_RULES / MUSICART_PROFILES。
   ⚠️ 只放基础规则与基础档案；详细档案、AI prompt、关系判定暂留 game.js。
   ─────────────────────────────────────────────────────────── */

var MUSICART_RULES = {
  槐序: { gender: "female", trustKey: "槐序信任", resonanceKey: "槐序共鸣", pressureKey: "槐序压力" },
  洛温: { gender: "male", trustKey: "洛温信任", resonanceKey: "洛温共鸣", pressureKey: "洛温压力" },
  阿缇娅: { gender: "female", trustKey: "阿缇娅信任", resonanceKey: "阿缇娅共鸣", pressureKey: "阿缇娅压力" },
  弥洛: { gender: "male", trustKey: "弥洛信任", resonanceKey: "弥洛共鸣", pressureKey: "弥洛压力" },
  伊芙白: { gender: "female", trustKey: "伊芙白信任", resonanceKey: "伊芙白共鸣", pressureKey: "伊芙白压力" },
  明弦: { gender: "female", trustKey: "明弦信任", resonanceKey: "明弦共鸣", pressureKey: "明弦压力" }
};

var MUSICART_PROFILES = {
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
