# 第一章 · 黑巡半响 接入记录（2026-07-05）

## 来源文件

- `F:\提示词\宿命回响 第一章 黑巡半响 完整版.md`

## 当前接入范围

- 新第一章入口：`chapter1_start`
- 新第一章主线链：`ch1_black_000` 到 `ch1_black_011`
- 旧 `ch1_*` / `ch2_*` / `ch3_*` 保持在 `chapter3_archive_start`，不参与新第一章。

## 已接入内容

- 路线B：追查卡戎
- 默令残页与白色吊坠花纹
- 雾茧站地图节点
- 钟先生情报交易
- 尤娜、柯婆婆登场
- 雾中巡逻支线入口
- 静默序列-零四 Boss
- 瑟萝弥站台对峙与验收战
- 章末卡戎广播与路线分歧
- 双律者合奏：以 `暮弦双鸣` 事件/战斗行动接入

## 新增战斗

- `ch1_fog_patrol`
- `ch1_silent_sequence_04`
- `ch1_seluomi_trial`

## 新增/接入素材

- `F:\《宿命回响：残响之途》游戏项目\assets\worldmap\map_ch1_mujian_station_atlas_v01.png`
- `F:\《宿命回响：残响之途》游戏项目\assets\worldmap\thumb_ch1_mujian_station_atlas_v01.png`
- `F:\《宿命回响：残响之途》游戏项目\assets\generated\chapter1\backgrounds\bg_ch1_mujian_station_platform_v01.png`
- `F:\《宿命回响：残响之途》游戏项目\assets\generated\chapter1\backgrounds\bg_ch1_station_inn_warm_v01.png`
- `F:\《宿命回响：残响之途》游戏项目\assets\generated\chapter1\keyvisuals\cg_ch1_silent_sequence_04_confrontation_v01.png`
- `F:\《宿命回响：残响之途》游戏项目\assets\generated\chapter1\keyvisuals\cg_ch1_seluomi_platform_standoff_v01.png`
- `F:\《宿命回响：残响之途》游戏项目\assets\generated\chapter1\sprites\characters\char_ch1_yuna_sprite_default_v01.png`
- `F:\《宿命回响：残响之途》游戏项目\assets\generated\chapter1\sprites\characters\char_ch1_zhong_sprite_default_v01.png`
- `F:\《宿命回响：残响之途》游戏项目\assets\generated\chapter1\sprites\enemies\enemy_ch1_silent_sequence_04_sprite_default_v01.png`

## 素材总览

- `F:\《宿命回响：残响之途》游戏项目\tmp\chapter1_black_half_assets_contact_sheet.png`

## 验证

- `node --check .\game.js`：通过
- `npm run battle:guard`：通过
- `npm run portrait:build`：通过
- 新第一章场景数：13
- choice 跳转缺失：0
- battle 引用缺失：0
- 素材引用缺失：0
