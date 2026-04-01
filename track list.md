 Here is the full track list from **start to delivery**, structured as a real build roadmap rather than a loose task list.
 please check against current project progress, updated tracker accordingly and update our internal roadmap 'track list' to reflect reality and the best next steps.


# SignalScout — Full Track List

## Phase 0 — Foundation and Direction

### 0.1 Product definition

Lock the core problem, target user, and initial wedge.

Deliverables:

* problem statement
* ideal customer profile
* offer hypothesis
* clear MVP boundary
* success criteria for first usable version

### 0.2 Architecture definition

Define the system shape before heavy implementation.

Deliverables:

* package structure
* domain boundaries
* core entities and ports
* repository strategy
* scraper boundary
* AI boundary
* API boundary
* dashboard boundary

### 0.3 Workspace and tooling setup

Create the monorepo and development baseline.

Deliverables:

* pnpm workspace
* turbo setup
* TypeScript configs
* package build/typecheck scripts
* linting/formatting baseline
* environment config strategy

---

## Phase 1 — Core Domain and Data Model

### 1.1 Lead domain

Build the lead entity and its persistence model.

Deliverables:

* Lead entity
* lead completeness concept
* lead repository port
* create/list/get lead use cases
* Mongo lead repository
* lead API endpoints

### 1.2 Snapshot domain

Build the concept of a lead snapshot as the extracted website state.

Deliverables:

* LeadSnapshot entity
* snapshot repository port
* snapshot extractor port
* refresh snapshot use case
* Mongo snapshot repository
* snapshot API endpoint

### 1.3 Data contracts and validation

Protect the API boundary cleanly.

Deliverables:

* Zod request schemas
* API input validation
* response mapping
* consistent error handling

---

## Phase 2 — Scraping and Extraction Engine

### 2.1 HTML retrieval

Build stable website fetching.

Deliverables:

* HTML fetch utility
* redirects handling
* content-type validation
* fallback behavior
* fetch failure handling

### 2.2 Snapshot construction

Turn raw HTML into usable extracted data.

Deliverables:

* page title extraction
* meta description extraction
* visible text extraction
* booking link extraction
* contact info extraction
* placeholder content detection

### 2.3 Contact extraction hardening

Improve commercial reliability of extracted contact data.

Deliverables:

* email cleanup
* phone plausibility filtering
* address extraction
* contact normalization
* duplicate removal
* false-positive reduction

### 2.4 Trust signal extraction

Make website meaning more explicit before audits.

Deliverables:

* baseline trust signals
* long tradition detection
* local legacy detection
* family-led detection
* patient comfort detection
* anxiety-patient reassurance detection
* advanced technology detection

---

## Phase 3 — Signal Intelligence Layer

### 3.1 Signal model

Define the structured decision layer.

Deliverables:

* bookingPresence
* contactClarity
* trustSignalStrength
* businessScale
* localRelevance
* outreachFit
* confidence
* issuesDetected
* evidence

### 3.2 Rule-based detector

Build deterministic signal generation.

Deliverables:

* booking presence rules
* business scale rules
* local relevance rules
* outreach fit rules
* confidence rules
* issue generation
* evidence generation

### 3.3 Local relevance refinement

Make local matching commercially meaningful.

Deliverables:

* Berlin-aware district matching
* high vs partial vs low relevance logic
* location evidence quality improvement

---

## Phase 4 — Audit Intelligence Layer

### 4.1 Audit domain

Define the structured website assessment.

Deliverables:

* Audit entity
* audit repository port
* save/get-latest audit use cases
* Mongo audit repository
* audit API endpoints

### 4.2 Audit generation

Generate commercially useful diagnostic summaries.

Deliverables:

* placeholder-page audit path
* bad-fit lead audit path
* good-fit lead audit path
* strengths
* opportunities
* opportunity details
* risks
* recommended angle
* confidence note
* evidence

### 4.3 Audit quality refinement

Move from generic to decision-useful.

Deliverables:

* remove invented problems
* focus on real opportunities
* turn strengths into leverage
* improve explanation quality
* align confidence with evidence

---

## Phase 5 — Outreach Intelligence Layer

### 5.1 Outreach domain

Define the outreach message lifecycle.

Deliverables:

* OutreachMessage entity
* outreach repository port
* save/get-latest outreach use cases
* Mongo outreach repository
* outreach API endpoints

### 5.2 Outreach generation

Build draft generation with decision logic.

Deliverables:

* do_not_send path
* review path
* send path
* placeholder-specific withholding
* subject generation
* body generation
* fitReason
* bestAngle
* reasoning
* evidence

### 5.3 Outreach quality refinement

Move from safe drafts to usable drafts.

Deliverables:

* stronger send classification
* better review logic
* more natural tone
* more specific hooks
* stronger commercial angle
* trust-to-action gap framing
* less generic booking-friction language

### 5.4 Audit/outreach consistency

Keep records and reasoning aligned.

Deliverables:

* latest-audit retrieval by lead
* latest-outreach retrieval by lead
* deterministic record linkage
* fresh audit → fresh outreach consistency

