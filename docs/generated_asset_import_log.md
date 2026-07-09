# 生成资产接入记录

## 2026-07-01 P0 UI 透明切片

生成方式：

- 主要装饰切片使用内置图像生成工具生成纯色抠图背景，再用本地 chroma-key 脚本转透明 PNG。
- `ui_faint_paper_grain_v01.png` 使用本地透明噪声生成，避免不透明浅底覆盖界面。

已写入：

```txt
assets/ui/ui_title_ornate_frame_overlay_v01.png
assets/ui/ui_star_dust_overlay_v01.png
assets/ui/ui_card_ornament_corner_v01.png
assets/ui/ui_faint_paper_grain_v01.png
assets/ui/ui_glass_shard_noise_v01.png
assets/ui/ui_scene_gold_corner_frame_v01.png
assets/ui/ui_button_engraved_line_v01.png
assets/ui/ui_broken_clock_overlay_v01.png
```

接入位置：

- `style.css` 原本已经引用这些路径；生成后无需再改 CSS 路径。

## 2026-07-01 P1 白金歌剧核心背景

生成方式：

- 使用内置图像生成工具按《宿命回响：残响之途》白金歌剧美术设定生成。
- 明确要求 16:9、全画幅、视觉小说背景、无可读文字、无 UI、无大片空白。

已写入：

```txt
assets/generated/backgrounds/bg_echo_city_white_gold_opera_v02.png
assets/generated/backgrounds/bg_white_score_tuning_hall_v02.png
assets/generated/backgrounds/bg_graystring_gallery_v02.png
assets/generated/backgrounds/bg_broken_string_night_stage_v02.png
```

接入位置：

- `game.js`
  - `qixianPlaza` → `bg_echo_city_white_gold_opera_v02.png`
  - `qixianTuningPlatform` / `qixianTuningRoom` → `bg_white_score_tuning_hall_v02.png`
  - `graystringDay` / `graystringDusk` → `bg_graystring_gallery_v02.png`
  - `graystringBattle` / `graystringBossBridge` / `fogportStage` → `bg_broken_string_night_stage_v02.png`
- `style.css`
  - 主菜单背景 → `bg_echo_city_white_gold_opera_v02.png`

## 检查结果

- `node --check game.js`：通过。
- `index.html` / `style.css` / `game.js` 中引用的 `assets/` 路径：全部存在。
