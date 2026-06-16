import { NextResponse } from "next/server";
import { getFocusItem } from "../../../../lib/repository";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const item = getFocusItem(id);
  if (!item) {
    return NextResponse.json({ error: "Focus item not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}
