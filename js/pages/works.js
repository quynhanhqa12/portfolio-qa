import { bootPage, el, imageBox, swapText } from '../ui/shell.js';
import { filterProjects, normalizeCategory, cardShape, formatMeta, mixCategories } from '../core/model.js';
import { getParam, worksUrl, projectUrl } from '../core/url.js';

const EMPTY_TEXT = 'Chưa có dự án nào trong mảng này.';

function renderTitle() {
  return el(
    'h1',
    { className: 'title-initial works__title' },
    el('span', { className: 'title-initial__cap' }, 'W'),
    el('span', { className: 'title-initial__rest' }, 'orks')
  );
}

// Quỳnh Anh's note: no category name above the thumbnails
function renderCard(project, index) {
  return el(
    'a',
    { className: 'card swap-host', href: projectUrl(project.id) },
    imageBox(project.cover, project.project || '', {
      className: `card__image card__image--${cardShape(index)}`,
    }),
    // hover: the name turns italic (and orange), year / company bold, both cross-faded
    el('h3', { className: 'card__name' }, swapText(project.project || '', 'italic', 'swap--line')),
    el('p', { className: 'card__meta' }, swapText(formatMeta(project), 'bold', 'swap--line'))
  );
}

/** The page has no vertical scroll, so a plain mouse wheel over the row moves it sideways. */
function scrollSidewaysOnWheel(row) {
  row.addEventListener(
    'wheel',
    (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return; // pinch, trackpad swipe
      if (row.scrollWidth <= row.clientWidth) return;
      event.preventDefault();
      row.scrollLeft += event.deltaY;
    },
    { passive: false }
  );
}

// Figma 4007:2439: three centred lines, 32 x 16 (+1px stroke overhang).
const FILTER_ICON =
  '<svg width="32" height="18" viewBox="0 0 32 18" fill="none" aria-hidden="true" focusable="false">' +
  '<path d="M1 1H31M6.33333 9H25.6667M11.6667 17H20.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

// Figma 4007:2446: the 36px circle with the down arrow, turned to point sideways in CSS.
const ROW_ARROW =
  '<svg width="37.5" height="37.5" viewBox="0 0 37.5 37.5" fill="none" aria-hidden="true" focusable="false">' +
  '<circle cx="18.75" cy="18.75" r="18" stroke="currentColor" stroke-width="1.5"/>' +
  '<path d="M19.5 9.19531C19.5 8.7811 19.1642 8.44531 18.75 8.44531C18.3358 8.44531 18 8.7811 18 9.19531L18.75 9.19531L19.5 9.19531ZM18.75 9.19531L18 9.19531L18 28.4198L18.75 28.4198L19.5 28.4198L19.5 9.19531L18.75 9.19531ZM18.2197 28.9501C18.5126 29.243 18.9874 29.243 19.2803 28.9501L24.0533 24.1772C24.3462 23.8843 24.3462 23.4094 24.0533 23.1165C23.7604 22.8236 23.2855 22.8236 22.9926 23.1165L18.75 27.3591L14.5074 23.1165C14.2145 22.8236 13.7396 22.8236 13.4467 23.1165C13.1538 23.4094 13.1538 23.8843 13.4467 24.1772L18.2197 28.9501Z" fill="currentColor"/>' +
  '</svg>';

/** Category filter as one dropdown button. options: [{id, name}], id null = All. */
function renderFilter(options, onSelect) {
  const label = el('span', { className: 'filter__value' });
  const button = el(
    'button',
    {
      className: 'filter__toggle',
      type: 'button',
      'aria-haspopup': 'listbox',
      'aria-expanded': 'false',
      'aria-controls': 'filter-list',
      'aria-label': 'Lọc dự án theo mảng',
    },
    el('span', { className: 'filter__icon', html: FILTER_ICON }),
    label
  );
  const items = options.map((opt) =>
    el('li', { role: 'option', className: 'filter__option', tabindex: '-1', dataset: { id: opt.id ?? '' } }, opt.name)
  );
  // closed = faded out and unreachable (visibility: hidden), so it can ease in and out (works.css)
  const list = el('ul', { className: 'filter__list', id: 'filter-list', role: 'listbox', 'aria-label': 'Lọc dự án theo mảng' }, items);
  const root = el('div', { className: 'filter' }, button, list);

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const close = (focusButton = false) => {
    button.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-open');
    if (focusButton) button.focus();
  };
  const open = (moveFocus = true) => {
    button.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    if (moveFocus) (items.find((li) => li.getAttribute('aria-selected') === 'true') || items[0])?.focus();
  };
  const choose = (li) => {
    onSelect(li.dataset.id || null);
    close(true);
  };

  button.addEventListener('click', () => (isOpen() ? close() : open()));
  // Quỳnh Anh's note: pointing at the filter icon opens the list; it closes shortly after the
  // pointer leaves (the delay lets it travel from the button down to the list)
  let leaveTimer = 0;
  root.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    clearTimeout(leaveTimer);
    if (!isOpen()) open(false);
  });
  root.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'touch') return;
    leaveTimer = setTimeout(() => isOpen() && close(), 250);
  });
  items.forEach((li) => li.addEventListener('click', () => choose(li)));
  list.addEventListener('keydown', (event) => {
    const i = items.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') items[Math.min(i + 1, items.length - 1)].focus();
    else if (event.key === 'ArrowUp') items[Math.max(i - 1, 0)].focus();
    else if (event.key === 'Enter' || event.key === ' ') choose(items[Math.max(i, 0)]);
    else if (event.key === 'Escape' || event.key === 'Tab') close(event.key === 'Escape');
    else return;
    event.preventDefault();
  });
  document.addEventListener('click', (event) => {
    if (isOpen() && !root.contains(event.target)) close();
  });

  return {
    node: root,
    setCurrent(id) {
      const chosen = options.find((o) => (o.id ?? null) === id) || options[0];
      label.textContent = chosen.name;
      items.forEach((li) => li.setAttribute('aria-selected', String((li.dataset.id || null) === (chosen.id ?? null))));
    },
  };
}

