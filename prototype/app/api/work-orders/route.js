import { NextResponse } from "next/server";
import { getWorkOrdersIndex } from "../../../lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getWorkOrdersIndex());
}
