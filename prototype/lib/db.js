import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_VERSION = 5;
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "demo.sqlite");
const VERCEL_DB_PATH = "/tmp/samsara-shift-brief-demo.sqlite";

let db;

export function getDb() {
  if (db) return db;

  const dbPath = process.env.VERCEL ? VERCEL_DB_PATH : LOCAL_DB_PATH;
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const versionRow = db.prepare("PRAGMA user_version").get();
  const version = versionRow.user_version ?? 0;
  const hasTables = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'shift_briefs'")
    .get();

  if (!hasTables || version !== DB_VERSION) {
    resetDatabase(db);
    seedDatabase(db);
    db.pragma(`user_version = ${DB_VERSION}`);
  }

  return db;
}

function resetDatabase(database) {
  const tables = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
  database.exec("PRAGMA foreign_keys = OFF");
  for (const table of tables) {
    if (!table.name.startsWith("sqlite_")) {
      database.exec(`DROP TABLE IF EXISTS ${table.name}`);
    }
  }
  database.exec("PRAGMA foreign_keys = ON");
}

function seedDatabase(database) {
  database.exec(`
    CREATE TABLE sites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      operating_model TEXT NOT NULL
    );

    CREATE TABLE vehicle_classes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      segment TEXT NOT NULL,
      demand_pressure INTEGER NOT NULL,
      ready_now INTEGER NOT NULL,
      target_ready INTEGER NOT NULL,
      next_peak TEXT NOT NULL
    );

    CREATE TABLE assets (
      id TEXT PRIMARY KEY,
      fleet_id TEXT NOT NULL,
      vin TEXT NOT NULL,
      vehicle_class_id TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      odometer INTEGER NOT NULL,
      current_location TEXT NOT NULL,
      current_status TEXT NOT NULL,
      days_unavailable REAL NOT NULL,
      FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id)
    );

    CREATE TABLE work_orders (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      status TEXT NOT NULL,
      title TEXT NOT NULL,
      source_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      opened_at TEXT NOT NULL,
      estimated_minutes INTEGER NOT NULL,
      assigned_vendor_id TEXT,
      required_part_ids TEXT,
      FOREIGN KEY (asset_id) REFERENCES assets(id)
    );

    CREATE TABLE fault_events (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      code TEXT NOT NULL,
      severity TEXT NOT NULL,
      first_seen TEXT NOT NULL,
      repeats INTEGER NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (asset_id) REFERENCES assets(id)
    );

    CREATE TABLE dvir_defects (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      reported_at TEXT NOT NULL,
      defect TEXT NOT NULL,
      safety_status TEXT NOT NULL,
      source TEXT NOT NULL,
      FOREIGN KEY (asset_id) REFERENCES assets(id)
    );

    CREATE TABLE pm_schedules (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      pm_type TEXT NOT NULL,
      due_in_days INTEGER NOT NULL,
      due_in_miles INTEGER NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (asset_id) REFERENCES assets(id)
    );

    CREATE TABLE parts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit_cost INTEGER NOT NULL
    );

    CREATE TABLE inventory_locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL
    );

    CREATE TABLE part_inventory (
      id TEXT PRIMARY KEY,
      part_id TEXT NOT NULL,
      location_id TEXT NOT NULL,
      quantity_on_hand INTEGER NOT NULL,
      reserved_quantity INTEGER NOT NULL,
      reorder_point INTEGER NOT NULL,
      FOREIGN KEY (part_id) REFERENCES parts(id),
      FOREIGN KEY (location_id) REFERENCES inventory_locations(id)
    );

    CREATE TABLE purchase_orders (
      id TEXT PRIMARY KEY,
      vendor_name TEXT NOT NULL,
      status TEXT NOT NULL,
      expected_at TEXT NOT NULL,
      line_count INTEGER NOT NULL
    );

    CREATE TABLE warranty_coverages (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      component TEXT NOT NULL,
      coverage_type TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      remaining_miles INTEGER NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (asset_id) REFERENCES assets(id)
    );

    CREATE TABLE vendor_profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      sla_hours INTEGER NOT NULL,
      current_queue INTEGER NOT NULL
    );

    CREATE TABLE vendor_jobs (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      vendor_id TEXT NOT NULL,
      status TEXT NOT NULL,
      eta TEXT NOT NULL,
      aging_hours INTEGER NOT NULL,
      title TEXT NOT NULL,
      FOREIGN KEY (asset_id) REFERENCES assets(id),
      FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id)
    );

    CREATE TABLE rental_demand_windows (
      id TEXT PRIMARY KEY,
      vehicle_class_id TEXT NOT NULL,
      window_label TEXT NOT NULL,
      expected_demand INTEGER NOT NULL,
      ready_target INTEGER NOT NULL,
      ready_now INTEGER NOT NULL,
      FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id)
    );

    CREATE TABLE ready_line_status (
      id TEXT PRIMARY KEY,
      vehicle_class_id TEXT NOT NULL,
      snapshot_label TEXT NOT NULL,
      ready_count INTEGER NOT NULL,
      held_count INTEGER NOT NULL,
      maintenance_hold_count INTEGER NOT NULL,
      FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id)
    );

    CREATE TABLE shifts (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL,
      label TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      ends_at TEXT NOT NULL,
      supervisor_name TEXT NOT NULL,
      FOREIGN KEY (site_id) REFERENCES sites(id)
    );

    CREATE TABLE technicians (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      skill_set TEXT NOT NULL,
      shift_id TEXT NOT NULL,
      active_jobs INTEGER NOT NULL,
      FOREIGN KEY (shift_id) REFERENCES shifts(id)
    );

    CREATE TABLE bays (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      bay_type TEXT NOT NULL,
      status TEXT NOT NULL,
      current_asset_id TEXT
    );

    CREATE TABLE handoff_notes (
      id TEXT PRIMARY KEY,
      shift_id TEXT NOT NULL,
      note_type TEXT NOT NULL,
      text TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (shift_id) REFERENCES shifts(id)
    );

    CREATE TABLE shift_briefs (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL,
      shift_id TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      summary_ready_count INTEGER NOT NULL,
      summary_blocked_count INTEGER NOT NULL,
      summary_needs_review_count INTEGER NOT NULL,
      summary_high_impact_count INTEGER NOT NULL,
      open_work_orders INTEGER NOT NULL,
      active_faults INTEGER NOT NULL,
      dvir_defects INTEGER NOT NULL,
      inbound_purchase_orders INTEGER NOT NULL,
      vendor_jobs_count INTEGER NOT NULL,
      active_assets INTEGER NOT NULL,
      FOREIGN KEY (site_id) REFERENCES sites(id),
      FOREIGN KEY (shift_id) REFERENCES shifts(id)
    );

    CREATE TABLE brief_focus_items (
      id TEXT PRIMARY KEY,
      shift_brief_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      work_order_id TEXT NOT NULL,
      rank INTEGER NOT NULL,
      readiness_state TEXT NOT NULL,
      impact_score INTEGER NOT NULL,
      confidence INTEGER NOT NULL,
      title TEXT NOT NULL,
      why_this_shift TEXT NOT NULL,
      known_blocker TEXT,
      suggested_next_step TEXT NOT NULL,
      deep_link_type TEXT NOT NULL,
      deep_link_label TEXT NOT NULL,
      feedback_state TEXT,
      FOREIGN KEY (shift_brief_id) REFERENCES shift_briefs(id),
      FOREIGN KEY (asset_id) REFERENCES assets(id),
      FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
    );

    CREATE TABLE brief_item_signals (
      id TEXT PRIMARY KEY,
      focus_item_id TEXT NOT NULL,
      signal_type TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      source_system TEXT NOT NULL,
      FOREIGN KEY (focus_item_id) REFERENCES brief_focus_items(id)
    );

    CREATE TABLE supervisor_feedback (
      id TEXT PRIMARY KEY,
      focus_item_id TEXT NOT NULL,
      feedback_state TEXT NOT NULL,
      reason TEXT,
      created_at TEXT NOT NULL,
      created_by TEXT NOT NULL,
      FOREIGN KEY (focus_item_id) REFERENCES brief_focus_items(id)
    );

    CREATE TABLE local_context_captures (
      id TEXT PRIMARY KEY,
      focus_item_id TEXT NOT NULL,
      capture_type TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      created_by TEXT NOT NULL,
      FOREIGN KEY (focus_item_id) REFERENCES brief_focus_items(id)
    );
  `);

  seedRows(database);
}

