const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createSdkArchive } = require('../.test-build/lib/archive.js');
const { validateWasm, MAX_WASM_BYTES } = require('../.test-build/lib/wasm.js');
const { readHistory, saveGeneration, HISTORY_LIMIT } = require('../.test-build/lib/history.js');
const header = Uint8Array.from([0, 97, 115, 109, 1, 0, 0, 0]);
function file(name, bytes) {
  const blob = new Blob([bytes]);
  return { name, size: blob.size, slice: (...args) => blob.slice(...args) };
}

test('accepts version 1 WASM and rejects renamed, empty and unsupported files', async () => {
  await validateWasm(file('counter.WASM', header));
  await assert.rejects(validateWasm(file('counter.txt', header)), /\.wasm/);
  await assert.rejects(validateWasm(file('counter.wasm', 'not wasm')), /WebAssembly/);
  await assert.rejects(validateWasm(file('counter.wasm', new Uint8Array())), /WebAssembly/);
  await assert.rejects(validateWasm(file('counter.wasm', Uint8Array.from([0,97,115,109,2,0,0,0]))), /WebAssembly/);
});

test('rejects oversized uploads before reading file contents', async () => {
  await assert.rejects(validateWasm({ name: 'big.wasm', size: MAX_WASM_BYTES + 1, slice() { throw Error('must not read'); } }), /10 MiB/);
});

test('archive preserves nested paths, UTF-8 content and empty files in standard tar readers', () => {
  const archive = createSdkArchive([
    { path: 'src/client.ts', content: 'export const symbol = "⚡";\n' },
    { path: 'empty.txt', content: '' },
    { path: 'package.json', content: '{}' },
  ]);
  assert.equal(execFileSync('tar', ['-tf', '-'], { input: archive }).toString(), 'src/client.ts\nempty.txt\npackage.json\n');
  assert.equal(execFileSync('tar', ['-xOf', '-', 'src/client.ts'], { input: archive }).toString(), 'export const symbol = "⚡";\n');
});

test('archive rejects traversal, absolute paths, duplicates and control characters', () => {
  for (const path of ['../secret', '/secret', 'C:\\secret', 'a/../../secret', 'a\0b', 'a//b']) {
    assert.throws(() => createSdkArchive([{ path, content: '' }]));
  }
  assert.throws(() => createSdkArchive([{ path: 'a', content: '' }, { path: 'a', content: '' }]));
});

test('history bounds metadata to the newest 20 successful generations', () => {
  let value = null;
  const storage = { getItem: () => value, setItem: (_, next) => { value = next; } };
  for (let i = 0; i < 25; i++) {
    assert.equal(saveGeneration(storage, { id: String(i), filename: 'counter.wasm', contractName: 'counter', language: 'go', fileCount: 2, createdAt: new Date().toISOString() }), true);
  }
  const history = readHistory(storage);
  assert.equal(history.length, HISTORY_LIMIT);
  assert.equal(history[0].id, '24');
  assert.equal(history[19].id, '5');
});

test('history tolerates corrupt data, invalid records and unavailable storage', () => {
  for (const value of ['{', '{}', '[null, {}, {"language":"invalid"}]']) {
    assert.deepEqual(readHistory({ getItem: () => value }), []);
  }
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } };
  assert.deepEqual(readHistory(blocked), []);
  assert.equal(saveGeneration(blocked, {}), false);
});
