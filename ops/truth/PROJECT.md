# SignalScout

Last updated: 2026-04-04

This file is derived from:
- repository implementation evidence
- [PRODUCT_DEFINITION.md](C:\Users\Murad\Documents\SS\signalscout\ops\PRODUCT_DEFINITION.md)

It is intentionally split between code reality and product definition.

## 1. What Exists (Code Reality)

### Implemented product flow

Confirmed in source and tests:
1. store and retrieve leads
2. refresh website snapshots
3. derive structured signals
4. generate audits
5. generate outreach drafts
6. review, edit, and send outreach
7. persist delivery events and replies

### Implemented product surface

Confirmed:
- lead queue in the dashboard
- lead detail review workspace
- operator actions for snapshot refresh, audit generation, outreach generation, review, and send
- queue-level reporting panels
- delivery telemetry panels
- reply visibility panels

### Implemented technical shape

Confirmed:
- `apps/api`: Express API
- `apps/dashboard`: React + Vite operator workspace
- `packages/core`: entities, ports, use cases
- `packages/db`: Mongo models, mappers, repositories
- `packages/scraper`: extraction and signal logic
- `packages/ai`: audit/outreach generation logic
- `tests/mvp`: real tests for the core workflow

### What is only partial in code

- audit quality across broader real-world cases, even after a stronger benchmark-hardening pass, a stored-data validation pack, stored-case regression coverage, a first stored-operator-behavior tightening pass, and a broader live multi-specialty real-case pass
- outreach quality across broader real-world cases, even after a stronger benchmark-hardening pass, a stored-data validation pack, stored-case regression coverage, a first stored-operator-behavior tightening pass, and a broader live multi-specialty real-case pass
- reply workflow depth
- reporting depth and validation breadth
- broader product shell outside the lead queue/detail workflow

### What is not implemented in meaningful form

- follow-up workflow
- campaigns
- multi-operator workflow
- auth / identity / permissions
- billing
- background worker / queue subsystem
- generalized email abstraction package
- upstream decision loop / Lead Prioritization Engine

## 2. What MVP Defines (Product Definition)

From [PRODUCT_DEFINITION.md](C:\Users\Murad\Documents\SS\signalscout\ops\PRODUCT_DEFINITION.md), the MVP is defined as:

> a single-operator lead review and outreach recommendation workspace for local-service business websites

### MVP target

The MVP is for:
- a solo or internal operator
- local-service business websites
- leads where website trust, local relevance, and booking/inquiry quality matter

### MVP in-scope

The MVP definition includes:
- storing and retrieving leads
- extracting website snapshots
- generating structured signals
- generating audits
- generating outreach drafts
- showing all of this in a lead-review workspace
- letting an operator review, edit, and locally act on drafts

### MVP success bar

The product-definition document says MVP is only real if:
- the dashboard workflow works end to end
- recommendation quality is credible on benchmark cases
- lineage is trustworthy
- contact extraction is commercially usable
- tests are honest for the MVP path
- sending may still be mocked if that is explicit

### Explicit non-MVP areas

The MVP definition explicitly excludes:
- worker/background execution
- replies
- campaigns
- multi-user/auth
- analytics dashboards
- pricing/commercial site

## 3. Where They Differ (Critical Section)

This section is the most important one.

### Implemented in code, but not MVP-defined core

These exist in code but are explicitly outside MVP in the product definition:
- reply persistence and reply routes
- reply dashboard panels
- real sending through Resend
- delivery-event persistence and webhook-backed telemetry
- feedback/learning reporting surfaces

Implication:
- these should not be treated as the core product wedge just because they are built
- they are extra implemented capability beyond the MVP definition

### Defined in MVP, but still incomplete in implementation quality

These are part of MVP definition, but still not strong enough to call fully complete:
- audit quality across broader real cases, despite stronger benchmark differentiation in the current generator/tests, a compact stored-data validation pack, stored-case regression coverage, and a first stored-operator-behavior tightening pass
- outreach quality across broader real cases, despite stronger benchmark differentiation in the current generator/tests, a compact stored-data validation pack, stored-case regression coverage, and a first stored-operator-behavior tightening pass
- benchmark breadth relative to real-world lead variety
- broader confidence in recommendation quality beyond the current tested set

Implication:
- the core workflow exists
- the core quality bar is still only partially validated

### Product-definition assumption that no longer matches code reality

The product definition says:
- sending may still be mocked

But code reality is:
- sending is real
- delivery webhooks and event persistence are real

Implication:
- the product definition is conservative relative to the codebase
- code reality has moved beyond the MVP definition in execution capability

### Execution capability that has now been partially validated live

Confirmed from a real inbox test:
- outbound sending delivered a real message to a live Gmail inbox
- outbound delivery telemetry recorded provider acceptance and delivery events
- inbound reply processing logic correctly marked the outreach and lead as `replied` when exercised against the live record

Still not confirmed live end to end:
- provider-to-app inbound reply webhook delivery
- a reply-capable sender or `Reply-To` path on the current sending domain

Implication:
- outbound execution capability is stronger than it was previously documented
- inbound reply capability remains only partially validated until the sending domain can actually receive replies and forward them into the provider/app path

### Code reality that exceeds current product surface truth

These exist in code, but should not be mistaken for a broader finished product:
- reply surfaces
- feedback summary
- delivery telemetry

Because:
- secondary dashboard pages are still empty
- broader workflow depth is still thin
- the main real product remains the queue/detail operator loop

## 4. Current Product Truth (intersection of both)

The intersection of code reality and MVP definition is:

> SignalScout is a working internal single-operator lead review workspace for local-service websites, where an operator can review a lead, inspect snapshot-derived signals, generate an audit, generate an outreach draft, edit it, and make an action decision inside the dashboard.

