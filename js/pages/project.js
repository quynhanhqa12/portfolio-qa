import { bootPage, el, imageBox } from '../ui/shell.js';
import { findProject, getCategory, formatMeta } from '../core/model.js';
import { getParam, worksUrl } from '../core/url.js';

const NOT_FOUND_TEXT = 'Không tìm thấy dự án.';
const BACK_TEXT = '← Quay lại Works';

function asList(value) {
  return Array.isArray(value) ? value.filter((v) => v !== null && v !== undefined) : [];
}

function renderNotFound(root, site) {
  document.title = `${NOT_FOUND_TEXT} | ${site.name || 'Portfolio'}`;
  root.replaceChildren(
    el(
      'section',
      { className: 'project-missing page', role: 'alert' },
      el('p', { className: 'project-missing__text' }, NOT_FOUND_TEXT),
      el('a', { className: 'project-missing__link', href: 'works.html' }, BACK_TEXT)
    )
  );
}

function renderTitle(categoryId) {
  return el(
    'a',
    { className: 'project__works-link', href: worksUrl(categoryId), 'aria-label': 'Works' },
    el(
      'div',
      { className: 'title-initial', 'aria-hidden': 'true' },
      el('span', { className: 'title-initial__cap' }, 'W'),
      el('span', { className: 'title-initial__rest' }, 'orks')
    )
  );
}

function renderSection(section, projectName, index) {
  const s = section || {};
  const images = asList(s.images);
  return el(
    'section',
    { className: 'project__section' },
    s.text ? el('p', { className: 'project__text' }, s.text) : null,
    images.length
      ? el(
          'div',
          { className: 'project__pair' },
          images.map((path, i) =>
            imageBox(path, `${projectName} — ${index + 1}.${i + 1}`, { className: 'project__image', fit: s.fit })
          )
        )
      : null
  );
}

function render(data, root) {
  const site = data.site || {};
  const project = findProject(data, getParam(location.search, 'id'));
  if (!project) {
    renderNotFound(root, site);
    return;
  }

  const category = getCategory(data, project.category);
  document.title = `${project.project} – ${category?.name || 'Works'} | ${site.name || 'Portfolio'}`;

  const tags = asList(project.tags);
  const intro = asList(project.intro);
  const introImages = asList(project.introImages);
  const sections = asList(project.sections);

  root.replaceChildren(
    el(
      'article',
      { className: 'project page' },
      el(
        'div',
        { className: 'project__head' },
        renderTitle(project.category),
        tags.length
          ? el('ul', { className: 'project__tags' }, tags.map((t) => el('li', null, `. ${t}`)))
          : null
      ),
      el(
        'div',
        { className: 'project__top' },
        el(
          'div',
          { className: 'project__info' },
          el('h1', { className: 'project__name' }, project.project),
          el('p', { className: 'project__meta' }, formatMeta(project)),
          intro.length
            ? el('div', { className: 'project__intro' }, intro.map((p) => el('p', null, p)))
            : null
        ),
        introImages.length
          ? el(
              'div',
              { className: 'project__grid' },
              introImages.map((path, i) =>
                imageBox(path, `${project.project} — ${i + 1}`, { className: 'project__image' })
              )
            )
          : null
      ),
      sections.map((s, i) => renderSection(s, project.project, i))
    )
  );
}

bootPage('project', render);
