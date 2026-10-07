import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { experience } from '../src/data/experience.ts';
import { projects } from '../src/data/projects.ts';
import { education } from '../src/data/education.ts';
import { photos } from '../src/data/photos.ts';
import { site, hero } from '../src/data/site.ts';

// Content changes should fail early if they introduce a missing asset or invalid link.
const publicRoot = resolve('public');
function asset(path: string) {
  assert(path.startsWith('/'), `Asset must use a public-root path: ${path}`);
  const file = resolve(publicRoot, path.slice(1));
  assert(
    file.startsWith(publicRoot + sep),
    `Asset escapes public directory: ${path}`,
  );
  assert(existsSync(file), `Missing asset: ${path}`);
}
function external(url: string) {
  assert.equal(new URL(url).protocol, 'https:', `Use HTTPS: ${url}`);
}
function unique(values: string[], label: string) {
  assert.equal(new Set(values).size, values.length, `Duplicate ${label}`);
}

external(site.github);
external(site.linkedin);
if (site.url) external(site.url);
asset(hero.portrait.src);
for (const job of experience) asset(`/images/${job.logo}.png`);
unique(
  projects.map((project) => project.repository),
  'project repository',
);
for (const project of projects) {
  external(project.repository);
  assert(project.flow.length > 0, `Missing project flow: ${project.name}`);
}
for (const school of education) {
  asset(school.logo.src);
  if (school.activities.logo) asset(school.activities.logo);
  if (school.exchange) asset(school.exchange.logo);
}
assert(photos.length > 0, 'Gallery needs at least one photograph');
unique(
  photos.map((photo) => photo.src),
  'gallery photograph',
);
for (const photo of photos) {
  asset(photo.src);
  assert(
    photo.alt.trim() && photo.caption.trim(),
    `Missing photo description: ${photo.src}`,
  );
  assert(
    photo.width > 0 && photo.height > 0,
    `Invalid photo dimensions: ${photo.src}`,
  );
}
console.log(
  `Content checks passed: ${experience.length} roles, ${projects.length} projects, ${education.length} schools, ${photos.length} photos.`,
);
