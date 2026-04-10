# Lead Prioritization Engine Task Breakdown

## Objective

Build an internal queueing layer that proposes the next best leads to review today, records operator decisions, and improves prioritization quality over time.

This should improve decision quality without expanding SignalScout into a discovery product.

## Delivery Principle

Ship the smallest useful version first:

`candidate supply -> pre-filter -> score / rank -> daily queue -> existing evaluation pipeline -> operator action -> decision trace`

Do not introduce UI, persistence, or broad sourcing until queue quality is stable.

## Workstreams

### 1. Candidate Supply

Goal: get a narrow set of leads into the prioritization engine.

Tasks:

- Define one validation slice for the first pass.
- Reuse existing repo-accessible candidate data or a small seeded list.
- Normalize the input shape so candidates can be evaluated consistently.

Output:

- A deterministic list of candidate leads for scoring.

### 2. Pre-Filter

Goal: reject obviously bad candidates before scoring.

Tasks:

- Reject placeholder or mostly empty websites.
- Reject clear directories, chains, or multi-site brands when the wedge is local practice review.
- Reject candidates with no meaningful contact surface.
- Reject candidates that are clearly outside the target slice.

Output:

- A short rejected set with rejection notes.

### 3. Signal Scoring

Goal: rank the remaining candidates using the existing SignalScout signal logic.

Tasks:

- Reuse current signals for local relevance, trust, booking/contact quality, and content clarity.
- Translate those signals into a queue score.
- Add a small diversity term so the queue does not collapse into only the strongest obvious cases.
- Separate high, medium, and risky candidates.

Output:

- A scored candidate list with confidence bands.

### 4. Queue Assembly

Goal: assemble a daily review queue that is useful to an operator.

Tasks:

- Cap the queue at 10 items.
- Mix strong, medium, and risky candidates intentionally.
- Avoid long runs of very similar leads.
- Attach a concise reason, why-now note, and evidence for each item.

Output:

- A ranked queue that explains why each lead appears.

### 5. Decision Trace and Assessment

Goal: capture what the operator did and make that visible later.

Tasks:

- Record the system recommendation for each queued lead.
- Record the operator final action.
- Record whether the operator edited the draft.
- Record a timestamp and a short delta note when the action differs from the suggestion.

Output:

- A minimal decision trace that can later inform prioritization tuning.

### 6. Validation Surface

Goal: make the queue easy to test against real repo behavior.

Tasks:

- Add regression coverage for the first validation slice.
- Add tests for good leads, borderline leads, and rejects.
- Verify the queue output still aligns with the existing audit/outreach loop.
- Verify the decision trace captures both system recommendation and operator action.

Output:

- A testable prioritization engine with visible failure modes and outcome traces.

## Suggested Implementation Order

1. Add the prioritization module skeleton.
2. Wire in candidate supply.
3. Implement pre-filter rules.
4. Add scoring and confidence bands.
5. Add reasoning and evidence output.
6. Add decision-trace recording.
7. Add regression tests and benchmark fixtures.
8. Run the AI suite and tune thresholds.

## Initial Acceptance Criteria

- The queue returns better candidates than random selection.
- Each item has a specific reason and supporting evidence.
- Obvious bad leads are filtered out before ranking.
- The queue includes a sensible mix of strong and borderline candidates.
- Existing audit/outreach generation still works on queued leads.
- Operator actions can be recorded and compared against system recommendations.

## Immediate Dependencies

- Existing AI signal extraction and generator logic.
- Existing benchmark fixtures and regression test harness.
- Existing real-case repo evidence used for tuning.

## Out Of Scope For Phase 1

- UI work
- persistence or scheduling infrastructure
- public lead discovery features
- broad geographic expansion
- new sourcing pipelines
- automatic learning or weight mutation

## Practical Handoff

If this is implemented in code, keep the first pass narrow:

- one validation slice
- one queue function
- one regression slice
- one decision-trace record

That gives a clean validation loop before any wider rollout.
