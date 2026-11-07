import { bootPage, el, imageBox } from '../ui/shell.js';
import { parseEmphasis } from '../core/model.js';

const ILLUSTRATIONS = 'assets/illustrations/';
const PROCESS_TITLE = 'Design Approach process';
const TICKER_TEXT = "Got a project in mind? Let's talk.";
const TICKER_REPEAT = 4; // per group: always wider than the widest screens

// Six line illustrations around the bio (Figma 4007:2450). Each has an orange twin (Figma
// 4007:2591-2601) shown on hover. Positions, sizes and tilts live in css/about.css (.deco--<name>).
const ART = ['poster', 'cube', 'palette', 'macbook', 'stars', 'ipad'];

// Figma "Group 1410104442": 50px circle with a down arrow.
const DOWN_CIRCLE =
  '<svg width="51.5" height="51.5" viewBox="0 0 51.5 51.5" fill="none" aria-hidden="true" focusable="false">' +
  '<circle cx="25.75" cy="25.75" r="25" stroke="currentColor" stroke-width="1.5"/>' +
  '<path d="M26.5 12.4785C26.5 12.0643 26.1642 11.7285 25.75 11.7285C25.3358 11.7285 25 12.0643 25 12.4785L25.75 12.4785L26.5 12.4785ZM25.75 12.4785L25 12.4785L25 39.1792L25.75 39.1792L26.5 39.1792L26.5 12.4785L25.75 12.4785ZM25.2197 39.7095C25.5126 40.0024 25.9874 40.0024 26.2803 39.7095L31.0533 34.9366C31.3462 34.6437 31.3462 34.1688 31.0533 33.8759C30.7604 33.583 30.2855 33.583 29.9926 33.8759L25.75 38.1185L21.5074 33.8759C21.2145 33.583 20.7396 33.583 20.4467 33.8759C20.1538 34.1688 20.1538 34.6437 20.4467 34.9366L25.2197 39.7095Z" fill="currentColor"/>' +
  '</svg>';

function picture(file, className) {
  const img = el('img', { className, src: `${ILLUSTRATIONS}${file}`, alt: '', loading: 'lazy' });
  img.addEventListener('error', () => img.remove());
  return img;
}

/** Illustration that turns orange and floats while the pointer is over it. */
function deco(name) {
  return el(
    'div',
    { className: `deco deco--${name}`, 'aria-hidden': 'true' },
    el(
      'div',
      { className: 'deco__art' },
      picture(`about-${name}.svg`, 'deco__ink'),
      picture(`about-${name}-orange.svg`, 'deco__accent')
    )
  );
}

function renderTitle() {
  return el(
    'h1',
    { className: 'title-initial about__title' },
    el('span', { className: 'title-initial__cap' }, 'A'),
    el('span', { className: 'title-initial__rest' }, 'bout')
  );
}

/** Paragraphs split on blank lines; **text** turns bold (Figma bolds the name and the fields). */
function renderBio(bio) {
  const paragraphs = String(bio || '')
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean);
  if (!paragraphs.length) return null;
  return el(
    'div',
    { className: 'about__bio' },
    paragraphs.map((text) =>
      el('p', null, parseEmphasis(text).map((run) => (run.bold ? el('strong', null, run.text) : run.text)))
    )
  );
}

/** Service card (Figma 4010:2688): line icon on the left, name + description on the right.
 *  Hover: a very light float, no colour change (Quỳnh Anh's note). */
function renderService(service) {
  return el(
    'li',
    { className: 'service' },
    service.icon ? imageBox(service.icon, '', { className: 'service__icon', fit: 'contain' }) : null,
    el(
      'div',
      { className: 'service__body' },
      el('h2', { className: 'service__name' }, service.name),
      service.description ? el('p', { className: 'service__text' }, service.description) : null
    )
  );
}

function renderProcess(steps) {
  const list = (Array.isArray(steps) ? steps : []).filter((s) => typeof s === 'string' && s.trim());
  if (!list.length) return null;
  return el(
    'section',
    { className: 'about__process page', 'aria-label': PROCESS_TITLE },
    el('h2', { className: 'process__title' }, PROCESS_TITLE),
    el(
      'ol',
      { className: 'process__steps' },
      list.map((step, i) =>
        el('li', { className: 'process__step' }, el('span', { className: 'process__num' }, String(i + 1)), step.trim())
      )
    )
  );
}

