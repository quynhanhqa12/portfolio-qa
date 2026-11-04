import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatHanoiTime } from '../js/core/clock.js';

test('formatHanoiTime formats Asia/Ho_Chi_Minh as HH:MM AM/PM', () => {
  assert.equal(formatHanoiTime(new Date('2026-01-01T01:32:00Z')), '08:32 AM');
  assert.equal(formatHanoiTime(new Date('2026-01-01T13:05:00Z')), '08:05 PM');
  assert.equal(formatHanoiTime(new Date('2026-01-01T17:00:00Z')), '12:00 AM');
});
