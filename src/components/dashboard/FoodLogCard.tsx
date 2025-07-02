"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Utensils, Trash2, Edit2 } from "lucide-react"
import React, { useState } from "react"
import type { FoodEntry } from "@/types/food-entry"
import { DashboardFormField } from "@/components/dashboard/DashboardFormField"

type FoodLogCardProps = {
  foodEntries: FoodEntry[]
  addFoodEntry: (entry: Omit<FoodEntry, "id" | "time" | "createdAt"> & { time: string; date: string }) => Promise<void>
  deleteFoodEntry: (id: string) => Promise<void>
  isAdding: boolean
  isDeleting: boolean
  currentDate: string
  updateFoodEntry: (entry: FoodEntry) => Promise<void>
}

export const FoodLogCard: React.FC<FoodLogCardProps> = ({
  foodEntries,
  addFoodEntry,
  deleteFoodEntry,
  isAdding,
  isDeleting,
  currentDate,
  updateFoodEntry,
}) => {
  const [isAddingFood, setIsAddingFood] = useState(false)
  const [newFood, setNewFood] = useState({ name: "", protein: "", carbs: "", fat: "", calories: "" })
  const [formError, setFormError] = useState<string | null>(null)
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null)
  const [editFood, setEditFood] = useState({ name: "", protein: "", carbs: "", fat: "", calories: "" })
  const [editError, setEditError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleAddFood = async () => {
    if (
      Number(newFood.protein) < 0 ||
      Number(newFood.carbs) < 0 ||
      Number(newFood.fat) < 0 ||
      Number(newFood.calories) < 0
    ) {
      setFormError("All food entry values must be zero or positive numbers.")
      return
    }
    setFormError(null)
    await addFoodEntry({
      name: newFood.name,
      protein: Number(newFood.protein),
      carbs: Number(newFood.carbs),
      fat: Number(newFood.fat),
      calories: Number(newFood.calories),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      date: currentDate,
    })
    setNewFood({ name: "", protein: "", carbs: "", fat: "", calories: "" })
    setIsAddingFood(false)
  }

  const handleEditClick = (entry: FoodEntry) => {
    setEditingEntry(entry)
    setEditFood({
      name: entry.name,
      protein: entry.protein.toString(),
      carbs: entry.carbs.toString(),
      fat: entry.fat.toString(),
      calories: entry.calories.toString(),
    })
    setEditError(null)
  }

  const handleEditSave = async () => {
    if (
      Number(editFood.protein) < 0 ||
      Number(editFood.carbs) < 0 ||
      Number(editFood.fat) < 0 ||
      Number(editFood.calories) < 0
    ) {
      setEditError("All food entry values must be zero or positive numbers.")
      return
    }
    setEditError(null)
    setIsUpdating(true)
    await updateFoodEntry({
      id: editingEntry!.id,
      name: editFood.name,
      protein: Number(editFood.protein),
      carbs: Number(editFood.carbs),
      fat: Number(editFood.fat),
      calories: Number(editFood.calories),
      time: editingEntry!.time,
      date: currentDate,
      createdAt: editingEntry!.createdAt,
    })
    setIsUpdating(false)
    setEditingEntry(null)
  }

  return (
    <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 p-4 sm:p-6">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
          <DialogContent aria-describedby="add-food-description">
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
              <DialogDescription id="add-food-description">Enter the nutritional information for your food</DialogDescription>
            </DialogHeader>
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">
                {formError}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <DashboardFormField
                label="Food Name"
                id="food-name"
                value={newFood.name}
                onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                placeholder="e.g., Chicken Breast (200g)"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DashboardFormField
                  label="Protein (g)"
                  id="protein"
                  type="number"
                  value={newFood.protein}
                  onChange={e => setNewFood({ ...newFood, protein: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Carbs (g)"
                  id="carbs"
                  type="number"
                  value={newFood.carbs}
                  onChange={e => setNewFood({ ...newFood, carbs: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Fat (g)"
                  id="fat"
                  type="number"
                  value={newFood.fat}
                  onChange={e => setNewFood({ ...newFood, fat: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Calories"
                  id="calories"
                  type="number"
                  value={newFood.calories}
                  onChange={e => setNewFood({ ...newFood, calories: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingFood(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFood} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add Food"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={!!editingEntry} onOpenChange={open => !open && setEditingEntry(null)}>
          <DialogContent aria-describedby="edit-food-description">
            <DialogHeader>
              <DialogTitle>Edit Food Entry</DialogTitle>
              <DialogDescription id="edit-food-description">Update the nutritional information for your food</DialogDescription>
            </DialogHeader>
            {editError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">
                {editError}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <DashboardFormField
                label="Food Name"
                id="edit-food-name"
                value={editFood.name}
                onChange={e => setEditFood({ ...editFood, name: e.target.value })}
                placeholder="e.g., Chicken Breast (200g)"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DashboardFormField
                  label="Protein (g)"
                  id="edit-protein"
                  type="number"
                  value={editFood.protein}
                  onChange={e => setEditFood({ ...editFood, protein: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Carbs (g)"
                  id="edit-carbs"
                  type="number"
                  value={editFood.carbs}
                  onChange={e => setEditFood({ ...editFood, carbs: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Fat (g)"
                  id="edit-fat"
                  type="number"
                  value={editFood.fat}
                  onChange={e => setEditFood({ ...editFood, fat: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Calories"
                  id="edit-calories"
                  type="number"
                  value={editFood.calories}
                  onChange={e => setEditFood({ ...editFood, calories: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingEntry(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
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
            {foodEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{entry.time}</span>
                    {entry.name === "Unknown" ? (
                      <span className="italic text-muted-foreground" aria-label="Unknown food entry">Unknown</span>
                    ) : (
                      <h4 className="font-medium">{entry.name}</h4>
                    )}
                  </div>
                  <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                    <span>P: {entry.protein}g</span>
                    <span>C: {entry.carbs}g</span>
                    <span>F: {entry.fat}g</span>
                    <span>{entry.calories} cal</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(entry)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFoodEntry(entry.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 