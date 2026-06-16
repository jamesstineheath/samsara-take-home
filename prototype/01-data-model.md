# Prototype Data Model

Status: draft schema for mock backend.

## Database Approach

Use one local SQLite database seeded with representative Hertz LAX data.

The database should simulate multiple source systems through grouped table names. This keeps local setup easy while making the data-flow story clear.

## Logical Databases

### Samsara Maintenance

Tables:

- `assets`
- `asset_status_events`
- `fault_events`
- `dvir_defects`
- `pm_schedules`
- `work_orders`
- `work_order_events`
- `asset_history_events`

Purpose:

Represent the maintenance truth Samsara likely owns or integrates with.

### Parts And Procurement

Tables:

- `parts`
- `inventory_locations`
- `part_inventory`
- `part_reservations`
- `purchase_orders`
- `purchase_order_lines`

Purpose:

Support readiness classification and avoid assigning work that cannot start.

### Warranty And Vendor

Tables:

- `warranty_coverages`
- `vendor_profiles`
- `vendor_jobs`
- `vendor_updates`

Purpose:

Show why some work should go through warranty, dealer, or outside vendor paths.

### Rental Operations

Tables:

- `vehicle_classes`
- `rental_demand_windows`
- `ready_line_status`
- `rental_holds`

Purpose:

Translate Asset Uptime into Hertz-specific operational value: rentable inventory by class and time window.

### Local Shop Context

Tables:

- `shifts`
- `technicians`
- `shift_roster`
- `bays`
- `handoff_notes`
- `local_context_captures`

Purpose:

Represent the local context that often lives in supervisors' heads, whiteboards, photos, notes, and floor conversations.

### Product Loop

Tables:

- `shift_briefs`
- `brief_decision_clusters`
- `brief_focus_items`
- `brief_item_signals`
- `brief_item_actions`
- `supervisor_feedback`
- `brief_metrics_snapshots`

Purpose:

Represent the product's own operating loop: recommendations, evidence, user feedback, and state changes.

## Core Objects

### Asset

Key fields:

- `id`
- `fleet_id`
- `vin`
- `vehicle_class_id`
- `make`
- `model`
- `year`
- `odometer`
- `current_location`
- `current_status`

### Work Order

Key fields:

- `id`
- `asset_id`
- `status`
- `title`
- `source_type`
- `severity`
- `opened_at`
- `estimated_minutes`
- `assigned_vendor_id`
- `required_part_ids`

### Shift Brief

Key fields:

- `id`
- `site_id`
- `shift_id`
- `generated_at`
- `summary_ready_count`
- `summary_blocked_count`
- `summary_needs_review_count`
- `summary_high_impact_count`

### Decision Cluster

Key fields:

- `id`
- `shift_brief_id`
- `altitude`
- `title`
- `count`
- `unit`
- `urgency`
- `summary`
- `constraint`
- `recommended_action`
- `item_ids`

Purpose:

Represent the supervisor's batch-level decision before drilling into specific vehicles. Examples: SUV shortage, parts blockers, vendor/warranty routing, PM bundle candidates, and review-before-release risk.

### Focus Item

Key fields:

- `id`
- `shift_brief_id`
- `asset_id`
- `work_order_id`
- `rank`
- `readiness_state`
- `impact_score`
- `confidence`
- `title`
- `why_this_shift`
- `known_blocker`
- `suggested_next_step`
- `deep_link_type`
- `deep_link_label`

Readiness states:

- `ready`
- `blocked`
- `needs_review`
- `vendor`
- `defer`
- `bundle_candidate`

Feedback states:

- `planned_this_shift`
- `deferred`
- `blocked`
- `sent_to_vendor`
- `already_handled`
- `not_relevant`

## Seed Scenario

Use one representative shift:

- Site: Hertz LAX Fleet Services.
- Shift: Tuesday, June 16, 2026, 6:00 AM to 2:00 PM.
- Supervisor: Maya Torres.
- Operation context: SUV and midsize demand pressure before afternoon arrival peak.

## Representative Scale

Use public facility scale to ground the mock data, then model a plausible Hertz-family slice.

Public grounding:

- LAX's ConRAC facility is approximately 6.3 million square feet.
- LAWA says the facility houses over 18,000 rental car vehicles across ready/return, idle storage, and employee parking.
- LAWA says a rental car leaves the facility approximately every two seconds during peak activity.
- Hertz LAX is located at the LAX Rental Car Center and operates 24/7.

