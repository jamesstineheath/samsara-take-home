"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarClock,
  Camera,
  Check,
  ChevronRight,
  ClipboardList,
  Clock3,
  Gauge,
  History,
  Info,
  ListFilter,
  MapPin,
  Mic,
  PackageCheck,
  ShieldCheck,
  Target,
  Truck,
  Wrench,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const feedbackOptions = [
  { id: "planned_this_shift", label: "Plan", icon: Check },
  { id: "deferred", label: "Defer", icon: Clock3 },
  { id: "blocked", label: "Block", icon: AlertTriangle },
  { id: "sent_to_vendor", label: "Vendor", icon: Truck },
  { id: "already_handled", label: "Done", icon: PackageCheck },
  { id: "not_relevant", label: "Skip", icon: ListFilter }
];

const statusCopy = {
  ready: { label: "Ready", tone: "green" },
  blocked: { label: "Blocked", tone: "red" },
  needs_review: { label: "Needs review", tone: "amber" },
  vendor: { label: "Vendor", tone: "blue" },
  defer: { label: "Defer", tone: "gray" },
  bundle_candidate: { label: "Bundle", tone: "violet" }
};

export default function ShiftBriefApp() {
  const [brief, setBrief] = useState(null);
  const [workOrdersIndex, setWorkOrdersIndex] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedClusterId, setSelectedClusterId] = useState(null);
  const [variant, setVariant] = useState("queue");
  const [activeView, setActiveView] = useState("work_orders");
  const [loading, setLoading] = useState(true);
  const [contextText, setContextText] = useState("");
  const [openPacketId, setOpenPacketId] = useState(null);
  const [selectedInsightId, setSelectedInsightId] = useState(null);
  const [activeWorkOrderStatus, setActiveWorkOrderStatus] = useState("all");
  const [workOrderSourceFilter, setWorkOrderSourceFilter] = useState("all");
  const [workOrderSeverityFilter, setWorkOrderSeverityFilter] = useState("all");
  const [workOrderClassFilter, setWorkOrderClassFilter] = useState("all");
  const [workOrderSort, setWorkOrderSort] = useState("newest");

  useEffect(() => {
    async function loadBrief() {
      setLoading(true);
      const [briefResponse, workOrdersResponse] = await Promise.all([
        fetch("/api/shift-brief/current", { cache: "no-store" }),
        fetch("/api/work-orders", { cache: "no-store" })
      ]);
      const data = await briefResponse.json();
      const workOrdersData = await workOrdersResponse.json();
      setBrief(data);
      setWorkOrdersIndex(workOrdersData);
      const firstCluster = data.decisionClusters?.[0];
      setSelectedClusterId(firstCluster?.id ?? "all");
      setSelectedInsightId(null);
      setSelectedId(data.workOrderQueue?.items?.[0]?.focusItemId ?? data.focusItems?.[0]?.id ?? null);
      setLoading(false);
    }

    loadBrief();
  }, []);

  useEffect(() => {
    async function loadItem() {
      if (!selectedId) return;
      const response = await fetch(`/api/focus-items/${selectedId}`, { cache: "no-store" });
      setSelectedItem(await response.json());
      setContextText("");
    }

    loadItem();
  }, [selectedId]);

  async function sendFeedback(itemId, feedbackState) {
    const response = await fetch(`/api/focus-items/${itemId}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedbackState })
    });
    const updated = await response.json();
    setSelectedItem(updated.focusItem);
    setBrief((current) => {
      if (!current) return current;
      return {
        ...current,
        summary: updated.summary,
        actionSummary: updated.actionSummary,
        focusItems: current.focusItems.map((item) =>
          item.id === itemId ? { ...item, feedbackState } : item
        ),
        workOrderQueue: current.workOrderQueue
          ? {
              ...current.workOrderQueue,
              items: current.workOrderQueue.items.map((item) =>
                item.focusItemId === itemId ? { ...item, feedbackState } : item
              )
            }
          : current.workOrderQueue
      };
    });
  }

  async function addLocalContext(type) {
    if (!selectedItem) return;
    const text =
      contextText.trim() ||
      (type === "voice"
        ? "Voice note placeholder: supervisor captured floor context."
        : "Photo placeholder: supervisor captured whiteboard or vehicle context.");
    const response = await fetch(`/api/focus-items/${selectedItem.id}/local-context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ captureType: type, text })
    });
    setSelectedItem(await response.json());
    setContextText("");
  }

  const filteredGroups = useMemo(() => {
    if (!brief) return {};
    const items = getVisibleFocusItems(brief, selectedClusterId);
    return {
      ready: items.filter((item) => item.readinessState === "ready"),
      blocked: items.filter((item) => item.readinessState === "blocked"),
      review: items.filter((item) => item.readinessState === "needs_review"),
      other: items.filter(
        (item) => !["ready", "blocked", "needs_review"].includes(item.readinessState)
      )
    };
  }, [brief, selectedClusterId]);

  const visibleFocusItems = useMemo(() => {
    if (!brief) return [];
    return getVisibleFocusItems(brief, selectedClusterId);
  }, [brief, selectedClusterId]);

  const selectedCluster = useMemo(() => {
    if (!brief) return null;
    return brief.decisionClusters.find((cluster) => cluster.id === selectedClusterId) ?? null;
  }, [brief, selectedClusterId]);

  function chooseCluster(clusterId) {
    setSelectedClusterId(clusterId);
    const items = getVisibleFocusItems(brief, clusterId);
    setSelectedId(items[0]?.id ?? brief.focusItems?.[0]?.id ?? null);
  }

  function openPreparedPlan() {
    setActiveView("prepared_plan");
    setSelectedInsightId(null);
    setOpenPacketId(null);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function openWorkOrders() {
    setActiveView("work_orders");
    setSelectedInsightId(null);
    setOpenPacketId(null);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  if (loading || !brief || !workOrdersIndex) {
    return (
      <main className="loading-screen">
        <div className="loading-card">
          <Gauge size={24} />
          <p>Preparing shift brief...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <TopBar brief={brief} />
        {activeView === "work_orders" && (
          <WorkOrdersHome
            workOrders={workOrdersIndex}
            activeStatus={activeWorkOrderStatus}
            setActiveStatus={setActiveWorkOrderStatus}
            sourceFilter={workOrderSourceFilter}
            setSourceFilter={setWorkOrderSourceFilter}
            severityFilter={workOrderSeverityFilter}
            setSeverityFilter={setWorkOrderSeverityFilter}
            classFilter={workOrderClassFilter}
            setClassFilter={setWorkOrderClassFilter}
            sort={workOrderSort}
            setSort={setWorkOrderSort}
            onReviewPlan={openPreparedPlan}
          />
        )}
        {variant === "operational" && (
          <OperationalBrief
            brief={brief}
            selectedCluster={selectedCluster}
            selectedClusterId={selectedClusterId}
            chooseCluster={chooseCluster}
            visibleFocusItems={visibleFocusItems}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedItem={selectedItem}
            sendFeedback={sendFeedback}
            contextText={contextText}
            setContextText={setContextText}
            addLocalContext={addLocalContext}
          />
        )}
        {activeView !== "work_orders" && variant === "queue" && (
          <QueueDetailVariant
            brief={brief}
            selectedCluster={selectedCluster}
            selectedClusterId={selectedClusterId}
            chooseCluster={chooseCluster}
            visibleFocusItems={visibleFocusItems}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedItem={selectedItem}
            sendFeedback={sendFeedback}
            contextText={contextText}
            setContextText={setContextText}
            addLocalContext={addLocalContext}
            openPacketId={openPacketId}
            setOpenPacketId={setOpenPacketId}
            selectedInsightId={selectedInsightId}
            setSelectedInsightId={setSelectedInsightId}
            onBackToWorkOrders={openWorkOrders}
          />
        )}
        {variant === "handoff" && (
          <HandoffVariant
            brief={brief}
            grouped={filteredGroups}
            selectedCluster={selectedCluster}
            selectedClusterId={selectedClusterId}
            chooseCluster={chooseCluster}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedItem={selectedItem}
            sendFeedback={sendFeedback}
            contextText={contextText}
            setContextText={setContextText}
            addLocalContext={addLocalContext}
          />
        )}
      </main>
    </div>
  );
}

function Sidebar() {
  const nav = [
    ["Overview", Gauge],
    ["Assets", Truck],
    ["Faults", AlertTriangle],
    ["DVIRs", ClipboardList],
    ["Schedules", CalendarClock],
    ["Work Orders", Wrench],
    ["Inventory", Boxes],
    ["Warranty", ShieldCheck],
    ["Vendors", PackageCheck]
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">S</div>
        <span>samsara</span>
      </div>
      <nav className="nav-list">
        {nav.map(([label, Icon]) => (
          <button
            className={label === "Work Orders" ? "nav-item nav-active" : "nav-item"}
            key={label}
            title={label}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Connected Maintenance</p>
        <strong>Hertz LAX</strong>
      </div>
    </aside>
  );
}

function TopBar({ brief }) {
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">Connected Maintenance</div>
        <h1>Work Orders</h1>
      </div>
      <div className="topbar-actions">
        <span className="shift-context">
          {brief.site.name} · {brief.shift.label} · {brief.shift.supervisorName}
        </span>
      </div>
    </header>
  );
}

function WorkOrdersHome({
  workOrders,
  activeStatus,
  setActiveStatus,
  sourceFilter,
  setSourceFilter,
  severityFilter,
  setSeverityFilter,
  classFilter,
  setClassFilter,
  sort,
  setSort,
  onReviewPlan
}) {
  const statusTabs = [
    { id: "all", label: "All", count: workOrders.summary.total },
    { id: "open", label: "Open", count: workOrders.summary.open },
    { id: "in_progress", label: "In progress", count: workOrders.summary.inProgress },
    { id: "blocked", label: "Blocked", count: workOrders.summary.blocked },
    { id: "vendor", label: "Vendor", count: workOrders.summary.vendor }
  ];

  const visibleItems = useMemo(() => {
    const severityRank = { high: 3, medium: 2, low: 1 };
    return workOrders.items
      .filter((item) => activeStatus === "all" || item.status === activeStatus)
      .filter((item) => sourceFilter === "all" || item.sourceType === sourceFilter)
      .filter((item) => severityFilter === "all" || item.severity === severityFilter)
      .filter((item) => classFilter === "all" || item.asset.vehicleClassName === classFilter)
      .sort((a, b) => {
        if (sort === "severity") {
          return (severityRank[b.severity] ?? 0) - (severityRank[a.severity] ?? 0);
        }
        if (sort === "estimate") return b.estimatedMinutes - a.estimatedMinutes;
        return new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime();
      });
  }, [activeStatus, classFilter, severityFilter, sort, sourceFilter, workOrders.items]);

  return (
    <section className="workspace work-orders-home">
      <div className="work-orders-shell">
        <div className="wo-index-summary">
          <WorkOrdersSummaryTile label="Total WOs" value={workOrders.summary.total} tone="blue" />
          <WorkOrdersSummaryTile label="Open" value={workOrders.summary.open} tone="green" />
          <WorkOrdersSummaryTile label="Blocked" value={workOrders.summary.blocked} tone="red" />
          <WorkOrdersSummaryTile label="In progress" value={workOrders.summary.inProgress} tone="amber" />
          <WorkOrdersSummaryTile label="Vendor" value={workOrders.summary.vendor} tone="violet" />
        </div>

        <section className="panel prepared-plan-entry">
          <div className="prepared-plan-entry-copy">
            <span>Prepared plan</span>
            <h2>Prepared Asset Plan</h2>
            <p>{workOrders.preparedPlan.vehicleRecommendations} vehicle recommendations prepared for day shift.</p>
          </div>
          <div className="prepared-plan-entry-metrics">
            <div>
              <strong>{workOrders.preparedPlan.needLocalCheck}</strong>
              <span>Need local check</span>
            </div>
            <div>
              <strong>{workOrders.preparedPlan.readyToCommit}</strong>
              <span>Ready to commit</span>
            </div>
            <div>
              <strong>{workOrders.preparedPlan.workOrdersAffected}</strong>
              <span>WOs affected</span>
            </div>
          </div>
          <button className="review-plan-button" onClick={onReviewPlan}>
            Review plan
            <ChevronRight size={16} />
          </button>
        </section>

        <section className="panel work-orders-index-panel">
          <div className="wo-index-toolbar">
            <div>
              <span>Work Orders</span>
              <h2>All work orders</h2>
            </div>
            <WorkOrderFilterBar
              filters={workOrders.filters}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
              severityFilter={severityFilter}
              setSeverityFilter={setSeverityFilter}
              classFilter={classFilter}
              setClassFilter={setClassFilter}
              sort={sort}
              setSort={setSort}
            />
          </div>
          <WorkOrderStatusTabs
            tabs={statusTabs}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
          />
          <WorkOrdersTable items={visibleItems} />
        </section>
      </div>
    </section>
  );
}

function WorkOrdersSummaryTile({ label, value, tone }) {
  return (
    <div className={`wo-index-tile ${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function WorkOrderStatusTabs({ tabs, activeStatus, setActiveStatus }) {
  return (
    <div className="wo-status-tabs" aria-label="Work order status">
      {tabs.map((tab) => (
        <button
          className={activeStatus === tab.id ? "active" : ""}
          key={tab.id}
          onClick={() => setActiveStatus(tab.id)}
        >
          <span>{tab.label}</span>
          <strong>{tab.count}</strong>
        </button>
      ))}
    </div>
  );
}

function WorkOrderFilterBar({
  filters,
  sourceFilter,
  setSourceFilter,
  severityFilter,
  setSeverityFilter,
  classFilter,
  setClassFilter,
  sort,
  setSort
}) {
  return (
    <div className="wo-filter-bar">
      <label>
        Source
        <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
          <option value="all">All sources</option>
          {filters.sources.map((source) => (
            <option value={source.id} key={source.id}>
              {source.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Severity
        <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}>
          <option value="all">All severities</option>
          {filters.severities.map((severity) => (
            <option value={severity.id} key={severity.id}>
              {severity.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Class
        <select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
          <option value="all">All classes</option>
          {filters.classes.map((vehicleClass) => (
            <option value={vehicleClass.id} key={vehicleClass.id}>
              {vehicleClass.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          {filters.sortOptions.map((option) => (
            <option value={option.id} key={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function WorkOrdersTable({ items }) {
  return (
    <div className="wo-index-table" role="table" aria-label="Work orders">
      <div className="wo-index-table-head" role="row">
        <span>WO</span>
        <span>Vehicle</span>
        <span>Status</span>
        <span>Source</span>
        <span>Severity</span>
        <span>Estimate</span>
      </div>
      <div className="wo-index-table-body">
        {items.map((item) => (
          <WorkOrdersTableRow item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

function WorkOrdersTableRow({ item }) {
  return (
    <article className={item.preparedPlan ? "wo-index-row has-plan" : "wo-index-row"}>
      <div className="wo-index-main-cell">
        <div className="wo-index-title-row">
          <strong>{item.number}</strong>
          {item.preparedPlan && <span className="prepared-plan-badge">Prepared plan</span>}
        </div>
        <h3>{item.title}</h3>
        {item.preparedPlan && (
          <p>
            Prepared plan #{item.preparedPlan.rank} · {item.preparedPlan.actionLabel}
          </p>
        )}
      </div>
      <div className="wo-index-vehicle-cell">
        <strong>{item.asset.vehicle}</strong>
        <span>{item.asset.fleetId} · {item.asset.vehicleClassName}</span>
      </div>
      <span className={`status-pill ${getWorkOrderStatusTone(item.status)}`}>{item.statusLabel}</span>
      <span className="wo-index-muted">{item.sourceLabel}</span>
      <span className={`severity-chip ${item.severity}`}>{item.severityLabel}</span>
      <div className="wo-index-estimate">
        <strong>{item.estimateLabel}</strong>
        <span>{item.openedLabel}</span>
      </div>
    </article>
  );
}

function getWorkOrderStatusTone(status) {
  const tones = {
    open: "green",
    blocked: "red",
    in_progress: "amber",
    vendor: "violet"
  };
  return tones[status] ?? "gray";
}

function OperationalBrief(props) {
  const {
    brief,
    selectedCluster,
    selectedClusterId,
    chooseCluster,
    visibleFocusItems,
    selectedId,
    setSelectedId,
    selectedItem,
    sendFeedback,
    contextText,
    setContextText,
    addLocalContext
  } = props;
  return (
    <section className="workspace operational-grid">
      <div className="left-flow">
        <SummaryStrip brief={brief} />
        <ScaleBanner brief={brief} />
        <DecisionClusterStrip
          clusters={brief.decisionClusters}
          selectedClusterId={selectedClusterId}
          chooseCluster={chooseCluster}
        />
        <section className="panel">
          <PanelHeader
            icon={Bell}
            title="Vehicle candidates"
            subtitle={`${visibleFocusItems.length} surfaced from ${selectedCluster?.title ?? "all clusters"}`}
          />
          <div className="focus-table">
            {visibleFocusItems.map((item) => (
              <FocusTableRow
                key={item.id}
                item={item}
                selected={selectedId === item.id}
                onClick={() => setSelectedId(item.id)}
              />
            ))}
          </div>
        </section>
      </div>
      <DetailPanel
        item={selectedItem}
        plan={brief.shiftPlan}
        sendFeedback={sendFeedback}
        contextText={contextText}
        setContextText={setContextText}
        addLocalContext={addLocalContext}
      />
    </section>
  );
}

function QueueDetailVariant(props) {
  const {
    brief,
    selectedId,
    setSelectedId,
    selectedItem,
    sendFeedback,
    contextText,
    setContextText,
    addLocalContext,
    openPacketId,
    setOpenPacketId,
    selectedInsightId,
    setSelectedInsightId,
    onBackToWorkOrders
  } = props;
  const queue = brief.workOrderQueue;
  const decisions = queue.reviewDecisions ?? [];
  const [selectedHorizon, setSelectedHorizon] = useState("all");
  const visibleDecisions =
    selectedHorizon === "all"
      ? decisions
      : decisions.filter((decision) => decision.horizonLabel === selectedHorizon);
  const selectedDecision = selectedInsightId
    ? decisions.find((decision) => decision.id === selectedInsightId) ?? null
    : null;
  const impactedPackets = selectedDecision
    ? queue.items
        .filter((packet) => selectedDecision.focusItemIds.includes(packet.focusItemId))
        .slice(0, queue.visibleLimit)
    : [];
  const openPacket =
    queue.items.find((packet) => packet.focusItemId === openPacketId) ?? null;
  const openItem = openPacket?.focusItemId === selectedItem?.id ? selectedItem : null;

  function openWorkOrder(packet) {
    setSelectedId(packet.focusItemId);
    setOpenPacketId(packet.focusItemId);
  }

  function chooseDecision(decision) {
    setSelectedInsightId(decision.id);
    const firstPacket = queue.items.find((packet) => decision.focusItemIds.includes(packet.focusItemId));
    if (firstPacket) setSelectedId(firstPacket.focusItemId);
    setOpenPacketId(null);
  }

  return (
    <section className="workspace work-order-workspace">
      <div className="wo-brief-shell">
        {openPacket && (
          <WorkOrderPacketDetail
            packet={openPacket}
            item={openItem}
            sendFeedback={sendFeedback}
            contextText={contextText}
            setContextText={setContextText}
            addLocalContext={addLocalContext}
            backLabel="Back to plan decision"
            onClose={() => setOpenPacketId(null)}
          />
        )}

        {!openPacket && (
          <>
            {!selectedDecision && (
              <PreparedShiftPlanHome
                queue={queue}
                decisions={visibleDecisions}
                selectedHorizon={selectedHorizon}
                setSelectedHorizon={setSelectedHorizon}
                onSelectDecision={chooseDecision}
                onBackToWorkOrders={onBackToWorkOrders}
              />
            )}

            {selectedDecision && (
              <PlanReviewDetail
                decision={selectedDecision}
                packets={impactedPackets}
                onBack={() => {
                  setSelectedInsightId(null);
                  setOpenPacketId(null);
                }}
                onOpenWorkOrder={openWorkOrder}
                sendFeedback={sendFeedback}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

function PreparedShiftPlanHome({
  queue,
  decisions,
  selectedHorizon,
  setSelectedHorizon,
  onSelectDecision,
  onBackToWorkOrders
}) {
  const summary = [
    ["Vehicle recs", queue.summary.vehicleRecommendationCount ?? queue.summary.reviewDecisionCount],
    ["Need local check", queue.summary.contextNeeded],
    ["Ready to commit", queue.summary.readyToCommit],
    ["WOs affected", queue.summary.workOrdersTouched]
  ];

  return (
    <section className="panel prepared-plan-home">
      <div className="prepared-plan-header">
        <button className="wo-back-button plan-parent-back" onClick={onBackToWorkOrders}>
          <ChevronRight size={16} />
          Back to Work Orders
        </button>
        <div className="prepared-plan-header-copy">
          <span>Plan review</span>
          <h2>Prepared Asset Plan</h2>
          <p>
            The system has ranked vehicles by uptime impact. Review each asset recommendation, then commit the affected WO changes.
          </p>
        </div>
        <div className="prepared-plan-summary">
          {summary.map(([label, value]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <PlanningHorizonStrip
        horizons={queue.planningHorizons ?? []}
        selectedHorizon={selectedHorizon}
        setSelectedHorizon={setSelectedHorizon}
      />

      <div className="plan-review-list">
        {selectedHorizon !== "all" && (
          <div className="active-horizon-filter">
            <span>Showing {selectedHorizon}</span>
            <button onClick={() => setSelectedHorizon("all")}>Show all</button>
          </div>
        )}
        {decisions.map((decision) => (
          <PlanDecisionRow
            key={decision.id}
            decision={decision}
            onClick={() => onSelectDecision(decision)}
          />
        ))}
      </div>
    </section>
  );
}

function PlanningHorizonStrip({ horizons, selectedHorizon, setSelectedHorizon }) {
  if (!horizons.length) return null;

  return (
    <div className="planning-horizon-strip" aria-label="Planning horizons">
      {horizons.map((horizon) => (
        <button
          className={
            selectedHorizon === horizon.label
              ? "planning-horizon-card active-horizon"
              : "planning-horizon-card"
          }
          key={horizon.label}
          onClick={() =>
            setSelectedHorizon(selectedHorizon === horizon.label ? "all" : horizon.label)
          }
        >
          <div>
            <span>{horizon.window}</span>
            <strong>{horizon.label}</strong>
            <p>{horizon.role}</p>
          </div>
          <div className="horizon-count">
            <strong>{horizon.count}</strong>
            <span>recs</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function PlanDecisionRow({ decision, onClick }) {
  return (
    <button className={`plan-decision-row ${decision.tone}`} onClick={onClick}>
      <div className="decision-rank">#{decision.rank}</div>
      <div className="decision-main">
        <div className="decision-topline">
          <span className={`insight-type ${decision.tone}`}>{decision.stage}</span>
          <small>{decision.sourceLabel}</small>
          <small className="decision-horizon">{decision.horizonLabel}</small>
          {decision.affectedWorkOrderCount > 1 && (
            <small className="decision-wo-chip">{decision.affectedWorkOrderCount} WOs</small>
          )}
        </div>
        <h3>{decision.title}</h3>
        <p>{decision.what}</p>
      </div>
      <div className="decision-operator-call">
        <span>Need you to</span>
        <strong>{decision.supervisorAsk}</strong>
      </div>
      <div className="decision-writeback">
        <span>Proposed update</span>
        <strong>{decision.workOrderWord}</strong>
      </div>
      <ChevronRight size={20} />
    </button>
  );
}

function PlanReviewDetail({ decision, packets, onBack, onOpenWorkOrder, sendFeedback }) {
  const [checkStates, setCheckStates] = useState({});
  const [rejectDraft, setRejectDraft] = useState(null);
  const [openedSurface, setOpenedSurface] = useState(null);

  useEffect(() => {
    setCheckStates({});
    setRejectDraft(null);
    setOpenedSurface(null);
  }, [decision.id]);

  function commitDecision() {
    packets.forEach((packet) => sendFeedback(packet.focusItemId, "planned_this_shift"));
  }

  function confirmCheck(check) {
    setCheckStates((current) => ({
      ...current,
      [check]: { status: "confirmed" }
    }));
  }

  function saveReject() {
    if (!rejectDraft) return;
    setCheckStates((current) => ({
      ...current,
      [rejectDraft.check]: {
        status: "rejected",
        note: rejectDraft.note || "Supervisor rejected this assumption."
      }
    }));
    setRejectDraft(null);
  }

  return (
    <section className="panel plan-review-detail">
      <div className="plan-detail-header">
        <button className="wo-back-button" onClick={onBack}>
          <ChevronRight size={16} />
          Back to plan
        </button>
        <div>
          <span className={`insight-type ${decision.tone}`}>{decision.stage}</span>
          <h2>{decision.title}</h2>
          <p>{decision.supervisorAsk}</p>
        </div>
        <div className="plan-detail-count">
          <strong>{decision.impactedCount}</strong>
          <span>{decision.impactedCount === 1 ? "vehicle" : "vehicles"}</span>
          <small>
            {decision.affectedWorkOrderCount} {decision.affectedWorkOrderCount === 1 ? "WO" : "WOs"}
          </small>
        </div>
      </div>

      <div className={decision.proofRows?.length > 0 ? "plan-detail-body has-proof" : "plan-detail-body"}>
        {decision.proofRows?.length > 0 ? (
          <BundleDecisionStrip decision={decision} commitDecision={commitDecision} />
        ) : (
          <div className="plan-context-grid simplified">
            <section className="plan-explain-card">
              <span>What changed</span>
              <p>{decision.what}</p>
              <strong>{decision.why}</strong>
            </section>
            <section className="plan-explain-card">
              <span>Assumptions to verify</span>
              <ContextCheckList
                checks={decision.contextChecks}
                states={checkStates}
                onConfirm={confirmCheck}
                onReject={(check) => setRejectDraft({ check, note: "" })}
                onOpenSurface={setOpenedSurface}
              />
            </section>
          </div>
        )}

        {decision.proofRows?.length > 0 && <BundleProofPanel decision={decision} />}

        <div className="plan-impacted-section">
          <div className="plan-impacted-heading">
            <div>
              <span>{packets.length === 1 ? "Work order to update" : "Work orders to update"}</span>
              <h3>{packets.length === 1 ? "Apply after the checks pass." : "Review each prepared update after the checks pass."}</h3>
            </div>
            <strong>{decision.workOrderNumbers.join(" · ")}</strong>
          </div>
          <div className="amendment-list">
            {packets.map((packet) => (
              <WorkOrderAmendmentCard
                key={packet.id}
                packet={packet}
                onOpen={() => onOpenWorkOrder(packet)}
                onAction={() => sendFeedback(packet.focusItemId, packet.actionFeedbackState)}
              />
            ))}
          </div>
        </div>
      </div>
      {rejectDraft && (
        <RejectCheckModal
          draft={rejectDraft}
          setDraft={setRejectDraft}
          onCancel={() => setRejectDraft(null)}
          onSave={saveReject}
        />
      )}
      {openedSurface && (
        <CheckSurfaceModal surface={openedSurface} onClose={() => setOpenedSurface(null)} />
      )}
    </section>
  );
}

function ContextCheckList({ checks, states, onConfirm, onReject, onOpenSurface }) {
  return (
    <div className="context-check-list">
      {checks.map((check) => {
        const state = states[check]?.status ?? "needs_check";
        const source = getCheckSource(check);
        return (
          <div className={`context-check ${state}`} key={check}>
            <div className="check-status-icon">
              {state === "confirmed" && <Check size={14} />}
              {state === "rejected" && <AlertTriangle size={14} />}
              {state === "needs_check" && <Clock3 size={14} />}
            </div>
            <div className="check-copy">
              <span>{state === "needs_check" ? "Needs check" : state}</span>
              <p>{check}</p>
              {states[check]?.note && <small>{states[check].note}</small>}
            </div>
            <div className="check-actions">
              {source && (
                <button
                  className="source-check-link"
                  onClick={() => onOpenSurface(source)}
                  title={`Open ${source.title}`}
                >
                  <ArrowUpRight size={13} />
                  {source.label}
                </button>
              )}
              <button className="confirm-check" onClick={() => onConfirm(check)}>
                Confirm
              </button>
              <button className="reject-check" onClick={() => onReject(check)}>
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getCheckSource(check) {
  const normalized = check.toLowerCase();

  if (isLocalOnlyCheck(normalized)) return null;

  if (normalized.includes("part") || normalized.includes("po") || normalized.includes("stock")) {
    return {
      label: "Parts",
      title: "Parts",
      check,
      rows: ["Parts or PO record is available", "Inventory confidence may still need floor confirmation", "Rejected checks update the plan"]
    };
  }

  if (normalized.includes("cable") || normalized.includes("replacement source")) {
    return {
      label: "Parts",
      title: "Parts",
      check,
      rows: ["Part master or stock record is available", "Inventory confidence may still need floor confirmation", "Rejected checks update the plan"]
    };
  }

  if (normalized.includes("tech") || normalized.includes("shift")) {
    return {
      label: "Schedule",
      title: "Technician schedule",
      check,
      rows: ["Shift schedule is available", "Skill match is available", "Active job count still needs supervisor judgment"]
    };
  }

  if (normalized.includes("dvir") || normalized.includes("tpms")) {
    return {
      label: "DVIR",
      title: "DVIR",
      check,
      rows: ["DVIR record is available", "Closeout status may need technician confirmation", "Rejected checks update the plan"]
    };
  }

  if (normalized.includes("fault") || normalized.includes("diagnostic")) {
    return {
      label: "Faults",
      title: "Faults",
      check,
      rows: ["Fault history is available", "Repeat signal is visible", "Release criteria still need supervisor review"]
    };
  }

  if (normalized.includes("warranty") || normalized.includes("coverage")) {
    return {
      label: "Warranty",
      title: "Warranty",
      check,
      rows: ["Warranty record is available", "Coverage path may need attachment review", "Rejected checks update the plan"]
    };
  }

  if (normalized.includes("vendor") || normalized.includes("dealer") || normalized.includes("eta")) {
    return {
      label: "Vendor",
      title: "Vendor",
      check,
      rows: ["Vendor record is available", "ETA freshness is visible", "Call or reroute before committing if stale"]
    };
  }

  if (normalized.includes("photo") || normalized.includes("evidence")) {
    return {
      label: "Evidence",
      title: "Evidence",
      check,
      rows: ["Photo or attachment record is available", "Severity may still need supervisor review", "Rejected checks update the plan"]
    };
  }

  if (normalized.includes("pm due")) {
    return {
      label: "PM",
      title: "PM schedule",
      check,
      rows: ["Preventive maintenance schedule is available", "Due window is visible", "Rejected checks update the plan"]
    };
  }

  return null;
}

function isLocalOnlyCheck(normalized) {
  return [
    "bay",
    "lot",
    "accessible",
    "acknowledged",
    "runner",
    "ops agrees",
    "does not delay",
    "no ready-line",
    "safety unaffected",
    "release criterion",
    "wo created only if needed",
    "no tech start",
    "compact surplus",
    "severity confirmed"
  ].some((pattern) => normalized.includes(pattern));
}

function RejectCheckModal({ draft, setDraft, onCancel, onSave }) {
  return (
    <div className="modal-backdrop">
      <section className="assumption-modal">
        <div className="modal-head">
          <div>
            <span>Reject assumption</span>
            <h3>{draft.check}</h3>
          </div>
          <button onClick={onCancel} aria-label="Close reject assumption">
            <X size={18} />
          </button>
        </div>
        <label>
          What changed on the floor?
          <textarea
            value={draft.note}
            onChange={(event) => setDraft({ ...draft, note: event.target.value })}
            placeholder="Example: Bay 04 is still occupied by HZ-LAX-00182 until 6:45."
          />
        </label>
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="reject-save" onClick={onSave}>
            Save and update plan
          </button>
        </div>
      </section>
    </div>
  );
}

function CheckSurfaceModal({ surface, onClose }) {
  return (
    <div className="modal-backdrop">
      <section className="assumption-modal source-modal">
        <div className="modal-head">
          <div>
            <span>Source detail</span>
            <h3>{surface.title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close source detail">
            <X size={18} />
          </button>
        </div>
        <p className="source-check">{surface.check}</p>
        <div className="source-rows">
          {surface.rows.map((row) => (
            <div key={row}>
              <Check size={14} />
              <span>{row}</span>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="reject-save" onClick={onClose}>
            Back to review
          </button>
        </div>
      </section>
    </div>
  );
}

function BundleDecisionStrip({ decision, commitDecision }) {
  return (
    <section className="bundle-decision-strip">
      <div>
        <span>Verify before action</span>
        <strong>{decision.contextChecks.join(" · ")}</strong>
      </div>
      <div>
        <span>WO update</span>
        <strong>{decision.preparedWriteback}</strong>
      </div>
    </section>
  );
}

function BundleProofPanel({ decision }) {
  return (
    <section className="bundle-proof-panel">
      <div className="bundle-proof-intro">
        <span>Bundle proof</span>
        <strong>Why this is worth doing now</strong>
        <p>{decision.proofSummary}</p>
      </div>
      <div className="bundle-proof-grid">
        {decision.proofRows.map((row) => (
          <div className="bundle-proof-card" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
            <p>{row.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkOrderAmendmentCard({ packet, onOpen, onAction }) {
  const current = packet.currentWorkOrder ?? {
    number: packet.workOrderNumber,
    status: packet.status,
    title: packet.title,
    source: packet.sourceType,
    estimate: `${packet.estimatedMinutes} min`,
    parts: "See WO",
    scope: packet.title
  };
  const amendment = packet.proposedAmendment ?? {
    label: "Prepared change",
    action: packet.nextAction,
    summary: packet.actionDetail,
    estimateDelta: "Review",
    reason: packet.whyThisShift,
    tradeoff: packet.blocker ?? "Supervisor can still defer or change before committing.",
    guardrail: "Open the full WO for source details."
  };

  return (
    <article className="work-order-amendment-card">
      <div className="amendment-current">
        <div className="amendment-card-header">
          <span>Current WO</span>
          <strong>{current.number}</strong>
        </div>
        <h4>{current.title}</h4>
        <p>{packet.assetLabel} · {packet.assetDescription}</p>
        <div className="wo-mock-grid">
          <div>
            <span>Status</span>
            <strong>{current.status}</strong>
          </div>
          <div>
            <span>Source</span>
            <strong>{current.source}</strong>
          </div>
          <div>
            <span>Estimate</span>
            <strong>{current.estimate}</strong>
          </div>
          <div>
            <span>Parts</span>
            <strong>{current.parts}</strong>
          </div>
        </div>
      </div>

      <div className="amendment-proposed">
        <div className="amendment-card-header">
          <span>Prepared update</span>
          <strong>{amendment.estimateDelta}</strong>
        </div>
        <h4>{amendment.action}</h4>
        <p>{amendment.summary}</p>
      </div>

      <div className="amendment-actions">
        <button className={`wo-action-button ${packet.actionTone}`} onClick={onAction}>
          {packet.nextAction}
        </button>
        <button className="open-amendment-wo" onClick={onOpen}>
          <ArrowUpRight size={15} />
          Full WO
        </button>
      </div>
    </article>
  );
}

function PredictiveInsightsHome({ queue, onSelectInsight }) {
  return (
    <section className="panel insight-home">
      <div className="insight-home-header">
        <div>
          <span>Predictive view</span>
          <h2>Predictive Insights</h2>
          <p>
            {queue.summary.insightCount} signals are changing today's work-order priority.
          </p>
        </div>
        <div className="insight-home-meta">
          <strong>{queue.summary.shiftRelevant}</strong>
          <span>shift-relevant WOs</span>
        </div>
      </div>
      <div className="insight-home-list">
        {queue.insights.map((insight) => (
          <PredictiveInsightRow
            key={insight.id}
            insight={insight}
            onClick={() => onSelectInsight(insight)}
          />
        ))}
      </div>
    </section>
  );
}

function PredictiveInsightRow({ insight, onClick }) {
  return (
    <button className="insight-row" onClick={onClick}>
      <div className="insight-row-main">
        <div className="insight-topline">
          <span className={`insight-type ${insight.tone}`}>{insight.signalType}</span>
          <strong>#{insight.rank}</strong>
        </div>
        <h3>{insight.title}</h3>
        <div className="insight-answer-grid">
          <InsightAnswer icon={Info} label="What" text={insight.what} />
          <InsightAnswer icon={Target} label="Why it matters" text={insight.impact} />
          <InsightAnswer icon={Wrench} label="Next action" text={insight.ask} strong />
        </div>
      </div>
      <div className="insight-wo-count" aria-label={`${insight.impactedCount} relevant work orders`}>
        <strong>{insight.impactedCount}</strong>
        <span>{insight.impactedCount === 1 ? "WO" : "WOs"}</span>
      </div>
      <ChevronRight size={20} />
    </button>
  );
}

function InsightAnswer({ icon: Icon, label, text, strong = false }) {
  return (
    <div className={strong ? "insight-answer strong" : "insight-answer"}>
      {Icon && <Icon size={14} />}
      <div>
        <span>{label}</span>
        <p>{text}</p>
      </div>
    </div>
  );
}

function InsightDetailScreen({ insight, packets, onBack, onOpenWorkOrder, sendFeedback }) {
  return (
    <section className="panel insight-detail-screen">
      <div className="insight-detail-header">
        <button className="wo-back-button" onClick={onBack}>
          <ChevronRight size={16} />
          Back to insights
        </button>
        <div className="insight-detail-title">
          <span className={`insight-type ${insight.tone}`}>{insight.signalType}</span>
          <h2>{insight.title}</h2>
          <div className="insight-detail-answers">
            <InsightAnswer icon={Info} label="What" text={insight.what} />
            <InsightAnswer icon={Target} label="Why it matters" text={insight.impact} />
            <InsightAnswer icon={Wrench} label="Next action" text={insight.ask} strong />
          </div>
        </div>
        <div className="insight-detail-stats">
          <div>
            <strong>{insight.impactedCount}</strong>
            <span>WOs</span>
          </div>
          <div>
            <strong>{insight.oneClickCount}</strong>
            <span>quick actions</span>
          </div>
          <div>
            <strong>{insight.draftCount}</strong>
            <span>draft WOs</span>
          </div>
        </div>
      </div>

      <div className="insight-quick-bar">
        <strong>{insight.primaryAction}</strong>
        <span>{insight.impact}</span>
      </div>

      <div className="impacted-action-list">
        {packets.map((packet) => (
          <ImpactedWorkOrderActionRow
            key={packet.id}
            packet={packet}
            onOpen={() => onOpenWorkOrder(packet)}
            onAction={() => sendFeedback(packet.focusItemId, packet.actionFeedbackState)}
          />
        ))}
      </div>
    </section>
  );
}

function ImpactedWorkOrderActionRow({ packet, onOpen, onAction }) {
  return (
    <div className="impacted-action-row">
      <button className="impacted-row-main" onClick={onOpen}>
        <span className="wo-rank">#{packet.rank}</span>
        <div className="wo-row-main">
          <div className="wo-row-title">
            <strong>{packet.title}</strong>
            <span>{packet.workOrderNumber}</span>
          </div>
          <small>{packet.assetLabel} · {packet.assetDescription}</small>
        </div>
        <span className={`status-pill ${statusCopy[packet.readinessState]?.tone}`}>
          {packet.readinessLabel}
        </span>
      </button>
      <button className={`wo-action-button ${packet.actionTone}`} onClick={onAction}>
        {packet.nextAction}
      </button>
      <button className="open-wo-button" onClick={onOpen} aria-label={`Open ${packet.workOrderNumber}`}>
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

function WorkOrderSummaryTile({ label, value, tone = "green" }) {
  return (
    <div className={`wo-summary-tile ${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function WorkOrderQueueRow({ packet, selected, onClick }) {
  return (
    <button className={selected ? "wo-row selected" : "wo-row"} onClick={onClick}>
      <span className="wo-rank">#{packet.rank}</span>
      <div className="wo-row-main">
        <div className="wo-row-title">
          <strong>{packet.title}</strong>
          <span>{packet.workOrderNumber}</span>
        </div>
        <small>{packet.assetLabel} · {packet.assetDescription}</small>
      </div>
      <span className={`status-pill ${statusCopy[packet.readinessState]?.tone}`}>
        {packet.readinessLabel}
      </span>
      <span className={`wo-action-pill ${packet.actionTone}`}>{packet.nextAction}</span>
    </button>
  );
}

function WorkOrderRecordField({ label, value, strong = true }) {
  return (
    <div className="wo-record-field">
      <span>{label}</span>
      {strong ? <strong>{value}</strong> : <p>{value}</p>}
    </div>
  );
}

function WorkOrderRecordSection({ icon: Icon, title, children }) {
  return (
    <section className="wo-record-section">
      <div className="wo-record-section-title">
        <Icon size={16} />
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function WorkOrderActivityRow({ time, title, detail }) {
  return (
    <div className="wo-activity-row">
      <span>{time}</span>
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function WorkOrderPacketDetail({
  packet,
  item,
  sendFeedback,
  contextText,
  setContextText,
  addLocalContext,
  backLabel = "Back to queue",
  onClose
}) {
  if (!packet) {
    return (
      <aside className="panel wo-packet-detail">
        <p>Select a work order packet.</p>
      </aside>
    );
  }

  const signals = item?.signals ?? [];
  const current = packet.currentWorkOrder ?? {
    number: packet.workOrderNumber,
    status: packet.status,
    title: packet.title,
    source: packet.sourceType,
    severity: "medium",
    estimate: `${packet.estimatedMinutes} min`,
    parts: "See WO",
    location: item?.asset?.currentLocation ?? "LAX Fleet Services",
    scope: packet.title
  };
  const amendment = packet.proposedAmendment ?? {
    label: "Prepared update",
    action: packet.nextAction,
    summary: packet.actionDetail,
    estimateDelta: "Review",
    amendedEstimate: packet.assignment?.wave ?? current.estimate,
    reason: packet.whyThisShift,
    tradeoff: packet.blocker ?? "Supervisor can defer, reassign, or change the update before committing.",
    guardrail: packet.assignment?.uncertainty ?? "Confirm local floor context before dispatch.",
    feedbackState: packet.actionFeedbackState
  };
  const asset = item?.asset;
  const assetDescriptionParts = packet.assetDescription.split(" · ");
  const assetClass = asset?.vehicleClassName ?? assetDescriptionParts[0] ?? "Vehicle";
  const vehicleName =
    asset?.year && asset?.make && asset?.model
      ? `${asset.year} ${asset.make} ${asset.model}`
      : assetDescriptionParts.slice(1).join(" · ") || packet.assetDescription;
  const odometer = asset?.odometer ? `${asset.odometer.toLocaleString()} mi` : "Not shown";
  const location = current.location ?? asset?.currentLocation ?? "LAX Fleet Services";
  const assignmentText = packet.assignment
    ? `${packet.assignment.wave} · ${packet.assignment.techs.join(" + ")}`
    : "Unassigned";
  const bayText = packet.assignment?.uncertainty?.toLowerCase().includes("no bay")
    ? "No bay needed"
    : packet.assignment
      ? "Bay to confirm"
      : "Not scheduled";
  const partText = current.parts ?? "None listed";
  const statusLabel = String(current.status ?? packet.status ?? "open").replace(/_/g, " ");

  return (
    <aside className="panel wo-packet-detail wo-record-view">
      <div className="wo-record-header">
        <button className="wo-back-button" onClick={onClose}>
          <ChevronRight size={16} />
          {backLabel}
        </button>
        <div className="wo-record-heading">
          <span>Work order</span>
          <div className="wo-record-title-row">
            <h2>{packet.workOrderNumber}</h2>
            <span className={`status-pill ${statusCopy[packet.readinessState]?.tone}`}>
              {packet.packetType}
            </span>
            <span className={`status-pill ${statusCopy[packet.readinessState]?.tone}`}>
              {packet.readinessLabel}
            </span>
          </div>
          <h3>{current.title}</h3>
          <p>
            <Truck size={15} />
            {vehicleName} · {packet.assetLabel} · {assetClass}
          </p>
        </div>
        <div className="wo-record-header-actions">
          <button>
            <ArrowUpRight size={15} />
            Open in Work Orders
          </button>
          <button
            className={`wo-record-primary-action ${packet.actionTone}`}
            onClick={() => sendFeedback(packet.focusItemId, amendment.feedbackState)}
          >
            <Check size={15} />
            {packet.nextAction}
          </button>
        </div>
      </div>

      <div className="wo-record-body">
        <div className="wo-record-main">
          <WorkOrderRecordSection icon={ClipboardList} title="Work scope">
            <div className="wo-scope-copy">
              <span>Current request</span>
              <strong>{packet.title}</strong>
              <p>{current.scope}</p>
            </div>
            <div className="wo-field-grid three">
              <WorkOrderRecordField label="Status" value={statusLabel} />
              <WorkOrderRecordField label="Source" value={current.source ?? packet.sourceType} />
              <WorkOrderRecordField label="Severity" value={current.severity ?? "medium"} />
            </div>
          </WorkOrderRecordSection>

          <div className="wo-record-two-up">
            <WorkOrderRecordSection icon={Truck} title="Asset">
              <div className="wo-field-grid">
                <WorkOrderRecordField label="Vehicle" value={vehicleName} />
                <WorkOrderRecordField label="Fleet ID" value={packet.assetLabel} />
                <WorkOrderRecordField label="Class" value={assetClass} />
                <WorkOrderRecordField label="Odometer" value={odometer} />
                <WorkOrderRecordField label="Location" value={location} />
                <WorkOrderRecordField
                  label="Out of service"
                  value={asset?.daysUnavailable != null ? `${asset.daysUnavailable} days` : "Not shown"}
                />
              </div>
            </WorkOrderRecordSection>

            <WorkOrderRecordSection icon={Wrench} title="Assignment">
              <div className="wo-field-grid">
                <WorkOrderRecordField label="Scheduled work" value={assignmentText} />
                <WorkOrderRecordField label="Bay / lane" value={bayText} />
                <WorkOrderRecordField label="Labor estimate" value={current.estimate ?? `${packet.estimatedMinutes} min`} />
                <WorkOrderRecordField
                  label="Handoff"
                  value={packet.assignment?.handoff ?? packet.actionDetail}
                  strong={false}
                />
              </div>
            </WorkOrderRecordSection>
          </div>

          <div className="wo-record-two-up">
            <WorkOrderRecordSection icon={PackageCheck} title="Parts and cost">
              <div className="wo-field-grid">
                <WorkOrderRecordField label="Parts on WO" value={partText} />
                <WorkOrderRecordField label="Parts status" value={packet.blocker ? "Needs confirmation" : "No blocker shown"} />
                <WorkOrderRecordField label="Estimate change" value={amendment.estimateDelta} />
                <WorkOrderRecordField label="Updated estimate" value={amendment.amendedEstimate ?? current.estimate} />
              </div>
            </WorkOrderRecordSection>

            <WorkOrderRecordSection icon={Info} title="Source signal">
              <div className="wo-source-copy">
                <span>{packet.sourceType}</span>
                <p>{packet.whyThisShift}</p>
                {packet.blocker && (
                  <div className="wo-record-warning">
                    <AlertTriangle size={15} />
                    <strong>{packet.blocker}</strong>
                  </div>
                )}
              </div>
            </WorkOrderRecordSection>
          </div>

          <WorkOrderRecordSection icon={History} title="Activity and notes">
            <div className="wo-activity-list">
              <WorkOrderActivityRow
                time="5:42 AM"
                title="System prepared shift recommendation"
                detail={amendment.reason}
              />
              <WorkOrderActivityRow
                time="5:50 AM"
                title="Current WO reviewed against shift plan"
                detail={amendment.guardrail}
              />
              <WorkOrderActivityRow
                time="6:00 AM"
                title="Waiting for supervisor decision"
                detail={amendment.tradeoff}
              />
            </div>
          </WorkOrderRecordSection>
        </div>

        <div className="wo-record-side">
          <section className={`prepared-update-card ${packet.actionTone}`}>
            <span>{amendment.label}</span>
            <h3>{amendment.action}</h3>
            <p>{amendment.summary}</p>
            <div className="prepared-update-proof">
              <div>
                <span>Why now</span>
                <strong>{amendment.reason}</strong>
              </div>
              <div>
                <span>Supervisor check</span>
                <strong>{amendment.guardrail}</strong>
              </div>
              <div>
                <span>Tradeoff</span>
                <strong>{amendment.tradeoff}</strong>
              </div>
            </div>
            <div className="wo-record-action-pair">
              <button onClick={() => sendFeedback(packet.focusItemId, amendment.feedbackState)}>
                <Check size={15} />
                {packet.nextAction}
              </button>
              <button onClick={() => sendFeedback(packet.focusItemId, "deferred")}>
                <Clock3 size={15} />
                Defer
              </button>
            </div>
          </section>

          {packet.bundle && (
            <section className="wo-side-note violet">
              <Boxes size={16} />
              <div>
                <strong>{packet.bundle.title}</strong>
                <p>
                  {packet.bundle.currentWork} + {packet.bundle.addOnWork}. Adds {packet.bundle.incrementalTime}.
                </p>
              </div>
            </section>
          )}

          <section className="wo-record-section compact">
            <div className="wo-record-section-title">
              <MapPin size={16} />
              <h3>Related signals</h3>
            </div>
            <div className="wo-related-signal-list">
              {signals.slice(0, 4).map((signal) => (
                <div className="wo-related-signal" key={signal.id}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                  <small>{signal.source_system}</small>
                </div>
              ))}
              {signals.length === 0 && (
                <div className="wo-related-signal">
                  <span>Shift plan</span>
                  <strong>{packet.clusterReason}</strong>
                  <small>Prepared Asset Plan</small>
                </div>
              )}
            </div>
          </section>

          <section className="wo-record-section compact">
            <div className="wo-record-section-title">
              <CalendarClock size={16} />
              <h3>Supervisor note</h3>
            </div>
            <textarea
              value={contextText}
              onChange={(event) => setContextText(event.target.value)}
              placeholder="Add short floor note"
            />
            <div className="context-actions">
              <button onClick={() => addLocalContext("note")}>Save</button>
              <button onClick={() => addLocalContext("voice")}>
                <Mic size={15} />
                Voice
              </button>
              <button onClick={() => addLocalContext("photo")}>
                <Camera size={15} />
                Photo
              </button>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}

function HandoffVariant(props) {
  const {
    brief,
    grouped,
    selectedCluster,
    selectedClusterId,
    chooseCluster,
    selectedId,
    setSelectedId,
    selectedItem,
    sendFeedback,
    contextText,
    setContextText,
    addLocalContext
  } = props;
  return (
    <section className="workspace handoff-grid">
      <div className="left-flow">
        <section className="panel">
          <PanelHeader
            icon={History}
            title="What changed since night shift"
            subtitle="Carryover, blockers, and readiness changes"
          />
          <div className="handoff-list">
            {brief.handoffNotes.map((note) => (
              <div className="handoff-note" key={note.id}>
                <span>{note.note_type}</span>
                <p>{note.text}</p>
              </div>
            ))}
          </div>
        </section>

        <DecisionClusterStrip
          clusters={brief.decisionClusters}
          selectedClusterId={selectedClusterId}
          chooseCluster={chooseCluster}
          compact
        />

        <section className="handoff-columns">
          <FocusGroup
            title="Ready to move"
            items={grouped.ready}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
          <FocusGroup
            title="Blocked before start"
            items={grouped.blocked}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
          <FocusGroup
            title="Needs judgment"
            items={grouped.review.concat(grouped.other)}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </section>
      </div>
      <div className="right-flow">
        <section className="panel cluster-context-panel">
          <PanelHeader
            icon={Boxes}
            title={selectedCluster?.title ?? "Selected cluster"}
            subtitle={selectedCluster?.altitude ?? "Batch decision"}
          />
          <div className="cluster-context-body">
            <p>{selectedCluster?.summary}</p>
            <strong>{selectedCluster?.constraint}</strong>
            <span>{selectedCluster?.recommendedAction}</span>
          </div>
        </section>
        <MobileFloorPanel selectedItem={selectedItem} addLocalContext={addLocalContext} />
        <DetailPanel
          item={selectedItem}
          plan={brief.shiftPlan}
          sendFeedback={sendFeedback}
          contextText={contextText}
          setContextText={setContextText}
          addLocalContext={addLocalContext}
          condensed
        />
      </div>
    </section>
  );
}

function SummaryStrip({ brief }) {
  const items = [
    ["Ready focus items", brief.summary.ready, PackageCheck, "green"],
    ["Blocked before start", brief.summary.blocked, AlertTriangle, "red"],
    ["Needs supervisor review", brief.summary.needsReview, Bell, "amber"],
    ["High-impact items", brief.summary.highImpact, Gauge, "blue"]
  ];

  return (
    <section className="summary-strip">
      {items.map(([label, value, Icon, tone]) => (
        <div className={`summary-tile ${tone}`} key={label}>
          <Icon size={18} />
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

function ScaleBanner({ brief }) {
  return (
    <section className="scale-band">
      <div>
        <span>Mock operation scale</span>
        <strong>{brief.operationScale.activeAssets.toLocaleString()} active assets</strong>
      </div>
      <div>
        <span>Open work</span>
        <strong>{brief.operationScale.openWorkOrders} work orders</strong>
      </div>
      <div>
        <span>Signal noise</span>
        <strong>{brief.operationScale.activeFaults} faults · {brief.operationScale.dvirDefects} DVIRs</strong>
      </div>
      <div>
        <span>Readiness blockers</span>
        <strong>{brief.operationScale.inboundPurchaseOrders} POs · {brief.operationScale.vendorJobs} vendor jobs</strong>
      </div>
    </section>
  );
}

function DecisionClusterStrip({ clusters, selectedClusterId, chooseCluster, compact = false }) {
  const selectedCluster = clusters.find((cluster) => cluster.id === selectedClusterId);

  return (
    <section className={`panel decision-clusters ${compact ? "compact" : ""}`}>
      <PanelHeader
        icon={Boxes}
        title="Decision clusters"
        subtitle="Batch-level constraints first; vehicle decisions after drilldown"
      />
      <div className="cluster-grid">
        {clusters.map((cluster) => (
          <DecisionClusterCard
            key={cluster.id}
            cluster={cluster}
            selected={selectedClusterId === cluster.id}
            onClick={() => chooseCluster(cluster.id)}
            compact={compact}
          />
        ))}
      </div>
      {selectedCluster && <SelectedClusterSummary cluster={selectedCluster} />}
    </section>
  );
}

function SelectedClusterSummary({ cluster }) {
  return (
    <div className="selected-cluster-summary">
      <span>{cluster.count} {cluster.unit}</span>
      <strong>{cluster.handoffAction}</strong>
      <p>{cluster.recommendedAction}</p>
      <small>{cluster.constraint}</small>
    </div>
  );
}

function DecisionClusterCard({ cluster, selected, onClick, compact = false }) {
  return (
    <button className={selected ? "cluster-card selected" : "cluster-card"} onClick={onClick}>
      <div className="cluster-topline">
        <span>{cluster.count} {cluster.unit}</span>
        <strong>{cluster.urgency}</strong>
      </div>
      <h3>{cluster.title}</h3>
      {!compact && <p>{cluster.handoffAction}</p>}
      <div className="cluster-metrics">
        <span>
          <strong>{cluster.visibleItemCount}</strong>
          candidates
        </span>
        <span>
          <strong>{cluster.readyCount}</strong>
          ready
        </span>
        <span>
          <strong>{cluster.blockedCount}</strong>
          blocked
        </span>
      </div>
      <small>{cluster.constraint}</small>
    </button>
  );
}

function FocusTableRow({ item, selected, onClick }) {
  return (
    <button className={selected ? "table-row selected" : "table-row"} onClick={onClick}>
      <span className="rank">#{item.rank}</span>
      <span className="asset-cell">
        <strong>{item.fleetId}</strong>
        <small>{item.vehicleClassName} · {item.vehicle}</small>
      </span>
      <span className={`status-pill ${statusCopy[item.readinessState]?.tone}`}>{item.readinessLabel}</span>
      <span className="impact-cell">{item.impactScore}</span>
      <span className="why-cell">{item.whyThisShift}</span>
      <ChevronRight size={16} />
    </button>
  );
}

function FocusCard({ item, selected, onClick, compact = false }) {
  return (
    <button className={selected ? "focus-card selected" : "focus-card"} onClick={onClick}>
      <div className="card-topline">
        <span className="rank">#{item.rank}</span>
        <span className={`status-pill ${statusCopy[item.readinessState]?.tone}`}>{item.readinessLabel}</span>
      </div>
      <strong>{item.title}</strong>
      <p>{compact ? item.suggestedNextStep : item.whyThisShift}</p>
      <div className="card-meta">
        <span>{item.fleetId}</span>
        <span>{item.estimatedMinutes} min</span>
        <span>{item.deepLinkLabel}</span>
      </div>
    </button>
  );
}

function FocusGroup({ title, items, selectedId, setSelectedId }) {
  return (
    <section className="panel focus-group">
      <h2>{title}</h2>
      <div className="group-list">
        {items.map((item) => (
          <FocusCard
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            onClick={() => setSelectedId(item.id)}
            compact
          />
        ))}
      </div>
    </section>
  );
}

function ShiftPlanPanel({ plan, selectedId, setSelectedId }) {
  if (!plan) return null;

  return (
    <section className="panel shift-plan-panel">
      <PanelHeader
        icon={CalendarClock}
        title="Today's operational plan"
        subtitle={plan.systemOfRecord}
      />
      <div className="plan-capacity">
        <div>
          <span>Techs scheduled</span>
          <strong>{plan.capacity.scheduledTechs}</strong>
        </div>
        <div>
          <span>Available starts</span>
          <strong>{plan.capacity.availableStarts}</strong>
        </div>
        <div className="capacity-warning">
          <span>Bay status</span>
          <strong>{plan.bayAvailability.sourceStatus}</strong>
        </div>
      </div>
      <div className="bay-note">
        <AlertTriangle size={16} />
        <span>{plan.bayAvailability.gap}</span>
      </div>
      <div className="plan-list">
        {plan.assignments.map((assignment) => (
          <button
            className={selectedId === assignment.focusItemId ? "plan-row selected" : "plan-row"}
            key={assignment.id}
            onClick={() => setSelectedId(assignment.focusItemId)}
          >
            <span className="plan-time">{assignment.wave}</span>
            <div>
              <strong>{assignment.title}</strong>
              <small>{assignment.fleetId} · {assignment.workType} · {assignment.techs.join(" + ")}</small>
            </div>
            <span className="plan-status">{assignment.status}</span>
          </button>
        ))}
      </div>
      <section className="bundle-panel">
        <div className="bundle-heading">
          <Boxes size={17} />
          <div>
            <h3>Bundling opportunities</h3>
            <p>Add nearby work while the vehicle is already in flow.</p>
          </div>
        </div>
        <div className="bundle-list">
          {plan.bundleOpportunities.map((bundle) => (
            <button
              className="bundle-card"
              key={bundle.id}
              onClick={() => setSelectedId(bundle.focusItemId)}
            >
              <strong>{bundle.title}</strong>
              <span>{bundle.assetLabel} · +{bundle.incrementalTime}</span>
              <p>{bundle.payoff}</p>
              <small>{bundle.action}</small>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function DetailPanel({ item, plan, sendFeedback, contextText, setContextText, addLocalContext, wide = false, condensed = false }) {
  if (!item) {
    return (
      <aside className="panel detail-panel">
        <p>Select a focus item.</p>
      </aside>
    );
  }

  const assignment = plan?.assignments.find((entry) => entry.focusItemId === item.id);
  const bundle = plan?.bundleOpportunities.find((entry) => entry.focusItemId === item.id);

  return (
    <aside className={`panel detail-panel ${wide ? "wide" : ""} ${condensed ? "condensed" : ""}`}>
      <div className="detail-header">
        <div>
          <span className={`status-pill ${statusCopy[item.readinessState]?.tone}`}>{item.readinessLabel}</span>
          <h2>{item.title}</h2>
          <p>{item.asset.fleetId} · {item.asset.year} {item.asset.make} {item.asset.model}</p>
        </div>
        <button className="icon-button" title="Open linked record">
          <ArrowUpRight size={18} />
        </button>
      </div>

      {item.knownBlocker && (
        <section className="blocker-box">
          <AlertTriangle size={17} />
          <div>
            <strong>Known blocker</strong>
            <p>{item.knownBlocker}</p>
          </div>
        </section>
      )}

      <section className="handoff-box">
        <h3>Work handoff</h3>
        <p>{item.suggestedNextStep}</p>
        {assignment && (
          <div className="assignment-note">
            <strong>{assignment.wave} · {assignment.techs.join(" + ")}</strong>
            <span>{assignment.handoff}</span>
            <small>{assignment.uncertainty}</small>
          </div>
        )}
        {bundle && (
          <div className="bundle-note">
            <strong>{bundle.action}</strong>
            <span>{bundle.currentWork} + {bundle.addOnWork}</span>
          </div>
        )}
        <div className="primary-actions">
          <button onClick={() => sendFeedback(item.id, "planned_this_shift")}>
            <Check size={15} />
            Add to plan
          </button>
          <button>
            <ArrowUpRight size={15} />
            Open WO
          </button>
          <button onClick={() => sendFeedback(item.id, "deferred")}>
            <Clock3 size={15} />
            Defer
          </button>
        </div>
      </section>

      <details className="evidence-disclosure">
        <summary>Background signals</summary>
        <section className="detail-section">
          <h3>Why surfaced</h3>
          <p>{item.whyThisShift}</p>
        </section>
        <div className="metric-pair">
          <div>
            <span>Impact</span>
            <strong>{item.impactScore}/100</strong>
          </div>
          <div>
            <span>Confidence</span>
            <strong>{item.confidence}%</strong>
          </div>
          <div>
            <span>Class ready</span>
            <strong>{item.asset.readyNow}/{item.asset.targetReady}</strong>
          </div>
        </div>
        <div className="signal-list">
          {item.signals.map((signal) => (
            <div className="signal" key={signal.id}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
              <small>{signal.source_system}</small>
            </div>
          ))}
        </div>
      </details>

      <section className="detail-section">
        <h3>Supervisor feedback</h3>
        <div className="feedback-grid">
          {feedbackOptions.map(({ id, label, icon: Icon }) => (
            <button
              className={item.feedbackState === id ? "feedback-active" : ""}
              key={id}
              onClick={() => sendFeedback(item.id, id)}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h3>Local context</h3>
        <textarea
          value={contextText}
          onChange={(event) => setContextText(event.target.value)}
          placeholder="Add floor context, whiteboard note, or technician observation"
        />
        <div className="context-actions">
          <button onClick={() => addLocalContext("note")}>Save note</button>
          <button onClick={() => addLocalContext("voice")}>
            <Mic size={15} />
            Voice
          </button>
          <button onClick={() => addLocalContext("photo")}>
            <Camera size={15} />
            Photo
          </button>
        </div>
        {item.captures.length > 0 && (
          <div className="capture-list">
            {item.captures.slice(0, 3).map((capture) => (
              <p key={capture.id}>
                <strong>{capture.capture_type}:</strong> {capture.text}
              </p>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}

function MobileFloorPanel({ selectedItem, addLocalContext }) {
  return (
    <section className="panel mobile-panel">
      <PanelHeader icon={MapPin} title="Mobile floor view" subtitle="Scaled-down actions for the shop floor" />
      <div className="phone-frame">
        <div className="phone-top">
          <strong>{selectedItem?.asset?.fleetId ?? "Select item"}</strong>
          <span>{selectedItem?.readinessLabel ?? "Focus item"}</span>
        </div>
        <p>{selectedItem?.suggestedNextStep ?? "Open a focus item to capture local context."}</p>
        <div className="phone-actions">
          <button onClick={() => addLocalContext("voice")}>
            <Mic size={16} />
            Voice
          </button>
          <button onClick={() => addLocalContext("photo")}>
            <Camera size={16} />
            Photo
          </button>
        </div>
      </div>
    </section>
  );
}

function PanelHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="panel-header">
      <div className="panel-icon">
        <Icon size={18} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function formatTime(value) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function getVisibleFocusItems(brief, selectedClusterId) {
  if (!brief) return [];
  const cluster = brief.decisionClusters?.find((item) => item.id === selectedClusterId);
  if (!cluster) return brief.focusItems;
  const allowed = new Set(cluster.itemIds);
  return brief.focusItems.filter((item) => allowed.has(item.id));
}
