import { connectDB } from "@/lib/db";
import { Log } from "@/models/Log";
import { logSchema } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = logSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const log = await Log.create(parsed.data);
  return NextResponse.json(log, { status: 201 });
}
