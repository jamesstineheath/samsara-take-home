# Execution Strategy

## 1. What Successful Likely Means

Facts from the prompt: Samsara wants clear problem definition, thoughtful product requirements, supported assumptions, a focused vision, direct writing, a working frontend/backend prototype, research depth, product thinking, craft, ambition, and AI-tool fluency.

Inference: Sean will likely look for whether James can enter an unfamiliar but concrete operations domain, find the leverage point, and make a principled v1 tradeoff. The live review will probably test why this user, why this workflow, why this sequence, and how James used AI without outsourcing judgment.

Principal-level signals:

- Chooses a narrow workflow with high customer pain and explains why the boundary is right.
- Shows domain curiosity without pretending to be a maintenance expert.
- Defines v1 as a wedge into an operating rhythm, not a mini-CMMS.
- Connects data sources to decisions: work orders, PM schedules, DVIRs, faults, technician availability, parts, location, shop capacity.
- Makes sequencing tradeoffs visible: what must be connected first, what can be mocked, what waits for later.
- Gives engineering enough to start: user stories, data assumptions, states, edge cases, API/data model sketch, success metrics.
- Can explain every screen, data object, and prioritization rule live.
- Uses AI as leverage for research/build speed, while James owns the choices.

What would feel off-target:

- A generic "AI prioritizes tasks" dashboard with weak maintenance details.
- A broad work-order/CMMS clone.
- A prototype with many screens but no crisp planning moment.
- Over-indexing on predictive AI before connectivity, trust, and workflow adoption are solved.
- Replacing supervisor judgment instead of amplifying it.
- Polishing visual design before validating the logic.
- Research bloat that never becomes decisions.
- Building something James cannot defend from first principles.

## 2. Work Phases

### Phase 0 - Planning And Guardrails

Output: sourced constraints, success definition, decision log, provenance system, workback schedule.

Decision gate: do not draft or build until James accepts the operating plan and the questions for the first working session.

### Phase 1 - Understand The Prompt

Output: one-page prompt restatement with required deliverables, scoring criteria, and ambiguities.

Decision gate: agree on what the assignment is actually asking for versus what would be nice to include.

### Phase 2 - Choose The Strategic Angle

Output: 2-3 candidate angles, each framed as user, workflow, pain, evidence needed, prototype surface, and risk.

Decision gate: select one angle, or explicitly time-box a final comparison.

### Phase 3 - Scope The Problem

Output: chosen user/customer, asset type, morning workflow, input data, v1/vlater boundary, non-goals.

Decision gate: write a one-sentence product thesis and a one-paragraph v1 boundary that James can defend.

### Phase 4 - Identify Evidence Needed

Output: bounded research list with must-have sources and stop rules.

Research cap: enough to ground the workflow, not enough to become a thesis project.

Decision gate: no more than 5 open questions may remain before memo drafting; each must be named as assumption or future discovery.

### Phase 5 - Build The Artifact

Output: memo draft, prototype app, README, mocked dataset, and simple run path.

Build stance: core interaction first, visual polish second, extra features last.

Decision gate: James can explain every requirement and every prototype behavior without reading code.

### Phase 6 - Stress-Test The Logic

Output: critique pass, edge-case pass, metrics pass, "what would Sean challenge?" list, and trim list.

Decision gate: cut anything that is flashy but hard to defend.

### Phase 7 - Prepare For Live Review

Output: 8-10 minute walkthrough, likely questions, concise AI process explanation, demo fallback path, and "what I would do next" section.

Decision gate: one full rehearsal without discovering a major logic gap.

## 3. Key Decisions Before Drafting

- Scope: daily planning only, or daily planning plus assignment/execution follow-through.
- User: maintenance supervisor as primary; technician, parts manager, or vendor coordinator as secondary.
- Customer segment: choose a concrete fleet archetype and avoid "all fleets."
- Asset type: trucks, trailers, equipment, mixed fleet, or facilities-adjacent assets.
- Workflow altitude: morning planning ritual, exception triage, shop capacity scheduling, vendor routing, or parts-aware planning.
- V1 intelligence level: rules/heuristics from connected data, AI summarization, AI recommendation, or AI agent actions.
- Trust boundary: what the product recommends versus what humans approve.
- Metrics: downtime, wrench time, PM compliance, repair cycle time, first-time fix rate, shop utilization, overdue defects, or planner time saved.
- Requirements depth: memo-only requirements versus richer README/product spec.
- Prototype depth: data model/backend realism versus frontend interaction polish.
- Research budget: what must be learned from maintenance ops before build, and when research stops.
- Live-review story: what James wants Sean to remember in one sentence.

