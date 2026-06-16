import { getDb } from "./db";

const readinessLabels = {
  ready: "Ready",
  blocked: "Blocked",
  needs_review: "Needs review",
  vendor: "Vendor",
  defer: "Defer",
  bundle_candidate: "Bundle"
};

export function getCurrentShiftBrief() {
  const database = getDb();
  const brief = database
    .prepare(
      `SELECT sb.*, s.label AS shift_label, s.starts_at, s.ends_at, s.supervisor_name, sites.name AS site_name,
        sites.location, sites.operating_model
       FROM shift_briefs sb
       JOIN shifts s ON s.id = sb.shift_id
       JOIN sites ON sites.id = sb.site_id
       ORDER BY sb.generated_at DESC
       LIMIT 1`
    )
    .get();

  return hydrateBrief(database, brief);
}

export function getShiftBrief(id) {
  const database = getDb();
  const brief = database
    .prepare(
      `SELECT sb.*, s.label AS shift_label, s.starts_at, s.ends_at, s.supervisor_name, sites.name AS site_name,
        sites.location, sites.operating_model
       FROM shift_briefs sb
       JOIN shifts s ON s.id = sb.shift_id
       JOIN sites ON sites.id = sb.site_id
       WHERE sb.id = ?`
    )
    .get(id);

  if (!brief) return null;
  return hydrateBrief(database, brief);
}

export function getFocusItem(id) {
  const database = getDb();
  const item = database
    .prepare(
      `SELECT bfi.*, a.fleet_id, a.vin, a.make, a.model, a.year, a.odometer, a.current_location,
        a.current_status, a.days_unavailable, vc.name AS vehicle_class_name, vc.segment,
        vc.demand_pressure, vc.ready_now, vc.target_ready, vc.next_peak,
        wo.status AS work_order_status, wo.source_type, wo.severity, wo.estimated_minutes,
        wo.required_part_ids
       FROM brief_focus_items bfi
       JOIN assets a ON a.id = bfi.asset_id
       JOIN vehicle_classes vc ON vc.id = a.vehicle_class_id
       JOIN work_orders wo ON wo.id = bfi.work_order_id
       WHERE bfi.id = ?`
    )
    .get(id);

  if (!item) return null;
  return hydrateFocusItem(database, item);
}

export function recordFeedback(id, feedbackState, reason = "") {
  const database = getDb();
  const item = database.prepare("SELECT id FROM brief_focus_items WHERE id = ?").get(id);
  if (!item) return null;

  const feedbackId = `feedback_${Date.now()}_${Math.round(Math.random() * 10000)}`;
  database
    .prepare("INSERT INTO supervisor_feedback VALUES (?, ?, ?, ?, ?, ?)")
    .run(feedbackId, id, feedbackState, reason, new Date().toISOString(), "Maya Torres");
  database.prepare("UPDATE brief_focus_items SET feedback_state = ? WHERE id = ?").run(feedbackState, id);

  const focusItem = getFocusItem(id);
  const brief = getCurrentShiftBrief();
  return { focusItem, summary: brief.summary, actionSummary: brief.actionSummary };
}

export function recordLocalContext(id, captureType, text) {
  const database = getDb();
  const item = database.prepare("SELECT id FROM brief_focus_items WHERE id = ?").get(id);
  if (!item) return null;
  const captureId = `capture_${Date.now()}_${Math.round(Math.random() * 10000)}`;
  database
    .prepare("INSERT INTO local_context_captures VALUES (?, ?, ?, ?, ?, ?)")
    .run(captureId, id, captureType, text, new Date().toISOString(), "Maya Torres");
  return getFocusItem(id);
}

export function getAsset(id) {
  const database = getDb();
  return database
    .prepare(
      `SELECT a.*, vc.name AS vehicle_class_name, vc.demand_pressure, vc.ready_now, vc.target_ready
       FROM assets a JOIN vehicle_classes vc ON vc.id = a.vehicle_class_id
       WHERE a.id = ?`
    )
    .get(id);
}

export function getWorkOrder(id) {
  const database = getDb();
  return database
    .prepare(
      `SELECT wo.*, a.fleet_id, a.make, a.model, a.current_status
       FROM work_orders wo JOIN assets a ON a.id = wo.asset_id
       WHERE wo.id = ?`
    )
    .get(id);
}

export function getWorkOrdersIndex() {
  const database = getDb();
  const brief = getCurrentShiftBrief();
  const preparedByWorkOrderId = buildPreparedPlanIndex(brief);

  const rows = database
    .prepare(
      `SELECT wo.*, a.fleet_id, a.make, a.model, a.year, a.current_status,
        vc.name AS vehicle_class_name, vc.segment
       FROM work_orders wo
       JOIN assets a ON a.id = wo.asset_id
       JOIN vehicle_classes vc ON vc.id = a.vehicle_class_id
       ORDER BY datetime(wo.opened_at) DESC, wo.id ASC`
    )
    .all();

  const statusCounts = database
    .prepare("SELECT status, COUNT(*) AS count FROM work_orders GROUP BY status")
    .all();
  const sourceCounts = database
    .prepare("SELECT source_type, COUNT(*) AS count FROM work_orders GROUP BY source_type")
    .all();
  const severityCounts = database
    .prepare("SELECT severity, COUNT(*) AS count FROM work_orders GROUP BY severity")
    .all();
  const classCounts = database
    .prepare(
      `SELECT vc.name AS vehicle_class_name, COUNT(*) AS count
       FROM work_orders wo
       JOIN assets a ON a.id = wo.asset_id
       JOIN vehicle_classes vc ON vc.id = a.vehicle_class_id
       GROUP BY vc.name
       ORDER BY count DESC`
    )
    .all();

  const statuses = Object.fromEntries(statusCounts.map((row) => [row.status, row.count]));
  const planSummary = brief.workOrderQueue.summary;

  const totalCount = database.prepare("SELECT COUNT(*) AS count FROM work_orders").get().count;

  return {
    summary: {
      total: totalCount,
      open: statuses.open ?? 0,
      blocked: statuses.blocked ?? 0,
      inProgress: statuses.in_progress ?? 0,
      vendor: statuses.vendor ?? 0,
      preparedPlanCount: planSummary.vehicleRecommendationCount,
      needLocalCheck: planSummary.contextNeeded,
      readyToCommit: planSummary.readyToCommit,
      workOrdersAffected: planSummary.workOrdersTouched
    },
    filters: {
      statuses: statusCounts.map((row) => ({ id: row.status, label: formatWorkOrderStatus(row.status), count: row.count })),
      sources: sourceCounts.map((row) => ({ id: row.source_type, label: formatSourceType(row.source_type), count: row.count })),
      severities: severityCounts.map((row) => ({ id: row.severity, label: capitalize(row.severity), count: row.count })),
      classes: classCounts.map((row) => ({ id: row.vehicle_class_name, label: row.vehicle_class_name, count: row.count })),
      sortOptions: [
        { id: "newest", label: "Newest first" },
        { id: "severity", label: "Severity" },
        { id: "estimate", label: "Estimate" }
      ]
    },
    preparedPlan: {
      title: "Prepared Asset Plan",
      vehicleRecommendations: planSummary.vehicleRecommendationCount,
      needLocalCheck: planSummary.contextNeeded,
      readyToCommit: planSummary.readyToCommit,
      workOrdersAffected: planSummary.workOrdersTouched
    },
    items: rows.map((row) => {
      const preparedPlan = preparedByWorkOrderId.get(row.id) ?? null;
      return {
        id: row.id,
        number: preparedPlan?.workOrderNumber ?? formatWorkOrderNumber(row.id),
        title: row.title,
        status: row.status,
        statusLabel: formatWorkOrderStatus(row.status),
        sourceType: row.source_type,
        sourceLabel: formatSourceType(row.source_type),
        severity: row.severity,
        severityLabel: capitalize(row.severity),
        openedAt: row.opened_at,
        openedLabel: formatOpenedAt(row.opened_at),
        estimatedMinutes: row.estimated_minutes,
        estimateLabel: `${row.estimated_minutes} min`,
        asset: {
          fleetId: row.fleet_id,
          vehicle: `${row.year} ${row.make} ${row.model}`,
          vehicleClassName: row.vehicle_class_name,
          currentStatus: row.current_status
        },
        preparedPlan
      };
    })
  };
}

