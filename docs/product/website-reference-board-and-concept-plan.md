# SignalScout Website Reference Board And Concept Plan

Last updated: 2026-04-11

## Purpose

This document turns the pre-Figma website brief into a practical design handoff.

Use it to build:

- a reference board
- one homepage wireframe
- two homepage visual concept lanes
- a first Figma exploration that stays aligned with product truth

Companion brief:

- [website-pre-figma-brief.md](C:/Users/Murad/Documents/SS/signalscout/docs/product/website-pre-figma-brief.md)

## Design Goal

Create a product website that feels:

- clean
- elegant
- specific
- trustworthy
- modern

The site should make SignalScout feel like a **beautiful operator workspace for evidence-led lead review**, not a broad AI automation suite.

## Reference Board Structure

Build the reference board in five columns or groups:

1. hero mood
2. product framing
3. typography
4. material and color
5. image direction

Each group should include only references that support the current product wedge.

## Reference Themes To Collect

### 1. Hero Mood

Look for examples with:

- one sharp product promise
- immediate product context
- clean, deliberate whitespace
- strong hierarchy without noise

What to borrow:

- clarity of promise
- pacing
- restraint

What not to borrow:

- category language that implies full automation
- inflated team/platform claims
- generic AI glow aesthetics

### 2. Product Framing

Look for product pages that:

- show the product early
- frame screenshots like evidence, not decoration
- use focused crops rather than giant full-screen dashboards
- let one product action feel primary

SignalScout screenshot framing should prioritize:

- lead queue
- lead detail review
- evidence callouts
- confidence/status chips
- recommendation clarity

### 3. Typography

Look for pairings that feel:

- editorial but not old-fashioned
- contemporary but not default
- precise enough for product UI

Preferred structure:

- display face for hero and key section headings
- sharp sans serif for body, labels, and product-adjacent surfaces

### 4. Material And Color

Look for systems with:

- warm neutral backgrounds
- tactile panel layering
- restrained accent color usage
- calm contrast

Prefer:

- paper
- bone
- stone
- graphite
- olive / forest / ink green accents

Avoid:

- purple-heavy AI gradients
- high-chroma startup colors
- cold enterprise blue as the whole identity

### 5. Image Direction

Collect references for composition only.

Do not reuse third-party imagery.

Look for:

- editorial abstract compositions
- layered textures
- subtle cartographic or locality cues
- evidence-board arrangements
- interface-adjacent still-life framing

## Recommended External Inspiration

These are references for structure, pacing, and composition, not for direct copying.

### [Granola](https://www.granola.ai/)

Use for:

- product-first hero framing
- single sharp promise
- immediate "this is what the product is" clarity

Borrow:

- strong hero discipline
- focused section pacing
- product shown early

### [Resend](https://resend.com/)

Use for:

- modular section rhythm
- clean explanation of capability
- product and technical credibility without clutter

Borrow:

- section clarity
- controlled density
- compositional neatness

### Internal SignalScout dashboard

Use for:

- tone reference
- warmth and tactility
- decision-oriented framing

Primary local references:

- [LeadsPage.tsx](C:/Users/Murad/Documents/SS/signalscout/apps/dashboard/src/pages/LeadsPage.tsx)
- [LeadDetailPage.tsx](C:/Users/Murad/Documents/SS/signalscout/apps/dashboard/src/pages/LeadDetailPage.tsx)
- [tokens.css](C:/Users/Murad/Documents/SS/signalscout/apps/dashboard/src/styles/tokens.css)

## Concept Lanes

Build two concept lanes before choosing a final direction.

## Concept Lane A

### Evidence Desk + Operator Console

This is the recommended primary lane.

#### Core feeling

- editorial
- composed
- high-trust
- product-led

#### Visual traits

- warm neutral canvas
- dark green or ink accent
- layered cards with subtle shadow and edge definition
- refined serif headlines
- crisp sans body and labels
- evidence annotations
- structured interface crops

#### Homepage personality

Feels like:

- a modern review desk
- a premium internal tool
- a product with judgment, not hype

#### Best use

Use this lane if the goal is:

- maximum clarity
- maximum trust
- strongest fit to current product truth

## Concept Lane B

### Local Signal Atlas

This is the recommended secondary lane.

#### Core feeling

- atmospheric
- locality-aware
- elegant
- slightly more expressive

#### Visual traits

