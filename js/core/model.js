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
  return `${project.year} . ${project.company}`;
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

  const categories = Array.isArray(src.categories) ? src.categories.slice() : [];
  const categoryIds = new Set(categories.map((c) => c.id));
  const seen = new Set();
  const projects = [];

  for (const project of Array.isArray(src.projects) ? src.projects : []) {
    if (!categoryIds.has(project.category)) {
      warnings.push(`Dự án "${project.id}" có mảng "${project.category}" không tồn tại; đã bỏ qua.`);
      continue;
    }
    if (seen.has(project.id)) {
      warnings.push(`Dự án "${project.id}" bị trùng id; chỉ giữ dự án đầu tiên.`);
      continue;
    }
    seen.add(project.id);
    projects.push(project);
  }

  return {
    data: { ...src, site: src.site || {}, categories, projects },
    warnings,
  };
}
