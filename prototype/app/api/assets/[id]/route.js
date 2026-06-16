import { NextResponse } from "next/server";
import { getAsset } from "../../../../lib/repository";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const asset = getAsset(id);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
  return NextResponse.json(asset);
}
