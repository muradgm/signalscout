# Territory Lead Generation Concept

Last updated: 2026-04-03

This document explores a future SignalScout capability:

> a user enters a niche and a territory, and SignalScout generates a reviewable set of candidate leads for that market

This is a concept note, not implementation truth.

It is written to stay aligned with the current product wedge instead of drifting into a fake "all businesses in an area" promise.

---

## 1. Refined Product Concept

The naive version of the idea is:

> "Show all available leads in Berlin Mitte within 3km for dentists."

That version is dangerous because it implies:
- market completeness
- Google-Maps-like coverage
- fresh and exhaustive local business indexing
- no missed businesses

SignalScout should not frame the feature that way.

### Better product framing

The stronger, more realistic version is:

> "Generate a qualified local lead set for a niche and territory, then review and act on it."

That means:
- the user defines a target niche
- the user defines a target geography
- SignalScout finds candidate businesses likely to fit
- SignalScout qualifies them using the existing snapshot -> signals -> audit -> outreach workflow
- the operator reviews the resulting set

### Better user prompt shape

Future input could look like:

- niche: `dentists`
- city: `Berlin`
- district / area: `Mitte`
- radius: `3 km`

But the expected output should be described as:

- "candidate leads found"
- "qualified local targets"
- "reviewable lead set"

Not:

- "all leads"
- "all businesses"
- "complete coverage"

---

## 2. Best Future Product Version

If this feature is built well, the experience should be:

### User flow

1. user defines:
   - niche
   - city
   - district / optional area
   - optional radius

2. system generates a candidate set:
   - likely matching businesses in the territory
   - deduplicated
   - chains / directories / junk downgraded or filtered

3. system enriches each candidate:
   - website
   - snapshot
   - contact block
   - signals
   - fit / confidence

4. system prioritizes the set:
   - likely good-fit
   - uncertain / review
   - likely poor-fit

5. operator moves directly into the existing queue/detail workflow:
   - inspect evidence
   - generate audit
   - generate outreach
   - decide skip / hold / send

### Strong product positioning

The best version of this feature is not:
- a search engine
- a maps clone
- a generic lead database

It is:
- territory-based lead generation
- followed immediately by qualification and action

That keeps the discovery feature inside the SignalScout wedge instead of replacing the wedge.

### Best future UX language

Good:
- "Generate candidate leads"
- "Find likely local targets"
- "Build a qualified lead set"

Bad:
- "Find every business"
- "Show all businesses in area"
- "Complete local market coverage"

---

## 3. Data Architecture Needed

To support this feature seriously, SignalScout would need a new discovery layer.

### A. Discovery input model

Need a structured query object like:

- niche
- city
- district / area
- radius
- country
- optional exclusions

Likely future domain:
- `LeadDiscoveryRequest`
- `TerritoryQuery`
- `NicheDefinition`

### B. Source acquisition layer

Need one or more sources for candidate businesses.

Possible source types:
- map/search provider
- business directory provider
- internal imported datasets
- manual CSV / bulk imports

Key rule:
- discovery must be source-backed
- not hallucinated

### C. Geographic normalization

Need:
- city normalization
- district normalization
- geocoding or coordinates
- radius math
- address cleanup

Without that, `Berlin Mitte 3 km` becomes unreliable fast.

### D. Niche classification

Need a niche layer stronger than free text matching.

For example:
- `dentist`
- `orthodontist`
- `implantology clinic`

Otherwise discovery will mix:
- real practices
- directories
- unrelated clinics
- weak category matches

### E. Deduplication and entity resolution

Need:
- duplicate website handling
- duplicate business-name handling
- multi-location chain detection
- same-business multi-source merge logic

Without this, generated lead sets become noisy and lose operator trust.

### F. Discovery-to-core pipeline

Need the new discovery layer to feed the existing core pipeline:

1. discovered candidate
2. canonical lead record
3. snapshot extraction
4. signal derivation
5. qualification
6. audit/outreach generation

That is important because the current product is strongest after the lead already exists.

### G. Discovery status model

Need statuses like:
- discovered
- normalized
- snapshot-ready
- qualified
- rejected
- ready for operator review

That prevents territory generation from becoming one opaque "generate" step.

---

## 4. Risks That Could Kill It

This concept is good, but only if the risks are faced honestly.

### Risk 1: Completeness trap

If you imply "all businesses in this area," users will expect:
- exhaustiveness
- freshness
- zero misses

If the system cannot provide that, trust collapses.

Mitigation:
- promise candidate generation, not full market coverage

### Risk 2: Weak address quality

If addresses are inconsistent or ungeocoded:
- radius filters become fake
- district filtering becomes noisy
- local trust falls apart

Mitigation:
- invest in address normalization and geocoding early

### Risk 3: Weak niche classification

If niche matching is too loose:
- false positives rise
- operators spend time cleaning noise
- the feature becomes a burden rather than leverage

Mitigation:
- use constrained niche taxonomies plus explicit exclusions

### Risk 4: Chains and directories flood the set

Local search/discovery sources naturally surface:
- networks
- brands
- directories
- irrelevant listings

Mitigation:
- filter aggressively using the same exclusion logic already present in SignalScout

### Risk 5: Discovery overwhelms qualification

If discovery becomes the center of the product:
- the current wedge gets diluted
- the system becomes a worse version of a lead database

Mitigation:
- keep discovery as an input into qualification, not the whole product

### Risk 6: Freshness expectations

Users will assume generated leads are:
- current
- accurate
- recently updated

Mitigation:
- show source freshness / confidence / last-checked markers

### Risk 7: Scope explosion

This feature can easily expand into:
- search engine
- CRM
- campaign system
- analytics suite

Mitigation:
- keep the feature narrowly defined as territory-based candidate generation feeding the existing review workflow

---

## 5. Strategic Fit With Current SignalScout

This concept fits SignalScout only if it is treated as:

- discovery feeding qualification

It does not fit if treated as:

- complete market search
- generic lead database
- standalone maps/discovery app

### Why it fits

Current SignalScout already has:
- lead persistence
- snapshot extraction
- contact extraction
- signal logic
- audit generation
- outreach generation
- operator review workflow

That means the product already knows what to do with a lead once it exists.

The missing piece for this concept is:
- how to generate the right candidate leads upstream

### Product principle

The feature should answer:

> "Who should I review in this territory?"

Not:

> "What is every business that exists here?"

---

## 6. Recommended Future Rollout

If this is pursued later, the safest rollout is:

### Phase 1

- niche + city only
- no radius promises yet
- candidate generation only
- operator reviews results manually

### Phase 2

- district / area support
- stronger deduplication
- source confidence and coverage notes

### Phase 3

- true radius support
- better geocoding
- stronger exclusion controls

### Phase 4

- saved territory queries
- repeatable territory refreshes
- optional lead-generation workflows tied into queue review

This progression is safer than jumping straight to "3km radius around Berlin Mitte."

---

## 7. Recommendation

Yes, this concept is worth keeping as a future direction.

But the product should define it as:

> territory-based candidate lead generation for operator review

Not as:

> exhaustive local market search

That distinction is the difference between:
- a realistic extension of SignalScout
- and a product promise that will become expensive and fragile too early
