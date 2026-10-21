import { mkdtemp, mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const testDir = dirname(fileURLToPath(import.meta.url));
const source = dirname(testDir);
const root = await mkdtemp(join(testDir, '.tmp-'));
try {
await mkdir(join(root, 'lib'));
await mkdir(join(root, 'data'));
await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module' }));
await copyFile(join(source, 'lib/index.js'), join(root, 'lib/index.mjs'));
await copyFile(join(source, 'lib/forum.js'), join(root, 'lib/forum.js'));
const record = join(root, 'data/喂饭记录.txt');
const { apply } = await import(pathToFileURL(join(root, 'lib/index.mjs')));
const routes = new Map();
apply({ inject(deps, cb) { cb({
  webServer: { register(route) { routes.set(route.path, route.handler); return () => {}; } },
  effect(fn) { fn(); },
}); } });
async function call(path, method) {
  const res = { status: 0, body: '', writeHead(status) { this.status = status; }, end(body) { this.body = body; } };
  await routes.get('/dsh-whale/' + path)({ method }, res);
  return { status: res.status, data: res.body ? JSON.parse(res.body) : null };
}
await writeFile(record, JSON.stringify({ count: 0, lastFed: null, feeds: [] }));
const firstFeed = await call('feed', 'POST');
assert.equal(firstFeed.data.count, 1);
assert.equal(firstFeed.data.stats.todayCount, 1);
assert.equal(firstFeed.data.stats.days, 1);
assert.equal(firstFeed.data.stats.streak, 1);
assert.equal((await call('feed', 'GET')).status, 405);
assert.equal((await call('count', 'POST')).status, 405);
for (let trial = 0; trial < 3; trial++) {
  await writeFile(record, JSON.stringify({ count: 0, lastFed: null, feeds: [] }));
  const replies = await Promise.all(Array.from({ length: 20 }, () => call('feed', 'POST')));
  const final = await call('count', 'GET');
  assert.ok(replies.every(r => r.status === 200));
  assert.equal(final.data.count, 20);
  assert.equal(final.data.feeds.length, 20);
}
for (const invalid of ['{"count":42,"feeds":[', '{"count":-1}', '{"count":"bad"}', 'null']) {
  await writeFile(record, invalid);
  assert.equal((await call('count', 'GET')).status, 500);
  assert.equal((await call('feed', 'POST')).status, 500);
  assert.equal(await readFile(record, 'utf8'), invalid);
}
// A UTF-8 BOM from a hand-edited file must not be treated as corruption.
const bomTime = '2026-10-20T05:00:00Z';
await writeFile(record, '\uFEFF' + JSON.stringify({ count: 3, lastFed: bomTime, feeds: [bomTime] }));
assert.equal((await call('count', 'GET')).data.count, 3);
// After errors, the queue must recover and missing files must initialize.
await rm(record);
assert.equal((await call('count', 'GET')).data.count, 0);
assert.equal((await call('feed', 'POST')).data.count, 1);
const time = '2026-10-20T05:00:00Z';
await writeFile(record, JSON.stringify({ count: 1000, lastFed: time, feeds: Array(1000).fill(time) }));
assert.equal((await call('feed', 'POST')).data.count, 1001);
assert.equal(JSON.parse(await readFile(record, 'utf8')).feeds.length, 1000);
assert.equal((await call('count', 'GET')).data.feeds.length, 20);
console.log('PASS: concurrency, corrupt-file preservation, recovery, history limit, HTTP methods');

// Run the actual client with a minimal hook renderer and controllable responses.
let registration, panel, cursor = 0;
const state = [], effects = [], pending = new Map();
const React = {
  useState(value) { const i = cursor++; if (!(i in state)) state[i] = value; return [state[i], v => { state[i] = typeof v === 'function' ? v(state[i]) : v; }]; },
  useRef(value) { const i = cursor++; if (!(i in state)) state[i] = { current: value }; return state[i]; },
  useCallback(fn) { return fn; },
  useEffect(fn) { effects.push(fn); },
  createElement(type, props, ...children) { return { type, props, children }; },
};
const sandbox = {
  window: { __ModuleLoader__: { load(reg) { registration = reg; } } },
  fetch(url) { return new Promise(resolve => pending.set(url, resolve)); },
};
vm.runInNewContext(await readFile(join(source, 'lib/client.js'), 'utf8'), sandbox);
registration.factory(() => React).apply({
  effect() {}, slots: {
    inject(name, cb) { return cb(); },
    register(options, Component) { if (options.name === 'main') panel = Component; return () => {}; },
  },
});
function render() { cursor = 0; return panel(); }
function findFeedButton(node) {
  if (!node || typeof node !== 'object') return null;
  if (node.type === 'button' && node.props && node.props['aria-label'] === '喂一碗白饭') return node;
  for (const child of node.children || []) {
    const found = findFeedButton(child);
    if (found) return found;
  }
  return null;
}
const tree = render();
const cleanup = effects[0]();
const button = findFeedButton(tree);
const feeding = button.props.onClick();
const originalFeedResponse = pending.get('/dsh-whale/feed');
await button.props.onClick();
assert.equal(pending.get('/dsh-whale/feed'), originalFeedResponse, 'duplicate clicks must be ignored');
const newData = { count: 8, lastFed: '2026-10-20T05:00:00Z', feeds: ['2026-10-20T05:00:00Z'] };
pending.get('/dsh-whale/feed')({ ok: true, json: async () => newData });
await feeding;
assert.equal(state[0], 8);
const successMessage = state[3];
pending.get('/dsh-whale/count')({ ok: true, json: async () => ({ count: 7, lastFed: null, feeds: [] }) });
await new Promise(resolve => setImmediate(resolve));
assert.equal(state[0], 8);
assert.equal(state[3], successMessage);
// An older failed load must not replace successful feedback either.
const loading = effects[0]();
const nextFeeding = findFeedButton(render()).props.onClick();
pending.get('/dsh-whale/feed')({ ok: true, json: async () => ({ ...newData, count: 9 }) });
await nextFeeding;
const nextMessage = state[3];
pending.get('/dsh-whale/count')({ ok: false, status: 500 });
await new Promise(resolve => setImmediate(resolve));
assert.equal(state[0], 9);
assert.equal(state[3], nextMessage);
// Disposed effects must ignore late responses.
const dispose = effects[0]();
dispose();
pending.get('/dsh-whale/count')({ ok: true, json: async () => ({ count: 1, lastFed: null, feeds: [] }) });
await new Promise(resolve => setImmediate(resolve));
assert.equal(state[0], 9);
cleanup();
loading();
console.log('PASS: stale success/error responses, duplicate clicks, effect cleanup');
} finally {
  assert.ok(root.startsWith(join(testDir, '.tmp-')));
  await rm(root, { recursive: true, force: true });
}
