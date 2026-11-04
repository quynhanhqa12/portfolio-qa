// Hanoi clock formatting (time zone Asia/Ho_Chi_Minh, e.g. "08:32 AM").
const hanoiFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Ho_Chi_Minh',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

/** "08:32 AM" for the given instant, in Hanoi time. */
export function formatHanoiTime(date) {
  return hanoiFormat.format(date);
}

/** Milliseconds from nowMs to just after the next minute boundary (margin keeps a timer from landing early). */
export function msUntilNextMinute(nowMs, marginMs = 50) {
  return 60000 - (nowMs % 60000) + marginMs;
}
