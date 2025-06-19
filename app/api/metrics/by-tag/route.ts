import { connectDB } from "@/lib/db";
import { Endpoint } from "@/models/Endpoint";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const endpoints = await Endpoint.aggregate([
    { $unwind: "$tags" },
    {
      $lookup: {
        from: "logs",
        localField: "_id",
        foreignField: "endpointId",
        as: "logs",
      },
    },
    {
      $unwind: "$logs",
    },
    {
      $group: {
        _id: "$tags",
        avgLatency: { $avg: "$logs.latency" },
        errorCount: {
          $sum: { $cond: [{ $gte: ["$logs.statusCode", 400] }, 1, 0] },
        },
        requestCount: { $sum: 1 },
      },
    },
    { $sort: { requestCount: -1 } },
  ]);

  return NextResponse.json(endpoints);
}
