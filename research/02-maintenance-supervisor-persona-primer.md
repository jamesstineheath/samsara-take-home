# Maintenance Supervisor Persona Primer

Date: 2026-06-12

Triggered by James annotation on prompt block B2: "I need a primer on this persona and what user flows and tools look like. It will probably be useful to pick a target persona in a target industry to create a good demo."

Status: research synthesis, not solution direction.

## Executive Take

The prompt's "maintenance supervisor starting their morning shift" is probably best understood as a shop-level operator who turns fragmented maintenance demand into an executable daily plan.

They are not just a dispatcher. They are balancing safety/compliance, asset availability, technician capacity, parts readiness, vendor work, and operational promises made by the fleet.

The core planning question is not only "what is most important?" It is:

> What work can and should we complete today, with the people, parts, bays, and asset constraints we actually have?

## Persona Options

### 1. Maintenance Supervisor / Shop Foreman

Best fit to the assignment language.

Likely responsibilities:

- Start the day by reviewing carryover work, new defects, PM due/overdue, active faults, vehicles in the shop, and technician availability.
- Run or influence a pre-shift huddle.
- Assign work to technicians and adjust throughout the day.
- Decide what can be handled in-house versus sent to a vendor.
- Keep operations/dispatch informed about which assets are down, ready, or at risk.
- Monitor quality, safety, compliance, and completion.

Source support:

- City of Turlock says this role schedules shifts, establishes work priorities, manages PM programs, and determines spare parts/inventory needs: https://www.cityofturlock.org/workingforus/jobdescriptions/jobdescription.asp?position=45
- Intercity Transit describes the role as supervising daily fleet/facilities maintenance operations under DOT/manufacturer guidelines: https://www.intercitytransit.com/employment/job-descriptions/fleet-maintenance-supervisor
- MV Transportation explicitly mentions pre-shift meetings to communicate, prioritize, assign, adjust, and interpret work for vehicle inspection/servicing/repair/cleaning: https://careers.mvtransit.com/us/en/job/11195/Fleet-Maintenance-Supervisor

Why this is attractive for the take-home:

- Matches prompt language.
- Owns the morning planning moment.
- Can make concrete tradeoffs.
- Demo can show deterministic planning surfaces plus agentic assistance.

Risk:

- If we over-focus on technician execution, we may drift away from the supervisor's planning job.

### 2. Maintenance Planner

Adjacent persona, useful for understanding "job readiness."

Likely responsibilities:

- Turn maintenance needs into prepared work packages.
- Define tasks, estimate labor, identify parts/tools, gather technical documentation.
- Coordinate with procurement/operations before work reaches technicians.

Source support:

- Tractian distinguishes planning as the "how" of a job and scheduling as the "when" and "who": https://tractian.com/en/glossary/maintenance-planner

Why this is useful:

- Explains why parts readiness, labor estimates, and documentation matter.
- Helps avoid a naive priority list that ignores whether work can actually be done.

Risk:

- The assignment names a maintenance supervisor, not a planner. Use planner concepts as supporting logic, not primary persona, unless we intentionally choose a larger fleet archetype where planner/supervisor roles are distinct.

### 3. Fleet Maintenance Manager / Director

Economic buyer or manager-of-manager.

Likely responsibilities:

- Uptime, costs, compliance, staffing, vendor/warranty economics, lifecycle planning.
- Reviews dashboards and performance rather than running the minute-by-minute daily plan.

Source support:

- Samsara frames Connected Maintenance around uptime, cost control, wrench time, invoice/warranty admin, and real-time visibility: https://www.samsara.com/products/telematics/fleet-maintenance
- Sean McGee points to scheduling, prioritization, in-house vs. outsourcing, and total cost of ownership as the broad opportunity: https://www.samsara.com/blog/inside-connected-maintenance-sean-mcgee

Why this is useful:

- Helps define value and metrics.
- Helps tell the business story in the memo.

Risk:

- Too high altitude for the morning workflow.

## Morning Planning Flow

This is a synthesized flow from the prompt, job descriptions, and fleet maintenance software docs.

### Before The Shift

Inputs arriving overnight or before start:

- Open work orders from yesterday.
- New DVIR defects from driver inspections.
- Active fault codes / diagnostic trouble codes.
- PM due or overdue based on mileage, engine hours, or time.
- Vehicles/assets already in the shop.
- Parts inventory status.
- Technician roster, skills, absences, and shift lengths.
- Vendor work status and invoices/quotes.
- Operational demand from dispatch/routes/jobs.

### Start Of Shift

The supervisor tries to answer:

- Which assets must be ready today?
- Which defects are safety/compliance critical?
- Which work is overdue or close to causing downtime?
- Which jobs can be bundled while the asset is already in the shop?
- Which jobs are blocked by missing parts, missing information, or vendor dependency?
- Which technician is best suited for each job?
- Which tasks should be deferred, escalated, or outsourced?

### Plan Commitment

Typical outputs:

- A prioritized daily work list.
- Assignments by technician or bay.
- A view of assets down / ready / at risk.
- A short handoff to operations or dispatch.
- Exceptions: parts needed, vendor required, warranty check, compliance issue.

### During The Day

The plan changes when:

- New defects or urgent faults arrive.
- A repair takes longer than expected.
- Parts are missing.
- A vendor quote comes in.
- Dispatch needs a vehicle back.
- A technician finds additional work during inspection.

## Current Tool Landscape

### Systems They May Use

- CMMS or fleet maintenance software: work orders, PMs, inspections, parts, asset history.
- Telematics: GPS, odometer, engine hours, fault codes, utilization.
- DVIR / driver app: defects, photos, inspection status.
- Parts/inventory system: stock levels, PO status, reorder thresholds.
- Vendor/invoice workflows: quotes, invoices, warranty claims.
- Dispatch / routing / operations tools: which vehicles are needed and when.
- Whiteboards, spreadsheets, paper forms, radio/phone/text: still common planning glue.

