# 主角设定

## 1.1 玩家身份

| 项目 | 设定 |
|---|---|
| 身份 | 奏者 / 指挥家 |
| 性别 | 玩家可选男 / 女 |
| 年龄感 | 17—19 岁 |
| 开局身份 | 流动修理车队“昼夜巡演团”的随行者 |
| 擅长 | 看谱、调音、简单弹奏、修理旧乐器 |
| 核心命运 | 被律者阿缇娅抛出的指挥棒选中 |
| 身体代价 | 每次指挥律者释放技能，都会消耗健康值 |
| 主线目标 | 前往白谱院，寻找异常契约和律者状态的真相 |

主角不是天生英雄。主角一开始只是一个还记得音乐的人。

在静默纪元里，很多人已经习惯没有音乐。他们觉得安静就是安全。他们觉得不弹琴、不唱歌、不听旋律，就不会失去更多。

但主角不行。

主角从小就听过母亲修琴时发出的微弱声音。那声音很小，甚至不像音乐。可它让主角知道，世界本来不是这样的。

所以主角对音乐有一种很矛盾的感情：

```text
主角爱音乐。
主角也害怕音乐。
主角知道音乐会引来噬响体。
主角也知道，如果音乐彻底消失，人就真的只剩下活着而已。
```

## 已接入剧情

- `game.js` 新增 `prologue_origin`：昼夜巡演团开局场景。
- 新游戏入口从 `prologue_origin` 开始，再进入原有 `prologue_01` 广场事件。
- 场景会写入 `开局身份 = 昼夜巡演团随行者` 与 `主线目标 = 前往白谱院，寻找异常契约和律者状态的真相`。

## 已生成资产

- `assets/generated/backgrounds/bg_daynight_touring_troupe_repair_convoy_v01.png`
- `assets/generated/characters/char_protagonist_initial_traveler_v01.png`
- `assets/generated/characters/char_protagonist_rinche_male_default_v01.png`
- `assets/generated/characters/char_protagonist_rinsa_female_default_v01.png`
- `assets/generated/characters/char_protagonist_rinsa_pre_contract_v01.png`
- `assets/generated/characters/char_protagonist_rinsa_baton_catch_v01.png`
- `assets/generated/characters/char_protagonist_rinsa_battle_conductor_v01.png`
- `assets/references/protagonists/ref_rinche_face_outfit_lock_v01.png`
- `assets/references/protagonists/ref_rinsa_face_outfit_lock_v01.png`

## 主角参考母版锁定

以后所有主角相关图片，优先使用以下两张作为面部与服装一致性母版：

- 男主凛澈：`assets/references/protagonists/ref_rinche_face_outfit_lock_v01.png`
- 女主凛纱：`assets/references/protagonists/ref_rinsa_face_outfit_lock_v01.png`

生成或重绘主角时必须保持：

- 面部比例、眼型、鼻口位置、下颌线和疲惫气质一致。
- 发型轮廓一致：凛澈为黑色短碎发、发尾略乱；凛纱为黑茶中长发、可低马尾、旧金色音叉发夹。
- 基础服装一致：旧白/米白衬衫、黑色短马甲或背心、深色下装、黑色短靴。
- 右腕状态一致：契约前缠绷带；契约后绷带裂开并露出金色五线谱刻痕。
- 道具一致：旧乐谱夹/旧乐谱包、修谱工具、调音叉相关配饰。
- 契约前主角身上不能出现指挥棒。
- 契约后指挥棒从右腕刻痕或掌心光痕中显现，不能变成常驻佩剑或普通武器。

禁止漂移：

- 不要改成不同脸型、不同年龄感、不同发色或不同瞳色。
- 不要增加长风衣、大披风、军装肩章、礼服燕尾、重甲、王冠、枪剑等会把主角高级指挥官化的元素。
- 不要把服装改成偶像服、魔法少女服、赛博装甲或贵族礼服。
- 不要让后续 CG 只保留“黑发金眼”这种模糊特征；必须保持母版脸和母版服装。

## 2.1 男性主角默认形象

