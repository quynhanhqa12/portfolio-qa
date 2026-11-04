import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatHanoiTime, msUntilNextMinute } from '../js/core/clock.js';

test('formatHanoiTime formats Asia/Ho_Chi_Minh as HH:MM AM/PM', () => {
  assert.equal(formatHanoiTime(new Date('2026-01-01T01:32:00Z')), '08:32 AM');
  assert.equal(formatHanoiTime(new Date('2026-01-01T13:05:00Z')), '08:05 PM');
  assert.equal(formatHanoiTime(new Date('2026-01-01T17:00:00Z')), '12:00 AM');
});

test('msUntilNextMinute targets just after the next minute boundary', () => {
  const minute = Date.parse('2026-01-01T01:32:00.000Z');
  assert.equal(msUntilNextMinute(minute), 60050);
  assert.equal(msUntilNextMinute(minute + 30000), 30050);
  assert.equal(msUntilNextMinute(minute + 59990), 60);
  assert.equal(msUntilNextMinute(minute + 30000, 0), 30000);
});
