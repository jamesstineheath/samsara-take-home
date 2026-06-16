# UI Screenshot Reference

Date: 2026-06-15
Status: visual grounding for James review. Not final design direction.
Purpose: collect official or near-official visual references for Samsara and adjacent maintenance tools.

## Why This Matters

`[JAMES]` Need screenshots to ground what the existing Samsara and competitor UI looks like.

`[AI-INFERENCE]` The design should feel like a natural extension of existing maintenance software: dense, operational, scannable, and workflow-adjacent. Avoid a standalone "command center" look for v1.

## Samsara References

Primary source: https://www.samsara.com/products/telematics/fleet-maintenance

| Screenshot | What It Shows | Design Signal |
|---|---|---|
| [Smart work-order suggestions](https://images.ctfassets.net/bx9krvy0u3sx/3lWqBUZFR5kQNp6kwCLvma/66978eec75f756b25f1ea5bfa6724c76/Consolidate_shop_visits_with_smart_work_order_suggestions__1_.png?fm=webp&h=3068&q=80&w=2160) | Upcoming PM with suggested add-on items. | Brief can use compact cards with reason and suggested action. |
| [Inventory management](https://images.ctfassets.net/bx9krvy0u3sx/1AMvBafJ1AiRwP2JU9gVYt/7bbbaf3309a6764ffade86ec3b6623c0/inventory-management.png?fm=webp&h=3074&q=80&w=2160) | Inventory value, out-of-stock, low-stock, part rows. | Readiness blockers can be shown as inventory exceptions. |
| [Vendor costs view](https://images.ctfassets.net/bx9krvy0u3sx/2yXokxQTW06QgqtYbwFrKq/5013d2381d9878ac78375b8062b6e045/manage-vendor-costs-img.png?fm=webp&h=1470&q=80&w=2160) | Fleet sidebar, vendors table, search, filters. | Morning Brief should feel like another tab in this existing sidebar/table system. |
| [AI invoice-to-work-order flow](https://images.ctfassets.net/bx9krvy0u3sx/1JwAb0nuxNP3uDrWn5pylE/c567cac6cf4845f0f7ca96963d6d698b/Reduce_paperwork_processing_time.png?fm=webp&h=3068&q=80&w=2160) | Progress card for extracting invoice content and autofilling work order. | Samsara already uses checklist/progress language for AI-assisted workflows. |

`[AI-INFERENCE]` Samsara's current maintenance visuals are clean, sparse, card/table oriented, and use clear operational labels. The Morning Brief should match this style rather than introduce a visually loud new surface.

## Fleetio References

Primary source: https://www.fleetio.com/blog/just-released-improvements-to-work-orders

| Screenshot | What It Shows | Design Signal |
|---|---|---|
| [New work order form](https://marketing-cdn.fleetio.com/images/blog/2018-03-26-work-order-improvements/work-order-screenshot.png) | Work order creation with vehicle, odometer, status, date, open issues. | Competitors treat maintenance work as structured forms with required fields and statuses. |
| [Service reminder add-to-work-order](https://marketing-cdn.fleetio.com/images/blog/2018-03-26-work-order-improvements/add-item.png) | Add PM/reminder directly into a work order. | Bundling related work is established behavior; our brief should recommend, not overclaim novelty. |

`[AI-INFERENCE]` Fleetio reinforces that work-order creation and bundling are table stakes. Samsara's wedge should be pre-shift focus and readiness insight, not another work-order form.

## MaintainX References

Primary source: https://help.getmaintainx.com/view-and-filter-work-orders

| Screenshot | What It Shows | Design Signal |
|---|---|---|
| [Work orders split-pane view](https://help.getmaintainx.com/assets/images/view-filter-work-order-split-8ae0adc6cc8ccd60630014ce76d1922a.png) | Left list of work orders, right detail pane, status controls, due date, assigned team, asset, categories, time/cost tracking. | Technician/supervisor work surfaces are list-detail workflows. Brief recommendations can deep-link into this kind of detail surface. |

`[AI-INFERENCE]` MaintainX is a good grounding reference for the "do not replace the work surface" argument. A morning brief can hand off into existing work-order list/detail patterns.

## Fullbay References

Primary source: https://www.fullbay.com/products/service-orders/

| Screenshot | What It Shows | Design Signal |
|---|---|---|
| [Easy service order illustration](https://www.fullbay.com/wp-content/uploads/2023/06/Feature-Illustration_Easy-Service-Order_v2.jpg) | Estimate / scheduling / technician assignment / action items / authorization. | Fullbay emphasizes shop workflow depth and authorization. Avoid copying this depth into v1. |
| [Workflow assignment illustration](https://www.fullbay.com/wp-content/uploads/2021/10/Feature-Illustration_Quarterback-Workflow.jpg) | Technician overview, diagnose, assign, service order, lead tech. | Shop tools care about assignment and technician state; v1 brief can point to this without owning it. |

`[AI-INFERENCE]` Fullbay's visuals are more marketing illustrations than literal UI screenshots, but they reinforce the complexity of full shop management. That supports keeping the v1 brief narrow.

## Design Implications For The Prototype

`[AI-DRAFT]` The prototype should look like a Samsara Connected Maintenance tab:

- Left platform/sidebar context.
- Page title: Morning Brief.
- Top summary row: overnight changes, ready work, blocked work, high-impact focus areas.
- Focus-area cards with reason, data sources, readiness, and action tags.
- Dense table/list for all surfaced items.
- Lightweight feedback buttons: Planned, Deferred, Blocked, Vendor, Already handled.
- Deep links to asset, work order, inventory, vendor, or warranty record.

`[AI-INFERENCE]` The brief should be more like an operational report with actions than a dashboard, kanban board, or autonomous scheduler.
