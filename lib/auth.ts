import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function verifyJWT(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch {
    return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
  }
}
