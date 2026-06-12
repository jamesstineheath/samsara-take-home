# Primary-Source Research Report Scaffold

Date: 2026-06-12

Triggered by James annotation on the prompt's research instruction: "Yeah this feels like a cited research report that I should then go in and read the primary sources and assess as a research report."

Status: research workflow scaffold. This is not the final research report and not memo language.

## Purpose

`[JAMES]` The fleet-maintenance research should become a cited research report that James can read, inspect, and challenge source-by-source.

`[AI-INFERENCE]` The goal is not to maximize the number of citations. The goal is to produce a compact set of source-backed findings that James understands well enough to defend live.

`[AI-INFERENCE]` The research report should answer: how does fleet maintenance planning actually work, what makes the morning planning job hard, and which facts should constrain the take-home scope?

## Source-Quality Rules

### Strongest Sources

Use these as the backbone of claims:

- `[SOURCE]` The Samsara assignment prompt and email thread.
- `[SOURCE]` Samsara's current Connected Maintenance product page: https://www.samsara.com/products/telematics/fleet-maintenance
- `[SOURCE]` Sean McGee's Samsara interview about Connected Maintenance: https://www.samsara.com/blog/inside-connected-maintenance-sean-mcgee
- `[SOURCE]` Operator/customer stories with named practitioners, such as Garden City Public Schools: https://www.samsara.com/blog/modernizing-maintenance-operations-for-better-efficiency
- `[SOURCE]` Public regulatory sources, especially 49 CFR Part 396 for inspection, repair, maintenance, DVIRs, corrective action, and recordkeeping: https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-396
- `[SOURCE]` Public job descriptions from fleet operators, transit agencies, school districts, municipalities, and public works departments.

### Useful But Lower-Weight Sources

Use these for workflow vocabulary and market pattern recognition, not as proof:

- Vendor/product pages from CMMS/fleet maintenance tools.
- Integration pages showing how systems exchange DVIRs, work orders, fault codes, parts, and assignments.
- Trade publications and industry explainers.
- SEO-style maintenance articles.

### Do Not Use As Core Evidence

- Unsourced AI summaries.
- Generic productivity claims.
- Broad claims about AI unless tied to operational data and human review.
- Vendor claims that are not grounded in a workflow, customer story, or regulatory requirement.

## Research Report Shape

The report should be short enough for James to actually read.

### 1. Executive Findings

Purpose:

- 5-7 bullets that summarize what the research changes about our product judgment.

Quality bar:

- Each finding must cite at least one source.
- Each finding must say what product decision it informs.
- Findings should be tagged as `[SOURCE]`, `[AI-INFERENCE]`, or `[JAMES]`.

### 2. How The Morning Planning Workflow Works

Purpose:

- Explain the pre-shift, start-of-shift, plan commitment, and during-day adaptation flow.

Evidence to include:

- Prompt inputs: work orders, overdue PMs, DVIR defects, active faults, mental model.
- Public role descriptions: scheduling, assigning, work priorities, PM, parts, costs, compliance.
- Regulatory context: inspection/repair/maintenance duties, DVIR defects, corrective action, recordkeeping.
- Customer story examples: paper DVIRs, delayed work orders, defects falling through cracks, PM overrun, repair consolidation.

### 3. What Current Samsara Already Does

Purpose:

- Prevent us from proposing something Samsara already says it does.

Evidence to include:

- Smart work orders from DVIRs.
- Consolidating shop visits.
- Unified asset maintenance view.
- Fault-code intelligence and AI action steps.
- Inventory, parts, purchase order, warranty, vendor, invoice, and cost reporting.
- Dispatch/operations visibility into asset repair status.

### 4. What Remains Hard

Purpose:

- Identify the remaining product opportunity without overclaiming.

Candidate areas to validate:

- Daily plan assembly across multiple demand signals and constraints.
- Prioritization under safety/compliance, operational, technician, parts, vendor, and shop-capacity constraints.
- Converting whiteboard/head knowledge into structured planning data.
- Trust and override in agentic planning.
- Segment-specific planning pressure, such as school bus route readiness or municipal/public works coverage.

### 5. Source Evidence Table

Use this table format.

| Claim | Source | Source Type | Evidence Strength | James Review | Decision Impact |
|---|---|---|---|---|---|
| Example: DVIR defects can create safety-critical repair obligations before operation. | 49 CFR Part 396 | Regulation | High | Unreviewed | Shapes urgency model and compliance guardrails. |
| Example: Garden City had paper DVIR/work-order handoff problems and missed many maintenance issues before digitizing. | Samsara Garden City customer story | Named operator story | Medium-high | Unreviewed | Supports school-bus segment and communication-gap framing. |

Evidence strength scale:

- High: direct prompt, regulation, named operator story, public job description.
- Medium: vendor documentation describing a workflow or integration.
- Low: general article, analyst/SEO explainer, uncited summary.

### 6. James's Source Review Notes

For each source James reads, capture:

- What did this source make more concrete?
- What surprised me?
- What seems overstated or vendor-biased?
- What would I be comfortable citing or saying live?
- What product decision does this affect?

Tag the result:

- `[HUMAN-APPROVED]` James has read and can stand behind it.
- `[JAMES-QUESTION]` James wants to inspect further.
- `[REJECTED]` Not credible or not useful.

## Initial Primary-Source Reading Queue

Read in this order to avoid research sprawl:

1. Assignment prompt: reread the exact problem and deliverables.
2. Samsara Connected Maintenance product page: understand current product claims and avoid duplicating obvious existing features.
3. Sean McGee interview: understand the hiring manager's product philosophy and stated pain points.
4. Garden City Public Schools story: get one concrete operator narrative, especially if K-12 remains a candidate segment.
5. 49 CFR Part 396: understand why defects, corrective action, unsafe operation, and records matter.
6. 2-3 public maintenance supervisor/shop foreman job descriptions: ground daily responsibilities.
7. One integration/workflow source from MaintainX, Fleetio, or similar: understand how DVIRs, fault codes, WOs, parts, and assignments flow across tools.

Stop after this unless a scope decision depends on a missing fact.

## Manual Review Session

Suggested time block:

- 60 minutes today.

Agenda:

- 10 min: Samsara product page skim. Mark "already exists" and "potential gap."
- 10 min: Sean interview skim. Mark product philosophy and traps.
- 15 min: Garden City story. Mark concrete operational details.
- 15 min: 49 CFR Part 396 skim around sections 396.3, 396.7, 396.9, and 396.11.
- 10 min: Capture James review notes and update the claim table.

Rules:

- No product solutioning during source review.
- Do not chase secondary links unless a primary source creates a real ambiguity.
- Every useful source note should end with "so what decision does this affect?"

## Current Candidate Research Questions

1. What must a supervisor know before committing a daily maintenance plan?
2. Which inputs are facts from systems versus tacit context in the supervisor's head?
3. Which constraints change the priority order: safety, route/job need, parts, technician skill, bay capacity, vendor, warranty, compliance?
4. Where does Samsara already unify data, and where is daily planning still under-specified?
5. Which target segment makes the workflow most concrete and defensible?
6. What should be measured at the workflow level before claiming uptime or cost impact?

## Anti-Drift Guardrails

Do not let the report become:

- A comprehensive fleet-maintenance encyclopedia.
- A competitive landscape.
- A market-size report.
- A giant quote dump.
- A pre-written memo.

The report is done when James can say:

- "I understand the daily maintenance planning workflow."
- "I know which sources I trust and why."
- "I know which assumptions I am making."
- "I know what product decision each finding informs."
- "I know what I still need to ask a customer."
