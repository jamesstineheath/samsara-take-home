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
| A-005 | The representative customer and asset context are now decided as Hertz LAX rental fleet operations; the exact morning workflow and v1 boundary remain open. | `[JAMES]` James committed to Hertz LAX on 2026-06-14. `[AI-INFERENCE]` The v1 workflow still needs review after systems, metrics, and solution prioritization. | James / Codex | Active | High | Allows research and prototype data to use Hertz LAX while preserving workflow-scope discipline. | Resolve specific workflow and v1 boundary before drafting. |

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
| A-006 | Use Hertz LAX Fleet Services at the LAX Rental Car Center as the representative customer and landmark. | `[JAMES]` James committed to Hertz LAX on 2026-06-14. `[SOURCE]` Public Hertz/LAX sources confirm high-volume 24/7 rental operations, integrated fueling/washing/light maintenance, and Hertz's current focus on utilization, fleet planning, and fleet operations. | James | Accepted | High | Makes the persona, asset type, metrics, and prototype data concrete. | Use in next research and scoping artifacts. |
| A-007 | Treat the alleged Samsara-Hertz deal as interview context, not public evidence. | `[JAMES]` James heard this from Sean. `[AI-INFERENCE]` Codex did not find public confirmation during this pass. | Codex | Active | High | Prevents memo from making an unsupported public claim while still allowing Hertz as a representative customer. | Do not cite the deal unless James can defend it as interview context. |
| A-008 | For the prototype, assume Samsara has access to technician roster, skills, and shift schedule, but may not have reliable live bay occupancy. | `[JAMES]` James requested this assumption on 2026-06-15. | James | Accepted | High | Allows the plan to recommend technician assignments while showing bay availability as an operational uncertainty. | Keep bay gaps visible in prototype and memo. |
| A-009 | The daily operational plan should be represented as an extension of Work Orders rather than a standalone planning system in v1. | `[JAMES]` James asked where the operational plan lives and wanted fewer clicks from brief to work. `[AI-INFERENCE]` This aligns with the chosen scope of not replacing the full planning UI. | James / Codex | Accepted as working scope | Medium-high | Defines the writeback target for Shift Brief actions: assignment, bundled task, and handoff note. | Validate whether this should be framed as Work Orders, Dispatch, or a new Today's Plan sub-view before final submission. |
