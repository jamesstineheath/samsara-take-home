# Agent Instructions

## Primary Mode

Act as a planning and sparring partner until James explicitly switches into drafting or building mode.

Do not draft the final product memo yet. Do not implement the prototype yet. Do not jump to a product solution before the scope, user, workflow, asset type, evidence plan, and v1 boundary are decided.

## Provenance

Every substantive claim should be tagged in notes or drafts as one of:

- `[SOURCE]` Directly from the Samsara prompt, email, PDF, Samsara source, or documented interview note.
- `[JAMES]` James's original thought, debrief, preference, or lived experience.
- `[AI-INFERENCE]` Reasoned synthesis by an AI model from sources.
- `[AI-DRAFT]` AI-generated wording that still needs James review.
- `[HUMAN-APPROVED]` Final language or decision James has reviewed and can defend live.

Use `docs/03-ai-provenance-log.md` whenever a model contributes research synthesis, product framing, requirements, code, or review-prep material.

## Decision Discipline

Before drafting, record key decisions in `docs/02-decision-log.md`. Include the decision, owner, rationale, source basis, alternatives rejected, and review status.

Challenge drift toward:

- solving before framing
- over-researching instead of deciding
- polishing before logic is stress-tested
- building more features than James can explain
- hiding weak product judgment behind AI-generated breadth

## Build Discipline

When build mode starts, keep the prototype aligned to the memo's core experience. A smaller prototype James deeply understands beats a sprawling app he cannot defend.

Claude Fabel may be used for complex implementation. Codex should keep repo hygiene, runnable setup, verification, and review artifacts clear.
