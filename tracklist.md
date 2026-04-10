# SignalScout - Task Tracklist

Last updated: 2026-04-04

This tracklist is derived from repository evidence only.

It does not assume live validation unless that validation is encoded in tests or persisted artifacts.

## Status Legend

- `Done` = clearly implemented and evidenced in source and/or tests
- `Partial` = meaningful work exists, but the area is incomplete, thin, or not reliable enough to call finished
- `Next` = best near-term execution target based on current repo state
- `Later` = valid future work, but not the best next move now

---

## Phase 0 - Foundation and Direction `Done`

### Product definition - `Done`

Evidence:
- [product-definition.md](C:\Users\Murad\Documents\SS\signalscout\ops\product-definition.md)

Confirmed:
- ICP and exclusions are documented
- MVP and non-MVP boundaries are explicit
- internal delivery checkpoint is defined

### Architecture definition - `Done`

Evidence:
- workspace split across `apps/*` and `packages/*`
- core ports/use-cases in [packages/core/src](C:\Users\Murad\Documents\SS\signalscout\packages\core\src)

Confirmed:
- domain, persistence, scraper, AI, API, and dashboard boundaries exist

### Workspace/tooling setup - `Done`

Evidence:
- [package.json](C:\Users\Murad\Documents\SS\signalscout\package.json)
- [pnpm-workspace.yaml](C:\Users\Murad\Documents\SS\signalscout\pnpm-workspace.yaml)
- [turbo.json](C:\Users\Murad\Documents\SS\signalscout\turbo.json)

Confirmed:
- monorepo tooling is in place
- build/lint/typecheck/test scripts exist across the main packages

---

## Phase 1 - Core Domain and Data Model `Done`

### Lead domain - `Done`

Evidence:
- [Lead.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\leads\entities\Lead.ts)
- [LeadRepository.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\leads\ports\LeadRepository.ts)
- [MongoLeadRepository.ts](C:\Users\Murad\Documents\SS\signalscout\packages\db\src\repositories\MongoLeadRepository.ts)
- [leads.routes.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules\leads\leads.routes.ts)

### Snapshot domain - `Done`

Evidence:
- [LeadSnapshot.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\leads\entities\LeadSnapshot.ts)
- [LeadSnapshotRepository.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\leads\ports\LeadSnapshotRepository.ts)
- [MongoLeadSnapshotRepository.ts](C:\Users\Murad\Documents\SS\signalscout\packages\db\src\repositories\MongoLeadSnapshotRepository.ts)

### API contracts and validation - `Done`

Evidence:
- route schemas under [apps/api/src/modules](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules)
- [api-boundary.test.mjs](C:\Users\Murad\Documents\SS\signalscout\tests\mvp\api-boundary.test.mjs)

---

## Phase 2 - Scraping and Extraction Engine `Done`

### HTML retrieval - `Done`

Evidence:
- scraper package exists and is wired into snapshot refresh
- encoding and fetch logic lives under [packages/scraper/src](C:\Users\Murad\Documents\SS\signalscout\packages\scraper\src)

### Snapshot construction - `Done`

Evidence:
- title/meta/text/contact/booking extraction paths in scraper package
- snapshot entity and mapper support these fields

### Contact extraction hardening - `Done`

Evidence:
- [extractContactInfo.ts](C:\Users\Murad\Documents\SS\signalscout\packages\scraper\src\extract\extractContactInfo.ts)
- [provider-extractors.test.mjs](C:\Users\Murad\Documents\SS\signalscout\tests\mvp\provider-extractors.test.mjs)

Confirmed:
- email/phone/address extraction exists
- official-site enrichment exists
- guarded external fallback exists

### Trust signal extraction - `Done`

Evidence:
- [extractTrustSignals.ts](C:\Users\Murad\Documents\SS\signalscout\packages\scraper\src\extract\extractTrustSignals.ts)
- trust assertions in benchmark and signal tests

---

## Phase 3 - Signal Intelligence Layer `Partial`

### Signal model - `Done`

Evidence:
- [SignalSet.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\signals\entities\SignalSet.ts)

### Rule-based detector - `Done`

Evidence:
- [RuleBasedSignalDetector.ts](C:\Users\Murad\Documents\SS\signalscout\packages\scraper\src\adapters\RuleBasedSignalDetector.ts)
- [signals.test.mjs](C:\Users\Murad\Documents\SS\signalscout\tests\mvp\signals.test.mjs)

### Local relevance refinement - `Partial`

Confirmed:
- non-Berlin logic exists
- location-evidence quality handling exists
- a compact stored-data validation pack now exists for real-case pressure beyond fixtures

Still needs work:
- broader real-world validation beyond current fixtures

---

## Phase 4 - Audit Intelligence Layer `Partial`

### Audit domain - `Done`

