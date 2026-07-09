/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: update_style.js | 行号: 1-14
   功能: CSS 合并脚本 —— 读取 vfx_styles.css 并合并写入 style.css 末尾
   运行方式: Node.js 脚本 `node update_style.js` (会修改 style.css 文件)
   逻辑:
   1. 在 style.css 中查找 VFX ENGINE STYLES 标记
   2. 删除标记之后的所有内容
   3. 将 vfx_styles.css 的完整内容追加到 style.css
   ⚠️ 修改注意: 此脚本依赖 style.css 中存在 `VFX ENGINE STYLES (Vanilla JS Port)` 标记
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

const fs = require('fs');
let styleContent = fs.readFileSync('style.css', 'utf8');
const vfxStyles = fs.readFileSync('vfx_styles.css', 'utf8');

const marker = '/* ========================================================================= */\n/* VFX ENGINE STYLES (Vanilla JS Port)';
const markerIndex = styleContent.indexOf(marker);

if (markerIndex !== -1) {
    styleContent = styleContent.substring(0, markerIndex);
}

fs.writeFileSync('style.css', styleContent + '\n' + vfxStyles);
console.log('Successfully updated style.css');