export function getShiftMetrics(id) {
  const database = getDb();
  const brief = database.prepare("SELECT * FROM shift_briefs WHERE id = ?").get(id);
  if (!brief) return null;
  const feedback = database
    .prepare(
      `SELECT feedback_state, COUNT(*) AS count
       FROM supervisor_feedback sf
       JOIN brief_focus_items bfi ON bfi.id = sf.focus_item_id
       WHERE bfi.shift_brief_id = ?
       GROUP BY feedback_state`
    )
    .all(id);

  return {
    scale: {
      activeAssets: brief.active_assets,
      openWorkOrders: brief.open_work_orders,
      activeFaults: brief.active_faults,
      dvirDefects: brief.dvir_defects,
      inboundPurchaseOrders: brief.inbound_purchase_orders,
      vendorJobs: brief.vendor_jobs_count
    },
    feedback
  };
}

function buildPreparedPlanIndex(brief) {
  const focusById = new Map(brief.focusItems.map((item) => [item.id, item]));
  const packetByFocusId = new Map(
    brief.workOrderQueue.items.map((packet) => [packet.focusItemId, packet])
  );
  const preparedByWorkOrderId = new Map();

  brief.workOrderQueue.reviewDecisions.forEach((decision) => {
    decision.focusItemIds.forEach((focusItemId) => {
      const focusItem = focusById.get(focusItemId);
      const packet = packetByFocusId.get(focusItemId);
      if (!focusItem || !packet) return;
      preparedByWorkOrderId.set(focusItem.workOrderId, {
        rank: decision.rank,
        decisionTitle: decision.title,
        actionLabel: decision.workOrderWord,
        focusItemId,
        workOrderNumber: packet.workOrderNumber,
        tone: decision.tone
      });
    });
  });

  return preparedByWorkOrderId;
}

function formatWorkOrderNumber(id) {
  const numeric = Number(String(id).replace(/\D/g, ""));
  if (Number.isFinite(numeric) && numeric > 0) return `WO-${8000 + numeric}`;
  return String(id).toUpperCase();
}

function formatWorkOrderStatus(status) {
  const labels = {
    open: "Open",
    blocked: "Blocked",
    in_progress: "In progress",
    vendor: "Vendor"
  };
  return labels[status] ?? capitalize(String(status).replace(/_/g, " "));
}

function formatSourceType(sourceType) {
  const labels = {
    fault: "Fault",
    PM: "PM",
    DVIR: "DVIR",
    return_inspection: "Return inspection"
  };
  return labels[sourceType] ?? capitalize(String(sourceType).replace(/_/g, " "));
}

