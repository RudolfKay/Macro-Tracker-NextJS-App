import { z } from "zod";

export const FoodProductSchema = z.object({
  id: z.string().optional(),
  product_name: z.string().optional(),
  generic_name: z.string().optional(),
  brands: z.string().optional(),
  product_quantity: z.number().optional(),
  quantity: z.string().optional(),
  serving_size: z.string().optional(),
  nutriments: z.object({
    proteins_100g: z.number().optional(),
    carbohydrates_100g: z.number().optional(),
    fat_100g: z.number().optional(),
    "energy-kcal_100g": z.number().optional(),
  }).optional(),
});

export type FoodProduct = z.infer<typeof FoodProductSchema>;

export const FoodSearchResultSchema = z.object({
  products: z.array(FoodProductSchema),
  total: z.number(),
  fromCache: z.boolean().optional(),
});

export type FoodSearchResult = z.infer<typeof FoodSearchResultSchema>; 