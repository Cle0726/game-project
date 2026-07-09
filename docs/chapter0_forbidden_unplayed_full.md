# 《宿命回响：残响之途》
## 第零章 · 禁曲未响
### 最终完整版 Markdown ｜ 命运节拍（takt op.Destiny）视觉风格强化版
#### 版本定位：大扩容序章 / 主角情感线 / NPC群像 / 小怪生态 / 前期Boss / 指挥棒契约修正版 / 变身眼部设计强化版 / 哥特歌剧美术体系版

> 本文件用于分段导入游戏 AI、剧情生成器、角色设定库、事件系统或美术提示词库。  
> 核心修正：  
> **主角开局没有指挥棒。指挥棒由律者变身时生成，并在觉醒瞬间抛给/交给主角。主角接住后才成为指挥家。**  
> 主角开局服装保持简单，不使用长风衣、披风、豪华军装、王族礼服等不符合初始设定的元素。  
> 律者变身时重点强化：**眼线、眼影、瞳孔、眼下乐谱纹、金色泪光、眼部特写。**

> **本版本美术方向说明：**  
> 参考 MAPPA × MADHOUSE 联合制作的《宿命回响：命运节拍》（takt op.Destiny）美术体系——  
> 哥特歌剧剧场感、黑红金三色礼服、带刺蔷薇纹样、华彩指挥家与 Musicart 少女的宿命羁绊——  
> 在**不删减原文剧情、对话、数值与选项**的前提下，对世界观质感、角色设计、AI 绘图提示词进行整体加厚与美术强化。  
> 新增或强化内容以「风格强化」「补充」等标注区分，原文一字不改地保留在原位置。

---

# 目录

```text
00. 使用说明
01. 第零章总定位
02. 世界观基础
03. 指挥棒与契约规则
04. 主角设定：可选男女但同一命运线
05. 主角形象提示词：契约前 / 接棒瞬间 / 战斗状态
06. 律者与 Musicart 设定
07. 性别共鸣与同频过载机制
08. 主要角色设定
09. 眠沙镇 NPC 群像
10. 敌方阵营与反派设定
11. 小怪生态与前期 Boss
12. 第零章主线剧情节点
13. 地图探索与支线事件
14. 茶歇互动与个人故事
15. 迷你游戏设计
16. 战斗系统与数值变量
17. 变身眼部设计提示词库
18. 全角色 AI 绘图提示词
19. 后续路线分歧
20. 伏笔表
21. 负面提示词总表
22. 【风格强化】视觉美术圣经：蔷薇、荆棘与华彩歌剧体系
```

---

# 00. 使用说明

本文件不是短剧情梗概，而是完整的游戏剧情与设定文档。

适合以下用途：

```text
1. 分段喂给 AI 做剧情扩写
2. 拆成游戏主线节点
3. 拆成支线任务文本
4. 拆成角色设定卡
5. 拆成美术 AI 提示词
6. 拆成战斗关卡设计
7. 拆成茶歇互动脚本
8. 后续继续扩第一章、第二章或平行路线
```

建议导入顺序：

```text
第一批：世界观、指挥棒规则、主角设定
第二批：主要角色与 NPC
第三批：小怪、Boss、反派指挥家
第四批：主线剧情节点
第五批：支线、茶歇、迷你游戏
第六批：提示词库与负面提示词
```

---

# 01. 第零章总定位

## 1.1 章节名称

```text
游戏名：《宿命回响：残响之途》
章节：第零章
章节名：禁曲未响
副标题：未被允许的第一拍
```

## 1.2 风格定位

```text
黑金雨幕巡演风
废弃剧场
禁曲公路
荒镇旧钢琴
哥特歌剧
霓虹残响
高饱和二次元角色
悲剧变身
情感型冒险 RPG
```

【风格强化 · 命运节拍向美术基调】

```text
带刺蔷薇纹样（荆棘缠绕、只剩一朵花的花环、枯茎颈环）
黑红金三色剧院礼服
华彩交响乐团圣殿的残骸感
烧焦乐谱化作的"黑雪"
撕裂幕布与破碎水晶吊灯
指挥台与谱架的宗教感构图
MAPPA / MADHOUSE 级别的高精度分镜光影
悲剧美少年少女的舞台仪式感
```

这一章不走“白金歌剧厅”的明亮学院感，而是：

```text
湿黑色的公路
被雨水泡软的禁演封条
荒镇中央被锁住的旧钢琴
像舞台灯一样闪烁的霓虹招牌
在黑暗里翻页般拍动翅膀的噬响体
由濒死人类转化而成的律者
被迫接住指挥棒的主角
```

【风格强化】这一章的美术基调可以再具体一点：

```text
雨水打在铁锈色的禁演封条上，封条边缘卷起，像被撕开的乐谱
荒镇广场的旧钢琴周围散落着风干的蔷薇——不知是谁每年偷偷放上又被没收
霓虹招牌的光斜切进雨幕，像追光灯打在一座没有观众的空剧场
噬响体扑翅的声音混着远处教堂钟摆的机械声，构成整章的底噪
律者初次显形时，周身的黑色羽毛状光粒会短暂拼出破碎的五线谱
指挥棒离手时会在空气中留下一道转瞬即逝的金色残影，如同蔷薇划过的刺痕
```

第零章不是几分钟的新手教程，而是一整个可以玩的开篇大章。

玩家第一次进入世界时，不应该只认识两个主角和一个怪物，而应该看见：

```text
有人害怕音乐
有人怀念音乐
有人靠禁止音乐维持秩序
有人偷偷保存旧唱片
有人利用音乐引怪赚钱
有人因为音乐失去亲人
有人明知道会死也想再听一次
```

第零章的核心不是“拯救世界”，而是：

> 主角明明已经被音乐夺走了一切，  
> 却还是在一座快要死去的小镇里，被迫承认：  
> **自己不能没有音乐。**

---

# 02. 世界观基础

## 2.1 静默纪元

```text
静默纪元：
一场被称为“失谐潮”的灾难后，人类进入长期音乐禁令时代。
公开演奏被认为会吸引噬响体。
大多数地区禁止演奏、售卖乐器、修复可发声乐器。
旧乐谱、唱片、录音资料被收缴或封存。
```

官方说法：

```text
音乐会吸引噬响体。
为了保护平民，必须控制音乐。
沉默是安全。
```

民间说法：

```text
不是音乐带来灾难，
而是有人害怕音乐让人重新想起自己还活着。
```

## 2.2 噬响体

```text
噬响体：
被失谐潮污染的非人怪物。
它们会被旋律、节奏、共鸣、活谱核、律者气息吸引。
它们不是普通野兽，而像“坏掉的演出残骸”。
```

本章噬响体风格：

```text
不是单纯丑陋怪物。
而是美丽事物走调后的恐怖形态。

乐谱飞蛾
破碎舞台木偶
坏掉的节拍器兽
无声合唱幻影
管风琴寄生体
剥音校尉
失败演出 Boss
```

## 2.3 律者 / Musicart

```text
律者：
伟大乐曲、情绪、记忆、谱核与人类身体共鸣后诞生的战斗化身。
她们/他们不是普通兵器。
她们会思考、学习、误解、渴望、恐惧。
```

律者的核心矛盾：

```text
她们拥有人的身体。
她们继承人的残响。
她们却不一定是原来那个人。
```

本章第一名正式律者：

```text
阿缇娅 · 暮星序曲
原人类身份：缇雅
觉醒方式：非正规濒死转化
契约方式：变身后生成指挥棒并抛给主角
```

【风格强化】律者称谓的双重书写：

```text
官方档案称她们为"律者"。
街头旧唱片贩子和乌鸦先生这类怀旧派，则习惯用旧时代的称呼——
"Musicart"，意为"活着的乐曲"。
两个称呼分别代表两种视角：
"律者"是静默署眼中需要被管理的战斗单位；
"Musicart"是怀念音乐的人心里，仍愿意称呼她们为"人"的方式。
主角与安柠等平民角色更常脱口而出"Musicart"，
静默署、白谱院公文则统一使用"律者"。
```

---

# 03. 指挥棒与契约规则

## 3.1 关键修正

这一版必须严格遵守：

```text
主角开局没有指挥棒。
主角不是一开始就是完整指挥家。
指挥棒不是普通随身武器。
指挥棒来自律者觉醒瞬间。
```

正确流程：

```text
1. 缇雅濒死。
2. 白色吊坠 / 谱核碎裂。
3. 音乐残响启动。
4. 缇雅身体转化为律者“阿缇娅 · 暮星序曲”。
5. 阿缇娅手中凝聚出黑金色指挥棒。
6. 她在战火中将指挥棒抛给主角。
7. 主角本能接住。
8. 指挥棒落入掌心。
9. 金色谱线刺入右腕。
10. 契约刻痕出现。
11. 主角成为奏者 / 指挥家。
12. 从此律者释放技能会消耗主角健康值。
```

## 3.2 指挥棒设定

```text
名称：未鸣
类型：契约型黑金指挥棒
来源：阿缇娅觉醒时从谱核与吊坠残片中生成
外观：黑色细长棒身，金色五线谱纹路，柄端嵌入裂开的白色吊坠碎片
状态：平时可化为金色谱线潜入主角右腕刻痕
战斗时：从右腕刻痕中重新显现
限制：主角无法主动丢弃；离手过久会引发右腕剧痛
```

## 3.3 接棒瞬间

```text
场景：
火焰、雨水、黑色音痕、噬响体嘶鸣。
阿缇娅刚刚完成变身。
她的眼睛已经不再是缇雅的人类眼睛。
她手中出现黑金指挥棒。
她没有解释。
她只是把它抛向主角。
```

文本：

> 指挥棒穿过雨幕。  
> 像一根被命运掷出的黑金色针。  
>  
> 你本能地伸手接住。  
>  
> 下一秒，掌心像被烧穿。  
> 金色五线谱从指缝钻入皮肤，沿着血管爬上右腕。  
> 你听见一声很轻的断裂声。  
> 像有什么东西在你身体里，终于开始演奏。  

系统提示：

```text
【指挥权限建立】
【奏者契约成立】
【律者：阿缇娅 · 暮星序曲 已接入】
【警告：非正规契约】
【警告：技能释放将消耗指挥家健康值】
```

---

# 04. 主角设定：可选男女但同一命运线

## 4.1 主角基础信息

