import fs from "node:fs";

const source = fs.readFileSync("game.js", "utf8");
const lines = source.split(/\r?\n/);
const scenesStart = lines.findIndex((line) => line.startsWith("const SCENES = {"));
const battlesStart = lines.findIndex((line) => line.startsWith("const BATTLES = {"));

if (scenesStart < 0 || battlesStart < 0 || battlesStart <= scenesStart) {
  console.error("Visual audit failed: unable to locate SCENES/BATTLES boundaries in game.js.");
  process.exit(1);
}

const sceneStarts = [];
for (let index = scenesStart + 1; index < battlesStart; index += 1) {
  const match = lines[index].match(/^  "([^"]+)": \{$/);
  if (match) sceneStarts.push({ id: match[1], index });
}

const chapters = new Map();
for (let entryIndex = 0; entryIndex < sceneStarts.length; entryIndex += 1) {
  const entry = sceneStarts[entryIndex];
  const end = entryIndex + 1 < sceneStarts.length ? sceneStarts[entryIndex + 1].index : battlesStart;
  const block = lines.slice(entry.index, end).join("\n");
  const declaredChapter = block.match(/\n    chapter: (\d+)/)?.[1];
  const inferredChapter = entry.id.match(/^(?:ch|chapter)(\d+)/)?.[1];
  const chapter = Number(declaredChapter ?? inferredChapter);
  if (!Number.isInteger(chapter) || chapter < 0 || chapter > 11) continue;
  const background = block.match(/backgroundImage:\s*ASSETS\.backgrounds\.([A-Za-z0-9_]+)/)?.[1] ?? null;
  const chapterScenes = chapters.get(chapter) ?? [];
  chapterScenes.push({ id: entry.id, background });
  chapters.set(chapter, chapterScenes);
}

const failures = [];
for (let chapter = 0; chapter <= 11; chapter += 1) {
  const scenes = chapters.get(chapter) ?? [];
  const missing = scenes.filter((scene) => !scene.background);
  const backgroundCounts = new Map();
  for (const scene of scenes) {
    if (scene.background) backgroundCounts.set(scene.background, (backgroundCounts.get(scene.background) ?? 0) + 1);
  }
  const uniqueBackgrounds = backgroundCounts.size;
  const minimumUnique = Math.min(8, Math.max(4, Math.ceil(scenes.length / 6)));
  const maximumReuse = Math.max(6, Math.ceil(scenes.length * 0.35));
  const mostReused = [...backgroundCounts.entries()].sort((left, right) => right[1] - left[1])[0] ?? ["none", 0];
  console.log(`CH${chapter}: scenes=${scenes.length} unique=${uniqueBackgrounds}/${minimumUnique} maxReuse=${mostReused[0]}:${mostReused[1]}/${maximumReuse} missing=${missing.length}`);
  if (missing.length > 0) failures.push(`CH${chapter}: scenes without a wired background: ${missing.map((scene) => scene.id).join(", ")}`);
  if (uniqueBackgrounds < minimumUnique) failures.push(`CH${chapter}: only ${uniqueBackgrounds} unique backgrounds; requires at least ${minimumUnique}`);
  if (mostReused[1] > maximumReuse) failures.push(`CH${chapter}: ${mostReused[0]} is reused ${mostReused[1]} times; maximum is ${maximumReuse}`);
}

if (failures.length > 0) {
  console.error("\nStory visual coverage audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Story visual coverage audit passed for chapters 0-11.");
