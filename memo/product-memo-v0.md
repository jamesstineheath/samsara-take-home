# Product Memo v0: Predictive Morning Brief for Asset Uptime

Date: 2026-06-15
Status: Draft for James review. Not final submission language.
Representative customer: Hertz LAX Fleet Services.
Primary user: maintenance supervisor / shop foreman.

## Recommendation

`[AI-DRAFT]` Build a Predictive Morning Brief inside Samsara Connected Maintenance.

The brief helps a maintenance supervisor start the day with the most important focus areas already surfaced: what changed overnight, which assets are worth moving first, what is ready now, what is blocked, and what needs human judgment before the morning huddle.

This should not be a full planning board in v1. It should plug into the supervisor's existing workflow and deep-link into the work orders, assets, inventory, vendor records, or CMMS surfaces they already use.

## Why This Matters

`[SOURCE]` The take-home prompt says supervisors start the morning by piecing together what the team should work on from work orders, PM schedules, DVIR defects, fault codes, and their own mental model. It also says much of this planning still happens on whiteboards and in people's heads.

`[SOURCE]` Samsara Connected Maintenance already claims many of the needed data objects: fault codes, DVIRs, PM schedules, work orders, inventory, purchase orders, warranty, vendors, invoices, spend, asset history, and integrations.

`[AI-INFERENCE]` The gap is not another work order list. The gap is decision prep. The supervisor needs to know which work matters today, which work is actually ready to start, and where the plan will break before technicians waste time.

For Hertz LAX, this is especially concrete. A rental vehicle is not valuable because a work order was closed. It is valuable when it is rentable at the right time, in the right class, with no unresolved maintenance, safety, recall, cleaning, charging, or operational hold.

`[SOURCE]` Hertz reports utilization, revenue per unit, revenue per day, depreciation per unit, and direct operating expense per transaction day as core operating metrics. In Q1 2026, recalls reduced utilization and transaction days.

`[AI-INFERENCE]` For this customer, Asset Uptime translates into revenue-ready vehicles. The daily maintenance plan directly affects utilization, customer wait time, operating cost, and revenue opportunity.

## Customer Value

The Predictive Morning Brief should create value in five ways:

1. Reduce morning archaeology. The supervisor does not start by hunting through multiple systems.
2. Prevent wasted starts. The brief flags jobs that look important but are blocked by parts, vendor status, warranty path, asset location, or missing context.
3. Focus scarce capacity. The brief highlights the work most likely to return valuable assets to service today.
4. Improve handoff quality. The brief gives enough context to explain why work matters and where to go next.
5. Create the learning loop. Lightweight feedback tells Samsara which recommendations were planned, deferred, blocked, sent to a vendor, already handled, or not relevant.

`[JAMES]` The product can be useful with partial context. If v1 only looked at parts inventory, it could still tell a supervisor which jobs are ready and which jobs should not be assigned yet. Usefulness compounds as more systems connect.

## UX

`[AI-DRAFT]` The primary surface should be a new tab or module inside Connected Maintenance:

Connected Maintenance > Morning Brief

It should feel like a natural extension of Samsara's current maintenance product: operational, dense, scannable, and table/card based. It should not look like a new command center or a standalone app.

The morning brief should include:

- Summary row: overnight changes, ready work, blocked work, high-impact focus areas, carryover.
- Focus area cards: asset, issue, source signals, why it matters today, readiness state, blocker, suggested next step.
- Sections: Ready now, blocked before start, needs supervisor review, bundle candidates, vendor/warranty watchlist, yesterday carryover.
- Evidence and confidence: source signals should be visible so the supervisor can inspect the recommendation.
- Lightweight feedback: Planned today, deferred, blocked, sent to vendor, already handled, not relevant.
- Deep links: asset, work order, inventory record, warranty path, vendor record, or connected CMMS record.
- End-of-shift follow-up: what happened to the focus items and what should carry into tomorrow.

Secondary entry points:

- Daily email digest for managers who start the morning outside Samsara.
- Dashboard card for "Today's maintenance focus areas."
- Mobile or inbox alert for urgent blockers.
- Asset or work-order side panel explaining why an item appeared in the brief.

## Measuring Success

`[AI-DRAFT]` The buyer outcome is Asset Uptime: the share of assets available for productive use when the operation needs them.

