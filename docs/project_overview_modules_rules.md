# 《宿命回响：残响之途》项目概览、主要模块与开发规则

> 本文是项目维护入口文档。新开发、重构、AI Agent 接手任务前，先读本文件，再读 `AGENTS.md`、`docs/PROJECT_STRUCTURE.md`、`docs/refactor_roadmap.md`。

## 1. 项目概览

《宿命回响：残响之途》是一个网页端视觉小说 / 剧情 RPG 项目。

当前形态是“旧版静态游戏壳 + 新版 Vite/React 模块”并存：

- 旧版主入口：`index.html`
- 旧版核心逻辑：`game.js`
- 旧版资源表：`assets_data.js`
- 旧版主样式：`style.css`、`responsive-overrides.css`
- 新版模块：`src/worldmap/`、`src/battle/`、`src/character-render/`、`src/audio/`
- Python 后端：`server/`

项目目标不是普通网页 Demo，而是一个可长期扩展的剧情游戏工程。它包含章节剧情、角色关系、战斗、世界地图、AI 茶歇、抽卡档案、资源生成与视频资产流程。

## 2. 当前基线

当前分支：`refactor/assets-data`

当前已建立 Git 基线：

```bash
git log --oneline -2
```

代表性提交：

```text
2ebd142 refactor: externalize legacy asset table
eeace95 chore: establish project baseline
```

关键规模：

- `game.js`：约 12351 行，仍是最大技术债。
- `assets_data.js`：约 319 行，已从 `game.js` 抽离出来。
- `style.css`：约 5826 行。
- `responsive-overrides.css`：约 2629 行。
- `src/worldmap/worldMapData.ts`：约 1354 行。

## 3. 启动与常用命令

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

等价于：

- 打开 Vite 旧入口测试页。
- 启动 `server/` 下的 FastAPI 后端。

### 打开旧主入口

```bash
npm run index:test
```

### 打开战斗测试入口

```bash
npm run battle:test
```

### 打开世界地图测试入口

```bash
npm run worldmap:test
```

### 打开立绘测试入口

```bash
npm run portrait:test
```

### 构建验证

```bash
npm run portrait:build
```

## 4. 必跑验证命令

改动后至少按影响范围运行以下命令。

### 资源表 / ASSETS 加载相关

```bash
npm run assets:guard
```

检查：

- `assets_data.js` 是否存在。
- `game.js` 是否又重新声明了 `const ASSETS`。
- `index.html` 是否先加载 `assets_data.js` 再加载 `game.js`。

### 重要角色六状态立绘相关

```bash
npm run character:guard
```

检查：

- `assets/generated/character_states/character_state_manifest_v02.json`
- 每个重要角色是否有六状态：`default`、`smile`、`worried`、`serious`、`shocked`、`special`
- 状态图片文件是否存在。
- 状态图片路径是否已接入 `game.js` 或 `assets_data.js`。

### 战斗模块边界相关

```bash
npm run battle:guard
```

检查战斗模块边界，不允许随意跨层耦合。

### 构建相关

```bash
npm run portrait:build
```

注意：当前构建会提示旧 `<script src="...">` 不能被 Vite 完整打包，这是已知旧架构警告，不等于构建失败。只有 exit code 非 0 才算失败。

## 5. 主要模块

### 5.1 旧主入口：`index.html`

职责：

- 定义主菜单、章节入口、队伍选择、状态栏、对话区域、世界地图挂载点、抽卡区域等 DOM。
- 加载旧版 CSS、VFX、音频、主游戏脚本。
- 挂载 React 战斗 / 世界地图桥接入口。

必须保留的关键节点：

- `#game-container`
- `#main-menu`
- `#world-map-area`
- `#react-worldmap-root`
- `#entry-worldmap-button`
- `#entry-worldmap-top-button`
- `#quick-worldmap-button`

脚本加载规则：

```html
<script src="assets_data.js"></script>
<script src="game.js"></script>
<script type="module" src="/src/battle-legacy-main.tsx"></script>
<script type="module" src="/src/worldmap-legacy-main.tsx"></script>
```

`assets_data.js` 必须在 `game.js` 之前。

### 5.2 旧核心逻辑：`game.js`

职责：

- 默认游戏状态。
- 剧情场景运行。
- 选择项与状态变化。
- 角色关系判定。
- 存档 / 读档。
- 战斗启动桥接。
- 世界地图桥接。
- AI 茶歇旧逻辑。

当前规则：

- 不再继续往 `game.js` 塞大型数据表。
- 新增纯数据优先放到独立数据文件。
- 修改函数签名前先搜索调用点。
- 只做小步、安全、可验证的拆分。

### 5.3 旧资源表：`assets_data.js`

