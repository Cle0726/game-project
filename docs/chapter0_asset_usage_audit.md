# 第零章图片使用审计

## 结论

第零章原先存在一个资源使用错误：

```text
*_mother_v01.png 是角色/敌人母图设定板。
它们包含正面、背面、脸部特写、道具、小场景参考。
这类图不能直接作为图文游戏里的立绘、战斗图或队伍卡图。
```

已建立新的资源分层：

```text
母图来源：
assets/generated/chapter0/characters/*_mother_v01.png
assets/generated/chapter0/enemies/*_mother_v01.png

游戏显示用透明立绘/战斗图：
assets/generated/chapter0/sprites/characters/*_sprite_*.png
assets/generated/chapter0/sprites/enemies/*_sprite_*.png
```

## 已接入的游戏显示角色图

```text
char_ch0_anning_sprite_default_v02.png
char_ch0_atya_sprite_transformed_ai_v01.png
char_ch0_baiqi_sprite_default_ai_v01.png
char_ch0_charon_sprite_default_v02.png
char_ch0_elena_sprite_default_v01.png
char_ch0_grandma_mira_sprite_default_v02.png
char_ch0_holt_sprite_default_v01.png
char_ch0_ling_sprite_default_v01.png
char_ch0_lin_sprite_default_v01.png
char_ch0_milo_sprite_default_v02.png
char_ch0_mother_sprite_default_v02.png
char_ch0_mr_crow_sprite_default_v02.png
char_ch0_noi_sprite_default_v01.png
char_ch0_otto_sprite_default_v01.png
char_ch0_protagonist_rinche_sprite_pre_contract_v03.png
char_ch0_protagonist_rinsa_sprite_pre_contract_v03.png
char_ch0_serolomy_sprite_default_v01.png
char_ch0_tiya_sprite_default_ai_v01.png
```

## 已接入的游戏显示敌人图

```text
boss_ch0_sound_stripping_officer_sprite_default_v01.png
boss_ch0_stage_crawler_sprite_default_v01.png
enemy_ch0_broken_beat_marionette_sprite_default_v01.png
enemy_ch0_mute_score_moth_sprite_default_v01.png
enemy_ch0_silence_hound_sprite_default_v01.png
enemy_ch0_voiceless_choir_sprite_default_v01.png
```

## 代码接入

```text
game.js / ASSETS.characters:
default、battle、transformed、chapter0PreContract 已改为 sprites 路径。
sourceMother / chapter0Mother 仅作为设定源保留，不用于显示。

game.js / ASSETS.enemies:
第零章敌人全部改为 sprites/enemies 路径。

docs/chapter0_sprite_final_contact_sheet.png:
最终显示层检查表。棋盘格代表透明区域。

tmp/chapter0_new_npc_sprites_contact_sheet.png:
第零章支线 NPC 追加检查表。包含奥托、霍尔特、伊莱娜、琳、铃；透明边缘 edgeAlpha 均为 0。
```

## 已废弃的坏抠图

```text
char_ch0_mother_sprite_default_v01.png:
脸部被透明洞破坏，已由 v02 替换。

char_ch0_protagonist_rinche_sprite_pre_contract_v02.png:
脸部与手部存在透明洞，已由 v03 替换。

char_ch0_protagonist_rinsa_sprite_pre_contract_v02.png:
手部与身体边缘存在透明洞，已由 v03 替换。

char_ch0_anning_sprite_default_v01.png:
旧版边缘与服装抠图残留明显，已由 v02 替换。

char_ch0_mr_crow_sprite_default_v01.png:
脸部透明洞与留声机残块破坏立绘完整性，已由 v02 替换。

char_ch0_grandma_mira_sprite_default_v01.png:
头部缺失，不能作为游戏立绘，已由 v02 替换。

char_ch0_charon_sprite_default_v01.png:
脚下与衣摆含旧地面残影，已由 v02 替换。

char_ch0_milo_sprite_default_v01.png:
脚下含旧地面残影，已由 v02 替换。
```

## 保留的特殊图

```text
char_ch0_atya_eye_transformation_closeup_v01.png:
这是眼部变身 CG，不是母图设定板，可以继续直接作为 eyeCloseup / 背景 CG 使用。

cg_ch0_baton_contract_v01.png:
这是接棒契约 CG，不是母图设定板，可以继续直接作为关键 CG 使用。

backgrounds/*.png:
这些是场景背景，不属于母图问题范围。

main_menu_chapter0_key_bg_v01.png:
这是第零章主菜单专用 key visual，采用暖金雨夜剧场区构图，避免纯黑废墟感。
```

## 后续生成规则

```text
1. mother 图只用于保持角色脸、服装、眼部设计、道具元素一致。
2. 游戏中任何可见立绘、队伍卡、战斗图，都必须优先使用 sprites、cutout、portrait、cg 等显示用途文件。
3. 新增状态图命名建议：
   char_ch0_atya_stand_calm_v01.png
   char_ch0_atya_stand_wounded_v01.png
   char_ch0_atya_stand_eye_glow_v01.png
   char_ch0_tiya_stand_smile_v01.png
   char_ch0_anning_stand_angry_v01.png
4. 不允许把 *_mother_v01.png 直接写入 ASSETS.characters.default、battle、transformed 或 ASSETS.enemies。
5. 若只是暂时从母图裁切，也必须输出到 sprites 或临时 derived 目录，不能直接引用母图；最终接入 game.js 前必须确保没有整张纸板/设定板背景。
```
