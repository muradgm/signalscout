# SignalScout Product Definition

Last updated: 2026-04-03

This document defines the intended product shape.

It is not proof of implementation.

Authority order still is:
- codebase
- code-derived audit
- this product definition
- PM interpretation docs

This file should stay honest about three different things:
- the current product wedge
- the current MVP completion bar
- the longer-term target product

---

## 1. Product Thesis

SignalScout exists to help an operator decide whether a local-service business website is a credible outreach target, understand why, and act on that decision with grounded evidence instead of guesswork.

The product is not trying to be:
- a generic CRM
- a generic AI writing tool
- a broad outbound automation platform
- a general analytics suite

The product wedge is narrower:

> Given a lead with a website, determine whether it is worth contacting, explain the reasoning, and produce a usable outreach draft inside one operator workflow.

---

## 2. Current Wedge

The current wedge should stay narrow and explicit.

### Current target operator

- solo operator
- founder-led outbound operator
- internal research or growth operator

This is not currently defined as a team workflow product.

### Current target business type

- local-service businesses with real website content
- appointment-driven or inquiry-driven businesses
- businesses where trust, local relevance, and booking clarity matter

### Current best-fit vertical

Current repo reality is strongest on:
- dental practices
- adjacent clinics or wellness/service businesses only if they behave similarly

This matters because the code and benchmarks are still heavily shaped by dental-language and clinic-style signals. The product definition should not pretend the system is already broad and vertical-agnostic.

---

## 3. Ideal Long-Term Target

The longer-term target can be broader than the current wedge, but it should be described separately from the current product.

### Final target direction

SignalScout should evolve toward:
- a high-trust local-business qualification and outreach workspace
- centered on businesses where website quality, trust, local relevance, and booking/inquiry flow strongly affect conversion

Possible later expansion:
- additional clinic/wellness/service verticals
- deeper outcome feedback and tuning
- stronger execution/reporting around sending and replies

This is direction, not current truth.

---

## 4. Exclusion Criteria

The product should deprioritize or downgrade leads that fall outside the wedge.

### Exclude or downgrade when:

- the lead is a large chain, center brand, or network organization
- the lead appears to be a directory, aggregator, marketplace, or listing page
- the website has too little content to support a grounded read
- the lead has weak local relevance for the intended market
- the contact path is too incomplete to support credible outreach

### Practical poor-fit examples

- large multi-location clinic networks
- franchise-like healthcare or dental brands
- directory/listing pages instead of a real business site
- dead, placeholder, or parked domains
- generic brochure sites with no meaningful booking or inquiry path

These may still be processable by the engine, but they should not define the product around themselves.

---

## 5. MVP Scope

### In Scope

The MVP includes:

- storing and retrieving leads
- extracting website snapshots
- generating structured signals
- generating audits
- generating outreach drafts
- showing all of that in a lead-review workspace
- letting an operator review, edit, and act on drafts

### MVP operator outcome

The operator should be able to:

1. open the lead queue
2. select a lead
3. inspect recommendation and evidence
4. refresh snapshot if needed
5. regenerate audit and outreach if needed
6. edit the outreach draft
7. decide whether the lead should be skipped, held, or sent

### Important MVP note

The MVP is primarily a qualification and recommendation workspace.

Execution surfaces that exist in code beyond that core workflow should not automatically redefine MVP scope unless product explicitly promotes them.

---

## 6. Explicit Non-MVP Scope

These areas remain outside the formal MVP unless intentionally promoted.

### Not MVP

- worker/background execution
- campaigns
- multi-user/auth
- analytics dashboards as a major product chapter
- pricing/commercial site

### Currently implemented but still not formal MVP

These are real in code today, but remain outside the formal MVP definition for now:

- real provider-backed sending
- delivery-event persistence and operator telemetry
- reply persistence and reply surfaces
- reply-processing workflows
- feedback/learning reporting surfaces

Why this distinction exists:
- they are useful and real
- but the product should still be judged first on the qualification/review wedge
- validation breadth is still weaker than product breadth

---

## 7. MVP Completion Bar

The first internal delivery checkpoint is not “the repo looks broad.”

It counts as real only when the core recommendation workflow is credible.

### A. Core dashboard workflow works end to end

An operator can:
- review leads from the queue
- open a lead detail page
- inspect signals, audit, and outreach
- regenerate snapshot, audit, and outreach in the right order
- edit the outreach draft without friction

### B. Recommendation quality is credible

The system behaves credibly across at least:
- good-fit leads
- bad-fit leads
- placeholder or weak-content leads
- messy but valid local leads
- thinner-but-valid leads
- weak-contact boundary leads

### C. Validation is not only synthetic

The completion bar now also requires:
- benchmark-based validation
- some stored-data validation pressure from real repo cases
- honest visibility into what is still only partially validated

### D. Lineage is trustworthy

The product must keep:
- latest snapshot selection correct
- audit linkage correct
- outreach linkage correct
- stale-state behavior clear in the UI

### E. Contact extraction is commercially usable

For good local leads, the contact block should usually recover:
- phone when present
- email when present
- address when reasonably available

and avoid obvious junk values

### F. Tests are honest for the MVP path

The internal delivery bar requires:
- real MVP tests
- dashboard tests for the key workflow
- benchmark-based signal/audit/outreach coverage
- direct regression pressure for the most important current lead slices

It does not require full repo-wide coverage.

### G. Sending is no longer assumed to be mocked

Previous product wording allowed sending to remain mocked.

That is now stale relative to the current system direction.

Current product stance:
- the MVP wedge is still the review workspace
- but sending exists and is part of the current working operator loop
- sending quality and readiness should therefore be described honestly, not as hypothetical

### H. Replys are still not part of MVP signoff

Replies remain outside the MVP signoff bar even though reply plumbing exists.

Reason:
- inbound operational validation is still partial
- the sender domain is not yet reply-capable end to end
- reply workflow depth should not displace the core quality bar

---

## 8. Current Product Decisions

These are the product decisions this document should encode right now.

### Decision 1: Keep the MVP wedge narrow

The core product is still:
- lead review
- evidence inspection
- audit generation
- outreach generation
- operator decision-making

Not:
- campaigns
- broad reply operations
- team workflow
- broad analytics productization

### Decision 2: Treat sending as real but not wedge-defining

Sending is now real enough that the product definition should no longer talk about it as merely mockable.

But it still should not displace the core wedge.

### Decision 3: Keep replies secondary until fully validated

Replies exist.
Replies are useful.
Replies are still not the product center.

### Decision 4: Quality depth is more important than surface breadth

The product should not expand surface area faster than:
- audit quality credibility
- outreach quality credibility
- real-case validation pressure

---

## 9. What This Means For Next Steps

Best next product moves are:

1. keep tightening audit quality against real-case pressure
2. keep tightening outreach quality against real-case pressure
3. deepen the learning loop from stored operator behavior
4. keep the product surface honest while validation catches up
5. validate reply infrastructure later, after the core quality lane is in better shape

---

## 10. Short Version

Current product truth this definition is aiming for:

> SignalScout is a single-operator lead review and outreach recommendation workspace for local-service business websites, currently strongest on dental and adjacent clinic-style leads, with a real queue-to-review-to-send workflow and ongoing quality hardening around audit and outreach credibility.

It is not yet:
- a broad local-business platform
- a campaign system
- a mature reply-operations product
- a team workflow product
- a full analytics platform
