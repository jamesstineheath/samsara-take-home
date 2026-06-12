# Source Review Policy

Date created: 2026-06-12

Triggered by James annotations on the prompt's AI/research-depth instructions:

- Initial note: "With it stated this explicitly I should read every primary source that we're using so for regenerated research reports if you go too far and wide, I won't be able to actually skim all of the material."
- Revision: "Given how far I might be able to go with my own research in the stated amount of time (three to four hours), I retract what I said previously in that I don't need to read every single primary source but I should review a few golden samples of cited research or material and understand it."

Status: project-wide research guardrail.

## Core Rule

`[JAMES]` James does not need to read every single primary source surfaced by AI.

`[JAMES]` James should review a few golden samples of cited research or source material deeply enough to understand and defend the research direction.

`[AI-INFERENCE]` Research reports still need a bounded source set. A wider source set can make the report look stronger while making it harder for James to own the work.

`[AI-INFERENCE]` The standard is not "James read everything." The standard is "James understands the strongest evidence, knows where AI synthesis contributed, and can explain the product judgment without hiding behind citations."

## Source Budget

Default maximum for a regenerated research report:

- 3-5 golden-sample sources for James to review.
- 5-7 total evidence sources in the research report.
- 2-3 optional secondary/context sources.
- No source enters the final evidence table unless it has a clear role and review status.

Any request to add more sources must answer:

- What decision does this source change?
- Which existing source does it replace or strengthen?
- Does this need to become a golden sample, or is it background/context only?

## Golden Samples

Golden samples are the sources James should personally review closely.

Choose them to cover different evidence types:

- Assignment/current product: prompt PDF plus Samsara Connected Maintenance page.
- Product philosophy: Sean McGee interview.
- Operator reality: one named customer/operator story, likely Garden City if K-12 remains live.
- Hard constraint: one regulatory or public role source, such as 49 CFR Part 396 or a supervisor job description.

Golden samples should be enough for James to say:

- "I know what Samsara already claims to do."
- "I know what a real operator story sounds like."
- "I know one or two hard constraints that shape the workflow."
- "I can tell where AI synthesis helped and where I personally checked the source."

## Source Status Labels

Use these labels in research artifacts:

- `Queued`: source is selected for James review.
- `Golden sample`: source is selected for James to review closely.
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
- Identify the 3-5 golden samples at the top.
- Include a source count at the top.
- Include a "James review status" column in every evidence table.
- Prefer replacing weak sources over adding more sources.

## Allowed Source Set For Next Research Report

Initial bounded set:

| Source | Role | Review Status | Notes |
|---|---|---|---|
| Assignment prompt PDF/email | Source of assignment constraints | Golden sample | Required. |
| Samsara Connected Maintenance page | Current product claims | Golden sample | Current working URL: https://www.samsara.com/products/telematics/fleet-maintenance |
| Sean McGee Connected Maintenance interview | Hiring-manager/product philosophy | Golden sample | Useful for traps and product altitude. |
| Garden City Public Schools story | Named operator story | Golden sample candidate | Strong if K-12 remains in shortlist. |
| 49 CFR Part 396 | Regulatory context | Golden sample candidate | Skim only sections relevant to inspection, repair, DVIR, unsafe operation, and records. |
| 2 public supervisor/shop-foreman job descriptions | Role grounding | Queued | Pick 2, not 10. |
| 1 integration/workflow source | Tool-flow vocabulary | Queued | Pick MaintainX, Fleetio, or similar; reference only unless very concrete. |

## Anti-Drift Rule

Do not produce a new, wider research report because it feels more impressive. Produce a smaller report with a few sources James knows well.
