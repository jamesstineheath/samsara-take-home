# V1 Opportunity Prioritization

Date: 2026-06-14
Status: opportunity sizing for James review. Not final scope.
Purpose: map realistic v1 opportunities against the target metrics, available structured data, and software existence proof.

## James Input

`[JAMES]` We should assume Samsara cannot deliver the entire Asset Uptime planning system on day one.

`[JAMES]` Prioritize realistic pieces that deliver the most value immediately.

`[JAMES]` Map opportunities against key metrics, feasibility, available structured data, and software existence proof.

`[JAMES]` The prior "planning cockpit" framing may be over-scoped. The v1 may be stronger as a predictive morning brief with roll-up insights and focus areas, while supervisors keep using their existing planning surfaces.

`[JAMES]` The brief may only need a minimum amount of connected context to be useful. Even if the first version only looked at parts inventory, it could still surface useful focus areas.

`[JAMES]` Usefulness compounds as more tools and data streams are connected.

`[JAMES]` By not over-scoping v1, Samsara does not ask managers to redo their whole workflow. If the brief starts working, Samsara can extend the product surface over time.

## Source Basis

`[SOURCE]` Samsara Connected Maintenance already claims DVIR-to-work-order creation, smart work-order suggestions across DVIR defects/faults/scheduled maintenance, asset history, fault-code intelligence, inventory, POs, warranty, invoices, vendors, spend reporting, migration/imports, and integrations. Source: https://www.samsara.com/products/telematics/fleet-maintenance

`[SOURCE]` Fleetio publicly claims work orders, parts inventory, PM scheduling, technician assignments, planned-vs-actual time, maintenance history, mixed in-house/outside maintenance, and AI service-advisor prioritization/review. Sources: https://www.fleetio.com/solutions/fleet-maintenance-software and https://www.fleetio.com/ai

`[SOURCE]` MaintainX's Samsara integration turns real-time DVIRs, fault codes, GPS, geofences, mileage, and engine hours into work requests or work orders, with approval/assignment and closeout sync back to Samsara DVIRs. Source: https://www.getmaintainx.com/integrations/samsara

`[SOURCE]` Fullbay publicly claims service-order workflow, real-time repair status, notes/photos, technician stats, technician notifications, parts readiness, and AI cleanup of technician notes. Sources: https://www.fullbay.com/products/service-orders/ and https://www.fullbay.com/products/integrations/ai-powered-service-order/

`[SOURCE]` Fullbay's Pitstop acquisition post describes predictive maintenance using telematics, sensors, trouble codes, vehicle use patterns, environmental conditions, driver inspections, PM schedules, and repair invoices. Source: https://www.fullbay.com/blog/fullbay-acquires-pitstop-ai-predictive-maintenance/

## Metric Lens

`[AI-INFERENCE]` Current target metric stack:

- Buyer outcome: Asset Uptime.
- Product North Star under debate: Feasible Uptime Recovered.
- Balancers: Committed Plan Yield, Feasible Opportunity Coverage, Ready-by-time Forecast Accuracy, Avoidable Blocked-work Rate.
- Supporting diagnostics: Time to Committed Plan, Technician-ready Handoff Rate, Override Reason Mix, End-of-shift Carryover Completeness.

## Opportunity Map

Scoring: 5 = strongest. Feasibility combines available structured data, likely integration burden, and software existence proof.

