import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import ts from 'typescript';

// Execute the actual routing helper with the same base Vite injects in production.
const source = await readFile('src/lib/routing.ts', 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
});
const moduleSource = outputText.replaceAll('import.meta.env.BASE_URL', JSON.stringify('/verdantry/'));
const { appPath, getSharedRouteToken } = await import(`data:text/javascript;base64,${Buffer.from(moduleSource).toString('base64')}`);
assert.equal(appPath(), '/verdantry/');
assert.equal(appPath('/shared/example'), '/verdantry/shared/example');
assert.equal(getSharedRouteToken('/verdantry/shared/example/'), 'example');
assert.equal(getSharedRouteToken('/verdantry/shared/a%20b'), 'a b');
assert.equal(getSharedRouteToken('/verdantry/shared/%E0%A4%A'), '%E0%A4%A');
for (const path of ['/shared/example', '/verdantry/', '/verdantry-other/shared/example', '/verdantry/shared/example/extra']) {
  assert.equal(getSharedRouteToken(path), null, path);
}

const html = await readFile('dist/verdantry/index.html', 'utf8');
const localAssets = [...html.matchAll(/(?:src|href)="(\/[^\"]+)"/g)].map(match => match[1]);
assert.ok(localAssets.length >= 4);
for (const asset of localAssets) {
  assert.ok(asset.startsWith('/verdantry/'), asset);
  await access(`dist${asset}`);
}
const fonts = await readFile('dist/verdantry/fonts.css', 'utf8');
assert.ok(fonts.includes('./fonts/TAYRoony.woff2'));
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
assert.equal(config.outputDirectory, 'dist');
assert.equal(config.rewrites.at(-1).destination, 'https://heinrich-nowak-portfolio.nowakmataheinrich.chatgpt.site/:path*');
console.log('Routing checks passed: nested assets, shared links, font URL, and portfolio fallback.');
