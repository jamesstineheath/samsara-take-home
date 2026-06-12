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

## Writing Discipline

Samsara explicitly values concise, direct, plain-language writing. Apply this to every research note, prompt, memo draft, prototype label, README, and review-prep artifact.

- Use short sentences and concrete operational language.
- Separate source facts, James's views, AI inference, and draft wording.
- Avoid jargon, consulting language, generic AI/product phrasing, and inflated claims.
- Do not polish before the logic is sound.
- Prefer wording James can say out loud and defend live.

When prompting another model, include the style constraint from `docs/08-writing-and-prompting-guardrails.md`.

## Source Discipline

Because the prompt explicitly encourages AI use while requiring James to stand by the final proposal, research must be source-bounded and reviewable.

- Follow `docs/09-source-review-policy.md` for source budgets, golden samples, and review labels.
- Do not add new primary sources silently when regenerating research reports.
- Separate evidence sources from background-only sources.
- Prefer a few golden samples James understands over a broad citation list.
- No source-backed claim should enter the memo unless its source role and James review status are clear.

## Build Discipline

When build mode starts, keep the prototype aligned to the memo's core experience. A smaller prototype James deeply understands beats a sprawling app he cannot defend.

Claude Fabel may be used for complex implementation. Codex should keep repo hygiene, runnable setup, verification, and review artifacts clear.
