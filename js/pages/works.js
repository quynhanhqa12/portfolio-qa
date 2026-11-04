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

function render(data, root) {
  const site = data.site || {};
  const categories = data.categories || [];
  const projects = data.projects || [];
  document.title = `Works — ${site.name || 'Portfolio'}`;

  let current = normalizeCategory(data, getParam(location.search, 'category')); // null = All

  const grid = el('div', { className: 'works__grid' });
  const filterBar = el('div', { className: 'filter', role: 'group', 'aria-label': 'Lọc dự án theo mảng' });

  const buttons = [
    { id: null, name: 'All' },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ].map((item) => {
    const button = el('button', { className: 'filter__btn', type: 'button', 'aria-pressed': 'false' }, item.name);
    button.addEventListener('click', () => select(item.id, true));
    return { id: item.id, button };
  });
  filterBar.append(...buttons.map((b) => b.button));

  function renderGrid() {
    // filterProjects falls back to everything for a category without projects; show the empty text instead.
    const empty = current && !projects.some((p) => p.category === current);
    const list = empty ? [] : filterProjects(projects, current);
    if (!list.length) {
      grid.replaceChildren(el('p', { className: 'works__empty', role: 'status' }, EMPTY_TEXT));
      return;
    }
    grid.replaceChildren(...list.map((p, i) => renderCard(data, p, i)));
  }

  function select(id, pushUrl) {
    current = id;
    buttons.forEach((b) => b.button.setAttribute('aria-pressed', String(b.id === current)));
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
        filterBar,
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