For Hertz LAX, that means vehicles return to rentable inventory at the right time, in the right class, with fewer avoidable holds.

The strategic product metric should be Feasible Uptime Recovered:

`[AI-DRAFT]` Of the uptime the shop could realistically recover today, how much valuable asset availability did the brief help recover?

This is better than "work orders closed." Closed work orders can hide low-value work, conservative planning, or vehicles that are fixed but still not usable.

For v1, because the brief does not own the whole plan, use leading metrics:

| Metric | What It Tells Us |
|---|---|
| High-value focus areas actioned before shift | Did the brief influence the supervisor's morning plan? |
| Focus item precision | Did supervisors mark recommendations as useful, already handled, wrong, or irrelevant? |
| Avoidable blockers surfaced before assignment | Did the brief prevent wasted technician starts? |
| Time to huddle readiness | Did the supervisor get to a usable morning view faster? |
| Feasible opportunity coverage | Did the brief surface the most important ready or nearly-ready work? |
| End-of-shift carryover completeness | Does tomorrow start with a cleaner state? |

Guardrails:

- Critical issue review coverage.
- Repeat repair or reopened issue rate.
- Deferred high-risk work aging.
- Technician trust and adoption.

## Where To Start

Start with a narrow v1:

1. Morning Brief tab inside Connected Maintenance.
2. Readiness and focus classification.
3. Focus areas ranked by feasible uptime impact.
4. Lightweight supervisor feedback.
5. Deep links or handoff snippets into existing planning/work-order surfaces.
6. End-of-shift follow-up and carryover summary.

Minimum viable data can come from one or more clusters:

- Maintenance demand: DVIRs, faults, PMs, open work orders, carryover.
- Readiness: parts inventory, purchase orders, vendor status, warranty path.
- Operational value: asset class, days down, availability state, demand pressure.

`[AI-INFERENCE]` The strongest first wedge may be the readiness cluster. It is concrete and immediately useful: "these jobs are ready because parts are on hand; these jobs are blocked before a technician starts."

## What Comes Later

Later, if the brief proves daily use, Samsara can expand the product surface:

- Suggested technician-ready work cards.
- Ops-facing ready-by-time summary.
- Supervisor commit board.
- Embedded planning board.
- Capacity-aware draft plan.
- Parts and vendor orchestration.
- Predictive fault severity and repair path recommendations.

Do not start with these. They require more trust, cleaner data, and more workflow ownership.

## Key Assumptions

- Samsara can access enough Connected Maintenance data to produce a useful brief without requiring a full new planning UI.
- Supervisors will adopt a decision-prep surface faster than a replacement planning surface.
- The value of the brief compounds as more systems connect.
- Lightweight feedback can be captured without creating a new admin burden.
- Hertz LAX is a useful representative customer, but Asset Uptime is the generalizable frame.

## Open Questions

1. Which connected data cluster creates the most immediate value: faults/DVIRs/PMs, parts/inventory, vendor/warranty, or rental operations demand?
2. Where exactly should this live in Samsara's current navigation?
3. How reliable are inventory and PO records in real maintenance operations?
4. How much local shop context is needed before the brief becomes trusted?
5. What is the right threshold for surfacing safety, recall, or high-severity fault items?
6. Which feedback actions are useful without adding manager busywork?
7. How much rental operations data can Samsara realistically access for customers like Hertz?
8. What evidence would prove the brief should expand into a planning board?

## Source Notes

- Samsara take-home prompt, transcribed in `sources/assignment-prompt.annotatable.md`.
- Samsara Connected Maintenance product page: https://www.samsara.com/products/telematics/fleet-maintenance
- Hertz Q1 2026 results: https://newsroom.hertz.com/press-releases/press-release-details/hertz-announces-q1-2026-results-strongest-revenue-growth-in-three-years/
- LAWA LAX Rental Car Center announcement: https://www.lawa.org/news-releases/2026/lax-opens-consolidated-rental-car-center-increasing-convenience-travelers
- Hertz LAX location page: https://www.hertz.com/us/en/location/unitedstates/california/losangeles/laxt15
- MaintainX Samsara integration: https://www.getmaintainx.com/integrations/samsara
- Fleetio AI Service Advisor: https://www.fleetio.com/ai
