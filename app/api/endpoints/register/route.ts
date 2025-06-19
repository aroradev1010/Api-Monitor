import { connectDB } from "@/lib/db";
import { Endpoint } from "@/models/Endpoint";
import { endpointSchema } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = endpointSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const endpoint = await Endpoint.create(parsed.data);
  return NextResponse.json(endpoint, { status: 201 });
}
