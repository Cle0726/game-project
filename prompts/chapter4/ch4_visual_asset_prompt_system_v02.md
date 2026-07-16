# 第四章《不夜终响》统一美术提示词模板 v02

用途：第四章所有背景、CG、角色立绘、敌方战斗素材的统一可维护提示词。核心目标是：**黑漆绯红不夜歌剧列车 ≠ 黑色废墟**。本章应像一列被强行维持演出的华丽歌剧列车，完整、干净、烛光明亮、绯红与金色可读，而不是末世废土、脏黑遗迹或塌毁车厢。

参考学习来源：
- https://game.takt-op.jp/ ：官方视觉侧重“Musicart / 音乐力量 / 华丽角色插画 / 奏者与指挥者关系”。
- https://takt-op.fandom.com/wiki/Takt_op._-_Game ：游戏世界观核心是音乐、D2、Musicart 与 Conductor，而不是废墟写实恐怖。
- https://dic.pixiv.net/a/%E5%AE%BF%E5%91%BD%E5%9B%9E%E5%93%8D ：同人图像语汇倾向精致二次元角色、古典乐拟人、舞台感服装。
- https://zh.wikipedia.org/zh-cn/%E5%AE%BF%E5%91%BD%E8%BF%B4%E9%9F%BF ：设定危机来自音乐被夺走与 D2 灾害，但视觉实现不应简单变成“黑废墟”。

---

## 0. 第四章总规则：防止 AI 生成黑色废墟

### 0.1 必须保留的目标元素

所有第四章图像都必须能一眼识别为：

```text
一列完整且仍在运行的黑漆歌剧列车；
黑漆结构面、绯红丝绒软装、暖烛光、水晶吊灯、古金色细工、镜面墙、车窗外疾驰夜景；
整体华丽、病态、过度维护、永不谢幕，而不是坍塌、肮脏、荒废或末世废墟。
```

### 0.2 正向通用补充词（所有第四章场景必须追加）

```text
intact luxurious black lacquer opera train interior, not ruined, not collapsed, not abandoned rubble,
polished reflective black lacquer structural surfaces clearly separated from deep crimson velvet soft furnishings,
warm candlelight pools on lacquer surfaces, crystal chandelier highlights, antique gold filigree details,
clean readable architecture, high saturation anime game illustration, gothic classical music fantasy,
faces and costumes clearly visible, strong but controlled contrast, no crushed blacks,
black surfaces are glossy and reflective rather than flat dark voids,
crimson velvet remains vivid and separated from black lacquer, elegant stage-opera atmosphere
```

### 0.3 负面通用补充词（所有第四章场景必须追加）

```text
negative prompt:
monochrome black image, crushed blacks, pure dark ruin, destroyed train, collapsed architecture,
rubble, dirty industrial ruin, abandoned wasteland, post-apocalyptic debris, muddy shadows,
muddy reddish-brown color blending, low saturation, hidden face, unreadable silhouette,
horror ruin, zombie, gore, rusty apocalypse, empty rubble field, broken city ruins,
flat black background, overdark vignette, smoke covering the whole frame, dirty grey palette,
modern subway interior, cyberpunk neon, photorealistic horror, readable text, logo, watermark
```

### 0.4 色彩比例锁定

```text
black lacquer structural surfaces: 35-45% of image area, glossy and reflective, never matte flat black;
deep crimson velvet seats / curtains / carpet: 20-30%, vivid wine red, not brown mud;
warm candlelight and chandelier highlights: 10-15%, visible pools of amber light;
antique gold filigree / music staff ornaments: 5-10%, localized details only;
blue-black night visible through windows: 10-15%, used for depth and contrast.
```

---

## 1. 人物一致性锁定模块

### 1.1 全角色共通身份锁定

```text
preserve the same face shape, hairstyle, body proportions, outfit silhouette, signature accessories,
clear readable face, eyes not covered by heavy shadow, costume details visible,
no redesign into unrelated character, no generic faceless mob, no chibi, no photorealistic style,
high-quality 2D anime game character art, polished gacha illustration finish,
classical music fantasy costume design, visual-novel RPG sprite readability
```

### 1.2 律者 / Musicart 眼部设计锁定

参考方向：takt op. 的 Musicart 视觉应保留“音乐主题、华丽战斗服、清晰角色脸部”；本项目律者变身必须保留眼影与眼部设计，不允许变成普通人眼或纯黑眼。

