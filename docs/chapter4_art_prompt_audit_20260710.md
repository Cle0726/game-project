# 第四章美术提示词审计与加固说明（2026-07-10）

## 本轮目标

用户要求重新检查第四章自生成图片素材，并在继续美术设计前参考以下站点：

- https://takt-op.fandom.com/wiki/Takt_op._-_Game
- https://dic.pixiv.net/a/%E5%AE%BF%E5%91%BD%E5%9B%9E%E5%93%8D
- https://game.takt-op.jp/
- https://zh.wikipedia.org/zh-cn/%E5%AE%BF%E5%91%BD%E8%BF%B4%E9%9F%BF

重点要求：

1. 背景、人物、场景图片都要有后续可维护的“一致性通用”提示词。
2. 人物脸部和服装不要变化太大。
3. 律者变身的眼影和眼部设计必须锁定。
4. 避免提示词把第四章生成成纯黑、废墟、脏黑、末世废土。

## 参考后的设计判断

参考站点共同指向的是：音乐、指挥者、Musicart / 律者、古典乐幻想、华丽角色、舞台感与高完成度二次元视觉。即使世界观存在灾害和 D2，也不能把第四章直接做成写实废墟或黑色末世。

第四章“不夜终响”的正确视觉锚点应为：

```text
完整、华丽、过度维护、永不谢幕的黑漆绯红歌剧列车。
恐怖感来自“不该继续的演出被强行维持”，不是破败、脏乱、坍塌和废墟。
```

## 已检查的第四章素材

已生成接触表：

- `tmp/ch4_asset_contact_sheet_review.png`

素材范围：

- `assets/generated/chapter4/keyvisuals/cg_ch4_main_key_v01.png`
- `assets/generated/chapter4/backgrounds/bg_ch4_nightless_train_corridor_v01.png`
- `assets/generated/chapter4/backgrounds/bg_ch4_audience_car_v01.png`
- `assets/generated/chapter4/backgrounds/bg_ch4_core_organ_chamber_v01.png`
- `assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_*.png`
- `assets/generated/chapter4/sprites/enemies/enemy_ch4_qilan_duo_sprite_default_v01.png`
- `assets/generated/chapter4/sprites/enemies/boss_ch4_seluomi_final_sprite_default_v01.png`
- `assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_sprite_default_v01.png`

## 风险结论

旧提示词中存在以下风险词：

```text
black lacquer, dark gothic opera train, deep crimson, cold final confrontation, subtle violet-black corruption
```

这些词本身符合第四章，但如果没有硬约束，会让 AI 误解为：

```text
纯黑图、黑色废墟、压黑剪影、废弃列车、脏工业遗迹、末世残骸、恐怖废土。
```

因此旧提示词“不够保险”，必须加固。

## 已完成的文件更新

### 1. 新增第四章统一美术提示词模板

- `prompts/chapter4/ch4_visual_asset_prompt_system_v02.md`

新增内容包括：

- 第四章总规则：防止 AI 生成黑色废墟。
- 场景通用正向词与负面词。
- 色彩比例锁定：黑漆、绯红、烛光、古金、窗外蓝黑夜景。
- 人物一致性锁定。
- 律者 / Musicart 眼部设计锁定。
- 阿缇娅、弥洛、零四、瑟萝弥、卡戎、岐岚专属模块。
- 背景、CG、结尾图的可维护提示词。
- 出图后检查清单。

核心硬规则：

```text
第四章不是黑废墟；它是一列完整、华丽、过度保养、永不谢幕的黑漆绯红歌剧列车。
```

### 2. 加固现有第四章战斗敌方素材提示词

- 更新：`prompts/battle_assets/ch4_battle_enemy_prompts_v01.md`
- 备份：`prompts/battle_assets/ch4_battle_enemy_prompts_v01.before_v02.md`

加固点：

- 所有敌方素材加入“不要压黑、不要废墟、不要黑团剪影”的硬规则。
- 岐岚、瑟萝弥、卡戎分别加入身份锁定。
- 增强黑色服装的可读性要求：glossy lacquer highlights / ivory highlights / antique gold trim / crimson rim light。
- 加入明确负面词：monochrome black image、crushed blacks、pure dark ruin、rubble、destroyed train、dirty industrial ruin、post-apocalyptic debris 等。

## 后续出图执行建议

1. 先使用 `prompts/chapter4/ch4_visual_asset_prompt_system_v02.md` 的第 0 节作为全局追加词。
2. 角色图必须追加第 1 节人物一致性锁定。
3. 阿缇娅相关图必须追加第 1.3 节，尤其是金色音符瞳、红紫眼影、眼下五线谱痕。
4. 零四相关图必须追加第 1.5 节，强调“恢复中的暖金裂光”，不要生成丧尸、尸体、鬼怪。
5. 背景图若平均亮度太低或黑区死成一片，应弃用重跑。
6. 战斗素材抠图后要在浅色背景和深色背景各看一次，确认不是黑团。

## 一句话结论

旧提示词会有生成黑色调甚至废墟感的风险；本轮已经把第四章提示词系统改为“完整华丽歌剧列车 + 人物脸部眼部锁定 + 强负面反废墟”的可维护版本。