function seedRows(database) {
  const siteId = "site_hertz_lax";
  database.prepare("INSERT INTO sites VALUES (?, ?, ?, ?)").run(
    siteId,
    "Hertz LAX Fleet Services",
    "LAX Rental Car Center",
    "24/7 rental fleet maintenance"
  );

  const classes = [
    ["class_suv", "SUV", "SUV", 92, 37, 54, "12:30 PM"],
    ["class_midsize", "Midsize", "Sedan", 87, 81, 104, "1:15 PM"],
    ["class_standard", "Standard", "Sedan", 74, 69, 82, "11:45 AM"],
    ["class_compact", "Compact", "Sedan", 58, 113, 96, "5:30 PM"],
    ["class_luxury", "Luxury", "Premium", 69, 14, 22, "3:00 PM"],
    ["class_ev", "EV", "EV", 76, 21, 31, "2:00 PM"],
    ["class_van", "Minivan", "Van", 83, 9, 18, "12:00 PM"],
    ["class_pickup", "Pickup", "Truck", 62, 12, 16, "4:00 PM"],
    ["class_convertible", "Convertible", "Specialty", 51, 7, 11, "2:30 PM"],
    ["class_premium_suv", "Premium SUV", "SUV", 89, 8, 17, "1:00 PM"],
    ["class_fullsize", "Full-size", "Sedan", 72, 51, 64, "12:45 PM"],
    ["class_utility", "Utility", "Utility", 49, 19, 16, "6:00 PM"]
  ];
  const insertClass = database.prepare("INSERT INTO vehicle_classes VALUES (?, ?, ?, ?, ?, ?, ?)");
  for (const row of classes) insertClass.run(...row);

  const makes = [
    ["Toyota", "RAV4", "class_suv"],
    ["Ford", "Explorer", "class_suv"],
    ["Chevrolet", "Malibu", "class_midsize"],
    ["Toyota", "Camry", "class_fullsize"],
    ["Nissan", "Altima", "class_standard"],
    ["Tesla", "Model 3", "class_ev"],
    ["Chrysler", "Pacifica", "class_van"],
    ["Ford", "F-150", "class_pickup"],
    ["BMW", "3 Series", "class_luxury"],
    ["Jeep", "Grand Cherokee", "class_premium_suv"],
    ["Hyundai", "Elantra", "class_compact"],
    ["Ford", "Transit", "class_utility"]
  ];

  const insertAsset = database.prepare("INSERT INTO assets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (let i = 1; i <= 3200; i += 1) {
    const [make, model, classId] = makes[(i - 1) % makes.length];
    const id = assetId(i);
    const status = i % 19 === 0 ? "maintenance_hold" : i % 29 === 0 ? "vendor" : i % 7 === 0 ? "ready_line" : "available";
    const location = status === "vendor" ? "Approved vendor" : status === "maintenance_hold" ? `Bay ${((i % 24) + 1).toString().padStart(2, "0")}` : "LAX ready/return";
    insertAsset.run(
      id,
      `HZ-LAX-${String(i).padStart(5, "0")}`,
      `MOCKVIN${String(i).padStart(10, "0")}`,
      classId,
      make,
      model,
      2021 + (i % 5),
      8_000 + i * 19,
      location,
      status,
      Number(((i % 11) * 0.4).toFixed(1))
    );
  }

  seedOperationalTables(database, classes);
  seedShiftTables(database, siteId);
  seedBrief(database);
}

