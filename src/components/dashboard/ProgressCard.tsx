"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"
import type { MacroGoal } from "@/types/macro-goal";
type MacroGoals = Pick<MacroGoal, 'protein' | 'carbs' | 'fat' | 'calories'>;

interface ProgressCardProps {
  totals: MacroGoals
  macroGoal: MacroGoals | null | undefined
  getPercentageDisplay: (current: number, goal: number) => string
}

export const ProgressCard = ({ totals, macroGoal, getPercentageDisplay }: ProgressCardProps) => (
  <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-emerald-500" />
        Today's Progress
      </CardTitle>
      <CardDescription>How close you are to your daily goals</CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">
      {/* Protein */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>
            Protein: {totals.protein}g / {macroGoal?.protein ?? 0}g
          </span>
          <span>{getPercentageDisplay(totals.protein, macroGoal?.protein ?? 0)}</span>
        </div>
        <Progress
          value={macroGoal?.protein ? Math.min((totals.protein / macroGoal.protein) * 100, 100) : 0}
          className="h-2"
        />
      </div>

      {/* Carbs */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>
            Carbs: {totals.carbs}g / {macroGoal?.carbs ?? 0}g
          </span>
          <span>{getPercentageDisplay(totals.carbs, macroGoal?.carbs ?? 0)}</span>
        </div>
        <Progress
          value={macroGoal?.carbs ? Math.min((totals.carbs / macroGoal.carbs) * 100, 100) : 0}
          className="h-2"
        />
      </div>

      {/* Fat */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>
            Fat: {totals.fat}g / {macroGoal?.fat ?? 0}g
          </span>
          <span>{getPercentageDisplay(totals.fat, macroGoal?.fat ?? 0)}</span>
        </div>
        <Progress
          value={macroGoal?.fat ? Math.min((totals.fat / macroGoal.fat) * 100, 100) : 0}
          className="h-2"
        />
      </div>

      {/* Calories */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>
            Calories: {totals.calories} / {macroGoal?.calories ?? 0}
          </span>
          <span>{getPercentageDisplay(totals.calories, macroGoal?.calories ?? 0)}</span>
        </div>
        <Progress
          value={macroGoal?.calories ? Math.min((totals.calories / macroGoal.calories) * 100, 100) : 0}
          className="h-2"
        />
      </div>
    </CardContent>
  </Card>
) 