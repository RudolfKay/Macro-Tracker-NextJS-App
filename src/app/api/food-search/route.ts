import { NextRequest, NextResponse } from "next/server";
import {
  canMakeRequest,
  recordRequest,
  getRetryAfterSeconds,
  getCache,
  setCache,
  fetchFromOFF,
  CACHE_EXPIRY_DAYS,
} from "@/lib/food-search";
import { FoodSearchResultSchema } from "@/types/food-search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") || "").trim().toLowerCase();
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // Only ever cache/fetch for page=1
  const cache = await getCache(query);
  const now = new Date();
  if (cache) {
    const age = (now.getTime() - new Date(cache.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (age < CACHE_EXPIRY_DAYS) {
      const results = cache.results;
      // Validate shape
      const parsed = FoodSearchResultSchema.safeParse(results);
      if (parsed.success) {
        return NextResponse.json({ ...parsed.data, fromCache: true });
      } else {
        // If cache is invalid, ignore and fetch fresh
      }
    }
  }

  // Rate limit check
  if (!canMakeRequest()) {
    const retryAfter = getRetryAfterSeconds();
    return new NextResponse(
      JSON.stringify({ error: `Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.` }),
      {
        status: 429,
        headers: { "Retry-After": retryAfter.toString(), "Content-Type": "application/json" },
      }
    );
  }
  recordRequest();

  const { products, total } = await fetchFromOFF(query);
  await setCache(query, products, total);

  return NextResponse.json({ products, total, fromCache: false });
}