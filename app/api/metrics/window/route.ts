import { connectDB } from "@/lib/db";
import { Log } from "@/models/Log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  // 1. Extract and trim
  const rawFrom = searchParams.get("from")?.trim();
  const rawTo = searchParams.get("to")?.trim();

  if (!rawFrom || !rawTo) {
    return NextResponse.json(
      { error: "Missing required `from` or `to` query parameters" },
      { status: 400 }
    );
  }

  // 2. Parse into Date objects
  const fromDate = new Date(rawFrom);
  const toDate = new Date(rawTo);

  // 3. Validate dates
  if (isNaN(fromDate.valueOf()) || isNaN(toDate.valueOf())) {
    return NextResponse.json(
      { error: "`from` or `to` is not a valid ISO date string" },
      { status: 400 }
    );
  }

  // 4. Query on createdAt (assuming timestamps: true on Log schema)
  const logs = await Log.find({
    createdAt: {
      $gte: fromDate,
      $lte: toDate,
    },
  });

  return NextResponse.json(logs);
}
