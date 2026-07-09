# AI 实现提示词集：全系统版

## 全局身份设定

开发身份：协助一名零编程基础的大学生，开发《宿命回响：残响之途》。

游戏核心定位：

- 文字叙事为核心的二游风格游戏。
- 玩家扮演“奏者”，带领“律者”在末世旅行、建立关系、面对失谐危机。
- 情绪目标是“和一群音乐化身一起旅行”，不是刷副本。

叙事骨架：

- 主线剧情：推进世界危机。
- 律者个人故事：角色支线。
- 茶歇互动：日常陪伴，AI 驱动。
- 地图随机事件：可玩性。

核心机制：

1. 奏者性别影响男性律者指挥稳定性。
2. 每场战斗只能带 2 名律者。
3. 独演用高质量文字和视觉变化演出。
4. AI 律者茶歇受多维度变量控制。

## 固定工程目录

```text
src/
  narrative/
  characters/
  battle/
  life/
  map/
  health/
  store/
  components/
  pixi/
  lib/
```

## 本次落地范围

当前 `web-prototype` 依赖尚未安装 Tailwind、Framer Motion、GSAP、Zustand、Immer、Supabase SDK 或 dnd-kit。为保证代码立即可编译，本次先实现纯 TypeScript/React 核心：

- `src/characters/characterTypes.ts`
- `src/characters/dissonanceEngine.ts`
- `src/characters/characterData.ts`
- `src/narrative/sceneTypes.ts`
- `src/components/narrative/HiddenDialogueRenderer.tsx`
- `src/components/narrative/UltimateDisplay.tsx`
- `src/narrative/eventTypes.ts`
- `src/narrative/eventData.ts`
- `src/components/map/MiniGameView.tsx`
- `supabase/functions/character-chat/index.ts`

后续安装对应依赖后，可以把组件动画替换为 Framer Motion / dnd-kit 实现，但不改变外部 props 和数据结构。
