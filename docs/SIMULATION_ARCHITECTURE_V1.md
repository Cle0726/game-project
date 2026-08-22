# 《宿命回响：残响之途》Simulation Architecture v1

> 状态：Phase A 实施中（2026-08-22）
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

这个结构综合借鉴：

- AI Town：引擎独占核心状态；Agent 异步操作只能提交 input；实时模拟与 LLM 长任务分离。
- Concordia：Agent 组件化、Game Master、putative action → event resolution、Scene Tracker。
- Stanford Generative Agents：Perceive / Retrieve / Plan / Reflect / Execute；记忆按相关性、近期性、重要性检索。
- chasm：事件目击者记忆、save-aware rollback、事件触发行为、AI 后端与游戏 Bridge 分离。
- Quilltale / Agentic Quest：WorldState 是 ground truth；AI 叙述与提议，Validator 决定是否合法/成功。
- SOTOPIA / TinyTroupe：社交质量评估、停滞检测、反重复和组件化 Agent。
- BRING：Story Arc / Phase / Timeline 与优先级任务协调。

## 2. 当前仓库源码评审

### 2.1 应保留的现有核心

`game.js` 继续作为 Legacy Canonical Story Runtime：

- `GameState`
- `SCENES`
- choices / effects / conditions
- `BATTLES`
- TeaBreak
- 当前存档系统
- `showScene()` / `goToScene()`

短期不做全量 TypeScript 重写。

`src/worldmap/worldMapBridge.ts` 已经证明“typed adapter 包住 legacy global”可行，应扩展这个模式，而不是继续让新系统直接散落访问 `window.GameState`。

区域数据继续保持数据驱动，Runtime 只读取定义，不把章节内容硬编码进引擎。

### 2.2 FreeRoamPrototype 的定位

`FreeRoamPrototype.ts` 仍然作为当前第三章可玩切片的 Pixi 外壳，但不再继续吸收规则逻辑。

Phase A 已经从它的依赖链中抽离：

- 存档 → `SimulationPersistence`
- 导航 → `NavigationSystem`
- Quest 状态转换 → `QuestSystem`
- 时间推进 → `SimulationClock`
- NPC 日程选择 → `ScheduleSystem`
- 区域注册 → `RegionSystem`
- 行走姿态数学 → `ActorMotionSystem`

下一步再把它内部仍然直接拥有的 Movement / Collision / Interaction / Renderer 逐步拔出。

### 2.3 探索存档已迁移

旧 `explorationSave.ts` 曾使用单一 key：

```text
cle.exploration.verticalSlice.v1
```

正式 Runtime 改为：

```ts
GameState.simulationV1
```

区域状态保存在：

```text
simulationV1.regions[regionId]
```

旧单区域 localStorage 只保留一次性迁移读取，迁移成功后删除旧 key。

### 2.4 Scene interception 只作为迁移桥

`exploration-legacy-main.ts` 目前仍通过包裹 `window.showScene / window.goToScene` 拦截 Scene ID，但现在入口已经通过 Simulation Runtime 记录：

- `region.enter`
- `region.entered`
- `exploration.return_point.set`

并且只在 Pixi region mount 成功后写入 `region.entered`，防止加载失败污染事件历史。

这个 monkey patch 仍标记为 **Legacy Adapter**，不会成为最终入口设计。

### 2.5 当前 Quest 模型

旧 `questState.ts` 已退化为兼容壳，真实状态转换在：

```text
src/simulation/quest/QuestSystem.ts
```

当前探索第一次完成 Quest 时，会通过：

```text
quest.complete
→ CommandValidator
→ quest.completed WorldEvent
```

进入统一事件账本。

`source: agent` 的 `quest.complete` 会被明确拒绝，落实“AI 不得直接完成任务”。

正式 Quest 后续升级 Objective Graph：

```ts
QuestDefinition {
  prerequisites
  objectives
  completion
  failConditions?
}
```

Objective 只允许受控 primitive：

```text
reach / interact / talk / observe / collect / deliver /
meet / wait / escort / investigate / battle / return
```

## 3. v1 模块边界

当前已落地的 Phase A 目录：

```text
src/simulation/
├── runtime/
│   ├── SimulationRuntime.ts
│   └── SimulationClock.ts
│
├── state/
│   ├── SimulationState.ts
│   ├── LegacyGameStateAdapter.ts
│   └── SimulationPersistence.ts
│
├── command/
│   ├── GameCommand.ts
│   ├── CommandBus.ts
│   ├── CommandValidator.ts
│   └── CoreCommandHandlers.ts
│
├── events/
│   ├── WorldEvent.ts
│   ├── WorldEventBus.ts
│   └── EventLedger.ts
│
├── exploration/
│   ├── SpatialTypes.ts
│   ├── MovementSystem.ts
│   ├── CollisionSystem.ts
│   ├── NavigationSystem.ts
│   ├── RegionSystem.ts
│   └── ActorMotionSystem.ts
│
├── quest/
│   └── QuestSystem.ts
│
└── agent/
    └── ScheduleSystem.ts
```

后续再增加：InteractionSystem、ExplorationRenderer、StoryDirector、AgentRuntime、Knowledge、Memory、Social、WorldDirector。

## 4. 单一状态真相

