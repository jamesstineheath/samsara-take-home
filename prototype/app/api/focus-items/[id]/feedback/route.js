import { NextResponse } from "next/server";
import { recordFeedback } from "../../../../../lib/repository";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const updated = recordFeedback(id, body.feedbackState, body.reason ?? "");
  if (!updated) {
    return NextResponse.json({ error: "Focus item not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
