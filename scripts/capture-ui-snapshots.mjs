import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const baseUrl = process.argv[2] || "http://127.0.0.1:4173";
const outputDir = path.resolve(process.argv[3] || "output/ui-snapshots");
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--disable-gpu", "--hide-scrollbars"],
});

async function preparePage(viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.querySelector("#opening-animation")?.classList.add("is-finished");
    window.showMainMenu?.();
  });
  await page.waitForTimeout(500);
  return page;
}

async function shot(page, name, fullPage = false) {
  await page.screenshot({
    path: path.join(outputDir, `${name}.png`),
    fullPage,
  });
}

async function clickIfVisible(page, selector) {
  const element = page.locator(selector).first();
  if (await element.isVisible().catch(() => false)) {
    await element.click({ force: true });
    await page.waitForTimeout(450);
    return true;
  }
  return false;
}

async function domClick(page, selector) {
  const didClick = await page.evaluate((targetSelector) => {
    const element = document.querySelector(targetSelector);
    if (!element) {
      return false;
    }
    element.click();
    return true;
  }, selector);
  if (didClick) {
    await page.waitForTimeout(450);
  }
  return didClick;
}

async function chooseFirstConductor(page) {
  const modal = page.locator("#conductor-modal");
  if (!(await modal.isVisible().catch(() => false))) {
    return false;
  }
  const option = page.locator("#conductor-options button").first();
  if (await option.isVisible().catch(() => false)) {
    await option.click({ force: true });
    await page.waitForTimeout(450);
    return true;
  }
  return false;
}

const desktop = await preparePage({ width: 1600, height: 1000 });
await shot(desktop, "01-main-menu-desktop");

await clickIfVisible(desktop, '[data-entry-jump="entry-chapters"]');
await shot(desktop, "02-chapter-select-desktop", true);

await clickIfVisible(desktop, '[data-entry-jump="entry-archive-panel"]');
await shot(desktop, "03-archive-desktop");

await clickIfVisible(desktop, "#entry-home-button");
await clickIfVisible(desktop, "#entry-settings-button");
await shot(desktop, "04-settings-desktop");
await domClick(desktop, "#settings-modal-close");

await clickIfVisible(desktop, "#entry-gacha-button");
await shot(desktop, "05-gacha-desktop");
await domClick(desktop, "#gacha-universe-close");
await domClick(desktop, "#gacha-modal-close");

await domClick(desktop, "#continue-button");
if (await desktop.locator("#conductor-modal").isVisible().catch(() => false)) {
  await shot(desktop, "06-conductor-desktop");
  await chooseFirstConductor(desktop);
}
await desktop.waitForTimeout(2600);
await shot(desktop, "07-story-desktop");

await desktop.evaluate(() => {
  window.__skipNextGSAP = true;
  const speaker = "\u963f\u7f07\u5a05";
  window.updateCharacterSprite?.(speaker, "serious");
  window.showDialogue?.(speaker, "The next beat is yours. I will carry this melody forward.", () => {}, "serious");
});
await desktop.waitForTimeout(500);
await shot(desktop, "07b-story-bust-dialogue-desktop");

await desktop.evaluate(() => window.showScene?.("ch0_015_first_baton"));
await desktop.waitForTimeout(2600);
await shot(desktop, "07c-story-cinematic-desktop");

await desktop.evaluate(() => window.showScene?.("ch0_006_mother_dream"));
await desktop.waitForTimeout(2600);
await shot(desktop, "07d-story-silent-piano-memory-desktop");

await desktop.evaluate(() => window.showScene?.("ch1_minigame_ensemble"));
await desktop.waitForTimeout(2600);
await shot(desktop, "07e-story-duet-coordination-desktop");

await clickIfVisible(desktop, "#quick-team-button");
await shot(desktop, "08-team-desktop", true);
await desktop.close();

const mobile = await preparePage({ width: 430, height: 932 });
await shot(mobile, "09-main-menu-mobile", true);
await domClick(mobile, "#continue-button");
await chooseFirstConductor(mobile);
await mobile.waitForTimeout(2600);
await shot(mobile, "10-story-mobile", true);
await mobile.close();

const battle = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await battle.goto(`${baseUrl}/tests/battle-test.html`, { waitUntil: "networkidle" });
await battle.evaluate(() => {
  document.documentElement.style.background = "#05060a";
  document.body.style.margin = "0";
  document.body.style.background = "#05060a";
});
await battle.waitForTimeout(800);
await shot(battle, "11-battle-desktop");
await battle.close();

const worldMap = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await worldMap.goto(`${baseUrl}/tests/worldmap-test.html`, { waitUntil: "networkidle" });
await worldMap.evaluate(() => {
  document.documentElement.style.background = "#05060a";
  document.body.style.margin = "0";
  document.body.style.background = "#05060a";
});
await worldMap.waitForTimeout(800);
await shot(worldMap, "12-world-map-desktop", true);
await worldMap.close();

await browser.close();
console.log(`Saved UI snapshots to ${outputDir}`);
