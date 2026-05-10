# ASSIGNMENT PACKET SPEC

Every meaningful task must include the following fields.

## Required fields

- task_id
- title
- owner_lane
- priority
- gate
- objective
- in_scope
- out_of_scope
- allowed_files
- blocked_files
- inputs
- expected_outputs
- output_contract
- benchmark_pack
- validation_steps
- blast_radius
- rollback_plan
- done_when
- escalation_condition

## Rules

- If `allowed_files` is vague, the packet is invalid.
- If `done_when` is not testable, the packet is weak.
- If there is no rollback plan for operator-visible change, the packet is incomplete.
- If benchmark and validation are omitted for a quality-sensitive lane, PM must not assign the task.

## Minimum bar

The packet must make it obvious:
- what the agent is allowed to touch
- what success means
- how failure will be detected
- how the change can be rolled back