| 项目 | 设定 |
|---|---|
| 默认名 | 凛澈，可改名 |
| 性别 | 男 |
| 气质 | 安静、执拗、嘴硬、疲惫，看到钢琴会失控 |
| 身形 | 清瘦，不是肌肉型，像长期睡眠不足 |
| 发色 | 黑色短碎发，发尾略乱 |
| 眼睛 | 暗金色或棕金色，平时暗淡，指挥时瞳孔出现细小金色谱线 |
| 服装 | 白色旧衬衫、黑色短马甲、深色长裤、普通黑色短靴，袖口略旧，右手腕平时缠着绷带 |
| 配饰 | 旧乐谱夹、母亲留下的调音叉小挂坠；变身事件前没有指挥棒 |
| 契约后变化 | 右腕绷带被烧开一部分，金色五线谱刻痕从掌心延伸到手腕，战斗时黑金指挥棒从刻痕中重新显现 |

凛澈不是开朗热血型。他越难过越安静，越愤怒越冷。他嘴上经常说：

```text
“我只是想确认一下。”
“我没打算弹很久。”
“别担心，我知道分寸。”
```

但安柠很清楚，他根本没有分寸。只要看见钢琴，只要听见还有人想听音乐，他就会忍不住靠近。

他不是不怕死。他只是更怕有一天，自己也觉得没有音乐没关系。

## 2.2 女性主角默认形象

| 项目 | 设定 |
|---|---|
| 默认名 | 凛纱，可改名 |
| 性别 | 女 |
| 气质 | 冷静、温柔、倔强、会照顾别人，但很会隐藏崩溃 |
| 身形 | 纤细轻盈，动作干净，像习惯搬乐器和整理谱架 |
| 发色 | 黑茶色中长发，发尾微卷，可扎低马尾 |
| 眼睛 | 琥珀金或浅棕金色，情绪激烈时瞳孔出现细小乐谱纹 |
| 服装 | 米白色简单衬衫、黑色短马甲或深色背心、深灰色短裙或利落长裤、黑色短靴，右手腕缠着浅色绷带 |
| 配饰 | 旧金色音叉形小发夹、旧乐谱包；变身事件前没有指挥棒 |
| 契约后变化 | 右腕绷带被金光烧出裂痕，金色谱线从指尖蔓延到手腕，战斗时黑金指挥棒从掌心光痕中显现 |

凛纱看起来比凛澈更稳定。她会照顾诺伊，会提醒安柠休息，会对刚觉醒的阿缇娅说：

```text
“你不用马上理解我们。”
```

但她其实只是更会忍。

她会把悲伤整理得很干净。像把破碎乐谱一页一页放回夹子里。只要没人翻开，就没人知道里面全是血迹。

## 男女主角共通维护规则

- 两个默认主角共享“昼夜巡演团随行者”身份和普通修谱者轮廓。
- 开局主形象都不能持有指挥棒。
- 服装必须轻便、日常、可搬运乐器，不可高级指挥家化。
- 右腕绷带是契约前后的连续视觉锚点。
- 契约后黑金指挥棒从刻痕或掌心光痕中显现，不作为常驻武器挂在身上。
- 眼睛的金色谱线只在指挥、强烈情绪或契约反应时出现。

## 男主资产提示词

```text
Use case: stylized-concept
Asset type: male protagonist default character concept sheet for a music-fantasy visual novel
Reference lock: must preserve face, hair, outfit, bandaged right wrist, sheet-music folder, repair tools, and tired stubborn expression from assets/references/protagonists/ref_rinche_face_outfit_lock_v01.png.
Primary request: default male protagonist "Linche" (凛澈), 17-19 years old, a quiet stubborn exhausted young traveling music repair attendant, not a heroic commander, not cheerful. He is selected later by a Musicart's conductor baton, but before the transformation event he has no baton.
Scene/backdrop: clean white-gold opera fantasy concept sheet background with subtle pale staff-line motif, no readable labels.
Subject: slender sleep-deprived young man, not muscular, black short tousled hair with slightly messy ends, dim dark-gold or brown-gold eyes; expression quiet, guarded, mouth slightly stubborn. Outfit: old white shirt with worn cuffs, short black vest, dark trousers, ordinary black ankle boots, right wrist wrapped in bandage. Accessories: old sheet-music folder, small tuning-fork pendant left by his mother, compact repair tools. Contract-after detail shown as a small inset only: bandage partly burned open, golden five-line staff scar from palm to wrist, tiny gold staff-lines in pupils while conducting, black-gold baton emerging from the scar light.
Style/medium: high-saturation anime game character design, premium visual novel protagonist reference, white-gold opera fantasy blended with restrained post-apocalyptic travel practicality, clean silhouette.
Composition/framing: full body front three-quarter pose plus small side/back outfit view and wrist inset, neutral tired stance, one hand near the sheet-music folder, no text.
Lighting/mood: soft studio lighting, tired and restrained, quiet obsession with music, fragile but resolute.
Color palette: white shirt, black vest, charcoal trousers, worn leather brown accessories, restrained champagne-gold contract light only in inset.
Materials/textures: cotton shirt, slightly worn cuffs, matte black cloth vest, old paper folder, brass tuning-fork pendant, fabric bandage, worn leather satchel.
Constraints: no long coat, no cape, no ornate conductor uniform, no military epaulettes, no formal tuxedo, no baton in the main default pose, no weapon, no crown, no readable text, no logo, no watermark.
Avoid: muscular hero body, cheerful hot-blooded smile, idol costume, luxury commander outfit, cyberpunk neon, dark grunge-only palette, overdesigned armor, giant cloak.
```