| Opportunity | Day-1 Shape | Metric Impact | Feasibility | Structured Data Available | Software Existence Proof | Notes |
|---|---|---:|---:|---|---|---|
| Morning maintenance brief | Pre-shift queue that consolidates overnight DVIRs, faults, PMs, carryover WOs, vendor updates, warranty/parts flags, and asset state. | 5 | 5 | High: Samsara already claims DVIRs, faults, PMs, WOs, asset history, parts, vendors, warranty, invoices. | High: Samsara, Fleetio, MaintainX all show these objects exist. | Best day-1 wedge. Reduces morning archaeology and sets up the planning loop. |
| Readiness classification | Mark each item as ready, blocked, needs review, vendor path, defer, or bundle candidate. | 5 | 4 | Medium-high: parts/POs/status/history exist; technician skill/capacity may need manual input first. | High: Fleetio/Fullbay show parts, tech assignment, service state; MaintainX shows request approval/assignment. | Directly attacks avoidable blocked work. Start rule-based and transparent. |
| Supervisor commit board | Let the supervisor inspect recommendations, drag/adjust, commit a plan, and capture override reasons. | 5 | 4 | Medium: needs work items plus simple capacity/shift model; can start with manual capacity. | High: work-order boards/statuses exist broadly; Fleetio AI also preserves human authority. | Creates the output data needed for learning. Critical for trust. |
| Technician-ready handoff cards | Generate concise work cards with asset, issue source, why today, parts/tools, history, safety flags, expected time, and done criteria. | 4 | 4 | High for source/history; medium for tools/skill/duration. | High: Fullbay/MaintainX/Fleetio all prove technician workflow surfaces. Samsara already claims AI action steps. | Prevents the plan from dying between supervisor and technician. |
| End-of-shift closeout and carryover | Capture done, blocked, deferred, new finding, ETA miss, and reason codes; carry unresolved work into tomorrow's brief. | 4 | 5 | High: status, notes, blockers, WOs can be structured in-product. | High: common in work-order systems. Fullbay and Fleetio show status/labor/progress tracking. | This is the learning loop. Very feasible and underappreciated. |
| Ops-facing ready-by-time view | Show operations which vehicles are ready now, promised by time, unavailable today, or waiting on decision. | 4 | 3 | Medium: maintenance status exists; rental demand/ready-line status may be outside Samsara. | Medium: Samsara claims dispatch/ops visibility, but rental-specific ready-line integration is not proven. | Valuable for Hertz. Day 1 can use supervisor ETA and vehicle class, not full reservation integration. |
| Feasible uptime score | Value-weight each work item by demand pressure, time needed, asset class, days down, criticality, and feasibility. | 5 | 2 | Medium-low: maintenance data exists; demand pressure and local operating value may be missing. | Medium: Fleetio AI prioritizes by risk/cost/operational context; predictive maintenance vendors prove prioritization, but not Hertz-specific value weighting. | This is strategically important, but start as a simple visible score, not a black-box optimizer. |
| Capacity-aware auto-plan | Automatically build the best shift plan from queue, technician roster, skills, parts, duration estimates, and ops demand. | 5 | 2 | Medium-low: many inputs are not guaranteed structured, especially skills, true capacity, duration, and local constraints. | Medium: MaintainX time estimates, Fleetio planned-vs-actual, Fullbay tech stats prove pieces exist. | Too ambitious for day 1 as automation. Useful as "suggested draft plan" with human commit. |
| Parts/vendor orchestration | Recommend or trigger parts ordering, vendor routing, and external shop follow-up. | 3 | 2 | Medium: Samsara claims inventory/PO/vendor; external vendor APIs/statuses uneven. | Medium: Fleetio shop network, Fullbay supplier integrations, Samsara POs. | Valuable, but external dependency heavy. Day 1 should flag blockers, not automate procurement. |
| Predictive fault severity triage | Rank faults by safety/uptime risk and whether the vehicle can stay in service until planned maintenance. | 4 | 2 | Medium: fault codes and history exist; false positives/noise and safety validation are hard. | Medium: Samsara AI fault intelligence; Fleetio AI priorities; Pitstop predictive maintenance. | Good later. Day 1 should explain uncertainty and route high-severity items to review. |

## Scope Debate: Brief vs. Planning UI

`[JAMES]` Taking on the whole planning UI from day one may be too much. There may be more value in starting with roll-up insights and focus areas.

`[AI-INFERENCE]` This is likely the right correction. The v1 does not need to own the plan surface to improve the supervisor's morning. It needs to prepare the supervisor before the plan is made.

### Surface Options

| Surface | Pros | Cons | Recommendation |
|---|---|---|---|
| Predictive morning brief | Lowest workflow disruption. Works even if the shop plans in Samsara, a CMMS, spreadsheet, or whiteboard. Clear value in the first session. | Weaker direct control over plan execution and outcome capture. | Best v1 wedge. |
| Brief plus lightweight action capture | Preserves existing planning surface while capturing "planned, deferred, blocked, sent to vendor, ignored" feedback. | Requires some interaction, but still avoids full planning UI. | Best v1. This keeps the learning loop alive. |
| Embedded planning board | Stronger end-to-end loop and clearer metrics. | Risks duplicating or replacing existing CMMS/planning workflows too early. | Later, after the brief proves repeated use. |
| Full auto-scheduler | Strongest theoretical optimization. | Requires clean capacity, skills, durations, demand, parts, and trust. Too risky for v1. | Not v1. |

