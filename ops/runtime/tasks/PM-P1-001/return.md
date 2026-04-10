# AGENT RETURN

- task_id: PM-P1-001
- files_read:
  - ops/README.md
  - ops/core/00_SYSTEM_OVERVIEW.md
  - ops/core/01_OPERATING_MODEL.md
  - ops/core/02_TASK_LIFECYCLE.md
  - ops/core/03_ASSIGNMENT_PACKET.md
  - ops/core/04_QA_GATE.md
  - ops/core/05_OPERATING_PRINCIPLES.md
  - ops/core/06_RUNTIME_RULES.md
  - ops/runtime/README.md
  - ops/runtime/PM_REVIEW_QUEUE.md
  - ops/runtime/STATUS_SNAPSHOT.md
  - ops/runtime/TASK_FAMILY_REGISTRY.md
  - ops/runtime/AGENT_SCOREBOARD.md
  - ops/runtime/BENCHMARK_REGISTRY.md
  - ops/runtime/FAILURE_PATTERNS.md
  - ops/runtime/REVIEW_PROTOCOL.md
  - ops/runtime/FINAL_PACK_AUDIT.md
  - ops/runtime/P1_EXECUTION_CHECKLIST.md
  - ops/runtime/bootstrap/PM_BOOT.md
  - ops/runtime/tasks/README.md
  - ops/runtime/tasks/AI-P0-001/packets/AI-P0-001.md
  - ops/runtime/tasks/AI-P0-001/returns/AI-P0-001.md
  - ops/runtime/tasks/AI-P0-002/packets/AI-P0-002.md
  - ops/runtime/tasks/DATA-P0-001/packets/DATA-P0-001.md
  - ops/runtime/tasks/DEVOPS-P1-001/packets/DEVOPS-P1-001.md
  - ops/runtime/tasks/FS-P1-001/packets/FS-P1-001.md
  - ops/runtime/tasks/GTM-P1-001/packets/GTM-P1-001.md
  - ops/runtime/tasks/GTM-P1-001/decisions/GTM-P1-001.md
  - ops/runtime/tasks/QA-P1-001/packets/QA-P1-001.md
  - ops/runtime/tasks/QA-P1-001/returns/QA-P1-001.md
  - ops/runtime/tasks/QA-P1-001/qa/QA-P1-001.md
  - ops/runtime/tasks/UX-P1-001/packets/UX-P1-001.md
  - ops/truth/PROJECT.md
  - ops/truth/TRACKLIST.md
  - ops/truth/CODEBASE_AUDIT.md
  - ops/truth/PRODUCT_DEFINITION.md
  - ops/governance/ACTIVE_DECISIONS.md
  - package.json
- changed_files:
  - ops/runtime/tasks/PM-P1-001/return.md
- deliverable_summary:
  - Produced the actual PM planning deliverables required by the assignment packet inside this bundle.
  - Added a concrete current-state assessment of ops maturity, strengths, and blockers.
  - Added a proposed next-task set with direct handoff fields for each task.
  - Added explicit sequencing, including safe parallelization boundaries.
  - Added 3 packet-ready specialist task bodies for DEVOPS-P1-001, QA-P1-001, and AI-P0-001.
  - Resolved the assignment authority-file conflict at the PM bundle level by recording an explicit escalation outcome and the repo-actual canonical file set used for planning.
- output_contract_status:
  - PASS
  - Required planning outputs are now present in the bundle, not summarized only by claim.
  - Recommendations remain grounded in repo/runtime files and do not include specialist implementation.
- benchmark_result:
  - PM planning used the repo benchmark registry and lane benchmark locations for task definition.
  - No executable PM benchmark was run because this task was planning-only.
  - Documented enforcement commands `pnpm ops:status` and `pnpm ops:doctor` were attempted and failed because those commands are documented in ops/README.md but not wired in package.json.