function seedOperationalTables(database, classes) {
  const parts = [
    ["part_brake_pads", "Front brake pad set", "Brakes", 118],
    ["part_oil_filter", "Oil filter", "Fluids", 18],
    ["part_engine_oil", "Synthetic engine oil", "Fluids", 42],
    ["part_tire_17", "17 inch all-season tire", "Tires", 156],
    ["part_tire_19", "19 inch SUV tire", "Tires", 234],
    ["part_12v_battery", "12V battery", "Electrical", 149],
    ["part_wiper_blades", "Wiper blade set", "Body", 31],
    ["part_ev_cable", "EV charging cable", "EV", 219],
    ["part_tpms", "TPMS sensor", "Electrical", 73],
    ["part_headlamp", "Headlamp assembly", "Body", 286]
  ];
  const insertPart = database.prepare("INSERT INTO parts VALUES (?, ?, ?, ?)");
  for (const part of parts) insertPart.run(...part);
  for (let i = 11; i <= 450; i += 1) {
    insertPart.run(`part_${i}`, `Mock stocked part ${i}`, i % 4 === 0 ? "Tires" : i % 4 === 1 ? "Brakes" : i % 4 === 2 ? "Electrical" : "Fluids", 12 + (i % 240));
  }

  const locations = [
    ["loc_stockroom", "Main stockroom", "stockroom"],
    ["loc_qta", "QTA quick-turn area", "floor"],
    ["loc_cart_a", "Mobile cart A", "cart"],
    ["loc_cart_b", "Mobile cart B", "cart"],
    ["loc_vendor_reserve", "Vendor reserve", "external"]
  ];
  const insertLocation = database.prepare("INSERT INTO inventory_locations VALUES (?, ?, ?)");
  for (const location of locations) insertLocation.run(...location);

  const insertInventory = database.prepare("INSERT INTO part_inventory VALUES (?, ?, ?, ?, ?, ?)");
  const partIds = parts.map((p) => p[0]).concat(Array.from({ length: 440 }, (_, index) => `part_${index + 11}`));
  let invIndex = 1;
  for (const partId of partIds) {
    for (const location of locations.slice(0, 3)) {
      insertInventory.run(`inv_${invIndex}`, partId, location[0], (invIndex * 7) % 38, invIndex % 5, 4 + (invIndex % 8));
      invIndex += 1;
    }
  }

  const insertPo = database.prepare("INSERT INTO purchase_orders VALUES (?, ?, ?, ?, ?)");
  for (let i = 1; i <= 48; i += 1) {
    insertPo.run(`po_${i}`, i % 3 === 0 ? "O'Reilly Auto Parts" : i % 3 === 1 ? "Dealer parts counter" : "Tire distributor", i % 5 === 0 ? "delayed" : "inbound", i % 4 === 0 ? "Today 11:30 AM" : i % 4 === 1 ? "Today 2:15 PM" : "Tomorrow 8:00 AM", 1 + (i % 4));
  }

  const insertFault = database.prepare("INSERT INTO fault_events VALUES (?, ?, ?, ?, ?, ?, ?)");
  for (let i = 1; i <= 230; i += 1) {
    insertFault.run(`fault_${i}`, assetId((i * 11) % 3200 || 1), i % 3 === 0 ? "P0420" : i % 3 === 1 ? "B124D" : "U0121", i % 9 === 0 ? "high" : i % 3 === 0 ? "medium" : "low", "Last 24h", i % 6, i % 4 === 0 ? "new" : "active");
  }

  const insertDvir = database.prepare("INSERT INTO dvir_defects VALUES (?, ?, ?, ?, ?, ?)");
  for (let i = 1; i <= 65; i += 1) {
    insertDvir.run(`dvir_${i}`, assetId((i * 17) % 3200 || 2), "Last 24h", i % 4 === 0 ? "Brake vibration" : i % 4 === 1 ? "Tire pressure warning" : i % 4 === 2 ? "Check engine light" : "Body damage noted", i % 5 === 0 ? "unsafe" : "safe_with_review", i % 2 === 0 ? "return agent" : "driver");
  }

  const insertPm = database.prepare("INSERT INTO pm_schedules VALUES (?, ?, ?, ?, ?, ?)");
  for (let i = 1; i <= 3200; i += 1) {
    insertPm.run(`pm_${i}`, assetId(i), i % 2 === 0 ? "PM A" : "PM B", i % 11, (i * 13) % 1800, i % 13 === 0 ? "overdue" : i % 9 === 0 ? "due_soon" : "scheduled");
  }

  const insertDemand = database.prepare("INSERT INTO rental_demand_windows VALUES (?, ?, ?, ?, ?, ?)");
  const insertReady = database.prepare("INSERT INTO ready_line_status VALUES (?, ?, ?, ?, ?, ?)");
  for (const [classId, , , pressure, readyNow, target] of classes) {
    for (const window of ["6-10 AM", "10 AM-2 PM", "2-6 PM"]) {
      insertDemand.run(`demand_${classId}_${window}`, classId, window, Math.round(target * (pressure / 70)), target, readyNow);
    }
    for (const snap of ["4 AM", "6 AM", "8 AM", "10 AM", "12 PM", "2 PM"]) {
      insertReady.run(`ready_${classId}_${snap}`, classId, snap, Math.max(0, readyNow - (snap === "4 AM" ? 8 : 0)), Math.round(target * 0.18), Math.round(target * 0.11));
    }
  }

  const insertVendor = database.prepare("INSERT INTO vendor_profiles VALUES (?, ?, ?, ?, ?)");
  const vendors = [
    ["vendor_dealer", "South Bay Dealer Service", "dealer", 36, 9],
    ["vendor_tire", "Airport Tire Partner", "tire", 12, 14],
    ["vendor_glass", "LAX Glass Mobile", "glass", 18, 5],
    ["vendor_body", "Century Body Shop", "body", 72, 10]
  ];
  for (const vendor of vendors) insertVendor.run(...vendor);

  const insertVendorJob = database.prepare("INSERT INTO vendor_jobs VALUES (?, ?, ?, ?, ?, ?, ?)");
  for (let i = 1; i <= 38; i += 1) {
    insertVendorJob.run(`vendor_job_${i}`, assetId((i * 23) % 3200 || 3), vendors[i % vendors.length][0], i % 7 === 0 ? "eta_stale" : "in_progress", i % 7 === 0 ? "ETA missing" : "Today 3:30 PM", 4 + i * 2, i % 2 === 0 ? "Dealer diagnostic" : "Tire/glass vendor work");
  }

  const insertWarranty = database.prepare("INSERT INTO warranty_coverages VALUES (?, ?, ?, ?, ?, ?, ?)");
  for (let i = 1; i <= 1050; i += 1) {
    insertWarranty.run(`warranty_${i}`, assetId((i * 3) % 3200 || 4), i % 4 === 0 ? "powertrain" : i % 4 === 1 ? "tire" : i % 4 === 2 ? "battery" : "emissions", i % 3 === 0 ? "OEM" : "component", "2027-12-31", 500 + (i % 20) * 250, i % 17 === 0 ? "review" : "active");
  }
}

