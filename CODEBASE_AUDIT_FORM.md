# CODEBASE AUDIT FORM
Project Name: SignalScout
Audit Date: 2026-04-03
Auditing Agent: Codex
Repository/Branch: `signalscout` / `master`
Confidence Level:
- High

---

## 1. Executive Summary

### 1.1 What this project appears to be
- A monorepo for an internal lead-review and outreach workspace that ingests website leads, extracts snapshots, derives signals, generates audits and outreach drafts, lets an operator review/edit/send them, and persists delivery and reply data.

### 1.2 Current maturity level
- Working MVP

### 1.3 Overall repo health
- Mixed

### 1.4 Summary judgment
- The core lead -> snapshot -> signals -> audit -> outreach workflow is genuinely implemented.
- The dashboard’s lead queue and lead detail workspace are real and tested.
- Sending through Resend and delivery-event persistence are implemented.
- Reply persistence and reply UI surfaces exist, but the broader reply workflow is still thin.
- API route validation exists for the live MVP surface.
- Mongo-backed repositories are real and coherently wired for the main domains.
- Audit and outreach quality are meaningful but still need broader live-case validation.
- Feedback/reporting has architecture drift because aggregation bypasses the core/use-case layer.
- Several secondary dashboard pages are empty stubs, so the broader app shell is overstated.
- Background worker, queue, and generalized email-package abstractions are not present in meaningful form.

---

## 2. Product Reality Audit

### 2.1 Core product purpose
Status:
- Confirmed

Evidence:
- [PROJECT.md](C:\Users\Murad\Documents\SS\signalscout\ops\PROJECT.md)
- [apps/dashboard/src/pages/LeadsPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadsPage.tsx)
- [apps/dashboard/src/pages/LeadDetailPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadDetailPage.tsx)
- [packages/core/src/audits/use-cases/GenerateAudit.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\audits\use-cases\GenerateAudit.ts)
- [packages/core/src/outreach/use-cases/GenerateOutreach.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\outreach\use-cases\GenerateOutreach.ts)

Notes:
- The repo clearly supports an operator-facing lead review and outreach workflow for local-service websites.

### 2.2 Main user flow(s)
Status:
- Confirmed

Confirmed flows:
- Lead queue -> lead detail review -> refresh snapshot -> generate audit -> generate outreach -> review/edit -> send
- Sent outreach -> delivery-event persistence -> reply visibility in the workspace

Broken/incomplete flows:
- Secondary dashboard navigation outside the lead queue/detail flow
- Follow-up workflow
- Campaign workflow

Evidence:
- [apps/dashboard/src/app/router.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\app\router.tsx)
- [apps/dashboard/src/pages/LeadsPage.test.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadsPage.test.tsx)
- [apps/dashboard/src/pages/LeadDetailPage.test.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadDetailPage.test.tsx)
- [apps/api/src/modules/outreach/outreach.routes.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules\outreach\outreach.routes.ts)
- [apps/api/src/modules/replies/replies.routes.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules\replies\replies.routes.ts)

Notes:
- The main operator flow is real. Broader application breadth is not.

### 2.3 Primary user-facing features

#### Feature: Lead queue
Status:
- Done

Evidence:
- [apps/dashboard/src/pages/LeadsPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadsPage.tsx)
- [apps/dashboard/src/features/leads/components/LeadTable.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\leads\components\LeadTable.tsx)
- [apps/dashboard/src/pages/LeadsPage.test.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadsPage.test.tsx)

Validation Notes:
- Implemented
- Wired
- Testable
- Not a placeholder

#### Feature: Lead detail review workspace
Status:
- Done

Evidence:
- [apps/dashboard/src/pages/LeadDetailPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadDetailPage.tsx)
- [apps/dashboard/src/pages/LeadDetailPage.test.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadDetailPage.test.tsx)

Validation Notes:
- Implemented
- Wired
- Testable
- Not a placeholder

#### Feature: Snapshot refresh
Status:
- Done

Evidence:
- [packages/core/src/leads/use-cases/RefreshLeadSnapshot.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\leads\use-cases\RefreshLeadSnapshot.ts)
- [apps/api/src/modules/leads/leads.routes.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules\leads\leads.routes.ts)

Validation Notes:
- Implemented
- Wired
- Testable

#### Feature: Signal generation
Status:
- Done

Evidence:
- [packages/scraper/src/adapters/RuleBasedSignalDetector.ts](C:\Users\Murad\Documents\SS\signalscout\packages\scraper\src\adapters\RuleBasedSignalDetector.ts)
- [tests/mvp/signals.test.mjs](C:\Users\Murad\Documents\SS\signalscout\tests\mvp\signals.test.mjs)

