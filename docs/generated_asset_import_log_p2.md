# 生成素材接入记录 P2

日期：2026-07-01

## 场景与敌人补充素材

生成方式：
- 背景使用内置图像生成工具，按白金歌剧版世界观生成 16:9 视觉小说背景。
- 敌人使用纯绿 chroma-key 背景生成后，用本地透明抠图脚本转为 PNG 透明素材。

已写入：

```txt
assets/generated/backgrounds/bg_white_score_morning_bell_plaza_v02.png
assets/generated/backgrounds/bg_white_score_tea_lounge_v02.png
assets/generated/backgrounds/bg_echo_council_organ_chamber_v02.png
assets/generated/backgrounds/bg_silent_core_tuning_fork_v02.png
assets/generated/enemies/enemy_sound_moth_swarm_v02.png
assets/generated/enemies/enemy_broken_beat_puppet_v02.png
assets/generated/enemies/boss_beatless_conductor_v02.png
```

接入位置：
- `game.js`
  - `qixianPlaza` -> `bg_white_score_morning_bell_plaza_v02.png`
  - `teaLounge` -> `bg_white_score_tea_lounge_v02.png`
  - `echoCouncil` -> `bg_echo_council_organ_chamber_v02.png`
  - `silentCore` -> `bg_silent_core_tuning_fork_v02.png`
  - `soundMothSwarm` -> `enemy_sound_moth_swarm_v02.png`
  - `offbeatBeast` -> `enemy_broken_beat_puppet_v02.png`
  - `noBeatBoss` -> `boss_beatless_conductor_v02.png`
- 茶歇入口与角色茶歇场景使用 `teaLounge`。
- 第二章静默核心相关场景使用 `silentCore`。
- E302 议会问责使用 `echoCouncil`，E303/E304 使用 `teaLounge`。

检查项：
- `node --check game.js`
- `index.html` / `style.css` / `game.js` 引用的 `assets/` 路径存在性检查

## 角色立绘 P3

生成方式：
- 内置图像生成工具按白金歌剧版角色设定生成。
- 使用纯绿 chroma-key 背景，再通过本地透明抠图脚本转为 PNG。
- 当前先用同一张新版立绘覆盖每名律者的基础、表情、战斗占位，避免不同界面出现风格跳变；后续可以继续追加独立表情差分。

已写入：

```txt
assets/generated/characters/char_huaixu_white_gold_fullbody_v02.png
assets/generated/characters/char_luowen_white_gold_fullbody_v02.png
assets/generated/characters/char_yifubai_white_gold_fullbody_v02.png
assets/generated/characters/char_mingxian_white_gold_fullbody_v02.png
```

接入位置：
- `game.js`
  - 槐序：`default` / `guarded` / `sarcastic` / `dissonance` / `battle`
  - 洛温：`default` / `burdened` / `observing` / `guardian` / `battle`
  - 伊芙白：`default` / `tired` / `insight` / `falseCheer` / `battle`
  - 明弦：`default`

## 角色状态差分 P4

调整原因：
- 视觉小说/文字剧情游戏不能只靠单张立绘。当前改为每名核心律者至少 4-5 个状态，供剧情台词、茶歇 mood、高压力和战斗界面调用。

已写入并接入：

```txt
assets/generated/characters/char_huaixu_guarded_white_gold_v02.png
assets/generated/characters/char_huaixu_sarcastic_white_gold_v02.png
assets/generated/characters/char_huaixu_dissonance_white_gold_v02.png
assets/generated/characters/char_huaixu_battle_white_gold_v02.png
assets/generated/characters/char_luowen_observing_white_gold_v02.png
assets/generated/characters/char_luowen_guardian_white_gold_v02.png
assets/generated/characters/char_luowen_burdened_white_gold_v02.png
assets/generated/characters/char_luowen_battle_white_gold_v02.png
assets/generated/characters/char_yifubai_falseCheer_white_gold_v02.png
assets/generated/characters/char_yifubai_insight_white_gold_v02.png
assets/generated/characters/char_yifubai_tired_white_gold_v02.png
assets/generated/characters/char_yifubai_battle_white_gold_v02.png
assets/generated/characters/char_mingxian_default_white_gold_v02.png
assets/generated/characters/char_mingxian_challenge_white_gold_v02.png
assets/generated/characters/char_mingxian_burdened_white_gold_v02.png
assets/generated/characters/char_mingxian_battle_white_gold_v02.png
```

处理方式：
- 每名角色先生成 4 状态横向表。
- 本地自动裁剪为单独状态 PNG。
- chroma-key 去绿底。
- 连通域清理边缘碎片，避免相邻状态残片混入。

当前接入规则：
- 槐序：`default` 保留完整基础图；`guarded` / `sarcastic` / `dissonance` / `battle` 使用差分。
- 洛温：`default` 保留完整基础图；`observing` / `guardian` / `burdened` / `battle` 使用差分。
- 伊芙白：`default` 保留完整基础图；`falseCheer` / `insight` / `tired` / `battle` 使用差分。
- 明弦：`default` / `challenge` / `burdened` / `battle` 使用差分。
