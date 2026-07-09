#!/usr/bin/env node
import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import process from "node:process";
import readline from "node:readline/promises";

const GEMINI_URL = "https://gemini.google.com/app";
const DEFAULT_PROFILE_DIR = ".browser-profiles/gemini-video";
const DEFAULT_DOWNLOAD_DIR = "assets/generated/videos/gemini_web";
const DEFAULT_MANIFEST = "prompts/video/gemini-web-video-jobs.example.json";

function help() {
  console.log(`
Gemini Web video asset helper

This script uses your logged-in Gemini web page, not the Gemini API.
It keeps login state in a local browser profile folder and never asks for,
stores, or reads your password.

Usage:
  npm run video:gemini:login
  npm run video:gemini:web -- --manifest prompts/video/gemini-web-video-jobs.example.json
  npm run video:gemini:web -- --prompt "generate a 6 second video..." --id ch2_intro

Options:
  --login                  Open Gemini and wait so you can log in.
  --manifest <file>        JSON task list. Default: ${DEFAULT_MANIFEST}
  --prompt <text>          Single prompt mode.
  --id <name>              Single prompt output/job name.
  --url <url>              Gemini page URL. Default: ${GEMINI_URL}
  --profile <dir>          Browser profile folder. Default: ${DEFAULT_PROFILE_DIR}
  --downloads <dir>        Download folder. Default: ${DEFAULT_DOWNLOAD_DIR}
  --browser <path>         Chrome/Edge executable path if auto-detect fails.
  --auto                   Submit, wait, and try to download each job.
  --submit                 Try to click Send / press Enter automatically.
  --auto-download          After submit, wait for a video result and click Download.
  --wait-minutes <number>  Result wait timeout for auto-download. Default: 30.
  --pause-after-submit     Wait for Enter after each submitted job.
  --dry-run                Print jobs without opening browser.
  --help                   Show this help.
`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    if (["login", "auto", "submit", "auto-download", "pause-after-submit", "dry-run", "help"].includes(key)) {
      args[key] = true;
    } else {
      args[key] = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function toNumber(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function slugify(value) {
  return String(value || "gemini_video")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 90) || `gemini_video_${Date.now()}`;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findBrowser(userPath) {
  if (userPath && await exists(userPath)) return userPath;

  const candidates = [
    process.env.CHROME_PATH,
    process.env.EDGE_PATH,
    path.join(process.env.ProgramFiles || "", "Google/Chrome/Application/chrome.exe"),
    path.join(process.env["ProgramFiles(x86)"] || "", "Google/Chrome/Application/chrome.exe"),
    path.join(process.env.LOCALAPPDATA || "", "Google/Chrome/Application/chrome.exe"),
    path.join(process.env.ProgramFiles || "", "Microsoft/Edge/Application/msedge.exe"),
    path.join(process.env["ProgramFiles(x86)"] || "", "Microsoft/Edge/Application/msedge.exe"),
    path.join(process.env.LOCALAPPDATA || "", "Microsoft/Edge/Application/msedge.exe")
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }

  throw new Error("Chrome/Edge executable not found. Pass --browser \"C:\\\\Path\\\\to\\\\chrome.exe\".");
}

async function readManifest(filePath) {
  const absolutePath = path.resolve(filePath);
  const text = await fs.readFile(absolutePath, "utf8");
  const manifest = JSON.parse(text);
  const defaults = manifest.defaults || {};
  const jobs = Array.isArray(manifest.jobs) ? manifest.jobs : [];
  return jobs.map((job, index) => ({
    ...defaults,
    ...job,
    id: job.id || `gemini_web_video_${String(index + 1).padStart(2, "0")}`
  }));
}

async function buildJobs(args) {
  if (args.prompt) {
    return [{
      id: args.id || `gemini_web_video_${Date.now()}`,
      prompt: args.prompt
    }];
  }
  return readManifest(args.manifest || DEFAULT_MANIFEST);
}

function normalizePrompt(job) {
  const lines = [
    job.prompt,
    "",
    "Video asset requirements:",
    `- duration: ${job.duration || "5-8 seconds"}`,
    `- aspect ratio: ${job.aspectRatio || "16:9"}`,
    `- style: ${job.style || "cinematic anime game background, orchestral gothic fantasy, readable warm highlights"}`,
    "- keep the image bright enough to see details; avoid black-screen, muddy shadows, ruin-only composition",
    "- camera movement should be slow and usable as an in-game loop or transition",
    "- no text, no subtitles, no logos, no watermark"
  ];

  if (job.negativePrompt) {
    lines.push("", `Negative prompt: ${job.negativePrompt}`);
  }

  return lines.filter(Boolean).join("\n");
}

async function launchGemini(args) {
  const browserPath = await findBrowser(args.browser);
  const profileDir = path.resolve(args.profile || DEFAULT_PROFILE_DIR);
  const downloadsPath = path.resolve(args.downloads || DEFAULT_DOWNLOAD_DIR);
  await fs.mkdir(profileDir, { recursive: true });
  await fs.mkdir(downloadsPath, { recursive: true });

  const context = await chromium.launchPersistentContext(profileDir, {
    executablePath: browserPath,
    headless: false,
    acceptDownloads: true,
    downloadsPath,
    viewport: { width: 1440, height: 960 },
    args: [
      "--disable-blink-features=AutomationControlled",
      "--start-maximized"
    ]
  });

  const page = context.pages()[0] || await context.newPage();
  return { context, page, downloadsPath, profileDir };
}

async function findPromptBox(page) {
  const selectors = [
    "div[contenteditable='true'][role='textbox']",
    "div[contenteditable='true']",
    "textarea",
    "rich-textarea div[contenteditable='true']"
  ];

  for (const selector of selectors) {
    const locator = page.locator(selector).last();
    if (await locator.count()) {
      try {
        await locator.waitFor({ state: "visible", timeout: 3000 });
        return locator;
      } catch {
        continue;
      }
    }
  }
  throw new Error("Could not find Gemini prompt input. The page may not be logged in or the UI changed.");
}

async function fillPrompt(page, prompt) {
  const box = await findPromptBox(page);
  await box.click({ timeout: 5000 });
  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.press("Backspace");
  await page.keyboard.insertText(prompt);
}

async function trySubmit(page) {
  const candidates = [
    "button[aria-label*='Send']",
    "button[aria-label*='Submit']",
    "button[aria-label*='发送']",
    "button[aria-label*='提交']",
    "button:has-text('Send')",
    "button:has-text('发送')"
  ];

  for (const selector of candidates) {
    const button = page.locator(selector).last();
    if (await button.count()) {
      try {
        await button.click({ timeout: 3000 });
        return true;
      } catch {
        continue;
      }
    }
  }

  await page.keyboard.press("Enter");
  return false;
}

async function clickFirstVisible(locator, timeout = 1500) {
  const count = await locator.count();
  for (let i = count - 1; i >= 0; i -= 1) {
    const item = locator.nth(i);
    try {
      if (await item.isVisible({ timeout: 300 })) {
        await item.click({ timeout });
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}

async function tryOpenDownloadMenu(page) {
  const menuButtons = [
    "button[aria-label*='More']",
    "button[aria-label*='更多']",
    "button[aria-label*='Actions']",
    "button[aria-label*='操作']",
    "button:has-text('⋮')"
  ];

  for (const selector of menuButtons) {
    if (await clickFirstVisible(page.locator(selector))) return true;
  }
  return false;
}

async function tryClickDownload(page) {
  const directSelectors = [
    "a[download]",
    "a[href*='download']",
    "button[aria-label*='Download']",
    "button[aria-label*='下载']",
    "button:has-text('Download')",
    "button:has-text('下载')",
    "[role='menuitem']:has-text('Download')",
    "[role='menuitem']:has-text('下载')"
  ];

  for (const selector of directSelectors) {
    if (await clickFirstVisible(page.locator(selector))) return true;
  }

  if (await tryOpenDownloadMenu(page)) {
    await page.waitForTimeout(800);
    for (const selector of directSelectors) {
      if (await clickFirstVisible(page.locator(selector))) return true;
    }
  }

  return false;
}

async function waitForGeneratedVideo(page, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const videoCount = await page.locator("video").count().catch(() => 0);
    const downloadCount = await page.locator("a[download], button[aria-label*='Download'], button[aria-label*='下载'], button:has-text('Download'), button:has-text('下载')").count().catch(() => 0);
    if (videoCount > 0 || downloadCount > 0) return true;
    await page.waitForTimeout(5000);
    console.log("  waiting for Gemini video result...");
  }
  return false;
}

async function autoDownloadResult(page, job, downloadsPath, waitMinutes) {
  const timeoutMs = waitMinutes * 60 * 1000;
  const ready = await waitForGeneratedVideo(page, timeoutMs);
  if (!ready) {
    console.log("  result was not detected before timeout.");
    return false;
  }

  const downloadPromise = page.waitForEvent("download", { timeout: 15000 }).catch(() => null);
  const clicked = await tryClickDownload(page);
  if (!clicked) {
    console.log("  could not find a Download button. Please download manually in the browser.");
    return false;
  }

  const download = await downloadPromise;
  if (!download) {
    console.log("  clicked download, but no browser download event was captured.");
    return false;
  }

  const suggested = download.suggestedFilename();
  const ext = path.extname(suggested) || ".mp4";
  const outputPath = path.resolve(downloadsPath, `${slugify(job.id)}${ext}`);
  await download.saveAs(outputPath);
  console.log(`  saved: ${outputPath}`);
  return true;
}

async function waitForEnter(message) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    await rl.question(message);
  } finally {
    rl.close();
  }
}

async function runLogin(args) {
  const { context, page, profileDir } = await launchGemini(args);
  await page.goto(args.url || GEMINI_URL, { waitUntil: "domcontentloaded" });
  console.log(`Gemini opened. Profile: ${profileDir}`);
  console.log("Log in or confirm the account in the browser, then press Enter here.");
  await waitForEnter("");
  await context.close();
}

async function runJobs(args) {
  if (args.auto) {
    args.submit = true;
    args["auto-download"] = true;
  }

  const jobs = await buildJobs(args);
  if (!jobs.length) throw new Error("No jobs found.");

  if (args["dry-run"]) {
    for (const job of jobs) {
      console.log(`\n[${job.id}]\n${normalizePrompt(job)}`);
    }
    return;
  }

  const { context, page, downloadsPath, profileDir } = await launchGemini(args);
  await page.goto(args.url || GEMINI_URL, { waitUntil: "domcontentloaded" });
  console.log(`Downloads folder: ${downloadsPath}`);
  console.log(`Login profile: ${profileDir}`);

  for (const job of jobs) {
    const prompt = normalizePrompt(job);
    console.log(`\n[Gemini web] ${job.id}`);
    await fillPrompt(page, prompt);

    if (args.submit) {
      const clicked = await trySubmit(page);
      console.log(clicked ? "Submitted." : "Submitted with Enter fallback.");
      if (args["auto-download"]) {
        await autoDownloadResult(
          page,
          job,
          downloadsPath,
          toNumber(args["wait-minutes"], 30)
        );
      }
    } else {
      console.log("Prompt is filled. Review it in Gemini, then send manually.");
    }

    if (args["pause-after-submit"] || !args.submit) {
      await waitForEnter("When this job is sent/downloaded, press Enter for the next job...");
    }
  }

  console.log("\nAll jobs were prepared. Keep the browser open if videos are still generating.");
  if (!args["pause-after-submit"]) {
    await waitForEnter("Press Enter to close the automation browser...");
  }
  await context.close();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return help();
  if (args.login) return runLogin(args);
  return runJobs(args);
}

main().catch((error) => {
  console.error(`\n[gemini-web-video] ${error.message}`);
  process.exitCode = 1;
});
