# 第零章可维护图片生成提示词

## 通用一致性规则

```text
用途：图文游戏素材，不是母图设定板。
母图只用于锁定脸、发型、服装、眼部设计、标志物和色彩锚点。
游戏显示图必须输出为 sprites、cutout、portrait、cg 或 keyvisuals 路径。
不要把 *_mother_v01.png 直接作为立绘、头像、战斗图或队伍卡图。
```

## 通用反向约束

```text
no black void
no pure black background
no ruined wasteland
no apocalyptic rubble
no collapsed buildings
no muddy low-contrast image
no missing face
no damaged cutout edges
no transparent holes inside the body
no reference sheet layout
no multiple poses
no text
no watermark
```

## 第零章主菜单背景

```text
Asset type: 16:9 main menu background.
Scene: 眠沙镇雨夜剧场区，旧钢琴被禁演封条和红蔷薇缠住，弃置但不是废墟；剧场门廊、唱片店窗光、湿地金色五线谱反光清楚可读。
Style: 高精度二次元游戏背景，哥特歌剧，黑金红蔷薇，暖金灯光与柔紫雨雾。
Composition: 宽屏横图，中心偏左保留标题与按钮可读空间，旧钢琴和剧场入口作为第一视觉锚点。
Lighting: 暖金、象牙白、柔紫霓虹，雨夜但整体中高亮度，不允许被黑色吞没。
Avoid: 纯黑废墟、坍塌城市、过量雾气、看不清钢琴或剧场、恐怖片式黑暗。
```

## 开局男女主立绘

```text
Asset type: full-body character sprite source for chroma-key removal.
State: 第零章开局，普通修理车队随行者，尚未接住指挥棒。
Costume anchor: 白衬衫、黑色马甲、深色实用裤/裙、皮靴、肩包、修理记录或谱纸、小型金色细节。
Must keep: 年龄感 17-19，脸完整，眼睛清楚，双手自然，身体完整。
Must avoid: 指挥棒、长风衣、披风、豪华军装、王族礼服、过度华丽战斗服。
Background: perfectly flat solid #00ff00 chroma-key background, no shadow, no gradient, no texture.
```

## 母亲立绘

```text
Asset type: full-body character sprite source for chroma-key removal.
Identity anchor: 成年女性调音师，小圆眼镜，棕色松散盘发与侧卷发，温柔疲惫神情。
Costume anchor: 白色褶皱衬衫，黑棕长裙/围裙，皮质背带，腰间调音工具包，调音叉或调音工具，黑靴，水晶吊坠。
Must keep: 脸完整、双眼可见、眼镜清楚、吊坠清楚、工具包清楚。
Must avoid: 缺脸、黑洞、破碎身体、设定板多视图、背景场景、过暗。
Background: perfectly flat solid #00ff00 chroma-key background, no shadow, no gradient, no texture.
```

## 第零章 NPC 单人立绘

```text
Asset type: full-body visual novel character sprite source for chroma-key removal.
Mother/reference role: 母图只用于锁定脸、发型、服装锚点、色彩锚点、道具和性格；不要复制整张参考页版式。
Composition: ONE character only, full body visible from complete head to shoes, front three-quarter view, centered, generous padding around hair, hands, props, coat tails and shoes.
Style: 高饱和精修二次元 RPG 立绘，哥特歌剧 / tactical Musicart 气质，线条干净，暖金高光，轮廓清楚。
Lighting: balanced studio light, face and costume details clear, not too dark.
Background: perfectly flat solid #00ff00 chroma-key background, no shadow, no gradient, no texture, no floor plane.
Must avoid: missing head, hole through face, cropped hands, cropped props, detached scenery, reference panels, back-view duplicate, close-up inset, paper border, UI frame, watermark, text, black void background, ruin-only background, cast shadow, contact shadow, dirty cutout edge.
After generation: remove chroma key, inspect face/hands/feet/hair edge, then write only the transparent sprite path into game.js.
```

```text
安柠：棕眼、乱高马尾、白衬衫、黑色工具马甲、工装裤、工具腰带、红布腰饰、诊断板/维修板。
乌鸦先生：黑色微卷发、圆眼镜与眼镜链、唱片店主、白衬衫、黑色马甲、黑棕长围裙、黑蔷薇胸针、黑胶唱片。
米拉奶奶：灰发盘发、小圆眼镜、温柔老年面容、酒红短外套、黑长裙、金边、剧票与钥匙串。
卡戎：黑发、破乐谱半面具、黑红歌剧反派礼装、荆棘链、黑蔷薇、破碎衣摆。
弥洛：黑发、低鸣骑士、黑色军乐制服、低音谱号纹样、酒红腰带、音叉/低频武器。
奥托：年老失聪灯光师、灰发后束、额头黄铜护目镜、白衬衫、深棕马甲、工具腰带、旧追光灯扳手、旧提示本。
霍尔特：中年代理镇长、疲惫文书气质、雨湿灰长外套、酒红领带、黄铜怀表、镇政徽章、潮湿登记表。
伊莱娜：静默署女巡逻队长、暗红盘发、冷静审视眼神、象牙灰制服、深色披肩、红腰封、封音项圈装置、密封报告夹。
琳：双胞胎中更外向的一位、短棕发、酒红发带、旧学校制服残件、粉笔板/窗雾残谱、节拍挂饰。
铃：双胞胎中更安静的一位、短棕发、象牙色发带、旧学校制服残件、粉笔与裂 slate、调音叉小挂饰。
```

## 抠图流程

```text
1. 生成绿幕源图到 tmp/imagegen/*_raw_vNN.png。
2. 使用 remove_chroma_key.py 输出到 assets/generated/chapter0/sprites/characters/*_vNN.png。
3. 目检脸、手、服装边缘。
4. 运行 alpha 审计，确认没有明显内部透明洞。
5. 只把通过检查的 sprites 路径写入 game.js。
```
