// Home intro, modelled on the reference video: a splash scene with the girl
// illustration and cycling thought icons (no "Loading…" text, per Quỳnh Anh's note); the scene fades out, then the page fades in
// with the same character appearing together with the hero lines.

const MIN_LOADING_MS = 1800;
const MAX_LOADING_MS = 4000;
const THOUGHT_EVERY_MS = 380;
const FADE_OUT_MS = 900;
const FADE_IN_MS = 1400;
const LINE_STAGGER_MS = 260;
// gentle ease-in-out: no snap at the start, long soft landing
const EASE_SOFT = 'cubic-bezier(0.45, 0, 0.2, 1)';

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
  let icon = 0;
  icons[0]?.classList.add('is-on');
  const cycle = setInterval(() => {
    icons[icon]?.classList.remove('is-on');
    icon = (icon + 1) % icons.length;
    icons[icon]?.classList.add('is-on');
  }, THOUGHT_EVERY_MS);

  return () => clearInterval(cycle);
}

/** Resolves once fonts and the illustration are ready, never before MIN or after MAX. */
// The fonts the hero needs. Asked for by name: document.fonts.ready alone can resolve before the
// page has even requested them, and the hero then appeared in a fallback font for a moment
// (its script "A" sits higher, so the A of "Anh" looked pushed up).
const HERO_FONTS = ['125px "Rouge Script"', '62px "Gilda Display"', '300 16px "Be Vietnam Pro"'];

function loadingDone(intro) {
  const girl = intro.querySelector('.intro__girl');
  const fonts = document.fonts
    ? Promise.all(HERO_FONTS.map((font) => document.fonts.load(font, 'A').catch(() => {}))).then(() => document.fonts.ready)
    : Promise.resolve();
  const ready = Promise.all([fonts, girl?.decode ? girl.decode().catch(() => {}) : Promise.resolve()]);
  return Promise.race([Promise.all([ready, wait(MIN_LOADING_MS)]), wait(MAX_LOADING_MS)]);
}

/** Fade the whole loading scene out (character, icons, backdrop). */
async function fadeOutScene(intro) {
  intro.classList.add('is-leaving');
  const out = intro.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: FADE_OUT_MS,
    easing: 'ease-in-out',
    fill: 'forwards',
  });
  // timers keep going when a background tab stops painting, so never wait on frames alone
  await Promise.race([out.finished, wait(FADE_OUT_MS + 150)]);
}

const fadeIn = (node, delay, from = '0 8px') =>
  node?.animate(
    [{ opacity: 0, translate: from }, { opacity: 1, translate: '0 0' }],
    { duration: FADE_IN_MS, delay, easing: EASE_SOFT, fill: 'backwards' }
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
  const heroIn = lines.map((node, i) => fadeIn(node, 150 + i * LINE_STAGGER_MS)).filter(Boolean);
  // the character from the loading scene shows up again in the layout, with the text
  fadeIn(document.querySelector('.art__girl'), 150);

  const header = document.querySelectorAll('.site-header__left, .logo, .site-header__right');
  header.forEach((node, i) => fadeIn(node, 500 + i * 180, '0 -8px'));
  fadeIn(document.querySelector('.home__portrait'), 400, '-12px 0');
  fadeIn(document.querySelector('.hero__go'), 1200);
  fadeIn(document.querySelector('.home__titles'), 1400);
  document.querySelectorAll('.art__cube, .art__eye').forEach((node, i) => {
    node.animate(
      [{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }],
      { duration: FADE_IN_MS, delay: 400 + i * 200, easing: EASE_SOFT, fill: 'backwards' }
    );
  });

  // timers keep going when a background tab stops painting, so never wait on frames alone
  return Promise.race([Promise.all(heroIn.map((a) => a.finished)), wait(150 + 3 * LINE_STAGGER_MS + FADE_IN_MS + 200)]);
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
    await fadeOutScene(intro);
    intro.remove();
    await revealPage();
  } catch (err) {
    console.error(err);
  } finally {
    finish();
  }
}
