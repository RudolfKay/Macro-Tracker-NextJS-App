import type { FoodSearchResult } from "@/types/food-search";

export async function searchFoods(query: string): Promise<FoodSearchResult> {
  const res = await fetch(`/api/food-search?query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to search foods");
  }
  return await res.json();
} 