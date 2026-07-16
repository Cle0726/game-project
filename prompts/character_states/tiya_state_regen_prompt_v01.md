# 缇雅状态立绘重生提示词 v01

用途：从干净母图逐张重生缇雅六状态立绘。不要使用旧 `character_states/sprites/*_v02.png` 或临时修边 `*_v03.png` 做图生图参考。

## 剧情文件锚点

来源：`F:\提示词\剧情\宿命回响_第零章_禁曲未响_命运节拍风格强化版.md`

- 缇雅是主角童年里最吵、最亮、最不肯安静的人。
- 她不像主角那样小心；她相信音乐会回来，因为她无法接受世界永远沉默。
- 代表台词：“那我们跑快点不就好了？”、“如果那里真的有钢琴呢？”、“如果只弹一首，会不会也算太贪心？”
- 她是阿缇娅的原人类身份，但缇雅状态必须是人类态，不要画成律者。
- 关键物件：白色吊坠 / 谱核，旧剧场演出裙记忆，雨夜、公路、旧钢琴。

## 身份硬锚点

- 短而蓬松的深紫黑发，带紫色高光，活泼凌乱。
- 温暖紫琥珀 / 紫棕色人类眼睛，不要音符瞳、不要金色五线谱泪痕。
- 白色旧衬衫，黑色背带/马甲，黑色短裙或短裤层叠，暗红破布腰结/裙摆，黑色靴子。
- 胸前白色水晶吊坠是核心配饰，不能丢。
- 气质：明亮、倔强、会冒险、带一点悲剧预感，但仍是人类少女。
- 禁止画成阿缇娅的黑红金战斗礼服、玫瑰荆棘 Musicart 装束、武器、音符瞳。

## 通用单张状态模板

```text
Use case: illustration-story
Asset type: visual novel full-body character state sprite for a production game
Primary request: Generate ONE clean full-body single-state sprite for Tiya / 缇雅 in the <STATE> state, strictly from the provided comprehensive mother sheet. This must be a clean new redraw from the mother sheet, not a retouch or continuation of any old state sprite.

Critical identity anchors:
Tiya is an ordinary human childhood friend girl, bright stubborn and unwilling to accept a silent world, short fluffy dark purple-black hair with violet highlights and loose strands, warm purple-amber human eyes, pale warm skin, white worn shirt with rolled sleeves, black vest/suspenders, black practical short skirt/shorts layers, dark red rag/sash tied at the waist, shoulder bag/strap, black lace-up boots, and a white crystal pendant on her chest.

Eye and face anchors:
warm purple-brown / violet-amber human eyes, no musical-note pupils, no glowing stave lines, no Musicart transformation makeup. Face should feel lively, brave, stubborn, warm, and human.

State expression:
<STATE_EXPRESSION>

Pose/framing:
full-body standing visual-novel sprite, centered, generous padding around hair, hands, bag/straps, skirt cloth, boots, and pendant. One character only. Full body visible. No cropping. Readable production sprite silhouette.

Costume anchors:
white worn shirt, black vest/suspenders, dark practical skirt/shorts, dark red waist cloth/sash, shoulder bag/strap, black lace-up boots, white crystal pendant, slightly rain-worn road-trip clothing.

Style/quality:
MAPPA MADHOUSE anime film production quality, high saturation anime game character design, tragic road trip childhood friend character, warm human feeling, sharp focus on face and eyes, polished production sprite quality, clean bright standing sprite lighting.

Background:
perfectly flat uniform #ff00ff chroma-key background only; no floor plane, no shadows, no gradient, no texture.

Hard constraints:
one character only, no panel layout, no text, no watermark, no scenery, no cast shadow, no glow spill, no green background, do not use old state sprites as reference, do not change face, hairstyle, outfit silhouette, pendant, bag, boots, body proportions, or white-black-dark-red color language.

Negative prompt:
Musicart battle dress, Atya outfit, black rose armor, thorny gothic gown, musical-note pupils, golden stave tears, glowing eyes, heavy opera eyeliner, fantasy armor, sci-fi armor, school uniform, elegant gown, chibi style, comedy face, oversized weapon, magic aura, low detail, six-panel sheet, multiple expressions, cropped feet, cropped hair, cropped pendant, green fringe
```