Validation Notes:
- Implemented
- Wired
- Tested

#### Feature: Audit generation
Status:
- Done

Evidence:
- [packages/core/src/audits/use-cases/GenerateAudit.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\audits\use-cases\GenerateAudit.ts)
- [packages/ai/src/generators/MockAuditGenerator.ts](C:\Users\Murad\Documents\SS\signalscout\packages\ai\src\generators\MockAuditGenerator.ts)

Validation Notes:
- Implemented
- Wired
- Testable

#### Feature: Outreach generation and regeneration
Status:
- Done

Evidence:
- [packages/core/src/outreach/use-cases/GenerateOutreach.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\outreach\use-cases\GenerateOutreach.ts)
- [packages/ai/src/generators/MockOutreachGenerator.ts](C:\Users\Murad\Documents\SS\signalscout\packages\ai\src\generators\MockOutreachGenerator.ts)
- [tests/mvp/usecases.test.mjs](C:\Users\Murad\Documents\SS\signalscout\tests\mvp\usecases.test.mjs)

Validation Notes:
- Implemented
- Wired
- Regeneration variants evidenced in tests

#### Feature: Outreach review actions
Status:
- Done

Evidence:
- [packages/core/src/outreach/use-cases/ReviewOutreach.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\outreach\use-cases\ReviewOutreach.ts)
- [apps/dashboard/src/features/outreach/components/OutreachComposer.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\outreach\components\OutreachComposer.tsx)

Validation Notes:
- Implemented
- Wired
- Persists accepted, edited, skipped state

#### Feature: Sending outreach
Status:
- Done

Evidence:
- [packages/core/src/outreach/use-cases/SendOutreach.ts](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\outreach\use-cases\SendOutreach.ts)
- [apps/api/src/adapters/ResendOutreachSender.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\adapters\ResendOutreachSender.ts)
- [apps/api/src/modules/outreach/outreach.routes.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules\outreach\outreach.routes.ts)

Validation Notes:
- Implemented
- Wired
- Provider-backed

#### Feature: Delivery telemetry
Status:
- Partial

Evidence:
- [packages/db/src/repositories/MongoDeliveryEventRepository.ts](C:\Users\Murad\Documents\SS\signalscout\packages\db\src\repositories\MongoDeliveryEventRepository.ts)
- [apps/dashboard/src/features/outreach/components/DeliveryTelemetryPanel.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\outreach\components\DeliveryTelemetryPanel.tsx)

Validation Notes:
- Implemented
- Wired
- Productized in current workspace
- Broader analytics/reporting still limited

#### Feature: Reply visibility
Status:
- Partial

Evidence:
- [packages/core/src/replies](C:\Users\Murad\Documents\SS\signalscout\packages\core\src\replies)
- [apps/api/src/modules/replies](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules\replies)
- reply panels under dashboard features

Validation Notes:
- Implemented
- Wired
- Limited validation depth

#### Feature: Secondary dashboard pages
Status:
- Missing

Evidence:
- [apps/dashboard/src/pages/DashboardPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\DashboardPage.tsx)
- [apps/dashboard/src/pages/AuditsPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\AuditsPage.tsx)
- [apps/dashboard/src/pages/OutreachPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\OutreachPage.tsx)
- [apps/dashboard/src/pages/SettingsPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\SettingsPage.tsx)

Validation Notes:
- Placeholder
- Zero-byte stubs

### 2.4 Out-of-scope or abandoned directions detected
- Worker subsystem
  - Evidence: removed from repo; no worker app remains
  - Why: there is no implemented background execution path in code
- Queue subsystem
  - Evidence: removed from repo; no queue package remains
  - Why: no meaningful queue-backed orchestration exists
- Generalized email package
  - Evidence: removed from repo; sending is currently app-specific via Resend
  - Why: prior scaffolding was misleading and not a real subsystem

---

## 3. Architecture Audit

### 3.1 Repo structure
Status:
- Confirmed

Observed structure:
- `apps/api`
- `apps/dashboard`
- `packages/ai`
- `packages/core`
- `packages/db`
- `packages/logger`
- `packages/scraper`
- `packages/shared`
- `tests/mvp`

Notes:
- Structure is clear and broadly coherent for the implemented MVP.

### 3.2 Frontend architecture
Status:
- Partial

Evidence:
- React + Vite + TypeScript
- custom router in [apps/dashboard/src/app/router.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\app\router.tsx)
- feature-based components under `apps/dashboard/src/features`
- CSS token/style files under `apps/dashboard/src/styles`
- test setup in dashboard package

