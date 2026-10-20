import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Test Vercel's generated regexes, not just the source path patterns.
// Run `vercel build` first to generate this output.
const config = JSON.parse(await readFile('.vercel/output/config.json', 'utf8'));
function routeFor(path) {
  return config.routes.find(route => route.src && new RegExp(route.src).test(path));
}
assert.equal(routeFor('/')?.dest, 'https://heinrich-nowak-portfolio.nowakmataheinrich.chatgpt.site/');
assert.ok(routeFor('/rail.js')?.dest.startsWith('https://heinrich-nowak-portfolio.nowakmataheinrich.chatgpt.site/'));
assert.ok(routeFor('/verdantry')?.dest.startsWith('/verdantry/index.html'));
assert.ok(routeFor('/verdantry/shared/example')?.dest.startsWith('/verdantry/index.html'));
assert.equal(routeFor('/shared/example')?.status, 307);
console.log('Compiled Vercel route checks passed: homepage, portfolio assets, app, and legacy sharing.');
