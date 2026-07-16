# Battle Enemy Supplement Prompts v01

生成日期：2026-07-10

用途：补齐第一章到第三章战斗系统中复用图、白底图、整张背景框图的问题。所有正式 sprite 均采用“纯色绿幕源图 + 本地去绿底”的流程生成，不使用旧坏图做图生图参考。

## 通用规则

- 画面用途：视觉小说 / RPG 战斗 HUD 敌方 sprite。
- 风格：高质量 2D anime game concept art，黑金、暗红、冰蓝、白谱院象牙色等章节调性。
- 背景：`perfectly flat solid #00ff00 chroma-key background`。
- 约束：背景必须纯色，无地面、阴影、渐变、纹理、反射；主体不要使用绿色；无文字、无水印。
- 输出：先保存 `*_source_v*.png`，再通过 `remove_chroma_key.py` 导出透明 `*_sprite_default_v*.png`。

## ch1EchoPatrol

```text
Use case: stylized-concept
Asset type: visual novel battle enemy sprite, transparent cutout workflow source
Primary request: Create a high-quality full-body enemy sprite for “第一章｜回声巡查员”, a forbidden-music patrol officer used in a dark fantasy anime battle UI.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal.
Subject: a slim masked patrol officer in torn black-and-red long coat, brass badge fragments, rain-wet boots, silent metronome baton, echo rings and broken staff-like weapons around the hands; not the same as a commander boss, more like a patrol unit.
Style/medium: premium 2D anime game concept art, crisp silhouette, detailed gothic musical ornamentation, black gold crimson palette.
Composition/framing: full body, standing 3/4 view, centered, generous padding, no crop, readable at small size.
Lighting/mood: dramatic rim light, ominous mist contained only on subject edges, no cast shadow.
Color palette: black, dark burgundy, antique gold, dim violet highlights; do not use green in the subject.
Constraints: background must be one uniform #00ff00 with no gradients, no floor, no shadows, no texture, no reflections. Subject fully separated from background with crisp edges. No text, no watermark.
```

## ch1FogHowler

```text
Use case: stylized-concept
Asset type: visual novel battle enemy sprite, transparent cutout workflow source
Primary request: Create a high-quality full-body enemy sprite for “第一章｜雾啸者”, a fogborne dissonance creature for a dark fantasy anime battle UI.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal.
Subject: a tall semi-bestial fog wraith, not a dog and not a wolf; elongated torso made of torn station fog, rib-like brass tuning forks, hollow lantern eyes, cracked railway signal mask, trailing sheet-music mist, clawed forelimbs hovering slightly above ground.
Style/medium: premium 2D anime game concept art, crisp readable silhouette, gothic musical horror, elegant not grotesque.
Composition/framing: full body, 3/4 side view, centered, generous padding, no crop, large readable shape for battle HUD.
Lighting/mood: cold violet rim light and dim gold eye glow, eerie station fog contained inside subject only, no cast shadow.
Color palette: ash gray, smoky violet, antique brass, pale gold highlights; do not use green in the subject.
Constraints: background must be one uniform #00ff00 with no gradients, no floor, no shadows, no texture, no reflections. Subject fully separated from background with crisp edges. No text, no watermark.
```

## ch2FrozenResidual

```text
Use case: stylized-concept
Asset type: visual novel battle enemy sprite, transparent cutout workflow source
Primary request: Create a high-quality enemy sprite for “第二章｜冰封残奏”, a small swarm/support enemy beside the Scoreheart Guardian.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal.
Subject: a cluster of frozen residual music spirits: three floating shard-creatures made of translucent ice, broken violin ribs, tiny metronome cores, frost staff fragments, pale blue sheet-music ribbons; compact swarm silhouette, clearly not a humanoid boss.
Style/medium: premium 2D anime game concept art, elegant crystalline fantasy, detailed but readable at small HUD size.
Composition/framing: group sprite, centered, generous padding, no crop, diagonal floating arrangement.
Lighting/mood: cold moonlit blue rim light, faint internal glow inside ice, no cast shadow.
Color palette: ice blue, white, silver, pale violet, tiny antique gold accents; do not use green in the subject.
Constraints: background must be one uniform #00ff00 with no gradients, no floor, no shadows, no texture, no reflections. Subject fully separated from background with crisp edges. No text, no watermark.
```

## ch2ScoreheartGuardian

```text
Use case: stylized-concept
Asset type: visual novel boss battle enemy sprite, transparent cutout workflow source
Primary request: Create a high-quality boss sprite for “第二章｜谱心监守者”, an automatic frozen score-core guardian.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal.
Subject: a floating ice-and-brass organ guardian, no human face; circular crystalline core like a frozen heart, pipe-organ ribs, rotating score rings, suspended tuning forks and sharp ice wings, elegant symmetrical boss silhouette.
Style/medium: premium 2D anime game boss concept art, ornate gothic musical machinery, high detail but clean cutout edges.
Composition/framing: full boss body, frontal 3/4 view, centered, generous padding, no crop, imposing but readable at battle HUD size.
Lighting/mood: cold blue-white glow from core, thin antique gold highlights, solemn cathedral frost mood, no cast shadow.
Color palette: ice blue, silver white, dark navy shadows, antique brass, pale violet; do not use green in subject.
Constraints: background must be one uniform #00ff00 with no gradients, no floor, no shadows, no texture, no reflections. Subject fully separated from background with crisp edges. No text, no watermark.
```

## ch3HallGuard

```text
Use case: stylized-concept
Asset type: visual novel battle enemy sprite, transparent cutout workflow source
Primary request: Create a high-quality group enemy sprite for “第三章｜礼堂卫队”, formal White Score Institute hall guards used as support enemies in a hearing battle.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal.
Subject: two elegant uniformed hall guards standing as a coordinated unit, ivory-and-black long coats, thin ceremonial score spears, white masks with small brass staff lines, restrained posture, institutional not monstrous.
Style/medium: premium 2D anime game concept art, gothic academy military design, clean refined silhouette, detailed costume edges.
Composition/framing: two-person group sprite, full body, centered, generous padding, no crop, readable as a support-unit enemy.
Lighting/mood: cool courtroom spotlight rim light, restrained tension, no cast shadow.
Color palette: ivory, charcoal black, antique gold, muted crimson seals; do not use green in the subject.
Constraints: background must be one uniform #00ff00 with no gradients, no floor, no shadows, no texture, no reflections. Subject fully separated from background with crisp edges. No text, no watermark.
```
