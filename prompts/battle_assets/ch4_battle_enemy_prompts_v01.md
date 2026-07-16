# 第四章战斗敌方素材提示词 v02（2026-07-10 加固版）

本文件用于生成第四章《不夜终响》专用战斗敌方素材。v02 已按第四章统一美术规则加固：**黑漆绯红歌剧列车不是黑色废墟**；敌方角色必须在小图和透明 PNG 中保持脸、服装、武器与轮廓可读。

配套总规则：`prompts/chapter4/ch4_visual_asset_prompt_system_v02.md`

---

## 使用规则

- 输出先作为 chroma-key 源图，再用 `remove_chroma_key.py` 导出透明 PNG。
- 不要把低清、绿边或已抠坏的旧图作为二次参考。
- 不要在画面里生成保存名、UI 文本、水印或 logo。
- 黑色服装必须靠 ivory / antique gold / crimson rim light 与透明背景分离，不允许抠出后变成一团黑影。
- 本章敌方不是废墟怪物；他们属于“完整、华丽、过度维护的不夜歌剧列车”视觉系统。

---

## 共通正向硬规则

```text
high-quality 2D anime game battle sprite, polished gacha-style character art,
classical music fantasy, gothic opera costume design, clean readable silhouette,
face clearly visible, eyes readable, costume details readable, weapon fully visible,
black costume parts must have glossy lacquer highlights, ivory highlights, antique gold trim, and crimson rim light,
no crushed blacks, no unreadable black silhouette, no flat dark void,
character remains readable after background removal, full body centered with generous padding,
not a ruined monster, not a zombie, not a generic demon, not a post-apocalyptic design
```

## 共通负面词

```text
negative prompt:
readable text, watermark, logo, signature, gray checkerboard transparency pattern, white checkerboard transparency pattern,
floor plane, cast shadow, background scenery, cropped body, cropped feet, cropped weapon, cut off weapon,
blurry face, hidden face, eyes covered by shadow, low detail, muddy edges, green pixels on subject,
unreadable black silhouette, crushed black costume, monochrome black image, pure dark ruin,
rubble, destroyed train, collapsed architecture, dirty industrial ruin, abandoned wasteland,
post-apocalyptic debris, muddy shadows, muddy reddish-brown color blending, low saturation,
horror gore, zombie, photorealistic horror, generic faceless mob, chibi proportions
```

---

## 岐岚组合战

保存路径：
- 源图：`assets/generated/chapter4/sprites/enemies/enemy_ch4_qilan_duo_source_v01.png`
- 透明图：`assets/generated/chapter4/sprites/enemies/enemy_ch4_qilan_duo_sprite_default_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: chroma-key source image for a transparent-background enemy battle sprite in a visual-novel RPG
Primary request: Create a full-body anime game enemy sprite of two coordinated antagonist Musicarts, named Qi and Lan, for the Nightless Finale chapter.

Scene/backdrop: the entire canvas background must be one perfectly flat solid #00ff00 green color. This is a green screen source image for background removal. No checkerboard pattern, no shadows, no floor plane, no gradients, no texture, no scenery.

Subject identity lock: Qi and Lan are two coordinated female antagonist Musicarts from an intact luxurious opera train, not ruined monsters. One has sharp black-red conductor ribbons and a thin rapier-like baton; the other has pale gold thorn-string armor and a crescent bow made of broken staff lines. They wear matching black lacquer and deep crimson opera-train uniforms with antique gold music-staff embroidery. Not school uniforms, not casual clothes, not identical twins. Their faces must be clear and distinct.

Style/medium: high-detail anime game battle sprite, polished gacha character art, theatrical gothic opera, classical music fantasy, clean silhouette, full body.

Composition/framing: both figures visible head to toe, centered together with generous padding, dynamic but readable combat pose, both weapons fully inside canvas.

Lighting/mood: dramatic but readable character rim light only; black costume areas must show glossy lacquer highlights, ivory highlights, antique gold trim, and crimson rim light; no cast shadow on background.

Color palette: glossy black lacquer, vivid wine red / deep crimson, antique gold, ivory highlights, tiny violet dissonance sparks; keep black and crimson clearly separated, no muddy reddish-brown blending.

Constraints: crisp edges for cutout, face and weapons readable at thumbnail size, no readable text, no watermark, no logo, do not use #00ff00 anywhere in the subject, no floor, no background props, no rubble, no ruined train.

Negative prompt: readable text, watermark, logo, signature, checkerboard transparency pattern, floor plane, cast shadow, background scenery, cropped body, cropped feet, cropped weapon, blurry face, hidden face, unreadable black silhouette, crushed black costume, monochrome black image, pure dark ruin, rubble, destroyed train, collapsed architecture, dirty industrial ruin, abandoned wasteland, post-apocalyptic debris, muddy shadows, muddy reddish-brown color blending, low saturation, horror gore, zombie, generic faceless mob, chibi proportions, green pixels on subject
```

---

## 瑟萝弥最终战

