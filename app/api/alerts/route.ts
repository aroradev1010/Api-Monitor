import { connectDB } from "@/lib/db";
import { Alert } from "@/models/Alert";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const alerts = await Alert.find().sort({ createdAt: -1 }).limit(10);
  return NextResponse.json(alerts);
}
