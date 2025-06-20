import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, role = "admin" } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const token = jwt.sign({ email, role }, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  });

  return NextResponse.json({ token }, { status: 200 });
}
