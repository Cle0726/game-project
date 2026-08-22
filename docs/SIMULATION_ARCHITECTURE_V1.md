# 《宿命回响：残响之途》Simulation Architecture v1

> 状态：设计冻结候选（2026-08-22）
>
> 目标：保留现有 `game.js / SCENES / BATTLES / TeaBreak / WorldMap` Canonical Runtime，在外层建立可支撑第 0～11 章自由探索、NPC 模拟与后续 Agent 的 Simulation Runtime。

## 四条硬规则

1. AI 不拥有世界真相。
2. AI 不直接执行动作。
3. AI 不直接修改剧情 Flag、关系数值、奖励、战斗结果或坐标。
4. AI 只提出结构化 Interpretation / Intent，规则系统负责验证与执行。

```text
Player / Story / Agent Intent
→ GameCommand
→ CommandValidator
→ State mutation
→ WorldEvent
→ Quest / Story / Witness / Memory / Relationship / Agent
```

## Canonical 与 Simulation

`game.js` 继续承担 `GameState / SCENES / choices / BATTLES / TeaBreak / save / showScene / goToScene`。Phase A 不进行全量 TypeScript 重写。

新状态唯一挂载在 `window.GameState.simulationV1`，保存 `clock / currentRegionId / returnPoint / regions / quests / agents / eventCursor / eventLedger`。

旧 `cle.exploration.verticalSlice.v1` 只做一次迁移，之后探索数据进入现有主存档体系。

## Command / Event

当前命令：`region.enter / exploration.return_point.set / quest.complete`。

当前事件：`region.entered / exploration.return_point_set / quest.completed`。

`source: agent` 被 Validator 明确禁止直接完成 Quest。

## Stable ExplorationRuntime

章节和 WorldMap 入口只依赖：

```text
src/simulation/exploration/ExplorationRuntime.ts
```

当前迁移链：

```text
legacy scene entry
→ ExplorationRuntime
→ FreeRoamPrototype compatibility shell
→ formal Simulation / Presentation modules
```

`FreeRoamPrototype` 仅是 Phase A 待删除兼容壳，不再是未来章节开发 API。

## 已接入实际玩法的确定性系统

`NavigationSystem / QuestSystem / SimulationClock / ScheduleSystem / RegionSystem / ActorMotionSystem / CollisionSystem / MovementSystem / InteractionSystem`

## 已接入实际玩法的 Presentation

`ExplorationRenderer / ExplorationWorldPresentation / ExplorationActorViewFactory / ExplorationHudPresentation / ExplorationDialoguePresentation / ExplorationObjectivePresentation`

已经接管 Camera/HUD layout、地图背景与 debug overlay、玩家/NPC Sprite、HUD、地图对话、Quest marker/highlight。

## 迁移 Adapter

`LegacyFreeRoamActorViewAdapter / LegacyFreeRoamWorldViewAdapter / LegacyFreeRoamMovementAdapter / LegacyFreeRoamInteractionAdapter / LegacyFreeRoamPresentationAdapter / LegacyFreeRoamRendererAdapter`

这些 Adapter 只用于 Phase A 保持第三章现有切片稳定；正式 Loop/Renderer 完成后全部删除。

## Compatibility shell 目前只剩

```text
Keyboard input lifecycle
frame update orchestration
NPC schedule/move orchestration
interaction dispatch orchestration
story open / exit lifecycle
periodic persistence trigger
Pixi Application lifecycle
```

下一阶段：

```text
InputController
→ ExplorationLoop / NPC orchestration
→ Story/Exit lifecycle cleanup
→ remove FreeRoamPrototype
```

之后正式从 `chapter0_start` 开始第0章自由移动改造。

## AI 后续边界

剧情保持 `Canonical Beat / Authored Dynamic Beat / Emergent Beat` 分层。Fast Loop 永不调用 LLM；Simulation Loop 主要是 TypeScript 规则；Cognitive Loop 只在重要事件异步调用模型。

模型只允许输出 `dialogue / interpretation / intent / mood`，不得输出 `relationship delta / canonical flag / quest completion / reward / battle result / coordinates`。

Relationship / Emotion / Knowledge / Memory 分离，Memory append-only。

NPC 后续使用 L0～L3 Simulation LOD；离屏 NPC 不逐帧寻路。

## Phase A checkpoint

当前已经完成并接入 live runtime：SimulationState、Persistence、Command/Event、导航、Quest、Clock、Schedule、Region、ActorMotion、Collision、Movement、Interaction、World/Actor/HUD/Dialogue/Objective Presentation、稳定 `ExplorationRuntime` 边界和 architecture guard。

第0章第一阶段保持 **LLM OFF**，先保证玩法、存档、回滚、剧情桥和战斗返回可靠。
