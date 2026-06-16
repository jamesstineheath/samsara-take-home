import { NextResponse } from "next/server";
import { getWorkOrder } from "../../../../lib/repository";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const workOrder = getWorkOrder(id);
  if (!workOrder) {
    return NextResponse.json({ error: "Work order not found" }, { status: 404 });
  }
  return NextResponse.json(workOrder);
}
