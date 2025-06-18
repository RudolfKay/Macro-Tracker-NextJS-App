"use client"
import { useState, useEffect } from "react"
import { Plus, Target, Utensils, TrendingUp, Edit2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ModeToggle } from "@/components/mode-toggle"

interface MacroGoals {
  protein: number
  carbs: number
  fat: number
  calories: number
}

interface FoodEntry {
  id: string
  name: string
  protein: number
  carbs: number
  fat: number
  calories: number
  time: string
}

export function Dashboard() {
  const [macroGoals, setMacroGoals] = useState<MacroGoals>({
    protein: 150,
    carbs: 200,
    fat: 65,
    calories: 2000,
  })

  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([
    {
      id: "1",
      name: "Chicken Breast (200g)",
      protein: 46,
      carbs: 0,
      fat: 3,
      calories: 231,
      time: "08:30",
    },
    {
      id: "2",
      name: "Brown Rice (100g)",
      protein: 8,
      carbs: 77,
      fat: 3,
      calories: 362,
      time: "12:15",
    },
  ])

  const [newFood, setNewFood] = useState({
    name: "",
    protein: "",
    carbs: "",
    fat: "",
    calories: "",
  })

  const [isAddingFood, setIsAddingFood] = useState(false)
  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [currentDate, setCurrentDate] = useState<string>("")

  // Set the current date on client side only
  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric"
      })
    )
  }, [])

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

  const addFood = () => {
    if (newFood.name && newFood.protein && newFood.carbs && newFood.fat && newFood.calories) {
      const foodEntry: FoodEntry = {
        id: Date.now().toString(),
        name: newFood.name,
        protein: Number.parseFloat(newFood.protein),
        carbs: Number.parseFloat(newFood.carbs),
        fat: Number.parseFloat(newFood.fat),
        calories: Number.parseFloat(newFood.calories),
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }
      setFoodEntries([...foodEntries, foodEntry])
      setNewFood({ name: "", protein: "", carbs: "", fat: "", calories: "" })
      setIsAddingFood(false)
    }
  }

  const removeFood = (id: string) => {
    setFoodEntries(foodEntries.filter((entry) => entry.id !== id))
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
            <ModeToggle />
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-lg font-semibold">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Macro Goals Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="protein-goal">Protein (g)</Label>
                      <Input
                        id="protein-goal"
                        type="number"
                        value={macroGoals.protein}
                        onChange={(e) =>
                          setMacroGoals({ ...macroGoals, protein: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="carbs-goal">Carbs (g)</Label>
                      <Input
                        id="carbs-goal"
                        type="number"
                        value={macroGoals.carbs}
                        onChange={(e) => setMacroGoals({ ...macroGoals, carbs: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fat-goal">Fat (g)</Label>
                      <Input
                        id="fat-goal"
                        type="number"
                        value={macroGoals.fat}
                        onChange={(e) => setMacroGoals({ ...macroGoals, fat: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="calories-goal">Calories</Label>
                      <Input
                        id="calories-goal"
                        type="number"
                        value={macroGoals.calories}
                        onChange={(e) =>
                          setMacroGoals({ ...macroGoals, calories: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsEditingGoals(false)}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{macroGoals.protein}g</p>
                <p className="text-sm text-muted-foreground">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{macroGoals.carbs}g</p>
                <p className="text-sm text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{macroGoals.fat}g</p>
                <p className="text-sm text-muted-foreground">Fat</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{macroGoals.calories}</p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Today's Progress
            </CardTitle>
            <CardDescription>How close you are to your daily goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Protein: {totals.protein}g / {macroGoals.protein}g
                </span>
                <span>{Math.round((totals.protein / macroGoals.protein) * 100)}%</span>
              </div>
              <Progress value={(totals.protein / macroGoals.protein) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Carbs: {totals.carbs}g / {macroGoals.carbs}g
                </span>
                <span>{Math.round((totals.carbs / macroGoals.carbs) * 100)}%</span>
              </div>
              <Progress value={(totals.carbs / macroGoals.carbs) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Fat: {totals.fat}g / {macroGoals.fat}g
                </span>
                <span>{Math.round((totals.fat / macroGoals.fat) * 100)}%</span>
              </div>
              <Progress value={(totals.fat / macroGoals.fat) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Calories: {totals.calories} / {macroGoals.calories}
                </span>
                <span>{Math.round((totals.calories / macroGoals.calories) * 100)}%</span>
              </div>
              <Progress value={(totals.calories / macroGoals.calories) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Food Log Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-emerald-500" />
                Food Log
              </CardTitle>
              <CardDescription>Track your meals and snacks</CardDescription>
            </div>
            <Dialog open={isAddingFood} onOpenChange={setIsAddingFood}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Food
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Food Entry</DialogTitle>
                  <DialogDescription>Enter the nutritional information for your food</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="food-name">Food Name</Label>
                    <Input
                      id="food-name"
                      placeholder="e.g., Chicken Breast (200g)"
                      value={newFood.name}
                      onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="protein">Protein (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        placeholder="0"
                        value={newFood.protein}
                        onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="carbs">Carbs (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        placeholder="0"
                        value={newFood.carbs}
                        onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fat">Fat (g)</Label>
                      <Input
                        id="fat"
                        type="number"
                        placeholder="0"
                        value={newFood.fat}
                        onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="calories">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        placeholder="0"
                        value={newFood.calories}
                        onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingFood(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addFood}>Add Food</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {foodEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No food entries yet. Start by adding your first meal!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {foodEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{entry.time}</span>
                        <h4 className="font-medium">{entry.name}</h4>
                      </div>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>P: {entry.protein}g</span>
                        <span>C: {entry.carbs}g</span>
                        <span>F: {entry.fat}g</span>
                        <span>{entry.calories} cal</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFood(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
