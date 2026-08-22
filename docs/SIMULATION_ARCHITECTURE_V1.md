# 《宿命回响：残响之途》Simulation Architecture v1

> 状态：设计冻结候选（2026-08-22）
>
> 目标：在不推倒现有 `game.js / SCENES / BATTLES / TeaBreak / WorldMap` 的前提下，把自由探索升级为可支撑第 0～11 章、NPC 日程、关系、记忆、信息传播和后续 LLM Agent 的正式 Simulation Runtime。

## 1. 核心结论

本项目不采用“每个 NPC 都是一个会直接修改游戏的 LLM Agent”模式。

正式架构遵守四条硬规则：

1. **AI 不拥有世界真相。**
2. **AI 不直接执行动作。**
3. **AI 不直接修改剧情 Flag、关系数值、奖励、战斗结果或坐标。**
4. **AI 只提出结构化 Interpretation / Intent，游戏规则负责验证与执行。**

最终闭环：

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

## 2. 保留现有 Canonical Runtime

`game.js` 继续承担：

- `GameState`
- `SCENES`
- choices / effects / conditions
- `BATTLES`
- TeaBreak
- 当前存档系统
- `showScene()` / `goToScene()`

Phase A 不做全量 TypeScript 重写。

`src/exploration-legacy-main.ts` 只作为旧剧情入口与新 `ExplorationRuntime` 之间的迁移桥；它不能知道具体 Migration Adapter，也不能直接实现 Simulation 规则。

## 3. 单一新状态容器

正式新增：

```text
window.GameState.simulationV1
```

其中保存：

```text
clock
currentRegionId
returnPoint
regions
quests
agents
eventCursor
eventLedger
```

`LegacyGameStateAdapter` 每次从当前 `window.GameState` 读取，禁止长期缓存旧对象引用，因为旧 `loadGame()` 会整体替换 GameState。

旧单区域探索存档 `cle.exploration.verticalSlice.v1` 只保留一次迁移兼容；正式区域状态全部进入主存档。

## 4. Command / Event 闭环

现在正式存在：

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

当前核心命令：

```text
region.enter
exploration.return_point.set
quest.complete
```

当前核心事件：

```text
region.entered
exploration.return_point_set
quest.completed
```

硬规则已进入代码：

```text
source: agent
```

不能直接完成 Quest。

## 5. Exploration Runtime 边界

章节/WorldMap 入口只依赖：

```text
src/simulation/exploration/ExplorationRuntime.ts
```

当前迁移结构：

```text
legacy scene entry
      ↓
ExplorationRuntime
      ↓
FreeRoamPrototype compatibility shell
      ↓
formal Simulation / Presentation modules
```

`FreeRoamPrototype` 在 Phase A 期间仅作为待替换兼容壳；外层入口不能再直接依赖它。

## 6. 已抽取并已接入实际运行时的 Exploration 模块

### 确定性规则

```text
NavigationSystem
QuestSystem
SimulationClock
ScheduleSystem
RegionSystem
ActorMotionSystem
CollisionSystem
MovementSystem
InteractionSystem
```

职责：

- Waypoint 路径
- Quest 状态转换
- 游戏时间
- NPC 日程选择
- Region 注册/查找
- 角色运动姿态数学
- 碰撞
- 玩家/NPC 位移
- 附近 NPC、区域命中、Quest 门槛

### Renderer / Presentation

```text
ExplorationRenderer
ExplorationWorldPresentation
ExplorationActorViewFactory
ExplorationHudPresentation
ExplorationDialoguePresentation
ExplorationObjectivePresentation
```

职责：

- Camera / HUD layout 数学
- 背景、fallback floor/grid、debug navigation overlay
- 玩家/NPC Sprite、阴影、名字、活动文字构建
- HUD Pixi 对象
- 地图内 Dialogue lines/index/callback/panel
- Quest marker / zone highlight / pulse

以上均已通过 `ExplorationRuntime` 的迁移 Adapter 接管当前第三章可玩切片；它们不是仅存在但未使用的空接口。

## 7. Migration Adapter 原则

目前存在：

