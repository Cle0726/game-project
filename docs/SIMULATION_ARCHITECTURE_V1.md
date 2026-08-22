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

`src/exploration/regionData.ts` / `archiveRegionData.ts` 的数据驱动地图定义方向正确，应继续保留“区域数据与 Runtime 分离”。

`npcSchedule.ts` 属于确定性模拟逻辑，应保留并逐步升级。

`pathfinding.ts` 的 Waypoint/BFS 适合作为早期可控导航方案，正式版后续可升级 A*，不急着引入完整 NavMesh。

### 2.2 当前最大结构问题

`FreeRoamPrototype.ts` 已超过 1000 行，并同时承担：

- Pixi 初始化与渲染
- 玩家输入
- 移动 / 碰撞
- NPC Runtime
- NPC 日程
- 导航
- HUD
- 对话
- Quest
- Story Bridge
- 存档
- 目标标记

这已经到达应该拆 Runtime/System 的临界点。继续在该文件增加第 0 章内容会让后续 Agent / Memory / Director 难以安全接入。

### 2.3 当前探索存档必须淘汰

`explorationSave.ts` 使用单一 key：

```text
cle.exploration.verticalSlice.v1
```

并在载入时要求 `parsed.regionId === regionId`。

因此它不是多区域存档；保存新区域会覆盖旧区域。正式多区域游戏不能继续沿用。

主游戏的 `createSavePayload()` 已经会 clone 整个 `GameState`，而 `migrateLegacyState()` 会保留未知字段。因此 v1 采用：

```ts
GameState.simulationV1
```

作为唯一新顶层扩展字段，将探索 / Agent / Event 数据纳入现有存档体系。

初期不需要把几十个新字段散落进 `DEFAULT_GAME_STATE`。

### 2.4 Scene interception 只作为迁移桥

`exploration-legacy-main.ts` 目前通过包裹 `window.showScene` / `window.goToScene` 拦截 Scene ID。

优点：

- 不改 800KB `game.js`
- 能快速验证第三章

缺点：

- 隐式 monkey patch
- Scene → Region 关系不可见于主剧情层
- 容易产生递归 / bypass / 生命周期问题

结论：保留到第 0 章 Runtime 迁移完成，但标记为 **Legacy Adapter**，不作为最终入口设计。

### 2.5 当前 Quest 模型只适合原型

`questState.ts` 当前仅支持：

```text
activeQuestId → complete → nextQuestId
```

正式 Quest 需要 Objective Graph：

```ts
QuestDefinition {
  prerequisites
  objectives
  completion
  failConditions?
}
```

Objective 只允许组合受控 primitive：

```text
reach / interact / talk / observe / collect / deliver /
meet / wait / escort / investigate / battle / return
```

AI 将来只能提出 QuestIdea，经 QuestCompiler + QuestValidator 变成 QuestDefinition，不能直接“说任务完成”。

## 3. v1 模块边界

建议目录：

```text
src/simulation/
├── runtime/
│   ├── SimulationRuntime.ts
│   ├── SimulationClock.ts
│   └── SimulationSeed.ts
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
│   └── reducers/
│
├── events/
│   ├── WorldEvent.ts
│   ├── WorldEventBus.ts
│   └── EventLedger.ts
│
├── exploration/
│   ├── MovementSystem.ts
│   ├── CollisionSystem.ts
│   ├── NavigationSystem.ts
│   ├── InteractionSystem.ts
│   ├── RegionSystem.ts
│   └── ExplorationRenderer.ts
│
├── quest/
│   ├── QuestSystem.ts
│   ├── QuestDefinition.ts
│   └── QuestValidator.ts
│
├── story/
│   ├── StoryDirector.ts
│   ├── StoryArc.ts
│   ├── StoryBeat.ts
│   └── StoryPolicy.ts
│
├── agent/
│   ├── AgentRuntime.ts
│   ├── AgentProfile.ts
│   ├── AgentActivationSystem.ts
│   ├── GoalSystem.ts
│   └── IntentSystem.ts
│
├── social/
│   ├── SocialSystem.ts
│   ├── ConversationState.ts
│   └── SocialBudget.ts
│
├── knowledge/
│   ├── KnowledgeSystem.ts
│   ├── WitnessSystem.ts
│   └── RumorSystem.ts
│
├── memory/
│   ├── EpisodicMemory.ts
│   ├── MemoryRetrieval.ts
│   ├── Belief.ts
│   └── ReflectionSystem.ts
│
└── director/
    ├── AgentDirector.ts
    └── WorldDirector.ts
```

