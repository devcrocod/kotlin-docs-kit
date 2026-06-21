#!/usr/bin/env node
/**
 * Capture homepage screenshots of the two engine templates for the dogfood
 * homepage's "Choose your engine" cards. Writes 4 PNGs:
 *
 *   docs/static/img/templates/{docusaurus,hugo}-{light,dark}.png
 *
 * MANUAL ONLY — never wired into prebuild/build (it needs a browser + dev
 * servers). Re-run when a template's look changes:
 *
 *   pnpm shots            # capture from local dev servers (default)
 *   pnpm shots --live     # capture from the published GitHub Pages demos
 *
 * Mechanism: puppeteer-core drives the SYSTEM Chrome (no bundled browser).
 * Both engines share one theme contract — `<html data-theme>` set from
 * `localStorage.getItem("theme")` by a pre-paint script — so we just seed
 * localStorage before navigation; no toggle click, no FOUC, one code path.
 *
 * URLs: `hugo server` rewrites baseURL to localhost and serves at the ROOT,
 * while `docusaurus start` serves under its configured baseUrl sub-path. So
 * each local target lists candidate URLs and we screenshot the first that
 * answers 2xx/3xx. (Built `build/`/`public/` dirs hard-code the sub-path into
 * asset URLs and 404 at localhost root, so we use the dev server, not them.)
 *
 * Requires (one-time, in docs/):  pnpm add -D puppeteer-core
 * Chrome path defaults to the macOS location; override with CHROME_PATH.
 */
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(DOCS_ROOT, '..');
const OUT = path.join(DOCS_ROOT, 'static', 'img', 'templates');

const CHROME =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VIEWPORT = { width: 1600, height: 1000, deviceScaleFactor: 2 };
const THEMES = ['light', 'dark'];

const useLive = process.argv.includes('--live');

/** @type {{name:string,urls:string[],serve:null|{cmd:string,args:string[],cwd:string}}[]} */
const TARGETS = [
  {
    name: 'docusaurus',
    urls: useLive
      ? ['https://devcrocod.github.io/kotlin-docs-docusaurus-template/']
      : ['http://localhost:3000/kotlin-docs-docusaurus-template/'],
    serve: useLive
      ? null
      : {
          cmd: 'pnpm',
          args: ['start', '--no-open', '--port', '3000'],
          cwd: path.join(REPO_ROOT, 'templates', 'docusaurus'),
        },
  },
  {
    name: 'hugo',
    urls: useLive
      ? ['https://devcrocod.github.io/kotlin-docs-hugo-template/']
      : ['http://localhost:1313/kotlin-docs-hugo-template/', 'http://localhost:1313/'],
    serve: useLive
      ? null
      : {
          cmd: 'hugo',
          args: ['server', '--port', '1313'],
          cwd: path.join(REPO_ROOT, 'templates', 'hugo'),
        },
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** HTTP status for a URL, or null on network error. */
async function probe(url) {
  try {
    const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(2500) });
    return res.status;
  } catch {
    return null;
  }
}

/** Poll candidates; resolve the first that answers 2xx/3xx (real content). */
async function resolveReady(candidates, { timeout = 120_000, interval = 1000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const url of candidates) {
      const status = await probe(url);
      if (status !== null && status >= 200 && status < 400) return url;
    }
    await sleep(interval);
  }
  throw new Error(`Timed out waiting for any of:\n  ${candidates.join('\n  ')}`);
}

function startServer(serve) {
  // detached => its own process group, so we can kill children (dev servers fork).
  const proc = spawn(serve.cmd, serve.args, {
    cwd: serve.cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
    detached: true,
  });
  proc.on('error', (e) =>
    console.error(`Failed to start "${serve.cmd}" in ${serve.cwd}: ${e.message}`),
  );
  return proc;
}

function killGroup(proc) {
  if (!proc || proc.killed) return;
  try {
    process.kill(-proc.pid, 'SIGTERM'); // negative pid => whole process group
  } catch {
    try {
      proc.kill('SIGTERM');
    } catch {}
  }
}

async function shoot(browser, url, theme, file) {
  const page = await browser.newPage();
  try {
    await page.setViewport(VIEWPORT);
    // Seed the shared theme contract before first paint.
    await page.evaluateOnNewDocument((t) => {
      try {
        localStorage.setItem('theme', t);
      } catch {}
    }, theme);
    // 'load' (not networkidle*): dev servers hold an HMR websocket open forever.
    await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
    await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
    await sleep(1200); // let client render / fonts / animations settle
    await page.screenshot({ path: file }); // viewport only (16:10), not fullPage
    console.log(`  ✓ ${path.relative(REPO_ROOT, file)}`);
  } finally {
    await page.close();
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--hide-scrollbars',
      '--force-color-profile=srgb',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  try {
    for (const t of TARGETS) {
      console.log(`→ ${t.name}`);
      let proc = null;
      // Reuse an already-running server if one answers; otherwise start ours.
      const alreadyUp = await resolveReady(t.urls, { timeout: 1, interval: 1 }).catch(() => null);
      if (t.serve && !alreadyUp) proc = startServer(t.serve);
      try {
        const url = alreadyUp || (await resolveReady(t.urls));
        console.log(`  using ${url}`);
        for (const theme of THEMES) {
          await shoot(browser, url, theme, path.join(OUT, `${t.name}-${theme}.png`));
        }
      } finally {
        killGroup(proc);
      }
    }
  } finally {
    await browser.close();
  }
  console.log(`\nDone. Screenshots in ${path.relative(REPO_ROOT, OUT)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