```text
身份：奏者 / 指挥家
性别：玩家可选男 / 女
年龄感：17—19岁
开局身份：流动修理车队“昼夜巡演团”的随行者
擅长：看谱、调音、简单弹奏、修理旧乐器、记录旧旋律
初始状态：普通人，没有指挥棒，没有正式指挥家资格
核心命运：被阿缇娅变身后生成的指挥棒选中
身体代价：每次指挥律者释放技能，都会消耗健康值
主线目标：寻找异常契约、律者状态、主角母亲失踪真相
```

## 4.2 主角过去

主角从小生活在“昼夜巡演团”。

这个车队表面上是普通修理队：

```text
修车
修净水器
修发电机
修路边通讯塔
帮小镇换轮胎
运送普通货物
```

实际上，它暗中保存旧时代的音乐资料：

```text
被禁的乐谱
坏掉的唱片
不能发声的钢琴
被拆掉共鸣板的小提琴
旧录音机
母亲留下的调音记录
```

主角的母亲曾是调音师。

她从不公开演奏，只修复那些“已经不能发声”的乐器。

小时候，主角问过母亲：

> “如果一架钢琴永远不能弹，那为什么还要修它？”

母亲回答：

> “因为有些东西不是为了现在响起。  
> 是为了让未来的人知道，它曾经可以响。”

这句话成为主角一生的伤口。

## 4.3 母亲失踪

主角十二岁那年，母亲被静默署带走。

罪名是：

```text
非法修复可演奏乐器
保存旧时代音源
疑似传播禁曲
```

可那架钢琴根本发不出声音。

母亲被带走时，没有喊叫，只隔着门缝对主角做了四拍手势：

```text
一。
二。
三。
四。
```

意思是：

```text
别出声。
活下去。
```

从那天起，主角开始恨音乐。

因为如果没有音乐，母亲也许不会被带走。

但主角也无法停止记住音乐。

这就是主角最深的矛盾：

```text
主角爱音乐。
主角也恨音乐。
主角害怕音乐。
主角也害怕自己有一天觉得没有音乐也没关系。
```

## 4.4 缇雅

缇雅是主角童年里最吵、最亮、最不肯安静的人。

她不像主角那样小心。

主角把乐谱夹在书页里，她会直接拿出来对着阳光看。

主角说：

> “会被发现。”

缇雅说：

> “那我们跑快点不就好了？”

缇雅相信音乐会回来。

不是因为她懂什么大道理，而是因为她无法接受世界永远沉默。

她常对主角说：

> “你以后一定会成为指挥家。”

主角问：

> “为什么？”

缇雅回答：

> “因为你听别人说话的时候，也像在听音乐。  
> 你听得出谁在害怕，谁在逞强，谁明明想哭却还在笑。”

第零章悲剧发生后，缇雅濒死转化为阿缇娅。

从那一刻开始，主角要面对的问题不是“她死了”，而是更残酷的：

```text
她的身体还站在自己面前。
她的声音还会叫自己“奏者”。
可她不再承认自己是缇雅。
```

---

# 05. 主角形象提示词：契约前 / 接棒瞬间 / 战斗状态

## 5.1 男性主角默认设定

```text
默认名：凛澈
可改名
性别：男
年龄感：17—19岁
气质：安静、执拗、嘴硬、疲惫、看到钢琴会失控
身形：清瘦，不是肌肉型，像长期睡眠不足
发色：黑色短碎发，发尾略乱
眼睛：暗金色或棕金色，平时暗淡，指挥时虹膜浮现金色谱线
服装：
  白色旧衬衫
  黑色短马甲
  深色长裤
  普通黑色短靴
  袖口略旧
  右手腕平时缠着绷带
配饰：
  旧乐谱夹
  母亲留下的调音叉小挂坠
  契约前没有指挥棒
【风格强化】马甲第二颗纽扣处别着一枚干枯的黑蔷薇胸针——是缇雅小时候硬塞给他的，他嫌麻烦却一直没摘掉
契约后变化：
  右腕绷带被烧开
  金色五线谱刻痕从掌心延伸到手腕
  战斗时指挥棒从刻痕中显现
  【风格强化】刻痕边缘会浮现极细的荆棘状纹路，如同五线谱被藤蔓缠绕
```

### 男主契约前提示词

```text
anime male protagonist, 17-19 years old, slim tired boy, short messy black hair, dark golden brown eyes, simple white old shirt, black short vest, dark trousers, ordinary black ankle boots, bandage wrapped around right wrist, holding an old music score folder, small tuning fork pendant, small withered black rose brooch on vest, no baton, melancholic expression, rainy abandoned town, forbidden music atmosphere, gothic opera lighting, MAPPA MADHOUSE style anime key visual, cinematic composition, high saturation anime game style
```

### 男主接棒瞬间提示词

```text
anime male protagonist catching a black-and-gold conductor baton for the first time, simple white shirt and black vest, bandage on right wrist burning open, glowing golden stave scar spreading from palm to wrist, thorn-like vine patterns curling along the scar edges, dark golden eyes widening in pain and shock, floating music notes reflected in pupils, rain, fire, broken pendant fragments, scattered black rose petals in the wind, tragic Musicart awakening scene, cinematic black gold lighting, dramatic low-angle composition, MAPPA MADHOUSE anime film quality, high detail
```

### 男主战斗状态提示词

```text
anime male conductor protagonist, slim young man in simple white shirt and black vest, no long coat, no cape, right wrist glowing with golden music stave scar wrapped in faint thorn-vine pattern, holding black-and-gold conductor baton formed from contract light, exhausted but determined expression, dark golden eyes with subtle glowing stave ring in irises, wind-blown rose petals mixed with rain, rain-soaked battlefield, gothic black gold music fantasy, cinematic anime game key visual, dynamic action pose, theatrical rim lighting
```

## 5.2 女性主角默认设定

```text
默认名：凛纱
可改名
性别：女
年龄感：17—19岁
气质：冷静、细腻、敏锐、温柔但不软弱
身形：纤细轻盈，不是华丽大小姐感，而是会旅行、会修东西的人
发色：黑茶色中长发，可绑低马尾或半扎发
眼睛：琥珀金，指挥时虹膜边缘出现细小五线谱环
服装：
  白色简单衬衫
  黑色短马甲
  深色及膝裙或行动方便的深色长裤
  普通短靴
  袖口有修补痕迹
  右手腕缠着绷带
配饰：
  母亲留下的旧金色音叉发夹
  小型乐谱本
  契约前没有指挥棒
  【风格强化】发夹旁别着一小截干枯的荆棘藤，缠成不起眼的圆环——同款胸针的另一半，是她与男主设定二选一时的呼应彩蛋
契约后变化：
  绷带被金色谱线烧开
  指尖到手腕出现金色乐谱刻痕
  指挥时眼神从温和变得锐利
  【风格强化】刻痕深处隐约透出极淡的暗红色，如同蔷薇汁液渗入五线谱
```

### 女主契约前提示词

```text
anime female protagonist, 17-19 years old, slim young woman with medium black-brown hair tied loosely, amber golden eyes, simple white shirt, black short vest, dark knee-length skirt or practical dark trousers, ordinary ankle boots, bandage wrapped around right wrist, old gold tuning fork hairpin with tiny withered thorn-vine ring, small music notebook, no baton, calm but wounded expression, rainy abandoned music town, forbidden music atmosphere, gothic opera lighting, MAPPA MADHOUSE style anime key visual, high saturation anime game style
```

### 女主接棒瞬间提示词

```text
anime female protagonist catching a black-and-gold conductor baton for the first time, simple white shirt and black short vest, right wrist bandage burning open, glowing golden stave scar spreading from palm to fingers and wrist with faint thorn-vine curling pattern, amber golden eyes widening with pain and shock, subtle golden music notes reflected in irises, broken white pendant fragments floating, scattered black rose petals in the rain, fire in background, tragic beautiful Musicart awakening scene, cinematic black gold lighting, dramatic low-angle composition, MAPPA MADHOUSE anime film quality, high detail
```

### 女主战斗状态提示词

```text
anime female conductor protagonist, slim young woman in simple white shirt and black vest, practical dark skirt or trousers, no long coat, no cape, golden stave scar glowing around right wrist and fingers with faint thorn-vine pattern, holding black-and-gold conductor baton formed from contract light, amber eyes with faint golden stave ring, calm but determined expression, wind-blown rose petals mixed with rain, rainy battlefield, gothic black gold music fantasy, cinematic anime game key visual, dynamic action pose, theatrical rim lighting
```

---

# 06. 律者与 Musicart 设定

## 6.1 律者不是武器

律者是音乐之力的化身，但不等于工具。

她们/他们会有：

```text
战斗本能
乐曲情绪
残留记忆
自我愿望
对主角的依赖
对自身身份的疑问
```

第零章必须让玩家理解：

```text
律者强大，但力量不是免费的。
律者美丽，但诞生过程可能极其残酷。
律者像人，但又不是原来那个人。
主角可以指挥她们，但不能把她们当成没有意志的武器。
```

## 6.2 每场只能带两名律者

规则：

```text
玩家每场战斗最多携带两名律者。
```

世界观理由：

```text
主角体内的活谱核一次最多稳定两条主旋律。
第三名律者强行接入，会造成旋律互相挤压。
结果是乱奏、反噬、健康值暴跌、技能目标随机化。
```

系统表现：

```text
出战栏：2个
候补栏：可在地图或营地切换
特殊剧情战：可出现第三名律者临时支援，但玩家不能直接全程指挥
```

---

# 07. 性别共鸣与同频过载机制

## 7.1 玩家设定

玩家可选男性或女性。

主线命运一致，但以下内容有差异：

```text
立绘
动作
部分内心独白
与角色互动语气
同频过载对象
变身接棒镜头
茶歇台词细节
```

## 7.2 同频过载规则

```text
男性奏者：
  指挥男性律者时，更容易出现低频重叠。
  代表：弥洛容易提前防御、冲锋、替主角承伤。

女性奏者：
  指挥女性律者时，更容易出现泛音重影。
  代表：阿缇娅容易因情绪同步过深提前攻击或保护主角。
```

注意：

```text
这不是现实性别强弱设定。
这是游戏内“音域与活谱核过近”的共鸣冲突。
当两段旋律太像，律者会误把自己的意志当成主角指令。
```

## 7.3 概率建议

```text
同性别奏者 + 同性别律者：基础过载概率 10%
异性别奏者 + 律者：基础过载概率 3%
无性别 / 特殊律者：基础过载概率 5%

律者信任 >= 30：概率 -3%
律者信任 >= 60：概率 -6%
律者压力 >= 50：概率 +5%
反派干涉“默令”：概率 +8%
使用稳定针剂：下一次过载无效
茶歇成功：下一场战斗过载概率 -2%
```