Notes:
- The main operator flow is well-realized.
- The broader app shell is intentionally thin and partly stubbed.

### 3.3 Backend architecture
Status:
- Done

Evidence:
- server/app wiring under `apps/api/src`
- [apps/api/src/app.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\app.ts)
- route modules under `apps/api/src/modules`
- controllers, schemas, wiring, and adapters exist

Notes:
- API layering is credible.
- Some reporting logic bypasses intended boundaries.

### 3.4 Shared contracts / types
Status:
- Partial

Evidence:
- domain types/entities in `packages/core`
- API schemas in `apps/api/src/modules/*/*.schema.ts`
- dashboard feature `types.ts` files

Notes:
- Live API contracts are schema-backed.
- Shared contract strategy exists, but not every cross-layer surface is centralized.

### 3.5 Data model coherence
Status:
- Strong

Evidence:
- entities and repositories for leads, snapshots, audits, outreach, replies, delivery events
- mappers and Mongo models in `packages/db`

Notes:
- The main data model is coherent across the MVP flow.

### 3.6 Architecture drift / duplication
- Reporting-specific aggregation is concentrated in the outreach repository
- Empty dashboard pages suggest broader product surface than exists
- Scoring/discovery concepts exist but are not clearly integrated into the current wedge

Evidence:
- [packages/db/src/repositories/MongoOutreachRepository.ts](C:\Users\Murad\Documents\SS\signalscout\packages\db\src\repositories\MongoOutreachRepository.ts)
- `packages/core/src/scoring`
- discovery-related ports in core

---

## 4. Implementation Audit by Domain

### 4.1 Auth / Identity
Status:
- Missing

Evidence:
- no auth module, login flow, or user identity system in repo

Notes:
- Consistent with current MVP scope.

Validation:
- No evidence of implementation

### 4.2 User / Team / Permissions
Status:
- Missing

Evidence:
- no user/team models or permission system

Notes:
- Not part of the implemented product.

Validation:
- No evidence of implementation

### 4.3 Core domain logic
Status:
- Done

Evidence:
- `packages/core/src/leads`
- `packages/core/src/signals`
- `packages/core/src/audits`
- `packages/core/src/outreach`

Notes:
- Core use-case layer is real and central to the product.

Validation:
- Wired through DB, API, and dashboard

### 4.4 Data ingestion / scraping / import
Status:
- Done

Evidence:
- `packages/scraper/src/fetch`
- `packages/scraper/src/extract`
- `packages/scraper/src/adapters/WebsiteLeadSnapshotExtractor.ts`

Notes:
- Scraping and extraction are meaningful and tested.

Validation:
- Snapshot refresh path and scraper tests exist

### 4.5 AI / scoring / prompt / automation layer
Status:
- Partial

Evidence:
- `packages/ai/src/generators`
- `packages/ai/src/generators/MockAuditGenerator.ts`
- `packages/ai/src/generators/MockOutreachGenerator.ts`
- `packages/ai/src/generators/OutreachPolishingLayer.ts`

Notes:
- Audit and outreach generation are real.
- “AI” is primarily mock/rule-shaped logic, not a broadly integrated model-driven system.

Validation:
- Covered in MVP tests and benchmarks

### 4.6 Dashboard / UI shell / main screens
Status:
- Partial

Evidence:
- real queue/detail flow
- empty secondary pages

Notes:
- Main operator workflow is productized.
- Full app shell is not.

Validation:
- Queue/detail tested; empty pages are not implemented

### 4.7 API surface
Status:
- Done

Evidence:
- route modules for health, leads, audits, outreach, replies, feedback
- schema files and boundary tests

Notes:
- Live MVP API surface is materially complete.

Validation:
- Boundary tests exist

### 4.8 Persistence / DB integration
Status:
- Done

Evidence:
- Mongo repositories and models in `packages/db`

Notes:
- Main persistence layer is coherent and real.

Validation:
- Used by core/API flow throughout repo

### 4.9 Background jobs / queues / workflows
Status:
- Missing

Evidence:
- no worker app remains
- no queue package remains

Notes:
- Background execution is absent by design in the current repo state.

Validation:
- No meaningful implementation present

### 4.10 Billing / plans / subscriptions
Status:
- Missing

Evidence:
- no billing modules or payment provider integrations

Notes:
- Not part of current implementation.

Validation:
- No evidence

### 4.11 Notifications / email / messaging
Status:
- Partial