- validation_evidence:
  - Verified runtime queue state in ops/runtime/PM_REVIEW_QUEUE.md and ops/runtime/STATUS_SNAPSHOT.md.
  - Verified task-bundle artifact shape in ops/runtime/tasks/README.md and sampled active task bundles.
  - Verified benchmark-pack presence under ops/benchmarks/*.
  - Cross-checked planning recommendations against PROJECT.md, TRACKLIST.md, CODEBASE_AUDIT.md, PRODUCT_DEFINITION.md, and ACTIVE_DECISIONS.md.
  - Verified that several queued tasks remain placeholder packets, specifically DEVOPS-P1-001, UX-P1-001, FS-P1-001, and AI-P0-002.
- self_check_failures:
  - The assignment packet authority list names non-existent core files. This was not silently reconciled; the conflict is recorded below under `authority_conflict_resolution`.
- known_risks:
  - Queue state may overstate progress because several active task packets are placeholders and sampled returns are still empty templates.
  - UX and FS work remain partially dependent on unresolved active decisions.
  - GTM remains escalated pending human claim-boundary decisions.
  - Until DEVOPS closes the command/doc parity gap, the ops layer remains structurally strong but not fully self-enforcing.
- unresolved_issues:
  - Whether PM should correct `assignment.md` directly in a follow-up bundle maintenance pass or leave the authority conflict recorded only as a decision note.
  - Whether QA mandatory coverage needs a PM-level binding beyond current lane wording.
  - Whether FS work should wait entirely for D-001 or be narrowed to non-decision-dependent shell cleanup.
- confidence_note:
  - High confidence in the proposed sequencing and immediate next-task set.
  - Medium confidence in current runtime maturity because executable ops checks documented in ops/README.md are not currently available in package.json.
- recommended_next_action:
  - Route DEVOPS-P1-001 first to restore command/doc parity and make runtime enforcement runnable.
  - In parallel, route QA-P1-001 to complete the QA lane contract.
  - After that, route AI-P0-001 as the first P0 specialist tightening task, then DATA-P0-001, then AI-P0-002, then UX-P1-001.

## authority_conflict_resolution

- assignment_packet_conflict:
  - `ops/runtime/tasks/PM-P1-001/assignment.md` cites `ops/core/01_SYSTEM_OVERVIEW.md`, `ops/core/02_TRUTH_HIERARCHY.md`, `ops/core/03_TEAM_TOPOLOGY.md`, `ops/core/04_ASSIGNMENT_FLOW.md`, and `ops/core/05_QA_SYSTEM.md`.
  - Those files do not exist in the current repo.
- repo_actual_canonical_core_used_for_planning:
  - ops/core/00_SYSTEM_OVERVIEW.md
  - ops/core/01_OPERATING_MODEL.md
  - ops/core/02_TASK_LIFECYCLE.md
  - ops/core/03_ASSIGNMENT_PACKET.md
  - ops/core/04_QA_GATE.md
  - ops/core/05_OPERATING_PRINCIPLES.md
  - ops/core/06_RUNTIME_RULES.md
- escalation_outcome:
  - PM-level planning proceeded using the repo-actual canonical core set because execution against non-existent files is impossible.
  - This is recorded as a bundle-level escalation note and should be corrected in a follow-up PM maintenance pass if this task is accepted.

## current_state_assessment

- concise_judgment:
  - The ops system is structurally strong but not yet self-enforcing. It has credible control docs, runtime ledgers, task-bundle scaffolding, lane boot files, and benchmark directories, but execution parity is incomplete.
- top_weaknesses_blocking_stronger_autonomy:
  - Docs-to-runtime parity gap:
    - `ops/README.md` documents `ops:doctor`, `ops:status`, `ops:gate`, `ops:task:init`, `ops:guard`, and `ops:preflight`, but those commands are not present in `package.json`.
  - Queue-to-packet integrity gap:
    - several queued tasks are placeholders rather than directly assignable packets, including DEVOPS-P1-001, UX-P1-001, FS-P1-001, and AI-P0-002.
  - Evidence drift:
    - sampled active returns are still empty templates, so `IN PROGRESS` can mean scaffold-only rather than evidenced execution.
  - Decision dependency:
    - FS and GTM remain partially blocked by active decisions in `ops/governance/ACTIVE_DECISIONS.md`, especially D-001 and D-002.
- top_strengths_worth_preserving:
  - Truth hierarchy and anti-drift rules are explicit across the core operating files.
  - Runtime task-bundle structure under `ops/runtime/tasks/` is clean and scalable.
  - Product wedge discipline is clear in `ops/truth/PROJECT.md`, `ops/truth/PRODUCT_DEFINITION.md`, and `ops/truth/CODEBASE_AUDIT.md`.
  - PM and QA roles are clearly separated, which reduces false completion risk if the bundle discipline is enforced.

## proposed_next_task_set

- task:
    task_id: DEVOPS-P1-001
    title: ops enforcement parity for documented runtime controls
    owner_lane: DEVOPS
    task_family: readiness
    priority: P1
    why_now: The system cannot credibly claim evidence-first operation while documented enforcement commands are unrunnable in this checkout.
    dependencies: none
    allowed_paths:
      - package.json
      - scripts/ops/**
      - ops/README.md
      - ops/runtime/README.md
      - ops/runtime/tasks/README.md
      - ops/benchmarks/devops/**
      - ops/runtime/tasks/DEVOPS-P1-001/**
    files_likely_touched:
      - package.json
      - scripts/ops/*
      - ops/README.md
      - ops/runtime/README.md
      - ops/runtime/tasks/README.md
      - ops/benchmarks/devops/readiness_checks.md
    done_when:
      - Every currently documented ops command is either runnable in this repo or removed/reworded from docs.
      - DEVOPS return includes command evidence.
      - QA can verify command/doc parity without inference.
    validation_required:
      - Run each documented ops command after the change.
      - Verify docs and package scripts agree.
      - Verify no blocked paths were changed.
    evidence_required:
      - command outputs or failure outputs for each documented command
      - changed-file list
      - before/after mapping of docs to scripts
    escalation_condition: escalate if implementing parity requires introducing new operating policy rather than codifying existing documented policy
    benchmark_pack: ops/benchmarks/devops/readiness_checks.md
    recommended_gate_level: B

- task:
    task_id: QA-P1-001
    title: complete QA lane contract for evidence-backed task review
    owner_lane: QA
    task_family: validation
    priority: P1
    why_now: No lane should advance autonomy while QA obligations remain partially social rather than artifact-bound.
    dependencies: none for checklist completion; PM decision only if mandatory coverage policy must change
    allowed_paths:
      - ops/agents/QA/**
      - ops/templates/**
      - ops/validation/**
      - ops/benchmarks/qa/**
      - ops/runtime/tasks/QA-P1-001/**
    files_likely_touched:
      - ops/agents/QA/*
      - ops/templates/QA_FINDINGS_TEMPLATE.md
      - ops/validation/*
      - ops/benchmarks/qa/review_checks.md
    done_when:
      - QA contract is explicit enough for a different reviewer to apply without oral context.
      - Verdict criteria map cleanly to the QA gate document.
      - Return evidence and residual risks are required by the resulting template.
    validation_required:
      - Cross-check against packet, return, qa, and decision bundle requirements.
      - Verify QA output shape matches core QA gate rules.
      - Verify residual-risk reporting is mandatory in the template.
    evidence_required:
      - changed-file list
      - checklist diff
      - sample completed review artifact or equivalent review demonstration
    escalation_condition: escalate if completion requires changing PM-owned acceptance policy rather than QA-owned review contract wording
    benchmark_pack: ops/benchmarks/qa/review_checks.md
    recommended_gate_level: B

- task:
    task_id: AI-P0-001
    title: refresh audit-lane contract for evidence-first operator outputs
    owner_lane: AI
    task_family: audit_quality
    priority: P0
    why_now: AI-P0-002 is blocked behind audit-lane tightening, and audit quality directly affects PM trust and QA load.
    dependencies: none
    allowed_paths:
      - ops/agents/AI/**
      - ops/templates/**
      - ops/validation/**
      - ops/benchmarks/ai/**
      - ops/runtime/tasks/AI-P0-001/**
    files_likely_touched:
      - ops/agents/AI/*
      - ops/templates/*
      - ops/validation/*
      - ops/benchmarks/ai/*
    done_when:
      - Audit evidence requirements are explicit.
      - Benchmark references are mandatory in the audit-lane contract.
      - PM and QA can evaluate an audit-lane return without inferring hidden reasoning.
    validation_required:
      - Compare the revised AI contract against QA gate rules and PM review protocol.
      - Verify evidence-trace requirements are explicit and checkable.
      - Verify no blocked paths were changed.
    evidence_required:
      - changed-file list
      - benchmark files referenced
      - sample contract sections showing traceability and residual-risk handling
    escalation_condition: escalate if required audit-lane tightening conflicts with current PM or QA contract language
    benchmark_pack:
      - ops/benchmarks/ai/audit_benchmarks.json
      - ops/benchmarks/ai/audit_benchmarks_extended.json
    recommended_gate_level: B

- task:
    task_id: DATA-P0-001
    title: normalization rule expansion for deterministic data handling
    owner_lane: DATA
    task_family: normalization
    priority: P0
    why_now: Stronger normalization rules reduce false confidence in audits and repository tests.
    dependencies: can run in parallel with QA-P1-001 and AI-P0-001
    allowed_paths:
      - ops/agents/DATA/**
      - ops/templates/**
      - tests/**
      - ops/benchmarks/data/**
      - ops/runtime/tasks/DATA-P0-001/**
    files_likely_touched:
      - ops/agents/DATA/*
      - ops/templates/*
      - tests/*
      - ops/benchmarks/data/*
    done_when:
      - Deterministic normalization rules and uncertainty boundaries are explicit and QA-checkable.
      - Rule wording maps to current repository/data tests where applicable.
    validation_required:
      - Compare contract wording to current repository and data tests.
      - Verify deterministic and uncertainty boundaries are both explicit.
    evidence_required:
      - changed-file list
      - rule coverage table
      - test or fixture references used in reasoning
    escalation_condition: escalate if deterministic rules conflict with current repository assumptions
    benchmark_pack:
      - ops/benchmarks/data/normalization_benchmarks.json
      - ops/benchmarks/data/normalization_benchmarks_extended.json
    recommended_gate_level: B

- task:
    task_id: AI-P0-002
    title: refresh outreach-lane contract after audit-lane tightening
    owner_lane: AI
    task_family: outreach_quality
    priority: P0
    why_now: Valid only after AI-P0-001; current outreach packet is still a placeholder.
    dependencies:
      - AI-P0-001
    allowed_paths:
      - ops/agents/AI/**
      - ops/templates/**
      - ops/validation/**
      - ops/benchmarks/ai/**
      - ops/runtime/tasks/AI-P0-002/**
    files_likely_touched:
      - ops/agents/AI/*
      - ops/templates/*
      - ops/validation/*
      - ops/benchmarks/ai/*
    done_when:
      - Outreach contract is evidence-led, bounded by accepted audit context, and benchmark-referenced.
      - AI-P0-002 becomes directly assignable instead of placeholder-only.
    validation_required:
      - Compare against updated audit-lane contract and QA review rules.
      - Verify audit-to-outreach dependency is explicit.
    evidence_required:
      - changed-file list
      - explicit audit-to-outreach dependency notes
      - benchmark references used
    escalation_condition: escalate if outreach standards require wedge expansion or unsupported operator claims
    benchmark_pack:
      - ops/benchmarks/ai/outreach_benchmarks.json
      - ops/benchmarks/ai/outreach_benchmarks_extended.json
    recommended_gate_level: B

- task:
    task_id: UX-P1-001
    title: operator trust criteria after evidence-trace stabilization
    owner_lane: UX
    task_family: operator_trust
    priority: P1
    why_now: Useful only after evidence-trace structure is stabilized by AI and QA.
    dependencies:
      - AI-P0-001
      - QA-P1-001
    allowed_paths:
      - ops/agents/UX/**
      - ops/templates/**
      - ops/benchmarks/ux/**
      - ops/runtime/tasks/UX-P1-001/**
    files_likely_touched:
      - ops/agents/UX/*
      - ops/templates/*
      - ops/benchmarks/ux/operator_clarity_checks.md
    done_when:
      - UX guidance targets evidence clarity rather than decorative redesign.
      - UX-P1-001 becomes directly assignable instead of placeholder-only.
    validation_required:
      - Compare UX output criteria to product-truth docs and evidence-trace contract.
      - Verify no shell or scope expansion is implied.
    evidence_required:
      - changed-file list
      - checklist showing each UX move improves operator trust rather than surface breadth
    escalation_condition: escalate if UX work implies shell expansion or new product surfaces
    benchmark_pack: ops/benchmarks/ux/operator_clarity_checks.md
    recommended_gate_level: B

## sequencing

- highest_leverage_order:
  - 1. DEVOPS-P1-001
  - 2. QA-P1-001
  - 3. AI-P0-001
  - 4. DATA-P0-001
  - 5. AI-P0-002
  - 6. UX-P1-001
- can_run_in_parallel:
  - DEVOPS-P1-001 and QA-P1-001 can run in parallel.
  - AI-P0-001 and DATA-P0-001 can run in parallel once QA-P1-001 is at least packet-stable.
  - FS-P1-001 and GTM-P1-001 should not be advanced from this bundle because they remain decision-constrained.
- cannot_run_in_parallel_safely:
  - AI-P0-002 should not start before AI-P0-001.
  - UX-P1-001 should not start before both AI-P0-001 and QA-P1-001.
  - Acceptance decisions should not happen before QA artifacts exist and the task bundle is complete.

## assignment_packet_ready_output

### packet_1

task_id: DEVOPS-P1-001
title: ops enforcement parity for documented runtime controls
owner_lane: DEVOPS
priority: P1
gate: B
objective: Make the documented ops enforcement loop real by implementing or reconciling the documented ops commands so PM and QA can rely on executable runtime checks instead of markdown-only claims.
in_scope:
- audit the documented ops command surface in ops docs
- implement missing ops command entrypoints or narrow the docs to match reality
- add minimal runnable scripts for status, doctor, gate, task-init, guard, and preflight if those commands are intended to exist now
- update readiness benchmark references to the implemented command surface
out_of_scope:
- changing product behavior
- adding new runtime policy not already described in ops docs
- broad repo tooling refactors unrelated to ops enforcement
allowed_files:
- package.json
- scripts/ops/**
- ops/README.md
- ops/runtime/README.md
- ops/runtime/tasks/README.md
- ops/benchmarks/devops/**
- ops/runtime/tasks/DEVOPS-P1-001/**
blocked_files:
- apps/**
- packages/**
- ops/truth/**
inputs:
- ops/README.md
- ops/runtime/README.md
- ops/runtime/tasks/README.md
- ops/core/03_ASSIGNMENT_PACKET.md
- ops/core/04_QA_GATE.md
- ops/core/06_RUNTIME_RULES.md
- ops/benchmarks/devops/readiness_checks.md
expected_outputs:
- runnable or explicitly reconciled ops command surface
- updated docs that match the actual command surface
- readiness notes describing what each command verifies
output_contract:
- list every documented ops command inspected
- state whether it was implemented, retained, renamed, or removed
- list files changed
- include command run evidence and any remaining gaps
benchmark_pack:
- ops/benchmarks/devops/readiness_checks.md
validation_steps:
- run each documented ops command after the change
- verify docs and package scripts agree
- verify no blocked paths were changed
blast_radius: low
rollback_plan:
- revert the added or changed scripts and restore prior docs if the command surface becomes unreliable or misleading
done_when:
- every currently documented ops command is either runnable in this repo or removed from the docs
- DEVOPS return includes command evidence
- QA can verify command/doc parity without inference
escalation_condition:
- escalate if implementing parity requires introducing new operating policy rather than codifying existing documented policy

### packet_2

task_id: QA-P1-001
title: complete QA lane contract for evidence-backed task review
owner_lane: QA
priority: P1
gate: B
objective: Finish the QA lane operating contract so review outcomes are repeatable, evidence-backed, and resistant to narrative-only completion claims.
in_scope:
- tighten QA findings template wording
- define explicit PASS, PASS WITH NOTES, FAIL RETURN, and FAIL ESCALATE criteria
- bind residual-risk and next-owner reporting into the QA output contract
- align QA checklist language with packet, return, and decision artifact requirements
out_of_scope:
- changing PM acceptance policy
- editing product code
- inventing new benchmark families
allowed_files:
- ops/agents/QA/**
- ops/templates/**
- ops/validation/**
- ops/benchmarks/qa/**
- ops/runtime/tasks/QA-P1-001/**
blocked_files:
- apps/**
- packages/**
- ops/truth/**
inputs:
- ops/core/03_ASSIGNMENT_PACKET.md
- ops/core/04_QA_GATE.md
- ops/core/06_RUNTIME_RULES.md
- ops/runtime/REVIEW_PROTOCOL.md
- ops/runtime/tasks/README.md
- ops/benchmarks/qa/review_checks.md
expected_outputs:
- packet-ready QA lane contract wording
- tightened QA findings template
- explicit review checklist and verdict criteria
output_contract:
- cite files inspected
- cite changed files
- state exact verdict criteria changed
- include one sample filled review artifact or equivalent review demonstration
benchmark_pack:
- ops/benchmarks/qa/review_checks.md
validation_steps:
- cross-check against packet, return, qa, and decision bundle requirements
- verify QA output shape matches core QA gate rules
- verify residual-risk reporting is mandatory in the template
blast_radius: low
rollback_plan:
- revert QA template or contract wording if it creates ambiguity or review overhead without improving checkability
done_when:
- QA contract is explicit enough for a different reviewer to apply without oral context
- verdict criteria map cleanly to the QA gate document
- return evidence and residual risks are required by the resulting template
escalation_condition:
- escalate if completion requires changing PM-owned acceptance policy rather than QA-owned review contract wording

### packet_3

task_id: AI-P0-001
title: refresh audit-lane contract for evidence-first operator outputs
owner_lane: AI
priority: P0
gate: B
objective: Tighten the AI audit lane contract so audit outputs are explicitly evidence-led, benchmark-referenced, and reviewable by PM and QA without relying on polished prose.
in_scope:
- tighten audit output contract wording
- define required evidence-trace elements for audit outputs
- define benchmark-reference expectations for audit quality work
- align acceptance wording with PM and QA review needs
out_of_scope:
- model changes
- product-code changes
- outreach-lane work
- non-audit UX or shell changes
allowed_files:
- ops/agents/AI/**
- ops/templates/**
- ops/validation/**
- ops/benchmarks/ai/**
- ops/runtime/tasks/AI-P0-001/**
blocked_files:
- apps/**
- packages/**
- ops/truth/**
inputs:
- ops/core/03_ASSIGNMENT_PACKET.md
- ops/core/04_QA_GATE.md
- ops/core/06_RUNTIME_RULES.md
- ops/runtime/REVIEW_PROTOCOL.md
- ops/benchmarks/ai/audit_benchmarks.json
- ops/benchmarks/ai/audit_benchmarks_extended.json
- ops/runtime/tasks/AI-P0-001/packets/AI-P0-001.md
expected_outputs:
- revised AI audit lane contract notes
- explicit audit evidence checklist
- PM and QA reviewable acceptance wording for audit outputs
output_contract:
- list files read
- list changed files
- state benchmark files referenced
- state unresolved risks and tradeoffs
- show how the revised contract prevents narrative-only completion
benchmark_pack:
- ops/benchmarks/ai/audit_benchmarks.json
- ops/benchmarks/ai/audit_benchmarks_extended.json
validation_steps:
- compare the revised AI contract against QA gate rules and PM review protocol
- verify evidence-trace requirements are explicit and checkable
- verify no blocked paths were changed
blast_radius: medium
rollback_plan:
- revert the AI contract changes if they add friction without improving reviewability or benchmark alignment
done_when:
- audit evidence requirements are explicit
- benchmark references are mandatory in the audit-lane contract
- PM and QA can evaluate an audit-lane return without inferring hidden reasoning
escalation_condition:
- escalate if required audit-lane tightening conflicts with current PM or QA contract language