## 7.4 同频过载文本

### 男主 + 弥洛

```text
弥洛没有等你的下一拍。

低沉的琴弦声从他胸腔里震出，像一场提前到来的雷。

你的指挥棒还停在半空，他已经举盾冲了出去。

弥洛：
“这一击，我来替你承受。”

系统：
【同频过载触发】
【弥洛技能目标随机改变】
【奏者健康值额外 -6】
```

### 女主 + 阿缇娅

```text
阿缇娅忽然回头看你。

那一瞬间，你分不清胸口涌起的愤怒是你的，还是她的。

她的剑已经出鞘，金色星痕刺穿雨幕。

阿缇娅：
“我不允许他们继续伤害你。”

系统：
【同频过载触发】
【阿缇娅提前释放技能】
【奏者健康值额外 -6】
```

### 高信任压制

```text
杂音从活谱核深处涌起。
你几乎握不住指挥棒。

就在那一刻，律者看向你。

阿缇娅：
“我听见了。但我会等你。”

弥洛：
“下一拍，由你决定。”

系统：
【高信任触发】
【过载被压制】
```

---

# 08. 主要角色设定

## 8.1 阿缇娅 · 暮星序曲

```text
身份：第一名正式契约律者
原人类身份：缇雅
性别：女性
音乐情绪：黄昏、失去、温柔残响、最后一颗星
武器：细剑 + 短管音波手炮
变身来源：白色吊坠碎裂后，缇雅濒死转化
契约方式：变身后生成指挥棒并抛给主角
外观主色：深紫、暗红、熔金、黑色
性格初期：冷淡、目标单一、只会说消灭噬响体
性格成长：逐渐理解人类情绪，承认自己不是缇雅，也不想只是替代品
```

阿缇娅最重要的情感矛盾：

```text
她用缇雅的身体活着。
她继承缇雅死亡瞬间的愿望。
但她不是缇雅。
```

她会对主角说：

> “你看着我的时候，在寻找另一个人。”  
> “我不是她。”  
> “但我也不是空的。”

### 阿缇娅变身描述

> 白色吊坠在缇雅胸口碎开。  
> 碎片没有落地，而是悬浮起来，围绕她旋转。  
>  
> 暗紫与暗红色眼影从她眼尾蔓延，像一朵在血中盛开的暮星花。  
> 她的人类瞳孔碎裂成金色音符形状。  
> 眼下浮现金色五线谱纹，像泪痕，又像乐谱。  
>  
> 她睁开眼时，世界安静了一拍。  
>  
> 她手中凝聚出黑金色指挥棒。  
> 然后，没有犹豫地抛向你。  

【风格强化】变身描述补充：

> 战斗礼服并非凭空生成，而是由漫天飞散的旧乐谱碎片与黑色羽状光粒拧绞而成，  
> 在她腰侧收束成一朵没有完全绽放的黑蔷薇——花瓣边缘还留着未闭合的谱线毛边。  
> 裙摆右侧垂落一截断掉的荆棘藤蔓装饰，像是从"缇雅"这个名字上硬生生扯下来的一根刺。  
> 她的战靴靴口也缠着同样的藤蔓纹样，一路缠绕至膝下，如同一株被强行连根拔起又重新种下的花。

### 阿缇娅提示词

```text
anime female Musicart, tragic purple-haired girl transformed from dying human, short dark-purple hair, golden musical-note pupils, star-shaped note pupils, dark violet and crimson eyeshadow spreading from outer corners of eyes, tiny glowing golden stave lines under lower lashes like tear marks, subtle golden glitter like broken sheet music dust, black and crimson gothic opera battle dress, thorny black rose motif at the waist with an unopened black rose bloom, torn vine ornament trailing from the skirt, thorn-vine pattern wrapped around the boots, broken white pendant glowing on chest, rapier and compact music cannon, elegant tragic expression, black gold rain, gothic opera transformation, dramatic theatrical lighting, MAPPA MADHOUSE anime film quality, cinematic key visual composition, high saturation anime game character design
```

## 8.2 弥洛 · 低鸣骑士

```text
身份：临时同行男性律者
性别：男性
音乐情绪：低音、守护、雷声、沉默的承诺
武器：大提琴盾枪
外观主色：灰蓝、黑银、低饱和金
性格：寡言，保护欲强，曾经因同频过载误伤过前任奏者
作用：展示第二名律者加入、两名律者出战、男性律者过载机制
```

弥洛不是一开始完全信任主角。

他害怕再次被指挥，也害怕自己为了保护别人而失控。

台词：

```text
“低音不该抢走主旋律。”
“可有时，我比指挥者更早听见危险。”
“这就是我最害怕的地方。”
```

【风格强化】弥洛的战斗礼服领口别着一朵早已风干发黑的蓝灰色蔷薇——他从不解释来历，只在被问起时说"是欠下的债"。

### 弥洛提示词

```text
anime male Musicart knight, long ash-blue hair, calm grey-blue eyes, subtle silver lower eyeliner, black and silver simple knight-formal battle outfit, single withered blue-grey rose pinned at the collar, cello-case shield and spear weapon, low-frequency blue-gold sound waves, protective posture, rain-soaked battlefield, elegant but restrained Musicart design, gothic black gold music fantasy, theatrical rim lighting, MAPPA MADHOUSE anime film quality, high saturation anime game style
```

## 8.3 安柠

```text
身份：昼夜巡演团修理师、司机、记录员、主角现实锚点
性别：女性
不是律者
外观：棕色马尾、旧工装上衣、工具腰包、记录终端
性格：嘴硬心软、怕麻烦、怕失去、负责把疯子拉回现实
作用：
  1. 管主角健康值
  2. 负责吐槽
  3. 负责车辆和道具制作
  4. 代表普通人的恐惧与爱
```

安柠不讨厌音乐。

她只是见过太多人为了希望死掉。

台词：

```text
“希望很贵的。”
“你每次把它拿出来给别人看，都会有人想抢，有人想砸，还有人想拿它当武器。”
“所以你能不能别每次看到钢琴就像看见自己的坟？”
```

### 安柠提示词

```text
anime support girl mechanic, brown ponytail, practical worn work shirt, tool belt, recording tablet, worried but stubborn expression, no battle armor, standing beside old touring repair car, rainy abandoned town, neon signage reflected in puddles, warm human feeling, road trip fantasy RPG style, cinematic anime game key visual, high saturation anime
```

## 8.4 诺伊

```text
身份：眠沙镇少年
年龄：12—14岁
特征：从小没听过真正音乐，却能听见残响
作用：
  1. 引出旧钢琴
  2. 引出“音乐为什么危险但仍被渴望”
  3. 后续可成为侦查型角色或残响感知者
```

诺伊台词：

```text
“他们说钢琴响了怪物就会来。”
“那为什么我还是想听？”
```

提示词：

```text
anime young boy NPC, thin child with messy brown hair, oversized old jacket, holding torn music score, curious and frightened eyes, standing near sealed old piano in rainy town square, withered rose petals scattered near the piano legs, forbidden music atmosphere, cinematic gothic lighting, emotional game NPC design
```

## 8.5 米拉奶奶

```text
身份：旧剧场前售票员
年龄：70+
特征：记得眠沙镇最后一场合法演出
作用：提供旧剧场钥匙、票根支线、地下室伏笔
```

台词：

```text
“我不是想听曲子。”
“我只是想确认，那些夜晚不是我一个人编出来的梦。”
```

提示词：

```text
elderly anime NPC woman, gentle wrinkled face, old ticket seller uniform, small faded rose brooch on collar, holding faded theater tickets, standing in abandoned theater lobby beneath a cracked crystal chandelier, warm sadness, gothic opera music town background, cinematic soft lighting
```

## 8.6 白栖

```text
身份：静默署见习巡逻员
年龄：16—18岁
特征：戴封音项圈，被训练成“害怕音乐”的孩子
作用：可成为敌对、可被说服、后续白谱院实验伏笔
```

台词：

```text
“我不是讨厌音乐。”
“我只是每次听见它，项圈都会疼。”
```

提示词：

```text
anime young patrol girl, pale hair, grey uniform, black sound-sealing collar around neck engraved with thorn-like restraint pattern, conflicted expression, holding silence authority badge, rainy town checkpoint, cinematic cold lighting, tragic NPC design
```

## 8.7 乌鸦先生

```text
身份：唱片店老板
年龄：不明
特征：总戴黑手套，保存旧录音
作用：提供主角母亲录音、旧时代唱片、隐藏情报
```

台词：

```text
“唱片被刮掉，不代表旋律死了。”
“有些声音藏在划痕下面。”
```

提示词：

```text
mysterious anime record shop owner, black gloves, round glasses, dark vest, surrounded by scratched vinyl records, dim warm amber light, secretive smile, forbidden music archive atmosphere, cinematic film noir shadows
```

## 8.8 伊莱娜

```text
身份：静默署正式队长
性别：女性
立场：不是纯反派，认为音乐确实危险，但也怀疑高层
作用：追捕玩家 / 潜在盟友 / 后续分歧角色
```

台词：

```text
“我见过音乐引来的尸体。”
“所以别用希望两个字，轻易替危险辩护。”
```

提示词：

```text
anime female silence authority captain, sharp eyes, dark grey official uniform, white gloves, short silver hair, single black rose emblem pin on collar, elegant but severe posture, holding sound-seal device, rainy street confrontation, cinematic dramatic lighting, morally complex antagonist NPC
```

---

# 09. 眠沙镇 NPC 群像

眠沙镇不应该是空地图，而应该像一座真的快要死去的小镇。

## 9.1 镇民分类

```text
1. 恐惧音乐派
   认为音乐一定会引来怪物。
   代表：铁匠、巡逻协助员、失去家人的母亲。

2. 怀念音乐派
   年轻时听过演出，还想再听一次。
   代表：米拉奶奶、旧剧场灯光师、唱片店老板。

3. 利用音乐派
   暗中用乐器残响吸引噬响体，再售卖怪物残骸。
   代表：地下商人、黑市搬运工。

4. 不知道音乐是什么的新生代
   没听过真正旋律，只从传闻里理解音乐。
   代表：诺伊和废弃学校的孩子们。

5. 官方沉默派
   支持静默署，认为沉默才是秩序。
   代表：白栖、伊莱娜、镇长代理。
```

## 9.2 镇长代理：霍尔特