function formatOpenedAt(openedAt) {
  const date = new Date(openedAt);
  if (Number.isNaN(date.getTime())) return "Not shown";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function hydrateBrief(database, brief) {
  const focusItems = database
    .prepare(
      `SELECT bfi.*, a.fleet_id, a.make, a.model, a.year, a.current_status, a.current_location,
        a.days_unavailable, vc.name AS vehicle_class_name, vc.demand_pressure, vc.ready_now, vc.target_ready,
        wo.estimated_minutes, wo.source_type, wo.severity, wo.required_part_ids,
        wo.status AS work_order_status
       FROM brief_focus_items bfi
       JOIN assets a ON a.id = bfi.asset_id
       JOIN vehicle_classes vc ON vc.id = a.vehicle_class_id
       JOIN work_orders wo ON wo.id = bfi.work_order_id
       WHERE bfi.shift_brief_id = ?
       ORDER BY bfi.rank ASC`
    )
    .all(brief.id)
    .map((item) => formatFocusItem(item));

  const handoffNotes = database
    .prepare("SELECT * FROM handoff_notes WHERE shift_id = ? ORDER BY id ASC")
    .all(brief.shift_id);
  const demand = database
    .prepare(
      `SELECT vc.name, vc.segment, vc.demand_pressure, vc.ready_now, vc.target_ready, vc.next_peak
       FROM vehicle_classes vc
       ORDER BY vc.demand_pressure DESC
       LIMIT 5`
    )
    .all();

  const actionSummary = database
    .prepare(
      `SELECT COALESCE(feedback_state, 'unreviewed') AS state, COUNT(*) AS count
       FROM brief_focus_items
       WHERE shift_brief_id = ?
       GROUP BY COALESCE(feedback_state, 'unreviewed')`
    )
    .all(brief.id);

  const decisionClusters = buildDecisionClusters(focusItems, brief);
  const shiftPlan = buildShiftPlan(database, brief, focusItems);
  const workOrderQueue = buildWorkOrderQueue(focusItems, decisionClusters, shiftPlan, brief);

  return {
    id: brief.id,
    site: {
      id: brief.site_id,
      name: brief.site_name,
      location: brief.location,
      operatingModel: brief.operating_model
    },
    shift: {
      id: brief.shift_id,
      label: brief.shift_label,
      startsAt: brief.starts_at,
      endsAt: brief.ends_at,
      supervisorName: brief.supervisor_name,
      generatedAt: brief.generated_at
    },
    summary: {
      ready: brief.summary_ready_count,
      blocked: brief.summary_blocked_count,
      needsReview: brief.summary_needs_review_count,
      highImpact: brief.summary_high_impact_count
    },
    operationScale: {
      activeAssets: brief.active_assets,
      openWorkOrders: brief.open_work_orders,
      activeFaults: brief.active_faults,
      dvirDefects: brief.dvir_defects,
      inboundPurchaseOrders: brief.inbound_purchase_orders,
      vendorJobs: brief.vendor_jobs_count
    },
    handoffNotes,
    demand,
    decisionClusters,
    shiftPlan,
    workOrderQueue,
    focusItems,
    actionSummary
  };
}

function buildWorkOrderQueue(focusItems, decisionClusters, shiftPlan, brief) {
  const clusterByItemId = new Map();
  decisionClusters.forEach((cluster) => {
    cluster.itemIds.forEach((itemId) => {
      if (!clusterByItemId.has(itemId)) clusterByItemId.set(itemId, cluster);
    });
  });

  const assignmentByItemId = new Map(
    shiftPlan.assignments.map((assignment) => [assignment.focusItemId, assignment])
  );
  const bundleByItemId = new Map(
    shiftPlan.bundleOpportunities.map((bundle) => [bundle.focusItemId, bundle])
  );

  const items = focusItems.map((item) => {
    const cluster = clusterByItemId.get(item.id);
    const assignment = assignmentByItemId.get(item.id);
    const bundle = bundleByItemId.get(item.id);
    const action = getWorkOrderAction(item, assignment, bundle);

    return {
      id: `wo_packet_${item.id}`,
      focusItemId: item.id,
      rank: item.rank,
      workOrderNumber: getWorkOrderNumber(item),
      packetType: getPacketType(item),
      title: item.title,
      assetLabel: item.fleetId,
      assetDescription: `${item.vehicleClassName} · ${item.vehicle}`,
      readinessState: item.readinessState,
      readinessLabel: item.readinessLabel,
      status: item.workOrderStatus,
      estimatedMinutes: item.estimatedMinutes,
      sourceType: item.sourceType,
      blocker: item.knownBlocker,
      whyThisShift: item.whyThisShift,
      nextAction: action.label,
      actionDetail: action.detail,
      actionFeedbackState: action.feedbackState,
      actionTone: action.tone,
      clusterTitle: cluster?.title ?? "Supervisor attention",
      clusterReason: cluster?.handoffAction ?? item.suggestedNextStep,
      insightIds: getInsightIds(item),
      assignment: assignment
        ? {
            wave: assignment.wave,
            techs: assignment.techs,
            handoff: assignment.handoff,
            uncertainty: assignment.uncertainty
          }
        : null,
      bundle: bundle
        ? {
            title: bundle.title,
            currentWork: bundle.currentWork,
            addOnWork: bundle.addOnWork,
            incrementalTime: bundle.incrementalTime,
            currentEstimate: bundle.currentEstimate,
            amendedEstimate: bundle.amendedEstimate,
            payoff: bundle.payoff,
            action: bundle.action,
            tradeoff: bundle.tradeoff,
            guardrail: bundle.guardrail
          }
        : null,
      currentWorkOrder: buildCurrentWorkOrder(item, bundle),
      proposedAmendment: buildProposedAmendment(item, action, assignment, bundle),
      feedbackState: item.feedbackState
    };
  });
  const insights = buildPredictiveInsights(items);
  const reviewDecisions = buildReviewDecisions(items, insights);
  const planningHorizons = buildPlanningHorizons(reviewDecisions);

  return {
    canonicalUnit: "Vehicle",
    layerName: "Plan Review",
    systemOfRecord: "Connected Maintenance > Work Orders",
    layerRole: "Prepared vehicle decisions with Work Orders underneath",
    preparedFor: "A reviewed asset plan that can write back into Work Orders",
    visibleLimit: 12,
    summary: {
      openWorkOrders: brief.open_work_orders,
      shiftRelevant: 42,
      supervisorAttention: 18,
      insightCount: insights.length,
      reviewDecisionCount: reviewDecisions.length,
      vehicleRecommendationCount: reviewDecisions.length,
      readyToCommit: reviewDecisions.filter((decision) => decision.reviewState === "ready").length,
      contextNeeded: reviewDecisions.filter((decision) => decision.reviewState === "context").length,
      vehiclesTouched: reviewDecisions.reduce((sum, decision) => sum + decision.impactedCount, 0),
      workOrdersTouched: reviewDecisions.reduce(
        (sum, decision) => sum + decision.affectedWorkOrderCount,
        0
      ),
      surfacedPackets: items.length,
      shownFirst: 12,
      readyNow: items.filter((item) => item.readinessState === "ready").length,
      blocked: items.filter((item) => item.readinessState === "blocked").length,
      bundles: items.filter((item) => item.bundle).length,
      draft: items.filter((item) => item.packetType === "Draft WO").length,
      oneClick: items.filter((item) =>
        ["Assign tech", "Buy / confirm part", "Bundle work", "Close WO"].includes(item.nextAction)
      ).length
    },
    insights,
    reviewDecisions,
    planningHorizons,
    items
  };
}

function buildPlanningHorizons(decisions) {
  const definitions = [
    {
      label: "This shift",
      window: "6 AM-2 PM",
      role: "Start, hold, close, or assign work that can change today’s ready line."
    },
    {
      label: "Next 24-48h",
      window: "Tomorrow prep",
      role: "Confirm parts, vendor ETAs, and bundled work before they become blockers."
    },
    {
      label: "Weekend surge",
      window: "3-7 days",
      role: "Protect class availability before reservation and arrival demand peaks."
    }
  ];

  return definitions.map((definition) => {
    const matched = decisions.filter((decision) => decision.horizonLabel === definition.label);
    return {
      ...definition,
      count: matched.length,
      vehicleCount: matched.reduce((sum, decision) => sum + decision.impactedCount, 0),
      workOrderCount: matched.reduce((sum, decision) => sum + decision.affectedWorkOrderCount, 0)
    };
  });
}

function buildPlanLenses(items) {
  const byFocusId = new Map(items.map((item) => [item.focusItemId, item]));
  const lensSeeds = [
    {
      id: "deprioritize",
      label: "Pull down",
      title: "Current priority work to deprioritize",
      tone: "gray",
      summary: "Keep bays and tech starts available for work that changes today’s asset uptime.",
      itemIds: ["focus_9", "focus_12", "focus_7"],
      actions: {
        focus_9: "Defer cosmetic WO",
        focus_12: "Wait for lot reposition",
        focus_7: "Do not plan as same-day return"
      }
    },
    {
      id: "protect",
      label: "Protect",
      title: "Safety, recall, and warranty actions",
      tone: "amber",
      summary: "Do these before release or local repair so unsafe, noncompliant, or reimbursable work does not slip through.",
      itemIds: ["focus_3", "focus_4", "focus_10", "focus_7"],
      actions: {
        focus_3: "Hold for diagnostics",
        focus_4: "Route through warranty",
        focus_10: "Request damage photo",
        focus_7: "Refresh vendor / recall path"
      }
    }
  ];

  return lensSeeds.map((lens) => {
    const rows = lens.itemIds
      .map((itemId) => byFocusId.get(itemId))
      .filter(Boolean)
      .map((item) => ({
        id: item.focusItemId,
        title: item.title,
        workOrderNumber: item.workOrderNumber,
        assetLabel: item.assetLabel,
        action: lens.actions[item.focusItemId] ?? item.nextAction,
        reason: item.knownBlocker || item.whyThisShift
      }));

    return {
      ...lens,
      count: rows.length,
      rows
    };
  });
}

function buildReviewDecisions(items, insights) {
  const insightById = new Map(insights.map((insight) => [insight.id, insight]));
  const seeds = [
    {
      id: "review_first_wave",
      rank: 1,
      title: "Return the Jeep Grand Cherokee before the Premium SUV gap widens",
      reviewState: "context",
      stage: "Start now",
      tone: "green",
      workOrderWord: "Assign",
      horizonLabel: "This shift",
      horizonWindow: "Before 1 PM arrivals",
      what: "Premium SUV ready count is below target before the midday arrival bank. This vehicle has staged parts and a bay opening soon.",
      why: "This moves the highest-value vehicles back toward rental availability while avoiding low-impact work at shift start.",
      supervisorAsk: "Confirm Bay 04 and the brake tech pair, then assign the open WO.",
      preparedWriteback: "Assign WO-9017 to Tech 7 + Tech 19 and attach the staged brake pads.",
      primaryAction: "Commit assignments",
      secondaryAction: "Change assignment",
      contextChecks: ["Bay 04 open by 6:15", "Brake parts staged", "Tech 7 + Tech 19 on shift"],
      focusItemIds: ["focus_1"],
      sourceInsightId: "insight_demand_surge"
    },
    {
      id: "review_close_tpms",
      rank: 2,
      title: "Close the Toyota RAV4 if TPMS work is resolved",
      reviewState: "ready",
      stage: "Closeout",
      tone: "green",
      workOrderWord: "Close",
      horizonLabel: "This shift",
      horizonWindow: "First hour",
      what: "The tire-pressure DVIR appears resolved, but the WO is still keeping the vehicle out of the ready count.",
      why: "A clean closeout can add one SUV-class vehicle to available inventory without consuming a bay.",
      supervisorAsk: "Have Tech 14 verify the closeout and move the asset state to rentable if operations agrees.",
      preparedWriteback: "Close WO-9441 after TPMS verification and add a release note.",
      primaryAction: "Close WO",
      secondaryAction: "Open WO",
      contextChecks: ["TPMS verified", "DVIR closed", "Ops agrees asset can move to ready line"],
      focusItemIds: ["focus_11"],
      sourceInsightId: "insight_demand_surge"
    },
    {
      id: "review_camry_quick_turn",
      rank: 3,
      title: "Use the Toyota Camry as fill-in quick-turn work",
      reviewState: "ready",
      stage: "Fill-in work",
      tone: "blue",
      workOrderWord: "Assign",
      horizonLabel: "This shift",
      horizonWindow: "Between higher-risk jobs",
      what: "Full-size ready count is slightly under target and the oil/filter service has staged parts.",
      why: "This is a good filler job when a tech has a short gap, but it should not outrank SUV or safety work.",
      supervisorAsk: "Keep it in the plan as fill-in work, then assign when a quick-turn tech opens up.",
      preparedWriteback: "Keep WO-9707 in the shift plan as filler work and attach staged QTA parts.",
      primaryAction: "Keep in plan",
      secondaryAction: "Open WO",
      contextChecks: ["QTA parts staged", "Quick-turn tech available", "Does not delay higher-value SUV work"],
      focusItemIds: ["focus_8"],
      sourceInsightId: "insight_demand_surge"
    },
    {
      id: "review_parts_gate_brakes",
      rank: 4,
      title: "Hold the Chevrolet Malibu until brake pads are confirmed",
      reviewState: "context",
      stage: "Parts gate",
      tone: "red",
      workOrderWord: "Unblock",
      horizonLabel: "Next 24-48h",
      horizonWindow: "Before 11:30 AM",
      what: "The midsize brake job is important, but a tech start will stall if pads have not actually arrived.",
      why: "The plan should not consume a bay or tech start on work that cannot proceed.",
      supervisorAsk: "Confirm PO-4756 receipt or available stock before assigning labor.",
      preparedWriteback: "Add a parts gate note and create a parts-room confirmation task.",
      primaryAction: "Confirm parts",
      secondaryAction: "Hold work",
      contextChecks: ["PO-4756 arrival status", "Pads scanned into stock", "Parts runner available"],
      focusItemIds: ["focus_2"],
      sourceInsightId: "insight_parts_unblock"
    },
    {
      id: "review_ev_cable",
      rank: 5,
      title: "Confirm EV cable before assigning the Tesla Model 3",
      reviewState: "context",
      stage: "Parts gate",
      tone: "red",
      workOrderWord: "Confirm",
      horizonLabel: "Next 24-48h",
      horizonWindow: "Before EV demand rises",
      what: "The EV class is under target, but this vehicle cannot be rented without the missing charge cable.",
      why: "The fastest path may be a stockroom confirmation or parts order, not a technician assignment.",
      supervisorAsk: "Verify the EV-CBL count and create the part action before putting the vehicle in a bay.",
      preparedWriteback: "Add a stockroom confirmation note and keep the WO blocked until EV-CBL is confirmed.",
      primaryAction: "Confirm cable",
      secondaryAction: "Order part",
      contextChecks: ["EV-CBL stock count", "Replacement source", "No tech start until part is confirmed"],
      focusItemIds: ["focus_6"],
      sourceInsightId: "insight_parts_unblock"
    },
    {
      id: "review_bundle_pm",
      rank: 6,
      title: "Bundle PM A while the Hyundai Elantra is already in the bay",
      reviewState: "ready",
      stage: "Ready to commit",
      tone: "violet",
      workOrderWord: "Bundle",
      horizonLabel: "Weekend surge",
      horizonWindow: "3-7 day demand prep",
      what: "The vehicle is already in Bay 09 for tire work and PM A is due in 420 miles.",
      why: "Bundling can reduce repeat downtime later this week without asking the supervisor to rebuild the full schedule.",
      supervisorAsk: "Approve the add-on only if the added time does not hurt today’s ready-line need.",
      preparedWriteback: "Add PM A to WO-9203 as a bundled task.",
      primaryAction: "Add bundled tasks",
      secondaryAction: "Review WOs",
      affectedWorkOrderCount: 2,
      contextChecks: ["PM due window", "Parts available", "No bay extension required"],
      proofSummary: "This is ROI-positive only because the add-ons are either near-due or inspection-only. The plan should not replace healthy parts early just to avoid a future visit.",
      proofRows: [
        {
          label: "Incremental shop time",
          value: "+20 min",
          note: "Adds PM A while the vehicle is already in Bay 09 for tire work."
        },
        {
          label: "Repeat downtime avoided",
          value: "1 shop return",
          note: "Avoids pulling this vehicle back for PM during the upcoming demand window."
        },
        {
          label: "Parts-life risk",
          value: "Controlled",
          note: "PM A is 420 miles early, inside the supervisor-review window."
        },
        {
          label: "Reject if",
          value: "Ready-line need wins",
          note: "Do not bundle if the added time pushes the asset past the class-ready need or consumes scarce parts."
        }
      ],
      focusItemIds: ["focus_5"],
      sourceInsightId: "insight_bundle_window"
    },
    {
      id: "review_repeat_fault",
      rank: 7,
      title: "Hold the Nissan Altima for repeat check-engine diagnostics",
      reviewState: "context",
      stage: "Safety hold",
      tone: "amber",
      workOrderWord: "Protect",
      horizonLabel: "This shift",
      horizonWindow: "Before release",
      what: "The same fault repeated after prior closeout, so the asset should not move to ready line on the prior note alone.",
      why: "This protects customer experience and avoids a preventable return from a vehicle that looked rent-ready.",
      supervisorAsk: "Have diagnostics inspect it before the release decision.",
      preparedWriteback: "Add a diagnostics hold and release criterion to the fault record / WO draft.",
      primaryAction: "Apply holds",
      secondaryAction: "Open fault",
      contextChecks: ["Repeat fault confirmed", "Diagnostic tech available", "Release criterion clear"],
      focusItemIds: ["focus_3"],
      sourceInsightId: "insight_safety_asset_risk"
    },
    {
      id: "review_warranty_route",
      rank: 8,
      title: "Route the Ford F-150 through the warranty path",
      reviewState: "context",
      stage: "Warranty path",
      tone: "amber",
      workOrderWord: "Protect",
      horizonLabel: "Next 24-48h",
      horizonWindow: "Before local repair",
      what: "Coverage appears active, so local repair may create avoidable cost or missed reimbursement.",
      why: "The right recommendation is not faster local work; it is preserving the reimbursement path.",
      supervisorAsk: "Send the vehicle to the dealer queue and attach warranty evidence before local work proceeds.",
      preparedWriteback: "Route the WO through warranty review and add dealer-path notes.",
      primaryAction: "Route warranty",
      secondaryAction: "Review WOs",
      contextChecks: ["Coverage active", "Dealer path required", "Evidence attached"],
      focusItemIds: ["focus_4"],
      sourceInsightId: "insight_safety_asset_risk"
    },
    {
      id: "review_vendor_eta",
      rank: 9,
      title: "Refresh the Chrysler Pacifica vendor ETA before using it in the plan",
      reviewState: "context",
      stage: "Vendor ETA",
      tone: "blue",
      workOrderWord: "Pull down",
      horizonLabel: "Next 24-48h",
      horizonWindow: "Before ready-by promise",
      what: "The glass repair has been out 2.8 days and the vendor ETA has not changed since yesterday.",
      why: "Counting this asset as a same-day return can make the plan look healthier than it really is.",
      supervisorAsk: "Call the vendor and update the ready-by time before including it in the return plan.",
      preparedWriteback: "Keep the vendor WO out of today’s return plan until ETA is refreshed.",
      primaryAction: "Call vendor",
      secondaryAction: "Pull down",
      contextChecks: ["Vendor ETA fresh", "Ready-by time updated", "Reroute if vendor slips"],
      focusItemIds: ["focus_7"],
      sourceInsightId: "insight_vendor_path"
    },
    {
      id: "review_defer_cosmetic",
      rank: 10,
      title: "Defer Hyundai Elantra cosmetic work until after the surge",
      reviewState: "ready",
      stage: "Pull down",
      tone: "gray",
      workOrderWord: "Deprioritize",
      horizonLabel: "Weekend surge",
      horizonWindow: "3-7 day demand prep",
      what: "Compact class has surplus ready inventory and the cosmetic issue does not block rental safety.",
      why: "Pulling it down protects scarce bay time for assets that change availability before the demand peak.",
      supervisorAsk: "Defer the cosmetic item and keep bay capacity for SUV, midsize, EV, or safety work.",
      preparedWriteback: "Mark cosmetic work deferred until after the demand surge.",
      primaryAction: "Pull down work",
      secondaryAction: "Open asset",
      contextChecks: ["Compact surplus", "Safety unaffected", "No ready-line impact"],
      focusItemIds: ["focus_9"],
      sourceLabel: "Plan tradeoff"
    },
    {
      id: "review_lot_access",
      rank: 11,
      title: "Reposition the Ford Transit before assigning a technician",
      reviewState: "context",
      stage: "Lot access",
      tone: "gray",
      workOrderWord: "Stage",
      horizonLabel: "This shift",
      horizonWindow: "Before tech start",
      what: "The utility van is physically blocked behind return-lane vehicles.",
      why: "A technician assignment before lot reposition creates avoidable waiting time.",
      supervisorAsk: "Ask the lot team to reposition it before it enters the maintenance plan.",
      preparedWriteback: "Add lot-access hold and do not assign technician time until the van is accessible.",
      primaryAction: "Request reposition",
      secondaryAction: "Hold work",
      contextChecks: ["Vehicle accessible", "Lot team acknowledged", "Bay path clear"],
      focusItemIds: ["focus_12"],
      sourceLabel: "Floor access"
    },
    {
      id: "review_damage_photo",
      rank: 12,
      title: "Request photo before opening work on the BMW 3 Series",
      reviewState: "context",
      stage: "Evidence needed",
      tone: "amber",
      workOrderWord: "Protect",
      horizonLabel: "Next 24-48h",
      horizonWindow: "Before WO creation",
      what: "The return-agent damage note is vague and does not yet justify opening repair work.",
      why: "A photo check prevents unnecessary WOs while preserving evidence if repair is needed.",
      supervisorAsk: "Request the missing photo and decide whether a WO is needed after review.",
      preparedWriteback: "Create a photo request and hold WO creation until evidence is attached.",
      primaryAction: "Request photo",
      secondaryAction: "Open note",
      contextChecks: ["Photo attached", "Severity confirmed", "WO created only if needed"],
      focusItemIds: ["focus_10"],
      sourceInsightId: "insight_safety_asset_risk"
    }
  ];

  return seeds
    .map((seed) => {
      const impacted = items.filter((item) => seed.focusItemIds.includes(item.focusItemId));
      const sourceInsight = insightById.get(seed.sourceInsightId);
      const assetLabels = [...new Set(impacted.map((item) => item.assetLabel))];
      const affectedWorkOrderCount = seed.affectedWorkOrderCount ?? impacted.length;
      return {
        ...seed,
        sourceLabel: seed.sourceLabel ?? sourceInsight?.signalType ?? "Prepared signal",
        impactedCount: assetLabels.length,
        affectedAssetCount: assetLabels.length,
        affectedWorkOrderCount,
        quickActionCount: impacted.filter((item) =>
          ["Assign tech", "Buy / confirm part", "Bundle work", "Close WO"].includes(item.nextAction)
        ).length,
        assetLabels,
        workOrderNumbers: impacted.slice(0, 4).map((item) => item.workOrderNumber),
        focusItemIds: impacted.map((item) => item.focusItemId)
      };
    })
    .filter((decision) => decision.impactedCount > 0);
}

function buildCurrentWorkOrder(item, bundle) {
  return {
    number: getWorkOrderNumber(item),
    status: item.workOrderStatus,
    title: bundle?.currentWork ?? item.title,
    source: item.sourceType,
    severity: item.severity,
    estimate: bundle?.currentEstimate ?? `${item.estimatedMinutes} min`,
    parts: readableParts(item.requiredParts),
    location: item.currentLocation,
    scope: bundle?.currentWork ?? item.title
  };
}

function buildProposedAmendment(item, action, assignment, bundle) {
  if (bundle) {
    return {
      label: "Proposed amendment",
      action: bundle.action,
      summary: bundle.addOnWork,
      estimateDelta: `+${bundle.incrementalTime}`,
      amendedEstimate: bundle.amendedEstimate,
      reason: bundle.payoff,
      tradeoff: bundle.tradeoff,
      guardrail: bundle.guardrail,
      feedbackState: action.feedbackState
    };
  }

  return {
    label: "Prepared change",
    action: action.label,
    summary: action.detail,
    estimateDelta: assignment ? "Uses planned shift capacity" : "No estimate change",
    amendedEstimate: assignment?.wave ?? `${item.estimatedMinutes} min`,
    reason: item.whyThisShift,
    tradeoff: item.knownBlocker ?? "Supervisor can still defer or re-route before committing.",
    guardrail: assignment?.uncertainty ?? "Confirm local floor context before final dispatch.",
    feedbackState: action.feedbackState
  };
}

function readableParts(requiredParts) {
  if (!requiredParts) return "None listed";
  return requiredParts
    .split(",")
    .map((part) =>
      part
        .replace("part_", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    )
    .join(", ");
}

function getInsightIds(item) {
  const ids = [];
  if (["focus_1", "focus_8", "focus_11"].includes(item.id)) ids.push("insight_demand_surge");
  if (["focus_2", "focus_6"].includes(item.id)) ids.push("insight_parts_unblock");
  if (["focus_5", "focus_8"].includes(item.id)) ids.push("insight_bundle_window");
  if (["focus_3", "focus_4", "focus_9", "focus_10", "focus_12"].includes(item.id)) ids.push("insight_safety_asset_risk");
  if (["focus_7"].includes(item.id)) ids.push("insight_vendor_path");
  return ids;
}

function buildPredictiveInsights(items) {
  const seeds = [
    {
      id: "insight_demand_surge",
      rank: 1,
      title: "Premium SUVs below rent-ready target",
      signalType: "Demand risk",
      method: "Predictive",
      sourceSummary: "Reservation demand, class targets, rent-ready count, open WOs",
      what: "Premium SUV demand is ahead of the current rent-ready count. Three WOs can return vehicles to service this shift.",
      impact: "Protect utilization and reduce the chance of a class shortage at the counter.",
      ask: "Approve the SUV brake WO, close the completed TPMS WO, and keep the oil service as fill-in work.",
      recommendation: "Approve the SUV brake WO, close the completed TPMS WO, and keep the oil service as fill-in work.",
      primaryAction: "Approve return-to-service work",
      tone: "green"
    },
    {
      id: "insight_parts_unblock",
      rank: 2,
      title: "Parts must be confirmed before assigning labor",
      signalType: "Parts gate",
      method: "Rule",
      sourceSummary: "Inventory, purchase orders, WO blockers, tech availability",
      what: "Two blocked WOs need parts confirmation before a technician can start.",
      impact: "Avoid assigning labor to work that will stall in the bay or parts room.",
      ask: "Confirm brake pads on PO-4756 and EV-CBL stock before assigning techs.",
      recommendation: "Confirm brake pads on PO-4756 and EV-CBL stock before assigning techs.",
      primaryAction: "Confirm parts before assigning",
      tone: "red"
    },
    {
      id: "insight_bundle_window",
      rank: 3,
      title: "Bundle PM work while vehicles are already in service",
      signalType: "Bundle window",
      method: "Predictive",
      sourceSummary: "PM schedule, current WO status, bay/tech context, repeat downtime risk",
      what: "Two active WOs overlap with PM work due soon.",
      impact: "Reduce repeat downtime and avoid another shop visit later this week.",
      ask: "Add PM A to the tire WO and add brake inspection to the oil service WO.",
      recommendation: "Add PM A to the tire WO and add brake inspection to the oil service WO.",
      primaryAction: "Add bundled tasks",
      tone: "violet"
    },
    {
      id: "insight_safety_asset_risk",
      rank: 4,
      title: "Vehicle holds need release decisions",
      signalType: "Hold review",
      method: "Agent prepared",
      sourceSummary: "Faults, DVIRs, recall/warranty path, damage notes, asset history",
      what: "Five WOs have hold reasons: fault code, DVIR/photo gap, warranty path, cosmetic deferral, or lot access.",
      impact: "Keep unsafe vehicles out of service and protect bay capacity for higher-value work.",
      ask: "Release, defer, request photo, route warranty, or ask lot ops to reposition.",
      recommendation: "Release, defer, request photo, route warranty, or ask lot ops to reposition.",
      primaryAction: "Review holds and deferrals",
      tone: "amber"
    },
    {
      id: "insight_vendor_path",
      rank: 5,
      title: "Vendor repair ETA is stale",
      signalType: "Vendor ETA",
      method: "Rule",
      sourceSummary: "Vendor jobs, stale ETA, warranty/dealer routing",
      what: "One vendor repair has an outdated ETA and may require dealer or warranty routing.",
      impact: "Avoid planning around a vehicle that will not return to service when expected.",
      ask: "Refresh the ETA, confirm the repair path, and update the WO owner.",
      recommendation: "Refresh the ETA, confirm the repair path, and update the WO owner.",
      primaryAction: "Refresh vendor ETA",
      tone: "blue"
    }
  ];

  return seeds.map((seed) => {
    const impacted = items.filter((item) => item.insightIds.includes(seed.id));
    const oneClick = impacted.filter((item) =>
      ["Assign tech", "Buy / confirm part", "Bundle work", "Close WO"].includes(item.nextAction)
    ).length;
    return {
      ...seed,
      impactedCount: impacted.length,
      draftCount: impacted.filter((item) => item.packetType === "Draft WO").length,
      blockedCount: impacted.filter((item) => item.readinessState === "blocked").length,
      oneClickCount: oneClick,
      topWorkOrderNumbers: impacted.slice(0, 3).map((item) => item.workOrderNumber),
      workOrderIds: impacted.map((item) => item.id),
      focusItemIds: impacted.map((item) => item.focusItemId)
    };
  });
}

function getWorkOrderNumber(item) {
  if (item.deepLinkLabel?.startsWith("WO-")) return item.deepLinkLabel;
  if (["fault", "dvir", "asset"].includes(item.deepLinkType)) return "Draft WO";
  return item.deepLinkLabel;
}

function getPacketType(item) {
  if (["fault", "dvir", "asset"].includes(item.deepLinkType)) return "Draft WO";
  if (["vendor", "warranty"].includes(item.deepLinkType)) return "External WO";
  return "Existing WO";
}

function getWorkOrderAction(item, assignment, bundle) {
  if (bundle) {
    return {
      label: "Bundle work",
      detail: bundle.action,
      feedbackState: "planned_this_shift",
      tone: "violet"
    };
  }

  if (item.readinessState === "blocked") {
    const label = item.deepLinkType === "inventory" ? "Buy / confirm part" : "Clear blocker";
    return {
      label,
      detail: item.suggestedNextStep,
      feedbackState: "blocked",
      tone: "red"
    };
  }

  if (item.readinessState === "vendor") {
    return {
      label: item.deepLinkType === "warranty" ? "Send to dealer" : "Call vendor",
      detail: item.suggestedNextStep,
      feedbackState: "sent_to_vendor",
      tone: "blue"
    };
  }

  if (item.readinessState === "needs_review") {
    return {
      label: item.deepLinkType === "dvir" ? "Request photo" : "Review diagnostic",
      detail: item.suggestedNextStep,
      feedbackState: "planned_this_shift",
      tone: "amber"
    };
  }

  if (item.readinessState === "defer") {
    return {
      label: "Defer",
      detail: item.suggestedNextStep,
      feedbackState: "deferred",
      tone: "gray"
    };
  }

  if (assignment?.status === "Quick win") {
    return {
      label: "Close WO",
      detail: assignment.handoff,
      feedbackState: "already_handled",
      tone: "green"
    };
  }

  return {
    label: "Assign tech",
    detail: assignment?.handoff ?? item.suggestedNextStep,
    feedbackState: "planned_this_shift",
    tone: "green"
  };
}

function buildDecisionClusters(focusItems, brief) {
  const itemMap = new Map(focusItems.map((item) => [item.id, item]));
  const clusterSeeds = [
    {
      id: "cluster_suv_shortage",
      altitude: "Class demand",
      title: "SUV shortage before midday peak",
      count: 5,
      unit: "SUV candidates",
      urgency: "High",
      summary: "SUV and Premium SUV ready counts are below target before the next demand peak.",
      constraint: "45 ready / 71 target across SUV classes",
      recommendedAction: "Pull forward ready SUV jobs and defer lower-value cosmetic work.",
      handoffAction: "Assign two ready SUV jobs to first-wave techs",
      itemIds: ["focus_1", "focus_11"]
    },
    {
      id: "cluster_parts_blockers",
      altitude: "Parts constraint",
      title: "Parts blockers before assignment",
      count: 14,
      unit: "work orders",
      urgency: "High",
      summary: "Several jobs look important but will waste technician starts until parts are confirmed.",
      constraint: `${brief.inbound_purchase_orders} open POs; brake pads expected 11:30 AM`,
      recommendedAction: "Hold blocked work, prep inspections, and switch techs to ready jobs.",
      handoffAction: "Stage inspections, assign after PO receipt",
      itemIds: ["focus_2", "focus_6"]
    },
    {
      id: "cluster_vendor_warranty",
      altitude: "External path",
      title: "Vendor and warranty routing",
      count: 6,
      unit: "vehicles",
      urgency: "Medium",
      summary: "Dealer, warranty, and vendor items need routing decisions before local work proceeds.",
      constraint: `${brief.vendor_jobs_count} active vendor jobs; 2 stale/high-friction cases surfaced`,
      recommendedAction: "Resolve dealer path and stale ETAs before approving more local repair.",
      handoffAction: "Call vendor/dealer before assigning local work",
      itemIds: ["focus_4", "focus_7"]
    },
    {
      id: "cluster_pm_bundle",
      altitude: "Shop flow",
      title: "Bundle work already in flow",
      count: 9,
      unit: "bundle candidates",
      urgency: "Medium",
      summary: "Some PMs can be added to vehicles already in the bay or QTA lane.",
      constraint: "285 PMs due in 7 days; 9 candidates overlap with current work",
      recommendedAction: "Bundle only where parts and bay time are already available.",
      handoffAction: "Add bundled tasks to open work orders",
      itemIds: ["focus_5", "focus_8"]
    },
    {
      id: "cluster_review_release",
      altitude: "Release risk",
      title: "Review before ready-line release",
      count: 12,
      unit: "assets",
      urgency: "Medium",
      summary: "Some vehicles may be rentable soon, but need human judgment before release.",
      constraint: `${brief.active_faults} fault events and ${brief.dvir_defects} DVIR defects in last 24h`,
      recommendedAction: "Use diagnostics, closeout checks, or photo review before moving to rentable.",
      handoffAction: "Confirm closeout before ready-line release",
      itemIds: ["focus_3", "focus_10", "focus_11"]
    }
  ];

  return clusterSeeds.map((cluster) => {
    const visibleItems = cluster.itemIds.map((id) => itemMap.get(id)).filter(Boolean);
    const readyCount = visibleItems.filter((item) => item.readinessState === "ready").length;
    const blockedCount = visibleItems.filter((item) => item.readinessState === "blocked").length;
    const topImpact = visibleItems.reduce((max, item) => Math.max(max, item.impactScore), 0);
    return {
      ...cluster,
      visibleItemCount: visibleItems.length,
      readyCount,
      blockedCount,
      topImpact
    };
  });
}

function buildShiftPlan(database, brief, focusItems) {
  const technicians = database
    .prepare("SELECT * FROM technicians WHERE shift_id = ? ORDER BY id ASC")
    .all(brief.shift_id);
  const bayRows = database
    .prepare("SELECT status, COUNT(*) AS count FROM bays GROUP BY status")
    .all();
  const bayCounts = Object.fromEntries(bayRows.map((row) => [row.status, row.count]));
  const focusById = new Map(focusItems.map((item) => [item.id, item]));
  const availableTechs = technicians.filter((tech) => tech.active_jobs < 2);

  const assignments = [
    {
      id: "plan_1",
      focusItemId: "focus_1",
      wave: "6:15-7:10",
      workType: "Brake job",
      techs: ["Tech 7", "Tech 19"],
      status: "Ready to assign",
      handoff: "Create assignment, attach staged brake pads, confirm bay on floor.",
      uncertainty: "Bay availability not live-connected"
    },
    {
      id: "plan_2",
      focusItemId: "focus_11",
      wave: "6:20-6:35",
      workType: "Closeout",
      techs: ["Tech 14"],
      status: "Quick win",
      handoff: "Verify TPMS closeout and move asset to rentable if ops agrees.",
      uncertainty: "No bay needed"
    },
    {
      id: "plan_3",
      focusItemId: "focus_5",
      wave: "7:10-8:25",
      workType: "Tire + PM bundle",
      techs: ["Tech 5", "Tech 17"],
      status: "Bundle candidate",
      handoff: "Add PM A to current tire work order before the tech starts.",
      uncertainty: "Bay likely occupied; live bay feed unavailable"
    },
    {
      id: "plan_4",
      focusItemId: "focus_8",
      wave: "8:25-9:05",
      workType: "Oil/filter + inspection",
      techs: ["Tech 22"],
      status: "Filler work",
      handoff: "Use as fill-in work if first-wave SUV jobs finish early.",
      uncertainty: "QTA availability supervisor-confirmed"
    }
  ].map((assignment) => {
    const item = focusById.get(assignment.focusItemId);
    return {
      ...assignment,
      title: item?.title,
      fleetId: item?.fleetId,
      vehicleClassName: item?.vehicleClassName,
      workOrderId: item?.workOrderId,
      estimatedMinutes: item?.estimatedMinutes
    };
  });

  const bundleOpportunities = [
    {
      id: "bundle_1",
      focusItemId: "focus_5",
      title: "Add PM A while tires are already in progress",
      assetLabel: focusById.get("focus_5")?.fleetId,
      currentWork: "Tire replacement",
      addOnWork: "PM A due in 420 miles",
      incrementalTime: "20 min",
      currentEstimate: "75 min",
      amendedEstimate: "95 min",
      payoff: "Avoids a second shop visit this week",
      action: "Add PM A to WO-9203",
      tradeoff: "Uses 20 more bay minutes and performs PM slightly early.",
      guardrail: "Approve only if the asset can still return before the SUV/standard ready-line need."
    },
    {
      id: "bundle_2",
      focusItemId: "focus_8",
      title: "Inspect brakes during oil/filter service",
      assetLabel: focusById.get("focus_8")?.fleetId,
      currentWork: "Oil/filter service",
      addOnWork: "Brake service forecast within 3 days",
      incrementalTime: "15 min",
      currentEstimate: "35 min",
      amendedEstimate: "50 min",
      payoff: "Prevents repeat downtime if pads are actually needed",
      action: "Add brake inspection to WO-9707",
      tradeoff: "Adds inspection time now, but does not consume pads unless measurements fail threshold.",
      guardrail: "Do not replace pads unless measured wear is below policy threshold."
    }
  ];

  return {
    systemOfRecord: "Connected Maintenance Work Orders > Today's Plan",
    writebackTarget: "Work order assignment, bundled task, and technician handoff notes",
    capacity: {
      scheduledTechs: technicians.length,
      availableStarts: availableTechs.length,
      activeJobs: technicians.reduce((sum, tech) => sum + tech.active_jobs, 0),
      knownSkills: ["brakes", "quick-turn", "diagnostics", "tires", "EV"]
    },
    bayAvailability: {
      sourceStatus: "Partial",
      knownOpen: bayCounts.open ?? 0,
      knownOccupied: bayCounts.occupied ?? 0,
      knownBlocked: bayCounts.blocked ?? 0,
      gap: "Live bay occupancy is not connected; supervisor should confirm before dispatch."
    },
    assignments,
    bundleOpportunities
  };
}

function hydrateFocusItem(database, item) {
  const signals = database
    .prepare("SELECT * FROM brief_item_signals WHERE focus_item_id = ? ORDER BY id ASC")
    .all(item.id);
  const feedback = database
    .prepare("SELECT * FROM supervisor_feedback WHERE focus_item_id = ? ORDER BY created_at DESC")
    .all(item.id);
  const captures = database
    .prepare("SELECT * FROM local_context_captures WHERE focus_item_id = ? ORDER BY created_at DESC")
    .all(item.id);

  return {
    ...formatFocusItem(item),
    workOrder: {
      id: item.work_order_id,
      status: item.work_order_status,
      sourceType: item.source_type,
      severity: item.severity,
      estimatedMinutes: item.estimated_minutes
    },
    asset: {
      id: item.asset_id,
      fleetId: item.fleet_id,
      vin: item.vin,
      make: item.make,
      model: item.model,
      year: item.year,
      odometer: item.odometer,
      currentLocation: item.current_location,
      currentStatus: item.current_status,
      daysUnavailable: item.days_unavailable,
      vehicleClassName: item.vehicle_class_name,
      segment: item.segment,
      demandPressure: item.demand_pressure,
      readyNow: item.ready_now,
      targetReady: item.target_ready,
      nextPeak: item.next_peak
    },
    signals,
    feedback,
    captures
  };
}

function formatFocusItem(item) {
  return {
    id: item.id,
    rank: item.rank,
    title: item.title,
    readinessState: item.readiness_state,
    readinessLabel: readinessLabels[item.readiness_state] ?? item.readiness_state,
    impactScore: item.impact_score,
    confidence: item.confidence,
    whyThisShift: item.why_this_shift,
    knownBlocker: item.known_blocker,
    suggestedNextStep: item.suggested_next_step,
    deepLinkType: item.deep_link_type,
    deepLinkLabel: item.deep_link_label,
    feedbackState: item.feedback_state,
    assetId: item.asset_id,
    workOrderId: item.work_order_id,
    fleetId: item.fleet_id,
    vehicle: `${item.year} ${item.make} ${item.model}`,
    vehicleClassName: item.vehicle_class_name,
    currentStatus: item.current_status,
    currentLocation: item.current_location,
    daysUnavailable: item.days_unavailable,
    demandPressure: item.demand_pressure,
    readyNow: item.ready_now,
    targetReady: item.target_ready,
    estimatedMinutes: item.estimated_minutes,
    sourceType: item.source_type,
    severity: item.severity,
    requiredParts: item.required_part_ids,
    workOrderStatus: item.work_order_status
  };
}
