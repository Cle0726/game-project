const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const targetFunctionRegex = /function showDialogue\(speaker, text, onComplete\) \{[\s\S]*?typewriterTimer = setTimeout\(typeNextCharacter, TYPEWRITER_DELAY\);\s*\}/;

const newFunction = `function showDialogue(speaker, text, onComplete) {
  const speakerElement = document.getElementById("speaker-name");
  const dialogueElement = document.getElementById("dialogue-text");
  const dialogueArea = document.getElementById("dialogue-area");
  const avatarElement = document.getElementById("character-avatar");

  clearTimeout(typewriterTimer);
  speakerElement.textContent = speaker;
  dialogueElement.textContent = "";
  applySpeakerPresentation(speaker, dialogueArea, avatarElement);
  triggerNoteBurst(speaker === "【内心】" ? "inner" : "dialogue");

  if (typeof window.animateTextReveal !== "undefined") {
    window.animateTextReveal(dialogueElement, text, onComplete);
  } else {
    // Fallback if script failed
    const characters = Array.from(text);
    let index = 0;
    function typeNextCharacter() {
      if (index >= characters.length) {
        if (typeof onComplete === "function") {
          onComplete();
        }
        return;
      }
      dialogueElement.textContent += characters[index];
      index += 1;
      typewriterTimer = setTimeout(typeNextCharacter, TYPEWRITER_DELAY);
    }
    typeNextCharacter();
  }
}`;

code = code.replace(targetFunctionRegex, newFunction);
fs.writeFileSync('game.js', code);
console.log('game.js updated to use animateTextReveal');
