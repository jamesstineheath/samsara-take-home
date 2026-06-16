# Product Memo v3: Predictive Shift Brief for Asset Uptime

Status: Locked draft for prototype. Not final submission language.

## Executive Summary

Samsara should build a Predictive Shift Brief inside Connected Maintenance: a lightweight operating brief that tells a maintenance supervisor which assets deserve attention first, which work is ready, what is blocked, and what changed since the last shift.

Why now: Connected Maintenance already brings together many of the raw ingredients: work orders, PMs, DVIRs, faults, asset history, inventory, POs, warranty, vendors, invoices, and integrations. The missing step is turning that data into the few focus areas that help a supervisor run a shift handoff, direct technician attention, and recover more asset uptime.

How it works: create a Shift Brief tab for the supervisor's pre-shift view, then surface the same intelligence as contextual badges in existing workflows like Inventory, Work Orders, Asset Status, Faults, DVIRs, Warranty, and Vendors. The tab is the planning aid; the badges are where the supervisor acts during the day.

## Assumptions And Scope

- Representative customer: Hertz LAX Fleet Services.
- Why Hertz LAX: it is a high-volume, 24/7 airport rental operation where vehicle availability is directly tied to utilization, customer wait time, operating cost, and revenue opportunity.
- Primary user: maintenance supervisor / shop foreman.
- Buyer outcome: Asset Uptime.
- Hertz-specific expression: vehicles rentable at the right time, in the right class, with no unresolved maintenance, safety, recall, cleaning, charging, or operational hold.
- Supervisor tools: desktop/laptop for the full shift-start brief; phone/tablet for floor checks, quick feedback, voice notes, and photo capture.
- Technician tools: mobile or tablet work-order surface for notes, photos, status, and closeout.
- V1 surface: desktop-first inside Connected Maintenance, with mobile/email summaries and contextual badges.
- V1 data assumption: the brief can be useful with partial context and should not require every system to be connected on day one.

## Day In The Life: Hertz LAX Supervisor

The supervisor's shift-start question is not "which work orders are open?" It is: "Which vehicles can we get back to rentable inventory this shift, which ones matter most, what changed since the last supervisor, and what is blocking the rest?"

