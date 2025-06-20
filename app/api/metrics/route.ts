import { connectDB } from "@/lib/db";
import { Log } from "@/models/Log";
import { NextResponse } from "next/server";

export async function GET() {
  // 1. Ensure DB connection
  await connectDB();

  // 2. Aggregate per‑endpoint metrics
  const metrics = await Log.aggregate([
    {
      $group: {
        _id: "$endpointId",
        requestCount: { $sum: 1 },
        avgLatency: { $avg: "$latency" },
        errorCount: {
          $sum: { $cond: [{ $gte: ["$statusCode", 400] }, 1, 0] },
        },
      },
    },
  ]);

  // 3. Return JSON
  return NextResponse.json(metrics);
}