Evidence:
- [Audit.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\audits\entities\Audit.ts)
- [MongoAuditRepository.ts](C:\Users\Murad\Documents\SS\signalscout\packages\db\src\repositories\MongoAuditRepository.ts)
- audit API module under [apps/api/src/modules/audits](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules\audits)

### Audit generation - `Done`

Evidence:
- [GenerateAudit.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\audits\use-cases\GenerateAudit.ts)
- [MockAuditGenerator.ts](C:\Users\Murad\Documents\SS\signalscout\packages\ai\src\generators\MockAuditGenerator.ts)

### Audit quality refinement - `Partial`

Evidence:
- benchmark coverage exists
- specialty-aware shaping exists in generator logic
- audit benchmark discrimination was materially strengthened in `MockAuditGenerator` and AI tests
- a compact stored-data validation pack now exists in `scripts/tmp/dataValidationPack.md`
- stored-data validation slices now have direct regression coverage in the AI test suite
- stored operator behavior now has a first explicit tightening pass reflected in AI generator/test work
- broader live real-case pressure now includes a multi-specialty Torhaus slice in the AI suite

Still needs work:
- broader live-case pressure
- more niche/multilingual tuning from real cases

---

## Phase 5 - Outreach Intelligence Layer `Partial`

### Outreach domain - `Done`

Evidence:
- [OutreachMessage.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\outreach\entities\OutreachMessage.ts)
- [MongoOutreachRepository.ts](C:\Users\Murad\Documents\SS\signalscout\packages\db\src\repositories\MongoOutreachRepository.ts)

### Outreach generation - `Done`

Evidence:
- [GenerateOutreach.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\outreach\use-cases\GenerateOutreach.ts)
- [MockOutreachGenerator.ts](C:\Users\Murad\Documents\SS\signalscout\packages\ai\src\generators\MockOutreachGenerator.ts)
- regeneration variant tests in [usecases.test.mjs](C:\Users\Murad\Documents\SS\signalscout\tests\mvp\usecases.test.mjs)

### Outreach quality refinement - `Partial`

Evidence:
- polishing layer behavior is encoded in generator logic/tests
- outreach benchmark discrimination was materially strengthened in `MockOutreachGenerator` and AI tests
- a compact stored-data validation pack now exists in `scripts/tmp/dataValidationPack.md`
- stored-data validation slices now have direct regression coverage in the AI test suite
- stored operator behavior now has a first explicit tightening pass reflected in AI generator/test work
- broader live real-case pressure now includes a multi-specialty Torhaus slice in the AI suite

Still needs work:
- broader live-case copy review
- stronger learning loop from stored operator behavior

### Audit/outreach consistency - `Done`

Evidence:
- exact audit and snapshot lookup support in core/db/api
- tests and controller paths support selected-audit regeneration

---

## Phase 6 - Reliability and Infrastructure `Partial`

### DB and build reliability - `Done`

Evidence:
- Mongo bootstrap path exists
- repositories are implemented
- Turbo build order and package builds are wired

### Output quality hardening - `Partial`

Confirmed:
- normalization and copy cleanup exist

Still needs work:
- final consistency polish across API/dashboard surfaces

### Infrastructure drift cleanup - `Done`

Confirmed:
- Redis and `REDIS_URL` claims were removed from docs/env template
- worker, queue, and email scaffolding were removed from the repo

Still note:
- broader infrastructure remains intentionally simple; no background execution subsystem exists

---

## Phase 7 - Lead Review Workspace `Partial`

### Core operator workflow - `Done`

Evidence:
- [router.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\app\router.tsx)
- [LeadsPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadsPage.tsx)
- [LeadDetailPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadDetailPage.tsx)
- dashboard tests in [LeadsPage.test.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadsPage.test.tsx) and [LeadDetailPage.test.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadDetailPage.test.tsx)

Confirmed:
- lead queue
- lead detail
- signals/audit/outreach panels
- regenerate/review/send actions

### Broader dashboard surface - `Partial`

Evidence:
- [DashboardPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\DashboardPage.tsx) is empty
- [AuditsPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\AuditsPage.tsx) is empty
- [OutreachPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\OutreachPage.tsx) is empty
- [SettingsPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\SettingsPage.tsx) is empty
- sidebar exposes only the lead queue

Conclusion:
- the operator workflow is real
- the broader app shell is intentionally thin/stubbed

---

## Phase 8 - Execution Layer `Partial`

### Sending - `Done`

Evidence:
- [SendOutreach.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\outreach\use-cases\SendOutreach.ts)
- [ResendOutreachSender.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\adapters\ResendOutreachSender.ts)
- send route/controller/schema exist
- delivery-event repository/model exist
- send behavior is covered in tests

### Delivery telemetry - `Partial`

