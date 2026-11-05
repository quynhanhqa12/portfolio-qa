import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseEmphasis } from '../js/core/model.js';

test('parseEmphasis splits **bold** runs from plain text', () => {
  assert.deepEqual(parseEmphasis('I am **Quỳnh Anh**, a designer'), [
    { text: 'I am ', bold: false },
    { text: 'Quỳnh Anh', bold: true },
    { text: ', a designer', bold: false },
  ]);
});

test('parseEmphasis handles several bold runs and text without any', () => {
  assert.deepEqual(parseEmphasis('**a** and **b**'), [
    { text: 'a', bold: true },
    { text: ' and ', bold: false },
    { text: 'b', bold: true },
  ]);
  assert.deepEqual(parseEmphasis('plain'), [{ text: 'plain', bold: false }]);
});

test('parseEmphasis keeps an unmatched ** as plain text and ignores empty input', () => {
  assert.deepEqual(parseEmphasis('5 ** 2'), [{ text: '5 ** 2', bold: false }]);
  assert.deepEqual(parseEmphasis(''), []);
  assert.deepEqual(parseEmphasis(undefined), []);
});
