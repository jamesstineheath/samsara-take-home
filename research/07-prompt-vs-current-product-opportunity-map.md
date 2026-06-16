# Prompt Vs Current Product Opportunity Map

Date: 2026-06-13
Status: research synthesis, not a final scope decision.
Primary sources: `sources/assignment-prompt.annotatable.md`, `sources/samsara-connected-maintenance-page-capture.md`.

## Core Read

`[SOURCE]` The assignment says maintenance supervisors still piece together the morning plan from work orders, overdue PM schedules, DVIR defect reports, active fault codes, and their own mental model of what is in the shop.

`[SOURCE]` The current Samsara page says Connected Maintenance already includes work orders, smart work-order suggestions, a unified asset view, AI fault-code intelligence, AI invoice scanning, inventory, POs, warranty, cost reporting, vendor performance, migration, and integrations.

`[JAMES]` Gut reaction: the prompt seems to point toward proactive agentic work happening in the background, prepared in advance for the fleet manager.

`[AI-INFERENCE]` That gut reaction is directionally right, with one refinement: the primary user in the prompt is the maintenance supervisor, not the fleet manager. The opportunity is likely an agentic preparation layer plus a deterministic review/commit surface for the supervisor.

## Inferred Product Opportunities

### 1. Pre-Shift Plan Preparation

`[AI-INFERENCE]` The clearest opportunity is background work that prepares a draft daily maintenance plan before the supervisor starts the shift.

What the agent prepares:

- New work from DVIR defects.
- Active/confirmed fault-code issues.
- Overdue and upcoming PMs.
- Carryover work from yesterday.
- Assets already in the shop.
- Parts, warranty, vendor, and PO constraints.
- Suggested bundles and deferrals.
- Open decisions that need supervisor judgment.

Why this is additive:

`[SOURCE]` Samsara claims the data objects exist.
`[SOURCE]` The prompt says planning still happens on whiteboards and in heads.
`[AI-INFERENCE]` The gap is the morning synthesis and commitment ritual, not raw data capture.

### 2. Readiness-Aware Work Queue

`[AI-INFERENCE]` The current page talks about smart work-order suggestions, but the prompt implies a harder question: which work can actually happen today?

Readiness dimensions:

- Safety/compliance urgency.
- Asset needed today or available for shop time.
- Parts available, on order, or missing.
- Technician skill and availability.
- Bay/shop capacity.
- Warranty or dealer path.
- Vendor turnaround and cost.
- False-positive/noisy alert confidence.

Why this is additive:

`[SOURCE]` The page claims work orders, parts, PO, warranty, vendor, fault, and PM data.
`[AI-INFERENCE]` It does not clearly show a cross-queue planning surface that turns those inputs into an executable plan.

### 3. Human-Approved Agentic Recommendations

`[AI-INFERENCE]` The right AI boundary is probably "prepare and recommend," not "autonomously assign all work."

The agent can:

- Summarize what changed overnight.
- Recommend priority order.
- Propose bundled repairs.
- Flag blocked work.
- Draft technician instructions.
- Explain tradeoffs.
- Ask for approval before committing assignments or vendor actions.

Why this is additive:

`[SOURCE]` The prompt values a UX for planning daily work.
`[AI-INFERENCE]` Supervisors need trust, override, and accountability because plan quality depends on local context and physical constraints.

### 4. Structured Capture Of Tacit Shop Knowledge

`[SOURCE]` The prompt explicitly names the supervisor's mental model of what is in the shop.

`[AI-INFERENCE]` A product opportunity is converting just enough tacit shop context into lightweight structured inputs:

- Which assets are physically in the shop or yard.
- Which bays are open.
- Who is absent or overloaded.
- Which technician is best for which job.
- Which parts are informally reserved.
- Which dispatch commitments are non-negotiable.

Why this is additive:

`[SOURCE]` The website already structures many system-generated inputs.
`[AI-INFERENCE]` The remaining planning gap may come from missing local context rather than missing software features.

### 5. Operations Handoff And Plan Change Loop

`[AI-INFERENCE]` The assignment's morning plan is not complete until operations/dispatch knows which assets are ready, down, or at risk.

Possible v1 outputs:

- Committed technician plan.
- Asset readiness list.
- "At risk for today" list.
- Blockers by parts/vendor/warranty/capacity.
- Dispatch-facing summary.
- Midday plan-change log.

Why this is additive:

`[SOURCE]` Samsara says dispatch and operations can see repair status.
`[AI-INFERENCE]` The prompt points to a planning workflow before and during execution, not just passive status visibility.

## What This Is Not

`[AI-INFERENCE]` Based on the current page, these are weaker product wedges:

- Generic unified dashboard.
- Another work-order creation flow.
- DVIR-to-work-order automation.
- Invoice scanning.
- Warranty extraction.
- Fleet-wide spend analytics.
- Full CMMS replacement.
- Open-ended chat assistant.

## One-Sentence Opportunity

`[AI-DRAFT]` Build a pre-shift planning assistant that works overnight to turn Samsara's maintenance signals into a readiness-aware daily plan the supervisor can inspect, adjust, and commit before the shop starts work.

## Open Scope Questions

- `[JAMES]` Should the primary user remain maintenance supervisor, or should the memo say fleet manager as buyer/secondary user?
- `[AI-INFERENCE]` Which customer segment makes the pre-shift plan most concrete?
- `[AI-INFERENCE]` Is v1 only pre-shift planning, or does it include midday replanning?
- `[AI-INFERENCE]` What actions can the agent take without approval: summarize, rank, draft, assign, order parts, notify dispatch, or contact vendor?
- `[AI-INFERENCE]` Which missing data should be manually captured in v1 versus assumed from Samsara systems?
