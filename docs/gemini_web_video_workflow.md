# Gemini Web Video Workflow

本项目的视频素材生成走 Gemini 网页版自动化，不走 Gemini API。脚本会打开本机 Chrome/Edge，用独立浏览器资料夹保存网页登录态，然后批量把提示词填入 Gemini、尝试提交、等待结果并下载。

## 文件位置

```text
脚本：scripts/gemini-web-video-assets.mjs
示例任务：prompts/video/gemini-web-video-jobs.example.json
登录态目录：.browser-profiles/gemini-video
默认下载目录：assets/generated/videos/gemini_web
```

`.browser-profiles/` 已加入 `.gitignore`，不要提交。这里保存的是浏览器登录态/cookie/profile，不保存明文账号密码。

## 第一次使用

先让用户登录 Gemini 网页：

```bash
npm run video:gemini:login
```

脚本会打开 Gemini。用户在浏览器里登录账号，并允许浏览器保持登录状态。登录完成后回到终端按 Enter。

## 批量自动生成

使用示例任务清单：

```bash
npm run video:gemini:auto -- --manifest prompts/video/gemini-web-video-jobs.example.json
```

自动模式会：

1. 打开已登录的 Gemini 网页。
2. 读取 manifest 中的每个 job。
3. 填入视频提示词。
4. 自动尝试提交。
5. 等待视频结果。
6. 尝试点击下载并保存到 `assets/generated/videos/gemini_web`。

Gemini 网页按钮和布局可能变动。如果脚本找不到下载按钮，会停留在浏览器页面，让操作者手动点击下载。

## 单条提示词

```bash
npm run video:gemini:auto -- --id ch2_intro_test --prompt "Create a 6 second cinematic anime game transition video..."
```

## 半自动模式

如果想先检查提示词，不自动提交：

```bash
npm run video:gemini:web -- --manifest prompts/video/gemini-web-video-jobs.example.json
```

脚本会把提示词填入 Gemini，等待人工检查和发送。

## 干运行检查

不打开浏览器、不提交任务，只打印最终提示词：

```bash
npm run video:gemini:web -- --dry-run --manifest prompts/video/gemini-web-video-jobs.example.json
```

## Manifest 格式

```json
{
  "defaults": {
    "duration": "6 seconds",
    "aspectRatio": "16:9",
    "style": "high saturation anime game cinematic, gothic opera fantasy, warm visible highlights",
    "negativePrompt": "black screen, muddy shadows, watermark, logo"
  },
  "jobs": [
    {
      "id": "ch2_opening_overture_transition",
      "prompt": "Create a looping chapter transition video..."
    }
  ]
}
```

字段说明：

- `id`：输出文件名基础名，也用于控制台日志。
- `prompt`：核心视频提示词。
- `duration`：视频时长描述，例如 `6 seconds`。
- `aspectRatio`：画幅，例如 `16:9` 或 `9:16`。
- `style`：统一美术风格描述。
- `negativePrompt`：避免黑屏、废墟感过重、文字水印等问题。

## 第二章建议用法

正式做第二章时，新建一个专用清单，例如：

```text
prompts/video/chapter2-gemini-video-jobs.json
```

然后运行：

```bash
npm run video:gemini:auto -- --manifest prompts/video/chapter2-gemini-video-jobs.json
```

视频生成后，把最终确认可用的素材移动或登记到章节资产表，再在游戏场景里引用。

## 注意事项

- 不要把账号密码写进项目文件。
- 如果登录态失效，重新运行 `npm run video:gemini:login`。
- 自动下载依赖 Gemini 网页按钮文字/结构，网页改版时可能需要更新选择器。
- 生成视频会消耗 Gemini 额度，批量跑之前先用 `--dry-run` 检查提示词。
- 为避免画面过黑，每个 job 都应包含可见光源、暖色高光、细节可读性，以及 negative prompt。