function seedShiftTables(database, siteId) {
  const shiftId = "shift_2026_06_16_day";
  database.prepare("INSERT INTO shifts VALUES (?, ?, ?, ?, ?, ?)").run(
    shiftId,
    siteId,
    "Day shift",
    "2026-06-16T06:00:00-07:00",
    "2026-06-16T14:00:00-07:00",
    "Maya Torres"
  );

  const insertTech = database.prepare("INSERT INTO technicians VALUES (?, ?, ?, ?, ?)");
  const skills = ["brakes", "diagnostics", "quick-turn", "EV", "tires", "body triage"];
  for (let i = 1; i <= 40; i += 1) {
    insertTech.run(`tech_${i}`, `Tech ${i}`, `${skills[i % skills.length]}, ${skills[(i + 2) % skills.length]}`, shiftId, i <= 18 ? i % 3 : 0);
  }

  const insertBay = database.prepare("INSERT INTO bays VALUES (?, ?, ?, ?, ?)");
  for (let i = 1; i <= 24; i += 1) {
    insertBay.run(`bay_${i}`, `Bay ${String(i).padStart(2, "0")}`, i % 5 === 0 ? "diagnostic" : i % 4 === 0 ? "quick-turn" : "repair", i % 6 === 0 ? "blocked" : i % 3 === 0 ? "occupied" : "open", i % 3 === 0 ? assetId(i * 12) : null);
  }

  const insertNote = database.prepare("INSERT INTO handoff_notes VALUES (?, ?, ?, ?, ?, ?)");
  const notes = [
    ["carryover", "Night shift parked HZ-LAX-00017 by Bay 04; oil filters staged but not scanned.", "Luis"],
    ["blocker", "Brake pads PO says 11:30 AM. Do not assign Malibu brake work before parts arrive.", "Luis"],
    ["ops", "SUV shortage expected before midday arrivals. Prioritize quick SUV returns if safe.", "Ops lead"],
    ["vendor", "Dealer has not confirmed ETA on HZ-LAX-00029; call before approving another tow.", "Luis"],
    ["local", "Whiteboard photo added for carryover lane. Two units physically inaccessible until returns lane clears.", "Maya"]
  ];
  notes.forEach((note, index) => {
    insertNote.run(`note_${index + 1}`, shiftId, note[0], note[1], note[2], "2026-06-16T05:42:00-07:00");
  });
}

