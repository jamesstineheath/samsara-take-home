# Customer Research Frame

Date: 2026-06-12

Purpose: understand the maintenance supervisor/planner problem before selecting a product solution.

## Source Set

- Samsara Connected Maintenance product page: https://www.samsara.com/products/telematics/fleet-maintenance
- Samsara blog, "Inside Samsara Connected Maintenance with Sean McGee": https://www.samsara.com/blog/inside-connected-maintenance-sean-mcgee
- Samsara May 2026 product updates: https://www.samsara.com/blog/may-product-updates-2026
- City of Turlock Fleet Maintenance Supervisor job description: https://www.cityofturlock.org/workingforus/jobdescriptions/jobdescription.asp?position=45
- MaintainX maintenance supervisor description: https://www.getmaintainx.com/learning-center/maintenance-supervisors-description
- Tractian maintenance planner glossary: https://tractian.com/en/glossary/maintenance-planner
- UpKeep fleet maintenance management software overview: https://upkeep.com/blog/fleet-maintenance-management-software/
- AUTOsist fleet maintenance scheduling strategy: https://autosist.com/resources/guides/fleet-maintenance-scheduling-strategy/

## Source Facts

- `[SOURCE]` The assignment prompt centers the morning question: "what should my team work on today?" Inputs include work order lists, overdue PMs, DVIR defects, active fault codes, and the supervisor's mental model of what is in the shop.
- `[SOURCE]` Samsara Connected Maintenance unifies DVIRs, work orders, vendors, inventory, and warranties, and is built around real-time operations data such as fault codes, DVIRs, work orders, costs, and inventory.
- `[SOURCE]` Sean McGee said maintenance has a broader open space across scheduling, prioritization, in-house vs. outsourcing, and total cost of ownership.
- `[SOURCE]` Samsara's May 2026 updates connect Warranty Management and the Technician App, automatically checking work orders for warranty eligibility.
- `[SOURCE]` Fleet maintenance supervisors commonly schedule and assign shifts, establish work priorities, manage preventive maintenance, analyze costs, determine spare parts and supplies requirements, and monitor budgets.
- `[SOURCE]` Maintenance supervisors prepare schedules, assign workloads, coordinate daily maintenance activity, and manage replacement parts and supplies inventory.
- `[SOURCE]` Maintenance planning focuses on making jobs ready before execution: task definition, parts/materials, labor estimates, technical documentation, and coordination with operations/procurement.
- `[SOURCE]` Planning and scheduling are distinct: planning is the "how" of the job; scheduling is the "when" and "who."
- `[SOURCE]` Effective maintenance scheduling depends on work order prioritization, parts/inventory coordination, labor and shop capacity planning, and accurate asset/service intervals.
- `[SOURCE]` Fleet maintenance management software commonly connects work orders, PM schedules, inspections, parts inventory, and asset history.

## Early Synthesis

- `[AI-INFERENCE]` The daily planning job is not just ranking tasks. It is converting fragmented demand into an executable shop plan under constraints.
- `[AI-INFERENCE]` The most important constraints appear to be: asset criticality/readiness, severity/safety/compliance, technician availability/skill, parts availability, shop capacity, vendor path, and whether jobs can be bundled.
- `[AI-INFERENCE]` A credible v1 should likely help the supervisor inspect and commit a plan, not fully automate execution.
- `[AI-INFERENCE]` Reed's "agentic but not chat" pointer fits the research: AI can synthesize and suggest, but the customer still needs deterministic surfaces for planning and accountability.
- `[AI-INFERENCE]` The physical context matters more for technician-facing interactions than supervisor planning, but the plan should account for technicians in loud/gloved/dirty environments if the prototype includes execution.

## Research Questions Before Scope Decision

1. Which user owns the morning planning decision in the target fleet: maintenance supervisor, maintenance planner, fleet manager, or shop foreman?
2. Is the highest-leverage v1 about deciding priority, making jobs ready, scheduling technicians, bundling shop visits, or coordinating outsourcing?
3. Which customer archetype makes the problem concrete enough: long-haul trucking, last-mile delivery, rental fleet, municipal/public works, or construction/equipment?
4. What is the trust boundary for AI: summarize, recommend, draft schedule, assign work, or initiate downstream actions?
5. What is the smallest deterministic surface that proves the concept: priority queue, plan board, calendar, asset list, or work-order readiness view?

## Stop Rule

Stop research once we can answer:

- Who is the primary user?
- What exact daily planning decision are we improving?
- What inputs constrain that decision?
- What v1 will deliberately not do?
- What success metrics match the chosen scope?
