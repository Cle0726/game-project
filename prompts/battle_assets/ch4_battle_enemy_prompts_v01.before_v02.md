# 第四章战斗敌方素材提示词（2026-07-10）

## 使用规则

- 这些提示词用于生成第四章专用战斗系统敌方素材。
- 输出先作为 chroma-key 源图，再用 `remove_chroma_key.py` 导出透明 PNG。
- 不要把低清、绿边或已抠坏的旧图作为二次参考。
- 不要在画面里生成保存名、UI 文本、水印或 logo。

## 共通负面词

```text
readable text, watermark, logo, signature, gray checkerboard transparency pattern, white checkerboard transparency pattern, floor plane, cast shadow, background scenery, cropped body, cut off weapon, blurry face, low detail, muddy edges, green pixels on subject
```

## 岐岚组合战

保存路径：

- 源图：`assets/generated/chapter4/sprites/enemies/enemy_ch4_qilan_duo_source_v01.png`
- 透明图：`assets/generated/chapter4/sprites/enemies/enemy_ch4_qilan_duo_sprite_default_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: transparent-background enemy battle sprite for a visual-novel RPG
Primary request: Create a full-body anime game enemy sprite of two coordinated antagonist Musicarts, named Qi and Lan, for a dark gothic opera train battle.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal; no shadows, no floor plane, no gradients, no texture.
Subject: two elegant female combatants standing as a duo, one with sharp black-red conductor ribbons and a thin rapier-like baton, the other with pale gold thorn-string armor and a crescent bow of broken staff lines; both wear black lacquer and deep crimson opera-train uniforms with gold music staff embroidery, not school uniforms.
Style/medium: high-detail anime game battle sprite, theatrical gothic opera, polished character concept art, full body, clean silhouette.
Composition/framing: both figures visible head to toe, centered together with generous padding, dynamic but readable combat pose.
Lighting/mood: dramatic rim light on characters only, no cast shadow on background.
Color palette: black lacquer, wine red, antique gold, ivory highlights, tiny violet dissonance sparks.
Constraints: crisp edges for cutout, no readable text, no watermark, no logo, do not use #00ff00 anywhere in the subject, no floor, no background props.
```

## 瑟萝弥最终战

保存路径：

- 源图：`assets/generated/chapter4/sprites/enemies/boss_ch4_seluomi_final_source_v01.png`
- 透明图：`assets/generated/chapter4/sprites/enemies/boss_ch4_seluomi_final_sprite_default_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: transparent-background boss battle sprite for a visual-novel RPG
Primary request: Create a full-body anime game boss sprite of Seluomi in her final battle form, a conflicted gothic holy-opera antagonist.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal; no shadows, no floor plane, no gradients, no texture.
Subject: elegant female boss in black-and-white gothic nun battle dress fused with dark red opera armor, torn sheet-music veil, thorn-vine embroidery, wilted white rose at the chest, glowing golden stave-line blindfold over the eyes, crimson lower-eye shadow, cross-shaped lance, a few small floating organ-pipe halos behind her shoulders.
Style/medium: high-detail anime game boss sprite, theatrical gothic opera, polished full-body concept art, clean silhouette.
Composition/framing: full body, centered, one figure only, lance angled diagonally but fully inside canvas, generous padding.
Lighting/mood: tragic final duel, restrained holy aura, character rim light only, no cast shadow on background.
Color palette: ivory white, black, antique gold, dark crimson, faint violet dissonance sparks.
Constraints: crisp cutout edges, no readable text, no watermark, no logo, do not use #00ff00 anywhere in subject, no floor, no background props.
```

## 卡戎管风琴终战

保存路径：

- 废弃源图：`assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_source_v01.png`
- 正式源图：`assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_source_v02.png`
- 透明图：`assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_sprite_default_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: chroma-key source image for a final boss battle sprite
Primary request: Create one full-body anime game final boss sprite of Charon, the conductor of an endless dark opera train, fused with a black pipe-organ resonance core.
Scene/backdrop: the entire canvas background must be one perfectly flat solid #00ff00 green color. This is a green screen source image. No checkerboard transparency pattern, no white or gray checker pattern, no shadows, no floor plane, no gradients, no texture.
Subject: tall elegant male conductor boss, black long-tailed opera coat with crimson velvet lining, antique gold music staff embroidery, pale porcelain half-mask cracked like a metronome face, black-gold conductor baton raised, behind him a compact halo of broken pipe-organ tubes and gear-like metronome pieces fused into his silhouette.
Style/medium: high-detail anime game final boss sprite, gothic opera train conductor, polished full-body concept art, clean silhouette.
Composition/framing: one figure only, full body centered, baton and organ halo fully inside canvas with generous padding.
Lighting/mood: cold final confrontation, black-gold theatrical rim light, crimson dissonance glow in cracks.
Color palette: black lacquer, deep crimson, antique gold, ivory porcelain, subtle violet-black corruption.
Constraints: crisp edges for cutout, no readable text, no watermark, no logo, no floor, no background props, no gore. Do not use #00ff00 anywhere on the character.
```
