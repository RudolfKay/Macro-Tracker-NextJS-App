import { useState } from "react";
import { searchFoods } from "@/api/foodSearch";
import type { FoodProduct, FoodSearchResult } from "@/types/food-search";

export function useFoodSearch() {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<FoodProduct[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const search = async () => {
    if (!value.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setTotal(null);
    setFromCache(false);
    try {
      const data: FoodSearchResult = await searchFoods(value);
      setResults(data.products);
      setTotal(data.total);
      setFromCache(!!data.fromCache);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error searching food database.");
      setResults([]);
      setTotal(null);
      setFromCache(false);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults([]);
    setTotal(null);
    setError(null);
    setFromCache(false);
  };

  return {
    value,
    setValue,
    results,
    total,
    loading,
    error,
    fromCache,
    search,
    reset,
  };
} 