```text
身份：眠沙镇临时管理者
性格：疲惫、实用主义、怕出事
作用：阻碍玩家公开调查，但不是坏人
```

台词：

```text
“我不在乎你们是不是好人。”
“我只知道，一旦钢琴响了，死的是我的镇民。”
```

提示词：

```text
middle-aged anime town administrator, tired face, old formal vest, wet documents in hand, standing under broken town hall sign, conflicted realistic NPC, rainy abandoned town
```

## 9.3 灯光师：奥托

```text
身份：旧剧场最后一任灯光师
特征：失去听力，但还能靠灯光记住音乐
作用：舞台机关支线、Boss战灯光机关
```

台词：

```text
“我听不见了。”
“可我记得哪一束灯应该落在哪一个人身上。”
```

提示词：

```text
old theater lighting technician anime NPC, deaf elderly man, carrying rusty spotlight tools, cloudy eyes but gentle smile, abandoned stage lights, nostalgic opera atmosphere
```

## 9.4 双胞胎：琳与铃

```text
身份：废弃学校孩子
特征：一个说话，一个从不说话；两人能一起完成无声合唱
作用：迷你游戏、静默场事件
```

提示词：

```text
anime twin girls NPC, one talkative one silent, simple worn school clothes, holding chalk and erased sheet music, abandoned classroom, emotional forbidden song atmosphere
```

---

# 10. 敌方阵营与反派设定

## 10.1 卡戎 · 断拍者

```text
身份：反派指挥家
称号：断拍者
所属：回声议会禁曲派 / 或独立黑幕组织
过去：前白谱院指挥家
理念：
  自由音乐必然引发灾难。
  自由律者必然失控。
  只有被完全控制的旋律才配存在。
武器：黑银指挥棒“默令”
外观：黑色礼服、暗红内衬、半面烧焦乐谱面具
战斗风格：不亲自近战，通过节拍、环境、失控律者、小怪群压制玩家
```

卡戎不是“单纯想毁灭世界”。

他认为自己在拯救世界。

他见过太多指挥家失控、律者反噬、音乐引怪、城镇毁灭。

所以他得出扭曲结论：

```text
音乐不能自由。
律者不能自由。
指挥家也不能自由。
```

台词：

```text
“你以为自己在拯救音乐。”
“可你连下一拍会杀死谁都不知道。”
```

提示词：

```text
tall villain conductor, black formal suit, dark red lining, black rose boutonniere with visible thorns on the lapel, half mask made of burnt sheet music, black-silver baton, elegant cruel smile, suspended broken notes around him, crimson backlight, gothic opera antagonist, rain and ruined theater, dramatic silhouette composition, MAPPA MADHOUSE anime film quality, high saturation anime game style
```

## 10.2 瑟萝弥 · 黑弥撒

```text
身份：卡戎麾下反派律者
性别：女性
音乐情绪：神圣、压迫、审判、黑色祷告
武器：十字长枪 + 管风琴浮游炮
外观：黑白修女式战斗礼服，金色五线谱蒙眼纹
性格：温柔语气，但每句话都像宣判
```

瑟萝弥并非完全服从卡戎。

她像一首被迫只剩“审判”部分的乐曲。

台词：

```text
“忏悔吧。”
“如果你不知道自己错在哪里，我可以替你决定。”
```

提示词：

```text
female antagonist Musicart, black-and-white gothic nun battle dress, veil shaped like torn sheet music, black thorn-vine embroidery along the hem, single wilted white rose pinned at the chest, eyes covered by glowing golden stave lines like sacred blindfold, black and silver eyeshadow, crimson lower-eye shadow, emotionless judgmental gaze, cross-shaped lance, floating organ-pipe cannons, terrifying holy aura, crimson church stage lighting, dramatic backlit composition, MAPPA MADHOUSE anime film quality, high saturation anime
```

## 10.3 剥音校尉

```text
身份：第零章前期 Boss
本质：被卡戎失败调律的人形噬响体
原型：静默署士兵 + 破碎乐谱 + 节拍器核心
外观：半身军装、半身舞台木偶、胸口嵌入坏掉的节拍器
能力：剥夺声音、召唤无声合唱、切断指挥节拍
作用：第零章中后段 Boss，让玩家第一次面对“人为制造的怪物”
```

台词：

```text
无完整语言。
只会断断续续重复：
“安静……”
“归队……”
“禁止……演奏……”
```

提示词：

```text
early boss monster, half silence officer half broken theater puppet, cracked porcelain mask, military coat fused with wooden marionette limbs, thorny black vines growing through the joints, wilted rose fused into the broken metronome core in chest, sound-sealing chains, black red music corruption, terrifying elegant dissonance creature, rainy ruined theater stage, cinematic dramatic lighting, anime game boss design
```

---

# 11. 小怪生态与前期 Boss

## 11.1 默谱飞蛾

```text
类型：飞行小怪
外观：翅膀像烧焦乐谱纸，振翅声像翻页
能力：群体骚扰、打断吟唱、追踪微弱旋律
弱点：火光、强节奏冲击、阿缇娅直线炮击
```

提示词：

```text
small dissonance moth monsters, wings made of burnt sheet music paper, thin thorn-like veins running through the wing edges, glowing black notes, fluttering like turning pages, rain, forbidden piano, eerie beautiful monster design, cinematic gothic lighting
```

## 11.2 断拍木偶

```text
类型：地面小怪
外观：旧剧场木偶，关节是节拍器零件
能力：按固定节奏冲锋，若玩家打乱节拍可眩晕
弱点：弥洛低音壁垒、节奏反制
```

提示词：

```text
broken theater marionette monster, metronome joints wrapped in thin black thorn-vines, cracked porcelain face, old performance costume with a single wilted rose stitched to the chest, moving in wrong rhythm, gothic opera dissonance creature, cinematic dramatic lighting, anime game enemy design
```

## 11.3 静音犬

```text
类型：巡逻小怪
外观：像由黑胶唱片碎片和犬骨拼成
能力：锁定声音来源、沉默角色技能一回合
弱点：诱导声源、无声琴键迷你游戏道具
```

提示词：

```text
sound-hunting dog monster, body made of broken vinyl records and black bone, thorny black tendrils along the spine, no mouth, glowing red ears, tracks sound waves, rainy alley, dark music fantasy creature, cinematic gothic lighting
```

## 11.4 失声唱诗班

```text
类型：召唤型小怪
外观：没有脸的孩子幻影，穿破旧合唱服
能力：给 Boss 回复护盾、制造静默场
弱点：恢复它们被擦掉的歌词
```

提示词：

```text
faceless children's choir ghosts, worn school choir uniforms, small wilted rose pinned on each collar, erased mouths, holding torn sheet music, silent singing, pale golden and black aura, tragic dissonance enemy, abandoned classroom, cinematic somber lighting
```

## 11.5 前期 Boss：舞台爬行者

```text
类型：第一阶段大怪
外观：旧剧场、钢琴、木偶、幕布拼合而成
核心：胸口黑红节拍器
能力：
  假幕落：吞噬掩体
  钢琴键重击：直线范围伤害
  木偶线缠绕：限制律者行动
  舞台灯闪烁：降低命中
```

提示词：

```text
giant dissonance beast made of broken stage, piano keys, puppet arms and torn red curtain, thorny black vines growing through the cracks of its body, wilted roses scattered along its spine, black-red metronome core in chest, crawling from beneath abandoned theater, rain and steam, gothic opera boss, cinematic dramatic lighting, MAPPA MADHOUSE anime film quality, anime game monster
```

## 11.6 前期 Boss：剥音校尉

```text
类型：第零章中后段人形 Boss
战斗目标：击破声音封锁，救回镇民声音
阶段：
  P1 静默压制
  P2 无声合唱召唤
  P3 节拍器核心暴走
  P4 卡戎远程干涉，强行提高同频过载概率
```

---

# 12. 第零章主线剧情节点

## ch0_000 开场 CG：无声钢琴

```text
类型：开场回忆
地点：主角童年旧屋
背景：夜晚，一架不能发声的钢琴，一盏小灯，母亲坐在琴前
```

场景提示词：

```text
dark room, broken silent piano under small warm lamp, child hand hovering above keys, dust floating in light, forbidden music atmosphere, emotional anime cinematic, black and gold, melancholic
```

剧情：

> 黑屏中先出现节拍。  
>  
> 一、二、三、四。  
> 一、二、三、四。  
>  
> 那不是钢琴声。  
> 是幼年主角用手指敲在膝盖上的声音。  
>  
> 母亲坐在钢琴前，没有让琴响。  
> 她只是轻轻按住主角的手。  

母亲：

```text
“不要急。”
“每一首曲子开始前，都要先学会等待。”
```

幼年主角：

```text
“那什么时候可以弹？”
```

母亲：

```text
“等你遇见一个即使害怕，也愿意听完的人。”
```

画面切换至多年后雨夜公路。

---

## ch0_001 雨夜公路：眠沙镇入口

```text
类型：主线
地点：暴雨中的荒野公路
角色：主角、安柠、缇雅、弥洛暂未登场
```

场景提示词：

```text
rainy abandoned highway, old repair touring car, broken prohibition signs, distant ruined town, flickering neon sign reading tonight performance, wet asphalt reflecting crimson and gold light, gothic road opera anime background
```

剧情：

> 雨刷器来回摆动，像一支疲惫的节拍器。  
>  
> 远处，眠沙镇的霓虹牌半亮半灭。  
> 上面写着：  
>  
> 【今夜有演出】  
>  
> 可这个世界已经很多年没有演出了。  

安柠：

```text
“补给、换胎、找地方睡觉。”
“然后我们立刻离开。”
```

缇雅：

```text
“如果那里真的有钢琴呢？”
```

安柠：

```text
“那就假装没看见。”
```

主角内心：

```text
“我做不到。”
```

选择：

```text
A “停车。我想看看那块牌子。”
效果：主角执念+2，安柠担忧+2

B “先找补给，别节外生枝。”
效果：安柠好感+2

C “缇雅，你也听见了吗？”
效果：缇雅好感+3
```

---

## ch0_002 眠沙镇：没有人唱歌的地方

```text
地点：眠沙镇主街
角色：主角、安柠、缇雅、诺伊、镇民
```

场景提示词：

```text
abandoned music town, sealed instruments in shop windows, wet stone street, torn concert posters, red prohibition seals, old theater at the end of street, gothic rain atmosphere, anime RPG background
```

剧情：

