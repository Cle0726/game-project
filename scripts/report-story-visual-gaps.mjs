import fs from "node:fs";
import path from "node:path";

const gameSource = fs.readFileSync("game.js", "utf8");
const assetSource = fs.readFileSync("assets_data.js", "utf8");
const lines = gameSource.split(/\r?\n/);
const scenesStart = lines.findIndex((line) => line.startsWith("const SCENES = {"));
const battlesStart = lines.findIndex((line) => line.startsWith("const BATTLES = {"));

if (scenesStart < 0 || battlesStart < 0 || battlesStart <= scenesStart) {
  throw new Error("Unable to locate SCENES/BATTLES boundaries in game.js.");
}

const assetPaths = new Map();
for (const match of assetSource.matchAll(/^\s{4}([A-Za-z0-9_]+):\s*"([^"]+)",?$/gm)) {
  assetPaths.set(match[1], match[2]);
}

const sceneStarts = [];
for (let index = scenesStart + 1; index < battlesStart; index += 1) {
  const match = lines[index].match(/^  "([^"]+)": \{$/);
  if (match) sceneStarts.push({ id: match[1], index });
}

const scenes = [];
for (let entryIndex = 0; entryIndex < sceneStarts.length; entryIndex += 1) {
  const entry = sceneStarts[entryIndex];
  const end = entryIndex + 1 < sceneStarts.length ? sceneStarts[entryIndex + 1].index : battlesStart;
  const block = lines.slice(entry.index, end).join("\n");
  const declaredChapter = block.match(/\n    chapter: (\d+)/)?.[1];
  const inferredChapter = entry.id.match(/^(?:ch|chapter)(\d+)/)?.[1];
  const chapter = Number(declaredChapter ?? inferredChapter);
  if (!Number.isInteger(chapter) || chapter < 0 || chapter > 11) continue;

  const backgroundKey = block.match(/backgroundImage:\s*ASSETS\.backgrounds\.([A-Za-z0-9_]+)/)?.[1] ?? null;
  const backgroundPath = backgroundKey ? assetPaths.get(backgroundKey) ?? null : null;
  const description = block.match(/\n    description:\s*"([^"]*)"/)?.[1] ?? "";
  const systemPrompt = block.match(/\n    systemPrompt:\s*"([^"]*)"/)?.[1] ?? "";
  const isCinematic = /presentation:\s*"cinematic"/.test(block)
    || Boolean(backgroundPath?.includes("/keyvisuals/cg_"));
  scenes.push({ id: entry.id, chapter, backgroundKey, backgroundPath, description, systemPrompt, isCinematic, block });
}

const reuseCounts = new Map();
for (const scene of scenes) {
  if (!scene.backgroundKey) continue;
  reuseCounts.set(scene.backgroundKey, (reuseCounts.get(scene.backgroundKey) ?? 0) + 1);
}

const keywordWeights = new Map([
  ["觉醒", 10], ["变身", 10], ["契约", 9], ["终战", 9], ["Boss", 8],
  ["告别", 8], ["遗言", 8], ["真相", 7], ["第一次", 6], ["选择", 6],
  ["决定", 6], ["母亲", 5], ["记忆", 5], ["听证", 5], ["公开", 5],
  ["承认", 5], ["残响", 4], ["加入", 4], ["牺牲", 7], ["救", 3],
]);

function scoreScene(scene) {
  if (scene.isCinematic) return -1000;
  const text = `${scene.description}\n${scene.systemPrompt}`;
  let score = Math.max(0, (reuseCounts.get(scene.backgroundKey) ?? 1) - 1) * 2;
  const reasons = [];
  for (const [keyword, weight] of keywordWeights) {
    if (!text.includes(keyword)) continue;
    score += weight;
    reasons.push(keyword);
  }
  if (/side_|tea|camp|night|memory|dream/i.test(scene.id)) {
    score += 2;
    reasons.push("intimate-scene");
  }
  return { score, reasons };
}

const chapters = [];
for (let chapter = 0; chapter <= 11; chapter += 1) {
  const chapterScenes = scenes.filter((scene) => scene.chapter === chapter);
  const candidates = chapterScenes
    .map((scene) => ({ ...scene, ...scoreScene(scene) }))
    .filter((scene) => scene.score >= 0)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id, "zh-CN"))
    .slice(0, 6)
    .map(({ block, ...scene }) => ({
      id: scene.id,
      score: scene.score,
      reasons: scene.reasons,
      currentBackground: scene.backgroundKey,
      currentBackgroundPath: scene.backgroundPath,
      description: scene.description,
    }));

  chapters.push({
    chapter,
    sceneCount: chapterScenes.length,
    uniqueBackgrounds: new Set(chapterScenes.map((scene) => scene.backgroundKey).filter(Boolean)).size,
    candidates,
  });
}

const outputPath = path.resolve(process.argv[2] || "output/story-visual-gap-report-v01.json");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), chapters }, null, 2)}\n`, "utf8");

for (const chapter of chapters) {
  const top = chapter.candidates.slice(0, 3).map((item) => `${item.id}:${item.score}`).join(", ");
  console.log(`CH${chapter.chapter} scenes=${chapter.sceneCount} unique=${chapter.uniqueBackgrounds} top=${top || "none"}`);
}
console.log(`Story visual gap report written to ${outputPath}`);