### Recommended UI Surface

`[AI-DRAFT]` The Predictive Morning Brief should live as a new tab or module inside **Samsara Connected Maintenance**, not as a standalone product surface.

Recommended placement:

`[AI-DRAFT]` Add a **Brief** or **Morning Brief** tab alongside existing maintenance surfaces such as asset status, faults, DVIRs, schedules, issues, work orders, cost, inventory, warranty, and vendor/spend views.

Why:

- `[AI-INFERENCE]` Connected Maintenance already owns the relevant data context: DVIRs, faults, PMs, work orders, inventory, POs, warranty, vendors, invoices, spend, and asset history.
- `[AI-INFERENCE]` Supervisors should not have to adopt a new planning workspace before they trust the recommendations.
- `[AI-INFERENCE]` A tab/module can deep-link into existing work orders, assets, inventory, vendor records, or third-party CMMS records.
- `[AI-INFERENCE]` The brief can later expand into action capture, work-order creation, planning, or scheduling if usage proves value.

Secondary entry points:

- Daily email digest for managers who start the morning outside Samsara.
- Mobile push or inbox card for urgent focus areas.
- Dashboard home card showing "Today's maintenance focus areas."
- Asset/work-order side panel showing why an item appeared in the brief.

Non-goal:

`[AI-INFERENCE]` Do not create a separate "Asset Uptime Command Center" for v1. That would imply new workflow ownership before the brief has earned trust.

### Revised V1 Thesis

`[AI-DRAFT]` Start with a **Predictive Morning Brief** that plugs into the supervisor's existing workflow instead of replacing it.

`[AI-INFERENCE]` The brief can be useful with partial context. It does not require every system to be connected on day one. Each additional data source makes the brief more complete and raises the ceiling on what it can recommend.

The brief should answer:

1. What changed overnight?
2. Which assets are the highest-value focus areas today?
3. Which work is ready now?
4. Which work looks important but is blocked?
5. Which work should be bundled, deferred, or sent to a vendor?
6. What context should the supervisor verify before the huddle?
7. What did yesterday's plan miss, block, or carry over?

`[AI-INFERENCE]` This is still an Asset Uptime product. It just enters as a decision-prep layer before becoming a planning system.

### Compounding Context Model

`[AI-INFERENCE]` Design the product so each connected data source unlocks a clearer kind of morning insight.

| Connected Context | Useful Brief Even Without Full Planning UI |
|---|---|
| DVIRs and defects | "These driver-reported issues need triage before dispatch." |
| Fault codes | "These active faults are new, recurring, or severity-review candidates." |
| PM schedules and mileage/hours | "These assets are due soon and can be bundled with current work." |
| Parts inventory | "These jobs are ready because parts are on hand; these are blocked before a technician starts." |
| Purchase orders | "These blocked jobs may become ready today when inbound parts arrive." |
| Work-order history | "This is a repeat issue or recently repaired component." |
| Warranty status | "Route this through warranty before approving paid repair." |
| Vendor status/invoices | "These vendor jobs are aging or cost outliers." |
| Technician roster/skills | "These focus areas fit today's capacity; these require a specialist." |
| Rental/ops demand | "These vehicle classes matter most before the next demand peak." |

`[AI-INFERENCE]` This supports a land-and-expand product strategy: start with one or two high-confidence insight types, prove daily usefulness, then earn permission to connect more systems and take on more workflow ownership.

### Minimum Viable Context

`[AI-INFERENCE]` The minimum viable brief should include at least one of these data clusters:

1. Maintenance demand cluster: DVIRs, fault codes, PMs, carryover work.
2. Readiness cluster: parts inventory, POs, warranty/vendor status.
3. Operational value cluster: asset class, availability status, demand pressure, days out of service.

`[AI-INFERENCE]` If v1 only has one cluster, start with the clearest operational pain. For example, a parts-only brief can still say: "Do not assign these jobs first; they are blocked. These five jobs are ready because parts are on hand."

`[AI-DRAFT]` Product principle: deliver useful focus areas with partial context, then improve recommendations as more systems connect.

