import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const allowed = new Set([
  '.gitignore', '.npmignore', 'README.md', 'LICENSE', 'package.json', 'cordis.patch.yml',
  'lib/client.js', 'lib/forum.js', 'lib/index.js',
  'test/regression.mjs', 'test/forum.test.mjs', 'test/tools.test.mjs',
  'docs/FORUM_GUIDE.md', 'docs/PRIVACY.md', 'scripts/check-release.mjs',
]);
const seen = new Set();
const rules = [
  ['absolute Windows path', /\b[A-Za-z]:[\\/]/],
  ['Unix personal directory', /\/(?:Users|home)\/[A-Za-z0-9_.-]+\//],
  ['email address', /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/],
  ['UUID or real session identifier', /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i],
  ['common access token', /(?:sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AIza[A-Za-z0-9_-]{30,})/],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['credential assignment', /(?:api[_-]?key|password|access[_-]?token|client[_-]?secret)\s*[:=]\s*["'][^"'\r\n]{8,}["']/i],
];
const localName = basename(process.env.USERPROFILE || process.env.HOME || '');
if (localName.length >= 3) {
  const escaped = localName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  rules.push(['local account name', new RegExp(`\\b${escaped}\\b`, 'i')]);
}
async function walk(relative = '') {
  for (const entry of await readdir(join(root, relative), { withFileTypes: true })) {
    // A fresh Git repository may be created later; its history needs a separate review.
    if (!relative && entry.name === '.git' && entry.isDirectory()) continue;
    const file = relative ? `${relative}/${entry.name}` : entry.name;
    assert.ok(!entry.isSymbolicLink(), `Link is not permitted: ${file}`);
    if (entry.isDirectory()) {
      assert.ok([...allowed].some((name) => name.startsWith(file + '/')), `Unexpected directory: ${file}`);
      await walk(file);
      continue;
    }
    assert.ok(entry.isFile() && allowed.has(file), `Unexpected file: ${file}`);
    seen.add(file);
    const text = await readFile(join(root, file), 'utf8');
    for (const [label, pattern] of rules) {
      assert.ok(!pattern.test(text), `Privacy review required (${label}): ${file}`);
    }
  }
}
await walk();
assert.deepEqual([...seen].sort(), [...allowed].sort(), 'Release files missing');
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
assert.equal(manifest.name, 'dsh-whale-home');
assert.equal(manifest.license, 'MIT');
assert.deepEqual(manifest.files, ['lib/client.js', 'lib/forum.js', 'lib/index.js', 'cordis.patch.yml', 'README.md', 'LICENSE', 'docs/']);
console.log(`PASS: ${seen.size} approved text files; no data, debug files, backups, or common privacy/credential matches`);
