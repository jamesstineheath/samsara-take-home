# Assumption Log

Date created: 2026-06-12

Purpose: canonical log of assumptions made because the assignment says Samsara will not answer questions about the prompt. Keep this current throughout research, memo drafting, prototype scoping, and live-review prep.

## How To Use

- Add an assumption before using it in the memo or prototype.
- Tag the source basis: `[SOURCE]`, `[JAMES]`, `[AI-INFERENCE]`, or mixed.
- Mark whether James has reviewed it.
- Tie each assumption to the decision it affects.
- Revisit assumptions after source review, prototype build, and review prep.

## Assumptions

| ID | Assumption | Basis | Owner | Status | Confidence | Decision Impact | Validation / Review Needed |
|---|---|---|---|---|---|---|---|
| A-001 | The assignment expects candidates to make and state assumptions rather than ask Samsara follow-up questions. | `[SOURCE]` Prompt says assumptions are necessary and questions will not be answered. | Assignment | Active | High | Forces explicit scope, customer, data, and v1 assumptions in the memo. | None; source requirement. |
| A-002 | The current Samsara maintenance page to review is `https://www.samsara.com/products/telematics/fleet-maintenance`, because the prompt's `samsara.com/products/maintenance` URL currently returns a 404 in the in-app browser. | `[SOURCE]` Browser observation on 2026-06-12 plus existing research source. | Codex | Active | Medium-high | Defines the source page for current-product review and avoids relying on a dead prompt URL. | James should review the current page and note any redirect/source mismatch in final process notes only if relevant. |
| A-003 | Mock data is acceptable for the prototype as long as it plausibly exists in Samsara's system. | `[SOURCE]` Prompt explicitly allows mocked input data likely present in Samsara's system. | Assignment | Active | High | Lets prototype focus on workflow/data model rather than real integrations. | None; source requirement. |
| A-004 | The first product scope should not be selected until James reviews the customer research synthesis and primary sources. | `[JAMES]` James wants methodical planning and understanding before solutioning. | James | Active | High | Blocks premature product concept/prototype decisions. | James review of research report and source notes. |
| A-005 | The target customer segment, asset type, and primary workflow remain undecided. | `[AI-INFERENCE]` Decision log still lists these as open. | Codex | Active | High | Prevents memo/prototype from implying a chosen segment before James decides. | Resolve before drafting. |

## Assumption Quality Bar

Good assumptions are:

- Necessary to move forward.
- Explicitly tied to a decision.
- Easy to defend if challenged live.
- Reversible if source review changes the answer.

Weak assumptions are:

- Hidden in polished wording.
- Broad enough to smuggle in a solution.
- Based only on AI synthesis.
- Unclear about what would change if false.

## Add New Assumptions Here

| ID | Assumption | Basis | Owner | Status | Confidence | Decision Impact | Validation / Review Needed |
|---|---|---|---|---|---|---|---|
| A-006 |  |  |  |  |  |  |  |
