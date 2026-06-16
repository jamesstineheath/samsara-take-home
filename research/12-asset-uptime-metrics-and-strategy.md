# Asset Uptime Metrics And Strategy

Date: 2026-06-14
Status: strategy and metrics framing for James review. Not final memo language.
Purpose: define the metric logic and high-level strategy before answering the open scope questions about replanning, ops view, integrations, and local context.

## James Input

`[JAMES]` Use Asset Uptime as the general product frame. Revenue-readiness is the Hertz LAX expression.

`[JAMES]` Pause the open workflow questions until after defining metrics and a high-level strategy for how Samsara should approach the daily planning tool.

`[JAMES]` For predictive tools, think about input data, output data, and the full loop, not just a linear path of data.

## Executive Read

`[AI-INFERENCE]` The product should not optimize for "more work orders processed." It should optimize for assets becoming usable again faster and with fewer avoidable planning failures.

`[AI-INFERENCE]` For Hertz LAX, the asset uptime outcome is: vehicles return to rentable inventory at the right time, in the right class mix, with fewer avoidable holds.

`[JAMES]` The key Hertz Q1 2026 operating bridge is utilization, revenue per unit, revenue per day, depreciation per unit, and direct operating expense per transaction day.

`[SOURCE]` Hertz's Q1 2026 release reports Utilization, RPU, RPD, Net DPU, DOE per Transaction Day, recall impact on utilization and transaction days, and an advanced fleet planning engine.

`[AI-INFERENCE]` The high-level strategy should be: start with a human-reviewed planning loop that improves plan quality and closes the feedback loop, then automate more decisions only after the system can observe outcomes reliably.

## Recommended Locked Metric Set

Status: `[AI-DRAFT]` under debate after James challenged whether the product North Star can be gamed by overly conservative or overly aggressive planning.

`[AI-INFERENCE]` The metric set should separate the buyer outcome from the product's controllable daily behavior.

### 1. Buyer Outcome

`[AI-DRAFT]` Asset Uptime.

Definition:

`[AI-INFERENCE]` The share of assets that are available for productive use when the operation needs them.

For Hertz LAX:

`[AI-INFERENCE]` Asset Uptime means the right vehicles are rentable at the right time, in the right vehicle class, with no unresolved maintenance, safety, recall, cleaning, charging, or operational hold.

Why this is the top outcome:

- It generalizes beyond Hertz.
- It maps cleanly to Hertz's utilization and transaction-day language.
- It keeps the product focused on usable assets, not maintenance activity.

### 2. Product North Star Candidate Under Debate

`[AI-DRAFT]` Committed Plan Yield.

Definition:

`[AI-INFERENCE]` The number and rate of committed-plan assets that reach the promised usable state during the planning window.

Plain-language version:

`[AI-DRAFT]` Of the assets the supervisor committed to get back today, how many actually became usable when promised?

For Hertz LAX:

`[AI-INFERENCE]` Track this by vehicle class and demand pressure, because returning a high-demand SUV before the afternoon rental rush is more valuable than returning an unconstrained class.

Why this should be the product North Star:

- It is close enough to the user workflow that the product can affect it.
- It forces the plan to include output and outcome data, not just prediction.
- It captures planning quality, handoff quality, and execution reality in one loop.
- It avoids the trap of optimizing for work orders closed.

Guardrail:

`[AI-INFERENCE]` Do not use yield alone. A team could improve yield by committing too little or only choosing easy work. Pair it with volume, criticality, and safety guardrails.

### Debate: Gaming Risk In Committed Plan Yield

`[JAMES]` Committed Plan Yield does not account for whether the plan was too aggressive or too conservative. A supervisor or product could game it by committing only easy work, or by overcommitting and creating an unrealistic plan.

`[AI-INFERENCE]` This critique is right. Committed Plan Yield is useful, but it is not strong enough as the single product North Star. It measures reliability against a committed promise, but not ambition, opportunity capture, or capacity fit.

Failure modes:

- Conservative plan: commit three easy assets, return all three, show 100% yield, leave high-value recoverable assets idle.
- Aggressive plan: commit twenty assets, return eight, create downstream distrust even if the absolute number returned is higher.
- Misprioritized plan: return lower-value assets while high-demand vehicle classes or high-risk assets wait.

Better structure:

