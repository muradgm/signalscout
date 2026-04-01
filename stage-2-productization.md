# Stage 2: Productization

## Objective

You are not building "UI".

You are building:

> An operator workspace that makes lead decisions fast, clear, and low-friction.

Success is not:
- more extraction logic
- more signal variants
- prettier cards

Success is:
- one operator can review 10 to 20 leads in one sitting
- quickly see what matters
- trust the recommendation
- act without opening raw JSON or hunting through panels

## Current Reality

What is already real:
- working backend loop: snapshot -> signals -> audit -> outreach
- working dashboard shell in [App.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\App.tsx)
- real dashboard API layer in:
  - [leads/api.ts](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\leads\api.ts)
  - [audits/api.ts](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\audits\api.ts)
  - [outreach/api.ts](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\outreach\api.ts)

What is not productized yet:
- routed screen architecture is scaffold-only
- reusable UI components are scaffold-only
- editing/send workflow is not real
- lead review flow is still too panel-centric and developer-facing
- the app still exposes too much system structure and not enough decision clarity

So Stage 2 is not "start the dashboard."

It is:

> Convert the working operator shell into a real decision product.

## Product Principle

This is not a dashboard.
It is not analytics.
It is not a data browser.

It is:

> A review-and-action workspace.

Every screen should answer:
- Should I send?
- Why?
- What should I do next?
- Can I do it without thinking too hard?

## V1 Scope

Do not build:
- auth
- multi-user
- settings
- analytics
- charts
- deep configuration

Build only:

### A. Lead List

Purpose:
- scan
- prioritize
- enter review

Each row should show:
- company name
- location
- recommendation badge
- confidence
- quick status
- last workflow freshness if available
- one-line reason

The reason matters. Operators should not have to open every lead to know why it matters.

### B. Lead Detail Workspace

Purpose:
- make one decision clearly

This should not be a raw 3-column data dump.
It should be ordered by decision flow:

1. Decision summary
- recommendation
- confidence
- fit reason
- strongest opportunity
- clear "why now" summary

2. Evidence
- signals
- trust/contact/booking/local
- top audit strengths
- top audit opportunities

3. Action
- editable outreach subject/body
- regenerate
- skip
- send later
- copy/export if send is still mocked

The detail screen should privilege the recommendation and reason first.
Snapshot rawness should be secondary, collapsible, or summary-only.

### C. Basic State Handling

Required:
- loading
- error
- empty
- stale state
- no-audit-yet state
- no-outreach-yet state
- "snapshot refresh invalidates downstream outputs" state

The workflow has lineage. The UI should reflect that clearly.

## Tech Direction

Keep what already works:
- React
- Vite
- TypeScript
- current CSS tokens/styles

Add only if it removes real friction:
- React Query is worth adding once pages become real and multiple panels depend on invalidation/refetch rules
- Tailwind is not necessary right now and would create churn without improving operator throughput

Recommendation:
- do not add Tailwind in this phase
- do add a real query/cache layer when the monolithic flow is split into routed pages

## Actual Implementation Sequence

### Step 1. Extract the current working flow out of `App.tsx`

Move the real lead-review logic from [App.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\App.tsx) into:
- [LeadsPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadsPage.tsx)
- [LeadDetailPage.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadDetailPage.tsx)

Reason:
- the app already works
- the problem is maintainability and product structure, not missing capability

### Step 2. Make the list screen decision-oriented

Build real versions of:
- [LeadTable.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\leads\components\LeadTable.tsx)
- [LeadStatusBadge.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\leads\components\LeadStatusBadge.tsx)
- [LeadFilters.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\leads\components\LeadFilters.tsx)

Add:
- recommendation
- confidence
- short reason
- search/filter
- quick row scanning

### Step 3. Make the detail screen workflow-first

Build:
- summary block
- evidence block
- action block

Do not mirror the backend 1:1.
Transform it into:
- what we think
- why we think it
- what to do next

### Step 4. Make outreach editable and operable

Build a real version of [OutreachComposer.tsx](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\features\outreach\components\OutreachComposer.tsx)

Needed behavior:
- subject editable
- body editable
- regenerate
- copy
- mark skipped
- send remains mocked unless backend send exists

### Step 5. Add query invalidation and lineage-aware refresh

When snapshot refreshes:
- signals should refetch
- audit should reset or refetch
- outreach should reset or refetch

When audit regenerates:
- outreach should become stale

This already exists conceptually in `App.tsx`. Make it explicit and page-safe.

### Step 6. Only then polish layout and surface

After the workflow is stable:
- tighten spacing
- improve recommendation visibility
- improve address formatting
- collapse secondary detail
- improve empty/error copy

## Folder Plan

Use the existing feature-oriented structure:
- `features/leads/components`
- `features/audits/components`
- `features/outreach/components`
- `pages`
- `app/layout`
- `lib`

Do not introduce a second parallel structure.
Fill the existing files instead of restructuring again before shipping the first usable workspace.

## Common Mistakes To Avoid

- Do not rebuild the whole dashboard architecture before extracting the current working flow.
- Do not add Tailwind just because it is fast.
- Do not expose raw backend objects as the UI contract.
- Do not make every panel equal weight.
- Do not over-celebrate "more screens" when the current product still needs one excellent lead-review path.

The product risk now is not missing technology.
It is turning a working lead engine into a cluttered internal tool instead of a sharp operator workspace.

## What Improves The Original Plan

These points should be explicit:
- the current dashboard already has a working MVP shell, so Stage 2 is extraction and productization, not greenfield UI
- the first deliverable is not "build pages", it is "move the existing working flow into real pages/components without losing behavior"
- recommendation and fit reason should be first-class on both list and detail screens
- snapshot, signals, audit, and outreach are not peer panels; they are stages in one decision workflow
- Tailwind is optional and probably unnecessary in this repo right now
- React Query becomes valuable when the workflow is split across routed pages and needs reliable invalidation

## Best Next Move

1. Extract the current `App.tsx` workflow into `LeadsPage` and `LeadDetailPage`.
2. Build a real lead list with recommendation, confidence, and reason.
3. Build a real lead detail page with a decision-first layout.
4. Make outreach editable.
5. Add query invalidation and stale-state handling.
6. Then polish visuals.

This matches the repo, respects the progress already made, and moves the app forward without unnecessary churn.
