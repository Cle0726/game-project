# 律者剧情状态图矩阵（第1-3章）

范围：只维护第一章到第三章会登场的四名律者。人物脸型、发型、服装主轮廓、眼影和眼部高光必须保持一致；新增状态图只改变表情、姿态、局部光效和战斗张力。

## 槐序

- `default`: `assets/generated/characters/char_huaixu_white_gold_fullbody_v02.png`，档案/抽卡全身图。
- `guarded`: `assets/generated/characters/char_huaixu_guarded_white_gold_v02.png`，防备、被追问、低信任对话。
- `sarcastic`: `assets/generated/characters/char_huaixu_sarcastic_white_gold_v02.png`，讽刺、轻挑、缓和压力。
- `dissonance`: `assets/generated/characters/char_huaixu_dissonance_white_gold_v02.png`，失谐、记忆碎片、第三章核心真相。
- `battle`: `assets/generated/characters/char_huaixu_battle_white_gold_v02.png`，出战、技能、队伍选择卡。

## 洛温

- `default`: `assets/generated/characters/char_luowen_white_gold_fullbody_v02.png`，档案/抽卡全身图。
- `observing`: `assets/generated/characters/char_luowen_observing_white_gold_v02.png`，冷静观察、路线判断。
- `guardian`: `assets/generated/characters/char_luowen_guardian_white_gold_v02.png`，护卫、防守、低音墙。
- `burdened`: `assets/generated/characters/char_luowen_burdened_white_gold_v02.png`，压力、受损、责任感。
- `battle`: `assets/generated/characters/char_luowen_battle_white_gold_v02.png`，出战、技能、队伍选择卡。

## 伊芙白

- `default`: `assets/generated/characters/char_yifubai_white_gold_fullbody_v02.png`，档案/抽卡全身图。
- `falseCheer`: `assets/generated/characters/char_yifubai_falseCheer_white_gold_v02.png`，玩笑、伪装轻松、试探。
- `insight`: `assets/generated/characters/char_yifubai_insight_white_gold_v02.png`，看穿局势、信息分析。
- `tired`: `assets/generated/characters/char_yifubai_tired_white_gold_v02.png`，疲惫、低落、压力。
- `battle`: `assets/generated/characters/char_yifubai_battle_white_gold_v02.png`，出战、技能、队伍选择卡。

## 明弦

- `default`: `assets/generated/characters/char_mingxian_white_gold_fullbody_v02.png`，档案/抽卡全身图。
- `storyDefault`: `assets/generated/characters/char_mingxian_default_white_gold_v02.png`，普通剧情对话半身状态。
- `challenge`: `assets/generated/characters/char_mingxian_challenge_white_gold_v02.png`，挑衅、强硬推进。
- `burdened`: `assets/generated/characters/char_mingxian_burdened_white_gold_v02.png`，压力、旧伤、责任。
- `battle`: `assets/generated/characters/char_mingxian_battle_white_gold_v02.png`，出战、技能、队伍选择卡。

## 透明底要求

- 剧情状态小立绘必须为 PNG 透明底，不能保留绿色 chroma-key。
- 全身档案图可以保留非透明背景，但队伍卡、对话头像、战斗 UI 应优先使用状态小立绘。
- 新增状态建议命名：`char_<id>_<state>_white_gold_v02.png`，状态名保持英文小驼峰或单词。