```text
Musicart eye design must remain consistent and readable,
clear musical motif in the irises, delicate lower-eye stave marks, visible stylized eye makeup,
no plain human eyes, no empty black eyes, no covered eyes, no muddy dark shadow over eyelids,
eyeshadow shape and iris motif must be treated as identity features, not optional decoration
```

### 1.3 阿缇娅 Atya 固定模块

```text
Atya / 阿缇娅, female Musicart, short dark-purple hair, golden musical-note pupils,
dark violet and crimson rose-petal eyeshadow, delicate golden stave-like lower-eye marks,
black and crimson gothic opera battle dress, black rose motif, conductor-baton visual language,
composed but emotional expression, vivid purple-gold-crimson identity colors clearly separated from the black-crimson train background
```

负面：

```text
plain makeup, normal human eyes, no musical pupils, no eyeshadow, hidden eyes,
random long hair, pastel idol dress, school uniform, sci-fi armor, mecha parts, unrelated face
```

### 1.4 弥洛 Milo 固定模块

```text
Milo / 弥洛, male Musicart knight, tall and quiet guardian silhouette,
long messy ash-blue / black-blue hair, calm grey-blue eyes with low-frequency bass-clef resonance motif,
black and silver knight-formal battle outfit, low-saturation gold ornaments,
single withered blue-grey rose at the collar, cello-case shield and spear / tuning-fork weapon language,
melancholic but protective expression, blue-grey identity colors readable against the warm opera train
```

### 1.5 零四 Sequence-04 固定模块

```text
Sequence-04 / 零四, pale forcibly-transformed Musicart girl, fragile slender body,
silver-white / pale ash hair, ghostly elegant face, hollow silver-grey eyes slowly recovering faint warm gold light,
white torn performance dress with thin gold staff-line chains and damaged music-box ornaments,
not a zombie, not gore, not dirty corpse, not horror monster,
restoration-state eye design: cold blankness with uneven cracks of warm golden light returning like light through broken glass
```

六状态只允许改变表情和局部恢复光，不改变脸型、发型、衣装轮廓：

```text
default: distant hollow expression, faint gold in eyes;
smile: extremely subtle fragile smile, first trace of self returning;
worried: confused and frightened, gold light unstable;
serious: trying to focus, eyes still incomplete;
shocked: sudden memory pain, fragile light flaring;
special: rescue moment, one genuine tear, warm gold cracks visibly stronger but still incomplete.
```

### 1.6 瑟萝弥最终战固定模块

```text
Seluomi / 瑟萝弥 final battle form, conflicted gothic holy-opera antagonist,
black-and-white gothic nun battle dress fused with dark red opera armor,
torn sheet-music veil, thorn-vine embroidery, wilted white rose at chest,
glowing golden stave-line blindfold over the eyes, crimson lower-eye shadow,
cross-shaped lance, small floating organ-pipe halos behind shoulders,
tragic faith-shaken expression, not cartoon villain, not monsterized beyond recognition
```

### 1.7 卡戎终战固定模块

```text
Charon / 卡戎, tall elegant male conductor boss, black long-tailed opera coat,
crimson velvet lining, antique gold music staff embroidery, pale porcelain half-mask cracked like a metronome face,
black-gold conductor baton raised, compact halo of broken pipe-organ tubes and gear-like metronome pieces,
real exhausted human face partially visible beneath theatrical mask,
final boss presence but still readable as a conductor, not a generic demon, not a ruin monster
```

### 1.8 岐与岚组合固定模块

```text
Qi and Lan / 岐与岚, two coordinated female antagonist Musicarts,
one with sharp black-red conductor ribbons and thin rapier-like baton,
one with pale gold thorn-string armor and crescent bow made of broken staff lines,
matching opera-train uniforms with black lacquer, deep crimson, antique gold embroidery,
not school uniforms, not identical twins, readable duo silhouettes, human conflict rather than faceless monster enemies
```

---

## 2. 第四章场景提示词

### 2.1 第四章主视觉：不夜巡演号

```text
anime game key visual, intact luxurious black lacquer opera train interior stretching into unsettling infinite distance,
polished reflective black lacquer walls and arches, deep crimson velvet seats and curtains, countless candles as distinct warm light pools,
crystal chandeliers, antique gold music-staff filigree, blue-black night visible through tall train windows,
protagonist and party at the center with conductor baton raised, Atya with purple hair and golden musical-note eyes, Milo with ash-blue hair and knight silhouette,
a tall elegant conductor silhouette far ahead beneath a massive black pipe organ,
gothic classical music fantasy, high saturation anime game illustration, rich but readable lighting, not ruined, not collapsed
```

