// Shared shell: DOM helper, header, banners, fatal panel, boot sequence.
import { loadData, DataError } from '../core/data.js';
import { validateData, resolveImage } from '../core/model.js';

const GENERIC_ERROR = 'Đã có lỗi khi hiển thị trang. Mở Console để xem chi tiết.';

/** Tiny DOM helper. attrs: className, dataset, html (trusted static markup only),
 *  on<Event> handlers, boolean/string attributes; null/undefined/false are skipped.
 *  Children: strings, Nodes, arrays (flattened), null/false skipped. */
export function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'className') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else node.setAttribute(key, value === true ? '' : String(value));
  }
  const append = (child) => {
    if (Array.isArray(child)) child.forEach(append);
    else if (child !== null && child !== undefined && child !== false) {
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
  };
  children.forEach(append);
  return node;
}

/** Grey placeholder box; shows the image when the path resolves and the file loads. */
export function imageBox(path, alt, { className = '', fit = 'cover', loading = 'lazy' } = {}) {
  const box = el('div', {
    className: ['img-box', fit === 'contain' ? 'img-box--contain' : '', className].filter(Boolean).join(' '),
  });
  const src = resolveImage(path);
  if (src) {
    const img = el('img', { src, alt: alt || '', loading });
    img.addEventListener('error', () => img.remove());
    box.append(img);
  }
  return box;
}

const DOWNLOAD_ICON =
  '<svg width="24" height="24" viewBox="0 0 25 25" fill="none" aria-hidden="true" focusable="false">' +
  '<circle cx="12.5" cy="12.5" r="12" stroke="currentColor"/>' +
  '<path d="M13 6.12875C13 5.85261 12.7761 5.62875 12.5 5.62875C12.2239 5.62875 12 5.85261 12 6.12875L12.5 6.12875L13 6.12875ZM12.5 6.12875L12 6.12875L12 18.9451L12.5 18.9451L13 18.9451L13 6.12875L12.5 6.12875ZM12.1464 19.2986C12.3417 19.4939 12.6583 19.4939 12.8536 19.2986L16.0355 16.1166C16.2308 15.9214 16.2308 15.6048 16.0355 15.4095C15.8403 15.2143 15.5237 15.2143 15.3284 15.4095L12.5 18.238L9.67157 15.4095C9.47631 15.2143 9.15973 15.2143 8.96447 15.4095C8.7692 15.6048 8.7692 15.9214 8.96447 16.1166L12.1464 19.2986Z" fill="currentColor"/>' +
  '</svg>';

const MENU_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
  '<path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>';

const MENU = [
  { page: 'works', label: 'Works', href: 'works.html' },
  { page: 'about', label: 'About', href: 'about.html' },
  { page: 'contact', label: 'Contact', href: 'contact.html' },
];

/** Header: menu (left), "QA" logo (center), Resume download (right). */
export function renderHeader(root, site, activePage) {
  if (!root) return;
  const s = site || {};
  root.classList.add('site-header');

  const nav = el(
    'nav',
    { className: 'site-header__nav', id: 'site-nav', 'aria-label': 'Menu chính' },
    MENU.map((item) =>
      el('a', { href: item.href, 'aria-current': item.page === activePage ? 'page' : null }, item.label)
    )
  );

  const toggle = el('button', {
    className: 'site-header__toggle',
    type: 'button',
    'aria-label': 'Menu',
    'aria-expanded': 'false',
    'aria-controls': 'site-nav',
    html: MENU_ICON,
  });
  toggle.addEventListener('click', () => {
    const open = !root.classList.contains('is-menu-open');
    root.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  const logo = el(
    'a',
    { className: 'logo', href: 'index.html', 'aria-label': 'QA — trang chủ' },
    el('span', { className: 'logo__q', 'aria-hidden': 'true' }, 'Q'),
    el('span', { className: 'logo__a', 'aria-hidden': 'true' }, 'A')
  );

  const resumeHref = resolveImage(s.resume);
  const resume = resumeHref
    ? el(
        'a',
        { className: 'resume', href: resumeHref, download: true },
        el('span', { className: 'resume__icon', html: DOWNLOAD_ICON }),
        el('span', { className: 'resume__label', dataset: { text: 'Resume' } }, 'Resume')
      )
    : null;

  root.replaceChildren(
    el(
      'div',
      { className: 'site-header__bar page' },
      el('div', { className: 'site-header__left' }, toggle, nav),
      logo,
      el('div', { className: 'site-header__right' }, resume)
    )
  );
}

/** Replace #app with a centered Vietnamese message panel. */
export function renderFatal(message) {
  const app = document.getElementById('app');
  if (!app) return;
  app.replaceChildren(
    el(
      'section',
      { className: 'fatal', role: 'alert' },
      el(
        'div',
        { className: 'fatal__panel' },
        el('h1', { className: 'fatal__title' }, 'Không hiển thị được trang'),
        el('p', { className: 'fatal__message' }, message)
      )
    )
  );
}

/** Dismissible banner listing data warnings; nothing when the list is empty. */
export function renderWarnings(warnings) {
  document.querySelector('.warn-banner')?.remove();
  const list = Array.isArray(warnings) ? warnings.filter(Boolean) : [];
  if (!list.length) return;
  const banner = el(
    'div',
    { className: 'warn-banner', role: 'status' },
    el(
      'div',
      { className: 'warn-banner__inner' },
      el(
        'div',
        { className: 'warn-banner__body' },
        el('strong', null, 'Dữ liệu trong data.json có vấn đề nhỏ:'),
        el('ul', null, list.map((w) => el('li', null, w)))
      ),
      el('button', {
        className: 'warn-banner__close',
        type: 'button',
        'aria-label': 'Đóng thông báo',
        onClick: () => banner.remove(),
        html: '&times;',
      })
    )
  );
  document.body.prepend(banner);
}

/** Load + validate data, render header/banners, then hand control to the page. */
export async function bootPage(page, render, { header = true } = {}) {
  try {
    document.body.dataset.page = page;
    const { data, warnings } = validateData(await loadData());
    if (header) renderHeader(document.getElementById('site-header'), data.site, page);
    renderWarnings(warnings);
    render(data, document.getElementById('app'));
  } catch (err) {
    if (err instanceof DataError) {
      renderFatal(err.userMessage);
    } else {
      console.error(err);
      renderFatal(GENERIC_ERROR);
    }
  }
}
