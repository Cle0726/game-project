# 《宿命回响：残响之途》白金歌剧版章节衔接与实装说明

用途：记录第一至第三乐章内容如何衔接到后续 React/Vite/TypeScript 架构，以及白金歌剧版美术风格如何统一迁移。当前根目录静态版 `index.html` + `game.js` 已经先行实现三乐章主线；本文档用于后续迁移到 `src/` 目录或交给 Cursor/AI 开发工具继续工程化拆分。

## 1. 三乐章内容迁移提示词

把第一至第三乐章剧情内容连同下面这段提示词一起贴给 Cursor/AI 开发工具：

```text
请把以下三个乐章的剧情内容，按照之前“实现提示词E”建立的字段格式，
转换并写入对应文件：
  第一乐章 → src/narrative/chapter1.ts
  第二乐章 → src/narrative/chapter2.ts
  第三乐章 → src/narrative/chapter3.ts

战斗数据（battle:moth_swarm / battle:honor_guard_puppet /
battle:beatless_conductor）按照“实现提示词H”的 battleTypes 格式
写入 src/battle/battleData.ts。

随机事件池按照“实现提示词C”的 eventTypes 格式写入
src/narrative/eventData.ts，按章节分组：
  E1xx 属于 chapter=1
  E2xx 属于 chapter=2
  E3xx 属于 chapter=3

槐序的独演范例（ch3_006）按“实现提示词B”的 UltimateScene 格式
写入 src/narrative/ultimates.ts，作为槐序独演的标准实现参考。
后续可以继续补充洛温、伊芙白、明弦各自的独演文本。
```

## 2. 当前静态版对应关系

当前根目录静态版已经完成的对应实现：

- 第一乐章：`game.js` 内 `ch1_001` 至 `ch1_010`
- 第二乐章：`game.js` 内 `ch2_001` 至 `ch2_008`
- 第三乐章：`game.js` 内 `ch3_001` 至 `ch3_008`、`act1_complete`
- 战斗：`moth_swarm`、`honor_guard_puppet`、`beatless_conductor`
- 随机事件池：`CHAPTER1_EVENT_POOL`、`CHAPTER2_EVENT_POOL`、`CHAPTER3_EVENT_POOL`
- 独演参考：`beatless_conductor` 的槐序 `宿命三拍`，以及 `ch3_006`

## 3. 美术风格圣经使用方式

“零、美术风格圣经”可作为参考风格图的文字替代版。迁移到 React/Vite 版本时，把美术风格圣经连同下面这句话贴给 AI 开发工具：

```text
请按这份美术风格圣经，更新 tailwind.config.ts 的颜色配置，
和 src/index.css 的全局样式，把整个项目从深色废土风
改为白金歌剧风。
```

注意：根目录静态版当前使用 `style.css`，不是 Tailwind。若继续维护 `index.html` 版，应把白金歌剧色彩同步到 `style.css` 的全局 CSS 变量或统一视觉段落中。

## 4. 新版角色立绘提示词

使用方式：复制每个角色下面的英文提示词给生图 AI。不要把角色标题、编号、保存名等额外说明复制进去，避免模型把文字画进图片。

### 槐序

```text
high-saturation anime character illustration, gacha game poster style,
young woman with silver-gray short hair and amber eyes, ivory and
champagne gold ballgown with rose-dust accents, asymmetric ballet-meets-
fencer silhouette, holding an ornate lace fan that conceals a thin blade
edge, elegant mid-turn pose as if dancing alone, dramatic theatrical
lighting, clean white-gold background, opera house atmosphere, sharp
silhouette, high detail, vibrant saturated colors, no dark or grungy tones
```

### 洛温

```text
high-saturation anime character illustration, gacha game poster style,
man with dark brown skin, sapphire blue and platinum silver formal
military-coat-style uniform with gold epaulettes, holding a ceremonial
staff-weapon transformed from a double bass case, calm composed standing
pose, glowing taut bass strings as a defensive motif, clean white-gold
background, opera house atmosphere, sharp clean silhouette, vibrant
saturated colors
```

### 伊芙白

```text
high-saturation anime character illustration, gacha game poster style,
young woman with blue-black curly hair and pale gold eyes, asymmetric
harlequin-inspired opera cape with tiny bells on the cuffs, holding a
fan of mismatched throwing blades shaped like harmonica reeds, playful
off-kilter pose, cobalt blue and citrine gold color scheme, clean
white-gold background, vibrant saturated colors
```

### 明弦

```text
high-saturation anime character illustration, gacha game poster style,
young woman with an asymmetric crimson-white-black couture battle gown,
one side ornate lace sleeve, the other side exposing sleek mechanical
arm detailing, dual-wielding a slender white-gold conductor's baton and
a reforged broken cavalry saber, a single red rose pendant at her throat,
dramatic intense stance with 0.5-second stillness before motion implied,
clean white-gold background with subtle red accent lighting, vibrant
saturated colors, strong fate-symphony-inspired contrast
```

### 无拍者

```text
tall ghostly conductor figure, tattered formal tailcoat with precise
tailoring despite decay, cracked porcelain conductor mask with no visible
face, holding a baton trailing black-and-silver erased-sheet-music
particles, surrounded by floating broken orchestral instruments humming
discordant notes, uncanny beautiful horror aesthetic not grotesque,
dramatic stage lighting breaking through a torn sky, opera boss design,
high contrast silhouette
```