## 4. Workback Schedule

Current time: Thursday, June 11, 2026, 1:04 PM PT.

Official review: Wednesday, June 17, 2026, 2:00 PM PT.

Conservative submit target: Tuesday, June 16, 2026, noon PT.

Internal done target: Monday, June 15, 2026, EOD.

### Thursday, June 11

1:00-2:30 PM - Planning and sourcing.

Output: constraints, strategy scaffold, provenance rules, repo.

Decision gate: planning-only boundary accepted.

2:30-4:00 PM - First 60-minute agenda plus scope candidates.

Output: candidate angles and decision criteria, not solutions.

4:00-5:30 PM - Research plan and evidence inventory.

Output: source list, research stop rules, source capture template.

Evening optional 60-90 minutes - James sparring.

Output: selected user/workflow and thesis draft in decision-log form only.

### Friday, June 12

Morning 90 minutes - Domain research.

Output: maintenance workflow notes, vocabulary, pain points, operational constraints.

Decision gate: stop research when it can support v1 decisions.

Late morning 60 minutes - Strategic angle decision.

Output: chosen scope, v1/vlater, non-goals.

Afternoon 2-3 hours - Artifact architecture.

Output: memo outline, prototype interaction map, mocked data schema, build brief for Claude Fabel.

Decision gate: James signs off before build.

### Saturday, June 13

Morning 2-3 hours - Prototype first pass.

Output: running frontend/backend skeleton, seed data, core flow.

Afternoon 90 minutes - Memo first pass.

Output: rough memo with placeholders, no polish.

Decision gate: core logic visible in both memo and app.

### Sunday, June 14

Morning 2-3 hours - Prototype completion.

Output: functional demo path, README draft, rough UX polish.

Afternoon 2 hours - Memo completion.

Output: complete 4-page-or-less memo draft.

Evening 60 minutes - James review.

Output: cuts, corrections, provenance updates, questions for stress test.

### Monday, June 15

Morning 2 hours - Stress test and trim.

Output: Sean challenge list, evidence gaps, decisions to cut or defend.

Afternoon 2-3 hours - Finalize app and memo.

Output: submission candidate, final README, demo fallback screenshots or notes.

Evening 60-90 minutes - Live review rehearsal.

Output: walkthrough script, Q&A prep, final fix list.

Decision gate: no new scope after this point.

### Tuesday, June 16

Morning 90 minutes - Final packaging.

Output: memo PDF/Doc, repo/package checked, run instructions verified from clean start.

By noon PT - Submit.

Afternoon 60 minutes - Post-submit review prep.

Output: final walkthrough and likely questions.

### Wednesday, June 17

1:00-1:30 PM - Warm rehearsal.

Output: tight story, demo path, fallback plan.

2:00-2:45 PM - Homework review with Sean.

## 5. First 60 Minutes Agenda

0-10 minutes - Re-anchor the assignment.

Questions: What is the exact thing Sean should believe about your product judgment after this review? What part of BetterUp are we explicitly not repeating?

10-20 minutes - Re-state constraints and success.

Questions: Which prompt requirements are non-negotiable? Which are traps if overbuilt?

20-35 minutes - Pick the decision surface, not the solution.

Questions: Who is the primary user? What morning planning moment matters most? What customer archetype will make the work concrete? What can we ignore?

35-50 minutes - Define evidence needed.

Questions: What do we need to learn from maintenance operations before we can responsibly choose v1? Which claims must be sourced? What can remain an assumption?

50-60 minutes - Lock next outputs.

End-of-hour artifacts: success statement, chosen or shortlisted scope, top 5 unknowns, research stop rule, decision-log entries, and next work block.

## Model Selections

- James: final product judgment, scope decisions, live-review ownership, and approval of final wording.
- Codex: planning scaffold, repo hygiene, source/provenance discipline, implementation review, run instructions, final packaging checks.
- Claude Fabel: complex prototype build once the build brief is locked, especially frontend/backend implementation speed.
- Research model with browsing: bounded maintenance-ops research and fresh Samsara/company-news pass, with citations captured in `research/`.
- Fast summarization model: source extraction and first-pass synthesis only; do not let it decide scope.

Rule: no model gets to invent the product thesis. Models can generate options and critique. James chooses the angle.