## 女主资产提示词

```text
Use case: stylized-concept
Asset type: female protagonist default character concept sheet for a music-fantasy visual novel
Reference lock: must preserve face, hair, outfit, bandaged right wrist, old-gold tuning-fork hairclip, sheet-music bag, and calm hidden-grief expression from assets/references/protagonists/ref_rinsa_face_outfit_lock_v01.png.
Primary request: default female protagonist "Rinsa" (凛纱), 17-19 years old, calm gentle stubborn young traveling music repair attendant who cares for others and hides collapse well. She is selected later by a Musicart's conductor baton, but before the transformation event she has no baton.
Scene/backdrop: clean white-gold opera fantasy concept sheet background with subtle pale staff-line motif, no readable labels.
Subject: slender light young woman, practical clean movements as if used to carrying instruments and arranging music stands, black-brown medium-length hair with slight curled ends, can be tied in a low ponytail, amber-gold or light brown-gold eyes; expression calm and kind but tightly controlled. Outfit: simple ivory shirt, short black vest or dark fitted vest, variant elements showing dark gray skirt and practical long trousers as alternate lower-body options, ordinary black ankle boots, right wrist wrapped in pale bandage. Accessories: small old-gold hairclip shaped like a tuning fork, old sheet-music bag, compact repair clips and music notebook. Contract-after detail shown as a small inset only: wrist bandage cracked by gold light, golden staff-lines spreading from fingertips to wrist, tiny score pattern in pupils during strong emotion, black-gold conductor baton emerging from palm light.
Style/medium: high-saturation anime game character design, premium visual novel protagonist reference, white-gold opera fantasy blended with restrained post-apocalyptic travel practicality, clean silhouette.
Composition/framing: full body front three-quarter pose plus small low-ponytail/back view and wrist inset, poised but tired stance, one hand holding a sheet-music bag strap, no text.
Lighting/mood: soft studio lighting, gentle restraint, hidden grief, ordinary person forced toward destiny.
Color palette: ivory shirt, black vest, deep gray skirt/trousers, worn leather brown bag, old-gold hairclip, restrained champagne-gold contract glow only in inset.
Materials/textures: cotton shirt, simple dark vest, practical fabric skirt/trousers, pale bandage, old paper sheet music bag, small brass tuning-fork hairclip.
Constraints: no long coat, no cape, no ornate conductor uniform, no complex military outfit, no formal ballgown, no baton in the main default pose, no weapon, no crown, no readable text, no logo, no watermark.
Avoid: idol costume, magical girl frills, luxury commander outfit, cyberpunk neon, dark grunge-only palette, overdesigned armor, giant cloak, exaggerated cheerful pose.
```

## 3.2 女主角提示词

所有女主角三态图都必须引用并保持母版一致性：

```text
reference lock:
assets/references/protagonists/ref_rinsa_face_outfit_lock_v01.png
preserve the same face, black-brown low ponytail, amber golden eyes, old-gold tuning fork hairpin, cream shirt, black short vest, dark skirt/trousers option, black ankle boots, right wrist bandage or contract scar, old sheet music bag.
```

### 女主 · 契约前

