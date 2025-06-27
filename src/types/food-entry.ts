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

/**
 * Input type for creating/updating a food entry.
 */
export type FoodEntryInput = Omit<FoodEntry, "id" | "createdAt">; 