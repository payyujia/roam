/**
 * ROAM static-site entry point guard.
 * Run: node scripts/check-site.cjs
 * Protects GitHub Pages from mistakenly publishing CSS or JS as index.html.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');

assert.match(html, /^\s*<!doctype html>/i, 'index.html must start with an HTML doctype (not CSS or JS)');
assert.match(html, /<html\b[^>]*>/i, 'index.html must contain an html element');
assert.match(html, /<head\b[^>]*>/i, 'index.html must contain a head');
assert.match(html, /<body\b[^>]*>/i, 'index.html must contain a body');
assert.match(html, /<main\s+id="app"\s*>/, 'ROAM main #app root must remain present');
assert.match(html, /<nav\s+id="tb"\b/, 'ROAM bottom navigation must remain present');
assert.match(html, /<script\s+src="js\/main\.js"/, 'ROAM app bootstrap must remain linked');
assert.doesNotMatch(html.slice(0, 300), /PICKERS\s*[·-]\s*Dropdown|^\s*#dev\s*\{/m, 'index.html contains CSS instead of HTML');

const refs = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)].map(m => m[1]);
let checked = 0;
for (const ref of refs) {
  if (/^(?:https?:|data:|\/\/)/.test(ref)) continue;
  const pathname = ref.split('?')[0].split('#')[0];
  if (!/^(?:css|js)\//.test(pathname)) continue;
  assert.ok(!ref.includes('?', ref.indexOf('?') + 1), `Double query separator in asset reference: ${ref}`);
  assert.ok(fs.existsSync(path.join(root, pathname)), `Missing referenced asset: ${pathname}`);
  checked++;
}
const css = read('css/pickers.css');
assert.match(css, /#dev\s+\.dd-trigger\s*\{/, 'Picker stylesheet must contain dropdown styling');
assert.match(css, /#dev\s+\.cal\s*\{/, 'Picker stylesheet must contain calendar styling');
assert.doesNotMatch(css.slice(0, 200), /<!doctype html>/i, 'css/pickers.css must not contain the HTML entry point');
console.log(`ROAM site entry is valid; checked ${checked} local CSS/JS assets.`);
