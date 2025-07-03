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
  console.log("[FOOD-SEARCH] Query:", query);
  console.log("[FOOD-SEARCH] Cache:", cache);
  if (cache) {
    const age = (now.getTime() - new Date(cache.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    console.log("[FOOD-SEARCH] Cache age (days):", age, "Expiry threshold:", CACHE_EXPIRY_DAYS);
    if (age < CACHE_EXPIRY_DAYS) {
      const results = cache.results;
      // Validate shape
      const parsed = FoodSearchResultSchema.safeParse(results);
      console.log("[FOOD-SEARCH] Schema parse result:", parsed.success);
      if (!parsed.success) {
        console.log("[FOOD-SEARCH] Schema parse error:", parsed.error);
      }
      if (parsed.success) {
        console.log("[FOOD-SEARCH] Returning cached result with fromCache: true");
        return NextResponse.json({ ...parsed.data, fromCache: true });
      } else {
        // If cache is invalid, ignore and fetch fresh
        console.log("[FOOD-SEARCH] Cache invalid, will fetch fresh from OFF");
      }
    } else {
      console.log("[FOOD-SEARCH] Cache expired, will fetch fresh from OFF");
    }
  } else {
    console.log("[FOOD-SEARCH] No cache found, will fetch fresh from OFF");
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
  console.log("[FOOD-SEARCH] Fetched from OFF and cached. Returning fromCache: false");

  return NextResponse.json({ products, total, fromCache: false });
}