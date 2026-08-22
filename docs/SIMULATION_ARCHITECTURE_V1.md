# 《宿命回响：残响之途》Simulation Architecture v1

> 状态：设计冻结候选（2026-08-22）
>
> 目标：在不推倒现有 `game.js / SCENES / BATTLES / TeaBreak / WorldMap` 的前提下，把自由探索升级为可支撑第 0～11 章、NPC 日程、关系、记忆、信息传播和后续 LLM Agent 的正式 Simulation Runtime。

## 核心原则

1. AI 不拥有世界真相。
2. AI 不直接执行动作。
3. AI 不直接修改剧情 Flag、关系数值、奖励、战斗结果或坐标。
4. AI 只提出结构化 Interpretation / Intent，游戏规则负责验证与执行。

```text
Player / Story / Agent Intent
          ↓
      GameCommand
          ↓
    CommandValidator
          ↓
        Reducer
          ↓
   Canonical Game State
          ↓
      WorldEvent
          ↓
Quest / Story / Witness / Memory / Relationship / Agent
```

## Canonical Runtime

`game.js` 继续承担 `GameState / SCENES / choices / BATTLES / TeaBreak / save / showScene / goToScene`。Phase A 不做全量 TypeScript 重写。

`src/exploration-legacy-main.ts` 只作为旧剧情入口与新 `ExplorationRuntime` 之间的迁移桥。

## SimulationStateV1

唯一新状态容器：`window.GameState.simulationV1`。

保存 `clock / currentRegionId / returnPoint / regions / quests / agents / eventCursor / eventLedger`。

旧 `cle.exploration.verticalSlice.v1` 只保留一次迁移兼容；正式探索数据进入主存档。

## Command / Event

```text
GameCommand → CommandValidator → Handler → SimulationStateV1 → WorldEvent
```

当前核心命令：`region.enter / exploration.return_point.set / quest.complete`。

当前事件：`region.entered / exploration.return_point_set / quest.completed`。

`source: agent` 被代码规则禁止直接完成 Quest。

## ExplorationRuntime

章节/WorldMap 入口只依赖 `src/simulation/exploration/ExplorationRuntime.ts`。

```text
legacy scene entry
      ↓
ExplorationRuntime
      ↓
FreeRoamPrototype compatibility shell
      ↓
formal Simulation / Presentation modules
```

`FreeRoamPrototype` 是待删除兼容壳，不作为未来章节开发 API。

### 已接入 live runtime 的确定性系统

`NavigationSystem / QuestSystem / SimulationClock / ScheduleSystem / RegionSystem / ActorMotionSystem / CollisionSystem / MovementSystem / InteractionSystem`

### 已接入 live runtime 的 Renderer / Presentation

`ExplorationRenderer / ExplorationWorldPresentation / ExplorationActorViewFactory / ExplorationHudPresentation / ExplorationDialoguePresentation / ExplorationObjectivePresentation`

负责 Camera/HUD layout、地图背景/fallback/debug overlay、玩家/NPC Sprite、HUD、地图内对话、Quest marker/highlight。

这些模块都已通过 `ExplorationRuntime` 接管当前第三章切片。

## Phase A Migration Adapters

`LegacyFreeRoamActorViewAdapter / LegacyFreeRoamWorldViewAdapter / LegacyFreeRoamMovementAdapter / LegacyFreeRoamInteractionAdapter / LegacyFreeRoamPresentationAdapter / LegacyFreeRoamRendererAdapter`

只用于迁移期。正式 Loop/Renderer 完成后整体删除。

## Compatibility shell 剩余职责

```text
Keyboard input lifecycle
frame update orchestration
NPC schedule/move orchestration
interaction dispatch orchestration
story open / exit lifecycle
periodic persistence trigger
Pixi Application lifecycle
```

下一阶段建立 `InputController + ExplorationLoop`，然后移除 `FreeRoamPrototype`。

## Story / AI 边界

剧情分 `Canonical Beat / Authored Dynamic Beat / Emergent Beat`。

Fast Loop 永不调用 LLM；Simulation Loop 主要使用 TypeScript 规则；Cognitive Loop 只在重要事件异步调用模型。

模型允许输出 `dialogue / interpretation / intent / mood`，不得输出 `relationship delta / canonical flag / quest completion / reward / battle result / coordinates`。

Relationship / Emotion / Knowledge / Memory 保持分离；Memory append-only。

## NPC LOD

```text
L0 玩家附近：完整模拟
L1 同区域离镜：简化模拟
L2 其他区域：离屏时间片 / TravelState
L3 Dormant：只结算必要日程
```

## Phase A checkpoint

已完成并接入 live runtime：状态、存档、Command/Event、导航、Quest、时钟、日程、Region、运动、碰撞、Interaction、World/Actor/HUD/Dialogue/Objective Presentation、稳定 `ExplorationRuntime` 边界与 architecture guard。

下一步：`InputController → ExplorationLoop/NPC orchestration → Story/Exit lifecycle cleanup → remove FreeRoamPrototype`。

之后正式从 `chapter0_start` 开始第0章自由移动改造。第0章第一阶段保持 **LLM OFF**。