- layered map-like textures
- subtle linework and grid cues
- region/signal inspired backgrounds
- softer panel edges
- muted earth palette with one strong dark accent

#### Homepage personality

Feels like:

- signal intelligence with geographic sensitivity
- a more ambient interpretation of the product

#### Constraint

This lane should remain disciplined.

Do not let it become:

- geo-analytics software
- abstract map theater
- decorative world-building disconnected from the product

## Recommended Typography Exploration

Prepare 2-3 pairings.

### Pairing direction A

- display: refined editorial serif
- body/UI: modern grotesk sans

Best for:

- Evidence Desk
- calm authority

### Pairing direction B

- display: sharp humanist sans
- body/UI: neutral sans with strong numerics

Best for:

- Operator Console emphasis
- slightly cleaner product-forward tone

### Pairing direction C

- display: soft serif with a little warmth
- body/UI: compact technical sans

Best for:

- hybrid tone
- elegant but still usable

When judging pairings, prefer the one that makes the site feel:

- clearest
- most specific
- least template-like

## Recommended Color Exploration

Prepare 2-3 material palettes.

### Palette A

- bone
- paper
- graphite
- dark olive
- muted sage

Use for:

- primary lane

### Palette B

- warm stone
- sand
- charcoal
- forest
- dim gold accent

Use for:

- more editorial warmth

### Palette C

- chalk
- ash
- ink
- moss
- muted rust micro-accent

Use for:

- slightly more atmospheric version

Color system rules:

- accents should guide, not dominate
- status colors should feel designed, not default
- backgrounds should carry atmosphere without reducing readability

## Image Direction Plan

All final imagery must be original and generated exclusively for SignalScout.

## Image families to explore

### Family 1: Evidence Board

Visual idea:

- layered notes
- review marks
- snippets of interface
- highlighted signals
- tactile paper and screen contrast

Use for:

- hero backdrop
- section separators
- credibility sections

### Family 2: Local Signal Texture

Visual idea:

- abstract locality markers
- softly mapped territories
- directional lines
- clustered signal points
- restrained geographic cues

Use for:

- ambient background support
- transition moments
- subtle storytelling panels

### Family 3: Interface Editorial Still Life

Visual idea:

- cropped product screens
- framed inside tactile surfaces
- layered with restrained annotations or material textures

Use for:

- workspace preview
- feature callouts
- proof sections

## Image prompt direction

Use prompts that emphasize:

- calm editorial composition
- tactile materials
- evidence-led layouts
- modern product still life
- restrained, exclusive brand atmosphere

Avoid prompts that introduce:

- humanoid robots
- floating holograms
- neon sci-fi light
- stock-photo office scenes
- cartoon illustration

## Homepage Wireframe Plan

Build one low-fidelity wireframe first.

### Section 1: Hero

Include:

- headline
- short supporting line
- primary CTA
- secondary CTA
- framed product composition

### Section 2: Workflow Rail

Show:

- snapshot
- signals
- audit
- outreach
- decision

This should read like a calm sequence, not a stepper widget.

### Section 3: Why It Works

Use 3-4 proof blocks:

- evidence-led recommendations
- local relevance
- confidence and ambiguity handling
- operator control

### Section 4: Workspace

Use one main workspace composition supported by 2-3 close crops.

### Section 5: Best Fit

Clarify:

- who this is for
- what kinds of businesses it is strongest on today

### Section 6: Secondary Capabilities

A short honesty section:

- sending supported
- replies visible
- both secondary

### Section 7: CTA

Calm, direct close with one clear primary action.

## Figma Build Order

1. reference board
2. wireframe
3. lane A concept
4. lane B concept
5. choose winning direction
6. refine hero and workspace sections first
7. expand to full homepage

## Decision Rules

If the two concept lanes compete closely, choose the one that:

- makes the product easiest to understand in five seconds
- feels most exclusive without feeling expensive-for-show
- looks least like generic AI SaaS
- protects the narrow wedge best
- makes the product screenshots feel strongest

## PM Recommendation

Proceed with:

- one reference board
- one homepage wireframe
- two concept lanes

Preferred final direction:

- Evidence Desk + Operator Console

Reason:

- it is the cleanest match to product truth
- it feels elegant without overreaching
- it gives us room for original SignalScout-generated imagery
- it keeps the website focused on judgment, evidence, and action
