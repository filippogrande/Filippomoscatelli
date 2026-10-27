/**
 * generate-pdfs.mjs — genera i PDF del CV da print-cv.html.
 *
 * Avvia un piccolo server statico sulla root del repo, apre print-cv.html
 * in Chrome headless (via puppeteer-core), attende il rendering e salva
 * un PDF A4 per ogni lingua in root: filippomoscatelli_<lang>.pdf
 *
 * Uso:  node scripts/generate-pdfs.mjs
 * Env:  CHROME_PATH  percorso del browser (opzionale)
 */

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LANGS = ['it', 'en'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function startServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(ROOT, rel);

    // impedisce di uscire dalla root del repo
    if (!file.startsWith(ROOT + path.sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    try {
      const body = await readFile(file);
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500).end(String(err.message));
    }
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

async function renderPdf(browser, port, lang) {
  const page = await browser.newPage();
  const target = 'http://127.0.0.1:' + port + '/print-cv.html?lang=' + lang;

  try {
    await page.goto(target, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForFunction('window.PRINT_READY === true || typeof window.PRINT_ERROR === "string"', { timeout: 20000 });

    const failure = await page.evaluate('window.PRINT_ERROR || null');
    if (failure) throw new Error('print-cv.html: ' + failure);

    const out = path.join(ROOT, 'filippomoscatelli_' + lang + '.pdf');
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    console.log('  ' + lang + ' -> ' + path.relative(ROOT, out));
    return out;
  } finally {
    await page.close();
  }
}

async function main() {
  const chromePath = findChrome();
  if (!chromePath) {
    console.error('Chrome non trovato: installa Chrome/Chromium oppure imposta CHROME_PATH.');
    process.exit(1);
  }
  console.log('Chrome:', chromePath);

  const { server, port } = await startServer();
  console.log('Server statico: http://127.0.0.1:' + port);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    for (const lang of LANGS) {
      await renderPdf(browser, port, lang);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('PDF generati.');
}

main().catch((err) => {
  console.error('Errore:', err.message || err);
  process.exit(1);
});
