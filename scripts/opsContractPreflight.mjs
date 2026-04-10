import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredBuildOutputs = [
  'packages/core/dist/index.js',
  'packages/db/dist/index.js'
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
console.log('pnpm --filter @signalscout/core build');
console.log('pnpm --filter @signalscout/db build');
process.exit(1);
