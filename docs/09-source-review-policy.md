# Source Review Policy

Date created: 2026-06-12

Triggered by James annotation on the prompt's AI-tools instruction: "With it stated this explicitly I should read every primary source that we're using so for regenerated research reports if you go too far and wide, I won't be able to actually skim all of the material."

Status: project-wide research guardrail.

## Core Rule

`[JAMES]` James should read every primary source used as evidence in the final memo or live-review rationale.

`[AI-INFERENCE]` Research reports must use a bounded source set. A wider source set can make the report look stronger while making it harder for James to own the work.

## Source Budget

Default maximum for a regenerated research report:

- 5-7 primary sources.
- 2-3 optional secondary/context sources.
- No source enters the final evidence table unless James can realistically read or skim it.

Any request to add more sources must answer:

- What decision does this source change?
- Which existing source does it replace or strengthen?
- Can James review it before drafting?

## Source Status Labels

Use these labels in research artifacts:

- `Queued`: source is selected for James review.
- `Skimmed`: James has skimmed it.
- `Read`: James has read enough to defend the relevant claim.
- `Approved`: James is comfortable using it in the memo or live review.
- `Reference only`: useful background, not a claim source.
- `Rejected`: not credible, too generic, or not worth using.

## Report Generation Rule

When regenerating research reports:

- Start from the approved/queued source list.
- Do not add new sources silently.
- Separate "used as evidence" from "background only."
- Include a source count at the top.
- Include a "James review status" column in every evidence table.
- Prefer replacing weak sources over adding more sources.

## Allowed Source Set For Next Research Report

Initial bounded set:

| Source | Role | Review Status | Notes |
|---|---|---|---|
| Assignment prompt PDF/email | Source of assignment constraints | Queued | Required. |
| Samsara Connected Maintenance page | Current product claims | Queued | Current working URL: https://www.samsara.com/products/telematics/fleet-maintenance |
| Sean McGee Connected Maintenance interview | Hiring-manager/product philosophy | Queued | Useful for traps and product altitude. |
| Garden City Public Schools story | Named operator story | Queued | Strong if K-12 remains in shortlist. |
| 49 CFR Part 396 | Regulatory context | Queued | Skim only sections relevant to inspection, repair, DVIR, unsafe operation, and records. |
| 2 public supervisor/shop-foreman job descriptions | Role grounding | Queued | Pick 2, not 10. |
| 1 integration/workflow source | Tool-flow vocabulary | Queued | Pick MaintainX, Fleetio, or similar; reference only unless very concrete. |

## Anti-Drift Rule

Do not produce a new, wider research report because it feels more impressive. Produce a smaller report James can own.
