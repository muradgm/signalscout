import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cliArgs = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, ...rest] = arg.split('=');
    return [k.replace(/^--/, ''), rest.join('=')];
  }),
);

function hasAny(text, relPath, matchers) {
  return matchers.some((matcher) => {
    if (typeof matcher === 'function') return matcher(text, relPath);
    return matcher.test(text);
  });
}

function extractTaskId(text, relPath = '') {
  const patterns = [
    /-\s*task_id:\s*(.+)/i,
    /-\s*Task ID:\s*(.+)/i,
    /\bTask ID:\s*(.+)/i,
    /##\s*TASK ID\s*\r?\n([^\r\n]+)/i,
    /^#\s*([A-Z0-9-]+)\s+Return\b/im,
    /^#\s*([A-Z0-9-]+)\s+QA\b/im,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }

  const relMatch = relPath.match(/ops[\\/]+runtime[\\/]+tasks[\\/]+([A-Z0-9-]+)/i);
  if (relMatch) return relMatch[1].trim();

  return null;
}

const taskIdMatcher = (text, relPath) => extractTaskId(text, relPath) !== null;

const requirements = {
  packet: [
    {
      name: 'canonical',
      fields: {
        task_id: [/task_id:/i],
        title: [/title:/i],
        owner_lane: [/owner_lane:/i],
        priority: [/priority:/i],
        gate: [/gate:/i],
        objective: [/objective:/i],
        in_scope: [/in_scope:/i],
        out_of_scope: [/out_of_scope:/i],
        allowed_files: [/allowed_files:/i],
        blocked_files: [/blocked_files:/i],
        inputs: [/inputs:/i],
        expected_outputs: [/expected_outputs:/i],
        output_contract: [/output_contract:/i],
        benchmark_pack: [/benchmark_pack:/i],
        validation_steps: [/validation_steps:/i],
        blast_radius: [/blast_radius:/i],
        rollback_plan: [/rollback_plan:/i],
        done_when: [/done_when:/i],
        escalation_condition: [/escalation_condition:/i],
      },
    },
    {
      name: 'legacy',
      fields: {
        task_id: [taskIdMatcher],
        task_type: [/##\s*TASK TYPE\b/i],
        owner_lane: [/##\s*OWNER LANE\b/i],
        priority: [/##\s*PRIORITY\b/i],
        gate_level: [/##\s*GATE LEVEL\b/i],
        objective: [/##\s*OBJECTIVE\b/i],
        in_scope: [/In scope:/i],
        out_of_scope: [/Out of scope:/i],
        authoritative_files: [/##\s*AUTHORITATIVE FILES\b/i],
        required_output: [/##\s*REQUIRED OUTPUT\b/i],
        validation: [/##\s*VALIDATION\b/i],
        required_evidence: [/##\s*REQUIRED EVIDENCE\b/i],
        escalation_condition: [/##\s*ESCALATION CONDITION\b/i],
      },
    },
  ],
  return: [
    {
      name: 'canonical',
      fields: {
        task_id: [/task_id:/i],
        files_read: [/files_read:/i],
        changed_files: [/changed_files:/i],
        deliverable_summary: [/deliverable_summary:/i],
        output_contract_status: [/output_contract_status:/i],
        benchmark_result: [/benchmark_result:/i],
        validation_evidence: [/validation_evidence:/i],
        self_check_failures: [/self_check_failures:/i],
        known_risks: [/known_risks:/i],
        unresolved_issues: [/unresolved_issues:/i],
        confidence_note: [/confidence_note:/i],
        recommended_next_action: [/recommended_next_action:/i],
      },
    },
    {
      name: 'legacy',
      fields: {
        task_id: [taskIdMatcher],
        files_read: [/^##\s*files read\b/im, /^##\s*Files Read\b/im, /files read:/i],
        changed_files: [/^##\s*changed files\b/im, /^##\s*Changed Files\b/im, /changed files:/i],
        summary: [
          /task summary:/i,
          /^##\s*deliverable summary\b/im,
          /^##\s*implementation summary\b/im,
          /^##\s*behavioral outcome\b/im,
          /^##\s*work performed\b/im,
          /deliverable summary:/i,
          /work performed:/i,
        ],
        benchmark_or_regression: [
          /^##\s*benchmark result\b/im,
          /^##\s*benchmark evidence\b/im,
          /^##\s*regression coverage\b/im,
          /^##\s*benchmark files referenced\b/im,
          /^##\s*slice improved\b/im,
          /benchmark result:/i,
          /regression coverage/i,
          /benchmark fixture expectations/i,
        ],
        validation: [
          /^##\s*validation evidence\b/im,
          /^##\s*validation commands\b/im,
          /^##\s*validation run\b/im,
          /^##\s*validation commands and results\b/im,
          /validation evidence:/i,
          /validation commands and results:/i,
          /^validation note:/im,
        ],
        risks: [
          /^##\s*known risks\b/im,
          /^##\s*unresolved risks\b/im,
          /^##\s*risks and tradeoffs\b/im,
          /^##\s*residual risks\b/im,
          /known risks:/i,
          /residual risks:/i,
        ],
        unresolved_or_deferred: [
          /^##\s*unresolved issues\b/im,
          /^##\s*deferred \/ not changed\b/im,
          /^##\s*not addressed in this task\b/im,
          /^##\s*unchanged \/ still partial\b/im,
          /^##\s*deferred\b/im,
          /^##\s*unresolved risks \/ deferred cases\b/im,
          /unresolved issues:/i,
        ],
        confidence: [/^##\s*confidence note\b/im, /^##\s*confidence\b/im, /^confidence:/im, /confidence note:/i],
        next_action_or_qa_ready: [
          /^##\s*recommended next action\b/im,
          /^##\s*qa readiness\b/im,
          /^##\s*ready for qa\b/im,
          /\bReady for QA:\s*yes\b/i,
          /^##\s*suggested qa focus\b/im,
          /recommended next action:/i,
          /completion_status:\s*ready for qa/i,
        ],
      },
    },
  ],
  qa: [
    {
      name: 'canonical',
      fields: {
        task_id: [/Task ID:/i],
        reviewer: [/Reviewer:/i],
        reviewed_agent: [/Reviewed agent:/i],
        scope_checked: [/Scope checked:/i],
        files_inspected: [/Files inspected:/i],
        files_changed_checked: [/Files changed checked:/i],
        benchmark_evidence: [/Benchmark evidence:/i],
        validation_evidence: [/Validation evidence:/i],
        unresolved_issues_checked: [/Unresolved issues checked:/i],
        decision: [/Decision:/i],
      },
    },
    {
      name: 'legacy',
      fields: {
        task_id: [taskIdMatcher],
        verdict: [/^verdict:/im, /^Verdict:/im, /^##\s*Verdict\b/im],
        summary: [/summary of what was checked:/i, /^##\s*Summary Of What Was Checked\b/im],
        blocking_findings: [/blocking findings:/i, /^##\s*Blocking Findings\b/im],
        notes: [/non-blocking notes:/i, /^##\s*Non-Blocking Notes\b/im],
        residual_risks: [/residual risks:/i, /^##\s*Residual Risks\b/im],
        confidence: [/^confidence:/im, /^Confidence:/im, /^##\s*Confidence\b/im],
        next_owner: [/next owner:/i, /^##\s*Next Owner\b/im],
      },
    },
  ],
  decision: [
    {
      name: 'canonical',
      fields: {
        task_id: [/Task ID:/i],
        decision_owner: [/Decision owner:/i],
        decision: [/Decision:/i],
        reason: [/Reason:/i],
        qa_verdict_reference: [/QA verdict reference:/i],
        runtime_updates_completed: [/Runtime updates completed:/i],
        next_owner: [/Next owner:/i],
      },
    },
    {
      name: 'legacy',
      fields: {
        task_id: [taskIdMatcher],
        decision_owner: [/Decision owner:/i],
        verdict_or_outcome: [/Verdict:/i, /Outcome:/i, /Accepted \/ rejected \/ accepted with notes:/i],
        reason: [/Reason:/i],
        qa_verdict_reference: [/QA verdict reference:/i],
        runtime_state: [/Runtime updates completed:/i, /Runtime state recommendation:/i],
        follow_up_or_next_owner: [/Next owner:/i, /Follow-up tasks:/i],
      },
    },
  ],
};

function existingCandidates(candidates) {
  return candidates.filter((relPath) => fs.existsSync(path.resolve(root, relPath)));
}

function missingFieldsForMode(mode, doc) {
  return Object.entries(mode.fields)
    .filter(([, matchers]) => !hasAny(doc.text, doc.rel, matchers))
    .map(([field]) => field);
}

function scoreDocument(label, doc) {
  const modes = requirements[label];
  const evaluations = modes.map((mode) => ({
    name: mode.name,
    missing: missingFieldsForMode(mode, doc),
  }));

  evaluations.sort((a, b) => a.missing.length - b.missing.length);
  return evaluations[0];
}

function resolveArtifactPath(label, candidates) {
  const existing = existingCandidates(candidates);
  if (existing.length === 0) return candidates[0];
  if (existing.length === 1) return existing[0];

  const scored = existing.map((relPath) => {
    const doc = {
      rel: relPath,
      text: fs.readFileSync(path.resolve(root, relPath), 'utf8'),
    };
    const best = scoreDocument(label, doc);
    return { relPath, missing: best.missing.length };
  });

  scored.sort((a, b) => a.missing - b.missing);
  return scored[0].relPath;
}

function resolveBundleArgs() {
  if (cliArgs.task) {
    const taskBase = path.join('ops/runtime/tasks', cliArgs.task);
    return {
      packet: resolveArtifactPath('packet', [
        path.join(taskBase, 'assignment.md'),
        path.join(taskBase, 'packets', `${cliArgs.task}.md`),
      ]),
      return: resolveArtifactPath('return', [
        path.join(taskBase, 'return.md'),
        path.join(taskBase, 'returns', `${cliArgs.task}.md`),
      ]),
      qa: resolveArtifactPath('qa', [
        path.join(taskBase, 'qa.md'),
        path.join(taskBase, 'qa', `${cliArgs.task}.md`),
      ]),
      decision: resolveArtifactPath('decision', [
        path.join(taskBase, 'decision.md'),
        path.join(taskBase, 'decisions', `${cliArgs.task}.md`),
      ]),
    };
  }

  return {
    packet: cliArgs.packet,
    return: cliArgs.return,
    qa: cliArgs.qa,
    decision: cliArgs.decision,
  };
}

function readMaybe(rel) {
  if (!rel) return null;
  const full = path.resolve(root, rel);
  if (!fs.existsSync(full)) return null;
  return { rel, text: fs.readFileSync(full, 'utf8') };
}

function checkDocument(label, doc) {
  if (!doc) return { ok: false, message: `${label} missing` };

  const best = scoreDocument(label, doc);
  if (best.missing.length === 0) {
    return { ok: true, message: `${label} fields ok (${best.name})` };
  }

  return {
    ok: false,
    message: `${label} missing ${best.name} fields: ${best.missing.join(', ')}`,
  };
}

const bundle = resolveBundleArgs();
const docs = Object.fromEntries(Object.entries(bundle).map(([k, rel]) => [k, readMaybe(rel)]));

let failures = 0;
const taskIds = new Map();

for (const key of Object.keys(docs)) {
  const result = checkDocument(key, docs[key]);
  if (result.ok) console.log(`[OK] ${result.message}`);
  else {
    failures += 1;
    console.log(`[FAIL] ${result.message}`);
    continue;
  }

  const taskId = extractTaskId(docs[key].text, docs[key].rel);
  if (!taskId) {
    failures += 1;
    console.log(`[FAIL] ${key} task_id missing or unparsable`);
    continue;
  }

  taskIds.set(key, taskId);
  console.log(`[OK] ${key} task id: ${taskId}`);
}

const uniqueTaskIds = [...new Set(taskIds.values())];
if (uniqueTaskIds.length > 1) {
  failures += 1;
  console.log(`[FAIL] task_id mismatch across bundle: ${uniqueTaskIds.join(', ')}`);
} else if (uniqueTaskIds.length === 1) {
  console.log(`[OK] bundle task_id aligned: ${uniqueTaskIds[0]}`);
}

if (failures === 0) {
  console.log('\nGate result: PASS - task bundle has aligned structured evidence.');
} else {
  console.log('\nGate result: FAIL - task bundle is incomplete or inconsistent.');
}

process.exitCode = failures > 0 ? 1 : 0;