> 眠沙镇不像死城。  
> 它更像一座被命令屏住呼吸的城。  
>  
> 唱片店橱窗里摆着被刮花的黑胶。  
> 乐器行的门被钉死。  
> 酒馆门口挂着牌子：  
>  
> 【本店不播放音乐，请安心入内。】  
>  
> 这句话比废墟更难受。  

诺伊出现。

诺伊：

```text
“你们是外面来的？”
“你们车上……有乐器吗？”
```

安柠：

```text
“没有。”
```

诺伊：

```text
“可我听见了。”
```

选择：

```text
A “你听见了什么？”
效果：诺伊好感+3

B “别靠近我们。”
效果：诺伊恐惧+2，安柠担忧+1

C “安柠，给他一点吃的。”
效果：镇民信任+1
```

---

## ch0_003 广场旧钢琴：第一次诱惑

```text
地点：眠沙镇广场
核心物件：被封条缠住的旧钢琴
```

场景提示词：

```text
old grand piano in ruined town square, covered with red prohibition seals, rain dripping on keys, lonely child standing nearby, protagonist reaching toward piano, black-gold emotional anime scene
```

剧情：

> 广场中央的旧钢琴，被三层禁演封条缠住。  
>  
> 它不像乐器。  
> 像一具还没下葬的遗体。  

诺伊：

```text
“他们说，只要钢琴响，怪物就会来。”
```

主角：

```text
“他们没说错。”
```

诺伊：

```text
“那为什么我还是想听？”
```

主角内心：

```text
“因为我也想。”
```

选择：

```text
A “只弹一个音。”
效果：噬响反应+5，诺伊希望+5，主角执念+3

B “我教你无声弹法。”
效果：进入迷你游戏【无声琴键】，安全路线

C “把封条重新贴好。”
效果：安柠好感+3，诺伊失望+3
```

---

## ch0_004 迷你游戏：无声琴键

```text
类型：迷你游戏
玩法：按键只下沉一半，不让琴槌真正敲击琴弦
目标：让诺伊看见旋律，而不是听见旋律
```

成功：

```text
诺伊学会无声旋律。
获得标签【无声旋律】。
后续卡戎评价：“你连沉默都能指挥，真危险。”
```

失败：

```text
琴键发出极轻声音。
噬响反应+3。
默谱飞蛾提前出现。
```

---

## ch0_005 夜晚餐馆：三个人与一杯热水

```text
地点：旧餐馆避难所
角色：主角、安柠、缇雅、诺伊可选
```

场景提示词：

```text
abandoned diner at night, cracked neon sign, warm table lamp, protagonist, mechanic girl, childhood friend girl sitting together, rain outside window, emotional road trip anime scene
```

剧情：

> 餐馆里只有一盏灯能亮。  
> 安柠把罐头倒进锅里。  
> 味道很糟，但至少是热的。  
>  
> 缇雅盯着那架被雨水淋湿的旧钢琴照片，忽然说：  

缇雅：

```text
“如果只弹一首，会不会也算太贪心？”
```

主角：

```text
“在这个世界里，一个音都算。”
```

安柠：

```text
“所以你们两个知道自己很危险吧？”
```

缇雅：

```text
“知道。”
“可知道和不想听，不是一回事。”
```

选择：

```text
A “明天我们就离开。”
效果：安柠好感+2，缇雅失落+2

B “我想查清这个镇子的事。”
效果：主角执念+2，缇雅好感+2

C “如果真的要弹，必须先保证大家安全。”
效果：理性路线，后续战斗获得准备加成
```

---

## ch0_006 主角梦境：母亲的四拍

```text
地点：梦境旧屋
角色：主角、母亲、卡戎幻影
```

场景提示词：

```text
surreal dream room, mother sitting at silent piano, rain falling indoors, golden music notes floating like dust, child protagonist watching from doorway, melancholic anime dream sequence
```

母亲：

```text
“你还是想按下去。”
```

主角：

```text
“我只是想让他听见。”
```

母亲：

```text
“你一直都是这样。”
“明明自己也害怕，却总想先把别人从害怕里拉出来。”
```

梦境崩塌。

卡戎的声音出现：

```text
“她教得不错。”
“可惜，她没有教你——”
“有些旋律，从一开始就不该被允许。”
```

---

## ch0_007 清晨失声：镇民的声音被拿走

```text
地点：钟楼广场
事件：整个眠沙镇大范围失声
```

场景提示词：

```text
gray morning abandoned town, townspeople gathered under clock tower, no birds, broken bell, protagonist investigating, cold blue dawn, black-gold UI atmosphere
```

剧情：

> 第二天清晨，眠沙镇没有任何声音。  
> 没有鸟叫。  
> 没有风声。  
> 连人群的脚步都像被厚布包住。  
>  
> 一个老人张着嘴，却发不出声音。  
> 一个孩子哭得满脸通红，哭声却没有传出来。  

安柠：

```text
“不是他们不说话。”
“是声音被拿走了。”
```

选择：

```text
A “先救镇民，找回他们的声音。”
效果：镇民希望+5，进入支援路线

B “直接去钟楼找源头。”
效果：主线推进快，镇民恐惧+3

C “去旧剧场，昨晚那里不对劲。”
效果：提前发现卡戎残留
```

---

## ch0_008 地图开放：失声的眠沙镇

```text
开放地点：
1. 钟楼
2. 唱片店
3. 旧剧场
4. 广场旧钢琴
5. 餐馆避难所
6. 废弃学校
7. 乐器行
8. 镇长办公室
9. 地下排水道
```

系统提示：

```text
【地图探索开放】
【完成任意三处事件后，将推进主线】
【拖延过久会导致静默场增强】
```

---

## ch0_009 支线主线交叉：废弃学校无声合唱

```text
地点：废弃学校音乐教室
角色：诺伊、双胞胎琳铃、失声孩子们
```

场景提示词：

```text
abandoned classroom, children standing silently, old chalkboard with erased music notes, broken harmonium, morning dust, emotional anime game background
```

剧情：

孩子们每天早上偷偷练习无声合唱。

他们没有真正唱出来，只是张口、记节拍、做口型。

现在，他们连口型都做不出来了。

黑板上写着：

```text
如果声音会害人，
那我们可以只把歌留在心里吗？
```

选择：

```text
A 帮他们找回歌词
效果：获得【被擦掉的歌词】

B 教他们打无声节拍
效果：静默场稳定度 -1

C 让他们马上离开
效果：安全，但孩子希望-3
```

---

## ch0_010 唱片店：划痕下面的声音

```text
地点：唱片店
角色：乌鸦先生
```

剧情：

乌鸦先生打开地下柜子，里面全是被刮花的唱片。

他说：

```text
“他们刮掉音轨的时候，以为声音死了。”
“可声音有时候会躲进划痕里。”
```

迷你游戏：

```text
波形修复
从杂音中找出正确旋律片段
```

成功获得：

```text
【旧时代录音】
【母亲声音残片 01】
```

录音内容：

```text
“如果有一天这段录音被你听见……”
“说明我没能按时回来。”
“不要找我。”
“至少，现在不要。”
```

---

## ch0_011 旧剧场后台：缇雅的演出裙

```text
地点：旧剧场后台
角色：主角、缇雅、米拉奶奶
```

剧情：

米拉奶奶打开后台。

里面挂着一条发旧的演出裙。

【风格强化】裙摆绣着一整圈几乎褪色的暗红蔷薇纹样，针脚细密，显然是手工绣的——米拉奶奶说，这是旧剧场关闭前，最后一位女高音特意留下的戏服，"她说总有一天，会有人替她把这首歌唱完"。

缇雅轻轻碰了一下，笑着说：

```text
“我穿这个会不会很奇怪？”
```

主角：

```text
“不会。”
```

缇雅：

```text
“那等音乐回来以后，我要穿着它上台。”
```

这是悲剧前最后的温柔节点。

选择：

```text
A “我给你伴奏。”
效果：缇雅好感+5

B “安柠会说我们疯了。”
效果：轻松对话，安柠好感+1

C “等这一切结束。”
效果：埋下死亡回响
```

---

## ch0_012 钟楼调查：人为调慢的钟声

```text
地点：钟楼
角色：主角、安柠、白栖、弥洛首次出现
```

剧情：

钟楼里有被人为调慢的机关。

每一次钟声慢半拍，静默场就更深一层。

白栖阻止主角调查。

白栖：

```text
“未授权人员不得接触钟楼。”
```

安柠：

```text
“整个镇子都没声音了，你还在背条例？”
```

白栖：

```text
“条例至少能让人活着。”
```

弥洛出现。

他不是从门口进入，而是从钟声残响里显现。

弥洛：

```text
“这不是钟声。”
“这是命令。”
```

系统提示：

```text
【临时律者：弥洛 · 低鸣骑士 进入剧情】
【暂未建立完整契约】
```

---

## ch0_013 禁曲演出：灾难发生

```text
地点：旧剧场舞台
事件：缇雅为了救镇民，决定完成无声旋律的最后一拍
```

剧情：

卡戎暗中放大静默场。

镇民声音被进一步抽走。

诺伊倒在旧钢琴旁，手里还抓着乐谱。

缇雅看向主角：

```text
“如果不让它响，大家的声音会永远消失。”
```

安柠：

```text
“你们别告诉我又要弹琴。”
```

主角：

```text
“不是为了引怪。”
“是为了把他们的声音叫回来。”
```

缇雅坐到钢琴前。

她弹下第一拍。

没有声音。

第二拍。

仍然没有声音。

第三拍。

整个镇子的静默场开始裂开。

第四拍还没落下，噬响体群从剧场地下涌出。

---

## ch0_014 缇雅濒死：阿缇娅觉醒

```text
地点：燃烧的旧剧场
事件：缇雅保护主角，被噬响体重创
```

场景提示词：

```text
burning abandoned theater, secret forbidden performance turning into disaster, black musical cracks, girl shielding protagonist, white pendant breaking, crimson and gold transformation light, tragic anime scene
```

剧情：

> 噬响体的黑色音叉刺穿舞台。  
>  
> 主角被推开。  
>  
> 缇雅挡在前面。  
> 她没有喊疼。  
> 甚至没有叫主角的名字。  
>  
> 她只是笑了一下。  
> 好像终于把那第四拍弹完了。  

缇雅：

```text
“你听见了吗？”
```

主角：

```text
“缇雅……”
```

缇雅：

```text
“那就好。”
```

白色吊坠碎裂。

【风格强化】碎裂的光粒掠过后台衣架，那条绣着暗红蔷薇的演出裙被气浪掀起一角，像是提前替她应了那句"等音乐回来以后"。