Evidence:
- Resend sender adapter
- send use case and send route
- delivery webhook handling
- reply ingestion surfaces

Notes:
- Outbound email sending is real.
- Generalized notification/messaging system is not.

Validation:
- Provider-backed send path exists

### 4.12 Analytics / logging / observability
Status:
- Partial

Evidence:
- `packages/logger`
- feedback summary
- queue reporting and delivery telemetry panels

Notes:
- Product reporting exists.
- Broader observability/analytics remain thin.

Validation:
- Some test coverage and UI surfaces exist

### 4.13 Security / auth hardening / validation
Status:
- Partial

Evidence:
- CORS, helmet, API schemas, webhook secret verification, sender readiness checks

Notes:
- Request validation and operational safeguards exist.
- Full auth/security model is absent.

Validation:
- API boundary tests, send readiness code paths

### 4.14 Deployment / environment / config
Status:
- Partial

Evidence:
- `.env.example`
- env bootstrap in API
- README send configuration guidance

Notes:
- Environment/config handling is real for the MVP.
- Production deployment shape is not fully codified in repo.

Validation:
- Config paths are implemented; broader deployment automation is not evidenced

---

## 5. Quality Audit

### 5.1 Buildability
Status:
- Likely working

Evidence:
- package scripts across repo
- MVP test files
- documented dev/build commands

### 5.2 Test coverage
Status:
- Partial

Evidence:
- `tests/mvp/*`
- dashboard page tests
- API boundary tests
- several remaining packages still indicate `No tests yet`

### 5.3 Validation depth
Status:
- Partial

Evidence:
- benchmark fixtures exist
- multilingual/niche cases have some coverage
- broader live-case breadth is still limited

### 5.4 Error handling maturity
Status:
- Partial

Evidence:
- API error handler
- schema validation
- delivery/send failure persistence

### 5.5 Code consistency
Status:
- Mixed

Evidence:
- strong patterns in core/db/api
- weaker consistency in reporting surfaces and empty secondary pages

### 5.6 Technical debt hotspots
- Feedback boundary drift
  - why it matters: bypasses core/use-case architecture
  - evidence: [feedback.controller.ts](C:\Users\Murad\Documents\SS\signalscout\apps\api\src\modules\feedback\feedback.controller.ts)
- Empty secondary dashboard pages
  - why it matters: overstates product surface and creates navigation ambiguity
  - evidence: zero-byte page files under `apps/dashboard/src/pages`
- Validation breadth gap
  - why it matters: audit/outreach quality claims outrun evidence breadth
  - evidence: benchmark/test set is meaningful but still limited

---

## 6. Repo Truth Classification

### 6.1 Clearly Done
- Lead queue and lead detail review workflow
  - evidence: dashboard pages and tests
- Snapshot refresh and signal generation
  - evidence: lead/scraper/core modules and tests
- Audit generation
  - evidence: core use case + AI generator
- Outreach generation, regeneration, review actions
  - evidence: core use cases + dashboard wiring + tests
- Sending and delivery-event persistence
  - evidence: send use case, Resend adapter, delivery-event repository
- Reply persistence and reply surfaces
  - evidence: reply domain/API/UI files

### 6.2 Partial but meaningful
- Audit quality refinement
  - evidence: benchmarks and specialty-aware shaping
  - what is still missing: broader real-case validation
- Outreach quality refinement
  - evidence: polishing layer and regeneration variants
  - what is still missing: broader live-case copy review and stronger learning loop
- Reply workflow
  - evidence: reply capture exists
  - what is still missing: deeper validation and broader workflow behavior
- Reporting
  - evidence: queue reporting, delivery telemetry, feedback summary
  - what is still missing: cleaner domain boundaries and broader analytics

### 6.3 Implied but not trustworthy
- Broader dashboard surface
  - evidence: extra page files exist
  - why it cannot be trusted as complete: they are empty stubs
- Scoring subsystem importance
  - evidence: `packages/core/src/scoring`
  - why it cannot be trusted as complete: not clearly integrated into current product flow
- Lead discovery pipeline
  - evidence: discovery-related ports
  - why it cannot be trusted as complete: no real end-to-end discovery implementation is evidenced

### 6.4 Missing but required
- Deeper reply validation
  - why needed: reply path exists and should be trusted if it remains in the product wedge
- Feedback aggregation behind domain/use-case boundaries
  - why needed: current direct-model aggregation is architecture drift
- Decision on empty dashboard pages
  - why needed: either build them or remove them to keep repo truth clean

---

## 7. PM-Oriented Project Reconstruction

