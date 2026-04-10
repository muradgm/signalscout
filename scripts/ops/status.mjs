import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function parseMarkdownTable(content) {
  return content
    .split('\n')
    .filter((line) => /^\|/.test(line) && !/^\|---/.test(line))
    .map((line) => line.split('|').map((v) => v.trim()).slice(1, -1));
}

const content = fs.readFileSync(path.join(root, 'ops/runtime/PM_REVIEW_QUEUE.md'), 'utf8');
const rows = parseMarkdownTable(content).slice(1);
const counts = new Map();
const owners = new Map();
for (const row of rows) {
  const [, owner, , state] = row;
  counts.set(state, (counts.get(state) ?? 0) + 1);
  owners.set(owner, (owners.get(owner) ?? 0) + 1);
}

console.log('# Ops Status');
console.log('');
console.log(`Total tasks: ${rows.length}`);
console.log('');
console.log('## By state');
for (const [state, count] of [...counts.entries()].sort()) console.log(`- ${state}: ${count}`);
console.log('');
console.log('## By owner');
for (const [owner, count] of [...owners.entries()].sort()) console.log(`- ${owner}: ${count}`);
console.log('');
console.log('## Active tasks');
for (const [taskId, owner, , state, , , qaStatus, pmStatus, nextAction] of rows) {
  if (state !== 'NOT STARTED' || qaStatus !== 'NOT STARTED' || pmStatus !== 'NOT STARTED') {
    console.log(`- ${taskId} | owner=${owner} | state=${state} | qa=${qaStatus} | pm=${pmStatus} | next=${nextAction}`);
  }
}