阿缇娅变身。

眼部特写：

```text
人类瞳孔碎裂。
金色音符瞳浮现。
深紫与暗红眼影从眼尾扩散。
眼下金色五线谱像泪痕一样亮起。
```

阿缇娅睁眼：

```text
“个体名废弃。”
“律者名：阿缇娅 · 暮星序曲。”
“检测到奏者候选。”
```

她手中凝聚出黑金指挥棒。

她将指挥棒抛给主角。

主角接住。

系统提示：

```text
【指挥权限建立】
【奏者契约成立】
【警告：非正规契约】
```

---

## ch0_015 第一战：默谱飞蛾群

```text
类型：教学战
出战：阿缇娅
敌人：默谱飞蛾 × 6
目标：保护诺伊与镇民
```

阿缇娅技能：

```text
暮星刺击 | AP1 | 主角健康 -5 | 单体突刺
断奏炮声 | AP2 | 主角健康 -10 | 直线音波炮
星屑护步 | AP1 | 主角健康 -6 | 为主角减免下一次反噬
冷却呼吸 | AP0 | 主角健康 +3 | 暂缓指挥恢复稳定
```

战斗提示：

```text
每次释放律者技能都会消耗主角健康值。
健康值归零则战斗失败。
```

---

## ch0_016 第二战：舞台爬行者

```text
类型：双律者教学战
出战：阿缇娅 + 弥洛
Boss：舞台爬行者
目标：击破节拍器核心
```

剧情：

弥洛正式加入战斗。

如果玩家为男性：

```text
系统提示：
【男性奏者指挥男性律者时，有概率触发同频过载】
```

如果玩家为女性：

```text
系统提示：
【女性奏者指挥女性律者时，有概率触发同频过载】
```

Boss机制：

```text
假幕落：吞噬掩体
钢琴键重击：直线范围攻击
木偶线缠绕：限制律者
幕布遮光：降低命中
节拍器暴走：每两回合强化一次
```

胜利：

```text
获得【黑色节拍器残片】
阿缇娅信任+3
弥洛信任+2
主角健康上限临时 -5
```

---

## ch0_017 茶歇初解锁：她不是缇雅

```text
地点：餐馆避难所
角色：主角、阿缇娅、安柠
```

剧情：

阿缇娅盯着热水。

安柠：

```text
“喝。”
```

阿缇娅：

```text
“我不需要补充水分。”
```

安柠：

```text
“我知道。”
“但你看着它超过十分钟了。”
```

阿缇娅看向主角：

```text
“你看着我的时间也过长。”
```

主角：

```text
“抱歉。”
```

阿缇娅：

```text
“你在寻找另一个人。”
“我不是她。”
```

选择：

```text
A “我知道。可我还需要时间。”
效果：阿缇娅信任+5，压力-2

B “那你是谁？”
效果：解锁个人故事【暮星的空白】

C “至少现在，你在这里。”
效果：阿缇娅共鸣+4
```

---

## ch0_018 卡戎登场：默令之声

```text
地点：旧剧场后台
角色：卡戎、主角、阿缇娅、弥洛
```

剧情：

后台传来指挥棒敲地声。

一下。

两下。

第三下没有落下。

主角的心跳却被迫补上那一拍。

卡戎：

```text
“不完整的奏者。”
“不完整的律者。”
“不完整的演出。”
```

主角：

```text
“你是谁？”
```

卡戎：

```text
“曾经，我也以为名字重要。”
“后来我发现，能让世界安静下来的人，才重要。”
```

选择：

```text
A “你引来了噬响体？”
获得线索【人为诱导噬响】

B “你认识我母亲？”
获得线索【零号奏者计划】

C “阿缇娅，准备战斗。”
阿缇娅信任+2，但跳过部分情报
```

---

## ch0_019 Boss战：剥音校尉

```text
地点：旧剧场主舞台
Boss：剥音校尉
出战：两名律者
目标：打破静默场，救回镇民声音
```

Boss阶段：

```text
P1 静默军令
  随机沉默一名律者技能

P2 无声合唱
  召唤失声唱诗班，为 Boss 回盾

P3 节拍器核心暴走
  每回合提高伤害，主角健康消耗增加

P4 默令干涉
  卡戎远程敲击指挥棒，同频过载概率+8%
```

阿缇娅独演雏形：

```text
名称：暮星未完成
触发条件：
  阿缇娅共鸣 >=70
  主角健康 <40%
效果：
  清除一次静默军令
  对节拍器核心造成大量伤害
  主角健康少量恢复
剧情：
  阿缇娅第一次没有立刻执行战斗逻辑。
  她回头看了主角一眼。
  那一眼不是缇雅，也不是兵器。
  是一个刚诞生的灵魂，第一次决定不想让你死。
```

胜利：

```text
镇民声音恢复
获得【默令残页】
获得【剥音节拍器】
卡戎撤退
瑟萝弥短暂露面
```

---

## ch0_020 尾声：下一站由玩家选择

```text
地点：雨后公路
角色：主角、安柠、阿缇娅、弥洛、诺伊、镇民
```

诺伊：

```text
“以后……音乐还会回来吗？”
```

选择：

```text
A “会。只是不是今天。”
效果：诺伊希望+5，获得称号【禁曲的第一声】

B “我不知道，但我会去找答案。”
效果：安柠好感+3，阿缇娅共鸣+2

C “只要还有人记得，它就没有消失。”
效果：解锁世界观碎片【静默不等于死亡】
```

安柠：

```text
“下一站去哪？”
“白谱院？”
“追那个面具疯子？”
“还是先找你母亲的线索？”
```

路线分歧出现：

```text
路线 A：前往白谱院
路线 B：追查卡戎
路线 C：留在眠沙镇修复旧剧场
路线 D：寻找主角母亲
```

主角内心：

```text
“我不是自己走上舞台的。”
“我是被她扔来的指挥棒砸中的。”
“可从我接住它的那一刻开始，”
“下一拍，就必须由我决定。”
```

系统：

```text
【第零章 · 禁曲未响 完】
```

---

# 13. 地图探索与支线事件

## E001 诺伊的无声旋律

```text
地点：广场旧钢琴
内容：
  诺伊想学会不用声音也能弹奏的方法。
```

选择：

```text
A 耐心教他
  诺伊希望+5
  获得【无声旋律】

B 告诉他别再碰钢琴
  安柠好感+2
  诺伊失望+4

C 让阿缇娅观察他
  阿缇娅疑惑+3
  解锁对话“人类为什么想听音乐”
```

## E002 安柠的健康检查

```text
地点：餐馆避难所
内容：
  安柠强制检查主角右腕契约刻痕。
```

选择：

```text
A 配合检查
  获得【稳定绷带】

B 隐瞒疼痛
  后续战斗健康上限 -3

C 开玩笑说“还没断”
  安柠好感+2
  她会骂你
```

## E003 阿缇娅看见旧裙子

```text
地点：旧剧场后台
内容：
  阿缇娅看见缇雅曾经想穿的演出裙。
```

选择：

```text
A “那是她的，不是你的。”
  阿缇娅信任+4

B “你想试试看吗？”
  阿缇娅压力+3，共鸣+3

C “我们走吧。”
  跳过情绪事件
```

## E004 弥洛的低音

```text
地点：钟楼
内容：
  弥洛听着坏掉的钟，说它慢了半拍。
```

选择：

```text
A 追问他的过去
  弥洛压力+5
  解锁个人故事伏笔

B 陪他站一会儿
  弥洛信任+4
  同频过载概率下降

C 让他检查钟楼
  获得线索【人为调慢的钟声】
```

## E005 唱片店里的刮痕

```text
地点：唱片店
内容：
  所有唱片都被刮掉音轨，只有一张还残留微弱旋律。
```

玩法：

```text
波形修复迷你游戏
```

成功：

```text
获得【旧时代录音】
获得【母亲声音残片 01】
```

失败：

```text
触发小型噬响战斗
```

## E006 白栖的封音项圈

```text
地点：镇入口
内容：
  白栖的项圈在主角靠近时发出低频警告。
```

选择：

```text
A 询问项圈来源
  获得线索【白谱院实验部门】

B 帮她暂时关闭痛觉反馈
  白栖信任+5
  静默署关注度+3

C 无视她
  白栖后续更可能敌对
```

## E007 米拉奶奶的最后一张票

```text
地点：旧剧场售票口
内容：
  米拉奶奶保存着最后一张合法演出票。
```

选择：

```text
A 收下票根
  解锁地下室入口

B 让她自己保管
  米拉好感+3

C 问她当年发生了什么
  获得世界观碎片【最后一场演出】
```

## E008 乌鸦先生的黑胶试音

```text
地点：唱片店地下室
内容：
  乌鸦先生让玩家在三张刮花唱片中选择一张修复。
```

选择结果：

```text
A 母亲录音
  主角身世线推进

B 旧剧场录音
  眠沙镇历史线推进

C 卡戎旧演讲
  反派线推进
```

## E009 静默署巡逻队

```text
地点：镇入口
内容：
  伊莱娜带队进入眠沙镇，怀疑玩家非法演奏。
```

选择：

```text
A 交涉
  需要安柠好感 >=5
  成功避免战斗

B 躲避
  触发潜行小游戏

C 正面亮出奏者身份
  静默署关注度+5
  后续路线更危险
```

## E010 旧剧场灯光机关

```text
地点：旧剧场舞台上方
NPC：奥托
内容：
  玩家帮助奥托重新调整舞台灯。
```

成功：

```text
Boss战中可使用一次【追光灯】
效果：暴露 Boss 核心，命中率提高
```

失败：

```text
Boss战中舞台灯随机闪烁，命中率降低
```

---

# 14. 茶歇互动与个人故事

## 14.1 茶歇系统说明

茶歇不是纯好感系统，而是用来稳定律者状态。

变量：

```text
信任 Trust
共鸣 Resonance
压力 Pressure
记忆残响 Memory Echo
同频风险 Overload Risk
```

茶歇效果：

```text
高信任：降低同频过载概率
高共鸣：解锁独演
高压力：提高随机行动概率
记忆残响：解锁个人剧情
```

## 14.2 阿缇娅茶歇 01：她不是缇雅

阿缇娅：

```text
“你看着我的时候，在寻找另一个人。”
```

选择：

```text
A “我知道。可我还需要时间。”
  阿缇娅信任+5
  压力-2

B “那你是谁？”
  解锁个人故事【暮星的空白】

C “对不起。”
  阿缇娅信任+3
  主角愧疚+2
```

