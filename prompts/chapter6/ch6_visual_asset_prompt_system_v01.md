# 第六章《拾光缓响》统一美术提示词模板 v01

用途：第六章所有背景、CG、角色立绘、敌方素材的统一可维护提示词。核心目标是：**田园温泉治愈系 ≠ 模糊柔光滤镜 ≠ 普通乡村素材**。本章第一次让世界呈现“能接住人”的安全感，但仍必须保留《宿命回响 / takt op.》系的音乐主题、律者身份特征、清晰脸部与服装连续性。

## 参考学习来源与提炼

- https://game.takt-op.jp/ ：官方视觉核心是音乐主题、Musicart / Conductor 关系、华丽而清晰的角色设计、舞台感与战斗服装的可读性。
- https://takt-op.fandom.com/wiki/Takt_op._-_Game ：游戏设定围绕 D2、Musicart、Conductor 与音乐力量；即使场景温暖，也不能脱离“音乐灾害后的世界”。
- https://dic.pixiv.net/a/%E5%AE%BF%E5%91%BD%E5%9B%9E%E5%93%8D ：同人视觉语汇倾向精致二次元角色、古典乐拟人、礼装/舞台化装饰与清晰眼部特征。
- https://zh.wikipedia.org/zh-cn/%E5%AE%BF%E5%91%BD%E8%BF%B4%E9%9F%BF ：世界危机来自音乐被夺走与异形威胁；第六章的治愈感应建立在“灾后庇护地”的世界观上，而不是无设定的日常田园。

## 0. 第六章总锚点

```text
第六章是拾光村：金色梯田、天然温泉、木造屋舍、古树与风铃构成的疗愈地带。
它不靠大战证明分量；它靠清晰、温暖、可停留的空间，让角色第一次被允许安静下来。
```

## 1. 通用场景模块

### 1.1 正向通用补充词

```text
peaceful pastoral healing village in a mountain valley,
layered golden terraced rice fields, natural hot spring pool, warm wooden houses,
dried herb bundles and simple wind chimes under the eaves, massive centuries-old tree at the village entrance,
soft natural sunlight, warm honey-gold palette, gentle restorative atmosphere,
classical-music fantasy worldbuilding, polished high-saturation 2D anime game background,
foreground elements rendered in crisp clear focus, distant mist only around hot spring and background valley layers,
clear readable composition for visual novel dialogue UI
```

### 1.2 通用负面词

```text
negative prompt:
gothic dark architecture, black lacquer opera train, cold blue laboratory tones, marble institutional buildings,
urban modern architecture, horror atmosphere, industrial machinery, sterile sci-fi environment,
ruined village, battlefield rubble, post-apocalyptic debris, rainstorm, heavy fog covering entire frame,
overexposed washed-out highlights, uniform golden-green color wash erasing detail,
soft blur affecting foreground, hazy indistinct foreground, unreadable faces, logo, watermark, readable text
```

### 1.3 雾气与清晰度锁定

```text
soft natural sunlight and rising mist confined to background and distant landscape elements,
foreground characters and foreground architecture rendered in crisp clear focus with well-defined features,
avoid overall soft-focus haze covering the entire frame,
maintain clear distinction between misty distant scenery and sharply-defined nearby subjects
```

## 2. 人物一致性模块

### 2.1 全角色共通身份锁定

```text
preserve the same face shape, hairstyle, body proportions, outfit silhouette, signature accessories,
clear readable face, eyes not covered by shadow, costume details visible,
no redesign into unrelated character, no generic faceless mob, no chibi, no photorealistic style,
high-quality 2D anime game character art, polished visual-novel RPG sprite readability,
classical music fantasy costume language adapted gently to pastoral healing setting
```

### 2.2 律者 / Musicart 眼部设计锁定

```text
Musicart eye design must remain consistent and readable,
clear musical motif in the irises, delicate lower-eye stave marks, visible stylized eye makeup,
eyeshadow shape and iris motif are identity features, not optional decoration,
no plain human eyes, no empty black eyes, no covered eyes, no muddy dark shadow over eyelids
```

### 2.3 零四第六章康复眼部模块

```text
Sequence-04 / 零四, pale Musicart girl in advanced recovery,
same silver-white / pale ash hair and fragile elegant face as previous chapters,
warm settled golden eyes with genuine stable emotional depth nearly indistinguishable from natural Musicart warmth,
only the faintest almost invisible old grey trace at the very outer eye corner, healed but not erased,
borrowed simple linen village outfit may replace battle dress only for Chapter 6 daily scenes,
keep her face shape, hair silhouette, pale body proportions, and delicate music-box / staff-line visual language recognizable
```

### 2.4 阿缇娅模块

```text
Atya / 阿缇娅, female Musicart, short dark-purple hair, golden musical-note pupils,
dark violet and crimson rose-petal eyeshadow, delicate golden stave-like lower-eye marks,
black and crimson gothic opera battle dress or softened travel variant retaining black rose motif,
composed but emotional expression, vivid purple-gold-crimson identity colors clearly separated from warm pastoral background
```

### 2.5 弥洛模块

