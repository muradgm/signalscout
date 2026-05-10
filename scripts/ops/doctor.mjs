import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const ok = (msg) => console.log(`✅ ${msg}`);
const warn = (msg) => console.log(`⚠️  ${msg}`);
const fail = (msg) => console.log(`❌ ${msg}`);

const REQUIRED_PACKET_FIELDS = [
  'task_id', 'title', 'owner_lane', 'priority', 'gate', 'objective', 'in_scope',
  'out_of_scope', 'allowed_files', 'blocked_files', 'inputs', 'expected_outputs',
  'output_contract', 'benchmark_pack', 'validation_steps', 'blast_radius',
  'rollback_plan', 'done_when', 'escalation_condition',
];

const REQUIRED_RETURN_FIELDS = [
  'task_id', 'files_read', 'changed_files', 'deliverable_summary',
  'output_contract_status', 'benchmark_result', 'validation_evidence',
  'self_check_failures', 'known_risks', 'unresolved_issues', 'confidence_note',
  'recommended_next_action',
];

const REQUIRED_QA_FIELDS = [
  'Task ID:', 'Reviewer:', 'Reviewed agent:', 'Scope checked:', 'Files inspected:',
  'Files changed checked:', 'Benchmark evidence:', 'Validation evidence:',
  'Unresolved issues checked:', 'Decision:',
];

const VALID_RUNTIME_STATES = new Set([
  'NOT STARTED', 'IN PROGRESS', 'READY FOR QA', 'PASS WITH NOTES', 'COMPLETE', 'BLOCKED', 'ESCALATED',
]);
const VALID_REVIEW_STATUSES = new Set([
  'NOT STARTED',
  'IN PROGRESS',
  'PASS WITH NOTES',
  'COMPLETE',
  'BLOCKED',
  'ESCALATED',
  'FAIL - RETURN',
  'FAIL - ESCALATE',
]);

let failures = 0;
let warnings = 0;
const trackedFiles = new Set(
  execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function hasAll(text, fields) {
  return fields.filter((field) => !text.includes(field));
}

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else results.push(full);
  }
  return results;
}

function rel(fullPath) {
  return path.relative(root, fullPath).replaceAll('\\', '/');
}

function checkTemplate(relPath, requiredFields, label) {
  const content = read(relPath);
  const missing = hasAll(content, requiredFields);
  if (missing.length === 0) ok(`${label} complete`);
  else {
    failures += 1;
    fail(`${label} missing: ${missing.join(', ')}`);
  }
}

function parseMarkdownTable(content) {
  return content
    .split('\n')
    .filter((line) => /^\|/.test(line) && !/^\|---/.test(line))
    .map((line) => line.split('|').map((v) => v.trim()).slice(1, -1));
}

function checkRuntimeQueue() {
  const queuePath = path.join(root, 'ops/runtime/PM_REVIEW_QUEUE.md');
  if (!fs.existsSync(queuePath)) {
    warnings += 1;
    warn('PM review queue missing; runtime ledgers have not been initialized locally');
    return;
  }
  const content = fs.readFileSync(queuePath, 'utf8');
  const rows = parseMarkdownTable(content);
  if (rows.length <= 1) {
    warnings += 1;
    warn('PM review queue has no task rows to validate');
    return;
  }
  const dataRows = rows.slice(1);
  const invalid = [];
  for (const row of dataRows) {
    const [taskId, , , state, , , qaStatus, pmStatus] = row;
    if (!VALID_RUNTIME_STATES.has(state)) invalid.push(`${taskId} state -> ${state}`);
    if (!VALID_REVIEW_STATUSES.has(qaStatus)) invalid.push(`${taskId} qa_status -> ${qaStatus}`);
    if (!VALID_REVIEW_STATUSES.has(pmStatus)) invalid.push(`${taskId} pm_status -> ${pmStatus}`);
  }
  if (invalid.length === 0) ok('PM review queue states and statuses valid');
  else {
    failures += 1;
    fail(`PM review queue has invalid values: ${invalid.join('; ')}`);
  }
}

function checkTaskBundles() {
  const taskRoot = path.join(root, 'ops/runtime/tasks');
  if (!fs.existsSync(taskRoot)) {
    warnings += 1;
    warn('Task evidence directory missing');
    return;
  }

  const bundles = fs.readdirSync(taskRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'TASK_ID')
    .map((d) => d.name);
  if (bundles.length === 0) {
    warnings += 1;
    warn('No task bundles found under ops/runtime/tasks');
    return;
  }

  const missingArtifacts = [];
  for (const taskId of bundles) {
    const artifactCandidates = new Map([
      ['assignment', [
        path.join(taskRoot, taskId, 'assignment.md'),
        path.join(taskRoot, taskId, 'packets', `${taskId}.md`),
      ]],
      ['return', [
        path.join(taskRoot, taskId, 'return.md'),
        path.join(taskRoot, taskId, 'returns', `${taskId}.md`),
      ]],
      ['qa', [
        path.join(taskRoot, taskId, 'qa.md'),
        path.join(taskRoot, taskId, 'qa', `${taskId}.md`),
      ]],
      ['decision', [
        path.join(taskRoot, taskId, 'decision.md'),
        path.join(taskRoot, taskId, 'decisions', `${taskId}.md`),
      ]],
    ]);

    for (const [artifact, candidates] of artifactCandidates) {
      if (!candidates.some((candidate) => fs.existsSync(candidate))) {
        missingArtifacts.push(`${rel(path.join(taskRoot, taskId))} missing ${artifact}`);
      }
    }
  }

  if (missingArtifacts.length === 0) ok('Task bundle scaffold shape valid');
  else {
    warnings += missingArtifacts.length;
    for (const file of missingArtifacts.slice(0, 20)) warn(`Task artifact missing: ${file}`);
    if (missingArtifacts.length > 20) warn(`...and ${missingArtifacts.length - 20} more missing task artifact(s)`);
  }
}

function checkRepoHygiene() {
  const hygieneFindings = [];
  if (trackedFiles.has('.env')) hygieneFindings.push('.env is tracked in git');
  if (trackedFiles.has('package-lock.json')) hygieneFindings.push('package-lock.json is tracked in a pnpm workspace');

  for (const tracked of trackedFiles) {
    if (tracked.startsWith('.github/')) continue;
    if (/\bnode_modules\b/.test(tracked)) hygieneFindings.push(`node_modules tracked: ${tracked}`);
    if (/(^|\/)dist\//.test(tracked) || tracked.endsWith('/dist')) hygieneFindings.push(`dist artifact tracked: ${tracked}`);
  }

  if (hygieneFindings.length === 0) ok('Repo hygiene clean');
  else {
    warnings += hygieneFindings.length;
    for (const finding of hygieneFindings.slice(0, 25)) warn(finding);
    if (hygieneFindings.length > 25) warn(`...and ${hygieneFindings.length - 25} more hygiene finding(s)`);
  }
}

checkTemplate('ops/templates/ASSIGNMENT_PACKET_TEMPLATE.md', REQUIRED_PACKET_FIELDS, 'Assignment packet template');
checkTemplate('ops/templates/AGENT_RETURN_TEMPLATE.md', REQUIRED_RETURN_FIELDS, 'Agent return template');
checkTemplate('ops/templates/QA_FINDINGS_TEMPLATE.md', REQUIRED_QA_FIELDS, 'QA findings template');
checkRuntimeQueue();
checkTaskBundles();
checkRepoHygiene();

console.log(`\nSummary: ${failures} failure(s), ${warnings} warning(s)`);
process.exitCode = failures > 0 ? 1 : 0;
