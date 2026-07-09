# 第零章世界地图同步记录（2026-07-05）

## 已同步区域

- 区域 ID：`residual_path`
- 区域名：`残响之途`
- 副标题：`第零章 · 禁曲未响`
- 解锁条件：默认解锁，用于承载独立序章。
- 第一章区域 `echo_citadel` 调整为 `chapter_progress >= 1` 后解锁；第零章结尾选择会写入 `chapterProgress = 1`，并保留 `chapter0_complete_isolated` 标记。

## 新增世界地图图片

- 区域全图：`F:\《宿命回响：残响之途》游戏项目\assets\worldmap\map_residual_path_miansha_manuscript_v01.png`
- 区域缩略图：`F:\《宿命回响：残响之途》游戏项目\assets\worldmap\thumb_residual_path_miansha_manuscript_v01.png`

## 地图节点

已把第零章主线节点同步到世界地图，包括：禁曲公路入口、眠沙镇封门、锁琴广场、眠沙镇调查、乌鸦唱片店、旧餐馆避雨处、废弃学校音乐室、半拍钟楼、旧剧场后台、禁演舞台、未鸣接棒、剥音校尉核心、雨后余响。

## 生成提示词原则

- 不使用纯黑废墟图；整体保持象牙纸、古金、蔷薇红、雨蓝中间调。
- 不在地图图片里放可读文字，避免 UI 覆盖和多语言维护问题。
- 地标明确、路线清楚，给 React 世界地图节点保留可点击空间。
- 风格为歌剧手稿地图 / 哥特音乐地图，可继续复用到后续章节。

## 验证

- `node --check .\game.js`：通过
- `npm run battle:guard`：通过
- `npm run portrait:build`：通过（仅保留既有非 module script 与 chunk size 警告）
- 第零章素材引用检查：`missingAssets = 0`
