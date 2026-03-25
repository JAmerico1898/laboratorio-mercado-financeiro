import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

// Simple in-memory cache with 1-hour TTL
const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date parameter required" }, { status: 400 });
  }

  // Check cache
  const cacheKey = `di1:${date}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(`${PYTHON_API_URL}/di1?date=${date}`);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch DI1 data" },
        { status: res.status }
      );
    }
    const data = await res.json();

    // Cache successful responses
    if (data.contracts?.length > 0) {
      cache.set(cacheKey, { data, expires: Date.now() + CACHE_TTL });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Python microservice unavailable" },
      { status: 503 }
    );
  }
}
