const fs = require('fs');

const path = 'game.js';
let content = fs.readFileSync(path, 'utf8');

// 1. showMainMenu BGM
content = content.replace(
    /function showMainMenu\(\) \{/,
    `function showMainMenu() {
    if(window.AudioManager) { window.AudioManager.init().then(() => window.AudioManager.playBGM('main_menu')); }`
);

// 2. startBattle BGM
content = content.replace(
    /function startBattle\(config, options = \{\}\) \{/,
    `function startBattle(config, options = {}) {
    if(window.AudioManager) { window.AudioManager.playBGM(config && config.id && config.id.includes('boss') ? 'battle_boss' : 'battle_normal'); }`
);

// 3. Battle victory/defeat BGM (hook into handleBattleComplete or close/exit logic)
// Let's inject a global button click listener for UI SFX at the end of the file
const clickListener = `
/* ═══ Audio Hooks ═══ */
document.addEventListener('click', (e) => {
    if(!window.AudioManager) return;
    const t = e.target;
    if(t.tagName === 'BUTTON' || t.closest('button') || t.classList.contains('choice-button') || t.classList.contains('quick-action-button') || t.classList.contains('menu-button')) {
        window.AudioManager.playSFX('click');
    }
});
document.addEventListener('mouseover', (e) => {
    if(!window.AudioManager) return;
    const t = e.target;
    if(t.tagName === 'BUTTON' || t.closest('button') || t.classList.contains('choice-button')) {
        // window.AudioManager.playSFX('hover'); // Hover can be too noisy sometimes, but adding it just in case
    }
});

// Hook into dysregulation by observing the console or looking for specific strings
// A cleaner way is to wrap console.log to detect when the game logs "触发失调"
const originalLog = console.log;
console.log = function(...args) {
    originalLog.apply(console, args);
    const msg = args.join(' ');
    if (msg.includes('失调') && msg.includes('触发') || msg.includes('失调预警')) {
        if(window.AudioManager) window.AudioManager.triggerDysregulation('high');
    }
};
`;

if (!content.includes('Audio Hooks')) {
    content += '\n' + clickListener;
}

// Write back
fs.writeFileSync(path, content, 'utf8');
console.log('game.js patched successfully for Audio.');
