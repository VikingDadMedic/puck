import { NextResponse } from "next/server";
import { exploreDestinations } from "../../../../lib/serp/engines/explore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || "";

  if (!from) {
    return NextResponse.json({ error: "from is required" }, { status: 400 });
  }

  try {
    const results = await exploreDestinations({
      departureId: from,
      outboundDate: searchParams.get("outboundDate") || undefined,
      returnDate: searchParams.get("returnDate") || undefined,
    });
    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
