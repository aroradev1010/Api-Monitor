import { connectDB } from "@/lib/db";
import { Endpoint } from "@/models/Endpoint";
import { Log } from "@/models/Log";
import { endpointSchema } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";
import { Alert } from "@/models/Alert";
import { isRateLimited } from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await connectDB();
  const body = await req.json();
  const result = endpointSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, url, tags } = result.data;
  const endpoint = await Endpoint.create({ name, url, tags });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let statusCode = 500;
  let latency = 0;

  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });
    latency = Date.now() - start;
    statusCode = response.status;
  } catch (err: any) {
    latency = Date.now() - start;
    if (err.name === "AbortError") {
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

  if (latency > 300) {
    await Alert.create({
      endpointId: endpoint._id,
      message: `High latency: ${latency}ms`,
      latency,
      type: "latency",
    });
  }

  if (statusCode >= 500) {
    await Alert.create({
      endpointId: endpoint._id,
      message: `Server error: status ${statusCode}`,
      statusCode,
      type: "error",
    });
  }

  await Log.create({
    endpointId: endpoint._id,
    latency,
    statusCode,
  });

  return NextResponse.json(endpoint, { status: 201 });
}
