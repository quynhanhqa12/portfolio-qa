import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadData, DataError } from '../js/core/data.js';

const okResponse = (text) => ({ ok: true, status: 200, text: async () => text });

test('loadData passes url and no-cache option to fetchFn', async () => {
  let args;
  await loadData('x.json', async (...a) => { args = a; return okResponse('{}'); });
  assert.deepEqual(args, ['x.json', { cache: 'no-cache' }]);
});

test('loadData returns parsed object', async () => {
  const data = await loadData('data.json', async () => okResponse('{"a":1}'));
  assert.deepEqual(data, { a: 1 });
});

test('loadData rejects with DataError on HTTP error', async () => {
  await assert.rejects(
    loadData('data.json', async () => ({ ok: false, status: 404 })),
    (e) => e instanceof DataError && e.userMessage.includes('404'),
  );
});

test('loadData rejects with DataError on network failure', async () => {
  await assert.rejects(
    loadData('data.json', async () => { throw new TypeError('Failed to fetch'); }),
    (e) => e instanceof DataError && e.userMessage.includes('kết nối mạng'),
  );
});

test('loadData rejects with DataError on invalid JSON', async () => {
  await assert.rejects(
    loadData('data.json', async () => okResponse('{\n "a": 1,\n}')),
    (e) => e instanceof DataError && e.userMessage.includes('dòng'),
  );
});
