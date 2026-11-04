import { bootPage, el } from '../ui/shell.js';
import { formatHanoiTime } from '../core/clock.js';

const ILLUSTRATIONS = 'assets/illustrations/';

// Decorative line illustrations around the box; positions live in css/contact.css (.deco--<name>).
const ART = [
  { name: 'girl', file: '04-co-gai-thinking.png' },
  { name: 'bubble', file: '03-chat-bubble.png' },
  { name: 'email', file: '01-email-bay.png' },
  { name: 'click', file: '06-click.png' },
];

// Diagonal arrow (Figma "Arrow 3", 10x10) and the "scroll down" circle arrow (Figma "Group 1410104442").
const DIAGONAL_ARROW =
  '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" focusable="false">' +
  '<path d="M0.146447 9.14645C-0.0488155 9.34171 -0.0488155 9.65829 0.146447 9.85355C0.341709 10.0488 0.658291 10.0488 0.853553 9.85355L0.5 9.5L0.146447 9.14645ZM0.5 9.5L0.853553 9.85355L9.85355 0.853554L9.5 0.5L9.14645 0.146447L0.146447 9.14645L0.5 9.5ZM10 0.5C10 0.223858 9.77614 1.13817e-07 9.5 -1.2624e-08L5 3.87771e-07C4.72386 2.19184e-07 4.5 0.223858 4.5 0.5C4.5 0.776143 4.72386 1 5 1L9 1L9 5C9 5.27614 9.22386 5.5 9.5 5.5C9.77614 5.5 10 5.27614 10 5L10 0.5Z" fill="currentColor"/>' +
  '</svg>';

const DOWN_CIRCLE =
  '<svg width="51.25" height="51.25" viewBox="0 0 51.25 51.25" fill="none" aria-hidden="true" focusable="false">' +
  '<circle cx="25.625" cy="25.625" r="25" stroke="currentColor" stroke-width="1.25"/>' +
  '<path d="M26.25 12.3535C26.25 12.0083 25.9702 11.7285 25.625 11.7285C25.2798 11.7285 25 12.0083 25 12.3535L25.625 12.3535L26.25 12.3535ZM25.625 12.3535L25 12.3535L25 39.0542L25.625 39.0542L26.25 39.0542L26.25 12.3535L25.625 12.3535ZM25.1831 39.4961C25.4271 39.7402 25.8229 39.7402 26.0669 39.4961L30.0444 35.5187C30.2885 35.2746 30.2885 34.8789 30.0444 34.6348C29.8003 34.3907 29.4046 34.3907 29.1605 34.6348L25.625 38.1703L22.0895 34.6348C21.8454 34.3907 21.4497 34.3907 21.2056 34.6348C20.9615 34.8789 20.9615 35.2746 21.2056 35.5187L25.1831 39.4961Z" fill="currentColor"/>' +
  '</svg>';

function deco(name, file) {
  const img = el('img', { src: `${ILLUSTRATIONS}${file}`, alt: '', 'aria-hidden': 'true', loading: 'lazy' });
  img.addEventListener('error', () => img.remove());
  return el('div', { className: `deco deco--${name}`, 'aria-hidden': 'true' }, img);
}

function renderSocial(social) {
  const items = (Array.isArray(social) ? social : []).filter((s) => s && s.name);
  if (!items.length) return el('div');
  return el(
    'ul',
    { className: 'contact__social', 'aria-label': 'Social' },
    items.map((s) => {
      const arrow = el('span', { className: 'social__arrow', 'aria-hidden': 'true', html: DIAGONAL_ARROW });
      const label = el('span', { className: 'social__name' }, s.name);
      const url = typeof s.url === 'string' ? s.url.trim() : '';
      return el(
        'li',
        null,
        url
          ? el('a', { className: 'social', href: url, target: '_blank', rel: 'noopener' }, label, arrow)
          : el('span', { className: 'social', 'data-nolink': '' }, label, arrow)
      );
    })
  );
}

function renderTopBar(site) {
  return el(
    'div',
    { className: 'site-header__bar page contact__top' },
    renderSocial(site.social),
    el(
      'a',
      { className: 'logo', href: 'index.html', 'aria-label': 'QA — trang chủ' },
      el('span', { className: 'logo__q', 'aria-hidden': 'true' }, 'Q'),
      el('span', { className: 'logo__a', 'aria-hidden': 'true' }, 'A')
    ),
    el('div')
  );
}

function renderTitle() {
  return el(
    'h1',
    { className: 'title-initial contact__title' },
    el('span', { className: 'title-initial__cap' }, 'C'),
    el('span', { className: 'title-initial__rest' }, 'ontact')
  );
}

function renderStage(site) {
  return el(
    'div',
    { className: 'contact__stage' },
    el('span', { className: 'contact__down', 'aria-hidden': 'true', html: DOWN_CIRCLE }),
    el(
      'div',
      { className: 'contact__box' },
      el('p', { className: 'contact__lead' }, "Let's start your project today. Drop me a line."),
      site.email ? el('a', { className: 'contact__email', href: `mailto:${site.email}` }, site.email) : null
    ),
    el('div', { className: 'contact__art' }, ART.map((a) => deco(a.name, a.file)))
  );
}

function renderFooter(site) {
  const clock = el('p', { className: 'contact__clock' });
  const tick = () => {
    const time = formatHanoiTime(new Date());
    clock.textContent = site.location ? `${site.location} — ${time}` : time;
  };
  tick();
  // Refresh on the next minute boundary, then every 60 s.
  setTimeout(() => {
    tick();
    setInterval(tick, 60000);
  }, 60000 - (Date.now() % 60000));

  return el(
    'footer',
    { className: 'contact__footer page' },
    el('p', { className: 'contact__copy' }, `© ${new Date().getFullYear()} ${site.name || ''}. All rights reserved`),
    clock,
    site.availableForWork === true
      ? el(
          'p',
          { className: 'contact__available' },
          el('span', { 'aria-hidden': 'true' }, '●'),
          ' Available for work'
        )
      : el('div')
  );
}

function render(data, root) {
  const site = data.site || {};
  document.title = `Contact — ${site.name || 'Portfolio'}`;
  root.replaceChildren(
    el('div', { className: 'contact' }, renderTopBar(site), el('div', { className: 'contact__main' }, renderTitle(), renderStage(site)), renderFooter(site))
  );
}

bootPage('contact', render, { header: false });
