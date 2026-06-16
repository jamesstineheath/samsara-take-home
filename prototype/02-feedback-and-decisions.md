# Prototype Feedback And Decision Process

Status: working process for prototype iteration.

## Goal

Capture James's decisions and feedback as part of the prototype process, not as scattered chat history.

## Sources Of Feedback

Use these inputs:

- James's chat feedback.
- Browser annotations on local prototype screens.
- Google Doc memo edits when they change product direction.
- Downselect notes after comparing variants.

## Capture Locations

- Product decisions: `docs/02-decision-log.md`
- AI/tool contributions: `docs/03-ai-provenance-log.md`
- Prototype-specific feedback: `prototype/feedback-log.md`
- Variant scoring: `prototype/variant-scorecard.md`
- Canonical memo changes: Google Doc

## Feedback Loop

For each prototype round:

1. Build or update the prototype variant.
2. Host it locally and open it in the in-app browser.
3. James annotates or gives feedback.
4. Capture feedback in `prototype/feedback-log.md`.
5. Convert product-direction changes into `docs/02-decision-log.md`.
6. Convert implementation/design changes into a short next-build checklist.
7. Update `docs/03-ai-provenance-log.md` when AI contributes design, code, or synthesis.

## Decision Types

Capture these as explicit decisions:

- Chosen front-end variant.
- Rejected variants and why.
- V1 scope changes.
- Data source assumptions.
- Metric or success-criteria changes.
- Interaction model changes.
- Anything James wants to defend live in the review.

## Downselect Rule

When comparing variants, choose the one that best explains the product judgment, not the one with the most UI.

Decision prompt:

Which variant best shows that Samsara can recover Asset Uptime by preparing a supervisor before the shift, while avoiding the trap of rebuilding a full planning system?

## Build Notes Format

Each feedback entry should include:

- Date/time.
- Prototype variant.
- Feedback source.
- James's note.
- Product implication.
- Build implication.
- Status.

Statuses:

- captured
- accepted
- rejected
- implemented
- parked