```text
LegacyFreeRoamActorViewAdapter
LegacyFreeRoamWorldViewAdapter
LegacyFreeRoamMovementAdapter
LegacyFreeRoamInteractionAdapter
LegacyFreeRoamPresentationAdapter
LegacyFreeRoamRendererAdapter
```

它们只允许存在于 Phase A。

用途是：

1. 保持第三章当前可玩行为稳定。
2. 把旧实例的方法逐个路由到新系统。
3. 避免一次性重写 1000+ 行 `FreeRoamPrototype`。
4. 等新 Renderer/Loop 完整后整体删除。

`src/exploration-legacy-main.ts` 不得 import 这些 Adapter。

## 8. 当前仍留在 FreeRoam compatibility shell 的职责

下一步主要剩余：

```text
Keyboard input lifecycle
frame update orchestration
NPC schedule/move orchestration
interaction dispatch orchestration
story open / exit lifecycle
periodic persistence trigger
Pixi Application lifecycle
```

其中实际规则已经大多在新 System 中；下一阶段重点是把“谁在什么时候调用这些系统”抽成正式 Loop/Input Controller。

## 9. Story 架构

剧情分三类：

### Canonical Beat

作者控制的核心事实。AI 无权新增、删除、提前泄露。

### Authored Dynamic Beat

作者定义内容与条件，Director 决定合适时机。

### Emergent Beat

允许 Agent 自由产生普通社交、临时行动和非关键事件，但不得修改 Canon。

`StoryPolicy` 后续控制 Scene 自由度：

```ts
{
  freedom: 'low' | 'medium' | 'high';
  canonicalLock: boolean;
  allowAmbientSocial: boolean;
  allowAgentScheduleChanges: boolean;
}
```

## 10. Agent / AI 边界

### Fast Loop（30~60 FPS）

输入、移动、碰撞、动画、摄像机、Trigger。

**永不调用 LLM。**

### Simulation Loop（事件驱动或约 0.5~2 秒）

日程、目标、附近角色、Social State、离屏旅行、Quest 监听。

主要为 TypeScript 确定性规则。

### Cognitive Loop（异步）

只在重要时刻调用模型：

- 重要玩家对话
- 重大剧情结束
- 新的高重要度世界事件
- 需要重新制定 Goal
- Reflection 阈值达到

模型输出仅允许：

```text
dialogue
interpretation
intent
mood
```

模型不输出：

```text
relationship delta
canonical flag
quest completion
reward
battle result
coordinates
```

## 11. Relationship / Emotion / Knowledge / Memory

长期结构保持分离：

```text
Relationship = 长期怎么看一个人
Emotion      = 当前感觉
Knowledge    = 知道/相信什么
Memory       = 经历过什么
```

Memory append-only；新的理解写成 Belief / Reflection，不篡改旧事件。

Knowledge 后续记录来源：

```text
witness / told / rumor / document / inference
```

知道一个 secret 不等于允许说出它。

## 12. NPC Simulation LOD

未来几十个 NPC 采用：

```text
L0 玩家附近：完整移动/碰撞/动画/Social
L1 同区域离镜：简化移动/日程
L2 其他区域：离屏时间片/TravelState
L3 Dormant：只结算必要日程
```

离屏角色不逐帧寻路。

## 13. Phase A 当前状态

已完成并接入 live runtime：

```text
SimulationStateV1
LegacyGameStateAdapter
SimulationPersistence
GameCommand / Validator / CommandBus
WorldEvent / Ledger / Bus
Navigation / Quest / Clock / Schedule / Region
ActorMotion / Collision / Movement / Interaction
ExplorationRenderer
World / Actor / HUD / Dialogue / Objective Presentation
stable ExplorationRuntime boundary
architecture guard
```

下一阶段：

```text
InputController
ExplorationLoop / NPC orchestration
Story/Exit lifecycle cleanup
remove FreeRoamPrototype compatibility shell
```

完成后进入：

```text
chapter0_start
↓
第0章正式自由移动改造
```

第0章第一阶段仍然 **LLM OFF**。先保证完整玩法、存档、回滚、剧情桥、战斗返回都可靠，再接 Agent Brain Provider。
