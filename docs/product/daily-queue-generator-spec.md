# Lead Prioritization Engine Spec

## Purpose

Propose a small ranked set of local-business leads worth reviewing today, capture what the operator does with those leads, and improve prioritization quality over time.

This is an internal decision-loop layer, not a discovery product.

## Product Framing

SignalScout already answers:

- Is this lead worth contacting?
- Why?
- What should we do next?

The Lead Prioritization Engine adds the missing upstream step:

- Which leads should be reviewed first today?

The feature exists to improve decision quality over time by prioritizing reviewable leads and recording operator outcomes.

## Loop Model

The product loop is:

- suggestions: what the system proposes for review
- actions: what the operator does with those proposals
- assessment: what the system records and later uses to refine prioritization

Assessment is observation first. Learning comes later.

## Non-Goals

- No broad lead discovery product.
- No map or geographic exploration UI.
- No public-facing lead marketplace.
- No new reply, sending, or delivery infrastructure.
- No expansion beyond the current MVP wedge.

## Optional Inputs

The first version can accept light constraints, but they are optional:

- niche
- city

These inputs only narrow the suggestion set. They do not turn the feature into a discovery system.

## Placement In The Workflow

The prioritization engine should sit before the existing SignalScout decision flow.

```text
candidate supply -> pre-filter -> score / rank -> daily queue -> existing evaluation pipeline -> operator action -> outcome record
```

The queue should feed the current engine, not replace it.

## Proposed APIs

```ts
generateSuggestedLeads({
  niche,
  city,
  limit = 10,
}: {
  niche?: string;
  city?: string;
  limit?: number;
}): Promise<SuggestedLead[]>
```

```ts
recordQueueOutcome({
  queueId,
  leadId,
  systemRecommendation,
  operatorAction,
  edited,
  timestamp,
}: {
  queueId: string;
  leadId: string;
  systemRecommendation: 'high' | 'medium' | 'risky';
  operatorAction: 'accepted' | 'edited' | 'skipped' | 'do_not_send';
  edited: boolean;
  timestamp: string;
}): Promise<void>
```

## Suggested Lead Shape

```ts
type SuggestedLead = {
  leadId: string;
  companyName: string;
  city: string;
  niche: string;
  confidence: 'high' | 'medium' | 'risky';
  score: number;
  reason: string;
  whyNow: string;
  evidence: string[];
  rejectionNotes?: string[];
};
```

## Candidate Supply

- Start with a narrow, known set of source leads already available in the repo or via seeded inputs.
- Keep the first version constrained to one validation slice.
- Do not broaden supply until queue quality is stable.

The feature is not responsible for building a broad discovery surface. It only ranks what is already available to the operator.

## Pre-Filter Rules

Reject obvious bad candidates before ranking:

- No real website or only placeholder content.
- Clear chain, directory, or multi-site brand when the target wedge is local-practice outreach.
- No meaningful contact surface.
- Too little visible content to evaluate.
- Clear mismatch with the requested niche or city.

## Scoring Model

The engine should reuse the current SignalScout signal system in reverse: rank candidates by how likely they are to produce a useful decision.

Suggested scoring dimensions:

- Local relevance
- Trust signal strength
- Contact surface quality
- Non-placeholder content
- Non-chain / non-directory fit
- Specialty or niche clarity
- Outreach plausibility
- Decision diversity / learning signal

Suggested bands:

- `80-100`: high confidence
- `55-79`: medium confidence
- `<55`: risky, only include for diversity

## Queue Composition

- Return at most 10 leads.
- Mix the queue intentionally:
  - 5 high confidence
  - 3 medium confidence
  - 2 risky but plausible
- Avoid ten near-identical clinics.

The mix matters because the queue should maximize correct decisions over time, not just rank the obvious cases.

## Reasoning Requirements

Each result must explain:

- Why the lead made the queue.
- Why it is worth review now.
- What evidence supported the selection.
- Why it was not obviously rejected.

Reason examples:

- Strong local presence with a direct contact path.
- Good site content, but booking clarity is weaker than the strongest candidates.
- Specialty-specific practice with enough content to support a grounded review.

## Assessment Recording

For each queued lead, record:

- the system recommendation
- the operator final action
- whether the operator edited the draft
- a timestamp
- a short note when the operator action differed from the suggestion

The point is not to auto-learn immediately. The point is to create a decision trace that can later refine prioritization.

## Rejection Visibility

For internal validation, also output a small rejected sample.

- 10-20 rejected leads
- rejection reason
- main rejection class

This makes the queue easier to trust and tune.

## Validation Strategy

Start with manual validation only:

1. Generate 10 suggested leads for one validation slice.
2. Run the existing evaluation pipeline on those leads.
3. Compare queue quality against operator review outcomes.
4. Review the decision trace for repeated patterns before changing priorities.
5. Tune scoring before any UI work.

## Acceptance Criteria

The feature is good enough when:

- Suggested leads are clearly better than random selection.
- Reasons are specific, not generic.
- The queue contains a sensible mix of strong and borderline cases.
- The existing audit/outreach pipeline still performs well on the selected leads.
- Rejected leads are understandable and consistently filtered.
- Operator actions can be recorded and compared against system recommendations.

## First Build Scope

Phase 1 should include:

- Internal generator function
- Scoring helper
- Reason and evidence output
- Queue log or decision-trace record
- Small test fixture set
- No UI
- No persistence layer
- No new infrastructure

## Recommended Naming

- Feature name: `Lead Prioritization Engine`
- Internal API name: `generateSuggestedLeads`
- Output concept: `today's review queue`
- Outcome record concept: `decision trace`

## Summary

This feature fits SignalScout as an upstream decision loop.
It should help operators focus on the next best leads, capture what they do with those leads, and improve prioritization quality over time without expanding into a broad discovery product.
