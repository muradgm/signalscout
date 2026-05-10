import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredBuildOutputs = [
  'packages/core/dist/index.js',
  'packages/ai/dist/index.js',
  'packages/scraper/dist/index.js',
  'apps/api/dist/app.js',
];

const missing = requiredBuildOutputs.filter((rel) => !fs.existsSync(path.join(root, rel)));

if (missing.length === 0) {
  console.log('✅ Contract test preflight ready');
  process.exit(0);
}

console.log('❌ Contract test preflight missing required build output(s):');
for (const rel of missing) console.log(`- ${rel}`);
console.log('');
console.log('Run this in a real dev environment before contract tests or CI hardening:');
console.log('pnpm install --frozen-lockfile');
console.log('pnpm build:p1');
process.exit(1);
