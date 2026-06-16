import { NextResponse } from "next/server";
import { getShiftMetrics } from "../../../../../lib/repository";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const metrics = getShiftMetrics(id);
  if (!metrics) {
    return NextResponse.json({ error: "Metrics not found" }, { status: 404 });
  }
  return NextResponse.json(metrics);
}
