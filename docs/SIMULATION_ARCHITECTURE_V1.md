# 《宿命回响：残响之途》Simulation Architecture v1

> 状态：设计冻结候选（2026-08-22）
>
> 目标：在不推倒现有 `game.js / SCENES / BATTLES / TeaBreak / WorldMap` 的前提下，把自由探索升级为可支撑第 0～11 章、NPC 日程、关系、记忆、信息传播和后续 LLM Agent 的正式 Simulation Runtime。

## 核心原则

1. **AI 不拥有世界真相。**
2. **AI 不直接执行动作。**
3. **AI 不直接修改剧情 Flag、关系数值、奖励、战斗结果或坐标。**
4. **AI 只提出结构化 Interpretation / Intent，游戏规则负责验证与执行。**

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

## Canonical Runtime 保留策略

`game.js` 继续承担 `GameState / SCENES / choices / BATTLES / TeaBreak / save / showScene / goToScene`。Phase A 不做全量 TypeScript 重写。

`src/exploration-legacy-main.ts` 只作为旧剧情入口与新 `ExplorationRuntime` 之间的迁移桥，外层入口不得知道具体 Migration Adapter。

## SimulationStateV1

唯一新状态容器是 `window.GameState.simulationV1`，保存 `clock / currentRegionId / returnPoint / regions / quests / agents / eventCursor / eventLedger`。

`LegacyGameStateAdapter` 每次从当前 `window.GameState` 读取，避免 `loadGame()` 整体替换对象后引用失效。

旧 `cle.exploration.verticalSlice.v1` 只保留一次迁移兼容；正式探索数据全部进入主存档。

## Command / Event 闭环

```text
GameCommand
↓
CommandValidator
↓
Command Handler
↓
SimulationStateV1
↓
WorldEvent
↓
EventLedger / WorldEventBus
```

当前核心命令：`region.enter / exploration.return_point.set / quest.complete`。

当前核心事件：`region.entered / exploration.return_point_set / quest.completed`。

`source: agent` 已被代码规则禁止直接完成 Quest。

## ExplorationRuntime 边界

章节/WorldMap 入口现在只依赖 `src/simulation/exploration/ExplorationRuntime.ts`。

```text
legacy scene entry
      ↓
ExplorationRuntime
      ↓
FreeRoamPrototype compatibility shell
      ↓
formal Simulation / Presentation modules
```

`FreeRoamPrototype` 只是待删除兼容壳，不再作为未来章节开发 API。

## 已接入 live runtime 的确定性系统

`NavigationSystem / QuestSystem / SimulationClock / ScheduleSystem / RegionSystem / ActorMotionSystem / CollisionSystem / MovementSystem / InteractionSystem`

它们负责 Waypoint 路径、Quest 转换、游戏时间、NPC 日程、Region 注册、运动姿态、碰撞、玩家/NPC 位移、附近交互与 Quest 门槛。

## 已接入 live runtime 的 Renderer / Presentation

`ExplorationRenderer / ExplorationWorldPresentation / ExplorationActorViewFactory / ExplorationHudPresentation / ExplorationDialoguePresentation / ExplorationObjectivePresentation`

它们负责 Camera/HUD layout、地图背景/fallback/debug overlay、玩家/NPC Sprite、HUD、地图内对话、Quest marker/highlight。

这些模块都已由 `ExplorationRuntime` 接管当前可玩第三章切片，不是未使用的空接口。

## Phase A Migration Adapters

`LegacyFreeRoamActorViewAdapter / LegacyFreeRoamWorldViewAdapter / LegacyFreeRoamMovementAdapter / LegacyFreeRoamInteractionAdapter / LegacyFreeRoamPresentationAdapter / LegacyFreeRoamRendererAdapter`

Adapter 只用于迁移期：保持现有玩法稳定，同时把旧实例方法逐项重定向到新系统。等正式 Loop/Renderer 完成后整体删除。

## 当前 compatibility shell 仍剩余的职责

```text
Keyboard input lifecycle
frame update orchestration
NPC schedule/move orchestration
interaction dispatch orchestration
story open / exit lifecycle
periodic persistence trigger
Pixi Application lifecycle
```

实际规则基本已经抽出。下一阶段只处理调用时序：建立 `InputController + ExplorationLoop`，然后移除 `FreeRoamPrototype` compatibility shell。

## Story / AI 长期边界

剧情分 `Canonical Beat / Authored Dynamic Beat / Emergent Beat`。AI 可以帮助对白、解释和 Intent，但不能改 Canon。

Fast Loop（30~60 FPS）永不调用 LLM；Simulation Loop 主要是 TypeScript 规则；Cognitive Loop 只在重要事件异步调用模型。

模型只允许输出 `dialogue / interpretation / intent / mood`，不得输出 `relationship delta / canonical flag / quest completion / reward / battle result / coordinates`。

Relationship / Emotion / Knowledge / Memory 长期保持分离；Memory append-only；Knowledge 后续记录 `witness / told / rumor / document / inference` 来源。

## NPC Simulation LOD

```text
L0 玩家附近：完整移动/碰撞/动画/Social
L1 同区域离镜：简化移动/日程
L2 其他区域：离屏时间片/TravelState
L3 Dormant：只结算必要日程
```

离屏角色不逐帧寻路。

## Phase A 当前 checkpoint

已完成并接入 live runtime：

```text
SimulationStateV1
Persistence / Adapter
Command / Validator / Bus
WorldEvent / Ledger / Bus
Navigation / Quest / Clock / Schedule / Region
ActorMotion / Collision / Movement / Interaction
World / Actor / HUD / Dialogue / Objective Presentation
stable ExplorationRuntime boundary
architecture guard
```

下一步：

```text
InputController
ExplorationLoop / NPC orchestration
Story/Exit lifecycle cleanup
remove FreeRoamPrototype compatibility shell
```

然后正式进入 `chapter0_start` 的第0章自由移动改造。

第0章第一阶段保持 **LLM OFF**，先确保玩法、存档、回滚、剧情桥和战斗返回可靠。