Source support:

- Samsara says its maintenance product combines fault codes, DVIRs, work orders, costs, and inventory on real-time operations data: https://www.samsara.com/products/telematics/fleet-maintenance
- MaintainX's Samsara integration turns DVIRs, fault codes, geofences, mileage, and engine hours into work requests/work orders: https://www.getmaintainx.com/integrations/samsara
- Fleetio's work order product references technician calendars, in-house and outsourced maintenance, repair priority classes, parts, labor, and maintenance spend: https://www.fleetio.com/features/digital-work-orders
- UpKeep summarizes fleet maintenance software as connecting work orders, PM schedules, inspections, parts inventory, and asset history: https://upkeep.com/blog/fleet-maintenance-management-software/

### Why Existing Tools Still Fail The Morning Plan

Likely failure modes:

- Inputs exist but are scattered across separate tools.
- Severity and operational impact are not normalized.
- PM due, DVIR defect, and fault code may each create separate "work" for the same asset.
- A task can look important but be blocked by parts or technician skill.
- The supervisor knows context that software does not: who is good at what, what dispatch really needs, which vendor is reliable, which asset can limp for one more route.
- Whiteboard planning persists because it is fast, shared, and flexible, even when it is not connected.

## Physical Environment Constraints

Reed's note should matter, especially if the prototype touches technician execution.

Constraints:

- Shop floor is loud.
- Hands may be gloved or greasy.
- Users may be moving between vehicles, bays, yard, and parts room.
- Long text entry is bad.
- Voice may be useful but cannot be the only interface because inspection, confirmation, and accountability require visible structure.

Implication:

- Agentic assistance should not mean "chat-only."
- The product should have deterministic surfaces that can be inspected, corrected, and trusted.

## Target Industry Options For Demo

The demo should pick one concrete industry to avoid generic fleet software. Options below are not product recommendations yet.

### Option A: K-12 School Bus Fleet

Why it is strong:

- Samsara has a fresh customer story with Garden City Public Schools.
- Clear operating stakes: student safety, route reliability, public accountability.
- Morning readiness is intuitive: buses need to be safe and available before routes.
- Data inputs are concrete: DVIRs, odometer PMs, defects, bus availability, driver routes.
- Good narrative bridge: paper DVIRs and fragmented systems caused defects to fall through cracks; digitization saved time and improved uptime.

Source:

- Garden City story says paper DVIRs, fragmented systems, reactive firefighting, and manual work created strain; digitized DVIRs saved 12 admin hours weekly and improved uptime by 20%: https://www.samsara.com/blog/modernizing-maintenance-operations-for-better-efficiency

Risk:

- Could feel narrower than Samsara's larger commercial fleet opportunity.

### Option B: Last-Mile / Food Distribution Fleet

Why it is strong:

- High daily operational pressure: trucks must leave on time.
- Downtime directly affects delivery promises and customer service.
- Has in-house shop plus vendor/parts complexity.
- Strong fit for "what must be ready today?"

Source support:

- Job postings for fleet maintenance managers in distribution contexts mention daily maintenance work, labor hours, consumable supplies, schedules, and coordinating repairs with departments.

Risk:

- Need more customer-specific research to avoid generic logistics language.

### Option C: Municipal / Public Works Mixed Fleet

Why it is strong:

- Mixed assets create rich planning complexity: light vehicles, heavy equipment, public safety, utilities, seasonal equipment.
- Public-sector job descriptions provide strong source evidence for supervisor responsibilities.
- Compliance, budget, and service availability are easy to explain.

Source:

- City/county job descriptions cover PMs, repairs, parts inventory, vendor coordination, budgets, and compliance: Turlock, El Dorado, St. Johns County, Intercity Transit.

Risk:

- Mixed fleet may tempt us into overbuilding because assets and workflows vary widely.

### Option D: Construction / Heavy Equipment Fleet

Why it is strong:

- Equipment downtime is expensive and location-dependent.
- Mix of trucks, trailers, heavy equipment, tools, and yard assets maps to Samsara's expanding asset definition.
- Good fit with GPS/location/usage data.

Source support:

- Samsara lists construction as a served industry and Sean mentions expanding asset definitions such as trucks, trailers, forklifts, yard equipment, garage doors, and facilities systems.

Risk:

- May require more domain knowledge around job sites, mobile repair, and equipment rental.

## Recommendation For Next Decision

For a crisp demo, the safest starting point is:

- Primary persona: Maintenance Supervisor / Shop Foreman.
- Secondary context: Maintenance Planner concepts for job readiness.
- Buyer context: Fleet Maintenance Manager / Director for metrics.
- Target industry shortlist: K-12 school bus fleet or municipal/public works fleet.

Why this shortlist:

- Both have strong source support.
- Both make the morning planning ritual concrete.
- Both expose the exact prompt inputs: work orders, PMs, DVIRs, faults, and what is in the shop.
- Both avoid a generic trucking dashboard while staying inside Samsara's known customer universe.

## Questions For James

1. Which industry feels easiest for you to defend live: K-12 school buses, municipal/public works, last-mile distribution, or construction/heavy equipment?
2. Do you want the demo user to be a shop foreman who runs the morning huddle, or a maintenance supervisor who coordinates across shop plus dispatch?
3. Should the demo include technician execution at all, or stay focused on supervisor planning with technician context visible?
4. Which source of mess feels most interesting: DVIR defects, overdue PMs, active faults, parts shortages, or dispatch pressure?
5. What would make this feel less like a CMMS clone and more like zero-to-one product judgment?