```ts
interface SimulationStateV1 {
  version: 1;
  clock: {
    minuteOfDay: number;
    day: number;
    seed: number;
  };
  currentRegionId?: string;
  returnPoint?: {
    regionId: string;
    x: number;
    y: number;
    facing: 'up' | 'down' | 'left' | 'right';
  };
  regions: Record<string, RegionRuntimeState>;
  quests: QuestRuntimeState;
  agents: Record<string, AgentRuntimeState>;
  eventCursor: number;
  eventLedger: WorldEvent[];
}
```

存放在：

```text
window.GameState.simulationV1
```

任何 TypeScript System 都通过 `LegacyGameStateAdapter` 读取当前 `window.GameState`，禁止缓存旧引用，因为 `loadGame()` 会整体替换 GameState 对象。

## 5. GameCommand 合约

```ts
interface GameCommand<T = unknown> {
  id: string;
  type: string;
  source: 'player' | 'story' | 'agent' | 'world';
  actorId?: string;
  issuedAt: number;
  payload: T;
}
```

当前已注册核心命令：

```text
region.enter
exploration.return_point.set
quest.complete
```

例：

```ts
{
  type: 'actor.move_to_waypoint',
  source: 'agent',
  actorId: 'milo',
  payload: { waypointId: 'station_platform' }
}
```

AI 不得输出直接坐标变更；位置由 Navigation / Movement / Collision 决定。

## 6. WorldEvent 合约

```ts
interface WorldEvent<T = unknown> {
  id: string;
  sequence: number;
  type: string;
  gameTime: number;
  regionId?: string;
  actorIds: string[];
  targetIds: string[];
  importance: number;
  tags: string[];
  payload: T;
}
```

当前已经产生的正式事件：

```text
region.entered
exploration.return_point_set
quest.completed
```

事件 append-only，`eventCursor` 与 ledger 一起进入主游戏存档。

## 7. Story 架构

剧情分三类：Canonical Beat / Authored Dynamic Beat / Emergent Beat。

`StoryPolicy` 控制 Scene 自由度：

```ts
{
  freedom: 'low' | 'medium' | 'high';
  canonicalLock: boolean;
  allowAmbientSocial: boolean;
  allowAgentScheduleChanges: boolean;
}
```

正式听证、Boss 前演出等使用 low + canonicalLock；自由探索日可使用 high。

## 8. Agent / AI 边界

### Fast Loop（30~60 FPS）

仅：输入、移动、碰撞、动画、摄像机、Trigger。

**永不调用 LLM。**

### Simulation Loop（事件驱动或约 0.5~2 秒）

日程、目标、附近角色、Social State、离屏旅行、Quest 监听。

主要为 TypeScript 确定性规则。

### Cognitive Loop（异步）

只在重要时刻调用模型：重要玩家对话、重大剧情、新的高重要度事件、重新制定 Goal、Reflection 阈值。

模型输出只允许：

```ts
AgentBrainResult {
  dialogue?: string;
  interpretation?: string;
  intent?: AgentIntent;
  mood?: string;
}
```

模型不输出 relationship delta、canonical flag、quest completion、reward、battle result、coordinates。

## 9. Relationship / Emotion / Knowledge / Memory

长期规划继续严格分离：

```text
Relationship = 长期怎么看一个人
Emotion      = 当前感觉
Knowledge    = 知道/相信什么
Memory       = 经历过什么
```

legacy 的 `信任 / 共鸣 / 压力` 暂不删除，由 Adapter 映射。

Memory append-only；新理解写成 Belief/Reflection，不重写旧事件。

## 10. NPC Simulation LOD

```text
L0 玩家附近：完整移动/碰撞/动画/Social
L1 同区域离镜：简化移动/日程
L2 其他区域：离屏时间片/TravelState
L3 Dormant：不模拟路径，只结算必要日程
```

## 11. Social 防停滞

正式 Social State：

```text
idle → invited/noticed → approaching → participating
     → remembering → cooldown → idle
```

必须有 pair cooldown、最大回合、每小时社交预算、stale detection、repetition score。

## 12. Phase A 进度

已完成：

```text
[x] SimulationStateV1
[x] LegacyGameStateAdapter
[x] SimulationPersistence
[x] GameCommand / Validator / Bus
[x] WorldEvent / EventLedger / EventBus
[x] 核心 region/return-point/quest commands
[x] NavigationSystem + legacy wrapper
[x] QuestSystem + legacy wrapper
[x] SimulationClock + ScheduleSystem + legacy wrapper
[x] RegionSystem + legacy wrapper
[x] ActorMotionSystem + Pixi legacy adapter
[x] CollisionSystem（已抽出，待 FreeRoam 接线）
[x] MovementSystem（已抽出，待 FreeRoam 接线）
[x] simulation:guard
```

下一顺序：

```text
Movement / Collision 接管 FreeRoam
→ InteractionSystem
→ ExplorationRenderer
→ FreeRoamPrototype 退役为正式 ExplorationRuntime
→ chapter0_start 接入
```

## 13. 验证原则

每次重构至少检查：

```text
旧章节仍能走
旧存档可迁移
多区域不会互相覆盖
加载失败不写假 WorldEvent
AI source 不能完成 Quest
Event sequence 单调递增
FreeRoam 不直接写 window.GameState
```

`npm run simulation:guard` 用于防止架构回退。
