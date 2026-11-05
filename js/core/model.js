// Pure data model helpers (no DOM). Used by every page and unit-tested with node --test.

export function filterProjects(projects, categoryId) {
  if (!categoryId || categoryId === 'all') return projects.slice();
  const matches = projects.filter((p) => p.category === categoryId);
  return matches.length ? matches : projects.slice();
}

export function normalizeCategory(data, categoryId) {
  const found = (data.categories || []).some((c) => c.id === categoryId);
  return found ? categoryId : null;
}

export function findProject(data, id) {
  return (data.projects || []).find((p) => p.id === id);
}

export function getCategory(data, id) {
  return (data.categories || []).find((c) => c.id === id);
}

// Figma works grid alternates: square, wide, square, wide ...
export function cardShape(index) {
  return index % 2 === 0 ? 'square' : 'wide';
}

export function formatMeta(project) {
  const parts = [project.year, project.company]
    .map((part) => (part === undefined || part === null ? '' : String(part).trim()))
    .filter(Boolean);
  return parts.join(' . ');
}

export function resolveImage(path) {
  if (typeof path !== 'string') return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  return trimmed.replace(/^(?:\.?\/)+/, '') || null;
}

export function validateData(data) {
  const warnings = [];
  const src = data && typeof data === 'object' ? data : {};

  if (!src.site) warnings.push('Thiếu mục "site" trong data.json; dùng giá trị rỗng.');
  if (!Array.isArray(src.categories)) warnings.push('Thiếu mục "categories" trong data.json; dùng danh sách rỗng.');
  if (!Array.isArray(src.projects)) warnings.push('Thiếu mục "projects" trong data.json; dùng danh sách rỗng.');

  const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const skipInvalid = (list, name) =>
    list.filter((item, i) => {
      if (isObject(item)) return true;
      warnings.push(`Có một mục trong "${name}" không hợp lệ (vị trí ${i + 1}) nên đã bị bỏ qua.`);
      return false;
    });

  const categories = skipInvalid(Array.isArray(src.categories) ? src.categories : [], 'categories');
  const categoryIds = new Set(categories.map((c) => c.id).filter((id) => typeof id === 'string'));
  const seen = new Set();
  const projects = [];
  const rawProjects = Array.isArray(src.projects) ? src.projects : [];

  rawProjects.forEach((project, i) => {
    if (!isObject(project)) {
      warnings.push(`Có một mục trong "projects" không hợp lệ (vị trí ${i + 1}) nên đã bị bỏ qua.`);
      return;
    }
    if (typeof project.id !== 'string' || !project.id.trim()) {
      warnings.push(`Có một dự án thiếu "id" (vị trí ${i + 1}) nên đã bị bỏ qua.`);
      return;
    }
    if (!categoryIds.has(project.category)) {
      warnings.push(
        typeof project.category === 'string' && project.category.trim()
          ? `Dự án "${project.id}" có mảng "${project.category}" không tồn tại; đã bỏ qua.`
          : `Dự án "${project.id}" thiếu "category" (mảng); đã bỏ qua.`
      );
      return;
    }
    if (seen.has(project.id)) {
      warnings.push(`Dự án "${project.id}" bị trùng id; chỉ giữ dự án đầu tiên.`);
      return;
    }
    seen.add(project.id);
    projects.push(project);
  });

  return {
    data: { ...src, site: src.site || {}, categories, projects },
    warnings,
  };
}

/** Split text into plain and **bold** runs (the only markup data.json supports).
 *  An unmatched "**" stays as plain text. */
export function parseEmphasis(text) {
  const source = typeof text === 'string' ? text : '';
  const runs = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let last = 0;
  for (const match of source.matchAll(pattern)) {
    if (match.index > last) runs.push({ text: source.slice(last, match.index), bold: false });
    runs.push({ text: match[1], bold: true });
    last = match.index + match[0].length;
  }
  if (last < source.length) runs.push({ text: source.slice(last), bold: false });
  return runs;
}
