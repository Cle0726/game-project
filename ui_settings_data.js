/* ───────────────────────────────────────────────────────────
   文件: ui_settings_data.js
   功能: 旧版游戏入口使用的 UI 设置默认值。
   说明: 必须在 game.js 之前加载，向 window 暴露 DEFAULT_UI_SETTINGS。
   ⚠️ 只放 UI 默认配置；不要在这里添加运行时逻辑。
   ─────────────────────────────────────────────────────────── */

var DEFAULT_UI_SETTINGS = {
  uiScale: "normal",
  motion: "full",
  typewriter: "normal",
  hudDensity: "normal"
};
