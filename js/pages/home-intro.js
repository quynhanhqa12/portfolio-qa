// Home intro, modelled on the reference video: a "Loading…" scene with the girl
// illustration and cycling thought icons, then the girl flies into her place in the
// layout and the page fades in, hero lines one after another.

const MIN_LOADING_MS = 1800;
const MAX_LOADING_MS = 4000;
const THOUGHT_EVERY_MS = 380;
const LAND_MS = 900;
const LINE_STAGGER_MS = 160;
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

let state = 'idle'; // idle → playing → done

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function finish() {
  state = 'done';
  document.getElementById('intro')?.remove();
  document.body.classList.remove('is-intro');
}

/** End the intro at once if it never started (failed boot, fatal panel). */
export function skipIntro() {
  if (state === 'idle') finish();
}

function startLoadingScene(intro) {
  const icons = [...intro.querySelectorAll('.intro__thought img')];
  const count = intro.querySelector('.intro__count');
  let icon = 0;
  icons[0]?.classList.add('is-on');
  const cycle = setInterval(() => {
    icons[icon]?.classList.remove('is-on');
    icon = (icon + 1) % icons.length;
    icons[icon]?.classList.add('is-on');
  }, THOUGHT_EVERY_MS);

  const started = performance.now();
  let frame = 0;
  const tick = (now) => {
    const p = Math.min((now - started) / MIN_LOADING_MS, 1);
    if (count) count.textContent = `(${Math.round((1 - (1 - p) ** 3) * 100)})`;
    if (p < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    clearInterval(cycle);
    cancelAnimationFrame(frame);
    if (count) count.textContent = '(100)';
  };
}

/** Resolves once fonts and the illustration are ready, never before MIN or after MAX. */
function loadingDone(intro) {
  const girl = intro.querySelector('.intro__girl');
  const ready = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    girl?.decode ? girl.decode().catch(() => {}) : Promise.resolve(),
  ]);
  return Promise.race([Promise.all([ready, wait(MIN_LOADING_MS)]), wait(MAX_LOADING_MS)]);
}

/** Fly the overlay girl onto the real one in the layout (FLIP), fading the backdrop. */
async function land(intro) {
  const from = intro.querySelector('.intro__girl');
  const to = document.querySelector('.art__girl');
  intro.classList.add('is-leaving');
  if (!from || !to) return;

  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const dx = b.left - a.left;
  const dy = b.top - a.top;
  const k = a.width ? b.width / a.width : 1;
  const flight = from.animate(
    [{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${k})` }],
    { duration: LAND_MS, easing: EASE_OUT, fill: 'forwards' }
  );
  // timers keep going when a background tab stops painting, so never wait on frames alone
  await Promise.race([flight.finished, wait(LAND_MS + 150)]);
}

const fadeIn = (node, delay, from = '0 16px') =>
  node?.animate(
    [{ opacity: 0, translate: from }, { opacity: 1, translate: '0 0' }],
    { duration: 700, delay, easing: EASE_OUT, fill: 'backwards' }
  );

function revealPage() {
  document.body.classList.remove('is-intro');

  // hero lines fade in one after another (script capitals included)
  const lines = [
    '.hero__welcome',
    '.hero__art',
    '.hero__of',
    '.hero__name',
  ]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);
  const heroIn = lines.map((node, i) => fadeIn(node, 100 + i * LINE_STAGGER_MS, '0 10px')).filter(Boolean);

  const header = document.querySelectorAll('.site-header__left, .logo, .site-header__right');
  header.forEach((node, i) => fadeIn(node, 300 + i * 120, '0 -16px'));
  fadeIn(document.querySelector('.home__portrait'), 250, '-24px 0');
  fadeIn(document.querySelector('.hero__go'), 800);
  fadeIn(document.querySelector('.home__titles'), 900);
  document.querySelectorAll('.art__cube, .art__eye').forEach((node, i) => {
    node.animate(
      [{ opacity: 0, translate: '0 24px' }, { opacity: 1, translate: '0 0' }],
      { duration: 650, delay: 150 + i * 150, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'backwards' }
    );
  });

  // timers keep going when a background tab stops painting, so never wait on frames alone
  return Promise.race([Promise.all(heroIn.map((a) => a.finished)), wait(1600)]);
}

/** Run the intro once the page is rendered. Called on every visit to Home. */
export async function playIntro() {
  const intro = document.getElementById('intro');
  if (state !== 'idle' || !intro) return;
  if (reducedMotion()) {
    finish();
    return;
  }
  state = 'playing';
  try {
    const stopLoading = startLoadingScene(intro);
    await loadingDone(intro);
    stopLoading();
    await land(intro);
    intro.remove(); // the real girl takes over exactly where the flying one landed
    await revealPage();
  } catch (err) {
    console.error(err);
  } finally {
    finish();
  }
}
