# Task Evidence Folders

These folders hold the minimum structured evidence for a meaningful task.

## Required path shape

Each task gets its own folder:

- `ops/runtime/tasks/<TASK_ID>/packets/<TASK_ID>.md` - assignment packet from PM
- `ops/runtime/tasks/<TASK_ID>/returns/<TASK_ID>.md` - structured agent return
- `ops/runtime/tasks/<TASK_ID>/qa/<TASK_ID>.md` - QA findings
- `ops/runtime/tasks/<TASK_ID>/decisions/<TASK_ID>.md` - PM acceptance / return / escalation record

## Fast path

Scaffold a bundle:

```bash
pnpm ops:task:init -- --task=AI-P1-003 --owner=AI --family=audit_quality
```

Validate it:

```bash
pnpm ops:gate -- --task=AI-P1-003
```

## Rule

A task is not acceptance-ready unless all four artifacts exist, the task id matches across them, and the bundle passes `pnpm ops:gate`.
