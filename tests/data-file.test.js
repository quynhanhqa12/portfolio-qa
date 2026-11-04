import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateData } from '../js/core/model.js';

const raw = readFileSync(new URL('../data.json', import.meta.url), 'utf8');

test('data.json parses and validates with no warnings', () => {
  const parsed = JSON.parse(raw);
  const { data, warnings } = validateData(parsed);
  assert.deepEqual(warnings, []);
  assert.ok(data.projects.length > 0);
  const ids = new Set(data.categories.map((c) => c.id));
  for (const p of data.projects) assert.ok(ids.has(p.category), p.id);
});
