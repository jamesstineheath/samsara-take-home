# Suggested Memo Edits From Prototype Feedback

Target Google Doc: https://docs.google.com/document/d/1dnKK33IUMR6ZnNyZMWJpKV9zKxZBWwPjsXiSuqAzKEk/edit?tab=t.0#heading=h.5reikw3m62lu

Status: paste-ready suggestions. The Google Drive connector could read the document, but Google returned `appNotAuthorizedToFile` when attempting to write comments.

## Executive Summary

Replace:

> Samsara should build a Predictive Shift Brief inside Connected Maintenance: a lightweight operating brief that tells a maintenance supervisor which assets deserve attention first, which work is ready, what is blocked, and what changed since the last shift.

With:

> Samsara should add a Prepared Asset Plan inside Connected Maintenance Work Orders: a supervisor review layer that stack-ranks vehicle-level decisions by asset uptime impact, shows which assumptions need verification, and prepares the affected work-order updates for approval.

Reason: this is sharper than "Shift Brief" because the prototype landed on Work Orders as the system of record and vehicle recommendations as the supervisor's review object.

Replace:

> How it works: create a Shift Brief tab for the supervisor's pre-shift view, then surface the same intelligence as contextual badges in existing workflows like Inventory, Work Orders, Asset Status, Faults, DVIRs, Warranty, and Vendors. The tab is the planning aid; the badges are where the supervisor acts during the day.

With:

> Before each shift, Samsara prepares a ranked asset plan inside Work Orders. Each recommendation opens into three steps: what changed, what assumptions need to be verified, and which work orders are affected. The supervisor can confirm or reject assumptions, commit prepared WO updates, defer the recommendation, or open the full WO record.

Reason: broad contextual badges now feel like expansion after the plan-review loop earns trust.

## UX

Replace:

> The core surface is: Connected Maintenance > Shift Brief

With:

> The core surface is: Connected Maintenance > Work Orders > Prepared Asset Plan.

Reason: this is no longer a standalone brief. It is an intelligence layer over Work Orders, which makes adoption easier and keeps the supervisor in the operational record.

Replace:

> This avoids forcing supervisors into a new planning workspace. The brief gives them the shift-start rollup; deep links and badges let them act inside the surfaces they already use.

With:

> This avoids forcing supervisors into a new planning workspace. The product starts as a review layer in Work Orders: ranked asset recommendations, assumption checks, affected WOs, and prepared updates. The supervisor stays in the system of record and only drills into a full WO when they need more context.

Replace the "Each focus item should show" list with:

> Each ranked asset recommendation should show:
> - Planning horizon: this shift, next 24-48 hours, or weekend surge.
> - Vehicle make/model, class, and current state.
> - Why this vehicle matters for Asset Uptime.
> - Assumptions the supervisor must verify, such as bay, parts, tech schedule, vendor ETA, warranty path, or ops release.
> - Affected work orders and prepared WO updates.
> - Full WO drilldown before committing.

Reason: this shifts the memo from generic focus items to the prototype's actual flow: asset recommendation > assumption check > WO update.

## V1

Replace:

> V1 should focus on a narrow, useful brief:

With:

> V1 should focus on a narrow, useful plan-review loop:
> 1. Prepared Asset Plan inside Work Orders.
> 2. Vehicle-level stack rank by feasible uptime impact.
> 3. Planning horizon filters: this shift, next 24-48 hours, weekend surge.
> 4. Assumption verification with confirm/reject and rejection context.
> 5. Affected WOs with current WO context and prepared updates.
> 6. Full WO drilldown before committing.
> 7. Lightweight feedback on recommendation outcome.
> 8. Hosted prototype link for review.

Reason: remove broad contextual badges and shift-end follow-up from v1 unless they are explicitly scoped as secondary.

## Later

Replace:

> If the brief proves daily use, Samsara can expand into more workflow ownership:

With:

> If plan review earns daily use, Samsara can expand into more workflow ownership: contextual badges across maintenance surfaces, capacity-aware dispatch, technician-ready cards, ops-facing ready-by-time summaries, parts and vendor orchestration, and eventually autonomous scheduling.

Reason: Later should follow naturally from v1 trust: first prepare and verify decisions, then automate more of the plan.

## Measuring Success

After:

> Strategic product metric: Feasible Uptime Recovered, meaning the share of realistically recoverable, high-value asset availability the brief helped move forward.

Add:

> Add a reliability metric for the plan-review loop: recommendation precision after supervisor feedback. Count not just accepted recommendations, but why recommendations were changed: wrong assumption, already handled, missing local context, safety/warranty override, or not worth the tradeoff.

Reason: this connects directly to the prototype's confirm/reject assumption checks and avoids optimizing for blind acceptance.

## Assumptions

Replace:

> Contextual badges will help rather than add noise.

With:

> Supervisors will trust and use a Work Orders-based plan-review layer if it helps them verify local context faster than rebuilding the plan themselves.

Reason: contextual badges can remain a later assumption, but they are no longer the core v1 bet.

## Existing Comment Replies

For James's comment on:

> Shift-end follow-up and carryover summary.

Suggested reply:

> Agreed. Suggested memo change: remove this as a standalone v1 feature. Carryover should be captured through the day's work itself: WO updates, supervisor notes, rejected assumptions, and unresolved blockers. Shift-end summary can be Later or an automatic byproduct.

For James's comment on:

> Recommendation precision: useful, already handled, wrong, not relevant.

Suggested reply:

> Agreed. Suggested memo change: make the feedback loop explicit at two levels: assumption-level confirm/reject and recommendation outcome. This is what teaches the system where local shop truth was missing or wrong.