function renderTicker() {
  const group = () =>
    el(
      'div',
      { className: 'ticker__group' },
      Array.from({ length: TICKER_REPEAT }, () => el('span', { className: 'ticker__item' }, TICKER_TEXT))
    );
  return el(
    'div',
    { className: 'about__ticker ticker', role: 'img', 'aria-label': TICKER_TEXT },
    el('div', { className: 'ticker__track', 'aria-hidden': 'true' }, group(), group())
  );
}

function render(data, root) {
  const site = data.site || {};
  const about = data.about || {};
  document.title = `About — ${site.name || 'Portfolio'}`;

  const services = (Array.isArray(about.services) ? about.services : []).filter((s) => s && s.name);
  const half = Math.ceil(services.length / 2);

  root.replaceChildren(
    el(
      'div',
      { className: 'about' },
      el(
        'div',
        { className: 'about__stage' },
        renderTitle(),
        renderBio(about.bio),
        imageBox(about.photo, site.name ? `Photo of ${site.name}` : '', { className: 'about__photo' }),
        el('a', {
          className: 'about__down',
          href: '#about-more',
          'aria-label': 'Xem tiếp',
          html: DOWN_CIRCLE,
        }),
        el('div', { className: 'about__art' }, ART.map(deco))
      ),
      // second screen (Quỳnh Anh's note): process, service cards and the ticker fit one screen
      el(
        'div',
        { className: 'about__more', id: 'about-more' },
        renderProcess(about.process),
        services.length
          ? el(
              'section',
              { className: 'about__services', 'aria-label': 'Services' },
              el('ul', { className: 'about__col' }, services.slice(0, half).map(renderService)),
              picture('about-say-hi.svg', 'about__hi'),
              el('ul', { className: 'about__col' }, services.slice(half).map(renderService))
            )
          : null,
        renderTicker()
      )
    )
  );
}

/** The first screen shrinks to fit the window; CSS needs the bio's height for that (about.css). */
function measureBio() {
  const about = document.querySelector('.about');
  const bio = document.querySelector('.about__bio');
  if (!about || !bio) return;
  const update = () => about.style.setProperty('--bio-h', `${Math.ceil(bio.offsetHeight)}px`);
  update();
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(bio);
  document.fonts?.ready.then(update);
}

/** Quỳnh Anh's note (Nov 7): About runs on into Contact. Scrolling on past the end of the page
 *  (mouse wheel, swipe up, arrow / page-down keys) fades the page out and opens Contact. */
function continueToContact() {
  const PULL_PX = 360; // extra scrolling at the bottom that counts as "keep going" (above trackpad coasting)
  let pull = 0;
  let idle = 0;
  let leaving = false;
  const atBottom = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  const go = () => {
    if (leaving) return;
    leaving = true;
    document.body.classList.add('is-leaving');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => location.assign('contact.html'), reduced ? 0 : 450);
  };
  const push = (amount) => {
    if (!atBottom()) {
      pull = 0;
      return;
    }
    pull += amount;
    clearTimeout(idle);
    idle = setTimeout(() => (pull = 0), 800);
    if (pull > PULL_PX) go();
  };

  window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) push(event.deltaY);
    else pull = 0;
  }, { passive: true });

  let touchY = null;
  window.addEventListener('touchstart', (event) => (touchY = event.touches[0].clientY), { passive: true });
  window.addEventListener('touchmove', (event) => {
    if (touchY === null) return;
    const y = event.touches[0].clientY;
    if (y < touchY) push(touchY - y);
    touchY = y;
  }, { passive: true });

  // coming back with the browser's Back button restores this page from cache: undo the fade
  window.addEventListener('pageshow', () => {
    leaving = false;
    pull = 0;
    document.body.classList.remove('is-leaving');
  });

  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key) && atBottom()) push(PULL_PX + 1);
  });
}

bootPage('about', (data, root) => {
  render(data, root);
  measureBio();
  continueToContact();
});
