# 弥洛状态立绘重生提示词 v01

用途：从干净母图逐张重生弥洛六状态立绘。不要使用旧 `character_states/sprites/*_v02.png` 或临时修边 `*_v03.png` 做图生图参考。

## 剧情文件锚点

来源：`F:\提示词\剧情\宿命回响_第零章_禁曲未响_命运节拍风格强化版.md`

- 弥洛 · 低鸣骑士：临时同行男性律者。
- 音乐情绪：低音、守护、雷声、沉默的承诺。
- 武器：大提琴盾枪。
- 外观主色：灰蓝、黑银、低饱和金。
- 性格：寡言，保护欲强，曾经因同频过载误伤过前任奏者。
- 服装锚点：黑银骑士正装战斗服、领口一朵风干发黑的蓝灰色蔷薇。
- 专属提示词：`anime male Musicart knight`, `long ash-blue hair`, `calm grey-blue eyes`, `subtle silver lower eyeliner`, `black and silver simple knight-formal battle outfit`, `single withered blue-grey rose pinned at the collar`, `cello-case shield and spear weapon`, `low-frequency blue-gold sound waves`, `protective posture`。
- 男性律者眼部模块：`calm grey-blue eyes`, `subtle silver lower eyeliner`, `faint blue-gold bass-clef pattern in the iris`, `restrained knightly gaze`, `low-frequency sound wave reflection`, `no heavy makeup`, `elegant male Musicart eye design`。

## 身份硬锚点

弥洛的眼睛是最高优先级：

- 灰蓝眼睛，不要变成金眼或普通棕眼。
- 虹膜内必须有淡蓝金色低音谱号 / bass-clef 图案。
- 下眼线是克制的银色，不是浓重女性眼妆。
- 眼神是冷静、守护、寡言、带自责感的骑士气质。

## 通用单张状态模板

```text
Use case: illustration-story
Asset type: visual novel full-body character state sprite for a production game
Primary request: Generate ONE clean full-body single-state sprite for Milo / 弥洛 in the <STATE> state, strictly from the provided comprehensive mother sheet. This must be a clean new redraw from the mother sheet, not a retouch or continuation of any old state sprite.

Critical identity anchors:
Milo is an anime male Musicart knight, quiet guardian, low-frequency bass resonance theme, long messy ash-blue/black-blue hair, pale refined face, calm grey-blue eyes, black and silver knight-formal battle outfit, low-saturation gold ornaments, single withered blue-grey rose pinned at the collar, black gloves, tall black boots, asymmetrical dark burgundy/grey-blue sash, gold stave and thorn filigree, cello-case shield and spear / tuning-fork-like weapon.

Eye design is the highest priority:
calm grey-blue eyes, subtle silver lower eyeliner, faint blue-gold bass-clef pattern clearly visible in the iris, restrained knightly gaze, low-frequency sound wave reflection, no heavy makeup, elegant male Musicart eye design. Avoid ordinary plain eyes, avoid golden Atya-like musical pupils.

State expression:
<STATE_EXPRESSION>

Pose/framing:
full-body standing visual-novel sprite, centered, generous padding around hair, hands, weapon, coat tails, and feet. One character only. Full body visible. No cropping. Readable production sprite silhouette.

Costume anchors:
black and silver knight-formal battle outfit, low-saturation gold filigree, structured high collar, shoulder armor details, chain ornaments, withered blue-grey rose at collar, dark burgundy/grey-blue asymmetric sash and trailing cloth, black gloves, tall black boots, cello-case shield and spear / tuning-fork-like weapon.

Style/quality:
MAPPA MADHOUSE anime film production quality, high saturation anime game character design, cinematic key visual polish, intricate costume detail, vivid but restrained ash-blue hair, crisp grey-blue bass-clef eyes, luminous skin tone, sharp focus on face and eyes, polished production sprite quality.

Background:
perfectly flat uniform #ff00ff chroma-key background only; no floor plane, no shadows, no gradient, no texture.

Hard constraints:
one character only, no panel layout, no text, no watermark, no scenery, no cast shadow, no glow spill, no green background, do not use old state sprites as reference, do not change face, hairstyle, outfit silhouette, rose, gold filigree, weapon, gloves, boots, body proportions, or black-silver-grey-blue color language.

Negative prompt:
normal plain eyes, gold Atya eyes, heavy feminine eyeshadow, no bass-clef iris, casual clothes, school uniform, sci-fi armor, mecha parts, bright pastel palette, cute chibi style, comedy expression, low detail, simple suit, oversized cartoonish rose, flat lighting, six-panel sheet, multiple expressions, cropped feet, cropped hair, cropped weapon, green fringe
```

