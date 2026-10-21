import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createForum } from './forum.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'data');
const RECORD = join(DATA_DIR, '喂饭记录.txt');
const MAX_FEEDS = 1000;
let mutationQueue = Promise.resolve();

export const name = 'dsh-whale-home';

function normalize(parsed) {
  const count = parsed && parsed.count;
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error('喂饭记录中的 count 无效，已保留原文件，请检查记录。');
  }
  let feeds = Array.isArray(parsed && parsed.feeds)
    ? parsed.feeds.filter((s) => typeof s === 'string' && !Number.isNaN(Date.parse(s)))
    : [];
  const lastFed = typeof (parsed && parsed.lastFed) === 'string'
    && !Number.isNaN(Date.parse(parsed.lastFed))
    ? parsed.lastFed
    : (feeds.length > 0 ? feeds[feeds.length - 1] : null);
  if (feeds.length === 0 && lastFed !== null) feeds = [lastFed];
  return { count, lastFed, feeds };
}

async function readRecord() {
  try {
    const text = (await readFile(RECORD, 'utf8')).replace(/^\uFEFF/, '');
    return normalize(JSON.parse(text));
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return { count: 0, lastFed: null, feeds: [] };
    }
    throw err;
  }
}

async function writeRecord(data) {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = RECORD + '.tmp';
  await writeFile(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
  await rename(tmp, RECORD);
}

function feedRecord() {
  // Serialize the entire read/modify/write transaction, not just the write.
  const result = mutationQueue.then(async () => {
    const data = await readRecord();
    if (data.count === Number.MAX_SAFE_INTEGER) throw new Error('喂饭次数已达到上限。');
    const now = new Date().toISOString();
    data.count += 1;
    data.lastFed = now;
    data.feeds.push(now);
    if (data.feeds.length > MAX_FEEDS) data.feeds = data.feeds.slice(-MAX_FEEDS);
    await writeRecord(data);
    return data;
  });
  // A failed transaction must not prevent later requests from running.
  mutationQueue = result.catch(() => {});
  return result;
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(body));
}

function localDayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function computeStats(feeds, now = new Date()) {
  const days = new Map();
  for (const iso of feeds) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    const key = localDayKey(d);
    days.set(key, (days.get(key) || 0) + 1);
  }
  const todayCount = days.get(localDayKey(now)) || 0;
  let streak = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(localDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(localDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { todayCount, days: days.size, streak };
}

function publicView(data) {
  return {
    count: data.count,
    lastFed: data.lastFed,
    feeds: data.feeds.slice(-20),
    stats: computeStats(data.feeds, new Date()),
  };
}

export function apply(ctx) {
  const forum = createForum({ dataDir: DATA_DIR });

  ctx.inject(['webServer'], (ctx) => {
    const disposers = [];

    disposers.push(ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-whale/count',
      handler: async (req, res) => {
        if (req.method !== 'GET') {
          res.writeHead(405, { allow: 'GET' });
          res.end();
          return;
        }
        try {
          sendJson(res, 200, publicView(await readRecord()));
        } catch (err) {
          sendJson(res, 500, { error: String((err && err.message) || err) });
        }
      },
    }));

    disposers.push(ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-whale/feed',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { allow: 'POST' });
          res.end();
          return;
        }
        try {
          const data = await feedRecord();
          sendJson(res, 200, publicView(data));
        } catch (err) {
          sendJson(res, 500, { error: String((err && err.message) || err) });
        }
      },
    }));

    disposers.push(forum.registerRoutes(ctx.webServer));

    ctx.effect(() => () => {
      for (const dispose of disposers) {
        try {
          dispose();
        } catch {}
      }
    }, 'whale-home: routes');
  });

  ctx.inject(['tools'], (ctx) => {
    void forum.registerTools(ctx).catch((err) => {
      console.warn('[dsh-whale-home] 论坛工具注册失败：' + String((err && err.message) || err));
    });
  });
}
