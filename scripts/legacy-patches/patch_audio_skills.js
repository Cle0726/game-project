const fs = require('fs');

const path = 'game.js';
let content = fs.readFileSync(path, 'utf8');

// 1. handleBattleAction
content = content.replace(
    /const action = config\.actions\[actionKey\];/,
    `const action = config.actions[actionKey];
    if (action && window.AudioManager && action.character) {
        window.AudioManager.playMusicartSkill(action.character);
    }`
);

// 2. handleUltimateAction
content = content.replace(
    /function handleUltimateAction\(character\) \{/,
    `function handleUltimateAction(character) {
    if (window.AudioManager) {
        window.AudioManager.playSFX('solo');
        window.AudioManager.playMusicartSkill(character);
    }`
);

fs.writeFileSync(path, content, 'utf8');
console.log('game.js patched successfully for Character Skills.');
