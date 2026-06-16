import { NextResponse } from "next/server";
import { recordLocalContext } from "../../../../../lib/repository";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const updated = recordLocalContext(id, body.captureType ?? "note", body.text ?? "");
  if (!updated) {
    return NextResponse.json({ error: "Focus item not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
