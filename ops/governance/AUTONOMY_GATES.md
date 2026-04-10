# AUTONOMY GATES — V3

## Gate A — bounded auto-execution
Agent may execute without prior approval only for a named task family already promoted by PM and recorded in runtime metrics.

Requirements:
- >= 5 reviewed runs
- >= 90% benchmark pass rate
- >= 85% PM acceptance rate
- no open conflict touching the lane
- no user-visible policy change

## Gate B — execute then review
Default for all agent lanes.
Agent may execute only from an assignment packet.
QA review is mandatory before PM acceptance.

## Gate C — analysis only, human decision required
Triggered by:
- scope change
- deletion with product-surface implications
- positioning changes
- trust-sensitive sending changes
- data-model changes that affect operator interpretation

## Gate D — frozen lane
If a lane repeatedly fails, PM may freeze it.
Frozen means:
- no new execution in that lane
- only diagnosis, benchmark repair, or truth cleanup allowed

## Regression policy
One critical failure can demote A -> B.
Two repeated critical failures in a 10-run window can demote B -> D for that task family until PM repairs the lane.
