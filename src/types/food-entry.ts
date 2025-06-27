/**
 * Food entry model.
 */
export interface FoodEntry {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  time: string;
  date: string;
  createdAt: string;
}

import { z } from "zod";

export const FoodEntrySchema = z.object({
  name: z.string().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  calories: z.number().min(0),
  time: z.string(),
  date: z.string(),
});

export type FoodEntryInput = z.infer<typeof FoodEntrySchema>; 