import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [rawKey, ...rest] = arg.split('=');
    return [rawKey.replace(/^--/, ''), rest.join('=')];
  })
);

const taskId = args.task;
const owner = args.owner ?? 'PM';
const family = args.family ?? 'general';
const gate = args.gate ?? 'B';
const priority = args.priority ?? 'P1';

if (!taskId) {
  console.error('Usage: node scripts/opsTaskInit.mjs --task=AI-P1-003 [--owner=AI] [--family=audit_quality] [--gate=B] [--priority=P1]');
  process.exit(1);
}

const baseDir = path.join(root, 'ops/runtime/tasks', taskId);
const files = [
  {
    key: 'packet',
    rel: path.join(baseDir, 'packets', `${taskId}.md`),
    template: 'ops/templates/ASSIGNMENT_PACKET_TEMPLATE.md',
    replacements: {
      '- task_id:': `- task_id: ${taskId}`,
      '- title:': `- title: ${family.replaceAll('_', ' ')}`,
      '- owner_lane:': `- owner_lane: ${owner}`,
      '- priority:': `- priority: ${priority}`,
      '- gate:': `- gate: ${gate}`
    }
  },
  {
    key: 'return',
    rel: path.join(baseDir, 'returns', `${taskId}.md`),
    template: 'ops/templates/AGENT_RETURN_TEMPLATE.md',
    replacements: {
      '- task_id:': `- task_id: ${taskId}`
    }
  },
  {
    key: 'qa',
    rel: path.join(baseDir, 'qa', `${taskId}.md`),
    template: 'ops/templates/QA_FINDINGS_TEMPLATE.md',
    replacements: {
      '- Task ID:': `- Task ID: ${taskId}`,
      '- Reviewed agent:': `- Reviewed agent: ${owner}`
    }
  },
  {
    key: 'decision',
    rel: path.join(baseDir, 'decisions', `${taskId}.md`),
    template: 'ops/templates/DECISION_RECORD_TEMPLATE.md',
    replacements: {
      '- Task ID:': `- Task ID: ${taskId}`
    }
  }
];

function applyReplacements(text, replacements) {
  let out = text;
  for (const [from, to] of Object.entries(replacements)) {
    out = out.replace(from, to);
  }
  return out;
}

for (const file of files) {
  const full = file.rel;
  fs.mkdirSync(path.dirname(full), { recursive: true });
  if (fs.existsSync(full)) {
    console.log(`SKIP ${path.relative(root, full).replaceAll('\\', '/')}`);
    continue;
  }
  const template = fs.readFileSync(path.join(root, file.template), 'utf8');
  const content = applyReplacements(template, file.replacements);
  fs.writeFileSync(full, content, 'utf8');
  console.log(`CREATE ${path.relative(root, full).replaceAll('\\', '/')}`);
}

console.log(`\nTask bundle scaffolded for ${taskId}`);