`[AI-DRAFT]` Use **Feasible Uptime Recovered** as the product North Star, with Committed Plan Yield demoted to a balancing reliability metric.

Plain-language version:

`[AI-DRAFT]` Of the uptime the shop could realistically recover this shift, how much valuable asset availability did the plan actually recover?

Definition:

`[AI-INFERENCE]` Feasible Uptime Recovered measures value-weighted assets returned to usable state from the recoverable maintenance queue, normalized against realistic constraints such as technician capacity, parts availability, vehicle location, vendor readiness, approval status, and safety/recall requirements.

For Hertz LAX:

`[AI-INFERENCE]` Weight recovered vehicles by operational value: vehicle class demand pressure, time until needed, days out of service, customer/ready-line impact, and safety or recall urgency.

Why this is harder to game:

- A conservative plan scores poorly if it ignores feasible high-value work.
- An aggressive plan scores poorly if it commits work that cannot realistically return to service.
- A misprioritized plan scores poorly if it returns low-value assets while high-value feasible assets wait.
- A good plan must balance ambition, feasibility, and operational value.

Metric stack after this change:

| Layer | Metric | Role |
|---|---|---|
| Buyer outcome | Asset Uptime | What the customer ultimately cares about. |
| Product North Star | Feasible Uptime Recovered | Whether the planning loop converts feasible maintenance opportunity into valuable usable assets. |
| Reliability metric | Committed Plan Yield | Whether the committed promises were met. |
| Ambition metric | Feasible opportunity coverage | Whether the plan captured enough of the realistic high-value queue. |
| Trust metric | Ready-by-time forecast accuracy | Whether operations can rely on the plan. |
| Execution-quality metric | Avoidable blocked-work rate | Whether the plan avoided known-before-start failures. |

### 3. Core Diagnostic Metrics

| Metric | Lock? | What It Tells Us |
|---|---:|---|
| Avoidable blocked-work rate | Yes | Whether the plan prevented known-before-start failures: no part, wrong asset location, no tech skill, no approval, vendor not ready. |
| Ready-by-time forecast accuracy | Yes | Whether maintenance can give operations a believable asset availability promise. |
| Time to committed plan | Yes | Whether the product reduces morning archaeology for the supervisor. |
| Technician-ready handoff rate | Yes | Whether assigned work cards have enough context for technicians to act without another translation step. |
| Override rate and reason mix | Yes | Where the system was wrong, overconfident, missing local context, or contradicted by supervisor judgment. |
| End-of-shift carryover completeness | Yes | Whether tomorrow starts with a clean state instead of rediscovery. |

### 4. Guardrail Metrics

| Metric | Why It Is Needed |
|---|---|
| Critical issue review coverage | Ensures safety, recall, high-severity fault, and non-rentable issues are reviewed, not buried by productivity goals. |
| Repeat repair / reopened issue rate | Prevents rushing assets back into service with unresolved problems. |
| Deferred high-risk work aging | Prevents the plan from repeatedly pushing hard or inconvenient work into the future. |
| Technician trust / acceptance | Ensures the plan is usable by the people who have to execute it. This can start qualitative before it becomes a scored metric. |

### 5. Metrics Not To Lead With

`[AI-INFERENCE]` These can appear in supporting analysis, but should not be the main success metric:

- Work orders closed.
- Alerts reviewed.
- AI recommendations accepted.
- Time spent in product.
- Number of integrations connected.
- Invoices processed.

Why:

`[AI-INFERENCE]` These measure activity or adoption surfaces. They do not prove that the product improved Asset Uptime.

## Metric Hierarchy

### North Star Candidate

`[AI-DRAFT]` Shift-level assets returned to service from the committed maintenance plan.

Definition:

`[AI-INFERENCE]` Count assets that were included in the supervisor's committed plan and reached a usable/available state during the relevant shift or planning window.

For Hertz LAX:

`[AI-INFERENCE]` "Returned to service" means the vehicle is not just repaired. It is rentable or on the final path to rentable: repair complete, no active safety/recall hold, and ready-line/operations state updated.

Why this works:

- It ties the product to Asset Uptime.
- It rewards execution, not just planning.
- It forces the loop to include output data and outcome data.
- It discourages optimizing for closed work orders that do not create usable assets.

Risk:

`[AI-INFERENCE]` This metric can bias toward easy same-day work. It needs guardrail metrics for safety, compliance, critical defects, and deferred risk.

