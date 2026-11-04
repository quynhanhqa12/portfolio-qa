import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getParam, worksUrl, projectUrl } from '../js/core/url.js';

test('getParam reads and decodes query values', () => {
  assert.equal(getParam('?id=a%20b', 'id'), 'a b');
  assert.equal(getParam('?id=a', 'category'), null);
  assert.equal(getParam('', 'id'), null);
});

test('worksUrl', () => {
  assert.equal(worksUrl(null), 'works.html');
  assert.equal(worksUrl('brand-identity'), 'works.html?category=brand-identity');
});

test('projectUrl', () => {
  assert.equal(projectUrl('tendoo-brand-identity'), 'project.html?id=tendoo-brand-identity');
});
