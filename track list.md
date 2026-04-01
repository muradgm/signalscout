# SignalScout Track List

## Assessment Summary

SignalScout is no longer at idea stage. It has a meaningful backend vertical slice in place, but it is not yet an end-to-end usable product.

Current reality from the repo:

- `apps/api` is the strongest part of the system and already exposes health, leads, audits, and outreach routes.
- Core domain packages exist and are wired through `@signalscout/core`, `@signalscout/db`, `@signalscout/scraper`, and `@signalscout/ai`.
- Root `pnpm build` and `pnpm typecheck` pass.
- The dashboard is mostly scaffolded. The main entry renders a placeholder, while pages, feature components, and router-related files are empty.
- The worker app is still a placeholder.
- The replies module is scaffolded but empty.
- Tests exist as filenames only; the current suite is effectively not implemented.
- Docs for roadmap and architecture are mostly empty, so the delivery plan has to be inferred from code.

## Current Position

Project stage: backend-first prototype with partial domain implementation.

What is materially done:

- Lead CRUD and lead lookup path exists.
- Lead snapshot refresh flow exists.
- Signal detection logic exists and contains real business rules.
- Audit generation flow exists.
- Outreach generation flow exists.
- Mongo connection layer and repository structure exist.
- Repo hygiene is in good shape and the project is on GitHub.

What is not product-ready yet:

- No real dashboard workflow for operators.
- No real worker/queue execution path.
- No replies handling.
- No implemented test coverage.
- No documented release or operational checklist.

## Best Next Step

The best next step is not adding more backend modules. The best next step is to complete one operator-facing end-to-end loop:

1. List leads in the dashboard.
2. Open a lead detail view.
3. Trigger snapshot refresh.
4. Trigger audit generation.
5. Trigger outreach generation.
6. Show the resulting data in the UI.

Reason:

- The API slice already exists.
- The dashboard is the biggest product gap.
- This creates the first real proof that SignalScout works as a usable workflow instead of only as backend plumbing.
- It will also expose what is actually missing in API contracts, loading states, errors, and data shapes.

## Delivery Track

### Track 0: Stabilize The Current Slice
Status: partially complete

- Keep `build` and `typecheck` green.
- Add a minimal architecture note describing the current runtime shape.
- Add example request and response payloads for leads, snapshots, audits, and outreach.
- Decide whether `master` remains the default branch or should move to `main`.

Exit condition:

- A new contributor can understand how the current backend flow is supposed to work without reading the entire codebase.

### Track 1: Ship The First Real Dashboard
Status: not started

- Implement routing in `apps/dashboard/src/app/router.tsx`.
- Replace placeholder `main.tsx`/app shell flow with actual pages.
- Build `LeadsPage` with lead listing.
- Build `LeadDetailPage` with:
  - lead summary
  - snapshot section
  - signals section
  - audit section
  - outreach section
- Wire UI actions to the existing API:
  - refresh snapshot
  - generate audit
  - generate outreach
- Add loading, empty, and error states.

Exit condition:

- A user can operate the full lead -> snapshot -> audit -> outreach flow from the browser.

### Track 2: Make The Flow Reliable
Status: not started

- Implement the currently empty test files under `tests/unit/core` and `tests/integration/api`.
- Add at least:
  - unit tests for signal detection rules
  - unit tests for audit and outreach generation contracts
  - integration tests for lead, audit, and outreach routes
- Add test fixtures with realistic lead and snapshot samples.
- Make `pnpm test` meaningful instead of placeholder output.

Exit condition:

- Core business logic and API flows are protected by real tests.

### Track 3: Complete The Missing Backend Surface
Status: not started

- Implement replies module or explicitly remove it from current scope.
- Decide whether outreach replies are part of MVP or post-MVP.
- Clean up any partially wired but unused modules.
- Add clear API contracts for all active endpoints.

Exit condition:

- No major module remains in a misleading half-scaffolded state.

### Track 4: Introduce Background Processing
Status: not started

- Define which tasks must run asynchronously:
  - snapshot refresh
  - audit generation
  - outreach generation
- Implement worker runtime in `apps/worker`.
- Connect queue package to actual job execution.
- Add retry and failure reporting strategy.

Exit condition:

- Long-running operations can move off the request cycle without breaking operator workflow.

### Track 5: Operational Readiness
Status: not started

- Finalize environment variable documentation.
- Add deployment notes for API, dashboard, MongoDB, and Redis.
- Add seed/import workflows for demo data.
- Add logging and error-reporting expectations.
- Define a minimal release checklist.

Exit condition:

- The project can be started, demoed, and maintained without tribal knowledge.

## Recommended Order

1. Track 1: first real dashboard
2. Track 2: reliability and tests
3. Track 3: resolve missing backend surface
4. Track 4: background processing
5. Track 5: operational readiness

## Immediate Next Sprint

Scope the next sprint to one thin objective:

`Operator can select a lead in the dashboard and run snapshot -> audit -> outreach from the UI.`

Concrete next tasks:

- Implement router and app shell in `apps/dashboard`.
- Build `LeadsPage`.
- Build `LeadDetailPage`.
- Add typed API client calls for existing backend endpoints.
- Render audit and outreach results.
- Add basic integration coverage for the used API routes.

## Stop Doing

- Do not add new domain areas until the dashboard can exercise the existing ones.
- Do not add more empty scaffolds.
- Do not treat placeholder test files as progress.

## Success Marker

SignalScout reaches the next meaningful milestone when a user can:

- create or view a lead
- refresh its snapshot
- inspect detected signals
- generate an audit
- generate outreach
- do all of that from the dashboard with working feedback states

At that point the project moves from "implemented backend pieces" to "usable internal MVP".