v1 第一步只实现 runtime/state/command/events/exploration/quest；其余先定义接口，不接 LLM。

## 4. 单一状态真相

新增：

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

例：

```ts
{
  type: 'actor.move_to_waypoint',
  source: 'agent',
  actorId: 'milo',
  payload: { waypointId: 'station_platform' }
}
```

AI 不得输出：

```ts
{ x: 931, y: 442 }
```

位置由 NavigationSystem / RegionSystem 决定。

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

典型事件：

```text
actor.entered_region
actor.arrived
interaction.completed
conversation.started
conversation.ended
quest.objective_completed
story.beat_started
story.beat_completed
battle.started
battle.ended
fact.discovered
relationship.interpreted
```

Story / Quest / Witness / Memory 不互相直接调用，优先监听 WorldEvent。

## 7. Story 架构

剧情分三类：

### Canonical Beat

作者控制的核心事实。AI 无权新增、删除、提前泄露。

### Authored Dynamic Beat

作者定义内容与条件，Director 决定合适时机，例如 NPC 在满足位置/关系/剧情条件后发生一段可选对话。

### Emergent Beat

允许 Agent 自由产生普通社交、临时行动和非关键事件，但不得修改 Canon。

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

只在重要时刻调用模型：

- 重要玩家对话
- 重大剧情结束
- 新的高重要度世界事件
- 需要重新制定 Goal
- Reflection 阈值达到

模型输出：

```ts
AgentBrainResult {
  dialogue?: string;
  interpretation?: string;
  intent?: AgentIntent;
  mood?: string;
}
```

模型 **不输出**：

- relationship delta
- canonical flag
- quest completion
- reward
- battle result
- coordinates

### 现有 TeaBreak 需要的迁移

当前服务端 `TeaBreakResponse.effects` 与 `flagEvent` 应逐步废弃。

目标变为：

```text
LLM dialogue / interpretation
          ↓
RelationshipRules
          ↓
确定性的 RelationshipDelta
          ↓
GameCommand
```

例如 AI 只判断：

```text
interpretation = respected_autonomy
```

规则再决定：

```text
阿缇娅 trust +2 / respect +5
```

## 9. Relationship / Emotion / Knowledge / Memory 必须分离

长期规划采用四套不同状态：

```text
Relationship = 长期怎么看一个人
Emotion      = 当前感觉
Knowledge    = 知道/相信什么
Memory       = 经历过什么
```

Relationship 后续可从单一好感扩为：

```text
trust / warmth / respect / familiarity /
reliance / suspicion / fear / conflict
```

但 legacy 的 `阿缇娅信任 / 共鸣 / 压力` 暂不删除，由 Adapter 映射。

Memory append-only；新理解写成 Belief/Reflection，不重写旧事件。

Knowledge 必须记录来源：

```text
witness / told / rumor / document / inference
```

知道一个 secret 不等于允许说出它。

## 10. NPC Simulation LOD

为未来几十个 NPC 预留：

```text
L0 玩家附近：完整移动/碰撞/动画/Social
L1 同区域离镜：简化移动/日程
L2 其他区域：离屏时间片/TravelState
L3 Dormant：不模拟路径，只结算必要日程
```

离屏旅行保存 `from / to / departAt / arriveAt`，不逐帧移动。

## 11. Social 防停滞

正式 Social State：

```text
idle → invited/noticed → approaching → participating
     → remembering → cooldown → idle
```

必须有：

- pair cooldown
- max conversation turns
- max social events per game hour
- stale turn detection
- repetition score / novelty pressure

不要依赖 LLM 自己避免重复。

## 12. 测试 / Guard

项目已有大量 `*:guard` Node 脚本，这个模式非常适合 Simulation。

建议新增：

```text
simulation:guard
quest:guard
story:guard
agent:guard
```

首批自动验证：

