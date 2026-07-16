# 阿缇娅状态立绘重生提示词 v01

用途：从干净母图逐张重生阿缇娅六状态立绘。不要使用旧 `character_states/sprites/*_v02.png` 或临时修边 `*_v03.png` 做图生图参考。

## 剧情文件锚点

来源：`F:\提示词\剧情\宿命回响_第零章_禁曲未响_命运节拍风格强化版.md`

- 第零章版本定位强调：律者变身时重点强化“眼线、眼影、瞳孔、眼下乐谱纹、金色泪光、眼部特写”。
- 阿缇娅变身描述：暗紫与暗红色眼影从眼尾蔓延；人类瞳孔碎裂成金色音符形状；眼下浮现金色五线谱纹，像泪痕，又像乐谱。
- 阿缇娅专属提示词：`short dark-purple hair`, `golden musical-note pupils`, `star-shaped note pupils`, `dark violet and crimson eyeshadow`, `tiny glowing golden stave lines under lower lashes`, `black and crimson gothic opera battle dress`, `thorny black rose motif`, `torn vine ornament`, `broken white pendant`.
- 阿缇娅眼部专用模块：`golden eyes with faint purple shadows`, `star-shaped musical-note pupils`, `dark violet and crimson eyeshadow spreading from the outer corners like blooming rose petals`, `sharp black-purple upper eyeliner`, `tiny golden stave lines glowing under the lower lashes`, `tear-like golden light trails`, `broken white pendant light reflected in her irises`.
- 负面提示词：避免 `plain makeup`, `normal human eyes`, `no musical pupils`, `no eyeshadow`, `no eyeliner`, `overly cute expression`, `low detail`, `simple dress`, `bright pastel color palette`, `chibi style`。

## 身份硬锚点

阿缇娅的眼睛是最高优先级：

- 金色眼睛必须带淡紫阴影。
- 虹膜内必须能看出星形 / 音符形音乐符号瞳，不是普通金眼。
- 眼尾必须有暗紫与暗红眼影，形状像蔷薇花瓣扩散。
- 上眼线必须锐利，黑紫色歌剧眼线。
- 下眼睑下方必须有细小金色五线谱光纹，像金色泪痕。
- 眼神是美丽、冷淡、悲剧、非人化的 Musicart 觉醒感。

## 通用单张状态模板

```text
Use case: illustration-story
Asset type: visual novel full-body character state sprite for a production game
Primary request: Generate ONE clean full-body single-state sprite for Atya / 阿缇娅 in the <STATE> state, strictly from the provided comprehensive mother sheet. This must be a clean new redraw from the mother sheet, not a retouch or continuation of any old state sprite.

Critical identity anchors:
Atya is a tragic female Musicart transformed from a dying human, with short dark-purple hair, pale delicate face, elegant cold melancholic gaze, black-crimson-gold gothic opera battle dress, thorny black rose motif, torn vine ornaments, black gloves, tall black boots, slim black-gold conductor baton / rapier-like weapon, and a broken white pendant motif.

Eye design is the highest priority:
golden eyes with faint purple shadows; star-shaped musical-note pupils clearly visible inside the irises; dark violet and crimson eyeshadow spreading from the outer corners like blooming rose petals; sharp black-purple upper opera eyeliner; tiny glowing golden stave lines under the lower lashes like tear marks; tear-like golden light trails occasionally shaped like falling petals; broken white pendant light reflected in her irises. Avoid ordinary plain amber eyes.

State expression:
<STATE_EXPRESSION>

Pose/framing:
full-body standing visual-novel sprite, centered, generous padding around hair, hands, baton/weapon, skirt, and feet. One character only. Full body visible. No cropping. Readable production sprite silhouette.

Costume anchors:
black and crimson gothic opera battle dress, thorny black rose at waist/chest, red-crimson translucent layered skirt, dense gold thorn/vine filigree, torn vine ornament trailing from skirt, thorn-vine pattern wrapped around boots, broken white pendant glow at chest, black gloves, tall black boots, slim black-gold conductor baton / rapier-like weapon.

Style/quality:
MAPPA MADHOUSE anime film production quality, high saturation anime game character design, cinematic key visual polish, intricate costume detail, vivid saturated purple hair, luminous golden eyes, luminous skin tone, sharp focus on face and eyes, polished production sprite quality.

Background:
perfectly flat uniform #ff00ff chroma-key background only; no floor plane, no shadows, no gradient, no texture.

Hard constraints:
one character only, no panel layout, no text, no watermark, no scenery, no cast shadow, no glow spill, no green background, do not use old state sprites as reference, do not change face, hairstyle, outfit silhouette, roses, gold lattice, baton/weapon, gloves, boots, body proportions, or black-crimson-gold color language.

Negative prompt:
plain makeup, normal human eyes, ordinary plain amber eyes, no musical pupils, no eyeshadow, no eyeliner, overly cute expression, comedy style, low detail, simple dress, sci-fi armor, mecha parts, bright pastel color palette, chibi style, oversized cartoonish rose, flat lighting, six-panel sheet, multiple expressions, cropped feet, cropped hair, cropped weapon, green fringe
```

## Worried 状态填充

```text
<STATE> = WORRIED
<STATE_EXPRESSION> = worried and emotionally tense, as if hearing a forbidden note approaching; subtly drawn brows, small tense mouth, unsettled golden musical-note pupils, vulnerable but still cold and elegant; no exaggerated crying, no cute panic, no comedy.
```

