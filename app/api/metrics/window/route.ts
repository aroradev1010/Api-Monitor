import { connectDB } from "@/lib/db";
import { Log } from "@/models/Log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing query params" },
      { status: 400 }
    );
  }

  const logs = await Log.find({
    timestamp: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
  })

  return NextResponse.json(logs);
}
