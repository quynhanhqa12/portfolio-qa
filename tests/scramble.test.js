import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scrambleFrame } from '../js/core/scramble.js';

const always = (value) => () => value;

test('scrambleFrame at progress 0 replaces every letter, keeps spaces', () => {
  assert.equal(scrambleFrame('Art space', 0, always(0)), 'AAA AAAAA');
});

test('scrambleFrame reveals the leading share of characters', () => {
  assert.equal(scrambleFrame('QUYNH', 0.4, always(0)), 'QUAAA');
});

test('scrambleFrame at progress 1 or more returns the final text', () => {
  assert.equal(scrambleFrame('Welcome to', 1, always(0.5)), 'Welcome to');
  assert.equal(scrambleFrame('Welcome to', 1.7, always(0.5)), 'Welcome to');
});

test('scrambleFrame keeps the original length and non-letters', () => {
  const out = scrambleFrame('a-b c.', 0, always(0.99));
  assert.equal(out.length, 6);
  assert.equal(out[1], '-');
  assert.equal(out[3], ' ');
  assert.equal(out[5], '.');
});

test('scrambleFrame clamps negative progress and empty text', () => {
  assert.equal(scrambleFrame('ab', -1, always(0)), 'AA');
  assert.equal(scrambleFrame('', 0.5, always(0)), '');
});
