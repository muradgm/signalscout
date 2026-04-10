import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cliArgs = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, ...rest] = arg.split('=');
    return [k.replace(/^--/, ''), rest.join('=')];
  })
);

const required = {
  packet: [
    'task_id', 'title', 'owner_lane', 'priority', 'gate', 'objective', 'in_scope',
    'out_of_scope', 'allowed_files', 'blocked_files', 'inputs', 'expected_outputs',
    'output_contract', 'benchmark_pack', 'validation_steps', 'blast_radius', 'rollback_plan',
    'done_when', 'escalation_condition'
  ],
  return: [
    'task_id', 'files_read', 'changed_files', 'deliverable_summary', 'output_contract_status',
    'benchmark_result', 'validation_evidence', 'self_check_failures', 'known_risks',
    'unresolved_issues', 'confidence_note', 'recommended_next_action'
  ],
  qa: [
    'Task ID:', 'Reviewer:', 'Reviewed agent:', 'Scope checked:', 'Files inspected:',
    'Files changed checked:', 'Benchmark evidence:', 'Validation evidence:', 'Unresolved issues checked:', 'Decision:'
  ],
  decision: ['Task ID:', 'Decision owner:', 'Decision:', 'Reason:', 'QA verdict reference:', 'Runtime updates completed:', 'Next owner:']
};

function resolveBundleArgs() {
  if (cliArgs.task) {
    const taskBase = path.join('ops/runtime/tasks', cliArgs.task);
    return {
      packet: path.join(taskBase, 'packets', `${cliArgs.task}.md`),
      return: path.join(taskBase, 'returns', `${cliArgs.task}.md`),
      qa: path.join(taskBase, 'qa', `${cliArgs.task}.md`),
      decision: path.join(taskBase, 'decisions', `${cliArgs.task}.md`)
    };
  }
  return {
    packet: cliArgs.packet,
    return: cliArgs.return,
    qa: cliArgs.qa,
    decision: cliArgs.decision
  };
}

function readMaybe(rel) {
  if (!rel) return null;
  const full = path.resolve(root, rel);
  if (!fs.existsSync(full)) return null;
  return { rel, text: fs.readFileSync(full, 'utf8') };
}

function extractTaskId(text) {
  const patterns = [
    /-\s*task_id:\s*(.+)/i,
    /-\s*Task ID:\s*(.+)/i,
    /\bTask ID:\s*(.+)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

function checkFields(label, doc) {
  if (!doc) return { ok: false, message: `${label} missing` };
  const missing = required[label].filter((field) => !doc.text.includes(field));
  if (missing.length) return { ok: false, message: `${label} missing fields: ${missing.join(', ')}` };
  return { ok: true, message: `${label} fields ok` };
}

const bundle = resolveBundleArgs();
const docs = Object.fromEntries(Object.entries(bundle).map(([k, rel]) => [k, readMaybe(rel)]));

let failures = 0;
const taskIds = new Map();

for (const key of Object.keys(docs)) {
  const result = checkFields(key, docs[key]);
  if (result.ok) console.log(`✅ ${result.message}`);
  else {
    failures += 1;
    console.log(`❌ ${result.message}`);
    continue;
  }

  const taskId = extractTaskId(docs[key].text);
  if (!taskId) {
    failures += 1;
    console.log(`❌ ${key} task_id missing or unparsable`);
    continue;
  }
  taskIds.set(key, taskId);
  console.log(`✅ ${key} task id: ${taskId}`);
}

const uniqueTaskIds = [...new Set(taskIds.values())];
if (uniqueTaskIds.length > 1) {
  failures += 1;
  console.log(`❌ task_id mismatch across bundle: ${uniqueTaskIds.join(', ')}`);
} else if (uniqueTaskIds.length === 1) {
  console.log(`✅ bundle task_id aligned: ${uniqueTaskIds[0]}`);
}

if (failures === 0) {
  console.log('\nGate result: PASS — task bundle has aligned structured evidence.');
} else {
  console.log('\nGate result: FAIL — task bundle is incomplete or inconsistent.');
}
process.exitCode = failures > 0 ? 1 : 0;
