# Session 01 - Scope Sparring

Date: 2026-06-12

Boundary: planning and sparring only. No final memo drafting. No prototype implementation. No product solution locked until the scope decision is explicit.

## Starting Prompt

James said: "Okay let's get started."

## Session Goals

- Define what Sean should believe about James's product judgment after the review.
- Name the BetterUp failure mode in operational terms so we can avoid it.
- Pick the decision surface before choosing a solution.
- Narrow the most important pre-drafting decisions.
- End with a scope shortlist, evidence plan, and research stop rule.

## Provenance Legend

- `[JAMES]` James's original thought or decision.
- `[AI-INFERENCE]` Codex synthesis or challenge.
- `[SOURCE]` Assignment, email, PDF, or documented prior context.
- `[HUMAN-APPROVED]` James has reviewed and accepts.

## Working Notes

### 1. Success Statement

`[JAMES]` Success means demonstrating zero-to-one thinking, showing iteration and judgment along the way, and not just building another crappy chat demo.

`[AI-INFERENCE]` The live-review target is not "look what I built"; it is "I can reason from customer reality to product scope to prototype, with clear judgment at each step."

### 2. BetterUp Guardrail

Known risk from James's reflection: too broad, overbuilt, not deeply owned, skipped too quickly to solutioning, and could not back up choices from first principles.

Planning translation:

- Keep scope smaller than instinct.
- Prefer one sharp workflow over many plausible features.
- Keep every product choice explainable in plain operational logic.
- Do not let AI-generated breadth become a substitute for PM judgment.
- Maintain a backwards-traceable rationale: final artifact -> iteration steps -> research synthesis -> initial problem framing.
- Make James's own rationale and inputs explicit at each step.

### 2a. Reed Text Context

`[SOURCE]` Reed said the full working prototype requirement is new relative to the case studies he has seen.

`[SOURCE]` Reed's strongest product/process pointer: make it agentic, but not 100% chat UI. It should still include deterministic product surfaces such as a kanban board, maintenance calendar, asset list, or similar.

`[SOURCE]` Reed also emphasized that the actual interaction pattern matters because these users may be wearing gloves, covered with grease, and working in a loud environment.

`[JAMES]` James said Sean seems to care a lot about 0-to-1 ability and that starting from a blank slate may be better than biasing the design with screenshots of existing tools.

Planning translation:

- AI should appear as operational leverage, not as a generic chat wrapper.
- The interface should respect physical-world use conditions.
- We should avoid copying existing Samsara UI and instead show a clean 0-to-1 point of view.
- Deterministic surfaces matter because supervisors and technicians need inspectability, not just magic.

### 2b. Challenge Preferences

`[JAMES]` Challenge overbuilding hardest.

`[JAMES]` Challenge any jump to solutioning and building before methodical planning.

`[JAMES]` The first substantive step should be customer research and synthesis. James should personally understand that synthesis before moving to the next step.

Planning translation:

- Before solution candidates, build a customer-research frame.
- Before prototype build, require James-approved synthesis.
- At each phase, capture what changed in James's thinking and why.

### 3. Scope Dimensions To Decide

- Primary user:
- Customer archetype:
- Asset type:
- Planning moment:
- Data inputs:
- Human decision vs. AI recommendation boundary:
- V1 non-goals:
- Success metrics:

### 4. Open Questions

- `[JAMES]` Need a primer on the maintenance supervisor persona, what user flows and tools look like, and likely target industries/personas for a strong demo.
- `[JAMES]` It will probably be useful to pick a target persona in a target industry to make the demo concrete.

### 5. Decisions Made

- `[HUMAN-APPROVED]` Do not start with a tool/prototype. Start with customer research framing and synthesis.
- `[HUMAN-APPROVED]` Overbuilding is the primary behavior to challenge.
- `[HUMAN-APPROVED]` The work must maintain a clear record of product judgment from initial research through final artifacts.
