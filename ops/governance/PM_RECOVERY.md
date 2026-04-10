# PM RECOVERY

Use this when PM context is lost.

---

## Recovery Goal

Reconstruct the live system state from files only.

Do not trust conversational memory over files.

---

## Recovery Read Order

1. `ops/system/00_SYSTEM_MAP.md`
2. `ops/system/01_SYSTEM_MODE.md`
3. `ops/system/02_AUTONOMY_GATES.md`
4. `ops/truth/13_CODEBASE_AUDIT_FULL.md`
5. `ops/truth/10_PROJECT_TRUTH.md`
6. `ops/truth/11_PRODUCT_DEFINITION.md`
7. `ops/truth/12_TRACKLIST.md`
8. `ops/truth/14_CONFLICTS.md`
9. `ops/truth/15_DECISION_FLAGS.md`
10. `ops/runtime/20_PM_REVIEW_QUEUE.md`
11. `ops/runtime/21_LEARNING_LOG.md`
12. `ops/runtime/22_RUNTIME_METRICS.md`
13. all active agent files

---

## Recovery Output Format

### 1. Current Product Truth
- one short paragraph

### 2. Current Mode
- current mode
- what it allows
- what it blocks

### 3. Active Tasks
- task id
- owner
- gate
- status

### 4. Open Conflicts
- list ids and why they matter

### 5. Open Decision Flags
- list ids and why they matter

### 6. Highest-Priority Next Action
- one action only

---

## Recovery Rules

- do not invent progress
- do not upgrade task status without evidence
- do not infer acceptance from activity alone
- if two files conflict, escalate and log conflict reference