---

## Phase 6 — Operational Reliability Layer

### 6.1 Database consistency

Make sure the system behaves predictably in real use.

Deliverables:

* shared mongoose instance strategy
* connection bootstrap reliability
* health route truthfulness
* startup order correctness

### 6.2 Build and package reliability

Make the monorepo stable to run and evolve.

Deliverables:

* build ordering
* package dist generation
* type portability fixes
* workspace import correctness
* deterministic wiring

### 6.3 Output quality hardening

Remove visible rough edges.

Deliverables:

* text normalization
* encoding cleanup
* punctuation cleanup
* address formatting cleanup
* evidence phrasing polish

---

## Phase 7 — Lead Review Workspace (Productization Begins)

### 7.1 Dashboard architecture

Turn the engine into a usable product surface.

Deliverables:

* dashboard app structure
* routes
* shared types
* API client layer
* UI state strategy

### 7.2 Lead list screen

Create the operator’s starting point.

Deliverables:

* lead list page
* recommendation badges
* confidence display
* status display
* quick scanning view
* loading/empty/error states

### 7.3 Lead detail screen

Create the actual decision workspace.

Deliverables:

* lead summary panel
* signals panel
* audit panel
* outreach panel
* evidence display
* recommendation display

### 7.4 Outreach editor

Make the output actionable, not just readable.

Deliverables:

* editable subject
* editable body
* draft review state
* save/update behavior
* skip/send workflow hooks

### 7.5 Operator actions

Support real workflow decisions.

Deliverables:

* mark as reviewed
* mark as skipped
* approve for send
* send-ready state
* state persistence

---

## Phase 8 — Execution Layer

### 8.1 Email sending integration

Move from recommendation to action.

Deliverables:

* sending provider selection
* send endpoint
* send logging
* sent status update
* failure handling

### 8.2 Reply tracking

Track whether outreach produces outcomes.

Deliverables:

* reply status model
* replied/not replied states
* retrieval mechanism
* timeline visibility

### 8.3 Follow-up support

Support second-step outreach.

Deliverables:

* manual follow-up creation
* follow-up draft path
* follow-up status handling

---

## Phase 9 — Workflow Intelligence Refinement

### 9.1 Internal feedback loop

Learn from actual operator usage.

Deliverables:

* accepted vs edited outreach tracking
* skipped lead patterns
* review-heavy case patterns

### 9.2 Outcome feedback loop

Learn from business outcomes.

Deliverables:

* sent → replied tracking
* lead quality comparison
* opportunity angle performance insight

### 9.3 Signal and copy refinement

Improve the engine from evidence, not guesswork.

Deliverables:

* better fit thresholds
* better confidence rules
* outreach pattern refinement
* stronger good-lead differentiation

---

## Phase 10 — Campaign and Scale Layer

### 10.1 Batch processing

Make the system useful beyond one lead at a time.

Deliverables:

* process multiple leads
* batch snapshot generation
* batch audit generation
* batch outreach generation

### 10.2 Campaign grouping

Organize outreach work.

Deliverables:

* campaign model
* lead grouping
* campaign progress view
* sent/replied summaries

### 10.3 Multi-operator readiness

Prepare for future team usage.

Deliverables:

* user ownership model
* assignment model
* audit/outreach history clarity

---

## Phase 11 — Product Surface and Positioning

### 11.1 Landing page

Explain the product clearly.

Deliverables:

* problem framing
* how it works
* examples
* trust signals
* demo-style walkthrough

### 11.2 Demo flow

Show value fast.

Deliverables:

* sample leads
* example outputs
* before/after lead review journey

### 11.3 Pricing and packaging

Turn the system into an offer.

Deliverables:

* pricing hypothesis
* per-seat / per-lead / per-campaign thinking
* trial/demo model
* positioning language

---

## Phase 12 — Delivery Readiness

### 12.1 Production hardening

Make the system safe to expose externally.

Deliverables:

* error handling review
* logging review
* environment validation
* operational health review
* API stability review

### 12.2 UX cleanup

Polish what users actually touch.

Deliverables:

* wording consistency
* state consistency
* loading behavior
* empty state quality
* visual hierarchy cleanup

### 12.3 Delivery checklist

Prepare for first real rollout.

Deliverables:

* tested core lead flows
* tested placeholder flow
* tested bad-fit flow
* tested good-fit flow
* sending path tested
* persisted state tested
* dashboard workflow tested

---

# Condensed Delivery Path

If you want the shortest practical path from where you are now to something deliverable, it is this:

1. Intelligence engine
2. Lead review workspace
3. Outreach editing + sending
4. Status persistence
5. Real lead processing workflow
6. Landing/demo/product surface
7. Delivery

---

# Where you are right now

You have effectively completed most of:

* Phase 1
* Phase 2
* Phase 3
* Phase 4
* Phase 5
* key parts of Phase 6

And you are ready to start:

# **Phase 7 — Lead Review Workspace**

That is the correct next chapter.


