# 珏衡状态立绘重生成提示词 v01

## 角色锚点

- 角色：珏衡，外显约 22 岁，白谱院正式登记在册的监察律者，本人自愿签署契约，负责内部执法。
- 核心区别：她保留完整人格与姓名；胸前/领口登记编号牌旁必须同时刻有本名，区别于静默序列“编号取代姓名”。
- 性格：恪尽职守，信奉“规则保护弱者”，对职责有近乎信仰般的认同；后续弧光是从动摇到主动表态。
- 外貌：银灰色短发利落束起，锐利但不空洞的浅蓝灰眼，制服式白金学院军礼袍，黑手套。
- 标志物：白金硬朗制服、胸前登记编号牌+本名、白金披风/长外袍、审谱杖（ruler-like conductor baton / score-examining rod）。

## 通用生成约束

```text
Use case: stylized-concept
Asset type: transparent-background visual novel standing character sprite
Subject: Juheng / 珏衡, female inspector Musicart, apparent age around 22, sleek silver-grey short hair neatly tied back, sharp light blue-grey eyes with genuine conviction rather than emptiness, structured formal academy-military hybrid uniform in white and gold, black gloves, white fitted trousers, white lace-up heeled boots, white-and-gold cape/long coat with dark inner lining, official registration tag on the chest or collar displayed alongside her actual name engraved beside it, holding a ruler-like conductor baton weapon called a score-examining rod.
Style/medium: high-quality 2D anime visual novel sprite, polished gacha character art, MAPPA / MADHOUSE anime film quality, clean painterly linework, crisp edges.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background for local background removal.
Composition/framing: full body from head to boots, centered front-facing 3/4 standing pose, generous padding around hair, cape hem, hands, score-examining rod, and boots; no cropping.
Lighting/mood: clear formal studio lighting, crisp white-gold uniform, disciplined and vivid, not hollow.
Constraints: preserve chapter 3 clean reference identity and outfit silhouette; show both registration number and personal name concept visually on the badge/tag; she is a voluntary registered Musicart with real will. Background must be exactly flat #ff00ff. No cast shadow, no contact shadow, no reflection, no floor plane, no texture in background.
Avoid: green rim, magenta glow on the character, semi-transparent body, hollow blank expression, cracked porcelain mask, chains or restraints, rust-red palette, missing name tag, aggressive villain sneer, revealing outfit, cropped feet, watermark, text.
```

## 六态表情与姿态

- `default`：标准监察立正，冷静尽责，审谱杖垂直握持。
- `smile`：极轻微的认可笑意，仍克制，像终于承认“我看见了”。
- `worried`：职责与所见事实冲突，眉眼动摇但仍守礼。
- `serious`：执行转移程序/进入 Boss 战前，目光坚定，审谱杖准备格挡。
- `shocked`：听见“自愿不等于所有人自愿”后的短暂震动，编号牌/姓名牌成为视觉焦点。
- `special`：表决大会公开表态/格挡节奏态，白金几何光纹与审谱杖节拍环展开，不做空壳化。

