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

/**
 * Input type for creating/updating a macro goal.
 */
export type MacroGoalInput = Omit<MacroGoal, "id" | "createdAt" | "updatedAt" | "isActive">; 