Important caveat:

This is not actual Hertz operational data. Public sources do not disclose the exact Hertz LAX fleet size, maintenance backlog, staffing, or shop throughput. The prototype should therefore use representative mock scale, not claim factual Hertz counts.

### Site-Scale Mock Counts

Seed enough data to feel like a real airport rental operation:

| Object | Representative Mock Scale | Why |
|---|---:|---|
| Active assets at Hertz-family LAX site | 3,200 | A plausible low-thousands slice of an 18,000+ vehicle multi-tenant facility. |
| Vehicle classes | 12 | Enough to show class-demand tradeoffs without overwhelming the UI. |
| Ready-line status rows | 72 | 12 classes x 6 time snapshots for a shift day. |
| Rental demand windows | 36 | Morning, afternoon, evening demand by major class groups. |
| Open work orders | 185 | Enough to show backlog pressure and prioritization. |
| Work orders created in last 24h | 42 | Represents return/inspection/fault inflow. |
| Active fault events in last 24h | 230 | Telematics can be noisy; not every signal becomes a work order. |
| DVIR defects in last 24h | 65 | Driver/customer-reported defects feeding triage. |
| PM schedules | 3,200 | One active PM schedule profile per asset. |
| PMs due in next 7 days | 285 | Creates bundle/defer tradeoffs. |
| Parts SKUs | 450 | Common rental-fleet parts, tires, fluids, filters, brakes, sensors. |
| Inventory rows | 1,350 | Parts spread across stockroom, QTA, mobile carts, and vendor reserve. |
| Open purchase orders | 48 | Enough inbound parts to show "blocked until arrival" logic. |
| Warranty coverage records | 1,050 | Mix of new vehicles, tires, batteries, and component warranties. |
| Vendor jobs | 38 | Dealer/body/glass/tire/vendor work outside the local shop. |
| Technicians on day shift | 18 | Enough capacity to make prioritization meaningful. |
| Total technicians across 24h | 40 | Supports 24/7 handoff without staffing every minute. |
| Bays / service lanes | 24 | Mix of quick-turn lanes, repair bays, wash/detail handoff, and inspection lanes. |
| Shift handoff notes per day | 18 | Captures local context that does not live cleanly in systems. |
| Shift brief focus items surfaced | 10-12 | The UI should show the short list, not the whole backlog. |

### Prototype-Visible Slice

The UI should not show all 3,200 assets or all 185 open work orders by default.

Default screen:

- Summary counts across the full mocked operation.
- 4-6 batch-level decision clusters.
- 10-12 ranked focus items.
- 4-6 carryover or "what changed" items.
- 5-8 blockers.
- One detail drawer with source evidence.

Optional drilldowns:

- "185 open work orders" can open a mocked work-order table.
- "230 active faults" can open a filtered fault list.
- "48 open POs" can open a procurement exceptions table.

This gives James a real sense of operational scale while keeping the core workflow explainable.

Include 8-12 focus items:

- A high-value SUV ready now because parts are on hand.
- A midsize sedan blocked by inbound brake pads.
- A repeat check-engine fault that needs review before dispatch.
- A warranty-covered repair that should route to dealer.
- A PM bundle candidate already in the bay.
- A vendor job with stale ETA.
- A returned vehicle with damage-note/photo context.
- A low-value job that should defer because the class has enough ready inventory.

## API Endpoints

Minimum endpoints:

- `GET /api/shift-brief/current`
- `GET /api/shift-brief/:id`
- `GET /api/focus-items/:id`
- `POST /api/focus-items/:id/feedback`
- `POST /api/focus-items/:id/local-context`
- `GET /api/assets/:id`
- `GET /api/work-orders/:id`
- `GET /api/metrics/shift-brief/:id`

Optional endpoints for variant polish:

- `GET /api/inventory/exceptions`
- `GET /api/vendor-jobs/aging`
- `GET /api/mobile/shift-floor-view`

## Data Principles

- Every recommendation should have visible source signals.
- Every focus item should have one clear next action.
- Every blocker should name the missing part, vendor, warranty path, or local context.
- Every feedback action should persist and update summary counts.
- Mock data should be plausible, not exhaustive.
