// app/api/ping/[id]/route.ts

import { connectDB } from "@/lib/db";
import { Endpoint } from "@/models/Endpoint";
import { Log } from "@/models/Log";
import { Alert } from "@/models/Alert";
import { NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimiter";

export async function GET(_req: Request, context: { params: { id: string } }) {
  const ip = _req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await connectDB();
  const { id } = context.params;

  const endpoint = await Endpoint.findById(id);
  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
  let statusCode = 500;
  let latency = 0;

  const start = Date.now();
  try {
    const response = await fetch(endpoint.url, {
      method: "GET",
      signal: controller.signal,
    });
    latency = Date.now() - start;
    statusCode = response.status;
  } catch (err: any) {
    latency = Date.now() - start;
    if (err.name === "AbortError") {
      // Timeout alert
      await Alert.create({
        endpointId: endpoint._id,
        message: "Request timed out after 10s",
        latency,
        type: "latency",
      });
    }
  } finally {
    clearTimeout(timeout);
  }

  // High latency alert
  if (latency > 300) {
    await Alert.create({
      endpointId: endpoint._id,
      message: `High latency: ${latency}ms`,
      latency,
      type: "latency",
    });
  }

  // Server error alert
  if (statusCode >= 500) {
    await Alert.create({
      endpointId: endpoint._id,
      message: `Server error: status ${statusCode}`,
      statusCode,
      type: "error",
    });
  }

  // Always create a new log
  await Log.create({
    endpointId: endpoint._id,
    latency,
    statusCode,
  });

  return NextResponse.json({
    endpoint: endpoint.url,
    latency,
    statusCode,
    message: "Ping logged successfully",
  });
}