/** Prev / next on either side of the row, level with the middle of the pictures (Quỳnh Anh
 *  chose this layout, Nov 7: "phương án B"). Both always show; the one that can't go further
 *  fades. Each click pages the row by most of a view. */
function renderArrows(row, wrap) {
  const button = (dir, label) =>
    el('button', { className: `row-nav__btn row-nav__btn--${dir}`, type: 'button', 'aria-label': label, html: ROW_ARROW });
  const prev = button('prev', 'Dự án trước');
  const next = button('next', 'Dự án tiếp theo');
  const page = (sign) => row.scrollBy({ left: sign * row.clientWidth * 0.9, behavior: 'smooth' });
  prev.addEventListener('click', () => page(-1));
  next.addEventListener('click', () => page(1));
  const nav = el('div', { className: 'row-nav' }, prev, next);

  // level with the middle of the first (square) picture; measured, because the card size depends
  // on the room the row gets. Rects are in screen pixels, styles in page pixels: divide by the
  // page zoom (js/fit.js), read off the wrapper's own size so any zoom implementation works.
  const place = () => {
    const image = row.querySelector('.card__image');
    if (!image || !wrap.offsetHeight) return;
    const box = wrap.getBoundingClientRect();
    const scale = box.height / wrap.offsetHeight || 1;
    const img = image.getBoundingClientRect();
    nav.style.setProperty('--nav-top', `${(img.top + img.height / 2 - box.top) / scale}px`);
  };

  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    const atEnd = row.scrollLeft >= max - 1;
    prev.disabled = row.scrollLeft <= 1;
    next.disabled = atEnd;
    nav.hidden = max <= 1; // everything fits: no arrows
    wrap.classList.toggle('is-end', atEnd); // the right-edge fade lifts off the last card
    place();
  };
  row.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(wrap);
  return { node: nav, update };
}

function render(data, root) {
  const site = data.site || {};
  const categories = data.categories || [];
  const projects = data.projects || [];
  document.title = `Works — ${site.name || 'Portfolio'}`;

  let current = normalizeCategory(data, getParam(location.search, 'category')); // null = All
  // "All" shows every project in a fresh random order on each visit, never two of one category
  // side by side (Quỳnh Anh's note); a single category keeps the order of data.json
  const mixed = mixCategories(projects);

  const grid = el('div', { className: 'works__row', tabindex: '0', 'aria-label': 'Danh sách dự án, cuộn ngang' });
  scrollSidewaysOnWheel(grid);
  const filter = renderFilter(
    [{ id: null, name: 'All' }, ...categories.map((c) => ({ id: c.id, name: c.name }))],
    (id) => select(id, true)
  );
  const rowWrap = el('div', { className: 'works__rowwrap' }, grid);
  const arrows = renderArrows(grid, rowWrap);
  rowWrap.append(arrows.node);

  function renderGrid() {
    // filterProjects falls back to everything for a category without projects; show the empty text instead.
    const empty = current && !projects.some((p) => p.category === current);
    const list = empty ? [] : current ? filterProjects(projects, current) : mixed;
    if (!list.length) {
      grid.replaceChildren(el('p', { className: 'works__empty', role: 'status' }, EMPTY_TEXT));
    } else {
      grid.replaceChildren(...list.map((p, i) => renderCard(p, i)));
    }
    grid.scrollLeft = 0;
    arrows.update();
  }

  function select(id, pushUrl) {
    current = id;
    filter.setCurrent(current);
    if (pushUrl) history.replaceState(null, '', worksUrl(current));
    renderGrid();
  }

  const intro = data.works?.intro;
  root.replaceChildren(
    el(
      'div',
      { className: 'works' },
      el('div', { className: 'works__head page' }, renderTitle(), intro ? el('p', { className: 'works__intro' }, intro) : null),
      el('div', { className: 'works__toolbar' }, filter.node),
      rowWrap,
      // Quỳnh Anh's note (Nov 7): the email button opens a new mail straight away
      site.email
        ? el('div', { className: 'works__contact page' }, el('a', { className: 'email-box', href: `mailto:${site.email}` }, site.email))
        : null
    )
  );
  select(current, false);
}

bootPage('works', render);
