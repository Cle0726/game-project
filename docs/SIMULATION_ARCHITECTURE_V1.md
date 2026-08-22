# 《宿命回响：残响之途》Simulation Architecture v1

> 状态：**v1 架构冻结 / Phase A 已完成（2026-08-22）**
>
> 目标：保留现有 `game.js / SCENES / BATTLES / TeaBreak / WorldMap` Canonical Runtime，在外层建立可支撑第 0～11 章自由探索、NPC 模拟与后续 Agent 的 Simulation Runtime。

## 硬规则

1. AI 不拥有世界真相。
2. AI 不直接执行动作。
3. AI 不直接修改剧情 Flag、关系数值、奖励、战斗结果或坐标。
4. AI 只提出结构化 Interpretation / Intent，规则系统负责验证与执行。

`Player / Story / Agent Intent → GameCommand → CommandValidator → State → WorldEvent → downstream systems`。

## Canonical / Simulation

`game.js` 继续承担 `GameState / SCENES / choices / BATTLES / TeaBreak / save / showScene / goToScene`。新状态挂载在 `window.GameState.simulationV1`；旧单区域探索存档只做一次迁移。

当前命令：`region.enter / exploration.return_point.set / quest.complete`。当前事件：`region.entered / exploration.return_point_set / quest.completed`。`source: agent` 不能直接完成 Quest。

## ExplorationRuntime

章节和 WorldMap 入口只依赖 `src/simulation/exploration/ExplorationRuntime.ts`。

正式运行链：

`legacy scene entry → ExplorationRuntime → ExplorationHost → deterministic systems + Pixi presentation`。

`FreeRoamPrototype` 与全部 `LegacyFreeRoam*Adapter` 已从 Phase A 分支删除；不存在第二套自由探索运行时。

确定性系统：`NavigationSystem / QuestSystem / SimulationClock / ScheduleSystem / RegionSystem / ActorMotionSystem / CollisionSystem / MovementSystem / InteractionSystem / ExplorationInputController / ExplorationLoop / ExplorationNpcController`。

Presentation：`ExplorationRenderer / ExplorationWorldPresentation / ExplorationActorViewFactory / ExplorationHudPresentation / ExplorationDialoguePresentation / ExplorationObjectivePresentation`。

`ExplorationHost` 直接组合上述系统，并拥有 Pixi `Application` 生命周期、输入绑定、每帧 Loop、NPC orchestration、交互分发、剧情出口与区域 snapshot assembly。

## Phase A 已完成

- `GameState.simulationV1` canonical simulation state
- 多区域探索存档纳入主游戏存档
- 旧单区域 localStorage 一次性迁移
- validated `GameCommand / CommandBus / CommandValidator`
- append-only `WorldEvent / EventLedger / WorldEventBus`
- 玩家/NPC 移动、碰撞、Waypoint 导航与日程
- NPC 靠近玩家/对话暂停与每帧行动规划
- Keyboard 输入语义与按键状态
- deterministic frame ordering 与 autosave timing
- nearby NPC / interaction zone / Quest gate
- Camera / HUD layout
- 地图背景、fallback grid、debug overlay
- Actor Sprite、名字、活动文字
- HUD、地图对话、Quest marker/highlight
- direct Pixi `ExplorationHost`
- 删除 `FreeRoamPrototype` compatibility shell
- 删除全部 `LegacyFreeRoam*Adapter`

下一阶段从 `chapter0_start` 开始，按章节顺序重构内容；第 0 章第一阶段保持 **LLM OFF**。

## 质量门槛

- `npm run simulation:guard`：架构依赖边界。
- `npm run simulation:typecheck`：TypeScript 5.8.3 strict/noUnused，范围为 Simulation + Exploration。
- `npm run simulation:build`：Vite production build。
- `.github/workflows/simulation-runtime.yml`：在 PR / 分支 push 上执行以上三项检查。

Phase A 最终 Host 切换、旧壳删除后，GitHub Actions 已通过：

`Architecture Guard ✓ / Strict Typecheck ✓ / Production Build ✓`。

## AI 边界

剧情保持 `Canonical Beat / Authored Dynamic Beat / Emergent Beat` 分层。Fast Loop 永不调用 LLM；Simulation Loop 主要使用 TypeScript 规则；Cognitive Loop 只在重要事件异步调用模型。

模型只允许输出 `dialogue / interpretation / intent / mood`，不得输出 `relationship delta / canonical flag / quest completion / reward / battle result / coordinates`。

Relationship / Emotion / Knowledge / Memory 分离，Memory append-only。NPC 后续使用 L0～L3 Simulation LOD，离屏 NPC 不逐帧寻路。

第 0 章第一阶段保持 **LLM OFF**，先保证玩法、存档、回滚、剧情桥和战斗返回可靠。
