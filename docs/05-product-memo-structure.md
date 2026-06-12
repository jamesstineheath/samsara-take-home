# Product Memo Structure

Date: 2026-06-12

Triggered by James annotation on the prompt's memo requirements: "This is a super clear way on how the doc should be structured."

Status: structure scaffold only. This is not the take-home memo and contains no final product recommendation.

## Source Requirements

`[SOURCE]` The product memo has a strict 4 page maximum, and shorter is fine.

`[SOURCE]` The memo must describe how James would approach the problem.

`[SOURCE]` The prompt asks the memo to include:

- The value this will provide to customers and why it matters.
- How James would measure success.
- Roughly what James thinks the UX should be.
- A clear recommendation on where and how to start, including what is in v1 versus what comes later.

`[SOURCE]` The prompt also asks James to use Samsara's website, research real fleet maintenance operations, state assumptions, include open questions, maintain a clear focused vision, write concisely/directly/plainly, and thoroughly review/stand by AI-assisted work.

## James's Structural Read

`[JAMES]` The prompt's include-list is a clear way to structure the document.

`[AI-INFERENCE]` This means the memo should not be organized as a research report, a feature inventory, a technical spec, or a prototype walkthrough. It should use the assignment's own evaluation path: value, measurement, UX, and v1 sequencing.

## Recommended Memo Spine

`[AI-DRAFT]` Use the prompt's four required bullets as the primary section headings, with a short thesis/recommendation up front.

### 0. Thesis / Recommendation

Purpose:

- Tell Sean what James believes matters most before the details.
- Name the chosen customer/persona/workflow assumption.
- State the v1 wedge at a high level without drifting into feature detail.

What this section must prove:

- James has a focused point of view.
- The rest of the memo is not a tour of possibilities.

Page budget:

- Roughly 0.25-0.5 pages.

Do not include:

- Long market context.
- Broad AI claims.
- Research summary dump.

### 1. Customer Value And Why It Matters

Purpose:

- Explain the job, pain, and customer impact.
- Show why this problem is worth solving now for the chosen customer segment.
- Ground the value in real maintenance operations.

What this section must prove:

- James understands the customer's operating reality.
- The value is operationally specific, not generic productivity language.
- The whiteboard/mental-model behavior is respected rather than dismissed.

Likely ingredients:

- Primary persona.
- Target customer/industry assumption.
- The daily planning job.
- Why missed prioritization, blockers, repeat visits, safety/compliance issues, or asset readiness matter.

Page budget:

- Roughly 0.75-1 page.

Do not include:

- Every research source.
- A generic "fleet maintenance is important" introduction.
- A feature list masquerading as value.

### 2. How To Measure Success

Purpose:

- Translate customer value into measurable outcomes.
- Separate leading indicators from lagging business outcomes.
- Include adoption/trust/data-quality signals if AI or structured planning is central.

What this section must prove:

- James can reason from user workflow to metrics.
- Success is not just usage or AI engagement.
- The metrics match the v1 wedge.

Likely metric types:

- Customer outcome: asset readiness, fewer missed critical issues, fewer repeat shop visits, reduced downtime risk.
- Workflow outcome: time to produce daily plan, percentage of work reviewed before huddle, plan completion rate, blocker resolution time.
- Trust/adoption: supervisor overrides, recommendation acceptance with edits, completeness/freshness of structured planning data.
- Guardrails: technician admin burden, unsafe deferrals, noisy/ignored recommendations.

Page budget:

- Roughly 0.5-0.75 pages.

Do not include:

- A vanity metric stack.
- Metrics that require a mature deployed product if the v1 cannot plausibly move them.
- Metrics disconnected from the chosen workflow.

### 3. Rough UX

Purpose:

- Describe the core experience clearly enough that the prototype can be evaluated against it.
- Show how the user moves from fragmented demand to an inspectable plan.
- Name deterministic surfaces and where AI/agentic support fits, if any.

What this section must prove:

- James understands the user's environment and decision flow.
- The UX is not a generic dashboard or chat wrapper.
- The experience creates trust by showing source signals, constraints, and human control.

Likely ingredients:

- Starting state.
- Primary surface.
- Key user actions.
- What the system recommends or organizes.
- What the human decides.
- How the plan is communicated or updated.

Page budget:

- Roughly 0.75-1 page.

Do not include:

- Pixel-level design.
- Full workflow coverage.
- Technician execution detail unless explicitly chosen as part of v1.

### 4. Where And How To Start: V1 Versus Later

Purpose:

- Make the sequencing judgment unmistakable.
- Define v1, non-goals, later bets, assumptions, and open questions.
- Show restraint.

What this section must prove:

- James can scope an ambitious idea into a defendable first product slice.
- James knows what not to build yet.
- The prototype corresponds to the memo's v1, not the entire vision.

Likely ingredients:

- V1 wedge.
- What data is mocked/assumed.
- What is intentionally not included.
- Later phases.
- Open questions for customer discovery.

Page budget:

- Roughly 0.75-1 page.

Do not include:

- A multi-quarter roadmap.
- A giant feature backlog.
- "Later" ideas that dilute the v1 recommendation.

## Open Questions Placement

`[AI-INFERENCE]` The prompt asks for open questions, but a separate long open-questions section may waste space. Better options:

- Put the 3-5 most important open questions at the end of section 4.
- Tie each open question to a decision it would change.
- Avoid questions that sound like James failed to make required assumptions.

Example question shape, not final content:

- "I would validate [unknown] because it changes [specific v1 decision]."

## Assumptions Placement

`[AI-INFERENCE]` Assumptions should be stated where they matter, not dumped in a generic block.

Recommended approach:

- Put primary scope assumptions in the thesis.
- Put operational assumptions in the customer value/UX sections.
- Put implementation/data assumptions in the v1 section.

## Anti-Drift Guardrails

Do not let the memo become:

- A domain research essay.
- A feature comparison against existing CMMS tools.
- A technical architecture document.
- A broad AI strategy.
- A prototype README.
- A full product requirements document.

The memo should read like a Principal PM explaining:

- "Here is the customer job."
- "Here is why this matters."
- "Here is how I would know we are improving it."
- "Here is the experience I would start with."
- "Here is what I would build first, what I would defer, and what I would learn next."

## Next Decision

`[AI-INFERENCE]` Before drafting, James should confirm whether this is the approved memo spine:

1. Thesis / recommendation.
2. Customer value and why it matters.
3. How to measure success.
4. Rough UX.
5. Where and how to start: v1 versus later, assumptions, and open questions.
