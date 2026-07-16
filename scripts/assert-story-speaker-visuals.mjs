import fs from "node:fs";
import vm from "node:vm";

const assetsContext = {};
vm.createContext(assetsContext);
vm.runInContext(`${fs.readFileSync("assets_data.js", "utf8")}\nthis.__ASSETS = ASSETS;`, assetsContext);

const characterNames = new Set(Object.keys(assetsContext.__ASSETS.characters ?? {}));
const lines = fs.readFileSync("game.js", "utf8").split(/\r?\n/);
const scenesStart = lines.findIndex((line) => line.startsWith("const SCENES = {"));
const battlesStart = lines.findIndex((line) => line.startsWith("const BATTLES = {"));
const ignoredSpeakers = new Set(["系统", "旁白", "【内心】", "广播", "提示", "主角"]);
const explicitRecurringSpeakers = new Set(["风铃", "阿霜", "辞照", "破", "崔敬", "莫言书"]);
const speakerCounts = new Map();

for (let index = scenesStart + 1; index < battlesStart; index += 1) {
  for (const match of lines[index].matchAll(/speaker:\s*"([^"]+)"/g)) {
    const speaker = match[1];
    if (!ignoredSpeakers.has(speaker)) speakerCounts.set(speaker, (speakerCounts.get(speaker) ?? 0) + 1);
  }
}

const requiredSpeakers = [...speakerCounts.entries()]
  .filter(([speaker, count]) => count >= 4 || explicitRecurringSpeakers.has(speaker))
  .map(([speaker]) => speaker)
  .sort((left, right) => left.localeCompare(right, "zh-CN"));
const missing = requiredSpeakers.filter((speaker) => !characterNames.has(speaker));

if (missing.length > 0) {
  console.error("Story speaker visual guard failed:");
  for (const speaker of missing) console.error(`- ${speaker}: ${speakerCounts.get(speaker) ?? 0} dialogue lines but no ASSETS.characters entry`);
  process.exit(1);
}
console.log(`Story speaker visual guard passed for ${requiredSpeakers.length} recurring speakers.`);