追加负面词：使用 0.3。

### 2.2 列车走廊背景

```text
wide visual novel background, intact black lacquer opera train corridor at night,
glossy black structural arches, deep crimson velvet carpet and side curtains, antique gold filigree on window frames,
warm candlelight pools reflected on polished lacquer floor, crystal chandeliers evenly spaced,
blue-black rushing night landscape visible through windows, central walkway reserved for character standing sprites,
clean readable architecture, elegant and unsettling, no rubble, no collapsed train, no dirty ruin
```

### 2.3 观众席车厢背景

```text
wide visual novel background, intact audience car inside an endless opera train,
rows of deep crimson velvet theater seats, motionless pale Musicart figures seated in frozen mid-applause posture,
gilded mirror walls multiplying the seats into false infinity, old projection screen at far end,
warm candlelight and chandelier highlights, black lacquer floor glossy and clean,
melancholic theatrical atmosphere, not a ruined theater, not a destroyed train, no gore, no rubble
```

### 2.4 核心管风琴车厢背景

```text
wide boss arena background, intact grand black lacquer train chamber,
massive black pipe organ installed at the far wall, organ pipes polished and ceremonial, not broken rubble,
deep crimson velvet drapery, antique gold filigree, crystal chandeliers, warm candlelight reflected on glossy black floor,
central open arena space for final boss battle, oppressive but beautiful, high saturation anime game background,
no collapsed architecture, no industrial ruin, no monochrome black
```

### 2.5 零四救赎 CG

```text
emotional anime game CG, Atya kneeling beside Sequence-04 in the audience car,
Atya's golden musical-note pupils and violet-crimson rose-petal eyeshadow clearly visible,
Sequence-04's hollow silver-grey eyes slowly filling with fragile warm golden cracks of light,
Milo and protagonist watching supportively nearby, deep crimson velvet seats and black lacquer walls behind them,
warm candlelight pools, bittersweet rescue atmosphere, no horror gore, no corpse-like zombie, no dark ruin
```

### 2.6 清晨停靠结尾 CG

```text
anime dawn aftermath scene, the black lacquer opera train finally stopped in a quiet open field at sunrise,
train exterior intact but silent, no longer performing, rescued pale Musicart figures gently helped down by protagonist's group,
soft warm morning light replacing candlelit night, black lacquer surfaces reflecting dawn gold,
hopeful bittersweet ending, not wreckage, not explosion aftermath, not battlefield ruin
```

---

## 3. 第四章敌方战斗素材提示词追加规则

敌方素材如果用于 chroma-key 抠图，仍应保留“角色明亮可读”，避免抠出后变成黑团。

```text
character must remain readable after background removal,
use rim light and ivory / antique gold highlights to separate black costume from transparent background,
do not let black lacquer costume merge into a single dark silhouette,
face and weapon must be visible at thumbnail size,
no background props except explicitly requested silhouette halos,
no floor plane, no cast shadow, no smoky dark aura covering body outline
```

战斗素材专用负面词：

```text
negative prompt:
unreadable black silhouette, crushed black costume, face hidden by shadow, dark smoke covering body,
ruined background, rubble, horror gore, generic demon, muddy edges, low contrast, low saturation,
cropped weapon, cropped feet, unreadable text, watermark, logo, green pixels on subject
```

---

## 4. 出图后检查清单

1. 画面是否能看出“完整华丽歌剧列车”，而不是“黑色废墟”？
2. 黑色是否是“黑漆反光”，而不是“纯黑死块”？
3. 绯红座椅/帷幕是否和黑漆结构清楚分离？
4. 是否有烛光、水晶灯、古金细工提供可读性？
5. 人物脸部是否清楚？眼睛是否没有被阴影吞掉？
6. 阿缇娅的金色音符瞳、红紫眼影、眼下五线谱痕是否存在？
7. 零四是否是“被救回中的脆弱律者”，不是丧尸/尸体/鬼怪？
8. 战斗敌人是否能在小图中读清轮廓、脸和武器？
9. 是否出现 rubble / wasteland / ruined city / collapsed train 等错误元素？若出现，整张弃用。

---

## 5. 一句话总锚点

```text
第四章不是黑废墟；它是一列完整、华丽、过度保养、永不谢幕的黑漆绯红歌剧列车。恐怖感来自“演出不该继续却仍被强行维持”，不是来自破败、脏乱和塌毁。
```
