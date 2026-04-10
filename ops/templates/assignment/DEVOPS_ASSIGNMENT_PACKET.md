# ASSIGNMENT PACKET

## TASK ID
[DEVOPS-P1-001]

## TASK TYPE
infra_reliability

## OBJECTIVE
Improve operational reliability, deployment safety, build reproducibility, environment discipline, or system observability within the assigned infrastructure scope. Deliver concrete changes that reduce fragility and are validated with explicit evidence.

## OWNER LANE
DEVOPS

## SCOPE
In scope:
- CI/CD workflows
- build/release reliability
- environment handling and documentation
- operational scripts
- deployment safety
- observability/health checks
- reproducibility improvements
- runtime guardrails and preflight automation if explicitly assigned

Out of scope:
- product feature implementation
- UX redesign
- GTM strategy or messaging
- architecture rewrites outside infra scope
- tool sprawl without a clear reliability benefit
- adding complexity without operational justification

## AUTHORITATIVE FILES
- task bundle assignment file
- CI configuration
- deployment configuration
- package/workspace manifests
- scripts/
- environment docs
- ops/runtime and enforcement files if explicitly in scope
- healthcheck/runbook/config files referenced by the assignment
- task-specific decision artifacts if referenced

## CONTEXT
You are the DEVOPS lane. Your job is to reduce operational risk and make the system more trustworthy to run, build, deploy, and maintain. Do not add infrastructure theater. If you cannot validate a change because of external access limits, secrets, or environment gaps, escalate clearly.

## REQUIRED OUTPUT
You must produce all of the following:
- the requested infra/config/script changes
- clear statement of the risk reduced or problem addressed
- validation evidence
- rollback notes if applicable
- a structured return artifact written to the assigned task bundle return file

## CONSTRAINTS
- do not introduce tools or services without strong justification
- do not hide reliance on unavailable secrets or external platform access
- do not mark work complete without real validation
- do not change unrelated project surfaces
- do not optimize sophistication over maintainability
- preserve a workflow that remains operable by the project owner

## ALLOWED PATHS
- .github/
- scripts/
- infra/
- deployment-related directories
- workspace/package configuration files
- docs/ only if required by the task
- task bundle files for the active task only

## FILES LIKELY TOUCHED
- list exact config/script paths before execution if possible
- if unknown at start, record actual changed files in the return artifact

## DONE WHEN
The task is done only when:
- the targeted operational issue has been materially improved
- the configuration or script changes are present
- the relevant validation has been executed
- residual risks are disclosed
- rollback or caution notes are included where needed
- the structured return artifact is written to the required task file

## VALIDATION
Validation must include:
- relevant install/build/check/preflight/workflow verification commands
- syntax or config validation where applicable
- explicit record of what was verified successfully and what could not be verified
- documentation of any blocked validation caused by missing access, secrets, or environment limitations

## REQUIRED EVIDENCE
The return artifact must include:
- files read
- files changed
- summary of infra/ops change
- commands run
- validation evidence
- before/after operational impact
- unresolved issues
- risks
- rollback notes if applicable
- completion status

## ESCALATION CONDITION
Escalate immediately if:
- required secrets or platform access are unavailable
- the environment state prevents trustworthy validation
- the requested fix requires broader architecture or application changes beyond scope
- authoritative files conflict materially
- the task would create disproportionate complexity or cost relative to the benefit

## BENCHMARK PACK
Use only if explicitly specified in the assignment packet.

## PRIORITY
[P1]

## GATE LEVEL
[B]