1. 所有 Region waypoint 都存在且链接合法。
2. waypoint 不落入扩张后的 collision。
3. Quest objective 引用的 region/npc/zone 均存在。
4. Story interception 不形成循环。
5. Agent command 不包含坐标和禁用 mutation。
6. CanonicalViolationRate = 0。
7. KnowledgeLeakRate = 0（进入 AI 后）。
8. Conversation stale/cooldown 测试。
9. Snapshot save/load 后状态完全一致。
10. 同 seed 的 deterministic simulation 产生相同规则事件序列。

## 13. 当前文件 → v1 文件映射

```text
FreeRoamPrototype.ts
  → SimulationRuntime.ts
  → ExplorationRenderer.ts
  → MovementSystem.ts
  → CollisionSystem.ts
  → InteractionSystem.ts
  → RegionSystem.ts

npcSchedule.ts
  → ScheduleSystem（保留核心逻辑）

pathfinding.ts
  → NavigationSystem（先包 BFS，后换 A*）

questState.ts
  → QuestSystem + QuestDefinition + QuestValidator

explorationSave.ts
  → 删除；迁移 SimulationPersistence → GameState.simulationV1

regionData.ts / archiveRegionData.ts
  → 保留地图数据
  → Quest 数据与 NPC Profile 后续拆出

regionRegistry.ts
  → RegionRegistry + StoryEntryAdapter

exploration-legacy-main.ts
  → LegacyExplorationAdapter（过渡）

storyBridge.ts
  → StoryRuntimeAdapter

server/services/ai_service.py
  → 以后拆 AgentBrainProvider / TeaBreakBrainProvider
```

## 14. 不引入的东西

v1 明确不做：

- 不迁移到 Convex。
- 不采用 AI Town 的服务端 60 tick 架构；本项目是单机前端 Pixi Runtime。
- 不完整移植 Stanford Generative Agents。
- 不把 Concordia 当实际游戏引擎。
- 不让 LLM 生成可执行代码。
- 不让 LLM 每帧 / 每秒思考。
- 不做无限开放世界 NavMesh。
- 不为第 0 章先接向量数据库。
- 不让 AI 动态创造 Canonical 角色、核心地点和世界事实。

只借鉴它们已经验证过的边界和数据结构。

## 15. 实施顺序

### Phase A — Runtime extraction（立即）

- 定义 SimulationStateV1
- 定义 GameCommand / WorldEvent
- LegacyGameStateAdapter
- CommandBus / WorldEventBus
- 从 FreeRoamPrototype 拆 Movement / Interaction / Region
- explorationSave → GameState.simulationV1
- 保持第三章功能不退化

### Phase B — Chapter 0 conversion

- 从 `chapter0_start` 顺序改
- 第一张第 0 章探索区
- 移动教学
- 调查教学
- NPC 交互
- StoryTrigger
- Battle → ReturnPoint → Exploration
- 完整跑通第 0 章

### Phase C — deterministic living world

- AgentProfile / AgentRuntime
- Schedule
- Social State Machine
- WitnessSystem
- Relationship Rules
- Event Ledger
- LLM OFF

### Phase D — AI cognition

- AgentBrainProvider
- Memory Retrieval
- Interpretation / Intent
- Reflection
- Rumor / Belief
- Director validation

### Phase E — Chapter 1 → 11

按章节逐步迁移；现有第三章探索切片作为回归测试样本。

## 16. v1 Definition of Done

Architecture v1 的底层实现只有在满足以下条件后才能开始大规模改章节：

- `FreeRoamPrototype` 不再承担全部系统职责。
- 探索状态进入现有 GameState 存档，而不是第二套 localStorage。
- 所有新世界 mutation 走 GameCommand/Validator。
- 所有系统联动优先走 WorldEvent。
- 第 0 章可完整从探索 → 剧情 → 战斗 → 返回探索。
- 第三章现有广场/档案层仍能运行。
- LLM 关闭时世界仍然完整可玩。
- 后续 LLM Provider 可以替换，而不需要修改 Movement / Quest / Story 核心。

这套 v1 的目的不是把项目变成 AI 技术展示，而是先把《残响之途》变成一个稳定、可测试、可存档、可扩展的自由探索 RPG，再让 AI 在受控边界里赋予角色更强的生命感。
