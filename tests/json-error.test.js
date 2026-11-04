import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locateJsonError, parseJson, jsonErrorMessageVi } from '../js/core/json-error.js';

test('parseJson parses valid JSON', () => {
  assert.deepEqual(parseJson('{"a":1}'), { ok: true, data: { a: 1 } });
});

test('parseJson locates a trailing comma', () => {
  const r = parseJson('{\n  "a": 1,\n  "b": 2,\n}');
  assert.equal(r.ok, false);
  assert.equal(r.line, 4);
});

test('parseJson locates a missing comma', () => {
  const r = parseJson('{\n  "a": 1\n  "b": 2\n}');
  assert.equal(r.ok, false);
  assert.equal(r.line, 3);
});

test('locateJsonError handles "position N"', () => {
  assert.deepEqual(locateJsonError('ab\ncd', 'Unexpected token in JSON at position 4'), { line: 2, column: 2 });
});

test('locateJsonError handles "line L column C"', () => {
  assert.deepEqual(
    locateJsonError('x', 'JSON.parse: expected , at line 7 column 3 of the JSON data'),
    { line: 7, column: 3 },
  );
});

test('locateJsonError returns null when no location (Safari)', () => {
  assert.equal(locateJsonError('x', "JSON Parse error: Expected '}'"), null);
});

test('jsonErrorMessageVi with and without location', () => {
  assert.ok(jsonErrorMessageVi({ ok: false, line: 4, column: 1 }).includes('dòng 4'));
  assert.ok(jsonErrorMessageVi({ ok: false, line: null, column: null }).includes('lỗi cú pháp'));
});