### Supporting Outcome Metrics

| Metric | What It Measures | Why It Matters | Watchout |
|---|---|---|---|
| Same-shift return-to-service rate | % of committed planned assets that return to usable state in the shift. | Shows whether the plan was realistic and executable. | Can encourage only easy work unless paired with risk/criticality. |
| Avoidable blocked-work rate | % of assigned jobs blocked by known-before-start issues: no part, wrong location, no tech skill, no approval, vendor not ready. | Directly measures planning quality. | Requires clean blocker reason capture. |
| Plan adherence with justified overrides | % of committed plan completed or changed with an explicit reason. | Measures whether the plan survives reality and whether drift is explained. | A rigid adherence metric can punish good replanning. |
| Mean time from issue intake to committed decision | Time from signal arrival to supervisor decision: assign, defer, vendor, blocked, needs review. | Measures whether the tool reduces morning archaeology. | Decision quality matters more than raw speed. |
| Availability forecast accuracy | Accuracy of ready-now / ready-by-time / unavailable-today predictions. | Connects maintenance plan to operations trust. | Needs rental-ops availability data. |
| Repeat repair / reopened issue rate | % of assets returning with same issue after closeout. | Guardrail for rushing work back to service. | Needs reliable issue matching. |
| Critical issue review coverage | % of safety, recall, high-severity fault, or non-rentable issues reviewed before shift/huddle. | Ensures the tool handles high-risk work. | Needs severity taxonomy and confidence. |

### User Workflow Metrics

| Metric | Product Question |
|---|---|
| Time to first committed plan | Does the supervisor get from fragmented inputs to plan faster? |
| Percent of plan items with visible reasoning | Can the supervisor inspect why the tool recommended the work? |
| Override rate and override reason mix | Where is the model wrong, missing context, or too aggressive? |
| Percent of assigned jobs with complete work card | Does the technician receive enough context to execute without a second translation step? |
| Blocker update latency | How quickly does the system learn that a job is blocked or stale? |
| End-of-shift carryover completeness | Does tomorrow start with a clean state rather than rediscovery? |

### Business Metrics

These matter for the buyer and memo, but they are lagging indicators for the v1 product:

- Asset uptime.
- Average downtime.
- Vehicle utilization.
- Transaction days protected.
- Direct operating expense per transaction day.
- Revenue per unit.
- Revenue per day.
- Net depreciation per unit.
- Maintenance cost per rentable day or operating day.
- Vendor turnaround.
- Warranty/recovery dollars captured.
- Customer wait time from vehicle availability issues.

`[AI-INFERENCE]` In the memo, use these as the value story. In the product, use the workflow metrics to prove the tool is moving the daily behavior that can influence them.

### Hertz Buyer Metric Bridge

`[AI-INFERENCE]` The daily planning tool should be explained as a way to protect Hertz's operating model, not just as a maintenance productivity tool.

| Hertz Metric | How Asset Uptime Planning Can Move It | Product Proof Point |
|---|---|---|
| Utilization | More assets are usable when demand exists. Fewer vehicles sit unavailable because of avoidable maintenance blockers. | Same-shift return-to-service rate, ready-line availability forecast accuracy, avoidable blocked-work rate. |
| Transaction days | Faster return to service protects rental days that would otherwise be lost to holds, recalls, parts gaps, or stale work. | Assets returned to service from committed plan, downtime avoided, recall/hold aging. |
| Revenue per unit | Keeping the right vehicle classes available helps each fleet unit generate more revenue over the period. | Class-weighted return-to-service and availability forecast accuracy by class. |
| Revenue per day | Better availability during demand peaks supports stronger revenue per available rental day. | Ready-by-time accuracy during high-demand windows. |
| Net depreciation per unit | Better planning can inform whether to repair, hold, route to vendor, or avoid low-value work near de-fleet timing. | Later-stage metric; not v1 core except as asset context. |
| DOE per transaction day | Fewer wasted starts, fewer avoidable blockers, better vendor routing, and less replanning reduce operating cost per rental day. | Avoidable blocked-work rate, technician time lost to missing context, vendor ETA accuracy. |

`[AI-INFERENCE]` This creates a clean ladder:

Daily product behavior -> asset uptime outcomes -> utilization and transaction days -> RPU/RPD/DOE/DPU business impact.

