import fs from "node:fs";
import path from "node:path";

const manifestPath = "assets/generated/character_states/character_state_manifest_v02.json";
const wiringPaths = ["game.js", "assets_data.js"];

const requiredStates = ["default", "smile", "worried", "serious", "shocked", "special"];
const requiredCharacters = [
  "atya",
  "milo",
  "anning",
  "tiya",
  "ningsu",
  "shen_zhiwei",
  "juheng",
  "sequence04"
];

function fail(message) {
  console.error(`Character sprite guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
  fail(`missing manifest: ${manifestPath}`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const wiringSource = wiringPaths
  .filter((wiringPath) => fs.existsSync(wiringPath))
  .map((wiringPath) => fs.readFileSync(wiringPath, "utf8"))
  .join("\n");
const errors = [];

for (const slug of requiredCharacters) {
  const entry = manifest[slug];
  if (!entry) {
    errors.push(`${slug}: missing manifest entry`);
    continue;
  }

  if (!entry.displayName) {
    errors.push(`${slug}: missing displayName`);
  }

  if (!entry.states || typeof entry.states !== "object") {
    errors.push(`${slug}: missing states object`);
    continue;
  }

  for (const state of requiredStates) {
    const assetPath = entry.states[state];
    if (!assetPath) {
      errors.push(`${slug}.${state}: missing state path`);
      continue;
    }

    if (!fs.existsSync(assetPath)) {
      errors.push(`${slug}.${state}: missing asset file ${assetPath}`);
      continue;
    }

    const normalized = assetPath.replaceAll(path.sep, "/");
    if (!wiringSource.includes(normalized)) {
      errors.push(`${slug}.${state}: asset exists but is not wired in game.js or assets_data.js`);
    }
  }

  const extraStates = Object.keys(entry.states).filter((state) => !requiredStates.includes(state));
  if (extraStates.length > 0) {
    errors.push(`${slug}: unsupported extra states ${extraStates.join(", ")}`);
  }
}

const extraCharacters = Object.keys(manifest).filter((slug) => !requiredCharacters.includes(slug));
if (extraCharacters.length > 0) {
  errors.push(`manifest has unmanaged important characters: ${extraCharacters.join(", ")}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Character sprite guard passed for ${requiredCharacters.length} characters / ${requiredCharacters.length * requiredStates.length} states.`);
