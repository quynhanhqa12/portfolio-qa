// Smooth scrolling to a section, the same in every browser (Quỳnh Anh's note: the About page's
// down arrow must glide, not jump).
//
// Why not just `scroll-behavior: smooth` + an anchor link: the pages are scaled with CSS zoom
// (js/fit.js), and browsers disagree about zoom — Chrome reports element positions in screen
// pixels, Safari (older WebKit zoom) in unzoomed page pixels — so the browser's own anchor jump can
// land in the wrong place or skip the animation. Here the target is measured and converted to
// scroll units first, then the page is animated frame by frame.

const DURATION_MS = 800;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2); // ease-in-out cubic

/** Scroll units per getBoundingClientRect unit (1 in Chrome, the zoom factor in Safari). */
function rectToScroll() {
  const root = document.documentElement;
  const rectHeight = root.getBoundingClientRect().height;
  return rectHeight > 0 ? root.scrollHeight / rectHeight : 1;
}

/** Scroll position that puts `target` right under the sticky header. */
export function scrollTopFor(target) {
  const k = rectToScroll();
  const header = document.getElementById('site-header');
  const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
  const offset = (target.getBoundingClientRect().top - Math.max(0, headerBottom)) * k;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(max, Math.max(0, window.scrollY + offset));
}

let frame = 0;

/** Glide to `target`; `instant` jumps (page arrival, reduced motion). */
export function glideTo(target, { instant = false } = {}) {
  if (!target) return;
  cancelAnimationFrame(frame);
  const to = scrollTopFor(target);
  const from = window.scrollY;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (instant || reduced || Math.abs(to - from) < 2) {
    window.scrollTo({ top: to, behavior: 'instant' });
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / DURATION_MS);
    window.scrollTo({ top: from + (to - from) * ease(t), behavior: 'instant' });
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  // a wheel / touch from the visitor takes over at once
  const stop = () => cancelAnimationFrame(frame);
  window.addEventListener('wheel', stop, { once: true, passive: true });
  window.addEventListener('touchstart', stop, { once: true, passive: true });
}

/** Make links to `#id` on this page glide instead of jumping. */
export function glideLinks(selector) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.(selector);
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return; // another page: normal navigation
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, '', url.hash);
    glideTo(target);
  });
}
