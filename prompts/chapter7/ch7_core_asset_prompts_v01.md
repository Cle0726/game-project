# 第七章《谱变余响》核心素材提示词 v01

## 生成原则

- 章节基调：白谱院内部政变、登记制度改革、白昼庄严与暗夜暗流的双重学院。
- 视觉关键词：白色大理石、金色学院纹样、彩绘玻璃、行政礼堂、夜间应急灯、联署文件、表决大会。
- 冲突重点：不是传统 Boss，而是证据保卫、监察队分裂、表决结果。
- 透明敌方素材：礼堂卫队使用绿幕源图，再通过 chroma-key 去背景，不要直接把绿幕源图接入游戏。

## 已生成并接入素材

### 第七章主视觉

文件：`assets/generated/chapter7/keyvisuals/cg_ch7_academy_reform_hearing_key_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: visual novel chapter key visual / chapter entry cover
Primary request: Chapter VII "谱变余响" key visual for a visual novel game.
Scene/backdrop: grand white-marble academy hearing chamber divided visually between conservative and reformist factions, colorful stained-glass light falling across the split hall, gothic-academic fusion architecture, gold filigree, formal desks and voting documents.
Subject: at the center stand a purple-haired Musicart girl Atiya and a recovering pale Musicart Sequence-04 preparing to speak; on one side an elderly conservative bureaucrat and stern senior administrator, on the other an elderly reformist professor with cane and young researchers.
Style/medium: polished high-saturation anime game key art, painterly detail, cinematic composition.
Composition/framing: wide 16:9, strong central aisle, symmetrical institutional tension, no UI.
Lighting/mood: solemn, tense, ideological divide, stained-glass daylight with dramatic gold-white highlights.
Constraints: no readable text, no watermark, no logo, clean faces, consistent anime visual novel art quality.
```

### 白谱院夜间暗流背景

文件：`assets/generated/chapter7/backgrounds/bg_ch7_white_score_night_hall_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: visual novel background
Primary request: 白谱院夜间暗流场景 background for Chapter VII.
Scene/backdrop: the same grand white-marble academy hall at night, gothic-academic fusion architecture, gold filigree, tall stained-glass windows now dark, old disused music practice room entrance visible on one side, petition documents being passed hand to hand.
Subject: no main characters, only small distant silhouettes of students and faculty whispering in clusters, suitable for dialogue scene background.
Style/medium: high-saturation anime visual novel background, painterly, detailed architecture.
Composition/framing: wide 16:9, plenty of clear foreground/midground space for UI and character sprites, no close-up faces.
Lighting/mood: dim emergency lamps, pools of warm lamplight against dark marble, secretive tense atmosphere.
Constraints: no readable text, no watermark, no logo, no UI, no modern electronics.
```

### 行政大礼堂表决背景

文件：`assets/generated/chapter7/backgrounds/bg_ch7_admin_hearing_chamber_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: visual novel background / battle background
Primary request: 白谱院行政大礼堂 daytime voting chamber background for Chapter VII.
Scene/backdrop: grand white-marble academy administrative hearing hall, gothic-academic fusion architecture, gold filigree, tall stained-glass windows, formal speaker podium, two faction seating areas, voting documents and seal table.
Subject: empty room or only tiny indistinct seated silhouettes far in background, no main characters, suitable for dialogue and voting scenes.
Style/medium: polished anime visual novel background, painterly, high detail.
Composition/framing: wide 16:9, central aisle and podium, clear foreground space for character sprites and UI.
Lighting/mood: solemn daylight, stained-glass beams, institutional grandeur and tension.
Constraints: no readable text, no watermark, no logo, no UI.
```

### 白谱院礼堂卫队敌方素材

源图：`assets/generated/chapter7/sprites/enemies/enemy_ch7_academy_guard_source_v01.png`

透明图：`assets/generated/chapter7/sprites/enemies/enemy_ch7_academy_guard_sprite_default_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: transparent-background enemy sprite source
Primary request: academy hall security guard enemy group for Chapter VII evidence defense battle.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal. The background must be one uniform color with no shadows, gradients, texture, floor plane, reflections, or lighting variation.
Subject: two formal white-and-gold academy security guards at night, adult human guards, non-lethal restraining weapons and batons held with visible hesitation, conflicted rather than cruel, elegant white marble academy uniform design with gold trim and dark capes, readable combat silhouettes.
Style/medium: high-resolution anime visual novel battle sprite, painterly but clean edges.
Composition/framing: full-body pair sprite, front three-quarter standing poses, generous padding, no cropped limbs.
Lighting/mood: tense morally ambiguous confrontation, restrained and disciplined.
Constraints: do not use #00ff00 anywhere in the subject, no cast shadow, no contact shadow, no text, no watermark, no logo.
```
