# Prototype Build Plan

Status: build planning. Ready for James review before implementation.

## Product Brief

`[JAMES]` Build a real prototype, not a Figma mock.

`[JAMES]` Use a real front end and a real back end.

`[JAMES]` Mock the database or databases needed for the workflow.

`[JAMES]` Build a few front-end prototypes, then downselect.

`[JAMES]` Capture James's decisions and feedback as part of the process.

## Build Goal

Create a working prototype of **Connected Maintenance > Shift Brief** for Hertz LAX.

The prototype should prove one thing: a maintenance supervisor can start a shift with a useful operating brief that explains what changed, which assets matter, which work is ready, what is blocked, and where to act next.

## Architecture

Use one shared full-stack app:

- Front end: React / Next.js.
- Back end: Next.js API routes or route handlers.
- Mock database: SQLite seeded with Hertz LAX demo data.
- Data access: thin repository layer so all UI variants use the same API.
- Hosting target: Vercel or another simple hosted URL.

Why this shape:

- It satisfies the "real front end and real back end" requirement.
- It keeps local setup simple.
- It lets us build multiple UI variants without rebuilding the domain model.
- It keeps the prototype honest: feedback actions, status changes, and detail views should hit an API, not just change local component state.

## Backend Scope

The backend should expose the minimum workflow loop:

- Get current shift brief.
- Get focus item detail.
- Get related source evidence for an item.
- Record supervisor feedback: planned, deferred, blocked, vendor, already handled, not relevant.
- Record lightweight local context: note, voice-note placeholder, photo-capture placeholder.
- Return updated summary counts after feedback.

The backend does not need:

- Authentication.
- Real integrations.
- Real AI model calls.
- Real file upload storage.
- Real scheduling optimization.

## Mock Data Scope

Seed data should represent multiple logical systems:

- Samsara maintenance data: assets, faults, DVIRs, PMs, work orders, asset history.
- Parts and procurement data: inventory, part locations, POs, expected arrival.
- Warranty and vendor data: warranty coverage, vendor jobs, dealer path, ETA.
- Rental operations data: vehicle class demand, ready-line shortage, shift demand windows.
- Local shop data: shift roster, technician skills, bay availability, carryover notes.
- Product loop data: shift brief, focus items, recommendation reasons, supervisor feedback.

Use one SQLite database for local simplicity, but keep table names grouped by source system so the prototype can explain the integration story.

Scale principle:

The mock database should feel like a real Hertz LAX-scale operation, not a toy dataset. Seed thousands of assets and hundreds of live operational records, then have the Shift Brief narrow the supervisor's view to the 10-12 focus items that matter this shift. The prototype should demonstrate summarization and prioritization, not just display a hand-authored list.

## Front-End Prototype Variants

Build three variants against the same backend.

### Variant A: Operational Brief

Dense, report-like tab inside Connected Maintenance.

Best for showing:

- Shift summary.
- Ranked focus list.
- Readiness blockers.
- Source evidence.
- Lightweight feedback.

Risk:

- Could feel too much like a dashboard if the actions are weak.

### Variant B: Work Queue With Detail Drawer

List-detail workflow where the supervisor scans focus items and opens a right-side detail drawer.

Best for showing:

- Existing maintenance-software mental model.
- Deep links into work orders, assets, inventory, vendors.
- Evidence and next step in one place.

Risk:

- Could drift toward rebuilding a work-order UI.

### Variant C: Shift Handoff Console

Handoff-first view organized around what changed, carryover, and today's readiness.

Best for showing:

- 24/7 operation fit.
- Prior-shift handoff.
- Mobile floor checks.
- End-of-shift carryover loop.

Risk:

- Could look like a separate command center if not visually grounded in Connected Maintenance.

## Downselect Criteria

Use the same scorecard for all variants:

- Does it feel like a natural Connected Maintenance surface?
- Can the supervisor understand what to do in under one minute?
- Does it preserve existing planning/work-order workflows?
- Does it make the data loop visible enough to trust?
- Does it show partial-context usefulness?
- Does it support shift handoff, not just morning planning?
- Does it demonstrate a real feedback loop?
- Can James explain the product judgment live?

## Build Phases

1. Build backend schema and seeded data.
2. Build shared API and repository layer.
3. Build a simple design system shell that feels Samsara-like.
4. Build three front-end variants using the same API.
5. Host all variants behind a variant switcher.
6. James downselects.
7. Collapse the winning direction into one polished prototype.
8. Add README, local setup, and prototype walkthrough notes.

## Anti-Scope Rules

- Do not build a full CMMS.
- Do not build a full scheduling board.
- Do not build auth.
- Do not simulate every external integration.
- Do not make the UI look like a standalone AI command center.
- Do not add chatbot-first interaction as the primary surface.
- Do not make backend state purely decorative; feedback should update persisted mock state.

## Current Build Brief Playback

The thing should do this:

Show a Hertz LAX maintenance supervisor a shift-start brief that turns fragmented maintenance, parts, vendor, rental-demand, and local-shop signals into a ranked set of actionable focus areas.

Visual source:

Match the feel of Samsara Connected Maintenance and adjacent fleet maintenance software: dense, operational, table/card based, calm, and workflow-adjacent.

Interactivity:

Real enough to demo. Focus items, detail drawers, feedback buttons, status updates, and variant switching should work through the backend. Deep links can be mocked.
