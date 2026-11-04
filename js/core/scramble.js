// Text "scramble" reveal used by the Home intro (pure, no DOM).
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** One frame of the reveal: the leading `progress` share of characters is final,
 *  the rest are random capitals; spaces and punctuation are kept so the shape holds. */
export function scrambleFrame(text, progress, random = Math.random) {
  const chars = Array.from(text || '');
  const shown = Math.floor(Math.min(Math.max(progress, 0), 1) * chars.length);
  return chars
    .map((ch, i) => {
      if (i < shown || !/\p{L}/u.test(ch)) return ch;
      return GLYPHS[Math.floor(random() * GLYPHS.length) % GLYPHS.length];
    })
    .join('');
}
