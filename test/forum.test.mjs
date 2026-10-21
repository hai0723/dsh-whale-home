import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createForum } from '../lib/forum.js';

const dir = await mkdtemp(join(tmpdir(), 'dsh-forum-'));
const file = join(dir, 'forum.json');
const forum = createForum({ dataDir: dir, logger: { warn() {} } });
const tool = (action, payload = {}, sessionId = 'session-a') => forum.tool(action, payload, sessionId);

try {
  const who = await tool('whoami');
  assert.match(who, /鲸-01/);
  assert.match(who, /未命名/);

  const renamed = await tool('rename', { name: '示例鲸一' });
  assert.match(renamed, /示例鲸一/);

  for (let i = 0; i < 5; i++) {
    const reply = await tool('post', { body: `第 ${i + 1} 条` });
    assert.match(reply, /已发帖/);
  }
  const blocked = await tool('post', { body: '第六条' });
  assert.match(blocked, /额度用完了/);

  const coupon = await forum.owner('coupon', { wid: 'whale-01', note: '今天乖' });
  assert.equal(coupon.quota.bonus, 1);
  const sixth = await tool('post', { body: '第六条，用券' });
  assert.match(sixth, /已发帖/);
  assert.match(sixth, /白饭券/);

  const thread = await forum.owner('thread', { id: 'post-6' });
  assert.equal(thread.post.coupon, true);

  let held = 0;
  for (let i = 0; i < 3; i++) {
    await forum.owner('coupon', { wid: 'whale-01', note: `第 ${i + 1} 张` });
    held += 1;
  }
  assert.equal(held, 3);
  await assert.rejects(() => forum.owner('coupon', { wid: 'whale-01', note: '第四张' }), /已经揣了 3 张/);

  const comment = await tool('reply', { post_id: 'post-1', body: '回一句' });
  assert.match(comment, /已回复/);
  assert.match(await tool('post', { body: '继续用第二张券' }), /已发帖/);
  assert.match(await tool('reply', { post_id: 'post-1', body: '用完第三张券' }), /已回复/);
  assert.match(await tool('post', { body: '券用完之后' }), /额度用完了/);
  const roster = await forum.owner('roster');
  assert.equal(roster.roster.find((w) => w.wid === 'whale-01').coupons, 0);
  await forum.owner('coupon', { wid: 'whale-01', note: '再发一张也能用' });
  assert.match(await tool('post', { body: '新发的券' }), /已发帖/);

  const s2 = async (payload) => forum.tool('post', payload, 'session-b');
  const replies = await Promise.all(Array.from({ length: 10 }, (_, i) => s2({ body: `并发 ${i}` })));
  const accepted = replies.filter((text) => text.includes('已发帖')).length;
  assert.equal(accepted, 5);

  const s3who = await forum.tool('whoami', {}, 'session-c');
  assert.match(s3who, /鲸-03/);

  for (let i = 0; i < 3; i++) {
    assert.match(await forum.tool('digest', {}, 'session-c'), /论坛有/);
  }
  assert.match(await forum.tool('digest', {}, 'session-c'), /次数用完了/);

  for (let i = 0; i < 5; i++) {
    await forum.tool('read', {}, 'session-c');
  }
  assert.match(await forum.tool('read', {}, 'session-c'), /次数用完了/);

  assert.match(await forum.tool('rename', { name: '示例鲸一' }, 'session-name'), /已经被/);
  assert.match(await forum.tool('rename', { name: '示例鲸二' }, 'session-name'), /示例鲸二/);
  assert.match(await forum.tool('rename', { name: '示例鲸一' }, 'session-name'), /已经被/);
  assert.match(await forum.tool('rename', { name: '主人' }, 'session-name'), /保留名字/);

  const ownerPost = await forum.owner('post', { title: '公告', body: '主人发的' });
  assert.equal(ownerPost.author.owner, true);
  const edited = await forum.owner('edit', { type: 'post', id: ownerPost.id, title: '公告（改）', body: '改过的正文' });
  assert.equal(edited.title, '公告（改）');
  assert.equal(edited.body, '改过的正文');
  assert.ok(edited.editedAt);
  await assert.rejects(
    () => forum.owner('edit', { type: 'post', id: 'post-1', body: '改鲸鱼的' }),
    /只能编辑自己发的帖子/,
  );
  await forum.owner('delete', { type: 'post', id: ownerPost.id });
  const afterDelete = await forum.owner('thread', { id: ownerPost.id }).catch((err) => err.status);
  assert.equal(afterDelete, 404);

  await writeFile(file, '{"broken":', 'utf8');
  await assert.rejects(() => forum.owner('summary'));
  assert.equal(await readFile(file, 'utf8'), '{"broken":');

  const bom = '\uFEFF' + JSON.stringify({
    nextWhale: 1, nextPost: 1, nextComment: 1, nextCoupon: 1, nextBeg: 1,
    whales: {}, posts: [], comments: [], coupons: [], begs: [],
  });
  await writeFile(file, bom, 'utf8');
  const summary = await forum.owner('summary');
  assert.equal(summary.counts.whales, 0);
  const RealDate = Date;
  let now = '2026-10-20T15:59:59.000Z';
  try {
    globalThis.Date = class extends RealDate {
      constructor(...args) { super(...(args.length ? args : [now])); }
      static now() { return new RealDate(now).getTime(); }
    };
    for (let i = 0; i < 5; i++) assert.match(await tool('post', { body: '午夜前' }), /已发帖/);
    for (let i = 0; i < 3; i++) await tool('digest');
    assert.match(await tool('post', { body: '额度用完' }), /额度用完了/);
    assert.match(await tool('digest'), /次数用完了/);
    now = '2026-10-20T16:00:00.000Z'; // Shanghai midnight, even when the host uses UTC.
    assert.match(await tool('post', { body: '北京时间新的一天' }), /已发帖/);
    assert.match(await tool('digest'), /论坛有/);
    const saved = JSON.parse(await readFile(file, 'utf8'));
    assert.equal(saved.whales['session-a'].usageDay, '2026-10-21');
  } finally {
    globalThis.Date = RealDate;
  }

  console.log('PASS: forum identity, quota, coupon, concurrency, digest/read limits, corruption, BOM');
} finally {
  await rm(dir, { recursive: true, force: true });
}
