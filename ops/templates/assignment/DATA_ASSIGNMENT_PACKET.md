# ASSIGNMENT PACKET

## TASK ID
[DATA-P1-001]

## TASK TYPE
data_design_analysis

## OBJECTIVE
Design, validate, improve, or analyze the assigned data surface so that it becomes trustworthy and decision-useful. Deliver concrete outputs grounded in source data, explicit definitions, and clear evidence of quality or limitations.

## OWNER LANE
DATA

## SCOPE
In scope:
- dataset validation
- schema review or design
- metric definitions
- analytics/event taxonomy
- data transformation logic
- quality checks
- reporting/analysis required by the assignment
- identification of gaps, inconsistencies, and confidence limits

Out of scope:
- unsupported business claims
- GTM messaging
- frontend/backend feature implementation outside explicit data scope
- vague “insights” without source grounding
- redefining product behavior unless explicitly required for metric meaning and escalated appropriately

## AUTHORITATIVE FILES
- task bundle assignment file
- relevant datasets
- schemas
- analytics docs
- event tracking docs
- reporting/query files
- product/spec files only where required to define metric meaning
- task-specific decision artifacts if referenced

## CONTEXT
You are the DATA lane. Your job is to make data trustworthy and useful for decision-making. You must name uncertainty clearly, define metrics precisely, and avoid implying confidence the source data does not support.

## REQUIRED OUTPUT
You must produce all of the following:
- the requested data artifact, analysis, schema, or definition set
- explicit statement of source inputs used
- explicit statement of gaps or limitations
- validation or quality-check evidence
- a structured return artifact written to the assigned task bundle return file

## CONSTRAINTS
- do not use ambiguous metric names
- do not make unverified assumptions silently
- do not hide nulls, gaps, contradictions, or confidence limits
- do not present partial source coverage as complete truth
- do not expand beyond the assigned data problem
- do not claim causality or certainty not supported by evidence

## ALLOWED PATHS
- data/
- analytics/
- schemas/
- scripts/ if data-processing scripts are explicitly required
- docs/
- task bundle files for the active task only

## FILES LIKELY TOUCHED
- list exact dataset/schema/docs/scripts before execution if possible
- if unknown at start, record actual changed files in the return artifact

## DONE WHEN
The task is done only when:
- the requested data deliverable is complete
- metric or schema definitions are explicit and unambiguous
- data quality checks or source limitations are documented
- outputs are usable by downstream lanes or decision-makers
- the structured return artifact is written to the required task file

## VALIDATION
Validation must include:
- schema consistency checks where relevant
- sample query or transformation checks where relevant
- explicit confirmation of field meaning and source boundaries
- documentation of missing data, contradictions, or unresolved confidence issues

## REQUIRED EVIDENCE
The return artifact must include:
- files read
- files changed if any
- source inputs used
- transformations or definitions produced
- quality checks performed
- known limitations
- unresolved issues
- risks
- recommended next action
- completion status

## ESCALATION CONDITION
Escalate immediately if:
- source data is incomplete, contradictory, or inaccessible
- metric meaning depends on undefined product behavior
- the requested analysis cannot be completed reliably from available inputs
- authoritative files conflict materially
- the task requires decisions outside the DATA lane

## BENCHMARK PACK
Use only if explicitly specified in the assignment packet.

## PRIORITY
[P1]

## GATE LEVEL
[A]