Evidence:
- webhook route exists
- delivery events persist
- dashboard shows delivery telemetry panels
- one live inbox test recorded provider acceptance and delivered events against a real Gmail inbox

Still needs work:
- broader analytics beyond the current workspace
- code-backed evidence of full lifecycle coverage is still limited to the implemented event model and tests, not broader validation breadth

### Replies - `Partial`

Evidence:
- reply model/repository/use cases exist
- reply API routes/controllers exist
- dashboard panels exist
- use-case tests exist
- reply-processing logic was validated against a live sent outreach using a simulated provider handoff

Still needs work:
- broader validation and fuller reply workflow
- real reply delivery currently fails because the sender domain is not configured to receive mail
- provider-to-app inbound webhook delivery still needs live end-to-end validation after reply-capable mail routing is in place

### Follow-up - `Missing`

Evidence:
- no meaningful follow-up implementation in code

---

## Phase 9 - Feedback and Learning `Partial`

### Operator feedback reporting - `Partial`

Evidence:
- feedback endpoint exists
- dashboard learning panel exists
- aggregation now runs through the outreach repository and core use case

Still needs work:
- broader validation depth
- clearer long-term reporting architecture if the summary grows more complex

### Outcome feedback loop - `Missing`

Evidence:
- no meaningful outcome-learning system beyond current delivery/reply surfaces

---

## Phase 10 - Worker / Queue / Background Execution `Missing`

Evidence:
- worker app has been removed from the repo
- queue package has been removed from the repo
- no meaningful background execution subsystem is present

Important correction:
- this phase is explicitly absent, not partially built

---

## Phase 11 - Email package and provider abstraction `Missing`

Evidence:
- email package has been removed from the repo
- current send path is app-specific Resend wiring, not a generalized package abstraction

Conclusion:
- generalized email abstraction is not present in the codebase

---

## Phase 12 - Demo / Positioning / Delivery Readiness `Partial`

### Demo artifacts - `Partial`

Evidence:
- `responses/` exists
- benchmark fixtures exist

Still needs work:
- real product/demo surface is not built

### Delivery readiness - `Partial`

Confirmed:
- tests exist for the MVP path
- send/review/dashboard core path is coded and tested
- one real outbound email was delivered to a live Gmail inbox
- delivery events were recorded from the provider webhook path

Still needs work:
- broader validation beyond the current test set
- reply-capable sender-domain or `Reply-To` infrastructure is still missing for live inbound validation

---

## Best Next Steps

### 1. Expand real validation breadth for outreach quality - `Next`

Do:
- build on the stricter outreach benchmark baseline for multilingual, niche, and weak-contact cases
- use the stored-data validation pack as the first real-case pressure set
- broaden real-case tuning after the first stored-operator-behavior pass
- include broader live multi-specialty cases in the pressure set
- keep scope inside the current MVP wedge

### 2. Continue audit validation from the stronger benchmark base - `Next`

Do:
- keep the stricter audit benchmark expectations
- use the stored-data validation pack as the first real-case pressure set
- broaden real-case tuning after the first stored-operator-behavior pass
- include broader live multi-specialty cases in the pressure set
- add more real-case pressure without widening product scope
- treat audit quality as improved but still partial

### 3. Validate reply flow more deeply - `Next`

Do:
- strengthen API and UI test coverage around inbound replies and lead/outreach replied transitions
- do not treat live inbound validation as complete until the sender domain can actually receive replies

### 4. Clean empty-surface drift - `Next`

Do:
- either build or remove empty secondary dashboard pages
- do not leave misleading page scaffolding in place

### 5. Deepen reporting validation - `Next`

Do:
- deepen validation around the learning summary
- keep reporting complexity from spreading across ad hoc repository logic

### 6. Decide whether background execution becomes a real roadmap item - `Later`

### 7. Validate reply-capable sender infrastructure after current P0 gaps - `Later`

Do:
- configure a real reply-capable sender domain or explicit `Reply-To` inbox
- route inbound replies into the existing provider/app webhook path
- rerun the live Gmail reply test end to end

### 8. Evaluate a Lead Prioritization Engine as an internal decision loop - `Later`

Do:
- keep it internal-only and narrow to one validation slice
- reuse existing signals to score and rank candidates
- return a small queue with reason and evidence
- record a lightweight decision trace for operator actions and recommendations
- do not introduce UI, persistence, or discovery-product scope

---

## Honest Bottom Line

The repository clearly supports one real core product:

> a lead-review workspace with snapshot -> signals -> audit -> outreach, plus review/send/reply surfaces

It does not support the broader system shape implied by all package names.

The biggest source-of-truth correction is this:
- core operator flow: real
- audit/outreach quality: still the critical gap
- send/reply plumbing: real but not core MVP
- background execution and generalized email abstraction: absent by design in the current repo