### Minimum Feedback Loop

`[AI-INFERENCE]` A read-only report is valuable but strategically weaker because it does not create enough output data. The v1 should include very light feedback capture without owning the full plan:

- Mark item as planned today.
- Mark item as deferred with reason.
- Mark item as blocked with blocker reason.
- Mark item as sent to vendor.
- Mark "not relevant" or "already handled."
- Deep link to existing work order / asset / CMMS record.

`[AI-INFERENCE]` This gives Samsara the training and evaluation data needed for better recommendations later, while still respecting existing supervisor workflows.

## Recommended Day-1 Scope

`[AI-DRAFT]` The first useful product is not an autonomous maintenance planner or a full planning board. It is a **Predictive Morning Brief** that prepares the supervisor, highlights focus areas, and captures lightweight feedback while the supervisor still plans in the tools they already use.

### Must Have

1. Morning maintenance brief.
2. Readiness classification.
3. Focus areas ranked by feasible uptime impact.
4. Lightweight action capture: planned, deferred, blocked, vendor, ignored/already handled.
5. Deep links or handoff snippets into the existing planning/work-order surface.
6. End-of-shift follow-up and carryover summary.

`[AI-INFERENCE]` These pieces are the best value/feasibility mix because they mostly use data Samsara already claims or data common CMMS tools already structure. They also create enough output data for the predictive loop without forcing a new planning UI.

### Should Have

1. Ops-facing ready-by-time summary.
2. Suggested technician-ready work-card content.
3. Simple feasible uptime score.

`[AI-INFERENCE]` These are important for the Hertz story, but can start lightweight. The v1 can summarize likely ready-by-time impact and produce handoff content without replacing the underlying work-order or technician-execution system.

### Later

1. Supervisor commit board.
2. Embedded planning board.
3. Capacity-aware auto-plan.
4. Parts/vendor orchestration.
5. Predictive fault severity triage.

`[AI-INFERENCE]` These are real opportunities but should not be v1 dependencies. They need richer structured context, more historical data, stronger safety validation, or third-party cooperation.

## Why This Is The Best Wedge

`[AI-INFERENCE]` This scope moves the most important metrics without pretending to solve the full optimization problem.

| Metric | Day-1 Product Motion |
|---|---|
| Feasible Uptime Recovered | Surfaces high-value, feasible work before the supervisor makes the plan. |
| Committed Plan Yield | Starts as a sampled or follow-up metric, not a full in-product commitment metric. |
| Feasible Opportunity Coverage | Shows what high-value feasible work the brief recommended and whether the supervisor marked it planned, deferred, blocked, or irrelevant. |
| Ready-by-time Forecast Accuracy | Starts with predicted ready-by-time ranges and end-of-shift follow-up. |
| Avoidable Blocked-work Rate | Flags and records known-before-start blockers. |
| Time to Committed Plan | Reduces queue gathering and manual reconciliation. |
| Technician-ready Handoff Rate | Produces suggested work-card context that can be copied, attached, or opened in the existing work-order surface. |
| Override Reason Mix | Captures simple feedback when supervisors mark recommendations deferred, blocked, already handled, or wrong. |
| End-of-shift Carryover Completeness | Converts execution reality into tomorrow's starting state. |

## Prototype Implication

`[AI-DRAFT]` The prototype should show one supervisor morning at Hertz LAX:

1. The supervisor opens the Predictive Morning Brief before the huddle.
2. The brief summarizes overnight changes, carryover work, blocked items, and highest-value focus areas.
3. Each focus item explains why it matters today, whether it is ready, what is blocking it, and what existing record it links to.
4. The supervisor marks a few recommendations as planned, deferred, blocked, sent to vendor, or already handled.
5. The supervisor uses the existing work-order/planning surface for actual assignment.
6. At end of shift, the brief follows up on the marked focus items and carries unresolved work into tomorrow.

`[AI-INFERENCE]` This demonstrates a credible loop without claiming Samsara owns the whole planning UI on day one.

## Open Decision For James

`[AI-DRAFT]` Recommended v1 wedge: **Predictive Morning Brief + lightweight feedback loop**.

Accepting this means we should defer full planning UI, full auto-scheduling, deep vendor ordering, and predictive severity automation from the take-home's main prototype.
