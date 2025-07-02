import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CACHE_EXPIRY_DAYS = 30;
const PAGE_SIZE_DEFAULT = 15;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") || "").trim().toLowerCase();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || PAGE_SIZE_DEFAULT);
  if (!query) {
    console.log("[food-search] No query provided");
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // Check cache (per query, not per page)
  const cache = await prisma.foodCache.findUnique({
    where: { query_page: { query, page: 0 } }, // page: 0 means all results for query
  });
  const now = new Date();
  if (cache) {
    const age = (now.getTime() - new Date(cache.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (age < CACHE_EXPIRY_DAYS) {
      console.log(`[food-search] Cache hit for query='${query}' (age: ${age.toFixed(2)} days)`);
      const allProducts = (cache.results as any)?.products || [];
      const paginated = allProducts.slice((page - 1) * pageSize, page * pageSize);
      return NextResponse.json({
        products: paginated,
        total: allProducts.length,
        page,
        pageSize,
        fromCache: true,
      });
    } else {
      console.log(`[food-search] Cache expired for query='${query}' (age: ${age.toFixed(2)} days)`);
    }
  } else {
    console.log(`[food-search] No cache found for query='${query}'`);
  }

  // Fetch all results from OFF (handle pagination)
  let allProducts: any[] = [];
  let currentPage = 1;
  let totalPages = 1;
  let totalProducts = 0;
  do {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=1000&page=${currentPage}`;
    const res = await fetch(url);
    const data = await res.json();
    if (currentPage === 1) {
      totalProducts = data.count || 0;
      totalPages = Math.ceil(totalProducts / 1000);
      console.log(`[food-search] OFF API reports ${totalProducts} products for query='${query}' (${totalPages} pages)`);
    }
    allProducts = allProducts.concat(data.products || []);
    currentPage++;
  } while (currentPage <= totalPages);

  // Save to cache (per query, page: 0)
  await prisma.foodCache.upsert({
    where: { query_page: { query, page: 0 } },
    update: { results: { products: allProducts } },
    create: { query, page: 0, results: { products: allProducts } },
  });
  console.log(`[food-search] Saved ${allProducts.length} products to cache for query='${query}'`);

  // Return paginated results
  const paginated = allProducts.slice((page - 1) * pageSize, page * pageSize);
  return NextResponse.json({
    products: paginated,
    total: allProducts.length,
    page,
    pageSize,
    fromCache: false,
  });
} 