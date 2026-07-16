# 角色状态立绘重生成审计（2026-07-10）

## 当前结论

本轮换图以 `assets/generated/character_states/character_state_manifest_v02.json` 和 `npm run character:guard` 为准，只处理正式长期复用角色，不再机械扩展所有剧情出场人物。

正式六态角色当前状态：

| 角色 ID | 角色 | 当前接入版本 | 处理结论 |
| --- | --- | --- | --- |
| `atya` | 阿缇娅 | `v04` | 已从母图/剧情锚点重做并接入 |
| `milo` | 弥洛 | `v04` | 已从母图/剧情锚点重做并接入 |
| `anning` | 安柠 | `v04` | 已从母图/剧情锚点重做并接入 |
| `tiya` | 缇雅 | `v04` | 已从母图/剧情锚点重做并接入 |
| `ningsu` | 宁溯 | `v04` | 已从章节二母图/剧情锚点重做并接入 |
| `shen_zhiwei` | 沈知微 | `v04` | 已从章节三母图/剧情锚点重做并接入 |
| `juheng` | 珏衡 | `v04` | 已从章节三母图/剧情锚点重做并接入 |
| `sequence04` | 零四 | `chapter4 v01` | 视觉复查通过，暂不重生 |

## 不继续扩图的原则

- 不把所有 NPC、章节一次性角色、场景专用角色都扩成六态。
- 只有满足以下条件之一时才进入六态重生成流程：
  - 已列入 `character_state_manifest_v02.json`。
  - `scripts/assert-character-state-sprites.mjs` 的 guard 要求。
  - 剧情文件明确说明该角色是长期主线复用、可加入队伍、远程支援、后续弧光回归角色。
- 对单章场景角色、环境 NPC、短线支线人物，优先沿用章节专用立绘或按剧情需要单张生成。

## 旧图引用审计

正式状态 manifest 中，除零四仍使用章节四 `v01` 状态图外，其他重要角色均已切到 `character_states/sprites/*_v04.png`。

`assets_data.js` 中仍保留的 `v01/v02/v03` 引用主要属于：

- `legacyDefault` / `legacyBattle`：用于保留章节原始母图或旧章节立绘参考。
- 章节专用角色：如温别克、柏舟、诺伊、卡戎、瑟萝弥、乌鸦先生等。
- 主角章节状态：如第零章契约前主角立绘。
- 零四章节四状态图：当前复查无绿边/紫边，暂不重生。

这些不属于“旧绿边状态图继续接入”的问题，后续不要仅因为版本号低就批量替换。

## 本轮验收命令

```bash
node --check game.js
node --check assets_data.js
npm run character:guard
```

当前结果：通过，`Character sprite guard passed for 8 characters / 48 states.`

## 视觉复查图

已生成的接触表位于：

- `tmp/character_review/tiya_states_v04_contact_sheet.png`
- `tmp/character_review/ningsu_states_v04_contact_sheet.png`
- `tmp/character_review/shen_zhiwei_states_v04_contact_sheet.png`
- `tmp/character_review/juheng_states_v04_contact_sheet.png`
- `tmp/character_review/sequence04_states_v01_contact_sheet.png`

