# 第零章全面检查报告 2026-07-05

## 已检查范围

```text
game.js 第零章主线场景：22 个
CHAPTER0_EVENT_POOL 支线/地图事件：14 个
BATTLES 第零章战斗：4 个
ASSETS 第零章相关资源引用：107 条
活跃第零章图片素材：35 张
活跃第零章人物立绘：18 张
```

## 已修复问题

```text
1. 地图事件包装器会给所有选项强制追加 nextScene。
   影响：带 effect() 的支线战斗可能刚 startBattle 又被跳回地图。
   修复：createMapEventScene() 现在只给没有 effect 的选择自动追加 returnScene。

2. 第零章支线 NPC 缺少游戏显示立绘。
   补齐：奥托、霍尔特、伊莱娜、琳、铃。
   新文件位于 assets/generated/chapter0/sprites/characters/。

3. index.html 存在多处乱码破坏的 HTML 闭合标签和 data-gender 属性。
   影响：Vite build 失败，奏者选择属性也可能失效。
   修复：恢复 title、p、h2、h3、option、span 等闭合标签与关键中文文案。
```

## 新增素材

```text
char_ch0_otto_sprite_default_v01.png
char_ch0_holt_sprite_default_v01.png
char_ch0_elena_sprite_default_v01.png
char_ch0_lin_sprite_default_v01.png
char_ch0_ling_sprite_default_v01.png
```

检查表：

```text
tmp/chapter0_new_npc_sprites_contact_sheet.png
tmp/chapter0_all_active_assets_contact_sheet_after_npc.png
```

## 验证结果

```text
node --check game.js: passed
npm run battle:guard: passed
npm run portrait:build: passed

资源缺失：0
无效场景跳转：0
第零章战斗未接入：0
第零章可见发言 NPC 缺立绘：0
新增 NPC 透明边缘风险：0
```

## 保留事项

```text
Vite build 仍提示旧式非 module 脚本无法被打包，这是当前项目脚本结构的既有警告，不阻塞构建。
Vite build 仍提示部分 chunk 超过 500 kB，这是资源体量警告，不是第零章逻辑错误。
```
