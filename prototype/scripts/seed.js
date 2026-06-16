import { getDb } from "../lib/db.js";

const db = getDb();
const counts = {
  assets: db.prepare("SELECT COUNT(*) AS count FROM assets").get().count,
  workOrders: db.prepare("SELECT COUNT(*) AS count FROM work_orders").get().count,
  focusItems: db.prepare("SELECT COUNT(*) AS count FROM brief_focus_items").get().count,
  faults: db.prepare("SELECT COUNT(*) AS count FROM fault_events").get().count,
  dvirs: db.prepare("SELECT COUNT(*) AS count FROM dvir_defects").get().count,
  parts: db.prepare("SELECT COUNT(*) AS count FROM parts").get().count
};

console.log(JSON.stringify(counts, null, 2));