## Metric Trap To Avoid

`[AI-INFERENCE]` Do not make "work orders closed" the main success metric.

Why:

- A closed work order may not mean the asset is usable.
- It can encourage closing easy work while hard blockers age.
- It misses rental operations status.
- It does not prove the predictive loop learned anything.

Better:

`[AI-DRAFT]` Measure whether the committed plan caused assets to become usable faster, with fewer known-before-start blockers, and with better forecast accuracy for operations.

## High-Level Strategy

### Strategic Thesis

`[AI-DRAFT]` Samsara should approach the daily planning tool as an Asset Uptime operating loop, not a generic AI scheduler.

The loop:

1. Sense maintenance and operations signals.
2. Prepare a draft plan.
3. Let the supervisor inspect and commit.
4. Hand off technician-ready work.
5. Track blockers and outcomes.
6. Update asset availability.
7. Learn from overrides, blockers, and return-to-service results.

### Why Samsara Is Credible Here

`[SOURCE]` Samsara already claims telematics, fault codes, DVIRs, PMs, work orders, inventory, vendors, invoices, warranty, asset history, and integrations.

`[AI-INFERENCE]` Competitors can credibly claim work orders, PMs, inventory, technician execution, and AI review. Samsara's differentiated angle is using connected operations data to power a supervisor-owned planning loop.

`[AI-INFERENCE]` Hertz LAX makes this concrete because maintenance status must be connected to rentable availability, vehicle class demand, and local shop execution.

### Samsara Product Principles To Reflect

`[AI-INFERENCE]` Samsara does not appear to publish one canonical "product principles" document. Its public materials still point to a consistent product-building posture:

| Principle | Source Basis | Implication For Asset Uptime Strategy |
|---|---|---|
| Start in the customer's real operation. | `[SOURCE]` Samsara's Culture Playbook says teams should "sample the customer experience," demo often, and run feedback loops. The Maintenance PM role says the PM should spend serious time on-site learning work-order flow, parts tracking, and how teams decide what gets fixed today versus next week. Sean McGee says the opportunity became clear by getting into shops and talking to operators. Sources: https://www.samsara.com/blog/the-samsara-culture-playbook, https://www.samsara.com/company/careers/roles/7269221, https://www.samsara.com/blog/inside-connected-maintenance-sean-mcgee | Build from the maintenance supervisor's huddle, queue triage, parts constraints, and handoff to technicians. Avoid a generic AI scheduler. |
| Build connected workflows, not isolated tools. | `[SOURCE]` Samsara's stated vision is to be the system of record for physical operations by collecting and connecting operational data and using AI to deliver insights. Sean McGee describes maintenance as a connected ecosystem across OEMs, drivers, in-house shops, third-party vendors, ERPs, automations, and analytics. Sources: https://www.samsara.com/blog/the-samsara-culture-playbook, https://www.samsara.com/blog/inside-connected-maintenance-sean-mcgee | The v1 should join maintenance demand, asset status, technician capacity, parts/vendor readiness, and rental ops pressure into one planning loop. |
| Make insight actionable for teams. | `[SOURCE]` Samsara's platform design principles are unified platform, intuitive design, and built for teams. Samsara Intelligence frames AI as insights, recommendations, and actions embedded into operations. The Safety Inbox post argues that impact comes from context-rich, actionable insights rather than more data. Sources: https://www.samsara.com/blog/meet-the-new-samsara-platform-experience, https://www.samsara.com/blog/announcing-samsara-intelligence, https://www.samsara.com/blog/ai-powered-insights-intelligent-safety-inbox-built-for-action | The product output should be an inspectable committed plan, technician-ready work cards, and ops-facing availability forecasts, not a dashboard of interesting alerts. |
| Reduce administrative burden and amplify field expertise. | `[SOURCE]` Sean McGee says maintenance professionals have deep expertise and the software should amplify it, reduce admin burden, and let them focus on fixing things. Source: https://www.samsara.com/blog/inside-connected-maintenance-sean-mcgee | Use AI to prepare, explain, prefill, summarize, and capture outcomes. Keep the supervisor in control at commit time. |
| Iterate with objective data. | `[SOURCE]` Samsara's values and Culture Playbook emphasize feedback loops, iteration, and using objective data to see whether something worked. Sources: https://www.samsara.com/blog/what-we-value-at-samsara, https://www.samsara.com/blog/the-samsara-culture-playbook | Treat overrides, blocker reasons, ETA misses, and return-to-service outcomes as first-class output data. The loop has to learn from execution, not only from input signals. |
| Balance customer value, technical feasibility, and business impact. | `[SOURCE]` The Maintenance PM role says product strategy should balance customer value, technical feasibility, and business impact; it also calls for success criteria, stage gates, and measurable business results. Source: https://www.samsara.com/company/careers/roles/7269221 | The metric ladder should connect daily workflow metrics to Asset Uptime, then to Hertz buyer metrics like utilization, transaction days, revenue per unit, revenue per day, depreciation per unit, and direct operating expense per transaction day. |
| Build for the long term, but deliver iteratively. | `[SOURCE]` Samsara's values include building for the long term. The Culture Playbook says to work with urgency, deliver iteratively, and build for the long term while delivering in weeks. Sean McGee points to a larger asset lifecycle management vision. Sources: https://www.samsara.com/blog/what-we-value-at-samsara, https://www.samsara.com/blog/the-samsara-culture-playbook, https://www.samsara.com/blog/inside-connected-maintenance-sean-mcgee | Start with a narrow daily planning wedge at Hertz LAX, but design the model as Asset Uptime so it can generalize to trucks, trailers, rental cars, equipment, vendors, warranty, and lifecycle decisions. |

