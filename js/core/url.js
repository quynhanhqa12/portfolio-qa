// URL helpers. All URLs are relative so the site works under /<repo>/ on GitHub Pages.

export function getParam(search, name) {
  return new URLSearchParams(search).get(name);
}

export function worksUrl(categoryId) {
  return categoryId ? `works.html?category=${encodeURIComponent(categoryId)}` : 'works.html';
}

export function projectUrl(id) {
  return `project.html?id=${encodeURIComponent(id)}`;
}
