#!/usr/bin/env node
/**
 * Design System Lint — zero-dependency static checker.
 * Scans JSX/CSS files for common DS compliance issues.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const SRC = 'src';
const DS_COMPONENTS = new Set([
  'Button', 'Card', 'Tag', 'Alert', 'Accordion', 'Breadcrumbs',
  'Header', 'Footer', 'Tabs', 'Modal', 'Badge', 'Pagination',
]);

const issues = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (['.jsx', '.tsx', '.css'].includes(extname(entry.name))) files.push(full);
  }
  return files;
}

function check(file, content) {
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    const num = i + 1;
    // Hardcoded hex colors
    if (/#[0-9a-fA-F]{3,8}\b/.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
      issues.push(`${file}:${num} — Hardcoded hex color. Use a DS token instead.`);
    }
    // className/style on known DS components
    for (const comp of DS_COMPONENTS) {
      const re = new RegExp(`<${comp}[\\s][^>]*(className|style\\s*=)`);
      if (re.test(line)) {
        issues.push(`${file}:${num} — Avoid className/style on DS component <${comp}>.`);
      }
    }
  });
}

const files = await walk(SRC);
for (const f of files) {
  const content = await readFile(f, 'utf8');
  check(f, content);
}

if (issues.length > 0) {
  console.log('DS Lint found ' + issues.length + ' warning(s):\n');
  issues.forEach((i) => console.log('  ' + i));
  console.log('\nThese are recommendations, not errors.');
} else {
  console.log('DS Lint: all clear.');
}
