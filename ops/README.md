# Ops Directory Guide

This `ops/` tree is organized into distinct layers.

Reusable operating-system assets in `ops/` are versioned with the repo.
Volatile runtime state stays local-only by design.

## Layout

- `core/` - mandatory boot sequence and execution rules
- `governance/` - PM authority, QA gate, conflicts, and decision control
- `truth/` - project reality, product definition, tracklist, and concept notes
- `runtime/` - bootstrap docs plus local runtime ledgers and task evidence
- `agents/` - one folder per role with its operating contract and role assets
- `templates/` - reusable task, review, and decision templates
- `contracts/` - JSON output contracts for structured agent returns
- `validation/` - cross-agent validation rules
- `benchmarks/` - benchmark packs by lane

## Naming rule

Only files in `core/` are numbered. Everything else is named by purpose, not by arbitrary order.

## Bootstrap chats

Use the files in `ops/runtime/bootstrap/` to initialize one dedicated chat per lane: `PM`, `QA`, `AI`, `DATA`, `UX`, `FS`, `DEVOPS`, and `GTM`. Each chat should load its matching `*_BOOT.md` file and then wait for an assignment packet before doing meaningful work.

## What is tracked vs local-only

Tracked with the repo:
- `ops/core/`
- `ops/governance/`
- `ops/truth/`
- `ops/agents/`
- `ops/templates/`
- `ops/contracts/`
- `ops/validation/`
- `ops/benchmarks/`
- `ops/runtime/bootstrap/`
- runtime guide files such as `ops/runtime/README.md`

Kept local-only:
- live runtime ledgers such as `ops/runtime/STATUS_SNAPSHOT.md`
- local review queues and scoreboards
- task evidence folders under `ops/runtime/tasks/`, except the tracked README

This keeps the operating model reproducible without forcing one machine's transient runtime state into Git.

## Beast mode enforcement

Run this first:

```bash
pnpm ops:doctor
```

This checks:
- packet / return / QA template completeness
- PM runtime queue state validity
- task bundle scaffold shape
- repo hygiene risks that weaken reproducibility

Create a task bundle scaffold before assigning meaningful work:

```bash
pnpm ops:task:init -- --task=AI-P1-003 --owner=AI --family=audit_quality --gate=B --priority=P1
```

Validate a task bundle either by task id:

```bash
pnpm ops:gate -- --task=AI-P1-003
```

Or by explicit paths:

```bash
pnpm ops:gate -- \
  --packet=ops/runtime/tasks/AI-P1-003/packets/AI-P1-003.md \
  --return=ops/runtime/tasks/AI-P1-003/returns/AI-P1-003.md \
  --qa=ops/runtime/tasks/AI-P1-003/qa/AI-P1-003.md \
  --decision=ops/runtime/tasks/AI-P1-003/decisions/AI-P1-003.md
```

For local enforcement before a serious review pass:

```bash
pnpm ops:guard
```

That does more than a smoke check. It runs:
- `ops:doctor`
- queue-to-bundle enforcement
- material-population checks for active and returned-review tasks
- gate checks for acceptance-near tasks, not already accepted historical bundles
- the current P1 contract tests

Before contract tests are treated as meaningful, verify the required package builds exist:

```bash
pnpm ops:preflight
```

If preflight fails in a clean checkout, the intended path is:

```bash
pnpm install --frozen-lockfile
pnpm build:p1
```

A task should not be treated as accepted until:
- `ops:doctor` passes
- the task bundle passes `ops:gate`
- the runtime ledgers have been updated
- PM and QA statuses match the evidence, not the narrative
