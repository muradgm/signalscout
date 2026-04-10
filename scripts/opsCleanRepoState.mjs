import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const apply = process.argv.includes('--apply');
const targets = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') {
        targets.push(rel);
        continue;
      }
      walk(full);
    } else {
      if (rel === '.env' || rel === 'package-lock.json' || rel === 'pnpm') targets.push(rel);
    }
  }
}

walk(root);

if (targets.length === 0) {
  console.log('Nothing to clean.');
  process.exit(0);
}

for (const target of targets) {
  console.log(`${apply ? 'REMOVE' : 'DRY-RUN'} ${target}`);
  if (apply) fs.rmSync(path.join(root, target), { recursive: true, force: true });
}

console.log(`\n${apply ? 'Cleanup applied' : 'Dry run complete'}: ${targets.length} path(s)`);