This is the current product truth.

Everything outside that statement is either:
- extra implemented capability
- partial quality work
- or future scope

### What clearly belongs inside current product truth

- lead queue
- lead detail review
- snapshot refresh
- signals
- audit generation
- outreach generation/regeneration
- draft editing
- accepted/edited/skipped review actions

### What exists but is not core current product truth

- replies
- sending
- delivery telemetry
- learning/feedback reporting

These are real, but they are not the cleanest definition of the product wedge.

## 5. Implementation vs MVP Alignment

| Area | Implementation | MVP Status | Alignment | Action |
| --- | --- | --- | --- | --- |
| Lead workflow | Done | MVP | Aligned | Continue |
| Audit quality | Partial | MVP | Critical Gap | PRIORITIZE |
| Outreach quality | Partial | MVP | Critical Gap | PRIORITIZE |
| Replies | Partial | NOT MVP | Mismatch | DEFER or PROMOTE |
| Sending | Done | Not required | Overbuilt | Optional |
| Dashboard extra pages | Missing | Not required | Misleading | REMOVE or BUILD |

### Alignment rules

- `Aligned` = safe to continue
- `Critical Gap` = must be fixed before expansion
- `Mismatch` = requires product decision
- `Misleading` = must be cleaned

## 6. Task Board (based on implementation reality)

### Done

- Lead domain and persistence
- Snapshot domain and persistence
- Signal model and rule-based detection
- Audit domain and generation
- Outreach domain and generation
- Outreach regeneration variants
- Persisted outreach review actions
- Dashboard lead queue
- Dashboard lead detail workflow
- API validation for live MVP surface
- Real sending via Resend
- Delivery-event persistence
- Reply persistence and basic reply surfaces
- Removal of misleading worker/queue/email scaffolding

### Partial

- Audit quality across broader real cases, after a stronger benchmark-hardening pass, a stored-data validation pack, stored-case regression coverage, and a first stored-operator-behavior tightening pass
- Outreach quality across broader real cases, after a stronger benchmark-hardening pass, a stored-data validation pack, stored-case regression coverage, and a first stored-operator-behavior tightening pass
- Reply workflow depth, with real inbound replies currently blocked by sender-domain mail routing
- Reporting depth and long-term architecture
- Delivery/readiness validation breadth, though outbound send and delivery telemetry now have one live validation pass
- Broader dashboard shell beyond queue/detail

### Next

- Expand real validation breadth for outreach quality
- Continue audit validation from the stricter benchmark baseline
- Deepen reply validation and workflow confidence
- Either build or remove empty secondary dashboard pages
- Keep reporting complexity contained and validated as the learning summary grows
- Keep broader real-case tuning anchored in live repo evidence, especially multi-specialty and multilingual cases

### Later

- Follow-up workflow
- Campaign workflow
- Multi-operator support
- Background execution if it becomes a real product need
- Generalized email abstraction if provider breadth becomes necessary
- Reply-capable sender-domain infrastructure after current P0 quality gaps are reduced
- Lead Prioritization Engine / internal decision loop, documented in `docs/product/daily-queue-generator-spec.md` and `docs/engineering/daily-queue-generator-task-breakdown.md`

## 7. Priority Levels

### P0 - Core survival

These must work credibly for the product to meaningfully exist:
- audit quality validation
- outreach quality validation

### P1 - Strengthening core quality

These strengthen the working product without redefining it:
- reporting validation depth
- UX clarity in the lead detail workflow
- reply validation if replies remain in the product surface
- removal or build-out of misleading empty dashboard pages

### P2 - Supporting systems

These support the product, but are not the center of the current wedge:
- reply workflow depth
- broader reporting sophistication
- stronger outcome tracking around delivery and replies

### P3 - Optional / experimental / non-MVP

These should not drive near-term execution:
- campaigns
- multi-operator support
- background execution
- generalized email abstraction

## 8. Next Decisions Required (resolve mismatches)

These are not coding tasks only. They are product-clarity decisions.

### Decision 1: Update MVP definition or keep it conservative

Mismatch:
- code has real sending, delivery telemetry, and reply surfaces
- MVP definition still treats sending as mockable and replies as non-MVP

Decision needed:
- either promote sending into the formal MVP definition
- or keep it outside MVP and treat it as extra capability

### Decision 2: Decide whether replies are a real product chapter

Mismatch:
- replies are implemented
- replies are explicitly outside MVP

Decision needed:
- either deepen and validate replies as a real feature
- or keep them explicitly secondary and do not let them shape roadmap priorities

### Decision 3: Decide what to do with empty secondary dashboard pages

Mismatch:
- repo structure suggests broader app breadth
- code reality only supports the lead queue/detail workflow

Decision needed:
- either build those pages
- or remove them to keep product truth clean

### Decision 4: Decide whether current next work is quality or breadth

Current repo truth says:
- breadth is already ahead of validation

Decision needed:
- prioritize validation and quality depth
- do not expand product breadth unless that is an explicit strategic choice

## 9. Agent Execution Rule

### Critical rule

Agents must NOT:
- prioritize features marked as non-MVP
- expand product surface when validation is weak
- work on `Partial` areas if a `Critical Gap` exists in the same product layer

If conflict exists:
- escalate to PM
- do not proceed autonomously



## Required Product Decisions

1. Replies:
   - Option A: Promote to MVP → invest
   - Option B: Keep out of MVP → freeze improvements
   - Option C: Remove → delete code

2. Empty dashboard pages:
   - Build OR remove (no middle state allowed)

3. Sending:
   - Treat as core OR keep as optional capability
