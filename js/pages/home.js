import { bootPage, el, imageBox } from '../ui/shell.js';
import { playIntro, skipIntro } from './home-intro.js';

const ARROW_ICON =
  '<svg viewBox="0 0 51.25 51.25" fill="none" aria-hidden="true" focusable="false">' +
  '<circle cx="25.625" cy="25.625" r="25" stroke="currentColor" stroke-width="1.25"/>' +
  '<path d="M26.25 12.3535C26.25 12.0083 25.9702 11.7285 25.625 11.7285C25.2798 11.7285 25 12.0083 25 12.3535L25.625 12.3535L26.25 12.3535ZM25.625 12.3535L25 12.3535L25 39.0542L25.625 39.0542L26.25 39.0542L26.25 12.3535L25.625 12.3535ZM25.1831 39.4961C25.4271 39.7402 25.8229 39.7402 26.0669 39.4961L30.0444 35.5187C30.2885 35.2746 30.2885 34.8789 30.0444 34.6348C29.8003 34.3907 29.4046 34.3907 29.1605 34.6348L25.625 38.1703L22.0895 34.6348C21.8454 34.3907 21.4497 34.3907 21.2056 34.6348C20.9615 34.8789 20.9615 35.2746 21.2056 35.5187L25.1831 39.4961Z" fill="currentColor"/>' +
  '</svg>';

function initialPair(word, extraClass = '') {
  return el(
    'span',
    { className: `title-initial title-initial--hero ${extraClass}`.trim() },
    el('span', { className: 'title-initial__cap' }, word.slice(0, 1)),
    el('span', { className: 'title-initial__rest' }, word.slice(1))
  );
}

function renderHero(site) {
  const name = (site.heroName || site.name || '').trim();
  const words = name.split(/\s+/).filter(Boolean);
  const last = words.pop() || '';
  const first = words.join(' ');

  const nameRow = el(
    'span',
    { className: 'hero__name', 'aria-hidden': 'true' },
    first ? el('span', { className: 'hero__first' }, first) : null,
    last ? initialPair(last, 'title-initial--accent') : null
  );

  return el(
    'div',
    { className: 'home__hero' },
    el(
      'div',
      { className: 'hero' },
      el(
        'h1',
        { className: 'hero__title', 'aria-label': `Welcome to Art space of ${name}`.trim() },
        el('span', { className: 'hero__welcome', 'aria-hidden': 'true' }, 'Welcome to'),
        el('span', { className: 'hero__art', 'aria-hidden': 'true' }, initialPair('Art space')),
        el('span', { className: 'hero__of', 'aria-hidden': 'true' }, 'of'),
        nameRow
      ),
      el('a', {
        className: 'hero__go',
        href: 'works.html',
        'aria-label': 'View works',
        html: ARROW_ICON,
      })
    )
  );
}

// Figma 4007:2649: girl, cube and eye, each turning orange and floating on its own when hovered
// (Quỳnh Anh's note). Positions live in css/home.css (.art__girl / .art__cube / .art__eye).
function renderArt() {
  const piece = (name) => {
    const img = (suffix, cls) => {
      const node = el('img', { className: cls, src: `assets/illustrations/home-${name}${suffix}.svg`, alt: '' });
      node.addEventListener('error', () => node.remove());
      return node;
    };
    return el(
      'div',
      { className: `art__item art__${name} deco` },
      el('div', { className: 'deco__art' }, img('', 'deco__ink'), img('-orange', 'deco__accent'))
    );
  };
  return el('div', { className: 'home__art art', 'aria-hidden': 'true' }, piece('cube'), piece('girl'), piece('eye'));
}

function renderTitles(site) {
  const titles = Array.isArray(site.titles) ? site.titles.filter(Boolean) : [];
  if (!titles.length) return null;
  return el(
    'p',
    { className: 'home__titles' },
    el('span', { className: 'home__title' }, titles[0]),
    titles[1] ? el('span', { className: 'home__amp', 'aria-hidden': 'true' }, '&') : null,
    titles[1] ? el('span', { className: 'home__title' }, titles[1]) : null
  );
}

function render(data, root) {
  const site = data.site || {};
  document.title = `${site.name || 'Portfolio'} — Portfolio`;
  root.replaceChildren(
    el(
      'div',
      { className: 'home' },
      el(
        'div',
        { className: 'home__stage' },
        el(
          'div',
          { className: 'home__comp' },
          imageBox(data.home?.photo, site.name ? `Portrait of ${site.name}` : '', { className: 'home__portrait', loading: 'eager' }),
          renderHero(site),
          renderArt()
        ),
        renderTitles(site)
      )
    )
  );
  playIntro();
}

// the intro overlay must never outlive a failed boot (fatal panel instead of a page)
bootPage('home', render).finally(skipIntro);
