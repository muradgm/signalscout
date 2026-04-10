# ASSIGNMENT PACKET

## TASK ID
PM-P1-HEALTHCHECK

## TASK TYPE
project_health_audit

## OBJECTIVE
Perform a grounded project-wide health audit to determine whether the current repository, ops system, and active implementation state are aligned with the intended product vision and execution standards.

Your job is not to implement fixes.

Your job is to:
- inspect the project realistically
- identify what is healthy
- identify what is weak, broken, missing, or drifting
- assess build / test / operational confidence
- compare current reality against the intended product direction
- produce a prioritized task plan that closes the highest-risk gaps

## OWNER LANE
PM

## SCOPE

In scope:
- inspect project structure and architecture consistency
- inspect ops system health and task protocol discipline
- inspect runtime / bootstrap / task bundle flow
- inspect current implementation progress against product truth
- inspect test/build/deployment confidence signals
- inspect major blockers, drift, duplication, weak patterns, and risk hotspots
- identify missing decisions blocking execution
- identify gaps between product vision and actual current state
- produce a realistic prioritized next-task plan

Out of scope:
- specialist implementation work
- rewriting product scope
- pretending certainty where evidence is weak
- generic roadmap fluff
- making unsupported claims about code quality without evidence

## AUTHORITATIVE FILES

### Core ops
- ops/core/00_SYSTEM_OVERVIEW.md
- ops/core/01_OPERATING_MODEL.md
- ops/core/02_TASK_LIFECYCLE.md
- ops/core/03_ASSIGNMENT_PACKET.md
- ops/core/04_QA_GATE.md
- ops/core/05_OPERATING_PRINCIPLES.md
- ops/core/06_RUNTIME_RULES.md
- ops/core/TASK_BUNDLE_PROTOCOL.md

### PM lane
- ops/agents/PM/PM_AGENT.md
- ops/agents/PM/PM_PROMPT_SYSTEM.md
- ops/agents/PM/PM_VALIDATION_RULES.md

### Project truth
- ops/truth/PROJECT.md
- ops/truth/PRODUCT_DEFINITION.md
- ops/truth/CODEBASE_AUDIT.md
- ops/truth/TRACKLIST.md
- ops/governance/ACTIVE_DECISIONS.md

### Runtime / tasks
- ops/runtime/
- ops/runtime/tasks/

### Project implementation surfaces
- apps/
- packages/
- scripts/
- docs/ (if relevant)

## CONTEXT

The goal is to make the project execution system and product delivery more trustworthy.

The audit must focus on:
- whether the project can realistically move forward safely
- whether the ops system is helping or slowing execution
- whether current code and workflows support the intended product direction

Avoid:
- generic encouragement
- empty confidence
- vague “looks good overall” language

Be specific and evidence-based.

## REQUIRED OUTPUT

Write your audit to:

ops/runtime/tasks/PM-P1-HEALTHCHECK/return.md

Your return must include:

### 1. Current project health summary
- overall confidence level (high / medium / low)
- current maturity stage
- biggest strengths
- biggest risks

### 2. Product reality vs vision
- what parts of the intended product are already well supported
- what parts are still weak / missing / blocked
- where execution is drifting from product truth

### 3. Ops system audit
- task protocol quality
- lane discipline quality
- task artifact quality
- runtime / bootstrap / handoff quality
- major friction points

### 4. Technical confidence audit
- build confidence
- test confidence
- deployment confidence
- architecture health
- code quality hotspots

### 5. Top risks / blockers
List:
- blocker
- why it matters
- impact level
- recommended owner lane

### 6. Highest-value next tasks
For each:
- task id
- owner lane
- objective
- why now
- dependencies
- allowed paths
- done-when
- validation requirements
- evidence required
- gate level

### 7. Strategic recommendation
Answer:
- Is the project realistically on track?
- What must be fixed first?
- What should be protected and not disrupted?

## CONSTRAINTS

- do not implement fixes
- do not perform shallow repo theatre
- do not claim something was verified unless it was actually inspected
- do not hide uncertainty
- do not inflate confidence
- prefer hard truths over comfort
- prefer smallest valid next tasks over broad plans

## VALIDATION

Audit is acceptable only if:
- findings are grounded in inspected files / systems
- risks are specific
- blockers are prioritized realistically
- next tasks are directly assignable
- no major project surface is ignored

## REQUIRED EVIDENCE

Your return must include:
- key files / systems inspected
- evidence basis for conclusions
- explicit uncertainty areas
- specific next-task recommendations

## ESCALATION CONDITION

Escalate if:
- core truth files conflict materially
- runtime / task protocol is too inconsistent to trust
- critical product direction is unclear
- technical access is insufficient for a reliable audit

## PRIORITY
P1

## GATE LEVEL
A