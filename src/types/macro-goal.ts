/**
 * Macro goal model.
 */
export interface MacroGoal {
  id: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

import { z } from "zod";

export const MacroGoalSchema = z.object({
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  calories: z.number().min(0),
});

export type MacroGoalInput = z.infer<typeof MacroGoalSchema>; 