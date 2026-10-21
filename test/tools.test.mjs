import { mkdtemp, rm } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildForumTool, createForum } from '../lib/forum.js';

const dir = await mkdtemp(join(tmpdir(), 'dsh-forum-tools-'));
const forum = createForum({ dataDir: dir, logger: { warn() {} } });

function fakeRes() {
  return {
    status: 0,
    headers: {},
    body: '',
    writeHead(status, headers) {
      this.status = status;
      this.headers = headers || {};
    },
    end(body) {
      this.body = body || '';
    },
  };
}

try {
  const defs = [];
  await forum.registerTools({ tools: { register: (def) => defs.push(def) } });
  assert.equal(defs.length, 8);
  assert.deepEqual(defs.map((d) => d.name).sort(), [
    'forum_beg', 'forum_digest', 'forum_post', 'forum_react',
    'forum_read', 'forum_rename', 'forum_reply', 'forum_whoami',
  ]);
  // Check the serialized schema actually sent to the model, not just handlers.
  for (const def of defs) {
    const schema = JSON.parse(JSON.stringify(def.parameters));
    assert.equal(schema.type, 'object', def.name);
    assert.equal(schema.additionalProperties, false);
    assert.ok(Array.isArray(schema.required));
    for (const field of Object.values(schema.properties)) {
      assert.equal(field.type, 'string');
      assert.equal(Object.hasOwn(field, 'required'), false);
    }
    for (const key of schema.required) assert.ok(Object.hasOwn(schema.properties, key));
  }
  const beg = defs.find((d) => d.name === 'forum_beg');
  assert.deepEqual(beg.parameters, {
    type: 'object',
    properties: { note: { type: 'string', description: '一句理由，最多 100 字。' } },
    required: ['note'],
    additionalProperties: false,
  });
  const exec = { agent: { session: { id: 'session-tool-a' } } };
  for (const args of [{}, { note: 42 }, { note: 'hello', owner: true }, null, []]) {
    assert.throws(() => beg.execute(args, exec), /Invalid arguments/);
  }
  assert.throws(() => buildForumTool({
    name: 'broken', parameters: { note: { type: 'unknown' } }, execute() {},
  }), /Unsupported forum tool parameter/);
  // A rejecting registry must not prevent startup or HTTP registration.
  let attempts = 0;
  await forum.registerTools({ tools: { register() { attempts++; throw new Error('unavailable'); } } });
  assert.equal(attempts, 8);
  await forum.registerTools({});

  const who = defs.find((d) => d.name === 'forum_whoami');
  const text = await who.execute({}, { agent: { session: { id: 'session-tool-a' } } });
  assert.match(text, /鲸-01/);

  const post = defs.find((d) => d.name === 'forum_post');
  const posted = await post.execute({ body: '工具发的帖子' }, { agent: { session: { id: 'session-tool-a' } } });
  assert.match(posted, /已发帖/);

  const noAgent = await who.execute({}, {});
  assert.match(noAgent, /只能在会话/);

  let route = null;
  const dispose = forum.registerRoutes({
    register(definition) {
      route = definition;
      return () => {};
    },
  });
  assert.equal(typeof dispose, 'function');
  assert.equal(route.path, '/dsh-whale/forum');

  const ok = fakeRes();
  await route.handler({ method: 'GET', url: '/dsh-whale/forum?action=summary' }, ok);
  assert.equal(ok.status, 200);
  const summary = JSON.parse(ok.body);
  assert.equal(summary.counts.posts, 1);

  const bad = fakeRes();
  await route.handler({ method: 'GET', url: '/dsh-whale/forum?action=nope' }, bad);
  assert.equal(bad.status, 400);
  for (const action of ['post', 'comment', 'react', 'coupon', 'delete']) {
    const res = fakeRes();
    await route.handler({ method: 'GET', url: `/dsh-whale/forum?action=${action}` }, res);
    assert.equal(res.status, 405);
    assert.equal(res.headers.allow, 'POST');
  }

  console.log('PASS: forum tool definitions, session identity, routes');
} finally {
  await rm(dir, { recursive: true, force: true });
}
