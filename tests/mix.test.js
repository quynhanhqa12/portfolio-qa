import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mixCategories } from '../js/core/model.js';

const make = (spec) =>
  spec.split('').map((c, i) => ({ id: `p${i}-${c}`, category: c }));

// deterministic pseudo-random source so failures can be reproduced
function seeded(seed) {
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

const noTwinNeighbours = (list) => list.every((p, i) => i === 0 || p.category !== list[i - 1].category);

test('mixCategories keeps every project exactly once', () => {
  const projects = make('aaabbbccd');
  for (let seed = 1; seed < 50; seed++) {
    const out = mixCategories(projects, seeded(seed));
    assert.equal(out.length, projects.length);
    assert.deepEqual(out.map((p) => p.id).sort(), projects.map((p) => p.id).sort());
  }
});

test('mixCategories never puts two projects of one category side by side when that is possible', () => {
  for (const spec of ['aaabbbccd', 'aabbccdd', 'aaaabbbc', 'aaabb', 'abababa', 'aaaabbb']) {
    for (let seed = 1; seed < 200; seed++) {
      const out = mixCategories(make(spec), seeded(seed));
      assert.ok(noTwinNeighbours(out), `${spec} seed ${seed}: ${out.map((p) => p.category).join('')}`);
    }
  }
});

test('mixCategories gives different orders for different random sources', () => {
  const projects = make('aaabbbcccddd');
  const orders = new Set();
  for (let seed = 1; seed < 30; seed++) orders.add(mixCategories(projects, seeded(seed)).map((p) => p.id).join());
  assert.ok(orders.size > 5);
});

test('mixCategories still returns everything when a clash cannot be avoided', () => {
  const out = mixCategories(make('aaab'), seeded(3));
  assert.equal(out.length, 4);
  assert.equal(out.filter((p) => p.category === 'a').length, 3);
});

test('mixCategories does not modify its input and handles empty lists', () => {
  const projects = make('aab');
  const before = projects.map((p) => p.id).join();
  mixCategories(projects, seeded(1));
  assert.equal(projects.map((p) => p.id).join(), before);
  assert.deepEqual(mixCategories([], seeded(1)), []);
  assert.deepEqual(mixCategories(undefined, seeded(1)), []);
});