![Hertz LAX tools and data flow](http://127.0.0.1:8765/hertz-lax-tools-flow-memo.svg)

Before the huddle, the supervisor has to reconcile three kinds of truth:

- Maintenance truth: open work orders, PMs, DVIR defects, fault codes, asset history, parts, warranty, vendors.
- Rental operations truth: which vehicle classes are short, which cars are ready-line candidates, which are on hold, and where demand is building.
- Local shop truth: who is on shift, which techs have the right skills, which bays are open, which vehicle is physically accessible, and which parts are actually usable.

In a 24/7 rental operation, there may not be one clean "morning." The operating moment is the shift handoff. The product should preserve carryover from the prior supervisor, explain what changed, and show what is newly ready, newly blocked, or newly urgent.

Not all vehicles are equally important. A high-demand SUV needed before the afternoon arrival rush is more valuable than a sedan in a class with available substitutes. A vehicle with a quick, parts-ready fix may be worth pulling ahead of a more severe job that cannot realistically return this shift.

The brief should synthesize these signals before the huddle so the supervisor starts with a short list of focus areas instead of reconstructing the shift from scratch.

## Opportunity

Samsara already claims much of the maintenance system of record. Competitors also cover the basics: work orders, parts, technician assignment, service history, PMs, and AI-assisted review. The opportunity is not "build maintenance software." It is a decision-prep layer that turns connected maintenance data into a useful shift operating brief.

For Hertz LAX, the value is direct. A vehicle is not useful because a work order was closed. It is useful when it returns to rentable inventory. The brief should help supervisors recover more feasible uptime by surfacing work that is both valuable and executable.

This is also a practical land-and-expand wedge. The brief can start with one useful data cluster, such as parts readiness. It becomes more valuable as Samsara connects more structured data from inventory, POs, warranty, vendor status, rental demand, technician feedback, and prior shift carryover.

## UX

The core surface is:

Connected Maintenance > Shift Brief

The Shift Brief tab is a persistent daily artifact organized by shift. It should be created before the supervisor starts, updated as major blockers change, and reviewed at shift end for carryover.

The desktop view should show the complete operating brief. The mobile view should scale down to the jobs-to-review, blockers, and quick actions a supervisor needs while walking the floor. Mobile should also capture local context through voice notes and photos, including photos of whiteboards, parts shelves, vehicle damage, or handwritten carryover notes.

During the shift, the same insights should appear as ephemeral badges or alerts inside existing surfaces:

- Inventory: badge jobs blocked by missing or low-confidence parts.
- Work Orders: flag jobs that are ready, stale, duplicated, or good bundle candidates.
- Asset Status: show why an asset appeared in the brief.
- Faults/DVIRs: mark issues that need review before dispatch.
- Warranty/Vendors: flag items that should not move through the normal repair path yet.

This avoids forcing supervisors into a new planning workspace. The brief gives them the shift-start rollup; deep links and badges let them act inside the surfaces they already use.

Each focus item should show:

- Asset and current state.
- Source signals.
- Why it matters this shift.
- Operational value, such as vehicle class demand or days unavailable.
- Readiness state.
- Known blocker or missing context.
- Suggested next step.
- Deep link to the relevant asset, work order, inventory, warranty, vendor, or connected CMMS record.

V1 should include lightweight feedback:

- Planned this shift.
- Deferred.
- Blocked.
- Sent to vendor.
- Already handled.
- Not relevant.

This is the minimum learning loop. A read-only report may be useful, but it will not teach Samsara which recommendations were right, wrong, ignored, or missing local context.

## V1

V1 should focus on a narrow, useful brief:

1. Shift Brief tab inside Connected Maintenance.
2. Contextual badges in existing maintenance surfaces.
3. Focus areas ranked by feasible uptime impact.
4. Readiness classification: ready, blocked, needs review, vendor, defer, bundle candidate.
5. Lightweight feedback capture.
6. Deep links into existing work-order and asset surfaces.
7. Shift-end follow-up and carryover summary.
8. Mobile floor view with quick feedback, voice note, and photo capture.

The strongest first data cluster may be readiness: parts inventory, POs, warranty, vendor status, and open work. It is concrete and immediately useful. A parts-aware brief can prevent the team from assigning work that cannot start.

## Later

If the brief proves daily use, Samsara can expand into more workflow ownership:

- Suggested technician-ready work cards.
- Ops-facing ready-by-time summaries.
- Supervisor commit board.
- Embedded planning board.
- Capacity-aware draft plan.
- Parts and vendor orchestration.
- Predictive fault severity and repair path recommendations.

These should not be v1. They require more trust, more complete data, and stronger workflow adoption.

## Measuring Success

Buyer outcome: Asset Uptime.

Strategic product metric: Feasible Uptime Recovered, meaning the share of realistically recoverable, high-value asset availability the brief helped move forward.

V1 leading metrics:

- Focus areas actioned before shift.
- Recommendation precision: useful, already handled, wrong, not relevant.
- Avoidable blockers surfaced before assignment.
- Time to shift readiness.
- End-of-shift carryover completeness.

Guardrails:

- Critical issue review coverage.
- Repeat repair or reopened issue rate.
- Deferred high-risk work aging.
- Supervisor and technician trust.

Do not lead with work orders closed, alerts reviewed, AI recommendations accepted, or time spent in product. Those measure activity. They do not prove Asset Uptime improved.

## Alternatives Considered

Full planning board: too much workflow change for v1. It may be right later, but asking supervisors to move their whole planning process into a new board before the system has earned trust creates adoption risk.

Autonomous scheduler: too dependent on clean capacity, technician skill, duration estimates, parts accuracy, vendor status, rental demand, and safety policy. It is a compelling long-term direction, not a day-one wedge.

Read-only report: easier to ship, but strategically weak. Without lightweight feedback, Samsara cannot learn which recommendations were useful or why supervisors ignored them.

Generic dashboard: too passive. The brief should not just visualize maintenance data. It should produce focus areas that are ready for a supervisor to review before the shift huddle.

## Started Assumptions To Validate

- The readiness cluster is the best first wedge, but this should be validated with supervisors.
- Inventory and PO records are reliable enough to support readiness recommendations, or at least confidence flags.
- Supervisors will give lightweight feedback if it saves time later.
- Contextual badges will help rather than add noise.
- Mobile voice and photo capture will improve local context without creating extra documentation burden.
- Rental operations data improves the brief, but v1 can start without deep reservation integration.

## Sources Used

- Samsara take-home prompt.
- Samsara Connected Maintenance product page: https://www.samsara.com/products/telematics/fleet-maintenance
- Hertz Q1 2026 results: https://newsroom.hertz.com/press-releases/press-release-details/hertz-announces-q1-2026-results-strongest-revenue-growth-in-three-years/
- Hertz LAX location page: https://www.hertz.com/us/en/location/unitedstates/california/losangeles/laxt15
- LAWA LAX Rental Car Center announcement: https://www.lawa.org/news-releases/2026/lax-opens-consolidated-rental-car-center-increasing-convenience-travelers
- MaintainX Samsara integration: https://www.getmaintainx.com/integrations/samsara
- Fleetio AI Service Advisor: https://www.fleetio.com/ai
