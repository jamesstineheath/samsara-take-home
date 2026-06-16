import { NextResponse } from "next/server";
import { getShiftBrief } from "../../../../lib/repository";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const brief = getShiftBrief(id);
  if (!brief) {
    return NextResponse.json({ error: "Shift brief not found" }, { status: 404 });
  }
  return NextResponse.json(brief);
}