职责：

- 暴露旧版全局变量 `ASSETS`。
- 保存角色、背景、敌人、特效、图标等静态资源路径。

规则：

- 只放静态资源路径。
- 不写运行时逻辑。
- 不访问 DOM。
- 不调用 `game.js` 函数。
- 必须保持 `var ASSETS = { ... }` 形式，兼容旧非 module 脚本。

### 5.4 样式系统

当前样式入口：

- `style.css`：基础旧 UI、VFX、世界地图壳、旧组件样式。
- `responsive-overrides.css`：响应式和可读性修正，加载顺序必须在 `style.css` 后。
- `gacha_overhaul.css`：抽卡界面样式。
- `vfx_styles.css`：特效样式。
- `src/**.css`：React 子模块样式。

规则：

- 不要随意改 `responsive-overrides.css` 的加载顺序。
- CSS 拆分时先移动完整块，不边移动边重写。
- UI 视觉改动必须截图验证桌面和移动端。
- 不要用全局选择器误伤旧 DOM。

### 5.5 世界地图：`src/worldmap/`

职责：

- React 世界地图实现。
- 区域 / 节点 / 解锁条件。
- 主线跳转。
- 茶歇入口。
- 真相碎片计数。

关键文件：

- `src/worldmap/worldMapData.ts`
- `src/worldmap/worldMapBridge.ts`
- `src/worldmap/components/WorldMapView.tsx`
- `src/worldmap/components/RegionMapView.tsx`
- `src/worldmap-legacy-main.tsx`

规则：

- 世界地图数据尽量保持在 `src/worldmap/` 内。
- 与旧 `game.js` 只通过桥接函数通信。
- 不要让 React 组件直接依赖旧全局状态细节。

### 5.6 战斗系统：`src/battle/`

职责：

- React 战斗界面。
- 战斗 HUD。
- 敌我显示。
- 技能按钮。
- 战斗进出场转场。
- 与旧 `game.js` 的战斗指令桥接。

关键文件：

- `src/battle/index.ts`
- `src/battle/gameBridge.ts`
- `src/battle/components/BattleScreen.tsx`
- `src/battle/components/BattleArena.tsx`
- `src/battle/battleTypes.ts`
- `scripts/assert-battle-boundaries.mjs`

规则：

- 改战斗模块后运行 `npm run battle:guard`。
- 战斗 UI 不应随意读取旧全局变量。
- 类型定义优先放入 `battleTypes.ts`。

### 5.7 角色立绘渲染：`src/character-render/`

职责：

- 动态立绘。
- 静态立绘堆栈。
- mood / 状态映射。
- portrait 动画。

关键文件：

- `DynamicPortrait.tsx`
- `StaticPortraitStack.tsx`
- `portraitRegistry.ts`
- `portraitData.ts`
- `moodConfig.ts`

规则：

- 重要角色六状态必须同步 manifest 与资源表。
- 不允许只生成图片不接入 manifest / guard。

### 5.8 音频系统：`src/audio/` 与 `audio_manager.js`

职责：

- 旧版音频管理：`audio_manager.js`
- 新版音频状态与 React hook：`src/audio/`
- BGM / SFX 注册。

规则：

- 旧页面仍依赖 `audio_manager.js`。
- 新模块优先使用 `src/audio/`。
- 不要在 UI 组件里直接硬编码大量音频路径。

### 5.9 抽卡 / 档案系统

关键文件：

- `gacha_overhaul.js`
- `gacha_overhaul.css`
- `server/routers/gacha_router.py`

职责：

- 本地抽取角色档案、场景碎片和资源标记。
- 图鉴记录。
- 抽卡 UI。

规则：

- 前端视觉改动要截图验证。
- 后端接口改动要检查 `server/schemas.py` 和对应 router。

### 5.10 Python 后端：`server/`

技术栈：FastAPI。

职责：

- 认证。
- 存档。
- 抽卡。
- AI 茶歇。
- 数据库访问。

关键文件：

- `server/main.py`
- `server/config.py`
- `server/database.py`
- `server/models.py`
- `server/schemas.py`
- `server/routers/*.py`
- `server/services/ai_service.py`

规则：

- 不提交 `server/.env`。
- `server/.env.example` 可以提交。
- 不提交 `server/*.db`。
- 不提交 `server/.venv/`。

### 5.11 Gemini Web 视频资产流程

关键文件：

- `scripts/gemini-web-video-assets.mjs`
- `docs/gemini_web_video_workflow.md`
- `prompts/video/*.json`

命令：

```bash
npm run video:gemini:login
npm run video:gemini:auto -- --manifest prompts/video/gemini-web-video-jobs.example.json
```

