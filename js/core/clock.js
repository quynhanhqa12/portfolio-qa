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