保存路径：
- 源图：`assets/generated/chapter4/sprites/enemies/boss_ch4_seluomi_final_source_v01.png`
- 透明图：`assets/generated/chapter4/sprites/enemies/boss_ch4_seluomi_final_sprite_default_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: chroma-key source image for a transparent-background boss battle sprite in a visual-novel RPG
Primary request: Create a full-body anime game boss sprite of Seluomi in her final battle form, a conflicted gothic holy-opera antagonist.

Scene/backdrop: the entire canvas background must be one perfectly flat solid #00ff00 green color. This is a green screen source image for background removal. No checkerboard pattern, no shadows, no floor plane, no gradients, no texture, no scenery.

Subject identity lock: Seluomi / 瑟萝弥 final battle form, elegant female boss in black-and-white gothic nun battle dress fused with dark red opera armor, torn sheet-music veil, thorn-vine embroidery, wilted white rose at the chest, glowing golden stave-line blindfold over the eyes, crimson lower-eye shadow, cross-shaped lance, a few small floating organ-pipe halos behind her shoulders. She is a tragic faith-shaken antagonist, not a cartoon villain and not a monsterized ruin creature.

Style/medium: high-detail anime game boss sprite, polished gacha character art, theatrical gothic opera, classical music fantasy, full body, clean silhouette.

Composition/framing: one figure only, full body, centered, lance angled diagonally but fully inside canvas, generous padding around veil, lance, and organ-pipe halos.

Lighting/mood: tragic final duel, restrained holy aura, readable character rim light only; black dress areas must retain visible folds and gold linework; face and lower-eye makeup must be readable; no cast shadow on background.

Color palette: ivory white, glossy black, antique gold, dark crimson, faint violet dissonance sparks; keep white veil and black armor separated, avoid flat black.

Constraints: crisp cutout edges, face readable, eye/blindfold design readable, no readable text, no watermark, no logo, do not use #00ff00 anywhere in the subject, no floor, no background props, no rubble, no ruined train.

Negative prompt: readable text, watermark, logo, signature, checkerboard transparency pattern, floor plane, cast shadow, background scenery, cropped body, cropped feet, cropped lance, blurry face, hidden face, unreadable black silhouette, crushed black costume, monochrome black image, pure dark ruin, rubble, destroyed train, collapsed architecture, dirty industrial ruin, abandoned wasteland, post-apocalyptic debris, muddy shadows, low saturation, horror gore, zombie, generic demon, exaggerated cartoon villain expression, chibi proportions, green pixels on subject
```

---

## 卡戎管风琴终战

保存路径：
- 废弃源图：`assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_source_v01.png`
- 正式源图：`assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_source_v02.png`
- 透明图：`assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_sprite_default_v01.png`

提示词：

```text
Use case: stylized-concept
Asset type: chroma-key source image for a transparent-background final boss battle sprite in a visual-novel RPG
Primary request: Create one full-body anime game final boss sprite of Charon, the conductor of the Nightless opera train, fused with a black pipe-organ resonance core.

Scene/backdrop: the entire canvas background must be one perfectly flat solid #00ff00 green color. This is a green screen source image for background removal. No checkerboard transparency pattern, no white or gray checker pattern, no shadows, no floor plane, no gradients, no texture, no scenery.

Subject identity lock: Charon / 卡戎, tall elegant male conductor boss, black long-tailed opera coat with crimson velvet lining, antique gold music-staff embroidery, pale porcelain half-mask cracked like a metronome face, black-gold conductor baton raised. Behind him is a compact halo of broken pipe-organ tubes and gear-like metronome pieces fused into his silhouette. He must remain readable as an elegant conductor and broken researcher, not a generic demon and not a ruined-machine monster. A tired real human face is partially visible beneath the theatrical mask.

Style/medium: high-detail anime game final boss sprite, polished gacha character art, gothic opera train conductor, classical music fantasy, clean silhouette, full body.

Composition/framing: one figure only, full body centered, baton and compact organ halo fully inside canvas with generous padding; organ halo must not become a huge background scene.

Lighting/mood: cold final confrontation but readable; black-gold theatrical rim light, crimson dissonance glow in cracks, ivory porcelain mask highlights; black coat must show folds, gold embroidery, and edge highlights, not merge into a black blob.

Color palette: glossy black lacquer, deep crimson velvet lining, antique gold embroidery, ivory porcelain mask, subtle violet-black corruption; keep black, crimson, gold, and ivory separated, no muddy reddish-brown blending.

Constraints: crisp edges for cutout, face/mask readable at thumbnail size, baton readable, no readable text, no watermark, no logo, no floor, no background props, no gore, no rubble, no ruined train, do not use #00ff00 anywhere on the character.

Negative prompt: readable text, watermark, logo, signature, checkerboard transparency pattern, floor plane, cast shadow, background scenery, cropped body, cropped feet, cropped baton, blurry face, hidden face, unreadable black silhouette, crushed black costume, monochrome black image, pure dark ruin, rubble, destroyed train, collapsed architecture, dirty industrial ruin, abandoned wasteland, post-apocalyptic debris, muddy shadows, muddy reddish-brown color blending, low saturation, horror gore, zombie, generic demon, massive background pipe-organ scenery, chibi proportions, green pixels on subject
```
