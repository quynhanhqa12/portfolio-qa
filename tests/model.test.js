import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  normalizeCategory,
  findProject,
  getCategory,
  cardShape,
  formatMeta,
  resolveImage,
  validateData,
} from '../js/core/model.js';

const makeData = () => ({
  site: { name: 'Test' },
  categories: [
    { id: 'brand-identity', name: 'Brand Identity' },
    { id: 'photography', name: 'Photography' },
  ],
  projects: [
    { id: 'a-brand-identity', project: 'A', category: 'brand-identity', year: 2024, company: 'X' },
    { id: 'b-photography', project: 'B', category: 'photography', year: 2023, company: 'Y' },
    { id: 'c-brand-identity', project: 'C', category: 'brand-identity', year: 2022, company: 'Z' },
  ],
});

test('filterProjects returns all for null, all and unknown ids, in order', () => {
  const { projects } = makeData();
  const ids = projects.map((p) => p.id);
  for (const key of [null, 'all', 'nope', '']) {
    assert.deepEqual(filterProjects(projects, key).map((p) => p.id), ids);
  }
});

test('filterProjects filters by an existing category', () => {
  const { projects } = makeData();
  const result = filterProjects(projects, 'photography');
  assert.deepEqual(result.map((p) => p.id), ['b-photography']);
});

test('normalizeCategory validates against data.categories', () => {
  const data = makeData();
  assert.equal(normalizeCategory(data, 'nope'), null);
  assert.equal(normalizeCategory(data, null), null);
  assert.equal(normalizeCategory(data, 'photography'), 'photography');
});

test('findProject and getCategory look up by id', () => {
  const data = makeData();
  assert.equal(findProject(data, 'b-photography').project, 'B');
  assert.equal(findProject(data, 'zzz'), undefined);
  assert.equal(getCategory(data, 'photography').name, 'Photography');
  assert.equal(getCategory(data, 'zzz'), undefined);
});

test('cardShape alternates square and wide', () => {
  assert.equal(cardShape(0), 'square');
  assert.equal(cardShape(1), 'wide');
  assert.equal(cardShape(2), 'square');
  assert.equal(cardShape(5), 'wide');
});

test('formatMeta joins year and company', () => {
  assert.equal(formatMeta({ year: 2025, company: 'Viettel Telecom' }), '2025 . Viettel Telecom');
});

test('resolveImage normalises paths', () => {
  assert.equal(resolveImage(''), null);
  assert.equal(resolveImage('  '), null);
  assert.equal(resolveImage(undefined), null);
  assert.equal(resolveImage(42), null);
  assert.equal(resolveImage('/images/a.jpg'), 'images/a.jpg');
  assert.equal(resolveImage('./images/a.jpg'), 'images/a.jpg');
  assert.equal(resolveImage('images/a.jpg'), 'images/a.jpg');
  assert.equal(resolveImage('  images/a.jpg '), 'images/a.jpg');
});

test('validateData drops unknown categories and duplicate ids with warnings', () => {
  const data = makeData();
  data.projects = [
    { id: 'ok', project: 'Ok', category: 'photography' },
    { id: 'bad', project: 'Bad', category: 'unknown' },
    { id: 'dup', project: 'First', category: 'photography' },
    { id: 'dup', project: 'Second', category: 'photography' },
  ];
  const { data: clean, warnings } = validateData(data);
  assert.equal(clean.projects.length, 2);
  assert.deepEqual(clean.projects.map((p) => p.id), ['ok', 'dup']);
  assert.equal(clean.projects[1].project, 'First');
  assert.equal(warnings.length, 2);
  assert.ok(warnings.some((w) => w.includes('bad')));
  assert.ok(warnings.some((w) => w.includes('dup')));
  assert.equal(data.projects.length, 4, 'input is not mutated');
});

test('validateData tolerates missing top-level sections', () => {
  const { data, warnings } = validateData({});
  assert.deepEqual(data.projects, []);
  assert.deepEqual(data.categories, []);
  assert.deepEqual(data.site, {});
  assert.ok(warnings.some((w) => w.includes('projects')));
  assert.ok(warnings.some((w) => w.includes('categories')));
  assert.ok(warnings.some((w) => w.includes('site')));
});
