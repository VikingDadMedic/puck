import { NextResponse } from "next/server";
import { searchFlights } from "../../../../lib/serp/engines/flights";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";

  if (!from || !to) {
    return NextResponse.json(
      { error: "from and to are required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchFlights({
      departureId: from,
      arrivalId: to,
      outboundDate: date,
    });
    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
