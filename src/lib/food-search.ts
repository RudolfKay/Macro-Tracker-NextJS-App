import prisma from "@/lib/prisma";
import type { FoodProduct } from "@/types/food-search";

type RawFoodProduct = Partial<FoodProduct> & { [key: string]: unknown };

const CACHE_EXPIRY_DAYS = 30;
const OFF_BATCH_SIZE = 1000;
const RATE_LIMIT = 10;
let requestTimestamps: number[] = [];

// --- Rate Limiter ---
export const canMakeRequest = () => {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(ts => now - ts < 60000);
  return requestTimestamps.length < RATE_LIMIT;
};
export const recordRequest = () => {
  requestTimestamps.push(Date.now());
};
export const getRetryAfterSeconds = () => {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(ts => now - ts < 60000);
  if (requestTimestamps.length < RATE_LIMIT) return 0;
  const oldest = Math.min(...requestTimestamps);
  return Math.ceil((60000 - (now - oldest)) / 1000);
};

// --- Cache Helpers ---
export const getCache = async (query: string) => {
  return prisma.foodCache.findUnique({
    where: { query_page: { query, page: 1 } },
  });
};
export const setCache = async (query: string, products: FoodProduct[], total: number) => {
  return prisma.foodCache.upsert({
    where: { query_page: { query, page: 1 } },
    update: { results: { products, total } },
    create: { query, page: 1, results: { products, total } },
  });
};

// --- OpenFoodFacts Fetch Helper ---
export const fetchFromOFF = async (query: string) => {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${OFF_BATCH_SIZE}&page=1`;
  const res = await fetch(url);
  const data = await res.json();
  let products: RawFoodProduct[] = data.products || [];
  const totalProducts = data.count || 0;
  
  // Filter products by query words in product_name
  const queryWords = query.split(' ').filter(Boolean);
  const matchesQuery = (name: string) =>
    queryWords.every(word => name.toLowerCase().includes(word));
  products = products.filter(
    (p) => typeof p.product_name === 'string' && matchesQuery(p.product_name as string)
  );

  // Normalize product_quantity to number or undefined
  products = products.map((p) => ({
    ...p,
    product_quantity: p.product_quantity !== undefined
      ? (typeof p.product_quantity === "string"
          ? (isNaN(Number(p.product_quantity)) ? undefined : Number(p.product_quantity))
          : p.product_quantity)
      : undefined,
  }));
  return { products: products as FoodProduct[], total: totalProducts };
};

export { CACHE_EXPIRY_DAYS }; 