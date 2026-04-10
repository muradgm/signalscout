# RUNTIME METRICS — P1

## Core rule
Track reliability by task family first.
Agent lanes are still useful diagnostically, but promotion decisions should not depend on lane identity alone.

## Primary metrics
- accepted_runs_by_task_family
- returned_runs_by_task_family
- benchmark_pass_rate_by_task_family
- contract_test_pass_rate_by_task_family
- schema_failures_by_task_family
- truth_conflict_hits_by_task_family
- rollback_cleanliness_by_task_family
- repeated_failure_patterns

## Secondary metrics
- accepted_runs_by_lane
- returned_runs_by_lane
- schema_failures_by_lane
- review_overrides_by_lane

## Current defaults
- all active core task families start at Gate B
- territory_candidate_generation remains at Gate C until provenance, geo normalization, and dedupe checks are passing consistently
- no task family is promoted without recorded runs plus executable checks

## Reporting format

| task_family | gate | reviewed_runs | accepted | returned | benchmark_pass_rate | contract_test_pass_rate | last_failure_pattern |
|---|---:|---:|---:|---:|---:|---:|---|
| lead_intake | B | 0 | 0 | 0 | 0% | 0% | none recorded |
| snapshot_capture | B | 0 | 0 | 0 | 0% | 0% | none recorded |
| signal_detection | B | 0 | 0 | 0 | 0% | 0% | none recorded |
| audit_generation | B | 0 | 0 | 0 | 0% | 0% | none recorded |
| outreach_generation | B | 0 | 0 | 0 | 0% | 0% | none recorded |
| outreach_review_send | B | 0 | 0 | 0 | 0% | 0% | none recorded |
| reply_capture | B | 0 | 0 | 0 | 0% | 0% | none recorded |
| territory_candidate_generation | C | 0 | 0 | 0 | 0% | 0% | human-gated candidate domain |
