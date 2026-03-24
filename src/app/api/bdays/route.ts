import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const start = request.nextUrl.searchParams.get("start");
  const end = request.nextUrl.searchParams.get("end");
  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end parameters required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${PYTHON_API_URL}/bdays?start=${start}&end=${end}`
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to count business days" },
        { status: res.status }
      );
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Python microservice unavailable" },
      { status: 503 }
    );
  }
}