```text
Milo / 弥洛, male Musicart knight, tall quiet guardian silhouette,
long messy ash-blue / black-blue hair, calm grey-blue eyes with low-frequency bass-clef resonance motif,
black and silver knight-formal outfit with low-saturation gold ornaments,
single withered blue-grey rose at the collar, melancholic but protective expression,
keep identity colors readable against golden fields and warm wood
```

### 2.6 澄芜模块

```text
Chengwu / 澄芜, female village guide, apparent age around 40 yet much older in presence,
long low-maintenance ash-brown hair loosely tied back, warm weathered eyes carrying deep gentle wisdom,
simple humble village clothing, no battle armor, no ornate noble attire,
patient nurturing posture, often barefoot near hot spring or under warm village eaves
```

### 2.7 屿模块

```text
Yu / 屿, young former conductor around 23, gentle but withdrawn,
low gaze, subtle exhaustion under the eyes, fingers marked by old conductor-baton grip calluses,
simple faded village clothing, no active battle uniform, no confident heroic commander pose,
when holding baton again: trembling hands, tears held back, grief and resolve in warm sunset light
```

## 3. 第六章首批资产清单与提示词

### A001 拾光村全景背景（已生成 v01）

```text
Use case: stylized-concept
Asset type: visual novel game background, Chapter 6 establishing background, 16:9 wide landscape
Primary request: Shiguang Village full establishing shot, a peaceful healing village in a mountain valley.
Scene/backdrop: layered golden terraced rice fields rolling down a green mountain basin; a small wooden village nestled among the terraces; a natural hot spring pool in the village center with gentle rising mist only in the distant background; wooden houses with dried herb bundles and simple wind chimes hanging under the eaves; a massive centuries-old tree at the village entrance; narrow footpaths and warm wooden fences; no modern city elements.
Subject: the village and landscape only, no main character standing in foreground; leave a clear central/lower-middle area usable behind visual-novel dialogue UI.
Style/medium: polished high-saturation 2D anime game background, classical-music fantasy worldbuilding, elegant painterly detail, warm pastoral healing aesthetic; inspired by original symphonic RPG visual language without copying existing images.
Composition/framing: cinematic wide establishing shot, slightly elevated view, strong depth from foreground rice terraces to distant wooden village and mountains; foreground must remain crisp and readable; mist confined to distant hot spring and background layers.
Lighting/mood: soft warm afternoon sunlight, gentle peaceful atmosphere, safe and restorative rather than ominous.
Color palette: golden rice, honey sunlight, warm wood brown, soft green mountain shadows, small white steam accents; maintain clear separation of colors.
Materials/textures: layered rice plants, wet field ridges, aged wood grain, stone hot spring edge, dried herb bundles, small brass/wood wind chimes.
Consistency constraints: Chapter 6 visual anchor is natural warmth plus clarity; mist must not blur the whole image; foreground details sharp; no characters, no text, no logos, no watermark.
Avoid / negative prompt: use 1.2.
```

输出文件：`assets/generated/chapter6/backgrounds/bg_ch6_shiguang_village_establishing_v01.png`

### A002 温泉边闲谈背景（待生成）

```text
wide visual novel background, quiet natural hot spring edge in Shiguang Village, stone pool, wooden changing eaves, dried herb bundles, distant golden terraces, gentle steam only behind the pool, foreground clean space for character sprites, warm afternoon light, no characters, no text, crisp foreground, pastoral healing aesthetic
```

### A003 古树下自我陈述 CG（待生成）

```text
peaceful anime introspective CG, Atya sitting beneath the massive ancient tree in dappled warm sunlight, protagonist sitting supportively beside her, golden musical-note pupils and violet-crimson eye makeup clearly readable, warm pastoral background, calm resolved expression, no redesign, no blurred face
```

### A004 澄芜与零四温泉引导 CG（待生成）

```text
gentle emotional anime scene, Chengwu sitting barefoot at the edge of a hot spring, guiding recovering Sequence-04 through small everyday choices, Ling Si / Sequence-04 with stable warm golden eyes and faint outer grey trace, borrowed linen village outfit, soft sunlight through distant mist, golden terraces in background, foreground faces crisp
```

### A005 屿重新握起指挥棒 CG（待生成）

```text
emotional anime scene, Yu with trembling hands finally holding an old carefully wrapped conductor baton again after two years, tears held back, warm golden sunset over terraced fields, protagonist and Sequence-04 watching supportively nearby, deeply cathartic bittersweet atmosphere, no battle pose, no heroic overconfidence
```

## 4. 出图后检查清单

1. 是否一眼是“拾光村疗愈地带”，而不是普通村庄或废墟？
2. 金色梯田、温泉水雾、木屋、古树、风铃/草药束是否至少出现三类？
3. 雾气是否留在远景，前景是否清楚？
4. 若有人物，脸部、眼睛、服装是否清楚？
5. 律者的眼影、眼部音乐 motif、瞳色是否保留？
6. 零四是否是“康复但未抹去经历”，而不是完全普通化？
7. 是否出现黑漆列车、冰蓝实验室、哥特废墟等前章视觉污染？若出现，弃用。
