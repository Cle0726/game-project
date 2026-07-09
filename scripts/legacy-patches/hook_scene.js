const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const targetFunctionRegex = /function showScene\(sceneId\) \{([\s\S]*?)let scene = SCENES\[sceneId\];/;

const newStart = `function executeSceneChange(sceneId) {
  console.log("executeSceneChange():", sceneId);
  clearTimeout(battleResultTimer);
  activeBattle = null;
  setInterfaceMode("scene");
  triggerInterfaceMotion("scene");
  triggerNoteBurst("scene");
  let scene = SCENES[sceneId];`;

const hookFunction = `function showScene(sceneId) {
  if (typeof VFXManager !== "undefined" && typeof VFXManager.transitionScene === "function") {
      let transitionType = 'planA';
      if (sceneId.includes("tea_break")) transitionType = 'planB';
      else if (sceneId.includes("chapter") || sceneId.includes("prologue_01")) transitionType = 'planC';
      
      VFXManager.transitionScene(sceneId, transitionType, executeSceneChange);
  } else {
      executeSceneChange(sceneId);
  }
}

function executeSceneChange(sceneId) {
  console.log("executeSceneChange():", sceneId);
  clearTimeout(battleResultTimer);
  activeBattle = null;
  setInterfaceMode("scene");
  triggerInterfaceMotion("scene");
  triggerNoteBurst("scene");
  let scene = SCENES[sceneId];`;

code = code.replace(targetFunctionRegex, hookFunction);
fs.writeFileSync('game.js', code);
console.log('game.js hooked for scene transitions');