function seedBrief(database) {
  const briefId = "brief_2026_06_16_day";
  database.prepare("INSERT INTO shift_briefs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    briefId,
    "site_hertz_lax",
    "shift_2026_06_16_day",
    "2026-06-16T05:50:00-07:00",
    4,
    3,
    2,
    5,
    185,
    230,
    65,
    48,
    38,
    3200
  );

  const focusAssets = [10, 39, 89, 116, 203, 318, 511, 700, 839, 1029, 1441, 2016];
  const focusItems = [
    ["focus_1", focusAssets[0], "ready", 96, 88, "Premium SUV brake job ready now", "Premium SUV class is short before the 1 PM demand peak. Parts are on hand and Bay 04 opens in 22 min.", null, "Plan this for first wave and attach staged parts to the work order.", "work_order", "WO-9017"],
    ["focus_2", focusAssets[1], "blocked", 89, 83, "Midsize brake vibration blocked by parts", "Midsize demand is rising, but assigning this before brake pads arrive creates a wasted start.", "Brake pads PO expected 11:30 AM", "Hold until PO receipt; set reminder and prep inspection lane.", "inventory", "PO-4756"],
    ["focus_3", focusAssets[2], "needs_review", 84, 72, "Repeat check-engine fault before dispatch", "Fault repeated three times after prior closeout. Could create a customer-facing return if sent to ready line.", "Needs diagnostic review", "Have diagnostics tech inspect before release decision.", "fault", "Fault P0420"],
    ["focus_4", focusAssets[3], "vendor", 81, 79, "Warranty-covered powertrain issue", "Coverage appears active; local repair may create avoidable cost if routed normally.", "Dealer path required for reimbursement", "Send to dealer queue and attach warranty evidence.", "warranty", "Warranty review"],
    ["focus_5", focusAssets[4], "bundle_candidate", 76, 86, "PM A can be bundled with tire replacement", "Vehicle is already in Bay 09 and PM is due in 420 miles. Bundle prevents another shop visit this week.", null, "Add PM A to current tire work order.", "work_order", "WO-9203"],
    ["focus_6", focusAssets[5], "blocked", 74, 67, "EV charger cable missing from return", "EV class is under target, but vehicle cannot be rented without replacement cable.", "Replacement cable inventory is low confidence", "Verify stockroom count before assigning technician.", "inventory", "Part EV-CBL"],
    ["focus_7", focusAssets[6], "vendor", 71, 64, "Vendor ETA stale on glass repair", "Vehicle has been out 2.8 days and vendor ETA has not changed since yesterday.", "Vendor ETA stale", "Call vendor and update ready-by-time or reroute.", "vendor", "LAX Glass Mobile"],
    ["focus_8", focusAssets[7], "ready", 69, 91, "Quick oil/filter service can return sedan today", "Full-size class is slightly below target and all parts are staged in QTA.", null, "Plan as filler work between higher-risk jobs.", "work_order", "WO-9707"],
    ["focus_9", focusAssets[8], "defer", 55, 82, "Compact cosmetic repair can wait", "Compact class has surplus ready inventory and the issue does not block rental safety.", "Low operational value this shift", "Defer and keep bay capacity for SUV/midsize work.", "asset", "HZ-LAX-00844"],
    ["focus_10", focusAssets[9], "needs_review", 52, 58, "Return agent damage note needs photo check", "Damage note is vague and no work order should be opened until photo review confirms severity.", "Photo evidence missing", "Use mobile floor view to add photo and decision note.", "dvir", "Return note"],
    ["focus_11", focusAssets[10], "ready", 48, 76, "Tire pressure DVIR already resolved but not closed", "The work appears complete and ready-line count may be understated.", null, "Confirm closeout and move asset state to rentable if ops agrees.", "work_order", "WO-9441"],
    ["focus_12", focusAssets[11], "blocked", 44, 61, "Utility van blocked by bay access", "The van is physically behind two return-lane vehicles; assigning now will stall the tech.", "Vehicle not physically accessible", "Ask lot team to reposition before adding to plan.", "asset", "HZ-LAX-02016"]
  ];

  const insertWo = database.prepare("INSERT INTO work_orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const insertFocus = database.prepare("INSERT INTO brief_focus_items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const insertSignal = database.prepare("INSERT INTO brief_item_signals VALUES (?, ?, ?, ?, ?, ?)");

  for (let i = 1; i <= 185; i += 1) {
    const asset = assetId((i * 17) % 3200 || 1);
    insertWo.run(`wo_${i}`, asset, i % 6 === 0 ? "blocked" : i % 5 === 0 ? "in_progress" : "open", i % 3 === 0 ? "Brake inspection" : i % 3 === 1 ? "PM / fluid service" : "Fault review", i % 4 === 0 ? "DVIR" : i % 4 === 1 ? "fault" : i % 4 === 2 ? "PM" : "return_inspection", i % 9 === 0 ? "high" : i % 4 === 0 ? "medium" : "low", "2026-06-15T18:00:00-07:00", 30 + (i % 8) * 20, i % 13 === 0 ? "vendor_dealer" : null, i % 5 === 0 ? "part_brake_pads" : "part_oil_filter");
  }

  focusItems.forEach((item, index) => {
    const [id, assetNumber, readiness, impact, confidence, title, why, blocker, nextStep, linkType, linkLabel] = item;
    const woId = `focus_wo_${index + 1}`;
    insertWo.run(woId, assetId(assetNumber), readiness === "blocked" ? "blocked" : readiness === "vendor" ? "vendor" : "open", title, index % 3 === 0 ? "fault" : index % 3 === 1 ? "DVIR" : "PM", impact > 80 ? "high" : "medium", "2026-06-15T20:30:00-07:00", 35 + (index % 5) * 25, readiness === "vendor" ? "vendor_dealer" : null, readiness === "blocked" ? "part_brake_pads" : "part_oil_filter");
    insertFocus.run(id, briefId, assetId(assetNumber), woId, index + 1, readiness, impact, confidence, title, why, blocker, nextStep, linkType, linkLabel, null);
    const signals = buildSignals(readiness, impact, confidence);
    signals.forEach((signal, signalIndex) => {
      insertSignal.run(`${id}_signal_${signalIndex + 1}`, id, signal.type, signal.label, signal.value, signal.source);
    });
  });
}

function buildSignals(readiness, impact, confidence) {
  const base = [
    { type: "ops", label: "Operational value", value: `${impact}/100 feasible uptime impact`, source: "Rental operations" },
    { type: "confidence", label: "Confidence", value: `${confidence}%`, source: "Shift Brief model" }
  ];
  if (readiness === "ready") return base.concat([{ type: "parts", label: "Parts", value: "On hand and staged", source: "Inventory" }]);
  if (readiness === "blocked") return base.concat([{ type: "blocker", label: "Blocker", value: "Known before assignment", source: "Inventory / local context" }]);
  if (readiness === "vendor") return base.concat([{ type: "vendor", label: "External path", value: "Vendor or dealer action required", source: "Vendor / warranty" }]);
  if (readiness === "needs_review") return base.concat([{ type: "review", label: "Review", value: "Human judgment needed", source: "Faults / return notes" }]);
  if (readiness === "bundle_candidate") return base.concat([{ type: "bundle", label: "Bundle", value: "Can reduce repeat shop visit", source: "PM schedule" }]);
  return base.concat([{ type: "defer", label: "Value", value: "Lower priority this shift", source: "Rental operations" }]);
}

function assetId(number) {
  return `asset_${String(number).padStart(4, "0")}`;
}
