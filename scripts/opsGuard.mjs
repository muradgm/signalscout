import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const queuePath = path.join(root, 'ops/runtime/PM_REVIEW_QUEUE.md');

const ADVANCED_STATE = new Set(['IN PROGRESS', 'READY FOR QA', 'PASS WITH NOTES', 'COMPLETE', 'BLOCKED', 'ESCALATED']);
const RETURN_REQUIRED_STATE = new Set(['READY FOR QA', 'PASS WITH NOTES', 'COMPLETE']);
const DOC_ROOT = path.join(root, 'ops/runtime/tasks');

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: 'pipe' });
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
    packet: path.join(base, 'packets', `${taskId}.md`),
    return: path.join(base, 'returns', `${taskId}.md`),
    qa: path.join(base, 'qa', `${taskId}.md`),
    decision: path.join(base, 'decisions', `${taskId}.md`)
  };
}

const failures = [];

console.log('== ops:guard ==\n');

const doctorStatus = run('node', ['scripts/opsDoctor.mjs']);
if (doctorStatus !== 0) {
  console.log('\nGuard result: FAIL — ops:doctor failed.');
  process.exit(1);
}

const preflightStatus = run('node', ['scripts/opsContractPreflight.mjs']);
if (preflightStatus !== 0) failures.push('Contract test preflight failed');

const rows = parseMarkdownTable(read('ops/runtime/PM_REVIEW_QUEUE.md')).slice(1);
for (const row of rows) {
  const [taskId, owner, family, state, gate, blastRadius, qaStatus, pmStatus] = row;
  const paths = bundlePaths(taskId);

  for (const rel of Object.values(paths)) {
    if (!fs.existsSync(path.join(root, rel))) failures.push(`${taskId}: missing artifact ${rel}`);
  }

  const active = ADVANCED_STATE.has(state) || ADVANCED_STATE.has(qaStatus) || ADVANCED_STATE.has(pmStatus);
  if (active) {
    const packetMissing = checkPopulated(paths.packet, [
      ['objective', ['objective']],
      ['problem', ['problem']],
      ['in_scope', ['in_scope']],
      ['allowed_files', ['allowed_files']],
      ['inputs', ['inputs']],
      ['expected_outputs', ['expected_outputs']],
      ['validation_steps', ['validation_steps']],
      ['rollback_plan', ['rollback_plan']],
      ['escalation_condition', ['escalation_condition']]
    ]);
    if (packetMissing.length) failures.push(`${taskId}: packet not materially populated -> ${packetMissing.join(', ')}`);
  }

  if (RETURN_REQUIRED_STATE.has(state) || RETURN_REQUIRED_STATE.has(qaStatus) || RETURN_REQUIRED_STATE.has(pmStatus)) {
    const returnMissing = checkPopulated(paths.return, [
      ['files_read', ['files_read']],
      ['deliverable_summary', ['deliverable_summary']],
      ['output_contract_status', ['output_contract_status']],
      ['validation_evidence', ['validation_evidence']],
      ['recommended_next_action', ['recommended_next_action']]
    ]);
    if (returnMissing.length) failures.push(`${taskId}: return not materially populated -> ${returnMissing.join(', ')}`);
  }

  if (ADVANCED_STATE.has(qaStatus) && qaStatus !== 'NOT STARTED') {
    const qaMissing = checkPopulated(paths.qa, [
      ['Reviewer', ['Reviewer']],
      ['Scope checked', ['Scope checked']],
      ['Files inspected', ['Files inspected']],
      ['Validation evidence', ['Validation evidence']],
      ['Decision', ['Decision']],
      ['Next owner', ['Next owner']]
    ]);
    if (qaMissing.length) failures.push(`${taskId}: qa not materially populated -> ${qaMissing.join(', ')}`);
  }

  if (ADVANCED_STATE.has(pmStatus) && pmStatus !== 'NOT STARTED') {
    const decisionMissing = checkPopulated(paths.decision, [
      ['Decision owner', ['Decision owner']],
      ['Decision', ['Decision']],
      ['Reason', ['Reason']],
      ['Runtime updates completed', ['Runtime updates completed']],
      ['Next owner', ['Next owner']]
    ]);
    if (decisionMissing.length) failures.push(`${taskId}: decision not materially populated -> ${decisionMissing.join(', ')}`);
  }

  if (state === 'READY FOR QA' || state === 'PASS WITH NOTES' || state === 'COMPLETE' || qaStatus === 'PASS WITH NOTES' || qaStatus === 'COMPLETE' || pmStatus === 'COMPLETE') {
    const gateStatus = run('node', ['scripts/opsTaskGate.mjs', `--task=${taskId}`]);
    if (gateStatus !== 0) failures.push(`${taskId}: task gate failed`);
  }
}

if (failures.length === 0) {
  const p1Status = run('node', ['--test', 'tests/mvp/operator-loop.contract.test.mjs', 'tests/mvp/repositories.contract.test.mjs']);
  if (p1Status !== 0) failures.push('P1 contract tests failed');
}

if (failures.length) {
  console.log('\nGuard findings:');
  for (const failure of failures) console.log(`❌ ${failure}`);
  console.log(`\nGuard result: FAIL — ${failures.length} enforcement issue(s).`);
  process.exit(1);
}

console.log('\nGuard result: PASS — queue, evidence, and contract checks are aligned.');