## 14.3 阿缇娅个人故事：暮星的空白

内容：

阿缇娅发现自己并非完全没有记忆。

她不记得缇雅的人生，却会在看到旧钢琴、白裙子、诺伊的无声旋律时产生胸口疼痛。

她问主角：

```text
“如果我不是她。”
“那我为什么会因为她的东西疼？”
```

选择：

```text
A “你不需要成为她。”
  阿缇娅信任+8

B “可我还是会想她。”
  阿缇娅压力+5，共鸣+3

C “我们一起找答案。”
  开启长期个人线【暮星重奏】
```

## 14.4 弥洛个人故事：低音不说谎

内容：

弥洛曾经有自己的奏者。

那名奏者在一次同频过载中被他误伤。

所以弥洛害怕被再次指挥。

选择：

```text
A “我会学习你的节奏。”
  弥洛信任+6
  同频过载概率下降

B “战场上我需要你服从。”
  弥洛信任-2
  前两回合稳定性提高

C “害怕不是错误。”
  弥洛共鸣+5
```

## 14.5 安柠个人事件：别再少活十分钟

安柠：

```text
“你知道你刚才少活了多久吗？”
```

主角：

```text
“不知道。”
```

安柠：

```text
“我也不知道。”
“所以我才害怕。”
```

选择：

```text
A “我会尽量少用技能。”
  安柠好感+4

B “如果不用，会死更多人。”
  安柠理解+2，担忧+3

C “对不起。”
  安柠好感+3
```

---

# 15. 迷你游戏设计

## 15.1 无声琴键

```text
玩法：按键下沉到指定位置，不能真正发声
失败条件：琴槌敲击琴弦
成功奖励：无声旋律标签
```

## 15.2 波形修复

```text
玩法：在噪声波形中找出旋律片段
成功奖励：旧时代录音
失败惩罚：触发小型噬响战
```

## 15.3 静默潜行

```text
玩法：避开静默署巡逻队视线
特殊机制：玩家不能制造声音
成功奖励：降低静默署关注度
失败惩罚：强制交涉或战斗
```

## 15.4 舞台灯调试

```text
玩法：按照奥托记忆中的灯光顺序调整追光灯
成功奖励：Boss战追光灯支援
失败惩罚：Boss战命中率降低
```

## 15.5 残谱拼读

```text
玩法：将撕碎的四段乐谱按旋律走向排列
正确顺序：上行、停顿、下行、回归
成功奖励：旧剧场钥匙
失败惩罚：噬响反应+3
```

---

# 16. 战斗系统与数值变量

## 16.1 基础变量

```text
playerGender = male / female
health = 主角健康值
maxHealth = 主角健康上限
atyaTrust = 阿缇娅信任
atyaResonance = 阿缇娅共鸣
atyaPressure = 阿缇娅压力
miloTrust = 弥洛信任
miloPressure = 弥洛压力
annenFavor = 安柠好感
townHope = 眠沙镇希望
silenceField = 静默场强度
dissonanceLevel = 噬响反应
authorityAttention = 静默署关注度
caronTrace = 卡戎痕迹
motherClue = 母亲线索
```

## 16.2 战斗限制

```text
每场战斗最多携带两名律者。
律者技能释放消耗主角健康值。
健康值归零，战斗失败。
同频过载可能导致技能随机、额外扣血、提前释放。
茶歇与信任可以降低过载概率。
```

## 16.3 状态

```text
静默：无法释放主动技能
乱奏：技能目标随机
回响：下一次技能增强，但健康消耗增加
护谱：降低健康消耗
默令：反派干涉，同频过载概率上升
残响：战斗后解锁记忆片段
```

---

# 17. 变身眼部设计提示词库

> 这一部分是你上次特别强调的重点：  
> **律者变身最重要的是眼影、眼线、眼部设计。**  
> 不要只写“beautiful eyes”，要写清楚：眼线怎么变化、眼影怎么扩散、瞳孔怎么变成音乐符号、眼下怎么出现乐谱纹。

## 17.1 眼部设计总规则

律者变身时，眼部变化代表：

```text
人类意识破裂
谱核接管身体
乐曲人格苏醒
Musicart 身份形成
```

眼部必须有以下层次：

```text
1. 人类原本瞳孔碎裂
2. 金色或特殊色音乐符号瞳出现
3. 眼尾出现夸张但精致的舞台眼线
4. 深紫 / 暗红 / 黑金眼影从眼尾扩散
5. 眼下出现五线谱纹、音符纹或金色泪痕
6. 虹膜中倒映破碎吊坠或乐谱碎片
7. 眼泪变成金色粒子
【风格强化】8. 眼尾眼影扩散的轮廓可参考蔷薇花瓣的层叠形态，而非规则晕染——让"哭"与"绽放"在视觉上是同一件事
```

## 17.2 通用变身眼部模块

```text
detailed eye design, transformation eye close-up, glowing musical-note pupils, golden stave lines inside the irises, dramatic violet and crimson eyeshadow spreading from the outer corners, sharp elegant opera eyeliner, subtle golden glitter under the lower lashes, tiny sheet-music markings beneath the eyes, tears turning into light particles, beautiful tragic anime eyes, intense emotional gaze
```

中文解释：

```text
详细眼部设计，变身眼部特写，发光音符瞳，虹膜内有金色五线谱纹，深紫与暗红眼影从眼尾扩散，锐利优雅的歌剧眼线，下睫毛下方有细碎金粉，眼下有小型乐谱纹，眼泪化为光粒，悲剧美丽的二次元眼睛，强烈情绪凝视。
```

## 17.3 阿缇娅眼部专用模块

```text
golden eyes with faint purple shadows, star-shaped musical-note pupils, dark violet and crimson eyeshadow spreading from the outer corners like blooming rose petals, sharp black-purple upper eyeliner, tiny golden stave lines glowing under the lower lashes, tear-like golden light trails occasionally shaped like falling petals, broken white pendant light reflected in her irises, beautiful but emotionless gaze, tragic Musicart transformation
```

中文解释：

```text
金色眼睛，带淡紫阴影，星形音符瞳，深紫与暗红眼影从眼尾扩散、形态如同绽放的蔷薇花瓣，黑紫色锐利上眼线，眼下有细小金色五线谱光纹，像金色泪痕（偶尔化作飘落花瓣的形状），虹膜倒映破碎白色吊坠的光，美丽但冷淡的眼神，悲剧律者变身。
```

## 17.4 变身瞬间眼部特写

```text
extreme close-up of the Musicart girl's eyes during transformation, human pupils shattering into glowing golden musical-note pupils, dark violet and crimson eyeshadow blooming like ink from the outer corners, sharp opera eyeliner forming instantly, golden stave lines spreading beneath her eyes, broken pendant light reflected in her irises, tears turning into golden particles, tragic beautiful anime transformation, cinematic lighting, high detail
```

## 17.5 主角接棒眼部设计

主角不是律者，所以不能画得太妖。

重点是：

```text
痛
震惊
被选中
第一次听见世界乐谱
眼中倒映律者和指挥棒
```

提示词：

```text
protagonist eyes widening in pain and shock, dark golden pupils reflecting floating music notes and black-gold baton, faint golden stave ring appearing around the iris, subtle tired under-eye shadows, no heavy makeup, emotional conductor awakening, tragic destiny moment, cinematic eye close-up
```

## 17.6 反派律者眼部设计

瑟萝弥 · 黑弥撒：

```text
eyes covered by glowing golden stave lines like a sacred blindfold, black and silver eyeshadow, crimson lower-eye shadow, hidden pupils behind musical scripture, emotionless judgmental gaze, terrifying holy Musicart aura, gothic opera eye design
```

## 17.7 男性律者眼部设计

弥洛：

```text
calm grey-blue eyes, subtle silver lower eyeliner, faint blue-gold bass-clef pattern in the iris, restrained knightly gaze, low-frequency sound wave reflection, no heavy makeup, elegant male Musicart eye design
```

## 17.8 失控眼部效果

```text
overload eye effect, pupils trembling with unstable musical notes, golden stave lines cracking around the iris, violet and crimson shadow spreading unevenly, black dissonance veins near the eyes, painful beautiful unstable Musicart gaze, loss of control transformation detail
```

---

# 18. 全角色 AI 绘图提示词

## 18.1 第零章主视觉

```text
anime game key visual, young male or female protagonist in simple white shirt and black vest catching a black-and-gold conductor baton, golden stave scar burning on right wrist with faint thorn-vine pattern, newly transformed purple-haired Musicart girl behind them with a black rose motif at her waist, detailed transformation eye design, dark violet and crimson eyeshadow shaped like blooming rose petals, glowing golden musical-note pupils, broken white pendant fragments floating, black rose petals swirling in the rain, rainy abandoned town square, sealed old piano, monsters emerging from darkness, black gold crimson lighting, theatrical spotlight composition, emotional tragic music fantasy, MAPPA MADHOUSE anime film quality, high saturation, cinematic key visual composition
```

## 18.2 阿缇娅变身完整提示词

```text
tragic anime Musicart transformation, dying girl transforming into elegant battle Musicart, short dark-purple hair, golden musical-note pupils, dark violet and crimson eyeshadow spreading from outer corners like rose petals, sharp opera eyeliner, golden stave lines glowing under lower lashes like tears, broken white pendant fragments floating around her chest, black and crimson gothic opera battle dress forming from light and torn sheet music, an unopened black rose blooming at her waist, thorn-vine trim along the hem and boots, black-gold conductor baton materializing in her hand, rain and fire, black rose petals swirling around her, abandoned theater stage with a shattered crystal chandelier, beautiful tragic expression, dramatic theatrical spotlight, MAPPA MADHOUSE anime film quality, high saturation anime game style, cinematic lighting
```

## 18.3 阿缇娅抛出指挥棒

```text
newly awakened female Musicart throwing a black-and-gold conductor baton toward the protagonist, golden musical-note pupils, dramatic violet crimson eyeshadow shaped like rose petals, tears turning into gold particles, broken pendant fragments, black rose petals scattered in the wind, rain, fire, monsters in background, protagonist reaching out with bandaged hand, tragic contract moment, gothic opera anime key scene, dynamic motion composition, black gold lighting, MAPPA MADHOUSE anime film quality, high detail
```

## 18.4 男主接棒