```text
anime game female protagonist, 17 years old, slender young woman, black-brown medium hair tied in a low ponytail, amber golden eyes, simple cream white shirt, black short vest, dark skirt or dark fitted trousers, black ankle boots, light bandage wrapped around right wrist, small old-gold tuning fork hairpin, carrying an old sheet music bag, no conductor baton, standing near a sealed piano in a rainy abandoned town, calm wounded expression, high saturation anime style, cinematic music fantasy
```

项目增强约束：

```text
preserve reference face and outfit from assets/references/protagonists/ref_rinsa_face_outfit_lock_v01.png, no different hairstyle, no different face, no baton before transformation, lower area clean for visual novel dialogue UI, white-gold opera fantasy mixed with restrained post-apocalyptic rain.
```

### 女主 · 接住指挥棒瞬间

```text
anime female protagonist catching a black-and-gold conductor baton thrown by a newly transformed Musicart, simple cream shirt and black vest, dark skirt or trousers, right wrist bandage burning open with glowing golden music stave marks, shocked emotional expression, golden sound lines wrapping around her fingers, rain, broken pendant fragments floating, ruined town square, dramatic anime transformation scene, black gold lighting, high saturation
```

项目增强约束：

```text
preserve reference face, low ponytail, tuning fork hairpin, cream shirt, black vest, dark lower-body option, and right wrist bandage; baton only appears at the catch moment; gold stave marks must burn from fingers and wrist, not become jewelry or armor.
```

### 女主 · 战斗指挥状态

```text
anime female conductor protagonist, slender young woman in simple cream shirt and black short vest, dark skirt or fitted trousers, black ankle boots, no long coat, no cape, glowing golden stave scar around right wrist and fingers, holding black-and-gold conductor baton, calm but pained expression, conducting Musicart in battle, golden music waves, rainy abandoned theater, cinematic anime game poster, high saturation, dramatic rim light
```

项目增强约束：

```text
preserve reference face and outfit; no luxury commander styling; no cape or long coat; black-gold conductor baton manifests from contract scar; expression is calm but pained, not triumphant.
```

### 女主负面提示词

```text
negative prompt:
long trench coat, windbreaker, cape, princess dress, luxurious gown, complicated military uniform, heavy armor, huge cloak, overly ornate outfit, mature woman, holding sword, holding gun, already holding baton before transformation, different face, different hairstyle, different outfit, idol costume, magical girl frills, cyberpunk armor
```

## 昼夜巡演团开局背景提示词

```text
Use case: illustration-story
Asset type: visual novel opening background CG for protagonist origin
Primary request: the mobile repair convoy "Day-Night Touring Troupe" where the protagonist begins as a young attendant who reads sheet music, tunes instruments, repairs old instruments, and carries supplies before being chosen as a conductor.
Scene/backdrop: post-apocalyptic music fantasy roadside camp at dawn, a modest convoy of repair wagons and small utility vehicles parked beside a quiet ruined road, one wagon has an open side workshop with an old upright piano being repaired, shelves of tuning forks, rolled sheet music, cracked instrument cases, toolboxes, spare strings, oil lamps, and folded canvas awnings; distant white-gold city silhouette far away, no readable signs.
Subject: no main character face shown; focus on the lived-in repair workspace, a small open music notebook, piano keys with a tuning lever, travel packs, crates being loaded, quiet evidence of a 17-19 year old helper; the mood says ordinary person before destiny.
Style/medium: high-saturation anime game visual novel background, white-gold opera fantasy mixed with restrained post-apocalyptic travel realism, cinematic but readable, premium 2D background art.
Composition/framing: 16:9 landscape, wide shot with foreground repair table and piano details, convoy in midground, road leading toward distant White Score Academy direction, lower third kept clean for dialogue UI.
Lighting/mood: pale dawn light, gentle melancholy, fragile hope, silence after an age without music.
Color palette: warm off-white, dusty navy canvas, brass gold highlights, old leather brown, cool gray road, muted sunrise amber.
Materials/textures: worn wood piano, brass tuning tools, canvas awnings, paper sheet music without readable notes or text, cracked lacquer instrument cases, road dust, soft fabric bundles.
Constraints: no readable text, no logos, no modern brands, no guns, no flashy idol stage, no grand commander aesthetics, no huge concert hall, no character portrait facing camera, no conductor baton visible.
Avoid: cyberpunk neon, overgrown fantasy forest, cute comedy caravan, military convoy, luxurious royal carriage, dark grunge-only palette, cluttered unreadable composition.
```
