# ASSIGNMENT PACKET

## Identity
- task_id: DATA-P0-001
- title: normalization rule expansion for deterministic data handling
- task_family: normalization
- owner_lane: DATA
- priority: P0
- gate: B

## Objective
- objective: expand the normalization rule packet so data work stays deterministic, comparable, and reviewable across imports and operator audits.
- problem: normalization intent exists, but the current task evidence is too thin to verify rule completeness or compare outcomes across datasets.
- reason_this_is_highest_valid_work_now: without a stronger normalization contract, audit findings and repository tests can both pass while data handling still drifts.

## Scope
- in_scope: normalization rules, field-shape expectations, deterministic transformation notes, validation checkpoints.
- out_of_scope: database migrations, production data rewrites, UI changes.
- allowed_files: ops/agents/DATA/**, ops/templates/**, tests/**, ops/runtime/tasks/DATA-P0-001/**
- blocked_files: deployment config, GTM assets, unrelated app code.

## Inputs
- truth_files: project-management.md; tests/**; ops/core/06_RUNTIME_RULES.md
- inputs: current data-oriented tasks, repository contracts, normalization references in ops docs.
- benchmark_pack: benchmark pack B for deterministic data work.
- code_or_data_inputs: existing repository and contract tests.

## Output requirements
- expected_outputs: clearer normalization rule set; deterministic validation language; operator-readable notes on acceptable data transformations.
- output_contract: rules must be explicit enough that QA can tell whether a transformation was valid without guessing intent.
- validation_steps: compare rule wording against repository contract tests and QA evidence expectations.

## Risk controls
- blast_radius: medium
- rollback_plan: revert to prior normalization notes if new rules create false failures or ambiguous obligations.
- escalation_condition: escalate if deterministic normalization rules conflict with existing repository assumptions.
- known_risks: tightening rules too early can lock in the wrong schema assumptions.

## Done when
- done_when:
  - [x] normalization scope is explicit
  - [x] validation expectations are documented
  - [ ] QA confirms the resulting rules are checkable without tribal knowledge
