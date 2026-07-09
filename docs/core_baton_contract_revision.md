# 核心修正：指挥棒与奏者契约规则

## 0.1 指挥棒规则

主角开局没有指挥棒。

指挥棒不是普通随身武器，也不是主角一开始就拿在手里的道具。指挥棒来自律者觉醒瞬间。

当普通人濒死、吊坠/谱核/乐曲残响启动，身体转化为律者 Musicart 时，律者体内会凝聚出一支指挥棒。这支指挥棒会被律者交给、抛给、甚至强行塞给主角。

主角接住指挥棒的瞬间，右腕出现契约刻痕，指挥家身份成立。从那一刻开始，主角才能指挥律者战斗。

## 剧情表现标准

- 缇雅濒死。
- 白色吊坠碎裂。
- 她变身为律者“阿缇娅 · 暮星序曲”。
- 变身完成后，阿缇娅手中出现一支黑金色指挥棒。
- 她不是温柔地递给主角，而是在战火中直接把指挥棒抛向主角。
- 主角本能接住。
- 指挥棒落入掌心的一瞬间，金色谱线从掌心刺入右腕，像烧红的五线谱刻进皮肤。

## 系统提示标准

```text
指挥权限建立。
奏者契约成立。
律者技能释放将消耗指挥家健康值。
```

## 维护用稳定元素

- 主角不能在契约成立前持有指挥棒。
- 黑金色指挥棒必须由觉醒后的律者抛出、交出或强制转移。
- 右腕契约刻痕是指挥家身份成立的视觉证据。
- 律者技能消耗“奏者健康”，不是无代价施法。
- 该规则适用于后续所有律者觉醒场景。

## 已生成资产

- `assets/generated/backgrounds/cg_atiya_baton_contract_v01.png`
- `assets/generated/characters/char_protagonist_initial_traveler_v01.png`

## 0.2 主角服装修正

主角开局不能像已经成型的华丽指挥家。主角应该是一个还没准备好被命运推上舞台的普通人。

主角初始形象必须保持简单、干净、轻便、偏日常旅行感。不要长风衣，不要大披风，不要过度华丽礼服，不要复杂军装，不要一开始就像高级指挥官。

主角应该像一个会弹琴、会修谱、会在旅途中帮忙搬东西的少年/少女，突然被律者选中，被迫成为指挥家。

主角真正的“指挥家感”不靠衣服堆出来，而是靠以下视觉证据：

- 右腕契约刻痕。
- 接住指挥棒的手。
- 战斗时痛到发抖却不松开的动作。
- 看见钢琴时无法移开视线的表情。

## 主角初始服装稳定元素

- 轻便短外套、开衫或实用旅行夹克，长度不过膝。
- 干净衬衫或内搭，不使用礼服胸饰和军装肩章。
- 便于行走和搬运物资的裤装或轻便裙裤。
- 舒适步行鞋，不使用舞台长靴或军靴指挥官化设计。
- 小型挎包、修谱工具、乐谱卷、音乐笔记本等日常职业线索。
- 契约成立后可露出右腕五线谱刻痕；契约成立前不能有指挥棒。
- 色彩以暖白、灰、 muted navy、旧皮革棕为主体，金色只用于契约刻痕或极小音乐符号。

## 主角初始服装禁用项

- 长风衣。
- 大披风。
- 高级指挥家燕尾服。
- 过度华丽礼服。
- 复杂军装。
- 肩章、勋章、王冠、权杖。
- 开局持有指挥棒。
- 一眼看上去已经是成熟指挥官的姿态。

## 资产提示词

```text
Use case: illustration-story
Asset type: visual novel event CG for a music-fantasy gacha game prologue
Primary request: a decisive transformation-and-contract moment: a dying ordinary girl named Tiya has just awakened as the Musicart "Atiya, Twilight Star Overture" and throws a black-and-gold conductor baton toward the protagonist; the protagonist's hand catches it in the foreground as golden staff-line marks burn into the right wrist.
Scene/backdrop: ruined white-gold opera plaza at night under battle fire, fractured marble, floating sheet-music particles, distant silent lanterns, no readable signs.
Subject: foreground right hand catching a slim black-and-gold conductor baton; golden five-line musical staff energy pierces from palm into wrist forming a contract scar; midground Atiya as a newly awakened young female Musicart with twilight star motifs, white pendant fragments, black ivory and deep gold costume accents, dramatic but not revealing, elegant battle silhouette.
Style/medium: high-saturation anime game event CG, premium visual novel illustration, white-gold opera fantasy mixed with restrained post-apocalyptic music fantasy, cinematic detail.
Composition/framing: 16:9 landscape, dynamic diagonal baton flight from midground to foreground, protagonist face not visible, Atiya visible but not too close, enough negative space at lower area for dialogue UI.
Lighting/mood: explosive gold contract light, cool night shadows, solemn and urgent, beautiful transformation under danger.
Color palette: ivory white, champagne gold, black lacquer, deep twilight blue, small red-orange battle sparks.
Materials/textures: polished black baton with gold inlay, cracked marble, glowing musical staff lines, shattered white pendant crystal, silk and metal costume details.
Constraints: no readable text, no logos, no watermark, no gore, no modern guns, no male/female protagonist face, no extra baton already held by protagonist before the catch, no idol stage microphone.
Avoid: cute comedy tone, dark grunge-only palette, cyberpunk neon city, cluttered UI, duplicated hands, malformed baton.
```

## 主角初始服装资产提示词

```text
Use case: stylized-concept
Asset type: game character concept sheet for protagonist initial outfit
Primary request: initial protagonist design for a music-fantasy visual novel: an ordinary teenage traveler who can play piano, repair sheet music, and help carry supplies, suddenly chosen by a Musicart and forced to become a conductor. The character must look unprepared for destiny, not like an established grand conductor.
Scene/backdrop: clean white-gold opera fantasy concept sheet background, subtle pale staff-line motif, no readable labels.
Subject: androgynous young protagonist full-body, simple clean lightweight travel outfit, short practical jacket or cardigan, plain shirt, fitted travel trousers, comfortable walking shoes, small shoulder satchel with rolled sheet music and tuning tools, a compact music notebook, right wrist visible with a faint golden contract scar shaped like five staff lines; one hand still tense as if recently caught a baton, but no baton visible.
Style/medium: high-saturation anime game character design, premium visual novel protagonist reference, white-gold opera fantasy blended with restrained post-apocalyptic travel practicality, clean silhouette, production concept art.
Composition/framing: front three-quarter full body, neutral standing pose with slight uncertainty, one small inset close-up of the right wrist contract mark and trembling hand, no text.
Lighting/mood: soft clear studio lighting, calm but burdened, ordinary person at the moment before becoming important.
Color palette: warm off-white, muted navy, soft gray, worn leather brown, small champagne-gold glow only on wrist scar.
Materials/textures: cotton shirt, lightweight canvas jacket, simple leather satchel, paper sheet music rolls, brass repair clips, no luxury embroidery except tiny practical music motif.
Constraints: no long coat, no cape, no grand conductor uniform, no ornate formalwear, no complex military outfit, no epaulettes, no baton, no weapon, no crown, no idol costume, no readable text, no logo, no watermark.
Avoid: looking like a senior commander, excessive jewelry, giant cloak, fantasy armor, cyberpunk neon, dark grunge-only palette, overdesigned costume, dramatic heroic pose.
```
