import { connectDB } from "@/lib/db";
import { Log } from "@/models/Log";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const result = await Log.aggregate([
    {
      $group: {
        _id: "$endpointId",
        total: { $sum: 1 },
        avgLatency: { $avg: "$latency" },
        errorCount: {
          $sum: { $cond: [{ $gte: ["$statusCode", 400] }, 1, 0] },
        },
      },
    },
  ]);

  return NextResponse.json(result);
}
