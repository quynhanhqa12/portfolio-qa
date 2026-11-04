import { bootPage, el, imageBox } from '../ui/shell.js';

const ILLUSTRATIONS = 'assets/illustrations/';

// Decorative line illustrations around the bio/photo; positions live in css/about.css (.deco--<name>).
const ART = [
  { name: 'poster', file: '04-poster-bay.png' },
  { name: 'macbook', file: '03-macbook-mo-gap.png', patch: true },
  { name: 'cube', file: '03-khoi-cube.png' },
  { name: 'palette', file: '06-bang-mau-hoa-si.png' },
  { name: 'ipad', file: '02-ipad-va-apple-pencil.png' },
  { name: 'stars', file: '01-chom-sao-y-tuong.png' },
];

function deco(name, file, patch) {
  const img = el('img', { src: `${ILLUSTRATIONS}${file}`, alt: '', 'aria-hidden': 'true', loading: 'lazy' });
  img.addEventListener('error', () => img.remove());
  return el(
    'div',
    { className: `deco deco--${name}`, 'aria-hidden': 'true' },
    img,
    patch ? el('span', { className: 'deco__patch' }) : null
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

function renderBio(bio) {
  const paragraphs = String(bio || '')
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean);
  if (!paragraphs.length) return null;
  return el('div', { className: 'about__bio' }, paragraphs.map((text) => el('p', null, text)));
}

function renderService(service) {
  return el(
    'li',
    { className: 'service' },
    el('h2', { className: 'service__name' }, service.name),
    service.description ? el('p', { className: 'service__text' }, service.description) : null
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
      renderTitle(),
      el(
        'div',
        { className: 'about__stage' },
        renderBio(about.bio),
        el(
          'div',
          { className: 'about__photo' },
          imageBox(about.photo, site.name ? `Photo of ${site.name}` : '', { className: 'about__photo-box' }),
          deco('sparkle', '05-sparkle-cam.png'),
          deco('bubble', '03-chat-bubble-cam.png')
        ),
        el('div', { className: 'about__art' }, ART.map((a) => deco(a.name, a.file, a.patch)))
      ),
      services.length
        ? el(
            'section',
            { className: 'about__services', 'aria-label': 'Services' },
            el('ul', { className: 'about__col' }, services.slice(0, half).map(renderService)),
            deco('hi', '02-co-gai-chup-anh-say-hi.png'),
            el('ul', { className: 'about__col' }, services.slice(half).map(renderService))
          )
        : null
    )
  );
}

bootPage('about', render);
