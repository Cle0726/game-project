/* ───────────────────────────────────────────────────────────
   文件: runtime_config_data.js
   功能: 旧版游戏入口使用的运行时配置、AI枚举、React战斗桥接映射与临时事件标记。
   说明: 必须在 game.js 之前加载，向 window 暴露对应 legacy globals。
   ⚠️ 只放静态配置；不要在这里添加运行时逻辑或 API 密钥。
   ─────────────────────────────────────────────────────────── */

var AI_ALLOWED_MOODS = ["neutral", "warm", "tense", "withdrawn", "playful", "sad", "alert", "thoughtful"];

var AI_RELATION_STATS = new Set([
  "槐序信任", "槐序共鸣", "槐序压力",
  "洛温信任", "洛温共鸣", "洛温压力",
  "阿缇娅信任", "阿缇娅共鸣", "阿缇娅压力",
  "弥洛信任", "弥洛共鸣", "弥洛压力",
  "零四信任", "零四共鸣", "零四压力",
  "伊芙白信任", "伊芙白共鸣", "伊芙白压力",
  "明弦信任", "明弦共鸣", "明弦压力"
]);

var REACT_BATTLE_ACTION_ORDER = [
  { key: "旋律", iconLabel: "旋", fallbackLabel: "槐序标记" },
  { key: "和声", iconLabel: "和", fallbackLabel: "洛温护送" },
  { key: "节奏", iconLabel: "节", fallbackLabel: "延后节点" },
  { key: "音色", iconLabel: "色", fallbackLabel: "伊芙白改色" },
  { key: "指挥", iconLabel: "令", fallbackLabel: "奏者能力" },
  { key: "静默", iconLabel: "默", fallbackLabel: "强制封印" }
];

var REACT_BATTLE_CHARACTER_IDS = {
  槐序: "huaixu",
  洛温: "luowen",
  阿缇娅: "atya",
  弥洛: "milo",
  零四: "sequence04",
  伊芙白: "yifubai",
  明弦: "mingxian"
};

var DEEPSEEK_CONFIG = {
  apiEndpoint: "https://api.deepseek.com/chat/completions",
  model: "deepseek-chat",
  maxTokens: 500,
  storageKey: "deepseek_api_key_residual_path",
  enabledKey: "deepseek_tea_enabled"
};

var RUNTIME_EVENT_FLAGS = ["__dissonance_risk_luowen__", "__dissonance_risk_active__"];
