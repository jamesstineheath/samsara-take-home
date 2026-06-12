# Jobs-To-Be-Done Framing

Date: 2026-06-12

Triggered by James annotation on prompt block B4: "This is a pretty clear jobs-to-be-done assignment."

Status: framing scaffold, not solution direction. Candidate language requires James review before it becomes submission language.

## Executive Take

`[JAMES]` The assignment is a clear jobs-to-be-done prompt.

`[SOURCE]` The prompt names the opportunity as helping maintenance supervisors plan their team's daily work by bringing together everything that needs attention, who is available to work on it, and what should be prioritized.

`[AI-INFERENCE]` The assignment is less about inventing a novel maintenance feature from scratch and more about showing judgment around a recurring decision job: converting fragmented maintenance demand and resource constraints into a credible daily work plan.

`[AI-INFERENCE]` A strong submission should make the job explicit, choose one level of the job hierarchy, and avoid drifting into a generic CMMS, dashboard, or chat assistant.

## Candidate Core Job

`[AI-DRAFT]` When I start my maintenance shift, help me decide what work my team should do today so that I can keep the right assets available, address safety/compliance risks, use technician time well, and avoid preventable surprises.

Why this is useful:

- It matches the prompt's morning planning moment.
- It keeps focus on a decision and commitment, not just a list of alerts.
- It leaves room for deterministic surfaces and agentic support without prescribing either yet.
- It makes constraints part of the job: assets, urgency, technicians, parts, and operational promises.

Risk:

- It may still be too broad unless we pick a target industry, asset type, and narrower v1 sub-job.

## Job Hierarchy

`[AI-INFERENCE]` Higher-level job:

- Keep the fleet or asset operation safe, available, compliant, and cost-effective.

`[AI-INFERENCE]` Core assignment-level job:

- Plan today's maintenance work.

`[AI-INFERENCE]` Lower-level sub-jobs:

- Detect everything needing attention: open work orders, overdue PMs, DVIR defects, active faults, assets already in the shop.
- Interpret urgency and consequence: safety/compliance, downtime risk, route/job impact, repeat issues, warranty/vendor implications.
- Check work readiness: technician availability/skill, bay capacity, parts, tools, vendor path, asset accessibility.
- Decide priority and tradeoffs: what must happen today, what can be bundled, what can wait, what should be outsourced.
- Commit assignments: who works on what, in what order, and with what known blockers.
- Communicate plan state: what is ready, down, at risk, blocked, deferred, or escalated.
- Adapt during the day: new faults, missing parts, longer repair time, dispatch pressure, technician findings.
- Leave better data behind: completion status, actual labor/parts, reasons for deferral, new findings, asset returned to service.

## Functional, Emotional, And Social Jobs

`[AI-INFERENCE]` Functional jobs:

- Build a reliable daily plan from fragmented inputs.
- Reduce missed work and duplicate/repeat shop visits.
- Put constrained technician time against the highest-value work.
- Make blockers visible early enough to act.
- Keep operations/dispatch aligned with asset availability.

`[AI-INFERENCE]` Emotional jobs:

- Feel in control at the beginning of a chaotic shift.
- Reduce the mental load of remembering what is in the shop and what everyone knows informally.
- Trust that critical issues are not hiding in another system.

`[AI-INFERENCE]` Social jobs:

- Look credible to technicians because the plan respects real shop constraints.
- Look reliable to dispatch/operations because asset readiness is clear.
- Protect the team from blame caused by missing context, stale data, or surprise failures.

## Desired Outcomes To Investigate

`[AI-INFERENCE]` Possible outcomes customers may care about:

- Less time to assemble the first viable daily plan.
- Higher percentage of critical maintenance demand reviewed before the morning huddle.
- Fewer missed safety/compliance issues from DVIRs, PMs, or fault codes.
- Fewer preventable repeat shop visits through better bundling.
- Better plan completion or clearer reasons when the plan changes.
- More technician wrench time and less supervisor/admin coordination time.
- Better asset availability for the day's operating commitments.

These are not final metrics yet. They are candidate outcomes to test against the chosen target customer and v1 scope.

## Scope Guardrails From JTBD

`[AI-INFERENCE]` The job suggests we should avoid:

- A generic "maintenance command center" that tries to show everything.
- A pure chat experience that asks the supervisor to reconstruct the plan verbally.
- A full CMMS clone covering every work order, inventory, vendor, and analytics workflow.
- A black-box AI priority score without visible source signals, constraints, and human override.
- A technician execution product unless we explicitly choose that as part of v1.

`[AI-INFERENCE]` The job suggests we should prefer:

- A narrow planning moment.
- A concrete target fleet and asset type.
- A visible plan state that maps to how supervisors already coordinate work.
- Structured inputs that explain why a recommendation exists.
- Human commitment and correction as part of the workflow.

## Decisions This Creates

Before drafting, James should decide:

- Which job altitude to own: daily maintenance planning, route/asset readiness, work readiness, technician assignment, or exception handling.
- Which customer archetype makes the job concrete.
- Which operating promise matters most: safety, uptime, on-time pullout, cost control, compliance, or technician productivity.
- Which sub-job is the v1 wedge.
- Which parts of the job AI recommends versus the human decides.
- Which parts of the job remain out of scope.

## Questions For James

1. Is the core job "plan today's maintenance work," or should we make it more specific to a target segment, like "get buses ready before morning routes"?
2. What is the hire moment: before the morning huddle, during the huddle, when a new defect arrives, or when dispatch asks what is available?
3. Which desired outcome should be the lead outcome: faster planning, fewer missed critical issues, better asset readiness, more wrench time, or fewer repeat visits?
4. Which sub-job is most defensible as v1: intake/synthesis, priority/tradeoff, work readiness, assignment, or plan communication?
5. What should be explicitly outside the job for this submission?
