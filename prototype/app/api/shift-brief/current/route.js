import { NextResponse } from "next/server";
import { getCurrentShiftBrief } from "../../../../lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCurrentShiftBrief());
}
