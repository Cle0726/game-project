# 全章战斗系统接入记录（2026-07-10）

## 接入范围

- 打开 legacy `game.js` 到 React 战斗屏的桥接开关。
- 修复 React 战斗桥接对敌方图片对象、单律者出战的映射问题。
- 第零章到第三章原有 `startBattle()` / `showTeamSelect()` 战斗均会进入同一套 React 战斗 HUD。
- 第四章补入三场正式战斗：
  - `ch4_qilan_duo`：岐岚组合战，小战斗 / 拦截战。
  - `ch4_seluomi_final`：瑟萝弥最终战。
  - `ch4_charon_final`：卡戎管风琴终战。

## 第四章新素材

- `assets/generated/chapter4/sprites/enemies/enemy_ch4_qilan_duo_sprite_default_v01.png`
- `assets/generated/chapter4/sprites/enemies/boss_ch4_seluomi_final_sprite_default_v01.png`
- `assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_sprite_default_v01.png`

三张透明 PNG 均已检查：残留绿色像素计数为 0。

复查图：

- `tmp/character_review/ch4_battle_enemy_assets_contact_20260710_v02.png`

## 战斗 UI 规格

React 战斗屏现在支持三类视觉规格：

- `skirmish`：小战斗，面板更轻，敌方尺寸略收。
- `boss`：Boss 战，强化金红边框和压迫层。
- `finale`：终战，红黑管风琴式场域，终战技能卡强调危险度。

规格优先读取 `game.js` 的 `battleVariant` 显式配置；缺省时才按战斗 id / name 自动推导，避免后续章节误判小战斗与 Boss 战。

## 已验证截图

- 终战桥接：`tmp/character_review/ch4_charon_final_react_battle_smoke_20260710_v05.png`
- 单律者小战：`tmp/character_review/ch0_single_musicart_skirmish_smoke_20260710.png`

## 2026-07-10 续同步

- 16 场 `BATTLES` 配置已全部补齐 `battleVariant`：小战斗统一走 `skirmish`，章节 Boss 走 `boss`，卡戎终战走 `finale`。
- 第一场阿缇娅单人教学战增加 `minMusicarts: 1` / `maxMusicarts: 1`，不再被通用编队逻辑强行补成双人。
- 编队界面、确认按钮、战斗归一化现在读取每场战斗的 `minMusicarts` / `maxMusicarts` / `teamSize`，保留当前双人主规则，同时支持单人教学战和后续特殊战。
- 全量审计确认 `startBattle()` / `showTeamSelect()` 引用的战斗 id 均存在，且敌我图片引用均非空。

## 2026-07-10 素材补充

- 补齐 `ch1EchoPatrol` / `ch1FogHowler`，替换原本复用第零章敌人的临时引用。
- 重做 `ch2FrozenResidual` / `ch2ScoreheartGuardian` / `ch3HallGuard`，去除白底或整张背景框，统一为透明 PNG。
- 本批提示词归档在 `prompts/battle_assets/ch1_ch3_battle_enemy_supplement_prompts_v01.md`。
- 复查图：`tmp/character_review/battle_enemy_new_assets_contact_20260710.png`。

## 验收命令

```bash
node --check game.js
node --check assets_data.js
npm run battle:guard
npm run character:guard
npm run portrait:build
```

## 注意事项

- React 战斗挂载前会把 `#battle-area` 提升到 `document.body` 下，避免旧 `#game-container` flex/grid 布局导致战斗层无法真正全屏。
- 战斗舞台背景已从 Pixi Graphics 改为原生 Canvas，避免 Pixi 内部 `Graphics.clear()` 空引用导致冒烟测试报错。
- 第四章新增素材提示词记录在 `prompts/battle_assets/ch4_battle_enemy_prompts_v01.md`。
