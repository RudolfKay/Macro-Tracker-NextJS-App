"use client"
import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { useMacroGoal } from "@/hooks/useMacroGoal"
import { useFoodEntries } from "@/hooks/useFoodEntries"
import { DatePickerPopover } from "@/components/dashboard/DatePickerPopover"
import { MacroGoalsCard } from "@/components/dashboard/MacroGoalsCard"
import { ProgressCard } from "@/components/dashboard/ProgressCard"
import { FoodLogCard } from "@/components/dashboard/FoodLogCard"
import { LogOut, User } from "lucide-react"

export function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  // Use today's date in YYYY-MM-DD format
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split("T")[0]
  })

  // Macro goals
  const {
    macroGoal,
    isLoading: isMacroGoalLoading,
    error: macroGoalError,
    setMacroGoal,
    isSetting: isSettingMacroGoal,
  } = useMacroGoal()

  // Food entries
  const {
    foodEntries,
    isLoading: isFoodLoading,
    error: foodError,
    addFoodEntry,
    deleteFoodEntry,
    isAdding,
    isDeleting,
    updateFoodEntry,
  } = useFoodEntries(currentDate)

  // State for editing macro goals
  const [editingGoals, setEditingGoals] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0,
  })
  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (macroGoal) {
      setEditingGoals({
        protein: macroGoal.protein ?? 0,
        carbs: macroGoal.carbs ?? 0,
        fat: macroGoal.fat ?? 0,
        calories: macroGoal.calories ?? 0,
      })
    }
  }, [macroGoal])

  // Calculate totals
  const totals = foodEntries.reduce(
    (acc, entry) => ({
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
      calories: acc.calories + entry.calories,
    }),
    { protein: 0, carbs: 0, fat: 0, calories: 0 },
  )

  // Save macro goals
  const handleSaveGoals = async () => {
    if (editingGoals.protein < 0 || editingGoals.carbs < 0 || editingGoals.fat < 0 || editingGoals.calories < 0) {
      setFormError("All macro goals must be zero or positive numbers.")
      return
    }
    setFormError(null)
    await setMacroGoal(editingGoals)
    setIsEditingGoals(false)
  }

  // Helper function to calculate capped percentage and display value
  const getPercentageDisplay = (current: number, goal: number): string => {
    if (!goal || goal === 0) return "-"
    const percent = Math.round((current / goal) * 100)
    if (!isFinite(percent) || isNaN(percent)) return "-"
    return `${percent}%`
  }

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  // Loading and error states
  if (isMacroGoalLoading || isFoodLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  if (macroGoalError || foodError) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error loading data.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Track your daily macro intake</p>
          </div>
          <div className="flex items-center gap-4">
            <DatePickerPopover currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {session?.user?.name || "User"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {session?.user?.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        </div>
        <MacroGoalsCard
          macroGoal={macroGoal}
          editingGoals={editingGoals}
          setEditingGoals={setEditingGoals}
          isEditingGoals={isEditingGoals}
          setIsEditingGoals={setIsEditingGoals}
          handleSaveGoals={handleSaveGoals}
          isSettingMacroGoal={isSettingMacroGoal}
          formError={formError}
        />
        <ProgressCard totals={totals} macroGoal={macroGoal} getPercentageDisplay={getPercentageDisplay} />
        <FoodLogCard
          foodEntries={foodEntries}
          addFoodEntry={addFoodEntry}
          deleteFoodEntry={deleteFoodEntry}
          isAdding={isAdding}
          isDeleting={isDeleting}
          currentDate={currentDate}
          updateFoodEntry={updateFoodEntry}
        />
      </div>
    </div>
  )
}
