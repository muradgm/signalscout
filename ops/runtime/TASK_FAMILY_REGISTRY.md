# TASK FAMILY REGISTRY

## Purpose
Measure autonomy and quality by durable work families, not by role labels alone.

## Active task families

| task_family | description | current gate | success signal |
|---|---|---:|---|
| lead_intake | create, normalize, and persist a viable lead record | B | valid lead created without truth conflict |
| snapshot_capture | pull and store the latest usable site snapshot | B | latest snapshot stored with usable contact and page data |
| signal_detection | convert snapshot evidence into a stable signal set | B | signal output matches benchmark expectations |
| audit_generation | produce grounded audit from lead + snapshot + signals | B | audit accepted without major evidence correction |
| outreach_generation | produce reviewable outreach from accepted context | B | outreach accepted or lightly edited |
| outreach_review_send | review, approve, send, and record delivery telemetry | B | no false-success send state and telemetry remains coherent |
| reply_capture | connect inbound replies back to lead/outreach context | B | reply linked correctly with no duplicate confusion |
| territory_candidate_generation | generate candidate businesses for later qualification only | C | candidate set passes provenance, geo, and dedupe checks |

## Rule
No task family moves up a gate because a role appears capable.
A task family moves only when its benchmarks, contract tests, and reviewed runs support promotion.