`[AI-DRAFT]` Samsara-like strategy sentence: Build the Asset Uptime planner from the customer's operating loop backward: start on-site with the supervisor's daily planning workflow, connect the data Samsara already sees with the local context it needs, deliver an inspectable plan the team can act on, and measure whether assets actually return to service.

### Wedge Strategy

Start where the loop breaks most clearly:

`[AI-INFERENCE]` Output actionability and feedback quality.

Why:

- Input data will never be perfect at v1.
- A perfect prediction still fails if it lands as a vague ranked list.
- A useful plan creates structured output data: assignment, blocked reason, override reason, ETA, done criteria, and outcome.
- That output data becomes the training and evaluation data for better recommendations later.

### Build Order

1. **Plan preparation:** ingest and reconcile maintenance demand, asset state, parts/vendor state, local roster, and operations pressure.
2. **Supervisor commit:** show reasoning, confidence, tradeoffs, and missing data; require human approval.
3. **Executable handoff:** generate technician-ready work cards and ops-facing availability forecast.
4. **Outcome capture:** record blocker, completion, returned-to-service state, ETA accuracy, and override reason.
5. **Learning loop:** improve readiness estimates, task duration, vendor routing, and prioritization based on outcomes.

### What To Defer

- Autonomous assignment without supervisor commit.
- Deep vendor/dealer APIs as a v1 dependency.
- Automatic parts ordering.
- Full technician app replacement.
- Full rental operations replacement.
- Repair-versus-retire optimization.

## Implications For Open Questions 2-5

Do not answer these fully yet, but metrics start to constrain them:

| Open Question | What Metrics Suggest |
|---|---|
| Pre-shift only vs midday replanning | If plan adherence and blocker update latency matter, v1 probably needs at least a lightweight plan-change loop. |
| Ops readiness view or not | If availability forecast accuracy matters, v1 likely needs some ops-facing output, even if simple. |
| Assume reservation/ready-line integrations | If the North Star is returned-to-service / asset uptime, reservation and ready-line data become high-value inputs, but v1 can mock them. |
| Which local context to capture | Start with the fields that reduce avoidable blocked work: technician roster, vehicle location/state, parts confidence, and supervisor override reason. |

## Draft Strategy Sentence

`[AI-DRAFT]` Start with a daily Asset Uptime planning loop for the maintenance supervisor: prepare the plan before the huddle, make the reasoning inspectable, turn the plan into executable technician work, and capture whether the asset actually returned to service so the next plan gets smarter.

## Check-In Before Solution Brainstorming

1. Does the North Star candidate work: "shift-level assets returned to service from the committed maintenance plan"?
2. Are the top diagnostic metrics the right ones: avoidable blocked-work rate, forecast accuracy, plan adherence with justified overrides, and critical issue review coverage?
3. Should the strategy explicitly say Samsara should first improve the output/feedback loop before trying to improve prediction sophistication?
4. Is "Asset Uptime operating loop" strong enough as the high-level strategy language?
