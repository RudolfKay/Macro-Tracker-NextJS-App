"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Edit2, Target } from "lucide-react"
import { DashboardFormField } from "@/components/dashboard/DashboardFormField"
import type { MacroGoal } from "@/types/macro-goal";
type MacroGoals = Pick<MacroGoal, 'protein' | 'carbs' | 'fat' | 'calories'>;

interface MacroGoalsCardProps {
  macroGoal: MacroGoals | null | undefined
  editingGoals: MacroGoals
  setEditingGoals: (goals: MacroGoals) => void
  isEditingGoals: boolean
  setIsEditingGoals: (open: boolean) => void
  handleSaveGoals: () => void
  isSettingMacroGoal: boolean
  formError?: string | null
}

export const MacroGoalsCard = ({
  macroGoal,
  editingGoals,
  setEditingGoals,
  isEditingGoals,
  setIsEditingGoals,
  handleSaveGoals,
  isSettingMacroGoal,
  formError,
}: MacroGoalsCardProps) => (
  <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 p-4 sm:p-6">
    <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-500" />
          Daily Macro Goals
        </CardTitle>
        <CardDescription>Your personalized nutrition targets</CardDescription>
      </div>

      <Dialog open={isEditingGoals} onOpenChange={setIsEditingGoals}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Goals
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Macro Goals</DialogTitle>
            <DialogDescription>Update your daily macro and calorie targets</DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">
              {formError}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DashboardFormField
                label="Protein (g)"
                id="protein-goal"
                type="number"
                value={editingGoals.protein}
                onChange={e => setEditingGoals({ ...editingGoals, protein: Number.parseInt(e.target.value) || 0 })}
                min={0}
                required
              />
              <DashboardFormField
                label="Carbs (g)"
                id="carbs-goal"
                type="number"
                value={editingGoals.carbs}
                onChange={e => setEditingGoals({ ...editingGoals, carbs: Number.parseInt(e.target.value) || 0 })}
                min={0}
                required
              />
              <DashboardFormField
                label="Fat (g)"
                id="fat-goal"
                type="number"
                value={editingGoals.fat}
                onChange={e => setEditingGoals({ ...editingGoals, fat: Number.parseInt(e.target.value) || 0 })}
                min={0}
                required
              />
              <DashboardFormField
                label="Calories"
                id="calories-goal"
                type="number"
                value={editingGoals.calories}
                onChange={e => setEditingGoals({ ...editingGoals, calories: Number.parseInt(e.target.value) || 0 })}
                min={0}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingGoals(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoals} disabled={isSettingMacroGoal}>
              {isSettingMacroGoal ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{macroGoal?.protein ?? 0}g</p>
          <p className="text-sm text-muted-foreground">Protein</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{macroGoal?.carbs ?? 0}g</p>
          <p className="text-sm text-muted-foreground">Carbs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{macroGoal?.fat ?? 0}g</p>
          <p className="text-sm text-muted-foreground">Fat</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{macroGoal?.calories ?? 0}</p>
          <p className="text-sm text-muted-foreground">Calories</p>
        </div>
      </div>
    </CardContent>
  </Card>
) 