# SignalScout Project Management

## Brutally Honest Assessment

SignalScout is no longer fragile in the way early prototypes usually are. The backend core is real, the Mongo path works, the lead intelligence loop is functioning, and recent extraction improvements materially raised data quality.

That said, this is still not a finished product. It is a strong backend-heavy prototype with a weak product shell around it.

The uncomfortable truth:

- the backend is ahead of the app
- the signal layer is becoming credible
- the dashboard is still not doing its job
- the worker and replies areas still overstate how complete the system is
- the test posture is weaker than the repo structure implies

Current stage:

`credible internal prototype, not yet a credible internal product`

## What Is Actually Working

- API runtime is stable enough for real iteration.
- Mongo persistence is working and debuggable.
- Snapshot -> signals -> audit -> outreach now behaves coherently on live leads.
- Contact extraction is materially better than before.
- Trust-signal extraction is now richer and much more aligned with downstream reasoning.
- Audit and outreach outputs are good enough to prove the commercial intelligence loop.

That is real progress. This is not rescue territory anymore.

## What Needs To Be Tightened

### 1. The product surface is still too weak

This is the biggest weakness in the entire project.

The operator-facing app is still mostly absent:

- [`apps/dashboard/src/main.tsx`](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\main.tsx) is still placeholder-level
- [`apps/dashboard/src/App.tsx`](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\App.tsx) is still placeholder-level
- key pages like [`LeadsPage.tsx`](C:\Users\Murad\Documents\SS\signalscout\apps\dashboard\src\pages\LeadsPage.tsx) are empty

That means the repo currently proves backend capability more than product usability.

### 2. The test story is not honest enough yet

The repo shape suggests more confidence than the codebase has actually earned.

There are test files, but package-level test commands still say `No tests yet` across major workspaces. That is a credibility problem, not just a tooling gap.

The danger:

- people assume coverage exists when it mostly does not
- changes will increasingly rely on manual regression checks
- the more UI/productization you add, the more expensive that becomes

### 3. Scope clarity is still muddy

Some modules are half-declared and half-real.

Examples:

- replies surface exists, but it is not really a working product area
- worker surface exists, but it is not yet a meaningful execution path

That creates repo noise and false signals about maturity.

Either:

- implement them soon

or:

- explicitly mark them out of current MVP scope

Right now they sit in the least useful middle ground.

### 4. The signal layer is better, but not broadly proven

The trust-signal extractor is now much stronger, which was the right move.

But it is still validated mostly on a handful of known flows. That is not enough if this app is meant to support varied local-service leads.

What still needs tightening:

- multilingual robustness
- noisy/aggregator page behavior
- false positives on chain-like language
- confidence calibration across good, weak, and bad-fit leads

### 5. Workspace hygiene is not finished

The root is still carrying signals of uneven dependency and project ownership.

Examples:

- root [`package.json`](C:\Users\Murad\Documents\SS\signalscout\package.json) still includes dependencies that should mostly belong to packages/apps
- both [`pnpm-lock.yaml`](C:\Users\Murad\Documents\SS\signalscout\pnpm-lock.yaml) and [`package-lock.json`](C:\Users\Murad\Documents\SS\signalscout\package-lock.json) exist
- local-only artifacts still exist at root even when ignored

None of that is fatal, but it lowers discipline.

## What Is Strong Enough To Trust

### Backend flow

You can now trust the backend enough to keep building on it.

Not blindly, but enough.

### Data extraction quality

For good local leads, the contact block is now in a materially better state:

- email
- phone
- address
- booking
- richer trust cues

That is a real milestone because it improves both product confidence and downstream AI reasoning.

### Commercial intelligence direction

The project is now clearly moving toward an explainable intelligence workflow rather than a vague AI wrapper.

That is important. The recent work improved:

- explainability
- determinism
- grounding

Those are the right product qualities to build around.

## Highest-Value Next Improvements

### 1. Ship the first real dashboard workflow

This is the single highest-value next improvement.

Not because UI is glamorous, but because the backend is already far enough ahead that the product is now the bottleneck.

Minimum workflow:

1. list leads
2. open a lead detail page
3. trigger snapshot refresh
4. inspect signals
5. generate audit
6. generate outreach

Why this matters:

- it converts backend capability into actual product usability
- it reveals API contract rough edges immediately
- it forces proper loading, error, and empty-state handling

### 2. Make testing real for the main path

You do not need broad test coverage first. You need honest test coverage first.

Start with:

- signal detection unit tests
- snapshot extraction fixtures
- audit generation contract tests
- outreach generation contract tests
- integration tests for the main lead flow endpoints

This will do more for project quality than adding another subsystem.

### 3. Build a lead-quality benchmark set

This project needs a repeatable realism bench.

Recommended minimum:

- 3 good leads
- 3 messy but valid leads
- 3 bad-fit leads
- 2 placeholder/inactive leads

Use it to judge:

- extraction quality
- signal quality
- audit usefulness
- outreach tone
- confidence calibration

This would sharply improve product trust.

### 4. Clean the repo to match true scope

If replies and worker are not next, say so in the code and docs.

If they are next, put them on an explicit short runway.

What should stop:

- leaving empty modules that imply active product scope
- allowing scaffolding to masquerade as progress

### 5. Tighten data and persistence semantics

The app is now strong enough that subtle correctness matters more.

Important next tightening areas:

- explicit DB indexes for latest-by-lead query paths
- snapshot freshness semantics
- audit/outreach lineage clarity
- a small set of admin/debug scripts for live record inspection

## Recommended Sequence

### Phase 1

- ship the dashboard operator loop
- keep using live leads during development
- tighten API error and loading behavior as UI exposes weak spots

### Phase 2

- make tests real for the MVP path
- build the lead-quality benchmark set
- stabilize signal confidence and extraction behavior across more cases

### Phase 3

- either implement or defer replies explicitly
- either implement or defer worker explicitly
- clean repo/workspace hygiene so structure matches reality

### Phase 4

- bring background jobs online for long-running operations
- improve operational readiness and internal demoability

## What Would Move The App To The Next Level

The app moves to the next level when these things are true at the same time:

- the full lead workflow works from the dashboard, not just the API
- the intelligence layer is supported by repeatable fixtures and tests
- the repo no longer overstates completion through empty modules
- the signal and extraction layers behave credibly across multiple lead types
- the UI makes the intelligence feel usable, inspectable, and trustworthy

That is the difference between:

`smart backend prototype`

and:

`usable internal product with defensible quality`

## Honest Bottom Line

SignalScout does not need more breadth right now.

It needs more honesty and more completion in the areas that matter most:

1. product surface
2. test reality
3. scope discipline
4. repeatable signal quality validation

The project is finally good enough that adding more unfinished surfaces would be the wrong move.

The right move now is to turn the working intelligence core into a usable, testable product loop.
