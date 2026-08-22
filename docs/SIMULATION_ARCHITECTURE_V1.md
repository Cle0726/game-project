# 《宿命回响：残响之途》Simulation Architecture v1

> 状态：设计冻结候选（2026-08-22）
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

`legacy scene entry → ExplorationRuntime → FreeRoamPrototype compatibility shell → formal Simulation / Presentation modules`。

确定性系统已接入：`NavigationSystem / QuestSystem / SimulationClock / ScheduleSystem / RegionSystem / ActorMotionSystem / CollisionSystem / MovementSystem / InteractionSystem`。

Presentation 已接入：`ExplorationRenderer / ExplorationWorldPresentation / ExplorationActorViewFactory / ExplorationHudPresentation / ExplorationDialoguePresentation / ExplorationObjectivePresentation`。

Phase A Adapter：`LegacyFreeRoamActorViewAdapter / LegacyFreeRoamWorldViewAdapter / LegacyFreeRoamMovementAdapter / LegacyFreeRoamInteractionAdapter / LegacyFreeRoamPresentationAdapter / LegacyFreeRoamRendererAdapter`。

## 剩余 Phase A

`keyboard input / frame update orchestration / NPC orchestration / interaction dispatch / story-exit lifecycle / periodic persistence / Pixi Application lifecycle`。

下一阶段：`InputController → ExplorationLoop/NPC orchestration → lifecycle cleanup → remove FreeRoamPrototype → chapter0_start`。

## AI 边界

剧情保持 `Canonical Beat / Authored Dynamic Beat / Emergent Beat` 分层。Fast Loop 永不调用 LLM；Simulation Loop 主要使用 TypeScript 规则；Cognitive Loop 只在重要事件异步调用模型。

模型只允许输出 `dialogue / interpretation / intent / mood`，不得输出 `relationship delta / canonical flag / quest completion / reward / battle result / coordinates`。

Relationship / Emotion / Knowledge / Memory 分离，Memory append-only。NPC 后续使用 L0～L3 Simulation LOD，离屏 NPC 不逐帧寻路。

第0章第一阶段保持 **LLM OFF**，先保证玩法、存档、回滚、剧情桥和战斗返回可靠。
