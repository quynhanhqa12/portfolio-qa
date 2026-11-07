import { el, renderSocial } from '../ui/shell.js';
import { formatHanoiTime, msUntilNextMinute } from '../core/clock.js';

const ILLUSTRATIONS = 'assets/illustrations/';

// Contact section (Figma 4007:2348), shown at the end of the About page: About and Contact are one
// scrolling page (Quỳnh Anh's note, Nov 7). It fills one screen under the sticky header; the
// header itself never changes, so the social links (top right of the Contact frame) sit in the
// section, level with the title.

// Line illustrations around the box (Figma 4007:2349, 4007:2384, 4007:2388). Each girl and the
// prop next to her (chat bubble, envelope) were one drawing in Figma; they are split so every
// piece turns orange and floats on its own (Quỳnh Anh's note, Nov 7). Each has an orange copy.
// Positions live in css/contact.css (.deco--<name>).
const ART = ['point-girl', 'bubble', 'think-girl', 'envelope', 'click'];

// The "scroll down" circle arrow (Figma "Group 1410104444", 50px).
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

function deco(name) {
  return el(
    'div',
    { className: `deco deco--${name}`, 'aria-hidden': 'true' },
    el(
      'div',
      { className: 'deco__art' },
      picture(`contact-${name}.svg`, 'deco__ink'),
      picture(`contact-${name}-orange.svg`, 'deco__accent')
    )
  );
}

function renderTitle() {
  return el(
    'h2',
    { className: 'title-initial contact__title' },
    el('span', { className: 'title-initial__cap' }, 'C'),
    el('span', { className: 'title-initial__rest' }, 'ontact')
  );
}

function renderStage(site) {
  const lead = el('p', { className: 'contact__lead' }, "Let's start your project today. Drop me a line.");
  const email = site.email ? el('span', { className: 'contact__email' }, site.email) : null;
  return el(
    'div',
    { className: 'contact__stage' },
    el('span', { className: 'contact__down', 'aria-hidden': 'true', html: DOWN_CIRCLE }),
    // the whole box is the mail link: hover turns its border and the address orange
    site.email
      ? el('a', { className: 'contact__box', href: `mailto:${site.email}` }, lead, email)
      : el('div', { className: 'contact__box' }, lead),
    el('div', { className: 'contact__art' }, ART.map(deco))
  );
}

function renderFooter(site) {
  const clock = el('p', { className: 'contact__clock' });
  const tick = () => {
    const time = formatHanoiTime(new Date());
    clock.textContent = site.location ? `${site.location} — ${time}` : time;
  };
  tick();
  // Re-arm after every tick so the clock realigns with the minute boundary
  // (timers can fire early/late; sleeping laptops and throttled tabs shift the phase).
  const schedule = () =>
    setTimeout(() => {
      tick();
      schedule();
    }, msUntilNextMinute(Date.now()));
  schedule();

  return el(
    'footer',
    { className: 'contact__footer page' },
    el('p', { className: 'contact__copy' }, `${new Date().getFullYear()} ${site.name || ''}. All rights reserved`),
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

/** The whole contact section; id="contact" so the menu's Contact link lands here. */
export function renderContactSection(site) {
  const social = renderSocial(site.social, 'contact__social');
  return el(
    'section',
    { className: 'contact', id: 'contact', 'aria-label': 'Contact' },
    social ? el('div', { className: 'contact__links page' }, social) : null,
    el('div', { className: 'contact__main' }, renderTitle(), renderStage(site)),
    renderFooter(site)
  );
}
