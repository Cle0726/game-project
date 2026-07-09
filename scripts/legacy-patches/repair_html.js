const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const breakPoint = code.indexOf('        <span>RESIDUAL PATH</span>');
if (breakPoint > -1) {
    code = code.substring(breakPoint);
}

const header = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>宿命回响：残响之途</title>
  <link rel="stylesheet" href="style.css?v=team-dossier-20260701">
  <!-- VFX ENGINE DEPENDENCIES -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/8.1.0/pixi.min.js"></script>
  <script src="https://unpkg.com/split-type"></script>
  <script src="vfx.js"></script>
  <script src="vfx_advanced.js"></script>
</head>
<body>
  <main id="game-container" aria-label="宿命回响：残响之途 游戏界面">
    <div id="opening-animation" aria-hidden="true">
      <div class="opening-line"></div>
      <div class="opening-orbit"></div>
      <div class="opening-title-mask">
`;

fs.writeFileSync('index.html', header + code);
console.log('index.html updated with advanced vfx!');
