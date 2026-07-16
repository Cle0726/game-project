# 图片引用与坏抠图审计（2026-07-10）

## 审计范围

- `assets_data.js` 中所有图片引用。
- `assets/generated/character_states/character_state_manifest_v02.json` 中 8 名 guard 角色 / 48 个状态。
- 正式接入的角色立绘、章节角色图、cutout、战斗角色图。

## 审计结果

- 图片引用总数：224。
- 唯一图片引用：196。
- 缺失文件：0。
- guard 状态文件：8 名角色 / 48 个状态均存在。
- guard 状态均已在 `assets_data.js` 引用，并通过 `npm run character:guard`。
- 战斗边界通过 `npm run battle:guard`。
- 构建通过 `npm run portrait:build`。

## 已修复问题

### 诺伊默认立绘坏抠图

截图中第零章眄沙镇场景的小立绘来自：

- 旧图：`assets/generated/chapter0/sprites/characters/char_ch0_noi_sprite_default_v01.png`
- 新图：`assets/generated/chapter0/sprites/characters/char_ch0_noi_sprite_default_v03.png`

问题：

- 旧图低清、整体偏暗，缩放到剧情场景后像脏块。
- 边缘和透明区域观感不稳定，和高质量背景不匹配。

处理：

- 从 `assets/generated/chapter0/characters/char_ch0_noi_echo_boy_mother_v01.png` 重新单张生成默认立绘。
- 使用干净 chroma-key 背景重新抠图。
- `assets_data.js` 已改为引用 `char_ch0_noi_sprite_default_v03.png`。

复查图：

- `tmp/character_review/noi_default_v01_vs_v03_contact_sheet.png`

### 战斗 fallback 立绘绿幕未清

战斗页截图中暴露了两张 fallback 立绘仍带大面积绿色背景：

- `assets/battle/characters/huaixu_battle_fallback.png`
- `assets/battle/characters/luowen_battle_fallback.png`
- `public/assets/battle/characters/huaixu_battle_fallback.png`
- `public/assets/battle/characters/luowen_battle_fallback.png`

处理：

- 对 `assets/` 和 `public/` 两套 fallback 文件同步执行 chroma-key 去底。
- 复查结果：四张图残留绿像素计数均为 0，且保留透明 alpha。

复查图：

- `tmp/character_review/cutout_fix_review_20260710.png`
- `tmp/character_review/battle_ui_redesign_20260710_final.png`

## 当前仍需人工判断的项

- `char_juheng_sprite_special_v04.png` 半透明比例较高，但来源是白金几何光页 / 节拍环特效，不属于坏抠图。
- `sequence04` 仍使用章节四 `v01` 状态图；已视觉复查无绿边 / 紫边，暂不重生。

## 验收命令

```bash
node --check game.js
node --check assets_data.js
npm run character:guard
npm run battle:guard
npm run portrait:build
```
