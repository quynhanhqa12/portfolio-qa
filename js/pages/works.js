import { bootPage, el, imageBox } from '../ui/shell.js';
import { filterProjects, normalizeCategory, getCategory, cardShape, formatMeta } from '../core/model.js';
import { getParam, worksUrl, projectUrl } from '../core/url.js';

const EMPTY_TEXT = 'Chưa có dự án nào trong mảng này.';
const TICKER_TEXT = "Got a project in mind? Let's talk.";
const TICKER_REPEAT = 4; // per group: 4 x ~755px + gaps always exceeds the widest screens

function renderTitle() {
  return el(
    'h1',
    { className: 'title-initial works__title' },
    el('span', { className: 'title-initial__cap' }, 'W'),
    el('span', { className: 'title-initial__rest' }, 'orks')
  );
}

function renderCard(data, project, index) {
  const category = getCategory(data, project.category);
  return el(
    'a',
    { className: 'card', href: projectUrl(project.id) },
    el('p', { className: 'card__label' }, `. ${category?.name || ''}`.trimEnd()),
    imageBox(project.cover, project.project || '', {
      className: `card__image card__image--${cardShape(index)}`,
    }),
    el('h3', { className: 'card__name' }, project.project),
    el('p', { className: 'card__meta' }, formatMeta(project))
  );
}

function renderTicker() {
  const group = (hidden) =>
    el(
      'div',
      { className: 'ticker__group', 'aria-hidden': hidden ? 'true' : null },
      Array.from({ length: TICKER_REPEAT }, () => el('span', { className: 'ticker__item' }, TICKER_TEXT))
    );
  return el(
    'div',
    { className: 'works__ticker ticker', role: 'img', 'aria-label': TICKER_TEXT },
    el('div', { className: 'ticker__track', 'aria-hidden': 'true' }, group(true), group(true))
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

const CHEVRON =
  '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">' +
  '<path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const ARROW = (dir) =>
  '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">' +
  `<path d="${dir === 'prev' ? 'M12 4 6 10l6 6' : 'M8 4l6 6-6 6'}" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

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
    },
    el('span', { className: 'filter__caption' }, 'Filter:'),
    label,
    el('span', { className: 'filter__chevron', html: CHEVRON })
  );
  const items = options.map((opt) =>
    el('li', { role: 'option', className: 'filter__option', tabindex: '-1', dataset: { id: opt.id ?? '' } }, opt.name)
  );
  const list = el('ul', { className: 'filter__list', id: 'filter-list', role: 'listbox', 'aria-label': 'Lọc dự án theo mảng', hidden: true }, items);
  const root = el('div', { className: 'filter' }, button, list);

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const close = (focusButton = false) => {
    button.setAttribute('aria-expanded', 'false');
    list.hidden = true;
    if (focusButton) button.focus();
  };
  const open = () => {
    button.setAttribute('aria-expanded', 'true');
    list.hidden = false;
    (items.find((li) => li.getAttribute('aria-selected') === 'true') || items[0])?.focus();
  };
  const choose = (li) => {
    onSelect(li.dataset.id || null);
    close(true);
  };

  button.addEventListener('click', () => (isOpen() ? close() : open()));
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

/** Prev / next buttons that page the card row by one view; disabled at either end. */
function renderArrows(row) {
  const button = (dir, label) =>
    el('button', { className: `row-nav__btn row-nav__btn--${dir}`, type: 'button', 'aria-label': label, html: ARROW(dir) });
  const prev = button('prev', 'Dự án trước');
  const next = button('next', 'Dự án tiếp theo');
  const page = (sign) => row.scrollBy({ left: sign * row.clientWidth, behavior: 'smooth' });
  prev.addEventListener('click', () => page(-1));
  next.addEventListener('click', () => page(1));

  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    prev.disabled = row.scrollLeft <= 1;
    next.disabled = row.scrollLeft >= max - 1;
    nav.hidden = max <= 1; // everything fits: no arrows
  };
  const nav = el('div', { className: 'row-nav' }, prev, next);
  row.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  return { node: nav, update };
}

function render(data, root) {
  const site = data.site || {};
  const categories = data.categories || [];
  const projects = data.projects || [];
  document.title = `Works — ${site.name || 'Portfolio'}`;

  let current = normalizeCategory(data, getParam(location.search, 'category')); // null = All

  const grid = el('div', { className: 'works__row', tabindex: '0', 'aria-label': 'Danh sách dự án, cuộn ngang' });
  scrollSidewaysOnWheel(grid);
  const filter = renderFilter(
    [{ id: null, name: 'All' }, ...categories.map((c) => ({ id: c.id, name: c.name }))],
    (id) => select(id, true)
  );
  const arrows = renderArrows(grid);

  function renderGrid() {
    // filterProjects falls back to everything for a category without projects; show the empty text instead.
    const empty = current && !projects.some((p) => p.category === current);
    const list = empty ? [] : filterProjects(projects, current);
    if (!list.length) {
      grid.replaceChildren(el('p', { className: 'works__empty', role: 'status' }, EMPTY_TEXT));
    } else {
      grid.replaceChildren(...list.map((p, i) => renderCard(data, p, i)));
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
      el(
        'div',
        { className: 'works__inner page' },
        el('div', { className: 'works__head' }, renderTitle(), intro ? el('p', { className: 'works__intro' }, intro) : null),
        el('div', { className: 'works__toolbar' }, filter.node, arrows.node),
        grid
      ),
      renderTicker(),
      site.email
        ? el(
            'div',
            { className: 'works__contact page' },
            el('a', { className: 'email-box', href: `mailto:${site.email}` }, site.email)
          )
        : null
    )
  );
  select(current, false);
}

bootPage('works', render);