规则：

- 使用用户已登录的 Gemini 网页，不使用 Gemini API。
- 不索要、不保存明文密码。
- 浏览器资料目录 `.browser-profiles/` 不进 Git。

## 6. 开发规则

### 6.1 总原则

1. 先保稳定，再优化结构。
2. 先拆数据，后拆逻辑。
3. 每一步都要能验证。
4. 每个阶段都要有 Git 提交。
5. 不做一次性大重构。
6. 不为了“看起来进度快”牺牲可回滚性。

### 6.2 Git 规则

- 开始任务前检查：

```bash
git status --short
git branch --show-current
```

- 功能 / 重构使用独立分支：

```bash
git checkout -b refactor/<topic>
```

- 提交前必须确认工作区只包含本次任务文件。
- 提交信息使用简洁动词：

```text
refactor: externalize legacy asset table
chore: add project overview docs
fix: keep character guard compatible with assets data
```

### 6.3 数据拆分规则

推荐拆分顺序：

1. `ASSETS`：已拆到 `assets_data.js`。
2. `MUSICART_PROFILES` / `MUSICART_RULES`
3. `MUSICART_DETAIL_PROFILES`
4. `DEEPSEEK_CHARACTER_PROFILES` / `AI_MUSICART_RULES`
5. `BATTLES`
6. `SCENES`

规则：

- 一次只拆一类数据。
- 不同时改数据结构和运行逻辑。
- 拆完必须补 guard 或更新已有 guard。
- 拆完必须构建验证。

### 6.4 角色资源规则

重要常驻角色必须有六状态：

- `default`
- `smile`
- `worried`
- `serious`
- `shocked`
- `special`

新增 / 修改角色状态时同步：

- `assets/generated/character_states/character_state_manifest_v02.json`
- `assets_data.js` 或未来的资源数据模块
- `scripts/assert-character-state-sprites.mjs`

验证：

```bash
npm run character:guard
```

### 6.5 UI / 视觉规则

- 改 UI 前先确认影响范围。
- 创意视觉改动不要只靠 build，通过浏览器截图看实际效果。
- 不要把响应式修复散落到多个地方。
- 移动端可读性优先于炫技动画。
- 不要让 VFX 遮挡主交互。

### 6.6 旧脚本加载规则

当前旧入口还使用普通脚本：

```html
<script src="..."></script>
```

因此：

- 普通脚本依赖全局变量。
- 顺序很重要。
- 不能随意改成 `type="module"`，除非同步处理全局作用域变化。
- Vite build 对这些脚本的警告是已知状态，不代表失败。

### 6.7 后端与密钥规则

禁止提交：

- `.env`
- `server/.env`
- 数据库文件
- 浏览器登录态
- API key
- 密码

允许提交：

- `.env.example`
- `server/.env.example`
- 无密钥的配置模板

### 6.8 Agent 开发规则

AI Agent 接手任务时：

1. 先读 `AGENTS.md`。
2. 再读本文。
3. 再读相关模块文档。
4. 先查 Git 状态。
5. 小步修改。
6. 修改后运行对应 guard。
7. 提交前清理临时文件。
8. 不把本地缓存、构建产物、浏览器资料加入 Git。

## 7. 新任务建议流程

### 普通代码改动

```bash
git status --short
# 修改文件
npm run assets:guard      # 如果涉及资源表
npm run character:guard   # 如果涉及角色状态
npm run battle:guard      # 如果涉及战斗
npm run portrait:build    # 构建验证
git status --short
git add <files>
git commit -m "type: concise message"
```

### UI 改动

1. 修改样式 / 组件。
2. 启动对应测试入口。
3. 截图桌面端。
4. 截图移动端或窄屏。
5. 再跑构建。
6. 提交。

### 数据拆分

1. 新建数据文件。
2. 保持旧入口兼容。
3. 更新加载顺序或桥接。
4. 添加 / 更新 guard。
5. 跑 guard。
6. 跑 build。
7. 提交。

## 8. 当前优先级

高优先级：

1. 继续减少 `game.js` 数据负担。
2. 拆 `MUSICART_PROFILES` / `MUSICART_RULES`。
3. 建立更多数据结构 guard。
4. 避免继续扩大 `style.css`。

暂缓：

- 一次性迁移全部 `SCENES`。
- 一次性把旧脚本全部改成 module。
- 大规模 CSS 重写。
- 未验证的大图压缩覆盖。

## 9. 维护底线

这个项目已经不是一次性 Demo。任何改动都必须满足：

- 可回滚。
- 可验证。
- 可解释。
- 不扩大核心技术债。
- 不破坏旧入口。

如果一个改动无法满足这些条件，先拆小，不要硬做。
