# Prompt Review Notes And Todos

Date created: 2026-06-12

Purpose: running ledger of James's annotations while reviewing the Samsara prompt. This captures James's notes, the artifact each note created, and the next todo, without turning prompt review into product drafting.

## Capture Rules

- James notes are tagged `[JAMES]`.
- Codex actions and synthesis are tagged `[AI-INFERENCE]` or `[AI-DRAFT]`.
- Product choices stay open until they are recorded in the decision log.
- Todo status should be updated as work completes.

## Prompt Review Ledger

| Prompt Anchor | James Note | Capture / Artifact | Todo | Status |
|---|---|---|---|---|
| Maintenance supervisor morning planning | `[JAMES]` Need a primer on the persona, flows, tools, and likely target persona/industry. | `research/02-maintenance-supervisor-persona-primer.md` | James to choose target industry/persona shortlist. | In review |
| Whiteboards and mental models | `[JAMES]` Need to understand why this persists and respect it as a major pain point. Structured data makes agentic tools work. | `research/03-whiteboards-and-structured-data-primer.md` | Decide what whiteboard state must be structured first. | In review |
| Opportunity statement | `[JAMES]` This is a clear jobs-to-be-done assignment. | `research/04-jtbd-framing.md` | Decide job altitude and v1 sub-job. | In review |
| Memo include-list | `[JAMES]` The prompt gives a clear document structure. | `docs/05-product-memo-structure.md` | Approve or adjust memo spine before drafting. | In review |
| Samsara website instruction | `[JAMES]` Need to block time today to review Samsara's current product page in Codex and annotate thoughts. | `research/06-samsara-product-page-review-capture.md` | James to review current page and annotate observations. | Ready |
| Fleet maintenance operations research | `[JAMES]` This should become a cited research report James reads and assesses against primary sources. | `research/05-primary-source-research-report-scaffold.md` | James to review golden samples/source queue and mark review status. | Ready |
| Assumptions instruction | `[JAMES]` This should be a canonical log maintained throughout the project. | `docs/06-assumption-log.md` | Add every scope/data/product assumption before it enters memo or prototype. | Active |
| Plain-language writing | `[JAMES]` Make sure concise, direct, plain-language writing is clear in all prompting. | `docs/08-writing-and-prompting-guardrails.md`; `AGENTS.md`; `docs/05-product-memo-structure.md` | Include style constraint in future prompts to Codex, Claude Fabel, and any research/drafting/build model. | Active |
| AI tool use / stand behind final proposal | `[JAMES]` Revised: James does not need to read every single primary source. He should review a few golden samples of cited research/material and understand them. | `docs/09-source-review-policy.md`; `research/05-primary-source-research-report-scaffold.md`; `AGENTS.md` | Keep research source set bounded, identify golden samples, and do not add new primary sources silently. | Active |
| Submission format | `[JAMES]` Hosting is no problem. Use a Google Doc for the memo because it will be easier for the reviewer. | `docs/10-submission-packaging-plan.md`; `docs/02-decision-log.md` | Later choose hosting provider, share settings, and final submission links. | Accepted |

## Active Todos

1. James reviews the current Samsara Connected Maintenance page: https://www.samsara.com/products/telematics/fleet-maintenance
2. James annotates current-product observations in Codex or sends notes back into this thread.
3. Codex captures website observations into `research/06-samsara-product-page-review-capture.md`.
4. James reviews the golden samples/source queue in `research/05-primary-source-research-report-scaffold.md`.
5. Codex converts source notes into a cited research report only after James has reviewed the primary sources.
6. James chooses target customer segment, persona, workflow, and v1 wedge before memo drafting begins.
7. Codex records each assumption in `docs/06-assumption-log.md` before it appears in the memo/prototype.
8. Every future AI prompt includes the concise/direct/plain-language writing rule from `docs/08-writing-and-prompting-guardrails.md`.
9. Every regenerated research report follows `docs/09-source-review-policy.md`, identifies 3-5 golden samples, and includes James review status for each evidence source.
10. Final packaging should use a Google Doc memo and hosted prototype link, with README/local run instructions as fallback.

## Drift Warnings

- Do not convert annotations directly into product features.
- Do not let research become open-ended source collection.
- Do not draft the memo before assumptions, target segment, and v1 boundary are approved.
- Do not hide James's judgment behind AI-polished synthesis.
- Do not accept AI prose that sounds polished but generic.
- Do not let AI expand the source list beyond what James can understand and defend through golden samples.
- Do not polish submission packaging before the product logic is sound.
