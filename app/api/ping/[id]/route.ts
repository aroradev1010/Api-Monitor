import { connectDB } from "@/lib/db";
import { Endpoint } from "@/models/Endpoint";
import { Log } from "@/models/Log";
import { Alert } from "@/models/Alert";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
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
      console.error("Request timed out.");
      await Alert.create({
        endpointId: endpoint._id,
        message: "Request timed out after 10s",
        type: "latency",
        latency,
      });
    } else {
      console.error(`Error pinging ${endpoint.url}`, err);
    }
  } finally {
    clearTimeout(timeout);
  }

  // Trigger alerts if needed
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

  // Log the result
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
