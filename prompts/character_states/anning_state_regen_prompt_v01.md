# 安柠状态立绘重生提示词 v01

用途：从干净母图逐张重生安柠六状态立绘。不要使用旧 `character_states/sprites/*_v02.png` 或临时修边 `*_v03.png` 做图生图参考。

## 剧情文件锚点

来源：`F:\提示词\剧情\宿命回响_第零章_禁曲未响_命运节拍风格强化版.md`

- 安柠身份：昼夜巡演团修理师、司机、记录员、主角现实锚点。
- 不是律者，不要画成战斗 Musicart 或华丽装甲角色。
- 外观：棕色马尾、旧工装上衣、工具腰包、记录终端。
- 性格：嘴硬心软、现实主义、怕主角再少活十分钟、代表普通人的恐惧与爱。
- 专属提示词：`anime support girl mechanic`, `brown ponytail`, `practical worn work shirt`, `tool belt`, `recording tablet`, `worried but stubborn expression`, `no battle armor`, `old touring repair car`, `warm human feeling`, `road trip fantasy RPG style`。

## 身份硬锚点

- 棕色凌乱高马尾，几缕碎发和发夹。
- 温暖棕/琥珀色眼睛，不是律者音符瞳。
- 白色旧工装衬衫，袖口卷起，有污渍和修补痕迹。
- 黑色短皮革/帆布背心或背带，工具腰包，扳手、螺丝刀、仪表、挂表、红色破布。
- 黑色实用工装裤，厚底工作靴，半指手套。
- 手持记录终端 / 维修平板。
- 气质是“普通人也要把队伍拉回现实”的温暖倔强，不要魔法礼服、战斗装甲、Musicart 化。

## 通用单张状态模板

```text
Use case: illustration-story
Asset type: visual novel full-body character state sprite for a production game
Primary request: Generate ONE clean full-body single-state sprite for Anning / 安柠 in the <STATE> state, strictly from the provided comprehensive mother sheet. This must be a clean new redraw from the mother sheet, not a retouch or continuation of any old state sprite.

Critical identity anchors:
Anning is an anime support girl mechanic, repair-team driver and recorder, ordinary human reality anchor, messy brown high ponytail with loose strands, warm brown/amber eyes, practical worn white work shirt with rolled sleeves and stains, black cropped utility vest/harness, black cargo work pants, tool belt with wrenches/screwdrivers/gauge/watch, red rag tied at the waist, fingerless black gloves, heavy work boots, recording tablet / repair terminal.

Eye and face anchors:
warm human brown/amber eyes, no musical-note pupils, no Musicart eye effects, no heavy opera makeup. Slight grease smudges and sweat marks on cheek/hands are allowed. Face should feel stubborn, practical, warm, and alive.

State expression:
<STATE_EXPRESSION>

Pose/framing:
full-body standing visual-novel sprite, centered, generous padding around hair, hands, tablet/tools, belt, boots, and dangling cloth. One character only. Full body visible. No cropping. Readable production sprite silhouette.

Costume anchors:
practical worn white work shirt, black cropped utility vest/harness, black cargo pants, tool belt, hanging tools, small compass/watch, red rag at waist, fingerless gloves, heavy lace-up work boots, recording tablet / repair terminal.

Style/quality:
MAPPA MADHOUSE anime film production quality, high saturation anime game character design, road trip fantasy RPG support character, warm human feeling, detailed but practical costume, sharp focus on face and eyes, polished production sprite quality.

Background:
perfectly flat uniform #ff00ff chroma-key background only; no floor plane, no shadows, no gradient, no texture.

Hard constraints:
one character only, no panel layout, no text, no watermark, no scenery, no cast shadow, no glow spill, no green background, do not use old state sprites as reference, do not change face, hairstyle, outfit silhouette, tools, tablet, gloves, boots, body proportions, or practical black-white-brown-red color language.

Negative prompt:
Musicart battle dress, musical-note pupils, glowing eyes, heavy opera eyeliner, fantasy armor, sci-fi armor, school uniform, elegant gown, chibi style, overly cute mascot expression, comedy face, oversized weapon, magic aura, low detail, simple plain outfit, six-panel sheet, multiple expressions, cropped feet, cropped hair, cropped tools, green fringe
```