```text
anime male protagonist catching black-and-gold conductor baton, simple white shirt, black short vest, small withered black rose brooch on vest, dark trousers, no long coat, no cape, bandage burning open on right wrist, golden stave scar with faint thorn-vine pattern spreading from palm to wrist, dark golden eyes reflecting music notes, pain and shock expression, black rose petals drifting through the rain, rainy burning theater, dramatic low-angle composition, tragic destiny contract, MAPPA MADHOUSE anime film quality, high saturation anime game style
```

## 18.5 女主接棒

```text
anime female protagonist catching black-and-gold conductor baton, simple white shirt, black short vest, practical dark skirt or trousers, no long coat, no cape, right wrist bandage burning open, golden stave scar with faint thorn-vine pattern spreading to fingers, amber eyes reflecting floating notes, emotional pain and shock, broken pendant fragments, black rose petals drifting through the rain, rainy burning theater, dramatic low-angle composition, tragic destiny contract, MAPPA MADHOUSE anime film quality, high saturation anime game style
```

## 18.6 卡戎

```text
tall villain conductor, black formal suit, dark red lining, black rose boutonniere with visible thorns, half mask made of burnt sheet music, black-silver baton, elegant cruel smile, floating broken notes, black rose petals drifting past him, crimson backlight, abandoned theater balcony beneath a shattered chandelier, gothic opera antagonist, rain, dramatic silhouette composition, MAPPA MADHOUSE anime film quality, high saturation anime game style
```

## 18.7 瑟萝弥

```text
female antagonist Musicart, black-and-white gothic nun battle dress, veil shaped like torn sheet music, black thorn-vine embroidery along the hem, wilted white rose pinned at the chest, eyes covered by glowing golden stave lines like sacred blindfold, black and silver eyeshadow, crimson lower-eye shadow, cross-shaped lance, floating organ-pipe cannons, terrifying holy aura, crimson church stage lighting, dramatic backlit composition, MAPPA MADHOUSE anime film quality, high saturation anime game boss design
```

## 18.8 剥音校尉

```text
early boss monster, half silence officer half broken theater puppet, cracked porcelain mask, military uniform fused with marionette limbs, thorny black vines threading through the joints, wilted rose fused into the broken metronome core in chest, sound-sealing chains, black red music corruption, rainy ruined theater stage, terrifying elegant dissonance creature, cinematic dramatic lighting, anime game boss
```

---

# 19. 后续路线分歧

第零章不强制接某一条第一章。

玩家可以选择后续方向。

## 19.1 路线 A：前往白谱院

```text
关键词：治疗、学院、异常契约、律者理论、主角身体检查
适合后续：传统主线
```

开场钩子：

```text
白谱院医生看见主角右腕刻痕后，脸色变了。
他说：
“这不是普通契约。”
“这是被废弃的零号格式。”
```

## 19.2 路线 B：追查卡戎

```text
关键词：黑暗巡演、反派指挥家、失控律者、禁曲派
适合后续：黑幕线
```

开场钩子：

```text
卡戎留下的默令残页上，有半枚白色吊坠的图案。
主角意识到，缇雅吊坠不是唯一一枚。
```

## 19.3 路线 C：修复眠沙镇旧剧场

```text
关键词：基地建设、NPC羁绊、音乐复兴、城镇经营
适合后续：经营支线
```

开场钩子：

```text
诺伊问：
“如果我们不能去听演出，那我们能不能自己建一个不会害人的舞台？”
```

## 19.4 路线 D：寻找主角母亲

```text
关键词：母亲录音、零号奏者计划、旧时代秘密、白谱院实验
适合后续：主角身世线
```

开场钩子：

```text
乌鸦先生修复出的录音最后一句是：
“如果他真的接住了指挥棒，就告诉他——”
录音到这里断了。
```

---

# 20. 伏笔表

```text
1. 主角母亲可能参与过“零号奏者计划”。
2. 主角体内活谱核不是自然觉醒，而是早年被植入。
3. 缇雅吊坠只剩半枚，另一半可能在卡戎手中。
4. 阿缇娅不是缇雅，但继承了缇雅最后一瞬间的愿望。
5. 弥洛曾经误伤奏者，那名奏者可能没有真正死亡。
6. 诺伊可以听见残响，后续可能成为侦查型角色。
7. 白栖的封音项圈来自白谱院实验部门。
8. 乌鸦先生保存着主角母亲的录音。
9. 伊莱娜不是纯敌人，她会根据玩家选择成为追捕者或盟友。
10. 剥音校尉只是卡戎的失败试验品。
11. 瑟萝弥并非完全服从卡戎，她也在等待被解放。
12. 卡戎真正想证明的是：自由律者必然失控，自由音乐必然带来灾难。
13. 眠沙镇旧剧场可以后续变成玩家基地或巡演据点。
14. 米拉奶奶的票根支线可以解锁旧剧场隐藏地下室。
15. 第零章不必须接白谱院，可以接任何后续主线方向。
16. 阿缇娅眼下的金色五线谱纹可能不是装饰，而是缇雅最后的旋律。
17. 主角接棒时看到的金色谱线，与母亲失踪前留下的四拍有关。
18. 卡戎见过主角母亲，并称她为“第一个不肯安静的人”。
19. 静默署内部并不统一，有人相信禁令，有人知道禁令背后的实验。
20. 后续可以出现更多律者，但每场战斗仍限制两名，除非特殊剧情支援。
```

---

# 21. 负面提示词总表

## 21.1 主角负面提示词

```text
negative prompt:
long trench coat, windbreaker, cape, cloak, luxury coat, royal outfit, complex military uniform, heavy armor, futuristic armor, oversized coat, too many accessories, holding baton before transformation, sword, gun, mature adult, old man, old woman, muscular body, commander uniform, prince outfit, ballroom dress, fantasy armor, overly large rose corsage, flat lighting, generic stock anime face
```

## 21.2 阿缇娅负面提示词

```text
negative prompt:
modern casual outfit, school uniform, plain makeup, no eye details, normal human eyes, no musical pupils, no eyeshadow, no eyeliner, overly cute expression, comedy style, low detail, simple dress, sci-fi armor, mecha parts, bright pastel color palette, cute chibi style, oversized cartoonish rose decoration, flat lighting
```

## 21.3 反派负面提示词

```text
negative prompt:
goofy villain, clown costume, casual clothes, bright cheerful colors, superhero armor, cyberpunk neon armor, smiling friendly face, no mask, low detail, simple background, cartoonish rose graphics, flat lighting, generic stock villain pose
```

## 21.4 怪物负面提示词

```text
negative prompt:
generic zombie, gore, realistic horror, modern gun monster, sci-fi robot, cute mascot, simple animal, low detail, clean body, no music elements, no theater elements, bright cheerful color palette, cartoonish flower decoration, flat lighting
```

---

# 22.【风格强化】视觉美术圣经：蔷薇、荆棘与华彩歌剧体系

> 本章为新增内容，用于统一全篇美术方向，方便后续第一章、第二章沿用同一套视觉语言。  
> 不影响、不替换前面任何章节的原始设定，仅作为美术提示词的"总纲"补充。

## 22.1 为什么是蔷薇与荆棘

世界观内的解释（可直接用于剧情或美术设定集）：

```text
静默纪元之前，眠沙镇旧剧场每一场谢幕都会向观众席抛洒蔷薇。
禁令降临后，花田被认为"容易引来聚集，助长怀念情绪"，
和乐器一起被连根铲除。
只有少数几株，被镇民偷偷移到自家后院、旧剧场地下室、
或者像米拉奶奶那样，绣进一条不能再穿上台的裙子里。
律者变身时周身浮现的暗紫暗红色眼影与荆棘状纹路，
并非单纯的美术装饰——
而是活谱核在读取"人类最后记忆"时，
最常调取到的画面之一，就是那一捧被藏起来的蔷薇。
所以荆棘与蔷薇，代表的是"被禁止的美"本身。
```

## 22.2 全篇统一色板

```text
主色：黑（禁令 / 静默 / 舞台幕布）
辅色：暗金（指挥棒 / 契约谱线 / 舞台灯）
点缀色：暗红与深紫（蔷薇 / 眼影 / 悲剧情绪）
冷色对照：灰蓝（弥洛 / 理性 / 未松动的秩序）
禁忌色：极少量纯白（吊坠 / 母亲 / 尚未被玷污的记忆）
```

## 22.3 华彩歌剧场景母题（可套用在任意新增场景提示词前段）

```text
gothic opera theater architecture, shattered crystal chandelier, torn crimson velvet curtain, dust-covered orchestra pit, tall broken stained-glass windows, rows of empty seats, a single spotlight cutting through falling rain indoors, black rose petals scattered across the stage floor, grand piano draped in prohibition seals
```

## 22.4 通用追加提示词（可粘贴在任意角色 / 场景提示词末尾，统一质感）

```text
MAPPA MADHOUSE anime film production quality, cinematic key visual composition, dramatic theatrical lighting, volumetric rain and dust particles, gothic opera color grading, high budget anime movie still, intricate costume detail, emotionally charged tragic atmosphere
```

## 22.5 通用追加负面提示词

```text
negative prompt:
bright cheerful daytime lighting, flat color anime style, chibi proportions, comedic expression, plain minimalistic background, modern casual streetwear, cartoonish oversized flowers, low budget webtoon style, sterile clean studio lighting
```

## 22.6 使用建议

```text
1. 角色类提示词：原提示词 + 该角色专属细节 + 22.4通用追加提示词
2. 场景类提示词：22.3歌剧场景母题 + 原场景提示词 + 22.4通用追加提示词
3. 所有生成图统一追加 22.5 负面提示词，避免风格跑偏成明快日常番
4. 后续新增角色（第一章及以后）建议先套用22.2色板，再决定该角色属于"暖色阵营"或"冷色阵营"
```

---

# 最终核心句

> 指挥棒不是主角带来的。  
> 是阿缇娅在变身时，从死亡和乐曲中生成，再抛给主角的。  
>  
> 主角不是主动成为指挥家。  
> 是在最不该接住命运的时候，接住了那支黑金色指挥棒。  
>  
> 从那一刻开始，  
> 每一次音乐响起，  
> 都会有人被拯救，  
> 也都会从主角身上带走一点生命。  

【风格强化 · 补充收束句】

> 就像那一整片被连根铲除的蔷薇田，  
> 剩下的人只能把它绣进裙摆，藏进后院，别在衣领上。  
> 荆棘不会因为被禁止而消失，  
> 它只会长得更深、更暗、更接近骨头。  
> 而阿缇娅眼下那一道金色泪痕，  
> 就是这个世界，唯一还敢公开绽放的一朵。

---
