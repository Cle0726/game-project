# 《宿命回响：残响之途》工程化与重构路线图

> 目标：在不破坏当前可运行版本的前提下，把项目从“静态原型 + 大型单文件”逐步整理成可长期迭代的游戏前端工程。

## 当前基线

- 主入口：`index.html`
- 旧主逻辑：`game.js`，约 12658 行
- 主样式：`style.css` + `responsive-overrides.css`
- 新模块：`src/worldmap/`、`src/battle/`、`src/character-render/`、`src/audio/`
- 当前有效检查：
  - `npm run character:guard`
  - `npm run battle:guard`
  - `npm run portrait:build`

## 原则

1. **先保稳定，再拆结构。** 不做一次性大重构。
2. **先拆数据，后拆逻辑。** 剧情、资源、角色档案先独立；运行时函数最后动。
3. **每一步都可验证。** 每次改动后至少跑 guard/build。
4. **旧入口继续可运行。** `index.html` 在迁移完成前仍是主入口。
5. **禁止继续无限扩大 `game.js`。** 新系统优先放到 `src/` 或独立数据文件中。

## 阶段 0：版本管理与安全基线

- [x] 初始化 Git 仓库。
- [x] 添加 `.gitignore`，排除依赖、构建产物、本地浏览器资料、缓存、备份、环境密钥。
- [ ] 首次提交后，保持每个阶段至少一个可回滚提交。

验证：

```bash
git status --short
npm run character:guard
npm run battle:guard
npm run portrait:build
```

## 阶段 1：冻结 `game.js` 增长

目标：不再把新系统直接塞进 `game.js`。

动作：

- 新增剧情数据时，优先放入 `src/data/scenes/` 或独立 JSON/TS 文件。
- 新增角色档案时，优先放入 `src/data/characters/`。
- 新增资源表时，优先放入 `src/data/assets/`。
- `game.js` 只保留桥接和旧运行逻辑。

验收：

- `game.js` 行数不再因为新增内容大幅增长。
- 新数据有明确目录归属。

## 阶段 2：拆分纯数据

按风险从低到高拆分：

1. `ASSETS` → `src/data/assets.ts`
2. `MUSICART_PROFILES` / `MUSICART_RULES` → `src/data/musicarts.ts`
3. `MUSICART_DETAIL_PROFILES` → `src/data/musicartDetails.ts`
4. `DEEPSEEK_CHARACTER_PROFILES` / `AI_MUSICART_RULES` → `src/data/aiProfiles.ts`
5. `BATTLES` → `src/data/battles.ts`
6. `SCENES` → `src/data/scenes/`

注意：

- 每拆一块，先导出数据，再在 `game.js` 中通过兼容桥读取。
- 不要同时改数据结构和游戏逻辑。
- 每拆一块都单独提交。

验收：

```bash
npm run character:guard
npm run battle:guard
npm run portrait:build
```

## 阶段 3：拆分存档与状态管理

目标：把存档、迁移、默认状态从 UI 渲染中分离。

建议目录：

```text
src/state/defaultGameState.ts
src/state/normalizeSavePayload.ts
src/state/migrateLegacyState.ts
src/save/localSaveStore.ts
```

验收：

- 旧存档能读。
- 新存档能写。
- 自动存档不丢字段。
- `DEFAULT_GAME_STATE` 新增字段时有固定迁移位置。

## 阶段 4：UI 与 CSS 分层

目标：降低 `style.css` 和 `responsive-overrides.css` 的补丁压力。

建议拆分：

```text
src/styles/base.css
src/styles/menu.css
src/styles/dialogue.css
src/styles/team.css
src/styles/worldmap.css
src/styles/battle.css
src/styles/settings.css
src/styles/responsive.css
```

规则：

- 先移动完整块，不边移动边重写。
- 移动后截图对比桌面和移动端。
- 保留 `responsive-overrides.css` 作为最后覆盖层，直到模块样式稳定。

## 阶段 5：资源加载优化

目标：减少首屏加载压力。

动作：

- 大 PNG 转 WebP/AVIF。
- 封面和地图拆成缩略图/大图两级。
- 章节资源按需加载。
- 世界地图和战斗资源懒加载。

验收：

- 首屏资源体积下降。
- 构建仍通过。
- 主菜单进入速度提升。

## 阶段 6：测试与自动化

目标：每次改动都能快速知道有没有破坏核心体验。

建议增加：

- 场景数据结构校验。
- 存档迁移测试。
- 关键 UI smoke test。
- 战斗入口 smoke test。
- 世界地图解锁条件测试。

最低本地检查命令：

```bash
npm run character:guard
npm run battle:guard
npm run portrait:build
```

## 风险

- 一次性拆 `SCENES` 风险最高，必须最后做。
- 旧 `<script>` 与 Vite module 并存期间，不能随意改加载顺序。
- AI 茶歇 prompt 与角色关系强绑定，拆分时要保留字段名兼容。
- 大图资源如果直接压缩覆盖，需要先确认视觉质量。

## 下一步建议

1. 保持当前首次 Git 基线。
2. 新开分支 `refactor/data-assets`。
3. 先拆 `ASSETS`，这是风险最低的数据拆分点。
4. 通过后再拆角色档案。