### 7.1 Reconstructed MVP from repo evidence
- An internal workspace where an operator reviews local-service leads, refreshes website data, inspects signals, generates audits and outreach drafts, edits and sends outreach, and tracks delivery/reply information.

### 7.2 Highest-confidence current product wedge
- Lead review and outreach execution for local-service business websites.

### 7.3 Best reconstruction of current project phase
- Integration / polish

### 7.4 Recommended task statuses

#### Area: Core lead-review workflow
Status:
- Done

Why:
- End-to-end operator flow is implemented and tested.
Evidence:
- dashboard pages/tests, core use cases, API routes
Dependencies:
- Mongo, API, dashboard

#### Area: Audit and outreach quality
Status:
- Partial

Why:
- Logic is real but still needs broader validation breadth.
Evidence:
- generators, benchmarks, regression tests
Dependencies:
- scraper, AI generators, tests

#### Area: Reply workflow
Status:
- Partial

Why:
- Capture and surfaces exist, but product depth and validation are limited.
Evidence:
- reply domain/API/UI
Dependencies:
- DB, API, dashboard

#### Area: Feedback/reporting architecture
Status:
- Next

Why:
- Useful reporting exists, but it still needs stronger validation and disciplined containment.
Evidence:
- repository-backed learning summary aggregation
Dependencies:
- core, db, api

#### Area: Empty secondary dashboard pages
Status:
- Next

Why:
- They currently overstate product breadth.
Evidence:
- zero-byte page files
Dependencies:
- dashboard routing and shell

#### Area: Background execution
Status:
- Later

Why:
- Not needed to describe the current repo truth; absent by design.
Evidence:
- removed worker/queue scaffolding
Dependencies:
- future product decision

#### Area: Campaigns / follow-up / team workflows
Status:
- Later

Why:
- No meaningful implementation exists.
Evidence:
- absent in code
Dependencies:
- future product scope decision

---

## 8. Risks, Gaps, and Ambiguities

### 8.1 Major repo ambiguities
- Scoring subsystem role
  - why ambiguous: present in core, not clearly central in current flow
  - what would confirm it: explicit use-case integration and tests
- Lead discovery future
  - why ambiguous: ports exist, but no real pipeline
  - what would confirm it: implemented adapters, routes, tests

### 8.2 Critical risks
- Reporting complexity concentration
  - severity: Medium
  - evidence: learning-summary aggregation is centralized in one repository implementation
- Product quality validation gap
  - severity: High
  - evidence: current quality claims exceed live-case validation breadth
- Surface overstatement
  - severity: Medium
  - evidence: empty secondary dashboard pages

### 8.3 Likely false assumptions a PM might make
- “This is already a full multi-page product.”
  - correction: the real product is the lead queue/detail workflow; other pages are empty
- “There is a real worker/queue subsystem in progress.”
  - correction: that scaffolding was removed; no background execution subsystem exists now
- “Reply and feedback systems are mature.”
  - correction: they are meaningful but still partial and under-validated

---

## 9. Recommended Next Steps

### 9.1 Best immediate Next tasks
- Expand audit/outreach validation breadth
  - why it should be next: product quality depends on broader evidence, not more surface area
  - dependency logic: uses existing benchmark/test infrastructure
- Either build or remove empty secondary dashboard pages
  - why it should be next: they currently distort repo truth and product expectations
  - dependency logic: isolated to dashboard shell
- Deepen reporting validation and keep the learning-summary logic contained
  - why it should be next: reporting now sits behind the right boundary, but still needs stronger validation and discipline
  - dependency logic: builds on the new repository/use-case path

### 9.2 Later tasks
- Deeper reply workflow/productization
  - why later: core capture exists; next value is validation and refinement, not new categories
- Follow-up workflow
  - why later: not supported by current wedge
- Campaigns / multi-operator support
  - why later: current product is still a focused operator workspace

### 9.3 Tasks that should NOT be prioritized yet
- Reintroducing worker/queue infrastructure
  - why not yet: absent from current repo truth and not required for the working MVP
- Billing/subscriptions
  - why not yet: no evidence current wedge needs them before product truth and quality are stronger
- Large new dashboard sections
  - why not yet: existing empty pages should be resolved before expanding breadth

---

## 10. Output Generation Instruction

Using only the audited findings above, generate:

1. [PROJECT.md](C:\Users\Murad\Documents\SS\signalscout\ops\PROJECT.md)
2. Initial role task files
3. Clean tracklist with statuses:
   - Done
   - Partial
   - Next
   - Later

The generated files must reflect repo truth, not idealized plans.
