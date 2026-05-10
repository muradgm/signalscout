import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();

const ACTIVE_TASK_STATE = new Set(['IN PROGRESS', 'READY FOR QA', 'BLOCKED', 'ESCALATED']);
const REVIEW_ACTIVE_STATUS = new Set(['IN PROGRESS', 'BLOCKED', 'ESCALATED']);
const REVIEW_RESULT_STATUS = new Set(['PASS WITH NOTES', 'FAIL - RETURN', 'FAIL - ESCALATE', 'COMPLETE']);
const ACCEPTANCE_NEAR_STATE = new Set(['READY FOR QA', 'PASS WITH NOTES']);
const ACCEPTED_PM_STATUS = new Set(['COMPLETE']);

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: 'pipe', shell: true });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return result.status ?? 1;
}

function parseMarkdownTable(content) {
  return content
    .split('\n')
    .filter((line) => /^\|/.test(line) && !/^\|---/.test(line))
    .map((line) => line.split('|').map((v) => v.trim()).slice(1, -1));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function getValue(text, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^-\\s*${escaped}:\\s*(.*)$`, 'im');
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

function isPlaceholder(value) {
  if (!value) return true;
  if (/^PASS \|/.test(value)) return true;
  if (/^ACCEPT \|/.test(value)) return true;
  if (/^<.+>$/.test(value)) return true;
  return false;
}

function checkPopulated(docRel, checks) {
  const full = path.join(root, docRel);
  if (!fs.existsSync(full)) return [`missing file ${docRel}`];
  const text = fs.readFileSync(full, 'utf8');
  const missing = [];
  for (const [label, aliases] of checks) {
    const value = getValue(text, aliases);
    if (isPlaceholder(value)) missing.push(label);
  }
  return missing;
}

function bundlePaths(taskId) {
  const base = path.join('ops/runtime/tasks', taskId);
  return {
    packet: resolveArtifactPath([
      path.join(base, 'assignment.md'),
      path.join(base, 'packets', `${taskId}.md`),
    ]),
    return: resolveArtifactPath([
      path.join(base, 'return.md'),
      path.join(base, 'returns', `${taskId}.md`),
    ]),
    qa: resolveArtifactPath([
      path.join(base, 'qa.md'),
      path.join(base, 'qa', `${taskId}.md`),
    ]),
    decision: resolveArtifactPath([
      path.join(base, 'decision.md'),
      path.join(base, 'decisions', `${taskId}.md`),
    ]),
  };
}

function resolveArtifactPath(candidates) {
  for (const relPath of candidates) {
    if (fs.existsSync(path.join(root, relPath))) return relPath;
  }
  return candidates[0];
}

const failures = [];

console.log('== ops:guard ==\n');

const doctorStatus = run('pnpm', ['ops:doctor']);
if (doctorStatus !== 0) {
  console.log('\nGuard result: FAIL — ops:doctor failed.');
  process.exit(1);
}

const preflightStatus = run('pnpm', ['ops:preflight']);
if (preflightStatus !== 0) failures.push('Contract test preflight failed');

const rows = parseMarkdownTable(read('ops/runtime/PM_REVIEW_QUEUE.md')).slice(1);
for (const row of rows) {
  const [taskId, , , state, , , qaStatus, pmStatus] = row;
  const paths = bundlePaths(taskId);
  const accepted = state === 'COMPLETE' && ACCEPTED_PM_STATUS.has(pmStatus);

  for (const rel of Object.values(paths)) {
    if (!fs.existsSync(path.join(root, rel))) failures.push(`${taskId}: missing artifact ${rel}`);
  }

  if (accepted) continue;

  const active = ACTIVE_TASK_STATE.has(state) || REVIEW_ACTIVE_STATUS.has(qaStatus) || REVIEW_ACTIVE_STATUS.has(pmStatus);
  if (active) {
    const packetMissing = checkPopulated(paths.packet, [
      ['objective', ['objective']],
      ['in_scope', ['in_scope']],
      ['allowed_files', ['allowed_files']],
      ['inputs', ['inputs']],
      ['expected_outputs', ['expected_outputs']],
      ['validation_steps', ['validation_steps']],
      ['rollback_plan', ['rollback_plan']],
      ['escalation_condition', ['escalation_condition']],
    ]);
    if (packetMissing.length) failures.push(`${taskId}: packet not materially populated -> ${packetMissing.join(', ')}`);
  }

  const returnRequired =
    ACCEPTANCE_NEAR_STATE.has(state) ||
    REVIEW_RESULT_STATUS.has(qaStatus) ||
    REVIEW_RESULT_STATUS.has(pmStatus);

  if (returnRequired) {
    const returnMissing = checkPopulated(paths.return, [
      ['files_read', ['files_read']],
      ['deliverable_summary', ['deliverable_summary']],
      ['output_contract_status', ['output_contract_status']],
      ['validation_evidence', ['validation_evidence']],
      ['recommended_next_action', ['recommended_next_action']],
    ]);
    if (returnMissing.length) failures.push(`${taskId}: return not materially populated -> ${returnMissing.join(', ')}`);
  }

  if ((REVIEW_RESULT_STATUS.has(qaStatus) || ACCEPTANCE_NEAR_STATE.has(qaStatus)) && qaStatus !== 'NOT STARTED') {
    const qaMissing = checkPopulated(paths.qa, [
      ['Reviewer', ['Reviewer']],
      ['Scope checked', ['Scope checked']],
      ['Files inspected', ['Files inspected']],
      ['Validation evidence', ['Validation evidence']],
      ['Decision', ['Decision']],
      ['Next owner', ['Next owner']],
    ]);
    if (qaMissing.length) failures.push(`${taskId}: qa not materially populated -> ${qaMissing.join(', ')}`);
  }

  if ((REVIEW_RESULT_STATUS.has(pmStatus) || ACCEPTANCE_NEAR_STATE.has(pmStatus)) && pmStatus !== 'NOT STARTED') {
    const decisionMissing = checkPopulated(paths.decision, [
      ['Decision owner', ['Decision owner']],
      ['Decision', ['Decision']],
      ['Reason', ['Reason']],
      ['Runtime updates completed', ['Runtime updates completed']],
      ['Next owner', ['Next owner']],
    ]);
    if (decisionMissing.length) failures.push(`${taskId}: decision not materially populated -> ${decisionMissing.join(', ')}`);
  }

  const acceptanceNear =
    ACCEPTANCE_NEAR_STATE.has(state) ||
    ACCEPTANCE_NEAR_STATE.has(qaStatus) ||
    ACCEPTANCE_NEAR_STATE.has(pmStatus);

  if (acceptanceNear) {
    const gateStatus = run('pnpm', ['ops:gate', '--', `--task=${taskId}`]);
    if (gateStatus !== 0) failures.push(`${taskId}: task gate failed`);
  }
}

if (failures.length === 0) {
  const p1Status = run('pnpm', ['test:p1']);
  if (p1Status !== 0) failures.push('P1 contract tests failed');
}

if (failures.length) {
  console.log('\nGuard findings:');
  for (const failure of failures) console.log(`❌ ${failure}`);
  console.log(`\nGuard result: FAIL — ${failures.length} enforcement issue(s).`);
  process.exit(1);
}

console.log('\nGuard result: PASS — queue, evidence, and contract checks are aligned.');
